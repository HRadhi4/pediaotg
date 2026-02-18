/**
 * Neonatal Sepsis Approach
 * Updated: AAP 2024/2025 Guidelines
 * Design: Standardized to match HypoglycemiaApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SepsisApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = postnatalAge || 0;

  return (
    <Card data-testid="sepsis-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Sepsis</CardTitle>
        <CardDescription className="text-xs">AAP 2024/2025 & Red Book Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Updates */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Current Practice Updates (AAP 2024)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>EOS Calculator:</strong> Risk stratification for ≥34 weeks GA</li>
            <li><strong>Enhanced observation:</strong> Well-appearing at-risk neonates can be observed</li>
            <li><strong>Antibiotic stewardship:</strong> Safe to discontinue at 24-36h if asymptomatic + negative cultures</li>
            <li><strong>Septic shock:</strong> Start antibiotics within 1 hour</li>
            <li><strong>CRP/PCT:</strong> Not recommended for initial EOS evaluation</li>
          </ul>
        </div>

        {/* Classification */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Classification</p>
          <div className="overflow-x-auto pb-2" style={{ margin: '0 -12px', padding: '0 12px' }}>
            <table className="text-xs border-collapse" style={{ minWidth: '600px', width: '100%' }}>
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-2 pr-3" style={{ whiteSpace: 'nowrap' }}>Type</th>
                  <th className="text-left py-2 pr-3" style={{ whiteSpace: 'nowrap' }}>Timing</th>
                  <th className="text-left py-2 pr-3" style={{ whiteSpace: 'nowrap' }}>Common Organisms</th>
                  <th className="text-left py-2" style={{ whiteSpace: 'nowrap' }}>Source</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="py-2 pr-3 font-medium text-orange-600 dark:text-orange-400">Early-Onset (EOS)</td>
                  <td className="py-2 pr-3"><strong>&lt;72 hours</strong></td>
                  <td className="py-2 pr-3">GBS, E. coli, Listeria</td>
                  <td className="py-2">Vertical (maternal)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-medium text-purple-600 dark:text-purple-400">Late-Onset (LOS)</td>
                  <td className="py-2 pr-3"><strong>≥72 hours</strong></td>
                  <td className="py-2 pr-3">CoNS, S. aureus, GNR, Candida</td>
                  <td className="py-2">Hospital/Community</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* EOS Risk Assessment */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">EOS Risk Assessment (AAP 2024) - For ≥35 weeks GA</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium">Three Approaches:</p>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">1. Categorical Risk Assessment:</p>
              <p>Based on maternal risk factors (GBS status, ROM duration, chorioamnionitis)</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">2. Neonatal EOS Calculator (EOSC):</p>
              <p>Multivariate risk calculation based on maternal + neonatal factors</p>
              <p className="text-blue-600 dark:text-blue-400 mt-1">→ neonatalsepsiscalculator.kaiserpermanente.org</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">3. Enhanced Observation:</p>
              <p>Serial clinical exams for well-appearing at-risk neonates</p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">EOS:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>GBS colonization</strong></li>
                <li>Prolonged ROM (&gt;18h)</li>
                <li><strong>Chorioamnionitis</strong></li>
                <li>Preterm delivery</li>
                <li>Maternal fever (&gt;38°C)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">LOS:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Prematurity</strong></li>
                <li>Central lines (CLABSI)</li>
                <li>Prolonged TPN</li>
                <li>Prolonged intubation</li>
                <li>NEC, surgery</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clinical Signs */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Clinical Signs</p>
          <p className="text-xs text-red-600 dark:text-red-400 mb-2">Signs are often subtle and nonspecific!</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Temperature instability</li>
              <li>Lethargy / irritability</li>
              <li>Poor feeding</li>
              <li>Apnea / bradycardia</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Respiratory distress</li>
              <li>Hypotension</li>
              <li>Poor perfusion / mottling</li>
              <li>Abdominal distension</li>
            </ul>
          </div>
        </div>

        {/* Diagnostic Workup */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Diagnostic Workup</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Standard:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Blood culture</strong> (≥1 mL) - BEFORE antibiotics</li>
                <li>CBC with differential</li>
                <li>CRP (serial at 0 and 24-48h) - for monitoring, not diagnosis</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Consider:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>LP</strong> - if clinically unstable, positive BC, or LOS</li>
                <li><strong>Urine culture</strong> - LOS (&gt;72 hours), or if &gt;7 days old</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Empiric Antibiotics */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Empiric Antibiotic Therapy</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Early-Onset Sepsis: Ampicillin + Gentamicin</p>
              {w > 0 && (
                <div className="mt-1">
                  <p className="font-mono text-blue-600">Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                  <p className="font-mono text-blue-600">Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
                </div>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Late-Onset Sepsis: Vancomycin + Gentamicin</p>
              {w > 0 && (
                <div className="mt-1">
                  <p className="font-mono text-blue-600">Vancomycin: {(w * 15).toFixed(0)} mg q8-12h</p>
                  <p className="font-mono text-blue-600">Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
                </div>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">If Meningitis Suspected: Ampicillin + Cefotaxime</p>
              {w > 0 && (
                <div className="mt-1">
                  <p className="font-mono text-blue-600">Ampicillin: {(w * 100).toFixed(0)} mg q8h (meningitis dose)</p>
                  <p className="font-mono text-blue-600">Cefotaxime: {(w * 50).toFixed(0)} mg q8h</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Duration of Therapy</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Scenario</th>
                  <th className="text-left py-1">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50 dark:bg-green-900/20">
                  <td className="py-1">Culture-negative, well, low suspicion</td>
                  <td className="font-bold text-green-700 dark:text-green-400">24-36 hours</td>
                </tr>
                <tr>
                  <td className="py-1">Culture-negative, equivocal exam</td>
                  <td>36-48 hours</td>
                </tr>
                <tr>
                  <td className="py-1">Bacteremia (uncomplicated)</td>
                  <td>7-10 days</td>
                </tr>
                <tr>
                  <td className="py-1">GBS meningitis</td>
                  <td>14-21 days</td>
                </tr>
                <tr>
                  <td className="py-1">Gram-negative meningitis</td>
                  <td>21 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Septic Shock */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Septic Shock Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium text-red-600 dark:text-red-400 mb-2">
              ⚠️ Start antimicrobials within 1 hour of recognition!
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Fluid resuscitation: 10-20 mL/kg NS boluses (max 40-60 mL/kg in first hour)</li>
              <li>Vasopressors if fluid-refractory (dopamine → epinephrine/norepinephrine)</li>
              <li>Consider hydrocortisone if catecholamine-resistant</li>
            </ul>
            {w > 0 && (
              <div className="mt-2 p-2 bg-white dark:bg-slate-800 rounded">
                <p className="font-medium">Fluid bolus for {w} kg:</p>
                <p className="font-mono text-blue-600">{(w * 10).toFixed(0)}-{(w * 20).toFixed(0)} mL NS over 5-10 min</p>
              </div>
            )}
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: AAP Pediatrics 2024, Red Book 2024-2027, Surviving Sepsis Campaign 2024</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default SepsisApproach;
