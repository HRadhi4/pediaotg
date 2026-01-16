/**
 * Neonatal Resuscitation Approach
 * Based on AHA/AAP NRP Guidelines 2025 (9th Edition)
 * Reference: AHA/AAP Neonatal Resuscitation Guidelines 2025
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ResuscitationApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  // ETT size calculation
  const getETTSize = () => {
    if (ga < 28) return "2.5";
    if (ga < 34) return "3.0";
    if (ga < 38) return "3.5";
    return "3.5-4.0";
  };

  // ETT depth calculation
  const getETTDepth = () => {
    if (w <= 0) return null;
    if (w < 1) return "6-7";
    if (w < 2) return "7-8";
    if (w < 3) return "8-9";
    return "9-10";
  };

  return (
    <Card data-testid="resuscitation-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Resuscitation (NRP 2025)</CardTitle>
        <CardDescription className="text-xs">AHA/AAP 9th Edition Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* 2025 Key Updates */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">2025 Key Updates</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Initial O2:</strong> Start with 21% (room air) for ≥35 weeks; 21-30% for &lt;35 weeks</li>
            <li><strong>Delayed cord clamping:</strong> ≥60 seconds for stable infants</li>
            <li><strong>Meconium:</strong> Do NOT routinely suction - begin PPV if needed</li>
            <li><strong>Epinephrine:</strong> IV route preferred; give early if HR &lt;60 despite ventilation + compressions</li>
          </ul>
        </div>

        {/* Initial Assessment - 30 seconds */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Initial Steps (30 seconds)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Assess:</strong> Term? Good tone? Breathing/crying?</p>
            <p><strong>If YES to all:</strong> Routine care with mother, delayed cord clamping</p>
            <p><strong>If NO:</strong> Warm, dry, position airway, clear secretions if needed, stimulate</p>
          </div>
        </div>

        {/* PPV */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Positive Pressure Ventilation (PPV)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Indication:</strong> Apnea, gasping, or HR &lt;100 after initial steps</p>
            <p><strong>Rate:</strong> 40-60 breaths/min</p>
            <p><strong>Pressure:</strong> Initial PIP 20-25 cm H2O (preterm: 20)</p>
            <p><strong>Check:</strong> MR. SOPA if chest not rising</p>
            <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded text-xs">
              <p className="font-medium">MR. SOPA:</p>
              <p>M - Mask adjustment | R - Reposition airway</p>
              <p>S - Suction | O - Open mouth | P - Pressure increase | A - Airway (ETT/LMA)</p>
            </div>
          </div>
        </div>

        {/* Oxygen Targets */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Target SpO2 (Preductal - Right Hand)</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Time</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Target SpO2</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">1 min</td><td>60-65%</td></tr>
              <tr><td className="py-1">2 min</td><td>65-70%</td></tr>
              <tr><td className="py-1">3 min</td><td>70-75%</td></tr>
              <tr><td className="py-1">4 min</td><td>75-80%</td></tr>
              <tr><td className="py-1">5 min</td><td>80-85%</td></tr>
              <tr><td className="py-1">10 min</td><td>85-95%</td></tr>
            </tbody>
          </table>
        </div>

        {/* Chest Compressions */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Chest Compressions</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Indication:</strong> HR &lt;60 despite 30 sec of effective PPV</p>
            <p><strong>Technique:</strong> Two-thumb encircling (preferred)</p>
            <p><strong>Depth:</strong> ⅓ AP diameter of chest</p>
            <p><strong>Ratio:</strong> 3 compressions : 1 breath (90 compressions + 30 breaths/min)</p>
            <p><strong>Increase O2:</strong> To 100% during compressions</p>
          </div>
        </div>

        {/* Epinephrine */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Epinephrine</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Indication:</strong> HR &lt;60 despite effective PPV + compressions</p>
            <p><strong>Concentration:</strong> 1:10,000 (0.1 mg/mL)</p>
            <div className="mt-2 space-y-2">
              <div className="p-2 bg-white dark:bg-slate-900 rounded">
                <p className="font-medium">IV/UVC (preferred):</p>
                <p>0.01-0.03 mg/kg (0.1-0.3 mL/kg of 1:10,000)</p>
                {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400 mt-1">= {(w * 0.1).toFixed(1)} - {(w * 0.3).toFixed(1)} mL</p>}
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded">
                <p className="font-medium">ETT (if no IV):</p>
                <p>0.05-0.1 mg/kg (0.5-1 mL/kg of 1:10,000)</p>
                {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400 mt-1">= {(w * 0.5).toFixed(1)} - {(w * 1).toFixed(1)} mL</p>}
              </div>
            </div>
            <p className="mt-2">May repeat every 3-5 minutes</p>
          </div>
        </div>

        {/* Volume Expansion */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Volume Expansion</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Indication:</strong> Suspected blood loss, poor response to resuscitation</p>
            <p><strong>Solution:</strong> NS or O-negative blood</p>
            <p><strong>Dose:</strong> 10 mL/kg IV over 5-10 minutes</p>
            {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 10).toFixed(0)} mL</p>}
          </div>
        </div>

        {/* ETT Sizing */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">ETT Size & Depth</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">GA (weeks)</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Weight (kg)</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">ETT Size</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Depth (cm)</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className={ga > 0 && ga < 28 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">&lt;28</td><td>&lt;1</td><td>2.5</td><td>6-7</td>
              </tr>
              <tr className={ga >= 28 && ga < 34 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">28-34</td><td>1-2</td><td>3.0</td><td>7-8</td>
              </tr>
              <tr className={ga >= 34 && ga < 38 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">34-38</td><td>2-3</td><td>3.5</td><td>8-9</td>
              </tr>
              <tr className={ga >= 38 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">≥38</td><td>&gt;3</td><td>3.5-4.0</td><td>9-10</td>
              </tr>
            </tbody>
          </table>
          {(ga > 0 || w > 0) && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
              <p className="font-medium text-blue-700 dark:text-blue-300">For this patient:</p>
              <p className="text-blue-600 dark:text-blue-400">ETT Size: {getETTSize()} | Depth: {getETTDepth() || "Enter weight"} cm</p>
            </div>
          )}
        </div>

        {/* Special Considerations */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Special Considerations</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Preterm &lt;32 weeks:</strong> Plastic wrap/bag, T-piece resuscitator, avoid high FiO2</p>
            <p><strong>Meconium:</strong> Begin PPV if not vigorous; intubate only if obstruction suspected</p>
            <p><strong>Pneumothorax:</strong> Consider if sudden deterioration, asymmetric breath sounds</p>
          </div>
        </div>

        {/* Post-Resuscitation */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Post-Resuscitation Care</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• Monitor glucose, temperature, blood gas</p>
            <p>• Consider therapeutic hypothermia if HIE criteria met (≥36 weeks)</p>
            <p>• Document all interventions and Apgar scores</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ResuscitationApproach;
