import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Droplets, FlaskConical, Zap } from "lucide-react";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";
import JaundiceDialog from "@/components/JaundiceDialog";
import GIRDialog from "@/components/GIRDialog";
import BloodProductsDialog from "@/components/BloodProductsDialog";

// Custom icons
const JaundiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const BloodDropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12Z"/>
    <path d="M12 12v-2"/><path d="M12 16h.01"/>
  </svg>
);

const FloatingNavBar = ({ showHome = true }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [isRetracted, setIsRetracted] = useState(false);
  const [bloodGasOpen, setBloodGasOpen] = useState(false);
  const [electrolytesOpen, setElectrolytesOpen] = useState(false);
  const [jaundiceOpen, setJaundiceOpen] = useState(false);
  const [girOpen, setGirOpen] = useState(false);
  const [bloodProductsOpen, setBloodProductsOpen] = useState(false);

  // Reset retract timer on interaction
  const resetTimer = useCallback(() => {
    setIsRetracted(false);
  }, []);

  useEffect(() => {
    let timer;
    
    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsRetracted(true);
      }, 3000);
    };

    // Start initial timer
    startTimer();

    // Reset timer on any touch/mouse activity
    const handleActivity = () => {
      resetTimer();
      startTimer();
    };

    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("scroll", handleActivity);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [resetTimer]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsRetracted(false);
    if (tab === "bloodgas") setBloodGasOpen(true);
    else if (tab === "electrolytes") setElectrolytesOpen(true);
    else if (tab === "jaundice") setJaundiceOpen(true);
    else if (tab === "gir") setGirOpen(true);
    else if (tab === "bloodproducts") setBloodProductsOpen(true);
    else if (tab === "home") navigate("/");
  };

  const handleNavBarClick = () => {
    if (isRetracted) {
      setIsRetracted(false);
    }
  };

  return (
    <>
      <nav 
        className={`floating-tab-bar ${isRetracted ? 'retracted' : 'expanded'}`}
        onClick={handleNavBarClick}
      >
        <div className="flex items-center gap-0">
          {showHome && (
            <button onClick={() => handleTabClick("home")} className={`tab-item ${activeTab === "home" ? "active" : ""}`}>
              <Home className="h-5 w-5" />
            </button>
          )}
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

      {/* Dialogs */}
      <BloodGasDialog open={bloodGasOpen} onOpenChange={(open) => { setBloodGasOpen(open); if (!open) setActiveTab(""); }} />
      <ElectrolytesDialog open={electrolytesOpen} onOpenChange={(open) => { setElectrolytesOpen(open); if (!open) setActiveTab(""); }} />
      <JaundiceDialog open={jaundiceOpen} onOpenChange={(open) => { setJaundiceOpen(open); if (!open) setActiveTab(""); }} />
      <GIRDialog open={girOpen} onOpenChange={(open) => { setGirOpen(open); if (!open) setActiveTab(""); }} />
      <BloodProductsDialog open={bloodProductsOpen} onOpenChange={(open) => { setBloodProductsOpen(open); if (!open) setActiveTab(""); }} />
    </>
  );
};

export default FloatingNavBar;
