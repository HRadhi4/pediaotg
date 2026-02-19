/**
 * =============================================================================
 * RENAL DOSE ADJUSTMENTS - Based on Chapter 31 of Pediatric Formulary
 * =============================================================================
 * 
 * This file contains comprehensive renal adjustment data extracted from the
 * "Drugs in Kidney Failure" tables (pages 412-422) of the formulary.
 * 
 * KEY CONCEPTS:
 * - eGFR is estimated using Bedside CKiD equation: 0.413 × height(cm) / SCr(mg/dL)
 * - For µmol/L: 36.5 × height(cm) / SCr(µmol/L)
 * - Adjustments apply when eGFR < 60 mL/min/1.73m²
 * - Do NOT apply to neonates (use dedicated neonatal reference)
 * 
 * ADJUSTMENT STRUCTURE:
 * - percentage: % of usual dose (100 = no change)
 * - interval: dosing interval (e.g., "Q12H", "Q24H")
 * - warning: special warnings or notes
 * - avoid: true if drug should be avoided
 * - monitorLevels: true if serum drug monitoring required
 * - ihd: intermittent hemodialysis guidance
 * - pd: peritoneal dialysis guidance
 * - maxDose: maximum dose cap if applicable
 * - notes: additional clinical notes
 */

// eGFR Categories used in Chapter 31
export const eGFR_CATEGORIES = {
  NORMAL: { min: 60, max: Infinity, label: '≥60' },
  MILD_50_59: { min: 50, max: 59, label: '50-59' },
  MILD_30_49: { min: 30, max: 49, label: '30-49' },
  MODERATE_25_39: { min: 25, max: 39, label: '25-39' },
  MODERATE_15_29: { min: 15, max: 29, label: '15-29' },
  SEVERE_10_24: { min: 10, max: 24, label: '10-24' },
  SEVERE_LESS_10: { min: 0, max: 9, label: '<10' },
  IHD: { label: 'IHD' },
  PD: { label: 'PD' }
};

// Get eGFR category for a given value
export const getEGFRCategory = (egfr) => {
  if (egfr === null || egfr === undefined) return null;
  const val = parseFloat(egfr);
  if (isNaN(val)) return null;
  
  if (val >= 60) return { key: 'normal', ...eGFR_CATEGORIES.NORMAL };
  if (val >= 50) return { key: 'egfr50_59', ...eGFR_CATEGORIES.MILD_50_59 };
  if (val >= 30) return { key: 'egfr30_49', ...eGFR_CATEGORIES.MILD_30_49 };
  if (val >= 25) return { key: 'egfr25_39', ...eGFR_CATEGORIES.MODERATE_25_39 };
  if (val >= 15) return { key: 'egfr15_29', ...eGFR_CATEGORIES.MODERATE_15_29 };
  if (val >= 10) return { key: 'egfr10_24', ...eGFR_CATEGORIES.SEVERE_10_24 };
  return { key: 'egfrLess10', ...eGFR_CATEGORIES.SEVERE_LESS_10 };
};

/**
 * ANTIMICROBIALS REQUIRING ADJUSTMENT IN KIDNEY FAILURE
 * Based on Chapter 31 Table 31.1
 */
