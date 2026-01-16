/**
 * Meconium Aspiration Syndrome (MAS) Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MASApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="mas-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Meconium Aspiration Syndrome (MAS)</CardTitle>
        <CardDescription className="text-xs">Pathophysiology & Management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>MAS:</strong> Respiratory distress in a newborn born through meconium-stained amniotic fluid (MSAF) with characteristic radiographic findings, when symptoms cannot be otherwise explained.</p>
            <p>MSAF occurs in ~10-15% of deliveries; MAS develops in ~5% of infants with MSAF.</p>
          </div>
        </div>

        {/* Pathophysiology */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Pathophysiology</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Mechanisms of lung injury:</strong></p>
            <div className="space-y-0.5 pl-2">
              <p>• <strong>Mechanical obstruction</strong> → air trapping, atelectasis</p>
              <p>• <strong>Surfactant inactivation</strong> → decreased compliance</p>
              <p>• <strong>Chemical pneumonitis</strong> → inflammation</p>
              <p>• <strong>Pulmonary vasoconstriction</strong> → PPHN</p>
            </div>
            <p className="mt-1">Often associated with perinatal asphyxia (fetal distress triggers meconium passage)</p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• Post-term pregnancy</div>
            <div>• Thick meconium</div>
            <div>• Fetal distress</div>
            <div>• Low Apgar scores</div>
            <div>• Oligohydramnios</div>
            <div>• IUGR</div>
            <div>• Male sex</div>
            <div>• African descent</div>
          </div>
        </div>

        {/* Delivery Room Management */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">DELIVERY ROOM MANAGEMENT</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Vigorous Infant (Good tone, HR &gt;100, crying)</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Routine care (warm, dry, stimulate)</p>
              <p>• Gentle oropharyngeal suctioning if needed</p>
              <p>• <strong>NO routine intubation/tracheal suctioning</strong></p>
            </div>
          </div>

          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Non-Vigorous Infant (Depressed, apneic, limp)</p>
            <div className="text-[8px] text-red-600 mt-1 space-y-0.5">
              <p>• Begin resuscitation per NRP algorithm</p>
              <p>• PPV if apneic/HR &lt;100 after initial steps</p>
              <p>• Consider intubation ONLY if tracheal obstruction suspected</p>
              <p>• Do NOT delay PPV for suctioning</p>
              <p className="text-[7px] mt-1 text-gray-600">(Routine intubation/suctioning no longer recommended - NRP 2015+)</p>
            </div>
          </div>
        </div>

        {/* Clinical Presentation */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Clinical Presentation</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p><strong>Early (within hours):</strong></p>
            <p>• Tachypnea, grunting, retractions</p>
            <p>• Barrel chest (air trapping)</p>
            <p>• Cyanosis</p>
            <p>• Meconium staining of skin, nails, cord</p>
            
            <p className="font-bold mt-2">Severity Classification:</p>
            <table className="w-full text-[7px]">
              <tbody>
                <tr><td className="pr-2">Mild:</td><td>FiO2 &lt;0.4 for &lt;48h</td></tr>
                <tr><td className="pr-2">Moderate:</td><td>FiO2 ≥0.4 for &gt;48h</td></tr>
                <tr><td className="pr-2">Severe:</td><td>Mechanical ventilation &gt;48h</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CXR Findings */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Chest X-ray Findings</p>
          <div className="text-[8px] text-purple-600 space-y-0.5">
            <p>• Patchy infiltrates (coarse, irregular)</p>
            <p>• Hyperinflation (flattened diaphragms)</p>
            <p>• Areas of atelectasis and consolidation</p>
            <p>• May have pneumothorax/pneumomediastinum</p>
            <p>• "Dirty" appearance of lung fields</p>
          </div>
        </div>

        {/* NICU Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">NICU Management</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-green-400">Respiratory Support:</p>
            <p>• Maintain SpO2 94-98%</p>
            <p>• Supplemental O2 → CPAP → Mechanical ventilation</p>
            <p>• Use lower rates, longer Ti if air trapping</p>
            <p>• HFOV may be beneficial if conventional fails</p>
            
            <p className="font-bold text-cyan-400 mt-2">Surfactant:</p>
            <p>Consider surfactant if intubated with significant disease</p>
            <p>Dose: 4 mL/kg of standard preparation</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 4).toFixed(0)} mL</p>}
            <p className="text-[7px]">May need to suction after surfactant</p>
            
            <p className="font-bold text-purple-400 mt-2">Inhaled Nitric Oxide (iNO):</p>
            <p>For associated PPHN</p>
            <p>Start at 20 ppm, wean when SpO2 stable</p>
          </div>
        </div>

        {/* Supportive Care */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Supportive Care</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>General:</strong></p>
            <p>• NPO initially, advance feeds when stable</p>
            <p>• IV fluids, consider restriction if PPHN</p>
            <p>• Maintain normothermia</p>
            <p>• Minimize handling/stimulation</p>
            
            <p className="font-bold mt-2">Cardiovascular:</p>
            <p>• Volume resuscitation if needed</p>
            <p>• Inotropes for hypotension/poor perfusion</p>
            
            <p className="font-bold mt-2">Sedation (if ventilated):</p>
            <p>• Morphine 0.05-0.1 mg/kg/dose q4h PRN</p>
            <p>• Fentanyl infusion 1-3 mcg/kg/hr</p>
          </div>
        </div>

        {/* Antibiotics */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Antibiotics</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p>Consider empiric antibiotics:</p>
            <p>• Cannot distinguish MAS from pneumonia initially</p>
            <p>• Many have associated perinatal infection risk</p>
            <p className="mt-1"><strong>Typical regimen:</strong> Ampicillin + Gentamicin</p>
            <p>Duration: 48-72h, discontinue if cultures negative and clinically improving</p>
          </div>
        </div>

        {/* Complications */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Complications</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• PPHN (up to 30%)</div>
            <div>• Air leak (pneumothorax)</div>
            <div>• Hypoxic brain injury</div>
            <div>• HIE</div>
            <div>• Bacterial superinfection</div>
            <div>• Chronic lung disease</div>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Mortality: 2-5% (higher with severe PPHN/ECMO)</p>
            <p>• Most infants with mild-moderate MAS recover completely</p>
            <p>• Increased risk of reactive airway disease</p>
            <p>• Neurodevelopmental outcomes depend on associated asphyxia</p>
            <p>• 2% may require ECMO support</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default MASApproach;
