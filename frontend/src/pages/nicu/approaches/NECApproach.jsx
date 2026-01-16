/**
 * Necrotizing Enterocolitis (NEC) Approach
 * Updated: 2024 Guidelines
 * Simplified design matching Apnea approach
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const NECApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="nec-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Necrotizing Enterocolitis (NEC)</CardTitle>
        <CardDescription className="text-xs">Bell Staging & Management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 NACHHD Recommendations</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2024)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Incidence:</strong> 5-10% of VLBW infants</p>
            <p><strong>Mortality:</strong> 20-30% (up to 50% if surgical)</p>
            <p><strong>Prevention:</strong> Human milk is most protective</p>
            <p><strong>Surgery:</strong> Pneumoperitoneum = absolute indication</p>
            {ga > 0 && ga < 32 && (
              <p className="bg-amber-100 p-1 rounded mt-1 text-red-600">
                ⚠️ At {ga} weeks: High NEC risk
              </p>
            )}
          </div>
        </div>

        {/* Bell Staging */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Modified Bell Staging</p>
          <div className="grid grid-cols-3 gap-2 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-yellow-600">Stage I</p>
              <p>Suspected</p>
              <p>Nonspecific signs</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-orange-600">Stage II</p>
              <p>Definite</p>
              <p>Pneumatosis ± PVG</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-red-600">Stage III</p>
              <p>Advanced</p>
              <p>Perforation/shock</p>
            </div>
          </div>
        </div>

        {/* X-ray Findings */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Radiographic Findings</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Diagnostic:</strong></p>
            <p>• <strong>Pneumatosis intestinalis</strong> (pathognomonic)</p>
            <p>• Portal venous gas</p>
            <p>• Pneumoperitoneum (perforation)</p>
            <p><strong>Suggestive:</strong> Dilated loops, fixed loop, thickened wall</p>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Medical Management</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Immediate:</p>
            <p>• NPO, NGT to suction</p>
            <p>• IV fluids, TPN</p>
            <p>• Serial X-rays q6-8h</p>
            
            <p className="font-bold text-cyan-400 mt-2">Antibiotics (10-14 days):</p>
            <p>Ampicillin + Gentamicin + Metronidazole</p>
            {w > 0 && (
              <div className="text-green-400 font-mono mt-1">
                <p>Amp: {(w * 50).toFixed(0)} mg q12h</p>
                <p>Gent: {(w * 4).toFixed(1)} mg q24h</p>
                <p>Metro: {(w * 7.5).toFixed(1)} mg q12h</p>
              </div>
            )}
          </div>
        </div>

        {/* NPO Duration */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">NPO Duration</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-teal-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Stage I</p>
              <p>48-72 hours</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Stage IIA</p>
              <p>7-10 days</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Stage IIB</p>
              <p>10-14 days</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Stage III</p>
              <p>14+ days</p>
            </div>
          </div>
        </div>

        {/* Surgery */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Surgical Indications</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p className="font-bold">ABSOLUTE: Pneumoperitoneum</p>
            <p><strong>Relative:</strong></p>
            <p>• Clinical deterioration despite max medical Rx</p>
            <p>• Fixed dilated loop &gt;24-48h</p>
            <p>• Abdominal wall erythema</p>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Prevention</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p>• <strong>Human breast milk</strong> (most protective)</p>
            <p>• Donor milk if mom's unavailable</p>
            <p>• Probiotics (emerging evidence)</p>
            <p>• Standardized feeding protocols</p>
            <p>• Avoid unnecessary antibiotics</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Mortality: ~25% (40-50% if surgical)</p>
            <p>• Short bowel syndrome: 10-20%</p>
            <p>• Stricture formation: 10-30%</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default NECApproach;
