"""
Chandra OCR Service - 100% Local Implementation using datalab-to/chandra
=========================================================================

This module provides OCR using the Chandra Vision2Seq model directly,
with NO external HTTP calls, Docker, or cloud dependencies.

Model: datalab-to/chandra (Hugging Face)
- Vision-to-Sequence model optimized for document OCR
- Runs locally using transformers library
- Supports markdown output for structured text extraction

DEVELOPER NOTES:
----------------
- OCR runs entirely within this Python process
- Model is loaded once and cached for subsequent requests
- No network calls after initial model download
- GPU accelerated if available, falls back to CPU

Usage in Workflows:
-------------------
User uploads image → ChandraOCR → ocr_text → clinical reasoning prompts

Available Variables for Downstream Prompts:
-------------------------------------------
- ocr_text: The full extracted text string (plain text)
- ocr_markdown: The raw markdown output from Chandra
- avg_confidence: Estimated confidence based on output length
- success: Boolean indicating if OCR succeeded
"""

import base64
import io
import logging
import re
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict, field

logger = logging.getLogger(__name__)

# Global model cache
_chandra_processor = None
_chandra_model = None
_model_loading = False


@dataclass
class OCRBlock:
    """Represents a single text block from OCR"""
    text: str
    confidence: float
    bbox: List[float] = field(default_factory=list)


@dataclass
class OCRResult:
    """Result from Chandra OCR"""
    success: bool
    ocr_text: str
    ocr_markdown: str
    ocr_blocks: List[OCRBlock]
    avg_confidence: float
    error_message: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "ocr_text": self.ocr_text,
            "ocr_markdown": self.ocr_markdown,
            "ocr_blocks": [asdict(b) for b in self.ocr_blocks],
            "avg_confidence": self.avg_confidence,
            "confidence_avg": self.avg_confidence,  # Alias for compatibility
            "error_message": self.error_message,
            "engine": "chandra_local"
        }


def _load_chandra_model():
    """
    Load the Chandra model and processor. Called once and cached.
    """
    global _chandra_processor, _chandra_model, _model_loading
    
    if _chandra_processor is not None and _chandra_model is not None:
        return _chandra_processor, _chandra_model
    
    if _model_loading:
        # Wait for model to finish loading in another thread
        import time
        while _model_loading:
            time.sleep(0.1)
        return _chandra_processor, _chandra_model
    
    _model_loading = True
    
    try:
        from transformers import AutoProcessor, AutoModelForVision2Seq
        import torch
        
        logger.info("Loading Chandra OCR model (datalab-to/chandra)...")
        
        # Determine device
        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {device}")
        
        # Load processor and model
        _chandra_processor = AutoProcessor.from_pretrained("datalab-to/chandra")
        _chandra_model = AutoModelForVision2Seq.from_pretrained(
            "datalab-to/chandra",
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            low_cpu_mem_usage=True
        )
        
        # Move model to device
        _chandra_model = _chandra_model.to(device)
        _chandra_model.eval()
        
        logger.info("Chandra OCR model loaded successfully")
        
        return _chandra_processor, _chandra_model
        
    except Exception as e:
        logger.error(f"Failed to load Chandra model: {e}")
        _model_loading = False
        raise
    finally:
        _model_loading = False


