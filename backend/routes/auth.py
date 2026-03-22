from fastapi import APIRouter, HTTPException, Depends, Response, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from datetime import datetime, timezone
import os
import sys
import hashlib
import logging
sys.path.insert(0, '/app/backend')

from models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from services.auth_service import AuthService
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]
auth_service = AuthService(db)

# Device limit constant
MAX_DEVICES_PER_USER = 3

# =============================================================================
# COOKIE CONFIGURATION
# =============================================================================
# Centralized cookie settings to ensure consistency across all auth endpoints

def is_production_environment() -> bool:
    """
    Determine if we're running in production environment.
    
    Checks:
    1. ENVIRONMENT env var (primary)
    2. FRONTEND_URL starts with https (fallback)
    """
    env = os.environ.get('ENVIRONMENT', 'development').lower()
    if env == 'production':
        return True
    
    # Fallback: check if frontend URL is HTTPS
    frontend_url = os.environ.get('FRONTEND_URL', '')
    return frontend_url.startswith('https')


def set_auth_cookies(
    response: Response,
    access_token: str,
    refresh_token: str,
    remember_me: bool = False
) -> None:
    """
    Set authentication cookies with secure attributes.
    
    Centralized cookie-setting logic to ensure consistency across:
    - login
    - signup
    - token refresh
    
    Security attributes:
    - httponly: True (prevents JavaScript access)
    - secure: True in production (requires HTTPS)
    - samesite: "strict" in production, "lax" in development
    
    Args:
        response: FastAPI Response object
        access_token: JWT access token
        refresh_token: JWT refresh token
        remember_me: If True, use longer expiry for refresh token
    """
    is_production = is_production_environment()
    
    # Access token cookie (30 min expiry)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=is_production,
        samesite="strict" if is_production else "lax",
        max_age=1800  # 30 minutes
    )
    
    # Refresh token cookie
    # Longer expiry if remember_me, standard otherwise
    refresh_max_age = 604800 if remember_me else 86400  # 7 days vs 1 day
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=is_production,
        samesite="strict" if is_production else "lax",
        max_age=refresh_max_age
    )
    
    if is_production:
        logger.debug("Auth cookies set with production security (secure=true, samesite=strict)")
    else:
        logger.debug("Auth cookies set with development settings (secure=false, samesite=lax)")


def generate_device_id(request: Request) -> str:
    """
    Generate a stable device identifier for device limit tracking.
    
    Identification Strategy (in order of preference):
    1. X-Device-ID header: Stable client-generated ID stored in localStorage (preferred)
    2. User-Agent: Browser/device fingerprint (fallback)
    
    The frontend should generate a UUID on first visit, store it in localStorage,
    and send it with every login request via X-Device-ID header.
    
    Returns:
        Hashed device identifier string (16 chars for backwards compatibility)
    """
    user_agent = request.headers.get('user-agent', 'unknown')
    
    # Prefer client-provided device ID (more stable across sessions)
    client_device_id = request.headers.get("x-device-id", "")
    
    if client_device_id:
        # Client provided a stable device ID - use it combined with user-agent
        # This provides better stability while still differentiating device types
        raw_id = f"{client_device_id}|{user_agent}"
    else:
        # Fallback: Use only user-agent (less stable but backwards compatible)
        raw_id = user_agent
    
    # Hash for privacy and consistent length (16 chars for backwards compatibility)
    return hashlib.sha256(raw_id.encode()).hexdigest()[:16]


