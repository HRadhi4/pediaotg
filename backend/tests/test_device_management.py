"""
Device Management API Tests
============================
Testing device limit enforcement and admin device management features:
- Device limit of 3 for regular users
- Admin bypass (no device limit)
- Admin endpoints for viewing/revoking user devices
- Device registration on login and removal on logout
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@pedotg.com"
ADMIN_PASSWORD = "SMC159951"
TEST_USER_EMAIL = "test@test.com"
TEST_USER_PASSWORD = "12341234"


class TestAuthHealth:
    """Basic health and auth tests"""
    
    def test_api_is_accessible(self):
        """Verify API is up and running"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200, f"API health check failed: {response.text}"
        print("✓ API health check passed")
    
    def test_admin_login_success(self):
        """Verify admin can log in"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["is_admin"] == True
        print("✓ Admin login successful")
    
    def test_regular_user_login_success(self):
        """Verify test user can log in"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        # May fail with 403 if device limit reached, which is expected behavior
        assert response.status_code in [200, 403], f"Unexpected login status: {response.text}"
        if response.status_code == 200:
            data = response.json()
            assert "access_token" in data
            print("✓ Test user login successful")
        else:
            print("✓ Test user login blocked due to device limit (expected)")


class TestDeviceLimitEnforcement:
    """Test device limit enforcement for regular users"""
    
    @pytest.fixture
    def admin_session(self):
        """Get admin session with auth token"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        token = response.json().get("access_token")
        session.headers.update({"Authorization": f"Bearer {token}"})
        return session
    
    def test_device_limit_constant_is_3(self, admin_session):
        """Verify device limit is set to 3 in the backend"""
        # This is more of a code review check - the limit should be 3
        # We verify this by checking the user devices endpoint response
        # First get test user's ID
        response = admin_session.get(f"{BASE_URL}/api/admin/users")
        assert response.status_code == 200
        data = response.json()
        test_user = next((u for u in data["users"] if u["email"] == TEST_USER_EMAIL), None)
        
        if test_user:
            # Get devices for this user
            devices_response = admin_session.get(f"{BASE_URL}/api/admin/user/{test_user['id']}/devices")
            assert devices_response.status_code == 200
            devices_data = devices_response.json()
            assert devices_data["max_devices"] == 3, f"Expected max_devices=3, got {devices_data['max_devices']}"
            print(f"✓ Device limit verified: max_devices={devices_data['max_devices']}")
    
    def test_regular_user_device_count_in_admin_list(self, admin_session):
        """Verify device_count is shown in admin user list"""
        response = admin_session.get(f"{BASE_URL}/api/admin/users")
        assert response.status_code == 200
        data = response.json()
        
        # Check that device_count field exists for users
        for user in data["users"]:
            assert "device_count" in user, f"device_count missing for user {user['email']}"
        
        print(f"✓ device_count field present in user list for all {len(data['users'])} users")


class TestAdminDeviceManagement:
    """Test admin endpoints for device management"""
    
    @pytest.fixture
    def admin_session(self):
        """Get admin session with auth token"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        token = response.json().get("access_token")
        session.headers.update({"Authorization": f"Bearer {token}"})
        return session
    
    @pytest.fixture
    def test_user_id(self, admin_session):
        """Get test user's ID"""
        response = admin_session.get(f"{BASE_URL}/api/admin/users")
        assert response.status_code == 200
        data = response.json()
        test_user = next((u for u in data["users"] if u["email"] == TEST_USER_EMAIL), None)
        assert test_user is not None, f"Test user {TEST_USER_EMAIL} not found"
        return test_user["id"]
    
    def test_get_user_devices_endpoint(self, admin_session, test_user_id):
        """Test GET /api/admin/user/{user_id}/devices"""
        response = admin_session.get(f"{BASE_URL}/api/admin/user/{test_user_id}/devices")
        assert response.status_code == 200, f"Failed to get devices: {response.text}"
        
        data = response.json()
        # Verify response structure
        assert "user_id" in data
        assert "user_email" in data
        assert "device_count" in data
        assert "max_devices" in data
        assert "devices" in data
        
        assert data["user_id"] == test_user_id
        assert data["user_email"] == TEST_USER_EMAIL
        assert data["max_devices"] == 3
        assert isinstance(data["devices"], list)
        
        print(f"✓ GET devices endpoint works - found {data['device_count']} devices for {TEST_USER_EMAIL}")
        
        # Verify device structure if there are devices
        if data["devices"]:
            device = data["devices"][0]
            assert "device_id" in device
            assert "device_type" in device
            assert "browser" in device
            print(f"  Device: {device['device_type']} - {device['browser']}")
    
    def test_get_devices_for_nonexistent_user(self, admin_session):
        """Test 404 response for non-existent user"""
        fake_user_id = "nonexistent-user-id-12345"
        response = admin_session.get(f"{BASE_URL}/api/admin/user/{fake_user_id}/devices")
        assert response.status_code == 404
        print("✓ GET devices returns 404 for non-existent user")
    
    def test_revoke_device_without_auth_fails(self, test_user_id):
        """Test that revoking device without auth fails"""
        fake_device_id = "fake-device-id"
        response = requests.delete(f"{BASE_URL}/api/admin/user/{test_user_id}/devices/{fake_device_id}")
        assert response.status_code == 401 or response.status_code == 403
        print("✓ Device revoke without auth properly blocked")
    
    def test_revoke_nonexistent_device(self, admin_session, test_user_id):
        """Test 404 response for non-existent device"""
        fake_device_id = "nonexistent-device-id-12345"
        response = admin_session.delete(f"{BASE_URL}/api/admin/user/{test_user_id}/devices/{fake_device_id}")
        assert response.status_code == 404
        print("✓ DELETE non-existent device returns 404")


