import React from "react";
import { Card, CardContent } from "../../../components/ui/card";

const EpilepsyApproach = ({ weight: w = 0, age = 0 }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-2 space-y-3">
        {/* Title */}
        <div className="text-center mb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Pediatric Epilepsy Guidelines</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">SMC Guidelines</p>
        </div>

        {/* DEFINITION OF SEIZURES */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-bold text-blue-800 dark:text-blue-200 mb-2">DEFINITION OF SEIZURES</p>
          <p className="text-[9px] text-gray-700 dark:text-gray-300">
            The clinical expression of abnormal, excessive or synchronous discharges of neurons primarily residing in the cerebral cortex. It is intermittent and self-limiting. On EEG, it is characterized by a sustained abnormal electrical activity.
          </p>
        </div>

        {/* DEFINITION OF EPILEPSY */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-xs font-bold text-purple-800 dark:text-purple-200 mb-2">DEFINITION OF EPILEPSY</p>
          <p className="text-[9px] text-gray-700 dark:text-gray-300 mb-1">
            A state of enduring pre-disposition to recurrent epileptic seizures. Requiring either of the following:
          </p>
          <ol className="text-[9px] text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>2, or more, unprovoked seizures occurring more than 24 hours apart</li>
            <li>One unprovoked event in an epilepsy syndrome with a high risk of recurrence (e.g. absence epilepsy, Epileptic infantile spasms syndrome)</li>
          </ol>
        </div>

        {/* SEIZURES ALGORITHM */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <p className="text-xs font-bold text-center text-teal-800 dark:text-teal-200 mb-2">SEIZURES ALGORITHM</p>
          
          <div className="space-y-2">
            {/* Start */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-center">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">ABNORMAL MOVEMENT</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-3 bg-gray-400"></div>
            </div>
            
            {/* Is it a seizure? */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-center">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">Is it a seizure?</p>
              <p className="text-[8px] text-gray-600 dark:text-gray-400">(Refer to Box 1)</p>
            </div>
            
            <div className="flex justify-center">
              <div className="flex items-end">
                <div className="w-12 h-0.5 bg-gray-400"></div>
                <div className="w-0.5 h-3 bg-gray-400"></div>
                <div className="w-12 h-0.5 bg-gray-400"></div>
              </div>
            </div>
            
            {/* Yes/No branches */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-[8px] font-bold text-gray-600 dark:text-gray-400 mb-1">NO</p>
                <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded text-[7px]">
                  Check seizure mimickers<br/>(Table 2)
                </div>
              </div>
              <div className="text-center">
                <p className="text-[8px] font-bold text-gray-600 dark:text-gray-400 mb-1">YES</p>
                <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded text-[8px] font-bold">
                  Stabilize (ABC)<br/>
                  <span className="font-normal text-[7px]">(Refer to Box 2)</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-3 bg-gray-400"></div>
            </div>
            
            {/* Call for help */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-center">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">Call for help</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-3 bg-gray-400"></div>
            </div>
            
            {/* Still seizing > 5 min? */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-center">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">Still seizing &gt;5 min?</p>
            </div>
            
            <div className="flex justify-center">
              <div className="flex items-end">
                <div className="w-12 h-0.5 bg-gray-400"></div>
                <div className="w-0.5 h-3 bg-gray-400"></div>
                <div className="w-12 h-0.5 bg-gray-400"></div>
              </div>
            </div>
            
            {/* Yes/No branches for seizing */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-center text-gray-600 dark:text-gray-400">NO (Seizure stopped)</p>
                <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded text-[7px]">
                  <p className="font-bold">1. Observe for 2 hours</p>
                  <p className="font-bold">2. Blood collection</p>
                </div>
                <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded text-[7px]">
                  <p className="font-bold">If Generalized:</p>
                  <p>Check LOC - if back to normal → Discharge with follow up</p>
                  <p>If encephalopathic → Follow LOC guidelines</p>
                </div>
                <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded text-[7px]">
                  <p className="font-bold text-red-600 dark:text-red-400">If Focal seizure or focal deficit:</p>
                  <p>Skull US or CT Brain</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-center text-gray-600 dark:text-gray-400">YES</p>
                <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded text-[7px] font-bold text-red-700 dark:text-red-300">
                  Follow Status Epilepticus Algorithm
                </div>
                <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded text-[7px]">
                  <p>1. Quick history/examination</p>
                  <p>2. Blood collection (Box 2)</p>
                  <p>3. Skull US or CT Brain</p>
                  <p>4. Correct reversible causes (Table 3)</p>
                  <p>5. If no reversible cause → Call Neurologist</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Box 1 */}
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
            <p className="text-[9px] font-bold text-blue-800 dark:text-blue-200">Box 1: Criteria of common seizures</p>
            <ol className="text-[8px] text-blue-700 dark:text-blue-300 list-decimal list-inside">
              <li>Rhythmic movement</li>
              <li>No clear observable preceding symptoms</li>
              <li>Should follow the rules of generalized/focal seizures in regard to level of consciousness:
                <ul className="list-disc list-inside ml-2 text-[7px]">
                  <li>Bilateral seizure → patient unconscious</li>
                  <li>Unilateral seizure → patient conscious or unconscious</li>
                </ul>
              </li>
            </ol>
          </div>
          
          {/* Box 2 */}
          <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
            <p className="text-[9px] font-bold text-green-800 dark:text-green-200">Box 2: ABC & Blood Collection</p>
            <div className="text-[8px] text-green-700 dark:text-green-300">
              <p><strong>A:</strong> Airways already protected</p>
              <p><strong>B:</strong> Oxygen Facemask</p>
              <p><strong>C:</strong> Blood collection (Blood gas, electrolytes, glucose, CBC, medication levels, in &lt;1 year: ammonia)</p>
            </div>
            <p className="text-[8px] font-bold text-green-800 dark:text-green-200 mt-1">Signs during seizure:</p>
            <p className="text-[7px] text-green-600 dark:text-green-400">Tachycardia, Hypertension, Desaturation, Metabolic/respiratory acidosis, Hyperthermia</p>
          </div>
        </div>

        {/* STATUS EPILEPTICUS ALGORITHM */}
        <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-300 dark:border-red-800">
          <p className="text-xs font-bold text-center text-red-800 dark:text-red-200 mb-1">STATUS EPILEPTICUS ALGORITHM</p>
          <p className="text-[8px] text-center text-red-600 dark:text-red-400 mb-2">
            Management of GTC, focal non-motor and motor with impaired awareness seizure<br/>
            <span className="font-bold">(Does NOT apply to myoclonic seizures or spasms)</span>
          </p>
          
          <div className="space-y-2">
            {/* At 5 min */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">At 5 minutes of seizure:</p>
              <div className="text-[8px] text-gray-700 dark:text-gray-300">
                <p className="font-bold">Diazepam 0.5 mg/kg rectal OR 0.3 mg/kg IV</p>
                {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">PR: {(w * 0.5).toFixed(1)} mg | IV: {(w * 0.3).toFixed(1)} mg</p>}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-2 bg-gray-400"></div>
            </div>
            
            {/* At 10 min */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">At 10 minutes of seizure:</p>
              <div className="text-[8px] text-gray-700 dark:text-gray-300">
                <p className="font-bold">Repeat Diazepam 0.5 mg/kg rectal OR 0.3 mg/kg IV</p>
                {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">PR: {(w * 0.5).toFixed(1)} mg | IV: {(w * 0.3).toFixed(1)} mg</p>}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-2 bg-gray-400"></div>
            </div>
            
            {/* At 15 min */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">At 15 minutes of seizure:</p>
              <div className="grid grid-cols-2 gap-2 text-[8px]">
                <div className="p-1 bg-white dark:bg-gray-800 rounded">
                  <p className="font-bold text-gray-700 dark:text-gray-300">Levetiracetam 40 mg/kg</p>
                  {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">{(w * 40).toFixed(0)} mg</p>}
                </div>
                <div className="p-1 bg-white dark:bg-gray-800 rounded">
                  <p className="font-bold text-gray-700 dark:text-gray-300">OR Phenytoin 20 mg/kg over 20 min</p>
                  <p className="text-[7px]">Repeat in 5 min with 10 mg/kg (total 30 mg/kg)</p>
                  {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">{(w * 20).toFixed(0)} mg, then {(w * 10).toFixed(0)} mg</p>}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-2 bg-gray-400"></div>
            </div>
            
            {/* If still seizing 5 min after */}
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200">If still seizing 5 minutes after previous step:</p>
              <div className="text-[8px] text-gray-700 dark:text-gray-300">
                <p className="font-bold">Phenobarbitone 20 mg/kg</p>
                <p className="text-[7px]">In 5 min, repeat with 10 mg/kg</p>
                <p className="text-[7px]">In 5 min, repeat with 10 mg/kg (total 40 mg/kg)</p>
                {w > 0 && <p className="text-green-700 dark:text-green-400 font-mono">{(w * 20).toFixed(0)} mg → {(w * 10).toFixed(0)} mg → {(w * 10).toFixed(0)} mg</p>}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-2 bg-gray-400"></div>
            </div>
            
            {/* Still seizing - RSI */}
            <div className="p-2 bg-gray-800 dark:bg-gray-900 text-white rounded">
              <p className="text-[9px] font-bold text-center">STILL SEIZING → RSI + General Anesthesia</p>
              <ol className="text-[7px] text-gray-300 list-decimal list-inside mt-1">
                <li>Midazolam 0.2 mg/kg IV, then infusion 0.05-2 mg/kg/hr</li>
                <li>Propofol 2-5 mg/kg IV, then infusion 2-10 mg/kg/hr</li>
                <li>Thiopental 3-5 mg/kg IV, then infusion 1-5 mg/kg/hr</li>
                <li>Ketamine 0.5-3 mg/kg IV, then 0.3-4 mg/kg/hr</li>
              </ol>
            </div>
            
            {/* Important Notes */}
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-300 dark:border-amber-800">
              <p className="text-[8px] font-bold text-amber-800 dark:text-amber-200">IMPORTANT:</p>
              <ul className="text-[7px] text-amber-700 dark:text-amber-300 list-disc list-inside">
                <li>Always do CT for seizure more than 30 minutes</li>
                <li>Call neurologist before intubation</li>
                <li>Involve ICU after intubation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FREQUENT SEIZURES ALGORITHM */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-center text-gray-800 dark:text-gray-200 mb-1">FREQUENT SEIZURES ALGORITHM</p>
          <p className="text-[8px] text-center text-gray-600 dark:text-gray-400 mb-2">
            Applies only to GTC, focal non-motor and motor with impaired awareness seizures<br/>
            (each seizure &lt;5 min with consciousness regained between seizures)<br/>
            <span className="font-bold">Does NOT apply to myoclonic seizures or spasms</span>
          </p>
          
          {/* When to use */}
          <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800 mb-2">
            <p className="text-[8px] font-bold text-blue-800 dark:text-blue-200">Use this algorithm when:</p>
            <ul className="text-[7px] text-blue-700 dark:text-blue-300 list-disc list-inside">
              <li>More than 2 seizures in 12 hours, each &gt;5 min, last seizure &lt;3 hours ago</li>
              <li>More than 4 seizures in 6 hours, each &lt;5 min, last seizure &lt;1 hour ago</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[8px] font-bold text-gray-700 dark:text-gray-300">Step 1: Load with one of:</p>
              <div className="grid grid-cols-2 gap-1 text-[7px] mt-1">
                <div className="p-1 bg-white dark:bg-gray-800 rounded">
                  <p className="font-bold">Levetiracetam 40 mg/kg</p>
                  {w > 0 && <p className="text-green-600 dark:text-green-400 font-mono">{(w*40).toFixed(0)} mg</p>}
                </div>
                <div className="p-1 bg-white dark:bg-gray-800 rounded">
                  <p className="font-bold">Phenytoin 20 mg/kg over 20 min</p>
                  {w > 0 && <p className="text-green-600 dark:text-green-400 font-mono">{(w*20).toFixed(0)} mg</p>}
                </div>
              </div>
            </div>
            
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              <p className="text-[8px] font-bold text-gray-700 dark:text-gray-300">If had another seizure during 2 hours observation:</p>
              <div className="text-[7px] mt-1">
                <p>• Phenobarbitone 20 mg/kg {w > 0 && <span className="text-green-600 dark:text-green-400 font-mono">({(w*20).toFixed(0)} mg)</span>}</p>
                <p>• If another seizure: repeat 10 mg/kg {w > 0 && <span className="text-green-600 dark:text-green-400 font-mono">({(w*10).toFixed(0)} mg)</span>}</p>
                <p>• If another seizure: repeat 10 mg/kg (total 40 mg/kg)</p>
              </div>
            </div>
            
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
              <p className="text-[8px] font-bold text-green-800 dark:text-green-200">If no more seizures:</p>
              <p className="text-[7px] text-green-700 dark:text-green-300">Observe for 2 hours, if back to baseline with no focal neurological deficit → Discharge</p>
            </div>
          </div>
        </div>

        {/* SPECIAL CASES */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">SPECIAL CASES ALTERING ALGORITHM</p>
          <div className="space-y-2 text-[8px]">
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-bold text-gray-700 dark:text-gray-300">Known epilepsy patient - missed medications:</p>
              <p className="text-[7px] text-gray-600 dark:text-gray-400">Give their missing medication as first step (even before benzodiazepine if possible). Only phenytoin, phenobarbitone, levetiracetam and valproate are available in IV form.</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-bold text-gray-700 dark:text-gray-300">Neonates & Infants (&lt;3 months):</p>
              <p className="text-[7px] text-gray-600 dark:text-gray-400">Phenobarbitone is Step 1, Levetiracetam/Phenytoin is Step 2. <span className="text-red-600 dark:text-red-400 font-bold">Benzodiazepines are ineffective at this age.</span></p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-bold text-gray-700 dark:text-gray-300">Infantile spasms and Absence seizures:</p>
              <p className="text-[7px] text-red-600 dark:text-red-400 font-bold">NOT to be given any medications before EEG. These don't usually evolve into GTC seizures.</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-bold text-gray-700 dark:text-gray-300">Febrile status epilepticus &gt;30 min:</p>
              <p className="text-[7px] text-gray-600 dark:text-gray-400">Always do LP</p>
            </div>
          </div>
        </div>

        {/* FEBRILE SEIZURES */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">FEBRILE SEIZURES</p>
          <div className="space-y-2">
            <div>
              <p className="text-[9px] font-bold text-gray-700 dark:text-gray-300">Criteria for TYPICAL febrile seizure:</p>
              <ol className="text-[8px] text-gray-600 dark:text-gray-400 list-decimal list-inside">
                <li>Occurs in a baseline neurologically normal person</li>
                <li>Patient is fully back to normal neurological state after the seizure</li>
                <li>Clear history of infection (even if no fever spike documented)</li>
                <li>Age: 6 months - 6 years</li>
                <li className="text-gray-400">In the form of GTC seizure (Not always)</li>
                <li className="text-gray-400">Once in every 24 hours (Not always)</li>
                <li className="text-gray-400">Shorter than 15 minutes (Not always)</li>
              </ol>
              <p className="text-[7px] text-gray-500 mt-1 italic">Note: Points 1-4 are MUST, points 5-7 are not mandatory</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
              <p className="text-[8px] font-bold text-red-700 dark:text-red-300">RED FLAG:</p>
              <p className="text-[7px] text-red-600 dark:text-red-400">Any seizure with fever NOT meeting criteria 1-4, especially if impaired level of consciousness → think ENCEPHALITIS. Admit under general or ID and do LP.</p>
            </div>
            <p className="text-[8px] text-gray-600 dark:text-gray-400">Febrile seizures don't need admission from neurological point of view. If admitted for other reasons, admit under general pediatrics.</p>
          </div>
        </div>

        {/* CLASSIFICATION OF SEIZURES */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">CLASSIFICATION OF SEIZURES</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="text-[9px] font-bold text-gray-700 dark:text-gray-300">1. Generalized onset seizure</p>
              <ul className="text-[8px] text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Originated from both hemispheres</li>
                <li>Bilateral motor involvement</li>
                <li>Always with loss of consciousness</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <p className="text-[9px] font-bold text-gray-700 dark:text-gray-300">2. Focal Seizure</p>
              <ul className="text-[8px] text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Originate from 1 hemisphere</li>
                <li>Could have preserved or impaired consciousness</li>
                <li>With or without observable manifestations</li>
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
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Seizure type</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Description</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Significance</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Generalized Tonic-Clonic</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">LOC, gurgling sound, opened eyes, bilateral stiffness, bilateral scissoring, rhythmic jerking that slows at end, post-ictal state</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Can result from progression of other types. Take history for focal onset.</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Focal preserved consciousness (Simple partial)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Rhythmic jerks in one side, no LOC, movements slow at end, no post-ictal</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-bold text-red-600 dark:text-red-400">Do brain imaging</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Focal impaired consciousness (Complex partial)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Altered awareness, staring, repetitive movements (nose swapping, rotatory hand), lasts few minutes, post-ictal state</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-bold text-red-600 dark:text-red-400">Do brain imaging</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Absence seizure</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Very frequent, sudden arrest, unresponsive, may have eye blinking, lasts seconds, no post-ictal</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Typical age: school age. Don't start meds before EEG.</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Myoclonic seizures</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sudden rapid violent movement, no LOC, bilateral or unilateral, solitary or clusters</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Myoclonus is fast, spasms last longer (0.5 sec), tonic longer still</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Tonic seizures</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sudden increase of tone, 2-30 seconds, clusters or sporadic</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Only in patients with severe abnormal brain</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Atonic seizures</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sudden loss of tone, brief (~1 sec), clusters or sporadic</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Only in patients with severe abnormal brain</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Infantile spasms</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sudden stiffening of limbs (upper &gt; lower), &lt;0.5 sec, clusters at waking/sleep</td>
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
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Usually baseline dystonia patient, triggered by irritation</td>
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
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Non-rhythmic movements while asleep</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sporadic, non-stereotypical, long duration, +ve family history</td>
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
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Gradual loss of tone, brief, rapid recovery, pallor</td>
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
                  <td className="border border-gray-200 dark:border-gray-700 p-1 font-medium">Psychogenic (PNES)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Doesn't fit typical seizure, not rhythmic, changes character</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Eyes closed = not seizure, waxing/waning, pelvic thrusting</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Psychiatry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 3: Secondary Causes */}
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
                  <td className="border border-gray-200 dark:border-gray-700 p-1">High ammonia, acidosis</td>
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
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Nephro/endo patient</td>
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
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Morning headache/vomiting</td>
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
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 4 - ANTI-SEIZURE MEDICATIONS</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[550px] border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-left font-semibold">Medication</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-center font-semibold">Initial Dose</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-center font-semibold">Max Dose</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1 text-center font-semibold">Available Forms (SMC)</th>
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
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sedation, hepatitis, GI upset, weight gain</td>
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
                  <td className="border border-gray-200 dark:border-gray-700 p-1">Sedation, GI upset, allergic reaction</td>
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

        {/* EEG Section */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">EEG - WHEN TO REQUEST</p>
          <p className="text-[8px] text-gray-700 dark:text-gray-300 font-bold mb-1">Only to be requested by Neurologist</p>
          <div className="space-y-2 text-[8px]">
            <div>
              <p className="font-bold text-gray-700 dark:text-gray-300">Reasons for requesting EEG:</p>
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
