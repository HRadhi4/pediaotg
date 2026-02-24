import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator, Droplets, Zap, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const GIRDialog = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("calculate");
  const [weight, setWeight] = useState("");
  const [results, setResults] = useState(null);

  // Multiple fluid sources for GIR calculation (volumes in ml/day)
  const [fluidSources, setFluidSources] = useState([
    { id: 1, type: "d10", concentration: 10, volume: "", enabled: true }
  ]);
  
  // Formula feed
  const [includeFormula, setIncludeFormula] = useState(false);
  const [formulaVolume, setFormulaVolume] = useState(""); // ml/day
  const [formulaCalories, setFormulaCalories] = useState("20");

  // Target GIR calculation
  const [targetGIR, setTargetGIR] = useState("");
  const [workingTFI, setWorkingTFI] = useState(""); // ml/day
  const [lineType, setLineType] = useState("peripheral");
  const [useCombinedDextrose, setUseCombinedDextrose] = useState(false);
  const [lowDextrose, setLowDextrose] = useState("d10");
  const [highDextrose, setHighDextrose] = useState("d50");

  const dextroseOptions = [
    { type: "d5", label: "D5%", concentration: 5 },
    { type: "d10", label: "D10%", concentration: 10 },
    { type: "d12.5", label: "D12.5%", concentration: 12.5 },
    { type: "d15", label: "D15%", concentration: 15 },
    { type: "d20", label: "D20%", concentration: 20 },
    { type: "d50", label: "D50%", concentration: 50 }
  ];

  const maxPeripheralConcentration = 12.5;

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

  const calculateGIR = () => {
    const w = parseFloat(weight);
    if (!w) {
      setResults({ error: "Please enter weight" });
      return;
    }

    let totalGlucoseMg = 0;
    let totalVolume = 0;
    const breakdown = [];

    // Calculate from each fluid source (volumes already in ml/day)
    fluidSources.forEach(source => {
      const volumePerDay = parseFloat(source.volume) || 0;
      if (volumePerDay > 0) {
        const glucoseGrams = volumePerDay * (source.concentration / 100);
        const glucoseMg = glucoseGrams * 1000;
        totalGlucoseMg += glucoseMg;
        totalVolume += volumePerDay;
        
        const option = dextroseOptions.find(o => o.type === source.type);
        breakdown.push({
          label: option?.label || source.type,
          volumePerDay: volumePerDay.toFixed(1),
          glucoseG: glucoseGrams.toFixed(2),
          glucoseMg: glucoseMg.toFixed(0)
        });
      }
    });

    // Add formula feed if included (volume in ml/day)
    if (includeFormula && formulaVolume) {
      const formulaPerDay = parseFloat(formulaVolume) || 0;
      if (formulaPerDay > 0) {
        const carbsPercent = parseFloat(formulaCalories) === 24 ? 8.5 : parseFloat(formulaCalories) === 27 ? 9.5 : 7;
        const glucoseGrams = formulaPerDay * (carbsPercent / 100);
        const glucoseMg = glucoseGrams * 1000;
        totalGlucoseMg += glucoseMg;
        totalVolume += formulaPerDay;
        
        breakdown.push({
          label: `Formula (${formulaCalories} kcal)`,
          volumePerDay: formulaPerDay.toFixed(1),
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
    const tfiPerKg = totalVolume / w;

    setResults({
      type: "gir",
      gir: girValue.toFixed(2),
      totalGlucoseMg: totalGlucoseMg.toFixed(0),
      totalGlucoseG: (totalGlucoseMg / 1000).toFixed(2),
      totalVolume: totalVolume.toFixed(1),
      hourlyRate: hourlyRate.toFixed(1),
      tfiPerKg: tfiPerKg.toFixed(1),
      breakdown
    });
  };

  const calculateFromTFI = () => {
    const w = parseFloat(weight);
    const gir = parseFloat(targetGIR);
    const totalFluidPerDay = parseFloat(workingTFI); // Already in ml/day
    
    if (!w || !gir || !totalFluidPerDay) {
      setResults({ error: "Please fill in weight, target GIR, and working TFI" });
      return;
    }

    const hourlyRate = totalFluidPerDay / 24;
    const tfiPerKg = totalFluidPerDay / w;

    // Calculate required glucose per day to achieve target GIR
    const requiredGlucoseMgPerDay = gir * w * 24 * 60;
    const requiredGlucoseGPerDay = requiredGlucoseMgPerDay / 1000;

    // Required concentration = (glucose g/day) / (volume ml/day) × 100
    const requiredConcentration = (requiredGlucoseGPerDay / totalFluidPerDay) * 100;

    // Filter options based on line type
    const maxConc = lineType === "peripheral" ? maxPeripheralConcentration : 100;
    const availableOptions = dextroseOptions.filter(o => o.concentration <= maxConc);

    let recommendation = null;
    let warning = null;
    let combinedMix = null;

    // If using combined dextrose, calculate the mix
    if (useCombinedDextrose) {
      const lowOpt = dextroseOptions.find(o => o.type === lowDextrose);
      const highOpt = dextroseOptions.find(o => o.type === highDextrose);
      
      if (lowOpt && highOpt && requiredConcentration >= lowOpt.concentration && requiredConcentration <= highOpt.concentration) {
        // Calculate mixing ratio using alligation method
        // Parts of high = (required - low)
        // Parts of low = (high - required)
        const partsHigh = requiredConcentration - lowOpt.concentration;
        const partsLow = highOpt.concentration - requiredConcentration;
        const totalParts = partsHigh + partsLow;
        
        const volumeHigh = (partsHigh / totalParts) * totalFluidPerDay;
        const volumeLow = (partsLow / totalParts) * totalFluidPerDay;
        
        // Verify the mix achieves target GIR
        const mixGlucose = (volumeLow * lowOpt.concentration / 100) + (volumeHigh * highOpt.concentration / 100);
        const mixGIR = (mixGlucose * 1000) / w / 24 / 60;
        
        combinedMix = {
          lowDextrose: lowOpt,
          highDextrose: highOpt,
          volumeLow: volumeLow.toFixed(1),
          volumeHigh: volumeHigh.toFixed(1),
          ratioLow: ((partsLow / totalParts) * 100).toFixed(0),
          ratioHigh: ((partsHigh / totalParts) * 100).toFixed(0),
          finalConcentration: requiredConcentration.toFixed(1),
          achievedGIR: mixGIR.toFixed(2)
        };

        // Check if mix exceeds peripheral limit
        if (lineType === "peripheral" && requiredConcentration > maxPeripheralConcentration) {
          warning = `Final concentration (${requiredConcentration.toFixed(1)}%) exceeds peripheral line limit (${maxPeripheralConcentration}%). Consider central line.`;
        }
      } else if (lowOpt && highOpt) {
        warning = `Required concentration (${requiredConcentration.toFixed(1)}%) is outside the range of ${lowOpt.label} to ${highOpt.label}. Adjust your selection.`;
      }
    }

    // Single concentration recommendation
    if (!useCombinedDextrose) {
      if (requiredConcentration <= maxConc) {
        const closest = availableOptions.reduce((prev, curr) => 
          Math.abs(curr.concentration - requiredConcentration) < Math.abs(prev.concentration - requiredConcentration) ? curr : prev
        );
        
        const actualGlucose = totalFluidPerDay * (closest.concentration / 100) * 1000;
        const actualGIR = actualGlucose / w / 24 / 60;

        recommendation = {
          concentration: closest,
          actualGIR: actualGIR.toFixed(2),
          close: Math.abs(actualGIR - gir) < 0.5
        };
      } else {
        warning = lineType === "peripheral" 
          ? `Required concentration (${requiredConcentration.toFixed(1)}%) exceeds peripheral line limit (${maxPeripheralConcentration}%). Consider central line or combined dextrose.`
          : `Required concentration (${requiredConcentration.toFixed(1)}%) is very high. Consider combined dextrose.`;
        
        const closest = availableOptions[availableOptions.length - 1];
        const actualGlucose = totalFluidPerDay * (closest.concentration / 100) * 1000;
        const actualGIR = actualGlucose / w / 24 / 60;
        recommendation = {
          concentration: closest,
          actualGIR: actualGIR.toFixed(2),
          close: false,
          maxAvailable: true
        };
      }
    }

    // Calculate all available options
    const allOptions = availableOptions.map(opt => {
      const glucose = totalFluidPerDay * (opt.concentration / 100) * 1000;
      const achievedGIR = glucose / w / 24 / 60;
      return {
        ...opt,
        gir: achievedGIR.toFixed(2),
        isTarget: Math.abs(achievedGIR - gir) < 0.3
      };
    });

    setResults({
      type: "tfi",
      targetGIR: gir,
      workingTFI: totalFluidPerDay,
      tfiPerKg: tfiPerKg.toFixed(1),
      hourlyRate: hourlyRate.toFixed(1),
      requiredConcentration: requiredConcentration.toFixed(1),
      recommendation,
      warning,
      combinedMix,
      allOptions,
      lineType,
      useCombinedDextrose
    });
  };

  const reset = () => {
    setWeight("");
    setFluidSources([{ id: 1, type: "d10", concentration: 10, volume: "", enabled: true }]);
    setIncludeFormula(false);
    setFormulaVolume("");
    setTargetGIR("");
    setWorkingTFI("");
    setUseCombinedDextrose(false);
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
                type="text"
                  inputMode="text"
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
                <CardDescription>Enter volumes in ml/day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {fluidSources.map((source) => (
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
                      <Label className="text-xs">Volume (ml/day)</Label>
                      <Input
                        type="text"
                  inputMode="text"
                        step="1"
                        placeholder="e.g., 150"
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
                      <Label className="text-xs">Volume (ml/day)</Label>
                      <Input
                        type="text"
                  inputMode="text"
                        step="1"
                        placeholder="e.g., 75"
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
                <CardTitle className="text-base">Find Dextrose Concentration</CardTitle>
                <CardDescription>Calculate required concentration from TFI and target GIR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Target GIR (mg/kg/min)</Label>
                    <Input
                      type="text"
                  inputMode="text"
                      step="0.1"
                      placeholder="e.g., 6"
                      value={targetGIR}
                      onChange={(e) => setTargetGIR(e.target.value)}
                      className="nightingale-input font-mono"
                      data-testid="target-gir"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Working TFI (ml/day)</Label>
                    <Input
                      type="text"
                  inputMode="text"
                      step="1"
                      placeholder="e.g., 200"
                      value={workingTFI}
                      onChange={(e) => setWorkingTFI(e.target.value)}
                      className="nightingale-input font-mono"
                      data-testid="working-tfi"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Line Type</Label>
                  <RadioGroup value={lineType} onValueChange={setLineType} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="peripheral" id="peripheral" />
                      <Label htmlFor="peripheral" className="cursor-pointer text-sm">Peripheral (max 12.5%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="central" id="central" />
                      <Label htmlFor="central" className="cursor-pointer text-sm">Central Line</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="useCombined"
                      checked={useCombinedDextrose}
                      onCheckedChange={setUseCombinedDextrose}
                    />
                    <Label htmlFor="useCombined" className="cursor-pointer font-medium">Use Combined Dextrose</Label>
                  </div>
                  
                  {useCombinedDextrose && (
                    <div className="grid grid-cols-2 gap-3 pl-6">
                      <div className="space-y-1">
                        <Label className="text-xs">Low Concentration</Label>
                        <select
                          value={lowDextrose}
                          onChange={(e) => setLowDextrose(e.target.value)}
                          className="w-full h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm"
                        >
                          {dextroseOptions.slice(0, 4).map(opt => (
                            <option key={opt.type} value={opt.type}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">High Concentration</Label>
                        <select
                          value={highDextrose}
                          onChange={(e) => setHighDextrose(e.target.value)}
                          className="w-full h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm"
                        >
                          {dextroseOptions.slice(2).map(opt => (
                            <option key={opt.type} value={opt.type}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button onClick={calculateFromTFI} className="w-full nightingale-btn-primary">
              <Droplets className="h-4 w-4 mr-2" />
              Find Concentration
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
                      <p className="text-sm font-mono font-bold">{results.tfiPerKg} ml/kg/day</p>
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
                              <span className="font-mono font-medium">{item.volumePerDay} ml/day</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {results.type === "tfi" && (
                <>
                  {results.warning && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700 dark:text-amber-300">{results.warning}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                      <p className="text-xs text-muted-foreground">Required Concentration</p>
                      <p className="text-2xl font-mono font-bold text-[#00d9c5]">{results.requiredConcentration}%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                      <p className="text-xs text-muted-foreground">Total Fluid</p>
                      <p className="text-lg font-mono font-bold">{results.workingTFI} ml/day</p>
                      <p className="text-xs text-muted-foreground">{results.hourlyRate} ml/hr | {results.tfiPerKg} ml/kg/day</p>
                    </div>
                  </div>

                  {/* Combined Dextrose Mix Result */}
                  {results.combinedMix && (
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 space-y-3">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">Combined Dextrose Mix</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 rounded-lg bg-white dark:bg-gray-800 text-center">
                          <p className="text-xs text-muted-foreground">{results.combinedMix.lowDextrose.label}</p>
                          <p className="text-lg font-mono font-bold">{results.combinedMix.volumeLow} ml</p>
                          <p className="text-xs text-muted-foreground">{results.combinedMix.ratioLow}%</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-gray-800 text-center">
                          <p className="text-xs text-muted-foreground">{results.combinedMix.highDextrose.label}</p>
                          <p className="text-lg font-mono font-bold">{results.combinedMix.volumeHigh} ml</p>
                          <p className="text-xs text-muted-foreground">{results.combinedMix.ratioHigh}%</p>
                        </div>
                      </div>
                      <div className="text-center pt-2 border-t border-green-200">
                        <p className="text-xs text-muted-foreground">Final Concentration: <span className="font-mono font-bold">{results.combinedMix.finalConcentration}%</span></p>
                        <p className="text-xs text-muted-foreground">Achieved GIR: <span className="font-mono font-bold text-[#00d9c5]">{results.combinedMix.achievedGIR} mg/kg/min</span></p>
                      </div>
                    </div>
                  )}

                  {/* Single Concentration Recommendation */}
                  {!results.useCombinedDextrose && results.recommendation && (
                    <div className={`p-3 rounded-xl border ${results.recommendation.close ? 'bg-green-50 dark:bg-green-950/30 border-green-200' : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200'}`}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Recommended</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">{results.recommendation.concentration.label}</span>
                        <span className="font-mono">GIR: {results.recommendation.actualGIR} mg/kg/min</span>
                      </div>
                      {results.recommendation.maxAvailable && (
                        <p className="text-xs text-amber-600 mt-1">Max available for {results.lineType} line</p>
                      )}
                    </div>
                  )}

                  {!results.useCombinedDextrose && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">All Options ({results.lineType === 'peripheral' ? 'Peripheral ≤12.5%' : 'Central Line'}):</p>
                      <div className="grid grid-cols-2 gap-2">
                        {results.allOptions.map((opt, i) => (
                          <div 
                            key={i} 
                            className={`p-2 rounded-lg text-sm ${opt.isTarget ? 'bg-[#00d9c5]/20 border-2 border-[#00d9c5]' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">{opt.label}</span>
                              <span className="font-mono text-xs">GIR: {opt.gir}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
            <p>• Peripheral line max: 10-12.5% dextrose</p>
            <p>• Central line needed for &gt;12.5%</p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default GIRDialog;