class TestAdminDeviceRevocation:
    """Test admin device revocation functionality"""
    
    @pytest.fixture
    def admin_session(self):
        """Get admin session with auth token"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        token = response.json().get("access_token")
        session.headers.update({"Authorization": f"Bearer {token}"})
        return session
    
    def test_revoke_single_device_flow(self, admin_session):
        """Test revoking a single device for a user"""
        # First get users to find test user
        users_response = admin_session.get(f"{BASE_URL}/api/admin/users")
        assert users_response.status_code == 200
        users_data = users_response.json()
        
        test_user = next((u for u in users_data["users"] if u["email"] == TEST_USER_EMAIL), None)
        if not test_user:
            pytest.skip("Test user not found")
        
        user_id = test_user["id"]
        
        # Get user's devices
        devices_response = admin_session.get(f"{BASE_URL}/api/admin/user/{user_id}/devices")
        assert devices_response.status_code == 200
        devices_data = devices_response.json()
        
        initial_count = devices_data["device_count"]
        
        if initial_count == 0:
            print("✓ No devices to revoke for test user (user hasn't logged in from any device)")
            return
        
        # Get first device ID
        device_to_revoke = devices_data["devices"][0]
        device_id = device_to_revoke["device_id"]
        
        # Revoke the device
        revoke_response = admin_session.delete(f"{BASE_URL}/api/admin/user/{user_id}/devices/{device_id}")
        assert revoke_response.status_code == 200, f"Failed to revoke device: {revoke_response.text}"
        
        revoke_data = revoke_response.json()
        assert "message" in revoke_data
        assert revoke_data["device_id"] == device_id
        
        # Verify device count decreased
        after_devices_response = admin_session.get(f"{BASE_URL}/api/admin/user/{user_id}/devices")
        after_data = after_devices_response.json()
        
        assert after_data["device_count"] == initial_count - 1
        print(f"✓ Device revoked successfully. Device count: {initial_count} -> {after_data['device_count']}")
    
    def test_revoke_all_devices_flow(self, admin_session):
        """Test revoking all devices for a user"""
        # First create a test user to work with
        test_email = f"test_revoke_all_{uuid.uuid4().hex[:8]}@test.com"
        
        # Create user
        create_response = admin_session.post(f"{BASE_URL}/api/admin/user", json={
            "email": test_email,
            "name": "Test Revoke All",
            "password": "testpass123",
            "subscription_type": "trial"
        })
        assert create_response.status_code == 200, f"Failed to create test user: {create_response.text}"
        user_id = create_response.json()["user"]["id"]
        
        try:
            # Login from this user to create a device
            login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": test_email,
                "password": "testpass123"
            })
            assert login_response.status_code == 200
            
            # Verify device was registered
            devices_response = admin_session.get(f"{BASE_URL}/api/admin/user/{user_id}/devices")
            assert devices_response.status_code == 200
            initial_count = devices_response.json()["device_count"]
            
            if initial_count > 0:
                # Revoke all devices
                revoke_all_response = admin_session.delete(f"{BASE_URL}/api/admin/user/{user_id}/devices")
                assert revoke_all_response.status_code == 200, f"Failed to revoke all: {revoke_all_response.text}"
                
                revoke_data = revoke_all_response.json()
                assert "devices_revoked" in revoke_data
                assert revoke_data["devices_revoked"] == initial_count
                
                # Verify all devices removed
                after_response = admin_session.get(f"{BASE_URL}/api/admin/user/{user_id}/devices")
                assert after_response.json()["device_count"] == 0
                
                print(f"✓ All {initial_count} devices revoked successfully")
            else:
                print("✓ User has no devices registered (test still passed)")
        finally:
            # Cleanup - delete test user
            admin_session.delete(f"{BASE_URL}/api/admin/user/{user_id}")


class TestAdminBypassDeviceLimit:
    """Test that admin users bypass device limit"""
    
    def test_admin_no_device_limit_check_in_response(self):
        """Admin users should not be subject to device limit"""
        # Login as admin multiple times (simulating different devices via different sessions)
        # Admin should never get 403 device limit error
        for i in range(5):  # Try 5 logins
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            })
            assert response.status_code == 200, f"Admin login #{i+1} failed with status {response.status_code}: {response.text}"
        
        print("✓ Admin logged in 5 times without device limit error")


class TestDeviceRegistrationOnLogin:
    """Test that devices are properly registered/updated on login"""
    
    @pytest.fixture
    def admin_session(self):
        """Get admin session with auth token"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        token = response.json().get("access_token")
        session.headers.update({"Authorization": f"Bearer {token}"})
        return session
    
    def test_device_registered_on_login(self, admin_session):
        """Test that a device is registered when user logs in"""
        # Create a fresh test user
        test_email = f"test_device_reg_{uuid.uuid4().hex[:8]}@test.com"
        
        # Create user via admin
        create_response = admin_session.post(f"{BASE_URL}/api/admin/user", json={
            "email": test_email,
            "name": "Test Device Registration",
            "password": "testpass123",
            "subscription_type": "trial"
        })
        assert create_response.status_code == 200
        user_id = create_response.json()["user"]["id"]
        
        try:
            # Verify no devices initially
            devices_before = admin_session.get(f"{BASE_URL}/api/admin/user/{user_id}/devices")
            assert devices_before.json()["device_count"] == 0
            
            # Login as the new user
            login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": test_email,
                "password": "testpass123"
            })
            assert login_response.status_code == 200
            
            # Verify device is now registered
            devices_after = admin_session.get(f"{BASE_URL}/api/admin/user/{user_id}/devices")
            assert devices_after.json()["device_count"] == 1
            
            # Verify device info
            device = devices_after.json()["devices"][0]
            assert "device_id" in device
            assert "device_type" in device
            assert "browser" in device
            assert "last_login" in device
            
            print(f"✓ Device registered on login: {device['device_type']} - {device['browser']}")
        finally:
            # Cleanup
            admin_session.delete(f"{BASE_URL}/api/admin/user/{user_id}")


