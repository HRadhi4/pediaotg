/**
 * Gastroschisis Approach
 * Based on WHO Neonatal Clinical Guidelines & UpToDate
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const GastroschisisApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="gastroschisis-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Gastroschisis</CardTitle>
        <CardDescription className="text-xs">Abdominal Wall Defect - Right of Umbilicus</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines / UpToDate</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition & Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Gastroschisis:</strong> Full-thickness defect of the abdominal wall, typically to the RIGHT of the umbilical cord, with evisceration of bowel (and sometimes other organs).</p>
            <p>Incidence: 1 in 2,000-4,000 live births (increasing)</p>
            <p className="text-green-600 mt-1">✓ NO membrane covering (unlike omphalocele)</p>
            <p className="text-green-600">✓ Rarely associated with chromosomal abnormalities</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Gastroschisis vs Omphalocele</p>
          <table className="w-full text-[7px]">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900/40">
                <th className="border border-blue-200 p-1">Feature</th>
                <th className="border border-blue-200 p-1">Gastroschisis</th>
                <th className="border border-blue-200 p-1">Omphalocele</th>
              </tr>
            </thead>
            <tbody className="text-blue-600">
              <tr>
                <td className="border border-blue-200 p-1">Location</td>
                <td className="border border-blue-200 p-1 font-bold">Right of umbilicus</td>
                <td className="border border-blue-200 p-1">At umbilicus</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1">Membrane</td>
                <td className="border border-blue-200 p-1 font-bold">Absent</td>
                <td className="border border-blue-200 p-1">Present</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1">Associated anomalies</td>
                <td className="border border-blue-200 p-1">Rare (10%)</td>
                <td className="border border-blue-200 p-1">Common (50-70%)</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1">Chromosomal defects</td>
                <td className="border border-blue-200 p-1">Very rare</td>
                <td className="border border-blue-200 p-1">~30%</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1">Bowel appearance</td>
                <td className="border border-blue-200 p-1">Thickened, matted</td>
                <td className="border border-blue-200 p-1">Usually normal</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Delivery Room Management */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">DELIVERY ROOM MANAGEMENT</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Immediate Actions</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Handle bowel with sterile gloves only</p>
              <p>• Place in sterile bowel bag ("silo bag") up to axillae</p>
              <p>• OR wrap exposed bowel in warm saline-soaked gauze, then plastic wrap</p>
              <p>• Position infant on side (right lateral) to prevent mesenteric kinking</p>
              <p>• OG/NG tube to continuous suction (gastric decompression)</p>
            </div>
          </div>

          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-amber-700">⚠️ Critical Points</p>
            <div className="text-[8px] text-amber-600 mt-1 space-y-0.5">
              <p>• Maintain temperature - massive heat loss risk</p>
              <p>• Aggressive fluid resuscitation (1.5-2× maintenance)</p>
              <p>• Do NOT attempt to reduce bowel in delivery room</p>
              <p>• Protect bowel from desiccation and trauma</p>
            </div>
          </div>
        </div>

        {/* Fluid Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Fluid Management</p>
          <div className="text-[8px] space-y-1">
            <p className="text-amber-400">⚠️ Third-space losses are MASSIVE</p>
            
            <p className="font-bold mt-1">Initial Resuscitation:</p>
            <p>• NS bolus 10-20 mL/kg if signs of hypovolemia</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 10).toFixed(0)} - {(w * 20).toFixed(0)} mL</p>}
            
            <p className="font-bold mt-2">Maintenance Fluids:</p>
            <p>• Start at 150-200% of normal maintenance</p>
            <p>• D10W with electrolytes</p>
            {w > 0 && (
              <p className="text-green-400 font-mono">
                Day 1: ~{(w * 100 * 1.5).toFixed(0)} - {(w * 100 * 2).toFixed(0)} mL/day (~{(w * 100 * 1.5 / 24).toFixed(1)} - {(w * 100 * 2 / 24).toFixed(1)} mL/hr)
              </p>
            )}
            
            <p className="font-bold mt-2">Monitor:</p>
            <p>• Urine output goal: &gt;1 mL/kg/hr</p>
            <p>• Serial lactates</p>
            <p>• Hematocrit (may need PRBCs)</p>
          </div>
        </div>

        {/* Other NICU Care */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">NICU Management</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Respiratory:</strong></p>
            <p>• May need intubation if abdominal compartment syndrome develops</p>
            <p>• Monitor for increased work of breathing post-closure</p>
            
            <p className="font-bold mt-1">Antibiotics:</p>
            <p>• Ampicillin + Gentamicin (cover gut flora)</p>
            {w > 0 && (
              <div className="font-mono text-green-600 mt-0.5">
                <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
              </div>
            )}
            
            <p className="font-bold mt-1">Nutrition:</p>
            <p>• TPN early (bowel function delayed)</p>
            <p>• Feeds may not start for weeks</p>
          </div>
        </div>

        {/* Surgical Management */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Surgical Management</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p><strong>Options:</strong></p>
            
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded mt-1">
              <p className="font-bold">Primary Closure:</p>
              <p>• If defect small and bowel edema minimal</p>
              <p>• Risk of abdominal compartment syndrome</p>
              <p>• Monitor intra-abdominal pressure</p>
            </div>
            
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded mt-1">
              <p className="font-bold">Staged Reduction (Silo):</p>
              <p>• Spring-loaded silo placed at bedside</p>
              <p>• Gradual reduction over days</p>
              <p>• Preferred if significant bowel edema</p>
            </div>
            
            <p className="mt-1 text-red-600">Monitor for compartment syndrome: ↑ peak pressures, ↓ UOP, metabolic acidosis</p>
          </div>
        </div>

        {/* Complications */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Complications</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Early:</p>
              <p>• Hypothermia</p>
              <p>• Hypovolemia</p>
              <p>• Sepsis</p>
              <p>• Bowel ischemia/necrosis</p>
              <p>• Compartment syndrome</p>
            </div>
            <div>
              <p className="font-bold">Late:</p>
              <p>• Intestinal atresia (10-15%)</p>
              <p>• Short bowel syndrome</p>
              <p>• Feeding intolerance</p>
              <p>• NEC</p>
              <p>• Cholestasis (TPN)</p>
            </div>
          </div>
        </div>

        {/* Complex Gastroschisis */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">"Complex" Gastroschisis</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Definition:</strong> Gastroschisis with intestinal complications:</p>
            <p>• Atresia</p>
            <p>• Perforation</p>
            <p>• Volvulus</p>
            <p>• Necrosis</p>
            <p className="mt-1 text-red-600">Significantly worse prognosis than simple gastroschisis</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Survival: &gt;90% for simple gastroschisis</p>
            <p>• Hospital stay: Often 4-8 weeks</p>
            <p>• Time to full feeds: 2-6 weeks (longer if complex)</p>
            <p>• Long-term: Generally excellent</p>
            <p>• Neurodevelopmental outcomes usually normal</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default GastroschisisApproach;
