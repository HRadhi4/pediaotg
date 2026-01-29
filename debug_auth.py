import requests
import json

# Test the user token authentication
base_url = "https://growth-chart-pro.preview.emergentagent.com"

# First, create a user and get token
signup_data = {
    "email": "testuser@example.com",
    "password": "testpass123",
    "name": "Test User"
}

print("🔍 Testing user signup...")
response = requests.post(f"{base_url}/api/auth/signup", json=signup_data)
print(f"Signup status: {response.status_code}")

if response.status_code == 200:
    signup_result = response.json()
    user_token = signup_result.get('access_token')
    print(f"✅ Got user token: {user_token[:20]}...")
    
    # Test auth check with user token
    print("\n🔍 Testing auth check with user token...")
    headers = {'Authorization': f'Bearer {user_token}'}
    auth_response = requests.get(f"{base_url}/api/auth/check", headers=headers)
    print(f"Auth check status: {auth_response.status_code}")
    print(f"Auth check response: {auth_response.json()}")
    
    # Test layout creation with user token
    print("\n🔍 Testing layout creation with user token...")
    layout_data = {
        "layout_type": "test_layout",
        "layout_config": {"test": "data"}
    }
    layout_response = requests.post(f"{base_url}/api/layouts", json=layout_data, headers=headers)
    print(f"Layout creation status: {layout_response.status_code}")
    print(f"Layout creation response: {layout_response.text[:200]}")
    
else:
    print(f"❌ Signup failed: {response.text}")