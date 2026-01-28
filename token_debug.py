import requests
import json

class TokenDebugger:
    def __init__(self):
        self.base_url = "https://pedimetrics.preview.emergentagent.com"
        self.user_token = None
        
    def test_signup_and_token(self):
        """Test signup and token storage"""
        test_data = {
            "email": "debuguser@test.com",
            "password": "testpass123",
            "name": "Debug User"
        }
        
        print("🔍 Testing signup...")
        response = requests.post(f"{self.base_url}/api/auth/signup", json=test_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            self.user_token = result.get('access_token')
            print(f"✅ Token stored: {self.user_token is not None}")
            print(f"✅ Token preview: {self.user_token[:30] if self.user_token else 'None'}...")
            
            # Test layout creation immediately
            self.test_layout_creation()
        else:
            print(f"❌ Signup failed: {response.text}")
    
    def test_layout_creation(self):
        """Test layout creation with stored token"""
        if not self.user_token:
            print("❌ No token available")
            return
            
        print(f"\n🔍 Testing layout creation with token: {self.user_token[:30]}...")
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.user_token}'
        }
        
        test_data = {
            "layout_type": "debug_layout",
            "layout_config": {"test": "data"}
        }
        
        response = requests.post(f"{self.base_url}/api/layouts", json=test_data, headers=headers)
        print(f"Layout creation status: {response.status_code}")
        print(f"Response: {response.text[:200]}")

# Run the test
debugger = TokenDebugger()
debugger.test_signup_and_token()