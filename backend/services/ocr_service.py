"""
Medical-Grade OCR Service - Optimized for Blood Gas Reports
============================================================

100% LOCAL - No HTTP/Cloud dependencies.

This module provides OCR optimized for blood gas report photos with:
- Adaptive preprocessing for different image qualities
- Multiple OCR passes with different settings
- Highly robust regex parsing for blood gas values
- Handles OCR errors and misreadings common in medical reports

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
    """Light upscale with CLAHE contrast enhancement."""
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
    """Generate multiple preprocessed versions."""
    img = decode_base64_image(image_b64)
    return (
        preprocess_simple(img),
        preprocess_clahe(img, scale=1.5),
        preprocess_denoise(img)
    )


# ============================================================================
# IMPROVED METRIC EXTRACTION
# ============================================================================

def extract_value_near_label(text: str, label_pattern: str, value_pattern: str, 
                             min_val: float, max_val: float, 
                             search_window: int = 50) -> Optional[float]:
    """
    Extract a numeric value that appears near a label.
    Handles OCR errors by being flexible with pattern matching.
    """
    # Find all matches of the label
    for label_match in re.finditer(label_pattern, text, re.IGNORECASE):
        # Search in a window after the label
        start = label_match.end()
        end = min(start + search_window, len(text))
        window = text[start:end]
        
        # Look for value pattern
        val_match = re.search(value_pattern, window)
        if val_match:
            try:
                val = float(val_match.group(1))
                if min_val <= val <= max_val:
                    return val
            except (ValueError, IndexError):
                continue
    return None


def extract_metrics_improved(ocr_text: str) -> Dict[str, Any]:
    """
    Improved extraction with multiple strategies for each metric.
    Handles common OCR errors in medical reports.
    """
    metrics = {}
    text = ocr_text
    
    # Normalize common OCR errors
    text_normalized = text.replace(',', '.').replace('|', '1').replace('O', '0').replace('l', '1')
    
    # ================== pH ==================
    # Common OCR patterns: "pH 7.456", "pH T 456)", "pH(T) 7.318", "py 7.3196", "? pH(T ) 7.196"
    if 'pH' not in metrics:
        patterns = [
            r'[?\s]*pH?\s*[\(\[]?\s*T?\s*[\)\]]?\s*[:\|]?\s*([67][\.\,]\d{2,4})',  # pH(T) 7.196, py 7.3196
            r'pH\s*[T\(\)]?\s*[:\s]*([67][\.\,]?\d{2,3})',
            r'([67][\.\,]\d{3,4})\s*[\|\]]',  # 7.3196 |
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                # Handle cases like "73196" -> "7.3196" -> "7.32"
                if '.' not in val_str and len(val_str) >= 4:
                    val_str = val_str[0] + '.' + val_str[1:]
                try:
                    val = float(val_str)
                    # Round to 3 decimal places
                    if 6.5 <= val <= 8.0:
                        metrics['pH'] = round(val, 3)
                        break
                except ValueError:
                    continue
    
    # ================== pCO2 ==================
    # Common OCR patterns: "pCO2 31.6", "poo, 341.6", "pCO,(T) 25.9", "pCO{T ) 25.9)", "PCO, 7.198"
    if 'pCO2' not in metrics:
        patterns = [
            r'pCO[2,\{]?\s*[\(\[]?\s*T?\s*[\)\]\}]?\s*[:\|]?\s*(\d{2,3}[\.\,]?\d*)\s*(?:mmHg|mm|\))?',
            r'p[cC][oO0][2,]?\s*\(?[T\)]?\s*[:\s]*(\d{1,3}[\.\,]?\d*)\s*(?:mmHg|mm)?',
            r'poo[,\.]?\s*(\d{1,3}[\.\,]?\d*)',  # OCR error
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    # Skip if this looks like pH (7.xxx)
                    if 7.0 <= val <= 7.8:
                        continue
                    # Handle OCR adding extra digit: "341.6" -> "31.6"
                    if val > 150 and val < 1000:
                        val = val / 10
                    if 10 <= val <= 150:
                        metrics['pCO2'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== pO2 ==================
    # Common OCR patterns: "pO2 166", "? pO, 166", "pO2(T) 95.2", "OT) 95.2", "pO(T ) 110"
    if 'pO2' not in metrics:
        patterns = [
            r'p?[oO0][2,\(]?\s*T?\s*[\)\]]?\s*[:\|]?\s*(\d{2,3}[\.\,]?\d*)\s*(?:mmHg|mm)?',
            r'[?\s]?p[oO0][2,]?\s*\(?[T\)]?\s*[:\s]*(\d{2,3}[\.\,]?\d*)',
            r'OT\)\s*(\d{2,3}[\.\,]\d*)',  # OCR error for pO2(T)
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 10 <= val <= 700:
                        metrics['pO2'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== HCO3 ==================
    # Common patterns: "cHCO3-(P,st) 23.5", "cH20,(P,st)o 15.4", "cHOO, (7,80. 23.6", "cHCO,(P,st)¢ 15.8"
    if 'HCO3' not in metrics:
        patterns = [
            r'c?H[CO0]{1,3}[O032\-,]?\s*[\(\[]?P?,?\s*st\s*[\)\]][oc¢]?\s*[:\s]*(\d{1,2}[\.\,]\d)',
            r'cH[2O0]{1,2}[,O0]?\s*[\(\[]?P?,?\s*st\s*[\)\]]?[oc]?\s*(\d{1,2}[\.\,]\d)',
            r'HCO3[\-]?\s*[:\s]*(\d{1,2}[\.\,]\d)',
            r'Bicarb[^\d]*(\d{1,2}[\.\,]\d)',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 5 <= val <= 45:
                        metrics['HCO3'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== Base Excess (BE) ==================
    # Common patterns: "cBase(Ef) -1.3", "cBase(Ecf)> -12.0", "cBase(Ecf)> "12.0" (quote = minus)
    if 'BE' not in metrics:
        patterns = [
            r'c?Base\s*[\(\[]?\s*E[cf]{1,2}f?\s*[\)\]][oc>]?\s*[:\s]*[""]?(\-?\d{1,2}[\.\,]?\d*)',
            r'c?Base\s*[\(\[]?\s*E[cf]{1,2}f?\s*[\)\]][oc>]?\s*[:\s]*([\-\+]?\d{1,2}[\.\,]?\d*)',
            r'oBase[^\d]*([\-\+]?\d{1,2}[\.\,]?\d*)',
            r'BE\s*[:\s]*([\-\+]?\d{1,2}[\.\,]?\d*)',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.').replace('"', '-').replace('"', '-')
                try:
                    val = float(val_str)
                    if -30 <= val <= 30:
                        metrics['BE'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== Sodium (Na) ==================
    # Common patterns: "cNa+ 134", "cNat 134", "oNat 135"
    if 'Na' not in metrics:
        patterns = [
            r'[co]?Na[t\+]?\s*[:\s]*(\d{3})[\.\,]?\s*(?:mmol)?',
            r'Sodium[^\d]*(\d{3})',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                try:
                    val = float(match.group(1))
                    if 100 <= val <= 180:
                        metrics['Na'] = round(val, 0)
                        break
                except ValueError:
                    continue
    
    # ================== Potassium (K) ==================
    # Common patterns: "cK+ 4.9", "? cK 4.9", "ckK* 3.7", "3k+ 3.9"
    if 'K' not in metrics:
        patterns = [
            r'[?3co]?\s*[ck]?K[\+\*]?\s*[:\s]*(\d[\.\,]\d)',
            r'[?co]?\s*[ck]K[\+\*]?\s*(\d[\.\,]\d)\s*mmol',
            r'Potassium[^\d]*(\d[\.\,]\d)',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 1.5 <= val <= 10.0:
                        metrics['K'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== Calcium (Ca) ==================
    # Common patterns: "cCa2+ 1.37", "? cCa 1.37", "cia 1.36", "Ca?" 431" (needs decimal fix)
    if 'Ca' not in metrics:
        patterns = [
            r'[?sco]?\s*c?[Cc]a2?[\+\?"]?\s*[:\s]*(\d[\.\,]\d{1,2})',
            r'[Cc]a[\?"]?\s*(\d{3})\s*mmol',  # Ca?" 431 -> 1.31
            r'cia\s*(\d[\.\,]\d{1,2})',  # OCR error
            r'Calcium[^\d]*(\d[\.\,]\d{1,2})',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    # Handle 3-digit values like 431 -> 1.31
                    if val > 10:
                        val = val / 100.0
                    if 0.5 <= val <= 3.0:
                        metrics['Ca'] = round(val, 2)
                        break
                except ValueError:
                    continue
    
    # ================== Chloride (Cl) ==================
    # Common patterns: "Cl- 107", "cCl- 107", "oc: 102", "scl 1412" (needs digit fix)
    if 'Cl' not in metrics:
        patterns = [
            r'[sco]?[Cc]l[\-]?\s*[:\s]*(\d{2,4})',
            r'oc:\s*(\d{2,3})',  # OCR error
            r'Chloride[^\d]*(\d{2,3})',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                try:
                    val = float(match.group(1))
                    # Handle extra digits like 1412 -> 112
                    if val > 200:
                        val_str = str(int(val))
                        if len(val_str) == 4 and val_str[0] == '1':
                            val = float(val_str[1:])  # Remove leading 1
                    if 70 <= val <= 130:
                        metrics['Cl'] = round(val, 0)
                        break
                except ValueError:
                    continue
    
    # ================== Hemoglobin (Hb) ==================
    # Common patterns: "ctHb 7.41", "» ctHb 7.41", "Cthb 12.4", "StHb", "30, 1.0 y/dl"
    if 'Hb' not in metrics:
        patterns = [
            r'[»\sSs]?[cCsS]?t?[Hh][bB]\s*[:\s]*(\d{1,2}[\.\,]?\d*)\s*(?:g/?[dD]?[lL]?|y/?[dD]?[lL]?)?',
            r'Hemoglobin[^\d]*(\d{1,2}[\.\,]\d)',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 3 <= val <= 25:
                        metrics['Hb'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== Oxygen Saturation (SO2/sO2) ==================
    # Common patterns: "sO2 99.3%", "[ sO, 99.", "sO, O6.2"
    if 'SO2' not in metrics:
        patterns = [
            r's[oO0][2,]?\s*[:\s]*(\d{2,3}[\.\,]?\d*)\s*%?',
            r'Saturation[^\d]*(\d{2,3}[\.\,]?\d*)',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.').replace('O', '0')
                try:
                    val = float(val_str)
                    if 0 <= val <= 100:
                        metrics['SO2'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== Lactate ==================
    # Common patterns: "cLac 0.9", "? clec 0.", "clac"
    if 'lactate' not in metrics:
        patterns = [
            r'[?co]?\s*c?[Ll]ac\s*[:\s]*(\d{1,2}[\.\,]?\d*)\s*(?:mmol)?',
            r'clec\s*(\d[\.\,]\d)',  # OCR error
            r'Lactate[^\d]*(\d{1,2}[\.\,]\d)',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 0 <= val <= 30:
                        metrics['lactate'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== Glucose ==================
    # Common patterns: "cGlu 6.7", "Glu 67", "eGiu . 4"
    if 'glucose' not in metrics:
        patterns = [
            r'[ce]?[Gg][il]u\s*[:\s]*(\d{1,3}[\.\,]?\d*)\s*(?:mmol)?',
            r'Glucose[^\d]*(\d{1,3}[\.\,]\d)',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 0.5 <= val <= 50:
                        metrics['glucose'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== Bilirubin ==================
    # Common patterns: "ctBil 5", "ctB! &"
    if 'Bilirubin' not in metrics:
        patterns = [
            r'ct?[Bb]il?\s*[:\s]*(\d{1,3})\s*(?:umol|µmol)?',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                try:
                    val = float(match.group(1))
                    if 0 <= val <= 500:
                        metrics['Bilirubin'] = round(val, 0)
                        break
                except ValueError:
                    continue
    
    # ================== FO2Hb ==================
    if 'FO2Hb' not in metrics:
        patterns = [
            r'F[oO0][2,]?[Hh][bB]\s*[:\s]*(\d{2,3}[\.\,]?\d*)\s*%?',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 0 <= val <= 100:
                        metrics['FO2Hb'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== FCOHb ==================
    if 'FCOHb' not in metrics:
        patterns = [
            r'F?C[oO0][Hh][bB]\s*[:\s]*(\d{1,2}[\.\,]?\d*)\s*%?',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 0 <= val <= 100:
                        metrics['FCOHb'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== FMetHb ==================
    if 'FMetHb' not in metrics:
        patterns = [
            r'F?M[ea]t[Hh][bB]\s*[:\s]*(\d{1,2}[\.\,]?\d*)\s*%?',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 0 <= val <= 100:
                        metrics['FMetHb'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    # ================== ctO2 (Total Oxygen Content) ==================
    if 'ctO2' not in metrics:
        patterns = [
            r'[lc]?[tl]?[oO0]2?[,c]?\s*[:\s]*(\d{1,2}[\.\,]\d)\s*(?:Vol%|vol)?',
        ]
        for pat in patterns:
            match = re.search(pat, text, re.IGNORECASE)
            if match:
                val_str = match.group(1).replace(',', '.')
                try:
                    val = float(val_str)
                    if 5 <= val <= 30:
                        metrics['ctO2'] = round(val, 1)
                        break
                except ValueError:
                    continue
    
    return metrics


def parse_blood_gas_from_ocr_text(ocr_text: str) -> Dict[str, Any]:
    """Parse blood gas values from raw OCR text."""
    return extract_metrics_improved(ocr_text)


# ============================================================================
# MAIN OCR FUNCTION
# ============================================================================

def run_tesseract(processed_img: np.ndarray, psm_mode: int = 4, language: str = "eng") -> Tuple[str, float, List[OCRBlock]]:
    """Run Tesseract OCR on a processed image."""
    config = f'--psm {psm_mode} --oem 3'
    
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
    Uses multiple preprocessing approaches and selects the best result.
    """
    try:
        if enhanced:
            simple, clahe, denoised = preprocess_bloodgas_image(image_base64)
            
            best_result = None
            best_metric_count = -1
            
            for name, processed in [("clahe", clahe), ("simple", simple), ("denoised", denoised)]:
                try:
                    full_text, avg_conf, blocks = run_tesseract(processed, psm_mode=4, language=language)
                    metrics = extract_metrics_improved(full_text)
                    
                    score = len(metrics) * 10 + avg_conf
                    
                    if score > best_metric_count:
                        best_metric_count = score
                        best_result = (full_text, avg_conf, blocks, metrics)
                except Exception as e:
                    logger.warning(f"OCR pass {name} failed: {e}")
                    continue
            
            if best_result:
                full_text, avg_conf, blocks, metrics = best_result
            else:
                full_text, avg_conf, blocks = run_tesseract(simple, psm_mode=4, language=language)
                metrics = extract_metrics_improved(full_text)
        else:
            img = decode_base64_image(image_base64)
            processed = preprocess_simple(img)
            full_text, avg_conf, blocks = run_tesseract(processed, psm_mode=psm_mode, language=language)
            metrics = extract_metrics_improved(full_text)
        
        lines = [line.strip() for line in full_text.split('\n') if line.strip()]
        
        return OCRResult(
            success=True,
            ocr_text=full_text,
            ocr_blocks=blocks,
            avg_confidence=avg_conf / 100.0,
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
    """Evaluate the quality of OCR results."""
    issues = []
    scores = []
    
    conf_score = result.avg_confidence
    scores.append(conf_score)
    if conf_score < 0.5:
        issues.append("Low OCR confidence - image may be blurry or low quality")
    
    text_score = 1.0 if result.ocr_text.strip() else 0.0
    scores.append(text_score)
    if text_score == 0:
        issues.append("No text detected in image")
    
    metric_count = len(result.key_metrics)
    expected_min = 3
    metric_score = min(1.0, metric_count / expected_min)
    scores.append(metric_score)
    if metric_count < expected_min:
        issues.append(f"Only {metric_count} metrics extracted - expected at least {expected_min}")
    
    quality_score = sum(scores) / len(scores) if scores else 0.0
    
    return {
        "quality_score": quality_score,
        "is_acceptable": quality_score >= 0.5,
        "confidence": result.avg_confidence,
        "metrics_found": metric_count,
        "issues": issues
    }
