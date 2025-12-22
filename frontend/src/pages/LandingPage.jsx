import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Baby, Users, Moon, Sun, Droplets, FlaskConical, Home, Zap } from "lucide-react";
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
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'gradient-bg-dark' : 'gradient-bg-light'}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d9c5] to-[#00b3a0] flex items-center justify-center">
              <Baby className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-heading text-xl font-bold text-foreground tracking-tight">
              Pediatrics on the Go
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle"
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-600" />
            ) : (
              <Sun className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-4 md:px-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Select Department
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose your unit to access specialized calculators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NICU Card */}
            <div
              onClick={() => navigate("/nicu")}
              className="selection-card p-8 group"
              data-testid="nicu-card"
            >
              <div className="flex flex-col items-center text-center">
                <div className="icon-circle mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Baby className="h-8 w-8 text-[#00d9c5]" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  NICU
                </h3>
                <p className="text-muted-foreground">
                  Neonatal Intensive Care Unit
                </p>
                <div className="mt-4 px-4 py-2 rounded-full bg-[#00d9c5]/10 text-[#00d9c5] text-sm font-medium">
                  Fluid Calculator
                </div>
              </div>
            </div>

            {/* Children Card */}
            <div
              className="selection-card disabled p-8"
              data-testid="children-card"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 mb-6">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Children
                </h3>
                <p className="text-muted-foreground mb-3">
                  Pediatric Ward
                </p>
                <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-semibold text-gray-500">
                  Coming Soon
                </span>
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
    </div>
  );
};

export default LandingPage;
