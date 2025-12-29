from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
import tempfile
import asyncio
from concurrent.futures import ThreadPoolExecutor

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Thread pool for CPU-intensive OCR tasks
ocr_executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="paddleocr_")

# Global PaddleOCR instance (initialized lazily)
paddle_ocr_instance = None

def get_paddle_ocr():
    """Get or initialize PaddleOCR instance (lazy loading)"""
    global paddle_ocr_instance
    if paddle_ocr_instance is None:
        from paddleocr import PaddleOCR
        paddle_ocr_instance = PaddleOCR(
            use_angle_cls=True,
            lang='en',
            use_gpu=False,
            show_log=False
        )
        logging.info("PaddleOCR model initialized")
    return paddle_ocr_instance

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class BloodGasInput(BaseModel):
    image_base64: Optional[str] = None
    manual_values: Optional[dict] = None

class BloodGasValues(BaseModel):
    pH: Optional[float] = None
    pCO2: Optional[float] = None
    pO2: Optional[float] = None
    HCO3: Optional[float] = None
    BE: Optional[float] = None
    Na: Optional[float] = None
    K: Optional[float] = None
    Cl: Optional[float] = None
    lactate: Optional[float] = None
    Hb: Optional[float] = None

class BloodGasAnalysisRequest(BaseModel):
    values: BloodGasValues

# Add routes
@api_router.get("/")
async def root():
    return {"message": "Pediatrics to Go API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

def perform_paddle_ocr(image_path: str) -> str:
    """Run PaddleOCR on image - runs in thread pool"""
    try:
        ocr = get_paddle_ocr()
        result = ocr.ocr(image_path, cls=True)
        
        # Extract text from OCR result
        if not result or not result[0]:
            return ""
        
        text_lines = []
        for line in result[0]:
            if len(line) >= 2:
                text = line[1][0]  # The text is in the second element
                text_lines.append(text)
        
        return " ".join(text_lines)
    except Exception as e:
        logging.error(f"PaddleOCR error: {e}")
        raise

def parse_blood_gas_from_text(text: str) -> dict:
    """Parse blood gas values from OCR text"""
    import re
    
    values = {}
    text_lower = text.lower()
    
    # Regex patterns for common blood gas parameters
    patterns = {
        'pH': r'ph[:\s]*([0-9]+\.?[0-9]*)',
        'pCO2': r'p?co2[:\s]*([0-9]+\.?[0-9]*)',
        'pO2': r'p?o2[:\s]*([0-9]+\.?[0-9]*)',
        'HCO3': r'hco3?[:\s-]*([0-9]+\.?[0-9]*)',
        'BE': r'be[:\s]*([+-]?[0-9]+\.?[0-9]*)',
        'Na': r'na[+]?[:\s]*([0-9]+\.?[0-9]*)',
        'K': r'k[+]?[:\s]*([0-9]+\.?[0-9]*)',
        'Cl': r'cl[-]?[:\s]*([0-9]+\.?[0-9]*)',
        'lactate': r'lac(?:tate)?[:\s]*([0-9]+\.?[0-9]*)',
        'Hb': r'h[ae]?moglobin|hb|hgb[:\s]*([0-9]+\.?[0-9]*)'
    }
    
    # Valid ranges for sanity checking
    valid_ranges = {
        'pH': (6.5, 8.0),
        'pCO2': (10, 150),
        'pO2': (10, 600),
        'HCO3': (1, 60),
        'BE': (-30, 30),
        'Na': (100, 180),
        'K': (1, 10),
        'Cl': (70, 130),
        'lactate': (0, 30),
        'Hb': (3, 25)
    }
    
    for key, pattern in patterns.items():
        match = re.search(pattern, text_lower, re.IGNORECASE)
        if match and match.group(1):
            try:
                val = float(match.group(1))
                min_val, max_val = valid_ranges.get(key, (0, float('inf')))
                if min_val <= val <= max_val:
                    values[key] = val
            except ValueError:
                continue
    
    return values

@api_router.post("/blood-gas/analyze-image-offline")
async def analyze_blood_gas_image_offline(request: BloodGasInput):
    """Analyze blood gas image using PaddleOCR (offline, no external API)"""
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="Image is required")
    
    try:
        # Clean base64 if it has data URL prefix
        image_data = request.image_base64
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(image_data)
        
        # Save to temporary file for PaddleOCR
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
            tmp_file.write(image_bytes)
            tmp_path = tmp_file.name
        
        try:
            # Run OCR in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            raw_text = await loop.run_in_executor(
                ocr_executor,
                perform_paddle_ocr,
                tmp_path
            )
            
            # Parse blood gas values from OCR text
            extracted_values = parse_blood_gas_from_text(raw_text)
            
            return {
                "success": True,
                "values": extracted_values,
                "raw_text": raw_text,
                "engine": "paddleocr"
            }
        finally:
            # Cleanup temporary file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    except Exception as e:
        logging.error(f"Offline OCR error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

@api_router.post("/blood-gas/analyze-image")
async def analyze_blood_gas_image(request: BloodGasInput):
    """Analyze blood gas image using Gemini AI for OCR"""
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="Image is required")
    
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
        
        api_key = os.getenv("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"blood-gas-{uuid.uuid4()}",
            system_message="""You are a medical OCR specialist. Extract blood gas values from the image.
Return ONLY a JSON object with these fields (use null if not found):
{
  "pH": number or null,
  "pCO2": number or null (mmHg),
  "pO2": number or null (mmHg),
  "HCO3": number or null (mEq/L),
  "BE": number or null (Base Excess),
  "Na": number or null (mEq/L),
  "K": number or null (mEq/L),
  "Cl": number or null (mEq/L),
  "lactate": number or null (mmol/L),
  "Hb": number or null (g/dL - hemoglobin)
}
Do not include any text outside the JSON."""
        ).with_model("gemini", "gemini-2.5-flash")
        
        # Clean base64 if it has data URL prefix
        image_data = request.image_base64
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        image_content = ImageContent(image_base64=image_data)
        user_message = UserMessage(
            text="Extract all blood gas and electrolyte values from this medical lab result image. Return only JSON.",
            file_contents=[image_content]
        )
        
        response = await chat.send_message(user_message)
        
        # Parse the JSON response
        import json
        try:
            # Clean response - remove markdown code blocks if present
            clean_response = response.strip()
            if clean_response.startswith("```"):
                clean_response = clean_response.split("```")[1]
                if clean_response.startswith("json"):
                    clean_response = clean_response[4:]
            clean_response = clean_response.strip()
            if clean_response.endswith("```"):
                clean_response = clean_response[:-3].strip()
            
            extracted_values = json.loads(clean_response)
            return {"success": True, "values": extracted_values}
        except json.JSONDecodeError:
            return {"success": True, "values": {}, "raw_response": response}
            
    except Exception as e:
        logging.error(f"Error analyzing image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/blood-gas/analyze")
