import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Baby, Users, Droplets, FlaskConical, Home, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";
import JaundiceDialog from "@/components/JaundiceDialog";
import GIRDialog from "@/components/GIRDialog";
import BloodProductsDialog from "@/components/BloodProductsDialog";

// Custom Sun icon for Jaundice
const JaundiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

// Blood drop icon for Blood Products
const BloodDropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12Z"/>
    <path d="M12 12v-2"/>
    <path d="M12 16h.01"/>
  </svg>
);

const LandingPage = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [bloodGasOpen, setBloodGasOpen] = useState(false);
  const [electrolytesOpen, setElectrolytesOpen] = useState(false);
  const [jaundiceOpen, setJaundiceOpen] = useState(false);
  const [girOpen, setGirOpen] = useState(false);
  const [bloodProductsOpen, setBloodProductsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

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
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 pt-20 pb-32">
        {/* Department Selection - Stacked Rectangular Cards */}
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {/* NICU Card */}
          <div 
            onClick={() => navigate("/nicu")}
            className="selection-card group cursor-pointer"
          >
            <div className="flex items-center gap-5 p-6">
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
            className="selection-card group cursor-pointer"
          >
            <div className="flex items-center gap-5 p-6">
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
            <Home className="h-5 w-5" />
          </button>

          {/* Blood Gas */}
          <button
            onClick={() => handleTabClick("bloodgas")}
            className={`tab-item ${activeTab === "bloodgas" ? "active" : ""}`}
            data-testid="blood-gas-nav"
          >
            <Droplets className="h-5 w-5" />
          </button>

          {/* Electrolytes */}
          <button
            onClick={() => handleTabClick("electrolytes")}
            className={`tab-item ${activeTab === "electrolytes" ? "active" : ""}`}
            data-testid="electrolytes-nav"
          >
            <FlaskConical className="h-5 w-5" />
          </button>

          {/* Blood Products */}
          <button
            onClick={() => handleTabClick("bloodproducts")}
            className={`tab-item ${activeTab === "bloodproducts" ? "active" : ""}`}
            data-testid="blood-products-nav"
          >
            <span className={activeTab === "bloodproducts" ? "text-red-400" : ""}>
              <BloodDropIcon />
            </span>
          </button>

          {/* GIR - Glucose */}
          <button
            onClick={() => handleTabClick("gir")}
            className={`tab-item ${activeTab === "gir" ? "active" : ""}`}
            data-testid="gir-nav"
          >
            <Zap className="h-5 w-5" />
          </button>

          {/* Jaundice - Last */}
          <button
            onClick={() => handleTabClick("jaundice")}
            className={`tab-item ${activeTab === "jaundice" ? "active" : ""}`}
            data-testid="jaundice-nav"
          >
            <span className={activeTab === "jaundice" ? "text-amber-400" : ""}>
              <JaundiceIcon />
            </span>
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
