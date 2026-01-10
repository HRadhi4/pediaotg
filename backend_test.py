import requests
import sys
import base64
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import io
import json

class PediaOTGBackendTester:
    def __init__(self, base_url="https://pediatric-tools.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_image_base64 = self.create_test_image()
        self.admin_token = None
        self.user_token = None
        self.admin_credentials = {
            "email": "Admin@pediaotg.com",
            "password": "SMC159951"
        }

    def create_test_image(self):
        """Create a test image with blood gas values for OCR testing"""
        try:
            # Create a white image
            img = Image.new('RGB', (400, 300), color='white')
            draw = ImageDraw.Draw(img)
            
            # Try to use a default font, fallback to basic if not available
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
            except:
                font = ImageFont.load_default()
            
            # Add blood gas values text
            text_lines = [
                "BLOOD GAS ANALYSIS",
                "pH: 7.35",
                "pCO2: 40 mmHg", 
                "pO2: 95 mmHg",
                "HCO3: 24 mEq/L",
                "BE: 0 mEq/L",
                "Na: 140 mEq/L",
                "K: 4.0 mEq/L",
                "Cl: 102 mEq/L",
                "Lactate: 1.5 mmol/L",
                "Hb: 12.5 g/dL"
            ]
            
            y_position = 20
            for line in text_lines:
                draw.text((20, y_position), line, fill='black', font=font)
                y_position += 25
            
            # Convert to base64
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_str = base64.b64encode(buffer.getvalue()).decode()
            return img_str
            
        except Exception as e:
            print(f"Warning: Could not create test image: {e}")
            # Return a minimal base64 encoded 1x1 pixel image as fallback
            return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, auth_token=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        # Add authorization header if token provided
        if auth_token:
            test_headers['Authorization'] = f'Bearer {auth_token}'
        
        # Merge additional headers
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2, default=str)[:300]}...")
                except:
                    print(f"Response: {response.text[:200]}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:200]}")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "api/", 200)

    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        success, response = self.run_test(
            "Create Status Check",
            "POST", 
            "api/status",
            200,
            data=test_data
        )
        return success, response

    def test_get_status_checks(self):
        """Test getting status checks"""
        return self.run_test("Get Status Checks", "GET", "api/status", 200)

    def test_blood_gas_analyze(self):
        """Test blood gas analysis with metabolic acidosis values"""
        test_values = {
            "values": {
                "pH": 7.25,
                "pCO2": 30,
                "HCO3": 14,
                "Na": 140,
                "K": 5.2,
                "Cl": 110,
                "lactate": 4.5,
                "Hb": 6.5
            }
        }
        success, response = self.run_test(
            "Blood Gas Analysis",
            "POST",
            "api/blood-gas/analyze",
            200,
            data=test_values
        )
        
        if success:
            # Check if analysis contains expected results
            if "primary_disorder" in response:
                print(f"Primary Disorder: {response.get('primary_disorder')}")
                print(f"Lactic Acidosis: {response.get('lactic_acidosis')}")
                print(f"Anion Gap: {response.get('anion_gap')}")
                print(f"Hb Analysis: {response.get('hb_analysis')}")
            
        return success, response

    def test_blood_gas_ocr_offline(self):
        """Test offline OCR endpoint with Tesseract"""
        test_data = {
            "image_base64": self.test_image_base64
        }
        success, response = self.run_test(
            "Blood Gas OCR - Offline (Tesseract)",
            "POST",
            "api/blood-gas/analyze-image-offline",
            200,
            data=test_data
        )
        
        if success:
            # Verify response structure
            required_fields = ["success", "values", "raw_text", "engine"]
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, response
            
            # Verify engine is tesseract
            if response.get("engine") != "tesseract":
                print(f"❌ Expected engine 'tesseract', got '{response.get('engine')}'")
                return False, response
            
            print(f"✅ Engine: {response.get('engine')}")
            print(f"✅ Success: {response.get('success')}")
            print(f"✅ Raw text length: {len(response.get('raw_text', ''))}")
            print(f"✅ Extracted values: {response.get('values', {})}")
            
        return success, response

    def test_blood_gas_ocr_online(self):
        """Test online OCR endpoint with Gemini AI"""
        test_data = {
            "image_base64": self.test_image_base64
        }
        success, response = self.run_test(
            "Blood Gas OCR - Online (Gemini AI)",
            "POST", 
            "api/blood-gas/analyze-image",
            200,
            data=test_data
        )
        
        if success:
            # Verify response structure
            required_fields = ["success", "values"]
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, response
                
            print(f"✅ Success: {response.get('success')}")
            print(f"✅ Extracted values: {response.get('values', {})}")
            
        return success, response

    def test_admin_login(self):
        """Test admin login functionality"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/auth/login",
            200,
            data=self.admin_credentials
        )
        
        if success and "access_token" in response:
            self.admin_token = response["access_token"]
            print(f"✅ Admin token obtained")
            print(f"✅ Admin status: {response.get('user', {}).get('is_admin', False)}")
        
        return success, response

    def test_auth_check(self):
        """Test authentication check endpoint"""
        if not self.admin_token:
            print("❌ No admin token available for auth check")
            return False, {}
            
        success, response = self.run_test(
            "Authentication Check",
            "GET",
            "api/auth/check",
            200,
            auth_token=self.admin_token
        )
        
        if success:
            print(f"✅ Authenticated: {response.get('authenticated')}")
            print(f"✅ Is Admin: {response.get('is_admin')}")
            print(f"✅ Has Subscription: {response.get('has_subscription')}")
        
        return success, response

    def test_subscription_pricing(self):
        """Test subscription pricing endpoint"""
        success, response = self.run_test(
            "Subscription Pricing",
            "GET",
            "api/subscription/pricing",
            200
        )
        
        if success:
            print(f"✅ Monthly Price: {response.get('monthly_price')} {response.get('currency')}")
            print(f"✅ Annual Price: {response.get('annual_price')} {response.get('currency')}")
            print(f"✅ Trial Days: {response.get('trial_days')}")
            
            # Verify expected pricing from review request
            expected_monthly = 1.0
            expected_annual = 10.0
            expected_currency = "BHD"
            
            if (response.get('monthly_price') == expected_monthly and 
                response.get('annual_price') == expected_annual and
                response.get('currency') == expected_currency):
                print("✅ Pricing matches expected values")
            else:
                print("❌ Pricing does not match expected values")
                return False, response
        
        return success, response

    def test_paypal_order_creation(self):
        """Test PayPal order creation for monthly plan"""
        if not self.admin_token:
            print("❌ No admin token available for PayPal order creation")
            return False, {}
            
        test_data = {
            "plan_name": "monthly"
        }
        
        success, response = self.run_test(
            "PayPal Order Creation (Monthly)",
            "POST",
            "api/subscription/create-order",
            200,
            data=test_data,
            auth_token=self.admin_token
        )
        
        if success:
            print(f"✅ Order ID: {response.get('order_id')}")
            print(f"✅ Approval URL: {response.get('approval_url')}")
            
            # Verify response structure
            required_fields = ["success", "order_id", "approval_url"]
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, response
        
        return success, response

    def test_subscription_status(self):
        """Test subscription status endpoint"""
        if not self.admin_token:
            print("❌ No admin token available for subscription status")
            return False, {}
            
        success, response = self.run_test(
            "Subscription Status",
            "GET",
            "api/subscription/status",
            200,
            auth_token=self.admin_token
        )
        
        if success:
            print(f"✅ Has Subscription: {response.get('has_subscription')}")
            print(f"✅ Status: {response.get('status')}")
            print(f"✅ Plan: {response.get('plan')}")
        
        return success, response

def main():
    print("🚀 Starting PediaOTG Backend API Tests")
    print("=" * 50)
    
    # Setup
    tester = PediaOTGBackendTester()

    # Run tests
    print("\n📡 Testing Basic API Endpoints...")
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test status check creation
    success, created_status = tester.test_create_status_check()
    
    # Test getting status checks
    tester.test_get_status_checks()
    
    # Test authentication and subscription endpoints
    print("\n🔐 Testing Authentication & Subscription...")
    
    # Test admin login (required for other tests)
    tester.test_admin_login()
    
    # Test auth check
    tester.test_auth_check()
    
    # Test subscription pricing
    tester.test_subscription_pricing()
    
    # Test PayPal order creation
    tester.test_paypal_order_creation()
    
    # Test subscription status
    tester.test_subscription_status()
    
    # Test blood gas analysis
    print("\n🩸 Testing Blood Gas Analysis...")
    tester.test_blood_gas_analyze()
    
    # Test OCR endpoints
    print("\n📷 Testing Blood Gas OCR Endpoints...")
    tester.test_blood_gas_ocr_offline()
    tester.test_blood_gas_ocr_online()

    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Backend Tests Summary:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("❌ Some backend tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())