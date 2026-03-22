"""
Content API Tests - Testing Protected Medical Content Delivery
==============================================================

Tests for the content migration feature:
- Authentication requirements
- Subscription-gated access
- Admin bypass for subscription
- Data integrity (164 drugs expected)
- Single drug lookup
- Drug categories
- Content metadata

Test Credentials:
- Admin: admin@pedotg.com / SMC159951 (always has access)
- Test User: test@test.com / 12341234 (expired subscription - should get 403)
"""

import pytest
import requests
import os

# Get BASE_URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    BASE_URL = "https://content-gateway-10.preview.emergentagent.com"

# Test credentials
ADMIN_EMAIL = "admin@pedotg.com"
ADMIN_PASSWORD = "SMC159951"
TEST_USER_EMAIL = "test@test.com"
TEST_USER_PASSWORD = "12341234"


class TestContentAPIAuthentication:
    """Test authentication requirements for content endpoints"""
    
    def test_formulary_requires_auth(self):
        """Verify /api/content/formulary returns 401 without token"""
        response = requests.get(f"{BASE_URL}/api/content/formulary")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        print("PASS: Formulary endpoint requires authentication (401 without token)")
    
    def test_drug_categories_requires_auth(self):
        """Verify /api/content/drug-categories returns 401 without token"""
        response = requests.get(f"{BASE_URL}/api/content/drug-categories")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        print("PASS: Drug categories endpoint requires authentication (401 without token)")
    
    def test_metadata_requires_auth(self):
        """Verify /api/content/metadata returns 401 without token"""
        response = requests.get(f"{BASE_URL}/api/content/metadata")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        print("PASS: Metadata endpoint requires authentication (401 without token)")
    
    def test_single_drug_requires_auth(self):
        """Verify /api/content/formulary/{drug_id} returns 401 without token"""
        response = requests.get(f"{BASE_URL}/api/content/formulary/acetaminophen")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        print("PASS: Single drug endpoint requires authentication (401 without token)")
    
    def test_renal_adjustments_requires_auth(self):
        """Verify /api/content/renal-adjustments returns 401 without token"""
        response = requests.get(f"{BASE_URL}/api/content/renal-adjustments")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        print("PASS: Renal adjustments endpoint requires authentication (401 without token)")


