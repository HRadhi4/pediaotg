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

### Authentication
- JWT-based authentication
- Admin and user roles
- PayPal subscription integration

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
- Features:
  - Calcium, Magnesium, Potassium, NaHCO3, Sodium, Phosphate calculations
  - "Round dose to 5s" toggle for easier dilution
  - IV/PO routes for Potassium
  - Peripheral/Central line options
  - Hyponatremia (Mild/Severe) and Hypernatremia (Nelson/Harriet Lane) methods

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
- Add Salicylate (Aspirin) Toxicity approach
- Deploy and test PayPal integration in production

### P2 - Medium Priority
- Refactor ElectrolytesDialog.jsx (large component)
- UI standardization of NICU approach components
- Audit numerical inputs for missing min="0" attributes
- Delete redundant file: `/app/frontend/src/pages/children/ElectrolytesInfusionsPage.jsx`
- Add PayPal webhook signature verification

### P3 - Low Priority
- Dark mode theme toggle
- Blood Gas calculator tutorial

## Test Credentials
- **Admin:** admin@pedotg.com / SMC159951
- **Tester:** test@pedotg.com / SMC2000

## 3rd Party Integrations
- `react-zoom-pan-pinch`: v3.7.0
- `html-to-image`: v1.11.13
- PayPal SDK for subscriptions
