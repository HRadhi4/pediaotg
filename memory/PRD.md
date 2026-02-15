# Medical Calculator Application - PRD

## Original Problem Statement
Build a comprehensive medical calculator application for NICU (Neonatal Intensive Care Unit) and Children's ER/Pediatric Ward with pixel-perfect growth charts and clinical decision support tools.

## Core Requirements
- **User Authentication:** Email/password login with subscription management
- **Growth Charts:** WHO (Birth-2 years) and CDC (2-20 years) with pixel-perfect data plotting
- **Medical Calculators:** Fluid, Blood Gas, Electrolytes, GIR, Blood Products, Jaundice, etc.
- **Clinical Approaches:** NICU-specific condition management guides
- **Mobile-First Design:** Responsive UI optimized for clinical use

## Architecture
- **Frontend:** React.js with Tailwind CSS and Shadcn/UI components
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Authentication:** JWT-based with subscription tiers

---

## Implementation Status

### ✅ Completed Features

#### Growth Charts - PIXEL PERFECT
1. **WHO Growth Charts (0-2 years)** - All calibrated
   - Weight-for-age, Length-for-age, BMI-for-age, Head Circumference
   - Boys and Girls variants

2. **CDC Growth Charts (2-20 years)** - All calibrated
   - **Stature & Weight (Boys & Girls)** ✅
     - X: Age 2 = 450px, Age 20 = 2060px
     - Stature Y: 75cm = 2420px, 195cm = 400px
     - Weight Y: 10kg = 2930px, 110kg = 1224px
   
   - **BMI-for-age (Boys & Girls)** ✅ (Feb 15, 2026)
     - High-resolution PNG from official CDC (1105x1430 pixels)
     - X: Age 2 = 145px, Age 20 = 941px
     - Y: BMI 40 (top) = 177px, BMI 11 (bottom) = 1203px

#### Medical Calculators
- Fluid Calculator, Blood Gas Analyzer, Electrolytes Correction
- GIR Calculator, Blood Products Calculator, Jaundice Assessment
- Ballard Score, NRP Checklist, Catheter Calculator
- Intubation Guide, Blood Pressure Reference, PRBC Guidelines
- Exchange Calculator, Drugs Reference, Postnatal Assessment

#### Authentication & Subscription
- Login/Register flows with PayPal integration
- Subscription management with timezone-aware checks

---

## Pending Tasks

### P1 - High Priority
- [ ] Functionally test Electrolytes Calculator fix (Step 4 hiding & summary text)

### P2 - Medium Priority  
- [ ] Refactor `ElectrolytesDialog.jsx` into smaller components
- [ ] Refactor "NICU > Approaches > Mechanical Ventilation" page layout
- [ ] Add "Mechanical Ventilation" approach to Children section
- [ ] Implement `data-testid` attributes across interactive elements

---

## Key Files
```
/app/frontend/src/pages/nicu/GrowthChartPage.jsx  # Growth chart coordinates
/app/frontend/public/charts/cdc/                   # CDC chart images
  - cdc_boys_bmi_2_20.png (1105x1430)
  - cdc_girls_bmi_2_20.png (1105x1430)
  - cdc_boys_stature_weight_2_20.png
  - cdc_girls_stature_weight_2_20.png
```

## Test Credentials
- Email: `test@test.com`
- Password: `12341234`

## Third-Party Integrations
- PayPal (Subscriptions)
- SMTP Email Service
