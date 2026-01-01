from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime, timezone
import uuid


class UserLayoutBase(BaseModel):
    layout_type: str  # e.g., 'nicu_widgets', 'children_widgets', 'favorites'
    layout_config: Dict[str, Any]  # JSON containing widget positions and settings


class UserLayoutCreate(BaseModel):
    layout_type: str
    layout_config: Dict[str, Any]


class UserLayoutUpdate(BaseModel):
    layout_config: Dict[str, Any]


class UserLayout(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    layout_type: str
    layout_config: Dict[str, Any]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserLayoutResponse(BaseModel):
    id: str
    user_id: str
    layout_type: str
    layout_config: Dict[str, Any]
    updated_at: datetime