export const ANTIMICROBIAL_RENAL_ADJUSTMENTS = {
  // Acyclovir (IV) - Table 31.1
  acyclovir: {
    drugName: 'Acyclovir',
    route: 'IV',
    normalDose: 'See standard dosing',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q8H', notes: 'Normal renal function' },
      egfr50_59: { percentage: 100, interval: 'Q8H', notes: 'No adjustment needed' },
      egfr25_49: { percentage: 100, interval: 'Q12H', notes: 'Extend interval' },
      egfr10_24: { percentage: 100, interval: 'Q24H', notes: 'Extend interval' },
      egfrLess10: { percentage: 50, interval: 'Q24H', notes: 'Reduce dose and extend interval' },
      ihd: { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis', supplementDose: true },
      pd: { percentage: 50, interval: 'Q24H', notes: 'Dose after dialysis' }
    },
    warnings: ['Maintain adequate hydration', 'Neurotoxicity risk in renal impairment'],
    monitorLevels: false
  },

  // Amikacin - Level-guided dosing
  amikacin: {
    drugName: 'Amikacin',
    route: 'IV/IM',
    normalDose: '15-22.5 mg/kg/dose Q24H',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q24H', notes: 'Standard once-daily dosing' },
      egfrLess60: { 
        monitorLevels: true, 
        notes: 'Give standard loading dose. Redose based on serum concentrations.',
        warning: 'Optimal targets may be difficult to reach. Consider alternative agents.'
      },
      ihd: { monitorLevels: true, notes: 'Redose based on serum concentrations after dialysis' },
      pd: { monitorLevels: true, notes: 'Redose based on serum concentrations' }
    },
    warnings: ['High toxicity risk', 'Monitor levels closely', 'Consider alternative agents'],
    monitorLevels: true,
    levelGuidedDosing: true
  },

  // Amoxicillin
  amoxicillin: {
    drugName: 'Amoxicillin',
    route: 'PO',
    normalDose: '25-90 mg/kg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: null, notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: null, notes: 'No adjustment' },
      egfr10_29: { percentage: '50-100', interval: 'Q12H', notes: 'Do NOT use 875mg immediate-release tablets' },
      egfrLess10: { percentage: '50-100', interval: 'Q24H', notes: 'Extend interval' },
      ihd: { percentage: '50-100', interval: 'Q24H', notes: 'Give after dialysis' },
      pd: { percentage: '50-100', interval: 'Q24H', notes: 'Give after dialysis' }
    },
    warnings: ['Do not use 875mg IR tablets if eGFR <30'],
    monitorLevels: false
  },

  // Amoxicillin-Clavulanate (Augmentin)
  'amoxicillin-clavulanate': {
    drugName: 'Amoxicillin-Clavulanate',
    route: 'PO',
    normalDose: '25-90 mg/kg/day (amoxicillin component)',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: null, notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: null, notes: 'No adjustment' },
      egfr10_29: { percentage: '50-100', interval: 'Q12H', notes: 'Do NOT use 875mg IR or 1000mg XR tablets' },
      egfrLess10: { percentage: '50-100', interval: 'Q24H', notes: 'Extend interval' },
      ihd: { percentage: '50-100', interval: 'Q24H', notes: 'Give after dialysis' },
      pd: { percentage: '50-100', interval: 'Q24H', notes: 'Give after dialysis' }
    },
    warnings: ['Do not use 875mg IR or 1000mg XR tablets if eGFR <30'],
    monitorLevels: false
  },

  // Ampicillin (IV)
  ampicillin: {
    drugName: 'Ampicillin',
    route: 'IV',
    normalDose: '100-400 mg/kg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q6H', notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: 'Q6H', notes: 'No adjustment' },
      egfr10_29: { percentage: 100, interval: 'Q6H', notes: 'No adjustment needed' },
      egfrLess10: { percentage: 100, interval: 'Q12H', notes: 'Extend interval' },
      ihd: { percentage: 100, interval: 'Q12H', notes: 'Give after dialysis' },
      pd: { percentage: 100, interval: 'Q12H', notes: 'Give after dialysis' }
    },
    warnings: [],
    monitorLevels: false
  },

  // Ampicillin-Sulbactam
  'ampicillin-sulbactam': {
    drugName: 'Ampicillin-Sulbactam',
    route: 'IV',
    normalDose: '100-200 mg ampicillin/kg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q6H', notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: 'Q6H', notes: 'No adjustment' },
      egfr15_29: { percentage: 100, interval: 'Q12H', notes: 'Extend interval' },
      egfrLess15: { percentage: 100, interval: 'Q24H', notes: 'Extend interval' },
      ihd: { percentage: 100, interval: 'Q24H', notes: 'Give after dialysis' },
      pd: { percentage: 100, interval: 'Q24H', notes: 'Give after dialysis' }
    },
    warnings: [],
    monitorLevels: false
  },

  // Aztreonam
  aztreonam: {
    drugName: 'Aztreonam',
    route: 'IV',
    normalDose: '30 mg/kg/dose Q6-8H',
    neonatalExcluded: true,
    loadingDose: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q6-8H', notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: 'Q6-8H', notes: 'No adjustment' },
      egfr10_30: { percentage: 50, interval: 'Q6-8H', notes: 'Give full loading dose, then 50%', loadingRequired: true },
      egfrLess10: { percentage: '25-33', interval: 'Q6-8H', notes: 'Give full loading dose, then 25-33%', loadingRequired: true },
      ihd: { percentage: '25-33', interval: 'Q6-8H', notes: 'Add 12% supplemental dose post-dialysis for severe infections', supplementDose: '12%' },
      pd: { percentage: '25-33', interval: 'Q6-8H', notes: 'Reduced maintenance dose' }
    },
    warnings: ['Give full initial dose, then adjust maintenance'],
    monitorLevels: false
  },

  // Cefazolin
  cefazolin: {
    drugName: 'Cefazolin',
    route: 'IV/IM',
    normalDose: '25-100 mg/kg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q8H', notes: 'No adjustment' },
      egfr35_54: { percentage: 100, interval: 'Q8H', notes: 'No adjustment' },
      egfr10_34: { percentage: 100, interval: 'Q12H', notes: 'Extend interval' },
      egfrLess10: { percentage: 50, interval: 'Q12-24H', notes: 'Reduce dose and extend interval' },
      ihd: { percentage: 100, interval: null, notes: 'Give after dialysis', supplementDose: true },
      pd: { percentage: 50, interval: 'Q12-24H', notes: 'Reduced dosing' }
    },
    warnings: [],
    monitorLevels: false
  },

  // Cefepime
  cefepime: {
    drugName: 'Cefepime',
    route: 'IV',
    normalDose: '50 mg/kg/dose Q8-12H',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q8H', notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: 'Q12H', notes: 'Extend interval' },
      egfr10_29: { percentage: 100, interval: 'Q24H', notes: 'Extend interval' },
      egfrLess10: { percentage: 50, interval: 'Q24H', notes: 'Reduce dose and extend interval' },
      ihd: { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis', supplementDose: true },
      pd: { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis' }
    },
    warnings: ['Neurotoxicity risk in renal impairment - seizures, encephalopathy'],
    monitorLevels: false
  },

  // Ceftriaxone - No adjustment needed!
  ceftriaxone: {
    drugName: 'Ceftriaxone',
    route: 'IV/IM',
    normalDose: '50-100 mg/kg/day',
    neonatalExcluded: false, // Can use in neonates but with caution
    adjustments: {
      normal: { percentage: 100, interval: null, notes: 'No adjustment needed' },
      all: { percentage: 100, interval: null, notes: 'No renal adjustment required - hepatic elimination' }
    },
    warnings: ['Do not co-infuse with calcium in neonates'],
    monitorLevels: false,
    noAdjustmentNeeded: true
  },

  // Ciprofloxacin
  ciprofloxacin: {
    drugName: 'Ciprofloxacin',
    route: 'PO/IV',
    normalDose: '10-15 mg/kg/dose Q12H',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q12H', notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: 'Q12H', notes: 'No adjustment needed' },
      egfrLess30: { percentage: '50-75', interval: 'Q12H', notes: 'Reduce dose' },
      ihd: { percentage: '50-75', interval: 'Q24H', notes: 'Give after dialysis' },
      pd: { percentage: '50-75', interval: 'Q24H', notes: 'Reduce dose' }
    },
    warnings: ['Avoid use in growing children unless no alternative'],
    monitorLevels: false
  },

  // Fluconazole
  fluconazole: {
    drugName: 'Fluconazole',
    route: 'PO/IV',
    normalDose: '6-12 mg/kg/day',
    neonatalExcluded: false,
    adjustments: {
      normal: { percentage: 100, interval: 'Q24H', notes: 'No adjustment' },
      egfr50_79: { percentage: 100, interval: 'Q24H', notes: 'No adjustment' },
      egfrLess50: { percentage: 50, interval: 'Q24H', notes: 'Give 50% of usual daily dose' },
      ihd: { percentage: 100, interval: 'Q24H', notes: 'Give full dose after each dialysis session' },
      pd: { percentage: 50, interval: 'Q24H', notes: 'Give 50% of dose' }
    },
    warnings: [],
    monitorLevels: false
  },

  // Gentamicin - Level-guided dosing
  gentamicin: {
    drugName: 'Gentamicin',
    route: 'IV/IM',
    normalDose: '5-7.5 mg/kg/dose Q24H (once daily)',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q24H', notes: 'Standard once-daily dosing' },
      egfrLess60: { 
        monitorLevels: true, 
        notes: 'Give standard loading dose. Redose based on serum concentrations.',
        warning: 'Optimal targets may be difficult to reach. Consider alternative agents.'
      },
      ihd: { monitorLevels: true, notes: 'Redose based on serum concentrations after dialysis' },
      pd: { monitorLevels: true, notes: 'Redose based on serum concentrations' }
    },
    warnings: ['High toxicity risk', 'Ototoxicity and nephrotoxicity', 'Monitor levels closely'],
    monitorLevels: true,
    levelGuidedDosing: true
  },

  // Meropenem
  meropenem: {
    drugName: 'Meropenem',
    route: 'IV',
    normalDose: '20-40 mg/kg/dose Q8H',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q8H', notes: 'No adjustment' },
      egfr26_50: { percentage: 100, interval: 'Q12H', notes: 'Extend interval' },
      egfr10_25: { percentage: 50, interval: 'Q12H', notes: 'Reduce dose and extend interval' },
      egfrLess10: { percentage: 50, interval: 'Q24H', notes: 'Reduce dose and extend interval' },
      ihd: { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis', supplementDose: true },
      pd: { percentage: 50, interval: 'Q24H', notes: 'Reduced dosing' }
    },
    warnings: ['Seizure risk in renal impairment'],
    monitorLevels: false
  },

  // Trimethoprim-Sulfamethoxazole (TMP-SMX)
  'trimethoprim-sulfamethoxazole': {
    drugName: 'Trimethoprim-Sulfamethoxazole',
    route: 'PO/IV',
    normalDose: '8-12 mg TMP/kg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q12H', notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: 'Q12H', notes: 'No adjustment' },
      egfr15_29: { percentage: 50, interval: 'Q12H', notes: 'Reduce dose' },
      egfrLess15: { avoid: true, notes: 'Avoid use - high risk of adverse effects' },
      ihd: { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis' },
      pd: { percentage: 50, interval: 'Q24H', notes: 'Reduced dosing' }
    },
    warnings: ['Hyperkalemia risk', 'Crystalluria - maintain hydration'],
    monitorLevels: false
  },

  // Vancomycin - Level-guided dosing
  vancomycin: {
    drugName: 'Vancomycin',
    route: 'IV',
    normalDose: '15 mg/kg/dose Q6H (see trough targets)',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q6H', notes: 'Standard dosing with level monitoring' },
      egfrLess60: { 
        monitorLevels: true, 
        notes: 'Give standard loading dose. Individualize maintenance interval based on serum trough levels.',
        warning: 'Do not auto-calculate maintenance dose. Use therapeutic drug monitoring.'
      },
      ihd: { 
        monitorLevels: true, 
        notes: 'Give loading dose. Redose based on serum concentrations. May need post-dialysis dosing.',
        loadingDose: '25 mg/kg'
      },
      pd: { 
        monitorLevels: true, 
        notes: 'Give loading dose. Redose based on serum concentrations.',
        loadingDose: '25 mg/kg'
      }
    },
    warnings: ['Mandatory TDM (therapeutic drug monitoring)', 'Target trough 10-15 mcg/mL (general) or 15-20 mcg/mL (serious infections)'],
    monitorLevels: true,
    levelGuidedDosing: true,
    loadingDoseRequired: true
  }
};

