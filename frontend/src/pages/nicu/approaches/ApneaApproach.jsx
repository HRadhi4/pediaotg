/**
 * Apnea of Prematurity Approach
 * Updated: 2023 Caffeine Guidelines
 * Reference: CAP Trial, MOMBABY 2023 Guidelines, Pediatrics
 * 
 * Design: Standardized to match JaundiceApproach.jsx
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
        <CardDescription className="text-xs">Caffeine & Management Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points (2023)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Pause ≥20 seconds, OR shorter pause with bradycardia (&lt;100) and/or desaturation (&lt;90%)</li>
            <li><strong>Caffeine:</strong> Drug of choice - start early in all &lt;30 weeks</li>
            <li><strong>Rule out:</strong> Secondary causes if onset day 1 or sudden worsening</li>
            <li><strong>Resolution:</strong> Usually by 36-37 weeks PMA</li>
          </ul>
          {pmaWeeks > 0 && (
            <p className="text-xs mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              Current PMA: <strong>{pmaWeeks.toFixed(1)} weeks</strong>
            </p>
          )}
        </div>

        {/* Types of Apnea */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Types of Apnea</p>
          <div className="grid grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Central (40%)</p>
              <p>• No respiratory effort</p>
              <p>• CNS immaturity</p>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Obstructive (10%)</p>
              <p>• Effort but no airflow</p>
              <p>• Pharyngeal collapse</p>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Mixed (50%)</p>
              <p>• Most common type</p>
              <p>• Usually obstructive → central</p>
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
                <td className="py-1">&lt;29</td><td className="font-bold">~100%</td>
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
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Rule Out Secondary Causes</p>
          <p className="text-xs text-red-600 dark:text-red-400 mb-2 font-medium">⚠️ If apnea on DOL 1 OR sudden worsening - NOT typical AOP!</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Common:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Sepsis/meningitis</strong></li>
                <li>Hypoglycemia</li>
                <li>Hypothermia/hyperthermia</li>
                <li>Anemia</li>
                <li>Electrolyte imbalance</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Other:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Seizures</li>
                <li>IVH</li>
                <li>NEC</li>
                <li>PDA</li>
                <li>GER</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Caffeine Dosing */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Caffeine Citrate Dosing</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Loading dose:</p>
              <p>20 mg/kg IV/PO caffeine citrate (= 10 mg/kg caffeine base)</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 20).toFixed(1)} mg caffeine citrate</p>}
            </div>
            <div>
              <p className="font-medium">Maintenance dose:</p>
              <p>5-10 mg/kg/day caffeine citrate (start 24h after loading)</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 5).toFixed(1)} - {(w * 10).toFixed(1)} mg/day</p>}
            </div>
            <div>
              <p className="font-medium">Timing:</p>
              <p>• Start early (within 72h of birth for &lt;30 weeks)</p>
              <p>• Continue until 34-36 weeks PMA and apnea-free for 5-7 days</p>
            </div>
          </div>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Acute episode:</p>
              <p>• Gentle stimulation</p>
              <p>• Suction if secretions</p>
              <p>• Repositioning (avoid neck flexion)</p>
              <p>• Bag-mask ventilation if needed</p>
            </div>
            <div>
              <p className="font-medium">Ongoing management:</p>
              <p>• Caffeine (first-line)</p>
              <p>• Prone positioning</p>
              <p>• CPAP/HFNC if frequent episodes</p>
              <p>• Treat underlying cause</p>
            </div>
          </div>
        </div>

        {/* Discharge Criteria */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Discharge Criteria</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>• Event-free for 5-7 days off caffeine</p>
            <p>• Usually at 36-37 weeks PMA</p>
            <p>• Home monitoring NOT routinely recommended (AAP)</p>
            <p>• Consider monitoring if: persistent events, sibling with SIDS, family anxiety</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ApneaApproach;
