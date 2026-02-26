# Pediatrics On The Go - Product Requirements Document

## Overview
A comprehensive pediatric medical reference application designed for use by qualified physicians, featuring drug dosing calculators, growth charts, clinical scoring tools, and treatment approaches.

## Core Features

### Children Section
- **Drugs Page**: Data-driven dosing calculator with comprehensive renal dose adjustment system based on Chapter 31 formulary
- **Electrolytes Correction Calculator**: Multi-electrolyte calculator (Calcium, Magnesium, Potassium IV/PO, Sodium Bicarbonate, Sodium, Phosphate)
- **Blood Pressure**: Age-based BP percentiles
- **Infusions**: IV drug calculations
- **Intubation**: ETT + RSI Checklist
- **Scoring/Calculators**: GCS, PRAM, Westley, OI, IWL, BSA
- **CPR**: PALS drugs & algorithms
- **Approaches**: DKA, SE, Hyperammonemia, Sepsis

### NICU Section
- **Growth Charts**: WHO (0-2 years) and CDC (2-20 years) charts with PDF export
- **Fluid Calculator**
- **NRP Checklist**
- **UVC/UAC Calculator**
- **Blood Pressure**
- **PRBC/Exchange Transfusion**
- **Ballard Score**
- **Drugs**

## What's Been Implemented

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
│           ├── children/
│           │   └── DrugsPage.jsx         # Drug dosing page
│           └── nicu/
│               └── GrowthChartPage.jsx   # Growth charts
└── backend/
    └── server.py                          # FastAPI server
```

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

## Tech Stack
- Frontend: React, Tailwind CSS, Shadcn/UI
- Backend: FastAPI, MongoDB
- PDF Generation: jsPDF, html2canvas

## Test Credentials
- Email: test@test.com
- Password: 12341234
