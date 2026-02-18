/**
 * BPD (Bronchopulmonary Dysplasia) Approach
 * Updated: 2024/2025 AAP Guidelines
 * Based on NICHD 2019 Jensen Definition
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

const BPDApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const pmaWeeks = ga + (pna / 7);
  const dol = Math.floor(pna); // Day of life

  return (
    <Card data-testid="bpd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bronchopulmonary Dysplasia (BPD)</CardTitle>
        <CardDescription className="text-xs">Chronic Lung Disease of Prematurity - AAP/NICHD 2019 Jensen Definition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Definition - NICHD 2019 Jensen */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Definition (NICHD 2019 Jensen)
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2">
              <strong>For infants &lt;32 weeks GA:</strong> BPD diagnosed when infant requires any respiratory support at 36 weeks PMA, 
              OR supplemental O2 for ≥28 days (even without support at 36 weeks PMA)
            </p>
            <p className="mb-2">
              <strong>For infants ≥32 weeks GA:</strong> ≥28 days of supplemental O2 &gt;21%
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-900/40">
                    <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600">Grade</th>
                    <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600">Respiratory Support at 36 wks PMA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-green-50 dark:bg-green-900/20">
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium">No BPD</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">Room air (no respiratory support)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium text-yellow-700 dark:text-yellow-400">Grade 1 (Mild)</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">Nasal cannula ≤2 L/min</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium text-orange-600 dark:text-orange-400">Grade 2 (Moderate)</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">NC &gt;2 L/min, CPAP, or NIPPV</td>
                  </tr>
                  <tr className="bg-red-50 dark:bg-red-900/20">
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium text-red-600 dark:text-red-400">Grade 3 (Severe)</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">Invasive mechanical ventilation (IMV)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {pmaWeeks > 0 && (
              <p className="text-xs mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center gap-2">
                <Info className="h-3 w-3" />
                Current PMA: <strong>{pmaWeeks.toFixed(1)} weeks</strong>
                {pmaWeeks >= 36 && <span className="text-blue-600 font-medium ml-2">→ Assess BPD grade now</span>}
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
              <li>Patent ductus arteriosus (PDA)</li>
              <li>Fluid overload</li>
              <li>Male sex, IUGR</li>
            </ul>
          </div>
        </div>

        {/* Prevention - AAP Recommendations */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Prevention Strategies (AAP 2024)
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Antenatal steroids</strong> - reduces RDS and BPD risk</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Early CPAP/NIPPV</strong> - prefer noninvasive ventilation over intubation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>LISA (Less Invasive Surfactant Administration)</strong> - evidence-based, safer than standard intubation-surfactant-extubation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Caffeine</strong> - start early, prophylactic use recommended</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Vitamin A</strong> - 5000 IU IM 3x/week × 4 weeks (reduces BPD/death)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Conservative oxygen</strong> - target SpO2 90-95%, lowest FiO2 tolerated</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Volume-targeted ventilation</strong> - minimize volutrauma, permissive hypercarbia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Fluid restriction</strong> - 120-140 mL/kg/day to prevent pulmonary congestion</span>
            </li>
          </ul>
        </div>

        {/* Postnatal Steroids - AAP 2024 Recommendations */}
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
          <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Postnatal Corticosteroids (AAP 2024)
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
            
            {/* Early Steroids Warning */}
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
              <p className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Early Dexamethasone (&lt;7 days of life)
              </p>
              <p className="text-red-600 dark:text-red-300">
                <strong>NOT RECOMMENDED</strong> - increased risk of cerebral palsy and neurodevelopmental impairment
              </p>
            </div>

            {/* Late Dexamethasone */}
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-300 dark:border-amber-700">
              <p className="font-semibold text-amber-700 dark:text-amber-400">Late Dexamethasone (≥7 days of life)</p>
              <ul className="mt-1 space-y-0.5">
                <li>• Reserve for mechanically ventilated infants at <strong>high risk (&gt;65%)</strong> for BPD</li>
                <li>• Reduces BPD and BPD/mortality without significant NDI impact</li>
                <li>• Infants with lower BPD risk may have increased NDI if treated</li>
              </ul>
              <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded">
                <p className="font-medium">DART Protocol:</p>
                <p>• 0.15 mg/kg/day ÷ q12h × 3 days, then taper over 7-10 days</p>
                {w > 0 && (
                  <p className="font-mono text-blue-600 dark:text-blue-400 mt-1">
                    = {(w * 0.15).toFixed(2)} mg/day ({(w * 0.075).toFixed(3)} mg q12h)
                  </p>
                )}
              </div>
              {dol > 0 && dol < 7 && (
                <p className="mt-2 p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded text-yellow-700 dark:text-yellow-400 text-center">
                  Current DOL: {dol} → Wait until DOL ≥7 for late steroids
                </p>
              )}
            </div>

            {/* Early Low-dose Hydrocortisone */}
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-300 dark:border-blue-700">
              <p className="font-semibold text-blue-700 dark:text-blue-400">Early Low-dose Hydrocortisone (first 10 days)</p>
              <ul className="mt-1 space-y-0.5">
                <li>• Small but significant increase in BPD-free survival</li>
                <li>• Use predictive models to identify infants with greatest benefit</li>
                <li>• 0.5-1 mg/kg/day divided q12h</li>
              </ul>
              {w > 0 && (
                <p className="font-mono text-blue-600 dark:text-blue-400 mt-1">
                  Hydrocortisone: {(w * 0.5).toFixed(2)}-{(w * 1).toFixed(2)} mg/day
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
              <p className="font-medium text-blue-600 dark:text-blue-400">Respiratory:</p>
              <ul className="ml-4 space-y-0.5">
                <li>• Wean from mechanical ventilation as early as possible</li>
                <li>• CPAP/HFNC preferred over IMV</li>
                <li>• Target SpO2 90-95% (avoid hypoxemia)</li>
                <li>• Permissive hypercarbia if needed</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-600 dark:text-green-400">Nutrition:</p>
              <ul className="ml-4 space-y-0.5">
                <li>• Enhanced calories: 120-150 kcal/kg/day</li>
                <li>• Adequate protein: 3.5-4 g/kg/day</li>
                <li>• Fluid restriction if needed</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-purple-600 dark:text-purple-400">Diuretics (if fluid overloaded):</p>
              <ul className="ml-4 space-y-0.5">
                <li>• Furosemide: 1-2 mg/kg/dose</li>
                <li>• Chlorothiazide: 10-20 mg/kg/dose</li>
                <li>• Spironolactone: 1-3 mg/kg/day</li>
              </ul>
              {w > 0 && (
                <p className="font-mono text-blue-600 dark:text-blue-400 mt-1 ml-4">
                  Furosemide: {(w * 1).toFixed(1)}-{(w * 2).toFixed(1)} mg/dose
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Emerging Therapies */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Emerging Therapies (Under Investigation)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Mesenchymal stromal cells (MSCs)</li>
            <li>IGF-1/IGFBP-3 (Insulin-like growth factor)</li>
            <li>Interleukin-1 receptor antagonist (Anakinra)</li>
          </ul>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-2 italic">
            Phase II efficacy studies currently underway
          </p>
        </div>

        {/* Discharge Planning */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Discharge Planning</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>May discharge on home oxygen if needed</li>
            <li>Target SpO2 ≥92% on room air or prescribed O2</li>
            <li><strong>RSV prophylaxis (Palivizumab)</strong> if criteria met</li>
            <li>Close pulmonary follow-up</li>
            <li>Avoid smoke exposure and respiratory infections</li>
            <li>Monitor for BPD-associated pulmonary hypertension</li>
          </ul>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: NICHD 2019 Jensen Definition, AAP NeoReviews 2024, AAP Pediatrics 2024</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default BPDApproach;
