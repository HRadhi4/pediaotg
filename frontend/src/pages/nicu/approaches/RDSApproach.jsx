/**
 * Respiratory Distress Syndrome (RDS) Approach
 * Based on European Consensus Guidelines 2022
 * Reference: Arch Dis Child Fetal Neonatal Ed 2023
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RDSApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="rds-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Respiratory Distress Syndrome (RDS)</CardTitle>
        <CardDescription className="text-xs">European Consensus 2022 Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Updates */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Current Recommendations</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Less invasive surfactant:</strong> LISA/MIST preferred over INSURE</li>
            <li><strong>CPAP first:</strong> Early CPAP + rescue surfactant vs prophylactic</li>
            <li><strong>Caffeine:</strong> Start early (&lt;2 hours) for all &lt;29 weeks</li>
            <li><strong>Target SpO2:</strong> 90-94% for preterm infants</li>
          </ul>
        </div>

        {/* Definition */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Definition & Pathophysiology</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>Surfactant deficiency disease of premature infants causing progressive respiratory failure.</p>
            <p className="mt-2 font-medium">Risk increases with:</p>
            <ul className="list-disc pl-4">
              <li>Lower gestational age</li>
              <li>No antenatal steroids</li>
              <li>Male sex</li>
              <li>C-section without labor</li>
              <li>Perinatal asphyxia</li>
            </ul>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Features</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Onset within first 4-6 hours:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p>• Tachypnea (&gt;60/min)</p>
                <p>• Grunting</p>
                <p>• Nasal flaring</p>
              </div>
              <div>
                <p>• Retractions</p>
                <p>• Cyanosis in room air</p>
                <p>• Decreased air entry</p>
              </div>
            </div>
            <p className="mt-2"><strong>CXR:</strong> Diffuse ground-glass, air bronchograms, low lung volumes</p>
          </div>
        </div>

        {/* Respiratory Support */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Respiratory Support Strategy</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">1. CPAP (First-line)</p>
              <p>• Start CPAP 5-8 cm H2O in delivery room</p>
              <p>• Target SpO2 90-94% (85-89% first 10 min)</p>
              <p>• Titrate FiO2 to target</p>
            </div>
            
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">2. Surfactant Indications:</p>
              <p>• FiO2 &gt;0.30 on CPAP with RDS</p>
              <p>• Earlier threshold for &lt;26 weeks (FiO2 &gt;0.30)</p>
              <p>• Consider intubation if FiO2 &gt;0.40-0.50</p>
            </div>
            
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">3. Ventilation (if needed):</p>
              <p>• Volume-targeted ventilation preferred</p>
              <p>• Target VT 4-6 mL/kg</p>
              <p>• Permissive hypercapnia OK (PCO2 50-65)</p>
            </div>
          </div>
        </div>

        {/* Surfactant */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surfactant Administration</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Preferred: LISA/MIST (Less Invasive)</p>
              <p>Thin catheter into trachea during spontaneous breathing on CPAP</p>
            </div>
            
            <div>
              <p className="font-medium">Dosing:</p>
              <p>Poractant alfa (Curosurf): 100-200 mg/kg</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 100).toFixed(0)} - {(w * 200).toFixed(0)} mg ({(w * 1.25).toFixed(1)} - {(w * 2.5).toFixed(1)} mL)</p>}
              <p className="mt-1">Beractant (Survanta): 100 mg/kg (4 mL/kg)</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 4).toFixed(1)} mL</p>}
            </div>
            
            <p>May repeat every 6-12 hours if still requiring significant support (max 3-4 doses)</p>
          </div>
        </div>

        {/* Caffeine */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Caffeine</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Start within 2 hours for all &lt;29 weeks</p>
            <p><strong>Loading:</strong> 20 mg/kg caffeine citrate IV/PO</p>
            {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 20).toFixed(0)} mg</p>}
            <p><strong>Maintenance:</strong> 5-10 mg/kg/day once daily</p>
            {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 5).toFixed(0)} - {(w * 10).toFixed(0)} mg/day</p>}
            <p className="mt-1 text-slate-500">Benefits: Facilitates extubation, reduces BPD</p>
          </div>
        </div>

        {/* Antenatal Steroids */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention: Antenatal Steroids</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Indication:</strong> All pregnancies 23-34 weeks at risk of preterm delivery</p>
            <p><strong>Regimen:</strong> Betamethasone 12 mg IM × 2 doses, 24h apart</p>
            <p>OR Dexamethasone 6 mg IM × 4 doses, 12h apart</p>
            <p className="mt-1"><strong>Optimal benefit:</strong> 24 hours to 7 days after first dose</p>
          </div>
        </div>

        {/* Weaning */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Weaning from Support</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
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
