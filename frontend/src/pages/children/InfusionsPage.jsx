/**
 * IV Infusions Calculator Page
 * 
 * Calculates weight-based infusion rates for common pediatric drugs:
 * - Inotropes: Dopamine, Dobutamine, Epinephrine, Norepinephrine
 * - Neuromuscular Blockade: Cisatracurium (Nimbex)
 * - Sedatives: Midazolam, Fentanyl, Morphine
 * - CNS: Phenobarbital, Phenytoin, Keppra, Lidocaine
 * 
 * All calculations in mcg/kg/min where applicable
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InfusionsPage = ({ onBack }) => {
  const [weight, setWeight] = useState("");
  const [selectedDrug, setSelectedDrug] = useState("epinephrine");
  const [lineType, setLineType] = useState("peripheral");
  const [dose, setDose] = useState("");
  const [cisatracuriumDose, setCisatracuriumDose] = useState("3");
  
  const w = parseFloat(weight) || 0;

  // Inotrope definitions with dilution protocols
  // Base: mg/kg in 50 ml NS or Dextrose
  const inotropes = {
    epinephrine: {
      name: "Epinephrine",
      minDose: 0.05,
      maxDose: 1, // mcg/kg/min
      unit: "mcg/kg/min",
      peripheral: {
        concentrations: [0.15, 0.3],
        labels: ["0.15 conc", "0.3 conc"]
      },
      central: {
        concentration: 0.6,
        label: "0.6 conc"
      },
      dilution: "0.3 mg/kg in 50 ml",
      note: "Low dose: β-effect (inotropic), High dose: α-effect (vasopressor)"
    },
    norepinephrine: {
      name: "Norepinephrine",
      minDose: 0.05,
      maxDose: 1, // mcg/kg/min
      unit: "mcg/kg/min",
      peripheral: {
        concentrations: [0.15, 0.3],
        labels: ["0.15 conc", "0.3 conc"]
      },
      central: {
        concentration: 0.6,
        label: "0.6 conc"
      },
      dilution: "0.3 mg/kg in 50 ml",
      note: "Potent vasopressor, minimal β-effect"
    },
    dopamine: {
      name: "Dopamine",
      minDose: 1,
      maxDose: 20, // mcg/kg/min
      unit: "mcg/kg/min",
      peripheral: {
        concentrations: [1.5, 3, 6],
        labels: ["1.5 conc", "3 conc", "6 conc"]
      },
      central: {
        concentration: 15,
        label: "15 conc"
      },
      dilution: "15 mg/kg in 50 ml",
      note: "Low (2-5): renal, Med (5-10): cardiac, High (10-20): vasopressor"
    },
    dobutamine: {
      name: "Dobutamine",
      minDose: 1,
      maxDose: 20, // mcg/kg/min
      unit: "mcg/kg/min",
      peripheral: {
        concentrations: [1.5, 3, 6],
        labels: ["1.5 conc", "3 conc", "6 conc"]
      },
      central: {
        concentration: 15,
        label: "15 conc"
      },
      dilution: "15 mg/kg in 50 ml",
      note: "Inotrope, minimal vasopressor effect"
    }
  };

  const currentDrug = inotropes[selectedDrug];
  const currentDose = parseFloat(dose) || currentDrug.minDose;

  // Calculate dilution and rate for inotropes
  const calculateInfusion = () => {
    if (!w || !currentDose) return null;

    let concentration;
    let concentrationLabel;
    
    if (lineType === "central") {
      concentration = currentDrug.central.concentration;
      concentrationLabel = currentDrug.central.label;
    } else {
      const concentrations = currentDrug.peripheral.concentrations;
      const labels = currentDrug.peripheral.labels;
      
      if (selectedDrug === "epinephrine" || selectedDrug === "norepinephrine") {
        concentration = currentDose <= 0.3 ? concentrations[0] : concentrations[1];
        concentrationLabel = currentDose <= 0.3 ? labels[0] : labels[1];
      } else {
        if (currentDose <= 5) {
          concentration = concentrations[0];
          concentrationLabel = labels[0];
        } else if (currentDose <= 10) {
          concentration = concentrations[1];
          concentrationLabel = labels[1];
        } else {
          concentration = concentrations[2];
          concentrationLabel = labels[2];
        }
      }
    }

    // Calculate mg/kg to add to 50ml
    // For epi/norepi: concentration factor = mg/kg directly
    // e.g., 0.3 concentration means add 0.3 mg/kg to 50ml
    let mgPerKg;
    if (selectedDrug === "epinephrine" || selectedDrug === "norepinephrine") {
      mgPerKg = concentration;
    } else {
      mgPerKg = concentration;
    }

    const totalMg = mgPerKg * w;
    
    // Flow rate: ml/hr = dose (mcg/kg/min) * (60 / concentration)
    const flowRate = currentDose * (60 / concentration);

    return {
      drug: currentDrug.name,
      dose: currentDose,
      concentration,
      concentrationLabel,
      mgPerKg,
      totalMg,
      flowRate,
      dilutionVolume: 50
    };
  };

  const result = calculateInfusion();

  // Cisatracurium Calculator
  // Dilution: 10ml (20mg) + 40ml diluent = 50ml total
  // Concentration: 20mg/50ml = 0.4mg/ml = 400 mcg/ml
  const calculateCisatracurium = () => {
    if (!w) return null;
    
    const doseVal = parseFloat(cisatracuriumDose) || 3; // mcg/kg/min
    const concentration = 400; // mcg/ml (20mg in 50ml)
    
    // Flow rate calculation: (dose mcg/kg/min × weight × 60 min) / concentration mcg/ml
    // Simplified: (dose × weight × 60) / 400 = ml/hr
    const flowRate = (doseVal * w * 60) / concentration;
    
    // Stat dose (0.1-0.2 mg/kg)
    const statDoseLow = w * 0.1;
    const statDoseHigh = w * 0.2;
    
    return {
      doseVal,
      flowRate,
      statDoseLow,
      statDoseHigh,
      drugVolume: 10, // ml of Nimbex (20mg)
      diluentVolume: 40, // ml of NS/D5W
      totalVolume: 50,
      concentration: 400 // mcg/ml
    };
  };
  
  const cisResult = calculateCisatracurium();

  // CNS Drug Dilutions
  const cnsDrugs = [
    {
      name: "Fentanyl Infusion",
      dilution: "1:1 (100mcg in 8ml → 10mcg = 1ml)",
      note: "Can be prepared neat if fluid restriction",
      compatibility: "NS, D5W, D10W",
      incompatible: "Azithromycin, phenytoin",
      doseRange: "1-5 mcg/kg/hr",
      calc: w ? `${(w * 1).toFixed(1)} - ${(w * 5).toFixed(1)} mcg/hr` : null
    },
    {
      name: "Midazolam",
      dilution: "1:1 (15mg/3ml in 12ml → 1mg = 1ml)",
      note: "Can be prepared neat if fluid restriction",
      compatibility: "NS, D5W, sterile water",
      incompatible: "Albumin, furosemide, NaHCO3, ampicillin, cefepime, ceftazidime",
      doseRange: "0.1-0.5 mg/kg/hr",
      calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.5).toFixed(2)} mg/hr` : null
    },
    {
      name: "Morphine",
      dilution: "1mg/kg in 50ml → 20mcg/kg/hr = 1ml/hr",
      note: "Weight-based preparation",
      compatibility: "NS, D5W, D10W",
      incompatible: "Phenytoin, pentobarbital, azithromycin, cefepime",
      doseRange: "10-40 mcg/kg/hr",
      calc: w ? `20mcg/kg/hr = 1ml/hr → ${(w * 0.02).toFixed(2)}mg/hr` : null,
      prepCalc: w ? `Add ${(w * 1).toFixed(1)} mg morphine to 50ml` : null
    },
    {
      name: "Lidocaine 2% (Anticonvulsant)",
      dilution: "0.5ml (10mg) in 9.5ml → 1mg/ml",
      note: "Final concentration 1mg/ml",
      compatibility: "NS, D5W, D10W",
      incompatible: "Phenytoin",
      doseRange: "Load: 1mg/kg, Maint: 20-50 mcg/kg/min",
      calc: w ? `Load: ${w.toFixed(1)}mg | Maint: ${(w * 20).toFixed(0)}-${(w * 50).toFixed(0)} mcg/min` : null
    },
    {
      name: "Phenobarbital",
      dilution: "Final concentration 10mg/ml",
      note: "Administer over 20 mins",
      compatibility: "NS, D5W, D10W",
      incompatible: "Insulin, hydralazine, vancomycin, amphotericin",
      doseRange: "Load: 20mg/kg, Maint: 3-5mg/kg/day",
      calc: w ? `Load: ${(w * 20).toFixed(0)}mg over 20min` : null
    },
    {
      name: "Phenytoin",
      dilution: "1-10 mg/ml (NS only)",
      note: "Max rate 1mg/kg/min (Max 50mg/min)",
      compatibility: "NS ONLY",
      incompatible: "Dobutamine, insulin, NaHCO3, KCl, propofol, fentanyl, heparin, lidocaine, morphine, vitamin K",
      doseRange: "Load: 15-20mg/kg",
      calc: w ? `Load: ${(w * 15).toFixed(0)}-${(w * 20).toFixed(0)}mg at max ${Math.min(w, 50).toFixed(0)}mg/min` : null
    },
    {
      name: "Keppra (Levetiracetam)",
      dilution: "500mg in 100ml over 15-30 mins",
      note: "No available incompatibility data",
      compatibility: "NS, D5W, RL",
      incompatible: "No available data",
      doseRange: "Load: 20-60mg/kg (Max 4g)",
      calc: w ? `Load: ${Math.min(w * 20, 4000).toFixed(0)}-${Math.min(w * 60, 4000).toFixed(0)}mg` : null
    }
  ];

  // Other simple infusions
  const otherInfusions = [
    {
      category: "Sedatives (Quick Reference)",
      color: "blue",
      drugs: [
        {
          name: "Midazolam",
          stat: { dose: "0.1 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} mg` : null },
          infusion: { dose: "0.1-0.5 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.5).toFixed(2)} mg/hr` : null }
        },
        {
          name: "Fentanyl",
          stat: { dose: "1 mcg/kg", calc: w ? `${(w * 1).toFixed(1)} mcg` : null },
          infusion: { dose: "1-5 mcg/kg/hr", calc: w ? `${(w * 1).toFixed(1)} - ${(w * 5).toFixed(1)} mcg/hr` : null }
        }
      ]
    },
    {
      category: "Diuretics",
      color: "teal",
      drugs: [
        {
          name: "Furosemide (Lasix)",
          stat: { dose: "0.5-1 mg/kg (Max 40mg)", calc: w ? `${Math.min(w * 0.5, 40).toFixed(1)} - ${Math.min(w * 1, 40).toFixed(1)} mg` : null },
          infusion: { dose: "0.1-1 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 1).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Bronchodilator",
      color: "amber",
      drugs: [
        {
          name: "Ventolin Infusion",
          stat: null,
          infusion: { dose: "0.3 mg/kg/hr", calc: w ? `${(w * 0.3).toFixed(2)} mg/hr` : null }
        }
      ]
    }
  ];

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Weight Input */}
      <Card className="nightingale-card">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="text"
                  inputMode="decimal"
              min="0"
              step="0.1"
              placeholder="Enter weight for calculations"
              value={weight}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || parseFloat(val) >= 0) setWeight(val);
              }}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inotrope Calculator */}
      <Card className="nightingale-card border-red-200 dark:border-red-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-700 dark:text-red-400">Inotropic Support Calculator</CardTitle>
          <p className="text-xs text-muted-foreground">Dilution: mg/kg in 50 ml NS or Dextrose</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drug Selection */}
          <div className="space-y-2">
            <Label className="text-xs">Select Drug</Label>
            <Select value={selectedDrug} onValueChange={(v) => { setSelectedDrug(v); setDose(""); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="epinephrine">Epinephrine</SelectItem>
                <SelectItem value="norepinephrine">Norepinephrine</SelectItem>
                <SelectItem value="dopamine">Dopamine</SelectItem>
                <SelectItem value="dobutamine">Dobutamine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Line Type Selection */}
          <div className="space-y-2">
            <Label className="text-xs">Line Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLineType("peripheral")}
                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                  lineType === "peripheral"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-red-50"
                }`}
              >
                Peripheral
              </button>
              <button
                onClick={() => setLineType("central")}
                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                  lineType === "central"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-red-50"
                }`}
              >
                Central
              </button>
            </div>
          </div>

          {/* Dose Input */}
          {w > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Dose ({currentDrug.unit})</Label>
                <span className="text-xs text-muted-foreground">
                  Range: {currentDrug.minDose} - {currentDrug.maxDose}
                </span>
              </div>
              <Slider
                value={[currentDose]}
                onValueChange={(v) => setDose(v[0].toString())}
                min={currentDrug.minDose}
                max={currentDrug.maxDose}
                step={selectedDrug === "epinephrine" || selectedDrug === "norepinephrine" ? 0.05 : 1}
                className="py-2"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  inputMode="decimal"
                  min={currentDrug.minDose}
                  max={currentDrug.maxDose}
                  step={selectedDrug === "epinephrine" || selectedDrug === "norepinephrine" ? 0.05 : 1}
                  value={dose || currentDrug.minDose}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val >= 0 && val <= currentDrug.maxDose) {
                      setDose(e.target.value);
                    }
                  }}
                  className="font-mono h-9 w-24"
                />
                <span className="text-sm text-muted-foreground">{currentDrug.unit}</span>
              </div>
            </div>
          )}

          {/* Results */}
          {result && w > 0 && (
            <div className="space-y-3 mt-4">
              {/* Dilution Instructions */}
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200">
                <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2">Dilution ({result.concentrationLabel})</p>
                <p className="font-mono text-sm">
                  <strong>{result.totalMg.toFixed(2)} mg</strong> ({result.mgPerKg.toFixed(2)} mg/kg) in <strong>50 ml</strong> NS/D5W
                </p>
              </div>

              {/* Flow Rate */}
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">For {result.dose} {currentDrug.unit}</p>
                <p className="font-mono text-lg font-bold text-green-800 dark:text-green-200">
                  {result.flowRate.toFixed(1)} ml/hr
                </p>
              </div>

              {/* Quick Reference Table */}
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border">
                <p className="text-xs font-semibold mb-2">Quick Reference (ml/hr)</p>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  {(selectedDrug === "epinephrine" || selectedDrug === "norepinephrine" 
                    ? [0.1, 0.2, 0.5, 1] 
                    : [5, 10, 15, 20]
                  ).map(d => (
                    <div key={d} className="text-center p-1 bg-white dark:bg-gray-900 rounded">
                      <div className="text-muted-foreground">{d}</div>
                      <div className="font-mono font-bold">{(d * 60 / result.concentration).toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <p className="text-xs text-muted-foreground italic">{currentDrug.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cisatracurium (Nimbex) Calculator */}
      <Card className="nightingale-card border-purple-200 dark:border-purple-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-700 dark:text-purple-400">Neuromuscular Blockade</CardTitle>
          <p className="text-xs text-muted-foreground">Cisatracurium (Nimbex)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dilution Info */}
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">Infusion Preparation</p>
            <p className="text-xs">
              <strong>10 ml</strong> Nimbex (20 mg) + <strong>40 ml</strong> NS/D5W = <strong>50 ml</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Concentration: 400 mcg/ml (0.4 mg/ml)
            </p>
          </div>

          {/* Stat Dose */}
          {w > 0 && cisResult && (
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border">
              <p className="text-xs font-semibold mb-1">Stat Dose (0.1-0.2 mg/kg)</p>
              <p className="font-mono text-sm text-purple-600">
                {cisResult.statDoseLow.toFixed(2)} - {cisResult.statDoseHigh.toFixed(2)} mg
              </p>
            </div>
          )}

          {/* Dose Selector */}
          {w > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Infusion Dose (mcg/kg/min)</Label>
                <span className="text-xs text-muted-foreground">Range: 1-7</span>
              </div>
              <Slider
                value={[parseFloat(cisatracuriumDose) || 3]}
                onValueChange={(v) => setCisatracuriumDose(v[0].toString())}
                min={1}
                max={7}
                step={1}
                className="py-2"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  inputMode="decimal"
                  min={1}
                  max={7}
                  step={1}
                  value={cisatracuriumDose}
                  onChange={(e) => setCisatracuriumDose(e.target.value)}
                  className="font-mono h-9 w-20"
                />
                <span className="text-sm text-muted-foreground">mcg/kg/min</span>
              </div>
            </div>
          )}

          {/* Result */}
          {w > 0 && cisResult && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
              <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">
                For {cisResult.doseVal} mcg/kg/min
              </p>
              <p className="font-mono text-lg font-bold text-green-800 dark:text-green-200">
                {cisResult.flowRate.toFixed(1)} ml/hr
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                = ({cisResult.doseVal} × {w} × 60) / 400
              </p>
            </div>
          )}

          {/* Quick Reference Table */}
          {w > 0 && (
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border">
              <p className="text-xs font-semibold mb-2">Quick Reference: Dose (mcg/kg/min) → Rate (ml/hr)</p>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                  <div key={d} className="text-center p-1 bg-white dark:bg-gray-900 rounded">
                    <div className="text-muted-foreground font-bold">{d}</div>
                    <div className="font-mono text-purple-600">{((d * w * 60) / 400).toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CNS Drugs Section */}
      <Card className="nightingale-card border-blue-200 dark:border-blue-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-700 dark:text-blue-400">CNS Drugs - Dilution & Compatibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cnsDrugs.map((drug, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
              <p className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-2">{drug.name}</p>
              
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-muted-foreground">Dilution: </span>
                  <span className="font-mono">{drug.dilution}</span>
                </div>
                
                {drug.prepCalc && (
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <span className="font-mono text-blue-700 dark:text-blue-300">{drug.prepCalc}</span>
                  </div>
                )}
                
                <div>
                  <span className="text-muted-foreground">Dose: </span>
                  <span>{drug.doseRange}</span>
                  {drug.calc && <span className="font-mono text-green-600 ml-2">→ {drug.calc}</span>}
                </div>
                
                <div>
                  <span className="text-muted-foreground">Compatible: </span>
                  <span className="text-green-600">{drug.compatibility}</span>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Incompatible: </span>
                  <span className="text-red-500 text-[10px]">{drug.incompatible}</span>
                </div>
                
                {drug.note && (
                  <p className="text-[10px] text-amber-600 italic">{drug.note}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Other Infusion Categories */}
      {otherInfusions.map((cat, idx) => (
        <Card key={idx} className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{cat.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cat.drugs.map((drug, dIdx) => (
              <div key={dIdx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="font-semibold text-sm mb-2">{drug.name}</p>
                <div className="space-y-1">
                  {drug.stat && (
                    <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                      <span className="text-muted-foreground">Stat: {drug.stat.dose}</span>
                      {drug.stat.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">→ {drug.stat.calc}</span>}
                    </div>
                  )}
                  {drug.infusion && (
                    <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                      <span className="text-muted-foreground">Infusion: {drug.infusion.dose}</span>
                      {drug.infusion.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">→ {drug.infusion.calc}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InfusionsPage;
