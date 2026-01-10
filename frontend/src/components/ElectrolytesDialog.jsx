import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator, AlertCircle, Pill, Droplets, Clock, Beaker, AlertTriangle, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ElectrolytesDialog = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("infusions");
  const [weight, setWeight] = useState("");
  const [results, setResults] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState(null);

  // Specific state for each calculator
  const [calciumLevel, setCalciumLevel] = useState("");
  const [magnesiumLevel, setMagnesiumLevel] = useState("");
  const [potassiumLevel, setPotassiumLevel] = useState("");
  const [hco3Level, setHco3Level] = useState("");
  const [baseExcess, setBaseExcess] = useState("");
  const [nahco3Method, setNahco3Method] = useState("both");
  
  // Sodium states
  const [currentNa, setCurrentNa] = useState("");
  const [targetNa, setTargetNa] = useState("");
  const [sodiumType, setSodiumType] = useState("hyponatremia");
  const [hyponatremiaType, setHyponatremiaType] = useState("mild");
  
  // Phosphate states
  const [phosphateLevel, setPhosphateLevel] = useState("");
  const [phosphateSeverity, setPhosphateSeverity] = useState("moderate");

  // KCl specific state
  const [kclLineType, setKclLineType] = useState("4"); // Default 4 mEq/100ml
  const [kclConcentration, setKclConcentration] = useState("15"); // 15% or 10%
  
  // Addiphos specific state
  const [addiphosLineType, setAddiphosLineType] = useState("peripheral");

  const calculateCalcium = () => {
    const w = parseFloat(weight);
    if (!w) return;
    
    // Harriet Lane: Calcium Gluconate 100 mg/kg, max 1000 mg (10 ml)
    const maxDose = 1000; // mg
    const maxMl = 10; // 10% = 100mg/ml, so 10ml max
    let doseMg = w * 100;
    let doseMl = doseMg / 100;
    let isMaxed = false;
    
    if (doseMg > maxDose) {
      doseMg = maxDose;
      doseMl = maxMl;
      isMaxed = true;
    }
    
    setResults({
      title: "Calcium Gluconate 10% IV",
      sections: [
        {
          subtitle: "Dose",
          value: `${doseMg.toFixed(0)} mg (${doseMl.toFixed(1)} ml)`
        }
      ],
      frequency: calciumLevel && parseFloat(calciumLevel) < 7 ? "BD" : "OD",
      notes: [
        "Dose: 100 mg/kg (1 ml/kg)",
        `Max: ${maxDose} mg (${maxMl} ml)`,
        "Concentration: 100 mg/ml",
        "Keep OD or BD according to level and need"
      ],
      ...(isMaxed && { warnings: ["⚠️ Dose capped at maximum (1g / 10ml)"] })
    });
  };

  const calculateMagnesium = () => {
    const w = parseFloat(weight);
    if (!w) return;
    
    // Harriet Lane: MgSO4 25-50 mg/kg/dose, max 2000 mg (2g) per dose
    const maxDose = 2000; // mg
    
    const nicuMinMl = w * 0.1;
    const nicuMaxMl = w * 0.2;
    let minMg = w * 25;
    let maxMg = w * 50;
    let isMaxed = false;
    
    if (maxMg > maxDose) {
      maxMg = maxDose;
      minMg = Math.min(minMg, maxDose);
      isMaxed = true;
    }
    
    const minMl = minMg / 500;
    const maxMl = maxMg / 500;
    
    setResults({
      title: "Magnesium Replacement",
      sections: [
        {
          subtitle: "NICU (Hypomagnesemia)",
          value: `${nicuMinMl.toFixed(2)} - ${nicuMaxMl.toFixed(2)} ml`,
          detail: "0.1-0.2 ml/kg BD for 3 doses"
        },
        {
          subtitle: "General Ward (50% MgSulfate)",
          value: `${minMg.toFixed(0)} - ${maxMg.toFixed(0)} mg (${minMl.toFixed(2)} - ${maxMl.toFixed(2)} ml)`,
          detail: "25-50 mg/kg BD for 3 doses"
        },
        {
          subtitle: "Status Asthmaticus",
          value: `${minMg.toFixed(0)} - ${maxMg.toFixed(0)} mg`,
          detail: "25-50 mg/kg over 20-30 mins"
        }
      ],
      notes: [
        "50% MgSulfate concentration: 500 mg/ml",
        `Max single dose: ${maxDose} mg (${maxDose/500} ml)`
      ],
      ...(isMaxed && { warnings: ["⚠️ Dose capped at maximum (2g per dose)"] })
    });
  };

  const calculatePotassium = () => {
    const w = parseFloat(weight);
    if (!w) return;
    
    // Harriet Lane: KCl 0.5-1 mEq/kg/dose, max 40 mEq/dose for IV, max 20 mEq/dose for PO
    const ivMaxDose = 40; // mEq
    const poMaxDose = 20; // mEq
    
    let bolusMin = w * 0.5;
    let bolusMax = w * 1;
    let poMin = w * 0.5;
    let poMax = w * 1;
    let ivIsMaxed = false;
    let poIsMaxed = false;
    
    if (bolusMax > ivMaxDose) {
      bolusMax = ivMaxDose;
      bolusMin = Math.min(bolusMin, ivMaxDose);
      ivIsMaxed = true;
    }
    
    if (poMax > poMaxDose) {
      poMax = poMaxDose;
      poMin = Math.min(poMin, poMaxDose);
      poIsMaxed = true;
    }
    
    setResults({
      title: "Potassium (Hypokalemia)",
      sections: [
        { 
          subtitle: "IV Bolus", 
          value: `${bolusMin.toFixed(1)} - ${bolusMax.toFixed(1)} mEq`, 
          detail: `0.5-1 mEq/kg over 1-2 hours${ivIsMaxed ? ' (MAX REACHED)' : ''}` 
        },
        { 
          subtitle: "PO (KCl)", 
          value: `${poMin.toFixed(1)} - ${poMax.toFixed(1)} mEq`, 
          detail: `0.5-1 mEq/kg, can be given BD${poIsMaxed ? ' (MAX REACHED)' : ''}` 
        }
      ],
      notes: [
        `IV max: ${ivMaxDose} mEq/dose`,
        `PO max: ${poMaxDose} mEq/dose`,
        "NICU: For every 25 ml D10%, give 1 mEq KCl",
        "Monitor ECG if giving >0.5 mEq/kg/hr"
      ],
      ...((ivIsMaxed || poIsMaxed) && { warnings: ["⚠️ Dose capped at maximum per Harriet Lane"] })
    });
  };

  const calculateNaHCO3 = () => {
    const w = parseFloat(weight);
    const hco3 = parseFloat(hco3Level);
    const be = parseFloat(baseExcess);
    
    if (!w) return;
    
    const resultData = {
      title: "NaHCO3 Correction",
      sections: [],
      notes: [
        "Normal HCO3 range: 18-22 mEq/L",
        "Correct when HCO3 < 12 or symptomatic"
      ],
      warnings: [
        "Give in 2 halves: 1st half in 1st hour, 2nd half over 24 hours",
        "In chronic acidosis with hypocalcemia: correct calcium FIRST"
      ]
    };
    
    if ((nahco3Method === "hco3" || nahco3Method === "both") && !isNaN(hco3)) {
      const desiredHCO3 = 20;
      const correction1 = (desiredHCO3 - hco3) * 0.3 * w;
      resultData.sections.push({
        subtitle: "Method 1: Using HCO3",
        value: `${correction1.toFixed(1)} mEq`,
        detail: `1st half: ${(correction1/2).toFixed(1)} mEq | 2nd half: ${(correction1/2).toFixed(1)} mEq`
      });
    }
    
    if ((nahco3Method === "be" || nahco3Method === "both") && !isNaN(be)) {
      const correction2 = Math.abs(be) * 0.3 * w;
      resultData.sections.push({
        subtitle: "Method 2: Using Base Excess",
        value: `${correction2.toFixed(1)} mEq`,
        detail: `1st half: ${(correction2/2).toFixed(1)} mEq | 2nd half: ${(correction2/2).toFixed(1)} mEq`
      });
    }
    
    resultData.sections.push({
      subtitle: "Persistent Low HCO3 - Infusion",
      value: `${(w * 0.25).toFixed(2)} - ${(w * 2).toFixed(1)} mEq/hr`
    });
    
    setResults(resultData);
  };

  const calculateSodium = () => {
    const w = parseFloat(weight);
    const na = parseFloat(currentNa);
    const targetNaVal = parseFloat(targetNa) || 140;
    
    if (!w || !na) return;
    
    if (sodiumType === "hyponatremia") {
      if (hyponatremiaType === "severe") {
        // 3% NaCl given as ml/day (not multiplied by weight)
        // Reference: Maintenance = 1-3 mEq/kg (1 mEq = 2ml)
        setResults({
          title: "Hyponatremia Correction (Severe)",
          subtitle: "Na < 125 with seizure or encephalopathy",
          sections: [
            { 
              subtitle: "3% NaCl Bolus", 
              value: `3-5 ml/kg`,
              detail: "Over 15-30 mins"
            },
            { 
              subtitle: "3% NaCl Infusion", 
              value: `1-2 ml/kg/hr`,
              detail: "Continuous infusion option"
            },
            { 
              subtitle: "Goal", 
              value: `Increase Na by 6-8 mEq/L`,
              detail: "Check Na every 20 mins until symptoms resolve"
            }
          ],
          notes: [
            "📌 Reference: Maintenance = 1-3 mEq/kg (1 mEq = 2 ml of 3% NaCl)",
            "3% NaCl = 0.513 mEq/ml (513 mEq/L)",
            "May repeat bolus up to 2 times"
          ],
          warnings: ["Do not exceed 10-12 mEq/L rise in 24 hours"]
        });
      } else {
        const naDeficit = w * 0.6 * (targetNaVal - na);
        const maintenance = w * 2;
        setResults({
          title: "Hyponatremia Correction (Mild)",
          subtitle: `Na ${na} mEq/L`,
          sections: [
            { subtitle: "Na Deficit", value: `${naDeficit.toFixed(1)} mEq` },
            { subtitle: "Na Maintenance", value: `${maintenance.toFixed(1)} - ${(w*5).toFixed(1)} mEq/day` },
            { subtitle: "Fluid Options", value: `NS: 154 | ½NS: 77 | 3%NaCl: 513 mEq/L` }
          ],
          notes: ["Correction max 10-12 mEq/day = 0.5 mEq/hr"]
        });
      }
    } else {
      const fwd = 4 * w * (na - targetNaVal);
      const maintenance = w * 100;
      const totalFluid = maintenance + fwd;
      let correctionHours = na >= 184 ? 84 : na >= 171 ? 72 : na >= 158 ? 48 : 24;
      const rate = totalFluid / correctionHours;
      
      setResults({
        title: "Hypernatremia Correction",
        subtitle: `Na ${na} mEq/L`,
        sections: [
          { subtitle: "Free Water Deficit", value: `${fwd.toFixed(1)} ml` },
          { subtitle: "Total Fluid", value: `${totalFluid.toFixed(0)} ml over ${correctionHours}h` },
          { subtitle: "Rate", value: `${rate.toFixed(1)} ml/hr` }
        ],
        warnings: ["Don't drop Na >12 mEq/24hr"]
      });
    }
  };

  const calculatePhosphate = () => {
    const w = parseFloat(weight);
    if (!w) return;
    
    // Harriet Lane: Phosphate 0.08-0.5 mmol/kg, max 15 mmol/dose
    const maxDose = 15; // mmol
    
    const range = phosphateSeverity === "severe" 
      ? { min: 0.25, max: 0.5, label: "Severe (P < 1 mg/dL)" }
      : { min: 0.08, max: 0.16, label: "Moderate (P 1-2 mg/dL)" };
    
    let minDose = w * range.min;
    let maxDoseCalc = w * range.max;
    let isMaxed = false;
    
    if (maxDoseCalc > maxDose) {
      maxDoseCalc = maxDose;
      minDose = Math.min(minDose, maxDose);
      isMaxed = true;
    }
    
    setResults({
      title: "Phosphate Replacement (IV)",
      sections: [
        { subtitle: "Severity", value: range.label },
        { subtitle: "Dose", value: `${minDose.toFixed(2)} - ${maxDoseCalc.toFixed(2)} mmol` },
        { subtitle: "Infusion", value: "Over 4-6 hours (slow)" }
      ],
      notes: [
        `Max single dose: ${maxDose} mmol`,
        "Recheck phosphate 2-4 hours after infusion"
      ],
      warning: "Rapid infusion can cause severe hypocalcemia!",
      ...(isMaxed && { warnings: ["⚠️ Dose capped at maximum (15 mmol)"] })
    });
  };

  // Enhanced Drug Infusion Calculator with better KCl dilution
  const calculateDrugInfusion = (drug) => {
    const w = parseFloat(weight);
    if (!w) {
      setResults({ 
        title: "⚠️ Enter Weight First", 
        sections: [{ subtitle: "Required", value: "Please enter patient weight above to calculate doses" }]
      });
      return;
    }
    
    setSelectedDrug(drug);
    
    const drugs = {
      calciumGluconate: (() => {
        // Harriet Lane: 100 mg/kg, max 1000 mg (10 ml)
        // Target dilution: 50 mg/ml
        const maxDoseMg = 1000;
        let doseMg = w * 100;
        let isMaxed = false;
        
        if (doseMg > maxDoseMg) {
          doseMg = maxDoseMg;
          isMaxed = true;
        }
        
        const doseMl = doseMg / 100; // 100mg/ml concentration (stock)
        const targetConc = 50; // 50 mg/ml target dilution
        const totalVolume = doseMg / targetConc; // Total volume after dilution
        const diluentMl = totalVolume - doseMl; // Diluent needed
        const ratePerHour = totalVolume; // Over 1 hour
        
        return {
          title: "💉 Calcium Gluconate 10%",
          drugInfo: {
            concentration: "100 mg/ml (0.45 mEq/ml)",
            targetDilution: "50 mg/ml",
            maxDose: `${maxDoseMg} mg (${maxDoseMg/100} ml)`
          },
          calculation: {
            dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg × 100 mg/kg = ${(w * 100).toFixed(0)} mg${isMaxed ? ' → capped at ' + maxDoseMg + ' mg' : ''}`,
            drugVolume: `${doseMl.toFixed(1)} ml`,
            diluent: `${diluentMl.toFixed(1)} ml (NS or D5W)`,
            totalVolume: `${totalVolume.toFixed(1)} ml (at 50 mg/ml)`,
            duration: "1 hour",
            rate: `${ratePerHour.toFixed(1)} ml/hr`
          },
          preparation: `Draw ${doseMl.toFixed(1)} ml Ca Gluconate + ${diluentMl.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
          compatible: "NS, D5W, D10W",
          incompatible: "Amphotericin B, Ceftriaxone, Fluconazole, Meropenem, Methylprednisolone, Phosphate, Magnesium",
          ...(isMaxed && { maxWarning: "⚠️ Dose capped at maximum (1g / 10ml)" })
        };
      })(),
      
      kcl: (() => {
        // Harriet Lane: 0.5-1 mEq/kg, max 40 mEq/dose IV
        const maxDoseMEq = 40;
        let doseMin = w * 0.5;
        let doseMax = w * 1;
        let isMaxed = false;
        
        if (doseMax > maxDoseMEq) {
          doseMax = maxDoseMEq;
          doseMin = Math.min(doseMin, maxDoseMEq);
          isMaxed = true;
        }
        
        const mEqPerMl = kclConcentration === "15" ? 2 : 1.34; // 15% = 2mEq/ml, 10% = 1.34mEq/ml
        const drugVolumeMin = doseMin / mEqPerMl;
        const drugVolumeMax = doseMax / mEqPerMl;
        
        // Target concentration in mEq/100ml (user selectable 1-6 mEq/100ml)
        // Convert to mEq/ml for calculations
        const targetConcPer100ml = parseFloat(kclLineType); // 1-6 mEq/100ml
        const targetConc = targetConcPer100ml / 100; // Convert to mEq/ml
        
        // Calculate minimum total volume needed for safe concentration
        const minTotalVolumeMin = doseMin / targetConc;
        const minTotalVolumeMax = doseMax / targetConc;
        
        // Diluent needed
        const diluentMin = minTotalVolumeMin - drugVolumeMin;
        const diluentMax = minTotalVolumeMax - drugVolumeMax;
        
        // Rate for 2 hour infusion (preferred)
        const rate2hr = minTotalVolumeMax / 2;
        const rate1hr = minTotalVolumeMax / 1;
        
        // Determine if peripheral safe (generally ≤80 mEq/L = 8 mEq/100ml)
        const isPeripheralSafe = targetConcPer100ml <= 8;
        
        return {
          title: "💉 Potassium Chloride (KCl)",
          drugInfo: {
            concentration: kclConcentration === "15" ? "15% KCl = 2 mEq/ml" : "10% KCl = 1.34 mEq/ml",
            targetDilution: `${targetConcPer100ml} mEq/100ml (${(targetConcPer100ml * 10).toFixed(0)} mEq/L)`,
            maxDose: `${maxDoseMEq} mEq/dose`,
            lineRecommendation: isPeripheralSafe ? "✅ Safe for peripheral line" : "⚠️ Central line recommended"
          },
          calculation: {
            dose: `${doseMin.toFixed(2)} - ${doseMax.toFixed(2)} mEq${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg × 0.5-1 mEq/kg${isMaxed ? ' → capped at ' + maxDoseMEq + ' mEq' : ''}`,
            drugVolume: `${drugVolumeMin.toFixed(2)} - ${drugVolumeMax.toFixed(2)} ml`,
            diluent: `${diluentMin.toFixed(0)} - ${diluentMax.toFixed(0)} ml (to achieve ${targetConcPer100ml} mEq/100ml)`,
            totalVolume: `${minTotalVolumeMin.toFixed(0)} - ${minTotalVolumeMax.toFixed(0)} ml`,
            duration: "1-2 hours (2 hours preferred)",
            rate: `${rate2hr.toFixed(1)} ml/hr (2h) or ${rate1hr.toFixed(1)} ml/hr (1h)`
          },
          preparation: `For max dose: ${drugVolumeMax.toFixed(2)} ml KCl ${kclConcentration}% + ${diluentMax.toFixed(0)} ml NS = ${minTotalVolumeMax.toFixed(0)} ml`,
          compatible: "NS, D5W, LR (most IV solutions)",
          incompatible: "Amphotericin B, Diazepam, Phenytoin",
          ...(isMaxed && { maxWarning: "⚠️ Dose capped at maximum (40 mEq)" }),
          ...(!isPeripheralSafe && { warnings: ["⚠️ Concentration >8 mEq/100ml - Central line recommended"] })
        };
      })(),
      
      mgso4: (() => {
        // Harriet Lane: 25-50 mg/kg, max 2000 mg (2g) per dose
        const maxDoseMg = 2000;
        let doseMin = w * 25;
        let doseMax = w * 50;
        let isMaxed = false;
        
        if (doseMax > maxDoseMg) {
          doseMax = maxDoseMg;
          doseMin = Math.min(doseMin, maxDoseMg);
          isMaxed = true;
        }
        
        const drugVolumeMin = doseMin / 500; // 50% = 500mg/ml
        const drugVolumeMax = doseMax / 500;
        const targetConc = 60; // 60mg/ml
        const totalVolumeMin = doseMin / targetConc;
        const totalVolumeMax = doseMax / targetConc;
        const diluentMin = totalVolumeMin - drugVolumeMin;
        const diluentMax = totalVolumeMax - drugVolumeMax;
        const rate4hr = totalVolumeMin / 4;
        const rate2hr = totalVolumeMax / 2;
        
        return {
          title: "💉 Magnesium Sulfate 50%",
          drugInfo: {
            concentration: "500 mg/ml (2 mmol/ml, 4 mEq/ml)",
            targetDilution: "60 mg/ml",
            maxDose: `${maxDoseMg} mg (${maxDoseMg/500} ml)`
          },
          calculation: {
            dose: `${doseMin.toFixed(0)} - ${doseMax.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg × 25-50 mg/kg${isMaxed ? ' → capped at ' + maxDoseMg + ' mg' : ''}`,
            drugVolume: `${drugVolumeMin.toFixed(2)} - ${drugVolumeMax.toFixed(2)} ml`,
            diluent: `${diluentMin.toFixed(1)} - ${diluentMax.toFixed(1)} ml`,
            totalVolume: `${totalVolumeMin.toFixed(1)} - ${totalVolumeMax.toFixed(1)} ml`,
            duration: "2-4 hours",
            rate: `${rate4hr.toFixed(1)} - ${rate2hr.toFixed(1)} ml/hr`
          },
          preparation: `Draw ${drugVolumeMax.toFixed(2)} ml MgSO4 50% + ${diluentMax.toFixed(1)} ml diluent = ${totalVolumeMax.toFixed(1)} ml`,
          compatible: "D5W, NS, LR",
          incompatible: "Amiodarone, Amphotericin B, Calcium chloride, Cefepime, Sodium bicarbonate",
          ...(isMaxed && { maxWarning: "⚠️ Dose capped at maximum (2g)" })
        };
      })(),
      
      sodaBicarb: (() => {
        // Harriet Lane: 1-2 mEq/kg, max 50 mEq/dose (neonates), 100 mEq/dose (children)
        // Stock: 8.4% = 1 mEq/ml
        // Dilution: 1:1 (every mEq diluted with same amount in ml)
        const maxDoseMEq = 50; // Using conservative neonatal max
        let doseMin = w * 1;
        let doseMax = w * 2;
        let isMaxed = false;
        
        if (doseMax > maxDoseMEq) {
          doseMax = maxDoseMEq;
          doseMin = Math.min(doseMin, maxDoseMEq);
          isMaxed = true;
        }
        
        const drugVolumeMin = doseMin; // 8.4% = 1mEq/ml
        const drugVolumeMax = doseMax;
        // 1:1 dilution - add equal volume of diluent
        const diluentMin = doseMin; // Same as dose in ml
        const diluentMax = doseMax;
        const totalVolumeMin = drugVolumeMin + diluentMin;
        const totalVolumeMax = drugVolumeMax + diluentMax;
        const rate1hr = totalVolumeMax;
        const rate30min = totalVolumeMax * 2;
        
        return {
          title: "💉 Sodium Bicarbonate 8.4%",
          drugInfo: {
            concentration: "1 mEq/ml (8.4%)",
            targetDilution: "1:1 dilution (1 mEq in 2 ml final volume)",
            maxDose: `${maxDoseMEq} mEq/dose (neonates), 100 mEq (older children)`
          },
          calculation: {
            dose: `${doseMin.toFixed(1)} - ${doseMax.toFixed(1)} mEq${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg × 1-2 mEq/kg${isMaxed ? ' → capped at ' + maxDoseMEq + ' mEq' : ''}`,
            drugVolume: `${drugVolumeMin.toFixed(1)} - ${drugVolumeMax.toFixed(1)} ml`,
            diluent: `${diluentMin.toFixed(1)} - ${diluentMax.toFixed(1)} ml (1:1 dilution)`,
            totalVolume: `${totalVolumeMin.toFixed(1)} - ${totalVolumeMax.toFixed(1)} ml`,
            duration: "30 min - 1 hour",
            rate: `${rate1hr.toFixed(1)} ml/hr (1h) or ${rate30min.toFixed(1)} ml/hr (30min)`
          },
          preparation: `Draw ${drugVolumeMax.toFixed(1)} ml NaHCO3 + ${diluentMax.toFixed(1)} ml NS = ${totalVolumeMax.toFixed(1)} ml`,
          compatible: "NS, D5W, D10W",
          incompatible: "Amiodarone, Calcium salts, Dobutamine, Dopamine, Epinephrine, Norepinephrine, Magnesium sulfate, Midazolam, Phenytoin",
          ...(isMaxed && { maxWarning: "⚠️ Dose capped at maximum (50 mEq)" })
        };
      })(),
      
      calciumChloride: (() => {
        // Harriet Lane: 10-20 mg/kg, max 1000 mg (1g) per dose
        // Stock: 10% = 100 mg/ml
        // Central line preferred - highly vesicant
        // For peripheral: dilute to ~15-20 mg/ml and give slowly
        const maxDoseMg = 1000;
        let doseMg = w * 10; // Using lower dose 10mg/kg
        let isMaxed = false;
        
        if (doseMg > maxDoseMg) {
          doseMg = maxDoseMg;
          isMaxed = true;
        }
        
        const doseMl = doseMg / 100; // 100mg/ml stock
        // Dilute to 15 mg/ml for peripheral use (1:5.7 dilution approximately)
        const targetConc = 15; // 15 mg/ml for peripheral
        const totalVolume = doseMg / targetConc;
        const diluentMl = totalVolume - doseMl;
        const ratePerHour = totalVolume;
        
        return {
          title: "💉 Calcium Chloride 10%",
          drugInfo: {
            concentration: "100 mg/ml (1.4 mEq/ml)",
            targetDilution: "15-20 mg/ml (peripheral) or undiluted (central)",
            maxDose: `${maxDoseMg} mg (${maxDoseMg/100} ml)`
          },
          calculation: {
            dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg × 10 mg/kg${isMaxed ? ' → capped at ' + maxDoseMg + ' mg' : ''}`,
            drugVolume: `${doseMl.toFixed(2)} ml`,
            diluent: `${diluentMl.toFixed(1)} ml (for peripheral at 15 mg/ml)`,
            totalVolume: `${totalVolume.toFixed(1)} ml`,
            duration: "1 hour (≥10 min minimum)",
            rate: `${ratePerHour.toFixed(1)} ml/hr`
          },
          preparation: `Draw ${doseMl.toFixed(2)} ml CaCl2 + ${diluentMl.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
          compatible: "NS, D5W",
          incompatible: "Phosphates, Sodium Bicarbonate, Sulphates, Amphotericin B, Ceftriaxone",
          warnings: ["⚠️ CENTRAL LINE PREFERRED - Highly vesicant!", "If peripheral: use large vein, dilute well, infuse slowly"],
          ...(isMaxed && { maxWarning: "⚠️ Dose capped at maximum (1g)" })
        };
      })(),
      
      addiphos: (() => {
        // Harriet Lane: 0.5-1.5 mmol/kg/day, max 15 mmol/dose
        // Peripheral: 0.05 mmol/ml, Central: 0.12 mmol/ml
        const maxDose = 15; // mmol
        let doseMin = w * 0.5;
        let doseMax = w * 1.5;
        let isMaxed = false;
        
        if (doseMax > maxDose) {
          doseMax = maxDose;
          doseMin = Math.min(doseMin, maxDose);
          isMaxed = true;
        }
        
        const volumeMin = doseMin / 2; // 1ml = 2mmol (stock concentration)
        const volumeMax = doseMax / 2;
        
        // Target concentration based on line type
        const targetConc = addiphosLineType === "peripheral" ? 0.05 : 0.12; // mmol/ml
        const targetConcLabel = addiphosLineType === "peripheral" ? "0.05 mmol/ml (peripheral)" : "0.12 mmol/ml (central)";
        
        // Calculate dilution needed
        const totalVolumeMin = doseMin / targetConc;
        const totalVolumeMax = doseMax / targetConc;
        const diluentMin = totalVolumeMin - volumeMin;
        const diluentMax = totalVolumeMax - volumeMax;
        
        return {
          title: "💉 Addiphos (Phosphate)",
          drugInfo: {
            concentration: "1 ml = 2 mmol phosphate",
            targetDilution: targetConcLabel,
            maxDose: `${maxDose} mmol/dose`
          },
          calculation: {
            dose: `${doseMin.toFixed(1)} - ${doseMax.toFixed(1)} mmol/day${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg × 0.5-1.5 mmol/kg/day${isMaxed ? ' → capped at ' + maxDose + ' mmol' : ''}`,
            drugVolume: `${volumeMin.toFixed(2)} - ${volumeMax.toFixed(2)} ml`,
            diluent: `${diluentMin.toFixed(0)} - ${diluentMax.toFixed(0)} ml (to achieve ${targetConcLabel})`,
            totalVolume: `${totalVolumeMin.toFixed(0)} - ${totalVolumeMax.toFixed(0)} ml`,
            duration: "4-6 hours (slow infusion)",
            rate: "Divide into 2-4 doses per day"
          },
          preparation: `For max dose: ${volumeMax.toFixed(2)} ml Addiphos + ${diluentMax.toFixed(0)} ml NS = ${totalVolumeMax.toFixed(0)} ml`,
          compatible: "Most IV fluids",
          incompatible: "Calcium salts (precipitation risk)",
          ...(isMaxed && { maxWarning: "⚠️ Dose capped at maximum (15 mmol)" })
        };
      })()
    };
    
    if (drugs[drug]) {
      setResults(drugs[drug]);
    }
  };

  // Render enhanced results with step-by-step preparation
  const renderInfusionResults = () => {
    if (!results || !results.calculation) return null;
    
    return (
      <Card className={`mt-4 border-2 ${results.maxWarning ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20' : 'border-primary/30 bg-gradient-to-br from-primary/5 to-transparent'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{results.title}</CardTitle>
          {results.maxWarning && (
            <div className="mt-2 p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 border border-amber-300">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> {results.maxWarning}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drug Info */}
          {results.drugInfo && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">📋 Drug Information</p>
              <p className="text-sm"><strong>Stock:</strong> {results.drugInfo.concentration}</p>
              {results.drugInfo.targetDilution && (
                <p className="text-sm"><strong>Target:</strong> {results.drugInfo.targetDilution}</p>
              )}
              {results.drugInfo.maxConcentration && (
                <p className="text-sm"><strong>Max Conc:</strong> {results.drugInfo.maxConcentration}</p>
              )}
              {results.drugInfo.maxDose && (
                <p className="text-sm"><strong>Max Dose:</strong> <span className="text-red-600 dark:text-red-400 font-medium">{results.drugInfo.maxDose}</span></p>
              )}
            </div>
          )}
          
          {/* Step by Step Calculation */}
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">📊 Calculation</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center border-b border-green-200 dark:border-green-700 pb-1">
                <span className="text-muted-foreground">1. Dose:</span>
                <span className="font-bold text-green-700 dark:text-green-300">{results.calculation.dose}</span>
              </div>
              <div className="text-xs text-muted-foreground pl-4">({results.calculation.doseFormula})</div>
              
              <div className="flex justify-between items-center border-b border-green-200 dark:border-green-700 pb-1">
                <span className="text-muted-foreground">2. Drug Volume:</span>
                <span className="font-bold">{results.calculation.drugVolume}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-green-200 dark:border-green-700 pb-1">
                <span className="text-muted-foreground">3. Diluent:</span>
                <span className="font-bold">{results.calculation.diluent}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-green-200 dark:border-green-700 pb-1">
                <span className="text-muted-foreground">4. Total Volume:</span>
                <span className="font-bold text-lg">{results.calculation.totalVolume}</span>
              </div>
            </div>
          </div>
          
          {/* Duration and Rate - Highlighted */}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">⏱️ Administration</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{results.calculation.duration}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rate</p>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{results.calculation.rate}</p>
              </div>
            </div>
          </div>
          
          {/* Preparation Instructions */}
          {results.preparation && (
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">🧪 Preparation</p>
              <p className="text-sm font-mono bg-white dark:bg-gray-900 p-2 rounded">{results.preparation}</p>
            </div>
          )}
          
          {/* Compatibility */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-green-100 dark:bg-green-900/30">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Compatible
              </p>
              <p className="text-xs mt-1">{results.compatible}</p>
            </div>
            <div className="p-2 rounded bg-red-100 dark:bg-red-900/30">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Incompatible
              </p>
              <p className="text-xs mt-1">{results.incompatible}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderResults = () => {
    if (!results) return null;
    
    // Use enhanced rendering for drug infusions
    if (results.calculation) {
      return renderInfusionResults();
    }
    
    return (
      <Card className="mt-4 border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            {results.title}
          </CardTitle>
          {results.subtitle && <CardDescription>{results.subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-3">
          {results.dose && (
            <div className="p-3 rounded-lg bg-background border">
              <p className="text-sm text-muted-foreground">Dose</p>
              <p className="text-xl font-mono font-bold text-primary">{results.dose}</p>
              {results.frequency && <p className="text-sm">Frequency: {results.frequency}</p>}
            </div>
          )}
          
          {results.sections?.map((section, i) => (
            <div key={i} className="p-3 rounded-lg bg-background border">
              <p className="text-sm text-muted-foreground">{section.subtitle}</p>
              <p className="text-lg font-mono font-bold">{section.value}</p>
              {section.detail && <p className="text-sm text-muted-foreground mt-1">{section.detail}</p>}
            </div>
          ))}
          
          {results.notes?.length > 0 && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Notes</p>
              <ul className="text-sm space-y-1">
                {results.notes.map((note, i) => (
                  <li key={i} className="text-blue-600 dark:text-blue-400">{note}</li>
                ))}
              </ul>
            </div>
          )}
          
          {results.warnings?.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> Warnings
              </p>
              <ul className="text-sm space-y-1">
                {results.warnings.map((warn, i) => (
                  <li key={i} className="text-amber-600 dark:text-amber-400">{warn}</li>
                ))}
              </ul>
            </div>
          )}
          
          {results.warning && (
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-950/50 border border-red-300">
              <p className="text-sm font-bold text-red-700 dark:text-red-300 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {results.warning}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Electrolytes Calculator
          </DialogTitle>
        </DialogHeader>

        {/* Weight Input - More Prominent */}
        <Card className="border-2 border-primary/50 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-base font-semibold">Patient Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Enter weight..."
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setResults(null); }}
                  className="font-mono text-lg h-12 mt-1"
                  data-testid="electrolyte-weight"
                />
              </div>
              {weight && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-2xl font-bold text-primary">{weight} kg</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setResults(null); setSelectedDrug(null); }} className="w-full">
          <TabsList className="grid grid-cols-2 h-auto">
            <TabsTrigger value="infusions" className="py-2 flex items-center gap-1">
              <Beaker className="h-4 w-4" />
              <span>IV Infusions</span>
            </TabsTrigger>
            <TabsTrigger value="corrections" className="py-2 flex items-center gap-1">
              <Calculator className="h-4 w-4" />
              <span>Corrections</span>
            </TabsTrigger>
          </TabsList>

          {/* IV Infusions Tab - New Primary Tab */}
          <TabsContent value="infusions" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Select Electrolyte</CardTitle>
                <CardDescription>Click to calculate dilution and rate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Drug Selection Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={selectedDrug === 'calciumGluconate' ? 'default' : 'outline'} 
                    className="h-16 flex-col"
                    onClick={() => calculateDrugInfusion('calciumGluconate')}
                  >
                    <span className="text-lg">Ca²⁺</span>
                    <span className="text-xs">Calcium Gluconate</span>
                  </Button>
                  <Button 
                    variant={selectedDrug === 'kcl' ? 'default' : 'outline'} 
                    className="h-16 flex-col"
                    onClick={() => calculateDrugInfusion('kcl')}
                  >
                    <span className="text-lg">K⁺</span>
                    <span className="text-xs">Potassium Chloride</span>
                  </Button>
                  <Button 
                    variant={selectedDrug === 'mgso4' ? 'default' : 'outline'} 
                    className="h-16 flex-col"
                    onClick={() => calculateDrugInfusion('mgso4')}
                  >
                    <span className="text-lg">Mg²⁺</span>
                    <span className="text-xs">Magnesium Sulfate</span>
                  </Button>
                  <Button 
                    variant={selectedDrug === 'sodaBicarb' ? 'default' : 'outline'} 
                    className="h-16 flex-col"
                    onClick={() => calculateDrugInfusion('sodaBicarb')}
                  >
                    <span className="text-lg">HCO₃⁻</span>
                    <span className="text-xs">Sodium Bicarbonate</span>
                  </Button>
                  <Button 
                    variant={selectedDrug === 'calciumChloride' ? 'default' : 'outline'} 
                    className="h-16 flex-col"
                    onClick={() => calculateDrugInfusion('calciumChloride')}
                  >
                    <span className="text-lg">CaCl₂</span>
                    <span className="text-xs">Calcium Chloride</span>
                  </Button>
                  <Button 
                    variant={selectedDrug === 'addiphos' ? 'default' : 'outline'} 
                    className="h-16 flex-col"
                    onClick={() => calculateDrugInfusion('addiphos')}
                  >
                    <span className="text-lg">PO₄³⁻</span>
                    <span className="text-xs">Addiphos</span>
                  </Button>
                </div>

                {/* KCl Options */}
                {selectedDrug === 'kcl' && (
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Line Type</Label>
                        <Select value={kclLineType} onValueChange={(v) => { setKclLineType(v); calculateDrugInfusion('kcl'); }}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 mEq/100ml (10 mEq/L)</SelectItem>
                            <SelectItem value="2">2 mEq/100ml (20 mEq/L)</SelectItem>
                            <SelectItem value="3">3 mEq/100ml (30 mEq/L)</SelectItem>
                            <SelectItem value="4">4 mEq/100ml (40 mEq/L)</SelectItem>
                            <SelectItem value="5">5 mEq/100ml (50 mEq/L)</SelectItem>
                            <SelectItem value="6">6 mEq/100ml (60 mEq/L)</SelectItem>
                            <SelectItem value="8">8 mEq/100ml (80 mEq/L) - Peripheral max</SelectItem>
                            <SelectItem value="15">15 mEq/100ml (Central)</SelectItem>
                            <SelectItem value="20">20 mEq/100ml (Central - Fluid restricted)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">KCl Concentration</Label>
                        <Select value={kclConcentration} onValueChange={(v) => { setKclConcentration(v); calculateDrugInfusion('kcl'); }}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15% (2 mEq/ml)</SelectItem>
                            <SelectItem value="10">10% (1.34 mEq/ml)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Addiphos Options */}
                {selectedDrug === 'addiphos' && (
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3">
                    <div>
                      <Label className="text-xs">Line Type</Label>
                      <Select value={addiphosLineType} onValueChange={(v) => { setAddiphosLineType(v); calculateDrugInfusion('addiphos'); }}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peripheral">Peripheral (0.05 mmol/ml)</SelectItem>
                          <SelectItem value="central">Central (0.12 mmol/ml)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Corrections Tab */}
          <TabsContent value="corrections" className="space-y-4">
            <Tabs defaultValue="calcium" className="w-full">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto">
                <TabsTrigger value="calcium" className="text-xs py-1.5">Calcium</TabsTrigger>
                <TabsTrigger value="magnesium" className="text-xs py-1.5">Magnesium</TabsTrigger>
                <TabsTrigger value="potassium" className="text-xs py-1.5">Potassium</TabsTrigger>
                <TabsTrigger value="nahco3" className="text-xs py-1.5">NaHCO3</TabsTrigger>
                <TabsTrigger value="sodium" className="text-xs py-1.5">Sodium</TabsTrigger>
                <TabsTrigger value="phosphate" className="text-xs py-1.5">Phosphate</TabsTrigger>
              </TabsList>

              <TabsContent value="calcium" className="space-y-3 pt-3">
                <div className="space-y-2">
                  <Label>Current Calcium (optional)</Label>
                  <Input type="number" step="0.1" placeholder="mg/dL" value={calciumLevel} onChange={(e) => setCalciumLevel(e.target.value)} className="font-mono" />
                </div>
                <Button onClick={calculateCalcium} className="w-full">Calculate</Button>
              </TabsContent>

              <TabsContent value="magnesium" className="space-y-3 pt-3">
                <div className="space-y-2">
                  <Label>Current Mg Level (optional)</Label>
                  <Input type="number" step="0.1" placeholder="mg/dL" value={magnesiumLevel} onChange={(e) => setMagnesiumLevel(e.target.value)} className="font-mono" />
                </div>
                <Button onClick={calculateMagnesium} className="w-full">Calculate</Button>
              </TabsContent>

              <TabsContent value="potassium" className="space-y-3 pt-3">
                <div className="space-y-2">
                  <Label>Current K Level (optional)</Label>
                  <Input type="number" step="0.1" placeholder="mEq/L" value={potassiumLevel} onChange={(e) => setPotassiumLevel(e.target.value)} className="font-mono" />
                </div>
                <Button onClick={calculatePotassium} className="w-full">Calculate</Button>
              </TabsContent>

              <TabsContent value="nahco3" className="space-y-3 pt-3">
                <RadioGroup value={nahco3Method} onValueChange={setNahco3Method} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hco3" id="hco3" />
                    <Label htmlFor="hco3">HCO3</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="be" id="be" />
                    <Label htmlFor="be">Base Excess</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Both</Label>
                  </div>
                </RadioGroup>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>HCO3 (mEq/L)</Label>
                    <Input type="number" step="0.1" value={hco3Level} onChange={(e) => setHco3Level(e.target.value)} className="font-mono" disabled={nahco3Method === "be"} />
                  </div>
                  <div className="space-y-2">
                    <Label>Base Excess</Label>
                    <Input type="number" step="0.1" placeholder="e.g., -10" value={baseExcess} onChange={(e) => setBaseExcess(e.target.value)} className="font-mono" disabled={nahco3Method === "hco3"} />
                  </div>
                </div>
                <Button onClick={calculateNaHCO3} className="w-full">Calculate</Button>
              </TabsContent>

              <TabsContent value="sodium" className="space-y-3 pt-3">
                <RadioGroup value={sodiumType} onValueChange={setSodiumType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hyponatremia" id="hypo" />
                    <Label htmlFor="hypo">Hyponatremia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hypernatremia" id="hyper" />
                    <Label htmlFor="hyper">Hypernatremia</Label>
                  </div>
                </RadioGroup>
                {sodiumType === "hyponatremia" && (
                  <RadioGroup value={hyponatremiaType} onValueChange={setHyponatremiaType} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mild" id="mild" />
                      <Label htmlFor="mild">Mild (125-134)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severe" id="severe" />
                      <Label htmlFor="severe">Severe (&lt;125)</Label>
                    </div>
                  </RadioGroup>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Current Na (mEq/L)</Label>
                    <Input type="number" value={currentNa} onChange={(e) => setCurrentNa(e.target.value)} className="font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Na (mEq/L)</Label>
                    <Input type="number" placeholder="140" value={targetNa} onChange={(e) => setTargetNa(e.target.value)} className="font-mono" />
                  </div>
                </div>
                <Button onClick={calculateSodium} className="w-full">Calculate</Button>
              </TabsContent>

              <TabsContent value="phosphate" className="space-y-3 pt-3">
                <div className="space-y-2">
                  <Label>Phosphate Level (mg/dL)</Label>
                  <Input type="number" step="0.1" value={phosphateLevel} onChange={(e) => setPhosphateLevel(e.target.value)} className="font-mono" />
                </div>
                <RadioGroup value={phosphateSeverity} onValueChange={setPhosphateSeverity} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="phos-moderate" />
                    <Label htmlFor="phos-moderate">Moderate (P 1-2)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="phos-severe" />
                    <Label htmlFor="phos-severe">Severe (P &lt;1)</Label>
                  </div>
                </RadioGroup>
                <Button onClick={calculatePhosphate} className="w-full">Calculate</Button>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {renderResults()}
      </DialogContent>
    </Dialog>
  );
};

export default ElectrolytesDialog;
