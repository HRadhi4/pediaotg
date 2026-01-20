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
      name: "Potassium",
      medication: "Potassium Chloride (KCl)",
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

  // Clear results when electrolyte changes
  useEffect(() => {
    setResults(null);
  }, [selectedElectrolyte]);

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
    let doseMg = w * 100;
    let isMaxed = false;
    
    if (doseMg > maxDose) {
      doseMg = maxDose;
      isMaxed = true;
    }
    
    const doseMl = doseMg / 100;
    const targetConc = 50;
    const totalVolume = doseMg / targetConc;
    const diluentMl = totalVolume - doseMl;
    
    setResults({
      medication: "Calcium Gluconate 10%",
      calculation: {
        dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}`,
        formula: `${w} kg x 100 mg/kg = ${(w * 100).toFixed(0)} mg${isMaxed ? ' → capped at 1000 mg' : ''}`,
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
    let doseMin = w * 25;
    let doseMax = w * 50;
    let isMaxed = false;
    
    if (doseMax > maxDose) {
      doseMax = maxDose;
      doseMin = Math.min(doseMin, maxDose);
      isMaxed = true;
    }
    
    const drugVolumeMin = doseMin / 500;
    const drugVolumeMax = doseMax / 500;
    const targetConc = 60;
    const totalVolumeMin = doseMin / targetConc;
    const totalVolumeMax = doseMax / targetConc;
    const diluentMin = totalVolumeMin - drugVolumeMin;
    const diluentMax = totalVolumeMax - drugVolumeMax;
    
    setResults({
      medication: "Magnesium Sulfate 50%",
      calculation: {
        dose: `${doseMin.toFixed(0)} - ${doseMax.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}`,
        formula: `${w} kg x 25-50 mg/kg${isMaxed ? ' → capped at 2000 mg' : ''}`,
        drugVolume: `${drugVolumeMin.toFixed(2)} - ${drugVolumeMax.toFixed(2)} ml`,
        diluent: `${diluentMin.toFixed(1)} - ${diluentMax.toFixed(1)} ml (NS or D5W)`,
        totalVolume: `${totalVolumeMin.toFixed(1)} - ${totalVolumeMax.toFixed(1)} ml (at 60 mg/ml)`
      },
      administration: {
        duration: "2-4 hours",
        rate: `${(totalVolumeMin/4).toFixed(1)} - ${(totalVolumeMax/2).toFixed(1)} ml/hr`
      },
      preparation: `Draw ${drugVolumeMax.toFixed(2)} ml MgSO4 50% + ${diluentMax.toFixed(1)} ml NS = ${totalVolumeMax.toFixed(1)} ml`,
      frequency: "BD for 3 doses",
      ...(isMaxed && { warning: "Dose capped at maximum (2g per dose)" })
    });
  };

  const calculatePotassium = () => {
    const ivMaxDose = 40;
    let doseMin = w * 0.5;
    let doseMax = w * 1;
    let isMaxed = false;
    
    if (doseMax > ivMaxDose) {
      doseMax = ivMaxDose;
      doseMin = Math.min(doseMin, ivMaxDose);
      isMaxed = true;
    }
    
    const kclStock = 2;
    const drugVolumeMin = doseMin / kclStock;
    const drugVolumeMax = doseMax / kclStock;
    
    // Peripheral dilution (80 mEq/L)
    const peripheralConc = 0.08;
    const totalVolumeMin = doseMin / peripheralConc;
    const totalVolumeMax = doseMax / peripheralConc;
    const diluentMin = totalVolumeMin - drugVolumeMin;
    const diluentMax = totalVolumeMax - drugVolumeMax;
    
    setResults({
      medication: "Potassium Chloride (KCl) 15%",
      calculation: {
        dose: `${doseMin.toFixed(1)} - ${doseMax.toFixed(1)} mEq${isMaxed ? ' (MAX)' : ''}`,
        formula: `0.5 mEq/kg over 1hr | 1 mEq/kg over 2hr`,
        drugVolume: `${drugVolumeMin.toFixed(2)} - ${drugVolumeMax.toFixed(2)} ml`,
        diluent: `${diluentMin.toFixed(0)} - ${diluentMax.toFixed(0)} ml NS (Peripheral 80 mEq/L)`,
        totalVolume: `${totalVolumeMin.toFixed(0)} - ${totalVolumeMax.toFixed(0)} ml`
      },
      administration: {
        duration: "1-2 hours",
        rate: `${totalVolumeMin.toFixed(0)} ml/hr (1h) | ${(totalVolumeMax/2).toFixed(0)} ml/hr (2h)`
      },
      preparation: `${drugVolumeMax.toFixed(2)} ml KCl 15% + ${diluentMax.toFixed(0)} ml NS = ${totalVolumeMax.toFixed(0)} ml`,
      notes: "Monitor ECG if giving >0.5 mEq/kg/hr",
      ...(isMaxed && { warning: "Dose capped at maximum (40 mEq)" })
    });
  };

  const calculateNaHCO3 = () => {
    const hco3 = parseFloat(hco3Level);
    const be = parseFloat(baseExcess);
    
    let correction = 0;
    let method = "";
    
    if ((nahco3Method === "hco3" || nahco3Method === "both") && !isNaN(hco3)) {
      const desiredHCO3 = 20;
      correction = (desiredHCO3 - hco3) * 0.3 * w;
      method = `(20 - ${hco3}) x 0.3 x ${w} kg`;
    } else if ((nahco3Method === "be" || nahco3Method === "both") && !isNaN(be)) {
      correction = Math.abs(be) * 0.3 * w;
      method = `|${be}| x 0.3 x ${w} kg`;
    } else {
      // Default calculation
      correction = w * 1.5;
      method = `${w} kg x 1.5 mEq/kg (standard dose)`;
    }
    
    const drugVolume = correction;
    const diluentVolume = correction;
    const totalVolume = drugVolume + diluentVolume;
    
    setResults({
      medication: "Sodium Bicarbonate 8.4%",
      calculation: {
        dose: `${correction.toFixed(1)} mEq`,
        formula: method,
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
    
    if (!na) {
      setResults({ error: "Please enter current sodium level" });
      return;
    }
    
    if (sodiumType === "hyponatremia") {
      if (hyponatremiaType === "severe") {
        const bolusMin = w * 3;
        const bolusMax = w * 5;
        
        setResults({
          medication: "3% NaCl (Hypertonic Saline)",
          calculation: {
            dose: `${bolusMin.toFixed(0)} - ${bolusMax.toFixed(0)} ml`,
            formula: `${w} kg x 3-5 ml/kg`,
            drugVolume: `${bolusMin.toFixed(0)} - ${bolusMax.toFixed(0)} ml 3% NaCl`,
            diluent: "No dilution needed",
            totalVolume: `${bolusMin.toFixed(0)} - ${bolusMax.toFixed(0)} ml`
          },
          administration: {
            duration: "15-30 mins",
            rate: `${(bolusMax/0.5).toFixed(0)} ml/hr (over 15 min)`
          },
          preparation: `Give ${bolusMin.toFixed(0)}-${bolusMax.toFixed(0)} ml of 3% NaCl`,
          notes: "May repeat bolus up to 2 times | Goal: Increase Na by 6-8 mEq/L",
          warnings: ["Do not exceed 10-12 mEq/L rise in 24 hours", "Check Na every 20 mins until symptoms resolve"]
        });
      } else {
        const naDeficit = w * 0.6 * (targetNaVal - na);
        
        setResults({
          medication: "Sodium Correction",
          calculation: {
            dose: `${naDeficit.toFixed(1)} mEq Na deficit`,
            formula: `${w} kg x 0.6 x (${targetNaVal} - ${na})`,
            drugVolume: "Variable based on fluid choice",
            diluent: `NS: 154 mEq/L | 1/2NS: 77 mEq/L | 3%NaCl: 513 mEq/L`,
            totalVolume: "Calculate based on fluid Na content"
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
      const fwd = 4 * w * (na - targetNaVal);
      const maintenance = w * 100;
      const totalFluid = maintenance + fwd;
      let correctionHours = na >= 184 ? 84 : na >= 171 ? 72 : na >= 158 ? 48 : 24;
      const rate = totalFluid / correctionHours;
      
      setResults({
        medication: "Free Water Replacement",
        calculation: {
          dose: `${fwd.toFixed(1)} ml free water deficit`,
          formula: `4 x ${w} kg x (${na} - ${targetNaVal})`,
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
    
    const range = phosphateSeverity === "severe" 
      ? { min: 0.25, max: 0.5 }
      : { min: 0.08, max: 0.16 };
    
    let doseMin = w * range.min;
    let doseMax = w * range.max;
    let isMaxed = false;
    
    if (doseMax > maxDose) {
      doseMax = maxDose;
      doseMin = Math.min(doseMin, maxDose);
      isMaxed = true;
    }
    
    const drugVolumeMin = doseMin / 2;
    const drugVolumeMax = doseMax / 2;
    
    // Peripheral dilution (0.05 mmol/ml)
    const totalVolumeMin = doseMin / 0.05;
    const totalVolumeMax = doseMax / 0.05;
    const diluentMin = totalVolumeMin - drugVolumeMin;
    const diluentMax = totalVolumeMax - drugVolumeMax;
    
    setResults({
      medication: "Addiphos (Phosphate)",
      calculation: {
        dose: `${doseMin.toFixed(2)} - ${doseMax.toFixed(2)} mmol${isMaxed ? ' (MAX)' : ''}`,
        formula: `${w} kg x ${range.min}-${range.max} mmol/kg (${phosphateSeverity})`,
        drugVolume: `${drugVolumeMin.toFixed(2)} - ${drugVolumeMax.toFixed(2)} ml`,
        diluent: `${diluentMin.toFixed(0)} - ${diluentMax.toFixed(0)} ml NS (Peripheral 0.05 mmol/ml)`,
        totalVolume: `${totalVolumeMin.toFixed(0)} - ${totalVolumeMax.toFixed(0)} ml`
      },
      administration: {
        duration: "4-6 hours (slow)",
        rate: `${(totalVolumeMin/6).toFixed(1)} - ${(totalVolumeMax/4).toFixed(1)} ml/hr`
      },
      preparation: `${drugVolumeMax.toFixed(2)} ml Addiphos + ${diluentMax.toFixed(0)} ml NS = ${totalVolumeMax.toFixed(0)} ml`,
      warnings: ["Rapid infusion can cause severe hypocalcemia!"],
      ...(isMaxed && { warning: "Dose capped at maximum (15 mmol)" })
    });
  };

  const currentElectrolyte = electrolytes[selectedElectrolyte];

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
                <SelectItem value="potassium">Potassium</SelectItem>
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

          {/* Electrolyte-specific inputs */}
          {selectedElectrolyte === "calcium" && (
            <div>
              <Label>Current Calcium Level (optional)</Label>
              <Input type="number" step="0.1" min="0" placeholder="mg/dL" value={calciumLevel} onChange={(e) => setCalciumLevel(e.target.value)} className="font-mono" />
            </div>
          )}

          {selectedElectrolyte === "magnesium" && (
            <div>
              <Label>Current Magnesium Level (optional)</Label>
              <Input type="number" step="0.1" min="0" placeholder="mg/dL" value={magnesiumLevel} onChange={(e) => setMagnesiumLevel(e.target.value)} className="font-mono" />
            </div>
          )}

          {selectedElectrolyte === "potassium" && (
            <div>
              <Label>Current Potassium Level (optional)</Label>
              <Input type="number" step="0.1" min="0" placeholder="mEq/L" value={potassiumLevel} onChange={(e) => setPotassiumLevel(e.target.value)} className="font-mono" />
            </div>
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
                </div>
                <div>
                  <Label>Base Excess</Label>
                  <Input type="number" step="0.1" placeholder="e.g., -10" value={baseExcess} onChange={(e) => setBaseExcess(e.target.value)} className="font-mono" disabled={nahco3Method === "hco3"} />
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
                </div>
                <div>
                  <Label>Target Na (mEq/L)</Label>
                  <Input type="number" min="0" placeholder="140" value={targetNa} onChange={(e) => setTargetNa(e.target.value)} className="font-mono" />
                </div>
              </div>
            </>
          )}

          {selectedElectrolyte === "phosphate" && (
            <>
              <div>
                <Label>Phosphate Level (optional)</Label>
                <Input type="number" step="0.1" min="0" placeholder="mg/dL" value={phosphateLevel} onChange={(e) => setPhosphateLevel(e.target.value)} className="font-mono" />
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
