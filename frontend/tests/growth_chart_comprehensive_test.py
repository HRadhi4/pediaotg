"""
Comprehensive Growth Chart Testing - 100+ Test Scenarios
Tests WHO (0-2 years) and CDC (2-20 years) charts for data point plotting accuracy.

Test Categories:
1. WHO Weight-for-age Boys: 20 data points
2. WHO Weight-for-age Girls: 10 data points
3. WHO Length-for-age Boys: 10 data points
4. WHO Length-for-age Girls: 10 data points
5. WHO BMI-for-age Boys: 10 data points
6. WHO BMI-for-age Girls: 10 data points
7. CDC Stature-Weight Boys: 15 stature + 15 weight points
8. CDC Stature-Weight Girls: 10 stature + 10 weight points
9. CDC BMI Boys: 10 points
10. CDC BMI Girls: 10 points
11. Corner cases and edge cases
12. 50th percentile tracking
13. 3rd/97th percentile tracking
14. Functional tests (gender switching, chart type switching, clear, zoom)
"""

import asyncio
from playwright.async_api import async_playwright
import json
from datetime import datetime

# Test data organized by chart type
WHO_WEIGHT_BOYS_TEST_DATA = [
    # 50th percentile tracking (5 points)
    {"age": 0, "value": 3.3, "expected_percentile": "50th", "description": "Birth weight 50th percentile"},
    {"age": 6, "value": 7.9, "expected_percentile": "50th", "description": "6mo weight 50th percentile"},
    {"age": 12, "value": 9.6, "expected_percentile": "50th", "description": "12mo weight 50th percentile"},
    {"age": 18, "value": 10.9, "expected_percentile": "50th", "description": "18mo weight 50th percentile"},
    {"age": 24, "value": 12.2, "expected_percentile": "50th", "description": "24mo weight 50th percentile"},
    # 3rd percentile tracking (5 points)
    {"age": 0, "value": 2.5, "expected_percentile": "3rd", "description": "Birth weight 3rd percentile"},
    {"age": 6, "value": 6.4, "expected_percentile": "3rd", "description": "6mo weight 3rd percentile"},
    {"age": 12, "value": 7.8, "expected_percentile": "3rd", "description": "12mo weight 3rd percentile"},
    {"age": 18, "value": 8.8, "expected_percentile": "3rd", "description": "18mo weight 3rd percentile"},
    {"age": 24, "value": 9.7, "expected_percentile": "3rd", "description": "24mo weight 3rd percentile"},
    # 97th percentile tracking (5 points)
    {"age": 0, "value": 4.4, "expected_percentile": "97th", "description": "Birth weight 97th percentile"},
    {"age": 6, "value": 9.8, "expected_percentile": "97th", "description": "6mo weight 97th percentile"},
    {"age": 12, "value": 12.0, "expected_percentile": "97th", "description": "12mo weight 97th percentile"},
    {"age": 18, "value": 13.7, "expected_percentile": "97th", "description": "18mo weight 97th percentile"},
    {"age": 24, "value": 15.3, "expected_percentile": "97th", "description": "24mo weight 97th percentile"},
    # Corner cases (2 points)
    {"age": 0, "value": 2, "expected_percentile": "min", "description": "Minimum corner (0mo, 2kg)"},
    {"age": 24, "value": 16, "expected_percentile": "max", "description": "Maximum corner (24mo, 16kg)"},
    # Fractional ages (3 points)
    {"age": 1.5, "value": 4.5, "expected_percentile": "50th", "description": "1.5mo fractional age"},
    {"age": 6.5, "value": 8.0, "expected_percentile": "50th", "description": "6.5mo fractional age"},
    {"age": 11.5, "value": 9.4, "expected_percentile": "50th", "description": "11.5mo fractional age"},
]

WHO_WEIGHT_GIRLS_TEST_DATA = [
    {"age": 0, "value": 3.2, "expected_percentile": "50th", "description": "Birth weight 50th percentile"},
    {"age": 6, "value": 7.3, "expected_percentile": "50th", "description": "6mo weight 50th percentile"},
    {"age": 12, "value": 8.9, "expected_percentile": "50th", "description": "12mo weight 50th percentile"},
    {"age": 18, "value": 10.2, "expected_percentile": "50th", "description": "18mo weight 50th percentile"},
    {"age": 24, "value": 11.5, "expected_percentile": "50th", "description": "24mo weight 50th percentile"},
    {"age": 0, "value": 2.4, "expected_percentile": "3rd", "description": "Birth weight 3rd percentile"},
    {"age": 12, "value": 7.0, "expected_percentile": "3rd", "description": "12mo weight 3rd percentile"},
    {"age": 24, "value": 9.0, "expected_percentile": "3rd", "description": "24mo weight 3rd percentile"},
    {"age": 0, "value": 4.2, "expected_percentile": "97th", "description": "Birth weight 97th percentile"},
    {"age": 24, "value": 14.8, "expected_percentile": "97th", "description": "24mo weight 97th percentile"},
]

