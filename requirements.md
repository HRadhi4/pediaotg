# Pediatrics to Go - Requirements & Architecture

## Features Implemented

### Navigation Bar (6 icons)
1. **Home** - Landing page
2. **Blood Gas** - Blood Gas Analysis (Auto-Analysis + Manual)
3. **Electrolytes** - Electrolytes Calculator
4. **GIR** - Glucose Infusion Rate Calculator
5. **Jaundice** - Neonatal Jaundice Calculator
6. **Blood Products** - Blood Products Calculator

### NICU Fluid Calculator
- Patient info: Weight, Age, Gestational Age
- TFI with age-based suggestions
- Fluid type: D10% / D10%+D50%
- Deductions: 3% NaCl, Feed, TPN
- Real-time calculations

### Blood Gas Analysis
- **Auto-Analysis** (AI OCR via Gemini) + Manual entry
- 10 fields: pH, pCO2, pO2, HCO3, BE, **Hb**, Na, K, Cl, Lactate
- **Hb Analysis**: Severe Anemia (<7), Moderate (7-10), Mild (10-12), Normal (12-17)
- Acid-base diagnosis with Expected pCO2/HCO3 compensation values
- Anion Gap, Cl:Na ratio, Lactic acidosis

### Electrolytes Calculator
- Calcium (mg + ml), Magnesium (mg + ml)
- Potassium (bolus: 0.5-1 mEq/kg over 1-2 hrs)
- NaHCO3 (HCO3, BE, or Both methods)
- Sodium (Hyponatremia + Hypernatremia)
- Phosphate, Drug Infusions Reference

### GIR Calculator (NEW)
- **Calculate GIR**: From TFI + dextrose concentration
- **Target Rate**: Calculate infusion rate for target GIR
- Formula: GIR = (glucose mg) / weight / 24 / 60
- Rate = GIR × 6 × weight ÷ dextrose%
- Dextrose options: D5%, D10%, D12.5%, D15%, D20%, D50%

### Blood Products Calculator (NEW)
- **PRBC**: 10-15 ml/kg over 3-4 hrs, max 1 unit (280ml)
  - Formula: Wt × (Target Hb - Current Hb) × 3 ÷ Hct
- **Vitamin K**: Infant 1-2mg, Adolescent 2.5-10mg
- **FFP**: 10ml/kg (<20kg), 1 unit (20-35kg), 2 units (30-40kg), 3 units (>40kg)
- **Cryoprecipitate**: 5 ml/kg over 30 mins, max 4 units
- **Platelets**: 10 ml/kg over 30 mins, max 1 unit (300ml)

### Neonatal Jaundice Calculator
- Bilirubin with unit toggle (mg/dL ↔ µmol/L)
- PT/EX thresholds by weight, GA, age, risk factors

## UI Design
**Nightingale-inspired Medical App UI**
- Floating pill-shaped tab bar with teal accent (#00d9c5)
- Gradient backgrounds, rounded cards (2rem radius)
- Active tab indicator with colored icons
- Manrope font throughout

## Next Tasks
1. Implement Children section
2. Add print/export feature for calculations
