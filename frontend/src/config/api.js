/**
 * API Configuration
 * ==================
 * 
 * Centralized API URL configuration for the application.
 * 
 * DEPLOYMENT REQUIREMENT:
 * -----------------------
 * In production, set REACT_APP_BACKEND_URL to the public backend origin.
 * Example: REACT_APP_BACKEND_URL=https://app.pedotg.com
 * 
 * If REACT_APP_BACKEND_URL is not set, the app falls back to window.location.origin,
 * which works when frontend and backend are served from the same domain.
 * 
 * Build command for production:
 *   REACT_APP_BACKEND_URL=https://app.pedotg.com npm run build
 */

// Known production domains where we should use same-origin requests
const PRODUCTION_DOMAINS = [
  'app.pedotg.com',
  'pedotg.com',
  'www.pedotg.com'
];

/**
 * Get the API base URL
 * 
 * Priority:
 * 1. If on a known production domain, use same-origin (empty string)
 * 2. REACT_APP_BACKEND_URL environment variable (set at build time)
 * 3. window.location.origin (same-origin fallback for production)
 * 4. Empty string (for SSR/testing environments)
 */
export const getApiUrl = () => {
  // Check if we're in a browser
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const currentHostname = window.location.hostname;
    
    // If on a known production domain, ALWAYS use same-origin to avoid CORS
    if (PRODUCTION_DOMAINS.includes(currentHostname)) {
      console.log('[API Config] Production domain detected, using same-origin');
      return ''; // Empty string = same-origin requests
    }
  }
  
  // Use environment variable if set
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // Fall back to current origin (works when frontend/backend on same domain)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  
  // Last resort for SSR or test environments
  return '';
};

/**
 * The resolved API base URL
 * All API calls should use this: `${API_URL}/api/...`
 */
export const API_URL = getApiUrl();

/**
 * Debug logging for development builds
 * Logs the API URL and performs a health check
 */
export const debugApiConfig = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[API Config] Using API_URL =', API_URL || '(same-origin)');
    console.log('[API Config] REACT_APP_BACKEND_URL env =', process.env.REACT_APP_BACKEND_URL || '(not set)');
    console.log('[API Config] window.location.origin =', typeof window !== 'undefined' ? window.location.origin : '(no window)');
    console.log('[API Config] window.location.hostname =', typeof window !== 'undefined' ? window.location.hostname : '(no window)');
    
    // Perform health check
    const healthUrl = API_URL ? `${API_URL}/api/health` : '/api/health';
    fetch(healthUrl)
      .then(res => res.json())
      .then(data => console.log('[API Config] Health check passed:', data))
      .catch(err => console.warn('[API Config] Health check failed:', err.message));
  }
};

/**
 * Check if an error is a network/connection error vs a backend error
 * 
 * @param {Error} error - The caught error
 * @returns {boolean} - True if it's a network error, false if it's a backend response
 */
export const isNetworkError = (error) => {
  // TypeError with "Failed to fetch" indicates network failure
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return true;
  }
  
  // Check for common network error patterns
  if (error.name === 'TypeError' || error.name === 'NetworkError') {
    return true;
  }
  
  // Check if browser is offline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return true;
  }
  
  return false;
};

/**
 * Get user-friendly error message based on error type
 * 
 * @param {Error} error - The caught error
 * @param {boolean} hasCachedData - Whether cached/remembered credentials exist
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error, hasCachedData = false) => {
  if (isNetworkError(error)) {
    if (hasCachedData) {
      return "Unable to reach the server. If you've logged in before with 'Remember me', your saved credentials may work offline.";
    }
    return "Unable to reach the server. Please check your internet connection and try again.";
  }
  
  // For other errors, return the error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

export default API_URL;
