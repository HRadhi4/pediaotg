/**
 * NICU Calculator Dashboard
 * 
 * File Structure:
 * - Lines 1-60: Imports and Custom Icons
 * - Lines 60-285: Main NICUCalculator Component (Dashboard & Navigation)
 * - Lines 286-678: FluidCalculatorPage
 * - Lines 681-910: NRPChecklistPage
 * - Lines 913-991: CatheterCalculatorPage (UVC/UAC)
 * - Lines 994-1377: PRBCGuidelinePage
 * - Lines 1380-1605: ExchangeCalculatorPage
 * - Lines 1608-1802: IntubationPage
 * - Lines 1805-2009: BloodPressurePage
 * 
 * Future Refactoring: Each page component can be extracted to /pages/nicu/
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Droplets, Home, FlaskConical, Zap, Settings, X, Stethoscope, Activity, Repeat, Check, Clock, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";
import JaundiceDialog from "@/components/JaundiceDialog";
import GIRDialog from "@/components/GIRDialog";
import BloodProductsDialog from "@/components/BloodProductsDialog";

// Custom icons for widgets and nav bar
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

const NRPIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    <path d="M12 5v4"/><path d="M10 7h4"/>
  </svg>
);

const IntubationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4"/>
    <path d="M8 6h8"/>
    <path d="M10 6v12c0 2 1 4 2 4s2-2 2-4V6"/>
    <circle cx="12" cy="3" r="1"/>
  </svg>
);

const NICUCalculator = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { page } = useParams();
  const currentPage = page || "main";
  
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
    { id: "nrp", title: "NRP Checklist", icon: "nrp", color: "red", enabled: true },
    { id: "catheter", title: "UVC/UAC Calculator", icon: "catheter", color: "blue", enabled: true },
    { id: "intubation", title: "Intubation", icon: "intubation", color: "purple", enabled: true },
    { id: "bp", title: "Blood Pressure", icon: "activity", color: "red", enabled: true },
    { id: "prbc", title: "PRBC Transfusion", icon: "blood", color: "red", enabled: true },
    { id: "exchange", title: "Exchange Transfusion", icon: "repeat", color: "purple", enabled: true }
  ]);

  // Navigate to page
  const goToPage = (pageId) => {
    if (isEditMode) return;
    if (pageId === "main") {
      navigate("/nicu");
    } else {
      navigate(`/nicu/${pageId}`);
    }
  };

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
    goToPage(widgetId);
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
      case "intubation": return <span className={colorClass}><IntubationIcon /></span>;
      case "activity": return <Activity className={`h-6 w-6 ${colorClass}`} />;
      case "blood": return <span className={colorClass}><BloodDropIcon /></span>;
      case "repeat": return <Repeat className={`h-6 w-6 ${colorClass}`} />;
      case "nrp": return <span className={colorClass}><NRPIcon /></span>;
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
              onClick={() => currentPage === "main" ? navigate("/") : goToPage("main")}
              data-testid="back-button"
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground tracking-tight">
                {currentPage === "main" ? "NICU" : widgets.find(w => w.id === currentPage)?.title || "NICU"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {currentPage === "main" ? "Neonatal Intensive Care Unit" : "Tap arrow to go back"}
              </p>
            </div>
          </div>
          {currentPage === "main" && (
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
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 pt-24 pb-32">
        <ScrollArea className="h-[calc(100vh-160px)]">
          {currentPage === "main" ? (
            <>
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
            </>
          ) : (
            /* Render Page Content based on currentPage */
            <div className="space-y-4 pb-8">
              {currentPage === "fluid" && <FluidCalculatorPage />}
              {currentPage === "nrp" && <NRPChecklistPage />}
              {currentPage === "catheter" && <CatheterCalculatorPage />}
              {currentPage === "intubation" && <IntubationPage />}
              {currentPage === "bp" && <BloodPressurePage />}
              {currentPage === "prbc" && <PRBCGuidelinePage />}
              {currentPage === "exchange" && <ExchangeCalculatorPage />}
            </div>
          )}
        </ScrollArea>
      </main>

      {/* Floating Nav Bar */}
      <FloatingNavBar showHome={true} />
    </div>
  );
};

