/**
 * Pediatric Abnormal Gait Approach - Flowchart Version
 * Backup saved at: GaitApproach.jsx.backup
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const GaitApproach = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pediatric Abnormal Gait</CardTitle>
        <CardDescription className="text-xs">Diagnostic flowchart</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Important Note */}
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl border-2 border-amber-300">
          <p className="text-xs font-bold text-amber-700 text-center mb-1">⚠️ Important Notes</p>
          <div className="text-[10px] text-amber-600 space-y-0.5">
            <p>• <strong>Hemiplegic, Waddling, Neuropathic gaits are NOT acute</strong></p>
            <p>• Only label <strong>ataxia</strong> if <strong>afebrile + fully conscious</strong></p>
            <p>• Febrile/drowsy child = <strong>Pseudo-ataxia</strong> (treat underlying cause)</p>
          </div>
        </div>

        {/* MAIN FLOWCHART */}
        <div className="relative">
          {/* Starting Point */}
          <div className="flex justify-center">
            <div className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold text-sm shadow-lg">
              Abnormal Gait
            </div>
          </div>
          
          <div className="flex justify-center py-1">
            <div className="w-0.5 h-5 bg-gray-400"></div>
          </div>

          {/* Pattern */}
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold text-xs">
              Gait Pattern?
            </div>
          </div>

          <div className="flex justify-center py-1">
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>

          {/* Gait Types Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Limping */}
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-300">
              <p className="text-xs font-bold text-blue-700 text-center">Limping</p>
              <p className="text-[9px] text-blue-600 text-center">Pain, avoids weight</p>
              <div className="mt-1 p-1 bg-blue-50 dark:bg-blue-950/30 rounded">
                <p className="text-[9px] text-blue-700"><strong>Ix:</strong> CRP, ESR, XR, US</p>
                <p className="text-[9px] text-blue-600">→ Ortho/Rheum</p>
              </div>
            </div>

            {/* Ataxic */}
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-300">
              <p className="text-xs font-bold text-red-700 text-center">Ataxic</p>
              <p className="text-[9px] text-red-600 text-center">Wide-based, unsteady</p>
              <div className="mt-1 p-1 bg-red-50 dark:bg-red-950/30 rounded">
                <p className="text-[9px] text-red-700"><strong>Ix:</strong> CT Brain</p>
                <p className="text-[9px] text-red-600">→ Neuro/Neurosurg</p>
              </div>
            </div>

            {/* Waddling */}
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300">
              <p className="text-xs font-bold text-amber-700 text-center">Waddling</p>
              <p className="text-[9px] text-amber-600 text-center">Trunk weak, Gower +ve</p>
              <div className="mt-1 p-1 bg-amber-50 dark:bg-amber-950/30 rounded">
                <p className="text-[9px] text-amber-700"><strong>Ix:</strong> CK (↑↑)</p>
                <p className="text-[9px] text-amber-600">→ Neurology</p>
              </div>
              <p className="text-[8px] text-amber-500 text-center mt-1">NOT ACUTE</p>
            </div>

            {/* Hemiplegic */}
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-300">
              <p className="text-xs font-bold text-purple-700 text-center">Hemiplegic</p>
              <p className="text-[9px] text-purple-600 text-center">One-sided stiffness</p>
              <div className="mt-1 p-1 bg-purple-50 dark:bg-purple-950/30 rounded">
                <p className="text-[9px] text-purple-700"><strong>Hx:</strong> Birth asphyxia</p>
                <p className="text-[9px] text-purple-600">→ Neurology</p>
              </div>
              <p className="text-[8px] text-purple-500 text-center mt-1">NOT ACUTE</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* ATAXIA FLOWCHART */}
        <div className="p-3 bg-gradient-to-b from-red-50 to-purple-50 dark:from-red-950/20 dark:to-purple-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">Ataxia Workup</p>
          
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-xs">
              Ataxia (Afebrile + Alert)
            </div>
          </div>
          
          <div className="flex justify-center py-1">
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>
          
          <div className="flex justify-center">
            <div className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs font-bold">
              CT Brain
            </div>
          </div>

          <div className="flex justify-center py-1">
            <div className="flex items-end gap-0">
              <div className="w-16 h-0.5 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-16 h-0.5 bg-gray-400"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-center border border-red-200">
              <p className="text-xs font-bold text-red-700">Abnormal</p>
              <p className="text-[9px] text-red-600">Tumor, Bleed</p>
              <p className="text-[10px] text-red-700 font-bold mt-1">→ Neurosurgery</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center border border-green-200">
              <p className="text-xs font-bold text-green-700">Normal</p>
              <p className="text-[9px] text-green-600">Post-viral, Drug</p>
              <p className="text-[10px] text-green-700 font-bold mt-1">→ Neurology</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* Red Flags */}
        <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-xl border-2 border-red-300">
          <p className="text-xs font-bold text-red-700 text-center mb-2">🚨 Red Flags</p>
          <div className="grid grid-cols-2 gap-1 text-[9px] text-red-600">
            <span>• Signs of ↑ICP → CT</span>
            <span>• Focal neuro → CT</span>
            <span>• Altered GCS → CT ± LP</span>
            <span>• Meningism → LP</span>
            <span>• Bilateral LL weak → GBS</span>
            <span>• Abnormal DTR → GBS</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* Ataxia DDx */}
        <div className="p-3 bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-950/20 dark:to-orange-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">Causes of Acute Ataxia</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white dark:bg-gray-900 rounded border border-purple-200">
              <p className="text-[10px] font-bold text-purple-700">Cerebellar Tumor</p>
              <p className="text-[9px] text-gray-500">HA, vomiting, papilledema</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded border border-orange-200">
              <p className="text-[10px] font-bold text-orange-700">OMAS + Neuroblastoma</p>
              <p className="text-[9px] text-gray-500">Opsoclonus, myoclonus</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded border border-blue-200">
              <p className="text-[10px] font-bold text-blue-700">Post-Viral</p>
              <p className="text-[9px] text-gray-500">Recent infection, self-limiting</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded border border-amber-200">
              <p className="text-[10px] font-bold text-amber-700">Intoxication</p>
              <p className="text-[9px] text-gray-500">Drug access, altered GCS</p>
            </div>
          </div>
        </div>

        {/* True vs Pseudo Ataxia */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-300">
            <p className="text-[10px] font-bold text-blue-700 text-center">True Ataxia</p>
            <div className="text-[9px] text-blue-600 mt-1">
              <p>✓ Fully alert</p>
              <p>✓ Afebrile</p>
              <p>✓ Wide-based gait</p>
            </div>
          </div>
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300">
            <p className="text-[10px] font-bold text-amber-700 text-center">Pseudo-Ataxia</p>
            <div className="text-[9px] text-amber-600 mt-1">
              <p>• Drowsy/Febrile</p>
              <p>• Systemic illness</p>
              <p>→ Treat cause</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default GaitApproach;
