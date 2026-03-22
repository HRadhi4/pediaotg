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
- GET /self-test: Comprehensive PayPal integration test

FLOW:
1. User clicks Subscribe → POST /create-order
2. User redirected to PayPal approval_url
3. User approves → PayPal redirects to return_url with token
4. Frontend calls POST /capture-order with order_id
5. Subscription activated, email sent

ERROR HANDLING:
- All PayPal errors return structured JSON with error_code, error_message, error_details
- Frontend can display user-friendly messages based on error_code
=============================================================================
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime, timezone, timedelta
import os
import sys
import logging
import secrets

sys.path.insert(0, '/app/backend')

from models.subscription import PlanType, PayPalOrderCreate, PayPalOrderCapture, SubscriptionResponse
from services.paypal_service import PayPalService, PayPalError, PayPalErrorCode
from services.subscription_service import SubscriptionService
from routes.auth import require_auth, require_subscription
from services.auth_service import AuthService
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
auth_service = AuthService(db)

# =============================================================================
# CONFIGURATION FLAGS
# =============================================================================

# Debug endpoints control - disabled by default in production
# Set ENABLE_SUBSCRIPTION_DEBUG=true to enable /verify-paypal and /self-test
ENABLE_SUBSCRIPTION_DEBUG = os.environ.get('ENABLE_SUBSCRIPTION_DEBUG', 'false').lower() == 'true'

# PayPal webhook verification - should always be enabled in production
# Set PAYPAL_WEBHOOK_ID to enable signature verification
PAYPAL_WEBHOOK_ID = os.environ.get('PAYPAL_WEBHOOK_ID', '')

# PayPal debug logging - disabled by default to protect PII
# Set PAYPAL_DEBUG=true to log full webhook payloads
PAYPAL_DEBUG = os.environ.get('PAYPAL_DEBUG', 'false').lower() == 'true'

# Log configuration on startup
if ENABLE_SUBSCRIPTION_DEBUG:
    logger.warning("SUBSCRIPTION DEBUG ENDPOINTS ENABLED - /verify-paypal and /self-test are accessible")
else:
    logger.info("Subscription debug endpoints disabled (set ENABLE_SUBSCRIPTION_DEBUG=true to enable)")

if PAYPAL_WEBHOOK_ID:
    logger.info(f"PayPal webhook verification enabled (webhook_id: {PAYPAL_WEBHOOK_ID[:8]}...)")
else:
    logger.warning("PayPal webhook verification DISABLED - no PAYPAL_WEBHOOK_ID configured")


# =============================================================================
# PAYPAL WEBHOOK SIGNATURE VERIFICATION
# =============================================================================

import hashlib
import base64
import zlib
from typing import Tuple
import httpx