// Enhanced Fluid Calculator Page with Order Summary
const FluidCalculatorPage = () => {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gestationalAge, setGestationalAge] = useState("");
  const [tfi, setTfi] = useState("");
  
  // NaCl
  const [naclAmount, setNaclAmount] = useState("");
  
  // Feed
  const [feedVolume, setFeedVolume] = useState("");
  const [feedFrequency, setFeedFrequency] = useState("2"); // q2h default
  
  // TPN
  const [aminoGrams, setAminoGrams] = useState(""); // 1-3g limit
  const [lipidGrams, setLipidGrams] = useState(""); // g/kg
  
  // Combined Dextrose
  const [useCombinedDextrose, setUseCombinedDextrose] = useState(false);
  const [dextroseItems, setDextroseItems] = useState([
    { id: 1, type: "D10", percentage: 10, volume: "" }
  ]);

  const dextroseOptions = [
    { type: "D5", percentage: 5 },
    { type: "D10", percentage: 10 },
    { type: "D12.5", percentage: 12.5 },
    { type: "D15", percentage: 15 },
    { type: "D20", percentage: 20 },
    { type: "D50", percentage: 50 }
  ];

  const getTfiSuggestion = () => {
    const ageNum = parseInt(age) || 0;
    if (ageNum <= 1) return "60-80";
    if (ageNum <= 2) return "80-100";
    if (ageNum <= 3) return "100-120";
    if (ageNum <= 7) return "120-150";
    return "150-180";
  };

  const addDextroseItem = () => {
    const newId = Math.max(...dextroseItems.map(d => d.id), 0) + 1;
    setDextroseItems([...dextroseItems, { id: newId, type: "D10", percentage: 10, volume: "" }]);
  };

  const removeDextroseItem = (id) => {
    if (dextroseItems.length > 1) {
      setDextroseItems(dextroseItems.filter(d => d.id !== id));
    }
  };

  const updateDextroseItem = (id, field, value) => {
    setDextroseItems(dextroseItems.map(d => {
      if (d.id === id) {
        if (field === "type") {
          const opt = dextroseOptions.find(o => o.type === value);
          return { ...d, type: value, percentage: opt?.percentage || 10 };
        }
        return { ...d, [field]: value };
      }
      return d;
    }));
  };

  const calculateResults = () => {
    const w = parseFloat(weight) || 0;
    const tfiNum = parseFloat(tfi) || 0;
    const naclNum = parseFloat(naclAmount) || 0;
    const feedVol = parseFloat(feedVolume) || 0;
    const feedFreq = parseInt(feedFrequency) || 2;
    const aminoG = parseFloat(aminoGrams) || 0;
    const lipidG = parseFloat(lipidGrams) || 0;

    // Total fluid per 24hr
    const totalFluid24hr = tfiNum * w;
    
    // NaCl total
    const nacl24hr = naclNum * w;
    
    // Feed calculations
    const feedsPerDay = 24 / feedFreq;
    const feed24hr = feedVol * feedsPerDay;
    const feedPerKg = w > 0 ? feed24hr / w : 0;
    
    // TPN calculations (10% Aminoplasmin = 10g/100ml, 20% Intralipids = 20g/100ml)
    const amino24hr = aminoG * w * 10; // ml (1g protein = 10ml of 10% solution)
    const lipid24hr = lipidG * w * 5;  // ml (1g lipid = 5ml of 20% solution)
    const tpn24hr = amino24hr + lipid24hr;
    
    // Dextrose calculation
    let dextrose24hr = 0;
    let dextroseBreakdown = [];
    
    if (useCombinedDextrose) {
      dextroseItems.forEach(item => {
        const vol = parseFloat(item.volume) || 0;
        dextrose24hr += vol;
        if (vol > 0) {
          dextroseBreakdown.push({
            type: item.type,
            percentage: item.percentage,
            volume: vol
          });
        }
      });
    } else {
      // Auto-calculate remaining as D10%
      const totalDeductions = nacl24hr + feed24hr + tpn24hr;
      dextrose24hr = Math.max(0, totalFluid24hr - totalDeductions);
      dextroseBreakdown = [{ type: "D10", percentage: 10, volume: dextrose24hr }];
    }
    
    const totalUsed = nacl24hr + feed24hr + tpn24hr + dextrose24hr;
    const remaining = totalFluid24hr - totalUsed;
    const hourlyRate = totalFluid24hr / 24;

    return {
      weight: w,
      tfi: tfiNum,
      totalFluid24hr: totalFluid24hr.toFixed(1),
      hourlyRate: hourlyRate.toFixed(2),
      nacl24hr: nacl24hr.toFixed(1),
      naclPerKg: naclNum,
      feedVol,
      feedFreq,
      feed24hr: feed24hr.toFixed(1),
      feedPerKg: feedPerKg.toFixed(1),
      aminoG,
      amino24hr: amino24hr.toFixed(1),
      lipidG,
      lipid24hr: lipid24hr.toFixed(1),
      tpn24hr: tpn24hr.toFixed(1),
      dextroseBreakdown,
      dextrose24hr: dextrose24hr.toFixed(1),
      remaining: remaining.toFixed(1),
      isOverLimit: remaining < -0.1,
      useCombinedDextrose
    };
  };

  const results = calculateResults();

  return (
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
              <Input type="number" step="0.01" placeholder="0.8" value={weight} onChange={(e) => setWeight(e.target.value)} className="nightingale-input font-mono h-9" />
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
            <Input type="number" placeholder="140" value={tfi} onChange={(e) => setTfi(e.target.value)} className="nightingale-input font-mono" />
            {age && <p className="text-xs text-muted-foreground">Suggested: <span className="text-[#00d9c5] font-mono">{getTfiSuggestion()}</span></p>}
          </div>
        </CardContent>
      </Card>

      {/* Combined Dextrose Option */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="useCombinedDex"
              checked={useCombinedDextrose}
                  onCheckedChange={setUseCombinedDextrose}
                />
                <Label htmlFor="useCombinedDex" className="cursor-pointer font-medium text-sm">
                  Combined Dextrose (Multiple Sugar Fluids)
                </Label>
              </div>
              
              {useCombinedDextrose && (
                <div className="space-y-2 pt-2">
                  {dextroseItems.map((item) => (
                    <div key={item.id} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">{item.type}</Label>
                        <select
                          value={item.type}
                          onChange={(e) => updateDextroseItem(item.id, "type", e.target.value)}
                          className="w-full h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm"
                        >
                          {dextroseOptions.map(opt => (
                            <option key={opt.type} value={opt.type}>{opt.type} ({opt.percentage}%)</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Volume (ml/24hr)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 50"
                          value={item.volume}
                          onChange={(e) => updateDextroseItem(item.id, "volume", e.target.value)}
                          className="nightingale-input font-mono h-9"
                        />
                      </div>
                      {dextroseItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDextroseItem(item.id)}
                          className="h-9 w-9 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addDextroseItem} className="w-full rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Dextrose Type
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additives */}
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Additives & Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">3% NaCl (ml/kg/day)</Label>
                <Input type="number" step="0.1" placeholder="0" value={naclAmount} onChange={(e) => setNaclAmount(e.target.value)} className="nightingale-input font-mono h-9" />
              </div>
              
                <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Feed Volume (ml/feed)</Label>
                  <Input type="number" placeholder="5" value={feedVolume} onChange={(e) => setFeedVolume(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Feed Frequency</Label>
                  <select
                    value={feedFrequency}
                    onChange={(e) => setFeedFrequency(e.target.value)}
                    className="w-full h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm"
                  >
                    <option value="1">q1h</option>
                    <option value="2">q2h</option>
                    <option value="3">q3h</option>
                    <option value="4">q4h</option>
                    <option value="6">q6h</option>
                    <option value="8">q8h</option>
                    <option value="12">q12h</option>
                    <option value="24">q24h</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TPN */}
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">TPN</CardTitle>
              <CardDescription className="text-xs">Aminoplasmin 10%, Intralipids 20%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Amino Acids (g/kg/day)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    min="0"
                    max="3"
                    placeholder="1-3"
                    value={aminoGrams} 
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (val > 3) setAminoGrams("3");
                      else if (val < 0) setAminoGrams("0");
                      else setAminoGrams(e.target.value);
                    }} 
                    className="nightingale-input font-mono h-9" 
                  />
                  <p className="text-xs text-muted-foreground">Limit: 1-3 g/kg/day</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Lipids (g/kg/day)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    min="0"
                    max="3"
                    placeholder="0-3"
                    value={lipidGrams} 
                    onChange={(e) => setLipidGrams(e.target.value)} 
                    className="nightingale-input font-mono h-9" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Results */}
          {parseFloat(weight) > 0 && parseFloat(tfi) > 0 && (
            <Card className={`rounded-2xl ${results.isOverLimit ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'border-[#00d9c5]/30 bg-[#00d9c5]/5'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#00d9c5]" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 font-mono text-sm">
                {/* TFI */}
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 border">
                  <span className="font-bold">TFI:</span> {results.tfi} ml/kg/day = <span className="text-[#00d9c5] font-bold">{results.totalFluid24hr} ml/24hr</span>
                  <span className="text-muted-foreground text-xs ml-2">({results.hourlyRate} ml/hr)</span>
                </div>

                {/* Dextrose */}
                {results.dextroseBreakdown.map((dex, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                    <span className="font-bold">{dex.type} ({dex.percentage}%):</span> <span className="text-amber-700 dark:text-amber-300 font-bold">{dex.volume.toFixed(1)} ml/24hr</span>
                  </div>
                ))}

                {/* 3% NaCl */}
                {parseFloat(results.nacl24hr) > 0 && (
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                    <span className="font-bold">3% NaCl:</span> <span className="text-blue-700 dark:text-blue-300 font-bold">{results.nacl24hr} ml/24hr</span>
                    <span className="text-muted-foreground text-xs ml-2">({results.naclPerKg} ml/kg/day)</span>
                  </div>
                )}

                {/* Feed */}
                {parseFloat(results.feed24hr) > 0 && (
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                    <span className="font-bold">Total Feed:</span>
                    <div className="pl-2 text-green-700 dark:text-green-300">
                      {results.feedVol} ml q{results.feedFreq}h = <span className="font-bold">{results.feed24hr} ml/24hr</span>
                      <span className="text-muted-foreground text-xs ml-2">({results.feedPerKg} ml/kg/day)</span>
                    </div>
                  </div>
                )}

                {/* TPN */}
                {(parseFloat(results.amino24hr) > 0 || parseFloat(results.lipid24hr) > 0) && (
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
                    <span className="font-bold">TPN:</span>
                    <div className="pl-2 text-purple-700 dark:text-purple-300 space-y-1">
                      {parseFloat(results.amino24hr) > 0 && (
                        <div>10% Aminoplasmin ({results.aminoG}g/kg): <span className="font-bold">{results.amino24hr} ml/24hr</span></div>
                      )}
                      {parseFloat(results.lipid24hr) > 0 && (
                        <div>20% Intralipids ({results.lipidG}g/kg): <span className="font-bold">{results.lipid24hr} ml/24hr</span></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Balance */}
                {results.useCombinedDextrose && (
                  <div className={`p-2 rounded-lg border ${parseFloat(results.remaining) < 0 ? 'bg-red-100 border-red-300 text-red-700' : 'bg-gray-50 dark:bg-gray-800 border-gray-200'}`}>
                    <span className="font-bold">Remaining:</span> <span className="font-bold">{results.remaining} ml/24hr</span>
                    {parseFloat(results.remaining) < 0 && (
                      <span className="text-red-500 text-xs ml-2">(Over TFI limit!)</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
  );
};

// NRP Checklist Page
const NRPChecklistPage = () => {
  const [expandedSections, setExpandedSections] = useState(["initial"]);
  const [checkedItems, setCheckedItems] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const startTimer = (seconds, label) => {
    setActiveTimer(label);
    setTimerSeconds(seconds);
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveTimer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetChecklist = () => {
    setCheckedItems({});
    setActiveTimer(null);
    setTimerSeconds(0);
  };

  const sections = [
    {
      id: "initial",
      title: "Initial Assessment",
      color: "blue",
      items: [
        { id: "term", label: "Term?" },
        { id: "tone", label: "Good tone?" },
        { id: "crying", label: "Breathing or crying?" },
      ],
      note: "If YES to all: Routine care with mother"
    },
    {
      id: "golden",
      title: "Golden Minute (First 60s)",
      color: "amber",
      items: [
        { id: "warm", label: "Warm and maintain temperature" },
        { id: "position", label: "Position airway" },
        { id: "clear", label: "Clear secretions if needed" },
        { id: "dry", label: "Dry" },
        { id: "stimulate", label: "Stimulate" },
      ]
    },
    {
      id: "apnea",
      title: "Apnea/Gasping or HR < 100",
      color: "red",
      items: [
        { id: "ppv", label: "Start PPV (21% O2, term | 21-30% preterm)" },
        { id: "spo2", label: "Apply SpO2 monitor" },
        { id: "ecg", label: "Consider ECG monitor" },
      ],
      timer: { seconds: 15, label: "PPV for 15s" }
    },
    {
      id: "mrsopa",
      title: "MR. SOPA (Ventilation Corrective)",
      color: "purple",
      items: [
        { id: "mask", label: "M - Mask Adjust" },
        { id: "reposition", label: "R - Reposition Airway" },
        { id: "suction", label: "S - Suction mouth then nose" },
        { id: "open", label: "O - Open mouth" },
        { id: "pressure", label: "P - Pressure increase" },
        { id: "alternate", label: "A - Alternate: LMA/ETT (NG first)" },
      ],
      note: "Use if no chest rise with PPV"
    },
    {
      id: "hr60",
      title: "HR < 60 (After 30s Good PPV)",
      color: "red",
      items: [
        { id: "intubate", label: "Intubate if not already done" },
        { id: "compress", label: "Start chest compressions (3:1 ratio)" },
        { id: "100o2", label: "Increase to 100% O2" },
        { id: "uvc", label: "Consider emergency UVC" },
      ],
      timer: { seconds: 60, label: "Compressions 60s" }
    },
    {
      id: "epi",
      title: "Epinephrine (HR still < 60)",
      color: "red",
      items: [
        { id: "epi_iv", label: "IV: 0.01 mg/kg (0.1 ml/kg of 1:10,000)" },
        { id: "epi_ett", label: "ETT: 0.1 mg/kg (may repeat q3-5min)" },
        { id: "hypo", label: "Consider hypovolemia" },
        { id: "pneumo", label: "Consider pneumothorax" },
      ]
    }
  ];

  const references = [
    { title: "Compressions", items: ["Thumbs on sternum", "1/3 chest diameter", "3 Comp : 1 Vent", '"1 and 2 and 3 and bag"'] },
    { title: "Ventilation Settings", items: ["Flow Rate: 10L", "FiO2: 21% (preterm 21-30%)", "PEEP: 5", "PIP: Max 40", "Rate: 40-60/min"] },
    { title: "SpO2 Targets", items: ["1 min: 60-65%", "2 min: 65-70%", "3 min: 70-75%", "5 min: 80-85%", "10 min: 85-95%"] },
    { title: "Post-Resus STABLE", items: ["Sugar: 4-6 mmol/L", "Temp: 36.5-37.5°C", "Airway: Patent", "BP: Monitor", "Labs: CO2 45-55", "Emotional support"] }
  ];

  return (
    <div className="space-y-4">
      {/* Timer Display */}
      {activeTimer && (
        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-500" />
            <span className="font-bold text-red-700 dark:text-red-300">{activeTimer}</span>
          </div>
          <span className="text-2xl font-mono font-bold text-red-600">{timerSeconds}s</span>
        </div>
      )}

      <div className="space-y-3 pb-4">
        {sections.map((section) => (
          <Card key={section.id} className={`rounded-xl border-${section.color}-200 overflow-hidden`}>
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full p-3 flex items-center justify-between bg-${section.color}-50 dark:bg-${section.color}-950/30 hover:opacity-80`}
              style={{ 
                backgroundColor: section.color === 'red' ? 'rgba(239,68,68,0.1)' : 
                                section.color === 'amber' ? 'rgba(245,158,11,0.1)' :
                                section.color === 'purple' ? 'rgba(168,85,247,0.1)' :
                                'rgba(59,130,246,0.1)'
              }}
            >
              <span className="font-semibold text-sm">{section.title}</span>
              {expandedSections.includes(section.id) ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </button>
            
            {expandedSections.includes(section.id) && (
              <CardContent className="pt-3 space-y-2">
                {section.items.map((item) => (
                  <div 
                    key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          checkedItems[item.id] 
                            ? 'bg-green-100 dark:bg-green-950/30' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          checkedItems[item.id] 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        }`}>
                          {checkedItems[item.id] && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={`text-sm ${checkedItems[item.id] ? 'line-through text-muted-foreground' : ''}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                    
                    {section.note && (
                      <p className="text-xs text-muted-foreground italic pt-2 border-t">
                        Note: {section.note}
                      </p>
                    )}
                    
                    {section.timer && (
                      <Button 
                        onClick={() => startTimer(section.timer.seconds, section.timer.label)}
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 rounded-xl"
                        disabled={activeTimer !== null}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Start Timer: {section.timer.label}
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}

            {/* Quick Reference */}
            <Card className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {references.map((ref, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <p className="font-bold text-[#00d9c5]">{ref.title}</p>
                    {ref.items.map((item, i) => (
                      <p key={i} className="text-muted-foreground">• {item}</p>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="pt-3 border-t">
            <Button variant="outline" onClick={resetChecklist} className="w-full rounded-xl">
              Reset Checklist
            </Button>
          </div>
        </div>
  );
};

// UVC/UAC Calculator Page
const CatheterCalculatorPage = () => {
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
  );
};

// PRBC Transfusion Calculator Page - Based on Neonatal Guidelines
const PRBCGuidelinePage = () => {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [ga, setGa] = useState("");
  const [hb, setHb] = useState("");
  const [hct, setHct] = useState("");
  const [hasRespSupport, setHasRespSupport] = useState(false);
  const [result, setResult] = useState(null);

  const UNIT_VOLUME = 280; // 1 unit = 280 ml

  // Transfusion thresholds based on guidelines
  const getThresholds = (category, ageGroup, respSupport) => {
    // Category 1: BW < 1.5 Kg, GA ≤ 32 weeks
    const pretermThresholds = {
      "1-7": { resp: { hct: 35, hb: 12 }, noResp: { hct: 33, hb: 11 } },
      "8-14": { resp: { hct: 33, hb: 11 }, noResp: { hct: 27, hb: 9 } },
      "15+": { resp: { hct: 30, hb: 10 }, noResp: { hct: 25, hb: 8 } }
    };

    // Category 2: GA ≥ 32 weeks and/or > 1.5 Kg
    const termThresholds = {
      "1-7": { resp: { hct: 40, hb: 13.5 }, noResp: { hct: 35, hb: 12 } },
      "8-14": { resp: { hct: 35, hb: 12 }, noResp: { hct: 30, hb: 10 } },
      "15+": { resp: { hct: 33, hb: 11 }, noResp: { hct: 23, hb: 7.7 } }
    };

    const thresholds = category === "preterm" ? pretermThresholds : termThresholds;
    const ageThresholds = thresholds[ageGroup];
    return respSupport ? ageThresholds.resp : ageThresholds.noResp;
  };

  const calculate = () => {
    const w = parseFloat(weight);
    const ageNum = parseInt(age);
    const gaNum = parseInt(ga);
    const hbVal = parseFloat(hb);
    const hctVal = parseFloat(hct);

    if (!w) {
      setResult({ error: "Please enter weight" });
      return;
    }

    if (!ageNum) {
      setResult({ error: "Please enter age in days" });
      return;
    }

    if (!hbVal && !hctVal) {
      setResult({ error: "Please enter Hb or Hct" });
      return;
    }

    // Determine category
    const isPreterm = (gaNum && gaNum <= 32) || w < 1.5;
    const category = isPreterm ? "preterm" : "term";

    // Determine age group
    let ageGroup;
    if (ageNum <= 7) ageGroup = "1-7";
    else if (ageNum <= 14) ageGroup = "8-14";
    else ageGroup = "15+";

    // Get thresholds
    const thresholds = getThresholds(category, ageGroup, hasRespSupport);

    // Check if transfusion indicated
    let transfusionIndicated = false;
    let reasons = [];

    if (hbVal && hbVal <= thresholds.hb) {
      transfusionIndicated = true;
      reasons.push(`Hb ${hbVal} ≤ ${thresholds.hb} g/dL`);
    }
    if (hctVal && hctVal <= thresholds.hct) {
      transfusionIndicated = true;
      reasons.push(`Hct ${hctVal} ≤ ${thresholds.hct}%`);
    }

    // Calculate dose: 15 ml/kg standard
    let dosePerKg = 15;
    let doseNote = "Standard dose: 15 ml/kg";

    const totalDose = w * dosePerKg;
    const units = totalDose / UNIT_VOLUME;

    setResult({
      transfusionIndicated,
      reasons: reasons.length > 0 ? reasons : ["Values above threshold"],
      thresholds,
      category,
      categoryLabel: isPreterm ? "Preterm (BW <1.5kg or GA ≤32wk)" : "Late Preterm/Term (≥32wk or >1.5kg)",
      ageGroup: ageNum <= 7 ? "1-7 days" : ageNum <= 14 ? "8-14 days" : "≥15 days",
      dosePerKg,
      doseNote,
      totalDose: totalDose.toFixed(1),
      units: units.toFixed(2),
      respSupport: hasRespSupport
    });
  };

  const reset = () => {
    setWeight("");
    setAge("");
    setGa("");
    setHb("");
    setHct("");
    setHasRespSupport(false);
    setResult(null);
  };

  // Guideline tables data for reference display
  const pretermTable = [
    { age: "1-7 days", respHct: "≤35", respHb: "≤12", noRespHct: "≤33", noRespHb: "≤11" },
    { age: "8-14 days", respHct: "≤33", respHb: "≤11", noRespHct: "≤27", noRespHb: "≤9" },
    { age: "≥15 days", respHct: "≤30", respHb: "≤10", noRespHct: "≤25", noRespHb: "≤8" }
  ];

  const termTable = [
    { age: "1-7 days", respHct: "≤40", respHb: "≤13.5", noRespHct: "≤35", noRespHb: "≤12" },
    { age: "8-14 days", respHct: "≤35", respHb: "≤12", noRespHct: "≤30", noRespHb: "≤10" },
    { age: "≥15 days", respHct: "≤33", respHb: "≤11", noRespHct: "≤23", noRespHb: "≤7.7" }
  ];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          {/* Patient Info */}
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="1.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="nightingale-input font-mono h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Age (days)</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                      className="nightingale-input font-mono h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">GA (weeks)</Label>
                    <Input
                      type="number"
                      placeholder="32"
                      value={ga}
                      onChange={(e) => setGa(e.target.value)}
                      className="nightingale-input font-mono h-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lab Values */}
            <Card className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Lab Values</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Hb (g/dL)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 10"
                      value={hb}
                      onChange={(e) => setHb(e.target.value)}
                      className="nightingale-input font-mono h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Hct (%)</Label>
                    <Input
                      type="number"
                      step="1"
                      placeholder="e.g., 30"
                      value={hct}
                      onChange={(e) => setHct(e.target.value)}
                      className="nightingale-input font-mono h-9"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <Checkbox
                    id="respSupport"
                    checked={hasRespSupport}
                    onCheckedChange={setHasRespSupport}
                  />
                  <Label htmlFor="respSupport" className="cursor-pointer text-sm">
                    On Respiratory Support (Vent/CPAP/O2 NC)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={reset} className="flex-1 rounded-2xl">
                Reset
              </Button>
              <Button onClick={calculate} className="flex-1 nightingale-btn-primary">
                Calculate
              </Button>
            </div>

            {/* Results */}
            {result && !result.error && (
              <Card className={`rounded-2xl ${result.transfusionIndicated ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'border-green-300 bg-green-50 dark:bg-green-950/30'}`}>
                <CardContent className="pt-4 space-y-4">
                  {/* Indication */}
                  <div className={`text-center p-4 rounded-xl ${result.transfusionIndicated ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                    <p className={`text-lg font-bold ${result.transfusionIndicated ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                      {result.transfusionIndicated ? "Transfusion Indicated" : "Transfusion Not Indicated"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{result.reasons.join(", ")}</p>
                  </div>

                  {/* Thresholds */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                      <p className="text-xs text-muted-foreground">Hb Threshold</p>
                      <p className="text-xl font-mono font-bold">≤ {result.thresholds.hb} g/dL</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                      <p className="text-xs text-muted-foreground">Hct Threshold</p>
                      <p className="text-xl font-mono font-bold">≤ {result.thresholds.hct}%</p>
                    </div>
                  </div>

                  {/* Dose Calculation */}
                  {result.transfusionIndicated && (
                    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border">
                      <p className="text-xs text-muted-foreground mb-2">{result.doseNote}</p>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Recommended Dose</p>
                        <p className="text-3xl font-mono font-bold text-red-600 dark:text-red-400">
                          {result.totalDose} ml
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {result.dosePerKg} ml/kg × {weight} kg = {result.totalDose} ml ({result.units} units)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Category Info */}
                  <div className="text-xs text-muted-foreground text-center space-y-1">
                    <p><span className="font-medium">Category:</span> {result.categoryLabel}</p>
                    <p><span className="font-medium">Age Group:</span> {result.ageGroup}</p>
                    <p><span className="font-medium">Respiratory Support:</span> {result.respSupport ? "Yes" : "No"}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {result?.error && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 rounded-2xl">
                <CardContent className="pt-4">
                  <p className="text-red-600 text-center">{result.error}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-4">
            {/* Preterm Table */}
            <Card className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">BW &lt;1.5kg or GA ≤32 weeks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Age</th>
                        <th className="text-center py-2" colSpan={2}>Resp Support</th>
                        <th className="text-center py-2" colSpan={2}>No Resp Support</th>
                      </tr>
                      <tr className="border-b text-muted-foreground">
                        <th></th>
                        <th className="text-center py-1">Hct</th>
                        <th className="text-center py-1">Hb</th>
                        <th className="text-center py-1">Hct</th>
                        <th className="text-center py-1">Hb</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pretermTable.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2 font-medium">{row.age}</td>
                          <td className="text-center py-2 text-red-600">{row.respHct}</td>
                          <td className="text-center py-2 text-red-600">{row.respHb}</td>
                          <td className="text-center py-2 text-blue-600">{row.noRespHct}</td>
                          <td className="text-center py-2 text-blue-600">{row.noRespHb}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Term Table */}
            <Card className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">GA ≥32 weeks and/or &gt;1.5kg</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Age</th>
                        <th className="text-center py-2" colSpan={2}>Resp Support</th>
                        <th className="text-center py-2" colSpan={2}>No Resp Support</th>
                      </tr>
                      <tr className="border-b text-muted-foreground">
                        <th></th>
                        <th className="text-center py-1">Hct</th>
                        <th className="text-center py-1">Hb</th>
                        <th className="text-center py-1">Hct</th>
                        <th className="text-center py-1">Hb</th>
                      </tr>
                    </thead>
                    <tbody>
                      {termTable.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2 font-medium">{row.age}</td>
                          <td className="text-center py-2 text-red-600">{row.respHct}</td>
                          <td className="text-center py-2 text-red-600">{row.respHb}</td>
                          <td className="text-center py-2 text-blue-600">{row.noRespHct}</td>
                          <td className="text-center py-2 text-blue-600">{row.noRespHb}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Reference Notes */}
            <Card className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• <span className="font-medium">Respiratory support</span> includes: Mechanical ventilation, CPAP, O2 by nasal cannula</p>
                <p>• <span className="font-medium">Dose:</span> 20 ml/kg PRBC (10-15 ml/kg if Hct &gt;30%)</p>
                <p>• <span className="font-medium">1 unit PRBC</span> = 280 ml</p>
                <p>• Transfuse over 3-4 hours</p>
                <p className="pt-2 border-t">• <span className="font-medium">Polycythemia:</span> Hct &gt;65% or Hb &gt;22 g/dL in term infant</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};

// Exchange Transfusion Calculator Page
const ExchangeCalculatorPage = () => {
  const [activeTab, setActiveTab] = useState("partial");
  const [weight, setWeight] = useState("");
  const [observedHct, setObservedHct] = useState("");
  const [desiredHct, setDesiredHct] = useState("55");

  const calculatePartialExchange = () => {
    const w = parseFloat(weight) || 0;
    const obsHct = parseFloat(observedHct) || 0;
    const desHct = parseFloat(desiredHct) || 55;
    
    if (obsHct <= 0 || w <= 0) return null;
    
    // Formula: 80 × wt × (Observed Hct - Desired Hct) / Observed Hct
    const volume = (80 * w * (obsHct - desHct)) / obsHct;
    
    return {
      volume: Math.max(0, volume).toFixed(1),
      weight: w,
      obsHct,
      desHct,
      isIndicated: obsHct > 65
    };
  };

  const calculateWholeBloodExchange = () => {
    const w = parseFloat(weight) || 0;
    if (w <= 0) return null;
    
    // Formula: 2 × 85 ml × weight (double volume exchange)
    const totalVolume = 2 * 85 * w;
    const singleVolume = 85 * w;
    
    return {
      totalVolume: totalVolume.toFixed(1),
      singleVolume: singleVolume.toFixed(1),
      weight: w
    };
  };

  const partialResult = calculatePartialExchange();
  const wholeBloodResult = calculateWholeBloodExchange();

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="partial">Partial Exchange</TabsTrigger>
          <TabsTrigger value="whole">Whole Blood</TabsTrigger>
        </TabsList>

        {/* Partial Exchange (Polycythemia) */}
        <TabsContent value="partial" className="space-y-4">
          {/* Indications */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 rounded-2xl">
            <CardContent className="pt-4">
              <p className="font-semibold text-sm text-amber-800 dark:text-amber-200 mb-2">Polycythemia Indications:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Hct &gt; <span className="font-bold">70%</span> in asymptomatic neonates</li>
                <li>• Hct &gt; <span className="font-bold">65%</span> in symptomatic neonates</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-medium">Symptoms:</span> Hypoglycemia, Jaundice, Jitteriness, Respiratory distress, Seizures, Cyanosis, Apnea
                </p>
              </CardContent>
            </Card>

            {/* Inputs */}
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
                      placeholder="55"
                      value={desiredHct}
                      onChange={(e) => setDesiredHct(e.target.value)}
                      className="nightingale-input font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partial Exchange Results */}
            {partialResult && parseFloat(weight) > 0 && parseFloat(observedHct) > 0 && (
              <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/30 rounded-2xl">
                <CardContent className="pt-4 space-y-4">
                  <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                    <p className="text-sm text-muted-foreground">Volume to be Withdrawn</p>
                    <p className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400">
                      {partialResult.volume} <span className="text-lg">ml</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Replace with equal volume of Normal Saline
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formula */}
            <Card className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Formula</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-xs text-center">
                  Volume = (80 × Wt × (Obs Hct - Desired Hct)) / Obs Hct
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Perform partial exchange transfusion</li>
                  <li>• Remove calculated blood and replace with NS/IVF</li>
                  <li>• Target: Reduce Hct to ~55%</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whole Blood Exchange (for Neonatal Jaundice) */}
          <TabsContent value="whole" className="space-y-4">
            {/* Indications */}
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 rounded-2xl">
              <CardContent className="pt-4">
                <p className="font-semibold text-sm text-amber-800 dark:text-amber-200 mb-2">Neonatal Jaundice Exchange Indications:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• TSB at exchange level per gestational age</li>
                  <li>• Failed intensive phototherapy</li>
                  <li>• Signs of acute bilirubin encephalopathy</li>
                  <li>• Hemolytic disease with rapid TSB rise</li>
                </ul>
              </CardContent>
            </Card>

            {/* Weight Input */}
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
              </CardContent>
            </Card>

            {/* Whole Blood Exchange Results */}
            {wholeBloodResult && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 rounded-2xl">
                <CardContent className="pt-4 space-y-4">
                  <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                    <p className="text-sm text-muted-foreground">Double Volume Exchange</p>
                    <p className="text-4xl font-mono font-bold text-red-600 dark:text-red-400">
                      {wholeBloodResult.totalVolume} <span className="text-lg">ml</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      2 × 85 ml/kg × {wholeBloodResult.weight} kg
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 text-center">
                      <p className="text-xs text-muted-foreground">Single Volume</p>
                      <p className="text-xl font-mono font-bold">{wholeBloodResult.singleVolume} ml</p>
                      <p className="text-xs text-muted-foreground">85 ml/kg</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 text-center">
                      <p className="text-xs text-muted-foreground">Blood Volume</p>
                      <p className="text-xl font-mono font-bold">{wholeBloodResult.singleVolume} ml</p>
                      <p className="text-xs text-muted-foreground">Estimated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formula & Procedure */}
            <Card className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Formula & Procedure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-xs text-center">
                  Double Volume = 2 × 85 ml/kg × Weight
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use whole blood or reconstituted blood</li>
                  <li>• Exchange in 5-10 ml aliquots</li>
                  <li>• Remove baby&apos;s blood, replace with donor blood</li>
                  <li>• Monitor vitals, glucose, calcium during procedure</li>
                  <li>• Removes ~85% of baby&apos;s blood/bilirubin</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};

// Intubation Calculator Dialog
const IntubationPage = () => {
  const [weight, setWeight] = useState("");
  const [gestationalAge, setGestationalAge] = useState("");

  // Endotracheal Intubation Guidelines
  const guidelines = [
    { gaRange: "<28", weightRange: "<1.0", tubeSize: "2.5", depthRange: "6-7" },
    { gaRange: "28-34", weightRange: "1.0-2.0", tubeSize: "3.0", depthRange: "7-8" },
    { gaRange: "34-38", weightRange: "2.0-3.0", tubeSize: "3.5", depthRange: "8-9" },
    { gaRange: ">38", weightRange: ">3.0", tubeSize: "3.5-4.0", depthRange: "9-10" }
  ];

  const calculateResults = () => {
    const w = parseFloat(weight) || 0;
    const ga = parseInt(gestationalAge) || 0;

    if (w <= 0 && ga <= 0) return null;

    // Calculate depth using formula: 6 + weight (kg)
    const calculatedDepth = w > 0 ? (6 + w).toFixed(1) : null;

    // Determine tube size and reference depth based on weight or GA
    let tubeSize = "";
    let referenceDepth = "";
    let category = "";

    if (w > 0) {
      if (w < 1.0) {
        tubeSize = "2.5";
        referenceDepth = "6-7";
        category = "<1.0 kg";
      } else if (w <= 2.0) {
        tubeSize = "3.0";
        referenceDepth = "7-8";
        category = "1.0-2.0 kg";
      } else if (w <= 3.0) {
        tubeSize = "3.5";
        referenceDepth = "8-9";
        category = "2.0-3.0 kg";
      } else {
        tubeSize = "3.5-4.0";
        referenceDepth = "9-10";
        category = ">3.0 kg";
      }
    } else if (ga > 0) {
      if (ga < 28) {
        tubeSize = "2.5";
        referenceDepth = "6-7";
        category = "<28 weeks";
      } else if (ga <= 34) {
        tubeSize = "3.0";
        referenceDepth = "7-8";
        category = "28-34 weeks";
      } else if (ga <= 38) {
        tubeSize = "3.5";
        referenceDepth = "8-9";
        category = "34-38 weeks";
      } else {
        tubeSize = "3.5-4.0";
        referenceDepth = "9-10";
        category = ">38 weeks";
      }
    }

    return {
      tubeSize,
      referenceDepth,
      calculatedDepth,
      category,
      weight: w,
      ga
    };
  };

  const result = calculateResults();

  return (
    <div className="space-y-4">
      {/* Input */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Patient Information</CardTitle>
          <CardDescription className="text-xs">Enter weight or gestational age</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 1.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="nightingale-input font-mono h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">GA (weeks)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 32"
                    value={gestationalAge}
                    onChange={(e) => setGestationalAge(e.target.value)}
                    className="nightingale-input font-mono h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl">
              <CardContent className="pt-4 space-y-4">
                {/* Category */}
                <div className="text-center text-sm text-muted-foreground">
                  Category: <span className="font-medium text-purple-600 dark:text-purple-400">{result.category}</span>
                </div>

                {/* ET Tube Size */}
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border text-center">
                  <p className="text-xs text-muted-foreground mb-1">ET Tube Size (ID)</p>
                  <p className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400">
                    {result.tubeSize} <span className="text-lg">mm</span>
                  </p>
                </div>

                {/* Depth */}
                <div className="grid grid-cols-2 gap-3">
                  {result.calculatedDepth && (
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                      <p className="text-xs text-muted-foreground">Calculated Depth</p>
                      <p className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">{result.calculatedDepth} cm</p>
                      <p className="text-xs text-muted-foreground mt-1">6 + {result.weight} kg</p>
                    </div>
                  )}
                  <div className={`p-3 rounded-xl bg-white dark:bg-gray-800 border text-center ${!result.calculatedDepth ? 'col-span-2' : ''}`}>
                    <p className="text-xs text-muted-foreground">Reference Depth</p>
                    <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">{result.referenceDepth} cm</p>
                    <p className="text-xs text-muted-foreground mt-1">From upper lip</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reference Table */}
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Reference Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">GA (wk)</th>
                      <th className="text-center py-2">Weight (kg)</th>
                      <th className="text-center py-2">Tube (mm)</th>
                      <th className="text-center py-2">Depth (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guidelines.map((row, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{row.gaRange}</td>
                        <td className="text-center py-2">{row.weightRange}</td>
                        <td className="text-center py-2 font-bold text-purple-600">{row.tubeSize}</td>
                        <td className="text-center py-2">{row.depthRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Formula */}
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Formula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-sm text-center">
                Depth (cm) = <span className="text-purple-600 font-bold">6 + Weight (kg)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                • Measure from upper lip to mid-trachea
              </p>
            </CardContent>
          </Card>
        </div>
  );
};

// Blood Pressure Guidelines Page
const BloodPressurePage = () => {
  const [ageType, setAgeType] = useState("dayOne"); // "dayOne" or "postConceptional"
  const [gestationalAge, setGestationalAge] = useState("");

  // Day One Blood Pressure Data (GA 22-42 weeks)
  const dayOneData = {
    22: { systolic: { high: 55, normal: 39, low: 22 }, diastolic: { high: 31, normal: 22, low: 14 }, mean: { high: 39, normal: 28, low: 17 } },
    23: { systolic: { high: 56, normal: 40, low: 23 }, diastolic: { high: 32, normal: 24, low: 15 }, mean: { high: 40, normal: 29, low: 18 } },
    24: { systolic: { high: 57, normal: 42, low: 25 }, diastolic: { high: 33, normal: 25, low: 16 }, mean: { high: 41, normal: 31, low: 19 } },
    25: { systolic: { high: 58, normal: 43, low: 26 }, diastolic: { high: 34, normal: 26, low: 17 }, mean: { high: 42, normal: 32, low: 20 } },
    26: { systolic: { high: 60, normal: 44, low: 27 }, diastolic: { high: 35, normal: 27, low: 18 }, mean: { high: 43, normal: 33, low: 21 } },
    27: { systolic: { high: 61, normal: 45, low: 29 }, diastolic: { high: 36, normal: 29, low: 19 }, mean: { high: 44, normal: 34, low: 22 } },
    28: { systolic: { high: 63, normal: 47, low: 31 }, diastolic: { high: 37, normal: 29, low: 20 }, mean: { high: 46, normal: 35, low: 24 } },
    29: { systolic: { high: 64, normal: 48, low: 33 }, diastolic: { high: 38, normal: 30, low: 21 }, mean: { high: 47, normal: 36, low: 25 } },
    30: { systolic: { high: 66, normal: 50, low: 35 }, diastolic: { high: 39, normal: 31, low: 22 }, mean: { high: 48, normal: 37, low: 26 } },
    31: { systolic: { high: 68, normal: 51, low: 36 }, diastolic: { high: 40, normal: 32, low: 23 }, mean: { high: 49, normal: 38, low: 27 } },
    32: { systolic: { high: 69, normal: 52, low: 37 }, diastolic: { high: 41, normal: 33, low: 24 }, mean: { high: 50, normal: 39, low: 28 } },
    33: { systolic: { high: 70, normal: 53, low: 38 }, diastolic: { high: 42, normal: 34, low: 25 }, mean: { high: 51, normal: 40, low: 29 } },
    34: { systolic: { high: 71, normal: 55, low: 40 }, diastolic: { high: 43, normal: 35, low: 26 }, mean: { high: 52, normal: 42, low: 31 } },
    35: { systolic: { high: 73, normal: 57, low: 41 }, diastolic: { high: 44, normal: 36, low: 27 }, mean: { high: 54, normal: 43, low: 32 } },
    36: { systolic: { high: 75, normal: 59, low: 42 }, diastolic: { high: 45, normal: 37, low: 28 }, mean: { high: 55, normal: 44, low: 33 } },
    37: { systolic: { high: 76, normal: 60, low: 44 }, diastolic: { high: 46, normal: 38, low: 29 }, mean: { high: 56, normal: 45, low: 34 } },
    38: { systolic: { high: 77, normal: 61, low: 46 }, diastolic: { high: 47, normal: 39, low: 30 }, mean: { high: 57, normal: 46, low: 35 } },
    39: { systolic: { high: 79, normal: 62, low: 47 }, diastolic: { high: 48, normal: 40, low: 31 }, mean: { high: 58, normal: 47, low: 36 } },
    40: { systolic: { high: 81, normal: 64, low: 48 }, diastolic: { high: 49, normal: 41, low: 32 }, mean: { high: 60, normal: 49, low: 37 } },
    41: { systolic: { high: 82, normal: 65, low: 50 }, diastolic: { high: 50, normal: 42, low: 33 }, mean: { high: 61, normal: 50, low: 39 } },
    42: { systolic: { high: 84, normal: 67, low: 51 }, diastolic: { high: 51, normal: 43, low: 34 }, mean: { high: 62, normal: 51, low: 40 } }
  };

  // Post-Conceptional Age Blood Pressure Data (24-46 weeks)
  const postConceptionalData = {
    24: { systolic: { high: 68, normal: 49, low: 33 }, diastolic: { high: 46, normal: 29, low: 14 }, mean: { high: 53, normal: 36, low: 20 } },
    25: { systolic: { high: 69, normal: 51, low: 36 }, diastolic: { high: 47, normal: 30, low: 15 }, mean: { high: 54, normal: 37, low: 22 } },
    26: { systolic: { high: 70, normal: 52, low: 38 }, diastolic: { high: 48, normal: 31, low: 17 }, mean: { high: 55, normal: 38, low: 24 } },
    27: { systolic: { high: 71, normal: 54, low: 40 }, diastolic: { high: 49, normal: 32, low: 18 }, mean: { high: 56, normal: 39, low: 25 } },
    28: { systolic: { high: 72, normal: 55, low: 41 }, diastolic: { high: 50, normal: 33, low: 19 }, mean: { high: 57, normal: 40, low: 26 } },
    29: { systolic: { high: 73, normal: 56, low: 42 }, diastolic: { high: 51, normal: 34, low: 20 }, mean: { high: 58, normal: 41, low: 27 } },
    30: { systolic: { high: 75, normal: 59, low: 43 }, diastolic: { high: 52, normal: 35, low: 21 }, mean: { high: 60, normal: 43, low: 28 } },
    31: { systolic: { high: 78, normal: 61, low: 46 }, diastolic: { high: 53, normal: 36, low: 22 }, mean: { high: 61, normal: 44, low: 30 } },
    32: { systolic: { high: 80, normal: 62, low: 48 }, diastolic: { high: 54, normal: 37, low: 23 }, mean: { high: 63, normal: 45, low: 31 } },
    33: { systolic: { high: 81, normal: 63, low: 50 }, diastolic: { high: 55, normal: 38, low: 24 }, mean: { high: 64, normal: 46, low: 33 } },
    34: { systolic: { high: 83, normal: 66, low: 51 }, diastolic: { high: 56, normal: 39, low: 25 }, mean: { high: 65, normal: 48, low: 34 } },
    35: { systolic: { high: 84, normal: 69, low: 52 }, diastolic: { high: 57, normal: 40, low: 26 }, mean: { high: 66, normal: 50, low: 35 } },
    36: { systolic: { high: 87, normal: 71, low: 55 }, diastolic: { high: 58, normal: 41, low: 27 }, mean: { high: 68, normal: 51, low: 36 } },
    37: { systolic: { high: 89, normal: 72, low: 57 }, diastolic: { high: 59, normal: 42, low: 28 }, mean: { high: 69, normal: 52, low: 38 } },
    38: { systolic: { high: 90, normal: 75, low: 59 }, diastolic: { high: 60, normal: 43, low: 29 }, mean: { high: 70, normal: 54, low: 39 } },
    39: { systolic: { high: 91, normal: 78, low: 60 }, diastolic: { high: 60, normal: 44, low: 30 }, mean: { high: 71, normal: 55, low: 40 } },
    40: { systolic: { high: 92, normal: 80, low: 61 }, diastolic: { high: 61, normal: 44, low: 30 }, mean: { high: 71, normal: 56, low: 40 } },
    41: { systolic: { high: 93, normal: 81, low: 62 }, diastolic: { high: 62, normal: 46, low: 31 }, mean: { high: 72, normal: 58, low: 41 } },
    42: { systolic: { high: 95, normal: 82, low: 63 }, diastolic: { high: 63, normal: 47, low: 32 }, mean: { high: 74, normal: 59, low: 42 } },
    43: { systolic: { high: 97, normal: 83, low: 65 }, diastolic: { high: 64, normal: 48, low: 33 }, mean: { high: 75, normal: 60, low: 44 } },
    44: { systolic: { high: 98, normal: 86, low: 67 }, diastolic: { high: 65, normal: 49, low: 34 }, mean: { high: 76, normal: 61, low: 45 } },
    45: { systolic: { high: 100, normal: 88, low: 69 }, diastolic: { high: 66, normal: 50, low: 35 }, mean: { high: 77, normal: 63, low: 46 } },
    46: { systolic: { high: 102, normal: 89, low: 71 }, diastolic: { high: 66, normal: 51, low: 36 }, mean: { high: 78, normal: 64, low: 48 } }
  };

  const currentData = ageType === "dayOne" ? dayOneData : postConceptionalData;
  const gaOptions = Object.keys(currentData).map(Number).sort((a, b) => a - b);
  const selectedData = gestationalAge ? currentData[parseInt(gestationalAge)] : null;

  return (
    <div className="space-y-4">
          {/* Age Type Selector */}
          <Card className="nightingale-card">
            <CardContent className="pt-4 space-y-3">
              <Label className="text-sm font-medium">Select Age Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setAgeType("dayOne"); setGestationalAge(""); }}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    ageType === "dayOne" 
                      ? "border-[#00d9c5] bg-[#00d9c5]/10" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-sm">Day One</p>
                  <p className="text-xs text-muted-foreground">First day of life</p>
                </button>
                <button
                  onClick={() => { setAgeType("postConceptional"); setGestationalAge(""); }}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    ageType === "postConceptional" 
                      ? "border-[#00d9c5] bg-[#00d9c5]/10" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-sm">Post-Conceptional</p>
                  <p className="text-xs text-muted-foreground">Corrected age</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Gestational Age Selector */}
          <Card className="nightingale-card">
            <CardContent className="pt-4 space-y-2">
              <Label className="text-sm font-medium">
                {ageType === "dayOne" ? "Gestational Age" : "Post-Conceptional Age"} (weeks)
              </Label>
              <select
                value={gestationalAge}
                onChange={(e) => setGestationalAge(e.target.value)}
                className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm font-mono"
              >
                <option value="">Select age...</option>
                {gaOptions.map(ga => (
                  <option key={ga} value={ga}>{ga} weeks</option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Blood Pressure Results */}
          {selectedData && (
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">
                  BP Values for {gestationalAge} weeks ({ageType === "dayOne" ? "Day 1" : "Post-Conceptional"})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Lowest (5th percentile) */}
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Lowest (5th %ile)</span>
                    <span className="text-xs text-blue-600">Hypotension threshold</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Systolic</p>
                      <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-300">{selectedData.systolic.low}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Diastolic</p>
                      <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-300">{selectedData.diastolic.low}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mean</p>
                      <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-300">{selectedData.mean.low}</p>
                    </div>
                  </div>
                </div>

                {/* Normal (50th percentile) */}
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/50 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">Normal (50th %ile)</span>
                    <span className="text-xs text-green-600">Target range</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Systolic</p>
                      <p className="text-lg font-mono font-bold text-green-700 dark:text-green-300">{selectedData.systolic.normal}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Diastolic</p>
                      <p className="text-lg font-mono font-bold text-green-700 dark:text-green-300">{selectedData.diastolic.normal}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mean</p>
                      <p className="text-lg font-mono font-bold text-green-700 dark:text-green-300">{selectedData.mean.normal}</p>
                    </div>
                  </div>
                </div>

                {/* Highest (95th percentile) */}
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/50 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-red-700 dark:text-red-300">Highest (95th %ile)</span>
                    <span className="text-xs text-red-600">Hypertension threshold</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Systolic</p>
                      <p className="text-lg font-mono font-bold text-red-700 dark:text-red-300">{selectedData.systolic.high}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Diastolic</p>
                      <p className="text-lg font-mono font-bold text-red-700 dark:text-red-300">{selectedData.diastolic.high}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mean</p>
                      <p className="text-lg font-mono font-bold text-red-700 dark:text-red-300">{selectedData.mean.high}</p>
                    </div>
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
              <p>• Source: Zubrow et al. Philadelphia Neonatal BP Study Group, J Perinatology 1995</p>
              <p>• <span className="font-medium">Day One:</span> BP values on first day of life</p>
              <p>• <span className="font-medium">Post-Conceptional:</span> Corrected gestational age</p>
              <p>• MAP = Diastolic + ⅓(Systolic - Diastolic)</p>
            </CardContent>
          </Card>
    </div>
  );
};

export default NICUCalculator;
