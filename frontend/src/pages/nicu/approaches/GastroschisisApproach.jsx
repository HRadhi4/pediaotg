/**
 * Gastroschisis Approach
 * Based on APSA/AAP Guidelines
 * Reference: J Pediatr Surg, UpToDate
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const GastroschisisApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="gastroschisis-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Gastroschisis</CardTitle>
        <CardDescription className="text-xs">Abdominal Wall Defect Management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Location:</strong> RIGHT of umbilicus, NO membrane covering</li>
            <li><strong>Anomalies:</strong> Rarely associated (&lt;10%) - unlike omphalocele</li>
            <li><strong>Priorities:</strong> Prevent heat/fluid loss, protect bowel</li>
            <li><strong>Prognosis:</strong> Excellent (&gt;90% survival)</li>
          </ul>
        </div>

        {/* Comparison */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Gastroschisis vs Omphalocele</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Feature</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Gastroschisis</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Omphalocele</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">Location</td><td>Right of umbilicus</td><td>At umbilicus</td></tr>
              <tr><td className="py-1">Membrane</td><td className="font-medium">Absent</td><td>Present</td></tr>
              <tr><td className="py-1">Associated anomalies</td><td>Rare</td><td>Common (50-70%)</td></tr>
              <tr><td className="py-1">Chromosomal</td><td>Very rare</td><td>~30%</td></tr>
              <tr><td className="py-1">Bowel</td><td>Thickened, matted</td><td>Usually normal</td></tr>
            </tbody>
          </table>
        </div>

        {/* Delivery Room */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Delivery Room Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Immediate:</p>
              <ul className="list-disc pl-4">
                <li>Handle bowel with sterile gloves ONLY</li>
                <li>Place in sterile bowel bag up to axillae</li>
                <li>OR: Wrap in warm saline gauze + plastic wrap</li>
                <li>Position on RIGHT side (prevent mesenteric kinking)</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium">Critical actions:</p>
              <ul className="list-disc pl-4">
                <li>OG/NG tube to LOW CONTINUOUS suction</li>
                <li>IV access - begin aggressive fluids</li>
                <li>Maintain temperature (radiant warmer)</li>
                <li>Do NOT attempt to reduce bowel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fluid Management */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Fluid Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium text-red-600 dark:text-red-400">Third-space losses are MASSIVE</p>
            
            <div>
              <p className="font-medium">Initial resuscitation:</p>
              <p>NS 10-20 mL/kg boluses if hypovolemic</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 10).toFixed(0)} - {(w * 20).toFixed(0)} mL</p>}
            </div>
            
            <div>
              <p className="font-medium">Maintenance:</p>
              <p>150-200% of normal (D10W with electrolytes)</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 150 / 24).toFixed(1)} - {(w * 200 / 24).toFixed(1)} mL/hr</p>}
            </div>
            
            <p><strong>Targets:</strong> UOP &gt;1 mL/kg/hr, lactate &lt;2</p>
          </div>
        </div>

        {/* NICU Care */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">NICU Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Antibiotics:</p>
              <p>Ampicillin + Gentamicin</p>
              {w > 0 && (
                <div className="font-mono text-blue-600 dark:text-blue-400 mt-1">
                  <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                  <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
                </div>
              )}
            </div>
            
            <div>
              <p className="font-medium">Nutrition:</p>
              <p>• TPN starts early (bowel function delayed weeks)</p>
              <p>• NPO until bowel function returns</p>
            </div>
            
            <div>
              <p className="font-medium">Respiratory:</p>
              <p>• May need intubation if compartment syndrome</p>
              <p>• Watch peak pressures post-closure</p>
            </div>
          </div>
        </div>

        {/* Surgical Options */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surgical Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Primary closure:</p>
              <p>If defect small, minimal bowel edema</p>
            </div>
            
            <div>
              <p className="font-medium">Staged reduction (Silo):</p>
              <p>• Spring-loaded silo at bedside</p>
              <p>• Gradual reduction over 5-7 days</p>
              <p>• Preferred if significant bowel edema</p>
            </div>
            
            <p className="text-red-600 dark:text-red-400 font-medium mt-2">
              Monitor for compartment syndrome: ↑PIP, ↓UOP, acidosis
            </p>
          </div>
        </div>

        {/* Complications */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Complications</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Early:</p>
              <ul className="list-disc pl-4">
                <li>Hypothermia</li>
                <li>Hypovolemia</li>
                <li>Sepsis</li>
                <li>Bowel necrosis</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Late:</p>
              <ul className="list-disc pl-4">
                <li>Intestinal atresia</li>
                <li>Short bowel syndrome</li>
                <li>NEC</li>
                <li>TPN cholestasis</li>
              </ul>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default GastroschisisApproach;
