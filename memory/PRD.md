# Pediatrics on the Go - PRD

## Original Problem Statement
Build a full SaaS-style web app "Pediatrics on the Go" with:
- User accounts with paid-only subscription model using PayPal
- Admin account for managing users
- Medical calculators for NICU and Pediatric ward
- Offline storage capabilities

## Current Implementation Status

### Core Features (Completed)
- ✅ User authentication (JWT-based)
- ✅ Admin authentication with hardcoded credentials
- ✅ Tester account with full access (no admin dashboard)
- ✅ PayPal subscription integration (with state-based auth for redirect flow)
- ✅ Trial subscription (3 days)
- ✅ Medical disclaimer popup
- ✅ Welcome back [username] message on landing page

### NICU Calculator (Completed - Refactored)
- ✅ Fluid Calculator
- ✅ Ballard Score
- ✅ Growth Charts
- ✅ Blood Gas Analysis
- ✅ TPN Calculator
- ✅ Phototherapy Guidelines
- ✅ Drug Calculator
- ✅ Ventilator Settings
- ✅ Feeding Calculator
- ✅ Bilirubin Management
- ✅ **NICU Approaches** (NEW - 16 clinical guideline components)

### Children Calculator (Completed)
- ✅ Fluid Replacement
- ✅ Drugs Page (100 drugs with max dose capping) - **UPDATED Jan 19, 2026**
- ✅ Blood Pressure
- ✅ **Electrolytes & Infusions** (Combined) - **NEW Jan 20, 2026**
- ✅ Intubation
- ✅ Scoring/Calculators
- ✅ CPR
- ✅ Approaches

### Admin Dashboard (Completed)
- ✅ User listing with pagination
- ✅ Add User functionality
- ✅ Delete User functionality
- ✅ Edit User (password, subscription)
- ✅ Subscription stats
- ✅ Search users

### Branding
- ✅ Custom app icon/logo
- ✅ Updated favicon

### PayPal Integration (Fixed January 12, 2026)
- ✅ State-based authentication for PayPal redirect flow
- ✅ `/create-order` returns state_token stored in localStorage before redirect
- ✅ `/capture-order-with-state` endpoint authenticates using state_token
- ✅ Returns new JWT tokens after payment capture to restore user session
- ✅ 30-minute state token expiry for security
- ✅ Email notifications for subscription changes

## User Accounts
- Admin: `admin@pedotg.com` / `SMC159951`
- Tester: `test@pedotg.com` / `SMC2000` (full app access, no admin dashboard)

## Database Configuration

### Development (Current)
- **MongoDB**: Local (`mongodb://localhost:27017`)
- **Database**: `test_database`

### Production (Atlas - Ready for Deployment)
- **Cluster**: `pedotg.oaffcd1.mongodb.net`
- **Config file**: `/app/backend/.env.atlas`
- **To deploy**: Replace `MONGO_URL` in `.env` with Atlas connection string from `.env.atlas`

## Tech Stack
- Frontend: React, Shadcn/UI, TailwindCSS
- Backend: FastAPI, Python
- Database: MongoDB
- Payment: PayPal Sandbox

## 3rd Party Integrations
- PayPal (subscription payments)
- Pytesseract (100% local OCR - replaced Gemini cloud OCR)
- recharts (charts)
- html2canvas
- GoDaddy/Microsoft Exchange SMTP (emails)

## Recent Changes (January 16, 2026)

### Session 12 Updates (January 28, 2026)
- ✅ **PayPal Service Rebuilt from Scratch**:
  - Completely rewrote `/app/backend/services/paypal_service.py` for cleaner Emergent deployment
  - Uses `FRONTEND_URL` environment variable dynamically for return/cancel URLs
  - Removed hardcoded URLs - now builds callback URLs from env vars at runtime
  - Added comprehensive `verify_credentials()` endpoint for deployment debugging
  - Clean error handling with informative error messages
  - Live credentials configured: Mode=live, API=api-m.paypal.com
  
- ✅ **Children Drugs Page UI Fixes**:
  - Fixed text wrapping issue in calculated dose display by adding `whitespace-nowrap` and `flex-shrink-0`
  - Increased frequency badge size from `text-[9px]` to `text-sm` to match NICU styling
  - Changed frequency badge styling to blue pill design: `bg-blue-100 text-blue-700 px-2 py-0.5 rounded`
  - Both NICU and Children Drugs pages now have consistent UI
  
- ✅ **Deployment Configuration Fixes**:
  - Fixed `.gitignore` to allow `.env` files for deployment (removed lines blocking `*.env`)
  - Added `peds-go.emergent.host` to CORS origins in `server.py`
  - Removed hardcoded `PAYPAL_RETURN_URL` and `PAYPAL_CANCEL_URL` from `.env`

### Session 11 Updates (Current - January 21, 2026)
- ✅ **Nomogram Pinch-to-Zoom (react-zoom-pan-pinch)**:
  - Replaced button-based zoom controls (+/- buttons) with modern touch-friendly zoom
  - Installed `react-zoom-pan-pinch` library
  - **Features**: Pinch-to-zoom on mobile, scroll-to-zoom on desktop, drag-to-pan, double-tap/click to reset
  - **minScale=1** (prevents zoom below 100%), **maxScale=4** (allows zoom up to 400%)
  - Instructions shown: "Scroll to zoom • Drag to pan • Double-click to reset"
  - Patient data point remains correctly positioned at all zoom levels
  
