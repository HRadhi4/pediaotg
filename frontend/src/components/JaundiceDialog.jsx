import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sun, AlertTriangle, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// =============================================================================
// PHOTOTHERAPY AND EXCHANGE THRESHOLDS (µmol/L)
// Based on: Sadiq Jaffar Radhi redesigned guidelines
// =============================================================================

// Pre-term thresholds (9 time points: <12h, 24h, 36h, 48h, 60h, 72h, 84h, 96-108h, 5days)
// Risk factors do NOT apply to preterms
const PRETERM_THRESHOLDS = {
  // Category 1: Weight < 1 kg OR GA < 28 weeks
  "preterm_1": {
    label: "Weight < 1 kg or GA < 28 wk",
    PT: [80, 80, 80, 80, 80, 100, 100, 100, 120],
    EX: [200, 220, 220, 220, 220, 220, 220, 220, 220]
  },
  // Category 2: Weight 1-1.249 kg OR GA 28-29+6d
  "preterm_2": {
    label: "Weight 1-1.249 kg or GA 28-29+6d wk",
    PT: [80, 100, 130, 140, 150, 150, 150, 150, 150],
    EX: [210, 230, 240, 240, 240, 240, 240, 240, 240]
  },
  // Category 3: Weight 1.25-1.49 kg OR GA 30-31+6d
  "preterm_3": {
    label: "Weight 1.25-1.49 kg or GA 30-31+6d wk",
    PT: [80, 110, 140, 160, 170, 170, 170, 170, 170],
    EX: [220, 240, 250, 260, 260, 260, 260, 260, 260]
  },
  // Category 4: Weight 1.5-1.99 kg OR GA 32-33+6d
  "preterm_4": {
    label: "Weight 1.5-1.99 kg or GA 32-33+6d wk",
    PT: [80, 120, 150, 180, 190, 200, 200, 200, 200],
    EX: [230, 250, 260, 280, 290, 300, 300, 300, 300]
  },
  // Category 5: Weight 2-2.4 kg OR GA 34-34+6d
  "preterm_5": {
    label: "Weight 2-2.4 kg or GA 34-34+6d wk",
    PT: [100, 130, 160, 190, 210, 230, 240, 250, 250],
    EX: [240, 260, 280, 300, 310, 320, 330, 330, 330]
  }
};

// Term thresholds (10 time points: birth, 12h, 24h, 36h, 48h, 60h, 72h, 84h, 96h, 5days)
// Risk factors apply to term infants (35 wk to ≥38 wk)
const TERM_THRESHOLDS = {
  // High risk: 35-37+6d with risk factors
  "term_high_risk": {
    label: "High Risk (35-37+6d wk with risk factors)",
    PT: [70, 100, 135, 155, 190, 200, 220, 240, 240, 255],
    EX: [200, 220, 255, 270, 290, 310, 310, 330, 330, 330]
  },
  // Medium risk: ≥38wk with risk factors OR 35-37+6d well
  "term_medium_risk": {
    label: "Medium Risk (≥38 wk + risk OR 35-37+6d well)",
    PT: [85, 120, 170, 190, 220, 240, 255, 270, 290, 310],
    EX: [240, 255, 270, 310, 330, 340, 360, 370, 370, 370]
  },
  // Low risk: ≥38wk and well
  "term_low_risk": {
    label: "Low Risk (≥38 wk and well)",
    PT: [100, 155, 190, 220, 255, 270, 290, 310, 330, 360],
    EX: [270, 290, 330, 360, 370, 390, 410, 430, 430, 430]
  }
};

// Time points in hours
const PRETERM_TIME_POINTS = [12, 24, 36, 48, 60, 72, 84, 108, 120]; // <12h uses index 0
const TERM_TIME_POINTS = [0, 12, 24, 36, 48, 60, 72, 84, 96, 120]; // birth=0

// Convert mg/dL to µmol/L
const mgToMmol = (mg) => mg * 17.1;
// Convert µmol/L to mg/dL
const mmolToMg = (mmol) => mmol / 17.1;

