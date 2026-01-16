/**
 * Omphalocele Approach
 * Updated: 2024 APSA Guidelines
 * Reference: J Pediatr Surg, APSA Evidence-Based Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const OmphaloceleApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="omphalocele-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Omphalocele</CardTitle>
        <CardDescription className="text-xs">Abdominal Wall Defect with Membrane</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 APSA Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p>• <strong>Location:</strong> AT umbilicus, WITH membrane covering</p>
            <p>• <strong>Anomalies:</strong> HIGH association (50-70%)</p>
            <p>• <strong>Chromosomal:</strong> ~30% (Trisomy 13, 18, 21)</p>
            <p>• <strong>Prognosis:</strong> Depends on associated anomalies</p>
          </div>
        </div>

        {/* Associated Syndromes */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Associated Conditions - Screen For</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p className="font-bold">Syndromes:</p>
            <p>• <strong>Beckwith-Wiedemann:</strong> Macroglossia, macrosomia, hypoglycemia</p>
            <p>• Pentalogy of Cantrell (midline heart/sternum defects)</p>
            <p>• OEIS complex</p>
            <p>• Trisomy 13, 18, 21</p>
            
            <p className="font-bold mt-1">Organ anomalies:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Cardiac (30-50%)</div>
              <div>• GI (malrotation, atresia)</div>
              <div>• Pulmonary hypoplasia</div>
              <div>• Genitourinary</div>
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Classification by Size</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900/40">
                <th className="border border-blue-200 p-1 text-left">Type</th>
                <th className="border border-blue-200 p-1 text-left">Size</th>
                <th className="border border-blue-200 p-1 text-left">Contents</th>
              </tr>
            </thead>
            <tbody className="text-blue-600">
              <tr><td className="border border-blue-200 p-1">Small</td><td className="border border-blue-200 p-1">&lt;4 cm</td><td className="border border-blue-200 p-1">Bowel only</td></tr>
              <tr><td className="border border-blue-200 p-1">Large (Giant)</td><td className="border border-blue-200 p-1">&gt;5 cm</td><td className="border border-blue-200 p-1">Bowel + liver ± spleen</td></tr>
            </tbody>
          </table>
          <p className="text-[7px] text-blue-500 mt-1">Giant omphalocele: higher morbidity, more challenging closure</p>
        </div>

        {/* Delivery Room Management */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">DELIVERY ROOM MANAGEMENT</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">If Membrane INTACT</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Keep sac moist with saline gauze</p>
              <p>• Cover with sterile, non-adherent dressing</p>
              <p>• <strong>Do NOT rupture membrane</strong></p>
              <p>• Position to avoid pressure on sac</p>
            </div>
          </div>

          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">If Membrane RUPTURED</p>
            <div className="text-[8px] text-red-600 mt-1 space-y-0.5">
              <p>• Manage as gastroschisis (bowel bag)</p>
              <p>• Aggressive fluid resuscitation</p>
              <p>• Urgent surgical consult</p>
            </div>
          </div>
        </div>

        {/* Initial Workup */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Initial Workup</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p className="font-bold">Full anomaly evaluation:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Echocardiogram</div>
              <div>• Renal ultrasound</div>
              <div>• Karyotype/microarray</div>
              <div>• Blood glucose (if BWS suspected)</div>
            </div>
          </div>
        </div>

        {/* NICU Care */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">NICU Management</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p className="font-bold">Fluids:</p>
            <p>Less aggressive than gastroschisis IF membrane intact</p>
            
            <p className="font-bold mt-1">Antibiotics:</p>
            <p>Ampicillin + Gentamicin</p>
            {w > 0 && (
              <div className="font-mono text-green-600 mt-1">
                <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
              </div>
            )}
            
            <p className="font-bold mt-2">If Beckwith-Wiedemann suspected:</p>
            <p>• Frequent glucose monitoring (q1-3h initially)</p>
            <p>• May need diazoxide for hyperinsulinism</p>
          </div>
        </div>

        {/* Surgical Options */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Surgical Management Options</p>
          <div className="text-[8px] space-y-1">
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Primary closure:</p>
              <p>Small omphaloceles with minimal viscera</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Staged closure (Silo):</p>
              <p>Larger defects, gradual reduction</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">"Paint and Wait" (Escharotic):</p>
              <p>• For GIANT omphaloceles or unstable infants</p>
              <p>• Apply silver sulfadiazine/povidone-iodine</p>
              <p>• Allow epithelialization over weeks-months</p>
              <p>• Ventral hernia repair later (1-5 years)</p>
            </div>
          </div>
        </div>

        {/* BWS Surveillance */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Beckwith-Wiedemann Tumor Surveillance</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p className="text-red-600 font-bold">If BWS confirmed:</p>
            <p>• Abdominal US every 3 months until age 8</p>
            <p>• AFP every 3 months until age 4</p>
            <p>• Monitor for Wilms tumor, hepatoblastoma</p>
            <p>• Watch for asymmetric growth</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Survival depends primarily on associated anomalies</p>
            <p>• Isolated small omphalocele: &gt;95% survival</p>
            <p>• Giant omphalocele with anomalies: More guarded</p>
            <p>• Cardiac defects: Main driver of mortality</p>
            <p>• Long-term ventral hernia may need repair</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default OmphaloceleApproach;
