/**
 * Mechanical Ventilation Approach
 * NICU Ventilation Protocols including:
 * - High-Frequency Oscillatory Ventilation (HFO)
 * - Conventional Ventilation (CMV) - future
 * - CPAP - future
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MechanicalVentilationApproach = ({ weight, gestationalAge }) => {
  const [activeTab, setActiveTab] = useState("hfo");
  const ga = parseFloat(gestationalAge) || 0;

  const tabs = [
    { id: "hfo", label: "HFO" },
    // Future tabs can be added here
    // { id: "cmv", label: "CMV" },
    // { id: "cpap", label: "CPAP" },
  ];

  return (
    <Card data-testid="mechanical-ventilation-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Mechanical Ventilation</CardTitle>
        <CardDescription className="text-xs">NICU Ventilation Protocols</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-teal-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* HFO Content */}
        {activeTab === "hfo" && (
          <div className="space-y-3">
            {/* Mechanism Overview */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">HFO Mechanism</p>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-blue-700 dark:text-blue-300">Amplitude (Delta P)</p>
                  <p className="text-muted-foreground">Variation around MAP - controls <strong>Ventilation</strong> and <strong>Oxygenation</strong></p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-blue-700 dark:text-blue-300">MAP (Mean Airway Pressure)</p>
                  <p className="text-muted-foreground">Controls <strong>Oxygenation</strong></p>
                </div>
              </div>
            </div>

            {/* Initial Settings */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Initial HFO Settings</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white dark:bg-gray-800 rounded">
                  <p className="font-medium">MAP</p>
                  <p className="text-muted-foreground">2-4 cmH2O above last CMV MAP</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded">
                  <p className="font-medium">FiO2</p>
                  <p className="text-muted-foreground">Start at 1.0, wean as tolerated</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded">
                  <p className="font-medium">Frequency</p>
                  <p className="text-muted-foreground">
                    {ga > 0 && ga < 37 ? "10-13 Hz (Preterm)" : ga >= 37 ? "8-10 Hz (Term)" : "See table below"}
                  </p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded">
                  <p className="font-medium">Amplitude (Delta P)</p>
                  <p className="text-muted-foreground">Start: 2× MAP (20-25 cmH2O)</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded col-span-2">
                  <p className="font-medium">I:E Ratio</p>
                  <p className="text-muted-foreground"><strong>1:3 (33%)</strong></p>
                </div>
              </div>
            </div>

            {/* Frequency by Age - moved here */}
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Frequency by Age</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-bold text-purple-700">Preterm</p>
                  <p className="text-lg font-mono">10-13 Hz</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-bold text-purple-700">Term</p>
                  <p className="text-lg font-mono">8-10 Hz</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-bold text-purple-700">Children</p>
                  <p className="text-lg font-mono">6-8 Hz</p>
                </div>
              </div>
            </div>

            {/* Adjustments Table */}
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Adjustments on HFOV</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                      <th className="p-2 text-left font-semibold">Problem</th>
                      <th className="p-2 text-left font-semibold">Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                    {/* Poor Oxygenation */}
                    <tr className="bg-red-50 dark:bg-red-900/20">
                      <td className="p-2">
                        <span className="font-medium text-red-700 dark:text-red-300">Poor Oxygenation</span>
                        <p className="text-muted-foreground text-[10px]">(Low SpO2/PaO2)</p>
                      </td>
                      <td className="p-2">
                        <ul className="space-y-0.5">
                          <li>• Increase FiO2</li>
                          <li>• Increase MAP by <strong>1-2 cmH2O</strong></li>
                        </ul>
                      </td>
                    </tr>
                    {/* Over Oxygenation */}
                    <tr className="bg-green-50 dark:bg-green-900/20">
                      <td className="p-2">
                        <span className="font-medium text-green-700 dark:text-green-300">Over Oxygenation</span>
                        <p className="text-muted-foreground text-[10px]">(High SpO2/PaO2)</p>
                      </td>
                      <td className="p-2">
                        <ul className="space-y-0.5">
                          <li>• Decrease FiO2</li>
                          <li>• Decrease MAP by <strong>1-2 cmH2O</strong></li>
                        </ul>
                      </td>
                    </tr>
                    {/* Under Ventilation */}
                    <tr className="bg-amber-50 dark:bg-amber-900/20">
                      <td className="p-2">
                        <span className="font-medium text-amber-700 dark:text-amber-300">Under Ventilation</span>
                        <p className="text-muted-foreground text-[10px]">(High pCO2)</p>
                      </td>
                      <td className="p-2">
                        <ul className="space-y-0.5">
                          <li>• Increase Amplitude (Delta P) by <strong>2-4</strong></li>
                          <li>• Decrease Frequency (1-2 Hz) if Delta P maximal</li>
                        </ul>
                      </td>
                    </tr>
                    {/* Over Ventilation */}
                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                      <td className="p-2">
                        <span className="font-medium text-blue-700 dark:text-blue-300">Over Ventilation</span>
                        <p className="text-muted-foreground text-[10px]">(Low pCO2)</p>
                      </td>
                      <td className="p-2">
                        <ul className="space-y-0.5">
                          <li>• Decrease Amplitude (Delta P) by <strong>2-4</strong></li>
                          <li>• Increase Frequency (1-2 Hz) if Delta P minimal</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weaning Protocol */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <p className="font-semibold text-green-800 dark:text-green-200 mb-2">Weaning in HFO</p>
              <ol className="text-xs space-y-2 list-decimal pl-4">
                <li>
                  <strong>Reduce FiO2 to &lt;40%</strong> before weaning MAP
                  <p className="text-muted-foreground text-[10px]">(except when over-inflation is evident)</p>
                </li>
                <li>
                  <strong>Reduce MAP</strong> when chest radiograph shows evidence of over-inflation (&gt;9 ribs)
                </li>
                <li>
                  In <strong>air leak syndromes</strong> (low volume strategy), reducing MAP takes priority over weaning FiO2
                </li>
                <li>
                  <strong>Discontinue weaning</strong> when:
                  <div className="mt-1 p-2 bg-white dark:bg-gray-900 rounded">
                    <p>MAP: <strong>8-10 cmH2O</strong></p>
                    <p>Amplitude: <strong>20-25</strong></p>
                  </div>
                </li>
                <li>
                  If infant is stable, oxygenating well and blood gases are satisfactory:
                  <p className="text-green-700 dark:text-green-300 mt-1">→ Extubate to CPAP or switch to conventional ventilation</p>
                  <p className="text-amber-600 text-[10px] mt-1">Discuss with consultant</p>
                </li>
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
              <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Troubleshooting</p>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-red-600">Hypoxia</p>
                  <p className="text-muted-foreground">1. ↑ FiO2 → 2. ↑ MAP by 1 cmH2O → 3. CXR if persists</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-amber-600">Hypercarbia</p>
                  <p className="text-muted-foreground">1. Check oscillation → 2. Suction ETT → 3. ↑ Amplitude 2-4 → 4. ↓ Frequency</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-blue-600">Hypotension</p>
                  <p className="text-muted-foreground">1. Assess volume → 2. Fluid/inotrope → 3. ↓ MAP if hyperexpanded</p>
                </div>
              </div>
            </div>

            {/* Key Points */}
            <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200">
              <p className="font-semibold text-teal-800 dark:text-teal-200 mb-2">Key Points</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>MAP controls oxygenation, Delta P controls ventilation</li>
                <li>Aim for visible chest oscillations ("wiggle" down to umbilicus)</li>
                <li>Monitor CXR for over-inflation (&gt;9 ribs = over-inflated)</li>
                <li>Goal lung volume: 8-9 ribs on CXR</li>
                <li>Always wean FiO2 before MAP unless over-inflated</li>
              </ul>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default MechanicalVentilationApproach;
