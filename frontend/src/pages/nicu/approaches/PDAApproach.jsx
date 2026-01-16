/**
 * Patent Ductus Arteriosus (PDA) Approach
 * Based on Recent Evidence & Guidelines
 * Reference: J Pediatr, JAMA Pediatr
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PDAApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="pda-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Patent Ductus Arteriosus (PDA)</CardTitle>
        <CardDescription className="text-xs">Diagnosis & Management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li>Incidence: ~70% in &lt;28 weeks, ~30% in 28-32 weeks</li>
            <li>Many close spontaneously - conservative approach often appropriate</li>
            <li>Echo confirms diagnosis and hemodynamic significance</li>
            <li>Treatment controversial - individualize decision</li>
          </ul>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Features of hsPDA</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p>• Continuous murmur (may be absent)</p>
              <p>• Hyperdynamic precordium</p>
              <p>• Bounding pulses</p>
            </div>
            <div>
              <p>• Wide pulse pressure</p>
              <p>• Increasing respiratory support</p>
              <p>• Feeding intolerance</p>
            </div>
          </div>
        </div>

        {/* Echo Criteria */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Echo Criteria for hsPDA</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Size:</strong></p>
            <ul className="list-disc pl-4">
              <li>Small: &lt;1.5 mm</li>
              <li>Moderate: 1.5-3 mm</li>
              <li>Large: &gt;3 mm or &gt;1.5 mm/kg</li>
            </ul>
            <p className="mt-2"><strong>Hemodynamic significance:</strong></p>
            <ul className="list-disc pl-4">
              <li>LA:Ao ratio &gt;1.4</li>
              <li>Diastolic flow reversal in aorta</li>
              <li>Absent/reversed diastolic flow in celiac/renal arteries</li>
            </ul>
          </div>
        </div>

        {/* Management Algorithm */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management Approach</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Conservative (often appropriate):</p>
              <ul className="list-disc pl-4">
                <li>Fluid restriction (120-150 mL/kg/day)</li>
                <li>Optimize respiratory support</li>
                <li>Watchful waiting - many close spontaneously</li>
              </ul>
            </div>
            
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Pharmacologic closure:</p>
              <p>If hsPDA with respiratory deterioration or feeding intolerance</p>
            </div>
            
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Surgical/catheter closure:</p>
              <p>Failed medical therapy or contraindications</p>
            </div>
          </div>
        </div>

        {/* Ibuprofen */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Ibuprofen (Preferred)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium">Standard course (IV):</p>
              <p>Day 1: 10 mg/kg</p>
              <p>Day 2: 5 mg/kg</p>
              <p>Day 3: 5 mg/kg</p>
              {w > 0 && (
                <div className="font-mono text-blue-600 dark:text-blue-400 mt-1">
                  <p>Day 1: {(w * 10).toFixed(0)} mg</p>
                  <p>Day 2-3: {(w * 5).toFixed(0)} mg each</p>
                </div>
              )}
            </div>
            
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">Contraindications:</p>
              <ul className="list-disc pl-4">
                <li>Active bleeding / IVH ≥Grade 3</li>
                <li>Thrombocytopenia (&lt;50,000)</li>
                <li>NEC</li>
                <li>Renal failure (Cr &gt;1.6)</li>
                <li>Untreated infection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Paracetamol Alternative */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Paracetamol (Alternative)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Dose:</strong> 15 mg/kg q6h × 3-7 days IV or PO</p>
            {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 15).toFixed(0)} mg q6h</p>}
            <p className="mt-1"><strong>Use when:</strong> NSAIDs contraindicated (renal impairment, thrombocytopenia)</p>
          </div>
        </div>

        {/* Monitoring */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Monitoring During Treatment</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>Before each dose:</p>
            <ul className="list-disc pl-4">
              <li>Urine output (goal &gt;1 mL/kg/hr)</li>
              <li>Serum creatinine</li>
              <li>Platelet count</li>
              <li>Signs of GI bleeding</li>
            </ul>
            <p className="mt-2 font-medium text-red-600 dark:text-red-400">Hold if: UOP &lt;0.5 mL/kg/hr, rising Cr, platelets &lt;50k, NEC signs</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PDAApproach;
