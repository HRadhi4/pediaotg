/**
 * Apnea of Prematurity Approach
 * Based on AAP Guidelines
 * Reference: Pediatrics, Cochrane Reviews
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ApneaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="apnea-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Apnea of Prematurity</CardTitle>
        <CardDescription className="text-xs">Caffeine & Management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Pause ≥20 sec, OR shorter with bradycardia/desaturation</li>
            <li><strong>Caffeine:</strong> Drug of choice - start early in all &lt;29 weeks</li>
            <li><strong>Rule out:</strong> Secondary causes if onset day 1 or sudden worsening</li>
            <li><strong>Resolution:</strong> Usually by 36-37 weeks PMA</li>
          </ul>
        </div>

        {/* Types */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Types of Apnea</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium">Central (40%)</p>
              <p>No respiratory effort</p>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium">Obstructive (10%)</p>
              <p>Effort but no airflow</p>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium">Mixed (50%)</p>
              <p>Most common type</p>
            </div>
          </div>
        </div>

        {/* Incidence by GA */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Incidence by Gestational Age</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">GA (weeks)</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Incidence</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className={ga > 0 && ga < 29 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">&lt;29</td><td>~100%</td>
              </tr>
              <tr className={ga >= 29 && ga < 31 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">29-30</td><td>~75%</td>
              </tr>
              <tr className={ga >= 31 && ga < 33 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">31-32</td><td>~50%</td>
              </tr>
              <tr className={ga >= 33 && ga < 35 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">33-34</td><td>~10%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Secondary Causes */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Rule Out Secondary Causes</p>
          <p className="text-xs text-red-600 dark:text-red-400 mb-1">If apnea on day 1 or sudden worsening:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p>• Sepsis/meningitis</p>
              <p>• Hypoglycemia</p>
              <p>• Temperature instability</p>
            </div>
            <div>
              <p>• IVH</p>
              <p>• Anemia</p>
              <p>• PDA, NEC</p>
            </div>
          </div>
        </div>

        {/* Caffeine */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Caffeine Citrate</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium">Drug of choice for apnea of prematurity</p>
            
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Loading dose:</p>
              <p>20 mg/kg caffeine citrate IV/PO</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 20).toFixed(0)} mg</p>}
            </div>
            
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Maintenance dose (start 24h after load):</p>
              <p>5-10 mg/kg/day once daily</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 5).toFixed(0)} - {(w * 10).toFixed(0)} mg/day</p>}
            </div>
            
            <div>
              <p className="font-medium">Monitoring:</p>
              <p>• Target level: 5-20 mcg/mL (if poor response)</p>
              <p>• Watch for tachycardia, jitteriness</p>
            </div>
            
            <div>
              <p className="font-medium">Duration:</p>
              <p>• Continue until 34-35 weeks PMA</p>
              <p>• Stop when apnea-free for 5-7 days</p>
            </div>
          </div>
        </div>

        {/* Acute Management */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Acute Episode Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>1. Gentle tactile stimulation</p>
            <p>2. Reposition airway (sniffing position)</p>
            <p>3. Suction if secretions present</p>
            <p>4. If no response → bag-mask ventilation</p>
          </div>
        </div>

        {/* Respiratory Support */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Respiratory Support Options</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">HFNC:</p>
              <p>2-8 L/min based on weight</p>
            </div>
            <div>
              <p className="font-medium">CPAP:</p>
              <p>4-6 cm H2O - stents airway, reduces obstructive component</p>
            </div>
            <div>
              <p className="font-medium">NIPPV:</p>
              <p>For refractory cases - provides backup rate</p>
            </div>
          </div>
        </div>

        {/* Discharge Criteria */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Discharge Criteria</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• No significant events for 5-8 days</p>
            <p>• Off caffeine for 5+ days (if discontinued)</p>
            <p>• OR stable on caffeine with outpatient monitoring plan</p>
            <p>• PMA typically ≥36-37 weeks</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ApneaApproach;
