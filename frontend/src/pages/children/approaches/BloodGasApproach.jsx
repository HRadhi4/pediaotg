/**
 * Blood Gas Reading Approach Component
 * Interactive flowchart for arterial blood gas interpretation
 * Based on systematic flowchart approach with expandable sections
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, ArrowDown, ArrowRight } from "lucide-react";
import Section from "./Section";

// Flowchart Node component - clickable and expandable
const FlowNode = ({ 
  title, 
  children, 
  color = "blue", 
  defaultOpen = false, 
  level = 0,
  variant = "default", // "default", "rounded", "diamond"
  highlight = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700",
    green: "bg-green-100 dark:bg-green-950/50 border-green-300 dark:border-green-700",
    red: "bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-700",
    amber: "bg-amber-100 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700",
    purple: "bg-purple-100 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700",
    teal: "bg-teal-100 dark:bg-teal-950/50 border-teal-300 dark:border-teal-700",
    gray: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
    yellow: "bg-yellow-100 dark:bg-yellow-950/50 border-yellow-400 dark:border-yellow-600",
    pink: "bg-pink-100 dark:bg-pink-950/50 border-pink-300 dark:border-pink-700",
  };

  const titleColors = {
    blue: "text-blue-800 dark:text-blue-200",
    green: "text-green-800 dark:text-green-200",
    red: "text-red-800 dark:text-red-200",
    amber: "text-amber-800 dark:text-amber-200",
    purple: "text-purple-800 dark:text-purple-200",
    teal: "text-teal-800 dark:text-teal-200",
    gray: "text-gray-800 dark:text-gray-200",
    yellow: "text-yellow-800 dark:text-yellow-200",
    pink: "text-pink-800 dark:text-pink-200",
  };

  const variantClasses = {
    default: "rounded-lg",
    rounded: "rounded-full",
    diamond: "rounded-lg rotate-0",
  };

  return (
    <div className={`border-2 ${colorClasses[color]} ${variantClasses[variant]} ${level > 0 ? 'ml-4' : ''} ${highlight ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
      <button
        type="button"
        onClick={() => children && setIsOpen(!isOpen)}
        className={`w-full p-2 sm:p-3 flex items-center justify-between text-left ${children ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
      >
        <span className={`font-semibold text-xs sm:text-sm ${titleColors[color]}`}>{title}</span>
        {children && (
          isOpen ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />
        )}
      </button>
      {isOpen && children && (
        <div className="px-2 sm:px-3 pb-2 sm:pb-3 space-y-2 border-t border-current/10">
          {children}
        </div>
      )}
    </div>
  );
};

// Arrow connector component
const FlowArrow = ({ direction = "down", label = "", className = "" }) => (
  <div className={`flex ${direction === "down" ? "flex-col items-center" : "flex-row items-center"} ${className}`}>
    {direction === "down" ? (
      <>
        <div className="w-0.5 h-3 bg-gray-400"></div>
        {label && <span className="text-[9px] text-gray-600 my-0.5">{label}</span>}
        <ArrowDown className="w-3 h-3 text-gray-400" />
      </>
    ) : (
      <>
        <div className="h-0.5 w-3 bg-gray-400"></div>
        {label && <span className="text-[9px] text-gray-600 mx-0.5">{label}</span>}
        <ArrowRight className="w-3 h-3 text-gray-400" />
      </>
    )}
  </div>
);

// Simple list box for mnemonics
const MnemonicBox = ({ title, items, color = "gray", treatment = null }) => {
  const colorClasses = {
    red: "bg-red-50 dark:bg-red-950/30 border-red-200",
    amber: "bg-amber-50 dark:bg-amber-950/30 border-amber-200",
    blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200",
    green: "bg-green-50 dark:bg-green-950/30 border-green-200",
    gray: "bg-gray-50 dark:bg-gray-800 border-gray-200",
  };

  return (
    <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
      <p className="font-bold text-xs mb-1">{title}</p>
      <ul className="text-[10px] text-muted-foreground space-y-0.5">
        {items.map((item, i) => (
          <li key={i}>• <strong>{item.letter}</strong>{item.text}</li>
        ))}
      </ul>
      {treatment && (
        <p className="text-[10px] font-semibold mt-2 text-green-700 dark:text-green-400">
          Treatment: {treatment}
        </p>
      )}
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
  const correctedAG = anionGap !== null ? anionGap + (2.5 * (4 - albVal)) : null;
  const deltaAG = correctedAG !== null ? correctedAG - 12 : null;
  const deltaHCO3 = 24 - hco3Val;
  const deltaRatio = deltaAG && deltaHCO3 ? deltaAG / deltaHCO3 : null;

  // Primary disorder determination
  const getPrimaryDisorder = () => {
    if (!phVal || !pco2Val || !hco3Val) return null;
    
    if (phVal < 7.35) {
      if (hco3Val < 22) return { type: "Metabolic Acidosis", primary: "metabolic" };
      if (pco2Val > 45) return { type: "Respiratory Acidosis", primary: "respiratory" };
    } else if (phVal > 7.45) {
      if (hco3Val > 26) return { type: "Metabolic Alkalosis", primary: "metabolic" };
      if (pco2Val < 35) return { type: "Respiratory Alkalosis", primary: "respiratory" };
    } else {
      if (hco3Val < 22 && pco2Val < 35) return { type: "Compensated Metabolic Acidosis", primary: "metabolic" };
      if (hco3Val > 26 && pco2Val > 45) return { type: "Compensated Metabolic Alkalosis", primary: "metabolic" };
      if (pco2Val > 45 && hco3Val > 26) return { type: "Compensated Respiratory Acidosis", primary: "respiratory" };
      if (pco2Val < 35 && hco3Val < 22) return { type: "Compensated Respiratory Alkalosis", primary: "respiratory" };
    }
    return { type: "Normal or Mixed Disorder", primary: null };
  };

  const getExpectedCompensation = () => {
    const disorder = getPrimaryDisorder();
    if (!disorder || !disorder.primary) return null;

    let expected = {};
    
    if (disorder.type === "Metabolic Acidosis") {
      const expectedPCO2 = 1.5 * hco3Val + 8;
      expected = {
        formula: "Winter's Formula",
        calculation: `Expected pCO₂ = [1.5 × ${hco3Val}] + 8 = ${expectedPCO2.toFixed(1)} ± 2`,
        expectedValue: expectedPCO2,
        range: `${(expectedPCO2 - 2).toFixed(1)} - ${(expectedPCO2 + 2).toFixed(1)}`,
        actual: pco2Val,
        interpretation: pco2Val < expectedPCO2 - 2 
          ? "Mixed with Respiratory Alkalosis" 
          : pco2Val > expectedPCO2 + 2 
            ? "Mixed with Respiratory Acidosis" 
            : "Pure Metabolic Acidosis (Appropriately Compensated)"
      };
    } else if (disorder.type === "Metabolic Alkalosis") {
      const expectedPCO2 = 0.7 * hco3Val + 20;
      expected = {
        formula: "Expected pCO₂ = [0.7 × HCO₃] + 20 ± 5",
        calculation: `Expected pCO₂ = [0.7 × ${hco3Val}] + 20 = ${expectedPCO2.toFixed(1)}`,
        expectedValue: expectedPCO2,
        actual: pco2Val,
        interpretation: pco2Val < expectedPCO2 - 5 
          ? "Mixed with Respiratory Alkalosis" 
          : pco2Val > expectedPCO2 + 5 
            ? "Mixed with Respiratory Acidosis" 
            : "Pure Metabolic Alkalosis"
      };
    } else if (disorder.type.includes("Respiratory Acidosis")) {
      const deltaPCO2 = pco2Val - 40;
      const acuteHCO3 = 24 + (deltaPCO2 / 10) * 1;
      const chronicHCO3 = 24 + (deltaPCO2 / 10) * 4;
      expected = {
        formula: "Box Rule (Respiratory)",
        acute: `Acute: [Δ paCO₂]/10 × 1 + 24 = ${acuteHCO3.toFixed(1)}`,
        chronic: `Chronic: [Δ paCO₂]/10 × 4 + 24 = ${chronicHCO3.toFixed(1)}`,
        actual: hco3Val,
        interpretation: hco3Val < acuteHCO3 - 2 
          ? "Mixed with Metabolic Acidosis" 
          : hco3Val > chronicHCO3 + 2 
            ? "Mixed with Metabolic Alkalosis" 
            : hco3Val <= acuteHCO3 + 2 
              ? "Acute Respiratory Acidosis"
              : "Chronic Respiratory Acidosis"
      };
    } else if (disorder.type.includes("Respiratory Alkalosis")) {
      const deltaPCO2 = 40 - pco2Val;
      const acuteHCO3 = 24 - (deltaPCO2 / 10) * 2;
      const chronicHCO3 = 24 - (deltaPCO2 / 10) * 5;
      expected = {
        formula: "Box Rule (Respiratory)",
        acute: `Acute: 24 - [Δ paCO₂]/10 × 2 = ${acuteHCO3.toFixed(1)}`,
        chronic: `Chronic: 24 - [Δ paCO₂]/10 × 5 = ${chronicHCO3.toFixed(1)}`,
        actual: hco3Val,
        interpretation: hco3Val > acuteHCO3 + 2 
          ? "Mixed with Metabolic Alkalosis" 
          : hco3Val < chronicHCO3 - 2 
            ? "Mixed with Metabolic Acidosis" 
            : hco3Val >= chronicHCO3 - 2 
              ? "Chronic Respiratory Alkalosis"
              : "Acute Respiratory Alkalosis"
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
                <Input type="number" step="0.01" value={ph} onChange={(e) => setPh(e.target.value)} placeholder="7.40" className="h-8 text-sm mt-1" min="0" data-testid="abg-ph-input" />
              </div>
              <div>
                <Label className="text-xs">pCO₂ (mmHg)</Label>
                <Input type="number" value={pco2} onChange={(e) => setPco2(e.target.value)} placeholder="40" className="h-8 text-sm mt-1" min="0" data-testid="abg-pco2-input" />
              </div>
              <div>
                <Label className="text-xs">HCO₃⁻ (mEq/L)</Label>
                <Input type="number" value={hco3} onChange={(e) => setHco3(e.target.value)} placeholder="24" className="h-8 text-sm mt-1" min="0" data-testid="abg-hco3-input" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Na⁺ (mEq/L)</Label>
                <Input type="number" value={na} onChange={(e) => setNa(e.target.value)} placeholder="140" className="h-8 text-sm mt-1" min="0" data-testid="abg-na-input" />
              </div>
              <div>
                <Label className="text-xs">Cl⁻ (mEq/L)</Label>
                <Input type="number" value={cl} onChange={(e) => setCl(e.target.value)} placeholder="102" className="h-8 text-sm mt-1" min="0" data-testid="abg-cl-input" />
              </div>
              <div>
                <Label className="text-xs">Albumin (g/dL)</Label>
                <Input type="number" step="0.1" value={albumin} onChange={(e) => setAlbumin(e.target.value)} placeholder="4.0" className="h-8 text-sm mt-1" min="0" data-testid="abg-albumin-input" />
              </div>
            </div>

            {/* Calculated Values */}
            {anionGap !== null && (
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Anion Gap (Na - Cl - HCO₃):</span>
                  <span className={`font-bold ${anionGap > 12 ? 'text-red-600' : 'text-green-600'}`}>
                    {anionGap.toFixed(1)} mEq/L {anionGap > 12 ? '(High)' : '(Normal 8-12)'}
                  </span>
                </div>
                {albVal !== 4 && correctedAG !== null && (
                  <div className="flex justify-between">
                    <span>Corrected AG (for albumin {albVal}):</span>
                    <span className={`font-bold ${correctedAG > 12 ? 'text-red-600' : 'text-green-600'}`}>
                      {correctedAG.toFixed(1)} mEq/L
                    </span>
                  </div>
                )}
                {(correctedAG ?? anionGap) > 12 && deltaRatio && (
                  <div className="flex justify-between">
                    <span>Delta Ratio (ΔAG/ΔHCO₃):</span>
                    <span className="font-bold">
                      {deltaRatio.toFixed(2)} 
                      {deltaRatio < 1 ? ' → Mixed HAGMA + NAGMA' : deltaRatio > 2 ? ' → Mixed HAGMA + Met Alk' : ' → Pure HAGMA'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Primary Disorder Result */}
            {disorder && (
              <div className={`p-3 rounded-lg border-2 ${
                disorder.type.includes('Acidosis') ? 'bg-red-50 dark:bg-red-950/30 border-red-300' :
                disorder.type.includes('Alkalosis') ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300' :
                'bg-gray-50 dark:bg-gray-800 border-gray-300'
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
                    <p className="font-semibold">Compensation Analysis ({compensation.formula}):</p>
                    {compensation.calculation && <p className="font-mono text-[10px] bg-white/50 dark:bg-black/20 p-1 rounded">{compensation.calculation}</p>}
                    {compensation.acute && <p className="font-mono text-[10px] bg-white/50 dark:bg-black/20 p-1 rounded">{compensation.acute}</p>}
                    {compensation.chronic && <p className="font-mono text-[10px] bg-white/50 dark:bg-black/20 p-1 rounded">{compensation.chronic}</p>}
                    <p className="font-semibold mt-1 text-green-700 dark:text-green-400">→ {compensation.interpretation}</p>
                  </div>
                )}
              </div>
            )}

            <div className="text-[10px] p-2 bg-gray-50 dark:bg-gray-800 rounded border">
              <p className="font-semibold mb-1">Normal Values:</p>
              <p className="text-muted-foreground">pH: 7.35-7.45 • pCO₂: 35-45 mmHg • HCO₃⁻: 22-26 mEq/L • AG: 8-12 mEq/L</p>
            </div>
          </div>
        </Section>

        {/* Main Flowchart */}
        <Section id="abg-flowchart" title="📊 ABG Interpretation Flowchart" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2">
            {/* Start: pH */}
            <div className="flex flex-col items-center">
              <div className="px-6 py-2 bg-yellow-200 dark:bg-yellow-900 border-2 border-yellow-500 rounded-lg font-bold text-sm">
                pH
              </div>
              <FlowArrow direction="down" />
              
              {/* pH Branches */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* pH < 7.4 */}
                <FlowNode title="pH < 7.4 (Acidemia)" color="red" defaultOpen={true}>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    Look for 1ry disorder: Is HCO₃⁻ mainly low → Metabolic, or pCO₂ mainly high → Respiratory?
                  </p>
                  <div className="space-y-2">
                    <FlowNode title="↓ HCO₃⁻ → Metabolic Acidosis" color="red" level={1}>
                      <FlowArrow direction="down" label="Check AG" />
                      <FlowNode title="Calculate Anion Gap" color="amber" level={1}>
                        <p className="text-[10px] font-mono">AG = Na⁺ - (Cl⁻ + HCO₃⁻)</p>
                        <p className="text-[10px] text-muted-foreground">Correct for albumin: Add 2.5 for each 1 g/dL below 4</p>
                      </FlowNode>
                    </FlowNode>
                    <FlowNode title="↑ pCO₂ → Respiratory Acidosis" color="amber" level={1}>
                      <p className="text-[10px] text-muted-foreground">Check if Acute or Chronic using Box Rule</p>
                    </FlowNode>
                  </div>
                </FlowNode>

                {/* pH > 7.4 */}
                <FlowNode title="pH > 7.4 (Alkalemia)" color="blue" defaultOpen={true}>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    Look for 1ry disorder: Is HCO₃⁻ mainly high → Metabolic, or pCO₂ mainly low → Respiratory?
                  </p>
                  <div className="space-y-2">
                    <FlowNode title="↑ HCO₃⁻ → Metabolic Alkalosis" color="blue" level={1}>
                      <p className="text-[10px] text-muted-foreground">Check Urine Chloride (UCl) for classification</p>
                    </FlowNode>
                    <FlowNode title="↓ pCO₂ → Respiratory Alkalosis" color="teal" level={1}>
                      <p className="text-[10px] text-muted-foreground">Check if Acute or Chronic using Box Rule</p>
                    </FlowNode>
                  </div>
                </FlowNode>
              </div>
            </div>

            {/* Primary Rules Box */}
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-300">
              <p className="font-bold text-xs text-green-800 dark:text-green-200 mb-2">📌 Primary Disorder Rules:</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-bold text-teal-700">1ry Respiratory:</p>
                  <p>pH & pCO₂ = opposite directions</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-bold text-red-700">1ry Metabolic:</p>
                  <p>pH & pCO₂ & HCO₃⁻ = same direction</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Compensation Rules - Visual Diagram */}
        <Section id="abg-compensation" title="📐 Compensation Rules (Box Rule)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            {/* Compensation Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 p-2 text-left">1ry Disturbance</th>
                    <th className="border border-gray-300 p-2 text-center">Primary Change</th>
                    <th className="border border-gray-300 p-2 text-center">Compensatory Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-red-50 dark:bg-red-950/30">
                    <td className="border border-gray-300 p-2 font-semibold">Metabolic Acidosis</td>
                    <td className="border border-gray-300 p-2 text-center">↓ 1 HCO₃⁻</td>
                    <td className="border border-gray-300 p-2 text-center">↓ 1 pCO₂</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-950/30">
                    <td className="border border-gray-300 p-2 font-semibold">Metabolic Alkalosis</td>
                    <td className="border border-gray-300 p-2 text-center">↑ 1 HCO₃⁻</td>
                    <td className="border border-gray-300 p-2 text-center">↑ 0.7 pCO₂</td>
                  </tr>
                  <tr className="bg-amber-50 dark:bg-amber-950/30">
                    <td className="border border-gray-300 p-2 font-semibold">Acute Respiratory Acidosis</td>
                    <td className="border border-gray-300 p-2 text-center">↑ 10 pCO₂</td>
                    <td className="border border-gray-300 p-2 text-center">↑ 1 HCO₃⁻</td>
                  </tr>
                  <tr className="bg-amber-100 dark:bg-amber-900/30">
                    <td className="border border-gray-300 p-2 font-semibold">Chronic Respiratory Acidosis</td>
                    <td className="border border-gray-300 p-2 text-center">↑ 10 pCO₂</td>
                    <td className="border border-gray-300 p-2 text-center">↑ 4 HCO₃⁻</td>
                  </tr>
                  <tr className="bg-teal-50 dark:bg-teal-950/30">
                    <td className="border border-gray-300 p-2 font-semibold">Acute Respiratory Alkalosis</td>
                    <td className="border border-gray-300 p-2 text-center">↓ 10 pCO₂</td>
                    <td className="border border-gray-300 p-2 text-center">↓ 2 HCO₃⁻</td>
                  </tr>
                  <tr className="bg-teal-100 dark:bg-teal-900/30">
                    <td className="border border-gray-300 p-2 font-semibold">Chronic Respiratory Alkalosis</td>
                    <td className="border border-gray-300 p-2 text-center">↓ 10 pCO₂</td>
                    <td className="border border-gray-300 p-2 text-center">↓ 5 HCO₃⁻</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Visual Box Rule Diagram */}
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-300">
              <p className="font-bold text-xs text-purple-800 dark:text-purple-200 mb-2">📦 Box Rule for Respiratory Compensation:</p>
              <div className="flex justify-center">
                <div className="border-2 border-purple-500 rounded overflow-hidden">
                  <table className="text-[10px]">
                    <thead>
                      <tr>
                        <th className="border-b border-r border-purple-300 p-2 bg-purple-200 dark:bg-purple-900"></th>
                        <th className="border-b border-r border-purple-300 p-2 bg-purple-200 dark:bg-purple-900 text-red-700">Acidosis</th>
                        <th className="border-b border-purple-300 p-2 bg-purple-200 dark:bg-purple-900 text-blue-700">Alkalosis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-r border-b border-purple-300 p-2 bg-purple-100 dark:bg-purple-950 font-bold">Acute</td>
                        <td className="border-r border-b border-purple-300 p-3 text-center font-mono text-lg font-bold text-red-600">1</td>
                        <td className="border-b border-purple-300 p-3 text-center font-mono text-lg font-bold text-blue-600">2</td>
                      </tr>
                      <tr>
                        <td className="border-r border-purple-300 p-2 bg-purple-100 dark:bg-purple-950 font-bold">Chronic</td>
                        <td className="border-r border-purple-300 p-3 text-center font-mono text-lg font-bold text-red-600">4</td>
                        <td className="p-3 text-center font-mono text-lg font-bold text-blue-600">5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-[10px] text-center mt-2 text-muted-foreground">
                For every <strong>10 mmHg change in pCO₂</strong>, multiply by the box number for expected HCO₃⁻ change
              </p>
            </div>

            {/* Metabolic Compensation Formulas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200">
                <p className="font-bold text-xs text-red-800">Metabolic Acidosis (Winter's Formula):</p>
                <p className="font-mono text-[10px] mt-1 bg-white dark:bg-gray-900 p-1 rounded">Expected pCO₂ = [1.5 × HCO₃⁻] + 8 ± 2</p>
                <ul className="text-[9px] text-muted-foreground mt-1 space-y-0.5">
                  <li>• Measured = Expected → Pure Metabolic Acidosis</li>
                  <li>• Measured &gt; Expected → + Respiratory Acidosis</li>
                  <li>• Measured &lt; Expected → + Respiratory Alkalosis</li>
                </ul>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200">
                <p className="font-bold text-xs text-blue-800">Metabolic Alkalosis:</p>
                <p className="font-mono text-[10px] mt-1 bg-white dark:bg-gray-900 p-1 rounded">Expected pCO₂ = [0.7 × HCO₃⁻] + 20 ± 5</p>
                <p className="text-[9px] text-muted-foreground mt-1">
                  For every 1 mEq/L ↑ in HCO₃⁻ → 0.7 mmHg ↑ in pCO₂
                </p>
              </div>
            </div>

            {/* Respiratory Compensation Formulas */}
            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200">
              <p className="font-bold text-xs text-amber-800 mb-2">Respiratory Compensation Equations:</p>
              <p className="text-[9px] text-muted-foreground mb-2">
                Δ paCO₂ = |Normal paCO₂ (40) - Measured paCO₂| • 24 = Normal HCO₃⁻
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-1 bg-white dark:bg-gray-900 rounded">
                  <p className="font-semibold text-red-700">Acute Resp Acidosis</p>
                  <p className="font-mono">[ΔpaCO₂]/10 × 1 + 24</p>
                </div>
                <div className="p-1 bg-white dark:bg-gray-900 rounded">
                  <p className="font-semibold text-red-700">Chronic Resp Acidosis</p>
                  <p className="font-mono">[ΔpaCO₂]/10 × 4 + 24</p>
                </div>
                <div className="p-1 bg-white dark:bg-gray-900 rounded">
                  <p className="font-semibold text-blue-700">Acute Resp Alkalosis</p>
                  <p className="font-mono">24 - [ΔpaCO₂]/10 × 2</p>
                </div>
                <div className="p-1 bg-white dark:bg-gray-900 rounded">
                  <p className="font-semibold text-blue-700">Chronic Resp Alkalosis</p>
                  <p className="font-mono">24 - [ΔpaCO₂]/10 × 5</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Metabolic Acidosis - Anion Gap */}
        <Section id="abg-anion-gap" title="🔴 Metabolic Acidosis → Anion Gap Flowchart" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            {/* AG Formula */}
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded border text-center">
              <p className="font-bold text-xs">Anion Gap = Na⁺ - (Cl⁻ + HCO₃⁻)</p>
              <p className="text-[10px] text-muted-foreground">Normal: 8-12 mEq/L</p>
              <p className="text-[10px] text-amber-600">Correct for albumin: Add 2.5 for every 1 g/dL below 4</p>
            </div>

            {/* HAGMA vs NAGMA */}
            <div className="grid grid-cols-2 gap-3">
              {/* High Anion Gap - MUDPILES */}
              <MnemonicBox 
                title="High AG (>12) - MUDPILES" 
                color="red"
                items={[
                  { letter: "M", text: "ethanol" },
                  { letter: "U", text: "remia" },
                  { letter: "D", text: "KA" },
                  { letter: "P", text: "araldehyde / Propylene glycol" },
                  { letter: "I", text: "nborn Errors / Isoniazid" },
                  { letter: "L", text: "actic Acidosis" },
                  { letter: "E", text: "thylene Glycol" },
                  { letter: "S", text: "alicylates" },
                ]}
              />

              {/* Normal Anion Gap - USED CARP */}
              <MnemonicBox 
                title="Normal AG (8-12) - USED CARP" 
                color="amber"
                items={[
                  { letter: "U", text: "reterostomy" },
                  { letter: "S", text: "mall bowel fistula" },
                  { letter: "E", text: "xtra Chloride" },
                  { letter: "D", text: "iarrhea" },
                  { letter: "C", text: "arbonic anhydrase inhibitors" },
                  { letter: "A", text: "ddison's disease" },
                  { letter: "R", text: "enal tubular acidosis" },
                  { letter: "P", text: "ancreatic fistulas" },
                ]}
                treatment="Replace Bicarbonate"
              />
            </div>

            {/* Delta Ratio */}
            <FlowNode title="📊 Delta Ratio (for HAGMA)" color="purple" defaultOpen={true}>
              <div className="space-y-2">
                <p className="font-mono text-[10px] bg-white dark:bg-gray-900 p-2 rounded text-center">
                  Delta Ratio = [Calculated AG - 12] / [24 - Measured HCO₃⁻]
                </p>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded text-center">
                    <p className="font-bold">&lt; 1</p>
                    <p className="text-muted-foreground">Mixed HAGMA + NAGMA</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded text-center">
                    <p className="font-bold">1 - 2</p>
                    <p className="text-muted-foreground">Pure HAGMA</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-center">
                    <p className="font-bold">&gt; 2</p>
                    <p className="text-muted-foreground">Mixed HAGMA + Met Alk</p>
                  </div>
                </div>
                <div className="text-[9px] text-muted-foreground bg-purple-50 dark:bg-purple-900/30 p-2 rounded">
                  <p>• In HAGMA: No change in Cl⁻</p>
                  <p>• Lactic Acidosis: avg ratio ~1.6</p>
                  <p>• DKA: avg ratio closer to 1 (urine ketone loss)</p>
                </div>
              </div>
            </FlowNode>

            {/* HAGMA + High Osmolar Gap */}
            <FlowNode title="HAGMA + High Osmolar Gap → Lactic Acid" color="red">
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <FlowNode title="High LA → L-Lactic Acid" color="red" level={1} defaultOpen={true}>
                  <div className="space-y-1">
                    <div className="p-1 bg-red-200 dark:bg-red-900 rounded">
                      <p className="font-bold text-red-800">Type A - Impaired tissue O₂</p>
                      <p className="text-[9px]">Shock, Cardiac failure, Sepsis</p>
                    </div>
                    <div className="p-1 bg-amber-200 dark:bg-amber-900 rounded">
                      <p className="font-bold text-amber-800">Type B - Mitochondrial dysfunction</p>
                      <p className="text-[9px]">Drug: Zidovudine, Metformin, Propofol</p>
                      <p className="text-[9px]">Tumor: Leukemia, Lymphoma</p>
                      <p className="text-[9px]">Alcoholism, GSD</p>
                    </div>
                  </div>
                </FlowNode>
                <FlowNode title="Normal LA → D-Lactic Acid" color="amber" level={1}>
                  <p className="text-[9px] text-muted-foreground">
                    Seen in Short bowel & Malabsorption. <strong>Not measured by lab</strong>, accumulates quickly, persists longer.
                  </p>
                </FlowNode>
              </div>
            </FlowNode>

            {/* NAGMA - Urine AG */}
            <FlowNode title="NAGMA → Urine Anion Gap (UAG)" color="amber">
              <div className="space-y-2">
                <p className="font-mono text-[10px] bg-white dark:bg-gray-900 p-2 rounded text-center">
                  UAG = Urine (Na⁺ + K⁺) - Urine Cl⁻
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-300">
                    <p className="font-bold text-xs text-red-800">UAG Positive (+Ve)</p>
                    <p className="font-bold text-[10px] text-red-700">→ Renal losses</p>
                    <ul className="text-[9px] text-muted-foreground mt-1">
                      <li>• RTA (Distal type 1 or 4) → Check K & Urine pH</li>
                      <li>• High K → Type IV</li>
                      <li>• Low K → Type I</li>
                      <li>• Drugs: Acetazolamide, Amphotericin B</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded border border-green-300">
                    <p className="font-bold text-xs text-green-800">UAG Negative (-Ve)</p>
                    <p className="font-bold text-[10px] text-green-700">→ Extrarenal losses</p>
                    <ul className="text-[9px] text-muted-foreground mt-1">
                      <li>• GI: Diarrhea, Fistulas → Low K</li>
                      <li>• Sodium infusion</li>
                      <li>• Proximal RTA</li>
                      <li>• Organic acid, TPN</li>
                      <li>• Hyperaldosteronism → Low K</li>
                    </ul>
                  </div>
                </div>
              </div>
            </FlowNode>
          </div>
        </Section>

        {/* Metabolic Alkalosis Flowchart */}
        <Section id="abg-met-alk" title="🔵 Metabolic Alkalosis Flowchart" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            {/* Visual Flowchart */}
            <div className="flex flex-col items-center space-y-1">
              <div className="px-4 py-2 bg-blue-200 dark:bg-blue-900 border-2 border-blue-500 rounded-full font-bold text-xs">
                Metabolic Alkalosis
              </div>
              <FlowArrow direction="down" label="Check UCl" />
              
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Chloride Responsive */}
                <FlowNode title="Cl Responsive (UCl <10)" color="green" defaultOpen={true}>
                  <p className="text-[10px] text-green-700 font-bold mb-2">→ Responds to Saline</p>
                  <ul className="text-[9px] text-muted-foreground space-y-0.5">
                    <li>• Vomiting & NGT aspirate</li>
                    <li>• Diuretics</li>
                    <li>• Post-hypercapnia</li>
                    <li>• Cystic Fibrosis (CF)</li>
                  </ul>
                </FlowNode>

                {/* Chloride Resistant */}
                <FlowNode title="Cl Resistant (UCl >10)" color="red" defaultOpen={true}>
                  <p className="text-[10px] text-red-700 font-bold mb-2">→ Check Blood Pressure</p>
                  <div className="space-y-2">
                    <FlowNode title="No HTN" color="amber" level={1}>
                      <ul className="text-[9px] text-muted-foreground">
                        <li>• Bartter syndrome</li>
                        <li>• Gitelman syndrome</li>
                        <li>• Surreptitious vomiting/diuretic abuse</li>
                      </ul>
                    </FlowNode>
                    <FlowNode title="With HTN → Check Renin & Aldo" color="red" level={1} defaultOpen={true}>
                      <div className="space-y-1 text-[9px]">
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <span className="font-bold">All High:</span> Renal Artery Stenosis (RAS)
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <span className="font-bold">All Low:</span> Liddle, CAH 11-OH, Cushing
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <span className="font-bold">Low R & High Aldo:</span> Conn syndrome, Adrenal Tumor
                        </div>
                      </div>
                    </FlowNode>
                  </div>
                </FlowNode>
              </div>
            </div>

            {/* Detailed Met Alk Flowchart */}
            <FlowNode title="📋 Detailed Met Alk Approach (by Serum Cl)" color="blue">
              <div className="grid grid-cols-2 gap-2 text-[9px]">
                <div className="p-2 bg-white dark:bg-gray-900 rounded border">
                  <p className="font-bold text-blue-700 mb-1">Low Serum Cl → Check BP</p>
                  <div className="space-y-1">
                    <div className="p-1 bg-red-50 dark:bg-red-900/30 rounded">
                      <p className="font-bold">HIGH BP → Renin & Aldo</p>
                      <ul className="text-muted-foreground">
                        <li>• All High → RAS</li>
                        <li>• All Low → Liddle, CAH, Cushing</li>
                        <li>• ↓R ↑A → Conn, Adrenal Tumor</li>
                      </ul>
                    </div>
                    <div className="p-1 bg-amber-50 dark:bg-amber-900/30 rounded">
                      <p className="font-bold">Normal BP → Urine Cl</p>
                      <ul className="text-muted-foreground">
                        <li>• &gt;20 → Bartter, Gitelman (↑R&A)</li>
                        <li>• &lt;10 Skin → Pseudobartter, CF, Sweating</li>
                        <li>• &lt;10 GIT → Pyloric stenosis, Vomiting, NGT, Cl diarrhea</li>
                        <li>• &lt;10 Renal → Loop diuretics</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded border">
                  <p className="font-bold text-green-700 mb-1">Normal Serum Cl</p>
                  <p className="text-muted-foreground">→ Exogenous HCO₃⁻ administration</p>
                </div>
              </div>
            </FlowNode>
          </div>
        </Section>

        {/* Quick Reference */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border-2 border-blue-200">
          <p className="font-bold text-sm text-center mb-2">⚡ ABG QUICK APPROACH</p>
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            <div className="p-2 bg-white dark:bg-gray-900 rounded shadow-sm text-center">
              <p className="font-bold text-amber-600">Step 1</p>
              <p>pH</p>
              <p className="text-[9px] text-muted-foreground">&lt;7.35 or &gt;7.45?</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded shadow-sm text-center">
              <p className="font-bold text-blue-600">Step 2</p>
              <p>1ry Disorder</p>
              <p className="text-[9px] text-muted-foreground">Met or Resp?</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded shadow-sm text-center">
              <p className="font-bold text-green-600">Step 3</p>
              <p>Compensation</p>
              <p className="text-[9px] text-muted-foreground">Expected values</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded shadow-sm text-center">
              <p className="font-bold text-purple-600">Step 4</p>
              <p>If Met Acidosis</p>
              <p className="text-[9px] text-muted-foreground">Check AG</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default BloodGasApproach;