/**
 * NON-ANTIMICROBIALS REQUIRING ADJUSTMENT IN KIDNEY FAILURE
 * Based on Chapter 31 Table 31.2
 */
export const NON_ANTIMICROBIAL_RENAL_ADJUSTMENTS = {
  // Allopurinol
  allopurinol: {
    drugName: 'Allopurinol',
    route: 'PO',
    normalDose: '10 mg/kg/day or 100-300 mg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q6-24H', notes: 'No adjustment' },
      egfr10_50: { percentage: 50, interval: 'Q6-24H', notes: 'Reduce dose to 50%' },
      egfrLess10: { percentage: 30, interval: 'Q6-24H', notes: 'Reduce dose to 30%' },
      ihd: { percentage: 30, interval: 'Q6-24H', notes: 'Give after dialysis' },
      pd: { percentage: 30, interval: 'Q6-24H', notes: 'Reduced dosing' }
    },
    warnings: ['Risk of allopurinol hypersensitivity syndrome'],
    monitorLevels: false
  },

  // Aspirin - Avoid in renal failure for most indications
  aspirin: {
    drugName: 'Aspirin',
    route: 'PO',
    normalDose: 'Varies by indication',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: null, notes: 'No adjustment' },
      egfr10_50: { percentage: 100, interval: null, notes: 'Use with caution' },
      egfrLess10: { 
        avoid: true, 
        notes: 'Avoid for analgesia/anti-inflammatory. Low-dose antiplatelet may be used with caution.',
        warning: 'Avoid analgesic doses'
      },
      ihd: { percentage: 100, interval: 'Q24H', notes: 'Use low-dose only if required for antiplatelet' },
      pd: { 
        avoid: true, 
        notes: 'Avoid for analgesia/anti-inflammatory indications',
        warning: 'Avoid analgesic doses'
      }
    },
    warnings: ['Avoid for analgesia/anti-inflammatory in severe renal failure', 'GI bleeding risk increased'],
    monitorLevels: false
  },

  // Atenolol
  atenolol: {
    drugName: 'Atenolol',
    route: 'PO',
    normalDose: '1-2 mg/kg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q24H', notes: 'No adjustment' },
      egfr30_50: { fixedDose: '1 mg/kg up to 50 mg', interval: 'Q24H', notes: 'Max 50 mg' },
      egfr10_29: { fixedDose: '1 mg/kg up to 50 mg', interval: 'Q48H', notes: 'Extend interval' },
      egfrLess10: { fixedDose: '1 mg/kg up to 25 mg', interval: 'Q48H', notes: 'Reduce max dose and extend interval' },
      ihd: { fixedDose: '1 mg/kg up to 25 mg', interval: 'Q48H', notes: 'Give after dialysis' },
      pd: { fixedDose: '1 mg/kg up to 25 mg', interval: 'Q48H', notes: 'Reduced dosing' }
    },
    warnings: [],
    monitorLevels: false
  },

  // Captopril
  captopril: {
    drugName: 'Captopril',
    route: 'PO',
    normalDose: '0.1-2 mg/kg/dose Q6-8H',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q6-8H', notes: 'No adjustment' },
      egfr10_50: { percentage: 75, interval: 'Q6-8H', notes: 'Reduce dose to 75%' },
      egfrLess10: { percentage: 50, interval: 'Q6-8H', notes: 'Reduce dose to 50%' },
      ihd: { percentage: 50, interval: 'Q6-8H', notes: 'Give after dialysis' },
      pd: { percentage: 50, interval: 'Q6-8H', notes: 'Reduced dosing' }
    },
    warnings: ['Risk of hyperkalemia', 'Monitor potassium closely'],
    monitorLevels: false
  },

  // Carbamazepine
  carbamazepine: {
    drugName: 'Carbamazepine',
    route: 'PO',
    normalDose: '10-35 mg/kg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q8-12H', notes: 'No adjustment' },
      egfr10_50: { percentage: 100, interval: 'Q8-12H', notes: 'No adjustment needed' },
      egfrLess10: { percentage: 75, interval: 'Q8-12H', notes: 'Reduce dose to 75%' },
      ihd: { percentage: 75, interval: 'Q8-12H', notes: 'Give supplemental dose after dialysis' },
      pd: { percentage: 75, interval: 'Q8-12H', notes: 'Reduced dosing' }
    },
    warnings: ['Active metabolite accumulates in renal failure'],
    monitorLevels: true
  },

  // Digoxin - Special handling
  digoxin: {
    drugName: 'Digoxin',
    route: 'PO/IV',
    normalDose: 'See standard dosing (loading + maintenance)',
    neonatalExcluded: false,
    adjustments: {
      normal: { percentage: 100, interval: 'Q12-24H', notes: 'Standard dosing' },
      digitalizingDose: {
        normal: { percentage: 100, notes: 'Use standard loading dose' },
        esrd: { percentage: 50, notes: 'Use 50% of digitalizing dose' }
      },
      maintenanceDose: {
        egfr30_50: { percentage: 75, interval: 'Q12-24H', notes: 'Reduce maintenance to 75%' },
        egfr10_50: { percentage: 50, interval: 'Q12-24H', notes: 'Reduce maintenance to 50%' },
        egfrLess10: { percentage: 25, interval: 'Q12-24H', notes: 'Reduce maintenance to 25%' },
        ihd: { percentage: 25, interval: 'Q12-24H', notes: 'Not significantly dialyzed' },
        pd: { percentage: 25, interval: 'Q12-24H', notes: 'Reduced maintenance' }
      }
    },
    warnings: ['Monitor digoxin levels', 'Risk of toxicity with electrolyte abnormalities'],
    monitorLevels: true,
    levelGuidedDosing: true
  },

  // Enoxaparin
  enoxaparin: {
    drugName: 'Enoxaparin',
    route: 'SC',
    normalDose: '1 mg/kg/dose Q12H (treatment)',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q12H', notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: 'Q12H', notes: 'Consider monitoring anti-Xa levels' },
      egfrLess30: { percentage: 100, interval: 'Q24H', notes: 'Extend to once daily. Monitor anti-Xa levels.' },
      ihd: { avoid: true, notes: 'Use unfractionated heparin instead' },
      pd: { avoid: true, notes: 'Use unfractionated heparin instead' }
    },
    warnings: ['Monitor anti-Xa levels in renal impairment', 'Accumulation risk'],
    monitorLevels: true
  },

  // Gabapentin
  gabapentin: {
    drugName: 'Gabapentin',
    route: 'PO',
    normalDose: '10-15 mg/kg/day TID',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'TID', notes: 'No adjustment' },
      egfr30_59: { percentage: '50-75', interval: 'BID', notes: 'Reduce dose and frequency' },
      egfr15_29: { percentage: '25-50', interval: 'QD', notes: 'Significantly reduce dose' },
      egfrLess15: { percentage: '10-25', interval: 'QD', notes: 'Significantly reduce dose' },
      ihd: { percentage: '10-25', interval: 'QD', notes: 'Give supplemental dose post-dialysis', supplementDose: '125-350 mg' },
      pd: { percentage: '10-25', interval: 'QD', notes: 'Significantly reduced dosing' }
    },
    warnings: ['CNS depression may be enhanced'],
    monitorLevels: false
  },

  // Levetiracetam (Keppra)
  levetiracetam: {
    drugName: 'Levetiracetam',
    route: 'PO/IV',
    normalDose: '20-60 mg/kg/day divided BID',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q12H', notes: 'No adjustment' },
      egfr50_79: { percentage: '50-100', interval: 'Q12H', notes: 'Consider 50-100% of dose' },
      egfr30_49: { percentage: '50-75', interval: 'Q12H', notes: 'Reduce dose' },
      egfrLess30: { percentage: '25-50', interval: 'Q12H', notes: 'Significant dose reduction' },
      ihd: { percentage: '25-50', interval: 'Q12H', notes: 'Give supplemental dose post-dialysis', supplementDose: '250-500 mg' },
      pd: { percentage: '25-50', interval: 'Q12H', notes: 'Reduced dosing' }
    },
    warnings: ['Behavioral side effects may be more common'],
    monitorLevels: false
  },

  // Metformin - Generally avoided in renal impairment
  metformin: {
    drugName: 'Metformin',
    route: 'PO',
    normalDose: '500-2000 mg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: null, notes: 'No adjustment' },
      egfr45_59: { percentage: 100, interval: null, notes: 'No adjustment. Monitor renal function.' },
      egfr30_44: { percentage: 50, interval: null, notes: 'Reduce dose by 50%. Do not initiate.' },
      egfrLess30: { avoid: true, notes: 'Contraindicated - risk of lactic acidosis' },
      ihd: { avoid: true, notes: 'Contraindicated' },
      pd: { avoid: true, notes: 'Contraindicated' }
    },
    warnings: ['Lactic acidosis risk', 'Hold before contrast procedures'],
    monitorLevels: false
  },

  // Morphine
  morphine: {
    drugName: 'Morphine',
    route: 'PO/IV',
    normalDose: 'Varies by indication',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: null, notes: 'No adjustment' },
      egfr10_50: { percentage: 75, interval: null, notes: 'Reduce dose to 75%. Extend interval as needed.' },
      egfrLess10: { percentage: 50, interval: null, notes: 'Reduce dose to 50%. Active metabolite (M6G) accumulates.' },
      ihd: { percentage: 50, interval: null, notes: 'Metabolites accumulate. Use alternative opioid if possible.' },
      pd: { percentage: 50, interval: null, notes: 'Metabolites accumulate. Consider alternative.' }
    },
    warnings: ['Active metabolite (morphine-6-glucuronide) accumulates', 'Prolonged sedation risk', 'Consider alternative opioids'],
    monitorLevels: false
  },

  // Ranitidine / H2 blockers
  ranitidine: {
    drugName: 'Ranitidine',
    route: 'PO/IV',
    normalDose: '2-4 mg/kg/dose Q8-12H',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'Q8-12H', notes: 'No adjustment' },
      egfrLess50: { percentage: 50, interval: 'Q12-24H', notes: 'Reduce dose by 50%' },
      ihd: { percentage: 50, interval: 'Q12-24H', notes: 'Give after dialysis' },
      pd: { percentage: 50, interval: 'Q12-24H', notes: 'Reduced dosing' }
    },
    warnings: ['CNS effects may be enhanced'],
    monitorLevels: false
  },

  // Spironolactone
  spironolactone: {
    drugName: 'Spironolactone',
    route: 'PO',
    normalDose: '1-3.3 mg/kg/day',
    neonatalExcluded: true,
    adjustments: {
      normal: { percentage: 100, interval: 'QD-BID', notes: 'No adjustment' },
      egfr30_49: { percentage: 100, interval: 'QD-BID', notes: 'Use with caution. Monitor potassium.' },
      egfrLess30: { avoid: true, notes: 'Avoid - high risk of hyperkalemia' },
      ihd: { avoid: true, notes: 'Avoid - hyperkalemia risk' },
      pd: { avoid: true, notes: 'Avoid - hyperkalemia risk' }
    },
    warnings: ['Hyperkalemia risk', 'Monitor potassium closely'],
    monitorLevels: false
  }
};

