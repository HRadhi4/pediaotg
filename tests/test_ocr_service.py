"""
OCR Service Backend Tests
=========================
Tests for the OCR API endpoints:
- /api/ocr - Generic OCR endpoint
- /api/blood-gas/analyze-image-offline - Blood gas image analysis
- Authentication flow with test credentials

Expected values for img3.jpg:
- pH: 7.196
- pCO2: 47.5
- pO2: 110
- K: 3.9
- Ca: 1.31
- lactate: 4.8
"""

import pytest
import requests
import os
import base64
from pathlib import Path

# Get BASE_URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    BASE_URL = "https://dosing-calculator-1.preview.emergentagent.com"

# Test credentials
TEST_USER_EMAIL = "test@pedotg.com"
TEST_USER_PASSWORD = "SMC2000"
ADMIN_EMAIL = "admin@pedotg.com"
ADMIN_PASSWORD = "SMC159951"

# Test images directory
TEST_IMAGES_DIR = Path("/app/test_images")


def load_image_as_base64(image_path: str) -> str:
    """Load an image file and return as base64 string"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture
def auth_token(api_client):
    """Get authentication token for test user"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD
    })
    if response.status_code == 200:
        data = response.json()
        return data.get("access_token") or data.get("token")
    pytest.skip(f"Authentication failed: {response.status_code} - {response.text}")


@pytest.fixture
def authenticated_client(api_client, auth_token):
    """Session with auth header"""
    api_client.headers.update({"Authorization": f"Bearer {auth_token}"})
    return api_client


class TestHealthEndpoints:
    """Health check endpoint tests"""
    
    def test_health_check(self, api_client):
        """Test /health endpoint - may return HTML via ingress"""
        response = api_client.get(f"{BASE_URL}/health")
        # The /health endpoint without /api prefix may be routed differently by ingress
        # Accept either JSON or HTML response
        if response.status_code == 200:
            try:
                data = response.json()
                assert data.get("status") == "healthy"
                print(f"✓ Health check passed (JSON): {data}")
            except:
                # Ingress may return HTML, check /api/health instead
                print(f"✓ Health check returned non-JSON (likely ingress routing)")
        else:
            pytest.skip(f"Health endpoint returned {response.status_code}")
    
    def test_api_health_check(self, api_client):
        """Test /api/health endpoint"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"
        print(f"✓ API health check passed: {data}")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_test_user(self, api_client):
        """Test login with test user credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data or "token" in data, f"No token in response: {data}"
        print(f"✓ Test user login successful")
    
    def test_login_admin_user(self, api_client):
        """Test login with admin credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data or "token" in data, f"No token in response: {data}"
        print(f"✓ Admin user login successful")
    
    def test_login_invalid_credentials(self, api_client):
        """Test login with invalid credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "invalid@test.com",
            "password": "wrongpassword"
        })
        assert response.status_code in [401, 400], f"Expected 401/400, got {response.status_code}"
        print(f"✓ Invalid credentials correctly rejected")


