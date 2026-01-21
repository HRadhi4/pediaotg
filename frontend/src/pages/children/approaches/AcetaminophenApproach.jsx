/**
 * Acetaminophen (Paracetamol) Toxicity Approach Component
 * Includes Rumack-Matthew Nomogram and NAC treatment protocols
 * Updated with collapsible sections and ml/mg converter for Bahrain preparations
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Section from "./Section";

// Import the static Rumack-Matthew nomogram SVG (updated version)
import RumackNomogramSVG from "@/assets/images/rumack_matthew_nomogram_new.svg";

// Common acetaminophen/paracetamol liquid preparations in Bahrain (concentration in mg/ml)
const LIQUID_PREPARATIONS = [
  { id: "panadol_infant", name: "Panadol Infant Drops", concentration: "100mg/ml", perMl: 100 },
  { id: "panadol_baby", name: "Panadol Baby & Infant Susp", concentration: "120mg/5ml", perMl: 24 },
  { id: "panadol_child", name: "Panadol Children Susp", concentration: "250mg/5ml", perMl: 50 },
  { id: "adol_infant", name: "Adol Infant Drops", concentration: "100mg/ml", perMl: 100 },
  { id: "adol_syrup", name: "Adol Syrup", concentration: "120mg/5ml", perMl: 24 },
  { id: "adol_250", name: "Adol 250 Suspension", concentration: "250mg/5ml", perMl: 50 },
  { id: "tylenol_infant", name: "Tylenol Infant Drops", concentration: "80mg/0.8ml", perMl: 100 },
  { id: "tylenol_child", name: "Tylenol Children's Susp", concentration: "160mg/5ml", perMl: 32 },
  { id: "fevadol_drops", name: "Fevadol Drops", concentration: "100mg/ml", perMl: 100 },
  { id: "fevadol_susp", name: "Fevadol Suspension", concentration: "120mg/5ml", perMl: 24 },
  { id: "calpol_infant", name: "Calpol Infant Susp", concentration: "120mg/5ml", perMl: 24 },
  { id: "calpol_6plus", name: "Calpol Six Plus Susp", concentration: "250mg/5ml", perMl: 50 },
  { id: "custom", name: "Custom / Other", concentration: "", perMl: 0 },
];

// Common tablet strengths
const TABLET_STRENGTHS = [120, 160, 325, 500, 650, 1000];

// Rumack-Matthew Nomogram treatment line data points
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

// Probable hepatotoxicity line
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

const AcetaminophenApproach = ({ weight, expandedSections, toggleSection }) => {
  const [inputMode, setInputMode] = useState("mg"); // "mg" or "ml"
  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [mlIngested, setMlIngested] = useState("");
  const [customConcentration, setCustomConcentration] = useState("");
  const [numTablets, setNumTablets] = useState("");
  const [tabletStrength, setTabletStrength] = useState("");
  const [ingestionDose, setIngestionDose] = useState("");
  const [hoursPostIngestion, setHoursPostIngestion] = useState("");
  const [serumLevel, setSerumLevel] = useState("");
  const [nomogramUnit, setNomogramUnit] = useState("SI"); // "SI" (µmol/L) or "US" (mcg/mL)

  const w = parseFloat(weight) || 0;
  const ml = parseFloat(mlIngested) || 0;
  const customConc = parseFloat(customConcentration) || 0;
  const tablets = parseFloat(numTablets) || 0;
  const strength = parseFloat(tabletStrength) || 0;
  const manualDose = parseFloat(ingestionDose) || 0;
  const hours = parseFloat(hoursPostIngestion) || 0;
  const level = parseFloat(serumLevel) || 0;

  const selectedLiquidData = LIQUID_PREPARATIONS.find(l => l.id === selectedLiquid);

  // Calculate total dose
  const doseCalculation = useMemo(() => {
    let totalDose = 0;
    let source = "";

    if (inputMode === "ml" && selectedLiquid && ml > 0) {
      if (selectedLiquid === "custom") {
        if (customConc <= 0) return null;
        totalDose = ml * customConc;
        source = "Custom preparation";
      } else if (selectedLiquidData) {
        totalDose = ml * selectedLiquidData.perMl;
        source = selectedLiquidData.name;
      }
    } else if (inputMode === "mg") {
      if (tablets > 0 && strength > 0) {
        totalDose = tablets * strength;
        source = `${tablets} × ${strength}mg tablets`;
      } else if (manualDose > 0) {
        totalDose = manualDose;
        source = "Manual entry";
      }
    }

    if (totalDose <= 0) return null;

    const mgPerKg = w > 0 ? totalDose / w : 0;
    
    let severity = "low";
    let riskLevel = "Below Toxic Threshold";
    let recommendation = "Unlikely to cause toxicity";

    if (mgPerKg >= 200) {
      severity = "severe";
      riskLevel = "High Risk - Significant Toxicity Expected";
      recommendation = "Check serum level at 4h, likely needs NAC";
    } else if (mgPerKg >= 150) {
      severity = "toxic";
      riskLevel = "Potentially Toxic";
      recommendation = "Check serum level at 4h, assess with nomogram";
    } else if (mgPerKg >= 100) {
      severity = "borderline";
      riskLevel = "Borderline - Monitor Closely";
      recommendation = "Consider checking serum level if symptomatic";
    }

    return { totalDose: totalDose.toFixed(0), mgPerKg: mgPerKg.toFixed(1), source, severity, riskLevel, recommendation };
  }, [inputMode, selectedLiquid, selectedLiquidData, ml, customConc, tablets, strength, manualDose, w]);

  // Determine if treatment line is crossed
  const assessNomogram = useMemo(() => {
    if (hours < 4 || hours > 24 || level <= 0) return null;
    
    let treatmentThreshold = 0;
    let probableThreshold = 0;
    
    for (let i = 0; i < NOMOGRAM_TREATMENT_LINE.length - 1; i++) {
      const p1 = NOMOGRAM_TREATMENT_LINE[i];
      const p2 = NOMOGRAM_TREATMENT_LINE[i + 1];
      if (hours >= p1.hours && hours <= p2.hours) {
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
    
    return {
      iv3bag: {
        loading: Math.min(w * 150, 15000),
        bag1: Math.min(w * 50, 5000),
        bag2: Math.min(w * 100, 10000),
      },
      iv2bag: {
        loading: Math.min(w * 200, 20000),
        maintenance: Math.min(w * 100, 10000),
      },
      oral: {
        loading: Math.min(w * 140, 15000),
        maintenance: Math.min(w * 70, 7500),
      },
      charcoal: Math.min(w * 1, 50),
    };
  }, [w]);

  // Conversion: 1 mcg/mL = 6.62 µmol/L (acetaminophen MW = 151.16)
  const mcgToMicromol = (mcg) => Math.round(mcg * 6.62);

  // Static SVG nomogram dimensions and coordinate mapping
  // The NEW SVG viewBox is 0 0 620 750.40002
  // Updated chart area boundaries based on the new SVG structure
  const svgViewWidth = 620;
  const svgViewHeight = 750.40002;
  
  // Chart boundaries within the new SVG (calibrated for RM-Nomogram.svg)
  // X-axis: hours 0-24, Y-axis: concentration on log scale
  const chartLeft = 85;       // x position at hour 0
  const chartRight = 570;     // x position at hour 24
  const chartTop = 60;        // y position at top (high concentration ~500 mcg/mL)
  const chartBottom = 650;    // y position at bottom (low concentration ~3 mcg/mL)
  
  // Scale functions for the static SVG overlay
  const xScaleSVG = (h) => {
    // Hours 0-24 map to chartLeft-chartRight
    return chartLeft + (h / 24) * (chartRight - chartLeft);
  };
  
  const yScaleSVG = (c) => {
    // Logarithmic scale: concentration in mcg/mL
    // Top of chart is ~500 mcg/mL, bottom is ~3 mcg/mL
    const logMin = Math.log10(3);
    const logMax = Math.log10(500);
    const logC = Math.log10(Math.max(c, 3));
    const ratio = (logC - logMin) / (logMax - logMin);
    return chartBottom - ratio * (chartBottom - chartTop);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Acetaminophen (Paracetamol) Toxicity</CardTitle>
        <CardDescription className="text-xs">Risk assessment, Rumack-Matthew Nomogram & NAC protocols</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* Dose Calculator - Always Open */}
        <Section id="apap-calc" title="Dose Calculator" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
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

            {inputMode === "ml" ? (
              <>
                <div>
                  <Label className="text-xs">Liquid Preparation (Bahrain)</Label>
                  <Select value={selectedLiquid} onValueChange={setSelectedLiquid}>
                    <SelectTrigger className="mt-1" data-testid="apap-liquid-selector">
                      <SelectValue placeholder="Select liquid preparation..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LIQUID_PREPARATIONS.map(liquid => (
                        <SelectItem key={liquid.id} value={liquid.id}>
                          {liquid.name} {liquid.concentration && `(${liquid.concentration})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedLiquid === "custom" && (
                  <div>
                    <Label className="text-xs">Concentration (mg/ml)</Label>
                    <Input
                      type="number"
                      value={customConcentration}
                      onChange={(e) => setCustomConcentration(e.target.value)}
                      placeholder="e.g., 24"
                      className="h-8 text-sm mt-1"
                      min="0"
                    />
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
                    data-testid="apap-ml-input"
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
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Number of Tablets</Label>
                    <Input
                      type="number"
                      value={numTablets}
                      onChange={(e) => {
                        setNumTablets(e.target.value);
                        setIngestionDose("");
                      }}
                      placeholder="e.g., 10"
                      className="h-8 text-sm mt-1"
                      min="0"
                      data-testid="apap-tablets-input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tablet Strength (mg)</Label>
                    <Select value={tabletStrength} onValueChange={(v) => {
                      setTabletStrength(v);
                      setIngestionDose("");
                    }}>
                      <SelectTrigger className="mt-1 h-8">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TABLET_STRENGTHS.map(s => (
                          <SelectItem key={s} value={s.toString()}>{s} mg</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center text-[10px] text-muted-foreground">— OR enter total mg directly —</div>

                <div>
                  <Label className="text-xs">Total Amount Ingested (mg)</Label>
                  <Input
                    type="number"
                    value={ingestionDose}
                    onChange={(e) => {
                      setIngestionDose(e.target.value);
                      setNumTablets("");
                      setTabletStrength("");
                    }}
                    placeholder="e.g., 5000"
                    className="h-8 text-sm mt-1"
                    min="0"
                    data-testid="apap-amount-input"
                  />
                </div>
              </>
            )}

            {/* Results */}
            {doseCalculation && (
              <div className={`p-3 rounded-lg text-xs space-y-2 border ${
                doseCalculation.severity === 'severe' ? 'bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100 border-red-200' :
                doseCalculation.severity === 'toxic' ? 'bg-red-50 dark:bg-red-950/30 text-red-800 border-red-200' :
                doseCalculation.severity === 'borderline' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 border-amber-200' :
                'bg-green-50 dark:bg-green-950/30 text-green-900 border-green-200'
              }`}>
                <div>
                  <p className="text-[10px] opacity-70">Source</p>
                  <p className="font-semibold">{doseCalculation.source}</p>
                </div>
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
                </div>
              </div>
            )}

            {/* Quick Reference */}
            <div className="text-[10px] p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold mb-1">Common Liquid Concentrations:</p>
              <p className="text-muted-foreground">
                Infant Drops 100mg/ml • Baby Susp 120mg/5ml (24mg/ml) • Children Susp 250mg/5ml (50mg/ml)
              </p>
            </div>
          </div>
        </Section>

        {/* Toxic Doses */}
        <Section id="apap-toxic" title="Toxic Dose Thresholds" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <span className="w-32 font-bold text-red-700">≥150 mg/kg</span>
              <span className="text-muted-foreground">Acute single ingestion - potentially toxic</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <span className="w-32 font-bold text-red-700">≥7.5 g total</span>
              <span className="text-muted-foreground">Adult threshold regardless of weight</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
              <span className="w-32 font-bold text-amber-700">Chronic</span>
              <span className="text-muted-foreground">≥150 mg/kg/day for ≥2 days</span>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
              <p className="font-semibold text-purple-700">High Risk Patients - Lower Threshold:</p>
              <p className="text-muted-foreground text-[10px] mt-1">
                Alcoholism, malnutrition, CYP2E1 inducers (isoniazid, phenytoin), fasting, Gilbert syndrome
              </p>
            </div>
          </div>
        </Section>

        {/* Clinical Phases */}
        <Section id="apap-phases" title="Clinical Phases of Toxicity" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold"><span className="text-blue-600">Phase I (0-24h):</span> GI Phase</p>
              <p className="text-muted-foreground">Nausea, vomiting, anorexia, malaise, diaphoresis. May be asymptomatic!</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold"><span className="text-amber-600">Phase II (24-72h):</span> Hepatic Injury</p>
              <p className="text-muted-foreground">RUQ pain, elevated AST/ALT, elevated PT/INR. GI symptoms may improve.</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold"><span className="text-red-600">Phase III (72-96h):</span> Peak Hepatotoxicity</p>
              <p className="text-muted-foreground">Jaundice, coagulopathy, encephalopathy, renal failure. AST/ALT may exceed 10,000.</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold"><span className="text-green-600">Phase IV (4d-2wk):</span> Recovery</p>
              <p className="text-muted-foreground">Complete hepatic recovery if patient survives. No chronic liver disease.</p>
            </div>
          </div>
        </Section>

        {/* Nomogram Assessment */}
        <Section id="apap-nomogram" title="Rumack-Matthew Nomogram" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            <p className="text-[10px] text-muted-foreground">
              Valid ONLY for acute single ingestion with known time. Draw level at 4+ hours post-ingestion.
            </p>
            
            {/* Unit Toggle */}
            <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit mx-auto">
              <button
                onClick={() => setNomogramUnit("SI")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  nomogramUnit === "SI" 
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
                data-testid="nomogram-unit-si"
              >
                µmol/L (SI)
              </button>
              <button
                onClick={() => setNomogramUnit("US")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  nomogramUnit === "US" 
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
                data-testid="nomogram-unit-us"
              >
                mcg/mL
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Hours Post-Ingestion</Label>
                <Input
                  type="number"
                  value={hoursPostIngestion}
                  onChange={(e) => setHoursPostIngestion(e.target.value)}
                  placeholder="4-24"
                  className="h-8 text-sm mt-1"
                  min="4"
                  max="24"
                  data-testid="apap-hours-input"
                />
              </div>
              <div>
                <Label className="text-xs">
                  Serum Level ({nomogramUnit === "SI" ? "µmol/L" : "mcg/mL"})
                </Label>
                <Input
                  type="number"
                  value={serumLevel}
                  onChange={(e) => setSerumLevel(e.target.value)}
                  placeholder={nomogramUnit === "SI" ? "e.g., 1000" : "e.g., 150"}
                  className="h-8 text-sm mt-1"
                  min="0"
                  data-testid="apap-level-input"
                />
                {level > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    = {nomogramUnit === "SI" 
                      ? `${(level / 6.62).toFixed(1)} mcg/mL`
                      : `${mcgToMicromol(level)} µmol/L`
                    }
                  </p>
                )}
              </div>
            </div>

            {assessNomogram && (
              <div className={`p-2 rounded text-xs ${assessNomogram.needsTreatment ? 'bg-red-50 dark:bg-red-950/20 text-red-800 border border-red-200' : 'bg-green-50 dark:bg-green-950/20 text-green-800 border border-green-200'}`}>
                <p className="font-semibold">Nomogram Result at {hours}h:</p>
                {nomogramUnit === "SI" ? (
                  <>
                    <p>Treatment threshold: {mcgToMicromol(assessNomogram.treatmentThreshold)} µmol/L ({assessNomogram.treatmentThreshold} mcg/mL)</p>
                    <p>Your level: {nomogramUnit === "SI" ? level : mcgToMicromol(level)} µmol/L ({nomogramUnit === "SI" ? (level / 6.62).toFixed(1) : level} mcg/mL)</p>
                  </>
                ) : (
                  <>
                    <p>Treatment threshold: {assessNomogram.treatmentThreshold} mcg/mL ({mcgToMicromol(assessNomogram.treatmentThreshold)} µmol/L)</p>
                    <p>Your level: {level} mcg/mL ({mcgToMicromol(level)} µmol/L)</p>
                  </>
                )}
                <p className="font-bold mt-1">
                  {assessNomogram.probableToxicity 
                    ? "⚠️ PROBABLE HEPATOTOXICITY - START NAC IMMEDIATELY"
                    : assessNomogram.needsTreatment 
                      ? "⚠️ ABOVE TREATMENT LINE - START NAC"
                      : "✓ Below treatment line - NAC may not be needed"}
                </p>
              </div>
            )}

            {/* Static SVG Nomogram with Patient Point Overlay */}
            <p className="text-[9px] text-center text-muted-foreground mb-2 sm:hidden">← Swipe to scroll →</p>
            <div className="overflow-auto -mx-2 px-2 pb-2">
              <div className="flex justify-center" style={{ minWidth: '320px' }}>
                <div className="relative" style={{ width: '450px', height: '550px' }}>
                  {/* Static SVG Nomogram Background */}
                  <img 
                    src={RumackNomogramSVG} 
                    alt="Rumack-Matthew Nomogram" 
                    className="w-full h-full object-contain"
                    style={{ background: '#ffffff', borderRadius: '4px' }}
                  />
                  
                  {/* Patient Data Point Overlay */}
                  {hours >= 4 && hours <= 24 && level > 0 && (
                    <svg 
                      viewBox={`0 0 ${svgViewWidth} ${svgViewHeight}`}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ mixBlendMode: 'normal' }}
                    >
                      {(() => {
                        const mcgLevel = nomogramUnit === "SI" ? level / 6.62 : level;
                        const clampedLevel = Math.min(Math.max(mcgLevel, 3), 500);
                        const cx = xScaleSVG(hours);
                        const cy = yScaleSVG(clampedLevel);
                        const pointColor = assessNomogram?.probableToxicity 
                          ? "#dc2626" 
                          : assessNomogram?.needsTreatment 
                            ? "#f59e0b" 
                            : "#22c55e";
                        return (
                          <g>
                            {/* Outer glow for visibility */}
                            <circle 
                              cx={cx} 
                              cy={cy} 
                              r="8" 
                              fill="rgba(255,255,255,0.8)"
                            />
                            {/* Main point */}
                            <circle 
                              cx={cx} 
                              cy={cy} 
                              r="5" 
                              fill={pointColor}
                              stroke="#ffffff" 
                              strokeWidth="2"
                            />
                            {/* Pulsing animation indicator */}
                            <circle 
                              cx={cx} 
                              cy={cy} 
                              r="5" 
                              fill="none"
                              stroke={pointColor}
                              strokeWidth="2"
                              opacity="0.5"
                            >
                              <animate 
                                attributeName="r" 
                                values="5;12;5" 
                                dur="2s" 
                                repeatCount="indefinite"
                              />
                              <animate 
                                attributeName="opacity" 
                                values="0.5;0;0.5" 
                                dur="2s" 
                                repeatCount="indefinite"
                              />
                            </circle>
                          </g>
                        );
                      })()}
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground space-y-1">
              <p><strong>Upper line:</strong> {nomogramUnit === "SI" ? "1320 µmol/L (200 mcg/mL)" : "200 mcg/mL (1320 µmol/L)"} at 4h</p>
              <p><strong>Lower line (25%):</strong> {nomogramUnit === "SI" ? "990 µmol/L (150 mcg/mL)" : "150 mcg/mL (990 µmol/L)"} at 4h → {nomogramUnit === "SI" ? "33 µmol/L (5 mcg/mL)" : "5 mcg/mL (33 µmol/L)"} at 24h</p>
              <p className="text-[9px] mt-1">Conversion: 1 mcg/mL = 6.62 µmol/L</p>
            </div>
          </div>
        </Section>

        {/* Initial Management */}
        <Section id="apap-mgmt" title="Initial Management" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">1. Decontamination</p>
              <p className="text-muted-foreground">Activated charcoal 1 g/kg (max 50g) if within 1-2 hours AND no contraindications</p>
              {nacDosing && w > 0 && (
                <p className="font-mono text-slate-600 mt-1">→ For {w} kg patient: {nacDosing.charcoal.toFixed(0)} g charcoal</p>
              )}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">2. Labs to Order</p>
              <p className="text-muted-foreground">Serum acetaminophen level (at 4h+ post-ingestion), AST, ALT, INR/PT, BMP, glucose</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">3. Contact Poison Control</p>
              <p className="text-muted-foreground">Early consultation for all significant ingestions</p>
            </div>
          </div>
        </Section>

        {/* NAC Treatment Protocols */}
        <Section id="apap-nac" title="N-Acetylcysteine (NAC) Protocols" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            {/* Indications */}
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
              <p className="font-semibold text-amber-800">Indications for NAC:</p>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] mt-1">
                <li>Serum level above treatment line on nomogram</li>
                <li>Ingestion ≥150 mg/kg with level pending (empiric)</li>
                <li>Unknown time of ingestion with detectable level</li>
                <li>Elevated transaminases with history of overdose</li>
              </ul>
            </div>

            {/* 3-Bag Protocol */}
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold text-blue-700">IV NAC - 21-Hour Protocol (3-Bag)</p>
              <div className="mt-1 text-[10px] text-muted-foreground">
                <p><strong>Bag 1 (Loading):</strong> 150 mg/kg in 200mL D5W over 1 hour</p>
                <p><strong>Bag 2:</strong> 50 mg/kg in 500mL D5W over 4 hours</p>
                <p><strong>Bag 3:</strong> 100 mg/kg in 1000mL D5W over 16 hours</p>
              </div>
              {nacDosing && w > 0 && (
                <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded font-mono text-[10px]">
                  <p className="text-blue-600 font-semibold">For {w} kg patient:</p>
                  <p>Loading: <strong>{nacDosing.iv3bag.loading.toFixed(0)} mg</strong> over 1hr</p>
                  <p>Bag 2: <strong>{nacDosing.iv3bag.bag1.toFixed(0)} mg</strong> over 4hr</p>
                  <p>Bag 3: <strong>{nacDosing.iv3bag.bag2.toFixed(0)} mg</strong> over 16hr</p>
                </div>
              )}
            </div>

            {/* 2-Bag Protocol */}
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold text-purple-700">IV NAC - 20-Hour Protocol (2-Bag)</p>
              <div className="mt-1 text-[10px] text-muted-foreground">
                <p><strong>Bag 1:</strong> 200 mg/kg (max 20g) over 4 hours</p>
                <p><strong>Bag 2:</strong> 100 mg/kg (max 10g) over 16 hours</p>
              </div>
              {nacDosing && w > 0 && (
                <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded font-mono text-[10px]">
                  <p className="text-purple-600 font-semibold">For {w} kg patient:</p>
                  <p>Bag 1: <strong>{nacDosing.iv2bag.loading.toFixed(0)} mg</strong> over 4hr</p>
                  <p>Bag 2: <strong>{nacDosing.iv2bag.maintenance.toFixed(0)} mg</strong> over 16hr</p>
                </div>
              )}
            </div>

            {/* Oral Protocol */}
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Oral NAC - 72-Hour Protocol</p>
              <div className="mt-1 text-[10px] text-muted-foreground">
                <p><strong>Loading:</strong> 140 mg/kg PO ×1</p>
                <p><strong>Maintenance:</strong> 70 mg/kg PO q4h × 17 doses</p>
              </div>
              {nacDosing && w > 0 && (
                <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded font-mono text-[10px]">
                  <p>For {w} kg patient:</p>
                  <p>Loading: <strong>{nacDosing.oral.loading.toFixed(0)} mg</strong> PO ×1</p>
                  <p>Maintenance: <strong>{nacDosing.oral.maintenance.toFixed(0)} mg</strong> PO q4h ×17</p>
                </div>
              )}
            </div>

            {/* Side effects */}
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded text-[10px]">
              <p className="font-semibold text-amber-700">NAC Adverse Reactions:</p>
              <p className="text-muted-foreground">Anaphylactoid (esp. IV): urticaria, bronchospasm, angioedema</p>
              <p className="text-amber-600">Management: Slow infusion, antihistamines, may continue NAC</p>
            </div>
          </div>
        </Section>

        {/* When to Stop NAC */}
        <Section id="apap-stop" title="Criteria to Stop NAC / Discharge" expandedSections={expandedSections} toggleSection={toggleSection}>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>✓ Acetaminophen level undetectable (&lt;10 mcg/mL)</li>
            <li>✓ AST/ALT normal or improving (and &lt;1000 U/L)</li>
            <li>✓ INR ≤1.3 (or improving)</li>
            <li>✓ Patient clinically well</li>
            <li>✓ Psychiatric clearance if intentional ingestion</li>
          </ul>
        </Section>

        {/* Severe Cases */}
        <Section id="apap-severe" title="Indicators of Severe Hepatotoxicity" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs space-y-1 text-muted-foreground">
            <p>• AST/ALT &gt;10,000 U/L</p>
            <p>• INR &gt;2.0 at 24h or &gt;6.0 at any time</p>
            <p>• Creatinine &gt;3.3 mg/dL</p>
            <p>• Metabolic acidosis (pH &lt;7.3 or lactate &gt;3)</p>
            <p>• Encephalopathy</p>
            <p className="font-semibold text-red-700 mt-2">Consider liver transplant evaluation if level &gt;900 mcg/mL</p>
          </div>
        </Section>

        {/* Quick Reference */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border text-center">
          <p className="font-bold text-sm mb-2">⚡ QUICK REFERENCE</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-red-600">Toxic Dose</p>
              <p>≥150 mg/kg</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-amber-600">4h Level</p>
              <p>≥150 mcg/mL</p>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-green-600">NAC Best</p>
              <p>Within 8h</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            NAC effective even after 24h if hepatotoxicity present
          </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default AcetaminophenApproach;
