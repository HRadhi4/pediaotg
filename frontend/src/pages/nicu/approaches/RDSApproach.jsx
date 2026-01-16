/**
 * Respiratory Distress Syndrome (RDS) Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RDSApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Respiratory Distress Syndrome (RDS)</CardTitle>
        <CardDescription className="text-xs">Preterm respiratory management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-xs font-bold text-blue-700 mb-1">Definition</p>
          <p className="text-[9px] text-blue-600">
            Disease typical of preterm infants (&lt;34 weeks) due to insufficient pulmonary surfactant, causing alveolar collapse and respiratory failure.
          </p>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• Prematurity (main factor)</div>
            <div>• Male sex</div>
            <div>• Maternal diabetes</div>
            <div>• Cesarean without labor</div>
            <div>• Perinatal asphyxia</div>
            <div>• Surfactant protein mutations</div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Clinical Diagnosis</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded text-center">
              <p className="text-[9px] font-bold text-purple-700">Clinical Signs</p>
              <div className="text-[7px] text-purple-600 mt-1 text-left">
                <p>• Tachypnea</p>
                <p>• Retractions</p>
                <p>• Nasal flaring</p>
                <p>• Grunting</p>
                <p>• Cyanosis</p>
              </div>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded text-center">
              <p className="text-[9px] font-bold text-orange-700">X-Ray</p>
              <div className="text-[7px] text-orange-600 mt-1 text-left">
                <p>• Low lung volumes</p>
                <p>• Ground glass pattern</p>
                <p>• Air bronchograms</p>
                <p>• "White-out" (severe)</p>
              </div>
            </div>
            <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded text-center">
              <p className="text-[9px] font-bold text-teal-700">ABG</p>
              <div className="text-[7px] text-teal-600 mt-1 text-left">
                <p>• Hypoxemia</p>
                <p>• Hypercarbia</p>
                <p>• Acidosis</p>
              </div>
            </div>
          </div>
        </div>

        {/* MANAGEMENT ALGORITHM */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">MANAGEMENT ALGORITHM</p>
          
          {/* Prenatal */}
          <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-pink-700 text-center">Prenatal: Antenatal Corticosteroids (ANC)</p>
            <p className="text-[8px] text-pink-600 text-center mt-1">
              For 24-34 weeks gestation if at risk of delivery within 7 days
            </p>
          </div>

          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-3 bg-gray-400"></div>
          </div>

          {/* Delivery Room */}
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700 text-center">Delivery Room Stabilisation</p>
            <div className="text-[8px] text-blue-600 space-y-0.5 mt-1">
              <p>• Delayed cord clamping (30-60 sec)</p>
              <p>• Oxygen: <strong>&lt;28 wks:</strong> 30% | <strong>28-31 wks:</strong> 21-30%</p>
              <p>• Spontaneously breathing → <strong>CPAP 6 cm H2O</strong></p>
              <p>• Plastic bags for &lt;28 weeks (prevent hypothermia)</p>
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <div className="w-0.5 h-3 bg-gray-400"></div>
          </div>

          {/* Decision Point */}
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-center mb-2">
            <p className="text-[9px] font-bold text-amber-700">FiO2 &gt;30% needed?</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="text-center">
              <div className="p-1.5 bg-green-100 rounded text-[8px] font-bold text-green-700">NO</div>
              <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
              <div className="p-1.5 bg-green-50 rounded text-[7px] text-green-600">
                Continue nCPAP<br/>Monitor closely
              </div>
            </div>
            <div className="text-center">
              <div className="p-1.5 bg-red-100 rounded text-[8px] font-bold text-red-700">YES</div>
              <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
              <div className="p-1.5 bg-orange-100 rounded text-[7px] font-bold text-orange-700">
                SURFACTANT
              </div>
            </div>
          </div>

          {/* Surfactant Therapy */}
          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-orange-700 text-center">Surfactant Therapy</p>
            <div className="text-[8px] text-orange-600 space-y-0.5 mt-1">
              <p><strong>INSURE Method:</strong> Intubate → Surfactant → Extubate to CPAP</p>
              <p><strong>Indication:</strong> FiO2 &gt;30% needed on CPAP</p>
              <p><strong>Prophylaxis:</strong> No longer routinely indicated with early CPAP</p>
            </div>
          </div>
        </div>

        {/* Respiratory Support */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Respiratory Support Options</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[350px] border-collapse">
              <thead>
                <tr className="bg-blue-200 dark:bg-blue-900/40">
                  <th className="border border-blue-300 p-1 text-left font-semibold">Mode</th>
                  <th className="border border-blue-300 p-1 text-left font-semibold">Settings</th>
                  <th className="border border-blue-300 p-1 text-left font-semibold">Indication</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-blue-200 p-1 font-medium">nCPAP</td>
                  <td className="border border-blue-200 p-1">PEEP 6-8 cm H2O</td>
                  <td className="border border-blue-200 p-1">First-line for &lt;30 weeks</td>
                </tr>
                <tr className="bg-blue-50 dark:bg-blue-950/20">
                  <td className="border border-blue-200 p-1 font-medium">HFNC</td>
                  <td className="border border-blue-200 p-1">Flow rate by weight</td>
                  <td className="border border-blue-200 p-1">Alternative for weaning</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-blue-200 p-1 font-medium">SIMV/AC</td>
                  <td className="border border-blue-200 p-1">PIP 15-20, PEEP 5-6</td>
                  <td className="border border-blue-200 p-1">Failing CPAP</td>
                </tr>
                <tr className="bg-blue-50 dark:bg-blue-950/20">
                  <td className="border border-blue-200 p-1 font-medium">HFOV</td>
                  <td className="border border-blue-200 p-1">MAP 8-12, Amplitude variable</td>
                  <td className="border border-blue-200 p-1">Severe RDS, air leak</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Oxygen Targets */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Oxygen Targets</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-green-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Preterm (&lt;32 weeks)</p>
              <p>SpO2: 90-95%</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Term/Near-term</p>
              <p>SpO2: 92-97%</p>
            </div>
          </div>
        </div>

        {/* Caffeine */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Caffeine for Extubation</p>
          <div className="text-[8px] text-purple-600">
            <p><strong>Loading:</strong> Caffeine Citrate 20 mg/kg IV</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w*20).toFixed(0)} mg</p>}
            <p className="mt-1"><strong>Maintenance:</strong> 5-10 mg/kg/day</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w*5).toFixed(0)}-{(w*10).toFixed(0)} mg/day</p>}
          </div>
        </div>

        {/* Complications */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Complications to Monitor</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Respiratory:</p>
              <p>• Air leak (pneumothorax)</p>
              <p>• BPD</p>
              <p>• Pulmonary hemorrhage</p>
            </div>
            <div>
              <p className="font-bold">Other:</p>
              <p>• PDA</p>
              <p>• IVH</p>
              <p>• ROP</p>
              <p>• NEC</p>
            </div>
          </div>
        </div>

        {/* Differential */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Differential Diagnosis</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-amber-600">
            <div>• TTNB</div>
            <div>• Pneumonia</div>
            <div>• MAS</div>
            <div>• PPHN</div>
            <div>• Congenital anomalies</div>
            <div>• CHD</div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default RDSApproach;
