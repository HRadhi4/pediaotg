import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Droplets, Calculator, AlertTriangle, Syringe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const NICUCalculator = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  // Patient Info
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gestationalAge, setGestationalAge] = useState("");

  // Fluid Inputs
  const [tfi, setTfi] = useState("");
  const [fluidType, setFluidType] = useState("d10");
  const [useNaCl, setUseNaCl] = useState(false);
  const [naclAmount, setNaclAmount] = useState("");
  const [feedAmount, setFeedAmount] = useState("");
  const [tpnAmount, setTpnAmount] = useState("");

  // TFI suggestion based on age
  const tfiSuggestion = useMemo(() => {
    const ageNum = parseInt(age) || 0;
    if (ageNum <= 1) return "60-80";
    if (ageNum <= 2) return "80-100";
    if (ageNum <= 3) return "100-120";
    if (ageNum <= 7) return "120-150";
    return "150-180";
  }, [age]);

  // Calculations
  const calculations = useMemo(() => {
    const weightNum = parseFloat(weight) || 0;
    const tfiNum = parseFloat(tfi) || 0;
    const naclNum = useNaCl ? (parseFloat(naclAmount) || 0) : 0;
    const feedNum = parseFloat(feedAmount) || 0;
    const tpnNum = parseFloat(tpnAmount) || 0;

    // Total fluid in ml/day
    const totalFluid = tfiNum * weightNum;
    
    // Total deductions (all in ml/kg/day, convert to ml/day)
    const naclTotal = naclNum * weightNum;
    const feedTotal = feedNum * weightNum;
    const tpnTotal = tpnNum * weightNum;
    const totalDeductions = naclTotal + feedTotal + tpnTotal;

    // Remaining IV fluid
    const remainingIVFluid = Math.max(0, totalFluid - totalDeductions);
    const remainingIVFluidPerKg = weightNum > 0 ? remainingIVFluid / weightNum : 0;

    // Hourly rate
    const hourlyRate = remainingIVFluid / 24;

    return {
      totalFluid: totalFluid.toFixed(1),
      naclTotal: naclTotal.toFixed(1),
      feedTotal: feedTotal.toFixed(1),
      tpnTotal: tpnTotal.toFixed(1),
      totalDeductions: totalDeductions.toFixed(1),
      remainingIVFluid: remainingIVFluid.toFixed(1),
      remainingIVFluidPerKg: remainingIVFluidPerKg.toFixed(1),
      hourlyRate: hourlyRate.toFixed(2),
      isNegative: totalFluid - totalDeductions < 0
    };
  }, [weight, tfi, useNaCl, naclAmount, feedAmount, tpnAmount]);

  const handleReset = () => {
    setWeight("");
    setAge("");
    setGestationalAge("");
    setTfi("");
    setFluidType("d10");
    setUseNaCl(false);
    setNaclAmount("");
    setFeedAmount("");
    setTpnAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              data-testid="back-button"
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground tracking-tight">
                NICU Fluid Calculator
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Neonatal Intensive Care Unit</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="theme-toggle-calc"
            className="rounded-full"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient Info Section */}
          <Card className="lg:col-span-12" data-testid="patient-info-card">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium text-muted-foreground">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 1.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-12 text-lg font-mono"
                    data-testid="weight-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium text-muted-foreground">
                    Age (days)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 3"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-12 text-lg font-mono"
                    data-testid="age-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gestationalAge" className="text-sm font-medium text-muted-foreground">
                    Gestational Age (weeks)
                  </Label>
                  <Input
                    id="gestationalAge"
                    type="number"
                    placeholder="e.g., 32"
                    value={gestationalAge}
                    onChange={(e) => setGestationalAge(e.target.value)}
                    className="h-12 text-lg font-mono"
                    data-testid="gestational-age-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fluid Inputs */}
          <div className="lg:col-span-4 space-y-6">
            {/* TFI Input */}
            <Card data-testid="tfi-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  Total Fluid Intake (TFI)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tfi" className="text-sm font-medium text-muted-foreground">
                    TFI (ml/kg/day)
                  </Label>
                  <Input
                    id="tfi"
                    type="number"
                    placeholder="e.g., 120"
                    value={tfi}
                    onChange={(e) => setTfi(e.target.value)}
                    className="h-12 text-lg font-mono"
                    data-testid="tfi-input"
                  />
                  {age && (
                    <p className="text-sm text-muted-foreground">
                      Suggested for day {age}: <span className="font-mono text-primary">{tfiSuggestion}</span> ml/kg/day
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fluid Type */}
            <Card data-testid="fluid-type-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-lg">Fluid Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={fluidType} onValueChange={setFluidType} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="d10" id="d10" data-testid="d10-radio" />
                    <Label htmlFor="d10" className="flex-1 cursor-pointer font-medium">
                      D10% alone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="d10d50" id="d10d50" data-testid="d10d50-radio" />
                    <Label htmlFor="d10d50" className="flex-1 cursor-pointer font-medium">
                      D10% and D50%
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* 3% NaCl */}
            <Card data-testid="nacl-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-primary" />
                  3% NaCl
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="useNaCl"
                    checked={useNaCl}
                    onCheckedChange={setUseNaCl}
                    data-testid="nacl-checkbox"
                  />
                  <Label htmlFor="useNaCl" className="flex-1 cursor-pointer font-medium">
                    Include 3% NaCl
                  </Label>
                </div>
                {useNaCl && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                    <Label htmlFor="naclAmount" className="text-sm font-medium text-muted-foreground">
                      Amount (ml/kg/day)
                    </Label>
                    <Input
                      id="naclAmount"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 5"
                      value={naclAmount}
                      onChange={(e) => setNaclAmount(e.target.value)}
                      className="h-12 text-lg font-mono"
                      data-testid="nacl-amount-input"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Deductions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Feed Amount */}
            <Card data-testid="feed-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-lg">Feed Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="feedAmount" className="text-sm font-medium text-muted-foreground">
                    Feed Volume (ml/kg/day)
                  </Label>
                  <Input
                    id="feedAmount"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 30"
                    value={feedAmount}
                    onChange={(e) => setFeedAmount(e.target.value)}
                    className="h-12 text-lg font-mono"
                    data-testid="feed-amount-input"
                  />
                  <p className="text-xs text-muted-foreground">Deducted from TFI</p>
                </div>
              </CardContent>
            </Card>

            {/* TPN Amount */}
            <Card data-testid="tpn-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-lg">Total Parenteral Nutrition (TPN)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="tpnAmount" className="text-sm font-medium text-muted-foreground">
                    TPN Volume (ml/kg/day)
                  </Label>
                  <Input
                    id="tpnAmount"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 40"
                    value={tpnAmount}
                    onChange={(e) => setTpnAmount(e.target.value)}
                    className="h-12 text-lg font-mono"
                    data-testid="tpn-amount-input"
                  />
                  <p className="text-xs text-muted-foreground">Deducted from TFI</p>
                </div>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full h-12"
              data-testid="reset-button"
            >
              Reset Calculator
            </Button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-4">
            <Card className="result-panel lg:sticky lg:top-24" data-testid="results-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6" aria-live="polite">
                {/* Main Result */}
                <div className="text-center py-4">
                  <p className="metric-label mb-2">Remaining IV Fluid</p>
                  <p className={`metric-value ${calculations.isNegative ? 'text-destructive' : 'text-primary'}`} data-testid="remaining-iv-fluid">
                    {calculations.remainingIVFluid}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">ml/day</p>
                  <p className="font-mono text-lg mt-2" data-testid="remaining-iv-fluid-per-kg">
                    ({calculations.remainingIVFluidPerKg} ml/kg/day)
                  </p>
                </div>

                {calculations.isNegative && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Warning: Deductions exceed total fluid intake!</span>
                  </div>
                )}

                <Separator />

                {/* Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Breakdown</h4>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Total Fluid (TFI × Weight)</span>
                    <span className="font-mono font-medium" data-testid="total-fluid">{calculations.totalFluid} ml</span>
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-border">
                    {useNaCl && parseFloat(naclAmount) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">- 3% NaCl</span>
                        <span className="font-mono text-destructive" data-testid="nacl-deduction">-{calculations.naclTotal} ml</span>
                      </div>
                    )}
                    {parseFloat(feedAmount) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">- Feed</span>
                        <span className="font-mono text-destructive" data-testid="feed-deduction">-{calculations.feedTotal} ml</span>
                      </div>
                    )}
                    {parseFloat(tpnAmount) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">- TPN</span>
                        <span className="font-mono text-destructive" data-testid="tpn-deduction">-{calculations.tpnTotal} ml</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium">Hourly Rate</span>
                    <span className="font-mono font-bold text-primary" data-testid="hourly-rate">
                      {calculations.hourlyRate} ml/hr
                    </span>
                  </div>

                  {fluidType === "d10d50" && (
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <p className="font-medium mb-1">D10% + D50% Mixing</p>
                      <p className="text-muted-foreground">Selected for higher glucose concentration needs</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NICUCalculator;
