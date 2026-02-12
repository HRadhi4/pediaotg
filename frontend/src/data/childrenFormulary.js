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
  }
];

// Export helper to get drug by ID
export const getDrugById = (id) => childrenFormulary.find(drug => drug.id === id);

// Export drug categories
export const drugCategories = [...new Set(childrenFormulary.map(d => d.category))].sort();
