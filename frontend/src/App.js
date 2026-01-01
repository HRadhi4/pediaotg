import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Main App Pages
import LandingPage from "@/pages/LandingPage";
import NICUCalculator from "@/pages/NICUCalculator";
import ChildrenDashboard from "@/pages/ChildrenDashboard";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";

// Subscription Pages
import PricingPage from "@/pages/subscription/PricingPage";
import SubscriptionSuccessPage from "@/pages/subscription/SuccessPage";
import SubscriptionCancelPage from "@/pages/subscription/CancelPage";
import AccountPage from "@/pages/subscription/AccountPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

import { Toaster } from "@/components/ui/sonner";

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
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Subscription Routes (Auth required, no subscription required) */}
            <Route path="/pricing" element={
              <PricingPage />
            } />
            <Route path="/subscription/success" element={
              <SubscriptionSuccessPage />
            } />
            <Route path="/subscription/cancel" element={
              <SubscriptionCancelPage />
            } />
            <Route path="/account" element={
              <ProtectedRoute requireSubscription={false}>
                <AccountPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireSubscription={false}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Protected App Routes (Auth + Subscription required) */}
            <Route path="/" element={
              <ProtectedRoute>
                <LandingPage theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            } />
            <Route path="/nicu" element={
              <ProtectedRoute>
                <NICUCalculator theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            } />
            <Route path="/nicu/:page" element={
              <ProtectedRoute>
                <NICUCalculator theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            } />
            <Route path="/children" element={
              <ProtectedRoute>
                <ChildrenDashboard theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            } />
            <Route path="/children/:page" element={
              <ProtectedRoute>
                <ChildrenDashboard theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </div>
  );
}

export default App;
