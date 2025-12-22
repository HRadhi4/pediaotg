import requests
import sys
from datetime import datetime

class NICUBackendTester:
    def __init__(self, base_url="https://peds-go.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {response_data}")
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

def main():
    print("🚀 Starting NICU Backend API Tests")
    print("=" * 50)
    
    # Setup
    tester = NICUBackendTester()

    # Run tests
    print("\n📡 Testing API Endpoints...")
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test status check creation
    success, created_status = tester.test_create_status_check()
    
    # Test getting status checks
    tester.test_get_status_checks()
    
    # Test blood gas analysis
    print("\n🩸 Testing Blood Gas Analysis...")
    tester.test_blood_gas_analyze()

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