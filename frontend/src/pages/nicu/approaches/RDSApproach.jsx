/**
 * Respiratory Distress Syndrome (RDS) Approach
 * Updated: 2024 European Consensus Guidelines
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RDSApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="rds-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Respiratory Distress Syndrome (RDS)</CardTitle>
        <CardDescription className="text-xs">Surfactant Deficiency Disease • 2024 European Consensus</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points (2024)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>CPAP first:</strong> Early CPAP + rescue surfactant preferred over prophylactic intubation</li>
            <li><strong>LISA/MIST:</strong> Less invasive surfactant preferred over INSURE</li>
            <li><strong>Caffeine:</strong> Start early (&lt;2h) for all &lt;30 weeks</li>
            <li><strong>Target SpO2:</strong> 90-94% for preterm infants</li>
          </ul>
          {ga > 0 && ga < 30 && (
            <p className="text-xs mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              At <strong>{ga} weeks</strong>: Start caffeine within 2 hours of birth
            </p>
          )}
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Lower gestational age</li>
              <li>No antenatal steroids</li>
              <li>Male sex</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>C-section without labor</li>
              <li>Perinatal asphyxia</li>
              <li>Maternal diabetes</li>
            </ul>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Features</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1"><strong>Onset:</strong> Within first 4-6 hours of life</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Tachypnea (&gt;60/min)</li>
                <li>Grunting</li>
              </ul>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Nasal flaring</li>
                <li>Retractions</li>
              </ul>
            </div>
            <p><strong>CXR:</strong> Ground-glass appearance, air bronchograms, low lung volumes</p>
          </div>
        </div>

        {/* Respiratory Support Strategy */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Respiratory Support Strategy</p>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Step 1: CPAP</p>
              <p>• 5-8 cm H2O in delivery room</p>
              <p>• Target SpO2 90-94%</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Step 2: Surfactant</p>
              <p>• If FiO2 &gt;30% on CPAP</p>
              <p>• Within 2h of symptoms</p>
            </div>
          </div>
        </div>

        {/* Surfactant Dosing */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Surfactant Dosing</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Product</th>
                  <th className="text-left py-1">Dose</th>
                  <th className="text-left py-1">Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1">Poractant alfa (Curosurf)</td><td>200 mg/kg initial</td><td>2.5 mL/kg</td></tr>
                <tr><td className="py-1">Beractant (Survanta)</td><td>100 mg/kg</td><td>4 mL/kg</td></tr>
                <tr><td className="py-1">Calfactant (Infasurf)</td><td>105 mg/kg</td><td>3 mL/kg</td></tr>
              </tbody>
            </table>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p>Curosurf: <span className="font-mono text-blue-600">{(w * 2.5).toFixed(1)} mL</span></p>
                <p>Survanta: <span className="font-mono text-blue-600">{(w * 4).toFixed(1)} mL</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Caffeine */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Caffeine Citrate</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Loading:</strong> 20 mg/kg IV/PO</p>
            <p><strong>Maintenance:</strong> 5-10 mg/kg/day (start 24h after loading)</p>
            {w > 0 && (
              <p className="font-mono text-blue-600 mt-1">
                Loading: {(w * 20).toFixed(0)} mg | Maintenance: {(w * 5).toFixed(0)}-{(w * 10).toFixed(0)} mg/day
              </p>
            )}
          </div>
        </div>

        {/* Prevention */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li><strong>Antenatal steroids:</strong> Betamethasone 12mg IM x2 doses (24h apart)</li>
            <li>Most effective if given &gt;24h before delivery</li>
            <li>Benefit up to 34 weeks gestation</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
};

export default RDSApproach;
