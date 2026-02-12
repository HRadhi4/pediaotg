/**
 * CHILDREN'S DRUG FORMULARY - Complete Drug Database
 * Based on Harriet Lane Handbook & Clinical Formulary Guidelines
 * 
 * Each drug includes:
 * - Full indications and uses
 * - All dosing variations by age, weight, indication
 * - Available formulations
 * - Contraindications & warnings
 * - Drug interactions
 * - Renal/hepatic adjustments
 * - Side effects
 * - Dosing tables where applicable
 */

export const childrenFormulary = [
  // ============================================================================
  // ACETAMINOPHEN (Tylenol, Paracetamol)
  // ============================================================================
  {
    id: "acetaminophen",
    name: "Acetaminophen (Tylenol, Paracetamol)",
    category: "Analgesic/Antipyretic",
    route: "PO/PR/IV",
    formulations: [
      { type: "Tabs", strengths: "325 mg, 500 mg" },
      { type: "Chewable tabs", strengths: "80 mg, 160 mg (may contain phenylalanine)" },
      { type: "Suspension", strengths: "160 mg/5 mL" },
      { type: "Suppository", strengths: "80 mg, 120 mg, 325 mg, 650 mg" },
      { type: "IV (Ofirmev)", strengths: "10 mg/mL (100 mL)" }
    ],
    doses: {
      // Oral/Rectal dosing
      termNeonate: { label: "Term Neonate (PO/PR)", value: "10-15", unit: "mg/kg/dose Q4-6h", maxDose: 75, maxUnit: "mg/kg/24hr" },
      pediatric: { label: "Pediatric (PO/PR)", value: "10-15", unit: "mg/kg/dose Q4-6h", maxDose: 75, maxUnit: "mg/kg/24hr or 4g/24hr" },
      adult: { label: "Adult (PO/PR)", value: "325-650", unit: "mg/dose Q4-6h", isFixed: true },
      // IV dosing
      ivNeonateUnder28d: { label: "IV Neonate ≤28d", value: "12.5", unit: "mg/kg/dose Q6h", maxDose: 50, maxUnit: "mg/kg/24hr" },
      ivInfant29dTo2yr: { label: "IV Infant 29d-2yr", value: "15", unit: "mg/kg/dose Q6h", maxDose: 60, maxUnit: "mg/kg/24hr" },
      ivChildUnder50kg: { label: "IV Child <50kg", value: "15", unit: "mg/kg/dose Q6h (or 12.5 Q4h)", maxDose: 75, maxUnit: "mg/kg/24hr up to 3750mg" },
      ivChildOver50kg: { label: "IV Child/Adult ≥50kg", value: "1000", unit: "mg Q6h or 650mg Q4h", isFixed: true, maxDose: 4000, maxUnit: "mg/24hr" }
    },
    // Weight/Age dosing table
    dosingTable: {
      title: "Acetaminophen Dosing by Weight (PO/PR Q4-6h, max 5 doses/24hr)",
      columns: ["Weight (kg)", "Age", "Dose (mg)"],
      rows: [
        ["2.7-5", "0-3 mo", "40"],
        ["5.1-7.7", "4-11 mo", "80"],
        ["7.8-10.5", "1-2 yr", "120"],
        ["10.6-15.9", "2-3 yr", "160"],
        ["16-21.4", "4-5 yr", "240"],
        ["21.5-26.8", "6-8 yr", "320-325"],
        ["26.9-32.3", "9-10 yr", "325-400"],
        ["32.4-43.2", "11 yr", "480-500"],
        [">43", "≥12 yr", "650"]
      ]
    },
    max: "75 mg/kg/24hr or 4 g/24hr (whichever is less); Max 5 doses/24hr",
    indication: "Analgesic, antipyretic. Does NOT possess anti-inflammatory activity.",
    contraindications: [
      "Severe hepatic impairment",
      "Known hypersensitivity"
    ],
    warnings: [
      "Use with caution in G6PD deficiency",
      "Hepatotoxicity risk with chronic alcohol use",
      "Include ALL routes when calculating daily dose",
      "Avoid in severe malnutrition (depleted glutathione)"
    ],
    sideEffects: [
      "Rare: Severe skin reactions (SJS, TEN)",
      "Hepatotoxicity (overdose)",
      "IV: nausea, vomiting, constipation, pruritus, agitation"
    ],
    interactions: [
      { drug: "Warfarin", effect: "May increase INR with chronic use" },
      { drug: "Lamotrigine", effect: "May decrease lamotrigine levels" },
      { drug: "Zidovudine", effect: "May increase zidovudine toxicity" },
      { drug: "Barbiturates/Phenytoin/Rifampin", effect: "May increase hepatotoxicity risk" }
    ],
    notes: "Acetylcysteine is antidote for overdose. IV administered undiluted over 15 min. May be used for PDA when NSAIDs contraindicated. Loading dose of 20-25 mg/kg PO or 30 mg/kg PR may be used.",
    renalAdjust: { gfr50: "No change", gfr30: "Q6h interval", gfr10: "Q8h interval", hd: "No supplement needed" },
    hepaticAdjust: "Use with caution; reduce dose in severe impairment"
  },

  // ============================================================================
  // ACETYLCYSTEINE (N-Acetylcysteine, NAC, Mucomyst)
  // ============================================================================
  {
    id: "nacetylcysteine",
    name: "Acetylcysteine (NAC, Mucomyst)",
    category: "Antidote/Mucolytic",
    route: "PO/IV/Inhaled",
    formulations: [
      { type: "Solution for inhalation/oral", strengths: "10%, 20%" },
      { type: "IV (Acetadote)", strengths: "200 mg/mL" }
    ],
    doses: {
      // Acetaminophen poisoning - PO
      loadingPO: { label: "Loading (PO)", value: "140", unit: "mg/kg PO", isFixed: false },
      maintenancePO: { label: "Maintenance (PO)", value: "70", unit: "mg/kg/dose Q4h x 17 doses" },
      // Acetaminophen poisoning - IV (21-hour protocol)
      loadingIV: { label: "Loading (IV)", value: "150", unit: "mg/kg over 1 hour" },
      secondIV: { label: "2nd dose (IV)", value: "50", unit: "mg/kg over 4 hours" },
      thirdIV: { label: "3rd dose (IV)", value: "100", unit: "mg/kg over 16 hours" },
      // Mucolytic
      nebInfant: { label: "Nebulizer (Infant)", value: "1-2", unit: "mL of 20% or 2-4 mL of 10% Q6-8h" },
      nebChild: { label: "Nebulizer (Child/Adult)", value: "3-5", unit: "mL of 20% or 6-10 mL of 10% TID-QID" }
    },
    // IV Dilution Table
    dosingTable: {
      title: "IV Acetylcysteine Dilution for Acetaminophen Poisoning",
      columns: ["Weight", "Loading (150 mg/kg)", "Diluent", "2nd dose (50 mg/kg)", "Diluent", "3rd dose (100 mg/kg)", "Diluent"],
      rows: [
        ["<20 kg", "As calculated", "3 mL/kg D5W", "As calculated", "7 mL/kg D5W", "As calculated", "14 mL/kg D5W"],
        ["20-40 kg", "As calculated", "100 mL D5W", "As calculated", "250 mL D5W", "As calculated", "500 mL D5W"],
        [">40 kg", "As calculated", "200 mL D5W", "As calculated", "500 mL D5W", "As calculated", "1000 mL D5W"]
      ]
    },
    max: "See protocol",
    indication: "Acetaminophen overdose (antidote), mucolytic for thick secretions (CF, bronchiectasis)",
    contraindications: [
      "Known hypersensitivity to acetylcysteine"
    ],
    warnings: [
      "Anaphylactoid reactions may occur with IV (flush, urticaria, bronchospasm)",
      "Slow infusion rate if reaction occurs",
      "Most effective if started within 8 hours of ingestion",
      "Nebulized form may cause bronchospasm"
    ],
    sideEffects: [
      "IV: Anaphylactoid reactions (3-6%), nausea, vomiting, flushing",
      "PO: Nausea, vomiting (dilute with juice/soda)",
      "Inhaled: Bronchospasm, rhinorrhea, stomatitis"
    ],
    interactions: [
      { drug: "Activated charcoal", effect: "May reduce oral NAC absorption (give NAC 1-2h after charcoal)" },
      { drug: "Nitroglycerin", effect: "May enhance hypotensive effect" }
    ],
    notes: "For PO: Dilute to 5% solution with juice or soda. Repeat dose if vomiting within 1 hour. For inhaled: Often given with bronchodilator. IV NAC can be continued beyond 21 hours if liver injury persists.",
    renalAdjust: null,
    hepaticAdjust: "No adjustment; used to treat hepatotoxicity"
  },

  // ============================================================================
  // ACYCLOVIR (Zovirax)
  // ============================================================================
  {
    id: "acyclovir",
    name: "Acyclovir (Zovirax)",
    category: "Antiviral",
    route: "IV/PO/Topical",
    formulations: [
      { type: "Capsules", strengths: "200 mg" },
      { type: "Tablets", strengths: "400 mg, 800 mg" },
      { type: "Suspension", strengths: "200 mg/5 mL" },
      { type: "IV", strengths: "500 mg, 1000 mg vials" },
      { type: "Cream/Ointment", strengths: "5%" },
      { type: "Ophthalmic ointment", strengths: "3%" }
    ],
    doses: {
      // Neonatal HSV
      neoHSV: { label: "Neonatal HSV (IV)", value: "20", unit: "mg/kg/dose Q8h x 14-21 days" },
      // Immunocompetent child
      childHSVIV: { label: "Child HSV (IV)", value: "10-15", unit: "mg/kg/dose Q8h" },
      childVZVIV: { label: "Child VZV (IV)", value: "10-15", unit: "mg/kg/dose Q8h x 7-10 days" },
      // HSV Encephalitis
      encephalitis: { label: "HSV Encephalitis (IV)", value: "20", unit: "mg/kg/dose Q8h x 14-21 days" },
      // Oral - Chickenpox
      chickenpoxPO: { label: "Chickenpox (PO)", value: "20", unit: "mg/kg/dose Q6h x 5 days", maxDose: 800 },
      // Oral - Genital herpes
      genitalFirst: { label: "Genital Herpes 1st episode", value: "400", unit: "mg TID x 7-10 days OR 200 mg 5x/day", isFixed: true },
      genitalRecur: { label: "Genital Herpes recurrent", value: "400", unit: "mg TID x 5 days OR 800 mg BID x 5 days", isFixed: true },
      genitalSuppress: { label: "Suppression", value: "400", unit: "mg BID", isFixed: true },
      // Immunocompromised
      immunocompHSV: { label: "Immunocomp HSV (IV)", value: "10", unit: "mg/kg/dose Q8h x 7-14 days" },
      immunocompVZV: { label: "Immunocomp VZV (IV)", value: "10", unit: "mg/kg/dose Q8h x 7 days" },
      // Topical
      topical: { label: "Topical (cream/ointment)", value: "Apply", unit: "5x/day x 4-7 days", isFixed: true }
    },
    max: "800 mg/dose PO; 20 mg/kg/dose IV (max 500 mg/dose)",
    indication: "HSV (neonatal, genital, mucocutaneous, encephalitis), VZV (chickenpox, shingles), immunocompromised patients",
    contraindications: [
      "Known hypersensitivity to acyclovir or valacyclovir"
    ],
    warnings: [
      "Maintain adequate hydration to prevent crystalluria",
      "Neurologic effects in renal impairment",
      "TTP/HUS reported (rare)",
      "IV: Administer slowly (over 1 hour) to prevent renal tubular damage"
    ],
    sideEffects: [
      "Common: Nausea, vomiting, diarrhea, headache",
      "IV: Phlebitis, elevated creatinine, crystalluria",
      "CNS: Confusion, hallucinations, seizures (especially with renal impairment)",
      "Rare: TTP/HUS"
    ],
    interactions: [
      { drug: "Probenecid", effect: "Increases acyclovir levels" },
      { drug: "Nephrotoxic drugs", effect: "Increased risk of renal toxicity" },
      { drug: "Zidovudine", effect: "May increase CNS toxicity" }
    ],
    notes: "Acyclovir-resistant strains may occur in immunocompromised. Foscarnet is alternative for resistant HSV. Oral bioavailability 15-30%. Valacyclovir (prodrug) has better oral absorption.",
    renalAdjust: {
      gfr50: "100% dose Q12h",
      gfr30: "100% dose Q12h",
      gfr10: "50% dose Q24h",
      hd: "50% dose Q24h, give after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // ADENOSINE
  // ============================================================================
  {
    id: "adenosine",
    name: "Adenosine (Adenocard)",
    category: "Antiarrhythmic",
    route: "IV rapid push",
    formulations: [
      { type: "IV", strengths: "3 mg/mL (2 mL, 4 mL vials)" }
    ],
    doses: {
      neonate: { label: "Neonate", value: "0.05-0.1", unit: "mg/kg IV push", maxDose: 0.3, maxUnit: "mg/kg" },
      infantChild: { label: "Infant/Child", value: "0.1", unit: "mg/kg IV push (1st dose)", maxDose: 6 },
      childSecond: { label: "Child 2nd dose", value: "0.2", unit: "mg/kg IV push", maxDose: 12 },
      adolAdult: { label: "Adolescent/Adult", value: "6", unit: "mg IV push (1st dose)", isFixed: true },
      adultSecond: { label: "Adult 2nd dose", value: "12", unit: "mg IV push", isFixed: true }
    },
    max: "12 mg/dose; 0.3 mg/kg in neonates",
    indication: "Supraventricular tachycardia (SVT) - diagnosis and treatment",
    contraindications: [
      "Second or third degree AV block (without pacemaker)",
      "Sick sinus syndrome (without pacemaker)",
      "Known hypersensitivity"
    ],
    warnings: [
      "Brief asystole (up to 15 seconds) is expected",
      "May cause bronchospasm in asthmatics",
      "Reduced dose with central line administration",
      "Have resuscitation equipment available"
    ],
    sideEffects: [
      "Very common: Flushing, chest discomfort, dyspnea",
      "Common: Headache, lightheadedness, nausea",
      "Transient: AV block, asystole, bradycardia",
      "Rare: Bronchospasm, atrial fibrillation"
    ],
    interactions: [
      { drug: "Dipyridamole", effect: "Potentiates adenosine - use lower dose (0.05 mg/kg)" },
      { drug: "Carbamazepine", effect: "May increase heart block" },
      { drug: "Methylxanthines (caffeine, theophylline)", effect: "Antagonize adenosine - may need higher dose" }
    ],
    notes: "Give as RAPID IV push (1-2 seconds) immediately followed by NS flush (5-10 mL). Use proximal IV site (AC or above). If given via central line, use half the dose. Half-life <10 seconds. May increase dose by 0.05-0.1 mg/kg increments Q1-2min.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // ALBUTEROL (Salbutamol, Ventolin, ProAir)
  // ============================================================================
  {
    id: "salbutamol",
    name: "Albuterol (Salbutamol, Ventolin)",
    category: "Bronchodilator (β2-agonist)",
    route: "Inhaled/Nebulizer/PO",
    formulations: [
      { type: "MDI", strengths: "90 mcg/actuation (HFA)" },
      { type: "Nebulizer solution", strengths: "0.5% (5 mg/mL), 0.083% (2.5 mg/3 mL)" },
      { type: "Syrup", strengths: "2 mg/5 mL" },
      { type: "Tablets", strengths: "2 mg, 4 mg" },
      { type: "ER tablets", strengths: "4 mg, 8 mg" }
    ],
    doses: {
      // Nebulizer - Non-acute
      nebUnder1yr: { label: "Neb <1 yr", value: "0.05-0.15", unit: "mg/kg/dose Q4-6h PRN" },
      neb1to4yr: { label: "Neb 1-4 yr", value: "1.25-2.5", unit: "mg/dose Q4-6h PRN" },
      neb5to12yr: { label: "Neb 5-12 yr", value: "2.5", unit: "mg/dose Q4-6h PRN" },
      nebOver12yr: { label: "Neb >12 yr/Adult", value: "2.5-5", unit: "mg/dose Q4-6h PRN" },
      // MDI
      mdiChild: { label: "MDI (≥4 yr)", value: "2", unit: "puffs (180 mcg) Q4-6h PRN", isFixed: true },
      // Acute exacerbation
      acuteNeb: { label: "Acute Exacerbation", value: "2.5-5", unit: "mg neb Q20min x 3 doses, then Q1-4h PRN" },
      acuteMDI: { label: "Acute MDI", value: "4-8", unit: "puffs Q20min x 3 doses", isFixed: true },
      // Continuous nebulization
      continuousNeb: { label: "Continuous Neb (severe)", value: "0.5", unit: "mg/kg/hr (max 20 mg/hr)" },
      // Exercise-induced
      exercisePrevent: { label: "Exercise-induced", value: "2", unit: "puffs 15-30 min before exercise", isFixed: true }
    },
    max: "2.5 mg/dose (<5 yr); 5 mg/dose (≥5 yr); 20 mg/hr continuous",
    indication: "Asthma, bronchospasm, acute exacerbations, exercise-induced bronchospasm",
    contraindications: [
      "Hypersensitivity to albuterol or any component"
    ],
    warnings: [
      "May cause paradoxical bronchospasm",
      "Use with caution in cardiovascular disease",
      "May cause hypokalemia (especially with concurrent steroids/diuretics)",
      "Overuse may indicate worsening asthma"
    ],
    sideEffects: [
      "Common: Tachycardia, palpitations, tremor, headache",
      "Less common: Hypokalemia, hyperglycemia, nervousness",
      "Rare: Paradoxical bronchospasm, arrhythmias"
    ],
    interactions: [
      { drug: "Beta-blockers", effect: "May antagonize bronchodilator effect" },
      { drug: "MAO inhibitors/TCAs", effect: "May potentiate cardiovascular effects" },
      { drug: "Diuretics", effect: "May worsen hypokalemia" },
      { drug: "Digoxin", effect: "May decrease digoxin levels" }
    ],
    notes: "Use spacer with MDI for children. Oral route discouraged (more side effects, less efficacy). Monitor potassium with frequent use. Levalbuterol (R-isomer) may have fewer cardiac effects but limited evidence of superiority.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // AMIKACIN
  // ============================================================================
  {
    id: "amikacin",
    name: "Amikacin",
    category: "Antibiotic (Aminoglycoside)",
    route: "IV/IM",
    formulations: [
      { type: "IV/IM", strengths: "250 mg/mL" }
    ],
    doses: {
      onceDaily: { label: "Once Daily (Child)", value: "15-22.5", unit: "mg/kg/dose Q24h" },
      traditional: { label: "Traditional", value: "5-7.5", unit: "mg/kg/dose Q8h" },
      cysticFibrosis: { label: "Cystic Fibrosis", value: "30", unit: "mg/kg/dose Q24h" }
    },
    // Neonatal dosing table
    dosingTable: {
      title: "Amikacin Neonatal Dosing",
      columns: ["PMA (weeks)", "Postnatal Age", "Dose", "Interval"],
      rows: [
        ["≤29", "0-7 days", "18 mg/kg", "Q48h"],
        ["≤29", "8-28 days", "15 mg/kg", "Q36h"],
        ["≤29", ">28 days", "15 mg/kg", "Q24h"],
        ["30-34", "0-7 days", "18 mg/kg", "Q36h"],
        ["30-34", "≥8 days", "15 mg/kg", "Q24h"],
        ["≥35", "All", "15 mg/kg", "Q24h"]
      ]
    },
    max: "1.5 g/day; 30 mg/kg/day (CF)",
    indication: "Serious gram-negative infections, Pseudomonas, mycobacterial infections (part of multi-drug regimen)",
    contraindications: [
      "Known hypersensitivity to aminoglycosides"
    ],
    warnings: [
      "Ototoxicity (vestibular and cochlear) - may be irreversible",
      "Nephrotoxicity - usually reversible",
      "Neuromuscular blockade (especially with anesthetics)",
      "Monitor levels and renal function"
    ],
    sideEffects: [
      "Nephrotoxicity (elevated creatinine, decreased GFR)",
      "Ototoxicity (hearing loss, vestibular dysfunction)",
      "Neuromuscular blockade",
      "Rash, fever, eosinophilia"
    ],
    interactions: [
      { drug: "Other nephrotoxins", effect: "Increased nephrotoxicity (NSAIDs, amphotericin, vancomycin)" },
      { drug: "Loop diuretics", effect: "Increased ototoxicity" },
      { drug: "Neuromuscular blockers", effect: "Enhanced blockade" },
      { drug: "Penicillins", effect: "Synergistic activity but may inactivate in vitro if mixed" }
    ],
    notes: "Draw trough just before dose. Draw peak 30 min after end of 30-min infusion. Therapeutic levels: Trough <5 mcg/mL (once daily) or <8 mcg/mL (traditional); Peak 25-35 mcg/mL (once daily) or 20-30 mcg/mL (traditional).",
    renalAdjust: {
      gfr50: "Q12-18h",
      gfr30: "Q24h",
      gfr10: "Q48-72h",
      hd: "Give after HD, redose per levels"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // AMIODARONE
  // ============================================================================
  {
    id: "amiodarone",
    name: "Amiodarone (Cordarone, Pacerone)",
    category: "Antiarrhythmic (Class III)",
    route: "IV/PO",
    formulations: [
      { type: "Tablets", strengths: "100 mg, 200 mg, 400 mg" },
      { type: "Oral suspension", strengths: "Compounded" },
      { type: "IV", strengths: "50 mg/mL (3 mL, 9 mL, 18 mL)" }
    ],
    doses: {
      // Cardiac arrest
      arrestChild: { label: "VF/pVT Arrest (Peds)", value: "5", unit: "mg/kg IV/IO bolus", maxDose: 300 },
      arrestAdult: { label: "VF/pVT Arrest (Adult)", value: "300", unit: "mg IV bolus, then 150 mg x1", isFixed: true },
      // Perfusing tachyarrhythmia
      loadingChild: { label: "Loading (Peds IV)", value: "5", unit: "mg/kg over 20-60 min", maxDose: 300 },
      loadingAdult: { label: "Loading (Adult IV)", value: "150", unit: "mg over 10 min", isFixed: true },
      infusionAdult: { label: "Infusion (Adult)", value: "1", unit: "mg/min x 6h, then 0.5 mg/min x 18h", isFixed: true },
      // Oral
      oralChild: { label: "Oral (Child)", value: "10-15", unit: "mg/kg/day ÷ QD-BID x 7-10 days, then 5 mg/kg/day" },
      oralAdult: { label: "Oral (Adult)", value: "400", unit: "mg TID x 1 week, then 400 mg BID x 1 week, then 200-400 mg QD", isFixed: true }
    },
    max: "300 mg/dose; 15 mg/kg/day (2.2 g/day adult)",
    indication: "VF/pVT, refractory SVT, atrial fibrillation, perfusing VT",
    contraindications: [
      "Cardiogenic shock",
      "Severe sinus node dysfunction",
      "2nd or 3rd degree AV block (without pacemaker)",
      "Known hypersensitivity to iodine"
    ],
    warnings: [
      "Pulmonary toxicity (pneumonitis, fibrosis)",
      "Hepatotoxicity",
      "Thyroid dysfunction (hypo- and hyperthyroidism)",
      "Corneal microdeposits (>90% of patients)",
      "QT prolongation and proarrhythmia",
      "Photosensitivity and blue-gray skin discoloration"
    ],
    sideEffects: [
      "Common: Corneal deposits, photosensitivity, nausea, constipation",
      "Cardiovascular: Bradycardia, hypotension (IV), QT prolongation",
      "Pulmonary: Pneumonitis, pulmonary fibrosis (1-17%)",
      "Thyroid: Hypothyroidism (more common), hyperthyroidism",
      "Hepatic: Elevated LFTs, hepatitis",
      "Neurologic: Tremor, ataxia, peripheral neuropathy"
    ],
    interactions: [
      { drug: "Digoxin", effect: "Increases digoxin levels 2x - reduce digoxin dose 50%" },
      { drug: "Warfarin", effect: "Increases INR significantly - reduce warfarin dose" },
      { drug: "QT-prolonging drugs", effect: "Additive QT prolongation" },
      { drug: "Simvastatin/Lovastatin", effect: "Risk of rhabdomyolysis - use lower statin doses" },
      { drug: "Beta-blockers/CCBs", effect: "Increased bradycardia, AV block" },
      { drug: "Cyclosporine", effect: "Increased cyclosporine levels" }
    ],
    notes: "Contains iodine (75 mg/200 mg tablet). Very long half-life (40-55 days). Monitor TFTs, LFTs, CXR, PFTs, ophthalmology. Baseline ECG and periodic monitoring. Use through central line if possible (peripheral may cause phlebitis). Proposed therapeutic level: 1-2.5 mcg/mL.",
    renalAdjust: null,
    hepaticAdjust: "Use with caution; monitor LFTs closely"
  },

  // ============================================================================
  // AMOXICILLIN
  // ============================================================================
  {
    id: "amoxicillin",
    name: "Amoxicillin (Amoxil)",
    category: "Antibiotic (Aminopenicillin)",
    route: "PO",
    formulations: [
      { type: "Capsules", strengths: "250 mg, 500 mg" },
      { type: "Tablets", strengths: "500 mg, 875 mg" },
      { type: "Chewable tablets", strengths: "125 mg, 250 mg" },
      { type: "Suspension", strengths: "125 mg/5 mL, 200 mg/5 mL, 250 mg/5 mL, 400 mg/5 mL" }
    ],
    doses: {
      // Neonatal
      neonatal: { label: "Neonate", value: "20-30", unit: "mg/kg/day ÷ Q12h" },
      // Standard dose
      standard: { label: "Standard (Mild/Moderate)", value: "25-50", unit: "mg/kg/day ÷ Q8h or Q12h" },
      // High dose
      highDose: { label: "High Dose (AOM, CAP, resistant S. pneumo)", value: "80-90", unit: "mg/kg/day ÷ Q12h" },
      // Strep pharyngitis
      strepPharyng: { label: "Strep Pharyngitis", value: "50", unit: "mg/kg/day QD or ÷ BID x 10 days", maxDose: 1000 },
      // Adult
      adultMild: { label: "Adult (mild/moderate)", value: "500", unit: "mg Q8h or 875 mg Q12h", isFixed: true },
      adultSevere: { label: "Adult (severe)", value: "875", unit: "mg Q8h", isFixed: true },
      // H. pylori
      hPylori: { label: "H. pylori", value: "50", unit: "mg/kg/day ÷ BID (with PPI + clarithromycin)" },
      // Endocarditis prophylaxis
      sbeProphylaxis: { label: "SBE Prophylaxis", value: "50", unit: "mg/kg PO 1 hour before procedure", maxDose: 2000 }
    },
    max: "3 g/day (standard); Higher for specific indications",
    indication: "Otitis media, strep pharyngitis, sinusitis, CAP, UTI, H. pylori (part of regimen), SBE prophylaxis",
    contraindications: [
      "Known penicillin/cephalosporin hypersensitivity (anaphylaxis)"
    ],
    warnings: [
      "Cross-reactivity with cephalosporins (~1%)",
      "Maculopapular rash with EBV infection (not true allergy)",
      "Clostridium difficile-associated diarrhea",
      "Prolonged use may cause superinfection"
    ],
    sideEffects: [
      "Common: Diarrhea, nausea, vomiting, rash",
      "Less common: Hypersensitivity reactions",
      "Rare: Anaphylaxis, seizures (high doses), interstitial nephritis"
    ],
    interactions: [
      { drug: "Probenecid", effect: "Increases amoxicillin levels" },
      { drug: "Warfarin", effect: "May increase INR" },
      { drug: "Methotrexate", effect: "Increased methotrexate toxicity" },
      { drug: "Allopurinol", effect: "Increased rash risk" }
    ],
    notes: "Can be taken with or without food. High-dose regimen (80-90 mg/kg/day) recommended for AOM and CAP in areas with resistant S. pneumoniae. Amoxicillin has better oral absorption than ampicillin.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "Q8-12h interval",
      gfr10: "Q24h interval",
      hd: "Give after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // AMOXICILLIN-CLAVULANATE (Augmentin)
  // ============================================================================
  {
    id: "augmentin",
    name: "Amoxicillin-Clavulanate (Augmentin)",
    category: "Antibiotic (Aminopenicillin + β-lactamase inhibitor)",
    route: "PO/IV",
    formulations: [
      { type: "Tablets", strengths: "250/125, 500/125, 875/125 mg" },
      { type: "Chewable", strengths: "200/28.5, 400/57 mg (contain phenylalanine)" },
      { type: "Suspension 200/28.5", strengths: "200 mg/28.5 mg per 5 mL" },
      { type: "Suspension 400/57", strengths: "400 mg/57 mg per 5 mL" },
      { type: "Suspension ES-600", strengths: "600 mg/42.9 mg per 5 mL" },
      { type: "XR tablets", strengths: "1000/62.5 mg" },
      { type: "IV", strengths: "500/100, 1000/200 mg" }
    ],
    doses: {
      // Standard dosing (based on amoxicillin component)
      infantUnder3mo: { label: "Infant <3 mo", value: "30", unit: "mg/kg/day ÷ Q12h (use 125/31.25 suspension)" },
      childLowDose: { label: "Child Low Dose (mild)", value: "25-45", unit: "mg/kg/day ÷ Q12h" },
      childHighDose: { label: "Child High Dose (ES-600)", value: "90", unit: "mg/kg/day ÷ Q12h", maxDose: 3000 },
      adultMild: { label: "Adult (mild/moderate)", value: "500/125", unit: "mg Q8h or 875/125 mg Q12h", isFixed: true },
      adultSevere: { label: "Adult (severe)", value: "875/125", unit: "mg Q8h", isFixed: true },
      // IV
      ivChild: { label: "IV (Child)", value: "100", unit: "mg/kg/day (amox component) ÷ Q6-8h" },
      ivAdult: { label: "IV (Adult)", value: "1000/200", unit: "mg Q6-8h", isFixed: true }
    },
    dosingTable: {
      title: "Augmentin Suspension Selection Guide",
      columns: ["Formulation", "Amox:Clav Ratio", "Best For"],
      rows: [
        ["125/31.25 (4:1)", "4:1", "TID dosing, infant <3mo"],
        ["200/28.5 (7:1)", "7:1", "BID dosing, lower dose"],
        ["400/57 (7:1)", "7:1", "BID dosing, standard"],
        ["ES-600 (14:1)", "14:1", "BID high-dose, resistant organisms"]
      ]
    },
    max: "3 g amoxicillin/day; ES: max 3 g/day",
    indication: "AOM, sinusitis, bite wounds (human/animal), skin infections, respiratory infections with β-lactamase producers",
    contraindications: [
      "Penicillin hypersensitivity (anaphylaxis)",
      "History of cholestatic jaundice/hepatic dysfunction with amox-clav"
    ],
    warnings: [
      "Higher clavulanate = more GI side effects",
      "Do not substitute 250 mg tablets for 500 mg XR (different clav content)",
      "Monitor for C. difficile colitis",
      "Hepatic reactions (usually cholestatic) may occur"
    ],
    sideEffects: [
      "Common: Diarrhea (more than amoxicillin alone), nausea",
      "Less common: Rash, vaginitis",
      "Rare: Hepatitis (cholestatic), hypersensitivity"
    ],
    interactions: [
      { drug: "Probenecid", effect: "Increases amoxicillin levels" },
      { drug: "Warfarin", effect: "May increase INR" },
      { drug: "Allopurinol", effect: "Increased rash risk" },
      { drug: "Methotrexate", effect: "Increased methotrexate toxicity" }
    ],
    notes: "BID dosing (200/28.5, 400/57, ES-600) associated with less diarrhea than TID (125/31.25). ES-600 (90 mg/kg/day) for resistant S. pneumoniae. Take with food to reduce GI upset. Clavulanate extends spectrum to β-lactamase producers (H. flu, Moraxella, S. aureus).",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "500/125 Q12h (avoid 875)",
      gfr10: "500/125 Q24h",
      hd: "500/125 Q24h + extra dose after HD"
    },
    hepaticAdjust: "Use with caution; avoid if prior hepatic reaction"
  },

  // ============================================================================
  // AMPICILLIN
  // ============================================================================
  {
    id: "ampicillin",
    name: "Ampicillin",
    category: "Antibiotic (Aminopenicillin)",
    route: "IV/IM/PO",
    formulations: [
      { type: "IV/IM", strengths: "125 mg, 250 mg, 500 mg, 1 g, 2 g vials" },
      { type: "Capsules", strengths: "250 mg, 500 mg" },
      { type: "Suspension", strengths: "125 mg/5 mL, 250 mg/5 mL" }
    ],
    doses: {
      neoMild: { label: "Neonate (mild/moderate)", value: "50-100", unit: "mg/kg/day ÷ Q6-12h" },
      neoSevere: { label: "Neonate (severe/meningitis)", value: "200-300", unit: "mg/kg/day ÷ Q6-8h" },
      childMild: { label: "Child (mild/moderate)", value: "100-200", unit: "mg/kg/day ÷ Q6h" },
      childSevere: { label: "Child (severe)", value: "200-400", unit: "mg/kg/day ÷ Q4-6h" },
      meningitis: { label: "Meningitis", value: "300-400", unit: "mg/kg/day ÷ Q4-6h", maxDose: 12000 },
      endocarditis: { label: "Endocarditis", value: "200-300", unit: "mg/kg/day ÷ Q4-6h" },
      sbeProphylaxis: { label: "SBE Prophylaxis (IV)", value: "50", unit: "mg/kg IV 30-60 min before procedure", maxDose: 2000 }
    },
    dosingTable: {
      title: "Neonatal Ampicillin Dosing",
      columns: ["PMA (weeks)", "Postnatal Age", "Dose", "Interval"],
      rows: [
        ["≤29", "0-28 days", "50 mg/kg", "Q12h"],
        ["≤29", ">28 days", "75 mg/kg", "Q8h"],
        ["30-36", "0-14 days", "50 mg/kg", "Q12h"],
        ["30-36", ">14 days", "75 mg/kg", "Q8h"],
        ["37-44", "0-7 days", "50 mg/kg", "Q8h"],
        ["37-44", ">7 days", "75 mg/kg", "Q6h"],
        ["≥45", "All", "50 mg/kg", "Q6h"]
      ]
    },
    max: "12 g/day",
    indication: "GBS prophylaxis, Listeria, Enterococcus, meningitis, endocarditis, SBE prophylaxis",
    contraindications: ["Penicillin hypersensitivity (anaphylaxis)"],
    warnings: [
      "Maculopapular rash with EBV/CMV infection",
      "Cross-reactivity with cephalosporins",
      "C. difficile-associated diarrhea"
    ],
    sideEffects: [
      "Common: Diarrhea, rash, nausea",
      "Less common: Hypersensitivity reactions",
      "Rare: Anaphylaxis, seizures (high dose), interstitial nephritis"
    ],
    interactions: [
      { drug: "Probenecid", effect: "Increases ampicillin levels" },
      { drug: "Warfarin", effect: "May increase INR" },
      { drug: "Methotrexate", effect: "Increased toxicity" },
      { drug: "Allopurinol", effect: "Increased rash risk" }
    ],
    notes: "Poor oral bioavailability (30-55%); use amoxicillin for PO. IV preferred for serious infections. Active against Enterococcus (not VRE), Listeria, GBS, some E. coli.",
    renalAdjust: {
      gfr50: "Q6-8h",
      gfr30: "Q8-12h",
      gfr10: "Q12-24h",
      hd: "Give after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // AMPICILLIN-SULBACTAM (Unasyn)
  // ============================================================================
  {
    id: "ampicillinsulbactam",
    name: "Ampicillin-Sulbactam (Unasyn)",
    category: "Antibiotic (Aminopenicillin + β-lactamase inhibitor)",
    route: "IV/IM",
    formulations: [
      { type: "IV/IM", strengths: "1.5 g (1 g amp + 0.5 g sulb), 3 g (2 g amp + 1 g sulb)" }
    ],
    doses: {
      infantChild: { label: "Infant/Child", value: "100-200", unit: "mg ampicillin/kg/day ÷ Q6h" },
      severe: { label: "Severe Infection", value: "200-400", unit: "mg ampicillin/kg/day ÷ Q6h" },
      epiglottitis: { label: "Epiglottitis", value: "200-400", unit: "mg ampicillin/kg/day ÷ Q6h" },
      adultMild: { label: "Adult (mild/moderate)", value: "1.5-3", unit: "g Q6h", isFixed: true },
      adultSevere: { label: "Adult (severe)", value: "3", unit: "g Q6h", isFixed: true }
    },
    max: "8 g ampicillin/day (12 g Unasyn/day)",
    indication: "Intra-abdominal infections, gynecologic infections, skin/soft tissue, aspiration pneumonia, bite wounds",
    contraindications: ["Penicillin hypersensitivity (anaphylaxis)"],
    warnings: [
      "Cross-reactivity with cephalosporins",
      "C. difficile-associated diarrhea",
      "High sodium content"
    ],
    sideEffects: [
      "Common: Diarrhea, rash, injection site pain",
      "Less common: Elevated LFTs, thrombophlebitis",
      "Rare: Anaphylaxis, seizures"
    ],
    interactions: [
      { drug: "Probenecid", effect: "Increases ampicillin levels" },
      { drug: "Warfarin", effect: "May increase INR" },
      { drug: "Methotrexate", effect: "Increased toxicity" }
    ],
    notes: "2:1 ratio of ampicillin:sulbactam. Sulbactam extends spectrum to β-lactamase producers. Active against Acinetobacter (sulbactam component). Not for MRSA or Pseudomonas.",
    renalAdjust: {
      gfr50: "Q6-8h",
      gfr30: "Q8-12h",
      gfr10: "Q24h",
      hd: "Give after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // ASPIRIN (Acetylsalicylic Acid)
  // ============================================================================
  {
    id: "aspirin",
    name: "Aspirin (Acetylsalicylic Acid)",
    category: "NSAID/Antiplatelet",
    route: "PO/PR",
    formulations: [
      { type: "Tablets", strengths: "81 mg, 325 mg, 500 mg, 650 mg" },
      { type: "Chewable", strengths: "81 mg" },
      { type: "EC tablets", strengths: "81 mg, 325 mg, 500 mg" },
      { type: "Suppository", strengths: "300 mg, 600 mg" }
    ],
    doses: {
      antiplatelet: { label: "Antiplatelet", value: "1-5", unit: "mg/kg/day QD", maxDose: 325 },
      kawasaki: { label: "Kawasaki (acute)", value: "80-100", unit: "mg/kg/day ÷ Q6h until afebrile 48-72h" },
      kawasakiMaint: { label: "Kawasaki (maintenance)", value: "3-5", unit: "mg/kg/day QD x 6-8 weeks" },
      antiinflammatory: { label: "Anti-inflammatory", value: "60-100", unit: "mg/kg/day ÷ Q6-8h" },
      rheumaticFever: { label: "Rheumatic Fever", value: "100", unit: "mg/kg/day ÷ Q6h x 2 wks, then 75 mg/kg/day x 4-6 wks" }
    },
    max: "4 g/day (anti-inflammatory); 325 mg/day (antiplatelet)",
    indication: "Kawasaki disease, antiplatelet therapy, rheumatic fever, juvenile arthritis",
    contraindications: [
      "Children <16 years with viral illness (Reye syndrome risk)",
      "Active peptic ulcer disease",
      "Severe hepatic impairment",
      "Aspirin-sensitive asthma",
      "Third trimester pregnancy"
    ],
    warnings: [
      "⚠️ REYE SYNDROME RISK in children with viral illness (flu, chickenpox)",
      "GI bleeding risk",
      "Platelet dysfunction - hold 7-10 days before surgery",
      "Tinnitus may indicate toxicity"
    ],
    sideEffects: [
      "Common: GI upset, nausea, heartburn",
      "Less common: GI bleeding, tinnitus, hearing loss",
      "Rare: Reye syndrome, bronchospasm, anaphylaxis"
    ],
    interactions: [
      { drug: "Warfarin/anticoagulants", effect: "Increased bleeding risk" },
      { drug: "NSAIDs", effect: "Increased GI bleeding; may reduce cardioprotection" },
      { drug: "Methotrexate", effect: "Increased methotrexate toxicity" },
      { drug: "ACE inhibitors", effect: "Reduced antihypertensive effect" },
      { drug: "Valproic acid", effect: "Increased valproic acid levels" }
    ],
    notes: "NOT recommended for fever/pain in children due to Reye syndrome risk. Exception: Kawasaki disease and rheumatic fever. Therapeutic salicylate level: 15-30 mg/dL (anti-inflammatory). Tinnitus occurs at levels >20 mg/dL.",
    renalAdjust: {
      gfr50: "Use with caution",
      gfr30: "Avoid if possible",
      gfr10: "Avoid",
      hd: "Avoid"
    },
    hepaticAdjust: "Avoid in severe impairment"
  },

  // ============================================================================
  // ATROPINE
  // ============================================================================
  {
    id: "atropine",
    name: "Atropine",
    category: "Anticholinergic",
    route: "IV/IO/IM/ETT/Ophthalmic",
    formulations: [
      { type: "IV/IM", strengths: "0.05 mg/mL, 0.1 mg/mL, 0.4 mg/mL, 1 mg/mL" },
      { type: "Ophthalmic", strengths: "0.5%, 1%, 2%" },
      { type: "Autoinjector (AtroPen)", strengths: "0.25 mg, 0.5 mg, 1 mg, 2 mg" }
    ],
    doses: {
      bradycardia: { label: "Bradycardia", value: "0.02", unit: "mg/kg/dose IV/IO", minDose: 0.1, maxDose: 0.5 },
      bradycardiaAdult: { label: "Bradycardia (Adult)", value: "0.5-1", unit: "mg IV Q3-5min", isFixed: true, maxDose: 3 },
      preintubation: { label: "Preintubation", value: "0.01-0.02", unit: "mg/kg IV", minDose: 0.1, maxDose: 0.5 },
      organophosphate: { label: "Organophosphate/Nerve Agent", value: "0.02-0.05", unit: "mg/kg IV Q5-10min until secretions dry" },
      ettDose: { label: "ETT Dose", value: "0.04-0.06", unit: "mg/kg (2-3x IV dose)" },
      ophthCycloplegia: { label: "Cycloplegia (Ophth)", value: "1 drop", unit: "of 0.5-1% solution BID-TID x 1-3 days", isFixed: true }
    },
    dosingTable: {
      title: "Atropine Autoinjector (AtroPen) for Nerve Agent Exposure",
      columns: ["Weight", "Mild Symptoms", "Severe Symptoms"],
      rows: [
        ["<7 kg (infants)", "0.25 mg x 1", "0.25 mg x 3"],
        ["7-18 kg (young child)", "0.5 mg x 1", "0.5 mg x 3"],
        ["18-41 kg (older child)", "1 mg x 1", "1 mg x 3"],
        [">41 kg (adolescent/adult)", "2 mg x 1", "2 mg x 3"]
      ]
    },
    max: "0.5 mg/dose (child); 1 mg/dose (adolescent); 3 mg total (adult)",
    indication: "Symptomatic bradycardia, preintubation (prevents vagal reflex), organophosphate/nerve agent poisoning, cycloplegic refraction",
    contraindications: [
      "Tachyarrhythmias",
      "Thyrotoxicosis",
      "Acute hemorrhage with cardiovascular instability",
      "Narrow-angle glaucoma (ophthalmic)"
    ],
    warnings: [
      "Minimum dose 0.1 mg (lower doses may cause paradoxical bradycardia)",
      "Use with caution in coronary artery disease",
      "May precipitate acute glaucoma",
      "Avoid in myasthenia gravis"
    ],
    sideEffects: [
      "Common: Dry mouth, blurred vision, tachycardia, urinary retention",
      "CNS: Confusion, hallucinations (especially elderly)",
      "Ophthalmic: Photophobia, increased IOP"
    ],
    interactions: [
      { drug: "Other anticholinergics", effect: "Additive anticholinergic effects" },
      { drug: "Potassium chloride", effect: "Increased GI ulceration risk" },
      { drug: "Digoxin", effect: "Increased digoxin absorption" }
    ],
    notes: "For bradycardia: may repeat Q5min (max 3 doses). ETT route: dilute with NS, follow with positive pressure ventilations. Pralidoxime (2-PAM) also needed for organophosphate poisoning. Half-life: 2-3 hours.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // AZITHROMYCIN (Zithromax)
  // ============================================================================
  {
    id: "azithromycin",
    name: "Azithromycin (Zithromax)",
    category: "Antibiotic (Macrolide)",
    route: "PO/IV",
    formulations: [
      { type: "Tablets", strengths: "250 mg, 500 mg, 600 mg" },
      { type: "Suspension", strengths: "100 mg/5 mL, 200 mg/5 mL" },
      { type: "Zmax (ER suspension)", strengths: "2 g single dose" },
      { type: "IV", strengths: "500 mg vial" }
    ],
    doses: {
      // Otitis media
      aom: { label: "Otitis Media", value: "10", unit: "mg/kg day 1 (max 500mg), then 5 mg/kg/day x 4 days (max 250mg)" },
      aomOneDose: { label: "AOM (single dose)", value: "30", unit: "mg/kg x 1 dose", maxDose: 1500 },
      // Pharyngitis
      pharyngitis: { label: "Strep Pharyngitis", value: "12", unit: "mg/kg/day QD x 5 days", maxDose: 500 },
      // Community-acquired pneumonia
      capChild: { label: "CAP (Child)", value: "10", unit: "mg/kg day 1, then 5 mg/kg/day x 4 days" },
      capAdult: { label: "CAP (Adult)", value: "500", unit: "mg day 1, then 250 mg/day x 4 days OR 500 mg QD x 3 days", isFixed: true },
      // Pertussis
      pertussis: { label: "Pertussis", value: "10", unit: "mg/kg day 1 (max 500), then 5 mg/kg/day x 4 days (max 250)" },
      pertussisInfant: { label: "Pertussis (<6 mo)", value: "10", unit: "mg/kg/day QD x 5 days" },
      // MAC prophylaxis
      macProphylaxis: { label: "MAC Prophylaxis", value: "20", unit: "mg/kg/week (max 1200mg)", maxDose: 1200 },
      // Chlamydia
      chlamydia: { label: "Chlamydia (≥45kg)", value: "1", unit: "g x 1 dose", isFixed: true },
      chlamydiaChild: { label: "Chlamydia (<45kg)", value: "20", unit: "mg/kg x 1 dose", maxDose: 1000 },
      // IV
      ivAdult: { label: "IV (Adult)", value: "500", unit: "mg QD x 2 days, then PO", isFixed: true }
    },
    max: "500 mg/day (most indications); 1.5 g single dose (AOM)",
    indication: "AOM, CAP (atypical coverage), pharyngitis (PCN allergic), pertussis, Chlamydia, MAC prophylaxis/treatment",
    contraindications: [
      "History of cholestatic jaundice with azithromycin",
      "Hypersensitivity to macrolides"
    ],
    warnings: [
      "QT prolongation - avoid with other QT-prolonging drugs",
      "Hepatotoxicity (rare but can be severe)",
      "May worsen myasthenia gravis",
      "Infantile hypertrophic pyloric stenosis risk in neonates"
    ],
    sideEffects: [
      "Common: Diarrhea, nausea, abdominal pain",
      "Less common: Headache, dizziness, rash",
      "Rare: QT prolongation, hepatotoxicity, Stevens-Johnson syndrome"
    ],
    interactions: [
      { drug: "QT-prolonging drugs", effect: "Additive QT prolongation" },
      { drug: "Nelfinavir", effect: "Increased azithromycin levels" },
      { drug: "Warfarin", effect: "May increase INR" },
      { drug: "Digoxin", effect: "May increase digoxin levels" }
    ],
    notes: "Long tissue half-life (68 hours) allows short courses. Less drug interactions than erythromycin/clarithromycin. Can be taken with or without food. IV over 1-3 hours (not bolus).",
    renalAdjust: null,
    hepaticAdjust: "Use with caution in severe hepatic impairment"
  },

  // ============================================================================
  // BUDESONIDE (Pulmicort)
  // ============================================================================
  {
    id: "budesonide",
    name: "Budesonide (Pulmicort, Entocort)",
    category: "Corticosteroid (Inhaled/Oral)",
    route: "Inhaled/PO",
    formulations: [
      { type: "Nebulizer (Respules)", strengths: "0.25 mg/2mL, 0.5 mg/2mL, 1 mg/2mL" },
      { type: "DPI (Flexhaler)", strengths: "90 mcg, 180 mcg per actuation" },
      { type: "Oral capsules (Entocort)", strengths: "3 mg" }
    ],
    doses: {
      // Croup (age-based, not weight-based)
      croup: { label: "Croup", value: "2", unit: "mg nebulized x 1-2 doses", isFixed: true },
      // Asthma - Nebulizer
      asthmaLowNeb: { label: "Asthma Low Dose (Neb)", value: "0.25-0.5", unit: "mg QD-BID", isFixed: true },
      asthmaMedNeb: { label: "Asthma Medium Dose (Neb)", value: "0.5-1", unit: "mg BID", isFixed: true },
      asthmaHighNeb: { label: "Asthma High Dose (Neb)", value: "1", unit: "mg BID", isFixed: true },
      // Asthma - DPI (age-based)
      asthmaDPI6to11: { label: "DPI (6-11 yr)", value: "180-360", unit: "mcg BID", isFixed: true },
      asthmaDPI12plus: { label: "DPI (≥12 yr)", value: "360-720", unit: "mcg BID", isFixed: true },
      // Crohn's disease (age-based)
      crohns: { label: "Crohn's (Entocort)", value: "9", unit: "mg QD x 8 weeks, then taper", isFixed: true }
    },
    dosingTable: {
      title: "Budesonide Inhaled - Age-Based Dosing",
      columns: ["Age", "Low Dose", "Medium Dose", "High Dose"],
      rows: [
        ["0-4 yr (Neb)", "0.25-0.5 mg/day", "0.5-1 mg/day", ">1 mg/day"],
        ["5-11 yr (Neb)", "0.5 mg/day", "1 mg/day", "2 mg/day"],
        ["6-11 yr (DPI)", "180-360 mcg/day", "360-720 mcg/day", ">720 mcg/day"],
        ["≥12 yr (DPI)", "180-360 mcg/day", "360-720 mcg/day", ">720 mcg/day"]
      ]
    },
    max: "2 mg/day nebulized; 720 mcg/day DPI",
    indication: "Asthma (maintenance), croup, Crohn's disease (ileal/ascending colon)",
    contraindications: [
      "Primary treatment of status asthmaticus",
      "Hypersensitivity to budesonide"
    ],
    warnings: [
      "Not for acute bronchospasm",
      "May cause growth suppression in children",
      "Risk of adrenal suppression with high doses",
      "Oral candidiasis - rinse mouth after use"
    ],
    sideEffects: [
      "Common: Oral candidiasis, dysphonia, cough",
      "Less common: Headache, respiratory infection",
      "Long-term: Growth suppression, adrenal suppression, osteoporosis"
    ],
    interactions: [
      { drug: "CYP3A4 inhibitors (ketoconazole)", effect: "Increased budesonide levels" },
      { drug: "Grapefruit juice", effect: "Increased oral budesonide levels" }
    ],
    notes: "For croup: 2 mg nebulized is standard regardless of weight. Rinse mouth after inhaled use. Flexhaler is breath-activated DPI. Entocort has high first-pass metabolism (90%) so less systemic effects.",
    renalAdjust: null,
    hepaticAdjust: "Oral (Entocort): Use with caution in moderate-severe impairment"
  },

  // ============================================================================
  // CAFFEINE CITRATE
  // ============================================================================
  {
    id: "caffeinecitrate",
    name: "Caffeine Citrate (Cafcit)",
    category: "CNS Stimulant",
    route: "IV/PO",
    formulations: [
      { type: "IV/PO solution", strengths: "20 mg/mL (10 mg/mL caffeine base)" }
    ],
    doses: {
      loading: { label: "Loading Dose", value: "20", unit: "mg/kg IV/PO (as caffeine citrate)" },
      maintenance: { label: "Maintenance", value: "5-10", unit: "mg/kg/day QD (as caffeine citrate)" }
    },
    max: "20 mg/kg loading; 10 mg/kg/day maintenance",
    indication: "Apnea of prematurity",
    contraindications: [
      "Hypersensitivity to caffeine or xanthines"
    ],
    warnings: [
      "May increase heart rate",
      "Monitor for tachycardia, agitation, feeding intolerance",
      "Necrotizing enterocolitis risk (controversial)"
    ],
    sideEffects: [
      "Common: Tachycardia, irritability, feeding intolerance",
      "Less common: Jitteriness, hyperglycemia",
      "Rare: Seizures (toxicity)"
    ],
    interactions: [
      { drug: "Phenobarbital", effect: "Increased caffeine clearance" },
      { drug: "Theophylline", effect: "Additive effects (caffeine converted to theophylline)" },
      { drug: "CYP1A2 inhibitors (cimetidine)", effect: "Decreased caffeine clearance" }
    ],
    notes: "Caffeine citrate = 2x caffeine base (20 mg citrate = 10 mg base). Therapeutic level: 5-25 mcg/mL. Can use until 34-36 weeks PMA. Loading dose over 30 min IV.",
    renalAdjust: null,
    hepaticAdjust: "Use with caution; may need lower maintenance dose"
  },

  // ============================================================================
  // CALCIUM GLUCONATE
  // ============================================================================
  {
    id: "calciumgluconate",
    name: "Calcium Gluconate",
    category: "Electrolyte",
    route: "IV/PO",
    formulations: [
      { type: "IV", strengths: "10% solution (100 mg/mL = 9.3 mg elemental Ca/mL)" },
      { type: "Tablets", strengths: "500 mg, 650 mg, 975 mg" }
    ],
    doses: {
      hypocalcemiaIVNeonate: { label: "Hypocalcemia (Neonate IV)", value: "100-200", unit: "mg/kg/dose slow IV push" },
      hypocalcemiaIVChild: { label: "Hypocalcemia (Child IV)", value: "50-100", unit: "mg/kg/dose slow IV push", maxDose: 2000 },
      hypocalcemiaInfusion: { label: "Continuous Infusion", value: "200-500", unit: "mg/kg/day" },
      cardiacArrest: { label: "Cardiac Arrest (Hyperkalemia, HypoCa, CaCB OD)", value: "60-100", unit: "mg/kg IV slow push", maxDose: 3000 },
      hyperkalemia: { label: "Hyperkalemia (cardioprotection)", value: "50-100", unit: "mg/kg IV over 5-10 min" },
      hypocalcemiaPO: { label: "PO Supplementation", value: "45-65", unit: "mg elemental Ca/kg/day ÷ Q6h" },
      hypermagnesemia: { label: "Hypermagnesemia", value: "100-200", unit: "mg/kg IV over 5-10 min" }
    },
    dosingTable: {
      title: "Calcium Preparations Comparison",
      columns: ["Preparation", "Elemental Ca", "mEq Ca/mL", "10 mL contains"],
      rows: [
        ["Calcium Gluconate 10%", "9.3 mg/mL", "0.46 mEq/mL", "93 mg (4.6 mEq)"],
        ["Calcium Chloride 10%", "27.2 mg/mL", "1.36 mEq/mL", "272 mg (13.6 mEq)"]
      ]
    },
    max: "2-3 g/dose; 1 mL/min IV push rate",
    indication: "Hypocalcemia, hyperkalemia (cardioprotection), calcium channel blocker overdose, hypomagnesemia (refractory)",
    contraindications: [
      "Hypercalcemia",
      "Ventricular fibrillation",
      "Digitalis toxicity (relative)"
    ],
    warnings: [
      "Extravasation causes tissue necrosis",
      "Rapid IV can cause bradycardia, hypotension, cardiac arrest",
      "Do not mix with bicarbonate (precipitates)",
      "Use with caution if on digoxin"
    ],
    sideEffects: [
      "IV: Bradycardia, hypotension (rapid infusion), flushing",
      "Local: Tissue necrosis with extravasation",
      "PO: Constipation, GI upset"
    ],
    interactions: [
      { drug: "Digoxin", effect: "Increased digoxin toxicity with hypercalcemia" },
      { drug: "Sodium bicarbonate", effect: "Forms precipitate - do not mix" },
      { drug: "Ceftriaxone", effect: "Precipitates - do not co-infuse (especially neonates)" },
      { drug: "Thiazide diuretics", effect: "May cause hypercalcemia" }
    ],
    notes: "Calcium gluconate preferred over calcium chloride peripherally (less tissue damage). Central line: either can be used. For hyperkalemia: provides cardiac membrane stabilization but does not lower K+. 1 g calcium gluconate = 93 mg elemental calcium.",
    renalAdjust: "Use with caution; monitor calcium levels",
    hepaticAdjust: null
  },

  // ============================================================================
  // CARVEDILOL
  // ============================================================================
  {
    id: "carvedilol",
    name: "Carvedilol (Coreg)",
    category: "Beta-blocker (α1/β1/β2)",
    route: "PO",
    formulations: [
      { type: "Tablets", strengths: "3.125 mg, 6.25 mg, 12.5 mg, 25 mg" },
      { type: "ER capsules", strengths: "10 mg, 20 mg, 40 mg, 80 mg" },
      { type: "Oral suspension", strengths: "Compounded 1.67 mg/mL" }
    ],
    doses: {
      heartFailure: { label: "Heart Failure", value: "0.05-0.1", unit: "mg/kg/dose BID, titrate to 0.4 mg/kg/dose BID", maxDose: 25 },
      hypertension: { label: "Hypertension", value: "0.1", unit: "mg/kg/dose BID, titrate to max 0.5 mg/kg/dose BID" },
      adultHF: { label: "Adult HF", value: "3.125", unit: "mg BID, titrate to 25-50 mg BID", isFixed: true }
    },
    max: "50 mg BID (adult); 0.5 mg/kg/dose BID (pediatric)",
    indication: "Heart failure, hypertension, post-MI",
    contraindications: [
      "Decompensated heart failure requiring IV inotropes",
      "Severe bradycardia, heart block (2nd/3rd degree)",
      "Cardiogenic shock",
      "Severe hepatic impairment",
      "Bronchial asthma or COPD with bronchospasm"
    ],
    warnings: [
      "Do not stop abruptly (rebound tachycardia)",
      "May mask hypoglycemia symptoms",
      "Bradycardia, hypotension with initiation",
      "Worsening HF may occur initially"
    ],
    sideEffects: [
      "Common: Dizziness, fatigue, hypotension, bradycardia",
      "Less common: Weight gain, diarrhea, hyperglycemia",
      "Rare: Bronchospasm, AV block"
    ],
    interactions: [
      { drug: "Digoxin", effect: "Increased digoxin levels" },
      { drug: "Insulin/oral hypoglycemics", effect: "May mask hypoglycemia symptoms" },
      { drug: "Clonidine", effect: "Rebound hypertension if clonidine stopped" },
      { drug: "CYP2D6 inhibitors", effect: "Increased carvedilol levels" }
    ],
    notes: "Start low and titrate slowly (double dose Q2 weeks). Take with food. Has α-blocking (vasodilation) and β-blocking properties. Better tolerated than metoprolol in some HF patients.",
    renalAdjust: null,
    hepaticAdjust: "Contraindicated in severe hepatic impairment"
  },

  // ============================================================================
  // CEFAZOLIN (Ancef)
  // ============================================================================
  {
    id: "cefazolin",
    name: "Cefazolin (Ancef, Kefzol)",
    category: "Antibiotic (1st gen Cephalosporin)",
    route: "IV/IM",
    formulations: [
      { type: "IV/IM", strengths: "500 mg, 1 g, 2 g vials" }
    ],
    doses: {
      neonatal: { label: "Neonate", value: "25", unit: "mg/kg/dose Q8-12h" },
      mildModerate: { label: "Mild/Moderate Infection", value: "25-50", unit: "mg/kg/day ÷ Q8h" },
      severe: { label: "Severe Infection", value: "100", unit: "mg/kg/day ÷ Q6-8h", maxDose: 6000 },
      surgicalProphylaxis: { label: "Surgical Prophylaxis", value: "30", unit: "mg/kg IV within 60 min of incision", maxDose: 2000 },
      adultSurgical: { label: "Adult Surgical Prophylaxis", value: "2", unit: "g IV (3 g if >120 kg)", isFixed: true },
      endocarditis: { label: "Endocarditis (MSSA)", value: "100", unit: "mg/kg/day ÷ Q8h", maxDose: 12000 }
    },
    max: "6 g/day (general); 12 g/day (endocarditis)",
    indication: "Skin/soft tissue infections, surgical prophylaxis, bone/joint infections, MSSA (not MRSA)",
    contraindications: [
      "Severe cephalosporin hypersensitivity (anaphylaxis)"
    ],
    warnings: [
      "Cross-reactivity with penicillins ~1%",
      "C. difficile-associated diarrhea",
      "Dose adjust in renal impairment"
    ],
    sideEffects: [
      "Common: Diarrhea, nausea, rash",
      "Less common: Elevated LFTs, eosinophilia",
      "Rare: Anaphylaxis, seizures, interstitial nephritis"
    ],
    interactions: [
      { drug: "Probenecid", effect: "Increased cefazolin levels" },
      { drug: "Warfarin", effect: "May increase INR" },
      { drug: "Aminoglycosides", effect: "Synergistic but potential nephrotoxicity" }
    ],
    notes: "First-line for surgical prophylaxis. Good MSSA coverage but NOT MRSA. Repeat surgical dose Q4h during prolonged procedures. Does not penetrate CNS well.",
    renalAdjust: {
      gfr50: "Q8h",
      gfr30: "Q12h",
      gfr10: "Q24h",
      hd: "Give after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // CEFEPIME (Maxipime)
  // ============================================================================
  {
    id: "cefepime",
    name: "Cefepime (Maxipime)",
    category: "Antibiotic (4th gen Cephalosporin)",
    route: "IV/IM",
    formulations: [
      { type: "IV/IM", strengths: "500 mg, 1 g, 2 g vials" }
    ],
    doses: {
      febrileNeutropenia: { label: "Febrile Neutropenia", value: "50", unit: "mg/kg/dose Q8h", maxDose: 2000 },
      pneumonia: { label: "Pneumonia (severe)", value: "50", unit: "mg/kg/dose Q8-12h", maxDose: 2000 },
      meningitis: { label: "Meningitis", value: "50", unit: "mg/kg/dose Q8h", maxDose: 2000 },
      uti: { label: "Complicated UTI", value: "50", unit: "mg/kg/dose Q12h", maxDose: 2000 },
      pseudomonas: { label: "Pseudomonas", value: "50", unit: "mg/kg/dose Q8h", maxDose: 2000 },
      adultStandard: { label: "Adult", value: "1-2", unit: "g Q8-12h", isFixed: true }
    },
    max: "6 g/day (2 g/dose)",
    indication: "Febrile neutropenia, hospital-acquired pneumonia, complicated UTI, meningitis, Pseudomonas infections",
    contraindications: [
      "Severe cephalosporin hypersensitivity (anaphylaxis)"
    ],
    warnings: [
      "Neurotoxicity risk (especially in renal impairment) - encephalopathy, seizures",
      "Cross-reactivity with penicillins ~1%",
      "C. difficile-associated diarrhea"
    ],
    sideEffects: [
      "Common: Diarrhea, nausea, rash",
      "Less common: Elevated LFTs, headache",
      "Serious: Encephalopathy, seizures, anaphylaxis"
    ],
    interactions: [
      { drug: "Probenecid", effect: "Increased cefepime levels" },
      { drug: "Aminoglycosides", effect: "Synergistic but may increase nephrotoxicity" },
      { drug: "Loop diuretics", effect: "May increase nephrotoxicity" }
    ],
    notes: "Excellent Pseudomonas coverage. Better CNS penetration than 3rd gen. Extended infusion (3-4 hours) may improve outcomes. Monitor for neurotoxicity especially in renal impairment.",
    renalAdjust: {
      gfr50: "Q12h (or usual dose Q12h)",
      gfr30: "Q24h",
      gfr10: "Q24h with 50% dose reduction",
      hd: "1 g Q24h, give after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // CEFTRIAXONE (Rocephin)
  // ============================================================================
  {
    id: "ceftriaxone",
    name: "Ceftriaxone (Rocephin)",
    category: "Antibiotic (3rd gen Cephalosporin)",
    route: "IV/IM",
    formulations: [
      { type: "IV/IM", strengths: "250 mg, 500 mg, 1 g, 2 g vials" }
    ],
    doses: {
      standard: { label: "Standard", value: "50-75", unit: "mg/kg/day QD or ÷ Q12h", maxDose: 2000 },
      meningitis: { label: "Meningitis", value: "100", unit: "mg/kg/day ÷ Q12h", maxDose: 4000 },
      aom: { label: "Acute Otitis Media", value: "50", unit: "mg/kg IM x 1-3 doses", maxDose: 1000 },
      gonorrhea: { label: "Gonorrhea (uncomplicated)", value: "500", unit: "mg IM x 1 dose", isFixed: true },
      pelvicInflammatory: { label: "PID", value: "250", unit: "mg IM x 1 dose (with doxycycline)", isFixed: true },
      lyme: { label: "Lyme Disease (CNS)", value: "50-75", unit: "mg/kg/day IV x 14-28 days", maxDose: 2000 },
      endocarditis: { label: "Endocarditis", value: "100", unit: "mg/kg/day ÷ Q12h", maxDose: 4000 }
    },
    max: "4 g/day",
    indication: "Meningitis, pneumonia, UTI, gonorrhea, Lyme disease, empiric serious infections",
    contraindications: [
      "⚠️ Neonates <28 days receiving IV calcium",
      "Hyperbilirubinemic neonates (displaces bilirubin)",
      "Severe cephalosporin hypersensitivity"
    ],
    warnings: [
      "FATAL ceftriaxone-calcium precipitates in neonates",
      "Biliary sludge/pseudolithiasis with prolonged use",
      "May cause hemolytic anemia",
      "Avoid in neonates with hyperbilirubinemia"
    ],
    sideEffects: [
      "Common: Diarrhea, rash, eosinophilia",
      "Less common: Biliary sludge, elevated LFTs",
      "Rare: Hemolytic anemia, anaphylaxis, C. diff colitis"
    ],
    interactions: [
      { drug: "Calcium-containing solutions", effect: "⚠️ FATAL precipitates - do not co-administer" },
      { drug: "Warfarin", effect: "May increase INR" },
      { drug: "Ringer's lactate", effect: "Contains calcium - do not use as diluent" }
    ],
    notes: "Once daily dosing due to long half-life (6-9 hours). Can give IM with lidocaine 1% to reduce pain. In neonates >28 days: separate ceftriaxone and calcium infusions by at least 48 hours. Good CSF penetration.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "No change (max 2 g/day)",
      gfr10: "No change (max 2 g/day)",
      hd: "No supplemental dose needed"
    },
    hepaticAdjust: "Use with caution in combined hepatic/renal impairment"
  },

  // ============================================================================
  // CEPHALEXIN (Keflex)
  // ============================================================================
  {
    id: "cephalexin",
    name: "Cephalexin (Keflex)",
    category: "Antibiotic (1st gen Cephalosporin)",
    route: "PO",
    formulations: [
      { type: "Capsules", strengths: "250 mg, 500 mg" },
      { type: "Tablets", strengths: "250 mg, 500 mg" },
      { type: "Suspension", strengths: "125 mg/5 mL, 250 mg/5 mL" }
    ],
    doses: {
      standard: { label: "Standard", value: "25-50", unit: "mg/kg/day ÷ Q6-12h" },
      severe: { label: "Severe/Strep", value: "50-100", unit: "mg/kg/day ÷ Q6-8h", maxDose: 4000 },
      strepPharyngitis: { label: "Strep Pharyngitis", value: "40", unit: "mg/kg/day ÷ BID x 10 days", maxDose: 1000 },
      uti: { label: "UTI Prophylaxis", value: "10-20", unit: "mg/kg/dose QHS" },
      adultStandard: { label: "Adult", value: "250-500", unit: "mg Q6h", isFixed: true }
    },
    max: "4 g/day",
    indication: "Skin/soft tissue infections, strep pharyngitis, UTI, bone infections (MSSA)",
    contraindications: [
      "Severe cephalosporin hypersensitivity (anaphylaxis)"
    ],
    warnings: [
      "Cross-reactivity with penicillins ~1%",
      "C. difficile-associated diarrhea",
      "Adjust dose in renal impairment"
    ],
    sideEffects: [
      "Common: Diarrhea, nausea, abdominal pain",
      "Less common: Rash, headache",
      "Rare: Anaphylaxis, seizures, interstitial nephritis"
    ],
    interactions: [
      { drug: "Probenecid", effect: "Increased cephalexin levels" },
      { drug: "Metformin", effect: "May increase metformin levels" },
      { drug: "Warfarin", effect: "May increase INR" }
    ],
    notes: "Good oral bioavailability. Take with or without food. Good for MSSA, Streptococci. NOT for MRSA, Enterococcus, or most gram-negatives.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "Q8-12h",
      gfr10: "Q12-24h",
      hd: "250-500 mg after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // CHLORAL HYDRATE
  // ============================================================================
  {
    id: "chloralhydrate",
    name: "Chloral Hydrate",
    category: "Sedative/Hypnotic",
    route: "PO/PR",
    formulations: [
      { type: "Syrup", strengths: "500 mg/5 mL" },
      { type: "Suppository", strengths: "325 mg, 500 mg, 650 mg" }
    ],
    doses: {
      sedationProcedure: { label: "Procedural Sedation", value: "25-100", unit: "mg/kg/dose (max 2g)", maxDose: 2000 },
      sedationEEG: { label: "EEG Sedation", value: "25-50", unit: "mg/kg/dose", maxDose: 1000 },
      hypnotic: { label: "Hypnotic", value: "25-50", unit: "mg/kg/dose QHS", maxDose: 500 },
      adultHypnotic: { label: "Adult Hypnotic", value: "500-1000", unit: "mg QHS", isFixed: true }
    },
    max: "2 g/dose; 2 g/day",
    indication: "Procedural sedation (imaging studies), EEG sedation, short-term insomnia",
    contraindications: [
      "Severe hepatic impairment",
      "Severe renal impairment",
      "Severe cardiac disease",
      "Gastritis or esophagitis"
    ],
    warnings: [
      "⚠️ Respiratory depression risk",
      "May be carcinogenic (limited human data)",
      "Tolerance develops with repeated use",
      "GI irritation - give with liquid"
    ],
    sideEffects: [
      "Common: GI upset, nausea, vomiting",
      "CNS: Paradoxical excitement, hangover effect",
      "Serious: Respiratory depression, arrhythmias",
      "Chronic: Tolerance, dependence"
    ],
    interactions: [
      { drug: "CNS depressants", effect: "Additive respiratory depression" },
      { drug: "Warfarin", effect: "Transient increase in INR" },
      { drug: "IV furosemide", effect: "Flushing, diaphoresis, tachycardia" }
    ],
    notes: "Not recommended for repeated use or chronic insomnia. Monitor vital signs. Have resuscitation equipment available. Do not use near heat/flame (flammable). Half-life: 8-11 hours.",
    renalAdjust: "Avoid in severe impairment",
    hepaticAdjust: "Avoid in severe impairment"
  },

  // ============================================================================
  // CIPROFLOXACIN
  // ============================================================================
  {
    id: "ciprofloxacin",
    name: "Ciprofloxacin (Cipro)",
    category: "Antibiotic (Fluoroquinolone)",
    route: "PO/IV",
    formulations: [
      { type: "Tablets", strengths: "250 mg, 500 mg, 750 mg" },
      { type: "Suspension", strengths: "250 mg/5 mL, 500 mg/5 mL" },
      { type: "IV", strengths: "200 mg/100 mL, 400 mg/200 mL" },
      { type: "Ophthalmic", strengths: "0.3% solution/ointment" },
      { type: "Otic", strengths: "0.2% solution" }
    ],
    doses: {
      utiPO: { label: "UTI (PO)", value: "10-20", unit: "mg/kg/day ÷ Q12h", maxDose: 1500 },
      utiIV: { label: "UTI (IV)", value: "6-10", unit: "mg/kg/dose Q8h", maxDose: 400 },
      cysticFibrosis: { label: "Cystic Fibrosis", value: "20-40", unit: "mg/kg/day ÷ Q12h PO", maxDose: 2000 },
      anthrax: { label: "Anthrax (post-exposure)", value: "15", unit: "mg/kg/dose Q12h x 60 days", maxDose: 500 },
      pseudomonas: { label: "Pseudomonas", value: "20-30", unit: "mg/kg/day ÷ Q8-12h IV", maxDose: 1200 },
      ophthalmic: { label: "Ophthalmic", value: "1-2 drops", unit: "Q2-4h while awake x 2 days, then Q4h x 5 days", isFixed: true },
      otic: { label: "Otic (otitis externa)", value: "0.25 mL", unit: "(single-dose container) BID x 7 days", isFixed: true }
    },
    max: "1.5 g/day PO; 1.2 g/day IV",
    indication: "Complicated UTI, Pseudomonas (CF), anthrax, GI infections, osteomyelitis (gram-negative)",
    contraindications: [
      "Hypersensitivity to fluoroquinolones",
      "Concurrent tizanidine use"
    ],
    warnings: [
      "⚠️ Tendinitis/tendon rupture (black box)",
      "⚠️ Peripheral neuropathy (may be irreversible)",
      "⚠️ CNS effects (seizures, psychosis)",
      "⚠️ Aortic aneurysm/dissection risk",
      "QT prolongation",
      "Musculoskeletal effects in children (use when no alternative)"
    ],
    sideEffects: [
      "Common: Nausea, diarrhea, headache",
      "Serious: Tendon rupture, peripheral neuropathy, C. diff colitis",
      "CNS: Seizures, confusion, psychosis",
      "Cardiac: QT prolongation"
    ],
    interactions: [
      { drug: "Antacids, calcium, iron, zinc", effect: "Decreased absorption - separate by 2 hours" },
      { drug: "Tizanidine", effect: "⚠️ Contraindicated - increased tizanidine toxicity" },
      { drug: "Theophylline", effect: "Increased theophylline levels" },
      { drug: "Warfarin", effect: "Increased INR" },
      { drug: "QT-prolonging drugs", effect: "Additive QT prolongation" },
      { drug: "Cyclosporine", effect: "Increased nephrotoxicity" }
    ],
    notes: "Reserve for infections without alternative antibiotics in children (FDA warning). PO bioavailability 70-80%. IV:PO ratio approximately 1:1.5. Do not crush ER tablets.",
    renalAdjust: {
      gfr50: "Q12h",
      gfr30: "Q18h or 50-75% dose",
      gfr10: "Q24h or 50% dose",
      hd: "250-500 mg Q24h after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // CLINDAMYCIN
  // ============================================================================
  {
    id: "clindamycin",
    name: "Clindamycin (Cleocin)",
    category: "Antibiotic (Lincosamide)",
    route: "PO/IV/Topical",
    formulations: [
      { type: "Capsules", strengths: "75 mg, 150 mg, 300 mg" },
      { type: "Solution", strengths: "75 mg/5 mL" },
      { type: "IV", strengths: "150 mg/mL" },
      { type: "Topical gel/lotion", strengths: "1%" },
      { type: "Vaginal cream", strengths: "2%" }
    ],
    doses: {
      standard: { label: "Standard", value: "20-40", unit: "mg/kg/day ÷ Q6-8h" },
      severe: { label: "Severe/Bone", value: "25-40", unit: "mg/kg/day ÷ Q6-8h", maxDose: 2700 },
      mrsaSkin: { label: "MRSA Skin/Soft Tissue", value: "30-40", unit: "mg/kg/day ÷ Q8h" },
      necrotizingFasciitis: { label: "Necrotizing Fasciitis", value: "40", unit: "mg/kg/day ÷ Q8h (with penicillin)" },
      toxicShock: { label: "Toxic Shock (toxin suppression)", value: "40", unit: "mg/kg/day ÷ Q8h" },
      malaria: { label: "Malaria (with quinine)", value: "20", unit: "mg/kg/day ÷ Q8h x 7 days" },
      adultPO: { label: "Adult PO", value: "150-450", unit: "mg Q6-8h", isFixed: true },
      adultIV: { label: "Adult IV", value: "600-900", unit: "mg Q8h", isFixed: true }
    },
    max: "2.7 g/day IV; 1.8 g/day PO",
    indication: "MRSA (CA-MRSA skin), bone/joint infections, intra-abdominal (with gram-neg coverage), toxin-mediated disease, aspiration pneumonia",
    contraindications: [
      "Hypersensitivity to clindamycin or lincomycin"
    ],
    warnings: [
      "⚠️ High risk of C. difficile colitis",
      "Discontinue if diarrhea develops",
      "Contains benzyl alcohol (IV) - avoid in neonates"
    ],
    sideEffects: [
      "Common: Diarrhea, nausea, rash",
      "Serious: C. difficile colitis (may be severe)",
      "Less common: Elevated LFTs, granulocytopenia"
    ],
    interactions: [
      { drug: "Erythromycin", effect: "Antagonism - avoid combination" },
      { drug: "Neuromuscular blockers", effect: "Enhanced blockade" },
      { drug: "Kaolin-pectin", effect: "Decreased clindamycin absorption" }
    ],
    notes: "Excellent bone penetration. Good for MRSA (check local susceptibility). Suppresses toxin production (useful in toxic shock, necrotizing fasciitis). IV over 10-60 min (max 30 mg/min).",
    renalAdjust: null,
    hepaticAdjust: "Reduce dose in severe hepatic impairment"
  },

  // ============================================================================
  // DEXAMETHASONE
  // ============================================================================
  {
    id: "dexamethasone",
    name: "Dexamethasone (Decadron)",
    category: "Corticosteroid",
    route: "PO/IV/IM",
    formulations: [
      { type: "Tablets", strengths: "0.5 mg, 0.75 mg, 1 mg, 1.5 mg, 2 mg, 4 mg, 6 mg" },
      { type: "Elixir/Solution", strengths: "0.5 mg/5 mL, 1 mg/mL" },
      { type: "IV/IM", strengths: "4 mg/mL, 10 mg/mL" }
    ],
    doses: {
      // Croup (age-based, not weight-based for standard dose)
      croup: { label: "Croup", value: "0.6", unit: "mg/kg x 1 dose (max 10 mg)", maxDose: 10 },
      croupMild: { label: "Croup (mild)", value: "0.15-0.3", unit: "mg/kg x 1 dose" },
      // Airway edema
      airwayEdema: { label: "Airway Edema/Extubation", value: "0.5-1", unit: "mg/kg/day ÷ Q6h x 24h before extubation" },
      // Anti-inflammatory
      antiinflam: { label: "Anti-inflammatory", value: "0.08-0.3", unit: "mg/kg/day ÷ Q6-12h" },
      // Cerebral edema
      cerebralEdema: { label: "Cerebral Edema", value: "1-2", unit: "mg/kg loading, then 1-1.5 mg/kg/day ÷ Q4-6h", maxDose: 16 },
      // Bacterial meningitis
      meningitis: { label: "Bacterial Meningitis", value: "0.15", unit: "mg/kg/dose Q6h x 2-4 days" },
      // Chemotherapy-induced N/V
      cinv: { label: "CINV", value: "5-10", unit: "mg/m²/dose Q6-12h", isFixed: false },
      // BPD prevention
      bpdPreterm: { label: "BPD (preterm)", value: "0.15", unit: "mg/kg/day x 3 days, then taper" },
      // Asthma
      asthma: { label: "Asthma Exacerbation", value: "0.6", unit: "mg/kg/day x 1-2 days", maxDose: 16 }
    },
    dosingTable: {
      title: "Dexamethasone Equivalence",
      columns: ["Steroid", "Equivalent Dose", "Anti-inflammatory Potency", "Mineralocorticoid"],
      rows: [
        ["Dexamethasone", "0.75 mg", "25-30", "0"],
        ["Prednisone/Prednisolone", "5 mg", "4", "0.8"],
        ["Methylprednisolone", "4 mg", "5", "0.5"],
        ["Hydrocortisone", "20 mg", "1", "1"]
      ]
    },
    max: "16 mg/day (most indications)",
    indication: "Croup, airway edema, cerebral edema, bacterial meningitis (adjunct), CINV, anti-inflammatory",
    contraindications: [
      "Systemic fungal infections",
      "Live vaccines during high-dose therapy"
    ],
    warnings: [
      "Adrenal suppression with prolonged use",
      "Hyperglycemia",
      "GI ulceration (especially with NSAIDs)",
      "Immunosuppression",
      "Growth suppression in children"
    ],
    sideEffects: [
      "Short-term: Hyperglycemia, mood changes, insomnia, increased appetite",
      "Long-term: Adrenal suppression, osteoporosis, growth suppression, Cushing's",
      "GI: Peptic ulcer, pancreatitis"
    ],
    interactions: [
      { drug: "NSAIDs", effect: "Increased GI bleeding risk" },
      { drug: "CYP3A4 inducers (phenytoin, rifampin)", effect: "Decreased dexamethasone effect" },
      { drug: "Live vaccines", effect: "Increased infection risk - avoid" },
      { drug: "Antidiabetic agents", effect: "Decreased glucose control" }
    ],
    notes: "Very potent (25-30x hydrocortisone). No mineralocorticoid activity. For croup: single dose is usually sufficient. For meningitis: give before or with first antibiotic dose. Taper if >7-10 days of therapy.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // DEXTROSE
  // ============================================================================
  {
    id: "dextrose",
    name: "Dextrose (D-Glucose)",
    category: "Carbohydrate/Electrolyte",
    route: "IV/PO",
    formulations: [
      { type: "IV solutions", strengths: "5%, 10%, 25%, 50%" },
      { type: "Oral gel", strengths: "40% gel" }
    ],
    doses: {
      hypoglycemiaNeo: { label: "Hypoglycemia (Neonate)", value: "0.2", unit: "g/kg IV (2 mL/kg D10W)" },
      hypoglycemiaChild: { label: "Hypoglycemia (Child)", value: "0.5-1", unit: "g/kg IV (2-4 mL/kg D25W)" },
      hypoglycemiaAdol: { label: "Hypoglycemia (Adolescent/Adult)", value: "25", unit: "g IV (50 mL D50W)", isFixed: true },
      maintenanceNeo: { label: "Maintenance (Neonate)", value: "4-8", unit: "mg/kg/min (GIR)" },
      maintenanceChild: { label: "Maintenance (Child)", value: "3-5", unit: "mg/kg/min (GIR)" },
      hyperkalemia: { label: "Hyperkalemia (with insulin)", value: "0.5-1", unit: "g/kg IV with insulin 0.1 U/kg" }
    },
    dosingTable: {
      title: "Dextrose Concentration Guide",
      columns: ["Concentration", "Grams/100mL", "Use", "Max Rate Peripheral"],
      rows: [
        ["D5W", "5 g", "Maintenance, dilution", "Unlimited"],
        ["D10W", "10 g", "Neonatal maintenance, mild hypoglycemia", "12.5%"],
        ["D12.5W", "12.5 g", "TPN via peripheral", "12.5%"],
        ["D25W", "25 g", "Hypoglycemia bolus (children)", "Central only"],
        ["D50W", "50 g", "Hypoglycemia bolus (adults)", "Central only"]
      ]
    },
    max: "D12.5% peripherally; higher concentrations via central line",
    indication: "Hypoglycemia, maintenance fluids, hyperkalemia (with insulin), TPN",
    contraindications: [
      "Hyperglycemia",
      "Diabetic coma until controlled"
    ],
    warnings: [
      "D50W can cause tissue necrosis if extravasated",
      "May worsen cerebral edema (use NS in trauma)",
      "Thiamine deficiency - give thiamine before glucose in alcoholics/malnutrition",
      "Osmotic diuresis with hyperglycemia"
    ],
    sideEffects: [
      "Hyperglycemia, hyperosmolarity",
      "Extravasation injury (concentrated solutions)",
      "Hypokalemia, hypophosphatemia with prolonged use",
      "Fluid overload"
    ],
    interactions: [
      { drug: "Insulin", effect: "Used together for hyperkalemia" },
      { drug: "Corticosteroids", effect: "May increase hyperglycemia" }
    ],
    notes: "For hypoglycemia: D10W preferred in neonates (less osmotic). GIR (glucose infusion rate) = (dextrose % × rate mL/hr) / (6 × weight kg). Check glucose 15-30 min after bolus. In neonates, target GIR 4-8 mg/kg/min.",
    renalAdjust: null,
    hepaticAdjust: null
  }
];

// Export helper to get drug by ID
export const getDrugById = (id) => childrenFormulary.find(drug => drug.id === id);

// Export drug categories
export const drugCategories = [...new Set(childrenFormulary.map(d => d.category))].sort();
