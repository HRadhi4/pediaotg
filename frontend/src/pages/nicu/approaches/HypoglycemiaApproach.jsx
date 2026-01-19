/**
 * Hypoglycemia Approach
 * Updated: 2024 AAP Guidelines
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HypoglycemiaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const pnaHours = pna * 24;

  // GIR calculation
  const calculateGIR = (rate, dextrose) => {
    if (!w || !rate || !dextrose) return null;
    return ((dextrose * rate) / (w * 6)).toFixed(1);
  };

  return (
    <Card data-testid="hypoglycemia-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Hypoglycemia</CardTitle>
        <CardDescription className="text-xs">AAP 2024 Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Definition */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Definition (AAP 2024)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Age</th>
                  <th className="text-left py-1">Threshold</th>
                  <th className="text-left py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className={pnaHours < 4 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                  <td className="py-1">0-4 hours</td>
                  <td className="font-bold">&lt;25 mg/dL <span className="font-normal text-slate-500">(&lt;1.4 mmol/L)</span></td>
                  <td>Feed + recheck</td>
                </tr>
                <tr className={pnaHours >= 4 && pnaHours < 24 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                  <td className="py-1">4-24 hours</td>
                  <td className="font-bold">&lt;35 mg/dL <span className="font-normal text-slate-500">(&lt;1.9 mmol/L)</span></td>
                  <td>Feed + recheck</td>
                </tr>
                <tr className={pnaHours >= 24 && pnaHours < 48 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                  <td className="py-1">24-48 hours</td>
                  <td className="font-bold">&lt;45 mg/dL <span className="font-normal text-slate-500">(&lt;2.5 mmol/L)</span></td>
                  <td>Evaluate cause</td>
                </tr>
                <tr className={pnaHours >= 48 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                  <td className="py-1">&gt;48 hours</td>
                  <td className="font-bold">&lt;60 mg/dL <span className="font-normal text-slate-500">(&lt;3.3 mmol/L)</span></td>
                  <td>Persistent hypoglycemia</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors - Screen These Infants</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Large for GA / Small for GA:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>SGA (&lt;10th percentile)</li>
                <li>LGA (&gt;90th percentile)</li>
                <li>IUGR</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Maternal/Infant factors:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Infant of diabetic mother</strong></li>
                <li>Late preterm (34-36 weeks)</li>
                <li>Perinatal stress/asphyxia</li>
                <li>Hypothermia</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Management Algorithm */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management Algorithm</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Asymptomatic + Glucose 25-45 mg/dL (1.4-2.5 mmol/L):</p>
              <p>1. Feed (breast or formula)</p>
              <p>2. Recheck glucose 30 min after feed</p>
              <p>3. If still low → consider IV glucose</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Symptomatic OR Glucose &lt;25 mg/dL (&lt;1.4 mmol/L):</p>
              <p>1. IV glucose bolus: D10W 2 mL/kg</p>
              <p>2. Start IV infusion at GIR 5-8 mg/kg/min</p>
              <p>3. Recheck glucose 30 min post-bolus</p>
            </div>
          </div>
        </div>

        {/* IV Glucose */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">IV Glucose Calculations</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Bolus (for symptomatic/severe):</p>
              <p>D10W 2 mL/kg IV push over 1-2 minutes</p>
              {w > 0 && <p className="font-mono text-blue-600">= {(w * 2).toFixed(1)} mL D10W</p>}
            </div>
            <div>
              <p className="font-medium">GIR Formula:</p>
              <p className="font-mono bg-slate-100 dark:bg-slate-900 p-1 rounded">
                GIR = (% Dextrose × Rate mL/kg/day) ÷ 144
              </p>
            </div>
            <div>
              <p className="font-medium">Target GIR:</p>
              <p>• Start: 5-6 mg/kg/min</p>
              <p>• Increase: up to 10-12 mg/kg/min if needed</p>
              <p>• Max peripheral: D12.5W (higher requires central line)</p>
            </div>
            {w > 0 && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded mt-2">
                <p className="font-medium">D10W rates for {w} kg:</p>
                <p>GIR 6: <span className="font-mono text-blue-600">{((6 * w * 144) / 10).toFixed(0)} mL/day = {((6 * w * 144) / 10 / 24).toFixed(1)} mL/hr</span></p>
                <p>GIR 8: <span className="font-mono text-blue-600">{((8 * w * 144) / 10).toFixed(0)} mL/day = {((8 * w * 144) / 10 / 24).toFixed(1)} mL/hr</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Symptoms */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Symptoms of Hypoglycemia</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Jitteriness/tremors</li>
              <li>Lethargy</li>
              <li>Poor feeding</li>
              <li>Hypotonia</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Seizures</li>
              <li>Apnea</li>
              <li>Cyanosis</li>
              <li>Hypothermia</li>
            </ul>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
            ⚠️ Symptoms are nonspecific - always check glucose in at-risk infants
          </p>
        </div>

        {/* Persistent Hypoglycemia */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Persistent Hypoglycemia (&gt;48h)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1">If requiring GIR &gt;10 mg/kg/min or glucose &lt;60 at 48h, consider:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Hyperinsulinism (most common)</li>
              <li>Cortisol deficiency</li>
              <li>Growth hormone deficiency</li>
              <li>Inborn errors of metabolism</li>
            </ul>
            <p className="mt-2"><strong>Workup:</strong> Critical sample during hypoglycemia (insulin, cortisol, GH, ketones, lactate, FFA)</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HypoglycemiaApproach;
