/**
 * Pediatric Abnormal Gait Approach - Complete Version
 * Based on user-provided clinical algorithm and tables
 * Backup saved at: GaitApproach.jsx.backup
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const GaitApproach = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Acute Abnormal Gait Guidelines</CardTitle>
        <CardDescription className="text-xs">Algorithm with gait identification and management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* MAIN ALGORITHM */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/30 dark:to-gray-900 rounded-xl">
          
          {/* Step 1: Identify the gait */}
          <div className="flex justify-center mb-2">
            <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full text-[10px] font-medium text-gray-700 dark:text-gray-300">
              Identify the gait → <span className="text-blue-600 font-bold">Look at Table 1</span>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-2 bg-gray-300 dark:bg-gray-600 rounded text-[9px] text-center font-medium text-gray-800 dark:text-gray-200 mb-2">
            Note: <strong>hemiplegic gait, waddling gait, neuropathic gait are not acute</strong>
          </div>

          {/* Three Gait Branches */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            {/* Limping */}
            <div className="text-center">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded text-[10px] font-bold text-blue-700 mb-1">
                Limping gait
              </div>
              <div className="w-0.5 h-3 bg-blue-400 mx-auto"></div>
              <div className="p-1.5 bg-white dark:bg-gray-800 border border-blue-300 rounded text-[8px] text-gray-600">
                Pain<br/>(non-neurological)
              </div>
            </div>

            {/* Ataxia */}
            <div className="text-center">
              <div className="p-1.5 bg-gray-200 dark:bg-gray-600 rounded text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">
                Ataxia gait
              </div>
              <div className="p-1 bg-red-500 text-white rounded text-[7px] font-medium mb-1">
                Do not label anyone to have ataxia unless afebrile and has full level of consciousness
              </div>
            </div>

            {/* Bizarre */}
            <div className="text-center">
              <div className="p-1.5 bg-gray-200 dark:bg-gray-600 rounded text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">
                Bizarre gait
              </div>
              <div className="w-0.5 h-3 bg-gray-400 mx-auto"></div>
              <div className="p-1.5 bg-white dark:bg-gray-800 border border-gray-300 rounded text-[8px] text-gray-600">
                Non-neurological
              </div>
            </div>
          </div>

          {/* Ataxia CT Brain Branch */}
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 mb-2">
            <p className="text-[9px] font-bold text-center text-gray-700 dark:text-gray-300 mb-2">For Ataxia → CT Brain</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded text-[9px] font-bold text-green-700 mb-1">
                  Normal CT Brain
                </div>
                <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
                <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded text-[8px] text-blue-700">
                  Non neurological causes<br/><strong>Table 2</strong>
                </div>
                <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
                <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded text-[8px] text-gray-600">
                  Refer to specialty<br/>according to table 2
                </div>
              </div>
              <div className="text-center">
                <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded text-[9px] font-bold text-red-700 mb-1">
                  Abnormal CT Brain
                </div>
                <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
                <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded text-[8px] text-red-700 font-medium">
                  Refer to neurosurgery
                </div>
              </div>
            </div>
          </div>

          {/* Unclear Non-neurological Cause */}
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-[9px] font-bold text-center text-gray-700 dark:text-gray-300 mb-1">Unclear Non neurological cause</p>
            <div className="flex justify-center mb-1">
              <div className="p-1 bg-white dark:bg-gray-800 border border-blue-300 rounded text-[8px] text-center">
                Positive Romberg<br/>(neurological)?
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded text-center">
                <p className="text-[8px] font-bold text-green-700">No</p>
                <p className="text-[7px] text-green-600">Discharge with early clinic review within 1wk</p>
              </div>
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                <p className="text-[8px] font-bold text-blue-700">Yes</p>
                <p className="text-[7px] text-blue-600">Inform neurologist oncall</p>
              </div>
            </div>
          </div>
        </div>

        {/* GBS Note */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-[9px] text-amber-700">
            <strong>Note:</strong> GBS can present with sensory ataxia, but it is rare and usually associated with neuropathic pain at the feet, sometimes without acute weakness.
          </p>
        </div>

        {/* TABLE 1: Recognize type of gait */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Table 1: Recognize type of gait</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[450px] border-collapse">
              <thead>
                <tr className="bg-blue-100 dark:bg-blue-900/30">
                  <th className="border border-blue-200 p-1 text-left font-semibold w-[12%]">Type of gait</th>
                  <th className="border border-blue-200 p-1 text-left font-semibold w-[22%]">Key point in history</th>
                  <th className="border border-blue-200 p-1 text-left font-semibold w-[24%]">Key point in examination</th>
                  <th className="border border-blue-200 p-1 text-left font-semibold w-[20%]">Key point in investigation</th>
                  <th className="border border-blue-200 p-1 text-left font-semibold w-[22%]">Specialty involved</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-blue-200 p-1 font-medium">Limping</td>
                  <td className="border border-blue-200 p-1">• Musculoskeletal pain<br/>• Joint pain<br/>• Trauma</td>
                  <td className="border border-blue-200 p-1">• Avoid bearing on affected side<br/>• Smaller child may just refuse to walk<br/>• Limited range of movement<br/>• Tenderness with passive examination</td>
                  <td className="border border-blue-200 p-1">• High CRP and ESR<br/>• X-ray: fracture<br/>• US joint: effusion</td>
                  <td className="border border-blue-200 p-1">• Orthopedics<br/>• Rheumatology<br/>• Others</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-blue-200 p-1 font-medium">Ataxia</td>
                  <td className="border border-blue-200 p-1">• History of viral infection<br/>• Sudden inability to coordinate muscle movement</td>
                  <td className="border border-blue-200 p-1">• Patient will not be able to walk heel to toe or in a straight line<br/>• Tremors<br/>• Wide based gait</td>
                  <td className="border border-blue-200 p-1">• CT Scan</td>
                  <td className="border border-blue-200 p-1">• Normal CT: <strong>Neurology</strong><br/>• Abnormal CT (Table 3): <strong>Neurosurgery</strong></td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-blue-200 p-1 font-medium">Waddling</td>
                  <td className="border border-blue-200 p-1">• Truncal<br/>• Delay gross milestones<br/>• +/- Family history</td>
                  <td className="border border-blue-200 p-1">• Gower sign</td>
                  <td className="border border-blue-200 p-1">• High CK</td>
                  <td className="border border-blue-200 p-1">• Neurology</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-blue-200 p-1 font-medium">Neuropathic</td>
                  <td className="border border-blue-200 p-1">• Abnormal or loss of sensation in the hands and feet</td>
                  <td className="border border-blue-200 p-1">• High Steppage gait (Toes always touching ground while heel elevated)</td>
                  <td className="border border-blue-200 p-1">-</td>
                  <td className="border border-blue-200 p-1">• Neurology<br/>• Orthopedics</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-blue-200 p-1 font-medium">Hemiplegic</td>
                  <td className="border border-blue-200 p-1">• Birth asphyxia<br/>• Prematurity</td>
                  <td className="border border-blue-200 p-1">• Weakness of muscles or stiffness on one side of the body<br/>• UMNL signs (Hyperreflexia, Babinski +ve)</td>
                  <td className="border border-blue-200 p-1">• CT scan: Hemispheric asymmetry</td>
                  <td className="border border-blue-200 p-1">• Neurology</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-blue-200 p-1 font-medium">Malingering</td>
                  <td className="border border-blue-200 p-1">• Absence of all above mentioned point<br/>• Psychogenic<br/>• Stressful event</td>
                  <td className="border border-blue-200 p-1">• Normal</td>
                  <td className="border border-blue-200 p-1">• All Normal</td>
                  <td className="border border-blue-200 p-1">• Psychology</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Think of non-neurological cause */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-[9px] text-blue-700">
            <strong>Think of non-neurological cause if patient present with:</strong> fever, decrease of consciousness, trauma, headaches, on certain medications, ear pain
          </p>
        </div>

        {/* TABLE 2: Non neurological cause of ataxia */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Table 2: Non neurological cause of ataxia</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[400px] border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 p-1 text-left font-semibold w-[15%]">Differentials</th>
                  <th className="border border-gray-300 p-1 text-left font-semibold w-[22%]">Key point in history</th>
                  <th className="border border-gray-300 p-1 text-left font-semibold w-[25%]">Key point in examination</th>
                  <th className="border border-gray-300 p-1 text-left font-semibold w-[20%]">Key point in investigation</th>
                  <th className="border border-gray-300 p-1 text-left font-semibold w-[18%]">Specialty involved</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-300 p-1 font-medium">Cerebellar Tumor</td>
                  <td className="border border-gray-300 p-1">• Headaches<br/>• Vomiting</td>
                  <td className="border border-gray-300 p-1">• Papilledema<br/>• Focal neurological deficits</td>
                  <td className="border border-gray-300 p-1">• CT scan: Tumor<br/>Table 3</td>
                  <td className="border border-gray-300 p-1">• Oncology<br/>• Neurosurgery</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-300 p-1 font-medium">Neuroblastoma</td>
                  <td className="border border-gray-300 p-1">• Bone pain</td>
                  <td className="border border-gray-300 p-1">• Non tender, firm, irregular abdominal mass that cross midline</td>
                  <td className="border border-gray-300 p-1">• High urine homovanillic acid, Vallinyl mandelic acid<br/>• MIGB scan</td>
                  <td className="border border-gray-300 p-1">• Oncology<br/>• Surgery</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-300 p-1 font-medium">Traumatic</td>
                  <td className="border border-gray-300 p-1">• History of trauma</td>
                  <td className="border border-gray-300 p-1">• Area of skull tenderness</td>
                  <td className="border border-gray-300 p-1">• CT scan: Fracture<br/>Table 3</td>
                  <td className="border border-gray-300 p-1">• Neurology<br/>• Neurosurgery<br/>• Rehabilitation</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-300 p-1 font-medium">Intoxication</td>
                  <td className="border border-gray-300 p-1">• History of potential access to medications</td>
                  <td className="border border-gray-300 p-1">• Altered GCS</td>
                  <td className="border border-gray-300 p-1">• Toxicology screen</td>
                  <td className="border border-gray-300 p-1">• General pediatrics<br/>• Psychology</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Red Flag Features */}
        <div className="p-2 bg-blue-100 dark:bg-blue-950/40 rounded-lg">
          <p className="text-[10px] font-bold text-red-600 mb-1">Red flag features</p>
          <ul className="text-[8px] text-gray-700 dark:text-gray-300 space-y-0.5">
            <li>• Signs of raised intracranial pressure (think of intracranial lesion, <strong>Do CT Brain</strong>)</li>
            <li>• Altered conscious state (think of intracranial lesion or encephalitis, <strong>Do CT Brain +/- LP</strong>)</li>
            <li>• Focal neurology (think of intracranial lesion, <strong>Do CT brain</strong>)</li>
            <li>• Meningism (think of meningitis, <strong>Do LP after ruling out increased ICP</strong>)</li>
            <li>• Loss of proprioception, vibration sense or tactile discrimination (think of GBS, <strong>inform neuro</strong>)</li>
            <li>• Bilateral lower limbs Weakness (think of GBS, <strong>inform neuro</strong>)</li>
            <li>• Abnormal deep tendon reflexes (think of GBS, <strong>inform neuro</strong>)</li>
          </ul>
        </div>

        {/* Difference between Ataxia and Pseudo-ataxia */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 underline">Difference between Ataxia and Pseudo-ataxia</p>
          
          {/* Definitions */}
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-[9px]">
            <p className="mb-1"><strong>Ataxia:</strong> inability to make smooth, accurate and coordinated movements (incoordination of fingers, hands, arms, dysarthria, nystagmus)</p>
            <p><strong>Pseudo ataxia:</strong> mild pyramidal weakness of proximal leg muscles mimicking cerebellar disease</p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] min-w-[350px] border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 p-1 text-left font-semibold w-[20%]">Characteristic</th>
                  <th className="border border-gray-300 p-1 text-left font-semibold w-[40%]">Ataxia</th>
                  <th className="border border-gray-300 p-1 text-left font-semibold w-[40%]">Pseudo Ataxia</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-300 p-1 font-medium">Definition</td>
                  <td className="border border-gray-300 p-1">• Impaired coordination in Fully active child</td>
                  <td className="border border-gray-300 p-1">• Mild degree of ataxia in inactive child (drowsy)</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-300 p-1 font-medium">Causes</td>
                  <td className="border border-gray-300 p-1">• See above guidelines</td>
                  <td className="border border-gray-300 p-1">• Part of systemic illness (e.g. URTI, Sepsis)</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-gray-300 p-1 font-medium">Symptoms</td>
                  <td className="border border-gray-300 p-1">• Imbalance and incoordination<br/>• Slurry speech<br/>• Wide-based gait<br/>• Eye movements become erratic and slow</td>
                  <td className="border border-gray-300 p-1">• Tiredness, fatigability, disinterred</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-300 p-1 font-medium">Treatment</td>
                  <td className="border border-gray-300 p-1">• Follow up guideline of ataxia</td>
                  <td className="border border-gray-300 p-1">• Treat underlying cause</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Reminder */}
        <div className="p-2 bg-blue-100 dark:bg-blue-950/40 rounded-lg text-center">
          <p className="text-[9px] text-blue-800 dark:text-blue-300 font-medium">
            Do not label anyone to have ataxia unless he is afebrile and has full level of consciousness
          </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default GaitApproach;
