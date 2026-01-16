/**
 * Neonatal Anemia Approach
 * Updated: 2024 JAMA Clinical Practice Guideline & ETTNO/TOP Trials
 * Reference: JAMA Network Open 2024, Transfusion Medicine Reviews
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AnemiaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const pnaWeeks = Math.ceil(pna / 7);

  return (
    <Card data-testid="anemia-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Anemia</CardTitle>
        <CardDescription className="text-xs">Assessment & Transfusion Guidelines</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 JAMA Guidelines (ETTNO/TOP Evidence)</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Neonatal anemia:</strong> Hemoglobin or hematocrit below normal for gestational and postnatal age.</p>
            <p className="font-bold mt-1">Normal values vary significantly:</p>
            <table className="w-full text-[7px] mt-1">
              <thead>
                <tr className="bg-amber-100">
                  <th className="border p-1">Age</th>
                  <th className="border p-1">Hb (g/dL)</th>
                  <th className="border p-1">Hct (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">Term cord blood</td>
                  <td className="border p-1">16.5 (13.5-19.5)</td>
                  <td className="border p-1">51 (42-60)</td>
                </tr>
                <tr>
                  <td className="border p-1">Term 2 weeks</td>
                  <td className="border p-1">16.5 (13-20)</td>
                  <td className="border p-1">50</td>
                </tr>
                <tr>
                  <td className="border p-1">Preterm 28 wk</td>
                  <td className="border p-1">14.5</td>
                  <td className="border p-1">45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Causes */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Causes of Neonatal Anemia</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Blood Loss:</p>
              <p>• Fetomaternal hemorrhage</p>
              <p>• Twin-twin transfusion</p>
              <p>• Placental abruption/previa</p>
              <p>• Cord accidents</p>
              <p>• Internal hemorrhage (IVH)</p>
              <p>• <strong>Iatrogenic (phlebotomy)</strong></p>
            </div>
            <div>
              <p className="font-bold">Hemolysis:</p>
              <p>• Rh/ABO incompatibility</p>
              <p>• G6PD deficiency</p>
              <p>• Hereditary spherocytosis</p>
              <p>• Infection/sepsis</p>
              <p>• DIC</p>
            </div>
            <div className="col-span-2">
              <p className="font-bold">Decreased Production:</p>
              <p>• <strong>Anemia of prematurity</strong> (most common in preterm)</p>
              <p>• Diamond-Blackfan anemia</p>
              <p>• Congenital infections (CMV, parvovirus B19)</p>
            </div>
          </div>
        </div>

        {/* Anemia of Prematurity */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Anemia of Prematurity</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Pathophysiology:</strong></p>
            <p>• Shortened RBC lifespan (40-60 days vs 120 in adults)</p>
            <p>• Inadequate EPO response to hypoxia</p>
            <p>• Rapid growth with blood volume expansion</p>
            <p>• <strong>Frequent phlebotomy losses</strong> (major contributor)</p>
            <p>• Low iron stores at birth</p>
            
            <p className="mt-2"><strong>Nadir timing:</strong></p>
            <p>• Term: 8-12 weeks (Hb ~10-11 g/dL) - physiologic</p>
            <p>• Preterm: <strong>4-8 weeks</strong> (Hb may fall to 7-8 g/dL)</p>
          </div>
        </div>

        {/* Clinical Signs */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Clinical Signs of Significant Anemia</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-orange-600">
            <div>• Pallor</div>
            <div>• Tachycardia</div>
            <div>• Tachypnea</div>
            <div>• Poor feeding</div>
            <div>• Apnea/bradycardia episodes</div>
            <div>• Poor weight gain</div>
            <div>• Increased oxygen requirement</div>
            <div>• Metabolic acidosis (lactic)</div>
          </div>
        </div>

        {/* 2024 JAMA Transfusion Thresholds - CRITICAL UPDATE */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">2024 JAMA TRANSFUSION THRESHOLDS (&lt;30 weeks GA)</p>
          <p className="text-[7px] text-center text-green-600 mb-2">Based on ETTNO/TOP Trials - Restrictive Strategy Recommended</p>
          
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-green-100 dark:bg-green-900/40">
                <th className="border border-green-200 p-1">Postnatal Week</th>
                <th className="border border-green-200 p-1">With Resp Support*</th>
                <th className="border border-green-200 p-1">No/Minimal Support</th>
              </tr>
            </thead>
            <tbody className="text-green-600">
              <tr className={pnaWeeks === 1 ? "bg-green-200 dark:bg-green-800" : ""}>
                <td className="border border-green-200 p-1 font-bold">Week 1</td>
                <td className="border border-green-200 p-1 font-bold">&lt;11 g/dL</td>
                <td className="border border-green-200 p-1 font-bold">&lt;10 g/dL</td>
              </tr>
              <tr className={pnaWeeks === 2 ? "bg-green-200 dark:bg-green-800" : ""}>
                <td className="border border-green-200 p-1 font-bold">Week 2</td>
                <td className="border border-green-200 p-1 font-bold">&lt;10 g/dL</td>
                <td className="border border-green-200 p-1 font-bold">&lt;8.5 g/dL</td>
              </tr>
              <tr className={pnaWeeks >= 3 ? "bg-green-200 dark:bg-green-800" : ""}>
                <td className="border border-green-200 p-1 font-bold">Week 3+</td>
                <td className="border border-green-200 p-1 font-bold">&lt;9 g/dL</td>
                <td className="border border-green-200 p-1 font-bold">&lt;7 g/dL</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[7px] text-green-500 mt-1">*Respiratory support = ≥1 L/min NC or positive pressure ventilation</p>
          {ga > 0 && ga < 30 && pna > 0 && (
            <p className="text-[8px] text-blue-600 bg-blue-50 p-1 rounded mt-2">
              For this infant ({ga} wk GA, day {pna}): Use Week {pnaWeeks} thresholds above
            </p>
          )}
        </div>

        {/* Traditional Thresholds */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Alternative: Clinical Status-Based Thresholds</p>
          <p className="text-[7px] text-purple-500 mb-1">For term infants or when week-based not applicable</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-purple-100 dark:bg-purple-900/40">
                <th className="border border-purple-200 p-1">Clinical Status</th>
                <th className="border border-purple-200 p-1">Hb Threshold</th>
              </tr>
            </thead>
            <tbody className="text-purple-600">
              <tr>
                <td className="border border-purple-200 p-1">Severe cardiorespiratory disease</td>
                <td className="border border-purple-200 p-1 font-bold">&lt;12 g/dL</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Moderate respiratory support</td>
                <td className="border border-purple-200 p-1 font-bold">&lt;10 g/dL</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Minimal respiratory support</td>
                <td className="border border-purple-200 p-1 font-bold">&lt;8 g/dL</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Stable on room air</td>
                <td className="border border-purple-200 p-1 font-bold">&lt;7 g/dL</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transfusion Details */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">PRBC Transfusion</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold">Volume: 15-20 mL/kg (2024 consensus)</p>
            {w > 0 && (
              <p className="text-green-400 font-mono">
                = {(w * 15).toFixed(0)} - {(w * 20).toFixed(0)} mL
              </p>
            )}
            
            <p className="mt-2"><strong>Rate:</strong> 3-5 mL/kg/hr over 3-4 hours</p>
            <p className="text-[7px] text-gray-400">May give faster (10-20 mL/kg/hr) in acute blood loss</p>
            
            <p className="mt-2"><strong>Expected Hb rise:</strong></p>
            <p>~2-3 g/dL per 15 mL/kg transfused</p>
            
            <p className="mt-2"><strong>Product specifications (2024):</strong></p>
            <p>• Leukoreduced</p>
            <p>• Irradiated (for all &lt;1200g or immunocompromised)</p>
            <p>• CMV-negative or leukoreduced (equivalent)</p>
            <p>• &lt;7 days old preferred for large volume/exchange</p>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Prevention Strategies</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Minimize phlebotomy (most important):</strong></p>
            <p>• Use microtainer samples</p>
            <p>• Batch lab draws when possible</p>
            <p>• Point-of-care testing</p>
            <p>• Document cumulative blood loss</p>
            
            <p className="font-bold mt-2">Delayed cord clamping (DCC):</p>
            <p>• 30-60 seconds for preterm</p>
            <p>• Increases blood volume 10-15 mL/kg</p>
            <p>• Reduces transfusion need</p>
            
            <p className="font-bold mt-2">Iron supplementation:</p>
            <p>• Start at 2-4 weeks of age in preterm</p>
            <p>• 2-4 mg/kg/day elemental iron</p>
            <p>• Continue until 12 months corrected age</p>
          </div>
        </div>

        {/* EPO */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Erythropoietin (EPO) - 2024 Status</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Current evidence:</strong></p>
            <p>• May reduce <strong>late</strong> transfusions (after week 1-2)</p>
            <p>• Does NOT significantly reduce early transfusions</p>
            <p>• Requires concurrent iron supplementation</p>
            
            <p className="font-bold mt-1">If used:</p>
            <p>200-400 units/kg SC 3×/week</p>
            
            <p className="text-amber-600 mt-1">⚠️ Concerns: Potential ROP association</p>
            <p className="text-[7px]"><strong>Not routinely recommended</strong> in most current guidelines</p>
          </div>
        </div>

        {/* Workup */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Diagnostic Workup</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p className="font-bold">Initial (all anemic neonates):</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• CBC with indices, MCV</div>
              <div>• Reticulocyte count</div>
              <div>• Blood type, DAT (Coombs)</div>
              <div>• Peripheral smear</div>
            </div>
            
            <p className="font-bold mt-2">If hemolysis suspected:</p>
            <p>• Bilirubin (direct/indirect)</p>
            <p>• G6PD screen</p>
            <p>• Kleihauer-Betke on maternal blood</p>
            
            <p className="font-bold mt-2">If production issue suspected:</p>
            <p>• Very low reticulocyte count</p>
            <p>• Consider bone marrow (rare)</p>
            <p>• TORCH workup if congenital infection suspected</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• <strong>Anemia of prematurity:</strong> Self-limited, resolves by 3-6 months</p>
            <p>• Prognosis depends on underlying cause</p>
            <p>• Severe anemia in first week: Rule out hemolysis, hemorrhage</p>
            <p>• Multiple transfusions: Consider underlying pathology</p>
            <p>• 2024 evidence: Restrictive thresholds are safe (no worse outcomes)</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default AnemiaApproach;
