from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
import os
import sys
sys.path.insert(0, '/app/backend')

from routes.auth import require_admin
from models.user import UserResponse
from services.subscription_service import SubscriptionService
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/admin", tags=["Admin"])

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

subscription_service = SubscriptionService(db)


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

