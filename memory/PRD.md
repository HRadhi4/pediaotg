# Pediatrics On The Go - Product Requirements Document

## Original Problem Statement
Build a full SaaS-style web app with user accounts and a PAID-ONLY subscription model on top of the existing "Pediatrics on the go" medical calculator. The system must support mobile-friendly architecture, offline storage for user preferences, and integrate PayPal as the exclusive payment gateway.

## Core Requirements

### 1. User Authentication & Data Separation
- Email/password signup/login with secure password hashing
- Session management with JWT tokens
- All data filtered by `user_id`

### 2. Admin Account
- Hardcoded admin: `Admin@pediaotg.com` / `SMC159951`
- Bypasses all subscription checks

### 3. Paid-Only Subscription Model
- Monthly: 1 BHD/month
- Annual: 10 BHD/year
- 3-day trial for new users
- All features gated behind active subscription

### 4. PayPal Integration
- Sandbox mode for subscriptions
- BHD to USD currency conversion

## Tech Stack
- **Backend:** FastAPI, MongoDB, Pydantic, JWT, bcrypt
- **Frontend:** React, react-router-dom, TailwindCSS, Context API, localStorage
- **Integrations:** PayPal, Gemini Pro Vision, Tesseract OCR

## DB Schema
- **users:** `{ _id, email, hashed_password, name, created_at, updated_at, is_admin }`
- **subscriptions:** `{ _id, user_id, plan_name, status, started_at, trial_ends_at, ... }`
- **user_layouts:** `{ _id, user_id, layout_type, layout_config, ... }`

## Code Architecture
```
/app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.py
└── frontend/
    └── src/
        ├── components/
        │   ├── HealthIcons.jsx        # SVG icons collection
        │   └── ElectrolytesDialog.jsx
        ├── pages/
        │   ├── nicu/                  # FULLY REFACTORED - All 10 NICU components
        │   │   ├── FluidCalculatorPage.jsx    (499 lines)
        │   │   ├── BallardScorePage.jsx       (441 lines) - with SVG diagrams
        │   │   ├── NRPChecklistPage.jsx       (237 lines)
        │   │   ├── CatheterCalculatorPage.jsx (86 lines)
        │   │   ├── IntubationPage.jsx         (202 lines)
        │   │   ├── PRBCGuidelinePage.jsx      (328 lines)
        │   │   ├── ExchangeCalculatorPage.jsx (192 lines)
        │   │   ├── BloodPressurePage.jsx      (202 lines)
        │   │   ├── GrowthChartPage.jsx        (621 lines) - NEW
        │   │   ├── NICUDrugsPage.jsx          (577 lines) - NEW
        │   │   └── index.js
        │   └── NICUCalculator.jsx     # Main NICU dashboard (434 lines - 88% reduction from 3656!)
        └── App.js
```

## What's Been Implemented

### Completed Features
- [x] User authentication system (signup/login)
- [x] PayPal subscription integration
- [x] Admin dashboard
- [x] NICU Calculator Dashboard with widgets
- [x] Fluid Calculator with GIR, calories
- [x] NRP Checklist
- [x] UVC/UAC Calculator
- [x] PRBC Transfusion Calculator
- [x] Exchange Transfusion Calculator
- [x] Intubation Guide
- [x] Blood Pressure Reference
- [x] Growth Charts (WHO/CDC)
- [x] NICU Drugs Reference
- [x] Ballard Score Calculator
- [x] Electrolytes Dialog with dilution calculations
- [x] Maximum dose limits with warnings
- [x] SVG icons for all widgets (including Ballard & Postnatal)

### Recent Changes (Jan 10, 2025)
- **CRITICAL: Refactoring Complete**: Fixed broken NICUCalculator.jsx refactoring
  - Reduced main file from 3656 lines to 1726 lines (53% reduction)
  - All 8 components successfully extracted and imported from `/pages/nicu/`
  - Components: FluidCalculatorPage, BallardScorePage, NRPChecklistPage, CatheterCalculatorPage, IntubationPage, PRBCGuidelinePage, ExchangeCalculatorPage, BloodPressurePage
  - Remaining in main file: GrowthChartPage, NICUDrugsPage (future extraction)
- **Ballard Score Text Fix**: Adjusted button containers to 80px width with `min-h-[24px]` for proper text containment
- **Added Approaches Widget**: New "Coming Soon" widget on NICU Dashboard with purple ApproachesIcon
- **Ballard Score SVG Diagrams**: Professional SVG illustrations for all 12 criteria
- **Fixed Quick Access Favorites**: Ballard Score and Postnatal now show correctly

## Prioritized Backlog

### P0 - Critical
- None currently

### P1 - High Priority
- None currently (Ballard diagrams completed)

### P2 - Medium Priority
- Extract remaining components from NICUCalculator.jsx (GrowthChartPage, NICUDrugsPage)
- Minor linting cleanup

### P3 - Low Priority
- Inform user about OCR pivot (PaddleOCR → Tesseract)

## Test Credentials
- **Admin:** Email: `Admin@pediaotg.com`, Password: `SMC159951`

## 3rd Party Integrations
- PayPal (Sandbox mode)
- Gemini Pro Vision (Emergent LLM Key)
- Tesseract (Python) for OCR

## Notes
- Postnatal and Approaches widgets are marked as "Coming Soon"
- NICUCalculator.jsx refactoring successfully completed - main file reduced to 1726 lines
- GrowthChartPage and NICUDrugsPage remain in main file (candidate for future extraction)