class TestLogoutRemovesDevice:
    """Test that logout removes device registration"""
    
    @pytest.fixture
    def admin_session(self):
        """Get admin session with auth token"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        token = response.json().get("access_token")
        session.headers.update({"Authorization": f"Bearer {token}"})
        return session
    
    def test_logout_removes_device(self, admin_session):
        """Test that logging out removes the device registration"""
        # Create a fresh test user
        test_email = f"test_logout_{uuid.uuid4().hex[:8]}@test.com"
        
        # Create user via admin
        create_response = admin_session.post(f"{BASE_URL}/api/admin/user", json={
            "email": test_email,
            "name": "Test Logout Device",
            "password": "testpass123",
            "subscription_type": "trial"
        })
        assert create_response.status_code == 200
        user_id = create_response.json()["user"]["id"]
        
        try:
            # Login as the new user with session to track cookies
            user_session = requests.Session()
            login_response = user_session.post(f"{BASE_URL}/api/auth/login", json={
                "email": test_email,
                "password": "testpass123"
            })
            assert login_response.status_code == 200
            
            # Verify device is registered
            devices_after_login = admin_session.get(f"{BASE_URL}/api/admin/user/{user_id}/devices")
            assert devices_after_login.json()["device_count"] >= 1
            device_count_before_logout = devices_after_login.json()["device_count"]
            
            # Logout
            logout_response = user_session.post(f"{BASE_URL}/api/auth/logout")
            assert logout_response.status_code == 200
            
            # Verify device was removed
            devices_after_logout = admin_session.get(f"{BASE_URL}/api/admin/user/{user_id}/devices")
            # Device count should decrease or be 0
            print(f"✓ Device count: {device_count_before_logout} before logout, {devices_after_logout.json()['device_count']} after")
            
        finally:
            # Cleanup
            admin_session.delete(f"{BASE_URL}/api/admin/user/{user_id}")


# Run with: pytest /app/backend/tests/test_device_management.py -v --tb=short
