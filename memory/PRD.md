# Medical Calculator Application - PRD

## Original Problem Statement
Build a comprehensive medical calculator application for NICU (Neonatal Intensive Care Unit) and Children's ER/Pediatric Ward. The application should include growth charts (WHO and CDC), various medical calculators, and clinical decision support tools.

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

## Key Technical Decisions
- Growth chart coordinate mapping uses linear interpolation from user-calibrated pixel values
- Charts use static PNG/SVG images with SVG overlay for data points
- Drag-and-drop widget organization for NICU dashboard

---

## Implementation Status

### ✅ Completed Features
1. **User Authentication System**
   - Login/Register flows
   - Subscription management with PayPal integration
   - Protected routes

2. **WHO Growth Charts (0-2 years)**
   - Weight-for-age
   - Length-for-age
   - BMI-for-age
   - Head Circumference
   - Boys and Girls variants

3. **CDC Growth Charts (2-20 years)**
   - Stature & Weight charts (Boys & Girls) - PIXEL-PERFECT ✅
   - BMI-for-age (Boys & Girls) - PIXEL-PERFECT ✅ (Feb 2026)
   
4. **NICU Calculators**
   - Fluid Calculator
   - Blood Gas Analyzer
   - Electrolytes Correction Calculator
   - GIR Calculator
   - Blood Products Calculator
   - Jaundice Assessment
   - Ballard Score
   - NRP Checklist
   - Catheter Calculator
   - Intubation Guide
   - Blood Pressure Reference
   - PRBC Guidelines
   - Exchange Calculator
   - Drugs Reference
   - Postnatal Assessment

5. **Clinical Approaches**
   - Multiple NICU condition-specific approaches implemented

### 🔧 Recent Changes (Feb 2026)
- **CDC BMI Chart Y-Axis Fix:** Applied user-provided pixel coordinates
  - Y pixel top = 153 → BMI 35
  - Y pixel bottom = 842 → BMI 11
  - Updated both Boys and Girls charts
- **Auth Subscription Fix:** Fixed timezone-aware datetime comparison in subscription check

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

## File Structure Reference
```
/app
├── backend/
│   └── src/
│       └── services/
│           └── auth_service.py  # Auth & subscription logic
└── frontend/
    └── src/
        ├── pages/
        │   ├── NICUCalculator.jsx  # Main NICU dashboard
        │   └── nicu/
        │       └── GrowthChartPage.jsx  # Growth chart with coordinates
        └── components/
            └── ElectrolytesDialog.jsx  # Needs refactoring
```

## Test Credentials
- Email: `test@test.com`
- Password: `12341234`

## Third-Party Integrations
- PayPal (Subscriptions)
- SMTP Email Service
