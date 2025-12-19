# NICU Fluid Calculator - Requirements & Architecture

## Original Problem Statement
Build an app with two choices: NICU and Children
- NICU section includes:
  - Patient info: Weight, Age, Gestational Age
  - TFI (Total Fluid Intake) dropdown with free text entry
  - Fluid type selection: D10% alone or D10% and D50%
  - 3% NaCl checkbox with amount input (deducted from TFI)
  - Feed amount (deducted from TFI)
  - Total Parenteral Nutrition (deducted from TFI)
- Children section: placeholder (coming soon)

## Architecture Completed

### Frontend (React)
- **Landing Page** (`/`): Split-screen layout with NICU (clickable) and Children (disabled)
- **NICU Calculator** (`/nicu`): Full fluid calculation interface
- **Theme Toggle**: Light/Dark mode with localStorage persistence
- **UI Components**: Shadcn/UI (Card, Input, Button, Checkbox, RadioGroup, etc.)

### Design System
- **Fonts**: Manrope (headings), Inter (body), JetBrains Mono (values)
- **Colors**: Surgical Teal primary, Instrument Slate secondary
- **Theme**: Light/Dark mode support

### Calculation Logic
- Total Fluid = TFI × Weight (ml/day)
- Deductions = (NaCl + Feed + TPN) × Weight
- Remaining IV Fluid = Total - Deductions
- Hourly Rate = Remaining / 24

### Features Implemented
1. ✅ Landing page with NICU/Children selection
2. ✅ Patient information inputs (Weight, Age, Gestational Age)
3. ✅ TFI input with age-based suggestions
4. ✅ Fluid type selection (D10% alone / D10% + D50%)
5. ✅ 3% NaCl checkbox with conditional amount input
6. ✅ Feed amount input
7. ✅ TPN amount input
8. ✅ Real-time calculations
9. ✅ Results summary with breakdown
10. ✅ Warning when deductions exceed TFI
11. ✅ Reset calculator functionality
12. ✅ Light/Dark theme toggle

## Next Tasks
1. Implement Children section functionality
2. Add print/export feature for calculations
3. Add patient history/save functionality (optional)
4. Add more detailed D10%/D50% mixing ratio calculations
