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

## Recent Changes (January 15, 2026)
- ✅ **OCR Service Major Accuracy Improvement**: Enhanced regex patterns for blood gas extraction
  - Overall accuracy improved from ~50% to **81%+**
  - img1: 73%, img2: 90%, img3: 82% accuracy against ground truth
  - Fixed patterns for: pH (handles 456 -> 7.456), pO2 (handles various OCR errors), pCO2, Ca (handles 137 -> 1.37), HCO3, etc.
  - Now extracting 12-16 metrics per image
  - Added support for common OCR errors: "py" for pH, "Poi" for pO2, "cia" for Ca, etc.
- ✅ **Tesseract Installation**: Added system-packages.txt for deployment persistence
- ✅ **Fixed language parameter**: Changed from 'en' to 'eng' for tesseract compatibility

## Previous Changes (January 13, 2026)
- ✅ **Fluid Replacement 2500ml Cap**: Applied to individual 8h and 16h periods, not just 24h total
- ✅ **Calcium Dose Max**: Capped at 1g (10mL) in Hyperkalemia approach and DrugsPage
- ✅ **Approaches Scroll Fix**: Expanding sections now scrolls to show the expanded content
- ✅ **BloodGasDialog OCR Toggle Removed**: Simplified UI with single local OCR method
- ✅ **BloodGasDialog Syntax Error Fixed**: Removed corrupted code causing frontend build failure

## Backlog / Future Tasks
- [ ] Add more drug entries
- [ ] Implement Postnatal widget
- [ ] Address minor linting errors in /pages/children/ components
- [ ] Subscription renewal reminder email (3 days before expiry)
- [ ] Production deployment prep
- [ ] Break down ApproachesPage.jsx (~2700 lines) into smaller sub-components

## Pending User Verification
- [ ] Registration bug fix ("Body is disturbed or locked" error in AuthContext.jsx)
- [ ] Vital Signs table header alignment
- [ ] OCR accuracy on user's actual blood gas report images

## Test Reports
- `/app/test_reports/iteration_7.json` - OCR backend tests (15/15 passed)
- `/app/tests/test_ocr_service.py` - Test file for OCR endpoints

## Last Updated
January 15, 2026
