/**
 * NEC (Necrotizing Enterocolitis) Approach
 * Updated: 2024/2025 Evidence-Based Guidelines
 * References: NICHD 2024, AAP, Wisconsin NEC Guidelines 2025
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const NECApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="nec-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Necrotizing Enterocolitis (NEC)</CardTitle>
        <CardDescription className="text-xs">Modified Bell Staging & Management - 2024/2025 Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Key Points
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Timing:</strong> Typically 2-3 weeks of life in preterms</li>
            <li><strong>Protection:</strong> Human milk significantly reduces NEC risk (50-80%)</li>
            <li><strong>Serial exams:</strong> Clinical deterioration can be rapid</li>
            <li><strong>Abdominal X-ray:</strong> Pneumatosis intestinalis = pathognomonic</li>
            <li><strong>Surgery rate:</strong> 20-30% require surgical intervention</li>
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1 text-red-600 dark:text-red-400">Major:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Prematurity</strong> (most important)</li>
                <li><strong>Absence of human milk</strong></li>
                <li>Intestinal ischemia</li>
                <li>Abnormal intestinal microbiome</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Contributing:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Hypotension/PDA</li>
                <li>Polycythemia</li>
                <li>Exchange transfusion</li>
                <li>Prolonged antibiotics</li>
                <li>Acid-suppressing medications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Clinical Features
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">GI signs:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Feeding intolerance</li>
                <li>Abdominal distension</li>
                <li>Bloody stools</li>
                <li>Bilious aspirates/vomiting</li>
                <li>Abdominal wall discoloration</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Systemic signs:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Temperature instability</li>
                <li>Apnea/bradycardia</li>
                <li>Lethargy</li>
                <li>Hypotension (late)</li>
                <li>DIC (advanced)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modified Bell Staging */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Modified Bell Staging</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600">Stage</th>
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600">Clinical</th>
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600">Radiologic</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300">
                <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                  <td className="py-2 px-2 border font-bold text-yellow-700 dark:text-yellow-400">IA - Suspected</td>
                  <td className="py-2 px-2 border">Nonspecific signs, increased residuals, lethargy</td>
                  <td className="py-2 px-2 border">Normal or mild ileus</td>
                </tr>
                <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                  <td className="py-2 px-2 border font-bold text-yellow-700 dark:text-yellow-400">IB - Suspected</td>
                  <td className="py-2 px-2 border">+ Gross bloody stool</td>
                  <td className="py-2 px-2 border">Normal or mild ileus</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-900/20">
                  <td className="py-2 px-2 border font-bold text-orange-600 dark:text-orange-400">IIA - Definite, mild</td>
                  <td className="py-2 px-2 border">+ Absent bowel sounds, abdominal tenderness</td>
                  <td className="py-2 px-2 border"><strong>Pneumatosis intestinalis</strong> ± portal gas</td>
                </tr>
                <tr className="bg-orange-50 dark:bg-orange-900/20">
                  <td className="py-2 px-2 border font-bold text-orange-600 dark:text-orange-400">IIB - Definite, moderate</td>
                  <td className="py-2 px-2 border">+ Systemic illness, metabolic acidosis</td>
                  <td className="py-2 px-2 border">Extensive pneumatosis, ascites</td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-900/20">
                  <td className="py-2 px-2 border font-bold text-red-600 dark:text-red-400">IIIA - Advanced</td>
                  <td className="py-2 px-2 border">Severely ill, DIC, hypotension</td>
                  <td className="py-2 px-2 border">Prominent ascites, no perforation</td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-900/20">
                  <td className="py-2 px-2 border font-bold text-red-600 dark:text-red-400">IIIB - Perforated</td>
                  <td className="py-2 px-2 border">+ Peritonitis, shock</td>
                  <td className="py-2 px-2 border"><strong>Pneumoperitoneum</strong> (free air)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Management by Stage */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Management by Stage (2024/2025 Guidelines)
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-yellow-600 dark:text-yellow-400">Stage I (Suspected):</p>
              <ul className="ml-3 space-y-0.5">
                <li>• NPO 48-72 hours (rest intestine)</li>
                <li>• IV fluids + TPN</li>
                <li>• NG tube to low intermittent suction</li>
                <li>• Antibiotics × 3 days</li>
                <li>• Serial abdominal exams and X-rays q6-8h</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-orange-600 dark:text-orange-400">Stage II (Definite):</p>
              <ul className="ml-3 space-y-0.5">
                <li>• NPO <strong>7-14 days</strong> (TPN)</li>
                <li>• Antibiotics × <strong>10-14 days</strong></li>
                <li>• NG decompression (continuous)</li>
                <li>• Serial abdominal X-rays (minimum 48 hours)</li>
                <li>• <strong>Surgical consult</strong></li>
                <li>• Monitor for perforation, sepsis, DIC</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-red-600 dark:text-red-400">Stage III (Advanced/Perforated):</p>
              <ul className="ml-3 space-y-0.5">
                <li>• NPO ≥14 days</li>
                <li>• Aggressive fluid resuscitation</li>
                <li>• Blood products for DIC</li>
                <li>• Vasopressor support</li>
                <li>• <strong>SURGICAL INTERVENTION</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Antibiotics */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Antibiotic Coverage</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2"><strong>Standard triple therapy:</strong></p>
            <p className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded mb-2">
              <strong>Ampicillin + Gentamicin + Metronidazole</strong> (or Clindamycin)
            </p>
            <p className="mb-2"><strong>Coverage:</strong> Gram-positive, Gram-negative, and anaerobes</p>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">Ampicillin: {(w * 50).toFixed(0)} mg q12h (50 mg/kg/dose)</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">Gentamicin: {(w * 4).toFixed(1)} mg q24h (4 mg/kg/dose)</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">Metronidazole: {(w * 7.5).toFixed(1)} mg q12h (7.5 mg/kg/dose)</p>
              </div>
            )}
          </div>
        </div>

        {/* Prevention - AAP/NICHD 2024 */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Prevention Strategies (NICHD/AAP 2024)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5 font-bold">1.</span>
              <span><strong>Human milk</strong> - MOST IMPORTANT: reduces NEC risk by 50-80%. Mother's own milk preferred; donor milk when unavailable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5 font-bold">2.</span>
              <span><strong>Antenatal corticosteroids</strong> - reduces NEC risk in preterm infants</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5 font-bold">3.</span>
              <span><strong>Standardized feeding protocols</strong> - slow, consistent advancement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5 font-bold">4.</span>
              <span><strong>Probiotics</strong> - growing evidence supports use in preterms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5 font-bold">5.</span>
              <span><strong>Minimize antibiotic exposure</strong> - avoid disrupting intestinal microbiome</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5 font-bold">6.</span>
              <span><strong>Careful feed advancement</strong> - 15-30 mL/kg/day in stable preterms</span>
            </li>
          </ul>
          <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-[10px]">
            <p className="text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> Formula does not cause NEC - the absence of human milk is the key risk factor (FDA/CDC/NIH 2024)
            </p>
          </div>
        </div>

        {/* Surgical Indications */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Surgical Indications</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium text-red-600 dark:text-red-400 mb-1">Absolute:</p>
            <ul className="list-disc pl-4 space-y-0.5 mb-2">
              <li><strong>Pneumoperitoneum</strong> (free air) - EMERGENCY</li>
              <li>Positive paracentesis (stool/bacteria in peritoneal fluid)</li>
            </ul>
            <p className="font-medium mb-1">Relative:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Clinical deterioration despite maximal medical therapy</li>
              <li>Portal venous gas (controversial)</li>
              <li>Fixed dilated loop on serial X-rays (&gt;24-36h)</li>
              <li>Abdominal wall erythema/crepitus</li>
              <li>Palpable abdominal mass</li>
            </ul>
          </div>
        </div>

        {/* Outcomes */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Outcomes & Complications</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Survival:</strong> 60-80% with medical management; 40-60% surgical NEC</li>
              <li><strong>Strictures:</strong> 10-40% post-NEC (mostly colonic)</li>
              <li><strong>Short bowel syndrome:</strong> If extensive resection</li>
              <li><strong>Neurodevelopmental impairment:</strong> Higher risk with surgical NEC</li>
            </ul>
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: NICHD NEC Working Group 2024, Wisconsin NEC Guidelines 2025, AAP/FDA/CDC/NIH Statement 2024</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default NECApproach;
