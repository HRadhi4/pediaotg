# Pediatrics to Go - Requirements & Architecture

## Original Problem Statement
Build an app with two choices: NICU and Children
- NICU section includes fluid calculations
- Children section: placeholder (coming soon)

## UI Design
**Nightingale-inspired Medical App UI** (based on Dribbble reference)
- Floating pill-shaped tab bar with teal accent (#00d9c5)
- Gradient backgrounds (teal→white light, deep teal dark)
- Rounded cards (2rem radius) with soft shadows
- Active tab indicator (teal underline)
- Glass header with backdrop blur
- Manrope font throughout

## Features Implemented

### Navigation (Bottom Tab Bar)
1. Home - Landing page
2. Blood Gas - Blood Gas Analysis dialog
3. Electrolytes - Electrolytes Calculator dialog
4. Coming Soon - Placeholder
5. Jaundice - Neonatal Jaundice Calculator (amber accent)

### NICU Fluid Calculator
- Patient info: Weight, Age, Gestational Age
- TFI with age-based suggestions
- Fluid type: D10% / D10%+D50%
- Deductions: 3% NaCl, Feed, TPN
- Real-time calculations with breakdown

### Blood Gas Analysis
- AI Analysis (Gemini OCR) + Manual entry
- Diagnosis: Respiratory/Metabolic Acidosis/Alkalosis
- Expected pCO2/HCO3 for compensation
- Anion Gap, Cl:Na ratio, Lactic acidosis

### Electrolytes Calculator
- Calcium (mg + ml), Magnesium (mg + ml)
- Potassium (bolus: 0.5-1 mEq/kg over 1-2 hrs)
- NaHCO3 (HCO3, BE, or Both methods)
- Sodium (Hyponatremia + Hypernatremia)
- Phosphate, Drug Infusions Reference

### Neonatal Jaundice Calculator
- Bilirubin with unit toggle (mg/dL ↔ µmol/L)
- PT/EX thresholds by weight, GA, age, risk factors

## Next Tasks
1. Implement Children section
2. Add remaining Coming Soon features