- ✅ **Blood Gas Reading Approach (NEW)**:
  - New file: `/app/frontend/src/pages/children/approaches/BloodGasApproach.jsx`
  - **Visual Flowchart Structure** based on user-provided images:
    - pH node at top with branching arrows to Acidemia/Alkalemia
    - Expandable flowchart nodes with clickable sections
    - Color-coded branches: red (acidosis), blue (alkalosis), amber (respiratory)
  - **Sections**:
    1. **Enter Blood Gas Values**: pH, pCO₂, HCO₃⁻, Na⁺, Cl⁻, Albumin inputs
       - Automatic calculations: Anion Gap, Corrected AG, Delta Ratio
       - Primary disorder detection with compensation analysis
    2. **📊 ABG Interpretation Flowchart**: Visual pH branching flowchart with Primary Disorder Rules
    3. **📐 Compensation Rules (Box Rule)**: 
       - Full compensation table (6 rows)
       - **Visual Box Rule diagram** (2x2 table with numbers 1,2,4,5)
       - Winter's Formula for Metabolic Acidosis
       - Respiratory compensation equations
    4. **🔴 Metabolic Acidosis → Anion Gap Flowchart**:
       - MUDPILES mnemonic (High AG)
       - USED CARP mnemonic (Normal AG)
       - Delta Ratio calculator with interpretation
       - HAGMA + High Osmolar Gap (L-LA Type A/B, D-LA)
       - NAGMA → Urine AG (positive/negative)
    5. **🔵 Metabolic Alkalosis Flowchart**:
       - Chloride Responsive (UCl <10) vs Chloride Resistant (UCl >10)
       - HTN branch with Renin & Aldosterone levels
       - Detailed approach by Serum Cl
  - **Quick Reference** step cards at bottom
  - Added to ApproachesPage navigation with keywords

- ✅ **Hyponatremia Mild/Asymptomatic - Fluid Deficit Selector**:
  - Replaced fluid deficit entry box with **Infant/Child toggle buttons**
  - **Infant** options: 5% (50ml/kg), 10% (100ml/kg), 15% (150ml/kg)
  - **Child** options: 3% (30ml/kg), 6% (60ml/kg), 9% (90ml/kg)
  - Shows calculated ml values based on patient weight
  - Results display includes deficit type and percentage
  - State variables: `hypoDeficitType`, `hypoDeficitPercent`
  
- ✅ **IEM Emergencies - Merged with Metabolic Emergencies**:
  - Added **SMC Guideline / UpToDate toggle** (`data-testid="iem-guideline-switch"`)
  - **SMC Guideline** (default): Disease Crisis Quick Reference table (9 diseases), Emergency Regimen Principles, Hyperammonemia Management, GSD Emergency, Acidosis Management
  - **UpToDate**: Clinical Presentations (Neurologic 85%, GI 58%), Initial Laboratory Evaluation, Distinguishing IEM by Lab Findings, Hyperammonemia EMERGENCY Management, Hypoglycemia with/without ketosis, Seizures Cofactor Trials
  - Removed separate "Metabolic Emergencies" tab from ApproachesPage
  
- ✅ **Rumack-Matthew Nomogram Complete Rewrite with Zoom**:
  - Downloaded new optimized SVG: `/public/images/rumack_matthew_nomogram_new.svg`
  - **Completely rewrote coordinate mapping** from scratch using actual SVG coordinates
  - Transform matrix: `scale(0.76671865, 0.76694206) translate(1.1857538, 5.0148173)`
  - **Y-axis** reference points: 1000@y=100, 500@y=170.57, 200@y=272.39, 150@y=302.18, 100@y=347.39, 50@y=423.83, 10@y=600, 5@y=673.57
  - **X-axis** tick positions: 4h@x=220.02, 8h@x=292, 12h@x=363, 16h@x=435.16, 20h@x=506.40, 24h@x=577.95
  - **Zoomable SVG viewer** with controls: Zoom In (+25%), Zoom Out (-25%), Reset (100%)
  - Zoom range: 50% to 300%
  - Scrollable container when zoomed
  - Point colors: green (below treatment), orange (above treatment), red (probable toxicity)
  - **Verified**: All test points plot correctly at all zoom levels
  
- ✅ **DKA Approach SMC Guideline Toggle**:
  - Added **toggle switch** to switch between "Saudi Booklet" (default) and "SMC Guideline"
  - **Saudi Booklet** sections: Recognition & Diagnosis, 1st Hour Management, Fluid Management, Insulin, Potassium, Dextrose, Cerebral Edema, DKA Resolution
  - **SMC Guideline** sections (Kingdom of Bahrain MOH): Introduction, Diagnosis, Initial Investigations, Monitoring, Fluids, Potassium, Insulin, Bicarbonate, Cerebral Edema, Troubleshooting
  - SMC Guideline includes weight-based fluid rates table, corrected sodium formula, serum osmolality formula
  - Toggle data-testid: `dka-guideline-switch`

- ✅ **Testing:** 100% pass rate
  - iteration_23.json: DKA SMC Guideline, IEM Emergencies, Acetaminophen (6/6)
  - iteration_24.json: Hyponatremia deficit selector, IEM toggle, Nomogram calibration (8/8)

