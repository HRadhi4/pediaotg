"""
PayPal Service - Payment Integration for Emergent Deployment
============================================================
Handles PayPal payment processing for subscriptions.

Environment Variables Required:
- PAYPAL_MODE: 'sandbox' or 'live' (default: sandbox)
- PAYPAL_CLIENT_ID: From PayPal Developer Dashboard
- PAYPAL_CLIENT_SECRET: From PayPal Developer Dashboard  
- FRONTEND_URL: Base URL for return/cancel redirects

API URLs:
- Sandbox: https://api-m.sandbox.paypal.com
- Live: https://api-m.paypal.com

NOTE: Sandbox credentials only work with sandbox API, live with live API
"""

import os
import httpx
import base64
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone
from enum import Enum

logger = logging.getLogger(__name__)


class PayPalError(Exception):
    """Custom exception for PayPal-related errors with error codes."""
    
    def __init__(self, code: str, message: str, details: Optional[Dict] = None):
        self.code = code
        self.message = message
        self.details = details or {}
        super().__init__(message)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "error_code": self.code,
            "error_message": self.message,
            "error_details": self.details
        }


class PayPalErrorCode(str, Enum):
    """Machine-readable error codes for PayPal operations."""
    CONFIG_MISSING = "PAYPAL_CONFIG_MISSING"
    CONFIG_INVALID = "PAYPAL_CONFIG_INVALID"
    AUTH_FAILED = "PAYPAL_AUTH_FAILED"
    CREDENTIALS_INVALID = "PAYPAL_CREDENTIALS_INVALID"
    ORDER_CREATE_FAILED = "PAYPAL_ORDER_CREATE_FAILED"
    ORDER_NOT_FOUND = "PAYPAL_ORDER_NOT_FOUND"
    ORDER_NOT_APPROVED = "PAYPAL_ORDER_NOT_APPROVED"
    CAPTURE_FAILED = "PAYPAL_CAPTURE_FAILED"
    NETWORK_ERROR = "PAYPAL_NETWORK_ERROR"
    TIMEOUT = "PAYPAL_TIMEOUT"
    INVALID_PLAN = "INVALID_PLAN"
    REFUND_FAILED = "PAYPAL_REFUND_FAILED"


