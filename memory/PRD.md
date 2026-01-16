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
- [ ] Implement Postnatal widget
- [ ] Add more drug entries
- [ ] Set up scheduled cron job for automated renewal reminders (currently manual trigger)
- [ ] Add automated blood gas interpretation
- [ ] Address minor linting errors in /pages/children/ components
- [ ] Production deployment prep
- [ ] Add aria-describedby to DialogContent in Medical Disclaimer modal for accessibility
- [ ] Add dark mode theme toggle

## Pending User Verification
- [ ] Registration bug fix ("Body is disturbed or locked" error in AuthContext.jsx)
- [ ] Vital Signs table header alignment
- [ ] OCR accuracy on user's actual blood gas report images
- [ ] Mobile responsiveness fix when accessing from app.pedotg.com (GoDaddy domain)

## Test Reports
- `/app/test_reports/iteration_9.json` - NICU Approaches feature tests (100% passed)
- `/app/test_reports/iteration_8.json` - Approaches refactoring tests (100% passed)
- `/app/test_reports/iteration_7.json` - OCR backend tests (15/15 passed)
- `/app/tests/test_ocr_service.py` - Test file for OCR endpoints

## Last Updated
January 16, 2026 - NICU Approaches Section Complete
