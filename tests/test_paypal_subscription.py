"""
=============================================================================
PayPal Subscription State-Based Authentication Tests
=============================================================================
Tests for the PayPal subscription flow with state-based authentication:
1. /api/subscription/create-order - Returns state_token along with order_id
2. /api/subscription/capture-order-with-state - Uses state_token for auth
3. Invalid/expired state token handling
=============================================================================
"""

import pytest
import requests
import os
import json
from datetime import datetime

# Use the public URL for testing
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://subscription-alerts-1.preview.emergentagent.com').rstrip('/')

# Test credentials
TESTER_EMAIL = "test@pedotg.com"
TESTER_PASSWORD = "SMC2000"
ADMIN_EMAIL = "admin@pedotg.com"
ADMIN_PASSWORD = "SMC159951"


class TestSubscriptionPricing:
    """Test subscription pricing endpoint (no auth required)"""
    
    def test_get_pricing(self):
        """Test GET /api/subscription/pricing returns correct pricing info"""
        response = requests.get(f"{BASE_URL}/api/subscription/pricing")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "monthly_price" in data, "Missing monthly_price"
        assert "annual_price" in data, "Missing annual_price"
        assert "currency" in data, "Missing currency"
        assert "trial_days" in data, "Missing trial_days"
        
        # Verify values
        assert data["currency"] == "BHD", f"Expected BHD, got {data['currency']}"
        assert data["monthly_price"] == 1.0, f"Expected 1.0, got {data['monthly_price']}"
        assert data["annual_price"] == 10.0, f"Expected 10.0, got {data['annual_price']}"
        
        print(f"✓ Pricing endpoint working: {data}")


class TestCreateOrder:
    """Test /api/subscription/create-order endpoint"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token for tester account"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TESTER_EMAIL, "password": TESTER_PASSWORD}
        )
        
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.status_code} - {response.text}")
        
        data = response.json()
        return data.get("access_token")
    
    def test_create_order_returns_state_token(self, auth_token):
        """Test that create-order returns state_token along with order_id and approval_url"""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/subscription/create-order",
            headers=headers,
            json={"plan_name": "monthly"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Verify all required fields are present
        assert data.get("success") == True, "Expected success=True"
        assert "order_id" in data, "Missing order_id in response"
        assert "approval_url" in data, "Missing approval_url in response"
        assert "state_token" in data, "CRITICAL: Missing state_token in response - this is the key fix"
        
        # Verify state_token is a non-empty string
        assert isinstance(data["state_token"], str), "state_token should be a string"
        assert len(data["state_token"]) > 20, "state_token should be a secure token (>20 chars)"
        
        # Verify approval_url is a PayPal URL
        assert "paypal.com" in data["approval_url"], "approval_url should be a PayPal URL"
        
        print(f"✓ Create order returns state_token: {data['state_token'][:20]}...")
        print(f"✓ Order ID: {data['order_id']}")
        print(f"✓ Approval URL: {data['approval_url'][:50]}...")
        
        return data
    
    def test_create_order_annual_plan(self, auth_token):
        """Test create-order with annual plan"""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/subscription/create-order",
            headers=headers,
            json={"plan_name": "annual"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("success") == True
        assert "state_token" in data, "Missing state_token for annual plan"
        
        print(f"✓ Annual plan order created with state_token")
    
    def test_create_order_requires_auth(self):
        """Test that create-order requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/subscription/create-order",
            headers={"Content-Type": "application/json"},
            json={"plan_name": "monthly"}
        )
        
        # Should return 401 or 403 without auth
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
        print(f"✓ Create order correctly requires authentication")


