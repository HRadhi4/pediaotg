/**
 * Neonatal Hypoglycemia Approach
 * Updated: 2022 AAP Guidelines Update
 * Reference: Pediatrics 2022, PES 2015 Recommendations
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HypoglycemiaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const pna = parseFloat(postnatalAge) || 0;

  return (
    <Card data-testid="hypoglycemia-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Hypoglycemia</CardTitle>
        <CardDescription className="text-xs">AAP/PES Guidelines</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2022 AAP Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Operational Thresholds */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">AAP Operational Thresholds (2022)</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-amber-100 dark:bg-amber-900/40">
                <th className="border border-amber-200 p-1 text-left">Age</th>
                <th className="border border-amber-200 p-1 text-left">Screen if At-Risk</th>
                <th className="border border-amber-200 p-1 text-left">Treat if &lt;</th>
                <th className="border border-amber-200 p-1 text-left">Target</th>
              </tr>
            </thead>
            <tbody className="text-amber-600">
              <tr className={pna >= 0 && pna < 0.17 ? "bg-amber-200 dark:bg-amber-800" : ""}>
                <td className="border border-amber-200 p-1">0-4 hours</td>
                <td className="border border-amber-200 p-1">Before feed</td>
                <td className="border border-amber-200 p-1 font-bold">&lt;25 mg/dL</td>
                <td className="border border-amber-200 p-1">≥40 mg/dL</td>
              </tr>
              <tr className={pna >= 0.17 && pna < 1 ? "bg-amber-200 dark:bg-amber-800" : ""}>
                <td className="border border-amber-200 p-1">4-24 hours</td>
                <td className="border border-amber-200 p-1">Before feeds</td>
                <td className="border border-amber-200 p-1 font-bold">&lt;35 mg/dL</td>
                <td className="border border-amber-200 p-1">≥45 mg/dL</td>
              </tr>
              <tr className={pna >= 1 ? "bg-amber-200 dark:bg-amber-800" : ""}>
                <td className="border border-amber-200 p-1">&gt;24 hours</td>
                <td className="border border-amber-200 p-1">Before feeds</td>
                <td className="border border-amber-200 p-1 font-bold">&lt;45 mg/dL</td>
                <td className="border border-amber-200 p-1">≥45-50 mg/dL</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[7px] text-amber-500 mt-1">PES recommends maintaining glucose ≥50 mg/dL at all ages</p>
        </div>

        {/* At-Risk Infants */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">At-Risk Infants (Screen)</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Increased Utilization:</p>
              <p>• SGA (&lt;10th percentile)</p>
              <p>• Preterm (&lt;37 weeks)</p>
              <p>• Perinatal stress/asphyxia</p>
              <p>• Hypothermia</p>
              <p>• Sepsis</p>
            </div>
            <div>
              <p className="font-bold">Hyperinsulinism:</p>
              <p>• <strong>IDM</strong> (diabetic mother)</p>
              <p>• <strong>LGA</strong> (&gt;90th percentile)</p>
              <p>• Beckwith-Wiedemann</p>
              <p>• Perinatal stress</p>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Symptoms</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p className="text-red-600 font-bold">⚠️ Symptomatic hypoglycemia is a MEDICAL EMERGENCY</p>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <div>• Jitteriness/tremors</div>
              <div>• Lethargy</div>
              <div>• Poor feeding</div>
              <div>• Hypothermia</div>
              <div>• Apnea</div>
              <div>• Seizures</div>
              <div>• Cyanosis</div>
              <div>• Hypotonia</div>
            </div>
          </div>
        </div>

        {/* Management Algorithm */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">MANAGEMENT ALGORITHM</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Asymptomatic, Glucose 25-40 mg/dL:</p>
            <div className="text-[8px] text-green-600 mt-1">
              <p>Feed (breast or formula) → Recheck in 30-60 min</p>
              <p>If still low → IV dextrose</p>
            </div>
          </div>

          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Symptomatic OR Glucose &lt;25 mg/dL:</p>
            <div className="text-[8px] text-red-600 mt-1">
              <p className="font-bold">IV Dextrose bolus + maintenance infusion</p>
            </div>
          </div>
        </div>

        {/* IV Treatment */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">IV Treatment Protocol</p>
          <div className="text-[8px] space-y-1">
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Bolus (D10W):</p>
              <p>2 mL/kg IV push (= 200 mg/kg dextrose)</p>
              {w > 0 && <p className="font-mono text-green-400">= {(w * 2).toFixed(1)} mL D10W</p>}
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Maintenance (D10W):</p>
              <p>Start at 80 mL/kg/day (GIR ~5-6 mg/kg/min)</p>
              {w > 0 && <p className="font-mono text-green-400">= {(w * 80 / 24).toFixed(1)} mL/hr</p>}
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold text-amber-400">If Refractory (GIR &gt;12 mg/kg/min needed):</p>
              <p>Consider persistent hyperinsulinism → Endocrine consult</p>
              <p className="mt-1"><strong>Diazoxide:</strong> 5-15 mg/kg/day divided q8h</p>
              {w > 0 && <p className="font-mono text-green-400">= {(w * 5).toFixed(0)}-{(w * 15).toFixed(0)} mg/day</p>}
              <p><strong>Glucagon (emergency):</strong> 0.03 mg/kg IM/IV</p>
              {w > 0 && <p className="font-mono text-green-400">= {(w * 0.03).toFixed(2)} mg</p>}
            </div>
          </div>
        </div>

        {/* GIR Calculation */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Glucose Infusion Rate (GIR)</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded font-mono">
              GIR (mg/kg/min) = (% Dextrose × Rate mL/hr) ÷ (Weight kg × 6)
            </div>
            <p>• Normal requirement: 4-6 mg/kg/min</p>
            <p>• If GIR &gt;10-12 needed: suspect hyperinsulinism</p>
            <p>• Max peripheral dextrose: <strong>D12.5%</strong> (risk of extravasation injury)</p>
            <p>• Central line needed for &gt;D12.5%</p>
          </div>
        </div>

        {/* Monitoring */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Monitoring & Weaning</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p>• Check glucose 30 min after intervention</p>
            <p>• Then q1-3h until stable</p>
            <p>• Wean IV dextrose by 1-2 mg/kg/min every 6-12h when glucose stable</p>
            <p>• D/C screening after 3 consecutive values ≥45-50 mg/dL</p>
            <p>• Consider discharge screening in previously affected infants</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Transient hypoglycemia (most cases): Excellent prognosis</p>
            <p>• <strong>Symptomatic</strong> hypoglycemia: Risk of neurodevelopmental impairment</p>
            <p>• Persistent hyperinsulinism: May need surgery (pancreatectomy)</p>
            <p>• All symptomatic cases should have developmental follow-up</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HypoglycemiaApproach;