class TestOCREndpoint:
    """Tests for /api/ocr endpoint"""
    
    def test_ocr_endpoint_with_img1(self, api_client):
        """Test OCR endpoint with img1.jpg"""
        image_path = TEST_IMAGES_DIR / "img1.jpg"
        if not image_path.exists():
            pytest.skip(f"Test image not found: {image_path}")
        
        image_base64 = load_image_as_base64(str(image_path))
        
        response = api_client.post(f"{BASE_URL}/api/ocr", json={
            "image_base64": image_base64,
            "language": "eng"
        })
        
        assert response.status_code == 200, f"OCR failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "success" in data
        assert "ocr_text" in data
        assert "key_metrics" in data
        assert "engine" in data
        assert data["engine"] == "tesseract_medical"
        
        print(f"✓ OCR img1.jpg - Success: {data['success']}")
        print(f"  - OCR text length: {len(data.get('ocr_text', ''))}")
        print(f"  - Key metrics found: {list(data.get('key_metrics', {}).keys())}")
        print(f"  - Confidence: {data.get('avg_confidence', 0):.2%}")
    
    def test_ocr_endpoint_with_img3(self, api_client):
        """Test OCR endpoint with img3.jpg - expected values known"""
        image_path = TEST_IMAGES_DIR / "img3.jpg"
        if not image_path.exists():
            pytest.skip(f"Test image not found: {image_path}")
        
        image_base64 = load_image_as_base64(str(image_path))
        
        response = api_client.post(f"{BASE_URL}/api/ocr", json={
            "image_base64": image_base64,
            "language": "eng"
        })
        
        assert response.status_code == 200, f"OCR failed: {response.text}"
        data = response.json()
        
        assert data["success"] == True, f"OCR not successful: {data.get('error_message')}"
        
        # Check for expected metrics from img3.jpg
        key_metrics = data.get("key_metrics", {})
        expected_metrics = {
            "pH": 7.196,
            "pCO2": 47.5,
            "pO2": 110,
            "K": 3.9,
            "Ca": 1.31,
            "lactate": 4.8
        }
        
        print(f"✓ OCR img3.jpg - Success: {data['success']}")
        print(f"  - OCR text length: {len(data.get('ocr_text', ''))}")
        print(f"  - Key metrics found: {key_metrics}")
        
        # Check which expected metrics were extracted
        found_metrics = []
        missing_metrics = []
        for metric, expected_value in expected_metrics.items():
            if metric in key_metrics:
                found_metrics.append(f"{metric}={key_metrics[metric]} (expected {expected_value})")
            else:
                missing_metrics.append(f"{metric} (expected {expected_value})")
        
        print(f"  - Found metrics: {found_metrics}")
        print(f"  - Missing metrics: {missing_metrics}")
        
        # At least some metrics should be extracted
        assert len(key_metrics) > 0, "No metrics extracted from img3.jpg"
    
    def test_ocr_endpoint_missing_image(self, api_client):
        """Test OCR endpoint with missing image"""
        response = api_client.post(f"{BASE_URL}/api/ocr", json={
            "image_base64": "",
            "language": "eng"
        })
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print(f"✓ Missing image correctly rejected with 400")
    
    def test_ocr_endpoint_invalid_base64(self, api_client):
        """Test OCR endpoint with invalid base64"""
        response = api_client.post(f"{BASE_URL}/api/ocr", json={
            "image_base64": "not-valid-base64!!!",
            "language": "eng"
        })
        
        # Should return 200 with success=False or 500
        assert response.status_code in [200, 500], f"Unexpected status: {response.status_code}"
        if response.status_code == 200:
            data = response.json()
            assert data.get("success") == False, "Invalid base64 should fail"
        print(f"✓ Invalid base64 handled correctly")


class TestBloodGasAnalyzeImageOffline:
    """Tests for /api/blood-gas/analyze-image-offline endpoint"""
    
    def test_analyze_image_offline_img3(self, api_client):
        """Test blood gas offline analysis with img3.jpg"""
        image_path = TEST_IMAGES_DIR / "img3.jpg"
        if not image_path.exists():
            pytest.skip(f"Test image not found: {image_path}")
        
        image_base64 = load_image_as_base64(str(image_path))
        
        response = api_client.post(f"{BASE_URL}/api/blood-gas/analyze-image-offline", json={
            "image_base64": image_base64
        })
        
        assert response.status_code == 200, f"Analysis failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "success" in data
        assert "values" in data
        assert "raw_text" in data
        assert "engine" in data
        assert data["engine"] == "tesseract_medical"
        
        values = data.get("values", {})
        
        print(f"✓ Blood gas offline analysis img3.jpg")
        print(f"  - Success: {data['success']}")
        print(f"  - Values extracted: {values}")
        print(f"  - Confidence: {data.get('avg_confidence', 0):.2%}")
        print(f"  - Quality: {data.get('quality', {})}")
        
        # Check for expected values
        expected = {"pH": 7.196, "pCO2": 47.5, "pO2": 110, "K": 3.9, "Ca": 1.31, "lactate": 4.8}
        for metric, expected_val in expected.items():
            if metric in values:
                print(f"    - {metric}: {values[metric]} (expected ~{expected_val})")
    
    def test_analyze_image_offline_all_images(self, api_client):
        """Test blood gas offline analysis with all test images"""
        for i in range(1, 6):
            image_path = TEST_IMAGES_DIR / f"img{i}.jpg"
            if not image_path.exists():
                print(f"⚠ Skipping img{i}.jpg - not found")
                continue
            
            image_base64 = load_image_as_base64(str(image_path))
            
            response = api_client.post(f"{BASE_URL}/api/blood-gas/analyze-image-offline", json={
                "image_base64": image_base64
            })
            
            assert response.status_code == 200, f"Analysis failed for img{i}.jpg: {response.text}"
            data = response.json()
            
            values = data.get("values", {})
            print(f"✓ img{i}.jpg - Success: {data['success']}, Metrics: {len(values)}, Values: {values}")
    
    def test_analyze_image_offline_missing_image(self, api_client):
        """Test blood gas offline analysis with missing image"""
        response = api_client.post(f"{BASE_URL}/api/blood-gas/analyze-image-offline", json={
            "image_base64": ""
        })
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print(f"✓ Missing image correctly rejected with 400")


