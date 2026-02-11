/**
 * Electrolytes Correction Dialog
 * 
 * Simplified calculator with:
 * - Dropdown to select electrolyte
 * - Dose range displayed prominently
 * - Dose slider/input within allowed range
 * - Calculation results with preparation instructions
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Calculator, AlertCircle, Clock, AlertTriangle, CheckCircle, Syringe } from "lucide-react";

const ElectrolytesDialog = ({ open, onOpenChange }) => {
  const [weight, setWeight] = useState("");
  const [selectedElectrolyte, setSelectedElectrolyte] = useState("calcium");
  const [results, setResults] = useState(null);
  const [customDose, setCustomDose] = useState("");
  const [roundToFives, setRoundToFives] = useState(false); // Round dose to nearest 5
  const w = parseFloat(weight) || 0;

  // Helper function to round to nearest multiple of 5
  const roundToFive = (value) => Math.round(value / 5) * 5;

  // Electrolyte-specific states
  const [calciumLevel, setCalciumLevel] = useState("");
  const [sodiumType, setSodiumType] = useState("hyponatremia");
  const [hyponatremiaType, setHyponatremiaType] = useState("mild");
  const [hyponatremiaMethod, setHyponatremiaMethod] = useState("standard"); // "standard" or "3percent"
  const [naMaintenanceRate, setNaMaintenanceRate] = useState("2"); // 2-5 mEq/kg/day
  const [hypernatremiaMethod, setHypernatremiaMethod] = useState("nelson"); // "nelson" or "harriet"
  const [currentNa, setCurrentNa] = useState("");
  const [targetNa, setTargetNa] = useState("145"); // Desired Na for correction
  const [fluidDeficit, setFluidDeficit] = useState(""); // For Hyponatremia
  const [harrietDeficitType, setHarrietDeficitType] = useState("infant"); // "infant" or "child"
  const [harrietDeficitPercent, setHarrietDeficitPercent] = useState("10"); // "5", "10", "15" for infant; "3", "6", "9" for child
  const [hypoDeficitType, setHypoDeficitType] = useState("infant"); // For hyponatremia mild
  const [hypoDeficitPercent, setHypoDeficitPercent] = useState("10"); // For hyponatremia mild
  const [phosphateSeverity, setPhosphateSeverity] = useState("moderate");
  const [potassiumRoute, setPotassiumRoute] = useState("IV"); // "IV" or "PO"
  const [potassiumLineType, setPotassiumLineType] = useState("peripheral"); // "peripheral", "central", "central_restricted"
  const [kclPoFrequency, setKclPoFrequency] = useState("BD");
  
  // NaHCO3 correction states
  const [nahco3Method, setNahco3Method] = useState("hco3"); // "hco3", "be", or "infusion"
  const [labHco3, setLabHco3] = useState("");
  const [desiredHco3, setDesiredHco3] = useState("24");
  const [baseExcess, setBaseExcess] = useState("");
  const [infusionRate, setInfusionRate] = useState("1"); // mEq/kg/hr

  // Electrolyte definitions with dose ranges
  const electrolytes = {
    calcium: {
      name: "Calcium",
      medication: "Calcium Gluconate 10%",
      doseRange: "50-100 mg/kg/dose (Max 1g)",
      doseMin: 50,
      doseMax: 100,
      maxAbsolute: 1000,
      unit: "mg/kg",
      resultUnit: "mg",
      stock: "100 mg/ml (0.45 mEq/ml)",
      target: "50 mg/ml",
      compatible: "NS, D5W, D10W",
      incompatible: "Ceftriaxone, Phosphate, Magnesium"
    },
    magnesium: {
      name: "Magnesium",
      medication: "Magnesium Sulfate 50%",
      doseRange: "25-50 mg/kg/dose (Max 2g)",
      doseMin: 25,
      doseMax: 50,
      maxAbsolute: 2000,
      unit: "mg/kg",
      resultUnit: "mg",
      stock: "500 mg/ml (2 mmol/ml)",
      target: "60 mg/ml",
      compatible: "D5W, NS, LR",
      incompatible: "Calcium chloride, Sodium bicarbonate"
    },
    potassium: {
      name: "Potassium",
      medication: "Potassium Chloride (KCl)",
      doseRangeIV: "0.5-1 mEq/kg/dose (Max 40 mEq)",
      doseRangePO: "1-4 mEq/kg/day (divided BD-QID)",
      doseMinIV: 0.5,
      doseMaxIV: 1,
      maxAbsoluteIV: 40,
      doseMinPO: 1,
      doseMaxPO: 4,
      maxAbsolutePO: 100,
      unit: "mEq/kg",
      resultUnit: "mEq",
      stock: "15% KCl = 2 mEq/ml",
      target: "Peripheral: 80 mEq/L | Central: 150 mEq/L",
      compatible: "NS, D5W, LR",
      incompatible: "Amphotericin B, Diazepam"
    },
    nahco3: {
      name: "Sodium Bicarbonate",
      medication: "Sodium Bicarbonate 8.4%",
      doseRange: "Formula-based (no fixed range)",
      hideSlider: true,
      unit: "mEq",
      resultUnit: "mEq",
      stock: "1 mEq/ml (8.4%)",
      target: "1:1 dilution",
      compatible: "NS, D5W, D10W",
      incompatible: "Calcium salts, Dopamine, Epinephrine"
    },
    sodium: {
      name: "Sodium",
      medication: "3% NaCl (Hypertonic Saline)",
      doseRange: "3-5 ml/kg bolus (severe)",
      doseMin: 3,
      doseMax: 5,
      maxAbsolute: 500,
      unit: "ml/kg",
      resultUnit: "ml",
      stock: "513 mEq/L (0.513 mEq/ml)",
      target: "Variable based on deficit",
      compatible: "Most IV fluids",
      incompatible: "None significant"
    },
    phosphate: {
      name: "Phosphate",
      medication: "Addiphos (Phosphate)",
      doseRange: "0.08-0.5 mmol/kg (Max 15 mmol)",
      doseMin: 0.08,
      doseMax: 0.5,
      maxAbsolute: 15,
      unit: "mmol/kg",
      resultUnit: "mmol",
      stock: "1 ml = 2 mmol phosphate",
      target: "Peripheral: 0.05 mmol/ml",
      compatible: "Most IV fluids",
      incompatible: "Calcium salts"
    }
  };

  // Clear results and reset dose when electrolyte, weight, potassium route, or rounding toggle changes
  useEffect(() => {
    setResults(null);
    const elec = electrolytes[selectedElectrolyte];
    if (elec && w > 0) {
      // Handle potassium's dynamic dose range
      let doseMin, doseMax, maxAbsolute;
      if (selectedElectrolyte === "potassium") {
        doseMin = potassiumRoute === "IV" ? elec.doseMinIV : elec.doseMinPO;
        doseMax = potassiumRoute === "IV" ? elec.doseMaxIV : elec.doseMaxPO;
        maxAbsolute = potassiumRoute === "IV" ? elec.maxAbsoluteIV : elec.maxAbsolutePO;
      } else {
        doseMin = elec.doseMin;
        doseMax = elec.doseMax;
        maxAbsolute = elec.maxAbsolute;
      }
      const minAbsDose = doseMin * w;
      const maxAbsDose = Math.min(doseMax * w, maxAbsolute);
      let midDose = (minAbsDose + maxAbsDose) / 2;
      
      // When rounding is enabled, snap midpoint to nearest multiple of 5
      if (roundToFives) {
        midDose = Math.round(midDose / 5) * 5;
      }
      
      setCustomDose(midDose.toFixed(elec.resultUnit === "mEq" || elec.resultUnit === "mmol" ? (roundToFives ? 0 : 2) : 0));
    }
  }, [selectedElectrolyte, weight, potassiumRoute, roundToFives]);

  // Get dose limits for current electrolyte
  const currentElectrolyte = electrolytes[selectedElectrolyte];
  const getDoseLimits = () => {
    if (!currentElectrolyte || !w) return { min: 0, max: 100, step: 1, originalMin: 0, originalMax: 100 };
    // Handle potassium's dynamic dose range
    let doseMin, doseMax, maxAbsolute;
    if (selectedElectrolyte === "potassium") {
      doseMin = potassiumRoute === "IV" ? currentElectrolyte.doseMinIV : currentElectrolyte.doseMinPO;
      doseMax = potassiumRoute === "IV" ? currentElectrolyte.doseMaxIV : currentElectrolyte.doseMaxPO;
      maxAbsolute = potassiumRoute === "IV" ? currentElectrolyte.maxAbsoluteIV : currentElectrolyte.maxAbsolutePO;
    } else {
      doseMin = currentElectrolyte.doseMin;
      doseMax = currentElectrolyte.doseMax;
      maxAbsolute = currentElectrolyte.maxAbsolute;
    }
    const minAbsDose = doseMin * w;
    const maxAbsDose = Math.min(doseMax * w, maxAbsolute);
    
    // When rounding is enabled, snap to multiples of 5
    if (roundToFives) {
      // Round min DOWN to nearest 5 (allow slightly below range for easier dilution)
      const roundedMin = Math.floor(minAbsDose / 5) * 5;
      // Round max UP to nearest 5
      const roundedMax = Math.ceil(maxAbsDose / 5) * 5;
      return { 
        min: roundedMin, 
        max: roundedMax, 
        step: 5,
        originalMin: minAbsDose,
        originalMax: maxAbsDose
      };
    }
    
    const step = maxAbsDose < 10 ? 0.1 : maxAbsDose < 100 ? 1 : 10;
    return { min: minAbsDose, max: maxAbsDose, step, originalMin: minAbsDose, originalMax: maxAbsDose };
  };
  const doseLimits = getDoseLimits();
  const currentDose = parseFloat(customDose) || doseLimits.min;

  // Get current dose range text for potassium
  const getCurrentDoseRange = () => {
    if (selectedElectrolyte === "potassium") {
      return potassiumRoute === "IV" ? currentElectrolyte.doseRangeIV : currentElectrolyte.doseRangePO;
    }
    return currentElectrolyte?.doseRange || "";
  };

  // Calculate based on selected electrolyte
  const calculate = () => {
    if (!w) {
      setResults({ error: "Please enter patient weight" });
      return;
    }

    switch (selectedElectrolyte) {
      case "calcium": calculateCalcium(); break;
      case "magnesium": calculateMagnesium(); break;
      case "potassium": 
        if (potassiumRoute === "IV") {
          calculatePotassiumIV();
        } else {
          calculatePotassiumPO();
        }
        break;
      case "nahco3": calculateNaHCO3(); break;
      case "sodium": calculateSodium(); break;
      case "phosphate": calculatePhosphate(); break;
      default: break;
    }
  };

  const calculateCalcium = () => {
    const maxDose = 1000;
    // Dose is already rounded by slider when roundToFives is enabled
    let doseMg = currentDose;
    // Ensure dose doesn't exceed max
    doseMg = Math.min(doseMg, maxDose);
    let isMaxed = doseMg >= maxDose;
    
    const doseMl = doseMg / 100;
    const targetConc = 50;
    const totalVolume = doseMg / targetConc;
    const diluentMl = totalVolume - doseMl;
    const dosePerKg = (doseMg / w).toFixed(1);
    const duration = "1 hour";
    
    setResults({
      medication: "Calcium Gluconate 10%",
      isRounded: roundToFives,
      calculation: {
        dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}${roundToFives ? ' ≈' : ''} (${dosePerKg} mg/kg)`,
        formula: `Selected: ${dosePerKg} mg/kg x ${w} kg`,
        drugVolume: `${doseMl.toFixed(1)} ml`,
        diluent: `${diluentMl.toFixed(1)} ml (NS or D5W)`,
        totalVolume: `${totalVolume.toFixed(1)} ml (at 50 mg/ml)`
      },
      administration: { duration, rate: `${totalVolume.toFixed(1)} ml/hr` },
      preparation: `Draw ${doseMl.toFixed(1)} ml Ca Gluconate + ${diluentMl.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      order: `${doseMg.toFixed(0)} mg Ca Gluconate in ${totalVolume.toFixed(0)} ml NS over ${duration}`,
      frequency: calciumLevel && parseFloat(calciumLevel) < 7 ? "BD" : "OD"
    });
  };

  const calculateMagnesium = () => {
    const maxDose = 2000;
    // Dose is already rounded by slider when roundToFives is enabled
    let doseMg = currentDose;
    // Ensure dose doesn't exceed max
    doseMg = Math.min(doseMg, maxDose);
    let isMaxed = doseMg >= maxDose;
    
    const drugVolume = doseMg / 500;
    const targetConc = 60;
    const totalVolume = doseMg / targetConc;
    const diluent = totalVolume - drugVolume;
    const dosePerKg = (doseMg / w).toFixed(1);
    const duration = "2-4 hours";
    
    setResults({
      medication: "Magnesium Sulfate 50%",
      isRounded: roundToFives,
      calculation: {
        dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}${roundToFives ? ' ≈' : ''} (${dosePerKg} mg/kg)`,
        formula: `Selected: ${dosePerKg} mg/kg x ${w} kg`,
        drugVolume: `${drugVolume.toFixed(2)} ml`,
        diluent: `${diluent.toFixed(1)} ml (NS or D5W)`,
        totalVolume: `${totalVolume.toFixed(1)} ml (at 60 mg/ml)`
      },
      administration: { duration, rate: `${(totalVolume/3).toFixed(1)} ml/hr` },
      preparation: `Draw ${drugVolume.toFixed(2)} ml MgSO4 50% + ${diluent.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      order: `${doseMg.toFixed(0)} mg MgSO4 in ${totalVolume.toFixed(0)} ml NS over ${duration}`,
      frequency: "BD for 3 doses"
    });
  };

  const calculatePotassiumIV = () => {
    const maxDose = 40;
    // Dose is already rounded by slider when roundToFives is enabled
    let doseMEq = currentDose;
    // Ensure dose doesn't exceed max
    doseMEq = Math.min(doseMEq, maxDose);
    let isMaxed = doseMEq >= maxDose;
    
    // KCl 15% = 2 mEq/ml
    const drugVolume = doseMEq / 2;
    const dosePerKg = (doseMEq / w).toFixed(2);
    
    // Calculate dilution based on line type
    let concentration, concentrationLabel, totalVolume, diluent;
    
    if (potassiumLineType === "peripheral") {
      // Peripheral: 80 mEq/L = 0.08 mEq/ml
      concentration = 0.08;
      concentrationLabel = "80 mEq/L (Peripheral)";
      totalVolume = doseMEq / concentration;
      diluent = totalVolume - drugVolume;
    } else if (potassiumLineType === "central") {
      // Central without fluid restriction: 15 mEq/100 ml = 0.15 mEq/ml
      concentration = 0.15;
      concentrationLabel = "15 mEq/100ml (Central)";
      totalVolume = doseMEq / concentration;
      diluent = totalVolume - drugVolume;
    } else {
      // Central with fluid restriction: 20 mEq/100 ml = 0.20 mEq/ml
      concentration = 0.20;
      concentrationLabel = "20 mEq/100ml (Central - Fluid Restricted)";
      totalVolume = doseMEq / concentration;
      diluent = totalVolume - drugVolume;
    }
    
    const duration = parseFloat(dosePerKg) <= 0.5 ? "1 hour" : "2 hours";
    const durationHrs = parseFloat(dosePerKg) <= 0.5 ? 1 : 2;
    const rate = totalVolume / durationHrs;
    
    setResults({
      medication: "Potassium Chloride (KCl) 15% - IV",
      lineType: potassiumLineType,
      isRounded: roundToFives,
      calculation: {
        dose: `${doseMEq.toFixed(roundToFives ? 0 : 1)} mEq${isMaxed ? ' (MAX)' : ''}${roundToFives ? ' ≈' : ''} (${dosePerKg} mEq/kg)`,
        formula: `Selected: ${dosePerKg} mEq/kg x ${w} kg`,
        drugVolume: `${drugVolume.toFixed(2)} ml`,
        diluent: `${diluent.toFixed(0)} ml NS (${concentrationLabel})`,
        totalVolume: `${totalVolume.toFixed(0)} ml`
      },
      administration: { duration, rate: `${rate.toFixed(0)} ml/hr` },
      preparation: `${drugVolume.toFixed(2)} ml KCl 15% + ${diluent.toFixed(0)} ml NS = ${totalVolume.toFixed(0)} ml`,
      order: `${doseMEq.toFixed(roundToFives ? 0 : 1)} mEq KCl in ${totalVolume.toFixed(0)} ml NS over ${duration}`,
      notes: "Monitor ECG if >0.5 mEq/kg/hr"
    });
  };

  const calculatePotassiumPO = () => {
    // Dose is already rounded by slider when roundToFives is enabled
    let dailyDose = currentDose;
    const dosePerKg = (dailyDose / w).toFixed(1);
    
    // Get frequency divisor
    const freqMap = { "BD": 2, "TID": 3, "QID": 4 };
    const divisor = freqMap[kclPoFrequency] || 2;
    let perDose = dailyDose / divisor;
    // Round per dose to nearest 5 if enabled
    if (roundToFives) {
      perDose = roundToFive(perDose);
    }
    
    // Simplified PO result - just dose and frequency
    setResults({
      medication: "Potassium Chloride (KCl) - Oral",
      isPO: true,
      isRounded: roundToFives,
      poResult: {
        dailyDose: `${dailyDose.toFixed(roundToFives ? 0 : 1)} mEq/day${roundToFives ? ' ≈' : ''}`,
        perKg: `${dosePerKg} mEq/kg/day`,
        perDose: `${perDose.toFixed(roundToFives ? 0 : 1)} mEq${roundToFives ? ' ≈' : ''}`,
        frequency: kclPoFrequency
      }
    });
  };

  const calculateNaHCO3 = () => {
    let correction = 0;
    let formula = "";
    
    if (nahco3Method === "infusion") {
      // Infusion: 0.25-2 mEq/kg/hr
      const rate = parseFloat(infusionRate) || 1;
      const mEqPerHour = rate * w;
      const mlPerHour = mEqPerHour; // 8.4% = 1 mEq/ml
      
      setResults({
        medication: "Sodium Bicarbonate 8.4% Infusion",
        calculation: {
          dose: `${rate} mEq/kg/hr`,
          formula: `${rate} mEq/kg/hr × ${w} kg = ${mEqPerHour.toFixed(1)} mEq/hr`,
          drugVolume: `${mlPerHour.toFixed(1)} ml/hr (undiluted)`,
          diluent: "Can dilute 1:1 with NS if needed",
          totalVolume: `${mlPerHour.toFixed(1)} - ${(mlPerHour * 2).toFixed(1)} ml/hr`
        },
        administration: { 
          duration: "Continuous", 
          rate: `${mlPerHour.toFixed(1)} ml/hr (undiluted) or ${(mlPerHour * 2).toFixed(1)} ml/hr (1:1 diluted)` 
        },
        preparation: `Set infusion at ${mlPerHour.toFixed(1)} ml/hr of NaHCO3 8.4%`,
        notes: "Method: Continuous Infusion | Range: 0.25-2 mEq/kg/hr",
        oralNote: "Oral NaHCO3: 600 mg = 7 mEq",
        warnings: ["Monitor ABG every 2-4 hours", "Adjust rate based on response"]
      });
      return;
    }
    
    if (nahco3Method === "hco3") {
      // Correction (1): (Desired HCO3 - Lab HCO3) × 0.3 × WT
      const labValue = parseFloat(labHco3);
      const desiredValue = parseFloat(desiredHco3) || 24;
      
      if (!labValue) {
        setResults({ error: "Please enter Lab HCO3 value" });
        return;
      }
      
      correction = (desiredValue - labValue) * 0.3 * w;
      formula = `(${desiredValue} - ${labValue}) × 0.3 × ${w} kg`;
    } else {
      // Correction (2): BE × 0.3 × WT
      const beValue = parseFloat(baseExcess);
      
      if (!beValue && beValue !== 0) {
        setResults({ error: "Please enter Base Deficit value" });
        return;
      }
      
      correction = Math.abs(beValue) * 0.3 * w;
      formula = `|${beValue}| × 0.3 × ${w} kg`;
    }
    
    if (correction <= 0) {
      setResults({ error: "Calculated correction is zero or negative. Check your values." });
      return;
    }
    
    // Apply rounding to correction dose if enabled
    let correctionRounded = roundToFives ? roundToFive(correction) : correction;
    
    const drugVolume = correctionRounded;
    const diluentVolume = correctionRounded;
    const totalVolume = drugVolume + diluentVolume;
    const halfDose = correctionRounded / 2;
    const halfVolume = totalVolume / 2;
    
    setResults({
      medication: "Sodium Bicarbonate 8.4%",
      isRounded: roundToFives,
      calculation: {
        dose: `${correctionRounded.toFixed(1)} mEq${roundToFives ? ' ≈' : ''}`,
        formula: formula,
        drugVolume: `${drugVolume.toFixed(1)} ml (8.4% = 1 mEq/ml)`,
        diluent: `${diluentVolume.toFixed(1)} ml NS (1:1 dilution)`,
        totalVolume: `${totalVolume.toFixed(1)} ml`
      },
      administration: { 
        duration: "Split dose (in Metabolic patients)", 
        rate: `1st half: ${halfDose.toFixed(1)} mEq (${halfVolume.toFixed(1)} ml) over 1st hour | 2nd half: ${halfDose.toFixed(1)} mEq (${halfVolume.toFixed(1)} ml) over next 24 hours` 
      },
      preparation: `Draw ${drugVolume.toFixed(1)} ml NaHCO3 + ${diluentVolume.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
      notes: `Method: ${nahco3Method === "hco3" ? "HCO3 deficit" : "Base Deficit"}`,
      oralNote: "Oral NaHCO3: 600 mg = 7 mEq",
      warnings: ["Correct calcium FIRST if hypocalcemic", "Recheck ABG after 1st half"]
    });
  };

  const calculateSodium = () => {
    const na = parseFloat(currentNa) || 128;
    const target = parseFloat(targetNa) || 133;
    
    // Calculate deficit based on selector for mild hyponatremia
    let deficit;
    if (sodiumType === "hyponatremia" && hyponatremiaType === "mild") {
      // Use the Infant/Child selector values
      if (hypoDeficitType === "infant") {
        deficit = w * parseInt(hypoDeficitPercent) * 10; // 5%=50, 10%=100, 15%=150 ml/kg
      } else {
        deficit = w * parseInt(hypoDeficitPercent) * 10; // 3%=30, 6%=60, 9%=90 ml/kg
      }
    } else {
      deficit = parseFloat(fluidDeficit) || (w * 100); // Default 10% dehydration for other cases
    }
    
    // Calculate maintenance (Holliday-Segar) - 100/50/20 rule
    let maintenance;
    if (w <= 10) {
      maintenance = w * 100;
    } else if (w <= 20) {
      maintenance = 1000 + (w - 10) * 50;
    } else {
      maintenance = 1500 + (w - 20) * 20;
    }
    
    if (sodiumType === "hyponatremia" && hyponatremiaType === "severe") {
      // Severe/Symptomatic Hyponatremia (Na < 125 with severe symptoms)
      // Based on flowchart: Two treatment paths
      
      // Infusion path: 1-2 ml/kg/hr of 3% saline
      const infusionRateLow = w * 1; // 1 ml/kg/hr
      const infusionRateHigh = w * 2; // 2 ml/kg/hr
      
      // Bolus path: 100-150 ml of 3% saline
      const bolusVolumeLow = 100;
      const bolusVolumeHigh = 150;
      
      setResults({
        medication: "Severe Hyponatremia (Na < 125 with symptoms)",
        isSevereHyponatremia: true,
        severeData: {
          currentNa: na,
          infusionRateLow: infusionRateLow.toFixed(1),
          infusionRateHigh: infusionRateHigh.toFixed(1),
          bolusVolumeLow,
          bolusVolumeHigh
        }
      });
    } else if (sodiumType === "hyponatremia") {
      // Check which method to use
      if (hyponatremiaMethod === "3percent") {
        // 3% NaCl Method for Hyponatremia
        // 1 mEq Na = 2 ml of 3% NaCl
        
        const maintenanceRate = parseFloat(naMaintenanceRate) || 2; // 2-5 mEq/kg/day
        
        // 1. Maintenance 3% NaCl (shown separately, NOT summed with deficit)
        const maintenanceNaMEq = maintenanceRate * w; // mEq/day
        const maintenance3PercentMl = maintenanceNaMEq * 2; // ml/day (1 mEq = 2 ml)
        
        // 2. Deficit Correction
        // (Na desired - Na observed) × 0.6 × weight = mEq of Na
        const naDeficitMEq = (target - na) * 0.6 * w;
        const deficit3PercentMl = naDeficitMEq * 2; // ml (1 mEq = 2 ml)
        
        // Option A: With Bolus - 1/2 deficit as bolus, 1/2 deficit as IV over 24hrs
        const halfDeficitMEq = naDeficitMEq / 2;
        const halfDeficitMl = deficit3PercentMl / 2;
        
        // Option B: Without Bolus - full deficit over 24hrs
        const deficitHourlyRate = deficit3PercentMl / 24;
        
        // Calculate expected Na correction
        const expectedNaRise = (target - na); // Expected rise in Na
        
        setResults({
          medication: "Hyponatremia Correction (3% NaCl Method)",
          is3PercentNaCl: true,
          threePercentData: {
            currentNa: na,
            targetNa: target,
            weight: w,
            maintenanceRate: maintenanceRate,
            // Maintenance (shown separately)
            maintenanceNaMEq: maintenanceNaMEq.toFixed(1),
            maintenance3PercentMl: maintenance3PercentMl.toFixed(1),
            // Deficit
            naDeficitMEq: naDeficitMEq.toFixed(1),
            deficit3PercentMl: deficit3PercentMl.toFixed(1),
            // Option A: Half deficit for bolus, half for IV
            halfDeficitMEq: halfDeficitMEq.toFixed(1),
            halfDeficitMl: halfDeficitMl.toFixed(1),
            halfDeficitHourlyRate: (halfDeficitMl / 24).toFixed(1),
            // Option B: Full deficit over 24hrs
            deficitHourlyRate: deficitHourlyRate.toFixed(1),
            // Expected correction
            expectedNaRise: expectedNaRise.toFixed(0)
          }
        });
      } else {
        // Standard Method - Mild/Asymptomatic Hyponatremia (Na 125-134)
        // Based on user's flowchart
        
        // Step 1: Determine Volume (Maintenance + Deficit)
        // Don't exceed 2.5L/day
        const totalVolume = Math.min(maintenance + deficit, 2500);
        const hourlyRate = totalVolume / 24;
        
        // Step 2: Sodium Correction
        // Na Deficit = Wt x 0.6 x (Target Na - Measured Na)
        const naDeficit = w * 0.6 * (target - na);
        // Na Maintenance = Wt x 2 mEq (2-5 mEq/kg/day)
        const naMaintenance = w * 2;
        // Total Na needed = Na Deficit + Maintenance
        const totalNa = naDeficit + naMaintenance;
        
        // Step 3: Determine Na Concentration needed
        // Na concentration = Total Na / Volume (in L)
        const naConcentration = (totalNa / (totalVolume / 1000));
        
        // Choose fluid type based on concentration
        // NS = 154 mEq/L, 1/2 NS = 77 mEq/L, 3% NaCl = 513 mEq/L, RL = 130 mEq/L
        let fluidType;
        let fluidNa;
        if (naConcentration >= 140) {
          fluidType = "NS (Normal Saline)";
          fluidNa = 154;
        } else if (naConcentration >= 100) {
          fluidType = "RL (Ringer's Lactate)";
          fluidNa = 130;
        } else if (naConcentration >= 60) {
          fluidType = "1/2 NS (Half Normal Saline)";
          fluidNa = 77;
        } else {
          fluidType = "1/4 NS or D5 0.2% NaCl";
          fluidNa = 34;
        }
        
        // Step 4: Dextrose - Usually D5% added
        // Mixture made from NS + D50%: 450ml NS + 50ml D50%
        const nsVolume = Math.round((totalVolume / 500) * 450);
        const d50Volume = Math.round((totalVolume / 500) * 50);
        
        setResults({
          medication: "Hyponatremia Correction (Mild/Asymptomatic)",
          isMildHyponatremia: true,
          mildData: {
            currentNa: na,
            targetNa: target,
            maintenance: maintenance.toFixed(0),
            deficit: deficit.toFixed(0),
            deficitType: hypoDeficitType,
            deficitPercent: hypoDeficitPercent,
            totalVolume: totalVolume.toFixed(0),
            hourlyRate: hourlyRate.toFixed(1),
            naDeficit: naDeficit.toFixed(1),
            naMaintenance: naMaintenance.toFixed(0),
            totalNa: totalNa.toFixed(1),
            naConcentration: naConcentration.toFixed(0),
            fluidType,
            fluidNa,
            nsVolume,
            d50Volume
          }
        });
      }
    } else if (sodiumType === "hypernatremia" && hypernatremiaMethod === "nelson") {
      // Nelson Textbook Method for Hypernatremia
      // Calculate maintenance (Holliday-Segar)
      let maintenance;
      if (w <= 10) {
        maintenance = w * 100;
      } else if (w <= 20) {
        maintenance = 1000 + (w - 10) * 50;
      } else {
        maintenance = 1500 + (w - 20) * 20;
      }
      
      // Determine correction time based on Na level
      let correctionHours;
      let naRange;
      if (na >= 145 && na <= 157) {
        correctionHours = 24;
        naRange = "145-157";
      } else if (na >= 158 && na <= 170) {
        correctionHours = 48;
        naRange = "158-170";
      } else if (na >= 171 && na <= 183) {
        correctionHours = 72;
        naRange = "171-183";
      } else if (na >= 184 && na <= 196) {
        correctionHours = 84;
        naRange = "184-196";
      } else if (na > 196) {
        correctionHours = 96;
        naRange = ">196";
      } else {
        correctionHours = 24;
        naRange = "<145";
      }
      
      // Calculate rate: 2 x maintenance / correction hours
      const fluidRate = (2 * maintenance) / correctionHours;
      const bolusVolume = w * 20;
      const seizureRescue = w * 5; // 4-6 ml/kg, using 5
      
      setResults({
        medication: "Hypernatremia Correction (Nelson Method)",
        isNelsonMethod: true,
        nelsonData: {
          currentNa: na,
          naRange,
          correctionHours,
          maintenance,
          fluidRate: fluidRate.toFixed(1),
          bolusVolume: bolusVolume.toFixed(0),
          seizureRescue: seizureRescue.toFixed(0)
        },
        calculation: {
          dose: `Current Na: ${na} mEq/L (${naRange} range)`,
          formula: `2 x ${maintenance} ml/day ÷ ${correctionHours} hrs`,
          drugVolume: `Maintenance: ${maintenance} ml/day`,
          diluent: "Normal Saline (NS)",
          totalVolume: `${(2 * maintenance).toFixed(0)} ml over ${correctionHours} hrs`
        },
        administration: { 
          duration: `${correctionHours} hours`, 
          rate: `${fluidRate.toFixed(1)} ml/hr` 
        },
        preparation: `IVF NS @ ${fluidRate.toFixed(1)} ml/hr`,
        order: `IVF NS ${fluidRate.toFixed(1)} ml/hr x ${correctionHours} hrs`,
        notes: "Repeat Na every 4-6 hrs | Max drop: 0.5 mEq/L/hr",
        warnings: na >= 170 ? ["Severe hypernatremia - monitor closely for seizures"] : undefined
      });
    } else {
      // Harriet Lane Method for Hypernatremia
      const desiredNa = parseFloat(targetNa) || 145;
      
      // Calculate deficit based on selector (infant/child + percentage)
      let deficit;
      if (harrietDeficitType === "infant") {
        // Infant: 5% = 50ml/kg, 10% = 100ml/kg, 15% = 150ml/kg
        deficit = w * parseInt(harrietDeficitPercent) * 10;
      } else {
        // Child: 3% = 30ml/kg, 6% = 60ml/kg, 9% = 90ml/kg
        deficit = w * parseInt(harrietDeficitPercent) * 10;
      }
      
      // Free Water Deficit (FWD) = 4ml × weight × (Serum Na - Desired Na)
      const freeWaterDeficit = 4 * w * (na - desiredNa);
      
      // Solute Fluid Deficit (SFD) = Fluid deficit - FWD
      const soluteFluidDeficit = Math.max(0, deficit - freeWaterDeficit);
      
      // Calculate maintenance (Holliday-Segar)
      let maintenance;
      if (w <= 10) {
        maintenance = w * 100;
      } else if (w <= 20) {
        maintenance = 1000 + (w - 10) * 50;
      } else {
        maintenance = 1500 + (w - 20) * 20;
      }
      
      // Total fluid volume = Maintenance + Deficit (given over 24 hrs)
      const totalFluidVolume = maintenance + deficit;
      const fluidRate = totalFluidVolume / 24;
      
      // Na required = (SFD + Maintenance) × 14 mEq/100ml
      // Using 14 mEq/100ml as the maintenance Na requirement
      const naRequired = (soluteFluidDeficit + maintenance) * 0.14;
      
      // Na content in fluid = Na required / Total fluid volume (gives mEq/L needed)
      const naContentInFluid = (naRequired / totalFluidVolume) * 1000;
      
      // Determine fluid type based on Na content
      let recommendedFluid;
      if (naContentInFluid >= 140) {
        recommendedFluid = "NS (154 mEq/L)";
      } else if (naContentInFluid >= 70) {
        recommendedFluid = "0.45% NaCl (77 mEq/L)";
      } else if (naContentInFluid >= 30) {
        recommendedFluid = "0.2% NaCl (34 mEq/L)";
      } else {
        recommendedFluid = "D5W or D5 0.2% NaCl";
      }
      
      // 3% NaCl calculation if Na > 170
      let hypertonicCalc = null;
      if (na > 170) {
        // ml of 3% saline = 1000ml × (desired Na - 154) / (513 - desired Na)
        // This is used to fortify NS bolus
        const ml3Percent = 1000 * (desiredNa - 154) / (513 - desiredNa);
        const nsBolus = w * 15; // 10-20 ml/kg, using 15
        const toAdd = (nsBolus * ml3Percent) / 1000;
        hypertonicCalc = {
          ml3Percent: Math.abs(ml3Percent).toFixed(1),
          nsBolus: nsBolus.toFixed(0),
          toAdd: Math.abs(toAdd).toFixed(1)
        };
      }
      
      setResults({
        medication: "Hypernatremia Correction (Harriet Lane)",
        isHarrietLane: true,
        harrietData: {
          currentNa: na,
          desiredNa,
          deficitType: harrietDeficitType,
          deficitPercent: harrietDeficitPercent,
          freeWaterDeficit: freeWaterDeficit.toFixed(0),
          soluteFluidDeficit: soluteFluidDeficit.toFixed(0),
          totalDeficit: deficit.toFixed(0),
          maintenance: maintenance.toFixed(0),
          totalFluidVolume: totalFluidVolume.toFixed(0),
          fluidRate: fluidRate.toFixed(1),
          naRequired: naRequired.toFixed(1),
          naContentInFluid: naContentInFluid.toFixed(0),
          recommendedFluid,
          hypertonicCalc
        }
      });
    }
  };

  const calculatePhosphate = () => {
    const maxDose = 15;
    // Dose is already rounded by slider when roundToFives is enabled
    let doseMmol = currentDose;
    // Ensure dose doesn't exceed max
    doseMmol = Math.min(doseMmol, maxDose);
    let isMaxed = doseMmol >= maxDose;
    
    const drugVolume = doseMmol / 2;
    const dosePerKg = (doseMmol / w).toFixed(3);
    const totalVolume = doseMmol / 0.05;
    const diluent = totalVolume - drugVolume;
    const duration = "4-6 hours";
    
    setResults({
      medication: "Addiphos (Phosphate)",
      isRounded: roundToFives,
      calculation: {
        dose: `${doseMmol.toFixed(roundToFives ? 0 : 2)} mmol${isMaxed ? ' (MAX)' : ''}${roundToFives ? ' ≈' : ''} (${dosePerKg} mmol/kg)`,
        formula: `Selected: ${dosePerKg} mmol/kg x ${w} kg`,
        drugVolume: `${drugVolume.toFixed(2)} ml`,
        diluent: `${diluent.toFixed(0)} ml NS (0.05 mmol/ml)`,
        totalVolume: `${totalVolume.toFixed(0)} ml`
      },
      administration: { duration, rate: `${(totalVolume/5).toFixed(1)} ml/hr` },
      preparation: `${drugVolume.toFixed(2)} ml Addiphos + ${diluent.toFixed(0)} ml NS = ${totalVolume.toFixed(0)} ml`,
      order: `${doseMmol.toFixed(roundToFives ? 0 : 1)} mmol Phosphate in ${totalVolume.toFixed(0)} ml NS over ${duration}`,
      warnings: ["Rapid infusion causes hypocalcemia!"]
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Electrolyte Correction Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Weight Input */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-sm font-medium">Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter weight..."
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setResults(null); }}
                  className="font-mono h-10 mt-1"
                />
              </div>
              {weight && (
                <div className="text-center px-3">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-xl font-bold text-primary">{weight} kg</p>
                </div>
              )}
            </div>
          </div>

          {/* Electrolyte Selector */}
          <div>
            <Label className="text-sm font-medium">Select Electrolyte</Label>
            <Select value={selectedElectrolyte} onValueChange={setSelectedElectrolyte}>
              <SelectTrigger className="h-10 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calcium">Calcium</SelectItem>
                <SelectItem value="magnesium">Magnesium</SelectItem>
                <SelectItem value="potassium">Potassium</SelectItem>
                <SelectItem value="nahco3">Sodium Bicarbonate (NaHCO3)</SelectItem>
                <SelectItem value="sodium">Sodium</SelectItem>
                <SelectItem value="phosphate">Phosphate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Round to 5s Toggle */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Round dose to 5s</span>
              <span className="text-xs text-amber-600 dark:text-amber-400">(easier dilution)</span>
            </div>
            <button
              type="button"
              onClick={() => { setRoundToFives(!roundToFives); setResults(null); }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                roundToFives ? 'bg-amber-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  roundToFives ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Potassium IV/PO Switch */}
          {selectedElectrolyte === "potassium" && (
            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
              <button
                type="button"
                onClick={() => setPotassiumRoute("IV")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  potassiumRoute === "IV" 
                    ? "bg-purple-600 text-white" 
                    : "text-purple-700 hover:bg-purple-100"
                }`}
              >
                IV
              </button>
              <button
                type="button"
                onClick={() => setPotassiumRoute("PO")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  potassiumRoute === "PO" 
                    ? "bg-purple-600 text-white" 
                    : "text-purple-700 hover:bg-purple-100"
                }`}
              >
                PO
              </button>
            </div>
          )}

          {/* Potassium IV Line Type Selector */}
          {selectedElectrolyte === "potassium" && potassiumRoute === "IV" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Line Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPotassiumLineType("peripheral")}
                  className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                    potassiumLineType === "peripheral"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  <div>Peripheral</div>
                  <div className="text-[10px] opacity-75">80 mEq/L</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPotassiumLineType("central")}
                  className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                    potassiumLineType === "central"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  <div>Central</div>
                  <div className="text-[10px] opacity-75">15 mEq/100ml</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPotassiumLineType("central_restricted")}
                  className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                    potassiumLineType === "central_restricted"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  <div>Central</div>
                  <div className="text-[10px] opacity-75">Fluid Restricted</div>
                  <div className="text-[10px] opacity-75">20 mEq/100ml</div>
                </button>
              </div>
            </div>
          )}

          {/* Dose Range Display - Hide for NaHCO3, Hypernatremia, and Mild Hyponatremia */}
          {selectedElectrolyte !== "nahco3" && 
           !(selectedElectrolyte === "sodium" && sodiumType === "hypernatremia") && 
           !(selectedElectrolyte === "sodium" && sodiumType === "hyponatremia" && hyponatremiaType === "mild") && (
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300">
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                Dose Range: <span className="text-green-600 dark:text-green-400">{getCurrentDoseRange()}</span>
              </p>
            </div>
          )}

          {/* Dose Input with Slider - Hide for NaHCO3, Hypernatremia, and Mild Hyponatremia */}
          {w > 0 && selectedElectrolyte !== "nahco3" && 
           !(selectedElectrolyte === "sodium" && sodiumType === "hypernatremia") && 
           !(selectedElectrolyte === "sodium" && sodiumType === "hyponatremia" && hyponatremiaType === "mild") && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                  Select {selectedElectrolyte === "potassium" && potassiumRoute === "PO" ? "Daily " : ""}Dose ({currentElectrolyte.resultUnit})
                </Label>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">
                    {doseLimits.min.toFixed(roundToFives ? 0 : (doseLimits.step < 1 ? 2 : 0))} - {doseLimits.max.toFixed(roundToFives ? 0 : (doseLimits.step < 1 ? 2 : 0))} {currentElectrolyte.resultUnit}
                  </span>
                  {roundToFives && (
                    <span className="block text-[10px] text-amber-600">
                      (adjusted from {doseLimits.originalMin.toFixed(1)} - {doseLimits.originalMax.toFixed(1)})
                    </span>
                  )}
                </div>
              </div>
              
              <Slider
                value={[currentDose]}
                onValueChange={(value) => setCustomDose(value[0].toString())}
                min={doseLimits.min}
                max={doseLimits.max}
                step={doseLimits.step}
                className="py-2"
              />
              
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step={doseLimits.step}
                  min={doseLimits.min}
                  max={doseLimits.max}
                  value={customDose}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= doseLimits.min && val <= doseLimits.max) {
                      setCustomDose(e.target.value);
                    } else if (e.target.value === "") {
                      setCustomDose("");
                    }
                  }}
                  className="font-mono h-10 w-28"
                />
                <span className="text-sm font-medium">{currentElectrolyte.resultUnit}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  ({(currentDose / w).toFixed(currentElectrolyte.unit.includes("mEq") || currentElectrolyte.unit.includes("mmol") ? 2 : 1)} {currentElectrolyte.unit})
                </span>
              </div>
            </div>
          )}

          {/* NaHCO3-specific options - Correction Method Switch */}
          {selectedElectrolyte === "nahco3" && w > 0 && (
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label className="text-sm font-semibold text-orange-800 dark:text-orange-300">Method</Label>
                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border">
                  <button
                    type="button"
                    onClick={() => setNahco3Method("hco3")}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      nahco3Method === "hco3" 
                        ? "bg-orange-500 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    HCO3
                  </button>
                  <button
                    type="button"
                    onClick={() => setNahco3Method("be")}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      nahco3Method === "be" 
                        ? "bg-orange-500 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Base Deficit
                  </button>
                  <button
                    type="button"
                    onClick={() => setNahco3Method("infusion")}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      nahco3Method === "infusion" 
                        ? "bg-orange-500 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Infusion
                  </button>
                </div>
              </div>
              
              {nahco3Method === "hco3" && (
                <div className="space-y-2">
                  <p className="text-xs text-orange-700 dark:text-orange-400 font-mono">
                    (Desired HCO3 - Lab HCO3) × 0.3 × WT
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Lab HCO3 (mEq/L)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="e.g., 12"
                        value={labHco3}
                        onChange={(e) => setLabHco3(e.target.value)}
                        className="font-mono h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Desired HCO3 (mEq/L)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="24"
                        value={desiredHco3}
                        onChange={(e) => setDesiredHco3(e.target.value)}
                        className="font-mono h-9"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {nahco3Method === "be" && (
                <div className="space-y-2">
                  <p className="text-xs text-orange-700 dark:text-orange-400 font-mono">
                    BE × 0.3 × WT (from ABG)
                  </p>
                  <div>
                    <Label className="text-xs">Base Deficit (mEq/L)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="-?[0-9]*\.?[0-9]*"
                      placeholder="e.g., -10"
                      value={baseExcess}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || val === '-' || /^-?\d*\.?\d*$/.test(val)) {
                          setBaseExcess(val);
                        }
                      }}
                      className="font-mono h-9"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Enter negative value (e.g., -10)</p>
                  </div>
                </div>
              )}
              
              {nahco3Method === "infusion" && (
                <div className="space-y-2">
                  <p className="text-xs text-orange-700 dark:text-orange-400 font-mono">
                    Continuous Infusion: 0.25 - 2 mEq/kg/hr
                  </p>
                  <div>
                    <Label className="text-xs">Infusion Rate (mEq/kg/hr)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.25"
                        min="0.25"
                        max="2"
                        placeholder="1"
                        value={infusionRate}
                        onChange={(e) => setInfusionRate(e.target.value)}
                        className="font-mono h-9 w-24"
                      />
                      <span className="text-xs text-muted-foreground">mEq/kg/hr (Range: 0.25-2)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Potassium PO Frequency selector */}
          {selectedElectrolyte === "potassium" && potassiumRoute === "PO" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Frequency</Label>
              <RadioGroup value={kclPoFrequency} onValueChange={setKclPoFrequency} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BD" id="bd" />
                  <Label htmlFor="bd" className="text-sm">BD (2x/day)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TID" id="tid" />
                  <Label htmlFor="tid" className="text-sm">TID (3x/day)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="QID" id="qid" />
                  <Label htmlFor="qid" className="text-sm">QID (4x/day)</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Sodium-specific options */}
          {selectedElectrolyte === "sodium" && (
            <div className="space-y-3">
              <RadioGroup value={sodiumType} onValueChange={setSodiumType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hyponatremia" id="hypo" />
                  <Label htmlFor="hypo" className="text-sm">Hyponatremia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hypernatremia" id="hyper" />
                  <Label htmlFor="hyper" className="text-sm">Hypernatremia</Label>
                </div>
              </RadioGroup>
              
              {sodiumType === "hyponatremia" && (
                <>
                  <RadioGroup value={hyponatremiaType} onValueChange={setHyponatremiaType} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mild" id="mild" />
                      <Label htmlFor="mild" className="text-sm">Mild/Asymptomatic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severe" id="severe" />
                      <Label htmlFor="severe" className="text-sm">Severe/Symptomatic</Label>
                    </div>
                  </RadioGroup>
                  
                  {/* Common inputs for hyponatremia */}
                  <div>
                    <Label className="text-xs">Current Serum Na (mEq/L)</Label>
                    <Input
                      type="number"
                      step="1"
                      min="100"
                      max="134"
                      placeholder="e.g., 128"
                      value={currentNa}
                      onChange={(e) => setCurrentNa(e.target.value)}
                      className="font-mono h-9 mt-1"
                    />
                  </div>
                  
                  {hyponatremiaType === "mild" && (
                    <>
                      {/* Method selector: Standard vs 3% NaCl */}
                      <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200">
                        <button
                          type="button"
                          onClick={() => setHyponatremiaMethod("standard")}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            hyponatremiaMethod === "standard"
                              ? "bg-cyan-600 text-white"
                              : "text-cyan-700 hover:bg-cyan-100"
                          }`}
                        >
                          Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => setHyponatremiaMethod("3percent")}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            hyponatremiaMethod === "3percent"
                              ? "bg-cyan-600 text-white"
                              : "text-cyan-700 hover:bg-cyan-100"
                          }`}
                        >
                          3% NaCl
                        </button>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Target Na (mEq/L)</Label>
                        <Input
                          type="number"
                          step="1"
                          min="130"
                          max="145"
                          placeholder="135"
                          value={targetNa}
                          onChange={(e) => setTargetNa(e.target.value)}
                          className="font-mono h-9 mt-1"
                        />
                      </div>
                      
                      {/* 3% NaCl specific inputs */}
                      {hyponatremiaMethod === "3percent" && (
                        <div className="space-y-2">
                          <Label className="text-xs">Na Maintenance Rate (mEq/kg/day)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.5"
                              min="2"
                              max="5"
                              value={naMaintenanceRate}
                              onChange={(e) => setNaMaintenanceRate(e.target.value)}
                              className="font-mono h-9 w-20"
                            />
                            <span className="text-xs text-muted-foreground">(Range: 2-5 mEq/kg/day)</span>
                          </div>
                          <p className="text-[10px] text-cyan-700 dark:text-cyan-400">
                            1 mEq Na = 2 ml of 3% NaCl
                          </p>
                        </div>
                      )}
                      
                      {/* Standard method inputs */}
                      {hyponatremiaMethod === "standard" && (
                        <>
                          {/* Deficit Selector - Infant/Child with percentages */}
                          <div className="space-y-2">
                            <Label className="text-xs">Fluid Deficit (Dehydration Level)</Label>
                            
                            {/* Infant / Child selector */}
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setHypoDeficitType("infant");
                                  setHypoDeficitPercent("10");
                                }}
                                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                                  hypoDeficitType === "infant"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-blue-50"
                                }`}
                              >
                                Infant
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setHypoDeficitType("child");
                                  setHypoDeficitPercent("6");
                                }}
                                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                                  hypoDeficitType === "child"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-blue-50"
                                }`}
                              >
                                Child
                              </button>
                            </div>
                            
                            {/* Percentage selector based on type */}
                            <div className="grid grid-cols-3 gap-2">
                              {hypoDeficitType === "infant" ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setHypoDeficitPercent("5")}
                                    className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                      hypoDeficitPercent === "5"
                                        ? "bg-teal-600 text-white border-teal-600"
                                        : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                    }`}
                                  >
                                    <div>5%</div>
                                    <div className="text-[10px] opacity-75">{(w*50).toFixed(0)}ml</div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setHypoDeficitPercent("10")}
                                    className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                      hypoDeficitPercent === "10"
                                        ? "bg-teal-600 text-white border-teal-600"
                                        : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                    }`}
                                  >
                                    <div>10%</div>
                                    <div className="text-[10px] opacity-75">{(w*100).toFixed(0)}ml</div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setHypoDeficitPercent("15")}
                                    className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                      hypoDeficitPercent === "15"
                                        ? "bg-teal-600 text-white border-teal-600"
                                        : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                    }`}
                                  >
                                    <div>15%</div>
                                    <div className="text-[10px] opacity-75">{(w*150).toFixed(0)}ml</div>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setHypoDeficitPercent("3")}
                                    className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                      hypoDeficitPercent === "3"
                                        ? "bg-teal-600 text-white border-teal-600"
                                        : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                    }`}
                                  >
                                    <div>3%</div>
                                    <div className="text-[10px] opacity-75">{(w*30).toFixed(0)}ml</div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setHypoDeficitPercent("6")}
                                    className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                      hypoDeficitPercent === "6"
                                        ? "bg-teal-600 text-white border-teal-600"
                                        : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                    }`}
                                  >
                                    <div>6%</div>
                                    <div className="text-[10px] opacity-75">{(w*60).toFixed(0)}ml</div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setHypoDeficitPercent("9")}
                                    className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                      hypoDeficitPercent === "9"
                                        ? "bg-teal-600 text-white border-teal-600"
                                        : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                    }`}
                                  >
                                    <div>9%</div>
                                    <div className="text-[10px] opacity-75">{(w*90).toFixed(0)}ml</div>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  
                  {hyponatremiaType === "severe" && (
                    <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 text-xs">
                      <p className="font-semibold text-red-700">Severe Hyponatremia Criteria:</p>
                      <p>Na &lt; 125 mEq/L with symptoms (seizures, mental status changes)</p>
                    </div>
                  )}
                </>
              )}
              
              {sodiumType === "hypernatremia" && (
                <>
                  <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200">
                    <button
                      type="button"
                      onClick={() => setHypernatremiaMethod("nelson")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        hypernatremiaMethod === "nelson"
                          ? "bg-orange-600 text-white"
                          : "text-orange-700 hover:bg-orange-100"
                      }`}
                    >
                      Nelson Method
                    </button>
                    <button
                      type="button"
                      onClick={() => setHypernatremiaMethod("harriet")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        hypernatremiaMethod === "harriet"
                          ? "bg-orange-600 text-white"
                          : "text-orange-700 hover:bg-orange-100"
                      }`}
                    >
                      Harriet Lane
                    </button>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Current Serum Na (mEq/L)</Label>
                    <Input
                      type="number"
                      step="1"
                      min="145"
                      max="200"
                      placeholder="e.g., 165"
                      value={currentNa}
                      onChange={(e) => setCurrentNa(e.target.value)}
                      className="font-mono h-9 mt-1"
                    />
                  </div>
                  
                  {hypernatremiaMethod === "nelson" && (
                    <div className="p-2 rounded bg-orange-50 dark:bg-orange-900/20 text-xs space-y-1">
                      <p className="font-semibold text-orange-700">Nelson Method Correction Time:</p>
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <span>Na 145-157: 24 hrs</span>
                        <span>Na 158-170: 48 hrs</span>
                        <span>Na 171-183: 72 hrs</span>
                        <span>Na 184-196: 84 hrs</span>
                      </div>
                    </div>
                  )}
                  
                  {hypernatremiaMethod === "harriet" && (
                    <>
                      <div>
                        <Label className="text-xs">Desired Na (mEq/L)</Label>
                        <Input
                          type="number"
                          step="1"
                          min="135"
                          max="145"
                          placeholder="145"
                          value={targetNa}
                          onChange={(e) => setTargetNa(e.target.value)}
                          className="font-mono h-9 mt-1"
                        />
                      </div>
                      
                      {/* Deficit Selector - Infant/Child with percentages */}
                      <div className="space-y-2">
                        <Label className="text-xs">Dehydration Level</Label>
                        
                        {/* Infant / Child selector */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setHarrietDeficitType("infant");
                              setHarrietDeficitPercent("10");
                            }}
                            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                              harrietDeficitType === "infant"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-blue-50"
                            }`}
                          >
                            Infant
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setHarrietDeficitType("child");
                              setHarrietDeficitPercent("6");
                            }}
                            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                              harrietDeficitType === "child"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-blue-50"
                            }`}
                          >
                            Child
                          </button>
                        </div>
                        
                        {/* Percentage selector based on type */}
                        <div className="grid grid-cols-3 gap-2">
                          {harrietDeficitType === "infant" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setHarrietDeficitPercent("5")}
                                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                  harrietDeficitPercent === "5"
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                }`}
                              >
                                <div>5%</div>
                                <div className="text-[10px] opacity-75">{(w*50).toFixed(0)}ml</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => setHarrietDeficitPercent("10")}
                                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                  harrietDeficitPercent === "10"
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                }`}
                              >
                                <div>10%</div>
                                <div className="text-[10px] opacity-75">{(w*100).toFixed(0)}ml</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => setHarrietDeficitPercent("15")}
                                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                  harrietDeficitPercent === "15"
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                }`}
                              >
                                <div>15%</div>
                                <div className="text-[10px] opacity-75">{(w*150).toFixed(0)}ml</div>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setHarrietDeficitPercent("3")}
                                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                  harrietDeficitPercent === "3"
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                }`}
                              >
                                <div>3%</div>
                                <div className="text-[10px] opacity-75">{(w*30).toFixed(0)}ml</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => setHarrietDeficitPercent("6")}
                                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                  harrietDeficitPercent === "6"
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                }`}
                              >
                                <div>6%</div>
                                <div className="text-[10px] opacity-75">{(w*60).toFixed(0)}ml</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => setHarrietDeficitPercent("9")}
                                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                                  harrietDeficitPercent === "9"
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-white dark:bg-gray-800 border-gray-300 hover:bg-teal-50"
                                }`}
                              >
                                <div>9%</div>
                                <div className="text-[10px] opacity-75">{(w*90).toFixed(0)}ml</div>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Phosphate-specific options */}
          {selectedElectrolyte === "phosphate" && (
            <RadioGroup value={phosphateSeverity} onValueChange={setPhosphateSeverity} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="phos-mod" />
                <Label htmlFor="phos-mod" className="text-sm">Moderate (P 1-2)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="phos-sev" />
                <Label htmlFor="phos-sev" className="text-sm">Severe (P &lt;1)</Label>
              </div>
            </RadioGroup>
          )}

          <Button onClick={calculate} className="w-full h-10">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate
          </Button>

          {/* Results */}
          {results && !results.error && (
            <Card className="border-primary/30">
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Syringe className="h-4 w-4" />
                  {results.medication}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {/* Simplified PO Result */}
                {results.isPO ? (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 text-center space-y-2">
                    <p className="text-lg font-bold text-green-800 dark:text-green-300">
                      {results.poResult.perDose} {results.poResult.frequency}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ({results.poResult.dailyDose} total = {results.poResult.perKg})
                    </p>
                  </div>
                ) : results.isNelsonMethod ? (
                  /* Nelson Method for Hypernatremia */
                  <div className="space-y-3">
                    {/* Step 1: Volume Restoration */}
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200">
                      <p className="text-xs font-bold text-red-700 dark:text-red-300 mb-2">Step 1: If Volume Depleted</p>
                      <p className="font-mono text-sm">NS Bolus: <strong>{results.nelsonData.bolusVolume} ml</strong> (20 ml/kg) over 20 min</p>
                      <p className="text-xs text-muted-foreground mt-1">Max 2 boluses</p>
                    </div>
                    
                    {/* Step 2: Correction Rate */}
                    <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border-2 border-teal-400">
                      <p className="text-xs font-bold text-teal-700 dark:text-teal-300 mb-2">Step 2: Correction (Na {results.nelsonData.naRange} → {results.nelsonData.correctionHours} hrs)</p>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Formula: 2 × Maintenance ÷ {results.nelsonData.correctionHours} hrs</p>
                        <p className="text-xs text-muted-foreground">= 2 × {results.nelsonData.maintenance} ml/day ÷ {results.nelsonData.correctionHours}</p>
                      </div>
                      <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="text-xs font-semibold">📋 Order:</p>
                        <p className="font-mono text-lg font-bold text-teal-800 dark:text-teal-200">IVF NS @ {results.nelsonData.fluidRate} ml/hr</p>
                      </div>
                    </div>
                    
                    {/* Step 3: Monitoring */}
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">Step 3: Monitoring</p>
                      <p className="text-sm">Repeat Na every <strong>4-6 hours</strong></p>
                      <p className="text-xs text-muted-foreground">Max drop: 0.5 mEq/L/hr</p>
                    </div>
                    
                    {/* Step 4: Emergency */}
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">Step 4: If Volume Depletion Develops or Seizures</p>
                      <div className="space-y-1 text-xs">
                        <p>• Volume depletion: NS bolus {results.nelsonData.bolusVolume} ml (20 ml/kg)</p>
                        <p>• <strong className="text-red-600">Seizures:</strong> 3% NaCl <strong>{results.nelsonData.seizureRescue} ml</strong> (4-6 ml/kg) over 30 min</p>
                      </div>
                    </div>
                  </div>
                ) : results.isHarrietLane ? (
                  /* Harriet Lane Method for Hypernatremia */
                  <div className="space-y-3">
                    {/* Header with Na values */}
                    <div className="p-2 rounded bg-purple-50 dark:bg-purple-900/20 text-xs">
                      <div className="flex justify-between">
                        <span>Current Na: <strong>{results.harrietData.currentNa}</strong> mEq/L</span>
                        <span>Desired Na: <strong>{results.harrietData.desiredNa}</strong> mEq/L</span>
                      </div>
                      <div className="text-center mt-1 text-[10px] text-muted-foreground">
                        Deficit: {results.harrietData.deficitType === "infant" ? "Infant" : "Child"} {results.harrietData.deficitPercent}% = {results.harrietData.totalDeficit} ml
                      </div>
                    </div>
                    
                    {/* Step 1: Calculate Deficits */}
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">Step 1: Calculate Deficits</p>
                      <div className="space-y-1 text-xs">
                        <p><strong>Free Water Deficit (FWD)</strong> = 4 × {w} × ({results.harrietData.currentNa} - {results.harrietData.desiredNa})</p>
                        <p className="pl-4">= <strong>{results.harrietData.freeWaterDeficit} ml</strong></p>
                        <p className="mt-2"><strong>Solute Fluid Deficit (SFD)</strong> = Total Deficit - FWD</p>
                        <p className="pl-4">= {results.harrietData.totalDeficit} - {results.harrietData.freeWaterDeficit} = <strong>{results.harrietData.soluteFluidDeficit} ml</strong></p>
                      </div>
                    </div>
                    
                    {/* Step 2: Calculate Total Fluid */}
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                      <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">Step 2: Total Fluid Over 24 hrs</p>
                      <div className="space-y-1 text-xs">
                        <p>Maintenance: <strong>{results.harrietData.maintenance} ml/day</strong></p>
                        <p>+ Deficit: <strong>{results.harrietData.totalDeficit} ml</strong></p>
                        <p className="border-t pt-1 mt-1">= Total: <strong>{results.harrietData.totalFluidVolume} ml</strong></p>
                      </div>
                      <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-mono text-lg font-bold text-green-800 dark:text-green-200">
                          Rate: {results.harrietData.fluidRate} ml/hr
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 3: Na Content Calculation */}
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">Step 3: Fluid Na Content</p>
                      <div className="space-y-1 text-xs">
                        <p><strong>Na Required</strong> = (SFD + Maintenance) × 14 mEq/100ml</p>
                        <p className="pl-4">= <strong>{results.harrietData.naRequired} mEq</strong></p>
                        <p className="mt-2"><strong>Na in Fluid</strong> = Na Required ÷ Total Volume × 1000</p>
                        <p className="pl-4">= <strong>{results.harrietData.naContentInFluid} mEq/L</strong></p>
                      </div>
                      <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded text-center">
                        <p className="text-xs text-muted-foreground">Recommended Fluid:</p>
                        <p className="font-bold text-amber-800 dark:text-amber-200">{results.harrietData.recommendedFluid}</p>
                      </div>
                    </div>
                    
                    {/* Step 4: 3% NaCl for severe (Na > 170) */}
                    {results.harrietData.hypertonicCalc && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-300">
                        <p className="text-xs font-bold text-red-700 dark:text-red-300 mb-2">⚠️ Severe Hypernatremia - 3% NaCl Fortification</p>
                        <div className="space-y-1 text-xs">
                          <p>Add <strong>{results.harrietData.hypertonicCalc.toAdd} ml</strong> of 3% NaCl to {results.harrietData.hypertonicCalc.nsBolus} ml NS bolus</p>
                          <p className="text-muted-foreground">(Calculated: {results.harrietData.hypertonicCalc.ml3Percent} ml per 1000ml)</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Monitoring note */}
                    <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-xs text-center">
                      <p><strong>Monitor:</strong> Na every 4-6 hrs | Max drop: 0.5 mEq/L/hr or 10-12 mEq/24hr</p>
                    </div>
                  </div>
                ) : results.is3PercentNaCl ? (
                  /* 3% NaCl Method for Hyponatremia */
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="p-2 rounded bg-cyan-50 dark:bg-cyan-900/20 text-xs">
                      <div className="flex justify-between">
                        <span>Current Na: <strong>{results.threePercentData.currentNa}</strong> mEq/L</span>
                        <span>Target Na: <strong>{results.threePercentData.targetNa}</strong> mEq/L</span>
                      </div>
                      <div className="text-center mt-1">
                        <span className="text-[10px] bg-cyan-200 dark:bg-cyan-800 px-2 py-0.5 rounded">
                          1 mEq Na = 2 ml of 3% NaCl
                        </span>
                      </div>
                    </div>
                    
                    {/* Part 1: Maintenance (Shown Separately) */}
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                      <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">1. Daily Maintenance 3% NaCl (if needed)</p>
                      <div className="space-y-1 text-xs">
                        <p>Na Maintenance: <strong>{results.threePercentData.maintenanceRate} mEq/kg/day</strong> (Range: 2-5)</p>
                        <p>= {results.threePercentData.maintenanceRate} × {results.threePercentData.weight} kg = <strong>{results.threePercentData.maintenanceNaMEq} mEq/day</strong></p>
                        <p className="border-t pt-1 mt-2">
                          <strong className="text-green-800 dark:text-green-200">3% NaCl Maintenance: {results.threePercentData.maintenance3PercentMl} ml/day</strong>
                        </p>
                        <p className="text-[10px] text-muted-foreground">({results.threePercentData.maintenanceNaMEq} mEq × 2 ml/mEq)</p>
                      </div>
                    </div>
                    
                    {/* Part 2: Deficit Correction */}
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">2. Deficit Correction</p>
                      <div className="space-y-1 text-xs">
                        <p className="font-mono text-[10px]">(Na desired - Na observed) × 0.6 × weight</p>
                        <p>= ({results.threePercentData.targetNa} - {results.threePercentData.currentNa}) × 0.6 × {results.threePercentData.weight}</p>
                        <p>= <strong>{results.threePercentData.naDeficitMEq} mEq</strong></p>
                        <p className="border-t pt-1 mt-2">
                          <strong className="text-blue-800 dark:text-blue-200">3% NaCl Deficit: {results.threePercentData.deficit3PercentMl} ml</strong>
                        </p>
                      </div>
                    </div>
                    
                    {/* Final Order Summary */}
                    <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border-2 border-teal-400">
                      <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-2">📋 Order Summary</p>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded">
                          <p className="font-bold">Option A: With Bolus</p>
                          <p className="font-mono">1. Give <strong>{results.threePercentData.halfDeficitMl} ml</strong> of 3% NaCl as bolus</p>
                          <p className="font-mono">2. Then <strong>{results.threePercentData.halfDeficitMl} ml</strong> of 3% NaCl over 24 hrs ({results.threePercentData.halfDeficitHourlyRate} ml/hr)</p>
                          <p className="text-[10px] text-muted-foreground mt-1">(1/2 deficit as bolus + 1/2 deficit as IV over 24hrs)</p>
                        </div>
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded">
                          <p className="font-bold">Option B: Without Bolus</p>
                          <p className="font-mono">Give <strong>{results.threePercentData.deficit3PercentMl} ml</strong> of 3% NaCl over 24 hrs</p>
                          <p className="font-mono">= <strong>{results.threePercentData.deficitHourlyRate} ml/hr</strong></p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Important Note */}
                    <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-xs border border-blue-300">
                      <p className="font-semibold text-blue-700">📝 N.B.</p>
                      <p className="text-blue-600 dark:text-blue-400">If the patient is already on maintenance fluids, the above deficit correction should be <strong>added to</strong> the maintenance amount.</p>
                    </div>
                    
                    {/* Warning */}
                    <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 text-xs">
                      <p className="font-semibold text-red-700">⚠️ Max correction: 8-12 mEq/24 hrs (newer guidelines: 8 mEq/24hrs)</p>
                      <p className="text-[10px] text-red-600 mt-1">Expected Na rise: {results.threePercentData.expectedNaRise} mEq - Monitor closely!</p>
                    </div>
                  </div>
                ) : results.isMildHyponatremia ? (
                  /* Mild/Asymptomatic Hyponatremia (Na 125-134) */
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-xs">
                      <div className="flex justify-between">
                        <span>Current Na: <strong>{results.mildData.currentNa}</strong> mEq/L</span>
                        <span>Target Na: <strong>{results.mildData.targetNa}</strong> mEq/L</span>
                      </div>
                      <div className="text-center mt-1 text-[10px] text-muted-foreground">
                        Deficit: {results.mildData.deficitType === "infant" ? "Infant" : "Child"} {results.mildData.deficitPercent}% = {results.mildData.deficit} ml
                      </div>
                    </div>
                    
                    {/* Step 1: Volume */}
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                      <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">Step 1: Determine Volume</p>
                      <div className="space-y-1 text-xs">
                        <p>Maintenance (100/50/20): <strong>{results.mildData.maintenance} ml/day</strong></p>
                        <p>+ Deficit ({results.mildData.deficitType === "infant" ? "Infant" : "Child"} {results.mildData.deficitPercent}%): <strong>{results.mildData.deficit} ml</strong></p>
                        <p className="border-t pt-1 mt-1">= Total: <strong>{results.mildData.totalVolume} ml/day</strong></p>
                        <p className="text-[10px] text-muted-foreground">Max 2.5L/day</p>
                      </div>
                    </div>
                    
                    {/* Step 2: Sodium Correction */}
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">Step 2: Sodium Correction</p>
                      <div className="space-y-1 text-xs">
                        <p><strong>Na Deficit</strong> = Wt × 0.6 × (Target - Measured)</p>
                        <p className="pl-4">= {w} × 0.6 × ({results.mildData.targetNa} - {results.mildData.currentNa}) = <strong>{results.mildData.naDeficit} mEq</strong></p>
                        <p className="mt-2"><strong>Na Maintenance</strong> = Wt × 2 mEq</p>
                        <p className="pl-4">= {w} × 2 = <strong>{results.mildData.naMaintenance} mEq</strong></p>
                        <p className="border-t pt-1 mt-1"><strong>Total Na:</strong> {results.mildData.naDeficit} + {results.mildData.naMaintenance} = <strong>{results.mildData.totalNa} mEq</strong></p>
                        <p className="text-[10px] text-muted-foreground mt-1">Max correction: 10-12 mEq/day = 0.5 mEq/hr</p>
                      </div>
                    </div>
                    
                    {/* Step 3: Na Concentration */}
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">Step 3: Determine Fluid Type</p>
                      <div className="space-y-1 text-xs">
                        <p><strong>Na Concentration Needed</strong> = Total Na / Volume</p>
                        <p className="pl-4">= {results.mildData.totalNa} / {(parseInt(results.mildData.totalVolume)/1000).toFixed(1)}L = <strong>{results.mildData.naConcentration} mEq/L</strong></p>
                        <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded text-center">
                          <p className="text-[10px] text-muted-foreground">Available: NS=154, RL=130, 1/2NS=77, 3%NaCl=513</p>
                          <p className="font-bold text-amber-800 dark:text-amber-200 mt-1">{results.mildData.fluidType}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 4: Dextrose */}
                    <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
                      <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-2">Step 4: Add Dextrose</p>
                      <p className="text-xs">Usually D5% added (mix NS + D50%)</p>
                      <p className="text-xs text-muted-foreground">Ratio: 450ml NS + 50ml D50% per 500ml</p>
                    </div>
                    
                    {/* Final Order */}
                    <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border-2 border-teal-400">
                      <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">📋 Order</p>
                      <p className="font-mono text-sm font-bold text-teal-800 dark:text-teal-200">
                        IVF {results.mildData.fluidType.split(" ")[0]} {results.mildData.totalVolume} ml ({results.mildData.nsVolume}ml + {results.mildData.d50Volume}ml D50%) / 24 hrs
                      </p>
                      <p className="font-mono text-xs text-teal-700 dark:text-teal-300 mt-1">
                        Rate: {results.mildData.hourlyRate} ml/hr
                      </p>
                    </div>
                  </div>
                ) : results.isSevereHyponatremia ? (
                  /* Severe/Symptomatic Hyponatremia (Na < 125 with symptoms) */
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 text-xs">
                      <p className="font-semibold text-red-700">Current Na: <strong>{results.severeData.currentNa}</strong> mEq/L</p>
                      <p className="text-[10px]">Criteria: Na &lt; 125 with seizures, mental status changes</p>
                    </div>
                    
                    {/* 3% Saline Bolus Treatment */}
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                      <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">3% Saline Bolus</p>
                      <div className="space-y-1 text-xs">
                        <p className="font-mono"><strong>{results.severeData.bolusVolumeLow}-{results.severeData.bolusVolumeHigh} ml</strong> IV bolus</p>
                        <p className="text-muted-foreground">Over 30 mins, preferably in central line</p>
                        <p className="mt-2">Goal: Increase Na by <strong>2-3 mEq/L</strong></p>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded mt-2 text-[10px]">
                          <p>• Check Na every 20 min until symptoms resolve</p>
                          <p>• May repeat bolus twice if symptoms persist</p>
                        </div>
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded mt-2 text-[10px]">
                          <p>⚠️ Max: 10-12 mEq/L in 24h, 18 mEq/L in 48h</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* After Symptom Resolution */}
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">After Symptom Resolution:</p>
                      <div className="space-y-1 text-xs">
                        <p>• Check Na every 2 hours</p>
                        <p>• Switch to isotonic saline</p>
                        <p>• Determine underlying cause</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Drug Info */}
                    <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/30 text-xs">
                      <p><strong>Stock:</strong> {currentElectrolyte.stock}</p>
                      <p><strong>Target:</strong> {currentElectrolyte.target}</p>
                    </div>

                    {/* Calculation */}
                    <div className="p-2 rounded bg-green-50 dark:bg-green-950/30 text-xs space-y-1">
                      <p className="font-semibold text-green-700 dark:text-green-300">Calculation</p>
                      <p><strong>Dose:</strong> {results.calculation.dose}</p>
                      <p className="text-muted-foreground">({results.calculation.formula})</p>
                      <p><strong>Drug Volume:</strong> {results.calculation.drugVolume}</p>
                      <p><strong>Diluent:</strong> {results.calculation.diluent}</p>
                      <p><strong>Total Volume:</strong> <span className="text-lg font-bold">{results.calculation.totalVolume}</span></p>
                    </div>

                    {/* Administration */}
                    <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-amber-600" />
                        <p className="text-xs font-semibold text-amber-700">Administration</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-muted-foreground">Duration:</span> <strong>{results.administration.duration}</strong></div>
                        <div><span className="text-muted-foreground">Rate:</span> <strong>{results.administration.rate}</strong></div>
                      </div>
                    </div>

                    {/* Order - For Ca, Mg, K, PO4 */}
                    {results.order && (
                      <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border-2 border-teal-400">
                        <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">📋 Order</p>
                        <p className="font-mono text-sm font-bold text-teal-800 dark:text-teal-200">{results.order}</p>
                      </div>
                    )}

                    {/* Preparation */}
                    <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/30 text-xs">
                      <p className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Preparation</p>
                      <p className="font-mono bg-white dark:bg-gray-900 p-1.5 rounded text-xs">{results.preparation}</p>
                    </div>

                    {/* Frequency & Notes */}
                    {results.frequency && (
                      <p className="text-xs text-center"><strong>Frequency:</strong> {results.frequency}</p>
                    )}
                    {results.notes && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <strong>Note:</strong> {results.notes}
                      </p>
                    )}
                    
                    {/* Oral NaHCO3 Note */}
                    {results.oralNote && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <strong>💊 {results.oralNote}</strong>
                      </p>
                    )}
                  </>
                )}

                {/* Warnings */}
                {results.warnings && (
                  <div className="p-2 rounded bg-red-50 dark:bg-red-950/30 border border-red-200">
                    {results.warnings.map((warn, i) => (
                      <p key={i} className="text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {warn}
                      </p>
                    ))}
                  </div>
                )}

                {/* Compatibility */}
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="p-1.5 rounded bg-green-100 dark:bg-green-900/30">
                    <p className="font-semibold text-green-700 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Compatible
                    </p>
                    <p>{currentElectrolyte.compatible}</p>
                  </div>
                  <div className="p-1.5 rounded bg-red-100 dark:bg-red-900/30">
                    <p className="font-semibold text-red-700 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Incompatible
                    </p>
                    <p>{currentElectrolyte.incompatible}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {results && results.error && (
            <div className="p-3 rounded bg-red-50 dark:bg-red-950/30 border border-red-200">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {results.error}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ElectrolytesDialog;
