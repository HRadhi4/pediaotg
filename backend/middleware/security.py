"""
Security Middleware for PediaOTG
- Rate limiting for login endpoints
- Security headers
- Error handling (suppress stack traces in production)
"""
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from datetime import datetime, timezone
from collections import defaultdict
import time
import os
import logging

logger = logging.getLogger(__name__)

# Rate limiting configuration
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_SECONDS = 15 * 60  # 15 minutes

# In-memory store for rate limiting (consider Redis for production clusters)
login_attempts = defaultdict(list)
locked_ips = {}


def is_ip_locked(ip: str) -> tuple[bool, int]:
    """Check if IP is locked and return remaining lockout time"""
    if ip in locked_ips:
        lockout_end = locked_ips[ip]
        now = time.time()
        if now < lockout_end:
            remaining = int(lockout_end - now)
            return True, remaining
        else:
            # Lockout expired, remove from locked list
            del locked_ips[ip]
            # Also clear attempt history
            if ip in login_attempts:
                del login_attempts[ip]
    return False, 0


def record_login_attempt(ip: str, success: bool):
    """Record a login attempt and lock IP if too many failures"""
    now = time.time()
    
    if success:
        # Clear attempts on successful login
        if ip in login_attempts:
            del login_attempts[ip]
        return
    
    # Record failed attempt
    login_attempts[ip].append(now)
    
    # Clean up old attempts (older than lockout duration)
    cutoff = now - LOCKOUT_DURATION_SECONDS
    login_attempts[ip] = [t for t in login_attempts[ip] if t > cutoff]
    
    # Check if should lock
    if len(login_attempts[ip]) >= MAX_LOGIN_ATTEMPTS:
        locked_ips[ip] = now + LOCKOUT_DURATION_SECONDS
        logger.warning(f"IP {ip} locked due to {MAX_LOGIN_ATTEMPTS} failed login attempts")


def get_client_ip(request: Request) -> str:
    """Get client IP from request, considering proxies"""
    # Check X-Forwarded-For header (common in reverse proxy setups)
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # Take the first IP (client IP)
        return forwarded.split(",")[0].strip()
    
    # Check X-Real-IP header
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    
    # Fallback to direct client
    return request.client.host if request.client else "unknown"


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        
        # Remove server version headers
        if "server" in response.headers:
            del response.headers["server"]
        if "x-powered-by" in response.headers:
            del response.headers["x-powered-by"]
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limit login attempts by IP"""
    
    async def dispatch(self, request: Request, call_next):
        # Only apply rate limiting to login endpoint
        if request.url.path == "/api/auth/login" and request.method == "POST":
            client_ip = get_client_ip(request)
            
            # Check if IP is locked
            is_locked, remaining_seconds = is_ip_locked(client_ip)
            if is_locked:
                remaining_minutes = remaining_seconds // 60
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": f"Too many login attempts. Please try again in {remaining_minutes} minutes.",
                        "retry_after": remaining_seconds
                    },
                    headers={"Retry-After": str(remaining_seconds)}
                )
        
        response = await call_next(request)
        
        # Record failed login attempts
        if request.url.path == "/api/auth/login" and request.method == "POST":
            client_ip = get_client_ip(request)
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
            logger.error(f"Unhandled error: {str(e)}", exc_info=True)
            
            # Return generic error to client
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"}
            )
