/**
 * Necrotizing Enterocolitis (NEC) Approach
 * Updated: 2024 NACHHD Recommendations & Bell Staging
 * Reference: NACHHD Working Group 2024, AAP, TIPQC Initiative
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const NECApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="nec-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Necrotizing Enterocolitis (NEC)</CardTitle>
        <CardDescription className="text-xs">Diagnosis, Staging & Management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 NACHHD Recommendations</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition & Epidemiology</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>NEC:</strong> Inflammatory intestinal disease primarily affecting preterm infants, characterized by intestinal necrosis of variable extent.</p>
            <p><strong>Incidence:</strong> 5-10% of VLBW infants (&lt;1500g)</p>
            <p><strong>Mortality:</strong> 20-30% overall; up to 50% if surgical</p>
            <p><strong>Peak onset:</strong> 2-3 weeks of life (inversely related to GA)</p>
            {ga > 0 && ga < 32 && (
              <p className="bg-red-50 p-1 rounded mt-1 text-red-600">
                ⚠️ At {ga} weeks GA: High risk for NEC - preventive measures critical
              </p>
            )}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors (2024)</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Major:</p>
              <p>• <strong>Prematurity</strong> (strongest)</p>
              <p>• VLBW (&lt;1500g)</p>
              <p>• Formula feeding</p>
              <p>• Hypoxic-ischemic injury</p>
            </div>
            <div>
              <p className="font-bold">Contributing:</p>
              <p>• Prolonged antibiotics</p>
              <p>• Hemodynamic instability</p>
              <p>• Umbilical catheters</p>
              <p>• PDA, CHD</p>
            </div>
            <div className="col-span-2 mt-1">
              <p className="font-bold">Dysbiosis factors:</p>
              <p>• Antibiotic exposure (alters microbiome)</p>
              <p>• Lack of breast milk (protective HMOs missing)</p>
              <p>• H2 blockers, PPIs (alter gut pH/flora)</p>
            </div>
          </div>
        </div>

        {/* Bell Staging - Updated */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-blue-700 mb-2">MODIFIED BELL STAGING (2024)</p>
          
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-yellow-700">Stage I - Suspected NEC</p>
            <div className="text-[8px] text-yellow-600 mt-1">
              <p><strong>Systemic:</strong> Temp instability, apnea, bradycardia, lethargy</p>
              <p><strong>GI:</strong> Mild distension, emesis, feeding intolerance, heme+ stool</p>
              <p><strong>X-ray:</strong> Normal or nonspecific dilation</p>
            </div>
          </div>

          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-orange-700">Stage II - Definite NEC</p>
            <div className="text-[8px] text-orange-600 mt-1">
              <p><strong>IIA (Mild):</strong> Above + grossly bloody stool, absent bowel sounds</p>
              <p><strong>IIB (Moderate):</strong> + Abdominal tenderness, acidosis, ↓platelets</p>
              <p><strong>X-ray:</strong> <strong>Pneumatosis intestinalis</strong> ± portal venous gas</p>
            </div>
          </div>

          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Stage III - Advanced NEC</p>
            <div className="text-[8px] text-red-600 mt-1">
              <p><strong>IIIA:</strong> Severely ill, peritonitis, marked distension, shock</p>
              <p><strong>IIIB:</strong> + <strong>Pneumoperitoneum</strong> (perforation)</p>
              <p><strong>X-ray:</strong> Pneumoperitoneum, ascites, fixed dilated loops</p>
              <p className="font-bold text-red-700">→ SURGICAL EMERGENCY</p>
            </div>
          </div>
        </div>

        {/* Clinical Signs */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Clinical Signs - Early Recognition</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-purple-600">
            <div>
              <p className="font-bold">Abdominal:</p>
              <p>• Distension (often first sign)</p>
              <p>• Tenderness, erythema</p>
              <p>• Visible bowel loops</p>
              <p>• Bloody stools</p>
            </div>
            <div>
              <p className="font-bold">Systemic:</p>
              <p>• Feeding intolerance</p>
              <p>• Apnea, bradycardia</p>
              <p>• Temperature instability</p>
              <p>• Lethargy, shock (late)</p>
            </div>
          </div>
        </div>

        {/* X-ray */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Radiographic Findings</p>
          <div className="text-[8px] text-indigo-600 space-y-0.5">
            <p><strong>Diagnostic:</strong></p>
            <p>• <strong>Pneumatosis intestinalis</strong> (intramural air - pathognomonic)</p>
            <p>• <strong>Portal venous gas</strong> (branching lucencies over liver)</p>
            <p>• <strong>Pneumoperitoneum</strong> (free air - perforation)</p>
            
            <p className="font-bold mt-1">Suggestive:</p>
            <p>• Dilated bowel loops</p>
            <p>• Fixed/persistent loop (suggests necrosis)</p>
            <p>• Asymmetric gas distribution</p>
            <p>• Thickened bowel wall, ascites</p>
          </div>
        </div>

        {/* Medical Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Medical Management (2024 Protocol)</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Immediate:</p>
            <p>• <strong>NPO</strong> - gastric decompression (NGT on suction)</p>
            <p>• IV fluids, TPN</p>
            <p>• Serial abdominal exams (q4-6h)</p>
            <p>• Serial X-rays (q6-8h initially)</p>
            
            <p className="font-bold text-cyan-400 mt-2">Antibiotics (10-14 days):</p>
            <p>Beta-lactam + Aminoglycoside + Anaerobic coverage:</p>
            {w > 0 && (
              <div className="font-mono text-green-400 mt-1 p-1 bg-gray-700 rounded">
                <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
                <p>Metronidazole: {(w * 7.5).toFixed(1)} mg q12h</p>
              </div>
            )}
            <p className="text-[7px] text-gray-400">Alternatives: Pip-tazo, meropenem per local protocols</p>
            
            <p className="font-bold text-purple-400 mt-2">Supportive:</p>
            <p>• Volume resuscitation, blood products</p>
            <p>• Inotropes if hypotensive</p>
            <p>• Respiratory support as needed</p>
            <p>• Correct coagulopathy, acidosis</p>
          </div>
        </div>

        {/* NPO Duration */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">NPO Duration by Stage</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-teal-100 dark:bg-teal-900/40">
                <th className="border border-teal-200 p-1">Stage</th>
                <th className="border border-teal-200 p-1">NPO Duration</th>
                <th className="border border-teal-200 p-1">Antibiotics</th>
              </tr>
            </thead>
            <tbody className="text-teal-600">
              <tr>
                <td className="border border-teal-200 p-1">Stage I</td>
                <td className="border border-teal-200 p-1">48-72 hours</td>
                <td className="border border-teal-200 p-1">48-72h (if cultures neg)</td>
              </tr>
              <tr>
                <td className="border border-teal-200 p-1">Stage IIA</td>
                <td className="border border-teal-200 p-1">7-10 days</td>
                <td className="border border-teal-200 p-1">7-10 days</td>
              </tr>
              <tr>
                <td className="border border-teal-200 p-1">Stage IIB</td>
                <td className="border border-teal-200 p-1">10-14 days</td>
                <td className="border border-teal-200 p-1">14 days</td>
              </tr>
              <tr>
                <td className="border border-teal-200 p-1">Stage III</td>
                <td className="border border-teal-200 p-1">14+ days</td>
                <td className="border border-teal-200 p-1">14+ days</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Surgical Indications */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Surgical Consultation (Urgent)</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p className="font-bold text-red-700">ABSOLUTE: Pneumoperitoneum (free air)</p>
            
            <p className="font-bold mt-1">Relative indications:</p>
            <p>• Clinical deterioration despite maximal medical therapy</p>
            <p>• Fixed dilated loop &gt;24-48 hours</p>
            <p>• Abdominal wall erythema/cellulitis</p>
            <p>• Portal venous gas (controversial)</p>
            <p>• Persistent metabolic acidosis</p>
            <p>• Positive paracentesis (brown/feculent)</p>
            
            <p className="font-bold mt-1">Surgery options:</p>
            <p>• Laparotomy with resection ± ostomy</p>
            <p>• Primary peritoneal drainage (ELBW, unstable)</p>
          </div>
        </div>

        {/* Prevention - 2024 NACHHD */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Prevention (2024 NACHHD/AAP)</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p className="font-bold text-green-700">Evidence-Based Strategies:</p>
            <p>• <strong>Human breast milk</strong> (most protective - AAP endorsed)</p>
            <p>• <strong>Donor milk</strong> if maternal milk unavailable</p>
            <p>• <strong>Probiotics</strong> (emerging evidence, AAP policy supports)</p>
            <p>• Standardized feeding protocols</p>
            <p>• Slow feed advancement (20-30 mL/kg/day)</p>
            
            <p className="font-bold mt-1">Avoid:</p>
            <p>• Unnecessary/prolonged antibiotics (dysbiosis)</p>
            <p>• H2 blockers/PPIs when possible</p>
            <p>• Bovine-based fortifiers in high-risk infants (consider human-derived)</p>
          </div>
        </div>

        {/* Outcomes */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Outcomes & Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Overall mortality: ~25% (35-40% if surgical)</p>
            <p>• ELBW (&lt;1000g): Up to 40-50% mortality</p>
            <p>• Short bowel syndrome: 10-20% of survivors</p>
            <p>• Stricture formation: 10-30% post-NEC</p>
            <p>• Neurodevelopmental impairment risk increased</p>
            <p>• TIPQC Initiative: Target 25% NEC reduction by 2026</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default NECApproach;
