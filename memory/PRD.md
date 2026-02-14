# Pediatrics On The Go - Product Requirements Document

## Original Problem Statement
Build and refine a comprehensive pediatric medical calculator application with:
- WHO and CDC growth charts using high-resolution SVG files
- Interactive features: pinch-to-zoom, panning
- Accurate data point plotting on charts
- Save chart as PNG functionality
- Intuitive UI for switching between chart types, genders, and measurements
- Electrolyte correction calculators with dose rounding feature

## User's Preferred Language
English

## Core Application
A pediatric medical calculator app featuring:
- NICU calculators (Fluid, UVC/UAC, Intubation, Blood Pressure, Transfusions, Growth Charts)
- Children's ward tools
- Drug formulary
- Admin dashboard with PayPal subscription
- Electrolyte correction calculators

## What's Been Implemented

### Growth Charts (Jan 2026)
- **WHO Charts (0-2 years):** Weight, Length, BMI, Head Circumference for both Boys and Girls
- **CDC Charts (2-20 years):** Stature-for-age, Weight-for-age - CALIBRATED
- **SVG Rendering Fix:** Changed from `<img>` + `<svg>` overlay to single `<svg>` with embedded `<image>` to fix alignment issues
- **Coordinate Calibration:** All charts calibrated via iterative image analysis method

### Electrolyte Calculator Enhancements (Feb 2026)
- **Round dose to 5s Toggle:** When enabled, slider snaps to multiples of 5 for easier clinical dilution
  - Slider min rounds DOWN to nearest 5
  - Slider max rounds UP to nearest 5
  - Step changes to 5
  - Shows "(adjusted from X - Y)" to indicate original range
- **Severe Hyponatremia Update:** Simplified to show only 3% Saline Bolus treatment
  - Removed Option 1 (infusion path)
  - Shows "Over 30 mins, preferably in central line"
  - Clear max correction limits displayed
- **3% NaCl Method for Mild Hyponatremia (Feb 2026 - Fixed):**
  - Maintenance and deficit are now shown **separately** (not summed)
  - **Option A: With Bolus** - 1/2 deficit as bolus + 1/2 deficit as IV over 24hrs
  - **Option B: Without Bolus** - Full deficit over 24hrs (shows hourly rate)
  - Added N.B. note: "If the patient is already on maintenance fluids, the above deficit correction should be added to the maintenance amount"

### Drug Formulary Implementation (Dec 2025)
- **Location:** `/app/frontend/src/pages/children/DrugsPage.jsx`
- **Data File:** `/app/frontend/src/data/childrenFormulary.js` (111 medications)
- **Features:**
  - Original DrugsPage UI preserved (no nested containers)
  - Data imported from external childrenFormulary.js file
  - 111 medications with comprehensive dosing information
  - **Single-line drug header layout** - Name and category on one line without wrapping (Dec 2025 fix)
  - **Horizontal table scrolling** - Tables scroll horizontally with helper text for full content visibility (Dec 2025 fix)
  - **Calculated dose column in tables** (Dec 2025 fix):
    - For weight-range tables (e.g., Paracetamol): Shows "✓" with fixed dose for matching weight row
    - For mg/kg tables (e.g., Amikacin): Shows calculated dose in mg (dose_per_kg × patient_weight)
  - **Dosing tables** displayed in user-friendly format (like PDF)
  - Searchable by drug name, category, or indication
  - Weight-based dose calculations with GFR calculator
  - Expandable drug cards with detailed information:
    - Drug name with brand names
    - Category and route of administration
    - Indication
    - **Dosing tables** (Weight/Age/Dose columns)
    - Multiple dosing regimens (neonate, pediatric, adult)
    - Maximum dose
    - Available formulations
    - Contraindications (red styling)
    - Warnings & Precautions (orange styling)
    - Side effects (pink styling)
    - Drug interactions (violet table with horizontal scrolling)
    - Renal and hepatic adjustments
    - Clinical notes
- **Navigation:** Integrated into Children Dashboard via DrugsPage component
- **Added medications include:** Acetazolamide, ACTH/Corticotropin, Allopurinol, Alprostadil, Alteplase, Aluminum Hydroxide, Aminocaproic Acid, Aminophylline, Amphotericin B, Arginine, Atenolol, Atracurium, Aztreonam, Baclofen, Bivalirudin, Bosentan, Bumetanide, Calcitriol, Captopril