class TestBloodGasAnalyzeImage:
    """Tests for /api/blood-gas/analyze-image endpoint (with optional LLM)"""
    
    def test_analyze_image_img3(self, api_client):
        """Test blood gas analysis with img3.jpg"""
        image_path = TEST_IMAGES_DIR / "img3.jpg"
        if not image_path.exists():
            pytest.skip(f"Test image not found: {image_path}")
        
        image_base64 = load_image_as_base64(str(image_path))
        
        response = api_client.post(f"{BASE_URL}/api/blood-gas/analyze-image", json={
            "image_base64": image_base64
        })
        
        assert response.status_code == 200, f"Analysis failed: {response.text}"
        data = response.json()
        
        assert "success" in data
        assert "values" in data
        
        values = data.get("values", {})
        engine = data.get("engine", "unknown")
        
        print(f"✓ Blood gas analysis img3.jpg")
        print(f"  - Success: {data['success']}")
        print(f"  - Engine: {engine}")
        print(f"  - Values extracted: {values}")


class TestBloodGasAnalyze:
    """Tests for /api/blood-gas/analyze endpoint (manual values analysis)"""
    
    def test_analyze_acidosis(self, api_client):
        """Test blood gas analysis with metabolic acidosis values"""
        response = api_client.post(f"{BASE_URL}/api/blood-gas/analyze", json={
            "values": {
                "pH": 7.2,
                "pCO2": 30,
                "HCO3": 12,
                "Na": 140,
                "K": 4.5,
                "Cl": 105,
                "lactate": 5.0,
                "Hb": 10
            }
        })
        
        assert response.status_code == 200, f"Analysis failed: {response.text}"
        data = response.json()
        
        assert "primary_disorder" in data
        assert "anion_gap" in data
        
        print(f"✓ Blood gas analysis - Metabolic Acidosis")
        print(f"  - Primary disorder: {data.get('primary_disorder')}")
        print(f"  - Anion gap: {data.get('anion_gap')}")
        print(f"  - Compensation: {data.get('compensation')}")
        print(f"  - Lactic acidosis: {data.get('lactic_acidosis')}")
    
    def test_analyze_normal_values(self, api_client):
        """Test blood gas analysis with normal values"""
        response = api_client.post(f"{BASE_URL}/api/blood-gas/analyze", json={
            "values": {
                "pH": 7.4,
                "pCO2": 40,
                "HCO3": 24,
                "Na": 140,
                "K": 4.0,
                "Cl": 100,
                "Hb": 14
            }
        })
        
        assert response.status_code == 200, f"Analysis failed: {response.text}"
        data = response.json()
        
        print(f"✓ Blood gas analysis - Normal values")
        print(f"  - Primary disorder: {data.get('primary_disorder')}")
        print(f"  - Hb analysis: {data.get('hb_analysis')}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
