import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Droplets, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const GIRDialog = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("calculate");
  const [weight, setWeight] = useState("");
  const [tfi, setTfi] = useState("");
  const [dextroseConc, setDextroseConc] = useState("10");
  const [targetGIR, setTargetGIR] = useState("");
  const [results, setResults] = useState(null);

  const calculateGIR = () => {
    const w = parseFloat(weight);
    const tfiVal = parseFloat(tfi);
    const dex = parseFloat(dextroseConc);
    
    if (!w || !tfiVal || !dex) {
      setResults({ error: "Please fill in all fields" });
      return;
    }

    // TFI is in ml/kg/day, calculate total fluid per day
    const totalFluidPerDay = tfiVal * w; // ml/day
    
    // Glucose concentration: D10% = 10g/100ml = 0.1g/ml
    const glucoseGramsPerMl = dex / 100;
    
    // Total glucose per day in grams
    const glucoseGramsPerDay = totalFluidPerDay * glucoseGramsPerMl;
    
    // Convert to mg
    const glucoseMgPerDay = glucoseGramsPerDay * 1000;
    
    // GIR = mg/kg/min
    const girValue = glucoseMgPerDay / w / 24 / 60;
    
    // Hourly rate
    const hourlyRate = totalFluidPerDay / 24;

    setResults({
      type: "gir",
      totalFluid: totalFluidPerDay.toFixed(1),
      glucoseGrams: glucoseGramsPerDay.toFixed(2),
      glucoseMg: glucoseMgPerDay.toFixed(0),
      gir: girValue.toFixed(2),
      hourlyRate: hourlyRate.toFixed(1),
      steps: [
        `Total Fluid/day = TFI × Weight = ${tfiVal} × ${w} = ${totalFluidPerDay.toFixed(1)} ml/day`,
        `Glucose (g) = Fluid × D${dex}%/100 = ${totalFluidPerDay.toFixed(1)} × ${glucoseGramsPerMl} = ${glucoseGramsPerDay.toFixed(2)} g`,
        `Glucose (mg) = ${glucoseGramsPerDay.toFixed(2)} × 1000 = ${glucoseMgPerDay.toFixed(0)} mg`,
        `GIR = ${glucoseMgPerDay.toFixed(0)} mg ÷ ${w} kg ÷ 24 hr ÷ 60 min = ${girValue.toFixed(2)} mg/kg/min`
      ]
    });
  };

  const calculateInfusionRate = () => {
    const w = parseFloat(weight);
    const gir = parseFloat(targetGIR);
    const dex = parseFloat(dextroseConc);
    
    if (!w || !gir || !dex) {
      setResults({ error: "Please fill in all fields" });
      return;
    }

    // Rate (ml/hr) = GIR (mg/kg/min) × 6 × weight (kg) ÷ dextrose %
    const rate = (gir * 6 * w) / dex;
    
    // Daily volume
    const dailyVolume = rate * 24;
    const tfiCalculated = dailyVolume / w;

    setResults({
      type: "rate",
      infusionRate: rate.toFixed(2),
      dailyVolume: dailyVolume.toFixed(1),
      tfiCalculated: tfiCalculated.toFixed(1),
      formula: `Rate = GIR × 6 × Weight ÷ D% = ${gir} × 6 × ${w} ÷ ${dex} = ${rate.toFixed(2)} ml/hr`
    });
  };

  const reset = () => {
    setWeight("");
    setTfi("");
    setTargetGIR("");
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

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setResults(null); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculate">Calculate GIR</TabsTrigger>
            <TabsTrigger value="rate">Target Rate</TabsTrigger>
          </TabsList>

          <TabsContent value="calculate" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Calculate GIR from TFI</CardTitle>
                <CardDescription>Find the glucose infusion rate from your fluid settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label>TFI (ml/kg/day)</Label>
                    <Input
                      type="number"
                      step="1"
                      placeholder="e.g., 60"
                      value={tfi}
                      onChange={(e) => setTfi(e.target.value)}
                      className="nightingale-input font-mono"
                      data-testid="gir-tfi"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dextrose Concentration</Label>
                  <Select value={dextroseConc} onValueChange={setDextroseConc}>
                    <SelectTrigger className="nightingale-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">D5% (5 g/100ml)</SelectItem>
                      <SelectItem value="10">D10% (10 g/100ml)</SelectItem>
                      <SelectItem value="12.5">D12.5% (12.5 g/100ml)</SelectItem>
                      <SelectItem value="15">D15% (15 g/100ml)</SelectItem>
                      <SelectItem value="20">D20% (20 g/100ml)</SelectItem>
                      <SelectItem value="50">D50% (50 g/100ml)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={calculateGIR} className="w-full nightingale-btn-primary">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate GIR
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rate" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Calculate Infusion Rate</CardTitle>
                <CardDescription>Find the infusion rate for a target GIR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 2.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="nightingale-input font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target GIR (mg/kg/min)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 4"
                      value={targetGIR}
                      onChange={(e) => setTargetGIR(e.target.value)}
                      className="nightingale-input font-mono"
                      data-testid="target-gir"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dextrose Concentration</Label>
                  <Select value={dextroseConc} onValueChange={setDextroseConc}>
                    <SelectTrigger className="nightingale-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">D5%</SelectItem>
                      <SelectItem value="10">D10%</SelectItem>
                      <SelectItem value="12.5">D12.5%</SelectItem>
                      <SelectItem value="15">D15%</SelectItem>
                      <SelectItem value="20">D20%</SelectItem>
                      <SelectItem value="50">D50%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={calculateInfusionRate} className="w-full nightingale-btn-primary">
                  <Droplets className="h-4 w-4 mr-2" />
                  Calculate Rate
                </Button>
              </CardContent>
            </Card>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
                      <p className="text-xs text-muted-foreground">Hourly Rate</p>
                      <p className="text-lg font-mono font-bold">{results.hourlyRate} ml/hr</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
                      <p className="text-xs text-muted-foreground">Glucose/day</p>
                      <p className="text-lg font-mono font-bold">{results.glucoseGrams} g</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Calculation Steps:</p>
                    {results.steps.map((step, i) => (
                      <p key={i} className="text-xs font-mono text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                        {i + 1}. {step}
                      </p>
                    ))}
                  </div>
                </>
              )}

              {results.type === "rate" && (
                <>
                  <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                    <p className="text-sm text-muted-foreground">Required Infusion Rate</p>
                    <p className="text-4xl font-mono font-bold text-[#00d9c5]" data-testid="rate-result">
                      {results.infusionRate}
                    </p>
                    <p className="text-sm text-muted-foreground">ml/hr</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
                      <p className="text-xs text-muted-foreground">Daily Volume</p>
                      <p className="text-lg font-mono font-bold">{results.dailyVolume} ml</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
                      <p className="text-xs text-muted-foreground">Equivalent TFI</p>
                      <p className="text-lg font-mono font-bold">{results.tfiCalculated} ml/kg/day</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs font-mono text-muted-foreground">{results.formula}</p>
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

        {/* Reference Info */}
        <Card className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Reference</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Normal GIR: 4-6 mg/kg/min (neonates)</p>
            <p>• Hypoglycemia: May need 6-8 mg/kg/min</p>
            <p>• Max peripheral: ~12.5% dextrose</p>
            <p>• Central line needed for &gt;12.5% dextrose</p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default GIRDialog;
