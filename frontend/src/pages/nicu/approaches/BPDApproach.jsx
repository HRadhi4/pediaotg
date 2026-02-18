/**
 * BPD (Bronchopulmonary Dysplasia) Approach
 * Updated: 2024/2025 AAP Guidelines
 * Design: Standardized to match HypoglycemiaApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const BPDApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const pmaWeeks = ga + (pna / 7);
  const dol = Math.floor(pna);

  return (
    <Card data-testid="bpd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bronchopulmonary Dysplasia (BPD)</CardTitle>
        <CardDescription className="text-xs">NICHD 2019 Jensen Definition - AAP 2024</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Definition */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Definition (NICHD 2019 Jensen)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2">
              <strong>For &lt;32 weeks GA:</strong> BPD diagnosed at 36 weeks PMA based on respiratory support
            </p>
            <p className="mb-2">
              <strong>For ≥32 weeks GA:</strong> ≥28 days of supplemental O2 &gt;21%
            </p>
            <table className="w-full mt-2">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Grade</th>
                  <th className="text-left py-1">Support at 36 wks PMA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50 dark:bg-green-900/20">
                  <td className="py-1 font-medium">No BPD</td>
                  <td className="py-1">Room air</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium text-yellow-700 dark:text-yellow-400">Grade 1 (Mild)</td>
                  <td className="py-1">NC ≤2 L/min</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium text-orange-600 dark:text-orange-400">Grade 2 (Moderate)</td>
                  <td className="py-1">NC &gt;2 L/min, CPAP, NIPPV</td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-900/20">
                  <td className="py-1 font-medium text-red-600 dark:text-red-400">Grade 3 (Severe)</td>
                  <td className="py-1">Invasive MV</td>
                </tr>
              </tbody>
            </table>
            {pmaWeeks > 0 && (
              <p className="text-xs mt-2 p-1 bg-blue-50 dark:bg-blue-900/30 rounded">
                Current PMA: <strong>{pmaWeeks.toFixed(1)} weeks</strong>
                {pmaWeeks >= 36 && <span className="text-blue-600 ml-2">→ Assess BPD grade now</span>}
              </p>
            )}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Extreme prematurity (&lt;28 wks)</strong></li>
              <li>Mechanical ventilation</li>
              <li>Oxygen toxicity</li>
              <li>Chorioamnionitis</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Postnatal sepsis</li>
              <li>PDA</li>
              <li>Fluid overload</li>
              <li>Male sex, IUGR</li>
            </ul>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention (AAP 2024)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li><strong>Antenatal steroids</strong></li>
            <li><strong>Early CPAP/NIPPV</strong> - prefer noninvasive over intubation</li>
            <li><strong>LISA</strong> (Less Invasive Surfactant Administration)</li>
            <li><strong>Caffeine</strong> - start early, prophylactic</li>
            <li><strong>Vitamin A</strong> - 5000 IU IM 3x/week × 4 weeks</li>
            <li>Conservative oxygen: SpO2 90-95%</li>
            <li>Volume-targeted ventilation, permissive hypercarbia</li>
            <li>Fluid restriction: 120-140 mL/kg/day</li>
          </ul>
        </div>

        {/* Postnatal Steroids */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Postnatal Corticosteroids (AAP 2024)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-medium text-red-600 dark:text-red-400">
                ⚠️ Early Dexamethasone (&lt;7 days): NOT RECOMMENDED
              </p>
              <p className="text-red-600 dark:text-red-300">Increased risk of cerebral palsy</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <p className="font-medium">Late Dexamethasone (≥7 days):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Reserve for MV infants at <strong>high risk (&gt;65%)</strong> for BPD</li>
                <li>DART: 0.15 mg/kg/day ÷ q12h × 3 days, then taper</li>
              </ul>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  = {(w * 0.15).toFixed(2)} mg/day ({(w * 0.075).toFixed(3)} mg q12h)
                </p>
              )}
              {dol > 0 && dol < 7 && (
                <p className="text-yellow-600 dark:text-yellow-400 mt-1">
                  Current DOL: {dol} → Wait until DOL ≥7
                </p>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <p className="font-medium">Early Low-dose Hydrocortisone (first 10 days):</p>
              <p>Small but significant increase in BPD-free survival</p>
              <p>0.5-1 mg/kg/day divided q12h</p>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  = {(w * 0.5).toFixed(2)}-{(w * 1).toFixed(2)} mg/day
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Management */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management of Established BPD</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Respiratory:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Wean from MV early, CPAP/HFNC preferred</li>
                <li>Target SpO2 90-95%</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Nutrition:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>120-150 kcal/kg/day</li>
                <li>Protein: 3.5-4 g/kg/day</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Diuretics (if fluid overloaded):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Furosemide: 1-2 mg/kg/dose</li>
                <li>Chlorothiazide: 10-20 mg/kg/dose</li>
              </ul>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  Furosemide: {(w * 1).toFixed(1)}-{(w * 2).toFixed(1)} mg/dose
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Discharge */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Discharge Planning</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>May discharge on home O2 if needed</li>
            <li>Target SpO2 ≥92%</li>
            <li><strong>RSV prophylaxis (Palivizumab)</strong> if criteria met</li>
            <li>Close pulmonary follow-up</li>
            <li>Monitor for BPD-associated pulmonary hypertension</li>
          </ul>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: NICHD 2019 Jensen Definition, AAP NeoReviews 2024, AAP Pediatrics 2024</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default BPDApproach;
