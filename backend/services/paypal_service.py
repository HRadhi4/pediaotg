"""
PayPal Service - Payment Integration for Emergent Deployment
============================================================
Handles PayPal payment processing for subscriptions.

Environment Variables Required:
- PAYPAL_MODE: 'sandbox' or 'live'
- PAYPAL_CLIENT_ID: From PayPal Developer Dashboard
- PAYPAL_CLIENT_SECRET: From PayPal Developer Dashboard  
- FRONTEND_URL: Base URL for return/cancel redirects
"""

import os
import httpx
import base64
import logging
from typing import Dict, Any
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)


class PayPalService:
    """PayPal Integration Service for subscription payments."""
    
    def __init__(self):
        """Initialize PayPal service from environment variables."""
        # Core configuration from environment
        self.mode = os.environ.get('PAYPAL_MODE', 'sandbox')
        self.client_id = os.environ.get('PAYPAL_CLIENT_ID', '')
        self.client_secret = os.environ.get('PAYPAL_CLIENT_SECRET', '')
        
        # API URL based on mode
        if self.mode == 'live':
            self.base_url = 'https://api-m.paypal.com'
        else:
            self.base_url = 'https://api-m.sandbox.paypal.com'
        
        # Callback URLs - use FRONTEND_URL for dynamic deployment
        frontend_url = os.environ.get('FRONTEND_URL', '')
        if not frontend_url:
            raise ValueError("FRONTEND_URL environment variable is required")
        
        self.return_url = f'{frontend_url}/subscription/success'
        self.cancel_url = f'{frontend_url}/subscription/cancel'
        
        # Pricing
        self.monthly_price = float(os.environ.get('MONTHLY_PRICE_BHD', 1.0))
        self.annual_price = float(os.environ.get('ANNUAL_PRICE_BHD', 10.0))
        
        # Token cache
        self._access_token = None
        self._token_expires = None
        
        # Log configuration (safe)
        logger.info("PayPal Service initialized:")
        logger.info(f"  Mode: {self.mode}")
        logger.info(f"  API: {self.base_url}")
        logger.info(f"  Client ID: {self.client_id[:15]}..." if self.client_id else "  Client ID: NOT SET")
        logger.info(f"  Return URL: {self.return_url}")
    
    async def _get_access_token(self) -> str:
        """Get PayPal OAuth2 access token with caching."""
        # Return cached token if valid
        if self._access_token and self._token_expires:
            if datetime.now(timezone.utc) < self._token_expires:
                return self._access_token
        
        # Validate credentials
        if not self.client_id or not self.client_secret:
            raise Exception(
                f"PayPal credentials not configured for {self.mode} mode. "
                "Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET."
            )
        
        # Request new token
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_base64 = base64.b64encode(auth_string.encode()).decode()
        
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
                logger.error(f"PayPal auth failed: {response.status_code}")
                logger.error(f"Response: {response.text}")
                
                if response.status_code == 401:
                    raise Exception(
                        f"PayPal authentication failed (401). Check that:\n"
                        f"1. Client ID and Secret are correct\n"
                        f"2. Using {self.mode} credentials with {self.base_url}\n"
                        f"3. Credentials haven't been revoked"
                    )
                raise Exception(f"PayPal auth failed ({response.status_code})")
            
            data = response.json()
            self._access_token = data['access_token']
            self._token_expires = datetime.now(timezone.utc) + timedelta(seconds=data['expires_in'] - 60)
            
            logger.info("PayPal access token obtained successfully")
            return self._access_token
    
    async def create_order(self, plan_name: str, user_id: str) -> Dict[str, Any]:
        """
        Create a PayPal order for subscription payment.
        
        Args:
            plan_name: 'monthly' or 'annual'
            user_id: User ID for reference
            
        Returns:
            Dict with order_id, status, and approval_url
        """
        logger.info(f"Creating order: user={user_id}, plan={plan_name}")
        
        token = await self._get_access_token()
        
        # BHD to USD conversion (1 BHD ≈ 2.65 USD)
        BHD_TO_USD = 2.65
        
        if plan_name == 'monthly':
            amount_bhd = self.monthly_price
            description = 'PediaOTG Monthly Subscription'
        elif plan_name == 'annual':
            amount_bhd = self.annual_price
            description = 'PediaOTG Annual Subscription'
        else:
            raise ValueError(f"Invalid plan: {plan_name}")
        
        amount_usd = round(amount_bhd * BHD_TO_USD, 2)
        
        order_payload = {
            'intent': 'CAPTURE',
            'purchase_units': [{
                'reference_id': f"{user_id}_{plan_name}_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
                'description': description,
                'amount': {
                    'currency_code': 'USD',
                    'value': str(amount_usd)
                }
            }],
            'application_context': {
                'brand_name': 'PediaOTG',
                'landing_page': 'LOGIN',
                'user_action': 'PAY_NOW',
                'return_url': self.return_url,
                'cancel_url': self.cancel_url
            }
        }
        
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
                logger.error(f"Order creation failed: {response.status_code}")
                logger.error(f"Response: {response.text}")
                raise Exception(f"Failed to create PayPal order: {response.text}")
            
            data = response.json()
            order_id = data.get('id')
            status = data.get('status')
            
            # Find approval URL
            approval_url = None
            for link in data.get('links', []):
                if link.get('rel') == 'approve':
                    approval_url = link.get('href')
                    break
            
            logger.info(f"Order created: {order_id}, status: {status}")
            
            return {
                'order_id': order_id,
                'status': status,
                'approval_url': approval_url,
                'amount_usd': amount_usd,
                'amount_bhd': amount_bhd
            }
    
    async def capture_order(self, order_id: str) -> Dict[str, Any]:
        """
        Capture payment for an approved order.
        
        Args:
            order_id: PayPal order ID
            
        Returns:
            Dict with capture details
        """
        logger.info(f"Capturing order: {order_id}")
        
        token = await self._get_access_token()
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
                headers={
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
            )
            
            if response.status_code not in [200, 201]:
                logger.error(f"Capture failed: {response.status_code}")
                logger.error(f"Response: {response.text}")
                raise Exception(f"Failed to capture order: {response.text}")
            
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
            
            logger.info(f"Order captured: {order_id}, capture_id: {capture_id}, status: {status}")
            
            return {
                'order_id': order_id,
                'capture_id': capture_id,
                'status': status,
                'amount': amount,
                'currency': currency,
                'payer_email': payer_email,
                'payer_id': payer_id
            }
    
    async def get_order_details(self, order_id: str) -> Dict[str, Any]:
        """Get details of a PayPal order."""
        token = await self._get_access_token()
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.base_url}/v2/checkout/orders/{order_id}",
                headers={'Authorization': f'Bearer {token}'}
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to get order: {response.text}")
            
            return response.json()
    
    async def refund_capture(self, capture_id: str, reason: str = "Subscription canceled") -> Dict[str, Any]:
        """Refund a captured payment."""
        logger.info(f"Refunding capture: {capture_id}")
        
        token = await self._get_access_token()
        
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
                logger.error(f"Refund failed: {response.status_code}")
                raise Exception(f"Failed to refund: {response.text}")
            
            data = response.json()
            logger.info(f"Refund completed: {data.get('id')}")
            
            return {
                'refund_id': data.get('id'),
                'status': data.get('status'),
                'amount': data.get('amount', {}).get('value')
            }
    
    async def verify_credentials(self) -> Dict[str, Any]:
        """
        Verify PayPal credentials by attempting to get an access token.
        Useful for debugging deployment issues.
        """
        try:
            token = await self._get_access_token()
            return {
                "success": True,
                "mode": self.mode,
                "api_url": self.base_url,
                "client_id": f"{self.client_id[:15]}..." if self.client_id else "NOT SET",
                "client_secret_preview": f"{self.client_secret[:5]}...{self.client_secret[-5:]}" if len(self.client_secret) > 10 else "NOT SET",
                "token_obtained": bool(token),
                "return_url": self.return_url,
                "cancel_url": self.cancel_url
            }
        except Exception as e:
            return {
                "success": False,
                "mode": self.mode,
                "api_url": self.base_url,
                "client_id": f"{self.client_id[:15]}..." if self.client_id else "NOT SET",
                "client_secret_preview": f"{self.client_secret[:5]}...{self.client_secret[-5:]}" if len(self.client_secret) > 10 else "NOT SET",
                "error": str(e),
                "return_url": self.return_url,
                "cancel_url": self.cancel_url
            }
