/**
 * Bronchopulmonary Dysplasia (BPD) Approach
 * Updated: 2024 Jensen Grading System
 * Simplified design matching Apnea approach
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const BPDApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const w = parseFloat(weight) || 0;
  const pmaWeeks = ga + (pna / 7);

  return (
    <Card data-testid="bpd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bronchopulmonary Dysplasia (BPD)</CardTitle>
        <CardDescription className="text-xs">Chronic Lung Disease of Prematurity</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 Jensen Grading & NIH Workshop</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2024)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Definition:</strong> Need for supplemental O2 for ≥28 days in preterm infants</p>
            <p><strong>Assessment:</strong> At 36 weeks PMA (for &lt;32 wk GA) or 56 days postnatal (for ≥32 wk GA)</p>
            <p><strong>Key change:</strong> Jensen grading predicts outcomes better than traditional NIH classification</p>
            {pmaWeeks > 0 && (
              <p className="bg-amber-100 p-1 rounded mt-1">
                Current PMA: <strong>{pmaWeeks.toFixed(1)} weeks</strong>
              </p>
            )}
          </div>
        </div>

        {/* Jensen Grading */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Jensen BPD Grading (at 36 wk PMA)</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-green-600">No BPD</p>
              <p>Room air</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-yellow-600">Grade I</p>
              <p>Nasal cannula ≤2 L/min</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-orange-600">Grade II</p>
              <p>HFNC &gt;2 L/min or CPAP</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-red-600">Grade III</p>
              <p>Mechanical ventilation</p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Major:</p>
              <p>• Extreme prematurity (&lt;28 wk)</p>
              <p>• ELBW (&lt;1000g)</p>
              <p>• Prolonged ventilation</p>
              <p>• High FiO2 exposure</p>
            </div>
            <div>
              <p className="font-bold">Additional:</p>
              <p>• Male sex</p>
              <p>• Chorioamnionitis</p>
              <p>• Postnatal sepsis</p>
              <p>• Significant PDA</p>
            </div>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Prevention Strategies</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p>• <strong>Antenatal steroids</strong> - strongest evidence</p>
            <p>• <strong>Early CPAP</strong> over routine intubation</p>
            <p>• <strong>Caffeine</strong> - start early (CAP trial)</p>
            <p>• Target SpO2 <strong>91-95%</strong></p>
            <p>• LISA/MIST for surfactant delivery</p>
            <p>• Volume-targeted ventilation</p>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Management of Established BPD</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Respiratory:</p>
            <p>• Target SpO2 92-95% (higher if PH)</p>
            <p>• Minimize ventilator days</p>
            
            <p className="font-bold text-cyan-400 mt-2">Nutrition (critical):</p>
            <p>• 120-150 kcal/kg/day</p>
            <p>• Protein 3.5-4 g/kg/day</p>
            
            <p className="font-bold text-purple-400 mt-2">Medications:</p>
            <p>• <strong>Caffeine</strong> - continue until off resp support</p>
            <p>• Diuretics - acute exacerbations only</p>
            <p>• Steroids - severe cases only (DART protocol)</p>
          </div>
        </div>

        {/* Diuretics */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Diuretics (Use Sparingly)</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Furosemide:</p>
              <p>1-2 mg/kg/dose q12-24h (short-term only)</p>
              {w > 0 && <p className="text-green-600 font-mono">= {(w * 1).toFixed(1)} - {(w * 2).toFixed(1)} mg/dose</p>}
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Chlorothiazide + Spironolactone:</p>
              <p>For chronic use if needed</p>
            </div>
          </div>
        </div>

        {/* Discharge */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Discharge Planning</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Home O2 criteria:</strong> Stable on ≤0.5 L/min, SpO2 ≥92%</p>
            <p><strong>Follow-up:</strong> Pulmonology, developmental, nutrition</p>
            <p><strong>RSV prophylaxis:</strong> Palivizumab per AAP guidelines</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Most improve significantly over 2-3 years</p>
            <p>• Many wean off home O2 by 6-12 months</p>
            <p>• Increased risk of respiratory infections</p>
            <p>• Severe BPD: Higher neurodevelopmental risk</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default BPDApproach;
