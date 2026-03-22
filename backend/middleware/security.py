"""
Security Middleware for PediaOTG
================================
- Rate limiting for login endpoints
- Security headers (including CSP)
- Error handling (suppress stack traces in production)
- Request validation and sanitization

Security Headers implemented:
- X-Frame-Options: DENY (prevent clickjacking)
- X-Content-Type-Options: nosniff (prevent MIME sniffing)
- Strict-Transport-Security: HSTS for HTTPS enforcement
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: disable sensitive features
- Content-Security-Policy: restrict content sources
- X-XSS-Protection: legacy XSS protection
"""
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from datetime import datetime, timezone
from collections import defaultdict
import time
import os
import logging
import re

logger = logging.getLogger(__name__)

# Environment
IS_PRODUCTION = os.environ.get('ENVIRONMENT', 'development') == 'production'

# Rate limiting configuration
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_SECONDS = 15 * 60  # 15 minutes

# General rate limiting
MAX_REQUESTS_PER_MINUTE = 100
MAX_ADMIN_REQUESTS_PER_MINUTE = 30

# In-memory store for rate limiting (consider Redis for production clusters)
login_attempts = defaultdict(list)
locked_ips = {}
request_counts = defaultdict(list)


def is_ip_locked(ip: str) -> tuple[bool, int]:
    """Check if IP is locked and return remaining lockout time"""
    if ip in locked_ips:
        lockout_end = locked_ips[ip]
        now = time.time()
        if now < lockout_end:
            remaining = int(lockout_end - now)
            return True, remaining
        else:
            del locked_ips[ip]
            if ip in login_attempts:
                del login_attempts[ip]
    return False, 0


def record_login_attempt(ip: str, success: bool):
    """Record a login attempt and lock IP if too many failures"""
    now = time.time()
    
    if success:
        if ip in login_attempts:
            del login_attempts[ip]
        return
    
    login_attempts[ip].append(now)
    cutoff = now - LOCKOUT_DURATION_SECONDS
    login_attempts[ip] = [t for t in login_attempts[ip] if t > cutoff]
    
    if len(login_attempts[ip]) >= MAX_LOGIN_ATTEMPTS:
        locked_ips[ip] = now + LOCKOUT_DURATION_SECONDS
        logger.warning(f"IP {ip} locked due to {MAX_LOGIN_ATTEMPTS} failed login attempts")


def check_rate_limit(ip: str, path: str) -> tuple[bool, int]:
    """Check if request should be rate limited"""
    now = time.time()
    key = f"{ip}:{path.startswith('/api/admin')}"
    
    # Clean old requests
    cutoff = now - 60
    request_counts[key] = [t for t in request_counts[key] if t > cutoff]
    
    # Check limit
    max_requests = MAX_ADMIN_REQUESTS_PER_MINUTE if path.startswith('/api/admin') else MAX_REQUESTS_PER_MINUTE
    
    if len(request_counts[key]) >= max_requests:
        retry_after = int(60 - (now - request_counts[key][0]))
        return True, max(retry_after, 1)
    
    request_counts[key].append(now)
    return False, 0


def get_client_ip(request: Request) -> str:
    """Get client IP from request, considering proxies"""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    
    return request.client.host if request.client else "unknown"


# Allowed sources for CSP
CSP_ALLOWED_ORIGINS = [
    "'self'",
    "https://pwa-security-build.preview.emergentagent.com",
    "https://app.pedotg.com",
    "https://pedotg.com",
    "https://www.pedotg.com",
]

CSP_FONT_SOURCES = [
    "'self'",
    "https://fonts.gstatic.com",
    "https://fonts.googleapis.com",
    "data:",
]

CSP_STYLE_SOURCES = [
    "'self'",
    "'unsafe-inline'",  # Required for inline styles (Tailwind, etc.)
    "https://fonts.googleapis.com",
]

CSP_SCRIPT_SOURCES = [
    "'self'",
    "'unsafe-inline'",  # Required for React/Next inline scripts
    "'unsafe-eval'" if not IS_PRODUCTION else "",  # Only in dev for HMR
]

CSP_IMG_SOURCES = [
    "'self'",
    "data:",
    "blob:",
    "https:",  # Allow HTTPS images
]


