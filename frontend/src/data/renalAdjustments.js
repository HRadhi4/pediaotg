/**
 * =============================================================================
 * RENAL DOSE ADJUSTMENTS - Based on Chapter 31 of Pediatric Formulary
 * Pages 412-422: "Drugs in Kidney Failure"
 * =============================================================================
 * 
 * This file contains ONLY the renal adjustment data extracted verbatim from
 * Chapter 31 Tables 31.1 and 31.2 of the formulary.
 * 
 * KEY CONCEPTS:
 * - eGFR is estimated using Bedside CKiD equation: 0.413 × height(cm) / SCr(mg/dL)
 * - For µmol/L: 36.5 × height(cm) / SCr(µmol/L)
 * - Adjustments apply when eGFR < 60 mL/min/1.73m² (unless specified otherwise)
 * - Do NOT apply to neonates (use dedicated neonatal reference)
 */

// Drug name aliases for matching (common trade names to formulary names)
export const DRUG_ALIASES = {
  'augmentin': 'amoxicillin-clavulanate',
  'coamoxiclav': 'amoxicillin-clavulanate',
  'clavulin': 'amoxicillin-clavulanate',
  'unasyn': 'ampicillin-sulbactam',
  'zovirax': 'acyclovir',
  'zyloric': 'allopurinol',
  'tenormin': 'atenolol',
  'capoten': 'captopril',
  'tegretol': 'carbamazepine',
  'lanoxin': 'digoxin',
  'bactrim': 'trimethoprim-sulfamethoxazole',
  'septra': 'trimethoprim-sulfamethoxazole',
  'cotrimoxazole': 'trimethoprim-sulfamethoxazole',
};

/**
 * TABLE 31.1: ANTIMICROBIALS REQUIRING ADJUSTMENT IN KIDNEY FAILURE
 * Extracted verbatim from Chapter 31, pages 412-418
 */
