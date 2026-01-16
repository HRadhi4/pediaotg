/**
 * Apnoea of Prematurity Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ApnoeaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="apnoea-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Apnoea of Prematurity</CardTitle>
        <CardDescription className="text-xs">Pathophysiology & Management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definitions</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Apnoea:</strong> Cessation of breathing for ≥20 seconds, OR &lt;20 seconds if associated with bradycardia (&lt;100 bpm), cyanosis, or oxygen desaturation.</p>
            <p><strong>Apnoea of Prematurity (AOP):</strong> Developmentally appropriate apnoea in infants &lt;37 weeks GA, typically presents after day 1-2 of life.</p>
            <p><strong>Periodic Breathing:</strong> 3 or more respiratory pauses &gt;3 seconds within 20 seconds, without significant bradycardia/desaturation - usually benign.</p>
          </div>
        </div>

        {/* Types of Apnoea */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Types of Apnoea</p>
          <div className="grid grid-cols-3 gap-2 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-center">Central (40%)</p>
              <p className="mt-1">No respiratory effort</p>
              <p>Immature brainstem</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-center">Obstructive (10%)</p>
              <p className="mt-1">Effort present but no airflow</p>
              <p>Upper airway obstruction</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-center">Mixed (50%)</p>
              <p className="mt-1">Most common type</p>
              <p>Central + obstructive</p>
            </div>
          </div>
        </div>

        {/* Risk by GA */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Incidence by Gestational Age</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-purple-100 dark:bg-purple-900/40">
                <th className="border border-purple-200 p-1">GA (weeks)</th>
                <th className="border border-purple-200 p-1">Incidence</th>
              </tr>
            </thead>
            <tbody className="text-purple-600">
              <tr className={ga > 0 && ga < 29 ? "bg-yellow-100" : ""}>
                <td className="border border-purple-200 p-1">&lt;29</td>
                <td className="border border-purple-200 p-1 font-bold">~100%</td>
              </tr>
              <tr className={ga >= 29 && ga < 31 ? "bg-yellow-100" : ""}>
                <td className="border border-purple-200 p-1">29-30</td>
                <td className="border border-purple-200 p-1 font-bold">~75%</td>
              </tr>
              <tr className={ga >= 31 && ga < 33 ? "bg-yellow-100" : ""}>
                <td className="border border-purple-200 p-1">31-32</td>
                <td className="border border-purple-200 p-1 font-bold">~50%</td>
              </tr>
              <tr className={ga >= 33 && ga < 35 ? "bg-yellow-100" : ""}>
                <td className="border border-purple-200 p-1">33-34</td>
                <td className="border border-purple-200 p-1 font-bold">~10%</td>
              </tr>
              <tr className={ga >= 35 ? "bg-yellow-100" : ""}>
                <td className="border border-purple-200 p-1">≥35</td>
                <td className="border border-purple-200 p-1 font-bold">Rare</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[7px] text-purple-500 mt-1">Usually resolves by 36-37 weeks PMA (postmenstrual age)</p>
        </div>

        {/* Causes - Differential */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Secondary Causes (Rule Out!)</p>
          <p className="text-[7px] text-red-500 mb-1">If apnoea presents on day 1 or worsens suddenly, consider:</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Infectious:</p>
              <p>• Sepsis</p>
              <p>• Meningitis</p>
              <p>• NEC</p>
            </div>
            <div>
              <p className="font-bold">Respiratory:</p>
              <p>• RDS</p>
              <p>• Pneumonia</p>
              <p>• Airway obstruction</p>
            </div>
            <div>
              <p className="font-bold">Metabolic:</p>
              <p>• Hypoglycemia</p>
              <p>• Hypocalcemia</p>
              <p>• Hypo/hyperthermia</p>
            </div>
            <div>
              <p className="font-bold">CNS:</p>
              <p>• IVH</p>
              <p>• Seizures</p>
              <p>• Drugs (maternal)</p>
            </div>
            <div>
              <p className="font-bold">Cardiac:</p>
              <p>• PDA</p>
              <p>• CHD</p>
              <p>• Anemia</p>
            </div>
            <div>
              <p className="font-bold">GI:</p>
              <p>• GER</p>
              <p>• Abdominal distension</p>
              <p>• Post-feeding</p>
            </div>
          </div>
        </div>

        {/* Management Algorithm */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">MANAGEMENT APPROACH</p>
          
          {/* Step 1 */}
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Step 1: Acute Management</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Gentle tactile stimulation</p>
              <p>• Reposition airway (sniffing position)</p>
              <p>• Suction if secretions present</p>
              <p>• If no response → bag-mask ventilation</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Step 2: Evaluate for Secondary Causes</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p>• Check temperature, glucose</p>
              <p>• Consider septic workup</p>
              <p>• Review feeding history (GER?)</p>
              <p>• Head US if concern for IVH</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-purple-700">Step 3: Pharmacologic Treatment</p>
            <div className="text-[8px] text-purple-600 mt-1">
              <p className="font-bold">First-line: Caffeine Citrate</p>
            </div>
          </div>
        </div>

        {/* Caffeine - Detailed */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Caffeine Citrate</p>
          <div className="text-[8px] space-y-1">
            <p className="text-amber-400">Drug of choice for apnoea of prematurity</p>
            
            <div className="p-1.5 bg-gray-700 rounded mt-2">
              <p className="font-bold">Loading Dose:</p>
              <p>20 mg/kg caffeine citrate IV/PO</p>
              {w > 0 && <p className="text-green-400 font-mono">= {(w * 20).toFixed(0)} mg</p>}
              <p className="text-[7px] text-gray-400">(= 10 mg/kg caffeine base)</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Maintenance Dose:</p>
              <p>5-10 mg/kg/day caffeine citrate once daily</p>
              {w > 0 && <p className="text-green-400 font-mono">= {(w * 5).toFixed(0)} - {(w * 10).toFixed(0)} mg/day</p>}
              <p className="text-[7px] text-gray-400">Start 24h after loading dose</p>
            </div>
            
            <p className="mt-2"><strong>Monitoring:</strong></p>
            <p>• Check levels if poor response (target: 5-20 mcg/mL)</p>
            <p>• Watch for tachycardia, jitteriness, feeding intolerance</p>
            
            <p className="mt-2"><strong>Duration:</strong></p>
            <p>• Continue until 34-35 weeks PMA</p>
            <p>• Stop when apnoea-free for 5-7 days</p>
          </div>
        </div>

        {/* Aminophylline Alternative */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Alternative: Aminophylline</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p><strong>Loading:</strong> 5-6 mg/kg IV over 30 min</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w * 5).toFixed(0)} - {(w * 6).toFixed(0)} mg</p>}
            <p><strong>Maintenance:</strong> 1.5-3 mg/kg/dose IV q8-12h</p>
            <p className="text-[7px] text-orange-500">Note: Caffeine preferred due to wider safety margin and once daily dosing</p>
          </div>
        </div>

        {/* Respiratory Support */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Respiratory Support Options</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>High-Flow Nasal Cannula (HFNC):</strong></p>
            <p>• Flow: 2-8 L/min (based on weight)</p>
            <p>• Consider if frequent apnoeas on caffeine alone</p>
            
            <p className="font-bold mt-2">Nasal CPAP (nCPAP):</p>
            <p>• Pressure: 4-6 cm H2O</p>
            <p>• Stents airway open (reduces obstructive component)</p>
            
            <p className="font-bold mt-2">NIV-NAVA or NIPPV:</p>
            <p>• For refractory cases</p>
            <p>• Provides backup rate</p>
          </div>
        </div>

        {/* Non-pharmacologic */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Non-Pharmacologic Measures</p>
          <div className="text-[8px] text-green-600 space-y-0.5">
            <p>• Neutral thermal environment</p>
            <p>• Prone positioning (monitored setting only)</p>
            <p>• Avoid neck flexion</p>
            <p>• Smaller, more frequent feeds</p>
            <p>• Avoid rapid feeding advancement</p>
            <p>• Treat anemia (keep Hct &gt;25-30%)</p>
            <p>• Consider anti-reflux measures if GER suspected</p>
          </div>
        </div>

        {/* Discharge Criteria */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Discharge Criteria</p>
          <div className="text-[8px] text-indigo-600 space-y-0.5">
            <p>• No significant apnoea/bradycardia for 5-8 days</p>
            <p>• Off caffeine for at least 5 days (if discontinued)</p>
            <p>• OR stable on caffeine with plan for outpatient monitoring</p>
            <p>• PMA typically ≥36-37 weeks</p>
            <p>• Consider home apnoea monitor for high-risk infants</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• AOP typically resolves by 36-37 weeks PMA</p>
            <p>• May persist longer in extremely preterm infants</p>
            <p>• Not associated with increased SIDS risk in isolation</p>
            <p>• Caffeine therapy associated with improved neurodevelopmental outcomes (CAP trial)</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ApnoeaApproach;