// Drug name aliases for matching (common trade names, alternative names)
const DRUG_ALIASES = {
  'augmentin': 'amoxicillin-clavulanate',
  'coamoxiclav': 'amoxicillin-clavulanate',
  'clavulin': 'amoxicillin-clavulanate',
  'unasyn': 'ampicillin-sulbactam',
  'zosyn': 'piperacillin-tazobactam',
  'tazocin': 'piperacillin-tazobactam',
  'bactrim': 'trimethoprim-sulfamethoxazole',
  'septra': 'trimethoprim-sulfamethoxazole',
  'cotrimoxazole': 'trimethoprim-sulfamethoxazole',
  'tmpsmx': 'trimethoprim-sulfamethoxazole',
  'zovirax': 'acyclovir',
  'vancocin': 'vancomycin',
  'firvanq': 'vancomycin',
  'garamycin': 'gentamicin',
  'amikin': 'amikacin',
  'rocephin': 'ceftriaxone',
  'maxipime': 'cefepime',
  'merrem': 'meropenem',
  'cipro': 'ciprofloxacin',
  'diflucan': 'fluconazole',
  'flagyl': 'metronidazole',
  'zyvox': 'linezolid',
  'cleocin': 'clindamycin',
  'lasix': 'furosemide',
  'lanoxin': 'digoxin',
  'lovenox': 'enoxaparin',
  'neurontin': 'gabapentin',
  'keppra': 'levetiracetam',
  'glucophage': 'metformin',
  'aldactone': 'spironolactone',
  'zantac': 'ranitidine',
  'tegretol': 'carbamazepine',
  'tenormin': 'atenolol',
  'capoten': 'captopril',
  'zyloprim': 'allopurinol',
};