def get_device_info(request: Request) -> dict:
    """Extract device information from request headers"""
    user_agent = request.headers.get('user-agent', 'Unknown Device')
    
    # Parse user agent to get device type
    device_type = 'Desktop'
    if 'Mobile' in user_agent or 'Android' in user_agent:
        device_type = 'Mobile'
    elif 'iPad' in user_agent or 'Tablet' in user_agent:
        device_type = 'Tablet'
    
    # Get browser name
    browser = 'Unknown'
    if 'Chrome' in user_agent and 'Edg' not in user_agent:
        browser = 'Chrome'
    elif 'Firefox' in user_agent:
        browser = 'Firefox'
    elif 'Safari' in user_agent and 'Chrome' not in user_agent:
        browser = 'Safari'
    elif 'Edg' in user_agent:
        browser = 'Edge'
    
    return {
        'user_agent': user_agent[:200],  # Limit length
        'device_type': device_type,
        'browser': browser
    }


async def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[UserResponse]:
    """
    Get current user from JWT token (supports both header and cookie)
    """
    token = None
    
    # Try to get token from Authorization header
    if credentials:
        token = credentials.credentials
    
    # Try to get token from cookie if not in header
    if not token:
        token = request.cookies.get('access_token')
    
    if not token:
        return None
    
    payload = auth_service.decode_token(token)
    if not payload:
        return None
    
    if payload.get('type') != 'access':
        return None
    
    user_id = payload.get('sub')
    if not user_id:
        return None
    
    return await auth_service.get_user_with_subscription(user_id)


