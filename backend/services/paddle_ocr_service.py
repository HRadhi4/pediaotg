"""
PaddleOCR Service Integration
=============================

This module provides integration with a local PaddleOCR HTTP service for text extraction
from images (prescriptions, notes, PDFs, etc.).

DEVELOPER NOTES:
----------------
- OCR is now done by a local PaddleOCR HTTP service, NOT Gemini or Tesseract
- The PaddleOCR service must be running at the configured URL
- All image OCR calls go through this service
- LLM (Gemini) is still used for clinical reasoning AFTER OCR extracts text

API Contract (PaddleOCR Service):
---------------------------------
URL: http://localhost:8081/ocr (dev) or PADDLE_OCR_URL env var (prod)
Method: POST
Request:
{
    "image_base64": "BASE64_ENCODED_IMAGE",
    "language": "en" | "ar" | "en+ar",
    "return_bboxes": true | false
}
Response (success):
{
    "text": "full extracted text as a single string",
    "blocks": [
        {
            "text": "line or block text",
            "bbox": [x1, y1, x2, y2],
            "confidence": 0.97
        }
    ]
}

Exposed Variables for Downstream Prompts:
-----------------------------------------
- ocr_text: The full extracted text string
- ocr_blocks: List of text blocks with bounding boxes and confidence
- ocr_success: Boolean indicating if OCR succeeded
- confidence_avg: Average confidence across all blocks

Workflow:
---------
1. User uploads or captures an image
2. Image → LocalPaddleOCR → get ocr_text
3. ocr_text passed into existing LLM prompts for interpretation, dosing, suggestions
"""

import httpx
import os
import logging
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict

# Configuration
PADDLE_OCR_URL = os.getenv("PADDLE_OCR_URL", "http://localhost:8081/ocr")
PADDLE_OCR_TIMEOUT = int(os.getenv("PADDLE_OCR_TIMEOUT", "30"))

logger = logging.getLogger(__name__)


@dataclass
class OCRBlock:
    """Represents a single text block from OCR"""
    text: str
    bbox: List[float]  # [x1, y1, x2, y2]
    confidence: float


@dataclass
class OCRResult:
    """Result from PaddleOCR service"""
    success: bool
    ocr_text: str
    ocr_blocks: List[OCRBlock]
    confidence_avg: float
    error_message: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "ocr_text": self.ocr_text,
            "ocr_blocks": [asdict(b) for b in self.ocr_blocks],
            "confidence_avg": self.confidence_avg,
            "error_message": self.error_message
        }


async def perform_paddle_ocr(
    image_base64: str,
    language: str = "en",
    return_bboxes: bool = False
) -> OCRResult:
    """
    Perform OCR using the local PaddleOCR service.
    
    Args:
        image_base64: Base64 encoded image (with or without data URL prefix)
        language: Language code - "en", "ar", or "en+ar"
        return_bboxes: Whether to return bounding box information
        
    Returns:
        OCRResult with extracted text, blocks, and confidence
    """
    # Clean base64 if it has data URL prefix
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]
    
    request_body = {
        "image_base64": image_base64,
        "language": language,
        "return_bboxes": return_bboxes
    }
    
    try:
        async with httpx.AsyncClient(timeout=PADDLE_OCR_TIMEOUT) as client:
            response = await client.post(PADDLE_OCR_URL, json=request_body)
            
            if response.status_code != 200:
                error_msg = f"PaddleOCR service returned status {response.status_code}"
                logger.error(error_msg)
                return OCRResult(
                    success=False,
                    ocr_text="",
                    ocr_blocks=[],
                    confidence_avg=0.0,
                    error_message="The local OCR engine could not read this image. Please try a clearer photo or different angle."
                )
            
            data = response.json()
            
            # Extract text
            ocr_text = data.get("text", "")
            
            # Parse blocks if available
            ocr_blocks = []
            confidences = []
            for block in data.get("blocks", []):
                ocr_blocks.append(OCRBlock(
                    text=block.get("text", ""),
                    bbox=block.get("bbox", [0, 0, 0, 0]),
                    confidence=block.get("confidence", 0.0)
                ))
                confidences.append(block.get("confidence", 0.0))
            
            # Calculate average confidence
            confidence_avg = sum(confidences) / len(confidences) if confidences else 0.0
            
            # Check for empty text
            if not ocr_text.strip():
                return OCRResult(
                    success=False,
                    ocr_text="",
                    ocr_blocks=ocr_blocks,
                    confidence_avg=confidence_avg,
                    error_message="The local OCR engine could not read this image. Please try a clearer photo or different angle."
                )
            
            return OCRResult(
                success=True,
                ocr_text=ocr_text,
                ocr_blocks=ocr_blocks,
                confidence_avg=confidence_avg
            )
            
    except httpx.TimeoutException:
        logger.error("PaddleOCR service timeout")
        return OCRResult(
            success=False,
            ocr_text="",
            ocr_blocks=[],
            confidence_avg=0.0,
            error_message="The local OCR engine timed out. Please try again or use a smaller image."
        )
    except httpx.ConnectError:
        logger.error(f"Cannot connect to PaddleOCR service at {PADDLE_OCR_URL}")
        return OCRResult(
            success=False,
            ocr_text="",
            ocr_blocks=[],
            confidence_avg=0.0,
            error_message="The local OCR service is unavailable. Please ensure the service is running."
        )
    except Exception as e:
        logger.error(f"PaddleOCR error: {str(e)}")
        return OCRResult(
            success=False,
            ocr_text="",
            ocr_blocks=[],
            confidence_avg=0.0,
            error_message="The local OCR engine could not read this image. Please try a clearer photo or different angle."
        )


def parse_blood_gas_from_ocr_text(text: str) -> dict:
    """
    Parse blood gas values from OCR text.
    This function is used after OCR to extract structured data.
    
    Args:
        text: Raw OCR text
        
    Returns:
        Dictionary with parsed blood gas values
    """
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