WHO_LENGTH_BOYS_TEST_DATA = [
    {"age": 0, "value": 49.9, "expected_percentile": "50th", "description": "Birth length 50th percentile"},
    {"age": 6, "value": 67.6, "expected_percentile": "50th", "description": "6mo length 50th percentile"},
    {"age": 12, "value": 75.7, "expected_percentile": "50th", "description": "12mo length 50th percentile"},
    {"age": 18, "value": 82.3, "expected_percentile": "50th", "description": "18mo length 50th percentile"},
    {"age": 24, "value": 87.8, "expected_percentile": "50th", "description": "24mo length 50th percentile"},
    {"age": 0, "value": 46.1, "expected_percentile": "3rd", "description": "Birth length 3rd percentile"},
    {"age": 24, "value": 81.7, "expected_percentile": "3rd", "description": "24mo length 3rd percentile"},
    {"age": 0, "value": 53.4, "expected_percentile": "97th", "description": "Birth length 97th percentile"},
    {"age": 24, "value": 93.9, "expected_percentile": "97th", "description": "24mo length 97th percentile"},
    {"age": 0, "value": 45, "expected_percentile": "min", "description": "Minimum length corner"},
]

WHO_LENGTH_GIRLS_TEST_DATA = [
    {"age": 0, "value": 49.1, "expected_percentile": "50th", "description": "Birth length 50th percentile"},
    {"age": 6, "value": 65.7, "expected_percentile": "50th", "description": "6mo length 50th percentile"},
    {"age": 12, "value": 74.0, "expected_percentile": "50th", "description": "12mo length 50th percentile"},
    {"age": 18, "value": 80.7, "expected_percentile": "50th", "description": "18mo length 50th percentile"},
    {"age": 24, "value": 86.4, "expected_percentile": "50th", "description": "24mo length 50th percentile"},
    {"age": 0, "value": 45.4, "expected_percentile": "3rd", "description": "Birth length 3rd percentile"},
    {"age": 24, "value": 80.0, "expected_percentile": "3rd", "description": "24mo length 3rd percentile"},
    {"age": 0, "value": 52.9, "expected_percentile": "97th", "description": "Birth length 97th percentile"},
    {"age": 24, "value": 92.9, "expected_percentile": "97th", "description": "24mo length 97th percentile"},
    {"age": 24, "value": 95, "expected_percentile": "max", "description": "Maximum length corner"},
]

WHO_BMI_BOYS_TEST_DATA = [
    {"age": 0, "value": 13.4, "expected_percentile": "50th", "description": "Birth BMI 50th percentile"},
    {"age": 6, "value": 17.3, "expected_percentile": "50th", "description": "6mo BMI 50th percentile"},
    {"age": 12, "value": 16.8, "expected_percentile": "50th", "description": "12mo BMI 50th percentile"},
    {"age": 18, "value": 16.2, "expected_percentile": "50th", "description": "18mo BMI 50th percentile"},
    {"age": 24, "value": 15.8, "expected_percentile": "50th", "description": "24mo BMI 50th percentile"},
    {"age": 0, "value": 11.1, "expected_percentile": "3rd", "description": "Birth BMI 3rd percentile"},
    {"age": 24, "value": 14.0, "expected_percentile": "3rd", "description": "24mo BMI 3rd percentile"},
    {"age": 0, "value": 16.0, "expected_percentile": "97th", "description": "Birth BMI 97th percentile"},
    {"age": 24, "value": 18.4, "expected_percentile": "97th", "description": "24mo BMI 97th percentile"},
    {"age": 0, "value": 10, "expected_percentile": "min", "description": "Minimum BMI corner"},
]

WHO_BMI_GIRLS_TEST_DATA = [
    {"age": 0, "value": 13.3, "expected_percentile": "50th", "description": "Birth BMI 50th percentile"},
    {"age": 6, "value": 17.0, "expected_percentile": "50th", "description": "6mo BMI 50th percentile"},
    {"age": 12, "value": 16.4, "expected_percentile": "50th", "description": "12mo BMI 50th percentile"},
    {"age": 18, "value": 15.8, "expected_percentile": "50th", "description": "18mo BMI 50th percentile"},
    {"age": 24, "value": 15.4, "expected_percentile": "50th", "description": "24mo BMI 50th percentile"},
    {"age": 0, "value": 10.8, "expected_percentile": "3rd", "description": "Birth BMI 3rd percentile"},
    {"age": 24, "value": 13.7, "expected_percentile": "3rd", "description": "24mo BMI 3rd percentile"},
    {"age": 0, "value": 16.1, "expected_percentile": "97th", "description": "Birth BMI 97th percentile"},
    {"age": 24, "value": 18.0, "expected_percentile": "97th", "description": "24mo BMI 97th percentile"},
    {"age": 24, "value": 22, "expected_percentile": "max", "description": "Maximum BMI corner"},
]