const JaundiceDialog = ({ open, onOpenChange }) => {
  const [weight, setWeight] = useState("");
  const [gestationalAge, setGestationalAge] = useState("");
  const [postnatalAge, setPostnatalAge] = useState("");
  const [ageUnit, setAgeUnit] = useState("hours");
  const [bilirubin, setBilirubin] = useState("");
  const [useMmol, setUseMmol] = useState(true); // true = µmol/L (default), false = mg/dL
  const [riskFactors, setRiskFactors] = useState("none");
  const [result, setResult] = useState(null);

  // Get preterm category based on weight OR GA (use whichever gives lower/more conservative category)
  const getPretermCategory = (w, ga) => {
    // Determine category by weight
    let weightCategory = 5; // Default to highest
    if (w < 1) weightCategory = 1;
    else if (w < 1.25) weightCategory = 2;
    else if (w < 1.5) weightCategory = 3;
    else if (w < 2) weightCategory = 4;
    else if (w < 2.5) weightCategory = 5;
    
    // Determine category by GA
    let gaCategory = 5; // Default to highest
    if (ga < 28) gaCategory = 1;
    else if (ga < 30) gaCategory = 2;
    else if (ga < 32) gaCategory = 3;
    else if (ga < 34) gaCategory = 4;
    else if (ga < 35) gaCategory = 5;
    
    // Use whichever is smaller (more conservative)
    return Math.min(weightCategory, gaCategory);
  };

  // Get term risk category
  const getTermCategory = (ga, risk) => {
    if (ga >= 35 && ga < 38) {
      // 35-37+6d
      if (risk === "high") return "term_high_risk";
      return "term_medium_risk"; // 35-37+6d well = medium risk
    }
    // ≥38 weeks
    if (risk === "high") return "term_high_risk";
    if (risk === "medium") return "term_medium_risk";
    return "term_low_risk";
  };

  // Get threshold based on postnatal age
  // Extra Rule 2: If between two time points, use the threshold at the time point nearest to the postnatal age
  const getThresholdByAge = (thresholds, timePoints, ageHours) => {
    // Find the time point nearest to the postnatal age
    let nearestIdx = 0;
    let minDistance = Math.abs(ageHours - timePoints[0]);
    
    for (let i = 1; i < timePoints.length; i++) {
      const distance = Math.abs(ageHours - timePoints[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIdx = i;
      }
    }
    
    // Handle edge cases
    if (ageHours <= timePoints[0]) {
      nearestIdx = 0;
    } else if (ageHours >= timePoints[timePoints.length - 1]) {
      nearestIdx = timePoints.length - 1;
    }
    
    return { 
      threshold: thresholds[nearestIdx], 
      timePoint: timePoints[nearestIdx], 
      interpolated: ageHours !== timePoints[nearestIdx]
    };
  };

  const calculate = () => {
    const w = parseFloat(weight);
    const ga = parseFloat(gestationalAge);
    let ageHours = parseFloat(postnatalAge);
    let bili = parseFloat(bilirubin);
    
    if (!w || !ga || isNaN(ageHours) || !bili) {
      setResult({ error: "Please fill in all required fields" });
      return;
    }
    
    // Convert age to hours if needed
    if (ageUnit === "days") {
      ageHours = ageHours * 24;
    }
    
    // Convert bilirubin to µmol/L if in mg/dL
    const biliMmol = useMmol ? bili : mgToMmol(bili);
    const biliMg = useMmol ? mmolToMg(bili) : bili;
    
    let category, thresholds, timePoints, isTerm;
    
    // Determine if preterm or term
    if (ga < 35) {
      // Pure preterm - use preterm thresholds, risk factors don't apply
      isTerm = false;
      const pretermCat = getPretermCategory(w, ga);
      category = `preterm_${pretermCat}`;
      thresholds = PRETERM_THRESHOLDS[category];
      timePoints = PRETERM_TIME_POINTS;
    } else {
      // Term (≥35 weeks)
      isTerm = true;
      
      // Extra Rule 1: Term with low weight (<2.5 kg) can use preterm thresholds if more conservative
      if (w < 2.5) {
        // Calculate both term and preterm thresholds, use whichever is lower
        const termCat = getTermCategory(ga, riskFactors);
        const termThresholds = TERM_THRESHOLDS[termCat];
        
        const pretermCat = getPretermCategory(w, ga);
        const pretermKey = `preterm_${pretermCat}`;
        const pretermThresholds = PRETERM_THRESHOLDS[pretermKey];
        
        // Get thresholds for both using nearest time point
        const termPT = getThresholdByAge(termThresholds.PT, TERM_TIME_POINTS, ageHours);
        const pretermPT = getThresholdByAge(pretermThresholds.PT, PRETERM_TIME_POINTS, ageHours);
        
        // Use whichever PT threshold is lower (more conservative)
        if (pretermPT.threshold < termPT.threshold) {
          category = pretermKey;
          thresholds = pretermThresholds;
          timePoints = PRETERM_TIME_POINTS;
          isTerm = false; // Use preterm time points
        } else {
          category = termCat;
          thresholds = termThresholds;
          timePoints = TERM_TIME_POINTS;
        }
      } else {
        // Normal term infant
        category = getTermCategory(ga, riskFactors);
        thresholds = TERM_THRESHOLDS[category];
        timePoints = TERM_TIME_POINTS;
      }
    }
    
    if (!thresholds) {
      setResult({ error: "Could not determine threshold category" });
      return;
    }
    
    // Get thresholds at nearest time point
    const ptResult = getThresholdByAge(thresholds.PT, timePoints, ageHours);
    const exResult = getThresholdByAge(thresholds.EX, timePoints, ageHours);
    
    const ptThreshold = ptResult.threshold;
    const exThreshold = exResult.threshold;
    
    // Determine recommendation
    let recommendation = "Monitor";
    let severity = "normal";
    
    if (biliMmol >= exThreshold) {
      recommendation = "Exchange Transfusion Required";
      severity = "critical";
    } else if (biliMmol >= ptThreshold) {
      recommendation = "Phototherapy Required";
      severity = "warning";
    } else if (biliMmol >= ptThreshold * 0.85) {
      recommendation = "Approaching Phototherapy Threshold - Monitor Closely";
      severity = "caution";
    }
    
    setResult({
      category: thresholds.label || category.replace(/_/g, " "),
      isTerm,
      ageHours,
      biliMmol: biliMmol.toFixed(1),
      biliMg: biliMg.toFixed(1),
      ptThreshold,
      exThreshold,
      ptTimePoint: ptResult.timePoint,
      exTimePoint: exResult.timePoint,
      interpolated: ptResult.interpolated,
      recommendation,
      severity,
      usedPretermForTerm: ga >= 35 && category.startsWith("preterm")
    });
  };

  const reset = () => {
    setWeight("");
    setGestationalAge("");
    setPostnatalAge("");
    setBilirubin("");
    setRiskFactors("none");
    setResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" />
            Neonatal Jaundice Calculator
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Patient Information</CardTitle>
            <CardDescription>Phototherapy & Exchange Transfusion Guidelines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Weight and GA */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="e.g., 2.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="font-mono"
                  data-testid="jaundice-weight"
                />
              </div>
              <div className="space-y-2">
                <Label>Gestational Age (weeks)</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  step="1"
                  placeholder="e.g., 36"
                  value={gestationalAge}
                  onChange={(e) => setGestationalAge(e.target.value)}
                  className="font-mono"
                  data-testid="jaundice-ga"
                />
              </div>
            </div>

            {/* Postnatal Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Postnatal Age</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  step="1"
                  placeholder={ageUnit === "hours" ? "e.g., 48" : "e.g., 2"}
                  value={postnatalAge}
                  onChange={(e) => setPostnatalAge(e.target.value)}
                  className="font-mono"
                  data-testid="jaundice-age"
                />
              </div>
              <div className="space-y-2">
                <Label>Age Unit</Label>
                <Select value={ageUnit} onValueChange={setAgeUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bilirubin with unit toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Bilirubin Level</Label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${!useMmol ? 'font-bold text-primary' : 'text-muted-foreground'}`}>mg/dL</span>
                  <Switch
                    checked={useMmol}
                    onCheckedChange={setUseMmol}
                    data-testid="unit-toggle"
                  />
                  <span className={`text-sm ${useMmol ? 'font-bold text-primary' : 'text-muted-foreground'}`}>µmol/L</span>
                </div>
              </div>
              <Input
                type="text"
                  inputMode="decimal"
                step="0.1"
                placeholder={useMmol ? "e.g., 250" : "e.g., 15"}
                value={bilirubin}
                onChange={(e) => setBilirubin(e.target.value)}
                className="font-mono text-lg h-12"
                data-testid="jaundice-bilirubin"
              />
            </div>

            {/* Risk Factors - Only show for term infants (≥35 weeks) */}
            {parseFloat(gestationalAge) >= 35 && (
              <div className="space-y-2">
                <Label>Risk Factors (for ≥35 weeks GA)</Label>
                <Select value={riskFactors} onValueChange={setRiskFactors}>
                  <SelectTrigger data-testid="risk-factors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Low Risk (≥38 wk, well)</SelectItem>
                    <SelectItem value="medium">Medium Risk (≥38 wk + risk OR 35-37+6d well)</SelectItem>
                    <SelectItem value="high">High Risk (35-37+6d with risk factors)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Risk factors: isoimmune disease, G6PD deficiency, asphyxia, sepsis, acidosis, albumin &lt;3g/dL
                </p>
              </div>
            )}
            
            {/* Show preterm notice */}
            {parseFloat(gestationalAge) < 35 && parseFloat(gestationalAge) > 0 && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Pre-term infant (&lt;35 weeks)
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Risk factors do not apply. Category determined by weight OR gestational age (whichever is more conservative).
                </p>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={reset} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={calculate} className="flex-1" data-testid="calculate-jaundice">
                <Sun className="h-4 w-4 mr-2" />
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && !result.error && (
          <Card className={`border-2 ${
            result.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-950/30' :
            result.severity === 'warning' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30' :
            result.severity === 'caution' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30' :
            'border-green-500 bg-green-50 dark:bg-green-950/30'
          }`}>
            <CardContent className="pt-6 space-y-4">
              {/* Recommendation */}
              <div className={`text-center p-4 rounded-lg ${
                result.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/50' :
                result.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-900/50' :
                result.severity === 'caution' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                'bg-green-100 dark:bg-green-900/50'
              }`}>
                {result.severity === 'critical' && <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />}
                {result.severity === 'warning' && <Sun className="h-8 w-8 mx-auto mb-2 text-amber-600" />}
                <p className={`text-lg font-bold ${
                  result.severity === 'critical' ? 'text-red-700 dark:text-red-300' :
                  result.severity === 'warning' ? 'text-amber-700 dark:text-amber-300' :
                  result.severity === 'caution' ? 'text-yellow-700 dark:text-yellow-300' :
                  'text-green-700 dark:text-green-300'
                }`} data-testid="jaundice-recommendation">
                  {result.recommendation}
                </p>
              </div>

              {/* Note if preterm thresholds used for term baby */}
              {result.usedPretermForTerm && (
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-center">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Using preterm thresholds (more conservative for low birth weight)
                  </p>
                </div>
              )}

              {/* Values */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-background border">
                  <p className="text-xs text-muted-foreground">Current Bilirubin</p>
                  <p className="text-xl font-mono font-bold">
                    {result.biliMmol} µmol/L
                  </p>
                  <p className="text-sm text-muted-foreground">({result.biliMg} mg/dL)</p>
                </div>
                <div className="p-3 rounded-lg bg-background border">
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="text-xl font-mono font-bold">
                    {result.ageHours} hours
                  </p>
                  <p className="text-sm text-muted-foreground">({(result.ageHours/24).toFixed(1)} days)</p>
                </div>
              </div>

              {/* Thresholds */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Phototherapy (PT)</p>
                  <p className="text-xl font-mono font-bold text-amber-700 dark:text-amber-300">
                    {result.ptThreshold} µmol/L
                  </p>
                  <p className="text-xs text-muted-foreground">({(result.ptThreshold/17.1).toFixed(1)} mg/dL)</p>
                  {result.interpolated && (
                    <p className="text-[10px] text-amber-600 mt-1">@ {result.ptTimePoint}h (nearest)</p>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium">Exchange (EX)</p>
                  <p className="text-xl font-mono font-bold text-red-700 dark:text-red-300">
                    {result.exThreshold} µmol/L
                  </p>
                  <p className="text-xs text-muted-foreground">({(result.exThreshold/17.1).toFixed(1)} mg/dL)</p>
                  {result.interpolated && (
                    <p className="text-[10px] text-red-600 mt-1">@ {result.exTimePoint}h (nearest)</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="text-center text-sm text-muted-foreground">
                Category: {result.category}
              </div>
            </CardContent>
          </Card>
        )}

        {result?.error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive text-center">{result.error}</p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JaundiceDialog;
