import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Droplets, AlertCircle } from "lucide-react";

const BloodProductsDialog = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("prbc");
  const [weight, setWeight] = useState("");
  const [results, setResults] = useState(null);

  // Coagulation states
  const [ptType, setPtType] = useState("infant");
  const [fibrinogen, setFibrinogen] = useState("");
  const [platelets, setPlatelets] = useState("");

  const calculatePRBC = () => {
    const w = parseFloat(weight);
    if (!w) {
      setResults({ error: "Please enter weight" });
      return;
    }

    // 15 ml/kg, max 1 unit (280 ml)
    const dose = w * 15;
    const maxDose = 280;
    const actualDose = Math.min(dose, maxDose);

    setResults({
      type: "prbc",
      dose: `${actualDose.toFixed(0)} ml`,
      calculation: `${w} kg × 15 ml/kg = ${dose.toFixed(0)} ml`,
      capped: dose > maxDose,
      duration: "3-4 hours",
      maxDose: "1 unit (280 ml)",
      indication: "Low Hemoglobin",
      notes: [
        "10-15 ml/kg raises Hb by approximately 2-3 g/dL",
        "Max: 1 unit (280 ml)",
        "Use leukocyte-reduced, irradiated blood for neonates"
      ]
    });
  };

  const calculateVitaminK = () => {
    const w = parseFloat(weight);
    if (!w) {
      setResults({ error: "Please enter weight" });
      return;
    }

    const isInfant = ptType === "infant";
    
    setResults({
      type: "vitk",
      dose: isInfant ? "1-2 mg" : "2.5-10 mg",
      route: "OD IV",
      indication: "Prolonged PT",
      notes: [
        isInfant ? "Infant/Child: 1-2 mg/dose OD IV" : "Adolescent: 2.5-10 mg per dose IV",
        "Effect seen in 6-8 hours",
        "May need to repeat if still prolonged"
      ]
    });
  };

  const calculateFFP = () => {
    const w = parseFloat(weight);
    if (!w) {
      setResults({ error: "Please enter weight" });
      return;
    }

    let dose, units;
    if (w <= 20) {
      dose = `${(w * 10).toFixed(0)} ml`;
      units = "10 ml/kg";
    } else if (w <= 35) {
      dose = "200 ml (1 unit)";
      units = "1 unit";
    } else if (w <= 40) {
      dose = "2 units";
      units = "2 units";
    } else {
      dose = "3 units";
      units = "3 units";
    }

    setResults({
      type: "ffp",
      dose,
      units,
      duration: "Over 30 mins",
      indication: "Prolonged aPTT",
      notes: [
        "Should not be given prophylactically in non-bleeding children with minor abnormalities",
        "Up to 20 kg: 10 ml/kg over 30 mins",
        "20-35 kg: 200 ml (1 unit)",
        "30-40 kg: 2 units",
        ">40 kg: 3 units"
      ]
    });
  };

  const calculateCryo = () => {
    const w = parseFloat(weight);
    const fib = parseFloat(fibrinogen);
    
    if (!w) {
      setResults({ error: "Please enter weight" });
      return;
    }

    const dose = w * 5;
    const maxUnits = 4;
    const unitsNeeded = Math.min(Math.ceil(dose / 25), maxUnits);

    setResults({
      type: "cryo",
      dose: `${dose.toFixed(0)} ml`,
      units: `${unitsNeeded} units (each unit = 25 ml)`,
      duration: "Over 30 mins",
      indication: "Low Fibrinogen (usually < 125 mg/dL)",
      fibLevel: fib ? `Current: ${fib} mg/dL` : null,
      notes: [
        "5 ml/kg over 30 mins",
        "Max: 4 units (each unit 25 ml = 100 ml total)",
        "Contains fibrinogen, Factor VIII, Factor XIII, vWF"
      ]
    });
  };

  const calculatePlatelets = () => {
    const w = parseFloat(weight);
    const plt = parseFloat(platelets);
    
    if (!w) {
      setResults({ error: "Please enter weight" });
      return;
    }

    const dose = w * 10;
    const maxDose = 300;

    setResults({
      type: "plt",
      dose: `${Math.min(dose, maxDose).toFixed(0)} ml`,
      duration: "Over 30 mins",
      indication: "Low Platelets (< 30,000 in asymptomatic patients)",
      pltLevel: plt ? `Current: ${plt.toLocaleString()}/µL` : null,
      notes: [
        "In asymptomatic patients (no bleeding): consider transfusion if < 30,000",
        "10 ml/kg over 30 mins",
        "Max: 1 unit (300 ml)",
        "Expected rise: 50,000-100,000/µL per unit"
      ]
    });
  };

  const reset = () => {
    setWeight("");
    setFibrinogen("");
    setPlatelets("");
    setResults(null);
  };

  const renderResults = () => {
    if (!results) return null;
    if (results.error) {
      return (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 rounded-2xl">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{results.error}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-[#00d9c5]/30 bg-[#00d9c5]/5 rounded-2xl">
        <CardContent className="pt-6 space-y-4">
          <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
            <p className="text-sm text-muted-foreground">Recommended Dose</p>
            <p className="text-3xl font-mono font-bold text-[#00d9c5]">
              {results.dose}
            </p>
            {results.units && <p className="text-sm text-muted-foreground">{results.units}</p>}
          </div>

          {results.calculation && (
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
              <p className="text-sm font-mono text-muted-foreground">{results.calculation}</p>
              {results.capped && (
                <p className="text-xs text-amber-600 mt-1">Capped at max dose</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-lg font-medium">{results.duration}</p>
            </div>
            {results.maxDose && (
              <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
                <p className="text-xs text-muted-foreground">Max Dose</p>
                <p className="text-lg font-medium">{results.maxDose}</p>
              </div>
            )}
          </div>

          {(results.fibLevel || results.pltLevel) && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
              <p className="text-sm font-medium text-amber-700">{results.fibLevel || results.pltLevel}</p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Indication</p>
            <p className="text-sm text-blue-600">{results.indication}</p>
          </div>

          {results.notes?.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Notes:</p>
              {results.notes.map((note, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {note}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Droplets className="h-5 w-5 text-red-500" />
            Blood Products Calculator
          </DialogTitle>
        </DialogHeader>

        {/* Common Weight Input */}
        <Card className="nightingale-card">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 10"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="nightingale-input font-mono"
                data-testid="bp-weight"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setResults(null); }} className="w-full">
          <TabsList className="grid grid-cols-5 h-auto">
            <TabsTrigger value="prbc" className="text-xs py-2">PRBC</TabsTrigger>
            <TabsTrigger value="vitk" className="text-xs py-2">Vit K</TabsTrigger>
            <TabsTrigger value="ffp" className="text-xs py-2">FFP</TabsTrigger>
            <TabsTrigger value="cryo" className="text-xs py-2">Cryo</TabsTrigger>
            <TabsTrigger value="plt" className="text-xs py-2">Platelets</TabsTrigger>
          </TabsList>

          <TabsContent value="prbc" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Packed Red Blood Cells</CardTitle>
                <CardDescription>Blood transfusion for low hemoglobin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Patient Category Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Patient Category</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={patientCategory === "stable" ? "default" : "outline"}
                      onClick={() => setPatientCategory("stable")}
                      className="text-xs py-2 h-auto flex flex-col items-center"
                      data-testid="prbc-cat-stable"
                    >
                      <span>Stable</span>
                      <span className="text-[10px] opacity-70">Hb ≤7</span>
                    </Button>
                    <Button
                      type="button"
                      variant={patientCategory === "symptomatic" ? "default" : "outline"}
                      onClick={() => setPatientCategory("symptomatic")}
                      className="text-xs py-2 h-auto flex flex-col items-center"
                      data-testid="prbc-cat-symptomatic"
                    >
                      <span>Symptomatic</span>
                      <span className="text-[10px] opacity-70">Hb ≤8</span>
                    </Button>
                    <Button
                      type="button"
                      variant={patientCategory === "critical" ? "default" : "outline"}
                      onClick={() => setPatientCategory("critical")}
                      className="text-xs py-2 h-auto flex flex-col items-center"
                      data-testid="prbc-cat-critical"
                    >
                      <span>Critical/ICU</span>
                      <span className="text-[10px] opacity-70">Hb ≤10</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {PRBC_THRESHOLDS[patientCategory].description}
                  </p>
                </div>

                {/* Hemoglobin Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Current Hb (g/dL)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 6.5"
                      value={currentHb}
                      onChange={(e) => setCurrentHb(e.target.value)}
                      className="nightingale-input font-mono"
                      data-testid="prbc-current-hb"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Target Hb (g/dL)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 10"
                      value={targetHb}
                      onChange={(e) => setTargetHb(e.target.value)}
                      className="nightingale-input font-mono"
                      data-testid="prbc-target-hb"
                    />
                  </div>
                </div>

                <Button onClick={calculatePRBC} className="w-full nightingale-btn-primary" data-testid="prbc-calculate">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate PRBC Dose
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitk" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Vitamin K</CardTitle>
                <CardDescription>For prolonged PT</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Patient Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={ptType === "infant" ? "default" : "outline"}
                      onClick={() => setPtType("infant")}
                      className="flex-1 rounded-xl"
                    >
                      Infant/Child
                    </Button>
                    <Button
                      variant={ptType === "adolescent" ? "default" : "outline"}
                      onClick={() => setPtType("adolescent")}
                      className="flex-1 rounded-xl"
                    >
                      Adolescent
                    </Button>
                  </div>
                </div>
                <Button onClick={calculateVitaminK} className="w-full nightingale-btn-primary">
                  Calculate Vitamin K
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ffp" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Fresh Frozen Plasma</CardTitle>
                <CardDescription>For prolonged aPTT</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={calculateFFP} className="w-full nightingale-btn-primary">
                  Calculate FFP
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cryo" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cryoprecipitate</CardTitle>
                <CardDescription>For low fibrinogen (&lt;125 mg/dL)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Current Fibrinogen (mg/dL) - optional</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    value={fibrinogen}
                    onChange={(e) => setFibrinogen(e.target.value)}
                    className="nightingale-input font-mono"
                  />
                </div>
                <Button onClick={calculateCryo} className="w-full nightingale-btn-primary">
                  Calculate Cryoprecipitate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plt" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Platelet Transfusion</CardTitle>
                <CardDescription>For low platelets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Current Platelets (/µL) - optional</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 25000"
                    value={platelets}
                    onChange={(e) => setPlatelets(e.target.value)}
                    className="nightingale-input font-mono"
                  />
                </div>
                <Button onClick={calculatePlatelets} className="w-full nightingale-btn-primary">
                  Calculate Platelets
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button variant="outline" onClick={reset} className="w-full rounded-2xl">
          Reset
        </Button>

        {renderResults()}
      </DialogContent>
    </Dialog>
  );
};

export default BloodProductsDialog;
