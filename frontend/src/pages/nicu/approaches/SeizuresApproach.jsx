/**
 * Neonatal Seizures Approach
 * Updated: 2023 ILAE Guidelines (International League Against Epilepsy)
 * Reference: ILAE Task Force Guidelines 2023, Epilepsia Journal
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SeizuresApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="seizures-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Seizures</CardTitle>
        <CardDescription className="text-xs">Recognition & Management Algorithm</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2023 ILAE Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Neonatal Seizures:</strong> Paroxysmal alterations in neurologic function (motor, behavioral, autonomic) occurring in the first 28 days of life (or 44 weeks PMA for preterm).</p>
            <p className="text-red-600 mt-1">⚠️ Up to 80% of EEG seizures are subclinical - continuous EEG monitoring recommended for diagnosis and management</p>
          </div>
        </div>

        {/* Types of Seizures */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Types of Neonatal Seizures</p>
          <div className="space-y-2 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Subtle (Most Common in Term)</p>
              <p>Eye deviation, blinking, lip smacking, cycling/swimming movements, apnea</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Clonic (Focal or Multifocal)</p>
              <p>Rhythmic jerking of limbs, face; often migrate - most likely epileptic</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Tonic (Focal or Generalized)</p>
              <p>Sustained posturing of limbs, trunk; generalized often non-epileptic</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Myoclonic (Focal, Multifocal, Generalized)</p>
              <p>Brief, shock-like jerks; generalized may indicate poor prognosis</p>
            </div>
          </div>
        </div>

        {/* Seizures vs. Jitteriness */}
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
                <td className="border border-purple-200 p-1">Stopped by flexion/restraint</td>
                <td className="border border-purple-200 p-1">No</td>
                <td className="border border-purple-200 p-1 font-bold">Yes</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Eye deviation/autonomic</td>
                <td className="border border-purple-200 p-1 font-bold">Yes</td>
                <td className="border border-purple-200 p-1">No</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Movement type</td>
                <td className="border border-purple-200 p-1">Clonic (fast-slow-fast)</td>
                <td className="border border-purple-200 p-1">Tremor (equal oscillation)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Etiology */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Common Etiologies</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Most Common (80%):</p>
              <p>• <strong>HIE (45-60%)</strong></p>
              <p>• Intracranial hemorrhage (IVH, SDH)</p>
              <p>• Ischemic stroke</p>
            </div>
            <div>
              <p className="font-bold">Infectious:</p>
              <p>• Bacterial meningitis</p>
              <p>• HSV encephalitis</p>
              <p>• CMV, other TORCH</p>
            </div>
            <div>
              <p className="font-bold">Metabolic:</p>
              <p>• Hypoglycemia</p>
              <p>• Hypocalcemia/hypomagnesemia</p>
              <p>• Pyridoxine dependency</p>
              <p>• Inborn errors (IEM)</p>
            </div>
            <div>
              <p className="font-bold">Genetic/Other:</p>
              <p>• Neonatal epilepsy syndromes</p>
              <p>• Brain malformations</p>
              <p>• Drug withdrawal</p>
              <p>• BFNE (benign familial)</p>
            </div>
          </div>
        </div>

        {/* Workup */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Diagnostic Workup (2023 ILAE)</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p className="font-bold">Immediate (all infants):</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Glucose (bedside POC + lab)</div>
              <div>• Electrolytes (Na, Ca, Mg)</div>
              <div>• Blood gas</div>
              <div>• CBC, blood culture</div>
              <div>• <strong>Continuous EEG/aEEG</strong></div>
              <div>• Cranial ultrasound</div>
            </div>
            
            <p className="font-bold mt-2">Second-tier:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• LP (meningitis/HSV)</div>
              <div>• Ammonia, lactate, pyruvate</div>
              <div>• MRI brain (when stable)</div>
              <div>• TORCH titers</div>
            </div>
            
            <p className="font-bold mt-2">If refractory/etiology unclear:</p>
            <p>• Pyridoxine/pyridoxal-5-phosphate trial</p>
            <p>• Urine organic acids, plasma amino acids</p>
            <p>• Genetic testing (epilepsy gene panel, WES/WGS)</p>
          </div>
        </div>

        {/* 2023 ILAE Treatment Algorithm */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-blue-700 mb-2">2023 ILAE TREATMENT ALGORITHM</p>
          
          {/* Step 0 */}
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-amber-700">Step 0: Treat Reversible Causes FIRST</p>
            <div className="text-[8px] text-amber-600 mt-1">
              <p>• Glucose &lt;45 mg/dL → D10W 2 mL/kg IV</p>
              <p>• Calcium &lt;7.0 mg/dL → Ca gluconate 10% 2 mL/kg slow IV (over 10 min)</p>
              <p>• Magnesium &lt;1.5 mg/dL → MgSO4 50% 0.2 mL/kg IM</p>
            </div>
          </div>

          {/* Step 1 - ILAE 2023 */}
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Step 1: First-Line - PHENOBARBITAL (ILAE 2023)</p>
            <div className="text-[8px] text-blue-600 mt-1">
              <p><strong>Loading:</strong> 20 mg/kg IV over 15-20 min</p>
              {w > 0 && <p className="font-mono text-green-600">= {(w * 20).toFixed(0)} mg</p>}
              <p className="mt-1">If seizures persist after 30 min:</p>
              <p>• Additional 10 mg/kg (can repeat once)</p>
              <p>• <strong>Max total loading: 40 mg/kg</strong></p>
              {w > 0 && <p className="font-mono text-green-600">Max = {(w * 40).toFixed(0)} mg total</p>}
              <p className="text-[7px] mt-1 text-gray-600">80% initial efficacy with dose escalation (ILAE data)</p>
            </div>
          </div>

          {/* Step 2 - ILAE 2023 */}
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-purple-700">Step 2: Second-Line Options (ILAE 2023)</p>
            <div className="text-[8px] text-purple-600 mt-1 space-y-1">
              <div className="p-1 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Levetiracetam (preferred if cardiac concerns):</p>
                <p>40-60 mg/kg IV loading</p>
                {w > 0 && <p className="font-mono text-green-600">= {(w * 40).toFixed(0)} - {(w * 60).toFixed(0)} mg</p>}
              </div>
              <div className="p-1 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Fosphenytoin/Phenytoin:</p>
                <p>20 mg PE/kg IV over 20-30 min</p>
                {w > 0 && <p className="font-mono text-green-600">= {(w * 20).toFixed(0)} mg PE</p>}
                <p className="text-[7px] text-gray-600">Monitor ECG; avoid if cardiac abnormality</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-teal-700">Step 3: Third-Line / Refractory</p>
            <div className="text-[8px] text-teal-600 mt-1 space-y-1">
              <div className="p-1 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Midazolam infusion:</p>
                <p>0.1-0.15 mg/kg bolus → 0.1-0.4 mg/kg/hr infusion</p>
                {w > 0 && <p className="font-mono text-green-600">Bolus = {(w * 0.15).toFixed(2)} mg</p>}
              </div>
              <div className="p-1 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Lidocaine (caution):</p>
                <p>2 mg/kg load → 6 mg/kg/hr × 6h → taper over 12h</p>
                <p className="text-[7px] text-red-500">Avoid if fosphenytoin given (both Na+ channel blockers)</p>
              </div>
            </div>
          </div>

          {/* Metabolic trial */}
          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-orange-700">Consider Early if Etiology Unknown</p>
            <div className="text-[8px] text-orange-600 mt-1">
              <p className="font-bold">Pyridoxine trial (ILAE 2023):</p>
              <p>• Pyridoxine 100 mg IV (give during EEG)</p>
              <p>• Or PLP 30 mg/kg/day PO divided TID</p>
              <p>• Folinic acid 3-5 mg/kg/day PO divided BID</p>
              <p className="text-[7px] mt-1">Consider EARLY - even before second-line failure if metabolic suspected</p>
            </div>
          </div>
        </div>

        {/* Maintenance Therapy */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Maintenance Therapy</p>
          <div className="text-[8px] space-y-1">
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Phenobarbital:</p>
              <p>4 mg/kg/day divided q12-24h (start 24h after load)</p>
              {w > 0 && <p className="text-green-400 font-mono">= {(w * 4).toFixed(0)} mg/day</p>}
              <p className="text-gray-400">Target level: 15-40 mcg/mL</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Levetiracetam:</p>
              <p>20-30 mg/kg/day divided q8-12h</p>
              {w > 0 && <p className="text-green-400 font-mono">= {(w * 20).toFixed(0)} - {(w * 30).toFixed(0)} mg/day</p>}
              <p className="text-gray-400">No therapeutic level monitoring needed</p>
            </div>
          </div>
        </div>

        {/* Duration - ILAE 2023 */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Duration of AED Therapy (ILAE 2023)</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Acute symptomatic seizures (HIE, metabolic, stroke):</strong></p>
            <p>• <strong>Discontinue before discharge</strong> if seizure-free (ILAE recommendation)</p>
            <p>• Do NOT wait for normal EEG/MRI to stop</p>
            <p>• High consensus agreement in ILAE 2023</p>
            
            <p className="font-bold mt-2">Continue ASMs longer if:</p>
            <p>• Neonatal-onset epilepsy syndrome diagnosed</p>
            <p>• Ongoing clinical/electrographic seizures</p>
            <p>• Genetic epilepsy confirmed</p>
          </div>
        </div>

        {/* Therapeutic Hypothermia */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">HIE with Seizures</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Therapeutic hypothermia</strong> may reduce seizure burden (ILAE 2023, weak evidence)</p>
            <p>• 33.5°C × 72 hours for moderate-severe HIE</p>
            <p>• Continue ASM treatment per above algorithm</p>
            <p>• cEEG monitoring throughout cooling</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Depends primarily on underlying etiology</p>
            <p>• Corrected metabolic: Generally excellent</p>
            <p>• HIE: Variable based on severity of injury</p>
            <p>• Stroke/hemorrhage: Depends on extent/location</p>
            <p>• Risk of later epilepsy: 10-30%</p>
            <p>• Genetic syndromes: Variable, some developmental epileptic encephalopathies</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SeizuresApproach;
