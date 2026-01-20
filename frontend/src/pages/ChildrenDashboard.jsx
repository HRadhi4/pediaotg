/**
 * Children Dashboard - ER/Pediatric Ward Calculator
 * 
 * REFACTORED ARCHITECTURE:
 * This is the main dashboard component that handles navigation and layout.
 * Individual page components have been extracted to /pages/children/:
 * 
 * - BPPage.jsx (~510 lines) - Blood Pressure Calculator (Harriet Lane data)
 * - InfusionsPage.jsx (~160 lines) - IV Drug Calculations
 * - IntubationPage.jsx (~140 lines) - ETT Sizing & RSI Checklist
 * - ScoringPage.jsx (~465 lines) - GCS, PRAM, Westley, OI, IWL Calculators
 * - CPRPage.jsx (~465 lines) - PALS Algorithms & Drug Dosing
 * - ApproachesPage.jsx (~2600 lines) - Clinical Approach Algorithms (15 tabs)
 * - DrugsPage.jsx (~1880 lines) - Pediatric Drug Formulary
 * - FluidReplacementPage.jsx (~330 lines) - Fluid Calculations
 * 
 * Total: ~400 lines (down from ~5000 lines)
 * 
 * Features:
 * - Drag-and-drop widget reordering (persisted to localStorage)
 * - Favorite widgets (up to 4, persisted)
 * - Floating navigation bar with quick access dialogs
 * - URL-based page navigation (/children/:page)
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import BloodGasDialog from "@/components/BloodGasDialog";
import JaundiceDialog from "@/components/JaundiceDialog";
import GIRDialog from "@/components/GIRDialog";
import BloodProductsDialog from "@/components/BloodProductsDialog";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Import extracted page components
import DrugsPage from './children/DrugsPage';
import FluidReplacementPage from './children/FluidReplacementPage';
import BPPage from './children/BPPage';
import ElectrolytesInfusionsPage from './children/ElectrolytesInfusionsPage';
import IntubationPage from './children/IntubationPage';
import ScoringPage from './children/ScoringPage';
import CPRPage from './children/CPRPage';
import ApproachesPage from './children/ApproachesPage';

/**
 * SortableWidget - Drag-and-drop widget component
 * 
 * Uses @dnd-kit for drag functionality
 * Supports favorites (star icon) and edit mode (grip handle)
 */
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

/**
 * ChildrenDashboard - Main dashboard component
 * 
 * Handles:
 * - URL-based page routing (/children/:page)
 * - Widget grid with drag-and-drop reordering
 * - Floating navigation bar with quick access dialogs
 * - Edit mode for rearranging widgets
 */
const ChildrenDashboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { page } = useParams();
  
  // Use page directly from URL params
  const currentPage = page || "main";
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeId, setActiveId] = useState(null);
  
  // Widget order persisted to localStorage
  const [widgetOrder, setWidgetOrder] = useState(() => {
    const saved = localStorage.getItem("childrenWidgetOrder");
    return saved ? JSON.parse(saved) : ["fluidReplacement", "drugs", "bp", "infusions", "intubation", "scoring", "cpr", "approaches"];
  });
  
  // Favorites (max 4) persisted to localStorage
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

  // DnD sensors configuration
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
    else if (tab === "electrolytes") navigate("/children/infusions"); // Navigate to combined page
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

  /**
   * Widget definitions for main page
   * Each widget has: id, title, subtitle, icon, color, and search keywords
   */
  const widgetDefs = {
    bp: { id: "bp", title: "Blood Pressure", subtitle: "Age-based BP percentiles", icon: BloodPressureIcon, color: "red", keywords: ["hypertension", "systolic", "diastolic", "percentile", "boys", "girls", "map"] },
    infusions: { id: "infusions", title: "Electrolytes & Infusions", subtitle: "IV + Corrections + Drugs", icon: InfusionIcon, color: "blue", keywords: ["dopamine", "dobutamine", "adrenaline", "epinephrine", "sedation", "midazolam", "fentanyl", "inotrope", "electrolyte", "calcium", "potassium", "magnesium", "sodium", "phosphate", "bicarbonate", "correction"] },
    intubation: { id: "intubation", title: "Intubation", subtitle: "ETT + RSI Checklist", icon: IntubationIcon, color: "purple", keywords: ["ett", "tube", "airway", "rsi", "rapid sequence", "laryngoscope", "cuffed", "uncuffed"] },
    scoring: { id: "scoring", title: "Scoring/Calculators", subtitle: "GCS, PRAM, Westley, OI, IWL", icon: ScoringIcon, color: "amber", keywords: ["glasgow", "coma", "croup", "respiratory", "oxygenation", "pram", "westley", "iwl", "bsa", "insensible", "water loss"] },
    cpr: { id: "cpr", title: "CPR", subtitle: "PALS drugs & algorithms", icon: HeartIcon, color: "red", keywords: ["resuscitation", "pals", "arrest", "defibrillation", "epinephrine", "amiodarone", "adenosine", "tachycardia", "bradycardia", "vf", "vt", "asystole", "pea"] },
    approaches: { id: "approaches", title: "Approaches", subtitle: "DKA, SE, Hyperammonemia", icon: ApproachesIcon, color: "teal", keywords: ["diabetic", "ketoacidosis", "dka", "status epilepticus", "seizure", "convulsion", "hyperammonemia", "ammonia", "urea cycle", "phenytoin", "diazepam"] },
    drugs: { id: "drugs", title: "Drugs", subtitle: "Commonly used medications", icon: DrugsIcon, color: "purple", keywords: ["antibiotic", "analgesic", "paracetamol", "ibuprofen", "morphine", "amoxicillin", "ceftriaxone", "vancomycin", "gentamicin", "pain", "fever"] },
    fluidReplacement: { id: "fluidReplacement", title: "Fluid Replacement", subtitle: "Deficit + Maintenance", icon: FluidIcon, color: "teal", keywords: ["dehydration", "deficit", "maintenance", "holliday", "segar", "rehydration", "ivf", "fluids"] },
  };

  const widgets = widgetOrder.map(id => widgetDefs[id]).filter(Boolean);

  // Handle drag end - update order and persist
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

  // Color class mapping for widget icons
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

  /**
   * Page Router - renders the appropriate page component based on URL
   */
  const renderPage = () => {
    switch(currentPage) {
      case "bp":
        return <BPPage onBack={() => goToPage("main")} />;
      case "infusions":
        return <ElectrolytesInfusionsPage onBack={() => goToPage("main")} />;
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

  /**
   * Main page - widget grid with drag-and-drop
   */
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
      <main className="fixed top-[72px] bottom-0 left-0 right-0 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-full native-scroll pb-24">
          {renderPage()}
        </div>
      </main>

      {/* Floating Tab Bar - Quick access dialogs */}
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

export default ChildrenDashboard;
