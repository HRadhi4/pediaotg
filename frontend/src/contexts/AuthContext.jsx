import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(() => {
    // Load tokens from localStorage for mobile app support
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored) : null;
  });

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const headers = {};
      if (tokens?.access_token) {
        headers['Authorization'] = `Bearer ${tokens.access_token}`;
      }

      const response = await fetch(`${API_URL}/api/auth/check`, {
        method: 'GET',
        credentials: 'include',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser({
            id: data.user_id,
            email: data.email,
            name: data.name,
            isAdmin: data.is_admin,
            hasSubscription: data.has_subscription,
            subscriptionStatus: data.subscription_status,
            subscriptionPlan: data.subscription_plan
          });
        } else {
          setUser(null);
          setTokens(null);
          localStorage.removeItem('auth_tokens');
        }
      } else {
        setUser(null);
        setTokens(null);
        localStorage.removeItem('auth_tokens');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store tokens for mobile app support
      const newTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token
      };
      setTokens(newTokens);
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens));

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        isAdmin: data.user.is_admin,
        hasSubscription: data.user.has_active_subscription,
        subscriptionStatus: data.user.subscription_status,
        subscriptionPlan: data.user.subscription_plan,
        trialEndsAt: data.user.trial_ends_at,
        subscriptionRenewsAt: data.user.subscription_renews_at
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      // Store tokens
      const newTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token
      };
      setTokens(newTokens);
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens));

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        isAdmin: data.user.is_admin,
        hasSubscription: data.user.has_active_subscription,
        subscriptionStatus: data.user.subscription_status,
        subscriptionPlan: data.user.subscription_plan,
        trialEndsAt: data.user.trial_ends_at
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setTokens(null);
      localStorage.removeItem('auth_tokens');
    }
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  const getAuthHeaders = () => {
    if (tokens?.access_token) {
      return { 'Authorization': `Bearer ${tokens.access_token}` };
    }
    return {};
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    hasSubscription: user?.hasSubscription || user?.isAdmin || false,
    login,
    signup,
    logout,
    refreshAuth,
    getAuthHeaders,
    tokens
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
