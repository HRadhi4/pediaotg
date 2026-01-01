from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
from enum import Enum
import uuid


class PlanType(str, Enum):
    MONTHLY = "monthly"
    ANNUAL = "annual"
    TRIAL = "trial"


class SubscriptionStatus(str, Enum):
    TRIAL = "trial"
    ACTIVE = "active"
    CANCELED = "canceled"
    EXPIRED = "expired"
    PENDING = "pending"


class SubscriptionBase(BaseModel):
    plan_name: PlanType
    status: SubscriptionStatus = SubscriptionStatus.PENDING


class SubscriptionCreate(BaseModel):
    user_id: str
    plan_name: PlanType


class Subscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    plan_name: PlanType
    status: SubscriptionStatus = SubscriptionStatus.PENDING
    started_at: Optional[datetime] = None
    renews_at: Optional[datetime] = None
    trial_ends_at: Optional[datetime] = None
    canceled_at: Optional[datetime] = None
    gateway_customer_id: Optional[str] = None
    gateway_subscription_id: Optional[str] = None
    gateway_order_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SubscriptionResponse(BaseModel):
    id: str
    user_id: str
    plan_name: str
    status: str
    started_at: Optional[datetime] = None
    renews_at: Optional[datetime] = None
    trial_ends_at: Optional[datetime] = None
    canceled_at: Optional[datetime] = None
    created_at: datetime


class PayPalOrderCreate(BaseModel):
    plan_name: PlanType


class PayPalOrderCapture(BaseModel):
    order_id: str
    plan_name: PlanType
