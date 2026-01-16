/**
 * Respiratory Distress Syndrome (RDS) Approach
 * Updated: 2024 European Consensus Guidelines
 * Simplified design matching Apnea approach
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RDSApproach = ({ weight, gestationalAge }) => {
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

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2024)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>CPAP first:</strong> Early CPAP + rescue surfactant preferred</p>
            <p><strong>LISA/MIST:</strong> Less invasive surfactant preferred over INSURE</p>
            <p><strong>Caffeine:</strong> Start early (&lt;2h) for all &lt;30 weeks</p>
            <p><strong>Target SpO2:</strong> 90-94% for preterm</p>
            {ga > 0 && ga < 30 && (
              <p className="bg-amber-100 p-1 rounded mt-1">
                At {ga} weeks: Start caffeine within 2 hours
              </p>
            )}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p>• Lower gestational age</p>
              <p>• No antenatal steroids</p>
              <p>• Male sex</p>
            </div>
            <div>
              <p>• C-section without labor</p>
              <p>• Perinatal asphyxia</p>
              <p>• Maternal diabetes</p>
            </div>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Clinical Features</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Onset:</strong> Within first 4-6 hours</p>
            <div className="grid grid-cols-2 gap-1">
              <p>• Tachypnea (&gt;60/min)</p>
              <p>• Grunting</p>
              <p>• Nasal flaring</p>
              <p>• Retractions</p>
            </div>
            <p><strong>CXR:</strong> Ground-glass, air bronchograms, low volumes</p>
          </div>
        </div>

        {/* Respiratory Support */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Respiratory Support Strategy</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-green-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Step 1: CPAP</p>
              <p>5-8 cm H2O in DR</p>
              <p>Target SpO2 90-94%</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Step 2: Surfactant</p>
              <p>If FiO2 &gt;0.30 on CPAP</p>
              <p>Use LISA if possible</p>
            </div>
          </div>
        </div>

        {/* Surfactant */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Surfactant Dosing</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Poractant alfa (Curosurf):</p>
            <p>100-200 mg/kg (1.25-2.5 mL/kg)</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 100).toFixed(0)}-{(w * 200).toFixed(0)} mg ({(w * 1.25).toFixed(1)}-{(w * 2.5).toFixed(1)} mL)</p>}
            
            <p className="font-bold text-cyan-400 mt-2">Beractant (Survanta):</p>
            <p>100 mg/kg (4 mL/kg)</p>
            {w > 0 && <p className="text-green-400 font-mono">= {(w * 4).toFixed(1)} mL</p>}
            
            <p className="text-[7px] text-gray-400 mt-1">May repeat q6-12h (max 3-4 doses)</p>
          </div>
        </div>

        {/* Caffeine */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Caffeine (Start Early)</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-indigo-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Loading:</p>
              <p>20 mg/kg caffeine citrate</p>
              {w > 0 && <p className="text-green-600 font-mono">= {(w * 20).toFixed(0)} mg</p>}
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Maintenance:</p>
              <p>5-10 mg/kg/day</p>
              {w > 0 && <p className="text-green-600 font-mono">= {(w * 5).toFixed(0)}-{(w * 10).toFixed(0)} mg</p>}
            </div>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Prevention</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Antenatal steroids:</strong> All 23-34 weeks at risk</p>
            <p>Betamethasone 12 mg IM × 2 doses, 24h apart</p>
            <p>Optimal benefit: 24h to 7 days after first dose</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Surfactant dramatically improved outcomes</p>
            <p>• Risk of BPD with prolonged O2/ventilation</p>
            <p>• Early caffeine reduces BPD</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default RDSApproach;
