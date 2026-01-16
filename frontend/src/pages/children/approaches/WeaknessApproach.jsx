/**
 * Acute Weakness Approach - Complete Version with Full Algorithm
 * Based on user-provided clinical algorithm and tables
 * Backup saved at: WeaknessApproach.jsx.backup
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const WeaknessApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Approach to Acute Weakness</CardTitle>
        <CardDescription className="text-xs">Algorithm with History, Examination, Investigations & Neuro Location</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* MAIN ALGORITHM FLOWCHART */}
        <div className="p-3 bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-3">Algorithm</p>
          
          <div className="flex justify-center mb-3">
            <div className="text-[9px] text-gray-500 grid grid-cols-3 gap-4 w-full text-center">
              <span className="font-semibold">History/Examination</span>
              <span className="font-semibold">Investigations (in ER)</span>
              <span className="font-semibold">Neuro Location</span>
            </div>
          </div>

          {/* Starting Point */}
          <div className="flex items-center mb-3">
            <div className="px-3 py-2 bg-gray-800 text-white rounded-lg font-bold text-xs">
              Acute Weakness
            </div>
            <div className="flex-1 border-t-2 border-gray-400 ml-2"></div>
          </div>

          {/* Branch 1: Unilateral */}
          <div className="ml-4 mb-4 pl-4 border-l-2 border-gray-400">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex-shrink-0">
                <p className="text-[10px] font-bold text-purple-700">Unilateral weakness</p>
                <p className="text-[9px] text-purple-600">± Headache</p>
              </div>
              <div className="border-t-2 border-gray-400 w-8"></div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
                <p className="text-[10px] font-bold text-blue-700">CT Brain</p>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-500">-ve →</span>
                  <span className="text-[9px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Other DDx</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-500">+ve →</span>
                  <span className="text-[9px] px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded text-red-700">Stroke / Brain Insults</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branch 2: Bilateral LL */}
          <div className="ml-4 mb-4 pl-4 border-l-2 border-gray-400">
            <div className="flex items-start gap-2 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0">
                <p className="text-[10px] font-bold text-red-700">Progressive bilateral</p>
                <p className="text-[10px] font-bold text-red-700">LL weakness</p>
                <p className="text-[9px] text-red-600">Areflexia</p>
                <div className="mt-1 p-1 bg-red-50 dark:bg-red-950/30 rounded text-[8px] text-red-600">
                  <p>+ Spinal level</p>
                  <p>± Sphincter impairment</p>
                  <p>± Back pain</p>
                </div>
              </div>
              <div className="border-t-2 border-gray-400 w-6 mt-4"></div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex-shrink-0">
                <p className="text-[10px] font-bold text-orange-700">Emergency</p>
                <p className="text-[10px] font-bold text-orange-700">MRI Spine</p>
              </div>
              <div className="flex-1 flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-500">+ve →</span>
                  <span className="text-[9px] px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-700">Spinal Compression</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-500">-ve →</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-700">Transverse Myelitis</span>
                    <span className="text-[9px] px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 rounded text-teal-700">Guillain-Barré</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-700 ml-1">→ LP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branch 3: Diurnal */}
          <div className="ml-4 mb-4 pl-4 border-l-2 border-gray-400">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex-shrink-0">
                <p className="text-[10px] font-bold text-amber-700">Diurnal variation</p>
              </div>
              <div className="border-t-2 border-gray-400 flex-1"></div>
              <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-300">
                <p className="text-[10px] font-bold text-amber-700">Myasthenia Gravis</p>
              </div>
            </div>
          </div>

          {/* Branch 4: Calf Tenderness */}
          <div className="ml-4 mb-2 pl-4 border-l-2 border-gray-400">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg flex-shrink-0">
                <p className="text-[10px] font-bold text-green-700">Bilateral calf tenderness</p>
              </div>
              <div className="border-t-2 border-gray-400 w-6"></div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
                <p className="text-[10px] font-bold text-blue-700">CK</p>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-500">High →</span>
                  <span className="text-[9px] px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-green-700">Myositis</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-gray-500">Normal →</span>
                  <span className="text-[9px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Other DDx</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note - Back Pain */}
        <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-xl border-2 border-red-300">
          <p className="text-[10px] text-red-700">
            <strong>⚠️ Important:</strong> If patient comes with back pain (out of all other signs of spinal involvement like spinal level or sphincter involvement), they should be referred to <strong>neurosurgery</strong> and they are the ones that request MRI. Back pain makes the likelihood of spinal compression very high, so ER doctor should refer to <strong>neurosurgery resident, not pediatric resident</strong>.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* TABLE 1: Neurological Differentials */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Table 1: Neurological Differentials</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-pink-100 dark:bg-pink-900/30">
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[15%]">Differential</th>
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[22%]">History</th>
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[18%]">Examination</th>
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[12%]">Investigation (In ER)</th>
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[15%]">Findings</th>
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[18%]">Treatment</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1.5 font-medium">Ischemic Stroke</td>
                  <td className="border border-pink-200 p-1.5">• Unilateral weakness<br/>• ± Headache</td>
                  <td className="border border-pink-200 p-1.5">• Focal weakness<br/>• +/- visual disturbance</td>
                  <td className="border border-pink-200 p-1.5">Non-contrast CT<br/>CT angio</td>
                  <td className="border border-pink-200 p-1.5">CT findings</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-green-700">Aspirin 3-5 mg/kg OD PO{w > 0 && <><br/><span className="font-mono">{(w*3).toFixed(0)}-{(w*5).toFixed(0)} mg</span></>}</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1.5 font-medium">Postictal Todd Paralysis</td>
                  <td className="border border-pink-200 p-1.5">• Prolonged seizure</td>
                  <td className="border border-pink-200 p-1.5">• Transient weakness</td>
                  <td className="border border-pink-200 p-1.5">-</td>
                  <td className="border border-pink-200 p-1.5">Normal CT brain</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-green-700">Observation</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1.5 font-medium">Transverse Myelitis</td>
                  <td className="border border-pink-200 p-1.5">• Weakness & sensory disturbance below lesion<br/>• Bladder & bowel dysfunction<br/>• 50% have preceding viral infection</td>
                  <td className="border border-pink-200 p-1.5">• Weakness & sensory disturbance below the level of the lesion</td>
                  <td className="border border-pink-200 p-1.5">Spine MRI<br/>LP</td>
                  <td className="border border-pink-200 p-1.5">Spine MRI: Segmental spine involvement<br/>LP: high WBCs, normal protein</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-green-700">Methylprednisolone 30 mg/kg OD IV for 3-5 days{w > 0 && <><br/><span className="font-mono">{(w*30).toFixed(0)} mg/day</span></>}<br/>then Prednisolone 2 mg/kg OD PO, taper over 6-8 weeks</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1.5 font-medium">Guillain-Barré Syndrome</td>
                  <td className="border border-pink-200 p-1.5">• History of respiratory or GI illness (2-4 weeks prior)<br/>• Symmetrical ascending paralysis with limb parasthesia and pain</td>
                  <td className="border border-pink-200 p-1.5">• Symmetrical ascending paralysis<br/>• Absent deep tendon reflexes</td>
                  <td className="border border-pink-200 p-1.5">Spine MRI<br/>LP</td>
                  <td className="border border-pink-200 p-1.5">Spine MRI<br/>LP: Normal WBCs, high protein<br/><span className="font-bold text-teal-600">"Albumin-cytological dissociation"</span></td>
                  <td className="border border-pink-200 p-1.5 font-medium text-green-700">IVIG 2 g/kg IV (Either STAT, or divided over 2 days, or divided over 5 days){w > 0 && <><br/><span className="font-mono">{(w*2).toFixed(0)} g total</span></>}</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1.5 font-medium">Myasthenia Gravis</td>
                  <td className="border border-pink-200 p-1.5">• Hx of myasthenia gravis<br/>• Acute crisis may be spontaneous or with trigger factor: infection</td>
                  <td className="border border-pink-200 p-1.5">• 85% involvement of eyelids & extraocular muscles<br/>• Ptosis, diplopia<br/>• Fatiguability at end of the day</td>
                  <td className="border border-pink-200 p-1.5">-</td>
                  <td className="border border-pink-200 p-1.5">High Anti-Ach receptors or Anti-MuSK antibodies</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-green-700">• Hx of myasthenia gravis<br/>• Acute crisis may be spontaneous or with trigger factor: infection</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Notes for Table 1 */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200">
          <p className="text-[10px] font-bold text-amber-700 mb-1">IMPORTANT:</p>
          <ul className="text-[9px] text-amber-600 space-y-1">
            <li>• During the acute phase, upper motor neuron lesions are associated with <strong>decreased spinal cord reflexes and hypotonia</strong>. Over the period of several weeks, spasticity, hyperreflexia, and "upper motor neuron" signs (eg, positive Babinski sign) develop.</li>
            <li>• CSF findings might not be clear in the initial stage of GBS</li>
            <li>• Myasthenia does not usually present as acute attack, rather it present as acute on top of chronic especially with intercurrent illness.</li>
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* TABLE 2: Non-Neurological Differentials */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Table 2: Non-Neurological Differentials</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[450px] border-collapse">
              <thead>
                <tr className="bg-pink-100 dark:bg-pink-900/30">
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[15%]">Differential</th>
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[28%]">History</th>
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[25%]">Examination</th>
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[15%]">Investigation (In ER)</th>
                  <th className="border border-pink-200 p-1.5 text-left font-semibold w-[17%]">Service Involved</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1.5 font-medium">Head Trauma</td>
                  <td className="border border-pink-200 p-1.5">• History of head trauma (May be absent in case of non-accidental injuries)</td>
                  <td className="border border-pink-200 p-1.5">• Altered mental status<br/>• Signs of raised ICP e.g. vomiting, increased BP, focal neuro deficits</td>
                  <td className="border border-pink-200 p-1.5">Non-contrast CT</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-purple-700">Neurosurgery</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1.5 font-medium">Hemorrhagic Stroke</td>
                  <td className="border border-pink-200 p-1.5">• Headache</td>
                  <td className="border border-pink-200 p-1.5">-</td>
                  <td className="border border-pink-200 p-1.5">Non-contrast CT</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-purple-700">Neurosurgery</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1.5 font-medium">Spinal Cord Trauma</td>
                  <td className="border border-pink-200 p-1.5">• Direct blow to the head, neck, or back</td>
                  <td className="border border-pink-200 p-1.5">• Impairment of sensory and motor function below the level of the injury</td>
                  <td className="border border-pink-200 p-1.5">Spine MRI</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-purple-700">Neurosurgery</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1.5 font-medium">Spinal Cord Tumour</td>
                  <td className="border border-pink-200 p-1.5">• Focal weakness and peripheral or back pain<br/>• Incontinence may also occur</td>
                  <td className="border border-pink-200 p-1.5">• Weakness and sensory disturbance below the level of the lesion</td>
                  <td className="border border-pink-200 p-1.5">Spine MRI</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-purple-700">Neurosurgery</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1.5 font-medium">Viral Myositis</td>
                  <td className="border border-pink-200 p-1.5">• Refusal to walk with pain on passive or active dorsiflexion of the feet in a child who is in the recovery phase of influenza</td>
                  <td className="border border-pink-200 p-1.5">• Marked tenderness of bilateral calf muscle</td>
                  <td className="border border-pink-200 p-1.5">CK</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-blue-700">General Pediatrics</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1.5 font-medium">Arthritis</td>
                  <td className="border border-pink-200 p-1.5">• Localized pain</td>
                  <td className="border border-pink-200 p-1.5">• Localized tenderness and reduced range of movements</td>
                  <td className="border border-pink-200 p-1.5">High ESR, CRP</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-blue-700">General Pediatrics / Rheumatology</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1.5 font-medium">Conversion Disorder</td>
                  <td className="border border-pink-200 p-1.5">• Symptoms often start after an emotional stress or minor injury</td>
                  <td className="border border-pink-200 p-1.5">• Presence of normal tendon reflexes in flaccid extremities<br/>• Give-way weakness<br/>• Physically implausible presentations</td>
                  <td className="border border-pink-200 p-1.5">No abnormality in workup</td>
                  <td className="border border-pink-200 p-1.5 font-medium text-amber-700">Psychiatry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* When to Contact Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* When to contact Neurology */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200">
            <p className="text-xs font-bold text-blue-700 mb-2">When to contact neurology oncall?</p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center text-[9px] font-bold text-pink-700 flex-shrink-0">A</span>
                <p className="text-[10px] text-gray-700 dark:text-gray-300">CT showing stroke for further management</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center text-[9px] font-bold text-pink-700 flex-shrink-0">B</span>
                <p className="text-[10px] text-gray-700 dark:text-gray-300">If clinical picture suggests transverse myelitis vs. GBS as neurologist has to enter request for emergency MRI in order to diagnose</p>
              </div>
            </div>
          </div>

          {/* When to contact PICU */}
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200">
            <p className="text-xs font-bold text-red-700 mb-2">When to contact PICU?</p>
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center text-[9px] font-bold text-pink-700 flex-shrink-0">A</span>
                <p className="text-[10px] text-gray-700 dark:text-gray-300">Any alteration in level of consciousness might indicate CO2 retention or brain insult</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center text-[9px] font-bold text-pink-700 flex-shrink-0">B</span>
                <p className="text-[10px] text-gray-700 dark:text-gray-300">Weak respiratory effort</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center text-[9px] font-bold text-pink-700 flex-shrink-0">C</span>
                <p className="text-[10px] text-gray-700 dark:text-gray-300">Blood gas showing CO2 retention</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center text-[9px] font-bold text-pink-700 flex-shrink-0">D</span>
                <p className="text-[10px] text-gray-700 dark:text-gray-300">Fast ascending paralysis within hours</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center text-[9px] font-bold text-pink-700 flex-shrink-0">E</span>
                <p className="text-[10px] text-gray-700 dark:text-gray-300">Hoarseness of voice</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center text-[9px] font-bold text-pink-700 flex-shrink-0">F</span>
                <p className="text-[10px] text-gray-700 dark:text-gray-300">Drooling</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center text-[9px] font-bold text-pink-700 flex-shrink-0">G</span>
                <p className="text-[10px] text-gray-700 dark:text-gray-300">Swallowing incoordination</p>
              </div>
            </div>
          </div>
        </div>

        {/* Remember Note */}
        <div className="p-3 bg-amber-100 dark:bg-amber-950/40 rounded-xl border-2 border-amber-300">
          <p className="text-[10px] font-bold text-amber-700 mb-1">REMEMBER:</p>
          <p className="text-[10px] text-amber-600">
            In weakness, no clear signs of respiratory distress would be seen. These patients are <strong>CO2 retainers</strong>. They can have <strong>normal SpO2 while retaining CO2</strong>. Usually SpO2 doesn't change until very late.
          </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default WeaknessApproach;
