"""
Medical-Grade OCR Service - Optimized Tesseract for Blood Gas Reports
======================================================================

100% LOCAL - No HTTP/Cloud dependencies.

This module provides OCR optimized for blood gas report photos with:
- Adaptive preprocessing for different image qualities
- Multiple OCR passes with different settings
- Medical-specific regex parsing for blood gas values

Supports Radiometer ABL800 FLEX and similar medical analyzer printouts.
"""

import base64
import re
import logging
from typing import Optional, List, Dict, Any, Tuple
from dataclasses import dataclass, asdict, field

import cv2
import numpy as np
import pytesseract

logger = logging.getLogger(__name__)

# Confidence threshold for warning about poor OCR quality
LOW_CONFIDENCE_THRESHOLD = 0.6


# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class OCRBlock:
    """Represents a single text block from OCR"""
    text: str
    confidence: float
    bbox: List[float] = field(default_factory=list)


@dataclass
class OCRResult:
    """Result from OCR"""
    success: bool
    ocr_text: str
    ocr_blocks: List[OCRBlock]
    avg_confidence: float
    lines: List[str] = field(default_factory=list)
    key_metrics: Dict[str, Any] = field(default_factory=dict)
    error_message: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "ocr_text": self.ocr_text,
            "ocr_blocks": [asdict(b) for b in self.ocr_blocks],
            "avg_confidence": self.avg_confidence,
            "confidence_avg": self.avg_confidence,
            "lines": self.lines,
            "key_metrics": self.key_metrics,
            "error_message": self.error_message,
            "engine": "tesseract_medical"
        }


# ============================================================================
# IMAGE PREPROCESSING
# ============================================================================

def decode_base64_image(image_b64: str) -> np.ndarray:
    """Decode base64 image to OpenCV format."""
    if "," in image_b64:
        image_b64 = image_b64.split(",")[1]
    img_bytes = base64.b64decode(image_b64)
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")
    return img


def preprocess_simple(img: np.ndarray) -> np.ndarray:
    """Simple preprocessing - just grayscale."""
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


def preprocess_clahe(img: np.ndarray, scale: float = 1.5) -> np.ndarray:
    """Light upscale with CLAHE contrast enhancement - best for most blood gas reports."""
    h, w = img.shape[:2]
    if scale != 1.0:
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(gray)


def preprocess_denoise(img: np.ndarray) -> np.ndarray:
    """Denoise preprocessing for noisy images."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)


def preprocess_bloodgas_image(image_b64: str) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Generate multiple preprocessed versions of the image for OCR.
    Returns tuple of (simple, clahe, denoised) versions.
    """
    img = decode_base64_image(image_b64)
    return (
        preprocess_simple(img),
        preprocess_clahe(img, scale=1.5),
        preprocess_denoise(img)
    )


# ============================================================================
# METRIC EXTRACTION - Medical-specific regex patterns
# ============================================================================

