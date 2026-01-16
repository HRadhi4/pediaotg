/**
 * PPHN (Persistent Pulmonary Hypertension) Approach
 * Updated: 2024 Guidelines
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PPHNApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="pphn-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Persistent Pulmonary Hypertension (PPHN)</CardTitle>
        <CardDescription className="text-xs">Failure of Postnatal Circulatory Transition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Elevated PVR with R→L shunting causing severe hypoxemia</li>
            <li><strong>Key finding:</strong> Pre-post ductal SpO2 difference &gt;10%</li>
            <li><strong>Echo:</strong> TR jet &gt;2/3 systemic pressure, R→L or bidirectional shunt</li>
            <li><strong>iNO:</strong> First-line pulmonary vasodilator</li>
          </ul>
        </div>

        {/* Etiology */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Etiology</p>
          <div className="grid grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Parenchymal:</p>
              <ul className="list-disc pl-3 space-y-0.5">
                <li>MAS</li>
                <li>RDS</li>
                <li>Pneumonia</li>
              </ul>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Maldevelopment:</p>
              <ul className="list-disc pl-3 space-y-0.5">
                <li>CDH</li>
                <li>Pulm hypoplasia</li>
                <li>Alveolar capillary dysplasia</li>
              </ul>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Idiopathic:</p>
              <ul className="list-disc pl-3 space-y-0.5">
                <li>Perinatal asphyxia</li>
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
            <p className="font-medium mt-2 mb-1">Echo criteria:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>TR jet velocity (estimates PA pressure)</li>
              <li>Flat or bowing septum</li>
              <li>R→L or bidirectional PDA/PFO shunt</li>
            </ul>
          </div>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management Strategy</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">1. Optimize oxygenation:</p>
              <p>• Target SpO2 92-97%</p>
              <p>• Avoid hyperoxia initially, then titrate</p>
              <p>• Mechanical ventilation as needed</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">2. Avoid triggers:</p>
              <p>• Minimize stimulation/suctioning</p>
              <p>• Sedation (morphine, fentanyl)</p>
              <p>• Correct acidosis, hypothermia</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">3. Support blood pressure:</p>
              <p>• Target MAP 45-55 mmHg</p>
              <p>• Volume, then vasopressors if needed</p>
            </div>
          </div>
        </div>

        {/* iNO */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Inhaled Nitric Oxide (iNO)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Indication:</p>
            <p>OI ≥25 or severely hypoxemic despite optimal ventilation</p>
            <p className="font-mono bg-slate-100 dark:bg-slate-900 p-1 rounded my-2">
              OI = (MAP × FiO2 × 100) / PaO2
            </p>
            <p className="font-medium mb-1">Dosing:</p>
            <p>• Start: 20 ppm</p>
            <p>• If response, maintain then wean</p>
            <p>• Wean by 5 ppm to 5 ppm, then 1 ppm at a time</p>
            <p className="text-red-600 dark:text-red-400 mt-2 font-medium">
              ⚠️ Do not abruptly discontinue - causes rebound PHN
            </p>
          </div>
        </div>

        {/* Other Therapies */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Additional Therapies</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">If iNO-refractory:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Sildenafil:</strong> 0.5-2 mg/kg PO q6-8h</li>
              <li><strong>Milrinone:</strong> 0.25-0.75 mcg/kg/min</li>
              <li><strong>Prostacyclin:</strong> Epoprostenol or iloprost</li>
              <li><strong>ECMO:</strong> If OI &gt;40 and failing other therapies</li>
            </ul>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p>Sildenafil: <span className="font-mono text-blue-600">{(w * 0.5).toFixed(1)}-{(w * 2).toFixed(1)} mg PO q6-8h</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>• Survival ~80-90% with modern therapy</p>
            <p>• Risk of neurodevelopmental issues</p>
            <p>• Long-term follow-up needed</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PPHNApproach;
