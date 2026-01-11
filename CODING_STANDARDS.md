# Pediatrics on the Go - Coding Standards & Guidelines

## Purpose
This document establishes coding standards to ensure code is well-documented, maintainable, and easily understood by developers.

---

## 1. File Header Comments

Every file MUST have a header comment block explaining:
- File purpose and main functionality
- Key features or components
- Important notes for developers

### Python Example (Backend)
```python
"""
=============================================================================
MODULE NAME - Brief Description
=============================================================================
This module handles [specific functionality]

KEY FEATURES:
- Feature 1
- Feature 2

ENDPOINTS (for route files):
- GET  /api/endpoint  - Description
- POST /api/endpoint  - Description

AUTHORIZATION: [Required auth level]

NOTE: [Important developer notes]
=============================================================================
"""
```

### JavaScript/React Example (Frontend)
```javascript
/**
 * =============================================================================
 * COMPONENT NAME - Brief Description
 * =============================================================================
 * 
 * PURPOSE: What this component does
 * 
 * KEY FEATURES:
 * - Feature 1
 * - Feature 2
 * 
 * PROPS:
 * - propName: Description
 * 
 * STATE:
 * - stateName: Description
 * 
 * DATA SOURCE: Where data comes from
 * =============================================================================
 */
```

---

## 2. Function Documentation

### Python Functions
```python
async def function_name(param1: str, param2: int) -> ReturnType:
    """
    Brief description of what the function does.
    
    FLOW/LOGIC:
    1. Step one
    2. Step two
    
    Args:
        param1: Description of param1
        param2: Description of param2
        
    Returns:
        Description of return value
        
    Raises:
        ExceptionType: When this exception is raised
    """
```

### JavaScript Functions
```javascript
/**
 * Brief description of what the function does.
 * 
 * LOGIC:
 * - Step one
 * - Step two
 * 
 * @param {string} param1 - Description
 * @param {number} param2 - Description
 * @returns {Object} { property1, property2 }
 */
const functionName = (param1, param2) => {
```

---

## 3. Inline Comments

Use inline comments for:
- Complex logic that isn't immediately obvious
- Business rules or domain-specific calculations
- Workarounds or non-obvious code

### Example
```javascript
// ========================================================================
// RATE-BASED DOSING (mcg/kg/min)
// For continuous infusions - do NOT multiply by weight
// ========================================================================
if (doseUnit.includes("/min")) {
  // Rate is already per-kg, just display the range
  return { dose: `${min} - ${max}` };
}
```

---

## 4. Section Separators

Use visual separators to organize code into logical sections:

```python
# =============================================================================
# SECTION NAME
# =============================================================================
```

```javascript
// ==========================================================================
// SECTION NAME
// ==========================================================================
```

---

## 5. State & Variable Comments

Document state variables and their purpose:

```javascript
// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
const [searchTerm, setSearchTerm] = useState("");      // Drug search filter
const [weight, setWeight] = useState("");              // Patient weight in kg
const [height, setHeight] = useState("");              // Height in cm (for GFR)
```

---

## 6. API Endpoint Documentation

Each API endpoint should document:
- HTTP method and path
- Required authentication
- Request body/params
- Response format
- Error responses

```python
@router.post("/user")
async def create_user(user_data: AdminCreateUser):
    """
    Create a new user with subscription (Admin only)
    
    Request Body:
        - email: Valid email address
        - name: Display name
        - password: Min 6 characters
        - subscription_type: "trial" | "monthly" | "annual"
    
    Response:
        {
            "message": "User created successfully",
            "user": { "id", "email", "name", "subscription_type" }
        }
    
    Errors:
        400: Email already registered
        401: Not authenticated
        403: Not admin
    """
```

---

## 7. Special Account Documentation

Document hardcoded or special accounts:

```python
# =================================================================
# ADMIN LOGIN - Hardcoded bypass for admin account
# Admin has full access including admin dashboard
# Credentials: admin@pedotg.com / SMC159951 (from .env)
# =================================================================

# =================================================================
# TESTER LOGIN - Hardcoded bypass for tester account  
# Full app access, NO admin dashboard, NO subscription required
# Credentials: test@pedotg.com / SMC2000 (from .env)
# =================================================================
```

---

## 8. Drug Data Structure

For the drugs database, document the structure:

```javascript
/**
 * DRUG DATA STRUCTURE:
 * {
 *   id: "unique_id",           // Lowercase, no spaces
 *   name: "Drug Name (Brand)", // Generic (Brand) format
 *   category: "Category",      // e.g., "Antibiotic", "Vasoactive"
 *   route: "IV/PO",           // Administration route
 *   doses: {
 *     doseType: {
 *       label: "Display Label",
 *       value: "5-10",         // Numeric range or single value
 *       unit: "mg/kg/dose q8h" // Unit with frequency
 *     }
 *   },
 *   max: "Max dose string",    // e.g., "500 mg/dose"
 *   indication: "When to use",
 *   notes: "Clinical notes",
 *   renalAdjust: { gfr50, gfr30, gfr10, hd } | null
 * }
 */
```

---

## 9. Environment Variables

Document all environment variables used:

```python
"""
ENVIRONMENT VARIABLES:
- MONGO_URL: MongoDB connection string
- DB_NAME: Database name
- JWT_SECRET_KEY: Secret for JWT signing
- ADMIN_EMAIL: Admin account email
- ADMIN_PASSWORD: Admin account password
- TESTER_EMAIL: Tester account email
- TESTER_PASSWORD: Tester account password
- TRIAL_DAYS: Number of trial days (default: 3)
"""
```

---

## 10. Best Practices Summary

1. **Always add file headers** - Explain the file's purpose
2. **Document complex functions** - Especially calculations and business logic
3. **Use section separators** - Organize code into logical blocks
4. **Comment special cases** - Hardcoded values, workarounds, edge cases
5. **Keep comments updated** - Update comments when changing code
6. **Use consistent formatting** - Follow the patterns in this document

---

## Quick Reference

| Element | Comment Style |
|---------|--------------|
| File header | Multi-line block with === separators |
| Function | Docstring with Args/Returns |
| Section | Single-line with === separators |
| Inline | Single // or # with explanation |
| TODO | `// TODO: Description` |
| FIXME | `// FIXME: Description` |

---

*Last Updated: January 2026*
