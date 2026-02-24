# Pediatrics On The Go - Product Requirements Document

## Original Problem Statement
Build a comprehensive pediatric medical reference application with clinical calculators, drug dosing, growth charts, and clinical guidelines for NICU and Pediatric ER/Ward settings.

## Core Requirements
1. Drug dosing calculator with weight-based and age-specific dosing
2. Growth charts with PDF export functionality
3. Clinical approaches and guidelines
4. GFR calculator for renal dose adjustments
5. Blood pressure percentiles
6. Intubation and fluid calculators

---

## Latest Feature: Comprehensive Renal Dose Adjustment (Chapter 31)

### User Requirements (Implemented December 2024)
Based on Chapter 31 "Drugs in Kidney Failure" (pages 412-422) of the pediatric formulary:

1. **Bedside CKiD Equation**: Use `eGFR = 0.413 × height(cm) / SCr(mg/dL)` for estimating kidney function
2. **Override General Doses**: For drugs in renal tables, replace standard dose with adjusted dose/interval based on eGFR
3. **Handle Unlisted Drugs**: Show warning "No specific renal adjustment guidance in Chapter 31"
4. **eGFR Categories**: Apply exact percentages and intervals for different eGFR bands (50-59, 30-49, 10-29, <10, IHD, PD)
5. **Calculation Rules**: `adjusted dose = percentage × usual dose` with new interval from table
6. **Age Limitations**: Do not apply to neonates (show dedicated reference message)
7. **Safety Warnings**: Show "Avoid use" / "Contraindicated" warnings when applicable
8. **Level-Guided Drugs**: For vancomycin, gentamicin, amikacin - show TDM message instead of auto-calculating
9. **Output Format**: Show renal-adjusted dose, eGFR value/category, and relevant warnings

### Implementation Details
- **Data File**: `/app/frontend/src/data/renalAdjustments.js` - Contains Chapter 31 data for antimicrobials and non-antimicrobials
- **Drug Aliases**: Comprehensive mapping for trade names (Augmentin → amoxicillin-clavulanate, etc.)
- **UI Components**: Enhanced drug cards with badges (TDM, Avoid, Renal) and expanded renal adjustment sections

---

## What's Been Implemented

### December 2024
- [x] Comprehensive renal dose adjustment system based on Chapter 31
- [x] Bedside CKiD eGFR calculator (k=0.413)
- [x] Drug name aliasing for trade names (Augmentin, Vancocin, etc.)
- [x] TDM badges for level-guided drugs (vancomycin, gentamicin, amikacin)
- [x] "Avoid" badges for contraindicated drugs at specific eGFR levels
- [x] eGFR category display (e.g., "15-29", "30-49", etc.)
- [x] Dose percentage calculations with interval adjustments
- [x] Chapter 31 reference in UI
- [x] BUG FIX: Augmentin showing "Avoid" instead of dose adjustment - FIXED via drug alias system

### Previous Sessions
- [x] Drug dosing calculator with weight-based calculations
- [x] Age-specific dose filtering (neonate, infant, child, adolescent)
- [x] Complex data tables with calculated dose columns
- [x] Swipe hint for mobile usability
- [x] Text wrapping fix for table cells
- [x] Multiple dose types in calculated column (General, Severe doses)

---

## Code Architecture

```
/app/frontend/src/
├── data/
│   ├── formulary.json          # Drug data with legacy renalAdjust
│   └── renalAdjustments.js     # NEW: Chapter 31 renal adjustment data
├── pages/
│   └── children/
│       └── DrugsPage.jsx       # Main drugs page with renal logic
└── components/ui/              # Shadcn UI components
```

---

## Pending Verification (P0)
- [ ] Growth chart PDF export fix - Background image missing in exports

## Upcoming Tasks (P1)
- [ ] Verify Sepsis approach table layout fix
- [ ] Verify bullet point spacing on Neonatal Examination page
- [ ] Review remaining drugs beyond antibiotics in formulary.json

## Future Tasks (P2)
- [ ] Refactor DrugsPage.jsx into smaller components
- [ ] Add "Mechanical Ventilation" approach
- [ ] Implement data-testid attributes across app
- [ ] Verify Electrolytes Calculator fix

---

## Test Credentials
- Email: test@test.com
- Password: 12341234

## Preview URL
https://pediatric-dosing.preview.emergentagent.com
