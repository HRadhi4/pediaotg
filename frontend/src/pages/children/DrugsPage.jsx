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

import { useState, useEffect } from "react";
import { AlertTriangle, ChevronDown, Scale } from "lucide-react";
import { ArrowLeftIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  // Comprehensive pediatric drug formulary (Harriet Lane 23rd Ed) - ALPHABETICALLY SORTED
  const drugs = [
    {
      id: "nacetylcysteine",
      name: "Acetylcysteine (N-Acetylcysteine)",
      category: "Antidote",
      route: "PO/IV",
      doses: {
        loading: { label: "Loading", value: "140", unit: "mg/kg PO or 150 mg/kg IV over 1h" },
        maintenance: { label: "Maintenance PO", value: "70", unit: "mg/kg q4h x17 doses" }
      },
      max: "See protocol",
      indication: "Acetaminophen overdose, mucolytic",
      notes: "Start within 8h of ingestion for best efficacy. IV protocol: 150mg/kg over 1h, then 50mg/kg over 4h, then 100mg/kg over 16h.",
      renalAdjust: null
    },
    {
      id: "acyclovir",
      name: "Acyclovir",
      category: "Antiviral",
      route: "IV/PO",
      doses: {
        neoHSV: { label: "Neonate HSV", value: "20", unit: "mg/kg/dose q8h IV x14-21 days" },
        childHSV: { label: "Child HSV (IV)", value: "10-15", unit: "mg/kg/dose q8h IV" },
        childVZV: { label: "Child VZV (IV)", value: "10-15", unit: "mg/kg/dose q8h IV x7-10 days" },
        encephalitis: { label: "HSV Encephalitis", value: "20", unit: "mg/kg/dose q8h IV x14-21 days" },
        chickenpoxPO: { label: "Chickenpox (PO)", value: "20", unit: "mg/kg/dose q6h PO x5 days (max 800mg/dose)" },
        genitalHerpesPO: { label: "Genital Herpes (Adult)", value: "400", unit: "mg TID x7-10 days or 200mg 5x/day" }
      },
      max: "800 mg/dose PO; 20 mg/kg/dose IV",
      indication: "HSV (neonatal, genital, encephalitis), VZV (chickenpox, shingles), immunocompromised patients",
      notes: "Hydrate well to prevent crystalluria. Adjust for renal function.",
      renalAdjust: { gfr50: "100% dose q12h", gfr30: "50% dose q12h", gfr10: "50% dose q24h", hd: "50% dose q24h, give after HD" }
    },
    {
      id: "adenosine",
      name: "Adenosine",
      category: "Antiarrhythmic",
      route: "IV rapid push",
      doses: {
        neonate: { label: "Neonate", value: "0.05-0.1", unit: "mg/kg IV push (max 0.3 mg/kg)" },
        child: { label: "Child", value: "0.1", unit: "mg/kg IV push, then 0.2 mg/kg if needed" },
        adult: { label: "Adult >50kg", value: "6", unit: "mg IV, then 12 mg if needed" }
      },
      max: "12 mg/dose",
      indication: "SVT",
      notes: "Give rapid IV push over 1-2 sec followed by NS flush. May increase dose by 0.05-0.1 mg/kg q2min. May cause brief asystole.",
      renalAdjust: null
    },
    {
      id: "salbutamol",
      name: "Albuterol (Salbutamol)",
      category: "Bronchodilator",
      route: "Nebulizer/MDI",
      doses: {
        nebUnder1yr: { label: "Neb <1yr", value: "0.05-0.15", unit: "mg/kg/dose q4-6h PRN (max 20mg/day)" },
        neb1to5yr: { label: "Neb 1-5yr", value: "1.25-2.5", unit: "mg/dose q4-6h PRN" },
        neb5to12yr: { label: "Neb 5-12yr", value: "2.5", unit: "mg/dose q4-6h PRN" },
        nebOver12yr: { label: "Neb >12yr", value: "2.5-5", unit: "mg/dose q4-6h PRN (max 3.2mg/day MDI)" },
        mdi2to6yr: { label: "MDI 2-6yr", value: "2", unit: "puffs (90 mcg/puff) q4-6h PRN" },
        mdiOver6yr: { label: "MDI >6yr", value: "2", unit: "puffs (90 mcg/puff) q4-6h PRN" },
        acuteExacerb: { label: "Acute Exacerbation", value: "2.5-5", unit: "mg neb q20min x3, then q1-4h PRN" }
      },
      max: "2.5 mg/dose (5-12yr); 5 mg/dose (>12yr); continuous neb if severe",
      indication: "Asthma, bronchospasm, exercise-induced bronchospasm (give 15-30min before exercise)",
      notes: "May give continuous neb in severe asthma. Monitor HR, K+. Can cause paradoxical bronchospasm.",
      renalAdjust: null
    },
    {
      id: "amikacin",
      name: "Amikacin",
      category: "Antibiotic",
      route: "IV/IM",
      doses: {
        standard: { label: "Once Daily", value: "15-22.5", unit: "mg/kg/dose q24h" },
        traditional: { label: "Traditional", value: "5-7.5", unit: "mg/kg/dose q8h" }
      },
      max: "1.5 g/day",
      indication: "Serious gram-negative infections, mycobacterial",
      notes: "Monitor levels: trough <5, peak 25-35. Ototoxic and nephrotoxic.",
      renalAdjust: { gfr50: "q12-18h", gfr30: "q24h", gfr10: "q48-72h", hd: "Give after HD, redose per levels" }
    },
    {
      id: "amiodarone",
      name: "Amiodarone",
      category: "Antiarrhythmic",
      route: "IV/PO",
      doses: {
        arrestChild: { label: "VF/pVT Arrest (Child)", value: "5", unit: "mg/kg IV bolus (max 300mg), repeat q3-5min" },
        arrestAdult: { label: "VF/pVT Arrest (Adult)", value: "300", unit: "mg IV bolus, then 150mg x1" },
        loadingChild: { label: "Loading (Child)", value: "5", unit: "mg/kg over 20-60 min (max 300mg)" },
        loadingAdult: { label: "Loading (Adult)", value: "150", unit: "mg IV over 10 min" },
        perfusingVTchild: { label: "Perfusing VT (Child)", value: "5", unit: "mg/kg over 20-60 min (max 300mg)" }
      },
      max: "300 mg/dose, 15 mg/kg/day (2.2g/day adult)",
      indication: "VF, pVT, refractory SVT, perfusing VT",
      notes: "May repeat x2 in arrest up to max 15 mg/kg/day. Contains polysorbate 80. Loading then infusion for non-arrest.",
      renalAdjust: null
    },
    {
      id: "amlodipine",
      name: "Amlodipine",
      category: "Antihypertensive",
      route: "PO",
      doses: {
        standard: { label: "Standard", value: "0.05-0.1", unit: "mg/kg/day once daily" },
        max: { label: "Max", value: "0.4-0.6", unit: "mg/kg/day" }
      },
      max: "10 mg/day",
      indication: "Hypertension",
      notes: "Calcium channel blocker. Peripheral edema possible.",
      renalAdjust: null
    },
    {
      id: "amoxicillin",
      name: "Amoxicillin",
      category: "Antibiotic",
      route: "PO",
      doses: {
        standard: { label: "Standard", value: "25-50", unit: "mg/kg/day divided q8h" },
        highDose: { label: "High Dose (AOM/CAP)", value: "80-90", unit: "mg/kg/day divided q12h" }
      },
      max: "3 g/day",
      indication: "Otitis media, strep pharyngitis, CAP, UTI",
      notes: "High dose for resistant S. pneumoniae. Take with or without food.",
      renalAdjust: { gfr50: "No change", gfr30: "q8-12h", gfr10: "q24h", hd: "Give after HD" }
    },
    {
      id: "augmentin",
      name: "Amoxicillin-Clavulanate (Augmentin)",
      category: "Antibiotic",
      route: "PO/IV",
      doses: {
        highDose: { label: "High Dose (ES 600)", value: "90", unit: "mg/kg/day divided q12h", maxDose: 3000 },
        lowDose: { label: "Low Dose (457)", value: "45", unit: "mg/kg/day divided q12h", maxDose: 1750 },
        iv: { label: "IV", value: "30", unit: "mg/kg/dose q8h", maxDose: 2000 }
      },
      max: "3g/day PO high dose, 2g/dose IV",
      indication: "Sinusitis, bite wounds, resistant infections",
      notes: "ES 600 for high dose (90 mg/kg), 457 formulation for low dose (45 mg/kg). IV max 2g/dose Q8h (adult dose).",
      renalAdjust: { gfr50: "No change", gfr30: "q12h", gfr10: "q24h", hd: "Give after HD" }
    },
    {
      id: "amphotericinB",
      name: "Amphotericin B",
      category: "Antifungal",
      route: "IV",
      doses: {
        conventional: { label: "Conventional", value: "0.5-1", unit: "mg/kg/day over 2-6h" },
        lipid: { label: "Liposomal (AmBisome)", value: "3-5", unit: "mg/kg/day" }
      },
      max: "1.5 mg/kg/day conventional",
      indication: "Severe systemic fungal infections, mucormycosis",
      notes: "Premedicate with antipyretic/antihistamine. Monitor renal function, K+, Mg2+.",
      renalAdjust: { gfr50: "No change", gfr30: "Monitor closely", gfr10: "Consider lipid formulation", hd: "No supplement" }
    },
    {
      id: "ampicillin",
      name: "Ampicillin",
      category: "Antibiotic",
      route: "IV/IM/PO",
      doses: {
        neoUnder7d: { label: "Neonate <7 days", value: "100", unit: "mg/kg/day ÷ q12h IV/IM" },
        neo7to28d: { label: "Neonate ≥7 days", value: "150", unit: "mg/kg/day ÷ q8h IV/IM" },
        gbsMeningUnder7d: { label: "GBS Meningitis <7d", value: "150", unit: "mg/kg/day ÷ q8h IV" },
        gbsMeningOver7d: { label: "GBS Meningitis ≥7d", value: "300", unit: "mg/kg/day ÷ q6h IV" },
        childMildMod: { label: "Child Mild/Mod PO", value: "250-500", unit: "mg/dose q6-8h (max 12g/day)" },
        childSevere: { label: "Child Severe IV/IM", value: "150-200", unit: "mg/kg/day ÷ q4-6h (max 12g/day)" },
        capPneumo: { label: "CAP (S. pneumoniae MIC≤2)", value: "150-200", unit: "mg/kg/day ÷ q4-6h IV" },
        capPneumoResist: { label: "CAP (S. pneumoniae MIC≥4)", value: "300-400", unit: "mg/kg/day ÷ q4-6h IV" }
      },
      max: "12 g/day",
      indication: "Listeria, enterococcus, GBS, meningitis, tonsillitis/pharyngitis (S. pyogenes), community-acquired pneumonia, severe infections, SBE prophylaxis",
      notes: "GBS meningitis requires higher doses. Good CSF penetration.",
      renalAdjust: { gfr50: "q6h", gfr30: "q6-8h", gfr10: "q12h", hd: "Give after HD" }
    },
    {
      id: "atropine",
      name: "Atropine",
      category: "Anticholinergic",
      route: "IV/IM/IO/ETT/SC",
      doses: {
        bradycardiaChild: { label: "Bradycardia (Child)", value: "0.02", unit: "mg/kg IV/IO (min 0.1mg, max 0.5mg)" },
        bradycardiaAdult: { label: "Bradycardia (Adult)", value: "0.5", unit: "mg IV q3-5min (max 3mg)" },
        premedication: { label: "Pre-intubation", value: "0.02", unit: "mg/kg (min 0.1mg, max 0.5mg)" },
        organophosphate: { label: "Organophosphate", value: "0.02-0.05", unit: "mg/kg IV q5-10min until atropinized" },
        ett: { label: "ETT", value: "0.04-0.06", unit: "mg/kg (2-3x IV dose)" }
      },
      max: "0.5 mg (child single dose), 3 mg total (adult)",
      indication: "Symptomatic bradycardia, RSI premedication, organophosphate poisoning",
      notes: "Min dose 0.1 mg to prevent paradoxical bradycardia. Dilute ETT dose in 1-2 mL NS.",
      renalAdjust: null
    },
    {
      id: "azithromycin",
      name: "Azithromycin",
      category: "Antibiotic",
      route: "PO/IV",
      doses: {
        childZPack: { label: "Z-Pack (Child)", value: "10", unit: "mg/kg day 1 (max 500mg), then 5 mg/kg days 2-5 (max 250mg/day)" },
        childCAP: { label: "CAP (Child)", value: "10", unit: "mg/kg/day x3 days (max 500mg/day)" },
        pertussisChild: { label: "Pertussis (Child)", value: "10", unit: "mg/kg day 1 (max 500mg), then 5mg/kg days 2-5" },
        otitisMedia: { label: "Otitis Media", value: "30", unit: "mg/kg x1 day (max 1500mg) OR 10mg/kg day 1 then 5mg/kg days 2-5" },
        pharyngitis: { label: "Pharyngitis", value: "12", unit: "mg/kg/day x5 days (max 500mg)" },
        adultCAP: { label: "Adult CAP", value: "500", unit: "mg day 1, then 250 mg days 2-5" },
        macProphylaxis: { label: "MAC Prophylaxis", value: "5", unit: "mg/kg/day (max 250mg/day) 1x/week" },
        chlamydia: { label: "Chlamydia", value: "1", unit: "g PO x1 dose" }
      },
      max: "500 mg/day (standard); 1500 mg x1 dose (otitis media); 1 g x1 (chlamydia)",
      indication: "Atypical pneumonia, pertussis, MAC prophylaxis, sinusitis, pharyngitis, chlamydia, CAP, acute bacterial COPD exacerbation",
      notes: "Long half-life (~68hr). QT prolongation risk - avoid with other QT-prolonging drugs.",
      renalAdjust: null
    },
    {
      id: "budesonide",
      name: "Budesonide (Nebulized)",
      category: "Steroid",
      route: "Nebulizer",
      doses: {
        croup: { label: "Croup", value: "2", unit: "mg nebulized once" },
        maintenance: { label: "Asthma Maintenance", value: "0.25-0.5", unit: "mg q12h" }
      },
      max: "2 mg/dose",
      indication: "Croup, asthma maintenance",
      notes: "Inhaled steroid. Rinse mouth after use.",
      renalAdjust: null
    },
    {
      id: "calciumgluc",
      name: "Calcium Gluconate",
      category: "Electrolyte",
      route: "IV",
      doses: {
        hypocalcemia: { label: "Hypocalcemia", value: "50-100", unit: "mg/kg (0.5-1 ml/kg of 10%)", maxDose: 1000 },
        arrest: { label: "Cardiac Arrest", value: "60-100", unit: "mg/kg", maxDose: 1000 }
      },
      max: "1 g/dose (10 mL of 10%)",
      indication: "Hypocalcemia, hyperkalemia, calcium channel blocker OD",
      notes: "Give slowly over 10-30 min. Monitor for extravasation. Max 1g/dose per Harriet Lane.",
      renalAdjust: { gfr50: "No change", gfr30: "Use with caution", gfr10: "Monitor Ca2+ closely", hd: "No supplement" }
    },
    {
      id: "carbamazepine",
      name: "Carbamazepine",
      category: "Anticonvulsant",
      route: "PO",
      doses: {
        initial: { label: "Initial", value: "5-10", unit: "mg/kg/day divided q12h" },
        maintenance: { label: "Maintenance", value: "10-30", unit: "mg/kg/day divided q8-12h" }
      },
      max: "35 mg/kg/day or 1200 mg/day",
      indication: "Partial seizures, trigeminal neuralgia",
      notes: "Many drug interactions. HLA-B*1502 testing in Asians.",
      renalAdjust: { gfr50: "No change", gfr30: "75% of dose", gfr10: "50% of dose", hd: "Give after HD" }
    },
    {
      id: "cefepime",
      name: "Cefepime",
      category: "Antibiotic",
      route: "IV",
      doses: {
        standard: { label: "Standard", value: "50", unit: "mg/kg/dose q8-12h" },
        neutropenia: { label: "Febrile Neutropenia", value: "50", unit: "mg/kg/dose q8h" }
      },
      max: "2 g/dose",
      indication: "Febrile neutropenia, Pseudomonas, nosocomial",
      notes: "4th gen cephalosporin. Good gram-positive and gram-negative coverage.",
      renalAdjust: { gfr50: "q12h", gfr30: "q24h", gfr10: "q24h (50% dose)", hd: "Give after HD" }
    },
    {
      id: "cefixime",
      name: "Cefixime (Suprax)",
      category: "Antibiotic",
      route: "PO",
      doses: {
        standard: { label: "Standard", value: "8", unit: "mg/kg/day once daily or divided q12h" },
        uti: { label: "UTI", value: "8", unit: "mg/kg/day" }
      },
      max: "400 mg/day",
      indication: "UTI, otitis media, pharyngitis, gonorrhea",
      notes: "3rd gen oral cephalosporin. Take with or without food.",
      renalAdjust: { gfr50: "No change", gfr30: "75% dose", gfr10: "50% dose", hd: "No supplement" }
    },
    {
      id: "cefotaxime",
      name: "Cefotaxime (Claforan)",
      category: "Antibiotic",
      route: "IV/IM",
      doses: {
        neo0to7d: { label: "Neonate 0-7 days (<2kg)", value: "50", unit: "mg/kg/dose q12h IV" },
        neo0to7dMeningitis: { label: "Neonate 0-7d Meningitis (<2kg)", value: "50", unit: "mg/kg/dose q12h IV" },
        neo8to28d: { label: "Neonate 8-28 days", value: "50", unit: "mg/kg/dose q8-12h IV" },
        neo8to28dMeningitis: { label: "Neonate 8-28d Meningitis", value: "50", unit: "mg/kg/dose q6-8h IV" },
        childStandard: { label: "Child >28 days", value: "50-100", unit: "mg/kg/dose q6h IV (max 8-10g/day)" },
        childMeningitis: { label: "Child Meningitis", value: "75", unit: "mg/kg/dose q6h IV (max 12g/day)" },
        adultStandard: { label: "Adult Standard", value: "1-2", unit: "g IV q6-8h" },
        adultMeningitis: { label: "Adult Meningitis", value: "2", unit: "g IV q4h (max 12g/day)" }
      },
      max: "8-10 g/day standard; 12 g/day meningitis",
      indication: "Meningitis, sepsis, gram-negative infections (preferred in neonates over ceftriaxone)",
      notes: "Preferred over ceftriaxone in neonates (no bilirubin displacement). Good CSF penetration.",
      renalAdjust: { gfr50: "No change", gfr30: "50% dose q12-24h", gfr10: "50% dose q24h", hd: "50% dose q24h, give after HD" }
    },
    {
      id: "ceftazidime",
      name: "Ceftazidime",
      category: "Antibiotic",
      route: "IV/IM",
      doses: {
        standard: { label: "Standard", value: "50", unit: "mg/kg/dose q8h" },
        cf: { label: "Cystic Fibrosis", value: "50", unit: "mg/kg/dose q6h" }
      },
      max: "6 g/day",
      indication: "Pseudomonas, gram-negative meningitis",
      notes: "Anti-pseudomonal. Higher doses for CF patients.",
      renalAdjust: { gfr50: "q12h", gfr30: "q24h", gfr10: "q48h", hd: "Give after HD" }
    },
    {
      id: "ceftriaxone",
      name: "Ceftriaxone (Rocephin)",
      category: "Antibiotic",
      route: "IV/IM",
      doses: {
        neoUnder37wk: { label: "Neonate <37wk", value: "25-50", unit: "mg/kg/dose q12h IV/IM" },
        neoMeningitis: { label: "Neonate Meningitis", value: "25-50", unit: "mg/kg/dose q8h IV" },
        infantUnder1mo: { label: "Infant <1mo", value: "50", unit: "mg/kg/dose q12h IV/IM" },
        childStandard: { label: "Child 1mo-12yr", value: "50-75", unit: "mg/kg/day q12-24h (max 2g/dose)" },
        childMeningitis: { label: "Child Meningitis", value: "100", unit: "mg/kg/day ÷ q12h (max 4g/day)" },
        adultSevere: { label: "Adult Severe", value: "2-4", unit: "g/day q12-24h" },
        gonorrhea: { label: "Gonorrhea", value: "250", unit: "mg IM x1 dose" }
      },
      max: "2 g/dose; 4 g/day (meningitis/severe)",
      indication: "CAP, meningitis, complicated UTI/pyelonephritis, gonorrhea, Lyme disease, nosocomial pneumonia, complicated intra-abdominal infections, PID",
      notes: "Avoid in neonates <28 days with hyperbilirubinemia or calcium-containing IV products. Displaces bilirubin from albumin.",
      renalAdjust: null
    },
    {
      id: "cefuroxime",
      name: "Cefuroxime (Zinnat/Zinacef)",
      category: "Antibiotic",
      route: "IV/PO",
      doses: {
        iv: { label: "IV", value: "25-50", unit: "mg/kg/dose q8h" },
        po: { label: "PO", value: "10-15", unit: "mg/kg/dose q12h" }
      },
      max: "1.5 g IV, 500 mg PO",
      indication: "CAP, UTI, skin infections, surgical prophylaxis",
      notes: "2nd gen cephalosporin. Take PO with food.",
      renalAdjust: { gfr50: "No change", gfr30: "q12h", gfr10: "q24h", hd: "Give after HD" }
    },
    {
      id: "cephalexin",
      name: "Cephalexin",
      category: "Antibiotic",
      route: "PO",
      doses: {
        standard: { label: "Standard", value: "25-50", unit: "mg/kg/day divided q6-8h" },
        severe: { label: "Severe", value: "50-100", unit: "mg/kg/day divided q6h" }
      },
      max: "4 g/day",
      indication: "Skin infections, UTI, strep pharyngitis",
      notes: "1st gen cephalosporin. Good for outpatient SSTI.",
      renalAdjust: { gfr50: "No change", gfr30: "q8-12h", gfr10: "q12-24h", hd: "Give after HD" }
    },
    {
      id: "cetirizine",
      name: "Cetirizine (Zyrtec)",
      category: "Antihistamine",
      route: "PO",
      ageDosing: [
        { age: "6-12 months", dose: "2.5 mg once daily" },
        { age: "1-5 years", dose: "2.5-5 mg once daily" },
        { age: "≥6 years", dose: "5-10 mg once daily" }
      ],
      doses: {
        infant: { label: "6-12 months", value: "2.5", unit: "mg once daily" },
        child: { label: "1-5 years", value: "2.5-5", unit: "mg once daily" },
        older: { label: "≥6 years", value: "5-10", unit: "mg once daily" }
      },
      max: "10 mg/day",
      indication: "Allergic rhinitis, urticaria",
      notes: "2nd gen antihistamine. Less sedating.",
      renalAdjust: { gfr50: "No change", gfr30: "5 mg/day", gfr10: "5 mg q48h", hd: "5 mg q48h" }
    },
    {
      id: "charcoal",
      name: "Charcoal (Activated)",
      category: "Antidote",
      route: "PO/NG",
      doses: {
        standard: { label: "Standard", value: "1-2", unit: "g/kg" }
      },
      max: "50-100 g",
      indication: "Poisoning/ingestion within 1-2 hours",
      notes: "Not effective for metals, alcohols, hydrocarbons.",
      renalAdjust: null
    },
    {
      id: "ciprofloxacin",
      name: "Ciprofloxacin",
      category: "Antibiotic",
      route: "PO/IV",
      doses: {
        childPO: { label: "Child PO", value: "10-20", unit: "mg/kg/dose q12h (max 750mg/dose)" },
        childIV: { label: "Child IV", value: "10-15", unit: "mg/kg/dose q8-12h (max 400mg/dose)" },
        adultPO: { label: "Adult PO", value: "250-750", unit: "mg q12h" },
        adultIV: { label: "Adult IV", value: "200-400", unit: "mg q8-12h" },
        uti: { label: "Complicated UTI", value: "10-20", unit: "mg/kg/day ÷ q12h" },
        anthrax: { label: "Anthrax", value: "15", unit: "mg/kg q12h (max 500mg/dose)" }
      },
      max: "750 mg PO, 400 mg IV per dose",
      indication: "Pseudomonas, complicated UTI, pyelonephritis, anthrax, GI infections, osteomyelitis, CF exacerbation",
      notes: "Fluoroquinolone - avoid in children <18y unless benefits outweigh risks (joint toxicity). Avoid with antacids.",
      renalAdjust: { gfr50: "50-75% dose", gfr30: "50% dose q12h", gfr10: "50% dose q18-24h", hd: "250-500mg q24h after HD" }
    },
    {
      id: "clarithromycin",
      name: "Clarithromycin",
      category: "Antibiotic",
      route: "PO",
      doses: {
        standard: { label: "Standard", value: "7.5", unit: "mg/kg/dose q12h" }
      },
      max: "500 mg/dose",
      indication: "CAP, H. pylori, MAC prophylaxis",
      notes: "Macrolide. Less GI upset than erythromycin.",
      renalAdjust: { gfr50: "No change", gfr30: "50% dose", gfr10: "50% dose", hd: "50% dose after HD" }
    },
    {
      id: "clindamycin",
      name: "Clindamycin",
      category: "Antibiotic",
      route: "IV/IM/PO",
      doses: {
        neoUnder32wk: { label: "Neonate ≤32wk PMA", value: "5", unit: "mg/kg/dose IV/IM q8h" },
        neo33to40wk: { label: "Neonate 33-40wk PMA", value: "7", unit: "mg/kg/dose IV/IM q8h" },
        neoOver40wk: { label: "Neonate >40wk PMA", value: "7", unit: "mg/kg/dose IV/IM q8h" },
        childPO: { label: "Child PO", value: "10-20", unit: "mg/kg/day ÷ q6-8h (max 1.8g/day)" },
        childIV: { label: "Child IV/IM", value: "20-40", unit: "mg/kg/day ÷ q6-8h (max 2.7g/day)" },
        adultPO: { label: "Adult PO", value: "600-1800", unit: "mg/day ÷ q6-12h (max 2.4g/day)" },
        adultIM: { label: "Adult IM", value: "600", unit: "mg/dose q6-12h (max 600mg/dose)" }
      },
      max: "1.8 g/day PO, 2.7 g/day IV/IM (child); 2.4 g/day PO, 600 mg/dose IM (adult)",
      indication: "Skin/soft tissue infections, osteomyelitis, septic arthritis, anaerobic infections, MRSA, toxoplasmosis, PCP (with primaquine), bacterial vaginosis, acne (topical)",
      notes: "Good bone penetration. Risk of C. diff colitis. Topical/vaginal forms available.",
      renalAdjust: null
    },
    {
      id: "dexamethasone",
      name: "Dexamethasone",
      category: "Steroid",
      route: "IV/IM/PO",
      doses: {
        antiinflammatory: { label: "Anti-inflammatory", value: "0.08-0.3", unit: "mg/kg/24hr PO/IV/IM q6-12h" },
        croup: { label: "Croup", value: "0.6", unit: "mg/kg PO/IM single dose (max 10mg)" },
        meningitis: { label: "Meningitis", value: "0.15", unit: "mg/kg q6h x2 days" },
        airway: { label: "Airway Edema", value: "0.5-1", unit: "mg/kg q6h" },
        antiemeticInit: { label: "Antiemetic (Initial)", value: "10", unit: "mg/m² IV (max 20mg)" },
        antiemeticMaint: { label: "Antiemetic (Maint)", value: "5", unit: "mg/m² IV q6h" }
      },
      max: "20 mg/dose",
      indication: "Croup, meningitis, airway edema, asthma, chemotherapy-induced emesis",
      notes: "Give before/with first abx dose for meningitis. Adult anti-inflammatory: 0.75-9 mg/kg/24hr.",
      renalAdjust: null
    },
    {
      id: "dexmedetomidine",
      name: "Dexmedetomidine (Precedex)",
      category: "Sedative",
      route: "IV",
      doses: {
        loading: { label: "Loading (optional)", value: "0.5-1", unit: "mcg/kg over 10 min" },
        infusion: { label: "Infusion", value: "0.2-0.7", unit: "mcg/kg/hr" }
      },
      max: "1.4 mcg/kg/hr",
      indication: "ICU sedation, procedural sedation",
      notes: "Alpha-2 agonist. Less respiratory depression. Bradycardia possible.",
      renalAdjust: null
    },
    {
      id: "dextrose",
      name: "Dextrose",
      category: "Electrolyte",
      route: "IV",
      doses: {
        hypoglycemiaNeo: { label: "Hypoglycemia (Neonate)", value: "2", unit: "mL/kg of D10W IV" },
        hypoglycemiaChild: { label: "Hypoglycemia (Child)", value: "0.5-1", unit: "g/kg IV" },
        hypoglycemiaAdult: { label: "Hypoglycemia (Adult)", value: "50", unit: "mL of D50W IV" },
        hyperkalemia: { label: "Hyperkalemia", value: "0.5", unit: "g/kg with insulin" }
      },
      max: "25 g/dose",
      indication: "Hypoglycemia, hyperkalemia (with insulin)",
      notes: "D10 for peripheral/neonates, D25 for older children, D50 for adults via central line.",
      renalAdjust: null
    },
    {
      id: "diazepam",
      name: "Diazepam",
      category: "Sedative",
      route: "IV/PR/PO",
      doses: {
        seizureUnder1mo: { label: "Status (<1 mo)", value: "0.05", unit: "mg/kg IV" },
        seizure1moTo5yr: { label: "Status (1mo-5yr)", value: "0.1", unit: "mg/kg IV (max 5mg)" },
        seizureOver5yr: { label: "Status (>5yr)", value: "0.2", unit: "mg/kg IV (max 10mg)" },
        rectal: { label: "Rectal", value: "0.5", unit: "mg/kg PR (max 20mg)" }
      },
      max: "5 mg (<5yr), 10 mg (>5yr) IV; 20 mg PR",
      indication: "Status epilepticus, seizure rescue, muscle spasm, sedation",
      notes: "Long-acting benzo. Give IV slowly over 2-5 min. PR gel for home seizure rescue.",
      renalAdjust: null
    },
    {
      id: "diphenhydramine",
      name: "Diphenhydramine (Benadryl)",
      category: "Antihistamine",
      route: "PO/IV/IM",
      doses: {
        standard: { label: "Standard", value: "1-1.25", unit: "mg/kg/dose q4-6h" }
      },
      max: "5 mg/kg/day or 300 mg/day",
      indication: "Allergic reactions, anaphylaxis, pruritus, sleep",
      notes: "Sedating antihistamine. Causes drowsiness.",
      renalAdjust: { gfr50: "No change", gfr30: "q6-8h", gfr10: "q12-18h", hd: "No supplement" }
    },
    {
      id: "dobutamine",
      name: "Dobutamine",
      category: "Vasoactive",
      route: "IV Infusion",
      doses: {
        standard: { label: "Standard", value: "2-20", unit: "mcg/kg/min" }
      },
      max: "40 mcg/kg/min",
      indication: "Cardiogenic shock, low cardiac output",
      notes: "Inotrope with minimal vasoconstriction.",
      renalAdjust: null
    },
    {
      id: "dopamine",
      name: "Dopamine",
      category: "Vasoactive",
      route: "IV Infusion",
      doses: {
        low: { label: "Low (renal dose)", value: "2-5", unit: "mcg/kg/min - ↑ renal blood flow" },
        medium: { label: "Intermediate", value: "5-15", unit: "mcg/kg/min - ↑ HR, contractility, CO" },
        high: { label: "High (pressor)", value: ">15", unit: "mcg/kg/min - α-adrenergic, ↓ renal perfusion" }
      },
      max: "20-50 mcg/kg/min",
      indication: "Shock, hypotension, low cardiac output",
      notes: "Central line preferred. Titrate to effect. High doses decrease renal perfusion.",
      renalAdjust: null
    },
    {
      id: "doxycycline",
      name: "Doxycycline",
      category: "Antibiotic",
      route: "PO/IV",
      doses: {
        standard: { label: "Standard", value: "2-4", unit: "mg/kg/day divided q12h" }
      },
      max: "200 mg/day",
      indication: "Rickettsial infections, Lyme, MRSA, acne",
      notes: "Tetracycline - use in children ≥8 years. Take with food.",
      renalAdjust: null
    },
    {
      id: "enalapril",
      name: "Enalapril",
      category: "Antihypertensive",
      route: "PO",
      doses: {
        standard: { label: "Standard", value: "0.08-0.1", unit: "mg/kg/day once daily" },
        max: { label: "Max", value: "0.5", unit: "mg/kg/day divided q12-24h" }
      },
      max: "40 mg/day",
      indication: "Hypertension, heart failure",
      notes: "ACE inhibitor. Monitor K+ and creatinine.",
      renalAdjust: { gfr50: "No change", gfr30: "75% dose", gfr10: "50% dose", hd: "Give after HD" }
    },
    {
      id: "adrenaline",
      name: "Epinephrine (Adrenaline)",
      category: "Vasoactive",
      route: "IV/IO/IM/ETT/SC",
      doses: {
        arrestNeo: { label: "Arrest (Neonate)", value: "0.01-0.03", unit: "mg/kg IV/IO (1:10,000) q3-5min" },
        arrestChild: { label: "Arrest (Child)", value: "0.01", unit: "mg/kg IV/IO (1:10,000) q3-5min, max 1mg" },
        ett: { label: "ETT (All ages)", value: "0.1", unit: "mg/kg of 1:1000 (max 2.5mg)" },
        anaphylaxis: { label: "Anaphylaxis IM", value: "0.01", unit: "mg/kg of 1:1000 IM (max 0.5mg)" },
        bronchodilator: { label: "SC Bronchodilator", value: "0.01", unit: "mg/kg SC of 1:1000, repeat q15min x3-4" },
        infusion: { label: "Infusion", value: "0.01-1", unit: "mcg/kg/min" }
      },
      max: "1 mg/dose IV arrest, 0.5 mg IM, 2.5 mg ETT",
      indication: "Cardiac arrest, anaphylaxis, shock, asthma",
      notes: "ETT dose is 10x IV dose. IM preferred for anaphylaxis. Asystole: 1mg IV or 2-2.5mg ETT q3-5min.",
      renalAdjust: null
    },
    {
      id: "racemicepinephrine",
      name: "Epinephrine (Racemic)",
      category: "Bronchodilator",
      route: "Nebulizer",
      doses: {
        croup: { label: "Croup/Stridor", value: "0.5", unit: "mL of 2.25% in 3mL NS" }
      },
      max: "0.5 mL/dose",
      indication: "Croup, post-extubation stridor",
      notes: "Observe 2-4h for rebound. May repeat q20min x3.",
      renalAdjust: null
    },
    {
      id: "nebulizedepinephrine",
      name: "Epinephrine (Nebulized L-Epinephrine)",
      category: "Bronchodilator",
      route: "Nebulizer",
      doses: {
        standard: { label: "Nebulized", value: "0.5", unit: "mL/kg of 1:1000 diluted in 3mL NS" },
        maxDose: { label: "Max single dose", value: "2.5", unit: "mL of 1:1000" }
      },
      max: "2.5 mL/dose (2.5 mg)",
      indication: "Croup, bronchiolitis, post-extubation stridor, asthma",
      notes: "Dilute in NS for nebulization. Observe 2-4h for rebound. May repeat q15min x3-4 PRN.",
      renalAdjust: null
    },
    {
      id: "erythromycin",
      name: "Erythromycin",
      category: "Antibiotic",
      route: "PO/IV",
      doses: {
        po: { label: "PO", value: "30-50", unit: "mg/kg/day divided q6-8h" },
        iv: { label: "IV", value: "15-20", unit: "mg/kg/day divided q6h" }
      },
      max: "4 g/day PO, 4 g/day IV",
      indication: "Atypical pneumonia, pertussis, GI motility",
      notes: "Multiple drug interactions. GI upset common.",
      renalAdjust: null
    },
    {
      id: "fentanyl",
      name: "Fentanyl",
      category: "Opioid",
      route: "IV/IM/IN/Buccal",
      doses: {
        sedation: { label: "Sedation/Analgesia", value: "1", unit: "mcg/kg IV/IM q30-60min PRN" },
        infusion: { label: "Continuous Infusion", value: "1", unit: "mcg/kg/hr" },
        intranasal: { label: "Intranasal", value: "1.5-2", unit: "mcg/kg IN" },
        buccal: { label: "Buccal (<18yr)", value: "200", unit: "mcg" }
      },
      max: "See indication",
      indication: "Procedural sedation, severe pain, intubation",
      notes: "Rapid onset (1-2 min IV), short duration. Use caution in neonates. Patch: no renal adjustment needed.",
      renalAdjust: { gfr50: "No adjustment needed", gfr30: "No adjustment needed", gfr10: "Use with caution, titrate carefully", hd: "No supplement needed" }
    },
    {
      id: "ferroussulfate",
      name: "Ferrous Sulfate",
      category: "Supplement",
      route: "PO",
      doses: {
        treatment: { label: "Iron Deficiency", value: "3-6", unit: "mg elemental Fe/kg/day divided q8-12h" },
        prophylaxis: { label: "Prophylaxis", value: "1-2", unit: "mg elemental Fe/kg/day" }
      },
      max: "6 mg/kg/day elemental iron",
      indication: "Iron deficiency anemia",
      notes: "Give between meals with vitamin C. Stool discoloration.",
      renalAdjust: null
    },
    {
      id: "fluconazole",
      name: "Fluconazole",
      category: "Antifungal",
      route: "PO/IV",
      doses: {
        loading: { label: "Loading", value: "12", unit: "mg/kg day 1" },
        maintenance: { label: "Maintenance", value: "6-12", unit: "mg/kg/day once daily" }
      },
      max: "400 mg/day",
      indication: "Candidiasis (oral, esophageal, systemic), cryptococcal meningitis",
      notes: "Oral thrush: 6 mg/kg day 1, then 3 mg/kg/day x14 days. Fungistatic.",
      renalAdjust: { gfr50: "50% dose q24h", gfr30: "50% dose q24-48h", gfr10: "50% dose q48h", hd: "100% dose after each HD" }
    },
    {
      id: "flumazenil",
      name: "Flumazenil",
      category: "Antidote",
      route: "IV",
      doses: {
        reversal: { label: "Reversal", value: "0.01", unit: "mg/kg (max 0.2mg/dose)" }
      },
      max: "0.2 mg/dose, 1 mg total",
      indication: "Benzodiazepine overdose/reversal",
      notes: "May precipitate seizures. Avoid in chronic benzo use.",
      renalAdjust: null
    },
    {
      id: "furosemide",
      name: "Furosemide (Lasix)",
      category: "Diuretic",
      route: "IV/IM/PO",
      doses: {
        neonateIV: { label: "Neonate IV/IM", value: "0.5-1", unit: "mg/kg/dose (max 2mg/kg)" },
        childIV: { label: "Child IV/IM", value: "0.5-2", unit: "mg/kg/dose q6-12h (max 6mg/kg)" },
        adultIV: { label: "Adult IV/IM", value: "20-40", unit: "mg/dose" },
        neonatePO: { label: "Neonate PO", value: "1-3", unit: "mg/kg/dose (max 2mg/kg) once daily" },
        childPO: { label: "Child PO", value: "0.1", unit: "mg/kg/dose (max 6mg/kg) once daily" },
        adultPO: { label: "Adult PO", value: "40-100", unit: "mg/dose (max 600mg/24hr)" }
      },
      max: "6 mg/kg/dose IV/IM, 600 mg/24hr PO",
      indication: "Edema, heart failure, fluid overload, acute pulmonary edema",
      notes: "Monitor K+, Mg2+. PO bioavailability ~50% of IV.",
      renalAdjust: { gfr50: "No change", gfr30: "Higher doses may be needed", gfr10: "May need continuous infusion", hd: "Usually ineffective" }
    },
    {
      id: "gentamicin",
      name: "Gentamicin",
      category: "Antibiotic",
      route: "IV/IM",
      doses: {
        neo0to7d: { label: "Neonate 0-7 days", value: "4", unit: "mg/kg/dose q24h" },
        neo8to28d: { label: "Neonate 8-28 days", value: "4.5", unit: "mg/kg/dose q12h" },
        neoOver28d: { label: "Neonate >28 days", value: "5", unit: "mg/kg/dose q8h" },
        childConv: { label: "Child (Conventional)", value: "2.5", unit: "mg/kg/dose q8h" },
        childOnceDaily: { label: "Child (Once Daily)", value: "5-7.5", unit: "mg/kg/dose q24h" },
        cysticFibrosis: { label: "Cystic Fibrosis", value: "7.5-10.5", unit: "mg/kg/dose q8h" },
        adultConv: { label: "Adult (Conventional)", value: "1.5-2", unit: "mg/kg/dose q8h" }
      },
      max: "5 mg/kg/dose (conventional); 7.5 mg/kg/dose (once daily)",
      indication: "Gram-negative sepsis, synergy for endocarditis, serious infections, ophthalmic, intrathecal/intraventricular",
      notes: "Monitor levels: trough <2 mg/L, peak 20-30 mg/L. Ototoxic and nephrotoxic.",
      renalAdjust: { gfr50: "Standard initial dose, redose per levels", gfr30: "Standard initial dose, redose per levels", gfr10: "Standard initial dose, redose per levels q48-72h", hd: "2-3x weekly after HD, per levels" }
    },
    {
      id: "hydralazine",
      name: "Hydralazine",
      category: "Antihypertensive",
      route: "IV/PO",
      doses: {
        iv: { label: "IV", value: "0.1-0.2", unit: "mg/kg/dose q4-6h" },
        po: { label: "PO", value: "0.75-1", unit: "mg/kg/day divided q6-8h" }
      },
      max: "20 mg IV, 200 mg/day PO",
      indication: "Hypertensive emergency",
      notes: "Direct vasodilator. Reflex tachycardia common.",
      renalAdjust: { gfr50: "No change", gfr30: "q8h", gfr10: "q8-12h", hd: "Give after HD" }
    },
    {
      id: "hydrocortisone",
      name: "Hydrocortisone",
      category: "Steroid",
      route: "IV/PO",
      doses: {
        antiinflammChild: { label: "Anti-inflammatory (Child)", value: "4-8", unit: "mg/kg/dose IV/PO q6-8h" },
        antiinflammAdult: { label: "Anti-inflammatory (Adult)", value: "100-500", unit: "mg/dose q6-8h IV" },
        acuteAdrenal: { label: "Acute Adrenal Insufficiency", value: "100", unit: "mg/kg IV q6h" },
        stressDose: { label: "Stress Dose", value: "50-100", unit: "mg/m² or 1-2 mg/kg" }
      },
      max: "500 mg/dose",
      indication: "Adrenal insufficiency, shock, anti-inflammatory/immunosuppressive",
      notes: "Stress dosing for illness/surgery in adrenal insufficiency. Has mineralocorticoid activity.",
      renalAdjust: null
    },
    {
      id: "hydroxyzine",
      name: "Hydroxyzine",
      category: "Antihistamine",
      route: "PO/IM",
      doses: {
        antipruritic: { label: "Antipruritic", value: "0.5-1", unit: "mg/kg/dose q6h" },
        anxiolytic: { label: "Anxiolytic", value: "0.5", unit: "mg/kg/dose" }
      },
      max: "100 mg/dose",
      indication: "Pruritus, anxiety, preoperative sedation",
      notes: "Sedating. Good for atopic dermatitis itch.",
      renalAdjust: { gfr50: "No change", gfr30: "50% dose", gfr10: "50% dose", hd: "No supplement" }
    },
    {
      id: "ibuprofen",
      name: "Ibuprofen",
      category: "Analgesic/NSAID",
      route: "PO",
      doses: {
        childAnalgesic: { label: "Child Analgesic/Antipyretic", value: "10", unit: "mg/kg/dose q4-6h PRN (max 40mg/kg/day)" },
        infantUnder6mo: { label: "Infant <6mo", value: "10", unit: "mg/kg/dose q6h PRN (max 40mg/kg/day)" },
        child6to12yr: { label: "Child 6-12yr", value: "10", unit: "mg/kg/dose q4-6h" },
        adultAnalgesic: { label: "Adult Analgesic", value: "400", unit: "mg/dose q4-6h (max 3.2g/day)" },
        antiInflammatory: { label: "Anti-inflammatory", value: "30-40", unit: "mg/kg/day ÷ q6-8h" }
      },
      max: "40 mg/kg/day or 2.4-3.2 g/day (whichever is less)",
      indication: "Pain, fever, inflammation, dysmenorrhea, JIA",
      notes: "Avoid if dehydrated, renal impairment, GI bleed risk, aspirin-sensitive asthma. Give with food.",
      renalAdjust: { gfr50: "Use with caution", gfr30: "Avoid", gfr10: "Avoid", hd: "Avoid" }
    },
    {
      id: "insulin",
      name: "Insulin (Regular)",
      category: "Antidiabetic",
      route: "IV/SQ",
      doses: {
        dka: { label: "DKA Infusion", value: "0.05-0.1", unit: "units/kg/hr" },
        hyperkalemia: { label: "Hyperkalemia", value: "0.1", unit: "units/kg with dextrose" }
      },
      max: "10 units/dose for hyperkalemia",
      indication: "DKA, hyperglycemia, hyperkalemia",
      notes: "Monitor glucose hourly. Give with dextrose for hyperkalemia.",
      renalAdjust: { gfr50: "No change", gfr30: "May need dose reduction", gfr10: "25-50% reduction", hd: "Monitor closely" }
    },
    {
      id: "ipratropium",
      name: "Ipratropium",
      category: "Bronchodilator",
      route: "Nebulizer/MDI",
      doses: {
        neb: { label: "Nebulizer", value: "250-500", unit: "mcg q20min x3" },
        mdi: { label: "MDI", value: "4-8", unit: "puffs" }
      },
      max: "500 mcg/dose",
      indication: "Moderate-severe asthma (with salbutamol)",
      notes: "Use with salbutamol for first 3 doses in severe asthma.",
      renalAdjust: null
    },
    {
      id: "ketamine",
      name: "Ketamine",
      category: "Sedative",
      route: "IV/IM/IN",
      doses: {
        sedationIV: { label: "Sedation IV", value: "0.5-2", unit: "mg/kg (max 150mg)" },
        sedationIM: { label: "Sedation IM", value: "4-5", unit: "mg/kg (max 150mg)" },
        analgesiaIV: { label: "Analgesia IV", value: "0.1-0.5", unit: "mg/kg" },
        intranasal: { label: "Intranasal", value: "3-6", unit: "mg/kg (half dose per nostril)" }
      },
      max: "150 mg/dose",
      indication: "Procedural sedation, analgesia, RSI",
      notes: "Dissociative. Causes ↑ salivation - consider glycopyrrolate. Bronchodilator properties.",
      renalAdjust: null
    },
    {
      id: "labetalol",
      name: "Labetalol",
      category: "Antihypertensive",
      route: "IV/PO",
      doses: {
        iv: { label: "IV Bolus", value: "0.2-1", unit: "mg/kg/dose (max 40mg)" },
        infusion: { label: "IV Infusion", value: "0.25-3", unit: "mg/kg/hr" },
        po: { label: "PO", value: "1-3", unit: "mg/kg/dose q8-12h" }
      },
      max: "40 mg IV bolus, 300 mg PO",
      indication: "Hypertensive urgency/emergency",
      notes: "Alpha/beta blocker. Avoid in asthma, heart block.",
      renalAdjust: null
    },
    {
      id: "lactulose",
      name: "Lactulose",
      category: "Laxative",
      route: "PO/PR",
      doses: {
        constipation: { label: "Constipation", value: "1-3", unit: "mL/kg/day divided q12-24h" },
        encephalopathy: { label: "Hepatic Encephalopathy", value: "0.5-1", unit: "mL/kg q6-8h" }
      },
      max: "60 mL/dose",
      indication: "Constipation, hepatic encephalopathy",
      notes: "Goal 2-3 soft stools/day. Abdominal cramping common.",
      renalAdjust: null
    },
    {
      id: "lansoprazole",
      name: "Lansoprazole",
      category: "PPI",
      route: "PO",
      ageDosing: [
        { age: "<10 weeks", dose: "0.2-0.3 mg/kg/day" },
        { age: "<30kg", dose: "15 mg once daily" },
        { age: ">30kg", dose: "30 mg once daily" }
      ],
      doses: {
        infant: { label: "<10 weeks", value: "0.2-0.3", unit: "mg/kg/day" },
        child: { label: "<30kg", value: "15", unit: "mg once daily" },
        older: { label: ">30kg", value: "30", unit: "mg once daily" }
      },
      max: "30 mg/day",
      indication: "GERD, H. pylori",
      notes: "PPI. Give 30 min before meals. Do not crush capsule.",
      renalAdjust: null
    },
    {
      id: "levetiracetam",
      name: "Levetiracetam (Keppra)",
      category: "Anticonvulsant",
      route: "IV/PO",
      doses: {
        loading: { label: "Loading", value: "20-60", unit: "mg/kg" },
        maintenance: { label: "Maintenance", value: "20-30", unit: "mg/kg/day divided q12h" }
      },
      max: "3000 mg/day",
      indication: "Seizures, status epilepticus",
      notes: "No drug interactions. Can cause behavioral changes.",
      renalAdjust: { gfr50: "50-100% dose q12h", gfr30: "50% dose q12h", gfr10: "50% dose q24h", hd: "Give supplement after HD" }
    },
    {
      id: "lidocaine",
      name: "Lidocaine",
      category: "Antiarrhythmic",
      route: "IV",
      doses: {
        bolus: { label: "VF/pVT", value: "1", unit: "mg/kg bolus" },
        infusion: { label: "Infusion", value: "20-50", unit: "mcg/kg/min" }
      },
      max: "100 mg bolus",
      indication: "Ventricular arrhythmias, local anesthesia",
      notes: "Class IB antiarrhythmic. Monitor for CNS toxicity.",
      renalAdjust: null
    },
    {
      id: "linezolid",
      name: "Linezolid",
      category: "Antibiotic",
      route: "PO/IV",
      doses: {
        standard: { label: "Standard", value: "10", unit: "mg/kg/dose q8h" }
      },
      max: "600 mg/dose",
      indication: "VRE, MRSA, resistant gram-positive",
      notes: "Oxazolidinone. Monitor CBC for myelosuppression.",
      renalAdjust: null
    },
    {
      id: "loratadine",
      name: "Loratadine (Claritin)",
      category: "Antihistamine",
      route: "PO",
      ageDosing: [
        { age: "2-5 years", dose: "5 mg once daily" },
        { age: "≥6 years", dose: "10 mg once daily" }
      ],
      doses: {
        child: { label: "2-5 years", value: "5", unit: "mg once daily" },
        older: { label: "≥6 years", value: "10", unit: "mg once daily" }
      },
      max: "10 mg/day",
      indication: "Allergic rhinitis, urticaria",
      notes: "Non-sedating. Take without regard to food.",
      renalAdjust: { gfr50: "No change", gfr30: "q48h", gfr10: "q48h", hd: "No supplement" }
    },
    {
      id: "lorazepam",
      name: "Lorazepam",
      category: "Sedative",
      route: "IV/PO/IM",
      doses: {
        seizureNeo: { label: "Sedation (Neonate/Infant)", value: "0.05-0.1", unit: "mg/kg IV q4-8h (max 2mg)" },
        seizureChild: { label: "Status Epilepticus", value: "0.05-0.1", unit: "mg/kg IV slowly over 2-5min (max 4mg)" },
        sedation: { label: "Sedation", value: "0.02-0.05", unit: "mg/kg q4-8h" }
      },
      max: "2 mg (neonates), 4 mg (child/adult)",
      indication: "Status epilepticus, sedation, anxiety",
      notes: "Benzodiazepine. Give IV slowly over 2-5 min. May repeat in 10-15 min. Contains propylene glycol (IV).",
      renalAdjust: null
    },
    {
      id: "magnesium",
      name: "Magnesium Sulfate",
      category: "Electrolyte",
      route: "IV/IM",
      doses: {
        hypoMild: { label: "Mild Hypomagnesemia", value: "25-50", unit: "mg/kg q6h x3-4 doses (max 2g)" },
        hypoSevere: { label: "Severe Hypomagnesemia", value: "25-50", unit: "mg/kg IV over 2-4h (max 2g)" },
        asthma: { label: "Severe Asthma", value: "25-50", unit: "mg/kg IV over 20 min (max 2g)" },
        torsades: { label: "Torsades de Pointes", value: "25-50", unit: "mg/kg IV push (max 2g)" }
      },
      max: "2 g/dose",
      indication: "Hypomagnesemia, severe asthma, torsades, seizure prophylaxis",
      notes: "Monitor for hypotension, bradycardia, respiratory depression. Slow infusion except torsades.",
      renalAdjust: { gfr50: "75% dose", gfr30: "50% dose", gfr10: "25-50% dose", hd: "Avoid unless critical" }
    },
    {
      id: "mannitol",
      name: "Mannitol",
      category: "Osmotic Diuretic",
      route: "IV",
      doses: {
        cerebral: { label: "Cerebral Edema", value: "0.25-1", unit: "g/kg IV over 20-30 min" },
        icp: { label: "Acute ICP Crisis", value: "1", unit: "g/kg IV over 10-20 min" }
      },
      max: "1 g/kg/dose, may repeat q4-6h",
      indication: "Cerebral edema, raised ICP, acute glaucoma",
      notes: "Monitor serum osmolality (keep <320). Requires urinary catheter. Filter through 5-micron filter.",
      renalAdjust: { gfr50: "Use with caution", gfr30: "Avoid if possible", gfr10: "Contraindicated", hd: "Contraindicated" }
    },
    {
      id: "meropenem",
      name: "Meropenem",
      category: "Antibiotic",
      route: "IV",
      doses: {
        neoUnder32wk: { label: "Neonate ≤32wk PMA", value: "20", unit: "mg/kg/dose q12h IV" },
        neo32to40wk: { label: "Neonate 32-40wk PMA", value: "20", unit: "mg/kg/dose q8h IV" },
        childStandard: { label: "Child Standard", value: "20", unit: "mg/kg/dose q8h IV (max 1g/dose)" },
        meningitis: { label: "Meningitis", value: "40", unit: "mg/kg/dose q8h IV (max 2g/dose)" },
        adultStandard: { label: "Adult Standard", value: "1", unit: "g q8h IV" },
        adultSevere: { label: "Adult Severe/Meningitis", value: "2", unit: "g q8h IV" }
      },
      max: "2 g/dose; 6 g/day",
      indication: "Serious gram-negative infections, intra-abdominal, meningitis, febrile neutropenia, pseudomonas",
      notes: "Carbapenem. Extended infusion (3h) for severe infections. Lower seizure risk than imipenem.",
      renalAdjust: { gfr50: "100% dose q8-12h", gfr30: "50% dose q12h", gfr10: "50% dose q24h", hd: "Dose after HD; supplement 500mg" }
    },
    {
      id: "metoclopramide",
      name: "Metoclopramide",
      category: "Prokinetic",
      route: "PO/IV",
      doses: {
        standard: { label: "Standard", value: "0.1-0.2", unit: "mg/kg/dose q6-8h" }
      },
      max: "0.5 mg/kg/day",
      indication: "GERD, gastroparesis, nausea",
      notes: "Risk of extrapyramidal symptoms. Black box warning - tardive dyskinesia.",
      renalAdjust: { gfr50: "No change", gfr30: "50% dose", gfr10: "50% dose", hd: "No supplement" }
    },
    {
      id: "metronidazole",
      name: "Metronidazole",
      category: "Antibiotic",
      route: "IV/PO",
      doses: {
        amebiasis: { label: "Amebiasis", value: "35-50", unit: "mg/kg/day ÷ q6-8h (max 750mg/dose)" },
        neo24to27wk: { label: "Neonate 24-27wk PMA", value: "7.5", unit: "mg/kg/dose q48h IV" },
        neo28to33wk: { label: "Neonate 28-33wk PMA", value: "10", unit: "mg/kg/dose q24h IV" },
        neoOver33wk: { label: "Neonate >33wk PMA", value: "7.5", unit: "mg/kg/dose q12h IV" },
        childAnaerobic: { label: "Child Anaerobic", value: "22.5-40", unit: "mg/kg/day ÷ q8h IV/PO (max 4g/day)" },
        cdiff: { label: "C. diff (Child)", value: "30", unit: "mg/kg/day ÷ q6h PO (max 500mg/dose)" },
        cdiffSevere: { label: "C. diff Severe", value: "30", unit: "mg/kg/day ÷ q6-8h IV (max 4g/day)" },
        giardia: { label: "Giardiasis", value: "15-30", unit: "mg/kg/day ÷ TID x5-7d (max 250mg/dose)" },
        bactVaginosis: { label: "Bacterial Vaginosis", value: "500", unit: "mg BID x7d or 2g x1 PO (adult)" }
      },
      max: "750 mg/dose (amebiasis); 4 g/day (severe infections)",
      indication: "Anaerobic infections, amebiasis, C. difficile colitis, giardiasis, trichomoniasis, bacterial vaginosis, H. pylori (with PPI + clarithromycin)",
      notes: "Avoid alcohol (disulfiram reaction). Metallic taste common. Metabolites accumulate in renal failure.",
      renalAdjust: { gfr50: "No change", gfr30: "No change", gfr10: "Avoid use - metabolites accumulate", hd: "Avoid use" }
    },
    {
      id: "midazolam",
      name: "Midazolam (Versed)",
      category: "Sedative",
      route: "IV/IN/PO/IM",
      doses: {
        ivChild: { label: "IV (Infant/Child/Adol)", value: "0.05-0.1", unit: "mg/kg q4-6h PRN (max 10mg)" },
        intranasal: { label: "Intranasal", value: "0.2-0.3", unit: "mg/kg (max 10mg)" },
        statusUnder1yr: { label: "Status (<1yr)", value: "0.1-0.3", unit: "mg/kg IV q15-30min x2-3 (max total 2mg)" },
        status1to5yr: { label: "Status (1-5yr)", value: "0.2-0.5", unit: "mg/kg IV q2-5min (max total 10mg)" },
        statusOver5yr: { label: "Status (>5yr)", value: "0.1-0.3", unit: "mg/kg IV q10-15min (max total 10mg)" },
        po: { label: "PO", value: "0.25-0.5", unit: "mg/kg" }
      },
      max: "10 mg/dose",
      indication: "Anxiolysis, procedural sedation, status epilepticus",
      notes: "Short-acting benzo. Oral syrup 1 mg/mL available. Reversal: flumazenil.",
      renalAdjust: null
    },
    {
      id: "milrinone",
      name: "Milrinone",
      category: "Vasoactive",
      route: "IV Infusion",
      doses: {
        loading: { label: "Loading (optional)", value: "50", unit: "mcg/kg over 15 min" },
        infusion: { label: "Infusion", value: "0.25-0.75", unit: "mcg/kg/min" }
      },
      max: "0.75 mcg/kg/min",
      indication: "Low cardiac output, post-cardiac surgery",
      notes: "Inodilator. Reduce dose in renal impairment.",
      renalAdjust: { gfr50: "No change", gfr30: "0.33-0.43 mcg/kg/min max", gfr10: "0.23 mcg/kg/min max", hd: "Use with caution" }
    },
    {
      id: "montelukast",
      name: "Montelukast (Singulair)",
      category: "Leukotriene Inhibitor",
      route: "PO",
      ageDosing: [
        { age: "6 months-5 years", dose: "4 mg once daily" },
        { age: "6-14 years", dose: "5 mg once daily" },
        { age: "≥15 years", dose: "10 mg once daily" }
      ],
      doses: {
        infant: { label: "6mo-5y", value: "4", unit: "mg once daily" },
        child: { label: "6-14y", value: "5", unit: "mg once daily" },
        adult: { label: "≥15y", value: "10", unit: "mg once daily" }
      },
      max: "10 mg/day",
      indication: "Asthma, allergic rhinitis",
      notes: "Leukotriene receptor antagonist. Give in evening.",
      renalAdjust: null
    },
    {
      id: "morphine",
      name: "Morphine",
      category: "Opioid",
      route: "IV/IM/PO",
      doses: {
        neonateIV: { label: "Neonate IV", value: "0.05-0.1", unit: "mg/kg slow IV (max 0.2mg/kg) q4-6h PRN" },
        childIV: { label: "Infant/Child/Adol IV", value: "0.1-0.2", unit: "mg/kg IV/IO (max 0.5mg/kg) q4-6h PRN" },
        adultIV: { label: "Adult IV", value: "2-10", unit: "mg (max 10mg) q4-6h PRN" },
        neonateInfusion: { label: "Neonate Infusion", value: "0.01-0.04", unit: "mg/kg/hr" },
        childInfusion: { label: "Child Infusion", value: "0.02-0.04", unit: "mg/kg/hr" },
        adultInfusion: { label: "Adult Infusion", value: "0.08-0.10", unit: "mg/kg/hr" }
      },
      max: "See dosing by age",
      indication: "Moderate-severe pain, Tet spell (cyanotic)",
      notes: "Start low, titrate. Monitor respiratory status. PO:IV ratio = 3:1. Consider other agents in renal failure.",
      renalAdjust: { gfr50: "No change", gfr30: "75% dose q24h", gfr10: "50% dose q24h", hd: "No supplement needed" }
    },
    {
      id: "naloxone",
      name: "Naloxone (Narcan)",
      category: "Antidote",
      route: "IV/IM/SC/IN/ETT",
      doses: {
        opioidNaive: { label: "Opioid-Naive", value: "0.1", unit: "mg/kg IV/IM/SC q2-3min PRN (max 0.2mg/kg)" },
        opioidDependent: { label: "Opioid-Dependent (infants)", value: "0.03", unit: "mg/kg IV/IM/SC q2-3min PRN" },
        autoinjector: { label: "Auto-Injector", value: "0.4", unit: "mg IM" },
        nasalSpray: { label: "Nasal Spray", value: "4", unit: "mg per nostril" }
      },
      max: "2 mg/dose (may repeat)",
      indication: "Opioid overdose/reversal",
      notes: "Short duration (30-90 min). May need repeat doses or infusion (2/3 of initial dose/hr).",
      renalAdjust: null
    },
    {
      id: "nifedipine",
      name: "Nifedipine",
      category: "Antihypertensive",
      route: "PO",
      doses: {
        standard: { label: "Standard", value: "0.25-0.5", unit: "mg/kg/dose q4-6h" },
        er: { label: "Extended Release", value: "0.25-0.5", unit: "mg/kg/day" }
      },
      max: "3 mg/kg/day or 120 mg/day",
      indication: "Hypertension, Raynaud's",
      notes: "Avoid in acute MI. ER formulation preferred.",
      renalAdjust: null
    },
    {
      id: "norepinephrine",
      name: "Norepinephrine (Levophed)",
      category: "Vasoactive",
      route: "IV Infusion",
      doses: {
        neonate: { label: "Neonate", value: "0.05-0.1", unit: "mcg/kg/min" },
        childAdult: { label: "Child/Adult", value: "0.05-0.1", unit: "mcg/kg/min, titrate to max 2 mcg/kg/min" }
      },
      max: "2 mcg/kg/min",
      indication: "Septic shock, vasodilatory shock, hypotension",
      notes: "Potent α-adrenergic vasoconstrictor. Central line required. Titrate to effect.",
      renalAdjust: null
    },
    {
      id: "nystatin",
      name: "Nystatin",
      category: "Antifungal",
      route: "PO/Topical",
      doses: {
        oral: { label: "Oral Thrush", value: "100000-500000", unit: "units q6h swish & swallow" },
        infant: { label: "Infants", value: "100000", unit: "units to each cheek q6h" }
      },
      max: "500,000 units/dose",
      indication: "Oral thrush, candidal diaper dermatitis",
      notes: "Topical only - not absorbed systemically.",
      renalAdjust: null
    },
    {
      id: "omeprazole",
      name: "Omeprazole",
      category: "PPI",
      route: "PO/IV",
      doses: {
        standard: { label: "Standard", value: "1", unit: "mg/kg/day divided q12-24h" }
      },
      max: "40 mg/day",
      indication: "GERD, GI bleeding, stress ulcer prophylaxis",
      notes: "Give 30 min before meals. IV for active bleeding.",
      renalAdjust: null
    },
    {
      id: "ondansetron",
      name: "Ondansetron (Zofran)",
      category: "Antiemetic",
      route: "IV/PO/IM/ODT",
      doses: {
        child6moTo12yr: { label: "Child 6mo-12yr (PO)", value: "0.15", unit: "mg/kg/dose q4-8h PRN (max 8mg/dose)" },
        adolAdultPO: { label: "Adolescent/Adult (PO)", value: "4-8", unit: "mg/dose q4-8h PRN (max 24mg/day)" },
        emeticChemoLow: { label: "Chemo Low Emetic (IV)", value: "0.1-0.15", unit: "mg/kg q4-8h (max 8mg/dose)" },
        emeticChemoHigh: { label: "Chemo High Emetic (IV)", value: "0.45", unit: "mg/kg x1 pre-chemo (max 32mg)" },
        postop: { label: "Post-Op (IV)", value: "0.05-0.1", unit: "mg/kg/dose (max 4mg)" },
        gastroenteritis: { label: "Gastroenteritis", value: "0.15", unit: "mg/kg PO x1 (max 8mg)" }
      },
      max: "8 mg/dose PO; 32 mg single IV (chemo); 24 mg/day total",
      indication: "PONV (post-op nausea/vomiting), chemotherapy-induced emesis, radiation-induced emesis, gastroenteritis-related vomiting",
      notes: "QT prolongation risk - avoid with other QT-prolonging drugs. Max single IV dose 16mg in adults.",
      renalAdjust: null
    },
    {
      id: "oseltamivir",
      name: "Oseltamivir (Tamiflu)",
      category: "Antiviral",
      route: "PO",
      ageDosing: [
        { age: "<1 year", dose: "3 mg/kg/dose q12h x5 days" },
        { age: "1-12 years ≤15kg", dose: "30 mg q12h" },
        { age: "1-12 years 15-23kg", dose: "45 mg q12h" },
        { age: "1-12 years 23-40kg", dose: "60 mg q12h" },
        { age: ">40kg or ≥13 years", dose: "75 mg q12h" }
      ],
      doses: {
        infant: { label: "<1 year", value: "3", unit: "mg/kg/dose q12h x5 days" },
        weightBased: { label: "Weight-based", value: "See age dosing", unit: "" }
      },
      max: "75 mg/dose",
      indication: "Influenza treatment and prophylaxis",
      notes: "Start within 48h of symptoms. Prophylaxis: once daily.",
      renalAdjust: { gfr50: "No change", gfr30: "30 mg q12h", gfr10: "30 mg q24h", hd: "30 mg after each HD session" }
    },
    {
      id: "paracetamol",
      name: "Paracetamol (Acetaminophen)",
      category: "Analgesic",
      route: "PO/PR/IV",
      doses: {
        loadingPR: { label: "Loading (PR)", value: "20-25", unit: "mg/kg/dose x1" },
        neoUnder32wk: { label: "Neonate ≤32wk (IV)", value: "12.5", unit: "mg/kg/dose q6h (max 50mg/kg/day)" },
        neoOver32wk: { label: "Neonate >32wk (IV)", value: "15", unit: "mg/kg/dose q6h (max 75mg/kg/day)" },
        childPO: { label: "Child PO/PR", value: "10-15", unit: "mg/kg/dose q4-6h PRN (max 75mg/kg/day)" },
        childIV: { label: "Child IV", value: "15", unit: "mg/kg/dose q6h (7.5 if <10kg)" },
        adultPO: { label: "Adult PO", value: "325-650", unit: "mg/dose q4-6h (max 4g/day)" },
        adultIV: { label: "Adult IV (<50kg)", value: "15", unit: "mg/kg q6h (max 750mg/dose, 3.75g/day)" }
      },
      max: "75 mg/kg/day or 4 g/day (whichever is less); DO NOT exceed 5 doses/24hr",
      indication: "Pain, fever, analgesic/antipyretic",
      notes: "IV max 1g/dose for >50kg. All routes count toward daily max. Hepatotoxicity risk with overdose.",
      renalAdjust: { gfr50: "100% dose q6h", gfr30: "100% dose q8h", gfr10: "Avoid prolonged use", hd: "Avoid prolonged use" }
    },
    {
      id: "penicillinG",
      name: "Penicillin G",
      category: "Antibiotic",
      route: "IV",
      doses: {
        standard: { label: "Standard", value: "50000", unit: "units/kg/dose q4-6h" },
        meningitis: { label: "Meningitis", value: "75000", unit: "units/kg/dose q4h" }
      },
      max: "4 MU/dose",
      indication: "Strep infections, syphilis, rheumatic fever",
      notes: "300,000-400,000 units/kg/day for meningitis.",
      renalAdjust: { gfr50: "No change", gfr30: "75% dose", gfr10: "50% dose", hd: "Give after HD" }
    },
    {
      id: "phenobarbital",
      name: "Phenobarbital",
      category: "Anticonvulsant",
      route: "IV/PO",
      doses: {
        loading: { label: "Loading (Status)", value: "15-20", unit: "mg/kg IV (max 1000mg)" },
        additionalLoad: { label: "Additional Loads", value: "5-10", unit: "mg/kg IV PRN (max 30mg/kg/24hr total)" },
        maintenanceNeo: { label: "Maintenance (Neonate)", value: "5", unit: "mg/kg/day IV" },
        maintenanceChild: { label: "Maintenance (Infant/Child)", value: "5-10", unit: "mg/kg/day (max 30mg/kg/24hr)" }
      },
      max: "1000 mg single load, 30 mg/kg/24hr total",
      indication: "Neonatal seizures, status epilepticus",
      notes: "Causes sedation. Give loading dose as single or divided doses. Monitor levels.",
      renalAdjust: { gfr50: "No change", gfr30: "No change", gfr10: "q12-16h", hd: "Give after HD" }
    },
    {
      id: "phenytoin",
      name: "Phenytoin/Fosphenytoin",
      category: "Anticonvulsant",
      route: "IV/IM",
      doses: {
        loadingStatus: { label: "Loading (Status)", value: "20", unit: "mg PE/kg IV (max 1500mg PE)" },
        loadingNonEmergent: { label: "Loading (Non-emergent)", value: "15", unit: "mg PE/kg/24hr IV/IM" },
        maintenanceNeo: { label: "Maintenance (Neonate)", value: "15-20", unit: "mg PE/kg/24hr IV/IM" },
        maintenanceChild: { label: "Maintenance (Child)", value: "5-7", unit: "mg/kg/day divided q8-12h" }
      },
      max: "1500 mg PE load",
      indication: "Status epilepticus, seizure prophylaxis",
      notes: "Fosphenytoin preferred (less irritation, can give IM). PE = phenytoin equivalents. Monitor levels and cardiac rhythm.",
      renalAdjust: null
    },
    {
      id: "piptazo",
      name: "Piperacillin-Tazobactam (Tazocin)",
      category: "Antibiotic",
      route: "IV",
      doses: {
        standard: { label: "Standard", value: "80-100", unit: "mg/kg/dose q6-8h" },
        pseudomonas: { label: "Pseudomonas", value: "100", unit: "mg/kg/dose q6h" }
      },
      max: "4.5 g/dose",
      indication: "Nosocomial infections, Pseudomonas, intra-abdominal",
      notes: "Extended infusion (3-4h) for severe infections. Based on piperacillin.",
      renalAdjust: { gfr50: "q6h", gfr30: "q8h", gfr10: "q12h", hd: "Give after HD" }
    },
    {
      id: "polyethyleneglycol",
      name: "Polyethylene Glycol (Miralax)",
      category: "Laxative",
      route: "PO",
      doses: {
        maintenance: { label: "Maintenance", value: "0.5-1", unit: "g/kg/day" },
        disimpaction: { label: "Disimpaction", value: "1-1.5", unit: "g/kg/day x3-6 days" }
      },
      max: "17 g/day maintenance",
      indication: "Constipation, fecal impaction",
      notes: "Mix in any liquid. Adjust dose for soft daily BM.",
      renalAdjust: null
    },
    {
      id: "potassiumchloride",
      name: "Potassium Chloride",
      category: "Electrolyte",
      route: "PO/IV",
      doses: {
        po: { label: "PO Supplement", value: "1-2", unit: "mEq/kg/day divided" },
        iv: { label: "IV (diluted)", value: "0.5-1", unit: "mEq/kg over 1-2h" }
      },
      max: "40 mEq/dose IV (max 0.5 mEq/kg/hr peripheral)",
      indication: "Hypokalemia",
      notes: "Never IV push. Cardiac monitoring for IV infusion.",
      renalAdjust: { gfr50: "Use with caution", gfr30: "50% dose, monitor K+", gfr10: "Avoid or monitor closely", hd: "Usually not needed" }
    },
    {
      id: "prednisolone",
      name: "Prednisolone/Prednisone",
      category: "Steroid",
      route: "PO",
      doses: {
        asthmaChild: { label: "Asthma (Child)", value: "1-2", unit: "mg/kg/day (max 60mg) x3-5 days" },
        asthmaAdult: { label: "Asthma (Adult)", value: "40-60", unit: "mg/day" },
        croup: { label: "Croup", value: "1", unit: "mg/kg PO single dose" },
        antiinflammatory: { label: "Anti-inflammatory", value: "0.05-2", unit: "mg/kg/day divided q12-24h" },
        nephrotic: { label: "Nephrotic Syndrome", value: "2", unit: "mg/kg/day (max 80mg) x6 weeks" }
      },
      max: "60-80 mg/day",
      indication: "Asthma exacerbation, croup, nephrotic syndrome, inflammation",
      notes: "Give with food. Taper if >5 days. Prednisolone liquid better absorbed than prednisone.",
      renalAdjust: null
    },
    {
      id: "propofol",
      name: "Propofol",
      category: "Sedative",
      route: "IV",
      doses: {
        induction: { label: "Induction", value: "2-3", unit: "mg/kg" },
        infusion: { label: "Sedation Infusion", value: "50-200", unit: "mcg/kg/min" }
      },
      max: "4 mg/kg/hr for >48h",
      indication: "Procedural sedation, induction, ICU sedation",
      notes: "Avoid prolonged use in children (PRIS). Contains egg/soy.",
      renalAdjust: null
    },
    {
      id: "ranitidine",
      name: "Ranitidine",
      category: "H2 Blocker",
      route: "PO/IV",
      doses: {
        po: { label: "PO", value: "2-4", unit: "mg/kg/dose q12h" },
        iv: { label: "IV", value: "1-2", unit: "mg/kg/dose q6-8h" }
      },
      max: "300 mg/day PO, 200 mg/day IV",
      indication: "GERD, stress ulcer prophylaxis",
      notes: "H2 receptor antagonist. (Note: withdrawn in many countries)",
      renalAdjust: { gfr50: "No change", gfr30: "50% dose", gfr10: "25% dose", hd: "Give after HD" }
    },
    {
      id: "rocuronium",
      name: "Rocuronium",
      category: "Neuromuscular Blocker",
      route: "IV",
      doses: {
        intubation: { label: "RSI Intubation", value: "0.6-1.2", unit: "mg/kg" },
        maintenance: { label: "Maintenance", value: "0.1-0.2", unit: "mg/kg PRN" }
      },
      max: "1.2 mg/kg for RSI",
      indication: "Rapid sequence intubation, paralysis",
      notes: "Non-depolarizing. Onset 60-90 sec. Reversal: sugammadex.",
      renalAdjust: null
    },
    {
      id: "sodiumbicarbonate",
      name: "Sodium Bicarbonate",
      category: "Electrolyte",
      route: "IV",
      doses: {
        acidosis: { label: "Metabolic Acidosis", value: "1-2", unit: "mEq/kg slow IV" },
        arrest: { label: "Cardiac Arrest", value: "1", unit: "mEq/kg" }
      },
      max: "50 mEq/dose",
      indication: "Severe metabolic acidosis, hyperkalemia, TCA overdose",
      notes: "Dilute before use. Do not mix with calcium.",
      renalAdjust: { gfr50: "Use with caution", gfr30: "Monitor Na+ closely", gfr10: "Risk of Na+ overload", hd: "Use with caution" }
    },
    {
      id: "succinylcholine",
      name: "Succinylcholine",
      category: "Neuromuscular Blocker",
      route: "IV/IM",
      doses: {
        iv: { label: "IV", value: "1-2", unit: "mg/kg" },
        im: { label: "IM", value: "4-5", unit: "mg/kg (max 150mg)" }
      },
      max: "150 mg",
      indication: "Rapid sequence intubation",
      notes: "Depolarizing. Avoid in hyperkalemia, burns, crush injury.",
      renalAdjust: null
    },
    {
      id: "tmp-smx",
      name: "Trimethoprim-Sulfamethoxazole (Septrin)",
      category: "Antibiotic",
      route: "IV/PO",
      doses: {
        uti: { label: "UTI", value: "4-6", unit: "mg TMP/kg/day divided q12h" },
        pcp: { label: "PCP Treatment", value: "15-20", unit: "mg TMP/kg/day divided q6-8h" }
      },
      max: "320 mg TMP/dose",
      indication: "UTI, PCP, MRSA skin infections, Nocardia",
      notes: "Dose based on TMP component. Adequate hydration required.",
      renalAdjust: { gfr50: "No change", gfr30: "50% dose", gfr10: "Avoid or 50% dose q24h", hd: "Give after HD" }
    },
    {
      id: "topiramate",
      name: "Topiramate",
      category: "Anticonvulsant",
      route: "PO",
      doses: {
        initial: { label: "Initial", value: "1-3", unit: "mg/kg/day" },
        maintenance: { label: "Maintenance", value: "5-9", unit: "mg/kg/day divided q12h" }
      },
      max: "400 mg/day",
      indication: "Epilepsy, migraine prophylaxis",
      notes: "Titrate slowly. Risk of kidney stones, cognitive effects.",
      renalAdjust: { gfr50: "No change", gfr30: "50% dose", gfr10: "50% dose", hd: "Give supplement after HD" }
    },
    {
      id: "valacyclovir",
      name: "Valacyclovir",
      category: "Antiviral",
      route: "PO",
      doses: {
        chickenpox: { label: "Chickenpox ≥2y", value: "20", unit: "mg/kg/dose q8h x5 days" },
        herpes: { label: "Herpes Simplex", value: "20", unit: "mg/kg/dose q12h" }
      },
      max: "1 g/dose",
      indication: "HSV, VZV, chickenpox",
      notes: "Prodrug of acyclovir with better oral bioavailability.",
      renalAdjust: { gfr50: "No change", gfr30: "q12h", gfr10: "q24h", hd: "Give after HD" }
    },
    {
      id: "valproicacid",
      name: "Valproic Acid",
      category: "Anticonvulsant",
      route: "PO/IV",
      doses: {
        loading: { label: "Loading", value: "20-40", unit: "mg/kg" },
        maintenance: { label: "Maintenance", value: "30-60", unit: "mg/kg/day divided q8-12h" }
      },
      max: "60 mg/kg/day",
      indication: "Seizures, status epilepticus, bipolar",
      notes: "Monitor LFTs, ammonia. Teratogenic - avoid in pregnancy.",
      renalAdjust: null
    },
    {
      id: "vancomycin",
      name: "Vancomycin",
      category: "Antibiotic",
      route: "IV/PO",
      doses: {
        neoMeningitis: { label: "Neonate Meningitis", value: "10", unit: "mg/kg/dose q8h IV" },
        neoOther: { label: "Neonate Other", value: "15", unit: "mg/kg/dose q12h IV" },
        childIV: { label: "Child IV", value: "15", unit: "mg/kg/dose q6-8h (max 15mg/kg/dose)" },
        adolIV: { label: "Adolescent IV", value: "15", unit: "mg/kg/dose q6-8h" },
        adultIV: { label: "Adult IV", value: "15", unit: "mg/kg/dose q8-12h" },
        cdiffChild: { label: "C. diff (Child) PO", value: "10", unit: "mg/kg/dose q6h PO (max 125mg/dose)" },
        cdiffAdult: { label: "C. diff (Adult) PO", value: "125-500", unit: "mg/dose q6h PO" }
      },
      max: "4 g/day IV; 2 g/day PO",
      indication: "MRSA, C. difficile colitis (PO), CNS infections, endocarditis, osteomyelitis, pneumonia, septic arthritis, serious gram-positive infections",
      notes: "Trough: 10-15 (standard), 15-20 (CNS/severe). Infuse over 1hr minimum. Red man syndrome with rapid infusion.",
      renalAdjust: { gfr50: "Standard initial dose, then per levels", gfr30: "Standard initial dose, then per levels q12-24h", gfr10: "Standard initial dose, then per levels q24-48h", hd: "Redose per levels after HD; re-check 4-6hr post-HD" }
    },
    {
      id: "vecuronium",
      name: "Vecuronium",
      category: "Neuromuscular Blocker",
      route: "IV",
      doses: {
        intubation: { label: "Intubation", value: "0.1", unit: "mg/kg" },
        infusion: { label: "Infusion", value: "0.8-1.7", unit: "mcg/kg/min" }
      },
      max: "0.15 mg/kg bolus",
      indication: "Intubation, mechanical ventilation",
      notes: "Non-depolarizing. Longer onset than rocuronium.",
      renalAdjust: null
    },
    {
      id: "vitamind",
      name: "Vitamin D (Cholecalciferol)",
      category: "Vitamin",
      route: "PO",
      doses: {
        prophylaxis: { label: "Prophylaxis", value: "400-600", unit: "IU/day" },
        deficiency: { label: "Deficiency", value: "1000-5000", unit: "IU/day x8-12 weeks" }
      },
      max: "10,000 IU/day",
      indication: "Rickets prevention, vitamin D deficiency",
      notes: "All breastfed infants need 400 IU/day.",
      renalAdjust: null
    },
    {
      id: "vitamink",
      name: "Vitamin K (Phytonadione)",
      category: "Vitamin",
      route: "IM/IV/PO",
      doses: {
        newborn: { label: "Newborn Prophylaxis", value: "0.5-1", unit: "mg IM once" },
        bleeding: { label: "Bleeding/Reversal", value: "1-5", unit: "mg IV/PO" }
      },
      max: "10 mg/dose",
      indication: "VKDB prophylaxis, warfarin reversal",
      notes: "IM preferred for newborns. IV: slow infusion (risk of anaphylaxis).",
      renalAdjust: null
    }
  ];

  // Sort drugs alphabetically by name
  const sortedDrugs = [...drugs].sort((a, b) => a.name.localeCompare(b.name));

  // Filter drugs based on search term (searches name, category, and indication)
  const filteredDrugs = sortedDrugs.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.indication.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const calculateDose = (doseStr, weight, maxDose = null, maxUnit = "mg", doseUnit = "") => {
    if (!weight || !doseStr) return null;
    if (doseStr.includes("See age")) return doseStr;
    
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
    
    return {
      dose: `${calculatedMin.toFixed(1)}${calculatedMax !== calculatedMin ? ` - ${calculatedMax.toFixed(1)}` : ''} ${unit}`,
      isExceedingMax,
      maxDisplay,
      isPerDose,
      isPerDay,
      doseLabel
    };
  };

  // Parse max dose string from drug data (e.g., "800 mg PO, 20 mg/kg IV" -> extract first number)
  const parseMaxDose = (maxStr, route = null) => {
    if (!maxStr || maxStr === "See protocol") return null;
    
    // Try to extract numeric max dose
    // Common formats: "800 mg", "3 g/day", "1.5 g/day", "6 mg first", "1.2g IV/dose"
    const patterns = [
      { regex: /(\d+(?:\.\d+)?)\s*g\/day/i, multiplier: 1000 },  // "3 g/day" -> 3000 mg
      { regex: /(\d+(?:\.\d+)?)\s*mg/i, multiplier: 1 },  // "800 mg" - check mg BEFORE g
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
      <div className="space-y-2">
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
              <CardContent className="p-3">
                {/* Drug Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{drug.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                        {drug.category}
                      </span>
                    </div>
                    {/* Show first dose type */}
                    {firstDose && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[9px] px-1 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          {firstDose.label}: {firstDose.value} {firstDose.unit}
                        </span>
                      </div>
                    )}
                    {/* Age-based dosing indicator */}
                    {drug.ageDosing && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mt-1 inline-block">
                        Age-based dosing
                      </span>
                    )}
                  </div>
                  {w > 0 && firstDose && (
                    <div className="text-right ml-2">
                      {(() => {
                        // Use per-dose maxDose if available
                        const doseSpecificMax = firstDose.maxDose;
                        const maxDoseValue = doseSpecificMax || parseMaxDose(drug.max);
                        const result = calculateDose(firstDose.value, w, maxDoseValue, "mg", firstDose.unit);
                        if (!result) return null;
                        const doseResult = typeof result === 'string' ? { dose: result, isExceedingMax: false } : result;
                        return (
                          <div>
                            <p className={`text-[11px] font-mono font-bold ${doseResult.isExceedingMax ? 'text-amber-600' : 'text-blue-600'}`}>
                              {doseResult.dose}{doseResult.doseLabel && <span className="text-[9px] text-muted-foreground">{doseResult.doseLabel}</span>}
                            </p>
                            {doseResult.isExceedingMax && (
                              <p className="text-[9px] text-amber-600 font-medium">⚠️ Max capped</p>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    {/* Age-Based Dosing Table */}
                    {drug.ageDosing && (
                      <div className="p-2 rounded bg-purple-50 dark:bg-purple-900/20">
                        <p className="text-[10px] font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-1">Age-Based Dosing</p>
                        <div className="space-y-1">
                          {drug.ageDosing.map((ad, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{ad.age}:</span>
                              <span className="font-mono">{ad.dose}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Calculated Doses */}
                    {w > 0 && (
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Calculated Doses ({w}kg)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {doseKeys.map(key => {
                            // Use per-dose maxDose if available, otherwise fall back to global max
                            const doseSpecificMax = drug.doses[key].maxDose;
                            const maxDoseValue = doseSpecificMax || parseMaxDose(drug.max);
                            const result = calculateDose(drug.doses[key].value, w, maxDoseValue, "mg", drug.doses[key].unit);
                            if (!result) return null;
                            const doseResult = typeof result === 'string' ? { dose: result, isExceedingMax: false } : result;
                            return (
                              <div key={key} className={`p-2 rounded ${doseResult.isExceedingMax ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-300' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                <p className="text-[10px] text-muted-foreground">{drug.doses[key].label}</p>
                                <p className={`font-mono font-bold ${doseResult.isExceedingMax ? 'text-amber-600' : 'text-blue-600'}`}>
                                  {doseResult.dose}{doseResult.doseLabel && <span className="text-[9px] text-muted-foreground ml-0.5">{doseResult.doseLabel}</span>}
                                </p>
                                <p className="text-[9px] text-muted-foreground">{drug.doses[key].unit}</p>
                                {doseResult.isExceedingMax && (
                                  <p className="text-[9px] text-amber-600 font-medium mt-1">
                                    ⚠️ Capped at max: {doseSpecificMax ? `${doseSpecificMax} mg` : drug.max}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Dose Table (when no weight) */}
                    {!w && (
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Dosing</p>
                        <div className="space-y-1">
                          {doseKeys.map(key => (
                            <div key={key} className="text-xs">
                              <span className="font-medium">{drug.doses[key].label}:</span> {drug.doses[key].value} {drug.doses[key].unit}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Route */}
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Route</p>
                      <p className="text-xs">{drug.route}</p>
                    </div>

                    {/* Max Dose */}
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Max Dose</p>
                      <p className="text-xs font-medium text-red-600">{drug.max}</p>
                    </div>

                    {/* Indication */}
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Indication</p>
                      <p className="text-xs">{drug.indication}</p>
                    </div>

                    {/* Renal Adjustment */}
                    {drug.renalAdjust && (
                      <div className="p-2 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-[10px] font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-1">⚠️ Renal Dose Adjustment</p>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <div><span className="text-muted-foreground">GFR 30-50:</span> <span className="font-mono">{drug.renalAdjust.gfr50}</span></div>
                          <div><span className="text-muted-foreground">GFR 10-30:</span> <span className="font-mono">{drug.renalAdjust.gfr30}</span></div>
                          <div><span className="text-muted-foreground">GFR &lt;10:</span> <span className="font-mono">{drug.renalAdjust.gfr10}</span></div>
                          <div><span className="text-muted-foreground">HD:</span> <span className="font-mono">{drug.renalAdjust.hd}</span></div>
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

                    {/* Notes */}
                    <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-[10px] text-muted-foreground">
                      <p className="font-medium text-foreground mb-0.5">Notes:</p>
                      <p>{drug.notes}</p>
                    </div>
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
