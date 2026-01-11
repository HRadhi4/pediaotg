/**
 * Children's Drugs Page - Pediatric Drug Formulary
 * 
 * Comprehensive drug database with:
 * - Weight-based dose calculations
 * - GFR calculator (Schwartz equations)
 * - Renal dose adjustments
 * - Based on Harriet Lane Handbook 23rd Edition
 */

import { useState, useEffect } from "react";
import { AlertTriangle, ChevronDown, Scale } from "lucide-react";
import { ArrowLeftIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DrugsPage = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [ageCategory, setAgeCategory] = useState("child"); // "preterm", "term", "child", "adolescentM", "adolescentF"
  const [schwartzType, setSchwartzType] = useState("revised"); // "revised" or "original"
  const [expandedDrug, setExpandedDrug] = useState(null);
  const [showGFRCalc, setShowGFRCalc] = useState(false);
  
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
        iv: { label: "IV (HSV/VZV)", value: "10-20", unit: "mg/kg/dose q8h" },
        po: { label: "PO (Chickenpox)", value: "20", unit: "mg/kg/dose q6h x5 days" },
        encephalitis: { label: "HSV Encephalitis", value: "20", unit: "mg/kg/dose q8h x21 days" }
      },
      max: "800 mg PO, 20 mg/kg IV",
      indication: "HSV, VZV, chickenpox, encephalitis",
      notes: "HSV encephalitis: 20 mg/kg q8h x21 days. Hydrate well to prevent crystalluria.",
      renalAdjust: { gfr50: "q8h", gfr30: "q12h", gfr10: "q24h", hd: "Give after HD" }
    },
    {
      id: "adenosine",
      name: "Adenosine",
      category: "Antiarrhythmic",
      route: "IV rapid push",
      doses: {
        first: { label: "1st Dose", value: "0.1", unit: "mg/kg rapid push" },
        second: { label: "2nd Dose", value: "0.2", unit: "mg/kg if needed" }
      },
      max: "6 mg first, 12 mg subsequent",
      indication: "SVT",
      notes: "Give rapid IV push followed by saline flush. May cause brief asystole.",
      renalAdjust: null
    },
    {
      id: "salbutamol",
      name: "Albuterol (Salbutamol)",
      category: "Bronchodilator",
      route: "Nebulizer/MDI",
      doses: {
        neb: { label: "Nebulizer", value: "0.15", unit: "mg/kg (min 2.5mg, max 5mg) q20min x3" },
        mdi: { label: "MDI", value: "4-8", unit: "puffs q20min x3" }
      },
      max: "5 mg/neb, continuous if severe",
      indication: "Asthma, bronchospasm",
      notes: "May give continuous neb in severe asthma. Monitor HR, K+.",
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
      route: "IV",
      doses: {
        arrest: { label: "VF/pVT Arrest", value: "5", unit: "mg/kg bolus" },
        other: { label: "Other Arrhythmias", value: "5", unit: "mg/kg over 20-60 min" }
      },
      max: "300 mg/dose",
      indication: "VF, pVT, refractory SVT",
      notes: "May repeat x2 in arrest. Loading then infusion for non-arrest.",
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
        standard: { label: "Standard PO", value: "25-45", unit: "mg/kg/day divided q12h" },
        highDose: { label: "High Dose PO", value: "90", unit: "mg/kg/day divided q12h" },
        iv: { label: "IV", value: "25-50", unit: "mg/kg/dose q6-8h" }
      },
      max: "875 mg amox/dose PO, 2g IV",
      indication: "Sinusitis, bite wounds, resistant infections",
      notes: "Based on amoxicillin component. ES formulation for high dose.",
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
      route: "IV/IM",
      doses: {
        standard: { label: "Standard", value: "50-100", unit: "mg/kg/dose q6h" },
        meningitis: { label: "Meningitis", value: "100", unit: "mg/kg/dose q6h" }
      },
      max: "12 g/day",
      indication: "Listeria, enterococcus, GBS, meningitis",
      notes: "Meningitis: 300-400 mg/kg/day divided q6h.",
      renalAdjust: { gfr50: "q6h", gfr30: "q6-8h", gfr10: "q12h", hd: "Give after HD" }
    },
    {
      id: "atropine",
      name: "Atropine",
      category: "Anticholinergic",
      route: "IV/IM/ETT",
      doses: {
        bradycardia: { label: "Bradycardia", value: "0.02", unit: "mg/kg" },
        premedication: { label: "Pre-intubation", value: "0.02", unit: "mg/kg" }
      },
      max: "0.5 mg child, 1 mg adolescent",
      indication: "Symptomatic bradycardia, RSI premedication",
      notes: "Min dose 0.1 mg (paradoxical bradycardia). ETT: 2-3x IV dose.",
      renalAdjust: null
    },
    {
      id: "azithromycin",
      name: "Azithromycin",
      category: "Antibiotic",
      route: "PO/IV",
      doses: {
        standard: { label: "Standard (Z-pack)", value: "10", unit: "mg/kg day 1, then 5 mg/kg days 2-5" },
        cap: { label: "CAP", value: "10", unit: "mg/kg/day x5 days" }
      },
      max: "500 mg/day",
      indication: "Atypical pneumonia, pertussis, MAC prophylaxis",
      notes: "Long half-life. QT prolongation risk.",
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
        hypocalcemia: { label: "Hypocalcemia", value: "50-100", unit: "mg/kg (0.5-1 ml/kg of 10%)" },
        arrest: { label: "Cardiac Arrest", value: "60-100", unit: "mg/kg" }
      },
      max: "2 g/dose",
      indication: "Hypocalcemia, hyperkalemia, calcium channel blocker OD",
      notes: "Give slowly over 10-30 min. Monitor for extravasation.",
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
        standard: { label: "Standard", value: "50", unit: "mg/kg/dose q6-8h" },
        meningitis: { label: "Meningitis", value: "50", unit: "mg/kg/dose q6h" }
      },
      max: "12 g/day",
      indication: "Meningitis, sepsis (preferred in neonates)",
      notes: "Preferred over ceftriaxone in neonates. Good CSF penetration.",
      renalAdjust: { gfr50: "No change", gfr30: "q8-12h", gfr10: "q24h", hd: "Give after HD" }
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
        standard: { label: "Standard", value: "50-75", unit: "mg/kg/day q12-24h" },
        meningitis: { label: "Meningitis", value: "100", unit: "mg/kg/day divided q12h" }
      },
      max: "4 g/day",
      indication: "CAP, meningitis, gonorrhea, Lyme disease",
      notes: "Avoid in neonates with hyperbilirubinemia. Do not mix with calcium.",
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
        po: { label: "PO", value: "10-20", unit: "mg/kg/dose q12h" },
        iv: { label: "IV", value: "10-15", unit: "mg/kg/dose q8-12h" }
      },
      max: "750 mg PO, 400 mg IV",
      indication: "Pseudomonas, complicated UTI, anthrax",
      notes: "Fluoroquinolone - avoid in children <18y unless necessary.",
      renalAdjust: { gfr50: "No change", gfr30: "50-75% dose", gfr10: "50% dose q12h", hd: "Give after HD" }
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
      route: "IV/PO",
      doses: {
        standard: { label: "Standard", value: "10-13", unit: "mg/kg/dose q6-8h" },
        severe: { label: "Severe/Bone", value: "10-15", unit: "mg/kg/dose q6h" }
      },
      max: "900 mg/dose",
      indication: "Skin/soft tissue, osteomyelitis, anaerobes, MRSA",
      notes: "Good bone penetration. Risk of C. diff colitis.",
      renalAdjust: null
    },
    {
      id: "dexamethasone",
      name: "Dexamethasone",
      category: "Steroid",
      route: "IV/PO",
      doses: {
        croup: { label: "Croup", value: "0.6", unit: "mg/kg single dose" },
        meningitis: { label: "Meningitis", value: "0.15", unit: "mg/kg q6h x2 days" },
        airway: { label: "Airway Edema", value: "0.5-1", unit: "mg/kg q6h" }
      },
      max: "10 mg/dose",
      indication: "Croup, meningitis, airway edema, asthma",
      notes: "Give before/with first abx dose for meningitis.",
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
        hypoglycemia: { label: "Hypoglycemia", value: "0.25-0.5", unit: "g/kg (D10: 2.5-5 mL/kg)" },
        hyperkalemia: { label: "Hyperkalemia", value: "0.5", unit: "g/kg with insulin" }
      },
      max: "25 g/dose",
      indication: "Hypoglycemia, hyperkalemia (with insulin)",
      notes: "D10 for peripheral, D25 for central line.",
      renalAdjust: null
    },
    {
      id: "diazepam",
      name: "Diazepam",
      category: "Sedative",
      route: "IV/PR/PO",
      doses: {
        seizure: { label: "Status Epilepticus", value: "0.1-0.3", unit: "mg/kg IV (max 10mg)" },
        rectal: { label: "Rectal", value: "0.5", unit: "mg/kg PR (max 20mg)" }
      },
      max: "10 mg IV, 20 mg PR",
      indication: "Status epilepticus, seizure rescue, muscle spasm",
      notes: "Long-acting benzo. PR gel for home seizure rescue.",
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
        low: { label: "Low (renal)", value: "2-5", unit: "mcg/kg/min" },
        medium: { label: "Medium (cardiac)", value: "5-10", unit: "mcg/kg/min" },
        high: { label: "High (pressor)", value: "10-20", unit: "mcg/kg/min" }
      },
      max: "20 mcg/kg/min",
      indication: "Shock, hypotension",
      notes: "Central line preferred. Titrate to effect.",
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
      route: "IV/IM/ETT",
      doses: {
        arrest: { label: "Cardiac Arrest", value: "0.01", unit: "mg/kg (0.1 ml/kg of 1:10,000) q3-5min" },
        anaphylaxis: { label: "Anaphylaxis IM", value: "0.01", unit: "mg/kg (0.01 ml/kg of 1:1,000)" },
        infusion: { label: "Infusion", value: "0.01-1", unit: "mcg/kg/min" }
      },
      max: "1 mg/dose arrest, 0.5 mg IM",
      indication: "Cardiac arrest, anaphylaxis, shock",
      notes: "ETT: 0.1 mg/kg (10x IV dose). IM for anaphylaxis.",
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
      route: "IV/IN",
      doses: {
        iv: { label: "IV Bolus", value: "0.5-2", unit: "mcg/kg/dose q1-2h" },
        infusion: { label: "Infusion", value: "1-3", unit: "mcg/kg/hr" }
      },
      max: "4 mcg/kg/dose",
      indication: "Procedural sedation, severe pain, intubation",
      notes: "Rapid onset (1-2 min), short duration. IN: 1.5-2 mcg/kg.",
      renalAdjust: { gfr50: "No change", gfr30: "75% dose", gfr10: "50% dose", hd: "No supplement" }
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
      indication: "Candidiasis (oral, esophageal, systemic)",
      notes: "Oral thrush: 6 mg/kg day 1, then 3 mg/kg/day x14 days.",
      renalAdjust: { gfr50: "No change", gfr30: "q24-36h", gfr10: "q48h", hd: "Give after HD" }
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
      route: "IV/PO",
      doses: {
        iv: { label: "IV", value: "0.5-1", unit: "mg/kg/dose q6-12h" },
        po: { label: "PO", value: "1-2", unit: "mg/kg/dose q6-12h" }
      },
      max: "6 mg/kg/dose",
      indication: "Edema, heart failure, fluid overload",
      notes: "Monitor K+, Mg2+. PO bioavailability ~50% of IV.",
      renalAdjust: { gfr50: "No change", gfr30: "Higher doses may be needed", gfr10: "May need continuous infusion", hd: "Usually ineffective" }
    },
    {
      id: "gentamicin",
      name: "Gentamicin",
      category: "Antibiotic",
      route: "IV/IM",
      doses: {
        standard: { label: "Once Daily", value: "5-7.5", unit: "mg/kg/dose q24h" },
        traditional: { label: "Traditional", value: "2.5", unit: "mg/kg/dose q8h" }
      },
      max: "560 mg/dose",
      indication: "Gram-negative sepsis, synergy for endocarditis",
      notes: "Monitor levels: trough <1, peak 20-30. Adjust for renal function.",
      renalAdjust: { gfr50: "q12h or per levels", gfr30: "q24h or per levels", gfr10: "q48-72h or per levels", hd: "Give after HD, redose per levels" }
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
      route: "IV",
      doses: {
        stress: { label: "Stress Dose", value: "50-100", unit: "mg/m² or 1-2 mg/kg" },
        shock: { label: "Shock", value: "1-2", unit: "mg/kg q6h" }
      },
      max: "100 mg/dose",
      indication: "Adrenal insufficiency, shock",
      notes: "Stress dosing for illness/surgery in adrenal insufficiency.",
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
      category: "Analgesic",
      route: "PO",
      doses: {
        standard: { label: "Standard", value: "5-10", unit: "mg/kg/dose q6-8h" }
      },
      max: "40 mg/kg/day (max 2.4g/day)",
      indication: "Pain, fever, inflammation",
      notes: "Avoid if dehydrated, renal impairment, GI bleed risk.",
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
      route: "IV/IM",
      doses: {
        iv: { label: "IV", value: "1-2", unit: "mg/kg" },
        im: { label: "IM", value: "4-5", unit: "mg/kg" }
      },
      max: "4 mg/kg IV, 10 mg/kg IM",
      indication: "Procedural sedation, analgesia",
      notes: "Dissociative. Causes salivation - consider glycopyrrolate.",
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
      route: "IV/PO",
      doses: {
        seizure: { label: "Status Epilepticus", value: "0.05-0.1", unit: "mg/kg (max 4mg)" },
        sedation: { label: "Sedation", value: "0.02-0.05", unit: "mg/kg q4-8h" }
      },
      max: "4 mg/dose",
      indication: "Status epilepticus, sedation, anxiety",
      notes: "Benzodiazepine. Contains propylene glycol (IV).",
      renalAdjust: null
    },
    {
      id: "magnesium",
      name: "Magnesium Sulfate",
      category: "Electrolyte",
      route: "IV",
      doses: {
        hypo: { label: "Hypomagnesemia", value: "25-50", unit: "mg/kg over 2-4h" },
        asthma: { label: "Severe Asthma", value: "25-75", unit: "mg/kg over 20 min" }
      },
      max: "2 g/dose",
      indication: "Hypomagnesemia, severe asthma, torsades",
      notes: "Monitor for hypotension, bradycardia. Slow infusion.",
      renalAdjust: { gfr50: "75% dose", gfr30: "50% dose", gfr10: "25-50% dose", hd: "Avoid unless critical" }
    },
    {
      id: "mannitol",
      name: "Mannitol",
      category: "Osmotic Diuretic",
      route: "IV",
      doses: {
        cerebral: { label: "Cerebral Edema", value: "0.25-1", unit: "g/kg over 20-30 min" }
      },
      max: "1 g/kg/dose",
      indication: "Cerebral edema, raised ICP",
      notes: "Monitor serum osmolality (keep <320). Requires urinary catheter.",
      renalAdjust: { gfr50: "Use with caution", gfr30: "Avoid if possible", gfr10: "Contraindicated", hd: "Contraindicated" }
    },
    {
      id: "meropenem",
      name: "Meropenem",
      category: "Antibiotic",
      route: "IV",
      doses: {
        standard: { label: "Standard", value: "20", unit: "mg/kg/dose q8h" },
        meningitis: { label: "Meningitis", value: "40", unit: "mg/kg/dose q8h" }
      },
      max: "2 g/dose (6 g/day)",
      indication: "Serious gram-negative, intra-abdominal, meningitis",
      notes: "Carbapenem. Extended infusion (3h) for severe infections.",
      renalAdjust: { gfr50: "No change", gfr30: "q12h", gfr10: "50% q12h", hd: "Give after HD" }
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
        standard: { label: "Standard", value: "7.5", unit: "mg/kg/dose q8h" },
        cdiff: { label: "C. diff", value: "7.5", unit: "mg/kg/dose q6h PO" }
      },
      max: "500 mg/dose",
      indication: "Anaerobes, C. diff, H. pylori, giardia",
      notes: "Avoid alcohol. Metallic taste common.",
      renalAdjust: { gfr50: "No change", gfr30: "No change", gfr10: "q12h or 50%", hd: "Give after HD" }
    },
    {
      id: "midazolam",
      name: "Midazolam (Versed)",
      category: "Sedative",
      route: "IV/IN/PO",
      doses: {
        iv: { label: "IV", value: "0.05-0.1", unit: "mg/kg" },
        intranasal: { label: "Intranasal", value: "0.2-0.5", unit: "mg/kg" },
        po: { label: "PO", value: "0.25-0.5", unit: "mg/kg" }
      },
      max: "0.5 mg/kg IN, 10 mg IV",
      indication: "Anxiolysis, procedural sedation, seizures",
      notes: "Short-acting benzo. Reversal: flumazenil.",
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
      route: "IV/PO",
      doses: {
        iv: { label: "IV", value: "0.05-0.1", unit: "mg/kg/dose q2-4h" },
        po: { label: "PO", value: "0.2-0.5", unit: "mg/kg/dose q4h" }
      },
      max: "0.1-0.2 mg/kg/dose IV",
      indication: "Moderate-severe pain",
      notes: "Start low, titrate. Monitor respiratory status. PO:IV = 3:1.",
      renalAdjust: { gfr50: "75% dose", gfr30: "50% dose", gfr10: "25-50% dose", hd: "No supplement" }
    },
    {
      id: "naloxone",
      name: "Naloxone (Narcan)",
      category: "Antidote",
      route: "IV/IM/IN/ETT",
      doses: {
        reversal: { label: "Opioid Reversal", value: "0.01-0.1", unit: "mg/kg (max 2mg)" },
        fullReversal: { label: "Full Reversal", value: "0.1", unit: "mg/kg" }
      },
      max: "2 mg/dose (may repeat)",
      indication: "Opioid overdose/reversal",
      notes: "Short duration (30-90 min). May need repeat doses or infusion.",
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
        standard: { label: "Standard", value: "0.05-2", unit: "mcg/kg/min" }
      },
      max: "2 mcg/kg/min",
      indication: "Septic shock, vasodilatory shock",
      notes: "Potent vasoconstrictor. Central line required.",
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
      route: "IV/PO",
      doses: {
        standard: { label: "Standard", value: "0.1-0.15", unit: "mg/kg/dose q8h" }
      },
      max: "4 mg (<40kg), 8 mg (>40kg)",
      indication: "Nausea, vomiting",
      notes: "QT prolongation risk. Max 3 doses/day.",
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
        po: { label: "PO/PR", value: "15", unit: "mg/kg/dose q4-6h" },
        iv: { label: "IV", value: "15", unit: "mg/kg/dose q6h (7.5 if <10kg)" }
      },
      max: "75 mg/kg/day (max 4g/day)",
      indication: "Pain, fever",
      notes: "PR loading: 20-25 mg/kg. IV: 7.5 mg/kg if <10kg.",
      renalAdjust: { gfr50: "No change", gfr30: "q6h", gfr10: "q8h", hd: "Give after HD" }
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
        loading: { label: "Loading", value: "20", unit: "mg/kg" },
        maintenance: { label: "Maintenance", value: "3-5", unit: "mg/kg/day" }
      },
      max: "40 mg/kg total load",
      indication: "Neonatal seizures, status epilepticus",
      notes: "Causes sedation. Additional 10 mg/kg loads PRN to max 40 mg/kg.",
      renalAdjust: { gfr50: "No change", gfr30: "No change", gfr10: "q12-16h", hd: "Give after HD" }
    },
    {
      id: "phenytoin",
      name: "Phenytoin/Fosphenytoin",
      category: "Anticonvulsant",
      route: "IV",
      doses: {
        loading: { label: "Loading", value: "20", unit: "mg PE/kg" },
        maintenance: { label: "Maintenance", value: "5-7", unit: "mg/kg/day divided q8-12h" }
      },
      max: "1500 mg load",
      indication: "Status epilepticus, seizure prophylaxis",
      notes: "Fosphenytoin preferred (less irritation). Monitor levels, cardiac.",
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
        asthma: { label: "Asthma", value: "1-2", unit: "mg/kg/day divided q12-24h" },
        immunosupp: { label: "Immunosuppression", value: "2", unit: "mg/kg/day" }
      },
      max: "60 mg/day",
      indication: "Asthma exacerbation, nephrotic syndrome",
      notes: "Give with food. Taper if >5 days.",
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
      route: "IV",
      doses: {
        standard: { label: "Standard", value: "15", unit: "mg/kg/dose q6-8h" },
        meningitis: { label: "Meningitis/Severe", value: "15-20", unit: "mg/kg/dose q6h" }
      },
      max: "4 g/day",
      indication: "MRSA, C. diff (PO), serious gram-positive",
      notes: "Trough: 10-15 (standard), 15-20 (CNS/severe). Infuse over 1hr.",
      renalAdjust: { gfr50: "q8-12h or per levels", gfr30: "q12-24h or per levels", gfr10: "q24-48h or per levels", hd: "Redose per levels after HD" }
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

  // Filter drugs based on search
  const filteredDrugs = sortedDrugs.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.indication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dose helper with maximum dose limits (Harriet Lane)
  const calculateDose = (doseStr, weight, maxDose = null, maxUnit = "mg", doseUnit = "") => {
    if (!weight || !doseStr) return null;
    if (doseStr.includes("See age")) return doseStr;
    
    // For rate-based dosing (mcg/kg/min, etc.), don't multiply by weight - just show the rate
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
    
    const parts = doseStr.split("-");
    const min = parseFloat(parts[0]);
    const max = parseFloat(parts[1]) || min;
    
    if (isNaN(min)) return null;
    
    let calculatedMin = min * weight;
    let calculatedMax = max * weight;
    let unit = "mg";
    let isExceedingMax = false;
    let maxDisplay = null;
    
    // Check for mL unit (e.g., Racemic Epinephrine)
    if (doseUnit.includes("mL") || doseUnit.includes("ml")) {
      unit = "mL";
      return {
        dose: `${calculatedMin.toFixed(2)}${calculatedMax !== calculatedMin ? ` - ${calculatedMax.toFixed(2)}` : ''} ${unit}`,
        isExceedingMax: false,
        maxDisplay: null
      };
    }
    
    // Check for g unit (e.g., Dextrose)
    if (doseUnit.includes("g/kg") && !doseUnit.includes("mg") && !doseUnit.includes("mcg")) {
      unit = "g";
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
        maxDisplay: null
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
    
    return {
      dose: `${calculatedMin.toFixed(1)}${calculatedMax !== calculatedMin ? ` - ${calculatedMax.toFixed(1)}` : ''} ${unit}`,
      isExceedingMax,
      maxDisplay
    };
  };

  // Parse max dose string from drug data (e.g., "800 mg PO, 20 mg/kg IV" -> extract first number)
  const parseMaxDose = (maxStr, route = null) => {
    if (!maxStr || maxStr === "See protocol") return null;
    
    // Try to extract numeric max dose
    // Common formats: "800 mg", "3 g/day", "1.5 g/day", "6 mg first"
    const patterns = [
      /(\d+(?:\.\d+)?)\s*g\/day/i,  // "3 g/day" -> 3000 mg
      /(\d+(?:\.\d+)?)\s*g(?!\/)(?!r)/i,  // "3 g" -> 3000 mg (not g/day, not gr)
      /(\d+(?:\.\d+)?)\s*mg/i,  // "800 mg"
      /(\d+(?:\.\d+)?)\s*mcg/i,  // mcg doses
    ];
    
    for (const pattern of patterns) {
      const match = maxStr.match(pattern);
      if (match) {
        let value = parseFloat(match[1]);
        if (maxStr.toLowerCase().includes('g/day') || (maxStr.toLowerCase().includes('g') && !maxStr.toLowerCase().includes('mg') && !maxStr.toLowerCase().includes('mcg'))) {
          value = value * 1000; // Convert g to mg
        }
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
    <div className="space-y-4 pt-4 pb-24">
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
                        const maxDoseValue = parseMaxDose(drug.max);
                        const result = calculateDose(firstDose.value, w, maxDoseValue, "mg", firstDose.unit);
                        if (!result) return null;
                        const doseResult = typeof result === 'string' ? { dose: result, isExceedingMax: false } : result;
                        return (
                          <div>
                            <p className={`text-[11px] font-mono font-bold ${doseResult.isExceedingMax ? 'text-amber-600' : 'text-blue-600'}`}>
                              {doseResult.dose}
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
                            const maxDoseValue = parseMaxDose(drug.max);
                            const result = calculateDose(drug.doses[key].value, w, maxDoseValue);
                            if (!result) return null;
                            const doseResult = typeof result === 'string' ? { dose: result, isExceedingMax: false } : result;
                            return (
                              <div key={key} className={`p-2 rounded ${doseResult.isExceedingMax ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-300' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                <p className="text-[10px] text-muted-foreground">{drug.doses[key].label}</p>
                                <p className={`font-mono font-bold ${doseResult.isExceedingMax ? 'text-amber-600' : 'text-blue-600'}`}>
                                  {doseResult.dose}
                                </p>
                                <p className="text-[9px] text-muted-foreground">{drug.doses[key].unit}</p>
                                {doseResult.isExceedingMax && (
                                  <p className="text-[9px] text-amber-600 font-medium mt-1">
                                    ⚠️ Capped at max: {doseResult.maxDisplay || drug.max}
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
