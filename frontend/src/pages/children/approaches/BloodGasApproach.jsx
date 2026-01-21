/**
 * Blood Gas Reading Approach Component
 * Interactive flowchart for arterial blood gas interpretation
 * Includes pH assessment, compensation analysis, and differential diagnosis
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import Section from "./Section";

// Expandable flowchart node component
const FlowNode = ({ title, children, color = "blue", defaultOpen = false, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    red: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    amber: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    purple: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
    teal: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800",
    gray: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  };

  const titleColors = {
    blue: "text-blue-800 dark:text-blue-200",
    green: "text-green-800 dark:text-green-200",
    red: "text-red-800 dark:text-red-200",
    amber: "text-amber-800 dark:text-amber-200",
    purple: "text-purple-800 dark:text-purple-200",
    teal: "text-teal-800 dark:text-teal-200",
    gray: "text-gray-800 dark:text-gray-200",
  };

  return (
    <div className={`border rounded-lg ${colorClasses[color]} ${level > 0 ? 'ml-4' : ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between text-left"
      >
        <span className={`font-semibold text-sm ${titleColors[color]}`}>{title}</span>
        {children && (
          isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {isOpen && children && (
        <div className="px-3 pb-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

// Info box component
const InfoBox = ({ title, items, color = "gray" }) => {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/40 border-blue-300",
    green: "bg-green-100 dark:bg-green-900/40 border-green-300",
    red: "bg-red-100 dark:bg-red-900/40 border-red-300",
    amber: "bg-amber-100 dark:bg-amber-900/40 border-amber-300",
    gray: "bg-gray-100 dark:bg-gray-800 border-gray-300",
  };

  return (
    <div className={`p-2 rounded border ${colorClasses[color]}`}>
      {title && <p className="font-semibold text-xs mb-1">{title}</p>}
      <ul className="text-[10px] text-muted-foreground space-y-0.5">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
};

const BloodGasApproach = ({ weight, expandedSections, toggleSection }) => {
  const [ph, setPh] = useState("");
  const [pco2, setPco2] = useState("");
  const [hco3, setHco3] = useState("");
  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [albumin, setAlbumin] = useState("4");

  const phVal = parseFloat(ph) || 0;
  const pco2Val = parseFloat(pco2) || 0;
  const hco3Val = parseFloat(hco3) || 0;
  const naVal = parseFloat(na) || 0;
  const clVal = parseFloat(cl) || 0;
  const albVal = parseFloat(albumin) || 4;

  // Calculate Anion Gap
  const anionGap = naVal && clVal && hco3Val ? naVal - clVal - hco3Val : null;
  
  // Corrected AG for albumin (for every 1 g/dL decrease in albumin, add 2.5 to AG)
  const correctedAG = anionGap !== null ? anionGap + (2.5 * (4 - albVal)) : null;
  
  // Delta ratio for mixed disorders
  const deltaAG = correctedAG !== null ? correctedAG - 12 : null;
  const deltaHCO3 = 24 - hco3Val;
  const deltaRatio = deltaAG && deltaHCO3 ? deltaAG / deltaHCO3 : null;

  // Primary disorder determination
  const getPrimaryDisorder = () => {
    if (!phVal || !pco2Val || !hco3Val) return null;
    
    if (phVal < 7.35) {
      // Acidemia
      if (hco3Val < 22) return { type: "Metabolic Acidosis", primary: "metabolic" };
      if (pco2Val > 45) return { type: "Respiratory Acidosis", primary: "respiratory" };
    } else if (phVal > 7.45) {
      // Alkalemia
      if (hco3Val > 26) return { type: "Metabolic Alkalosis", primary: "metabolic" };
      if (pco2Val < 35) return { type: "Respiratory Alkalosis", primary: "respiratory" };
    } else {
      // Normal pH - could be compensated or mixed
      if (hco3Val < 22 && pco2Val < 35) return { type: "Compensated Metabolic Acidosis", primary: "metabolic" };
      if (hco3Val > 26 && pco2Val > 45) return { type: "Compensated Metabolic Alkalosis", primary: "metabolic" };
      if (pco2Val > 45 && hco3Val > 26) return { type: "Compensated Respiratory Acidosis", primary: "respiratory" };
      if (pco2Val < 35 && hco3Val < 22) return { type: "Compensated Respiratory Alkalosis", primary: "respiratory" };
    }
    return { type: "Normal or Mixed Disorder", primary: null };
  };

  // Expected compensation calculations
  const getExpectedCompensation = () => {
    const disorder = getPrimaryDisorder();
    if (!disorder || !disorder.primary) return null;

    let expected = {};
    
    if (disorder.type === "Metabolic Acidosis") {
      // Winter's formula: Expected pCO2 = 1.5 × HCO3 + 8 ± 2
      const expectedPCO2 = 1.5 * hco3Val + 8;
      expected = {
        formula: "Winter's Formula",
        calculation: `1.5 × ${hco3Val} + 8 = ${expectedPCO2.toFixed(1)}`,
        expectedValue: expectedPCO2,
        range: `${(expectedPCO2 - 2).toFixed(1)} - ${(expectedPCO2 + 2).toFixed(1)}`,
        actual: pco2Val,
        interpretation: pco2Val < expectedPCO2 - 2 
          ? "Mixed with Respiratory Alkalosis" 
          : pco2Val > expectedPCO2 + 2 
            ? "Mixed with Respiratory Acidosis" 
            : "Appropriately Compensated"
      };
    } else if (disorder.type === "Metabolic Alkalosis") {
      // Expected pCO2 = 0.7 × HCO3 + 21 (or increase by 0.7 for every 1 mEq/L increase in HCO3)
      const expectedPCO2 = 0.7 * hco3Val + 21;
      expected = {
        formula: "Expected pCO2 = 0.7 × HCO3 + 21",
        calculation: `0.7 × ${hco3Val} + 21 = ${expectedPCO2.toFixed(1)}`,
        expectedValue: expectedPCO2,
        range: `${(expectedPCO2 - 5).toFixed(1)} - ${(expectedPCO2 + 5).toFixed(1)}`,
        actual: pco2Val,
        interpretation: pco2Val < expectedPCO2 - 5 
          ? "Mixed with Respiratory Alkalosis" 
          : pco2Val > expectedPCO2 + 5 
            ? "Mixed with Respiratory Acidosis" 
            : "Appropriately Compensated"
      };
    } else if (disorder.type === "Respiratory Acidosis") {
      // Acute: HCO3 increases by 1 for every 10 mmHg rise in pCO2
      // Chronic: HCO3 increases by 3.5 for every 10 mmHg rise in pCO2
      const acuteHCO3 = 24 + ((pco2Val - 40) / 10) * 1;
      const chronicHCO3 = 24 + ((pco2Val - 40) / 10) * 3.5;
      expected = {
        formula: "Acute vs Chronic",
        acute: `Acute: 24 + (${pco2Val}-40)/10 × 1 = ${acuteHCO3.toFixed(1)}`,
        chronic: `Chronic: 24 + (${pco2Val}-40)/10 × 3.5 = ${chronicHCO3.toFixed(1)}`,
        actual: hco3Val,
        interpretation: hco3Val < acuteHCO3 - 2 
          ? "Mixed with Metabolic Acidosis" 
          : hco3Val > chronicHCO3 + 2 
            ? "Mixed with Metabolic Alkalosis" 
            : hco3Val <= acuteHCO3 + 2 
              ? "Acute (or Mixed with Metabolic Acidosis)"
              : "Chronic"
      };
    } else if (disorder.type === "Respiratory Alkalosis") {
      // Acute: HCO3 decreases by 2 for every 10 mmHg fall in pCO2
      // Chronic: HCO3 decreases by 5 for every 10 mmHg fall in pCO2
      const acuteHCO3 = 24 - ((40 - pco2Val) / 10) * 2;
      const chronicHCO3 = 24 - ((40 - pco2Val) / 10) * 5;
      expected = {
        formula: "Acute vs Chronic",
        acute: `Acute: 24 - (40-${pco2Val})/10 × 2 = ${acuteHCO3.toFixed(1)}`,
        chronic: `Chronic: 24 - (40-${pco2Val})/10 × 5 = ${chronicHCO3.toFixed(1)}`,
        actual: hco3Val,
        interpretation: hco3Val > acuteHCO3 + 2 
          ? "Mixed with Metabolic Alkalosis" 
          : hco3Val < chronicHCO3 - 2 
            ? "Mixed with Metabolic Acidosis" 
            : hco3Val >= chronicHCO3 - 2 
              ? "Chronic"
              : "Acute"
      };
    }
    
    return expected;
  };

  const disorder = getPrimaryDisorder();
  const compensation = getExpectedCompensation();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Blood Gas Reading</CardTitle>
        <CardDescription className="text-xs">Systematic ABG interpretation with flowchart approach</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* ABG Input Section */}
        <Section id="abg-input" title="Enter Blood Gas Values" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">pH</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  placeholder="7.40"
                  className="h-8 text-sm mt-1"
                  min="0"
                  data-testid="abg-ph-input"
                />
              </div>
              <div>
                <Label className="text-xs">pCO₂ (mmHg)</Label>
                <Input
                  type="number"
                  value={pco2}
                  onChange={(e) => setPco2(e.target.value)}
                  placeholder="40"
                  className="h-8 text-sm mt-1"
                  min="0"
                  data-testid="abg-pco2-input"
                />
              </div>
              <div>
                <Label className="text-xs">HCO₃⁻ (mEq/L)</Label>
                <Input
                  type="number"
                  value={hco3}
                  onChange={(e) => setHco3(e.target.value)}
                  placeholder="24"
                  className="h-8 text-sm mt-1"
                  min="0"
                  data-testid="abg-hco3-input"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Na⁺ (mEq/L)</Label>
                <Input
                  type="number"
                  value={na}
                  onChange={(e) => setNa(e.target.value)}
                  placeholder="140"
                  className="h-8 text-sm mt-1"
                  min="0"
                  data-testid="abg-na-input"
                />
              </div>
              <div>
                <Label className="text-xs">Cl⁻ (mEq/L)</Label>
                <Input
                  type="number"
                  value={cl}
                  onChange={(e) => setCl(e.target.value)}
                  placeholder="102"
                  className="h-8 text-sm mt-1"
                  min="0"
                  data-testid="abg-cl-input"
                />
              </div>
              <div>
                <Label className="text-xs">Albumin (g/dL)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={albumin}
                  onChange={(e) => setAlbumin(e.target.value)}
                  placeholder="4.0"
                  className="h-8 text-sm mt-1"
                  min="0"
                  data-testid="abg-albumin-input"
                />
              </div>
            </div>

            {/* Calculated Values */}
            {anionGap !== null && (
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Anion Gap (Na - Cl - HCO₃):</span>
                  <span className={`font-bold ${anionGap > 12 ? 'text-red-600' : 'text-green-600'}`}>
                    {anionGap.toFixed(1)} mEq/L {anionGap > 12 ? '(High)' : '(Normal)'}
                  </span>
                </div>
                {albVal !== 4 && (
                  <div className="flex justify-between">
                    <span>Corrected AG (for albumin {albVal}):</span>
                    <span className={`font-bold ${correctedAG > 12 ? 'text-red-600' : 'text-green-600'}`}>
                      {correctedAG.toFixed(1)} mEq/L
                    </span>
                  </div>
                )}
                {correctedAG > 12 && deltaRatio && (
                  <div className="flex justify-between">
                    <span>Delta Ratio (ΔAG/ΔHCO₃):</span>
                    <span className="font-bold">
                      {deltaRatio.toFixed(2)} 
                      {deltaRatio < 1 ? ' (Mixed HAGMA + NAGMA)' : deltaRatio > 2 ? ' (Mixed HAGMA + Met Alkalosis)' : ' (Pure HAGMA)'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Primary Disorder Result */}
            {disorder && (
              <div className={`p-3 rounded-lg border ${
                disorder.type.includes('Acidosis') ? 'bg-red-50 dark:bg-red-950/30 border-red-200' :
                disorder.type.includes('Alkalosis') ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200' :
                'bg-gray-50 dark:bg-gray-800 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {disorder.type.includes('Acidosis') ? 
                    <AlertTriangle className="w-4 h-4 text-red-600" /> :
                    disorder.type.includes('Alkalosis') ?
                    <AlertTriangle className="w-4 h-4 text-blue-600" /> :
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  }
                  <span className="font-bold text-sm">{disorder.type}</span>
                </div>
                
                {compensation && (
                  <div className="text-xs space-y-1 mt-2 pt-2 border-t border-current/10">
                    <p className="font-semibold">Compensation Analysis:</p>
                    <p className="text-muted-foreground">{compensation.formula}</p>
                    {compensation.calculation && <p className="font-mono text-[10px]">{compensation.calculation}</p>}
                    {compensation.acute && <p className="font-mono text-[10px]">{compensation.acute}</p>}
                    {compensation.chronic && <p className="font-mono text-[10px]">{compensation.chronic}</p>}
                    <p className="font-semibold mt-1">
                      → {compensation.interpretation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Normal Values Reference */}
            <div className="text-[10px] p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold mb-1">Normal Values:</p>
              <p className="text-muted-foreground">
                pH: 7.35-7.45 • pCO₂: 35-45 mmHg • HCO₃⁻: 22-26 mEq/L • AG: 8-12 mEq/L
              </p>
            </div>
          </div>
        </Section>

        {/* Step 1: pH Assessment */}
        <Section id="abg-ph" title="Step 1: Assess pH" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <FlowNode title="pH < 7.35 → ACIDEMIA" color="red" defaultOpen={true}>
                <p className="text-xs text-muted-foreground mb-2">
                  Look for 1ry disorder: Is HCO₃⁻ low → Metabolic, or pCO₂ high → Respiratory?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <FlowNode title="Low HCO₃⁻ (< 22)" color="red" level={1}>
                    <p className="text-xs font-bold text-red-700">→ Metabolic Acidosis</p>
                  </FlowNode>
                  <FlowNode title="High pCO₂ (> 45)" color="amber" level={1}>
                    <p className="text-xs font-bold text-amber-700">→ Respiratory Acidosis</p>
                  </FlowNode>
                </div>
              </FlowNode>
              
              <FlowNode title="pH > 7.45 → ALKALEMIA" color="blue" defaultOpen={true}>
                <p className="text-xs text-muted-foreground mb-2">
                  Look for 1ry disorder: Is HCO₃⁻ high → Metabolic, or pCO₂ low → Respiratory?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <FlowNode title="High HCO₃⁻ (> 26)" color="blue" level={1}>
                    <p className="text-xs font-bold text-blue-700">→ Metabolic Alkalosis</p>
                  </FlowNode>
                  <FlowNode title="Low pCO₂ (< 35)" color="teal" level={1}>
                    <p className="text-xs font-bold text-teal-700">→ Respiratory Alkalosis</p>
                  </FlowNode>
                </div>
              </FlowNode>
            </div>

            {/* Primary Rule */}
            <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded border border-teal-200 text-xs">
              <p className="font-bold text-teal-800 dark:text-teal-200">
                1ry Respiratory = pH & pCO₂ opposite directions
              </p>
              <p className="font-bold text-red-800 dark:text-red-200 mt-1">
                1ry Metabolic = pH & pCO₂ & HCO₃⁻ same direction
              </p>
            </div>
          </div>
        </Section>

        {/* Step 2: Compensation */}
        <Section id="abg-compensation" title="Step 2: Check Compensation" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border p-2 text-left">1ry Disturbance</th>
                    <th className="border p-2 text-center">Change</th>
                    <th className="border p-2 text-center">Compensatory Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-semibold text-red-700">Metabolic Acidosis</td>
                    <td className="border p-2 text-center">↓ HCO₃⁻</td>
                    <td className="border p-2 text-center">↓ pCO₂</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td className="border p-2 font-semibold text-blue-700">Metabolic Alkalosis</td>
                    <td className="border p-2 text-center">↑ HCO₃⁻</td>
                    <td className="border p-2 text-center">↑ pCO₂ (0.7)</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold text-amber-700">Acute Resp Acidosis</td>
                    <td className="border p-2 text-center">↑ pCO₂ (10)</td>
                    <td className="border p-2 text-center">↑ HCO₃⁻ (1)</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td className="border p-2 font-semibold text-amber-700">Chronic Resp Acidosis</td>
                    <td className="border p-2 text-center">↑ pCO₂ (10)</td>
                    <td className="border p-2 text-center">↑ HCO₃⁻ (4)</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold text-teal-700">Acute Resp Alkalosis</td>
                    <td className="border p-2 text-center">↓ pCO₂ (10)</td>
                    <td className="border p-2 text-center">↓ HCO₃⁻ (2)</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td className="border p-2 font-semibold text-teal-700">Chronic Resp Alkalosis</td>
                    <td className="border p-2 text-center">↓ pCO₂ (10)</td>
                    <td className="border p-2 text-center">↓ HCO₃⁻ (5)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Winter's Formula */}
            <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 text-xs">
              <p className="font-bold text-red-800">Winter's Formula (for Metabolic Acidosis):</p>
              <p className="font-mono mt-1">Expected pCO₂ = (1.5 × HCO₃⁻) + 8 ± 2</p>
              <ul className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                <li>• Measured pCO₂ = Expected → Pure Metabolic Acidosis</li>
                <li>• Measured pCO₂ &gt; Expected → Mixed with Respiratory Acidosis</li>
                <li>• Measured pCO₂ &lt; Expected → Mixed with Respiratory Alkalosis</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Step 3: Metabolic Acidosis - Anion Gap */}
        <Section id="abg-anion-gap" title="Step 3: Metabolic Acidosis → Anion Gap" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
              <p className="font-bold">Anion Gap = Na⁺ - (Cl⁻ + HCO₃⁻)</p>
              <p className="text-muted-foreground mt-1">Normal: 8-12 mEq/L</p>
              <p className="text-[10px] text-amber-600 mt-1">
                Correct AG for albumin: Add 2.5 for every 1 g/dL below 4
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* High Anion Gap */}
              <FlowNode title="High AG (> 12) - HAGMA" color="red" defaultOpen={true}>
                <div className="text-xs">
                  <p className="font-bold text-red-700 mb-2">MUDPILES</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>• <strong>M</strong>ethanol</li>
                    <li>• <strong>U</strong>remia</li>
                    <li>• <strong>D</strong>KA</li>
                    <li>• <strong>P</strong>araldehyde / <strong>P</strong>ropylene glycol</li>
                    <li>• <strong>I</strong>nborn Errors / <strong>I</strong>soniazid</li>
                    <li>• <strong>L</strong>actic Acidosis</li>
                    <li>• <strong>E</strong>thylene Glycol</li>
                    <li>• <strong>S</strong>alicylates</li>
                  </ul>
                </div>
              </FlowNode>

              {/* Normal Anion Gap */}
              <FlowNode title="Normal AG - NAGMA" color="amber" defaultOpen={true}>
                <div className="text-xs">
                  <p className="font-bold text-amber-700 mb-2">USED CARP</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>• <strong>U</strong>reterostomy</li>
                    <li>• <strong>S</strong>mall bowel fistula</li>
                    <li>• <strong>E</strong>xtra Chloride</li>
                    <li>• <strong>D</strong>iarrhea</li>
                    <li>• <strong>C</strong>arbonic anhydrase inhibitors</li>
                    <li>• <strong>A</strong>ddison's disease</li>
                    <li>• <strong>R</strong>enal tubular acidosis</li>
                    <li>• <strong>P</strong>ancreatic fistulas</li>
                  </ul>
                  <p className="text-[10px] mt-2 font-semibold">Treatment: Replace Bicarbonate</p>
                </div>
              </FlowNode>
            </div>

            {/* Delta Ratio */}
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 text-xs">
              <p className="font-bold text-purple-800">Delta Ratio (for HAGMA):</p>
              <p className="font-mono mt-1">= (Calculated AG - 12) / (24 - Measured HCO₃⁻)</p>
              <ul className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                <li>• &lt; 1 = Mixed HAGMA + NAGMA</li>
                <li>• 1-2 = Pure HAGMA</li>
                <li>• &gt; 2 = Mixed HAGMA + Metabolic Alkalosis</li>
              </ul>
              <p className="text-[10px] mt-2 text-purple-600">
                In HAGMA, there is always no change in Cl⁻. In Lactic Acidosis, avg delta ratio 1.6. In DKA, avg delta ratio closer to 1 (due to urine ketone loss).
              </p>
            </div>

            {/* HAGMA with Osmolar Gap */}
            <FlowNode title="HAGMA + High Osmolar Gap" color="purple">
              <div className="text-xs space-y-2">
                <p className="text-muted-foreground">High or Lactic Acid without other osmoles contributing</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white dark:bg-gray-900 rounded border">
                    <p className="font-semibold">High LA (L-Lactic Acid)</p>
                    <p className="text-[10px] text-red-600 font-bold mt-1">Type A - Impaired tissue oxygenation:</p>
                    <p className="text-[10px] text-muted-foreground">Shock, Cardiac failure, Sepsis</p>
                    <p className="text-[10px] text-blue-600 font-bold mt-1">Type B - Mitochondrial dysfunction:</p>
                    <p className="text-[10px] text-muted-foreground">Drug-induced (Zidovudine, Metformin, Propofol), Tumor-induced, Alcoholism, Metabolic disease</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-900 rounded border">
                    <p className="font-semibold">Normal LA (D-Lactic Acid)</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Seen in Short bowel and Malabsorption. <strong>Not</strong> measured by lab, accumulates more quickly and persists longer.
                    </p>
                  </div>
                </div>
              </div>
            </FlowNode>

            {/* Urine Anion Gap for NAGMA */}
            <FlowNode title="NAGMA → Calculate Urine AG" color="amber">
              <div className="text-xs space-y-2">
                <p className="font-mono">Urine AG = Urine (Na⁺ + K⁺) - Urine Cl⁻</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-300">
                    <p className="font-semibold text-red-800">UAG Positive (+Ve)</p>
                    <p className="font-bold text-red-700">→ Renal losses</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      RTA (Distal RTA type 1 or 4) → Check serum K and Urinary pH
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Drugs: Acetazolamide, Amphotericin B → Proximal tubule
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded border border-green-300">
                    <p className="font-semibold text-green-800">UAG Negative (-Ve)</p>
                    <p className="font-bold text-green-700">→ Extrarenal losses</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      GI causes: Diarrhea, Fistulas → Low K
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Others: Sodium infusion, Proximal RTA, Organic acid, TPN, Hyperalimentation → Low K
                    </p>
                  </div>
                </div>
              </div>
            </FlowNode>
          </div>
        </Section>

        {/* Step 4: Metabolic Alkalosis */}
        <Section id="abg-met-alk" title="Step 4: Metabolic Alkalosis Approach" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 text-xs">
              <p className="font-bold text-blue-800">First: Check Urine Chloride (UCl)</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Chloride Responsive */}
              <FlowNode title="UCl < 10 mEq/L → Chloride Responsive" color="green" defaultOpen={true}>
                <div className="text-xs space-y-1">
                  <ul className="text-muted-foreground">
                    <li>• Vomiting & NGT aspirate</li>
                    <li>• Diuretics</li>
                    <li>• After Hypercapnia</li>
                    <li>• Cystic Fibrosis (CF)</li>
                  </ul>
                  <p className="text-green-700 font-bold mt-2">→ Give saline (responds to volume)</p>
                </div>
              </FlowNode>

              {/* Chloride Resistant */}
              <FlowNode title="UCl > 10 mEq/L → Chloride Resistant" color="red" defaultOpen={true}>
                <div className="text-xs">
                  <p className="text-muted-foreground mb-2">Check Blood Pressure:</p>
                  <FlowNode title="No HTN" color="amber" level={1}>
                    <ul className="text-[10px] text-muted-foreground">
                      <li>• Bartter syndrome</li>
                      <li>• Gitelman syndrome</li>
                      <li>• Surreptitious syndrome</li>
                    </ul>
                  </FlowNode>
                  <FlowNode title="With HTN" color="red" level={1}>
                    <ul className="text-[10px] text-muted-foreground">
                      <li>• Exogenous steroids</li>
                      <li>• Endogenous steroids</li>
                      <li>• 1ry Aldosteronism</li>
                      <li>• Cushing syndrome</li>
                      <li>• 11-OH deficiency</li>
                      <li>• Liddle syndrome</li>
                    </ul>
                  </FlowNode>
                </div>
              </FlowNode>
            </div>

            {/* Detailed Metabolic Alkalosis Flowchart */}
            <FlowNode title="Detailed Metabolic Alkalosis Approach (Serum Cl)" color="blue">
              <div className="text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Low Serum Cl */}
                  <div className="p-2 bg-white dark:bg-gray-900 rounded border">
                    <p className="font-semibold">Low Serum Cl → Check BP</p>
                    <div className="mt-2 space-y-2">
                      <div className="p-1 bg-red-50 dark:bg-red-900/30 rounded">
                        <p className="font-bold text-red-700">HIGH BP → Renin & Aldosterone</p>
                        <ul className="text-[10px] text-muted-foreground mt-1">
                          <li>• All high → RAS</li>
                          <li>• All low → Liddle, CAH 11BH, Cushing</li>
                          <li>• Low R & High Aldo → Conn syndrome, Adrenal Tumor</li>
                        </ul>
                      </div>
                      <div className="p-1 bg-amber-50 dark:bg-amber-900/30 rounded">
                        <p className="font-bold text-amber-700">Normal BP → Urine Cl</p>
                        <ul className="text-[10px] text-muted-foreground mt-1">
                          <li>• High &gt;20 → Bartter & Gitelman (with high R & A)</li>
                          <li>• Nl &lt;10 → Pseudobartter skin, CF, Excessive sweating</li>
                          <li>• Nl &lt;10 GIT → Pyloric stenosis, Excessive vomiting, NGT suction, Chloride diarrhea, Laxative abuse</li>
                          <li>• Nl &lt;10 Renal → Loop diuretic use</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* Normal Serum Cl */}
                  <div className="p-2 bg-white dark:bg-gray-900 rounded border">
                    <p className="font-semibold">Normal Serum Cl</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      → Exogenous HCO₃⁻ administration
                    </p>
                  </div>
                </div>
              </div>
            </FlowNode>
          </div>
        </Section>

        {/* Quick Reference */}
        <Section id="abg-ref" title="Quick Reference Rules" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded border border-teal-200">
              <p className="font-bold text-teal-800">Box Rule: 1ry Respiratory</p>
              <p className="font-mono mt-1">pH & pCO₂ = HCO₃⁻</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                For every 10 increase in pCO₂, there is 1 decrease in HCO₃⁻
              </p>
            </div>

            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200">
              <p className="font-bold text-amber-800">Respiratory Notes:</p>
              <ul className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                <li>• ΔpCO₂ = Difference between higher and lower value Normal paCO₂ (40) - measured paCO₂</li>
                <li>• 24 in the equation is Normal HCO₃⁻</li>
                <li>• For every 1 mEq/L increase in HCO₃⁻, there is 0.7 increase in pCO₂</li>
              </ul>
            </div>

            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200">
              <p className="font-bold text-purple-800">Respiratory Compensation Equations:</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                <div>
                  <p className="font-semibold">Acute Respiratory Acidosis</p>
                  <p className="text-muted-foreground">(ΔpaCO₂)/10 × 1 + 24</p>
                </div>
                <div>
                  <p className="font-semibold">Chronic Respiratory Acidosis</p>
                  <p className="text-muted-foreground">(ΔpaCO₂)/10 × 4 + 24</p>
                </div>
                <div>
                  <p className="font-semibold">Acute Respiratory Alkalosis</p>
                  <p className="text-muted-foreground">(ΔpaCO₂)/10 × 2 - 24</p>
                </div>
                <div>
                  <p className="font-semibold">Chronic Respiratory Alkalosis</p>
                  <p className="text-muted-foreground">(ΔpaCO₂)/10 × 5 - 24</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Bottom Quick Reference */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border text-center">
          <p className="font-bold text-sm mb-2">⚡ ABG QUICK APPROACH</p>
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-amber-600">Step 1</p>
              <p>Check pH</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-blue-600">Step 2</p>
              <p>1ry Disorder</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-green-600">Step 3</p>
              <p>Compensation</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-purple-600">Step 4</p>
              <p>AG if Acidosis</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default BloodGasApproach;