async def verify_paypal_webhook_signature(
    request: Request,
    body: bytes
) -> Tuple[bool, str]:
    """
    Verify PayPal webhook signature using their certificate-based verification.
    
    PayPal uses the following headers for verification:
    - PAYPAL-TRANSMISSION-ID: Unique message ID
    - PAYPAL-TRANSMISSION-SIG: The signature
    - PAYPAL-CERT-URL: URL to fetch the signing certificate
    - PAYPAL-AUTH-ALGO: Algorithm used (e.g., SHA256withRSA)
    - PAYPAL-TRANSMISSION-TIME: Timestamp
    
    Verification process:
    1. Get required headers
    2. Compute expected signature string
    3. Call PayPal's verify-webhook-signature API
    
    Args:
        request: FastAPI request object
        body: Raw request body bytes
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not PAYPAL_WEBHOOK_ID:
        logger.warning("Webhook signature verification skipped - no PAYPAL_WEBHOOK_ID configured")
        return True, "Verification skipped (no webhook ID)"
    
    # Get required headers
    transmission_id = request.headers.get('PAYPAL-TRANSMISSION-ID')
    transmission_sig = request.headers.get('PAYPAL-TRANSMISSION-SIG')
    cert_url = request.headers.get('PAYPAL-CERT-URL')
    auth_algo = request.headers.get('PAYPAL-AUTH-ALGO')
    transmission_time = request.headers.get('PAYPAL-TRANSMISSION-TIME')
    
    # Check all required headers are present
    if not all([transmission_id, transmission_sig, cert_url, auth_algo, transmission_time]):
        missing = []
        if not transmission_id: missing.append('PAYPAL-TRANSMISSION-ID')
        if not transmission_sig: missing.append('PAYPAL-TRANSMISSION-SIG')
        if not cert_url: missing.append('PAYPAL-CERT-URL')
        if not auth_algo: missing.append('PAYPAL-AUTH-ALGO')
        if not transmission_time: missing.append('PAYPAL-TRANSMISSION-TIME')
        return False, f"Missing required PayPal headers: {', '.join(missing)}"
    
    # Use PayPal's verify-webhook-signature API for proper verification
    try:
        paypal_mode = os.environ.get('PAYPAL_MODE', 'sandbox')
        base_url = "https://api-m.paypal.com" if paypal_mode == 'live' else "https://api-m.sandbox.paypal.com"
        
        # Get access token
        client_id = os.environ.get('PAYPAL_CLIENT_ID', '')
        client_secret = os.environ.get('PAYPAL_CLIENT_SECRET', '')
        
        if not client_id or not client_secret:
            return False, "PayPal credentials not configured"
        
        async with httpx.AsyncClient() as http_client:
            # Get access token
            auth_response = await http_client.post(
                f"{base_url}/v1/oauth2/token",
                data={"grant_type": "client_credentials"},
                auth=(client_id, client_secret),
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if auth_response.status_code != 200:
                return False, "Failed to authenticate with PayPal"
            
            access_token = auth_response.json().get('access_token')
            
            # Verify webhook signature
            verify_response = await http_client.post(
                f"{base_url}/v1/notifications/verify-webhook-signature",
                json={
                    "auth_algo": auth_algo,
                    "cert_url": cert_url,
                    "transmission_id": transmission_id,
                    "transmission_sig": transmission_sig,
                    "transmission_time": transmission_time,
                    "webhook_id": PAYPAL_WEBHOOK_ID,
                    "webhook_event": body.decode('utf-8') if isinstance(body, bytes) else body
                },
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                }
            )
            
            if verify_response.status_code == 200:
                result = verify_response.json()
                verification_status = result.get('verification_status', 'FAILURE')
                if verification_status == 'SUCCESS':
                    return True, "Signature verified"
                else:
                    return False, f"Verification failed: {verification_status}"
            else:
                return False, f"PayPal verification API returned {verify_response.status_code}"
                
    except Exception as e:
        logger.error(f"Webhook signature verification error: {e}")
        return False, f"Verification error: {str(e)}"


class PricingResponse(BaseModel):
    monthly_price: float
    annual_price: float
    currency: str = "BHD"
    trial_days: int


class ErrorResponse(BaseModel):
    """Structured error response for PayPal errors."""
    success: bool = False
    error_code: str
    error_message: str
    error_details: dict = {}
    user_message: str  # User-friendly message for display


def get_user_friendly_message(error: PayPalError) -> str:
    """Convert PayPal error code to user-friendly message."""
    messages = {
        PayPalErrorCode.CONFIG_MISSING: "Payment service is not configured. Please contact support.",
        PayPalErrorCode.CONFIG_INVALID: "Payment configuration error. Please contact support.",
        PayPalErrorCode.AUTH_FAILED: "Unable to connect to payment service. Please try again later.",
        PayPalErrorCode.CREDENTIALS_INVALID: "Payment service configuration error. Please contact support.",
        PayPalErrorCode.ORDER_CREATE_FAILED: "Unable to create payment. Please try again.",
        PayPalErrorCode.ORDER_NOT_FOUND: "Payment not found. Please start a new subscription.",
        PayPalErrorCode.ORDER_NOT_APPROVED: "Payment was not approved. Please complete the PayPal approval.",
        PayPalErrorCode.CAPTURE_FAILED: "Payment could not be completed. Please try again.",
        PayPalErrorCode.NETWORK_ERROR: "Network error. Please check your connection and try again.",
        PayPalErrorCode.TIMEOUT: "Request timed out. Please try again.",
        PayPalErrorCode.INVALID_PLAN: "Invalid subscription plan selected.",
        PayPalErrorCode.REFUND_FAILED: "Refund could not be processed. Please contact support."
    }
    return messages.get(error.code, "An unexpected error occurred. Please try again.")


def paypal_error_response(error: PayPalError, status_code: int = 400) -> JSONResponse:
    """Create a structured JSON response from a PayPal error."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error_code": error.code.value if isinstance(error.code, PayPalErrorCode) else error.code,
            "error_message": error.message,
            "error_details": error.details,
            "user_message": get_user_friendly_message(error)
        }
    )


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
async def verify_paypal_config(admin: UserResponse = Depends(require_auth)):
    """
    Debug endpoint to verify PayPal configuration.
    Returns credential status without exposing secrets.
    
    SECURITY:
    - Disabled by default in production
    - Requires authentication
    - When ENABLE_SUBSCRIPTION_DEBUG=false, requires admin privileges
    - Set ENABLE_SUBSCRIPTION_DEBUG=true to allow any authenticated user
    """
    # Check if debug mode is enabled
    if not ENABLE_SUBSCRIPTION_DEBUG:
        # In non-debug mode, require admin privileges
        if not admin.is_admin:
            raise HTTPException(
                status_code=403,
                detail="Debug endpoints are disabled. Set ENABLE_SUBSCRIPTION_DEBUG=true or use admin account."
            )
        logger.warning(f"Admin {admin.email} accessed /verify-paypal debug endpoint")
    
    result = await paypal_service.verify_credentials()
    return result


