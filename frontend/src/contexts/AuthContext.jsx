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
  const [initialAuthComplete, setInitialAuthComplete] = useState(false);
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
          return true;
        } else {
          setUser(null);
          setTokens(null);
          localStorage.removeItem('auth_tokens');
          return false;
        }
      } else {
        setUser(null);
        setTokens(null);
        localStorage.removeItem('auth_tokens');
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
      setInitialAuthComplete(true);
    }
  }, [tokens]);

  // Auto-login with remembered credentials
  const attemptAutoLogin = useCallback(async () => {
    const remembered = localStorage.getItem('remembered_user');
    if (remembered) {
      try {
        const { email, password } = JSON.parse(remembered);
        if (email && password) {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (response.ok) {
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
            return true;
          } else {
            // Credentials invalid, clear remembered user
            localStorage.removeItem('remembered_user');
            return false;
          }
        }
      } catch (e) {
        console.error('Auto-login failed:', e);
        localStorage.removeItem('remembered_user');
        return false;
      }
    }
    return false;
  }, []);

  // Initial auth check on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // First, try to check existing auth (via cookies/tokens)
      const isAuthed = await checkAuth();
      
      // If not authenticated and we have remembered credentials, try auto-login
      if (!isAuthed) {
        const remembered = localStorage.getItem('remembered_user');
        if (remembered) {
          await attemptAutoLogin();
        }
      }
      
      setLoading(false);
      setInitialAuthComplete(true);
    };
    
    initAuth();
  }, []); // Only run once on mount

  const login = async (email, password, rememberMe = false) => {
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

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('remembered_user', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('remembered_user');
      }

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
    initialAuthComplete,
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
