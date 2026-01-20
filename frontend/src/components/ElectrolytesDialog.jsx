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
      doseRange: "0.5-1 mEq/kg/dose (Max 40 mEq)",
      doseMin: 0.5,
      doseMax: 1,
      maxAbsolute: 40,
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
      doseRange: "1-2 mEq/kg (acute)",
      doseMin: 1,
      doseMax: 2,
      maxAbsolute: 50,
      unit: "mEq/kg",
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

  const calculateNaHCO3 = () => {
    let correction = currentDose;
    const dosePerKg = (correction / w).toFixed(2);
    const drugVolume = correction;
    const diluentVolume = correction;
    const totalVolume = drugVolume + diluentVolume;
    
    setResults({
      medication: "Sodium Bicarbonate 8.4%",
      calculation: {
        dose: `${correction.toFixed(1)} mEq (${dosePerKg} mEq/kg)`,
        formula: `Selected: ${dosePerKg} mEq/kg x ${w} kg`,
        drugVolume: `${drugVolume.toFixed(1)} ml`,
        diluent: `${diluentVolume.toFixed(1)} ml NS (1:1 dilution)`,
        totalVolume: `${totalVolume.toFixed(1)} ml`
      },
      administration: { duration: "30 min - 1 hour", rate: `${totalVolume.toFixed(1)} ml/hr` },
      preparation: `Draw ${drugVolume.toFixed(1)} ml NaHCO3 + ${diluentVolume.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      notes: "Give in 2 halves: 1st half in 1hr, 2nd half over 24hr",
      warnings: ["Correct calcium FIRST if hypocalcemic"]
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
                <SelectItem value="potassium">Potassium</SelectItem>
                <SelectItem value="nahco3">Sodium Bicarbonate (NaHCO3)</SelectItem>
                <SelectItem value="sodium">Sodium</SelectItem>
                <SelectItem value="phosphate">Phosphate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dose Range Display */}
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              Dose Range: <span className="text-green-600 dark:text-green-400">{currentElectrolyte.doseRange}</span>
            </p>
          </div>

          {/* Dose Input with Slider */}
          {w > 0 && (
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
