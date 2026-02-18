/**
 * CDH (Congenital Diaphragmatic Hernia) Approach
 * Updated: 2024/2025 Guidelines
 * Based on CDH EURO Consensus, APSA Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const CDHApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="cdh-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Congenital Diaphragmatic Hernia (CDH)</CardTitle>
        <CardDescription className="text-xs">Bochdalek & Morgagni Hernia - 2024/2025 Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Key Points
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Left-sided:</strong> 85% (Bochdalek - posterolateral)</li>
            <li><strong>Pulmonary hypoplasia:</strong> Both lungs affected, ipsilateral worse</li>
            <li><strong>PPHN:</strong> Major contributor to mortality</li>
            <li><strong>NO bag-mask ventilation</strong> - immediate intubation</li>
            <li><strong>Gentle ventilation</strong> is cornerstone of management</li>
          </ul>
        </div>

        {/* Delivery Room - CRITICAL */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Delivery Room - CRITICAL
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">1.</span>
                <span><strong>Immediate intubation</strong> - AVOID bag-mask (causes gastric distension)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">2.</span>
                <span>Large bore OG/NG tube to <strong>continuous suction</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">3.</span>
                <span>Gentle ventilation - <strong>PIP ≤25 cmH2O</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">4.</span>
                <span>Target <strong>preductal SpO2 85-95%</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">5.</span>
                <span>Permissive hypercapnia acceptable (pCO2 45-70 mmHg)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Gentle Ventilation Strategy - 2024/2025 Guidelines */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Gentle Ventilation Strategy (2024/2025 Consensus)
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2 font-medium text-green-700 dark:text-green-400">
              Cornerstone of CDH management - improves survival (95% vs 62%)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-100 dark:bg-green-900/40">
                    <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600">Parameter</th>
                    <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600">Target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium">PIP</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600"><strong>≤25 cmH2O</strong> (goal &lt;20)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium">PEEP</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">2-6 cmH2O (typically 3-5)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium">Rate</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">40-60/min</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium">I:E Ratio</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">1:1 to 1:2</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium">Tidal Volume</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">4-6 mL/kg (volume-targeted)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium">Preductal SpO2</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600"><strong>85-95%</strong></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium">Goal pH</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">&gt;7.20</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600 font-medium">Goal pCO2</td>
                    <td className="py-2 px-2 border border-slate-300 dark:border-slate-600">45-70 mmHg (permissive hypercapnia)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 rounded border border-amber-300">
              <p className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Key Principle
              </p>
              <p className="text-amber-600 dark:text-amber-300">
                Tidal volume (volutrauma) carries higher risk than pressure alone. Prioritize volume-targeted ventilation.
              </p>
            </div>
          </div>
        </div>

        {/* HFOV */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">High-Frequency Oscillatory Ventilation (HFOV)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Indication:</p>
            <p>If conventional ventilation fails (unable to maintain targets with gentle settings)</p>
            <div className="mt-2">
              <p className="font-medium mb-1">HFOV Settings:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>MAP: 13-17 cmH2O</li>
                <li>Amplitude: Adjust for chest wiggle</li>
                <li>Frequency: 10-12 Hz</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PPHN Management */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">PPHN Management in CDH</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-purple-600 dark:text-purple-400">Optimize First:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Sedation (morphine/fentanyl) - minimize agitation</li>
                <li>• Avoid stimulation/suctioning</li>
                <li>• Maintain normothermia</li>
                <li>• Correct acidosis, hypoglycemia</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-purple-600 dark:text-purple-400">Pulmonary Vasodilators:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• <strong>iNO 20 ppm</strong> - may be used but response variable in CDH</li>
                <li>• Sildenafil (adjunct/alternative)</li>
                <li>• Milrinone (inotrope + vasodilator)</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-purple-600 dark:text-purple-400">Hemodynamic Support:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Target systemic BP &gt; pulmonary BP</li>
                <li>• Vasopressors: dopamine, norepinephrine, vasopressin</li>
                <li>• Avoid fluid overload</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Surgical Repair */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surgical Repair</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded mb-2">
              <p className="font-medium text-amber-700 dark:text-amber-400">Timing (2024 Consensus):</p>
              <p>• <strong>Delayed repair (24-72h or longer)</strong> preferred over emergent</p>
              <p>• CDH is a <strong>physiological emergency, not surgical emergency</strong></p>
              <p>• Stabilize PPHN and respiratory status first</p>
            </div>
            <p className="font-medium mb-1">Criteria for Repair:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Hemodynamically stable on minimal/no vasopressors</li>
              <li>Preductal SpO2 &gt;85% on reasonable ventilatory support</li>
              <li>Adequate urine output (&gt;1 mL/kg/hr)</li>
              <li>Not on escalating support</li>
              <li>Mean arterial pressure appropriate for gestational age</li>
            </ul>
          </div>
        </div>

        {/* ECMO */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-700 dark:text-red-400 mb-2">ECMO in CDH (2024/2025 Guidelines)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Indications (after multidisciplinary discussion):</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Preductal SaO2 &lt;85% despite maximal ventilation + iNO</li>
              <li>Respiratory acidosis: pH &lt;7.20, pCO2 &gt;70 mmHg despite optimization</li>
              <li>OI &gt;40 despite optimal management</li>
              <li>Hemodynamic instability/shock</li>
              <li>Inadequate oxygen delivery</li>
            </ul>
            <p className="font-medium mt-2 mb-1">Contraindications:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Lethal chromosomal/structural anomalies</li>
              <li>Severe IVH (Grade III/IV)</li>
              <li>Extreme prematurity (&lt;34 weeks)</li>
              <li>Irreversible lung hypoplasia</li>
            </ul>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis & Follow-up</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2"><strong>Survival:</strong> ~70-90% at experienced high-volume centers</p>
            <p className="font-medium mb-1">Long-term Issues:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Chronic lung disease / recurrent respiratory infections</li>
              <li>Gastroesophageal reflux (GER)</li>
              <li>Feeding difficulties / failure to thrive</li>
              <li>Scoliosis / chest wall deformity</li>
              <li>Recurrence of hernia</li>
              <li>Neurodevelopmental impairment</li>
            </ul>
            <p className="mt-2 text-blue-600 dark:text-blue-400">→ Multidisciplinary follow-up essential</p>
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: CDH EURO Consensus 2024, MOMBABY CDH Guidelines 2024, APSA Guidelines</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default CDHApproach;