def chandra_ocr_local(
    image_base64: str,
    language: str = 'en'
) -> OCRResult:
    """
    Local OCR extraction from base64 image using Chandra model.
    
    100% local - no HTTP calls after model is downloaded.
    
    Args:
        image_base64: Base64 encoded image (with or without data URL prefix)
        language: Language code (currently Chandra supports multilingual)
        
    Returns:
        OCRResult with extracted text, markdown, and confidence
    """
    try:
        from PIL import Image
        import torch
        
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
                ocr_markdown="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="Could not read image. Please ensure the image is valid."
            )
        
        # Load model (cached after first call)
        try:
            processor, model = _load_chandra_model()
        except Exception as e:
            logger.error(f"Model loading failed: {e}")
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_markdown="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="OCR model not available. Please try again later."
            )
        
        # Get device from model
        device = next(model.parameters()).device
        
        # Process image
        try:
            inputs = processor(images=image, return_tensors="pt")
            inputs = {k: v.to(device) for k, v in inputs.items()}
            
            # Generate OCR output
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=2048,
                    do_sample=False,
                    num_beams=1
                )
            
            # Decode output
            result_text = processor.batch_decode(outputs, skip_special_tokens=True)
            ocr_markdown = result_text[0] if result_text else ""
            
        except Exception as e:
            logger.error(f"OCR processing failed: {e}")
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_markdown="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="Could not process image. Try brighter lighting, steady hand, full text visible."
            )
        
        # Convert markdown to plain text
        ocr_text = ocr_markdown.replace('\n', ' ').strip()
        # Remove markdown formatting
        ocr_text = re.sub(r'\*+', '', ocr_text)
        ocr_text = re.sub(r'#+\s*', '', ocr_text)
        ocr_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', ocr_text)
        ocr_text = re.sub(r'\s+', ' ', ocr_text).strip()
        
        # Check for empty result
        if not ocr_text or len(ocr_text) < 5:
            return OCRResult(
                success=False,
                ocr_text="",
                ocr_markdown="",
                ocr_blocks=[],
                avg_confidence=0.0,
                error_message="Could not read image. Try brighter lighting, steady hand, full text visible."
            )
        
        # Create blocks from text (single block for now)
        blocks = [OCRBlock(
            text=ocr_text,
            confidence=0.85,  # Chandra doesn't provide confidence, use default
            bbox=[]
        )]
        
        # Estimate confidence based on output length and content
        # Longer, more structured output = higher confidence
        estimated_confidence = min(0.95, 0.7 + (len(ocr_text) / 1000) * 0.25)
        
        return OCRResult(
            success=True,
            ocr_text=ocr_text,
            ocr_markdown=ocr_markdown,
            ocr_blocks=blocks,
            avg_confidence=estimated_confidence
        )
        
    except ImportError as e:
        logger.error(f"Import error: {e}")
        return OCRResult(
            success=False,
            ocr_text="",
            ocr_markdown="",
            ocr_blocks=[],
            avg_confidence=0.0,
            error_message="OCR library not available. Please contact support."
        )
    except Exception as e:
        logger.error(f"Unexpected OCR error: {e}")
        return OCRResult(
            success=False,
            ocr_text="",
            ocr_markdown="",
            ocr_blocks=[],
            avg_confidence=0.0,
            error_message="Could not read image. Try brighter lighting, steady hand, full text visible."
        )


async def perform_chandra_ocr(
    image_base64: str,
    language: str = "en",
    return_bboxes: bool = False
) -> OCRResult:
    """
    Async wrapper for Chandra OCR.
    
    This is the main entry point for OCR in the application.
    Runs OCR in a thread pool to avoid blocking the event loop.
    
    Args:
        image_base64: Base64 encoded image
        language: Language code (Chandra is multilingual)
        return_bboxes: Whether to include bounding boxes (not supported by Chandra)
        
    Returns:
        OCRResult with extracted text, markdown, and confidence
    """
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    
    # Run OCR in thread pool (CPU/GPU-intensive operation)
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=1) as executor:
        result = await loop.run_in_executor(
            executor,
            chandra_ocr_local,
            image_base64,
            language
        )
    
    return result


# Alias for backward compatibility
perform_paddle_ocr = perform_chandra_ocr


def parse_blood_gas_from_ocr_text(text: str) -> dict:
    """
    Parse blood gas values from OCR text.
    This function is used after OCR to extract structured data.
    
    Args:
        text: Raw OCR text
        
    Returns:
        Dictionary with parsed blood gas values
    """
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
        result: OCRResult from perform_chandra_ocr
        
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
