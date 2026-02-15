# Pediatrics On The Go - Product Requirements Document

## Original Problem Statement
Build a medical calculator application for pediatric healthcare professionals featuring:
- Pixel-perfect growth chart plotting (CDC and WHO charts)
- Clinical calculators and scoring systems
- Drug dosing references
- Medical approaches/guidelines

## User Persona
- Primary: Pediatricians, NICU staff, pediatric residents
- Use case: Quick reference and calculations during patient care

## Core Requirements

### Growth Charts (P0)
- WHO charts (0-2 years): Weight, Length, BMI, Head Circumference
- CDC charts (2-20 years): Stature/Weight, BMI
- Gender-specific charts (Boys/Girls)
- Pixel-perfect coordinate plotting
- PDF export with chart background
- Zoom/pan functionality

### Clinical Calculators
- BMI Calculator
- BSA Calculator (Mosteller Formula) - Added Dec 2025
- Electrolytes Calculator

### Drug References
- Children drug dosing page
- Marquee animation for long drug names (mobile only)

## What's Been Implemented

### Dec 2025 Session
1. **CDC Boys Chart Calibration** - Adjusted coordinates:
   - X-axis: +4px right (xMin: 454, xMax: 2064)
   - Stature Y-axis: +4px down (yMin: 2424, yMax: 404)
   - Weight Y-axis: +8px down (yMin: 2938, yMax: 1232)

2. **CDC Girls Chart Calibration** - Previously adjusted coordinates

3. **BSA Calculator** - Added to "Children > Scoring" page using Mosteller Formula

4. **PDF Export** - Save button with jspdf/html2canvas, includes chart background via base64 conversion

5. **Marquee Animation** - Unified in tailwind.config.js, scrolls right, mobile only (<768px)

## Pending Verification
- CDC Boys chart coordinate accuracy
- CDC Girls chart coordinate accuracy
- Marquee animation (mobile only behavior)
- PDF export (background image inclusion)
- BMI plot-drift fix

## Architecture

### Frontend
- React.js with TailwindCSS
- Shadcn/UI components
- react-zoom-pan-pinch for chart interaction
- jspdf for PDF generation

### Backend
- FastAPI
- MongoDB

### Key Files
- `/app/frontend/src/pages/nicu/GrowthChartPage.jsx` - All chart logic and coordinates
- `/app/frontend/src/pages/children/DrugsPage.jsx` - Marquee animation logic
- `/app/frontend/src/pages/children/ScoringPage.jsx` - BSA calculator
- `/app/frontend/tailwind.config.js` - Custom animations

## Backlog (P1-P2)
- Refactor ElectrolytesDialog.jsx into smaller components
- Refactor "NICU > Approaches > Mechanical Ventilation" layout
- Add "Mechanical Ventilation" to "Children > Approaches"
- Implement data-testid attributes across interactive elements

## 3rd Party Integrations
- PayPal (existing)
- SMTP (existing)
- jspdf/html2canvas (frontend PDF generation)

## Test Credentials
- Email: test@test.com
- Password: 12341234
