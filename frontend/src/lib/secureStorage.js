/**
 * Secure Storage Utility
 * Encrypts sensitive data before storing in localStorage
 * Uses AES-GCM encryption with a derived key
 * 
 * SECURITY NOTE: This provides protection against casual inspection of localStorage
 * but not against determined attackers with full page access. The real security
 * comes from server-side token validation on every request.
 */

// Generate a device-specific key seed by combining app identifier with browser fingerprint
function getKeyMaterial() {
  const appId = 'PediaOTG-SecureStorage-v2';
  // Add some browser-specific entropy (not cryptographically secure, but adds variability)
  const browserEntropy = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset()
  ].join('|');
  return appId + '|' + browserEntropy;
}

// Convert string to ArrayBuffer
function stringToBuffer(str) {
  return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to string
function bufferToString(buffer) {
  return new TextDecoder().decode(buffer);
}

// Convert ArrayBuffer to Base64
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive encryption key from seed
async function getEncryptionKey() {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToBuffer(getKeyMaterial()),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: stringToBuffer('PediaOTG-Salt-v2'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data and store in localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to encrypt and store
 */
export async function secureSet(key, data) {
  try {
    const encryptionKey = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = JSON.stringify(data);
    
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      stringToBuffer(plaintext)
    );

    const encryptedData = {
      iv: bufferToBase64(iv),
      data: bufferToBase64(ciphertext)
    };

    localStorage.setItem(key, JSON.stringify(encryptedData));
    return true;
  } catch (error) {
    console.error('Secure storage set failed:', error);
    return false;
  }
}

/**
 * Retrieve and decrypt data from localStorage
 * @param {string} key - Storage key
 * @returns {any} Decrypted data or null if not found/failed
 */
export async function secureGet(key) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const { iv, data } = JSON.parse(stored);
    const encryptionKey = await getEncryptionKey();

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(base64ToBuffer(iv)) },
      encryptionKey,
      base64ToBuffer(data)
    );

    return JSON.parse(bufferToString(decrypted));
  } catch (error) {
    console.error('Secure storage get failed:', error);
    // Clear corrupted data
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export function secureRemove(key) {
  localStorage.removeItem(key);
}

/**
 * Check if Web Crypto API is available
 */
export function isSecureStorageAvailable() {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.subtle.encrypt === 'function';
}