def build_csp_header() -> str:
    """Build Content-Security-Policy header value"""
    script_src = " ".join([s for s in CSP_SCRIPT_SOURCES if s])
    
    directives = [
        f"default-src 'self'",
        f"script-src {script_src}",
        f"style-src {' '.join(CSP_STYLE_SOURCES)}",
        f"font-src {' '.join(CSP_FONT_SOURCES)}",
        f"img-src {' '.join(CSP_IMG_SOURCES)}",
        f"connect-src 'self' {' '.join(CSP_ALLOWED_ORIGINS)} https://fonts.googleapis.com https://www.paypal.com https://api.paypal.com",
        f"frame-src 'self' https://www.paypal.com https://www.sandbox.paypal.com",
        f"frame-ancestors 'none'",
        f"form-action 'self'",
        f"base-uri 'self'",
        f"object-src 'none'",
        f"upgrade-insecure-requests" if IS_PRODUCTION else "",
    ]
    
    return "; ".join([d for d in directives if d])


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Core security headers
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Permissions Policy - disable sensitive browser features
        response.headers["Permissions-Policy"] = (
            "camera=(), "
            "microphone=(), "
            "geolocation=(), "
            "payment=(), "
            "usb=(), "
            "magnetometer=(), "
            "gyroscope=(), "
            "accelerometer=()"
        )
        
        # Content Security Policy
        response.headers["Content-Security-Policy"] = build_csp_header()
        
        # Prevent caching of sensitive data
        if request.url.path.startswith('/api/admin') or request.url.path.startswith('/api/auth'):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        
        # Remove server version headers
        for header in ["server", "x-powered-by", "x-aspnet-version"]:
            if header in response.headers:
                del response.headers[header]
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limit requests by IP - both login and general"""
    
    async def dispatch(self, request: Request, call_next):
        client_ip = get_client_ip(request)
        
        # Check login-specific rate limiting
        if request.url.path == "/api/auth/login" and request.method == "POST":
            is_locked, remaining_seconds = is_ip_locked(client_ip)
            if is_locked:
                remaining_minutes = remaining_seconds // 60
                logger.warning(f"Blocked login attempt from locked IP: {client_ip}")
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": f"Too many login attempts. Please try again in {remaining_minutes} minutes.",
                        "retry_after": remaining_seconds
                    },
                    headers={"Retry-After": str(remaining_seconds)}
                )
        
        # Check general rate limiting (stricter for admin routes)
        is_limited, retry_after = check_rate_limit(client_ip, request.url.path)
        if is_limited:
            logger.warning(f"Rate limited IP: {client_ip} on path: {request.url.path}")
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Too many requests. Please slow down.",
                    "retry_after": retry_after
                },
                headers={"Retry-After": str(retry_after)}
            )
        
        response = await call_next(request)
        
        # Record failed login attempts
        if request.url.path == "/api/auth/login" and request.method == "POST":
            if response.status_code == 401:
                record_login_attempt(client_ip, success=False)
            elif response.status_code == 200:
                record_login_attempt(client_ip, success=True)
        
        return response


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Suppress detailed error messages in production"""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            # Log the full error server-side
            logger.error(f"Unhandled error on {request.url.path}: {str(e)}", exc_info=True)
            
            # Return generic error to client (no stack traces)
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"}
            )


class AdminRouteProtectionMiddleware(BaseHTTPMiddleware):
    """
    Additional protection layer for admin routes.
    Ensures admin routes are ONLY accessible to authenticated admins.
    This is a defense-in-depth measure in addition to route-level guards.
    """
    
    async def dispatch(self, request: Request, call_next):
        # Check if this is an admin route
        if request.url.path.startswith("/api/admin"):
            # Get token from header or cookie
            token = None
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header[7:]
            
            if not token:
                token = request.cookies.get("access_token")
            
            if not token:
                logger.warning(f"Unauthorized admin access attempt from {get_client_ip(request)} to {request.url.path}")
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Authentication required"}
                )
            
            # Verify token and admin status
            try:
                from services.auth_service import AuthService
                from motor.motor_asyncio import AsyncIOMotorClient
                import os
                
                mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
                client = AsyncIOMotorClient(mongo_url)
                db = client[os.environ.get('DB_NAME', 'test_database')]
                auth_service = AuthService(db)
                
                payload = auth_service.decode_token(token)
                if not payload or payload.get('type') != 'access':
                    logger.warning(f"Invalid token for admin access from {get_client_ip(request)}")
                    return JSONResponse(
                        status_code=401,
                        content={"detail": "Invalid authentication"}
                    )
                
                user_id = payload.get('sub')
                if user_id:
                    user = await db.users.find_one({'id': user_id})
                    if not user or not user.get('is_admin', False):
                        logger.warning(f"Non-admin user {user_id} attempted to access {request.url.path}")
                        return JSONResponse(
                            status_code=403,
                            content={"detail": "Admin access required"}
                        )
            except Exception as e:
                logger.error(f"Admin auth check failed: {e}")
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Authentication failed"}
                )
        
        return await call_next(request)
