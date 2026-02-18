import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Info, Home, Baby, Users, User, Shield, CreditCard, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const APP_VERSION = "1.0.0";

// All references collected from the app
const APP_REFERENCES = [
  // NICU References
  { category: "NICU - Resuscitation", source: "AHA/AAP Neonatal Resuscitation Guidelines 2025 (9th Edition)" },
  { category: "NICU - Jaundice", source: "AAP 2022 Clinical Practice Guideline - Pediatrics 2022;150(3):e2022058859" },
  { category: "NICU - Sepsis", source: "AAP Pediatrics 2024, Red Book 2024-2027, Surviving Sepsis Campaign Pediatric Guidelines 2024" },
  { category: "NICU - RDS", source: "2024 European Consensus Guidelines on RDS" },
  { category: "NICU - Hypoglycemia", source: "AAP 2024 Guidelines" },
  { category: "NICU - Anemia", source: "JAMA Network Open 2024, ETTNO/TOP Trials, Transfusion Medicine Reviews" },
  { category: "NICU - Apnea", source: "CAP Trial, MOMBABY 2023 Guidelines, Pediatrics" },
  { category: "NICU - Polycythemia", source: "UCSF 2023, CAHS Guidelines, Cochrane Review" },
  { category: "NICU - NEC", source: "NICHD NEC Working Group 2024, Wisconsin NEC Guidelines 2025, AAP/FDA/CDC/NIH Statement 2024" },
  { category: "NICU - PDA", source: "2024 Guidelines" },
  { category: "NICU - PPHN", source: "AAP/AHA 2025 Guidelines, MOMBABY PPHN Guidelines 2025" },
  { category: "NICU - Seizures", source: "2024 Guidelines" },
  { category: "NICU - BPD", source: "NICHD 2019 Jensen Definition, AAP NeoReviews 2024, AAP Pediatrics 2024" },
  { category: "NICU - CDH", source: "CDH EURO Consensus 2024, MOMBABY CDH Guidelines 2024, APSA Guidelines" },
  { category: "NICU - HIE", source: "AAP Pediatrics 2026 - Therapeutic Hypothermia for Neonatal HIE, AHA/AAP Neonatal Resuscitation 2025" },
  { category: "NICU - MAS", source: "NRP 2025 (9th Edition), ATS Guidelines, AAP Pediatrics 2024" },
  { category: "NICU - TTN", source: "AAP NeoReviews 2024, StatPearls 2024, UpToDate 2025" },
  { category: "NICU - Gastroschisis/Omphalocele", source: "2024 APSA Guidelines, J Pediatr Surg" },
  { category: "NICU - Drugs", source: "Neofax 2024" },
  { category: "NICU - Postnatal Care", source: "SMC Guidelines, AAP, UpToDate, WHO Postnatal Care" },
  { category: "NICU - Growth Charts", source: "WHO Child Growth Standards, CDC 2000 Growth Charts" },
  // Children References
  { category: "Children - PARDS", source: "PALICC Guidelines" },
  { category: "Children - DKA", source: "Saudi Booklet, SMC Guideline (Kingdom of Bahrain Ministry of Health)" },
  { category: "Children - DLOC", source: "SMC Neuro Guideline" },
  { category: "Children - Weakness/Gait", source: "SMC Neuro Guideline" },
  { category: "Children - IEM Emergencies", source: "SMC Guideline, UpToDate" },
  { category: "Children - NSAID Toxicity", source: "UpToDate Guidelines" },
  { category: "Children - Iron Toxicity", source: "UpToDate" },
  // General
  { category: "General", source: "Salmaniya Medical Complex (SMC) Clinical Guidelines" },
];

// Disclaimer Dialog for first-time users
const DisclaimerDialog = ({ open, onAgree }) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-heading flex items-center gap-2">
            <Info className="h-5 w-5 text-[#00d9c5]" />
            Medical Disclaimer
          </DialogTitle>
          <DialogDescription className="sr-only">
            Important medical disclaimer information about the use of this application
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-sm">
            <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
              This application is designed for use by <strong>qualified physicians</strong> and is based on multiple clinical guidelines, including <strong>Salmaniya Medical Complex guidelines</strong>.
            </p>
            <p className="text-amber-800 dark:text-amber-200 leading-relaxed mt-3">
              It is intended as a <strong>decision-support tool only</strong> and does not replace professional clinical judgment.
            </p>
            <p className="text-amber-700 dark:text-amber-300 leading-relaxed mt-3 font-medium">
              Use of this application is at the user&apos;s own risk.
            </p>
          </div>
          <Button 
            onClick={onAgree} 
            className="w-full nightingale-btn-primary text-lg py-6"
          >
            I Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Side Panel Component
