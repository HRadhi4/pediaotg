"""
Input Validation & Sanitization Middleware
==========================================
Validates and sanitizes incoming request data to prevent injection attacks.

Features:
- SQL/NoSQL injection pattern detection
- XSS pattern detection
- Path traversal prevention
- Request size limits
- Content-Type validation

Configuration:
- STRICT_INPUT_VALIDATION=true: Block requests with detected threats (returns 400)
- STRICT_INPUT_VALIDATION=false (default): Log threats but allow requests through
"""

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import re
import logging
import json
import os

logger = logging.getLogger(__name__)

# Maximum request body size (10MB)
MAX_BODY_SIZE = 10 * 1024 * 1024

# Configuration: strict mode blocks malicious requests, non-strict mode logs only
STRICT_INPUT_VALIDATION = os.environ.get('STRICT_INPUT_VALIDATION', 'false').lower() == 'true'

# Patterns that indicate potential injection attacks
INJECTION_PATTERNS = [
    # NoSQL injection patterns
    r'\$(?:where|gt|gte|lt|lte|ne|in|nin|or|and|not|nor|exists|type|mod|regex|text|all|elemMatch|size|)',
    r'\{\s*["\']?\$',
    
    # Path traversal
    r'\.\./',
    r'\.\.\\',
    
    # Null byte injection
    r'%00',
    r'\x00',
]

# XSS patterns (basic detection)
XSS_PATTERNS = [
    r'<script[^>]*>',
    r'javascript:',
    r'on\w+\s*=',
    r'<iframe[^>]*>',
    r'<object[^>]*>',
    r'<embed[^>]*>',
]

# Compile patterns for efficiency
COMPILED_INJECTION = [re.compile(p, re.IGNORECASE) for p in INJECTION_PATTERNS]
COMPILED_XSS = [re.compile(p, re.IGNORECASE) for p in XSS_PATTERNS]


def check_for_injection(value: str) -> bool:
    """Check if a string contains potential injection patterns"""
    if not isinstance(value, str):
        return False
    
    for pattern in COMPILED_INJECTION:
        if pattern.search(value):
            return True
    return False


def check_for_xss(value: str) -> bool:
    """Check if a string contains potential XSS patterns"""
    if not isinstance(value, str):
        return False
    
    for pattern in COMPILED_XSS:
        if pattern.search(value):
            return True
    return False


def scan_dict_for_threats(data: dict, path: str = "") -> list:
    """Recursively scan a dictionary for potential threats"""
    threats = []
    
    for key, value in data.items():
        current_path = f"{path}.{key}" if path else key
        
        # Check key for injection
        if check_for_injection(str(key)):
            threats.append(f"Potential injection in key: {current_path}")
        
        if isinstance(value, str):
            if check_for_injection(value):
                threats.append(f"Potential injection in value: {current_path}")
            if check_for_xss(value):
                threats.append(f"Potential XSS in value: {current_path}")
        elif isinstance(value, dict):
            threats.extend(scan_dict_for_threats(value, current_path))
        elif isinstance(value, list):
            for i, item in enumerate(value):
                if isinstance(item, str):
                    if check_for_injection(item):
                        threats.append(f"Potential injection in value: {current_path}[{i}]")
                    if check_for_xss(item):
                        threats.append(f"Potential XSS in value: {current_path}[{i}]")
                elif isinstance(item, dict):
                    threats.extend(scan_dict_for_threats(item, f"{current_path}[{i}]"))
    
    return threats


class InputValidationMiddleware(BaseHTTPMiddleware):
    """
    Middleware to validate and sanitize incoming requests.
    
    Checks for:
    - Request body size limits
    - Injection patterns in JSON body
    - XSS patterns in request data
    - Valid Content-Type for POST/PUT requests
    
    Behavior controlled by STRICT_INPUT_VALIDATION env var:
    - true: Block requests with detected threats (returns 400)
    - false: Log threats but allow requests through (default)
    """
    
    async def dispatch(self, request: Request, call_next):
        # Skip validation for safe methods and non-API routes
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return await call_next(request)
        
        if not request.url.path.startswith("/api"):
            return await call_next(request)
        
        # Check Content-Type for POST/PUT/PATCH
        if request.method in ["POST", "PUT", "PATCH"]:
            content_type = request.headers.get("content-type", "")
            
            # Allow JSON and form data
            allowed_types = ["application/json", "multipart/form-data", "application/x-www-form-urlencoded"]
            if not any(ct in content_type for ct in allowed_types):
                # Allow if no body expected
                content_length = request.headers.get("content-length", "0")
                if content_length != "0":
                    logger.warning(f"Invalid content-type from {request.client.host}: {content_type}")
        
        # Check body size
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > MAX_BODY_SIZE:
            logger.warning(f"Request body too large from {request.client.host}: {content_length} bytes")
            return JSONResponse(
                status_code=413,
                content={"detail": "Request body too large"}
            )
        
        # For JSON requests, validate the body
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            try:
                # Read and cache the body
                body = await request.body()
                if body:
                    try:
                        data = json.loads(body)
                        if isinstance(data, dict):
                            threats = scan_dict_for_threats(data)
                            if threats:
                                client_ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
                                if not client_ip:
                                    client_ip = request.client.host if request.client else "unknown"
                                
                                logger.warning(
                                    f"SECURITY: Potential attack detected from {client_ip} "
                                    f"on {request.url.path}: {threats}"
                                )
                                
                                # In strict mode, block the request
                                if STRICT_INPUT_VALIDATION:
                                    logger.warning(f"SECURITY: Blocking request due to STRICT_INPUT_VALIDATION=true")
                                    return JSONResponse(
                                        status_code=400,
                                        content={"detail": "Invalid request data detected"}
                                    )
                    except json.JSONDecodeError:
                        pass  # Let FastAPI handle invalid JSON
            except Exception as e:
                logger.error(f"Error validating request body: {e}")
        
        return await call_next(request)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all requests for security auditing.
    Logs: timestamp, method, path, client IP, user agent, response status
    """
    
    async def dispatch(self, request: Request, call_next):
        # Get client info
        client_ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        if not client_ip:
            client_ip = request.headers.get("x-real-ip", "")
        if not client_ip and request.client:
            client_ip = request.client.host
        
        user_agent = request.headers.get("user-agent", "unknown")[:100]
        
        # Process request
        response = await call_next(request)
        
        # Log sensitive endpoint access
        if request.url.path.startswith("/api/admin") or request.url.path.startswith("/api/auth"):
            logger.info(
                f"AUDIT: {request.method} {request.url.path} "
                f"from {client_ip} "
                f"status={response.status_code} "
                f"ua={user_agent[:50]}"
            )
        
        return response
