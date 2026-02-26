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

        {/* SEIZURES ALGORITHM - Redesigned for clarity */}
        <div className="p-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-lg">
          <h3 className="text-sm font-bold text-center text-blue-800 dark:text-blue-200 mb-4 pb-2 border-b-2 border-blue-200 dark:border-blue-700">
            SEIZURES ALGORITHM
          </h3>
          
          {/* Main Layout: Flowchart + Reference Boxes */}
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* LEFT SIDE: Main Flowchart */}
            <div className="flex-1">
              
              {/* STEP 1: Abnormal Movement (Start) */}
              <div className="flex justify-center mb-3">
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-md">
                  <p className="text-sm font-bold text-white tracking-wide">Abnormal movement</p>
                </div>
              </div>
              
              {/* Arrow down */}
              <div className="flex justify-center mb-3">
                <div className="flex flex-col items-center">
                  <div className="w-1 h-6 bg-blue-500"></div>
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-blue-500"></div>
                </div>
              </div>
              
              {/* STEP 2: Is it a seizure? */}
              <div className="flex justify-center mb-3">
                <div className="px-5 py-3 bg-blue-600 rounded-lg shadow-md border-2 border-blue-400">
                  <p className="text-sm font-bold text-white text-center">is it a seizure?</p>
                  <p className="text-xs text-blue-200 text-center italic">refer to box 1</p>
                </div>
              </div>
              
              {/* Branch: No / Yes */}
              <div className="flex justify-center mb-2">
                <div className="flex items-center gap-0">
                  <div className="w-24 h-1 bg-blue-500 rounded-l"></div>
                  <div className="w-1 h-10 bg-blue-500"></div>
                  <div className="w-24 h-1 bg-blue-500 rounded-r"></div>
                </div>
              </div>
              
              {/* Two columns: NO and YES */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                
                {/* NO Branch */}
                <div className="flex flex-col items-center">
                  <div className="px-4 py-2 bg-red-500 rounded-lg shadow mb-2">
                    <p className="text-sm font-bold text-white">No</p>
                  </div>
                  <div className="w-1 h-4 bg-red-400"></div>
                  <div className="px-3 py-2 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-300 dark:border-red-700 mt-2 text-center">
                    <p className="text-xs text-red-700 dark:text-red-300 font-medium">(check seizure mimickers in table 2)</p>
                  </div>
                </div>
                
                {/* YES Branch */}
                <div className="flex flex-col items-center">
                  <div className="px-4 py-2 bg-green-500 rounded-lg shadow mb-2">
                    <p className="text-sm font-bold text-white">Yes</p>
                  </div>
                  <div className="w-1 h-4 bg-green-400"></div>
                  
                  {/* Stabilize patient */}
                  <div className="px-4 py-3 bg-blue-600 rounded-lg shadow-md border-2 border-blue-400 mt-2 text-center">
                    <p className="text-xs font-bold text-white">stabilize the patient (ABC):</p>
                    <p className="text-[10px] text-blue-200 italic">refer to box 2</p>
                  </div>
                  
                  <div className="flex flex-col items-center my-2">
                    <div className="w-1 h-4 bg-blue-500"></div>
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-500"></div>
                  </div>
                  
                  {/* Call for help */}
                  <div className="px-4 py-2 bg-blue-600 rounded-lg shadow-md">
                    <p className="text-xs font-bold text-white">call for help</p>
                  </div>
                  
                  <div className="flex flex-col items-center my-2">
                    <div className="w-1 h-4 bg-blue-500"></div>
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-500"></div>
                  </div>
                  
                  {/* Still seizing > 5 min */}
                  <div className="px-4 py-2 bg-blue-600 rounded-lg shadow-md border-2 border-blue-400">
                    <p className="text-xs font-bold text-white text-center">still seizing &gt; 5 min</p>
                  </div>
                </div>
              </div>
              
              {/* Sub-branch from "still seizing > 5 min" - Mobile Friendly */}
              <div className="mt-4 pt-4 border-t-2 border-blue-200 dark:border-blue-700">
                <div className="text-center mb-3">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 inline-block px-3 py-1 rounded-full">
                    ↓ If still seizing &gt; 5 min ↓
                  </p>
                </div>
                
                {/* NO / YES for still seizing - Stack on mobile, side by side on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* NO - Seizure Stopped */}
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border-2 border-green-400 dark:border-green-600 shadow-md">
                    <div className="text-center mb-3">
                      <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg shadow">No</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">(Seizure stopped)</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-400">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">1- Observe for 2 hours</p>
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">2- Follow up blood collection</p>
                      </div>
                      
                      <p className="text-center text-gray-500 dark:text-gray-400 italic text-xs">if seizure stopped</p>
                      
                      {/* Generalized vs Focal - Stack on mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-3 bg-green-200 dark:bg-green-900/50 rounded-lg text-center">
                          <p className="text-xs font-bold text-green-800 dark:text-green-200">Generalized seizure</p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <p className="text-xs font-bold text-red-700 dark:text-red-300 text-center">Focal seizures or focal deficit on examination</p>
                          <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                            <p className="text-xs text-blue-700 dark:text-blue-300 text-center">→ skull US or CTBR according to age</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Level of consciousness */}
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-2 border-blue-300">
                        <p className="text-sm font-bold text-blue-800 dark:text-blue-200 text-center mb-2">Level of consciousness</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-3 bg-green-200 dark:bg-green-900/50 rounded-lg">
                            <p className="text-xs text-green-800 dark:text-green-200 font-bold">Back to normal or improving</p>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-2">→ Discharge with follow up in the clinic, if no follow up in system</p>
                          </div>
                          <div className="p-3 bg-red-200 dark:bg-red-900/50 rounded-lg">
                            <p className="text-xs text-red-800 dark:text-red-200 font-bold">Encephalopathic or deteriorating</p>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-2">→ Follow LOC guidelines</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* YES - Still Seizing */}
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border-2 border-red-400 dark:border-red-600 shadow-md">
                    <div className="text-center mb-3">
                      <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg shadow">Yes</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">(Still seizing)</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-red-200 dark:bg-red-900/40 rounded-lg border-2 border-red-400 text-center">
                        <p className="text-sm font-bold text-red-800 dark:text-red-200">Follow the Status Epilepticus Algorithm</p>
                      </div>
                      
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-400">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">1- Quick history/ examination</p>
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">2- To follow collection in box 2</p>
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">3- Skull US or CT brain</p>
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">4- Correct reversible causes in table 3</p>
                      </div>
                      
                      {/* Reversible cause decision - Stack on mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-3 bg-green-200 dark:bg-green-900/50 rounded-lg text-center">
                          <p className="text-xs text-green-800 dark:text-green-200 font-bold">If reversible cause found</p>
                          <p className="text-xs text-green-700 dark:text-green-300 mt-1">→ Go to table 3</p>
                        </div>
                        <div className="p-3 bg-amber-200 dark:bg-amber-900/50 rounded-lg text-center">
                          <p className="text-xs text-amber-800 dark:text-amber-200 font-bold">If no reversible causes found</p>
                          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">→ Call the neurologist</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* RIGHT SIDE: Reference Boxes */}
            <div className="lg:w-64 space-y-4">
              
              {/* Box 1: Criteria of common seizures */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-400 dark:border-yellow-600 shadow-md">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mb-2 pb-1 border-b border-yellow-300">
                  Box 1. Criteria of common seizures
                </h4>
                <div className="space-y-2 text-xs text-gray-800 dark:text-gray-200">
                  <p><span className="text-red-600 dark:text-red-400 font-bold">1-</span> Rhythmic movement</p>
                  <p><span className="text-red-600 dark:text-red-400 font-bold">2-</span> No clear observable preceding symptoms</p>
                  <p><span className="text-red-600 dark:text-red-400 font-bold">3-</span> Should follow the rules of generalized / focal seizures in regard to level of consciousness</p>
                  <div className="ml-3 mt-1 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-[11px]">
                    <p>• Bilateral seizure → patient <span className="font-bold">unconscious</span></p>
                    <p>• Unilateral seizure → patient <span className="font-bold">conscious or unconscious</span></p>
                  </div>
                </div>
              </div>
              
              {/* Box 2: ABC & Blood Collection */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-400 dark:border-yellow-600 shadow-md">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mb-2 pb-1 border-b border-yellow-300">
                  Box 2. Stabilization & Blood Collection
                </h4>
                <div className="space-y-2 text-xs">
                  <p>
                    <span className="inline-block w-5 h-5 bg-red-500 text-white font-bold rounded-full text-center leading-5 mr-1">A</span>
                    <span className="text-green-700 dark:text-green-400 font-medium">airways already protected</span>
                  </p>
                  <p>
                    <span className="inline-block w-5 h-5 bg-red-500 text-white font-bold rounded-full text-center leading-5 mr-1">B</span>
                    <span className="text-green-700 dark:text-green-400 font-medium">oxygen Facemask</span>
                  </p>
                  <div>
                    <p className="mb-1">
                      <span className="inline-block w-5 h-5 bg-red-500 text-white font-bold rounded-full text-center leading-5 mr-1">C</span>
                      <span className="text-green-700 dark:text-green-400 font-medium">blood collection</span>
                    </p>
                    <div className="ml-6 p-2 bg-gray-100 dark:bg-gray-800 rounded text-[10px] text-gray-700 dark:text-gray-300">
                      <p>Blood gas, electrolytes, glucose, CBC, medication levels</p>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">In special cases: ammonia in less than 1 year</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Signs during seizure */}
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border-2 border-orange-300 dark:border-orange-700 shadow-md">
                <h4 className="text-xs font-bold text-orange-700 dark:text-orange-300 mb-2 pb-1 border-b border-orange-200">
                  Signs during seizure
                </h4>
                <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Tachycardia</li>
                  <li>• Hypertension</li>
                  <li>• Desaturation</li>
                  <li>• Metabolic and respiratory acidosis</li>
                  <li>• Hyperthermia</li>
                </ul>
              </div>
            </div>
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
        <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-xs font-bold text-center text-orange-800 dark:text-orange-200 mb-1">FREQUENT SEIZURES ALGORITHM</p>
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
            
            {/* Discharge Note */}
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-[8px] font-bold text-blue-800 dark:text-blue-200">📋 Note on Discharge:</p>
              <p className="text-[7px] text-blue-700 dark:text-blue-300">
                If discharged, patient will need adjustments of anti-seizures (if on any) provided there is no secondary causes of seizures. 
                For that, refer to the table of medications (Table 4). <span className="font-bold">Increase medications by ½ tablet, or ½ ml or their multiplications.</span>
              </p>
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

        {/* TABLE 4: Anti-Seizure Medications - COMPLETE */}
        <div className="space-y-2">
          <p className="text-sm font-bold text-center text-gray-700 dark:text-gray-300 bg-blue-100 dark:bg-blue-900/30 py-2 rounded">TABLE 4 - ANTI-SEIZURE MEDICATIONS</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[700px] border-collapse">
              <thead>
                <tr className="bg-blue-200 dark:bg-blue-800">
                  <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-left font-bold">Drug</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-center font-bold">Initial Dose</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-center font-bold">Max (mg/kg/day)</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-center font-bold">Adult Max (mg/day)</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-center font-bold">Available Forms (SMC)</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-left font-bold">Side Effects</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Acetazolamide</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1m-12y: 5mg/kg/day<br/>12y-18y: 500mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">20</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1000</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 250mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">GI upset, acidosis, numbness, anhydrosis</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Biotin</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">5mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">10mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">10</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Cap 5mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">GI upset</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Brivaracetam</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Wt&lt;11kg: 1.5mg/kg/day<br/>Wt&gt;11kg: 1mg/kg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">&lt;11kg: 6<br/>&gt;11kg: 5</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">200</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center text-red-500">Not available</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Behavioural issues, fatigue</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Bromide (K+)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">30mg/kg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">60-70</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">50</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 850mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, incoordination</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Carbamazepine</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1m-12y: 5mg/kg/day<br/>12y-18y: 200mg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*5).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">30</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1800</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Syrup 20mg/ml<br/>Tab 200mg, 400mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, abdominal pain, allergic reaction, hepatitis, hyponatremia</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Cenobamate</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">12.5mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">400mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">400</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center text-red-500">Not available</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Headache, sedation, dysarthria, ataxia, hyperkalemia, hallucination</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Clobazam</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1m-12y: 0.25mg/kg/day<br/>12y-18y: 20mg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*0.25).toFixed(1)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">60</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 10mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, behavioural issues, aggressiveness</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Clonazepam</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">0.05-0.2mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*0.1).toFixed(2)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">0.25</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">8</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Drops 2.5mg/ml<br/>Tab 0.5mg, 2mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, increased salivation</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Eslicarbazepine</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">400mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1200mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1200</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center text-red-500">Not available</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, GI upset, allergic reaction, dryness of mouth</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Ethosuximide</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1m-5y: 10mg/kg/day<br/>6y-18y: 500mg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*10).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">40</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">2000</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Syrup 50mg/ml<br/>Tab 250mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">GI upset, sedation, coagulopathy, allergic reaction</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Felbamate</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">15mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*15).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">60</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">3600</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center text-red-500">Not available</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, GI upset, insomnia, weight loss, allergic reaction, arrhythmia</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Folinic acid</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">0.5mg/kg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">5mg/kg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">70</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 15mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">GI upset, fatigability</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Gabapentin</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">10mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*10).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">4800</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Cap 300mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, GI upset, weight gain, behavioural issues</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">IVIG</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">2g/kg (STAT or divided)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Inj 50mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Fever, headache, aseptic meningitis, hypotension</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Lacosamide</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">100mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">400mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">400</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Syrup 10mg/ml<br/>Tab 50mg, 100mg, 200mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, diplopia, ataxia</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Lamotrigine</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">0.5mg/kg/day<br/>(Without VPA: 10; With VPA: 5)</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">500</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 5mg, 25mg, 50mg, 100mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-red-600 font-bold">Allergic reaction (SJS), sedation, tremors, GI upset</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Levetiracetam</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">10mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*10).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">60</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">3000</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Syrup 100mg/ml<br/>Tab 500mg, 1000mg<br/>Inj 100mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Behavioural issues</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Methylprednisolone</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">30mg/kg/day x3 days{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*30).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1000mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1000</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Inj 100mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">GI upset, hypertension, behavioural issues, acne, weight gain</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Nitrazepam</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">0.1-0.5mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*0.3).toFixed(1)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">0.5</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 5mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, GI upset, behavioural issues</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Oxcarbazepine</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">10mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*10).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">40</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">2400</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Syrup 60mg/ml<br/>Tab 300mg, 600mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, abdominal pain, allergic reaction, hyponatremia</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Perampanel</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">2mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">12</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">12</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 4mg, 8mg, 12mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, GI upset</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Phenobarbital</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">5mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*5).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">5</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">180</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Syrup 3mg/ml<br/>Tab 30mg<br/>Inj 200mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, hepatitis, behavioural issues</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Phenytoin</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">5mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*5).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">15</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">600</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Syrup 6mg/ml<br/>Tab 100mg<br/>Cap 100mg<br/>Inj 50mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">GI upset, hepatitis, gum hypertrophy, allergic reaction</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Prednisolone</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">2mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*2).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">NA</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">60</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 1mg, 5mg, 20mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">GI upset, hypertension, behavioural issues, acne, weight gain</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Pregabalin</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">150mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">NA</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">600</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Cap 75mg, 150mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, GI upset, behavioural issues, weight gain, allergic reaction</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Primidone</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">125mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">NA</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1500</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 250mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, vertigo, allergic reaction, insomnia</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Pyridoxine</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">50-100mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">30-50mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1000</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 50mg<br/>Inj 50mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">GI upset, headaches</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Retigabine</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">300mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">600-1200mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1200</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center text-red-500">Not available</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, dysarthria, tremors, diplopia</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Rufinamide</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Wt&lt;30kg: 200mg/day<br/>Wt&gt;30kg: 400mg/day</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">-</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">3200</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 200mg, 400mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, allergic reaction, lymphadenopathy, haematuria, hepatitis</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Sodium Valproate</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">10mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*10).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">60</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">2500</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Syrup 57.64mg/ml<br/>Tab 200mg, 500mg, 500mg ER<br/>Inj 100mg/ml</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, hepatitis, agranulocytosis, GI upset, weight gain, coagulopathy</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Topiramate</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">1mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*1).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">10</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">400</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 25mg, 50mg, 100mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5">Sedation, kidney stones, weight loss, acidosis</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 font-medium">Vigabatrin</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">50mg/kg/day{w > 0 && <><br/><span className="text-green-600 font-mono">{(w*50).toFixed(0)}mg/d</span></>}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">150</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">3000</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-center">Tab 500mg<br/>Sachet 500mg</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-1.5 text-red-600 dark:text-red-400 font-bold">Visual field defect (irreversible)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* EEG Section */}
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-700">
          <p className="text-sm font-bold text-indigo-800 dark:text-indigo-200 mb-2">EEG - WHEN TO REQUEST</p>
          <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-2">⚠️ EEG is ONLY to be requested by a Neurologist order</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-indigo-200 dark:border-indigo-700">
              <p className="font-bold text-indigo-700 dark:text-indigo-300 text-xs mb-1">Reasons for requesting EEG:</p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-[10px] space-y-1">
                <li>Unclear nature of event (Epileptic vs. Non-epileptic)</li>
                <li>Localization of seizure focus in case of focal epilepsy</li>
                <li>Documentation of some epileptic syndromes in order to start treatment (Absence, infantile spasms)</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-indigo-200 dark:border-indigo-700">
              <p className="font-bold text-indigo-700 dark:text-indigo-300 text-xs mb-1">Points to mention in EEG request:</p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-[10px] space-y-0.5">
                <li>Age <span className="text-blue-600">(Add corrected age if premature or ex-premature)</span></li>
                <li>Handedness (right or left)</li>
                <li>Date of the event</li>
                <li>Time of the day at which event occurred</li>
                <li>Description of the event</li>
                <li>Consciousness level during the event</li>
                <li>Frequency of the event</li>
                <li>Any significant family history</li>
                <li>Results of recent brain imaging</li>
                <li>Current neuro medications</li>
                <li>Latest EEG date and conclusion</li>
                <li>Reason for requesting EEG</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Video Resources Section */}
        <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <p className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-2">📹 VIDEO RESOURCES</p>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-2">Educational videos showing different seizure types and mimickers</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[10px]">
            <div className="space-y-1">
              <p className="font-bold text-purple-700 dark:text-purple-300">Seizure Types:</p>
              <p>Video 1 - Generalized Tonic-Clonic</p>
              <p>Video 2 - Focal preserved consciousness</p>
              <p>Video 3 - Focal impaired (Motor)</p>
              <p>Video 4 - Focal impaired (Non-motor)</p>
              <p>Video 5 - Absence seizure</p>
              <p>Video 6 - Myoclonic seizures</p>
              <p>Video 7 - Tonic</p>
              <p>Video 8 - Atonic</p>
              <p>Video 9 - Infantile spasm</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-purple-700 dark:text-purple-300">Seizure Mimickers:</p>
              <p>Video 10 - Benign neonatal myoclonus</p>
              <p>Video 11 - Chorea</p>
              <p>Video 12 - Dystonia</p>
              <p>Video 13 - Jitteriness</p>
              <p>Video 14 - Breath holding spells</p>
              <p>Video 15 - Parasomnias</p>
              <p>Video 16 - Apnea</p>
              <p>Video 17 - Syncope</p>
              <p>Video 18 - Day dreaming</p>
              <p>Video 19 - Psychogenic</p>
            </div>
          </div>
        </div>

        {/* References Section */}
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">📚 REFERENCES</p>
          <ol className="list-decimal list-inside text-[9px] text-gray-600 dark:text-gray-400 space-y-1">
            <li>Messahel S, Bracken L, Appleton R. Optimal Management of Status Epilepticus in Children in the Emergency Setting. Open Access Emerg Med. 2022</li>
            <li>APLS Algorithm - Status Epilepticus (apls.org.au)</li>
            <li>Bacon M, et al. Review of the new APLS guideline (2022): Management of the convulsing child. Arch Dis Child Educ Pract Ed. 2023</li>
            <li>NICE Guideline NG217 - Treating status epilepticus</li>
            <li>Löscher W, Klein P. The Pharmacology and Clinical Efficacy of Antiseizure Medications. CNS Drugs. 2021</li>
            <li>Stainman RS, Kossoff EH. Seizure mimics in children: An age-based approach. Curr Probl Pediatr Adolesc Health Care. 2020</li>
            <li>Xixis KL, et al. Febrile Seizure - StatPearls</li>
            <li>AES Guideline - Prolonged Seizures</li>
            <li>Bösel J. SOP: First-ever epileptic seizure in adult patients. Neurol Res Pract. 2019</li>
          </ol>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-2 border-amber-300 dark:border-amber-700">
          <p className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-2">⚠️ DISCLAIMER</p>
          <ul className="text-[10px] text-amber-700 dark:text-amber-300 space-y-1">
            <li>• These are unofficial guidelines at the moment. Official guidelines are in the process of finalization.</li>
            <li>• These guidelines are not supposed to restrict or limit the approach and thinking of the treating physician.</li>
            <li>• Not all possibilities of diagnosis, investigations and management modalities are included in these guidelines.</li>
            <li>• We encourage physicians to keep an open mind for cases that may fall outside the scope of these guidelines.</li>
          </ul>
          <div className="mt-2 pt-2 border-t border-amber-300 dark:border-amber-700 text-[9px] text-gray-600 dark:text-gray-400">
            <p><strong>Done by:</strong> Dr. Safa Shaik, Dr. Hawra Al-Aswad</p>
            <p><strong>Reviewed by:</strong> Dr. Husain Malalla</p>
            <p><strong>Date of issue:</strong> 3/10/2025 | <strong>Next revision:</strong> 1/1/2030</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default EpilepsyApproach;
