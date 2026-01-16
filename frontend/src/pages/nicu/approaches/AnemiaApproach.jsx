/**
 * Neonatal Anemia Approach
 * Updated: 2024 JAMA Clinical Practice Guideline & ETTNO/TOP Trials
 * Reference: JAMA Network Open 2024, Transfusion Medicine Reviews
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AnemiaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const pnaWeeks = Math.ceil(pna / 7);

  return (
    <Card data-testid="anemia-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Anemia</CardTitle>
        <CardDescription className="text-xs">Assessment & Transfusion Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Definition */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Definition</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Neonatal anemia:</strong> Hemoglobin or hematocrit below normal for gestational and postnatal age.</p>
            <table className="w-full mt-2">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Age</th>
                  <th className="text-left py-1">Hb (g/dL)</th>
                  <th className="text-left py-1">Hct (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1">Term cord blood</td><td>16.5 (13.5-19.5)</td><td>51 (42-60)</td></tr>
                <tr><td className="py-1">Term 2 weeks</td><td>16.5 (13-20)</td><td>50</td></tr>
                <tr><td className="py-1">Preterm 28 wk</td><td>14.5</td><td>45</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Causes */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Causes of Neonatal Anemia</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Blood Loss:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Fetomaternal hemorrhage</li>
                <li>Twin-twin transfusion</li>
                <li>Placental abruption/previa</li>
                <li>Cord accidents</li>
                <li>Internal hemorrhage (IVH)</li>
                <li><strong>Iatrogenic (phlebotomy)</strong></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Hemolysis:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Rh/ABO incompatibility</li>
                <li>G6PD deficiency</li>
                <li>Hereditary spherocytosis</li>
                <li>Infection/sepsis</li>
                <li>DIC</li>
              </ul>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Decreased Production:</p>
            <p>Anemia of prematurity, Diamond-Blackfan, infection, nutritional deficiency</p>
          </div>
        </div>

        {/* Transfusion Thresholds */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Transfusion Thresholds (2024 Guidelines)</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Clinical Status</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Hb Threshold</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Hct Threshold</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">Ventilated/Oxygen &gt;35%</td><td className="font-bold">11-12 g/dL</td><td>35-38%</td></tr>
              <tr><td className="py-1">CPAP/Low O2</td><td className="font-bold">10 g/dL</td><td>30-32%</td></tr>
              <tr><td className="py-1">Stable/Growing</td><td className="font-bold">7-8 g/dL</td><td>21-25%</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">ETTNO/TOP trials support restrictive thresholds for stable preterms</p>
        </div>

        {/* PRBC Transfusion */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">PRBC Transfusion</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Standard volume:</p>
              <p>10-15 mL/kg over 3-4 hours</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 10).toFixed(0)} - {(w * 15).toFixed(0)} mL</p>}
            </div>
            <div>
              <p className="font-medium">Expected rise:</p>
              <p>Hb increases ~2-3 g/dL per 10-15 mL/kg transfused</p>
            </div>
            <div>
              <p className="font-medium">Product specifications:</p>
              <p>• CMV-negative or leukoreduced</p>
              <p>• Irradiated (prevents GVHD)</p>
              <p>• &lt;7 days old preferred for small/sick neonates</p>
            </div>
          </div>
        </div>

        {/* EPO */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Erythropoietin (EPO)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="text-orange-600 dark:text-orange-400 font-medium">⚠️ Not routinely recommended (increased ROP risk)</p>
            <p className="mt-1">May consider in select cases with:</p>
            <p>• Dose: 200-400 U/kg 3x/week</p>
            <p>• Iron supplementation required (4-6 mg/kg/day)</p>
            {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400 mt-1">EPO dose: {(w * 200).toFixed(0)} - {(w * 400).toFixed(0)} U 3x/week</p>}
          </div>
        </div>

        {/* Iron Supplementation */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Iron Supplementation</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Start:</strong> 2-4 weeks of age (when tolerating feeds)</p>
            <p><strong>Dose:</strong> 2-4 mg/kg/day elemental iron</p>
            {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 2).toFixed(1)} - {(w * 4).toFixed(1)} mg/day elemental iron</p>}
            <p className="mt-1"><strong>Duration:</strong> Until 12 months of age</p>
            <p><strong>Higher dose (4-6 mg/kg):</strong> If on EPO or significant phlebotomy losses</p>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention Strategies</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Delayed cord clamping</strong> (30-60 seconds)</li>
              <li>Minimize phlebotomy losses</li>
              <li>Use micro-sampling techniques</li>
              <li>Point-of-care testing when available</li>
              <li>Cord blood banking for initial labs</li>
            </ul>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default AnemiaApproach;
