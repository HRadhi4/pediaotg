/**
 * PPHN (Persistent Pulmonary Hypertension) Approach
 * Updated: 2025 AAP Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const PPHNApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="pphn-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Persistent Pulmonary Hypertension (PPHN)</CardTitle>
        <CardDescription className="text-xs">Failure of Postnatal Circulatory Transition - AAP/AHA 2025 Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Key Points
          </p>
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
          <div className="grid grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Parenchymal:</p>
              <ul className="list-disc pl-3 space-y-0.5">
                <li>MAS</li>
                <li>RDS</li>
                <li>Pneumonia/Sepsis</li>
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
              <li>Flat or bowing septum toward LV</li>
              <li>R→L or bidirectional PDA/PFO shunt</li>
              <li>Absence of structural heart disease</li>
            </ul>
          </div>
        </div>

        {/* Oxygenation Index */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Oxygenation Index (OI)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-mono bg-white dark:bg-slate-900 p-2 rounded text-center text-sm">
              OI = (MAP × FiO2 × 100) / PaO2
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                <p className="font-medium text-green-700 dark:text-green-400">OI &lt;15</p>
                <p className="text-[10px]">Mild</p>
              </div>
              <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                <p className="font-medium text-yellow-700 dark:text-yellow-400">OI 15-25</p>
                <p className="text-[10px]">Moderate</p>
              </div>
              <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded">
                <p className="font-medium text-red-700 dark:text-red-400">OI &gt;25</p>
                <p className="text-[10px]">Severe - Consider iNO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management - AAP 2025 */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Management Strategy (AAP 2025)
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">1. Oxygen Therapy (First-line):</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Target preductal SpO2 <strong>90-97%</strong></li>
                <li>• Avoid hypoxemia (&lt;85%) and hyperoxemia (&gt;97%)</li>
                <li>• Supplemental O2 produces vasodilation via endogenous NO</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">2. Mechanical Ventilation:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Gentle ventilation strategy</li>
                <li>• Optimal PEEP, low PIP</li>
                <li>• Permissive hypercapnia acceptable</li>
                <li>• Avoid barotrauma</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">3. Supportive Care:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Sedation (morphine, fentanyl) - reduce catecholamine release</li>
                <li>• Minimize stimulation/suctioning</li>
                <li>• Correct acidosis, hypothermia, hypoglycemia</li>
                <li>• Surfactant if RDS/MAS with surfactant deficiency</li>
                <li>• Broad-spectrum antibiotics (rule out sepsis/pneumonia)</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">4. Hemodynamic Support:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Target MAP 45-55 mmHg (systemic BP &gt; pulmonary BP)</li>
                <li>• Volume resuscitation first</li>
                <li>• Vasopressors: dopamine, norepinephrine, vasopressin</li>
              </ul>
            </div>
          </div>
        </div>

        {/* iNO - AAP 2025 */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Inhaled Nitric Oxide (iNO) - First-line Vasodilator</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-white dark:bg-slate-900 rounded mb-2">
              <p className="font-medium">Indication (AAP 2025):</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Infants ≥34 weeks with confirmed PPHN</li>
                <li>• <strong>OI &gt;20</strong> (or severely hypoxemic despite optimal ventilation)</li>
                <li>• No significant LV dysfunction</li>
                <li>• Absence of CDH (relative contraindication)</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded mb-2">
              <p className="font-medium">Dosing:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• <strong>Start: 20 ppm</strong></li>
                <li>• If response: maintain, then wean gradually</li>
                <li>• Wean by 5 ppm until 5 ppm reached</li>
                <li>• Then wean by 1 ppm at a time</li>
                <li>• Max treatment duration: typically 14 days</li>
              </ul>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
              <p className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Critical Warning
              </p>
              <p className="text-red-600 dark:text-red-300">
                Do NOT abruptly discontinue - causes severe rebound pulmonary hypertension
              </p>
            </div>
            <p className="mt-2 text-amber-600 dark:text-amber-400">
              Note: ~50% of infants with PPHN do not respond to iNO
            </p>
          </div>
        </div>

        {/* Sildenafil - AAP 2025 Alternative */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
          <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Sildenafil - Alternative Vasodilator (AAP 2025)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2"><strong>When to use:</strong> iNO unavailable, iNO-refractory, or as adjunctive therapy</p>
            <div className="p-2 bg-white dark:bg-slate-900 rounded mb-2">
              <p className="font-medium">Dosing (Oral/NG):</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Start: <strong>0.5-1 mg/kg q6h</strong></li>
                <li>• May increase to <strong>2 mg/kg q6h</strong> if worsening</li>
                <li>• Duration: 3-6 days typically</li>
                <li>• Most effective for mild-moderate PPHN</li>
              </ul>
            </div>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">
                  Sildenafil: {(w * 0.5).toFixed(1)}-{(w * 2).toFixed(1)} mg PO/NG q6h
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Other Therapies */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Other Therapies (iNO-refractory)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Milrinone:</strong> 0.25-0.75 mcg/kg/min (inotrope + vasodilator)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Prostacyclin:</strong> Epoprostenol or iloprost (inhaled/IV)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Bosentan:</strong> Endothelin receptor antagonist (limited neonatal data)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ECMO */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-700 dark:text-red-400 mb-2">ECMO Indications</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>OI &gt;40</strong> despite maximal therapy</li>
              <li>Unable to maintain preductal SpO2 &gt;85%</li>
              <li>Refractory hypotension/shock</li>
              <li>Severe acidosis (pH &lt;7.15)</li>
            </ul>
            <p className="mt-2"><strong>Contraindications:</strong> Lethal anomalies, severe IVH (≥Grade III), extreme prematurity (&lt;34 weeks), irreversible lung disease</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Survival ~80-90% with modern therapy (iNO, ECMO)</li>
              <li>Risk of neurodevelopmental impairment</li>
              <li>Sensorineural hearing loss - screen before discharge</li>
              <li>Long-term pulmonary and cardiac follow-up needed</li>
            </ul>
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: AAP/AHA 2025 Guidelines, MOMBABY PPHN Guidelines 2025</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default PPHNApproach;