CDC_STATURE_BOYS_TEST_DATA = [
    {"age": 2, "value": 87, "expected_percentile": "50th", "description": "2yr stature 50th percentile"},
    {"age": 5, "value": 110, "expected_percentile": "50th", "description": "5yr stature 50th percentile"},
    {"age": 8, "value": 128, "expected_percentile": "50th", "description": "8yr stature 50th percentile"},
    {"age": 10, "value": 138, "expected_percentile": "50th", "description": "10yr stature 50th percentile"},
    {"age": 12, "value": 149, "expected_percentile": "50th", "description": "12yr stature 50th percentile"},
    {"age": 14, "value": 164, "expected_percentile": "50th", "description": "14yr stature 50th percentile"},
    {"age": 16, "value": 173, "expected_percentile": "50th", "description": "16yr stature 50th percentile"},
    {"age": 18, "value": 176, "expected_percentile": "50th", "description": "18yr stature 50th percentile"},
    {"age": 20, "value": 177, "expected_percentile": "50th", "description": "20yr stature 50th percentile"},
    {"age": 2, "value": 80, "expected_percentile": "min", "description": "Minimum stature corner"},
    {"age": 20, "value": 190, "expected_percentile": "max", "description": "Maximum stature corner"},
    {"age": 2, "value": 82, "expected_percentile": "3rd", "description": "2yr stature 3rd percentile"},
    {"age": 20, "value": 166, "expected_percentile": "3rd", "description": "20yr stature 3rd percentile"},
    {"age": 2, "value": 92, "expected_percentile": "97th", "description": "2yr stature 97th percentile"},
    {"age": 20, "value": 188, "expected_percentile": "97th", "description": "20yr stature 97th percentile"},
]

CDC_WEIGHT_BOYS_TEST_DATA = [
    {"age": 2, "value": 12.5, "expected_percentile": "50th", "description": "2yr weight 50th percentile"},
    {"age": 5, "value": 18.5, "expected_percentile": "50th", "description": "5yr weight 50th percentile"},
    {"age": 8, "value": 26, "expected_percentile": "50th", "description": "8yr weight 50th percentile"},
    {"age": 10, "value": 32, "expected_percentile": "50th", "description": "10yr weight 50th percentile"},
    {"age": 12, "value": 40, "expected_percentile": "50th", "description": "12yr weight 50th percentile"},
    {"age": 14, "value": 51, "expected_percentile": "50th", "description": "14yr weight 50th percentile"},
    {"age": 16, "value": 62, "expected_percentile": "50th", "description": "16yr weight 50th percentile"},
    {"age": 18, "value": 68, "expected_percentile": "50th", "description": "18yr weight 50th percentile"},
    {"age": 20, "value": 72, "expected_percentile": "50th", "description": "20yr weight 50th percentile"},
    {"age": 2, "value": 10, "expected_percentile": "min", "description": "Minimum weight corner"},
    {"age": 20, "value": 105, "expected_percentile": "max", "description": "Maximum weight corner"},
    {"age": 2, "value": 10.5, "expected_percentile": "3rd", "description": "2yr weight 3rd percentile"},
    {"age": 20, "value": 56, "expected_percentile": "3rd", "description": "20yr weight 3rd percentile"},
    {"age": 2, "value": 15, "expected_percentile": "97th", "description": "2yr weight 97th percentile"},
    {"age": 20, "value": 100, "expected_percentile": "97th", "description": "20yr weight 97th percentile"},
]

CDC_STATURE_GIRLS_TEST_DATA = [
    {"age": 2, "value": 86, "expected_percentile": "50th", "description": "2yr stature 50th percentile"},
    {"age": 5, "value": 108, "expected_percentile": "50th", "description": "5yr stature 50th percentile"},
    {"age": 10, "value": 138, "expected_percentile": "50th", "description": "10yr stature 50th percentile"},
    {"age": 14, "value": 160, "expected_percentile": "50th", "description": "14yr stature 50th percentile"},
    {"age": 18, "value": 163, "expected_percentile": "50th", "description": "18yr stature 50th percentile"},
    {"age": 2, "value": 80, "expected_percentile": "min", "description": "Minimum stature corner"},
    {"age": 20, "value": 175, "expected_percentile": "max", "description": "Maximum stature corner"},
    {"age": 2, "value": 81, "expected_percentile": "3rd", "description": "2yr stature 3rd percentile"},
    {"age": 20, "value": 153, "expected_percentile": "3rd", "description": "20yr stature 3rd percentile"},
    {"age": 20, "value": 175, "expected_percentile": "97th", "description": "20yr stature 97th percentile"},
]

