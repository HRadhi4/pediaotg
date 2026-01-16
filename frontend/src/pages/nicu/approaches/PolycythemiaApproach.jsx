/**
 * Polycythemia Approach
 * Updated: 2023-2024 Evidence-Based Guidelines
 * Reference: UCSF 2023, CAHS Guidelines, Cochrane Review
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PolycythemiaApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  // Calculate partial exchange volume if needed
  const calculateExchangeVolume = (observedHct) => {
    if (!w || !observedHct) return null;
    const bloodVolume = 80; // mL/kg for term
    const desiredHct = 55;
    const volume = (bloodVolume * w * (observedHct - desiredHct)) / observedHct;
    return volume.toFixed(0);
  };

  return (
    <Card data-testid="polycythemia-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Polycythemia</CardTitle>
        <CardDescription className="text-xs">Neonatal Hyperviscosity Syndrome</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2023-2024 Evidence-Based Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Polycythemia:</strong> <strong>Venous</strong> hematocrit ≥65%</p>
            <p><strong>Hyperviscosity:</strong> Blood viscosity &gt;2 SD above normal (correlates with Hct &gt;65%)</p>
            <p className="mt-1">Incidence: 2-5% of newborns; higher at altitude</p>
            <p className="text-red-600 mt-1 font-bold">⚠️ MUST confirm with venous sample (capillary Hct may be 5-15% higher)</p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Placental transfusion:</p>
              <p>• Delayed cord clamping (&gt;3 min)</p>
              <p>• Twin-twin transfusion (recipient)</p>
              <p>• Maternal-fetal transfusion</p>
              <p>• Cord milking</p>
            </div>
            <div>
              <p className="font-bold">Increased erythropoiesis:</p>
              <p>• IUGR/SGA</p>
              <p>• <strong>Infant of diabetic mother (IDM)</strong></p>
              <p>• Post-term pregnancy</p>
              <p>• Chronic fetal hypoxia</p>
            </div>
            <div className="col-span-2">
              <p className="font-bold">Other:</p>
              <p>• High altitude residence</p>
              <p>• Beckwith-Wiedemann syndrome</p>
              <p>• Chromosomal abnormalities (Trisomy 13, 18, 21)</p>
              <p>• Neonatal thyrotoxicosis</p>
              <p>• Congenital adrenal hyperplasia</p>
            </div>
          </div>
        </div>

        {/* Screening - 2024 Update */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Screening Recommendations (2024)</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p className="font-bold text-green-600">DO screen:</p>
            <p>• <strong>Symptomatic infants only</strong> (current recommendation)</p>
            
            <p className="font-bold text-red-600 mt-2">DO NOT routinely screen:</p>
            <p>• Asymptomatic infants, even with risk factors</p>
            <p>• After delayed cord clamping alone</p>
            
            <p className="font-bold mt-2">When to check:</p>
            <p>• Symptoms typically emerge at Hct &gt;65-70%</p>
            <p>• Peak Hct occurs at 2-4 hours of life</p>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Clinical Features</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p className="font-bold text-amber-600">50% of cases are ASYMPTOMATIC</p>
            
            <p className="font-bold mt-1">Symptomatic presentation:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="font-bold">CNS:</p>
                <p>• Lethargy</p>
                <p>• Jitteriness/irritability</p>
                <p>• Seizures (rare)</p>
                <p>• Poor feeding</p>
              </div>
              <div>
                <p className="font-bold">Cardiorespiratory:</p>
                <p>• Respiratory distress</p>
                <p>• Cyanosis</p>
                <p>• Tachypnea</p>
                <p>• Tachycardia</p>
              </div>
              <div>
                <p className="font-bold">GI:</p>
                <p>• Feeding intolerance</p>
                <p>• NEC risk (↑)</p>
              </div>
              <div>
                <p className="font-bold">Other:</p>
                <p>• <strong>Plethora (ruddy/red)</strong></p>
                <p>• Hypoglycemia</p>
                <p>• Hyperbilirubinemia</p>
                <p>• Thrombocytopenia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Algorithm - 2024 */}
        <div className="p-2 bg-gradient-to-b from-teal-50 to-gray-50 dark:from-teal-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-teal-700 mb-2">MANAGEMENT APPROACH (2024)</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Asymptomatic Hct 65-70%</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Increase fluid intake (IV + PO)</p>
              <p>• Recheck venous Hct in 4-6 hours</p>
              <p>• Monitor closely for symptoms</p>
              <p>• <strong>NO intervention if remains asymptomatic</strong></p>
            </div>
          </div>

          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-amber-700">Asymptomatic Hct &gt;70-75%</p>
            <div className="text-[8px] text-amber-600 mt-1 space-y-0.5">
              <p>• Hydration, close monitoring</p>
              <p>• Some guidelines: Consider PET if Hct &gt;75%</p>
              <p>• <strong>Discuss risks/benefits with family</strong></p>
            </div>
          </div>

          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">SYMPTOMATIC with Hct ≥65%</p>
            <div className="text-[8px] text-red-600 mt-1 space-y-0.5">
              <p className="font-bold">→ Partial Exchange Transfusion (PET)</p>
              <p>• Goal: Reduce Hct to 50-55%</p>
              <p>• Replacement fluid: <strong>Normal Saline 0.9%</strong></p>
            </div>
          </div>
        </div>

        {/* PET Procedure */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Partial Exchange Transfusion (PET)</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold">Volume Calculation:</p>
            <p className="font-mono bg-gray-700 p-1 rounded">
              Volume (mL) = BV × Weight × (Observed Hct - Desired Hct) / Observed Hct
            </p>
            <p className="text-[7px] text-gray-400">BV = 80 mL/kg (term); Desired Hct = 55%</p>
            
            {w > 0 && (
              <div className="p-1.5 bg-gray-700 rounded mt-2">
                <p className="text-amber-400">Calculator (for Hct 70% → 55%):</p>
                <p className="font-mono text-green-400 font-bold">
                  = {calculateExchangeVolume(70)} mL NS (~15-20 mL/kg)
                </p>
              </div>
            )}
            
            <p className="font-bold mt-2">Procedure:</p>
            <p>• Access: UVC preferred; or peripheral vein + UVC/UAC</p>
            <p>• <strong>Aliquots: 5-10 mL</strong> (avoid large shifts)</p>
            <p>• Duration: 15-30 minutes</p>
            <p>• Iso-volumetric: Withdraw blood while infusing NS simultaneously</p>
            
            <p className="font-bold mt-2 text-amber-400">Iso-volumetric technique preferred:</p>
            <p className="text-[7px]">Remove from one line, infuse NS through another at same rate</p>
          </div>
        </div>

        {/* Monitoring */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Monitoring After PET</p>
          <div className="text-[8px] text-purple-600 space-y-0.5">
            <p>• Vitals during and q15 min × 1 hr post-procedure</p>
            <p>• Recheck Hct 2-4 hours post-PET</p>
            <p>• <strong>Monitor glucose</strong> (hypoglycemia common)</p>
            <p>• Monitor bilirubin (hemolysis risk)</p>
            <p>• Watch for NEC signs (PET increases risk)</p>
            <p>• Keep infant NPO during and 4-6h after procedure</p>
          </div>
        </div>

        {/* Risks of PET */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risks of PET</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• <strong>NEC (increased risk)</strong></div>
            <div>• Infection (line-related)</div>
            <div>• Thrombosis</div>
            <div>• Arrhythmia</div>
            <div>• Hypotension</div>
            <div>• Hemorrhage</div>
            <div>• Air embolism</div>
            <div>• Hypothermia</div>
          </div>
          <p className="text-[7px] text-red-500 mt-1 font-bold">PET increases NEC risk - monitor closely for 24-48h</p>
        </div>

        {/* Evidence Note - Critical 2024 */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Evidence Note (2024 - Cochrane)</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p className="font-bold text-red-600">Current evidence does NOT show long-term neurodevelopmental benefit from PET in asymptomatic infants.</p>
            
            <p className="mt-1"><strong>Therefore (current recommendation):</strong></p>
            <p>• PET recommended ONLY for <strong>symptomatic</strong> polycythemia</p>
            <p>• Asymptomatic: Conservative management (hydration, monitoring)</p>
            <p>• <strong>Shared decision-making with family</strong> - document discussion</p>
            <p>• Consider individual circumstances and institutional protocols</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis & Follow-up</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Most cases resolve without long-term effects</p>
            <p>• Symptomatic infants who required PET: Recommend developmental follow-up</p>
            <p>• Some studies suggest subtle developmental differences (controversial)</p>
            <p>• Prognosis largely depends on underlying cause (e.g., IDM, IUGR)</p>
            <p>• Monitor for hyperbilirubinemia in subsequent days</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PolycythemiaApproach;
