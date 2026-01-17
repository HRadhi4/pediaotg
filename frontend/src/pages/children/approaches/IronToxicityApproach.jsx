/**
 * Iron Toxicity Approach Component
 * Includes elemental iron calculator with ml/mg conversion and deferoxamine dosing protocols
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Section from "./Section";

// Iron salt elemental iron percentages (from UpToDate)
const IRON_SALTS = [
  { id: "ferrous_sulfate", name: "Ferrous Sulfate", elementalPercent: 20 },
  { id: "ferrous_gluconate", name: "Ferrous Gluconate", elementalPercent: 12 },
  { id: "ferrous_fumarate", name: "Ferrous Fumarate", elementalPercent: 33 },
  { id: "carbonyl_iron", name: "Carbonyl Iron", elementalPercent: 100 },
  { id: "polysaccharide_iron", name: "Polysaccharide Iron Complex", elementalPercent: 100 },
  { id: "iron_dextran", name: "Iron Dextran (IV)", elementalPercent: 100 },
];

// Common liquid iron preparations in Bahrain (concentration in mg/ml of iron salt)
const LIQUID_IRON_PREPARATIONS = [
  { id: "feroglobin_syrup", name: "Feroglobin Syrup", concentration: 23.5, concentrationUnit: "mg Fe gluconate/5ml", elementalPercent: 12, perMl: 4.7 },
  { id: "ferrous_sulfate_syrup", name: "Ferrous Sulfate Syrup (Generic)", concentration: 25, concentrationUnit: "mg Fe sulfate/ml", elementalPercent: 20, perMl: 25 },
  { id: "fer_in_sol", name: "Fer-In-Sol Drops", concentration: 75, concentrationUnit: "mg Fe sulfate/ml", elementalPercent: 20, perMl: 75 },
  { id: "iberet_folic", name: "Iberet Folic Liquid", concentration: 52.5, concentrationUnit: "mg Fe sulfate/5ml", elementalPercent: 20, perMl: 10.5 },
  { id: "maltofer_syrup", name: "Maltofer Syrup", concentration: 50, concentrationUnit: "mg Fe(III)/5ml", elementalPercent: 100, perMl: 10, note: "Elemental iron" },
  { id: "maltofer_drops", name: "Maltofer Drops", concentration: 50, concentrationUnit: "mg Fe(III)/ml", elementalPercent: 100, perMl: 50, note: "Elemental iron" },
  { id: "custom", name: "Custom / Other", concentration: 0, concentrationUnit: "mg/ml", elementalPercent: 20, perMl: 0 },
];

const IronToxicityApproach = ({ weight, expandedSections, toggleSection }) => {
  const [inputMode, setInputMode] = useState("mg"); // "mg" or "ml"
  const [selectedSalt, setSelectedSalt] = useState("");
  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [amountIngested, setAmountIngested] = useState("");
  const [mlIngested, setMlIngested] = useState("");
  const [customConcentration, setCustomConcentration] = useState("");
  const [customElementalPercent, setCustomElementalPercent] = useState("20");
  const [serumIron, setSerumIron] = useState("");

  const w = parseFloat(weight) || 0;
  const amount = parseFloat(amountIngested) || 0;
  const ml = parseFloat(mlIngested) || 0;
  const serum = parseFloat(serumIron) || 0;
  const customConc = parseFloat(customConcentration) || 0;
  const customElem = parseFloat(customElementalPercent) || 20;

  // Calculate elemental iron ingested
  const ironCalculation = useMemo(() => {
    let elementalIron = 0;
    let saltName = "";
    let elementalPercent = 0;
    let totalSaltMg = 0;

    if (inputMode === "mg" && selectedSalt && amount > 0) {
      const salt = IRON_SALTS.find(s => s.id === selectedSalt);
      if (!salt) return null;
      saltName = salt.name;
      elementalPercent = salt.elementalPercent;
      totalSaltMg = amount;
      elementalIron = amount * (salt.elementalPercent / 100);
    } else if (inputMode === "ml" && selectedLiquid && ml > 0) {
      const liquid = LIQUID_IRON_PREPARATIONS.find(l => l.id === selectedLiquid);
      if (!liquid) return null;
      
      if (liquid.id === "custom") {
        if (customConc <= 0) return null;
        saltName = "Custom Preparation";
        elementalPercent = customElem;
        totalSaltMg = ml * customConc;
        elementalIron = totalSaltMg * (customElem / 100);
      } else {
        saltName = liquid.name;
        elementalPercent = liquid.elementalPercent;
        totalSaltMg = ml * liquid.perMl;
        elementalIron = totalSaltMg * (liquid.elementalPercent / 100);
      }
    } else {
      return null;
    }

    const mgPerKg = w > 0 ? elementalIron / w : 0;
    
    let severity = "minimal";
    let riskLevel = "Usually Asymptomatic";
    let recommendation = "Observation at home appropriate";
    
    if (mgPerKg >= 60) {
      severity = "severe";
      riskLevel = "Serious Toxicity Expected";
      recommendation = "Hospital admission, deferoxamine if symptomatic, WBI if pills on X-ray";
    } else if (mgPerKg >= 20) {
      severity = "mild";
      riskLevel = "Low Potential for Serious Toxicity";
      recommendation = "GI symptoms possible - ED evaluation if symptomatic";
    }
    
    return {
      saltName,
      elementalPercent,
      totalSaltMg: totalSaltMg.toFixed(1),
      elementalIron: elementalIron.toFixed(1),
      mgPerKg: mgPerKg.toFixed(1),
      severity,
      riskLevel,
      recommendation
    };
  }, [inputMode, selectedSalt, selectedLiquid, amount, ml, customConc, customElem, w]);

  // Deferoxamine dosing
  const deferoxamineDosing = useMemo(() => {
    if (w <= 0) return null;
    const initialDose = w * 15;
    const maxDose = w * 35;
    return { initialRate: initialDose.toFixed(0), maxRate: maxDose.toFixed(0) };
  }, [w]);

  // Serum iron interpretation
  const serumInterpretation = useMemo(() => {
    if (serum <= 0) return null;
    let severity, recommendation;
    if (serum >= 1000) {
      severity = "critical";
      recommendation = "Significant morbidity/mortality - immediate chelation";
    } else if (serum >= 500) {
      severity = "critical";
      recommendation = "Serious systemic toxicity - deferoxamine indicated";
    } else if (serum >= 350) {
      severity = "high";
      recommendation = "Mild to moderate GI symptoms expected";
    } else {
      severity = "normal";
      recommendation = "Minimal toxicity expected";
    }
    return { severity, recommendation, level: serum };
  }, [serum]);

  const selectedLiquidData = LIQUID_IRON_PREPARATIONS.find(l => l.id === selectedLiquid);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Iron Toxicity</CardTitle>
        <CardDescription className="text-xs">Elemental iron calculator, toxicity staging & deferoxamine protocol</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* Elemental Iron Calculator - Always Open */}
        <Section id="iron-calc" title="Elemental Iron Calculator" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            {/* Input Mode Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode("mg")}
                className={`flex-1 py-2 px-3 text-xs rounded border ${inputMode === "mg" ? "bg-slate-700 text-white border-slate-700" : "bg-white dark:bg-gray-800 border-gray-300"}`}
              >
                Tablets (mg)
              </button>
              <button
                type="button"
                onClick={() => setInputMode("ml")}
                className={`flex-1 py-2 px-3 text-xs rounded border ${inputMode === "ml" ? "bg-slate-700 text-white border-slate-700" : "bg-white dark:bg-gray-800 border-gray-300"}`}
              >
                Liquid (ml)
              </button>
            </div>

            {inputMode === "mg" ? (
              <>
                <div>
                  <Label className="text-xs">Iron Salt Type</Label>
                  <Select value={selectedSalt} onValueChange={setSelectedSalt}>
                    <SelectTrigger className="mt-1" data-testid="iron-salt-selector">
                      <SelectValue placeholder="Select iron preparation..." />
                    </SelectTrigger>
                    <SelectContent>
                      {IRON_SALTS.map(salt => (
                        <SelectItem key={salt.id} value={salt.id}>
                          {salt.name} ({salt.elementalPercent}% elemental)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Amount of Iron Salt Ingested (mg)</Label>
                  <Input
                    type="number"
                    value={amountIngested}
                    onChange={(e) => setAmountIngested(e.target.value)}
                    placeholder="e.g., 650"
                    className="h-8 text-sm mt-1"
                    min="0"
                    data-testid="iron-amount-input"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-xs">Liquid Iron Preparation (Bahrain)</Label>
                  <Select value={selectedLiquid} onValueChange={setSelectedLiquid}>
                    <SelectTrigger className="mt-1" data-testid="iron-liquid-selector">
                      <SelectValue placeholder="Select liquid preparation..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LIQUID_IRON_PREPARATIONS.map(liquid => (
                        <SelectItem key={liquid.id} value={liquid.id}>
                          {liquid.name} {liquid.id !== "custom" && `(${liquid.concentrationUnit})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedLiquidData && selectedLiquidData.note && (
                    <p className="text-[10px] text-muted-foreground mt-1">{selectedLiquidData.note}</p>
                  )}
                </div>

                {selectedLiquid === "custom" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Concentration (mg/ml)</Label>
                      <Input
                        type="number"
                        value={customConcentration}
                        onChange={(e) => setCustomConcentration(e.target.value)}
                        placeholder="mg/ml"
                        className="h-8 text-sm mt-1"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Elemental Iron %</Label>
                      <Select value={customElementalPercent} onValueChange={setCustomElementalPercent}>
                        <SelectTrigger className="mt-1 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12% (Gluconate)</SelectItem>
                          <SelectItem value="20">20% (Sulfate)</SelectItem>
                          <SelectItem value="33">33% (Fumarate)</SelectItem>
                          <SelectItem value="100">100% (Elemental)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-xs">Volume Ingested (ml)</Label>
                  <Input
                    type="number"
                    value={mlIngested}
                    onChange={(e) => setMlIngested(e.target.value)}
                    placeholder="e.g., 30"
                    className="h-8 text-sm mt-1"
                    min="0"
                    data-testid="iron-ml-input"
                  />
                </div>
              </>
            )}

            {/* Results */}
            {ironCalculation && (
              <div className={`p-3 rounded-lg text-xs space-y-2 ${
                ironCalculation.severity === 'severe' ? 'bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100 border border-red-200' :
                ironCalculation.severity === 'mild' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 border border-amber-200' :
                'bg-green-50 dark:bg-green-950/30 text-green-900 border border-green-200'
              }`}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] opacity-70">Preparation</p>
                    <p className="font-semibold text-xs">{ironCalculation.saltName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-70">Elemental %</p>
                    <p className="font-semibold">{ironCalculation.elementalPercent}%</p>
                  </div>
                </div>
                {inputMode === "ml" && (
                  <div className="pt-2 border-t border-current/10">
                    <p className="text-[10px] opacity-70">Total Iron Salt</p>
                    <p className="font-semibold">{ironCalculation.totalSaltMg} mg</p>
                  </div>
                )}
                <div className="pt-2 border-t border-current/10">
                  <p className="text-[10px] opacity-70">Elemental Iron Ingested</p>
                  <p className="font-bold text-lg">{ironCalculation.elementalIron} mg</p>
                </div>
                {w > 0 && (
                  <div className="pt-2 border-t border-current/10">
                    <p className="text-[10px] opacity-70">Dose per Body Weight</p>
                    <p className="font-bold text-lg">{ironCalculation.mgPerKg} mg/kg</p>
                  </div>
                )}
                <div className="pt-2 border-t border-current/10">
                  <p className="font-bold">{ironCalculation.riskLevel}</p>
                  <p className="text-[10px] mt-1">{ironCalculation.recommendation}</p>
                </div>
              </div>
            )}

            {/* Quick Reference */}
            <div className="text-[10px] p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold mb-1">Common Iron Salts:</p>
              <p className="text-muted-foreground">Ferrous Sulfate 20% • Gluconate 12% • Fumarate 33% • Carbonyl/Maltofer 100%</p>
            </div>
          </div>
        </Section>

        {/* Toxic Dose Thresholds */}
        <Section id="iron-toxic" title="Toxic Dose Thresholds (Elemental Iron)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
              <span className="w-20 font-bold text-green-700">&lt;20 mg/kg</span>
              <span className="text-muted-foreground">Usually asymptomatic - observation at home</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
              <span className="w-20 font-bold text-amber-700">20-60 mg/kg</span>
              <span className="text-muted-foreground">Low potential for serious toxicity - GI symptoms possible</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <span className="w-20 font-bold text-red-700">≥60 mg/kg</span>
              <span className="text-muted-foreground">SERIOUS TOXICITY - hospitalization, consider deferoxamine</span>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-2">
              <p className="font-semibold text-gray-700 dark:text-gray-300">Key Point:</p>
              <p className="text-muted-foreground">Vomiting is the most sensitive indicator of serious iron ingestion</p>
            </div>
          </div>
        </Section>

        {/* Clinical Stages */}
        <Section id="iron-stages" title="Clinical Stages of Iron Poisoning" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Stage 1: GI Phase (0.5-6 hours)</p>
              <p className="text-muted-foreground">Nausea, vomiting, abdominal pain, diarrhea, hematemesis, melena</p>
              <p className="text-[10px] text-muted-foreground mt-1">Direct corrosive injury to GI mucosa</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Stage 2: Latent Phase (6-24 hours)</p>
              <p className="text-muted-foreground">Apparent clinical improvement - GI symptoms resolve</p>
              <p className="text-[10px] text-amber-600 mt-1">⚠️ Can be misleading - iron absorption continues</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Stage 3: Shock/Metabolic Phase (6-72 hours)</p>
              <p className="text-muted-foreground">Hypotension, metabolic acidosis, lethargy, coma, multi-organ failure</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Stage 4: Hepatic Phase (12-96 hours)</p>
              <p className="text-muted-foreground">Jaundice, coagulopathy, hypoglycemia, hepatic necrosis</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Stage 5: Late/Delayed Phase (2-8 weeks)</p>
              <p className="text-muted-foreground">Gastric outlet obstruction, pyloric stenosis, bowel strictures</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
              <p className="font-semibold text-green-700">✓ No symptoms by 6 hours = significant toxicity unlikely</p>
            </div>
          </div>
        </Section>

        {/* Serum Iron Level */}
        <Section id="iron-serum" title="Serum Iron Interpretation" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2">
            <div>
              <Label className="text-xs">Serum Iron Level (mcg/dL)</Label>
              <Input
                type="number"
                value={serumIron}
                onChange={(e) => setSerumIron(e.target.value)}
                placeholder="e.g., 350"
                className="h-8 text-sm mt-1"
                min="0"
                data-testid="serum-iron-input"
              />
            </div>
            
            {serumInterpretation && (
              <div className={`p-2 rounded text-xs ${
                serumInterpretation.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/20 text-red-800' :
                serumInterpretation.severity === 'high' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-800' :
                'bg-green-50 dark:bg-green-950/20 text-green-800'
              }`}>
                <p className="font-bold">Serum Iron: {serumInterpretation.level} mcg/dL</p>
                <p>{serumInterpretation.recommendation}</p>
              </div>
            )}
            
            <div className="text-[10px] text-muted-foreground p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Draw peak serum iron 4-6 hours post-ingestion (8h for extended-release)</p>
              <p className="mt-1">&lt;350: Minimal • 350-500: Mild-Mod GI • ≥500: Serious • &gt;1000: Critical</p>
            </div>
          </div>
        </Section>

        {/* Initial Management */}
        <Section id="iron-mgmt" title="Initial Management" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">1. Stabilization</p>
              <p className="text-muted-foreground">Airway protection, respiratory support, volume resuscitation (20 mL/kg isotonic crystalloid boluses)</p>
              {w > 0 && <p className="font-mono text-slate-600 mt-1">→ {(w * 20).toFixed(0)} mL NS bolus</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">2. GI Decontamination</p>
              <p className="text-muted-foreground"><strong>Whole Bowel Irrigation (WBI)</strong> - preferred if significant unabsorbed iron on X-ray</p>
              <p className="text-red-600 text-[10px] mt-1">AVOID: Activated charcoal, Syrup of ipecac, Gastric lavage with bicarbonate/phosphate</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">3. Labs to Order</p>
              <p className="text-muted-foreground"><strong>Mild:</strong> Glucose, electrolytes, BUN/Cr, blood gas, peak serum iron (4-6h)</p>
              <p className="text-muted-foreground"><strong>Mod-Severe:</strong> + ALT, AST, bilirubin, CBC, PT/PTT/INR, type & screen</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">4. Abdominal X-ray</p>
              <p className="text-muted-foreground">Iron tablets are radiopaque - helps assess pill burden</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">5. Poison Control / Toxicology Consult</p>
            </div>
          </div>
        </Section>

        {/* Deferoxamine Protocol */}
        <Section id="iron-deferoxamine" title="Deferoxamine (Desferal) Protocol" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
              <p className="font-semibold text-amber-800">Indications for IV Deferoxamine:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-1">
                <li>Severe symptoms (lethargy/coma, hypovolemic shock, persistent vomiting/diarrhea)</li>
                <li>Elevated anion gap metabolic acidosis</li>
                <li>Peak serum iron ≥500 mcg/dL</li>
                <li>Estimated ingestion ≥60 mg/kg elemental iron</li>
              </ul>
            </div>

            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">IV Deferoxamine Dosing (consult toxicologist)</p>
              <p className="text-muted-foreground mt-1"><strong>Initial:</strong> 15 mg/kg/hour continuous IV infusion</p>
              <p className="text-muted-foreground"><strong>Titrate:</strong> Increase by 5-10 mg/kg/hr every 2-4 hours if needed</p>
              <p className="text-muted-foreground"><strong>Maximum:</strong> Up to 35 mg/kg/hour</p>
              {deferoxamineDosing && w > 0 && (
                <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded font-mono text-slate-600">
                  <p>For {w} kg patient:</p>
                  <p>Initial: <strong>{deferoxamineDosing.initialRate} mg/hour</strong></p>
                  <p>Max: <strong>{deferoxamineDosing.maxRate} mg/hour</strong></p>
                </div>
              )}
            </div>

            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
              <p className="font-semibold text-green-700">When to Stop (~24 hours):</p>
              <ul className="list-disc list-inside text-muted-foreground mt-1">
                <li>Resolution of clinical symptoms</li>
                <li>Resolution of metabolic acidosis</li>
                <li>Resolution of shock</li>
              </ul>
              <p className="text-[10px] text-muted-foreground mt-1">Note: Use clinical endpoints, NOT urine color</p>
            </div>
          </div>
        </Section>

        {/* Quick Reference */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border text-center">
          <p className="font-bold text-sm mb-2">⚡ QUICK REFERENCE</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-green-600">Low Risk</p>
              <p>&lt;20 mg/kg</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-red-600">Serious</p>
              <p>≥60 mg/kg</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-blue-600">Chelate if</p>
              <p>SIL ≥500</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Activated charcoal does NOT bind iron • Vomiting = most sensitive sign
          </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default IronToxicityApproach;
