/**
 * Polycythemia Approach
 * Updated: 2023-2024 Evidence-Based Guidelines
 * Reference: UCSF 2023, CAHS Guidelines, Cochrane Review
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PolycythemiaApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  // Calculate partial exchange volume
  const calculateExchangeVolume = (observedHct) => {
    if (!w || !observedHct) return null;
    const bloodVolume = 80;
    const desiredHct = 55;
    const volume = (bloodVolume * w * (observedHct - desiredHct)) / observedHct;
    return volume.toFixed(0);
  };

  return (
    <Card data-testid="polycythemia-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Polycythemia</CardTitle>
        <CardDescription className="text-xs">Neonatal Hyperviscosity Syndrome</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Definition */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Definition</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Polycythemia:</strong> Venous hematocrit ≥65%</li>
            <li><strong>Hyperviscosity:</strong> Blood viscosity &gt;2 SD above normal</li>
            <li>Incidence: 2-5% of newborns; higher at altitude</li>
          </ul>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">⚠️ MUST confirm with venous sample (capillary Hct may be 5-15% higher)</p>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Placental transfusion:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Delayed cord clamping (&gt;3 min)</li>
                <li>Twin-twin transfusion (recipient)</li>
                <li>Maternal-fetal transfusion</li>
                <li>Cord milking</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Increased erythropoiesis:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>IUGR/SGA</li>
                <li><strong>Infant of diabetic mother</strong></li>
                <li>Post-term pregnancy</li>
                <li>Chronic fetal hypoxia</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Features</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">CNS:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Lethargy</li>
                <li>Irritability</li>
                <li>Hypotonia</li>
                <li>Poor feeding</li>
                <li>Seizures (rare)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Cardiorespiratory:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Tachypnea</li>
                <li>Cyanosis</li>
                <li>Heart murmur</li>
                <li>Plethora</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Note: Most cases (80-90%) are asymptomatic</p>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management Approach</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Hct</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Symptoms</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">60-65%</td><td>None</td><td>Observe, hydration</td></tr>
              <tr><td className="py-1">65-70%</td><td>None</td><td>Observe, recheck</td></tr>
              <tr><td className="py-1">65-70%</td><td>Present</td><td>Consider PET</td></tr>
              <tr><td className="py-1 font-bold">&gt;70%</td><td>Any</td><td className="font-bold">PET indicated</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">PET = Partial Exchange Transfusion</p>
        </div>

        {/* PET Calculation */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Partial Exchange Transfusion</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium">Formula:</p>
            <p className="font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded">
              Volume (mL) = Blood volume × (Observed Hct - Desired Hct) / Observed Hct
            </p>
            <p>Blood volume = 80 mL/kg (term), 90-100 mL/kg (preterm)</p>
            <p>Target Hct = 55%</p>
            
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For current weight ({w} kg):</p>
                <p>If Hct 70%: <span className="font-mono text-blue-600">{calculateExchangeVolume(70)} mL</span></p>
                <p>If Hct 75%: <span className="font-mono text-blue-600">{calculateExchangeVolume(75)} mL</span></p>
              </div>
            )}
            
            <p className="mt-2"><strong>Replacement fluid:</strong> Normal saline (preferred) or 5% albumin</p>
          </div>
        </div>

        {/* Evidence Note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Evidence Note</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>Cochrane review (2010): No clear evidence PET improves long-term outcomes</p>
            <p className="mt-1">Current practice: Reserve PET for symptomatic cases with Hct &gt;70%</p>
            <p>Most asymptomatic cases can be managed conservatively with hydration</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PolycythemiaApproach;
