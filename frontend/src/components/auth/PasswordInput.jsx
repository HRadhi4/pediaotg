/**
 * Password Input Component
 * ========================
 * A secure password input with:
 * - Show/hide toggle
 * - Real-time strength indicator
 * - Criteria checklist
 * - Error display
 */

import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  validatePassword,
  getPasswordStrengthLabel,
  getStrengthColor,
  getStrengthBgColor,
  getStrengthPercentage
} from '@/utils/passwordValidation';

/**
 * Password criteria item for checklist display
 */
const CriteriaItem = ({ met, label }) => (
  <div className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
    {met ? (
      <Check className="h-3 w-3" />
    ) : (
      <X className="h-3 w-3" />
    )}
    <span>{label}</span>
  </div>
);

/**
 * Password strength bar indicator
 */
const StrengthBar = ({ password }) => {
  const strength = getPasswordStrengthLabel(password);
  const percentage = getStrengthPercentage(password);
  const bgColor = getStrengthBgColor(strength);
  const textColor = getStrengthColor(strength);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${bgColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={`text-xs font-medium ${textColor} capitalize`}>
        {strength} password
      </div>
    </div>
  );
};

/**
 * Password criteria checklist
 */
const CriteriaChecklist = ({ password, showAll = false }) => {
  const { criteria } = useMemo(() => validatePassword(password || ''), [password]);

  // Only show checklist if user has started typing or showAll is true
  if (!password && !showAll) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
      <CriteriaItem met={criteria.minLength} label="8+ characters" />
      <CriteriaItem met={criteria.hasUppercase} label="Uppercase (A-Z)" />
      <CriteriaItem met={criteria.hasLowercase} label="Lowercase (a-z)" />
      <CriteriaItem met={criteria.hasDigit} label="Number (0-9)" />
      <CriteriaItem met={criteria.hasSpecial} label="Symbol (!@#...)" />
      <CriteriaItem met={criteria.notCommon} label="Not common" />
    </div>
  );
};

/**
 * Secure Password Input with validation
 * 
 * @param {object} props
 * @param {string} props.value - Password value
 * @param {function} props.onChange - Change handler
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.error - Error message to display
 * @param {boolean} props.showStrength - Show strength indicator
 * @param {boolean} props.showCriteria - Show criteria checklist
 * @param {boolean} props.disabled - Disable input
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.autoComplete - Autocomplete attribute
 * @param {string} props.dataTestId - Test ID for automation
 */
export function PasswordInput({
  value,
  onChange,
  label = 'Password',
  placeholder = 'Enter password',
  error,
  showStrength = false,
  showCriteria = false,
  disabled = false,
  id = 'password',
  name = 'password',
  autoComplete = 'new-password',
  dataTestId = 'password-input',
  className = ''
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          data-testid={dataTestId}
          className={`pr-10 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        <button
          type="button"
          onClick={handleToggleVisibility}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* Strength indicator */}
      {showStrength && value && (
        <StrengthBar password={value} />
      )}

      {/* Criteria checklist */}
      {showCriteria && (
        <CriteriaChecklist password={value} />
      )}
    </div>
  );
}

/**
 * Confirm Password Input (for signup/reset flows)
 * 
 * @param {object} props
 * @param {string} props.value - Confirm password value
 * @param {function} props.onChange - Change handler
 * @param {string} props.originalPassword - Original password to match against
 * @param {string} props.error - Error message to display
 */
export function ConfirmPasswordInput({
  value,
  onChange,
  originalPassword,
  error,
  disabled = false,
  id = 'confirm-password',
  dataTestId = 'confirm-password-input'
}) {
  const [showPassword, setShowPassword] = useState(false);
  
  const passwordsMatch = value && originalPassword && value === originalPassword;
  const showMismatch = value && originalPassword && value !== originalPassword;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        Confirm Password
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="Confirm your password"
          disabled={disabled}
          autoComplete="new-password"
          data-testid={dataTestId}
          className={`pr-10 ${error || showMismatch ? 'border-red-500' : passwordsMatch ? 'border-green-500' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Match indicator */}
      {value && (
        <div className={`flex items-center gap-1 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
          {passwordsMatch ? (
            <>
              <Check className="h-3 w-3" />
              <span>Passwords match</span>
            </>
          ) : (
            <>
              <X className="h-3 w-3" />
              <span>Passwords do not match</span>
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;
