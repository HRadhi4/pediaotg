/**
 * Patent Ductus Arteriosus (PDA) Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PDAApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="pda-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Patent Ductus Arteriosus (PDA)</CardTitle>
        <CardDescription className="text-xs">Diagnosis & Management in Preterm Neonates</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>PDA:</strong> Persistent patency of the ductus arteriosus beyond the first few days of life.</p>
            <p><strong>Physiology:</strong> In term infants, functional closure occurs within 24-48 hours. In preterm infants, the ductus may fail to close due to decreased sensitivity to oxygen and increased sensitivity to prostaglandins.</p>
          </div>
        </div>

        {/* Incidence */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Incidence by Gestational Age</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-purple-100 dark:bg-purple-900/40">
                <th className="border border-purple-200 p-1">GA/Weight</th>
                <th className="border border-purple-200 p-1">Incidence</th>
              </tr>
            </thead>
            <tbody className="text-purple-600">
              <tr className={ga > 0 && ga < 28 ? "bg-yellow-100" : ""}>
                <td className="border border-purple-200 p-1">&lt;28 weeks or &lt;1000g</td>
                <td className="border border-purple-200 p-1 font-bold">~70%</td>
              </tr>
              <tr className={ga >= 28 && ga < 32 ? "bg-yellow-100" : ""}>
                <td className="border border-purple-200 p-1">28-32 weeks</td>
                <td className="border border-purple-200 p-1 font-bold">~30%</td>
              </tr>
              <tr className={ga >= 32 && ga < 37 ? "bg-yellow-100" : ""}>
                <td className="border border-purple-200 p-1">32-37 weeks</td>
                <td className="border border-purple-200 p-1 font-bold">~10%</td>
              </tr>
              <tr>
                <td className="border border-purple-200 p-1">Term</td>
                <td className="border border-purple-200 p-1 font-bold">~0.03%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Clinical Features of Hemodynamically Significant PDA</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-blue-600">
            <div>
              <p className="font-bold">Cardiac:</p>
              <p>• Continuous "machinery" murmur</p>
              <p>• Hyperdynamic precordium</p>
              <p>• Bounding peripheral pulses</p>
              <p>• Wide pulse pressure</p>
              <p>• Tachycardia</p>
            </div>
            <div>
              <p className="font-bold">Systemic:</p>
              <p>• Increasing respiratory support</p>
              <p>• Failure to wean from ventilator</p>
              <p>• Feeding intolerance</p>
              <p>• Hepatomegaly</p>
              <p>• Oliguria</p>
            </div>
          </div>
          <p className="text-[7px] text-blue-500 mt-1">Note: Murmur may be absent in very small shunts or large unrestricted PDAs</p>
        </div>

        {/* Echocardiographic Criteria */}
        <div className="p-2 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200">
          <p className="text-xs font-bold text-cyan-700 mb-1">Echocardiographic Criteria for hsPDA</p>
          <div className="text-[8px] text-cyan-600 space-y-1">
            <p><strong>PDA Size:</strong></p>
            <p>• Small: &lt;1.5 mm</p>
            <p>• Moderate: 1.5-3 mm</p>
            <p>• Large: &gt;3 mm or &gt;1.5 mm/kg</p>
            
            <p className="font-bold mt-2">Hemodynamic Significance Indicators:</p>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <div>• LA:Ao ratio &gt;1.4</div>
              <div>• Ductal diameter &gt;1.5 mm/kg</div>
              <div>• Left-to-right shunt</div>
              <div>• Diastolic flow reversal in aorta</div>
              <div>• Absent/reversed diastolic flow in celiac/renal arteries</div>
              <div>• LV dilation</div>
            </div>
          </div>
        </div>

        {/* Management Algorithm */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">MANAGEMENT APPROACH</p>
          
          {/* Conservative */}
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Conservative Management</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Fluid restriction (120-150 mL/kg/day)</p>
              <p>• Optimize respiratory support</p>
              <p>• Maintain adequate Hct (&gt;30%)</p>
              <p>• Watchful waiting (spontaneous closure common)</p>
              <p>• Avoid NSAIDs for other indications</p>
            </div>
            <p className="text-[7px] text-green-500 mt-1">Consider for: small PDA, minimal symptoms, &gt;2 weeks old</p>
          </div>

          {/* Pharmacologic */}
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Pharmacologic Closure</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p className="font-bold">Indications:</p>
              <p>• Hemodynamically significant PDA</p>
              <p>• Respiratory deterioration</p>
              <p>• Unable to wean ventilator support</p>
            </div>
          </div>

          {/* Surgical */}
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Surgical/Catheter Closure</p>
            <div className="text-[8px] text-red-600 mt-1 space-y-0.5">
              <p className="font-bold">Indications:</p>
              <p>• Failed pharmacologic therapy</p>
              <p>• Contraindication to medical therapy</p>
              <p>• Large PDA with heart failure</p>
            </div>
          </div>
        </div>

        {/* Ibuprofen - Primary */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Ibuprofen (Preferred Agent)</p>
          <div className="text-[8px] space-y-1">
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Standard Course (IV):</p>
              <p>Day 1: 10 mg/kg</p>
              <p>Day 2: 5 mg/kg</p>
              <p>Day 3: 5 mg/kg</p>
              {w > 0 && (
                <div className="text-green-400 font-mono mt-1">
                  <p>Day 1: {(w * 10).toFixed(0)} mg</p>
                  <p>Day 2-3: {(w * 5).toFixed(0)} mg each</p>
                </div>
              )}
            </div>
            
            <p className="font-bold mt-2">Oral Ibuprofen (if IV unavailable):</p>
            <p>Same dosing, given via OG/NG tube</p>
            
            <p className="text-amber-400 mt-2">Contraindications:</p>
            <div className="grid grid-cols-2 gap-1 text-[7px]">
              <div>• Active bleeding/IVH Grade ≥3</div>
              <div>• Thrombocytopenia (&lt;50,000)</div>
              <div>• NEC (suspected/confirmed)</div>
              <div>• Renal failure (Cr &gt;1.6-1.8)</div>
              <div>• Hyperbilirubinemia (near exchange)</div>
              <div>• Infection (untreated)</div>
            </div>
          </div>
        </div>

        {/* Indomethacin Alternative */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Alternative: Indomethacin</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p><strong>Standard Course:</strong></p>
            <p>0.2 mg/kg IV q12-24h × 3 doses</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w * 0.2).toFixed(2)} mg per dose</p>}
            
            <p className="mt-2"><strong>Prolonged Course (if needed):</strong></p>
            <p>0.1 mg/kg IV q24h × 5-7 days</p>
            
            <p className="text-[7px] text-orange-500 mt-2">Note: Ibuprofen preferred due to fewer renal/GI side effects</p>
          </div>
        </div>

        {/* Paracetamol Alternative */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Alternative: Paracetamol (Acetaminophen)</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Dose:</strong> 15 mg/kg/dose q6h × 3-7 days</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w * 15).toFixed(0)} mg q6h</p>}
            <p>Route: IV or PO</p>
            <p className="mt-1"><strong>Advantages:</strong></p>
            <p>• Fewer GI/renal side effects</p>
            <p>• Can use with thrombocytopenia</p>
            <p>• Consider when NSAIDs contraindicated</p>
            <p className="text-[7px] text-teal-500 mt-1">Evidence still emerging; not yet first-line in most centers</p>
          </div>
        </div>

        {/* Monitoring During Treatment */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Monitoring During Pharmacologic Treatment</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Before each dose:</strong></p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Urine output (goal &gt;1 mL/kg/hr)</div>
              <div>• Serum creatinine</div>
              <div>• Platelet count</div>
              <div>• Signs of bleeding</div>
            </div>
            
            <p className="font-bold mt-2">Hold dose if:</p>
            <p>• Urine output &lt;0.5 mL/kg/hr</p>
            <p>• Creatinine rising significantly</p>
            <p>• Platelets &lt;50,000</p>
            <p>• Active GI bleeding or NEC signs</p>
          </div>
        </div>

        {/* Complications of PDA */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Complications of Untreated hsPDA</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• Pulmonary edema/hemorrhage</div>
            <div>• BPD (chronic lung disease)</div>
            <div>• NEC (gut hypoperfusion)</div>
            <div>• Renal impairment</div>
            <div>• IVH (in first week)</div>
            <div>• Heart failure</div>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Outcomes</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Spontaneous closure: Common in late preterm/term</p>
            <p>• Pharmacologic success rate: 70-80% with first course</p>
            <p>• May need second course: 20-30% of cases</p>
            <p>• Surgical closure: Very low mortality in experienced centers</p>
            <p>• Long-term: Generally excellent if closed without complications</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PDAApproach;
