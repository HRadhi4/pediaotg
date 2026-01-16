/**
 * Neonatal Seizures Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SeizuresApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="seizures-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Seizures</CardTitle>
        <CardDescription className="text-xs">Recognition & Management Algorithm</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Neonatal Seizures:</strong> Paroxysmal alterations in neurologic function (motor, behavioral, autonomic) occurring in the first 28 days of life.</p>
            <p className="text-red-600 mt-1">⚠️ Clinical seizures often underestimate electrographic (EEG) seizures - up to 80% of EEG seizures may be subclinical</p>
          </div>
        </div>

        {/* Types of Seizures */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Types of Neonatal Seizures</p>
          <div className="space-y-2 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Subtle (Most Common)</p>
              <p>Eye deviation, blinking, lip smacking, cycling movements, apnea</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Clonic (Focal or Multifocal)</p>
              <p>Rhythmic jerking of limbs, face; may migrate</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Tonic (Focal or Generalized)</p>
              <p>Sustained posturing of limbs, trunk; decerebrate/decorticate</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Myoclonic (Focal, Multifocal, Generalized)</p>
              <p>Brief, shock-like jerks of extremities</p>
            </div>
          </div>
        </div>

        {/* Distinguishing from Jitteriness */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Seizures vs. Jitteriness</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-purple-100 dark:bg-purple-900/40">
                <th className="border border-purple-200 p-1">Feature</th>
                <th className="border border-purple-200 p-1">Seizure</th>
                <th className="border border-purple-200 p-1">Jitteriness</th>
              </tr>
            </thead>
            <tbody className="text-purple-600">
              <tr>
                <td className="border border-purple-200 p-1">Stimulus sensitive</td>
                <td className="border border-purple-200 p-1">No</td>
                <td className="border border-purple-200 p-1 font-bold">Yes</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Stopped by restraint</td>
                <td className="border border-purple-200 p-1">No</td>
                <td className="border border-purple-200 p-1 font-bold">Yes</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Eye deviation</td>
                <td className="border border-purple-200 p-1 font-bold">Yes</td>
                <td className="border border-purple-200 p-1">No</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Autonomic changes</td>
                <td className="border border-purple-200 p-1 font-bold">Yes</td>
                <td className="border border-purple-200 p-1">No</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Movement type</td>
                <td className="border border-purple-200 p-1">Clonic (slow-fast)</td>
                <td className="border border-purple-200 p-1">Tremor (equal rate)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Etiology */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Common Etiologies</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Most Common:</p>
              <p>• <strong>HIE (45-60%)</strong></p>
              <p>• Intracranial hemorrhage (IVH, SDH)</p>
              <p>• Stroke (ischemic/hemorrhagic)</p>
            </div>
            <div>
              <p className="font-bold">Infectious:</p>
              <p>• Meningitis</p>
              <p>• Encephalitis (HSV, CMV)</p>
              <p>• Sepsis</p>
            </div>
            <div>
              <p className="font-bold">Metabolic:</p>
              <p>• Hypoglycemia</p>
              <p>• Hypocalcemia</p>
              <p>• Hypo/hypernatremia</p>
              <p>• Pyridoxine dependency</p>
            </div>
            <div>
              <p className="font-bold">Other:</p>
              <p>• Drug withdrawal</p>
              <p>• Inborn errors of metabolism</p>
              <p>• Brain malformations</p>
              <p>• Benign familial seizures</p>
            </div>
          </div>
        </div>

        {/* Workup */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Diagnostic Workup</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p className="font-bold">Immediate:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Glucose (bedside + lab)</div>
              <div>• Electrolytes (Na, Ca, Mg)</div>
              <div>• Blood gas</div>
              <div>• CBC, blood culture</div>
            </div>
            
            <p className="font-bold mt-2">Consider:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• LP (if infection suspected)</div>
              <div>• Ammonia, lactate</div>
              <div>• Head ultrasound</div>
              <div>• EEG/aEEG</div>
              <div>• MRI (when stable)</div>
              <div>• TORCH titers</div>
            </div>
            
            <p className="font-bold mt-2">If refractory:</p>
            <p>• Pyridoxine trial (100 mg IV)</p>
            <p>• Urine organic acids, plasma amino acids</p>
          </div>
        </div>

        {/* Treatment Algorithm */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-blue-700 mb-2">TREATMENT ALGORITHM</p>
          
          {/* Step 0 */}
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-amber-700">Step 0: Treat Reversible Causes</p>
            <div className="text-[8px] text-amber-600 mt-1">
              <p>• Glucose &lt;45 → D10W 2 mL/kg IV push</p>
              <p>• Calcium &lt;7.5 → Calcium gluconate 10% 2 mL/kg slow IV</p>
              <p>• Magnesium &lt;1.5 → MgSO4 50% 0.2 mL/kg IM</p>
            </div>
          </div>

          {/* Step 1 */}
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Step 1: First-Line - Phenobarbital</p>
            <div className="text-[8px] text-blue-600 mt-1">
              <p><strong>Loading:</strong> 20 mg/kg IV over 15-20 min</p>
              {w > 0 && <p className="font-mono text-green-600">= {(w * 20).toFixed(0)} mg</p>}
              <p className="mt-1">If seizures continue after 30 min:</p>
              <p>• Additional 10 mg/kg × 2 doses (max total 40 mg/kg)</p>
              {w > 0 && <p className="font-mono text-green-600">= {(w * 10).toFixed(0)} mg per additional dose</p>}
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-purple-700">Step 2: Second-Line - Phenytoin/Fosphenytoin</p>
            <div className="text-[8px] text-purple-600 mt-1">
              <p><strong>Loading:</strong> 20 mg/kg PE IV over 20-30 min</p>
              {w > 0 && <p className="font-mono text-green-600">= {(w * 20).toFixed(0)} mg PE (Fosphenytoin)</p>}
              <p className="text-[7px] mt-1">Fosphenytoin preferred (less cardiac toxicity, can give faster)</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-teal-700">Step 3: Third-Line Options</p>
            <div className="text-[8px] text-teal-600 mt-1 space-y-1">
              <div className="p-1 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Levetiracetam:</p>
                <p>40-60 mg/kg IV loading</p>
                {w > 0 && <p className="font-mono text-green-600">= {(w * 40).toFixed(0)} - {(w * 60).toFixed(0)} mg</p>}
              </div>
              <div className="p-1 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Midazolam:</p>
                <p>0.15 mg/kg IV bolus, then 0.1-0.4 mg/kg/hr infusion</p>
                {w > 0 && <p className="font-mono text-green-600">Bolus = {(w * 0.15).toFixed(2)} mg</p>}
              </div>
            </div>
          </div>

          {/* Refractory */}
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Refractory Seizures</p>
            <div className="text-[8px] text-red-600 mt-1">
              <p>• Pyridoxine trial 100 mg IV (give during EEG if possible)</p>
              <p>• Lidocaine infusion (2 mg/kg load → 6 mg/kg/hr)</p>
              <p>• Consider burst suppression with midazolam</p>
            </div>
          </div>
        </div>

        {/* Maintenance Therapy */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Maintenance Therapy</p>
          <div className="text-[8px] space-y-1">
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Phenobarbital:</p>
              <p>3-5 mg/kg/day divided q12-24h</p>
              {w > 0 && <p className="text-green-400 font-mono">= {(w * 3).toFixed(0)} - {(w * 5).toFixed(0)} mg/day</p>}
              <p className="text-gray-400">Target level: 15-40 mcg/mL</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Levetiracetam:</p>
              <p>20-30 mg/kg/day divided q12h</p>
              {w > 0 && <p className="text-green-400 font-mono">= {(w * 20).toFixed(0)} - {(w * 30).toFixed(0)} mg/day</p>}
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Phenytoin (if used):</p>
              <p>4-8 mg/kg/day divided q8-12h</p>
              <p className="text-gray-400">Target level: 10-20 mcg/mL</p>
            </div>
          </div>
        </div>

        {/* Duration of Treatment */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Duration of AED Therapy</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Acute symptomatic seizures (HIE, metabolic):</strong></p>
            <p>• Often can discontinue at discharge if seizure-free</p>
            <p>• Wean over 2-4 weeks if normal EEG/exam</p>
            
            <p className="font-bold mt-2">Continue longer if:</p>
            <p>• Abnormal neurologic exam</p>
            <p>• Abnormal EEG at discharge</p>
            <p>• Structural brain lesion</p>
            <p>• Epilepsy syndrome diagnosed</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Depends primarily on underlying etiology</p>
            <p>• HIE: Variable based on severity</p>
            <p>• Metabolic (corrected): Generally good</p>
            <p>• Stroke/hemorrhage: Depends on extent</p>
            <p>• Risk of later epilepsy: 10-30%</p>
            <p>• Neurodevelopmental outcomes variable - early follow-up essential</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SeizuresApproach;
