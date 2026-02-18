/**
 * PPHN (Persistent Pulmonary Hypertension) Approach
 * Updated: 2025 AAP Guidelines
 * Design: Standardized to match HypoglycemiaApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PPHNApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="pphn-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Persistent Pulmonary Hypertension (PPHN)</CardTitle>
        <CardDescription className="text-xs">AAP/AHA 2025 Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Elevated PVR with R→L shunting causing severe hypoxemia</li>
            <li><strong>Key finding:</strong> Pre-post ductal SpO2 difference &gt;10%</li>
            <li><strong>Echo:</strong> TR jet &gt;2/3 systemic pressure, R→L or bidirectional shunt</li>
            <li><strong>iNO:</strong> First-line pulmonary vasodilator for OI &gt;20</li>
          </ul>
        </div>

        {/* Etiology */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Etiology</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Parenchymal:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>MAS</li>
                <li>RDS</li>
                <li>Pneumonia</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Maldevelopment:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>CDH</li>
                <li>Pulm hypoplasia</li>
                <li>ACD</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Idiopathic:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Asphyxia</li>
                <li>Maternal SSRIs</li>
                <li>Unknown</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Diagnosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Clinical:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Severe hypoxemia disproportionate to lung disease</li>
              <li>Labile oxygenation</li>
              <li>Pre-post ductal SpO2 gradient &gt;10%</li>
            </ul>
            <p className="font-medium mt-2 mb-1">Echo:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>TR jet velocity (estimates PA pressure)</li>
              <li>R→L or bidirectional PDA/PFO shunt</li>
              <li>Absence of structural heart disease</li>
            </ul>
          </div>
        </div>

        {/* Oxygenation Index */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Oxygenation Index (OI)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-mono bg-white dark:bg-slate-800 p-2 rounded text-center mb-2">
              OI = (MAP × FiO2 × 100) / PaO2
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                <p className="font-bold text-green-700 dark:text-green-400">OI &lt;15</p>
                <p>Mild</p>
              </div>
              <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                <p className="font-bold text-yellow-700 dark:text-yellow-400">OI 15-25</p>
                <p>Moderate</p>
              </div>
              <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded">
                <p className="font-bold text-red-700 dark:text-red-400">OI &gt;25</p>
                <p>Severe - iNO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management (AAP 2025)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">1. Oxygen: Target preductal SpO2 90-97%</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">2. Ventilation: Gentle, avoid barotrauma</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">3. Supportive:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Sedation (morphine/fentanyl)</li>
                <li>Correct acidosis, hypothermia, hypoglycemia</li>
                <li>Surfactant if RDS/MAS</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">4. Hemodynamics: MAP 45-55 mmHg</p>
              <p>Vasopressors: dopamine, norepinephrine, vasopressin</p>
            </div>
          </div>
        </div>

        {/* iNO */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Inhaled Nitric Oxide (iNO)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Indication:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Infants ≥34 weeks with confirmed PPHN</li>
              <li><strong>OI &gt;20</strong></li>
              <li>No significant LV dysfunction</li>
            </ul>
            <p className="font-medium mt-2 mb-1">Dosing:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Start: <strong>20 ppm</strong></li>
              <li>Wean gradually (5 ppm steps, then 1 ppm)</li>
            </ul>
            <p className="text-red-600 dark:text-red-400 mt-2 font-medium">
              ⚠️ Do NOT abruptly discontinue - causes rebound pulmonary hypertension
            </p>
            <p className="text-slate-500 mt-1">~50% of infants do not respond to iNO</p>
          </div>
        </div>

        {/* Sildenafil */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Sildenafil - Alternative Vasodilator</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1"><strong>When:</strong> iNO unavailable, iNO-refractory, or adjunctive</p>
            <p><strong>Dose:</strong> 0.5-2 mg/kg PO/NG q6h</p>
            {w > 0 && (
              <p className="font-mono text-blue-600 mt-1">
                For {w} kg: {(w * 0.5).toFixed(1)}-{(w * 2).toFixed(1)} mg q6h
              </p>
            )}
          </div>
        </div>

        {/* ECMO */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">ECMO Indications</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li><strong>OI &gt;40</strong> despite maximal therapy</li>
            <li>Unable to maintain preductal SpO2 &gt;85%</li>
            <li>Refractory hypotension/shock</li>
            <li>Severe acidosis (pH &lt;7.15)</li>
          </ul>
          <p className="text-xs text-slate-500 mt-2">
            <strong>Contraindications:</strong> Lethal anomalies, severe IVH, &lt;34 weeks
          </p>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Survival ~80-90% with modern therapy</li>
            <li>Risk of neurodevelopmental impairment</li>
            <li>Screen for sensorineural hearing loss</li>
          </ul>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: AAP/AHA 2025 Guidelines, MOMBABY PPHN Guidelines 2025</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default PPHNApproach;
