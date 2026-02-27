# Pediatrics On The Go - Product Requirements Document

## Overview
A comprehensive pediatric medical reference application designed for use by qualified physicians, featuring drug dosing calculators, growth charts, clinical scoring tools, and treatment approaches.

## Development Rules & Standards

### Pinch-to-Zoom Rule for Approaches Page
**Location:** `/app/frontend/src/pages/children/ApproachesPage.jsx`

All approach content in the Approaches page supports unified pinch-to-zoom:
- **Zoom range:** 100% to 250%
- **Reset:** Double-tap when zoomed to reset to 100%
- **Indicator:** Shows current zoom % in top-right corner when zoomed

**IMPORTANT RULES:**
1. All approaches are rendered inside the single zoomable container
2. Do NOT add separate zoom handling in individual approach components
3. Keep content responsive - zoom scales everything uniformly
4. Use relative units (rem, em, %) where possible for better zoom behavior

## Core Features

### Children Section
- **Drugs Page**: Data-driven dosing calculator with comprehensive renal dose adjustment system based on Chapter 31 formulary
- **Electrolytes Correction Calculator**: Multi-electrolyte calculator (Calcium, Magnesium, Potassium IV/PO, Sodium Bicarbonate, Sodium, Phosphate)
- **Blood Pressure**: Age-based BP percentiles
- **Infusions**: IV drug calculations
- **Intubation**: ETT + RSI Checklist
- **Scoring/Calculators**: GCS, PRAM, Westley, OI, IWL, BSA
- **CPR**: PALS drugs & algorithms
- **Approaches**: 24 clinical algorithms with pinch-to-zoom support

### NICU Section
- **Growth Charts**: WHO (0-2 years) and CDC (2-20 years) charts with PDF export
- **Fluid Calculator**
- **NRP Checklist**
- **UVC/UAC Calculator**
- **Blood Pressure**
- **PRBC/Exchange Transfusion**
- **Ballard Score**
- **Drugs**

### Admin Dashboard
- **User Management**: View, edit, delete users
- **Device Management**: View and revoke logged-in devices (NEW)
- **Subscription Management**: Manage user subscriptions
- **Statistics**: User and subscription counts

## What's Been Implemented

### February 27, 2026
- **Device Limit Feature (P0)**: Implemented max 3 devices per user account
  - Users can only be logged in on 3 devices simultaneously
  - New login attempts blocked with clear error message when limit reached
  - Admin users bypass the device limit
  - Files: `/app/backend/routes/auth.py`

- **Admin Device Management (P0)**: Admin can view and revoke user devices
  - New "Devices" column in admin user table showing X/3 device usage
  - Click device count to open device management modal
  - View device details: type, browser, user-agent, last login time
  - Revoke individual devices or all devices for a user
  - Files: `/app/backend/routes/admin.py`, `/app/frontend/src/pages/admin/AdminDashboard.jsx`

- **Email Notifications**: Admin notified of new registrations and subscriptions
  - Already implemented in previous session
  - Files: `/app/backend/services/email_service.py`, `/app/backend/routes/auth.py`, `/app/backend/routes/subscription.py`

### June 27, 2026
- **SEIZURES ALGORITHM Redesign**: Complete overhaul of the Epilepsy approach flowchart
  - Larger, more readable text with better visual hierarchy
  - Distinct colors for Yes (green) and No (red) branches for clarity
  - Yellow reference boxes (Box 1: Criteria of common seizures, Box 2: Stabilization & Blood Collection)
  - Added "Signs during seizure" panel (Tachycardia, Hypertension, Desaturation, Acidosis, Hyperthermia)
  - Proper flowchart arrows and connectors
  - All text content from the Pediatric Epilepsy Guidelines PDF preserved
  - File: `/app/frontend/src/pages/children/approaches/EpilepsyApproach.jsx`

- **Mobile Layout Fix for 'still seizing > 5 min' section**:
  - Changed from grid-cols-2 to grid-cols-1 md:grid-cols-2 for responsive stacking
  - Increased text sizes from text-[9px] to text-sm/text-xs for readability
  - Removed problematic ml-[50%] offset
  - Added clear section header "↓ If still seizing > 5 min ↓"

- **TABLE 4 - ANTI-SEIZURE MEDICATIONS Expansion**:
  - Expanded from 10 to 32 medications to match the complete PDF guideline
  - Added new Adult Max (mg/day) column
  - Now includes: Acetazolamide, Biotin, Brivaracetam, Bromide, Carbamazepine, Cenobamate, Clobazam, Clonazepam, Eslicarbazepine, Ethosuximide, Felbamate, Folinic acid, Gabapentin, IVIG, Lacosamide, Lamotrigine, Levetiracetam, Methylprednisolone, Nitrazepam, Oxcarbazepine, Perampanel, Phenobarbital, Phenytoin, Prednisolone, Pregabalin, Primidone, Pyridoxine, Retigabine, Rufinamide, Sodium Valproate, Topiramate, Vigabatrin
  - Red highlighting for medications not available in SMC
  - Critical side effects (SJS, Visual field defect) highlighted in red bold

