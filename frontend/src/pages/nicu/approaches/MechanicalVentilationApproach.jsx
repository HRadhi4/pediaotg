/**
 * Mechanical Ventilation Approach (HFO)
 * NICU High-Frequency Oscillatory Ventilation Protocol
 * 
 * Design: Standardized to match other NICU approaches (RDSApproach.jsx pattern)
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MechanicalVentilationApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="mechanical-ventilation-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">High-Frequency Oscillatory Ventilation (HFO)</CardTitle>
        <CardDescription className="text-xs">NICU Ventilation Protocol</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* HFO Mechanism */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">HFO Mechanism</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Amplitude (Delta P):</strong> Variation around MAP - controls <strong>Ventilation</strong> and <strong>Oxygenation</strong></p>
            <p><strong>MAP (Mean Airway Pressure):</strong> Controls <strong>Oxygenation</strong></p>
          </div>
        </div>

        {/* Initial HFO Settings */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Initial HFO Settings</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <td className="py-1 font-medium">MAP</td>
                  <td className="py-1">2-4 cmH2O above last CMV MAP</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <td className="py-1 font-medium">FiO2</td>
                  <td className="py-1">Start at 1.0, wean as tolerated</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <td className="py-1 font-medium">Frequency</td>
                  <td className="py-1">
                    {ga > 0 && ga < 37 ? `10-13 Hz (Preterm at ${ga} wks)` : ga >= 37 ? `8-10 Hz (Term at ${ga} wks)` : "See table below"}
                  </td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <td className="py-1 font-medium">Amplitude (Delta P)</td>
                  <td className="py-1">Start: 2× MAP (20-25 cmH2O)</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">I:E Ratio</td>
                  <td className="py-1"><strong>1:3 (33%)</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Frequency by Age */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Frequency by Age</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-purple-700 dark:text-purple-300">Preterm</p>
              <p className="text-lg font-mono">10-13 Hz</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-purple-700 dark:text-purple-300">Term</p>
              <p className="text-lg font-mono">8-10 Hz</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-purple-700 dark:text-purple-300">Children</p>
              <p className="text-lg font-mono">6-8 Hz</p>
            </div>
          </div>
        </div>

        {/* Adjustments Table */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Adjustments</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Problem</th>
                  <th className="text-left py-1">Adjustment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <td className="py-1 text-red-600 dark:text-red-400">Poor Oxygenation<br/><span className="text-[10px] text-slate-500">(Low SpO2/PaO2)</span></td>
                  <td className="py-1">• Increase FiO2<br/>• Increase MAP by 1-2 cmH2O</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <td className="py-1 text-amber-600 dark:text-amber-400">Over Oxygenation<br/><span className="text-[10px] text-slate-500">(High SpO2/PaO2)</span></td>
                  <td className="py-1">• Decrease FiO2<br/>• Decrease MAP by 1-2 cmH2O</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <td className="py-1 text-blue-600 dark:text-blue-400">Under Ventilation<br/><span className="text-[10px] text-slate-500">(High pCO2)</span></td>
                  <td className="py-1">• Increase Amplitude (Delta P) by 2-4<br/>• Decrease Frequency (1-2 Hz) if Delta P maximal</td>
                </tr>
                <tr>
                  <td className="py-1 text-green-600 dark:text-green-400">Over Ventilation<br/><span className="text-[10px] text-slate-500">(Low pCO2)</span></td>
                  <td className="py-1">• Decrease Amplitude (Delta P) by 2-4<br/>• Increase Frequency (1-2 Hz) if Delta P minimal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Weaning Protocol */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Weaning in HFO</p>
          <ol className="text-xs text-slate-600 dark:text-slate-300 list-decimal pl-4 space-y-1">
            <li><strong>Reduce FiO2 to &lt;40%</strong> before weaning MAP <span className="text-[10px] text-slate-500">(except when over-inflation is evident)</span></li>
            <li><strong>Reduce MAP</strong> when CXR shows over-inflation (&gt;9 ribs)</li>
            <li>In <strong>air leak syndromes</strong>, reducing MAP takes priority over weaning FiO2</li>
            <li><strong>Discontinue weaning</strong> when: MAP 8-10 cmH2O, Amplitude 20-25</li>
            <li>If stable, oxygenating well → <strong>Extubate to CPAP</strong> or switch to conventional ventilation</li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Troubleshooting</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <p className="font-medium text-red-700 dark:text-red-300">Persistent Hypoxemia</p>
                <ul className="list-disc pl-3 space-y-0.5 text-[10px]">
                  <li>Check ETT position</li>
                  <li>Rule out air leak/pneumothorax</li>
                  <li>Consider increasing MAP</li>
                  <li>Optimize hemodynamics</li>
                </ul>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                <p className="font-medium text-amber-700 dark:text-amber-300">Persistent Hypercarbia</p>
                <ul className="list-disc pl-3 space-y-0.5 text-[10px]">
                  <li>Check ETT patency (suction)</li>
                  <li>Increase amplitude</li>
                  <li>Decrease frequency (↑ Vt)</li>
                  <li>Check chest wiggle</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Key Points */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>HFO provides lung protection through low tidal volumes</li>
            <li>Maintain adequate chest wiggle (vibration to umbilicus)</li>
            <li>Target CXR: 8-9 ribs expansion (avoid over/under inflation)</li>
            <li>Deep sedation often required; paralysis rarely needed</li>
            <li>ETT suction carefully - de-recruitment occurs quickly</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
};

export default MechanicalVentilationApproach;
