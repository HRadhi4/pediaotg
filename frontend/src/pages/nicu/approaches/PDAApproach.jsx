/**
 * Patent Ductus Arteriosus (PDA) Approach
 * Updated: 2024 Guidelines
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PDAApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="pda-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Patent Ductus Arteriosus (PDA)</CardTitle>
        <CardDescription className="text-xs">Assessment & Management Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points (2024)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Conservative approach:</strong> Many PDAs close spontaneously</li>
            <li><strong>Treatment:</strong> Reserved for hemodynamically significant PDA</li>
            <li><strong>Echo assessment:</strong> Size, shunt direction, and hemodynamic significance</li>
            <li><strong>Timing:</strong> Earlier treatment may be beneficial in ELBW infants</li>
          </ul>
        </div>

        {/* Hemodynamic Significance */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Hemodynamically Significant PDA (hsPDA)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Echo criteria:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>PDA diameter &gt;1.5 mm or &gt;1.5 mm/kg</li>
              <li>LA:Ao ratio &gt;1.5</li>
              <li>Left-to-right shunt with diastolic flow reversal</li>
              <li>Absent/reversed diastolic flow in descending aorta</li>
            </ul>
            <p className="font-medium mt-2 mb-1">Clinical signs:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Wide pulse pressure</li>
              <li>Bounding pulses</li>
              <li>Continuous murmur</li>
              <li>Increasing respiratory support</li>
            </ul>
          </div>
        </div>

        {/* Management Options */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management Options</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">1. Conservative/Watchful waiting:</p>
              <p>• Fluid restriction (120-140 mL/kg/day)</p>
              <p>• Optimize respiratory support</p>
              <p>• Many close spontaneously by term</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">2. Pharmacological closure:</p>
              <p>• Ibuprofen (preferred) or Indomethacin</p>
              <p>• Acetaminophen (alternative)</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">3. Surgical/Interventional:</p>
              <p>• Surgical ligation</p>
              <p>• Transcatheter closure (if &gt;700g)</p>
            </div>
          </div>
        </div>

        {/* Drug Dosing */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Pharmacological Treatment</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
            <div>
              <p className="font-medium text-blue-600">Ibuprofen (IV):</p>
              <p>• Loading: 10 mg/kg</p>
              <p>• Then: 5 mg/kg at 24h and 48h</p>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  = {(w * 10).toFixed(1)} mg, then {(w * 5).toFixed(1)} mg × 2
                </p>
              )}
            </div>
            <div>
              <p className="font-medium text-blue-600">Indomethacin (IV):</p>
              <p>• 0.2 mg/kg q12h × 3 doses (if &lt;48h old)</p>
              <p>• 0.2, 0.25, 0.25 mg/kg (if 2-7 days old)</p>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  = {(w * 0.2).toFixed(2)} mg q12h × 3
                </p>
              )}
            </div>
            <div>
              <p className="font-medium text-blue-600">Acetaminophen (IV/PO):</p>
              <p>• 15 mg/kg q6h × 3-7 days</p>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  = {(w * 15).toFixed(1)} mg q6h
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contraindications */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Contraindications to NSAIDs</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Active bleeding</li>
              <li>Thrombocytopenia (&lt;50k)</li>
              <li>Coagulopathy</li>
              <li>NEC or suspected NEC</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Renal failure (Cr &gt;1.8)</li>
              <li>Oliguria (&lt;1 mL/kg/h)</li>
              <li>Hyperbilirubinemia near exchange</li>
              <li>Proven sepsis</li>
            </ul>
          </div>
        </div>

        {/* Monitoring */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Monitoring During Treatment</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Daily creatinine and BUN</li>
            <li>Urine output (hold if &lt;1 mL/kg/h)</li>
            <li>Platelet count</li>
            <li>Signs of bleeding</li>
            <li>Repeat echo after treatment course</li>
          </ul>
        </div>

        {/* Surgical Indications */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surgical Indications</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Failed pharmacological treatment (2 courses)</li>
            <li>Contraindication to medical therapy</li>
            <li>Life-threatening cardiopulmonary compromise</li>
            <li>Inability to wean from ventilator</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
};

export default PDAApproach;
