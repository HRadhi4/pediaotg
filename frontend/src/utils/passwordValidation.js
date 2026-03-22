/**
 * Password Validation Utility
 * ===========================
 * Client-side password validation that mirrors the backend policy.
 * 
 * Backend policy (AuthService.validate_password_strength):
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character (!@#$%^&*(),.?":{}|<>)
 * - Not a common/trivial password
 * 
 * Note: This is for UX feedback only. Backend is the source of truth.
 */

// Common weak passwords (matches backend list)
const COMMON_PASSWORDS = [
  'password',
  '12345678',
  'qwerty',
  'letmein',
  'welcome',
  'admin123',
  'password1',
  'password123',
  '123456789',
  'iloveyou',
  'sunshine',
  'princess',
  'football',
  'monkey',
  'shadow',
  'master',
  'dragon',
  'baseball',
  'abc123',
  'trustno1'
];

// Special characters accepted by backend
const SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>]/;

/**
 * Validate a password against the security policy.
 * 
 * @param {string} password - The password to validate
 * @returns {{ valid: boolean; errors: string[]; criteria: object }} Validation result with detailed criteria
 */
export function validatePassword(password) {
  const errors = [];
  const criteria = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasDigit: false,
    hasSpecial: false,
    notCommon: false
  };

  if (!password) {
    return {
      valid: false,
      errors: ['Password is required.'],
      criteria
    };
  }

  // Check minimum length
  if (password.length >= 8) {
    criteria.minLength = true;
  } else {
    errors.push('Password must be at least 8 characters.');
  }

  // Check for uppercase letter
  if (/[A-Z]/.test(password)) {
    criteria.hasUppercase = true;
  } else {
    errors.push('Password must include at least one uppercase letter.');
  }

  // Check for lowercase letter
  if (/[a-z]/.test(password)) {
    criteria.hasLowercase = true;
  } else {
    errors.push('Password must include at least one lowercase letter.');
  }

  // Check for digit
  if (/\d/.test(password)) {
    criteria.hasDigit = true;
  } else {
    errors.push('Password must include at least one digit.');
  }

  // Check for special character
  if (SPECIAL_CHARS.test(password)) {
    criteria.hasSpecial = true;
  } else {
    errors.push('Password must include at least one symbol (!@#$%^&*(),.?":{}|<>).');
  }

  // Check for common passwords
  if (!COMMON_PASSWORDS.includes(password.toLowerCase())) {
    criteria.notCommon = true;
  } else {
    errors.push('This password is too common. Please choose something more unique.');
  }

  return {
    valid: errors.length === 0,
    errors,
    criteria
  };
}

/**
 * Get a strength label for UI display.
 * 
 * @param {string} password - The password to evaluate
 * @returns {'weak' | 'medium' | 'strong'} Strength label
 */
export function getPasswordStrengthLabel(password) {
  if (!password) return 'weak';

  const { criteria } = validatePassword(password);
  const metCriteria = Object.values(criteria).filter(Boolean).length;

  // 6 criteria total
  if (metCriteria <= 2) return 'weak';
  if (metCriteria <= 4) return 'medium';
  return 'strong';
}

/**
 * Get strength color for UI display.
 * 
 * @param {'weak' | 'medium' | 'strong'} strength - Strength label
 * @returns {string} Tailwind color class
 */
export function getStrengthColor(strength) {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-amber-500';
    case 'strong':
      return 'text-green-500';
    default:
      return 'text-gray-400';
  }
}

/**
 * Get strength background color for progress bar.
 * 
 * @param {'weak' | 'medium' | 'strong'} strength - Strength label
 * @returns {string} Tailwind background color class
 */
export function getStrengthBgColor(strength) {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-amber-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}

/**
 * Get strength percentage for progress bar.
 * 
 * @param {string} password - The password to evaluate
 * @returns {number} Percentage (0-100)
 */
export function getStrengthPercentage(password) {
  if (!password) return 0;
  
  const { criteria } = validatePassword(password);
  const metCriteria = Object.values(criteria).filter(Boolean).length;
  
  // 6 criteria total, but we want to show some progress even with partial completion
  return Math.round((metCriteria / 6) * 100);
}

/**
 * Check if an error message from the backend is password-related.
 * 
 * @param {string} message - Error message from backend
 * @returns {boolean} True if password-related
 */
export function isPasswordPolicyError(message) {
  if (!message) return false;
  
  const passwordKeywords = [
    'password',
    'uppercase',
    'lowercase',
    'digit',
    'character',
    'symbol',
    'common',
    'weak',
    'strength'
  ];
  
  const lowerMessage = message.toLowerCase();
  return passwordKeywords.some(keyword => lowerMessage.includes(keyword));
}
