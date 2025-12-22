# Pediatrics to Go - Requirements & Architecture

## Original Problem Statement
Build an app with two choices: NICU and Children
- NICU section includes fluid calculations
- Children section: placeholder (coming soon)

## Phase 2 Requirements (Implemented)
1. Title changed to "Pediatrics to Go"
2. NICU/Children as rounded corner cards
3. Bottom Navigation Bar with:
   - Blood Gas Analysis (AI + Manual)
   - Electrolytes Replacement Calculator
   - 2 future feature placeholders
   - Neonatal Jaundice Calculator

## Phase 3 Updates (Current)
1. **Electrolytes Updates:**
   - Removed phosphate binder calculation
   - Removed patient type selector
   - Calcium shows dose in mg AND ml
   - Magnesium shows NICU + General Ward doses in mg AND ml
   - Potassium bolus: 0.5-1 mEq/kg over 1-2 hrs (preferably 2 hrs)
   - NaHCO3: Choose calculation method (HCO3, BE, or Both)
   - Added Sodium tab with Hyponatremia/Hypernatremia
     - Severe hyponatremia: 3-5 ml/kg 3%NaCl over 15-30 mins
     - Hypernatremia: FWD calculation with correction time based on Na level

2. **Blood Gas Updates:**
   - Removed albumin field
   - Shows Expected pCO2/HCO3 in compensation analysis

3. **Neonatal Jaundice Calculator:**
   - Weight, GA, Postnatal Age inputs
   - Bilirubin with unit toggle (mg/dL ↔ µmol/L)
   - Risk factors selection
   - PT and EX thresholds based on AAP/NICE guidelines
   - Color-coded recommendations

## Architecture

### Frontend (React)
- **Landing Page** (`/`): Card layout with NICU/Children + bottom nav (5 icons)
- **NICU Calculator** (`/nicu`): Fluid calculation interface
- **Blood Gas Dialog**: AI OCR + Manual entry, acid-base analysis with expected values
- **Electrolytes Dialog**: Ca, Mg, K, NaHCO3, Na, Phosphate + Drug Infusions
- **Jaundice Dialog**: PT/EX threshold calculator

### Backend (FastAPI)
- `/api/blood-gas/analyze-image` - Gemini AI OCR
- `/api/blood-gas/analyze` - Blood gas analysis with expected compensation values

## Next Tasks
1. Implement Children section functionality
2. Add remaining 2 nav bar features
3. Add print/export feature for calculations
