/**
 * Neonatal Seizures Approach
 * Updated: 2023 ILAE Guidelines
 * Simplified design matching Apnea approach
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SeizuresApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="seizures-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Seizures</CardTitle>
        <CardDescription className="text-xs">Recognition & Management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2023 ILAE Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2023)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Definition:</strong> Pause ≥20 sec, OR with bradycardia/desat in first 28 days</p>
            <p><strong>cEEG:</strong> Up to 80% are subclinical - EEG monitoring recommended</p>
            <p><strong>First-line:</strong> Phenobarbital (ILAE 2023)</p>
            <p><strong>Duration:</strong> D/C before discharge for acute symptomatic seizures</p>
          </div>
        </div>

        {/* Types */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Types of Neonatal Seizures</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Subtle (Most Common)</p>
              <p>Eye deviation, lip smacking, cycling</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Clonic</p>
              <p>Rhythmic jerking - most likely epileptic</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Tonic</p>
              <p>Sustained posturing of limbs</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Myoclonic</p>
              <p>Brief, shock-like jerks</p>
            </div>
          </div>
        </div>

        {/* Etiology */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Common Causes</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Most Common (80%):</p>
              <p>• <strong>HIE (45-60%)</strong></p>
              <p>• ICH (IVH, SDH)</p>
              <p>• Stroke</p>
            </div>
            <div>
              <p className="font-bold">Metabolic:</p>
              <p>• Hypoglycemia</p>
              <p>• Hypocalcemia</p>
              <p>• Hypomagnesemia</p>
            </div>
          </div>
        </div>

        {/* Workup */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Workup</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-green-600">
            <div>
              <p className="font-bold">Immediate:</p>
              <p>• Glucose (POC + lab)</p>
              <p>• Electrolytes (Ca, Mg, Na)</p>
              <p>• cEEG/aEEG</p>
              <p>• Cranial US</p>
            </div>
            <div>
              <p className="font-bold">Second-tier:</p>
              <p>• LP (infection)</p>
              <p>• MRI (when stable)</p>
              <p>• Metabolic workup</p>
              <p>• TORCH titers</p>
            </div>
          </div>
        </div>

        {/* Treatment Algorithm */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">2023 ILAE Treatment</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Step 0 - Treat Reversible Causes:</p>
            <p>• Glucose &lt;45 → D10W 2 mL/kg</p>
            <p>• Calcium &lt;7 → Ca gluconate 10% 2 mL/kg</p>
            
            <p className="font-bold text-cyan-400 mt-2">Step 1 - Phenobarbital:</p>
            <p>Loading: 20 mg/kg IV → can give 10 mg/kg × 2 more</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 20).toFixed(0)} mg (max total: {(w * 40).toFixed(0)} mg)</p>}
            
            <p className="font-bold text-purple-400 mt-2">Step 2 - Second Line:</p>
            <p>• Levetiracetam 40-60 mg/kg</p>
            <p>• OR Fosphenytoin 20 mg PE/kg</p>
            {w > 0 && <p className="text-green-400 font-mono">LEV: {(w * 40).toFixed(0)}-{(w * 60).toFixed(0)} mg</p>}
          </div>
        </div>

        {/* Maintenance */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Maintenance Therapy</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-indigo-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Phenobarbital:</p>
              <p>4 mg/kg/day divided q12-24h</p>
              {w > 0 && <p className="text-green-600 font-mono">= {(w * 4).toFixed(0)} mg/day</p>}
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Levetiracetam:</p>
              <p>20-30 mg/kg/day divided q8-12h</p>
              {w > 0 && <p className="text-green-600 font-mono">= {(w * 20).toFixed(0)}-{(w * 30).toFixed(0)} mg/day</p>}
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Duration (ILAE 2023)</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Acute symptomatic:</strong> D/C before discharge if seizure-free</p>
            <p><strong>Continue if:</strong> Neonatal epilepsy syndrome, ongoing seizures</p>
            <p>• Don't wait for normal EEG to stop</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Depends primarily on underlying etiology</p>
            <p>• Metabolic: Generally excellent</p>
            <p>• HIE: Variable based on severity</p>
            <p>• Risk of later epilepsy: 10-30%</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SeizuresApproach;
