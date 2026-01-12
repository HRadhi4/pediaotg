"""
=============================================================================
PAYPAL SERVICE - Payment Integration
=============================================================================
Handles PayPal payment processing for subscriptions:
- Creating orders for one-time payments
- Capturing payments after approval
- Managing subscription payments

ENVIRONMENT VARIABLES REQUIRED:
- PAYPAL_MODE: 'sandbox' or 'live'
- PAYPAL_CLIENT_ID: From PayPal Developer Dashboard
- PAYPAL_CLIENT_SECRET: From PayPal Developer Dashboard
- PAYPAL_RETURN_URL: Callback after successful payment
- PAYPAL_CANCEL_URL: Callback if user cancels

NOTE: Sandbox credentials only work with sandbox API, live with live API
=============================================================================
"""

import os
import httpx
import base64
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)


class PayPalService:
    """
    PayPal Integration Service with comprehensive error handling and logging.
    """
    
    def __init__(self):
        """
        Initialize PayPal service with environment configuration.
        Validates credentials are present and logs configuration.
        """
        self.mode = os.environ.get('PAYPAL_MODE', 'sandbox')
        self.client_id = os.environ.get('PAYPAL_CLIENT_ID', '')
        self.client_secret = os.environ.get('PAYPAL_CLIENT_SECRET', '')
        
        # Validate credentials
        if not self.client_id or not self.client_secret:
            error_msg = (
                f"PayPal credentials not configured. Please set PAYPAL_CLIENT_ID and "
                f"PAYPAL_CLIENT_SECRET environment variables for {self.mode} mode. "
                f"Get credentials from https://developer.paypal.com/dashboard/applications"
            )
            logger.error(error_msg)
            # Don't raise here - allow service to initialize but log errors on use
        
        # API URLs based on mode
        if self.mode == 'live':
            self.base_url = 'https://api-m.paypal.com'
        else:
            self.base_url = 'https://api-m.sandbox.paypal.com'
        
        # Get frontend URL for callbacks
        frontend_url = os.environ.get('FRONTEND_URL', 'https://pediatricdash.preview.emergentagent.com')
        self.return_url = os.environ.get('PAYPAL_RETURN_URL', f'{frontend_url}/subscription/success')
        self.cancel_url = os.environ.get('PAYPAL_CANCEL_URL', f'{frontend_url}/subscription/cancel')
        
        # Pricing in BHD
        self.monthly_price = float(os.environ.get('MONTHLY_PRICE_BHD', 1.0))
        self.annual_price = float(os.environ.get('ANNUAL_PRICE_BHD', 10.0))
        
        # Token cache
        self._access_token = None
        self._token_expires = None
        
        # Log configuration (without exposing secrets)
        logger.info(f"PayPal initialized in {self.mode} mode")
        logger.info(f"Client ID: {self.client_id[:15]}..." if self.client_id else "Client ID: NOT SET")
        logger.info(f"Return URL: {self.return_url}")
        logger.info(f"Cancel URL: {self.cancel_url}")
    
    async def _get_access_token(self, retry_count: int = 0) -> str:
        """
        Get PayPal OAuth2 access token with retry logic.
        
        Args:
            retry_count: Current retry attempt (max 3)
            
        Returns:
            Valid access token string
            
        Raises:
            Exception: If authentication fails after retries
        """
        # Check for missing credentials
        if not self.client_id or not self.client_secret:
            raise Exception(
                f"PayPal credentials not configured for {self.mode} mode. "
                "Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables."
            )
        
        # Check if we have a valid cached token
        if self._access_token and self._token_expires:
            if datetime.now(timezone.utc) < self._token_expires:
                return self._access_token
        
        # Request new token
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_base64 = base64.b64encode(auth_string.encode()).decode()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/v1/oauth2/token",
                    headers={
                        'Authorization': f'Basic {auth_base64}',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data={'grant_type': 'client_credentials'}
                )
                
                if response.status_code != 200:
                    error_detail = response.text
                    logger.error(f"PayPal auth failed with status {response.status_code}")
                    logger.error(f"Response: {error_detail}")
                    logger.error(f"Using client ID: {self.client_id[:15]}... in {self.mode} mode")
                    logger.error(f"API URL: {self.base_url}")
                    
                    # Check for specific error types
                    if response.status_code == 401:
                        raise Exception(
                            f"PayPal authentication failed (401). This usually means:\n"
                            f"1. Invalid client ID or secret\n"
                            f"2. Using sandbox credentials with live mode or vice versa\n"
                            f"3. Credentials have been revoked\n"
                            f"Current mode: {self.mode}, API: {self.base_url}"
                        )
                    
                    raise Exception(f"PayPal authentication failed ({response.status_code}): {error_detail}")
                
                data = response.json()
                self._access_token = data['access_token']
                # Token expires in `expires_in` seconds, subtract 60 for safety
                self._token_expires = datetime.now(timezone.utc) + timedelta(seconds=data['expires_in'] - 60)
                
                logger.info("PayPal access token obtained successfully")
                return self._access_token
                
        except httpx.RequestError as e:
            logger.error(f"Network error during PayPal authentication: {e}")
            
            # Retry with exponential backoff
            if retry_count < 3:
                import asyncio
                wait_time = 2 ** retry_count  # 1, 2, 4 seconds
                logger.info(f"Retrying PayPal auth in {wait_time} seconds (attempt {retry_count + 1}/3)")
                await asyncio.sleep(wait_time)
                return await self._get_access_token(retry_count + 1)
            
            raise Exception(f"Failed to connect to PayPal after 3 attempts: {e}")
    
    async def create_order(self, plan_name: str, user_id: str) -> Dict[str, Any]:
        """
        Create a PayPal order for a subscription plan.
        
        Args:
            plan_name: 'monthly' or 'annual'
            user_id: The user's ID for reference
        
        Returns:
            Dict with order_id, status, and approval_url
        """
        logger.info(f"Creating PayPal order for user {user_id}, plan: {plan_name}")
        
        token = await self._get_access_token()
        
        # BHD to USD conversion rate (1 BHD ≈ 2.65 USD)
        BHD_TO_USD = 2.65
        
        # Determine price based on plan and convert to USD
        if plan_name == 'monthly':
            amount_bhd = self.monthly_price
            amount_usd = round(amount_bhd * BHD_TO_USD, 2)
            description = 'PediaOTG Monthly Subscription'
        elif plan_name == 'annual':
            amount_bhd = self.annual_price
            amount_usd = round(amount_bhd * BHD_TO_USD, 2)
            description = 'PediaOTG Annual Subscription'
        else:
            raise ValueError(f"Invalid plan: {plan_name}. Must be 'monthly' or 'annual'")
        
        logger.info(f"Order amount: {amount_bhd} BHD = {amount_usd} USD")
        
        order_payload = {
            'intent': 'CAPTURE',
            'purchase_units': [{
                'reference_id': f"{user_id}_{plan_name}_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
                'description': description,
                'amount': {
                    'currency_code': 'USD',
                    'value': str(amount_usd)
                },
                'custom_id': user_id
            }],
            'application_context': {
                'brand_name': 'Pediatrics On The Go',
                'landing_page': 'NO_PREFERENCE',
                'user_action': 'PAY_NOW',
                'return_url': f"{self.return_url}?plan={plan_name}",
                'cancel_url': self.cancel_url
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/v2/checkout/orders",
                    headers={
                        'Authorization': f'Bearer {token}',
                        'Content-Type': 'application/json'
                    },
                    json=order_payload
                )
                
                if response.status_code not in [200, 201]:
                    logger.error(f"PayPal order creation failed: {response.status_code}")
                    logger.error(f"Response: {response.text}")
                    raise Exception(f"PayPal order creation failed: {response.text}")
                
                order_data = response.json()
                logger.info(f"PayPal order created: {order_data.get('id')}, status: {order_data.get('status')}")
                
                # Find approval URL
                approval_url = None
                for link in order_data.get('links', []):
                    if link['rel'] == 'approve':
                        approval_url = link['href']
                        break
                
                if not approval_url:
                    logger.error(f"No approval URL in response: {order_data}")
                    raise Exception("PayPal order created but no approval URL returned")
                
                logger.info(f"Approval URL: {approval_url}")
                
                return {
                    'order_id': order_data['id'],
                    'status': order_data['status'],
                    'approval_url': approval_url
                }
                
        except httpx.RequestError as e:
            logger.error(f"Network error creating PayPal order: {e}")
            raise Exception(f"Failed to connect to PayPal: {e}")
    
    async def get_order_details(self, order_id: str) -> Dict[str, Any]:
        """
        Get details of an existing order.
        
        Args:
            order_id: The PayPal order ID
            
        Returns:
            Full order details including status
        """
        logger.info(f"Getting order details for: {order_id}")
        
        token = await self._get_access_token()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/v2/checkout/orders/{order_id}",
                    headers={
                        'Authorization': f'Bearer {token}'
                    }
                )
                
                if response.status_code != 200:
                    logger.error(f"PayPal get order failed: {response.status_code}")
                    logger.error(f"Response: {response.text}")
                    raise Exception(f"PayPal get order failed: {response.text}")
                
                order_data = response.json()
                logger.info(f"Order {order_id} status: {order_data.get('status')}")
                
                return order_data
                
        except httpx.RequestError as e:
            logger.error(f"Network error getting PayPal order: {e}")
            raise Exception(f"Failed to connect to PayPal: {e}")
    
    async def capture_order(self, order_id: str) -> Dict[str, Any]:
        """
        Capture payment for an approved order.
        
        Args:
            order_id: The PayPal order ID
        
        Returns:
            Dict with capture details including payer info and status
        """
        logger.info(f"Capturing PayPal order: {order_id}")
        
        token = await self._get_access_token()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
                    headers={
                        'Authorization': f'Bearer {token}',
                        'Content-Type': 'application/json'
                    }
                )
                
                if response.status_code not in [200, 201]:
                    logger.error(f"PayPal capture failed: {response.status_code}")
                    logger.error(f"Response: {response.text}")
                    raise Exception(f"PayPal capture failed: {response.text}")
                
                capture_data = response.json()
                logger.info(f"Capture response status: {capture_data.get('status')}")
                logger.debug(f"Full capture response: {capture_data}")
                
                # Extract relevant information
                payer_id = capture_data.get('payer', {}).get('payer_id')
                payer_email = capture_data.get('payer', {}).get('email_address')
                
                # Get capture ID from purchase units
                capture_id = None
                custom_id = None
                if capture_data.get('purchase_units'):
                    pu = capture_data['purchase_units'][0]
                    custom_id = pu.get('custom_id')
                    if pu.get('payments', {}).get('captures'):
                        capture_id = pu['payments']['captures'][0]['id']
                
                result = {
                    'order_id': order_id,
                    'status': capture_data['status'],
                    'payer_id': payer_id,
                    'payer_email': payer_email,
                    'capture_id': capture_id,
                    'user_id': custom_id
                }
                
                logger.info(f"Capture completed: status={result['status']}, capture_id={capture_id}")
                
                return result
                
        except httpx.RequestError as e:
            logger.error(f"Network error capturing PayPal order: {e}")
            raise Exception(f"Failed to connect to PayPal: {e}")
    
    async def refund_capture(self, capture_id: str, reason: str = "Subscription canceled") -> Dict[str, Any]:
        """
        Refund a captured payment (for cancellations within policy).
        
        Args:
            capture_id: The capture ID to refund
            reason: Reason for refund shown to customer
            
        Returns:
            Refund response from PayPal
        """
        logger.info(f"Refunding capture: {capture_id}")
        
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
                
                result = response.json()
                logger.info(f"Refund response: {result}")
                
                return result
                
        except httpx.RequestError as e:
            logger.error(f"Network error during refund: {e}")
            raise Exception(f"Failed to connect to PayPal: {e}")
    
    async def verify_credentials(self) -> Dict[str, Any]:
        """
        Test PayPal credentials by attempting to get an access token.
        Useful for debugging configuration issues.
        
        Returns:
            Dict with status and configuration info
        """
        try:
            token = await self._get_access_token()
            return {
                "success": True,
                "mode": self.mode,
                "api_url": self.base_url,
                "client_id": f"{self.client_id[:15]}..." if self.client_id else "NOT SET",
                "token_obtained": bool(token)
            }
        except Exception as e:
            return {
                "success": False,
                "mode": self.mode,
                "api_url": self.base_url,
                "client_id": f"{self.client_id[:15]}..." if self.client_id else "NOT SET",
                "error": str(e)
            }
