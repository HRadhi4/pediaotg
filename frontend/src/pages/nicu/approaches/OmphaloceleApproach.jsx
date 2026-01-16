/**
 * Omphalocele Approach
 * Based on WHO Neonatal Clinical Guidelines & UpToDate
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const OmphaloceleApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="omphalocele-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Omphalocele</CardTitle>
        <CardDescription className="text-xs">Abdominal Wall Defect - At Umbilicus with Membrane</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines / UpToDate</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition & Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Omphalocele (Exomphalos):</strong> Central abdominal wall defect at the umbilicus with herniation of abdominal contents covered by a membrane (peritoneum and amnion).</p>
            <p>Incidence: 1 in 4,000-7,000 live births</p>
            <p className="text-red-600 mt-1">⚠️ HIGH association with other anomalies (50-70%)</p>
            <p className="text-red-600">⚠️ Chromosomal abnormalities in ~30%</p>
          </div>
        </div>

        {/* Classification */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Classification by Size</p>
          <table className="w-full text-[7px]">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900/40">
                <th className="border border-blue-200 p-1">Type</th>
                <th className="border border-blue-200 p-1">Size</th>
                <th className="border border-blue-200 p-1">Contents</th>
              </tr>
            </thead>
            <tbody className="text-blue-600">
              <tr>
                <td className="border border-blue-200 p-1 font-bold">Small</td>
                <td className="border border-blue-200 p-1">&lt;4 cm</td>
                <td className="border border-blue-200 p-1">Usually bowel only</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1 font-bold">Large (Giant)</td>
                <td className="border border-blue-200 p-1">&gt;5 cm</td>
                <td className="border border-blue-200 p-1">Bowel + liver ± spleen</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[7px] text-blue-500 mt-1">Giant omphalocele: higher morbidity, more challenging closure</p>
        </div>

        {/* Associated Anomalies */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Associated Anomalies</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p className="font-bold">Syndromes:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Beckwith-Wiedemann Syndrome</div>
              <div>• Pentalogy of Cantrell</div>
              <div>• OEIS Complex</div>
              <div>• Trisomy 13, 18, 21</div>
            </div>
            
            <p className="font-bold mt-1">Other anomalies:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Cardiac (30-50%)</div>
              <div>• GI (atresia, malrotation)</div>
              <div>• Pulmonary hypoplasia</div>
              <div>• Genitourinary</div>
            </div>
            
            <p className="mt-1 text-amber-600">⚠️ Full workup for associated anomalies essential</p>
          </div>
        </div>

        {/* Beckwith-Wiedemann */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Beckwith-Wiedemann Syndrome</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Classic Features:</strong></p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Macroglossia</div>
              <div>• Omphalocele</div>
              <div>• Macrosomia/hemihypertrophy</div>
              <div>• Hypoglycemia (hyperinsulinism)</div>
              <div>• Ear creases/pits</div>
              <div>• Visceromegaly</div>
            </div>
            <p className="text-red-600 mt-1">⚠️ Increased tumor risk (Wilms, hepatoblastoma) - requires surveillance</p>
          </div>
        </div>

        {/* Delivery Room Management */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">DELIVERY ROOM MANAGEMENT</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">If Membrane Intact</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Keep sac moist with saline-soaked gauze</p>
              <p>• Cover with sterile, non-adherent dressing</p>
              <p>• DO NOT rupture membrane</p>
              <p>• Place OG/NG tube for decompression</p>
              <p>• Position to avoid pressure on sac</p>
            </div>
          </div>

          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">If Membrane Ruptured</p>
            <div className="text-[8px] text-red-600 mt-1 space-y-0.5">
              <p>• Manage as gastroschisis (bowel bag)</p>
              <p>• Urgent surgical consultation</p>
              <p>• Aggressive fluid resuscitation</p>
              <p>• Cover exposed bowel with warm saline gauze</p>
            </div>
          </div>
        </div>

        {/* NICU Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">NICU Management</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Initial Evaluation:</p>
            <p>• Full physical exam for associated anomalies</p>
            <p>• Echocardiogram (cardiac defects common)</p>
            <p>• Renal ultrasound</p>
            <p>• Karyotype</p>
            <p>• Blood glucose monitoring (especially if BWS)</p>
            
            <p className="font-bold text-cyan-400 mt-2">Supportive Care:</p>
            <p>• IV fluids (less aggressive than gastroschisis if membrane intact)</p>
            <p>• Antibiotics (Ampicillin + Gentamicin)</p>
            {w > 0 && (
              <div className="text-green-400 font-mono mt-0.5">
                <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
              </div>
            )}
            <p>• TPN until bowel function established</p>
            <p>• Keep membrane protected and moist</p>
          </div>
        </div>

        {/* Surgical Options */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Surgical Management</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Primary Closure:</p>
              <p>• For small omphaloceles with minimal viscera</p>
              <p>• Usually within first days of life</p>
            </div>
            
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded mt-1">
              <p className="font-bold">Staged Closure (Silo):</p>
              <p>• For larger defects</p>
              <p>• Gradual reduction similar to gastroschisis</p>
            </div>
            
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded mt-1">
              <p className="font-bold">Paint and Wait (Escharotic therapy):</p>
              <p>• For GIANT omphaloceles or unstable infants</p>
              <p>• Apply antiseptic agents (silver sulfadiazine, povidone-iodine)</p>
              <p>• Allow epithelialization over weeks-months</p>
              <p>• Ventral hernia repaired later (1-5 years)</p>
            </div>
          </div>
        </div>

        {/* Respiratory Considerations */}
        <div className="p-2 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200">
          <p className="text-xs font-bold text-cyan-700 mb-1">Respiratory Considerations</p>
          <div className="text-[8px] text-cyan-600 space-y-1">
            <p><strong>Pulmonary hypoplasia:</strong></p>
            <p>• Common with large omphalocele (similar to CDH)</p>
            <p>• May have significant respiratory distress</p>
            <p>• Careful ventilation required</p>
            
            <p className="font-bold mt-1">PPHN risk:</p>
            <p>• May need iNO, sildenafil</p>
            <p>• Rarely need ECMO</p>
          </div>
        </div>

        {/* Long-term Issues */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Long-term Considerations</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Surgical follow-up:</strong></p>
            <p>• Ventral hernia repair if delayed closure</p>
            <p>• Repair of associated anomalies</p>
            
            <p className="font-bold mt-1">BWS surveillance (if applicable):</p>
            <p>• Abdominal US every 3 months until age 8</p>
            <p>• AFP every 3 months until age 4</p>
            <p>• Monitor for asymmetric growth</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Survival depends primarily on associated anomalies</p>
            <p>• Isolated omphalocele: &gt;90% survival</p>
            <p>• With chromosomal abnormalities: Much lower</p>
            <p>• Giant omphalocele: Higher morbidity, longer hospital stay</p>
            <p>• Neurodevelopmental outcomes generally good if isolated</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default OmphaloceleApproach;