const SidePanel = ({ isOpen, onClose, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAbout, setShowAbout] = useState(false);
  const { user, isAdmin, hasSubscription, logout } = useAuth();

  const menuItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "nicu", label: "NICU", icon: Baby, path: "/nicu" },
    { id: "children", label: "Children", icon: Users, path: "/children" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onClose();
  };

  // Get subscription status badge
  const getSubscriptionBadge = () => {
    if (isAdmin) {
      return <Badge className="bg-purple-100 text-purple-700 text-xs">Admin</Badge>;
    }
    if (!user) return null;
    
    const status = user.subscriptionStatus;
    const plan = user.subscriptionPlan;
    
    if (status === 'trial') {
      return <Badge className="bg-blue-100 text-blue-700 text-xs"><Clock className="h-3 w-3 mr-1" />Trial</Badge>;
    } else if (status === 'active') {
      return <Badge className="bg-green-100 text-green-700 text-xs capitalize">{plan}</Badge>;
    } else if (status === 'canceled') {
      return <Badge className="bg-amber-100 text-amber-700 text-xs">Canceled</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700 text-xs">Subscribe</Badge>;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-[60] transform transition-transform duration-300 shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00d9c5]/10 flex items-center justify-center overflow-hidden p-1">
                <img src="/icon.svg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-sm">Pediatrics On The Go</h2>
                <p className="text-xs text-muted-foreground">v{APP_VERSION}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {/* User Info */}
            {user && (
              <div className="p-3 mb-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00d9c5]/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#00d9c5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  {getSubscriptionBadge()}
                </div>
              </div>
            )}

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  location.pathname === item.path
                    ? "bg-[#00d9c5]/10 text-[#00d9c5]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Settings */}
          <div className="p-4 border-t space-y-2">
            {/* My Account */}
            <button
              onClick={() => handleNavigate('/account')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">My Account</span>
            </button>

            {/* Admin Dashboard (Admin Only) */}
            {isAdmin && (
              <button
                onClick={() => handleNavigate('/admin')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 transition-colors"
              >
                <Shield className="h-5 w-5" />
                <span className="font-medium">Admin Dashboard</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="font-medium">Dark Mode</span>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors ${
                theme === "dark" ? "bg-[#00d9c5]" : "bg-gray-300"
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${
                  theme === "dark" ? "translate-x-4.5 ml-4" : "translate-x-0.5 ml-0.5"
                }`} />
              </div>
            </button>

            {/* About */}
            <button
              onClick={() => setShowAbout(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Info className="h-5 w-5" />
              <span className="font-medium">About</span>
            </button>

            {/* Logout */}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About Dialog */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="max-w-md z-[70] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#00d9c5]/10 flex items-center justify-center overflow-hidden p-1">
                <img src="/icon.svg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              Pediatrics On The Go
            </DialogTitle>
            <DialogDescription>Version {APP_VERSION}</DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="disclaimer" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="disclaimer" className="text-xs">Disclaimer</TabsTrigger>
              <TabsTrigger value="about" className="text-xs">About Us</TabsTrigger>
              <TabsTrigger value="references" className="text-xs">References</TabsTrigger>
            </TabsList>
            
            {/* Disclaimer Tab */}
            <TabsContent value="disclaimer" className="flex-1 overflow-auto mt-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm">
                <p className="text-muted-foreground leading-relaxed">
                  This application is designed for use by <strong>qualified physicians</strong> and is based on multiple clinical guidelines, including <strong>Salmaniya Medical Complex guidelines</strong>.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  It is intended as a <strong>decision-support tool only</strong> and does not replace professional clinical judgment.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Use of this application is at the user&apos;s own risk.
                </p>
              </div>
            </TabsContent>
            
            {/* About Us Tab */}
            <TabsContent value="about" className="flex-1 overflow-auto mt-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-center space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  An app crafted by those who know pediatrics best — <strong>pediatricians themselves</strong>.
                </p>
                <div className="text-muted-foreground text-xs">
                  <p>For feedback or suggestions contact us through</p>
                  <a 
                    href="mailto:feedback@pedotg.com" 
                    className="text-[#00d9c5] hover:underline font-medium"
                  >
                    feedback@pedotg.com
                  </a>
                </div>
              </div>
            </TabsContent>
            
            {/* References Tab */}
            <TabsContent value="references" className="flex-1 overflow-auto mt-4">
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                {APP_REFERENCES.map((ref, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs">
                    <p className="font-medium text-[#00d9c5]">{ref.category}</p>
                    <p className="text-muted-foreground">{ref.source}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Main Layout Component
const Layout = ({ children, theme, toggleTheme, showNavBar = true, showHamburger = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("disclaimerAccepted") === "true";
    }
    return false;
  });

  const handleAgreeDisclaimer = () => {
    localStorage.setItem("disclaimerAccepted", "true");
    setDisclaimerAccepted(true);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg-dark' : 'gradient-bg-light'}`}>
      {/* Disclaimer for first-time users */}
      <DisclaimerDialog open={!disclaimerAccepted} onAgree={handleAgreeDisclaimer} />

      {/* Side Panel */}
      <SidePanel 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Hamburger Menu Button - Fixed */}
      {showHamburger && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Main Content */}
      {children}
    </div>
  );
};

export default Layout;
