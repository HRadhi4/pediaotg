import os
import httpx
import base64
from typing import Optional, Dict, Any
from datetime import datetime, timedelta, timezone


class PayPalService:
    """
    PayPal Integration Service
    
    Handles:
    - Creating orders for one-time payments
    - Capturing payments after approval
    - Managing subscriptions
    
    TODO: For production:
    - Update PAYPAL_MODE to 'live'
    - Use production credentials
    - Configure webhook endpoints
    """
    
    def __init__(self):
        self.mode = os.environ.get('PAYPAL_MODE', 'sandbox')
        self.client_id = os.environ.get('PAYPAL_CLIENT_ID', '')
        self.client_secret = os.environ.get('PAYPAL_CLIENT_SECRET', '')
        
        # API URLs
        if self.mode == 'live':
            self.base_url = 'https://api-m.paypal.com'
        else:
            self.base_url = 'https://api-m.sandbox.paypal.com'
        
        self.return_url = os.environ.get('PAYPAL_RETURN_URL', 'http://localhost:3000/subscription/success')
        self.cancel_url = os.environ.get('PAYPAL_CANCEL_URL', 'http://localhost:3000/subscription/cancel')
        
        # Pricing in BHD
        self.monthly_price = float(os.environ.get('MONTHLY_PRICE_BHD', 1.0))
        self.annual_price = float(os.environ.get('ANNUAL_PRICE_BHD', 10.0))
        
        self._access_token = None
        self._token_expires = None
    
    async def _get_access_token(self) -> str:
        """Get PayPal OAuth2 access token"""
        # Check if we have a valid cached token
        if self._access_token and self._token_expires:
            if datetime.now(timezone.utc) < self._token_expires:
                return self._access_token
        
        # Request new token
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_base64 = base64.b64encode(auth_string.encode()).decode()
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v1/oauth2/token",
                headers={
                    'Authorization': f'Basic {auth_base64}',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data={'grant_type': 'client-credentials'}
            )
            
            if response.status_code != 200:
                raise Exception(f"PayPal auth failed: {response.text}")
            
            data = response.json()
            self._access_token = data['access_token']
            # Token expires in `expires_in` seconds, subtract 60 for safety
            self._token_expires = datetime.now(timezone.utc) + timedelta(seconds=data['expires_in'] - 60)
            
            return self._access_token
    
    async def create_order(self, plan_name: str, user_id: str) -> Dict[str, Any]:
        """
        Create a PayPal order for a subscription plan
        
        Args:
            plan_name: 'monthly' or 'annual'
            user_id: The user's ID for reference
        
        Returns:
            Dict with order_id and approval_url
        """
        token = await self._get_access_token()
        
        # Determine price based on plan
        if plan_name == 'monthly':
            amount = self.monthly_price
            description = 'PediaOTG Monthly Subscription'
        elif plan_name == 'annual':
            amount = self.annual_price
            description = 'PediaOTG Annual Subscription'
        else:
            raise ValueError(f"Invalid plan: {plan_name}")
        
        order_payload = {
            'intent': 'CAPTURE',
            'purchase_units': [{
                'reference_id': f"{user_id}_{plan_name}_{datetime.now(timezone.utc).isoformat()}",
                'description': description,
                'amount': {
                    'currency_code': 'USD',  # PayPal doesn't support BHD, using USD equivalent
                    'value': str(amount)  # 1 BHD ≈ 2.65 USD, but keeping same number for simplicity
                },
                'custom_id': user_id
            }],
            'application_context': {
                'brand_name': 'PediaOTG',
                'landing_page': 'NO_PREFERENCE',
                'user_action': 'PAY_NOW',
                'return_url': f"{self.return_url}?plan={plan_name}",
                'cancel_url': self.cancel_url
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v2/checkout/orders",
                headers={
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                },
                json=order_payload
            )
            
            if response.status_code not in [200, 201]:
                raise Exception(f"PayPal order creation failed: {response.text}")
            
            order_data = response.json()
            
            # Find approval URL
            approval_url = None
            for link in order_data.get('links', []):
                if link['rel'] == 'approve':
                    approval_url = link['href']
                    break
            
            return {
                'order_id': order_data['id'],
                'status': order_data['status'],
                'approval_url': approval_url
            }
    
    async def capture_order(self, order_id: str) -> Dict[str, Any]:
        """
        Capture payment for an approved order
        
        Args:
            order_id: The PayPal order ID
        
        Returns:
            Dict with capture details including payer info
        """
        token = await self._get_access_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
                headers={
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
            )
            
            if response.status_code not in [200, 201]:
                raise Exception(f"PayPal capture failed: {response.text}")
            
            capture_data = response.json()
            
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
            
            return {
                'order_id': order_id,
                'status': capture_data['status'],
                'payer_id': payer_id,
                'payer_email': payer_email,
                'capture_id': capture_id,
                'user_id': custom_id
            }
    
    async def get_order_details(self, order_id: str) -> Dict[str, Any]:
        """Get details of an existing order"""
        token = await self._get_access_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/v2/checkout/orders/{order_id}",
                headers={
                    'Authorization': f'Bearer {token}'
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"PayPal get order failed: {response.text}")
            
            return response.json()
    
    async def refund_capture(self, capture_id: str, reason: str = "Subscription canceled") -> Dict[str, Any]:
        """
        Refund a captured payment (for cancellations within policy)
        
        TODO: Implement based on your refund policy
        """
        token = await self._get_access_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v2/payments/captures/{capture_id}/refund",
                headers={
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                },
                json={'note_to_payer': reason}
            )
            
            return response.json()
