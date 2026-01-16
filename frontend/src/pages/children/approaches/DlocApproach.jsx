/**
 * Pediatric Decreased Level of Consciousness Guidelines
 * Based on official guidelines PDF - COMPLETE VERSION
 * Done by: Dr Narjis Alsheala, Reviewed by: Dr Hussain Malalla
 * Contains: Definition, GCS, Algorithm, Neurological & Non-Neurological Differentials
 * Backup saved at: DlocApproach.jsx.backup
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DlocApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pediatric Decreased Level of Consciousness</CardTitle>
        <CardDescription className="text-xs">Complete diagnostic and management guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* DISCLAIMER */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 text-[8px] text-amber-700">
          <p className="font-bold mb-1">Disclaimer:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>These guidelines are supposed to guide the approach of the treating physician in order to provide a systematic analysis and standardized management of each patient.</li>
            <li>These guidelines are not supposed to restrict or limit the approach and thinking of the treating physician. We encourage our treating physicians to be open minded and think also outside these guidelines.</li>
            <li>Not all possibilities of diagnosis, investigations and management modalities are included in these guidelines.</li>
          </ul>
        </div>

        {/* DEFINITION */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-xs font-bold text-blue-700 mb-1">Definition</p>
          <p className="text-[9px] text-blue-600">
            Decreased level of consciousness is a state in which a child exhibits a diminished ability to respond to verbal, physical, or painful stimuli, with varying degrees of awareness, arousal, and interaction with the environment.
          </p>
        </div>

        {/* GRADES OF DLOC */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Grades of Decreased Level of Consciousness</p>
          <p className="text-[8px] text-center text-gray-500">Grades of decreased level of consciousness (DLOC) describe the progressive impairment of a child's arousal and awareness.</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[350px] border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 p-1 text-left font-semibold">Grade</th>
                  <th className="border border-gray-300 p-1 text-left font-semibold">Description</th>
                  <th className="border border-gray-300 p-1 text-left font-semibold">Response to Stimuli</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-green-50 dark:bg-green-950/20">
                  <td className="border border-gray-200 p-1 font-medium text-green-700">Lethargy</td>
                  <td className="border border-gray-200 p-1">Drowsy but arousable</td>
                  <td className="border border-gray-200 p-1">Light verbal or tactile stimulation</td>
                </tr>
                <tr className="bg-yellow-50 dark:bg-yellow-950/20">
                  <td className="border border-gray-200 p-1 font-medium text-yellow-700">Obtundation</td>
                  <td className="border border-gray-200 p-1">Slowed, confused responses</td>
                  <td className="border border-gray-200 p-1">Loud voice or gentle shaking</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-950/20">
                  <td className="border border-gray-200 p-1 font-medium text-orange-700">Stupor</td>
                  <td className="border border-gray-200 p-1">Only responds to painful stimuli</td>
                  <td className="border border-gray-200 p-1">Painful stimulation only</td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-950/20">
                  <td className="border border-gray-200 p-1 font-medium text-red-700">Coma</td>
                  <td className="border border-gray-200 p-1">No meaningful response</td>
                  <td className="border border-gray-200 p-1">No response at all</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* GLASGOW COMA SCALE */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
          <p className="text-xs font-bold text-purple-700 mb-1">Glasgow Coma Scale (Modified for Children)</p>
          <p className="text-[8px] text-purple-600 mb-2">Assesses eye, verbal, and motor response. Score ranges from 3 (deep coma) to 15 (fully alert).</p>
          
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[400px] border-collapse">
              <thead>
                <tr className="bg-purple-200 dark:bg-purple-900/40">
                  <th className="border border-purple-300 p-1 text-center font-semibold">Grade</th>
                  <th className="border border-purple-300 p-1 text-center font-semibold">Motor Response</th>
                  <th className="border border-purple-300 p-1 text-center font-semibold">Verbal Response</th>
                  <th className="border border-purple-300 p-1 text-center font-semibold">Eye Response</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 text-center font-bold">6</td>
                  <td className="border border-purple-200 p-1">Obeys commands</td>
                  <td className="border border-purple-200 p-1">-</td>
                  <td className="border border-purple-200 p-1">-</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 text-center font-bold">5</td>
                  <td className="border border-purple-200 p-1">Localizes pain</td>
                  <td className="border border-purple-200 p-1">Oriented talk</td>
                  <td className="border border-purple-200 p-1">-</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 text-center font-bold">4</td>
                  <td className="border border-purple-200 p-1">Withdrawal from painful stimuli</td>
                  <td className="border border-purple-200 p-1">Sentences that make sense, but inappropriate / Interaction below his usual</td>
                  <td className="border border-purple-200 p-1">Spontaneous eye opening</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 text-center font-bold">3</td>
                  <td className="border border-purple-200 p-1">Abnormal flexion to pain (Decerebrate)</td>
                  <td className="border border-purple-200 p-1">Words that don't make sense / Abnormal cry</td>
                  <td className="border border-purple-200 p-1">Opens only to verbal stimuli</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 text-center font-bold">2</td>
                  <td className="border border-purple-200 p-1">Abnormal extension to pain</td>
                  <td className="border border-purple-200 p-1">Sounds, no words / Occasional whimper</td>
                  <td className="border border-purple-200 p-1">Opens only to pain</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 text-center font-bold">1</td>
                  <td className="border border-purple-200 p-1">No movements</td>
                  <td className="border border-purple-200 p-1">Mute / Mute, unresponsive to pain</td>
                  <td className="border border-purple-200 p-1">No eye opening</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ALGORITHM TITLE */}
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-center">
          <p className="text-sm font-bold">ALGORITHM FOR CHILDREN PRESENTING WITH REDUCED LEVEL OF CONSCIOUSNESS</p>
        </div>

        {/* MAIN ALGORITHM FLOWCHART */}
        <div className="p-2 bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 rounded-xl">
          
          {/* Row 1: Stabilize + Monitor + History */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            {/* Stabilize */}
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg border-2 border-red-400">
              <p className="text-[10px] font-bold text-red-700 text-center">Stabilize</p>
              <p className="text-[8px] text-red-600 text-center mt-1">REFER TO TABLE 1</p>
            </div>
            {/* Monitor */}
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg border-2 border-blue-400">
              <p className="text-[10px] font-bold text-blue-700 text-center">Monitor</p>
              <p className="text-[8px] text-blue-600 text-center mt-1">REFER TO TABLE 2</p>
            </div>
            {/* Take history */}
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg border-2 border-green-400">
              <p className="text-[10px] font-bold text-green-700 text-center">Take history and examination</p>
            </div>
          </div>

          {/* Vertical connectors */}
          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>

          {/* Core Investigations */}
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg border-2 border-amber-400 mb-2">
            <p className="text-[10px] font-bold text-amber-700 text-center mb-1">Core Investigations</p>
            <div className="grid grid-cols-2 gap-1 text-[8px] text-amber-600">
              <div className="flex items-start gap-1"><span>•</span><span>Capillary blood glucose</span></div>
              <div className="flex items-start gap-1"><span>•</span><span>Blood gas</span></div>
              <div className="flex items-start gap-1"><span>•</span><span>Urea and electrolytes</span></div>
              <div className="flex items-start gap-1"><span>•</span><span>Serum blood glucose</span></div>
              <div className="flex items-start gap-1"><span>•</span><span>Liver function test</span></div>
              <div className="flex items-start gap-1"><span>•</span><span>Full blood count</span></div>
              <div className="flex items-start gap-1"><span>•</span><span>Blood culture with inflammatory markers</span></div>
              <div className="flex items-start gap-1"><span>•</span><span>Ammonia and Lactic acid</span></div>
              <div className="flex items-start gap-1 col-span-2"><span>•</span><span>Urine for routine and toxicology</span></div>
            </div>
          </div>

          {/* Vertical connectors */}
          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>

          {/* Decision Branch */}
          <div className="flex justify-center mb-2">
            <div className="flex items-end gap-0">
              <div className="w-24 h-0.5 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-24 h-0.5 bg-gray-400"></div>
            </div>
          </div>

          {/* Two Main Branches */}
          <div className="grid grid-cols-2 gap-3">
            {/* Neurological Branch */}
            <div className="space-y-2">
              <div className="p-2 bg-red-500 text-white rounded-lg text-center">
                <p className="text-[10px] font-bold">Neurological / Unclear</p>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-3 bg-gray-400"></div>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-center border border-red-300">
                <p className="text-[10px] font-bold text-red-700">CT Brain</p>
              </div>
              <div className="flex justify-center">
                <div className="flex items-end gap-0">
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="p-1.5 bg-green-100 dark:bg-green-950/30 rounded text-center border border-green-200">
                  <p className="text-[8px] font-bold text-green-600">Normal</p>
                  <div className="w-0.5 h-2 bg-gray-400 mx-auto my-0.5"></div>
                  <p className="text-[7px] text-green-500">LP + Neuro consult</p>
                </div>
                <div className="p-1.5 bg-red-100 dark:bg-red-950/30 rounded text-center border border-red-200">
                  <p className="text-[8px] font-bold text-red-600">Abnormal</p>
                  <div className="w-0.5 h-2 bg-gray-400 mx-auto my-0.5"></div>
                  <p className="text-[7px] text-red-500">Neurosurgery</p>
                </div>
              </div>
              <div className="p-1.5 bg-purple-100 dark:bg-purple-950/30 rounded text-center border border-purple-200 mt-1">
                <p className="text-[8px] font-bold text-purple-600">Neurological Differentials</p>
                <p className="text-[7px] text-purple-500">See Table 3</p>
              </div>
            </div>

            {/* Non-Neurological Branch */}
            <div className="space-y-2">
              <div className="p-2 bg-green-500 text-white rounded-lg text-center">
                <p className="text-[10px] font-bold">Non-Neurological</p>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-3 bg-gray-400"></div>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center border border-green-300">
                <p className="text-[10px] font-bold text-green-700">Treat Underlying Cause</p>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-3 bg-gray-400"></div>
              </div>
              <div className="p-1.5 bg-teal-100 dark:bg-teal-950/30 rounded text-center border border-teal-200">
                <p className="text-[8px] font-bold text-teal-600">Non-Neurological Differentials</p>
                <p className="text-[7px] text-teal-500">See Table 4</p>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE 1: STABILIZATION */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-red-700">TABLE 1 - STABILIZATION</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[350px] border-collapse">
              <thead>
                <tr className="bg-red-200 dark:bg-red-900/40">
                  <th className="border border-red-300 p-1 text-center font-semibold w-16">Component</th>
                  <th className="border border-red-300 p-1 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-red-200 p-1 text-center font-bold text-red-600">A</td>
                  <td className="border border-red-200 p-1">
                    <ul className="list-disc list-inside">
                      <li>Call airway expert if at risk</li>
                      <li>Consider intubation if GCS decreasing or not protecting airway</li>
                    </ul>
                  </td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-950/20">
                  <td className="border border-red-200 p-1 text-center font-bold text-blue-600">B</td>
                  <td className="border border-red-200 p-1">
                    <ul className="list-disc list-inside">
                      <li>Give oxygen if SpO₂ &lt;94%</li>
                    </ul>
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-red-200 p-1 text-center font-bold text-purple-600">C</td>
                  <td className="border border-red-200 p-1">
                    <ul className="list-disc list-inside">
                      <li>Establish IV access</li>
                      <li>If signs of shock: give 20ml/kg NS over 5-10 minutes {w > 0 && <span className="font-mono text-green-600">({(w*20).toFixed(0)}mL)</span>}</li>
                      <li>If hypoglycemic: give 2ml/kg D10 {w > 0 && <span className="font-mono text-green-600">({(w*2).toFixed(0)}mL)</span>}</li>
                    </ul>
                  </td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-950/20">
                  <td className="border border-red-200 p-1 text-center font-bold text-gray-600">D</td>
                  <td className="border border-red-200 p-1">
                    <ul className="list-disc list-inside">
                      <li>Check GCS and pupil size and responsiveness</li>
                      <li>If GCS decreasing and/or abnormal posturing, elevate head 30°</li>
                    </ul>
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-red-200 p-1 text-center font-bold text-orange-600">E</td>
                  <td className="border border-red-200 p-1">
                    <ul className="list-disc list-inside">
                      <li>Check temperature</li>
                      <li>Look for rashes, signs of trauma or needle marks</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 2: MONITORING */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-blue-700">TABLE 2 - MONITORING</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[350px] border-collapse">
              <thead>
                <tr className="bg-blue-200 dark:bg-blue-900/40">
                  <th className="border border-blue-300 p-1 text-left font-semibold">Parameter</th>
                  <th className="border border-blue-300 p-1 text-center font-semibold">Frequency</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-blue-200 p-1">GCS (if GCS &lt;12)</td>
                  <td className="border border-blue-200 p-1 text-center">Every 15 minutes</td>
                </tr>
                <tr className="bg-blue-50 dark:bg-blue-950/20">
                  <td className="border border-blue-200 p-1">GCS (if GCS 12-14)</td>
                  <td className="border border-blue-200 p-1 text-center">Every 1 hour</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-blue-200 p-1">Vital signs (HR, BP, SpO₂, RR)</td>
                  <td className="border border-blue-200 p-1 text-center">As per clinical condition</td>
                </tr>
                <tr className="bg-blue-50 dark:bg-blue-950/20">
                  <td className="border border-blue-200 p-1">Pupil size and reactivity</td>
                  <td className="border border-blue-200 p-1 text-center">With GCS assessment</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-blue-200 p-1">Blood glucose</td>
                  <td className="border border-blue-200 p-1 text-center">Every 1-2 hours initially</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 3: NEUROLOGICAL DIFFERENTIALS */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-purple-700">TABLE 3 - NEUROLOGICAL DIFFERENTIALS</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[450px] border-collapse">
              <thead>
                <tr className="bg-purple-200 dark:bg-purple-900/40">
                  <th className="border border-purple-300 p-1 text-left font-semibold">Diagnosis</th>
                  <th className="border border-purple-300 p-1 text-left font-semibold">Key History</th>
                  <th className="border border-purple-300 p-1 text-left font-semibold">Key Examination</th>
                  <th className="border border-purple-300 p-1 text-left font-semibold">Special Investigations</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 font-medium">Meningitis / Encephalitis</td>
                  <td className="border border-purple-200 p-1">Fever, headache, photophobia, vomiting</td>
                  <td className="border border-purple-200 p-1">Neck stiffness, Kernig/Brudzinski signs, rash</td>
                  <td className="border border-purple-200 p-1">LP (if safe), CT before LP if focal signs</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 font-medium">Raised ICP</td>
                  <td className="border border-purple-200 p-1">Headache, vomiting (especially morning), visual changes</td>
                  <td className="border border-purple-200 p-1">Papilledema, bulging fontanelle, sunset eyes, Cushing triad</td>
                  <td className="border border-purple-200 p-1">CT/MRI brain, do NOT LP</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 font-medium">Intracranial Hemorrhage</td>
                  <td className="border border-purple-200 p-1">Sudden onset headache, trauma, bleeding disorder</td>
                  <td className="border border-purple-200 p-1">Focal neurological signs, unequal pupils</td>
                  <td className="border border-purple-200 p-1">CT brain (urgent)</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 font-medium">Stroke</td>
                  <td className="border border-purple-200 p-1">Sudden focal weakness, speech problems</td>
                  <td className="border border-purple-200 p-1">Hemiparesis, facial droop, dysphasia</td>
                  <td className="border border-purple-200 p-1">CT/MRI brain</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 font-medium">Status Epilepticus</td>
                  <td className="border border-purple-200 p-1">Prolonged seizure, known epilepsy</td>
                  <td className="border border-purple-200 p-1">Ongoing seizure activity, postictal state</td>
                  <td className="border border-purple-200 p-1">EEG, antiepileptic levels</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 font-medium">Traumatic Brain Injury</td>
                  <td className="border border-purple-200 p-1">Head trauma, mechanism of injury</td>
                  <td className="border border-purple-200 p-1">Scalp injury, Battle sign, raccoon eyes, CSF leak</td>
                  <td className="border border-purple-200 p-1">CT brain</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 font-medium">Brain Tumor</td>
                  <td className="border border-purple-200 p-1">Progressive headaches, morning vomiting, personality change</td>
                  <td className="border border-purple-200 p-1">Papilledema, focal signs, ataxia</td>
                  <td className="border border-purple-200 p-1">MRI brain</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 font-medium">Hydrocephalus</td>
                  <td className="border border-purple-200 p-1">Increasing head size, vomiting, irritability</td>
                  <td className="border border-purple-200 p-1">Bulging fontanelle, sunset eyes, large head</td>
                  <td className="border border-purple-200 p-1">CT/MRI brain, USS if fontanelle open</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 4: NON-NEUROLOGICAL DIFFERENTIALS */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-teal-700">TABLE 4 - NON-NEUROLOGICAL DIFFERENTIALS</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[450px] border-collapse">
              <thead>
                <tr className="bg-teal-200 dark:bg-teal-900/40">
                  <th className="border border-teal-300 p-1 text-left font-semibold">Diagnosis</th>
                  <th className="border border-teal-300 p-1 text-left font-semibold">Key History</th>
                  <th className="border border-teal-300 p-1 text-left font-semibold">Key Examination</th>
                  <th className="border border-teal-300 p-1 text-left font-semibold">Special Investigations</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-teal-200 p-1 font-medium">Hypoglycemia</td>
                  <td className="border border-teal-200 p-1">Diabetes, fasting, insulin use</td>
                  <td className="border border-teal-200 p-1">Sweating, tremor, pallor</td>
                  <td className="border border-teal-200 p-1">Blood glucose</td>
                </tr>
                <tr className="bg-teal-50 dark:bg-teal-950/20">
                  <td className="border border-teal-200 p-1 font-medium">DKA</td>
                  <td className="border border-teal-200 p-1">Diabetes, polyuria, polydipsia, weight loss</td>
                  <td className="border border-teal-200 p-1">Kussmaul breathing, dehydration, fruity breath</td>
                  <td className="border border-teal-200 p-1">Blood glucose, ketones, blood gas</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-teal-200 p-1 font-medium">Sepsis / Shock</td>
                  <td className="border border-teal-200 p-1">Fever, poor feeding, source of infection</td>
                  <td className="border border-teal-200 p-1">Tachycardia, hypotension, poor perfusion, mottling</td>
                  <td className="border border-teal-200 p-1">Blood culture, FBC, CRP, Lactate</td>
                </tr>
                <tr className="bg-teal-50 dark:bg-teal-950/20">
                  <td className="border border-teal-200 p-1 font-medium">Drug Intoxication / Poisoning</td>
                  <td className="border border-teal-200 p-1">Access to medications, depression, suicide risk</td>
                  <td className="border border-teal-200 p-1">Toxidrome features, needle marks</td>
                  <td className="border border-teal-200 p-1">Toxicology screen, specific drug levels</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-teal-200 p-1 font-medium">Hyponatremia</td>
                  <td className="border border-teal-200 p-1">Vomiting, diarrhea, water intoxication</td>
                  <td className="border border-teal-200 p-1">Confusion, seizures</td>
                  <td className="border border-teal-200 p-1">U&E</td>
                </tr>
                <tr className="bg-teal-50 dark:bg-teal-950/20">
                  <td className="border border-teal-200 p-1 font-medium">Hypernatremia</td>
                  <td className="border border-teal-200 p-1">Dehydration, poor intake</td>
                  <td className="border border-teal-200 p-1">Lethargy, irritability</td>
                  <td className="border border-teal-200 p-1">U&E</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-teal-200 p-1 font-medium">Hepatic Encephalopathy</td>
                  <td className="border border-teal-200 p-1">Known liver disease, jaundice</td>
                  <td className="border border-teal-200 p-1">Jaundice, asterixis, hepatomegaly</td>
                  <td className="border border-teal-200 p-1">LFT, ammonia, coagulation</td>
                </tr>
                <tr className="bg-teal-50 dark:bg-teal-950/20">
                  <td className="border border-teal-200 p-1 font-medium">Uremic Encephalopathy</td>
                  <td className="border border-teal-200 p-1">Known renal disease, oliguria</td>
                  <td className="border border-teal-200 p-1">Pallor, edema, hypertension</td>
                  <td className="border border-teal-200 p-1">U&E, creatinine</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-teal-200 p-1 font-medium">Inborn Errors of Metabolism</td>
                  <td className="border border-teal-200 p-1">Neonatal, consanguinity, family history</td>
                  <td className="border border-teal-200 p-1">Hypotonia, unusual odor</td>
                  <td className="border border-teal-200 p-1">Ammonia, lactate, metabolic screen</td>
                </tr>
                <tr className="bg-teal-50 dark:bg-teal-950/20">
                  <td className="border border-teal-200 p-1 font-medium">Hypothermia / Hyperthermia</td>
                  <td className="border border-teal-200 p-1">Environmental exposure</td>
                  <td className="border border-teal-200 p-1">Temperature extremes</td>
                  <td className="border border-teal-200 p-1">Core temperature</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-teal-200 p-1 font-medium">Hypoxia / Hypercapnia</td>
                  <td className="border border-teal-200 p-1">Respiratory illness, drowning</td>
                  <td className="border border-teal-200 p-1">Cyanosis, respiratory distress</td>
                  <td className="border border-teal-200 p-1">Blood gas, SpO₂</td>
                </tr>
                <tr className="bg-teal-50 dark:bg-teal-950/20">
                  <td className="border border-teal-200 p-1 font-medium">Adrenal Crisis</td>
                  <td className="border border-teal-200 p-1">Known adrenal insufficiency, steroid use</td>
                  <td className="border border-teal-200 p-1">Hypotension, hyperpigmentation</td>
                  <td className="border border-teal-200 p-1">Cortisol, U&E, glucose</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DRUG ANTIDOTES */}
        <div className="p-2 bg-gradient-to-r from-amber-50 to-green-50 dark:from-amber-950/20 dark:to-green-950/20 rounded-lg">
          <p className="text-xs font-bold text-center text-gray-700 mb-2">Common Drug Antidotes</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white dark:bg-gray-900 rounded text-center border">
              <p className="text-[10px] font-bold text-amber-700">Opioid Toxicity</p>
              <p className="text-[8px] text-gray-500">Pinpoint pupils, respiratory depression</p>
              <p className="text-[10px] font-bold text-green-600 mt-1">→ Naloxone</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded text-center border">
              <p className="text-[10px] font-bold text-amber-700">Benzodiazepine Toxicity</p>
              <p className="text-[8px] text-gray-500">Sedation, respiratory depression</p>
              <p className="text-[10px] font-bold text-green-600 mt-1">→ Flumazenil</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default DlocApproach;
