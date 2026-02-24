/**
 * Electrolytes Correction Page
 * 
 * Unified electrolyte correction calculator with:
 * - Dropdown to select electrolyte
 * - Dose range displayed prominently
 * - Dose slider/input within allowed range
 * - Current level input
 * - Calculation results with preparation instructions
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Calculator, AlertCircle, Clock, AlertTriangle, CheckCircle, Syringe } from "lucide-react";

const ElectrolytesInfusionsPage = ({ onBack }) => {
  const [weight, setWeight] = useState("");
  const [selectedElectrolyte, setSelectedElectrolyte] = useState("calcium");
  const [results, setResults] = useState(null);
  const [customDose, setCustomDose] = useState("");
  const w = parseFloat(weight) || 0;

  // Electrolyte-specific states
  const [calciumLevel, setCalciumLevel] = useState("");
  const [magnesiumLevel, setMagnesiumLevel] = useState("");
  const [potassiumLevel, setPotassiumLevel] = useState("");
  const [kclPoFrequency, setKclPoFrequency] = useState("BD");
  const [hco3Level, setHco3Level] = useState("");
  const [baseExcess, setBaseExcess] = useState("");
  const [nahco3Method, setNahco3Method] = useState("both");
  const [currentNa, setCurrentNa] = useState("");
  const [targetNa, setTargetNa] = useState("");
  const [sodiumType, setSodiumType] = useState("hyponatremia");
  const [hyponatremiaType, setHyponatremiaType] = useState("mild");
  const [phosphateLevel, setPhosphateLevel] = useState("");
  const [phosphateSeverity, setPhosphateSeverity] = useState("moderate");

  // Electrolyte definitions with dose ranges (numeric for slider)
  const electrolytes = {
    calcium: {
      name: "Calcium",
      medication: "Calcium Gluconate 10%",
      doseRange: "50-100 mg/kg/dose (Max 1g)",
      doseMin: 50,
      doseMax: 100,
      maxAbsolute: 1000,
      unit: "mg/kg",
      resultUnit: "mg",
      stock: "100 mg/ml (0.45 mEq/ml)",
      target: "50 mg/ml",
      compatible: "NS, D5W, D10W",
      incompatible: "Amphotericin B, Ceftriaxone, Fluconazole, Meropenem, Methylprednisolone, Phosphate, Magnesium"
    },
    magnesium: {
      name: "Magnesium",
      medication: "Magnesium Sulfate 50%",
      doseRange: "25-50 mg/kg/dose (Max 2g)",
      doseMin: 25,
      doseMax: 50,
      maxAbsolute: 2000,
      unit: "mg/kg",
      resultUnit: "mg",
      stock: "500 mg/ml (2 mmol/ml)",
      target: "60 mg/ml",
      compatible: "D5W, NS, LR",
      incompatible: "Amiodarone, Amphotericin B, Calcium chloride, Cefepime, Sodium bicarbonate"
    },
    potassium: {
      name: "Potassium (IV)",
      medication: "Potassium Chloride (KCl) IV",
      doseRange: "0.5-1 mEq/kg/dose (IV Max 40 mEq)",
      doseMin: 0.5,
      doseMax: 1,
      maxAbsolute: 40,
      unit: "mEq/kg",
      resultUnit: "mEq",
      stock: "15% KCl = 2 mEq/ml",
      target: "Peripheral: 80 mEq/L | Central: 150 mEq/L",
      compatible: "NS, D5W, LR",
      incompatible: "Amphotericin B, Diazepam, Phenytoin"
    },
    potassiumPO: {
      name: "Potassium (PO)",
      medication: "Potassium Chloride (KCl) Oral",
      doseRange: "1-4 mEq/kg/day (divided BD-QID)",
      doseMin: 1,
      doseMax: 4,
      maxAbsolute: 100,
      unit: "mEq/kg/day",
      resultUnit: "mEq",
      stock: "Oral solution: varies",
      target: "Daily dose divided into 2-4 doses",
      compatible: "Take with food/water",
      incompatible: "Avoid on empty stomach"
    },
    nahco3: {
      name: "Sodium Bicarbonate",
      medication: "Sodium Bicarbonate 8.4%",
      doseRange: "1-2 mEq/kg (acute)",
      doseMin: 1,
      doseMax: 2,
      maxAbsolute: 50,
      unit: "mEq/kg",
      resultUnit: "mEq",
      stock: "1 mEq/ml (8.4%)",
      target: "1:1 dilution",
      compatible: "NS, D5W, D10W",
      incompatible: "Amiodarone, Calcium salts, Dobutamine, Dopamine, Epinephrine, Norepinephrine, Magnesium sulfate"
    },
    sodium: {
      name: "Sodium",
      medication: "3% NaCl (Hypertonic Saline)",
      doseRange: "3-5 ml/kg bolus (severe)",
      doseMin: 3,
      doseMax: 5,
      maxAbsolute: 500,
      unit: "ml/kg",
      resultUnit: "ml",
      stock: "513 mEq/L (0.513 mEq/ml)",
      target: "Variable based on deficit",
      compatible: "Compatible with most IV fluids",
      incompatible: "None significant"
    },
    phosphate: {
      name: "Phosphate",
      medication: "Addiphos (Phosphate)",
      doseRange: "0.08-0.5 mmol/kg (Max 15 mmol)",
      doseMin: 0.08,
      doseMax: 0.5,
      maxAbsolute: 15,
      unit: "mmol/kg",
      resultUnit: "mmol",
      stock: "1 ml = 2 mmol phosphate",
      target: "Peripheral: 0.05 mmol/ml | Central: 0.12 mmol/ml",
      compatible: "Most IV fluids",
      incompatible: "Calcium salts (precipitation risk)"
    }
  };

  // Clear results and reset dose when electrolyte or weight changes
  useEffect(() => {
    setResults(null);
    // Set default dose to middle of absolute range
    const elec = electrolytes[selectedElectrolyte];
    if (elec && w > 0) {
      const minAbsDose = elec.doseMin * w;
      const maxAbsDose = Math.min(elec.doseMax * w, elec.maxAbsolute);
      const midDose = (minAbsDose + maxAbsDose) / 2;
      setCustomDose(midDose.toFixed(elec.resultUnit === "mEq" || elec.resultUnit === "mmol" ? 2 : 0));
    }
  }, [selectedElectrolyte, weight]);

  // Get dose limits for current electrolyte
  const currentElectrolyte = electrolytes[selectedElectrolyte];
  const getDoseLimits = () => {
    if (!currentElectrolyte || !w) return { min: 0, max: 100, step: 1 };
    const { doseMin, doseMax, maxAbsolute } = currentElectrolyte;
    // Calculate absolute dose based on weight
    const minAbsDose = doseMin * w;
    const maxAbsDose = Math.min(doseMax * w, maxAbsolute);
    // Step based on dose range
    const step = maxAbsDose < 10 ? 0.1 : maxAbsDose < 100 ? 1 : 10;
    return { min: minAbsDose, max: maxAbsDose, step };
  };
  const doseLimits = getDoseLimits();
  const currentDose = parseFloat(customDose) || doseLimits.min;

  // Calculate based on selected electrolyte
  const calculate = () => {
    if (!w) {
      setResults({ error: "Please enter patient weight" });
      return;
    }

    switch (selectedElectrolyte) {
      case "calcium":
        calculateCalcium();
        break;
      case "magnesium":
        calculateMagnesium();
        break;
      case "potassium":
        calculatePotassium();
        break;
      case "potassiumPO":
        calculatePotassiumPO();
        break;
      case "nahco3":
        calculateNaHCO3();
        break;
      case "sodium":
        calculateSodium();
        break;
      case "phosphate":
        calculatePhosphate();
        break;
      default:
        break;
    }
  };

  const calculateCalcium = () => {
    const maxDose = 1000;
    // Use custom dose from slider/input
    let doseMg = currentDose;
    let isMaxed = doseMg >= maxDose;
    
    const doseMl = doseMg / 100;
    const targetConc = 50;
    const totalVolume = doseMg / targetConc;
    const diluentMl = totalVolume - doseMl;
    const dosePerKg = (doseMg / w).toFixed(1);
    
    setResults({
      medication: "Calcium Gluconate 10%",
      calculation: {
        dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''} (${dosePerKg} mg/kg)`,
        formula: `Selected: ${dosePerKg} mg/kg x ${w} kg = ${doseMg.toFixed(0)} mg`,
        drugVolume: `${doseMl.toFixed(1)} ml`,
        diluent: `${diluentMl.toFixed(1)} ml (NS or D5W)`,
        totalVolume: `${totalVolume.toFixed(1)} ml (at 50 mg/ml)`
      },
      administration: {
        duration: "1 hour",
        rate: `${totalVolume.toFixed(1)} ml/hr`
      },
      preparation: `Draw ${doseMl.toFixed(1)} ml Ca Gluconate + ${diluentMl.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      frequency: calciumLevel && parseFloat(calciumLevel) < 7 ? "BD" : "OD",
      ...(isMaxed && { warning: "Dose capped at maximum (1g / 10ml)" })
    });
  };

  const calculateMagnesium = () => {
    const maxDose = 2000;
    // Use custom dose from slider/input
    let doseMg = currentDose;
    let isMaxed = doseMg >= maxDose;
    
    const drugVolume = doseMg / 500;
    const targetConc = 60;
    const totalVolume = doseMg / targetConc;
    const diluent = totalVolume - drugVolume;
    const dosePerKg = (doseMg / w).toFixed(1);
    
    setResults({
      medication: "Magnesium Sulfate 50%",
      calculation: {
        dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''} (${dosePerKg} mg/kg)`,
        formula: `Selected: ${dosePerKg} mg/kg x ${w} kg = ${doseMg.toFixed(0)} mg`,
        drugVolume: `${drugVolume.toFixed(2)} ml`,
        diluent: `${diluent.toFixed(1)} ml (NS or D5W)`,
        totalVolume: `${totalVolume.toFixed(1)} ml (at 60 mg/ml)`
      },
      administration: {
        duration: "2-4 hours",
        rate: `${(totalVolume/4).toFixed(1)} - ${(totalVolume/2).toFixed(1)} ml/hr`
      },
      preparation: `Draw ${drugVolume.toFixed(2)} ml MgSO4 50% + ${diluent.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      frequency: "BD for 3 doses",
      ...(isMaxed && { warning: "Dose capped at maximum (2g per dose)" })
    });
  };

  const calculatePotassium = () => {
    const ivMaxDose = 40;
    // Use custom dose from slider/input
    let doseMEq = currentDose;
    let isMaxed = doseMEq >= ivMaxDose;
    
    const kclStock = 2;
    const drugVolume = doseMEq / kclStock;
    const dosePerKg = (doseMEq / w).toFixed(2);
    
    // Peripheral dilution (80 mEq/L)
    const peripheralConc = 0.08;
    const totalVolume = doseMEq / peripheralConc;
    const diluent = totalVolume - drugVolume;
    
    // Duration based on dose per kg
    const duration = parseFloat(dosePerKg) <= 0.5 ? "1 hour" : "2 hours";
    const rate = parseFloat(dosePerKg) <= 0.5 ? totalVolume : totalVolume / 2;
    
    setResults({
      medication: "Potassium Chloride (KCl) 15%",
      calculation: {
        dose: `${doseMEq.toFixed(1)} mEq${isMaxed ? ' (MAX)' : ''} (${dosePerKg} mEq/kg)`,
        formula: `Selected: ${dosePerKg} mEq/kg x ${w} kg = ${doseMEq.toFixed(1)} mEq`,
        drugVolume: `${drugVolume.toFixed(2)} ml`,
        diluent: `${diluent.toFixed(0)} ml NS (Peripheral 80 mEq/L)`,
        totalVolume: `${totalVolume.toFixed(0)} ml`
      },
      administration: {
        duration: duration,
        rate: `${rate.toFixed(0)} ml/hr`
      },
      preparation: `${drugVolume.toFixed(2)} ml KCl 15% + ${diluent.toFixed(0)} ml NS = ${totalVolume.toFixed(0)} ml`,
      notes: "Monitor ECG if giving >0.5 mEq/kg/hr",
      ...(isMaxed && { warning: "Dose capped at maximum (40 mEq)" })
    });
  };

  const calculatePotassiumPO = () => {
    // Use custom dose from slider/input (this is total daily dose)
    let dailyDose = currentDose;
    const dosePerKg = (dailyDose / w).toFixed(1);
    
    // Get frequency divisor
    const freqMap = { "BD": 2, "TID": 3, "QID": 4 };
    const divisor = freqMap[kclPoFrequency] || 2;
    const perDose = dailyDose / divisor;
    
    setResults({
      medication: "Potassium Chloride (KCl) Oral",
      calculation: {
        dose: `${dailyDose.toFixed(1)} mEq/day (${dosePerKg} mEq/kg/day)`,
        formula: `Selected: ${dosePerKg} mEq/kg/day x ${w} kg = ${dailyDose.toFixed(1)} mEq/day`,
        drugVolume: `${perDose.toFixed(1)} mEq per dose`,
        diluent: `Divided ${kclPoFrequency} (${divisor} times/day)`,
        totalVolume: `${dailyDose.toFixed(1)} mEq total daily`
      },
      administration: {
        duration: kclPoFrequency,
        rate: `${perDose.toFixed(1)} mEq per dose`
      },
      preparation: `Give ${perDose.toFixed(1)} mEq PO ${kclPoFrequency}`,
      frequency: kclPoFrequency,
      notes: "Give with food or water to reduce GI irritation"
    });
  };

  const calculateNaHCO3 = () => {
    // Use custom dose from slider/input
    let correction = currentDose;
    const dosePerKg = (correction / w).toFixed(2);
    
    const drugVolume = correction;
    const diluentVolume = correction;
    const totalVolume = drugVolume + diluentVolume;
    
    setResults({
      medication: "Sodium Bicarbonate 8.4%",
      calculation: {
        dose: `${correction.toFixed(1)} mEq (${dosePerKg} mEq/kg)`,
        formula: `Selected: ${dosePerKg} mEq/kg x ${w} kg = ${correction.toFixed(1)} mEq`,
        drugVolume: `${drugVolume.toFixed(1)} ml`,
        diluent: `${diluentVolume.toFixed(1)} ml NS (1:1 dilution)`,
        totalVolume: `${totalVolume.toFixed(1)} ml`
      },
      administration: {
        duration: "30 min - 1 hour",
        rate: `${totalVolume.toFixed(1)} ml/hr (1h) or ${(totalVolume*2).toFixed(1)} ml/hr (30min)`
      },
      preparation: `Draw ${drugVolume.toFixed(1)} ml NaHCO3 8.4% + ${diluentVolume.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      notes: "Give in 2 halves: 1st half in 1st hour, 2nd half over 24 hours",
      warnings: ["In chronic acidosis with hypocalcemia: correct calcium FIRST"]
    });
  };

  const calculateSodium = () => {
    const na = parseFloat(currentNa);
    const targetNaVal = parseFloat(targetNa) || 140;
    
    // Use custom dose from slider/input (ml for sodium)
    let doseMl = currentDose;
    const dosePerKg = (doseMl / w).toFixed(1);
    
    if (sodiumType === "hyponatremia") {
      if (hyponatremiaType === "severe") {
        setResults({
          medication: "3% NaCl (Hypertonic Saline)",
          calculation: {
            dose: `${doseMl.toFixed(0)} ml (${dosePerKg} ml/kg)`,
            formula: `Selected: ${dosePerKg} ml/kg x ${w} kg = ${doseMl.toFixed(0)} ml`,
            drugVolume: `${doseMl.toFixed(0)} ml 3% NaCl`,
            diluent: "No dilution needed",
            totalVolume: `${doseMl.toFixed(0)} ml`
          },
          administration: {
            duration: "15-30 mins",
            rate: `${(doseMl * 4).toFixed(0)} ml/hr (over 15 min)`
          },
          preparation: `Give ${doseMl.toFixed(0)} ml of 3% NaCl`,
          notes: "May repeat bolus up to 2 times | Goal: Increase Na by 6-8 mEq/L",
          warnings: ["Do not exceed 10-12 mEq/L rise in 24 hours", "Check Na every 20 mins until symptoms resolve"]
        });
      } else {
        const naDeficit = na ? w * 0.6 * (targetNaVal - na) : doseMl;
        
        setResults({
          medication: "Sodium Correction",
          calculation: {
            dose: `${doseMl.toFixed(0)} ml (${dosePerKg} ml/kg)`,
            formula: na ? `Na deficit: ${w} kg x 0.6 x (${targetNaVal} - ${na}) = ${naDeficit.toFixed(1)} mEq` : `Selected: ${dosePerKg} ml/kg`,
            drugVolume: "Variable based on fluid choice",
            diluent: `NS: 154 mEq/L | 1/2NS: 77 mEq/L | 3%NaCl: 513 mEq/L`,
            totalVolume: `${doseMl.toFixed(0)} ml`
          },
          administration: {
            duration: "24-48 hours",
            rate: "Max correction: 0.5 mEq/hr"
          },
          preparation: "Choose appropriate fluid based on Na content",
          notes: "Correction max 10-12 mEq/day"
        });
      }
    } else {
      const fwd = na ? 4 * w * (na - targetNaVal) : doseMl;
      const maintenance = w * 100;
      const totalFluid = maintenance + fwd;
      let correctionHours = na && na >= 184 ? 84 : na && na >= 171 ? 72 : na && na >= 158 ? 48 : 24;
      const rate = totalFluid / correctionHours;
      
      setResults({
        medication: "Free Water Replacement",
        calculation: {
          dose: `${fwd.toFixed(1)} ml free water deficit`,
          formula: na ? `4 x ${w} kg x (${na} - ${targetNaVal})` : `Selected volume`,
          drugVolume: `Maintenance: ${maintenance.toFixed(0)} ml/day`,
          diluent: "D5W or hypotonic fluid",
          totalVolume: `${totalFluid.toFixed(0)} ml over ${correctionHours}h`
        },
        administration: {
          duration: `${correctionHours} hours`,
          rate: `${rate.toFixed(1)} ml/hr`
        },
        preparation: "Use D5W or hypotonic fluid",
        warnings: ["Don't drop Na >12 mEq/24hr"]
      });
    }
  };

  const calculatePhosphate = () => {
    const maxDose = 15;
    // Use custom dose from slider/input
    let doseMmol = currentDose;
    let isMaxed = doseMmol >= maxDose;
    
    const drugVolume = doseMmol / 2;
    const dosePerKg = (doseMmol / w).toFixed(3);
    
    // Peripheral dilution (0.05 mmol/ml)
    const totalVolume = doseMmol / 0.05;
    const diluent = totalVolume - drugVolume;
    
    setResults({
      medication: "Addiphos (Phosphate)",
      calculation: {
        dose: `${doseMmol.toFixed(2)} mmol${isMaxed ? ' (MAX)' : ''} (${dosePerKg} mmol/kg)`,
        formula: `Selected: ${dosePerKg} mmol/kg x ${w} kg = ${doseMmol.toFixed(2)} mmol`,
        drugVolume: `${drugVolume.toFixed(2)} ml`,
        diluent: `${diluent.toFixed(0)} ml NS (Peripheral 0.05 mmol/ml)`,
        totalVolume: `${totalVolume.toFixed(0)} ml`
      },
      administration: {
        duration: "4-6 hours (slow)",
        rate: `${(totalVolume/6).toFixed(1)} - ${(totalVolume/4).toFixed(1)} ml/hr`
      },
      preparation: `${drugVolume.toFixed(2)} ml Addiphos + ${diluent.toFixed(0)} ml NS = ${totalVolume.toFixed(0)} ml`,
      warnings: ["Rapid infusion can cause severe hypocalcemia!"],
      ...(isMaxed && { warning: "Dose capped at maximum (15 mmol)" })
    });
  };

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Weight Input */}
      <Card className="border-2 border-primary/50 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-base font-semibold">Patient Weight (kg)</Label>
              <Input
                type="number"
                  inputMode="decimal"
                step="0.1"
                min="0"
                placeholder="Enter weight..."
                value={weight}
                onChange={(e) => { setWeight(e.target.value); setResults(null); }}
                className="font-mono text-lg h-12 mt-1"
                data-testid="electrolyte-weight"
              />
            </div>
            {weight && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-2xl font-bold text-primary">{weight} kg</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Electrolyte Selector */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div>
            <Label className="text-base font-semibold">Select Electrolyte</Label>
            <Select value={selectedElectrolyte} onValueChange={setSelectedElectrolyte}>
              <SelectTrigger className="h-12 mt-1" data-testid="electrolyte-selector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calcium">Calcium</SelectItem>
                <SelectItem value="magnesium">Magnesium</SelectItem>
                <SelectItem value="potassium">Potassium (IV)</SelectItem>
                <SelectItem value="potassiumPO">Potassium (PO)</SelectItem>
                <SelectItem value="nahco3">Sodium Bicarbonate (NaHCO3)</SelectItem>
                <SelectItem value="sodium">Sodium</SelectItem>
                <SelectItem value="phosphate">Phosphate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dose Range Display */}
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              Dose Range: <span className="text-green-600 dark:text-green-400">{currentElectrolyte.doseRange}</span>
            </p>
          </div>

          {/* Dose Input with Slider */}
          {w > 0 && (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                  Select Dose ({currentElectrolyte.resultUnit})
                </Label>
                <span className="text-xs text-muted-foreground">
                  {doseLimits.min.toFixed(doseLimits.step < 1 ? 2 : 0)} - {doseLimits.max.toFixed(doseLimits.step < 1 ? 2 : 0)} {currentElectrolyte.resultUnit}
                </span>
              </div>
              
              {/* Slider */}
              <Slider
                value={[currentDose]}
                onValueChange={(value) => setCustomDose(value[0].toString())}
                min={doseLimits.min}
                max={doseLimits.max}
                step={doseLimits.step}
                className="py-2"
                data-testid="dose-slider"
              />
              
              {/* Input box with current dose */}
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  inputMode="decimal"
                  step={doseLimits.step}
                  min={doseLimits.min}
                  max={doseLimits.max}
                  value={customDose}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= doseLimits.min && val <= doseLimits.max) {
                      setCustomDose(e.target.value);
                    } else if (e.target.value === "") {
                      setCustomDose("");
                    }
                  }}
                  className="font-mono text-lg h-12 w-32"
                  data-testid="dose-input"
                />
                <span className="text-lg font-medium">{currentElectrolyte.resultUnit}</span>
                <span className="text-sm text-muted-foreground ml-auto">
                  ({(currentDose / w).toFixed(currentElectrolyte.unit.includes("mEq") || currentElectrolyte.unit.includes("mmol") ? 2 : 1)} {currentElectrolyte.unit})
                </span>
              </div>
            </div>
          )}

          {/* Electrolyte-specific inputs */}
          {selectedElectrolyte === "calcium" && (
            <div>
              <Label>Current Calcium Level (optional)</Label>
              <Input type="number" step="0.1" min="0" placeholder="mg/dL" value={calciumLevel} onChange={(e) => setCalciumLevel(e.target.value)} className="font-mono" />
              inputMode="decimal"
            </div>
          )}

          {selectedElectrolyte === "magnesium" && (
            <div>
              <Label>Current Magnesium Level (optional)</Label>
              <Input type="number" step="0.1" min="0" placeholder="mg/dL" value={magnesiumLevel} onChange={(e) => setMagnesiumLevel(e.target.value)} className="font-mono" />
              inputMode="decimal"
            </div>
          )}

          {selectedElectrolyte === "potassium" && (
            <div>
              <Label>Current Potassium Level (optional)</Label>
              <Input type="number" step="0.1" min="0" placeholder="mEq/L" value={potassiumLevel} onChange={(e) => setPotassiumLevel(e.target.value)} className="font-mono" />
              inputMode="decimal"
            </div>
          )}

          {selectedElectrolyte === "potassiumPO" && (
            <>
              <div>
                <Label>Current Potassium Level (optional)</Label>
                <Input type="number" step="0.1" min="0" placeholder="mEq/L" value={potassiumLevel} onChange={(e) => setPotassiumLevel(e.target.value)} className="font-mono" />
                inputMode="decimal"
              </div>
              <div>
                <Label>Frequency</Label>
                <RadioGroup value={kclPoFrequency} onValueChange={setKclPoFrequency} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BD" id="bd" />
                    <Label htmlFor="bd">BD (2x/day)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="TID" id="tid" />
                    <Label htmlFor="tid">TID (3x/day)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="QID" id="qid" />
                    <Label htmlFor="qid">QID (4x/day)</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {selectedElectrolyte === "nahco3" && (
            <>
              <RadioGroup value={nahco3Method} onValueChange={setNahco3Method} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hco3" id="hco3" />
                  <Label htmlFor="hco3">HCO3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="be" id="be" />
                  <Label htmlFor="be">Base Excess</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both</Label>
                </div>
              </RadioGroup>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>HCO3 (mEq/L)</Label>
                  <Input type="number" step="0.1" min="0" value={hco3Level} onChange={(e) => setHco3Level(e.target.value)} className="font-mono" disabled={nahco3Method === "be"} />
                  inputMode="decimal"
                </div>
                <div>
                  <Label>Base Excess</Label>
                  <Input type="number" step="0.1" placeholder="e.g., -10" value={baseExcess} onChange={(e) => setBaseExcess(e.target.value)} className="font-mono" disabled={nahco3Method === "hco3"} />
                  inputMode="decimal"
                </div>
              </div>
            </>
          )}

          {selectedElectrolyte === "sodium" && (
            <>
              <RadioGroup value={sodiumType} onValueChange={setSodiumType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hyponatremia" id="hypo" />
                  <Label htmlFor="hypo">Hyponatremia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hypernatremia" id="hyper" />
                  <Label htmlFor="hyper">Hypernatremia</Label>
                </div>
              </RadioGroup>
              {sodiumType === "hyponatremia" && (
                <RadioGroup value={hyponatremiaType} onValueChange={setHyponatremiaType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild">Mild (125-134)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe">Severe (&lt;125)</Label>
                  </div>
                </RadioGroup>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Current Na (mEq/L)</Label>
                  <Input type="number" min="0" value={currentNa} onChange={(e) => setCurrentNa(e.target.value)} className="font-mono" />
                  inputMode="decimal"
                </div>
                <div>
                  <Label>Target Na (mEq/L)</Label>
                  <Input type="number" min="0" placeholder="140" value={targetNa} onChange={(e) => setTargetNa(e.target.value)} className="font-mono" />
                  inputMode="decimal"
                </div>
              </div>
            </>
          )}

          {selectedElectrolyte === "phosphate" && (
            <>
              <div>
                <Label>Phosphate Level (optional)</Label>
                <Input type="number" step="0.1" min="0" placeholder="mg/dL" value={phosphateLevel} onChange={(e) => setPhosphateLevel(e.target.value)} className="font-mono" />
                inputMode="decimal"
              </div>
              <RadioGroup value={phosphateSeverity} onValueChange={setPhosphateSeverity} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="phos-moderate" />
                  <Label htmlFor="phos-moderate">Moderate (P 1-2 mg/dL)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="phos-severe" />
                  <Label htmlFor="phos-severe">Severe (P &lt;1 mg/dL)</Label>
                </div>
              </RadioGroup>
            </>
          )}

          <Button onClick={calculate} className="w-full h-12" data-testid="calculate-btn">
            <Calculator className="h-5 w-5 mr-2" />
            Calculate
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && !results.error && (
        <Card className="border-2 border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Syringe className="h-5 w-5" />
              {results.medication}
            </CardTitle>
            {results.warning && (
              <div className="mt-2 p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 border border-amber-300">
                <p className="text-sm font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" /> {results.warning}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drug Info */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Drug Information</p>
              <p className="text-sm"><strong>Stock:</strong> {currentElectrolyte.stock}</p>
              <p className="text-sm"><strong>Target:</strong> {currentElectrolyte.target}</p>
              <p className="text-sm"><strong>Dose Range:</strong> <span className="text-red-600 font-medium">{currentElectrolyte.doseRange}</span></p>
            </div>

            {/* Calculation */}
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
              <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Calculation</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center border-b border-green-200 pb-1">
                  <span className="text-muted-foreground">1. Dose:</span>
                  <span className="font-bold text-green-700">{results.calculation.dose}</span>
                </div>
                <div className="text-xs text-muted-foreground pl-4">({results.calculation.formula})</div>
                <div className="flex justify-between items-center border-b border-green-200 pb-1">
                  <span className="text-muted-foreground">2. Drug Volume:</span>
                  <span className="font-bold">{results.calculation.drugVolume}</span>
                </div>
                <div className="flex justify-between items-center border-b border-green-200 pb-1">
                  <span className="text-muted-foreground">3. Diluent:</span>
                  <span className="font-bold">{results.calculation.diluent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">4. Total Volume:</span>
                  <span className="font-bold text-lg">{results.calculation.totalVolume}</span>
                </div>
              </div>
            </div>

            {/* Administration */}
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Administration</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-lg font-bold text-amber-700">{results.administration.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rate</p>
                  <p className="text-lg font-bold text-amber-700">{results.administration.rate}</p>
                </div>
              </div>
            </div>

            {/* Preparation */}
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">Preparation</p>
              <p className="text-sm font-mono bg-white dark:bg-gray-900 p-2 rounded">{results.preparation}</p>
            </div>

            {/* Frequency */}
            {results.frequency && (
              <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-center">
                <p className="text-sm"><strong>Frequency:</strong> {results.frequency}</p>
              </div>
            )}

            {/* Notes */}
            {results.notes && (
              <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/30 text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> {results.notes}
              </div>
            )}

            {/* Compatibility */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-green-100 dark:bg-green-900/30">
                <p className="text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Compatible
                </p>
                <p className="text-xs mt-1">{currentElectrolyte.compatible}</p>
              </div>
              <div className="p-2 rounded bg-red-100 dark:bg-red-900/30">
                <p className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Incompatible
                </p>
                <p className="text-xs mt-1">{currentElectrolyte.incompatible}</p>
              </div>
            </div>

            {/* Warnings */}
            {results.warnings && results.warnings.length > 0 && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-300">
                {results.warnings.map((warn, i) => (
                  <p key={i} className="text-sm font-bold text-red-700 dark:text-red-300 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {warn}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {results && results.error && (
        <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
          <CardContent className="pt-4">
            <p className="text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {results.error}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ElectrolytesInfusionsPage;
