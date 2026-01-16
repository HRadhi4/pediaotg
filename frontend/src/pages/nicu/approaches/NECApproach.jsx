/**
 * Necrotizing Enterocolitis (NEC) Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
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
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <p className="text-[8px] text-amber-600">
            NEC is an acquired gastrointestinal disease primarily affecting premature neonates, characterized by variable damage to the intestinal tract ranging from mucosal injury to full-thickness necrosis and perforation.
          </p>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• Prematurity (main factor)</div>
            <div>• Low birth weight</div>
            <div>• Formula feeding</div>
            <div>• Hypoxic-ischemic events</div>
            <div>• PDA</div>
            <div>• Polycythemia</div>
            <div>• Exchange transfusion</div>
            <div>• H2 blockers / PPI use</div>
            <div>• Rapid advancement of feeds</div>
            <div>• Hyperosmolar formulas</div>
          </div>
        </div>

        {/* Clinical Presentation */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Clinical Presentation</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-orange-600">
            <div>
              <p className="font-bold mb-1">GI Signs:</p>
              <p>• Feeding intolerance</p>
              <p>• Abdominal distension</p>
              <p>• Gastric residuals (bilious)</p>
              <p>• Blood in stool</p>
              <p>• Absent bowel sounds</p>
            </div>
            <div>
              <p className="font-bold mb-1">Systemic Signs:</p>
              <p>• Apnea/bradycardia</p>
              <p>• Temperature instability</p>
              <p>• Lethargy</p>
              <p>• Poor perfusion</p>
              <p>• Hypotension</p>
            </div>
          </div>
        </div>

        {/* Bell Staging */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-blue-700 mb-2">MODIFIED BELL STAGING</p>
          
          {/* Stage I */}
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-yellow-700">Stage I - Suspected NEC</p>
            <div className="grid grid-cols-2 gap-2 text-[7px] text-yellow-600 mt-1">
              <div>
                <p className="font-bold">IA - Mild:</p>
                <p>• Temperature instability</p>
                <p>• Apnea, bradycardia</p>
                <p>• Mild abdominal distension</p>
                <p>• Gastric residuals</p>
                <p>• Guaiac + stool</p>
              </div>
              <div>
                <p className="font-bold">IB - Mild:</p>
                <p>• Same as IA</p>
                <p>• Grossly bloody stool</p>
              </div>
            </div>
            <p className="text-[7px] text-yellow-700 mt-1"><strong>X-ray:</strong> Normal or mild ileus</p>
          </div>

          {/* Stage II */}
          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-orange-700">Stage II - Definite NEC</p>
            <div className="grid grid-cols-2 gap-2 text-[7px] text-orange-600 mt-1">
              <div>
                <p className="font-bold">IIA - Moderately Ill:</p>
                <p>• Stage I signs</p>
                <p>• Absent bowel sounds</p>
                <p>• ± Abdominal tenderness</p>
              </div>
              <div>
                <p className="font-bold">IIB - Moderately to Severely Ill:</p>
                <p>• Stage IIA signs</p>
                <p>• Definite tenderness</p>
                <p>• ± Abdominal cellulitis</p>
                <p>• ± RLQ mass</p>
                <p>• Metabolic acidosis</p>
                <p>• Thrombocytopenia</p>
              </div>
            </div>
            <p className="text-[7px] text-orange-700 mt-1"><strong>X-ray:</strong> Intestinal dilation, ileus, <strong className="text-red-600">pneumatosis intestinalis</strong>, ± portal venous gas</p>
          </div>

          {/* Stage III */}
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Stage III - Advanced NEC</p>
            <div className="grid grid-cols-2 gap-2 text-[7px] text-red-600 mt-1">
              <div>
                <p className="font-bold">IIIA - Severely Ill, Intact Bowel:</p>
                <p>• Stage IIB signs</p>
                <p>• Hypotension</p>
                <p>• Severe apnea</p>
                <p>• DIC</p>
                <p>• Severe metabolic acidosis</p>
              </div>
              <div>
                <p className="font-bold">IIIB - Perforated Bowel:</p>
                <p>• Stage IIIA signs</p>
                <p>• Evidence of perforation</p>
              </div>
            </div>
            <p className="text-[7px] text-red-700 mt-1"><strong>X-ray:</strong> Definite ascites, <strong className="text-red-800">pneumoperitoneum (IIIB)</strong></p>
          </div>
        </div>

        {/* Diagnostic Workup */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Diagnostic Workup</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Laboratory:</strong></p>
            <div className="grid grid-cols-2 gap-1">
              <div>• CBC with differential</div>
              <div>• Blood culture</div>
              <div>• CRP</div>
              <div>• ABG/VBG</div>
              <div>• Electrolytes</div>
              <div>• Coagulation panel</div>
            </div>
            <p className="mt-2"><strong>Imaging:</strong></p>
            <p>• Serial abdominal X-rays (AP and left lateral decubitus)</p>
            <p>• Frequency: Every 6-8 hours in acute phase</p>
          </div>
        </div>

        {/* X-ray Findings */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Key X-ray Findings</p>
          <div className="text-[8px] space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-amber-400 font-bold">Early Signs:</p>
                <p>• Ileus</p>
                <p>• Bowel wall thickening</p>
                <p>• Dilated loops</p>
              </div>
              <div>
                <p className="text-red-400 font-bold">Pathognomonic:</p>
                <p>• Pneumatosis intestinalis</p>
                <p>• Portal venous gas</p>
                <p>• Pneumoperitoneum (perf)</p>
              </div>
            </div>
            <p className="text-yellow-400 mt-1">⚠️ "Football sign" = free air under diaphragm</p>
          </div>
        </div>

        {/* Medical Management */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Medical Management</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p className="font-bold">Supportive Care:</p>
            <p>• NPO - Bowel rest</p>
            <p>• Gastric decompression (OG/NG on low intermittent suction)</p>
            <p>• IV fluid resuscitation</p>
            <p>• TPN (start early)</p>
            <p>• Correct metabolic abnormalities</p>
            <p>• Blood products as needed (platelets, FFP)</p>
            
            <p className="font-bold mt-2">Antibiotics (7-14 days):</p>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded mt-1">
              <p><strong>First-line:</strong> Ampicillin + Gentamicin + Metronidazole</p>
              {w > 0 && (
                <div className="mt-1 text-green-600 font-mono">
                  <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h (50 mg/kg/dose)</p>
                  <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h (4 mg/kg/dose)</p>
                  <p>Metronidazole: {(w * 7.5).toFixed(1)} mg q12h (7.5 mg/kg/dose)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NPO Duration */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">NPO Duration by Stage</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-green-100 dark:bg-green-900/40">
                <th className="border border-green-200 p-1">Stage</th>
                <th className="border border-green-200 p-1">NPO Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-green-200 p-1">Stage I (suspected)</td>
                <td className="border border-green-200 p-1 font-bold">3 days minimum</td>
              </tr>
              <tr>
                <td className="border border-green-200 p-1">Stage II (definite)</td>
                <td className="border border-green-200 p-1 font-bold">7-10 days</td>
              </tr>
              <tr>
                <td className="border border-green-200 p-1">Stage III (advanced)</td>
                <td className="border border-green-200 p-1 font-bold">14 days minimum</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Surgical Indications */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Surgical Consultation Indications</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p className="font-bold text-red-800">Absolute:</p>
            <p>• Pneumoperitoneum (free air) - EMERGENCY</p>
            
            <p className="font-bold mt-2">Relative:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Clinical deterioration despite treatment</div>
              <div>• Fixed dilated loop (&gt;24-48h)</div>
              <div>• Abdominal wall erythema</div>
              <div>• Persistent acidosis</div>
              <div>• Portal venous gas</div>
              <div>• Abdominal mass</div>
            </div>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Prevention Strategies</p>
          <div className="text-[8px] text-teal-600 space-y-0.5">
            <p>• <strong>Breast milk feeding</strong> (most protective)</p>
            <p>• Standardized feeding protocols</p>
            <p>• Slow advancement of feeds</p>
            <p>• Probiotics (evidence growing)</p>
            <p>• Avoid unnecessary antibiotics</p>
            <p>• Avoid H2 blockers when possible</p>
            <p>• Cautious feeding with PDA treatment</p>
          </div>
        </div>

        {/* Complications */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Long-term Complications</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-gray-600 dark:text-gray-400">
            <div>• Intestinal strictures (10-35%)</div>
            <div>• Short bowel syndrome</div>
            <div>• TPN-associated cholestasis</div>
            <div>• Neurodevelopmental delay</div>
            <div>• Growth failure</div>
            <div>• Recurrent NEC</div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default NECApproach;
