/**
 * Polycythemia Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PolycythemiaApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  // Calculate partial exchange volume if needed
  const calculateExchangeVolume = (observedHct) => {
    if (!w || !observedHct) return null;
    const bloodVolume = 80; // mL/kg
    const desiredHct = 55;
    const volume = (bloodVolume * w * (observedHct - desiredHct)) / observedHct;
    return volume.toFixed(0);
  };

  return (
    <Card data-testid="polycythaemia-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Polycythaemia</CardTitle>
        <CardDescription className="text-xs">Neonatal Hyperviscosity Syndrome</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Polycythaemia:</strong> Venous hematocrit ≥65%</p>
            <p><strong>Hyperviscosity:</strong> Blood viscosity &gt;2 SD above normal (usually correlates with Hct &gt;65%)</p>
            <p className="mt-1">Incidence: 2-5% of newborns; higher at altitude</p>
            <p className="text-red-600 mt-1">⚠️ Confirm with venous sample (not capillary - may be 5-15% higher)</p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Placental transfusion:</p>
              <p>• Delayed cord clamping</p>
              <p>• Twin-twin transfusion (recipient)</p>
              <p>• Maternal-fetal transfusion</p>
            </div>
            <div>
              <p className="font-bold">Increased erythropoiesis:</p>
              <p>• IUGR/SGA</p>
              <p>• IDM (diabetic mother)</p>
              <p>• Post-term pregnancy</p>
              <p>• Chronic fetal hypoxia</p>
            </div>
            <div className="col-span-2">
              <p className="font-bold">Other:</p>
              <p>• High altitude</p>
              <p>• Beckwith-Wiedemann syndrome</p>
              <p>• Adrenal hyperplasia</p>
              <p>• Neonatal thyrotoxicosis</p>
              <p>• Chromosomal abnormalities (Trisomy 13, 18, 21)</p>
            </div>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Clinical Features</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p className="text-amber-600 font-bold">50% of cases are asymptomatic</p>
            
            <p className="font-bold mt-1">Symptomatic:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="font-bold">CNS:</p>
                <p>• Lethargy</p>
                <p>• Jitteriness</p>
                <p>• Seizures</p>
                <p>• Poor feeding</p>
              </div>
              <div>
                <p className="font-bold">Cardiorespiratory:</p>
                <p>• Respiratory distress</p>
                <p>• Cyanosis</p>
                <p>• Tachypnea</p>
              </div>
              <div>
                <p className="font-bold">GI:</p>
                <p>• Feeding intolerance</p>
                <p>• NEC risk</p>
              </div>
              <div>
                <p className="font-bold">Other:</p>
                <p>• Plethora (ruddy color)</p>
                <p>• Hypoglycemia</p>
                <p>• Hyperbilirubinemia</p>
                <p>• Thrombocytopenia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Algorithm */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-blue-700 mb-2">MANAGEMENT APPROACH</p>
          
          {/* Hct 60-70 */}
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Hct 60-70%, Asymptomatic</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Increase fluid intake</p>
              <p>• Recheck Hct in 4-6 hours</p>
              <p>• Monitor for symptoms</p>
              <p>• No intervention if remains asymptomatic</p>
            </div>
          </div>

          {/* Symptomatic */}
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Symptomatic with Hct &gt;65%</p>
            <div className="text-[8px] text-red-600 mt-1 space-y-0.5">
              <p className="font-bold">→ Partial Exchange Transfusion (PET)</p>
              <p>• Goal: Reduce Hct to 50-55%</p>
              <p>• Use Normal Saline 0.9%</p>
            </div>
          </div>
        </div>

        {/* PET Procedure */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Partial Exchange Transfusion (PET)</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold">Volume Calculation:</p>
            <p className="font-mono bg-gray-700 p-1 rounded">
              Volume = (BV × Wt × (Observed Hct - Desired Hct)) / Observed Hct
            </p>
            <p className="text-[7px] text-gray-400">BV = Blood volume (80 mL/kg); Desired Hct = 50-55%</p>
            
            {w > 0 && (
              <div className="p-1.5 bg-gray-700 rounded mt-2">
                <p className="text-green-400">Calculator (for Hct 70% → 55%):</p>
                <p className="font-mono text-green-400">
                  = {calculateExchangeVolume(70)} mL NSS (approximately 15-20 mL/kg)
                </p>
              </div>
            )}
            
            <p className="font-bold mt-2">Procedure:</p>
            <p>• Access: UVC preferred; may use peripheral + UVC, or two peripheral lines</p>
            <p>• Aliquots: 5-10 mL</p>
            <p>• Duration: 15-20 minutes (iso-volumetric exchange)</p>
            <p>• Remove blood, replace with equal volume NSS</p>
            
            <p className="font-bold mt-2 text-amber-400">Iso-volumetric technique preferred:</p>
            <p className="text-[7px]">Withdraw from one line while infusing NSS through another simultaneously</p>
          </div>
        </div>

        {/* Monitoring */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Monitoring After PET</p>
          <div className="text-[8px] text-purple-600 space-y-0.5">
            <p>• Vital signs during and after procedure</p>
            <p>• Recheck Hct 2-4 hours post-PET</p>
            <p>• Monitor glucose (hypoglycemia risk)</p>
            <p>• Monitor bilirubin (increased hemolysis)</p>
            <p>• Watch for NEC signs</p>
          </div>
        </div>

        {/* Complications of PET */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risks of PET</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• Infection</div>
            <div>• NEC (increased risk)</div>
            <div>• Thrombosis</div>
            <div>• Arrhythmia</div>
            <div>• Hypotension</div>
            <div>• Hemorrhage</div>
            <div>• Air embolism</div>
            <div>• Hypothermia</div>
          </div>
          <p className="text-[7px] text-red-500 mt-1">PET increases NEC risk - monitor closely after procedure</p>
        </div>

        {/* Evidence Note */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Evidence Note</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Current evidence does NOT show long-term neurodevelopmental benefit from PET in asymptomatic babies.</strong></p>
            <p className="mt-1">Therefore:</p>
            <p>• PET recommended only for <strong>symptomatic</strong> polycythaemia</p>
            <p>• Asymptomatic: Conservative management (fluids, monitoring)</p>
            <p>• Discuss risks/benefits with family</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis & Follow-up</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Most cases resolve without long-term effects</p>
            <p>• Symptomatic babies who required PET: Long-term neurodevelopmental follow-up recommended</p>
            <p>• Some studies suggest subtle developmental differences even with treatment</p>
            <p>• Prognosis largely depends on underlying cause and associated conditions</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PolycythaemiaApproach;