@router.get("/self-test")
async def paypal_self_test(admin: UserResponse = Depends(require_auth)):
    """
    Run comprehensive PayPal integration self-test.
    
    Tests:
    1. Environment variables are set
    2. OAuth token can be obtained
    3. API is reachable
    
    Returns detailed report of each step.
    
    SECURITY:
    - Disabled by default in production
    - Requires authentication
    - When ENABLE_SUBSCRIPTION_DEBUG=false, requires admin privileges
    - Set ENABLE_SUBSCRIPTION_DEBUG=true to allow any authenticated user
    """
    # Check if debug mode is enabled
    if not ENABLE_SUBSCRIPTION_DEBUG:
        # In non-debug mode, require admin privileges
        if not admin.is_admin:
            raise HTTPException(
                status_code=403,
                detail="Debug endpoints are disabled. Set ENABLE_SUBSCRIPTION_DEBUG=true or use admin account."
            )
        logger.warning(f"Admin {admin.email} accessed /self-test debug endpoint")
    
    report = await paypal_service.self_test()
    return report


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
    
    Also creates a state token that can be used to authenticate the user
    when they return from PayPal (since cookies/tokens may be lost during redirect).
    """
    logger.info(f"Creating order for user {user.id}, plan: {order_data.plan_name}")
    
    try:
        # Create a state token for authentication when user returns from PayPal
        state_token = secrets.token_urlsafe(32)
        
        # Store state token in database with user info
        await db.paypal_states.insert_one({
            'state_token': state_token,
            'user_id': user.id,
            'plan_name': order_data.plan_name,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'expires_at': (datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat()
        })
        logger.info(f"Created state token for user {user.id}")
        
        result = await paypal_service.create_order(
            plan_name=order_data.plan_name,
            user_id=user.id
        )
        
        logger.info(f"Order created successfully: {result['order_id']}")
        
        # Store order_id with state for verification
        await db.paypal_states.update_one(
            {'state_token': state_token},
            {'$set': {'order_id': result['order_id']}}
        )
        
        return {
            "success": True,
            "order_id": result['order_id'],
            "approval_url": result['approval_url'],
            "state_token": state_token,  # Frontend stores this for use on return
            "amount_usd": result['amount_usd'],
            "amount_bhd": result['amount_bhd']
        }
        
    except PayPalError as e:
        logger.error(f"PayPal error creating order: {e.code} - {e.message}")
        return paypal_error_response(e, status_code=400 if e.code == PayPalErrorCode.INVALID_PLAN else 502)
        
    except Exception as e:
        logger.error(f"Unexpected error creating PayPal order: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error_code": "INTERNAL_ERROR",
                "error_message": str(e),
                "error_details": {},
                "user_message": "An unexpected error occurred. Please try again or contact support."
            }
        )


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
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error_code": PayPalErrorCode.ORDER_NOT_APPROVED.value,
                    "error_message": f"Order not approved. Current status: {order_status}",
                    "error_details": {"order_status": order_status},
                    "user_message": "Payment was not approved. Please complete the PayPal approval process."
                }
            )
        
        # Verify the order belongs to this user (custom_id should match)
        custom_id = None
        if order_details.get('purchase_units'):
            custom_id = order_details['purchase_units'][0].get('custom_id')
        
        if custom_id and custom_id != user.id:
            logger.error(f"Order user mismatch: {custom_id} vs {user.id}")
            return JSONResponse(
                status_code=403,
                content={
                    "success": False,
                    "error_code": "ORDER_USER_MISMATCH",
                    "error_message": "This order does not belong to the current user",
                    "error_details": {},
                    "user_message": "This payment belongs to a different account. Please log in with the correct account."
                }
            )
        
        # Capture the payment
        capture_result = await paypal_service.capture_order(capture_data.order_id)
        logger.info(f"Capture result: status={capture_result['status']}")
        
        if capture_result['status'] != 'COMPLETED':
            logger.error(f"Payment not completed: {capture_result}")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error_code": PayPalErrorCode.CAPTURE_FAILED.value,
                    "error_message": f"Payment not completed. Status: {capture_result['status']}",
                    "error_details": {"capture_status": capture_result['status']},
                    "user_message": "Payment could not be completed. Please try again or use a different payment method."
                }
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
            
            # Send confirmation email to user
            user_email_result = email_service.send_subscription_change_email(
                to_email=user_doc.get('email'),
                user_name=user_doc.get('name', 'User'),
                plan_name=plan_display,
                renews_at=renews_at_str
            )
            logger.info(f"Subscription confirmation email to {user_doc.get('email')}: {'sent' if user_email_result else 'failed'}")
            
            # Send admin notification email
            is_new_subscription = True  # From capture-order, typically a new subscription
            monthly_price = float(os.environ.get('MONTHLY_PRICE_BHD', 1.0))
            annual_price = float(os.environ.get('ANNUAL_PRICE_BHD', 10.0))
            amount = f"{monthly_price} BHD" if capture_data.plan_name == 'monthly' else f"{annual_price} BHD"
            
            admin_email_result = email_service.send_admin_subscription_renewal_email(
                user_email=user_doc.get('email'),
                user_name=user_doc.get('name', 'User'),
                plan_name=plan_display,
                amount=amount,
                is_new=is_new_subscription
            )
            logger.info(f"Admin subscription notification email: {'sent' if admin_email_result else 'failed'}")
        except Exception as e:
            logger.error(f"Failed to send subscription email: {e}", exc_info=True)
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
        
    except PayPalError as e:
        logger.error(f"PayPal error capturing order: {e.code} - {e.message}")
        return paypal_error_response(e)
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"Error capturing PayPal order: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error_code": "INTERNAL_ERROR",
                "error_message": str(e),
                "error_details": {},
                "user_message": "An unexpected error occurred. Please contact support if this persists."
            }
        )


class CaptureWithStateRequest(BaseModel):
    """Request body for capturing order with state token (no auth required)"""
    order_id: str
    state_token: str


@router.post("/capture-order-with-state")
async def capture_paypal_order_with_state(request_data: CaptureWithStateRequest):
    """
    Capture a PayPal order after user approval using state token.
    
    This endpoint is used when returning from PayPal redirect where
    authentication cookies/tokens may have been lost. The state token
    (stored before redirect) is used to verify the user and complete the payment.
    
    Returns new auth tokens so the user can be re-authenticated.
    """
    logger.info(f"Capturing order {request_data.order_id} with state token")
    
    try:
        # Verify state token and get user info
        state_doc = await db.paypal_states.find_one({'state_token': request_data.state_token})
        
        if not state_doc:
            logger.error(f"Invalid state token: {request_data.state_token[:20]}...")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error_code": "INVALID_STATE_TOKEN",
                    "error_message": "Invalid or expired state token",
                    "error_details": {},
                    "user_message": "Your session has expired. Please try subscribing again."
                }
            )
        
        # Check expiration
        expires_at = datetime.fromisoformat(state_doc['expires_at'])
        if datetime.now(timezone.utc) > expires_at:
            await db.paypal_states.delete_one({'state_token': request_data.state_token})
            logger.error(f"State token expired for user {state_doc.get('user_id')}")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error_code": "STATE_TOKEN_EXPIRED",
                    "error_message": "State token has expired",
                    "error_details": {},
                    "user_message": "Your session has expired. Please try subscribing again."
                }
            )
        
        user_id = state_doc['user_id']
        plan_name = state_doc['plan_name']
        stored_order_id = state_doc.get('order_id')
        
        # Verify order ID matches if stored
        if stored_order_id and stored_order_id != request_data.order_id:
            logger.warning(f"Order ID mismatch: stored={stored_order_id}, received={request_data.order_id}")
            # Use the order from URL (PayPal's token) as it's more reliable
        
        logger.info(f"State verified for user {user_id}, plan: {plan_name}")
        
        # Verify the order status with PayPal
        order_details = await paypal_service.get_order_details(request_data.order_id)
        order_status = order_details.get('status')
        logger.info(f"Order {request_data.order_id} status: {order_status}")
        
        if order_status != 'APPROVED':
            logger.error(f"Order not approved. Status: {order_status}")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error_code": PayPalErrorCode.ORDER_NOT_APPROVED.value,
                    "error_message": f"Order not approved. Status: {order_status}",
                    "error_details": {"order_status": order_status},
                    "user_message": "Payment was not approved by PayPal. Please complete the approval process."
                }
            )
        
        # Capture the payment
        capture_result = await paypal_service.capture_order(request_data.order_id)
        logger.info(f"Capture result: status={capture_result['status']}")
        
        if capture_result['status'] != 'COMPLETED':
            logger.error(f"Payment not completed: {capture_result}")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error_code": PayPalErrorCode.CAPTURE_FAILED.value,
                    "error_message": f"Payment not completed. Status: {capture_result['status']}",
                    "error_details": {"capture_status": capture_result['status']},
                    "user_message": "Payment could not be completed. Please try again."
                }
            )
        
        # Fetch user details
        user_doc = await db.users.find_one({'id': user_id}, {'_id': 0})
        if not user_doc:
            logger.error(f"User not found: {user_id}")
            return JSONResponse(
                status_code=404,
                content={
                    "success": False,
                    "error_code": "USER_NOT_FOUND",
                    "error_message": "User not found",
                    "error_details": {},
                    "user_message": "Account not found. Please contact support."
                }
            )
        
        # Create/update subscription
        subscription = await subscription_service.create_paid_subscription(
            user_id=user_id,
            plan_name=plan_name,
            gateway_order_id=request_data.order_id,
            gateway_customer_id=capture_result.get('payer_id'),
            capture_id=capture_result.get('capture_id')
        )
        
        logger.info(f"Subscription created/updated: {subscription.id}")
        
        # Update user's active subscription status
        await db.users.update_one(
            {'id': user_id},
            {'$set': {
                'has_active_subscription': True,
                'updated_at': datetime.now(timezone.utc).isoformat()
            }}
        )
        logger.info(f"User {user_id} has_active_subscription set to True")
        
        # Delete used state token
        await db.paypal_states.delete_one({'state_token': request_data.state_token})
        logger.info(f"State token cleaned up for user {user_id}")
        
        # Send confirmation email
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
            
            # Send admin notification email
            monthly_price = float(os.environ.get('MONTHLY_PRICE_BHD', 1.0))
            annual_price = float(os.environ.get('ANNUAL_PRICE_BHD', 10.0))
            amount = f"{monthly_price} BHD" if plan_name == 'monthly' else f"{annual_price} BHD"
            
            email_service.send_admin_subscription_renewal_email(
                user_email=user_doc.get('email'),
                user_name=user_doc.get('name', 'User'),
                plan_name=plan_display,
                amount=amount,
                is_new=True
            )
            logger.info(f"Admin notification email sent for subscription by {user_doc.get('email')}")
        except Exception as e:
            logger.error(f"Failed to send subscription email: {e}")
        
        # Generate new authentication tokens for the user
        access_token = auth_service.create_access_token(user_id, user_doc.get('is_admin', False))
        refresh_token = auth_service.create_refresh_token(user_id)
        
        return {
            "success": True,
            "message": "Subscription activated successfully",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "subscription": {
                "id": subscription.id,
                "plan": subscription.plan_name.value if hasattr(subscription.plan_name, 'value') else str(subscription.plan_name),
                "status": subscription.status.value if hasattr(subscription.status, 'value') else str(subscription.status),
                "renews_at": subscription.renews_at.isoformat() if subscription.renews_at else None
            }
        }
        
    except PayPalError as e:
        logger.error(f"PayPal error capturing order with state: {e.code} - {e.message}")
        return paypal_error_response(e)
        
    except Exception as e:
        logger.error(f"Error capturing PayPal order with state: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error_code": "INTERNAL_ERROR",
                "error_message": str(e),
                "error_details": {},
                "user_message": "An unexpected error occurred. Please contact support."
            }
        )


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
        
    except PayPalError as e:
        logger.error(f"PayPal error during plan change: {e.code} - {e.message}")
        return paypal_error_response(e)
        
    except Exception as e:
        logger.error(f"Error creating plan change order: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error_code": "INTERNAL_ERROR",
                "error_message": str(e),
                "error_details": {},
                "user_message": "Failed to change plan. Please try again."
            }
        )


# PayPal Webhook Handler
@router.post("/webhook/paypal")
async def handle_paypal_webhook(request: Request):
    """
    Handle PayPal webhooks for subscription events.
    
    SECURITY:
    - Verifies webhook signature using PayPal's verification API
    - Only processes events after successful verification
    - Minimal logging to protect PII (full body only if PAYPAL_DEBUG=true)
    
    Events handled:
    - PAYMENT.CAPTURE.COMPLETED: Successful payment
    - PAYMENT.CAPTURE.DENIED: Failed payment
    - BILLING.SUBSCRIPTION.ACTIVATED: New subscription
    - BILLING.SUBSCRIPTION.CANCELLED: Subscription cancelled
    
    Required env vars for verification:
    - PAYPAL_WEBHOOK_ID: Your webhook endpoint ID from PayPal Developer Dashboard
    - PAYPAL_CLIENT_ID: PayPal API client ID
    - PAYPAL_CLIENT_SECRET: PayPal API client secret
    """
    try:
        # Read raw body for signature verification
        body_bytes = await request.body()
        body = await request.json()
        
        # Extract minimal identifying information for logging
        event_type = body.get('event_type', 'UNKNOWN')
        event_id = body.get('id', 'unknown')
        resource = body.get('resource', {})
        resource_id = resource.get('id', 'unknown')
        custom_id = resource.get('custom_id', '')  # Our user ID
        
        # Log minimal info (no PII)
        logger.info(f"PayPal webhook received: event_type={event_type}, event_id={event_id}, resource_id={resource_id[:20] if resource_id else 'N/A'}")
        
        # Full body logging only in debug mode
        if PAYPAL_DEBUG:
            logger.debug(f"Full webhook body: {body}")
        
        # =================================================================
        # SIGNATURE VERIFICATION
        # =================================================================
        is_valid, verification_message = await verify_paypal_webhook_signature(request, body_bytes)
        
        if not is_valid:
            logger.warning(f"PayPal webhook signature verification FAILED: {verification_message}")
            logger.warning(f"Rejected event: event_type={event_type}, event_id={event_id}")
            return JSONResponse(
                status_code=401,
                content={"status": "error", "message": "Webhook signature verification failed"}
            )
        
        logger.info(f"Webhook signature verified: {verification_message}")
        
        # =================================================================
        # EVENT PROCESSING
        # =================================================================
        if event_type == 'PAYMENT.CAPTURE.COMPLETED':
            # Handle successful payment/renewal
            if custom_id:
                logger.info(f"Payment completed for user_ref: {custom_id[:16]}...")
                # Update subscription renewal date
                await db.subscriptions.update_one(
                    {'user_id': custom_id},
                    {'$set': {
                        'last_payment_at': datetime.now(timezone.utc).isoformat(),
                        'payment_status': 'completed'
                    }}
                )
        
        elif event_type == 'PAYMENT.CAPTURE.DENIED':
            # Handle failed payment - log without PII
            logger.warning(f"Payment denied for resource: {resource_id[:20] if resource_id else 'N/A'}")
            if custom_id:
                await db.subscriptions.update_one(
                    {'user_id': custom_id},
                    {'$set': {'payment_status': 'denied'}}
                )
        
        elif event_type == 'BILLING.SUBSCRIPTION.ACTIVATED':
            logger.info(f"Subscription activated: resource_id={resource_id[:20] if resource_id else 'N/A'}")
        
        elif event_type == 'BILLING.SUBSCRIPTION.CANCELLED':
            logger.info(f"Subscription cancelled: resource_id={resource_id[:20] if resource_id else 'N/A'}")
            if custom_id:
                await db.subscriptions.update_one(
                    {'user_id': custom_id},
                    {'$set': {
                        'status': 'cancelled',
                        'cancelled_at': datetime.now(timezone.utc).isoformat()
                    }}
                )
        
        else:
            logger.debug(f"Unhandled webhook event type: {event_type}")
        
        return {"status": "received", "event_id": event_id}
    
    except Exception as e:
        logger.error(f"Webhook processing error: {e}", exc_info=PAYPAL_DEBUG)
        # Return 200 to prevent PayPal retries for processing errors
        # (vs 401 for verification failures which should be retried)
        return {"status": "error", "message": "Processing error"}
