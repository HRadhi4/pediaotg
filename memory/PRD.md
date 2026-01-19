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
- ✅ Drugs Page (97 drugs with max dose capping)
- ✅ Blood Pressure
- ✅ Infusions
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

### Session 7 Updates (Current - January 19, 2026)
- ✅ **Rumack-Matthew Nomogram SI Units Added**:
  - Updated `AcetaminophenApproach.jsx` nomogram with dual Y-axes:
    - Left axis: mcg/mL (5, 10, 20, 50, 100, 150, 200, 300)
    - Right axis: µmol/L (30, 66, 132, 330, 660, 1000, 1320, 2000)
  - Added `mcgToMicromol` conversion function (1 mcg/mL = 6.62 µmol/L, acetaminophen MW 151.16)
  - Serum level input shows µmol/L conversion below (e.g., "= 993 µmol/L")
  - Nomogram results display both units (e.g., "Treatment threshold: 100 mcg/mL (662 µmol/L)")
  - Patient point on chart shows both values (e.g., "150 (993)")
  - Zone labels added: "Probable hepatic toxicity", "Possible hepatic toxicity", "No hepatic toxicity"
  - SVG styled similar to Harriet Lane reference
  - **Testing**: 100% pass rate (iteration_18.json - 9/9 tests)

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
- [ ] Add more drug entries
- [ ] Add automated blood gas interpretation
- [ ] Add Salicylate (Aspirin) Toxicity approach
- [ ] Address minor linting errors in /pages/children/ components
- [ ] Production deployment prep
- [ ] Add dark mode theme toggle
- [ ] Audit all number inputs for proper validation (min="0" where appropriate)

## Pending User Verification
- [ ] Registration bug fix ("Body is disturbed or locked" error in AuthContext.jsx)
- [ ] Vital Signs table header alignment
- [ ] OCR accuracy on user's actual blood gas report images
- [ ] Mobile responsiveness fix when accessing from app.pedotg.com (GoDaddy domain)

## Test Reports
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
January 19, 2026 - Added SI units (µmol/L) to Rumack-Matthew nomogram and mmol/L glucose conversions throughout app
