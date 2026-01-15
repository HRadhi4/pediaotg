/**
 * Acute Weakness Approach - Flowchart Version
 * Backup saved at: WeaknessApproach.jsx.backup
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const WeaknessApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Approach to Acute Weakness</CardTitle>
        <CardDescription className="text-xs">Diagnostic flowchart</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* MRC Power Scale */}
        <div className="p-2 bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-800 dark:to-blue-900/30 rounded-xl">
          <p className="text-[10px] font-bold text-center text-gray-700 dark:text-gray-300 mb-1">MRC Power Scale</p>
          <div className="flex justify-between text-[9px] text-gray-600">
            <span><strong>0</strong> None</span>
            <span><strong>1</strong> Flicker</span>
            <span><strong>2</strong> No gravity</span>
            <span><strong>3</strong> vs gravity</span>
            <span><strong>4</strong> vs resist</span>
            <span><strong>5</strong> Normal</span>
          </div>
        </div>

        {/* MAIN FLOWCHART */}
        <div className="relative">
          {/* Starting Point */}
          <div className="flex justify-center">
            <div className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg">
              Acute Weakness
            </div>
          </div>
          
          <div className="flex justify-center py-1">
            <div className="w-0.5 h-5 bg-gray-400"></div>
          </div>

          {/* Pattern */}
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold text-xs">
              Pattern of Weakness?
            </div>
          </div>

          <div className="flex justify-center py-1">
            <div className="flex items-end gap-0">
              <div className="w-12 h-0.5 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-12 h-0.5 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-12 h-0.5 bg-gray-400"></div>
            </div>
          </div>

          {/* Three Branches */}
          <div className="grid grid-cols-3 gap-2">
            {/* Unilateral */}
            <div className="space-y-2">
              <div className="p-2 bg-purple-500 text-white rounded-lg text-center">
                <p className="text-[10px] font-bold">Unilateral</p>
                <p className="text-[8px]">± Headache</p>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-3 bg-gray-400"></div>
              </div>
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded text-center border border-purple-300">
                <p className="text-[9px] font-bold text-purple-700">CT Brain</p>
                <p className="text-[8px] text-purple-600">Suspect Stroke</p>
              </div>
              <div className="p-1.5 bg-purple-50 dark:bg-purple-950/30 rounded text-[8px] text-purple-600">
                <p><strong>Tx:</strong> Aspirin</p>
                <p>3-5 mg/kg OD</p>
                {w > 0 && <p className="font-mono">{(w*3).toFixed(0)}-{(w*5).toFixed(0)} mg</p>}
              </div>
            </div>

            {/* Bilateral LL */}
            <div className="space-y-2">
              <div className="p-2 bg-red-500 text-white rounded-lg text-center">
                <p className="text-[10px] font-bold">Bilateral LL</p>
                <p className="text-[8px]">+ Areflexia</p>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-3 bg-gray-400"></div>
              </div>
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded text-center border border-red-300">
                <p className="text-[9px] font-bold text-red-700">MRI Spine</p>
                <p className="text-[8px] text-red-600">Emergency</p>
              </div>
              <div className="flex justify-center py-0.5">
                <div className="flex items-end gap-0">
                  <div className="w-6 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-2 bg-gray-400"></div>
                  <div className="w-6 h-0.5 bg-gray-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0.5">
                <div className="p-1 bg-orange-100 rounded text-center">
                  <p className="text-[8px] font-bold text-orange-600">+ve</p>
                  <p className="text-[7px] text-orange-500">Neurosurg</p>
                </div>
                <div className="p-1 bg-blue-100 rounded text-center">
                  <p className="text-[8px] font-bold text-blue-600">-ve</p>
                  <p className="text-[7px] text-blue-500">TM/GBS</p>
                </div>
              </div>
            </div>

            {/* Other Patterns */}
            <div className="space-y-2">
              <div className="p-2 bg-amber-500 text-white rounded-lg text-center">
                <p className="text-[10px] font-bold">Other</p>
                <p className="text-[8px]">Patterns</p>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-3 bg-gray-400"></div>
              </div>
              <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded text-center border border-amber-300">
                <p className="text-[9px] font-bold text-amber-700">Assess</p>
              </div>
              <div className="p-1.5 bg-amber-50 dark:bg-amber-950/30 rounded text-[8px] text-amber-600 space-y-0.5">
                <p>• Diurnal → MG</p>
                <p>• Calf pain → CK</p>
                <p>• Post-ictal → Todd</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* Key Diagnoses */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">Key Diagnoses & Treatment</p>
          <div className="space-y-2">
            {/* GBS */}
            <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-blue-700">Guillain-Barré (GBS)</p>
                  <p className="text-[9px] text-blue-600">Ascending weakness, areflexia, post-infection</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-green-600">IVIG 2g/kg</p>
                  {w > 0 && <p className="text-[9px] font-mono text-green-600">{(w*2).toFixed(0)}g total</p>}
                </div>
              </div>
            </div>
            
            {/* Transverse Myelitis */}
            <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-purple-700">Transverse Myelitis</p>
                  <p className="text-[9px] text-purple-600">Bilateral LL, sensory level, sphincter Δ</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-green-600">Methylpred 30mg/kg</p>
                  {w > 0 && <p className="text-[9px] font-mono text-green-600">{(w*30).toFixed(0)}mg/d</p>}
                </div>
              </div>
            </div>

            {/* Myasthenia */}
            <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-amber-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-amber-700">Myasthenia Gravis</p>
                  <p className="text-[9px] text-amber-600">Fatiguable, ptosis, diplopia, worse PM</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-green-600">Pyridostigmine</p>
                  <p className="text-[9px] text-green-600">+ IVIG in crisis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Escalation */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-300">
            <p className="text-[10px] font-bold text-red-700 text-center">🚨 Contact PICU</p>
            <p className="text-[9px] text-red-600 text-center">Resp compromise, bulbar, rapid ↑</p>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-300">
            <p className="text-[10px] font-bold text-blue-700 text-center">📞 Contact Neuro</p>
            <p className="text-[9px] text-blue-600 text-center">Stroke, GBS, TM, MG</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default WeaknessApproach;
