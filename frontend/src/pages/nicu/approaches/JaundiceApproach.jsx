/**
 * Neonatal Jaundice (Hyperbilirubinemia) Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines, AAP Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const JaundiceApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;

  return (
    <Card data-testid="jaundice-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Hyperbilirubinemia (Jaundice)</CardTitle>
        <CardDescription className="text-xs">Management of Unconjugated Hyperbilirubinemia</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines / AAP 2004</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points</p>
          <div className="text-[8px] text-amber-600 space-y-0.5">
            <p>• Early-onset jaundice (&lt;24 hours) is a medical emergency</p>
            <p>• Visual inspection is NOT reliable for TSB level</p>
            <p>• Do NOT subtract direct bilirubin from TSB for management</p>
            <p>• Unbound bilirubin is most predictive of neurotoxicity</p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Major Risk Factors for Severe Hyperbilirubinemia</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• Pre-discharge TSB in high-risk zone</div>
            <div>• Jaundice in first 24 hours</div>
            <div>• Blood group incompatibility (DAT+)</div>
            <div>• G6PD deficiency</div>
            <div>• GA 35-36 weeks</div>
            <div>• Sibling with phototherapy</div>
            <div>• Cephalohematoma/bruising</div>
            <div>• Exclusive breastfeeding (poor)</div>
          </div>
        </div>

        {/* Neurotoxicity Risk Factors */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Neurotoxicity Risk Factors</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-purple-600">
            <div>• Hemolytic disease</div>
            <div>• G6PD deficiency</div>
            <div>• Asphyxia</div>
            <div>• Temperature instability</div>
            <div>• Sepsis</div>
            <div>• Acidosis</div>
            <div>• Albumin &lt;3.0 g/dL</div>
            <div>• Prematurity</div>
          </div>
        </div>

        {/* Phototherapy Thresholds - Preterm */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-2">Phototherapy Thresholds (Preterm &lt;35 wks)</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900/40">
                <th className="border border-blue-200 p-1 text-left">GA (weeks)</th>
                <th className="border border-blue-200 p-1 text-center">Phototherapy (mg/dL)</th>
                <th className="border border-blue-200 p-1 text-center">Exchange (mg/dL)</th>
              </tr>
            </thead>
            <tbody>
              <tr className={ga > 0 && ga < 28 ? "bg-yellow-100" : ""}>
                <td className="border border-blue-200 p-1">&lt;28</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-blue-600">5-6</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-red-600">11-14</td>
              </tr>
              <tr className={ga >= 28 && ga < 31 ? "bg-yellow-100" : ""}>
                <td className="border border-blue-200 p-1">28-30 6/7</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-blue-600">6-8</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-red-600">12-14</td>
              </tr>
              <tr className={ga >= 31 && ga < 34 ? "bg-yellow-100" : ""}>
                <td className="border border-blue-200 p-1">30-33 6/7</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-blue-600">8-10</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-red-600">13-14</td>
              </tr>
              <tr className={ga >= 34 && ga < 35 ? "bg-yellow-100" : ""}>
                <td className="border border-blue-200 p-1">33-35 6/7</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-blue-600">10-12</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-red-600">13-18</td>
              </tr>
              <tr className={ga >= 35 && ga < 38 ? "bg-yellow-100" : ""}>
                <td className="border border-blue-200 p-1">35-37 6/7</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-blue-600">12-14</td>
                <td className="border border-blue-200 p-1 text-center font-bold text-red-600">14-19</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Phototherapy Management */}
        <div className="p-2 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200">
          <p className="text-xs font-bold text-cyan-700 mb-1">Phototherapy Management</p>
          <div className="text-[8px] text-cyan-600 space-y-1">
            <p><strong>Initiation:</strong></p>
            <p>• Use intensive phototherapy for readmissions or near exchange threshold</p>
            <p>• Blue LED phototherapy lamps are most effective</p>
            <p>• Prophylactic phototherapy for ELBW when TSB &gt;5 mg/dL</p>
            
            <p className="mt-2"><strong>Monitoring:</strong></p>
            <p>• Check TSB 2-6 hours after starting</p>
            <p>• Repeat every 6-12 hours once stable/descending</p>
            
            <p className="mt-2"><strong>Discontinue when:</strong></p>
            <p>• TSB 1-2 mg/dL below initiation level × 2 measurements (6-12h apart)</p>
            <p>• Recheck TSB 12-24h after stopping</p>
          </div>
        </div>

        {/* IVIG */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">IVIG Indication</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Consider when:</strong></p>
            <p>• DAT-positive immune hemolytic disease (Rh/ABO)</p>
            <p>• TSB rising &gt;0.5 mg/dL/hr despite intensive phototherapy</p>
            <p>• TSB within 2-3 mg/dL of exchange threshold</p>
            
            <p className="mt-2"><strong>Dose:</strong> 0.5-1 g/kg IV over 2-4 hours</p>
            {w > 0 && (
              <p className="font-mono text-green-600 text-[10px]">
                = {(w * 0.5).toFixed(1)} - {(w * 1).toFixed(1)} g ({(w * 5).toFixed(0)} - {(w * 10).toFixed(0)} mL of 10% solution)
              </p>
            )}
            <p>• May repeat in 12 hours if needed</p>
          </div>
        </div>

        {/* Exchange Transfusion */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Exchange Transfusion</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p><strong>Indications:</strong></p>
            <p>• TSB at exchange threshold despite intensive phototherapy</p>
            <p>• Signs of acute bilirubin encephalopathy (hypertonia, retrocollis, opisthotonos)</p>
            
            <p className="mt-2"><strong>Blood Product:</strong></p>
            <p>• Fresh type O, Rh-negative, irradiated PRBCs</p>
            <p>• Resuspended in AB plasma, cross-matched against mother</p>
            
            <p className="mt-2"><strong>Volume:</strong> 2 × blood volume (160-180 mL/kg)</p>
            {w > 0 && (
              <p className="font-mono text-green-600 text-[10px]">
                = {(w * 160).toFixed(0)} - {(w * 180).toFixed(0)} mL + 30 mL for tubing
              </p>
            )}
            
            <p className="mt-2"><strong>Aliquots:</strong> Max 10% of blood volume per exchange (max 20 mL for &gt;3kg)</p>
          </div>
        </div>

        {/* BAMR */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Bilirubin-Albumin Molar Ratio (BAMR)</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400">
            <p className="font-mono bg-white dark:bg-gray-900 p-1 rounded">
              BAMR = TSB (mg/dL) ÷ Albumin (g/dL)
            </p>
            <table className="w-full mt-2">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border p-1 text-left">Risk Category</th>
                  <th className="border p-1 text-center">Exchange Threshold</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">≥38 weeks, well</td>
                  <td className="border p-1 text-center font-bold">8.0</td>
                </tr>
                <tr>
                  <td className="border p-1">35-37 wk or ≥38 wk higher risk</td>
                  <td className="border p-1 text-center font-bold">7.2</td>
                </tr>
                <tr>
                  <td className="border p-1">35-37 wk + higher risk</td>
                  <td className="border p-1 text-center font-bold">6.8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Acute Bilirubin Encephalopathy */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Acute Bilirubin Encephalopathy (ABE)</p>
          <div className="text-[8px] space-y-1">
            <p><strong>Early signs:</strong> Lethargy, poor feeding, hypotonia, high-pitched cry</p>
            <p><strong>Progressive:</strong> Hyperextension, back arching</p>
            <p><strong>Classic Kernicterus tetrad:</strong></p>
            <div className="grid grid-cols-2 gap-1 mt-1 text-gray-300">
              <div>• Choreoathetoid CP</div>
              <div>• Upward gaze palsy</div>
              <div>• Sensorineural hearing loss</div>
              <div>• Dental dysplasia</div>
            </div>
            <p className="text-amber-400 mt-2">⚠️ Risk of irreversible injury at TSB &gt;23 mg/dL</p>
          </div>
        </div>

        {/* Lab Investigation */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">When to Investigate Further</p>
          <div className="text-[8px] text-green-600 space-y-0.5">
            <p>• TSB ≥4 mg/dL in cord blood</p>
            <p>• Rising ≥0.3 mg/dL/hour over 4-8 hours</p>
            <p>• Rising ≥5 mg/dL/day</p>
            <p>• TSB ≥13-15 mg/dL in term, ≥10 mg/dL in preterm</p>
            <p>• Signs of illness present</p>
            <p>• Jaundice persisting beyond 10-14 days</p>
          </div>
        </div>

        {/* Conjugated Hyperbilirubinemia */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Conjugated Hyperbilirubinemia</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p><strong>Definition:</strong> Direct bilirubin &gt;1.5 mg/dL AND &gt;15% of total</p>
            <p><strong>Always pathologic!</strong> Investigate for:</p>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <div>• Biliary atresia (urgent!)</div>
              <div>• Infections</div>
              <div>• Metabolic disorders</div>
              <div>• TPN cholestasis</div>
            </div>
            <p className="text-red-600 mt-1">⚠️ Biliary atresia must be identified before 2 months of age</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default JaundiceApproach;