class TestCaptureOrderWithState:
    """Test /api/subscription/capture-order-with-state endpoint"""
    
    def test_invalid_state_token_rejected(self):
        """Test that invalid state tokens are rejected with appropriate error"""
        response = requests.post(
            f"{BASE_URL}/api/subscription/capture-order-with-state",
            headers={"Content-Type": "application/json"},
            json={
                "order_id": "FAKE_ORDER_123",
                "state_token": "invalid_state_token_12345"
            }
        )
        
        # Should return 400 for invalid state token
        assert response.status_code == 400, f"Expected 400 for invalid state, got {response.status_code}"
        
        data = response.json()
        assert "detail" in data, "Missing error detail"
        assert "invalid" in data["detail"].lower() or "expired" in data["detail"].lower(), \
            f"Error message should mention invalid/expired: {data['detail']}"
        
        print(f"✓ Invalid state token correctly rejected: {data['detail']}")
    
    def test_empty_state_token_rejected(self):
        """Test that empty state tokens are rejected"""
        response = requests.post(
            f"{BASE_URL}/api/subscription/capture-order-with-state",
            headers={"Content-Type": "application/json"},
            json={
                "order_id": "FAKE_ORDER_123",
                "state_token": ""
            }
        )
        
        # Should return 400 or 422 for empty state token
        assert response.status_code in [400, 422], f"Expected 400/422 for empty state, got {response.status_code}"
        print(f"✓ Empty state token correctly rejected")
    
    def test_capture_endpoint_exists(self):
        """Test that the capture-order-with-state endpoint exists"""
        # Just verify the endpoint exists and accepts POST
        response = requests.post(
            f"{BASE_URL}/api/subscription/capture-order-with-state",
            headers={"Content-Type": "application/json"},
            json={
                "order_id": "test",
                "state_token": "test"
            }
        )
        
        # Should not return 404 (endpoint exists)
        assert response.status_code != 404, "capture-order-with-state endpoint not found"
        # Should return 400 for invalid state (not 500)
        assert response.status_code == 400, f"Expected 400 for invalid state, got {response.status_code}"
        
        print(f"✓ capture-order-with-state endpoint exists and responds correctly")


class TestStateTokenFlow:
    """Test the complete state token flow (create -> store -> verify)"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token for tester account"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TESTER_EMAIL, "password": TESTER_PASSWORD}
        )
        
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.status_code}")
        
        return response.json().get("access_token")
    
    def test_state_token_stored_in_database(self, auth_token):
        """Test that state token is created and stored when creating order"""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        # Create order
        response = requests.post(
            f"{BASE_URL}/api/subscription/create-order",
            headers=headers,
            json={"plan_name": "monthly"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        state_token = data.get("state_token")
        order_id = data.get("order_id")
        
        assert state_token, "No state_token returned"
        assert order_id, "No order_id returned"
        
        # The state token should be stored in database
        # We can verify by trying to use it (it won't work because order isn't approved,
        # but it should give a different error than "invalid state token")
        
        capture_response = requests.post(
            f"{BASE_URL}/api/subscription/capture-order-with-state",
            headers={"Content-Type": "application/json"},
            json={
                "order_id": order_id,
                "state_token": state_token
            }
        )
        
        # Should NOT return "invalid state token" error since token is valid
        # Instead should fail on PayPal order status (not approved yet)
        capture_data = capture_response.json()
        
        if capture_response.status_code == 400:
            # Should be a PayPal-related error, not state token error
            error_detail = capture_data.get("detail", "").lower()
            # Valid state token should pass validation, fail on PayPal status
            assert "not approved" in error_detail or "status" in error_detail or "paypal" in error_detail, \
                f"State token should be valid, error should be about PayPal status: {capture_data}"
            print(f"✓ State token is valid and stored - PayPal order not approved yet (expected)")
        else:
            print(f"✓ State token flow working, response: {capture_response.status_code}")


class TestSubscriptionStatus:
    """Test subscription status endpoint"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TESTER_EMAIL, "password": TESTER_PASSWORD}
        )
        
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.status_code}")
        
        return response.json().get("access_token")
    
    def test_get_subscription_status(self, auth_token):
        """Test GET /api/subscription/status returns subscription info"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        response = requests.get(
            f"{BASE_URL}/api/subscription/status",
            headers=headers
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "has_subscription" in data, "Missing has_subscription field"
        
        print(f"✓ Subscription status: {data}")


class TestVerifyPayPal:
    """Test PayPal verification endpoint"""
    
    def test_verify_paypal_config(self):
        """Test that PayPal credentials are configured"""
        response = requests.get(f"{BASE_URL}/api/subscription/verify-paypal")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        # Check for success field or client_id presence
        assert data.get("success") == True or "client_id" in data, \
            f"PayPal config should be valid: {data}"
        
        print(f"✓ PayPal config verification: {data}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
