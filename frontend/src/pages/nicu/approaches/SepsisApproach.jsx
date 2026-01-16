/**
 * Neonatal Sepsis Approach
 * Based on AAP 2019 Guidelines & 2024 Updates
 * Reference: AAP Clinical Report, Red Book
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SepsisApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="sepsis-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Sepsis</CardTitle>
        <CardDescription className="text-xs">AAP 2019 / Red Book Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Updates */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Current Practice Updates</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>EOS Calculator:</strong> Risk stratification for ≥34 weeks (neonatalsepsiscalculator.kaiserpermanente.org)</li>
            <li><strong>Serial observation:</strong> Acceptable for well-appearing at-risk neonates</li>
            <li><strong>24-hour rule-out:</strong> Safe to D/C antibiotics if asymptomatic + negative cultures</li>
            <li><strong>Duration:</strong> 36-48 hours for culture-negative sepsis evaluation</li>
          </ul>
        </div>

        {/* Classification */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Classification</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Type</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Timing</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Common Organisms</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr>
                <td className="py-2 font-medium">Early-Onset (EOS)</td>
                <td className="py-2">&lt;72 hours</td>
                <td className="py-2">GBS, E. coli, Listeria</td>
              </tr>
              <tr className="border-t border-slate-100 dark:border-slate-700">
                <td className="py-2 font-medium">Late-Onset (LOS)</td>
                <td className="py-2">≥72 hours</td>
                <td className="py-2">CoNS, S. aureus, GNR, Candida</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">EOS:</p>
              <ul className="space-y-0.5 list-disc pl-4">
                <li>GBS colonization</li>
                <li>Prolonged ROM (&gt;18h)</li>
                <li>Chorioamnionitis</li>
                <li>Preterm delivery</li>
                <li>Maternal fever</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">LOS:</p>
              <ul className="space-y-0.5 list-disc pl-4">
                <li>Prematurity</li>
                <li>Central lines</li>
                <li>Prolonged TPN</li>
                <li>Prolonged intubation</li>
                <li>NEC, surgery</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clinical Signs */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Signs</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2 text-red-600 dark:text-red-400 font-medium">Signs are often subtle and nonspecific</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p>• Temperature instability</p>
                <p>• Lethargy / irritability</p>
                <p>• Poor feeding</p>
                <p>• Apnea / bradycardia</p>
              </div>
              <div>
                <p>• Respiratory distress</p>
                <p>• Hypotension</p>
                <p>• Poor perfusion</p>
                <p>• Abdominal distension</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workup */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Diagnostic Workup</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Standard:</p>
              <p>• Blood culture (≥1 mL) - BEFORE antibiotics</p>
              <p>• CBC with differential</p>
              <p>• CRP (serial at 0 and 24-48h)</p>
            </div>
            <div>
              <p className="font-medium">Consider:</p>
              <p>• LP (if clinically unstable, positive blood culture, or LOS)</p>
              <p>• Urine culture (LOS, &gt;72 hours old)</p>
              <p>• Procalcitonin (if available)</p>
            </div>
          </div>
        </div>

        {/* Empiric Antibiotics */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Empiric Antibiotic Therapy</p>
          
          <div className="space-y-3 text-xs">
            {/* EOS */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Early-Onset Sepsis:</p>
              <p className="text-slate-600 dark:text-slate-300">Ampicillin + Gentamicin</p>
              {w > 0 && (
                <div className="mt-1 font-mono text-blue-600 dark:text-blue-400">
                  <p>Ampicillin: {ga < 34 ? (w * 50).toFixed(0) : (w * 50).toFixed(0)} mg q12h (50 mg/kg/dose)</p>
                  <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h (4 mg/kg/dose)</p>
                </div>
              )}
            </div>

            {/* LOS */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Late-Onset Sepsis:</p>
              <p className="text-slate-600 dark:text-slate-300">Vancomycin + Gentamicin (or cefotaxime)</p>
              {w > 0 && (
                <div className="mt-1 font-mono text-blue-600 dark:text-blue-400">
                  <p>Vancomycin: {(w * 15).toFixed(0)} mg q8-12h (15 mg/kg/dose)</p>
                  <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
                </div>
              )}
            </div>

            {/* Meningitis */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">If Meningitis Suspected:</p>
              <p className="text-slate-600 dark:text-slate-300">Ampicillin + Cefotaxime (or Ceftazidime)</p>
              {w > 0 && (
                <div className="mt-1 font-mono text-blue-600 dark:text-blue-400">
                  <p>Ampicillin: {(w * 100).toFixed(0)} mg q8h (100 mg/kg/dose for meningitis)</p>
                  <p>Cefotaxime: {(w * 50).toFixed(0)} mg q8h</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Duration of Therapy</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Scenario</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Duration</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">Culture-negative, well</td><td>36-48 hours</td></tr>
              <tr><td className="py-1">Bacteremia (uncomplicated)</td><td>7-10 days</td></tr>
              <tr><td className="py-1">GBS meningitis</td><td>14-21 days</td></tr>
              <tr><td className="py-1">Gram-negative meningitis</td><td>21 days (or 14 days after negative CSF)</td></tr>
            </tbody>
          </table>
        </div>

        {/* Supportive Care */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Supportive Care</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• Respiratory support as needed</p>
            <p>• Fluid resuscitation (10-20 mL/kg NS boluses)</p>
            <p>• Vasopressors if refractory hypotension (dopamine, epinephrine)</p>
            <p>• Glucose monitoring and correction</p>
            <p>• Consider IVIG only if severe neutropenia (controversial)</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SepsisApproach;
