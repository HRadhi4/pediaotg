import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, AlertCircle, Pill } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ElectrolytesDialog = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("calcium");
  const [weight, setWeight] = useState("");
  const [patientType, setPatientType] = useState("nicu");
  const [results, setResults] = useState(null);

  // Specific state for each calculator
  const [calciumLevel, setCalciumLevel] = useState("");
  const [phosphateLevel, setPhosphateLevel] = useState("");
  const [magnesiumLevel, setMagnesiumLevel] = useState("");
  const [potassiumLevel, setPotassiumLevel] = useState("");
  const [hco3Level, setHco3Level] = useState("");
  const [baseExcess, setBaseExcess] = useState("");
  const [feedVolume, setFeedVolume] = useState("");

  const calculateCalcium = () => {
    const w = parseFloat(weight);
    if (!w) return;
    
    const dose = Math.min(w * 1, 10); // 1 ml/kg, max 10ml
    setResults({
      title: "Calcium Gluconate 10% IV",
      dose: `${dose.toFixed(1)} ml`,
      frequency: calciumLevel && parseFloat(calciumLevel) < 7 ? "BD" : "OD",
      notes: [
        "For all ages",
        "Keep OD or BD according to level and need",
        "Maximum: 10 ml"
      ]
    });
  };

  const calculateResonium = () => {
    const w = parseFloat(weight);
    if (!w) return;
    
    const minDose = w * 0.5;
    const maxDose = w * 1;
    setResults({
      title: "Resonium (Phosphate Binder)",
      dose: `${minDose.toFixed(1)} - ${maxDose.toFixed(1)} g`,
      route: "PO/PR",
      notes: [
        "Phosphate binder",
        "0.5 - 1 g/kg"
      ]
    });
  };

  const calculateMagnesium = () => {
    const w = parseFloat(weight);
    if (!w) return;
    
    if (patientType === "nicu") {
      const minDose = w * 0.1;
      const maxDose = w * 0.2;
      setResults({
        title: "Magnesium (NICU - Hypomagnesemia)",
        dose: `${minDose.toFixed(2)} - ${maxDose.toFixed(2)} ml`,
        frequency: "BD for 3 doses",
        notes: [
          "0.1-0.2 ml/kg BD for 3 doses"
        ]
      });
    } else {
      const minDose = w * 25;
      const maxDose = w * 50;
      const dilution = maxDose / 60;
      setResults({
        title: "Magnesium (General Ward - Hypomagnesemia)",
        dose: `50% MgSulphate: ${minDose.toFixed(0)} - ${maxDose.toFixed(0)} mg`,
        frequency: "BD for 3 doses",
        notes: [
          "25-50 mg/kg BD for 3 doses",
          `Dilution: Divide dose by 60 = ${dilution.toFixed(2)} ml`,
          "For Status Asthmaticus: Same dose over 20-30 mins"
        ]
      });
    }
  };

  const calculatePotassium = () => {
    const w = parseFloat(weight);
    if (!w) return;
    
    const ivMax = 6; // mEq
    const poMin = w * 0.5;
    const poMax = Math.min(w * 1, 20);
    const bolusMin = w * 0.5;
    const bolusMax = w * 1;
    
    setResults({
      title: "Potassium (Hypokalemia)",
      sections: [
        {
          subtitle: "IV",
          value: `Max ${ivMax} mEq`
        },
        {
          subtitle: "PO (KCl)",
          value: `${poMin.toFixed(1)} - ${poMax.toFixed(1)} mEq (0.5-1 mEq/kg, Max 20)`
        },
        {
          subtitle: "Bolus",
          value: `${bolusMin.toFixed(1)} - ${bolusMax.toFixed(1)} ml (0.5-1 ml/kg)`
        }
      ],
      notes: [
        "Can be given BD",
        "Dilution - ask ICU",
        "NICU: For every 25 ml D10%, give 1 mEq KCl (in fluid/24 hrs)"
      ]
    });
  };

  const calculateNaHCO3 = () => {
    const w = parseFloat(weight);
    const hco3 = parseFloat(hco3Level);
    const be = parseFloat(baseExcess);
    
    if (!w) return;
    
    const resultData = {
      title: "NaHCO3 Correction",
      sections: [],
      notes: [
        "Normal HCO3 range: 18-22 mEq/L",
        "Correct when:",
        "  • HCO3 < 12 (must correct)",
        "  • Symptomatic: non-responsive hypotension to inotropes",
        "  • Rapid shallow breath (Kussmaul)",
        "  • CNS/GI irritation",
        "  • Drop from baseline (e.g., Bartter syndrome)"
      ],
      warnings: [
        "Give in 2 halves: 1st half in first hour, 2nd half over 24 hours",
        "In chronic acidotic disease with hypocalcemia: correct calcium FIRST",
        "Rapid correction mobilizes ionized calcium → cardiac arrest risk"
      ]
    };
    
    // Method 1: Using HCO3
    if (!isNaN(hco3)) {
      const desiredHCO3 = 20; // Target
      const correction1 = (desiredHCO3 - hco3) * 0.3 * w;
      resultData.sections.push({
        subtitle: "Method 1 (using HCO3)",
        value: `(${desiredHCO3} - ${hco3}) × 0.3 × ${w} = ${correction1.toFixed(1)} mEq`,
        detail: `First half: ${(correction1/2).toFixed(1)} mEq (1st hour), Second half: ${(correction1/2).toFixed(1)} mEq (next 24h)`
      });
    }
    
    // Method 2: Using BE
    if (!isNaN(be)) {
      const correction2 = Math.abs(be) * 0.3 * w;
      resultData.sections.push({
        subtitle: "Method 2 (using Base Excess)",
        value: `|${be}| × 0.3 × ${w} = ${correction2.toFixed(1)} mEq`,
        detail: `First half: ${(correction2/2).toFixed(1)} mEq (1st hour), Second half: ${(correction2/2).toFixed(1)} mEq (next 24h)`
      });
    }
    
    // Infusion rate
    resultData.sections.push({
      subtitle: "Persistent Low HCO3 - Infusion",
      value: `${(w * 0.25).toFixed(2)} - ${(w * 2).toFixed(1)} mEq/hr (0.25-2 mEq/kg/hr)`
    });
    
    // Oral
    resultData.sections.push({
      subtitle: "Oral NaHCO3",
      value: "600 mg tablet = 7 mEq"
    });
    
    setResults(resultData);
  };

  const calculatePhosphate = () => {
    const w = parseFloat(weight);
    const feed = parseFloat(feedVolume);
    
    if (!w) return;
    
    const resultData = {
      title: "Phosphate Replacement",
      sections: [],
      notes: [
        "Keep phosphate ≥2 in Neonate"
      ]
    };
    
    // Addphos
    if (patientType === "nicu") {
      resultData.sections.push({
        subtitle: "Addphos (Neonate)",
        value: `${(w * 1).toFixed(1)} mmol (1 mmol/kg)`
      });
    }
    
    // Phosphate Sandose
    const minDose = w * 30;
    const maxDose = w * 70;
    const minMl = minDose / 25; // 250mg/10ml = 25mg/ml
    const maxMl = maxDose / 25;
    
    resultData.sections.push({
      subtitle: "Phosphate Sandose",
      value: `${minDose.toFixed(0)} - ${maxDose.toFixed(0)} mg (30-70 mg/kg)`,
      detail: `Volume: ${minMl.toFixed(1)} - ${maxMl.toFixed(1)} ml (concentration: 250mg/10ml)`
    });
    
    if (feed && !isNaN(feed)) {
      resultData.sections.push({
        subtitle: "Divided over feeds",
        value: `Divide ${maxMl.toFixed(1)} ml over ${feed} ml feeds`
      });
    }
    
    setResults(resultData);
  };

  const calculateDrugInfusion = (drug) => {
    const w = parseFloat(weight);
    if (!w) return;
    
    const drugs = {
      mgso4: {
        title: "MgSO4 50%",
        dose: `${(w * 25).toFixed(0)} - ${(w * 50).toFixed(0)} mg`,
        available: "1ml = 2mmol, 1ml = 500mg, 1ml = 4mEq",
        dilution: "60 mg/ml",
        duration: "2-4 Hours",
        incompatible: "Salicylates, Dobutamine, SodaBicarb, Clindamycin, Amphotericin B, Cefipime, Ketamine"
      },
      addiphos: {
        title: "Addiphos",
        sections: [
          { subtitle: "Infant/Children (<25kg)", value: `${(w * 0.5).toFixed(2)} - ${(w * 1.5).toFixed(2)} mmol/kg/day (1ml = 2mmol)` },
          { subtitle: "Children (25-45kg)", value: "0.5-1.0 mmol/kg/day" },
          { subtitle: "Adult (>45kg)", value: "50-70 mmol/day" }
        ],
        peripheral: "0.05 mmol/1ml",
        central: "0.12 mmol/1ml",
        duration: "6 Hours",
        incompatible: "Calcium Salts"
      },
      calciumGluconate: {
        title: "Calcium Gluconate",
        dose: `${(w * 100).toFixed(0)} mg (100 mg/kg/dose, Max 3g)`,
        available: "100 mg/ml, 0.45 mEq/1ml",
        dilution: "50 mg/1ml (1:2)",
        duration: "1 Hour",
        incompatible: "Dobutamine, Methylprednisolone, SodaBicarb"
      },
      calciumChloride: {
        title: "Calcium Chloride",
        dose: `${(w * 10).toFixed(0)} mg (10 mg/kg/dose)`,
        available: "100 mg/1ml, 1.4 mEq/1ml",
        dilution: "20 mg/1ml",
        duration: "1 Hour",
        incompatible: "Phosphates, SodiumBicarb, Sulphates, Amphotericin B"
      },
      kcl: {
        title: "KCL",
        dose: `${(w * 0.5).toFixed(2)} - ${(w * 1).toFixed(2)} mEq/kg/dose`,
        available: "1ml = 2mEq OR 1ml = 1.34 mEq",
        peripheral: "80 mEq/L",
        central: "15 mEq/100ml",
        fluidRestriction: "20 mEq/100ml",
        duration: "1-2 Hours",
        incompatible: "Amphotericin B, Midazolam, Diazepam, Mannitol, Phenobarbitone, Phenytion"
      },
      sodaBicarb: {
        title: "SodaBicarb",
        dose: `${(w * 1).toFixed(1)} - ${(w * 2).toFixed(1)} mEq/kg/dose`,
        available: "1 mEq/1ml",
        dilution: "1:1 (1 mEq/1ml)",
        duration: "30min-1 Hour",
        incompatible: "Calcium Salts, Dobutamine, Epinephrine, Norepinephrine, Scoline, Sulphates, Insulin, Labetalol"
      }
    };
    
    if (drugs[drug]) {
      setResults(drugs[drug]);
    }
  };

  const renderResults = () => {
    if (!results) return null;
    
    return (
      <Card className="mt-4 border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            {results.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {results.dose && (
            <div className="p-3 rounded-lg bg-background border">
              <p className="text-sm text-muted-foreground">Dose</p>
              <p className="text-xl font-mono font-bold text-primary">{results.dose}</p>
              {results.frequency && <p className="text-sm">Frequency: {results.frequency}</p>}
              {results.route && <p className="text-sm">Route: {results.route}</p>}
              {results.duration && <p className="text-sm">Duration: {results.duration}</p>}
            </div>
          )}
          
          {results.available && (
            <div className="text-sm"><strong>Available:</strong> {results.available}</div>
          )}
          {results.dilution && (
            <div className="text-sm"><strong>Dilution:</strong> {results.dilution}</div>
          )}
          {results.peripheral && (
            <div className="text-sm"><strong>Peripheral:</strong> {results.peripheral}</div>
          )}
          {results.central && (
            <div className="text-sm"><strong>Central:</strong> {results.central}</div>
          )}
          
          {results.sections?.map((section, i) => (
            <div key={i} className="p-3 rounded-lg bg-background border">
              <p className="text-sm text-muted-foreground">{section.subtitle}</p>
              <p className="text-lg font-mono font-bold">{section.value}</p>
              {section.detail && <p className="text-sm text-muted-foreground mt-1">{section.detail}</p>}
            </div>
          ))}
          
          {results.notes?.length > 0 && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Notes</p>
              <ul className="text-sm space-y-1">
                {results.notes.map((note, i) => (
                  <li key={i} className="text-blue-600 dark:text-blue-400">{note}</li>
                ))}
              </ul>
            </div>
          )}
          
          {results.warnings?.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> Warnings
              </p>
              <ul className="text-sm space-y-1">
                {results.warnings.map((warn, i) => (
                  <li key={i} className="text-amber-600 dark:text-amber-400">{warn}</li>
                ))}
              </ul>
            </div>
          )}
          
          {results.incompatible && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">Incompatible with:</p>
              <p className="text-sm text-red-600 dark:text-red-400">{results.incompatible}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Electrolytes Calculator
          </DialogTitle>
        </DialogHeader>

        {/* Common Inputs */}
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 3.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="font-mono"
                  data-testid="electrolyte-weight"
                />
              </div>
              <div className="space-y-2">
                <Label>Patient Type</Label>
                <Select value={patientType} onValueChange={setPatientType}>
                  <SelectTrigger data-testid="patient-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nicu">NICU</SelectItem>
                    <SelectItem value="pediatric">General Ward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setResults(null); }} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="calcium" className="text-xs py-2">Calcium</TabsTrigger>
            <TabsTrigger value="magnesium" className="text-xs py-2">Magnesium</TabsTrigger>
            <TabsTrigger value="potassium" className="text-xs py-2">Potassium</TabsTrigger>
            <TabsTrigger value="nahco3" className="text-xs py-2">NaHCO3</TabsTrigger>
            <TabsTrigger value="phosphate" className="text-xs py-2">Phosphate</TabsTrigger>
            <TabsTrigger value="drugs" className="text-xs py-2">Infusions</TabsTrigger>
          </TabsList>

          <TabsContent value="calcium" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Calcium Gluconate 10%</CardTitle>
                <CardDescription>Hypocalcemia correction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Current Calcium Level (optional)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="mg/dL"
                    value={calciumLevel}
                    onChange={(e) => setCalciumLevel(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <Button onClick={calculateCalcium} className="w-full">Calculate Calcium</Button>
                <Separator />
                <Button onClick={calculateResonium} variant="outline" className="w-full">Calculate Resonium (Phosphate Binder)</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="magnesium" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Magnesium Replacement</CardTitle>
                <CardDescription>Hypomagnesemia / Status Asthmaticus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Current Mg Level (optional)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="mg/dL"
                    value={magnesiumLevel}
                    onChange={(e) => setMagnesiumLevel(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <Button onClick={calculateMagnesium} className="w-full">Calculate Magnesium</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="potassium" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Potassium Replacement</CardTitle>
                <CardDescription>Hypokalemia correction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Current K Level (optional)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="mEq/L"
                    value={potassiumLevel}
                    onChange={(e) => setPotassiumLevel(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <Button onClick={calculatePotassium} className="w-full">Calculate Potassium</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nahco3" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">NaHCO3 (Sodium Bicarbonate)</CardTitle>
                <CardDescription>Metabolic acidosis correction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Current HCO3</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="mEq/L"
                      value={hco3Level}
                      onChange={(e) => setHco3Level(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Base Excess (BE)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., -10"
                      value={baseExcess}
                      onChange={(e) => setBaseExcess(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
                <Button onClick={calculateNaHCO3} className="w-full">Calculate NaHCO3</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phosphate" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Phosphate Replacement</CardTitle>
                <CardDescription>Hypophosphatemia correction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Current Phosphate Level</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="mg/dL"
                      value={phosphateLevel}
                      onChange={(e) => setPhosphateLevel(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Feed Volume (ml)</Label>
                    <Input
                      type="number"
                      placeholder="For division"
                      value={feedVolume}
                      onChange={(e) => setFeedVolume(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
                <Button onClick={calculatePhosphate} className="w-full">Calculate Phosphate</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drugs" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Drug Infusions Reference</CardTitle>
                <CardDescription>Quick reference for dilutions and incompatibilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => calculateDrugInfusion('mgso4')}>MgSO4</Button>
                  <Button variant="outline" size="sm" onClick={() => calculateDrugInfusion('addiphos')}>Addiphos</Button>
                  <Button variant="outline" size="sm" onClick={() => calculateDrugInfusion('calciumGluconate')}>Ca Gluconate</Button>
                  <Button variant="outline" size="sm" onClick={() => calculateDrugInfusion('calciumChloride')}>Ca Chloride</Button>
                  <Button variant="outline" size="sm" onClick={() => calculateDrugInfusion('kcl')}>KCL</Button>
                  <Button variant="outline" size="sm" onClick={() => calculateDrugInfusion('sodaBicarb')}>SodaBicarb</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {renderResults()}
      </DialogContent>
    </Dialog>
  );
};

export default ElectrolytesDialog;
