/**
 * NumberInput Component with +/- toggle for mobile keyboards
 * Solves the issue where Samsung/Android keyboards don't show minus sign
 */

import { Input } from "./input";
import { Button } from "./button";
import { Minus, Plus } from "lucide-react";

export const NumberInput = ({ 
  value, 
  onChange, 
  allowNegative = false,
  placeholder,
  className = "",
  inputClassName = "",
  step,
  min,
  max,
  ...props 
}) => {
  const numValue = parseFloat(value) || 0;
  const isNegative = numValue < 0 || (value && value.toString().startsWith('-'));

  const toggleSign = () => {
    if (!value || value === "" || value === "-") {
      onChange({ target: { value: "-" } });
      return;
    }
    
    const currentVal = parseFloat(value);
    if (isNaN(currentVal)) {
      onChange({ target: { value: value.startsWith('-') ? value.slice(1) : `-${value}` } });
    } else {
      onChange({ target: { value: String(-currentVal) } });
    }
  };

  if (!allowNegative) {
    return (
      <Input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className || inputClassName}
        step={step}
        min={min}
        max={max}
        {...props}
      />
    );
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={toggleSign}
        tabIndex={-1}
      >
        {isNegative ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
      </Button>
      <Input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex-1 ${inputClassName}`}
        step={step}
        min={min}
        max={max}
        {...props}
      />
    </div>
  );
};

export default NumberInput;
