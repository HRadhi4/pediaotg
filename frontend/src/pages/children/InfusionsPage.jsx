/**
 * IV Infusions Calculator Page
 * 
 * Calculates weight-based infusion rates for common pediatric drugs:
 * - Dopamine, Dobutamine, Epinephrine, Norepinephrine, Milrinone
 * 
 * Features:
 * - Inotrope dilution calculator based on mg/kg in 50ml protocol
 * - Line type selection (Peripheral vs Central)
 * - Dose range limits per drug
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
  
  const w = parseFloat(weight) || 0;

  // Inotrope definitions with dilution protocols
  // Base: mg/kg in 50 ml NS or Dextrose
  const inotropes = {
    epinephrine: {
      name: "Epinephrine",
      minDose: 0.05,
      maxDose: 1, // User specified max 1 mcg/kg/min
      unit: "mcg/kg/min",
      peripheral: {
        concentrations: [0.15, 0.3],
        labels: ["0.15 conc", "0.3 conc"]
      },
      central: {
        concentration: 0.6,
        label: "0.6 conc"
      },
      dilution: "0.3 mg/kg in 50 ml", // 0.3 mg = 300 mcg, so 6 mcg/ml = 0.6 conc
      note: "Low dose: β-effect (inotropic), High dose: α-effect (vasopressor)"
    },
    norepinephrine: {
      name: "Norepinephrine",
      minDose: 0.05,
      maxDose: 1, // User specified max 1 mcg/kg/min
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
      maxDose: 20, // User specified max 20 mcg/kg/min
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
      maxDose: 20, // User specified max 20 mcg/kg/min
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

  // Calculate dilution and rate
  const calculateInfusion = () => {
    if (!w || !currentDose) return null;

    // Determine which concentration to use based on line type
    let concentration;
    let concentrationLabel;
    
    if (lineType === "central") {
      concentration = currentDrug.central.concentration;
      concentrationLabel = currentDrug.central.label;
    } else {
      // For peripheral, use the concentration that gives reasonable flow rate
      // Flow rate = dose * multiplier where multiplier = 60 / concentration
      const concentrations = currentDrug.peripheral.concentrations;
      const labels = currentDrug.peripheral.labels;
      
      // Use lowest concentration for low doses, higher for high doses
      if (selectedDrug === "epinephrine" || selectedDrug === "norepinephrine") {
        concentration = currentDose <= 0.3 ? concentrations[0] : concentrations[1];
        concentrationLabel = currentDose <= 0.3 ? labels[0] : labels[1];
      } else {
        // For dopamine/dobutamine
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
    let mgPerKg;
    if (selectedDrug === "epinephrine" || selectedDrug === "norepinephrine") {
      // For epi/norepi: concentration 0.6 = 0.3 mg/kg in 50ml
      mgPerKg = concentration * 0.5; // 0.6 conc = 0.3 mg/kg, 0.3 conc = 0.15 mg/kg, 0.15 conc = 0.075 mg/kg
    } else {
      // For dopamine/dobutamine: concentration 15 = 15 mg/kg in 50ml
      mgPerKg = concentration; // Direct relationship
    }

    const totalMg = mgPerKg * w;
    
    // Flow rate calculation: ml/hr = dose * (60 / concentration)
    // For 1 ml/hr at certain dose: dose * (60 / concentration) = 1
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

  // Other infusion categories (non-inotropes)
  const otherInfusions = [
    {
      category: "Neuromuscular Blockade",
      color: "purple",
      drugs: [
        {
          name: "Cisatracurium (Nimbex)",
          stat: { dose: "0.1-0.2 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.2).toFixed(2)} mg` : null },
          infusion: { dose: "1-4 mcg/kg/min", calc: w ? `${(w * 1).toFixed(0)} - ${(w * 4).toFixed(0)} mcg/min` : null }
        }
      ]
    },
    {
      category: "Sedatives",
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
              type="number"
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
                  type="number"
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
                  {[0.5, 1, 2, 3, 4, 5].filter(d => d <= currentDrug.maxDose && d >= currentDrug.minDose).slice(0, 4).map(d => (
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
