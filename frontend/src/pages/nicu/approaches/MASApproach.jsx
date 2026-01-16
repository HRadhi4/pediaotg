/**
 * Meconium Aspiration Syndrome (MAS) Approach
 * Updated: 2023-2024 NRP/AHA Guidelines
 * Reference: AHA Neonatal Resuscitation Guidelines, ACOG 2017, Pediatrics
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

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>MAS:</strong> Respiratory distress in a newborn born through meconium-stained amniotic fluid (MSAF) with characteristic radiographic findings, when symptoms cannot be otherwise explained.</p>
            <p>MSAF occurs in ~8-15% of deliveries; MAS develops in ~5% of infants with MSAF.</p>
            <p>More common in post-term and term infants.</p>
          </div>
        </div>

        {/* Pathophysiology */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Pathophysiology</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Mechanisms of lung injury:</strong></p>
            <div className="space-y-0.5 pl-2">
              <p>• <strong>Mechanical obstruction</strong> → air trapping, ball-valve effect</p>
              <p>• <strong>Surfactant inactivation</strong> → decreased compliance, atelectasis</p>
              <p>• <strong>Chemical pneumonitis</strong> → inflammation, edema</p>
              <p>• <strong>Pulmonary vasoconstriction</strong> → PPHN (up to 30%)</p>
            </div>
            <p className="mt-1">Often associated with perinatal asphyxia (fetal stress triggers meconium passage in utero)</p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• Post-term pregnancy (&gt;42 wk)</div>
            <div>• Thick/"pea-soup" meconium</div>
            <div>• Fetal distress/hypoxia</div>
            <div>• Low Apgar scores</div>
            <div>• Oligohydramnios</div>
            <div>• IUGR</div>
            <div>• Male sex</div>
            <div>• Cord complications</div>
          </div>
        </div>

        {/* 2023 Delivery Room Management - CRITICAL UPDATE */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">DELIVERY ROOM MANAGEMENT (NRP 2023)</p>
          
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg mb-2 border-2 border-amber-400">
            <p className="text-[10px] font-bold text-amber-700">⚠️ KEY 2015+ CHANGE (Still Current in 2023)</p>
            <div className="text-[8px] text-amber-600 mt-1">
              <p><strong>ROUTINE INTUBATION AND TRACHEAL SUCTIONING IS NO LONGER RECOMMENDED</strong></p>
              <p>• Applies to BOTH vigorous AND non-vigorous infants</p>
              <p>• Same initial steps as for infants with clear fluid</p>
            </div>
          </div>

          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Vigorous Infant (Good tone, HR &gt;100, crying/breathing)</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Standard initial steps (warm, dry, stimulate, position)</p>
              <p>• May remain with mother for skin-to-skin</p>
              <p>• Gentle mouth/nose suctioning only if secretions obstruct airway</p>
              <p>• Observe for respiratory distress</p>
            </div>
          </div>

          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Non-Vigorous Infant (Depressed, apneic, poor tone)</p>
            <div className="text-[8px] text-red-600 mt-1 space-y-0.5">
              <p>• Initial steps under radiant warmer</p>
              <p>• <strong>DO NOT DELAY PPV</strong> to clear meconium</p>
              <p>• Begin PPV if apneic or HR &lt;100 after initial steps</p>
              <p>• Intubate ONLY if tracheal obstruction suspected (unable to ventilate)</p>
              <p>• Follow standard NRP algorithm</p>
            </div>
          </div>
        </div>

        {/* Clinical Presentation */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Clinical Presentation</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p><strong>Early (within hours):</strong></p>
            <p>• Tachypnea, grunting, retractions, nasal flaring</p>
            <p>• Barrel chest (air trapping, hyperinflation)</p>
            <p>• Cyanosis, oxygen requirement</p>
            <p>• Meconium staining of skin, nails, umbilical cord</p>
            
            <p className="font-bold mt-2">Severity Classification:</p>
            <table className="w-full text-[7px]">
              <tbody>
                <tr><td className="pr-2 font-bold text-green-600">Mild:</td><td>FiO2 &lt;0.4 for &lt;48h</td></tr>
                <tr><td className="pr-2 font-bold text-amber-600">Moderate:</td><td>FiO2 ≥0.4 for &gt;48h</td></tr>
                <tr><td className="pr-2 font-bold text-red-600">Severe:</td><td>Mechanical ventilation &gt;48h</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CXR Findings */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Chest X-ray Findings</p>
          <div className="text-[8px] text-purple-600 space-y-0.5">
            <p>• Patchy infiltrates (coarse, irregular opacities)</p>
            <p>• Hyperinflation (flattened diaphragms, &gt;9 ribs visible)</p>
            <p>• Areas of atelectasis and consolidation mixed</p>
            <p>• Air leak risk: pneumothorax, pneumomediastinum</p>
            <p>• "Dirty," heterogeneous appearance</p>
          </div>
        </div>

        {/* NICU Management */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">NICU Management</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-green-400">Respiratory Support:</p>
            <p>• Target SpO2 94-98% (preductal)</p>
            <p>• Stepwise: O2 → CPAP → Mechanical ventilation</p>
            <p>• High PEEP (6-8 cm H2O) to recruit atelectatic areas</p>
            <p>• Low rates (40-60/min), longer Ti (0.5-0.6s) for air trapping</p>
            <p>• HFOV if conventional ventilation fails</p>
            
            <p className="font-bold text-cyan-400 mt-2">Surfactant (Consider if intubated):</p>
            <p>Dose: 4 mL/kg of Curosurf (or equivalent)</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 4).toFixed(0)} mL</p>}
            <p className="text-[7px]">May need repeat dose; suction after if needed</p>
            
            <p className="font-bold text-purple-400 mt-2">Inhaled Nitric Oxide (iNO):</p>
            <p>For associated PPHN (OI &gt;25)</p>
            <p>Start at 20 ppm, wean when OI &lt;15</p>
          </div>
        </div>

        {/* Ventilation Strategy */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Ventilation Strategy (2024 Evidence)</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Goals:</strong></p>
            <p>• PaO2 50-80 mmHg, SpO2 94-98%</p>
            <p>• PaCO2 40-50 mmHg (mild permissive hypercapnia OK)</p>
            <p>• pH &gt;7.25</p>
            
            <p className="font-bold mt-1">Settings:</p>
            <p>• PEEP 6-8 cm H2O</p>
            <p>• Rate 40-60/min</p>
            <p>• Ti 0.5-0.6 sec (long expiratory time)</p>
            <p>• Target Vt 4-6 mL/kg</p>
          </div>
        </div>

        {/* Supportive Care */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Supportive Care</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>General:</strong></p>
            <p>• NPO initially, advance feeds when stable</p>
            <p>• IV fluids (may restrict if PPHN present)</p>
            <p>• Maintain normothermia (36.5-37.5°C)</p>
            <p>• Minimal handling/stimulation (PPHN)</p>
            <p>• NG tube for decompression</p>
            
            <p className="font-bold mt-2">Cardiovascular:</p>
            <p>• Volume resuscitation (NS 10 mL/kg) if needed</p>
            <p>• Inotropes for hypotension (dopamine, dobutamine)</p>
            
            <p className="font-bold mt-2">Sedation (if ventilated):</p>
            <p>• Morphine 0.05-0.1 mg/kg q4h PRN</p>
            <p>• Or Fentanyl infusion 1-2 mcg/kg/hr</p>
          </div>
        </div>

        {/* Antibiotics */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Antibiotics</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p>Start empiric antibiotics until infection ruled out:</p>
            <p>• Cannot distinguish MAS from pneumonia clinically</p>
            <p>• Risk of bacterial superinfection</p>
            <p className="mt-1"><strong>Typical regimen:</strong> Ampicillin + Gentamicin</p>
            {w > 0 && (
              <div className="font-mono text-green-600 mt-1">
                <p>Ampicillin: {(w * 50).toFixed(0)} mg q12h</p>
                <p>Gentamicin: {(w * 4).toFixed(1)} mg q24h</p>
              </div>
            )}
            <p>Duration: 48-72h; discontinue if cultures negative and improving</p>
          </div>
        </div>

        {/* Complications */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Complications</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• <strong>PPHN</strong> (20-30%)</div>
            <div>• Air leak (pneumothorax 15-30%)</div>
            <div>• HIE/asphyxia injury</div>
            <div>• Bacterial superinfection</div>
            <div>• Chronic lung disease</div>
            <div>• Neurodevelopmental issues</div>
          </div>
        </div>

        {/* ECMO */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">ECMO Considerations</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Indications (~2% of severe MAS):</strong></p>
            <p>• OI &gt;40 despite maximal therapy</p>
            <p>• Failure to respond to iNO</p>
            <p>• Refractory hypoxemia/PPHN</p>
            <p className="mt-1"><strong>Criteria:</strong> ≥34 weeks GA, &gt;2 kg, no major IVH</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Mortality: 2-5% (higher with severe PPHN/ECMO)</p>
            <p>• Most infants with mild-moderate MAS recover completely</p>
            <p>• Increased risk of reactive airway disease in childhood</p>
            <p>• Neurodevelopmental outcomes depend on associated asphyxia</p>
            <p>• ~2% may require ECMO support</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default MASApproach;