class TestContentAPISubscription:
    """Test subscription requirements for content endpoints"""
    
    @pytest.fixture(scope="class")
    def test_user_token(self):
        """Get token for test user (expired subscription)"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip(f"Could not login as test user: {response.status_code} - {response.text}")
        data = response.json()
        return data.get("access_token")
    
    def test_formulary_requires_subscription(self, test_user_token):
        """Verify /api/content/formulary returns 403 for user without active subscription"""
        headers = {"Authorization": f"Bearer {test_user_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary", headers=headers)
        assert response.status_code == 403, f"Expected 403, got {response.status_code}: {response.text}"
        print("PASS: Formulary endpoint requires subscription (403 for expired user)")
    
    def test_single_drug_requires_subscription(self, test_user_token):
        """Verify /api/content/formulary/{drug_id} returns 403 for user without subscription"""
        headers = {"Authorization": f"Bearer {test_user_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary/acetaminophen", headers=headers)
        assert response.status_code == 403, f"Expected 403, got {response.status_code}: {response.text}"
        print("PASS: Single drug endpoint requires subscription (403 for expired user)")
    
    def test_renal_adjustments_requires_subscription(self, test_user_token):
        """Verify /api/content/renal-adjustments returns 403 for user without subscription"""
        headers = {"Authorization": f"Bearer {test_user_token}"}
        response = requests.get(f"{BASE_URL}/api/content/renal-adjustments", headers=headers)
        assert response.status_code == 403, f"Expected 403, got {response.status_code}: {response.text}"
        print("PASS: Renal adjustments endpoint requires subscription (403 for expired user)")
    
    def test_drug_categories_only_requires_auth(self, test_user_token):
        """Verify /api/content/drug-categories works with just auth (no subscription needed)"""
        headers = {"Authorization": f"Bearer {test_user_token}"}
        response = requests.get(f"{BASE_URL}/api/content/drug-categories", headers=headers)
        # This endpoint only requires auth, not subscription
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "categories" in data
        print(f"PASS: Drug categories accessible with auth only (found {data.get('count', 0)} categories)")
    
    def test_metadata_only_requires_auth(self, test_user_token):
        """Verify /api/content/metadata works with just auth (no subscription needed)"""
        headers = {"Authorization": f"Bearer {test_user_token}"}
        response = requests.get(f"{BASE_URL}/api/content/metadata", headers=headers)
        # This endpoint only requires auth, not subscription
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "formulary_count" in data
        print(f"PASS: Metadata accessible with auth only (formulary_count: {data.get('formulary_count')})")


class TestContentAPIAdminAccess:
    """Test admin access bypasses subscription requirement"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get token for admin user"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip(f"Could not login as admin: {response.status_code} - {response.text}")
        data = response.json()
        return data.get("access_token")
    
    def test_admin_can_access_formulary(self, admin_token):
        """Verify admin can access formulary without subscription"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "drugs" in data
        assert "total" in data
        print(f"PASS: Admin can access formulary (total: {data.get('total')} drugs)")
    
    def test_admin_can_access_single_drug(self, admin_token):
        """Verify admin can access single drug details"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary/acetaminophen", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "name" in data or "id" in data
        print(f"PASS: Admin can access single drug (acetaminophen)")
    
    def test_admin_can_access_renal_adjustments(self, admin_token):
        """Verify admin can access renal adjustments"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/renal-adjustments", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "total" in data or "antimicrobial" in data
        print(f"PASS: Admin can access renal adjustments (total: {data.get('total', 'N/A')})")


class TestContentAPIDataIntegrity:
    """Test data integrity - verify correct drug count and data structure"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get token for admin user"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip(f"Could not login as admin: {response.status_code} - {response.text}")
        data = response.json()
        return data.get("access_token")
    
    def test_formulary_returns_164_drugs(self, admin_token):
        """Verify formulary returns expected 164 drugs"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary?limit=500", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        total = data.get("total", 0)
        drugs_count = len(data.get("drugs", []))
        
        # Expected 164 drugs based on seeding script
        assert total == 164, f"Expected 164 drugs total, got {total}"
        assert drugs_count == 164, f"Expected 164 drugs in response, got {drugs_count}"
        print(f"PASS: Formulary contains exactly 164 drugs")
    
    def test_drug_has_required_fields(self, admin_token):
        """Verify drug entries have required fields"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary?limit=1", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        drugs = data.get("drugs", [])
        assert len(drugs) > 0, "No drugs returned"
        
        drug = drugs[0]
        required_fields = ["id", "name", "category", "route"]
        for field in required_fields:
            assert field in drug, f"Drug missing required field: {field}"
        
        print(f"PASS: Drug entries have required fields (id, name, category, route)")
    
    def test_single_drug_lookup_returns_correct_drug(self, admin_token):
        """Verify single drug lookup returns correct drug"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary/acetaminophen", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert data.get("id") == "acetaminophen" or data.get("name", "").lower().startswith("acetaminophen"), \
            f"Expected acetaminophen, got {data.get('id')} / {data.get('name')}"
        print(f"PASS: Single drug lookup returns correct drug (acetaminophen)")
    
    def test_nonexistent_drug_returns_404(self, admin_token):
        """Verify nonexistent drug returns 404"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary/nonexistent_drug_xyz", headers=headers)
        assert response.status_code == 404, f"Expected 404, got {response.status_code}: {response.text}"
        print(f"PASS: Nonexistent drug returns 404")
    
    def test_metadata_returns_correct_counts(self, admin_token):
        """Verify metadata returns correct counts"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/metadata", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        formulary_count = data.get("formulary_count", 0)
        renal_count = data.get("renal_adjustments_count", 0)
        
        assert formulary_count == 164, f"Expected 164 formulary drugs, got {formulary_count}"
        # Expected 40 renal adjustments based on seeding script
        assert renal_count == 40, f"Expected 40 renal adjustments, got {renal_count}"
        print(f"PASS: Metadata returns correct counts (formulary: {formulary_count}, renal: {renal_count})")
    
    def test_drug_categories_returns_categories(self, admin_token):
        """Verify drug categories endpoint returns categories"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/drug-categories", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        categories = data.get("categories", [])
        count = data.get("count", 0)
        
        assert len(categories) > 0, "No categories returned"
        assert count > 0, "Category count is 0"
        assert count == len(categories), f"Count mismatch: {count} vs {len(categories)}"
        
        # Check for expected categories
        expected_categories = ["Antibiotic", "Analgesic"]
        for cat in expected_categories:
            # Case-insensitive check
            found = any(cat.lower() in c.lower() for c in categories)
            if not found:
                print(f"WARNING: Expected category '{cat}' not found in {categories[:10]}...")
        
        print(f"PASS: Drug categories returns {count} categories")


