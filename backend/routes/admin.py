"""
=============================================================================
ADMIN ROUTES - Administrative Dashboard API Endpoints
=============================================================================
This module provides admin-only endpoints for user management:

ENDPOINTS:
- GET  /api/admin/users          - List all users with pagination
- GET  /api/admin/subscriptions  - List all subscriptions
- GET  /api/admin/stats          - Get subscription statistics
- GET  /api/admin/user/{id}      - Get detailed user info
- POST /api/admin/user           - Create new user with subscription
- DELETE /api/admin/user/{id}    - Delete user and related data

AUTHORIZATION: All endpoints require admin authentication via require_admin dependency

NOTE: Admin users cannot be deleted through the API for security
=============================================================================
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import os
import sys
sys.path.insert(0, '/app/backend')

from routes.auth import require_admin
from models.user import UserResponse, User
from models.subscription import Subscription, SubscriptionStatus, PlanType
from services.subscription_service import SubscriptionService
from services.auth_service import AuthService
from motor.motor_asyncio import AsyncIOMotorClient


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class AdminCreateUser(BaseModel):
    """
    Request model for creating a new user via admin dashboard.
    
    Attributes:
        email: Valid email address (validated by EmailStr)
        name: User's display name
        password: Plain text password (will be hashed)
        subscription_type: One of "trial", "monthly", "annual"
    """
    email: EmailStr
    name: str
    password: str
    subscription_type: Optional[str] = "trial"  # trial, monthly, annual


class AdminEditUser(BaseModel):
    """
    Request model for editing a user via admin dashboard.
    
    Attributes:
        password: New password (optional, will be hashed if provided)
        subscription_type: One of "trial", "monthly", "annual" (optional)
        subscription_days: Number of days to set/extend subscription (optional)
    """
    password: Optional[str] = None
    subscription_type: Optional[str] = None  # trial, monthly, annual
    subscription_days: Optional[int] = None  # Days to add/set


# =============================================================================
# ROUTER SETUP & DATABASE CONNECTION
# =============================================================================

router = APIRouter(prefix="/admin", tags=["Admin"])

# Database connection - uses environment variables
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

subscription_service = SubscriptionService(db)


# =============================================================================
# ADMIN ENDPOINTS
# =============================================================================

@router.get("/users")
async def get_all_users(
    skip: int = 0,
    limit: int = 50,
    admin: UserResponse = Depends(require_admin)
):
    """
    Get all users with their subscription status (Admin only)
    """
    users = await db.users.find({}, {'_id': 0, 'hashed_password': 0}).skip(skip).limit(limit).to_list(limit)
    
    # Get subscription info for each user
    result = []
    for user in users:
        sub = await db.subscriptions.find_one(
            {'user_id': user['id']},
            {'_id': 0},
            sort=[('created_at', -1)]
        )
        
        user_data = {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'is_admin': user.get('is_admin', False),
            'created_at': user['created_at'],
            'subscription': None
        }
        
        if sub:
            user_data['subscription'] = {
                'plan': sub.get('plan_name'),
                'status': sub.get('status'),
                'renews_at': sub.get('renews_at'),
                'trial_ends_at': sub.get('trial_ends_at')
            }
        
        result.append(user_data)
    
    # Get total count
    total = await db.users.count_documents({})
    
    return {
        "users": result,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/subscriptions")
async def get_all_subscriptions(
    skip: int = 0,
    limit: int = 50,
    admin: UserResponse = Depends(require_admin)
):
    """
    Get all subscriptions (Admin only)
    """
    subscriptions = await subscription_service.get_all_subscriptions(skip, limit)
    total = await db.subscriptions.count_documents({})
    
    return {
        "subscriptions": subscriptions,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/stats")
async def get_subscription_stats(admin: UserResponse = Depends(require_admin)):
    """
    Get subscription statistics (Admin only)
    """
    stats = await subscription_service.get_subscription_stats()
    
    # Get user counts
    total_users = await db.users.count_documents({})
    admin_users = await db.users.count_documents({'is_admin': True})
    
    return {
        "users": {
            "total": total_users,
            "admins": admin_users,
            "regular": total_users - admin_users
        },
        "subscriptions": stats
    }


@router.get("/user/{user_id}")
async def get_user_details(
    user_id: str,
    admin: UserResponse = Depends(require_admin)
):
    """
    Get detailed user information (Admin only)
    """
    user = await db.users.find_one({'id': user_id}, {'_id': 0, 'hashed_password': 0})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    subscription = await db.subscriptions.find_one(
        {'user_id': user_id},
        {'_id': 0},
        sort=[('created_at', -1)]
    )
    
    layouts = await db.user_layouts.find(
        {'user_id': user_id},
        {'_id': 0}
    ).to_list(100)
    
    return {
        "user": user,
        "subscription": subscription,
        "layouts": layouts
    }


@router.delete("/user/{user_id}")
async def delete_user(
    user_id: str,
    admin: UserResponse = Depends(require_admin)
):
    """
    Delete a user and their related data (Admin only)
    Cannot delete admin users
    """
    # Check if user exists
    user = await db.users.find_one({'id': user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting admin users
    if user.get('is_admin', False):
        raise HTTPException(status_code=403, detail="Cannot delete admin users")
    
    # Delete user's subscription
    await db.subscriptions.delete_many({'user_id': user_id})
    
    # Delete user's layouts
    await db.user_layouts.delete_many({'user_id': user_id})
    
    # Delete the user
    result = await db.users.delete_one({'id': user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete user")
    
    return {"message": "User deleted successfully", "user_id": user_id}


@router.post("/user")
async def create_user(
    user_data: AdminCreateUser,
    admin: UserResponse = Depends(require_admin)
):
    """
    Create a new user with subscription (Admin only)
    """
    email_lower = user_data.email.lower()
    
    # Check if user already exists
    existing = await db.users.find_one({'email': email_lower})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create auth service instance for password hashing
    auth_service = AuthService(db)
    
    # Create user
    user = User(
        email=email_lower,
        name=user_data.name,
        hashed_password=auth_service.hash_password(user_data.password),
        is_admin=False
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['updated_at'] = user_dict['updated_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create subscription based on type
    now = datetime.now(timezone.utc)
    
    if user_data.subscription_type == "trial":
        subscription = Subscription(
            user_id=user.id,
            plan_name=PlanType.TRIAL,
            status=SubscriptionStatus.TRIAL,
            started_at=now,
            trial_ends_at=now + timedelta(days=3)
        )
    elif user_data.subscription_type == "monthly":
        subscription = Subscription(
            user_id=user.id,
            plan_name=PlanType.MONTHLY,
            status=SubscriptionStatus.ACTIVE,
            started_at=now,
            renews_at=now + timedelta(days=30)
        )
    elif user_data.subscription_type == "annual":
        subscription = Subscription(
            user_id=user.id,
            plan_name=PlanType.ANNUAL,
            status=SubscriptionStatus.ACTIVE,
            started_at=now,
            renews_at=now + timedelta(days=365)
        )
    else:
        # Default to trial
        subscription = Subscription(
            user_id=user.id,
            plan_name=PlanType.TRIAL,
            status=SubscriptionStatus.TRIAL,
            started_at=now,
            trial_ends_at=now + timedelta(days=3)
        )
    
    sub_dict = subscription.model_dump()
    for key in ['started_at', 'trial_ends_at', 'renews_at', 'created_at', 'updated_at']:
        if sub_dict.get(key):
            sub_dict[key] = sub_dict[key].isoformat()
    await db.subscriptions.insert_one(sub_dict)
    
    return {
        "message": "User created successfully",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "subscription_type": user_data.subscription_type
        }
    }

