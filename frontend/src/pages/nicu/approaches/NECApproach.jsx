/**
 * NEC (Necrotizing Enterocolitis) Approach
 * Updated: 2024/2025 Evidence-Based Guidelines
 * Design: Standardized to match HypoglycemiaApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const NECApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="nec-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Necrotizing Enterocolitis (NEC)</CardTitle>
        <CardDescription className="text-xs">Modified Bell Staging - NICHD/AAP 2024</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Timing:</strong> Typically 2-3 weeks of life in preterms</li>
            <li><strong>Protection:</strong> Human milk reduces NEC risk by 50-80%</li>
            <li><strong>Key finding:</strong> Pneumatosis intestinalis = pathognomonic</li>
            <li><strong>Surgery rate:</strong> 20-30% require surgical intervention</li>
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Major:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Prematurity</strong> (most important)</li>
                <li><strong>Absence of human milk</strong></li>
                <li>Intestinal ischemia</li>
                <li>Abnormal microbiome</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Contributing:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Hypotension/PDA</li>
                <li>Polycythemia</li>
                <li>Exchange transfusion</li>
                <li>Prolonged antibiotics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Clinical Features</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">GI signs:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Feeding intolerance</li>
                <li>Abdominal distension</li>
                <li>Bloody stools</li>
                <li>Bilious aspirates</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Systemic signs:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Temperature instability</li>
                <li>Apnea/bradycardia</li>
                <li>Lethargy</li>
                <li>Hypotension (late)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modified Bell Staging */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Modified Bell Staging</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Stage</th>
                  <th className="text-left py-1">Clinical</th>
                  <th className="text-left py-1">Radiologic</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                  <td className="py-1 font-bold text-yellow-700 dark:text-yellow-400">I - Suspected</td>
                  <td className="py-1">Nonspecific, increased residuals</td>
                  <td className="py-1">Normal or mild ileus</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-900/20">
                  <td className="py-1 font-bold text-orange-600 dark:text-orange-400">IIA - Mild</td>
                  <td className="py-1">Absent bowel sounds, tenderness</td>
                  <td className="py-1 font-bold">Pneumatosis</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-900/20">
                  <td className="py-1 font-bold text-orange-600 dark:text-orange-400">IIB - Moderate</td>
                  <td className="py-1">Systemic illness, acidosis</td>
                  <td className="py-1">Extensive pneumatosis, ascites</td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-900/20">
                  <td className="py-1 font-bold text-red-600 dark:text-red-400">IIIA - Advanced</td>
                  <td className="py-1">Severely ill, DIC</td>
                  <td className="py-1">Prominent ascites</td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-900/20">
                  <td className="py-1 font-bold text-red-600 dark:text-red-400">IIIB - Perforated</td>
                  <td className="py-1">Peritonitis, shock</td>
                  <td className="py-1 font-bold">Pneumoperitoneum</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management by Stage</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Stage I (Suspected):</p>
              <p>NPO 48-72h, IV fluids + TPN, NG suction, Antibiotics × 3 days</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Stage II (Definite):</p>
              <p>NPO 7-14 days, Antibiotics × 10-14 days, Surgical consult</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Stage III (Advanced):</p>
              <p>NPO ≥14 days, Aggressive resuscitation, SURGICAL INTERVENTION</p>
            </div>
          </div>
        </div>

        {/* Antibiotics */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Antibiotic Coverage</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Ampicillin + Gentamicin + Metronidazole</p>
            <p className="mb-2 text-slate-500">Coverage: Gram-positive, Gram-negative, and anaerobes</p>
            {w > 0 && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p className="font-mono text-blue-600">Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                <p className="font-mono text-blue-600">Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
                <p className="font-mono text-blue-600">Metronidazole: {(w * 7.5).toFixed(1)} mg q12h</p>
              </div>
            )}
          </div>
        </div>

        {/* Prevention */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention (NICHD/AAP 2024)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li><strong>Human milk</strong> - MOST IMPORTANT (reduces NEC 50-80%)</li>
            <li>Antenatal corticosteroids</li>
            <li>Standardized feeding protocols</li>
            <li>Probiotics (growing evidence)</li>
            <li>Minimize antibiotic exposure</li>
            <li>Careful feed advancement (15-30 mL/kg/day)</li>
          </ul>
        </div>

        {/* Surgical Indications */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Surgical Indications</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Absolute:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Pneumoperitoneum</strong> (free air) - EMERGENCY</li>
              <li>Positive paracentesis</li>
            </ul>
            <p className="font-medium mt-2 mb-1">Relative:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Clinical deterioration despite max therapy</li>
              <li>Fixed dilated loop &gt;24-36h</li>
              <li>Abdominal wall erythema</li>
            </ul>
          </div>
        </div>

        {/* Outcomes */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Outcomes</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li><strong>Survival:</strong> 60-80% medical; 40-60% surgical</li>
            <li><strong>Strictures:</strong> 10-40% post-NEC</li>
            <li>Short bowel syndrome if extensive resection</li>
          </ul>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: NICHD NEC Working Group 2024, Wisconsin NEC Guidelines 2025, AAP/FDA/CDC/NIH Statement 2024</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default NECApproach;
