/**
 * Necrotizing Enterocolitis (NEC) Approach
 * Based on Modified Bell Staging
 * Reference: J Pediatr Surg, Clinics in Perinatology
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const NECApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

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
            <li>Most common GI emergency in premature infants</li>
            <li>Peak onset: 3-4 weeks in VLBW infants</li>
            <li>Breast milk is protective</li>
            <li>X-ray: pneumatosis intestinalis is pathognomonic</li>
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p>• Prematurity (primary)</p>
              <p>• Formula feeding</p>
              <p>• Hypoxic-ischemic events</p>
            </div>
            <div>
              <p>• PDA</p>
              <p>• Rapid feed advancement</p>
              <p>• Polycythemia</p>
            </div>
          </div>
        </div>

        {/* Clinical Signs */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Presentation</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">GI Signs:</p>
              <ul className="list-disc pl-4">
                <li>Feeding intolerance</li>
                <li>Abdominal distension</li>
                <li>Bilious residuals</li>
                <li>Blood in stool</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Systemic Signs:</p>
              <ul className="list-disc pl-4">
                <li>Apnea/bradycardia</li>
                <li>Temperature instability</li>
                <li>Lethargy</li>
                <li>Hypotension</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bell Staging */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Modified Bell Staging</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Stage</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Signs</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">X-ray</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr>
                <td className="py-2 font-medium">I - Suspected</td>
                <td>Nonspecific, guaiac+ stool</td>
                <td>Normal or mild ileus</td>
              </tr>
              <tr className="border-t border-slate-100 dark:border-slate-700">
                <td className="py-2 font-medium">II - Definite</td>
                <td>Absent bowel sounds, tenderness</td>
                <td className="font-medium text-red-600">Pneumatosis ± portal gas</td>
              </tr>
              <tr className="border-t border-slate-100 dark:border-slate-700">
                <td className="py-2 font-medium">III - Advanced</td>
                <td>Shock, DIC, peritonitis</td>
                <td className="font-medium text-red-600">Pneumoperitoneum</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Medical Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Bowel Rest:</p>
              <ul className="list-disc pl-4">
                <li>NPO</li>
                <li>OG/NG to suction</li>
                <li>TPN</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium">Antibiotics (7-14 days):</p>
              <p>Ampicillin + Gentamicin + Metronidazole</p>
              {w > 0 && (
                <div className="font-mono text-blue-600 dark:text-blue-400 mt-1">
                  <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                  <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
                  <p>Metronidazole: {(w * 7.5).toFixed(1)} mg q12h</p>
                </div>
              )}
            </div>
            
            <div>
              <p className="font-medium">Supportive:</p>
              <ul className="list-disc pl-4">
                <li>Fluid resuscitation</li>
                <li>Blood products as needed</li>
                <li>Respiratory support</li>
                <li>Serial abdominal X-rays (q6-8h)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* NPO Duration */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">NPO Duration by Stage</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Stage</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">NPO Duration</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">Stage I</td><td>3 days minimum</td></tr>
              <tr><td className="py-1">Stage II</td><td>7-10 days</td></tr>
              <tr><td className="py-1">Stage III</td><td>14+ days</td></tr>
            </tbody>
          </table>
        </div>

        {/* Surgical Indications */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surgical Consultation</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-medium text-red-600 dark:text-red-400">Absolute: Pneumoperitoneum (free air)</p>
            <p className="font-medium">Relative:</p>
            <ul className="list-disc pl-4">
              <li>Clinical deterioration despite treatment</li>
              <li>Fixed dilated loop (&gt;24-48h)</li>
              <li>Abdominal wall erythema</li>
              <li>Portal venous gas</li>
              <li>Persistent acidosis</li>
            </ul>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• <strong>Breast milk</strong> (most protective)</p>
            <p>• Standardized feeding protocols</p>
            <p>• Slow feed advancement (20-30 mL/kg/day)</p>
            <p>• Probiotics (emerging evidence)</p>
            <p>• Avoid unnecessary antibiotics</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default NECApproach;