### Session 10 Updates (January 21, 2026)
- ✅ **Hyponatremia Calculator Overhaul (Based on User Flowcharts)**:
  - **Mild/Asymptomatic (Na 125-134)** - Complete 4-step process:
    - Step 1: Determine Volume (Maintenance 100/50/20 + Deficit, Max 2.5L/day)
    - Step 2: Sodium Correction (Na Deficit = Wt × 0.6 × (Target - Measured), Na Maintenance = Wt × 2)
    - Step 3: Determine Fluid Type (calculates Na concentration needed, recommends NS/RL/1/2NS/3%NaCl)
    - Step 4: Add Dextrose (D5% mix ratio: 450ml NS + 50ml D50% per 500ml)
    - Final Order with rate displayed prominently
  
  - **Severe/Symptomatic (Na < 125)** - Two treatment options:
    - Option 1: 3% Saline Infusion (1-2 ml/kg/hr, Goal: +6-8 mEq/L, with desmopressin note)
    - Option 2: 3% Saline Bolus (100-150 ml, Goal: +2-3 mEq/L, check q20min)
    - After Symptom Resolution protocol included

- ✅ **Hypernatremia (Harriet Lane) Deficit Selector**:
  - Replaced free-text Fluid Deficit input with **Infant/Child toggle selector**
  - **Infant** options: 5% (50ml/kg), 10% (100ml/kg), 15% (150ml/kg)
  - **Child** options: 3% (30ml/kg), 6% (60ml/kg), 9% (90ml/kg)
  - Automatically calculates deficit in ml based on weight and selection
  - Result header shows selected deficit type (e.g., "Deficit: Infant 10% = 1500 ml")

- ✅ **Fixed Broken JSX in ElectrolytesDialog**:
  - Removed duplicate/orphaned RadioGroup code (lines 1136-1141)
  - Cleaned up conditional rendering structure

- ✅ **Testing**: Manual verification via screenshots - all calculations working correctly

### Session 9 Updates (January 21, 2026)
- ✅ **Jaundice Calculator Data Corrections**:
  - Fixed PT and EX threshold values to match user-provided reference table
  - Updated term infant medium risk values: PT[6]=255, PT[7]=270
  - Updated term infant low risk EX values: EX[7]=430
  - Fixed age category selection to use `getAgeCategoryTerm()` vs `getAgeCategoryPreterm()` based on GA
  - **Testing**: 100% pass rate (iteration_22.json - 8/8 tests)

- ✅ **NEW: Potassium (PO) Option Added to Electrolyte Calculator**:
  - Merged IV and PO into single "Potassium" dropdown option with **IV/PO switch toggle**
  - **IV Mode**: Full calculation with dose, drug volume, diluent, total volume, administration rate
  - **PO Mode**: 
    - Dose Range: 1-4 mEq/kg/day (divided BD-QID)
    - Frequency Selector: BD (2x/day), TID (3x/day), QID (4x/day)
    - **Simplified result**: Shows only dose and frequency (e.g., "8.3 mEq TID")
    - Supporting info: daily total and per-kg calculation
  - Switch dynamically updates dose range and slider limits
  - Updated ElectrolytesDialog.jsx
  - **Testing**: Verified with screenshots

### Session 8 Updates (January 20, 2026)
- ✅ **Simplified Electrolytes Correction Page with Dose Slider**:
  - **Merged and simplified** ElectrolytesDialog into a single unified page
  - **Removed**: Separate tabs for "Electrolyte IV" and "Corrections" and "Drug Infusions"
  - New file: `/app/frontend/src/pages/children/ElectrolytesInfusionsPage.jsx`
  - **Single Page Layout**:
    - Weight input at top with prominent display
    - Dropdown to select electrolyte (Calcium, Magnesium, Potassium IV, Potassium PO, NaHCO3, Sodium, Phosphate)
    - **Dose Range prominently displayed in green box** for each electrolyte
    - **NEW: Dose Slider/Input** - Users can select a specific dose within the allowed range
      - Shows absolute dose range based on weight (e.g., 500-1000 mg for 10kg calcium)
      - Slider defaults to middle of range
      - Input box for manual entry
      - Shows per-kg calculation on the right (e.g., 75.0 mg/kg)
    - Optional current level input
    - Calculate button
    - Results show: Drug Information, Step-by-step Calculation with selected dose, Administration (Duration/Rate), Preparation instructions, Compatibility
  - Widget title updated to "Electrolytes" with subtitle "Correction Calculator"
  - Floating nav bar electrolytes button navigates to this page
  - **Testing**: Verified with screenshots

### Session 7 Updates (January 19, 2026)
- ✅ **Rumack-Matthew Nomogram - Static SVG Integration**:
  - **Replaced programmatic D3.js chart with user-provided vectorized SVG file**
  - SVG file: `/app/frontend/src/assets/images/rumack_matthew_nomogram.svg`
  - Static SVG used as background with dynamic patient data point overlay
  - Patient point plotted using:
    - Logarithmic Y-scale (concentration 3-500 mcg/mL)
    - Linear X-scale (hours 0-24)
    - SVG viewBox: 0 0 237.82 300, chart area: x:45-197, y:34-207
  - Color-coded patient point: Red (probable toxicity), Amber (above treatment line), Green (below threshold)
  - Pulsing animation on patient point for visibility
  - **Testing**: 100% pass rate (iteration_19.json - 8/8 tests)

