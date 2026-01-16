/**
 * Respiratory Distress Syndrome (RDS) Approach
 * Updated: 2024 European Consensus Guidelines
 * Reference: Arch Dis Child Fetal Neonatal Ed 2024
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RDSApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="rds-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Respiratory Distress Syndrome (RDS)</CardTitle>
        <CardDescription className="text-xs">Surfactant Deficiency Disease</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 European Consensus Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Updates */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">2024 Key Recommendations</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p>• <strong>Less invasive surfactant:</strong> LISA/MIST preferred over INSURE</p>
            <p>• <strong>CPAP first:</strong> Early CPAP + rescue surfactant vs prophylactic</p>
            <p>• <strong>Caffeine:</strong> Start early (&lt;2 hours) for all &lt;30 weeks</p>
            <p>• <strong>Target SpO2:</strong> 90-94% for preterm infants</p>
            {ga > 0 && ga < 30 && (
              <p className="bg-amber-100 p-1 rounded mt-1">
                At {ga} weeks: Start caffeine within 2 hours of birth
              </p>
            )}
          </div>
        </div>

        {/* Definition */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Definition & Risk Factors</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p>Surfactant deficiency disease of premature infants causing progressive respiratory failure.</p>
            <p className="font-bold mt-1">Risk increases with:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Lower gestational age</div>
              <div>• No antenatal steroids</div>
              <div>• Male sex</div>
              <div>• C-section without labor</div>
              <div>• Perinatal asphyxia</div>
              <div>• Maternal diabetes</div>
            </div>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Clinical Features</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p className="font-bold">Onset within first 4-6 hours:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Tachypnea (&gt;60/min)</div>
              <div>• Grunting</div>
              <div>• Nasal flaring</div>
              <div>• Retractions (subcostal, intercostal)</div>
              <div>• Cyanosis in room air</div>
              <div>• Decreased air entry</div>
            </div>
            <p className="mt-1"><strong>CXR:</strong> Diffuse ground-glass, air bronchograms, low lung volumes</p>
          </div>
        </div>

        {/* Respiratory Support */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">RESPIRATORY SUPPORT STRATEGY</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Step 1: CPAP (First-Line)</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Start CPAP 5-8 cm H2O in delivery room</p>
              <p>• Target SpO2 90-94% (85-89% first 10 min)</p>
              <p>• Titrate FiO2 to target</p>
            </div>
          </div>

          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Step 2: Surfactant Indications</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p>• FiO2 &gt;0.30 on CPAP with RDS</p>
              <p>• Earlier threshold for &lt;26 weeks (FiO2 &gt;0.30)</p>
              <p>• Consider intubation if FiO2 &gt;0.40-0.50</p>
            </div>
          </div>

          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-purple-700">Step 3: Ventilation (if needed)</p>
            <div className="text-[8px] text-purple-600 mt-1 space-y-0.5">
              <p>• Volume-targeted ventilation preferred</p>
              <p>• Target VT 4-6 mL/kg</p>
              <p>• Permissive hypercapnia OK (PCO2 50-65)</p>
            </div>
          </div>
        </div>

        {/* Surfactant */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Surfactant Administration (2024)</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Preferred: LISA/MIST (Less Invasive)</p>
            <p className="text-[7px]">Thin catheter into trachea during spontaneous breathing on CPAP</p>
            
            <div className="p-1.5 bg-gray-700 rounded mt-2">
              <p className="font-bold">Poractant alfa (Curosurf):</p>
              <p>100-200 mg/kg (1.25-2.5 mL/kg)</p>
              {w > 0 && <p className="font-mono text-green-400">= {(w * 100).toFixed(0)} - {(w * 200).toFixed(0)} mg ({(w * 1.25).toFixed(1)} - {(w * 2.5).toFixed(1)} mL)</p>}
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Beractant (Survanta):</p>
              <p>100 mg/kg (4 mL/kg)</p>
              {w > 0 && <p className="font-mono text-green-400">= {(w * 4).toFixed(1)} mL</p>}
            </div>
            
            <p className="text-[7px] text-gray-400 mt-1">May repeat every 6-12 hours if still requiring significant support (max 3-4 doses)</p>
          </div>
        </div>

        {/* Caffeine */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Caffeine (2024 - Start Early)</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p className="font-bold">Start within 2 hours for all &lt;30 weeks</p>
            <p><strong>Loading:</strong> 20 mg/kg caffeine citrate IV/PO</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w * 20).toFixed(0)} mg</p>}
            <p><strong>Maintenance:</strong> 5-10 mg/kg/day once daily (start 24h later)</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w * 5).toFixed(0)} - {(w * 10).toFixed(0)} mg/day</p>}
            <p className="mt-1 text-[7px]">Benefits: Facilitates extubation, reduces BPD</p>
          </div>
        </div>

        {/* Antenatal Steroids */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Prevention: Antenatal Steroids</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Indication:</strong> All pregnancies 23-34 weeks at risk of preterm delivery</p>
            <p><strong>Regimen:</strong> Betamethasone 12 mg IM × 2 doses, 24h apart</p>
            <p>OR Dexamethasone 6 mg IM × 4 doses, 12h apart</p>
            <p className="mt-1"><strong>Optimal benefit:</strong> 24 hours to 7 days after first dose</p>
          </div>
        </div>

        {/* Weaning */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Weaning from Support</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Wean FiO2 before CPAP pressure</p>
            <p>• Extubate to CPAP when stable on minimal settings</p>
            <p>• CPAP can be discontinued when FiO2 ≤0.25-0.30 on CPAP 5</p>
            <p>• Avoid oscillating between intubation/extubation</p>
            <p>• Continue caffeine until 32-34 weeks PMA</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default RDSApproach;
