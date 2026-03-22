import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLoadingScreen from "@/components/AppLoadingScreen";

// Main App Pages
import LandingPage from "@/pages/LandingPage";
import NICUCalculator from "@/pages/NICUCalculator";
import ChildrenDashboard from "@/pages/ChildrenDashboard";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// Subscription Pages
import PricingPage from "@/pages/subscription/PricingPage";
import SubscriptionSuccessPage from "@/pages/subscription/SuccessPage";
import SubscriptionCancelPage from "@/pages/subscription/CancelPage";
import AccountPage from "@/pages/subscription/AccountPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

import { Toaster } from "@/components/ui/sonner";
import { PWAUpdateBanner } from "@/components/PWAComponents";

// Inner app component that uses auth context
function AppRoutes({ theme, toggleTheme }) {
  const { loading, initialAuthComplete } = useAuth();

  // Show loading screen during initial auth check / auto-login
  if (!initialAuthComplete || loading) {
    return <AppLoadingScreen />;
  }

  return (
    <>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Subscription Routes (Auth required, no subscription required) */}
        <Route path="/pricing" element={<ProtectedRoute requireSubscription={false}><PricingPage /></ProtectedRoute>} />
        <Route path="/subscription/success" element={<ProtectedRoute requireSubscription={false}><SubscriptionSuccessPage /></ProtectedRoute>} />
        <Route path="/subscription/cancel" element={<ProtectedRoute requireSubscription={false}><SubscriptionCancelPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute requireSubscription={false}><AccountPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />

        {/* Main App Routes (Auth + Subscription required) */}
        <Route path="/nicu/*" element={<ProtectedRoute><NICUCalculator theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>} />
        <Route path="/children/*" element={<ProtectedRoute><ChildrenDashboard theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><LandingPage theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>} />
      </Routes>
      <Toaster position="top-right" />
      <PWAUpdateBanner />
    </>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes theme={theme} toggleTheme={toggleTheme} />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