- ✅ **Rumack-Matthew Nomogram - Unit Toggle Feature**:
  - Added **Unit Toggle** between SI (µmol/L) and US (mcg/mL) units
  - **SI units (µmol/L) is now the DEFAULT** - togglable to mcg/mL
  - Input field label dynamically changes based on selected unit
  - Placeholder text changes: "e.g., 1000" for SI, "e.g., 150" for US
  - Conversion shown below input field (e.g., "= 151.1 mcg/mL" or "= 993 µmol/L")
  - Result displays primary unit first with secondary in parentheses
  - Conversion factor: 1 mcg/mL = 6.62 µmol/L (acetaminophen MW 151.16)
  - **Testing**: 100% pass rate (iteration_18.json - 9/9 tests)

- ✅ **Methylprednisolone (Solu-Medrol) Added to Drug Formulary**:
  - Drug ID: `methylprednisolone`
  - Category: Steroid
  - Route: IV/IM/PO
  - **9 Dosing Options**:
    1. Anti-inflammatory: 0.5-1.7 mg/kg/day ÷ q6-12h
    2. Asthma (≤12yr): 1-2 mg/kg/day ÷ q12h (max 60mg/day)
    3. Asthma (>12yr/Adult): 40-80 mg/day ÷ q12-24h
    4. Burst (≤12yr): 1-2 mg/kg/day ÷ q12-24h × 3-10 days (max 60mg)
    5. IM (≤4yr vomiting): 7.5 mg/kg × 1 (max 240mg)
    6. IM (>4yr/Adult): 240 mg × 1
    7. Spinal Cord Injury (bolus): 30 mg/kg IV over 15min
    8. Spinal Cord (infusion): 5.4 mg/kg/hr × 23h
    9. Pulse Therapy: 15-30 mg/kg/day × 3d (max 1g)
  - Notes: Succinate salt for IV/IM, Acetate for intra-articular (NOT IV)
  - **Drug count now 100** (was 99)

- ✅ **Drug Card UI Major Overhaul**:
  - **Quick Info Bar**: Shows Route and Max Dose prominently at top
  - **Calculated Doses Section** (Blue background):
    - Large font for calculated dose
    - Shows /day or /dose suffix
    - **NEW: Divided Dose Calculations** - automatically parses frequency (q6h=4 doses, q8h=3, q12h=2) and shows per-dose amounts
    - Example: "Per dose: 10.0-20.0 mg × 2 doses (q12h)"
  - **Indications Section** (Green background): 🎯 icon with clear text
  - **Clinical Notes Section** (Gray background): 📝 icon with clinical pearls
  - **Renal Adjustment Section** (Amber background): 🩺 icon with GFR-based adjustments in cards
  - Click-to-expand behavior preserved with cleaner visual hierarchy
  - **Testing**: 100% pass rate (iteration_20.json - 9/9 tests)

- ✅ **Glucose mmol/L Conversions Added Throughout App**:
  - Formula: mg/dL ÷ 18 = mmol/L
  - Updated files:
    - **DkaApproach.jsx**: >200 mg/dL (>11.1 mmol/L), <250 mg/dL (<13.9 mmol/L), <180 mg/dL (<10 mmol/L)
    - **TbiApproach.jsx**: 80-180 mg/dL (4.4-10 mmol/L)
    - **MetabolicEmergencyApproach.jsx**: >180 mg/dL (>10 mmol/L), target 100-120 mg/dL [5.6-6.7 mmol/L]
    - **HypoglycemiaApproach.jsx** (NICU): <25 mg/dL (<1.4 mmol/L), <35 mg/dL (<1.9 mmol/L), <45 mg/dL (<2.5 mmol/L), <60 mg/dL (<3.3 mmol/L)
  - **Testing**: 100% pass rate (iteration_18.json)

### Session 6 Updates (January 17, 2026)
- ✅ **NEW: Postnatal Section Added**:
  - Created `/app/frontend/src/pages/nicu/PostnatalPage.jsx` - main page with search and topic selector
  - Created 4 comprehensive postnatal approach components in `/postnatal/`:
    - **RoutineManagementApproach.jsx**: Delivery room care, Apgar score, transitional period monitoring, routine interventions (eye prophylaxis, Vitamin K, Hep B, RSV), umbilical cord care, newborn screening, feeding, weight loss, discharge criteria, follow-up timing
    - **NewbornAssessmentApproach.jsx**: Complete physical examination guide (general appearance, vital signs, measurements, head/fontanelles, eyes, ears, nose/mouth, cardiovascular, respiratory, abdomen, genitalia, musculoskeletal/DDH, skin, neurological/primitive reflexes)
    - **HemoglobinopathyApproach.jsx**: Newborn screening results interpretation (FS, FSA, FAS patterns), SCD management, thalassemia overview, parental counseling, inheritance patterns
    - **AsymptomaticBacteriuriaApproach.jsx**: AAP/IDSA guidelines - NO routine screening/treatment for healthy infants, management algorithm, urine collection methods
  - Features:
    - Search bar with keyword filtering (e.g., "sickle" finds Hemoglobinopathy, "bacteriuria" finds ASB)
    - Topic dropdown selector with 4 options (alphabetically sorted)
    - UI matches NICUApproachesPage but WITHOUT patient info inputs (as requested)
    - Reference footer citing UpToDate/AAP/WHO Guidelines
  - Updated `/app/frontend/src/pages/nicu/index.js` to export PostnatalPage
  - Updated `/app/frontend/src/pages/NICUCalculator.jsx` to route Postnatal widget (removed comingSoon flag)
  - **Testing**: 100% pass rate (iteration_16.json - 9/9 tests, iteration_17.json - ASB tests passed)

