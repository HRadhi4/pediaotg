/**
 * Neonatal Hypoglycemia Approach
 * Based on AAP 2011 Guidelines & PES 2015 Recommendations
 * Reference: Pediatrics 2011;127:575, J Clin Endocrinol Metab 2015
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HypoglycemiaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const pna = parseFloat(postnatalAge) || 0;

  // Calculate GIR
  const calculateGIR = (dextrosePercent, rate) => {
    if (!w || !rate) return null;
    return ((dextrosePercent * rate) / (w * 6)).toFixed(1);
  };

  return (
    <Card data-testid="hypoglycemia-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Hypoglycemia</CardTitle>
        <CardDescription className="text-xs">AAP / PES Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Operational Thresholds */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">AAP Operational Thresholds</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Age</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Screen if At-Risk</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Treat if &lt;</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Target</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className={pna >= 0 && pna < 0.17 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">0-4 hours</td>
                <td className="py-1">Before feed</td>
                <td className="py-1 font-medium">&lt;25 mg/dL</td>
                <td className="py-1">≥40 mg/dL</td>
              </tr>
              <tr className={pna >= 0.17 && pna < 1 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">4-24 hours</td>
                <td className="py-1">Before feeds</td>
                <td className="py-1 font-medium">&lt;35 mg/dL</td>
                <td className="py-1">≥45 mg/dL</td>
              </tr>
              <tr className={pna >= 1 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">&gt;24 hours</td>
                <td className="py-1">Before feeds</td>
                <td className="py-1 font-medium">&lt;45 mg/dL</td>
                <td className="py-1">≥45-50 mg/dL</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            PES recommends maintaining glucose ≥50 mg/dL at all ages
          </p>
        </div>

        {/* At-Risk Infants */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">At-Risk Infants (Screen)</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Increased Utilization:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>SGA (&lt;10th percentile)</li>
                <li>Preterm (&lt;37 weeks)</li>
                <li>Perinatal stress/asphyxia</li>
                <li>Hypothermia</li>
                <li>Sepsis</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Hyperinsulinism:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>IDM (diabetic mother)</li>
                <li>LGA (&gt;90th percentile)</li>
                <li>Beckwith-Wiedemann</li>
                <li>Perinatal stress</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Symptoms</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2 text-red-600 dark:text-red-400 font-medium">Symptomatic hypoglycemia is a medical emergency</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p>• Jitteriness/tremors</p>
                <p>• Lethargy</p>
                <p>• Poor feeding</p>
                <p>• Hypothermia</p>
              </div>
              <div>
                <p>• Apnea</p>
                <p>• Seizures</p>
                <p>• Cyanosis</p>
                <p>• Hypotonia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Algorithm */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management</p>
          
          <div className="space-y-3 text-xs">
            {/* Asymptomatic */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Asymptomatic, Glucose 25-40 mg/dL:</p>
              <p className="text-slate-600 dark:text-slate-300">Feed (breast or formula) → Recheck in 30-60 min</p>
              <p className="text-slate-600 dark:text-slate-300">If still low → IV dextrose</p>
            </div>

            {/* Symptomatic or severely low */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Symptomatic OR Glucose &lt;25 mg/dL:</p>
              <p className="text-slate-600 dark:text-slate-300 mb-2">IV Dextrose bolus + maintenance infusion</p>
              
              <div className="space-y-2 pl-2 border-l-2 border-blue-300">
                <div>
                  <p className="font-medium">Bolus (D10W):</p>
                  <p>2 mL/kg IV push (= 200 mg/kg dextrose)</p>
                  {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 2).toFixed(1)} mL D10W</p>}
                </div>
                
                <div>
                  <p className="font-medium">Maintenance (D10W):</p>
                  <p>Start at 80 mL/kg/day (GIR ~5-6 mg/kg/min)</p>
                  {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 80 / 24).toFixed(1)} mL/hr</p>}
                </div>
              </div>
            </div>

            {/* Refractory */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Refractory (GIR &gt;12 mg/kg/min needed):</p>
              <p className="text-slate-600 dark:text-slate-300">Consider persistent hyperinsulinism → Endocrine consult</p>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                <strong>Diazoxide:</strong> 5-15 mg/kg/day divided q8h
                {w > 0 && <span className="font-mono text-blue-600 dark:text-blue-400 ml-1">= {(w * 5).toFixed(0)}-{(w * 15).toFixed(0)} mg/day</span>}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                <strong>Glucagon:</strong> 0.03 mg/kg IM/IV (emergency)
                {w > 0 && <span className="font-mono text-blue-600 dark:text-blue-400 ml-1">= {(w * 0.03).toFixed(2)} mg</span>}
              </p>
            </div>
          </div>
        </div>

        {/* GIR Calculation */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Glucose Infusion Rate (GIR)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded font-mono mb-2">
              GIR (mg/kg/min) = (% Dextrose × Rate mL/hr) ÷ (Weight kg × 6)
            </div>
            <p>• Normal requirement: 4-6 mg/kg/min</p>
            <p>• If GIR &gt;10-12 needed: suspect hyperinsulinism</p>
            <p>• Max peripheral dextrose: D12.5% (risk of extravasation injury)</p>
            <p>• Central line needed for &gt;D12.5%</p>
          </div>
        </div>

        {/* Monitoring */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Monitoring & Weaning</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• Check glucose 30 min after intervention</p>
            <p>• Then q1-3h until stable</p>
            <p>• Wean IV dextrose by 1-2 mg/kg/min every 6-12h when glucose stable</p>
            <p>• D/C screening after 3 consecutive values ≥45-50 mg/dL</p>
            <p>• Consider discharge screening in previously affected infants</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HypoglycemiaApproach;
