import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Droplets, Home, FlaskConical, Zap, GripVertical, Settings, X, Stethoscope, Activity, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";
import JaundiceDialog from "@/components/JaundiceDialog";
import GIRDialog from "@/components/GIRDialog";
import BloodProductsDialog from "@/components/BloodProductsDialog";

// Custom icons
const JaundiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const BloodDropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12Z"/>
    <path d="M12 12v-2"/><path d="M12 16h.01"/>
  </svg>
);

const CatheterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v6"/>
    <path d="M12 8c-2 0-4 2-4 5v9"/>
    <path d="M12 8c2 0 4 2 4 5v9"/>
    <circle cx="12" cy="5" r="2"/>
  </svg>
);

const NICUCalculator = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [bloodGasOpen, setBloodGasOpen] = useState(false);
  const [electrolytesOpen, setElectrolytesOpen] = useState(false);
  const [jaundiceOpen, setJaundiceOpen] = useState(false);
  const [girOpen, setGirOpen] = useState(false);
  const [bloodProductsOpen, setBloodProductsOpen] = useState(false);
  
  // Widget management
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState([
    { id: "fluid", title: "Fluid Calculator", icon: "droplets", color: "teal", enabled: true },
    { id: "catheter", title: "UVC/UAC Calculator", icon: "catheter", color: "blue", enabled: true },
    { id: "bp", title: "Blood Pressure", icon: "activity", color: "red", enabled: true, comingSoon: true },
    { id: "prbc", title: "PRBC Transfusion", icon: "blood", color: "red", enabled: true },
    { id: "exchange", title: "Exchange Transfusion", icon: "repeat", color: "purple", enabled: true }
  ]);

  // Dialog states for widgets
  const [fluidDialogOpen, setFluidDialogOpen] = useState(false);
  const [catheterDialogOpen, setCatheterDialogOpen] = useState(false);
  const [prbcDialogOpen, setPrbcDialogOpen] = useState(false);
  const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "bloodgas") setBloodGasOpen(true);
    else if (tab === "electrolytes") setElectrolytesOpen(true);
    else if (tab === "jaundice") setJaundiceOpen(true);
    else if (tab === "gir") setGirOpen(true);
    else if (tab === "bloodproducts") setBloodProductsOpen(true);
    else if (tab === "home") navigate("/");
  };

  const handleWidgetClick = (widgetId) => {
    if (isEditMode) return;
    
    switch(widgetId) {
      case "fluid":
        setFluidDialogOpen(true);
        break;
      case "catheter":
        setCatheterDialogOpen(true);
        break;
      case "prbc":
        setPrbcDialogOpen(true);
        break;
      case "exchange":
        setExchangeDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const moveWidget = (index, direction) => {
    const newWidgets = [...widgets];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < widgets.length) {
      [newWidgets[index], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[index]];
      setWidgets(newWidgets);
    }
  };

  const getWidgetIcon = (iconName, color) => {
    const colorClass = {
      teal: "text-[#00d9c5]",
      blue: "text-blue-500",
      red: "text-red-500",
      purple: "text-purple-500",
      amber: "text-amber-500"
    }[color] || "text-gray-500";

    switch(iconName) {
      case "droplets": return <Droplets className={`h-6 w-6 ${colorClass}`} />;
      case "catheter": return <CatheterIcon />;
      case "activity": return <Activity className={`h-6 w-6 ${colorClass}`} />;
      case "blood": return <span className={colorClass}><BloodDropIcon /></span>;
      case "repeat": return <Repeat className={`h-6 w-6 ${colorClass}`} />;
      default: return <Stethoscope className={`h-6 w-6 ${colorClass}`} />;
    }
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
                NICU
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Neonatal Intensive Care Unit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isEditMode 
                  ? 'bg-[#00d9c5] text-gray-900' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              data-testid="edit-widgets"
            >
              {isEditMode ? <X className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
            </button>
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-calc"
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "light" ? <Moon className="h-5 w-5 text-gray-600" /> : <Sun className="h-5 w-5 text-gray-300" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Widget Grid */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 pt-24 pb-32">
        {isEditMode && (
          <div className="mb-4 p-3 rounded-xl bg-[#00d9c5]/10 border border-[#00d9c5]/30 text-sm text-center">
            Tap arrows to rearrange widgets. Tap ✕ when done.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {widgets.filter(w => w.enabled).map((widget, index) => (
            <Card
              key={widget.id}
              onClick={() => handleWidgetClick(widget.id)}
              className={`nightingale-card cursor-pointer transition-all duration-300 ${
                isEditMode ? 'animate-wiggle' : 'hover:scale-[1.02]'
              } ${widget.comingSoon ? 'opacity-60' : ''}`}
              data-testid={`widget-${widget.id}`}
            >
              <CardContent className="p-4 relative">
                {isEditMode && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveWidget(index, "up"); }}
                      disabled={index === 0}
                      className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveWidget(index, "down"); }}
                      disabled={index === widgets.length - 1}
                      className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-${widget.color}-100 dark:bg-${widget.color}-900/30`}
                    style={{ backgroundColor: widget.color === 'teal' ? 'rgba(0,217,197,0.1)' : undefined }}
                  >
                    {getWidgetIcon(widget.icon, widget.color)}
                  </div>
                  <h3 className="font-heading font-semibold text-sm">{widget.title}</h3>
                  {widget.comingSoon && (
                    <span className="mt-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500">
                      Coming Soon
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Floating Tab Bar */}
      <nav className="floating-tab-bar">
        <div className="flex items-center gap-0.5">
          <button onClick={() => handleTabClick("home")} className={`tab-item ${activeTab === "home" ? "active" : ""}`}>
            <Home className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("bloodgas")} className={`tab-item ${activeTab === "bloodgas" ? "active" : ""}`} data-testid="blood-gas-nav-calc">
            <Droplets className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("electrolytes")} className={`tab-item ${activeTab === "electrolytes" ? "active" : ""}`} data-testid="electrolytes-nav-calc">
            <FlaskConical className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("bloodproducts")} className={`tab-item ${activeTab === "bloodproducts" ? "active" : ""}`} data-testid="blood-products-nav-calc">
            <span className={activeTab === "bloodproducts" ? "text-red-400" : ""}><BloodDropIcon /></span>
          </button>
          <button onClick={() => handleTabClick("gir")} className={`tab-item ${activeTab === "gir" ? "active" : ""}`} data-testid="gir-nav-calc">
            <Zap className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("jaundice")} className={`tab-item ${activeTab === "jaundice" ? "active" : ""}`} data-testid="jaundice-nav-calc">
            <span className={activeTab === "jaundice" ? "text-amber-400" : ""}><JaundiceIcon /></span>
          </button>
        </div>
      </nav>

      {/* Widget Dialogs */}
      <FluidCalculatorDialog open={fluidDialogOpen} onOpenChange={setFluidDialogOpen} />
      <CatheterCalculatorDialog open={catheterDialogOpen} onOpenChange={setCatheterDialogOpen} />
      <PRBCGuidelineDialog open={prbcDialogOpen} onOpenChange={setPrbcDialogOpen} />
      <ExchangeCalculatorDialog open={exchangeDialogOpen} onOpenChange={setExchangeDialogOpen} />

      {/* Navigation Dialogs */}
      <BloodGasDialog open={bloodGasOpen} onOpenChange={(open) => { setBloodGasOpen(open); if (!open) setActiveTab(""); }} />
      <ElectrolytesDialog open={electrolytesOpen} onOpenChange={(open) => { setElectrolytesOpen(open); if (!open) setActiveTab(""); }} />
      <JaundiceDialog open={jaundiceOpen} onOpenChange={(open) => { setJaundiceOpen(open); if (!open) setActiveTab(""); }} />
      <GIRDialog open={girOpen} onOpenChange={(open) => { setGirOpen(open); if (!open) setActiveTab(""); }} />
      <BloodProductsDialog open={bloodProductsOpen} onOpenChange={(open) => { setBloodProductsOpen(open); if (!open) setActiveTab(""); }} />
    </div>
  );
};

// Fluid Calculator Dialog (existing functionality moved here)
const FluidCalculatorDialog = ({ open, onOpenChange }) => {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gestationalAge, setGestationalAge] = useState("");
  const [tfi, setTfi] = useState("");
  const [fluidType, setFluidType] = useState("d10");
  const [useNaCl, setUseNaCl] = useState(false);
  const [naclAmount, setNaclAmount] = useState("");
  const [feedAmount, setFeedAmount] = useState("");
  const [tpnAmount, setTpnAmount] = useState("");

  const getTfiSuggestion = () => {
    const ageNum = parseInt(age) || 0;
    if (ageNum <= 1) return "60-80";
    if (ageNum <= 2) return "80-100";
    if (ageNum <= 3) return "100-120";
    if (ageNum <= 7) return "120-150";
    return "150-180";
  };

  const calculateResults = () => {
    const w = parseFloat(weight) || 0;
    const tfiNum = parseFloat(tfi) || 0;
    const naclNum = useNaCl ? (parseFloat(naclAmount) || 0) : 0;
    const feedNum = parseFloat(feedAmount) || 0;
    const tpnNum = parseFloat(tpnAmount) || 0;

    const totalFluid = tfiNum * w;
    const naclTotal = naclNum * w;
    const feedTotal = feedNum * w;
    const tpnTotal = tpnNum * w;
    const totalDeductions = naclTotal + feedTotal + tpnTotal;
    const remainingIVFluid = Math.max(0, totalFluid - totalDeductions);
    const remainingIVFluidPerKg = w > 0 ? remainingIVFluid / w : 0;
    const hourlyRate = remainingIVFluid / 24;

    return {
      totalFluid: totalFluid.toFixed(1),
      remainingIVFluid: remainingIVFluid.toFixed(1),
      remainingIVFluidPerKg: remainingIVFluidPerKg.toFixed(1),
      hourlyRate: hourlyRate.toFixed(2),
      isNegative: totalFluid - totalDeductions < 0
    };
  };

  const results = calculateResults();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Droplets className="h-5 w-5 text-[#00d9c5]" />
            Fluid Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Info */}
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Weight (kg)</Label>
                  <Input type="number" step="0.01" placeholder="1.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Age (days)</Label>
                  <Input type="number" placeholder="3" value={age} onChange={(e) => setAge(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">GA (weeks)</Label>
                  <Input type="number" placeholder="32" value={gestationalAge} onChange={(e) => setGestationalAge(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TFI */}
          <Card className="nightingale-card">
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">TFI (ml/kg/day)</Label>
                <Input type="number" placeholder="120" value={tfi} onChange={(e) => setTfi(e.target.value)} className="nightingale-input font-mono" />
                {age && <p className="text-xs text-muted-foreground">Suggested: <span className="text-[#00d9c5] font-mono">{getTfiSuggestion()}</span></p>}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">3% NaCl (ml/kg/day)</Label>
                  <Input type="number" placeholder="0" value={naclAmount} onChange={(e) => { setNaclAmount(e.target.value); setUseNaCl(!!e.target.value); }} className="nightingale-input font-mono h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Feed (ml/kg/day)</Label>
                  <Input type="number" placeholder="30" value={feedAmount} onChange={(e) => setFeedAmount(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">TPN (ml/kg/day)</Label>
                <Input type="number" placeholder="40" value={tpnAmount} onChange={(e) => setTpnAmount(e.target.value)} className="nightingale-input font-mono h-9" />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="border-[#00d9c5]/30 bg-[#00d9c5]/5 rounded-2xl">
            <CardContent className="pt-4 space-y-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Remaining IV Fluid</p>
                <p className={`text-3xl font-mono font-bold ${results.isNegative ? 'text-red-500' : 'text-[#00d9c5]'}`}>
                  {results.remainingIVFluid} <span className="text-sm">ml/day</span>
                </p>
                <p className="text-sm font-mono">({results.remainingIVFluidPerKg} ml/kg/day)</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="font-mono font-bold">{results.hourlyRate} ml/hr</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// UVC/UAC Calculator Dialog
const CatheterCalculatorDialog = ({ open, onOpenChange }) => {
  const [weight, setWeight] = useState("");

  const calculateUAC = () => {
    const w = parseFloat(weight) || 0;
    return ((3.5 * w) + 9).toFixed(1);
  };

  const calculateUVC = () => {
    const w = parseFloat(weight) || 0;
    const uac = (3.5 * w) + 9;
    return ((uac / 2) + 1).toFixed(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <CatheterIcon />
            UVC/UAC Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="nightingale-card">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="nightingale-input font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {weight && (
            <div className="grid grid-cols-2 gap-4">
              {/* UAC */}
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 rounded-2xl">
                <CardContent className="pt-4 text-center">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">UAC Length</p>
                  <p className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 my-2">
                    {calculateUAC()} cm
                  </p>
                  <p className="text-xs text-muted-foreground">Formula: (3.5 × WT) + 9</p>
                  <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-xs font-medium">X-ray Position</p>
                    <p className="text-sm font-bold text-blue-600">T9 - T6</p>
                  </div>
                </CardContent>
              </Card>

              {/* UVC */}
              <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/30 rounded-2xl">
                <CardContent className="pt-4 text-center">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">UVC Length</p>
                  <p className="text-3xl font-mono font-bold text-purple-600 dark:text-purple-400 my-2">
                    {calculateUVC()} cm
                  </p>
                  <p className="text-xs text-muted-foreground">Formula: [(3.5×WT)+9]/2 + 1</p>
                  <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-xs font-medium">X-ray Position</p>
                    <p className="text-sm font-bold text-purple-600">Below Diaphragm</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Reference</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>• UAC tip should be at T6-T9 (high position) or L3-L4 (low position)</p>
              <p>• UVC tip should be at junction of IVC and right atrium (below diaphragm)</p>
              <p>• Confirm position with X-ray before use</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// PRBC Transfusion Calculator Dialog - Simplified (15 ml/kg, 1 unit = 280 ml)
const PRBCGuidelineDialog = ({ open, onOpenChange }) => {
  const [weight, setWeight] = useState("");

  const DOSE_PER_KG = 15;
  const UNIT_VOLUME = 280; // 1 unit = 280 ml

  const calculateDose = () => {
    const w = parseFloat(weight) || 0;
    if (w <= 0) return null;
    
    const totalDose = w * DOSE_PER_KG;
    const units = totalDose / UNIT_VOLUME;
    
    return {
      totalDose: totalDose.toFixed(1),
      units: units.toFixed(2),
      weight: w
    };
  };

  const result = calculateDose();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <span className="text-red-500"><BloodDropIcon /></span>
            PRBC Transfusion Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
                />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 rounded-2xl">
              <CardContent className="pt-4 space-y-4">
                <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                  <p className="text-sm text-muted-foreground">PRBC Volume</p>
                  <p className="text-4xl font-mono font-bold text-red-600 dark:text-red-400">
                    {result.totalDose} <span className="text-lg">ml</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {DOSE_PER_KG} ml/kg × {result.weight} kg
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                    <p className="text-xs text-muted-foreground">Dose Rate</p>
                    <p className="text-lg font-mono font-bold">{DOSE_PER_KG} ml/kg</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                    <p className="text-xs text-muted-foreground">Units Required</p>
                    <p className="text-lg font-mono font-bold">{result.units}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reference */}
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Reference</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>• Standard dose: <span className="font-bold">15 ml/kg</span> PRBC</p>
              <p>• 1 unit = <span className="font-bold">280 ml</span></p>
              <p>• Transfuse over 3-4 hours</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Exchange Transfusion Calculator Dialog
const ExchangeCalculatorDialog = ({ open, onOpenChange }) => {
  const [weight, setWeight] = useState("");
  const [observedHct, setObservedHct] = useState("");
  const [desiredHct, setDesiredHct] = useState("55");

  const calculateExchange = () => {
    const w = parseFloat(weight) || 0;
    const obsHct = parseFloat(observedHct) || 0;
    const desHct = parseFloat(desiredHct) || 55;
    
    if (obsHct <= 0) return null;
    
    // Formula: 80 × wt × (Observed Hct - Desired Hct) / Observed Hct
    const volume = (80 * w * (obsHct - desHct)) / obsHct;
    return volume.toFixed(1);
  };

  const exchangeVolume = calculateExchange();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Repeat className="h-5 w-5 text-purple-500" />
            Exchange Transfusion Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Polycythemia Indications</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <p>• <strong>Hct &gt; 70%</strong> in asymptomatic neonates</p>
              <p>• <strong>Hct &gt; 65%</strong> in symptomatic neonates</p>
              <p className="text-muted-foreground mt-2">Symptoms: Hypoglycemia, Jaundice, Jitteriness, Respiratory distress, Seizures, Cyanosis, Apnea</p>
            </CardContent>
          </Card>

          <Card className="nightingale-card">
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 3.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="nightingale-input font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Observed Hct (%)</Label>
                  <Input
                    type="number"
                    step="1"
                    placeholder="e.g., 70"
                    value={observedHct}
                    onChange={(e) => setObservedHct(e.target.value)}
                    className="nightingale-input font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Desired Hct (%)</Label>
                  <Input
                    type="number"
                    step="1"
                    placeholder="55"
                    value={desiredHct}
                    onChange={(e) => setDesiredHct(e.target.value)}
                    className="nightingale-input font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {exchangeVolume && parseFloat(exchangeVolume) > 0 && (
            <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/30 rounded-2xl">
              <CardContent className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">Volume to be Withdrawn</p>
                <p className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400 my-2">
                  {exchangeVolume} ml
                </p>
                <p className="text-xs text-muted-foreground">
                  Replace with equal volume of Normal Saline or IVF
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Formula</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-center">
                Volume = (80 × Wt × (Obs Hct - Desired Hct)) / Obs Hct
              </div>
              <p className="text-muted-foreground">
                • Perform partial exchange transfusion
                <br/>• Remove calculated blood volume and replace with IVF
                <br/>• Aim to dilute the blood and reduce Hct
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NICUCalculator;
