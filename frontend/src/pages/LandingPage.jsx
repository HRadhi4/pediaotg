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
  BPIcon,
  InfusionIcon,
  IntubationIcon,
  ScoringIcon,
  CPRIcon,
  ApproachesIcon,
  FluidIcon,
  ResuscitationIcon,
  ETTIcon,
  RSIIcon,
  VitalSignsIcon,
  GrowthChartIcon,
  DrugsIcon,
  FluidReplacementIcon
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
    "nicu-ett": { id: "ett", title: "ETT/UAC/UVC", icon: "ett", color: "blue", dashboard: "nicu" },
    "nicu-rsi": { id: "rsi", title: "RSI Checklist", icon: "rsi", color: "purple", dashboard: "nicu" },
    "nicu-vitals": { id: "vitals", title: "Vital Signs", icon: "vitals", color: "amber", dashboard: "nicu" },
    "nicu-growth": { id: "growth", title: "Growth Charts", icon: "growth", color: "teal", dashboard: "nicu" },
    "nicu-drugs": { id: "drugs", title: "Drugs", icon: "drugs", color: "blue", dashboard: "nicu" }
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
      case "bp": return <BPIcon className={`h-5 w-5 ${colorClass}`} />;
      case "infusion": return <InfusionIcon className={`h-5 w-5 ${colorClass}`} />;
      case "intubation": return <IntubationIcon className={`h-5 w-5 ${colorClass}`} />;
      case "scoring": return <ScoringIcon className={`h-5 w-5 ${colorClass}`} />;
      case "cpr": return <CPRIcon className={`h-5 w-5 ${colorClass}`} />;
      case "approaches": return <ApproachesIcon className={`h-5 w-5 ${colorClass}`} />;
      case "fluid": return <FluidIcon className={`h-5 w-5 ${colorClass}`} />;
      case "fluidReplacement": return <FluidReplacementIcon className={`h-5 w-5 ${colorClass}`} />;
      case "nrp": return <ResuscitationIcon className={`h-5 w-5 ${colorClass}`} />;
      case "ett": return <ETTIcon className={`h-5 w-5 ${colorClass}`} />;
      case "rsi": return <RSIIcon className={`h-5 w-5 ${colorClass}`} />;
      case "vitals": return <VitalSignsIcon className={`h-5 w-5 ${colorClass}`} />;
      case "growth": return <GrowthChartIcon className={`h-5 w-5 ${colorClass}`} />;
      case "drugs": return <DrugsIcon className={`h-5 w-5 ${colorClass}`} />;
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
