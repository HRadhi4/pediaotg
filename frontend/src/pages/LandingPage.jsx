import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Baby, Users, Star } from "lucide-react";
import Layout from "@/components/Layout";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";
import JaundiceDialog from "@/components/JaundiceDialog";
import GIRDialog from "@/components/GIRDialog";
import BloodProductsDialog from "@/components/BloodProductsDialog";
import { 
  HomeIcon, 
  BloodGasIcon, 
  ElectrolytesIcon, 
  BloodProductsIcon, 
  GIRIcon, 
  JaundiceNavIcon,
  BloodPressureIcon,
  InfusionIcon,
  IntubationIcon,
  ScoringIcon,
  HeartIcon,
  ApproachesIcon,
  FluidIcon,
  ResuscitationIcon,
  CatheterIcon,
  ActivityIcon,
  GrowthChartIcon,
  DrugsIcon,
  BallardIcon,
  PostnatalIcon,
  BloodDropIcon,
  ExchangeIcon
} from "@/components/HealthIcons";

const LandingPage = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [bloodGasOpen, setBloodGasOpen] = useState(false);
  const [electrolytesOpen, setElectrolytesOpen] = useState(false);
  const [jaundiceOpen, setJaundiceOpen] = useState(false);
  const [girOpen, setGirOpen] = useState(false);
  const [bloodProductsOpen, setBloodProductsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pediAssistFavorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Widget definitions for favorites display
  const allWidgets = {
    // Children Dashboard widgets
    "children-fluidReplacement": { id: "fluidReplacement", title: "Fluid Replacement", icon: "fluidReplacement", color: "blue", dashboard: "children" },
    "children-drugs": { id: "drugs", title: "Drugs", icon: "drugs", color: "purple", dashboard: "children" },
    "children-bp": { id: "bp", title: "Blood Pressure", icon: "bp", color: "red", dashboard: "children" },
    "children-infusions": { id: "infusions", title: "Infusions", icon: "infusion", color: "blue", dashboard: "children" },
    "children-intubation": { id: "intubation", title: "Intubation", icon: "intubation", color: "teal", dashboard: "children" },
    "children-scoring": { id: "scoring", title: "Scoring", icon: "scoring", color: "amber", dashboard: "children" },
    "children-cpr": { id: "cpr", title: "CPR", icon: "cpr", color: "red", dashboard: "children" },
    "children-approaches": { id: "approaches", title: "Approaches", icon: "approaches", color: "purple", dashboard: "children" },
    // NICU Dashboard widgets
    "nicu-fluid": { id: "fluid", title: "Fluid Calculator", icon: "fluid", color: "teal", dashboard: "nicu" },
    "nicu-nrp": { id: "nrp", title: "NRP Checklist", icon: "nrp", color: "red", dashboard: "nicu" },
    "nicu-catheter": { id: "catheter", title: "UVC/UAC Calculator", icon: "catheter", color: "blue", dashboard: "nicu" },
    "nicu-intubation": { id: "intubation", title: "Intubation", icon: "intubation", color: "purple", dashboard: "nicu" },
    "nicu-bp": { id: "bp", title: "Blood Pressure", icon: "bp", color: "red", dashboard: "nicu" },
    "nicu-prbc": { id: "prbc", title: "PRBC Transfusion", icon: "prbc", color: "red", dashboard: "nicu" },
    "nicu-exchange": { id: "exchange", title: "Exchange Transfusion", icon: "exchange", color: "purple", dashboard: "nicu" },
    "nicu-growth": { id: "growth", title: "Growth Charts", icon: "growth", color: "teal", dashboard: "nicu" },
    "nicu-drugs": { id: "drugs", title: "Drugs", icon: "drugs", color: "blue", dashboard: "nicu" },
    "nicu-ballard": { id: "ballard", title: "Ballard Score", icon: "ballard", color: "amber", dashboard: "nicu" },
    "nicu-postnatal": { id: "postnatal", title: "Postnatal", icon: "postnatal", color: "teal", dashboard: "nicu" },
    // Legacy keys for backwards compatibility
    "nicu-ett": { id: "catheter", title: "ETT/UAC/UVC", icon: "catheter", color: "blue", dashboard: "nicu" },
    "nicu-rsi": { id: "intubation", title: "RSI Checklist", icon: "intubation", color: "purple", dashboard: "nicu" },
    "nicu-vitals": { id: "bp", title: "Vital Signs", icon: "bp", color: "amber", dashboard: "nicu" }
  };

  const getWidgetIcon = (icon, color) => {
    const colorClasses = {
      teal: "text-[#00d9c5]",
      blue: "text-blue-500",
      red: "text-red-500",
      purple: "text-purple-500",
      amber: "text-amber-500"
    };
    const colorClass = colorClasses[color] || colorClasses.teal;
    
    switch(icon) {
      case "bp": return <BloodPressureIcon className={`h-5 w-5 ${colorClass}`} />;
      case "infusion": return <InfusionIcon className={`h-5 w-5 ${colorClass}`} />;
      case "intubation": return <IntubationIcon className={`h-5 w-5 ${colorClass}`} />;
      case "scoring": return <ScoringIcon className={`h-5 w-5 ${colorClass}`} />;
      case "cpr": return <HeartIcon className={`h-5 w-5 ${colorClass}`} />;
      case "approaches": return <ApproachesIcon className={`h-5 w-5 ${colorClass}`} />;
      case "fluid": return <FluidIcon className={`h-5 w-5 ${colorClass}`} />;
      case "fluidReplacement": return <FluidIcon className={`h-5 w-5 ${colorClass}`} />;
      case "nrp": return <ResuscitationIcon className={`h-5 w-5 ${colorClass}`} />;
      case "ett": return <CatheterIcon className={`h-5 w-5 ${colorClass}`} />;
      case "catheter": return <CatheterIcon className={`h-5 w-5 ${colorClass}`} />;
      case "rsi": return <IntubationIcon className={`h-5 w-5 ${colorClass}`} />;
      case "vitals": return <ActivityIcon className={`h-5 w-5 ${colorClass}`} />;
      case "growth": return <GrowthChartIcon className={`h-5 w-5 ${colorClass}`} />;
      case "drugs": return <DrugsIcon className={`h-5 w-5 ${colorClass}`} />;
      case "ballard": return <BallardIcon className={`h-5 w-5 ${colorClass}`} />;
      case "postnatal": return <PostnatalIcon className={`h-5 w-5 ${colorClass}`} />;
      case "prbc": return <BloodDropIcon className={`h-5 w-5 ${colorClass}`} />;
      case "exchange": return <ExchangeIcon className={`h-5 w-5 ${colorClass}`} />;
      default: return <Star className={`h-5 w-5 ${colorClass}`} />;
    }
  };

  const handleFavoriteClick = (favKey) => {
    const widget = allWidgets[favKey];
    if (widget) {
      navigate(`/${widget.dashboard}/${widget.id}`);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "bloodgas") setBloodGasOpen(true);
    else if (tab === "electrolytes") setElectrolytesOpen(true);
    else if (tab === "jaundice") setJaundiceOpen(true);
    else if (tab === "gir") setGirOpen(true);
    else if (tab === "bloodproducts") setBloodProductsOpen(true);
  };

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      {/* Main Content - Centered vertically between header and nav bar */}
      <main className="fixed inset-0 flex items-center justify-center px-4 md:px-6" style={{ top: '64px', bottom: '100px' }}>
        {/* Department Selection - Stacked Rectangular Cards */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* NICU Card */}
          <div 
            onClick={() => navigate("/nicu")}
            className="selection-card group cursor-pointer h-28"
          >
            <div className="flex items-center gap-5 p-6 h-full">
              <div className="w-16 h-16 rounded-2xl bg-[#00d9c5]/10 flex items-center justify-center group-hover:bg-[#00d9c5]/20 transition-colors flex-shrink-0">
                <Baby className="h-8 w-8 text-[#00d9c5]" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  NICU
                </h2>
                <p className="text-muted-foreground">
                  Neonatal Intensive Care Unit
                </p>
              </div>
            </div>
          </div>

          {/* Children Card */}
          <div 
            onClick={() => navigate("/children")}
            className="selection-card group cursor-pointer h-28"
          >
            <div className="flex items-center gap-5 p-6 h-full">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors flex-shrink-0">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Children
                </h2>
                <p className="text-muted-foreground">
                  Pediatric Ward
                </p>
              </div>
            </div>
          </div>

          {/* Quick Access Favorites */}
          {favorites.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-xs text-muted-foreground font-medium">Quick Access</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {favorites.slice(0, 4).map((favKey) => {
                  const widget = allWidgets[favKey];
                  if (!widget) return null;
                  return (
                    <div
                      key={favKey}
                      onClick={() => handleFavoriteClick(favKey)}
                      className="selection-card group cursor-pointer p-3 flex flex-col items-center gap-1.5 hover:scale-[1.02] transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        widget.color === 'teal' ? 'bg-[#00d9c5]/10' :
                        widget.color === 'blue' ? 'bg-blue-500/10' :
                        widget.color === 'red' ? 'bg-red-500/10' :
                        widget.color === 'purple' ? 'bg-purple-500/10' :
                        widget.color === 'amber' ? 'bg-amber-500/10' :
                        'bg-gray-500/10'
                      }`}>
                        {getWidgetIcon(widget.icon, widget.color)}
                      </div>
                      <span className="text-[10px] text-center font-medium text-muted-foreground leading-tight">
                        {widget.title}
                      </span>
                      <span className={`text-[8px] px-1 py-0.5 rounded ${
                        widget.dashboard === 'nicu' ? 'bg-[#00d9c5]/10 text-[#00d9c5]' : 'bg-purple-500/10 text-purple-500'
                      }`}>
                        {widget.dashboard === 'nicu' ? 'NICU' : 'Peds'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Tab Bar - 6 icons */}
      <nav className="floating-tab-bar">
        <div className="flex items-center gap-0.5">
          {/* Home */}
          <button
            onClick={() => setActiveTab("home")}
            className={`tab-item ${activeTab === "home" ? "active" : ""}`}
            data-testid="home-nav"
          >
            <HomeIcon className="h-5 w-5" />
          </button>

          {/* Blood Gas */}
          <button
            onClick={() => handleTabClick("bloodgas")}
            className={`tab-item ${activeTab === "bloodgas" ? "active" : ""}`}
            data-testid="blood-gas-nav"
          >
            <BloodGasIcon className="h-5 w-5" />
          </button>

          {/* Electrolytes */}
          <button
            onClick={() => handleTabClick("electrolytes")}
            className={`tab-item ${activeTab === "electrolytes" ? "active" : ""}`}
            data-testid="electrolytes-nav"
          >
            <ElectrolytesIcon className="h-5 w-5" />
          </button>

          {/* Blood Products */}
          <button
            onClick={() => handleTabClick("bloodproducts")}
            className={`tab-item ${activeTab === "bloodproducts" ? "active" : ""}`}
            data-testid="blood-products-nav"
          >
            <BloodProductsIcon className={`h-5 w-5 ${activeTab === "bloodproducts" ? "text-red-400" : ""}`} />
          </button>

          {/* GIR - Glucose */}
          <button
            onClick={() => handleTabClick("gir")}
            className={`tab-item ${activeTab === "gir" ? "active" : ""}`}
            data-testid="gir-nav"
          >
            <GIRIcon className="h-5 w-5" />
          </button>

          {/* Jaundice - Last */}
          <button
            onClick={() => handleTabClick("jaundice")}
            className={`tab-item ${activeTab === "jaundice" ? "active" : ""}`}
            data-testid="jaundice-nav"
          >
            <JaundiceNavIcon className={`h-5 w-5 ${activeTab === "jaundice" ? "text-amber-400" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Dialogs */}
      <BloodGasDialog open={bloodGasOpen} onOpenChange={(open) => { setBloodGasOpen(open); if (!open) setActiveTab("home"); }} />
      <ElectrolytesDialog open={electrolytesOpen} onOpenChange={(open) => { setElectrolytesOpen(open); if (!open) setActiveTab("home"); }} />
      <JaundiceDialog open={jaundiceOpen} onOpenChange={(open) => { setJaundiceOpen(open); if (!open) setActiveTab("home"); }} />
      <GIRDialog open={girOpen} onOpenChange={(open) => { setGirOpen(open); if (!open) setActiveTab("home"); }} />
      <BloodProductsDialog open={bloodProductsOpen} onOpenChange={(open) => { setBloodProductsOpen(open); if (!open) setActiveTab("home"); }} />
    </Layout>
  );
};

export default LandingPage;
