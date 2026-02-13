/**
 * Electrolyte Calculator Result Display Components
 * 
 * Extracted from ElectrolytesDialog.jsx to improve maintainability.
 * These components handle the display of calculation results for different
 * electrolyte correction methods.
 */

import { AlertCircle, Clock, AlertTriangle, CheckCircle, Syringe } from "lucide-react";

/**
 * Generic IV Result Display
 * Used for Calcium, Magnesium, Potassium IV, Phosphate
 */
export const GenericIVResult = ({ results }) => {
  if (!results.calculation) return null;
  
  return (
    <div className="space-y-3">
      {/* Rounded indicator */}
      {results.isRounded && (
        <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
          ≈ Doses rounded to nearest 5 for easier dilution
        </p>
      )}
      
      {/* Calculation Details */}
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
          <span className="text-muted-foreground">Dose:</span>
          <span className="font-mono font-semibold">{results.calculation.dose}</span>
        </div>
        <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
          <span className="text-muted-foreground">Drug Volume:</span>
          <span className="font-mono">{results.calculation.drugVolume}</span>
        </div>
        <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
          <span className="text-muted-foreground">Diluent:</span>
          <span className="font-mono">{results.calculation.diluent}</span>
        </div>
        <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
          <span className="text-muted-foreground">Total Volume:</span>
          <span className="font-mono">{results.calculation.totalVolume}</span>
        </div>
      </div>
      
      {/* Administration */}
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-blue-800 dark:text-blue-200">Administration</span>
        </div>
        <div className="text-sm space-y-1">
          <p><strong>Duration:</strong> {results.administration.duration}</p>
          <p><strong>Rate:</strong> {results.administration.rate}</p>
        </div>
      </div>
      
      {/* Preparation Summary */}
      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Syringe className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-800 dark:text-green-200">Preparation</span>
        </div>
        <p className="text-sm font-mono">{results.preparation}</p>
      </div>
      
      {/* Order */}
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-xs font-semibold mb-1">📋 Order:</p>
        <p className="font-mono text-sm">{results.order}</p>
        {results.frequency && (
          <p className="text-xs mt-1 text-muted-foreground">Frequency: {results.frequency}</p>
        )}
      </div>
      
      {/* Notes */}
      {results.notes && (
        <p className="text-xs text-muted-foreground italic">{results.notes}</p>
      )}
      
      {/* Warnings */}
      {results.warnings && results.warnings.length > 0 && (
        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-semibold">Warning</span>
          </div>
          {results.warnings.map((warning, i) => (
            <p key={i} className="text-xs text-red-700 dark:text-red-300">{warning}</p>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Oral Potassium Result Display
 */
export const OralPotassiumResult = ({ results }) => {
  if (!results.poResult) return null;
  
  return (
    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 text-center space-y-2">
      {results.isRounded && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          ≈ Doses rounded to nearest 5
        </p>
      )}
      <p className="text-lg font-bold text-green-800 dark:text-green-300">
        {results.poResult.perDose} {results.poResult.frequency}
      </p>
      <p className="text-sm text-muted-foreground">
        ({results.poResult.dailyDose} total = {results.poResult.perKg})
      </p>
    </div>
  );
};

/**
 * Nelson Method for Hypernatremia
 */
export const NelsonMethodResult = ({ results }) => {
  if (!results.nelsonData) return null;
  const data = results.nelsonData;
  
  return (
    <div className="space-y-3">
      {/* Step 1: Volume Restoration */}
      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200">
        <p className="text-xs font-bold text-red-700 dark:text-red-300 mb-2">Step 1: If Volume Depleted</p>
        <p className="font-mono text-sm">NS Bolus: <strong>{data.bolusVolume} ml</strong> (20 ml/kg) over 20 min</p>
        <p className="text-xs text-muted-foreground mt-1">Max 2 boluses</p>
      </div>
      
      {/* Step 2: Correction Rate */}
      <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border-2 border-teal-400">
        <p className="text-xs font-bold text-teal-700 dark:text-teal-300 mb-2">
          Step 2: Correction (Na {data.naRange} → {data.correctionHours} hrs)
        </p>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Formula: 2 × Maintenance ÷ {data.correctionHours} hrs</p>
          <p className="text-xs text-muted-foreground">= 2 × {data.maintenance} ml/day ÷ {data.correctionHours}</p>
        </div>
        <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded">
          <p className="text-xs font-semibold">Order:</p>
          <p className="font-mono text-lg font-bold text-teal-800 dark:text-teal-200">IVF NS @ {data.fluidRate} ml/hr</p>
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
          <p>• Volume depletion: NS bolus {data.bolusVolume} ml (20 ml/kg)</p>
          <p>• <strong className="text-red-600">Seizures:</strong> 3% NaCl <strong>{data.seizureRescue} ml</strong> (4-6 ml/kg) over 30 min</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Harriet Lane Method for Hypernatremia
 */
export const HarrietLaneResult = ({ results }) => {
  if (!results.harrietData) return null;
  const data = results.harrietData;
  
  return (
    <div className="space-y-3">
      {/* Header with Na values */}
      <div className="p-2 rounded bg-purple-50 dark:bg-purple-900/20 text-xs">
        <div className="flex justify-between">
          <span>Current Na: <strong>{data.currentNa}</strong> mEq/L</span>
          <span>Desired Na: <strong>{data.desiredNa}</strong> mEq/L</span>
        </div>
        <div className="text-center mt-1 text-[10px] text-muted-foreground">
          Deficit: {data.deficitType === "infant" ? "Infant" : "Child"} {data.deficitPercent}% = {data.totalDeficit} ml
        </div>
      </div>
      
      {/* Step 1: Calculate Deficits */}
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">Step 1: Calculate Deficits</p>
        <div className="space-y-1 text-xs">
          <p><strong>Free Water Deficit (FWD)</strong> = 4 × Wt × (Current Na - Desired Na)</p>
          <p className="pl-4">= <strong>{data.freeWaterDeficit} ml</strong></p>
          <p className="mt-2"><strong>Solute Fluid Deficit (SFD)</strong> = Total Deficit - FWD</p>
          <p className="pl-4">= {data.totalDeficit} - {data.freeWaterDeficit} = <strong>{data.soluteFluidDeficit} ml</strong></p>
        </div>
      </div>
      
      {/* Step 2: Total Fluid */}
      <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200">
        <p className="text-xs font-bold text-teal-700 dark:text-teal-300 mb-2">Step 2: Total Fluid (24 hrs)</p>
        <div className="space-y-1 text-xs">
          <p>Maintenance: {data.maintenance} ml/day + Deficit: {data.totalDeficit} ml</p>
          <p className="font-semibold">= {data.totalFluidVolume} ml/24hr</p>
        </div>
        <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded">
          <p className="font-mono font-bold text-teal-800 dark:text-teal-200">{data.fluidRate} ml/hr</p>
        </div>
      </div>
      
      {/* Step 3: Na Required */}
      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">Step 3: Na Requirement</p>
        <div className="space-y-1 text-xs">
          <p>Na = (SFD + Maintenance) × 0.14 mEq/ml</p>
          <p>= ({data.soluteFluidDeficit} + {data.maintenance}) × 0.14</p>
          <p className="font-semibold">= {data.naRequired} mEq</p>
          <p className="mt-1">Na Concentration needed: <strong>{data.naContentInFluid} mEq/L</strong></p>
        </div>
      </div>
      
      {/* Step 4: Recommended Fluid */}
      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-400">
        <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">Recommended Fluid</p>
        <p className="font-mono font-bold text-lg text-green-800 dark:text-green-200">{data.recommendedFluid}</p>
        <p className="text-xs text-muted-foreground mt-1">@ {data.fluidRate} ml/hr × 24 hrs</p>
      </div>
      
      {/* Hypertonic calculation if Na > 170 */}
      {data.hypertonicCalc && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-300">
          <p className="text-xs font-bold text-red-700 dark:text-red-300 mb-2">
            <AlertTriangle className="inline h-3 w-3 mr-1" />
            Severe Hypernatremia (Na &gt;170)
          </p>
          <div className="text-xs space-y-1">
            <p>If initial bolus needed, fortify NS with 3% saline:</p>
            <p>• NS bolus: {data.hypertonicCalc.nsBolus} ml</p>
            <p>• Add: {data.hypertonicCalc.toAdd} ml of 3% NaCl</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Mild Hyponatremia (Standard Method) Result
 */
export const MildHyponatremiaResult = ({ results }) => {
  if (!results.mildData) return null;
  const data = results.mildData;
  
  return (
    <div className="space-y-3">
      {/* Header with Na values */}
      <div className="p-2 rounded bg-cyan-50 dark:bg-cyan-900/20 text-xs">
        <div className="flex justify-between">
          <span>Current Na: <strong>{data.currentNa}</strong> mEq/L</span>
          <span>Target Na: <strong>{data.targetNa}</strong> mEq/L</span>
        </div>
        <div className="text-center mt-1 text-[10px] text-muted-foreground">
          Deficit: {data.deficitType === "infant" ? "Infant" : "Child"} {data.deficitPercent}% = {data.deficit} ml
        </div>
      </div>
      
      {/* Step 1: Volume Calculation */}
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">Step 1: Total Volume (24 hrs)</p>
        <div className="space-y-1 text-xs">
          <p>Maintenance: {data.maintenance} ml + Deficit: {data.deficit} ml</p>
          <p className="font-semibold">= {data.totalVolume} ml/day (max 2500 ml)</p>
          <p className="font-mono mt-1">= <strong>{data.hourlyRate} ml/hr</strong></p>
        </div>
      </div>
      
      {/* Step 2: Na Calculation */}
      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">Step 2: Sodium Needed</p>
        <div className="space-y-1 text-xs">
          <p>Na Deficit = Wt × 0.6 × (Target - Current) = {data.naDeficit} mEq</p>
          <p>Na Maintenance = Wt × 2 = {data.naMaintenance} mEq</p>
          <p className="font-semibold">Total Na = {data.totalNa} mEq</p>
          <p className="mt-1">Concentration needed: <strong>{data.naConcentration} mEq/L</strong></p>
        </div>
      </div>
      
      {/* Step 3: Fluid Type - Auto Selected */}
      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-400">
        <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">
          <CheckCircle className="inline h-3 w-3 mr-1" />
          Auto-Selected Fluid (based on Na need)
        </p>
        <p className="font-mono font-bold text-lg text-green-800 dark:text-green-200">{data.fluidType}</p>
        <p className="text-xs text-muted-foreground mt-1">Contains {data.fluidNa} mEq/L Na</p>
      </div>
      
      {/* Order Summary */}
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-xs font-semibold mb-1">Order:</p>
        <p className="font-mono text-sm">IVF {data.fluidType.split(' ')[0]} + D5% @ {data.hourlyRate} ml/hr</p>
        <p className="text-xs text-muted-foreground mt-1">
          (Mix: {data.nsVolume}ml {data.fluidType.split(' ')[0]} + {data.d50Volume}ml D50% per 500ml)
        </p>
      </div>
    </div>
  );
};

/**
 * 3% NaCl Method for Hyponatremia
 */
export const ThreePercentNaClResult = ({ results }) => {
  if (!results.threePercentData) return null;
  const data = results.threePercentData;
  
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="p-2 rounded bg-cyan-50 dark:bg-cyan-900/20 text-xs">
        <div className="flex justify-between">
          <span>Current Na: <strong>{data.currentNa}</strong> mEq/L</span>
          <span>Target Na: <strong>{data.targetNa}</strong> mEq/L</span>
        </div>
        <p className="text-center mt-1 text-[10px] text-cyan-700 dark:text-cyan-400">
          1 mEq Na = 2 ml of 3% NaCl
        </p>
      </div>
      
      {/* Maintenance (Shown Separately) */}
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">
          Maintenance 3% NaCl (Shown Separately)
        </p>
        <div className="space-y-1 text-xs">
          <p>{data.maintenanceRate} mEq/kg/day × {data.weight} kg = {data.maintenanceNaMEq} mEq/day</p>
          <p className="font-mono font-semibold">= {data.maintenance3PercentMl} ml/day of 3% NaCl</p>
        </div>
      </div>
      
      {/* Deficit Calculation */}
      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">Deficit Correction</p>
        <div className="space-y-1 text-xs">
          <p>({data.targetNa} - {data.currentNa}) × 0.6 × {data.weight} kg = {data.naDeficitMEq} mEq</p>
          <p className="font-mono font-semibold">= {data.deficit3PercentMl} ml of 3% NaCl</p>
        </div>
      </div>
      
      {/* Option A: With Bolus */}
      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-400">
        <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">
          Option A: With Bolus
        </p>
        <div className="space-y-2 text-xs">
          <div className="p-2 bg-white dark:bg-gray-900 rounded">
            <p className="font-semibold">1. Bolus (½ deficit):</p>
            <p className="font-mono">{data.halfDeficitMl} ml of 3% NaCl over 30 min</p>
          </div>
          <div className="p-2 bg-white dark:bg-gray-900 rounded">
            <p className="font-semibold">2. IV (½ deficit over 24hr):</p>
            <p className="font-mono">{data.halfDeficitMl} ml @ {data.halfDeficitHourlyRate} ml/hr</p>
          </div>
        </div>
      </div>
      
      {/* Option B: Without Bolus */}
      <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200">
        <p className="text-xs font-bold text-teal-700 dark:text-teal-300 mb-2">
          Option B: Without Bolus (Full deficit over 24hr)
        </p>
        <p className="font-mono text-sm font-semibold">
          {data.deficit3PercentMl} ml @ {data.deficitHourlyRate} ml/hr
        </p>
      </div>
      
      {/* N.B. Note */}
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-l-4 border-amber-500">
        <p className="text-xs text-slate-700 dark:text-slate-300">
          <strong>N.B.:</strong> If patient is already on maintenance fluids, add the deficit correction to the maintenance amount.
        </p>
      </div>
    </div>
  );
};

/**
 * Severe Hyponatremia Result
 */
export const SevereHyponatremiaResult = ({ results }) => {
  if (!results.severeData) return null;
  const data = results.severeData;
  
  return (
    <div className="space-y-3">
      {/* Warning Header */}
      <div className="p-3 rounded-lg bg-red-100 dark:bg-red-950/50 border-2 border-red-400">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="font-bold text-red-700 dark:text-red-300">
            Severe Hyponatremia (Na &lt;125 with symptoms)
          </span>
        </div>
        <p className="text-xs text-red-600 dark:text-red-400">
          Current Na: {data.currentNa} mEq/L - Requires urgent treatment
        </p>
      </div>
      
      {/* 3% Saline Bolus - PRIMARY TREATMENT */}
      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border-2 border-red-300">
        <p className="text-xs font-bold text-red-700 dark:text-red-300 mb-2">
          3% Saline Bolus (Preferred)
        </p>
        <div className="space-y-2">
          <div className="p-2 bg-white dark:bg-gray-900 rounded">
            <p className="font-mono text-lg font-bold text-red-800 dark:text-red-200">
              {data.bolusVolumeLow}-{data.bolusVolumeHigh} ml
            </p>
            <p className="text-xs text-muted-foreground">Over 30 mins, preferably via central line</p>
          </div>
          <p className="text-xs">• May repeat bolus up to 3 times if symptoms persist</p>
          <p className="text-xs">• Check Na after each bolus</p>
        </div>
      </div>
      
      {/* Max Correction Warning */}
      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
            Max Correction Limits
          </span>
        </div>
        <div className="text-xs space-y-1">
          <p>• First 24 hrs: <strong>8-10 mEq/L</strong></p>
          <p>• Each subsequent 24 hrs: <strong>8 mEq/L</strong></p>
          <p className="text-amber-700 dark:text-amber-400 mt-2">
            Rapid correction risks Osmotic Demyelination Syndrome (ODS)
          </p>
        </div>
      </div>
    </div>
  );
};