/**
 * Get renal adjustment for a drug given eGFR value
 * @param {string} drugId - Drug identifier
 * @param {number} egfr - Estimated GFR value
 * @param {boolean} isNeonate - Whether patient is a neonate (≤28 days)
 * @returns {Object} Adjustment details including percentage, interval, warnings
 */
export const getRenalAdjustment = (drugId, egfr, isNeonate = false) => {
  // Normalize drug ID
  let normalizedId = drugId.toLowerCase().replace(/[\s\-()]/g, '');
  
  // Check for aliases first
  for (const [alias, canonical] of Object.entries(DRUG_ALIASES)) {
    if (normalizedId.includes(alias) || alias.includes(normalizedId)) {
      normalizedId = canonical.replace(/[\s\-]/g, '');
      break;
    }
  }
  
  // Check both tables
  const allAdjustments = { ...ANTIMICROBIAL_RENAL_ADJUSTMENTS, ...NON_ANTIMICROBIAL_RENAL_ADJUSTMENTS };
  
  // Find matching drug
  let drugData = null;
  for (const [key, data] of Object.entries(allAdjustments)) {
    const normalizedKey = key.toLowerCase().replace(/[\s\-]/g, '');
    const normalizedDrugName = data.drugName.toLowerCase().replace(/[\s\-]/g, '');
    
    // Check multiple matching strategies
    if (normalizedKey === normalizedId || 
        normalizedDrugName === normalizedId ||
        normalizedId.includes(normalizedKey) ||
        normalizedKey.includes(normalizedId) ||
        normalizedId.includes(normalizedDrugName) ||
        normalizedDrugName.includes(normalizedId)) {
      drugData = data;
      break;
    }
  }
  
  // Drug not found in renal tables
  if (!drugData) {
    return {
      found: false,
      warning: 'No specific renal adjustment guidance in Chapter 31; monitor closely for toxicity in reduced GFR.',
      requiresMonitoring: true
    };
  }
  
  // Check if neonatal exclusion applies
  if (isNeonate && drugData.neonatalExcluded) {
    return {
      found: true,
      neonatalExcluded: true,
      warning: 'Neonatal renal dosing: use a dedicated neonatal reference. Chapter 31 adjustments do not apply to neonates.',
      drugData
    };
  }
  
  // Check if drug has no adjustment needed
  if (drugData.noAdjustmentNeeded) {
    return {
      found: true,
      noAdjustmentNeeded: true,
      percentage: 100,
      interval: null,
      notes: 'No renal adjustment required',
      drugData
    };
  }
  
  // Parse eGFR value
  const egfrVal = parseFloat(egfr);
  if (isNaN(egfrVal)) {
    return { found: true, error: 'Invalid eGFR value', drugData };
  }
  
  // Get eGFR category
  const category = getEGFRCategory(egfrVal);
  
  // Normal kidney function
  if (egfrVal >= 60) {
    const normalAdj = drugData.adjustments.normal || drugData.adjustments.all;
    return {
      found: true,
      category: 'normal',
      categoryLabel: '≥60',
      ...normalAdj,
      drugData
    };
  }
  
  // Find matching adjustment for eGFR category
  const adjustments = drugData.adjustments;
  let matchedAdj = null;
  
  // Priority order for matching
  const matchPriority = [
    // Exact matches
    { key: `egfr${Math.floor(egfrVal / 10) * 10}_${Math.floor(egfrVal / 10) * 10 + 9}`, range: [Math.floor(egfrVal / 10) * 10, Math.floor(egfrVal / 10) * 10 + 9] },
    // Range matches
    { key: 'egfr50_59', range: [50, 59] },
    { key: 'egfr30_49', range: [30, 49] },
    { key: 'egfr35_54', range: [35, 54] },
    { key: 'egfr26_50', range: [26, 50] },
    { key: 'egfr25_49', range: [25, 49] },
    { key: 'egfr30_44', range: [30, 44] },
    { key: 'egfr45_59', range: [45, 59] },
    { key: 'egfr50_79', range: [50, 79] },
    { key: 'egfr15_29', range: [15, 29] },
    { key: 'egfr10_29', range: [10, 29] },
    { key: 'egfr10_30', range: [10, 30] },
    { key: 'egfr10_34', range: [10, 34] },
    { key: 'egfr10_24', range: [10, 24] },
    { key: 'egfr10_50', range: [10, 50] },
    { key: 'egfrLess60', range: [0, 59] },
    { key: 'egfrLess50', range: [0, 49] },
    { key: 'egfrLess30', range: [0, 29] },
    { key: 'egfrLess15', range: [0, 14] },
    { key: 'egfrLess10', range: [0, 9] },
  ];
  
  // Find best matching adjustment
  for (const { key, range } of matchPriority) {
    if (adjustments[key] && egfrVal >= range[0] && egfrVal <= range[1]) {
      matchedAdj = { key, ...adjustments[key] };
      break;
    }
  }
  
  // If no match found but eGFR < 10, use egfrLess10 or lowest available
  if (!matchedAdj && egfrVal < 10) {
    matchedAdj = adjustments.egfrLess10 || adjustments.egfrLess15 || adjustments.egfrLess30;
    if (matchedAdj) {
      matchedAdj = { key: 'egfrLess10', ...matchedAdj };
    }
  }
  
  // Check for level-guided dosing
  if (drugData.levelGuidedDosing && egfrVal < 60) {
    return {
      found: true,
      category: category.key,
      categoryLabel: category.label,
      levelGuidedDosing: true,
      monitorLevels: true,
      loadingDoseRequired: drugData.loadingDoseRequired,
      notes: 'Use standard loading dose; adjust maintenance using therapeutic drug monitoring per local protocol.',
      warnings: drugData.warnings,
      drugData
    };
  }
  
  if (!matchedAdj) {
    return {
      found: true,
      category: category.key,
      categoryLabel: category.label,
      warning: 'No specific adjustment found for this eGFR range. Use clinical judgment.',
      drugData
    };
  }
  
  return {
    found: true,
    category: category.key,
    categoryLabel: category.label,
    ...matchedAdj,
    warnings: drugData.warnings,
    drugData
  };
};

/**
 * Calculate eGFR using Bedside CKiD equation
 * @param {number} height - Height in cm
 * @param {number} creatinine - Serum creatinine in mg/dL or µmol/L
 * @param {string} creatUnit - 'mg/dL' or 'umol/L'
 * @returns {number} Estimated GFR in mL/min/1.73m²
 */
export const calculateBedsideCKiD = (height, creatinine, creatUnit = 'umol/L') => {
  if (!height || !creatinine || height <= 0 || creatinine <= 0) return null;
  
  // Convert µmol/L to mg/dL if needed (divide by 88.4)
  let scrMgDL = creatinine;
  if (creatUnit === 'umol/L' || creatUnit === 'µmol/L') {
    scrMgDL = creatinine / 88.4;
  }
  
  // Bedside CKiD: eGFR = 0.413 × height(cm) / SCr(mg/dL)
  const egfr = (0.413 * height) / scrMgDL;
  
  return parseFloat(egfr.toFixed(1));
};

export default {
  ANTIMICROBIAL_RENAL_ADJUSTMENTS,
  NON_ANTIMICROBIAL_RENAL_ADJUSTMENTS,
  getRenalAdjustment,
  calculateBedsideCKiD,
  getEGFRCategory,
  eGFR_CATEGORIES
};