METRIC_PATTERNS: Dict[str, Dict[str, Any]] = {
    'pH': {
        'patterns': [
            r'pH\s*\(?T?\)?\s*:?\s*([67]\.\d{1,3})',
            r'DH\s+([67]\.\d{1,3})',  # OCR error for pH
            r'PCO[,2]?\s+([67]\.\d{1,3})',  # Sometimes pH value appears after PCO label
        ],
        'range': (6.5, 8.0),
        'flags': re.IGNORECASE,
    },
    'pCO2': {
        'patterns': [
            r'pCO[,2]?\s*\(?T?\s*\)?\s*:?\s*(\d{1,3}\.?\d*)\s*(?:mmHg|mm)',
            r'PO[,2]?\s+(\d{2,3}\.\d)\s+(?:Hg|mmHg)',  # PO, 47.5 Hg pattern
            r'pCO2\s*:?\s*(\d{1,3}\.?\d*)',
        ],
        'range': (10, 150),
        'flags': re.IGNORECASE,
    },
    'pO2': {
        'patterns': [
            r'pO[,2]?\s*\(?T?\)?\s*[:\s]+(\d{2,3})\s*(?:mmHg|mm|nie)',  # pO(T) 110 mmHg
            r'Oximetry\s+Values\s+(\d{2,3})',  # Value after Oximetry Values label
            r'pO2\s*:?\s*(\d{1,3}\.?\d*)',
        ],
        'range': (10, 600),
        'flags': re.IGNORECASE,
    },
    'HCO3': {
        'patterns': [
            r'[cC]?HCO3?[-]?\s*[:\(]?\s*P?\s*,?\s*st?\s*\)?\s*c?\s*:?\s*(\d{1,2}\.?\d*)',
            r'HCO3\s*(\d{1,2}\.?\d*)',
            r'Bicarb[^0-9]*(\d{1,2}\.?\d*)',
        ],
        'range': (5, 60),
        'flags': re.IGNORECASE,
    },
    'BE': {
        'patterns': [
            r'[cC]?Base\s*\(?[Ee]?[Cc]?[Ff]?\)?\s*[cC]?\s*:?\s*([-+]?\d{1,2}\.?\d*)',
            r'BE[cC]?\s*:?\s*([-+]?\d{1,2}\.?\d*)',
            r'Base\s*Excess[^0-9]*([-+]?\d{1,2}\.?\d*)',
        ],
        'range': (-30, 30),
        'flags': re.IGNORECASE,
    },
    'Na': {
        'patterns': [
            r'[cC]?Na[t+]?\s*:?\s*(\d{2,3})(?:\s*(?:mmol|mmo))?',
            r'Sodium[^0-9]*(\d{2,3})',
            r'3Na[t+]?\s*(\d{2,3})',  # OCR misread cNa as 3Na
        ],
        'range': (100, 180),
        'flags': 0,
    },
    'K': {
        'patterns': [
            r'[cC>]?K[t+*]?\s*:?\s*(\d\.\d{1,2})(?:\s*(?:mmol|mmo))?',
            r'Potassium[^0-9]*(\d\.\d{1,2})',
        ],
        'range': (1.0, 10.0),
        'flags': 0,
    },
    'Cl': {
        'patterns': [
            r'[cCes]?Cl[-]?\s*:?\s*(\d{2,3})(?:\s*(?:mmol|mmo))?',
            r'Chloride[^0-9]*(\d{2,3})',
        ],
        'range': (70, 150),
        'flags': 0,
    },
    'Ca': {
        'patterns': [
            r'[cCes]?Ca2?\+?\s*:?\s*(\d\.\d{1,2})(?:\s*(?:mmol|mmo))?',
            r'Calcium[^0-9]*(\d\.\d{1,2})',
            r'5Ca2?\+?\s*(\d\.\d{1,2})',  # OCR misread
        ],
        'range': (0.5, 3.0),
        'flags': 0,
    },
    'Hb': {
        'patterns': [
            r'[cCes]?t?[Hh][bB]\s*:?\s*(\d{1,2}\.?\d*)(?:\s*g/[dD]L)?',
            r'ctHb\s*(\d{1,2}\.?\d*)',
            r'StHb\s*(\d{1,2}\.?\d*)',  # OCR error
            r'Hemoglobin[^0-9]*(\d{1,2}\.?\d*)',
        ],
        'range': (3, 25),
        'flags': re.IGNORECASE,
    },
    'SO2': {
        'patterns': [
            r's[oO]2\s*:?\s*(\d{1,3}\.?\d*)(?:\s*%)?',
            r'30[,2]?\s*(\d{1,3}\.?\d*)\s*%',  # OCR error for sO2
            r'Saturation[^0-9]*(\d{1,3}\.?\d*)',
        ],
        'range': (0, 100),
        'flags': 0,
    },
    'lactate': {
        'patterns': [
            r'[cCes]?Lac\s*:?\s*(\d{1,2}\.?\d*)(?:\s*(?:mmol|mmo))?',
            r'slac\s*(\d{1,2}\.?\d*)',  # OCR error
            r'eLac\s*(\d{1,2}\.?\d*)',  # OCR error
            r'Lactate[^0-9]*(\d{1,2}\.?\d*)',
        ],
        'range': (0, 30),
        'flags': re.IGNORECASE,
    },
    'glucose': {
        'patterns': [
            r'[cCes]?Glu\s*:?\s*(\d{1,3}\.?\d*)(?:\s*(?:mmol|mmo))?',
            r'eGlu\s*(\d{1,3}\.?\d*)',  # OCR error
            r'Glucose[^0-9]*(\d{1,3}\.?\d*)',
        ],
        'range': (0.5, 50),
        'flags': re.IGNORECASE,
    },
    'FiO2': {
        'patterns': [
            r'F[iI][oO]2\s*:?\s*(\d{1,3}\.?\d*)(?:\s*%)?',
        ],
        'range': (21, 100),
        'flags': 0,
    },
    'Hct': {
        'patterns': [
            r'[Hh]ct\s*:?\s*(\d{1,2}\.?\d*)(?:\s*%)?',
            r'Hematocrit[^0-9]*(\d{1,2}\.?\d*)',
        ],
        'range': (10, 70),
        'flags': re.IGNORECASE,
    },
    'ctO2': {
        'patterns': [
            r'[cCes]?tO2[cC]?\s*:?\s*(\d{1,2}\.?\d*)(?:\s*Vol%)?',
            r'LC\s*(\d{1,2}\.?\d*)\s*Vol%',  # OCR error
        ],
        'range': (5, 30),
        'flags': 0,
    },
    'Bilirubin': {
        'patterns': [
            r'[cCes]?t?Bil\s*:?\s*(\d{1,3}\.?\d*)(?:\s*(?:umol|µmol))?',
            r'stBil\s*(\d{1,3}\.?\d*)',
        ],
        'range': (0, 500),
        'flags': re.IGNORECASE,
    },
    'FO2Hb': {
        'patterns': [
            r'F[oO]2?[Hh][bB]\s*:?\s*(\d{1,3}\.?\d*)(?:\s*%)?',
        ],
        'range': (0, 100),
        'flags': 0,
    },
    'FCOHb': {
        'patterns': [
            r'F?COHb\s*:?\s*(\d{1,2}\.?\d*)(?:\s*%)?',
            r'~COHb\s*(\d{1,2}\.?\d*)',  # OCR error
        ],
        'range': (0, 100),
        'flags': 0,
    },
    'FMetHb': {
        'patterns': [
            r'F?Met[Hh][bB]\s*:?\s*(\d{1,2}\.?\d*)(?:\s*%)?',
        ],
        'range': (0, 100),
        'flags': 0,
    },
}


