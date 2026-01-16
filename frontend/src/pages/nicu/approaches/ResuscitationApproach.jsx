/**
 * Neonatal Resuscitation Approach
 * Based on AHA/AAP NRP Guidelines 2025 (8th Edition)
 * Reference: AHA/AAP Neonatal Resuscitation Guidelines 2025
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ResuscitationApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="resuscitation-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Resuscitation</CardTitle>
        <CardDescription className="text-xs">NRP Algorithm 2025 (9th Edition)</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: AHA/AAP 2025 Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* 2025 Key Updates Box */}
        <div className="p-2 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200">
          <p className="text-xs font-bold text-cyan-700 mb-1">2025 Key Updates</p>
          <div className="text-[8px] text-cyan-600 space-y-0.5">
            <p>• <strong>Avoid 100% O2</strong> in term/late preterm (≥35 wks) - start with room air or blended O2</p>
            <p>• <strong>Delayed cord clamping ≥60 sec</strong> for stable infants</p>
            <p>• <strong>Intact cord resuscitation</strong> (CPAP/PPV before clamping) supported for vigorous infants</p>
            <p>• Consider redirecting care ~20 min post-birth in periviable/high-morbidity cases</p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors for High-Risk Birth</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• Preterm delivery</div>
            <div>• Abnormal FHR</div>
            <div>• Maternal infection</div>
            <div>• Preeclampsia</div>
            <div>• Breech presentation</div>
            <div>• Obstetrical emergencies</div>
            <div>• Thick meconium</div>
            <div>• Oligohydramnios</div>
            <div>• Fetal anomalies</div>
            <div>• C-section &lt;39 wks</div>
          </div>
        </div>

        {/* ALGORITHM FLOWCHART */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-blue-700 mb-2">RESUSCITATION ALGORITHM</p>
          
          {/* Initial Assessment */}
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-center mb-2">
            <p className="text-[10px] font-bold text-blue-700">Initial Assessment</p>
            <p className="text-[8px] text-blue-600">Term gestation? Breathing/crying? Good tone?</p>
          </div>

          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-3 bg-gray-400"></div>
          </div>

          {/* Initial Steps */}
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700 text-center">A - Initial Steps</p>
            <div className="text-[8px] text-green-600 space-y-0.5 mt-1">
              <p>• Warmth (polyethylene bag for &lt;28 weeks)</p>
              <p>• Position airway (sniffing position)</p>
              <p>• Clear secretions if needed</p>
              <p>• Dry and stimulate</p>
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-3 bg-gray-400"></div>
          </div>

          {/* Decision: Apnea/Gasping or HR <100? */}
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-center mb-2">
            <p className="text-[9px] font-bold text-amber-700">Apnea/Gasping or HR &lt;100 bpm?</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="text-center">
              <div className="p-1.5 bg-green-100 rounded text-[8px] font-bold text-green-700">NO</div>
              <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
              <div className="p-1.5 bg-green-50 rounded text-[7px] text-green-600">
                Labored breathing/Cyanosis?<br/>→ CPAP or O2
              </div>
            </div>
            <div className="text-center">
              <div className="p-1.5 bg-red-100 rounded text-[8px] font-bold text-red-700">YES</div>
              <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
              <div className="p-1.5 bg-blue-100 rounded text-[7px] font-bold text-blue-700">
                B - PPV
              </div>
            </div>
          </div>

          {/* PPV Details */}
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700 text-center">B - Positive Pressure Ventilation</p>
            <div className="text-[8px] text-blue-600 space-y-0.5 mt-1">
              <p>• PIP: 20-25 cm H2O (first breath 30-40 cm H2O)</p>
              <p>• PEEP: 5 cm H2O</p>
              <p>• Rate: 40-60 breaths/min</p>
              <p>• <strong>Term:</strong> Start with 21% O2</p>
              <p>• <strong>&lt;35 weeks:</strong> Start with 21-30% O2</p>
            </div>
          </div>

          {/* MR. SOPA */}
          <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 mb-2">
            <p className="text-[9px] font-bold text-purple-700 text-center">MR. SOPA - Ventilation Corrective Steps</p>
            <div className="grid grid-cols-2 gap-1 text-[7px] text-purple-600 mt-1">
              <div><strong>M</strong> - Mask seal</div>
              <div><strong>R</strong> - Reposition airway</div>
              <div><strong>S</strong> - Suction</div>
              <div><strong>O</strong> - Open mouth</div>
              <div><strong>P</strong> - Pressure increase</div>
              <div><strong>A</strong> - Advanced airway</div>
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-3 bg-gray-400"></div>
          </div>

          {/* HR <60? */}
          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg text-center mb-2">
            <p className="text-[9px] font-bold text-orange-700">HR &lt;60 bpm despite 30 sec effective ventilation?</p>
          </div>

          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-3 bg-gray-400"></div>
          </div>

          {/* Chest Compressions */}
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-red-700 text-center">C - Chest Compressions</p>
            <div className="text-[8px] text-red-600 space-y-0.5 mt-1">
              <p>• Two-thumb encircling technique</p>
              <p>• Compression:Ventilation = <strong>3:1</strong></p>
              <p>• 90 compressions + 30 ventilations/min</p>
              <p>• Depth: 1/3 of AP chest diameter</p>
              <p>• Increase O2 to 100%</p>
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-3 bg-gray-400"></div>
          </div>

          {/* Medications */}
          <div className="p-2 bg-gray-800 text-white rounded-lg">
            <p className="text-[10px] font-bold text-center">D - Drugs (if HR remains &lt;60 bpm)</p>
            <div className="text-[8px] space-y-1 mt-1">
              <div className="p-1.5 bg-gray-700 rounded">
                <p className="font-bold">Epinephrine 1:10,000</p>
                <p>IV/IO: 0.01-0.03 mg/kg (0.1-0.3 mL/kg)</p>
                {w > 0 && <p className="text-green-400">= {(w*0.1).toFixed(1)}-{(w*0.3).toFixed(1)} mL</p>}
                <p>ET: 0.05-0.1 mg/kg (0.5-1 mL/kg)</p>
              </div>
              <div className="p-1.5 bg-gray-700 rounded">
                <p className="font-bold">Volume Expansion (NS)</p>
                <p>10 mL/kg over 5-10 minutes</p>
                {w > 0 && <p className="text-green-400">= {(w*10).toFixed(0)} mL</p>}
              </div>
            </div>
          </div>
        </div>

        {/* SpO2 Targets */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-xs font-bold text-blue-700 mb-1">Target SpO2 After Birth</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[8px] border-collapse">
              <thead>
                <tr className="bg-blue-100 dark:bg-blue-900/40">
                  <th className="border border-blue-200 p-1">Time</th>
                  <th className="border border-blue-200 p-1">1 min</th>
                  <th className="border border-blue-200 p-1">2 min</th>
                  <th className="border border-blue-200 p-1">3 min</th>
                  <th className="border border-blue-200 p-1">4 min</th>
                  <th className="border border-blue-200 p-1">5 min</th>
                  <th className="border border-blue-200 p-1">10 min</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-blue-200 p-1 font-medium">SpO2</td>
                  <td className="border border-blue-200 p-1 text-center">60-65%</td>
                  <td className="border border-blue-200 p-1 text-center">65-70%</td>
                  <td className="border border-blue-200 p-1 text-center">70-75%</td>
                  <td className="border border-blue-200 p-1 text-center">75-80%</td>
                  <td className="border border-blue-200 p-1 text-center">80-85%</td>
                  <td className="border border-blue-200 p-1 text-center">85-95%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Special Considerations */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Special Considerations</p>
          <div className="space-y-1 text-[8px] text-amber-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Prematurity (&lt;28 weeks):</p>
              <p>• Polyethylene bag/wrap (don't dry first)</p>
              <p>• Cap on head, exothermic mattress</p>
              <p>• Start O2 at 21-30%</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Congenital Diaphragmatic Hernia:</p>
              <p>• Avoid prolonged face-mask ventilation</p>
              <p>• Intubate quickly</p>
              <p>• Place orogastric tube</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Meconium-Stained Amniotic Fluid:</p>
              <p>• Routine intubation NOT recommended for vigorous infants</p>
              <p>• May suction non-vigorous infants with airway obstruction</p>
            </div>
          </div>
        </div>

        {/* DOPE Mnemonic */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">DOPE - If Not Responding</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div><strong>D</strong> - Displacement of ETT</div>
            <div><strong>O</strong> - Obstruction of ETT</div>
            <div><strong>P</strong> - Pneumothorax</div>
            <div><strong>E</strong> - Equipment failure</div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ResuscitationApproach;
