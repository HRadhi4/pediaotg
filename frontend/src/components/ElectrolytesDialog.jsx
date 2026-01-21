/**
 * Electrolytes Correction Dialog
 * 
 * Simplified calculator with:
 * - Dropdown to select electrolyte
 * - Dose range displayed prominently
 * - Dose slider/input within allowed range
 * - Calculation results with preparation instructions
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Calculator, AlertCircle, Clock, AlertTriangle, CheckCircle, Syringe } from "lucide-react";

const ElectrolytesDialog = ({ open, onOpenChange }) => {
  const [weight, setWeight] = useState("");
  const [selectedElectrolyte, setSelectedElectrolyte] = useState("calcium");
  const [results, setResults] = useState(null);
  const [customDose, setCustomDose] = useState("");
  const w = parseFloat(weight) || 0;

  // Electrolyte-specific states
  const [calciumLevel, setCalciumLevel] = useState("");
  const [sodiumType, setSodiumType] = useState("hyponatremia");
  const [hyponatremiaType, setHyponatremiaType] = useState("mild");
  const [currentNa, setCurrentNa] = useState("");
  const [targetNa, setTargetNa] = useState("");
  const [phosphateSeverity, setPhosphateSeverity] = useState("moderate");
  const [kclPoFrequency, setKclPoFrequency] = useState("BD");
  
  // NaHCO3 correction states
  const [nahco3Method, setNahco3Method] = useState("hco3"); // "hco3", "be", or "infusion"
  const [labHco3, setLabHco3] = useState("");
  const [desiredHco3, setDesiredHco3] = useState("24");
  const [baseExcess, setBaseExcess] = useState("");
  const [infusionRate, setInfusionRate] = useState("1"); // mEq/kg/hr

  // Electrolyte definitions with dose ranges
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
      incompatible: "Ceftriaxone, Phosphate, Magnesium"
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
      incompatible: "Calcium chloride, Sodium bicarbonate"
    },
    potassium: {
      name: "Potassium",
      medication: "Potassium Chloride (KCl)",
      doseRangeIV: "0.5-1 mEq/kg/dose (Max 40 mEq)",
      doseRangePO: "1-4 mEq/kg/day (divided BD-QID)",
      doseMinIV: 0.5,
      doseMaxIV: 1,
      maxAbsoluteIV: 40,
      doseMinPO: 1,
      doseMaxPO: 4,
      maxAbsolutePO: 100,
      unit: "mEq/kg",
      resultUnit: "mEq",
      stock: "15% KCl = 2 mEq/ml",
      target: "Peripheral: 80 mEq/L | Central: 150 mEq/L",
      compatible: "NS, D5W, LR",
      incompatible: "Amphotericin B, Diazepam"
    },
    nahco3: {
      name: "Sodium Bicarbonate",
      medication: "Sodium Bicarbonate 8.4%",
      doseRange: "Formula-based (no fixed range)",
      hideSlider: true,
      unit: "mEq",
      resultUnit: "mEq",
      stock: "1 mEq/ml (8.4%)",
      target: "1:1 dilution",
      compatible: "NS, D5W, D10W",
      incompatible: "Calcium salts, Dopamine, Epinephrine"
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
      compatible: "Most IV fluids",
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
      target: "Peripheral: 0.05 mmol/ml",
      compatible: "Most IV fluids",
      incompatible: "Calcium salts"
    }
  };

  // Clear results and reset dose when electrolyte or weight changes
  useEffect(() => {
    setResults(null);
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
    const minAbsDose = doseMin * w;
    const maxAbsDose = Math.min(doseMax * w, maxAbsolute);
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
      case "calcium": calculateCalcium(); break;
      case "magnesium": calculateMagnesium(); break;
      case "potassium": calculatePotassium(); break;
      case "potassiumPO": calculatePotassiumPO(); break;
      case "nahco3": calculateNaHCO3(); break;
      case "sodium": calculateSodium(); break;
      case "phosphate": calculatePhosphate(); break;
      default: break;
    }
  };

  const calculateCalcium = () => {
    const maxDose = 1000;
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
        formula: `Selected: ${dosePerKg} mg/kg x ${w} kg`,
        drugVolume: `${doseMl.toFixed(1)} ml`,
        diluent: `${diluentMl.toFixed(1)} ml (NS or D5W)`,
        totalVolume: `${totalVolume.toFixed(1)} ml (at 50 mg/ml)`
      },
      administration: { duration: "1 hour", rate: `${totalVolume.toFixed(1)} ml/hr` },
      preparation: `Draw ${doseMl.toFixed(1)} ml Ca Gluconate + ${diluentMl.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      frequency: calciumLevel && parseFloat(calciumLevel) < 7 ? "BD" : "OD"
    });
  };

  const calculateMagnesium = () => {
    let doseMg = currentDose;
    let isMaxed = doseMg >= 2000;
    
    const drugVolume = doseMg / 500;
    const targetConc = 60;
    const totalVolume = doseMg / targetConc;
    const diluent = totalVolume - drugVolume;
    const dosePerKg = (doseMg / w).toFixed(1);
    
    setResults({
      medication: "Magnesium Sulfate 50%",
      calculation: {
        dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''} (${dosePerKg} mg/kg)`,
        formula: `Selected: ${dosePerKg} mg/kg x ${w} kg`,
        drugVolume: `${drugVolume.toFixed(2)} ml`,
        diluent: `${diluent.toFixed(1)} ml (NS or D5W)`,
        totalVolume: `${totalVolume.toFixed(1)} ml (at 60 mg/ml)`
      },
      administration: { duration: "2-4 hours", rate: `${(totalVolume/3).toFixed(1)} ml/hr` },
      preparation: `Draw ${drugVolume.toFixed(2)} ml MgSO4 50% + ${diluent.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      frequency: "BD for 3 doses"
    });
  };

  const calculatePotassium = () => {
    let doseMEq = currentDose;
    let isMaxed = doseMEq >= 40;
    
    const drugVolume = doseMEq / 2;
    const dosePerKg = (doseMEq / w).toFixed(2);
    const peripheralConc = 0.08;
    const totalVolume = doseMEq / peripheralConc;
    const diluent = totalVolume - drugVolume;
    const duration = parseFloat(dosePerKg) <= 0.5 ? "1 hour" : "2 hours";
    const rate = parseFloat(dosePerKg) <= 0.5 ? totalVolume : totalVolume / 2;
    
    setResults({
      medication: "Potassium Chloride (KCl) 15%",
      calculation: {
        dose: `${doseMEq.toFixed(1)} mEq${isMaxed ? ' (MAX)' : ''} (${dosePerKg} mEq/kg)`,
        formula: `Selected: ${dosePerKg} mEq/kg x ${w} kg`,
        drugVolume: `${drugVolume.toFixed(2)} ml`,
        diluent: `${diluent.toFixed(0)} ml NS (Peripheral 80 mEq/L)`,
        totalVolume: `${totalVolume.toFixed(0)} ml`
      },
      administration: { duration, rate: `${rate.toFixed(0)} ml/hr` },
      preparation: `${drugVolume.toFixed(2)} ml KCl 15% + ${diluent.toFixed(0)} ml NS = ${totalVolume.toFixed(0)} ml`,
      notes: "Monitor ECG if >0.5 mEq/kg/hr"
    });
  };

  const calculatePotassiumPO = () => {
    // This is total daily dose from slider
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
        formula: `Selected: ${dosePerKg} mEq/kg/day x ${w} kg`,
        drugVolume: `${perDose.toFixed(1)} mEq per dose`,
        diluent: `Divided ${kclPoFrequency} (${divisor} times/day)`,
        totalVolume: `${dailyDose.toFixed(1)} mEq total daily`
      },
      administration: { duration: kclPoFrequency, rate: `${perDose.toFixed(1)} mEq per dose` },
      preparation: `Give ${perDose.toFixed(1)} mEq PO ${kclPoFrequency}`,
      frequency: kclPoFrequency,
      notes: "Give with food or water to reduce GI irritation"
    });
  };

  const calculateNaHCO3 = () => {
    let correction = 0;
    let formula = "";
    
    if (nahco3Method === "infusion") {
      // Infusion: 0.25-2 mEq/kg/hr
      const rate = parseFloat(infusionRate) || 1;
      const mEqPerHour = rate * w;
      const mlPerHour = mEqPerHour; // 8.4% = 1 mEq/ml
      
      setResults({
        medication: "Sodium Bicarbonate 8.4% Infusion",
        calculation: {
          dose: `${rate} mEq/kg/hr`,
          formula: `${rate} mEq/kg/hr × ${w} kg = ${mEqPerHour.toFixed(1)} mEq/hr`,
          drugVolume: `${mlPerHour.toFixed(1)} ml/hr (undiluted)`,
          diluent: "Can dilute 1:1 with NS if needed",
          totalVolume: `${mlPerHour.toFixed(1)} - ${(mlPerHour * 2).toFixed(1)} ml/hr`
        },
        administration: { 
          duration: "Continuous", 
          rate: `${mlPerHour.toFixed(1)} ml/hr (undiluted) or ${(mlPerHour * 2).toFixed(1)} ml/hr (1:1 diluted)` 
        },
        preparation: `Set infusion at ${mlPerHour.toFixed(1)} ml/hr of NaHCO3 8.4%`,
        notes: "Method: Continuous Infusion | Range: 0.25-2 mEq/kg/hr",
        oralNote: "Oral NaHCO3: 600 mg = 7 mEq",
        warnings: ["Monitor ABG every 2-4 hours", "Adjust rate based on response"]
      });
      return;
    }
    
    if (nahco3Method === "hco3") {
      // Correction (1): (Desired HCO3 - Lab HCO3) × 0.3 × WT
      const labValue = parseFloat(labHco3);
      const desiredValue = parseFloat(desiredHco3) || 24;
      
      if (!labValue) {
        setResults({ error: "Please enter Lab HCO3 value" });
        return;
      }
      
      correction = (desiredValue - labValue) * 0.3 * w;
      formula = `(${desiredValue} - ${labValue}) × 0.3 × ${w} kg`;
    } else {
      // Correction (2): BE × 0.3 × WT
      const beValue = parseFloat(baseExcess);
      
      if (!beValue && beValue !== 0) {
        setResults({ error: "Please enter Base Excess value" });
        return;
      }
      
      correction = Math.abs(beValue) * 0.3 * w;
      formula = `|${beValue}| × 0.3 × ${w} kg`;
    }
    
    if (correction <= 0) {
      setResults({ error: "Calculated correction is zero or negative. Check your values." });
      return;
    }
    
    const drugVolume = correction;
    const diluentVolume = correction;
    const totalVolume = drugVolume + diluentVolume;
    const halfDose = correction / 2;
    const halfVolume = totalVolume / 2;
    
    setResults({
      medication: "Sodium Bicarbonate 8.4%",
      calculation: {
        dose: `${correction.toFixed(1)} mEq`,
        formula: formula,
        drugVolume: `${drugVolume.toFixed(1)} ml (8.4% = 1 mEq/ml)`,
        diluent: `${diluentVolume.toFixed(1)} ml NS (1:1 dilution)`,
        totalVolume: `${totalVolume.toFixed(1)} ml`
      },
      administration: { 
        duration: "Split dose (in Metabolic patients)", 
        rate: `1st half: ${halfDose.toFixed(1)} mEq (${halfVolume.toFixed(1)} ml) over 1st hour | 2nd half: ${halfDose.toFixed(1)} mEq (${halfVolume.toFixed(1)} ml) over next 24 hours` 
      },
      preparation: `Draw ${drugVolume.toFixed(1)} ml NaHCO3 + ${diluentVolume.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      notes: `Method: ${nahco3Method === "hco3" ? "HCO3 deficit" : "Base Excess"}`,
      oralNote: "Oral NaHCO3: 600 mg = 7 mEq",
      warnings: ["Correct calcium FIRST if hypocalcemic", "Recheck ABG after 1st half"]
    });
  };

  const calculateSodium = () => {
    let doseMl = currentDose;
    const dosePerKg = (doseMl / w).toFixed(1);
    
    if (sodiumType === "hyponatremia" && hyponatremiaType === "severe") {
      setResults({
        medication: "3% NaCl (Hypertonic Saline)",
        calculation: {
          dose: `${doseMl.toFixed(0)} ml (${dosePerKg} ml/kg)`,
          formula: `Selected: ${dosePerKg} ml/kg x ${w} kg`,
          drugVolume: `${doseMl.toFixed(0)} ml 3% NaCl`,
          diluent: "No dilution needed",
          totalVolume: `${doseMl.toFixed(0)} ml`
        },
        administration: { duration: "15-30 mins", rate: `${(doseMl * 4).toFixed(0)} ml/hr (over 15 min)` },
        preparation: `Give ${doseMl.toFixed(0)} ml of 3% NaCl`,
        notes: "May repeat up to 2x | Goal: Increase Na by 6-8 mEq/L",
        warnings: ["Max 10-12 mEq/L rise in 24 hours"]
      });
    } else {
      const na = parseFloat(currentNa) || 125;
      const naDeficit = w * 0.6 * (140 - na);
      setResults({
        medication: "Sodium Correction (Mild)",
        calculation: {
          dose: `${naDeficit.toFixed(1)} mEq Na deficit`,
          formula: `${w} kg x 0.6 x (140 - ${na})`,
          drugVolume: "Variable",
          diluent: `NS: 154 mEq/L | 3%NaCl: 513 mEq/L`,
          totalVolume: "Based on fluid choice"
        },
        administration: { duration: "24-48 hours", rate: "Max 0.5 mEq/hr" },
        preparation: "Choose appropriate fluid",
        notes: "Correction max 10-12 mEq/day"
      });
    }
  };

  const calculatePhosphate = () => {
    let doseMmol = currentDose;
    let isMaxed = doseMmol >= 15;
    const drugVolume = doseMmol / 2;
    const dosePerKg = (doseMmol / w).toFixed(3);
    const totalVolume = doseMmol / 0.05;
    const diluent = totalVolume - drugVolume;
    
    setResults({
      medication: "Addiphos (Phosphate)",
      calculation: {
        dose: `${doseMmol.toFixed(2)} mmol${isMaxed ? ' (MAX)' : ''} (${dosePerKg} mmol/kg)`,
        formula: `Selected: ${dosePerKg} mmol/kg x ${w} kg`,
        drugVolume: `${drugVolume.toFixed(2)} ml`,
        diluent: `${diluent.toFixed(0)} ml NS (0.05 mmol/ml)`,
        totalVolume: `${totalVolume.toFixed(0)} ml`
      },
      administration: { duration: "4-6 hours", rate: `${(totalVolume/5).toFixed(1)} ml/hr` },
      preparation: `${drugVolume.toFixed(2)} ml Addiphos + ${diluent.toFixed(0)} ml NS = ${totalVolume.toFixed(0)} ml`,
      warnings: ["Rapid infusion causes hypocalcemia!"]
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Electrolyte Correction Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Weight Input */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-sm font-medium">Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter weight..."
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setResults(null); }}
                  className="font-mono h-10 mt-1"
                />
              </div>
              {weight && (
                <div className="text-center px-3">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-xl font-bold text-primary">{weight} kg</p>
                </div>
              )}
            </div>
          </div>

          {/* Electrolyte Selector */}
          <div>
            <Label className="text-sm font-medium">Select Electrolyte</Label>
            <Select value={selectedElectrolyte} onValueChange={setSelectedElectrolyte}>
              <SelectTrigger className="h-10 mt-1">
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

          {/* Dose Range Display - Hide for NaHCO3 */}
          {selectedElectrolyte !== "nahco3" && (
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300">
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                Dose Range: <span className="text-green-600 dark:text-green-400">{currentElectrolyte.doseRange}</span>
              </p>
            </div>
          )}

          {/* Dose Input with Slider - Hide for NaHCO3 (uses formula instead) */}
          {w > 0 && selectedElectrolyte !== "nahco3" && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                  Select Dose ({currentElectrolyte.resultUnit})
                </Label>
                <span className="text-xs text-muted-foreground">
                  {doseLimits.min.toFixed(doseLimits.step < 1 ? 2 : 0)} - {doseLimits.max.toFixed(doseLimits.step < 1 ? 2 : 0)} {currentElectrolyte.resultUnit}
                </span>
              </div>
              
              <Slider
                value={[currentDose]}
                onValueChange={(value) => setCustomDose(value[0].toString())}
                min={doseLimits.min}
                max={doseLimits.max}
                step={doseLimits.step}
                className="py-2"
              />
              
              <div className="flex items-center gap-2">
                <Input
                  type="number"
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
                  className="font-mono h-10 w-28"
                />
                <span className="text-sm font-medium">{currentElectrolyte.resultUnit}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  ({(currentDose / w).toFixed(currentElectrolyte.unit.includes("mEq") || currentElectrolyte.unit.includes("mmol") ? 2 : 1)} {currentElectrolyte.unit})
                </span>
              </div>
            </div>
          )}

          {/* NaHCO3-specific options - Correction Method Switch */}
          {selectedElectrolyte === "nahco3" && w > 0 && (
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label className="text-sm font-semibold text-orange-800 dark:text-orange-300">Method</Label>
                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border">
                  <button
                    type="button"
                    onClick={() => setNahco3Method("hco3")}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      nahco3Method === "hco3" 
                        ? "bg-orange-500 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    HCO3
                  </button>
                  <button
                    type="button"
                    onClick={() => setNahco3Method("be")}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      nahco3Method === "be" 
                        ? "bg-orange-500 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Base Excess
                  </button>
                  <button
                    type="button"
                    onClick={() => setNahco3Method("infusion")}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      nahco3Method === "infusion" 
                        ? "bg-orange-500 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Infusion
                  </button>
                </div>
              </div>
              
              {nahco3Method === "hco3" && (
                <div className="space-y-2">
                  <p className="text-xs text-orange-700 dark:text-orange-400 font-mono">
                    (Desired HCO3 - Lab HCO3) × 0.3 × WT
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Lab HCO3 (mEq/L)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="e.g., 12"
                        value={labHco3}
                        onChange={(e) => setLabHco3(e.target.value)}
                        className="font-mono h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Desired HCO3 (mEq/L)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="24"
                        value={desiredHco3}
                        onChange={(e) => setDesiredHco3(e.target.value)}
                        className="font-mono h-9"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {nahco3Method === "be" && (
                <div className="space-y-2">
                  <p className="text-xs text-orange-700 dark:text-orange-400 font-mono">
                    BE × 0.3 × WT (from ABG)
                  </p>
                  <div>
                    <Label className="text-xs">Base Excess (mEq/L)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="-?[0-9]*\.?[0-9]*"
                      placeholder="e.g., -10"
                      value={baseExcess}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || val === '-' || /^-?\d*\.?\d*$/.test(val)) {
                          setBaseExcess(val);
                        }
                      }}
                      className="font-mono h-9"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Enter negative value (e.g., -10)</p>
                  </div>
                </div>
              )}
              
              {nahco3Method === "infusion" && (
                <div className="space-y-2">
                  <p className="text-xs text-orange-700 dark:text-orange-400 font-mono">
                    Continuous Infusion: 0.25 - 2 mEq/kg/hr
                  </p>
                  <div>
                    <Label className="text-xs">Infusion Rate (mEq/kg/hr)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.25"
                        min="0.25"
                        max="2"
                        placeholder="1"
                        value={infusionRate}
                        onChange={(e) => setInfusionRate(e.target.value)}
                        className="font-mono h-9 w-24"
                      />
                      <span className="text-xs text-muted-foreground">mEq/kg/hr (Range: 0.25-2)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Potassium PO-specific options */}
          {selectedElectrolyte === "potassiumPO" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Frequency</Label>
              <RadioGroup value={kclPoFrequency} onValueChange={setKclPoFrequency} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BD" id="bd" />
                  <Label htmlFor="bd" className="text-sm">BD (2x/day)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TID" id="tid" />
                  <Label htmlFor="tid" className="text-sm">TID (3x/day)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="QID" id="qid" />
                  <Label htmlFor="qid" className="text-sm">QID (4x/day)</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Sodium-specific options */}
          {selectedElectrolyte === "sodium" && (
            <div className="space-y-2">
              <RadioGroup value={sodiumType} onValueChange={setSodiumType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hyponatremia" id="hypo" />
                  <Label htmlFor="hypo" className="text-sm">Hyponatremia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hypernatremia" id="hyper" />
                  <Label htmlFor="hyper" className="text-sm">Hypernatremia</Label>
                </div>
              </RadioGroup>
              {sodiumType === "hyponatremia" && (
                <RadioGroup value={hyponatremiaType} onValueChange={setHyponatremiaType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild" className="text-sm">Mild (125-134)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe" className="text-sm">Severe (&lt;125)</Label>
                  </div>
                </RadioGroup>
              )}
            </div>
          )}

          {/* Phosphate-specific options */}
          {selectedElectrolyte === "phosphate" && (
            <RadioGroup value={phosphateSeverity} onValueChange={setPhosphateSeverity} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="phos-mod" />
                <Label htmlFor="phos-mod" className="text-sm">Moderate (P 1-2)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="phos-sev" />
                <Label htmlFor="phos-sev" className="text-sm">Severe (P &lt;1)</Label>
              </div>
            </RadioGroup>
          )}

          <Button onClick={calculate} className="w-full h-10">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate
          </Button>

          {/* Results */}
          {results && !results.error && (
            <Card className="border-primary/30">
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Syringe className="h-4 w-4" />
                  {results.medication}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {/* Drug Info */}
                <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/30 text-xs">
                  <p><strong>Stock:</strong> {currentElectrolyte.stock}</p>
                  <p><strong>Target:</strong> {currentElectrolyte.target}</p>
                </div>

                {/* Calculation */}
                <div className="p-2 rounded bg-green-50 dark:bg-green-950/30 text-xs space-y-1">
                  <p className="font-semibold text-green-700 dark:text-green-300">Calculation</p>
                  <p><strong>Dose:</strong> {results.calculation.dose}</p>
                  <p className="text-muted-foreground">({results.calculation.formula})</p>
                  <p><strong>Drug Volume:</strong> {results.calculation.drugVolume}</p>
                  <p><strong>Diluent:</strong> {results.calculation.diluent}</p>
                  <p><strong>Total Volume:</strong> <span className="text-lg font-bold">{results.calculation.totalVolume}</span></p>
                </div>

                {/* Administration */}
                <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3 w-3 text-amber-600" />
                    <p className="text-xs font-semibold text-amber-700">Administration</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Duration:</span> <strong>{results.administration.duration}</strong></div>
                    <div><span className="text-muted-foreground">Rate:</span> <strong>{results.administration.rate}</strong></div>
                  </div>
                </div>

                {/* Preparation */}
                <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/30 text-xs">
                  <p className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Preparation</p>
                  <p className="font-mono bg-white dark:bg-gray-900 p-1.5 rounded text-xs">{results.preparation}</p>
                </div>

                {/* Frequency & Notes */}
                {results.frequency && (
                  <p className="text-xs text-center"><strong>Frequency:</strong> {results.frequency}</p>
                )}
                {results.notes && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <strong>Note:</strong> {results.notes}
                  </p>
                )}
                
                {/* Oral NaHCO3 Note */}
                {results.oralNote && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <strong>💊 {results.oralNote}</strong>
                  </p>
                )}

                {/* Warnings */}
                {results.warnings && (
                  <div className="p-2 rounded bg-red-50 dark:bg-red-950/30 border border-red-200">
                    {results.warnings.map((warn, i) => (
                      <p key={i} className="text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {warn}
                      </p>
                    ))}
                  </div>
                )}

                {/* Compatibility */}
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="p-1.5 rounded bg-green-100 dark:bg-green-900/30">
                    <p className="font-semibold text-green-700 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Compatible
                    </p>
                    <p>{currentElectrolyte.compatible}</p>
                  </div>
                  <div className="p-1.5 rounded bg-red-100 dark:bg-red-900/30">
                    <p className="font-semibold text-red-700 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Incompatible
                    </p>
                    <p>{currentElectrolyte.incompatible}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {results && results.error && (
            <div className="p-3 rounded bg-red-50 dark:bg-red-950/30 border border-red-200">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {results.error}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ElectrolytesDialog;
