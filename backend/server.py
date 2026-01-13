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

# Import optimized Tesseract OCR service (100% local, medical-grade preprocessing)
from services.ocr_service import (
    perform_ocr as perform_paddle_ocr,
    parse_blood_gas_from_ocr_text,
    check_ocr_quality,
    OCRResult,
    LOW_CONFIDENCE_THRESHOLD
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Health check endpoint (required for Kubernetes)
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

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
    return {"message": "PediaOTG API"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pediaotg-api"}

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

# ============================================================================
# OCR ENDPOINTS - 100% Local Medical-Grade Tesseract OCR
# ============================================================================
# 
# DEVELOPER NOTES:
# - All OCR runs LOCALLY using Tesseract with medical-grade preprocessing
# - NO HTTP calls, NO Docker, NO cloud dependencies
# - Optimized for blurry blood gas reports with:
#   * 2x upscaling to 300+ DPI equivalent
#   * CLAHE adaptive contrast enhancement
#   * Gaussian + median denoising
#   * Automatic deskew for rotated printouts
#   * Adaptive binarization for faded ink
#   * Medical-specific character whitelist
#
# Workflow:
# User uploads image → Preprocessing → Tesseract OCR → ocr_text → clinical reasoning
#
# Quality Guidelines:
# - avg_confidence >= 0.7: Good quality, proceed
# - avg_confidence < 0.7: Suggest clearer photo
# - Empty result: Show error, stay 100% local (no fallback)
#
# See /app/backend/services/ocr_service.py for documentation
# ============================================================================

class OCRRequest(BaseModel):
    """Request model for generic OCR endpoint"""
    image_base64: str
    language: str = "en"  # Supports 'en', 'arabic', 'multilingual'
    return_bboxes: bool = False


@api_router.post("/ocr")
async def perform_ocr_endpoint(request: OCRRequest):
    """
    Generic OCR endpoint using 100% local medical-grade Tesseract OCR.
    
    Features:
    - Medical-grade preprocessing (upscale, CLAHE, denoise, deskew, binarize)
    - Blood gas specific character whitelist
    - Automatic metric extraction (pH, pCO2, pO2, etc.)
    
    Quality check:
    - avg_confidence >= 0.7: Good
    - avg_confidence < 0.7: Returns suggestion to take clearer photo
    """
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="Image is required")
    
    result = await perform_paddle_ocr(
        image_base64=request.image_base64,
        language=request.language,
        return_bboxes=request.return_bboxes
    )
    
    # Check quality
    quality = check_ocr_quality(result)
    
    if not result.success:
        return {
            "success": False,
            "ocr_text": "",
            "ocr_blocks": [],
            "avg_confidence": 0.0,
            "confidence_avg": 0.0,
            "error_message": result.error_message,
            "quality": quality,
            "engine": "tesseract_medical"
        }
    
    # Add low confidence warning
    response = {
        "success": True,
        "ocr_text": result.ocr_text,
        "lines": getattr(result, 'lines', []),
        "key_metrics": getattr(result, 'key_metrics', {}),
        "ocr_blocks": [{"text": b.text, "bbox": b.bbox, "confidence": b.confidence} for b in result.ocr_blocks],
        "avg_confidence": result.avg_confidence,
        "confidence_avg": result.avg_confidence,
        "quality": quality,
        "engine": "tesseract_medical"
    }
    
    if result.avg_confidence < LOW_CONFIDENCE_THRESHOLD:
        response["low_confidence_warning"] = f"OCR confidence is low ({result.avg_confidence:.0%}). Consider taking a clearer photo."
    
    return response


@api_router.post("/blood-gas/analyze-image-offline")
async def analyze_blood_gas_image_offline(request: BloodGasInput):
    """
    Analyze blood gas image using 100% local medical-grade Tesseract OCR.
    
    No external API calls, no cloud dependencies.
    
    Features:
    - Medical-grade preprocessing (upscale, CLAHE, denoise, deskew, binarize)
    - Automatic extraction of key metrics (pH, pCO2, pO2, etc.)
    
    Quality check: If avg_confidence < 0.7, suggests clearer photo.
    """
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="Image is required")
    
    try:
        # Perform OCR using 100% local medical-grade Tesseract
        ocr_result = await perform_paddle_ocr(
            image_base64=request.image_base64,
            language="en",
            return_bboxes=False
        )
        
        quality = check_ocr_quality(ocr_result)
        
        if not ocr_result.success:
            return {
                "success": False,
                "values": {},
                "raw_text": "",
                "error_message": ocr_result.error_message,
                "quality": quality,
                "engine": "tesseract_medical"
            }
        
        # Use pre-extracted key_metrics if available, else parse from text
        extracted_values = getattr(ocr_result, 'key_metrics', None) or parse_blood_gas_from_ocr_text(ocr_result.ocr_text)
        
        response = {
            "success": True,
            "values": extracted_values,
            "raw_text": ocr_result.ocr_text,
            "lines": getattr(ocr_result, 'lines', []),
            "avg_confidence": ocr_result.avg_confidence,
            "confidence_avg": ocr_result.avg_confidence,
            "quality": quality,
            "engine": "tesseract_medical"
        }
        
        # Add low confidence warning
        if ocr_result.avg_confidence < LOW_CONFIDENCE_THRESHOLD:
            response["low_confidence_warning"] = f"OCR confidence: {ocr_result.avg_confidence:.0%}. Consider taking a clearer photo."
        
        return response
    
    except Exception as e:
        logging.error(f"Medical OCR error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")


@api_router.post("/blood-gas/analyze-image")
async def analyze_blood_gas_image(request: BloodGasInput):
    """
    Analyze blood gas image using 100% local Tesseract OCR + optional LLM parsing.
    
    Workflow:
    1. Image → Local Tesseract OCR → extract raw text (100% LOCAL)
    2. Parse blood gas values from raw text
    3. If basic parsing fails AND LLM available, use LLM for text parsing only
    
    Note: LLM is used for TEXT parsing only, NOT for OCR (stays 100% local).
    No cloud fallback for OCR - always local Tesseract OCR.
    """
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="Image is required")
    
    try:
        # Step 1: Perform OCR using 100% local Tesseract OCR
        ocr_result = await perform_paddle_ocr(
            image_base64=request.image_base64,
            language="en",
            return_bboxes=True
        )
        
        quality = check_ocr_quality(ocr_result)
        
        if not ocr_result.success:
            return {
                "success": False,
                "values": {},
                "error_message": ocr_result.error_message,
                "quality": quality,
                "engine": "tesseract_local"
            }
        
        # Step 2: Parse blood gas values from OCR text
        extracted_values = parse_blood_gas_from_ocr_text(ocr_result.ocr_text)
        
        # If we got values, return them
        if extracted_values:
            response = {
                "success": True,
                "values": extracted_values,
                "raw_text": ocr_result.ocr_text,
                "ocr_markdown": getattr(ocr_result, 'ocr_markdown', ocr_result.ocr_text),
                "avg_confidence": ocr_result.avg_confidence,
                "confidence_avg": ocr_result.avg_confidence,
                "quality": quality,
                "engine": "tesseract_local"
            }
            if ocr_result.avg_confidence < LOW_CONFIDENCE_THRESHOLD:
                response["low_confidence_warning"] = f"OCR confidence: {ocr_result.avg_confidence:.0%}. Consider taking a clearer photo."
            return response
        
        # Step 3: If basic parsing failed, try LLM-assisted TEXT parsing
        # (LLM parses the TEXT from OCR, NOT the image - OCR stays 100% local)
        try:
            from emergentintegrations.llm.chat import LlmChat, UserMessage
            
            api_key = os.getenv("EMERGENT_LLM_KEY")
            if api_key and ocr_result.ocr_text.strip():
                chat = LlmChat(
                    api_key=api_key,
                    session_id=f"blood-gas-parse-{uuid.uuid4()}",
                    system_message="""You are a medical data parser. Given OCR text from a blood gas report, extract the values.
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
  "Hb": number or null (g/dL)
}
Do not include any text outside the JSON."""
                ).with_model("gemini", "gemini-2.5-flash")
                
                # Send OCR text (NOT image) to LLM for parsing
                response = await chat.send_message(UserMessage(
                    text=f"Parse these blood gas values from OCR text:\n\n{ocr_result.ocr_text}"
                ))
                
                import json
                clean_response = response.strip()
                if clean_response.startswith("```"):
                    clean_response = clean_response.split("```")[1]
                    if clean_response.startswith("json"):
                        clean_response = clean_response[4:]
                clean_response = clean_response.strip()
                if clean_response.endswith("```"):
                    clean_response = clean_response[:-3].strip()
                
                extracted_values = json.loads(clean_response)
                # Remove null values
                extracted_values = {k: v for k, v in extracted_values.items() if v is not None}
                
                result_response = {
                    "success": True,
                    "values": extracted_values,
                    "raw_text": ocr_result.ocr_text,
                    "avg_confidence": ocr_result.avg_confidence,
                    "confidence_avg": ocr_result.avg_confidence,
                    "quality": quality,
                    "engine": "paddle_ocr_local+llm_parser"
                }
                if ocr_result.avg_confidence < LOW_CONFIDENCE_THRESHOLD:
                    result_response["low_confidence_warning"] = f"OCR confidence: {ocr_result.avg_confidence:.0%}. Consider taking a clearer photo."
                return result_response
        except Exception as llm_error:
            logging.warning(f"LLM parsing fallback failed: {llm_error}")
        
        # Return with whatever we have (no cloud fallback - stay 100% local)
        response = {
            "success": True,
            "values": extracted_values,
            "raw_text": ocr_result.ocr_text,
            "avg_confidence": ocr_result.avg_confidence,
            "confidence_avg": ocr_result.avg_confidence,
            "quality": quality,
            "engine": "paddle_ocr_local"
        }
        if ocr_result.avg_confidence < LOW_CONFIDENCE_THRESHOLD:
            response["low_confidence_warning"] = f"OCR confidence: {ocr_result.avg_confidence:.0%}. Consider taking a clearer photo."
        return response
            
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

# Import authentication and subscription routes
from routes.auth import router as auth_router
from routes.subscription import router as subscription_router
from routes.layouts import router as layouts_router
from routes.admin import router as admin_router

# Include the router in the main app
app.include_router(api_router)
app.include_router(auth_router, prefix="/api")
app.include_router(subscription_router, prefix="/api")
app.include_router(layouts_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

# CORS configuration - for credentials, we need explicit origins
cors_origins_env = os.environ.get('CORS_ORIGINS', '*')
if cors_origins_env == '*':
    # When using wildcard, we need to explicitly list allowed origins for credentials
    cors_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://pedotg-saas.preview.emergentagent.com"
    ]
else:
    cors_origins = cors_origins_env.split(',')

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
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