- ✅ **NEW: Metabolic Emergencies Approach Added (Children)**:
  - Created `/app/frontend/src/pages/children/approaches/MetabolicEmergencyApproach.jsx`
  - Content based on provided PDF covering IEM (Inborn Errors of Metabolism):
    - Clinical presentations (neurologic 85%, GI 58%)
    - Triggers of metabolic crisis (catabolism, protein intake)
    - Initial lab evaluation (ammonia collection protocol - on ICE, analyze in 30 min)
    - Specialized metabolic tests (amino acids, organic acids, acylcarnitine)
    - Lab findings comparison table (MSUD, organic acidemias, urea cycle, GSD, FAO, mitochondrial)
    - Hyperammonemia EMERGENCY management (neurotoxic - treat immediately, ammonia scavengers, hemodialysis)
    - Hypoglycemia in IEM (ketotic vs hypoketotic - FAO disorders)
    - Metabolic acidosis causes
    - Seizure cofactor trials (Pyridoxine 100mg IV, PLP, Folinic acid, Biotin)
    - Immediate management summary with weight-based calculations (GIR 8-10 mg/kg/min, insulin, carnitine)
  - Added to Children Approaches dropdown with keywords: metabolic, iem, inborn, ammonia, hypoglycemia, mcad, etc.
  - **Testing**: 100% pass rate (iteration_17.json - 16/16 tests)

- ✅ **Acetaminophen (Paracetamol) Approach Updated**:
  - Refactored `AcetaminophenApproach.jsx` with collapsible sections and ml/mg converter
  - Features include:
    - **Collapsible Sections**: Arrow-press UI like TBI approach (Dose Calculator, Nomogram open by default)
    - **Tablets (mg) / Liquid (ml) Toggle**: Switch between tablet and liquid input modes
    - **Bahrain Liquid Preparations**: 13 options including Panadol (Infant Drops 100mg/ml, Baby 120mg/5ml, Children 250mg/5ml), Adol, Tylenol, Fevadol, Calpol, Custom entry
    - **ml to mg Conversion**: Shows calculation (e.g., 30ml × 100mg/ml = 3000mg)
    - **Tablet Strengths**: 120, 160, 325, 500, 650, 1000mg dropdown
    - **Rumack-Matthew Nomogram**: Interactive SVG with patient point plotting
    - **NAC Dosing Protocols**: 3-bag IV (21h), 2-bag IV (20h), and Oral (72h) with weight-based calculations
  - **Testing**: 100% pass rate (iteration_14.json)

- ✅ **Iron Toxicity Approach Updated**:
  - Created `IronToxicityApproach.jsx` in `/app/frontend/src/pages/children/approaches/`
  - Features include:
    - **Collapsible Sections**: Arrow-press UI like TBI approach
    - **Elemental Iron Calculator**: Tablets (mg) / Liquid (ml) toggle
    - **Bahrain Liquid Preparations**: Feroglobin, Fer-In-Sol, Maltofer Drops/Syrup, Custom entry
    - **ml to mg Conversion**: Automatic calculation based on bottle concentration
    - **6 Iron Salt Types**: Ferrous Sulfate 20%, Gluconate 12%, Fumarate 33%, Carbonyl 100%
    - **Toxic Dose Thresholds**: <20 mg/kg low, 20-60 mg/kg mild, ≥60 mg/kg serious
    - **Clinical Stages**: 5 phases of iron poisoning
    - **Deferoxamine Protocol**: Dosing calculator with weight-based calculations
  - **Testing**: 100% pass rate (iteration_13.json)

- ✅ **NSAID Toxicity Approach Added** (Based on UpToDate NSAID Poisoning PDF):
  - Created `NSAIDToxicityApproach.jsx` in `/app/frontend/src/pages/children/approaches/`
  - Features include:
    - **Collapsible Sections**: Arrow-press UI like TBI approach
    - **NSAID Dose Calculator**: Tablets (mg) / Liquid (ml) toggle
    - **Bahrain Liquid Preparations**: Brufen 100mg/5ml, Forte 200mg/5ml, Infant Drops 40mg/ml, Ponstan, Custom entry
    - **ml to mg Conversion**: Shows calculation (e.g., 50ml × 20mg/ml = 1000mg)
    - **10 NSAID Types**: Ibuprofen, Naproxen, Diclofenac, Mefenamic Acid, etc.
    - **Toxic Dose Thresholds**: <100 mg/kg low risk, 100-400 moderate, >400 severe
    - **Special 24h Observation**: Mefenamic Acid (Ponstan), Phenylbutazone flagged with ⚠️
    - **Activated Charcoal Dosing**: 1g/kg (max 50g) calculator
  - **Testing**: 100% pass rate (iteration_13.json)

### Session 5 Updates
- ✅ **Growth Chart Mobile Improvements**:
  - Added fullscreen/maximize mode for better mobile viewing (X and Y axes fully visible)
  - Minimize button to exit fullscreen and return to normal view
  - Changed "Save PNG" button to icon-only (Download icon) for cleaner UI
  - Fullscreen chart is larger and more readable with all axis labels visible
  - Fixed Head Circ input layout - now full-width on mobile (2-column on mobile, 3-column on tablet+)

