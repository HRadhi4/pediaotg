# PaddleOCR Integration Documentation

## Overview

This document describes the OCR integration changes made to replace Gemini/Tesseract OCR with a local PaddleOCR HTTP service.

## Updated Workflow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User uploads   │ ──► │  LocalPaddleOCR  │ ──► │  LLM Reasoning  │
│  image          │     │  (text extract)  │     │  (if needed)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  ocr_text    │
                        │  ocr_blocks  │
                        │  confidence  │
                        └──────────────┘
```

**Key Change**: OCR is now done by a local PaddleOCR service, NOT by Gemini or Tesseract.

## Tool Definition

### LocalPaddleOCR

| Property | Value |
|----------|-------|
| **Name** | LocalPaddleOCR |
| **Method** | POST |
| **URL (Dev)** | http://localhost:8081/ocr |
| **URL (Prod)** | Configure via `PADDLE_OCR_URL` env var |

### Request Fields

| Field | Type | Description |
|-------|------|-------------|
| `image_base64` | string | Base64 encoded image (with or without data URL prefix) |
| `language` | string | `"en"`, `"ar"`, or `"en+ar"` |
| `return_bboxes` | boolean | Whether to return bounding box information |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `text` | string | Full extracted text as a single string |
| `blocks` | array | Array of text blocks with bbox and confidence |
| `blocks[].text` | string | Text content of the block |
| `blocks[].bbox` | array | Bounding box `[x1, y1, x2, y2]` |
| `blocks[].confidence` | float | Confidence score (0-1) |

## Backend Endpoints

### 1. Generic OCR Endpoint

**`POST /api/ocr`**

General-purpose OCR endpoint using local PaddleOCR service.

```json
// Request
{
  "image_base64": "BASE64_ENCODED_IMAGE",
  "language": "en",
  "return_bboxes": false
}

// Response
{
  "success": true,
  "ocr_text": "extracted text...",
  "ocr_blocks": [...],
  "confidence_avg": 0.95,
  "engine": "paddle_ocr"
}
```

### 2. Blood Gas Image Analysis (Local Only)

**`POST /api/blood-gas/analyze-image-offline`**

Pure PaddleOCR mode - no external API calls.

### 3. Blood Gas Image Analysis (Smart Mode)

**`POST /api/blood-gas/analyze-image`**

PaddleOCR + optional LLM-assisted parsing for complex cases.

**Note**: LLM is used for **parsing assistance only**, NOT for OCR.

## Replaced OCR Steps

| Original | New |
|----------|-----|
| Tesseract OCR (server-side) | LocalPaddleOCR |
| Gemini Vision (image to text) | LocalPaddleOCR |
| LLM-based OCR | LocalPaddleOCR → LLM parsing (text only) |

## Available Variables for Downstream Prompts

| Variable | Type | Description |
|----------|------|-------------|
| `ocr_text` | string | Full extracted text from PaddleOCR |
| `ocr_blocks` | array | Text blocks with bounding boxes and confidence |
| `ocr_success` | boolean | Whether OCR succeeded |
| `confidence_avg` | float | Average confidence across all blocks |

## Error Handling

When PaddleOCR fails, the API returns:

```json
{
  "success": false,
  "ocr_text": "",
  "ocr_blocks": [],
  "confidence_avg": 0.0,
  "error_message": "The local OCR engine could not read this image. Please try a clearer photo or different angle."
}
```

Error scenarios:
- **Service unavailable**: PaddleOCR service not running
- **Timeout**: Image processing took too long
- **Empty result**: No text detected in image
- **Connection error**: Cannot reach the service

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PADDLE_OCR_URL` | `http://localhost:8081/ocr` | PaddleOCR service URL |
| `PADDLE_OCR_TIMEOUT` | `30` | Request timeout in seconds |

### Production Setup

For production, update `PADDLE_OCR_URL` to point to your internal PaddleOCR service:

```bash
PADDLE_OCR_URL=http://paddleocr-service.internal:8081/ocr
```

## Files Modified

| File | Changes |
|------|---------|
| `/app/backend/services/paddle_ocr_service.py` | **NEW** - PaddleOCR client service |
| `/app/backend/server.py` | Replaced Tesseract/Gemini OCR with PaddleOCR |
| `/app/backend/.env` | Added `PADDLE_OCR_URL` configuration |
| `/app/frontend/src/components/BloodGasDialog.jsx` | Updated UI labels and endpoints |

## Running PaddleOCR Service

The PaddleOCR service should expose:

```
POST http://localhost:8081/ocr
```

Example Docker setup:

```bash
docker run -p 8081:8081 your-paddleocr-image
```

Or Python service:

```python
from flask import Flask, request, jsonify
from paddleocr import PaddleOCR

app = Flask(__name__)
ocr = PaddleOCR(use_angle_cls=True, lang='en')

@app.route('/ocr', methods=['POST'])
def perform_ocr():
    data = request.json
    image_base64 = data['image_base64']
    # ... process image with PaddleOCR
    return jsonify({
        "text": "...",
        "blocks": [...]
    })
```

## Testing

Test the OCR endpoint:

```bash
curl -X POST http://localhost:8001/api/ocr \
  -H "Content-Type: application/json" \
  -d '{
    "image_base64": "YOUR_BASE64_IMAGE",
    "language": "en",
    "return_bboxes": false
  }'
```
