/**
 * Content Service - API Client for Medical Content
 * =================================================
 * 
 * This service fetches medical content (formulary, renal adjustments)
 * from the backend API instead of static imports.
 * 
 * Benefits:
 * - Reduces frontend bundle size significantly
 * - Protects intellectual property (content behind auth)
 * - Enables content updates without frontend deployment
 * - Subscription-gated access for premium content
 */

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Get auth headers from localStorage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Handle API response and errors
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }
  return response.json();
};

// =============================================================================
// FORMULARY API
// =============================================================================

/**
 * Fetch the drug formulary
 * 
 * @param {Object} options - Query options
 * @param {string} options.category - Filter by category
 * @param {string} options.search - Search term
 * @param {number} options.limit - Max results (default 200)
 * @param {number} options.offset - Pagination offset
 * @returns {Promise<{drugs: Array, total: number, has_more: boolean}>}
 */
export const fetchFormulary = async ({ category, search, limit = 200, offset = 0 } = {}) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  
  const response = await fetch(
    `${API_URL}/api/content/formulary?${params.toString()}`,
    { headers: getAuthHeaders() }
  );
  
  return handleResponse(response);
};

/**
 * Fetch a single drug by ID
 * 
 * @param {string} drugId - The drug's unique identifier
 * @returns {Promise<Object>} Drug details
 */
export const fetchDrugById = async (drugId) => {
  const response = await fetch(
    `${API_URL}/api/content/formulary/${drugId}`,
    { headers: getAuthHeaders() }
  );
  
  return handleResponse(response);
};

/**
 * Fetch drug categories list
 * 
 * @returns {Promise<{categories: string[], count: number}>}
 */
export const fetchDrugCategories = async () => {
  const response = await fetch(
    `${API_URL}/api/content/drug-categories`,
    { headers: getAuthHeaders() }
  );
  
  return handleResponse(response);
};

// =============================================================================
// RENAL ADJUSTMENTS API
// =============================================================================

/**
 * Fetch renal adjustment data
 * 
 * @param {string} drugId - Optional drug ID for single drug lookup
 * @returns {Promise<Object>}
 */
export const fetchRenalAdjustments = async (drugId = null) => {
  const url = drugId 
    ? `${API_URL}/api/content/renal-adjustments?drug_id=${drugId}`
    : `${API_URL}/api/content/renal-adjustments`;
  
  const response = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse(response);
};

// =============================================================================
// CONTENT METADATA
// =============================================================================

/**
 * Fetch content metadata (counts, version, last updated)
 * 
 * @returns {Promise<Object>}
 */
export const fetchContentMetadata = async () => {
  const response = await fetch(
    `${API_URL}/api/content/metadata`,
    { headers: getAuthHeaders() }
  );
  
  return handleResponse(response);
};

// =============================================================================
// CACHE MANAGEMENT
// =============================================================================

// Simple in-memory cache for the session
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data or fetch fresh
 */
export const getCachedFormulary = async (options = {}) => {
  const cacheKey = `formulary_${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetchFormulary(options);
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
};

/**
 * Clear content cache (call after auth changes)
 */
export const clearContentCache = () => {
  cache.clear();
};

export default {
  fetchFormulary,
  fetchDrugById,
  fetchDrugCategories,
  fetchRenalAdjustments,
  fetchContentMetadata,
  getCachedFormulary,
  clearContentCache
};
