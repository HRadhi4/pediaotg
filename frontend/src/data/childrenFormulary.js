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
  },

  // ============================================================================
  // DIAZEPAM (Valium)
  // ============================================================================
  {
    id: "diazepam",
    name: "Diazepam (Valium)",
    category: "Benzodiazepine",
    route: "PO/IV/IM/PR",
    formulations: [
      { type: "Tablets", strengths: "2 mg, 5 mg, 10 mg" },
      { type: "Solution", strengths: "5 mg/5 mL, 5 mg/mL concentrate" },
      { type: "IV/IM", strengths: "5 mg/mL" },
      { type: "Rectal gel (Diastat)", strengths: "2.5 mg, 5 mg, 10 mg, 15 mg, 20 mg" }
    ],
    doses: {
      seizureIV: { label: "Status Epilepticus (IV)", value: "0.1-0.3", unit: "mg/kg IV Q5-10min PRN", maxDose: 10 },
      seizureRectal: { label: "Seizure (Rectal)", value: "0.5", unit: "mg/kg PR", maxDose: 20 },
      sedation: { label: "Sedation", value: "0.1-0.3", unit: "mg/kg IV", maxDose: 10 },
      muscleSpasm: { label: "Muscle Spasm/Tetanus", value: "0.1-0.2", unit: "mg/kg/dose Q6-8h", maxDose: 0.6 },
      anxiolysis: { label: "Anxiolysis", value: "0.04-0.2", unit: "mg/kg/dose Q6-8h PO", maxDose: 10 },
      adultSeizure: { label: "Adult Seizure", value: "5-10", unit: "mg IV Q10-15min", isFixed: true, maxDose: 30 }
    },
    dosingTable: {
      title: "Diastat (Rectal Diazepam) Dosing by Age/Weight",
      columns: ["Age", "Weight", "Dose"],
      rows: [
        ["2-5 yr", "6-11 kg", "5 mg"],
        ["2-5 yr", "12-22 kg", "10 mg"],
        ["6-11 yr", "10-18 kg", "10 mg"],
        ["6-11 yr", "19-37 kg", "12.5-15 mg"],
        ["≥12 yr", "14-27 kg", "10 mg"],
        ["≥12 yr", "28-50 kg", "15 mg"],
        ["≥12 yr", "51-75 kg", "17.5 mg"],
        ["≥12 yr", ">75 kg", "20 mg"]
      ]
    },
    max: "10 mg/dose IV (child); 30 mg total (status); 0.6 mg/kg/day (spasticity)",
    indication: "Status epilepticus, acute seizures, muscle spasm, tetanus, sedation, anxiety",
    contraindications: [
      "Severe respiratory depression",
      "Acute narrow-angle glaucoma",
      "Severe hepatic impairment",
      "Myasthenia gravis"
    ],
    warnings: [
      "Respiratory depression - have resuscitation equipment ready",
      "Paradoxical reactions in children",
      "Contains propylene glycol and benzyl alcohol (IV)",
      "Do not mix with other drugs in same syringe"
    ],
    sideEffects: [
      "Common: Sedation, ataxia, confusion",
      "Serious: Respiratory depression, hypotension",
      "IV: Thrombophlebitis, pain at injection site"
    ],
    interactions: [
      { drug: "CNS depressants/opioids", effect: "⚠️ Additive respiratory depression" },
      { drug: "CYP3A4 inhibitors", effect: "Increased diazepam effect" },
      { drug: "Flumazenil", effect: "Reversal agent (may precipitate seizures)" }
    ],
    notes: "IM absorption erratic - avoid. IV push max 5 mg/min (adults), 1-2 mg/min (children). Rectal gel useful for home/rescue seizure management. Long-acting (active metabolites). Half-life: 20-70 hours.",
    renalAdjust: null,
    hepaticAdjust: "Reduce dose by 50% in severe impairment"
  },

  // ============================================================================
  // DIPHENHYDRAMINE (Benadryl)
  // ============================================================================
  {
    id: "diphenhydramine",
    name: "Diphenhydramine (Benadryl)",
    category: "Antihistamine (1st generation)",
    route: "PO/IV/IM/Topical",
    formulations: [
      { type: "Tablets/Capsules", strengths: "25 mg, 50 mg" },
      { type: "Liquid", strengths: "12.5 mg/5 mL" },
      { type: "IV/IM", strengths: "50 mg/mL" },
      { type: "Topical cream", strengths: "1%, 2%" }
    ],
    doses: {
      allergicReaction: { label: "Allergic Reaction", value: "1-1.25", unit: "mg/kg/dose Q6h", maxDose: 50 },
      anaphylaxis: { label: "Anaphylaxis (adjunct)", value: "1-2", unit: "mg/kg IV", maxDose: 50 },
      sedation: { label: "Sedation", value: "0.5-1", unit: "mg/kg/dose", maxDose: 50 },
      dystonia: { label: "Acute Dystonia", value: "1-2", unit: "mg/kg IV", maxDose: 50 },
      motionSickness: { label: "Motion Sickness", value: "1-1.5", unit: "mg/kg/dose Q6-8h", maxDose: 50 },
      adultStandard: { label: "Adult", value: "25-50", unit: "mg Q6-8h", isFixed: true }
    },
    dosingTable: {
      title: "Diphenhydramine by Age (OTC Dosing)",
      columns: ["Age", "Dose"],
      rows: [
        ["2-5 yr", "6.25 mg Q4-6h (max 37.5 mg/day)"],
        ["6-11 yr", "12.5-25 mg Q4-6h (max 150 mg/day)"],
        ["≥12 yr", "25-50 mg Q4-6h (max 300 mg/day)"]
      ]
    },
    max: "300 mg/day; 50 mg/dose",
    indication: "Allergic reactions, urticaria, anaphylaxis (adjunct), acute dystonia, motion sickness, insomnia",
    contraindications: [
      "Neonates (may cause paradoxical CNS stimulation)",
      "Narrow-angle glaucoma",
      "Concurrent MAO inhibitor use",
      "Lower respiratory disease in children"
    ],
    warnings: [
      "Anticholinergic effects (urinary retention, dry mouth)",
      "Paradoxical excitation in young children",
      "Sedation impairs driving/activities",
      "Not recommended for cough/cold in <4 years"
    ],
    sideEffects: [
      "Common: Sedation, dry mouth, urinary retention, blurred vision",
      "CNS: Paradoxical excitation (children), dizziness, headache",
      "Serious: Seizures (overdose), arrhythmias"
    ],
    interactions: [
      { drug: "CNS depressants", effect: "Additive sedation" },
      { drug: "MAO inhibitors", effect: "Prolonged/intensified anticholinergic effects" },
      { drug: "Other anticholinergics", effect: "Additive effects" }
    ],
    notes: "First-line for acute allergic reactions. For anaphylaxis: epinephrine is first-line, diphenhydramine is adjunct. IV push over 5 min. Not effective for ongoing allergic symptoms (use 2nd gen antihistamines).",
    renalAdjust: "Extend interval in renal impairment",
    hepaticAdjust: null
  },

  // ============================================================================
  // DOBUTAMINE
  // ============================================================================
  {
    id: "dobutamine",
    name: "Dobutamine (Dobutrex)",
    category: "Inotrope (β1-agonist)",
    route: "IV infusion",
    formulations: [
      { type: "IV", strengths: "12.5 mg/mL (20 mL, 40 mL vials)" },
      { type: "Premixed", strengths: "250 mg/250 mL, 500 mg/250 mL D5W" }
    ],
    doses: {
      standard: { label: "Standard Infusion", value: "2-20", unit: "mcg/kg/min", isRate: true },
      lowDose: { label: "Low Dose (start)", value: "2-5", unit: "mcg/kg/min", isRate: true },
      highDose: { label: "High Dose", value: "10-20", unit: "mcg/kg/min", isRate: true }
    },
    dosingTable: {
      title: "Dobutamine Effects by Dose",
      columns: ["Dose Range", "Primary Effect"],
      rows: [
        ["2-5 mcg/kg/min", "↑ Inotropy (mild)"],
        ["5-10 mcg/kg/min", "↑ Inotropy, ↑ HR"],
        ["10-20 mcg/kg/min", "↑↑ Inotropy, ↑↑ HR, ↓ SVR"]
      ]
    },
    max: "40 mcg/kg/min",
    indication: "Low cardiac output states, cardiogenic shock, heart failure",
    contraindications: [
      "Idiopathic hypertrophic subaortic stenosis",
      "Uncorrected hypovolemia"
    ],
    warnings: [
      "May worsen hypotension (β2 vasodilation)",
      "Tachyarrhythmias at high doses",
      "Hypokalemia",
      "Tolerance may develop with prolonged use"
    ],
    sideEffects: [
      "Common: Tachycardia, hypertension, headache",
      "Arrhythmias: PVCs, ventricular tachycardia",
      "Other: Nausea, dyspnea, chest pain"
    ],
    interactions: [
      { drug: "Beta-blockers", effect: "May antagonize effects" },
      { drug: "MAO inhibitors", effect: "Prolonged effect" },
      { drug: "General anesthetics", effect: "Increased arrhythmia risk" }
    ],
    notes: "Pure inotrope with minimal vasoconstriction. Increases cardiac output mainly through increased contractility. May need vasopressor if hypotension occurs. Titrate to clinical effect. Half-life: 2 minutes.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // DOPAMINE
  // ============================================================================
  {
    id: "dopamine",
    name: "Dopamine (Intropin)",
    category: "Vasopressor/Inotrope",
    route: "IV infusion",
    formulations: [
      { type: "IV", strengths: "40 mg/mL, 80 mg/mL, 160 mg/mL" },
      { type: "Premixed", strengths: "200 mg/250 mL, 400 mg/250 mL, 800 mg/250 mL D5W" }
    ],
    doses: {
      lowDose: { label: "Low Dose (renal)", value: "1-5", unit: "mcg/kg/min", isRate: true },
      mediumDose: { label: "Medium Dose (cardiac)", value: "5-10", unit: "mcg/kg/min", isRate: true },
      highDose: { label: "High Dose (vasopressor)", value: "10-20", unit: "mcg/kg/min", isRate: true }
    },
    dosingTable: {
      title: "Dopamine Dose-Response Relationship",
      columns: ["Dose Range", "Receptor", "Effect"],
      rows: [
        ["1-3 mcg/kg/min", "DA1, DA2", "Renal/mesenteric vasodilation (controversial benefit)"],
        ["3-10 mcg/kg/min", "β1 > α1", "↑ Inotropy, ↑ HR, ↑ CO"],
        ["10-20 mcg/kg/min", "α1 > β1", "Vasoconstriction, ↑↑ SVR, ↑ BP"],
        [">20 mcg/kg/min", "α1", "Marked vasoconstriction (may worsen perfusion)"]
      ]
    },
    max: "20 mcg/kg/min (usual); up to 50 mcg/kg/min in extreme cases",
    indication: "Hypotension, shock (septic, cardiogenic), bradycardia unresponsive to atropine",
    contraindications: [
      "Pheochromocytoma",
      "Uncorrected tachyarrhythmias",
      "Ventricular fibrillation"
    ],
    warnings: [
      "Extravasation causes tissue necrosis - use central line when possible",
      "Correct hypovolemia before starting",
      "May cause tachyarrhythmias",
      "Use with caution in patients on MAO inhibitors"
    ],
    sideEffects: [
      "Common: Tachycardia, arrhythmias, hypertension",
      "Vasoconstriction: Cold extremities, tissue ischemia",
      "Other: Nausea, headache, dyspnea"
    ],
    interactions: [
      { drug: "MAO inhibitors", effect: "⚠️ Severe hypertensive crisis - use 1/10th dose" },
      { drug: "Alpha-blockers", effect: "May antagonize pressor effect" },
      { drug: "Phenytoin", effect: "Hypotension and bradycardia" },
      { drug: "Cyclopropane anesthesia", effect: "Increased arrhythmia risk" }
    ],
    notes: "For extravasation: infiltrate area with phentolamine 5-10 mg in 10 mL NS. Central line preferred. Dose-response varies between patients. Norepinephrine often preferred in septic shock. Half-life: 2 minutes.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // ENOXAPARIN (Lovenox)
  // ============================================================================
  {
    id: "enoxaparin",
    name: "Enoxaparin (Lovenox)",
    category: "Anticoagulant (LMWH)",
    route: "SC/IV",
    formulations: [
      { type: "SC injection", strengths: "30 mg/0.3 mL, 40 mg/0.4 mL, 60 mg/0.6 mL, 80 mg/0.8 mL, 100 mg/mL, 120 mg/0.8 mL, 150 mg/mL" }
    ],
    doses: {
      treatmentInfant: { label: "Treatment (<2 mo)", value: "1.5", unit: "mg/kg/dose Q12h SC" },
      treatmentChild: { label: "Treatment (≥2 mo)", value: "1", unit: "mg/kg/dose Q12h SC", maxDose: 100 },
      treatmentAdult: { label: "Treatment (Adult)", value: "1", unit: "mg/kg Q12h OR 1.5 mg/kg Q24h SC", isFixed: true },
      prophylaxisChild: { label: "Prophylaxis (Child)", value: "0.5", unit: "mg/kg/dose Q12h SC" },
      prophylaxisAdult: { label: "Prophylaxis (Adult)", value: "40", unit: "mg SC daily OR 30 mg Q12h", isFixed: true }
    },
    dosingTable: {
      title: "Anti-Xa Level Monitoring",
      columns: ["Indication", "Target Peak Anti-Xa (4h post-dose)"],
      rows: [
        ["Treatment (Q12h dosing)", "0.5-1.0 IU/mL"],
        ["Treatment (Q24h dosing)", "1.0-2.0 IU/mL"],
        ["Prophylaxis", "0.2-0.4 IU/mL"]
      ]
    },
    max: "Treatment: 100 mg/dose; Prophylaxis: 40 mg/dose",
    indication: "DVT/PE treatment and prophylaxis, ACS, bridge therapy",
    contraindications: [
      "Active major bleeding",
      "Heparin-induced thrombocytopenia (HIT)",
      "Hypersensitivity to enoxaparin, heparin, or pork products"
    ],
    warnings: [
      "⚠️ Epidural hematoma risk with neuraxial anesthesia",
      "Not for IM injection",
      "Monitor anti-Xa in renal impairment, obesity, children",
      "Contains benzyl alcohol - use preservative-free in neonates"
    ],
    sideEffects: [
      "Common: Bleeding, injection site reaction, anemia",
      "Less common: Thrombocytopenia, elevated LFTs",
      "Rare: HIT, skin necrosis, osteoporosis (long-term)"
    ],
    interactions: [
      { drug: "Antiplatelet agents", effect: "Increased bleeding risk" },
      { drug: "NSAIDs", effect: "Increased bleeding risk" },
      { drug: "Warfarin", effect: "Increased bleeding risk (overlap during transition)" }
    ],
    notes: "Check anti-Xa levels in children, renal impairment, obesity. Protamine only partially reverses (60% at best). Cannot be interchanged with other LMWHs. Prefilled syringes have air bubble - do not expel before injection.",
    renalAdjust: {
      gfr50: "No change (monitor anti-Xa)",
      gfr30: "Treatment: 1 mg/kg Q24h; Prophylaxis: 30 mg Q24h",
      gfr10: "Use with caution; monitor anti-Xa closely",
      hd: "Not recommended (not dialyzable)"
    },
    hepaticAdjust: "Use with caution; monitor for bleeding"
  },

  // ============================================================================
  // EPINEPHRINE (Adrenaline)
  // ============================================================================
  {
    id: "epinephrine",
    name: "Epinephrine (Adrenaline)",
    category: "Vasopressor/Bronchodilator",
    route: "IV/IO/SC/IM/ETT/Nebulizer",
    formulations: [
      { type: "IV (1:10,000)", strengths: "0.1 mg/mL (10 mL syringe)" },
      { type: "IM (1:1,000)", strengths: "1 mg/mL (1 mL ampule)" },
      { type: "Autoinjector (EpiPen)", strengths: "0.15 mg, 0.3 mg" },
      { type: "Racemic (for neb)", strengths: "2.25% solution" }
    ],
    doses: {
      // Cardiac arrest
      arrestIV: { label: "Cardiac Arrest (IV/IO)", value: "0.01", unit: "mg/kg (0.1 mL/kg of 1:10,000) Q3-5min", maxDose: 1 },
      arrestETT: { label: "Cardiac Arrest (ETT)", value: "0.1", unit: "mg/kg (0.1 mL/kg of 1:1,000)" },
      // Anaphylaxis
      anaphylaxisIM: { label: "Anaphylaxis (IM)", value: "0.01", unit: "mg/kg (0.01 mL/kg of 1:1,000) IM", maxDose: 0.5 },
      epipen: { label: "EpiPen", value: "0.15 mg (<30kg) or 0.3 mg (≥30kg)", unit: "IM into lateral thigh", isFixed: true },
      // Infusion
      infusion: { label: "Continuous Infusion", value: "0.05-1", unit: "mcg/kg/min", isRate: true },
      // Croup (racemic)
      croupRacemic: { label: "Croup (Racemic)", value: "0.5", unit: "mL of 2.25% diluted in 3 mL NS nebulized", isFixed: true },
      croupLEpi: { label: "Croup (L-Epinephrine)", value: "0.5", unit: "mL/kg (max 5 mL) of 1:1,000 nebulized" },
      // Bradycardia
      bradycardiaInfusion: { label: "Symptomatic Bradycardia", value: "0.01-0.02", unit: "mcg/kg/min infusion", isRate: true }
    },
    dosingTable: {
      title: "Epinephrine Autoinjector Selection",
      columns: ["Weight", "Device", "Dose"],
      rows: [
        ["7.5-25 kg", "EpiPen Jr / Auvi-Q 0.1", "0.15 mg"],
        ["≥25 kg", "EpiPen / Auvi-Q 0.3", "0.3 mg"]
      ]
    },
    max: "1 mg/dose IV (arrest); 0.5 mg/dose IM (anaphylaxis)",
    indication: "Cardiac arrest, anaphylaxis, severe asthma, croup, hypotension, bradycardia",
    contraindications: [
      "None in life-threatening emergencies",
      "Relative: Angle-closure glaucoma, certain arrhythmias"
    ],
    warnings: [
      "⚠️ Use 1:10,000 for IV; 1:1,000 for IM/SC",
      "Tissue necrosis with extravasation",
      "Arrhythmias, severe hypertension",
      "Sulfite allergy (some formulations)"
    ],
    sideEffects: [
      "Common: Tachycardia, hypertension, anxiety, tremor",
      "Serious: Arrhythmias, MI, cerebral hemorrhage",
      "Local: Tissue necrosis (extravasation)"
    ],
    interactions: [
      { drug: "Beta-blockers", effect: "May cause severe hypertension (unopposed alpha)" },
      { drug: "MAO inhibitors", effect: "Prolonged and intensified effect" },
      { drug: "TCAs", effect: "Enhanced pressor effect" },
      { drug: "Digoxin", effect: "Increased arrhythmia risk" }
    ],
    notes: "For anaphylaxis: IM (lateral thigh) is preferred route - faster absorption than SC. May repeat Q5-15min. For croup: observe 2-4 hours after nebulization (rebound possible). Protect from light.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // FENTANYL
  // ============================================================================
  {
    id: "fentanyl",
    name: "Fentanyl (Sublimaze)",
    category: "Opioid Analgesic",
    route: "IV/IM/Transdermal/Intranasal/Transmucosal",
    formulations: [
      { type: "IV/IM", strengths: "50 mcg/mL" },
      { type: "Transdermal patch", strengths: "12, 25, 50, 75, 100 mcg/hr" },
      { type: "Intranasal spray", strengths: "100, 400 mcg/spray" },
      { type: "Lozenge (Actiq)", strengths: "200-1600 mcg" }
    ],
    doses: {
      proceduralBolus: { label: "Procedural Sedation (Bolus)", value: "1-2", unit: "mcg/kg IV", maxDose: 50 },
      analgesiaBolus: { label: "Analgesia (Bolus)", value: "0.5-1", unit: "mcg/kg IV Q1-2h PRN" },
      continuousInfusion: { label: "Continuous Infusion", value: "1-5", unit: "mcg/kg/hr", isRate: true },
      intranasal: { label: "Intranasal", value: "1.5-2", unit: "mcg/kg (max 100 mcg)" },
      intubation: { label: "RSI/Intubation", value: "2-5", unit: "mcg/kg IV" },
      neonateInfusion: { label: "Neonate Infusion", value: "0.5-2", unit: "mcg/kg/hr", isRate: true }
    },
    dosingTable: {
      title: "Fentanyl Equianalgesic Dosing",
      columns: ["Route", "Fentanyl", "Morphine Equivalent"],
      rows: [
        ["IV", "100 mcg", "10 mg IV morphine"],
        ["Transdermal", "25 mcg/hr", "~60-90 mg/day oral morphine"]
      ]
    },
    max: "50-100 mcg/dose (bolus); 5 mcg/kg/hr (infusion)",
    indication: "Procedural sedation, analgesia, anesthesia adjunct, chronic pain (patch)",
    contraindications: [
      "Severe respiratory depression",
      "Opioid-naive patients (transdermal)",
      "Paralytic ileus"
    ],
    warnings: [
      "⚠️ Respiratory depression - have naloxone available",
      "⚠️ Chest wall rigidity with rapid IV push (>5 mcg/kg)",
      "Accumulates in fat with prolonged use",
      "Withdrawal with abrupt discontinuation after prolonged use"
    ],
    sideEffects: [
      "Common: Respiratory depression, sedation, constipation, nausea",
      "Serious: Chest wall rigidity, bradycardia, apnea",
      "Other: Pruritus, urinary retention"
    ],
    interactions: [
      { drug: "CNS depressants/benzos", effect: "⚠️ Additive respiratory depression" },
      { drug: "CYP3A4 inhibitors", effect: "Increased fentanyl effect" },
      { drug: "MAO inhibitors", effect: "Serotonin syndrome risk" },
      { drug: "Rifampin", effect: "Decreased fentanyl effect" }
    ],
    notes: "50-100x more potent than morphine. Rapid onset (1-2 min IV). Short duration (30-60 min) makes it good for procedures. Give slowly IV to prevent chest wall rigidity. Naloxone reverses effects.",
    renalAdjust: "No adjustment for single doses; reduce infusion in renal failure",
    hepaticAdjust: "Reduce dose in severe hepatic impairment"
  },

  // ============================================================================
  // FLUCONAZOLE (Diflucan)
  // ============================================================================
  {
    id: "fluconazole",
    name: "Fluconazole (Diflucan)",
    category: "Antifungal (Azole)",
    route: "PO/IV",
    formulations: [
      { type: "Tablets", strengths: "50 mg, 100 mg, 150 mg, 200 mg" },
      { type: "Suspension", strengths: "10 mg/mL, 40 mg/mL" },
      { type: "IV", strengths: "2 mg/mL" }
    ],
    doses: {
      oropharyngealChild: { label: "Oropharyngeal Candida (Child)", value: "6", unit: "mg/kg day 1, then 3 mg/kg/day" },
      esophagealChild: { label: "Esophageal Candida", value: "6", unit: "mg/kg day 1, then 3-12 mg/kg/day", maxDose: 400 },
      invasiveCandida: { label: "Invasive Candidiasis", value: "12", unit: "mg/kg day 1, then 6-12 mg/kg/day", maxDose: 800 },
      cryptoMeningitis: { label: "Cryptococcal Meningitis", value: "12", unit: "mg/kg day 1, then 6-12 mg/kg/day", maxDose: 800 },
      prophylaxisNeo: { label: "Prophylaxis (Neonate)", value: "3-6", unit: "mg/kg twice weekly" },
      vulvovaginal: { label: "Vulvovaginal Candida", value: "150", unit: "mg PO x 1 dose", isFixed: true }
    },
    dosingTable: {
      title: "Neonatal Fluconazole Dosing",
      columns: ["Gestational Age", "Postnatal Age", "Interval"],
      rows: [
        ["<29 weeks", "0-14 days", "Q72h"],
        ["<29 weeks", ">14 days", "Q48h"],
        ["30-36 weeks", "0-14 days", "Q48h"],
        ["30-36 weeks", ">14 days", "Q24h"],
        ["37-44 weeks", "0-7 days", "Q48h"],
        ["37-44 weeks", ">7 days", "Q24h"],
        ["≥45 weeks", "All", "Q24h"]
      ]
    },
    max: "800 mg/day",
    indication: "Candidiasis (oropharyngeal, esophageal, invasive), cryptococcal meningitis, prophylaxis in immunocompromised",
    contraindications: [
      "Hypersensitivity to azole antifungals",
      "Concurrent cisapride, erythromycin, pimozide, quinidine (QT prolongation)"
    ],
    warnings: [
      "QT prolongation",
      "Hepatotoxicity (monitor LFTs)",
      "Drug interactions via CYP450 inhibition",
      "Teratogenic (avoid in pregnancy if possible)"
    ],
    sideEffects: [
      "Common: Nausea, headache, rash, abdominal pain",
      "Less common: Elevated LFTs, QT prolongation",
      "Rare: Hepatic failure, Stevens-Johnson syndrome"
    ],
    interactions: [
      { drug: "Warfarin", effect: "Significantly increased INR" },
      { drug: "Phenytoin", effect: "Increased phenytoin levels" },
      { drug: "Cyclosporine/Tacrolimus", effect: "Increased immunosuppressant levels" },
      { drug: "QT-prolonging drugs", effect: "Additive QT prolongation" },
      { drug: "Rifampin", effect: "Decreased fluconazole effect" }
    ],
    notes: "Excellent oral bioavailability (>90%). Good CSF penetration. NOT effective against Candida krusei, C. glabrata may have reduced susceptibility. IV and PO doses are equivalent.",
    renalAdjust: {
      gfr50: "50% of usual dose or usual dose Q48h",
      gfr30: "50% of usual dose",
      gfr10: "25-50% of usual dose",
      hd: "100% dose after each HD session"
    },
    hepaticAdjust: "Use with caution; monitor LFTs"
  },

  // ============================================================================
  // FUROSEMIDE (Lasix)
  // ============================================================================
  {
    id: "furosemide",
    name: "Furosemide (Lasix)",
    category: "Loop Diuretic",
    route: "PO/IV/IM",
    formulations: [
      { type: "Tablets", strengths: "20 mg, 40 mg, 80 mg" },
      { type: "Solution", strengths: "10 mg/mL, 40 mg/5 mL" },
      { type: "IV/IM", strengths: "10 mg/mL" }
    ],
    doses: {
      neonateBolus: { label: "Neonate (Bolus)", value: "1-2", unit: "mg/kg/dose Q12-24h" },
      neonateInfusion: { label: "Neonate (Infusion)", value: "0.1-0.4", unit: "mg/kg/hr" },
      childBolus: { label: "Child (Bolus)", value: "1-2", unit: "mg/kg/dose Q6-12h", maxDose: 6 },
      childContinuous: { label: "Child (Infusion)", value: "0.05-0.4", unit: "mg/kg/hr" },
      adultBolus: { label: "Adult (Bolus)", value: "20-80", unit: "mg IV/PO Q6-12h", isFixed: true },
      pulmonaryEdema: { label: "Pulmonary Edema", value: "1-2", unit: "mg/kg IV, may repeat in 2h" }
    },
    max: "6 mg/kg/dose; 600 mg/day",
    indication: "Edema (CHF, hepatic, renal), hypertension, hypercalcemia, oliguric renal failure",
    contraindications: [
      "Anuria",
      "Hepatic coma/severe electrolyte depletion",
      "Sulfonamide allergy (use with caution)"
    ],
    warnings: [
      "Ototoxicity (especially with aminoglycosides or rapid IV)",
      "Hypokalemia, hyponatremia, hypomagnesemia",
      "May precipitate hepatic encephalopathy",
      "Sulfonamide cross-reactivity possible"
    ],
    sideEffects: [
      "Common: Hypokalemia, dehydration, hypotension",
      "Electrolytes: Hyponatremia, hypochloremia, hypomagnesemia, hypocalcemia",
      "Serious: Ototoxicity (especially rapid IV or with aminoglycosides)"
    ],
    interactions: [
      { drug: "Aminoglycosides", effect: "⚠️ Increased ototoxicity and nephrotoxicity" },
      { drug: "Digoxin", effect: "Increased toxicity from hypokalemia" },
      { drug: "Lithium", effect: "Increased lithium levels" },
      { drug: "NSAIDs", effect: "Decreased diuretic effect" },
      { drug: "Corticosteroids", effect: "Increased hypokalemia" }
    ],
    notes: "IV:PO ratio 1:2 (40 mg IV = 80 mg PO). Max IV rate 0.5 mg/kg/min (4 mg/min in adults) to prevent ototoxicity. Monitor electrolytes, especially K+. Continuous infusion may be more effective than boluses in resistant edema.",
    renalAdjust: {
      gfr50: "May need higher doses",
      gfr30: "May need higher doses",
      gfr10: "High doses may be needed; ototoxicity risk",
      hd: "No supplement needed"
    },
    hepaticAdjust: "Use with caution; risk of hepatic encephalopathy"
  },

  // ============================================================================
  // GENTAMICIN
  // ============================================================================
  {
    id: "gentamicin",
    name: "Gentamicin (Garamycin)",
    category: "Antibiotic (Aminoglycoside)",
    route: "IV/IM/Topical/Ophthalmic",
    formulations: [
      { type: "IV/IM", strengths: "10 mg/mL, 40 mg/mL" },
      { type: "Ophthalmic", strengths: "0.3% solution/ointment" },
      { type: "Topical", strengths: "0.1% cream/ointment" }
    ],
    doses: {
      onceDaily: { label: "Once Daily (≥1 mo)", value: "5-7.5", unit: "mg/kg/dose Q24h" },
      traditional: { label: "Traditional", value: "2.5", unit: "mg/kg/dose Q8h" },
      cysticFibrosis: { label: "Cystic Fibrosis", value: "10-12", unit: "mg/kg/dose Q24h" },
      synergy: { label: "Synergy (Endocarditis)", value: "3", unit: "mg/kg/day ÷ Q8h (or 1 mg/kg Q8h)" }
    },
    dosingTable: {
      title: "Neonatal Gentamicin Dosing",
      columns: ["PMA (weeks)", "Postnatal Age", "Dose", "Interval"],
      rows: [
        ["≤29", "0-7 days", "5 mg/kg", "Q48h"],
        ["≤29", "8-28 days", "4 mg/kg", "Q36h"],
        ["≤29", "≥29 days", "4 mg/kg", "Q24h"],
        ["30-34", "0-7 days", "4.5 mg/kg", "Q36h"],
        ["30-34", "≥8 days", "4 mg/kg", "Q24h"],
        ["≥35", "All", "4 mg/kg", "Q24h"]
      ]
    },
    max: "7.5 mg/kg/dose; 12 mg/kg/day (CF)",
    indication: "Serious gram-negative infections, synergy for endocarditis, Pseudomonas",
    contraindications: [
      "Known aminoglycoside hypersensitivity"
    ],
    warnings: [
      "Ototoxicity (vestibular > cochlear) - may be irreversible",
      "Nephrotoxicity - usually reversible",
      "Neuromuscular blockade",
      "Monitor levels and renal function"
    ],
    sideEffects: [
      "Nephrotoxicity: Elevated creatinine, acute tubular necrosis",
      "Ototoxicity: Vestibular (vertigo, ataxia), Cochlear (hearing loss)",
      "Neuromuscular: Weakness, paralysis"
    ],
    interactions: [
      { drug: "Other nephrotoxins", effect: "Increased nephrotoxicity (amphotericin, NSAIDs, vancomycin)" },
      { drug: "Loop diuretics", effect: "Increased ototoxicity" },
      { drug: "Neuromuscular blockers", effect: "Enhanced blockade" },
      { drug: "Penicillins", effect: "Synergistic (but may inactivate if mixed)" }
    ],
    notes: "Therapeutic levels: Trough <1 mcg/mL (traditional) or <1 mcg/mL (once daily); Peak 6-10 mcg/mL (traditional) or 15-30 mcg/mL (once daily). Draw trough before dose, peak 30 min after 30-min infusion. Once-daily dosing not for endocarditis.",
    renalAdjust: {
      gfr50: "Q12h",
      gfr30: "Q24h",
      gfr10: "Q48-72h",
      hd: "2 mg/kg after HD, redose per levels"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // HYDROCORTISONE
  // ============================================================================
  {
    id: "hydrocortisone",
    name: "Hydrocortisone (Solu-Cortef)",
    category: "Corticosteroid",
    route: "PO/IV/IM/Topical",
    formulations: [
      { type: "Tablets", strengths: "5 mg, 10 mg, 20 mg" },
      { type: "IV (Solu-Cortef)", strengths: "100 mg, 250 mg, 500 mg, 1 g vials" },
      { type: "Topical", strengths: "0.5%, 1%, 2.5%" }
    ],
    doses: {
      // Adrenal insufficiency
      aiMaintenancePO: { label: "Adrenal Insufficiency (Maintenance)", value: "10-15", unit: "mg/m²/day ÷ Q8h" },
      aiStressDose: { label: "Stress Dose (Minor illness)", value: "30-50", unit: "mg/m²/day ÷ Q6-8h" },
      adrenalCrisis: { label: "Adrenal Crisis", value: "50-100", unit: "mg/m² IV bolus, then 50-100 mg/m²/day ÷ Q6h" },
      // Anti-inflammatory
      antiinflam: { label: "Anti-inflammatory", value: "2.5-10", unit: "mg/kg/day ÷ Q6-8h" },
      // Status asthmaticus
      statusAsthmaticus: { label: "Status Asthmaticus", value: "2", unit: "mg/kg loading (max 100mg), then 0.5-1 mg/kg Q6h" },
      // Septic shock
      septicShock: { label: "Septic Shock", value: "1-2", unit: "mg/kg Q6h (max 50 mg Q6h)" },
      // Physiologic replacement
      physiologic: { label: "Physiologic Replacement", value: "8-10", unit: "mg/m²/day ÷ TID" }
    },
    dosingTable: {
      title: "Stress Dosing for Adrenal Insufficiency",
      columns: ["Stress Level", "Dose"],
      rows: [
        ["Minor (cold, minor procedure)", "2-3x maintenance or 30-50 mg/m²/day"],
        ["Moderate (fever >38.5°C, flu)", "50 mg/m²/day ÷ Q6-8h"],
        ["Major (surgery, trauma, sepsis)", "100 mg/m² bolus + 100 mg/m²/day ÷ Q6h"]
      ]
    },
    max: "500 mg/dose; varies by indication",
    indication: "Adrenal insufficiency, adrenal crisis, septic shock (refractory), anti-inflammatory, asthma",
    contraindications: [
      "Systemic fungal infections (unless treating adrenal insufficiency)",
      "IM route with thrombocytopenia"
    ],
    warnings: [
      "Adrenal suppression with prolonged use",
      "Hyperglycemia",
      "May mask signs of infection",
      "GI ulceration risk"
    ],
    sideEffects: [
      "Short-term: Hyperglycemia, hypertension, mood changes",
      "Long-term: Adrenal suppression, osteoporosis, growth suppression",
      "GI: Peptic ulcer, pancreatitis"
    ],
    interactions: [
      { drug: "NSAIDs", effect: "Increased GI bleeding risk" },
      { drug: "CYP3A4 inducers", effect: "Decreased hydrocortisone effect" },
      { drug: "Warfarin", effect: "Variable effect on INR" },
      { drug: "Vaccines (live)", effect: "Decreased immune response" }
    ],
    notes: "Has mineralocorticoid activity (salt retention) unlike dexamethasone. Preferred for adrenal insufficiency. Physiologic cortisol production: 6-8 mg/m²/day. Stress dosing critical for adrenal patients during illness/surgery.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // IBUPROFEN (Advil, Motrin)
  // ============================================================================
  {
    id: "ibuprofen",
    name: "Ibuprofen (Advil, Motrin)",
    category: "NSAID",
    route: "PO/IV",
    formulations: [
      { type: "Tablets", strengths: "200 mg, 400 mg, 600 mg, 800 mg" },
      { type: "Suspension", strengths: "100 mg/5 mL" },
      { type: "Drops (Infant)", strengths: "40 mg/mL" },
      { type: "IV (Caldolor)", strengths: "800 mg/8 mL" },
      { type: "IV (NeoProfen - PDA)", strengths: "10 mg/mL" }
    ],
    doses: {
      analgesicChild: { label: "Analgesia/Antipyretic (Child)", value: "5-10", unit: "mg/kg/dose Q6-8h", maxDose: 40 },
      antiinflamChild: { label: "Anti-inflammatory (Child)", value: "30-40", unit: "mg/kg/day ÷ Q6h", maxDose: 2400 },
      adultPain: { label: "Adult Pain/Fever", value: "200-400", unit: "mg Q4-6h", isFixed: true, maxDose: 1200 },
      adultAntiinflam: { label: "Adult Anti-inflammatory", value: "400-800", unit: "mg Q6-8h", isFixed: true, maxDose: 3200 },
      pdaClosure: { label: "PDA Closure (Neonate)", value: "10 mg/kg then 5 mg/kg x 2 doses", unit: "Q24h IV", isFixed: true }
    },
    dosingTable: {
      title: "Ibuprofen Dosing by Weight (Fever/Pain)",
      columns: ["Weight (kg)", "Single Dose (mg)", "Drops (40mg/mL)", "Suspension (100mg/5mL)"],
      rows: [
        ["5-6", "50", "1.25 mL", "2.5 mL"],
        ["7-8", "75", "1.875 mL", "3.75 mL"],
        ["9-10", "100", "2.5 mL", "5 mL"],
        ["11-15", "150", "3.75 mL", "7.5 mL"],
        ["16-21", "200", "5 mL", "10 mL"],
        ["22-26", "250", "-", "12.5 mL"],
        ["27-32", "300", "-", "15 mL"],
        [">32", "400", "-", "Use tablets"]
      ]
    },
    max: "40 mg/kg/day or 2400 mg/day (OTC); 3200 mg/day (Rx)",
    indication: "Pain, fever, inflammation, juvenile arthritis, PDA closure (neonates)",
    contraindications: [
      "Active GI bleeding or ulcer",
      "Severe renal impairment",
      "Peri-operative CABG pain",
      "Aspirin-sensitive asthma/urticaria",
      "Third trimester pregnancy"
    ],
    warnings: [
      "⚠️ GI bleeding risk (especially elderly, concurrent anticoagulants)",
      "⚠️ Cardiovascular risk (MI, stroke) with prolonged use",
      "Renal impairment",
      "May mask fever in infection",
      "Not recommended <6 months without physician guidance"
    ],
    sideEffects: [
      "GI: Dyspepsia, nausea, GI bleeding, ulceration",
      "Renal: Decreased GFR, sodium retention, hyperkalemia",
      "CV: Hypertension, edema",
      "Other: Rash, headache, dizziness"
    ],
    interactions: [
      { drug: "Anticoagulants", effect: "Increased bleeding risk" },
      { drug: "Aspirin", effect: "May reduce cardioprotective effect of aspirin" },
      { drug: "ACE inhibitors/ARBs", effect: "Decreased antihypertensive effect, increased renal risk" },
      { drug: "Lithium", effect: "Increased lithium levels" },
      { drug: "Methotrexate", effect: "Increased methotrexate toxicity" },
      { drug: "SSRIs", effect: "Increased GI bleeding risk" }
    ],
    notes: "Give with food to reduce GI upset. Avoid in dehydration, renal disease. For PDA: use IV NeoProfen formulation. Maximum analgesic effect at ~10 mg/kg; higher doses increase anti-inflammatory effect but also toxicity.",
    renalAdjust: {
      gfr50: "Use with caution",
      gfr30: "Avoid if possible",
      gfr10: "Avoid",
      hd: "Not dialyzable; avoid use"
    },
    hepaticAdjust: "Use with caution in hepatic impairment"
  },

  // ============================================================================
  // INSULIN (Regular)
  // ============================================================================
  {
    id: "insulinregular",
    name: "Insulin (Regular)",
    category: "Antidiabetic",
    route: "IV/SC",
    formulations: [
      { type: "IV/SC", strengths: "100 units/mL (U-100)" }
    ],
    doses: {
      dkaInfusion: { label: "DKA Infusion", value: "0.05-0.1", unit: "units/kg/hr", isRate: true },
      dkaBolus: { label: "DKA Bolus (if severe)", value: "0.1", unit: "units/kg IV (optional)" },
      hyperkalemia: { label: "Hyperkalemia", value: "0.1", unit: "units/kg IV with dextrose 0.5 g/kg" },
      tpnAdditive: { label: "TPN Additive", value: "0.05-0.2", unit: "units/g dextrose" },
      scCorrectionChild: { label: "SC Correction (Child)", value: "0.05-0.1", unit: "units/kg Q4-6h PRN" },
      scCorrectionAdult: { label: "SC Correction (Adult)", value: "2-10", unit: "units Q4-6h (per sliding scale)", isFixed: true }
    },
    dosingTable: {
      title: "DKA Management - Insulin Infusion",
      columns: ["Phase", "Rate", "Target"],
      rows: [
        ["Initial", "0.05-0.1 U/kg/hr", "Decrease glucose 50-100 mg/dL/hr"],
        ["Glucose <300", "May add dextrose to fluids", "Continue insulin until gap closed"],
        ["Gap closed, tolerating PO", "Transition to SC insulin", "Overlap IV + SC by 30-60 min"]
      ]
    },
    max: "Titrate to effect; no fixed maximum",
    indication: "DKA, hyperglycemia, hyperkalemia",
    contraindications: [
      "Hypoglycemia"
    ],
    warnings: [
      "⚠️ Hypoglycemia - monitor glucose frequently",
      "⚠️ Hypokalemia with treatment - monitor K+ closely",
      "In DKA: do not stop insulin until gap closed (even if glucose normal)",
      "Adsorbs to IV tubing - flush new tubing"
    ],
    sideEffects: [
      "Common: Hypoglycemia, injection site reactions",
      "Less common: Hypokalemia, weight gain",
      "Rare: Allergic reactions"
    ],
    interactions: [
      { drug: "Beta-blockers", effect: "May mask hypoglycemia symptoms" },
      { drug: "Corticosteroids", effect: "Increased insulin requirements" },
      { drug: "Thiazides", effect: "May increase blood glucose" }
    ],
    notes: "Regular insulin is the only insulin for IV use. Onset SC: 30-60 min; IV: immediate. Duration SC: 6-8 hours. For new IV tubing: flush with insulin-containing solution. In hyperkalemia: always give with dextrose to prevent hypoglycemia.",
    renalAdjust: "May need reduced dose (decreased insulin clearance)",
    hepaticAdjust: "May need reduced dose"
  },

  // ============================================================================
  // IPRATROPIUM BROMIDE (Atrovent)
  // ============================================================================
  {
    id: "ipratropium",
    name: "Ipratropium Bromide (Atrovent)",
    category: "Anticholinergic Bronchodilator",
    route: "Inhaled",
    formulations: [
      { type: "Nebulizer solution", strengths: "0.02% (500 mcg/2.5 mL)" },
      { type: "MDI", strengths: "17 mcg/actuation" },
      { type: "Nasal spray", strengths: "0.03%, 0.06%" }
    ],
    doses: {
      acuteAsthma: { label: "Acute Asthma (Neb)", value: "250-500", unit: "mcg Q20min x 3 doses with albuterol" },
      acuteAsthmaMDI: { label: "Acute Asthma (MDI)", value: "4-8", unit: "puffs Q20min x 3 doses", isFixed: true },
      maintenanceNeb: { label: "Maintenance (Neb)", value: "250-500", unit: "mcg Q6-8h" },
      maintenanceMDI: { label: "Maintenance (MDI)", value: "2-3", unit: "puffs Q6h", isFixed: true },
      rhinorrhea: { label: "Rhinorrhea (Nasal)", value: "2 sprays", unit: "per nostril BID-TID", isFixed: true }
    },
    max: "2 mg/day nebulized; 12 puffs/day MDI",
    indication: "Acute asthma (with albuterol), COPD, rhinorrhea",
    contraindications: [
      "Hypersensitivity to ipratropium or atropine derivatives",
      "Hypersensitivity to soy lecithin or peanuts (MDI)"
    ],
    warnings: [
      "Not for acute bronchospasm as monotherapy",
      "May cause paradoxical bronchospasm",
      "Use with caution in narrow-angle glaucoma",
      "Avoid spraying in eyes"
    ],
    sideEffects: [
      "Common: Dry mouth, cough, headache",
      "Less common: Dizziness, nausea",
      "Rare: Paradoxical bronchospasm, urinary retention, glaucoma"
    ],
    interactions: [
      { drug: "Other anticholinergics", effect: "Additive anticholinergic effects" },
      { drug: "Potassium chloride (oral)", effect: "Increased GI ulceration risk" }
    ],
    notes: "Most effective when combined with albuterol in acute asthma. First 3 doses in ED show benefit; continued use shows minimal additional benefit. Onset: 15-30 min; Peak: 1-2 hours; Duration: 4-6 hours.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // KETAMINE
  // ============================================================================
  {
    id: "ketamine",
    name: "Ketamine (Ketalar)",
    category: "Dissociative Anesthetic",
    route: "IV/IM/IN/PO",
    formulations: [
      { type: "Injection", strengths: "10 mg/mL, 50 mg/mL, 100 mg/mL" }
    ],
    doses: {
      sedationIV: { label: "Procedural Sedation (IV)", value: "1-2", unit: "mg/kg IV over 1-2 min", maxDose: 150 },
      sedationIM: { label: "Procedural Sedation (IM)", value: "4-5", unit: "mg/kg IM", maxDose: 150 },
      analgesiaIV: { label: "Analgesia (IV)", value: "0.1-0.5", unit: "mg/kg IV" },
      intranasal: { label: "Intranasal", value: "3-6", unit: "mg/kg IN (divide between nostrils)" },
      rsi: { label: "RSI Induction", value: "1-2", unit: "mg/kg IV" },
      infusion: { label: "Sedation Infusion", value: "0.5-2", unit: "mg/kg/hr" }
    },
    max: "150 mg/dose (most indications)",
    indication: "Procedural sedation, analgesia, RSI (especially in bronchospasm/hypotension)",
    contraindications: [
      "Age <3 months (relative)",
      "Conditions where increased ICP is hazardous",
      "Severe hypertension",
      "Psychosis",
      "Porphyria"
    ],
    warnings: [
      "Emergence reactions more common in adults",
      "Increased salivation - consider glycopyrrolate or atropine",
      "Laryngospasm (rare but serious)",
      "May increase ICP and IOP",
      "Maintain NPO status as for general anesthesia"
    ],
    sideEffects: [
      "Common: Nystagmus, hypertension, tachycardia, increased salivation",
      "Less common: Emergence reactions, nausea/vomiting",
      "Rare: Laryngospasm, respiratory depression, apnea"
    ],
    interactions: [
      { drug: "Benzodiazepines", effect: "May reduce emergence reactions" },
      { drug: "Theophylline", effect: "May lower seizure threshold" },
      { drug: "Thyroid hormones", effect: "May increase BP and HR" }
    ],
    notes: "Dissociative state provides analgesia, sedation, and amnesia. Maintains airway reflexes and spontaneous respiration. Bronchodilator properties. Onset IV: 30-60 sec; IM: 3-4 min. Duration IV: 10-15 min; IM: 20-30 min. Consider midazolam 0.05 mg/kg to reduce emergence reactions.",
    renalAdjust: null,
    hepaticAdjust: "Use with caution in hepatic impairment"
  },

  // ============================================================================
  // LABETALOL
  // ============================================================================
  {
    id: "labetalol",
    name: "Labetalol (Trandate)",
    category: "Alpha/Beta-blocker",
    route: "IV/PO",
    formulations: [
      { type: "Tablets", strengths: "100 mg, 200 mg, 300 mg" },
      { type: "Injection", strengths: "5 mg/mL" }
    ],
    doses: {
      hypertensiveIVBolus: { label: "HTN Emergency (IV Bolus)", value: "0.2-1", unit: "mg/kg/dose Q10min", maxDose: 40 },
      hypertensiveInfusion: { label: "HTN Emergency (Infusion)", value: "0.25-3", unit: "mg/kg/hr" },
      hypertensionPO: { label: "Hypertension (PO)", value: "1-3", unit: "mg/kg/dose Q8-12h", maxDose: 10, maxUnit: "mg/kg/day" },
      adultIVBolus: { label: "Adult IV Bolus", value: "20", unit: "mg IV, then 40-80 mg Q10min (max 300 mg)", isFixed: true },
      adultPO: { label: "Adult PO", value: "100-400", unit: "mg BID-TID", isFixed: true }
    },
    max: "40 mg/dose (child IV); 300 mg total (adult IV); 2400 mg/day PO",
    indication: "Hypertensive emergency/urgency, chronic hypertension",
    contraindications: [
      "Cardiogenic shock",
      "Severe bradycardia, heart block (2nd/3rd degree)",
      "Decompensated heart failure",
      "Bronchial asthma, severe COPD"
    ],
    warnings: [
      "Do not stop abruptly",
      "May mask hypoglycemia symptoms in diabetics",
      "Worsening heart failure",
      "Hepatic injury (rare but severe)"
    ],
    sideEffects: [
      "Common: Dizziness, fatigue, nausea, orthostatic hypotension",
      "Less common: Bradycardia, bronchospasm, scalp tingling",
      "Rare: Hepatotoxicity, lupus-like syndrome"
    ],
    interactions: [
      { drug: "Calcium channel blockers", effect: "Increased risk of bradycardia/hypotension" },
      { drug: "Clonidine", effect: "Rebound hypertension if clonidine stopped" },
      { drug: "Insulin", effect: "May mask hypoglycemia symptoms" },
      { drug: "Inhalational anesthetics", effect: "Increased hypotension" }
    ],
    notes: "Combined α1 and β-blocker (α:β ratio 1:7 PO, 1:3 IV). Preferred in pregnancy-induced hypertension. Onset IV: 2-5 min; PO: 1-2 hr. Peak: 5-15 min IV. Keep patient supine during IV infusion.",
    renalAdjust: null,
    hepaticAdjust: "Use with caution; monitor LFTs"
  },

  // ============================================================================
  // LEVETIRACETAM (Keppra)
  // ============================================================================
  {
    id: "levetiracetam",
    name: "Levetiracetam (Keppra)",
    category: "Anticonvulsant",
    route: "IV/PO",
    formulations: [
      { type: "Tablets", strengths: "250 mg, 500 mg, 750 mg, 1000 mg" },
      { type: "XR tablets", strengths: "500 mg, 750 mg" },
      { type: "Solution", strengths: "100 mg/mL" },
      { type: "Injection", strengths: "100 mg/mL" }
    ],
    doses: {
      statusLoading: { label: "Status Epilepticus Loading", value: "20-60", unit: "mg/kg IV (max 4500 mg)" },
      seizuresMaintChild: { label: "Seizures (Child 1mo-6mo)", value: "14", unit: "mg/kg/day ÷ BID, increase Q2wk to 42 mg/kg/day" },
      seizuresMaint4to16: { label: "Seizures (4-16 yr)", value: "20", unit: "mg/kg/day ÷ BID, increase Q2wk to 60 mg/kg/day" },
      seizuresAdult: { label: "Seizures (Adult)", value: "500", unit: "mg BID, increase Q2wk to 1500 mg BID", isFixed: true },
      neonatal: { label: "Neonatal Seizures", value: "20-40", unit: "mg/kg/day ÷ Q12h" }
    },
    dosingTable: {
      title: "Levetiracetam Pediatric Dosing by Age",
      columns: ["Age", "Initial Dose", "Target Dose", "Max Dose"],
      rows: [
        ["1-6 mo", "14 mg/kg/day", "42 mg/kg/day", "42 mg/kg/day"],
        ["6 mo-4 yr", "20 mg/kg/day", "50 mg/kg/day", "50 mg/kg/day"],
        ["4-16 yr", "20 mg/kg/day", "60 mg/kg/day", "3000 mg/day"],
        [">16 yr", "500 mg BID", "1500 mg BID", "3000 mg/day"]
      ]
    },
    max: "3000 mg/day; 4500 mg loading dose",
    indication: "Partial onset seizures, generalized tonic-clonic seizures, myoclonic seizures, status epilepticus",
    contraindications: [
      "Hypersensitivity to levetiracetam"
    ],
    warnings: [
      "Behavioral/psychiatric symptoms (irritability, aggression, depression)",
      "Suicidal ideation",
      "Somnolence and fatigue",
      "Do not discontinue abruptly"
    ],
    sideEffects: [
      "Common: Somnolence, asthenia, dizziness, behavioral changes",
      "Psychiatric: Irritability, aggression, depression, anxiety",
      "Less common: Headache, anorexia, infection"
    ],
    interactions: [
      { drug: "CNS depressants", effect: "Additive sedation" },
      { drug: "Carbamazepine", effect: "May decrease levetiracetam levels" }
    ],
    notes: "Minimal drug interactions (not CYP450 metabolized). Renally excreted. No therapeutic drug monitoring needed. Pyridoxine (Vitamin B6) may help with behavioral side effects. IV and PO bioequivalent.",
    renalAdjust: {
      gfr50: "250-750 mg Q12h",
      gfr30: "250-500 mg Q12h",
      gfr10: "250-500 mg Q24h",
      hd: "500-1000 mg Q24h + 250-500 mg supplement after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // LIDOCAINE
  // ============================================================================
  {
    id: "lidocaine",
    name: "Lidocaine (Xylocaine)",
    category: "Antiarrhythmic/Local Anesthetic",
    route: "IV/IO/ETT/Topical",
    formulations: [
      { type: "Injection", strengths: "0.5%, 1%, 2% (with/without epinephrine)" },
      { type: "IV (cardiac)", strengths: "10 mg/mL, 20 mg/mL" },
      { type: "Topical gel", strengths: "2%, 4%" },
      { type: "Topical ointment", strengths: "5%" },
      { type: "Viscous solution", strengths: "2%" }
    ],
    doses: {
      vfPvtBolus: { label: "VF/pVT (IV/IO)", value: "1", unit: "mg/kg IV/IO bolus (max 100 mg)", maxDose: 100 },
      infusion: { label: "Antiarrhythmic Infusion", value: "20-50", unit: "mcg/kg/min" },
      ettDose: { label: "ETT Dose", value: "2-3", unit: "mg/kg (2-3x IV dose)" },
      localMax: { label: "Local Anesthesia (max)", value: "4.5", unit: "mg/kg without epi; 7 mg/kg with epi" },
      topicalChild: { label: "Topical (Child)", value: "3", unit: "mg/kg/dose (max 4.5 mg/kg)" }
    },
    dosingTable: {
      title: "Lidocaine Maximum Doses for Local Anesthesia",
      columns: ["Solution", "Without Epinephrine", "With Epinephrine"],
      rows: [
        ["Plain lidocaine", "4.5 mg/kg", "7 mg/kg"],
        ["Max single dose (adult)", "300 mg", "500 mg"]
      ]
    },
    max: "100 mg/bolus; 3-5 mg/kg total in first hour; 4.5 mg/kg local (7 mg/kg with epi)",
    indication: "VF/pVT, ventricular arrhythmias, local anesthesia, topical analgesia",
    contraindications: [
      "Stokes-Adams syndrome",
      "Wolff-Parkinson-White syndrome",
      "Severe degrees of SA, AV, or intraventricular block"
    ],
    warnings: [
      "Toxicity: CNS excitation then depression, seizures, cardiovascular collapse",
      "Toxicity threshold lower in neonates",
      "Methemoglobinemia with topical overuse",
      "Do not use topical on mucous membranes in infants"
    ],
    sideEffects: [
      "CNS: Drowsiness, dizziness, confusion, seizures (toxicity)",
      "Cardiovascular: Bradycardia, hypotension, arrhythmias (toxicity)",
      "Local: Burning, swelling at injection site"
    ],
    interactions: [
      { drug: "Beta-blockers", effect: "Increased lidocaine levels" },
      { drug: "Cimetidine", effect: "Increased lidocaine levels" },
      { drug: "Class I antiarrhythmics", effect: "Additive cardiac effects" }
    ],
    notes: "For cardiac arrest: may repeat Q5-10 min x2 (max 3 mg/kg total). Therapeutic level: 1.5-5 mcg/mL. Toxic level: >6 mcg/mL. Half-life: neonates 3.2 hr, adults 1.5-2 hr. Lipid emulsion (Intralipid 20%) is treatment for severe local anesthetic toxicity.",
    renalAdjust: null,
    hepaticAdjust: "Reduce dose in severe hepatic impairment"
  },

  // ============================================================================
  // LORAZEPAM (Ativan)
  // ============================================================================
  {
    id: "lorazepam",
    name: "Lorazepam (Ativan)",
    category: "Benzodiazepine",
    route: "IV/IM/PO/SL",
    formulations: [
      { type: "Tablets", strengths: "0.5 mg, 1 mg, 2 mg" },
      { type: "Oral solution", strengths: "2 mg/mL" },
      { type: "Injection", strengths: "2 mg/mL, 4 mg/mL (contains propylene glycol/polyethylene glycol)" }
    ],
    doses: {
      statusNeonate: { label: "Status (Neonate)", value: "0.05-0.1", unit: "mg/kg IV over 2-5 min", maxDose: 2 },
      statusChild: { label: "Status Epilepticus (Child)", value: "0.05-0.1", unit: "mg/kg IV over 2-5 min", maxDose: 4 },
      statusAdult: { label: "Status (Adult)", value: "4", unit: "mg IV, may repeat in 10-15 min", isFixed: true, maxDose: 8 },
      sedation: { label: "Sedation", value: "0.02-0.05", unit: "mg/kg/dose Q4-8h" },
      anxiolysis: { label: "Anxiolysis/Premedication", value: "0.02-0.05", unit: "mg/kg (max 2 mg)" },
      antiemeticChild: { label: "Antiemetic (chemo)", value: "0.04-0.08", unit: "mg/kg/dose Q6h (max 4 mg/dose)" }
    },
    max: "2 mg/dose (neonate); 4 mg/dose (child); 8 mg total (adult status)",
    indication: "Status epilepticus, seizure rescue, sedation, anxiety, chemotherapy-induced nausea",
    contraindications: [
      "Acute narrow-angle glaucoma",
      "Sleep apnea (relative)",
      "Severe respiratory insufficiency"
    ],
    warnings: [
      "Respiratory depression - have resuscitation equipment ready",
      "Paradoxical reactions (especially in children)",
      "Propylene glycol toxicity with high doses/prolonged infusion",
      "Physical dependence with prolonged use"
    ],
    sideEffects: [
      "Common: Sedation, dizziness, weakness, ataxia",
      "Less common: Respiratory depression, hypotension",
      "IV-specific: Propylene glycol toxicity (metabolic acidosis, hyperosmolality)"
    ],
    interactions: [
      { drug: "CNS depressants/opioids", effect: "Additive respiratory depression" },
      { drug: "Probenecid/valproate", effect: "Increased lorazepam levels" },
      { drug: "Scopolamine", effect: "Increased sedation, hallucinations" }
    ],
    notes: "First-line for status epilepticus due to rapid onset and longer duration than diazepam. Give IV slowly over 2-5 minutes. May repeat in 10-15 min if seizure persists. Onset IV: 1-5 min; IM: 15-30 min. Duration: 6-8 hours. Refrigerate injection (stable at room temp for 60 days).",
    renalAdjust: "Use with caution; active metabolite may accumulate",
    hepaticAdjust: "Use with caution in severe impairment"
  },

  // ============================================================================
  // MAGNESIUM SULFATE
  // ============================================================================
  {
    id: "magnesiumsulfate",
    name: "Magnesium Sulfate",
    category: "Electrolyte/Antiarrhythmic",
    route: "IV/IM/PO",
    formulations: [
      { type: "Injection", strengths: "50% (500 mg/mL = 4 mEq/mL)" },
      { type: "Injection (diluted)", strengths: "4%, 8% in D5W" },
      { type: "Oral", strengths: "Various (see magnesium oxide, citrate, etc.)" }
    ],
    doses: {
      hypoMgMild: { label: "Mild Hypomagnesemia (IV)", value: "25-50", unit: "mg/kg/dose Q4-6h x 3-4 doses" },
      hypoMgSevere: { label: "Severe Hypomagnesemia (IV)", value: "25-50", unit: "mg/kg over 2-4h (max 2g)" },
      asthma: { label: "Severe Asthma (IV)", value: "25-75", unit: "mg/kg over 20 min (max 2g)" },
      torsades: { label: "Torsades de Pointes (IV)", value: "25-50", unit: "mg/kg IV push (max 2g)" },
      eclampsia: { label: "Eclampsia (Adult)", value: "4-6", unit: "g IV over 15-20 min, then 1-2 g/hr", isFixed: true },
      constipation: { label: "Constipation (PO)", value: "0.25-0.5", unit: "g/kg (max 30g)" }
    },
    dosingTable: {
      title: "Magnesium Correction - IV Dosing",
      columns: ["Mg Level", "Dose", "Rate"],
      rows: [
        ["1.5-1.9 mg/dL", "25-50 mg/kg", "Over 4-6 hours"],
        ["1.0-1.4 mg/dL", "50-75 mg/kg", "Over 4-6 hours"],
        ["<1.0 mg/dL", "75-100 mg/kg", "Over 4-6 hours + repeat PRN"]
      ]
    },
    max: "2 g/dose IV; 30 g/day PO",
    indication: "Hypomagnesemia, severe asthma, torsades de pointes, eclampsia/preeclampsia, constipation",
    contraindications: [
      "Heart block",
      "Myocardial damage",
      "Renal failure (relative - use with caution)"
    ],
    warnings: [
      "Monitor for hypermagnesemia (loss of reflexes, respiratory depression, cardiac arrest)",
      "Rapid IV may cause hypotension, flushing, sweating",
      "Have calcium gluconate available as antidote",
      "Monitor renal function"
    ],
    sideEffects: [
      "IV: Flushing, hypotension, bradycardia, respiratory depression",
      "PO: Diarrhea, abdominal cramping",
      "Toxicity: Loss of deep tendon reflexes (5-7 mEq/L), respiratory paralysis (10-15 mEq/L)"
    ],
    interactions: [
      { drug: "Calcium channel blockers", effect: "Additive hypotension" },
      { drug: "Neuromuscular blockers", effect: "Prolonged paralysis" },
      { drug: "Aminoglycosides", effect: "Additive neuromuscular blockade" }
    ],
    notes: "For torsades: give IV push. For asthma: give over 20 min. Monitor Mg levels, deep tendon reflexes. Therapeutic level: 4-6 mEq/L (seizure prophylaxis). Antidote: Calcium gluconate 100-200 mg/kg IV slowly.",
    renalAdjust: {
      gfr50: "75% dose",
      gfr30: "50% dose",
      gfr10: "25-50% dose",
      hd: "Avoid unless essential; monitor levels closely"
    },
    hepaticAdjust: null
  },

  // ============================================================================
  // MANNITOL
  // ============================================================================
  {
    id: "mannitol",
    name: "Mannitol (Osmitrol)",
    category: "Osmotic Diuretic",
    route: "IV",
    formulations: [
      { type: "Injection", strengths: "5%, 10%, 15%, 20%, 25%" }
    ],
    doses: {
      cerebralEdema: { label: "Cerebral Edema/ICP", value: "0.25-1", unit: "g/kg IV over 20-30 min" },
      acuteICP: { label: "Acute ICP Crisis", value: "1", unit: "g/kg IV over 10-20 min" },
      oliguria: { label: "Oliguria (test dose)", value: "0.2", unit: "g/kg IV over 3-5 min" },
      glaucoma: { label: "Acute Glaucoma", value: "0.25-0.5", unit: "g/kg IV over 30-60 min" }
    },
    max: "1 g/kg/dose; may repeat Q4-6h; max 6 g/kg/day",
    indication: "Cerebral edema, raised ICP, acute glaucoma, oliguria/acute renal failure (to promote diuresis)",
    contraindications: [
      "Anuria (established renal failure)",
      "Severe dehydration",
      "Active intracranial bleeding (except during craniotomy)",
      "Pulmonary edema or severe pulmonary congestion"
    ],
    warnings: [
      "Monitor serum osmolality (keep <320 mOsm/kg)",
      "Osmolar gap >10 suggests accumulation",
      "Rebound ICP elevation possible",
      "May cause acute renal failure with high doses"
    ],
    sideEffects: [
      "Common: Thirst, nausea, headache, urinary frequency",
      "Fluid/electrolyte: Hyponatremia, hypernatremia (late), hypokalemia",
      "Serious: Pulmonary edema, acute renal failure, rebound ICP"
    ],
    interactions: [
      { drug: "Lithium", effect: "Increased lithium excretion" },
      { drug: "Other diuretics", effect: "Additive effect" },
      { drug: "Nephrotoxic drugs", effect: "Increased renal injury risk" }
    ],
    notes: "Use filter (5 micron) for 20% and 25% concentrations. Onset: 30-60 min for diuresis; 15-30 min for ICP reduction. Duration ICP effect: 3-8 hours. Insert urinary catheter before use. May crystallize at low temperatures - warm and shake before use.",
    renalAdjust: {
      gfr50: "Use with caution",
      gfr30: "Avoid if possible",
      gfr10: "Contraindicated",
      hd: "Contraindicated"
    },
    hepaticAdjust: null
  },

  // ============================================================================
  // MEROPENEM
  // ============================================================================
  {
    id: "meropenem",
    name: "Meropenem (Merrem)",
    category: "Antibiotic (Carbapenem)",
    route: "IV",
    formulations: [
      { type: "Injection", strengths: "500 mg, 1 g vials" }
    ],
    doses: {
      neoUnder32wk: { label: "Neonate ≤32wk PMA", value: "20", unit: "mg/kg/dose Q12h IV" },
      neo32to40wk: { label: "Neonate 32-40wk PMA", value: "20", unit: "mg/kg/dose Q8h IV" },
      standard: { label: "Standard (Child)", value: "20", unit: "mg/kg/dose Q8h", maxDose: 1000 },
      meningitis: { label: "Meningitis", value: "40", unit: "mg/kg/dose Q8h", maxDose: 2000 },
      febrileNeutropenia: { label: "Febrile Neutropenia", value: "20", unit: "mg/kg/dose Q8h", maxDose: 1000 },
      cfPseudomonas: { label: "CF/Pseudomonas", value: "40", unit: "mg/kg/dose Q8h", maxDose: 2000 },
      adultStandard: { label: "Adult Standard", value: "1", unit: "g Q8h", isFixed: true },
      adultSevere: { label: "Adult Severe", value: "2", unit: "g Q8h", isFixed: true }
    },
    dosingTable: {
      title: "Neonatal Meropenem Dosing",
      columns: ["PMA (weeks)", "Postnatal Age", "Dose", "Interval"],
      rows: [
        ["≤32", "All", "20 mg/kg", "Q12h"],
        ["32-40", "0-7 days", "20 mg/kg", "Q12h"],
        ["32-40", ">7 days", "20 mg/kg", "Q8h"],
        [">40", "All", "20 mg/kg", "Q8h"]
      ]
    },
    max: "2 g/dose; 6 g/day",
    indication: "Complicated intra-abdominal infections, meningitis, febrile neutropenia, Pseudomonas, ESBL-producing organisms",
    contraindications: [
      "History of anaphylaxis to carbapenems or beta-lactams"
    ],
    warnings: [
      "Seizure risk (lower than imipenem)",
      "Cross-reactivity with penicillins",
      "C. difficile colitis",
      "May reduce valproic acid levels significantly"
    ],
    sideEffects: [
      "Common: Diarrhea, nausea, rash, headache",
      "Less common: Seizures, thrombocytopenia, elevated LFTs",
      "Rare: Anaphylaxis, Stevens-Johnson syndrome"
    ],
    interactions: [
      { drug: "Valproic acid", effect: "Dramatically reduces valproate levels - avoid combination" },
      { drug: "Probenecid", effect: "Increases meropenem levels" }
    ],
    notes: "Broad spectrum including most gram-negatives, gram-positives, and anaerobes. Does NOT cover MRSA or Enterococcus faecium. Extended infusion (3 hours) may improve outcomes in serious infections. Lower seizure risk than imipenem.",
    renalAdjust: {
      gfr50: "100% dose Q8-12h",
      gfr30: "50% dose Q12h",
      gfr10: "50% dose Q24h",
      hd: "Dose after HD; supplement 500 mg"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // METHADONE
  // ============================================================================
  {
    id: "methadone",
    name: "Methadone (Dolophine)",
    category: "Opioid Analgesic",
    route: "PO/IV/IM/SC",
    formulations: [
      { type: "Tablets", strengths: "5 mg, 10 mg" },
      { type: "Oral solution", strengths: "5 mg/5 mL, 10 mg/5 mL" },
      { type: "Oral concentrate", strengths: "10 mg/mL" },
      { type: "Injection", strengths: "10 mg/mL" }
    ],
    doses: {
      analgesiaChild: { label: "Analgesia (Child)", value: "0.7", unit: "mg/kg/day ÷ Q4-6h", maxDose: 10, maxUnit: "mg/dose" },
      analgesiaAdult: { label: "Analgesia (Adult)", value: "2.5-10", unit: "mg Q8-12h", isFixed: true },
      nasNeonatal: { label: "NAS (Neonatal)", value: "0.05-0.1", unit: "mg/kg/dose Q6h, titrate per NAS score" },
      iatrogenicWithdrawal: { label: "Iatrogenic Withdrawal", value: "0.05-0.1", unit: "mg/kg/dose Q6h, wean 10-20%/day" }
    },
    max: "10 mg/dose (child); titrate in adults",
    indication: "Severe pain, neonatal abstinence syndrome (NAS), opioid withdrawal, iatrogenic withdrawal",
    contraindications: [
      "Significant respiratory depression",
      "Acute or severe bronchial asthma",
      "Paralytic ileus"
    ],
    warnings: [
      "⚠️ QT prolongation - obtain baseline ECG",
      "⚠️ Highly variable half-life (15-60 hours) - accumulation risk",
      "Respiratory depression may be delayed",
      "Incomplete cross-tolerance with other opioids"
    ],
    sideEffects: [
      "Common: Sedation, nausea, constipation, sweating",
      "Cardiovascular: QT prolongation, torsades de pointes",
      "Serious: Respiratory depression, hypotension"
    ],
    interactions: [
      { drug: "QT-prolonging drugs", effect: "Additive QT prolongation" },
      { drug: "CYP3A4 inhibitors", effect: "Increased methadone levels" },
      { drug: "CYP3A4 inducers", effect: "Decreased methadone levels (rifampin, phenytoin)" },
      { drug: "Benzodiazepines", effect: "Increased respiratory depression" }
    ],
    notes: "Long and variable half-life requires careful titration. Start low, go slow. Peak effect may not occur for 3-5 days. For NAS: titrate based on Finnegan or other NAS scoring. ECG monitoring recommended (QTc >500 ms is concerning).",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "50-75% dose",
      gfr10: "50% dose",
      hd: "No supplement"
    },
    hepaticAdjust: "Use with caution; reduce dose in severe impairment"
  },

  // ============================================================================
  // METOCLOPRAMIDE (Reglan)
  // ============================================================================
  {
    id: "metoclopramide",
    name: "Metoclopramide (Reglan)",
    category: "Prokinetic/Antiemetic",
    route: "IV/IM/PO",
    formulations: [
      { type: "Tablets", strengths: "5 mg, 10 mg" },
      { type: "ODT", strengths: "5 mg, 10 mg" },
      { type: "Solution", strengths: "5 mg/5 mL" },
      { type: "Injection", strengths: "5 mg/mL" }
    ],
    doses: {
      gerdChild: { label: "GERD (Child)", value: "0.1-0.2", unit: "mg/kg/dose Q6-8h", maxDose: 0.5, maxUnit: "mg/kg/day" },
      gastroparesis: { label: "Gastroparesis (Adult)", value: "10", unit: "mg QID (30 min AC + HS)", isFixed: true },
      antiemeticChild: { label: "Antiemetic (Child)", value: "0.1-0.2", unit: "mg/kg/dose Q6-8h (max 0.5 mg/kg/day)" },
      antiemeticChemo: { label: "Chemo-induced (High dose)", value: "1-2", unit: "mg/kg/dose IV" },
      facilitateIntubation: { label: "Facilitate NG/Intubation", value: "0.1", unit: "mg/kg IV x1 (max 10 mg)" }
    },
    max: "0.5 mg/kg/day or 10 mg/dose (standard); 2 mg/kg/dose (high-dose antiemetic)",
    indication: "GERD, gastroparesis, nausea/vomiting, facilitate intubation",
    contraindications: [
      "GI obstruction, perforation, or hemorrhage",
      "Pheochromocytoma",
      "Seizure disorder",
      "Concurrent use of drugs causing extrapyramidal reactions"
    ],
    warnings: [
      "⚠️ BLACK BOX: Tardive dyskinesia with prolonged use (>12 weeks)",
      "Extrapyramidal symptoms (especially in children)",
      "Neuroleptic malignant syndrome (rare)",
      "Depression"
    ],
    sideEffects: [
      "Common: Restlessness, drowsiness, fatigue, diarrhea",
      "Extrapyramidal: Dystonia, akathisia, parkinsonism",
      "Serious: Tardive dyskinesia (may be irreversible), NMS"
    ],
    interactions: [
      { drug: "Antipsychotics", effect: "Increased extrapyramidal effects" },
      { drug: "MAO inhibitors", effect: "Hypertensive crisis risk" },
      { drug: "Levodopa", effect: "Decreased levodopa effect" },
      { drug: "CNS depressants", effect: "Additive sedation" }
    ],
    notes: "Limit use to <12 weeks to reduce tardive dyskinesia risk. Diphenhydramine can treat acute dystonic reactions. Give 30 min before meals. High-dose antiemetic use requires pretreatment with diphenhydramine.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "50% dose",
      gfr10: "50% dose",
      hd: "No supplement"
    },
    hepaticAdjust: "Reduce dose in severe impairment"
  },

  // ============================================================================
  // METRONIDAZOLE (Flagyl)
  // ============================================================================
  {
    id: "metronidazole",
    name: "Metronidazole (Flagyl)",
    category: "Antibiotic/Antiprotozoal",
    route: "IV/PO",
    formulations: [
      { type: "Tablets", strengths: "250 mg, 500 mg" },
      { type: "Capsules", strengths: "375 mg" },
      { type: "Suspension", strengths: "Compounded" },
      { type: "Injection", strengths: "5 mg/mL (500 mg/100 mL)" },
      { type: "Topical", strengths: "0.75%, 1% gel/cream" }
    ],
    doses: {
      neoUnder27wk: { label: "Neonate <27wk PMA", value: "7.5", unit: "mg/kg/dose Q48h" },
      neo27to33wk: { label: "Neonate 27-33wk PMA", value: "7.5", unit: "mg/kg/dose Q24h" },
      neoOver33wk: { label: "Neonate >33wk PMA", value: "7.5", unit: "mg/kg/dose Q12h" },
      anaerobicChild: { label: "Anaerobic (Child)", value: "22.5-40", unit: "mg/kg/day ÷ Q8h", maxDose: 4000 },
      cdiffChild: { label: "C. diff (Child)", value: "30", unit: "mg/kg/day ÷ Q6h PO (max 2g/day)" },
      amebiasis: { label: "Amebiasis", value: "35-50", unit: "mg/kg/day ÷ Q8h x 10 days" },
      giardia: { label: "Giardiasis", value: "15-30", unit: "mg/kg/day ÷ TID x 5-7 days" },
      hPylori: { label: "H. pylori", value: "20", unit: "mg/kg/day ÷ BID (with PPI + amoxicillin)" },
      bacterialVaginosis: { label: "Bacterial Vaginosis", value: "500", unit: "mg BID x 7 days OR 2g x 1", isFixed: true }
    },
    max: "4 g/day",
    indication: "Anaerobic infections, C. difficile colitis, amebiasis, giardiasis, trichomoniasis, bacterial vaginosis, H. pylori",
    contraindications: [
      "First trimester pregnancy (relative)",
      "Hypersensitivity to nitroimidazoles"
    ],
    warnings: [
      "Disulfiram-like reaction with alcohol",
      "Peripheral neuropathy with prolonged use",
      "Seizures (rare)",
      "Carcinogenic in rodents (clinical significance unknown)"
    ],
    sideEffects: [
      "Common: Nausea, metallic taste, headache, dark urine",
      "GI: Abdominal pain, diarrhea, glossitis",
      "Neurologic: Peripheral neuropathy, dizziness, seizures (rare)"
    ],
    interactions: [
      { drug: "Alcohol", effect: "Disulfiram-like reaction (nausea, vomiting, flushing)" },
      { drug: "Warfarin", effect: "Increased anticoagulant effect" },
      { drug: "Lithium", effect: "Increased lithium toxicity" },
      { drug: "Phenytoin", effect: "Increased phenytoin levels" }
    ],
    notes: "Excellent anaerobic coverage. First-line for C. diff (mild-moderate). Avoid alcohol during treatment and for 3 days after. Can be given with or without food. IV and PO bioequivalent.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "No change",
      gfr10: "50% dose or extend interval",
      hd: "Dose after HD; supplement 500 mg"
    },
    hepaticAdjust: "Reduce dose by 50% in severe impairment"
  },

  // ============================================================================
  // MIDAZOLAM (Versed)
  // ============================================================================
  {
    id: "midazolam",
    name: "Midazolam (Versed)",
    category: "Benzodiazepine",
    route: "IV/IM/IN/PO/Buccal",
    formulations: [
      { type: "Injection", strengths: "1 mg/mL, 5 mg/mL" },
      { type: "Syrup", strengths: "2 mg/mL" },
      { type: "Nasal spray (Nayzilam)", strengths: "5 mg/0.1 mL" },
      { type: "Buccal (Buccolam)", strengths: "2.5 mg, 5 mg, 7.5 mg, 10 mg" }
    ],
    doses: {
      sedationIV: { label: "Sedation (IV)", value: "0.05-0.1", unit: "mg/kg IV", maxDose: 10 },
      sedationIM: { label: "Sedation (IM)", value: "0.1-0.15", unit: "mg/kg IM", maxDose: 10 },
      sedationPO: { label: "Sedation (PO)", value: "0.25-0.5", unit: "mg/kg PO", maxDose: 20 },
      sedationIN: { label: "Sedation/Seizure (IN)", value: "0.2-0.3", unit: "mg/kg IN", maxDose: 10 },
      statusIN: { label: "Status (Nayzilam)", value: "5", unit: "mg IN (one spray per nostril)", isFixed: true },
      statusBuccal: { label: "Status (Buccal)", value: "See table", unit: "by age" },
      infusion: { label: "Sedation Infusion", value: "0.05-0.4", unit: "mg/kg/hr" }
    },
    dosingTable: {
      title: "Midazolam Buccal Dosing by Age (Status Epilepticus)",
      columns: ["Age", "Dose"],
      rows: [
        ["3 mo - <1 yr", "2.5 mg"],
        ["1 yr - <5 yr", "5 mg"],
        ["5 yr - <10 yr", "7.5 mg"],
        ["10 yr - <18 yr", "10 mg"]
      ]
    },
    max: "10 mg/dose (most routes); 20 mg PO",
    indication: "Procedural sedation, anxiolysis, status epilepticus (rescue), ICU sedation",
    contraindications: [
      "Acute narrow-angle glaucoma",
      "Shock or coma",
      "Acute alcohol intoxication"
    ],
    warnings: [
      "Respiratory depression - monitor closely",
      "Paradoxical reactions (more common in children)",
      "Avoid in severe respiratory insufficiency",
      "Prolonged sedation in hepatic/renal impairment"
    ],
    sideEffects: [
      "Common: Sedation, hiccups, nausea, vomiting",
      "Respiratory: Respiratory depression, apnea",
      "Paradoxical: Agitation, combativeness"
    ],
    interactions: [
      { drug: "Opioids", effect: "Increased respiratory depression" },
      { drug: "CYP3A4 inhibitors", effect: "Increased midazolam effect" },
      { drug: "CYP3A4 inducers", effect: "Decreased midazolam effect" }
    ],
    notes: "Shortest-acting benzodiazepine. Onset IV: 1-3 min; IN: 5-10 min; PO: 15-30 min. Duration: 30-60 min (single dose). Intranasal may cause burning/stinging. Flumazenil is reversal agent but may precipitate seizures.",
    renalAdjust: "Use with caution; may have prolonged effect",
    hepaticAdjust: "Reduce dose in severe impairment"
  },

  // ============================================================================
  // MILRINONE (Primacor)
  // ============================================================================
  {
    id: "milrinone",
    name: "Milrinone (Primacor)",
    category: "Inotrope/Vasodilator",
    route: "IV",
    formulations: [
      { type: "Injection", strengths: "1 mg/mL" },
      { type: "Premixed", strengths: "200 mcg/mL in D5W" }
    ],
    doses: {
      loading: { label: "Loading (optional)", value: "50", unit: "mcg/kg IV over 15 min" },
      infusion: { label: "Infusion", value: "0.25-0.75", unit: "mcg/kg/min" },
      neonatal: { label: "Neonatal", value: "0.25-0.75", unit: "mcg/kg/min (no loading in neonates)" }
    },
    max: "0.75 mcg/kg/min; 1.13 mg/kg/day",
    indication: "Low cardiac output syndrome, post-cardiac surgery, acute decompensated heart failure",
    contraindications: [
      "Hypersensitivity to milrinone"
    ],
    warnings: [
      "Hypotension (especially with loading dose)",
      "Arrhythmias (especially with electrolyte abnormalities)",
      "Thrombocytopenia",
      "Long half-life in renal impairment"
    ],
    sideEffects: [
      "Cardiovascular: Hypotension, ventricular arrhythmias",
      "Hematologic: Thrombocytopenia",
      "Other: Headache, tremor"
    ],
    interactions: [
      { drug: "Diuretics", effect: "May cause hypokalemia (arrhythmia risk)" },
      { drug: "Other inotropes", effect: "Additive hemodynamic effects" }
    ],
    notes: "Phosphodiesterase-3 inhibitor (\"inodilator\"). Increases inotropy while decreasing afterload. Does NOT increase myocardial oxygen demand like catecholamines. Half-life: 2-3 hours (prolonged in renal failure). Loading dose often omitted to avoid hypotension.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "0.33-0.43 mcg/kg/min max",
      gfr10: "0.23 mcg/kg/min max",
      hd: "Use with caution"
    },
    hepaticAdjust: null
  },

  // ============================================================================
  // MORPHINE
  // ============================================================================
  {
    id: "morphine",
    name: "Morphine Sulfate",
    category: "Opioid Analgesic",
    route: "IV/IM/SC/PO/PR",
    formulations: [
      { type: "Injection", strengths: "0.5, 1, 2, 4, 5, 8, 10, 15 mg/mL" },
      { type: "Oral solution", strengths: "10 mg/5 mL, 20 mg/5 mL, 100 mg/5 mL (concentrate)" },
      { type: "IR tablets", strengths: "15 mg, 30 mg" },
      { type: "ER tablets", strengths: "15 mg, 30 mg, 60 mg, 100 mg, 200 mg" },
      { type: "Suppository", strengths: "5 mg, 10 mg, 20 mg, 30 mg" }
    ],
    doses: {
      analgesiaIVNeo: { label: "IV (Neonate)", value: "0.05-0.1", unit: "mg/kg Q4-6h", maxDose: 0.2 },
      analgesiaIVChild: { label: "IV (Child)", value: "0.05-0.1", unit: "mg/kg Q2-4h PRN", maxDose: 15 },
      analgesiaIVAdult: { label: "IV (Adult)", value: "2-10", unit: "mg Q2-4h PRN", isFixed: true },
      infusionNeo: { label: "Infusion (Neonate)", value: "0.01-0.02", unit: "mg/kg/hr" },
      infusionChild: { label: "Infusion (Child)", value: "0.01-0.04", unit: "mg/kg/hr" },
      poPediatric: { label: "PO (Pediatric)", value: "0.2-0.5", unit: "mg/kg/dose Q4-6h" },
      poAdult: { label: "PO IR (Adult)", value: "15-30", unit: "mg Q4h PRN", isFixed: true }
    },
    dosingTable: {
      title: "Morphine Equianalgesic Dosing",
      columns: ["Route", "Dose Ratio", "Example"],
      rows: [
        ["IV", "1x", "10 mg IV"],
        ["PO", "3x", "30 mg PO"],
        ["PR", "3x", "30 mg PR"]
      ]
    },
    max: "See indication; titrate to effect",
    indication: "Moderate to severe pain, cyanotic (Tet) spells, dyspnea in palliative care",
    contraindications: [
      "Significant respiratory depression",
      "Acute or severe bronchial asthma (without monitoring)",
      "GI obstruction (known or suspected)",
      "Concurrent MAO inhibitor use (within 14 days)"
    ],
    warnings: [
      "⚠️ Respiratory depression (especially neonates/infants)",
      "Hypotension (especially with hypovolemia)",
      "Physical dependence with prolonged use",
      "Histamine release (flushing, pruritus)"
    ],
    sideEffects: [
      "Common: Sedation, nausea, vomiting, constipation, pruritus",
      "Respiratory: Respiratory depression",
      "Cardiovascular: Hypotension, bradycardia",
      "GI: Constipation (universal with chronic use)"
    ],
    interactions: [
      { drug: "CNS depressants", effect: "Additive respiratory depression" },
      { drug: "MAO inhibitors", effect: "⚠️ Severe/fatal reactions - avoid" },
      { drug: "Mixed agonist-antagonists", effect: "May precipitate withdrawal" }
    ],
    notes: "Gold standard opioid for comparison. Active metabolite (M6G) accumulates in renal failure. Onset IV: 5-10 min; PO: 30-60 min. Duration: 4-6 hours. Naloxone is reversal agent. Start bowel regimen with chronic use.",
    renalAdjust: {
      gfr50: "75% dose",
      gfr30: "50% dose",
      gfr10: "25-50% dose",
      hd: "50% dose; no supplement"
    },
    hepaticAdjust: "Reduce dose and extend interval"
  },

  // ============================================================================
  // NALOXONE (Narcan)
  // ============================================================================
  {
    id: "naloxone",
    name: "Naloxone (Narcan)",
    category: "Opioid Antagonist",
    route: "IV/IM/SC/IN/ETT",
    formulations: [
      { type: "Injection", strengths: "0.4 mg/mL, 1 mg/mL" },
      { type: "Nasal spray (Narcan)", strengths: "4 mg/0.1 mL per spray" },
      { type: "Nasal spray (Kloxxado)", strengths: "8 mg/0.1 mL" }
    ],
    doses: {
      opioidReversalNeo: { label: "Full Reversal (Neonate)", value: "0.1", unit: "mg/kg IV/IM/SC/ETT" },
      opioidReversalChild: { label: "Full Reversal (Child ≤20kg)", value: "0.1", unit: "mg/kg IV/IM/SC (max 2 mg)" },
      opioidReversalAdult: { label: "Full Reversal (Adult/>20kg)", value: "0.4-2", unit: "mg IV/IM/SC" },
      partialReversal: { label: "Partial Reversal (titrate)", value: "0.001-0.005", unit: "mg/kg IV, repeat Q2-3min" },
      intranasal: { label: "Intranasal (≥4 yr)", value: "4", unit: "mg (1 spray) IN, may repeat Q2-3min", isFixed: true },
      infusion: { label: "Continuous Infusion", value: "0.002-0.16", unit: "mg/kg/hr" },
      ettDose: { label: "ETT Dose", value: "0.1", unit: "mg/kg (2-3x IV dose)" }
    },
    max: "10 mg total (if no response, question opioid diagnosis)",
    indication: "Opioid overdose, reversal of opioid effects (respiratory depression)",
    contraindications: [
      "Hypersensitivity to naloxone"
    ],
    warnings: [
      "⚠️ May precipitate acute withdrawal in opioid-dependent patients",
      "⚠️ Pulmonary edema (rare but serious)",
      "Duration shorter than most opioids - watch for re-sedation",
      "May reverse analgesia"
    ],
    sideEffects: [
      "Opioid withdrawal: Nausea, vomiting, diaphoresis, tachycardia, hypertension",
      "Cardiovascular: Hypotension, hypertension, arrhythmias",
      "Pulmonary: Pulmonary edema (rare)"
    ],
    interactions: [
      { drug: "Opioids", effect: "Antagonizes opioid effects" },
      { drug: "Buprenorphine", effect: "High doses needed to reverse" }
    ],
    notes: "Duration: 30-90 min (shorter than most opioids - observe for re-sedation). For partial reversal (maintain analgesia): titrate with small doses. Neonatal resuscitation: NOT recommended per NRP 2020 (support ventilation instead). ETT dose is 2-3x IV dose diluted in NS.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // NOREPINEPHRINE (Levophed)
  // ============================================================================
  {
    id: "norepinephrine",
    name: "Norepinephrine (Levophed)",
    category: "Vasopressor",
    route: "IV",
    formulations: [
      { type: "Injection", strengths: "1 mg/mL (4 mL)" },
      { type: "Premixed", strengths: "4 mg/250 mL, 8 mg/250 mL in D5W" }
    ],
    doses: {
      pediatricInfusion: { label: "Pediatric Infusion", value: "0.05-2", unit: "mcg/kg/min" },
      adultInfusion: { label: "Adult Infusion", value: "0.1-0.5", unit: "mcg/kg/min (or 8-30 mcg/min)" },
      sepsisInitial: { label: "Septic Shock (initial)", value: "0.05-0.1", unit: "mcg/kg/min, titrate" }
    },
    max: "2 mcg/kg/min (higher doses used in refractory shock)",
    indication: "Septic shock (first-line vasopressor), hypotension refractory to fluid resuscitation",
    contraindications: [
      "Hypotension from hypovolemia (except as emergency measure)",
      "Mesenteric or peripheral vascular thrombosis"
    ],
    warnings: [
      "⚠️ Extravasation causes severe tissue necrosis",
      "Central line strongly preferred",
      "May decrease renal and mesenteric blood flow",
      "Cardiac arrhythmias"
    ],
    sideEffects: [
      "Cardiovascular: Hypertension, bradycardia (reflex), arrhythmias",
      "Local: Tissue necrosis with extravasation",
      "Other: Headache, anxiety"
    ],
    interactions: [
      { drug: "MAO inhibitors", effect: "Severe hypertension" },
      { drug: "TCAs", effect: "Increased pressor effect" },
      { drug: "Beta-blockers", effect: "May increase hypertension (unopposed alpha)" }
    ],
    notes: "Potent α-agonist (vasoconstriction) with moderate β1 activity (inotropy). First-line vasopressor in septic shock per Surviving Sepsis Campaign. If extravasation: infiltrate area with phentolamine 5-10 mg in 10-15 mL NS within 12 hours. Always use via central line when possible.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // OMEPRAZOLE (Prilosec)
  // ============================================================================
  {
    id: "omeprazole",
    name: "Omeprazole (Prilosec)",
    category: "Proton Pump Inhibitor",
    route: "PO",
    formulations: [
      { type: "Capsules (DR)", strengths: "10 mg, 20 mg, 40 mg" },
      { type: "Oral suspension", strengths: "2 mg/mL (compounded)" },
      { type: "Powder for suspension", strengths: "2.5 mg, 10 mg packets" }
    ],
    doses: {
      gerdChild1to16: { label: "GERD (1-16 yr)", value: "1", unit: "mg/kg/day QD (max 20 mg)" },
      gerdAdult: { label: "GERD (Adult)", value: "20-40", unit: "mg QD x 4-8 weeks", isFixed: true },
      erosiveEsoph: { label: "Erosive Esophagitis", value: "1-2", unit: "mg/kg/day ÷ QD-BID (max 40 mg)" },
      hPylori: { label: "H. pylori (adult)", value: "20", unit: "mg BID (with antibiotics) x 10-14 days", isFixed: true },
      stressUlcer: { label: "Stress Ulcer Prophylaxis", value: "1", unit: "mg/kg/dose QD-BID" }
    },
    dosingTable: {
      title: "Omeprazole Pediatric Dosing by Weight",
      columns: ["Weight", "Dose"],
      rows: [
        ["5-<10 kg", "5 mg QD"],
        ["10-<20 kg", "10 mg QD"],
        ["≥20 kg", "20 mg QD"]
      ]
    },
    max: "40 mg/day (80 mg/day for Zollinger-Ellison)",
    indication: "GERD, erosive esophagitis, peptic ulcer disease, H. pylori (with antibiotics), stress ulcer prophylaxis",
    contraindications: [
      "Hypersensitivity to PPIs",
      "Concurrent rilpivirine"
    ],
    warnings: [
      "Long-term use: increased risk of C. diff, hypomagnesemia, bone fractures",
      "May mask symptoms of gastric cancer",
      "Vitamin B12 deficiency with prolonged use",
      "Drug interactions via CYP2C19"
    ],
    sideEffects: [
      "Common: Headache, diarrhea, abdominal pain, nausea",
      "Long-term: Hypomagnesemia, B12 deficiency, bone fractures",
      "Rare: Interstitial nephritis, cutaneous lupus"
    ],
    interactions: [
      { drug: "Clopidogrel", effect: "Reduced antiplatelet effect" },
      { drug: "Methotrexate", effect: "Increased methotrexate levels" },
      { drug: "Atazanavir/Rilpivirine", effect: "Reduced absorption (avoid)" },
      { drug: "Diazepam/Phenytoin", effect: "Increased levels" }
    ],
    notes: "Give 30-60 min before meals. Capsules may be opened and sprinkled on applesauce (do not crush granules). For NG: can use oral suspension or dissolve in sodium bicarbonate solution. Effect may take 1-4 days for full acid suppression.",
    renalAdjust: null,
    hepaticAdjust: "Max 20 mg/day in severe hepatic impairment"
  },

  // ============================================================================
  // ONDANSETRON (Zofran)
  // ============================================================================
  {
    id: "ondansetron",
    name: "Ondansetron (Zofran)",
    category: "Antiemetic (5-HT3 Antagonist)",
    route: "IV/PO/ODT",
    formulations: [
      { type: "Tablets", strengths: "4 mg, 8 mg" },
      { type: "ODT", strengths: "4 mg, 8 mg" },
      { type: "Oral solution", strengths: "4 mg/5 mL" },
      { type: "Injection", strengths: "2 mg/mL" }
    ],
    doses: {
      ponvChild: { label: "PONV (Child ≥1 mo-12 yr)", value: "0.1", unit: "mg/kg IV (max 4 mg)" },
      ponvAdult: { label: "PONV (Adult)", value: "4", unit: "mg IV/IM or 8 mg PO", isFixed: true },
      chemoChild: { label: "Chemo-induced (Child)", value: "0.15", unit: "mg/kg IV Q4h x 3 doses (max 16 mg/dose)" },
      chemoAdult: { label: "Chemo-induced (Adult)", value: "8", unit: "mg IV x 2 doses or 8 mg PO BID", isFixed: true },
      gastroenteritis: { label: "Gastroenteritis (ED)", value: "0.15", unit: "mg/kg PO/IV (max 8 mg)" },
      gastroByWeight: { label: "Gastro by Weight", value: "See table", unit: "" }
    },
    dosingTable: {
      title: "Ondansetron Dosing for Gastroenteritis by Weight",
      columns: ["Weight", "Dose"],
      rows: [
        ["8-15 kg", "2 mg"],
        ["15-30 kg", "4 mg"],
        [">30 kg", "6-8 mg"]
      ]
    },
    max: "16 mg/dose IV; 24 mg/day (chemo)",
    indication: "Chemotherapy-induced nausea/vomiting, PONV, radiation-induced N/V, gastroenteritis",
    contraindications: [
      "Hypersensitivity to ondansetron",
      "Concurrent apomorphine"
    ],
    warnings: [
      "⚠️ QT prolongation (dose-dependent)",
      "Serotonin syndrome (with other serotonergic drugs)",
      "May mask progressive ileus in post-op patients"
    ],
    sideEffects: [
      "Common: Headache, constipation, dizziness",
      "Cardiovascular: QT prolongation, arrhythmias",
      "Rare: Serotonin syndrome, anaphylaxis"
    ],
    interactions: [
      { drug: "QT-prolonging drugs", effect: "Additive QT prolongation" },
      { drug: "Serotonergic drugs", effect: "Risk of serotonin syndrome" },
      { drug: "Apomorphine", effect: "Profound hypotension - contraindicated" },
      { drug: "Tramadol", effect: "Reduced analgesic effect" }
    ],
    notes: "Give IV over 2-5 min (over 15 min if >16 mg). ODT dissolves on tongue without water. Max single IV dose 16 mg (32 mg no longer recommended due to QT risk). FDA recommends ECG in patients with electrolyte abnormalities, CHF, or bradyarrhythmias.",
    renalAdjust: null,
    hepaticAdjust: "Max 8 mg/day in severe hepatic impairment"
  },

  // ============================================================================
  // OSELTAMIVIR (Tamiflu)
  // ============================================================================
  {
    id: "oseltamivir",
    name: "Oseltamivir (Tamiflu)",
    category: "Antiviral (Neuraminidase Inhibitor)",
    route: "PO",
    formulations: [
      { type: "Capsules", strengths: "30 mg, 45 mg, 75 mg" },
      { type: "Oral suspension", strengths: "6 mg/mL" }
    ],
    doses: {
      treatment2wkTo1yr: { label: "Treatment (2wk-1yr)", value: "3", unit: "mg/kg/dose BID x 5 days" },
      treatment1to12yr: { label: "Treatment (1-12yr)", value: "See table", unit: "BID x 5 days" },
      treatmentAdult: { label: "Treatment (Adult)", value: "75", unit: "mg BID x 5 days", isFixed: true },
      prophylaxis: { label: "Prophylaxis", value: "See treatment", unit: "dose QD x 10 days" }
    },
    dosingTable: {
      title: "Oseltamivir Dosing by Weight (Treatment)",
      columns: ["Weight", "Treatment Dose", "Prophylaxis Dose"],
      rows: [
        ["≤15 kg", "30 mg BID", "30 mg QD"],
        [">15-23 kg", "45 mg BID", "45 mg QD"],
        [">23-40 kg", "60 mg BID", "60 mg QD"],
        [">40 kg", "75 mg BID", "75 mg QD"]
      ]
    },
    max: "75 mg BID (treatment); 75 mg QD (prophylaxis)",
    indication: "Influenza A and B (treatment and prophylaxis)",
    contraindications: [
      "Hypersensitivity to oseltamivir"
    ],
    warnings: [
      "Most effective if started within 48 hours of symptom onset",
      "Neuropsychiatric events (rare, mainly in children)",
      "Not a substitute for annual flu vaccination"
    ],
    sideEffects: [
      "Common: Nausea, vomiting (take with food to reduce)",
      "Less common: Headache, abdominal pain",
      "Rare: Neuropsychiatric events (delirium, self-injury)"
    ],
    interactions: [
      { drug: "Live attenuated influenza vaccine", effect: "Avoid within 2 weeks before to 48 hours after oseltamivir" }
    ],
    notes: "Most effective when started within 48 hours of symptoms, but can still provide benefit if started later in hospitalized patients. Treatment duration: 5 days (may extend in severe illness). Prophylaxis: start within 48 hours of exposure. Can open capsule and mix with sweetened liquid.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "30 mg BID (treatment); 30 mg QD (prophylaxis)",
      gfr10: "30 mg QD (treatment); 30 mg every other day (prophylaxis)",
      hd: "30 mg after each HD session"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // PANTOPRAZOLE (Protonix)
  // ============================================================================
  {
    id: "pantoprazole",
    name: "Pantoprazole (Protonix)",
    category: "Proton Pump Inhibitor",
    route: "IV/PO",
    formulations: [
      { type: "Tablets (DR)", strengths: "20 mg, 40 mg" },
      { type: "Granules for suspension", strengths: "40 mg packets" },
      { type: "Injection", strengths: "40 mg vial" }
    ],
    doses: {
      gerdChild: { label: "GERD (≥5 yr, ≥15kg)", value: "See table", unit: "PO QD" },
      gerdAdult: { label: "GERD (Adult)", value: "40", unit: "mg PO QD x 8 weeks", isFixed: true },
      erosive: { label: "Erosive Esophagitis (Adult)", value: "40", unit: "mg IV QD x 7-10 days", isFixed: true },
      stressUlcer: { label: "Stress Ulcer Prophylaxis", value: "1", unit: "mg/kg/dose IV Q12-24h (max 40 mg)" },
      giBleed: { label: "GI Bleed (Adult)", value: "80", unit: "mg IV bolus, then 8 mg/hr infusion", isFixed: true }
    },
    dosingTable: {
      title: "Pantoprazole Pediatric Dosing",
      columns: ["Weight", "PO Dose"],
      rows: [
        ["15-<40 kg", "20 mg QD"],
        ["≥40 kg", "40 mg QD"]
      ]
    },
    max: "40 mg/day (standard); 80 mg bolus + 8 mg/hr (GI bleed)",
    indication: "GERD, erosive esophagitis, stress ulcer prophylaxis, GI bleeding",
    contraindications: [
      "Hypersensitivity to PPIs",
      "Concurrent rilpivirine"
    ],
    warnings: [
      "Long-term: C. diff risk, hypomagnesemia, bone fractures",
      "Acute interstitial nephritis",
      "Cutaneous/systemic lupus erythematosus",
      "Vitamin B12 deficiency"
    ],
    sideEffects: [
      "Common: Headache, diarrhea, flatulence, abdominal pain",
      "Less common: Rash, dizziness",
      "Long-term: Hypomagnesemia, B12 deficiency"
    ],
    interactions: [
      { drug: "Clopidogrel", effect: "May reduce antiplatelet effect (less than omeprazole)" },
      { drug: "Methotrexate", effect: "Increased methotrexate levels" },
      { drug: "Atazanavir", effect: "Reduced absorption" }
    ],
    notes: "IV form useful when PO not feasible. For GI bleed: continuous infusion maintains gastric pH >6. Give 30-60 min before meals. Granules can be mixed with applesauce or apple juice. IV infusion stable for 24 hours at room temperature.",
    renalAdjust: null,
    hepaticAdjust: "Max 20 mg/day in severe hepatic impairment"
  },

  // ============================================================================
  // PENICILLIN G (Aqueous)
  // ============================================================================
  {
    id: "penicilling",
    name: "Penicillin G (Aqueous)",
    category: "Antibiotic (Penicillin)",
    route: "IV/IM",
    formulations: [
      { type: "Injection (K+)", strengths: "1 million, 5 million, 20 million units" },
      { type: "Injection (Na+)", strengths: "5 million units" }
    ],
    doses: {
      neoUnder7d: { label: "Neonate ≤7 days", value: "50,000", unit: "units/kg/dose Q12h" },
      neoOver7d: { label: "Neonate >7 days", value: "50,000", unit: "units/kg/dose Q8h" },
      mildModChild: { label: "Mild/Mod (Child)", value: "100,000-250,000", unit: "units/kg/day ÷ Q4-6h" },
      severeChild: { label: "Severe (Child)", value: "250,000-400,000", unit: "units/kg/day ÷ Q4-6h" },
      meningitis: { label: "Meningitis", value: "300,000-400,000", unit: "units/kg/day ÷ Q4h (max 24 million/day)" },
      adultStandard: { label: "Adult", value: "2-4 million", unit: "units Q4-6h", isFixed: true }
    },
    max: "24 million units/day",
    indication: "Group B Strep, Strep pneumoniae (susceptible), syphilis, meningitis, endocarditis",
    contraindications: [
      "History of penicillin anaphylaxis"
    ],
    warnings: [
      "High sodium/potassium content (check formulation)",
      "Jarisch-Herxheimer reaction with syphilis treatment",
      "Neurotoxicity (seizures) with very high doses/renal impairment"
    ],
    sideEffects: [
      "Common: Diarrhea, nausea, rash",
      "Serious: Anaphylaxis, seizures (high dose)",
      "Hematologic: Hemolytic anemia, thrombocytopenia"
    ],
    interactions: [
      { drug: "Probenecid", effect: "Increased penicillin levels" },
      { drug: "Methotrexate", effect: "Decreased methotrexate clearance" },
      { drug: "Warfarin", effect: "Variable INR effects" }
    ],
    notes: "1 million units = 0.6 g. K+ formulation: 1.7 mEq K/million units. Na+ formulation: 2 mEq Na/million units. Preferred for GBS and susceptible streptococci. Not stable orally (use Pen V for oral).",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "75% dose or extend interval",
      gfr10: "50% dose or extend to Q8-12h",
      hd: "Dose after HD; supplement 500,000-1 million units"
    },
    hepaticAdjust: null
  },

  // ============================================================================
  // PHENOBARBITAL
  // ============================================================================
  {
    id: "phenobarbital",
    name: "Phenobarbital (Luminal)",
    category: "Anticonvulsant (Barbiturate)",
    route: "IV/IM/PO",
    formulations: [
      { type: "Injection", strengths: "65 mg/mL, 130 mg/mL" },
      { type: "Tablets", strengths: "15 mg, 30 mg, 60 mg, 100 mg" },
      { type: "Elixir", strengths: "20 mg/5 mL" }
    ],
    doses: {
      statusLoading: { label: "Status Epilepticus (Loading)", value: "20", unit: "mg/kg IV (max rate 60 mg/min)" },
      statusAdditional: { label: "Additional doses", value: "5-10", unit: "mg/kg IV Q15-30min (max 40 mg/kg total)" },
      neonatalLoading: { label: "Neonatal Seizures (Load)", value: "20", unit: "mg/kg IV" },
      maintenanceNeo: { label: "Maintenance (Neonate)", value: "3-5", unit: "mg/kg/day ÷ QD-BID" },
      maintenanceChild: { label: "Maintenance (Child)", value: "3-6", unit: "mg/kg/day ÷ QD-BID" },
      maintenanceAdult: { label: "Maintenance (Adult)", value: "60-200", unit: "mg/day ÷ QD-BID", isFixed: true }
    },
    dosingTable: {
      title: "Phenobarbital Maintenance by Age",
      columns: ["Age", "Dose (mg/kg/day)"],
      rows: [
        ["Neonate", "3-5"],
        ["Infant", "5-6"],
        ["1-5 years", "6-8"],
        ["6-12 years", "4-6"],
        [">12 years", "1-3"]
      ]
    },
    max: "40 mg/kg total loading; 300 mg/day maintenance",
    indication: "Status epilepticus, neonatal seizures, febrile seizures (prevention), generalized tonic-clonic seizures",
    contraindications: [
      "Severe respiratory disease",
      "Porphyria",
      "Severe hepatic impairment"
    ],
    warnings: [
      "Respiratory depression (especially with loading doses)",
      "Drug-drug interactions (potent CYP450 inducer)",
      "Paradoxical excitation in children",
      "Physical dependence with chronic use"
    ],
    sideEffects: [
      "Common: Sedation, ataxia, cognitive impairment",
      "Less common: Behavioral changes, hyperactivity (children)",
      "Serious: Respiratory depression, Stevens-Johnson syndrome"
    ],
    interactions: [
      { drug: "CYP450 substrates", effect: "Decreased levels of many drugs (warfarin, oral contraceptives, etc.)" },
      { drug: "Valproate", effect: "Increased phenobarbital levels" },
      { drug: "CNS depressants", effect: "Additive sedation" }
    ],
    notes: "First-line for neonatal seizures. Therapeutic level: 15-40 mcg/mL. Half-life: neonates 40-200 hr; children 40-70 hr. Loading dose may take 15-30 min to reach brain. Potent CYP inducer - check interactions.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "Extend interval (Q12-24h)",
      gfr10: "Extend interval (Q24-48h)",
      hd: "Supplement 50% post-HD"
    },
    hepaticAdjust: "Reduce dose by 25-50% in hepatic impairment"
  },

  // ============================================================================
  // PHENYTOIN (Dilantin)
  // ============================================================================
  {
    id: "phenytoin",
    name: "Phenytoin (Dilantin)",
    category: "Anticonvulsant",
    route: "IV/PO",
    formulations: [
      { type: "Injection", strengths: "50 mg/mL" },
      { type: "Capsules (extended)", strengths: "30 mg, 100 mg, 200 mg, 300 mg" },
      { type: "Chewable tablets", strengths: "50 mg" },
      { type: "Suspension", strengths: "125 mg/5 mL" }
    ],
    doses: {
      statusLoading: { label: "Status Epilepticus (Load)", value: "20", unit: "mg/kg IV (max rate 1 mg/kg/min)" },
      additionalLoading: { label: "Additional loading", value: "5-10", unit: "mg/kg (max 30 mg/kg total)" },
      maintenanceNeo: { label: "Maintenance (Neonate)", value: "5-8", unit: "mg/kg/day ÷ Q8-12h" },
      maintenanceChild: { label: "Maintenance (Child)", value: "5-10", unit: "mg/kg/day ÷ Q8-12h" },
      maintenanceAdult: { label: "Maintenance (Adult)", value: "300-400", unit: "mg/day ÷ QD-TID", isFixed: true }
    },
    dosingTable: {
      title: "Phenytoin Therapeutic Levels & Correction",
      columns: ["Parameter", "Value"],
      rows: [
        ["Therapeutic total level", "10-20 mcg/mL"],
        ["Therapeutic free level", "1-2 mcg/mL"],
        ["Corrected (if albumin <4)", "Measured / (0.2 × Alb + 0.1)"]
      ]
    },
    max: "30 mg/kg loading; 400 mg/day maintenance (600 mg in select cases)",
    indication: "Status epilepticus, generalized tonic-clonic seizures, partial seizures",
    contraindications: [
      "Sinus bradycardia, SA or AV block, Adams-Stokes syndrome",
      "History of phenytoin hypersensitivity"
    ],
    warnings: [
      "⚠️ IV rate max 1 mg/kg/min (50 mg/min adult) - arrhythmias, hypotension",
      "Purple glove syndrome with IV extravasation",
      "Teratogenic (fetal hydantoin syndrome)",
      "Nonlinear kinetics - small dose changes = large level changes"
    ],
    sideEffects: [
      "Common: Gingival hyperplasia, hirsutism, coarsening of facies, nystagmus",
      "Neurologic: Ataxia, slurred speech, confusion (toxicity)",
      "Serious: SJS/TEN, DRESS, hepatotoxicity"
    ],
    interactions: [
      { drug: "CYP2C9/2C19 inhibitors", effect: "Increased phenytoin levels" },
      { drug: "CYP3A4 substrates", effect: "Decreased levels of many drugs" },
      { drug: "Enteral feeding", effect: "Reduced absorption - hold feeds 1-2h before/after" },
      { drug: "Antacids", effect: "Reduced absorption" }
    ],
    notes: "Only give IV formulation (NOT fosphenytoin) via peripheral line with saline flush. Use filter for IV. Nonlinear kinetics: at therapeutic levels, small dose changes cause large level changes. Check free level if low albumin or renal failure.",
    renalAdjust: "Use free phenytoin levels; total levels unreliable",
    hepaticAdjust: "Reduce dose; use free levels"
  },

  // ============================================================================
  // PIPERACILLIN-TAZOBACTAM (Zosyn)
  // ============================================================================
  {
    id: "piperacillintazobactam",
    name: "Piperacillin-Tazobactam (Zosyn)",
    category: "Antibiotic (Extended-spectrum Penicillin)",
    route: "IV",
    formulations: [
      { type: "Injection", strengths: "2.25 g, 3.375 g, 4.5 g (8:1 pip:tazo ratio)" }
    ],
    doses: {
      neoUnder30wk: { label: "Neonate <30wk", value: "100", unit: "mg/kg/dose Q8h" },
      neo30to36wk: { label: "Neonate 30-36wk", value: "100", unit: "mg/kg/dose Q6h" },
      neoTerm: { label: "Neonate Term", value: "100", unit: "mg/kg/dose Q6h" },
      standard29d8mo: { label: "Standard (2-9mo)", value: "80", unit: "mg/kg/dose Q8h" },
      standardChild: { label: "Standard (>9mo)", value: "100", unit: "mg/kg/dose Q8h", maxDose: 4000 },
      cfPseudomonas: { label: "CF/Pseudomonas", value: "100", unit: "mg/kg/dose Q6h", maxDose: 4000 },
      adultStandard: { label: "Adult Standard", value: "3.375", unit: "g Q6h", isFixed: true },
      adultSevere: { label: "Adult Severe", value: "4.5", unit: "g Q6h", isFixed: true }
    },
    dosingTable: {
      title: "Neonatal Pip-Tazo Dosing",
      columns: ["Gestational Age", "Postnatal Age", "Dose", "Interval"],
      rows: [
        ["<30 wk", "All", "100 mg/kg", "Q8h"],
        ["30-36 wk", "0-14 days", "100 mg/kg", "Q8h"],
        ["30-36 wk", ">14 days", "100 mg/kg", "Q6h"],
        ["≥37 wk", "All", "100 mg/kg", "Q6h"]
      ]
    },
    max: "16 g/day (piperacillin component)",
    indication: "Intra-abdominal infections, nosocomial pneumonia, febrile neutropenia, polymicrobial infections",
    contraindications: [
      "History of serious hypersensitivity to penicillins or beta-lactams"
    ],
    warnings: [
      "Cross-reactivity with cephalosporins",
      "C. difficile colitis",
      "Bleeding (platelet dysfunction)",
      "Hypokalemia (high sodium content)"
    ],
    sideEffects: [
      "Common: Diarrhea, nausea, headache, insomnia",
      "Less common: Rash, fever, phlebitis",
      "Serious: Anaphylaxis, seizures, neutropenia"
    ],
    interactions: [
      { drug: "Methotrexate", effect: "Decreased methotrexate clearance" },
      { drug: "Aminoglycosides", effect: "Physical incompatibility; synergistic activity" },
      { drug: "Probenecid", effect: "Increased piperacillin levels" }
    ],
    notes: "Contains 2.35 mEq Na per gram piperacillin. Extended infusion (4 hours) may improve outcomes in severe infections. Covers most gram-negatives (including Pseudomonas), gram-positives (not MRSA), and anaerobes. Doses expressed as piperacillin component.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "2.25 g Q6h or 3.375 g Q8h",
      gfr10: "2.25 g Q8h",
      hd: "2.25 g Q8h; supplement after HD"
    },
    hepaticAdjust: "No adjustment needed"
  },

  // ============================================================================
  // POTASSIUM CHLORIDE
  // ============================================================================
  {
    id: "potassiumchloride",
    name: "Potassium Chloride (KCl)",
    category: "Electrolyte",
    route: "IV/PO",
    formulations: [
      { type: "Injection concentrate", strengths: "2 mEq/mL" },
      { type: "Premixed IV", strengths: "10-40 mEq/L bags" },
      { type: "Oral liquid", strengths: "20 mEq/15 mL, 40 mEq/15 mL" },
      { type: "Oral tablets/capsules", strengths: "8 mEq, 10 mEq, 20 mEq" },
      { type: "Powder packets", strengths: "20 mEq, 25 mEq" }
    ],
    doses: {
      maintenanceIV: { label: "Maintenance (IV)", value: "2-3", unit: "mEq/kg/day" },
      mildHypoK: { label: "Mild Hypokalemia (PO)", value: "1-2", unit: "mEq/kg/day ÷ BID-QID" },
      modHypoKPO: { label: "Mod Hypokalemia (PO)", value: "2-4", unit: "mEq/kg/day ÷ TID-QID" },
      severeHypoKIV: { label: "Severe (<2.5) IV", value: "0.5-1", unit: "mEq/kg IV over 1 hr (max 40 mEq)" },
      ivRatePeripheral: { label: "IV Rate (Peripheral)", value: "0.5", unit: "mEq/kg/hr (max 10 mEq/hr)" },
      ivRateCentral: { label: "IV Rate (Central)", value: "1", unit: "mEq/kg/hr (max 40 mEq/hr with monitoring)" }
    },
    dosingTable: {
      title: "Potassium Replacement Guidelines",
      columns: ["K+ Level", "Deficit (mEq/kg)", "Route"],
      rows: [
        ["3.0-3.5", "~0.5", "PO preferred"],
        ["2.5-3.0", "~1", "PO or IV"],
        ["<2.5", ">1", "IV required"]
      ]
    },
    max: "40 mEq/hour IV (with cardiac monitoring); 200 mEq/day",
    indication: "Hypokalemia treatment and prevention",
    contraindications: [
      "Hyperkalemia",
      "Severe renal impairment (without monitoring)",
      "Untreated Addison's disease"
    ],
    warnings: [
      "⚠️ NEVER give IV push - cardiac arrest",
      "⚠️ Central line preferred for concentrations >40 mEq/L",
      "Monitor K+ levels and ECG during replacement",
      "GI ulceration with oral forms"
    ],
    sideEffects: [
      "IV: Phlebitis, pain at injection site",
      "Oral: GI upset, nausea, vomiting, diarrhea, ulceration",
      "Overdose: Hyperkalemia, cardiac arrhythmias, cardiac arrest"
    ],
    interactions: [
      { drug: "ACE inhibitors/ARBs", effect: "Hyperkalemia risk" },
      { drug: "K-sparing diuretics", effect: "Hyperkalemia risk" },
      { drug: "Digoxin", effect: "Hypokalemia increases digoxin toxicity" }
    ],
    notes: "Peripheral IV max concentration: 40 mEq/L (higher causes phlebitis). Central line allows up to 200 mEq/L. Each 10 mEq replaces ~0.1 mEq/L (very rough estimate). Always correct hypomagnesemia - K+ won't correct if Mg low.",
    renalAdjust: "Use with extreme caution; monitor K+ closely",
    hepaticAdjust: null
  },

  // ============================================================================
  // PREDNISOLONE / PREDNISONE
  // ============================================================================
  {
    id: "prednisolone",
    name: "Prednisolone / Prednisone",
    category: "Corticosteroid",
    route: "PO",
    formulations: [
      { type: "Prednisolone solution", strengths: "5 mg/5 mL, 15 mg/5 mL (Orapred)" },
      { type: "Prednisolone ODT", strengths: "10 mg, 15 mg, 30 mg" },
      { type: "Prednisone tablets", strengths: "1 mg, 2.5 mg, 5 mg, 10 mg, 20 mg, 50 mg" },
      { type: "Prednisone solution", strengths: "5 mg/5 mL" }
    ],
    doses: {
      acuteAsthma: { label: "Acute Asthma", value: "1-2", unit: "mg/kg/day QD or ÷ BID x 3-5 days (max 60 mg)" },
      croup: { label: "Croup", value: "1-2", unit: "mg/kg x 1 dose (max 60 mg)" },
      antiInflamLow: { label: "Anti-inflammatory (low)", value: "0.1-0.5", unit: "mg/kg/day" },
      antiInflamMod: { label: "Anti-inflammatory (mod)", value: "0.5-1", unit: "mg/kg/day" },
      antiInflamHigh: { label: "Anti-inflammatory (high)", value: "1-2", unit: "mg/kg/day" },
      nephroticInduction: { label: "Nephrotic Syndrome", value: "2", unit: "mg/kg/day (max 60 mg) QD x 4-6 wk" },
      ibdFlare: { label: "IBD Flare", value: "1-2", unit: "mg/kg/day (max 40-60 mg)" }
    },
    dosingTable: {
      title: "Steroid Equivalency Table",
      columns: ["Steroid", "Equivalent Dose", "Anti-inflammatory", "Mineralocorticoid"],
      rows: [
        ["Cortisol/Hydrocortisone", "20 mg", "1", "1"],
        ["Prednisone/Prednisolone", "5 mg", "4", "0.8"],
        ["Methylprednisolone", "4 mg", "5", "0.5"],
        ["Dexamethasone", "0.75 mg", "25-30", "0"]
      ]
    },
    max: "60-80 mg/day (varies by indication)",
    indication: "Asthma exacerbation, croup, allergic reactions, autoimmune diseases, nephrotic syndrome, IBD",
    contraindications: [
      "Systemic fungal infections",
      "Live vaccines during high-dose therapy"
    ],
    warnings: [
      "Adrenal suppression with prolonged use (>2 weeks)",
      "May mask signs of infection",
      "Hyperglycemia",
      "Growth suppression in children",
      "Behavioral changes (\"steroid psychosis\")"
    ],
    sideEffects: [
      "Short-term: Hyperglycemia, hypertension, mood changes, increased appetite",
      "Long-term: Cushing syndrome, osteoporosis, growth suppression, cataracts",
      "GI: Peptic ulcer (especially with NSAIDs)"
    ],
    interactions: [
      { drug: "NSAIDs", effect: "Increased GI bleeding risk" },
      { drug: "CYP3A4 inducers", effect: "Decreased steroid effect" },
      { drug: "Live vaccines", effect: "Avoid during high-dose therapy" },
      { drug: "Insulin/oral hypoglycemics", effect: "May need dose increase" }
    ],
    notes: "Prednisone is converted to prednisolone in liver (use prednisolone in liver disease). No taper needed if <2 weeks. Morning dosing mimics physiologic cortisol. For asthma: burst therapy equally effective as longer tapers.",
    renalAdjust: null,
    hepaticAdjust: "Use prednisolone (not prednisone) in liver disease"
  },

  // ============================================================================
  // PROPOFOL (Diprivan)
  // ============================================================================
  {
    id: "propofol",
    name: "Propofol (Diprivan)",
    category: "Sedative-Hypnotic",
    route: "IV",
    formulations: [
      { type: "Injection (emulsion)", strengths: "10 mg/mL" }
    ],
    doses: {
      inductionChild: { label: "Induction (Child 3-16 yr)", value: "2.5-3.5", unit: "mg/kg IV" },
      inductionAdult: { label: "Induction (Adult)", value: "1.5-2.5", unit: "mg/kg IV" },
      proceduralSedation: { label: "Procedural Sedation", value: "0.5-1", unit: "mg/kg IV, then 50-100 mcg/kg/min" },
      icuSedation: { label: "ICU Sedation (Adult)", value: "5-50", unit: "mcg/kg/min" },
      maintenanceAnesthesia: { label: "Maintenance", value: "100-200", unit: "mcg/kg/min" }
    },
    max: "4 mg/kg/hr (ICU sedation) - avoid prolonged high-dose infusions",
    indication: "Anesthesia induction/maintenance, procedural sedation, ICU sedation (adults)",
    contraindications: [
      "Allergy to eggs, soy, or propofol",
      "Pediatric ICU sedation (FDA warning)",
      "Disorders of fat metabolism"
    ],
    warnings: [
      "⚠️ PROPOFOL INFUSION SYNDROME (PRIS) - metabolic acidosis, rhabdomyolysis, cardiac failure",
      "⚠️ NOT for pediatric ICU sedation (FDA black box)",
      "Hypotension (especially in hypovolemic patients)",
      "Respiratory depression",
      "Pain on injection"
    ],
    sideEffects: [
      "Common: Hypotension, apnea, pain on injection",
      "Less common: Bradycardia, hypertriglyceridemia",
      "Serious: PRIS, anaphylaxis"
    ],
    interactions: [
      { drug: "Opioids", effect: "Additive respiratory/cardiovascular depression" },
      { drug: "Other sedatives", effect: "Additive CNS depression" },
      { drug: "Fentanyl", effect: "May increase propofol blood levels" }
    ],
    notes: "Lipid emulsion - count toward daily lipid intake. Onset: 30-45 sec. Duration: 5-10 min (single dose). Use within 12 hours of opening (no preservative). Lidocaine 10-20 mg or fentanyl can reduce injection pain. Contains 0.1 g fat/mL.",
    renalAdjust: null,
    hepaticAdjust: "Use with caution; may have prolonged effect"
  },

  // ============================================================================
  // RACEMIC EPINEPHRINE
  // ============================================================================
  {
    id: "racemicepinephrine",
    name: "Racemic Epinephrine (Vaponefrin)",
    category: "Alpha/Beta Agonist",
    route: "Inhaled",
    formulations: [
      { type: "Nebulizer solution", strengths: "2.25% racemic epinephrine" },
      { type: "Alternative", strengths: "L-epinephrine 1:1000 (1 mg/mL)" }
    ],
    doses: {
      croupRacemic: { label: "Croup (Racemic 2.25%)", value: "0.25-0.5", unit: "mL diluted in 3 mL NS" },
      croupLEpi: { label: "Croup (L-epinephrine)", value: "0.5", unit: "mL/kg (max 5 mL) of 1:1000" },
      postExtubation: { label: "Post-extubation Stridor", value: "0.25-0.5", unit: "mL racemic + 3 mL NS" },
      bronchiolitisNeb: { label: "Bronchiolitis (L-epi)", value: "3", unit: "mL of 1:1000 nebulized" }
    },
    dosingTable: {
      title: "Epinephrine for Croup - Dose by Age/Weight",
      columns: ["Age/Weight", "Racemic 2.25%", "L-Epi 1:1000"],
      rows: [
        ["<10 kg", "0.25 mL", "2.5 mL"],
        ["10-20 kg", "0.5 mL", "3 mL"],
        [">20 kg", "0.5 mL", "5 mL (max)"]
      ]
    },
    max: "0.5 mL racemic; 5 mL L-epinephrine",
    indication: "Croup (moderate-severe), post-extubation stridor, bronchiolitis (selected cases)",
    contraindications: [
      "Relative: Underlying cardiac disease",
      "Use with caution in severe hypertension"
    ],
    warnings: [
      "Observe for at least 2-3 hours after dose (rebound stridor)",
      "Tachycardia and pallor are expected",
      "May repeat Q20min if severe",
      "Often combined with dexamethasone"
    ],
    sideEffects: [
      "Common: Tachycardia, pallor, tremor",
      "Less common: Hypertension, nausea, headache",
      "Serious: Arrhythmias (rare with nebulized route)"
    ],
    interactions: [
      { drug: "MAO inhibitors", effect: "Severe hypertension" },
      { drug: "Beta-blockers", effect: "Unopposed alpha stimulation" }
    ],
    notes: "Racemic = equal mix of D and L isomers; L-epinephrine 1:1000 equally effective. Effect onset: 10-30 min. Duration: 2 hours. Rebound possible at 2-3 hours. Always give steroids concurrently for sustained benefit. Observe 2-3 hours post-treatment.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // RANITIDINE (Zantac) - Note: Withdrawn in many countries due to NDMA
  // ============================================================================
  {
    id: "ranitidine",
    name: "Ranitidine (Zantac)",
    category: "H2-Receptor Antagonist",
    route: "IV/PO",
    formulations: [
      { type: "Tablets", strengths: "75 mg, 150 mg, 300 mg" },
      { type: "Syrup", strengths: "15 mg/mL" },
      { type: "Injection", strengths: "25 mg/mL" }
    ],
    doses: {
      gerdNeo: { label: "GERD (Neonate)", value: "2", unit: "mg/kg/day ÷ Q8-12h PO" },
      gerdChild: { label: "GERD (Child)", value: "4-10", unit: "mg/kg/day ÷ BID (max 300 mg/day)" },
      stressUlcer: { label: "Stress Ulcer (IV)", value: "1", unit: "mg/kg/dose Q6-8h (max 50 mg)" },
      ivInfusion: { label: "Continuous Infusion", value: "0.1-0.25", unit: "mg/kg/hr" },
      adultPO: { label: "Adult PO", value: "150", unit: "mg BID or 300 mg QHS", isFixed: true }
    },
    max: "300 mg/day PO; 200 mg/day IV",
    indication: "GERD, peptic ulcer disease, stress ulcer prophylaxis (NOTE: withdrawn in many countries)",
    contraindications: [
      "Hypersensitivity to ranitidine or H2 blockers"
    ],
    warnings: [
      "⚠️ WITHDRAWN from market in 2020 (US/Canada) due to NDMA contamination concerns",
      "Use famotidine as alternative",
      "Thrombocytopenia (rare)",
      "Altered drug metabolism"
    ],
    sideEffects: [
      "Common: Headache, dizziness, constipation, diarrhea",
      "Less common: Confusion (elderly), bradycardia (IV)",
      "Rare: Thrombocytopenia, hepatitis"
    ],
    interactions: [
      { drug: "Warfarin", effect: "Increased warfarin levels" },
      { drug: "Triazolam", effect: "Increased sedation" },
      { drug: "Drugs requiring gastric acid", effect: "Reduced absorption" }
    ],
    notes: "⚠️ MARKET WITHDRAWAL: Ranitidine was withdrawn in 2020 due to NDMA (carcinogen) contamination concerns. Use famotidine as preferred H2 blocker alternative. Information retained for reference only.",
    renalAdjust: {
      gfr50: "50-75% dose or Q12-24h",
      gfr30: "50% dose or Q12-24h",
      gfr10: "25-50% dose or Q24h",
      hd: "Dose after HD"
    },
    hepaticAdjust: "Use with caution"
  },

  // ============================================================================
  // ROCURONIUM (Zemuron)
  // ============================================================================
  {
    id: "rocuronium",
    name: "Rocuronium (Zemuron)",
    category: "Neuromuscular Blocker",
    route: "IV",
    formulations: [
      { type: "Injection", strengths: "10 mg/mL" }
    ],
    doses: {
      rsiIntubation: { label: "RSI Intubation", value: "1-1.2", unit: "mg/kg IV" },
      routineIntubation: { label: "Routine Intubation", value: "0.6", unit: "mg/kg IV" },
      maintenanceChild: { label: "Maintenance (Child)", value: "0.15", unit: "mg/kg/dose Q20-30min" },
      infusionChild: { label: "Infusion (Child)", value: "5-12", unit: "mcg/kg/min" },
      infusionAdult: { label: "Infusion (Adult)", value: "4-16", unit: "mcg/kg/min" }
    },
    dosingTable: {
      title: "Rocuronium Intubating Conditions",
      columns: ["Dose", "Onset", "Duration"],
      rows: [
        ["0.6 mg/kg", "60-90 sec", "30-40 min"],
        ["0.9 mg/kg", "45-60 sec", "40-60 min"],
        ["1.2 mg/kg", "30-45 sec", "60-90 min"]
      ]
    },
    max: "1.2 mg/kg intubation dose",
    indication: "Rapid sequence intubation, surgical relaxation, facilitation of mechanical ventilation",
    contraindications: [
      "Known hypersensitivity to rocuronium"
    ],
    warnings: [
      "No effect on consciousness/pain - always use with sedation/analgesia",
      "Sugammadex can reverse even deep blockade",
      "Residual paralysis post-procedure",
      "Anaphylaxis possible"
    ],
    sideEffects: [
      "Common: Transient hypotension, tachycardia",
      "Less common: Bronchospasm, rash",
      "Serious: Anaphylaxis, malignant hyperthermia (rare)"
    ],
    interactions: [
      { drug: "Aminoglycosides", effect: "Prolonged blockade" },
      { drug: "Inhaled anesthetics", effect: "Prolonged blockade" },
      { drug: "Magnesium", effect: "Prolonged blockade" },
      { drug: "Sugammadex", effect: "Rapid reversal" }
    ],
    notes: "Aminosteroid NMBA. Faster onset than vecuronium but longer duration. Can be reversed with sugammadex (any depth) or neostigmine (only shallow blockade). Store refrigerated. Onset fastest at higher doses (RSI dose 1-1.2 mg/kg).",
    renalAdjust: "Prolonged duration; use with caution",
    hepaticAdjust: "Prolonged duration; use with caution"
  },

  // ============================================================================
  // SODIUM BICARBONATE
  // ============================================================================
  {
    id: "sodiumbicarbonate",
    name: "Sodium Bicarbonate (NaHCO3)",
    category: "Alkalinizing Agent",
    route: "IV/PO",
    formulations: [
      { type: "Injection 4.2%", strengths: "0.5 mEq/mL (neonatal)" },
      { type: "Injection 8.4%", strengths: "1 mEq/mL" },
      { type: "Tablets", strengths: "325 mg (3.9 mEq), 650 mg (7.7 mEq)" }
    ],
    doses: {
      cardiacArrestChild: { label: "Cardiac Arrest (Child)", value: "1", unit: "mEq/kg IV" },
      cardiacArrestNeo: { label: "Cardiac Arrest (Neo)", value: "1-2", unit: "mEq/kg IV (0.5 mEq/mL)" },
      metabolicAcidosis: { label: "Metabolic Acidosis", value: "0.5-1", unit: "mEq/kg IV slowly" },
      acidosisFormula: { label: "Acidosis Replacement", value: "[0.3 × wt(kg) × base deficit]", unit: "= mEq needed; give 1/2 dose first" },
      rtaChild: { label: "RTA (Child PO)", value: "2-3", unit: "mEq/kg/day ÷ TID-QID" },
      urineAlkalinization: { label: "Urine Alkalinization", value: "84-840", unit: "mg/kg/day PO ÷ Q6-8h" }
    },
    dosingTable: {
      title: "Bicarbonate Calculation for Metabolic Acidosis",
      columns: ["Parameter", "Formula/Value"],
      rows: [
        ["HCO3 deficit (mEq)", "0.3 × wt(kg) × (24 - serum HCO3)"],
        ["Initial replacement", "Give 1/2 calculated deficit"],
        ["Reassess ABG", "After 30-60 minutes"],
        ["Target pH", "7.20-7.25 (not full correction)"]
      ]
    },
    max: "1-2 mEq/kg per dose; titrate to response",
    indication: "Metabolic acidosis (severe), cardiac arrest (prolonged), hyperkalemia, TCA overdose, urine alkalinization",
    contraindications: [
      "Metabolic/respiratory alkalosis",
      "Hypocalcemia (worsens symptoms)",
      "Hypernatremia"
    ],
    warnings: [
      "⚠️ Use 4.2% (0.5 mEq/mL) in neonates - 8.4% causes IVH",
      "Rapid correction may cause paradoxical CNS acidosis",
      "Extravasation causes tissue necrosis",
      "Hypokalemia with rapid correction"
    ],
    sideEffects: [
      "Common: Hypernatremia, hypokalemia, metabolic alkalosis",
      "Less common: Hypocalcemia (ionized)",
      "IV-specific: Tissue necrosis with extravasation"
    ],
    interactions: [
      { drug: "Acidic drugs (aspirin, phenobarbital)", effect: "Increased renal excretion" },
      { drug: "Basic drugs (amphetamines)", effect: "Decreased renal excretion" },
      { drug: "Lithium", effect: "Increased lithium excretion" }
    ],
    notes: "In cardiac arrest: give only after adequate ventilation and compressions. Don't give via same line as calcium (precipitates). For neonates: ALWAYS dilute 8.4% to 4.2% or use commercial 4.2%. Target pH 7.20-7.25 (not normal) in DKA.",
    renalAdjust: "Use with caution; monitor bicarbonate levels",
    hepaticAdjust: null
  },

  // ============================================================================
  // SUCCINYLCHOLINE (Anectine)
  // ============================================================================
  {
    id: "succinylcholine",
    name: "Succinylcholine (Anectine)",
    category: "Neuromuscular Blocker (Depolarizing)",
    route: "IV/IM",
    formulations: [
      { type: "Injection", strengths: "20 mg/mL" }
    ],
    doses: {
      rsiInfant: { label: "RSI (Infant <2yr)", value: "2-3", unit: "mg/kg IV" },
      rsiChild: { label: "RSI (Child >2yr)", value: "1-2", unit: "mg/kg IV" },
      rsiAdult: { label: "RSI (Adult)", value: "1-1.5", unit: "mg/kg IV" },
      imDose: { label: "IM (if no IV)", value: "3-4", unit: "mg/kg IM (max 150 mg)" },
      laryngospasmChild: { label: "Laryngospasm (Child)", value: "0.1-1", unit: "mg/kg IV" }
    },
    max: "150 mg IM; 200 mg IV total",
    indication: "Rapid sequence intubation (when rocuronium unavailable), laryngospasm",
    contraindications: [
      "⚠️ Personal/family history of malignant hyperthermia",
      "Hyperkalemia or risk factors for hyperkalemia",
      "Burns/crush injury >24 hours old",
      "Denervation injuries, prolonged immobility",
      "Myopathies (Duchenne, etc.)",
      "Penetrating eye injury (relative)"
    ],
    warnings: [
      "⚠️ BLACK BOX: Risk of cardiac arrest from hyperkalemia in children with undiagnosed myopathy",
      "⚠️ Malignant hyperthermia trigger",
      "Masseter muscle rigidity may herald MH",
      "Not recommended as routine RSI drug in children"
    ],
    sideEffects: [
      "Common: Fasciculations, muscle pain (postop), transient hyperkalemia",
      "Serious: Malignant hyperthermia, severe hyperkalemia, cardiac arrest",
      "Other: Increased intragastric/intracranial/intraocular pressure"
    ],
    interactions: [
      { drug: "Anticholinesterases", effect: "Prolonged blockade" },
      { drug: "Inhaled anesthetics", effect: "May trigger MH" },
      { drug: "Aminoglycosides", effect: "Prolonged blockade" }
    ],
    notes: "Fastest onset (30-60 sec) of any NMBA but significant risks. Duration: 5-10 min. NOT reversible with sugammadex. Rocuronium preferred for RSI in most pediatric situations. If hyperkalemic arrest: calcium, glucose/insulin, bicarbonate, consider dialysis.",
    renalAdjust: "Contraindicated in hyperkalemia",
    hepaticAdjust: "Prolonged duration (pseudocholinesterase)"
  },

  // ============================================================================
  // TRANEXAMIC ACID (TXA)
  // ============================================================================
  {
    id: "tranexamicacid",
    name: "Tranexamic Acid (TXA, Cyklokapron)",
    category: "Antifibrinolytic",
    route: "IV/PO",
    formulations: [
      { type: "Injection", strengths: "100 mg/mL" },
      { type: "Tablets", strengths: "650 mg" },
      { type: "Oral solution", strengths: "Compounded" }
    ],
    doses: {
      traumaLoading: { label: "Trauma (Loading)", value: "15-20", unit: "mg/kg IV over 10 min (max 1g)" },
      traumaMaint: { label: "Trauma (Maintenance)", value: "2", unit: "mg/kg/hr infusion x 8 hr" },
      cardiacSurgery: { label: "Cardiac Surgery", value: "10-100", unit: "mg/kg bolus + 1-10 mg/kg/hr" },
      epistaxis: { label: "Epistaxis (PO)", value: "25", unit: "mg/kg/dose TID (max 1.5g/dose)" },
      menorrhagia: { label: "Menorrhagia", value: "1300", unit: "mg TID x 5 days", isFixed: true },
      dental: { label: "Dental Procedures", value: "25", unit: "mg/kg/dose Q8h x 2-8 days" }
    },
    max: "4 g/day (varies by indication)",
    indication: "Trauma-associated hemorrhage, cardiac surgery, menorrhagia, hereditary angioedema, dental procedures in hemophilia",
    contraindications: [
      "Active thromboembolic disease",
      "Subarachnoid hemorrhage",
      "History of seizures (relative - dose-dependent)"
    ],
    warnings: [
      "Dose-related seizure risk (especially at high doses)",
      "Thromboembolic events possible",
      "Visual disturbances - ophthalmologic exam for long-term use",
      "Reduce dose in renal impairment"
    ],
    sideEffects: [
      "Common: Nausea, diarrhea, abdominal pain",
      "Less common: Hypotension (if given too fast IV)",
      "Serious: Seizures (high dose), thrombosis"
    ],
    interactions: [
      { drug: "Hormonal contraceptives", effect: "Increased thromboembolic risk" },
      { drug: "Factor IX complex", effect: "Increased thromboembolic risk" },
      { drug: "Retinoids", effect: "Increased thromboembolic risk" }
    ],
    notes: "For trauma: give within 3 hours of injury (no benefit after 3 hours). Infuse slowly (max 100 mg/min) to avoid hypotension. Seizure risk increases at doses >2g or with renal impairment. 10x more potent than aminocaproic acid.",
    renalAdjust: {
      gfr50: "50% dose or Q12h",
      gfr30: "25% dose or Q24h",
      gfr10: "10% dose or Q48h",
      hd: "Dose after HD"
    },
    hepaticAdjust: null
  },

  // ============================================================================
  // TRIMETHOPRIM-SULFAMETHOXAZOLE (Bactrim, Septra)
  // ============================================================================
  {
    id: "tmpsmx",
    name: "Trimethoprim-Sulfamethoxazole (Bactrim)",
    category: "Antibiotic (Sulfonamide)",
    route: "IV/PO",
    formulations: [
      { type: "Tablets SS", strengths: "TMP 80 mg / SMX 400 mg" },
      { type: "Tablets DS", strengths: "TMP 160 mg / SMX 800 mg" },
      { type: "Suspension", strengths: "TMP 40 mg / SMX 200 mg per 5 mL" },
      { type: "Injection", strengths: "TMP 16 mg / SMX 80 mg per mL (5 mL vials)" }
    ],
    doses: {
      utiChild: { label: "UTI (Child)", value: "6-12", unit: "mg TMP/kg/day ÷ BID" },
      utiProphylaxis: { label: "UTI Prophylaxis", value: "2", unit: "mg TMP/kg/dose QHS (max 80 mg)" },
      omChild: { label: "Otitis Media", value: "8-10", unit: "mg TMP/kg/day ÷ BID x 10 days" },
      pcpTreatment: { label: "PCP Treatment", value: "15-20", unit: "mg TMP/kg/day ÷ Q6-8h x 21 days" },
      pcpProphylaxis: { label: "PCP Prophylaxis", value: "5", unit: "mg TMP/kg/day ÷ QD or 3x/week" },
      mrsaSkinChild: { label: "MRSA Skin (Child)", value: "8-12", unit: "mg TMP/kg/day ÷ BID" },
      adultDS: { label: "Adult Standard", value: "1 DS tab", unit: "BID", isFixed: true }
    },
    dosingTable: {
      title: "TMP-SMX Dosing (doses as TMP component)",
      columns: ["Indication", "Dose (TMP)", "Duration"],
      rows: [
        ["UTI", "6-12 mg/kg/day ÷ BID", "7-14 days"],
        ["UTI Prophylaxis", "2 mg/kg QHS", "Per urologist"],
        ["PCP Treatment", "15-20 mg/kg/day ÷ Q6-8h", "21 days"],
        ["PCP Prophylaxis", "5 mg/kg QD or 3x/week", "Ongoing"],
        ["MRSA Skin", "8-12 mg/kg/day ÷ BID", "7-10 days"]
      ]
    },
    max: "320 mg TMP/day (routine); 20 mg TMP/kg/day (PCP)",
    indication: "UTI, otitis media, PCP treatment/prophylaxis, MRSA skin infections, Nocardia, Stenotrophomonas",
    contraindications: [
      "Hypersensitivity to sulfonamides or trimethoprim",
      "Severe hepatic impairment",
      "Megaloblastic anemia due to folate deficiency",
      "Infants <2 months (except PCP treatment)"
    ],
    warnings: [
      "⚠️ Severe skin reactions (SJS/TEN) - discontinue immediately if rash develops",
      "Hyperkalemia (especially elderly, renal impairment, ACE-I/ARB use)",
      "Bone marrow suppression (monitor CBC for prolonged use)",
      "Crystalluria - ensure adequate hydration"
    ],
    sideEffects: [
      "Common: Nausea, vomiting, rash, photosensitivity",
      "Hematologic: Leukopenia, thrombocytopenia, megaloblastic anemia",
      "Serious: SJS/TEN, agranulocytosis, hepatitis, hyperkalemia"
    ],
    interactions: [
      { drug: "Warfarin", effect: "Increased INR (inhibits CYP2C9)" },
      { drug: "Methotrexate", effect: "Increased methotrexate toxicity" },
      { drug: "ACE-I/ARBs/K-sparing diuretics", effect: "Hyperkalemia risk" },
      { drug: "Phenytoin", effect: "Increased phenytoin levels" }
    ],
    notes: "All doses expressed as TMP component. 5:1 ratio (SMX:TMP). Excellent oral bioavailability (IV rarely needed). Good MRSA coverage. Avoid in G6PD deficiency (hemolysis risk). Take with full glass of water. Photosensitivity - use sunscreen.",
    renalAdjust: {
      gfr50: "50-75% dose",
      gfr30: "50% dose or avoid",
      gfr10: "Avoid",
      hd: "Give dose after HD"
    },
    hepaticAdjust: "Avoid in severe hepatic impairment"
  },

  // ============================================================================
  // VANCOMYCIN
  // ============================================================================
  {
    id: "vancomycin",
    name: "Vancomycin (Vancocin)",
    category: "Antibiotic (Glycopeptide)",
    route: "IV/PO",
    formulations: [
      { type: "Injection", strengths: "500 mg, 750 mg, 1 g, 1.5 g vials" },
      { type: "Oral capsules", strengths: "125 mg, 250 mg" },
      { type: "Oral solution", strengths: "25 mg/mL, 50 mg/mL (compounded)" }
    ],
    doses: {
      neoUnder29wk: { label: "Neonate <29wk PMA", value: "15", unit: "mg/kg/dose Q24h" },
      neo29to35wk: { label: "Neonate 29-35wk PMA", value: "15", unit: "mg/kg/dose Q12h" },
      neoTerm: { label: "Neonate Term", value: "15", unit: "mg/kg/dose Q8h" },
      standardChild: { label: "Standard (Child)", value: "15", unit: "mg/kg/dose Q6h (60 mg/kg/day)", maxDose: 750 },
      mrsaSevere: { label: "MRSA Severe/Meningitis", value: "15-20", unit: "mg/kg/dose Q6h (60-80 mg/kg/day)", maxDose: 1000 },
      adultStandard: { label: "Adult Standard", value: "15-20", unit: "mg/kg/dose Q8-12h (adjust by levels)" },
      cdiffChild: { label: "C. diff (PO Child)", value: "10", unit: "mg/kg/dose QID (max 125 mg/dose) x 10 days" },
      cdiffAdult: { label: "C. diff (PO Adult)", value: "125", unit: "mg QID x 10 days", isFixed: true }
    },
    dosingTable: {
      title: "Vancomycin Neonatal Dosing by PMA",
      columns: ["PMA", "Dose", "Interval"],
      rows: [
        ["<29 weeks", "15 mg/kg", "Q24h"],
        ["29-35 weeks", "15 mg/kg", "Q12h"],
        ["36-44 weeks", "15 mg/kg", "Q8h"],
        [">44 weeks", "15 mg/kg", "Q6h"]
      ]
    },
    max: "4 g/day (adult); adjust based on levels",
    indication: "MRSA, MSSA (PCN-allergic), coagulase-negative staph, C. difficile (PO only)",
    contraindications: [
      "History of vancomycin anaphylaxis"
    ],
    warnings: [
      "⚠️ Red man syndrome (infuse over ≥60 min)",
      "Nephrotoxicity (especially with aminoglycosides)",
      "Ototoxicity (rare)",
      "AUC-based dosing now preferred over trough-only"
    ],
    sideEffects: [
      "Common: Red man syndrome (histamine release), phlebitis",
      "Less common: Nephrotoxicity, ototoxicity",
      "Rare: DRESS, neutropenia, linear IgA dermatosis"
    ],
    interactions: [
      { drug: "Aminoglycosides", effect: "Increased nephrotoxicity/ototoxicity" },
      { drug: "Amphotericin B", effect: "Increased nephrotoxicity" },
      { drug: "Loop diuretics", effect: "Increased ototoxicity" },
      { drug: "Piperacillin-tazobactam", effect: "Increased AKI risk" }
    ],
    notes: "IV only for systemic infections (oral not absorbed). Oral ONLY for C. diff. Target AUC/MIC 400-600 (or trough 10-20 mcg/mL). Infuse over ≥60 min (longer for higher doses). Red man syndrome from rapid infusion - slow rate or pretreat with antihistamine.",
    renalAdjust: {
      gfr50: "15 mg/kg Q12h",
      gfr30: "15 mg/kg Q24h",
      gfr10: "15 mg/kg Q48-72h",
      hd: "15-25 mg/kg; redose based on levels"
    },
    hepaticAdjust: null
  },

  // ============================================================================
  // VASOPRESSIN (ADH)
  // ============================================================================
  {
    id: "vasopressin",
    name: "Vasopressin (ADH, Pitressin)",
    category: "Vasopressor/Antidiuretic",
    route: "IV",
    formulations: [
      { type: "Injection", strengths: "20 units/mL" }
    ],
    doses: {
      vasodilShockChild: { label: "Vasodilatory Shock (Child)", value: "0.0003-0.002", unit: "units/kg/min (0.3-2 mU/kg/min)" },
      septicShockFixed: { label: "Septic Shock (Fixed Dose)", value: "0.03-0.04", unit: "units/min (adult)", isFixed: true },
      cardiacArrest: { label: "Cardiac Arrest (Adult)", value: "40", unit: "units IV x1", isFixed: true },
      giBleedInfusion: { label: "GI Bleed (Adult)", value: "0.2-0.4", unit: "units/min (max 0.9 units/min)", isFixed: true },
      diabetesInsipidus: { label: "Diabetes Insipidus", value: "2.5-10", unit: "units IM/SC Q6-12h" }
    },
    dosingTable: {
      title: "Vasopressin Dosing in Shock",
      columns: ["Indication", "Pediatric Dose", "Adult Dose"],
      rows: [
        ["Septic shock (low dose)", "0.0003-0.0008 U/kg/min", "0.01-0.04 U/min"],
        ["Septic shock (high dose)", "0.0008-0.002 U/kg/min", "0.04-0.07 U/min"],
        ["Cardiac arrest", "0.4-1 U/kg (max 40 U)", "40 U x1"]
      ]
    },
    max: "0.002 units/kg/min (children); 0.07 units/min (adults); 40 units (cardiac arrest)",
    indication: "Vasodilatory shock (catecholamine-resistant), cardiac arrest, GI bleeding, diabetes insipidus",
    contraindications: [
      "Hypersensitivity to vasopressin"
    ],
    warnings: [
      "⚠️ Causes severe vasoconstriction - may cause digital/splanchnic ischemia",
      "Water retention and hyponatremia",
      "May precipitate angina/MI in patients with CAD",
      "Usually used as adjunct, not first-line vasopressor"
    ],
    sideEffects: [
      "Cardiovascular: Hypertension, cardiac ischemia, arrhythmias",
      "GI: Abdominal cramps, nausea, mesenteric ischemia",
      "Dermal: Skin necrosis (high doses), pallor"
    ],
    interactions: [
      { drug: "Catecholamines", effect: "Additive vasoconstriction" },
      { drug: "Carbamazepine/chlorpropamide", effect: "Enhanced antidiuretic effect" },
      { drug: "Lithium/demeclocycline", effect: "Decreased antidiuretic effect" }
    ],
    notes: "Acts on V1 (vasoconstriction) and V2 (water reabsorption) receptors. In shock: add to norepinephrine (not replace). Does not require dose titration in shock (fixed low dose). In cardiac arrest: may replace first or second dose of epinephrine. Half-life: 10-20 minutes.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // VECURONIUM (Norcuron)
  // ============================================================================
  {
    id: "vecuronium",
    name: "Vecuronium (Norcuron)",
    category: "Neuromuscular Blocker",
    route: "IV",
    formulations: [
      { type: "Injection", strengths: "10 mg, 20 mg vials (powder)" }
    ],
    doses: {
      intubationChild: { label: "Intubation (Child >1yr)", value: "0.1", unit: "mg/kg IV" },
      intubationInfant: { label: "Intubation (Infant)", value: "0.1", unit: "mg/kg IV (longer duration)" },
      maintenanceChild: { label: "Maintenance (Child)", value: "0.01-0.015", unit: "mg/kg/dose Q15-30min PRN" },
      infusion: { label: "Continuous Infusion", value: "1-2", unit: "mcg/kg/min" },
      rsiDose: { label: "RSI (higher dose)", value: "0.15-0.2", unit: "mg/kg IV (faster onset)" }
    },
    dosingTable: {
      title: "Vecuronium Dosing & Duration",
      columns: ["Dose", "Onset", "Duration"],
      rows: [
        ["0.08-0.1 mg/kg", "2-3 min", "25-40 min"],
        ["0.15-0.2 mg/kg", "1-2 min", "45-60 min"]
      ]
    },
    max: "0.2 mg/kg initial dose",
    indication: "Facilitation of intubation, surgical relaxation, mechanical ventilation",
    contraindications: [
      "Known hypersensitivity to vecuronium"
    ],
    warnings: [
      "No effect on consciousness - always use with sedation",
      "Prolonged recovery in liver/kidney disease",
      "Residual paralysis post-procedure",
      "May cause prolonged weakness in ICU (critical illness myopathy)"
    ],
    sideEffects: [
      "Common: None specific (effects of paralysis)",
      "Less common: Histamine release (minimal vs atracurium)",
      "ICU: Critical illness myopathy with prolonged use"
    ],
    interactions: [
      { drug: "Aminoglycosides", effect: "Prolonged blockade" },
      { drug: "Inhaled anesthetics", effect: "Prolonged blockade" },
      { drug: "Magnesium", effect: "Prolonged blockade" },
      { drug: "Sugammadex", effect: "Rapid reversal" }
    ],
    notes: "Aminosteroid NMBA. Slower onset than rocuronium but fewer CV effects. Can reverse with sugammadex or neostigmine. Infants may have longer duration. Refrigerate reconstituted solution; use within 24 hours.",
    renalAdjust: "Prolonged duration; reduce dose or extend interval",
    hepaticAdjust: "Prolonged duration; reduce dose or extend interval"
  },

  // ============================================================================
  // FAMOTIDINE (Pepcid)
  // ============================================================================
  {
    id: "famotidine",
    name: "Famotidine (Pepcid)",
    category: "H2-Receptor Antagonist",
    route: "IV/PO",
    formulations: [
      { type: "Tablets", strengths: "10 mg, 20 mg, 40 mg" },
      { type: "Oral suspension", strengths: "40 mg/5 mL" },
      { type: "Injection", strengths: "10 mg/mL" }
    ],
    doses: {
      gerdNeo: { label: "GERD (Neonate)", value: "0.5", unit: "mg/kg/dose QD PO/IV" },
      gerdChild: { label: "GERD (Child)", value: "0.5-1", unit: "mg/kg/dose BID (max 40 mg/dose)" },
      pepticUlcer: { label: "Peptic Ulcer (Child)", value: "0.5", unit: "mg/kg/dose BID (max 40 mg)" },
      stressUlcer: { label: "Stress Ulcer Prophylaxis", value: "0.25", unit: "mg/kg/dose Q12h IV" },
      adultPO: { label: "Adult PO", value: "20-40", unit: "mg BID", isFixed: true },
      adultIV: { label: "Adult IV", value: "20", unit: "mg Q12h", isFixed: true }
    },
    max: "40 mg/dose; 80 mg/day",
    indication: "GERD, peptic ulcer disease, stress ulcer prophylaxis, Zollinger-Ellison syndrome",
    contraindications: [
      "Hypersensitivity to famotidine or other H2 blockers"
    ],
    warnings: [
      "Thrombocytopenia (rare)",
      "CNS effects in elderly/renal impairment",
      "May mask symptoms of gastric malignancy"
    ],
    sideEffects: [
      "Common: Headache, dizziness, constipation, diarrhea",
      "Less common: Confusion (elderly), thrombocytopenia",
      "Rare: Arrhythmias (with rapid IV), agranulocytosis"
    ],
    interactions: [
      { drug: "Drugs requiring gastric acid", effect: "Reduced absorption (ketoconazole, iron)" },
      { drug: "Atazanavir", effect: "Reduced absorption" }
    ],
    notes: "Preferred H2 blocker (ranitidine withdrawn due to NDMA). More potent than ranitidine. No significant CYP450 interactions. Give IV over at least 2 min (or 15-30 min for infusion). Less effective than PPIs for erosive esophagitis.",
    renalAdjust: {
      gfr50: "50% dose or Q24h",
      gfr30: "50% dose or Q24-48h",
      gfr10: "25% dose or Q48h",
      hd: "Give after HD"
    },
    hepaticAdjust: "Use with caution in severe impairment"
  },

  // ============================================================================
  // FOSPHENYTOIN (Cerebyx)
  // ============================================================================
  {
    id: "fosphenytoin",
    name: "Fosphenytoin (Cerebyx)",
    category: "Anticonvulsant",
    route: "IV/IM",
    formulations: [
      { type: "Injection", strengths: "75 mg/mL PE (phenytoin equivalents)" }
    ],
    doses: {
      statusLoading: { label: "Status Epilepticus Loading", value: "20", unit: "mg PE/kg IV (max 150 mg PE/min)" },
      additionalLoading: { label: "Additional Loading", value: "5-10", unit: "mg PE/kg (max 30 mg PE/kg total)" },
      maintenance: { label: "Maintenance", value: "4-6", unit: "mg PE/kg/day ÷ Q12h" },
      imLoading: { label: "IM Loading (if no IV)", value: "15-20", unit: "mg PE/kg IM" }
    },
    max: "30 mg PE/kg total loading; rate 150 mg PE/min (3 mg PE/kg/min in peds)",
    indication: "Status epilepticus, seizure prophylaxis (post-neurosurgery/trauma), when oral phenytoin not possible",
    contraindications: [
      "Sinus bradycardia, SA/AV block, Adams-Stokes syndrome",
      "History of hypersensitivity to hydantoins"
    ],
    warnings: [
      "Cardiovascular monitoring during and 30 min post-infusion",
      "Hypotension and arrhythmias (though less than phenytoin)",
      "Paresthesias during infusion (phosphate load)",
      "Teratogenic"
    ],
    sideEffects: [
      "Common: Pruritus, paresthesias (groin, face - phosphate related)",
      "Cardiovascular: Hypotension, bradycardia (less than phenytoin)",
      "CNS: Nystagmus, dizziness, ataxia, somnolence"
    ],
    interactions: [
      { drug: "CYP2C9/2C19 inhibitors", effect: "Increased phenytoin levels" },
      { drug: "CYP3A4 substrates", effect: "Decreased levels of many drugs" },
      { drug: "Enteral feeds", effect: "May reduce absorption once converted" }
    ],
    notes: "Prodrug converted to phenytoin (half-life 8-15 min). Can infuse 3x faster than phenytoin (150 vs 50 mg/min). Can give IM (phenytoin cannot). Dosed in phenytoin equivalents (PE). Wait 2+ hours after dose before checking phenytoin level.",
    renalAdjust: "Use free phenytoin levels; increase free fraction",
    hepaticAdjust: "Reduce dose; use free phenytoin levels"
  },

  // ============================================================================
  // GLYCOPYRROLATE (Robinul)
  // ============================================================================
  {
    id: "glycopyrrolate",
    name: "Glycopyrrolate (Robinul)",
    category: "Anticholinergic",
    route: "IV/IM/PO",
    formulations: [
      { type: "Injection", strengths: "0.2 mg/mL" },
      { type: "Tablets", strengths: "1 mg, 2 mg" },
      { type: "Oral solution", strengths: "1 mg/5 mL" }
    ],
    doses: {
      preoperative: { label: "Preoperative", value: "4-10", unit: "mcg/kg IV/IM (max 0.2 mg)" },
      secretions: { label: "Reduce Secretions", value: "4-10", unit: "mcg/kg/dose Q4-8h" },
      reversalNMBA: { label: "Reversal of NMBA", value: "0.2", unit: "mg per 1 mg neostigmine" },
      bradycardiaChild: { label: "Bradycardia (Child)", value: "4-10", unit: "mcg/kg IV (max 0.1 mg)" },
      sialorrheaChild: { label: "Sialorrhea (Child PO)", value: "40-100", unit: "mcg/kg/day ÷ TID" }
    },
    max: "0.2 mg/dose IV; 8 mg/day PO",
    indication: "Preoperative antisialagogue, reversal of NMBA (with neostigmine), bradycardia, sialorrhea",
    contraindications: [
      "Angle-closure glaucoma",
      "Obstructive uropathy",
      "Paralytic ileus",
      "Myasthenia gravis"
    ],
    warnings: [
      "Does not cross blood-brain barrier (less CNS effects vs atropine)",
      "Tachycardia",
      "Heat intolerance (decreased sweating)",
      "Urinary retention"
    ],
    sideEffects: [
      "Common: Dry mouth, constipation, urinary retention",
      "Cardiovascular: Tachycardia, palpitations",
      "Less common: Blurred vision, flushing, fever"
    ],
    interactions: [
      { drug: "Other anticholinergics", effect: "Additive effects" },
      { drug: "Potassium chloride (oral)", effect: "GI ulceration risk" },
      { drug: "Antacids", effect: "Reduced glycopyrrolate absorption" }
    ],
    notes: "Quaternary ammonium - does not cross BBB (minimal CNS effects vs atropine). Onset IV: 1 min; IM: 15-30 min. Duration: 2-6 hours. Less likely to cause tachycardia than atropine at antisialagogue doses.",
    renalAdjust: "Use with caution; may accumulate",
    hepaticAdjust: null
  },

  // ============================================================================
  // HEPARIN (Unfractionated)
  // ============================================================================
  {
    id: "heparin",
    name: "Heparin (Unfractionated)",
    category: "Anticoagulant",
    route: "IV/SC",
    formulations: [
      { type: "Injection", strengths: "1000, 5000, 10,000, 20,000 units/mL" },
      { type: "Flush solutions", strengths: "10, 100 units/mL" }
    ],
    doses: {
      dvtTreatmentBolus: { label: "DVT/PE Bolus", value: "75-100", unit: "units/kg IV (max 10,000)" },
      dvtInfusionInfant: { label: "DVT Infusion (Infant <1yr)", value: "28", unit: "units/kg/hr" },
      dvtInfusionChild: { label: "DVT Infusion (Child >1yr)", value: "20", unit: "units/kg/hr" },
      dvtAdult: { label: "DVT (Adult)", value: "80", unit: "units/kg bolus, then 18 units/kg/hr", isFixed: true },
      prophylaxisSC: { label: "DVT Prophylaxis (SC)", value: "5000", unit: "units SC Q8-12h", isFixed: true },
      lineLock: { label: "Line Lock", value: "10-100", unit: "units/mL to fill catheter" }
    },
    dosingTable: {
      title: "Heparin Adjustment by aPTT",
      columns: ["aPTT", "Bolus", "Rate Change"],
      rows: [
        ["<50 sec", "50 U/kg", "Increase 10%"],
        ["50-59 sec", "None", "Increase 10%"],
        ["60-85 sec", "None", "No change (therapeutic)"],
        ["86-95 sec", "None", "Decrease 10%"],
        ["96-120 sec", "None", "Hold 30 min, decrease 10%"],
        [">120 sec", "None", "Hold 60 min, decrease 15%"]
      ]
    },
    max: "Titrate to aPTT or anti-Xa level",
    indication: "VTE treatment/prophylaxis, cardiac surgery, dialysis anticoagulation, DIC (selected cases)",
    contraindications: [
      "Active major bleeding",
      "Severe thrombocytopenia",
      "History of HIT"
    ],
    warnings: [
      "⚠️ HIT (heparin-induced thrombocytopenia) - check platelets",
      "Bleeding complications",
      "Osteoporosis with long-term use",
      "Contains preservative (benzyl alcohol) in multidose vials"
    ],
    sideEffects: [
      "Common: Bleeding, injection site reactions",
      "HIT: Thrombocytopenia + thrombosis (typically day 5-14)",
      "Long-term: Osteoporosis, alopecia"
    ],
    interactions: [
      { drug: "NSAIDs/antiplatelet agents", effect: "Increased bleeding risk" },
      { drug: "Thrombolytics", effect: "Increased bleeding risk" },
      { drug: "Nitroglycerin IV", effect: "Decreased heparin effect" }
    ],
    notes: "Monitor aPTT (target 60-85 sec or 1.5-2.5x control) or anti-Xa (0.3-0.7 U/mL). Infants need higher doses (increased clearance). Protamine reverses: 1 mg per 100 units heparin (max 50 mg). HIT antibody testing if platelets fall >50%.",
    renalAdjust: "No dose adjustment; monitor closely",
    hepaticAdjust: "Use with caution; may have increased sensitivity"
  },

  // ============================================================================
  // HYDROCHLOROTHIAZIDE (HCTZ)
  // ============================================================================
  {
    id: "hydrochlorothiazide",
    name: "Hydrochlorothiazide (HCTZ)",
    category: "Thiazide Diuretic",
    route: "PO",
    formulations: [
      { type: "Tablets", strengths: "12.5 mg, 25 mg, 50 mg" },
      { type: "Capsules", strengths: "12.5 mg" },
      { type: "Oral suspension", strengths: "Compounded" }
    ],
    doses: {
      hypertensionChild: { label: "Hypertension (Child)", value: "1-2", unit: "mg/kg/day ÷ QD-BID (max 37.5 mg/day)" },
      edemaChild: { label: "Edema (Child)", value: "1-2", unit: "mg/kg/day ÷ QD-BID" },
      hypertensionAdult: { label: "Hypertension (Adult)", value: "12.5-50", unit: "mg QD", isFixed: true },
      nephroLithiasis: { label: "Nephrolithiasis", value: "1-2", unit: "mg/kg/day QD-BID" }
    },
    max: "50 mg/day (adults); 37.5 mg/day (children)",
    indication: "Hypertension, edema, hypercalciuria/nephrolithiasis, nephrogenic diabetes insipidus",
    contraindications: [
      "Anuria",
      "Hypersensitivity to sulfonamides"
    ],
    warnings: [
      "Electrolyte abnormalities (hypokalemia, hyponatremia, hypochloremia)",
      "Hyperuricemia",
      "Hyperglycemia",
      "Photosensitivity"
    ],
    sideEffects: [
      "Common: Hypokalemia, hyperuricemia, dizziness",
      "Metabolic: Hyponatremia, hypercalcemia, hyperglycemia, dyslipidemia",
      "Rare: Pancreatitis, blood dyscrasias"
    ],
    interactions: [
      { drug: "Lithium", effect: "Increased lithium levels" },
      { drug: "Digoxin", effect: "Hypokalemia increases toxicity risk" },
      { drug: "NSAIDs", effect: "Reduced diuretic effect" },
      { drug: "Corticosteroids", effect: "Additive hypokalemia" }
    ],
    notes: "Less effective in renal impairment (GFR <30). Paradoxically reduces urine output in nephrogenic DI. Takes 3-4 weeks for full antihypertensive effect. Monitor electrolytes. Often combined with K-sparing diuretic.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "May be less effective",
      gfr10: "Usually ineffective; avoid",
      hd: "Not dialyzable"
    },
    hepaticAdjust: "Use with caution in hepatic encephalopathy"
  },

  // ============================================================================
  // HYDROXYZINE (Atarax, Vistaril)
  // ============================================================================
  {
    id: "hydroxyzine",
    name: "Hydroxyzine (Atarax, Vistaril)",
    category: "Antihistamine",
    route: "PO/IM",
    formulations: [
      { type: "Tablets (HCl - Atarax)", strengths: "10 mg, 25 mg, 50 mg" },
      { type: "Capsules (Pamoate - Vistaril)", strengths: "25 mg, 50 mg, 100 mg" },
      { type: "Syrup (HCl)", strengths: "10 mg/5 mL" },
      { type: "Suspension (Pamoate)", strengths: "25 mg/5 mL" },
      { type: "Injection (HCl)", strengths: "25 mg/mL, 50 mg/mL" }
    ],
    doses: {
      anxietyChild: { label: "Anxiety (Child)", value: "0.5-1", unit: "mg/kg/dose Q6h (max 50 mg/dose)" },
      pruritusChild: { label: "Pruritus (Child)", value: "0.5", unit: "mg/kg/dose Q6h" },
      sedationPreop: { label: "Preoperative Sedation", value: "0.5-1", unit: "mg/kg (max 100 mg)" },
      nauseaChild: { label: "Nausea/Vomiting (Child)", value: "0.5-1", unit: "mg/kg/dose Q6h IM" },
      adultAnxiety: { label: "Adult Anxiety", value: "50-100", unit: "mg QID", isFixed: true },
      adultPruritus: { label: "Adult Pruritus", value: "25", unit: "mg TID-QID", isFixed: true }
    },
    max: "100 mg/dose; 400-600 mg/day (adult)",
    indication: "Anxiety, pruritus, sedation, nausea/vomiting, allergic reactions",
    contraindications: [
      "Prolonged QT interval",
      "Early pregnancy",
      "IV administration (causes thrombosis/tissue necrosis)"
    ],
    warnings: [
      "⚠️ QT prolongation - avoid with other QT-prolonging drugs",
      "⚠️ NEVER give IV - causes tissue necrosis",
      "Anticholinergic effects",
      "Sedation"
    ],
    sideEffects: [
      "Common: Sedation, dry mouth, dizziness",
      "Anticholinergic: Urinary retention, blurred vision, constipation",
      "Serious: QT prolongation, seizures (overdose)"
    ],
    interactions: [
      { drug: "CNS depressants", effect: "Additive sedation" },
      { drug: "QT-prolonging drugs", effect: "Additive QT prolongation" },
      { drug: "Anticholinergics", effect: "Additive anticholinergic effects" }
    ],
    notes: "Active metabolite is cetirizine. HCl and pamoate salts are NOT interchangeable mg for mg (pamoate has less active drug). IM injection is painful - give deep IM only. Onset: PO 15-30 min; IM 15-30 min. Duration: 4-6 hours.",
    renalAdjust: "Reduce dose by 50% in severe renal impairment",
    hepaticAdjust: "Reduce dose by 50% in hepatic impairment"
  },

  // ============================================================================
  // MONTELUKAST (Singulair)
  // ============================================================================
  {
    id: "montelukast",
    name: "Montelukast (Singulair)",
    category: "Leukotriene Receptor Antagonist",
    route: "PO",
    formulations: [
      { type: "Tablets", strengths: "10 mg" },
      { type: "Chewable tablets", strengths: "4 mg, 5 mg" },
      { type: "Oral granules", strengths: "4 mg packets" }
    ],
    doses: {
      asthma6moTo5yr: { label: "Asthma/Allergic Rhinitis (6mo-5yr)", value: "4", unit: "mg QHS", isFixed: true },
      asthma6to14yr: { label: "Asthma/Allergic Rhinitis (6-14yr)", value: "5", unit: "mg QHS", isFixed: true },
      asthmaOver15yr: { label: "Asthma/Allergic Rhinitis (≥15yr)", value: "10", unit: "mg QHS", isFixed: true },
      exerciseInduced: { label: "Exercise-induced Bronchoconstriction", value: "10", unit: "mg 2 hr before exercise", isFixed: true }
    },
    dosingTable: {
      title: "Montelukast Dosing by Age",
      columns: ["Age", "Dose", "Formulation"],
      rows: [
        ["6-23 months", "4 mg QHS", "Granules"],
        ["2-5 years", "4 mg QHS", "Chewable or granules"],
        ["6-14 years", "5 mg QHS", "Chewable"],
        ["≥15 years", "10 mg QHS", "Tablet"]
      ]
    },
    max: "10 mg/day",
    indication: "Chronic asthma (add-on therapy), allergic rhinitis, exercise-induced bronchoconstriction",
    contraindications: [
      "Hypersensitivity to montelukast"
    ],
    warnings: [
      "⚠️ BLACK BOX: Neuropsychiatric events (agitation, depression, suicidal thoughts)",
      "Not for acute asthma attacks",
      "Eosinophilic conditions reported",
      "Churg-Strauss syndrome (rare)"
    ],
    sideEffects: [
      "Common: Headache, abdominal pain, upper respiratory infection",
      "Neuropsychiatric: Agitation, aggression, anxiety, depression, sleep disturbances",
      "Rare: Eosinophilic conditions, Churg-Strauss syndrome"
    ],
    interactions: [
      { drug: "Phenobarbital", effect: "Decreased montelukast levels" },
      { drug: "Rifampin", effect: "Decreased montelukast levels" },
      { drug: "Gemfibrozil", effect: "Increased montelukast levels" }
    ],
    notes: "FDA black box warning (2020) for neuropsychiatric events - discuss risks vs benefits. Give in evening for asthma (peak symptoms overnight). Granules can be mixed with soft food. Not a rescue medication.",
    renalAdjust: null,
    hepaticAdjust: "No adjustment for mild-moderate; avoid in severe"
  },

  // ============================================================================
  // NEOSTIGMINE (Prostigmin)
  // ============================================================================
  {
    id: "neostigmine",
    name: "Neostigmine (Prostigmin)",
    category: "Cholinesterase Inhibitor",
    route: "IV/IM/SC",
    formulations: [
      { type: "Injection", strengths: "0.5 mg/mL, 1 mg/mL" }
    ],
    doses: {
      reversalNMBA: { label: "NMBA Reversal", value: "0.03-0.07", unit: "mg/kg IV (max 5 mg)" },
      reversalWithGlyco: { label: "With Glycopyrrolate", value: "0.2 mg glyco per 1 mg neostigmine", unit: "" },
      myastheniaTest: { label: "Myasthenia Gravis Test", value: "0.04", unit: "mg/kg IM" },
      myastheniaTreatment: { label: "MG Treatment", value: "0.01-0.04", unit: "mg/kg/dose Q2-4h" },
      bladderAtony: { label: "Postop Bladder Atony", value: "0.5-1", unit: "mg SC/IM Q3h x 5 doses", isFixed: true }
    },
    max: "5 mg per dose",
    indication: "Reversal of non-depolarizing NMBAs, myasthenia gravis, postoperative urinary retention",
    contraindications: [
      "GI or urinary obstruction",
      "Peritonitis",
      "Hypersensitivity to neostigmine or bromides"
    ],
    warnings: [
      "Always give with anticholinergic (glycopyrrolate or atropine)",
      "May worsen asthma",
      "Cholinergic crisis with overdose",
      "Only reverses shallow NMBA blockade (use sugammadex for deep)"
    ],
    sideEffects: [
      "Muscarinic (blocked by glyco/atropine): Bradycardia, salivation, bronchospasm",
      "Nicotinic: Muscle fasciculations, weakness",
      "GI: Nausea, vomiting, diarrhea, abdominal cramps"
    ],
    interactions: [
      { drug: "Aminoglycosides", effect: "May antagonize neostigmine" },
      { drug: "Corticosteroids", effect: "May decrease effect in myasthenia" },
      { drug: "Beta-blockers", effect: "Increased bradycardia risk" }
    ],
    notes: "Give with glycopyrrolate (0.2 mg per 1 mg neostigmine) or atropine to block muscarinic effects. Only effective when some spontaneous recovery present (TOF >1-2 twitches). Sugammadex preferred for deep blockade. Onset: 1-3 min IV; Duration: 45-60 min.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "50-75% dose",
      gfr10: "Use with caution",
      hd: "N/A"
    },
    hepaticAdjust: null
  },

  // ============================================================================
  // NIFEDIPINE (Procardia)
  // ============================================================================
  {
    id: "nifedipine",
    name: "Nifedipine (Procardia, Adalat)",
    category: "Calcium Channel Blocker",
    route: "PO",
    formulations: [
      { type: "Capsules (IR)", strengths: "10 mg, 20 mg" },
      { type: "Tablets (ER)", strengths: "30 mg, 60 mg, 90 mg" }
    ],
    doses: {
      hypertensiveUrgency: { label: "Hypertensive Urgency", value: "0.25-0.5", unit: "mg/kg/dose SL/PO (max 10 mg)" },
      hypertensionChild: { label: "Hypertension (Child ER)", value: "0.25-0.5", unit: "mg/kg/day QD-BID (max 3 mg/kg/day)" },
      hypertensionAdult: { label: "Hypertension (Adult ER)", value: "30-90", unit: "mg QD", isFixed: true },
      raynauds: { label: "Raynaud's Phenomenon", value: "10-20", unit: "mg TID", isFixed: true }
    },
    max: "120 mg/day (adult); 3 mg/kg/day (child)",
    indication: "Hypertension (ER only), hypertensive urgency, Raynaud's phenomenon, preterm labor tocolysis",
    contraindications: [
      "Cardiogenic shock",
      "Advanced aortic stenosis",
      "Concomitant strong CYP3A4 inhibitors"
    ],
    warnings: [
      "⚠️ IR formulation: Avoid in hypertensive emergencies (unpredictable BP drop)",
      "Reflex tachycardia",
      "Peripheral edema",
      "Grapefruit juice interaction"
    ],
    sideEffects: [
      "Common: Headache, flushing, dizziness, peripheral edema",
      "Cardiovascular: Reflex tachycardia, hypotension",
      "GI: Nausea, constipation, gingival hyperplasia"
    ],
    interactions: [
      { drug: "CYP3A4 inhibitors (azoles, macrolides)", effect: "Increased nifedipine effect" },
      { drug: "CYP3A4 inducers (rifampin, phenytoin)", effect: "Decreased nifedipine effect" },
      { drug: "Grapefruit juice", effect: "Increased levels - avoid" },
      { drug: "Beta-blockers", effect: "Enhanced hypotension" }
    ],
    notes: "Use extended-release for chronic hypertension. IR capsules for hypertensive urgency: bite and swallow or give SL (effect in 5-15 min). IR NOT recommended for routine use due to precipitous BP drops. ER tablets should not be crushed.",
    renalAdjust: null,
    hepaticAdjust: "Reduce dose in hepatic impairment"
  },

  // ============================================================================
  // NITROPRUSSIDE (Nipride)
  // ============================================================================
  {
    id: "nitroprusside",
    name: "Nitroprusside (Nipride)",
    category: "Vasodilator",
    route: "IV",
    formulations: [
      { type: "Injection", strengths: "25 mg/mL (2 mL vial = 50 mg)" }
    ],
    doses: {
      hypertensiveEmergency: { label: "Hypertensive Emergency", value: "0.3-0.5", unit: "mcg/kg/min initial, titrate" },
      maxInfusion: { label: "Maximum Infusion", value: "8-10", unit: "mcg/kg/min (short term)" },
      afterloadReduction: { label: "Afterload Reduction", value: "0.5-3", unit: "mcg/kg/min, titrate to effect" }
    },
    max: "10 mcg/kg/min (brief); maintain <2 mcg/kg/min if possible",
    indication: "Hypertensive emergency, controlled hypotension (surgery), acute heart failure with high SVR",
    contraindications: [
      "Compensatory hypertension (aortic coarctation, AV shunt)",
      "Inadequate cerebral circulation",
      "Acute heart failure with reduced SVR"
    ],
    warnings: [
      "⚠️ Cyanide toxicity (especially renal impairment, prolonged use, high doses)",
      "⚠️ Protect from light - solution turns blue/brown if degraded",
      "Thiocyanate toxicity with prolonged use (>48-72 hr)",
      "Precipitous hypotension"
    ],
    sideEffects: [
      "Common: Hypotension, nausea, diaphoresis",
      "Cyanide toxicity: Metabolic acidosis, tachyphylaxis, confusion, coma",
      "Thiocyanate toxicity: Weakness, confusion, seizures (prolonged use)"
    ],
    interactions: [
      { drug: "Other antihypertensives", effect: "Additive hypotension" },
      { drug: "PDE5 inhibitors (sildenafil)", effect: "Severe hypotension" }
    ],
    notes: "Metabolized to cyanide → thiocyanate (renally cleared). Give thiosulfate (co-infusion) if prolonged use to prevent cyanide toxicity. Monitor thiocyanate levels if used >48-72 hr (toxic >100 mcmol/L). Onset: immediate; Duration: 1-10 min after stopping. Must use with arterial line.",
    renalAdjust: "Thiocyanate accumulates - avoid prolonged use; monitor levels",
    hepaticAdjust: "Cyanide metabolism reduced - use with caution"
  },

  // ============================================================================
  // OCTREOTIDE (Sandostatin)
  // ============================================================================
  {
    id: "octreotide",
    name: "Octreotide (Sandostatin)",
    category: "Somatostatin Analog",
    route: "IV/SC",
    formulations: [
      { type: "Injection", strengths: "50 mcg/mL, 100 mcg/mL, 500 mcg/mL" },
      { type: "LAR depot", strengths: "10 mg, 20 mg, 30 mg (monthly)" }
    ],
    doses: {
      giBleedBolus: { label: "GI Bleed (Bolus)", value: "1-2", unit: "mcg/kg IV (max 50 mcg)" },
      giBleedInfusion: { label: "GI Bleed (Infusion)", value: "1-2", unit: "mcg/kg/hr (max 50 mcg/hr)" },
      hyperinsulinism: { label: "Hyperinsulinemic Hypoglycemia", value: "2-10", unit: "mcg/kg/day ÷ Q6-12h SC" },
      chylothorax: { label: "Chylothorax", value: "1-4", unit: "mcg/kg/hr IV" },
      carcinoid: { label: "Carcinoid (Adult)", value: "100-600", unit: "mcg/day SC ÷ BID-TID", isFixed: true }
    },
    max: "1500 mcg/day (varies by indication)",
    indication: "GI/variceal bleeding, hyperinsulinemic hypoglycemia, chylothorax, carcinoid, acromegaly",
    contraindications: [
      "Hypersensitivity to octreotide"
    ],
    warnings: [
      "Bradycardia and conduction abnormalities",
      "Gallbladder sludge/stones with chronic use",
      "Hypo/hyperglycemia",
      "Hypothyroidism with long-term use"
    ],
    sideEffects: [
      "Common: Nausea, abdominal pain, diarrhea, flatulence",
      "Cardiovascular: Bradycardia, arrhythmias",
      "Metabolic: Hypo/hyperglycemia, cholelithiasis",
      "Injection site: Pain, redness"
    ],
    interactions: [
      { drug: "Cyclosporine", effect: "Decreased cyclosporine levels" },
      { drug: "Insulin/oral hypoglycemics", effect: "May need dose adjustment" },
      { drug: "Beta-blockers/CCBs", effect: "Additive bradycardia" }
    ],
    notes: "For GI bleeding: bolus then infusion for 3-5 days. Decreases splanchnic blood flow and gastric acid secretion. SC injections should be rotated. Monitor glucose closely when starting. Half-life: 1.5 hours.",
    renalAdjust: {
      gfr50: "No change",
      gfr30: "Consider 50% dose",
      gfr10: "Consider 50% dose",
      hd: "Dialyzable - give after HD"
    },
    hepaticAdjust: "Consider dose reduction in cirrhosis"
  },

  // ============================================================================
  // OXYCODONE
  // ============================================================================
  {
    id: "oxycodone",
    name: "Oxycodone (OxyContin, Roxicodone)",
    category: "Opioid Analgesic",
    route: "PO",
    formulations: [
      { type: "IR tablets", strengths: "5 mg, 10 mg, 15 mg, 20 mg, 30 mg" },
      { type: "IR capsules", strengths: "5 mg" },
      { type: "Solution", strengths: "5 mg/5 mL, 20 mg/mL (concentrate)" },
      { type: "ER tablets", strengths: "10 mg, 15 mg, 20 mg, 30 mg, 40 mg, 60 mg, 80 mg" }
    ],
    doses: {
      opioidNaiveChild: { label: "Opioid-Naive (Child)", value: "0.1-0.2", unit: "mg/kg/dose Q4-6h (max 5-10 mg)" },
      moderatePainAdult: { label: "Moderate Pain (Adult IR)", value: "5-15", unit: "mg Q4-6h", isFixed: true },
      severePainAdult: { label: "Severe Pain (Adult IR)", value: "10-30", unit: "mg Q4h", isFixed: true }
    },
    dosingTable: {
      title: "Oxycodone Equianalgesic Conversions",
      columns: ["Opioid", "PO Dose", "Conversion"],
      rows: [
        ["Morphine PO", "30 mg", "1x"],
        ["Oxycodone PO", "20 mg", "1.5x more potent"],
        ["Hydrocodone PO", "30 mg", "Equal to morphine"]
      ]
    },
    max: "Titrate to effect; no fixed ceiling for pain",
    indication: "Moderate to severe pain",
    contraindications: [
      "Significant respiratory depression",
      "Severe bronchial asthma (unmonitored)",
      "GI obstruction",
      "MAO inhibitor use within 14 days"
    ],
    warnings: [
      "⚠️ High abuse potential (Schedule II)",
      "Respiratory depression",
      "Avoid in head injury (may obscure neuro status)",
      "Physical dependence with chronic use"
    ],
    sideEffects: [
      "Common: Constipation, nausea, sedation, pruritus",
      "Less common: Dizziness, vomiting, dry mouth",
      "Serious: Respiratory depression, hypotension"
    ],
    interactions: [
      { drug: "CNS depressants", effect: "Additive respiratory depression" },
      { drug: "CYP3A4 inhibitors", effect: "Increased oxycodone levels" },
      { drug: "MAO inhibitors", effect: "⚠️ Serious/fatal reactions" }
    ],
    notes: "About 1.5x more potent than morphine PO. ER formulations for chronic pain only (not opioid-naive). IR for acute pain. Start bowel regimen prophylactically. Naloxone reverses effects. CYP2D6 converts to oxymorphone.",
    renalAdjust: {
      gfr50: "75% dose",
      gfr30: "50% dose",
      gfr10: "50% dose with caution",
      hd: "Use with caution"
    },
    hepaticAdjust: "Start with 1/3 to 1/2 dose in moderate impairment; avoid in severe"
  },

  // ============================================================================
  // PHENYLEPHRINE
  // ============================================================================
  {
    id: "phenylephrine",
    name: "Phenylephrine (Neo-Synephrine)",
    category: "Alpha-1 Agonist (Vasopressor)",
    route: "IV/Nasal",
    formulations: [
      { type: "Injection", strengths: "10 mg/mL" },
      { type: "Nasal spray", strengths: "0.25%, 0.5%, 1%" }
    ],
    doses: {
      hypotensionBolus: { label: "Hypotension (IV Bolus)", value: "5-20", unit: "mcg/kg/dose IV Q10-15min" },
      hypotensionInfusion: { label: "Hypotension (Infusion)", value: "0.1-0.5", unit: "mcg/kg/min" },
      svtVagal: { label: "SVT (Vagal Maneuver)", value: "5-10", unit: "mcg/kg/dose rapid IV" },
      adultBolus: { label: "Adult Hypotension (Bolus)", value: "100-500", unit: "mcg IV Q10-15min", isFixed: true },
      adultInfusion: { label: "Adult (Infusion)", value: "40-180", unit: "mcg/min", isFixed: true },
      nasalDecongest: { label: "Nasal Decongestant", value: "1-2 sprays", unit: "Q4h PRN (max 3 days)", isFixed: true }
    },
    max: "0.5 mcg/kg/min infusion; 500 mcg/dose bolus",
    indication: "Hypotension (anesthesia, sepsis - adjunct), SVT (vagal maneuver), nasal congestion",
    contraindications: [
      "Severe hypertension",
      "Ventricular tachycardia"
    ],
    warnings: [
      "Reflex bradycardia (especially with bolus dosing)",
      "Tissue necrosis with extravasation",
      "Decreased renal and splanchnic blood flow",
      "Nasal: rhinitis medicamentosa with prolonged use"
    ],
    sideEffects: [
      "Common: Reflex bradycardia, hypertension",
      "Less common: Headache, anxiety, arrhythmias",
      "Nasal: Rebound congestion, rhinitis medicamentosa"
    ],
    interactions: [
      { drug: "MAO inhibitors", effect: "Severe hypertensive crisis" },
      { drug: "Tricyclic antidepressants", effect: "Increased pressor effect" },
      { drug: "Beta-blockers", effect: "Reflex bradycardia may be exaggerated" }
    ],
    notes: "Pure alpha-1 agonist - vasoconstriction without inotropy. Useful in septic shock as adjunct. SVT: rapid IV bolus causes reflex bradycardia (vagal). Nasal spray: limit to 3 days to avoid rebound. Less tachycardia than ephedrine.",
    renalAdjust: null,
    hepaticAdjust: null
  },

  // ============================================================================
  // SPIRONOLACTONE (Aldactone)
  // ============================================================================
  {
    id: "spironolactone",
    name: "Spironolactone (Aldactone)",
    category: "Potassium-Sparing Diuretic",
    route: "PO",
    formulations: [
      { type: "Tablets", strengths: "25 mg, 50 mg, 100 mg" },
      { type: "Oral suspension", strengths: "1 mg/mL, 2.5 mg/mL, 5 mg/mL (compounded)" }
    ],
    doses: {
      diureticChild: { label: "Diuretic (Child)", value: "1-3.3", unit: "mg/kg/day ÷ QD-BID" },
      heartFailure: { label: "Heart Failure (Child)", value: "1-2", unit: "mg/kg/day ÷ QD-BID" },
      ascitesChild: { label: "Ascites (Child)", value: "1-6", unit: "mg/kg/day ÷ QD-BID" },
      primaryAldosteronism: { label: "Hyperaldosteronism", value: "100-400", unit: "mg/day ÷ QD-BID", isFixed: true },
      heartFailureAdult: { label: "Heart Failure (Adult)", value: "12.5-50", unit: "mg QD", isFixed: true }
    },
    max: "200 mg/day (children); 400 mg/day (adults)",
    indication: "Edema (CHF, cirrhosis, nephrotic), hypertension, hypokalemia, hyperaldosteronism",
    contraindications: [
      "Hyperkalemia",
      "Addison's disease",
      "Anuria",
      "Significant renal impairment"
    ],
    warnings: [
      "⚠️ Hyperkalemia - monitor K+ closely",
      "Anti-androgenic effects (gynecomastia, menstrual irregularities)",
      "Tumor risk (high-dose animal studies)",
      "Metabolic acidosis"
    ],
    sideEffects: [
      "Common: Hyperkalemia, GI upset, drowsiness",
      "Endocrine: Gynecomastia, breast tenderness, impotence, menstrual irregularities",
      "Less common: Headache, rash, electrolyte imbalances"
    ],
    interactions: [
      { drug: "ACE-I/ARBs", effect: "Increased hyperkalemia risk" },
      { drug: "NSAIDs", effect: "Decreased diuretic effect, hyperkalemia" },
      { drug: "Potassium supplements", effect: "Hyperkalemia" },
      { drug: "Digoxin", effect: "Increased digoxin levels" }
    ],
    notes: "Aldosterone antagonist with diuretic and anti-androgenic effects. Onset: 2-3 days; Peak: 48-72 hours. Takes 2 weeks for maximal effect. Preferred in CHF and cirrhosis (counteracts secondary hyperaldosteronism). Take with food to improve absorption.",
    renalAdjust: {
      gfr50: "Use with caution",
      gfr30: "Avoid or use with close monitoring",
      gfr10: "Contraindicated",
      hd: "Not dialyzable"
    },
    hepaticAdjust: "Use with caution; monitor for encephalopathy"
  }
];

// Export helper to get drug by ID
export const getDrugById = (id) => childrenFormulary.find(drug => drug.id === id);

// Export drug categories
export const drugCategories = [...new Set(childrenFormulary.map(d => d.category))].sort();
