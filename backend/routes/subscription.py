"""
=============================================================================
SUBSCRIPTION ROUTES - PayPal Payment & Subscription Management
=============================================================================
Handles subscription-related API endpoints:
- GET /pricing: Get subscription pricing
- GET /status: Get user's subscription status
- POST /create-order: Create PayPal order for payment
- POST /capture-order: Capture payment after approval
- POST /cancel: Cancel subscription
- POST /change-plan: Change subscription plan
- POST /webhook/paypal: Handle PayPal webhooks
- GET /verify-paypal: Debug endpoint to verify PayPal config

FLOW:
1. User clicks Subscribe → POST /create-order
2. User redirected to PayPal approval_url
3. User approves → PayPal redirects to return_url with token
4. Frontend calls POST /capture-order with order_id
5. Subscription activated, email sent
=============================================================================
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Optional
from datetime import datetime, timezone
import os
import sys
import logging

sys.path.insert(0, '/app/backend')

from models.subscription import PlanType, PayPalOrderCreate, PayPalOrderCapture, SubscriptionResponse
from services.paypal_service import PayPalService
from services.subscription_service import SubscriptionService
from routes.auth import require_auth, require_subscription
from models.user import UserResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

logger = logging.getLogger(__name__)

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
    """Get subscription pricing information"""
    return PricingResponse(
        monthly_price=float(os.environ.get('MONTHLY_PRICE_BHD', 1.0)),
        annual_price=float(os.environ.get('ANNUAL_PRICE_BHD', 10.0)),
        currency="BHD",
        trial_days=int(os.environ.get('TRIAL_DAYS', 3))
    )


@router.get("/verify-paypal")
async def verify_paypal_config():
    """
    Debug endpoint to verify PayPal configuration.
    Returns credential status without exposing secrets.
    """
    result = await paypal_service.verify_credentials()
    return result


@router.get("/status")
async def get_subscription_status(user: UserResponse = Depends(require_auth)):
    """Get current user's subscription status"""
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
    Create a PayPal order for subscription.
    Returns the approval URL to redirect user to PayPal.
    """
    logger.info(f"Creating order for user {user.id}, plan: {order_data.plan_name}")
    
    try:
        result = await paypal_service.create_order(
            plan_name=order_data.plan_name,
            user_id=user.id
        )
        
        logger.info(f"Order created successfully: {result['order_id']}")
        
        return {
            "success": True,
            "order_id": result['order_id'],
            "approval_url": result['approval_url']
        }
    except ValueError as e:
        # Invalid plan name
        logger.error(f"Invalid plan: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating PayPal order: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/capture-order")
async def capture_paypal_order(
    capture_data: PayPalOrderCapture,
    user: UserResponse = Depends(require_auth)
):
    """
    Capture a PayPal order after user approval.
    This activates the subscription and sends confirmation email.
    """
    logger.info(f"Capturing order {capture_data.order_id} for user {user.id}")
    
    try:
        # First verify the order status
        order_details = await paypal_service.get_order_details(capture_data.order_id)
        order_status = order_details.get('status')
        logger.info(f"Order {capture_data.order_id} status: {order_status}")
        
        if order_status != 'APPROVED':
            logger.error(f"Order not approved. Status: {order_status}")
            raise HTTPException(
                status_code=400,
                detail=f"Order not approved by PayPal. Current status: {order_status}. "
                       "Please complete the PayPal approval process first."
            )
        
        # Verify the order belongs to this user (custom_id should match)
        custom_id = None
        if order_details.get('purchase_units'):
            custom_id = order_details['purchase_units'][0].get('custom_id')
        
        if custom_id and custom_id != user.id:
            logger.error(f"Order user mismatch: {custom_id} vs {user.id}")
            raise HTTPException(
                status_code=403,
                detail="This order does not belong to the current user"
            )
        
        # Capture the payment
        capture_result = await paypal_service.capture_order(capture_data.order_id)
        logger.info(f"Capture result: status={capture_result['status']}")
        
        if capture_result['status'] != 'COMPLETED':
            logger.error(f"Payment not completed: {capture_result}")
            raise HTTPException(
                status_code=400,
                detail=f"Payment not completed. Status: {capture_result['status']}"
            )
        
        # Fetch user email and name for notification
        user_doc = await db.users.find_one(
            {'id': user.id}, 
            {'_id': 0, 'email': 1, 'name': 1}
        )
        
        if not user_doc:
            logger.error(f"User not found in database: {user.id}")
            raise HTTPException(status_code=404, detail="User not found")
        
        # Create/update subscription
        subscription = await subscription_service.create_paid_subscription(
            user_id=user.id,
            plan_name=capture_data.plan_name,
            gateway_order_id=capture_data.order_id,
            gateway_customer_id=capture_result.get('payer_id'),
            capture_id=capture_result.get('capture_id')
        )
        
        logger.info(f"Subscription created/updated: {subscription.id}")
        
        # Update user's active subscription status in users collection
        await db.users.update_one(
            {'id': user.id},
            {'$set': {
                'has_active_subscription': True,
                'updated_at': datetime.now(timezone.utc).isoformat()
            }}
        )
        logger.info(f"User {user.id} has_active_subscription set to True")
        
        # Send confirmation email (don't fail if email fails)
        try:
            from services.email_service import email_service
            renews_at_str = subscription.renews_at.strftime("%B %d, %Y") if subscription.renews_at else "N/A"
            plan_display = subscription.plan_name.value.capitalize() if hasattr(subscription.plan_name, 'value') else str(subscription.plan_name).capitalize()
            
            email_service.send_subscription_change_email(
                to_email=user_doc.get('email'),
                user_name=user_doc.get('name', 'User'),
                plan_name=plan_display,
                renews_at=renews_at_str
            )
            logger.info(f"Subscription confirmation email sent to {user_doc.get('email')}")
        except Exception as e:
            logger.error(f"Failed to send subscription email: {e}")
            # Don't fail the subscription activation if email fails
        
        return {
            "success": True,
            "message": "Subscription activated successfully",
            "subscription": {
                "id": subscription.id,
                "plan": subscription.plan_name.value if hasattr(subscription.plan_name, 'value') else str(subscription.plan_name),
                "status": subscription.status.value if hasattr(subscription.status, 'value') else str(subscription.status),
                "renews_at": subscription.renews_at.isoformat() if subscription.renews_at else None
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error capturing PayPal order: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cancel")
async def cancel_subscription(user: UserResponse = Depends(require_auth)):
    """
    Cancel the current subscription.
    Access continues until the end of the current billing period.
    """
    if user.is_admin:
        raise HTTPException(status_code=400, detail="Admin accounts cannot be canceled")
    
    success, message = await subscription_service.cancel_subscription(user.id)
    
    if not success:
        raise HTTPException(status_code=400, detail=message)
    
    # Update user's subscription status
    await db.users.update_one(
        {'id': user.id},
        {'$set': {
            'has_active_subscription': False,
            'updated_at': datetime.now(timezone.utc).isoformat()
        }}
    )
    
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
    Change subscription plan (monthly <-> annual).
    Creates a new PayPal order for the new plan.
    """
    logger.info(f"Plan change requested for user {user.id} to {order_data.plan_name}")
    
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
        logger.error(f"Error creating plan change order: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# PayPal Webhook Handler
@router.post("/webhook/paypal")
async def handle_paypal_webhook(request: Request):
    """
    Handle PayPal webhooks for subscription events.
    
    Events handled:
    - PAYMENT.CAPTURE.COMPLETED: Successful payment
    - PAYMENT.CAPTURE.DENIED: Failed payment
    
    TODO: Add webhook signature verification for production
    """
    try:
        body = await request.json()
        event_type = body.get('event_type', '')
        
        logger.info(f"Received PayPal webhook: {event_type}")
        logger.debug(f"Webhook body: {body}")
        
        # TODO: Verify webhook signature for production
        # headers = dict(request.headers)
        # verify_webhook_signature(headers, body)
        
        if event_type == 'PAYMENT.CAPTURE.COMPLETED':
            # Handle successful payment/renewal
            resource = body.get('resource', {})
            custom_id = resource.get('custom_id')
            
            if custom_id:
                logger.info(f"Payment completed for user: {custom_id}")
                # Could update subscription renewal date here
        
        elif event_type == 'PAYMENT.CAPTURE.DENIED':
            # Handle failed payment
            resource = body.get('resource', {})
            logger.warning(f"Payment denied: {resource}")
        
        return {"status": "received"}
    
    except Exception as e:
        logger.error(f"Webhook error: {e}", exc_info=True)
        # Return 200 to prevent PayPal retries
        return {"status": "error", "message": str(e)}
