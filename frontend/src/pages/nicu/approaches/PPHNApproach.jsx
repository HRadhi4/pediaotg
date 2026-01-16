/**
 * Persistent Pulmonary Hypertension (PPHN) Approach
 * Updated: 2024 Guidelines
 * Simplified design matching Apnea approach
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PPHNApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="pphn-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">PPHN</CardTitle>
        <CardDescription className="text-xs">Persistent Pulmonary Hypertension of the Newborn</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 AHA/ATS Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2024)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Definition:</strong> Failure of normal postnatal PVR decline → R→L shunt</p>
            <p><strong>Key sign:</strong> Pre-post ductal SpO2 difference &gt;10%</p>
            <p><strong>iNO:</strong> Start at OI ≥25 (AHA Class I)</p>
            <p><strong>ECMO:</strong> Consider if OI &gt;40 despite maximal therapy</p>
          </div>
        </div>

        {/* Causes */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Causes</p>
          <div className="grid grid-cols-3 gap-2 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Maladaptation (70%)</p>
              <p>MAS, RDS, sepsis</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Maldevelopment</p>
              <p>Chronic hypoxia, SSRIs</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Underdevelopment</p>
              <p>CDH, lung hypoplasia</p>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Diagnosis</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Clinical:</strong> Pre-post SpO2 gradient &gt;5-10%</p>
            <p><strong>Echo (Gold Standard):</strong></p>
            <p>• R→L shunt at PDA/PFO</p>
            <p>• Septal flattening/bowing</p>
            <p>• Excludes structural CHD</p>
            <p className="mt-1"><strong>OI Formula:</strong> (MAP × FiO2 × 100) / PaO2</p>
          </div>
        </div>

        {/* OI Guide */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">OI-Based Management</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-orange-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">OI &lt;25</p>
              <p>Optimize ventilation</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-red-600">OI 25-40</p>
              <p>Start iNO 20 ppm</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded col-span-2">
              <p className="font-bold text-red-700">OI &gt;40</p>
              <p>Consider ECMO</p>
            </div>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Management</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">General:</p>
            <p>• Minimal handling, sedation</p>
            <p>• Target preductal SpO2 95-99%</p>
            
            <p className="font-bold text-cyan-400 mt-2">iNO (Inhaled Nitric Oxide):</p>
            <p>Start 20 ppm → wean when OI &lt;15</p>
            <p className="text-red-400">⚠️ Never stop abruptly - rebound PHT</p>
            
            <p className="font-bold text-purple-400 mt-2">Vasodilators:</p>
            <p>Sildenafil 0.5-2 mg/kg PO q6-8h</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 0.5).toFixed(1)}-{(w * 2).toFixed(0)} mg/dose</p>}
          </div>
        </div>

        {/* Hemodynamic Support */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Hemodynamic Support</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p className="font-bold">Goal: Systemic BP &gt; PA pressure</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Dopamine</p>
                <p>5-20 mcg/kg/min</p>
              </div>
              <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                <p className="font-bold">Norepinephrine</p>
                <p>0.05-0.3 mcg/kg/min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Overall survival: 85-95%</p>
            <p>• Better: MAS, RDS, idiopathic</p>
            <p>• Worse: CDH, lung hypoplasia</p>
            <p>• Hearing screening essential</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PPHNApproach;