- ✅ **NICU Approaches Page Improvements**:
  - Moved Select Approach dropdown ABOVE patient info inputs for better UX
  - Dropdown now opens DOWNWARD (using `position="popper" side="bottom"`)
  - Shortened patient info labels (GA wks, PNA days, Wt kg) for better mobile fit

- ✅ **Children Approaches Improvements**:
  - Layout matches NICU Approaches (dropdown above patient info)
  - Added pinch-to-zoom (100%-200% range, double-tap to reset)
  - Converted UGIB and Hyperkalemia to visual flowchart format

- ✅ **Drug Dosing Major Update (Formulary Alignment)**:
  - Updated 25+ medications to match Harriet Lane Formulary dosing
  - Added age-stratified dosing (neonate by PMA, child, adult)
  - Added comprehensive indications for all drugs
  - Key drugs updated: Clindamycin, Vancomycin, Gentamicin, Ampicillin, Ceftriaxone, Cefotaxime, Metronidazole, Azithromycin, Morphine, Fentanyl, Ketamine, Midazolam, Phenobarbital, Phenytoin, Epinephrine, Atropine, Amiodarone, Adenosine, Dopamine, Norepinephrine, Furosemide, Dexamethasone, Hydrocortisone, Prednisolone, Ondansetron, Acetaminophen, Ibuprofen, Albuterol, Naloxone, Magnesium

### Session 4 Updates
- ✅ **Growth Chart Replaced with GitHub Repo Version**:
  - Replaced `GrowthChartPage.jsx` with implementation from user's GitHub repository (https://github.com/HRadhi4/PaedOTG)
  - Features: WHO (0-24 months) and CDC (2-20 years) standards
  - Measurements: Weight, Length/Stature, Head Circumference
  - Percentiles: 3rd, 15th, 50th, 85th, 97th
  - Z-score and percentile calculation for plotted patient data
  - Save chart to image functionality
  - Color-coded backgrounds: Blue for Boys, Pink for Girls
  - Fixed ResponsiveContainer issue by using fixed-width LineChart

### Session 3 Updates
- ✅ **Growth Chart Data Fixed with Official WHO/CDC Data**:
  - Updated `GrowthChartPage.jsx` with official data from CDC/WHO growth chart data files
  - **WHO Data (0-24 months)**: Weight-for-Age, Length-for-Age, Head Circumference-for-Age (Boys & Girls)
  - **CDC Data (2-20 years)**: Weight-for-Age, Stature-for-Age (Boys & Girls)
  - Data source: https://www.cdc.gov/growthcharts/who-data-files.htm & https://www.cdc.gov/growthcharts/cdc-data-files.htm
  - Percentiles: 3rd, 5th, 10th, 25th, 50th, 75th, 90th, 95th, 97th
  - Fixed recharts XAxis domain configuration (removed `type="number"` to allow proper line rendering)
  - Added proper Y-axis domains for each chart type
  - Color-coded charts: Blue background for Boys, Pink for Girls

### Session 2 Updates
- ✅ **Growth Chart Fixed**: Fixed recharts import issue (changed `require()` to ES6 import) and fixed ResponsiveContainer rendering by using explicit width/height
- ✅ **Subscription Renewal Reminder Scheduler (Cron Job) Implemented**:
  - Created `/app/backend/services/scheduler_service.py` with APScheduler
  - Cron job runs daily at **9:00 AM UTC** to send renewal reminders
  - Uses `noreply@pedotg.com` for sending emails (already configured)
  - Admin endpoints added: `/api/admin/scheduler/jobs`, `/api/admin/scheduler/run-job/{job_id}`, `/api/admin/scheduler/logs`
  - Scheduler logs stored in MongoDB `scheduler_logs` collection
- ✅ **NICU Approaches UI Consistency**: All 20 approaches already use consistent design language (amber for definitions, blue for classifications, green for management, red for warnings)

### Session 1 Updates
- ✅ **NICU Approaches - CONTENT UPDATES (Latest Guidelines)**:
  - All 20 approach components updated with 2022-2025 clinical guidelines:
    - ResuscitationApproach: **NRP 2025 (AHA/AAP 9th Edition)**
    - SeizuresApproach: **2023 ILAE Guidelines**
    - BPDApproach: **2024 Jensen Grading & NIH Workshop**
    - PPHNApproach: **AHA/ATS Guidelines + 2024 Evidence**
    - NECApproach: **2024 NACHHD Recommendations**
    - HIEApproach: **2024 Evidence**
    - JaundiceApproach: **AAP 2022 Guidelines**
    - SepsisApproach: **2024 AAP/ACOG Guidelines**
    - RDSApproach: **2024 European Consensus Guidelines**
    - ApneaApproach: **2023 Caffeine Guidelines (CAP Trial)**
    - PDAApproach: **2024 UK/NZ/International Guidelines**
    - MASApproach: **2023 NRP/AHA Guidelines**
    - TTNBApproach: **2024 Evidence-Based Guidelines**
    - HypoglycemiaApproach: **2022 AAP Guidelines**
    - PolycythemiaApproach: **2023-2024 Evidence-Based Guidelines**
    - AnemiaApproach: **2024 JAMA Guidelines (ETTNO/TOP Evidence)**
    - CDHApproach: **2024 CDH Study Group Guidelines**
    - CHDApproach: **2024 AHA/AAP CCHD Guidelines**
    - GastroschisisApproach: **2024 APSA Guidelines**
    - OmphaloceleApproach: **2024 APSA Guidelines**