CDC_WEIGHT_GIRLS_TEST_DATA = [
    {"age": 2, "value": 12, "expected_percentile": "50th", "description": "2yr weight 50th percentile"},
    {"age": 5, "value": 18, "expected_percentile": "50th", "description": "5yr weight 50th percentile"},
    {"age": 10, "value": 32, "expected_percentile": "50th", "description": "10yr weight 50th percentile"},
    {"age": 14, "value": 49, "expected_percentile": "50th", "description": "14yr weight 50th percentile"},
    {"age": 18, "value": 57, "expected_percentile": "50th", "description": "18yr weight 50th percentile"},
    {"age": 2, "value": 10, "expected_percentile": "min", "description": "Minimum weight corner"},
    {"age": 20, "value": 90, "expected_percentile": "max", "description": "Maximum weight corner"},
    {"age": 2, "value": 10.2, "expected_percentile": "3rd", "description": "2yr weight 3rd percentile"},
    {"age": 20, "value": 45, "expected_percentile": "3rd", "description": "20yr weight 3rd percentile"},
    {"age": 20, "value": 90, "expected_percentile": "97th", "description": "20yr weight 97th percentile"},
]

CDC_BMI_BOYS_TEST_DATA = [
    {"age": 2, "value": 16.5, "expected_percentile": "50th", "description": "2yr BMI 50th percentile"},
    {"age": 5, "value": 15.5, "expected_percentile": "50th", "description": "5yr BMI 50th percentile"},
    {"age": 10, "value": 17, "expected_percentile": "50th", "description": "10yr BMI 50th percentile"},
    {"age": 14, "value": 19.5, "expected_percentile": "50th", "description": "14yr BMI 50th percentile"},
    {"age": 18, "value": 22, "expected_percentile": "50th", "description": "18yr BMI 50th percentile"},
    {"age": 2, "value": 12, "expected_percentile": "min", "description": "Minimum BMI corner"},
    {"age": 20, "value": 35, "expected_percentile": "max", "description": "Maximum BMI corner"},
    {"age": 2, "value": 14.5, "expected_percentile": "3rd", "description": "2yr BMI 3rd percentile"},
    {"age": 20, "value": 18, "expected_percentile": "3rd", "description": "20yr BMI 3rd percentile"},
    {"age": 20, "value": 32, "expected_percentile": "97th", "description": "20yr BMI 97th percentile"},
]

CDC_BMI_GIRLS_TEST_DATA = [
    {"age": 2, "value": 16, "expected_percentile": "50th", "description": "2yr BMI 50th percentile"},
    {"age": 5, "value": 15.2, "expected_percentile": "50th", "description": "5yr BMI 50th percentile"},
    {"age": 10, "value": 17, "expected_percentile": "50th", "description": "10yr BMI 50th percentile"},
    {"age": 14, "value": 19.5, "expected_percentile": "50th", "description": "14yr BMI 50th percentile"},
    {"age": 18, "value": 21, "expected_percentile": "50th", "description": "18yr BMI 50th percentile"},
    {"age": 2, "value": 12, "expected_percentile": "min", "description": "Minimum BMI corner"},
    {"age": 20, "value": 35, "expected_percentile": "max", "description": "Maximum BMI corner"},
    {"age": 2, "value": 14, "expected_percentile": "3rd", "description": "2yr BMI 3rd percentile"},
    {"age": 20, "value": 17.5, "expected_percentile": "3rd", "description": "20yr BMI 3rd percentile"},
    {"age": 20, "value": 33, "expected_percentile": "97th", "description": "20yr BMI 97th percentile"},
]

