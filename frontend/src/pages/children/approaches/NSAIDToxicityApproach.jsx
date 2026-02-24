/**
 * NSAID Toxicity Approach Component
 * Based on UpToDate guidelines for NSAID poisoning
 * Includes ml/mg conversion for liquid preparations
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Section from "./Section";

// Common NSAIDs with typical tablet strengths
const NSAIDS_TABLETS = [
  { id: "ibuprofen", name: "Ibuprofen", strengths: [200, 400, 600, 800] },
  { id: "naproxen", name: "Naproxen", strengths: [220, 250, 375, 500] },
  { id: "diclofenac", name: "Diclofenac", strengths: [25, 50, 75, 100] },
  { id: "indomethacin", name: "Indomethacin", strengths: [25, 50, 75] },
  { id: "mefenamic_acid", name: "Mefenamic Acid (Ponstan)", strengths: [250, 500], special: true },
  { id: "piroxicam", name: "Piroxicam", strengths: [10, 20] },
  { id: "ketorolac", name: "Ketorolac", strengths: [10] },
  { id: "meloxicam", name: "Meloxicam", strengths: [7.5, 15] },
  { id: "celecoxib", name: "Celecoxib", strengths: [100, 200] },
  { id: "phenylbutazone", name: "Phenylbutazone", strengths: [100, 200], special: true },
];

// Common liquid NSAID preparations in Bahrain (concentration in mg/ml)
const NSAIDS_LIQUID = [
  { id: "ibuprofen_100_5", name: "Ibuprofen Syrup (Brufen/Nurofen)", concentration: "100mg/5ml", perMl: 20 },
  { id: "ibuprofen_200_5", name: "Ibuprofen Forte Syrup", concentration: "200mg/5ml", perMl: 40 },
  { id: "ibuprofen_infant_drops", name: "Ibuprofen Infant Drops", concentration: "40mg/ml", perMl: 40 },
  { id: "naproxen_susp", name: "Naproxen Suspension", concentration: "125mg/5ml", perMl: 25 },
  { id: "diclofenac_susp", name: "Diclofenac Suspension", concentration: "50mg/5ml", perMl: 10 },
  { id: "mefenamic_susp", name: "Mefenamic Acid (Ponstan) Suspension", concentration: "50mg/5ml", perMl: 10, special: true },
  { id: "custom", name: "Custom / Other", concentration: "", perMl: 0 },
];

const NSAIDToxicityApproach = ({ weight, expandedSections, toggleSection }) => {
  const [inputMode, setInputMode] = useState("mg"); // "mg" or "ml"
  const [selectedNSAID, setSelectedNSAID] = useState("");
  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [amountIngested, setAmountIngested] = useState("");
  const [numTablets, setNumTablets] = useState("");
  const [tabletStrength, setTabletStrength] = useState("");
  const [mlIngested, setMlIngested] = useState("");
  const [customConcentration, setCustomConcentration] = useState("");

  const w = parseFloat(weight) || 0;
  const amount = parseFloat(amountIngested) || 0;
  const tablets = parseFloat(numTablets) || 0;
  const strength = parseFloat(tabletStrength) || 0;
  const ml = parseFloat(mlIngested) || 0;
  const customConc = parseFloat(customConcentration) || 0;

  // Get selected data
  const selectedTabletData = NSAIDS_TABLETS.find(n => n.id === selectedNSAID);
  const selectedLiquidData = NSAIDS_LIQUID.find(l => l.id === selectedLiquid);

  // Calculate total dose and mg/kg
  const doseCalculation = useMemo(() => {
    let totalDose = 0;
    let drugName = "";
    let isSpecial = false;

    if (inputMode === "mg") {
      // Tablets mode
      if (tablets > 0 && strength > 0) {
        totalDose = tablets * strength;
      } else if (amount > 0) {
        totalDose = amount;
      }
      if (selectedTabletData) {
        drugName = selectedTabletData.name;
        isSpecial = selectedTabletData.special || false;
      }
    } else {
      // Liquid mode
      if (selectedLiquidData && ml > 0) {
        if (selectedLiquidData.id === "custom") {
          if (customConc <= 0) return null;
          totalDose = ml * customConc;
          drugName = "Custom Preparation";
        } else {
          totalDose = ml * selectedLiquidData.perMl;
          drugName = selectedLiquidData.name;
          isSpecial = selectedLiquidData.special || false;
        }
      }
    }
    
    if (totalDose <= 0) return null;
    
    const mgPerKg = w > 0 ? totalDose / w : 0;
    
    let severity = "minimal";
    let riskLevel = "Unlikely Significant Toxicity";
    let recommendation = "Observation at home may be appropriate";
    let observationTime = "4-6 hours";
    
    if (mgPerKg >= 400) {
      severity = "severe";
      riskLevel = "Severe Toxicity Risk";
      recommendation = "Hospital admission, close monitoring, activated charcoal if <2h";
      observationTime = "24 hours minimum";
    } else if (mgPerKg >= 100) {
      severity = "moderate";
      riskLevel = "Potential for Toxicity";
      recommendation = "ED evaluation recommended, activated charcoal if <2h";
      observationTime = isSpecial ? "24 hours" : "6-8 hours";
    } else if (isSpecial) {
      severity = "special";
      riskLevel = "Special Monitoring Required";
      recommendation = "24-hour observation for mefenamic acid/phenylbutazone";
      observationTime = "24 hours";
    }
    
    return {
      totalDose: totalDose.toFixed(0),
      mgPerKg: mgPerKg.toFixed(1),
      drugName,
      severity,
      riskLevel,
      recommendation,
      observationTime,
      isSpecial
    };
  }, [inputMode, selectedTabletData, selectedLiquidData, amount, tablets, strength, ml, customConc, w]);

  // Activated charcoal dosing
  const charcoalDose = useMemo(() => {
    if (w <= 0) return null;
    const dose = w * 1; // 1 g/kg
    return Math.min(dose, 50); // Max 50g
  }, [w]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">NSAID Toxicity</CardTitle>
        <CardDescription className="text-xs">Ibuprofen, Naproxen, Diclofenac & other NSAIDs - dose calculator & management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* Key Points */}
        <Section id="nsaid-key" title="Key Points About NSAID Overdose" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• NSAIDs are generally well-tolerated in overdose - severe toxicity is <strong className="text-foreground">uncommon</strong></p>
            <p>• <strong className="text-foreground">No specific antidote</strong> exists - management is supportive</p>
            <p>• Always screen for <strong className="text-foreground">acetaminophen and aspirin co-ingestion</strong></p>
            <p>• Hemodialysis is <strong className="text-foreground">ineffective</strong> due to high protein binding</p>
          </div>
        </Section>

        {/* Dose Calculator */}
        <Section id="nsaid-calc" title="NSAID Dose Calculator" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
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
                  <Label className="text-xs">NSAID Type</Label>
                  <Select value={selectedNSAID} onValueChange={(v) => {
                    setSelectedNSAID(v);
                    setTabletStrength("");
                  }}>
                    <SelectTrigger className="mt-1" data-testid="nsaid-selector">
                      <SelectValue placeholder="Select NSAID..." />
                    </SelectTrigger>
                    <SelectContent>
                      {NSAIDS_TABLETS.map(nsaid => (
                        <SelectItem key={nsaid.id} value={nsaid.id}>
                          {nsaid.name} {nsaid.special && "(⚠️ 24h)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Number of Tablets</Label>
                    <Input
                      type="text"
                  inputMode="decimal"
                      value={numTablets}
                      onChange={(e) => {
                        setNumTablets(e.target.value);
                        setAmountIngested("");
                      }}
                      placeholder="e.g., 10"
                      className="h-8 text-sm mt-1"
                      min="0"
                      data-testid="nsaid-tablets-input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tablet Strength (mg)</Label>
                    {selectedTabletData ? (
                      <Select value={tabletStrength} onValueChange={(v) => {
                        setTabletStrength(v);
                        setAmountIngested("");
                      }}>
                        <SelectTrigger className="mt-1 h-8">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedTabletData.strengths.map(s => (
                            <SelectItem key={s} value={s.toString()}>{s} mg</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type="text"
                  inputMode="decimal"
                        value={tabletStrength}
                        onChange={(e) => setTabletStrength(e.target.value)}
                        placeholder="mg"
                        className="h-8 text-sm mt-1"
                        min="0"
                      />
                    )}
                  </div>
                </div>
                
                <div className="text-center text-[10px] text-muted-foreground">— OR enter total mg directly —</div>
                
                <div>
                  <Label className="text-xs">Total Amount Ingested (mg)</Label>
                  <Input
                    type="text"
                  inputMode="decimal"
                    value={amountIngested}
                    onChange={(e) => {
                      setAmountIngested(e.target.value);
                      setNumTablets("");
                      setTabletStrength("");
                    }}
                    placeholder="e.g., 4000"
                    className="h-8 text-sm mt-1"
                    min="0"
                    data-testid="nsaid-amount-input"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-xs">Liquid NSAID Preparation (Bahrain)</Label>
                  <Select value={selectedLiquid} onValueChange={setSelectedLiquid}>
                    <SelectTrigger className="mt-1" data-testid="nsaid-liquid-selector">
                      <SelectValue placeholder="Select liquid preparation..." />
                    </SelectTrigger>
                    <SelectContent>
                      {NSAIDS_LIQUID.map(liquid => (
                        <SelectItem key={liquid.id} value={liquid.id}>
                          {liquid.name} {liquid.concentration && `(${liquid.concentration})`} {liquid.special && "⚠️"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedLiquidData && selectedLiquidData.special && (
                    <p className="text-[10px] text-amber-600 mt-1">⚠️ Requires 24-hour observation</p>
                  )}
                </div>

                {selectedLiquid === "custom" && (
                  <div>
                    <Label className="text-xs">Concentration (mg/ml)</Label>
                    <Input
                      type="text"
                  inputMode="decimal"
                      value={customConcentration}
                      onChange={(e) => setCustomConcentration(e.target.value)}
                      placeholder="e.g., 20"
                      className="h-8 text-sm mt-1"
                      min="0"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-xs">Volume Ingested (ml)</Label>
                  <Input
                    type="text"
                  inputMode="decimal"
                    value={mlIngested}
                    onChange={(e) => setMlIngested(e.target.value)}
                    placeholder="e.g., 30"
                    className="h-8 text-sm mt-1"
                    min="0"
                    data-testid="nsaid-ml-input"
                  />
                </div>

                {selectedLiquidData && selectedLiquidData.id !== "custom" && ml > 0 && (
                  <div className="text-[10px] p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="text-muted-foreground">
                      {ml} ml × {selectedLiquidData.perMl} mg/ml = <strong className="text-foreground">{(ml * selectedLiquidData.perMl).toFixed(0)} mg</strong>
                    </p>
                  </div>
                )}
              </>
            )}
            
            {/* Results */}
            {doseCalculation && (
              <div className={`p-3 rounded-lg text-xs space-y-2 border ${
                doseCalculation.severity === 'severe' ? 'bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100 border-red-200' :
                doseCalculation.severity === 'moderate' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 border-amber-200' :
                doseCalculation.severity === 'special' ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-900 border-purple-200' :
                'bg-green-50 dark:bg-green-950/30 text-green-900 border-green-200'
              }`}>
                {doseCalculation.drugName && (
                  <div>
                    <p className="text-[10px] opacity-70">Drug</p>
                    <p className="font-semibold">{doseCalculation.drugName}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] opacity-70">Total Dose</p>
                    <p className="font-bold text-lg">{doseCalculation.totalDose} mg</p>
                  </div>
                  {w > 0 && (
                    <div>
                      <p className="text-[10px] opacity-70">Dose per kg</p>
                      <p className="font-bold text-lg">{doseCalculation.mgPerKg} mg/kg</p>
                    </div>
                  )}
                </div>
                <div className="pt-2 border-t border-current/10">
                  <p className="font-bold">{doseCalculation.riskLevel}</p>
                  <p className="text-[10px] mt-1">{doseCalculation.recommendation}</p>
                  <p className="text-[10px] mt-1 font-semibold">Observation time: {doseCalculation.observationTime}</p>
                </div>
              </div>
            )}

            {/* Quick Reference */}
            <div className="text-[10px] p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold mb-1">Common Liquid Concentrations:</p>
              <p className="text-muted-foreground">Brufen/Nurofen 100mg/5ml (20mg/ml) • Forte 200mg/5ml (40mg/ml) • Infant Drops 40mg/ml</p>
            </div>
          </div>
        </Section>

        {/* Toxic Dose Thresholds */}
        <Section id="nsaid-toxic" title="Toxic Dose Thresholds" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
              <span className="w-24 font-bold text-green-700">&lt;100 mg/kg</span>
              <span className="text-muted-foreground">Unlikely to cause significant toxicity</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
              <span className="w-24 font-bold text-amber-700">100-400 mg/kg</span>
              <span className="text-muted-foreground">Potential for mild-moderate symptoms</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <span className="w-24 font-bold text-red-700">&gt;400 mg/kg</span>
              <span className="text-muted-foreground">Severe clinical toxicity risk</span>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded mt-2">
              <p className="font-semibold text-purple-700">⚠️ Special Cases - 24h Observation Required:</p>
              <p className="text-muted-foreground text-[10px] mt-1">
                <strong>Mefenamic Acid (Ponstan):</strong> Risk of seizures<br/>
                <strong>Phenylbutazone:</strong> Risk of seizures, metabolic acidosis, blood dyscrasias
              </p>
            </div>
          </div>
        </Section>

        {/* Clinical Manifestations */}
        <Section id="nsaid-clinical" title="Clinical Manifestations" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold text-green-700">Mild (Most Common)</p>
              <p className="text-muted-foreground">Nausea, vomiting, drowsiness, blurred vision, dizziness, tinnitus, abdominal pain</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold text-amber-700">Moderate</p>
              <p className="text-muted-foreground">Vertigo, diarrhea, headache, ataxia, altered mental status</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold text-red-700">Severe (Rare - typically &gt;400 mg/kg)</p>
              <div className="grid grid-cols-2 gap-2 mt-1 text-muted-foreground">
                <div><strong>Metabolic:</strong> Anion gap acidosis</div>
                <div><strong>Renal:</strong> AKI, hyperkalemia</div>
                <div><strong>CNS:</strong> Seizures, coma</div>
                <div><strong>CV:</strong> Hypotension, collapse</div>
              </div>
            </div>
          </div>
        </Section>

        {/* Management */}
        <Section id="nsaid-mgmt" title="Management Protocol" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">1. Stabilization (ABCs)</p>
              <p className="text-muted-foreground">Airway protection if needed. Aggressive intervention usually unnecessary.</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">2. GI Decontamination (if &lt;2 hours post-ingestion)</p>
              <p className="text-muted-foreground"><strong>Activated Charcoal:</strong> 1 g/kg (max 50g)</p>
              {charcoalDose && w > 0 && (
                <p className="font-mono text-slate-600 mt-1">→ For {w} kg patient: {charcoalDose.toFixed(0)} g activated charcoal</p>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">Assess aspiration risk before administration</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">3. Labs to Order</p>
              <p className="text-muted-foreground"><strong>Routine:</strong> Fingerstick glucose, acetaminophen level, salicylate level, ECG, pregnancy test</p>
              <p className="text-muted-foreground"><strong>If symptomatic:</strong> BMP, CBC, blood gas</p>
              <p className="text-[10px] text-amber-600 mt-1">Note: NSAID serum levels are NOT clinically useful</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">4. Supportive Care</p>
              <ul className="text-muted-foreground list-disc list-inside">
                <li>IV crystalloids for volume depletion</li>
                <li>Correct metabolic acidosis (bicarb for severe cases)</li>
                <li>Benzodiazepines for seizures</li>
                <li>Warming for hypothermia</li>
              </ul>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">5. Poison Control Consultation</p>
              <p className="text-muted-foreground">Recommended for massive ingestions or severe toxicity</p>
            </div>
          </div>
        </Section>

        {/* Disposition */}
        <Section id="nsaid-dispo" title="Disposition Guidelines" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
              <p className="font-semibold text-green-700">Safe for Discharge (after observation):</p>
              <ul className="list-disc list-inside text-muted-foreground mt-1">
                <li>Asymptomatic after 4-6 hours</li>
                <li>Ingestion &lt;100 mg/kg (except mefenamic/phenylbutazone)</li>
                <li>Non-suicidal intent</li>
                <li>No co-ingestions</li>
              </ul>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
              <p className="font-semibold text-amber-700">Extended Observation (6-8 hours):</p>
              <ul className="list-disc list-inside text-muted-foreground mt-1">
                <li>Longer half-life drugs (naproxen, piroxicam)</li>
                <li>Sustained-release formulations</li>
              </ul>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
              <p className="font-semibold text-purple-700">24-Hour Observation Required:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-1">
                <li><strong>Mefenamic acid (Ponstan)</strong> - risk of delayed seizures</li>
                <li><strong>Phenylbutazone</strong> - risk of seizures, acidosis, blood dyscrasias</li>
              </ul>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <p className="font-semibold text-red-700">Admit to Hospital:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-1">
                <li>Suicidal patients (psychiatry consult)</li>
                <li>Severe intoxication (pH &lt;7.3, AKI, altered mental status)</li>
                <li>Other medical or psychosocial concerns</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Quick Reference */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border text-center">
          <p className="font-bold text-sm mb-2">⚡ QUICK REFERENCE</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-green-600">Low Risk</p>
              <p>&lt;100 mg/kg</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-red-600">Severe</p>
              <p>&gt;400 mg/kg</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-blue-600">Charcoal</p>
              <p>If &lt;2h</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            No antidote • Check for acetaminophen/aspirin co-ingestion • Hemodialysis ineffective
          </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default NSAIDToxicityApproach;
