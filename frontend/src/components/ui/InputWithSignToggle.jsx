import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { PlusCircle, MinusCircle } from "lucide-react"

/**
 * InputWithSignToggle - A numeric input with a +/- toggle button
 * Solves the issue where mobile keyboards (especially Samsung) don't show the minus sign
 * for numeric inputs.
 */
const InputWithSignToggle = React.forwardRef(({ 
  className, 
  value, 
  onChange, 
  placeholder,
  id,
  "data-testid": dataTestId,
  ...props 
}, ref) => {
  // Determine if the current value is negative
  const isNegative = value && String(value).startsWith('-')
  const absValue = value ? String(value).replace(/^-/, '') : ''
  
  // Toggle the sign
  const toggleSign = () => {
    if (!absValue || absValue === '0' || absValue === '') {
      // If no value, set to negative empty (will show - prefix)
      if (!isNegative) {
        onChange({ target: { value: '-' } })
      } else {
        onChange({ target: { value: '' } })
      }
      return
    }
    
    if (isNegative) {
      // Remove the negative sign
      onChange({ target: { value: absValue } })
    } else {
      // Add the negative sign
      onChange({ target: { value: '-' + absValue } })
    }
  }
  
  // Handle input change - only allow valid numeric input
  const handleInputChange = (e) => {
    let inputValue = e.target.value
    
    // Allow empty string
    if (inputValue === '' || inputValue === '-') {
      onChange({ target: { value: inputValue } })
      return
    }
    
    // Regex to allow digits, one decimal point, and optionally a leading minus
    const pattern = /^-?\d*\.?\d*$/
    
    if (pattern.test(inputValue)) {
      onChange({ target: { value: inputValue } })
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono",
          className
        )}
        ref={ref}
        data-testid={dataTestId}
        {...props}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "h-9 w-9 flex-shrink-0 transition-colors",
          isNegative 
            ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40" 
            : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/40"
        )}
        onClick={toggleSign}
        aria-label={isNegative ? "Make positive" : "Make negative"}
        data-testid={dataTestId ? `${dataTestId}-toggle` : 'sign-toggle'}
      >
        {isNegative ? (
          <MinusCircle className="h-4 w-4" />
        ) : (
          <PlusCircle className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
})

InputWithSignToggle.displayName = "InputWithSignToggle"

export { InputWithSignToggle }
