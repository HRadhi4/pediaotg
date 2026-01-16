/**
 * Gastroschisis Approach
 * Updated: 2024 APSA Guidelines
 * Reference: J Pediatr Surg, APSA Evidence-Based Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const GastroschisisApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="gastroschisis-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Gastroschisis</CardTitle>
        <CardDescription className="text-xs">Abdominal Wall Defect Management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 APSA Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p>• <strong>Location:</strong> RIGHT of umbilicus, NO membrane covering</p>
            <p>• <strong>Anomalies:</strong> Rarely associated (&lt;10%) - unlike omphalocele</p>
            <p>• <strong>Priorities:</strong> Prevent heat/fluid loss, protect bowel</p>
            <p>• <strong>Prognosis:</strong> Excellent (&gt;90% survival)</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Gastroschisis vs Omphalocele</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900/40">
                <th className="border border-blue-200 p-1 text-left">Feature</th>
                <th className="border border-blue-200 p-1 text-left">Gastroschisis</th>
                <th className="border border-blue-200 p-1 text-left">Omphalocele</th>
              </tr>
            </thead>
            <tbody className="text-blue-600">
              <tr><td className="border border-blue-200 p-1">Location</td><td className="border border-blue-200 p-1">Right of umbilicus</td><td className="border border-blue-200 p-1">At umbilicus</td></tr>
              <tr><td className="border border-blue-200 p-1">Membrane</td><td className="border border-blue-200 p-1 font-bold">Absent</td><td className="border border-blue-200 p-1">Present</td></tr>
              <tr><td className="border border-blue-200 p-1">Anomalies</td><td className="border border-blue-200 p-1">Rare (&lt;10%)</td><td className="border border-blue-200 p-1">Common (50-70%)</td></tr>
              <tr><td className="border border-blue-200 p-1">Chromosomal</td><td className="border border-blue-200 p-1">Very rare</td><td className="border border-blue-200 p-1">~30%</td></tr>
              <tr><td className="border border-blue-200 p-1">Bowel</td><td className="border border-blue-200 p-1">Thickened, matted</td><td className="border border-blue-200 p-1">Usually normal</td></tr>
            </tbody>
          </table>
        </div>

        {/* Delivery Room Management */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">DELIVERY ROOM MANAGEMENT</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Immediate Actions</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Handle bowel with <strong>sterile gloves ONLY</strong></p>
              <p>• Place in sterile bowel bag up to axillae</p>
              <p>• OR: Wrap in warm saline gauze + plastic wrap</p>
              <p>• Position on <strong>RIGHT side</strong> (prevent mesenteric kinking)</p>
            </div>
          </div>

          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Critical Actions</p>
            <div className="text-[8px] text-red-600 mt-1 space-y-0.5">
              <p>• OG/NG tube to <strong>LOW CONTINUOUS suction</strong></p>
              <p>• IV access - begin aggressive fluids</p>
              <p>• Maintain temperature (radiant warmer)</p>
              <p className="font-bold">• Do NOT attempt to reduce bowel</p>
            </div>
          </div>
        </div>

        {/* Fluid Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Fluid Management - Critical</p>
          <div className="text-[8px] space-y-1">
            <p className="text-red-400 font-bold">Third-space losses are MASSIVE</p>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Initial resuscitation:</p>
              <p>NS 10-20 mL/kg boluses if hypovolemic</p>
              {w > 0 && <p className="font-mono text-green-400">= {(w * 10).toFixed(0)} - {(w * 20).toFixed(0)} mL</p>}
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Maintenance:</p>
              <p>150-200% of normal (D10W with electrolytes)</p>
              {w > 0 && <p className="font-mono text-green-400">= {(w * 150 / 24).toFixed(1)} - {(w * 200 / 24).toFixed(1)} mL/hr</p>}
            </div>
            
            <p className="mt-1"><strong>Targets:</strong> UOP &gt;1 mL/kg/hr, lactate &lt;2</p>
          </div>
        </div>

        {/* NICU Care */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">NICU Management</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p className="font-bold">Antibiotics:</p>
            <p>Ampicillin + Gentamicin</p>
            {w > 0 && (
              <div className="font-mono text-green-600 mt-1">
                <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
              </div>
            )}
            
            <p className="font-bold mt-2">Nutrition:</p>
            <p>• TPN starts early (bowel function delayed weeks)</p>
            <p>• NPO until bowel function returns</p>
            
            <p className="font-bold mt-2">Respiratory:</p>
            <p>• May need intubation if compartment syndrome</p>
            <p>• Watch peak pressures post-closure</p>
          </div>
        </div>

        {/* Surgical Options */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Surgical Management (2024)</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Primary closure:</p>
              <p>If defect small, minimal bowel edema</p>
            </div>
            
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Staged reduction (Silo):</p>
              <p>• Spring-loaded silo at bedside</p>
              <p>• Gradual reduction over 5-7 days</p>
              <p>• Preferred if significant bowel edema</p>
            </div>
            
            <p className="text-red-600 font-bold mt-2">
              Monitor for compartment syndrome: ↑PIP, ↓UOP, acidosis
            </p>
          </div>
        </div>

        {/* Complications */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Complications</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Early:</p>
              <p>• Hypothermia</p>
              <p>• Hypovolemia</p>
              <p>• Sepsis</p>
              <p>• Bowel necrosis</p>
            </div>
            <div>
              <p className="font-bold">Late:</p>
              <p>• Intestinal atresia</p>
              <p>• Short bowel syndrome</p>
              <p>• NEC</p>
              <p>• TPN cholestasis</p>
            </div>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Overall survival &gt;90%</p>
            <p>• Time to full enteral feeds: 2-6 weeks typically</p>
            <p>• Complex gastroschisis (atresia, perforation): Longer hospital stay</p>
            <p>• Most children have normal long-term GI function</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default GastroschisisApproach;
