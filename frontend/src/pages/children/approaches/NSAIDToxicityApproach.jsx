/**
 * NSAID Toxicity Approach Component
 * Based on UpToDate guidelines for NSAID poisoning
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ArrowDown, Calculator, Beaker, Activity, Clock, Pill } from "lucide-react";

const FlowNode = ({ children, type = "default", className = "" }) => {
  const styles = {
    start: "bg-blue-500 text-white border-blue-600",
    decision: "bg-amber-100 dark:bg-amber-900/30 border-amber-400 text-amber-800 dark:text-amber-200",
    action: "bg-green-50 dark:bg-green-900/20 border-green-400",
    danger: "bg-red-50 dark:bg-red-900/20 border-red-400",
    info: "bg-gray-50 dark:bg-gray-800 border-gray-300",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-300",
    success: "bg-green-100 dark:bg-green-900/30 border-green-500",
  };
  return (
    <div className={`p-3 rounded-lg border-2 text-xs ${styles[type]} ${className}`}>
      {children}
    </div>
  );
};

// Common NSAIDs with typical tablet strengths
const NSAIDS = [
  { id: "ibuprofen", name: "Ibuprofen", strengths: [200, 400, 600, 800], unit: "mg" },
  { id: "naproxen", name: "Naproxen", strengths: [220, 250, 375, 500], unit: "mg" },
  { id: "diclofenac", name: "Diclofenac", strengths: [25, 50, 75, 100], unit: "mg" },
  { id: "indomethacin", name: "Indomethacin", strengths: [25, 50, 75], unit: "mg" },
  { id: "mefenamic_acid", name: "Mefenamic Acid", strengths: [250, 500], unit: "mg", special: true },
  { id: "piroxicam", name: "Piroxicam", strengths: [10, 20], unit: "mg" },
  { id: "ketorolac", name: "Ketorolac", strengths: [10], unit: "mg" },
  { id: "meloxicam", name: "Meloxicam", strengths: [7.5, 15], unit: "mg" },
  { id: "celecoxib", name: "Celecoxib", strengths: [100, 200], unit: "mg" },
  { id: "phenylbutazone", name: "Phenylbutazone", strengths: [100, 200], unit: "mg", special: true },
];

const NSAIDToxicityApproach = ({ weight }) => {
  const [selectedNSAID, setSelectedNSAID] = useState("");
  const [amountIngested, setAmountIngested] = useState("");
  const [numTablets, setNumTablets] = useState("");
  const [tabletStrength, setTabletStrength] = useState("");

  const w = parseFloat(weight) || 0;
  const amount = parseFloat(amountIngested) || 0;
  const tablets = parseFloat(numTablets) || 0;
  const strength = parseFloat(tabletStrength) || 0;

  // Get selected NSAID details
  const selectedNSAIDData = NSAIDS.find(n => n.id === selectedNSAID);

  // Calculate total dose and mg/kg
  const doseCalculation = useMemo(() => {
    let totalDose = amount;
    
    // If tablets and strength provided, calculate total
    if (tablets > 0 && strength > 0) {
      totalDose = tablets * strength;
    }
    
    if (totalDose <= 0) return null;
    
    const mgPerKg = w > 0 ? totalDose / w : 0;
    
    let severity = "minimal";
    let riskLevel = "Unlikely Significant Toxicity";
    let recommendation = "Observation at home may be appropriate";
    let observationTime = "4-6 hours";
    
    // Special handling for mefenamic acid and phenylbutazone
    const isSpecial = selectedNSAIDData?.special;
    
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
      severity,
      riskLevel,
      recommendation,
      observationTime,
      isSpecial
    };
  }, [amount, tablets, strength, w, selectedNSAIDData]);

  // Activated charcoal dosing
  const charcoalDose = useMemo(() => {
    if (w <= 0) return null;
    const dose = w * 1; // 1 g/kg
    return Math.min(dose, 50); // Max 50g
  }, [w]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-500" />
          NSAID Toxicity
        </CardTitle>
        <CardDescription className="text-xs">Ibuprofen, Naproxen, Diclofenac & other NSAIDs - dose calculator & management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Key Points */}
        <FlowNode type="info">
          <p className="font-semibold mb-2">Key Points About NSAID Overdose</p>
          <div className="space-y-1 text-[10px]">
            <p>• NSAIDs are generally well-tolerated in overdose - severe toxicity is <strong>uncommon</strong></p>
            <p>• <strong>No specific antidote</strong> exists - management is supportive</p>
            <p>• Always screen for <strong>acetaminophen and aspirin co-ingestion</strong></p>
            <p>• Hemodialysis is <strong>ineffective</strong> due to high protein binding</p>
          </div>
        </FlowNode>

        {/* Dose Calculator */}
        <div className="border-2 border-blue-400 rounded-lg p-3 bg-blue-50/50 dark:bg-blue-950/20">
          <p className="font-bold text-blue-700 mb-3 flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            NSAID Dose Calculator
          </p>
          
          <div className="space-y-3">
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
                  {NSAIDS.map(nsaid => (
                    <SelectItem key={nsaid.id} value={nsaid.id}>
                      {nsaid.name} {nsaid.special && "(⚠️ 24h observation)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Two ways to calculate: direct amount OR tablets x strength */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Number of Tablets</Label>
                <Input
                  type="number"
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
                {selectedNSAIDData ? (
                  <Select value={tabletStrength} onValueChange={(v) => {
                    setTabletStrength(v);
                    setAmountIngested("");
                  }}>
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedNSAIDData.strengths.map(s => (
                        <SelectItem key={s} value={s.toString()}>{s} mg</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="number"
                    value={tabletStrength}
                    onChange={(e) => setTabletStrength(e.target.value)}
                    placeholder="mg"
                    className="h-8 text-sm mt-1"
                    min="0"
                  />
                )}
              </div>
            </div>
            
            <div className="text-center text-[10px] text-muted-foreground">— OR —</div>
            
            <div>
              <Label className="text-xs">Total Amount Ingested (mg)</Label>
              <Input
                type="number"
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
            
            {/* Results */}
            {doseCalculation && (
              <div className={`p-3 rounded-lg text-xs space-y-2 ${
                doseCalculation.severity === 'severe' ? 'bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-100' :
                doseCalculation.severity === 'moderate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800' :
                doseCalculation.severity === 'special' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800' :
                'bg-green-100 dark:bg-green-900/30 text-green-800'
              }`}>
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
                <div className="pt-2 border-t border-current/20">
                  <p className="font-bold">{doseCalculation.riskLevel}</p>
                  <p className="text-[10px] mt-1">{doseCalculation.recommendation}</p>
                  <p className="text-[10px] mt-1 font-semibold">
                    Observation time: {doseCalculation.observationTime}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toxic Dose Thresholds */}
        <FlowNode type="danger">
          <p className="font-bold text-red-700 mb-2">⚠️ Toxic Dose Thresholds</p>
          <div className="space-y-2 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="w-24 font-bold text-green-600">&lt;100 mg/kg</span>
              <span>Unlikely to cause significant toxicity (most NSAIDs)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 font-bold text-amber-600">100-400 mg/kg</span>
              <span>Potential for mild-moderate symptoms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 font-bold text-red-600">&gt;400 mg/kg</span>
              <span>Severe clinical toxicity risk</span>
            </div>
          </div>
          <div className="mt-2 p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
            <p className="font-semibold text-purple-800">⚠️ Special Cases - 24h Observation Required:</p>
            <p className="text-purple-700 text-[10px] mt-1">
              <strong>Mefenamic Acid:</strong> Risk of seizures<br/>
              <strong>Phenylbutazone:</strong> Risk of seizures, metabolic acidosis, aplastic anemia, agranulocytosis
            </p>
          </div>
        </FlowNode>

        {/* Clinical Manifestations */}
        <FlowNode type="info">
          <p className="font-semibold mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Clinical Manifestations
          </p>
          <div className="space-y-2 text-[10px]">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <p className="font-bold text-green-700">Mild (Most Common)</p>
              <p>Nausea, vomiting, drowsiness, blurred vision, dizziness, tinnitus, abdominal pain</p>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded">
              <p className="font-bold text-amber-700">Moderate</p>
              <p>Vertigo, diarrhea, headache, ataxia, altered mental status</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p className="font-bold text-red-700">Severe (Rare - typically &gt;400 mg/kg)</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="font-semibold">Metabolic</p>
                  <p>Anion gap metabolic acidosis</p>
                </div>
                <div>
                  <p className="font-semibold">Renal</p>
                  <p>AKI, hyperkalemia, oliguria</p>
                </div>
                <div>
                  <p className="font-semibold">CNS</p>
                  <p>Seizures, coma</p>
                </div>
                <div>
                  <p className="font-semibold">Cardiovascular</p>
                  <p>Hypotension, CV collapse</p>
                </div>
              </div>
            </div>
          </div>
        </FlowNode>

        {/* Management */}
        <FlowNode type="action">
          <p className="font-bold text-green-700 mb-2">Management Protocol</p>
          <div className="space-y-2 text-[10px]">
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">1. Stabilization (ABCs)</p>
              <p>Airway protection, respiratory support if needed. Aggressive intervention usually unnecessary.</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">2. GI Decontamination (if &lt;2 hours post-ingestion)</p>
              <p><strong>Activated Charcoal:</strong> 1 g/kg (max 50g)</p>
              {charcoalDose && w > 0 && (
                <p className="font-mono text-blue-600 mt-1">→ For {w} kg patient: {charcoalDose.toFixed(0)} g activated charcoal</p>
              )}
              <p className="text-muted-foreground mt-1">Assess aspiration risk before administration</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">3. Labs to Order</p>
              <p><strong>Routine:</strong> Fingerstick glucose, acetaminophen level, salicylate level, ECG, pregnancy test</p>
              <p><strong>If symptomatic/massive ingestion:</strong> BMP, CBC, blood gas</p>
              <p className="text-amber-600 font-semibold mt-1">Note: NSAID serum levels are NOT clinically useful</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">4. Supportive Care</p>
              <p>• IV crystalloids for volume depletion</p>
              <p>• Correct metabolic acidosis (consider bicarb for severe cases)</p>
              <p>• Benzodiazepines for seizures</p>
              <p>• Warming for hypothermia</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">5. Poison Control Consultation</p>
              <p>Recommended for massive ingestions or severe toxicity</p>
            </div>
          </div>
        </FlowNode>

        {/* Disposition */}
        <div className="border-2 border-green-400 rounded-lg p-3 bg-green-50/50 dark:bg-green-950/20">
          <p className="font-bold text-green-700 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Disposition Guidelines
          </p>
          <div className="space-y-2 text-[10px]">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <p className="font-bold text-green-700">Safe for Discharge (after observation):</p>
              <ul className="list-disc list-inside mt-1">
                <li>Asymptomatic after 4-6 hours</li>
                <li>Ingestion &lt;100 mg/kg (except mefenamic acid/phenylbutazone)</li>
                <li>Non-suicidal intent</li>
                <li>No co-ingestions</li>
              </ul>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded">
              <p className="font-bold text-amber-700">Extended Observation (6-8 hours):</p>
              <ul className="list-disc list-inside mt-1">
                <li>Longer half-life drugs (e.g., naproxen, piroxicam)</li>
                <li>Sustained-release formulations</li>
              </ul>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
              <p className="font-bold text-purple-700">24-Hour Observation Required:</p>
              <ul className="list-disc list-inside mt-1">
                <li><strong>Mefenamic acid</strong> - risk of delayed seizures</li>
                <li><strong>Phenylbutazone</strong> - risk of seizures, acidosis, blood dyscrasias</li>
              </ul>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p className="font-bold text-red-700">Admit to Hospital:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Suicidal patients (psychiatry consult)</li>
                <li>Severe intoxication (pH &lt;7.3, AKI, altered mental status)</li>
                <li>Other medical or psychosocial concerns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg border">
          <p className="font-bold text-sm mb-2 text-center">⚡ QUICK REFERENCE</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-green-600">Low Risk</p>
              <p>&lt;100 mg/kg</p>
            </div>
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-red-600">Severe</p>
              <p>&gt;400 mg/kg</p>
            </div>
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-blue-600">Charcoal</p>
              <p>If &lt;2h</p>
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] text-muted-foreground">
            <p>No antidote | Check for acetaminophen/aspirin co-ingestion | Hemodialysis ineffective</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default NSAIDToxicityApproach;