class TestContentAPIFiltering:
    """Test filtering and pagination for content endpoints"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get token for admin user"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip(f"Could not login as admin: {response.status_code} - {response.text}")
        data = response.json()
        return data.get("access_token")
    
    def test_formulary_category_filter(self, admin_token):
        """Test filtering formulary by category"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary?category=Antibiotic", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        drugs = data.get("drugs", [])
        if len(drugs) > 0:
            # Verify all returned drugs are antibiotics
            for drug in drugs[:5]:  # Check first 5
                assert "antibiotic" in drug.get("category", "").lower(), \
                    f"Drug {drug.get('name')} has category {drug.get('category')}, expected Antibiotic"
        print(f"PASS: Category filter works (found {len(drugs)} antibiotics)")
    
    def test_formulary_search_filter(self, admin_token):
        """Test searching formulary by drug name"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/content/formulary?search=amox", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        drugs = data.get("drugs", [])
        if len(drugs) > 0:
            # Verify search results contain search term
            for drug in drugs:
                name = drug.get("name", "").lower()
                drug_id = drug.get("id", "").lower()
                assert "amox" in name or "amox" in drug_id, \
                    f"Drug {drug.get('name')} doesn't match search term 'amox'"
        print(f"PASS: Search filter works (found {len(drugs)} drugs matching 'amox')")
    
    def test_formulary_pagination(self, admin_token):
        """Test pagination with limit and offset"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Get first page
        response1 = requests.get(f"{BASE_URL}/api/content/formulary?limit=10&offset=0", headers=headers)
        assert response1.status_code == 200
        data1 = response1.json()
        
        # Get second page
        response2 = requests.get(f"{BASE_URL}/api/content/formulary?limit=10&offset=10", headers=headers)
        assert response2.status_code == 200
        data2 = response2.json()
        
        drugs1 = data1.get("drugs", [])
        drugs2 = data2.get("drugs", [])
        
        assert len(drugs1) == 10, f"Expected 10 drugs on page 1, got {len(drugs1)}"
        assert len(drugs2) == 10, f"Expected 10 drugs on page 2, got {len(drugs2)}"
        
        # Verify different drugs on each page
        ids1 = set(d.get("id") for d in drugs1)
        ids2 = set(d.get("id") for d in drugs2)
        assert ids1.isdisjoint(ids2), "Pagination returned overlapping drugs"
        
        # Verify has_more flag
        assert data1.get("has_more") == True, "Expected has_more=True for first page"
        
        print(f"PASS: Pagination works correctly (page 1: {len(drugs1)}, page 2: {len(drugs2)})")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
