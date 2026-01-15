/**
 * Pediatric Headache Approach - Flowchart Version
 * Backup saved at: HeadacheApproach.jsx.backup
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HeadacheApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pediatric Headache</CardTitle>
        <CardDescription className="text-xs">Diagnostic flowchart</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* RED FLAGS */}
        <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-xl border-2 border-red-300">
          <p className="text-xs font-bold text-red-700 text-center mb-2">🚨 RED FLAGS → CT Brain</p>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-red-600">
            <span>• Early morning/night HA</span>
            <span>• Progressive worsening</span>
            <span>• Neuro signs (gait, GCS)</span>
            <span>• Papilledema</span>
          </div>
        </div>

        {/* MAIN FLOWCHART */}
        <div className="relative">
          {/* Starting Point */}
          <div className="flex justify-center">
            <div className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold text-sm shadow-lg">
              Headache
            </div>
          </div>
          
          <div className="flex justify-center py-1">
            <div className="w-0.5 h-5 bg-gray-400"></div>
          </div>

          {/* Duration Branch */}
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold text-xs">
              Duration?
            </div>
          </div>

          <div className="flex justify-center py-1">
            <div className="flex items-end gap-0">
              <div className="w-20 h-0.5 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-20 h-0.5 bg-gray-400"></div>
            </div>
          </div>

          {/* Acute vs Chronic */}
          <div className="grid grid-cols-2 gap-3">
            {/* Acute */}
            <div className="space-y-2">
              <div className="p-2 bg-blue-500 text-white rounded-lg text-center">
                <p className="text-xs font-bold">Acute (≤7 days)</p>
              </div>
              <div className="flex justify-center py-1">
                <div className="flex items-end gap-0">
                  <div className="w-8 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                  <div className="w-8 h-0.5 bg-gray-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="p-1.5 bg-red-100 dark:bg-red-950/30 rounded text-center border border-red-200">
                  <p className="text-[9px] font-bold text-red-600">1st Onset</p>
                  <p className="text-[8px] text-red-500">CT Brain</p>
                </div>
                <div className="p-1.5 bg-green-100 dark:bg-green-950/30 rounded text-center border border-green-200">
                  <p className="text-[9px] font-bold text-green-600">Episodic</p>
                  <p className="text-[8px] text-green-500">Check flags</p>
                </div>
              </div>
            </div>

            {/* Chronic */}
            <div className="space-y-2">
              <div className="p-2 bg-amber-500 text-white rounded-lg text-center">
                <p className="text-xs font-bold">Chronic (&gt;7 days)</p>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-gray-400"></div>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-center border border-amber-300">
                <p className="text-xs font-bold text-amber-700">CT Brain</p>
              </div>
              <div className="flex justify-center py-1">
                <div className="flex items-end gap-0">
                  <div className="w-8 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                  <div className="w-8 h-0.5 bg-gray-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-950/30 rounded text-center border border-purple-200">
                  <p className="text-[9px] font-bold text-purple-600">Abnormal</p>
                  <p className="text-[8px] text-purple-500">Neurosurgery</p>
                </div>
                <div className="p-1.5 bg-teal-100 dark:bg-teal-950/30 rounded text-center border border-teal-200">
                  <p className="text-[9px] font-bold text-teal-600">Normal</p>
                  <p className="text-[8px] text-teal-500">Check fundus</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CT Normal Flow */}
        <div className="p-3 bg-gradient-to-b from-teal-50 to-purple-50 dark:from-teal-950/20 dark:to-purple-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 mb-2">CT Normal + Chronic → Fundoscopy</p>
          <div className="flex justify-center">
            <div className="px-3 py-1.5 bg-teal-500 text-white rounded-lg text-xs font-bold">
              Papilledema?
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
              <p className="text-xs font-bold text-red-700">YES</p>
              <p className="text-[10px] text-red-600">Admit → IIH workup</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center border border-green-200">
              <p className="text-xs font-bold text-green-700">NO</p>
              <p className="text-[10px] text-green-600">Neurology consult</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* Migraine vs Tension */}
        <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">Migraine vs Tension</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg border border-purple-300">
              <p className="text-xs font-bold text-purple-700 text-center mb-1">Migraine</p>
              <div className="text-[9px] text-purple-600 space-y-0.5">
                <p>• Unilateral/Bilateral</p>
                <p>• Pulsating/Throbbing</p>
                <p>• 2-72 hours</p>
                <p>• Nausea, photo/phonophobia</p>
                <p>• Family history +</p>
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg border border-blue-300">
              <p className="text-xs font-bold text-blue-700 text-center mb-1">Tension</p>
              <div className="text-[9px] text-blue-600 space-y-0.5">
                <p>• Frontal</p>
                <p>• Squeezing/Pressure</p>
                <p>• Hours to days</p>
                <p>• No associations</p>
                <p>• Stress trigger</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* Treatment */}
        <div className="p-3 bg-gradient-to-r from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">Acute Migraine Treatment</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded text-center">
              <p className="text-[10px] font-bold text-green-700">Paracetamol</p>
              <p className="text-[9px] text-green-600">10-15 mg/kg</p>
              {w > 0 && <p className="text-[10px] font-mono text-green-700">{(w*10).toFixed(0)}-{(w*15).toFixed(0)} mg</p>}
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-center">
              <p className="text-[10px] font-bold text-blue-700">Ibuprofen</p>
              <p className="text-[9px] text-blue-600">5-10 mg/kg</p>
              {w > 0 && <p className="text-[10px] font-mono text-blue-700">{(w*5).toFixed(0)}-{(w*10).toFixed(0)} mg</p>}
            </div>
          </div>
        </div>

        {/* IIH */}
        <div className="p-3 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-amber-700 dark:text-amber-300 mb-2">IIH (Idiopathic Intracranial HTN)</p>
          <div className="grid grid-cols-3 gap-1 text-[9px]">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded text-center">
              <p className="font-bold text-amber-600">Signs</p>
              <p className="text-gray-500">Papilledema, CN VI palsy</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded text-center">
              <p className="font-bold text-amber-600">Dx</p>
              <p className="text-gray-500">LP: ICP &gt;25</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded text-center">
              <p className="font-bold text-green-600">Tx</p>
              <p className="text-gray-500">Acetazolamide</p>
              {w > 0 && <p className="font-mono text-green-600">{(w*25).toFixed(0)}mg/d</p>}
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HeadacheApproach;