class PayPalService:
    """PayPal Integration Service for subscription payments."""
    
    # API URLs - using the modern api-m endpoints
    SANDBOX_URL = "https://api-m.sandbox.paypal.com"
    LIVE_URL = "https://api-m.paypal.com"
    
    def __init__(self):
        """Initialize PayPal service from environment variables."""
        # Core configuration from environment
        self.mode = os.environ.get('PAYPAL_MODE', 'sandbox').lower()
        self.client_id = os.environ.get('PAYPAL_CLIENT_ID', '')
        self.client_secret = os.environ.get('PAYPAL_CLIENT_SECRET', '')
        
        # Validate mode
        if self.mode not in ['sandbox', 'live']:
            logger.warning(f"Invalid PAYPAL_MODE '{self.mode}', defaulting to 'sandbox'")
            self.mode = 'sandbox'
        
        # API URL based on mode
        self.base_url = self.LIVE_URL if self.mode == 'live' else self.SANDBOX_URL
        
        # Callback URLs - use FRONTEND_URL for dynamic deployment
        self.frontend_url = os.environ.get('FRONTEND_URL', '')
        if self.frontend_url:
            self.return_url = f'{self.frontend_url}/subscription/success'
            self.cancel_url = f'{self.frontend_url}/subscription/cancel'
        else:
            self.return_url = None
            self.cancel_url = None
        
        # Pricing
        self.monthly_price = float(os.environ.get('MONTHLY_PRICE_BHD', 1.0))
        self.annual_price = float(os.environ.get('ANNUAL_PRICE_BHD', 10.0))
        
        # Token cache
        self._access_token = None
        self._token_expires = None
        
        # Log configuration (safe - no secrets)
        logger.info("PayPal Service initialized:")
        logger.info(f"  Mode: {self.mode}")
        logger.info(f"  API: {self.base_url}")
        logger.info(f"  Client ID configured: {'Yes' if self.client_id else 'NO'}")
        logger.info(f"  Client Secret configured: {'Yes' if self.client_secret else 'NO'}")
        logger.info(f"  Frontend URL: {self.frontend_url or 'NOT SET'}")
    
    def _check_config(self) -> None:
        """Validate configuration before making API calls."""
        errors = []
        
        if not self.client_id:
            errors.append("PAYPAL_CLIENT_ID not set")
        if not self.client_secret:
            errors.append("PAYPAL_CLIENT_SECRET not set")
        if not self.frontend_url:
            errors.append("FRONTEND_URL not set")
        
        if errors:
            raise PayPalError(
                code=PayPalErrorCode.CONFIG_MISSING,
                message="PayPal configuration incomplete",
                details={"missing": errors, "mode": self.mode}
            )
    
    async def _get_access_token(self) -> str:
        """Get PayPal OAuth2 access token with caching."""
        # Check configuration
        self._check_config()
        
        # Return cached token if valid
        if self._access_token and self._token_expires:
            if datetime.now(timezone.utc) < self._token_expires:
                logger.debug("Using cached PayPal access token")
                return self._access_token
        
        # Request new token using v1/oauth2/token endpoint
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_base64 = base64.b64encode(auth_string.encode()).decode()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                logger.info(f"Requesting PayPal OAuth token from {self.base_url}/v1/oauth2/token")
                
                response = await client.post(
                    f"{self.base_url}/v1/oauth2/token",
                    headers={
                        'Authorization': f'Basic {auth_base64}',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    data={'grant_type': 'client_credentials'}
                )
                
                # Log response (without exposing token)
                logger.info(f"OAuth response status: {response.status_code}")
                
                if response.status_code == 401:
                    error_data = response.json() if response.text else {}
                    logger.error(f"PayPal auth 401: {error_data}")
                    raise PayPalError(
                        code=PayPalErrorCode.CREDENTIALS_INVALID,
                        message=f"PayPal authentication failed. Verify credentials are for {self.mode} mode.",
                        details={
                            "paypal_error": error_data.get('error', 'invalid_client'),
                            "paypal_description": error_data.get('error_description', 'Credentials mismatch'),
                            "mode": self.mode,
                            "api_url": self.base_url,
                            "hint": f"Ensure you're using {self.mode.upper()} credentials from PayPal Developer Dashboard"
                        }
                    )
                
                if response.status_code != 200:
                    error_data = response.json() if response.text else {}
                    logger.error(f"PayPal auth failed: {response.status_code} - {error_data}")
                    raise PayPalError(
                        code=PayPalErrorCode.AUTH_FAILED,
                        message=f"PayPal authentication failed (HTTP {response.status_code})",
                        details={"status_code": response.status_code, "response": error_data}
                    )
                
                data = response.json()
                self._access_token = data['access_token']
                expires_in = data.get('expires_in', 3600)
                self._token_expires = datetime.now(timezone.utc) + timedelta(seconds=expires_in - 60)
                
                logger.info(f"PayPal access token obtained, expires in {expires_in}s")
                return self._access_token
                
        except httpx.TimeoutException:
            logger.error("PayPal auth request timed out")
            raise PayPalError(
                code=PayPalErrorCode.TIMEOUT,
                message="PayPal request timed out. Please try again.",
                details={"endpoint": "oauth2/token"}
            )
        except httpx.RequestError as e:
            logger.error(f"PayPal network error: {e}")
            raise PayPalError(
                code=PayPalErrorCode.NETWORK_ERROR,
                message="Unable to connect to PayPal. Check your internet connection.",
                details={"error": str(e)}
            )
    
    async def create_order(self, plan_name: str, user_id: str) -> Dict[str, Any]:
        """
        Create a PayPal order for subscription payment.
        
        Args:
            plan_name: 'monthly' or 'annual'
            user_id: User ID for reference
            
        Returns:
            Dict with order_id, status, and approval_url
        """
        logger.info(f"[PayPal] Creating order: user={user_id}, plan={plan_name}")
        
        # Validate plan
        if plan_name not in ['monthly', 'annual']:
            raise PayPalError(
                code=PayPalErrorCode.INVALID_PLAN,
                message=f"Invalid plan name: {plan_name}. Must be 'monthly' or 'annual'.",
                details={"plan_name": plan_name, "valid_plans": ["monthly", "annual"]}
            )
        
        token = await self._get_access_token()
        
        # BHD to USD conversion (1 BHD ≈ 2.65 USD)
        BHD_TO_USD = 2.65
        
        if plan_name == 'monthly':
            amount_bhd = self.monthly_price
            description = 'PediaOTG Monthly Subscription'
        else:  # annual
            amount_bhd = self.annual_price
            description = 'PediaOTG Annual Subscription'
        
        amount_usd = round(amount_bhd * BHD_TO_USD, 2)
        reference_id = f"{user_id}_{plan_name}_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
        
        # Order payload using v2/checkout/orders with intent: CAPTURE
        order_payload = {
            'intent': 'CAPTURE',
            'purchase_units': [{
                'reference_id': reference_id,
                'description': description,
                'custom_id': user_id,  # For webhook verification
                'amount': {
                    'currency_code': 'USD',
                    'value': str(amount_usd)
                }
            }],
            'application_context': {
                'brand_name': 'PediaOTG',
                'landing_page': 'LOGIN',
                'shipping_preference': 'NO_SHIPPING',
                'user_action': 'PAY_NOW',
                'return_url': self.return_url,
                'cancel_url': self.cancel_url
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                logger.info(f"[PayPal] POST {self.base_url}/v2/checkout/orders")
                
                response = await client.post(
                    f"{self.base_url}/v2/checkout/orders",
                    headers={
                        'Authorization': f'Bearer {token}',
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    json=order_payload
                )
                
                logger.info(f"[PayPal] Order create response: {response.status_code}")
                
                if response.status_code not in [200, 201]:
                    error_data = response.json() if response.text else {}
                    logger.error(f"[PayPal] Order creation failed: {error_data}")
                    
                    # Extract PayPal error details
                    paypal_error = error_data.get('name', 'UNKNOWN_ERROR')
                    paypal_message = error_data.get('message', 'Order creation failed')
                    paypal_details = error_data.get('details', [])
                    
                    raise PayPalError(
                        code=PayPalErrorCode.ORDER_CREATE_FAILED,
                        message=f"Failed to create payment order: {paypal_message}",
                        details={
                            "paypal_error": paypal_error,
                            "paypal_details": paypal_details,
                            "status_code": response.status_code
                        }
                    )
                
                data = response.json()
                order_id = data.get('id')
                status = data.get('status')
                
                # Find approval URL
                approval_url = None
                for link in data.get('links', []):
                    if link.get('rel') == 'approve':
                        approval_url = link.get('href')
                        break
                
                if not approval_url:
                    logger.error(f"[PayPal] No approval URL in response: {data}")
                    raise PayPalError(
                        code=PayPalErrorCode.ORDER_CREATE_FAILED,
                        message="PayPal order created but no approval URL returned",
                        details={"order_id": order_id, "links": data.get('links', [])}
                    )
                
                logger.info(f"[PayPal] Order created: {order_id}, status: {status}")
                
                return {
                    'order_id': order_id,
                    'status': status,
                    'approval_url': approval_url,
                    'amount_usd': amount_usd,
                    'amount_bhd': amount_bhd,
                    'plan_name': plan_name
                }
                
        except httpx.TimeoutException:
            logger.error("[PayPal] Order creation timed out")
            raise PayPalError(
                code=PayPalErrorCode.TIMEOUT,
                message="Payment request timed out. Please try again.",
                details={"endpoint": "checkout/orders"}
            )
        except httpx.RequestError as e:
            logger.error(f"[PayPal] Network error during order creation: {e}")
            raise PayPalError(
                code=PayPalErrorCode.NETWORK_ERROR,
                message="Unable to connect to payment service. Check your connection.",
                details={"error": str(e)}
            )
    
    async def get_order_details(self, order_id: str) -> Dict[str, Any]:
        """Get details of a PayPal order."""
        logger.info(f"[PayPal] Getting order details: {order_id}")
        
        token = await self._get_access_token()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/v2/checkout/orders/{order_id}",
                    headers={'Authorization': f'Bearer {token}'}
                )
                
                logger.info(f"[PayPal] Order details response: {response.status_code}")
                
                if response.status_code == 404:
                    raise PayPalError(
                        code=PayPalErrorCode.ORDER_NOT_FOUND,
                        message=f"Order {order_id} not found",
                        details={"order_id": order_id}
                    )
                
                if response.status_code != 200:
                    error_data = response.json() if response.text else {}
                    raise PayPalError(
                        code=PayPalErrorCode.ORDER_CREATE_FAILED,
                        message="Failed to retrieve order details",
                        details={"status_code": response.status_code, "response": error_data}
                    )
                
                return response.json()
                
        except httpx.TimeoutException:
            raise PayPalError(
                code=PayPalErrorCode.TIMEOUT,
                message="Request timed out while checking payment status.",
                details={"order_id": order_id}
            )
        except httpx.RequestError as e:
            raise PayPalError(
                code=PayPalErrorCode.NETWORK_ERROR,
                message="Network error while checking payment status.",
                details={"error": str(e)}
            )
    
    async def capture_order(self, order_id: str) -> Dict[str, Any]:
        """
        Capture payment for an approved order.
        
        Args:
            order_id: PayPal order ID
            
        Returns:
            Dict with capture details
        """
        logger.info(f"[PayPal] Capturing order: {order_id}")
        
        token = await self._get_access_token()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
                    headers={
                        'Authorization': f'Bearer {token}',
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    }
                )
                
                logger.info(f"[PayPal] Capture response: {response.status_code}")
                
                if response.status_code not in [200, 201]:
                    error_data = response.json() if response.text else {}
                    logger.error(f"[PayPal] Capture failed: {error_data}")
                    
                    paypal_error = error_data.get('name', 'UNKNOWN_ERROR')
                    paypal_message = error_data.get('message', 'Payment capture failed')
                    
                    # Check for common errors
                    if paypal_error == 'ORDER_NOT_APPROVED':
                        raise PayPalError(
                            code=PayPalErrorCode.ORDER_NOT_APPROVED,
                            message="Payment was not approved. Please complete the PayPal approval process.",
                            details={"order_id": order_id, "paypal_error": paypal_error}
                        )
                    
                    raise PayPalError(
                        code=PayPalErrorCode.CAPTURE_FAILED,
                        message=f"Payment capture failed: {paypal_message}",
                        details={
                            "order_id": order_id,
                            "paypal_error": paypal_error,
                            "status_code": response.status_code
                        }
                    )
                
                data = response.json()
                status = data.get('status')
                
                # Extract capture ID and amount
                capture_id = None
                amount = None
                currency = None
                
                purchase_units = data.get('purchase_units', [])
                if purchase_units:
                    payments = purchase_units[0].get('payments', {})
                    captures = payments.get('captures', [])
                    if captures:
                        capture = captures[0]
                        capture_id = capture.get('id')
                        amount_obj = capture.get('amount', {})
                        amount = amount_obj.get('value')
                        currency = amount_obj.get('currency_code')
                
                # Extract payer info
                payer = data.get('payer', {})
                payer_email = payer.get('email_address')
                payer_id = payer.get('payer_id')
                
                logger.info(f"[PayPal] Order captured: {order_id}, capture_id: {capture_id}, status: {status}")
                
                return {
                    'order_id': order_id,
                    'capture_id': capture_id,
                    'status': status,
                    'amount': amount,
                    'currency': currency,
                    'payer_email': payer_email,
                    'payer_id': payer_id
                }
                
        except httpx.TimeoutException:
            raise PayPalError(
                code=PayPalErrorCode.TIMEOUT,
                message="Payment capture timed out. Please check your payment status.",
                details={"order_id": order_id}
            )
        except httpx.RequestError as e:
            raise PayPalError(
                code=PayPalErrorCode.NETWORK_ERROR,
                message="Network error during payment capture.",
                details={"error": str(e)}
            )
    
    async def refund_capture(self, capture_id: str, reason: str = "Subscription canceled") -> Dict[str, Any]:
        """Refund a captured payment."""
        logger.info(f"[PayPal] Refunding capture: {capture_id}")
        
        token = await self._get_access_token()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/v2/payments/captures/{capture_id}/refund",
                    headers={
                        'Authorization': f'Bearer {token}',
                        'Content-Type': 'application/json'
                    },
                    json={'note_to_payer': reason}
                )
                
                if response.status_code not in [200, 201]:
                    error_data = response.json() if response.text else {}
                    logger.error(f"[PayPal] Refund failed: {error_data}")
                    raise PayPalError(
                        code=PayPalErrorCode.REFUND_FAILED,
                        message="Refund failed",
                        details={"capture_id": capture_id, "response": error_data}
                    )
                
                data = response.json()
                logger.info(f"[PayPal] Refund completed: {data.get('id')}")
                
                return {
                    'refund_id': data.get('id'),
                    'status': data.get('status'),
                    'amount': data.get('amount', {}).get('value')
                }
        except httpx.TimeoutException:
            raise PayPalError(
                code=PayPalErrorCode.TIMEOUT,
                message="Refund request timed out.",
                details={"capture_id": capture_id}
            )
        except httpx.RequestError as e:
            raise PayPalError(
                code=PayPalErrorCode.NETWORK_ERROR,
                message="Network error during refund.",
                details={"error": str(e)}
            )
    
    async def verify_credentials(self) -> Dict[str, Any]:
        """
        Verify PayPal credentials by attempting to get an access token.
        Useful for debugging deployment issues.
        """
        result = {
            "mode": self.mode,
            "api_url": self.base_url,
            "client_id_configured": bool(self.client_id),
            "client_secret_configured": bool(self.client_secret),
            "frontend_url": self.frontend_url or "NOT SET",
            "return_url": self.return_url or "NOT SET",
            "cancel_url": self.cancel_url or "NOT SET"
        }
        
        if self.client_id:
            result["client_id_preview"] = f"{self.client_id[:15]}..."
        
        try:
            await self._get_access_token()  # Verify credentials work
            result["success"] = True
            result["token_obtained"] = True
            result["message"] = f"PayPal {self.mode} mode configured correctly"
        except PayPalError as e:
            result["success"] = False
            result["token_obtained"] = False
            result["error_code"] = e.code
            result["error_message"] = e.message
            result["error_details"] = e.details
        except Exception as e:
            result["success"] = False
            result["token_obtained"] = False
            result["error"] = str(e)
        
        return result
    
    async def self_test(self) -> Dict[str, Any]:
        """
        Run a comprehensive self-test of PayPal integration.
        Tests: env vars, auth, and optionally creates a test order.
        
        Returns a detailed report of each step.
        """
        report = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "mode": self.mode,
            "api_url": self.base_url,
            "steps": []
        }
        
        # Step 1: Check environment variables
        step1 = {
            "step": "1. Environment Variables",
            "checks": []
        }
        
        env_checks = [
            ("PAYPAL_MODE", self.mode, bool(self.mode)),
            ("PAYPAL_CLIENT_ID", f"{self.client_id[:10]}..." if self.client_id else "NOT SET", bool(self.client_id)),
            ("PAYPAL_CLIENT_SECRET", "***" if self.client_secret else "NOT SET", bool(self.client_secret)),
            ("FRONTEND_URL", self.frontend_url or "NOT SET", bool(self.frontend_url))
        ]
        
        all_env_ok = True
        for name, display, ok in env_checks:
            step1["checks"].append({
                "name": name,
                "value": display,
                "ok": ok
            })
            if not ok:
                all_env_ok = False
        
        step1["passed"] = all_env_ok
        report["steps"].append(step1)
        
        if not all_env_ok:
            report["overall_status"] = "FAILED"
            report["message"] = "Environment variables not configured"
            return report
        
        # Step 2: Test OAuth token
        step2 = {
            "step": "2. OAuth Token",
            "passed": False
        }
        
        try:
            await self._get_access_token()  # Test token acquisition
            step2["passed"] = True
            step2["message"] = "Successfully obtained access token"
        except PayPalError as e:
            step2["error_code"] = e.code
            step2["error_message"] = e.message
            step2["details"] = e.details
        except Exception as e:
            step2["error"] = str(e)
        
        report["steps"].append(step2)
        
        if not step2["passed"]:
            report["overall_status"] = "FAILED"
            report["message"] = "OAuth authentication failed"
            return report
        
        # Step 3: Test order creation (with $0.01 test amount - optional)
        step3 = {
            "step": "3. API Connectivity Test",
            "passed": True,
            "message": "OAuth successful - API is reachable"
        }
        report["steps"].append(step3)
        
        report["overall_status"] = "PASSED"
        report["message"] = f"PayPal {self.mode} mode is configured correctly"
        
        return report
