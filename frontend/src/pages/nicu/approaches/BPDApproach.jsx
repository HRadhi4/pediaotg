/**
 * BPD (Bronchopulmonary Dysplasia) Approach
 * Updated: 2024 Guidelines
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const BPDApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const pmaWeeks = ga + (pna / 7);

  return (
    <Card data-testid="bpd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bronchopulmonary Dysplasia (BPD)</CardTitle>
        <CardDescription className="text-xs">Chronic Lung Disease of Prematurity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Definition */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Definition (2019 NICHD)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2">Radiographic lung disease AND need for respiratory support at 36 weeks PMA:</p>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Grade</th>
                  <th className="text-left py-1">Respiratory Support at 36 wks PMA</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1">Grade 1</td><td>Nasal cannula ≤2 L/min</td></tr>
                <tr><td className="py-1">Grade 2</td><td>NC &gt;2 L/min OR CPAP/HFNC</td></tr>
                <tr><td className="py-1">Grade 3</td><td>Invasive mechanical ventilation</td></tr>
              </tbody>
            </table>
            {pmaWeeks > 0 && (
              <p className="text-xs mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                Current PMA: <strong>{pmaWeeks.toFixed(1)} weeks</strong>
              </p>
            )}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Extreme prematurity</strong></li>
              <li>Mechanical ventilation</li>
              <li>Oxygen toxicity</li>
              <li>Chorioamnionitis</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Postnatal sepsis</li>
              <li>PDA</li>
              <li>Fluid overload</li>
              <li>Male sex</li>
            </ul>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention Strategies</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-1">
            <li><strong>Antenatal steroids</strong> - reduce RDS and BPD</li>
            <li><strong>Early CPAP</strong> - avoid intubation if possible</li>
            <li><strong>Caffeine</strong> - start early, reduces BPD</li>
            <li><strong>Vitamin A</strong> - 5000 IU IM 3x/week × 4 weeks</li>
            <li><strong>Conservative oxygen</strong> - target SpO2 90-95%</li>
            <li>Minimize volutrauma (low tidal volumes)</li>
          </ul>
        </div>

        {/* Management */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Respiratory:</p>
              <p>• Minimize ventilator support</p>
              <p>• CPAP/HFNC preferred over IMV</p>
              <p>• Target SpO2 90-95%</p>
            </div>
            <div>
              <p className="font-medium">Nutrition:</p>
              <p>• Enhanced calories (120-150 kcal/kg/day)</p>
              <p>• Adequate protein (3.5-4 g/kg/day)</p>
              <p>• May need fluid restriction</p>
            </div>
            <div>
              <p className="font-medium">Diuretics (if fluid overloaded):</p>
              <p>• Furosemide: 1-2 mg/kg/dose</p>
              <p>• Chlorothiazide: 10-20 mg/kg/dose</p>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  Furosemide: {(w * 1).toFixed(1)}-{(w * 2).toFixed(1)} mg/dose
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Steroids */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-orange-500">
          <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Postnatal Steroids</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2">Consider if high risk of BPD and unable to wean from ventilator:</p>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Dexamethasone (DART protocol):</p>
              <p>• 0.15 mg/kg/day ÷ q12h × 3 days</p>
              <p>• Then taper over 7-10 days</p>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  = {(w * 0.15).toFixed(2)} mg/day ({(w * 0.075).toFixed(2)} mg q12h)
                </p>
              )}
            </div>
            <p className="text-orange-600 dark:text-orange-400 mt-2 font-medium">
              ⚠️ Balance risk of BPD vs. neurodevelopmental concerns
            </p>
          </div>
        </div>

        {/* Discharge Planning */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Discharge Planning</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>May discharge on home oxygen if needed</li>
            <li>Target SpO2 ≥92% on room air or prescribed O2</li>
            <li>RSV prophylaxis (Palivizumab) if criteria met</li>
            <li>Close pulmonary follow-up</li>
            <li>Avoid smoke exposure</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
};

export default BPDApproach;
