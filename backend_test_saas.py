import requests
import sys
import base64
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import io
import json

class PediaOTGBackendTester:
    def __init__(self, base_url="https://nicu-chart-data.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_image_base64 = self.create_test_image()
        self.admin_token = None
        self.user_token = None

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

    # ===== SaaS Authentication Tests =====
    
    def test_auth_signup(self):
        """Test user signup with trial subscription"""
        import time
        unique_email = f"newuser{int(time.time())}@test.com"
        
        test_data = {
            "email": unique_email,
            "password": "testpass123",
            "name": "New User"
        }
        success, response = self.run_test(
            "Auth Signup - Create new user",
            "POST",
            "api/auth/signup",
            200,
            data=test_data
        )
        
        if success:
            # Verify response structure
            required_fields = ["access_token", "refresh_token", "user"]
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, response
            
            # Check user has trial subscription
            user = response.get("user", {})
            if user.get("subscription_status") != "trial":
                print(f"❌ Expected subscription_status 'trial', got '{user.get('subscription_status')}'")
                return False, response
            
            print(f"✅ User created with trial subscription")
            print(f"✅ Access token: {response.get('access_token')[:20]}...")
            print(f"✅ User subscription status: {user.get('subscription_status')}")
            
            # Store token for later tests
            self.user_token = response.get('access_token')
            
        return success, response

    def test_auth_login_admin(self):
        """Test admin login"""
        test_data = {
            "email": "Admin@pediaotg.com",
            "password": "SMC159951"
        }
        success, response = self.run_test(
            "Auth Login - Admin credentials",
            "POST",
            "api/auth/login",
            200,
            data=test_data
        )
        
        if success:
            # Verify admin status
            user = response.get("user", {})
            if not user.get("is_admin"):
                print(f"❌ Expected is_admin: true, got {user.get('is_admin')}")
                return False, response
            
            print(f"✅ Admin login successful")
            print(f"✅ Admin status: {user.get('is_admin')}")
            print(f"✅ Admin email: {user.get('email')}")
            
            # Store admin token for later tests
            self.admin_token = response.get('access_token')
            
        return success, response

    def test_auth_check(self):
        """Test auth status check"""
        if not self.admin_token:
            print("❌ No admin token available for auth check test")
            return False, {}
            
        success, response = self.run_test(
            "Auth Check - Check authentication status",
            "GET",
            "api/auth/check",
            200,
            auth_token=self.admin_token
        )
        
        if success:
            # Verify authenticated status
            if not response.get("authenticated"):
                print(f"❌ Expected authenticated: true, got {response.get('authenticated')}")
                return False, response
            
            print(f"✅ Authentication status: {response.get('authenticated')}")
            print(f"✅ Is admin: {response.get('is_admin')}")
            print(f"✅ Has subscription: {response.get('has_subscription')}")
            
        return success, response

    # ===== Subscription Tests =====
    
    def test_subscription_pricing(self):
        """Test subscription pricing endpoint"""
        success, response = self.run_test(
            "Subscription Pricing - Get pricing info",
            "GET",
            "api/subscription/pricing",
            200
        )
        
        if success:
            # Verify pricing structure
            expected_fields = ["monthly_price", "annual_price", "trial_days", "currency"]
            missing_fields = [field for field in expected_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, response
            
            # Check specific values
            if response.get("monthly_price") != 1.0:
                print(f"❌ Expected monthly_price: 1.0, got {response.get('monthly_price')}")
                return False, response
            
            if response.get("annual_price") != 10.0:
                print(f"❌ Expected annual_price: 10.0, got {response.get('annual_price')}")
                return False, response
            
            if response.get("trial_days") != 3:
                print(f"❌ Expected trial_days: 3, got {response.get('trial_days')}")
                return False, response
            
            if response.get("currency") != "BHD":
                print(f"❌ Expected currency: 'BHD', got {response.get('currency')}")
                return False, response
            
            print(f"✅ Monthly price: {response.get('monthly_price')} {response.get('currency')}")
            print(f"✅ Annual price: {response.get('annual_price')} {response.get('currency')}")
            print(f"✅ Trial days: {response.get('trial_days')}")
            
        return success, response

    def test_subscription_status(self):
        """Test subscription status endpoint"""
        if not self.admin_token:
            print("❌ No admin token available for subscription status test")
            return False, {}
            
        success, response = self.run_test(
            "Subscription Status - Get user subscription status",
            "GET",
            "api/subscription/status",
            200,
            auth_token=self.admin_token
        )
        
        if success:
            # Verify response structure
            expected_fields = ["has_subscription", "status", "plan"]
            for field in expected_fields:
                if field not in response:
                    print(f"❌ Missing field: {field}")
                    return False, response
            
            print(f"✅ Has subscription: {response.get('has_subscription')}")
            print(f"✅ Status: {response.get('status')}")
            print(f"✅ Plan: {response.get('plan')}")
            
        return success, response

    def test_subscription_create_order(self):
        """Test PayPal order creation"""
        if not self.user_token:
            print("❌ No user token available for create order test")
            return False, {}
            
        test_data = {
            "plan_name": "monthly"
        }
        success, response = self.run_test(
            "Subscription Create Order - Create PayPal order",
            "POST",
            "api/subscription/create-order",
            200,
            data=test_data,
            auth_token=self.user_token
        )
        
        if success:
            # Verify response structure
            expected_fields = ["success", "order_id", "approval_url"]
            missing_fields = [field for field in expected_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, response
            
            # Check if approval_url contains PayPal
            approval_url = response.get("approval_url", "")
            if "paypal" not in approval_url.lower():
                print(f"❌ Expected PayPal URL, got: {approval_url}")
                return False, response
            
            print(f"✅ Order created successfully")
            print(f"✅ Order ID: {response.get('order_id')}")
            print(f"✅ PayPal approval URL: {approval_url[:50]}...")
            
        return success, response

    # ===== Layout Tests =====
    
    def test_layouts_create(self):
        """Test layout creation"""
        if not self.user_token:
            print("❌ No user token available for layout creation test")
            return False, {}
            
        test_data = {
            "layout_type": "nicu_widgets",
            "layout_config": {
                "widgets": ["fluid", "nrp"]
            }
        }
        
        # Debug: Test auth check first
        auth_success, auth_response = self.run_test(
            "Debug - Auth check before layout creation",
            "GET",
            "api/auth/check",
            200,
            auth_token=self.user_token
        )
        
        if not auth_success:
            print("❌ User token authentication failed")
            return False, {}
            
        success, response = self.run_test(
            "Layouts Create - Save user layout",
            "POST",
            "api/layouts/",
            200,
            data=test_data,
            auth_token=self.user_token
        )
        
        if success:
            # Verify response structure
            expected_fields = ["id", "user_id", "layout_type", "layout_config"]
            missing_fields = [field for field in expected_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, response
            
            print(f"✅ Layout saved successfully")
            print(f"✅ Layout ID: {response.get('id')}")
            print(f"✅ Layout type: {response.get('layout_type')}")
            
        return success, response

    def test_layouts_get(self):
        """Test getting user layouts"""
        if not self.user_token:
            print("❌ No user token available for get layouts test")
            return False, {}
            
        success, response = self.run_test(
            "Layouts Get - Get user layouts",
            "GET",
            "api/layouts/",
            200,
            auth_token=self.user_token
        )
        
        if success:
            # Verify response is array
            if not isinstance(response, list):
                print(f"❌ Expected array response, got {type(response)}")
                return False, response
            
            print(f"✅ Retrieved {len(response)} layouts")
            if response:
                print(f"✅ First layout type: {response[0].get('layout_type')}")
            
        return success, response

    # ===== Admin Tests =====
    
    def test_admin_stats(self):
        """Test admin statistics"""
        if not self.admin_token:
            print("❌ No admin token available for admin stats test")
            return False, {}
            
        success, response = self.run_test(
            "Admin Stats - Get subscription statistics",
            "GET",
            "api/admin/stats",
            200,
            auth_token=self.admin_token
        )
        
        if success:
            # Verify response structure
            expected_fields = ["users", "subscriptions"]
            missing_fields = [field for field in expected_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, response
            
            users = response.get("users", {})
            subscriptions = response.get("subscriptions", {})
            
            print(f"✅ Total users: {users.get('total', 0)}")
            print(f"✅ Admin users: {users.get('admins', 0)}")
            print(f"✅ Subscription stats: {subscriptions}")
            
        return success, response

    def test_admin_users(self):
        """Test admin users list"""
        if not self.admin_token:
            print("❌ No admin token available for admin users test")
            return False, {}
            
        success, response = self.run_test(
            "Admin Users - Get all users with subscription info",
            "GET",
            "api/admin/users",
            200,
            auth_token=self.admin_token
        )
        
        if success:
            # Verify response structure
            expected_fields = ["users", "total"]
            missing_fields = [field for field in expected_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, response
            
            users = response.get("users", [])
            if not isinstance(users, list):
                print(f"❌ Expected users array, got {type(users)}")
                return False, response
            
            print(f"✅ Retrieved {len(users)} users")
            print(f"✅ Total users: {response.get('total')}")
            
            # Check if admin user exists
            admin_found = any(user.get('is_admin') for user in users)
            if admin_found:
                print(f"✅ Admin user found in list")
            
        return success, response

def main():
    print("🚀 Starting PediaOTG SaaS Backend API Tests")
    print("=" * 60)
    
    # Setup
    tester = PediaOTGBackendTester()

    # Run SaaS tests in order
    print("\n🔐 Testing Authentication Endpoints...")
    
    # Test admin login first to get admin token
    tester.test_auth_login_admin()
    
    # Test user signup to get user token
    tester.test_auth_signup()
    
    # Test auth check with admin token
    tester.test_auth_check()
    
    print("\n💰 Testing Subscription Endpoints...")
    
    # Test subscription pricing (no auth required)
    tester.test_subscription_pricing()
    
    # Test subscription status (requires auth)
    tester.test_subscription_status()
    
    # Test PayPal order creation (requires user auth)
    tester.test_subscription_create_order()
    
    print("\n📋 Testing Layout Endpoints...")
    
    # Test layout creation and retrieval
    tester.test_layouts_create()
    tester.test_layouts_get()
    
    print("\n👑 Testing Admin Endpoints...")
    
    # Test admin endpoints (requires admin auth)
    tester.test_admin_stats()
    tester.test_admin_users()

    # Print results
    print("\n" + "=" * 60)
    print(f"📊 SaaS Backend Tests Summary:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All SaaS backend tests passed!")
        return 0
    else:
        print("❌ Some SaaS backend tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())