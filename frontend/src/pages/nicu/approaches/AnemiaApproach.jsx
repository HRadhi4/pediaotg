/**
 * Neonatal Anaemia Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AnaemiaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;

  return (
    <Card data-testid="anemia-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Anemia</CardTitle>
        <CardDescription className="text-xs">Assessment & Transfusion Guidelines</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Neonatal anaemia:</strong> Hemoglobin or hematocrit below normal for gestational and postnatal age.</p>
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
          <p className="text-xs font-bold text-red-700 mb-1">Causes of Neonatal Anaemia</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Blood Loss:</p>
              <p>• Fetomaternal hemorrhage</p>
              <p>• Twin-twin transfusion</p>
              <p>• Placental abruption</p>
              <p>• Cord accidents</p>
              <p>• Internal hemorrhage (IVH)</p>
              <p>• Iatrogenic (phlebotomy)</p>
            </div>
            <div>
              <p className="font-bold">Hemolysis:</p>
              <p>• Rh/ABO incompatibility</p>
              <p>• G6PD deficiency</p>
              <p>• Spherocytosis</p>
              <p>• Infection</p>
              <p>• DIC</p>
            </div>
            <div className="col-span-2">
              <p className="font-bold">Decreased Production:</p>
              <p>• Physiologic anemia of prematurity</p>
              <p>• Diamond-Blackfan anemia</p>
              <p>• Congenital infections (CMV, parvovirus)</p>
            </div>
          </div>
        </div>

        {/* Anemia of Prematurity */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Anemia of Prematurity</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Pathophysiology:</strong></p>
            <p>• Shortened RBC lifespan (40-60 days vs 120)</p>
            <p>• Inadequate EPO response to hypoxia</p>
            <p>• Rapid growth with blood volume expansion</p>
            <p>• Frequent phlebotomy losses</p>
            <p>• Low iron stores</p>
            
            <p className="mt-2"><strong>Nadir typically:</strong></p>
            <p>• Term: 8-12 weeks (Hb ~10-11 g/dL)</p>
            <p>• Preterm: 4-8 weeks (Hb may fall to 7-8 g/dL)</p>
          </div>
        </div>

        {/* Clinical Signs */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Clinical Signs of Significant Anaemia</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-orange-600">
            <div>• Pallor</div>
            <div>• Tachycardia</div>
            <div>• Tachypnea</div>
            <div>• Poor feeding</div>
            <div>• Apnea/bradycardia</div>
            <div>• Poor weight gain</div>
            <div>• Increased oxygen requirement</div>
            <div>• Metabolic acidosis</div>
          </div>
        </div>

        {/* Transfusion Thresholds */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">PRBC TRANSFUSION THRESHOLDS</p>
          
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-green-100 dark:bg-green-900/40">
                <th className="border border-green-200 p-1">Clinical Status</th>
                <th className="border border-green-200 p-1">Hb (g/dL)</th>
                <th className="border border-green-200 p-1">Hct (%)</th>
              </tr>
            </thead>
            <tbody className="text-green-600">
              <tr>
                <td className="border border-green-200 p-1">Severe cardiorespiratory disease</td>
                <td className="border border-green-200 p-1 font-bold">&lt;12</td>
                <td className="border border-green-200 p-1 font-bold">&lt;35</td>
              </tr>
              <tr>
                <td className="border border-green-200 p-1">Moderate respiratory support</td>
                <td className="border border-green-200 p-1 font-bold">&lt;10</td>
                <td className="border border-green-200 p-1 font-bold">&lt;30</td>
              </tr>
              <tr>
                <td className="border border-green-200 p-1">Minimal respiratory support</td>
                <td className="border border-green-200 p-1 font-bold">&lt;8</td>
                <td className="border border-green-200 p-1 font-bold">&lt;25</td>
              </tr>
              <tr>
                <td className="border border-green-200 p-1">Stable on room air</td>
                <td className="border border-green-200 p-1 font-bold">&lt;7</td>
                <td className="border border-green-200 p-1 font-bold">&lt;20</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[7px] text-green-500 mt-1">Thresholds may vary by institution; consider clinical symptoms alongside lab values</p>
        </div>

        {/* Transfusion Volume */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">PRBC Transfusion</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold">Standard Volume: 10-20 mL/kg</p>
            {w > 0 && (
              <p className="text-green-400 font-mono">
                = {(w * 10).toFixed(0)} - {(w * 20).toFixed(0)} mL
              </p>
            )}
            
            <p className="mt-2"><strong>Rate:</strong> 3-5 mL/kg/hr over 3-4 hours</p>
            <p className="text-[7px] text-gray-400">May give faster in acute blood loss</p>
            
            <p className="mt-2"><strong>Expected Hb rise:</strong></p>
            <p>~2-3 g/dL per 10 mL/kg transfused</p>
            
            <p className="mt-2"><strong>Product specifications:</strong></p>
            <p>• Leukoreduced, irradiated</p>
            <p>• CMV-negative (or leukoreduced)</p>
            <p>• &lt;7 days old preferred for large volume</p>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Prevention Strategies</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Minimize phlebotomy:</strong></p>
            <p>• Use microtainer samples</p>
            <p>• Batch lab draws</p>
            <p>• Point-of-care testing when possible</p>
            
            <p className="font-bold mt-2">Delayed cord clamping:</p>
            <p>• 30-60 seconds for preterm infants</p>
            <p>• Increases blood volume, reduces transfusion need</p>
            
            <p className="font-bold mt-2">Iron supplementation:</p>
            <p>• Start at 2-4 weeks of age in preterm</p>
            <p>• 2-4 mg/kg/day elemental iron</p>
            <p>• Continue until 12 months</p>
          </div>
        </div>

        {/* EPO */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Erythropoietin (EPO)</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Role in anemia of prematurity:</strong></p>
            <p>• Can reduce late transfusions (after 8 days)</p>
            <p>• Does NOT reduce early transfusions</p>
            <p>• Requires iron supplementation</p>
            
            <p className="font-bold mt-1">Dosing:</p>
            <p>200-400 units/kg SC 3×/week</p>
            
            <p className="text-amber-600 mt-1">⚠️ Controversial - potential ROP association</p>
            <p className="text-[7px]">Not routinely recommended in most centers</p>
          </div>
        </div>

        {/* Workup */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Diagnostic Workup</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p className="font-bold">Initial:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• CBC with indices</div>
              <div>• Reticulocyte count</div>
              <div>• Blood type, DAT</div>
              <div>• Peripheral smear</div>
            </div>
            
            <p className="font-bold mt-2">If hemolysis suspected:</p>
            <p>• Bilirubin (direct/indirect)</p>
            <p>• G6PD screen</p>
            <p>• Kleihauer-Betke (maternal blood)</p>
            
            <p className="font-bold mt-2">If production issue suspected:</p>
            <p>• Reticulocyte count (low)</p>
            <p>• Consider bone marrow (rare)</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Anemia of prematurity: Self-limited, resolves by 3-6 months</p>
            <p>• Prognosis depends on underlying cause</p>
            <p>• Severe anemia in first week: Rule out hemolysis, hemorrhage</p>
            <p>• Chronic transfusion needs may indicate ongoing pathology</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default AnemiaApproach;
