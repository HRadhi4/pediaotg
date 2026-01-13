"""
Local PaddleOCR Service - 100% Local Implementation
====================================================

This module provides OCR using PaddleOCR Python library directly,
with NO external HTTP calls, Docker, or cloud dependencies.

DEVELOPER NOTES:
----------------
- OCR runs entirely within this Python process using PaddleOCR library
- Models are downloaded once on first use (~100MB, cached locally)
- Supports English ('en'), Arabic ('arabic'), and multilingual
- Uses PP-OCRv4 for best accuracy on noisy/scan images
- GPU acceleration auto-enabled if CUDA available

Usage in Workflows:
-------------------
Old: User uploads image → Gemini Vision → extracted text → clinical reasoning
New: User uploads image → LocalPaddleOCR → ocr_text → existing clinical reasoning prompts

Available Variables for Downstream Prompts:
-------------------------------------------
- ocr_text: The full extracted text string
- ocr_blocks: List of text blocks with confidence scores
- avg_confidence: Average confidence across all blocks (0-1)
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

# Lazy-loaded OCR engine (singleton pattern)
_ocr_engines: Dict[str, Any] = {}


def _get_ocr_engine(language: str = 'en'):
    """
    Get or create PaddleOCR engine for the specified language.
    Uses lazy initialization - models download on first use.
    """
    global _ocr_engines
    
    if language not in _ocr_engines:
        try:
            from paddleocr import PaddleOCR
            import os
            
            # Disable model source check for faster startup
            os.environ['DISABLE_MODEL_SOURCE_CHECK'] = 'True'
            
            # Map language codes
            lang_map = {
                'en': 'en',
                'english': 'en',
                'ar': 'ar',
                'arabic': 'ar',
                'en+ar': 'en',  # Use English, works for mixed
                'multilingual': 'en'
            }
            paddle_lang = lang_map.get(language.lower(), 'en')
            
            logger.info(f"Initializing PaddleOCR engine for language: {paddle_lang}")
            
            # Initialize PaddleOCR with PP-OCRv4
            _ocr_engines[language] = PaddleOCR(
                lang=paddle_lang,
                use_doc_orientation_classify=False,
                use_doc_unwarping=False,
                use_textline_orientation=True,
                ocr_version='PP-OCRv4'
            )
            
            logger.info(f"PaddleOCR engine initialized successfully for {language}")
            
        except Exception as e:
            logger.error(f"Failed to initialize PaddleOCR: {e}")
            raise
    
    return _ocr_engines[language]


@dataclass
class OCRBlock:
    """Represents a single text block from OCR"""
    text: str
    confidence: float
    bbox: List[float] = field(default_factory=list)


@dataclass
class OCRResult:
    """Result from local PaddleOCR"""
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


def local_paddle_ocr(
    image_base64: str,
    language: str = 'en'
) -> OCRResult:
    """
    Local PaddleOCR extraction from base64 image.
    
    100% local - no HTTP calls, no cloud dependencies.
    
    Args:
        image_base64: Base64 encoded image (with or without data URL prefix)
        language: Language code - 'en', 'arabic', or 'multilingual'
        
    Returns:
        OCRResult with extracted text, blocks, and confidence
    """
    try:
        from PIL import Image
        import numpy as np
        
        # Clean base64 if it has data URL prefix
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        
        # Decode base64 to image
        try:
            image_data = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            image_np = np.array(image)
        except Exception as e:
            logger.error(f"Failed to decode image: {e}")
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="Could not read image. Please ensure the image is valid."
            )
        
        # Get OCR engine
        try:
            ocr_engine = _get_ocr_engine(language)
        except Exception as e:
            logger.error(f"OCR engine initialization failed: {e}")
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="OCR engine unavailable. Please try again."
            )
        
        # Run OCR
        try:
            result = ocr_engine.ocr(image_np, cls=True)
        except Exception as e:
            logger.error(f"OCR processing failed: {e}")
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="Could not process image. Try brighter lighting, steady hand, full text visible."
            )
        
        # Parse results
        blocks = []
        full_text = []
        total_conf = 0.0
        count = 0
        
        if result and result[0]:
            for line in result[0]:
                if line and len(line) >= 2:
                    # line format: [[bbox_points], (text, confidence)]
                    bbox_points = line[0] if len(line) > 0 else []
                    text_conf = line[1] if len(line) > 1 else ("", 0.0)
                    
                    if isinstance(text_conf, (list, tuple)) and len(text_conf) >= 2:
                        text = str(text_conf[0])
                        conf = float(text_conf[1])
                    else:
                        continue
                    
                    if text.strip():
                        full_text.append(text)
                        
                        # Convert bbox to simple format [x1, y1, x2, y2]
                        bbox = []
                        if bbox_points and len(bbox_points) >= 4:
                            try:
                                x_coords = [p[0] for p in bbox_points]
                                y_coords = [p[1] for p in bbox_points]
                                bbox = [min(x_coords), min(y_coords), max(x_coords), max(y_coords)]
                            except:
                                bbox = []
                        
                        blocks.append(OCRBlock(
                            text=text,
                            confidence=conf,
                            bbox=bbox
                        ))
                        total_conf += conf
                        count += 1
        
        # Calculate average confidence
        avg_conf = total_conf / count if count > 0 else 0.0
        
        # Check for empty result
        if not full_text:
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="Could not read image. Try brighter lighting, steady hand, full text visible."
            )
        
        return OCRResult(
            success=True,
            ocr_text='\n'.join(full_text),
            ocr_blocks=blocks,
            avg_confidence=avg_conf
        )
        
    except ImportError as e:
        logger.error(f"PaddleOCR import error: {e}")
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
    Async wrapper for local PaddleOCR.
    
    This is the main entry point for OCR in the application.
    Runs OCR in a thread pool to avoid blocking the event loop.
    
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
            local_paddle_ocr,
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
