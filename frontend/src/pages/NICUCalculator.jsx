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

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Droplets, Home, FlaskConical, Zap, Settings, X, Stethoscope, Activity, Repeat, Check, Clock, GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";
import JaundiceDialog from "@/components/JaundiceDialog";
import GIRDialog from "@/components/GIRDialog";
import BloodProductsDialog from "@/components/BloodProductsDialog";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

const GrowthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="M18 17V9"/>
    <path d="M13 17V5"/>
    <path d="M8 17v-3"/>
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

// Sortable Widget Component for NICU drag and drop
const SortableNICUWidget = ({ widget, isEditMode, onClick, getWidgetIcon }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onClick={() => !isEditMode && onClick(widget.id)}
      className={`nightingale-card transition-all duration-200 h-36 ${
        isEditMode ? 'cursor-grab active:cursor-grabbing ring-2 ring-[#00d9c5]/30' : 'cursor-pointer hover:scale-[1.02]'
      } ${isDragging ? 'shadow-2xl scale-105' : ''} ${widget.comingSoon ? 'opacity-60' : ''}`}
      data-testid={`widget-${widget.id}`}
    >
      <CardContent className="p-3 relative h-full flex items-center justify-center">
        {isEditMode && (
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#00d9c5]/20 text-[#00d9c5] cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}
        <div className="flex flex-col items-center text-center gap-2">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${widget.color}-100 dark:bg-${widget.color}-900/30`}
            style={{ backgroundColor: widget.color === 'teal' ? 'rgba(0,217,197,0.1)' : undefined }}
          >
            {getWidgetIcon(widget.icon, widget.color)}
          </div>
          <h3 className="font-heading font-semibold text-xs leading-tight px-1">{widget.title}</h3>
          {widget.comingSoon && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] text-gray-500">
              Coming Soon
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

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
  const [activeId, setActiveId] = useState(null);
  const [widgets, setWidgets] = useState([
    { id: "fluid", title: "Fluid Calculator", icon: "droplets", color: "teal", enabled: true },
    { id: "nrp", title: "NRP Checklist", icon: "nrp", color: "red", enabled: true },
    { id: "catheter", title: "UVC/UAC Calculator", icon: "catheter", color: "blue", enabled: true },
    { id: "intubation", title: "Intubation", icon: "intubation", color: "purple", enabled: true },
    { id: "bp", title: "Blood Pressure", icon: "activity", color: "red", enabled: true },
    { id: "prbc", title: "PRBC Transfusion", icon: "blood", color: "red", enabled: true },
    { id: "exchange", title: "Exchange Transfusion", icon: "repeat", color: "purple", enabled: true },
    { id: "growth", title: "Growth Charts", icon: "growth", color: "teal", enabled: true }
  ]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex(w => w.id === active.id);
      const newIndex = widgets.findIndex(w => w.id === over.id);
      setWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
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
      case "growth": return <span className={colorClass}><GrowthIcon /></span>;
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
      <main className="fixed top-[72px] bottom-[100px] left-0 right-0 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-full native-scroll py-4">
          {currentPage === "main" ? (
            <>
              {isEditMode && (
                <div className="mb-4 p-3 rounded-xl bg-[#00d9c5]/10 border border-[#00d9c5]/30 text-sm text-center flex items-center justify-center gap-2">
                  <GripVertical className="h-4 w-4 text-[#00d9c5]" />
                  <span>Drag widgets to rearrange</span>
                </div>
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={widgets.filter(w => w.enabled).map(w => w.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 gap-4">
                    {widgets.filter(w => w.enabled).map((widget) => (
                      <SortableNICUWidget
                        key={widget.id}
                        widget={widget}
                        isEditMode={isEditMode}
                        onClick={handleWidgetClick}
                        getWidgetIcon={getWidgetIcon}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <Card className="nightingale-card h-36 shadow-2xl scale-105 ring-2 ring-[#00d9c5]">
                      <CardContent className="p-3 h-full flex items-center justify-center">
                        <div className="flex flex-col items-center text-center gap-2">
                          {(() => {
                            const w = widgets.find(x => x.id === activeId);
                            if (!w) return null;
                            return (
                              <>
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${w.color}-100 dark:bg-${w.color}-900/30`}
                                  style={{ backgroundColor: w.color === 'teal' ? 'rgba(0,217,197,0.1)' : undefined }}
                                >
                                  {getWidgetIcon(w.icon, w.color)}
                                </div>
                                <h3 className="font-heading font-semibold text-xs leading-tight px-1">{w.title}</h3>
                              </>
                            );
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </>
          ) : (
            /* Render Page Content based on currentPage */
            <div className="space-y-4 pt-4 pb-8">
              {currentPage === "fluid" && <FluidCalculatorPage />}
              {currentPage === "nrp" && <NRPChecklistPage />}
              {currentPage === "catheter" && <CatheterCalculatorPage />}
              {currentPage === "intubation" && <IntubationPage />}
              {currentPage === "bp" && <BloodPressurePage />}
              {currentPage === "prbc" && <PRBCGuidelinePage />}
              {currentPage === "exchange" && <ExchangeCalculatorPage />}
              {currentPage === "growth" && <GrowthChartPage />}
            </div>
          )}
        </div>
      </main>

      {/* Floating Tab Bar */}
      <nav className="floating-tab-bar">
        <div className="flex items-center gap-0.5">
          <button onClick={() => handleTabClick("home")} className={`tab-item ${activeTab === "home" ? "active" : ""}`}>
            <Home className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("bloodgas")} className={`tab-item ${activeTab === "bloodgas" ? "active" : ""}`}>
            <Droplets className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("electrolytes")} className={`tab-item ${activeTab === "electrolytes" ? "active" : ""}`}>
            <FlaskConical className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("bloodproducts")} className={`tab-item ${activeTab === "bloodproducts" ? "active" : ""}`}>
            <span className={activeTab === "bloodproducts" ? "text-red-400" : ""}><BloodDropIcon /></span>
          </button>
          <button onClick={() => handleTabClick("gir")} className={`tab-item ${activeTab === "gir" ? "active" : ""}`}>
            <Zap className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("jaundice")} className={`tab-item ${activeTab === "jaundice" ? "active" : ""}`}>
            <span className={activeTab === "jaundice" ? "text-amber-400" : ""}><JaundiceIcon /></span>
          </button>
        </div>
      </nav>

      {/* Navigation Dialogs */}
      <BloodGasDialog open={bloodGasOpen} onOpenChange={(open) => { setBloodGasOpen(open); if (!open) setActiveTab(""); }} />
      <ElectrolytesDialog open={electrolytesOpen} onOpenChange={(open) => { setElectrolytesOpen(open); if (!open) setActiveTab(""); }} />
      <JaundiceDialog open={jaundiceOpen} onOpenChange={(open) => { setJaundiceOpen(open); if (!open) setActiveTab(""); }} />
      <GIRDialog open={girOpen} onOpenChange={(open) => { setGirOpen(open); if (!open) setActiveTab(""); }} />
      <BloodProductsDialog open={bloodProductsOpen} onOpenChange={(open) => { setBloodProductsOpen(open); if (!open) setActiveTab(""); }} />
    </div>
  );
};

