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
        │   ├── nicu/                  # Refactored NICU components
        │   │   ├── FluidCalculatorPage.jsx
        │   │   ├── BallardScorePage.jsx
        │   │   └── index.js
        │   └── NICUCalculator.jsx     # Main NICU dashboard
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
- Fixed Ballard Score and Postnatal widget icons (replaced emojis with SVG icons)
- Created refactored component files in `/app/frontend/src/pages/nicu/`:
  - `FluidCalculatorPage.jsx`
  - `BallardScorePage.jsx`
  - `index.js`

## Prioritized Backlog

### P0 - Critical
- None currently

### P1 - High Priority
- Add diagram images to Ballard Score calculator for each scoring criterion

### P2 - Medium Priority
- Complete refactoring of NICUCalculator.jsx (extract remaining components)
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
- Postnatal widget is marked as "Coming Soon"
- NICUCalculator.jsx is still a large file (~3900 lines) but refactoring has begun