export const ANTIMICROBIAL_RENAL_ADJUSTMENTS = {
  
  // Acyclovir (IV)
  'acyclovir': {
    drugName: 'Acyclovir',
    route: 'IV',
    adjustments: {
      'egfr25_50': { percentage: 100, interval: 'Q12H' },
      'egfr10_25': { percentage: 100, interval: 'Q24H' },
      'egfrLess10': { percentage: 50, interval: 'Q24H' },
      'ihd': { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q24H' }
    },
    notes: null
  },

  // Amantadine - NOTE: On day 1, give normal dose, then decrease subsequent doses
  'amantadine': {
    drugName: 'Amantadine',
    route: 'PO',
    adjustments: {
      'egfr30_50': { percentage: 50, interval: 'Q24H' },
      'egfr15_29': { percentage: 50, interval: 'Q48H' },
      'egfrLess15': { percentage: 100, interval: 'Q7days' },
      'ihd': { percentage: 100, interval: 'Q7days' },
      'pd': { percentage: 100, interval: 'Q7days' }
    },
    notes: 'On day 1, give normal dose, then decrease subsequent doses based on renal function.',
    loadingDose: true
  },

  // Amikacin - Level-guided dosing
  'amikacin': {
    drugName: 'Amikacin',
    route: 'IV/IM',
    adjustments: {
      'egfrLess60': { 
        levelGuided: true,
        notes: 'Administer a standard, one-time dose. Determine the appropriate interval for redosing based on serum concentrations.'
      },
      'ihd': { 
        levelGuided: true,
        notes: 'Redose based on concentrations. Optimal pharmacokinetic targets may be difficult to reach; consider alternative agents.'
      },
      'pd': { 
        levelGuided: true,
        notes: 'Redose based on serum concentrations.'
      }
    },
    notes: 'Optimal pharmacokinetic targets may be difficult to reach in patients with impaired kidney function; consider alternative agents.',
    levelGuidedDosing: true
  },

  // Amoxicillin
  'amoxicillin': {
    drugName: 'Amoxicillin',
    route: 'PO',
    adjustments: {
      'egfr10_29': { percentage: 50, interval: 'Q12H' },
      'egfrLess10': { percentage: 50, interval: 'Q24H' },
      'ihd': { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q24H' }
    },
    notes: 'Do not administer 875 mg immediate-release tablets with eGFR <30 mL/min/1.73 m².',
    warnings: ['Do not use 875mg IR tablets if eGFR <30']
  },

  // Amoxicillin/Clavulanate (Augmentin)
  'amoxicillin-clavulanate': {
    drugName: 'Amoxicillin/Clavulanate',
    route: 'PO',
    adjustments: {
      'egfr10_29': { percentage: 50, interval: 'Q12H' },
      'egfrLess10': { percentage: 50, interval: 'Q24H' },
      'ihd': { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q24H' }
    },
    notes: 'Do not administer 875 mg immediate-release or 1000 mg XR extended-release tablet with eGFR <30 mL/min/1.73 m².',
    warnings: ['Do not use 875mg IR or 1000mg XR tablets if eGFR <30']
  },

  // Amphotericin B
  'amphotericin': {
    drugName: 'Amphotericin B',
    route: 'IV',
    adjustments: {},
    notes: 'No guidelines established.',
    noGuidelinesEstablished: true
  },

  // Ampicillin (IV)
  'ampicillin': {
    drugName: 'Ampicillin',
    route: 'IV',
    adjustments: {
      'egfr10_29': { percentage: 100, interval: 'Q8H' },
      'egfrLess10': { percentage: 100, interval: 'Q12H' },
      'ihd': { percentage: 100, interval: 'Q12H', notes: 'Give after dialysis' },
      'pd': { percentage: 100, interval: 'Q12H' }
    },
    notes: null
  },

  // Ampicillin/Sulbactam (Unasyn)
  'ampicillin-sulbactam': {
    drugName: 'Ampicillin/Sulbactam',
    route: 'IV',
    adjustments: {
      'egfr15_29': { percentage: 100, interval: 'Q12H' },
      'egfrLess10': { percentage: 100, interval: 'Q24H' },
      'ihd': { percentage: 100, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 100, interval: 'Q24H' }
    },
    notes: null
  },

  // Aztreonam - NOTE: Administer full dose for initial dose
  'aztreonam': {
    drugName: 'Aztreonam',
    route: 'IV',
    adjustments: {
      'egfr10_30': { percentage: 50, interval: 'Q6-8H' },
      'egfrLess10': { percentage: 25, interval: 'Q6-8H' },
      'ihd': { percentage: 25, interval: 'Q6-8H', notes: 'Administer 12% of the full dose as an additional supplemental dose after dialysis in severe infections.' },
      'pd': { percentage: 25, interval: 'Q6-8H' }
    },
    notes: 'Administer full dose for initial dose, then adjust subsequent doses for kidney function.',
    loadingDose: true
  },

  // Cefaclor
  'cefaclor': {
    drugName: 'Cefaclor',
    route: 'PO',
    adjustments: {
      'egfrLess10': { percentage: 50, interval: 'Q8-12H' },
      'ihd': { percentage: 50, interval: 'Q8-12H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q8-12H' }
    },
    notes: null
  },

  // Cefadroxil
  'cefadroxil': {
    drugName: 'Cefadroxil',
    route: 'PO',
    adjustments: {
      'egfr10_29': { percentage: 100, interval: 'Q24H' },
      'ihd': { percentage: 100, interval: 'Q24H', notes: 'Give after dialysis' },
      'egfrLess10': { percentage: 100, interval: 'Q36H' },
      'pd': { percentage: 100, interval: 'Q36H' }
    },
    notes: null
  },

  // Cefazolin - NOTE: Administer full dose for initial dose
  'cefazolin': {
    drugName: 'Cefazolin',
    route: 'IV/IM',
    adjustments: {
      'egfr11_34': { percentage: 50, interval: 'Q12H' },
      'egfrLess10': { percentage: 50, interval: 'Q24H' },
      'ihd': { fixedDose: '25 mg/kg', interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { fixedDose: '25 mg/kg', interval: 'Q24H' }
    },
    notes: 'Administer full dose for initial dose, then adjust subsequent doses for kidney function.',
    loadingDose: true
  },

  // Cefdinir
  'cefdinir': {
    drugName: 'Cefdinir',
    route: 'PO',
    adjustments: {
      'egfrLess30': { fixedDose: '7 mg/kg (max 300 mg)', interval: 'Q24H' },
      'ihd': { fixedDose: '7 mg/kg (max 300 mg)', interval: 'Q48H', notes: 'Give after dialysis' },
      'pd': { fixedDose: '7 mg/kg (max 300 mg)', interval: 'Q48H' }
    },
    notes: null
  },

  // Cefepime - NOTE: Administer full dose for initial dose
  'cefepime': {
    drugName: 'Cefepime',
    route: 'IV',
    adjustments: {
      'egfr30_60': { percentage: 100, interval: 'Q12H' },
      'egfr10_29': { percentage: 100, interval: 'Q24H' },
      'egfrLess10': { percentage: 50, interval: 'Q24H' },
      'ihd': { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q24H' }
    },
    notes: 'Administer full dose for initial dose, then adjust subsequent doses for kidney function.',
    loadingDose: true
  },

  // Cefiderocol
  'cefiderocol': {
    drugName: 'Cefiderocol',
    route: 'IV',
    adjustments: {
      'egfrMore120': { percentage: 100, interval: 'Q6H' },
      'egfr30_59': { percentage: 75, interval: 'Q8H' },
      'egfr15_29': { percentage: 50, interval: 'Q8H' },
      'egfrLess15': { percentage: 38, interval: 'Q12H' },
      'ihd': { percentage: 38, interval: 'Q12H', notes: 'Give after dialysis' },
      'pd': { percentage: 38, interval: 'Q12H' }
    },
    notes: null
  },

  // Cefixime
  'cefixime': {
    drugName: 'Cefixime',
    route: 'PO',
    adjustments: {
      'egfr21_60': { percentage: 75, interval: 'Q12-24H' },
      'ihd': { percentage: 75, interval: 'Q12-24H' },
      'egfrLess20': { percentage: 50, interval: 'Q12-24H' },
      'pd': { percentage: 50, interval: 'Q12-24H' }
    },
    notes: null
  },

  // Cefotaxime
  'cefotaxime': {
    drugName: 'Cefotaxime',
    route: 'IV',
    adjustments: {
      'egfr30_50': { percentage: 100, interval: 'Q8-12H' },
      'egfr10_29': { percentage: 100, interval: 'Q12H' },
      'egfrLess10': { percentage: 100, interval: 'Q24H' },
      'ihd': { percentage: 100, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 100, interval: 'Q24H' }
    },
    notes: null
  },

  // Cefotetan
  'cefotetan': {
    drugName: 'Cefotetan',
    route: 'IV',
    adjustments: {
      'egfr30_50': { percentage: 50, interval: 'Q12H' },
      'egfrLess10': { percentage: 50, interval: 'Q24H' },
      'ihd': { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q24H' }
    },
    notes: null
  },

  // Cefoxitin
  'cefoxitin': {
    drugName: 'Cefoxitin',
    route: 'IV',
    adjustments: {
      'egfr30_50': { percentage: 100, interval: 'Q8H' },
      'egfr10_30': { percentage: 100, interval: 'Q12H' },
      'egfrLess10': { percentage: 100, interval: 'Q24H' },
      'ihd': { percentage: 100, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 100, interval: 'Q24H' }
    },
    notes: null
  },

  // Cefpodoxime
  'cefpodoxime': {
    drugName: 'Cefpodoxime',
    route: 'PO',
    adjustments: {
      'egfrLess30': { percentage: 100, interval: 'Q24H' },
      'ihd': { notes: 'Administer thrice weekly after dialysis sessions.' }
    },
    notes: null
  },

  // Cefprozil
  'cefprozil': {
    drugName: 'Cefprozil',
    route: 'PO',
    adjustments: {
      'egfrLess30': { percentage: 50, interval: 'Q12-24H' },
      'ihd': { percentage: 50, interval: 'Q12-24H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q12-24H' }
    },
    notes: null
  },

  // Ceftaroline
  'ceftaroline': {
    drugName: 'Ceftaroline',
    route: 'IV',
    adjustments: {
      'egfr30_49': { percentage: 66, interval: 'Q8-12H' },
      'egfr15_29': { percentage: 50, interval: 'Q8-12H' },
      'egfrLess15': { percentage: 33, interval: 'Q8-12H' },
      'ihd': { percentage: 33, interval: 'Q8-12H', notes: 'Give after dialysis' },
      'pd': { percentage: 33, interval: 'Q8-12H' }
    },
    notes: null
  },

  // Ceftazidime - NOTE: Administer full dose for initial dose
  'ceftazidime': {
    drugName: 'Ceftazidime',
    route: 'IV',
    adjustments: {
      'egfr30_50': { percentage: 100, interval: 'Q12H' },
      'egfr10_30': { percentage: 100, interval: 'Q24H' },
      'egfrLess10': { percentage: 50, interval: 'Q24H' },
      'ihd': { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q24H' }
    },
    notes: 'Administer full dose for initial dose, then adjust subsequent doses for kidney function.',
    loadingDose: true
  }
};

/**
 * TABLE 31.2: NON-ANTIMICROBIALS REQUIRING ADJUSTMENT IN KIDNEY FAILURE
 * Extracted verbatim from Chapter 31, pages 418-422
 */
export const NON_ANTIMICROBIAL_RENAL_ADJUSTMENTS = {
  
  // Allopurinol
  'allopurinol': {
    drugName: 'Allopurinol',
    route: 'PO',
    adjustments: {
      'egfr10_50': { percentage: 50, interval: 'Q6-24H' },
      'egfrLess10': { percentage: 30, interval: 'Q6-24H' },
      'ihd': { percentage: 30, interval: 'Q6-24H' },
      'pd': { percentage: 30, interval: 'Q6-24H' }
    },
    notes: null
  },

  // Aminocaproic Acid
  'aminocaproic-acid': {
    drugName: 'Aminocaproic Acid',
    route: 'IV/PO',
    adjustments: {
      'egfrLess60': { percentage: '12-25', interval: 'Q4-6H continuous' },
      'oliguria': { percentage: '12-25', interval: 'Q4-6H continuous' },
      'esrd': { percentage: '12-25', interval: 'Q4-6H continuous' },
      'ihd': { notes: 'No reduction needed' }
    },
    notes: 'Use with caution in patients with renal dysfunction. Can cause renal failure.',
    warnings: ['Use with caution - can cause renal failure']
  },

  // Aspirin
  'aspirin': {
    drugName: 'Aspirin',
    route: 'PO',
    adjustments: {
      'egfr10_50': { percentage: 100, interval: 'Q4-24H' },
      'ihd': { percentage: 100, interval: 'Q24H', notes: 'Give after dialysis' },
      'egfrLess10': { avoid: true, notes: 'Avoid use for analgesia and anti-inflammatory indications.' },
      'pd': { avoid: true, notes: 'Avoid use for analgesia and anti-inflammatory indications.' }
    },
    notes: null,
    warnings: ['Avoid for analgesia/anti-inflammatory if eGFR <10 or on PD']
  },

  // Atenolol
  'atenolol': {
    drugName: 'Atenolol',
    route: 'PO',
    adjustments: {
      'egfr30_50': { fixedDose: '1 mg/kg up to 50 mg', interval: 'Q24H' },
      'egfr10_29': { fixedDose: '1 mg/kg up to 50 mg', interval: 'Q48H' },
      'egfrLess10': { fixedDose: '1 mg/kg up to 25 mg', interval: 'Q48H' },
      'ihd': { fixedDose: '1 mg/kg up to 25 mg', interval: 'Q48H', notes: 'Give after dialysis' },
      'pd': { fixedDose: '1 mg/kg up to 25 mg', interval: 'Q48H' }
    },
    notes: null
  },

  // Azathioprine
  'azathioprine': {
    drugName: 'Azathioprine',
    route: 'PO/IV',
    adjustments: {
      'egfr10_50': { percentage: 75, interval: 'Q24H' },
      'egfrLess10': { percentage: 50, interval: 'Q24H' },
      'ihd': { percentage: 50, interval: 'Q24H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q24H' }
    },
    notes: null
  },

  // Bismuth Subsalicylate
  'bismuth-subsalicylate': {
    drugName: 'Bismuth Subsalicylate',
    route: 'PO',
    adjustments: {
      'egfrLess50': { avoid: true, notes: 'Avoid use in patients with renal failure.' },
      'ihd': { avoid: true, notes: 'Avoid use in patients with renal failure.' },
      'pd': { avoid: true, notes: 'Avoid use in patients with renal failure.' }
    },
    notes: 'Avoid use in patients with renal failure.',
    warnings: ['Avoid in renal failure']
  },

  // Bosentan
  'bosentan': {
    drugName: 'Bosentan',
    route: 'PO',
    adjustments: {},
    notes: 'Dose adjustment not required. Significant clearance by dialysis is not expected.',
    noAdjustmentRequired: true
  },

  // Calcium Supplements
  'calcium': {
    drugName: 'Calcium Supplements',
    route: 'PO/IV',
    adjustments: {
      'egfrLess25': { notes: 'May require dosage adjustment depending on calcium level.' }
    },
    notes: 'May require dosage adjustment depending on calcium level for eGFR <25.'
  },

  // Captopril
  'captopril': {
    drugName: 'Captopril',
    route: 'PO',
    adjustments: {
      'egfr10_50': { percentage: 75, interval: 'Q6-8H' },
      'egfrLess10': { percentage: 50, interval: 'Q6-8H' },
      'ihd': { percentage: 50, interval: 'Q6-8H', notes: 'Give after dialysis' },
      'pd': { percentage: 50, interval: 'Q6-8H' }
    },
    notes: null
  },

  // Carbamazepine
  'carbamazepine': {
    drugName: 'Carbamazepine',
    route: 'PO',
    adjustments: {
      'egfrLess10': { percentage: 75, interval: 'Q8-12H' },
      'ihd': { percentage: 75, interval: 'Q8-12H', notes: 'Give after dialysis' },
      'pd': { percentage: 75, interval: 'Q8-12H' }
    },
    notes: null
  },

  // Cetirizine
  'cetirizine': {
    drugName: 'Cetirizine',
    route: 'PO',
    adjustments: {
      'egfr10_29': { percentage: 50, interval: 'Q24H' },
      'ihd': { percentage: 50, interval: 'Q24H' },
      'pd': { percentage: 50, interval: 'Q24H' },
      'egfrLess10': { notes: 'Use not recommended. Some consider 50% Q24H in this population.' }
    },
    notes: null
  },

  // Chloroquine
  'chloroquine': {
    drugName: 'Chloroquine',
    route: 'PO',
    adjustments: {
      'egfrLess10': { percentage: 50, notes: 'Dose adjustment recommended for long-term use.' },
      'ihd': { percentage: 50 },
      'pd': { percentage: 50 }
    },
    notes: 'Dose adjustment recommended for long-term use.'
  },

  // Chlorothiazide
  'chlorothiazide': {
    drugName: 'Chlorothiazide',
    route: 'PO/IV',
    adjustments: {
      'egfrLess30': { notes: 'May be ineffective.' },
      'egfrLess10': { avoid: true, notes: 'Use not recommended.' }
    },
    notes: 'May be ineffective with eGFR <30. Use not recommended with eGFR <10.'
  },

  // Clobazam
  'clobazam': {
    drugName: 'Clobazam',
    route: 'PO',
    adjustments: {
      'egfrLess50': { avoid: true, notes: 'Avoid use. Has not been studied.' }
    },
    notes: 'Use with caution; has not been studied. Avoid use with eGFR <50.',
    warnings: ['Avoid - has not been studied']
  },

  // Dabigatran
  'dabigatran': {
    drugName: 'Dabigatran',
    route: 'PO',
    adjustments: {
      'egfrLess50': { percentage: 100, interval: 'Q48H' }
    },
    notes: null
  },

  // Desloratadine
  'desloratadine': {
    drugName: 'Desloratadine',
    route: 'PO',
    adjustments: {
      'egfrLess50': { percentage: 100, interval: 'Q48H' }
    },
    notes: null
  },

  // Digoxin
  'digoxin': {
    drugName: 'Digoxin',
    route: 'PO/IV',
    adjustments: {
      'digitalizing': {
        'esrd': { percentage: 50, notes: 'Use 50% of digitalizing dose in ESRD.' }
      },
      'maintenance': {
        'egfr30_50': { percentage: 75, interval: 'Q12-24H' }
      }
    },
    notes: 'Digitalizing dose: 50% in ESRD. Maintenance dose: 75% for eGFR 30-50.',
    specialDosing: true
  }
};

// Get eGFR category label
export const getEGFRCategory = (egfr) => {
  if (egfr === null || egfr === undefined) return null;
  const val = parseFloat(egfr);
  if (isNaN(val)) return null;
  
  if (val >= 60) return { key: 'normal', label: '≥60' };
  if (val >= 50) return { key: 'egfr50_59', label: '50-59' };
  if (val >= 30) return { key: 'egfr30_49', label: '30-49' };
  if (val >= 15) return { key: 'egfr15_29', label: '15-29' };
  if (val >= 10) return { key: 'egfr10_14', label: '10-14' };
  return { key: 'egfrLess10', label: '<10' };
};

/**
 * Get renal adjustment for a drug given eGFR value
 */
export const getRenalAdjustment = (drugId, egfr, isNeonate = false) => {
  // Normalize drug ID
  let normalizedId = drugId.toLowerCase().replace(/[\s\-()]/g, '');
  
  // Check for aliases
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
  let matchedKey = null;
  for (const [key, data] of Object.entries(allAdjustments)) {
    const normalizedKey = key.toLowerCase().replace(/[\s\-]/g, '');
    const normalizedDrugName = data.drugName.toLowerCase().replace(/[\s\-]/g, '');
    
    if (normalizedKey === normalizedId || 
        normalizedDrugName === normalizedId ||
        normalizedId.includes(normalizedKey) ||
        normalizedKey.includes(normalizedId)) {
      drugData = data;
      matchedKey = key;
      break;
    }
  }
  
  // Drug not found in Chapter 31 tables
  if (!drugData) {
    return {
      found: false,
      warning: 'No specific renal adjustment guidance in Chapter 31; monitor closely for toxicity in reduced GFR.',
      requiresMonitoring: true
    };
  }
  
  // Check if neonatal (Chapter 31 excludes neonates)
  if (isNeonate) {
    return {
      found: true,
      neonatalExcluded: true,
      warning: 'Neonatal renal dosing: use a dedicated neonatal reference. Chapter 31 adjustments do not apply to neonates.',
      drugData
    };
  }
  
  // Check for no guidelines established
  if (drugData.noGuidelinesEstablished) {
    return {
      found: true,
      noGuidelinesEstablished: true,
      notes: drugData.notes || 'No guidelines established.',
      drugData
    };
  }
  
  // Check for no adjustment required
  if (drugData.noAdjustmentRequired) {
    return {
      found: true,
      noAdjustmentRequired: true,
      percentage: 100,
      notes: drugData.notes,
      drugData
    };
  }
  
  const egfrVal = parseFloat(egfr);
  if (isNaN(egfrVal)) {
    return { found: true, error: 'Invalid eGFR value', drugData };
  }
  
  // Get eGFR category
  const category = getEGFRCategory(egfrVal);
  
  // Normal kidney function (eGFR >= 60) - no adjustment needed
  if (egfrVal >= 60 && !drugData.adjustments['egfrMore120']) {
    return {
      found: true,
      category: 'normal',
      categoryLabel: '≥60',
      percentage: 100,
      notes: 'No adjustment needed for eGFR ≥60',
      drugData
    };
  }
  
  // Level-guided dosing (aminoglycosides, vancomycin, etc.)
  if (drugData.levelGuidedDosing && egfrVal < 60) {
    const adj = drugData.adjustments['egfrLess60'] || drugData.adjustments['ihd'];
    return {
      found: true,
      category: category.key,
      categoryLabel: category.label,
      levelGuidedDosing: true,
      notes: adj?.notes || drugData.notes || 'Use standard loading dose; adjust maintenance using therapeutic drug monitoring.',
      warnings: drugData.warnings,
      loadingDose: drugData.loadingDose,
      drugData
    };
  }
  
  // Find matching adjustment for eGFR range
  const adjustments = drugData.adjustments;
  let matchedAdj = null;
  
  // Check ranges from highest to lowest
  const ranges = [
    { key: 'egfrMore120', min: 120, max: Infinity },
    { key: 'egfr30_60', min: 30, max: 60 },
    { key: 'egfr30_59', min: 30, max: 59 },
    { key: 'egfr30_50', min: 30, max: 50 },
    { key: 'egfr30_49', min: 30, max: 49 },
    { key: 'egfr25_50', min: 25, max: 50 },
    { key: 'egfr21_60', min: 21, max: 60 },
    { key: 'egfr15_29', min: 15, max: 29 },
    { key: 'egfr11_34', min: 11, max: 34 },
    { key: 'egfr10_50', min: 10, max: 50 },
    { key: 'egfr10_30', min: 10, max: 30 },
    { key: 'egfr10_29', min: 10, max: 29 },
    { key: 'egfr10_25', min: 10, max: 25 },
    { key: 'egfrLess60', min: 0, max: 59 },
    { key: 'egfrLess50', min: 0, max: 49 },
    { key: 'egfrLess30', min: 0, max: 29 },
    { key: 'egfrLess20', min: 0, max: 19 },
    { key: 'egfrLess15', min: 0, max: 14 },
    { key: 'egfrLess10', min: 0, max: 9 }
  ];
  
  for (const { key, min, max } of ranges) {
    if (adjustments[key] && egfrVal >= min && egfrVal <= max) {
      matchedAdj = { key, ...adjustments[key] };
      break;
    }
  }
  
  if (!matchedAdj) {
    return {
      found: true,
      category: category.key,
      categoryLabel: category.label,
      notes: drugData.notes || 'No specific adjustment found for this eGFR range.',
      drugData
    };
  }
  
  return {
    found: true,
    category: category.key,
    categoryLabel: category.label,
    ...matchedAdj,
    warnings: drugData.warnings,
    loadingDose: drugData.loadingDose,
    drugData
  };
};

/**
 * Calculate eGFR using Bedside CKiD equation
 */
export const calculateBedsideCKiD = (height, creatinine, creatUnit = 'umol/L') => {
  if (!height || !creatinine || height <= 0 || creatinine <= 0) return null;
  
  let scrMgDL = creatinine;
  if (creatUnit === 'umol/L' || creatUnit === 'µmol/L') {
    scrMgDL = creatinine / 88.4;
  }
  
  const egfr = (0.413 * height) / scrMgDL;
  return parseFloat(egfr.toFixed(1));
};

export default {
  ANTIMICROBIAL_RENAL_ADJUSTMENTS,
  NON_ANTIMICROBIAL_RENAL_ADJUSTMENTS,
  DRUG_ALIASES,
  getRenalAdjustment,
  calculateBedsideCKiD,
  getEGFRCategory
};
