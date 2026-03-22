import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute - Wraps routes that require authentication
 * 
 * Props:
 * - requireAdmin (boolean, default false): If true, only admin users can access
 * - requireSubscription (boolean, default true): If true, requires active subscription
 * 
 * Logic order:
 * 1. If loading, show loading UI
 * 2. If not authenticated, redirect to /login
 * 3. If requireAdmin and not admin, redirect to / (home)
 * 4. If admin, allow access immediately (admin bypasses subscription checks)
 * 5. If requireSubscription and no subscription, redirect to /pricing
 * 6. Otherwise, allow access
 * 
 * Redirects:
 * - Not authenticated -> /login
 * - Not admin (when requireAdmin) -> /
 * - No subscription (when requireSubscription) -> /pricing
 */
const ProtectedRoute = ({ children, requireAdmin = false, requireSubscription = true }) => {
  const { isAuthenticated, hasSubscription, loading, isAdmin } = useAuth();
  const location = useLocation();

  // 1. Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[#00d9c5]" />
      </div>
    );
  }

  // 2. Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Admin route but user is not admin - redirect to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 4. Admin always has access (bypasses subscription checks)
  if (isAdmin) {
    return children;
  }

  // 5. Check subscription requirement for non-admin users
  if (requireSubscription && !hasSubscription) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  // 6. Allow access
  return children;
};

export default ProtectedRoute;
