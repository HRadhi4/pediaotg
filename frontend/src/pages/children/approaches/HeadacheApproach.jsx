/**
 * Pediatric Headache Approach - Complete Version
 * Based on user-provided clinical algorithm and tables
 * Contains: Main flowchart, 7 tables, IIH section, fundoscopy images
 * Backup saved at: HeadacheApproach.jsx.backup
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HeadacheApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pediatric Headache Approach</CardTitle>
        <CardDescription className="text-xs">Complete algorithm with diagnosis and management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Starting Instruction */}
        <div className="p-2 bg-purple-100 dark:bg-purple-950/40 rounded-lg text-center">
          <p className="text-[10px] font-bold text-purple-700">
            Start by taking history and thorough physical examination whilst paying close attention to presence of red flags (Table 1)
          </p>
        </div>

        {/* MAIN ALGORITHM FLOWCHART */}
        <div className="p-2 bg-gradient-to-b from-orange-50 to-gray-50 dark:from-orange-950/20 dark:to-gray-900 rounded-xl">
          
          {/* Duration of Headache */}
          <div className="flex justify-center mb-2">
            <div className="px-4 py-2 bg-orange-400 text-white rounded-full text-[11px] font-bold shadow">
              Duration of Headache
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center mb-1">
            <div className="flex items-end">
              <div className="w-20 h-0.5 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-20 h-0.5 bg-gray-400"></div>
            </div>
          </div>

          {/* Acute vs Chronic */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            {/* ACUTE BRANCH */}
            <div className="space-y-1">
              <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-center">
                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Acute ≤7 days</p>
              </div>
              <div className="flex justify-center">
                <div className="flex items-end">
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                </div>
              </div>
              {/* 1st Onset vs Episodic */}
              <div className="grid grid-cols-2 gap-1">
                <div className="text-center">
                  <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded text-[9px] font-medium">1st Onset</div>
                  <div className="flex justify-center">
                    <div className="flex items-end">
                      <div className="w-6 h-0.5 bg-gray-400"></div>
                      <div className="w-0.5 h-2 bg-gray-400"></div>
                      <div className="w-6 h-0.5 bg-gray-400"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-0.5 mt-0.5">
                    <div className="text-center">
                      <div className="p-0.5 bg-black text-white rounded text-[7px] font-bold">RED FLAGS +VE</div>
                      <div className="flex justify-center mt-0.5">
                        <div className="w-0.5 h-2 bg-gray-400"></div>
                      </div>
                      <div className="p-1 bg-gray-300 dark:bg-gray-600 rounded text-[8px] font-bold">CT SCAN BRAIN</div>
                    </div>
                    <div className="text-center">
                      <div className="p-0.5 bg-black text-white rounded text-[7px] font-bold">RED FLAGS -VE</div>
                      <div className="flex justify-center mt-0.5">
                        <div className="w-0.5 h-2 bg-gray-400"></div>
                      </div>
                      <div className="p-1 bg-amber-200 dark:bg-amber-800 rounded text-[8px] font-bold text-amber-800 dark:text-amber-200">Refer to Table 2</div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded text-[9px] font-medium">Episodic</div>
                  <div className="flex justify-center">
                    <div className="flex items-end">
                      <div className="w-6 h-0.5 bg-gray-400"></div>
                      <div className="w-0.5 h-2 bg-gray-400"></div>
                      <div className="w-6 h-0.5 bg-gray-400"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-0.5 mt-0.5">
                    <div className="text-center">
                      <div className="p-0.5 bg-black text-white rounded text-[7px] font-bold">RED FLAGS +VE</div>
                      <div className="flex justify-center mt-0.5">
                        <div className="w-0.5 h-2 bg-gray-400"></div>
                      </div>
                      <div className="p-1 bg-gray-300 dark:bg-gray-600 rounded text-[8px] font-bold">CT SCAN BRAIN</div>
                    </div>
                    <div className="text-center">
                      <div className="p-0.5 bg-black text-white rounded text-[7px] font-bold">RED FLAGS -VE</div>
                      <div className="flex justify-center mt-0.5">
                        <div className="w-0.5 h-2 bg-gray-400"></div>
                      </div>
                      <div className="p-1 bg-amber-200 dark:bg-amber-800 rounded text-[8px] font-bold text-amber-800 dark:text-amber-200">Refer to Table 2 & 3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CHRONIC BRANCH */}
            <div className="space-y-1">
              <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-center">
                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Chronic &gt;7 days</p>
              </div>
              <div className="flex justify-center">
                <div className="flex items-end">
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {/* RED FLAGS +VE */}
                <div className="text-center">
                  <div className="p-0.5 bg-black text-white rounded text-[7px] font-bold">RED FLAGS +VE</div>
                  <div className="flex justify-center mt-0.5">
                    <div className="w-0.5 h-2 bg-gray-400"></div>
                  </div>
                  <div className="p-1 bg-gray-300 dark:bg-gray-600 rounded text-[8px] font-bold">CT SCAN BRAIN</div>
                </div>
                {/* RED FLAGS -VE */}
                <div className="text-center">
                  <div className="p-0.5 bg-black text-white rounded text-[7px] font-bold">RED FLAGS -VE</div>
                  <div className="flex justify-center mt-0.5">
                    <div className="w-0.5 h-2 bg-gray-400"></div>
                  </div>
                  <div className="p-1 bg-blue-200 dark:bg-blue-800 rounded text-[7px] font-medium text-blue-800 dark:text-blue-200">
                    Consult Ophthalmology<br/>(check for papilledema)
                  </div>
                  <div className="flex justify-center mt-0.5">
                    <div className="flex items-end">
                      <div className="w-6 h-0.5 bg-gray-400"></div>
                      <div className="w-0.5 h-2 bg-gray-400"></div>
                      <div className="w-6 h-0.5 bg-gray-400"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-0.5 mt-0.5">
                    <div className="p-1 bg-purple-200 dark:bg-purple-800 rounded text-[6px]">
                      <p className="font-bold text-purple-800 dark:text-purple-200">PAPILLEDEMA</p>
                      <p className="text-purple-700 dark:text-purple-300">Admit for IIH treatment</p>
                    </div>
                    <div className="p-1 bg-orange-200 dark:bg-orange-800 rounded text-[6px]">
                      <p className="font-bold text-orange-800 dark:text-orange-200">NO PAPILLEDEMA</p>
                      <p className="text-orange-700 dark:text-orange-300">Neurology + admit for workup</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CT Findings Branch */}
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border mt-2">
            <p className="text-[9px] font-bold text-center mb-1">CT Scan Results</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="p-1 bg-green-100 rounded text-[8px] font-bold text-green-700">+VE FINDINGS</div>
                <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
                <div className="p-1 bg-teal-100 rounded text-[8px] text-teal-700">
                  Refer to Page 7 CT scan brain imaging findings
                </div>
              </div>
              <div className="text-center">
                <div className="p-1 bg-red-100 rounded text-[8px] font-bold text-red-700">-VE FINDINGS</div>
                <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
                <div className="p-1 bg-blue-100 rounded text-[8px] text-blue-700">
                  Refer to Table 2 & Table 3
                </div>
                <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <div className="p-1 bg-teal-200 rounded text-[7px]">
                    <p className="font-bold">Other Diagnosis</p>
                    <p>Treat accordingly (non-neurological causes)</p>
                  </div>
                  <div className="p-1 bg-teal-200 rounded text-[7px]">
                    <p className="font-bold">Migraine/Tension Headache</p>
                    <p>PRN NSAIDs (Table 4) + Appointment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE 1: RED FLAGS */}
        <div className="p-2 bg-teal-100 dark:bg-teal-950/40 rounded-lg">
          <p className="text-xs font-bold text-teal-800 mb-1 flex items-center gap-1">
            <span className="text-red-500">🚩</span> TABLE 1 - RED FLAGS
          </p>
          <ol className="text-[9px] text-teal-700 space-y-0.5 list-decimal list-inside">
            <li>Early morning or night headache.</li>
            <li>Progressive headache in frequency, duration or severity.</li>
            <li>Neurologic signs and symptoms: altered mental status, gait abnormality, seizures.</li>
            <li>Papilledema. (Image 1)</li>
          </ol>
        </div>

        {/* IMAGE 1: FUNDOSCOPY */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">IMAGE 1 - FUNDOSCOPY</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-red-200 rounded-full flex items-center justify-center border-2 border-red-300">
                <div className="text-[8px] text-red-700 font-medium">blurred disk margins</div>
              </div>
              <p className="text-[9px] font-bold mt-1 text-red-600">Papilledema</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-300">
                <div className="text-[8px] text-orange-700 font-medium">sharp disk margins</div>
              </div>
              <p className="text-[9px] font-bold mt-1 text-green-600">Normal Optic Disk</p>
            </div>
          </div>
        </div>

        {/* TABLE 2: Non-Neurological Differentials */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 2 - SOME NON-NEUROLOGICAL DIFFERENTIALS OF HEADACHE</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[450px] border-collapse">
              <thead>
                <tr className="bg-amber-100 dark:bg-amber-900/30">
                  <th className="border border-amber-300 p-1 text-left font-semibold">Differential Diagnosis</th>
                  <th className="border border-amber-300 p-1 text-left font-semibold">Key point in history</th>
                  <th className="border border-amber-300 p-1 text-left font-semibold">Key point in examination</th>
                  <th className="border border-amber-300 p-1 text-left font-semibold">Special investigations</th>
                  <th className="border border-amber-300 p-1 text-left font-semibold">Specialty involved</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-amber-200 p-1 font-medium">URTI</td>
                  <td className="border border-amber-200 p-1">Cough, nasal congestion, rhinorrhea, sore throat</td>
                  <td className="border border-amber-200 p-1">post-nasal drip, pharyngitis, tonsillitis</td>
                  <td className="border border-amber-200 p-1">-</td>
                  <td className="border border-amber-200 p-1">General pediatrics</td>
                </tr>
                <tr className="bg-amber-50 dark:bg-amber-950/20">
                  <td className="border border-amber-200 p-1 font-medium">Sinusitis</td>
                  <td className="border border-amber-200 p-1">Increase with position</td>
                  <td className="border border-amber-200 p-1">Facial tenderness</td>
                  <td className="border border-amber-200 p-1">CT scan brain</td>
                  <td className="border border-amber-200 p-1">ENT</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-amber-200 p-1 font-medium">Otitis media</td>
                  <td className="border border-amber-200 p-1">Ear pain/ tugging</td>
                  <td className="border border-amber-200 p-1">Erythematous tympanic membrane</td>
                  <td className="border border-amber-200 p-1">-</td>
                  <td className="border border-amber-200 p-1">General pediatrics</td>
                </tr>
                <tr className="bg-amber-50 dark:bg-amber-950/20">
                  <td className="border border-amber-200 p-1 font-medium">Meningitis</td>
                  <td className="border border-amber-200 p-1">Fever, photophobia</td>
                  <td className="border border-amber-200 p-1">Neck rigidity, +ve Kernig & Brudzinski signs</td>
                  <td className="border border-amber-200 p-1">LP</td>
                  <td className="border border-amber-200 p-1">General pediatrics/ ID</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-amber-200 p-1 font-medium">Refractive errors</td>
                  <td className="border border-amber-200 p-1">Reduced visual acuity</td>
                  <td className="border border-amber-200 p-1">Snellen chart</td>
                  <td className="border border-amber-200 p-1">-</td>
                  <td className="border border-amber-200 p-1">Ophthalmology</td>
                </tr>
                <tr className="bg-amber-50 dark:bg-amber-950/20">
                  <td className="border border-amber-200 p-1 font-medium">Dental caries</td>
                  <td className="border border-amber-200 p-1">Tooth pain</td>
                  <td className="border border-amber-200 p-1">Visualization of teeth involvement</td>
                  <td className="border border-amber-200 p-1">-</td>
                  <td className="border border-amber-200 p-1">Dental</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-amber-200 p-1 font-medium">Malignant HTN</td>
                  <td className="border border-amber-200 p-1">Underlying risk factors</td>
                  <td className="border border-amber-200 p-1">High BP</td>
                  <td className="border border-amber-200 p-1">CT Scan brain</td>
                  <td className="border border-amber-200 p-1">Nephrology</td>
                </tr>
                <tr className="bg-amber-50 dark:bg-amber-950/20">
                  <td className="border border-amber-200 p-1 font-medium">Psychogenic</td>
                  <td className="border border-amber-200 p-1">By exclusion</td>
                  <td className="border border-amber-200 p-1">Normal</td>
                  <td className="border border-amber-200 p-1">-</td>
                  <td className="border border-amber-200 p-1">Psychiatry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-[8px] text-amber-700">
            <strong>Notes:</strong> Episodic headaches sometimes occur but if history not taken properly, it might be confused as 1st onset headache. Majority of 1st onset headache is non-neurological in etiology however it could be a 1st attack of migraine/tension headache but never label someone as migraine/tension headache with 1st attack.
          </p>
        </div>

        {/* TABLE 3: Migraine vs Tension */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 3 - COMPARISON BETWEEN MIGRAINE & TENSION HEADACHE</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[350px] border-collapse">
              <thead>
                <tr className="bg-orange-200 dark:bg-orange-900/40">
                  <th className="border border-orange-300 p-1 text-left font-semibold">Headache</th>
                  <th className="border border-orange-300 p-1 text-center font-semibold">Migraine</th>
                  <th className="border border-orange-300 p-1 text-center font-semibold">Tension</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1 font-medium">Location</td>
                  <td className="border border-orange-200 p-1 text-center">Unilateral or Bilateral (commonly)</td>
                  <td className="border border-orange-200 p-1 text-center">Frontal</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-950/20">
                  <td className="border border-orange-200 p-1 font-medium">Timing</td>
                  <td className="border border-orange-200 p-1 text-center">-</td>
                  <td className="border border-orange-200 p-1 text-center">Evening</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1 font-medium">Duration</td>
                  <td className="border border-orange-200 p-1 text-center">Attack lasts 2 to 72 hours</td>
                  <td className="border border-orange-200 p-1 text-center">Attack lasts hours to days</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-950/20">
                  <td className="border border-orange-200 p-1 font-medium">Associations</td>
                  <td className="border border-orange-200 p-1 text-center">Nausea &/or vomiting, photophobia, phonophobia, aura (rare)</td>
                  <td className="border border-orange-200 p-1 text-center">None</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1 font-medium">Triggering factors</td>
                  <td className="border border-orange-200 p-1 text-center">Activity</td>
                  <td className="border border-orange-200 p-1 text-center">Stress</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-950/20">
                  <td className="border border-orange-200 p-1 font-medium">Relieving factors</td>
                  <td className="border border-orange-200 p-1 text-center">Quiet dark room</td>
                  <td className="border border-orange-200 p-1 text-center">Rest</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1 font-medium">Family history</td>
                  <td className="border border-orange-200 p-1 text-center">Yes</td>
                  <td className="border border-orange-200 p-1 text-center">No</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-950/20">
                  <td className="border border-orange-200 p-1 font-medium">Characteristic</td>
                  <td className="border border-orange-200 p-1 text-center">Pulsating/pounding/throbbing</td>
                  <td className="border border-orange-200 p-1 text-center">Squeezing/pressure-like</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1 font-medium">Severity</td>
                  <td className="border border-orange-200 p-1 text-center">Moderate - severe</td>
                  <td className="border border-orange-200 p-1 text-center">Mild - moderate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 4: Acute Management of Migraines */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 4 - ACUTE MANAGEMENT OF MIGRAINES</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[350px] border-collapse">
              <thead>
                <tr className="bg-orange-200 dark:bg-orange-900/40">
                  <th className="border border-orange-300 p-1 text-left font-semibold">Classification</th>
                  <th className="border border-orange-300 p-1 text-center font-semibold">Dose</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1 font-medium">Analgesics 1) Oral: Paracetamol</td>
                  <td className="border border-orange-200 p-1 text-center">
                    10-15mg/kg/dose
                    {w > 0 && <span className="block font-mono text-green-600">{(w*10).toFixed(0)}-{(w*15).toFixed(0)} mg</span>}
                  </td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-950/20">
                  <td className="border border-orange-200 p-1 font-medium">Ibuprofen</td>
                  <td className="border border-orange-200 p-1 text-center">
                    5-10mg/kg/dose
                    {w > 0 && <span className="block font-mono text-green-600">{(w*5).toFixed(0)}-{(w*10).toFixed(0)} mg</span>}
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1 font-medium">Naproxen</td>
                  <td className="border border-orange-200 p-1 text-center">
                    5-7mg/kg/dose
                    {w > 0 && <span className="block font-mono text-green-600">{(w*5).toFixed(0)}-{(w*7).toFixed(0)} mg</span>}
                  </td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-950/20">
                  <td className="border border-orange-200 p-1 font-medium">2) IV: Perfalgan</td>
                  <td className="border border-orange-200 p-1 text-center">
                    10-15mg/kg/dose
                    {w > 0 && <span className="block font-mono text-green-600">{(w*10).toFixed(0)}-{(w*15).toFixed(0)} mg</span>}
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1" colSpan="2">
                    <p className="font-medium">Selective Serotonin Receptor Agonists (SSRIs) - Triptans</p>
                    <p className="text-[7px] text-red-600 italic">Rarely used in pediatrics, better to avoid unless advised by neurologist</p>
                  </td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-950/20">
                  <td className="border border-orange-200 p-1 font-medium pl-4">1) Oral</td>
                  <td className="border border-orange-200 p-1 text-center">Children &gt;10 years and adolescents: 25mg STAT</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1 font-medium pl-4">2) Intranasal</td>
                  <td className="border border-orange-200 p-1 text-center">Children 5-12yrs: 5mg, 10mg or 20mg STAT,<br/>Children &gt;12yrs and adolescents: 10mg or 20mg STAT</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-950/20">
                  <td className="border border-orange-200 p-1 font-medium pl-4">3) Subcutaneous</td>
                  <td className="border border-orange-200 p-1 text-center">Children &gt;6yrs and adolescents: 3-6mg STAT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IIH Section */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1 bg-black text-white inline-block px-2 rounded">IDIOPATHIC INTRACRANIAL HYPERTENSION</p>
          <p className="text-[9px] text-gray-600 dark:text-gray-400 mb-1">
            <strong>Previously called pseudomotor cerebri</strong><br/>
            (In order to admit: neurologist has to be called)
          </p>
          <div className="space-y-1 text-[8px] text-gray-700 dark:text-gray-300">
            <p><strong>Etiology:</strong> unknown, but there is association with:</p>
            <ul className="list-disc list-inside ml-2">
              <li>Some medications (tetracycline, vitamin A, oral contraceptives)</li>
              <li>Endocrine disturbances (thyroid disease, Addison disease)</li>
              <li>Rapid weight gain, overweight</li>
            </ul>
            <p><strong>Clinical features:</strong></p>
            <ul className="list-disc list-inside ml-2">
              <li>Present with daily debilitating headache associated with: diplopia and transient visual obscurations</li>
              <li>If untreated, permanent visual field loss may develop</li>
            </ul>
            <p><strong>Examination:</strong></p>
            <ul className="list-disc list-inside ml-2">
              <li>Abducent nerve palsy</li>
              <li>Papilledema</li>
            </ul>
            <p><strong>Investigations:</strong></p>
            <ul className="list-disc list-inside ml-2">
              <li>LP with opening CSF pressure (using manometer, see image 2), send CSF for biochemistry, cell count, c/s, store one extra CSF sample for possible further investigations.</li>
              <li>TFT</li>
              <li>Visual field perimetry (Look at image 3)</li>
              <li>Later on consultant will request brain MRI and MRV (not urgent)</li>
            </ul>
            <p><strong>Diagnosis:</strong></p>
            <p className="ml-2">Direct measurement of ICP: CSF pressure &gt; 25 cm in absence of other CSF abnormalities.</p>
            <p><strong>Management:</strong></p>
            <ul className="list-disc list-inside ml-2">
              <li>Refer to Table 6 for medications</li>
              <li>Weight loss and cessation of triggering medications</li>
            </ul>
          </div>
        </div>

        {/* TABLE 5: Chronic Management of Migraines */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 5 - CHRONIC MANAGEMENT OF MIGRAINES</p>
          <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg mb-1">
            <p className="text-[8px] font-bold text-purple-700">Criteria for starting migraine prophylaxis:</p>
            <ul className="text-[7px] text-purple-600 list-disc list-inside">
              <li>Headache frequency at least one headache/week or more than three headaches/month</li>
              <li>Prolonged and severe headaches, even if infrequent</li>
              <li>Headache in which abortive treatment fails, overused or is contraindicated in the child</li>
            </ul>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[450px] border-collapse">
              <thead>
                <tr className="bg-purple-200 dark:bg-purple-900/40">
                  <th className="border border-purple-300 p-1 text-left font-semibold">Classification</th>
                  <th className="border border-purple-300 p-1 text-center font-semibold">Dose</th>
                  <th className="border border-purple-300 p-1 text-center font-semibold">Side effects</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 font-medium">Antihypertensives:<br/>1) Propranolol</td>
                  <td className="border border-purple-200 p-1 text-center">&lt;35kg: 10-20mg TDS<br/>≥35kg: 20-40mg TDS</td>
                  <td className="border border-purple-200 p-1">Fatigue, dizziness, hypoglycemia, hypotension, nausea, vomiting, heart block, depression, impotence, bronchospasm, hyperkalemia</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 font-medium">2) Flunarizine</td>
                  <td className="border border-purple-200 p-1 text-center">5-10mg HS</td>
                  <td className="border border-purple-200 p-1">Fatigue, drowsiness, weight gain, GI disturbance, depression</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 font-medium">Antiepileptics:<br/>1) Topiramate</td>
                  <td className="border border-purple-200 p-1 text-center">1-10mg/kg/day{w > 0 && <><br/><span className="font-mono text-green-600">{(w*1).toFixed(0)}-{(w*10).toFixed(0)} mg/d</span></>}</td>
                  <td className="border border-purple-200 p-1">Paresthesia, somnolence, metabolic acidosis, cognitive dysfunction</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 font-medium">2) Valproate</td>
                  <td className="border border-purple-200 p-1 text-center">15-30mg/kg/day BD<br/>(Max. 1g/day){w > 0 && <><br/><span className="font-mono text-green-600">{Math.min(w*15, 1000).toFixed(0)}-{Math.min(w*30, 1000).toFixed(0)} mg/d</span></>}</td>
                  <td className="border border-purple-200 p-1">Somnolence, tremor, alopecia, weight gain, hyperammonemia, polycystic ovary syndrome</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-purple-200 p-1 font-medium">Antihistamines:<br/>Cyproheptadine</td>
                  <td className="border border-purple-200 p-1 text-center">0.25-0.4mg/kg/day BD-TDS<br/>(Max. for 2-6yrs: 12mg/day,<br/>Max. for 7-14yrs: 16mg/day)</td>
                  <td className="border border-purple-200 p-1">Drowsiness, fatigue, increased appetite, weight gain</td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/20">
                  <td className="border border-purple-200 p-1 font-medium">Tricyclic Antidepressants:<br/>Amitriptyline</td>
                  <td className="border border-purple-200 p-1 text-center">0.1-0.25mg/kg/dose HS<br/>(If dose &gt;1mg/kg/day divide to BD)<br/>Max. 2mg/kg/day</td>
                  <td className="border border-purple-200 p-1">Sedation, urinary retention, constipation, dizziness, drowsiness, arrhythmias, LFT derangements</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 6: Treatment for IIH */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 6 - TREATMENT FOR IIH (AKA PSEUDOMOTOR CEREBRI)</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[350px] border-collapse">
              <thead>
                <tr className="bg-pink-200 dark:bg-pink-900/40">
                  <th className="border border-pink-300 p-1 text-left font-semibold">Medication</th>
                  <th className="border border-pink-300 p-1 text-center font-semibold">Dose</th>
                  <th className="border border-pink-300 p-1 text-center font-semibold">Side effects</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-pink-200 p-1 font-medium">Acetazolamide (Oral)</td>
                  <td className="border border-pink-200 p-1 text-center">
                    <p><strong>Children:</strong> start with 25mg/kg/day (OD-QID). Increase by 25mg/kg/day until clinical response (Max 100mg/kg/day)</p>
                    {w > 0 && <p className="font-mono text-green-600">Start: {(w*25).toFixed(0)} mg/d<br/>Max: {(w*100).toFixed(0)} mg/d</p>}
                    <p className="mt-1"><strong>Adolescents:</strong> start with 1g/day (OD-QID). Increase by 250mg/day until clinical response (Max 4g/day)</p>
                  </td>
                  <td className="border border-pink-200 p-1">GI irritation, paresthesia, sedation, hypokalemia, acidosis, aplastic anemia, polyuria, decreased urate secretion, renal stones</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IMAGE 4: Visual Field Perimetry */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">IMAGE 4 - POSSIBLE VISUAL FIELD PERIMETRY ABNORMALITIES IN IIH</p>
          <div className="grid grid-cols-4 gap-1">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-200 rounded border flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
              </div>
              <p className="text-[7px] mt-0.5">Normal visual field</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-200 rounded border flex items-center justify-center">
                <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
              </div>
              <p className="text-[7px] mt-0.5">Enlarged blind spot</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-200 rounded border flex items-center justify-center relative">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                <div className="absolute right-1 top-3 w-3 h-6 bg-gray-200"></div>
              </div>
              <p className="text-[7px] mt-0.5">Nasal step</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-200 rounded border flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
              </div>
              <p className="text-[7px] mt-0.5">Constricted visual field</p>
            </div>
          </div>
        </div>

        {/* TABLE 7: Migraine Variants */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">TABLE 7 - MIGRAINE VARIANTS</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[450px] border-collapse">
              <thead>
                <tr className="bg-orange-200 dark:bg-orange-900/40">
                  <th className="border border-orange-300 p-1 text-center font-semibold">Classic Migraine</th>
                  <th className="border border-orange-300 p-1 text-center font-semibold">Migraine with Aura</th>
                  <th className="border border-orange-300 p-1 text-center font-semibold">Migraine Equivalent</th>
                  <th className="border border-orange-300 p-1 text-center font-semibold">Ophthalmoplegic Migraine</th>
                  <th className="border border-orange-300 p-1 text-center font-semibold">Basilar artery Migraine</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-orange-200 p-1 text-center">
                    Occurs w/o aura.<br/>
                    Bilateral commonly.<br/>
                    Associated with nausea/vomiting, photophobia/phonophobia.
                  </td>
                  <td className="border border-orange-200 p-1 text-center">
                    Onset is preceded by transient visual changes (blurred vision, scotomata, streaks of light, hemianopsia) or transient unilateral paresthesia or weakness (can be called hemiplegic migraine)
                  </td>
                  <td className="border border-orange-200 p-1 text-center">
                    Absent headache, with prolonged & transient manifestations such as cyclic vomiting, cyclic abdominal pain, or paroxysmal vertigo
                  </td>
                  <td className="border border-orange-200 p-1 text-center">
                    Headache accompanied with unilateral ptosis or cranial nerve III palsy
                  </td>
                  <td className="border border-orange-200 p-1 text-center">
                    Headache preceded by vertigo, tinnitus, ataxia, or dysarthria
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HeadacheApproach;
