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
  NICUDrugsPage
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
    { id: "postnatal", title: "Postnatal", icon: "postnatal", color: "teal", enabled: true, comingSoon: true },
    { id: "approaches", title: "Approaches", icon: "approaches", color: "purple", enabled: true, comingSoon: true }
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
      <main className="fixed top-[72px] bottom-[100px] left-0 right-0 overflow-hidden">
        <div ref={scrollContainerRef} className="max-w-4xl mx-auto px-4 md:px-6 h-full native-scroll py-4">
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
            <HealthGrowthIcon className="h-5 w-5 text-teal-500" />
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

// ==================== NICU DRUGS PAGE ====================
const NICUDrugsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weight, setWeight] = useState("");
  const [pma, setPma] = useState("");
  const [pna, setPna] = useState("");
  const [expandedDrug, setExpandedDrug] = useState(null);
  
  const w = parseFloat(weight) || 0;
  const pmaWeeks = parseFloat(pma) || 0;
  const pnaDays = parseFloat(pna) || 0;

  // Drug data from Neofax 2024
  const drugs = [
    {
      id: "ampicillin",
      name: "Ampicillin",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 25, unit: "mg/kg/dose" },
        gbs: { label: "GBS Bacteremia", value: 50, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 100, unit: "mg/kg/dose" }
      },
      quickViewDoses: ["gbs", "meningitis"],
      indication: "GBS, Listeria, susceptible gram-positive infections, meningitis",
      route: "IV slow push or IM",
      getDose: (w) => w > 0 ? ({
        standard: `${(25 * w).toFixed(1)} mg`,
        gbs: `${(50 * w).toFixed(1)} mg`,
        meningitis: `${(100 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-28 days", interval: "12h" },
        { pma: "≤29", pna: ">28 days", interval: "8h" },
        { pma: "30-36", pna: "0-14 days", interval: "12h" },
        { pma: "30-36", pna: ">14 days", interval: "8h" },
        { pma: "37-44", pna: "0-7 days", interval: "12h" },
        { pma: "37-44", pna: ">7 days", interval: "8h" },
        { pma: "≥45", pna: "ALL", interval: "6h" }
      ],
      notes: "Standard: 25 mg/kg. GBS bacteremia: 50 mg/kg. Meningitis: 75-100 mg/kg/dose."
    },
    {
      id: "gentamicin",
      name: "Gentamicin",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 4, unit: "mg/kg/dose" },
        synergy: { label: "GBS Synergy", value: 2.5, unit: "mg/kg/dose" }
      },
      indication: "Gram-negative infections, GBS synergy with ampicillin",
      route: "IV over 30 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(4 * w).toFixed(1)} mg`,
        synergy: `${(2.5 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-7 days", interval: "48h" },
        { pma: "≤29", pna: "8-28 days", interval: "36h" },
        { pma: "≤29", pna: "≥29 days", interval: "24h" },
        { pma: "30-34", pna: "0-7 days", interval: "36h" },
        { pma: "30-34", pna: "≥8 days", interval: "24h" },
        { pma: "≥35", pna: "ALL", interval: "24h" }
      ],
      notes: "Standard: 4-5 mg/kg. GBS synergy: 2.5 mg/kg. Target peak: 5-12, trough <1."
    },
    {
      id: "vancomycin",
      name: "Vancomycin",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 15, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 15, unit: "mg/kg/dose" }
      },
      indication: "Serious MRSA infections, Anthrax, CNS infections",
      route: "IV infusion over 60 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(15 * w).toFixed(1)} mg`,
        meningitis: `${(15 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-14 days", interval: "18h" },
        { pma: "≤29", pna: ">14 days", interval: "12h" },
        { pma: "30-36", pna: "0-14 days", interval: "12h" },
        { pma: "30-36", pna: ">14 days", interval: "8h" },
        { pma: "37-44", pna: "0-7 days", interval: "12h" },
        { pma: "37-44", pna: ">7 days", interval: "8h" },
        { pma: "≥45", pna: "ALL", interval: "6h" }
      ],
      notes: "Target trough: 10-20 mcg/mL (standard), 15-20 mcg/mL (CNS). Monitor renal function."
    },
    {
      id: "amikacin",
      name: "Amikacin",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 15, unit: "mg/kg/dose" }
      },
      indication: "Gram-negative infections, aminoglycoside-resistant organisms",
      route: "IV over 30 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(15 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-7 days", interval: "48h" },
        { pma: "≤29", pna: "8-28 days", interval: "36h" },
        { pma: "≤29", pna: "≥29 days", interval: "24h" },
        { pma: "30-34", pna: "0-7 days", interval: "36h" },
        { pma: "30-34", pna: "≥8 days", interval: "24h" },
        { pma: "≥35", pna: "ALL", interval: "24h" }
      ],
      notes: "Target: peak >24 mg/L, trough <5 mg/L. Prolong interval by 10h if on ibuprofen."
    },
    {
      id: "cefotaxime",
      name: "Cefotaxime",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 50, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 50, unit: "mg/kg/dose q6-8h" }
      },
      indication: "Gram-negative sepsis, meningitis, gonococcal infections",
      route: "IV over 30 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(50 * w).toFixed(1)} mg`,
        meningitis: `${(50 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-28 days", interval: "12h" },
        { pma: "≤29", pna: ">28 days", interval: "8h" },
        { pma: "30-36", pna: "0-14 days", interval: "12h" },
        { pma: "30-36", pna: ">14 days", interval: "8h" },
        { pma: "37-44", pna: "0-7 days", interval: "12h" },
        { pma: "37-44", pna: ">7 days", interval: "8h" },
        { pma: "≥45", pna: "ALL", interval: "6h" }
      ],
      notes: "Meningitis: q6h dosing (150-200 mg/kg/day). Good CSF penetration."
    },
    {
      id: "caffeine",
      name: "Caffeine Citrate",
      category: "Stimulant",
      doses: {
        loading: { label: "Loading", value: 20, unit: "mg/kg" },
        maintenance: { label: "Maintenance", value: 5, unit: "mg/kg/day" }
      },
      indication: "Apnea of prematurity (28-33 weeks)",
      route: "IV over 30 min or PO",
      getDose: (w) => w > 0 ? ({
        loading: `${(20 * w).toFixed(1)} mg`,
        maintenance: `${(5 * w).toFixed(1)}-${(10 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "Loading", interval: "Once" },
        { pma: "ALL", pna: "Maintenance", interval: "24h" }
      ],
      notes: "Start maintenance 24h after loading dose. Monitor for tachycardia, irritability."
    },
    {
      id: "ceftazidime",
      name: "Ceftazidime",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 30, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 50, unit: "mg/kg/dose" }
      },
      indication: "Gram-negative sepsis/meningitis, Pseudomonas",
      route: "IV infusion or IM",
      getDose: (w) => w > 0 ? ({
        standard: `${(30 * w).toFixed(1)} mg`,
        meningitis: `${(50 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-28 days", interval: "12h" },
        { pma: "≤29", pna: ">28 days", interval: "8h" },
        { pma: "30-36", pna: "0-14 days", interval: "12h" },
        { pma: "30-36", pna: ">14 days", interval: "8h" },
        { pma: "37-44", pna: "0-7 days", interval: "12h" },
        { pma: "37-44", pna: ">7 days", interval: "8h" },
        { pma: "≥45", pna: "ALL", interval: "8h" }
      ],
      notes: "Meningitis: 100-150 mg/kg/day divided. May mix with 1% lidocaine for IM."
    },
    {
      id: "meropenem",
      name: "Meropenem",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 20, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 40, unit: "mg/kg/dose" }
      },
      indication: "Severe infections, meningitis, multidrug-resistant organisms",
      route: "IV infusion over 30 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(20 * w).toFixed(1)} mg`,
        meningitis: `${(40 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "<32", pna: "<14 days", interval: "12h" },
        { pma: "<32", pna: "≥14 days", interval: "8h" },
        { pma: "≥32", pna: "<14 days", interval: "8h" },
        { pma: "≥32", pna: "≥14 days", interval: "8h" }
      ],
      notes: "Meningitis: 40 mg/kg/dose. Non-CNS: 20 mg/kg/dose. Broad spectrum carbapenem."
    },
    {
      id: "metronidazole",
      name: "Metronidazole",
      category: "Antibiotic",
      doses: {
        loading: { label: "Loading", value: 15, unit: "mg/kg" },
        maintenance: { label: "Maintenance", value: 7.5, unit: "mg/kg/dose" }
      },
      indication: "Anaerobic infections, NEC, surgical prophylaxis",
      route: "IV over 60 min or PO",
      getDose: (w) => w > 0 ? ({
        loading: `${(15 * w).toFixed(1)} mg`,
        maintenance: `${(7.5 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "ALL", interval: "48h" },
        { pma: "30-36", pna: "ALL", interval: "24h" },
        { pma: "37-44", pna: "ALL", interval: "12h" },
        { pma: "≥45", pna: "ALL", interval: "8h" }
      ],
      notes: "Surgical prophylaxis: 15 mg/kg single dose 60 min before incision."
    },
    {
      id: "acyclovir",
      name: "Acyclovir",
      category: "Antiviral",
      doses: {
        skin: { label: "Skin/Eye/Mouth", value: 20, unit: "mg/kg/dose" },
        cns: { label: "CNS/Disseminated", value: 20, unit: "mg/kg/dose q8h" }
      },
      indication: "HSV infection - skin/eye/mouth, CNS, disseminated",
      route: "IV infusion over 60 min",
      getDose: (w) => w > 0 ? ({
        skin: `${(20 * w).toFixed(1)} mg`,
        cns: `${(20 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "SEM disease", interval: "8h x 14 days" },
        { pma: "ALL", pna: "CNS disease", interval: "8h x 21 days" },
        { pma: "ALL", pna: "Disseminated", interval: "8h x 21 days" }
      ],
      notes: "SEM: 14 days. CNS/Disseminated: 21 days. Follow with suppressive therapy."
    },
    {
      id: "fluconazole",
      name: "Fluconazole",
      category: "Antifungal",
      doses: {
        prophylaxis: { label: "Prophylaxis", value: 3, unit: "mg/kg/dose" },
        treatment: { label: "Treatment", value: 12, unit: "mg/kg/dose" }
      },
      indication: "Candida prophylaxis, candidiasis treatment",
      route: "IV over 30 min or PO",
      getDose: (w) => w > 0 ? ({
        prophylaxis: `${(3 * w).toFixed(1)} mg`,
        treatment: `${(12 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "Prophylaxis", interval: "72h" },
        { pma: "<30", pna: "Treatment", interval: "72h" },
        { pma: "≥30", pna: "Treatment", interval: "48h" }
      ],
      notes: "Prophylaxis: 3-6 mg/kg twice weekly. Treatment: 12 mg/kg loading then maintenance."
    },
    {
      id: "hydrochlorothiazide",
      name: "Hydrochlorothiazide",
      category: "Diuretic",
      doses: {
        standard: { label: "Standard", value: 2, unit: "mg/kg/dose" }
      },
      indication: "BPD, edema, hypertension, heart failure",
      route: "PO",
      getDose: (w) => w > 0 ? ({
        standard: `${(1 * w).toFixed(1)}-${(2 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "ALL", interval: "12h" }
      ],
      notes: "Give with food. Monitor K+, glucose, uric acid. Contraindicated in renal/hepatic impairment."
    },
    {
      id: "spironolactone",
      name: "Spironolactone",
      category: "Diuretic",
      doses: {
        standard: { label: "Standard", value: 2, unit: "mg/kg/dose" }
      },
      indication: "BPD, heart failure, pulmonary hypertension",
      route: "PO",
      getDose: (w) => w > 0 ? ({
        standard: `${(1 * w).toFixed(1)}-${(3 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "ALL", interval: "24h" }
      ],
      notes: "Potassium-sparing. Often combined with thiazides. Monitor K+."
    }
  ];

  const filteredDrugs = drugs.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.indication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIntervalForPatient = (drug) => {
    if (!pmaWeeks && pmaWeeks !== 0) return null;
    
    for (const row of drug.intervalTable) {
      // Check PMA match
      let pmaMatch = false;
      const pmaStr = row.pma;
      
      if (pmaStr === "ALL") {
        pmaMatch = true;
      } else if (pmaStr.startsWith("≤")) {
        const val = parseInt(pmaStr.replace("≤", ""));
        pmaMatch = pmaWeeks <= val;
      } else if (pmaStr.startsWith("<")) {
        const val = parseInt(pmaStr.replace("<", ""));
        pmaMatch = pmaWeeks < val;
      } else if (pmaStr.startsWith("≥")) {
        const val = parseInt(pmaStr.replace("≥", ""));
        pmaMatch = pmaWeeks >= val;
      } else if (pmaStr.startsWith(">")) {
        const val = parseInt(pmaStr.replace(">", ""));
        pmaMatch = pmaWeeks > val;
      } else if (pmaStr.includes("-")) {
        const parts = pmaStr.match(/(\d+)-(\d+)/);
        if (parts) {
          const minPma = parseInt(parts[1]);
          const maxPma = parseInt(parts[2]);
          pmaMatch = pmaWeeks >= minPma && pmaWeeks <= maxPma;
        }
      } else {
        const val = parseInt(pmaStr);
        pmaMatch = pmaWeeks === val;
      }
      
      if (!pmaMatch) continue;
      
      // Check PNA match
      const pnaStr = row.pna;
      let pnaMatch = false;
      
      if (pnaStr === "ALL" || pnaStr === "Loading" || pnaStr === "Maintenance" || 
          pnaStr === "SEM disease" || pnaStr === "CNS disease" || pnaStr === "Disseminated" ||
          pnaStr === "Prophylaxis" || pnaStr === "Treatment") {
        pnaMatch = true;
      } else if (pnaStr.startsWith("≥")) {
        const val = parseInt(pnaStr.match(/\d+/)?.[0] || "0");
        pnaMatch = pnaDays >= val;
      } else if (pnaStr.startsWith(">")) {
        const val = parseInt(pnaStr.match(/\d+/)?.[0] || "0");
        pnaMatch = pnaDays > val;
      } else if (pnaStr.startsWith("≤")) {
        const val = parseInt(pnaStr.match(/\d+/)?.[0] || "0");
        pnaMatch = pnaDays <= val;
      } else if (pnaStr.startsWith("<")) {
        const val = parseInt(pnaStr.match(/\d+/)?.[0] || "0");
        pnaMatch = pnaDays < val;
      } else if (pnaStr.includes("-")) {
        const parts = pnaStr.match(/(\d+)-(\d+)/);
        if (parts) {
          const minPna = parseInt(parts[1]);
          const maxPna = parseInt(parts[2]);
          pnaMatch = pnaDays >= minPna && pnaDays <= maxPna;
        }
      }
      
      if (pmaMatch && pnaMatch) {
        return row.interval;
      }
    }
    
    return null;
  };

  return (
    <div className="space-y-4 pt-4 pb-24">
      {/* Search and Patient Info */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search drugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Patient Parameters */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">Weight (kg)</Label>
              <Input
                type="number"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="font-mono text-sm h-9"
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">PMA (weeks)</Label>
              <Input
                type="number"
                placeholder="wks"
                value={pma}
                onChange={(e) => setPma(e.target.value)}
                className="font-mono text-sm h-9"
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">PNA (days)</Label>
              <Input
                type="number"
                placeholder="days"
                value={pna}
                onChange={(e) => setPna(e.target.value)}
                className="font-mono text-sm h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drug List */}
      <div className="space-y-2">
        {filteredDrugs.map((drug) => {
          const calculatedDoses = drug.getDose(w);
          const interval = getIntervalForPatient(drug);
          const isExpanded = expandedDrug === drug.id;
          const doseKeys = drug.doses ? Object.keys(drug.doses) : [];
          // Use quickViewDoses if specified, otherwise show first 2 doses
          const quickViewKeys = drug.quickViewDoses || doseKeys.slice(0, 2);
          
          return (
            <Card 
              key={drug.id} 
              className="nightingale-card cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              onClick={() => setExpandedDrug(isExpanded ? null : drug.id)}
            >
              <CardContent className="p-3">
                {/* Drug Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{drug.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                        {drug.category}
                      </span>
                    </div>
                    {/* Show dose types - only quickViewDoses */}
                    {drug.doses && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {quickViewKeys.map(key => drug.doses[key] && (
                          <span key={key} className="text-[9px] px-1 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            {drug.doses[key].label}: {drug.doses[key].value} {drug.doses[key].unit}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {calculatedDoses && w > 0 && (
                    <div className="text-right ml-2">
                      <div className="space-y-0.5">
                        {quickViewKeys.map(key => calculatedDoses[key] && (
                          <p key={key} className="text-[11px] font-mono">
                            <span className="text-muted-foreground">{drug.doses[key].label}:</span>{' '}
                            <span className="font-bold text-blue-600">{calculatedDoses[key]}</span>
                          </p>
                        ))}
                      </div>
                      {interval && <p className="text-[10px] text-muted-foreground mt-0.5">q{interval}</p>}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    {/* Calculated Doses Table */}
                    {calculatedDoses && w > 0 && (
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Calculated Doses ({w}kg)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {doseKeys.map(key => (
                            <div key={key} className="p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                              <p className="text-[10px] text-muted-foreground">{drug.doses[key].label}</p>
                              <p className="font-mono font-bold text-blue-600">{calculatedDoses[key]}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Indication */}
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Indication</p>
                      <p className="text-xs">{drug.indication}</p>
                    </div>
                    
                    {/* Route */}
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Route</p>
                      <p className="text-xs">{drug.route}</p>
                    </div>

                    {/* Dosing Interval Table */}
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Dosing Interval</p>
                      <div className="overflow-x-auto -mx-1">
                        <table className="w-full text-[10px] min-w-[250px]">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                              <th className="text-left py-1.5 px-2 font-medium">PMA (wks)</th>
                              <th className="text-left py-1.5 px-2 font-medium">PNA</th>
                              <th className="text-center py-1.5 px-2 font-medium">Interval</th>
                            </tr>
                          </thead>
                          <tbody>
                            {drug.intervalTable.map((row, idx) => (
                              <tr key={idx} className="border-t border-gray-100 dark:border-gray-800">
                                <td className="py-1.5 px-2">{row.pma}</td>
                                <td className="py-1.5 px-2">{row.pna}</td>
                                <td className="py-1.5 px-2 text-center font-mono font-medium">{row.interval}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-[10px] text-muted-foreground">
                      <p className="font-medium text-foreground mb-0.5">Notes:</p>
                      <p>{drug.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDrugs.length === 0 && (
        <Card className="nightingale-card">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground text-sm">No drugs found matching &quot;{searchTerm}&quot;</p>
          </CardContent>
        </Card>
      )}

      {/* Reference */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Reference: Neofax 2024</p>
          <p>• PMA = Postmenstrual Age (gestational age + postnatal age)</p>
          <p>• PNA = Postnatal Age (days since birth)</p>
          <p>• Always verify doses and adjust based on renal/hepatic function</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NICUCalculator;
