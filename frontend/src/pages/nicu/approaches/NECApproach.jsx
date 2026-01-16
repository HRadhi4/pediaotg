/**
 * NEC (Necrotizing Enterocolitis) Approach
 * Updated: 2024 Evidence-Based Guidelines
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const NECApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="nec-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Necrotizing Enterocolitis (NEC)</CardTitle>
        <CardDescription className="text-xs">Modified Bell Staging & Management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Timing:</strong> Typically 2-3 weeks of life in preterms</li>
            <li><strong>Protection:</strong> Human milk significantly reduces NEC risk</li>
            <li><strong>Serial exams:</strong> Clinical deterioration can be rapid</li>
            <li><strong>Abdominal X-ray:</strong> Pneumatosis = pathognomonic for NEC</li>
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
                <li>Formula feeding</li>
                <li>Intestinal ischemia</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Contributing:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Hypotension/PDA</li>
                <li>Polycythemia</li>
                <li>Exchange transfusion</li>
                <li>Rapid feed advancement</li>
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
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Stage</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Clinical</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Radiologic</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <td className="py-1.5 font-bold text-yellow-600">IA - Suspected</td>
                <td>Nonspecific signs, increased residuals</td>
                <td>Normal or mild ileus</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <td className="py-1.5 font-bold text-yellow-600">IB - Suspected</td>
                <td>+ Gross bloody stool</td>
                <td>Normal or mild ileus</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <td className="py-1.5 font-bold text-orange-600">IIA - Definite, mild</td>
                <td>+ Abdominal tenderness</td>
                <td><strong>Pneumatosis</strong> ± portal gas</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <td className="py-1.5 font-bold text-orange-600">IIB - Definite, moderate</td>
                <td>+ Systemic illness, acidosis</td>
                <td>Extensive pneumatosis, ascites</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <td className="py-1.5 font-bold text-red-600">IIIA - Advanced</td>
                <td>Severely ill, DIC</td>
                <td>Prominent ascites, no perf</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold text-red-600">IIIB - Perforated</td>
                <td>+ Peritonitis</td>
                <td><strong>Pneumoperitoneum</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management by Stage</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-yellow-600">Stage I (Suspected):</p>
              <p>• NPO 48-72 hours</p>
              <p>• IV fluids, antibiotics × 3 days</p>
              <p>• Serial abdominal exams/X-rays</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-orange-600">Stage II (Definite):</p>
              <p>• NPO 7-14 days (TPN)</p>
              <p>• Antibiotics × 7-14 days</p>
              <p>• NG decompression</p>
              <p>• Surgical consult</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-red-600">Stage III (Advanced/Perforated):</p>
              <p>• NPO ≥14 days</p>
              <p>• Aggressive resuscitation</p>
              <p>• <strong>Surgical intervention</strong></p>
            </div>
          </div>
        </div>

        {/* Antibiotics */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Antibiotic Coverage</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1"><strong>Standard regimen:</strong></p>
            <p>• Ampicillin + Gentamicin + Metronidazole (or Clindamycin)</p>
            <p className="mt-2"><strong>Covers:</strong> Gram-positive, Gram-negative, and anaerobes</p>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p>Ampicillin: <span className="font-mono text-blue-600">{(w * 50).toFixed(0)} mg q12h</span></p>
                <p>Metronidazole: <span className="font-mono text-blue-600">{(w * 7.5).toFixed(1)} mg q12h</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Prevention */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li><strong>Human milk</strong> - reduces NEC risk by 50-80%</li>
            <li>Standardized feeding protocols</li>
            <li>Probiotics (controversial but growing evidence)</li>
            <li>Avoid unnecessary antibiotics</li>
            <li>Careful advancement of feeds (10-20 mL/kg/day)</li>
          </ul>
        </div>

        {/* Surgical Indications */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surgical Indications</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium text-red-600 mb-1">Absolute:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Pneumoperitoneum</strong> (free air)</li>
              <li>Positive paracentesis</li>
            </ul>
            <p className="font-medium mt-2 mb-1">Relative:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Clinical deterioration despite treatment</li>
              <li>Portal venous gas</li>
              <li>Fixed dilated loop on serial X-rays</li>
              <li>Abdominal wall erythema</li>
            </ul>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default NECApproach;
