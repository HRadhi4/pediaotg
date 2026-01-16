/**
 * MAS (Meconium Aspiration Syndrome) Approach
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MASApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="mas-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Meconium Aspiration Syndrome (MAS)</CardTitle>
        <CardDescription className="text-xs">Post-Term Respiratory Distress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Respiratory distress in meconium-stained infant with characteristic CXR</li>
            <li><strong>Risk:</strong> Post-term, SGA, fetal distress</li>
            <li><strong>Complications:</strong> PPHN, air leaks, infection</li>
            <li><strong>No routine suctioning:</strong> Vigorous infants - do not intubate to suction</li>
          </ul>
        </div>

        {/* Pathophysiology */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Pathophysiology</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Mechanical:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Airway obstruction</li>
                <li>Ball-valve effect</li>
                <li>Air trapping</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Chemical:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Surfactant inactivation</li>
                <li>Chemical pneumonitis</li>
                <li>Pulmonary vasoconstriction</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Delivery Room */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Delivery Room Management (NRP 2020)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-white dark:bg-slate-900 rounded mb-2">
              <p className="font-medium text-green-600">Vigorous infant (HR &gt;100, good tone, breathing):</p>
              <p>• Routine care - NO intubation for suctioning</p>
              <p>• Bulb suction of mouth/nose only if needed</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-red-600">Non-vigorous infant:</p>
              <p>• PPV as needed per NRP</p>
              <p>• Intubation for ventilation if needed</p>
              <p>• Consider suctioning if thick meconium obstructing airway</p>
            </div>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Features</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Signs:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Meconium staining of skin, nails, cord</li>
              <li>Respiratory distress (tachypnea, retractions, grunting)</li>
              <li>Barrel chest (air trapping)</li>
              <li>Crackles and rhonchi</li>
            </ul>
            <p className="font-medium mt-2 mb-1">CXR findings:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Patchy infiltrates</li>
              <li>Hyperinflation</li>
              <li>Air leaks (pneumothorax, pneumomediastinum)</li>
            </ul>
          </div>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">NICU Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Respiratory support:</p>
              <p>• Oxygen to maintain SpO2 92-97%</p>
              <p>• CPAP or mechanical ventilation as needed</p>
              <p>• Avoid high PEEP (risk of air leak)</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Surfactant:</p>
              <p>• Consider if intubated and significant disease</p>
              <p>• May need higher/repeated doses</p>
              {w > 0 && (
                <p className="font-mono text-blue-600">Dose: {(w * 4).toFixed(1)} mL Survanta or {(w * 2.5).toFixed(1)} mL Curosurf</p>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">PPHN management:</p>
              <p>• Common complication (30-40%)</p>
              <p>• Consider iNO if OI ≥25</p>
              <p>• See PPHN approach</p>
            </div>
          </div>
        </div>

        {/* Complications */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Complications</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>PPHN</strong> (30-40%)</li>
              <li>Air leak syndromes</li>
              <li>Respiratory failure</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Secondary infection</li>
              <li>HIE (if perinatal asphyxia)</li>
              <li>Death (~5% with PPHN)</li>
            </ul>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>• Most recover fully if no severe PPHN or asphyxia</p>
            <p>• Increased risk of reactive airway disease</p>
            <p>• Neurodevelopmental outcomes depend on associated HIE</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default MASApproach;