def extract_metrics(lines: List[str]) -> Dict[str, Any]:
    """
    Parse common blood gas parameters from OCR lines.
    Uses consolidated pattern matching for cleaner, more maintainable code.
    """
    metrics = {}
    full_text = ' '.join(lines)
    
    for metric_name, config in METRIC_PATTERNS.items():
        if metric_name in metrics:
            continue
            
        min_val, max_val = config['range']
        flags = config.get('flags', 0)
        
        for pattern in config['patterns']:
            try:
                match = re.search(pattern, full_text, flags)
                if match:
                    val = float(match.group(1))
                    if min_val <= val <= max_val:
                        metrics[metric_name] = val
                        break
            except (ValueError, IndexError):
                continue
    
    return metrics


def parse_blood_gas_from_ocr_text(ocr_text: str) -> Dict[str, Any]:
    """
    Parse blood gas values from raw OCR text.
    This is an alias for extract_metrics but works on raw text.
    """
    lines = [line.strip() for line in ocr_text.split('\n') if line.strip()]
    return extract_metrics(lines)


# ============================================================================
# MAIN OCR FUNCTION
# ============================================================================

def run_tesseract(processed_img: np.ndarray, psm_mode: int = 4, language: str = "eng") -> Tuple[str, float, List[OCRBlock]]:
    """
    Run Tesseract OCR on a processed image.
    
    Returns:
        Tuple of (full_text, avg_confidence, blocks)
    """
    # PSM 4: Assume a single column of text of variable sizes
    # This works best for medical report layouts
    config = f'--psm {psm_mode} --oem 3'
    
    # Get detailed data with confidence scores
    data = pytesseract.image_to_data(
        processed_img, 
        lang=language, 
        config=config,
        output_type=pytesseract.Output.DICT
    )
    
    blocks = []
    confidences = []
    
    for i, conf in enumerate(data['conf']):
        if conf > 0:
            text = data['text'][i].strip()
            if text:
                blocks.append(OCRBlock(
                    text=text,
                    confidence=float(conf) / 100.0,
                    bbox=[
                        float(data['left'][i]),
                        float(data['top'][i]),
                        float(data['width'][i]),
                        float(data['height'][i])
                    ]
                ))
                confidences.append(float(conf))
    
    # Get full text
    full_text = pytesseract.image_to_string(processed_img, lang=language, config=config)
    
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
    
    return full_text, avg_confidence, blocks