- ✅ **NICU Approaches - UI REFACTOR (Clean Design)**:
  - Refactored all 20 approach components with consistent 3-4 color scheme
  - Color scheme: slate/gray backgrounds, blue for key info, amber for definitions, red for warnings/risk factors, green for management
  - Consistent card design with proper spacing and typography
  - All text sizes reduced for denser information display (8-10px body, 12px headers)
  - Mobile responsive design verified
- ✅ **Accessibility Fix**: Added DialogDescription to Medical Disclaimer modal
- ✅ **Testing**: 100% pass rate on all 20 approaches (iteration_10.json)

## Previous Changes (January 16, 2026 - Earlier Session)
- ✅ **NICU Approaches Section - INITIAL CREATION**:
  - Created `/app/frontend/src/pages/nicu/NICUApproachesPage.jsx` - main container page
  - Created **20 comprehensive NICU approach components** in `/approaches/`:
    - ResuscitationApproach.jsx (NRP algorithm)
    - RDSApproach.jsx (Respiratory Distress Syndrome)
    - SepsisApproach.jsx (EOS/LOS)
    - HypoglycemiaApproach.jsx
    - JaundiceApproach.jsx
    - NECApproach.jsx (Bell Staging)
    - HIEApproach.jsx (Sarnat Staging)
    - ApneaApproach.jsx (caffeine dosing) - **spelling fixed from Apnoea**
    - PDAApproach.jsx (Ibuprofen/Indomethacin dosing)
    - SeizuresApproach.jsx (phenobarbital/levetiracetam)
    - PPHNApproach.jsx (iNO, sildenafil, milrinone)
    - MASApproach.jsx (Meconium Aspiration)
    - TTNBApproach.jsx (Transient Tachypnea)
    - BPDApproach.jsx (Bronchopulmonary Dysplasia)
    - AnemiaApproach.jsx (transfusion thresholds) - **spelling fixed from Anaemia**
    - PolycythemiaApproach.jsx (partial exchange)
    - **CHDApproach.jsx** (Congenital Heart Disease, PGE1)
    - **CDHApproach.jsx** (Congenital Diaphragmatic Hernia)
    - **GastroschisisApproach.jsx** (Abdominal wall defect)
    - **OmphaloceleApproach.jsx** (Abdominal wall defect with membrane)
  - Features:
    - Dropdown selector with alphabetical sorting
    - Search functionality with keyword matching
    - Patient info inputs (GA weeks, Postnatal days, Weight kg)
    - Weight-based drug calculations in all approach components
    - Reference footer citing guidelines

## Changes (January 15, 2026)
- ✅ **OCR Service Major Accuracy Improvement**: Enhanced regex patterns for blood gas extraction
  - Overall accuracy improved from ~50% to **81%+**
  - img1: 73%, img2: 90%, img3: 82% accuracy against ground truth
  - Fixed patterns for: pH (handles 456 -> 7.456), pO2 (handles various OCR errors), pCO2, Ca (handles 137 -> 1.37), HCO3, etc.
  - Now extracting 12-16 metrics per image
  - Added support for common OCR errors: "py" for pH, "Poi" for pO2, "cia" for Ca, etc.
- ✅ **Tesseract Installation**: Added system-packages.txt for deployment persistence
- ✅ **Fixed language parameter**: Changed from 'en' to 'eng' for tesseract compatibility
- ✅ **Subscription Renewal Reminder System**: Implemented automated reminder emails
  - New email templates: `send_subscription_renewal_reminder_email` and `send_trial_expiring_reminder_email`
  - New admin endpoints:
    - `POST /api/admin/send-renewal-reminders?days_before=3` - Trigger reminder emails
    - `GET /api/admin/expiring-subscriptions?days=7` - View expiring subscriptions
  - Tracks `last_reminder_sent` to avoid duplicate emails (24hr cooldown)
  - Supports both paid subscriptions and trial accounts
- ✅ **Days Left Display**: Added subscription days remaining indicators
  - Admin Dashboard: New "Days Left" column with color-coded badges (green/amber/red)
  - Account Page: "Time Until Renewal" field showing days remaining
  - Dynamic colors: green (>7 days), amber (1-7 days), red (expired/today)
- ✅ **ApproachesPage Refactoring COMPLETED**: 
  - Created `/approaches/` folder with 16 modular components
  - Reduced ApproachesPage.jsx from 2700+ lines to **347 lines** (87% reduction)
  - Extracted all 15 approach components:
    - SepsisApproach, SeizureApproach, AsthmaApproach, TbiApproach, DkaApproach
    - AdrenalApproach, AnaphylaxisApproach, ThrombocytopeniaApproach
    - HypocalcemiaApproach, DlocApproach, HeadacheApproach, WeaknessApproach
    - GaitApproach, HyperkalemiaApproach, UgibApproach
  - Created shared `Section.jsx` component used by all approach files
  - Created `index.js` for centralized exports
  - All linting issues resolved
  - 100% test pass rate (iteration_8.json)
