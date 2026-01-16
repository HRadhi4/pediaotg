/**
 * Omphalocele Approach
 * Based on APSA/AAP Guidelines
 * Reference: J Pediatr Surg, UpToDate
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const OmphaloceleApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="omphalocele-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Omphalocele</CardTitle>
        <CardDescription className="text-xs">Abdominal Wall Defect with Membrane</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Location:</strong> AT umbilicus, WITH membrane covering</li>
            <li><strong>Anomalies:</strong> HIGH association (50-70%)</li>
            <li><strong>Chromosomal:</strong> ~30% (Trisomy 13, 18, 21)</li>
            <li><strong>Prognosis:</strong> Depends on associated anomalies</li>
          </ul>
        </div>

        {/* Associated Syndromes */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Associated Conditions</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Syndromes:</p>
              <ul className="list-disc pl-4">
                <li><strong>Beckwith-Wiedemann:</strong> Macroglossia, macrosomia, hypoglycemia</li>
                <li>Pentalogy of Cantrell</li>
                <li>OEIS complex</li>
                <li>Trisomy 13, 18, 21</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Organ anomalies:</p>
              <ul className="list-disc pl-4">
                <li>Cardiac (30-50%)</li>
                <li>GI (malrotation, atresia)</li>
                <li>Pulmonary hypoplasia</li>
                <li>Genitourinary</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Classification</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Type</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Size</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Contents</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">Small</td><td>&lt;4 cm</td><td>Bowel only</td></tr>
              <tr><td className="py-1">Large (Giant)</td><td>&gt;5 cm</td><td>Bowel + liver ± spleen</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">Giant omphalocele: higher morbidity, more challenging closure</p>
        </div>

        {/* Delivery Room */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Delivery Room Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">If membrane INTACT:</p>
              <ul className="list-disc pl-4">
                <li>Keep sac moist with saline gauze</li>
                <li>Cover with sterile, non-adherent dressing</li>
                <li>Do NOT rupture membrane</li>
                <li>Position to avoid pressure on sac</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">If membrane RUPTURED:</p>
              <ul className="list-disc pl-4">
                <li>Manage as gastroschisis (bowel bag)</li>
                <li>Aggressive fluid resuscitation</li>
                <li>Urgent surgical consult</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Workup */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Initial Workup</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Full anomaly evaluation:</strong></p>
            <ul className="list-disc pl-4">
              <li>Echocardiogram</li>
              <li>Renal ultrasound</li>
              <li>Karyotype/microarray</li>
              <li>Blood glucose (especially if BWS suspected)</li>
            </ul>
          </div>
        </div>

        {/* NICU Care */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">NICU Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Fluids:</p>
              <p>Less aggressive than gastroschisis IF membrane intact</p>
            </div>
            
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
              <p className="font-medium">If Beckwith-Wiedemann:</p>
              <p>• Frequent glucose monitoring</p>
              <p>• May need diazoxide for hyperinsulinism</p>
            </div>
          </div>
        </div>

        {/* Surgical Options */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surgical Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Primary closure:</p>
              <p>Small omphaloceles with minimal viscera</p>
            </div>
            
            <div>
              <p className="font-medium">Staged closure (Silo):</p>
              <p>Larger defects, gradual reduction</p>
            </div>
            
            <div>
              <p className="font-medium">"Paint and Wait" (Escharotic):</p>
              <p>• For GIANT omphaloceles or unstable infants</p>
              <p>• Apply silver sulfadiazine/povidone-iodine</p>
              <p>• Allow epithelialization over weeks-months</p>
              <p>• Ventral hernia repair later (1-5 years)</p>
            </div>
          </div>
        </div>

        {/* BWS Surveillance */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">BWS Tumor Surveillance</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-medium text-red-600 dark:text-red-400">If Beckwith-Wiedemann confirmed:</p>
            <ul className="list-disc pl-4">
              <li>Abdominal US every 3 months until age 8</li>
              <li>AFP every 3 months until age 4</li>
              <li>Monitor for Wilms tumor, hepatoblastoma</li>
              <li>Watch for asymmetric growth</li>
            </ul>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default OmphaloceleApproach;