async def perform_ocr(
    image_base64: str,
    language: str = "eng",
    enhanced: bool = True,
    psm_mode: int = 4,
    **kwargs
) -> OCRResult:
    """
    Perform OCR on a base64-encoded image using Tesseract.
    
    Uses multiple preprocessing approaches and selects the best result
    based on metrics extraction success.
    
    Args:
        image_base64: Base64-encoded image data
        language: Tesseract language code (default: "eng")
        enhanced: Whether to try multiple preprocessing approaches (default: True)
        psm_mode: Tesseract Page Segmentation Mode (default: 4 - single column)
    
    Returns:
        OCRResult with extracted text, confidence, and parsed metrics
    """
    try:
        if enhanced:
            # Try multiple preprocessing approaches
            simple, clahe, denoised = preprocess_bloodgas_image(image_base64)
            
            best_result = None
            best_metric_count = -1
            
            # Test each preprocessing with PSM 4 (best for columnar medical reports)
            for name, processed in [("clahe", clahe), ("simple", simple), ("denoised", denoised)]:
                try:
                    full_text, avg_conf, blocks = run_tesseract(processed, psm_mode=4, language=language)
                    lines = [line.strip() for line in full_text.split('\n') if line.strip()]
                    metrics = extract_metrics(lines)
                    
                    # Score: metric count + confidence bonus
                    score = len(metrics) * 10 + avg_conf
                    
                    if score > best_metric_count:
                        best_metric_count = score
                        best_result = (full_text, avg_conf, blocks, lines, metrics)
                except Exception as e:
                    logger.warning(f"OCR pass {name} failed: {e}")
                    continue
            
            if best_result:
                full_text, avg_conf, blocks, lines, metrics = best_result
            else:
                # Fallback to simple grayscale if all enhanced methods failed
                full_text, avg_conf, blocks = run_tesseract(simple, psm_mode=4, language=language)
                lines = [line.strip() for line in full_text.split('\n') if line.strip()]
                metrics = extract_metrics(lines)
        else:
            # Basic decode without preprocessing
            img = decode_base64_image(image_base64)
            processed = preprocess_simple(img)
            full_text, avg_conf, blocks = run_tesseract(processed, psm_mode=psm_mode, language=language)
            lines = [line.strip() for line in full_text.split('\n') if line.strip()]
            metrics = extract_metrics(lines)
        
        return OCRResult(
            success=True,
            ocr_text=full_text,
            ocr_blocks=blocks,
            avg_confidence=avg_conf / 100.0,  # Normalize to 0-1
            lines=lines,
            key_metrics=metrics
        )
        
    except Exception as e:
        logger.error(f"OCR failed: {str(e)}")
        return OCRResult(
            success=False,
            ocr_text="",
            ocr_blocks=[],
            avg_confidence=0.0,
            error_message=str(e)
        )


# ============================================================================
# QUALITY CHECK
# ============================================================================

def check_ocr_quality(result: OCRResult) -> Dict[str, Any]:
    """
    Evaluate the quality of OCR results.
    
    Returns a dict with:
    - quality_score: 0-1 overall quality
    - is_acceptable: whether quality meets minimum threshold
    - issues: list of detected problems
    """
    issues = []
    scores = []
    
    # 1. Check confidence score
    conf_score = result.avg_confidence
    scores.append(conf_score)
    if conf_score < 0.5:
        issues.append("Low OCR confidence - image may be blurry or low quality")
    
    # 2. Check if we got any text
    text_score = 1.0 if result.ocr_text.strip() else 0.0
    scores.append(text_score)
    if text_score == 0:
        issues.append("No text detected in image")
    
    # 3. Check if we extracted key medical metrics
    metric_count = len(result.key_metrics)
    expected_min = 3  # At least pH, pCO2, pO2
    metric_score = min(1.0, metric_count / expected_min)
    scores.append(metric_score)
    if metric_count < expected_min:
        issues.append(f"Only {metric_count} metrics extracted - expected at least {expected_min}")
    
    # Calculate overall quality
    quality_score = sum(scores) / len(scores) if scores else 0.0
    
    return {
        "quality_score": quality_score,
        "is_acceptable": quality_score >= 0.5,
        "confidence": result.avg_confidence,
        "metrics_found": metric_count,
        "issues": issues
    }
