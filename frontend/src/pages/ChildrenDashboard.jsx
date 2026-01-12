/**
 * Children Dashboard - ER/Pediatric Ward Calculator
 * 
 * File Structure:
 * - Lines 1-60: Imports
 * - Lines 60-240: Main ChildrenDashboard Component (Dashboard & Navigation)
 * - Lines 240-400: SortableWidget Component
 * - Lines 400-900: BPPage (Blood Pressure Calculator)
 * - Lines 900-1070: InfusionsPage (IV Drug Calculations)
 * - Lines 1070-1210: IntubationPage (ETT + RSI Checklist)
 * - Lines 1210-1680: ScoringPage (GCS, PRAM, Westley, OI, IWL)
 * - Lines 1680-2140: CPRPage (PALS Algorithms & Drug Dosing)
 * - Lines 2140-2943: ApproachesPage (DKA, Status Epilepticus, Hyperammonemia)
 * 
 * Extracted to /pages/children/:
 * - DrugsPage.jsx (~1880 lines) - Pediatric Drug Formulary
 * - FluidReplacementPage.jsx (~330 lines) - Fluid Calculations
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Scale, ChevronDown, Star } from "lucide-react";
import { 
  BloodPressureIcon, 
  InfusionIcon, 
  IntubationIcon, 
  ScoringIcon, 
  HeartIcon, 
  ApproachesIcon, 
  DrugsIcon,
  HomeIcon,
  BloodGasIcon,
  ElectrolytesIcon,
  BloodProductsIcon,
  GIRIcon,
  JaundiceNavIcon,
  ArrowLeftIcon,
  SettingsIcon,
  CloseIcon,
  GripIcon,
  FluidIcon
} from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Layout from "@/components/Layout";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";
import JaundiceDialog from "@/components/JaundiceDialog";
import GIRDialog from "@/components/GIRDialog";
import BloodProductsDialog from "@/components/BloodProductsDialog";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DrugsPage from './children/DrugsPage';
import FluidReplacementPage from './children/FluidReplacementPage';

// Sortable Widget Component for drag and drop
const SortableWidget = ({ widget, isEditMode, onClick, getColorClass, isFavorite, onToggleFavorite }) => {
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
      } ${isDragging ? 'shadow-2xl scale-105' : ''}`}
      data-testid={`widget-${widget.id}`}
    >
      <CardContent className="p-3 relative h-full flex items-center justify-center">
        {/* Favorite star - top left */}
        <button
          onClick={(e) => onToggleFavorite(widget.id, e)}
          className={`absolute top-2 left-2 p-1 rounded-full transition-all ${
            isFavorite 
              ? 'text-amber-500' 
              : 'text-gray-300 dark:text-gray-600 hover:text-amber-400'
          }`}
        >
          <Star className={`h-4 w-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
        </button>
        {/* Drag handle for edit mode */}
        {isEditMode && (
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#00d9c5]/20 text-[#00d9c5] cursor-grab active:cursor-grabbing touch-none"
          >
            <GripIcon className="h-4 w-4" />
          </div>
        )}
        <div className="flex flex-col items-center text-center gap-2">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getColorClass(widget.color)}`}>
            <widget.icon className="h-6 w-6" />
          </div>
          <h3 className="font-heading font-semibold text-xs leading-tight px-1">{widget.title}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

