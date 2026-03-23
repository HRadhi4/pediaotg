import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { secureSet, secureGet, secureRemove, isSecureStorageAvailable } from '@/lib/secureStorage';
import { getDeviceId, getDeviceIdHeaders } from '@/lib/deviceId';
import { getApiUrl, debugApiConfig, isNetworkError } from '@/config/api';

// Run debug logging immediately
if (typeof window !== 'undefined') {
  // Small delay to ensure window.location is fully available
  setTimeout(() => debugApiConfig(), 0);
}

// Storage keys
const STORAGE_KEYS = {
  REMEMBERED_USER: 'pedotg_remembered_user',
  CACHED_USER: 'pedotg_cached_user',
  AUTH_TOKENS: 'auth_tokens'
};

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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [tokens, setTokens] = useState(() => {
    // Load tokens from localStorage for mobile app support
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_TOKENS);
    return stored ? JSON.parse(stored) : null;
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache user data for offline access
  const cacheUserData = useCallback(async (userData) => {
    if (userData && isSecureStorageAvailable()) {
      await secureSet(STORAGE_KEYS.CACHED_USER, userData);
    }
  }, []);

  // Load cached user data for offline mode
  const loadCachedUser = useCallback(async () => {
    if (isSecureStorageAvailable()) {
      const cached = await secureGet(STORAGE_KEYS.CACHED_USER);
      return cached;
    }
    return null;
  }, []);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    // If offline, try to use cached user data
    if (!navigator.onLine) {
      console.log('[Auth] checkAuth: offline, loading cached user');
      const cachedUser = await loadCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
        return true;
      }
      return false;
    }

    try {
      const headers = {};
      if (tokens?.access_token) {
        headers['Authorization'] = `Bearer ${tokens.access_token}`;
      }

      const response = await fetch(`${getApiUrl()}/api/auth/check`, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          const userData = {
            id: data.user_id,
            email: data.email,
            name: data.name,
            isAdmin: data.is_admin,
            hasSubscription: data.has_subscription,
            subscriptionStatus: data.subscription_status,
            subscriptionPlan: data.subscription_plan
          };
          setUser(userData);
          // Cache for offline use
          await cacheUserData(userData);
          return true;
        } else {
          setUser(null);
          setTokens(null);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
          return false;
        }
      } else {
        setUser(null);
        setTokens(null);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // If network error (likely offline), try cached data
      console.log('[Auth] Network error, trying cached user');
      const cachedUser = await loadCachedUser();
      if (cachedUser) {
        console.log('[Auth] Using cached user after network error');
        setUser(cachedUser);
        return true;
      }
      setUser(null);
      return false;
    }
  }, [tokens, loadCachedUser, cacheUserData]);

  // Auto-login with remembered credentials (encrypted)
  const attemptAutoLogin = useCallback(async () => {
    // If offline, we can't make login API call, but we can use cached user
    if (!navigator.onLine) {
      console.log('[Auth] attemptAutoLogin: offline, loading cached user');
      const cachedUser = await loadCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
        return true;
      }
      return false;
    }

    if (!isSecureStorageAvailable()) {
      return false;
    }

    const remembered = await secureGet(STORAGE_KEYS.REMEMBERED_USER);
    if (remembered) {
      try {
        const { email, password } = remembered;
        if (email && password) {
          console.log('[Auth] Attempting auto-login with saved credentials');
          const response = await fetch(`${getApiUrl()}/api/auth/login`, {
            method: 'POST',
            headers: getDeviceIdHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (response.ok) {
            const newTokens = {
              access_token: data.access_token,
              refresh_token: data.refresh_token
            };
            setTokens(newTokens);
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(newTokens));

            const userData = {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              isAdmin: data.user.is_admin,
              hasSubscription: data.user.has_active_subscription,
              subscriptionStatus: data.user.subscription_status,
              subscriptionPlan: data.user.subscription_plan,
              trialEndsAt: data.user.trial_ends_at,
              subscriptionRenewsAt: data.user.subscription_renews_at
            };
            setUser(userData);
            // Cache for offline use
            await cacheUserData(userData);
            console.log('[Auth] Auto-login successful');
            return true;
          } else {
            // Credentials invalid, clear remembered user
            console.log('[Auth] Auto-login failed - invalid credentials');
            await secureRemove(STORAGE_KEYS.REMEMBERED_USER);
            return false;
          }
        }
      } catch (e) {
        console.error('Auto-login failed:', e);
        // If network error, try cached user
        console.log('[Auth] Network error during auto-login, trying cached user');
        const cachedUser = await loadCachedUser();
        if (cachedUser) {
          setUser(cachedUser);
          return true;
        }
        return false;
      }
    }
    return false;
  }, [loadCachedUser, cacheUserData]);

  // Initial auth check on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // Check if we're offline first
      const currentlyOffline = !navigator.onLine;
      
      if (currentlyOffline) {
        // If offline, immediately try to load cached user data
        console.log('[Auth] Offline mode - checking for cached user');
        const cachedUser = await loadCachedUser();
        if (cachedUser) {
          console.log('[Auth] Found cached user, using offline mode');
          setUser(cachedUser);
          setLoading(false);
          setInitialAuthComplete(true);
          return;
        }
        // No cached user while offline - will show login page
        console.log('[Auth] No cached user available for offline mode');
        setLoading(false);
        setInitialAuthComplete(true);
        return;
      }
      
      // Online - try to check existing auth (via cookies/tokens)
      const isAuthed = await checkAuth();
      
      // If not authenticated and we have remembered credentials, try auto-login
      if (!isAuthed) {
        const remembered = isSecureStorageAvailable() 
          ? await secureGet(STORAGE_KEYS.REMEMBERED_USER)
          : null;
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
    // If offline, check if we have cached user data that matches
    if (!navigator.onLine) {
      console.log('[Auth] Login attempt while offline');
      
      // Check if we have remembered credentials that match
      if (isSecureStorageAvailable()) {
        const remembered = await secureGet(STORAGE_KEYS.REMEMBERED_USER);
        if (remembered && remembered.email === email && remembered.password === password) {
          // Credentials match remembered - load cached user
          const cachedUser = await loadCachedUser();
          if (cachedUser) {
            console.log('[Auth] Offline login successful with cached data');
            setUser(cachedUser);
            return { success: true };
          }
        }
      }
      
      return { 
        success: false, 
        error: 'You are offline. Please connect to the internet to sign in for the first time.' 
      };
    }

    try {
      const response = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: getDeviceIdHeaders({ 'Content-Type': 'application/json' }),
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
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(newTokens));

      // Handle remember me with encrypted storage
      if (rememberMe && isSecureStorageAvailable()) {
        await secureSet(STORAGE_KEYS.REMEMBERED_USER, { email, password });
      } else {
        await secureRemove(STORAGE_KEYS.REMEMBERED_USER);
      }

      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        isAdmin: data.user.is_admin,
        hasSubscription: data.user.has_active_subscription,
        subscriptionStatus: data.user.subscription_status,
        subscriptionPlan: data.user.subscription_plan,
        trialEndsAt: data.user.trial_ends_at,
        subscriptionRenewsAt: data.user.subscription_renews_at
      };
      setUser(userData);
      
      // Cache user for offline access
      await cacheUserData(userData);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if this is a network/connection error
      if (isNetworkError(error)) {
        // Try offline login with cached credentials
        if (isSecureStorageAvailable()) {
          const remembered = await secureGet(STORAGE_KEYS.REMEMBERED_USER);
          if (remembered && remembered.email === email && remembered.password === password) {
            const cachedUser = await loadCachedUser();
            if (cachedUser) {
              console.log('[Auth] Network error but found matching cached credentials - using offline mode');
              setUser(cachedUser);
              return { success: true };
            }
          }
        }
        
        // Network error with no cached data
        const hasCachedData = isSecureStorageAvailable() && await secureGet(STORAGE_KEYS.REMEMBERED_USER);
        if (hasCachedData) {
          return { 
            success: false, 
            error: "Unable to reach the server. If you've logged in before with 'Remember me', try again with your saved credentials.",
            isNetworkError: true
          };
        }
        return { 
          success: false, 
          error: 'Unable to reach the server. Please check your internet connection and try again.',
          isNetworkError: true
        };
      }
      
      // Backend returned an error (400/401/etc.) - show that message
      return { success: false, error: error.message, isNetworkError: false };
    }
  };

  const signup = async (email, password, name) => {
    console.log('[Signup] Starting signup for:', email);
    
    try {
      const apiUrl = getApiUrl();
      console.log('[Signup] Making fetch request to:', `${apiUrl}/api/auth/signup`);
      
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      console.log('[Signup] Response status:', response.status);

      // Handle the case where body is already consumed (edge runtime issue)
      let responseText;
      if (response.bodyUsed) {
        console.warn('[Signup] Response body already consumed - using status-based handling');
        // If body is already used, we can only rely on status code
        if (response.ok) {
          // Success but can't read body - this is unusual, ask user to login
          return { 
            success: true,
            redirectToLogin: true,
            message: 'Account created successfully! Please log in.'
          };
        } else {
          // Error but can't read body
          return { 
            success: false, 
            error: response.status === 400 ? 'Email may already be registered. Try logging in.' : 'Signup failed. Please try again.',
            isNetworkError: false 
          };
        }
      }

      // Normal flow - read response
      responseText = await response.text();
      console.log('[Signup] Response text:', responseText.substring(0, 200));
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[Signup] Failed to parse response:', responseText);
        throw new Error('Invalid server response. Please try again.');
      }

      if (!response.ok) {
        // Backend returned an error (400, 409, etc.) - throw with the detail message
        console.log('[Signup] Backend error:', data.detail);
        throw new Error(data.detail || 'Signup failed');
      }

      console.log('[Signup] Success! Setting user data');
      
      // Store tokens
      const newTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token
      };
      setTokens(newTokens);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(newTokens));

      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        isAdmin: data.user.is_admin,
        hasSubscription: data.user.has_active_subscription,
        subscriptionStatus: data.user.subscription_status,
        subscriptionPlan: data.user.subscription_plan,
        trialEndsAt: data.user.trial_ends_at
      };
      setUser(userData);
      
      // Cache user for offline access
      await cacheUserData(userData);

      return { success: true };
    } catch (error) {
      console.error('[Signup] Error caught:', error.name, error.message);
      
      // Check if this is a network/connection error
      if (isNetworkError(error)) {
        return { 
          success: false, 
          error: 'Unable to reach the server. Please check your internet connection and try again.',
          isNetworkError: true
        };
      }
      
      // Backend returned an error - show that message
      return { success: false, error: error.message, isNetworkError: false };
    }
  };

  const logout = async () => {
    try {
      const headers = {};
      if (tokens?.access_token) {
        headers['Authorization'] = `Bearer ${tokens.access_token}`;
      }
      await fetch(`${getApiUrl()}/api/auth/logout`, {
        method: 'POST',
        headers
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth state
      setUser(null);
      setTokens(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
      // Clear cached user data (but keep remembered credentials if they want to log back in)
      secureRemove(STORAGE_KEYS.CACHED_USER);
      // Clear any other auth-related localStorage items
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('auth_tokens'); // Legacy cleanup
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
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(newTokens));
  };

  const value = {
    user,
    loading,
    initialAuthComplete,
    isOffline,
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
