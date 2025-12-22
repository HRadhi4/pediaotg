import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Droplets, Calculator, AlertTriangle, Syringe, Home, FlaskConical, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";
import JaundiceDialog from "@/components/JaundiceDialog";

// Custom Sun icon for Jaundice
const JaundiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const NICUCalculator = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [bloodGasOpen, setBloodGasOpen] = useState(false);
  const [electrolytesOpen, setElectrolytesOpen] = useState(false);
  const [jaundiceOpen, setJaundiceOpen] = useState(false);

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

    const totalFluid = tfiNum * weightNum;
    const naclTotal = naclNum * weightNum;
    const feedTotal = feedNum * weightNum;
    const tpnTotal = tpnNum * weightNum;
    const totalDeductions = naclTotal + feedTotal + tpnTotal;
    const remainingIVFluid = Math.max(0, totalFluid - totalDeductions);
    const remainingIVFluidPerKg = weightNum > 0 ? remainingIVFluid / weightNum : 0;
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
    setWeight(""); setAge(""); setGestationalAge(""); setTfi("");
    setFluidType("d10"); setUseNaCl(false); setNaclAmount("");
    setFeedAmount(""); setTpnAmount("");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "bloodgas") setBloodGasOpen(true);
    else if (tab === "electrolytes") setElectrolytesOpen(true);
    else if (tab === "jaundice") setJaundiceOpen(true);
    else if (tab === "home") navigate("/");
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg-dark' : 'gradient-bg-light'}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              data-testid="back-button"
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground tracking-tight">
                NICU Fluid Calculator
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Neonatal Intensive Care Unit</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle-calc"
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "light" ? <Moon className="h-5 w-5 text-gray-600" /> : <Sun className="h-5 w-5 text-gray-300" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient Info Section */}
          <div className="lg:col-span-12 nightingale-card p-6" data-testid="patient-info-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#00d9c5]/10 flex items-center justify-center">
                <Calculator className="h-5 w-5 text-[#00d9c5]" />
              </div>
              <h2 className="font-heading text-lg font-semibold">Patient Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium text-muted-foreground">Weight (kg)</Label>
                <Input id="weight" type="number" step="0.01" placeholder="e.g., 1.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="nightingale-input font-mono" data-testid="weight-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium text-muted-foreground">Age (days)</Label>
                <Input id="age" type="number" placeholder="e.g., 3" value={age} onChange={(e) => setAge(e.target.value)} className="nightingale-input font-mono" data-testid="age-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gestationalAge" className="text-sm font-medium text-muted-foreground">Gestational Age (weeks)</Label>
                <Input id="gestationalAge" type="number" placeholder="e.g., 32" value={gestationalAge} onChange={(e) => setGestationalAge(e.target.value)} className="nightingale-input font-mono" data-testid="gestational-age-input" />
              </div>
            </div>
          </div>

          {/* Fluid Inputs */}
          <div className="lg:col-span-4 space-y-6">
            {/* TFI Input */}
            <div className="nightingale-card p-6" data-testid="tfi-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00d9c5]/10 flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-[#00d9c5]" />
                </div>
                <h3 className="font-heading font-semibold">Total Fluid Intake (TFI)</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tfi" className="text-sm font-medium text-muted-foreground">TFI (ml/kg/day)</Label>
                <Input id="tfi" type="number" placeholder="e.g., 120" value={tfi} onChange={(e) => setTfi(e.target.value)} className="nightingale-input font-mono" data-testid="tfi-input" />
                {age && (
                  <p className="text-sm text-muted-foreground">Suggested for day {age}: <span className="font-mono text-[#00d9c5] font-medium">{tfiSuggestion}</span> ml/kg/day</p>
                )}
              </div>
            </div>

            {/* Fluid Type */}
            <div className="nightingale-card p-6" data-testid="fluid-type-card">
              <h3 className="font-heading font-semibold mb-4">Fluid Type</h3>
              <RadioGroup value={fluidType} onValueChange={setFluidType} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="d10" id="d10" data-testid="d10-radio" />
                  <Label htmlFor="d10" className="flex-1 cursor-pointer font-medium">D10% alone</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="d10d50" id="d10d50" data-testid="d10d50-radio" />
                  <Label htmlFor="d10d50" className="flex-1 cursor-pointer font-medium">D10% and D50%</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 3% NaCl */}
            <div className="nightingale-card p-6" data-testid="nacl-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00d9c5]/10 flex items-center justify-center">
                  <Syringe className="h-5 w-5 text-[#00d9c5]" />
                </div>
                <h3 className="font-heading font-semibold">3% NaCl</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <Checkbox id="useNaCl" checked={useNaCl} onCheckedChange={setUseNaCl} data-testid="nacl-checkbox" />
                  <Label htmlFor="useNaCl" className="flex-1 cursor-pointer font-medium">Include 3% NaCl</Label>
                </div>
                {useNaCl && (
                  <div className="space-y-2 pl-4 border-l-2 border-[#00d9c5]/30">
                    <Label htmlFor="naclAmount" className="text-sm font-medium text-muted-foreground">Amount (ml/kg/day)</Label>
                    <Input id="naclAmount" type="number" step="0.1" placeholder="e.g., 5" value={naclAmount} onChange={(e) => setNaclAmount(e.target.value)} className="nightingale-input font-mono" data-testid="nacl-amount-input" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="nightingale-card p-6" data-testid="feed-card">
              <h3 className="font-heading font-semibold mb-4">Feed Amount</h3>
              <div className="space-y-2">
                <Label htmlFor="feedAmount" className="text-sm font-medium text-muted-foreground">Feed Volume (ml/kg/day)</Label>
                <Input id="feedAmount" type="number" step="0.1" placeholder="e.g., 30" value={feedAmount} onChange={(e) => setFeedAmount(e.target.value)} className="nightingale-input font-mono" data-testid="feed-amount-input" />
                <p className="text-xs text-muted-foreground">Deducted from TFI</p>
              </div>
            </div>

            <div className="nightingale-card p-6" data-testid="tpn-card">
              <h3 className="font-heading font-semibold mb-4">Total Parenteral Nutrition (TPN)</h3>
              <div className="space-y-2">
                <Label htmlFor="tpnAmount" className="text-sm font-medium text-muted-foreground">TPN Volume (ml/kg/day)</Label>
                <Input id="tpnAmount" type="number" step="0.1" placeholder="e.g., 40" value={tpnAmount} onChange={(e) => setTpnAmount(e.target.value)} className="nightingale-input font-mono" data-testid="tpn-amount-input" />
                <p className="text-xs text-muted-foreground">Deducted from TFI</p>
              </div>
            </div>

            <button onClick={handleReset} className="w-full h-12 rounded-2xl border-2 border-gray-200 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" data-testid="reset-button">
              Reset Calculator
            </button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-4">
            <div className="result-panel lg:sticky lg:top-24" data-testid="results-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00d9c5]/20 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-[#00d9c5]" />
                </div>
                <h3 className="font-heading font-semibold">Calculation Results</h3>
              </div>
              
              <div aria-live="polite" className="space-y-6">
                <div className="text-center py-4">
                  <p className="metric-label mb-2">Remaining IV Fluid</p>
                  <p className={`metric-value ${calculations.isNegative ? 'text-red-500' : 'text-[#00d9c5]'}`} data-testid="remaining-iv-fluid">
                    {calculations.remainingIVFluid}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">ml/day</p>
                  <p className="font-mono text-lg mt-2" data-testid="remaining-iv-fluid-per-kg">
                    ({calculations.remainingIVFluidPerKg} ml/kg/day)
                  </p>
                </div>

                {calculations.isNegative && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-xl text-red-500 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Warning: Deductions exceed total fluid intake!</span>
                  </div>
                )}

                <Separator className="bg-[#00d9c5]/20" />

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Breakdown</h4>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Total Fluid (TFI × Weight)</span>
                    <span className="font-mono font-medium" data-testid="total-fluid">{calculations.totalFluid} ml</span>
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-[#00d9c5]/20">
                    {useNaCl && parseFloat(naclAmount) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">- 3% NaCl</span>
                        <span className="font-mono text-red-500" data-testid="nacl-deduction">-{calculations.naclTotal} ml</span>
                      </div>
                    )}
                    {parseFloat(feedAmount) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">- Feed</span>
                        <span className="font-mono text-red-500" data-testid="feed-deduction">-{calculations.feedTotal} ml</span>
                      </div>
                    )}
                    {parseFloat(tpnAmount) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">- TPN</span>
                        <span className="font-mono text-red-500" data-testid="tpn-deduction">-{calculations.tpnTotal} ml</span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-[#00d9c5]/20" />

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium">Hourly Rate</span>
                    <span className="font-mono font-bold text-[#00d9c5]" data-testid="hourly-rate">
                      {calculations.hourlyRate} ml/hr
                    </span>
                  </div>

                  {fluidType === "d10d50" && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-sm">
                      <p className="font-medium mb-1">D10% + D50% Mixing</p>
                      <p className="text-muted-foreground">Selected for higher glucose concentration needs</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Tab Bar */}
      <nav className="floating-tab-bar">
        <div className="flex items-center gap-1">
          <button onClick={() => handleTabClick("home")} className={`tab-item ${activeTab === "home" ? "active" : ""}`}>
            <Home className="h-6 w-6" />
          </button>
          <button onClick={() => handleTabClick("bloodgas")} className={`tab-item ${activeTab === "bloodgas" ? "active" : ""}`} data-testid="blood-gas-nav-calc">
            <Droplets className="h-6 w-6" />
          </button>
          <button onClick={() => handleTabClick("electrolytes")} className={`tab-item ${activeTab === "electrolytes" ? "active" : ""}`} data-testid="electrolytes-nav-calc">
            <FlaskConical className="h-6 w-6" />
          </button>
          <button disabled className="tab-item tab-item-disabled">
            <Stethoscope className="h-6 w-6" />
          </button>
          <button onClick={() => handleTabClick("jaundice")} className={`tab-item ${activeTab === "jaundice" ? "active" : ""}`} data-testid="jaundice-nav-calc">
            <span className={activeTab === "jaundice" ? "text-amber-400" : ""}><JaundiceIcon /></span>
          </button>
        </div>
      </nav>

      {/* Dialogs */}
      <BloodGasDialog open={bloodGasOpen} onOpenChange={(open) => { setBloodGasOpen(open); if (!open) setActiveTab("home"); }} />
      <ElectrolytesDialog open={electrolytesOpen} onOpenChange={(open) => { setElectrolytesOpen(open); if (!open) setActiveTab("home"); }} />
      <JaundiceDialog open={jaundiceOpen} onOpenChange={(open) => { setJaundiceOpen(open); if (!open) setActiveTab("home"); }} />
    </div>
  );
};

export default NICUCalculator;
