/**
 * Acetaminophen (Paracetamol) Toxicity Approach Component
 * Includes Rumack-Matthew Nomogram and NAC treatment protocols
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowDown, Clock, Beaker, Activity } from "lucide-react";

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

// Rumack-Matthew Nomogram treatment line data points
// Time (hours) -> Acetaminophen concentration (mcg/mL)
const NOMOGRAM_TREATMENT_LINE = [
  { hours: 4, concentration: 150 },
  { hours: 6, concentration: 100 },
  { hours: 8, concentration: 70 },
  { hours: 10, concentration: 50 },
  { hours: 12, concentration: 37 },
  { hours: 14, concentration: 27 },
  { hours: 16, concentration: 20 },
  { hours: 18, concentration: 15 },
  { hours: 20, concentration: 10 },
  { hours: 22, concentration: 7 },
  { hours: 24, concentration: 5 },
];

// Possible hepatotoxicity line (higher threshold)
const PROBABLE_TOXICITY_LINE = [
  { hours: 4, concentration: 200 },
  { hours: 6, concentration: 133 },
  { hours: 8, concentration: 100 },
  { hours: 10, concentration: 67 },
  { hours: 12, concentration: 50 },
  { hours: 14, concentration: 37 },
  { hours: 16, concentration: 27 },
  { hours: 18, concentration: 20 },
  { hours: 20, concentration: 13 },
  { hours: 22, concentration: 10 },
  { hours: 24, concentration: 7 },
];

const AcetaminophenApproach = ({ weight }) => {
  const [hoursPostIngestion, setHoursPostIngestion] = useState("");
  const [serumLevel, setSerumLevel] = useState("");
  const [ingestionDose, setIngestionDose] = useState("");

  const w = parseFloat(weight) || 0;
  const hours = parseFloat(hoursPostIngestion) || 0;
  const level = parseFloat(serumLevel) || 0;
  const dose = parseFloat(ingestionDose) || 0;

  // Calculate mg/kg ingested
  const mgPerKg = w > 0 && dose > 0 ? dose / w : 0;

  // Determine if treatment line is crossed
  const assessNomogram = useMemo(() => {
    if (hours < 4 || hours > 24 || level <= 0) return null;
    
    // Find the treatment threshold for this time point
    let treatmentThreshold = 0;
    let probableThreshold = 0;
    
    for (let i = 0; i < NOMOGRAM_TREATMENT_LINE.length - 1; i++) {
      const p1 = NOMOGRAM_TREATMENT_LINE[i];
      const p2 = NOMOGRAM_TREATMENT_LINE[i + 1];
      if (hours >= p1.hours && hours <= p2.hours) {
        // Linear interpolation
        const ratio = (hours - p1.hours) / (p2.hours - p1.hours);
        treatmentThreshold = p1.concentration + ratio * (p2.concentration - p1.concentration);
        break;
      }
    }
    
    for (let i = 0; i < PROBABLE_TOXICITY_LINE.length - 1; i++) {
      const p1 = PROBABLE_TOXICITY_LINE[i];
      const p2 = PROBABLE_TOXICITY_LINE[i + 1];
      if (hours >= p1.hours && hours <= p2.hours) {
        const ratio = (hours - p1.hours) / (p2.hours - p1.hours);
        probableThreshold = p1.concentration + ratio * (p2.concentration - p1.concentration);
        break;
      }
    }
    
    return {
      treatmentThreshold: Math.round(treatmentThreshold),
      probableThreshold: Math.round(probableThreshold),
      needsTreatment: level >= treatmentThreshold,
      probableToxicity: level >= probableThreshold
    };
  }, [hours, level]);

  // NAC dosing calculations
  const nacDosing = useMemo(() => {
    if (w <= 0) return null;
    
    const loadingDose = w * 150; // 150 mg/kg
    const maintenanceBag1 = w * 50; // 50 mg/kg over 4 hours
    const maintenanceBag2 = w * 100; // 100 mg/kg over 16 hours
    
    // 2-bag protocol
    const twoBagLoading = w * 200; // 200 mg/kg over 4 hours
    const twoBagMaintenance = w * 100; // 100 mg/kg over 16 hours
    
    // Oral NAC
    const oralLoading = w * 140; // 140 mg/kg
    const oralMaintenance = w * 70; // 70 mg/kg q4h x17 doses
    
    return {
      // 3-bag IV protocol (21 hours)
      iv3bag: {
        loading: Math.min(loadingDose, 15000), // max 15g
        bag1: Math.min(maintenanceBag1, 5000),
        bag2: Math.min(maintenanceBag2, 10000),
      },
      // 2-bag IV protocol (20 hours)
      iv2bag: {
        loading: Math.min(twoBagLoading, 20000), // max 20g
        maintenance: Math.min(twoBagMaintenance, 10000), // max 10g
      },
      // Oral protocol (72 hours)
      oral: {
        loading: Math.min(oralLoading, 15000),
        maintenance: Math.min(oralMaintenance, 7500),
      }
    };
  }, [w]);

  // SVG Nomogram dimensions
  const svgWidth = 320;
  const svgHeight = 280;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  // Scale functions
  const xScale = (h) => margin.left + ((h - 4) / 20) * chartWidth;
  const yScale = (c) => margin.top + chartHeight - (Math.log10(c) / Math.log10(300)) * chartHeight;

  // Generate path for treatment line
  const treatmentPath = NOMOGRAM_TREATMENT_LINE.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(p.hours)} ${yScale(p.concentration)}`
  ).join(' ');

  const probablePath = PROBABLE_TOXICITY_LINE.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(p.hours)} ${yScale(p.concentration)}`
  ).join(' ');

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Acetaminophen (Paracetamol) Toxicity
        </CardTitle>
        <CardDescription className="text-xs">Risk assessment, Rumack-Matthew Nomogram & NAC protocols</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Toxic Doses */}
        <FlowNode type="danger">
          <p className="font-bold text-red-700 mb-2">⚠️ Toxic Dose Thresholds</p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p className="font-semibold">Acute Single Ingestion</p>
              <p>≥150 mg/kg OR ≥7.5 g total</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p className="font-semibold">Chronic/Repeated</p>
              <p>≥150 mg/kg/day for ≥2 days</p>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded col-span-2">
              <p className="font-semibold">High Risk Patients</p>
              <p>Alcoholism, malnutrition, CYP2E1 inducers, fasting - consider treatment at lower thresholds</p>
            </div>
          </div>
        </FlowNode>

        {/* Clinical Phases */}
        <FlowNode type="info">
          <p className="font-semibold mb-2">Clinical Phases of Toxicity</p>
          <div className="space-y-2 text-[10px]">
            <div className="flex gap-2">
              <div className="w-16 shrink-0 font-bold text-blue-600">Phase I<br/>(0-24h)</div>
              <div>Nausea, vomiting, anorexia, malaise, diaphoresis. May be asymptomatic!</div>
            </div>
            <div className="flex gap-2">
              <div className="w-16 shrink-0 font-bold text-amber-600">Phase II<br/>(24-72h)</div>
              <div>RUQ pain, elevated AST/ALT, elevated PT/INR. Symptoms may improve briefly.</div>
            </div>
            <div className="flex gap-2">
              <div className="w-16 shrink-0 font-bold text-red-600">Phase III<br/>(72-96h)</div>
              <div>Peak hepatotoxicity: jaundice, coagulopathy, encephalopathy, renal failure. AST/ALT may exceed 10,000.</div>
            </div>
            <div className="flex gap-2">
              <div className="w-16 shrink-0 font-bold text-green-600">Phase IV<br/>(4d-2wk)</div>
              <div>Recovery or death. Complete hepatic recovery if patient survives.</div>
            </div>
          </div>
        </FlowNode>

        {/* Calculator Section */}
        <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950/20">
          <p className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Risk Assessment Calculator
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label className="text-xs">Amount Ingested (mg)</Label>
              <Input
                type="number"
                value={ingestionDose}
                onChange={(e) => setIngestionDose(e.target.value)}
                placeholder="e.g., 5000"
                className="h-8 text-sm"
                min="0"
              />
            </div>
            <div>
              <Label className="text-xs">Hours Post-Ingestion</Label>
              <Input
                type="number"
                value={hoursPostIngestion}
                onChange={(e) => setHoursPostIngestion(e.target.value)}
                placeholder="4-24"
                className="h-8 text-sm"
                min="0"
                max="24"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Serum Acetaminophen Level (mcg/mL)</Label>
              <Input
                type="number"
                value={serumLevel}
                onChange={(e) => setSerumLevel(e.target.value)}
                placeholder="e.g., 150"
                className="h-8 text-sm"
                min="0"
              />
            </div>
          </div>
          
          {/* Results */}
          {mgPerKg > 0 && (
            <div className={`p-2 rounded text-xs mb-2 ${mgPerKg >= 150 ? 'bg-red-100 text-red-800' : mgPerKg >= 100 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
              <strong>Ingestion: {mgPerKg.toFixed(1)} mg/kg</strong>
              {mgPerKg >= 150 && " — POTENTIALLY TOXIC, assess with nomogram"}
              {mgPerKg >= 100 && mgPerKg < 150 && " — Borderline, monitor closely"}
              {mgPerKg < 100 && " — Below typical toxic threshold"}
            </div>
          )}
          
          {assessNomogram && (
            <div className={`p-2 rounded text-xs ${assessNomogram.needsTreatment ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              <strong>Nomogram Result at {hours}h:</strong><br/>
              Treatment threshold: {assessNomogram.treatmentThreshold} mcg/mL<br/>
              Your level: {level} mcg/mL<br/>
              <strong className="text-sm">
                {assessNomogram.probableToxicity 
                  ? "⚠️ PROBABLE HEPATOTOXICITY - START NAC IMMEDIATELY"
                  : assessNomogram.needsTreatment 
                    ? "⚠️ ABOVE TREATMENT LINE - START NAC"
                    : "✓ Below treatment line - NAC may not be needed"}
              </strong>
            </div>
          )}
        </div>

        {/* Rumack-Matthew Nomogram */}
        <div className="border rounded-lg p-3">
          <p className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Rumack-Matthew Nomogram
          </p>
          <p className="text-[10px] text-muted-foreground mb-2">
            Valid ONLY for acute single ingestion with known time. Draw level at 4+ hours post-ingestion.
          </p>
          
          <div className="flex justify-center overflow-x-auto">
            <svg width={svgWidth} height={svgHeight} className="bg-white dark:bg-gray-900 rounded">
              {/* Grid lines */}
              {[5, 10, 20, 50, 100, 150, 200].map(c => (
                <g key={c}>
                  <line 
                    x1={margin.left} 
                    y1={yScale(c)} 
                    x2={svgWidth - margin.right} 
                    y2={yScale(c)} 
                    stroke="#e5e7eb" 
                    strokeDasharray="2,2" 
                  />
                  <text x={margin.left - 5} y={yScale(c) + 3} fontSize="9" textAnchor="end" fill="#6b7280">{c}</text>
                </g>
              ))}
              
              {/* Time grid */}
              {[4, 8, 12, 16, 20, 24].map(h => (
                <g key={h}>
                  <line 
                    x1={xScale(h)} 
                    y1={margin.top} 
                    x2={xScale(h)} 
                    y2={svgHeight - margin.bottom} 
                    stroke="#e5e7eb" 
                    strokeDasharray="2,2" 
                  />
                  <text x={xScale(h)} y={svgHeight - margin.bottom + 15} fontSize="9" textAnchor="middle" fill="#6b7280">{h}h</text>
                </g>
              ))}
              
              {/* Probable toxicity zone (above probable line) */}
              <path 
                d={`${probablePath} L ${xScale(24)} ${margin.top} L ${xScale(4)} ${margin.top} Z`}
                fill="rgba(239, 68, 68, 0.1)"
              />
              
              {/* Possible toxicity zone (between lines) */}
              <path 
                d={`${treatmentPath} L ${xScale(24)} ${yScale(PROBABLE_TOXICITY_LINE[PROBABLE_TOXICITY_LINE.length-1].concentration)} ${probablePath.split(' ').reverse().join(' ')} Z`}
                fill="rgba(251, 191, 36, 0.1)"
              />
              
              {/* Probable toxicity line */}
              <path d={probablePath} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
              
              {/* Treatment line */}
              <path d={treatmentPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              
              {/* Patient point */}
              {hours >= 4 && hours <= 24 && level > 0 && (
                <g>
                  <circle 
                    cx={xScale(hours)} 
                    cy={yScale(Math.min(level, 250))} 
                    r="6" 
                    fill={assessNomogram?.needsTreatment ? "#ef4444" : "#22c55e"} 
                    stroke="#fff" 
                    strokeWidth="2"
                  />
                  <text 
                    x={xScale(hours) + 10} 
                    y={yScale(Math.min(level, 250)) + 4} 
                    fontSize="9" 
                    fill={assessNomogram?.needsTreatment ? "#ef4444" : "#22c55e"}
                    fontWeight="bold"
                  >
                    {level}
                  </text>
                </g>
              )}
              
              {/* Axes */}
              <line x1={margin.left} y1={margin.top} x2={margin.left} y2={svgHeight - margin.bottom} stroke="#374151" />
              <line x1={margin.left} y1={svgHeight - margin.bottom} x2={svgWidth - margin.right} y2={svgHeight - margin.bottom} stroke="#374151" />
              
              {/* Labels */}
              <text x={svgWidth / 2} y={svgHeight - 5} fontSize="10" textAnchor="middle" fill="#374151">Hours After Ingestion</text>
              <text x={12} y={svgHeight / 2} fontSize="10" textAnchor="middle" fill="#374151" transform={`rotate(-90, 12, ${svgHeight / 2})`}>Acetaminophen (mcg/mL)</text>
              
              {/* Legend */}
              <g transform={`translate(${svgWidth - 90}, ${margin.top + 5})`}>
                <rect x="0" y="0" width="85" height="40" fill="white" fillOpacity="0.9" stroke="#e5e7eb" rx="4" />
                <line x1="5" y1="12" x2="25" y2="12" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
                <text x="30" y="15" fontSize="8" fill="#374151">Probable</text>
                <line x1="5" y1="28" x2="25" y2="28" stroke="#f59e0b" strokeWidth="2" />
                <text x="30" y="31" fontSize="8" fill="#374151">Treatment</text>
              </g>
            </svg>
          </div>
          
          <div className="mt-2 text-[10px] text-muted-foreground">
            <p><strong>Treatment Line (lower):</strong> 150 mcg/mL at 4h → 5 mcg/mL at 24h</p>
            <p><strong>Probable Toxicity Line (upper):</strong> 200 mcg/mL at 4h → 7 mcg/mL at 24h</p>
          </div>
        </div>

        {/* Initial Management */}
        <FlowNode type="action">
          <p className="font-bold text-green-700 mb-2">Initial Management</p>
          <div className="space-y-2 text-[10px]">
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">1. Decontamination</p>
              <p>Activated charcoal 1 g/kg (max 50g) if within 1-2 hours of ingestion AND no contraindications</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">2. Labs to Order</p>
              <p>Serum acetaminophen level (at 4h+ post-ingestion), AST, ALT, INR/PT, BMP, glucose</p>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">3. Contact Poison Control</p>
              <p>Early consultation recommended for all significant ingestions</p>
            </div>
          </div>
        </FlowNode>

        {/* NAC Treatment Protocols */}
        <div className="border-2 border-green-400 rounded-lg p-3 bg-green-50/50 dark:bg-green-950/20">
          <p className="font-bold text-green-700 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            N-Acetylcysteine (NAC) Protocols
          </p>
          
          {/* Indications */}
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded mb-3 text-[10px]">
            <p className="font-semibold text-amber-800">Indications for NAC:</p>
            <ul className="list-disc list-inside text-amber-700">
              <li>Serum level above treatment line on nomogram</li>
              <li>Ingestion ≥150 mg/kg with level pending (empiric)</li>
              <li>Unknown time of ingestion with detectable level</li>
              <li>Elevated transaminases with history of overdose</li>
              <li>Chronic ingestion ≥150 mg/kg/day</li>
            </ul>
          </div>

          {/* IV Protocol */}
          <div className="space-y-2 text-[10px]">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <p className="font-bold text-blue-700">IV NAC - 21-Hour Protocol (3-Bag)</p>
              <div className="mt-1 space-y-1">
                <p><strong>Bag 1 (Loading):</strong> 150 mg/kg in 200mL D5W over 1 hour</p>
                <p><strong>Bag 2:</strong> 50 mg/kg in 500mL D5W over 4 hours</p>
                <p><strong>Bag 3:</strong> 100 mg/kg in 1000mL D5W over 16 hours</p>
                {nacDosing && (
                  <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded font-mono">
                    <p className="text-blue-600">For {w} kg patient:</p>
                    <p>Loading: <strong>{nacDosing.iv3bag.loading.toFixed(0)} mg</strong> over 1hr</p>
                    <p>Bag 2: <strong>{nacDosing.iv3bag.bag1.toFixed(0)} mg</strong> over 4hr</p>
                    <p>Bag 3: <strong>{nacDosing.iv3bag.bag2.toFixed(0)} mg</strong> over 16hr</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
              <p className="font-bold text-purple-700">IV NAC - 20-Hour Protocol (2-Bag / Simplified)</p>
              <div className="mt-1 space-y-1">
                <p><strong>Bag 1:</strong> 200 mg/kg (max 20g) over 4 hours (50 mg/kg/hr)</p>
                <p><strong>Bag 2:</strong> 100 mg/kg (max 10g) over 16 hours (6.25 mg/kg/hr)</p>
                {nacDosing && (
                  <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded font-mono">
                    <p className="text-purple-600">For {w} kg patient:</p>
                    <p>Bag 1: <strong>{nacDosing.iv2bag.loading.toFixed(0)} mg</strong> over 4hr</p>
                    <p>Bag 2: <strong>{nacDosing.iv2bag.maintenance.toFixed(0)} mg</strong> over 16hr</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <p className="font-bold">Oral NAC - 72-Hour Protocol</p>
              <div className="mt-1 space-y-1">
                <p><strong>Loading:</strong> 140 mg/kg PO x1</p>
                <p><strong>Maintenance:</strong> 70 mg/kg PO q4h x 17 doses</p>
                <p className="text-muted-foreground">(Total: 1330 mg/kg over 72 hours)</p>
                {nacDosing && (
                  <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded font-mono">
                    <p>For {w} kg patient:</p>
                    <p>Loading: <strong>{nacDosing.oral.loading.toFixed(0)} mg</strong> PO x1</p>
                    <p>Maintenance: <strong>{nacDosing.oral.maintenance.toFixed(0)} mg</strong> PO q4h x17</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Side effects */}
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-[10px]">
            <p className="font-semibold text-amber-700">NAC Adverse Reactions:</p>
            <p>Anaphylactoid reactions (esp. IV): urticaria, bronchospasm, angioedema - usually manageable</p>
            <p className="text-amber-600">Management: Slow infusion rate, antihistamines, may continue NAC</p>
          </div>
        </div>

        {/* When to Stop NAC */}
        <FlowNode type="success">
          <p className="font-semibold text-green-700 mb-2">Criteria to Stop NAC / Discharge</p>
          <ul className="text-[10px] space-y-1">
            <li>✓ Acetaminophen level undetectable (&lt;10 mcg/mL)</li>
            <li>✓ AST/ALT normal or improving (and &lt;1000 U/L)</li>
            <li>✓ INR ≤1.3 (or improving)</li>
            <li>✓ Patient clinically well</li>
            <li>✓ Psychiatric clearance if intentional ingestion</li>
          </ul>
        </FlowNode>

        {/* Severe Cases */}
        <FlowNode type="danger">
          <p className="font-bold text-red-700 mb-2">⚠️ Indicators of Severe Hepatotoxicity</p>
          <div className="text-[10px] space-y-1">
            <p>• AST/ALT &gt;10,000 U/L</p>
            <p>• INR &gt;2.0 at 24h or &gt;6.0 at any time</p>
            <p>• Creatinine &gt;3.3 mg/dL</p>
            <p>• Metabolic acidosis (pH &lt;7.3 or lactate &gt;3)</p>
            <p>• Encephalopathy</p>
            <p className="font-bold text-red-800 mt-2">Consider liver transplant evaluation and hemodialysis if level &gt;900 mcg/mL</p>
          </div>
        </FlowNode>

        {/* Quick Reference */}
        <div className="p-3 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg border">
          <p className="font-bold text-sm mb-2 text-center">⚡ QUICK REFERENCE</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-red-600">Toxic Dose</p>
              <p>≥150 mg/kg</p>
            </div>
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-amber-600">4h Level</p>
              <p>≥150 mcg/mL</p>
            </div>
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-green-600">NAC Best</p>
              <p>Within 8h</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default AcetaminophenApproach;
