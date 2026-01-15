/**
 * Hypocalcemia & Rickets Approach Component - Flowchart Version
 * Backup saved at: HypocalcemiaApproach.jsx.backup
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HypocalcemiaApproach = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Approach to Hypocalcemia & Rickets</CardTitle>
        <CardDescription className="text-xs">Interactive diagnostic flowchart</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* MAIN FLOWCHART */}
        <div className="relative">
          {/* Starting Point */}
          <div className="flex justify-center">
            <div className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg">
              Low Ca²⁺
            </div>
          </div>
          
          {/* Arrow down */}
          <div className="flex justify-center py-1">
            <div className="w-0.5 h-6 bg-gray-400"></div>
          </div>
          
          {/* Check PTH */}
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-400 rounded-lg text-center">
              <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">Check</p>
              <p className="font-bold text-blue-700 dark:text-blue-200">iPTH</p>
            </div>
          </div>
          
          {/* Branch arrows */}
          <div className="flex justify-center py-1">
            <div className="flex items-end gap-0">
              <div className="w-24 h-0.5 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-24 h-0.5 bg-gray-400"></div>
            </div>
          </div>
          
          {/* PTH Low or High branches */}
          <div className="grid grid-cols-2 gap-2">
            {/* LEFT BRANCH - PTH Low */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-bold">
                  PTH ↓ Low
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-gray-400"></div>
              </div>
              <div className="flex justify-center">
                <div className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/40 border border-purple-300 rounded text-center">
                  <p className="text-[10px] text-purple-600 font-medium">Check</p>
                  <p className="text-xs font-bold text-purple-700">Mg</p>
                </div>
              </div>
              <div className="flex justify-center py-1">
                <div className="flex items-end gap-0">
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 text-center">
                  <p className="text-[10px] font-bold text-purple-700">Mg ↓</p>
                  <p className="text-[9px] text-purple-600 font-semibold mt-1">Hypomagnesemia</p>
                </div>
                <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 text-center">
                  <p className="text-[10px] font-bold text-teal-700">Mg N</p>
                  <p className="text-[9px] text-teal-600 font-semibold mt-1">Hypoparathyroidism</p>
                </div>
              </div>
            </div>
            
            {/* RIGHT BRANCH - PTH High/Normal */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold">
                  PTH ↑/N
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-gray-400"></div>
              </div>
              <div className="flex justify-center">
                <div className="px-2 py-1.5 bg-amber-100 dark:bg-amber-900/40 border border-amber-300 rounded text-center">
                  <p className="text-[10px] text-amber-600 font-medium">Check</p>
                  <p className="text-xs font-bold text-amber-700">Phos & Cr</p>
                </div>
              </div>
              <div className="flex justify-center py-1">
                <div className="flex items-end gap-0">
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 text-center">
                  <p className="text-[10px] font-bold text-orange-700">P↑ Cr↑</p>
                  <p className="text-[9px] text-orange-600 font-semibold mt-1">Renal Failure</p>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 text-center">
                  <p className="text-[10px] font-bold text-gray-700">P↑ Cr N</p>
                  <p className="text-[9px] text-gray-600 font-semibold mt-1">Pseudo-hypopara</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-4"></div>

        {/* VITAMIN D FLOWCHART */}
        <div className="p-3 bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-3">
            If PTH ↑ → Check 25-OH Vitamin D
          </p>
          
          <div className="space-y-2">
            {/* 25OHD Check */}
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-xs">
                25-OH Vit D
              </div>
            </div>
            
            <div className="flex justify-center py-1">
              <div className="flex items-end gap-0">
                <div className="w-16 h-0.5 bg-gray-400"></div>
                <div className="w-0.5 h-4 bg-gray-400"></div>
                <div className="w-16 h-0.5 bg-gray-400"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Low 25OHD */}
              <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-lg border border-red-300 text-center">
                <p className="text-xs font-bold text-red-700">25OHD ↓</p>
                <p className="text-[10px] text-red-600 font-semibold mt-1">Vit D Deficiency</p>
                <div className="mt-2 text-[9px] text-red-500 space-y-0.5">
                  <p>• Diet</p>
                  <p>• Malabsorption</p>
                  <p>• No sun</p>
                </div>
              </div>
              
              {/* Normal 25OHD */}
              <div className="space-y-2">
                <div className="p-2 bg-green-100 dark:bg-green-950/30 rounded-lg border border-green-300 text-center">
                  <p className="text-xs font-bold text-green-700">25OHD Normal</p>
                  <p className="text-[10px] text-green-600">Check 1,25(OH)₂D</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded border border-blue-200 text-center">
                    <p className="text-[9px] font-bold text-blue-700">↓</p>
                    <p className="text-[8px] text-blue-600">Type 1</p>
                  </div>
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded border border-purple-200 text-center">
                    <p className="text-[9px] font-bold text-purple-700">↑↑</p>
                    <p className="text-[8px] text-purple-600">Type 2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-4"></div>

        {/* VITAMIN D ACTIVATION PATHWAY - Vertical Flow */}
        <div className="p-3 bg-gradient-to-b from-yellow-50 to-blue-50 dark:from-yellow-950/20 dark:to-blue-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-3">
            Vitamin D Activation Pathway
          </p>
          
          <div className="flex flex-col items-center space-y-1">
            {/* Sources */}
            <div className="flex gap-2">
              <div className="px-2 py-1 bg-yellow-200 dark:bg-yellow-900/40 rounded text-[10px] font-medium text-yellow-800">
                Diet D2/D3
              </div>
              <div className="px-2 py-1 bg-yellow-200 dark:bg-yellow-900/40 rounded text-[10px] font-medium text-yellow-800">
                Skin + UVB
              </div>
            </div>
            
            <div className="text-blue-500 text-lg">↓</div>
            
            {/* Liver */}
            <div className="px-4 py-2 bg-amber-400 text-white rounded-lg text-xs font-bold shadow">
              LIVER → 25-OH D
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-blue-500 text-lg">↓</div>
              <div className="px-2 py-1 bg-red-100 rounded text-[9px] text-red-600 border border-red-200">
                ✗ = Type 1 Rickets
              </div>
            </div>
            
            {/* Kidney */}
            <div className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold shadow">
              KIDNEY → 1,25-(OH)₂D
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-blue-500 text-lg">↓</div>
              <div className="px-2 py-1 bg-red-100 rounded text-[9px] text-red-600 border border-red-200">
                ✗ = Type 2 Rickets
              </div>
            </div>
            
            {/* Target */}
            <div className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold shadow">
              TISSUES (Bone, Gut)
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-4"></div>

        {/* RICKETS CLASSIFICATION */}
        <div className="p-3 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/20 dark:to-teal-950/20 rounded-xl">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 mb-3">
            Rickets Classification (↑ALP + Clinical/XR findings)
          </p>
          
          <div className="flex justify-center mb-2">
            <div className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs font-bold">
              Check PTH, Phos, Ca
            </div>
          </div>
          
          <div className="flex justify-center py-1">
            <div className="flex items-end gap-0">
              <div className="w-20 h-0.5 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-20 h-0.5 bg-gray-400"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Calcipenic */}
            <div className="p-3 bg-purple-100 dark:bg-purple-950/40 rounded-lg border-2 border-purple-300">
              <p className="text-xs font-bold text-purple-700 text-center">Calcipenic</p>
              <p className="text-[10px] text-purple-600 text-center">(Hypocalcemic)</p>
              <div className="mt-2 flex justify-center gap-1">
                <span className="px-1.5 py-0.5 bg-red-200 rounded text-[9px] font-bold text-red-700">PTH↑</span>
                <span className="px-1.5 py-0.5 bg-gray-200 rounded text-[9px] text-gray-600">Pi N/↓</span>
                <span className="px-1.5 py-0.5 bg-gray-200 rounded text-[9px] text-gray-600">Ca N/↓</span>
              </div>
            </div>
            
            {/* Phosphopenic */}
            <div className="p-3 bg-teal-100 dark:bg-teal-950/40 rounded-lg border-2 border-teal-300">
              <p className="text-xs font-bold text-teal-700 text-center">Phosphopenic</p>
              <p className="text-[10px] text-teal-600 text-center">(Hypophosphatemic)</p>
              <div className="mt-2 flex justify-center gap-1">
                <span className="px-1.5 py-0.5 bg-gray-200 rounded text-[9px] text-gray-600">PTH N/↑</span>
                <span className="px-1.5 py-0.5 bg-red-200 rounded text-[9px] font-bold text-red-700">Pi↓</span>
                <span className="px-1.5 py-0.5 bg-gray-200 rounded text-[9px] text-gray-600">Ca N</span>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HypocalcemiaApproach;
