/**
 * Mechanical Ventilation Approach Component for Children/PICU
 * Contains tabs for: General CMV, Special Considerations (ARDS/Asthma), HFOV, and Respiratory Equations
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Section from "./Section";

const MechanicalVentilationApproach = ({ weight, age, expandedSections, toggleSection }) => {
  const [activeTab, setActiveTab] = useState("general");
  const w = parseFloat(weight) || 0;
  const ageNum = parseFloat(age) || 0;

  return (
    <Card data-testid="mechanical-ventilation-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Mechanical Ventilation in PICU</CardTitle>
        <CardDescription className="text-xs">Guidelines for initiating and managing mechanical ventilation in children</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Tabs for different ventilation modes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="general" className="text-[10px] sm:text-xs px-1 py-2" data-testid="tab-general">
              General
            </TabsTrigger>
            <TabsTrigger value="special" className="text-[10px] sm:text-xs px-1 py-2" data-testid="tab-special">
              Special
            </TabsTrigger>
            <TabsTrigger value="hfov" className="text-[10px] sm:text-xs px-1 py-2" data-testid="tab-hfov">
              HFOV
            </TabsTrigger>
            <TabsTrigger value="equations" className="text-[10px] sm:text-xs px-1 py-2" data-testid="tab-equations">
              Equations
            </TabsTrigger>
          </TabsList>

          {/* General/CMV Tab */}
          <TabsContent value="general" className="mt-4 space-y-3">
            {/* Introduction */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-2">How to Initiate MV in PICU</p>
              <p className="text-xs text-muted-foreground mb-2">
                There is no one optimal mode of ventilation for any particular disease state or one single optimal method of weaning from MV but these guidelines would work if properly followed in most cases.
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Understand pathophysiology to make smart choices and decide 1st what you want to achieve:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-2">
                <li>• Choose the mode (AC or SIMV) based on patient condition and desired goals (need full control vs interactive setting)</li>
                <li>• Choose volume control, pressure control, or PRVC</li>
              </ul>
            </div>

            {/* Recommended Initial Settings */}
            <Section id="mv-initial-settings" title="Recommended Initial Settings" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="space-y-2 text-xs">
                {/* Tidal Volume */}
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">Tidal Volume (Vt)</p>
                    <p className="text-muted-foreground">6-8 cc/kg (per ideal body weight, IBW*)</p>
                  </div>
                  {w > 0 && (
                    <p className="font-mono text-blue-600 mt-1">
                      → {(w * 6).toFixed(0)}-{(w * 8).toFixed(0)} ml
                    </p>
                  )}
                </div>

                {/* Frequency */}
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">Frequency</p>
                    <div className="text-right text-muted-foreground">
                      <p>30-40/min for infants</p>
                      <p>20-30 for toddlers</p>
                      <p>12-20 for older</p>
                    </div>
                  </div>
                  {ageNum > 0 && (
                    <p className="font-mono text-green-600 mt-1">
                      → Suggested: {ageNum < 1 ? "30-40" : ageNum < 3 ? "20-30" : "12-20"}/min
                    </p>
                  )}
                </div>

                {/* FiO2 */}
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-amber-500">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">FiO2</p>
                    <p className="text-muted-foreground">1.0 (100%) and fast weaning to keep saturation &gt;93%</p>
                  </div>
                </div>

                {/* Inspiratory Time */}
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-purple-500">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-medium">Inspiratory time (Ti)</p>
                      <p className="text-[10px] text-muted-foreground">(keep I:E ratio of 1:2 to 1:3)</p>
                    </div>
                    <div className="text-right text-muted-foreground">
                      <p>0.3-0.6 sec in infants</p>
                      <p>0.6-1 sec in children</p>
                      <p>1-1.5 sec in adolescent</p>
                    </div>
                  </div>
                  {ageNum > 0 && (
                    <p className="font-mono text-purple-600 mt-1">
                      → Suggested: {ageNum < 1 ? "0.3-0.6" : ageNum < 12 ? "0.6-1" : "1-1.5"} sec
                    </p>
                  )}
                </div>

                {/* PS with SIMV */}
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-teal-500">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <p className="font-medium">PS (with SIMV)</p>
                    <div className="text-right text-muted-foreground">
                      <p>6-12 cm H2O</p>
                      <p className="text-[10px]">(smaller ET tube → larger PS)</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">e.g., use 12 cm H2O PS for 3 mm ETT, use 6 for 6 mm ETT</p>
                </div>

                {/* Important Note */}
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-300 mt-3">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    Modify the settings according to disease process & subsequent blood gases
                  </p>
                </div>

                <p className="text-[10px] text-muted-foreground mt-2">
                  *IBW: Estimated using growth chart (based on patient height)
                </p>
              </div>
            </Section>
          </TabsContent>

          {/* Special Considerations Tab */}
          <TabsContent value="special" className="mt-4 space-y-3">
            {/* ARDS */}
            <Section id="mv-ards" title="ARDS (and similar lung parenchyma diseases)" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="space-y-2 text-xs">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="p-2 bg-red-50 dark:bg-red-900/20 rounded flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Improve oxygenation by lung recruitment and protective lung strategy (high PEEP with low Vt)</span>
                  </li>
                  <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <div>
                      <span>Tidal volume 4-6 ml/kg (keep plateau pressure &lt;30)</span>
                      {w > 0 && (
                        <p className="font-mono text-blue-600 mt-1">
                          → {(w * 4).toFixed(0)}-{(w * 6).toFixed(0)} ml
                        </p>
                      )}
                    </div>
                  </li>
                  <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>PEEP increment up to 10-15 (maybe higher with caution) with high FiO2 requirement (&gt;50%)</span>
                  </li>
                  <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>Use high Mean Airway Pressure (MAP) using longer Ti</span>
                  </li>
                  <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>Could use inverse I:E ratio 1:1 or 2:1 (+deep sedation)</span>
                  </li>
                  <li className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Permissive hypercapnia (keep pH ≥ 7.2)</span>
                  </li>
                  <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>High respiratory rate without air trapping (with low Vt)</span>
                  </li>
                </ul>
              </div>
            </Section>

            {/* Asthma */}
            <Section id="mv-asthma" title="Asthma (And Similar Obstructive Diseases)" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="space-y-2 text-xs">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Slow rate (below physiologic)</span>
                  </li>
                  <li className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Long expiratory time (1:4 - 1:5 I:E ratio)</span>
                  </li>
                  <li className="p-2 bg-red-50 dark:bg-red-900/20 rounded flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Watch for air-trapping (sedate deeply/paralyze in refractory cases with air trapping caused by triggering patient)</span>
                  </li>
                  <li className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Accept higher CO2 (Permissive hypercapnia)</span>
                  </li>
                  <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>High PIP is temporarily acceptable (35-40) as long as the plateau pressure is &lt;30 cmH2O</span>
                  </li>
                </ul>
              </div>
            </Section>
          </TabsContent>

          {/* HFOV Tab */}
          <TabsContent value="hfov" className="mt-4 space-y-3">
            {/* General Principles */}
            <Section id="hfov-principles" title="HFOV General Principles" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="space-y-2 text-xs">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>A continuous positive pressure system with piston displacement of gas & active exhalation</span>
                  </li>
                  <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>Tidal volume delivered is less than anatomic dead space (1-3 ml/kg)</span>
                  </li>
                  <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>Rates of 180-900 breaths per minute (3-15 Hertz)</span>
                  </li>
                  <li className="p-2 bg-green-50 dark:bg-green-900/20 rounded flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Lower inspiratory pressures as compared to Conventional ventilation (prevents barotrauma and volutrauma)</span>
                  </li>
                </ul>
              </div>
            </Section>

            {/* Indications and Common Uses */}
            <Section id="hfov-indications" title="Main Indication & Common Uses" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Main Indication */}
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Main Indication</p>
                  <p className="text-muted-foreground mb-2">
                    Inadequate oxygenation that cannot be safely treated without potentially toxic ventilator settings with high risk of Ventilator Associated Lung Injury that can be defined by:
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Peak inspiratory pressure (PIP) &gt; 30-35 cm H2O</li>
                    <li>• FiO2 &gt; 0.60 with inability to wean it</li>
                    <li>• Mean airway pressure (Paw) &gt; 15-20 cm H2O</li>
                    <li>• Peak End Expiratory Pressure (PEEP) &gt; 10-15 cm H2O</li>
                    <li>• Oxygenation index &gt; 13-15</li>
                  </ul>
                </div>

                {/* Common Uses */}
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-700 dark:text-green-300 mb-2">Common Uses</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong>ARDS/ALI</strong> (most common use)</li>
                    <li>• Air leaks (pneumothorax, PIE)</li>
                    <li>• Persistent pulmonary hypertension (PPHN)</li>
                    <li>• Pulmonary hemorrhage</li>
                    <li>• Congenital diaphragmatic hernia</li>
                    <li>• Acute chest syndrome (SCD)</li>
                    <li>• Inadequate alveolar ventilation with respiratory acidosis</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* HFOV Settings */}
            <Section id="hfov-settings" title="HFOV Suggested Settings" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="space-y-3 text-xs">
                {/* MAP/Paw */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">MAP/Paw (cmH2O)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1 text-muted-foreground">
                      <p><strong>Purpose:</strong></p>
                      <ul className="ml-2 space-y-0.5">
                        <li>• Level of pressure held in the lung</li>
                        <li>• Supports oxygenation</li>
                        <li>• Used to optimize lung volume and alveolar surface area for gas exchange</li>
                        <li>• Recruit atelectatic alveoli</li>
                        <li>• Prevent alveoli from collapsing (de-recruitment)</li>
                        <li>• Typically obtain a chest radiograph 1 hour after initiating HFOV then Q12-24 hours</li>
                      </ul>
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      <p><strong>Settings:</strong></p>
                      <ul className="ml-2 space-y-0.5">
                        <li>• Initial MAP 2-5 cm higher than on CMV in neonates & 5-8 cm higher in children</li>
                        <li>• Monitor degree of lung expansion by CXR (diaphragm is at ~T9 on chest radiograph)</li>
                        <li>• Guard against overdistension</li>
                        <li>• Alveolar atelectasis or overdistension can result in high pulmonary vascular resistance</li>
                        <li>• For V/Q matching, ensure adequate intravascular volume & cardiac output</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Power/Amplitude */}
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                  <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Power/Amplitude/ΔP (cmH2O)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1 text-muted-foreground">
                      <p><strong>Mechanism:</strong></p>
                      <ul className="ml-2 space-y-0.5">
                        <li>• Volume of gas generated by each wave</li>
                        <li>• Inversely proportional to PaCO2</li>
                        <li>• Start amplitude in the 30's and adjust until the "wiggle" extends to the groin</li>
                      </ul>
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      <p><strong>Adjustments:</strong></p>
                      <ul className="ml-2 space-y-0.5">
                        <li>• Adjust in increments of 3 to 5 cm H2O</li>
                        <li>• Subjectively follow the wiggle</li>
                        <li>• Objectively follow PaCO2</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Frequency */}
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                  <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Frequency (Hertz)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1 text-muted-foreground">
                      <p><strong>Principles:</strong></p>
                      <ul className="ml-2 space-y-0.5">
                        <li>• Number of breaths per second</li>
                        <li>• 10 Hz = 600 breath/minutes</li>
                        <li>• Lower Hz = increased tidal volume</li>
                        <li>• Start as per table and adjust by 1 at a time if needed</li>
                      </ul>
                    </div>
                    <div className="text-muted-foreground">
                      <p><strong>Suggested Starting Frequency:</strong></p>
                      <div className="mt-2 border rounded overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                              <th className="p-2 text-left">Age Group</th>
                              <th className="p-2 text-center">Frequency</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2">Preterm Neonates</td>
                              <td className="p-2 text-center font-bold">10 to 15 Hz</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Term Neonates</td>
                              <td className="p-2 text-center font-bold">8 to 10 Hz</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Children</td>
                              <td className="p-2 text-center font-bold">6 to 8 Hz</td>
                            </tr>
                            <tr>
                              <td className="p-2">Adult</td>
                              <td className="p-2 text-center font-bold">5 to 6 Hz</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inspiratory Time */}
                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200">
                  <p className="font-semibold text-teal-700 dark:text-teal-300 mb-2">Inspiratory Time (%)</p>
                  <p className="text-muted-foreground">Set at <strong>33%</strong>, 1:2 ratio</p>
                </div>
              </div>
            </Section>

            {/* Troubleshooting and Pitfalls */}
            <Section id="hfov-troubleshooting" title="Troubleshooting & Pitfalls with HFOV" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Troubleshooting */}
                <div className="space-y-3">
                  <p className="font-semibold text-amber-700 dark:text-amber-300">Troubleshooting with HFOV</p>
                  
                  {/* Hypoxemia */}
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-500">
                    <p className="font-medium text-red-600">Hypoxemia</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Adjust FiO2</li>
                      <li>• Increase MAP (diaphragm T9 on CXR)</li>
                      <li>• Avoid overdistension (check CXRay)</li>
                      <li>• Avoid hypovolemia/hypotension</li>
                    </ul>
                  </div>

                  {/* Hypercarpia */}
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border-l-4 border-amber-500">
                    <p className="font-medium text-amber-600">Hypercarpia</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Suction Pt using inline suction</li>
                      <li>• Increase POWER to increase ventilation</li>
                      <li>• Decrease Frequency to increase tidal volume</li>
                      <li>• Deflate cuff in ETT</li>
                      <li>• Monitor for a loss in Paw with the airleak created by deflating the cuff</li>
                      <li>• Increase Bias Flow to 30-40 L/min</li>
                    </ul>
                  </div>
                </div>

                {/* Pitfalls */}
                <div className="space-y-3">
                  <p className="font-semibold text-purple-700 dark:text-purple-300">Pitfalls with HFOV</p>
                  
                  {/* Suctioning */}
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-500">
                    <p className="font-medium text-purple-600">Suctioning (ensure ETT remains patent)</p>
                    <p className="text-muted-foreground mt-1">Frequency: every 12 to 24 hours and PRN. When?</p>
                    <ul className="text-muted-foreground space-y-0.5 ml-2">
                      <li>• Decreased/absent wiggle</li>
                      <li>• Decrease in SpO2</li>
                      <li>• Increase in CO2 level</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">Avoid/minimize disconnect to suction (de-recruitment occurs quickly).</p>
                    <p className="text-muted-foreground">De-recruitment may be minimized with closed suction system.</p>
                    <p className="text-muted-foreground">Consider a sustained inflation recruitment maneuver post suctioning.</p>
                  </div>

                  {/* Sedation */}
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                    <p className="font-medium text-blue-600">Sedation</p>
                    <p className="text-muted-foreground mt-1">Deeper sedation may be required.</p>
                    <p className="text-muted-foreground">Neuromuscular blockade can be used in difficult/sensitive cases.</p>
                  </div>

                  {/* Complications */}
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-500">
                    <p className="font-medium text-red-600">Complications of HFOV</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Hypotension secondary to decreased venous return</li>
                      <li>• Pneumothorax</li>
                      <li>• ETT Obstruction from suboptimal mucus clearance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Key Goal */}
              <div className="mt-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200">
                <p className="text-xs font-medium text-teal-700 dark:text-teal-300 text-center">
                  Remember, the goal is not to achieve 'normal' PaCO2 and pH, but to minimize VALI.
                </p>
              </div>
            </Section>
          </TabsContent>

          {/* Equations Tab */}
          <TabsContent value="equations" className="mt-4 space-y-3">
            <Section id="respiratory-equations" title="Useful Respiratory Equations" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="space-y-2 text-xs">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-blue-100 dark:bg-blue-900/30">
                      <tr>
                        <th className="p-3 text-left font-semibold">Parameter</th>
                        <th className="p-3 text-left font-semibold">Equation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <td className="p-3 font-medium">Minute Ventilation</td>
                        <td className="p-3 font-mono text-muted-foreground">VE = Respiratory rate × Tidal volume</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Alveolar-arterial gradient</td>
                        <td className="p-3 font-mono text-muted-foreground">A-a gradient = PAO2 - PaO2</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <td className="p-3 font-medium">Partial Alveolar O2 pressure</td>
                        <td className="p-3 font-mono text-muted-foreground">
                          <div>PAO2 = FiO2 (PB* - 47) - 1.2 (PaCO2)</div>
                          <div className="text-[10px] mt-1">*PB = Barometric Pressure</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Oxygen Content</td>
                        <td className="p-3 font-mono text-muted-foreground">CaO2 = SaO2 × 1.34 × Hb</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <td className="p-3 font-medium">O2 extraction</td>
                        <td className="p-3 font-mono text-muted-foreground">= (CaO2 - CvO2/CaO2) × 100</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Oxygen Index</td>
                        <td className="p-3 font-mono text-muted-foreground">OI = FiO2 × MAP × 100 / PaO2</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <td className="p-3 font-medium">Common hypoxemia Index</td>
                        <td className="p-3 font-mono text-muted-foreground">
                          <div>PaO2/FiO2</div>
                          <div className="text-[10px] mt-1">(&lt; 300 in ARDS)</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MechanicalVentilationApproach;
