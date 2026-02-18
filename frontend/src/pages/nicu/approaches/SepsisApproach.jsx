/**
 * Neonatal Sepsis Approach
 * Updated: AAP 2024/2025 Guidelines
 * References: AAP Pediatrics 2024, Red Book 2024-2027, EOSC Calculator
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Info, CheckCircle, ExternalLink } from "lucide-react";

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

        {/* Key Updates - AAP 2024 */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Current Practice Updates (AAP 2024)
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>EOS Calculator:</strong> Risk stratification for ≥34 weeks GA</li>
            <li><strong>Enhanced observation:</strong> Well-appearing at-risk neonates can be observed</li>
            <li><strong>Antibiotic stewardship:</strong> Safe to discontinue at 24-36h if asymptomatic + negative cultures</li>
            <li><strong>Start antibiotics within 1 hour</strong> if septic shock recognized</li>
            <li><strong>CRP/PCT:</strong> Not recommended for initial EOS evaluation</li>
          </ul>
        </div>

        {/* Classification */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Classification</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[400px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600 whitespace-nowrap">Type</th>
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600 whitespace-nowrap">Timing</th>
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600 whitespace-nowrap">Common Organisms</th>
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600 whitespace-nowrap">Source</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="py-2 px-2 border font-medium text-orange-600 dark:text-orange-400 whitespace-nowrap">Early-Onset (EOS)</td>
                  <td className="py-2 px-2 border whitespace-nowrap"><strong>&lt;72 hours</strong></td>
                  <td className="py-2 px-2 border whitespace-nowrap">GBS, E. coli, Listeria</td>
                  <td className="py-2 px-2 border whitespace-nowrap">Vertical (maternal)</td>
                </tr>
                <tr>
                  <td className="py-2 px-2 border font-medium text-purple-600 dark:text-purple-400 whitespace-nowrap">Late-Onset (LOS)</td>
                  <td className="py-2 px-2 border whitespace-nowrap"><strong>≥72 hours</strong></td>
                  <td className="py-2 px-2 border whitespace-nowrap">CoNS, S. aureus, GNR, Candida</td>
                  <td className="py-2 px-2 border whitespace-nowrap">Hospital/Community</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* EOS Risk Assessment - AAP 2024 */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            EOS Risk Assessment (AAP 2024) - For ≥35 weeks GA
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium">Three Approaches:</p>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">1. Categorical Risk Assessment:</p>
              <p>Based on maternal risk factors (GBS status, ROM duration, chorioamnionitis)</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">2. Neonatal EOS Calculator (EOSC):</p>
              <p>Multivariate risk calculation based on maternal + neonatal factors</p>
              <p className="text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                neonatalsepsiscalculator.kaiserpermanente.org
              </p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">3. Enhanced Observation:</p>
              <p>Serial clinical exams for well-appearing at-risk neonates</p>
              <p className="text-green-600 dark:text-green-400 mt-1">→ Reduces unnecessary investigations and antibiotics</p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1 text-orange-600 dark:text-orange-400">EOS:</p>
              <ul className="space-y-0.5 list-disc pl-4">
                <li><strong>GBS colonization</strong></li>
                <li>Prolonged ROM (&gt;18h)</li>
                <li><strong>Chorioamnionitis</strong></li>
                <li>Preterm delivery</li>
                <li>Maternal fever (&gt;38°C)</li>
                <li>Inadequate IAP</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1 text-purple-600 dark:text-purple-400">LOS:</p>
              <ul className="space-y-0.5 list-disc pl-4">
                <li><strong>Prematurity</strong></li>
                <li>Central lines (CLABSI)</li>
                <li>Prolonged TPN</li>
                <li>Prolonged intubation</li>
                <li>NEC, surgery</li>
                <li>Prolonged antibiotics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clinical Signs */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Clinical Signs
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2 text-red-600 dark:text-red-400 font-medium">Signs are often subtle and nonspecific!</p>
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
                <p>• Poor perfusion / mottling</p>
                <p>• Abdominal distension</p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Workup */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Diagnostic Workup</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Standard:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• <strong>Blood culture</strong> (≥1 mL) - BEFORE antibiotics</li>
                <li>• CBC with differential</li>
                <li>• CRP (serial at 0 and 24-48h) - for monitoring, not diagnosis</li>
              </ul>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Consider:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• <strong>LP</strong> - if clinically unstable, positive BC, or LOS</li>
                <li>• <strong>Urine culture</strong> - LOS (&gt;72 hours), or if &gt;7 days old</li>
                <li>• Procalcitonin (if available)</li>
              </ul>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded border border-amber-300">
              <p className="text-amber-700 dark:text-amber-400 text-[10px]">
                <strong>AAP 2024:</strong> CRP and PCT do NOT have a role in initial EOS evaluation - use for monitoring response to therapy
              </p>
            </div>
          </div>
        </div>

        {/* Empiric Antibiotics */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Empiric Antibiotic Therapy</p>
          
          <div className="space-y-3 text-xs">
            {/* EOS */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-orange-600 dark:text-orange-400 mb-1">Early-Onset Sepsis:</p>
              <p className="text-slate-600 dark:text-slate-300 mb-1">
                <strong>Ampicillin + Gentamicin</strong>
              </p>
              {w > 0 && (
                <div className="mt-1 font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                  <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h (50 mg/kg/dose)</p>
                  <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h (4 mg/kg/dose)</p>
                </div>
              )}
            </div>

            {/* LOS */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-purple-600 dark:text-purple-400 mb-1">Late-Onset Sepsis:</p>
              <p className="text-slate-600 dark:text-slate-300 mb-1">
                <strong>Vancomycin + Gentamicin</strong> (or Cefotaxime)
              </p>
              {w > 0 && (
                <div className="mt-1 font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                  <p>Vancomycin: {(w * 15).toFixed(0)} mg q8-12h (15 mg/kg/dose)</p>
                  <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
                </div>
              )}
            </div>

            {/* Meningitis */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-red-600 dark:text-red-400 mb-1">If Meningitis Suspected:</p>
              <p className="text-slate-600 dark:text-slate-300 mb-1">
                <strong>Ampicillin + Cefotaxime</strong> (or Ceftazidime)
              </p>
              {w > 0 && (
                <div className="mt-1 font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                  <p>Ampicillin: {(w * 100).toFixed(0)} mg q8h (100 mg/kg/dose - meningitis dose)</p>
                  <p>Cefotaxime: {(w * 50).toFixed(0)} mg q8h (50 mg/kg/dose)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Duration of Therapy (AAP 2024)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="text-left py-1 px-2 border border-slate-300 dark:border-slate-600">Scenario</th>
                  <th className="text-left py-1 px-2 border border-slate-300 dark:border-slate-600">Duration</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300">
                <tr className="bg-green-50 dark:bg-green-900/20">
                  <td className="py-1 px-2 border">Culture-negative, well, low clinical suspicion</td>
                  <td className="py-1 px-2 border font-medium text-green-700 dark:text-green-400">24-36 hours</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border">Culture-negative, equivocal exam</td>
                  <td className="py-1 px-2 border">36-48 hours</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border">Bacteremia (uncomplicated)</td>
                  <td className="py-1 px-2 border">7-10 days</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border">GBS meningitis</td>
                  <td className="py-1 px-2 border">14-21 days</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border">Gram-negative meningitis</td>
                  <td className="py-1 px-2 border">21 days (or 14 days after sterile CSF)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Septic Shock - Surviving Sepsis 2024 */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Septic Shock Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-medium text-red-600 dark:text-red-400">
              Start antimicrobials <strong>within 1 hour</strong> of recognition!
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Fluid resuscitation: 10-20 mL/kg NS boluses (max 40-60 mL/kg in first hour)</li>
              <li>Vasopressors if fluid-refractory (dopamine → epinephrine/norepinephrine)</li>
              <li>Consider hydrocortisone if catecholamine-resistant</li>
              <li>Monitor lactate, glucose, calcium</li>
            </ul>
            {w > 0 && (
              <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded">
                <p className="font-medium">Fluid bolus for {w} kg:</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">
                  {(w * 10).toFixed(0)}-{(w * 20).toFixed(0)} mL NS over 5-10 min
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Supportive Care */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Supportive Care</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• Respiratory support as needed</p>
            <p>• Glucose monitoring and correction</p>
            <p>• Temperature regulation</p>
            <p>• Nutritional support (TPN if NPO prolonged)</p>
            <p>• Consider IVIG only if severe neutropenia (controversial)</p>
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: AAP Pediatrics 2024, Red Book 2024-2027, Surviving Sepsis Campaign Pediatric Guidelines 2024</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default SepsisApproach;
