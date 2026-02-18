# Pediatrics On The Go - Product Requirements Document

## Original Problem Statement
Build a comprehensive pediatric medical calculator application with:
- Drug dosing calculations based on weight and age
- Age-specific dosing (neonate ≤28 days, infant 28d-1yr, child >1yr)
- Renal-adjusted dosing based on GFR calculations
- Growth chart plotting with PDF export
- Clinical guidelines and approaches

## Core Features Implemented

### 1. Drug Calculator (Children > Drugs) - COMPLETED ✅
- **Age Input Selector**: Days/months/years dropdown
- **Age-Specific Dosing**: 
  - Neonate (≤28 days) → Shows neonatal doses
  - Infant (28 days - 1 year) → Shows infant doses
  - Child (>1 year) → Shows pediatric doses
  - No age → Shows all doses
- **Renal Adjustment**: 
  - GFR Calculator (Schwartz equation)
  - Calculates ADJUSTED dose (not just text)
  - Example: 100mg Q8H → 100mg Q12H (renal adjusted)
  - Handles "Avoid" cases
- **Drug Database**: 114 drugs with complete renal adjustment data
- **Display**: Doses visible on collapsed card before expanding

### 2. Empirical Antibiotics Page - COMPLETED ✅
- Created under Children > Approaches
- Complex dose calculations
- References added

### 3. Growth Charts - PDF FIX PENDING ⏳
- Background image missing in PDF export
- Fix implemented but UNTESTED

## Technical Architecture

```
/app/frontend/src/
├── pages/children/
│   ├── DrugsPage.jsx          # Main drugs page with age/renal logic
│   └── Approaches/
│       └── EmpiricalAntibiotics.jsx
├── data/
│   └── formulary.json         # 114 drugs with renalAdjust data
└── components/ui/             # Shadcn components
```

## Key Technical Details

### Age Category Logic
```javascript
if (totalAgeDays <= 28) return "neonate";
if (totalAgeDays < 365) return "infant";
if (totalAgeDays < 365 * 12) return "child";
return "adolescent";
```

### Renal Adjustment Calculation
- Parses adjustment text: "100% dose Q12h", "50% dose", "Avoid"
- Applies percentage to calculated dose
- Updates frequency based on renal text
- Shows "(renal)" indicator

## Pending Issues (P0)
1. Growth chart PDF export - fix implemented, needs testing

## Backlog
- Add Linezolid, Levofloxacin to formulary
- Refactor DrugsPage.jsx into components
- Add data-testid attributes
- Mechanical Ventilation approach

## Test Credentials
- Email: test@test.com
- Password: 12341234

## Last Updated
February 2026 - Age selector, renal dose calculation, formulary review
