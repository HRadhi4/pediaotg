import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, Droplets, Zap, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const GIRDialog = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("calculate");
  const [weight, setWeight] = useState("");
  const [results, setResults] = useState(null);

  // Multiple fluid sources for GIR calculation
  const [fluidSources, setFluidSources] = useState([
    { id: 1, type: "d10", concentration: 10, volume: "", enabled: true }
  ]);
  
  // Formula feed
  const [includeFormula, setIncludeFormula] = useState(false);
  const [formulaVolume, setFormulaVolume] = useState("");
  const [formulaCalories, setFormulaCalories] = useState("20"); // kcal/oz or per 100ml

  // Target GIR calculation
  const [targetGIR, setTargetGIR] = useState("");
  const [targetFluidSources, setTargetFluidSources] = useState([
    { id: 1, type: "d10", concentration: 10, enabled: true }
  ]);

  const dextroseOptions = [
    { type: "d5", label: "D5%", concentration: 5 },
    { type: "d10", label: "D10%", concentration: 10 },
    { type: "d12.5", label: "D12.5%", concentration: 12.5 },
    { type: "d15", label: "D15%", concentration: 15 },
    { type: "d20", label: "D20%", concentration: 20 },
    { type: "d50", label: "D50%", concentration: 50 }
  ];

  const addFluidSource = () => {
    const newId = Math.max(...fluidSources.map(f => f.id), 0) + 1;
    setFluidSources([...fluidSources, { id: newId, type: "d10", concentration: 10, volume: "", enabled: true }]);
  };

  const removeFluidSource = (id) => {
    if (fluidSources.length > 1) {
      setFluidSources(fluidSources.filter(f => f.id !== id));
    }
  };

  const updateFluidSource = (id, field, value) => {
    setFluidSources(fluidSources.map(f => {
      if (f.id === id) {
        if (field === "type") {
          const option = dextroseOptions.find(o => o.type === value);
          return { ...f, type: value, concentration: option?.concentration || 10 };
        }
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  const toggleTargetFluidSource = (type) => {
    const exists = targetFluidSources.find(f => f.type === type);
    if (exists) {
      if (targetFluidSources.length > 1) {
        setTargetFluidSources(targetFluidSources.filter(f => f.type !== type));
      }
    } else {
      const option = dextroseOptions.find(o => o.type === type);
      setTargetFluidSources([...targetFluidSources, { id: Date.now(), type, concentration: option.concentration, enabled: true }]);
    }
  };

  const calculateGIR = () => {
    const w = parseFloat(weight);
    if (!w) {
      setResults({ error: "Please enter weight" });
      return;
    }

    let totalGlucoseMg = 0;
    let totalVolume = 0;
    const breakdown = [];

    // Calculate from each fluid source
    fluidSources.forEach(source => {
      const vol = parseFloat(source.volume) || 0;
      if (vol > 0) {
        // Volume is ml/kg/day, concentration is g/100ml
        const volumePerDay = vol * w; // ml/day
        const glucoseGrams = volumePerDay * (source.concentration / 100);
        const glucoseMg = glucoseGrams * 1000;
        totalGlucoseMg += glucoseMg;
        totalVolume += volumePerDay;
        
        const option = dextroseOptions.find(o => o.type === source.type);
        breakdown.push({
          label: option?.label || source.type,
          volume: vol,
          volumeTotal: volumePerDay.toFixed(1),
          glucoseG: glucoseGrams.toFixed(2),
          glucoseMg: glucoseMg.toFixed(0)
        });
      }
    });

    // Add formula feed if included
    if (includeFormula && formulaVolume) {
      const formulaVol = parseFloat(formulaVolume) || 0;
      if (formulaVol > 0) {
        const formulaPerDay = formulaVol * w; // ml/day
        // Formula typically has ~7g carbs per 100ml for standard 20kcal/oz formula
        const carbsPercent = parseFloat(formulaCalories) === 24 ? 8.5 : 7; // rough estimate
        const glucoseGrams = formulaPerDay * (carbsPercent / 100);
        const glucoseMg = glucoseGrams * 1000;
        totalGlucoseMg += glucoseMg;
        totalVolume += formulaPerDay;
        
        breakdown.push({
          label: `Formula (${formulaCalories} kcal)`,
          volume: formulaVol,
          volumeTotal: formulaPerDay.toFixed(1),
          glucoseG: glucoseGrams.toFixed(2),
          glucoseMg: glucoseMg.toFixed(0),
          isFormula: true
        });
      }
    }

    if (totalVolume === 0) {
      setResults({ error: "Please enter at least one fluid volume" });
      return;
    }

    // GIR = mg/kg/min
    const girValue = totalGlucoseMg / w / 24 / 60;
    const hourlyRate = totalVolume / 24;
    const tfiTotal = totalVolume / w;

    setResults({
      type: "gir",
      gir: girValue.toFixed(2),
      totalGlucoseMg: totalGlucoseMg.toFixed(0),
      totalGlucoseG: (totalGlucoseMg / 1000).toFixed(2),
      totalVolume: totalVolume.toFixed(1),
      hourlyRate: hourlyRate.toFixed(1),
      tfiTotal: tfiTotal.toFixed(1),
      breakdown
    });
  };

  const calculateInfusionRate = () => {
    const w = parseFloat(weight);
    const gir = parseFloat(targetGIR);
    
    if (!w || !gir) {
      setResults({ error: "Please fill in weight and target GIR" });
      return;
    }

    if (targetFluidSources.length === 0) {
      setResults({ error: "Please select at least one dextrose concentration" });
      return;
    }

    // Calculate for each selected concentration
    const rates = targetFluidSources.map(source => {
      // Rate (ml/hr) = GIR (mg/kg/min) × 6 × weight (kg) ÷ dextrose %
      const rate = (gir * 6 * w) / source.concentration;
      const dailyVolume = rate * 24;
      const tfiCalc = dailyVolume / w;
      const option = dextroseOptions.find(o => o.type === source.type);
      
      return {
        label: option?.label || source.type,
        concentration: source.concentration,
        rate: rate.toFixed(2),
        dailyVolume: dailyVolume.toFixed(1),
        tfi: tfiCalc.toFixed(1)
      };
    });

    setResults({
      type: "rate",
      targetGIR: gir,
      rates
    });
  };

  const reset = () => {
    setWeight("");
    setFluidSources([{ id: 1, type: "d10", concentration: 10, volume: "", enabled: true }]);
    setIncludeFormula(false);
    setFormulaVolume("");
    setTargetGIR("");
    setTargetFluidSources([{ id: 1, type: "d10", concentration: 10, enabled: true }]);
    setResults(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#00d9c5]" />
            Glucose Infusion Rate (GIR)
          </DialogTitle>
        </DialogHeader>

        {/* Weight Input */}
        <Card className="nightingale-card">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g., 2.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="nightingale-input font-mono"
                data-testid="gir-weight"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setResults(null); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculate">Calculate GIR</TabsTrigger>
            <TabsTrigger value="rate">Target Rate</TabsTrigger>
          </TabsList>

          <TabsContent value="calculate" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Fluid Sources</CardTitle>
                <CardDescription>Add dextrose fluids (ml/kg/day)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {fluidSources.map((source, index) => (
                  <div key={source.id} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">{dextroseOptions.find(o => o.type === source.type)?.label || "Dextrose"}</Label>
                      <select
                        value={source.type}
                        onChange={(e) => updateFluidSource(source.id, "type", e.target.value)}
                        className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm"
                      >
                        {dextroseOptions.map(opt => (
                          <option key={opt.type} value={opt.type}>{opt.label} ({opt.concentration}g/100ml)</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Volume (ml/kg/day)</Label>
                      <Input
                        type="number"
                        step="1"
                        placeholder="e.g., 60"
                        value={source.volume}
                        onChange={(e) => updateFluidSource(source.id, "volume", e.target.value)}
                        className="nightingale-input font-mono h-10"
                      />
                    </div>
                    {fluidSources.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFluidSource(source.id)}
                        className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFluidSource}
                  className="w-full rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fluid Source
                </Button>
              </CardContent>
            </Card>

            {/* Formula Feed Option */}
            <Card className="nightingale-card">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="includeFormula"
                    checked={includeFormula}
                    onCheckedChange={setIncludeFormula}
                  />
                  <Label htmlFor="includeFormula" className="cursor-pointer font-medium">Include Formula Feed</Label>
                </div>
                {includeFormula && (
                  <div className="grid grid-cols-2 gap-3 pl-6">
                    <div className="space-y-1">
                      <Label className="text-xs">Volume (ml/kg/day)</Label>
                      <Input
                        type="number"
                        step="1"
                        placeholder="e.g., 30"
                        value={formulaVolume}
                        onChange={(e) => setFormulaVolume(e.target.value)}
                        className="nightingale-input font-mono h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Calories</Label>
                      <select
                        value={formulaCalories}
                        onChange={(e) => setFormulaCalories(e.target.value)}
                        className="w-full h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm"
                      >
                        <option value="20">20 kcal/oz</option>
                        <option value="24">24 kcal/oz</option>
                        <option value="27">27 kcal/oz</option>
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button onClick={calculateGIR} className="w-full nightingale-btn-primary">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate GIR
            </Button>
          </TabsContent>

          <TabsContent value="rate" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Target GIR</CardTitle>
                <CardDescription>Calculate infusion rates for target GIR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target GIR (mg/kg/min)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 6"
                    value={targetGIR}
                    onChange={(e) => setTargetGIR(e.target.value)}
                    className="nightingale-input font-mono"
                    data-testid="target-gir"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Select Dextrose Concentrations</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {dextroseOptions.map(opt => (
                      <button
                        key={opt.type}
                        onClick={() => toggleTargetFluidSource(opt.type)}
                        className={`p-2 rounded-xl text-sm font-medium transition-colors ${
                          targetFluidSources.some(f => f.type === opt.type)
                            ? 'bg-[#00d9c5] text-gray-900'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={calculateInfusionRate} className="w-full nightingale-btn-primary">
              <Droplets className="h-4 w-4 mr-2" />
              Calculate Rates
            </Button>
          </TabsContent>
        </Tabs>

        <Button variant="outline" onClick={reset} className="w-full rounded-2xl">
          Reset
        </Button>

        {/* Results */}
        {results && !results.error && (
          <Card className="border-[#00d9c5]/30 bg-[#00d9c5]/5 rounded-2xl">
            <CardContent className="pt-6 space-y-4">
              {results.type === "gir" && (
                <>
                  <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                    <p className="text-sm text-muted-foreground">Glucose Infusion Rate</p>
                    <p className="text-4xl font-mono font-bold text-[#00d9c5]" data-testid="gir-result">
                      {results.gir}
                    </p>
                    <p className="text-sm text-muted-foreground">mg/kg/min</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-800 border text-center">
                      <p className="text-xs text-muted-foreground">Total Volume</p>
                      <p className="text-sm font-mono font-bold">{results.totalVolume} ml/day</p>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-800 border text-center">
                      <p className="text-xs text-muted-foreground">Hourly Rate</p>
                      <p className="text-sm font-mono font-bold">{results.hourlyRate} ml/hr</p>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-800 border text-center">
                      <p className="text-xs text-muted-foreground">TFI</p>
                      <p className="text-sm font-mono font-bold">{results.tfiTotal} ml/kg/day</p>
                    </div>
                  </div>

                  {results.breakdown.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Breakdown:</p>
                        {results.breakdown.map((item, i) => (
                          <div key={i} className={`p-2 rounded-lg text-xs ${item.isFormula ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                            <div className="flex justify-between">
                              <span className="font-medium">{item.label}</span>
                              <span className="font-mono">{item.glucoseG}g glucose</span>
                            </div>
                            <div className="text-muted-foreground">
                              {item.volume} ml/kg/day = {item.volumeTotal} ml/day
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {results.type === "rate" && (
                <>
                  <div className="text-center p-3 rounded-xl bg-white dark:bg-gray-800">
                    <p className="text-sm text-muted-foreground">Target GIR: <span className="font-mono font-bold text-[#00d9c5]">{results.targetGIR}</span> mg/kg/min</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Required Infusion Rates:</p>
                    {results.rates.map((rate, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{rate.label}</span>
                          <span className="text-xl font-mono font-bold text-[#00d9c5]">{rate.rate} ml/hr</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Daily: {rate.dailyVolume} ml | TFI: {rate.tfi} ml/kg/day
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs text-muted-foreground">
                    Formula: Rate = GIR × 6 × Weight ÷ D%
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {results?.error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 rounded-2xl">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">{results.error}</p>
            </CardContent>
          </Card>
        )}

        {/* Reference */}
        <Card className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Reference</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Normal GIR: 4-6 mg/kg/min (neonates)</p>
            <p>• Hypoglycemia: May need 6-8 mg/kg/min</p>
            <p>• Max peripheral: ~12.5% dextrose</p>
            <p>• Central line needed for &gt;12.5%</p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default GIRDialog;
