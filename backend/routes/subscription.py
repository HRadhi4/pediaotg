from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Optional
from datetime import datetime, timezone
import os
import sys
sys.path.insert(0, '/app/backend')

from models.subscription import PlanType, PayPalOrderCreate, PayPalOrderCapture, SubscriptionResponse
from services.paypal_service import PayPalService
from services.subscription_service import SubscriptionService
from routes.auth import require_auth, require_subscription
from models.user import UserResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

router = APIRouter(prefix="/subscription", tags=["Subscription"])

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

paypal_service = PayPalService()
subscription_service = SubscriptionService(db)


class PricingResponse(BaseModel):
    monthly_price: float
    annual_price: float
    currency: str = "BHD"
    trial_days: int


@router.get("/pricing", response_model=PricingResponse)
async def get_pricing():
    """
    Get subscription pricing information
    """
    return PricingResponse(
        monthly_price=float(os.environ.get('MONTHLY_PRICE_BHD', 1.0)),
        annual_price=float(os.environ.get('ANNUAL_PRICE_BHD', 10.0)),
        currency="BHD",
        trial_days=int(os.environ.get('TRIAL_DAYS', 3))
    )


@router.get("/status")
async def get_subscription_status(user: UserResponse = Depends(require_auth)):
    """
    Get current user's subscription status
    """
    subscription = await subscription_service.get_user_subscription(user.id)
    
    if not subscription:
        return {
            "has_subscription": False,
            "status": None,
            "plan": None,
            "renews_at": None,
            "trial_ends_at": None
        }
    
    return {
        "has_subscription": user.has_active_subscription,
        "status": subscription.status,
        "plan": subscription.plan_name,
        "renews_at": subscription.renews_at.isoformat() if subscription.renews_at else None,
        "trial_ends_at": subscription.trial_ends_at.isoformat() if subscription.trial_ends_at else None,
        "started_at": subscription.started_at.isoformat() if subscription.started_at else None
    }


@router.post("/create-order")
async def create_paypal_order(
    order_data: PayPalOrderCreate,
    user: UserResponse = Depends(require_auth)
):
    """
    Create a PayPal order for subscription
    
    Returns the approval URL to redirect user to PayPal
    """
    try:
        result = await paypal_service.create_order(
            plan_name=order_data.plan_name,
            user_id=user.id
        )
        
        return {
            "success": True,
            "order_id": result['order_id'],
            "approval_url": result['approval_url']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/capture-order")
async def capture_paypal_order(
    capture_data: PayPalOrderCapture,
    user: UserResponse = Depends(require_auth)
):
    """
    Capture a PayPal order after user approval
    
    This activates the subscription
    """
    try:
        # Capture the payment
        capture_result = await paypal_service.capture_order(capture_data.order_id)
        
        if capture_result['status'] != 'COMPLETED':
            raise HTTPException(
                status_code=400,
                detail=f"Payment not completed. Status: {capture_result['status']}"
            )
        
        # Create/update subscription
        subscription = await subscription_service.create_paid_subscription(
            user_id=user.id,
            plan_name=capture_data.plan_name,
            gateway_order_id=capture_data.order_id,
            gateway_customer_id=capture_result.get('payer_id'),
            capture_id=capture_result.get('capture_id')
        )
        
        return {
            "success": True,
            "message": "Subscription activated successfully",
            "subscription": {
                "id": subscription.id,
                "plan": subscription.plan_name,
                "status": subscription.status,
                "renews_at": subscription.renews_at.isoformat() if subscription.renews_at else None
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cancel")
async def cancel_subscription(user: UserResponse = Depends(require_auth)):
    """
    Cancel the current subscription
    
    Access continues until the end of the current billing period
    """
    if user.is_admin:
        raise HTTPException(status_code=400, detail="Admin accounts cannot be canceled")
    
    success, message = await subscription_service.cancel_subscription(user.id)
    
    if not success:
        raise HTTPException(status_code=400, detail=message)
    
    return {
        "success": True,
        "message": message
    }


@router.post("/change-plan")
async def change_plan(
    order_data: PayPalOrderCreate,
    user: UserResponse = Depends(require_auth)
):
    """
    Change subscription plan (monthly <-> annual)
    
    Creates a new PayPal order for the new plan
    """
    try:
        result = await paypal_service.create_order(
            plan_name=order_data.plan_name,
            user_id=user.id
        )
        
        return {
            "success": True,
            "order_id": result['order_id'],
            "approval_url": result['approval_url'],
            "message": "Redirect to PayPal to complete plan change"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# PayPal Webhook Handler
# TODO: Configure this webhook URL in PayPal dashboard
@router.post("/webhook/paypal")
async def handle_paypal_webhook(request: Request):
    """
    Handle PayPal webhooks for subscription events
    
    TODO: Implement webhook verification
    TODO: Configure webhook URL in PayPal dashboard
    
    Events to handle:
    - PAYMENT.SALE.COMPLETED: Successful payment
    - PAYMENT.SALE.DENIED: Failed payment
    - BILLING.SUBSCRIPTION.CANCELLED: Subscription canceled
    - BILLING.SUBSCRIPTION.SUSPENDED: Subscription suspended
    """
    try:
        body = await request.json()
        event_type = body.get('event_type', '')
        
        # TODO: Verify webhook signature
        # headers = dict(request.headers)
        # verify_webhook_signature(headers, body)
        
        if event_type == 'PAYMENT.SALE.COMPLETED':
            # Handle successful payment/renewal
            resource = body.get('resource', {})
            # Extract order/subscription ID and update subscription
            pass
        
        elif event_type in ['PAYMENT.SALE.DENIED', 'BILLING.SUBSCRIPTION.SUSPENDED']:
            # Handle failed payment
            resource = body.get('resource', {})
            # Update subscription status to expired
            pass
        
        elif event_type == 'BILLING.SUBSCRIPTION.CANCELLED':
            # Handle cancellation
            resource = body.get('resource', {})
            # Update subscription status
            pass
        
        return {"status": "received"}
    
    except Exception as e:
        # Log error but return 200 to prevent PayPal retries
        print(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}
