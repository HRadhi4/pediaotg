/**
 * Device ID Utility
 * =================
 * Generates and stores a stable device identifier for auth requests.
 * 
 * This ID is used by the backend to track device sessions and enforce
 * device limits. It's more stable than user-agent alone because it
 * persists across browser updates and sessions.
 * 
 * Storage:
 * - Primary: localStorage (persists across sessions)
 * - Fallback: sessionStorage (if localStorage unavailable)
 * - Last resort: In-memory (if all storage unavailable)
 * 
 * Security:
 * - Uses crypto.getRandomValues for cryptographic randomness
 * - 32 bytes = 256 bits of entropy (very secure)
 */

const STORAGE_KEY = 'pedotg_device_id';

// In-memory fallback for private browsing modes
let memoryDeviceId = null;

/**
 * Generate a cryptographically secure random device ID.
 * 
 * @returns {string} 64-character hex string (32 bytes)
 */
function generateDeviceId() {
  try {
    // Use crypto API for secure random bytes
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback to less secure but still random UUID-like generation
    console.warn('[DeviceId] crypto.getRandomValues unavailable, using fallback');
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).replace(/-/g, '') + Date.now().toString(16);
  }
}

/**
 * Check if localStorage is available.
 * 
 * @returns {boolean} True if localStorage is available
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if sessionStorage is available.
 * 
 * @returns {boolean} True if sessionStorage is available
 */
function isSessionStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get or create a stable device identifier.
 * 
 * The ID is generated once and persisted. Same device will always
 * return the same ID (unless storage is cleared).
 * 
 * @returns {string | null} Device ID or null if generation failed
 */
export function getDeviceId() {
  // Try localStorage first (most persistent)
  if (isLocalStorageAvailable()) {
    let deviceId = localStorage.getItem(STORAGE_KEY);
    if (!deviceId) {
      deviceId = generateDeviceId();
      try {
        localStorage.setItem(STORAGE_KEY, deviceId);
      } catch (e) {
        console.warn('[DeviceId] Failed to save to localStorage:', e);
      }
    }
    return deviceId;
  }

  // Fall back to sessionStorage (persists for session)
  if (isSessionStorageAvailable()) {
    let deviceId = sessionStorage.getItem(STORAGE_KEY);
    if (!deviceId) {
      deviceId = generateDeviceId();
      try {
        sessionStorage.setItem(STORAGE_KEY, deviceId);
      } catch (e) {
        console.warn('[DeviceId] Failed to save to sessionStorage:', e);
      }
    }
    return deviceId;
  }

  // Last resort: in-memory (won't persist across page reloads)
  if (!memoryDeviceId) {
    memoryDeviceId = generateDeviceId();
    console.warn('[DeviceId] Using in-memory storage (private browsing mode?)');
  }
  return memoryDeviceId;
}

/**
 * Clear the stored device ID.
 * Useful for testing or when user wants to appear as a new device.
 */
export function clearDeviceId() {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(STORAGE_KEY);
  }
  if (isSessionStorageAvailable()) {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  memoryDeviceId = null;
}

/**
 * Get headers object with device ID for fetch requests.
 * 
 * @param {object} existingHeaders - Existing headers to merge with
 * @returns {object} Headers object with X-Device-ID added
 */
export function getDeviceIdHeaders(existingHeaders = {}) {
  const deviceId = getDeviceId();
  if (deviceId) {
    return {
      ...existingHeaders,
      'X-Device-ID': deviceId
    };
  }
  return existingHeaders;
}
