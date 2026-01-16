/**
 * Hypoxic Ischemic Encephalopathy (HIE) Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HIEApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="hie-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hypoxic Ischemic Encephalopathy (HIE)</CardTitle>
        <CardDescription className="text-xs">Perinatal Asphyxia & Therapeutic Hypothermia</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definitions</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Perinatal Asphyxia:</strong> Impaired respiratory gas exchange during birth leading to hypoxia, hypercapnia, and acidosis.</p>
            <p><strong>HIE:</strong> Brain injury due to perinatal asphyxia, presenting with characteristic neurological signs.</p>
          </div>
        </div>

        {/* Diagnostic Criteria */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Criteria for Perinatal Asphyxia</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p>All of the following should be present:</p>
            <p>• Umbilical artery pH &lt;7.0 or base deficit ≥12 mmol/L</p>
            <p>• Apgar score ≤5 at 5 and 10 minutes</p>
            <p>• Neurological signs (encephalopathy)</p>
            <p>• Multi-organ dysfunction</p>
          </div>
        </div>

        {/* Sarnat Staging - THE MAIN FLOWCHART */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-blue-700 mb-2">SARNAT STAGING OF HIE</p>
          
          {/* Stage I - Mild */}
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-yellow-700">Stage I - Mild HIE</p>
            <div className="text-[8px] text-yellow-600 mt-1">
              <div className="grid grid-cols-2 gap-1">
                <div>• Hyperalert</div>
                <div>• Normal or increased tone</div>
                <div>• Exaggerated reflexes</div>
                <div>• Mydriasis (dilated pupils)</div>
                <div>• Tachycardia</div>
                <div>• No seizures</div>
              </div>
              <p className="mt-1 font-bold">Duration: &lt;24 hours</p>
              <p className="text-green-600">Prognosis: Generally good</p>
            </div>
          </div>

          {/* Stage II - Moderate */}
          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-orange-700">Stage II - Moderate HIE</p>
            <div className="text-[8px] text-orange-600 mt-1">
              <div className="grid grid-cols-2 gap-1">
                <div>• Lethargy/obtunded</div>
                <div>• Hypotonia</div>
                <div>• Decreased reflexes</div>
                <div>• Miosis (constricted pupils)</div>
                <div>• Bradycardia</div>
                <div>• <strong className="text-red-600">Seizures common</strong></div>
                <div>• Weak suck</div>
                <div>• Weak Moro reflex</div>
              </div>
              <p className="mt-1 font-bold">Duration: 2-14 days</p>
              <p className="text-amber-600">Prognosis: Variable - 20-40% adverse outcome</p>
            </div>
          </div>

          {/* Stage III - Severe */}
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Stage III - Severe HIE</p>
            <div className="text-[8px] text-red-600 mt-1">
              <div className="grid grid-cols-2 gap-1">
                <div>• Stupor/coma</div>
                <div>• Flaccid</div>
                <div>• Absent reflexes</div>
                <div>• Variable pupils (often fixed)</div>
                <div>• Variable HR</div>
                <div>• Decerebrate posturing</div>
                <div>• Absent suck/gag</div>
                <div>• Absent Moro</div>
              </div>
              <p className="mt-1 font-bold">Duration: Hours to weeks</p>
              <p className="text-red-700">Prognosis: Poor - high mortality or severe disability</p>
            </div>
          </div>
        </div>

        {/* Therapeutic Hypothermia Criteria */}
        <div className="p-2 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200">
          <p className="text-xs font-bold text-cyan-700 mb-1">Therapeutic Hypothermia Criteria</p>
          <div className="text-[8px] text-cyan-600 space-y-1">
            <p className="font-bold">Inclusion (ALL required):</p>
            <div className="space-y-0.5">
              <p>• GA ≥36 weeks</p>
              <p>• Age ≤6 hours</p>
              <p>• pH &lt;7.0 or BE ≥16 mmol/L in cord/postnatal blood (within 1h)</p>
              <p>• OR: Apgar ≤5 at 10 min or continued resuscitation at 10 min</p>
              <p>• Moderate-to-severe encephalopathy (Sarnat II or III)</p>
            </div>
            
            <p className="font-bold mt-2 text-red-600">Exclusion:</p>
            <div className="space-y-0.5">
              <p>• Major congenital anomalies</p>
              <p>• Severe IUGR (&lt;1800g)</p>
              <p>• Uncontrolled coagulopathy</p>
              <p>• Moribund infant</p>
            </div>
          </div>
        </div>

        {/* Cooling Protocol */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Therapeutic Hypothermia Protocol</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Target Temperature:</strong> 33.5°C ± 0.5°C (core/rectal)</p>
            <p><strong>Duration:</strong> 72 hours</p>
            <p><strong>Methods:</strong> Whole body or selective head cooling</p>
            
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded mt-2">
              <p className="font-bold">Rewarming:</p>
              <p>• Rate: 0.5°C per hour</p>
              <p>• Target: 36.5-37°C over 6-12 hours</p>
              <p>• Monitor for rebound seizures</p>
            </div>
            
            <p className="font-bold mt-2">Monitoring during cooling:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Continuous temperature</div>
              <div>• aEEG/EEG</div>
              <div>• HR, BP, SpO2</div>
              <div>• Blood gases</div>
              <div>• Glucose</div>
              <div>• Coagulation</div>
            </div>
          </div>
        </div>

        {/* Side Effects of Cooling */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Side Effects of Therapeutic Hypothermia</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-purple-600">
            <div>• Sinus bradycardia</div>
            <div>• Thrombocytopenia</div>
            <div>• Coagulopathy</div>
            <div>• Subcutaneous fat necrosis</div>
            <div>• Increased oxygen demand</div>
            <div>• Prolonged drug metabolism</div>
            <div>• Hypotension</div>
            <div>• Skin injury</div>
          </div>
        </div>

        {/* Supportive Care */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Supportive Care</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p><strong>Respiratory:</strong> Maintain normoxia, avoid hyperventilation</p>
            <p><strong>Cardiovascular:</strong> Support BP if needed, avoid fluid overload</p>
            <p><strong>Fluids:</strong> Restrict to 60-80 mL/kg/day initially (SIADH risk)</p>
            <p><strong>Glucose:</strong> Avoid hypo- and hyperglycemia (target 45-150 mg/dL)</p>
            <p><strong>Electrolytes:</strong> Monitor Ca, Mg, Na closely</p>
            <p><strong>Nutrition:</strong> Delay enteral feeds until stable</p>
          </div>
        </div>

        {/* Seizure Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Seizure Management</p>
          <div className="text-[8px] space-y-1">
            <p className="text-amber-400">⚠️ Clinical seizures often underestimate EEG seizures</p>
            
            <p className="font-bold mt-2">First-line: Phenobarbital</p>
            <p>Loading: 20 mg/kg IV over 20-30 min</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 20).toFixed(0)} mg</p>}
            <p>Additional doses: 10 mg/kg × 2 if needed (max total 40 mg/kg)</p>
            <p>Maintenance: 3-5 mg/kg/day</p>
            
            <p className="font-bold mt-2">Second-line: Phenytoin/Fosphenytoin</p>
            <p>Loading: 20 mg/kg IV</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 20).toFixed(0)} mg PE</p>}
            
            <p className="font-bold mt-2">Third-line: Levetiracetam</p>
            <p>Loading: 40-60 mg/kg IV</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 40).toFixed(0)} - {(w * 60).toFixed(0)} mg</p>}
          </div>
        </div>

        {/* Multi-organ Dysfunction */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Multi-Organ Dysfunction in HIE</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-red-100 dark:bg-red-900/40">
                <th className="border border-red-200 p-1 text-left">Organ</th>
                <th className="border border-red-200 p-1 text-left">Manifestation</th>
              </tr>
            </thead>
            <tbody className="text-red-600">
              <tr>
                <td className="border border-red-200 p-1">Renal</td>
                <td className="border border-red-200 p-1">Oliguria, elevated Cr, ATN</td>
              </tr>
              <tr>
                <td className="border border-red-200 p-1">Cardiac</td>
                <td className="border border-red-200 p-1">Hypotension, cardiogenic shock, elevated troponin</td>
              </tr>
              <tr>
                <td className="border border-red-200 p-1">Hepatic</td>
                <td className="border border-red-200 p-1">Elevated LFTs, coagulopathy</td>
              </tr>
              <tr>
                <td className="border border-red-200 p-1">GI</td>
                <td className="border border-red-200 p-1">Feeding intolerance, NEC risk</td>
              </tr>
              <tr>
                <td className="border border-red-200 p-1">Hematologic</td>
                <td className="border border-red-200 p-1">DIC, thrombocytopenia</td>
              </tr>
              <tr>
                <td className="border border-red-200 p-1">Metabolic</td>
                <td className="border border-red-200 p-1">Hypoglycemia, hypocalcemia, SIADH</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Investigations */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Investigations</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-indigo-600">
            <div>
              <p className="font-bold">Laboratory:</p>
              <p>• ABG/VBG (pH, lactate)</p>
              <p>• CBC, coagulation</p>
              <p>• Glucose, electrolytes</p>
              <p>• LFTs, Cr, BUN</p>
              <p>• Troponin</p>
            </div>
            <div>
              <p className="font-bold">Imaging:</p>
              <p>• Head US (at 24-48h)</p>
              <p>• MRI (day 3-5 optimal)</p>
              <p>• aEEG/EEG</p>
              <p>• Echo if cardiac involvement</p>
            </div>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognostic Factors</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Poor prognostic indicators:</strong></p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Sarnat stage III</div>
              <div>• Prolonged seizures</div>
              <div>• Abnormal MRI (basal ganglia, white matter)</div>
              <div>• Burst suppression on aEEG</div>
              <div>• Absent brainstem reflexes</div>
              <div>• Multi-organ failure</div>
            </div>
            <p className="mt-2"><strong>Follow-up:</strong> Developmental assessment, early intervention referral</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HIEApproach;
