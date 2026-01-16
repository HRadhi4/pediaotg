/**
 * Congenital Heart Disease (CHD) Approach
 * Based on WHO Neonatal Clinical Guidelines & UpToDate
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CHDApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="chd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Congenital Heart Disease (CHD)</CardTitle>
        <CardDescription className="text-xs">Approach to Cyanotic & Acyanotic Lesions</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines / UpToDate</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points</p>
          <div className="text-[8px] text-amber-600 space-y-0.5">
            <p>• CHD occurs in ~8-10 per 1000 live births</p>
            <p>• Critical CHD (requiring intervention in first month): ~25% of all CHD</p>
            <p>• Pulse oximetry screening can detect many critical lesions</p>
            <p>• Early diagnosis and stabilization are essential</p>
          </div>
        </div>

        {/* Classification */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-blue-700 mb-2">CLASSIFICATION OF CHD</p>
          
          {/* Cyanotic */}
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-purple-700">Cyanotic Lesions (Right-to-Left Shunt)</p>
            <div className="text-[8px] text-purple-600 mt-1">
              <p className="font-bold">5 T's:</p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <div>• Tetralogy of Fallot (TOF)</div>
                <div>• Transposition of Great Arteries (TGA)</div>
                <div>• Tricuspid Atresia</div>
                <div>• Total Anomalous Pulmonary Venous Return (TAPVR)</div>
                <div>• Truncus Arteriosus</div>
                <div>• Hypoplastic Left Heart Syndrome (HLHS)</div>
              </div>
            </div>
          </div>

          {/* Acyanotic */}
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-green-700">Acyanotic Lesions (Left-to-Right Shunt)</p>
            <div className="text-[8px] text-green-600 mt-1">
              <div className="grid grid-cols-2 gap-1">
                <div>• Ventricular Septal Defect (VSD)</div>
                <div>• Atrial Septal Defect (ASD)</div>
                <div>• Patent Ductus Arteriosus (PDA)</div>
                <div>• Atrioventricular Septal Defect (AVSD)</div>
                <div>• Coarctation of Aorta</div>
                <div>• Aortic Stenosis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Presentation */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Clinical Features Suggestive of CHD</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Cyanotic CHD:</p>
              <p>• Central cyanosis (unresponsive to O2)</p>
              <p>• Hypoxemia (SpO2 &lt;90%)</p>
              <p>• May have NO murmur initially</p>
              <p>• Hyperpnea without distress</p>
            </div>
            <div>
              <p className="font-bold">Acyanotic CHD:</p>
              <p>• Tachypnea, feeding difficulty</p>
              <p>• Heart failure signs</p>
              <p>• Murmur present</p>
              <p>• Hepatomegaly</p>
            </div>
          </div>
        </div>

        {/* Pulse Oximetry Screening */}
        <div className="p-2 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200">
          <p className="text-xs font-bold text-cyan-700 mb-1">Critical CHD Screening (Pulse Oximetry)</p>
          <div className="text-[8px] text-cyan-600 space-y-1">
            <p><strong>When:</strong> 24-48 hours of life (or before discharge if earlier)</p>
            <p><strong>Sites:</strong> Right hand (pre-ductal) AND either foot (post-ductal)</p>
            
            <p className="font-bold mt-1">Positive Screen (Fail):</p>
            <div className="pl-2 text-[7px]">
              <p>• Any SpO2 &lt;90%</p>
              <p>• SpO2 &lt;95% in both extremities on 3 measures (1h apart)</p>
              <p>• &gt;3% difference between right hand and foot on 3 measures</p>
            </div>
            <p className="text-red-600 mt-1">⚠️ Positive screen → Immediate echo and cardiology consult</p>
          </div>
        </div>

        {/* Hyperoxia Test */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Hyperoxia Test</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p><strong>Purpose:</strong> Distinguish cardiac from pulmonary cyanosis</p>
            <p><strong>Method:</strong> Place infant in 100% FiO2 for 10 minutes</p>
            
            <table className="w-full mt-1 text-[7px]">
              <thead>
                <tr className="bg-orange-100">
                  <th className="border p-1">Response</th>
                  <th className="border p-1">PaO2</th>
                  <th className="border p-1">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 font-bold text-green-600">Positive</td>
                  <td className="border p-1">&gt;150 mmHg</td>
                  <td className="border p-1">Likely pulmonary disease</td>
                </tr>
                <tr>
                  <td className="border p-1 font-bold text-red-600">Negative</td>
                  <td className="border p-1">&lt;100 mmHg</td>
                  <td className="border p-1">Likely cyanotic CHD</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[7px] text-orange-500 mt-1">Note: PPHN can also show negative hyperoxia test</p>
          </div>
        </div>

        {/* Prostaglandin E1 */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Prostaglandin E1 (PGE1) - Alprostadil</p>
          <div className="text-[8px] space-y-1">
            <p className="text-amber-400">Maintains ductal patency in duct-dependent lesions</p>
            
            <p className="font-bold mt-2">Indications:</p>
            <div className="text-[7px] grid grid-cols-2 gap-1">
              <div>• TGA</div>
              <div>• Critical coarctation</div>
              <div>• HLHS</div>
              <div>• Pulmonary atresia</div>
              <div>• Critical aortic stenosis</div>
              <div>• Interrupted aortic arch</div>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded mt-2">
              <p className="font-bold">Dosing:</p>
              <p>Starting: 0.05-0.1 mcg/kg/min IV continuous</p>
              {w > 0 && (
                <p className="text-green-400 font-mono">
                  = {(w * 0.05 * 60).toFixed(1)} - {(w * 0.1 * 60).toFixed(1)} mcg/hr
                </p>
              )}
              <p className="mt-1">Maintenance: 0.01-0.05 mcg/kg/min once ductus opens</p>
              <p className="text-[7px] text-gray-400">May need to increase if duct closes</p>
            </div>
            
            <p className="font-bold mt-2 text-red-400">Side Effects:</p>
            <div className="grid grid-cols-2 gap-1 text-[7px]">
              <div>• Apnea (12%) - have intubation ready</div>
              <div>• Hypotension</div>
              <div>• Fever</div>
              <div>• Jitteriness/seizures</div>
              <div>• Flushing</div>
              <div>• Diarrhea</div>
            </div>
          </div>
        </div>

        {/* Specific Lesions - Brief */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Key Duct-Dependent Lesions</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">TGA (D-Transposition):</p>
              <p>• Presents in first hours with severe cyanosis</p>
              <p>• Needs PGE1 + Balloon Atrial Septostomy (BAS)</p>
              <p>• Definitive: Arterial Switch Operation</p>
            </div>
            
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Coarctation of Aorta:</p>
              <p>• May present with shock when ductus closes (day 3-7)</p>
              <p>• BP difference: upper &gt; lower extremities</p>
              <p>• Weak femoral pulses</p>
            </div>
            
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">HLHS:</p>
              <p>• Duct-dependent systemic circulation</p>
              <p>• Will collapse when ductus closes</p>
              <p>• Needs PGE1 as bridge to Norwood procedure</p>
            </div>
          </div>
        </div>

        {/* Initial Stabilization */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Initial Stabilization</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p><strong>1. Airway/Breathing:</strong></p>
            <p>• Supplemental O2 (caution in HLHS - avoid high FiO2)</p>
            <p>• Intubate if respiratory failure or for transport</p>
            
            <p className="font-bold mt-1">2. Circulation:</p>
            <p>• IV access, avoid umbilical venous line through liver</p>
            <p>• Start PGE1 if duct-dependent lesion suspected</p>
            <p>• Volume cautiously (10 mL/kg NS) if poor perfusion</p>
            <p>• Inotropes if needed (dopamine, dobutamine)</p>
            
            <p className="font-bold mt-1">3. Metabolic:</p>
            <p>• Check and correct glucose, calcium</p>
            <p>• Correct acidosis</p>
            <p>• NPO, gastric decompression</p>
          </div>
        </div>

        {/* Investigations */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Investigations</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-bold">Immediate:</p>
                <p>• 4-limb BP</p>
                <p>• Pre/post-ductal SpO2</p>
                <p>• ABG</p>
                <p>• CXR</p>
                <p>• ECG</p>
              </div>
              <div>
                <p className="font-bold">Definitive:</p>
                <p>• Echocardiography</p>
                <p>• Cardiology consult</p>
                <p>• CT/MRI if needed</p>
                <p>• Cardiac catheterization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Outcomes have improved dramatically with early detection</p>
            <p>• Many complex lesions now have &gt;90% surgical survival</p>
            <p>• Long-term follow-up essential for all CHD patients</p>
            <p>• Neurodevelopmental monitoring important</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default CHDApproach;
