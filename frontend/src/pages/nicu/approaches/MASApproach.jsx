/**
 * Meconium Aspiration Syndrome (MAS) Approach
 * Updated: 2023 NRP/AHA Guidelines
 * Simplified design matching Apnea approach
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MASApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="mas-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Meconium Aspiration Syndrome (MAS)</CardTitle>
        <CardDescription className="text-xs">Pathophysiology & Management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2023 NRP/AHA Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2023)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Definition:</strong> Resp distress in infant born through MSAF</p>
            <p><strong>Key change:</strong> Routine tracheal suction NO LONGER recommended</p>
            <p><strong>PPHN:</strong> Occurs in 20-30% - major complication</p>
            <p><strong>Surfactant:</strong> Consider if intubated</p>
          </div>
        </div>

        {/* Delivery Room - KEY UPDATE */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">⚠️ Delivery Room (NRP 2023)</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p className="font-bold">ROUTINE TRACHEAL SUCTION NOT RECOMMENDED</p>
            <p>• Same initial steps as for clear fluid</p>
            <p>• <strong>DO NOT DELAY PPV</strong> to clear meconium</p>
            <p>• Intubate ONLY if unable to ventilate</p>
          </div>
        </div>

        {/* Pathophysiology */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Pathophysiology</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Mechanical</p>
              <p>Air trapping, ball-valve</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Surfactant</p>
              <p>Inactivation → atelectasis</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Chemical</p>
              <p>Pneumonitis, inflammation</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Vascular</p>
              <p>PPHN (up to 30%)</p>
            </div>
          </div>
        </div>

        {/* CXR */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">CXR Findings</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p>• Patchy infiltrates (coarse, irregular)</p>
            <p>• Hyperinflation (flattened diaphragms)</p>
            <p>• Areas of atelectasis and consolidation</p>
            <p>• "Dirty," heterogeneous appearance</p>
            <p className="text-red-600">• Watch for pneumothorax (15-30%)</p>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">NICU Management</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Respiratory:</p>
            <p>• Target SpO2 94-98%</p>
            <p>• PEEP 6-8 cm H2O</p>
            <p>• HFOV if conventional fails</p>
            
            <p className="font-bold text-cyan-400 mt-2">Surfactant:</p>
            <p>4 mL/kg Curosurf if intubated</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 4).toFixed(0)} mL</p>}
            
            <p className="font-bold text-purple-400 mt-2">For PPHN:</p>
            <p>iNO 20 ppm if OI &gt;25</p>
          </div>
        </div>

        {/* Antibiotics */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Antibiotics</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p>Start empiric until infection ruled out</p>
            <p className="font-bold">Ampicillin + Gentamicin</p>
            {w > 0 && (
              <div className="text-green-600 font-mono">
                <p>Amp: {(w * 50).toFixed(0)} mg q12h</p>
                <p>Gent: {(w * 4).toFixed(1)} mg q24h</p>
              </div>
            )}
            <p>D/C if cultures negative at 48-72h</p>
          </div>
        </div>

        {/* ECMO */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">ECMO Criteria</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p>• OI &gt;40 despite maximal therapy</p>
            <p>• ≥34 weeks GA, &gt;2 kg</p>
            <p>• No major IVH</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Mortality: 2-5%</p>
            <p>• Most recover completely</p>
            <p>• ↑ Risk reactive airway disease</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default MASApproach;
