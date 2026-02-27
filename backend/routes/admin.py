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
- PUT  /api/admin/user/{id}      - Edit user password/subscription
- DELETE /api/admin/user/{id}    - Delete user and related data
- GET  /api/admin/user/{id}/devices - Get user's logged-in devices
- DELETE /api/admin/user/{id}/devices/{device_id} - Revoke a device

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
import uuid
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


@router.put("/user/{user_id}")
async def edit_user(
    user_id: str,
    user_data: AdminEditUser,
    admin: UserResponse = Depends(require_admin)
):
    """
    Edit a user's password and/or subscription (Admin only)
    
    - password: Updates user's password (hashed)
    - subscription_type: Changes subscription plan type
    - subscription_days: Sets subscription to expire in X days from now
    """
    # Check if user exists
    user = await db.users.find_one({'id': user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    updates_made = []
    
    # Update password if provided
    if user_data.password:
        if len(user_data.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        auth_service = AuthService(db)
        hashed = auth_service.hash_password(user_data.password)
        await db.users.update_one(
            {'id': user_id},
            {'$set': {'hashed_password': hashed, 'updated_at': datetime.now(timezone.utc).isoformat()}}
        )
        updates_made.append("password")
    
    # Update subscription if type or days provided
    if user_data.subscription_type or user_data.subscription_days:
        now = datetime.now(timezone.utc)
        
        # Determine new subscription parameters
        sub_update = {'updated_at': now.isoformat()}
        
        if user_data.subscription_type:
            if user_data.subscription_type == "trial":
                sub_update['plan_name'] = PlanType.TRIAL.value
                sub_update['status'] = SubscriptionStatus.TRIAL.value
                days = user_data.subscription_days or 3
                sub_update['trial_ends_at'] = (now + timedelta(days=days)).isoformat()
                sub_update['renews_at'] = None
            elif user_data.subscription_type == "monthly":
                sub_update['plan_name'] = PlanType.MONTHLY.value
                sub_update['status'] = SubscriptionStatus.ACTIVE.value
                days = user_data.subscription_days or 30
                sub_update['renews_at'] = (now + timedelta(days=days)).isoformat()
                sub_update['trial_ends_at'] = None
            elif user_data.subscription_type == "annual":
                sub_update['plan_name'] = PlanType.ANNUAL.value
                sub_update['status'] = SubscriptionStatus.ACTIVE.value
                days = user_data.subscription_days or 365
                sub_update['renews_at'] = (now + timedelta(days=days)).isoformat()
                sub_update['trial_ends_at'] = None
        elif user_data.subscription_days:
            # Just extend current subscription
            sub_update['status'] = SubscriptionStatus.ACTIVE.value
            sub_update['renews_at'] = (now + timedelta(days=user_data.subscription_days)).isoformat()
        
        # Update or create subscription
        existing_sub = await db.subscriptions.find_one({'user_id': user_id})
        if existing_sub:
            await db.subscriptions.update_one(
                {'user_id': user_id},
                {'$set': sub_update}
            )
        else:
            # Create new subscription
            sub_update['user_id'] = user_id
            sub_update['id'] = str(uuid.uuid4()) if 'uuid' in dir() else user_id + '_sub'
            sub_update['started_at'] = now.isoformat()
            sub_update['created_at'] = now.isoformat()
            await db.subscriptions.insert_one(sub_update)
        
        updates_made.append("subscription")
    
    if not updates_made:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    return {
        "message": "User updated successfully",
        "user_id": user_id,
        "updates": updates_made
    }


@router.post("/send-renewal-reminders")
async def send_renewal_reminders(
    days_before: int = 3,
    admin: UserResponse = Depends(require_admin)
):
    """
    Send renewal reminder emails to users whose subscriptions are expiring soon (Admin only)
    
    Args:
        days_before: Number of days before expiration to send reminder (default: 3)
    
    Returns:
        Summary of emails sent
    """
    if days_before < 1 or days_before > 30:
        raise HTTPException(status_code=400, detail="days_before must be between 1 and 30")
    
    results = await subscription_service.send_renewal_reminders(days_before)
    
    return {
        "message": "Renewal reminder task completed",
        "results": results
    }


@router.get("/expiring-subscriptions")
async def get_expiring_subscriptions(
    days: int = 7,
    admin: UserResponse = Depends(require_admin)
):
    """
    Get list of subscriptions expiring within X days (Admin only)
    
    Args:
        days: Number of days to look ahead (default: 7)
    """
    now = datetime.now(timezone.utc)
    window_end = now + timedelta(days=days)
    
    # Find active subscriptions expiring within the window
    active_subs = await db.subscriptions.find({
        'status': 'active',
        'renews_at': {
            '$gte': now.isoformat(),
            '$lte': window_end.isoformat()
        }
    }, {'_id': 0}).to_list(100)
    
    # Find trial subscriptions expiring within the window
    trial_subs = await db.subscriptions.find({
        'status': 'trial',
        'trial_ends_at': {
            '$gte': now.isoformat(),
            '$lte': window_end.isoformat()
        }
    }, {'_id': 0}).to_list(100)
    
    # Get user details for each subscription
    result = []
    
    for sub in active_subs + trial_subs:
        user = await db.users.find_one({'id': sub.get('user_id')}, {'_id': 0, 'email': 1, 'name': 1})
        
        expires_at = sub.get('renews_at') or sub.get('trial_ends_at')
        if expires_at:
            expires_dt = datetime.fromisoformat(expires_at) if isinstance(expires_at, str) else expires_at
            days_remaining = (expires_dt - now).days
        else:
            days_remaining = None
        
        result.append({
            'subscription_id': sub.get('id'),
            'user_id': sub.get('user_id'),
            'user_email': user.get('email') if user else 'Unknown',
            'user_name': user.get('name') if user else 'Unknown',
            'status': sub.get('status'),
            'plan': sub.get('plan_name'),
            'expires_at': expires_at,
            'days_remaining': days_remaining,
            'last_reminder_sent': sub.get('last_reminder_sent')
        })
    
    # Sort by days remaining
    result.sort(key=lambda x: x.get('days_remaining') or 999)
    
    return {
        "expiring_count": len(result),
        "days_window": days,
        "subscriptions": result
    }


@router.get("/scheduler/jobs")
async def get_scheduled_jobs(
    admin: UserResponse = Depends(require_admin)
):
    """
    Get list of all scheduled jobs and their next run times (Admin only)
    """
    from services.scheduler_service import get_scheduler
    
    scheduler = get_scheduler()
    if not scheduler:
        raise HTTPException(status_code=503, detail="Scheduler not initialized")
    
    jobs = scheduler.get_jobs()
    
    return {
        "scheduler_status": "running" if scheduler._is_running else "stopped",
        "jobs": jobs
    }


@router.post("/scheduler/run-job/{job_id}")
async def run_scheduled_job(
    job_id: str,
    admin: UserResponse = Depends(require_admin)
):
    """
    Manually trigger a scheduled job to run immediately (Admin only)
    
    Args:
        job_id: ID of the job to run (e.g., 'renewal_reminders')
    """
    from services.scheduler_service import get_scheduler
    
    scheduler = get_scheduler()
    if not scheduler:
        raise HTTPException(status_code=503, detail="Scheduler not initialized")
    
    try:
        result = await scheduler.run_job_now(job_id)
        return {
            "message": f"Job '{job_id}' executed successfully",
            "result": result
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job execution failed: {str(e)}")


@router.get("/scheduler/logs")
async def get_scheduler_logs(
    limit: int = 20,
    admin: UserResponse = Depends(require_admin)
):
    """
    Get recent scheduler execution logs (Admin only)
    
    Args:
        limit: Maximum number of logs to return (default: 20)
    """
    logs = await db.scheduler_logs.find(
        {},
        {'_id': 0}
    ).sort('executed_at', -1).limit(limit).to_list(limit)
    
    return {
        "logs": logs
    }
