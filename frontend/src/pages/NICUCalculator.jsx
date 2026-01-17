/**
 * NICU Calculator Dashboard
 * 
 * Fully Refactored - All page components extracted to ./nicu/ directory
 */

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { 
  FluidIcon as HealthFluidIcon, 
  IntubationIcon as HealthIntubationIcon, 
  ActivityIcon as HealthActivityIcon, 
  BloodDropIcon as HealthBloodDropIcon, 
  ExchangeIcon as HealthExchangeIcon, 
  GrowthChartIcon as HealthGrowthIcon,
  ResuscitationIcon as HealthNRPIcon,
  CatheterIcon as HealthCatheterIcon,
  StethoscopeIcon as HealthStethoscopeIcon,
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
  DrugsIcon as HealthDrugsIcon,
  BallardIcon,
  PostnatalIcon,
  ApproachesIcon
} from "@/components/HealthIcons";
import { Card, CardContent } from "@/components/ui/card";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";
import JaundiceDialog from "@/components/JaundiceDialog";
import GIRDialog from "@/components/GIRDialog";
import BloodProductsDialog from "@/components/BloodProductsDialog";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// All page components - fully refactored
import { 
  FluidCalculatorPage,
  BallardScorePage,
  NRPChecklistPage, 
  CatheterCalculatorPage, 
  IntubationPage,
  PRBCGuidelinePage,
  ExchangeCalculatorPage,
  BloodPressurePage,
  GrowthChartPage,
  NICUDrugsPage,
  NICUApproachesPage,
  PostnatalPage
} from './nicu';

// Sortable Widget Component for NICU drag and drop
const SortableNICUWidget = ({ widget, isEditMode, onClick, getWidgetIcon, isFavorite, onToggleFavorite }) => {
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
      onClick={() => !isEditMode && !widget.comingSoon && onClick(widget.id)}
      className={`nightingale-card transition-all duration-200 h-36 ${
        isEditMode ? 'cursor-grab active:cursor-grabbing ring-2 ring-[#00d9c5]/30' : widget.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'
      } ${isDragging ? 'shadow-2xl scale-105' : ''} ${widget.comingSoon ? 'opacity-60' : ''}`}
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
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ 
              backgroundColor: widget.color === 'teal' ? 'rgba(0,217,197,0.1)' 
                : widget.color === 'red' ? 'rgba(239,68,68,0.1)'
                : widget.color === 'blue' ? 'rgba(59,130,246,0.1)'
                : widget.color === 'purple' ? 'rgba(168,85,247,0.1)'
                : widget.color === 'amber' ? 'rgba(245,158,11,0.1)'
                : 'rgba(107,114,128,0.1)'
            }}
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
  const scrollContainerRef = React.useRef(null);
  
  // Reset scroll position immediately when page changes (useLayoutEffect runs before paint)
  React.useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentPage]);
  
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
    { id: "growth", title: "Growth Charts", icon: "growth", color: "teal", enabled: true },
    { id: "drugs", title: "Drugs", icon: "drugs", color: "blue", enabled: true },
    { id: "ballard", title: "Ballard Score", icon: "ballard", color: "amber", enabled: true },
    { id: "postnatal", title: "Postnatal", icon: "postnatal", color: "teal", enabled: true },
    { id: "approaches", title: "Approaches", icon: "approaches", color: "purple", enabled: true }
  ]);
  
  // Favorites management
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("pediAssistFavorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Toggle favorite for a widget
  const toggleFavorite = (widgetId, e) => {
    e.stopPropagation();
    const favKey = `nicu-${widgetId}`;
    setFavorites(prev => {
      let newFavorites;
      if (prev.includes(favKey)) {
        newFavorites = prev.filter(f => f !== favKey);
      } else {
        if (prev.length >= 4) {
          newFavorites = [...prev.slice(1), favKey];
        } else {
          newFavorites = [...prev, favKey];
        }
      }
      localStorage.setItem("pediAssistFavorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (widgetId) => favorites.includes(`nicu-${widgetId}`);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Navigate to page - reset scroll before navigation
  const goToPage = (pageId) => {
    if (isEditMode) return;
    // Reset scroll position before navigation
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
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
      case "droplets": return <span className={colorClass}><HealthFluidIcon className="h-6 w-6" /></span>;
      case "catheter": return <span className={colorClass}><HealthCatheterIcon className="h-6 w-6" /></span>;
      case "intubation": return <span className={colorClass}><HealthIntubationIcon className="h-6 w-6" /></span>;
      case "activity": return <span className={colorClass}><HealthActivityIcon className="h-6 w-6" /></span>;
      case "blood": return <span className={colorClass}><HealthBloodDropIcon className="h-6 w-6" /></span>;
      case "repeat": return <span className={colorClass}><HealthExchangeIcon className="h-6 w-6" /></span>;
      case "nrp": return <span className={colorClass}><HealthNRPIcon className="h-6 w-6" /></span>;
      case "growth": return <span className={colorClass}><HealthGrowthIcon className="h-6 w-6" /></span>;
      case "drugs": return <span className={colorClass}><HealthDrugsIcon className="h-6 w-6" /></span>;
      case "ballard": return <span className={colorClass}><BallardIcon className="h-6 w-6" /></span>;
      case "postnatal": return <span className={colorClass}><PostnatalIcon className="h-6 w-6" /></span>;
      case "approaches": return <span className={colorClass}><ApproachesIcon className="h-6 w-6" /></span>;
      default: return <span className={colorClass}><HealthStethoscopeIcon className="h-6 w-6" /></span>;
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
              <ArrowLeftIcon className="h-5 w-5" />
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
                {isEditMode ? <CloseIcon className="h-5 w-5" /> : <SettingsIcon className="h-5 w-5" />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="fixed top-[72px] bottom-0 left-0 right-0 overflow-hidden">
        <div ref={scrollContainerRef} className="max-w-4xl mx-auto px-4 md:px-6 h-full native-scroll py-4 pb-24">
          {currentPage === "main" ? (
            <>
              {isEditMode && (
                <div className="mb-4 p-3 rounded-xl bg-[#00d9c5]/10 border border-[#00d9c5]/30 text-sm text-center flex items-center justify-center gap-2">
                  <GripIcon className="h-4 w-4 text-[#00d9c5]" />
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
                            const w = widgets.find(x => x.id === activeId);
                            if (!w) return null;
                            return (
                              <>
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                                  style={{ 
                                    backgroundColor: w.color === 'teal' ? 'rgba(0,217,197,0.1)' 
                                      : w.color === 'red' ? 'rgba(239,68,68,0.1)'
                                      : w.color === 'blue' ? 'rgba(59,130,246,0.1)'
                                      : w.color === 'purple' ? 'rgba(168,85,247,0.1)'
                                      : w.color === 'amber' ? 'rgba(245,158,11,0.1)'
                                      : 'rgba(107,114,128,0.1)'
                                  }}
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
              {currentPage === "drugs" && <NICUDrugsPage />}
              {currentPage === "ballard" && <BallardScorePage />}
              {currentPage === "approaches" && <NICUApproachesPage />}
              {currentPage === "postnatal" && <PostnatalPage />}
            </div>
          )}
        </div>
      </main>

      {/* Floating Tab Bar */}
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
    </div>
  );
};

export default NICUCalculator;
