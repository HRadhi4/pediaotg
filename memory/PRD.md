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
- Gemini Pro Vision (OCR - pivoted from PaddleOCR)
- Tesseract (backup OCR)
- recharts (charts)
- html2canvas
- GoDaddy/Microsoft Exchange SMTP (emails)

## Backlog / Future Tasks
- [ ] Add more drug entries
- [ ] Implement Postnatal widget
- [ ] Implement Approaches widget content
- [ ] Address minor linting errors
- [ ] Production deployment prep

## Last Updated
January 12, 2026
