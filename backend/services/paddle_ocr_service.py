"""
Local OCR Service - 100% Local Implementation using Tesseract
==============================================================

This module provides OCR using pytesseract (Tesseract OCR) directly,
with NO external HTTP calls, Docker, or cloud dependencies.

DEVELOPER NOTES:
----------------
- OCR runs entirely within this Python process using Tesseract
- No network calls, no cloud dependencies
- Supports English and Arabic languages
- Uses Tesseract 5.x with LSTM engine for best accuracy

Usage in Workflows:
-------------------
Old: User uploads image → Gemini Vision → extracted text → clinical reasoning
New: User uploads image → LocalOCR (Tesseract) → ocr_text → existing clinical reasoning prompts

Available Variables for Downstream Prompts:
-------------------------------------------
- ocr_text: The full extracted text string
- ocr_blocks: List of text blocks with confidence scores
- avg_confidence: Average confidence across all blocks (0-100 scale, converted to 0-1)
- success: Boolean indicating if OCR succeeded

Quality Guidelines:
-------------------
- avg_confidence >= 0.7: Good quality, proceed with processing
- avg_confidence < 0.7: Suggest user to take a clearer photo
- Empty result: Show "Could not read image" error
"""

import base64
import io
import logging
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict, field

logger = logging.getLogger(__name__)


@dataclass
class OCRBlock:
    """Represents a single text block from OCR"""
    text: str
    confidence: float
    bbox: List[float] = field(default_factory=list)


@dataclass
class OCRResult:
    """Result from local OCR"""
    success: bool
    ocr_text: str
    ocr_blocks: List[OCRBlock]
    avg_confidence: float
    error_message: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "ocr_text": self.ocr_text,
            "ocr_blocks": [asdict(b) for b in self.ocr_blocks],
            "avg_confidence": self.avg_confidence,
            "confidence_avg": self.avg_confidence,  # Alias for compatibility
            "error_message": self.error_message
        }


def local_tesseract_ocr(
    image_base64: str,
    language: str = 'en'
) -> OCRResult:
    """
    Local OCR extraction from base64 image using Tesseract.
    
    100% local - no HTTP calls, no cloud dependencies.
    
    Args:
        image_base64: Base64 encoded image (with or without data URL prefix)
        language: Language code - 'en', 'arabic', or 'en+ar'
        
    Returns:
        OCRResult with extracted text, blocks, and confidence
    """
    try:
        import pytesseract
        from PIL import Image
        
        # Clean base64 if it has data URL prefix
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        
        # Decode base64 to image
        try:
            image_data = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
        except Exception as e:
            logger.error(f"Failed to decode image: {e}")
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="Could not read image. Please ensure the image is valid."
            )
        
        # Map language codes to Tesseract codes
        lang_map = {
            'en': 'eng',
            'english': 'eng',
            'ar': 'ara',
            'arabic': 'ara',
            'en+ar': 'eng+ara',
            'multilingual': 'eng+ara'
        }
        tess_lang = lang_map.get(language.lower(), 'eng')
        
        # Run OCR with detailed output
        try:
            # Get detailed data with confidence scores
            data = pytesseract.image_to_data(image, lang=tess_lang, output_type=pytesseract.Output.DICT)
            
            # Parse results
            blocks = []
            full_text = []
            confidences = []
            
            n_boxes = len(data['text'])
            for i in range(n_boxes):
                text = data['text'][i].strip()
                conf = float(data['conf'][i])
                
                if text and conf > 0:  # Filter out empty and low-confidence
                    full_text.append(text)
                    
                    # Get bounding box
                    x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
                    bbox = [float(x), float(y), float(x + w), float(y + h)]
                    
                    blocks.append(OCRBlock(
                        text=text,
                        confidence=conf / 100.0,  # Convert to 0-1 scale
                        bbox=bbox
                    ))
                    confidences.append(conf / 100.0)
            
            # Also get plain text for completeness
            plain_text = pytesseract.image_to_string(image, lang=tess_lang)
            
        except Exception as e:
            logger.error(f"OCR processing failed: {e}")
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="Could not process image. Try brighter lighting, steady hand, full text visible."
            )
        
        # Calculate average confidence
        avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
        
        # Use plain text if structured parsing gave empty result
        final_text = ' '.join(full_text) if full_text else plain_text.strip()
        
        # Check for empty result
        if not final_text:
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="Could not read image. Try brighter lighting, steady hand, full text visible."
            )
        
        return OCRResult(
            success=True,
            ocr_text=final_text,
            ocr_blocks=blocks,
            avg_confidence=avg_conf
        )
        
    except ImportError as e:
        logger.error(f"Tesseract import error: {e}")
        return OCRResult(
            success=False,
            ocr_text="",
            ocr_blocks=[],
            avg_confidence=0.0,
            error_message="OCR library not available. Please contact support."
        )
    except Exception as e:
        logger.error(f"Unexpected OCR error: {e}")
        return OCRResult(
            success=False,
            ocr_text="",
            ocr_blocks=[],
            avg_confidence=0.0,
            error_message="Could not read image. Try brighter lighting, steady hand, full text visible."
        )


async def perform_paddle_ocr(
    image_base64: str,
    language: str = "en",
    return_bboxes: bool = False
) -> OCRResult:
    """
    Async wrapper for local OCR (using Tesseract).
    
    This is the main entry point for OCR in the application.
    Runs OCR in a thread pool to avoid blocking the event loop.
    
    Note: Function name kept as perform_paddle_ocr for API compatibility,
    but now uses Tesseract internally for better stability.
    
    Args:
        image_base64: Base64 encoded image
        language: Language code - 'en', 'arabic', or 'multilingual'
        return_bboxes: Whether to include bounding boxes (always included now)
        
    Returns:
        OCRResult with extracted text, blocks, and confidence
    """
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    
    # Run OCR in thread pool (CPU-intensive operation)
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=1) as executor:
        result = await loop.run_in_executor(
            executor,
            local_tesseract_ocr,
            image_base64,
            language
        )
    
    return result


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


# Confidence threshold for quality check
LOW_CONFIDENCE_THRESHOLD = 0.7

def check_ocr_quality(result: OCRResult) -> dict:
    """
    Check OCR quality and provide recommendations.
    
    Args:
        result: OCRResult from perform_paddle_ocr
        
    Returns:
        Dictionary with quality assessment and recommendations
    """
    if not result.success:
        return {
            "quality": "failed",
            "recommendation": result.error_message or "Could not read image.",
            "should_retry": True
        }
    
    if result.avg_confidence < LOW_CONFIDENCE_THRESHOLD:
        return {
            "quality": "low",
            "recommendation": f"OCR confidence is low ({result.avg_confidence:.0%}). Please take a clearer photo with better lighting.",
            "should_retry": True,
            "confidence": result.avg_confidence
        }
    
    return {
        "quality": "good",
        "recommendation": None,
        "should_retry": False,
        "confidence": result.avg_confidence
    }
