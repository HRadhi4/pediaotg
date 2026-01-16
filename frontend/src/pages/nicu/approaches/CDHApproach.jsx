/**
 * CDH (Congenital Diaphragmatic Hernia) Approach
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CDHApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="cdh-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Congenital Diaphragmatic Hernia (CDH)</CardTitle>
        <CardDescription className="text-xs">Bochdalek & Morgagni Hernia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Left-sided:</strong> 85% (Bochdalek - posterolateral)</li>
            <li><strong>Pulmonary hypoplasia:</strong> Both lungs affected, ipsilateral worse</li>
            <li><strong>PPHN:</strong> Major contributor to mortality</li>
            <li><strong>NO bag-mask ventilation</strong> - immediate intubation</li>
          </ul>
        </div>

        {/* Delivery Room */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Delivery Room - CRITICAL</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Immediate intubation</strong> - avoid bag-mask (gastric distension)</li>
              <li>Large bore OG tube to continuous suction</li>
              <li>Gentle ventilation - avoid high pressures</li>
              <li>Target preductal SpO2 85-95%</li>
              <li>Permissive hypercapnia (pCO2 45-65 acceptable)</li>
            </ul>
          </div>
        </div>

        {/* Ventilation Strategy */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Gentle Ventilation Strategy</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <tbody>
                <tr><td className="py-1 font-medium">PIP</td><td>≤25 cmH2O (goal &lt;20)</td></tr>
                <tr><td className="py-1 font-medium">PEEP</td><td>3-5 cmH2O</td></tr>
                <tr><td className="py-1 font-medium">Rate</td><td>40-60/min</td></tr>
                <tr><td className="py-1 font-medium">FiO2</td><td>Titrate for preductal SpO2 85-95%</td></tr>
                <tr><td className="py-1 font-medium">Goal pH</td><td>&gt;7.20</td></tr>
                <tr><td className="py-1 font-medium">Goal pCO2</td><td>45-65 mmHg acceptable</td></tr>
              </tbody>
            </table>
            <p className="text-red-600 dark:text-red-400 mt-2 font-medium">
              ⚠️ HFOV may be needed if conventional ventilation inadequate
            </p>
          </div>
        </div>

        {/* PPHN Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">PPHN Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Optimize:</p>
              <p>• Sedation (morphine/fentanyl)</p>
              <p>• Avoid stimulation/suctioning</p>
              <p>• Maintain normothermia</p>
              <p>• Correct acidosis, hypoglycemia</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Pulmonary vasodilators:</p>
              <p>• iNO 20 ppm (first-line)</p>
              <p>• Sildenafil, milrinone (adjuncts)</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Blood pressure:</p>
              <p>• Target systemic BP &gt; pulmonary BP</p>
              <p>• Vasopressors: dopamine, norepinephrine, vasopressin</p>
            </div>
          </div>
        </div>

        {/* Surgical Repair */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surgical Repair</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Timing:</p>
            <p>• Delayed repair (24-72h or longer) preferred over emergent</p>
            <p>• Stabilize PPHN first</p>
            <p className="font-medium mt-2 mb-1">Criteria for repair:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Hemodynamically stable</li>
              <li>Preductal SpO2 &gt;85% on reasonable support</li>
              <li>Adequate urine output</li>
              <li>No escalating support</li>
            </ul>
          </div>
        </div>

        {/* ECMO */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">ECMO Indications</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>OI &gt;40 despite optimal management</li>
              <li>Inability to maintain preductal SpO2 &gt;85%</li>
              <li>Metabolic acidosis with pH &lt;7.15</li>
              <li>Inadequate oxygen delivery</li>
            </ul>
            <p className="mt-2"><strong>Contraindications:</strong> Severe anomalies, lethal chromosomal abnormality, IVH grade ≥3</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>• Survival ~70-90% at experienced centers</p>
            <p>• Long-term issues: CLD, GER, feeding difficulties, scoliosis</p>
            <p>• Neurodevelopmental follow-up essential</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default CDHApproach;
