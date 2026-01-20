/**
 * Electrolytes & Infusions Page
 * 
 * Combined calculator for:
 * - Electrolyte IV Infusions (Ca, K, Mg, NaHCO3, PO4)
 * - Electrolyte Corrections with dose ranges
 * - Drug Infusions (Inotropes, Sedatives, Diuretics, Bronchodilators)
 * 
 * Features weight input with calculations throughout
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator, AlertCircle, Pill, Droplets, Clock, Beaker, AlertTriangle, CheckCircle, Syringe, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ElectrolytesInfusionsPage = ({ onBack }) => {
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;
  const [results, setResults] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState(null);

  // Electrolyte Correction States
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
  const [kclLineType, setKclLineType] = useState("peripheral");
  const [kclConcentration, setKclConcentration] = useState("15");
  const [kclCustomConc, setKclCustomConc] = useState("4");
  
  // Addiphos specific state
  const [addiphosLineType, setAddiphosLineType] = useState("peripheral");

  // ============ ELECTROLYTE CORRECTIONS ============
  const calculateCalcium = () => {
    if (!w) return;
    
    const maxDose = 1000;
    const maxMl = 10;
    let doseMg = w * 100;
    let doseMl = doseMg / 100;
    let isMaxed = false;
    
    if (doseMg > maxDose) {
      doseMg = maxDose;
      doseMl = maxMl;
      isMaxed = true;
    }
    
    const targetConc = 50;
    const totalVolume = doseMg / targetConc;
    const diluentMl = totalVolume - doseMl;
    
    setResults({
      title: "Calcium Gluconate 10% IV",
      sections: [
        {
          subtitle: "Dose",
          value: `${doseMg.toFixed(0)} mg (${doseMl.toFixed(1)} ml)`
        },
        {
          subtitle: "Dilution",
          value: `${doseMl.toFixed(1)} ml + ${diluentMl.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
          detail: "Target: 50 mg/ml"
        }
      ],
      frequency: calciumLevel && parseFloat(calciumLevel) < 7 ? "BD" : "OD",
      doseRange: "50-100 mg/kg/dose",
      notes: [
        "Dose: 100 mg/kg (1 ml/kg)",
        `Max: ${maxDose} mg (${maxMl} ml)`,
        "Compatible: NS, D5W",
        "Infuse over 1 hour"
      ],
      ...(isMaxed && { warnings: ["Dose capped at maximum (1g / 10ml)"] })
    });
  };

  const calculateMagnesium = () => {
    if (!w) return;
    
    const maxDose = 2000;
    
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
    
    const targetConc = 60;
    const totalVolumeMin = minMg / targetConc;
    const totalVolumeMax = maxMg / targetConc;
    const diluentMin = totalVolumeMin - minMl;
    const diluentMax = totalVolumeMax - maxMl;
    
    setResults({
      title: "Magnesium Replacement",
      doseRange: "25-50 mg/kg/dose",
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
          subtitle: "Dilution",
          value: `${minMl.toFixed(2)}-${maxMl.toFixed(2)} ml + ${diluentMin.toFixed(1)}-${diluentMax.toFixed(1)} ml NS = ${totalVolumeMin.toFixed(1)}-${totalVolumeMax.toFixed(1)} ml`,
          detail: "Target: 60 mg/ml"
        },
        {
          subtitle: "Status Asthmaticus",
          value: `${minMg.toFixed(0)} - ${maxMg.toFixed(0)} mg`,
          detail: "25-50 mg/kg over 20-30 mins"
        }
      ],
      notes: [
        "Stock: 50% MgSulfate = 500 mg/ml",
        `Max single dose: ${maxDose} mg (${maxDose/500} ml)`,
        "Compatible: NS, D5W",
        "Infuse over 2-4 hours"
      ],
      ...(isMaxed && { warnings: ["Dose capped at maximum (2g per dose)"] })
    });
  };

  const calculatePotassium = () => {
    if (!w) return;
    
    const ivMaxDose = 40;
    const poMaxDose = 20;
    
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
    
    const kclStock = 2;
    const drugVolumeMin = bolusMin / kclStock;
    const drugVolumeMax = bolusMax / kclStock;
    
    const peripheralConc = 0.08;
    const peripheralTotalMin = bolusMin / peripheralConc;
    const peripheralTotalMax = bolusMax / peripheralConc;
    const peripheralDiluentMin = peripheralTotalMin - drugVolumeMin;
    const peripheralDiluentMax = peripheralTotalMax - drugVolumeMax;
    
    const centralConc = 0.15;
    const centralTotalMin = bolusMin / centralConc;
    const centralTotalMax = bolusMax / centralConc;
    const centralDiluentMin = centralTotalMin - drugVolumeMin;
    const centralDiluentMax = centralTotalMax - drugVolumeMax;
    
    const centralRestrictedConc = 0.2;
    const centralRestrictedTotalMin = bolusMin / centralRestrictedConc;
    const centralRestrictedTotalMax = bolusMax / centralRestrictedConc;
    const centralRestrictedDiluentMin = centralRestrictedTotalMin - drugVolumeMin;
    const centralRestrictedDiluentMax = centralRestrictedTotalMax - drugVolumeMax;
    
    setResults({
      title: "Potassium (Hypokalemia)",
      doseRange: "0.5-1 mEq/kg/dose",
      sections: [
        { 
          subtitle: "IV Bolus", 
          value: `${bolusMin.toFixed(1)} - ${bolusMax.toFixed(1)} mEq (${drugVolumeMin.toFixed(2)} - ${drugVolumeMax.toFixed(2)} ml)`, 
          detail: `0.5 mEq/kg over 1hr | 1 mEq/kg over 2hr${ivIsMaxed ? ' (MAX REACHED)' : ''}` 
        },
        {
          subtitle: "Peripheral (80 mEq/L)",
          value: `${drugVolumeMin.toFixed(2)}-${drugVolumeMax.toFixed(2)} ml + ${peripheralDiluentMin.toFixed(0)}-${peripheralDiluentMax.toFixed(0)} ml NS = ${peripheralTotalMin.toFixed(0)}-${peripheralTotalMax.toFixed(0)} ml`
        },
        {
          subtitle: "Central (15 mEq/100ml)",
          value: `${drugVolumeMin.toFixed(2)}-${drugVolumeMax.toFixed(2)} ml + ${centralDiluentMin.toFixed(0)}-${centralDiluentMax.toFixed(0)} ml NS = ${centralTotalMin.toFixed(0)}-${centralTotalMax.toFixed(0)} ml`
        },
        {
          subtitle: "Central - Fluid Restricted (20 mEq/100ml)",
          value: `${drugVolumeMin.toFixed(2)}-${drugVolumeMax.toFixed(2)} ml + ${centralRestrictedDiluentMin.toFixed(0)}-${centralRestrictedDiluentMax.toFixed(0)} ml NS = ${centralRestrictedTotalMin.toFixed(0)}-${centralRestrictedTotalMax.toFixed(0)} ml`
        },
        { 
          subtitle: "PO (KCl)", 
          value: `${poMin.toFixed(1)} - ${poMax.toFixed(1)} mEq`, 
          detail: `0.5-1 mEq/kg, can be given BD${poIsMaxed ? ' (MAX REACHED)' : ''}` 
        }
      ],
      notes: [
        `IV max: ${ivMaxDose} mEq/dose | PO max: ${poMaxDose} mEq/dose`,
        "Stock: 15% KCl = 2 mEq/ml",
        "Compatible: NS, D5W, LR",
        "Monitor ECG if giving >0.5 mEq/kg/hr"
      ],
      ...((ivIsMaxed || poIsMaxed) && { warnings: ["Dose capped at maximum per Harriet Lane"] })
    });
  };

  const calculateNaHCO3 = () => {
    const hco3 = parseFloat(hco3Level);
    const be = parseFloat(baseExcess);
    
    if (!w) return;
    
    const resultData = {
      title: "NaHCO3 Correction",
      doseRange: "1-2 mEq/kg (acute)",
      sections: [],
      notes: [
        "Normal HCO3 range: 18-22 mEq/L",
        "Correct when HCO3 < 12 or symptomatic",
        "Stock: 8.4% = 1 mEq/ml",
        "Compatible: NS, D5W"
      ],
      warnings: [
        "Give in 2 halves: 1st half in 1st hour, 2nd half over 24 hours",
        "In chronic acidosis with hypocalcemia: correct calcium FIRST"
      ]
    };
    
    if ((nahco3Method === "hco3" || nahco3Method === "both") && !isNaN(hco3)) {
      const desiredHCO3 = 20;
      const correction1 = (desiredHCO3 - hco3) * 0.3 * w;
      const drugVol1 = correction1;
      const diluentVol1 = correction1;
      const totalVol1 = drugVol1 + diluentVol1;
      resultData.sections.push({
        subtitle: "Method 1: Using HCO3",
        value: `${correction1.toFixed(1)} mEq`,
        detail: `1st half: ${(correction1/2).toFixed(1)} mEq | 2nd half: ${(correction1/2).toFixed(1)} mEq`
      });
      resultData.sections.push({
        subtitle: "Dilution (1:1)",
        value: `${drugVol1.toFixed(1)} ml + ${diluentVol1.toFixed(1)} ml NS = ${totalVol1.toFixed(1)} ml`
      });
    }
    
    if ((nahco3Method === "be" || nahco3Method === "both") && !isNaN(be)) {
      const correction2 = Math.abs(be) * 0.3 * w;
      const drugVol2 = correction2;
      const diluentVol2 = correction2;
      const totalVol2 = drugVol2 + diluentVol2;
      resultData.sections.push({
        subtitle: "Method 2: Using Base Excess",
        value: `${correction2.toFixed(1)} mEq`,
        detail: `1st half: ${(correction2/2).toFixed(1)} mEq | 2nd half: ${(correction2/2).toFixed(1)} mEq`
      });
      if (nahco3Method === "be") {
        resultData.sections.push({
          subtitle: "Dilution (1:1)",
          value: `${drugVol2.toFixed(1)} ml + ${diluentVol2.toFixed(1)} ml NS = ${totalVol2.toFixed(1)} ml`
        });
      }
    }
    
    resultData.sections.push({
      subtitle: "Persistent Low HCO3 - Infusion",
      value: `${(w * 0.25).toFixed(2)} - ${(w * 2).toFixed(1)} mEq/hr`
    });
    
    setResults(resultData);
  };

  const calculateSodium = () => {
    const na = parseFloat(currentNa);
    const targetNaVal = parseFloat(targetNa) || 140;
    
    if (!w || !na) return;
    
    if (sodiumType === "hyponatremia") {
      if (hyponatremiaType === "severe") {
        setResults({
          title: "Hyponatremia Correction (Severe)",
          subtitle: "Na < 125 with seizure or encephalopathy",
          doseRange: "3-5 ml/kg bolus (3% NaCl)",
          sections: [
            { 
              subtitle: "3% NaCl Bolus", 
              value: `${(w * 3).toFixed(0)} - ${(w * 5).toFixed(0)} ml`,
              detail: "Over 15-30 mins"
            },
            { 
              subtitle: "3% NaCl Infusion", 
              value: `${(w * 1).toFixed(0)} - ${(w * 2).toFixed(0)} ml/hr`,
              detail: "1-2 ml/kg/hr continuous"
            },
            { 
              subtitle: "Goal", 
              value: `Increase Na by 6-8 mEq/L`,
              detail: "Check Na every 20 mins until symptoms resolve"
            }
          ],
          notes: [
            "Reference: Maintenance = 1-3 mEq/kg (1 mEq = 2 ml of 3% NaCl)",
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
          doseRange: "Na deficit formula",
          sections: [
            { subtitle: "Na Deficit", value: `${naDeficit.toFixed(1)} mEq` },
            { subtitle: "Na Maintenance", value: `${maintenance.toFixed(1)} - ${(w*5).toFixed(1)} mEq/day` },
            { subtitle: "Fluid Options", value: `NS: 154 | 1/2NS: 77 | 3%NaCl: 513 mEq/L` }
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
        doseRange: "Free water deficit formula",
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
    if (!w) return;
    
    const maxDose = 15;
    
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
    
    const drugVolumeMin = minDose / 2;
    const drugVolumeMax = maxDoseCalc / 2;
    const totalVolPeripheralMin = minDose / 0.05;
    const totalVolPeripheralMax = maxDoseCalc / 0.05;
    const totalVolCentralMin = minDose / 0.12;
    const totalVolCentralMax = maxDoseCalc / 0.12;
    const diluentPeripheralMin = totalVolPeripheralMin - drugVolumeMin;
    const diluentPeripheralMax = totalVolPeripheralMax - drugVolumeMax;
    const diluentCentralMin = totalVolCentralMin - drugVolumeMin;
    const diluentCentralMax = totalVolCentralMax - drugVolumeMax;
    
    setResults({
      title: "Phosphate Replacement (IV)",
      doseRange: phosphateSeverity === "severe" ? "0.25-0.5 mmol/kg" : "0.08-0.16 mmol/kg",
      sections: [
        { subtitle: "Severity", value: range.label },
        { subtitle: "Dose", value: `${minDose.toFixed(2)} - ${maxDoseCalc.toFixed(2)} mmol (${drugVolumeMin.toFixed(2)} - ${drugVolumeMax.toFixed(2)} ml Addiphos)` },
        { 
          subtitle: "Dilution - Peripheral (0.05 mmol/ml)", 
          value: `${drugVolumeMin.toFixed(2)}-${drugVolumeMax.toFixed(2)} ml + ${diluentPeripheralMin.toFixed(0)}-${diluentPeripheralMax.toFixed(0)} ml NS = ${totalVolPeripheralMin.toFixed(0)}-${totalVolPeripheralMax.toFixed(0)} ml`
        },
        { 
          subtitle: "Dilution - Central (0.12 mmol/ml)", 
          value: `${drugVolumeMin.toFixed(2)}-${drugVolumeMax.toFixed(2)} ml + ${diluentCentralMin.toFixed(0)}-${diluentCentralMax.toFixed(0)} ml NS = ${totalVolCentralMin.toFixed(0)}-${totalVolCentralMax.toFixed(0)} ml`
        },
        { subtitle: "Infusion", value: "Over 4-6 hours (slow)" }
      ],
      notes: [
        "Stock: Addiphos 1 ml = 2 mmol",
        `Max single dose: ${maxDose} mmol`,
        "Compatible: NS, D5W"
      ],
      warning: "Rapid infusion can cause severe hypocalcemia!",
      ...(isMaxed && { warnings: ["Dose capped at maximum (15 mmol)"] })
    });
  };

  // ============ ELECTROLYTE IV INFUSIONS ============
  const calculateDrugInfusion = (drug) => {
    if (!w) {
      setResults({ 
        title: "Enter Weight First", 
        sections: [{ subtitle: "Required", value: "Please enter patient weight above to calculate doses" }]
      });
      return;
    }
    
    setSelectedDrug(drug);
    
    const drugs = {
      calciumGluconate: (() => {
        const maxDoseMg = 1000;
        let doseMg = w * 100;
        let isMaxed = false;
        
        if (doseMg > maxDoseMg) {
          doseMg = maxDoseMg;
          isMaxed = true;
        }
        
        const doseMl = doseMg / 100;
        const targetConc = 50;
        const totalVolume = doseMg / targetConc;
        const diluentMl = totalVolume - doseMl;
        const ratePerHour = totalVolume;
        
        return {
          title: "Calcium Gluconate 10%",
          drugInfo: {
            concentration: "100 mg/ml (0.45 mEq/ml)",
            targetDilution: "50 mg/ml",
            maxDose: `${maxDoseMg} mg (${maxDoseMg/100} ml)`,
            doseRange: "50-100 mg/kg/dose"
          },
          calculation: {
            dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg x 100 mg/kg = ${(w * 100).toFixed(0)} mg${isMaxed ? ' -> capped at ' + maxDoseMg + ' mg' : ''}`,
            drugVolume: `${doseMl.toFixed(1)} ml`,
            diluent: `${diluentMl.toFixed(1)} ml (NS or D5W)`,
            totalVolume: `${totalVolume.toFixed(1)} ml (at 50 mg/ml)`,
            duration: "1 hour",
            rate: `${ratePerHour.toFixed(1)} ml/hr`
          },
          preparation: `Draw ${doseMl.toFixed(1)} ml Ca Gluconate + ${diluentMl.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
          compatible: "NS, D5W, D10W",
          incompatible: "Amphotericin B, Ceftriaxone, Fluconazole, Meropenem, Methylprednisolone, Phosphate, Magnesium",
          ...(isMaxed && { maxWarning: "Dose capped at maximum (1g / 10ml)" })
        };
      })(),
      
      kcl: (() => {
        const maxDoseMEq = 40;
        let doseMin = w * 0.5;
        let doseMax = w * 1;
        let isMaxed = false;
        
        if (doseMax > maxDoseMEq) {
          doseMax = maxDoseMEq;
          doseMin = Math.min(doseMin, maxDoseMEq);
          isMaxed = true;
        }
        
        const mEqPerMl = kclConcentration === "15" ? 2 : 1.34;
        const drugVolumeMin = doseMin / mEqPerMl;
        const drugVolumeMax = doseMax / mEqPerMl;
        
        let targetConc, targetConcLabel, lineRecommendation;
        if (kclLineType === "peripheral") {
          targetConc = 0.08;
          targetConcLabel = "80 mEq/L (Peripheral)";
          lineRecommendation = "Peripheral line safe";
        } else if (kclLineType === "central") {
          targetConc = 0.15;
          targetConcLabel = "15 mEq/100ml (Central)";
          lineRecommendation = "Central line required";
        } else if (kclLineType === "central_restricted") {
          targetConc = 0.2;
          targetConcLabel = "20 mEq/100ml (Central - Fluid restricted)";
          lineRecommendation = "Central line required";
        } else {
          const customConc = parseFloat(kclCustomConc) || 4;
          targetConc = customConc / 100;
          targetConcLabel = `${customConc} mEq/100ml (Custom)`;
          lineRecommendation = customConc <= 8 ? "Peripheral line safe" : "Central line required";
        }
        
        const minTotalVolumeMin = doseMin / targetConc;
        const minTotalVolumeMax = doseMax / targetConc;
        const diluentMin = minTotalVolumeMin - drugVolumeMin;
        const diluentMax = minTotalVolumeMax - drugVolumeMax;
        
        const rate1hr = minTotalVolumeMin;
        const rate2hr = minTotalVolumeMax / 2;
        
        return {
          title: "Potassium Chloride (KCl)",
          drugInfo: {
            concentration: kclConcentration === "15" ? "15% KCl = 2 mEq/ml" : "10% KCl = 1.34 mEq/ml",
            targetDilution: targetConcLabel,
            maxDose: `${maxDoseMEq} mEq/dose`,
            lineRecommendation: lineRecommendation,
            doseRange: "0.5-1 mEq/kg/dose"
          },
          calculation: {
            dose: `${doseMin.toFixed(2)} - ${doseMax.toFixed(2)} mEq${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `0.5 mEq/kg over 1hr | 1 mEq/kg over 2hr`,
            drugVolume: `${drugVolumeMin.toFixed(2)} - ${drugVolumeMax.toFixed(2)} ml`,
            diluent: `${diluentMin.toFixed(0)} - ${diluentMax.toFixed(0)} ml NS`,
            totalVolume: `${minTotalVolumeMin.toFixed(0)} - ${minTotalVolumeMax.toFixed(0)} ml`,
            duration: "1-2 hours",
            rate: `${rate1hr.toFixed(1)} ml/hr (1h) | ${rate2hr.toFixed(1)} ml/hr (2h)`
          },
          preparation: `${drugVolumeMax.toFixed(2)} ml KCl ${kclConcentration}% + ${diluentMax.toFixed(0)} ml NS = ${minTotalVolumeMax.toFixed(0)} ml`,
          compatible: "NS, D5W, LR",
          incompatible: "Amphotericin B, Diazepam, Phenytoin",
          ...(isMaxed && { maxWarning: "Dose capped at maximum (40 mEq)" })
        };
      })(),
      
      mgso4: (() => {
        const maxDoseMg = 2000;
        let doseMin = w * 25;
        let doseMax = w * 50;
        let isMaxed = false;
        
        if (doseMax > maxDoseMg) {
          doseMax = maxDoseMg;
          doseMin = Math.min(doseMin, maxDoseMg);
          isMaxed = true;
        }
        
        const drugVolumeMin = doseMin / 500;
        const drugVolumeMax = doseMax / 500;
        const targetConc = 60;
        const totalVolumeMin = doseMin / targetConc;
        const totalVolumeMax = doseMax / targetConc;
        const diluentMin = totalVolumeMin - drugVolumeMin;
        const diluentMax = totalVolumeMax - drugVolumeMax;
        const rate4hr = totalVolumeMin / 4;
        const rate2hr = totalVolumeMax / 2;
        
        return {
          title: "Magnesium Sulfate 50%",
          drugInfo: {
            concentration: "500 mg/ml (2 mmol/ml, 4 mEq/ml)",
            targetDilution: "60 mg/ml",
            maxDose: `${maxDoseMg} mg (${maxDoseMg/500} ml)`,
            doseRange: "25-50 mg/kg/dose"
          },
          calculation: {
            dose: `${doseMin.toFixed(0)} - ${doseMax.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg x 25-50 mg/kg${isMaxed ? ' -> capped at ' + maxDoseMg + ' mg' : ''}`,
            drugVolume: `${drugVolumeMin.toFixed(2)} - ${drugVolumeMax.toFixed(2)} ml`,
            diluent: `${diluentMin.toFixed(1)} - ${diluentMax.toFixed(1)} ml`,
            totalVolume: `${totalVolumeMin.toFixed(1)} - ${totalVolumeMax.toFixed(1)} ml`,
            duration: "2-4 hours",
            rate: `${rate4hr.toFixed(1)} - ${rate2hr.toFixed(1)} ml/hr`
          },
          preparation: `Draw ${drugVolumeMax.toFixed(2)} ml MgSO4 50% + ${diluentMax.toFixed(1)} ml diluent = ${totalVolumeMax.toFixed(1)} ml`,
          compatible: "D5W, NS, LR",
          incompatible: "Amiodarone, Amphotericin B, Calcium chloride, Cefepime, Sodium bicarbonate",
          ...(isMaxed && { maxWarning: "Dose capped at maximum (2g)" })
        };
      })(),
      
      sodaBicarb: (() => {
        const maxDoseMEq = 50;
        let doseMin = w * 1;
        let doseMax = w * 2;
        let isMaxed = false;
        
        if (doseMax > maxDoseMEq) {
          doseMax = maxDoseMEq;
          doseMin = Math.min(doseMin, maxDoseMEq);
          isMaxed = true;
        }
        
        const drugVolumeMin = doseMin;
        const drugVolumeMax = doseMax;
        const diluentMin = doseMin;
        const diluentMax = doseMax;
        const totalVolumeMin = drugVolumeMin + diluentMin;
        const totalVolumeMax = drugVolumeMax + diluentMax;
        const rate1hr = totalVolumeMax;
        const rate30min = totalVolumeMax * 2;
        
        return {
          title: "Sodium Bicarbonate 8.4%",
          drugInfo: {
            concentration: "1 mEq/ml (8.4%)",
            targetDilution: "1:1 dilution (1 mEq in 2 ml final volume)",
            maxDose: `${maxDoseMEq} mEq/dose (neonates), 100 mEq (older children)`,
            doseRange: "1-2 mEq/kg/dose"
          },
          calculation: {
            dose: `${doseMin.toFixed(1)} - ${doseMax.toFixed(1)} mEq${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg x 1-2 mEq/kg${isMaxed ? ' -> capped at ' + maxDoseMEq + ' mEq' : ''}`,
            drugVolume: `${drugVolumeMin.toFixed(1)} - ${drugVolumeMax.toFixed(1)} ml`,
            diluent: `${diluentMin.toFixed(1)} - ${diluentMax.toFixed(1)} ml (1:1 dilution)`,
            totalVolume: `${totalVolumeMin.toFixed(1)} - ${totalVolumeMax.toFixed(1)} ml`,
            duration: "30 min - 1 hour",
            rate: `${rate1hr.toFixed(1)} ml/hr (1h) or ${rate30min.toFixed(1)} ml/hr (30min)`
          },
          preparation: `Draw ${drugVolumeMax.toFixed(1)} ml NaHCO3 + ${diluentMax.toFixed(1)} ml NS = ${totalVolumeMax.toFixed(1)} ml`,
          compatible: "NS, D5W, D10W",
          incompatible: "Amiodarone, Calcium salts, Dobutamine, Dopamine, Epinephrine, Norepinephrine, Magnesium sulfate, Midazolam, Phenytoin",
          ...(isMaxed && { maxWarning: "Dose capped at maximum (50 mEq)" })
        };
      })(),
      
      calciumChloride: (() => {
        const maxDoseMg = 1000;
        let doseMg = w * 10;
        let isMaxed = false;
        
        if (doseMg > maxDoseMg) {
          doseMg = maxDoseMg;
          isMaxed = true;
        }
        
        const doseMl = doseMg / 100;
        const targetConc = 15;
        const totalVolume = doseMg / targetConc;
        const diluentMl = totalVolume - doseMl;
        const ratePerHour = totalVolume;
        
        return {
          title: "Calcium Chloride 10%",
          drugInfo: {
            concentration: "100 mg/ml (1.4 mEq/ml)",
            targetDilution: "15-20 mg/ml (peripheral) or undiluted (central)",
            maxDose: `${maxDoseMg} mg (${maxDoseMg/100} ml)`,
            doseRange: "10-20 mg/kg/dose"
          },
          calculation: {
            dose: `${doseMg.toFixed(0)} mg${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg x 10 mg/kg${isMaxed ? ' -> capped at ' + maxDoseMg + ' mg' : ''}`,
            drugVolume: `${doseMl.toFixed(2)} ml`,
            diluent: `${diluentMl.toFixed(1)} ml (for peripheral at 15 mg/ml)`,
            totalVolume: `${totalVolume.toFixed(1)} ml`,
            duration: "1 hour (10 min minimum)",
            rate: `${ratePerHour.toFixed(1)} ml/hr`
          },
          preparation: `Draw ${doseMl.toFixed(2)} ml CaCl2 + ${diluentMl.toFixed(1)} ml NS = ${totalVolume.toFixed(1)} ml`,
          compatible: "NS, D5W",
          incompatible: "Phosphates, Sodium Bicarbonate, Sulphates, Amphotericin B, Ceftriaxone",
          warnings: ["CENTRAL LINE PREFERRED - Highly vesicant!", "If peripheral: use large vein, dilute well, infuse slowly"],
          ...(isMaxed && { maxWarning: "Dose capped at maximum (1g)" })
        };
      })(),
      
      addiphos: (() => {
        const maxDose = 15;
        let doseMin = w * 0.5;
        let doseMax = w * 1.5;
        let isMaxed = false;
        
        if (doseMax > maxDose) {
          doseMax = maxDose;
          doseMin = Math.min(doseMin, maxDose);
          isMaxed = true;
        }
        
        const volumeMin = doseMin / 2;
        const volumeMax = doseMax / 2;
        
        const targetConc = addiphosLineType === "peripheral" ? 0.05 : 0.12;
        const targetConcLabel = addiphosLineType === "peripheral" ? "0.05 mmol/ml (peripheral)" : "0.12 mmol/ml (central)";
        
        const totalVolumeMin = doseMin / targetConc;
        const totalVolumeMax = doseMax / targetConc;
        const diluentMin = totalVolumeMin - volumeMin;
        const diluentMax = totalVolumeMax - volumeMax;
        
        return {
          title: "Addiphos (Phosphate)",
          drugInfo: {
            concentration: "1 ml = 2 mmol phosphate",
            targetDilution: targetConcLabel,
            maxDose: `${maxDose} mmol/dose`,
            doseRange: "0.5-1.5 mmol/kg/day"
          },
          calculation: {
            dose: `${doseMin.toFixed(1)} - ${doseMax.toFixed(1)} mmol/day${isMaxed ? ' (MAX)' : ''}`,
            doseFormula: `${w} kg x 0.5-1.5 mmol/kg/day${isMaxed ? ' -> capped at ' + maxDose + ' mmol' : ''}`,
            drugVolume: `${volumeMin.toFixed(2)} - ${volumeMax.toFixed(2)} ml`,
            diluent: `${diluentMin.toFixed(0)} - ${diluentMax.toFixed(0)} ml (to achieve ${targetConcLabel})`,
            totalVolume: `${totalVolumeMin.toFixed(0)} - ${totalVolumeMax.toFixed(0)} ml`,
            duration: "4-6 hours (slow infusion)",
            rate: "Divide into 2-4 doses per day"
          },
          preparation: `For max dose: ${volumeMax.toFixed(2)} ml Addiphos + ${diluentMax.toFixed(0)} ml NS = ${totalVolumeMax.toFixed(0)} ml`,
          compatible: "Most IV fluids",
          incompatible: "Calcium salts (precipitation risk)",
          ...(isMaxed && { maxWarning: "Dose capped at maximum (15 mmol)" })
        };
      })()
    };
    
    if (drugs[drug]) {
      setResults(drugs[drug]);
    }
  };

  // ============ DRUG INFUSIONS (from InfusionsPage) ============
  const infusionCategories = [
    {
      category: "Neuromuscular Blockade",
      color: "purple",
      drugs: [
        {
          name: "Cisatracurium (Nimbex)",
          stat: { dose: "0.1-0.2 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.2).toFixed(2)} mg` : null },
          infusion: { dose: "1-4 mcg/kg/min", calc: w ? `${(w * 1).toFixed(0)} - ${(w * 4).toFixed(0)} mcg/min` : null }
        }
      ]
    },
    {
      category: "Sedatives",
      color: "blue",
      drugs: [
        {
          name: "Midazolam",
          stat: { dose: "0.1 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} mg` : null },
          infusion: { dose: "0.1-0.5 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.5).toFixed(2)} mg/hr` : null }
        },
        {
          name: "Fentanyl",
          stat: { dose: "1 mcg/kg", calc: w ? `${(w * 1).toFixed(1)} mcg` : null },
          infusion: { dose: "1-5 mcg/kg/hr", calc: w ? `${(w * 1).toFixed(1)} - ${(w * 5).toFixed(1)} mcg/hr` : null }
        }
      ]
    },
    {
      category: "Diuretics",
      color: "teal",
      drugs: [
        {
          name: "Furosemide (Lasix)",
          stat: { dose: "0.5-1 mg/kg (Max 40mg)", calc: w ? `${Math.min(w * 0.5, 40).toFixed(1)} - ${Math.min(w * 1, 40).toFixed(1)} mg` : null },
          infusion: { dose: "0.1-1 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 1).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Bronchodilator",
      color: "amber",
      drugs: [
        {
          name: "Ventolin Infusion",
          stat: null,
          infusion: { dose: "0.3 mg/kg/hr", calc: w ? `${(w * 0.3).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Inotropic Support",
      color: "red",
      isInotrope: true,
      drugs: [
        { name: "Dopamine", unit: "mcg/kg/min", min: 2, max: 20, note: "Low (2-5): renal, Med (5-10): cardiac, High (10-20): vasopressor" },
        { name: "Dobutamine", unit: "mcg/kg/min", min: 2, max: 20, note: "Inotrope, minimal vasopressor effect" },
        { name: "Epinephrine", unit: "mcg/kg/min", min: 0.01, max: 0.5, note: "Low: beta-effect, High: alpha-effect" },
        { name: "Norepinephrine", unit: "mcg/kg/min", min: 0.01, max: 0.5, note: "Potent vasopressor, minimal beta-effect" },
      ]
    }
  ];

  // Render enhanced results with step-by-step preparation
  const renderInfusionResults = () => {
    if (!results || !results.calculation) return null;
    
    return (
      <Card className={`mt-4 border-2 ${results.maxWarning ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20' : 'border-primary/30 bg-gradient-to-br from-primary/5 to-transparent'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            {results.title}
          </CardTitle>
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
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Drug Information</p>
              <p className="text-sm"><strong>Stock:</strong> {results.drugInfo.concentration}</p>
              {results.drugInfo.targetDilution && (
                <p className="text-sm"><strong>Target:</strong> {results.drugInfo.targetDilution}</p>
              )}
              {results.drugInfo.doseRange && (
                <p className="text-sm"><strong>Dose Range:</strong> <span className="text-green-600 dark:text-green-400 font-medium">{results.drugInfo.doseRange}</span></p>
              )}
              {results.drugInfo.maxDose && (
                <p className="text-sm"><strong>Max Dose:</strong> <span className="text-red-600 dark:text-red-400 font-medium">{results.drugInfo.maxDose}</span></p>
              )}
              {results.drugInfo.lineRecommendation && (
                <p className="text-sm"><strong>Line:</strong> {results.drugInfo.lineRecommendation}</p>
              )}
            </div>
          )}
          
          {/* Step by Step Calculation */}
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Calculation</p>
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
          
          {/* Duration and Rate */}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Administration</p>
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
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">Preparation</p>
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
          
          {/* Warnings */}
          {results.warnings && results.warnings.length > 0 && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-300">
              {results.warnings.map((warn, i) => (
                <p key={i} className="text-sm font-bold text-red-700 dark:text-red-300 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {warn}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCorrectionResults = () => {
    if (!results) return null;
    if (results.calculation) return renderInfusionResults();
    
    return (
      <Card className="mt-4 border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            {results.title}
          </CardTitle>
          {results.subtitle && <CardDescription>{results.subtitle}</CardDescription>}
          {results.doseRange && (
            <div className="mt-2 p-2 rounded-lg bg-green-100 dark:bg-green-900/50 border border-green-300">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Dose Range: {results.doseRange}
              </p>
            </div>
          )}
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
    <div className="space-y-4 pt-4 pb-8">
      {/* Weight Input - Prominent at top */}
      <Card className="border-2 border-primary/50 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-base font-semibold">Patient Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter weight..."
                value={weight}
                onChange={(e) => { setWeight(e.target.value); setResults(null); }}
                className="font-mono text-lg h-12 mt-1"
                data-testid="electrolyte-infusion-weight"
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

      {/* Main Tabs */}
      <Tabs defaultValue="electrolyte-iv" className="w-full">
        <TabsList className="grid grid-cols-3 h-auto">
          <TabsTrigger value="electrolyte-iv" className="py-2 flex items-center gap-1 text-xs">
            <Beaker className="h-4 w-4" />
            <span className="hidden sm:inline">Electrolyte</span> IV
          </TabsTrigger>
          <TabsTrigger value="corrections" className="py-2 flex items-center gap-1 text-xs">
            <Calculator className="h-4 w-4" />
            Corrections
          </TabsTrigger>
          <TabsTrigger value="drug-infusions" className="py-2 flex items-center gap-1 text-xs">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Drug</span> Infusions
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Electrolyte IV Infusions */}
        <TabsContent value="electrolyte-iv" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Select Electrolyte</CardTitle>
              <CardDescription>Click to calculate dilution and rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={selectedDrug === 'calciumGluconate' ? 'default' : 'outline'} 
                  className="h-16 flex-col"
                  onClick={() => calculateDrugInfusion('calciumGluconate')}
                  data-testid="btn-calcium-gluconate"
                >
                  <span className="text-lg">Ca2+</span>
                  <span className="text-xs">Calcium Gluconate</span>
                </Button>
                <Button 
                  variant={selectedDrug === 'kcl' ? 'default' : 'outline'} 
                  className="h-16 flex-col"
                  onClick={() => calculateDrugInfusion('kcl')}
                  data-testid="btn-kcl"
                >
                  <span className="text-lg">K+</span>
                  <span className="text-xs">Potassium Chloride</span>
                </Button>
                <Button 
                  variant={selectedDrug === 'mgso4' ? 'default' : 'outline'} 
                  className="h-16 flex-col"
                  onClick={() => calculateDrugInfusion('mgso4')}
                  data-testid="btn-mgso4"
                >
                  <span className="text-lg">Mg2+</span>
                  <span className="text-xs">Magnesium Sulfate</span>
                </Button>
                <Button 
                  variant={selectedDrug === 'sodaBicarb' ? 'default' : 'outline'} 
                  className="h-16 flex-col"
                  onClick={() => calculateDrugInfusion('sodaBicarb')}
                  data-testid="btn-nahco3"
                >
                  <span className="text-lg">HCO3-</span>
                  <span className="text-xs">Sodium Bicarbonate</span>
                </Button>
                <Button 
                  variant={selectedDrug === 'calciumChloride' ? 'default' : 'outline'} 
                  className="h-16 flex-col"
                  onClick={() => calculateDrugInfusion('calciumChloride')}
                  data-testid="btn-cacl2"
                >
                  <span className="text-lg">CaCl2</span>
                  <span className="text-xs">Calcium Chloride</span>
                </Button>
                <Button 
                  variant={selectedDrug === 'addiphos' ? 'default' : 'outline'} 
                  className="h-16 flex-col"
                  onClick={() => calculateDrugInfusion('addiphos')}
                  data-testid="btn-addiphos"
                >
                  <span className="text-lg">PO4</span>
                  <span className="text-xs">Addiphos</span>
                </Button>
              </div>

              {/* KCl Options */}
              {selectedDrug === 'kcl' && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Line Type / Concentration</Label>
                      <Select value={kclLineType} onValueChange={(v) => { setKclLineType(v); calculateDrugInfusion('kcl'); }}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peripheral">Peripheral (80 mEq/L)</SelectItem>
                          <SelectItem value="central">Central (15 mEq/100ml)</SelectItem>
                          <SelectItem value="central_restricted">Central - Fluid Restricted (20 mEq/100ml)</SelectItem>
                          <SelectItem value="custom">Custom (1-6 mEq/100ml)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {kclLineType === "custom" && (
                      <div>
                        <Label className="text-xs">Custom Concentration (1-6 mEq/100ml)</Label>
                        <Select value={kclCustomConc} onValueChange={(v) => { setKclCustomConc(v); calculateDrugInfusion('kcl'); }}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6].map(n => (
                              <SelectItem key={n} value={String(n)}>{n} mEq/100ml</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
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

              {renderInfusionResults()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Corrections */}
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
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="p-2 rounded bg-green-100 dark:bg-green-900/30 text-sm">
                    <strong>Dose Range:</strong> 50-100 mg/kg/dose (Max 1g)
                  </div>
                  <div className="space-y-2">
                    <Label>Current Calcium (optional)</Label>
                    <Input type="number" step="0.1" min="0" placeholder="mg/dL" value={calciumLevel} onChange={(e) => setCalciumLevel(e.target.value)} className="font-mono" />
                  </div>
                  <Button onClick={calculateCalcium} className="w-full" data-testid="calc-calcium">Calculate</Button>
                </CardContent>
              </Card>
              {renderCorrectionResults()}
            </TabsContent>

            <TabsContent value="magnesium" className="space-y-3 pt-3">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="p-2 rounded bg-green-100 dark:bg-green-900/30 text-sm">
                    <strong>Dose Range:</strong> 25-50 mg/kg/dose (Max 2g)
                  </div>
                  <div className="space-y-2">
                    <Label>Current Mg Level (optional)</Label>
                    <Input type="number" step="0.1" min="0" placeholder="mg/dL" value={magnesiumLevel} onChange={(e) => setMagnesiumLevel(e.target.value)} className="font-mono" />
                  </div>
                  <Button onClick={calculateMagnesium} className="w-full" data-testid="calc-magnesium">Calculate</Button>
                </CardContent>
              </Card>
              {renderCorrectionResults()}
            </TabsContent>

            <TabsContent value="potassium" className="space-y-3 pt-3">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="p-2 rounded bg-green-100 dark:bg-green-900/30 text-sm">
                    <strong>Dose Range:</strong> 0.5-1 mEq/kg/dose (IV Max 40 mEq, PO Max 20 mEq)
                  </div>
                  <div className="space-y-2">
                    <Label>Current K Level (optional)</Label>
                    <Input type="number" step="0.1" min="0" placeholder="mEq/L" value={potassiumLevel} onChange={(e) => setPotassiumLevel(e.target.value)} className="font-mono" />
                  </div>
                  <Button onClick={calculatePotassium} className="w-full" data-testid="calc-potassium">Calculate</Button>
                </CardContent>
              </Card>
              {renderCorrectionResults()}
            </TabsContent>

            <TabsContent value="nahco3" className="space-y-3 pt-3">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="p-2 rounded bg-green-100 dark:bg-green-900/30 text-sm">
                    <strong>Dose Range:</strong> 1-2 mEq/kg (acute) | 0.25-2 mEq/hr (infusion)
                  </div>
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
                      <Input type="number" step="0.1" min="0" value={hco3Level} onChange={(e) => setHco3Level(e.target.value)} className="font-mono" disabled={nahco3Method === "be"} />
                    </div>
                    <div className="space-y-2">
                      <Label>Base Excess</Label>
                      <Input type="number" step="0.1" placeholder="e.g., -10" value={baseExcess} onChange={(e) => setBaseExcess(e.target.value)} className="font-mono" disabled={nahco3Method === "hco3"} />
                    </div>
                  </div>
                  <Button onClick={calculateNaHCO3} className="w-full" data-testid="calc-nahco3">Calculate</Button>
                </CardContent>
              </Card>
              {renderCorrectionResults()}
            </TabsContent>

            <TabsContent value="sodium" className="space-y-3 pt-3">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="p-2 rounded bg-green-100 dark:bg-green-900/30 text-sm">
                    <strong>Dose Range:</strong> 3-5 ml/kg bolus (3% NaCl for severe) | Max 10-12 mEq/L rise/day
                  </div>
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
                      <Input type="number" min="0" value={currentNa} onChange={(e) => setCurrentNa(e.target.value)} className="font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Na (mEq/L)</Label>
                      <Input type="number" min="0" placeholder="140" value={targetNa} onChange={(e) => setTargetNa(e.target.value)} className="font-mono" />
                    </div>
                  </div>
                  <Button onClick={calculateSodium} className="w-full" data-testid="calc-sodium">Calculate</Button>
                </CardContent>
              </Card>
              {renderCorrectionResults()}
            </TabsContent>

            <TabsContent value="phosphate" className="space-y-3 pt-3">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="p-2 rounded bg-green-100 dark:bg-green-900/30 text-sm">
                    <strong>Dose Range:</strong> Moderate 0.08-0.16 mmol/kg | Severe 0.25-0.5 mmol/kg (Max 15 mmol)
                  </div>
                  <div className="space-y-2">
                    <Label>Phosphate Level (mg/dL)</Label>
                    <Input type="number" step="0.1" min="0" value={phosphateLevel} onChange={(e) => setPhosphateLevel(e.target.value)} className="font-mono" />
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
                  <Button onClick={calculatePhosphate} className="w-full" data-testid="calc-phosphate">Calculate</Button>
                </CardContent>
              </Card>
              {renderCorrectionResults()}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* TAB 3: Drug Infusions */}
        <TabsContent value="drug-infusions" className="space-y-4">
          {infusionCategories.map((cat, idx) => (
            <Card key={idx} className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{cat.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cat.isInotrope ? (
                  cat.drugs.map((drug, dIdx) => (
                    <div key={dIdx} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-sm">{drug.name}</p>
                        <span className="text-xs text-muted-foreground">{drug.min}-{drug.max} {drug.unit}</span>
                      </div>
                      {w > 0 && (
                        <div className="mt-2 p-2 rounded-lg bg-white dark:bg-gray-900">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div>
                              <p className="text-muted-foreground">Low</p>
                              <p className="font-mono text-red-600">{drug.min} {drug.unit}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Med</p>
                              <p className="font-mono text-red-600">{((drug.min + drug.max) / 2).toFixed(1)} {drug.unit}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">High</p>
                              <p className="font-mono text-red-600">{drug.max} {drug.unit}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 text-center border-t pt-2">
                            For {w}kg: {(drug.min * w * 60 / 1000).toFixed(2)} - {(drug.max * w * 60 / 1000).toFixed(2)} mg/hr
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{drug.note}</p>
                    </div>
                  ))
                ) : (
                  cat.drugs.map((drug, dIdx) => (
                    <div key={dIdx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-semibold text-sm mb-2">{drug.name}</p>
                      <div className="space-y-1">
                        {drug.stat && (
                          <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                            <span className="text-muted-foreground">Stat: {drug.stat.dose}</span>
                            {drug.stat.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">-&gt; {drug.stat.calc}</span>}
                          </div>
                        )}
                        {drug.infusion && (
                          <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                            <span className="text-muted-foreground">Infusion: {drug.infusion.dose}</span>
                            {drug.infusion.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">-&gt; {drug.infusion.calc}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectrolytesInfusionsPage;
