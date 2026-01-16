import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Info, Home, Baby, Users, User, Shield, CreditCard, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const APP_VERSION = "1.0.0";

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
        <DialogContent className="max-w-md z-[70]">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#00d9c5]/10 flex items-center justify-center overflow-hidden p-1">
                <img src="/icon.svg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              Pediatrics On The Go
            </DialogTitle>
            <DialogDescription>Version {APP_VERSION}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
          </div>
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