async def analyze_blood_gas(request: BloodGasAnalysisRequest):
    """Analyze blood gas values and provide diagnosis"""
    values = request.values.model_dump()
    
    analysis = {
        "primary_disorder": None,
        "compensation": None,
        "is_compensated": False,
        "expected_value": None,
        "expected_label": None,
        "lactic_acidosis": False,
        "anion_gap": None,
        "anion_gap_status": None,
        "cl_na_ratio": None,
        "electrolyte_imbalances": [],
        "recommendations": [],
        "hb_analysis": None
    }
    
    pH = values.get("pH")
    pCO2 = values.get("pCO2")
    HCO3 = values.get("HCO3")
    BE = values.get("BE")
    Na = values.get("Na")
    K = values.get("K")
    Cl = values.get("Cl")
    lactate = values.get("lactate")
    Hb = values.get("Hb")
    
    # Calculate Anion Gap if electrolytes available (without albumin correction)
    if Na and Cl and HCO3:
        anion_gap = Na - (Cl + HCO3)
        analysis["anion_gap"] = round(anion_gap, 1)
        
        if anion_gap > 12:
            analysis["anion_gap_status"] = "Elevated (High Anion Gap)"
        elif anion_gap < 8:
            analysis["anion_gap_status"] = "Low Anion Gap"
        else:
            analysis["anion_gap_status"] = "Normal"
    
    # Cl:Na ratio for metabolic acidosis
    if Na and Cl:
        cl_na_ratio = Cl / Na
        analysis["cl_na_ratio"] = round(cl_na_ratio, 3)
    
    # Primary disorder analysis
    if pH and pCO2 and HCO3:
        # Determine primary disorder
        if pH < 7.35:
            # Acidemia
            if pCO2 > 45:
                analysis["primary_disorder"] = "Respiratory Acidosis"
                # Check compensation - expected HCO3
                expected_hco3 = 24 + ((pCO2 - 40) * 0.1)  # Acute
                analysis["expected_label"] = "HCO3"
                analysis["expected_value"] = f"{expected_hco3:.1f} mEq/L (Acute)"
                if HCO3 > expected_hco3 + 2:
                    analysis["compensation"] = "Metabolic compensation present"
                    analysis["is_compensated"] = True
            elif HCO3 < 22:
                analysis["primary_disorder"] = "Metabolic Acidosis"
                # Check compensation (Winter's formula) - expected pCO2
                expected_pco2 = (1.5 * HCO3) + 8
                analysis["expected_label"] = "pCO2"
                analysis["expected_value"] = f"{expected_pco2:.1f} ± 2 mmHg (Winter's formula: 1.5 × HCO3 + 8)"
                if abs(pCO2 - expected_pco2) <= 2:
                    analysis["compensation"] = "Appropriate respiratory compensation"
                    analysis["is_compensated"] = True
                elif pCO2 < expected_pco2 - 2:
                    analysis["compensation"] = "Additional respiratory alkalosis"
                elif pCO2 > expected_pco2 + 2:
                    analysis["compensation"] = "Additional respiratory acidosis"
        elif pH > 7.45:
            # Alkalemia
            if pCO2 < 35:
                analysis["primary_disorder"] = "Respiratory Alkalosis"
                expected_hco3 = 24 - ((40 - pCO2) * 0.2)  # Acute
                analysis["expected_label"] = "HCO3"
                analysis["expected_value"] = f"{expected_hco3:.1f} mEq/L (Acute)"
                if HCO3 < expected_hco3 - 2:
                    analysis["compensation"] = "Metabolic compensation present"
                    analysis["is_compensated"] = True
            elif HCO3 > 26:
                analysis["primary_disorder"] = "Metabolic Alkalosis"
                expected_pco2 = 40 + (0.7 * (HCO3 - 24))
                analysis["expected_label"] = "pCO2"
                analysis["expected_value"] = f"{expected_pco2:.1f} mmHg (40 + 0.7 × (HCO3 - 24))"
                if abs(pCO2 - expected_pco2) <= 2:
                    analysis["compensation"] = "Appropriate respiratory compensation"
                    analysis["is_compensated"] = True
        else:
            # Normal pH - check for mixed disorder
            if (pCO2 > 45 and HCO3 > 26) or (pCO2 < 35 and HCO3 < 22):
                analysis["primary_disorder"] = "Mixed Disorder (compensated or concurrent)"
            else:
                analysis["primary_disorder"] = "Normal acid-base status"
    
    # Lactic acidosis check
    if lactate and lactate > 2:
        analysis["lactic_acidosis"] = True
        if lactate > 4:
            analysis["recommendations"].append("Severe lactic acidosis - investigate cause (sepsis, hypoperfusion, etc.)")
    
    # Electrolyte imbalances
    if Na:
        if Na < 135:
            analysis["electrolyte_imbalances"].append("Hyponatremia")
        elif Na > 145:
            analysis["electrolyte_imbalances"].append("Hypernatremia")
    
    if K:
        if K < 3.5:
            analysis["electrolyte_imbalances"].append("Hypokalemia")
        elif K > 5.0:
            analysis["electrolyte_imbalances"].append("Hyperkalemia")
    
    if Cl:
        if Cl < 98:
            analysis["electrolyte_imbalances"].append("Hypochloremia")
        elif Cl > 106:
            analysis["electrolyte_imbalances"].append("Hyperchloremia")
    
    # Hemoglobin analysis
    if Hb:
        if Hb < 7:
            analysis["hb_analysis"] = {
                "level": "Severe Anemia",
                "color": "red",
                "message": "Blood transfusion indicated",
                "value": Hb
            }
        elif Hb < 10:
            analysis["hb_analysis"] = {
                "level": "Moderate Anemia", 
                "color": "amber",
                "message": "Consider transfusion based on symptoms",
                "value": Hb
            }
        elif Hb < 12:
            analysis["hb_analysis"] = {
                "level": "Mild Anemia",
                "color": "yellow", 
                "message": "Monitor closely",
                "value": Hb
            }
        elif Hb <= 17:
            analysis["hb_analysis"] = {
                "level": "Normal",
                "color": "green",
                "message": "Normal hemoglobin level",
                "value": Hb
            }
        else:
            analysis["hb_analysis"] = {
                "level": "Elevated",
                "color": "orange",
                "message": "Elevated hemoglobin - investigate cause",
                "value": Hb
            }
    
    return analysis

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
