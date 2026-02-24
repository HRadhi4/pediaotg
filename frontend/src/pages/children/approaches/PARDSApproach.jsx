/**
 * PARDS (Pediatric Acute Respiratory Distress Syndrome) Approach Component
 * Based on PALICC guidelines
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "./Section";

const PARDSApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;
  
  // Calculator states
  const [fio2, setFio2] = useState("");
  const [map, setMap] = useState("");
  const [pao2, setPao2] = useState("");
  const [spo2, setSpo2] = useState("");
  
  // Calculate OI and OSI
  const calculateOI = () => {
    const f = parseFloat(fio2) || 0;
    const m = parseFloat(map) || 0;
    const p = parseFloat(pao2) || 0;
    if (f > 0 && m > 0 && p > 0) {
      return ((f * m * 100) / p).toFixed(1);
    }
    return null;
  };
  
  const calculateOSI = () => {
    const f = parseFloat(fio2) || 0;
    const m = parseFloat(map) || 0;
    const s = parseFloat(spo2) || 0;
    if (f > 0 && m > 0 && s > 0 && s <= 97) {
      return ((f * m * 100) / s).toFixed(1);
    }
    return null;
  };
  
  const oi = calculateOI();
  const osi = calculateOSI();
  
  // Determine severity
  const getSeverity = (oiVal, osiVal) => {
    const oiNum = parseFloat(oiVal);
    const osiNum = parseFloat(osiVal);
    
    if (oiNum >= 16 || osiNum > 12.3) return { level: "Severe", color: "red" };
    if ((oiNum >= 8 && oiNum < 16) || (osiNum >= 7.5 && osiNum <= 12.3)) return { level: "Moderate", color: "amber" };
    if ((oiNum >= 4 && oiNum < 8) || (osiNum >= 5 && osiNum < 7.5)) return { level: "Mild", color: "yellow" };
    return { level: "Not PARDS", color: "green" };
  };
  
  const severity = getSeverity(oi, osi);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">PARDS - Pediatric Acute Respiratory Distress Syndrome</CardTitle>
        <CardDescription className="text-xs">PALICC Guidelines for diagnosis and management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* OI/OSI Calculator */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
          <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-2">Oxygenation Index Calculator</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <Label className="text-[10px]">FiO2 (0.21-1.0)</Label>
              <Input
                type="number"
                  inputMode="decimal"
                step="0.01"
                min="0.21"
                max="1.0"
                placeholder="0.6"
                value={fio2}
                onChange={(e) => setFio2(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px]">MAP (cmH2O)</Label>
              <Input
                type="number"
                  inputMode="decimal"
                step="1"
                min="0"
                placeholder="15"
                value={map}
                onChange={(e) => setMap(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px]">PaO2 (mmHg)</Label>
              <Input
                type="number"
                  inputMode="decimal"
                step="1"
                min="0"
                placeholder="60"
                value={pao2}
                onChange={(e) => setPao2(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px]">SpO2 (%) - if no ABG</Label>
              <Input
                type="number"
                  inputMode="decimal"
                step="1"
                min="0"
                max="100"
                placeholder="92"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          
          {/* Results */}
          {(oi || osi) && (
            <div className={`mt-3 p-2 rounded bg-${severity.color}-100 dark:bg-${severity.color}-900/30 border border-${severity.color}-300`}>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  {oi && <p className="text-xs font-mono">OI = (FiO2 × MAP × 100) / PaO2 = <strong>{oi}</strong></p>}
                  {osi && <p className="text-xs font-mono">OSI = (FiO2 × MAP × 100) / SpO2 = <strong>{osi}</strong></p>}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold bg-${severity.color}-200 text-${severity.color}-800`}>
                  {severity.level}
                </div>
              </div>
            </div>
          )}
          
          <p className="text-[10px] text-muted-foreground mt-2">* OSI valid only when SpO2 ≤ 97%</p>
        </div>

        {/* PALICC Definition */}
        <Section id="pards-definition" title="PALICC Definition of PARDS" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Timing</p>
              <p className="text-muted-foreground">Within 7 days of a known clinical insult</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Chest Imaging</p>
              <p className="text-muted-foreground">New infiltrate(s) consistent with pulmonary parenchymal disease</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Origin of Edema</p>
              <p className="text-muted-foreground">Not explained by acute left ventricular failure or fluid overload</p>
            </div>
            
            {/* Severity Table */}
            <div className="mt-2 border rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-left">Severity</th>
                    <th className="p-2 text-center">OI</th>
                    <th className="p-2 text-center">OSI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                    <td className="p-2 font-medium">Mild</td>
                    <td className="p-2 text-center">4 ≤ OI &lt; 8</td>
                    <td className="p-2 text-center">5 ≤ OSI &lt; 7.5</td>
                  </tr>
                  <tr className="bg-amber-50 dark:bg-amber-900/20">
                    <td className="p-2 font-medium">Moderate</td>
                    <td className="p-2 text-center">8 ≤ OI &lt; 16</td>
                    <td className="p-2 text-center">7.5 ≤ OSI ≤ 12.3</td>
                  </tr>
                  <tr className="bg-red-50 dark:bg-red-900/20">
                    <td className="p-2 font-medium">Severe</td>
                    <td className="p-2 text-center">OI ≥ 16</td>
                    <td className="p-2 text-center">OSI &gt; 12.3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Common Etiologies */}
        <Section id="pards-etiology" title="Common Etiologies" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span>Pneumonia/LRTI</span>
              <span className="font-bold text-red-600">67%</span>
            </div>
            <div className="flex justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <span>Sepsis</span>
              <span className="font-bold text-amber-600">16%</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span>Aspiration</span>
              <span className="font-bold">8%</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span>Trauma</span>
              <span className="font-bold">4%</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span>Drowning / Non-septic shock</span>
              <span className="font-bold">&lt;1-2%</span>
            </div>
          </div>
        </Section>

        {/* Lung Protective Ventilation */}
        <Section id="pards-ventilation" title="Lung Protective Ventilation" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
              <p className="font-medium">Tidal Volume</p>
              <p className="text-muted-foreground">5-8 ml/kg PBW (better compliance)</p>
              <p className="text-muted-foreground">3-6 ml/kg PBW (poor compliance)</p>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  → {(w * 5).toFixed(0)}-{(w * 8).toFixed(0)} ml (or {(w * 3).toFixed(0)}-{(w * 6).toFixed(0)} ml if poor compliance)
                </p>
              )}
            </div>
            
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border-l-4 border-amber-500">
              <p className="font-medium">Plateau Pressure</p>
              <p className="text-muted-foreground">Target: ≤ 28 cmH2O</p>
              <p className="text-muted-foreground">29-32 cmH2O acceptable if decreased chest wall compliance</p>
            </div>
            
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-500">
              <p className="font-medium">PEEP</p>
              <p className="text-muted-foreground">PALICC: 10-15 cmH2O for severe PARDS</p>
              <p className="text-muted-foreground">Titrate to oxygenation and hemodynamic response</p>
              <p className="text-xs text-amber-600 mt-1">If PEEP &gt;15, be mindful of plateau pressure limit</p>
            </div>
            
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-500">
              <p className="font-medium">Gas Exchange Targets</p>
              <div className="mt-1 space-y-1">
                <p className="text-muted-foreground"><strong>Mild PARDS:</strong> SpO2 92-97% with PEEP &lt;10</p>
                <p className="text-muted-foreground"><strong>Severe PARDS:</strong> SpO2 88-92% with PEEP &gt;10</p>
                <p className="text-muted-foreground"><strong>Permissive Hypercapnia:</strong> pH 7.15-7.30</p>
              </div>
            </div>
          </div>
        </Section>

        {/* HFOV Section */}
        <Section id="pards-hfov" title="High-Frequency Oscillatory Ventilation (HFOV)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-semibold text-red-700">When to Consider HFOV</p>
              <ul className="mt-1 text-muted-foreground space-y-0.5">
                <li>• Moderate-Severe PARDS with Plateau Pressure ≥ 28 cmH2O</li>
                <li>• PIP &gt; 30 cmH2O</li>
                <li>• FiO2 &gt; 0.6</li>
                <li>• MAP ≥ 16 cmH2O</li>
                <li>• OI &gt; 15 without improvement on conventional ventilation</li>
              </ul>
            </div>
            
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">Initial HFOV Settings</p>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                    <p className="font-medium text-[10px] text-muted-foreground">MAP</p>
                    <p>2-4 cmH2O above last CMV MAP</p>
                  </div>
                  <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                    <p className="font-medium text-[10px] text-muted-foreground">FiO2</p>
                    <p>Start at 1.0, wean as able</p>
                  </div>
                </div>
                <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-[10px] text-muted-foreground">Frequency (Hz)</p>
                  <div className="grid grid-cols-3 gap-1 mt-1 text-center">
                    <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                      <p className="text-[10px] text-muted-foreground">Preterm</p>
                      <p className="font-bold">10-13 Hz</p>
                    </div>
                    <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                      <p className="text-[10px] text-muted-foreground">Term</p>
                      <p className="font-bold">8-10 Hz</p>
                    </div>
                    <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                      <p className="text-[10px] text-muted-foreground">Children</p>
                      <p className="font-bold">6-8 Hz</p>
                    </div>
                  </div>
                </div>
                <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-[10px] text-muted-foreground">Amplitude (Delta P)</p>
                  <p>Start: ~2× MAP (20-25 cmH2O)</p>
                  <p className="text-muted-foreground">Increase by 3-5 until visible chest oscillations</p>
                </div>
                <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-[10px] text-muted-foreground">I:E Ratio</p>
                  <p><strong>1:3 (33%)</strong></p>
                </div>
              </div>
            </div>
            
            {/* HFOV Troubleshooting */}
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">HFOV Troubleshooting</p>
              <div className="mt-2 space-y-2">
                <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-red-600">Hypoxia</p>
                  <p className="text-muted-foreground">1. ↑ FiO2 → 2. ↑ MAP by 1 cmH2O → 3. CXR if persists</p>
                </div>
                <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-amber-600">Hypercarbia</p>
                  <p className="text-muted-foreground">1. Check oscillation → 2. Suction ETT → 3. ↑ Amplitude 2-4 cmH2O → 4. ↓ Frequency</p>
                </div>
                <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-blue-600">Hypotension</p>
                  <p className="text-muted-foreground">1. Assess volume → 2. Fluid/inotrope → 3. ↓ MAP if hyperexpanded</p>
                </div>
              </div>
            </div>
            
            {/* HFOV Weaning */}
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-semibold text-green-700">Weaning from HFOV</p>
              <ol className="mt-1 text-muted-foreground space-y-0.5 list-decimal list-inside">
                <li>Reduce FiO2 to &lt;0.4</li>
                <li>Reduce MAP by 1-2 cmH2O q1-2h as tolerated</li>
                <li>Wean Amplitude as MAP decreases</li>
                <li>Convert to CMV when MAP &lt;15-16 cmH2O</li>
              </ol>
            </div>
          </div>
        </Section>

        {/* Non-Ventilatory Strategies */}
        <Section id="pards-adjuncts" title="Non-Ventilatory Strategies" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Prone Positioning</p>
              <p className="text-muted-foreground">Consider in severe PARDS (not routine)</p>
              <p className="text-green-600 text-[10px]">PROSEVA: 50% mortality reduction in severe adult ARDS</p>
            </div>
            
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Neuromuscular Blockade</p>
              <p className="text-muted-foreground">Consider if sedation alone inadequate for ventilation</p>
              <p className="text-[10px] text-muted-foreground">Adult data: First 48h may improve outcomes in severe ARDS</p>
            </div>
            
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Inhaled Nitric Oxide (iNO)</p>
              <p className="text-muted-foreground">Not routine. Consider if:</p>
              <ul className="text-muted-foreground ml-2">
                <li>• Confirmed pulmonary hypertension</li>
                <li>• Severe RV dysfunction</li>
                <li>• Bridge to ECMO</li>
              </ul>
            </div>
            
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Corticosteroids</p>
              <p className="text-muted-foreground">Not recommended for routine therapy (insufficient pediatric data)</p>
            </div>
            
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium">Fluid Management</p>
              <p className="text-muted-foreground">Goal-directed: adequate intravascular volume</p>
              <p className="text-red-600 text-[10px]">Avoid positive fluid balance after initial resuscitation</p>
            </div>
          </div>
        </Section>

        {/* ECMO Indications */}
        <Section id="pards-ecmo" title="ECMO Indications" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
              <p className="font-semibold text-red-700">Consider ECMO When:</p>
              <ul className="mt-1 text-muted-foreground space-y-1">
                <li>• Sustained P/F ratio &lt;60-80 or <strong>OI &gt;40</strong></li>
                <li>• Failure despite HFOV, iNO, prone positioning</li>
                <li>• MAP &gt;20-25 cmH2O on CMV or &gt;30 cmH2O on HFOV</li>
                <li>• Hypercapnic respiratory failure with pH &lt;7.1</li>
              </ul>
            </div>
            
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Prerequisites</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• Weight &gt;2 kg</li>
                <li>• Newborn &gt;34 weeks gestation</li>
                <li>• Disease thought to be reversible</li>
                <li>• No contraindication to anticoagulation</li>
                <li>• No lethal congenital abnormalities</li>
                <li>• No irreversible organ dysfunction</li>
              </ul>
            </div>
            
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-medium text-green-700">ELSO Data (2019)</p>
              <p className="text-muted-foreground">Overall survival to discharge: <strong>60%</strong></p>
            </div>
          </div>
        </Section>

        {/* Key Points */}
        <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200">
          <p className="font-semibold text-teal-700 dark:text-teal-300 text-sm mb-2">Key Points</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use PALICC definition with OI/OSI (not Berlin P/F ratio alone)</li>
            <li>• Lung protective ventilation is paramount</li>
            <li>• Consider HFOV early for refractory hypoxemia</li>
            <li>• Permissive hypoxia (SpO2 88-92%) and hypercapnia (pH 7.15-7.30) acceptable</li>
            <li>• Avoid positive fluid balance after stabilization</li>
            <li>• ECMO is rescue therapy when other strategies fail</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PARDSApproach;
