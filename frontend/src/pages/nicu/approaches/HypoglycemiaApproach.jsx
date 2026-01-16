/**
 * Neonatal Hypoglycemia Approach
 * Updated: 2022 AAP Guidelines
 * Simplified design matching Apnea approach
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HypoglycemiaApproach = ({ weight, postnatalAge }) => {
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

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2022)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Screen:</strong> At-risk infants (IDM, SGA, LGA, preterm)</p>
            <p><strong>Symptomatic:</strong> Always treat immediately with IV dextrose</p>
            <p><strong>GIR &gt;12:</strong> Suspect hyperinsulinism</p>
          </div>
        </div>

        {/* Thresholds */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">AAP Operational Thresholds</p>
          <div className="grid grid-cols-3 gap-2 text-[8px] text-blue-600">
            <div className={`p-1.5 bg-white dark:bg-gray-900 rounded ${pna < 4 ? 'ring-2 ring-blue-400' : ''}`}>
              <p className="font-bold">0-4 hours</p>
              <p>Treat if &lt;25</p>
              <p>Target ≥40</p>
            </div>
            <div className={`p-1.5 bg-white dark:bg-gray-900 rounded ${pna >= 4 && pna < 24 ? 'ring-2 ring-blue-400' : ''}`}>
              <p className="font-bold">4-24 hours</p>
              <p>Treat if &lt;35</p>
              <p>Target ≥45</p>
            </div>
            <div className={`p-1.5 bg-white dark:bg-gray-900 rounded ${pna >= 24 ? 'ring-2 ring-blue-400' : ''}`}>
              <p className="font-bold">&gt;24 hours</p>
              <p>Treat if &lt;45</p>
              <p>Target ≥45-50</p>
            </div>
          </div>
        </div>

        {/* At-Risk */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">At-Risk Infants (Screen)</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">↑ Utilization:</p>
              <p>• SGA (&lt;10th %ile)</p>
              <p>• Preterm (&lt;37 wk)</p>
              <p>• Perinatal stress</p>
              <p>• Sepsis</p>
            </div>
            <div>
              <p className="font-bold">Hyperinsulinism:</p>
              <p>• <strong>IDM</strong></p>
              <p>• <strong>LGA</strong> (&gt;90th %ile)</p>
              <p>• Beckwith-Wiedemann</p>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Symptoms</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-purple-600">
            <p>• Jitteriness</p>
            <p>• Lethargy</p>
            <p>• Poor feeding</p>
            <p>• Apnea</p>
            <p>• Seizures</p>
            <p>• Hypothermia</p>
          </div>
          <p className="text-red-600 mt-1 font-bold">⚠️ Symptomatic = Medical Emergency</p>
        </div>

        {/* Treatment */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Treatment Protocol</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Asymptomatic (Glucose 25-40):</p>
            <p>Feed → recheck in 30-60 min</p>
            
            <p className="font-bold text-red-400 mt-2">Symptomatic OR &lt;25:</p>
            <p>D10W bolus: 2 mL/kg IV</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 2).toFixed(1)} mL D10W</p>}
            
            <p className="font-bold text-cyan-400 mt-2">Maintenance:</p>
            <p>D10W at 80 mL/kg/day (GIR ~5-6)</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 80 / 24).toFixed(1)} mL/hr</p>}
          </div>
        </div>

        {/* Refractory */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Refractory (GIR &gt;12)</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p className="font-bold text-red-600">Suspect hyperinsulinism → Endocrine consult</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Diazoxide:</p>
                <p>5-15 mg/kg/day ÷ q8h</p>
                {w > 0 && <p className="text-green-600 font-mono">= {(w * 5).toFixed(0)}-{(w * 15).toFixed(0)} mg/day</p>}
              </div>
              <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Glucagon (emergency):</p>
                <p>0.03 mg/kg IM/IV</p>
                {w > 0 && <p className="text-green-600 font-mono">= {(w * 0.03).toFixed(2)} mg</p>}
              </div>
            </div>
          </div>
        </div>

        {/* GIR Formula */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">GIR Formula</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p className="font-mono bg-teal-100 p-1 rounded">GIR = (% Dex × Rate mL/hr) ÷ (Wt kg × 6)</p>
            <p>Normal requirement: 4-6 mg/kg/min</p>
            <p>Max peripheral: <strong>D12.5%</strong></p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Transient: Excellent prognosis</p>
            <p>• <strong>Symptomatic:</strong> Risk of NDI</p>
            <p>• Hyperinsulinism may need surgery</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HypoglycemiaApproach;