### February 26, 2026
- **Drug Formulary Update - Phase 2**: Added comprehensive drug entries from main Formulary PDF
  - Added 17 comprehensive anticonvulsant entries from Harriet Lane Handbook
  - Drugs now have DUAL entries: SMC version (with SMC badge) + Main Formulary version (detailed dosing, indications, warnings)
  - Total drugs in formulary: **164**
  - Files modified: `/app/frontend/src/data/formulary.json`, `/app/frontend/src/pages/children/DrugsPage.jsx`

- **Bug Fix**: Fixed `drug.sideEffects.map is not a function` error
  - SMC drugs stored sideEffects as string, code expected array
  - Updated DrugsPage.jsx to handle both string and array formats

- **Drug Formulary Update - Phase 1**: Integrated epilepsy drugs from SMC Epilepsy Pharmacopedia document
  - Added 7 new antiepileptic drugs: Cenobamate, Eslicarbazepine, Felbamate, Retigabine, Stiripentol, Sulthiame, Tiagabine
  - All SMC Epilepsy Guideline drugs display "SMC" badge on drug cards

### February 24, 2026
- **Bug Fix**: Fixed Potassium PO rounding bug in Electrolytes Correction Calculator
  - Issue: Per-dose calculations showed floating-point precision errors when dividing daily dose by frequency (BID/TID/QID)
  - Solution: Added `Math.round(perDose * 10) / 10` to properly round to 1 decimal place
  - File: `/app/frontend/src/components/ElectrolytesDialog.jsx`
  - Tested: 17 mEq ÷ 3 (TID) = 5.7 mEq ✓, 17 mEq ÷ 4 (QID) = 4.3 mEq ✓

- **Bug Fix**: Minus sign input on mobile keyboards
  - Created custom `InputWithSignToggle.jsx` component with +/- toggle button
  - Applied to all Base Excess fields in Blood Gas and Electrolytes calculators

### Previous Sessions
- Comprehensive Renal Dosing System using Bedside CKiD formula
- Drug Card UI refactoring with consolidated dose display
- Co-Amoxiclav (Augmentin) IV dose update to 30 mg/kg/dose Q8h
- Renal adjustment data extracted to `/app/frontend/src/data/renalAdjustments.js`
- Growth Chart PDF export functionality

## Architecture

```
/app
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ElectrolytesDialog.jsx    # Electrolyte calculator
│       │   └── ui/                        # Shadcn components
│       ├── data/
│       │   ├── formulary.json            # Drug data
│       │   └── renalAdjustments.js       # Renal dosing rules
│       └── pages/
│           ├── admin/
│           │   └── AdminDashboard.jsx    # Admin panel with device mgmt
│           ├── children/
│           │   └── DrugsPage.jsx         # Drug dosing page
│           └── nicu/
│               └── GrowthChartPage.jsx   # Growth charts
└── backend/
    ├── routes/
    │   ├── auth.py                       # Login with device limit
    │   ├── admin.py                      # Admin APIs + device mgmt
    │   └── subscription.py               # Payment handling
    ├── services/
    │   ├── auth_service.py               # Auth logic
    │   └── email_service.py              # Email notifications
    └── server.py                          # FastAPI server
```

## API Endpoints

### Device Management (NEW)
- `GET /api/admin/user/{user_id}/devices` - List user's logged-in devices
- `DELETE /api/admin/user/{user_id}/devices/{device_id}` - Revoke specific device
- `DELETE /api/admin/user/{user_id}/devices` - Revoke all user devices

### Authentication
- `POST /api/auth/login` - Login (enforces device limit for non-admin users)
- `POST /api/auth/logout` - Logout (removes device registration)
- `POST /api/auth/signup` - Register (sends admin notification email)

## Pending Verification (P1)
- Sepsis approach table layout fix
- Bullet point spacing on Neonatal Examination page
- CDH and BPD Approach UI updates
- CDC Girls & Boys chart plotting accuracy

## Backlog (P2)
- Refactor `DrugsPage.jsx` into smaller components (GfrCalculator, DrugCard, DoseDisplayGrid)
- Add "Mechanical Ventilation" approach to Children section
- Implement `data-testid` attributes across all interactive elements
- Review remaining drugs in formulary.json for completeness
- Refactor large approach components (EpilepsyApproach.jsx, HeadacheApproach.jsx) into smaller sub-components

## Tech Stack
- Frontend: React, Tailwind CSS, Shadcn/UI
- Backend: FastAPI, MongoDB
- PDF Generation: jsPDF, html2canvas
- Email: SMTP via Microsoft Office 365

## Test Credentials
- **Admin:** admin@pedotg.com / SMC159951
- **Test User:** test@test.com / 12341234
