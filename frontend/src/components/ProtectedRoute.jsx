import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute - Wraps routes that require authentication
 * 
 * Checks:
 * 1. User is authenticated
 * 2. User has active subscription (or is admin)
 * 
 * Redirects:
 * - Not authenticated -> /login
 * - No subscription -> /pricing
 */
const ProtectedRoute = ({ children, requireSubscription = true }) => {
  const { isAuthenticated, hasSubscription, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[#00d9c5]" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin always has access
  if (isAdmin) {
    return children;
  }

  // Check subscription requirement
  if (requireSubscription && !hasSubscription) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