- ✅ **Mobile Responsiveness Fix for GoDaddy Domain**:
  - Added proper viewport meta tags in index.html
  - Added mobile-web-app-capable and apple-mobile-web-app-capable meta tags
  - Added HandheldFriendly and format-detection meta tags
  - Enhanced CSS with overflow-x: hidden and min-width: 320px
  - Enabled -webkit-overflow-scrolling: touch for iOS smooth scrolling
- ✅ **Remember Me for Auto-Login**: Added checkbox on login page
  - Saves email and password in localStorage when checked
  - Auto-fills credentials on next visit
  - Clears saved credentials when unchecked
- ✅ **OCR Cancel Button**: Fixed stuck OCR issue
  - Added Cancel button visible during OCR processing
  - Properly aborts ongoing API request
  - Resets UI state immediately

## Previous Changes (January 13, 2026)
- ✅ **Fluid Replacement 2500ml Cap**: Applied to individual 8h and 16h periods, not just 24h total
- ✅ **Calcium Dose Max**: Capped at 1g (10mL) in Hyperkalemia approach and DrugsPage
- ✅ **Approaches Scroll Fix**: Expanding sections now scrolls to show the expanded content
- ✅ **BloodGasDialog OCR Toggle Removed**: Simplified UI with single local OCR method
- ✅ **BloodGasDialog Syntax Error Fixed**: Removed corrupted code causing frontend build failure

## UI/UX Development Rules
**IMPORTANT: These rules must be followed in ALL current and future builds**

### Rule 1: Text Overflow Prevention
- **Text must ALWAYS stay within its container** - never exceed or overflow
- Global CSS rules added to `/app/frontend/src/index.css`:
  - `overflow-wrap: break-word` on all elements
  - `word-break: break-word` for long text
  - `max-width: 100%` on all containers
  - `min-width: 0` on flex/grid children
  - `text-overflow: ellipsis` for table cells
- Use utility classes when needed:
  - `.truncate-text` - for single-line truncation with ellipsis
  - `.wrap-text` - for forced word wrapping

### Rule 2: Input Validation
- Weight and age inputs must have `min="0"` to prevent negative values
- Number inputs should validate for reasonable ranges

### Rule 3: Mobile-First Design
- All components must be responsive
- Test on mobile viewport (390x844) before desktop
- Use viewport meta tags for proper mobile rendering

## Backlog / Future Tasks
- [ ] Add Salicylate (Aspirin) Toxicity approach
- [ ] Add automated blood gas interpretation
- [ ] Refactor ElectrolytesDialog.jsx (currently 1500+ lines) into separate hooks
- [ ] Delete redundant file: /app/frontend/src/pages/children/ElectrolytesInfusionsPage.jsx
- [ ] Audit all number inputs for proper validation (min="0" where appropriate)
- [ ] Production deployment prep
- [ ] Add dark mode theme toggle
- [ ] Continue Drug Formulary review (Formulary.pdf verification)

## Pending User Verification
- [ ] Registration bug fix ("Body is disturbed or locked" error in AuthContext.jsx)
- [ ] Vital Signs table header alignment
- [ ] OCR accuracy on user's actual blood gas report images
- [ ] Mobile responsiveness fix when accessing from app.pedotg.com (GoDaddy domain)

## Test Reports
- `/app/test_reports/iteration_25.json` - Nomogram coordinate rewrite verification (100% - 6/6 tests)
- `/app/test_reports/iteration_24.json` - Hyponatremia deficit selector, IEM toggle, Nomogram calibration (100% - 8/8)
- `/app/test_reports/iteration_23.json` - DKA SMC Guideline, IEM Emergencies, Acetaminophen nomogram tests (100% - 6/6)
- `/app/test_reports/iteration_22.json` - Jaundice Calculator data corrections tests (100% - 8/8)
- `/app/test_reports/iteration_21.json` - Combined Electrolytes & Infusions page tests (100% - 10/10)
- `/app/test_reports/iteration_20.json` - Drug page UI overhaul & Methylprednisolone tests (100% passed - 9/9)
- `/app/test_reports/iteration_19.json` - Static SVG nomogram integration tests (100% passed - 8/8)
- `/app/test_reports/iteration_18.json` - SI units & glucose mmol/L tests (100% passed - 9/9)
- `/app/test_reports/iteration_17.json` - ASB + Metabolic Emergencies tests (100% passed - 16/16)
- `/app/test_reports/iteration_16.json` - Postnatal Section tests (100% passed - 9/9)
- `/app/test_reports/iteration_14.json` - Acetaminophen ml/mg conversion tests (100% passed - 9/9)
- `/app/test_reports/iteration_13.json` - Iron & NSAID ml/mg conversion tests (100% passed - 10/10)
- `/app/test_reports/iteration_12.json` - Iron & NSAID Toxicity tests (100% passed - 8/8)
- `/app/test_reports/iteration_11.json` - Acetaminophen Approach tests (100% passed)
- `/app/test_reports/iteration_9.json` - NICU Approaches feature tests (100% passed)
- `/app/test_reports/iteration_8.json` - Approaches refactoring tests (100% passed)
- `/app/test_reports/iteration_7.json` - OCR backend tests (15/15 passed)

## Last Updated
January 28, 2026 - PayPal service rebuilt, Children Drugs UI fixes (frequency size, text wrapping), deployment configuration fixes