// Children Dashboard - Page-based navigation
const ChildrenDashboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { page } = useParams();
  // Use page directly from URL params - no need for separate state
  const currentPage = page || "main";
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [widgetOrder, setWidgetOrder] = useState(() => {
    const saved = localStorage.getItem("childrenWidgetOrder");
    return saved ? JSON.parse(saved) : ["fluidReplacement", "drugs", "bp", "infusions", "intubation", "scoring", "cpr", "approaches"];
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("pediAssistFavorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Toggle favorite for a widget
  const toggleFavorite = (widgetId, e) => {
    e.stopPropagation();
    const favKey = `children-${widgetId}`;
    setFavorites(prev => {
      let newFavorites;
      if (prev.includes(favKey)) {
        newFavorites = prev.filter(f => f !== favKey);
      } else {
        if (prev.length >= 4) {
          // Remove oldest favorite to make room
          newFavorites = [...prev.slice(1), favKey];
        } else {
          newFavorites = [...prev, favKey];
        }
      }
      localStorage.setItem("pediAssistFavorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (widgetId) => favorites.includes(`children-${widgetId}`);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Dialog states for floating nav bar
  const [activeTab, setActiveTab] = useState("");
  const [bloodGasOpen, setBloodGasOpen] = useState(false);
  const [electrolytesOpen, setElectrolytesOpen] = useState(false);
  const [jaundiceOpen, setJaundiceOpen] = useState(false);
  const [girOpen, setGirOpen] = useState(false);
  const [bloodProductsOpen, setBloodProductsOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "bloodgas") setBloodGasOpen(true);
    else if (tab === "electrolytes") setElectrolytesOpen(true);
    else if (tab === "jaundice") setJaundiceOpen(true);
    else if (tab === "gir") setGirOpen(true);
    else if (tab === "bloodproducts") setBloodProductsOpen(true);
    else if (tab === "home") navigate("/");
  };

  // Navigate to a page
  const goToPage = (pageId) => {
    if (isEditMode) return;
    if (pageId === "main") {
      navigate("/children");
    } else {
      navigate(`/children/${pageId}`);
    }
  };

  // Widget definitions for main page with search keywords
  const widgetDefs = {
    bp: { id: "bp", title: "Blood Pressure", subtitle: "Age-based BP percentiles", icon: BloodPressureIcon, color: "red", keywords: ["hypertension", "systolic", "diastolic", "percentile", "boys", "girls", "map"] },
    infusions: { id: "infusions", title: "Infusions", subtitle: "IV drug calculations", icon: InfusionIcon, color: "blue", keywords: ["dopamine", "dobutamine", "adrenaline", "epinephrine", "sedation", "midazolam", "fentanyl", "inotrope"] },
    intubation: { id: "intubation", title: "Intubation", subtitle: "ETT + RSI Checklist", icon: IntubationIcon, color: "purple", keywords: ["ett", "tube", "airway", "rsi", "rapid sequence", "laryngoscope", "cuffed", "uncuffed"] },
    scoring: { id: "scoring", title: "Scoring/Calculators", subtitle: "GCS, PRAM, Westley, OI, IWL", icon: ScoringIcon, color: "amber", keywords: ["glasgow", "coma", "croup", "respiratory", "oxygenation", "pram", "westley", "iwl", "bsa", "insensible", "water loss"] },
    cpr: { id: "cpr", title: "CPR", subtitle: "PALS drugs & algorithms", icon: HeartIcon, color: "red", keywords: ["resuscitation", "pals", "arrest", "defibrillation", "epinephrine", "amiodarone", "adenosine", "tachycardia", "bradycardia", "vf", "vt", "asystole", "pea"] },
    approaches: { id: "approaches", title: "Approaches", subtitle: "DKA, SE, Hyperammonemia", icon: ApproachesIcon, color: "teal", keywords: ["diabetic", "ketoacidosis", "dka", "status epilepticus", "seizure", "convulsion", "hyperammonemia", "ammonia", "urea cycle", "phenytoin", "diazepam"] },
    drugs: { id: "drugs", title: "Drugs", subtitle: "Commonly used medications", icon: DrugsIcon, color: "purple", keywords: ["antibiotic", "analgesic", "paracetamol", "ibuprofen", "morphine", "amoxicillin", "ceftriaxone", "vancomycin", "gentamicin", "pain", "fever"] },
    fluidReplacement: { id: "fluidReplacement", title: "Fluid Replacement", subtitle: "Deficit + Maintenance", icon: FluidIcon, color: "teal", keywords: ["dehydration", "deficit", "maintenance", "holliday", "segar", "rehydration", "ivf", "fluids"] },
  };

  const widgets = widgetOrder.map(id => widgetDefs[id]).filter(Boolean);

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (active.id !== over?.id) {
      const oldIndex = widgetOrder.indexOf(active.id);
      const newIndex = widgetOrder.indexOf(over.id);
      const newOrder = arrayMove(widgetOrder, oldIndex, newIndex);
      setWidgetOrder(newOrder);
      localStorage.setItem("childrenWidgetOrder", JSON.stringify(newOrder));
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const getColorClass = (color) => {
    const colors = {
      teal: "text-[#00d9c5] bg-[#00d9c5]/10",
      blue: "text-blue-500 bg-blue-500/10",
      red: "text-red-500 bg-red-500/10",
      purple: "text-purple-500 bg-purple-500/10",
      amber: "text-amber-500 bg-amber-500/10"
    };
    return colors[color] || colors.teal;
  };

  // Render the appropriate page content
  const renderPage = () => {
    switch(currentPage) {
      case "bp":
        return <BPPage onBack={() => goToPage("main")} />;
      case "infusions":
        return <InfusionsPage onBack={() => goToPage("main")} />;
      case "intubation":
        return <IntubationPage onBack={() => goToPage("main")} />;
      case "scoring":
        return <ScoringPage onBack={() => goToPage("main")} />;
      case "cpr":
        return <CPRPage onBack={() => goToPage("main")} />;
      case "approaches":
        return <ApproachesPage onBack={() => goToPage("main")} />;
      case "drugs":
        return <DrugsPage onBack={() => goToPage("main")} />;
      case "fluidReplacement":
        return <FluidReplacementPage onBack={() => goToPage("main")} />;
      default:
        return renderMainPage();
    }
  };

  // Main page with widget grid
  const renderMainPage = () => (
    <div className="space-y-4 py-4">
      {/* Edit Mode Instructions */}
      {isEditMode && (
        <div className="p-3 rounded-xl bg-[#00d9c5]/10 border border-[#00d9c5]/30 text-sm text-center flex items-center justify-center gap-2">
          <GripIcon className="h-4 w-4 text-[#00d9c5]" />
          <span>Drag widgets to rearrange</span>
        </div>
      )}

      {/* Widget Grid with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgetOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-4">
            {widgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                isEditMode={isEditMode}
                onClick={goToPage}
                getColorClass={getColorClass}
                isFavorite={isFavorite(widget.id)}
                onToggleFavorite={toggleFavorite}
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
                    const w = widgetDefs[activeId];
                    if (!w) return null;
                    return (
                      <>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getColorClass(w.color)}`}>
                          <w.icon className="h-6 w-6" />
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
    </div>
  );

  return (
    <Layout theme={theme} toggleTheme={toggleTheme} showHamburger={false}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => currentPage === "main" ? navigate("/") : goToPage("main")}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground tracking-tight">
                {currentPage === "main" ? "Children" : widgets.find(w => w.id === currentPage)?.title || "Children"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {currentPage === "main" ? "ER/Pediatric Ward" : "Tap arrow to go back"}
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
              >
                {isEditMode ? <CloseIcon className="h-5 w-5" /> : <SettingsIcon className="h-5 w-5" />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="fixed top-[72px] bottom-[100px] left-0 right-0 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-full native-scroll">
          {renderPage()}
        </div>
      </main>

      {/* Floating Tab Bar - Same as Home */}
      <nav className="floating-tab-bar">
        <div className="flex items-center gap-0.5">
          <button onClick={() => handleTabClick("home")} className={`tab-item ${activeTab === "home" ? "active" : ""}`}>
            <HomeIcon className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("bloodgas")} className={`tab-item ${activeTab === "bloodgas" ? "active" : ""}`}>
            <BloodGasIcon className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("electrolytes")} className={`tab-item ${activeTab === "electrolytes" ? "active" : ""}`}>
            <ElectrolytesIcon className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("bloodproducts")} className={`tab-item ${activeTab === "bloodproducts" ? "active" : ""}`}>
            <BloodProductsIcon className={`h-5 w-5 ${activeTab === "bloodproducts" ? "text-red-400" : ""}`} />
          </button>
          <button onClick={() => handleTabClick("gir")} className={`tab-item ${activeTab === "gir" ? "active" : ""}`}>
            <GIRIcon className="h-5 w-5" />
          </button>
          <button onClick={() => handleTabClick("jaundice")} className={`tab-item ${activeTab === "jaundice" ? "active" : ""}`}>
            <JaundiceNavIcon className={`h-5 w-5 ${activeTab === "jaundice" ? "text-amber-400" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Navigation Dialogs */}
      <BloodGasDialog open={bloodGasOpen} onOpenChange={(open) => { setBloodGasOpen(open); if (!open) setActiveTab(""); }} />
      <ElectrolytesDialog open={electrolytesOpen} onOpenChange={(open) => { setElectrolytesOpen(open); if (!open) setActiveTab(""); }} />
      <JaundiceDialog open={jaundiceOpen} onOpenChange={(open) => { setJaundiceOpen(open); if (!open) setActiveTab(""); }} />
      <GIRDialog open={girOpen} onOpenChange={(open) => { setGirOpen(open); if (!open) setActiveTab(""); }} />
      <BloodProductsDialog open={bloodProductsOpen} onOpenChange={(open) => { setBloodProductsOpen(open); if (!open) setActiveTab(""); }} />
    </Layout>
  );
};

// ==================== PAGE COMPONENTS ====================

// Blood Pressure Page - Harriet Lane Handbook 23rd Edition
const BPPage = ({ onBack }) => {
  const [gender, setGender] = useState("boys");
  const [selectedAge, setSelectedAge] = useState("");
  const [heightPercentile, setHeightPercentile] = useState("50");
  const [patientSBP, setPatientSBP] = useState("");
  const [patientDBP, setPatientDBP] = useState("");

  // Calculate MAP: DBP + (SBP - DBP) / 3
  const calcMAP = (sbp, dbp) => Math.round(dbp + (sbp - dbp) / 3);

  // BP data from Harriet Lane Handbook 23rd Edition
  // Columns: Height percentiles (5th, 10th, 25th, 50th, 75th, 90th, 95th)
  // BP percentiles shown: 50th, 90th, 95th (5th calculated via PALS: 70 + 2×age)
  const bpData = {
    boys: {
      "5": [
        { age: "1", systolic: { p50: 80, p90: 94, p95: 98 }, diastolic: { p50: 34, p90: 49, p95: 54 } },
        { age: "2", systolic: { p50: 84, p90: 97, p95: 101 }, diastolic: { p50: 39, p90: 54, p95: 59 } },
        { age: "3", systolic: { p50: 86, p90: 100, p95: 104 }, diastolic: { p50: 44, p90: 59, p95: 63 } },
        { age: "4", systolic: { p50: 88, p90: 102, p95: 106 }, diastolic: { p50: 47, p90: 62, p95: 66 } },
        { age: "5", systolic: { p50: 90, p90: 104, p95: 108 }, diastolic: { p50: 50, p90: 65, p95: 69 } },
        { age: "6", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 53, p90: 68, p95: 72 } },
        { age: "7", systolic: { p50: 92, p90: 106, p95: 110 }, diastolic: { p50: 55, p90: 70, p95: 74 } },
        { age: "8", systolic: { p50: 94, p90: 107, p95: 111 }, diastolic: { p50: 56, p90: 71, p95: 75 } },
        { age: "9", systolic: { p50: 95, p90: 109, p95: 113 }, diastolic: { p50: 57, p90: 72, p95: 76 } },
        { age: "10", systolic: { p50: 97, p90: 111, p95: 115 }, diastolic: { p50: 58, p90: 73, p95: 77 } },
        { age: "11", systolic: { p50: 99, p90: 113, p95: 117 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "12", systolic: { p50: 101, p90: 115, p95: 119 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "13", systolic: { p50: 104, p90: 118, p95: 122 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "14", systolic: { p50: 106, p90: 120, p95: 124 }, diastolic: { p50: 60, p90: 75, p95: 80 } },
        { age: "15", systolic: { p50: 109, p90: 123, p95: 127 }, diastolic: { p50: 61, p90: 76, p95: 81 } },
        { age: "16", systolic: { p50: 111, p90: 125, p95: 129 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "17", systolic: { p50: 114, p90: 127, p95: 131 }, diastolic: { p50: 65, p90: 80, p95: 84 } },
      ],
      "10": [
        { age: "1", systolic: { p50: 81, p90: 95, p95: 99 }, diastolic: { p50: 35, p90: 50, p95: 54 } },
        { age: "2", systolic: { p50: 85, p90: 99, p95: 102 }, diastolic: { p50: 40, p90: 55, p95: 59 } },
        { age: "3", systolic: { p50: 87, p90: 101, p95: 105 }, diastolic: { p50: 45, p90: 60, p95: 64 } },
        { age: "4", systolic: { p50: 89, p90: 103, p95: 107 }, diastolic: { p50: 48, p90: 63, p95: 67 } },
        { age: "5", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 51, p90: 66, p95: 70 } },
        { age: "6", systolic: { p50: 92, p90: 106, p95: 110 }, diastolic: { p50: 54, p90: 68, p95: 72 } },
        { age: "7", systolic: { p50: 94, p90: 107, p95: 111 }, diastolic: { p50: 55, p90: 70, p95: 74 } },
        { age: "8", systolic: { p50: 95, p90: 109, p95: 112 }, diastolic: { p50: 57, p90: 71, p95: 76 } },
        { age: "9", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 77 } },
        { age: "10", systolic: { p50: 98, p90: 112, p95: 116 }, diastolic: { p50: 59, p90: 73, p95: 78 } },
        { age: "11", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "12", systolic: { p50: 102, p90: 116, p95: 120 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "13", systolic: { p50: 105, p90: 119, p95: 123 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "14", systolic: { p50: 107, p90: 121, p95: 125 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "15", systolic: { p50: 110, p90: 124, p95: 127 }, diastolic: { p50: 62, p90: 77, p95: 81 } },
        { age: "16", systolic: { p50: 112, p90: 126, p95: 130 }, diastolic: { p50: 64, p90: 78, p95: 83 } },
        { age: "17", systolic: { p50: 115, p90: 128, p95: 132 }, diastolic: { p50: 66, p90: 80, p95: 85 } },
      ],
      "25": [
        { age: "1", systolic: { p50: 83, p90: 97, p95: 101 }, diastolic: { p50: 36, p90: 51, p95: 55 } },
        { age: "2", systolic: { p50: 87, p90: 100, p95: 104 }, diastolic: { p50: 41, p90: 56, p95: 60 } },
        { age: "3", systolic: { p50: 89, p90: 103, p95: 107 }, diastolic: { p50: 46, p90: 61, p95: 65 } },
        { age: "4", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 49, p90: 64, p95: 68 } },
        { age: "5", systolic: { p50: 93, p90: 106, p95: 110 }, diastolic: { p50: 52, p90: 67, p95: 71 } },
        { age: "6", systolic: { p50: 94, p90: 108, p95: 112 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "7", systolic: { p50: 95, p90: 109, p95: 113 }, diastolic: { p50: 56, p90: 71, p95: 75 } },
        { age: "8", systolic: { p50: 97, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "9", systolic: { p50: 98, p90: 112, p95: 116 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "10", systolic: { p50: 100, p90: 114, p95: 117 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "11", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "12", systolic: { p50: 104, p90: 118, p95: 122 }, diastolic: { p50: 61, p90: 75, p95: 80 } },
        { age: "13", systolic: { p50: 106, p90: 120, p95: 124 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "14", systolic: { p50: 109, p90: 123, p95: 126 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "15", systolic: { p50: 112, p90: 125, p95: 129 }, diastolic: { p50: 63, p90: 77, p95: 82 } },
        { age: "16", systolic: { p50: 114, p90: 128, p95: 131 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "17", systolic: { p50: 116, p90: 130, p95: 134 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
      ],
      "50": [
        { age: "1", systolic: { p50: 85, p90: 99, p95: 103 }, diastolic: { p50: 37, p90: 52, p95: 56 } },
        { age: "2", systolic: { p50: 88, p90: 102, p95: 106 }, diastolic: { p50: 42, p90: 57, p95: 61 } },
        { age: "3", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 47, p90: 62, p95: 66 } },
        { age: "4", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 50, p90: 65, p95: 69 } },
        { age: "5", systolic: { p50: 95, p90: 108, p95: 112 }, diastolic: { p50: 53, p90: 68, p95: 72 } },
        { age: "6", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "7", systolic: { p50: 97, p90: 111, p95: 115 }, diastolic: { p50: 57, p90: 72, p95: 76 } },
        { age: "8", systolic: { p50: 99, p90: 112, p95: 116 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "9", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "10", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "11", systolic: { p50: 104, p90: 117, p95: 121 }, diastolic: { p50: 61, p90: 75, p95: 80 } },
        { age: "12", systolic: { p50: 106, p90: 119, p95: 123 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "13", systolic: { p50: 108, p90: 122, p95: 126 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "14", systolic: { p50: 111, p90: 125, p95: 128 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "15", systolic: { p50: 113, p90: 127, p95: 131 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "16", systolic: { p50: 116, p90: 129, p95: 133 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "17", systolic: { p50: 118, p90: 131, p95: 135 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
      ],
      "75": [
        { age: "1", systolic: { p50: 87, p90: 100, p95: 104 }, diastolic: { p50: 38, p90: 53, p95: 57 } },
        { age: "2", systolic: { p50: 90, p90: 104, p95: 108 }, diastolic: { p50: 43, p90: 58, p95: 62 } },
        { age: "3", systolic: { p50: 93, p90: 107, p95: 110 }, diastolic: { p50: 48, p90: 63, p95: 67 } },
        { age: "4", systolic: { p50: 95, p90: 109, p95: 112 }, diastolic: { p50: 51, p90: 66, p95: 70 } },
        { age: "5", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 54, p90: 69, p95: 73 } },
        { age: "6", systolic: { p50: 98, p90: 111, p95: 115 }, diastolic: { p50: 56, p90: 71, p95: 75 } },
        { age: "7", systolic: { p50: 99, p90: 113, p95: 116 }, diastolic: { p50: 58, p90: 73, p95: 77 } },
        { age: "8", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "9", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "10", systolic: { p50: 103, p90: 117, p95: 121 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "11", systolic: { p50: 105, p90: 119, p95: 123 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "12", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 62, p90: 77, p95: 81 } },
        { age: "13", systolic: { p50: 110, p90: 124, p95: 127 }, diastolic: { p50: 63, p90: 77, p95: 82 } },
        { age: "14", systolic: { p50: 113, p90: 126, p95: 130 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "15", systolic: { p50: 115, p90: 129, p95: 133 }, diastolic: { p50: 64, p90: 79, p95: 83 } },
        { age: "16", systolic: { p50: 118, p90: 131, p95: 135 }, diastolic: { p50: 66, p90: 81, p95: 85 } },
        { age: "17", systolic: { p50: 120, p90: 133, p95: 137 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
      ],
      "90": [
        { age: "1", systolic: { p50: 88, p90: 102, p95: 106 }, diastolic: { p50: 39, p90: 54, p95: 58 } },
        { age: "2", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 44, p90: 59, p95: 63 } },
        { age: "3", systolic: { p50: 94, p90: 108, p95: 112 }, diastolic: { p50: 49, p90: 64, p95: 68 } },
        { age: "4", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 52, p90: 67, p95: 71 } },
        { age: "5", systolic: { p50: 98, p90: 112, p95: 115 }, diastolic: { p50: 55, p90: 70, p95: 74 } },
        { age: "6", systolic: { p50: 99, p90: 113, p95: 117 }, diastolic: { p50: 57, p90: 72, p95: 76 } },
        { age: "7", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "8", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "9", systolic: { p50: 103, p90: 117, p95: 121 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "10", systolic: { p50: 105, p90: 119, p95: 122 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "11", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 62, p90: 77, p95: 81 } },
        { age: "12", systolic: { p50: 109, p90: 123, p95: 126 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "13", systolic: { p50: 111, p90: 125, p95: 129 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "14", systolic: { p50: 114, p90: 128, p95: 131 }, diastolic: { p50: 64, p90: 79, p95: 83 } },
        { age: "15", systolic: { p50: 117, p90: 130, p95: 134 }, diastolic: { p50: 65, p90: 80, p95: 84 } },
        { age: "16", systolic: { p50: 119, p90: 133, p95: 136 }, diastolic: { p50: 67, p90: 82, p95: 86 } },
        { age: "17", systolic: { p50: 121, p90: 135, p95: 139 }, diastolic: { p50: 70, p90: 84, p95: 88 } },
      ],
      "95": [
        { age: "1", systolic: { p50: 90, p90: 103, p95: 107 }, diastolic: { p50: 40, p90: 54, p95: 59 } },
        { age: "2", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 45, p90: 60, p95: 64 } },
        { age: "3", systolic: { p50: 95, p90: 109, p95: 113 }, diastolic: { p50: 50, p90: 65, p95: 69 } },
        { age: "4", systolic: { p50: 98, p90: 111, p95: 115 }, diastolic: { p50: 53, p90: 68, p95: 72 } },
        { age: "5", systolic: { p50: 99, p90: 113, p95: 117 }, diastolic: { p50: 56, p90: 70, p95: 75 } },
        { age: "6", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 58, p90: 73, p95: 77 } },
        { age: "7", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 74, p95: 79 } },
        { age: "8", systolic: { p50: 103, p90: 117, p95: 120 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "9", systolic: { p50: 105, p90: 118, p95: 122 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "10", systolic: { p50: 106, p90: 120, p95: 124 }, diastolic: { p50: 63, p90: 77, p95: 82 } },
        { age: "11", systolic: { p50: 108, p90: 122, p95: 125 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "12", systolic: { p50: 110, p90: 124, p95: 128 }, diastolic: { p50: 64, p90: 78, p95: 83 } },
        { age: "13", systolic: { p50: 113, p90: 126, p95: 130 }, diastolic: { p50: 64, p90: 79, p95: 83 } },
        { age: "14", systolic: { p50: 115, p90: 129, p95: 133 }, diastolic: { p50: 65, p90: 79, p95: 84 } },
        { age: "15", systolic: { p50: 118, p90: 132, p95: 135 }, diastolic: { p50: 66, p90: 80, p95: 85 } },
        { age: "16", systolic: { p50: 120, p90: 134, p95: 138 }, diastolic: { p50: 68, p90: 82, p95: 87 } },
        { age: "17", systolic: { p50: 122, p90: 136, p95: 140 }, diastolic: { p50: 70, p90: 85, p95: 89 } },
      ]
    },
    girls: {
      "5": [
        { age: "1", systolic: { p50: 83, p90: 97, p95: 100 }, diastolic: { p50: 38, p90: 52, p95: 56 } },
        { age: "2", systolic: { p50: 85, p90: 98, p95: 102 }, diastolic: { p50: 43, p90: 57, p95: 61 } },
        { age: "3", systolic: { p50: 86, p90: 100, p95: 104 }, diastolic: { p50: 47, p90: 61, p95: 65 } },
        { age: "4", systolic: { p50: 88, p90: 101, p95: 105 }, diastolic: { p50: 50, p90: 64, p95: 68 } },
        { age: "5", systolic: { p50: 89, p90: 103, p95: 107 }, diastolic: { p50: 52, p90: 66, p95: 70 } },
        { age: "6", systolic: { p50: 91, p90: 104, p95: 108 }, diastolic: { p50: 54, p90: 68, p95: 72 } },
        { age: "7", systolic: { p50: 93, p90: 106, p95: 110 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "8", systolic: { p50: 95, p90: 108, p95: 112 }, diastolic: { p50: 57, p90: 71, p95: 75 } },
        { age: "9", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "10", systolic: { p50: 98, p90: 112, p95: 116 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "11", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "12", systolic: { p50: 102, p90: 116, p95: 119 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "13", systolic: { p50: 104, p90: 117, p95: 121 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "14", systolic: { p50: 106, p90: 119, p95: 123 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "15", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "16", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "17", systolic: { p50: 108, p90: 122, p95: 125 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
      ],
      "10": [
        { age: "1", systolic: { p50: 84, p90: 97, p95: 101 }, diastolic: { p50: 39, p90: 53, p95: 57 } },
        { age: "2", systolic: { p50: 86, p90: 99, p95: 103 }, diastolic: { p50: 44, p90: 58, p95: 62 } },
        { age: "3", systolic: { p50: 87, p90: 101, p95: 105 }, diastolic: { p50: 48, p90: 62, p95: 66 } },
        { age: "4", systolic: { p50: 89, p90: 102, p95: 106 }, diastolic: { p50: 51, p90: 65, p95: 69 } },
        { age: "5", systolic: { p50: 90, p90: 104, p95: 108 }, diastolic: { p50: 53, p90: 67, p95: 71 } },
        { age: "6", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "7", systolic: { p50: 94, p90: 107, p95: 111 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "8", systolic: { p50: 96, p90: 109, p95: 113 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "9", systolic: { p50: 97, p90: 111, p95: 115 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "10", systolic: { p50: 99, p90: 113, p95: 117 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "11", systolic: { p50: 101, p90: 115, p95: 119 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "12", systolic: { p50: 103, p90: 117, p95: 120 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "13", systolic: { p50: 105, p90: 118, p95: 122 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "14", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "15", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "16", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "17", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
      ],
      "25": [
        { age: "1", systolic: { p50: 85, p90: 99, p95: 102 }, diastolic: { p50: 40, p90: 54, p95: 58 } },
        { age: "2", systolic: { p50: 87, p90: 101, p95: 104 }, diastolic: { p50: 45, p90: 59, p95: 63 } },
        { age: "3", systolic: { p50: 89, p90: 102, p95: 106 }, diastolic: { p50: 49, p90: 63, p95: 67 } },
        { age: "4", systolic: { p50: 90, p90: 104, p95: 108 }, diastolic: { p50: 52, p90: 66, p95: 70 } },
        { age: "5", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 54, p90: 68, p95: 72 } },
        { age: "6", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "7", systolic: { p50: 95, p90: 109, p95: 112 }, diastolic: { p50: 57, p90: 71, p95: 75 } },
        { age: "8", systolic: { p50: 97, p90: 110, p95: 114 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "9", systolic: { p50: 99, p90: 112, p95: 116 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "10", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "11", systolic: { p50: 102, p90: 116, p95: 120 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "12", systolic: { p50: 104, p90: 118, p95: 122 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "13", systolic: { p50: 106, p90: 120, p95: 123 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "14", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "15", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "16", systolic: { p50: 110, p90: 123, p95: 127 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "17", systolic: { p50: 110, p90: 123, p95: 127 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
      ],
      "50": [
        { age: "1", systolic: { p50: 86, p90: 100, p95: 104 }, diastolic: { p50: 41, p90: 55, p95: 59 } },
        { age: "2", systolic: { p50: 88, p90: 102, p95: 106 }, diastolic: { p50: 46, p90: 60, p95: 64 } },
        { age: "3", systolic: { p50: 90, p90: 104, p95: 107 }, diastolic: { p50: 50, p90: 64, p95: 68 } },
        { age: "4", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 53, p90: 67, p95: 71 } },
        { age: "5", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "6", systolic: { p50: 95, p90: 108, p95: 112 }, diastolic: { p50: 57, p90: 71, p95: 75 } },
        { age: "7", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "8", systolic: { p50: 98, p90: 112, p95: 115 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "9", systolic: { p50: 100, p90: 114, p95: 117 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "10", systolic: { p50: 102, p90: 116, p95: 119 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "11", systolic: { p50: 104, p90: 117, p95: 121 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "12", systolic: { p50: 106, p90: 119, p95: 123 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "13", systolic: { p50: 107, p90: 121, p95: 124 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "14", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "15", systolic: { p50: 110, p90: 123, p95: 127 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "16", systolic: { p50: 111, p90: 124, p95: 128 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "17", systolic: { p50: 111, p90: 125, p95: 128 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
      ],
      "75": [
        { age: "1", systolic: { p50: 88, p90: 101, p95: 105 }, diastolic: { p50: 42, p90: 56, p95: 60 } },
        { age: "2", systolic: { p50: 90, p90: 103, p95: 107 }, diastolic: { p50: 47, p90: 61, p95: 65 } },
        { age: "3", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 51, p90: 65, p95: 69 } },
        { age: "4", systolic: { p50: 93, p90: 107, p95: 110 }, diastolic: { p50: 54, p90: 68, p95: 72 } },
        { age: "5", systolic: { p50: 95, p90: 108, p95: 112 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "6", systolic: { p50: 96, p90: 110, p95: 113 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "7", systolic: { p50: 98, p90: 111, p95: 115 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "8", systolic: { p50: 100, p90: 113, p95: 117 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "9", systolic: { p50: 101, p90: 115, p95: 118 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "10", systolic: { p50: 103, p90: 117, p95: 120 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "11", systolic: { p50: 105, p90: 118, p95: 122 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "12", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "13", systolic: { p50: 109, p90: 122, p95: 125 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "14", systolic: { p50: 110, p90: 124, p95: 127 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "15", systolic: { p50: 111, p90: 125, p95: 128 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
        { age: "16", systolic: { p50: 112, p90: 125, p95: 129 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
        { age: "17", systolic: { p50: 112, p90: 126, p95: 129 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
      ],
      "90": [
        { age: "1", systolic: { p50: 89, p90: 102, p95: 106 }, diastolic: { p50: 43, p90: 57, p95: 61 } },
        { age: "2", systolic: { p50: 91, p90: 104, p95: 108 }, diastolic: { p50: 48, p90: 62, p95: 66 } },
        { age: "3", systolic: { p50: 93, p90: 106, p95: 110 }, diastolic: { p50: 52, p90: 66, p95: 70 } },
        { age: "4", systolic: { p50: 94, p90: 108, p95: 111 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "5", systolic: { p50: 96, p90: 109, p95: 113 }, diastolic: { p50: 57, p90: 71, p95: 75 } },
        { age: "6", systolic: { p50: 97, p90: 111, p95: 114 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "7", systolic: { p50: 99, p90: 112, p95: 116 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "8", systolic: { p50: 101, p90: 114, p95: 118 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "9", systolic: { p50: 102, p90: 116, p95: 120 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "10", systolic: { p50: 104, p90: 118, p95: 121 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "11", systolic: { p50: 106, p90: 119, p95: 123 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "12", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "13", systolic: { p50: 110, p90: 123, p95: 127 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "14", systolic: { p50: 111, p90: 125, p95: 128 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
        { age: "15", systolic: { p50: 112, p90: 126, p95: 129 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
        { age: "16", systolic: { p50: 113, p90: 126, p95: 130 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
        { age: "17", systolic: { p50: 113, p90: 127, p95: 130 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
      ],
      "95": [
        { age: "1", systolic: { p50: 90, p90: 103, p95: 107 }, diastolic: { p50: 44, p90: 58, p95: 62 } },
        { age: "2", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 49, p90: 63, p95: 67 } },
        { age: "3", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 53, p90: 67, p95: 71 } },
        { age: "4", systolic: { p50: 95, p90: 109, p95: 112 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "5", systolic: { p50: 97, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "6", systolic: { p50: 98, p90: 112, p95: 115 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "7", systolic: { p50: 100, p90: 113, p95: 117 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "8", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "9", systolic: { p50: 103, p90: 117, p95: 121 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "10", systolic: { p50: 105, p90: 119, p95: 122 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "11", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "12", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "13", systolic: { p50: 110, p90: 124, p95: 128 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
        { age: "14", systolic: { p50: 112, p90: 125, p95: 129 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
        { age: "15", systolic: { p50: 113, p90: 127, p95: 130 }, diastolic: { p50: 70, p90: 84, p95: 88 } },
        { age: "16", systolic: { p50: 114, p90: 127, p95: 131 }, diastolic: { p50: 70, p90: 84, p95: 88 } },
        { age: "17", systolic: { p50: 114, p90: 127, p95: 131 }, diastolic: { p50: 70, p90: 84, p95: 88 } },
      ]
    }
  };

  const heightOptions = [
    { value: "5", label: "5th percentile" },
    { value: "10", label: "10th percentile" },
    { value: "25", label: "25th percentile" },
    { value: "50", label: "50th percentile" },
    { value: "75", label: "75th percentile" },
    { value: "90", label: "90th percentile" },
    { value: "95", label: "95th percentile" }
  ];

  const selectedData = selectedAge ? bpData[gender][heightPercentile]?.find(d => d.age === selectedAge) : null;

  // Classify patient BP using PALS for hypotension
  const classifyBP = () => {
    if (!patientSBP || !patientDBP || !selectedData || !selectedAge) return null;
    const sbp = parseInt(patientSBP);
    const dbp = parseInt(patientDBP);
    const hypotensionSBP = 70 + 2 * parseInt(selectedAge); // PALS formula
    
    if (sbp < hypotensionSBP) {
      return { class: "Hypotension", color: "blue", severity: 0 };
    } else if (sbp < selectedData.systolic.p90 && dbp < selectedData.diastolic.p90) {
      return { class: "Normal", color: "green", severity: 1 };
    } else if (sbp < selectedData.systolic.p95 && dbp < selectedData.diastolic.p95) {
      return { class: "Elevated BP", color: "amber", severity: 2 };
    } else if (sbp >= selectedData.systolic.p95 + 12 || dbp >= selectedData.diastolic.p95 + 12) {
      return { class: "HTN Stage 2", color: "red", severity: 4 };
    } else {
      return { class: "HTN Stage 1", color: "orange", severity: 3 };
    }
  };

  const patientClassification = classifyBP();
  const patientMAP = patientSBP && patientDBP ? calcMAP(parseInt(patientSBP), parseInt(patientDBP)) : null;

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Input Card */}
      <Card className="nightingale-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Blood Pressure by Age & Height</CardTitle>
          <CardDescription>Harriet Lane Handbook 23rd Edition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gender Selection */}
          <div className="flex gap-2">
            <Button variant={gender === "boys" ? "default" : "outline"} onClick={() => setGender("boys")} className="flex-1">Boys</Button>
            <Button variant={gender === "girls" ? "default" : "outline"} onClick={() => setGender("girls")} className="flex-1">Girls</Button>
          </div>

          {/* Age Selection */}
          <div className="space-y-2">
            <Label>Age (years)</Label>
            <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3">
              <option value="">Select age...</option>
              {bpData[gender]["50"].map((d) => (<option key={d.age} value={d.age}>{d.age} year{d.age !== "1" ? "s" : ""}</option>))}
            </select>
          </div>

          {/* Height Percentile */}
          <div className="space-y-2">
            <Label>Height Percentile</Label>
            <select value={heightPercentile} onChange={(e) => setHeightPercentile(e.target.value)} className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3">
              {heightOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </div>

          {/* Patient BP Input */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Patient SBP (mmHg)</Label>
              <Input type="number" placeholder="Systolic" value={patientSBP} onChange={(e) => setPatientSBP(e.target.value)} className="h-10 nightingale-input" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Patient DBP (mmHg)</Label>
              <Input type="number" placeholder="Diastolic" value={patientDBP} onChange={(e) => setPatientDBP(e.target.value)} className="h-10 nightingale-input" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Classification */}
      {patientClassification && (
        <Card className={`border-${patientClassification.color}-200 bg-${patientClassification.color}-50 dark:bg-${patientClassification.color}-950/30`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm font-bold text-${patientClassification.color}-700 dark:text-${patientClassification.color}-300`}>
                Patient: {patientClassification.class}
              </p>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">MAP</p>
                <p className={`text-xl font-mono font-bold text-${patientClassification.color}-600`}>{patientMAP}</p>
              </div>
            </div>
            <p className="text-sm font-mono">{patientSBP}/{patientDBP} mmHg</p>
          </CardContent>
        </Card>
      )}

      {/* Results by BP Percentile */}
      {selectedData && (
        <div className="space-y-3">
          {/* Full BP Table with MAP */}
          <Card className="nightingale-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">BP Percentiles for {gender === "boys" ? "Boy" : "Girl"}, {selectedAge} y/o, Height {heightPercentile}th %ile</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-2 py-2 text-left font-medium">BP %ile</th>
                      <th className="px-2 py-2 text-center font-medium">SBP</th>
                      <th className="px-2 py-2 text-center font-medium">DBP</th>
                      <th className="px-2 py-2 text-center font-medium text-purple-600">MAP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[
                      { key: "p50", label: "50th", color: "text-green-600 font-bold" },
                      { key: "p90", label: "90th", color: "text-amber-600" },
                      { key: "p95", label: "95th", color: "text-orange-600" },
                    ].map((row) => (
                      <tr key={row.key} className={row.key === "p50" ? "bg-green-50/50 dark:bg-green-950/20" : ""}>
                        <td className={`px-2 py-2 ${row.color}`}>{row.label}</td>
                        <td className="px-2 py-2 text-center font-mono">{selectedData.systolic[row.key]}</td>
                        <td className="px-2 py-2 text-center font-mono">{selectedData.diastolic[row.key]}</td>
                        <td className="px-2 py-2 text-center font-mono text-purple-600 font-semibold">
                          {calcMAP(selectedData.systolic[row.key], selectedData.diastolic[row.key])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Hypotension (5th - PALS)</p>
                <p className="text-lg font-mono font-bold text-blue-600">&lt;{70 + 2 * parseInt(selectedAge || 1)}</p>
                <p className="text-xs text-muted-foreground">SBP = 70 + 2×age</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-green-700 dark:text-green-300 mb-1">Normal (50th)</p>
                <p className="text-lg font-mono font-bold text-green-600">{selectedData.systolic.p50}/{selectedData.diastolic.p50}</p>
                <p className="text-xs text-muted-foreground">MAP: {calcMAP(selectedData.systolic.p50, selectedData.diastolic.p50)}</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-amber-700 dark:text-amber-300 mb-1">Elevated (90th)</p>
                <p className="text-lg font-mono font-bold text-amber-600">{selectedData.systolic.p90}/{selectedData.diastolic.p90}</p>
                <p className="text-xs text-muted-foreground">MAP: {calcMAP(selectedData.systolic.p90, selectedData.diastolic.p90)}</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">HTN Stage 1 (95th)</p>
                <p className="text-lg font-mono font-bold text-orange-600">{selectedData.systolic.p95}/{selectedData.diastolic.p95}</p>
                <p className="text-xs text-muted-foreground">MAP: {calcMAP(selectedData.systolic.p95, selectedData.diastolic.p95)}</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-red-700 dark:text-red-300 mb-1">HTN Stage 2</p>
                <p className="text-lg font-mono font-bold text-red-600">≥{selectedData.systolic.p95 + 12}/≥{selectedData.diastolic.p95 + 12}</p>
                <p className="text-xs text-muted-foreground">MAP: ≥{calcMAP(selectedData.systolic.p95 + 12, selectedData.diastolic.p95 + 12)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Reference */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Classification Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Source: Harriet Lane Handbook 23rd Edition (2023)</p>
          
          {/* PALS SBP Calculation */}
          {selectedAge && (
            <div className="mt-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
              <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">PALS SBP Thresholds (Age: {selectedAge} years)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-muted-foreground">5th Centile (Hypotension)</p>
                  <p className="text-lg font-bold text-purple-600">{70 + 2 * parseInt(selectedAge)} mmHg</p>
                  <p className="text-xs font-mono text-muted-foreground">70 + 2 × {selectedAge}</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-muted-foreground">50th Centile (Median)</p>
                  <p className="text-lg font-bold text-purple-600">{90 + 2 * parseInt(selectedAge)} mmHg</p>
                  <p className="text-xs font-mono text-muted-foreground">90 + 2 × {selectedAge}</p>
                </div>
              </div>
              <p className="text-xs mt-2 italic">Source: PALS (Pediatric Advanced Life Support)</p>
            </div>
          )}
          
          <div className="mt-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Hypotension (&lt;5th percentile)</p>
            <p className="text-blue-600">SBP &lt;{selectedAge ? (70 + 2 * parseInt(selectedAge)) : "5th %ile"} mmHg (PALS) or per Harriet Lane table</p>
            <p className="mt-1 text-xs">Consider: Volume status, cardiac function, sepsis screening</p>
          </div>
          <p className="pt-2">• <span className="text-green-600 font-medium">Normal:</span> &lt;90th percentile for age, sex, height</p>
          <p>• <span className="text-amber-600 font-medium">Elevated BP:</span> ≥90th to &lt;95th percentile OR 120/80 to &lt;95th (whichever is lower)</p>
          <p>• <span className="text-orange-600 font-medium">HTN Stage 1:</span> ≥95th to &lt;95th + 12 mmHg OR 130/80 to 139/89 (age ≥13y)</p>
          <p>• <span className="text-red-600 font-medium">HTN Stage 2:</span> ≥95th + 12 mmHg OR ≥140/90 (age ≥13y)</p>
          <p className="pt-2 font-medium">MAP = DBP + (SBP - DBP) / 3</p>
          <p className="text-xs italic mt-2">Note: Confirm elevated readings on ≥3 separate occasions before diagnosis</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Infusions Page
const InfusionsPage = ({ onBack }) => {
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  const infusionCategories = [
    {
      category: "Neuromuscular Blockade",
      color: "purple",
      drugs: [
        {
          name: "Cisatracurium (Nimbex)",
          stat: { dose: "0.1-0.2 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.2).toFixed(2)} mg` : null },
          infusion: { dose: "1-4 mcg/kg/min", calc: w ? `${(w * 1).toFixed(0)} - ${(w * 4).toFixed(0)} mcg/min` : null }
        }
      ]
    },
    {
      category: "Sedatives",
      color: "blue",
      drugs: [
        {
          name: "Midazolam",
          stat: { dose: "0.1 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} mg` : null },
          infusion: { dose: "0.1-0.5 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.5).toFixed(2)} mg/hr` : null }
        },
        {
          name: "Fentanyl",
          stat: { dose: "1 mcg/kg", calc: w ? `${(w * 1).toFixed(1)} mcg` : null },
          infusion: { dose: "1-5 mcg/kg/hr", calc: w ? `${(w * 1).toFixed(1)} - ${(w * 5).toFixed(1)} mcg/hr` : null }
        }
      ]
    },
    {
      category: "Diuretics",
      color: "teal",
      drugs: [
        {
          name: "Furosemide (Lasix)",
          stat: { dose: "0.5-1 mg/kg (Max 40mg)", calc: w ? `${Math.min(w * 0.5, 40).toFixed(1)} - ${Math.min(w * 1, 40).toFixed(1)} mg` : null },
          infusion: { dose: "0.1-1 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 1).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Bronchodilator",
      color: "amber",
      drugs: [
        {
          name: "Ventolin Infusion",
          stat: null,
          infusion: { dose: "0.3 mg/kg/hr", calc: w ? `${(w * 0.3).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Inotropic Support",
      color: "red",
      isInotrope: true,
      drugs: [
        { name: "Dopamine", unit: "mcg/kg/min", min: 2, max: 20, note: "Low (2-5): renal, Med (5-10): cardiac, High (10-20): vasopressor" },
        { name: "Dobutamine", unit: "mcg/kg/min", min: 2, max: 20, note: "Inotrope, minimal vasopressor effect" },
        { name: "Epinephrine", unit: "mcg/kg/min", min: 0.01, max: 0.5, note: "Low: β-effect, High: α-effect" },
        { name: "Norepinephrine", unit: "mcg/kg/min", min: 0.01, max: 0.5, note: "Potent vasopressor, minimal β-effect" },
      ]
    }
  ];

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Weight Input */}
      <Card className="nightingale-card">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              placeholder="Enter weight for calculations"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Infusion Categories */}
      {infusionCategories.map((cat, idx) => (
        <Card key={idx} className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{cat.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cat.isInotrope ? (
              // Special display for inotropes with mcg/kg/min
              cat.drugs.map((drug, dIdx) => (
                <div key={dIdx} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">{drug.name}</p>
                    <span className="text-xs text-muted-foreground">{drug.min}-{drug.max} {drug.unit}</span>
                  </div>
                  {w > 0 && (
                    <div className="mt-2 p-2 rounded-lg bg-white dark:bg-gray-900">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <p className="text-muted-foreground">Low</p>
                          <p className="font-mono text-red-600">{(drug.min)} {drug.unit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Med</p>
                          <p className="font-mono text-red-600">{((drug.min + drug.max) / 2).toFixed(1)} {drug.unit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">High</p>
                          <p className="font-mono text-red-600">{drug.max} {drug.unit}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center border-t pt-2">
                        For {w}kg: {(drug.min * w * 60 / 1000).toFixed(2)} - {(drug.max * w * 60 / 1000).toFixed(2)} mg/hr
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{drug.note}</p>
                </div>
              ))
            ) : (
              // Standard drug display
              cat.drugs.map((drug, dIdx) => (
                <div key={dIdx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="font-semibold text-sm mb-2">{drug.name}</p>
                  <div className="space-y-1">
                    {drug.stat && (
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                        <span className="text-muted-foreground">Stat: {drug.stat.dose}</span>
                        {drug.stat.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">→ {drug.stat.calc}</span>}
                      </div>
                    )}
                    {drug.infusion && (
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                        <span className="text-muted-foreground">Infusion: {drug.infusion.dose}</span>
                        {drug.infusion.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">→ {drug.infusion.calc}</span>}
                      </div>
                    )}
                    {drug.range && (
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                        <span className="text-muted-foreground">Range: {drug.range}</span>
                        {drug.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">→ {drug.calc}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Intubation Page
const IntubationPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");

  const calculateETT = () => {
    const ageNum = parseFloat(age);
    if (!ageNum) return null;
    return {
      uncuffed: ((ageNum / 4) + 4).toFixed(1),
      cuffed: ((ageNum / 4) + 3.5).toFixed(1),
      depth: ((ageNum / 2) + 12).toFixed(1)
    };
  };

  const ettResult = calculateETT();

  const rsiSteps = [
    {
      title: "1. Preparation",
      items: ["Monitoring: SpO2, ECG, BP, EtCO2", "IV access confirmed", "Suction ready", "Bag-mask ventilation ready", "ETT + stylet (size + 0.5 backup)", "Laryngoscope checked", "Drugs drawn up"]
    },
    {
      title: "2. Preoxygenation",
      items: ["100% O2 for 3-5 minutes", "Avoid positive pressure if possible", "Target SpO2 >95%"]
    },
    {
      title: "3. Pretreatment",
      items: ["Atropine 0.02 mg/kg (min 0.1mg, max 0.5mg) - for <1yr or bradycardia risk", "Consider Lidocaine 1.5 mg/kg IV for ↑ICP"]
    },
    {
      title: "4. Paralysis with Induction",
      drugs: [
        { name: "Ketamine", dose: "1-2 mg/kg IV", note: "Hemodynamically stable" },
        { name: "Midazolam", dose: "0.1-0.3 mg/kg IV", note: "May cause hypotension" },
        { name: "Fentanyl", dose: "2-3 mcg/kg IV", note: "Hemodynamically stable" },
        { name: "Propofol", dose: "1-3 mg/kg IV", note: "May cause hypotension" },
        { name: "Cisatracurium", dose: "0.15-0.2 mg/kg IV", note: "Paralytic (onset 2-3 min)" },
      ]
    },
    {
      title: "5. Positioning",
      items: ["Sniffing position (infant: neutral)", "External laryngeal manipulation if needed", "Bougie/stylet if difficult view"]
    },
    {
      title: "6. Placement Confirmation",
      items: ["Direct visualization of cords", "EtCO2 waveform (gold standard)", "Bilateral breath sounds", "Chest rise", "SpO2 stable/improving", "CXR for depth"]
    }
  ];

  return (
    <div className="space-y-4 pt-4 pb-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="rsi">RSI Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4 mt-4">
          <Card className="nightingale-card">
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Age (years)</Label>
                  <Input type="number" placeholder="e.g., 5" value={age} onChange={(e) => setAge(e.target.value)} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" placeholder="Optional" value={weight} onChange={(e) => setWeight(e.target.value)} className="font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>

          {ettResult && (
            <>
              <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/30">
                <CardContent className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">ETT Size (Uncuffed)</p>
                  <p className="text-4xl font-mono font-bold text-purple-600">{ettResult.uncuffed} mm</p>
                  <p className="text-xs text-muted-foreground mt-1">(Age/4) + 4</p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                  <CardContent className="pt-4 text-center">
                    <p className="text-xs text-muted-foreground">Cuffed ETT</p>
                    <p className="text-2xl font-mono font-bold text-blue-600">{ettResult.cuffed} mm</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
                  <CardContent className="pt-4 text-center">
                    <p className="text-xs text-muted-foreground">Depth at Lip</p>
                    <p className="text-2xl font-mono font-bold text-green-600">{ettResult.depth} cm</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          <Card className="nightingale-card">
            <CardContent className="pt-4 text-xs text-muted-foreground space-y-1">
              <p>• Uncuffed: (Age/4) + 4</p>
              <p>• Cuffed: (Age/4) + 3.5</p>
              <p>• Depth: (Age/2) + 12</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rsi" className="space-y-3 mt-4">
          {rsiSteps.map((step, idx) => (
            <Card key={idx} className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#00d9c5]">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {step.items && step.items.map((item, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#00d9c5] focus:ring-[#00d9c5]" />
                    <span className="text-xs group-hover:text-foreground text-muted-foreground">{item}</span>
                  </label>
                ))}
                {step.drugs && step.drugs.map((drug, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#00d9c5] focus:ring-[#00d9c5]" />
                    <div className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs">
                      <p className="font-medium">{drug.name}: {drug.dose}</p>
                      <p className="text-muted-foreground">{drug.note}</p>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Scoring Page - GCS, PRAM, Westley, OI, IWL
const ScoringPage = ({ onBack }) => {
  const [activeScore, setActiveScore] = useState("gcs");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-4 pt-4 pb-8">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "gcs", label: "GCS" },
          { id: "pram", label: "PRAM" },
          { id: "westley", label: "Westley" },
          { id: "oi", label: "OI" },
          { id: "iwl", label: "IWL" }
        ].map((score) => (
          <Button
            key={score.id}
            variant={activeScore === score.id ? "default" : "outline"}
            onClick={() => setActiveScore(score.id)}
            className="whitespace-nowrap"
          >
            {score.label}
          </Button>
        ))}
      </div>

      {activeScore === "gcs" && <GCSScoring />}
      {activeScore === "pram" && <PRAMScoring />}
      {activeScore === "westley" && <WestleyScoring />}
      {activeScore === "oi" && <OxygenationIndex />}
      {activeScore === "iwl" && <IWLCalculator />}
    </div>
  );
};

// GCS Scoring Component
const GCSScoring = () => {
  const [eye, setEye] = useState(0);
  const [verbal, setVerbal] = useState(0);
  const [motor, setMotor] = useState(0);
  const [leftPupil, setLeftPupil] = useState("");
  const [rightPupil, setRightPupil] = useState("");

  const total = eye + verbal + motor;

  const eyeOptions = [
    { value: 4, label: "Spontaneous" },
    { value: 3, label: "To voice" },
    { value: 2, label: "To pain" },
    { value: 1, label: "None" }
  ];

  const verbalOptions = [
    { value: 5, label: "Oriented" },
    { value: 4, label: "Confused" },
    { value: 3, label: "Inappropriate words" },
    { value: 2, label: "Incomprehensible" },
    { value: 1, label: "None" }
  ];

  const motorOptions = [
    { value: 6, label: "Obeys commands" },
    { value: 5, label: "Localizes pain" },
    { value: 4, label: "Withdraws" },
    { value: 3, label: "Flexion" },
    { value: 2, label: "Extension" },
    { value: 1, label: "None" }
  ];

  const pupilOptions = ["Reactive", "Sluggish", "Fixed", "Dilated"];

  return (
    <div className="space-y-4">
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Eye Opening (E)</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={eye.toString()} onValueChange={(v) => setEye(parseInt(v))}>
            {eyeOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value.toString()} id={`eye-${opt.value}`} />
                <Label htmlFor={`eye-${opt.value}`} className="text-sm">{opt.value} - {opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Verbal Response (V)</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={verbal.toString()} onValueChange={(v) => setVerbal(parseInt(v))}>
            {verbalOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value.toString()} id={`verbal-${opt.value}`} />
                <Label htmlFor={`verbal-${opt.value}`} className="text-sm">{opt.value} - {opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Motor Response (M)</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={motor.toString()} onValueChange={(v) => setMotor(parseInt(v))}>
            {motorOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value.toString()} id={`motor-${opt.value}`} />
                <Label htmlFor={`motor-${opt.value}`} className="text-sm">{opt.value} - {opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Pupil Assessment</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Left Pupil</Label>
            <select value={leftPupil} onChange={(e) => setLeftPupil(e.target.value)} className="w-full h-9 rounded-lg bg-gray-50 dark:bg-gray-800 px-2 text-sm">
              <option value="">Select...</option>
              {pupilOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Right Pupil</Label>
            <select value={rightPupil} onChange={(e) => setRightPupil(e.target.value)} className="w-full h-9 rounded-lg bg-gray-50 dark:bg-gray-800 px-2 text-sm">
              <option value="">Select...</option>
              {pupilOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {total > 0 && (
        <Card className={`border-2 ${total <= 8 ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : total <= 12 ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30' : 'border-green-300 bg-green-50 dark:bg-green-950/30'}`}>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Total GCS Score</p>
            <p className="text-5xl font-mono font-bold">{total}/15</p>
            <p className="text-sm mt-2">E{eye} V{verbal} M{motor}</p>
            {leftPupil && rightPupil && (
              <p className="text-xs text-muted-foreground mt-1">Pupils: L-{leftPupil}, R-{rightPupil}</p>
            )}
            <p className="text-xs mt-2 font-medium">
              {total <= 8 ? "Severe (≤8)" : total <= 12 ? "Moderate (9-12)" : "Mild (13-15)"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// PRAM Scoring Component
const PRAMScoring = () => {
  const [scalene, setScalene] = useState(0);
  const [suprasternal, setSuprasternal] = useState(0);
  const [wheezing, setWheezing] = useState(0);
  const [airEntry, setAirEntry] = useState(0);
  const [o2Sat, setO2Sat] = useState(0);

  const total = scalene + suprasternal + wheezing + airEntry + o2Sat;

  return (
    <div className="space-y-4">
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Pediatric Respiratory Assessment Measure (PRAM)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scalene Muscle Contraction */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Scalene Muscle Contraction</Label>
            <RadioGroup value={scalene.toString()} onValueChange={(v) => setScalene(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="sc-0" /><Label htmlFor="sc-0" className="text-xs">0 - Absent</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="sc-2" /><Label htmlFor="sc-2" className="text-xs">2 - Present</Label></div>
            </RadioGroup>
          </div>

          {/* Suprasternal Retractions */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Suprasternal Retractions</Label>
            <RadioGroup value={suprasternal.toString()} onValueChange={(v) => setSuprasternal(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="ss-0" /><Label htmlFor="ss-0" className="text-xs">0 - Absent</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="ss-2" /><Label htmlFor="ss-2" className="text-xs">2 - Present</Label></div>
            </RadioGroup>
          </div>

          {/* Wheezing */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Wheezing</Label>
            <RadioGroup value={wheezing.toString()} onValueChange={(v) => setWheezing(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="wh-0" /><Label htmlFor="wh-0" className="text-xs">0 - Absent</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="wh-1" /><Label htmlFor="wh-1" className="text-xs">1 - Expiratory only</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="wh-2" /><Label htmlFor="wh-2" className="text-xs">2 - Inspiratory & Expiratory</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="wh-3" /><Label htmlFor="wh-3" className="text-xs">3 - Audible without stethoscope</Label></div>
            </RadioGroup>
          </div>

          {/* Air Entry */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Air Entry</Label>
            <RadioGroup value={airEntry.toString()} onValueChange={(v) => setAirEntry(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="ae-0" /><Label htmlFor="ae-0" className="text-xs">0 - Normal</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="ae-1" /><Label htmlFor="ae-1" className="text-xs">1 - Decreased at bases</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="ae-2" /><Label htmlFor="ae-2" className="text-xs">2 - Widespread decrease</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="ae-3" /><Label htmlFor="ae-3" className="text-xs">3 - Absent/minimal</Label></div>
            </RadioGroup>
          </div>

          {/* O2 Saturation */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">O2 Saturation (Room Air)</Label>
            <RadioGroup value={o2Sat.toString()} onValueChange={(v) => setO2Sat(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="o2-0" /><Label htmlFor="o2-0" className="text-xs">0 - ≥95%</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="o2-1" /><Label htmlFor="o2-1" className="text-xs">1 - 92-94%</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="o2-2" /><Label htmlFor="o2-2" className="text-xs">2 - &lt;92%</Label></div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 ${total >= 8 ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : total >= 4 ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30' : 'border-green-300 bg-green-50 dark:bg-green-950/30'}`}>
        <CardContent className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">PRAM Score</p>
          <p className="text-5xl font-mono font-bold">{total}/12</p>
          <p className="text-sm mt-2 font-medium">
            {total >= 8 ? "Severe (≥8)" : total >= 4 ? "Moderate (4-7)" : "Mild (0-3)"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Westley Croup Score
const WestleyScoring = () => {
  const [stridor, setStridor] = useState(0);
  const [retractions, setRetractions] = useState(0);
  const [airEntry, setAirEntry] = useState(0);
  const [cyanosis, setCyanosis] = useState(0);
  const [consciousness, setConsciousness] = useState(0);

  const total = stridor + retractions + airEntry + cyanosis + consciousness;

  return (
    <div className="space-y-4">
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Westley Croup Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Stridor</Label>
            <RadioGroup value={stridor.toString()} onValueChange={(v) => setStridor(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="str-0" /><Label htmlFor="str-0" className="text-xs">0 - None</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="str-1" /><Label htmlFor="str-1" className="text-xs">1 - When agitated</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="str-2" /><Label htmlFor="str-2" className="text-xs">2 - At rest</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Retractions</Label>
            <RadioGroup value={retractions.toString()} onValueChange={(v) => setRetractions(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="ret-0" /><Label htmlFor="ret-0" className="text-xs">0 - None</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="ret-1" /><Label htmlFor="ret-1" className="text-xs">1 - Mild</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="ret-2" /><Label htmlFor="ret-2" className="text-xs">2 - Moderate</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="ret-3" /><Label htmlFor="ret-3" className="text-xs">3 - Severe</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Air Entry</Label>
            <RadioGroup value={airEntry.toString()} onValueChange={(v) => setAirEntry(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="air-0" /><Label htmlFor="air-0" className="text-xs">0 - Normal</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="air-1" /><Label htmlFor="air-1" className="text-xs">1 - Decreased</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="air-2" /><Label htmlFor="air-2" className="text-xs">2 - Markedly decreased</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Cyanosis</Label>
            <RadioGroup value={cyanosis.toString()} onValueChange={(v) => setCyanosis(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="cy-0" /><Label htmlFor="cy-0" className="text-xs">0 - None</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="4" id="cy-4" /><Label htmlFor="cy-4" className="text-xs">4 - With agitation</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="5" id="cy-5" /><Label htmlFor="cy-5" className="text-xs">5 - At rest</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Level of Consciousness</Label>
            <RadioGroup value={consciousness.toString()} onValueChange={(v) => setConsciousness(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="con-0" /><Label htmlFor="con-0" className="text-xs">0 - Normal</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="5" id="con-5" /><Label htmlFor="con-5" className="text-xs">5 - Altered</Label></div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 ${total >= 8 ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : total >= 4 ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30' : 'border-green-300 bg-green-50 dark:bg-green-950/30'}`}>
        <CardContent className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">Westley Score</p>
          <p className="text-5xl font-mono font-bold">{total}/17</p>
          <p className="text-sm mt-2 font-medium">
            {total >= 8 ? "Severe (≥8)" : total >= 4 ? "Moderate (4-7)" : "Mild (≤3)"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Oxygenation Index
const OxygenationIndex = () => {
  const [map, setMap] = useState("");
  const [fio2, setFio2] = useState("");
  const [pao2, setPao2] = useState("");

  const calculateOI = () => {
    const mapVal = parseFloat(map);
    const fio2Val = parseFloat(fio2);
    const pao2Val = parseFloat(pao2);
    if (!mapVal || !fio2Val || !pao2Val) return null;
    return ((mapVal * fio2Val * 100) / pao2Val).toFixed(1);
  };

  const oi = calculateOI();

  const getSeverity = (oiVal) => {
    const val = parseFloat(oiVal);
    if (val < 5) return { label: "Normal", color: "green" };
    if (val < 10) return { label: "Mild", color: "amber" };
    if (val < 20) return { label: "Severe", color: "red" };
    if (val < 40) return { label: "Extreme", color: "red" };
    return { label: "ECMO Referral", color: "red" };
  };

  const severity = oi ? getSeverity(oi) : null;

  return (
    <div className="space-y-4">
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Oxygenation Index (OI)</CardTitle>
          <CardDescription className="text-xs">Assess severity of hypoxic respiratory failure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Mean Airway Pressure (MAP) cmH2O</Label>
            <Input type="number" placeholder="e.g., 15" value={map} onChange={(e) => setMap(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">FiO2 (as decimal, e.g., 0.6)</Label>
            <Input type="number" step="0.01" placeholder="e.g., 0.6" value={fio2} onChange={(e) => setFio2(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">PaO2 (mmHg)</Label>
            <Input type="number" placeholder="e.g., 60" value={pao2} onChange={(e) => setPao2(e.target.value)} className="font-mono" />
          </div>
        </CardContent>
      </Card>

      {oi && severity && (
        <Card className={`border-2 border-${severity.color}-300 bg-${severity.color}-50 dark:bg-${severity.color}-950/30`}>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Oxygenation Index</p>
            <p className="text-5xl font-mono font-bold">{oi}</p>
            <p className="text-sm mt-2 font-medium">{severity.label}</p>
          </CardContent>
        </Card>
      )}

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• OI = (MAP × FiO2 × 100) / PaO2</p>
          <p>• &lt;5 = Normal</p>
          <p>• &gt;10 = Severe oxygenation problem</p>
          <p>• &gt;20 = Extreme oxygenation problem</p>
          <p>• &gt;40 = ECMO referral</p>
        </CardContent>
      </Card>
    </div>
  );
};

// IWL Calculator Component (Insensible Water Loss)
const IWLCalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) return null;
    const bsa = Math.sqrt((w * h) / 3600);
    return { bsa: bsa.toFixed(3), iwl: (400 * bsa).toFixed(1) };
  };

  const result = calculate();

  return (
    <div className="space-y-4">
      <Card className="nightingale-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Insensible Water Loss</CardTitle>
          <CardDescription>Based on Body Surface Area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input type="number" placeholder="e.g., 15" value={weight} onChange={(e) => setWeight(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input type="number" placeholder="e.g., 100" value={height} onChange={(e) => setHeight(e.target.value)} className="font-mono" />
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-teal-200 bg-teal-50 dark:bg-teal-950/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Insensible Water Loss</p>
              <p className="text-4xl font-mono font-bold text-[#00d9c5]">{result.iwl} ml/day</p>
            </CardContent>
          </Card>
          <Card className="nightingale-card">
            <CardContent className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">Body Surface Area</p>
              <p className="text-2xl font-mono font-bold">{result.bsa} m²</p>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Formulas</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• IWL = 400 × BSA</p>
          <p>• BSA = √(Weight × Height / 3600)</p>
        </CardContent>
      </Card>
    </div>
  );
};

// CPR Page - PALS 2025 Algorithms & Drug Dosing (Redesigned)
const CPRPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("arrest");
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  // Scroll to top when page loads - target the scrollable container
  useEffect(() => {
    const scrollContainer = document.querySelector('.native-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, []);

  // Drug calculations based on weight (PALS 2025)
  const calculateDrugs = () => {
    if (!w) return null;
    return {
      epinephrine: {
        dose: (w * 0.01).toFixed(3),
        volume1to10000: (w * 0.1).toFixed(2),
        ettDose: (w * 0.1).toFixed(2),
      },
      amiodarone: {
        dose: (w * 5).toFixed(1),
      },
      adenosine: {
        firstDose: Math.min(w * 0.1, 6).toFixed(2),
        secondDose: Math.min(w * 0.2, 12).toFixed(2),
      },
      atropine: {
        dose: Math.max(Math.min(w * 0.02, 0.5), 0.1).toFixed(2),
      },
      defibrillation: {
        first: (w * 2).toFixed(0),
        subsequent: (w * 4).toFixed(0),
      },
      cardioversion: {
        first: (w * 0.5).toFixed(1),
        second: (w * 1).toFixed(0),
      },
      lidocaine: {
        bolus: (w * 1).toFixed(1),
      },
    };
  };

  const drugs = calculateDrugs();

  // Calculated value styling - red color for visibility
  const calcValue = "font-mono font-bold text-red-600 dark:text-red-400";

  // Collapsible Section Component
  const Section = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium text-sm">{title}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="p-4 bg-white dark:bg-gray-900 text-sm">{children}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Header Card - Weight Input */}
      <Card className="nightingale-card border-red-200 dark:border-red-800/50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <HeartIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Patient Weight (kg)</Label>
              <Input
                type="number"
                placeholder="Enter weight for drug calculations"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="font-mono mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 text-xs bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="arrest" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Arrest</TabsTrigger>
          <TabsTrigger value="tachy" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Tachy</TabsTrigger>
          <TabsTrigger value="brady" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Brady</TabsTrigger>
          <TabsTrigger value="drugs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Drugs</TabsTrigger>
        </TabsList>

        {/* ==================== CARDIAC ARREST TAB ==================== */}
        <TabsContent value="arrest" className="space-y-3 mt-4">
          {/* CPR Basics */}
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Cardiac Arrest - PALS 2025
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Start CPR Box */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-red-400">
                <p className="font-semibold text-sm mb-2">1. Start High-Quality CPR</p>
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p>• Rate: <span className={calcValue}>100-120/min</span></p>
                    <p>• Depth: <span className={calcValue}>⅓ AP diameter</span></p>
                  </div>
                  <div>
                    <p>• C:V ratio: <span className={calcValue}>15:2</span> (2 rescuers)</p>
                    <p>• CPR fraction: <span className={calcValue}>&gt;60%</span></p>
                  </div>
                </div>
              </div>

              {/* Rhythm Check */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-400">
                <p className="font-semibold text-sm mb-3">2. Check Rhythm - Shockable?</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Shockable */}
                  <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                    <p className="font-semibold text-xs mb-2 text-center border-b pb-2">VF / pVT</p>
                    <ol className="space-y-1.5 text-xs text-muted-foreground">
                      <li><span className="font-medium text-foreground">→ Shock</span> {drugs ? <span className={calcValue}>{drugs.defibrillation.first}J</span> : <span className="text-muted-foreground">2 J/kg</span>}</li>
                      <li>→ CPR 2 min</li>
                      <li><span className="font-medium text-foreground">→ Shock</span> {drugs ? <span className={calcValue}>{drugs.defibrillation.subsequent}J</span> : <span className="text-muted-foreground">4 J/kg</span>}</li>
                      <li>→ CPR + Epinephrine</li>
                      <li>→ Shock + Amiodarone</li>
                    </ol>
                  </div>
                  {/* Non-Shockable */}
                  <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                    <p className="font-semibold text-xs mb-2 text-center border-b pb-2">Asystole / PEA</p>
                    <ol className="space-y-1.5 text-xs text-muted-foreground">
                      <li>→ CPR 2 min</li>
                      <li><span className="font-medium text-foreground">→ Epinephrine ASAP</span></li>
                      <li>→ CPR 2 min</li>
                      <li>→ Check rhythm</li>
                      <li>→ Epi q3-5 min</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Drug Doses Quick Reference */}
              {drugs && (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-400">
                  <p className="font-semibold text-sm mb-2">Quick Drug Doses ({w}kg)</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Epinephrine:</span>
                      <span className={`${calcValue} ml-1`}>{drugs.epinephrine.dose}mg</span>
                      <span className="text-muted-foreground text-[10px] ml-1">({drugs.epinephrine.volume1to10000}mL)</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Amiodarone:</span>
                      <span className={`${calcValue} ml-1`}>{drugs.amiodarone.dose}mg</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Defib 1st:</span>
                      <span className={`${calcValue} ml-1`}>{drugs.defibrillation.first}J</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Defib 2nd+:</span>
                      <span className={`${calcValue} ml-1`}>{drugs.defibrillation.subsequent}J</span>
                    </div>
                  </div>
                </div>
              )}

              {/* H's and T's - Collapsible */}
              <Section title="Reversible Causes (H's & T's)">
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-1">H&apos;s</p>
                    <ul className="space-y-0.5">
                      <li>• Hypoxia</li>
                      <li>• Hypovolemia</li>
                      <li>• H+ (Acidosis)</li>
                      <li>• Hypo/Hyperkalemia</li>
                      <li>• Hypothermia</li>
                      <li>• Hypoglycemia</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">T&apos;s</p>
                    <ul className="space-y-0.5">
                      <li>• Tension pneumothorax</li>
                      <li>• Tamponade (cardiac)</li>
                      <li>• Toxins</li>
                      <li>• Thrombosis (PE)</li>
                      <li>• Thrombosis (coronary)</li>
                    </ul>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TACHYCARDIA TAB ==================== */}
        <TabsContent value="tachy" className="space-y-3 mt-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Tachycardia with Pulse
              </CardTitle>
              <CardDescription className="text-xs">HR &gt;220 (infant) or &gt;180 (child)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Assessment */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-amber-400">
                <p className="font-semibold text-sm mb-2">Initial Assessment</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Support ABCs, give O₂, IV/IO access</li>
                  <li>• 12-lead ECG → QRS narrow (&lt;0.09s) or wide (≥0.09s)?</li>
                  <li>• Signs of hemodynamic instability?</li>
                </ul>
              </div>

              {/* QRS Comparison */}
              <div className="grid grid-cols-2 gap-3">
                {/* Narrow QRS */}
                <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                  <p className="font-semibold text-xs mb-2 text-center border-b pb-2">Narrow QRS (SVT)</p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="font-medium text-foreground">Stable:</p>
                      <p className="text-muted-foreground">1. Vagal maneuvers</p>
                      <p className="text-muted-foreground">2. Adenosine IV push</p>
                      {drugs && (
                        <p className="mt-1">
                          <span className="text-muted-foreground">1st:</span> <span className={calcValue}>{drugs.adenosine.firstDose}mg</span><br/>
                          <span className="text-muted-foreground">2nd:</span> <span className={calcValue}>{drugs.adenosine.secondDose}mg</span>
                        </p>
                      )}
                    </div>
                    <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="font-medium text-foreground">Unstable:</p>
                      <p className="text-muted-foreground">Synchronized cardioversion</p>
                      {drugs && <p className={calcValue}>{drugs.cardioversion.first}-{drugs.cardioversion.second}J</p>}
                    </div>
                  </div>
                </div>

                {/* Wide QRS */}
                <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                  <p className="font-semibold text-xs mb-2 text-center border-b pb-2">Wide QRS (VT)</p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="font-medium text-foreground">Stable:</p>
                      <p className="text-muted-foreground">Expert consultation</p>
                      <p className="text-muted-foreground">Amiodarone IV</p>
                      {drugs && <p className={calcValue}>{drugs.amiodarone.dose}mg over 20-60min</p>}
                    </div>
                    <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="font-medium text-foreground text-[10px] sm:text-xs">Unstable/Pulseless:</p>
                      <p className="text-muted-foreground text-[10px] sm:text-xs">Cardioversion or Arrest protocol</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== BRADYCARDIA TAB ==================== */}
        <TabsContent value="brady" className="space-y-3 mt-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Bradycardia with Pulse
              </CardTitle>
              <CardDescription className="text-xs">HR &lt;60 with cardiopulmonary compromise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Steps */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-blue-400">
                <p className="font-semibold text-sm mb-2">Initial Steps</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Support ABCs, give O₂, monitor, IV/IO</li>
                  <li>• If HR &lt;60 with poor perfusion → <span className="font-medium text-red-600">Start CPR</span></li>
                </ul>
              </div>

              {/* Treatment Algorithm */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-400">
                <p className="font-semibold text-sm mb-3">Persistent Bradycardia + Compromise</p>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs">
                    <p className="font-medium text-foreground">1. Epinephrine</p>
                    <p className="text-muted-foreground">0.01 mg/kg IV/IO (1:10,000) q3-5min</p>
                    {drugs && <p className={`${calcValue} mt-1`}>{drugs.epinephrine.dose}mg ({drugs.epinephrine.volume1to10000}mL)</p>}
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs">
                    <p className="font-medium text-foreground">2. Atropine <span className="font-normal text-muted-foreground">(if vagal/AV block)</span></p>
                    <p className="text-muted-foreground">0.02 mg/kg IV/IO (min 0.1mg, max 0.5mg)</p>
                    {drugs && <p className={`${calcValue} mt-1`}>{drugs.atropine.dose}mg</p>}
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs">
                    <p className="font-medium text-foreground">3. Consider pacing</p>
                    <p className="text-muted-foreground">If unresponsive to medications</p>
                  </div>
                </div>
              </div>

              {/* Normal HR Reference */}
              <Section title="Normal Heart Rate by Age">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <span className="text-muted-foreground">Newborn:</span>
                    <span className={`${calcValue} ml-2`}>80-205 bpm</span>
                  </div>
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <span className="text-muted-foreground">Infant:</span>
                    <span className={`${calcValue} ml-2`}>75-190 bpm</span>
                  </div>
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <span className="text-muted-foreground">Child (1-10y):</span>
                    <span className={`${calcValue} ml-2`}>60-140 bpm</span>
                  </div>
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <span className="text-muted-foreground">Adolescent:</span>
                    <span className={`${calcValue} ml-2`}>50-100 bpm</span>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== DRUGS TAB ==================== */}
        <TabsContent value="drugs" className="space-y-3 mt-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                PALS Drug Reference
              </CardTitle>
              <CardDescription className="text-xs">
                {w ? `Calculated for ${w} kg patient` : "Enter weight above for calculations"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Epinephrine */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Epinephrine (1:10,000)</p>
                    <p className="text-xs text-muted-foreground">Arrest, bradycardia, anaphylaxis</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">0.01 mg/kg IV/IO</p>
                    {drugs && (
                      <p className={`text-sm ${calcValue}`}>{drugs.epinephrine.dose} mg <span className="text-muted-foreground font-normal">({drugs.epinephrine.volume1to10000} mL)</span></p>
                    )}
                  </div>
                </div>
              </div>

              {/* Amiodarone */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Amiodarone</p>
                    <p className="text-xs text-muted-foreground">VF/pVT, stable VT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">5 mg/kg IV/IO</p>
                    {drugs && <p className={`text-sm ${calcValue}`}>{drugs.amiodarone.dose} mg</p>}
                  </div>
                </div>
              </div>

              {/* Adenosine */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Adenosine</p>
                    <p className="text-xs text-muted-foreground">SVT (rapid IV push + flush)</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">1st: 0.1 mg/kg (max 6mg)</p>
                    {drugs && <p className={calcValue}>{drugs.adenosine.firstDose} mg</p>}
                    <p className="text-muted-foreground mt-1">2nd: 0.2 mg/kg (max 12mg)</p>
                    {drugs && <p className={calcValue}>{drugs.adenosine.secondDose} mg</p>}
                  </div>
                </div>
              </div>

              {/* Atropine */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Atropine</p>
                    <p className="text-xs text-muted-foreground">Bradycardia (vagal/AV block)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">0.02 mg/kg (min 0.1, max 0.5)</p>
                    {drugs && <p className={`text-sm ${calcValue}`}>{drugs.atropine.dose} mg</p>}
                  </div>
                </div>
              </div>

              {/* Energy Doses */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="font-semibold text-sm mb-2">Energy Doses</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-medium">Defibrillation</p>
                    <p className="text-muted-foreground">1st: 2 J/kg {drugs && <span className={calcValue}>→ {drugs.defibrillation.first}J</span>}</p>
                    <p className="text-muted-foreground">2nd+: 4 J/kg {drugs && <span className={calcValue}>→ {drugs.defibrillation.subsequent}J</span>}</p>
                  </div>
                  <div>
                    <p className="font-medium">Cardioversion</p>
                    <p className="text-muted-foreground">0.5-1 J/kg → 2 J/kg</p>
                    {drugs && <p className={calcValue}>{drugs.cardioversion.first}-{drugs.cardioversion.second}J</p>}
                  </div>
                </div>
              </div>

              {/* Lidocaine */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Lidocaine (alternative)</p>
                    <p className="text-xs text-muted-foreground">VF/pVT if amiodarone unavailable</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">1 mg/kg IV/IO bolus</p>
                    {drugs && <p className={`text-sm ${calcValue}`}>{drugs.lidocaine.bolus} mg</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card className="nightingale-card">
            <CardContent className="pt-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">PALS 2025 Quick Reference</p>
              <p>• Epinephrine: repeat every 3-5 minutes</p>
              <p>• CPR: 100-120/min, minimize interruptions (&gt;60%)</p>
              <p>• DBP target: ≥25 mmHg (infant), ≥30 mmHg (child)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Approaches Page - PICU Protocols (Saudi MOH Guidelines)
const ApproachesPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("sepsis");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const w = parseFloat(weight) || 0;
  const ageNum = parseFloat(age) || 0;

  // Define all approach tabs with search keywords
  const approachTabs = [
    { id: "sepsis", label: "Septic Shock", keywords: ["sepsis", "septic", "shock", "cold", "warm", "vasopressor", "fluid", "bolus"] },
    { id: "seizure", label: "Status Epilepticus", keywords: ["seizure", "epilepsy", "convulsion", "phenytoin", "diazepam", "midazolam", "levetiracetam"] },
    { id: "asthma", label: "Status Asthmaticus", keywords: ["asthma", "wheeze", "bronchospasm", "salbutamol", "ventolin", "magnesium", "respiratory"] },
    { id: "tbi", label: "TBI", keywords: ["trauma", "brain", "injury", "head", "concussion", "intracranial", "cushing"] },
    { id: "dka", label: "DKA", keywords: ["diabetic", "ketoacidosis", "diabetes", "insulin", "glucose", "acidosis"] },
    { id: "adrenal", label: "Adrenal Crisis", keywords: ["adrenal", "insufficiency", "cortisol", "hydrocortisone", "addison"] },
    { id: "anaphylaxis", label: "Anaphylaxis", keywords: ["anaphylaxis", "allergic", "allergy", "epinephrine", "adrenaline", "urticaria", "hives", "angioedema"] },
    { id: "thrombocytopenia", label: "Thrombocytopenia", keywords: ["platelet", "thrombocytopenia", "itp", "bleeding", "purpura", "petechiae", "low platelet"] },
    { id: "hypocalcemia", label: "Hypocalcemia", keywords: ["calcium", "hypocalcemia", "rickets", "vitamin d", "pth", "parathyroid", "phosphate", "calcitriol", "tetany", "chvostek", "trousseau"] },
    { id: "dloc", label: "Decreased LOC", keywords: ["consciousness", "dloc", "coma", "gcs", "lethargy", "stupor", "obtundation", "unresponsive", "altered mental"] },
    { id: "headache", label: "Headache", keywords: ["headache", "migraine", "tension", "iih", "papilledema", "intracranial hypertension", "photophobia"] },
    { id: "weakness", label: "Acute Weakness", keywords: ["weakness", "paralysis", "stroke", "gbs", "guillain", "transverse myelitis", "myasthenia"] },
    { id: "gait", label: "Abnormal Gait", keywords: ["gait", "ataxia", "limping", "walking", "coordination", "waddling", "hemiplegic", "neuropathic"] },
    { id: "hyperkalemia", label: "Hyperkalemia", keywords: ["potassium", "hyperkalemia", "ecg", "calcium gluconate", "insulin", "kayexalate", "dialysis", "arrhythmia"] },
    { id: "ugib", label: "Upper GI Bleed", keywords: ["gi bleed", "hematemesis", "melena", "ugib", "varices", "mallory weiss", "ppi", "octreotide", "gastrointestinal"] },
  ];

  // Filter tabs based on search query
  const filteredTabs = searchQuery.trim() === "" 
    ? approachTabs 
    : approachTabs.filter(tab => 
        tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tab.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-select first matching tab when search changes
  useEffect(() => {
    if (filteredTabs.length > 0 && !filteredTabs.find(t => t.id === activeTab)) {
      setActiveTab(filteredTabs[0].id);
    }
  }, [searchQuery, filteredTabs, activeTab]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Collapsible Section Component
  const Section = ({ id, title, children, defaultOpen = false }) => {
    const isOpen = expandedSections[id] ?? defaultOpen;
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium text-sm text-left">{title}</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {isOpen && <div className="p-4 space-y-3 text-sm">{children}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-4 pt-4 pb-32">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search approaches (e.g., sepsis, seizure, platelet...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 nightingale-input"
          data-testid="approaches-search"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {/* Patient Info Input */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
              <Input
                type="number"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="font-mono mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Age (years)</Label>
              <Input
                type="number"
                placeholder="years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="font-mono mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation - Scrollable */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-max min-w-full h-auto p-1">
            {filteredTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs py-2 px-3 whitespace-nowrap">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {filteredTabs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No approaches found for "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")} className="text-[#00d9c5] mt-2 hover:underline">Clear search</button>
          </div>
        )}

        {/* SEPTIC SHOCK TAB */}
        <TabsContent value="sepsis" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Septic Shock in Children</CardTitle>
              <CardDescription className="text-xs">Time-based resuscitation protocol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Recognition */}
              <Section id="sepsis-recognition" title="Recognition (0-5 min)" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="font-semibold text-blue-700 dark:text-blue-300 text-xs mb-1">Cold Shock</p>
                    <p className="text-xs text-muted-foreground">Cold extremities, prolonged cap refill</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="font-semibold text-red-700 dark:text-red-300 text-xs mb-1">Warm Shock</p>
                    <p className="text-xs text-muted-foreground">Warm extremities, brisk cap refill</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>• Decreased LOC • Persistent tachycardia • Decreased urine output</p>
                  <p>• Hypotension (late sign)</p>
                </div>
              </Section>

              {/* Initial Steps */}
              <Section id="sepsis-initial" title="Initial Management (5-15 min)">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">1. Airway & Breathing</p>
                    <p className="text-muted-foreground">100% O₂ via non-rebreather mask</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">2. IV Access</p>
                    <p className="text-muted-foreground">2 peripheral IVs. IO if IV not achieved in 5 min</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">3. Fluid Bolus</p>
                    <p className="text-muted-foreground">20 mL/kg 0.9% NS. Push, up to 60 mL/kg</p>
                    {w > 0 && <p className="font-mono text-blue-600 mt-1">→ {(w * 20).toFixed(0)} mL bolus</p>}
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-medium text-red-700">4. Antibiotics</p>
                    <p className="text-muted-foreground">Give 1st dose within 1 hour. DO NOT delay for cultures</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">5. Correct</p>
                    <p className="text-muted-foreground">Hypoglycemia & Hypocalcemia</p>
                  </div>
                </div>
              </Section>

              {/* Vasopressors */}
              <Section id="sepsis-vasopressors" title="Vasopressors (15-60 min)">
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">If shock not reversed after fluid resuscitation:</p>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium">Cold Shock → Epinephrine</p>
                    <p className="text-muted-foreground">0.05-0.3 mcg/kg/min</p>
                    {w > 0 && <p className="font-mono text-blue-600">→ {(w * 0.1).toFixed(2)} mcg/min (starting)</p>}
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-medium">Warm Shock → Norepinephrine</p>
                    <p className="text-muted-foreground">0.05-0.3 mcg/kg/min (via central line)</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Alternative: Dopamine</p>
                    <p className="text-muted-foreground">Up to 10 mcg/kg/min (peripheral IV/IO acceptable)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 10).toFixed(0)} mcg/min (max)</p>}
                  </div>
                </div>
              </Section>

              {/* Goals */}
              <Section id="sepsis-goals" title="Therapeutic Endpoints">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Cap refill ≤2 seconds, warm extremities</li>
                  <li>• Normal BP for age</li>
                  <li>• Normal pulses (no central-peripheral difference)</li>
                  <li>• Urine output ≥1 mL/kg/hr</li>
                  <li>• Normal mental status</li>
                  <li>• ScvO₂ ≥70%</li>
                </ul>
              </Section>

              {/* Additional Considerations */}
              <Section id="sepsis-additional" title="Additional Considerations">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-medium">Hydrocortisone (if adrenal insufficiency risk)</p>
                    <p className="text-muted-foreground">2 mg/kg load, then 1 mg/kg q6h</p>
                    {w > 0 && <p className="font-mono text-amber-600">→ Load: {(w * 2).toFixed(0)} mg, then {w.toFixed(0)} mg q6h</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Intubation (if needed)</p>
                    <p className="text-muted-foreground">Ketamine 1-2 mg/kg ± Atropine 0.02 mg/kg</p>
                  </div>
                  <p className="text-muted-foreground">• Keep Hgb &gt;10 g/dL • Monitor lactate • Early source control</p>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STATUS EPILEPTICUS TAB */}
        <TabsContent value="seizure" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Status Epilepticus</CardTitle>
              <CardDescription className="text-xs">Start treatment after 5 minutes of seizure activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Stabilization */}
              <Section id="se-initial" title="Initial Stabilization (0-5 min)" defaultOpen={true}>
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">• Maintain A, B, C + Neurologic exam</p>
                  <p className="text-muted-foreground">• Give oxygen, connect monitors</p>
                  <p className="text-muted-foreground">• Establish IV access</p>
                  <p className="text-muted-foreground">• Check bedside glucose</p>
                  <p className="text-muted-foreground">• Correct hypoglycemia, hyponatremia, hypocalcemia</p>
                </div>
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-medium text-xs">Labs: Glucose, Na, iCa, Mg, CBC, LFTs</p>
                </div>
              </Section>

              {/* Phase 1: Benzodiazepines */}
              <Section id="se-phase1" title="Phase 1: Benzodiazepines (5-20 min)">
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold">If IV/IO available:</p>
                    <div className="mt-1 space-y-1 text-muted-foreground">
                      <p>• <span className="font-medium">Lorazepam:</span> 0.1 mg/kg (max 4 mg)</p>
                      {w > 0 && <p className="font-mono text-blue-600 pl-2">→ {Math.min(w * 0.1, 4).toFixed(1)} mg</p>}
                      <p>• OR <span className="font-medium">Midazolam IV:</span> 0.1-0.2 mg/kg (max 10 mg)</p>
                      {w > 0 && <p className="font-mono text-blue-600 pl-2">→ {(w * 0.15).toFixed(1)} mg</p>}
                      <p className="text-xs italic mt-1">Can repeat once</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">If NO IV/IO:</p>
                    <div className="mt-1 space-y-1 text-muted-foreground">
                      <p>• <span className="font-medium">Midazolam IM:</span> 0.2 mg/kg (one dose)</p>
                      {w > 0 && <p className="font-mono text-gray-600 pl-2">→ {(w * 0.2).toFixed(1)} mg IM</p>}
                      <p>• OR <span className="font-medium">Diazepam PR:</span> 0.2-0.5 mg/kg (max 20 mg)</p>
                      {w > 0 && <p className="font-mono text-gray-600 pl-2">→ {(w * 0.3).toFixed(1)} mg PR</p>}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Phase 2: Antiepileptics */}
              <Section id="se-phase2" title="Phase 2: Antiepileptics (20-40 min)">
                <p className="text-xs text-muted-foreground mb-2">Choose ONE of the following:</p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Fosphenytoin/Phenytoin</p>
                    <p className="text-muted-foreground">20 mg PE/kg over 5-10 min (fosphenytoin) or 30 min (phenytoin)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 20).toFixed(0)} mg</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Levetiracetam (Keppra)</p>
                    <p className="text-muted-foreground">20-60 mg/kg (max 2500 mg)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {Math.min(w * 40, 2500).toFixed(0)} mg</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Valproic Acid</p>
                    <p className="text-muted-foreground">40 mg/kg (max 3000 mg)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {Math.min(w * 40, 3000).toFixed(0)} mg</p>}
                  </div>
                </div>
              </Section>

              {/* Phase 3 */}
              <Section id="se-phase3" title="Phase 3 (40-60 min)">
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">Call PICU and Neurology</p>
                  <p className="text-muted-foreground">Use alternative from Phase 2, or:</p>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-medium">Phenobarbital</p>
                    <p className="text-muted-foreground">20 mg/kg single dose</p>
                    {w > 0 && <p className="font-mono text-purple-600">→ {(w * 20).toFixed(0)} mg</p>}
                  </div>
                </div>
              </Section>

              {/* Refractory */}
              <Section id="se-refractory" title="Refractory Status Epilepticus (>60 min)">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
                  <p className="font-semibold text-red-700">Request continuous EEG monitoring</p>
                  <p className="font-semibold text-red-700 mt-1">Be ready for intubation</p>
                  <div className="mt-2 space-y-1 text-muted-foreground">
                    <p className="font-medium">Midazolam Infusion:</p>
                    <p>• Bolus 0.2 mg/kg, then infusion 1 mcg/kg/min</p>
                    <p>• Increase by 2 mcg/kg/min q10-15 min PRN (max 24 mcg/kg/min)</p>
                    <p className="mt-2 font-medium">If seizure persists: Barbiturate coma</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STATUS ASTHMATICUS TAB */}
        <TabsContent value="asthma" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Status Asthmaticus</CardTitle>
              <CardDescription className="text-xs">Asthma failing initial nebulized treatment & steroids</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* High Risk Groups */}
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
                <p className="font-semibold text-amber-700 dark:text-amber-300">High Risk Groups</p>
                <ul className="mt-1 text-muted-foreground space-y-0.5">
                  <li>• Previous PICU admission (with or without intubation)</li>
                  <li>• On ≥3 classes of asthma medications</li>
                  <li>• Repeated ER/hospitalization</li>
                  <li>• Poor compliance</li>
                </ul>
              </div>

              {/* Initial Management */}
              <Section id="asthma-initial" title="Initial Management" defaultOpen={true}>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Oxygen</p>
                    <p className="text-muted-foreground">Maintain O₂ Sat &gt;90%. Keep NPO</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium">Nebulized Albuterol (Salbutamol)</p>
                    <p className="text-muted-foreground">0.15-0.3 mg/kg × 3 doses back-to-back (15-20 min each)</p>
                    {w > 0 && (
                      <p className="font-mono text-blue-600">→ {Math.max(2.5, Math.min(w * 0.2, 10)).toFixed(1)} mg/dose ({w < 20 ? "2.5 mg" : "5 mg"} simplified)</p>
                    )}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Ipratropium Bromide (Atrovent)</p>
                    <p className="text-muted-foreground">0.5 mg mixed with albuterol</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-medium">Methylprednisolone IV</p>
                    <p className="text-muted-foreground">2 mg/kg load, then 2 mg/kg/day ÷ q6h (max 60 mg/day)</p>
                    {w > 0 && <p className="font-mono text-green-600">→ Load: {(w * 2).toFixed(0)} mg, then {Math.min((w * 2 / 4), 15).toFixed(0)} mg q6h</p>}
                  </div>
                </div>
              </Section>

              {/* If Failing Initial Treatment */}
              <Section id="asthma-escalation" title="If Failing Initial Treatment">
                <div className="space-y-2 text-xs">
                  <p className="text-red-600 font-medium">Notify PICU</p>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium">Continuous Nebulized Albuterol</p>
                    <p className="text-muted-foreground">0.5 mg/kg/hr via infusion pump</p>
                    {w > 0 && <p className="font-mono text-blue-600">→ {(w * 0.5).toFixed(1)} mg/hr</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Ipratropium</p>
                    <p className="text-muted-foreground">0.5 mg q4-6h for 24 hours</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Increase Methylprednisolone</p>
                    <p className="text-muted-foreground">4 mg/kg/day ÷ q6h</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-medium">Magnesium Sulfate</p>
                    <p className="text-muted-foreground">25-50 mg/kg IV over 30 min (max 2 g)</p>
                    {w > 0 && <p className="font-mono text-amber-600">→ {Math.min(w * 40, 2000).toFixed(0)} mg</p>}
                    <p className="text-xs text-red-600 mt-1">Monitor for hypotension, apnea</p>
                  </div>
                </div>
              </Section>

              {/* IV Beta Agonist */}
              <Section id="asthma-iv" title="IV Beta Agonist Infusions">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Terbutaline</p>
                    <p className="text-muted-foreground">Load: 10 mcg/kg over 10 min</p>
                    <p className="text-muted-foreground">Infusion: 0.2 mcg/kg/min, ↑ by 0.1-0.2 q30min (max 10 mcg/kg/min)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ Load: {(w * 10).toFixed(0)} mcg, Start: {(w * 0.2).toFixed(1)} mcg/min</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">OR Salbutamol IV</p>
                    <p className="text-muted-foreground">Start 1 mcg/kg/min, ↑ by 1 q15min (max 10 mcg/kg/min)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ Start: {w.toFixed(0)} mcg/min</p>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Monitor: HR, BP, Arrhythmias, Potassium</p>
                </div>
              </Section>

              {/* Intubation */}
              <Section id="asthma-intubation" title="Intubation Indications">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Severe hypoxemia</li>
                    <li>• Respiratory arrest</li>
                    <li>• Deteriorating consciousness</li>
                    <li>• Fatigue with rising CO₂</li>
                  </ul>
                  <div className="mt-2 border-t border-red-200 pt-2">
                    <p className="font-medium text-red-700">RSI Recommendations:</p>
                    <p className="text-muted-foreground">Ketamine as induction + Rocuronium</p>
                    <p className="text-muted-foreground text-xs">(Avoid morphine, atracurium)</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TBI TAB */}
        <TabsContent value="tbi" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Severe Traumatic Brain Injury</CardTitle>
              <CardDescription className="text-xs">GCS ≤8 Management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Stabilization */}
              <Section id="tbi-initial" title="Initial Stabilization" defaultOpen={true}>
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">• Maintain ABC + C-spine precautions</p>
                  <p className="text-muted-foreground">• Continuous cardiopulmonary monitoring</p>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-2">
                    <p className="font-medium">Airway (Jaw thrust, no head tilt)</p>
                    <p className="text-muted-foreground">RSI: Fentanyl + Rocuronium OR Etomidate + Rocuronium</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Oxygenation Targets</p>
                    <p className="text-muted-foreground">SpO₂ 92-98%, PaCO₂ 35-40 mmHg</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Circulation</p>
                    <p className="text-muted-foreground">20 mL/kg NS bolus if hypotensive, repeat ×3</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 20).toFixed(0)} mL bolus</p>}
                  </div>
                  <p className="text-muted-foreground mt-2">• Elevate HOB 30°, midline neutral position</p>
                </div>
              </Section>

              {/* Brain Protective Therapies */}
              <Section id="tbi-protective" title="Standard Brain Protective Therapies">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>□ Control ventilation (PaCO₂ 35-40)</li>
                  <li>□ Avoid hypotension</li>
                  <li>□ IVF: 0.9% NS at maintenance</li>
                  <li>□ Maintain Na &gt;140</li>
                  <li>□ Sedation: Fentanyl + Midazolam infusion</li>
                  <li>□ Maintain normothermia (&lt;37.5°C)</li>
                  <li>□ Seizure prophylaxis (Phenytoin)</li>
                  <li>□ Stress ulcer prophylaxis</li>
                  <li>□ Glucose 80-180 mg/dL</li>
                </ul>
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                  <p className="font-semibold text-red-700">DO NOT ALLOW:</p>
                  <p className="text-muted-foreground">Hypoxemia • Hypotension • Hyperthermia • Hyponatremia</p>
                </div>
              </Section>

              {/* High ICP Management */}
              <Section id="tbi-icp" title="High ICP Management">
                <div className="text-xs">
                  <p className="text-muted-foreground mb-2">If ICP &gt;20 mmHg for &gt;5 min or clinical signs:</p>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">1. Drain CSF from EVD (if present)</p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">2. Bolus sedation/analgesia/paralysis</p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">3. Temporary hyperventilation</p>
                      <p className="text-muted-foreground">PaCO₂ 30-35 mmHg</p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="font-medium">4. Hyperosmolar Therapy</p>
                      <p className="text-muted-foreground">3% NaCl: 5-10 mL/kg over 5-10 min q2-6h</p>
                      {w > 0 && <p className="font-mono text-blue-600">→ {(w * 5).toFixed(0)}-{(w * 10).toFixed(0)} mL</p>}
                      <p className="text-muted-foreground mt-1">OR Mannitol: 0.5-1 g/kg over 20 min</p>
                      {w > 0 && <p className="font-mono text-blue-600">→ {(w * 0.5).toFixed(1)}-{w.toFixed(0)} g</p>}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Clinical Signs of High ICP */}
              <Section id="tbi-signs" title="Clinical Signs of High ICP">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• ↓GCS &gt;2 from baseline</li>
                  <li>• New loss of pupil reactivity</li>
                  <li>• Pupil asymmetry</li>
                  <li>• New focal motor deficit</li>
                  <li>• Cushing's triad: HTN, Bradycardia, Abnormal breathing</li>
                </ul>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DKA TAB */}
        <TabsContent value="dka" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Diabetic Ketoacidosis (DKA)</CardTitle>
              <CardDescription className="text-xs">Saudi MOH Guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Recognition */}
              <Section id="dka-recognition" title="Recognition & Diagnosis" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-medium mb-1">History</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Polyuria, polydipsia</li>
                      <li>• Weight loss</li>
                      <li>• Abdominal pain, vomiting</li>
                      <li>• Lethargy</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Clinical Findings</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Kussmaul breathing</li>
                      <li>• Dehydration</li>
                      <li>• Fruity breath</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="font-medium text-xs">Confirm DKA:</p>
                  <p className="text-xs text-muted-foreground">• Ketonuria + Glucose &gt;200 mg/dL + pH &lt;7.30 and/or HCO₃ &lt;15</p>
                </div>
              </Section>

              {/* First Hour */}
              <Section id="dka-first-hour" title="1st Hour Management">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-medium text-red-700">If in Shock:</p>
                    <p className="text-muted-foreground">10 mL/kg 0.9% NS bolus over 5-10 min, repeat PRN</p>
                    {w > 0 && <p className="font-mono text-red-600">→ {(w * 10).toFixed(0)} mL bolus</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">If NOT in Shock:</p>
                    <p className="text-muted-foreground">&lt;20 kg: 7 mL/kg over 1 hour</p>
                    <p className="text-muted-foreground">&gt;20 kg: 5 mL/kg over 1 hour</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w < 20 ? w * 7 : w * 5).toFixed(0)} mL over 1 hr</p>}
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                    <p className="font-semibold text-red-700 text-xs">DO NOT:</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Give insulin bolus</li>
                      <li>• Give NaHCO₃ (unless life-threatening)</li>
                      <li>• Give unnecessary fluid boluses</li>
                      <li>• Use hypotonic fluids</li>
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Post 1st Hour - Fluids */}
              <Section id="dka-fluids" title="Fluid Management (Post 1st Hour)">
                <div className="text-xs">
                  <p className="font-medium mb-2">Total Fluid Intake (TFI) by weight:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1 pr-4">Weight</th>
                          <th className="text-left py-1">TFI (mL/kg/hr)</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr><td className="py-1 pr-4">≤15 kg</td><td>5</td></tr>
                        <tr><td className="py-1 pr-4">15-35 kg</td><td>4</td></tr>
                        <tr><td className="py-1 pr-4">35-50 kg</td><td>3</td></tr>
                        <tr><td className="py-1 pr-4">&gt;50 kg</td><td>2</td></tr>
                      </tbody>
                    </table>
                  </div>
                  {w > 0 && (
                    <p className="font-mono text-blue-600 mt-2">
                      → {(w * (w <= 15 ? 5 : w <= 35 ? 4 : w <= 50 ? 3 : 2)).toFixed(0)} mL/hr
                    </p>
                  )}
                </div>
              </Section>

              {/* Insulin */}
              <Section id="dka-insulin" title="Insulin">
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">Mix 50 units Regular in 50 mL NS (1 unit/mL)</p>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Standard dose: 0.1 U/kg/hr</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 0.1).toFixed(1)} units/hr ({(w * 0.1).toFixed(1)} mL/hr)</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Low dose: 0.05 U/kg/hr</p>
                    <p className="text-muted-foreground">For: newly diagnosed, ≤5 years, or recently received insulin</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 0.05).toFixed(2)} units/hr</p>}
                  </div>
                </div>
              </Section>

              {/* Potassium */}
              <Section id="dka-potassium" title="Potassium">
                <div className="text-xs text-muted-foreground">
                  <p>• Add KCl 40 mEq/L once voiding (unless K &gt;5.5)</p>
                  <p>• If K &lt;3.5: increase to 60 mEq/L</p>
                </div>
              </Section>

              {/* Dextrose */}
              <Section id="dka-dextrose" title="Dextrose">
                <div className="text-xs text-muted-foreground">
                  <p>• Add D5 if glucose &lt;250 mg/dL or rapid drop &gt;100 mg/dL/hr</p>
                  <p>• Add D10 if glucose &lt;180 mg/dL</p>
                </div>
              </Section>

              {/* Cerebral Edema */}
              <Section id="dka-cerebral" title="Cerebral Edema">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
                  <p className="font-semibold text-red-700 mb-1">Warning Signs:</p>
                  <p className="text-muted-foreground">Headache, irritability, ↓LOC, vomiting, bradycardia, HTN</p>
                  <div className="mt-2 border-t border-red-200 pt-2">
                    <p className="font-medium">Treatment:</p>
                    <p className="text-muted-foreground">• Elevate HOB, secure airway</p>
                    <p className="text-muted-foreground">• Mannitol 0.5-1 g/kg OR 3% NaCl 5-10 mL/kg</p>
                    {w > 0 && <p className="font-mono text-red-600">→ Mannitol: {(w * 0.5).toFixed(1)}-{w.toFixed(0)} g</p>}
                    <p className="text-muted-foreground">• Neurosurgery consult, Head CT</p>
                  </div>
                </div>
              </Section>

              {/* Resolution */}
              <Section id="dka-resolution" title="DKA Resolution">
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium">DKA resolves when:</p>
                  <p>pH &gt;7.30, HCO₃ &gt;15, normal anion gap</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">After resolution:</p>
                    <p>• Start oral fluids (controlled)</p>
                    <p>• Give SC insulin, stop IV 30 min after</p>
                    <p>• Start diabetic diet</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADRENAL CRISIS TAB */}
        <TabsContent value="adrenal" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Adrenal Crisis</CardTitle>
              <CardDescription className="text-xs">Recognition and emergency management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Causes */}
              <Section id="adrenal-causes" title="Causes" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Primary</p>
                    <p className="text-muted-foreground">Salt wasting (↓Na, ↑K), hyperpigmentation</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Secondary/Tertiary</p>
                    <p className="text-muted-foreground">Pituitary/hypothalamic, prolonged steroid use</p>
                  </div>
                </div>
              </Section>

              {/* When to Suspect */}
              <Section id="adrenal-suspect" title="When to Suspect">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Volume depletion, hypotension</li>
                  <li>• Hyponatremia, hyperkalemia</li>
                  <li>• Hyperpigmentation</li>
                  <li>• Abdominal pain, fever</li>
                  <li>• Precocious puberty</li>
                </ul>
              </Section>

              {/* Confirmation */}
              <Section id="adrenal-confirm" title="Confirmation (if stable)">
                <div className="text-xs text-muted-foreground">
                  <p>1. Check baseline cortisol</p>
                  <p>2. Give Cosyntropin (ACTH) 1 mcg IV</p>
                  <p>3. Repeat cortisol at 30 min</p>
                  <p className="mt-1 font-medium">Adrenal insufficiency: Cortisol &lt;9 mcg/dL</p>
                </div>
              </Section>

              {/* Management */}
              <Section id="adrenal-management" title="Emergency Management">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium">Fluid Resuscitation</p>
                    <p className="text-muted-foreground">D5 NS 20 mL/kg bolus, up to 60 mL/kg</p>
                    {w > 0 && <p className="font-mono text-blue-600">→ {(w * 20).toFixed(0)} mL bolus</p>}
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-medium">Hydrocortisone</p>
                    <p className="text-muted-foreground">50 mg/m² bolus, then 50 mg/m² ÷ q6h for 24h</p>
                    <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded">
                      <p className="font-medium text-xs">Approximate Doses:</p>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground mt-1">
                        <span>Infant: 10 mg</span>
                        <span>Toddler: 25 mg</span>
                        <span>Older child: 50 mg</span>
                        <span>Adolescent: 100 mg</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Treat Electrolyte Imbalances</p>
                    <p className="text-muted-foreground">Hyperkalemia, hyponatremia per protocols</p>
                  </div>
                </div>
              </Section>

              {/* Important Notes */}
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
                <p className="font-semibold text-amber-700 dark:text-amber-300">Important Notes</p>
                <ul className="mt-1 text-muted-foreground space-y-0.5">
                  <li>• Never delay treatment waiting for results</li>
                  <li>• Consult pediatric endocrinologist</li>
                  <li>• If not improving, consider other diagnoses</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANAPHYLAXIS VS ALLERGIC REACTION TAB */}
        <TabsContent value="anaphylaxis" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Anaphylaxis vs Allergic Reaction</CardTitle>
              <CardDescription className="text-xs">Decision flowchart for diagnosis and treatment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Presentation */}
              <Section id="anaph-presentation" title="Initial Presentation" defaultOpen={true}>
                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <p className="font-semibold text-orange-700 dark:text-orange-300 text-sm">Urticarial rash involves skin or mucosal tissue:</p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• Generalized hives, pruritus or flushing</li>
                    <li>• Swollen lips, tongue or uvula</li>
                    <li>• Or both</li>
                  </ul>
                </div>
              </Section>

              {/* Decision Point */}
              <Section id="anaph-decision" title="Key Decision Point" defaultOpen={true}>
                <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                  <p className="font-semibold text-teal-700 dark:text-teal-300 text-sm mb-2">At least one of the following involved:</p>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">●</span>
                      <span><strong>Airway compromise</strong> (stridor, hoarseness, difficulty breathing)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">●</span>
                      <span><strong>Reduced BP</strong> or associated symptoms of end-organ dysfunction (dizziness, syncope)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">●</span>
                      <span><strong>GI symptoms</strong> (Abdominal pain, Vomiting)</span>
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200">
                    <p className="font-bold text-red-700 dark:text-red-300 text-center">YES</p>
                    <p className="text-center text-sm font-semibold mt-1">Anaphylactic Reaction</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-200">
                    <p className="font-bold text-green-700 dark:text-green-300 text-center">NO</p>
                    <p className="text-center text-sm font-semibold mt-1">Allergic Reaction</p>
                  </div>
                </div>
              </Section>

              {/* Anaphylaxis Treatment */}
              <Section id="anaph-treatment" title="Anaphylaxis Treatment">
                <div className="space-y-3">
                  {/* Primary Treatment */}
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                    <p className="font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                      <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                      Epinephrine (First-line)
                    </p>
                    <div className="mt-2 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white dark:bg-gray-900 rounded">
                          <p className="text-muted-foreground">Dose</p>
                          <p className="font-mono font-semibold">0.01 mg/kg IM</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-900 rounded">
                          <p className="text-muted-foreground">Concentration</p>
                          <p className="font-mono font-semibold">1:1000 (1mg/ml)</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white dark:bg-gray-900 rounded">
                          <p className="text-muted-foreground">Prepubertal Max</p>
                          <p className="font-mono font-semibold text-blue-600">0.3 mg</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-900 rounded">
                          <p className="text-muted-foreground">Adolescent Max</p>
                          <p className="font-mono font-semibold text-blue-600">0.5 mg</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">Repeat Q5-15 min PRN</p>
                      {w > 0 && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200">
                          <p className="font-mono text-blue-600 font-semibold">
                            For {w}kg: {Math.min(w * 0.01, 0.5).toFixed(2)} mg IM
                          </p>
                        </div>
                      )}
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                        <p className="text-amber-700 dark:text-amber-300 font-medium">Note for CPR:</p>
                        <p className="text-muted-foreground">1:10,000 (0.1mg/ml) used IV in CPR</p>
                      </div>
                    </div>
                  </div>

                  {/* Adjunct Treatment */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
                    <p className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                      Adjunct Treatments
                    </p>
                    <div className="mt-2 space-y-2 text-xs">
                      {/* Hydrocortisone */}
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium">Glucocorticoid (Hydrocortisone)</p>
                        <p className="text-muted-foreground">2-5 mg/kg IV/IM (Max 100 mg)</p>
                        <p className="text-muted-foreground">Then 1-5 mg/kg/dose Q6h or 10-15 mg/m²/day divided</p>
                        {w > 0 && (
                          <p className="font-mono text-blue-600 mt-1">
                            For {w}kg: {Math.min(w * 2, 100).toFixed(0)}-{Math.min(w * 5, 100).toFixed(0)} mg IV/IM
                          </p>
                        )}
                      </div>
                      {/* Diphenhydramine */}
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium">Diphenhydramine</p>
                        <p className="text-muted-foreground">1-2 mg/kg/dose Q6h (Max 50mg/dose, 300mg/24hr)</p>
                        <p className="text-muted-foreground">Route: IV/IM/PO</p>
                        {w > 0 && (
                          <p className="font-mono text-blue-600 mt-1">
                            For {w}kg: {Math.min(w * 1, 50).toFixed(0)}-{Math.min(w * 2, 50).toFixed(0)} mg Q6h
                          </p>
                        )}
                        <p className="text-red-600 text-[10px] mt-1">CI: MAO inhibitors, BA, GI/Urinary obstruction, Neonate</p>
                      </div>
                      {/* Ventolin */}
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium">Ventolin (for bronchospasm)</p>
                        <p className="text-muted-foreground">Nebulized salbutamol for wheezing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Allergic Reaction Treatment */}
              <Section id="anaph-allergic" title="Allergic Reaction Treatment (No systemic signs)">
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-700 dark:text-green-300">Treatment:</p>
                  <p className="text-sm mt-1">Antihistamine alone</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Examples: Cetirizine, Diphenhydramine, Loratadine
                  </p>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* THROMBOCYTOPENIA TAB */}
        <TabsContent value="thrombocytopenia" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Approach to Thrombocytopenia</CardTitle>
              <CardDescription className="text-xs">Diagnostic flowchart based on patient status and platelet characteristics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Assessment */}
              <Section id="thrombo-assess" title="Initial Assessment" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-200">
                    <p className="font-bold text-green-700 dark:text-green-300 text-center">WELL</p>
                    <p className="text-xs text-center text-muted-foreground mt-1">Clinically stable</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200">
                    <p className="font-bold text-red-700 dark:text-red-300 text-center">ILL</p>
                    <p className="text-xs text-center text-muted-foreground mt-1">Clinically unwell</p>
                  </div>
                </div>
              </Section>

              {/* Well Patient */}
              <Section id="thrombo-well" title="WELL Patient Pathway">
                <div className="space-y-3">
                  {/* Large PLT */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Large Platelets + Normal Hb & WBC</p>
                    <p className="text-xs text-muted-foreground mb-2">→ Suggests Consumption</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-purple-600">Immune</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• ITP</li>
                          <li>• 2° to SLE, HIV</li>
                          <li>• Drug induced</li>
                        </ul>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-orange-600">Non-immune</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• Maternal ITP</li>
                          <li>• NAIT</li>
                          <li>• Type 2B/Platelet VWD</li>
                          <li>• Hereditary Thrombocytopenia</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Small PLT */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Small Platelets + Congenital anomalies / ↑MCV</p>
                    <p className="text-xs text-muted-foreground mb-2">→ Suggests Decreased Synthesis</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-teal-600">Congenital</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• TAR syndrome</li>
                          <li>• Wiskott-Aldrich (WAS)</li>
                          <li>• X-linked Amegakaryocytic</li>
                          <li>• Fanconi Anemia</li>
                        </ul>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-gray-600">Acquired</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• Medication</li>
                          <li>• Toxin</li>
                          <li>• Radiation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Ill Patient */}
              <Section id="thrombo-ill" title="ILL Patient Pathway">
                <div className="space-y-3">
                  {/* Large PLT - Consumption */}
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Large Platelets + ↓Fibrinogen + ↑Fibrin degradation products</p>
                    <p className="text-xs text-muted-foreground mb-2">→ Suggests Consumption (Microangiopathy)</p>
                    <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                      <ul className="text-muted-foreground space-y-1">
                        <li>• <strong>DIC</strong> (Disseminated Intravascular Coagulation)</li>
                        <li>• <strong>HUS</strong> (Hemolytic Uremic Syndrome)</li>
                        <li>• <strong>TTP</strong> (Thrombotic Thrombocytopenic Purpura)</li>
                        <li>• NEC (Necrotizing Enterocolitis)</li>
                        <li>• Respiratory distress</li>
                        <li>• Thrombosis / UAC</li>
                        <li>• Sepsis</li>
                        <li>• Viral infection</li>
                      </ul>
                    </div>
                  </div>

                  {/* Small PLT - Sequestration/Synthesis */}
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Small Platelets</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-purple-600">+ HSM → Sequestration</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• Hemangioma</li>
                          <li>• Hypersplenism</li>
                        </ul>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-gray-600">→ ↓Synthesis</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• Malignancy</li>
                          <li>• Storage disease</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Key Abbreviations */}
              <Section id="thrombo-abbrev" title="Key Abbreviations">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <p><strong>ITP:</strong> Immune Thrombocytopenic Purpura</p>
                    <p><strong>NAIT:</strong> Neonatal Alloimmune Thrombocytopenia</p>
                    <p><strong>TAR:</strong> Thrombocytopenia-Absent Radius</p>
                    <p><strong>WAS:</strong> Wiskott-Aldrich Syndrome</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>DIC:</strong> Disseminated Intravascular Coagulation</p>
                    <p><strong>HUS:</strong> Hemolytic Uremic Syndrome</p>
                    <p><strong>TTP:</strong> Thrombotic Thrombocytopenic Purpura</p>
                    <p><strong>HSM:</strong> Hepatosplenomegaly</p>
                  </div>
                </div>
              </Section>

              {/* Initial Workup */}
              <Section id="thrombo-workup" title="Initial Workup">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Laboratory Studies:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• CBC with peripheral smear (platelet size, morphology)</li>
                      <li>• Reticulocyte count</li>
                      <li>• PT/PTT, Fibrinogen, D-dimer</li>
                      <li>• LDH, Haptoglobin, Bilirubin (hemolysis screen)</li>
                      <li>• Blood type and Coombs test</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium text-blue-700">Consider:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Bone marrow aspiration if decreased synthesis suspected</li>
                      <li>• Genetic testing for congenital syndromes</li>
                      <li>• HIV, Hepatitis B/C if immune causes suspected</li>
                    </ul>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HYPOCALCEMIA & RICKETS TAB */}
        <TabsContent value="hypocalcemia" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Approach to Hypocalcemia & Rickets</CardTitle>
              <CardDescription className="text-xs">Diagnostic flowchart and biochemical findings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Assessment - Low Ca */}
              <Section id="hypoca-initial" title="Diagnostic Approach (Low Calcium)" defaultOpen={true}>
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 mb-3">
                  <p className="font-semibold text-red-700 dark:text-red-300 text-center">Low Ca</p>
                  <p className="text-xs text-center text-muted-foreground mt-1">Starting point for evaluation</p>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="font-medium">Check iPTH (Intact Parathyroid Hormone)</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="font-medium text-blue-700">PTH ↓ or Low</p>
                      <p className="text-muted-foreground mt-1">Check Magnesium</p>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                      <p className="font-medium text-amber-700">PTH ↑ or Normal</p>
                      <p className="text-muted-foreground mt-1">Check Phosphate & 25OHD</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Low PTH Pathway - Magnesium Branch */}
              <Section id="hypoca-mg-branch" title="Low PTH Pathway (Check Mg)">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <p className="font-semibold text-purple-700 dark:text-purple-300">Mg ↓ (Low)</p>
                      <p className="text-xs text-muted-foreground mt-1 font-semibold">→ Hypomagnesemia</p>
                      <p className="text-xs text-muted-foreground mt-1">Can cause functional hypoparathyroidism</p>
                    </div>
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                      <p className="font-semibold text-teal-700 dark:text-teal-300">Mg Normal</p>
                      <p className="text-xs text-muted-foreground mt-1 font-semibold">→ Hypoparathyroidism</p>
                      <p className="text-xs text-muted-foreground mt-1">Primary PTH deficiency</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* High PTH Pathway - Phosphate/Creatinine Branch */}
              <Section id="hypoca-phos-branch" title="High PTH Pathway (Check Phos & Creatinine)">
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <p className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Phosphate ↑ + Creatinine ↑</p>
                    <p className="text-xs text-muted-foreground font-semibold">→ Renal Failure</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <li>• Impaired phosphate excretion</li>
                      <li>• Impaired 1,25(OH)₂D synthesis</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-semibold mb-2">Phosphate ↑ + Creatinine Normal</p>
                    <p className="text-xs text-muted-foreground font-semibold">→ Pseudohypoparathyroidism</p>
                    <p className="text-xs text-muted-foreground mt-1">PTH resistance (PTH present but tissues don't respond)</p>
                  </div>
                </div>
              </Section>

              {/* Vitamin D Assessment */}
              <Section id="hypoca-vitd" title="Vitamin D Assessment (25OHD₃)">
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="font-semibold text-red-700 dark:text-red-300 mb-2">25OHD₃ ↓ (Low)</p>
                    <p className="text-xs text-muted-foreground mb-2">Causes of Vitamin D Deficiency:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium">Dietary deficiency</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium">Malabsorption</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium">Anticonvulsants</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium">Lack of sun exposure</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="font-semibold text-green-700 dark:text-green-300 mb-2">25OHD₃ Normal → Check 1,25(OH)₂D₃</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium text-blue-600">1,25(OH)₂D₃ ↓</p>
                        <p className="text-muted-foreground mt-1">Vit-D Dependency (Type 1)</p>
                        <p className="text-[10px] text-muted-foreground">1α-hydroxylase deficiency</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium text-purple-600">1,25(OH)₂D₃ ↑↑</p>
                        <p className="text-muted-foreground mt-1">Vit-D Resistance (Type 2)</p>
                        <p className="text-[10px] text-muted-foreground">Receptor resistance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Vitamin D Activation Pathway */}
              <Section id="hypoca-vitd-pathway" title="Vitamin D Activation Pathway">
                <div className="space-y-2">
                  {/* Sources */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-center">
                      <p className="font-medium text-green-700">Vit D2 & D3 from Diet</p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-center">
                      <p className="font-medium text-green-700">UVB → D3 in skin</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-blue-500">↓</span>
                  </div>
                  {/* Liver */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="font-semibold text-blue-700 dark:text-blue-300">Liver</p>
                    <p className="text-xs text-muted-foreground">Activates to Calcidiol (25-OH Vit D)</p>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-blue-500">↓</span>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-[10px] text-orange-600">
                      Deficiency → Vit D Dependent Rickets Type 1
                    </div>
                  </div>
                  {/* Kidney */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="font-semibold text-blue-700 dark:text-blue-300">Kidney (1α-Hydroxylase)</p>
                    <p className="text-xs text-muted-foreground">Activates to Calcitriol (1,25-dihydroxy Vit D)</p>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-blue-500">↓</span>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-[10px] text-orange-600">
                      Receptor resistance → Vit D Dependent Rickets Type 2
                    </div>
                  </div>
                  {/* Target */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="font-semibold text-blue-700 dark:text-blue-300">Action on Peripheral Tissues</p>
                    <p className="text-xs text-muted-foreground">Bone mineralization, Ca/Phos absorption</p>
                  </div>
                </div>
              </Section>

              {/* Suspected Rickets Flowchart */}
              <Section id="hypoca-rickets-dx" title="Diagnostic Approach in Suspected Rickets">
                <div className="space-y-3">
                  {/* Suspicion */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
                    <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm">Suspected Rickets:</p>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• <span className="text-red-600 font-medium">Elevated alkaline phosphatase activity</span></li>
                      <li>• <span className="text-red-600 font-medium">Clinical or radiographic findings</span></li>
                    </ul>
                  </div>
                  {/* Measure */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="font-medium text-blue-700">Measure serum</p>
                    <p className="text-sm font-semibold text-red-600 mt-1">PTH, Pi (Phosphate), and Ca</p>
                  </div>
                  {/* Classification */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <p className="font-semibold text-purple-700 dark:text-purple-300">Calcipenic (Hypocalcemic) Rickets*</p>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-center">
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p className="text-red-600 font-bold">PTH ↑</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Pi N or ↓</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Ca N or ↓</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                      <p className="font-semibold text-teal-700 dark:text-teal-300">Phosphopenic (Hypophosphatemic) Rickets¶</p>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-center">
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>PTH N or slightly ↑</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p className="text-red-600 font-bold">Pi ↓</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Ca Normal</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="font-semibold">Consider other causes:</p>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-center">
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>PTH Normal</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Pi Normal</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Ca Normal</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">→ Early/transient disease, hypophosphatasiaΔ, or primary bone disorder</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Biochemical Findings Table */}
              <Section id="hypoca-biochem" title="Biochemical Findings in Rickets">
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[9px] min-w-[600px]">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-left py-2 px-1 font-semibold">Type</th>
                        <th className="text-center py-2 px-1 font-semibold">Ca</th>
                        <th className="text-center py-2 px-1 font-semibold">Phos</th>
                        <th className="text-center py-2 px-1 font-semibold">ALP</th>
                        <th className="text-center py-2 px-1 font-semibold">PTH</th>
                        <th className="text-center py-2 px-1 font-semibold">25OHD</th>
                        <th className="text-center py-2 px-1 font-semibold">1,25D</th>
                        <th className="text-center py-2 px-1 font-semibold">UCa</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {/* Calcipenic Section */}
                      <tr className="bg-purple-50/50 dark:bg-purple-950/20">
                        <td colSpan={8} className="py-1 px-1 font-semibold text-purple-700 dark:text-purple-300">Calcipenic Rickets</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Vit D-deficient</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                        <td className="py-1 px-1 text-center">↑/↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center text-red-600">↓</td>
                        <td className="py-1 px-1 text-center">↑/N/↓</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Type I (1α-hydroxylase def)*</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                        <td className="py-1 px-1 text-center">↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center text-red-600">↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Type II (Vit D resistance)¶</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                        <td className="py-1 px-1 text-center">↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center text-red-600">↑↑</td>
                        <td className="py-1 px-1 text-center">↓</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">↑ Vit D catabolism</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                      </tr>
                      {/* Phosphopenic Section */}
                      <tr className="bg-teal-50/50 dark:bg-teal-950/20">
                        <td colSpan={8} className="py-1 px-1 font-semibold text-teal-700 dark:text-teal-300">Phosphopenic Rickets (Vit D Resistant)</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">X-linked hypophosphatemia</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center text-red-600">↓↓</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N/↑</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center">N/↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Hereditary + hypercalciuria</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center">↓/↓↓</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N/↓</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center text-red-600">↑</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Nutritional Pi deprivation</td>
                        <td className="py-1 px-1 text-center">↑/N</td>
                        <td className="py-1 px-1 text-center">↓/↓↓</td>
                        <td className="py-1 px-1 text-center">↑/↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">↑/N</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground space-y-1">
                  <p>ALP: Alkaline Phosphatase | UCa: Urine Calcium | N: Normal | ↑: Increased | ↓: Decreased</p>
                  <p>* 1α-hydroxylase def = Vit D-dependent rickets type I (pseudo-Vit D deficiency)</p>
                  <p>¶ Hereditary Vit D resistance = Vit D-dependent rickets type II</p>
                </div>
              </Section>

              {/* Key Differentiating Features */}
              <Section id="hypoca-key" title="Key Differentiating Features">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-xs">
                    <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Calcipenic Rickets</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• PTH usually elevated</li>
                      <li>• Calcium low or normal</li>
                      <li>• Vitamin D pathway issue</li>
                      <li>• May have tetany/seizures</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg text-xs">
                    <p className="font-semibold text-teal-700 dark:text-teal-300 mb-2">Phosphopenic Rickets</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• PTH normal or slightly ↑</li>
                      <li>• Phosphate markedly low</li>
                      <li>• FGF23-mediated disorders</li>
                      <li>• Often genetic cause</li>
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Key Abbreviations */}
              <Section id="hypoca-abbrev" title="Key Abbreviations">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <p><strong>PTH:</strong> Parathyroid Hormone</p>
                    <p><strong>25OHD:</strong> 25-hydroxyvitamin D</p>
                    <p><strong>1,25(OH)₂D:</strong> 1,25-dihydroxyvitamin D (Calcitriol)</p>
                    <p><strong>Ca:</strong> Calcium</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Pi/Phos:</strong> Phosphate</p>
                    <p><strong>ALP:</strong> Alkaline Phosphatase</p>
                    <p><strong>FGF23:</strong> Fibroblast Growth Factor 23</p>
                    <p><strong>TRP:</strong> Tubular Reabsorption of Phosphorus</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DECREASED LEVEL OF CONSCIOUSNESS TAB */}
        <TabsContent value="dloc" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Decreased Level of Consciousness</CardTitle>
              <CardDescription className="text-xs">Systematic approach using Pediatric GCS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Definition */}
              <Section id="dloc-def" title="Definition & Grades" defaultOpen={true}>
                <p className="text-xs text-muted-foreground mb-3">
                  Decreased level of consciousness (DLOC) is a state in which a child exhibits a diminished ability to respond to verbal, physical, or painful stimuli.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                    <p className="font-semibold text-green-700">Lethargy</p>
                    <p className="text-muted-foreground">Drowsy but arousable with light stimulation</p>
                  </div>
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                    <p className="font-semibold text-yellow-700">Obtundation</p>
                    <p className="text-muted-foreground">Slowed responses, needs loud voice/shaking</p>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs">
                    <p className="font-semibold text-orange-700">Stupor</p>
                    <p className="text-muted-foreground">Only responds to painful stimuli</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                    <p className="font-semibold text-red-700">Coma</p>
                    <p className="text-muted-foreground">No meaningful response at all</p>
                  </div>
                </div>
              </Section>

              {/* Pediatric GCS */}
              <Section id="dloc-gcs" title="Pediatric Glasgow Coma Scale">
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[10px] min-w-[400px]">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-left py-2 px-2 font-semibold">Response</th>
                        <th className="text-center py-2 px-2 font-semibold">Score</th>
                        <th className="text-left py-2 px-2 font-semibold">Verbal Child</th>
                        <th className="text-left py-2 px-2 font-semibold">Pre-verbal</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b"><td className="py-1 px-2 font-medium" rowSpan={4}>Eye</td><td className="py-1 px-2 text-center">4</td><td className="py-1 px-2">Spontaneous</td><td className="py-1 px-2">Spontaneous</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">3</td><td className="py-1 px-2">To voice</td><td className="py-1 px-2">To voice</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">2</td><td className="py-1 px-2">To pain</td><td className="py-1 px-2">To pain</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">1</td><td className="py-1 px-2">None</td><td className="py-1 px-2">None</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium" rowSpan={5}>Verbal</td><td className="py-1 px-2 text-center">5</td><td className="py-1 px-2">Oriented</td><td className="py-1 px-2">Coos, babbles</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">4</td><td className="py-1 px-2">Confused</td><td className="py-1 px-2">Irritable cry</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">3</td><td className="py-1 px-2">Inappropriate words</td><td className="py-1 px-2">Cries to pain</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">2</td><td className="py-1 px-2">Incomprehensible</td><td className="py-1 px-2">Moans to pain</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">1</td><td className="py-1 px-2">None</td><td className="py-1 px-2">None</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium" rowSpan={6}>Motor</td><td className="py-1 px-2 text-center">6</td><td className="py-1 px-2">Obeys commands</td><td className="py-1 px-2">Normal movements</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">5</td><td className="py-1 px-2">Localizes pain</td><td className="py-1 px-2">Withdraws to touch</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">4</td><td className="py-1 px-2">Withdraws to pain</td><td className="py-1 px-2">Withdraws to pain</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">3</td><td className="py-1 px-2">Flexion to pain</td><td className="py-1 px-2">Abnormal flexion</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">2</td><td className="py-1 px-2">Extension to pain</td><td className="py-1 px-2">Extension</td></tr>
                      <tr><td className="py-1 px-2 text-center">1</td><td className="py-1 px-2">None</td><td className="py-1 px-2">None</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                  <p className="font-medium text-blue-700">GCS Monitoring Frequency:</p>
                  <p className="text-muted-foreground">• GCS &lt;12 → Assess every 15 minutes</p>
                  <p className="text-muted-foreground">• GCS 12-14 → Assess every 1 hour</p>
                </div>
              </Section>

              {/* Initial Stabilization */}
              <Section id="dloc-stabilize" title="Initial Stabilization">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-semibold text-red-700">Airway</p>
                    <p className="text-muted-foreground">Intubate if: Deteriorating GCS, SpO₂ &lt;92% despite oxygen, CO₂ retention</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">Breathing</p>
                    <p className="text-muted-foreground">100% oxygen if SpO₂ &lt;94%</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">Circulation</p>
                    <p className="text-muted-foreground">Isotonic fluid bolus 20 mL/kg if in shock</p>
                    {w > 0 && <p className="font-mono text-purple-600 mt-1">→ {(w * 20).toFixed(0)} mL bolus</p>}
                  </div>
                </div>
              </Section>

              {/* Core Investigations */}
              <Section id="dloc-investigations" title="Core Investigations">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Capillary blood glucose</p>
                    <p>• Blood gas</p>
                    <p>• Urea & Electrolytes</p>
                    <p>• Serum glucose</p>
                    <p>• Liver function tests</p>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Full blood count</p>
                    <p>• Blood culture + CRP</p>
                    <p>• Ammonia & Lactate</p>
                    <p>• Urine routine + toxicology</p>
                  </div>
                </div>
              </Section>

              {/* Algorithm */}
              <Section id="dloc-algorithm" title="Diagnostic Algorithm">
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="font-semibold text-amber-700 text-sm mb-2">After History, Examination & Core Investigations:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium text-red-600">Possible Neurological OR Unclear Cause</p>
                        <p className="text-muted-foreground mt-1">→ CT Brain</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium text-green-600">Clear Non-neurological Cause</p>
                        <p className="text-muted-foreground mt-1">→ Treat accordingly</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-semibold text-blue-700 text-sm mb-2">CT Brain Results:</p>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-red-600">Abnormal (Hydrocephalus, Edema, Hemorrhage, Mass)</p>
                        <p className="text-muted-foreground">→ Neurosurgery consult</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-gray-600">Normal</p>
                        <p className="text-muted-foreground">→ Consider Lumbar Puncture → Neurology consult</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Neurological Differentials */}
              <Section id="dloc-neuro-ddx" title="Neurological Differentials">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Focal Seizures with Impaired Consciousness</p>
                    <p className="text-muted-foreground">Eyes open/staring, abnormal movements, postictal behavior</p>
                    <p className="text-blue-600 mt-1">→ Follow seizure guidelines, inform Neurology</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">ADEM (Acute Disseminated Encephalomyelitis)</p>
                    <p className="text-muted-foreground">Recent viral illness, rapid decline, multifocal neuro signs</p>
                    <p className="text-blue-600 mt-1">→ Methylprednisolone 30 mg/kg/day (max 1g/day)</p>
                    {w > 0 && <p className="font-mono text-blue-600">→ {Math.min(w * 30, 1000).toFixed(0)} mg/day</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">PRES Syndrome</p>
                    <p className="text-muted-foreground">Chronic illness, HTN, headache, seizures</p>
                    <p className="text-blue-600 mt-1">→ BP management, treat underlying cause</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Increased ICP</p>
                    <p className="text-muted-foreground">Headache, vomiting, papilledema</p>
                    <p className="text-blue-600 mt-1">→ PICU / Neurosurgery</p>
                  </div>
                </div>
              </Section>

              {/* Non-neurological Differentials */}
              <Section id="dloc-nonneuro-ddx" title="Non-Neurological Differentials">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Hypoglycemia</p>
                    <p className="text-muted-foreground">Check glucose immediately</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">CNS Infection</p>
                    <p className="text-muted-foreground">Fever, meningism → LP</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Shock</p>
                    <p className="text-muted-foreground">Hypoperfusion signs</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Electrolyte Imbalance</p>
                    <p className="text-muted-foreground">Na, K, Ca abnormalities</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Metabolic Illness</p>
                    <p className="text-muted-foreground">Known metabolic disease, ↑ammonia</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Medications/Toxins</p>
                    <p className="text-muted-foreground">Drug ingestion history</p>
                  </div>
                </div>
              </Section>

              {/* Drug Antidotes */}
              <Section id="dloc-antidotes" title="Drug Antidotes">
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[10px] min-w-[350px]">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-left py-2 px-2 font-semibold">Drug</th>
                        <th className="text-left py-2 px-2 font-semibold">Signs</th>
                        <th className="text-left py-2 px-2 font-semibold">Antidote</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b"><td className="py-1 px-2">Opioid</td><td className="py-1 px-2">Pinpoint pupils, resp. depression</td><td className="py-1 px-2 text-green-600 font-medium">Naloxone</td></tr>
                      <tr className="border-b"><td className="py-1 px-2">Benzodiazepines</td><td className="py-1 px-2">Dilated pupils, hypotension</td><td className="py-1 px-2 text-green-600 font-medium">Flumazenil</td></tr>
                      <tr className="border-b"><td className="py-1 px-2">Phenobarbitone</td><td className="py-1 px-2">Pinpoint pupils, hypotension</td><td className="py-1 px-2">Supportive care</td></tr>
                      <tr><td className="py-1 px-2">Anti-seizure meds</td><td className="py-1 px-2">↓ LOC</td><td className="py-1 px-2">Supportive (monitor levels)</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-amber-600 mt-2">Note: Phenytoin & Levetiracetam do NOT reduce consciousness</p>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HEADACHE TAB */}
        <TabsContent value="headache" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pediatric Headache</CardTitle>
              <CardDescription className="text-xs">Diagnostic approach based on duration and red flags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Red Flags */}
              <Section id="headache-redflags" title="Red Flags" defaultOpen={true}>
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-700 text-sm mb-2">Urgent Investigation Required:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• <strong>Early morning or night headache</strong></li>
                    <li>• <strong>Progressive headache</strong> in frequency, duration or severity</li>
                    <li>• <strong>Neurologic signs:</strong> altered mental status, gait abnormality, seizures</li>
                    <li>• <strong>Papilledema</strong></li>
                  </ul>
                  <p className="text-red-600 font-medium mt-2 text-xs">→ CT Brain indicated if any red flag present</p>
                </div>
              </Section>

              {/* Algorithm */}
              <Section id="headache-algorithm" title="Diagnostic Algorithm">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-semibold text-blue-700 text-center">Acute (≤7 days)</p>
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p>• 1st onset: CT Brain</p>
                        <p>• Episodic: Check red flags</p>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="font-semibold text-purple-700 text-center">Chronic (&gt;7 days)</p>
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p>• CT Brain</p>
                        <p>• If normal: Check for papilledema</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
                    <p className="font-semibold text-amber-700">CT Normal + Chronic Headache:</p>
                    <p className="text-muted-foreground mt-1">→ Ophthalmology consult for papilledema</p>
                    <p className="text-muted-foreground">• Papilledema present: Admit for IIH workup</p>
                    <p className="text-muted-foreground">• No papilledema: Neurology consult</p>
                  </div>
                </div>
              </Section>

              {/* Migraine vs Tension */}
              <Section id="headache-comparison" title="Migraine vs Tension Headache">
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[10px] min-w-[350px]">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-left py-2 px-2 font-semibold">Feature</th>
                        <th className="text-left py-2 px-2 font-semibold">Migraine</th>
                        <th className="text-left py-2 px-2 font-semibold">Tension</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Location</td><td className="py-1 px-2">Unilateral/Bilateral</td><td className="py-1 px-2">Frontal</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Duration</td><td className="py-1 px-2">2-72 hours</td><td className="py-1 px-2">Hours to days</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Character</td><td className="py-1 px-2">Pulsating/throbbing</td><td className="py-1 px-2">Squeezing/pressure</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Severity</td><td className="py-1 px-2">Moderate-severe</td><td className="py-1 px-2">Mild-moderate</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Associations</td><td className="py-1 px-2">Nausea, vomiting, photo/phonophobia</td><td className="py-1 px-2">None</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Trigger</td><td className="py-1 px-2">Activity</td><td className="py-1 px-2">Stress</td></tr>
                      <tr><td className="py-1 px-2 font-medium">Family Hx</td><td className="py-1 px-2">Yes</td><td className="py-1 px-2">No</td></tr>
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* Acute Migraine Management */}
              <Section id="headache-acute" title="Acute Migraine Management">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-semibold text-green-700">First Line - Analgesics</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <p className="text-muted-foreground">Paracetamol: 10-15 mg/kg/dose</p>
                        {w > 0 && <p className="font-mono text-green-600">{(w * 10).toFixed(0)}-{(w * 15).toFixed(0)} mg</p>}
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ibuprofen: 5-10 mg/kg/dose</p>
                        {w > 0 && <p className="font-mono text-green-600">{(w * 5).toFixed(0)}-{(w * 10).toFixed(0)} mg</p>}
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Naproxen: 5-7 mg/kg/dose</p>
                    {w > 0 && <p className="font-mono text-gray-600">{(w * 5).toFixed(0)}-{(w * 7).toFixed(0)} mg</p>}
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Triptans (Specialist use only)</p>
                    <p className="text-muted-foreground">Rarely used in pediatrics - consult Neurology</p>
                  </div>
                </div>
              </Section>

              {/* Chronic Migraine Prophylaxis */}
              <Section id="headache-prophylaxis" title="Migraine Prophylaxis (Chronic)">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs mb-2">
                  <p className="font-medium text-blue-700">Indications:</p>
                  <p className="text-muted-foreground">• ≥1 headache/week or &gt;3/month • Prolonged severe attacks • Abortive treatment fails</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Propranolol</p>
                    <p className="text-muted-foreground">&lt;35kg: 10-20mg TDS | ≥35kg: 20-40mg TDS</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Cyproheptadine</p>
                    <p className="text-muted-foreground">0.25-0.4 mg/kg/day BD-TDS</p>
                    {w > 0 && <p className="font-mono text-gray-600">{(w * 0.25).toFixed(1)}-{(w * 0.4).toFixed(1)} mg/day</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Amitriptyline</p>
                    <p className="text-muted-foreground">0.1-0.25 mg/kg/dose HS (max 2mg/kg/day)</p>
                  </div>
                </div>
              </Section>

              {/* IIH */}
              <Section id="headache-iih" title="Idiopathic Intracranial Hypertension (IIH)">
                <div className="space-y-2">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                    <p className="font-semibold text-purple-700">Clinical Features:</p>
                    <p className="text-muted-foreground">Daily headache, diplopia, transient visual obscurations</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                    <p className="font-semibold text-red-700">Examination:</p>
                    <p className="text-muted-foreground">Papilledema, Abducent nerve palsy (CN VI)</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                    <p className="font-semibold text-blue-700">Diagnosis:</p>
                    <p className="text-muted-foreground">LP with opening pressure: ICP &gt;25 cmH₂O (normal CSF)</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                    <p className="font-semibold text-green-700">Treatment - Acetazolamide:</p>
                    <p className="text-muted-foreground">Children: 25 mg/kg/day, increase by 25 mg/kg/day (max 100 mg/kg/day)</p>
                    {w > 0 && <p className="font-mono text-green-600">Start: {(w * 25).toFixed(0)} mg/day</p>}
                    <p className="text-muted-foreground mt-1">+ Weight loss + Stop triggering medications</p>
                  </div>
                </div>
              </Section>

              {/* Non-neurological DDx */}
              <Section id="headache-nonneuro" title="Non-Neurological Causes">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">URTI</p>
                    <p className="text-muted-foreground">Cough, congestion</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Sinusitis</p>
                    <p className="text-muted-foreground">↑ with position, facial tenderness</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Meningitis</p>
                    <p className="text-muted-foreground">Fever, photophobia, neck rigidity</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Refractive Errors</p>
                    <p className="text-muted-foreground">Reduced visual acuity</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Dental Caries</p>
                    <p className="text-muted-foreground">Tooth pain</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Malignant HTN</p>
                    <p className="text-muted-foreground">High BP, risk factors</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACUTE WEAKNESS TAB */}
        <TabsContent value="weakness" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Approach to Acute Weakness</CardTitle>
              <CardDescription className="text-xs">Algorithm for neurological and non-neurological causes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Definition */}
              <Section id="weakness-def" title="Definition & Assessment" defaultOpen={true}>
                <p className="text-xs text-muted-foreground mb-2">
                  Acute weakness refers to sudden onset muscle weakness that may be unilateral or bilateral, and can indicate serious neurological conditions.
                </p>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                  <p className="font-medium text-blue-700">Muscle Power Scale (MRC):</p>
                  <div className="grid grid-cols-2 gap-1 mt-1 text-muted-foreground">
                    <span>0 = No movement</span>
                    <span>1 = Flicker only</span>
                    <span>2 = Movement (gravity eliminated)</span>
                    <span>3 = Against gravity only</span>
                    <span>4 = Against resistance</span>
                    <span>5 = Normal power</span>
                  </div>
                </div>
              </Section>

              {/* Algorithm */}
              <Section id="weakness-algorithm" title="Diagnostic Algorithm">
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                    <p className="font-semibold text-red-700 text-sm">Unilateral Weakness ± Headache</p>
                    <p className="text-xs text-muted-foreground mt-1">→ CT Brain (suspect stroke)</p>
                    <p className="text-xs text-muted-foreground">• +ve: Stroke or other brain insult → Neurology</p>
                    <p className="text-xs text-muted-foreground">• -ve: Consider other DDx</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="font-semibold text-purple-700 text-sm">Progressive Bilateral LL Weakness + Areflexia</p>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <p><strong>± Sphincter impairment / Back pain:</strong></p>
                      <p>→ Emergency MRI Spine</p>
                      <p>• +ve: Spinal compression → Neurosurgery</p>
                      <p>• -ve: Transverse myelitis → Steroids/IVIG</p>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <p className="font-semibold text-amber-700 text-sm">Diurnal Variation (Worse evenings)</p>
                    <p className="text-xs text-muted-foreground mt-1">→ Suspect Myasthenia Gravis</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="font-semibold text-green-700 text-sm">Bilateral Calf Tenderness</p>
                    <p className="text-xs text-muted-foreground mt-1">→ Check CK levels</p>
                    <p className="text-xs text-muted-foreground">• High CK: Myositis</p>
                  </div>
                </div>
              </Section>

              {/* Neurological DDx */}
              <Section id="weakness-neuro-ddx" title="Neurological Differentials">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-semibold text-red-700">Ischemic Stroke</p>
                    <p className="text-muted-foreground">Sudden onset, unilateral weakness/numbness, speech difficulty</p>
                    <p className="text-blue-600 mt-1">Tx: Aspirin 3-5 mg/kg OD</p>
                    {w > 0 && <p className="font-mono text-blue-600">{(w * 3).toFixed(0)}-{(w * 5).toFixed(0)} mg daily</p>}
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">Transverse Myelitis</p>
                    <p className="text-muted-foreground">Bilateral LL weakness, sensory level, sphincter dysfunction</p>
                    <p className="text-blue-600 mt-1">Tx: Methylprednisolone 30 mg/kg IV × 3-5 days</p>
                    {w > 0 && <p className="font-mono text-blue-600">{(w * 30).toFixed(0)} mg IV daily</p>}
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Guillain-Barré Syndrome (GBS)</p>
                    <p className="text-muted-foreground">Ascending weakness, areflexia, post-infection (1-4 weeks)</p>
                    <p className="text-blue-600 mt-1">Tx: IV Immunoglobulin 2 g/kg total</p>
                    {w > 0 && <p className="font-mono text-blue-600">{(w * 2).toFixed(0)} g total (over 2-5 days)</p>}
                  </div>
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                    <p className="font-semibold text-teal-700">Myasthenia Gravis</p>
                    <p className="text-muted-foreground">Fatiguable weakness, ptosis, diplopia, diurnal variation</p>
                    <p className="text-blue-600 mt-1">Tx: Pyridostigmine, IVIG in crisis</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Postictal Todd Paralysis</p>
                    <p className="text-muted-foreground">Transient weakness after seizure, resolves in hours</p>
                  </div>
                </div>
              </Section>

              {/* Non-neurological DDx */}
              <Section id="weakness-nonneuro-ddx" title="Non-Neurological Differentials">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Viral Myositis</p>
                    <p className="text-muted-foreground">Calf tenderness, often post-influenza</p>
                    <p className="text-blue-600">High CK</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Spinal Cord Compression</p>
                    <p className="text-muted-foreground">Back pain, sensory level</p>
                    <p className="text-blue-600">MRI Spine → Neurosurgery</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Arthritis</p>
                    <p className="text-muted-foreground">Localized pain, ↓ROM</p>
                    <p className="text-blue-600">High ESR/CRP</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Conversion Disorder</p>
                    <p className="text-muted-foreground">Stress, normal reflexes</p>
                    <p className="text-blue-600">Diagnosis of exclusion</p>
                  </div>
                </div>
              </Section>

              {/* When to Escalate */}
              <Section id="weakness-escalate" title="When to Escalate">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-700">Contact PICU:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Respiratory compromise</li>
                      <li>• Bulbar weakness</li>
                      <li>• Rapid progression</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">Contact Neurology:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Suspected stroke</li>
                      <li>• GBS / Transverse Myelitis</li>
                      <li>• Myasthenia Gravis</li>
                    </ul>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABNORMAL GAIT TAB */}
        <TabsContent value="gait" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pediatric Abnormal Gait</CardTitle>
              <CardDescription className="text-xs">Identification and evaluation of gait disorders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Important Note */}
              <Section id="gait-note" title="Important Notes" defaultOpen={true}>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
                  <p className="font-semibold text-amber-700 mb-2">Key Points:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong>Hemiplegic, Waddling, and Neuropathic gaits are NOT acute</strong></li>
                    <li>• Don't label anyone with ataxia unless <strong>afebrile</strong> and <strong>fully conscious</strong></li>
                    <li>• Ataxia in febrile/drowsy child = <strong>Pseudo-ataxia</strong> (treat underlying cause)</li>
                  </ul>
                </div>
              </Section>

              {/* Gait Types */}
              <Section id="gait-types" title="Gait Types Recognition">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">Limping Gait</p>
                    <p className="text-muted-foreground">Avoids bearing weight, musculoskeletal pain, trauma</p>
                    <p className="text-blue-600 mt-1">Ix: CRP, ESR, X-ray, US joint → Orthopedics/Rheumatology</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">Ataxic Gait</p>
                    <p className="text-muted-foreground">Wide-based, can't walk heel-to-toe, unsteady, tremors</p>
                    <p className="text-blue-600 mt-1">Ix: CT Brain → Normal: Neurology | Abnormal: Neurosurgery</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Waddling Gait (Not Acute)</p>
                    <p className="text-muted-foreground">Trunk weakness, delayed milestones, Gower sign +ve</p>
                    <p className="text-blue-600 mt-1">Ix: High CK → Neurology</p>
                  </div>
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                    <p className="font-semibold text-teal-700">Neuropathic Gait (Not Acute)</p>
                    <p className="text-muted-foreground">High steppage (toes touch first), sensory loss hands/feet</p>
                    <p className="text-blue-600 mt-1">Ix: CT (hemispheric asymmetry) → Neurology</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-700">Hemiplegic Gait (Not Acute)</p>
                    <p className="text-muted-foreground">Weakness/stiffness one side, birth asphyxia, prematurity</p>
                    <p className="text-blue-600 mt-1">→ Neurology</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Malingering/Psychogenic</p>
                    <p className="text-muted-foreground">Stressful event, inconsistent findings, all tests normal</p>
                    <p className="text-blue-600 mt-1">→ Psychology (diagnosis of exclusion)</p>
                  </div>
                </div>
              </Section>

              {/* Red Flags */}
              <Section id="gait-redflags" title="Red Flag Features">
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 text-xs">
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong>Signs of raised ICP</strong> → CT Brain</li>
                    <li>• <strong>Focal neurology</strong> → CT Brain</li>
                    <li>• <strong>Altered conscious state</strong> → CT Brain ± LP</li>
                    <li>• <strong>Meningism</strong> → LP (after ruling out ↑ICP)</li>
                    <li>• <strong>Bilateral LL weakness</strong> → Think GBS, inform Neurology</li>
                    <li>• <strong>Abnormal deep tendon reflexes</strong> → Think GBS</li>
                    <li>• <strong>Loss of proprioception/vibration</strong> → Think GBS</li>
                  </ul>
                </div>
              </Section>

              {/* Non-neurological Ataxia */}
              <Section id="gait-ataxia-causes" title="Non-Neurological Causes of Ataxia">
                <p className="text-xs text-muted-foreground mb-2">
                  Think non-neurological if: fever, ↓consciousness, trauma, headaches, medications, ear pain
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-700">Cerebellar Tumor</p>
                    <p className="text-muted-foreground">Headaches, vomiting, papilledema, focal deficits</p>
                    <p className="text-blue-600">CT: Posterior fossa mass → Oncology/Neurosurgery</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">Neuroblastoma (with OMAS)</p>
                    <p className="text-muted-foreground">Bone pain, abdominal mass crossing midline</p>
                    <p className="text-blue-600">Ix: Urine VMA/HVA, MIBG scan → Oncology</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Traumatic</p>
                    <p className="text-muted-foreground">History of trauma, skull tenderness</p>
                    <p className="text-blue-600">CT: Fracture/hemorrhage → Neurosurgery</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Intoxication</p>
                    <p className="text-muted-foreground">Access to medications, altered GCS</p>
                    <p className="text-blue-600">Toxicology screen → Pediatrics</p>
                  </div>
                </div>
              </Section>

              {/* OMAS */}
              <Section id="gait-omas" title="Opsoclonus-Myoclonus-Ataxia Syndrome (OMAS)">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs">
                  <p className="font-semibold text-purple-700 mb-2">Autoimmune disorder - Think Neuroblastoma!</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-medium">Symptoms:</p>
                      <ul className="text-muted-foreground space-y-0.5">
                        <li>• Opsoclonus (rapid involuntary eye movements)</li>
                        <li>• Myoclonus (muscle twitching)</li>
                        <li>• Ataxia</li>
                        <li>• Behavioral changes</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Investigations:</p>
                      <ul className="text-muted-foreground space-y-0.5">
                        <li>• Urine VMA/HVA</li>
                        <li>• CT/MRI chest, abdomen, pelvis</li>
                        <li>• MIBG nuclear scan</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-blue-600 mt-2">Tx: Immunomodulators, surgical removal if neuroblastoma found</p>
                </div>
              </Section>

              {/* Ataxia vs Pseudo-ataxia */}
              <Section id="gait-pseudo" title="Ataxia vs Pseudo-Ataxia">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">True Ataxia</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Fully alert child</li>
                      <li>• Afebrile</li>
                      <li>• Imbalance, incoordination</li>
                      <li>• Slurred speech</li>
                      <li>• Wide-based gait</li>
                    </ul>
                    <p className="text-blue-600 mt-1">→ Follow ataxia guidelines</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Pseudo-Ataxia</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Drowsy/inactive child</li>
                      <li>• Often febrile</li>
                      <li>• Tiredness, fatigability</li>
                      <li>• Mild degree of ataxia</li>
                      <li>• Part of systemic illness</li>
                    </ul>
                    <p className="text-amber-600 mt-1">→ Treat underlying cause (URTI, sepsis)</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vital Signs Reference - Collapsible at bottom */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-0">
          <button
            onClick={() => toggleSection('vitals')}
            className="w-full flex items-center justify-between"
          >
            <CardTitle className="text-sm">Pediatric Vital Signs Reference</CardTitle>
            <span className={`transform transition-transform ${expandedSections['vitals'] ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </CardHeader>
        {expandedSections['vitals'] && (
          <CardContent className="pt-3 px-2 sm:px-4">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-[10px] sm:text-xs min-w-[320px]">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left py-2 px-2 font-semibold">Age</th>
                    <th className="text-center py-2 px-2 font-semibold">HR</th>
                    <th className="text-center py-2 px-2 font-semibold">RR</th>
                    <th className="text-center py-2 px-2 font-semibold">SBP</th>
                    <th className="text-center py-2 px-2 font-semibold">Wt(kg)</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground">Newborn</td>
                    <td className="py-2 px-2 text-center">120-160</td>
                    <td className="py-2 px-2 text-center">30-50</td>
                    <td className="py-2 px-2 text-center">50-70</td>
                    <td className="py-2 px-2 text-center">2-3</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground">Infant</td>
                    <td className="py-2 px-2 text-center">80-140</td>
                    <td className="py-2 px-2 text-center">20-30</td>
                    <td className="py-2 px-2 text-center">70-100</td>
                    <td className="py-2 px-2 text-center">4-10</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">Toddler</td>
                    <td className="py-2 px-2 text-center">80-130</td>
                    <td className="py-2 px-2 text-center">20-30</td>
                    <td className="py-2 px-2 text-center">80-110</td>
                    <td className="py-2 px-2 text-center">10-14</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">Preschool</td>
                    <td className="py-2 px-2 text-center">80-120</td>
                    <td className="py-2 px-2 text-center">20-30</td>
                    <td className="py-2 px-2 text-center">80-110</td>
                    <td className="py-2 px-2 text-center">14-18</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">School</td>
                    <td className="py-2 px-2 text-center">70-110</td>
                    <td className="py-2 px-2 text-center">20-30</td>
                    <td className="py-2 px-2 text-center">80-120</td>
                    <td className="py-2 px-2 text-center">20-42</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">Adolescent</td>
                    <td className="py-2 px-2 text-center">55-105</td>
                    <td className="py-2 px-2 text-center">12-20</td>
                    <td className="py-2 px-2 text-center">110-120</td>
                    <td className="py-2 px-2 text-center">&gt;50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
              <p className="font-medium mb-1">Minimal Acceptable SBP:</p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">&lt;1mo: &gt;60 | 1mo-1y: &gt;70 | 1-10y: 70+(2×age) | &gt;10y: &gt;90</p>
              {ageNum > 0 && ageNum <= 10 && (
                <p className="font-mono text-blue-600 mt-2 text-sm">→ Min SBP for {ageNum}y: {70 + (2 * ageNum)} mmHg</p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};


export default ChildrenDashboard;
