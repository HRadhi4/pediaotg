/**
 * Apnea of Prematurity Approach
 * Updated: 2023 Caffeine Guidelines
 * Reference: CAP Trial, MOMBABY 2023 Guidelines, Pediatrics
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ApneaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const pmaWeeks = ga + (pna / 7);

  return (
    <Card data-testid="apnea-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Apnea of Prematurity</CardTitle>
        <CardDescription className="text-xs">Caffeine & Management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2023 Caffeine Guidelines (CAP Trial Evidence)</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2023)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Definition:</strong> Pause ≥20 seconds, OR shorter pause with bradycardia (&lt;100) and/or desaturation (&lt;90%)</p>
            <p><strong>Caffeine:</strong> Drug of choice - <strong>start early in all &lt;30 weeks</strong></p>
            <p><strong>Rule out:</strong> Secondary causes if onset day 1 or sudden worsening</p>
            <p><strong>Resolution:</strong> Usually by 36-37 weeks PMA</p>
            {pmaWeeks > 0 && (
              <p className="bg-amber-100 p-1 rounded mt-1">
                Current PMA: {pmaWeeks.toFixed(1)} weeks
              </p>
            )}
          </div>
        </div>

        {/* Types */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Types of Apnea</p>
          <div className="grid grid-cols-3 gap-2 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Central (40%)</p>
              <p>No respiratory effort</p>
              <p>CNS immaturity</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Obstructive (10%)</p>
              <p>Effort but no airflow</p>
              <p>Pharyngeal collapse</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Mixed (50%)</p>
              <p>Most common type</p>
              <p>Usually obstructive → central</p>
            </div>
          </div>
        </div>

        {/* Incidence by GA */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Incidence by Gestational Age</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-purple-100 dark:bg-purple-900/40">
                <th className="border border-purple-200 p-1 text-left">GA (weeks)</th>
                <th className="border border-purple-200 p-1 text-left">Incidence</th>
              </tr>
            </thead>
            <tbody className="text-purple-600">
              <tr className={ga > 0 && ga < 29 ? "bg-purple-200 dark:bg-purple-800" : ""}>
                <td className="border border-purple-200 p-1">&lt;29</td>
                <td className="border border-purple-200 p-1 font-bold">~100%</td>
              </tr>
              <tr className={ga >= 29 && ga < 31 ? "bg-purple-200 dark:bg-purple-800" : ""}>
                <td className="border border-purple-200 p-1">29-30</td>
                <td className="border border-purple-200 p-1">~75%</td>
              </tr>
              <tr className={ga >= 31 && ga < 33 ? "bg-purple-200 dark:bg-purple-800" : ""}>
                <td className="border border-purple-200 p-1">31-32</td>
                <td className="border border-purple-200 p-1">~50%</td>
              </tr>
              <tr className={ga >= 33 && ga < 35 ? "bg-purple-200 dark:bg-purple-800" : ""}>
                <td className="border border-purple-200 p-1">33-34</td>
                <td className="border border-purple-200 p-1">~10%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Secondary Causes - Important */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Rule Out Secondary Causes</p>
          <p className="text-[8px] text-red-600 mb-1 font-bold">⚠️ If apnea on DOL 1 OR sudden worsening - NOT typical AOP!</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Common:</p>
              <p>• <strong>Sepsis/meningitis</strong></p>
              <p>• Hypoglycemia</p>
              <p>• Temperature instability</p>
              <p>• Anemia</p>
            </div>
            <div>
              <p className="font-bold">Other:</p>
              <p>• IVH</p>
              <p>• PDA</p>
              <p>• NEC</p>
              <p>• Seizures</p>
              <p>• Airway obstruction</p>
            </div>
          </div>
        </div>

        {/* Caffeine - 2023 Guidelines */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">CAFFEINE CITRATE (2023 Guidelines)</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Indications</p>
            <div className="text-[8px] text-green-600 mt-1">
              <p>• <strong>&lt;30 weeks GA:</strong> Start within 2 hours of birth (prophylaxis)</p>
              <p>• <strong>≥30 weeks:</strong> Start if apnea persists after respiratory support initiated</p>
              <p>• Prior to extubation (all preterm)</p>
              <p className="text-red-600 mt-1">⚠️ Avoid routine use if likely to remain ventilated &gt;10 days</p>
            </div>
          </div>

          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Loading Dose</p>
            <div className="text-[8px] text-blue-600 mt-1">
              <p><strong>20 mg/kg</strong> caffeine citrate IV/PO</p>
              {w > 0 && <p className="font-mono text-green-600 font-bold">= {(w * 20).toFixed(0)} mg</p>}
              <p className="text-[7px] text-gray-600 mt-1">(= 10 mg/kg caffeine base)</p>
            </div>
          </div>

          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-purple-700">Maintenance Dose (start 24h after load)</p>
            <div className="text-[8px] text-purple-600 mt-1">
              <p><strong>5-10 mg/kg/day</strong> once daily IV/PO</p>
              {w > 0 && <p className="font-mono text-green-600 font-bold">= {(w * 5).toFixed(0)} - {(w * 10).toFixed(0)} mg/day</p>}
              <p className="mt-1">If apnea persists/worsens:</p>
              <p>• Give additional load (10 mg/kg)</p>
              <p>• Increase maintenance to 10 mg/kg/day</p>
            </div>
          </div>

          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-amber-700">Monitoring</p>
            <div className="text-[8px] text-amber-600 mt-1">
              <p>• <strong>Target level:</strong> 5-20 mcg/mL (routine levels not needed if responding)</p>
              <p>• Watch for: Tachycardia (&gt;180 bpm - hold dose), jitteriness, feeding intolerance</p>
              <p>• Caffeine levels indicated for poor response or toxicity concerns</p>
            </div>
          </div>
        </div>

        {/* Duration & Endpoint */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Duration of Therapy (2023)</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Suggested endpoint:</strong> 32-34 weeks PMA</p>
            <p>• May extend beyond 34 weeks for former ELBW infants (provider discretion)</p>
            <p>• Stop when apnea-free for 5-7 days AND off respiratory support</p>
            
            <p className="font-bold mt-2">Benefits of caffeine (CAP Trial):</p>
            <p>• ↓ BPD (bronchopulmonary dysplasia)</p>
            <p>• Earlier extubation</p>
            <p>• ↑ Survival without neurodevelopmental disability at 18-21 months</p>
          </div>
        </div>

        {/* Acute Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Acute Episode Management</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Step-wise approach:</p>
            <p>1. Gentle tactile stimulation (flick soles, rub back)</p>
            <p>2. Reposition airway (sniffing position, chin lift)</p>
            <p>3. Suction if secretions present</p>
            <p>4. If no response → <strong>Bag-mask ventilation</strong></p>
            <p className="text-red-400 mt-1">Call for help if prolonged/recurrent</p>
          </div>
        </div>

        {/* Respiratory Support */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Respiratory Support Options</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">HFNC (High-Flow Nasal Cannula):</p>
              <p>2-8 L/min based on weight (1-2 L/min per kg)</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">CPAP:</p>
              <p>4-6 cm H2O - stents airway open, reduces obstructive component</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">NIPPV (Non-invasive PPV):</p>
              <p>For refractory apnea - provides backup rate</p>
              <p>PIP 12-20, PEEP 5-6, Rate 20-30</p>
            </div>
          </div>
        </div>

        {/* Discharge Criteria - 2023 */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Discharge Criteria (2023)</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p className="font-bold">Apnea-free countdown:</p>
            <p>• <strong>8 days without significant apnea</strong> after caffeine stopped</p>
            <p>• Can start countdown once:</p>
            <p className="pl-2">- ≥3 days since last caffeine dose, AND</p>
            <p className="pl-2">- Off positive pressure support, OR</p>
            <p className="pl-2">- ≥36 weeks PMA (whichever comes first)</p>
            
            <p className="font-bold mt-2">Alternative:</p>
            <p>• Discharge on caffeine with home monitoring (selected cases)</p>
            <p>• Outpatient follow-up plan required</p>
            
            <p className="font-bold mt-2">Typical PMA at discharge:</p>
            <p>≥36-37 weeks if previously on caffeine</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• AOP typically resolves by 36-37 weeks PMA</p>
            <p>• Very preterm infants may have persistent events longer</p>
            <p>• Early caffeine associated with better neurodevelopmental outcomes</p>
            <p>• No increased risk of SIDS with treated AOP</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ApneaApproach;
