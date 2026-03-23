"""
CORS Security Tests
====================

Tests to verify that CORS is properly configured with a strict allow-list.
Only explicitly allowed origins should receive CORS headers.
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend to path
sys.path.insert(0, '/app/backend')

from server import app, ALLOWED_ORIGINS, is_origin_allowed


class TestCORSAllowList:
    """Test that CORS strictly enforces the allow-list."""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_allowed_origin_gets_cors_headers(self, client):
        """Allowed origin should receive proper CORS headers."""
        # Use a known allowed origin
        allowed_origin = "https://app.pedotg.com"
        
        response = client.get(
            "/api/health",
            headers={"Origin": allowed_origin}
        )
        
        assert response.status_code == 200
        assert response.headers.get("Access-Control-Allow-Origin") == allowed_origin
        assert response.headers.get("Access-Control-Allow-Credentials") == "true"
    
    def test_disallowed_origin_no_cors_headers(self, client):
        """Disallowed origin should NOT receive CORS headers."""
        malicious_origin = "https://malicious.example.com"
        
        response = client.get(
            "/api/health",
            headers={"Origin": malicious_origin}
        )
        
        # Request succeeds (CORS is browser-enforced)
        assert response.status_code == 200
        # But NO CORS headers are sent
        assert response.headers.get("Access-Control-Allow-Origin") is None
        assert response.headers.get("Access-Control-Allow-Credentials") is None
    
    def test_preflight_allowed_origin(self, client):
        """Preflight from allowed origin should succeed with full CORS headers."""
        allowed_origin = "https://app.pedotg.com"
        
        response = client.options(
            "/api/auth/login",
            headers={
                "Origin": allowed_origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type, X-Device-ID"
            }
        )
        
        assert response.status_code == 204  # No Content - standard preflight response
        assert response.headers.get("Access-Control-Allow-Origin") == allowed_origin
        assert response.headers.get("Access-Control-Allow-Credentials") == "true"
        assert "POST" in response.headers.get("Access-Control-Allow-Methods", "")
        assert "X-Device-ID" in response.headers.get("Access-Control-Allow-Headers", "")
    
    def test_preflight_disallowed_origin(self, client):
        """Preflight from disallowed origin should NOT get CORS headers."""
        malicious_origin = "https://evil-site.com"
        
        response = client.options(
            "/api/auth/login",
            headers={
                "Origin": malicious_origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            }
        )
        
        # Preflight returns 204 but without CORS headers
        assert response.status_code == 204
        assert response.headers.get("Access-Control-Allow-Origin") is None
    
    def test_no_origin_header_no_cors(self, client):
        """Request without Origin header should not get CORS headers."""
        response = client.get("/api/health")
        
        assert response.status_code == 200
        # No CORS headers when no Origin is sent (direct API call, not browser)
        assert response.headers.get("Access-Control-Allow-Origin") is None
    
    def test_is_origin_allowed_function(self):
        """Test the is_origin_allowed helper function."""
        # Known allowed origins
        assert is_origin_allowed("https://app.pedotg.com") == True
        assert is_origin_allowed("https://pedotg.com") == True
        
        # Disallowed origins
        assert is_origin_allowed("https://malicious.com") == False
        assert is_origin_allowed("https://app.pedotg.com.evil.com") == False
        assert is_origin_allowed("http://app.pedotg.com") == False  # Wrong protocol
        assert is_origin_allowed("") == False
    
    def test_localhost_in_development(self):
        """In development mode, localhost should be allowed."""
        # This test checks the current ALLOWED_ORIGINS set
        # In dev mode, localhost should be present
        is_dev = os.environ.get('ENVIRONMENT', 'development') != 'production'
        
        if is_dev:
            assert "http://localhost:3000" in ALLOWED_ORIGINS
            assert "http://127.0.0.1:3000" in ALLOWED_ORIGINS
    
    def test_production_origins_always_allowed(self):
        """Production origins should always be in the allow-list."""
        assert "https://app.pedotg.com" in ALLOWED_ORIGINS
        assert "https://pedotg.com" in ALLOWED_ORIGINS
        assert "https://www.pedotg.com" in ALLOWED_ORIGINS


class TestCORSWithCredentials:
    """Test that credentials are handled correctly with CORS."""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_credentials_only_with_allowed_origin(self, client):
        """Access-Control-Allow-Credentials should only be sent with allowed origins."""
        allowed_origin = "https://app.pedotg.com"
        
        response = client.post(
            "/api/auth/login",
            headers={
                "Origin": allowed_origin,
                "Content-Type": "application/json",
                "X-Device-ID": "test-device"
            },
            json={"email": "test@test.com", "password": "wrong"}
        )
        
        # Even if login fails, CORS headers should be present for allowed origin
        assert response.headers.get("Access-Control-Allow-Credentials") == "true"
    
    def test_no_wildcard_with_credentials(self, client):
        """Never use Access-Control-Allow-Origin: * with credentials."""
        allowed_origin = "https://app.pedotg.com"
        
        response = client.get(
            "/api/health",
            headers={"Origin": allowed_origin}
        )
        
        # Should be specific origin, never *
        allow_origin = response.headers.get("Access-Control-Allow-Origin")
        assert allow_origin != "*"
        assert allow_origin == allowed_origin


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
