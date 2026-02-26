import React from "react";
import { Card, CardContent } from "../../../components/ui/card";

const EpilepsyApproach = ({ weight: w = 0, age = 0 }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-2 space-y-3">
        {/* Title */}
        <div className="text-center mb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Pediatric Epilepsy Guidelines</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Including Status Epilepticus (SMC)</p>
        </div>

        {/* Definitions Section */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">DEFINITIONS</p>
          <div className="space-y-2 text-[9px] text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-bold text-gray-700 dark:text-gray-300">Seizures:</p>
              <p>The clinical expression of abnormal, excessive or synchronous discharges of neurons primarily in the cerebral cortex; intermittent and self-limiting. On EEG, characterized by sustained abnormal electrical activity.</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 dark:text-gray-300">Epilepsy:</p>
              <p>A state of enduring pre-disposition to recurrent epileptic seizures, requiring either:</p>
              <ul className="list-disc list-inside ml-2">
                <li>2 or more unprovoked seizures occurring more than 24 hours apart</li>
                <li>One unprovoked event in an epilepsy syndrome with a high risk of recurrence (e.g., absence epilepsy, infantile spasms syndrome)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seizure Classification */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">SEIZURE CLASSIFICATION</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="text-[9px] font-bold text-gray-700 dark:text-gray-300">Generalized Onset Seizure</p>
              <ul className="text-[8px] text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Originated from both hemispheres</li>
                <li>Bilateral motor involvement</li>
                <li>Always with loss of consciousness</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="text-[9px] font-bold text-gray-700 dark:text-gray-300">Focal Seizure</p>
              <ul className="text-[8px] text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Originate from 1 hemisphere</li>
                <li>Preserved or impaired consciousness</li>
                <li>With/without observable manifestations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEIZURES ALGORITHM */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-center text-gray-800 dark:text-gray-200 mb-2">SEIZURES ALGORITHM</p>
          
          <div className="space-y-2">
            {/* Step 1 */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-center">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">ABNORMAL MOVEMENTS</p>
              <p className="text-[8px] text-gray-600 dark:text-gray-400">Is it a seizure?</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-3 bg-gray-400"></div>
            </div>
            
            {/* Step 2 - ABC */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-center">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">STABILIZE (ABC)</p>
              <p className="text-[8px] text-gray-600 dark:text-gray-400">Recovery position, oxygen, suction if needed</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-3 bg-gray-400"></div>
            </div>
            
            {/* Step 3 - Observe */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200 text-center">OBSERVE & DOCUMENT</p>
              <ul className="text-[8px] text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Duration, type of movements</li>
                <li>Eye deviation, level of consciousness</li>
                <li>Unilateral vs bilateral involvement</li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-3 bg-gray-400"></div>
            </div>
            
            {/* Step 4 - Labs */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200 text-center">INVESTIGATIONS</p>
              <div className="grid grid-cols-2 gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-medium">Blood:</p>
                  <ul className="list-disc list-inside">
                    <li>Glucose (STAT)</li>
                    <li>Electrolytes (Na, K, Ca, Mg)</li>
                    <li>CBC, CRP</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">If indicated:</p>
                  <ul className="list-disc list-inside">
                    <li>Drug levels</li>
                    <li>Ammonia</li>
                    <li>Blood gas</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="flex items-end">
                <div className="w-12 h-0.5 bg-gray-400"></div>
                <div className="w-0.5 h-3 bg-gray-400"></div>
                <div className="w-12 h-0.5 bg-gray-400"></div>
              </div>
            </div>
            
            {/* Branches */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-gray-300 dark:bg-gray-600 rounded text-center">
                <p className="text-[8px] font-bold text-gray-800 dark:text-gray-200">GENERALIZED</p>
                <p className="text-[7px] text-gray-600 dark:text-gray-400">Bilateral, LOC</p>
              </div>
              <div className="p-2 bg-gray-300 dark:bg-gray-600 rounded text-center">
                <p className="text-[8px] font-bold text-gray-800 dark:text-gray-200">FOCAL</p>
                <p className="text-[7px] text-gray-600 dark:text-gray-400">Unilateral, +/- LOC</p>
                <p className="text-[7px] text-red-600 dark:text-red-400 font-bold">Do Brain Imaging</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS EPILEPTICUS ALGORITHM */}
        <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-300 dark:border-red-800">
          <p className="text-xs font-bold text-center text-red-800 dark:text-red-200 mb-1">STATUS EPILEPTICUS ALGORITHM</p>
          <p className="text-[8px] text-center text-red-600 dark:text-red-400 mb-2">(Does NOT apply to myoclonic seizures or spasms)</p>
          
          <div className="space-y-2">
            {/* T = 0 */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-gray-800 dark:text-gray-200">T = 0 min (Seizure starts)</span>
              </div>
              <p className="text-[8px] text-gray-600 dark:text-gray-400">ABC, O2, IV access, check glucose</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-2 bg-gray-400"></div>
            </div>
            
            {/* T = 5 min */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-gray-800 dark:text-gray-200">T = 5 min</span>
                <span className="text-[8px] bg-gray-300 dark:bg-gray-600 px-1 rounded">1st Line</span>
              </div>
              <div className="text-[8px] text-gray-700 dark:text-gray-300">
                <p className="font-bold">Diazepam IV 0.3 mg/kg (max 10mg)</p>
                {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">= {Math.min(w * 0.3, 10).toFixed(1)} mg</p>}
                <p className="mt-1">OR Diazepam PR 0.5 mg/kg (max 20mg)</p>
                {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">= {Math.min(w * 0.5, 20).toFixed(1)} mg</p>}
                <p className="text-[7px] italic mt-1">Can repeat once after 5 min if still seizing</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-2 bg-gray-400"></div>
            </div>
            
            {/* T = 15 min */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-gray-800 dark:text-gray-200">T = 15 min</span>
                <span className="text-[8px] bg-gray-300 dark:bg-gray-600 px-1 rounded">2nd Line</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[8px]">
                <div className="p-1 bg-white dark:bg-gray-800 rounded">
                  <p className="font-bold text-gray-700 dark:text-gray-300">Levetiracetam IV</p>
                  <p className="text-gray-600 dark:text-gray-400">40-60 mg/kg (max 4500mg)</p>
                  <p className="text-gray-600 dark:text-gray-400">over 15 min</p>
                  {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">{Math.min(w * 40, 4500).toFixed(0)}-{Math.min(w * 60, 4500).toFixed(0)} mg</p>}
                </div>
                <div className="p-1 bg-white dark:bg-gray-800 rounded">
                  <p className="font-bold text-gray-700 dark:text-gray-300">OR Phenytoin IV</p>
                  <p className="text-gray-600 dark:text-gray-400">20 mg/kg (max 1500mg)</p>
                  <p className="text-gray-600 dark:text-gray-400">over 20 min</p>
                  {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">{Math.min(w * 20, 1500).toFixed(0)} mg</p>}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-2 bg-gray-400"></div>
            </div>
            
            {/* T = 30 min */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-gray-800 dark:text-gray-200">T = 30 min</span>
                <span className="text-[8px] bg-gray-300 dark:bg-gray-600 px-1 rounded">3rd Line</span>
              </div>
              <div className="text-[8px] text-gray-700 dark:text-gray-300">
                <p className="font-bold">Phenobarbitone IV 20 mg/kg (max 1000mg)</p>
                <p className="text-gray-600 dark:text-gray-400">over 20 min</p>
                {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">= {Math.min(w * 20, 1000).toFixed(0)} mg</p>}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-2 bg-gray-400"></div>
            </div>
            
            {/* Refractory */}
            <div className="p-2 bg-gray-800 dark:bg-gray-900 text-white rounded">
              <p className="text-[9px] font-bold text-center">REFRACTORY STATUS EPILEPTICUS</p>
              <p className="text-[8px] text-center text-gray-300 mb-1">If still seizing after 3rd line</p>
              <div className="bg-gray-700 dark:bg-gray-800 p-1 rounded text-[8px]">
                <p className="font-bold">RSI + General Anesthesia + ICU</p>
                <ul className="list-disc list-inside text-[7px] text-gray-300">
                  <li>Midazolam infusion: 0.1-0.4 mg/kg/hr</li>
                  <li>Propofol: 1-3 mg/kg bolus, then 2-10 mg/kg/hr</li>
                  <li>Thiopental: 3-5 mg/kg bolus</li>
                  <li>Ketamine: 1-2 mg/kg bolus</li>
                </ul>
              </div>
            </div>
            
            {/* Important Notes */}
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-300 dark:border-amber-800">
              <p className="text-[8px] font-bold text-amber-800 dark:text-amber-200">IMPORTANT:</p>
              <ul className="text-[7px] text-amber-700 dark:text-amber-300 list-disc list-inside">
                <li>CT scan for seizures &gt;30 min duration</li>
                <li>Consult Neurologist before intubation</li>
                <li>LP if febrile status &gt;30 min</li>
                <li>ICU involvement early</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FREQUENT SEIZURES ALGORITHM */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-center text-gray-800 dark:text-gray-200 mb-1">FREQUENT SEIZURES ALGORITHM</p>
          <p className="text-[8px] text-center text-gray-600 dark:text-gray-400 mb-2">(GTC, focal - each &lt;5 min, consciousness regained between)</p>
          
          <div className="space-y-2">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[8px] font-bold text-gray-700 dark:text-gray-300">Step 1: Load with one of:</p>
              <div className="grid grid-cols-2 gap-1 text-[7px] mt-1">
                <div className="p-1 bg-white dark:bg-gray-800 rounded">
                  <p className="font-bold">Levetiracetam IV</p>
                  <p>40-60 mg/kg</p>
                  {w > 0 && <p className="text-green-600 dark:text-green-400 font-mono">{Math.min(w*40, 4500).toFixed(0)}-{Math.min(w*60, 4500).toFixed(0)} mg</p>}
                </div>
                <div className="p-1 bg-white dark:bg-gray-800 rounded">
                  <p className="font-bold">Phenytoin IV</p>
                  <p>20 mg/kg</p>
                  {w > 0 && <p className="text-green-600 dark:text-green-400 font-mono">{Math.min(w*20, 1500).toFixed(0)} mg</p>}
                </div>
              </div>
            </div>
            
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[8px] font-bold text-gray-700 dark:text-gray-300">Step 2: If seizures recur:</p>
              <div className="text-[7px] mt-1">
                <p className="font-bold">Phenobarbitone IV 20 mg/kg</p>
                {w > 0 && <p className="text-green-600 dark:text-green-400 font-mono">= {Math.min(w*20, 1000).toFixed(0)} mg</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Special Cases */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">SPECIAL CASES</p>
          <div className="space-y-2 text-[8px]">
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-bold text-gray-700 dark:text-gray-300">Neonates & Infants (&lt;3 months):</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-[7px]">
                <li>Benzodiazepines often ineffective</li>
                <li>Phenobarbitone is 1st line treatment</li>
                <li>Loading: 20 mg/kg IV</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-bold text-gray-700 dark:text-gray-300">Infantile Spasms:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-[7px]">
                <li className="text-red-600 dark:text-red-400 font-bold">NEVER start treatment before EEG</li>
                <li>Needs very early EEG</li>
                <li>Associated with developmental regression</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-bold text-gray-700 dark:text-gray-300">Absence Seizures:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-[7px]">
                <li>Don't start meds before EEG</li>
                <li>EEG shows 3Hz spike and wave</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-bold text-gray-700 dark:text-gray-300">Epilepsy patient - missed doses:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-[7px]">
                <li>Reload with their own medication</li>
                <li>Check drug levels</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TABLE 1: Types of Seizures */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 1 - TYPES OF SEIZURES</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Seizure Type</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Description</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Significance</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Generalized Tonic-Clonic (GTC)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">LOC, gurgling, eyes open, bilateral stiffness, bilateral jerking, slowing at end, post-ictal state</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Can result from progression of other seizure types. Check if onset was focal.</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Focal preserved consciousness (Simple partial)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Rhythmic jerks in one side, no LOC, movements slow at end, no post-ictal</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-bold text-red-600 dark:text-red-400">Do brain imaging</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Focal impaired consciousness (Complex partial)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Altered awareness, staring, may have repetitive movements, lasts few minutes, post-ictal state</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-bold text-red-600 dark:text-red-400">Do brain imaging</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Absence seizure</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Very frequent, sudden arrest, unresponsive, may have eye blinking, lasts seconds, no post-ictal</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Typical age: school age. Don't start meds before EEG.</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Myoclonic seizures</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sudden rapid violent movement, no LOC, can be bilateral or unilateral, solitary or clusters</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Myoclonus is fast, spasms last longer (0.5 sec), tonic longer still</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Tonic seizures</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sudden increase of tone, 2-30 seconds, can be clusters or sporadic</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Only in patients with severe abnormal brain</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Atonic seizures</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sudden loss of tone, brief (~1 sec), can be clusters or sporadic</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Only in patients with severe abnormal brain</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Infantile spasms</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sudden stiffening of limbs, upper &gt; lower, &lt;0.5 sec, clusters at waking/sleep</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-bold text-red-600 dark:text-red-400">Never start treatment before EEG. Associated with developmental regression.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 2: Seizure Mimickers */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 2 - SEIZURE MIMICKERS</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Mimicker</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Description</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Differentiation</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Service</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Benign neonatal myoclonus</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Same as myoclonic seizures</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Normal child, only while asleep, different limb each time</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Reassurance</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Chorea</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Non-rhythmic, chaotic movements, all limbs</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Triggered by voluntary movement, gradual, never at sleep, no LOC</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Neurology</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Dystonia</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Increase in tone, no LOC, lasts &gt;2 min</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Usually in patients with baseline dystonia, triggered by irritation</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">General pediatrics</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Jitteriness</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Rapid, high frequency low intensity movements</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Systemic cause (hypoglycemia), stops with holding limb, no LOC</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">General pediatrics</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Breath holding spells</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Loss of sound, cyanosis, stiffening, may have myoclonus</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Triggered by obnoxious event, normal once breathing resumes</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Reassurance</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Parasomnias</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Non-rhythmic movements while asleep, variable duration</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sporadic, non-stereotypical, long duration, positive family history</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Reassurance</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Apnea</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Short breathing pauses with desaturation/bradycardia</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Usually neonates, associated with bradycardia</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">General pediatrics</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Syncope</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Gradual loss of tone, brief, rapid recovery, pallor, may have myoclonus</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Identified triggers, dizziness/visual disturbances prior</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Cardiology</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Day dreaming</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Staring, no movements, sporadic</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Aborted by attention, seen when tired/bored</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Reassurance</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Psychogenic</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Doesn't fit typical seizure, not rhythmic, changes character</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Eyes closed = not seizure, waxing/waning, pelvic thrusting, side-to-side head</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Psychiatry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 3: Secondary Causes of Seizures */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 3 - SECONDARY CAUSES OF SEIZURES</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[550px] border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Cause</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">History</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Examination</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Investigations</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Service</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Meningitis/Encephalitis</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Fever, impaired LOC</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Meningeal signs, hypoactivity</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">High WBC/CRP, LP abnormal</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Peds/ID</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Intracranial bleed</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Trauma, headache, impaired LOC</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">+/- Signs of trauma</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">CT shows bleed</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Neurosurgery</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Metabolic</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Metabolic disease hx, impaired LOC</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">High ammonia, acidosis, edema</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Metabolic</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Hypoglycemia</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">DM, missed meals, impaired LOC</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Low blood glucose</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Peds/Endo</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Electrolyte imbalance</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Nephro/endo patient, syndromic</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Low/high Na, low Ca</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Peds/Endo/Nephro</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Hypoxia</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Drowning, choking</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Impaired LOC</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Resp acidosis, CT changes</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Peds</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Drug related (missed dose)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Epilepsy patient, missed doses</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Low drug level</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Neurology</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Brain tumors</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Morning headache/vomiting, focal complaints</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Papilledema, focal deficit</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">CT shows SOL</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Neurosurgery/Onco</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 4: Anti-Seizure Medications */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 4 - ANTI-SEIZURE MEDICATIONS (SMC)</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[550px] border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Medication</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-center font-semibold">Initial Dose</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-center font-semibold">Max Dose</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-center font-semibold">Available Forms</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Side Effects</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Levetiracetam</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">10 mg/kg/day{w > 0 && <><br/><span className="text-green-600 dark:text-green-400 font-mono">{(w*10).toFixed(0)} mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">60 mg/kg/day<br/>(max 3000mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Syrup 100mg/ml<br/>Tab 500mg, 1000mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Behavioural issues</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Sodium Valproate</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">10 mg/kg/day{w > 0 && <><br/><span className="text-green-600 dark:text-green-400 font-mono">{(w*10).toFixed(0)} mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">60 mg/kg/day<br/>(max 2500mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Syrup 57.64mg/ml<br/>Tab 200mg, 500mg<br/>Inj 100mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sedation, hepatitis, agranulocytosis, GI upset, weight gain</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Phenobarbital</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">5 mg/kg/day{w > 0 && <><br/><span className="text-green-600 dark:text-green-400 font-mono">{(w*5).toFixed(0)} mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">5 mg/kg/day<br/>(max 180mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Syrup 3mg/ml<br/>Tab 30mg<br/>Inj 200mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sedation, hepatitis, behavioural issues</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Carbamazepine</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">5 mg/kg/day{w > 0 && <><br/><span className="text-green-600 dark:text-green-400 font-mono">{(w*5).toFixed(0)} mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">20 mg/kg/day<br/>(max 1200mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Syrup 20mg/ml<br/>Tab 200mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sedation, GI upset, allergic reaction, dryness</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Phenytoin</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">5 mg/kg/day{w > 0 && <><br/><span className="text-green-600 dark:text-green-400 font-mono">{(w*5).toFixed(0)} mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">8 mg/kg/day<br/>(max 300mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Syrup 6mg/ml<br/>Tab 100mg<br/>Inj 50mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">GI upset, gingival hyperplasia, hirsutism, ataxia</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Topiramate</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">1 mg/kg/day{w > 0 && <><br/><span className="text-green-600 dark:text-green-400 font-mono">{(w*1).toFixed(0)} mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">10 mg/kg/day<br/>(max 400mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Tab 25mg, 50mg, 100mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sedation, kidney stones, weight loss, acidosis</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Clobazam</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">0.25 mg/kg/day{w > 0 && <><br/><span className="text-green-600 dark:text-green-400 font-mono">{(w*0.25).toFixed(1)} mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">1 mg/kg/day<br/>(max 40mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Tab 10mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sedation, behavioural issues</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Clonazepam</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">0.025 mg/kg/day{w > 0 && <><br/><span className="text-green-600 dark:text-green-400 font-mono">{(w*0.025).toFixed(2)} mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">0.2 mg/kg/day<br/>(max 20mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Tab 0.5mg, 2mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sedation, behavioural issues, hypersalivation</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Lamotrigine</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">0.15 mg/kg/day<br/>(with VPA)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">5 mg/kg/day<br/>(max 200mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Tab 25mg, 50mg, 100mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Allergic reaction (SJS), sedation, diplopia</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Vigabatrin</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">50 mg/kg/day{w > 0 && <><br/><span className="text-green-600 dark:text-green-400 font-mono">{(w*50).toFixed(0)} mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">150 mg/kg/day<br/>(max 3000mg)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-center">Tab 500mg<br/>Sachet 500mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 text-red-600 dark:text-red-400 font-bold">Visual field defect (irreversible)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Febrile Seizures */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">FEBRILE SEIZURES</p>
          <div className="space-y-2">
            <div>
              <p className="text-[9px] font-bold text-gray-700 dark:text-gray-300">Criteria for TYPICAL febrile seizure:</p>
              <ol className="text-[8px] text-gray-600 dark:text-gray-400 list-decimal list-inside">
                <li>Neurologically normal individual</li>
                <li>Full recovery post-seizure</li>
                <li>Clear history of infection</li>
                <li>Age: 6 months - 6 years</li>
              </ol>
              <p className="text-[7px] text-gray-500 mt-1 italic">Points 5-7 (GTC, once/24h, &lt;15 min) are not mandatory</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
              <p className="text-[8px] font-bold text-red-700 dark:text-red-300">RED FLAG:</p>
              <p className="text-[7px] text-red-600 dark:text-red-400">Seizures with fever NOT meeting criteria 1-4, especially with impaired consciousness, suggest ENCEPHALITIS</p>
            </div>
            <p className="text-[8px] text-gray-600 dark:text-gray-400">Typical febrile seizures do NOT require admission from neurological standpoint</p>
          </div>
        </div>

        {/* EEG Section */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">EEG - WHEN TO REQUEST</p>
          <div className="space-y-2 text-[8px]">
            <p className="text-gray-700 dark:text-gray-300 font-bold">Only to be requested by Neurologist</p>
            <div>
              <p className="font-bold text-gray-700 dark:text-gray-300">Reasons for requesting:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-[7px]">
                <li>Unclear nature of event (epileptic vs non-epileptic)</li>
                <li>Localization in focal epilepsy</li>
                <li>Documentation of syndromes (absence, infantile spasms)</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-700 dark:text-gray-300">Include in EEG request:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-[7px]">
                <li>Age, handedness, date/time of event</li>
                <li>Event description, consciousness level, frequency</li>
                <li>Family history, recent imaging, current medications</li>
                <li>Latest EEG, reason for request</li>
              </ul>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default EpilepsyApproach;
