/**
 * =============================================================================
 * CHILDREN'S DRUGS PAGE - Pediatric Drug Formulary
 * =============================================================================
 * 
 * PURPOSE: Comprehensive drug database with weight-based dose calculations
 * 
 * KEY FEATURES:
 * - 97+ pediatric drugs with dosing information
 * - Weight-based dose calculations with max dose capping
 * - GFR calculator (Schwartz equations - revised & original)
 * - Renal dose adjustments for drugs cleared by kidneys
 * - Search and filter functionality
 * 
 * DOSE CALCULATION UNITS:
 * - mg: Standard medication doses (e.g., antibiotics)
 * - g: Larger doses like Dextrose
 * - mL: Volume-based like Racemic Epinephrine
 * - mcg: Micrograms for potent drugs
 * - mcg/kg/min: Rate-based infusions (Dopamine, Dobutamine) - NOT multiplied by weight
 * - K units: Large unit doses (Penicillin)
 * 
 * DATA SOURCE: Based on Harriet Lane Handbook 23rd Edition
 * 
 * DRUG NAME FORMAT: Generic Name (Brand Name) - e.g., Ceftriaxone (Rocephin)
 * =============================================================================
 */

import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Scale, Info, AlertCircle } from "lucide-react";
import { ArrowLeftIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { childrenFormulary, drugCategories } from "@/data/childrenFormularyData";

const DrugsPage = ({ onBack }) => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const [searchTerm, setSearchTerm] = useState("");      // Drug search filter
  const [weight, setWeight] = useState("");              // Patient weight in kg
  const [height, setHeight] = useState("");              // Patient height in cm (for GFR)
  const [creatinine, setCreatinine] = useState("");      // Serum creatinine µmol/L (for GFR)
  const [ageCategory, setAgeCategory] = useState("child"); // Age category for original Schwartz
  const [schwartzType, setSchwartzType] = useState("revised"); // GFR equation type
  const [expandedDrug, setExpandedDrug] = useState(null);  // Currently expanded drug card
  const [showGFRCalc, setShowGFRCalc] = useState(false);   // GFR calculator visibility
  
  // Parsed numeric values for calculations
  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const scr = parseFloat(creatinine) || 0;

  // Original Schwartz k values by age
  // k values: Preterm=0.33, Term infant=0.45, Child(1-13y)=0.55, Adolescent Male=0.70, Adolescent Female=0.55
  const getKValue = () => {
    switch(ageCategory) {
      case "preterm": return 0.33;
      case "term": return 0.45;
      case "child": return 0.55;
      case "adolescentM": return 0.70;
      case "adolescentF": return 0.55;
      default: return 0.55;
    }
  };

  const getAgeCategoryLabel = () => {
    switch(ageCategory) {
      case "preterm": return "Preterm infant";
      case "term": return "Term infant (<1 year)";
      case "child": return "Child (1-13 years)";
      case "adolescentM": return "Adolescent male (>13 years)";
      case "adolescentF": return "Adolescent female (>13 years)";
      default: return "Child";
    }
  };

  // GFR Calculation
  // Revised Schwartz (2009): eGFR = 0.413 × Height(cm) / SCr(mg/dL) = 36.5 × Height(cm) / SCr(µmol/L)
  // Original Schwartz: eGFR = k × Height(cm) / SCr(mg/dL) = k × 88.4 × Height(cm) / SCr(µmol/L)
  const calculateGFR = () => {
    if (h > 0 && scr > 0) {
      if (schwartzType === "revised") {
        // Revised Schwartz (Bedside): single k=0.413 for all ages 1-17
        // For µmol/L: 0.413 × 88.4 = 36.5
        return (36.5 * h / scr).toFixed(1);
      } else {
        // Original Schwartz: age-specific k values
        const k = getKValue();
        const kAdjusted = k * 88.4;
        return (kAdjusted * h / scr).toFixed(1);
      }
    }
    return null;
  };

  const gfr = calculateGFR();

  // Get GFR category for renal dosing
  const getGFRCategory = () => {
    if (!gfr) return null;
    const gfrNum = parseFloat(gfr);
    if (gfrNum >= 50) return "normal";
    if (gfrNum >= 30) return "mild";
    if (gfrNum >= 10) return "moderate";
    return "severe";
  };

  const gfrCategory = getGFRCategory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sort drugs alphabetically by name - using data from childrenFormulary.js
  const sortedDrugs = useMemo(() => 
    [...childrenFormulary].sort((a, b) => a.name.localeCompare(b.name)), 
    []
  );

  // Filter drugs based on search term (searches name, category, and indication)
  const filteredDrugs = useMemo(() => sortedDrugs.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (drug.indication && drug.indication.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [searchTerm, sortedDrugs]);

  /**
   * ==========================================================================
   * CALCULATE DOSE - Weight-based pediatric dose calculator
   * ==========================================================================
   * 
   * Calculates appropriate dose based on patient weight and drug specifications.
   * Handles different unit types and enforces maximum dose limits.
   * 
   * UNIT HANDLING:
   * - Rate-based (mcg/kg/min): Returns rate as-is (NOT multiplied by weight)
   *   Example: Dopamine 2-5 mcg/kg/min -> displays "2 - 5" with unit shown separately
   * 
   * - g/kg: Returns dose in grams (multiplied by weight)
   *   Example: Dextrose 0.5 g/kg for 10kg -> displays "5.00 g"
   * 
   * - mL: Returns dose in milliliters (multiplied by weight)
   *   Example: Racemic Epi 0.5 mL for 10kg -> displays "5.00 mL"
   * 
   * - mcg: Returns dose in micrograms (multiplied by weight)
   *   Example: Fentanyl 1 mcg/kg for 10kg -> displays "10.0 mcg"
   * 
   * - mg (default): Returns dose in milligrams with max dose capping
   *   Example: Ibuprofen 10 mg/kg for 100kg -> capped at max 2400mg/day
   * 
   * @param {string} doseStr - Dose value as string (e.g., "5-10", "0.5")
   * @param {number} weight - Patient weight in kg
   * @param {number|null} maxDose - Maximum dose limit (optional)
   * @param {string} maxUnit - Unit for max dose display (default: "mg")
   * @param {string} doseUnit - Unit string from drug data (e.g., "mg/kg/dose q8h")
   * 
   * @returns {Object} { dose: string, isExceedingMax: boolean, maxDisplay: string|null }
   * ==========================================================================
   */
  const calculateDose = (doseStr, weight, maxDose = null, maxUnit = "mg", doseUnit = "", isFixed = false) => {
    if (!doseStr) return null;
    if (doseStr.includes("See age")) return doseStr;
    
    // ========================================================================
    // FIXED DOSE (not weight-based) - e.g., Budesonide for croup
    // Just return the dose as-is without multiplying by weight
    // ========================================================================
    if (isFixed) {
      return {
        dose: `${doseStr}`,
        isExceedingMax: false,
        maxDisplay: null,
        isFixed: true
      };
    }
    
    if (!weight) return null;
    
    // ========================================================================
    // RATE-BASED DOSING (mcg/kg/min, mcg/kg/hr)
    // For continuous infusions like Dopamine, Dobutamine, Epinephrine infusion
    // These are rates - do NOT multiply by weight, just display the rate range
    // ========================================================================
    if (doseUnit.includes("/min") || doseUnit.includes("/hr") || doseUnit.includes("/hour")) {
      const parts = doseStr.split("-");
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]) || min;
      
      if (isNaN(min)) return null;
      
      return {
        dose: `${min}${max !== min ? ` - ${max}` : ''}`,
        isExceedingMax: false,
        maxDisplay: null,
        isRate: true
      };
    }
    
    // ========================================================================
    // DETERMINE IF THIS IS A PER-DOSE OR PER-DAY MEDICATION
    // Per-dose: mg/kg/dose, mg/kg q8h (no "divided" or "day")
    // Per-day: mg/kg/day divided q8h
    // ========================================================================
    const isPerDose = doseUnit.includes("/dose") || 
                      (doseUnit.includes("q") && !doseUnit.includes("day") && !doseUnit.includes("divided"));
    const isPerDay = doseUnit.includes("/day") || doseUnit.includes("divided");
    
    const parts = doseStr.split("-");
    const min = parseFloat(parts[0]);
    const max = parseFloat(parts[1]) || min;
    
    if (isNaN(min)) return null;
    
    let calculatedMin = min * weight;
    let calculatedMax = max * weight;
    let unit = "mg";
    let isExceedingMax = false;
    let maxDisplay = null;
    
    // Check for g unit (e.g., Dextrose) - check this before mL since some g/kg units mention mL
    if (doseUnit.includes("g/kg") && !doseUnit.includes("mg") && !doseUnit.includes("mcg")) {
      unit = "g";
      return {
        dose: `${calculatedMin.toFixed(2)}${calculatedMax !== calculatedMin ? ` - ${calculatedMax.toFixed(2)}` : ''} ${unit}`,
        isExceedingMax: false,
        maxDisplay: null
      };
    }
    
    // Check for mL unit (e.g., Racemic Epinephrine) - only pure mL dosing
    if ((doseUnit.includes("mL") || doseUnit.includes("ml")) && !doseUnit.includes("g/kg")) {
      unit = "mL";
      return {
        dose: `${calculatedMin.toFixed(2)}${calculatedMax !== calculatedMin ? ` - ${calculatedMax.toFixed(2)}` : ''} ${unit}`,
        isExceedingMax: false,
        maxDisplay: null
      };
    }
    
    // Check for mcg unit (e.g., bolus doses)
    if (doseUnit.includes("mcg") && !doseUnit.includes("/min") && !doseUnit.includes("/hr")) {
      unit = "mcg";
      if (maxDose) {
        if (calculatedMax > maxDose) {
          isExceedingMax = true;
          maxDisplay = `${maxDose} ${unit}`;
          calculatedMax = maxDose;
          calculatedMin = Math.min(calculatedMin, maxDose);
        }
      }
      return {
        dose: `${calculatedMin.toFixed(1)}${calculatedMax !== calculatedMin ? ` - ${calculatedMax.toFixed(1)}` : ''} ${unit}`,
        isExceedingMax,
        maxDisplay
      };
    }
    
    if (doseUnit.includes("units") || doseStr.includes("units")) {
      const multiplier = doseStr.includes("50000") || doseStr.includes("75000") ? 1000 : 1;
      calculatedMin = (min * weight) / multiplier;
      calculatedMax = (max * weight) / multiplier;
      unit = "K units";
      return {
        dose: `${calculatedMin.toFixed(0)}${calculatedMax !== calculatedMin ? ` - ${calculatedMax.toFixed(0)}` : ''} ${unit}`,
        isExceedingMax: false,
        maxDisplay: null,
        isPerDose: false
      };
    }
    
    // Standard mg calculation with max dose check
    if (maxDose) {
      if (calculatedMax > maxDose) {
        isExceedingMax = true;
        maxDisplay = `${maxDose} ${maxUnit}`;
        calculatedMax = maxDose;
        calculatedMin = Math.min(calculatedMin, maxDose);
      }
    }
    
    // Add dosing type label
    const doseLabel = isPerDose ? "/dose" : isPerDay ? "/day" : "";
    
    // Extract frequency from unit string
    let frequency = null;
    let divisor = 1;
    const unitLower = doseUnit.toLowerCase();
    
    // Match frequency patterns - order matters (more specific first)
    if (unitLower.includes("q4h") && !unitLower.includes("q4-")) { frequency = "q4h"; divisor = 6; }
    else if (unitLower.includes("q4-6h")) { frequency = "q4-6h"; divisor = 5; }
    else if (unitLower.includes("q6h") && !unitLower.includes("q6-")) { frequency = "q6h"; divisor = 4; }
    else if (unitLower.includes("q6-8h")) { frequency = "q6-8h"; divisor = 3; }
    else if (unitLower.includes("q6-12h")) { frequency = "q6-12h"; divisor = 3; } // Average of 4 and 2
    else if (unitLower.includes("q8h") && !unitLower.includes("q8-")) { frequency = "q8h"; divisor = 3; }
    else if (unitLower.includes("q12h") && !unitLower.includes("q12-")) { frequency = "q12h"; divisor = 2; }
    else if (unitLower.includes("q12-24h")) { frequency = "q12-24h"; divisor = 2; }
    else if (unitLower.includes("q24h") || unitLower.includes("once daily")) { frequency = "q24h"; divisor = 1; }
    
    // Calculate per-dose amount if this is a daily dose that needs dividing
    let perDoseMin = null;
    let perDoseMax = null;
    if (isPerDay && divisor > 1) {
      perDoseMin = (calculatedMin / divisor).toFixed(1);
      perDoseMax = (calculatedMax / divisor).toFixed(1);
    }
    
    return {
      dose: `${calculatedMin.toFixed(1)}${calculatedMax !== calculatedMin ? ` - ${calculatedMax.toFixed(1)}` : ''} ${unit}`,
      isExceedingMax,
      maxDisplay,
      isPerDose,
      isPerDay,
      doseLabel,
      frequency,
      divisor,
      perDoseMin,
      perDoseMax
    };
  };

  // Parse max dose string from drug data (e.g., "800 mg PO, 20 mg/kg IV" -> extract first number)
  const parseMaxDose = (maxStr, weight = null) => {
    if (!maxStr || maxStr === "See protocol") return null;
    
    // Check if this is a weight-based max (mg/kg) - don't apply fixed cap
    if (maxStr.includes('/kg')) {
      // Weight-based max - need to calculate based on patient weight
      if (weight && weight > 0) {
        // Extract the mg/kg value
        const perKgMatch = maxStr.match(/(\d+(?:\.\d+)?)\s*mg\/kg/i);
        if (perKgMatch) {
          return parseFloat(perKgMatch[1]) * weight;
        }
      }
      // If no weight or can't parse, return null (no cap)
      return null;
    }
    
    // Try to extract numeric max dose for fixed doses
    // Common formats: "800 mg", "3 g/day", "1.5 g/day", "6 mg first", "1.2g IV/dose"
    const patterns = [
      { regex: /(\d+(?:\.\d+)?)\s*g\/day/i, multiplier: 1000 },  // "3 g/day" -> 3000 mg
      { regex: /(\d+(?:\.\d+)?)\s*mg(?!\/kg)/i, multiplier: 1 },  // "800 mg" but NOT "mg/kg"
      { regex: /(\d+(?:\.\d+)?)\s*g(?!r)/i, multiplier: 1000 },  // "3 g" or "1.2g" -> mg (not gr)
      { regex: /(\d+(?:\.\d+)?)\s*mcg/i, multiplier: 1 },  // mcg doses
    ];
    
    for (const { regex, multiplier } of patterns) {
      const match = maxStr.match(regex);
      if (match) {
        let value = parseFloat(match[1]) * multiplier;
        return value;
      }
    }
    return null;
  };

  // GFR category colors
  const getGFRColor = () => {
    if (!gfr) return "";
    const gfrNum = parseFloat(gfr);
    if (gfrNum >= 90) return "text-green-600";
    if (gfrNum >= 60) return "text-green-500";
    if (gfrNum >= 30) return "text-yellow-600";
    if (gfrNum >= 15) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4 pt-4 pb-4">
      {/* Search and Weight Input */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search drugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Weight Input */}
          <div>
            <Label className="text-[10px] text-muted-foreground">Weight (kg)</Label>
            <Input
              type="number"
              placeholder="Enter weight for dose calculations"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              className="font-mono text-sm h-9"
            />
          </div>

          {/* GFR Calculator Toggle */}
          <button 
            onClick={() => setShowGFRCalc(!showGFRCalc)}
            className="w-full flex items-center justify-between p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs"
          >
            <span className="font-medium">🧪 GFR Calculator (for renal dosing)</span>
            <span>{showGFRCalc ? '▲' : '▼'}</span>
          </button>

          {/* GFR Calculator */}
          {showGFRCalc && (
            <div className="p-3 rounded border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 space-y-3">
              <p className="text-[10px] text-muted-foreground font-medium">Schwartz Equation for Pediatric GFR</p>
              
              {/* Equation Type Toggle */}
              <div>
                <Label className="text-[10px] text-muted-foreground mb-1 block">Equation Type</Label>
                <div className="flex rounded-lg border border-amber-300 dark:border-amber-700 overflow-hidden">
                  <button
                    onClick={() => setSchwartzType("revised")}
                    className={`flex-1 px-2 py-1.5 text-[10px] font-medium transition-colors ${
                      schwartzType === "revised"
                        ? "bg-amber-500 text-white"
                        : "bg-white dark:bg-gray-800 text-muted-foreground"
                    }`}
                  >
                    Revised (2009)
                  </button>
                  <button
                    onClick={() => setSchwartzType("original")}
                    className={`flex-1 px-2 py-1.5 text-[10px] font-medium transition-colors ${
                      schwartzType === "original"
                        ? "bg-amber-500 text-white"
                        : "bg-white dark:bg-gray-800 text-muted-foreground"
                    }`}
                  >
                    Original
                  </button>
                </div>
                <p className="text-[8px] text-muted-foreground mt-1">
                  {schwartzType === "revised" 
                    ? "Bedside Schwartz: single k=0.413 for ages 1-17 (CKiD study)" 
                    : "Original: age-specific k values for all pediatric ages"}
                </p>
              </div>

              {/* Age Category Selection - Only show for Original Schwartz */}
              {schwartzType === "original" && (
                <div>
                  <Label className="text-[10px] text-muted-foreground mb-1 block">Age Category (affects k value)</Label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setAgeCategory("preterm")}
                      className={`px-2 py-1.5 text-[10px] rounded transition-colors ${
                        ageCategory === "preterm" ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 border"
                      }`}
                    >
                      Preterm (k=0.33)
                    </button>
                    <button
                      onClick={() => setAgeCategory("term")}
                      className={`px-2 py-1.5 text-[10px] rounded transition-colors ${
                        ageCategory === "term" ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 border"
                      }`}
                    >
                      Term &lt;1y (k=0.45)
                    </button>
                    <button
                      onClick={() => setAgeCategory("child")}
                      className={`px-2 py-1.5 text-[10px] rounded transition-colors ${
                        ageCategory === "child" ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 border"
                      }`}
                    >
                      Child 1-13y (k=0.55)
                    </button>
                    <button
                      onClick={() => setAgeCategory("adolescentM")}
                      className={`px-2 py-1.5 text-[10px] rounded transition-colors ${
                        ageCategory === "adolescentM" ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 border"
                      }`}
                    >
                      Adol. Male &gt;13y (k=0.70)
                    </button>
                    <button
                      onClick={() => setAgeCategory("adolescentF")}
                      className={`col-span-2 px-2 py-1.5 text-[10px] rounded transition-colors ${
                        ageCategory === "adolescentF" ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 border"
                      }`}
                    >
                      Adol. Female &gt;13y (k=0.55)
                    </button>
                  </div>
                </div>
              )}

              {/* Height and Creatinine Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="font-mono text-sm h-8"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Creatinine (µmol/L)</Label>
                  <Input
                    type="number"
                    step="1"
                    placeholder="SCr"
                    value={creatinine}
                    onChange={(e) => setCreatinine(e.target.value)}
                    className="font-mono text-sm h-8"
                  />
                </div>
              </div>

              {/* GFR Result */}
              {gfr && (
                <div className="p-2 rounded bg-white dark:bg-gray-800 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Estimated GFR {schwartzType === "original" ? `(${getAgeCategoryLabel()})` : "(Ages 1-17)"}
                      </p>
                      <p className={`text-lg font-bold font-mono ${getGFRColor()}`}>
                        {gfr} <span className="text-xs font-normal">mL/min/1.73m²</span>
                      </p>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                      k={schwartzType === "revised" ? "0.413" : getKValue()}
                    </span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">
                    {parseFloat(gfr) >= 90 && "Normal kidney function"}
                    {parseFloat(gfr) >= 60 && parseFloat(gfr) < 90 && "Mildly decreased (CKD Stage 2)"}
                    {parseFloat(gfr) >= 30 && parseFloat(gfr) < 60 && "Moderately decreased (CKD Stage 3)"}
                    {parseFloat(gfr) >= 15 && parseFloat(gfr) < 30 && "Severely decreased (CKD Stage 4)"}
                    {parseFloat(gfr) < 15 && "Kidney failure (CKD Stage 5)"}
                  </p>
                </div>
              )}

              {/* Formula Reference */}
              <div className="text-[8px] text-muted-foreground space-y-0.5 pt-1 border-t border-amber-200 dark:border-amber-700">
                {schwartzType === "revised" ? (
                  <>
                    <p className="font-medium">Revised (Bedside) Schwartz Formula:</p>
                    <p>eGFR = 0.413 × Height(cm) / SCr(mg/dL)</p>
                    <p>eGFR = 36.5 × Height(cm) / SCr(µmol/L)</p>
                    <p className="text-amber-600 dark:text-amber-400">Ref: Schwartz GJ et al. JASN 2009 (CKiD study)</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">Original Schwartz Formula:</p>
                    <p>eGFR = k × Height(cm) / SCr(mg/dL)</p>
                    <p>eGFR = k × 88.4 × Height(cm) / SCr(µmol/L)</p>
                    <p>k: Preterm=0.33, Term=0.45, Child=0.55, Adol.♂=0.70, Adol.♀=0.55</p>
                    <p className="text-amber-600 dark:text-amber-400">Ref: Schwartz GJ et al. J Pediatr 1976</p>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drug Count */}
      <p className="text-xs text-muted-foreground px-1">
        Showing {filteredDrugs.length} of {sortedDrugs.length} drugs
        {gfr && <span className="ml-2 text-amber-600">• GFR: {gfr} mL/min/1.73m²</span>}
      </p>

      {/* Drug List */}
      <div className="space-y-3">
        {filteredDrugs.map((drug) => {
          const isExpanded = expandedDrug === drug.id;
          const doseKeys = drug.doses ? Object.keys(drug.doses) : [];
          const firstDoseKey = doseKeys[0];
          const firstDose = drug.doses?.[firstDoseKey];
          
          return (
            <Card 
              key={drug.id} 
              className="nightingale-card cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              onClick={() => setExpandedDrug(isExpanded ? null : drug.id)}
            >
              <CardContent className="p-4 min-h-[88px]">
                {/* Drug Header - Two-row layout with unified container size */}
                <div className="space-y-3">
                  {/* Row 1: Drug Name and Category */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0 relative">
                      <h3 
                        className={`font-semibold text-base leading-tight whitespace-nowrap ${
                          isExpanded && drug.name.length > 15 
                            ? 'md:overflow-hidden md:text-ellipsis' 
                            : 'overflow-hidden text-ellipsis'
                        }`}
                      >
                        <span 
                          className={
                            isExpanded && drug.name.length > 15 
                              ? 'inline-block animate-scroll-right md:animate-none' 
                              : ''
                          }
                        >
                          {drug.name}
                        </span>
                      </h3>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {drug.category}
                    </span>
                  </div>
                  
                  {/* Row 2: Dosing Info and Calculated Dose */}
                  <div className="flex items-center justify-between gap-4 pt-1">
                    {/* Left: First dose info */}
                    {firstDose && (
                      <div className="text-xs text-muted-foreground flex-1 min-w-0">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{firstDose.label}:</span>{' '}
                        <span className="font-mono">{firstDose.value} {firstDose.unit}</span>
                      </div>
                    )}
                    
                    {/* Right: Calculated Dose */}
                    {w > 0 && firstDose && (
                      <div className="text-right flex-shrink-0">
                        {(() => {
                          const doseSpecificMax = firstDose.maxDose;
                          const maxDoseValue = doseSpecificMax || parseMaxDose(drug.max, w);
                          const result = calculateDose(firstDose.value, w, maxDoseValue, "mg", firstDose.unit, firstDose.isFixed || drug.isFixedDose);
                          if (!result) return null;
                          const doseResult = typeof result === 'string' ? { dose: result, isExceedingMax: false } : result;
                          
                          const showPerDose = doseResult.isPerDay && doseResult.divisor > 1 && doseResult.perDoseMin;
                          
                          let displayFreq = doseResult.frequency;
                          if (!displayFreq) {
                            const unitLower = firstDose.unit.toLowerCase();
                            const freqMatch = unitLower.match(/q(\d+(?:-\d+)?h)/);
                            if (freqMatch) displayFreq = freqMatch[0];
                            else if (unitLower.includes('once daily') || unitLower.includes('q24h')) displayFreq = 'q24h';
                            else if (unitLower.includes('q12h')) displayFreq = 'q12h';
                            else if (unitLower.includes('q8h')) displayFreq = 'q8h';
                            else if (unitLower.includes('q6h')) displayFreq = 'q6h';
                          }
                          
                          return (
                            <div className="flex items-center gap-2">
                              {showPerDose ? (
                                <>
                                  <span className={`text-base font-mono font-bold ${doseResult.isExceedingMax ? 'text-amber-600' : 'text-green-600'}`}>
                                    {doseResult.perDoseMin === doseResult.perDoseMax 
                                      ? `${doseResult.perDoseMin} mg` 
                                      : `${doseResult.perDoseMin}-${doseResult.perDoseMax} mg`}
                                  </span>
                                  {displayFreq && (
                                    <span className="font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs">{displayFreq}</span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span className={`text-base font-mono font-bold ${doseResult.isExceedingMax ? 'text-amber-600' : 'text-blue-600'}`}>
                                    {doseResult.dose}
                                  </span>
                                  {displayFreq && (
                                    <span className="font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs">{displayFreq}</span>
                                  )}
                                </>
                              )}
                              {doseResult.isExceedingMax && (
                                <span className="text-xs text-amber-600 font-medium">⚠️</span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-4" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Quick Info Bar */}
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        📍 {drug.route}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium">
                        ⚠️ Max: {drug.max}
                      </span>
                    </div>

                    {/* Dosing Table (from formulary PDF) */}
                    {drug.dosingTable && (
                      <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                        <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-1">
                          <span>📊</span> {drug.dosingTable.title}
                          {w > 0 && <span className="ml-auto text-emerald-600 dark:text-emerald-400 text-[10px]">⚖️ {w} kg</span>}
                        </p>
                        <div className="overflow-x-auto -mx-3 px-3 pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                          <table className="text-xs border-collapse w-max">
                            <thead>
                              <tr className="bg-indigo-100 dark:bg-indigo-900/40">
                                {drug.dosingTable.columns.map((col, idx) => (
                                  <th key={idx} className="px-4 py-2 text-left font-semibold text-indigo-800 dark:text-indigo-200 border-r border-indigo-200 dark:border-indigo-700 last:border-r-0" style={{ minWidth: '80px' }}>
                                    {col}
                                  </th>
                                ))}
                                {/* Add calculated dose column header if weight entered and table has dose data */}
                                {w > 0 && drug.dosingTable.columns.some(col => 
                                  col.toLowerCase().includes('dose') || 
                                  col.toLowerCase().includes('mg') ||
                                  col.toLowerCase().includes('weight')
                                ) && (
                                  <th className="px-4 py-2 text-left font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40" style={{ minWidth: '100px' }}>
                                    Calc ({w}kg)
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {drug.dosingTable.rows.map((row, rowIdx) => {
                                // Calculate dose for this row if applicable
                                let calculatedDose = null;
                                let isMatchingRow = false;
                                
                                if (w > 0) {
                                  // Find dose column
                                  const doseColIdx = drug.dosingTable.columns.findIndex(col => 
                                    col.toLowerCase().includes('dose') || col.toLowerCase().includes('mg')
                                  );
                                  // Check if table has a weight column (weight-range based table)
                                  const weightColIdx = drug.dosingTable.columns.findIndex(col => 
                                    col.toLowerCase().includes('weight')
                                  );
                                  
                                  // For tables WITH weight ranges (like Paracetamol)
                                  if (weightColIdx >= 0) {
                                    const weightCell = row[weightColIdx];
                                    if (weightCell) {
                                      const weightStr = weightCell.toString();
                                      const rangeMatch = weightStr.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
                                      const gtMatch = weightStr.match(/[>≥]\s*(\d+(?:\.\d+)?)/);
                                      const ltMatch = weightStr.match(/[<≤]\s*(\d+(?:\.\d+)?)/);
                                      
                                      if (rangeMatch) {
                                        isMatchingRow = w >= parseFloat(rangeMatch[1]) && w <= parseFloat(rangeMatch[2]);
                                      } else if (gtMatch) {
                                        isMatchingRow = w >= parseFloat(gtMatch[1]);
                                      } else if (ltMatch) {
                                        isMatchingRow = w < parseFloat(ltMatch[1]);
                                      }
                                      
                                      // Show the fixed dose from table if matches
                                      if (isMatchingRow && doseColIdx >= 0) {
                                        calculatedDose = '✓ ' + row[doseColIdx];
                                      }
                                    }
                                  } 
                                  // For tables WITHOUT weight column but with mg/kg doses (like Amikacin)
                                  else if (doseColIdx >= 0) {
                                    const doseCell = row[doseColIdx];
                                    if (doseCell) {
                                      const doseStr = doseCell.toString();
                                      // Check if it's mg/kg or similar per-kg dosing
                                      if (doseStr.toLowerCase().includes('mg/kg') || doseStr.toLowerCase().includes('/kg')) {
                                        const numMatch = doseStr.match(/(\d+(?:\.\d+)?)/);
                                        if (numMatch) {
                                          const dosePerKg = parseFloat(numMatch[1]);
                                          calculatedDose = (dosePerKg * w).toFixed(1) + ' mg';
                                        }
                                      } else {
                                        // Check if it's just a number (assumed to be mg/kg for some tables)
                                        const numMatch = doseStr.match(/^(\d+(?:\.\d+)?)\s*(?:mg\/kg)?$/i);
                                        if (numMatch && doseStr.toLowerCase().includes('mg')) {
                                          const dosePerKg = parseFloat(numMatch[1]);
                                          calculatedDose = (dosePerKg * w).toFixed(1) + ' mg';
                                        }
                                      }
                                    }
                                  }
                                }
                                
                                return (
                                  <tr key={rowIdx} className={`${rowIdx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-indigo-50/50 dark:bg-indigo-900/10'} ${isMatchingRow ? 'ring-2 ring-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : ''}`}>
                                    {row.map((cell, cellIdx) => (
                                      <td key={cellIdx} className={`px-4 py-2 font-mono text-slate-700 dark:text-slate-300 border-r border-indigo-100 dark:border-indigo-800 last:border-r-0 ${isMatchingRow ? 'font-bold' : ''}`} style={{ minWidth: '80px' }}>
                                        {cell}
                                      </td>
                                    ))}
                                    {/* Add calculated dose cell */}
                                    {w > 0 && drug.dosingTable.columns.some(col => 
                                      col.toLowerCase().includes('dose') || 
                                      col.toLowerCase().includes('mg') ||
                                      col.toLowerCase().includes('weight')
                                    ) && (
                                      <td className={`px-4 py-2 font-mono font-bold ${isMatchingRow ? 'text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-800/40' : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20'}`} style={{ minWidth: '100px' }}>
                                        {calculatedDose || '—'}
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1">
                          👆 Swipe table to see all columns
                        </p>
                      </div>
                    )}

                    {/* Age-Based Dosing Table */}
                    {drug.ageDosing && (
                      <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                        <p className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
                          <span>👶</span> Age-Based Dosing
                        </p>
                        <div className="space-y-1.5">
                          {drug.ageDosing.map((ad, idx) => (
                            <div key={idx} className="flex justify-between text-xs bg-white dark:bg-slate-800 p-1.5 rounded">
                              <span className="text-muted-foreground font-medium">{ad.age}</span>
                              <span className="font-mono text-purple-600 dark:text-purple-400">{ad.dose}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Calculated Doses - Improved Layout */}
                    {w > 0 && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span>💊</span> {drug.isFixedDose ? "Fixed Doses (not weight-based)" : `Calculated Doses for ${w} kg`}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {doseKeys.map(key => {
                            const doseData = drug.doses[key];
                            const doseSpecificMax = doseData.maxDose;
                            const maxDoseValue = doseSpecificMax || parseMaxDose(drug.max, w);
                            const result = calculateDose(doseData.value, w, maxDoseValue, "mg", doseData.unit, doseData.isFixed || drug.isFixedDose);
                            if (!result) return null;
                            const doseResult = typeof result === 'string' ? { dose: result, isExceedingMax: false } : result;
                            
                            // Check if this is a divided daily dose
                            const showDividedDose = doseResult.isPerDay && doseResult.divisor > 1 && doseResult.perDoseMin;
                            
                            return (
                              <div 
                                key={key} 
                                className={`p-3 rounded-lg border ${
                                  doseResult.isExceedingMax 
                                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' 
                                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                }`}
                              >
                                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                                  {doseData.label}
                                </p>
                                
                                {/* Show per-dose amount prominently for divided doses */}
                                {showDividedDose ? (
                                  <>
                                    {/* Per Dose - Main Display */}
                                    <div className="flex items-baseline gap-1 flex-wrap">
                                      <p className="text-lg font-mono font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                                        {doseResult.perDoseMin === doseResult.perDoseMax 
                                          ? `${doseResult.perDoseMin} mg` 
                                          : `${doseResult.perDoseMin}-${doseResult.perDoseMax} mg`}
                                      </p>
                                      <span className="text-xs text-slate-500">/dose</span>
                                    </div>
                                    
                                    {/* Frequency and total */}
                                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                                      <span className="font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm">
                                        {doseResult.frequency}
                                      </span>
                                      <span className="ml-2 whitespace-nowrap">
                                        × {doseResult.divisor} doses = <span className="font-mono font-bold">{doseResult.dose}</span>/day
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {/* Standard dose display */}
                                    <div className="flex items-baseline gap-1 flex-wrap">
                                      <p className={`text-lg font-mono font-bold whitespace-nowrap ${
                                        doseResult.isExceedingMax ? 'text-amber-600' : 'text-blue-600 dark:text-blue-400'
                                      }`}>
                                        {doseResult.dose}
                                      </p>
                                      {doseResult.isPerDay && (
                                        <span className="text-xs text-slate-500">/day</span>
                                      )}
                                      {doseResult.isPerDose && (
                                        <span className="text-xs text-slate-500">/dose</span>
                                      )}
                                    </div>
                                    
                                    {/* Show frequency if available */}
                                    {doseResult.frequency && (
                                      <p className="mt-2">
                                        <span className="font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm">
                                          {doseResult.frequency}
                                        </span>
                                      </p>
                                    )}
                                  </>
                                )}
                                
                                {/* Original dosing instruction */}
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-2 border-t border-slate-200 dark:border-slate-700 pt-1">
                                  {doseData.value} {doseData.unit}
                                </p>
                                
                                {doseResult.isExceedingMax && (
                                  <p className="text-[10px] text-amber-600 font-medium mt-2 flex items-center gap-1">
                                    <span>⚠️</span> Capped at max: {doseSpecificMax ? `${doseSpecificMax} mg` : drug.max}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Dose Table (when no weight) - Improved */}
                    {!w && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span>📋</span> Dosing Reference
                        </p>
                        <div className="space-y-1.5">
                          {doseKeys.map(key => (
                            <div key={key} className="flex justify-between items-start p-2 rounded bg-slate-50 dark:bg-slate-800/50 text-xs">
                              <span className="font-medium text-slate-600 dark:text-slate-300">{drug.doses[key].label}</span>
                              <span className="font-mono text-blue-600 dark:text-blue-400 text-right ml-2">
                                {drug.doses[key].value} {drug.doses[key].unit}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                          <span>💡</span> Enter patient weight above for calculated doses
                        </p>
                      </div>
                    )}

                    {/* Indication - Cleaner */}
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <p className="text-[11px] font-semibold text-green-700 dark:text-green-300 mb-1 flex items-center gap-1">
                        <span>🎯</span> Indications
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{drug.indication}</p>
                    </div>

                    {/* Notes - Clinical Pearls */}
                    {drug.notes && (
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                          <span>📝</span> Clinical Notes
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{drug.notes}</p>
                      </div>
                    )}

                    {/* Renal Adjustment */}
                    {drug.renalAdjust && (
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-1">
                          <span>🩺</span> Renal Dose Adjustment
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="bg-white dark:bg-slate-800 p-2 rounded">
                            <span className="text-muted-foreground block">GFR 30-50:</span>
                            <span className="font-mono font-medium">{drug.renalAdjust.gfr50}</span>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-2 rounded">
                            <span className="text-muted-foreground block">GFR 10-30:</span>
                            <span className="font-mono font-medium">{drug.renalAdjust.gfr30}</span>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-2 rounded">
                            <span className="text-muted-foreground block">GFR &lt;10:</span>
                            <span className="font-mono font-medium">{drug.renalAdjust.gfr10}</span>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-2 rounded">
                            <span className="text-muted-foreground block">Hemodialysis:</span>
                            <span className="font-mono font-medium">{drug.renalAdjust.hd}</span>
                          </div>
                        </div>
                        {gfr && (
                          <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-700">
                            <p className="text-[10px] text-amber-700 dark:text-amber-300">
                              <span className="font-medium">Current GFR ({gfr}):</span>{" "}
                              {parseFloat(gfr) >= 50 && drug.renalAdjust.gfr50}
                              {parseFloat(gfr) >= 30 && parseFloat(gfr) < 50 && drug.renalAdjust.gfr50}
                              {parseFloat(gfr) >= 10 && parseFloat(gfr) < 30 && drug.renalAdjust.gfr30}
                              {parseFloat(gfr) < 10 && drug.renalAdjust.gfr10}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Available Formulations */}
                    {drug.formulations && drug.formulations.length > 0 && (
                      <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                        <p className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 mb-2 flex items-center gap-1">
                          <span>💊</span> Available Formulations
                        </p>
                        <div className="space-y-1">
                          {drug.formulations.map((form, idx) => (
                            <div key={idx} className="text-xs flex justify-between bg-white dark:bg-slate-800 p-1.5 rounded">
                              <span className="font-medium text-cyan-700 dark:text-cyan-300">{form.type}</span>
                              <span className="font-mono text-slate-600 dark:text-slate-400">{form.strengths}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contraindications */}
                    {drug.contraindications && drug.contraindications.length > 0 && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-[11px] font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-1">
                          <span>🚫</span> Contraindications
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                          {drug.contraindications.map((ci, idx) => (
                            <li key={idx}>{ci}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warnings */}
                    {drug.warnings && drug.warnings.length > 0 && (
                      <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                        <p className="text-[11px] font-semibold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-1">
                          <span>⚠️</span> Warnings & Precautions
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                          {drug.warnings.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Side Effects */}
                    {drug.sideEffects && drug.sideEffects.length > 0 && (
                      <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
                        <p className="text-[11px] font-semibold text-pink-700 dark:text-pink-300 mb-2 flex items-center gap-1">
                          <span>⚡</span> Side Effects
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                          {drug.sideEffects.map((se, idx) => (
                            <li key={idx}>{se}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Drug Interactions */}
                    {drug.interactions && drug.interactions.length > 0 && (
                      <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                        <p className="text-[11px] font-semibold text-violet-700 dark:text-violet-300 mb-2 flex items-center gap-1">
                          <span>🔄</span> Drug Interactions
                        </p>
                        <div className="overflow-x-auto -mx-3 px-3 pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                          <table className="text-xs border-collapse w-max">
                            <thead>
                              <tr className="bg-violet-100 dark:bg-violet-900/40">
                                <th className="px-4 py-2 text-left font-semibold text-violet-800 dark:text-violet-200 border-r border-violet-200 dark:border-violet-700" style={{ minWidth: '120px' }}>Drug</th>
                                <th className="px-4 py-2 text-left font-semibold text-violet-800 dark:text-violet-200" style={{ minWidth: '200px' }}>Effect</th>
                              </tr>
                            </thead>
                            <tbody>
                              {drug.interactions.map((int, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-violet-50/50 dark:bg-violet-900/10'}>
                                  <td className="px-4 py-2 font-medium text-violet-700 dark:text-violet-300 border-r border-violet-100 dark:border-violet-800" style={{ minWidth: '120px' }}>{int.drug}</td>
                                  <td className="px-4 py-2 text-slate-600 dark:text-slate-400" style={{ minWidth: '200px' }}>{int.effect}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1">
                          👆 Swipe to see full interaction details
                        </p>
                      </div>
                    )}

                    {/* Hepatic Adjustment */}
                    {drug.hepaticAdjust && (
                      <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-[11px] font-semibold text-yellow-700 dark:text-yellow-300 mb-1 flex items-center gap-1">
                          <span>🫁</span> Hepatic Adjustment
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{drug.hepaticAdjust}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDrugs.length === 0 && (
        <Card className="nightingale-card">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground text-sm">No drugs found matching &quot;{searchTerm}&quot;</p>
          </CardContent>
        </Card>
      )}

      {/* Reference */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Reference: Harriet Lane Handbook 23rd Ed (2023)</p>
          <p>• Always verify doses and adjust for renal/hepatic function</p>
          <p>• Monitor drug levels for aminoglycosides, vancomycin</p>
          <p>• Check for drug interactions and allergies</p>
          <p>• GFR calculation uses Schwartz equation with age-specific k values</p>
        </CardContent>
      </Card>
    </div>
  );
};
// Export the component
export default DrugsPage;