// Enhanced Fluid Calculator Page with Order Summary
const FluidCalculatorPage = () => {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gestationalAge, setGestationalAge] = useState("");
  const [tfi, setTfi] = useState("");
  
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
    <div className="space-y-4 pt-4">
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

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="space-y-4 pt-4">
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

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="space-y-4 pt-4">
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

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="space-y-4 pt-4">
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

  // Scroll to top when component mounts (works on mobile)
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

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
    <div className="space-y-4 pt-4">
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

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="space-y-4 pt-4">
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

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="space-y-4 pt-4">
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

// Growth Chart Page - CDC/WHO Charts for Weight, Height, Head Circumference
const GrowthChartPage = () => {
  const [chartType, setChartType] = useState("WHO"); // CDC or WHO
  const [gender, setGender] = useState("male");
  const [activeChart, setActiveChart] = useState("weight"); // weight, length, hc
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    ageValue: "",
    weight: "",
    length: "",
    hc: ""
  });
  const chartRef = React.useRef(null);

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if WHO or CDC is selected
  const isWHO = chartType === "WHO";

  const addEntry = () => {
    if (newEntry.date && newEntry.ageValue) {
      // Convert to months: WHO uses months directly, CDC uses years
      const ageInMonths = isWHO 
        ? parseFloat(newEntry.ageValue) || 0
        : (parseFloat(newEntry.ageValue) || 0) * 12;
      
      setEntries([...entries, { 
        ...newEntry, 
        id: Date.now(),
        ageInMonths,
        ageUnit: isWHO ? 'months' : 'years',
        chartTypeUsed: chartType
      }]);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        ageValue: "",
        weight: "",
        length: "",
        hc: ""
      });
    }
  };

  const removeEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // WHO Growth Standards Data (Birth to 2 years - 0-24 months)
  // Based on WHO Child Growth Standards
  const getWHOData = () => {
    const months = Array.from({ length: 25 }, (_, i) => i); // 0-24 months
    
    return {
      weight: {
        male: {
          p3:  [2.5, 3.4, 4.3, 5.0, 5.6, 6.0, 6.4, 6.7, 6.9, 7.1, 7.4, 7.6, 7.7, 7.9, 8.1, 8.3, 8.4, 8.6, 8.8, 8.9, 9.1, 9.2, 9.4, 9.5, 9.7],
          p15: [2.9, 3.9, 4.9, 5.7, 6.2, 6.7, 7.1, 7.4, 7.7, 8.0, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2, 9.4, 9.6, 9.7, 9.9, 10.1, 10.3, 10.4, 10.6, 10.8],
          p50: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.8, 12.0, 12.2],
          p85: [3.9, 5.1, 6.3, 7.2, 7.8, 8.4, 8.8, 9.2, 9.6, 9.9, 10.2, 10.5, 10.8, 11.0, 11.3, 11.5, 11.8, 12.0, 12.2, 12.5, 12.7, 12.9, 13.2, 13.4, 13.7],
          p97: [4.4, 5.8, 7.1, 8.0, 8.7, 9.3, 9.8, 10.3, 10.7, 11.0, 11.4, 11.7, 12.0, 12.3, 12.6, 12.8, 13.1, 13.4, 13.7, 13.9, 14.2, 14.5, 14.7, 15.0, 15.3]
        },
        female: {
          p3:  [2.4, 3.2, 3.9, 4.5, 5.0, 5.4, 5.7, 6.0, 6.3, 6.5, 6.7, 6.9, 7.0, 7.2, 7.4, 7.6, 7.7, 7.9, 8.1, 8.2, 8.4, 8.6, 8.7, 8.9, 9.0],
          p15: [2.8, 3.6, 4.5, 5.2, 5.7, 6.1, 6.5, 6.8, 7.0, 7.3, 7.5, 7.7, 7.9, 8.1, 8.3, 8.5, 8.7, 8.9, 9.1, 9.2, 9.4, 9.6, 9.8, 10.0, 10.2],
          p50: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9, 9.2, 9.4, 9.6, 9.8, 10.0, 10.2, 10.4, 10.6, 10.9, 11.1, 11.3, 11.5],
          p85: [3.7, 4.8, 5.8, 6.6, 7.3, 7.8, 8.2, 8.6, 9.0, 9.3, 9.6, 9.9, 10.1, 10.4, 10.6, 10.9, 11.1, 11.4, 11.6, 11.9, 12.1, 12.4, 12.6, 12.9, 13.1],
          p97: [4.2, 5.5, 6.6, 7.5, 8.2, 8.8, 9.3, 9.8, 10.2, 10.5, 10.9, 11.2, 11.5, 11.8, 12.1, 12.4, 12.6, 12.9, 13.2, 13.5, 13.8, 14.1, 14.4, 14.7, 15.0]
        }
      },
      length: {
        male: {
          p3:  [46.1, 51.1, 54.7, 57.6, 60.0, 61.9, 63.6, 65.1, 66.5, 67.7, 68.9, 70.0, 71.0, 72.0, 72.9, 73.8, 74.7, 75.5, 76.3, 77.1, 77.9, 78.6, 79.4, 80.1, 80.8],
          p15: [47.9, 53.0, 56.8, 59.8, 62.2, 64.2, 65.9, 67.5, 68.9, 70.2, 71.4, 72.5, 73.6, 74.6, 75.6, 76.5, 77.4, 78.3, 79.1, 79.9, 80.7, 81.5, 82.2, 83.0, 83.7],
          p50: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8],
          p85: [51.8, 56.4, 60.1, 63.1, 65.6, 67.6, 69.4, 71.0, 72.5, 73.8, 75.1, 76.4, 77.6, 78.8, 79.9, 81.0, 82.0, 83.0, 84.0, 84.9, 85.8, 86.7, 87.6, 88.4, 89.3],
          p97: [53.4, 58.0, 61.6, 64.6, 67.0, 69.1, 70.9, 72.5, 74.0, 75.4, 76.7, 78.0, 79.2, 80.4, 81.5, 82.6, 83.7, 84.7, 85.6, 86.6, 87.5, 88.4, 89.2, 90.1, 90.9]
        },
        female: {
          p3:  [45.4, 50.0, 53.2, 55.8, 57.9, 59.6, 61.2, 62.6, 63.9, 65.1, 66.2, 67.3, 68.3, 69.3, 70.2, 71.1, 72.0, 72.8, 73.6, 74.4, 75.2, 76.0, 76.7, 77.5, 78.2],
          p15: [47.0, 51.7, 55.1, 57.8, 60.0, 61.8, 63.4, 64.9, 66.3, 67.5, 68.7, 69.8, 70.9, 71.9, 72.8, 73.7, 74.6, 75.4, 76.2, 77.0, 77.8, 78.5, 79.3, 80.0, 80.7],
          p50: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.6, 85.5, 86.4],
          p85: [51.0, 55.6, 59.0, 61.8, 64.2, 66.1, 67.9, 69.5, 71.0, 72.4, 73.8, 75.1, 76.3, 77.5, 78.6, 79.7, 80.8, 81.8, 82.8, 83.7, 84.7, 85.6, 86.5, 87.3, 88.2],
          p97: [52.7, 57.3, 60.8, 63.6, 66.0, 68.0, 69.8, 71.4, 72.9, 74.4, 75.8, 77.1, 78.3, 79.5, 80.6, 81.7, 82.8, 83.8, 84.8, 85.7, 86.6, 87.5, 88.4, 89.2, 90.0]
        }
      },
      hc: {
        male: {
          p3:  [32.1, 35.2, 37.0, 38.3, 39.4, 40.3, 41.0, 41.7, 42.2, 42.7, 43.1, 43.5, 43.9, 44.2, 44.5, 44.8, 45.0, 45.3, 45.5, 45.7, 45.9, 46.1, 46.3, 46.5, 46.6],
          p15: [33.4, 36.4, 38.3, 39.6, 40.7, 41.6, 42.4, 43.0, 43.6, 44.1, 44.5, 44.9, 45.3, 45.6, 45.9, 46.2, 46.5, 46.7, 47.0, 47.2, 47.4, 47.6, 47.8, 48.0, 48.2],
          p50: [34.5, 37.3, 39.1, 40.5, 41.6, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1, 46.5, 46.7, 47.0, 47.3, 47.5, 47.8, 48.0, 48.2, 48.4, 48.6, 48.8, 49.0],
          p85: [35.6, 38.2, 40.0, 41.4, 42.5, 43.5, 44.3, 44.9, 45.5, 46.0, 46.4, 46.8, 47.1, 47.4, 47.7, 48.0, 48.2, 48.5, 48.7, 48.9, 49.1, 49.3, 49.5, 49.7, 49.9],
          p97: [36.6, 39.1, 40.9, 42.3, 43.4, 44.3, 45.1, 45.8, 46.3, 46.8, 47.3, 47.6, 48.0, 48.3, 48.6, 48.9, 49.1, 49.4, 49.6, 49.8, 50.0, 50.2, 50.4, 50.6, 50.8]
        },
        female: {
          p3:  [31.5, 34.3, 35.9, 37.1, 38.1, 38.9, 39.6, 40.2, 40.7, 41.1, 41.5, 41.9, 42.2, 42.5, 42.8, 43.0, 43.3, 43.5, 43.7, 43.9, 44.1, 44.3, 44.5, 44.7, 44.8],
          p15: [32.7, 35.5, 37.2, 38.4, 39.4, 40.2, 40.9, 41.5, 42.0, 42.5, 42.9, 43.2, 43.6, 43.9, 44.2, 44.4, 44.7, 44.9, 45.1, 45.3, 45.5, 45.7, 45.9, 46.1, 46.3],
          p50: [33.9, 36.5, 38.3, 39.5, 40.6, 41.5, 42.2, 42.8, 43.4, 43.8, 44.2, 44.6, 44.9, 45.2, 45.5, 45.8, 46.0, 46.2, 46.5, 46.7, 46.9, 47.1, 47.3, 47.5, 47.6],
          p85: [35.0, 37.6, 39.3, 40.6, 41.7, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1, 46.4, 46.7, 47.0, 47.2, 47.5, 47.7, 47.9, 48.1, 48.3, 48.5, 48.7, 48.9],
          p97: [35.9, 38.5, 40.2, 41.5, 42.6, 43.5, 44.3, 44.9, 45.5, 46.0, 46.4, 46.8, 47.2, 47.5, 47.8, 48.0, 48.3, 48.5, 48.8, 49.0, 49.2, 49.4, 49.6, 49.8, 50.0]
        }
      }
    };
  };

  // CDC Growth Data (2-20 years) - simplified version
  const getCDCData = () => {
    const years = Array.from({ length: 19 }, (_, i) => i + 2); // 2-20 years
    const monthsFrom2 = years.map(y => y * 12); // Convert to months for uniform x-axis
    
    return {
      weight: {
        male: {
          p3:  [10.5, 12.5, 14.0, 15.5, 17.0, 19.0, 21.0, 23.5, 26.0, 29.0, 32.5, 36.5, 41.0, 46.0, 51.5, 56.5, 60.5, 63.5, 65.5],
          p15: [11.5, 13.5, 15.5, 17.0, 19.0, 21.5, 24.0, 27.0, 30.0, 34.0, 38.5, 43.5, 49.0, 55.0, 61.0, 66.5, 71.0, 74.5, 77.0],
          p50: [12.5, 14.5, 16.5, 18.5, 21.0, 24.0, 27.5, 31.0, 35.0, 40.0, 45.5, 51.5, 58.0, 65.0, 72.0, 78.0, 83.0, 86.5, 89.0],
          p85: [14.0, 16.0, 18.5, 21.0, 24.0, 28.0, 32.5, 37.5, 43.0, 50.0, 57.5, 65.0, 73.0, 81.0, 89.0, 96.0, 101.5, 105.5, 108.5],
          p97: [15.5, 18.0, 21.0, 24.5, 28.5, 33.5, 39.5, 46.5, 54.0, 63.0, 73.0, 83.5, 94.0, 104.5, 114.0, 122.0, 128.5, 133.0, 136.5]
        },
        female: {
          p3:  [10.0, 12.0, 13.5, 15.0, 16.5, 18.5, 20.5, 23.0, 25.5, 28.5, 32.0, 35.5, 39.0, 42.5, 45.5, 47.5, 48.5, 49.0, 49.5],
          p15: [11.0, 13.0, 15.0, 16.5, 18.5, 21.0, 23.5, 26.5, 30.0, 34.0, 38.5, 43.0, 47.5, 51.5, 55.0, 57.5, 59.0, 60.0, 60.5],
          p50: [12.0, 14.5, 16.5, 18.5, 21.0, 24.0, 27.5, 31.5, 36.0, 41.5, 47.5, 53.5, 59.0, 64.0, 68.0, 71.0, 73.0, 74.5, 75.5],
          p85: [13.5, 16.0, 18.5, 21.5, 25.0, 29.0, 33.5, 39.0, 45.5, 53.0, 61.0, 69.0, 76.5, 83.0, 88.5, 92.5, 95.5, 97.5, 99.0],
          p97: [15.0, 18.0, 21.5, 25.5, 30.0, 35.5, 42.0, 49.5, 58.0, 68.0, 78.5, 89.0, 98.5, 107.0, 114.0, 119.5, 123.5, 126.5, 128.5]
        }
      },
      length: {
        male: {
          p3:  [82, 90, 97, 103, 108, 113, 118, 123, 128, 133, 138, 144, 151, 159, 165, 169, 172, 173, 174],
          p15: [85, 93, 100, 106, 112, 118, 123, 128, 133, 139, 145, 151, 158, 166, 172, 176, 179, 180, 181],
          p50: [88, 96, 103, 110, 116, 122, 128, 134, 140, 146, 152, 159, 166, 173, 179, 183, 186, 188, 189],
          p85: [91, 99, 107, 114, 121, 127, 133, 139, 146, 153, 160, 167, 174, 180, 186, 190, 193, 195, 196],
          p97: [94, 102, 110, 117, 124, 131, 138, 144, 151, 159, 166, 174, 181, 187, 192, 196, 199, 201, 202]
        },
        female: {
          p3:  [81, 89, 96, 101, 106, 111, 116, 121, 126, 132, 138, 144, 149, 152, 154, 155, 156, 156, 156],
          p15: [84, 92, 99, 105, 110, 116, 121, 127, 132, 138, 145, 151, 156, 159, 161, 162, 163, 163, 163],
          p50: [87, 95, 102, 109, 115, 121, 127, 133, 139, 145, 152, 158, 163, 166, 168, 169, 170, 170, 170],
          p85: [90, 98, 106, 113, 119, 126, 132, 138, 145, 152, 159, 165, 170, 173, 175, 176, 177, 178, 178],
          p97: [93, 101, 109, 116, 123, 130, 137, 144, 151, 158, 165, 171, 176, 179, 181, 183, 184, 184, 185]
        }
      },
      hc: {
        male: {
          p3:  [46.6, 48.0, 48.8, 49.4, 49.8, 50.2, 50.5, 50.8, 51.0, 51.2, 51.4, 51.6, 51.8, 52.0, 52.2, 52.4, 52.5, 52.6, 52.7],
          p15: [47.8, 49.2, 50.0, 50.6, 51.0, 51.4, 51.8, 52.0, 52.3, 52.5, 52.7, 52.9, 53.1, 53.3, 53.5, 53.7, 53.9, 54.0, 54.1],
          p50: [49.0, 50.4, 51.2, 51.8, 52.3, 52.7, 53.0, 53.3, 53.6, 53.9, 54.1, 54.3, 54.5, 54.7, 54.9, 55.1, 55.3, 55.5, 55.6],
          p85: [50.2, 51.6, 52.4, 53.0, 53.5, 54.0, 54.3, 54.6, 54.9, 55.2, 55.5, 55.7, 55.9, 56.1, 56.3, 56.5, 56.7, 56.9, 57.0],
          p97: [51.4, 52.8, 53.6, 54.3, 54.8, 55.2, 55.6, 55.9, 56.2, 56.5, 56.8, 57.0, 57.2, 57.5, 57.7, 57.9, 58.1, 58.3, 58.4]
        },
        female: {
          p3:  [45.5, 46.8, 47.5, 48.0, 48.4, 48.7, 49.0, 49.2, 49.4, 49.6, 49.8, 50.0, 50.2, 50.3, 50.4, 50.5, 50.6, 50.7, 50.8],
          p15: [46.6, 48.0, 48.7, 49.2, 49.6, 50.0, 50.3, 50.5, 50.8, 51.0, 51.2, 51.4, 51.6, 51.8, 51.9, 52.0, 52.1, 52.2, 52.3],
          p50: [47.8, 49.2, 50.0, 50.5, 51.0, 51.4, 51.7, 52.0, 52.3, 52.5, 52.8, 53.0, 53.2, 53.4, 53.5, 53.7, 53.8, 53.9, 54.0],
          p85: [49.0, 50.4, 51.2, 51.8, 52.3, 52.7, 53.0, 53.4, 53.7, 54.0, 54.2, 54.5, 54.7, 54.9, 55.1, 55.2, 55.4, 55.5, 55.6],
          p97: [50.2, 51.6, 52.5, 53.1, 53.6, 54.1, 54.5, 54.8, 55.1, 55.4, 55.7, 55.9, 56.2, 56.4, 56.6, 56.8, 56.9, 57.0, 57.1]
        }
      }
    };
  };

  // Get chart data based on selected options
  const getChartData = () => {
    const isWHO = chartType === "WHO";
    const data = isWHO ? getWHOData() : getCDCData();
    const measurementData = data[activeChart][gender];
    
    if (isWHO) {
      // WHO: 0-24 months
      return Array.from({ length: 25 }, (_, i) => ({
        age: i,
        ageLabel: i === 0 ? 'Birth' : i === 12 ? '1 yr' : i === 24 ? '2 yr' : `${i}`,
        p3: measurementData.p3[i],
        p15: measurementData.p15[i],
        p50: measurementData.p50[i],
        p85: measurementData.p85[i],
        p97: measurementData.p97[i]
      }));
    } else {
      // CDC: 2-20 years (24-240 months)
      return Array.from({ length: 19 }, (_, i) => ({
        age: (i + 2) * 12, // months
        ageLabel: `${i + 2}`,
        p3: measurementData.p3[i],
        p15: measurementData.p15[i],
        p50: measurementData.p50[i],
        p85: measurementData.p85[i],
        p97: measurementData.p97[i]
      }));
    }
  };

  // Get patient data points for plotting
  const getPatientData = () => {
    const value = activeChart === 'length' ? 'length' : activeChart;
    return entries
      .filter(e => e[value])
      .map(e => ({
        age: e.ageInMonths,
        value: parseFloat(e[value]),
        date: e.date
      }))
      .sort((a, b) => a.age - b.age);
  };

  const chartLabels = {
    weight: { title: "Weight-for-Age", unit: "kg", yLabel: "Weight (kg)" },
    length: { title: "Length/Stature-for-Age", unit: "cm", yLabel: "Length (cm)" },
    hc: { title: "Head Circumference-for-Age", unit: "cm", yLabel: "Head Circumference (cm)" }
  };

  // Save chart to gallery
  const saveToGallery = async () => {
    if (!chartRef.current) return;
    
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `growth-chart-${activeChart}-${gender}-${chartType}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const patientData = getPatientData();
  const chartData = getChartData();
  
  // Chart configuration
  const xAxisDomain = isWHO ? [0, 24] : [24, 240];
  const xAxisTicks = isWHO 
    ? [0, 3, 6, 9, 12, 15, 18, 21, 24]
    : [24, 48, 72, 96, 120, 144, 168, 192, 216, 240];

  // Percentile colors matching WHO chart style
  const percentileColors = {
    p3: '#8B0000',   // Dark red
    p15: '#CD853F',  // Peru/tan
    p50: '#228B22',  // Forest green
    p85: '#CD853F',  // Peru/tan
    p97: '#8B0000'   // Dark red
  };

  // Import Recharts components
  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } = require('recharts');

  // Format x-axis label
  const formatXAxis = (value) => {
    if (isWHO) {
      if (value === 0) return 'Birth';
      if (value === 12) return '1yr';
      if (value === 24) return '2yr';
      return `${value}`;
    } else {
      return `${value / 12}`;
    }
  };

  // Format age for display based on unit used when entry was created
  const formatAge = (entry) => {
    const val = parseFloat(entry.ageValue) || 0;
    return entry.ageUnit === 'years' ? `${val}y` : `${val}m`;
  };

  // Calculate Z-score and percentile for a measurement
  const calculateZScoreAndPercentile = (ageInMonths, value, measureType) => {
    if (!value || isNaN(parseFloat(value))) return null;
    
    const val = parseFloat(value);
    const isWHOChart = chartType === "WHO";
    const data = isWHOChart ? getWHOData() : getCDCData();
    const measureData = data[measureType]?.[gender];
    
    if (!measureData) return null;
    
    // Find the closest age index
    let ageIndex;
    if (isWHOChart) {
      ageIndex = Math.round(ageInMonths);
      if (ageIndex < 0) ageIndex = 0;
      if (ageIndex > 24) ageIndex = 24;
    } else {
      // CDC is 2-20 years (24-240 months)
      const yearIndex = Math.round(ageInMonths / 12) - 2;
      if (yearIndex < 0) ageIndex = 0;
      else if (yearIndex > 18) ageIndex = 18;
      else ageIndex = yearIndex;
    }
    
    // Get percentile values at this age
    const p3 = measureData.p3[ageIndex];
    const p15 = measureData.p15[ageIndex];
    const p50 = measureData.p50[ageIndex];
    const p85 = measureData.p85[ageIndex];
    const p97 = measureData.p97[ageIndex];
    
    // Estimate standard deviation using the percentile spread
    // Z-score for p3 ≈ -1.88, p15 ≈ -1.04, p50 = 0, p85 ≈ 1.04, p97 ≈ 1.88
    const sd = (p97 - p3) / 3.76; // Approximate SD from 3rd to 97th percentile
    
    // Calculate Z-score
    const zScore = (val - p50) / sd;
    
    // Calculate percentile from Z-score (using approximation)
    // Using the cumulative normal distribution approximation
    const percentile = Math.round(100 * (0.5 * (1 + Math.tanh(0.8 * zScore))));
    
    // Determine interpretation
    let interpretation = "";
    let color = "";
    if (percentile < 3) {
      interpretation = "Severely below normal";
      color = "text-red-600";
    } else if (percentile < 15) {
      interpretation = "Below normal - monitor";
      color = "text-orange-500";
    } else if (percentile <= 85) {
      interpretation = "Normal range";
      color = "text-green-600";
    } else if (percentile <= 97) {
      interpretation = "Above normal - monitor";
      color = "text-orange-500";
    } else {
      interpretation = "Significantly above normal";
      color = "text-red-600";
    }
    
    return {
      zScore: zScore.toFixed(2),
      percentile: Math.max(1, Math.min(99, percentile)),
      interpretation,
      color,
      p3, p15, p50, p85, p97
    };
  };

  // Get interpretation for all entries
  const getEntryInterpretation = (entry) => {
    const results = {};
    if (entry.weight) {
      results.weight = calculateZScoreAndPercentile(entry.ageInMonths, entry.weight, 'weight');
    }
    if (entry.length) {
      results.length = calculateZScoreAndPercentile(entry.ageInMonths, entry.length, 'length');
    }
    if (entry.hc) {
      results.hc = calculateZScoreAndPercentile(entry.ageInMonths, entry.hc, 'hc');
    }
    return results;
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Chart Header */}
      <Card className="nightingale-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <GrowthIcon />
            {chartLabels[activeChart].title}
          </CardTitle>
          <CardDescription>
            {gender === 'male' ? 'Boys' : 'Girls'} • {chartType} Standards • {isWHO ? 'Birth to 2 years' : '2 to 20 years'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Standard Selection */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Standard</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={chartType === "WHO" ? "default" : "outline"} 
                onClick={() => setChartType("WHO")} 
                className="text-xs h-9 px-2"
              >
                WHO (0-2y)
              </Button>
              <Button 
                variant={chartType === "CDC" ? "default" : "outline"} 
                onClick={() => setChartType("CDC")} 
                className="text-xs h-9 px-2"
              >
                CDC (2-20y)
              </Button>
            </div>
          </div>
          
          {/* Gender Selection */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Gender</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={gender === "male" ? "default" : "outline"} 
                onClick={() => setGender("male")} 
                className="text-xs h-9 px-2"
              >
                👦 Boys
              </Button>
              <Button 
                variant={gender === "female" ? "default" : "outline"} 
                onClick={() => setGender("female")} 
                className="text-xs h-9 px-2"
              >
                👧 Girls
              </Button>
            </div>
          </div>
          
          {/* Measurement Type */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Measurement</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "weight", label: "Weight" },
                { id: "length", label: "Length" },
                { id: "hc", label: "Head Circ" }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeChart === tab.id ? "default" : "outline"}
                  onClick={() => setActiveChart(tab.id)}
                  className="text-xs h-9 px-2"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Chart */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">
              {chartLabels[activeChart].title} ({chartType})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={saveToGallery} className="text-xs h-7 px-2">
              📷 Save
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} className="bg-white dark:bg-gray-900 rounded-lg p-3" style={{ backgroundColor: gender === 'male' ? '#e6f3ff' : '#fff0f5' }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="1 1" stroke="#ccc" />
                <XAxis 
                  dataKey="age"
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 10 }} 
                  label={{ 
                    value: isWHO ? 'Age (months)' : 'Age (years)', 
                    position: 'bottom', 
                    fontSize: 11,
                    offset: 0 
                  }}
                  domain={xAxisDomain}
                  ticks={xAxisTicks}
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  label={{ 
                    value: chartLabels[activeChart].yLabel, 
                    angle: -90, 
                    position: 'insideLeft', 
                    fontSize: 11,
                    offset: 10
                  }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ fontSize: 11, borderRadius: 8, backgroundColor: '#fff' }}
                  formatter={(value, name) => {
                    const labels = { p3: '3rd', p15: '15th', p50: '50th', p85: '85th', p97: '97th' };
                    return [value.toFixed(1) + ' ' + chartLabels[activeChart].unit, labels[name] || name];
                  }}
                  labelFormatter={(label) => isWHO ? `${label} months` : `${label/12} years`}
                />
                
                {/* Percentile curves - matching WHO style colors */}
                <Line type="monotone" dataKey="p97" stroke={percentileColors.p97} strokeWidth={1.5} dot={false} name="p97" />
                <Line type="monotone" dataKey="p85" stroke={percentileColors.p85} strokeWidth={1.5} dot={false} name="p85" />
                <Line type="monotone" dataKey="p50" stroke={percentileColors.p50} strokeWidth={2} dot={false} name="p50" />
                <Line type="monotone" dataKey="p15" stroke={percentileColors.p15} strokeWidth={1.5} dot={false} name="p15" />
                <Line type="monotone" dataKey="p3" stroke={percentileColors.p3} strokeWidth={1.5} dot={false} name="p3" />
                
                {/* Patient data points */}
                {patientData.map((point, idx) => (
                  <ReferenceDot
                    key={idx}
                    x={point.age}
                    y={point.value}
                    r={3}
                    fill="#000"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex justify-center gap-3 mt-3 text-xs flex-wrap">
              <span className="flex items-center gap-1"><span className="w-4 h-0.5" style={{backgroundColor: percentileColors.p97}}></span> 97th</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5" style={{backgroundColor: percentileColors.p85}}></span> 85th</span>
              <span className="flex items-center gap-1"><span className="w-4 h-1" style={{backgroundColor: percentileColors.p50}}></span> 50th</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5" style={{backgroundColor: percentileColors.p15}}></span> 15th</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5" style={{backgroundColor: percentileColors.p3}}></span> 3rd</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black border border-white"></span> Patient</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement Form */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Plot Measurement</CardTitle>
          <CardDescription className="text-xs">Date and age are required. Measurements are optional.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Required Fields: Date and Age */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Date *</Label>
              <Input 
                type="date" 
                value={newEntry.date} 
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} 
                className="h-9 text-sm" 
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Age ({isWHO ? 'months' : 'years'}) *</Label>
              <Input 
                type="number" 
                placeholder={isWHO ? "e.g., 6" : "e.g., 5"} 
                value={newEntry.ageValue} 
                onChange={(e) => setNewEntry({...newEntry, ageValue: e.target.value})} 
                className="h-9 font-mono text-sm" 
              />
            </div>
          </div>
          
          {/* Optional Measurements */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Optional measurements (fill any):</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Weight (kg)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="e.g., 5.5" 
                  value={newEntry.weight} 
                  onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})} 
                  className="h-9 font-mono text-sm" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Length (cm)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g., 60" 
                  value={newEntry.length} 
                  onChange={(e) => setNewEntry({...newEntry, length: e.target.value})} 
                  className="h-9 font-mono text-sm" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">HC (cm)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g., 40" 
                  value={newEntry.hc} 
                  onChange={(e) => setNewEntry({...newEntry, hc: e.target.value})} 
                  className="h-9 font-mono text-sm" 
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={addEntry} 
            className="w-full" 
            size="sm"
            disabled={!newEntry.date || !newEntry.ageValue}
          >
            <Plus className="h-4 w-4 mr-1" /> Plot Data Point
          </Button>
        </CardContent>
      </Card>

      {/* Entries List with Interpretation */}
      {entries.length > 0 && (
        <Card className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Plotted Data & Interpretation ({entries.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.map((entry) => {
              const interpretation = getEntryInterpretation(entry);
              return (
                <div key={entry.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-2">
                  {/* Entry Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span className="font-medium text-[#00d9c5]">{entry.date}</span>
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium">
                        {formatAge(entry)}
                      </span>
                    </div>
                    <button onClick={() => removeEntry(entry.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Measurements with Interpretation */}
                  <div className="space-y-2">
                    {entry.weight && interpretation.weight && (
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Weight: {entry.weight} kg</span>
                          <span className={`font-bold ${interpretation.weight.color}`}>
                            {interpretation.weight.percentile}th percentile
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Z-score: <span className="font-mono">{interpretation.weight.zScore}</span></span>
                          <span className={interpretation.weight.color}>{interpretation.weight.interpretation}</span>
                        </div>
                      </div>
                    )}
                    
                    {entry.length && interpretation.length && (
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Length: {entry.length} cm</span>
                          <span className={`font-bold ${interpretation.length.color}`}>
                            {interpretation.length.percentile}th percentile
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Z-score: <span className="font-mono">{interpretation.length.zScore}</span></span>
                          <span className={interpretation.length.color}>{interpretation.length.interpretation}</span>
                        </div>
                      </div>
                    )}
                    
                    {entry.hc && interpretation.hc && (
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Head Circ: {entry.hc} cm</span>
                          <span className={`font-bold ${interpretation.hc.color}`}>
                            {interpretation.hc.percentile}th percentile
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Z-score: <span className="font-mono">{interpretation.hc.zScore}</span></span>
                          <span className={interpretation.hc.color}>{interpretation.hc.interpretation}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Show message if no measurements */}
                    {!entry.weight && !entry.length && !entry.hc && (
                      <p className="text-xs text-muted-foreground italic">No measurements entered for this date</p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Reference */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Percentile Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• <span className="font-medium" style={{color: percentileColors.p50}}>50th percentile:</span> Median - Average growth</p>
          <p>• <span className="font-medium" style={{color: percentileColors.p85}}>15th-85th:</span> Normal range</p>
          <p>• <span className="font-medium" style={{color: percentileColors.p3}}>3rd-15th / 85th-97th:</span> Monitor growth</p>
          <p>• <span className="text-red-600 font-medium">&lt;3rd / &gt;97th:</span> Evaluation needed</p>
          <div className="pt-2 border-t mt-2">
            <p className="font-medium text-foreground">Z-score Interpretation:</p>
            <p>• Z = 0: At the median (50th percentile)</p>
            <p>• Z = -2 to +2: Normal range</p>
            <p>• Z &lt; -2 or Z &gt; +2: Requires evaluation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NICUCalculator;
