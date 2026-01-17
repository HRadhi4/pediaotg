/**
 * Iron Toxicity Approach Component
 * Includes elemental iron calculator and deferoxamine dosing protocols
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ArrowDown, Calculator, Beaker, Activity, Clock } from "lucide-react";

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

const Arrow = ({ label }) => (
  <div className="flex flex-col items-center py-2">
    <ArrowDown className="h-5 w-5 text-gray-400" />
    {label && <span className="text-[10px] text-muted-foreground mt-1">{label}</span>}
  </div>
);

// Iron salt elemental iron percentages
const IRON_SALTS = [
  { id: "ferrous_sulfate", name: "Ferrous Sulfate", elementalPercent: 20, example: "325mg tablet = 65mg elemental" },
  { id: "ferrous_sulfate_dried", name: "Ferrous Sulfate (Dried/Exsiccated)", elementalPercent: 32, example: "200mg = 64mg elemental" },
  { id: "ferrous_gluconate", name: "Ferrous Gluconate", elementalPercent: 12, example: "325mg tablet = 39mg elemental" },
  { id: "ferrous_fumarate", name: "Ferrous Fumarate", elementalPercent: 33, example: "325mg tablet = 107mg elemental" },
  { id: "carbonyl_iron", name: "Carbonyl Iron", elementalPercent: 98, example: "Pure elemental iron powder" },
  { id: "polysaccharide_iron", name: "Polysaccharide Iron Complex", elementalPercent: 100, example: "150mg = 150mg elemental" },
  { id: "iron_dextran", name: "Iron Dextran", elementalPercent: 100, example: "Already elemental iron" },
];

const IronToxicityApproach = ({ weight }) => {
  const [selectedSalt, setSelectedSalt] = useState("");
  const [amountIngested, setAmountIngested] = useState("");
  const [serumIron, setSerumIron] = useState("");
  const [hoursPostIngestion, setHoursPostIngestion] = useState("");

  const w = parseFloat(weight) || 0;
  const amount = parseFloat(amountIngested) || 0;
  const serum = parseFloat(serumIron) || 0;

  // Calculate elemental iron ingested
  const ironCalculation = useMemo(() => {
    if (!selectedSalt || amount <= 0) return null;
    
    const salt = IRON_SALTS.find(s => s.id === selectedSalt);
    if (!salt) return null;
    
    const elementalIron = amount * (salt.elementalPercent / 100);
    const mgPerKg = w > 0 ? elementalIron / w : 0;
    
    let severity = "minimal";
    let riskLevel = "Low risk";
    let recommendation = "Observation at home may be appropriate";
    
    if (mgPerKg >= 120) {
      severity = "lethal";
      riskLevel = "Potentially Lethal";
      recommendation = "Immediate ICU admission, chelation therapy, aggressive resuscitation";
    } else if (mgPerKg >= 60) {
      severity = "severe";
      riskLevel = "Severe Toxicity Expected";
      recommendation = "Hospital admission, likely chelation with deferoxamine";
    } else if (mgPerKg >= 40) {
      severity = "moderate";
      riskLevel = "Moderate Toxicity Possible";
      recommendation = "ED evaluation, serum iron level, observation";
    } else if (mgPerKg >= 20) {
      severity = "mild";
      riskLevel = "Mild GI Symptoms Possible";
      recommendation = "Consider ED evaluation if symptomatic";
    }
    
    return {
      saltName: salt.name,
      elementalPercent: salt.elementalPercent,
      elementalIron: elementalIron.toFixed(1),
      mgPerKg: mgPerKg.toFixed(1),
      severity,
      riskLevel,
      recommendation
    };
  }, [selectedSalt, amount, w]);

  // Deferoxamine dosing
  const deferoxamineDosing = useMemo(() => {
    if (w <= 0) return null;
    
    const initialDose = w * 15; // 15 mg/kg/hour
    const maxInitialHourly = Math.min(initialDose, 1000); // Max 1g/hour initially
    const maintenanceDose = w * 10; // 10 mg/kg/hour (reduced)
    const maxDailyDose = 6000; // 6g max daily
    
    return {
      initialRate: maxInitialHourly.toFixed(0),
      initialRatePerKg: 15,
      maintenanceRate: maintenanceDose.toFixed(0),
      maintenanceRatePerKg: 10,
      maxDaily: maxDailyDose,
      infusionDuration: "Continue until clinical improvement + serum iron <300 mcg/dL"
    };
  }, [w]);

  // Serum iron interpretation
  const serumInterpretation = useMemo(() => {
    if (serum <= 0) return null;
    
    let severity, recommendation;
    if (serum >= 500) {
      severity = "critical";
      recommendation = "Chelation therapy strongly indicated";
    } else if (serum >= 350) {
      severity = "high";
      recommendation = "Consider chelation, close monitoring";
    } else if (serum >= 150) {
      severity = "elevated";
      recommendation = "Monitor closely, supportive care";
    } else {
      severity = "normal";
      recommendation = "Unlikely to develop significant toxicity";
    }
    
    return { severity, recommendation, level: serum };
  }, [serum]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Iron Toxicity
        </CardTitle>
        <CardDescription className="text-xs">Elemental iron calculator, toxicity staging & deferoxamine protocol</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Elemental Iron Calculator */}
        <div className="border-2 border-orange-400 rounded-lg p-3 bg-orange-50/50 dark:bg-orange-950/20">
          <p className="font-bold text-orange-700 mb-3 flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Elemental Iron Calculator
          </p>
          
          <div className="space-y-3">
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
                placeholder="e.g., 650 (two 325mg tablets)"
                className="h-8 text-sm mt-1"
                min="0"
                data-testid="iron-amount-input"
              />
            </div>
            
            {/* Results */}
            {ironCalculation && (
              <div className={`p-3 rounded-lg text-xs space-y-2 ${
                ironCalculation.severity === 'lethal' ? 'bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-100' :
                ironCalculation.severity === 'severe' ? 'bg-red-100 dark:bg-red-900/30 text-red-800' :
                ironCalculation.severity === 'moderate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800' :
                ironCalculation.severity === 'mild' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800' :
                'bg-green-100 dark:bg-green-900/30 text-green-800'
              }`}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] opacity-70">Iron Salt</p>
                    <p className="font-semibold">{ironCalculation.saltName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-70">Elemental %</p>
                    <p className="font-semibold">{ironCalculation.elementalPercent}%</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-current/20">
                  <p className="text-[10px] opacity-70">Elemental Iron Ingested</p>
                  <p className="font-bold text-lg">{ironCalculation.elementalIron} mg</p>
                </div>
                {w > 0 && (
                  <div className="pt-2 border-t border-current/20">
                    <p className="text-[10px] opacity-70">Dose per Body Weight</p>
                    <p className="font-bold text-lg">{ironCalculation.mgPerKg} mg/kg</p>
                  </div>
                )}
                <div className="pt-2 border-t border-current/20">
                  <p className="font-bold">{ironCalculation.riskLevel}</p>
                  <p className="text-[10px] mt-1">{ironCalculation.recommendation}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Reference Table */}
          <div className="mt-3 text-[10px]">
            <p className="font-semibold mb-1">Common Iron Preparations:</p>
            <div className="grid grid-cols-2 gap-1">
              {IRON_SALTS.slice(0, 4).map(salt => (
                <div key={salt.id} className="p-1.5 bg-white/50 dark:bg-black/20 rounded">
                  <p className="font-medium">{salt.name}</p>
                  <p className="text-muted-foreground">{salt.elementalPercent}% elemental</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toxic Dose Thresholds */}
        <FlowNode type="danger">
          <p className="font-bold text-red-700 mb-2">⚠️ Toxic Dose Thresholds (Elemental Iron)</p>
          <div className="space-y-2 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="w-20 font-bold text-green-600">&lt;20 mg/kg</span>
              <span>Non-toxic - observation at home</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 font-bold text-yellow-600">20-40 mg/kg</span>
              <span>Mild GI symptoms possible - consider evaluation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 font-bold text-amber-600">40-60 mg/kg</span>
              <span>Moderate toxicity - ED evaluation recommended</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 font-bold text-red-600">&gt;60 mg/kg</span>
              <span>Severe systemic toxicity expected - hospitalization</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 font-bold text-red-800">&gt;120 mg/kg</span>
              <span>POTENTIALLY LETHAL - ICU, chelation, aggressive resuscitation</span>
            </div>
          </div>
        </FlowNode>

        {/* Clinical Stages */}
        <FlowNode type="info">
          <p className="font-semibold mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Clinical Stages of Iron Poisoning
          </p>
          <div className="space-y-2 text-[10px]">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p className="font-bold text-red-700">Stage 1: GI Phase (0.5-6 hours)</p>
              <p>Nausea, vomiting, abdominal pain, diarrhea, hematemesis, melena</p>
              <p className="text-[9px] text-muted-foreground mt-1">Direct corrosive injury to GI mucosa</p>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded">
              <p className="font-bold text-amber-700">Stage 2: Latent Phase (6-24 hours)</p>
              <p>Apparent clinical improvement - GI symptoms resolve</p>
              <p className="text-[9px] text-muted-foreground mt-1">⚠️ Can be misleading - iron absorption continues</p>
            </div>
            <div className="p-2 bg-red-200 dark:bg-red-900/40 rounded">
              <p className="font-bold text-red-800">Stage 3: Shock/Metabolic Phase (6-72 hours)</p>
              <p>Hypotension, metabolic acidosis, lethargy, coma, multi-organ failure</p>
              <p className="text-[9px] text-muted-foreground mt-1">Cellular toxicity from free iron</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
              <p className="font-bold text-purple-700">Stage 4: Hepatic Phase (12-96 hours)</p>
              <p>Jaundice, coagulopathy, hypoglycemia, hepatic necrosis</p>
              <p className="text-[9px] text-muted-foreground mt-1">Peak hepatotoxicity - may be fatal</p>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <p className="font-bold">Stage 5: Late/Delayed Phase (2-8 weeks)</p>
              <p>Gastric outlet obstruction, pyloric stenosis, bowel strictures</p>
              <p className="text-[9px] text-muted-foreground mt-1">Scarring from mucosal injury; rare Yersinia infection</p>
            </div>
          </div>
          <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-[10px]">
            <p className="font-semibold text-green-700">✓ No symptoms by 6 hours = significant toxicity unlikely</p>
          </div>
        </FlowNode>

        {/* Serum Iron Level Input */}
        <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950/20">
          <p className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Serum Iron Interpretation
          </p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <Label className="text-xs">Serum Iron (mcg/dL)</Label>
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
            <div>
              <Label className="text-xs">Hours Post-Ingestion</Label>
              <Input
                type="number"
                value={hoursPostIngestion}
                onChange={(e) => setHoursPostIngestion(e.target.value)}
                placeholder="e.g., 4"
                className="h-8 text-sm mt-1"
                min="0"
                data-testid="hours-input"
              />
            </div>
          </div>
          
          {serumInterpretation && (
            <div className={`p-2 rounded text-xs ${
              serumInterpretation.severity === 'critical' ? 'bg-red-200 text-red-900' :
              serumInterpretation.severity === 'high' ? 'bg-amber-200 text-amber-900' :
              serumInterpretation.severity === 'elevated' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              <p className="font-bold">Serum Iron: {serumInterpretation.level} mcg/dL</p>
              <p>{serumInterpretation.recommendation}</p>
            </div>
          )}
          
          <div className="mt-2 text-[10px] text-muted-foreground">
            <p><strong>Draw level 4-6 hours post-ingestion</strong> for peak assessment</p>
            <p className="mt-1">
              <span className="text-green-600">&lt;150:</span> Normal | 
              <span className="text-yellow-600 ml-1">150-350:</span> Elevated | 
              <span className="text-amber-600 ml-1">350-500:</span> High | 
              <span className="text-red-600 ml-1">&gt;500:</span> Critical (chelate)
            </p>
          </div>
        </div>

        {/* Initial Management */}
        <FlowNode type="action">
          <p className="font-bold text-green-700 mb-2">Initial Management</p>
          <div className="space-y-2 text-[10px]">
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">1. Supportive Care</p>
              <p>IV access, fluid resuscitation (20mL/kg boluses), correct metabolic acidosis</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">2. Decontamination</p>
              <p>Whole bowel irrigation (WBI) if visible tablets on X-ray</p>
              <p className="text-muted-foreground">Activated charcoal NOT effective for iron</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">3. Labs to Order</p>
              <p>Serum iron (4-6h), CBC, BMP, LFTs, coags (PT/INR), glucose, ABG/VBG</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">4. Imaging</p>
              <p>Abdominal X-ray - iron tablets are radiopaque</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">5. Contact Poison Control</p>
              <p>Early consultation for all significant ingestions</p>
            </div>
          </div>
        </FlowNode>

        {/* Deferoxamine Protocol */}
        <div className="border-2 border-blue-400 rounded-lg p-3 bg-blue-50/50 dark:bg-blue-950/20">
          <p className="font-bold text-blue-700 mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Deferoxamine (Desferal) Protocol
          </p>
          
          {/* Indications */}
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded mb-3 text-[10px]">
            <p className="font-semibold text-amber-800">Indications for Chelation:</p>
            <ul className="list-disc list-inside text-amber-700 mt-1">
              <li>Serum iron &gt;500 mcg/dL</li>
              <li>Ingestion &gt;60 mg/kg elemental iron with symptoms</li>
              <li>Metabolic acidosis</li>
              <li>Shock or cardiovascular compromise</li>
              <li>Altered mental status</li>
              <li>Persistent vomiting/diarrhea</li>
            </ul>
          </div>

          {/* Dosing */}
          <div className="space-y-2 text-[10px]">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <p className="font-bold text-blue-700">IV Deferoxamine Dosing</p>
              <div className="mt-1 space-y-1">
                <p><strong>Initial:</strong> 15 mg/kg/hour IV (max 1 g/hour)</p>
                <p><strong>Maintenance:</strong> Reduce to 8-10 mg/kg/hour after stabilization</p>
                <p><strong>Max daily:</strong> 6 g/24 hours</p>
                {deferoxamineDosing && w > 0 && (
                  <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded font-mono">
                    <p className="text-blue-600 font-semibold">For {w} kg patient:</p>
                    <p>Initial rate: <strong>{deferoxamineDosing.initialRate} mg/hour</strong></p>
                    <p>Maintenance: <strong>{deferoxamineDosing.maintenanceRate} mg/hour</strong></p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <p className="font-bold text-green-700">When to Stop Deferoxamine:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Clinical improvement (resolution of acidosis, shock)</li>
                <li>Serum iron &lt;300 mcg/dL</li>
                <li>Urine color normalizes (no longer "vin rosé")</li>
                <li>Usually 24-48 hours of treatment</li>
              </ul>
            </div>

            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">Side Effects to Monitor:</p>
              <p className="text-amber-600">Hypotension (infuse slowly), "vin rosé" urine (expected), pulmonary toxicity if &gt;24h, vision/hearing changes</p>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg border">
          <p className="font-bold text-sm mb-2 text-center">⚡ QUICK REFERENCE</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-amber-600">Mild</p>
              <p>&lt;40 mg/kg</p>
            </div>
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-red-600">Severe</p>
              <p>&gt;60 mg/kg</p>
            </div>
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-blue-600">Chelate if</p>
              <p>Fe &gt;500 mcg/dL</p>
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] text-muted-foreground">
            <p>Activated charcoal does NOT bind iron | Iron tablets are radiopaque on X-ray</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default IronToxicityApproach;