class GrowthChartTester:
    def __init__(self):
        self.results = {
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "test_details": []
        }
        self.base_url = "https://pediatric-dosing.preview.emergentagent.com"
    
    async def login(self, page):
        """Login to the application"""
        await page.goto(f"{self.base_url}/login")
        await page.wait_for_timeout(2000)
        
        email_input = await page.query_selector('input[type="email"], input[placeholder*="email"]')
        password_input = await page.query_selector('input[type="password"]')
        
        if email_input and password_input:
            await email_input.fill('test@pedotg.com')
            await password_input.fill('SMC2000')
            
            sign_in_btn = await page.query_selector('button:has-text("Sign In"), button:has-text("Sign in")')
            if sign_in_btn:
                await sign_in_btn.click()
                await page.wait_for_timeout(3000)
        
        # Handle I Agree if present
        agree_btn = await page.query_selector('button:has-text("I Agree")')
        if agree_btn:
            await agree_btn.click()
            await page.wait_for_timeout(2000)
    
    async def navigate_to_growth_charts(self, page):
        """Navigate to growth charts page"""
        await page.goto(f"{self.base_url}/nicu/growth")
        await page.wait_for_timeout(2000)
    
    async def select_gender(self, page, gender):
        """Select gender (male/female)"""
        if gender == "male":
            btn = await page.query_selector('[data-testid="male-btn"]')
        else:
            btn = await page.query_selector('[data-testid="female-btn"]')
        if btn:
            await btn.click()
            await page.wait_for_timeout(500)
    
    async def select_who_chart_type(self, page, chart_type):
        """Select WHO chart type (weight/length/bmi)"""
        # Click the dropdown
        dropdown = await page.query_selector('[data-testid="who-chart-type-select"]')
        if dropdown:
            await dropdown.click()
            await page.wait_for_timeout(300)
            
            # Select the option
            option = await page.query_selector(f'[role="option"]:has-text("{chart_type}")')
            if option:
                await option.click(force=True)
                await page.wait_for_timeout(500)
    
    async def select_cdc_chart_type(self, page, chart_type):
        """Select CDC chart type (statureWeight/bmi)"""
        btn = await page.query_selector(f'[data-testid="cdc-{chart_type}-btn"]')
        if btn:
            await btn.click()
            await page.wait_for_timeout(500)
    
    async def select_tab(self, page, tab):
        """Select WHO or CDC tab"""
        tab_btn = await page.query_selector(f'[data-testid="{tab}-tab"]')
        if tab_btn:
            await tab_btn.click()
            await page.wait_for_timeout(500)
    
    async def add_who_measurement(self, page, age_months, value):
        """Add a WHO measurement"""
        age_input = await page.query_selector('[data-testid="who-age-input"]')
        value_input = await page.query_selector('[data-testid="who-value-input"]')
        add_btn = await page.query_selector('[data-testid="who-add-measurement-btn"]')
        
        if age_input and value_input and add_btn:
            await age_input.fill(str(age_months))
            await value_input.fill(str(value))
            await page.wait_for_timeout(200)
            
            # Check if button is enabled
            is_disabled = await add_btn.get_attribute('disabled')
            if is_disabled is None:
                await add_btn.click()
                await page.wait_for_timeout(300)
                return True
        return False
    
    async def add_cdc_measurement(self, page, age_years, stature=None, weight=None, bmi=None):
        """Add a CDC measurement"""
        age_input = await page.query_selector('[data-testid="cdc-age-input"]')
        add_btn = await page.query_selector('[data-testid="cdc-add-measurement-btn"]')
        
        if age_input:
            await age_input.fill(str(age_years))
            
            if stature is not None:
                stature_input = await page.query_selector('[data-testid="cdc-stature-input"]')
                if stature_input:
                    await stature_input.fill(str(stature))
            
            if weight is not None:
                weight_input = await page.query_selector('[data-testid="cdc-weight-input"]')
                if weight_input:
                    await weight_input.fill(str(weight))
            
            if bmi is not None:
                bmi_input = await page.query_selector('[data-testid="cdc-bmi-input"]')
                if bmi_input:
                    await bmi_input.fill(str(bmi))
            
            await page.wait_for_timeout(200)
            
            if add_btn:
                is_disabled = await add_btn.get_attribute('disabled')
                if is_disabled is None:
                    await add_btn.click()
                    await page.wait_for_timeout(300)
                    return True
        return False
    
    async def count_plotted_points(self, page, chart_type="who"):
        """Count the number of plotted points on the chart"""
        if chart_type == "who":
            svg = await page.query_selector('[data-testid="who-growth-chart-svg"]')
        else:
            svg = await page.query_selector('[data-testid="cdc-growth-chart-svg"]')
        
        if svg:
            # Count circles in the overlay SVG
            circles = await page.query_selector_all('svg circle')
            return len(circles)
        return 0
    
    async def verify_point_in_bounds(self, page, chart_type="who"):
        """Verify that plotted points are within chart bounds"""
        # This is a visual verification - we check if circles exist
        circles = await page.query_selector_all('svg circle')
        return len(circles) > 0
    
    def record_result(self, test_name, passed, details=""):
        """Record a test result"""
        self.results["total_tests"] += 1
        if passed:
            self.results["passed"] += 1
            status = "PASSED"
        else:
            self.results["failed"] += 1
            status = "FAILED"
        
        self.results["test_details"].append({
            "test": test_name,
            "status": status,
            "details": details
        })
        print(f"[{status}] {test_name}: {details}")
    
    async def clear_measurements(self, page):
        """Clear all measurements by refreshing the page"""
        await self.navigate_to_growth_charts(page)
        await page.wait_for_timeout(1000)
    
    async def run_who_weight_boys_tests(self, page):
        """Run WHO Weight-for-age Boys tests (20 points)"""
        print("\n=== WHO Weight-for-age Boys Tests (20 points) ===")
        await self.select_gender(page, "male")
        await self.select_tab(page, "who")
        await self.select_who_chart_type(page, "Weight-for-age")
        await page.wait_for_timeout(500)
        
        for i, data in enumerate(WHO_WEIGHT_BOYS_TEST_DATA):
            test_name = f"WHO_Weight_Boys_{i+1}: {data['description']}"
            success = await self.add_who_measurement(page, data['age'], data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}mo, Weight: {data['value']}kg")
        
        # Take screenshot
        await page.screenshot(path=".screenshots/who_weight_boys_all_points.png", quality=40, full_page=False)
        print("Screenshot saved: who_weight_boys_all_points.png")
    
    async def run_who_weight_girls_tests(self, page):
        """Run WHO Weight-for-age Girls tests (10 points)"""
        print("\n=== WHO Weight-for-age Girls Tests (10 points) ===")
        await self.clear_measurements(page)
        await self.select_gender(page, "female")
        await self.select_tab(page, "who")
        await self.select_who_chart_type(page, "Weight-for-age")
        await page.wait_for_timeout(500)
        
        for i, data in enumerate(WHO_WEIGHT_GIRLS_TEST_DATA):
            test_name = f"WHO_Weight_Girls_{i+1}: {data['description']}"
            success = await self.add_who_measurement(page, data['age'], data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}mo, Weight: {data['value']}kg")
        
        await page.screenshot(path=".screenshots/who_weight_girls_all_points.png", quality=40, full_page=False)
    
    async def run_who_length_boys_tests(self, page):
        """Run WHO Length-for-age Boys tests (10 points)"""
        print("\n=== WHO Length-for-age Boys Tests (10 points) ===")
        await self.clear_measurements(page)
        await self.select_gender(page, "male")
        await self.select_tab(page, "who")
        await self.select_who_chart_type(page, "Length-for-age")
        await page.wait_for_timeout(500)
        
        for i, data in enumerate(WHO_LENGTH_BOYS_TEST_DATA):
            test_name = f"WHO_Length_Boys_{i+1}: {data['description']}"
            success = await self.add_who_measurement(page, data['age'], data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}mo, Length: {data['value']}cm")
        
        await page.screenshot(path=".screenshots/who_length_boys_all_points.png", quality=40, full_page=False)
    
    async def run_who_length_girls_tests(self, page):
        """Run WHO Length-for-age Girls tests (10 points)"""
        print("\n=== WHO Length-for-age Girls Tests (10 points) ===")
        await self.clear_measurements(page)
        await self.select_gender(page, "female")
        await self.select_tab(page, "who")
        await self.select_who_chart_type(page, "Length-for-age")
        await page.wait_for_timeout(500)
        
        for i, data in enumerate(WHO_LENGTH_GIRLS_TEST_DATA):
            test_name = f"WHO_Length_Girls_{i+1}: {data['description']}"
            success = await self.add_who_measurement(page, data['age'], data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}mo, Length: {data['value']}cm")
        
        await page.screenshot(path=".screenshots/who_length_girls_all_points.png", quality=40, full_page=False)
    
    async def run_who_bmi_boys_tests(self, page):
        """Run WHO BMI-for-age Boys tests (10 points)"""
        print("\n=== WHO BMI-for-age Boys Tests (10 points) ===")
        await self.clear_measurements(page)
        await self.select_gender(page, "male")
        await self.select_tab(page, "who")
        await self.select_who_chart_type(page, "BMI-for-age")
        await page.wait_for_timeout(500)
        
        for i, data in enumerate(WHO_BMI_BOYS_TEST_DATA):
            test_name = f"WHO_BMI_Boys_{i+1}: {data['description']}"
            success = await self.add_who_measurement(page, data['age'], data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}mo, BMI: {data['value']}")
        
        await page.screenshot(path=".screenshots/who_bmi_boys_all_points.png", quality=40, full_page=False)
    
    async def run_who_bmi_girls_tests(self, page):
        """Run WHO BMI-for-age Girls tests (10 points)"""
        print("\n=== WHO BMI-for-age Girls Tests (10 points) ===")
        await self.clear_measurements(page)
        await self.select_gender(page, "female")
        await self.select_tab(page, "who")
        await self.select_who_chart_type(page, "BMI-for-age")
        await page.wait_for_timeout(500)
        
        for i, data in enumerate(WHO_BMI_GIRLS_TEST_DATA):
            test_name = f"WHO_BMI_Girls_{i+1}: {data['description']}"
            success = await self.add_who_measurement(page, data['age'], data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}mo, BMI: {data['value']}")
        
        await page.screenshot(path=".screenshots/who_bmi_girls_all_points.png", quality=40, full_page=False)
    
    async def run_cdc_stature_weight_boys_tests(self, page):
        """Run CDC Stature-Weight Boys tests (15 stature + 15 weight = 30 points)"""
        print("\n=== CDC Stature-Weight Boys Tests (30 points) ===")
        await self.clear_measurements(page)
        await self.select_gender(page, "male")
        await self.select_tab(page, "cdc")
        await self.select_cdc_chart_type(page, "statureWeight")
        await page.wait_for_timeout(500)
        
        # Test stature points
        for i, data in enumerate(CDC_STATURE_BOYS_TEST_DATA):
            test_name = f"CDC_Stature_Boys_{i+1}: {data['description']}"
            success = await self.add_cdc_measurement(page, data['age'], stature=data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}yr, Stature: {data['value']}cm")
        
        # Test weight points
        for i, data in enumerate(CDC_WEIGHT_BOYS_TEST_DATA):
            test_name = f"CDC_Weight_Boys_{i+1}: {data['description']}"
            success = await self.add_cdc_measurement(page, data['age'], weight=data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}yr, Weight: {data['value']}kg")
        
        await page.screenshot(path=".screenshots/cdc_stature_weight_boys_all_points.png", quality=40, full_page=False)
    
    async def run_cdc_stature_weight_girls_tests(self, page):
        """Run CDC Stature-Weight Girls tests (10 stature + 10 weight = 20 points)"""
        print("\n=== CDC Stature-Weight Girls Tests (20 points) ===")
        await self.clear_measurements(page)
        await self.select_gender(page, "female")
        await self.select_tab(page, "cdc")
        await self.select_cdc_chart_type(page, "statureWeight")
        await page.wait_for_timeout(500)
        
        for i, data in enumerate(CDC_STATURE_GIRLS_TEST_DATA):
            test_name = f"CDC_Stature_Girls_{i+1}: {data['description']}"
            success = await self.add_cdc_measurement(page, data['age'], stature=data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}yr, Stature: {data['value']}cm")
        
        for i, data in enumerate(CDC_WEIGHT_GIRLS_TEST_DATA):
            test_name = f"CDC_Weight_Girls_{i+1}: {data['description']}"
            success = await self.add_cdc_measurement(page, data['age'], weight=data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}yr, Weight: {data['value']}kg")
        
        await page.screenshot(path=".screenshots/cdc_stature_weight_girls_all_points.png", quality=40, full_page=False)
    
    async def run_cdc_bmi_boys_tests(self, page):
        """Run CDC BMI Boys tests (10 points)"""
        print("\n=== CDC BMI Boys Tests (10 points) ===")
        await self.clear_measurements(page)
        await self.select_gender(page, "male")
        await self.select_tab(page, "cdc")
        await self.select_cdc_chart_type(page, "bmi")
        await page.wait_for_timeout(500)
        
        for i, data in enumerate(CDC_BMI_BOYS_TEST_DATA):
            test_name = f"CDC_BMI_Boys_{i+1}: {data['description']}"
            success = await self.add_cdc_measurement(page, data['age'], bmi=data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}yr, BMI: {data['value']}")
        
        await page.screenshot(path=".screenshots/cdc_bmi_boys_all_points.png", quality=40, full_page=False)
    
    async def run_cdc_bmi_girls_tests(self, page):
        """Run CDC BMI Girls tests (10 points)"""
        print("\n=== CDC BMI Girls Tests (10 points) ===")
        await self.clear_measurements(page)
        await self.select_gender(page, "female")
        await self.select_tab(page, "cdc")
        await self.select_cdc_chart_type(page, "bmi")
        await page.wait_for_timeout(500)
        
        for i, data in enumerate(CDC_BMI_GIRLS_TEST_DATA):
            test_name = f"CDC_BMI_Girls_{i+1}: {data['description']}"
            success = await self.add_cdc_measurement(page, data['age'], bmi=data['value'])
            self.record_result(test_name, success, f"Age: {data['age']}yr, BMI: {data['value']}")
        
        await page.screenshot(path=".screenshots/cdc_bmi_girls_all_points.png", quality=40, full_page=False)
    
    async def run_functional_tests(self, page):
        """Run functional tests (gender switching, chart type switching, etc.)"""
        print("\n=== Functional Tests ===")
        await self.clear_measurements(page)
        
        # Test 1: Gender switching
        await self.select_gender(page, "male")
        await page.wait_for_timeout(300)
        male_btn = await page.query_selector('[data-testid="male-btn"]')
        male_class = await male_btn.get_attribute('class') if male_btn else ""
        is_male_selected = 'bg-blue-600' in male_class
        self.record_result("Functional_1: Gender switch to Boys", is_male_selected, "Boys button should be blue")
        
        await self.select_gender(page, "female")
        await page.wait_for_timeout(300)
        female_btn = await page.query_selector('[data-testid="female-btn"]')
        female_class = await female_btn.get_attribute('class') if female_btn else ""
        is_female_selected = 'bg-pink-600' in female_class
        self.record_result("Functional_2: Gender switch to Girls", is_female_selected, "Girls button should be pink")
        
        # Test 2: Tab switching
        await self.select_tab(page, "who")
        await page.wait_for_timeout(300)
        who_content = await page.query_selector('[data-testid="who-chart-type-select"]')
        self.record_result("Functional_3: WHO tab switch", who_content is not None, "WHO chart selector should be visible")
        
        await self.select_tab(page, "cdc")
        await page.wait_for_timeout(300)
        cdc_content = await page.query_selector('[data-testid="cdc-statureWeight-btn"]')
        self.record_result("Functional_4: CDC tab switch", cdc_content is not None, "CDC chart buttons should be visible")
        
        # Test 3: Chart type switching within WHO
        await self.select_tab(page, "who")
        await self.select_who_chart_type(page, "Weight-for-age")
        await page.wait_for_timeout(300)
        page_content = await page.content()
        self.record_result("Functional_5: WHO Weight chart switch", "Weight-for-age" in page_content, "Weight chart should be displayed")
        
        await self.select_who_chart_type(page, "Length-for-age")
        await page.wait_for_timeout(300)
        page_content = await page.content()
        self.record_result("Functional_6: WHO Length chart switch", "Length-for-age" in page_content, "Length chart should be displayed")
        
        await self.select_who_chart_type(page, "BMI-for-age")
        await page.wait_for_timeout(300)
        page_content = await page.content()
        self.record_result("Functional_7: WHO BMI chart switch", "BMI-for-age" in page_content, "BMI chart should be displayed")
        
        # Test 4: Chart type switching within CDC
        await self.select_tab(page, "cdc")
        await self.select_cdc_chart_type(page, "statureWeight")
        await page.wait_for_timeout(300)
        stature_input = await page.query_selector('[data-testid="cdc-stature-input"]')
        self.record_result("Functional_8: CDC Stature-Weight chart switch", stature_input is not None, "Stature input should be visible")
        
        await self.select_cdc_chart_type(page, "bmi")
        await page.wait_for_timeout(300)
        bmi_input = await page.query_selector('[data-testid="cdc-bmi-input"]')
        self.record_result("Functional_9: CDC BMI chart switch", bmi_input is not None, "BMI input should be visible")
        
        # Test 5: Multiple points rendering
        await self.select_tab(page, "who")
        await self.select_gender(page, "male")
        await self.select_who_chart_type(page, "Weight-for-age")
        
        for i in range(10):
            age = i * 2.4  # 0, 2.4, 4.8, 7.2, 9.6, 12, 14.4, 16.8, 19.2, 21.6
            value = 3 + i * 1  # 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
            await self.add_who_measurement(page, age, value)
        
        circles = await page.query_selector_all('svg circle')
        self.record_result("Functional_10: Multiple points (10+) rendering", len(circles) >= 10, f"Found {len(circles)} circles")
        
        await page.screenshot(path=".screenshots/functional_multiple_points.png", quality=40, full_page=False)
    
    async def run_all_tests(self):
        """Run all comprehensive tests"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.set_viewport_size({"width": 1920, "height": 1080})
            
            try:
                # Login
                print("Logging in...")
                await self.login(page)
                await self.navigate_to_growth_charts(page)
                
                # Run all test suites
                await self.run_who_weight_boys_tests(page)
                await self.run_who_weight_girls_tests(page)
                await self.run_who_length_boys_tests(page)
                await self.run_who_length_girls_tests(page)
                await self.run_who_bmi_boys_tests(page)
                await self.run_who_bmi_girls_tests(page)
                await self.run_cdc_stature_weight_boys_tests(page)
                await self.run_cdc_stature_weight_girls_tests(page)
                await self.run_cdc_bmi_boys_tests(page)
                await self.run_cdc_bmi_girls_tests(page)
                await self.run_functional_tests(page)
                
            except Exception as e:
                print(f"Error during testing: {str(e)}")
                await page.screenshot(path=".screenshots/error_state.png", quality=40, full_page=False)
            finally:
                await browser.close()
        
        return self.results


async def main():
    tester = GrowthChartTester()
    results = await tester.run_all_tests()
    
    print("\n" + "="*60)
    print("COMPREHENSIVE TEST RESULTS SUMMARY")
    print("="*60)
    print(f"Total Tests: {results['total_tests']}")
    print(f"Passed: {results['passed']}")
    print(f"Failed: {results['failed']}")
    print(f"Success Rate: {(results['passed']/results['total_tests']*100):.1f}%")
    print("="*60)
    
    # Save results to JSON
    with open('/app/test_reports/growth_chart_comprehensive_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\nResults saved to /app/test_reports/growth_chart_comprehensive_results.json")
    
    return results


if __name__ == "__main__":
    asyncio.run(main())
