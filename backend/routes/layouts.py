from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List, Dict, Any
from datetime import datetime, timezone
import os
import sys
sys.path.insert(0, '/app/backend')

from models.user_layout import UserLayout, UserLayoutCreate, UserLayoutUpdate, UserLayoutResponse
from routes.auth import require_auth, require_subscription
from models.user import UserResponse
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

router = APIRouter(prefix="/layouts", tags=["User Layouts"])

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]


@router.get("/", response_model=List[UserLayoutResponse])
async def get_user_layouts(user: UserResponse = Depends(require_auth)):
    """
    Get all layouts for the current user
    """
    layouts = await db.user_layouts.find(
        {'user_id': user.id},
        {'_id': 0}
    ).to_list(100)
    
    for layout in layouts:
        if isinstance(layout.get('updated_at'), str):
            layout['updated_at'] = datetime.fromisoformat(layout['updated_at'])
        if isinstance(layout.get('created_at'), str):
            layout['created_at'] = datetime.fromisoformat(layout['created_at'])
    
    return layouts


@router.get("/{layout_type}", response_model=UserLayoutResponse)
async def get_layout_by_type(
    layout_type: str,
    user: UserResponse = Depends(require_auth)
):
    """
    Get a specific layout by type for the current user
    """
    layout = await db.user_layouts.find_one(
        {'user_id': user.id, 'layout_type': layout_type},
        {'_id': 0}
    )
    
    if not layout:
        raise HTTPException(status_code=404, detail="Layout not found")
    
    if isinstance(layout.get('updated_at'), str):
        layout['updated_at'] = datetime.fromisoformat(layout['updated_at'])
    if isinstance(layout.get('created_at'), str):
        layout['created_at'] = datetime.fromisoformat(layout['created_at'])
    
    return layout


@router.post("/", response_model=UserLayoutResponse)
async def create_or_update_layout(
    layout_data: UserLayoutCreate,
    user: UserResponse = Depends(require_auth)
):
    """
    Create or update a layout for the current user
    
    Uses "last updated wins" strategy for conflicts
    """
    now = datetime.now(timezone.utc)
    
    # Check if layout exists
    existing = await db.user_layouts.find_one(
        {'user_id': user.id, 'layout_type': layout_data.layout_type}
    )
    
    if existing:
        # Update existing layout
        await db.user_layouts.update_one(
            {'user_id': user.id, 'layout_type': layout_data.layout_type},
            {'$set': {
                'layout_config': layout_data.layout_config,
                'updated_at': now.isoformat()
            }}
        )
        
        return UserLayoutResponse(
            id=existing['id'],
            user_id=user.id,
            layout_type=layout_data.layout_type,
            layout_config=layout_data.layout_config,
            updated_at=now
        )
    else:
        # Create new layout
        layout = UserLayout(
            id=str(uuid.uuid4()),
            user_id=user.id,
            layout_type=layout_data.layout_type,
            layout_config=layout_data.layout_config
        )
        
        layout_dict = layout.model_dump()
        layout_dict['created_at'] = layout_dict['created_at'].isoformat()
        layout_dict['updated_at'] = layout_dict['updated_at'].isoformat()
        
        await db.user_layouts.insert_one(layout_dict)
        
        return UserLayoutResponse(
            id=layout.id,
            user_id=user.id,
            layout_type=layout_data.layout_type,
            layout_config=layout_data.layout_config,
            updated_at=layout.updated_at
        )


@router.put("/{layout_type}", response_model=UserLayoutResponse)
async def update_layout(
    layout_type: str,
    layout_data: UserLayoutUpdate,
    user: UserResponse = Depends(require_auth)
):
    """
    Update an existing layout by type
    """
    now = datetime.now(timezone.utc)
    
    result = await db.user_layouts.find_one_and_update(
        {'user_id': user.id, 'layout_type': layout_type},
        {'$set': {
            'layout_config': layout_data.layout_config,
            'updated_at': now.isoformat()
        }},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Layout not found")
    
    return UserLayoutResponse(
        id=result['id'],
        user_id=user.id,
        layout_type=layout_type,
        layout_config=layout_data.layout_config,
        updated_at=now
    )


@router.delete("/{layout_type}")
async def delete_layout(
    layout_type: str,
    user: UserResponse = Depends(require_auth)
):
    """
    Delete a layout by type
    """
    result = await db.user_layouts.delete_one(
        {'user_id': user.id, 'layout_type': layout_type}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Layout not found")
    
    return {"message": "Layout deleted successfully"}


@router.post("/sync")
async def sync_layouts(
    layouts: List[UserLayoutCreate],
    user: UserResponse = Depends(require_auth)
):
    """
    Sync multiple layouts from client
    
    Used for offline-to-online synchronization
    Uses "last updated wins" strategy
    """
    now = datetime.now(timezone.utc)
    synced = []
    
    for layout_data in layouts:
        existing = await db.user_layouts.find_one(
            {'user_id': user.id, 'layout_type': layout_data.layout_type}
        )
        
        if existing:
            await db.user_layouts.update_one(
                {'user_id': user.id, 'layout_type': layout_data.layout_type},
                {'$set': {
                    'layout_config': layout_data.layout_config,
                    'updated_at': now.isoformat()
                }}
            )
        else:
            layout = UserLayout(
                id=str(uuid.uuid4()),
                user_id=user.id,
                layout_type=layout_data.layout_type,
                layout_config=layout_data.layout_config
            )
            
            layout_dict = layout.model_dump()
            layout_dict['created_at'] = layout_dict['created_at'].isoformat()
            layout_dict['updated_at'] = layout_dict['updated_at'].isoformat()
            
            await db.user_layouts.insert_one(layout_dict)
        
        synced.append(layout_data.layout_type)
    
    return {
        "message": "Layouts synced successfully",
        "synced": synced
    }
