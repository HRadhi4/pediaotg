/**
 * Children Dashboard - Pediatric Ward Calculator
 * 
 * File Structure:
 * - Lines 1-50: Imports
 * - Lines 50-240: Main ChildrenDashboard Component (Dashboard & Navigation)
 * - Lines 294-550: BPPage (Blood Pressure Calculator)
 * - Lines 550-750: InfusionsPage (IV Drug Calculations)
 * - Lines 750-900: IntubationPage (ETT + RSI Checklist)
 * - Lines 900-1200: ScoringPage (GCS, PRAM, Westley, OI)
 * - Lines 1200-1520: CPRPage (PALS Algorithms & Drug Dosing)
 * - Lines 1520-1920: ApproachesPage (DKA, Status Epilepticus, Hyperammonemia)
 * - Lines 1920-2220: DrugsPage (Antibiotics & Analgesics)
 * 
 * Future Refactoring: Each page component can be extracted to /pages/children/
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Activity, Syringe, Heart, Brain, Calculator, Pill, Droplets, Stethoscope, Scale, AlertTriangle, FileText, Settings, X, GripVertical, Home, FlaskConical, Zap, Route } from "lucide-react";
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

// Custom icons for nav bar
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

// Sortable Widget Component for drag and drop
const SortableWidget = ({ widget, isEditMode, onClick, getColorClass }) => {
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
        {/* Drag handle for edit mode */}
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
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getColorClass(widget.color)}`}>
            <widget.icon className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-semibold text-xs leading-tight px-1">{widget.title}</h3>
          <p className="text-[10px] text-muted-foreground leading-tight px-1">{widget.subtitle}</p>
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
    return saved ? JSON.parse(saved) : ["bp", "infusions", "intubation", "scoring", "cpr", "approaches", "drugs"];
  });

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
    bp: { id: "bp", title: "Blood Pressure", subtitle: "Age-based BP percentiles", icon: Activity, color: "red", keywords: ["hypertension", "systolic", "diastolic", "percentile", "boys", "girls", "map"] },
    infusions: { id: "infusions", title: "Infusions", subtitle: "IV drug calculations", icon: Syringe, color: "blue", keywords: ["dopamine", "dobutamine", "adrenaline", "epinephrine", "sedation", "midazolam", "fentanyl", "inotrope"] },
    intubation: { id: "intubation", title: "Intubation", subtitle: "ETT + RSI Checklist", icon: Stethoscope, color: "purple", keywords: ["ett", "tube", "airway", "rsi", "rapid sequence", "laryngoscope", "cuffed", "uncuffed"] },
    scoring: { id: "scoring", title: "Scoring/Calculators", subtitle: "GCS, PRAM, Westley, OI, IWL", icon: Calculator, color: "amber", keywords: ["glasgow", "coma", "croup", "respiratory", "oxygenation", "pram", "westley", "iwl", "bsa", "insensible", "water loss"] },
    cpr: { id: "cpr", title: "CPR", subtitle: "PALS drugs & algorithms", icon: Heart, color: "red", keywords: ["resuscitation", "pals", "arrest", "defibrillation", "epinephrine", "amiodarone", "adenosine", "tachycardia", "bradycardia", "vf", "vt", "asystole", "pea"] },
    approaches: { id: "approaches", title: "Approaches", subtitle: "DKA, SE, Hyperammonemia", icon: FileText, color: "teal", keywords: ["diabetic", "ketoacidosis", "dka", "status epilepticus", "seizure", "convulsion", "hyperammonemia", "ammonia", "urea cycle", "phenytoin", "diazepam"] },
    drugs: { id: "drugs", title: "Drugs", subtitle: "Commonly used medications", icon: Pill, color: "purple", keywords: ["antibiotic", "analgesic", "paracetamol", "ibuprofen", "morphine", "amoxicillin", "ceftriaxone", "vancomycin", "gentamicin", "pain", "fever"] },
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
          <GripVertical className="h-4 w-4 text-[#00d9c5]" />
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
                          <w.icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-heading font-semibold text-xs leading-tight px-1">{w.title}</h3>
                        <p className="text-[10px] text-muted-foreground leading-tight px-1">{w.subtitle}</p>
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
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground tracking-tight">
                {currentPage === "main" ? "Children" : widgets.find(w => w.id === currentPage)?.title || "Children"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {currentPage === "main" ? "Pediatric Ward" : "Tap arrow to go back"}
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
                {isEditMode ? <X className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
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

  // Classify patient BP
  const classifyBP = () => {
    if (!patientSBP || !patientDBP || !selectedData) return null;
    const sbp = parseInt(patientSBP);
    const dbp = parseInt(patientDBP);
    
    if (sbp < selectedData.systolic.p5 || dbp < selectedData.diastolic.p5) {
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
              <CardContent className="space-y-1">
                {step.items && step.items.map((item, i) => (
                  <p key={i} className="text-xs">• {item}</p>
                ))}
                {step.drugs && step.drugs.map((drug, i) => (
                  <div key={i} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs mb-1">
                    <p className="font-medium">{drug.name}: {drug.dose}</p>
                    <p className="text-muted-foreground">{drug.note}</p>
                  </div>
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

// CPR Page - PALS Algorithms & Drug Dosing
const CPRPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("arrest");
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  // Drug calculations based on weight
  const calculateDrugs = () => {
    if (!w) return null;
    return {
      epinephrine: {
        dose: (w * 0.01).toFixed(3),
        volume1to10000: (w * 0.1).toFixed(2), // 1:10,000 = 0.1mg/mL
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

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Weight Input - Always visible */}
      <Card className="nightingale-card border-red-200 dark:border-red-800">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-red-500" />
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
        <TabsList className="grid w-full grid-cols-4 text-xs">
          <TabsTrigger value="arrest">Arrest</TabsTrigger>
          <TabsTrigger value="tachy">Tachy</TabsTrigger>
          <TabsTrigger value="brady">Brady</TabsTrigger>
          <TabsTrigger value="drugs">Drugs</TabsTrigger>
        </TabsList>

        {/* Cardiac Arrest Algorithm */}
        <TabsContent value="arrest" className="space-y-3 mt-4">
          <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Cardiac Arrest Algorithm (PALS 2025)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">1. Start CPR Immediately</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Push hard & fast: 100-120/min</li>
                  <li>• Compression-to-ventilation: 15:2 (2 rescuers)</li>
                  <li>• Minimize interruptions (&gt;60% CPR time)</li>
                  <li>• Attach monitor/defibrillator</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Shockable Rhythm */}
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300">
                  <p className="font-bold text-amber-800 dark:text-amber-200 text-center mb-2">VF/pVT (Shockable)</p>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">1.</span>
                      <span>Shock: <span className="font-mono text-amber-700">{drugs ? `${drugs.defibrillation.first}J` : "2 J/kg"}</span></span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">2.</span>
                      <span>CPR 2 min</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">3.</span>
                      <span>Shock: <span className="font-mono text-amber-700">{drugs ? `${drugs.defibrillation.subsequent}J` : "4 J/kg"}</span></span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">4.</span>
                      <span>Epinephrine + CPR</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">5.</span>
                      <span>Shock + Amiodarone</span>
                    </li>
                  </ol>
                </div>

                {/* Non-Shockable Rhythm */}
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/50 border border-blue-300">
                  <p className="font-bold text-blue-800 dark:text-blue-200 text-center mb-2">Asystole/PEA</p>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>CPR 2 min</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>Epinephrine ASAP</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>CPR 2 min</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">4.</span>
                      <span>Check rhythm</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">5.</span>
                      <span>Repeat; Epi q3-5min</span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* H's and T's */}
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/50">
                <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Reversible Causes (H&apos;s &amp; T&apos;s)</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <p className="font-medium text-purple-600">H&apos;s:</p>
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
                    <p className="font-medium text-purple-600">T&apos;s:</p>
                    <ul className="space-y-0.5">
                      <li>• Tension pneumo</li>
                      <li>• Tamponade</li>
                      <li>• Toxins</li>
                      <li>• Thrombosis (PE)</li>
                      <li>• Thrombosis (coronary)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tachycardia Algorithm */}
        <TabsContent value="tachy" className="space-y-3 mt-4">
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tachycardia with Pulse Algorithm</CardTitle>
              <CardDescription className="text-xs">HR &gt;220 bpm (infant) or &gt;180 bpm (child)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold mb-2">Initial Assessment</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Support ABCs, give O2</li>
                  <li>• Obtain IV/IO access</li>
                  <li>• 12-lead ECG if available</li>
                  <li>• Assess: QRS narrow (&lt;0.09s) or wide (≥0.09s)?</li>
                </ul>
              </div>

              {/* Narrow vs Wide Complex */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950/50 border border-green-300">
                  <p className="font-bold text-green-800 dark:text-green-200 text-center mb-2">Narrow QRS (SVT)</p>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                      <p className="font-medium text-green-700">If STABLE:</p>
                      <p>1. Vagal maneuvers</p>
                      <p>2. Adenosine:</p>
                      <p className="font-mono text-green-600 pl-2">
                        1st: {drugs ? `${drugs.adenosine.firstDose}mg` : "0.1mg/kg (max 6mg)"}
                      </p>
                      <p className="font-mono text-green-600 pl-2">
                        2nd: {drugs ? `${drugs.adenosine.secondDose}mg` : "0.2mg/kg (max 12mg)"}
                      </p>
                    </div>
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <p className="font-medium text-red-700">If UNSTABLE:</p>
                      <p>Synchronized cardioversion</p>
                      <p className="font-mono text-red-600">
                        {drugs ? `${drugs.cardioversion.first}-${drugs.cardioversion.second}J` : "0.5-1 J/kg → 2 J/kg"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300">
                  <p className="font-bold text-red-800 dark:text-red-200 text-center mb-2">Wide QRS (VT)</p>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="p-2 bg-red-200/50 dark:bg-red-900/30 rounded-lg">
                      <p className="font-medium text-red-700">If UNSTABLE or Pulseless:</p>
                      <p>Synchronized cardioversion</p>
                      <p className="font-mono text-red-600">
                        {drugs ? `${drugs.cardioversion.first}-${drugs.cardioversion.second}J` : "0.5-1 J/kg"}
                      </p>
                      <p className="text-xs mt-1">If pulseless → Arrest algorithm</p>
                    </div>
                    <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                      <p className="font-medium text-amber-700">If STABLE:</p>
                      <p>Expert consultation</p>
                      <p>Consider Amiodarone:</p>
                      <p className="font-mono text-amber-600">
                        {drugs ? `${drugs.amiodarone.dose}mg` : "5mg/kg"} IV over 20-60 min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bradycardia Algorithm */}
        <TabsContent value="brady" className="space-y-3 mt-4">
          <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Bradycardia with Pulse Algorithm</CardTitle>
              <CardDescription className="text-xs">HR &lt;60 bpm with cardiopulmonary compromise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold mb-2">Initial Steps</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Support ABCs, give O2</li>
                  <li>• Attach monitor, IV/IO access</li>
                  <li>• If HR &lt;60 with poor perfusion → Start CPR</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                <p className="font-semibold text-blue-700 mb-2">If Persistent Bradycardia + Compromise:</p>
                <ol className="space-y-2 text-muted-foreground">
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-blue-600">1. Epinephrine</span>
                    <p className="font-mono text-blue-600">
                      IV/IO: {drugs ? `${drugs.epinephrine.dose}mg` : "0.01mg/kg"} ({drugs ? `${drugs.epinephrine.volume1to10000}mL` : "0.1mL/kg"} of 1:10,000)
                    </p>
                    <p className="text-xs text-muted-foreground">Repeat every 3-5 minutes</p>
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-blue-600">2. Atropine</span> (if increased vagal tone or AV block)
                    <p className="font-mono text-blue-600">
                      {drugs ? `${drugs.atropine.dose}mg` : "0.02mg/kg"} IV/IO (min 0.1mg, max 0.5mg)
                    </p>
                    <p className="text-xs text-muted-foreground">May repeat once</p>
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-blue-600">3. Consider pacing</span> if unresponsive to medications
                  </li>
                </ol>
              </div>

              {/* Normal HR by Age */}
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50">
                <p className="font-semibold mb-2">Normal Heart Rate by Age</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Newborn</p>
                    <p className="font-mono">80-205 bpm</p>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Infant</p>
                    <p className="font-mono">75-190 bpm</p>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Child (1-10y)</p>
                    <p className="font-mono">60-140 bpm</p>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Adolescent</p>
                    <p className="font-mono">50-100 bpm</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drug Doses Summary */}
        <TabsContent value="drugs" className="space-y-3 mt-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">PALS Drug Doses</CardTitle>
              <CardDescription className="text-xs">
                {w ? `Calculated for ${w} kg` : "Enter weight above for calculations"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Epinephrine */}
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Epinephrine (1:10,000)</p>
                    <p className="text-xs text-muted-foreground">Cardiac arrest, bradycardia</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">0.01 mg/kg IV/IO</p>
                    {drugs && (
                      <>
                        <p className="font-mono text-red-600 font-bold">{drugs.epinephrine.dose} mg</p>
                        <p className="font-mono text-red-600 text-sm">({drugs.epinephrine.volume1to10000} mL)</p>
                      </>
                    )}
                  </div>
                </div>
                {drugs && (
                  <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                    ETT: {drugs.epinephrine.ettDose} mg (0.1 mg/kg)
                  </p>
                )}
              </div>

              {/* Amiodarone */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Amiodarone</p>
                    <p className="text-xs text-muted-foreground">VF/pVT, stable VT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">5 mg/kg IV/IO</p>
                    {drugs && <p className="font-mono text-amber-600 font-bold">{drugs.amiodarone.dose} mg</p>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Arrest: rapid push. Stable: over 20-60 min</p>
              </div>

              {/* Adenosine */}
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Adenosine</p>
                    <p className="text-xs text-muted-foreground">SVT (rapid IV push + flush)</p>
                  </div>
                  <div className="text-right">
                    {drugs ? (
                      <>
                        <p className="text-xs text-muted-foreground">1st: 0.1mg/kg (max 6mg)</p>
                        <p className="font-mono text-green-600 font-bold">{drugs.adenosine.firstDose} mg</p>
                        <p className="text-xs text-muted-foreground mt-1">2nd: 0.2mg/kg (max 12mg)</p>
                        <p className="font-mono text-green-600 font-bold">{drugs.adenosine.secondDose} mg</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs">1st: 0.1 mg/kg (max 6mg)</p>
                        <p className="text-xs">2nd: 0.2 mg/kg (max 12mg)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Atropine */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Atropine</p>
                    <p className="text-xs text-muted-foreground">Bradycardia (vagal/AV block)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">0.02 mg/kg IV/IO</p>
                    {drugs && <p className="font-mono text-blue-600 font-bold">{drugs.atropine.dose} mg</p>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Min 0.1mg, Max 0.5mg/dose</p>
              </div>

              {/* Defibrillation/Cardioversion */}
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30">
                <p className="font-semibold text-sm mb-2">Energy Doses</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Defibrillation</p>
                    <p className="text-muted-foreground">1st: 2 J/kg</p>
                    {drugs && <p className="font-mono text-purple-600">{drugs.defibrillation.first} J</p>}
                    <p className="text-muted-foreground">2nd+: 4 J/kg</p>
                    {drugs && <p className="font-mono text-purple-600">{drugs.defibrillation.subsequent} J</p>}
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Cardioversion</p>
                    <p className="text-muted-foreground">0.5-1 J/kg → 2 J/kg</p>
                    {drugs && <p className="font-mono text-purple-600">{drugs.cardioversion.first}-{drugs.cardioversion.second} J</p>}
                  </div>
                </div>
              </div>

              {/* Lidocaine */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Lidocaine (alternative)</p>
                    <p className="text-xs text-muted-foreground">VF/pVT if amiodarone unavailable</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">1 mg/kg IV/IO bolus</p>
                    {drugs && <p className="font-mono text-gray-600 font-bold">{drugs.lidocaine.bolus} mg</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reference */}
          <Card className="nightingale-card">
            <CardContent className="pt-4 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Reference: AHA PALS Guidelines 2025</p>
              <p>• Epinephrine repeat: every 3-5 minutes</p>
              <p>• CPR quality: 100-120/min, &gt;60% of time</p>
              <p>• DBP target: ≥25 mmHg (infant), ≥30 mmHg (child)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Approaches Page - DKA, Status Epilepticus, Hyperammonemia
const ApproachesPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("dka");
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Weight Input */}
      <Card className="nightingale-card border-teal-200 dark:border-teal-800">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-teal-500" />
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Patient Weight (kg)</Label>
              <Input
                type="number"
                placeholder="Enter weight for calculations"
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
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="dka" className="text-xs py-2 px-1">DKA</TabsTrigger>
          <TabsTrigger value="se" className="text-xs py-2 px-1 leading-tight">Status<br/>Epilepticus</TabsTrigger>
          <TabsTrigger value="hypernh3" className="text-xs py-2 px-1 leading-tight">Hyper-<br/>ammonemia</TabsTrigger>
        </TabsList>

        {/* DKA Tab */}
        <TabsContent value="dka" className="space-y-3 mt-4">
          <Card className="border-orange-300 bg-orange-50 dark:bg-orange-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Diabetic Ketoacidosis (DKA)</CardTitle>
              <CardDescription className="text-xs">Salmaniya Medical Complex Guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {/* Diagnostic Criteria */}
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Diagnostic Criteria</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Ketonuria positive</li>
                  <li>• Glucose &gt;11 mmol/L (&gt;200 mg/dL)</li>
                  <li>• pH &lt;7.30</li>
                  <li>• Serum bicarbonate &lt;15 mmol/L</li>
                </ul>
              </div>

              {/* Fluid Management */}
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/50">
                <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Fluid Management</p>
                <p className="text-muted-foreground mb-2">Use 0.9% or 0.45% NS until dextrose added</p>
                <div className="space-y-2">
                  {/* Initial Bolus - Even if not in shock */}
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg border border-teal-300">
                    <p className="font-medium text-teal-700">Initial Approach (before insulin):</p>
                    <p className="text-muted-foreground">10 mL/kg over 1 hour</p>
                    {w > 0 && <p className="font-mono text-teal-600">→ {(w * 10).toFixed(0)} mL over 1 hr</p>}
                    <p className="text-xs text-teal-600 mt-1">Can be given even if not in shock</p>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <p className="font-medium">Maintenance (by weight):</p>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-muted-foreground">
                      <span>&lt;10 kg: 6 mL/kg/hr</span>
                      <span>10-19 kg: 5 mL/kg/hr</span>
                      <span>20-30 kg: 3.5 mL/kg/hr</span>
                      <span>&gt;30 kg: 3 mL/kg/hr</span>
                    </div>
                    {w > 0 && (
                      <p className="font-mono text-blue-600 mt-2">
                        → {w < 10 ? (w * 6).toFixed(0) : w < 20 ? (w * 5).toFixed(0) : w < 30 ? (w * 3.5).toFixed(0) : Math.min(w * 3, 250).toFixed(0)} mL/hr
                      </p>
                    )}
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="font-medium text-red-700">If Shock:</p>
                    <p className="text-muted-foreground">10 mL/kg bolus over 10-20 min, reassess & repeat PRN</p>
                    {w > 0 && <p className="font-mono text-red-600">→ {(w * 10).toFixed(0)} mL bolus</p>}
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 italic">Add dextrose when BG &lt;15 mmol/L (250 mg/dL)</p>
              </div>

              {/* Insulin */}
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950/50">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-2">Insulin</p>
                <div className="space-y-2 text-muted-foreground">
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <p className="font-medium">Continuous Infusion:</p>
                    <p>0.1 units/kg/hr (= 1 mL/kg/hr of 25 units in 250 mL NS)</p>
                    {w > 0 && <p className="font-mono text-green-600">→ {(w * 0.1).toFixed(2)} units/hr ({(w * 1).toFixed(0)} mL/hr)</p>}
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <p className="font-medium">Decrease insulin when:</p>
                    <p>pH &gt;7.30 OR HCO3 &gt;15 mmol/L</p>
                    <p className="text-xs">Decrease by 25-50% q1-2h to 0.02 U/kg/hr</p>
                  </div>
                  <p className="text-xs italic">If BG drops but acidosis persists → increase dextrose, not decrease insulin</p>
                </div>
              </div>

              {/* Potassium */}
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/50">
                <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Potassium</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• If K+ &lt;5.5 mmol/L and patient voiding:</li>
                  <li className="pl-4">Add 40 mEq/L KCl to IV fluid</li>
                  <li>• Target K+: 4-5 mEq/L</li>
                  <li>• If K+ &gt;5.5: use plain IVF</li>
                </ul>
              </div>

              {/* Bicarbonate */}
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50">
                <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Bicarbonate</p>
                <p className="text-muted-foreground"><span className="font-medium">Indication:</span> pH &lt;6.9 ONLY</p>
                <p className="text-muted-foreground"><span className="font-medium">Dose:</span> 1-2 mEq/kg over 1 hour</p>
                {w > 0 && <p className="font-mono text-amber-600">→ {(w * 1).toFixed(0)}-{(w * 2).toFixed(0)} mEq</p>}
                <p className="text-xs text-red-600 mt-1">⚠ Always consult endocrinologist first!</p>
              </div>

              {/* Cerebral Edema */}
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">⚠ Cerebral Edema</p>
                <p className="text-xs text-muted-foreground mb-2">Warning signs: headache, irritability, drowsiness, ↓LOC</p>
                <div className="space-y-1 text-muted-foreground">
                  <p>1. Raise head of bed</p>
                  <p>2. Decrease fluids to 2 L/m²/day</p>
                  <p>3. <span className="font-medium">Mannitol 0.25-0.5 g/kg</span> over 10-15 min</p>
                  {w > 0 && <p className="font-mono text-red-600 pl-4">→ {(w * 0.25).toFixed(1)}-{(w * 0.5).toFixed(1)} g</p>}
                  <p>4. If Na drops: 3% saline 2-4 mL/kg over 10-20 min</p>
                  {w > 0 && <p className="font-mono text-red-600 pl-4">→ {(w * 2).toFixed(0)}-{(w * 4).toFixed(0)} mL</p>}
                  <p>5. Decrease insulin to 0.04-0.05 U/kg/hr</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Epilepticus Tab */}
        <TabsContent value="se" className="space-y-3 mt-4">
          <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Status Epilepticus Protocol</CardTitle>
              <CardDescription className="text-xs">Start medication after 5 minutes of seizure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {/* Initial Steps */}
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Initial Steps</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. ABC: Airway, Breathing, O2, Circulation</li>
                  <li>2. Start IV, collect: Sugar, Ca, Na</li>
                  <li>3. Brief history</li>
                  <li>4. Start medication after 5 minutes</li>
                </ul>
              </div>

              {/* Step 1: Diazepam */}
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/50">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-blue-700 dark:text-blue-300">Step 1: Diazepam (Valium)</p>
                  <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">5 min</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium">IV:</span> 0.2-0.3 mg/kg (max 5 mg/dose)</p>
                  <p><span className="font-medium">PR:</span> 0.5 mg/kg</p>
                  {w > 0 && (
                    <div className="font-mono text-blue-600">
                      <p>→ IV: {(w * 0.2).toFixed(1)}-{Math.min(w * 0.3, 5).toFixed(1)} mg</p>
                      <p>→ PR: {(w * 0.5).toFixed(1)} mg</p>
                    </div>
                  )}
                  <p className="text-red-600">⚠ Total max 10 mg (respiratory depression risk)</p>
                </div>
              </div>

              {/* Step 2: Repeat Diazepam */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-blue-600">Step 2: Repeat Diazepam</p>
                  <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">+5 min</span>
                </div>
                <p className="text-muted-foreground">Same dose if still seizing</p>
              </div>

              {/* Step 3: Phenytoin */}
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-amber-700 dark:text-amber-300">Step 3: Phenytoin</p>
                  <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded">+10 min</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium">Loading:</span> 20 mg/kg IV over 20 min</p>
                  {w > 0 && <p className="font-mono text-amber-600">→ {(w * 20).toFixed(0)} mg over 20 min</p>}
                  <p className="text-red-600">⚠ Max rate: 1 mg/kg/min (arrhythmia risk)</p>
                  <div className="p-2 mt-2 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-amber-300">
                    <p className="text-xs font-medium text-amber-700">Alternatives (if available):</p>
                    <p className="text-xs">• Levetiracetam (Keppra): 40-60 mg/kg IV</p>
                    {w > 0 && <p className="font-mono text-amber-600 text-xs">→ {(w * 40).toFixed(0)}-{(w * 60).toFixed(0)} mg</p>}
                    <p className="text-xs">• Valproate IV: 20-40 mg/kg</p>
                    {w > 0 && <p className="font-mono text-amber-600 text-xs">→ {(w * 20).toFixed(0)}-{(w * 40).toFixed(0)} mg</p>}
                  </div>
                </div>
              </div>

              {/* Step 4: Repeat Phenytoin */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-amber-600">Step 4: Phenytoin 2nd dose</p>
                  <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded">+10 min</span>
                </div>
                <div className="text-muted-foreground">
                  <p>½ dose: 10 mg/kg IV over 10 min</p>
                  {w > 0 && <p className="font-mono text-amber-600">→ {(w * 10).toFixed(0)} mg</p>}
                </div>
              </div>

              {/* Step 5: Phenobarbital */}
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/50">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-purple-700 dark:text-purple-300">Step 5: Phenobarbital</p>
                  <span className="text-xs bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded">+10 min</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium">Loading:</span> 20 mg/kg IV over 10 min</p>
                  {w > 0 && <p className="font-mono text-purple-600">→ {(w * 20).toFixed(0)} mg</p>}
                  <p><span className="font-medium">2nd dose:</span> 10 mg/kg over 10 min</p>
                  {w > 0 && <p className="font-mono text-purple-600">→ {(w * 10).toFixed(0)} mg</p>}
                </div>
              </div>

              {/* Refractory */}
              <div className="p-3 rounded-xl bg-red-200 dark:bg-red-900/50 border border-red-400">
                <p className="font-bold text-red-700 dark:text-red-300 mb-2">⚠ REFRACTORY SEIZURES</p>
                <p className="text-muted-foreground">If still seizing after above steps:</p>
                <p className="font-semibold text-red-700 mt-1">→ General Anesthesia + Intubation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hyperammonemia Tab */}
        <TabsContent value="hypernh3" className="space-y-3 mt-4">
          <Card className="border-purple-300 bg-purple-50 dark:bg-purple-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Hyperammonemia Approach</CardTitle>
              <CardDescription className="text-xs">Diagnostic algorithm and initial management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {/* Initial Assessment */}
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Initial Assessment</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <p className="font-medium text-blue-700">Normal pH / Alkalosis</p>
                    <p className="text-xs">Consider urea cycle defects</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="font-medium text-red-700">Acidosis</p>
                    <p className="text-xs">Consider organic acidemias</p>
                  </div>
                </div>
              </div>

              {/* Diagnostic Pathway */}
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/50">
                <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Diagnostic Pathway (Urea Cycle)</p>
                <div className="space-y-2 text-muted-foreground">
                  <p className="font-medium">Check Plasma Citrulline:</p>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg space-y-1">
                    <p><span className="font-medium text-green-600">↑ Citrulline + ASA present:</span> Argininosuccinic aciduria</p>
                    <p><span className="font-medium text-amber-600">↑ Citrulline + ASA absent:</span> Citrullinemia (ASS deficiency)</p>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <p className="font-medium">↓/Absent Citrulline → Check Urine Orotic Acid:</p>
                    <p className="pl-2"><span className="text-blue-600">Normal/Low:</span> CPS deficiency</p>
                    <p className="pl-2"><span className="text-red-600">High:</span> OTC deficiency</p>
                  </div>
                </div>
              </div>

              {/* Immediate Management */}
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">⚠ Immediate Management</p>
                <ol className="space-y-2 text-muted-foreground">
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">1. Stop protein intake</span>
                    <p className="text-xs">Reduce nitrogen load</p>
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">2. IV Dextrose 10%</span>
                    <p className="text-xs">Prevent catabolism, provide calories</p>
                    {w > 0 && <p className="font-mono text-red-600">→ Maintenance: {(w * 100 / 24).toFixed(0)} mL/hr D10%</p>}
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">3. Ammonia Scavengers</span>
                    <div className="mt-1">
                      <p><span className="font-medium">Sodium Benzoate:</span> 250 mg/kg load, then 250-500 mg/kg/day</p>
                      {w > 0 && <p className="font-mono text-red-600">→ Load: {(w * 0.25).toFixed(1)} g</p>}
                      <p className="mt-1"><span className="font-medium">Sodium Phenylacetate:</span> 250 mg/kg load, then 250-500 mg/kg/day</p>
                    </div>
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">4. L-Arginine</span>
                    <p>200-600 mg/kg/day (for urea cycle defects)</p>
                    {w > 0 && <p className="font-mono text-red-600">→ {(w * 0.2).toFixed(1)}-{(w * 0.6).toFixed(1)} g/day</p>}
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">5. Dialysis if severe</span>
                    <p className="text-xs">Consider if NH3 &gt;500 µmol/L or not responding</p>
                  </li>
                </ol>
              </div>

              {/* Labs to Order */}
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50">
                <p className="font-semibold mb-2">Labs to Order</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <p className="font-medium">Blood:</p>
                    <ul className="text-xs space-y-0.5">
                      <li>• Ammonia (on ice)</li>
                      <li>• VBG, Glucose</li>
                      <li>• Lactate</li>
                      <li>• Plasma amino acids</li>
                      <li>• LFTs, Coags</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Urine:</p>
                    <ul className="text-xs space-y-0.5">
                      <li>• Orotic acid</li>
                      <li>• Organic acids</li>
                      <li>• Ketones</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reference */}
              <Card className="nightingale-card">
                <CardContent className="pt-4 text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Normal Ammonia Levels</p>
                  <p>• Newborn: &lt;110 µmol/L</p>
                  <p>• Infant: &lt;80 µmol/L</p>
                  <p>• Child/Adult: &lt;50 µmol/L</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Drugs Page - Placeholder
// Drugs Page - Antibiotics & Analgesics
const DrugsPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("antibiotics");
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  // Antibiotic data
  const antibiotics = [
    {
      name: "Amoxicillin",
      category: "Penicillin",
      route: "PO",
      dose: "25-50",
      unit: "mg/kg/day",
      frequency: "q8h",
      max: "3 g/day",
      notes: "High dose (80-90 mg/kg/day) for otitis media, pneumonia",
      color: "blue"
    },
    {
      name: "Amoxicillin-Clavulanate (Augmentin) PO",
      category: "Penicillin/BLI",
      route: "PO",
      dose: "25-45",
      unit: "mg/kg/day",
      frequency: "q12h",
      max: "875 mg amox/dose",
      notes: "Based on amoxicillin component. High dose: 90 mg/kg/day for resistant strep pneumo",
      color: "blue"
    },
    {
      name: "Amoxicillin-Clavulanate (Augmentin) IV",
      category: "Penicillin/BLI",
      route: "IV",
      dose: "25-50",
      unit: "mg/kg/dose",
      frequency: "q6-8h",
      max: "2 g amox/dose",
      notes: "Based on amoxicillin component. Severe infections use higher dose range",
      color: "blue"
    },
    {
      name: "Ampicillin",
      category: "Penicillin",
      route: "IV",
      dose: "50-100",
      unit: "mg/kg/dose",
      frequency: "q6h",
      max: "12 g/day",
      notes: "Meningitis: 100 mg/kg/dose q6h",
      color: "blue"
    },
    {
      name: "Piperacillin-Tazobactam (Tazocin)",
      category: "Penicillin/BLI",
      route: "IV",
      dose: "80-100",
      unit: "mg/kg/dose",
      frequency: "q6-8h",
      max: "4.5 g/dose",
      notes: "Based on piperacillin. Pseudomonas: 100 mg/kg q6h. Extended infusion 3-4hr for severe infections",
      color: "blue"
    },
    {
      name: "Ceftriaxone",
      category: "3rd Gen Ceph",
      route: "IV/IM",
      dose: "50-100",
      unit: "mg/kg/day",
      frequency: "q12-24h",
      max: "4 g/day",
      notes: "Meningitis: 100 mg/kg/day. Avoid in neonates with jaundice",
      color: "green"
    },
    {
      name: "Cefotaxime",
      category: "3rd Gen Ceph",
      route: "IV",
      dose: "50",
      unit: "mg/kg/dose",
      frequency: "q6-8h",
      max: "12 g/day",
      notes: "Preferred in neonates over ceftriaxone",
      color: "green"
    },
    {
      name: "Ceftazidime",
      category: "3rd Gen Ceph",
      route: "IV",
      dose: "50",
      unit: "mg/kg/dose",
      frequency: "q8h",
      max: "6 g/day",
      notes: "Anti-pseudomonal. Meningitis: 50 mg/kg q8h. Cystic fibrosis: may need higher doses",
      color: "green"
    },
    {
      name: "Cefepime",
      category: "4th Gen Ceph",
      route: "IV",
      dose: "50",
      unit: "mg/kg/dose",
      frequency: "q8-12h",
      max: "2 g/dose",
      notes: "Broad spectrum incl. Pseudomonas. Meningitis/severe: 50 mg/kg q8h. Febrile neutropenia: q8h",
      color: "teal"
    },
    {
      name: "Gentamicin",
      category: "Aminoglycoside",
      route: "IV",
      dose: "5-7.5",
      unit: "mg/kg/dose",
      frequency: "q24h",
      max: "560 mg/dose",
      notes: "Once daily dosing. Monitor levels (trough <1, peak 20-30)",
      color: "amber"
    },
    {
      name: "Vancomycin",
      category: "Glycopeptide",
      route: "IV",
      dose: "15",
      unit: "mg/kg/dose",
      frequency: "q6-8h",
      max: "4 g/day",
      notes: "Trough 10-15 (uncomplicated), 15-20 (meningitis/severe). Infuse over 1hr",
      color: "red"
    },
    {
      name: "Azithromycin",
      category: "Macrolide",
      route: "PO",
      dose: "10",
      unit: "mg/kg/day",
      frequency: "once daily",
      max: "500 mg/day",
      notes: "Day 1: 10 mg/kg, Days 2-5: 5 mg/kg (Z-pack)",
      color: "purple"
    },
    {
      name: "Clindamycin",
      category: "Lincosamide",
      route: "IV/PO",
      dose: "10-15",
      unit: "mg/kg/dose",
      frequency: "q6-8h",
      max: "900 mg/dose",
      notes: "Good for skin/soft tissue, bone. Anaerobic coverage",
      color: "teal"
    },
    {
      name: "Metronidazole",
      category: "Nitroimidazole",
      route: "IV/PO",
      dose: "7.5",
      unit: "mg/kg/dose",
      frequency: "q8h",
      max: "500 mg/dose",
      notes: "Anaerobic infections, C. diff, H. pylori",
      color: "orange"
    },
    {
      name: "Penicillin G",
      category: "Penicillin",
      route: "IV",
      dose: "50,000",
      unit: "units/kg/dose",
      frequency: "q4-6h",
      max: "4 MU/dose",
      notes: "Strep pharyngitis, syphilis, rheumatic fever prophylaxis",
      color: "blue"
    }
  ];

  // Analgesic data
  const analgesics = [
    {
      name: "Paracetamol (Acetaminophen)",
      category: "Antipyretic/Analgesic",
      route: "PO/PR/IV",
      dose: "15",
      unit: "mg/kg/dose",
      frequency: "q4-6h",
      max: "75 mg/kg/day (max 4g/day)",
      notes: "IV: 7.5 mg/kg if <10kg. Loading: 20-25 mg/kg PR",
      color: "blue"
    },
    {
      name: "Ibuprofen",
      category: "NSAID",
      route: "PO",
      dose: "5-10",
      unit: "mg/kg/dose",
      frequency: "q6-8h",
      max: "40 mg/kg/day (max 2.4g/day)",
      notes: "Avoid if dehydrated, renal impairment, or GI bleed risk",
      color: "green"
    },
    {
      name: "Morphine",
      category: "Opioid",
      route: "IV",
      dose: "0.05-0.1",
      unit: "mg/kg/dose",
      frequency: "q2-4h PRN",
      max: "0.1-0.2 mg/kg/dose",
      notes: "Start low, titrate. Monitor respiratory status. PO: 0.2-0.5 mg/kg/dose",
      color: "red"
    },
    {
      name: "Fentanyl",
      category: "Opioid",
      route: "IV",
      dose: "0.5-2",
      unit: "mcg/kg/dose",
      frequency: "q1-2h PRN",
      max: "4 mcg/kg/dose",
      notes: "Rapid onset (1-2 min), short duration. Infusion: 1-3 mcg/kg/hr",
      color: "red"
    },
    {
      name: "Ketamine",
      category: "Dissociative",
      route: "IV/IM",
      dose: "1-2",
      unit: "mg/kg IV",
      frequency: "single dose",
      max: "4 mg/kg IM",
      notes: "Procedural sedation. IM: 4-5 mg/kg. Causes salivation - consider glycopyrrolate",
      color: "purple"
    },
    {
      name: "Midazolam",
      category: "Benzodiazepine",
      route: "IV/IN/PO",
      dose: "0.05-0.1",
      unit: "mg/kg IV",
      frequency: "single dose",
      max: "0.5 mg/kg IN",
      notes: "IN: 0.2-0.5 mg/kg. PO: 0.25-0.5 mg/kg. Anxiolysis/procedural",
      color: "amber"
    },
    {
      name: "Ketorolac",
      category: "NSAID",
      route: "IV",
      dose: "0.5",
      unit: "mg/kg/dose",
      frequency: "q6h",
      max: "30 mg/dose (15mg if <50kg)",
      notes: "Max 5 days. Avoid in renal impairment, bleeding risk",
      color: "green"
    },
    {
      name: "Ondansetron",
      category: "Antiemetic",
      route: "IV/PO",
      dose: "0.1-0.15",
      unit: "mg/kg/dose",
      frequency: "q8h PRN",
      max: "4 mg/dose (<40kg), 8 mg (>40kg)",
      notes: "For nausea/vomiting with opioids or post-op",
      color: "teal"
    }
  ];

  const calculateDose = (drug, weight) => {
    if (!weight) return null;
    const doseNum = parseFloat(drug.dose.split("-")[0]);
    const doseMax = parseFloat(drug.dose.split("-")[1]) || doseNum;
    
    if (drug.unit.includes("units")) {
      return `${(doseNum * weight / 1000).toFixed(0)}K - ${(doseMax * weight / 1000).toFixed(0)}K units`;
    } else if (drug.unit.includes("mcg")) {
      return `${(doseNum * weight).toFixed(1)} - ${(doseMax * weight).toFixed(1)} mcg`;
    }
    return `${(doseNum * weight).toFixed(0)} - ${(doseMax * weight).toFixed(0)} mg`;
  };

  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200",
    green: "bg-green-50 dark:bg-green-950/30 border-green-200",
    amber: "bg-amber-50 dark:bg-amber-950/30 border-amber-200",
    red: "bg-red-50 dark:bg-red-950/30 border-red-200",
    purple: "bg-purple-50 dark:bg-purple-950/30 border-purple-200",
    teal: "bg-teal-50 dark:bg-teal-950/30 border-teal-200",
    orange: "bg-orange-50 dark:bg-orange-950/30 border-orange-200",
  };

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Weight Input */}
      <Card className="nightingale-card border-indigo-200 dark:border-indigo-800">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Pill className="h-5 w-5 text-indigo-500" />
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Patient Weight (kg)</Label>
              <Input
                type="number"
                placeholder="Enter weight for dose calculations"
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="antibiotics">Antibiotics</TabsTrigger>
          <TabsTrigger value="analgesics">Analgesics</TabsTrigger>
        </TabsList>

        {/* Antibiotics Tab */}
        <TabsContent value="antibiotics" className="space-y-2 mt-4">
          {antibiotics.map((drug, idx) => (
            <Card key={idx} className={`border ${colorClasses[drug.color]} overflow-hidden`}>
              <CardContent className="pt-3 pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm break-words">{drug.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 whitespace-nowrap">{drug.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 break-words">
                      <span className="font-medium">{drug.route}:</span> {drug.dose} {drug.unit} {drug.frequency}
                    </p>
                    {w > 0 && (
                      <p className="font-mono text-sm text-indigo-600 dark:text-indigo-400 mt-1 break-words">
                        → {calculateDose(drug, w)} {drug.frequency}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs flex-shrink-0 max-w-[40%]">
                    <p className="text-muted-foreground break-words">Max: {drug.max}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 border-t pt-2 break-words">{drug.notes}</p>
              </CardContent>
            </Card>
          ))}

          {/* Reference */}
          <Card className="nightingale-card">
            <CardContent className="pt-3 text-xs text-muted-foreground">
              <p className="font-medium">References: Harriet Lane Handbook 23rd Ed, UCSF Pediatric Dosing</p>
              <p>• Adjust doses for renal/hepatic impairment</p>
              <p>• Monitor levels for aminoglycosides, vancomycin</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analgesics Tab */}
        <TabsContent value="analgesics" className="space-y-2 mt-4">
          {analgesics.map((drug, idx) => (
            <Card key={idx} className={`border ${colorClasses[drug.color]} overflow-hidden`}>
              <CardContent className="pt-3 pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm break-words">{drug.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 whitespace-nowrap">{drug.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 break-words">
                      <span className="font-medium">{drug.route}:</span> {drug.dose} {drug.unit} {drug.frequency}
                    </p>
                    {w > 0 && (
                      <p className="font-mono text-sm text-indigo-600 dark:text-indigo-400 mt-1 break-words">
                        → {calculateDose(drug, w)} {drug.frequency}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs flex-shrink-0 max-w-[40%]">
                    <p className="text-muted-foreground break-words">Max: {drug.max}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 border-t pt-2 break-words">{drug.notes}</p>
              </CardContent>
            </Card>
          ))}

          {/* Opioid Conversion Reference */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Opioid Equivalence</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>• Morphine IV 0.1 mg/kg ≈ Fentanyl IV 1-2 mcg/kg</p>
              <p>• Morphine PO:IV ratio = 3:1</p>
              <p>• Always use lowest effective dose, shortest duration</p>
            </CardContent>
          </Card>

          {/* Reference */}
          <Card className="nightingale-card">
            <CardContent className="pt-3 text-xs text-muted-foreground">
              <p className="font-medium">References: Harriet Lane Handbook 23rd Ed, Stanford Peds Pain</p>
              <p>• Start opioids at lowest dose, titrate to effect</p>
              <p>• Monitor sedation, respiratory rate, SpO2</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChildrenDashboard;
