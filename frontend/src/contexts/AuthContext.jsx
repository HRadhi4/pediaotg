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

      // Clone the response before reading to avoid "body stream already read" error
      const responseClone = response.clone();
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails, try to get text from clone for debugging
        const textBody = await responseClone.text();
        console.error('Login response parsing error:', jsonError, 'Response text:', textBody);
        throw new Error('Server response error. Please try again.');
      }

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
      console.error('Login error:', error);
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

      // Clone the response before reading to avoid "body stream already read" error
      const responseClone = response.clone();
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const textBody = await responseClone.text();
        console.error('Signup response parsing error:', jsonError, 'Response text:', textBody);
        throw new Error('Server response error. Please try again.');
      }

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
      console.error('Signup error:', error);
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
      // Clear all auth state
      setUser(null);
      setTokens(null);
      localStorage.removeItem('auth_tokens');
      // Clear any other auth-related localStorage items
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Force a page reload to clear any cached state
      window.location.href = '/';
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

  // Function to manually set tokens (used after PayPal redirect)
  const updateTokens = (accessToken, refreshToken) => {
    const newTokens = {
      access_token: accessToken,
      refresh_token: refreshToken
    };
    setTokens(newTokens);
    localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
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
    tokens,
    setTokens: updateTokens  // Expose for PayPal redirect flow
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
