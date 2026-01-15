/**
 * Decreased Level of Consciousness (DLOC) Approach - Flowchart Version
 * Backup saved at: DlocApproach.jsx.backup
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DlocApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Decreased Level of Consciousness</CardTitle>
        <CardDescription className="text-xs">Diagnostic & management flowchart</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* DLOC GRADES */}
        <div className="p-3 bg-gradient-to-r from-green-50 via-yellow-50 via-orange-50 to-red-50 dark:from-green-950/20 dark:via-yellow-950/20 dark:via-orange-950/20 dark:to-red-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">DLOC Severity Grades</p>
          <div className="grid grid-cols-4 gap-1">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded text-center">
              <p className="text-[10px] font-bold text-green-700">Lethargy</p>
              <p className="text-[8px] text-green-600">Drowsy, arousable</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded text-center">
              <p className="text-[10px] font-bold text-yellow-700">Obtunded</p>
              <p className="text-[8px] text-yellow-600">Needs loud voice</p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded text-center">
              <p className="text-[10px] font-bold text-orange-700">Stupor</p>
              <p className="text-[8px] text-orange-600">Pain response</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded text-center">
              <p className="text-[10px] font-bold text-red-700">Coma</p>
              <p className="text-[8px] text-red-600">No response</p>
            </div>
          </div>
        </div>

        {/* MAIN FLOWCHART */}
        <div className="relative">
          {/* Starting Point */}
          <div className="flex justify-center">
            <div className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg">
              DLOC Patient
            </div>
          </div>
          
          <div className="flex justify-center py-1">
            <div className="w-0.5 h-5 bg-gray-400"></div>
          </div>

          {/* ABC Stabilization */}
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl border-2 border-blue-400 mb-3">
            <p className="text-xs font-bold text-blue-700 text-center mb-2">Initial Stabilization (ABC)</p>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="p-1.5 bg-red-50 dark:bg-red-900/30 rounded text-center border border-red-200">
                <p className="font-bold text-red-600">A</p>
                <p className="text-red-500">Intubate if GCS↓</p>
              </div>
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded text-center border border-blue-200">
                <p className="font-bold text-blue-600">B</p>
                <p className="text-blue-500">O₂ if SpO₂&lt;94%</p>
              </div>
              <div className="p-1.5 bg-purple-50 dark:bg-purple-900/30 rounded text-center border border-purple-200">
                <p className="font-bold text-purple-600">C</p>
                <p className="text-purple-500">Fluid if shock</p>
                {w > 0 && <p className="text-purple-600 font-mono">{(w*20).toFixed(0)}mL</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-center py-1">
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>

          {/* Core Investigations */}
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-amber-500 text-white rounded-lg font-bold text-xs">
              Core Investigations
            </div>
          </div>
          
          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg mt-2 mb-3">
            <div className="grid grid-cols-2 gap-1 text-[9px] text-amber-700">
              <span>• Glucose</span><span>• Blood gas</span>
              <span>• U&E</span><span>• FBC</span>
              <span>• Ammonia</span><span>• Lactate</span>
              <span>• Blood culture</span><span>• Urine tox</span>
            </div>
          </div>

          <div className="flex justify-center py-1">
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>

          {/* Decision Point */}
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold text-xs">
              History + Exam + Labs
            </div>
          </div>

          <div className="flex justify-center py-1">
            <div className="flex items-end gap-0">
              <div className="w-20 h-0.5 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-20 h-0.5 bg-gray-400"></div>
            </div>
          </div>

          {/* Branches */}
          <div className="grid grid-cols-2 gap-3">
            {/* Neurological */}
            <div className="space-y-2">
              <div className="p-2 bg-red-500 text-white rounded-lg text-center">
                <p className="text-xs font-bold">Neuro / Unclear</p>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-gray-400"></div>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-center border border-red-300">
                <p className="text-xs font-bold text-red-700">CT Brain</p>
              </div>
              <div className="flex justify-center py-1">
                <div className="flex items-end gap-0">
                  <div className="w-8 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                  <div className="w-8 h-0.5 bg-gray-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="p-1.5 bg-red-50 dark:bg-red-950/30 rounded text-center border border-red-200">
                  <p className="text-[9px] font-bold text-red-600">Abnormal</p>
                  <p className="text-[8px] text-red-500">Neurosurgery</p>
                </div>
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/30 rounded text-center border border-blue-200">
                  <p className="text-[9px] font-bold text-blue-600">Normal</p>
                  <p className="text-[8px] text-blue-500">LP → Neuro</p>
                </div>
              </div>
            </div>

            {/* Non-Neurological */}
            <div className="space-y-2">
              <div className="p-2 bg-green-500 text-white rounded-lg text-center">
                <p className="text-xs font-bold">Clear Cause</p>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-gray-400"></div>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center border border-green-300">
                <p className="text-xs font-bold text-green-700">Treat Cause</p>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded text-[9px] text-green-600 space-y-0.5">
                <p>• Hypoglycemia → Dextrose</p>
                <p>• Shock → Fluids</p>
                <p>• Infection → Abx</p>
                <p>• Toxin → Antidote</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* GCS Quick Reference */}
        <div className="p-3 bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">Pediatric GCS Quick Reference</p>
          <div className="grid grid-cols-3 gap-2 text-[9px]">
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-purple-600 mb-1">Eye (1-4)</p>
              <p>4: Spontaneous</p>
              <p>3: To voice</p>
              <p>2: To pain</p>
              <p>1: None</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-blue-600 mb-1">Verbal (1-5)</p>
              <p>5: Oriented/Coos</p>
              <p>4: Confused/Cries</p>
              <p>3: Inappropriate</p>
              <p>2: Incomprehensible</p>
              <p>1: None</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-green-600 mb-1">Motor (1-6)</p>
              <p>6: Obeys</p>
              <p>5: Localizes</p>
              <p>4: Withdraws</p>
              <p>3: Flexion</p>
              <p>2: Extension</p>
              <p>1: None</p>
            </div>
          </div>
          <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-center">
            <p className="text-[10px] text-blue-700"><strong>GCS &lt;12:</strong> Assess q15min | <strong>GCS 12-14:</strong> Assess q1h</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-3"></div>

        {/* Drug Antidotes */}
        <div className="p-3 bg-gradient-to-r from-amber-50 to-green-50 dark:from-amber-950/20 dark:to-green-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-2">Drug Antidotes</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white dark:bg-gray-900 rounded text-center">
              <p className="text-[10px] font-bold text-amber-700">Opioid</p>
              <p className="text-[9px] text-gray-500">Pinpoint pupils</p>
              <p className="text-[10px] font-bold text-green-600 mt-1">→ Naloxone</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded text-center">
              <p className="text-[10px] font-bold text-amber-700">Benzodiazepine</p>
              <p className="text-[9px] text-gray-500">Dilated pupils</p>
              <p className="text-[10px] font-bold text-green-600 mt-1">→ Flumazenil</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default DlocApproach;