### Children's Section - Mechanical Ventilation Approach (Feb 2026)
- **New Approach Added:** Mechanical Ventilation in PICU
- **Location:** `/app/frontend/src/pages/children/approaches/MechanicalVentilationApproach.jsx`
- **Features:**
  - Tabbed interface with 4 tabs:
    1. **General** - Initial settings table (Tidal Volume, Frequency, FiO2, Ti, PS)
    2. **Special Considerations** - ARDS and Asthma-specific ventilation strategies
    3. **HFOV** - High Frequency Oscillatory Ventilation (principles, indications, settings, troubleshooting)
    4. **Equations** - Useful respiratory equations table
  - Weight-based calculations for tidal volume
  - Age-based recommendations for frequency and inspiratory time
  - HFOV frequency table by age group (Preterm, Term, Children, Adult)
  - Troubleshooting guides for Hypoxemia, Hypercarpia
  - Pitfalls and complications sections

### Authentication
- JWT-based authentication
- Admin and user roles
- PayPal subscription integration (LIVE MODE - verified)

### Email Notification System (Feb 2026)
- **Location:** `/app/backend/services/email_service.py`
- **SMTP Configuration:** Microsoft Exchange via GoDaddy (smtp.office365.com:587)
- **Sender:** noreply@pedotg.com (authenticated via admin@pedotg.com)
- **Features Implemented:**
  - **Welcome emails** to new users on registration
  - **Admin notification on new registration** - sends to admin@pedotg.com
  - **Subscription confirmation emails** to users
  - **Admin notification on subscription/renewal** - sends to admin@pedotg.com with payment details
  - **Subscription renewal reminders** - sent 7 days before expiration (daily scheduler at 9 AM UTC)
  - **Trial expiration reminders** - for users on free trial
  - **Subscription cancellation confirmation**
  - **Password reset emails** with secure tokens

### Scheduled Tasks (Feb 2026)
- **Location:** `/app/backend/services/scheduler_service.py`
- **APScheduler** for cron-based job execution
- **Renewal Reminders Job:** Runs daily at 9:00 AM UTC, checks subscriptions expiring within 7 days
- **Admin Controls:** 
  - `/api/admin/scheduler/jobs` - View scheduled jobs
  - `/api/admin/scheduler/run-job/{job_id}` - Manually trigger jobs
  - `/api/admin/send-renewal-reminders` - Manual reminder trigger
  - `/api/admin/expiring-subscriptions` - View expiring subscriptions

## Architecture

```
/app/
├── backend/           # FastAPI backend
│   ├── server.py
│   ├── models/
│   └── routes/
└── frontend/          # React frontend
    ├── public/
    │   └── charts/
    │       ├── who/   # WHO growth chart SVGs (calibrated)
    │       └── cdc/   # CDC growth chart SVGs (calibrated)
    └── src/
        ├── components/
        │   └── ElectrolytesDialog.jsx  # Electrolyte correction calculator
        └── pages/
            └── nicu/
                └── GrowthChartPage.jsx  # Main chart component
```

## Key Files

### ElectrolytesDialog.jsx
- Location: `/app/frontend/src/components/ElectrolytesDialog.jsx`
- Sub-components: `/app/frontend/src/components/electrolytes/` (result display components)
- Features:
  - Calcium, Magnesium, Potassium, NaHCO3, Sodium, Phosphate calculations
  - "Round dose" toggle for easier dilution
  - IV/PO routes for Potassium
  - Peripheral/Central line options
  - Hyponatremia (Mild/Severe) and Hypernatremia (Nelson/Harriet Lane) methods

### Drug Formulary Data
- Location: `/app/frontend/src/data/formulary.json` (114 drugs)
- Wrapper: `/app/frontend/src/data/childrenFormularyData.js`
- Features:
  - JSON format for better performance and easier editing
  - Helper functions: getDrugById, drugCategories, drugCount
  - **Marquee Animation (Feb 2026):** Drug names >15 characters animate horizontally when card is expanded to reveal truncated text

### GrowthChartPage.jsx
- Location: `/app/frontend/src/pages/nicu/GrowthChartPage.jsx`
- Features:
  - WHO charts (0-2 years)
  - CDC charts (2-20 years)
  - Pinch-to-zoom and panning
  - Save as PNG
  - Multiple measurement types

## Prioritized Backlog

### P0 - Critical
- None currently

### P1 - High Priority
- Verify drug order in childrenFormulary.js matches source PDF order

### P2 - Medium Priority
- Create tabbed "About" section (Disclaimer, About Us, References) and consolidate medical references
- Add "Mechanical Ventilation" approach to Children > Approaches section
- UI standardization of NICU approach components
- Add data-testid attributes across interactive elements

### P3 - Low Priority
- Dark mode theme toggle
- Blood Gas calculator tutorial

## Test Credentials
- **Admin:** admin@pedotg.com / SMC159951
- **Tester:** test@pedotg.com / SMC2000

## 3rd Party Integrations
- `react-zoom-pan-pinch`: v3.7.0
- `html-to-image`: v1.11.13
- PayPal SDK for subscriptions (LIVE MODE)
- SMTP Email via Microsoft Exchange (GoDaddy)
