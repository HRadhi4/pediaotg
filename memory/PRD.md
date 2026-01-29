# Pediatrics On The Go - Product Requirements Document

## Original Problem Statement
Build and refine a comprehensive pediatric medical calculator application with:
- WHO and CDC growth charts using high-resolution SVG files
- Interactive features: pinch-to-zoom, panning
- Accurate data point plotting on charts
- Save chart as PNG functionality
- Intuitive UI for switching between chart types, genders, and measurements

## User's Preferred Language
English

## Core Application
A pediatric medical calculator app featuring:
- NICU calculators (Fluid, UVC/UAC, Intubation, Blood Pressure, Transfusions, Growth Charts)
- Children's ward tools
- Drug formulary
- Admin dashboard with PayPal subscription

## What's Been Implemented

### Growth Charts (Jan 2026)
- **WHO Charts (0-2 years):** Weight, Length, BMI, Head Circumference for both Boys and Girls
- **SVG Rendering Fix:** Changed from `<img>` + `<svg>` overlay to single `<svg>` with embedded `<image>` to fix alignment issues
- **Coordinate Calibration:** Most WHO charts calibrated via SVG gridline analysis
- **Girls HC Chart:** Replaced with new user-provided SVG (viewBox: 0 0 1055.9599 780.10272)

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
    │       └── cdc/   # CDC growth chart SVGs (NOT calibrated)
    └── src/
        └── pages/
            └── nicu/
                └── GrowthChartPage.jsx  # Main chart component
```

## Key Files
- `/app/frontend/src/pages/nicu/GrowthChartPage.jsx` - Growth chart logic and coordinates
- `/app/frontend/public/charts/who/` - WHO SVG files
- `/app/frontend/public/charts/cdc/` - CDC SVG files (need calibration)

## Pending Issues (P0-P2)

### P0 - Critical
- Verify plotting accuracy for Girls Head Circumference (user verification pending)

### P1 - High Priority
- Calibrate all CDC growth charts
- PayPal production deployment testing

### P2 - Medium Priority
- NICU UI standardization verification
- Numerical input `min="0"` audit
- Refactor ElectrolytesDialog.jsx

## Upcoming Tasks
- Add Salicylate (Aspirin) Toxicity approach
- Continue Drug Formulary review
- PayPal webhook signature verification
- Delete redundant file: `/app/frontend/src/pages/children/ElectrolytesInfusionsPage.jsx`

## Future Tasks
- Dark mode theme toggle
- Tutorial/guided walkthrough for Blood Gas calculator

## Test Credentials
- **Admin:** admin@pedotg.com / SMC159951
- **Tester:** test@pedotg.com / SMC2000

## Third-Party Integrations
- `react-zoom-pan-pinch`: v3.7.0 (chart zoom/pan)
- `html-to-image`: v1.11.13 (save PNG)
- PayPal SDK (subscriptions)

## Technical Notes

### SVG Coordinate Calibration Method
1. Analyze SVG file to find path elements representing major gridlines
2. Extract pixel coordinates for chart boundaries (xMin, xMax, yMin, yMax)
3. Map to data ranges (ageMin, ageMax, valueMin, valueMax)
4. Update chartCoordinates object in GrowthChartPage.jsx

### SVG Rendering Pattern (Important)
```jsx
<svg viewBox={viewBox}>
  <image href={svgFile} width="100%" height="100%" />
  {/* Plot circles here - shares coordinate space with image */}
</svg>
```
