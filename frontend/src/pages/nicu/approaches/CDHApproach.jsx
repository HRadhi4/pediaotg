/**
 * CDH (Congenital Diaphragmatic Hernia) Approach
 * Updated: 2024/2025 Guidelines
 * Design: Standardized to match HypoglycemiaApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CDHApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="cdh-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Congenital Diaphragmatic Hernia (CDH)</CardTitle>
        <CardDescription className="text-xs">CDH EURO Consensus 2024</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Left-sided:</strong> 85% (Bochdalek - posterolateral)</li>
            <li><strong>Pulmonary hypoplasia:</strong> Both lungs affected</li>
            <li><strong>PPHN:</strong> Major contributor to mortality</li>
            <li><strong>NO bag-mask ventilation</strong> - immediate intubation</li>
            <li><strong>Gentle ventilation</strong> is cornerstone of management</li>
          </ul>
        </div>

        {/* Delivery Room */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Delivery Room - CRITICAL</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <li><strong>1.</strong> Immediate intubation - AVOID bag-mask</li>
            <li><strong>2.</strong> Large bore OG/NG to continuous suction</li>
            <li><strong>3.</strong> Gentle ventilation - <strong>PIP ≤25 cmH2O</strong></li>
            <li><strong>4.</strong> Target preductal SpO2 <strong>85-95%</strong></li>
            <li><strong>5.</strong> Permissive hypercapnia (pCO2 45-70 mmHg)</li>
          </ul>
        </div>

        {/* Gentle Ventilation */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Gentle Ventilation Strategy</p>
          <p className="text-xs text-green-600 dark:text-green-400 mb-2">Cornerstone of CDH management - improves survival (95% vs 62%)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Parameter</th>
                  <th className="text-left py-1">Target</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1 font-medium">PIP</td><td className="py-1"><strong>≤25 cmH2O</strong> (goal &lt;20)</td></tr>
                <tr><td className="py-1 font-medium">PEEP</td><td className="py-1">3-5 cmH2O</td></tr>
                <tr><td className="py-1 font-medium">Rate</td><td className="py-1">40-60/min</td></tr>
                <tr><td className="py-1 font-medium">Tidal Volume</td><td className="py-1">4-6 mL/kg</td></tr>
                <tr><td className="py-1 font-medium">SpO2</td><td className="py-1"><strong>85-95%</strong></td></tr>
                <tr><td className="py-1 font-medium">pH</td><td className="py-1">&gt;7.20</td></tr>
                <tr><td className="py-1 font-medium">pCO2</td><td className="py-1">45-70 mmHg</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* HFOV */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">HFOV (if conventional fails)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>MAP: 13-17 cmH2O</li>
              <li>Amplitude: Adjust for chest wiggle</li>
              <li>Frequency: 10-12 Hz</li>
            </ul>
          </div>
        </div>

        {/* PPHN Management */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">PPHN Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <p className="font-medium">Optimize:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Sedation (morphine/fentanyl)</li>
                <li>Avoid stimulation</li>
                <li>Correct acidosis, hypoglycemia</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <p className="font-medium">Pulmonary Vasodilators:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>iNO 20 ppm (response variable in CDH)</li>
                <li>Sildenafil</li>
                <li>Milrinone</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <p className="font-medium">Hemodynamics:</p>
              <p>Target systemic BP &gt; pulmonary BP</p>
            </div>
          </div>
        </div>

        {/* Surgical Repair */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surgical Repair</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium text-amber-600 dark:text-amber-400 mb-1">
              CDH is a physiological emergency, NOT surgical emergency
            </p>
            <p className="mb-2">Delayed repair (24-72h or longer) preferred over emergent</p>
            <p className="font-medium mb-1">Criteria for Repair:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Hemodynamically stable</li>
              <li>Preductal SpO2 &gt;85% on reasonable support</li>
              <li>Adequate urine output (&gt;1 mL/kg/hr)</li>
              <li>Not on escalating support</li>
            </ul>
          </div>
        </div>

        {/* ECMO */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">ECMO Indications</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Preductal SaO2 &lt;85% despite maximal therapy</li>
            <li>pH &lt;7.20, pCO2 &gt;70 mmHg despite optimization</li>
            <li>OI &gt;40</li>
            <li>Hemodynamic instability/shock</li>
          </ul>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1"><strong>Survival:</strong> ~70-90% at high-volume centers</p>
            <p className="font-medium mb-1">Long-term issues:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Chronic lung disease</li>
              <li>Gastroesophageal reflux</li>
              <li>Feeding difficulties</li>
              <li>Scoliosis</li>
              <li>Neurodevelopmental impairment</li>
            </ul>
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: CDH EURO Consensus 2024, MOMBABY CDH Guidelines 2024, APSA Guidelines</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default CDHApproach;
