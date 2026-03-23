/**
 * API Configuration
 * ==================
 * 
 * Centralized API URL configuration for the application.
 * 
 * IMPORTANT: On production domains (app.pedotg.com, etc.), we ALWAYS use
 * same-origin requests to avoid CORS issues, regardless of REACT_APP_BACKEND_URL.
 */

// Known production domains where we MUST use same-origin requests
const PRODUCTION_DOMAINS = [
  'app.pedotg.com',
  'pedotg.com', 
  'www.pedotg.com'
];

/**
 * Check if current hostname is a production domain
 */
const isProductionDomain = () => {
  if (typeof window === 'undefined' || !window.location?.hostname) {
    return false;
  }
  return PRODUCTION_DOMAINS.includes(window.location.hostname);
};

/**
 * Get the API base URL
 * 
 * CRITICAL: Production domain check MUST come first to avoid CORS issues.
 * When on app.pedotg.com, we ALWAYS use same-origin ('/api/...') requests.
 * 
 * Priority:
 * 1. If on a known production domain → return '' (same-origin)
 * 2. If REACT_APP_BACKEND_URL is set → use it
 * 3. Otherwise → use window.location.origin
 */
export const getApiUrl = () => {
  // FIRST: Check if we're on a production domain - this MUST take priority
  if (isProductionDomain()) {
    // On production domains, ALWAYS use same-origin to avoid CORS
    return '';
  }
  
  // SECOND: Use environment variable if set (for development/staging)
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // THIRD: Fall back to current origin
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  
  // Last resort for SSR
  return '';
};

// Export for use in components - computed fresh each time to handle SPA navigation
export const API_URL = '';  // Deprecated - use getApiUrl() instead

/**
 * Debug logging - always runs to help diagnose issues
 */
export const debugApiConfig = () => {
  const url = getApiUrl();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'N/A';
  const isProd = isProductionDomain();
  
  console.log('[API Config] ===== Configuration =====');
  console.log('[API Config] Hostname:', hostname);
  console.log('[API Config] Is production domain:', isProd);
  console.log('[API Config] REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL || '(not set)');
  console.log('[API Config] Resolved API URL:', url || '(same-origin)');
  console.log('[API Config] ========================');
  
  // Health check
  const healthUrl = url ? `${url}/api/health` : '/api/health';
  fetch(healthUrl)
    .then(res => res.json())
    .then(data => console.log('[API Config] Health check:', data.status))
    .catch(err => console.error('[API Config] Health check FAILED:', err.message));
};

/**
 * Check if an error is a network/connection error
 */
export const isNetworkError = (error) => {
  if (!error) return false;
  
  // Log for debugging
  console.log('[isNetworkError] Checking error:', {
    name: error.name,
    message: error.message,
    type: typeof error
  });
  
  // If it's a standard Error thrown from our code (like "Email already registered"), 
  // it's NOT a network error
  if (error.name === 'Error' && error.message && !error.message.includes('Failed to fetch')) {
    console.log('[isNetworkError] Standard Error with message - NOT network error');
    return false;
  }
  
  // TypeError with "Failed to fetch" = network failure
  if (error instanceof TypeError && error.message?.includes('Failed to fetch')) {
    console.log('[isNetworkError] TypeError with Failed to fetch - IS network error');
    return true;
  }
  
  // NetworkError type
  if (error.name === 'NetworkError') {
    console.log('[isNetworkError] NetworkError type - IS network error');
    return true;
  }
  
  // Browser is offline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.log('[isNetworkError] Browser offline - IS network error');
    return true;
  }
  
  console.log('[isNetworkError] Default - NOT network error');
  return false;
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error, hasCachedData = false) => {
  if (isNetworkError(error)) {
    if (hasCachedData) {
      return "Unable to reach the server. If you've logged in before with 'Remember me', your saved credentials may work offline.";
    }
    return "Unable to reach the server. Please check your internet connection and try again.";
  }
  
  return error?.message || 'An unexpected error occurred. Please try again.';
};

export default getApiUrl;
