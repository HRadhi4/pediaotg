from fastapi import APIRouter, HTTPException, Depends, Response, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from datetime import datetime, timezone
import os
import sys
sys.path.insert(0, '/app/backend')

from models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from services.auth_service import AuthService
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]
auth_service = AuthService(db)


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
    
    - Creates user with hashed password
    - Automatically creates 3-day trial subscription
    - Returns access and refresh tokens
    """
    user, error = await auth_service.create_user(user_data)
    
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    # Generate tokens
    access_token = auth_service.create_access_token(user.id, user.is_admin)
    refresh_token = auth_service.create_refresh_token(user.id)
    
    # Set HTTP-only cookie for web clients
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=1800  # 30 minutes
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800  # 7 days
    )
    
    # Get user with subscription info
    user_response = await auth_service.get_user_with_subscription(user.id)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, response: Response):
    """
    Authenticate and login
    
    - Validates email and password
    - Returns access and refresh tokens
    - Sets HTTP-only cookies for web clients
    """
    # Debug log
    print(f"[LOGIN] Attempting login for: {credentials.email}")
    print(f"[LOGIN] Admin email in service: {auth_service.admin_email}")
    
    user, error = await auth_service.authenticate_user(credentials.email, credentials.password)
    
    print(f"[LOGIN] Result: user={user is not None}, error={error}")
    
    if error:
        raise HTTPException(status_code=401, detail=error)
    
    # Generate tokens
    access_token = auth_service.create_access_token(user.id, user.is_admin)
    refresh_token = auth_service.create_refresh_token(user.id)
    
    # Set HTTP-only cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=1800
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
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
async def logout(response: Response):
    """
    Logout - clears auth cookies
    """
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: Request, response: Response):
    """
    Refresh access token using refresh token
    """
    # Get refresh token from cookie or body
    token = request.cookies.get('refresh_token')
    
    if not token:
        # Try to get from request body
        try:
            body = await request.json()
            token = body.get('refresh_token')
        except:
            pass
    
    if not token:
        raise HTTPException(status_code=401, detail="Refresh token required")
    
    payload = auth_service.decode_token(token)
    if not payload or payload.get('type') != 'refresh':
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user_id = payload.get('sub')
    user = await auth_service.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Generate new tokens
    access_token = auth_service.create_access_token(user.id, user.is_admin)
    new_refresh_token = auth_service.create_refresh_token(user.id)
    
    # Update cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=1800
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800
    )
    
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
