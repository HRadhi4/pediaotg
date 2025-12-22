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
   - 3 future feature placeholders

## Architecture Completed

### Frontend (React)
- **Landing Page** (`/`): Card layout with NICU/Children + bottom nav
- **NICU Calculator** (`/nicu`): Full fluid calculation interface
- **Blood Gas Dialog**: AI-powered (Gemini) OCR + Manual entry with full acid-base analysis
- **Electrolytes Dialog**: Comprehensive calculator with drug infusions reference
- **Theme Toggle**: Light/Dark mode with localStorage persistence

### Backend (FastAPI)
- `/api/blood-gas/analyze-image` - Gemini AI OCR for blood gas images
- `/api/blood-gas/analyze` - Blood gas analysis algorithm

### Features Implemented

#### Phase 1 (NICU Calculator)
1. ✅ Landing page with NICU/Children selection
2. ✅ TFI input with age-based suggestions
3. ✅ Fluid type selection (D10% / D10%+D50%)
4. ✅ 3% NaCl, Feed, TPN deductions
5. ✅ Real-time calculations with breakdown
6. ✅ Light/Dark theme toggle

#### Phase 2 (Blood Gas & Electrolytes)
1. ✅ Blood Gas Analysis Dialog
   - AI Analysis via camera/gallery (Gemini OCR)
   - Manual entry with all fields (pH, pCO2, HCO3, BE, Na, K, Cl, Lactate, Albumin)
   - Diagnosis: Respiratory/Metabolic Acidosis/Alkalosis
   - Compensation detection (Winter's formula)
   - Lactic acidosis detection
   - Anion gap calculation (albumin-corrected)
   - Cl:Na ratio for metabolic acidosis
   - Electrolyte imbalance alerts

2. ✅ Electrolytes Calculator Dialog
   - Calcium Gluconate 10% (1ml/kg, max 10ml)
   - Resonium (Phosphate binder)
   - Magnesium (NICU vs General Ward protocols)
   - Potassium (IV, PO, Bolus calculations)
   - NaHCO3 (Two correction methods, infusion rates)
   - Phosphate (Addphos, Phosphate Sandose)
   - Drug Infusions Reference (MgSO4, Addiphos, Ca Gluconate, Ca Chloride, KCL, SodaBicarb)
   - Incompatibility warnings

3. ✅ Bottom Navigation Bar
   - 5 icons: Blood Gas, Electrolytes, 3 future features

## Next Tasks
1. Implement Children section functionality
2. Add remaining 3 nav bar features
3. Add print/export feature for calculations
4. Offline mode for blood gas analysis (currently requires internet for AI)