async def require_auth(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """
    Require authentication - raises 401 if not authenticated
    """
    user = await get_current_user(request, credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


async def require_subscription(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """
    Require authentication AND active subscription (or admin status)
    """
    user = await require_auth(request, credentials)
    
    # Admin always has access
    if user.is_admin:
        return user
    
    # Check subscription
    if not user.has_active_subscription:
        raise HTTPException(
            status_code=403,
            detail="Subscription required. Please subscribe to continue."
        )
    
    return user


async def require_admin(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """
    Require admin status
    """
    user = await require_auth(request, credentials)
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate, response: Response):
    """
    Register a new user account
    
    - Validates password strength against central policy
    - Creates user with hashed password
    - Automatically creates 3-day trial subscription
    - Sends welcome email
    - Returns access and refresh tokens
    """
    # Validate password strength using central policy
    is_valid, error_msg = auth_service.validate_password_strength(user_data.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    user, error = await auth_service.create_user(user_data)
    
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    # Send welcome email and admin notification (non-blocking)
    try:
        from services.email_service import email_service
        import logging
        logger = logging.getLogger(__name__)
        
        # Send welcome email to user
        welcome_result = email_service.send_welcome_email(user.email, user.name)
        logger.info(f"Welcome email to {user.email}: {'sent' if welcome_result else 'failed'}")
        
        # Notify admin of new registration
        admin_result = email_service.send_admin_new_registration_email(user.email, user.name)
        logger.info(f"Admin notification email for {user.email}: {'sent' if admin_result else 'failed'}")
        
    except Exception as e:
        # Log error but don't fail registration
        import logging
        logging.getLogger(__name__).error(f"Failed to send welcome/admin notification email: {e}", exc_info=True)
    
    # Generate tokens
    access_token = auth_service.create_access_token(user.id, user.is_admin)
    refresh_token = auth_service.create_refresh_token(user.id)
    
    # Set HTTP-only cookies with secure flags using centralized helper
    set_auth_cookies(response, access_token, refresh_token, remember_me=False)
    
    # Get user with subscription info
    user_response = await auth_service.get_user_with_subscription(user.id)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, request: Request, response: Response):
    """
    Authenticate and login
    
    - Validates email and password
    - Checks device limit (max 3 devices per user)
    - Registers new device on successful login
    - Returns access and refresh tokens
    - Sets HTTP-only cookies for web clients
    """
    user, error = await auth_service.authenticate_user(credentials.email, credentials.password)
    
    if error:
        # Return generic error message to prevent user enumeration
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate device ID for this login
    device_id = generate_device_id(request)
    device_info = get_device_info(request)
    
    # Check current device count for non-admin users
    if not user.is_admin:
        active_devices = await db.user_devices.find({
            'user_id': user.id
        }).to_list(100)
        
        # Check if this is a new device (not already registered)
        existing_device = next((d for d in active_devices if d.get('device_id') == device_id), None)
        
        if not existing_device and len(active_devices) >= MAX_DEVICES_PER_USER:
            raise HTTPException(
                status_code=403, 
                detail=f"Device limit reached. You can only be logged in on {MAX_DEVICES_PER_USER} devices. Please log out from another device or contact admin."
            )
    
    # Generate tokens
    access_token = auth_service.create_access_token(user.id, user.is_admin)
    refresh_token = auth_service.create_refresh_token(user.id)
    
    # Register/update device
    now = datetime.now(timezone.utc).isoformat()
    await db.user_devices.update_one(
        {'user_id': user.id, 'device_id': device_id},
        {'$set': {
            'user_id': user.id,
            'device_id': device_id,
            'user_agent': device_info['user_agent'],
            'device_type': device_info['device_type'],
            'browser': device_info['browser'],
            'last_login': now,
            'refresh_token': refresh_token,  # Store to invalidate on revoke
            'updated_at': now
        },
        '$setOnInsert': {
            'created_at': now
        }},
        upsert=True
    )
    
    # Set HTTP-only cookies with secure flags using centralized helper
    set_auth_cookies(response, access_token, refresh_token, remember_me=True)
    
    # Store device_id in cookie for logout
    is_production = is_production_environment()
    response.set_cookie(
        key="device_id",
        value=device_id,
        httponly=True,
        secure=is_production,
        samesite="strict" if is_production else "lax",
        max_age=604800
    )
    
    # Get user with subscription info
    user_response = await auth_service.get_user_with_subscription(user.id)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )


@router.post("/logout")
async def logout(request: Request, response: Response):
    """
    Logout - clears auth cookies, removes device registration, and revokes refresh token.
    
    Security:
    - Revokes the refresh token to prevent reuse
    - Clears all auth cookies
    - Removes device from user's registered devices
    """
    # Get device_id from cookie to remove device registration
    device_id = request.cookies.get('device_id')
    
    # Get tokens to revoke and identify user
    access_token = request.cookies.get('access_token')
    refresh_token = request.cookies.get('refresh_token')
    
    user_id = None
    
    # Try to get user_id from access token
    if access_token:
        payload = auth_service.decode_token(access_token)
        if payload:
            user_id = payload.get('sub')
    
    # Revoke the refresh token if present
    if refresh_token:
        refresh_payload = auth_service.decode_token(refresh_token)
        if refresh_payload:
            jti = refresh_payload.get('jti')
            token_user_id = refresh_payload.get('sub')
            if jti and token_user_id:
                await auth_service.revoke_token(jti, token_user_id, reason="logout")
                logger.info(f"Revoked refresh token on logout: user={token_user_id}")
            if not user_id:
                user_id = token_user_id
    
    # Remove device registration
    if user_id and device_id:
        await db.user_devices.delete_one({
            'user_id': user_id,
            'device_id': device_id
        })
    
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    response.delete_cookie("device_id")
    return {"message": "Logged out successfully"}


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: Request, response: Response):
    """
    Refresh access token using refresh token.
    
    Security checks:
    - Validates refresh token signature and expiration
    - Checks if token has been revoked (via jti)
    - Issues new token pair on success
    """
    # Get refresh token from cookie or body
    token = request.cookies.get('refresh_token')
    
    if not token:
        # Try to get from request body
        try:
            body = await request.json()
            token = body.get('refresh_token')
        except Exception:
            pass
    
    if not token:
        raise HTTPException(status_code=401, detail="Refresh token required")
    
    payload = auth_service.decode_token(token)
    if not payload or payload.get('type') != 'refresh':
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    # Check if token has been revoked
    jti = payload.get('jti')
    if jti and await auth_service.is_token_revoked(jti):
        logger.warning(f"Attempted use of revoked refresh token: jti={jti}")
        raise HTTPException(status_code=401, detail="Token has been revoked")
    
    user_id = payload.get('sub')
    user = await auth_service.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Revoke the old refresh token (token rotation for security)
    if jti:
        await auth_service.revoke_token(jti, user_id, reason="token_refresh")
    
    # Generate new tokens
    access_token = auth_service.create_access_token(user.id, user.is_admin)
    new_refresh_token = auth_service.create_refresh_token(user.id)
    
    # Update cookies using centralized helper with secure settings
    set_auth_cookies(response, access_token, new_refresh_token, remember_me=True)
    
    user_response = await auth_service.get_user_with_subscription(user.id)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        user=user_response
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(user: UserResponse = Depends(require_auth)):
    """
    Get current user info including subscription status
    """
    return user


@router.get("/check")
async def check_auth(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Check if user is authenticated and subscription status
    """
    user = await get_current_user(request, credentials)
    
    if not user:
        return {
            "authenticated": False,
            "has_subscription": False,
            "is_admin": False
        }
    
    return {
        "authenticated": True,
        "has_subscription": user.has_active_subscription,
        "is_admin": user.is_admin,
        "subscription_status": user.subscription_status,
        "subscription_plan": user.subscription_plan,
        "user_id": user.id,
        "email": user.email,
        "name": user.name
    }



# =============================================================================
# PASSWORD RESET ENDPOINTS
# =============================================================================

from pydantic import BaseModel, EmailStr
import secrets
from services.email_service import email_service

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password")
async def forgot_password(request_data: ForgotPasswordRequest):
    """
    Request a password reset email.
    
    - Generates a secure reset token (valid for 1 hour)
    - Sends email with reset link
    - Returns success even if email not found (security)
    """
    email_lower = request_data.email.lower()
    
    # Find user
    user = await db.users.find_one({'email': email_lower})
    
    if user:
        # Generate secure token
        reset_token = secrets.token_urlsafe(32)
        
        # Store token in database (expires in 1 hour)
        from datetime import timedelta
        expires = (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
        
        await db.password_resets.delete_many({'user_id': user['id']})  # Remove old tokens
        await db.password_resets.insert_one({
            'user_id': user['id'],
            'token': reset_token,
            'email': email_lower,
            'expires_at': expires,
            'created_at': datetime.now(timezone.utc).isoformat()
        })
        
        # Get frontend URL from environment (required for production)
        frontend_url = os.environ.get('FRONTEND_URL')
        if not frontend_url:
            raise HTTPException(status_code=500, detail="FRONTEND_URL environment variable not set")
        
        # Send email
        email_service.send_password_reset_email(
            to_email=email_lower,
            user_name=user.get('name', 'User'),
            reset_token=reset_token,
            frontend_url=frontend_url
        )
    
    # Always return success to prevent email enumeration
    return {"message": "If an account exists with this email, a password reset link has been sent."}


@router.post("/reset-password")
async def reset_password(request_data: ResetPasswordRequest):
    """
    Reset password using token from email.
    
    - Validates token and expiration
    - Validates password strength against central policy
    - Updates user password
    - Deletes used token
    """
    # Find valid token
    reset_record = await db.password_resets.find_one({'token': request_data.token})
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Check expiration
    expires_at = datetime.fromisoformat(reset_record['expires_at'].replace('Z', '+00:00'))
    if datetime.now(timezone.utc) > expires_at:
        await db.password_resets.delete_one({'token': request_data.token})
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Validate password strength using central policy
    is_valid, error_msg = auth_service.validate_password_strength(request_data.new_password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Update password
    hashed = auth_service.hash_password(request_data.new_password)
    result = await db.users.update_one(
        {'id': reset_record['user_id']},
        {'$set': {'hashed_password': hashed, 'updated_at': datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update password")
    
    # Delete used token
    await db.password_resets.delete_one({'token': request_data.token})
    
    return {"message": "Password reset successfully. You can now log in with your new password."}
