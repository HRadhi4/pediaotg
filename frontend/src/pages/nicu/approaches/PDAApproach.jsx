/**
 * Patent Ductus Arteriosus (PDA) Approach
 * Updated: 2024 Guidelines
 * Simplified design matching Apnea approach
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
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2024)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Incidence:</strong> ~70% in &lt;28 weeks</p>
            <p><strong>Key change:</strong> Many close spontaneously - conservative approach OK</p>
            <p><strong>Treat:</strong> Hemodynamically significant PDA (hsPDA) only</p>
            <p><strong>Early routine closure:</strong> NOT beneficial</p>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Signs of hsPDA</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-blue-600">
            <div>
              <p className="font-bold">Cardiac:</p>
              <p>• Continuous murmur</p>
              <p>• Hyperdynamic precordium</p>
              <p>• Bounding pulses</p>
            </div>
            <div>
              <p className="font-bold">Systemic:</p>
              <p>• ↑ Respiratory support</p>
              <p>• Feeding intolerance</p>
              <p>• ↓ Urine output</p>
            </div>
          </div>
        </div>

        {/* Echo Criteria */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Echo Criteria for hsPDA</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Size:</strong> &gt;1.5 mm/kg or &gt;3 mm</p>
            <p><strong>LA:Ao ratio:</strong> &gt;1.4-1.5</p>
            <p><strong>Flow:</strong> Diastolic reversal in descending Ao</p>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Management Approach</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-green-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Step 1: Conservative</p>
              <p>Optimize PEEP</p>
              <p>Watchful waiting</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Step 2: Medical</p>
              <p>If symptomatic hsPDA</p>
            </div>
          </div>
        </div>

        {/* Ibuprofen */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Ibuprofen (Preferred)</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Standard Course:</p>
            <p>Day 1: 10 mg/kg → Day 2-3: 5 mg/kg each</p>
            {w > 0 && (
              <div className="text-green-400 font-mono">
                <p>Day 1: {(w * 10).toFixed(0)} mg</p>
                <p>Day 2-3: {(w * 5).toFixed(0)} mg</p>
              </div>
            )}
            
            <p className="font-bold text-red-400 mt-2">Contraindications:</p>
            <p>Active bleeding, IVH ≥III, NEC, platelets &lt;50K, renal failure</p>
          </div>
        </div>

        {/* Paracetamol */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Paracetamol (Alternative)</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Dose:</strong> 15 mg/kg q6h × 3-7 days</p>
            {w > 0 && <p className="text-green-600 font-mono">= {(w * 15).toFixed(0)} mg q6h</p>}
            <p><strong>Use when:</strong> NSAID contraindicated (renal impairment, bleeding)</p>
          </div>
        </div>

        {/* Monitoring */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Monitoring During Treatment</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Before each dose:</strong></p>
            <p>• Urine output (&gt;1 mL/kg/hr)</p>
            <p>• Creatinine, platelets</p>
            <p className="text-red-600 font-bold">HOLD if UOP &lt;0.5-1 mL/kg/hr, NEC signs</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Many close spontaneously</p>
            <p>• Medical closure: 70-80%</p>
            <p>• Surgery: Reserved for failures</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PDAApproach;
