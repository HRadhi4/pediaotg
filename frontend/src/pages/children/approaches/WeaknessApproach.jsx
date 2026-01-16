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

        {/* MAIN ALGORITHM FLOWCHART - Table Layout for proper alignment */}
        <div className="p-2 bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">Algorithm</p>
          
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-1 mb-2 text-[9px] font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-300 pb-1">
            <div className="col-span-4 text-center">History/Examination</div>
            <div className="col-span-4 text-center">Investigations (in ER)</div>
            <div className="col-span-4 text-center">Neuro Location</div>
          </div>

          {/* Starting Point */}
          <div className="grid grid-cols-12 gap-1 mb-2">
            <div className="col-span-12">
              <div className="inline-block px-3 py-1.5 bg-gray-800 text-white rounded-lg font-bold text-[10px]">
                Acute Weakness
              </div>
            </div>
          </div>

          {/* Branch 1: Unilateral */}
          <div className="grid grid-cols-12 gap-1 mb-2 items-center">
            <div className="col-span-4">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded text-[9px]">
                <p className="font-bold text-purple-700">Unilateral weakness</p>
                <p className="text-purple-600">± Headache</p>
              </div>
            </div>
            <div className="col-span-4 text-center">
              <div className="inline-block p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded text-[9px]">
                <p className="font-bold text-blue-700">CT Brain</p>
              </div>
            </div>
            <div className="col-span-4">
              <div className="text-[8px] space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">-ve →</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Other DDx</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">+ve →</span>
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Stroke/Brain Insults</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branch 2: Bilateral LL */}
          <div className="grid grid-cols-12 gap-1 mb-2 items-start">
            <div className="col-span-4">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded text-[9px]">
                <p className="font-bold text-red-700">Progressive bilateral LL weakness</p>
                <p className="text-red-600">Areflexia</p>
                <div className="mt-1 p-1 bg-red-50 dark:bg-red-950/30 rounded text-[8px] text-red-600">
                  <p>+ Spinal level</p>
                  <p>± Sphincter impairment</p>
                  <p>± Back pain</p>
                </div>
              </div>
            </div>
            <div className="col-span-4 text-center">
              <div className="inline-block p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded text-[9px]">
                <p className="font-bold text-orange-700">Emergency</p>
                <p className="font-bold text-orange-700">MRI Spine</p>
              </div>
              <div className="mt-1 text-[8px] text-gray-500">then LP if -ve</div>
            </div>
            <div className="col-span-4">
              <div className="text-[8px] space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">+ve →</span>
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">Spinal Compression</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-gray-500">-ve →</span>
                  <div className="space-y-0.5">
                    <span className="block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Transverse Myelitis</span>
                    <span className="block px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded">Guillain-Barré</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Branch 3: Diurnal */}
          <div className="grid grid-cols-12 gap-1 mb-2 items-center">
            <div className="col-span-4">
              <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded text-[9px]">
                <p className="font-bold text-amber-700">Diurnal variation</p>
              </div>
            </div>
            <div className="col-span-4 text-center">
              <span className="text-[9px] text-gray-400">—</span>
            </div>
            <div className="col-span-4">
              <div className="inline-block p-1.5 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-300 text-[9px]">
                <p className="font-bold text-amber-700">Myasthenia Gravis</p>
              </div>
            </div>
          </div>

          {/* Branch 4: Calf Tenderness */}
          <div className="grid grid-cols-12 gap-1 items-center">
            <div className="col-span-4">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded text-[9px]">
                <p className="font-bold text-green-700">Bilateral calf tenderness</p>
              </div>
            </div>
            <div className="col-span-4 text-center">
              <div className="inline-block p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded text-[9px]">
                <p className="font-bold text-blue-700">CK</p>
              </div>
            </div>
            <div className="col-span-4">
              <div className="text-[8px] space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">High →</span>
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Myositis</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Normal →</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Other DDx</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note - Back Pain */}
        <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-lg border-2 border-red-300">
          <p className="text-[9px] text-red-700">
            <strong>⚠️ Important:</strong> If patient comes with back pain (out of all other signs of spinal involvement like spinal level or sphincter involvement), they should be referred to <strong>neurosurgery</strong> and they are the ones that request MRI. Back pain makes the likelihood of spinal compression very high, so ER doctor should refer to <strong>neurosurgery resident, not pediatric resident</strong>.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-2"></div>

        {/* TABLE 1: Neurological Differentials */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Table 1: Neurological Differentials</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-pink-100 dark:bg-pink-900/30">
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[14%]">Differential</th>
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[20%]">History</th>
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[18%]">Examination</th>
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[12%]">Investigation</th>
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[16%]">Findings</th>
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[20%]">Treatment</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1 font-medium">Ischemic Stroke</td>
                  <td className="border border-pink-200 p-1">• Unilateral weakness<br/>• ± Headache</td>
                  <td className="border border-pink-200 p-1">• Focal weakness<br/>• +/- visual disturbance</td>
                  <td className="border border-pink-200 p-1">Non-contrast CT<br/>CT angio</td>
                  <td className="border border-pink-200 p-1">CT findings</td>
                  <td className="border border-pink-200 p-1 font-medium text-green-700">Aspirin 3-5 mg/kg OD PO{w > 0 && <><br/><span className="font-mono">{(w*3).toFixed(0)}-{(w*5).toFixed(0)} mg</span></>}</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1 font-medium">Postictal Todd Paralysis</td>
                  <td className="border border-pink-200 p-1">• Prolonged seizure</td>
                  <td className="border border-pink-200 p-1">• Transient weakness</td>
                  <td className="border border-pink-200 p-1">-</td>
                  <td className="border border-pink-200 p-1">Normal CT brain</td>
                  <td className="border border-pink-200 p-1 font-medium text-green-700">Observation</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1 font-medium">Transverse Myelitis</td>
                  <td className="border border-pink-200 p-1">• Weakness & sensory disturbance below lesion<br/>• Bladder/bowel dysfunction<br/>• 50% preceding viral</td>
                  <td className="border border-pink-200 p-1">• Weakness & sensory disturbance below lesion level</td>
                  <td className="border border-pink-200 p-1">Spine MRI<br/>LP</td>
                  <td className="border border-pink-200 p-1">Spine MRI: Segmental involvement<br/>LP: high WBCs, normal protein</td>
                  <td className="border border-pink-200 p-1 font-medium text-green-700">Methylpred 30 mg/kg OD IV × 3-5d{w > 0 && <><br/><span className="font-mono">{(w*30).toFixed(0)} mg/d</span></>}<br/>then Pred 2 mg/kg taper 6-8wk</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1 font-medium">Guillain-Barré Syndrome</td>
                  <td className="border border-pink-200 p-1">• Resp/GI illness 2-4 wk prior<br/>• Symmetrical ascending paralysis with parasthesia & pain</td>
                  <td className="border border-pink-200 p-1">• Symmetrical ascending paralysis<br/>• Absent DTRs</td>
                  <td className="border border-pink-200 p-1">Spine MRI<br/>LP</td>
                  <td className="border border-pink-200 p-1">LP: Normal WBCs, high protein<br/><span className="font-bold text-teal-600">"Albumin-cytological dissociation"</span></td>
                  <td className="border border-pink-200 p-1 font-medium text-green-700">IVIG 2 g/kg IV{w > 0 && <><br/><span className="font-mono">{(w*2).toFixed(0)} g total</span></>}<br/>(STAT or ÷2d or ÷5d)</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1 font-medium">Myasthenia Gravis</td>
                  <td className="border border-pink-200 p-1">• Hx of MG<br/>• Crisis: spontaneous or with trigger (infection)</td>
                  <td className="border border-pink-200 p-1">• 85% eyelid/extraocular involvement<br/>• Ptosis, diplopia<br/>• Fatiguability end of day</td>
                  <td className="border border-pink-200 p-1">-</td>
                  <td className="border border-pink-200 p-1">High Anti-AchR or Anti-MuSK antibodies</td>
                  <td className="border border-pink-200 p-1 font-medium text-green-700">Pyridostigmine<br/>IVIG in crisis</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Notes for Table 1 */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-[9px] font-bold text-amber-700 mb-1">IMPORTANT:</p>
          <ul className="text-[8px] text-amber-600 space-y-0.5">
            <li>• During acute phase, upper motor neuron lesions have <strong>decreased spinal cord reflexes and hypotonia</strong>. Spasticity & hyperreflexia develop over weeks.</li>
            <li>• CSF findings might not be clear in the initial stage of GBS</li>
            <li>• Myasthenia does not usually present as acute attack, rather acute on top of chronic especially with intercurrent illness.</li>
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-2"></div>

        {/* TABLE 2: Non-Neurological Differentials */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Table 2: Non-Neurological Differentials</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[400px] border-collapse">
              <thead>
                <tr className="bg-pink-100 dark:bg-pink-900/30">
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[15%]">Differential</th>
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[27%]">History</th>
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[25%]">Examination</th>
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[15%]">Investigation</th>
                  <th className="border border-pink-200 p-1 text-left font-semibold w-[18%]">Service</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1 font-medium">Head Trauma</td>
                  <td className="border border-pink-200 p-1">• Hx of head trauma (may be absent in NAI)</td>
                  <td className="border border-pink-200 p-1">• Altered mental status<br/>• Signs of raised ICP</td>
                  <td className="border border-pink-200 p-1">Non-contrast CT</td>
                  <td className="border border-pink-200 p-1 font-medium text-purple-700">Neurosurgery</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1 font-medium">Hemorrhagic Stroke</td>
                  <td className="border border-pink-200 p-1">• Headache</td>
                  <td className="border border-pink-200 p-1">-</td>
                  <td className="border border-pink-200 p-1">Non-contrast CT</td>
                  <td className="border border-pink-200 p-1 font-medium text-purple-700">Neurosurgery</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1 font-medium">Spinal Cord Trauma</td>
                  <td className="border border-pink-200 p-1">• Direct blow to head/neck/back</td>
                  <td className="border border-pink-200 p-1">• Impairment of sensory & motor function below injury</td>
                  <td className="border border-pink-200 p-1">Spine MRI</td>
                  <td className="border border-pink-200 p-1 font-medium text-purple-700">Neurosurgery</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1 font-medium">Spinal Cord Tumour</td>
                  <td className="border border-pink-200 p-1">• Focal weakness & back pain<br/>• Incontinence</td>
                  <td className="border border-pink-200 p-1">• Weakness & sensory disturbance below lesion</td>
                  <td className="border border-pink-200 p-1">Spine MRI</td>
                  <td className="border border-pink-200 p-1 font-medium text-purple-700">Neurosurgery</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1 font-medium">Viral Myositis</td>
                  <td className="border border-pink-200 p-1">• Refusal to walk, pain on dorsiflexion, recovering from influenza</td>
                  <td className="border border-pink-200 p-1">• Marked bilateral calf tenderness</td>
                  <td className="border border-pink-200 p-1">CK</td>
                  <td className="border border-pink-200 p-1 font-medium text-blue-700">Gen Pediatrics</td>
                </tr>
                <tr className="bg-pink-50 dark:bg-pink-950/20">
                  <td className="border border-pink-200 p-1 font-medium">Arthritis</td>
                  <td className="border border-pink-200 p-1">• Localized pain</td>
                  <td className="border border-pink-200 p-1">• Localized tenderness, reduced ROM</td>
                  <td className="border border-pink-200 p-1">High ESR, CRP</td>
                  <td className="border border-pink-200 p-1 font-medium text-blue-700">Gen Peds/Rheum</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1 font-medium">Conversion Disorder</td>
                  <td className="border border-pink-200 p-1">• Symptoms after emotional stress or minor injury</td>
                  <td className="border border-pink-200 p-1">• Normal DTRs in flaccid extremities<br/>• Give-way weakness<br/>• Implausible presentations</td>
                  <td className="border border-pink-200 p-1">No abnormality</td>
                  <td className="border border-pink-200 p-1 font-medium text-amber-700">Psychiatry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-2"></div>

        {/* When to Contact Sections */}
        <div className="grid grid-cols-1 gap-2">
          {/* When to contact Neurology */}
          <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
            <p className="text-[10px] font-bold text-blue-700 mb-1">When to contact neurology oncall?</p>
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 bg-pink-200 rounded-full flex items-center justify-center text-[8px] font-bold text-pink-700 flex-shrink-0">A</span>
                <p className="text-[9px] text-gray-700 dark:text-gray-300">CT showing stroke for further management</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 bg-pink-200 rounded-full flex items-center justify-center text-[8px] font-bold text-pink-700 flex-shrink-0">B</span>
                <p className="text-[9px] text-gray-700 dark:text-gray-300">If clinical picture suggests transverse myelitis vs. GBS as neurologist has to enter request for emergency MRI</p>
              </div>
            </div>
          </div>

          {/* When to contact PICU */}
          <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
            <p className="text-[10px] font-bold text-red-700 mb-1">When to contact PICU?</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              <div className="flex items-start gap-1">
                <span className="w-4 h-4 bg-pink-200 rounded-full flex items-center justify-center text-[8px] font-bold text-pink-700 flex-shrink-0">A</span>
                <p className="text-[8px] text-gray-700 dark:text-gray-300">Any alteration in LOC (CO2 retention or brain insult)</p>
              </div>
              <div className="flex items-start gap-1">
                <span className="w-4 h-4 bg-pink-200 rounded-full flex items-center justify-center text-[8px] font-bold text-pink-700 flex-shrink-0">B</span>
                <p className="text-[8px] text-gray-700 dark:text-gray-300">Weak respiratory effort</p>
              </div>
              <div className="flex items-start gap-1">
                <span className="w-4 h-4 bg-pink-200 rounded-full flex items-center justify-center text-[8px] font-bold text-pink-700 flex-shrink-0">C</span>
                <p className="text-[8px] text-gray-700 dark:text-gray-300">Blood gas showing CO2 retention</p>
              </div>
              <div className="flex items-start gap-1">
                <span className="w-4 h-4 bg-pink-200 rounded-full flex items-center justify-center text-[8px] font-bold text-pink-700 flex-shrink-0">D</span>
                <p className="text-[8px] text-gray-700 dark:text-gray-300">Fast ascending paralysis within hours</p>
              </div>
              <div className="flex items-start gap-1">
                <span className="w-4 h-4 bg-pink-200 rounded-full flex items-center justify-center text-[8px] font-bold text-pink-700 flex-shrink-0">E</span>
                <p className="text-[8px] text-gray-700 dark:text-gray-300">Hoarseness of voice</p>
              </div>
              <div className="flex items-start gap-1">
                <span className="w-4 h-4 bg-pink-200 rounded-full flex items-center justify-center text-[8px] font-bold text-pink-700 flex-shrink-0">F</span>
                <p className="text-[8px] text-gray-700 dark:text-gray-300">Drooling</p>
              </div>
              <div className="flex items-start gap-1 col-span-2">
                <span className="w-4 h-4 bg-pink-200 rounded-full flex items-center justify-center text-[8px] font-bold text-pink-700 flex-shrink-0">G</span>
                <p className="text-[8px] text-gray-700 dark:text-gray-300">Swallowing incoordination</p>
              </div>
            </div>
          </div>
        </div>

        {/* Remember Note */}
        <div className="p-2 bg-amber-100 dark:bg-amber-950/40 rounded-lg border-2 border-amber-300">
          <p className="text-[9px] font-bold text-amber-700 mb-0.5">REMEMBER:</p>
          <p className="text-[8px] text-amber-600">
            In weakness, no clear signs of respiratory distress would be seen. These patients are <strong>CO2 retainers</strong>. They can have <strong>normal SpO2 while retaining CO2</strong>. Usually SpO2 does not change until very late.
          </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default WeaknessApproach;
