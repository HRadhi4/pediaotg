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

// Phototherapy and Exchange thresholds based on weight/GA and age
// Format: { PT: [thresholds by age], EX: [thresholds by age] }
// Pre-terms: <12h, 24h, 36h, 48h, 60h, 72h, 84h, 96-108h, 5days (9 values)
// Term (35wk+): birth, 12h, 24h, 36h, 48h, 60h, 72h, 84h, 96h, 5days (10 values)
const THRESHOLDS = {
  // Pre-terms (9 time points: <12h, 24h, 36h, 48h, 60h, 72h, 84h, 96-108h, 5days)
  "<1kg_<28wk": {
    PT: [80, 80, 80, 80, 80, 100, 100, 100, 120],
    EX: [200, 220, 220, 220, 220, 220, 220, 220, 220]
  },
  "1-1.249kg_28-29wk": {
    PT: [80, 100, 130, 140, 150, 150, 150, 150, 150],
    EX: [210, 230, 240, 240, 240, 240, 240, 240, 240]
  },
  "1.25-1.49kg_30-31wk": {
    PT: [80, 110, 140, 160, 170, 170, 170, 170, 170],
    EX: [220, 240, 250, 260, 260, 260, 260, 260, 260]
  },
  "1.5-1.99kg_32-33wk": {
    PT: [80, 120, 150, 180, 190, 200, 200, 200, 200],
    EX: [230, 250, 260, 280, 290, 300, 300, 300, 300]
  },
  "2-2.4kg_34wk": {
    PT: [100, 130, 160, 190, 210, 230, 240, 250, 250],
    EX: [240, 260, 280, 300, 310, 320, 330, 330, 330]
  },
  // Term infants high risk (35-37wk+6d with risk factor)
  // 10 time points: birth, 12h, 24h, 36h, 48h, 60h, 72h, 84h, 96h, 5days
  "35-37wk_high_risk": {
    PT: [70, 100, 135, 155, 190, 200, 220, 240, 240, 255],
    EX: [200, 220, 255, 270, 290, 310, 310, 330, 330, 330]
  },
  // Term infants medium risk (>=38wk with risk factor OR 35-37wk+6d well)
  "35-37wk_medium_risk": {
    PT: [85, 120, 170, 190, 220, 240, 255, 270, 290, 310],
    EX: [240, 255, 270, 310, 330, 340, 360, 370, 370, 370]
  },
  // Term low risk (>=38wk and well)
  ">=38wk_low_risk": {
    PT: [100, 155, 190, 220, 255, 270, 290, 310, 330, 360],
    EX: [270, 290, 330, 360, 370, 390, 410, 430, 430, 430]
  }
};

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
  const [useMmol, setUseMmol] = useState(false); // false = mg/dL, true = µmol/L
  const [riskFactors, setRiskFactors] = useState("none");
  const [result, setResult] = useState(null);

  // For pre-terms (9 time points): <12h, 24h, 36h, 48h, 60h, 72h, 84h, 96-108h, 5days
  const getAgeCategoryPreterm = (hours) => {
    if (hours < 12) return 0;
    if (hours < 24) return 1;
    if (hours < 36) return 2;
    if (hours < 48) return 3;
    if (hours < 60) return 4;
    if (hours < 72) return 5;
    if (hours < 84) return 6;
    if (hours < 108) return 7;
    return 8; // 5 days+
  };

  // For term infants (10 time points): birth, 12h, 24h, 36h, 48h, 60h, 72h, 84h, 96h, 5days
  const getAgeCategoryTerm = (hours) => {
    if (hours < 12) return 0;  // birth to <12h
    if (hours < 24) return 1;  // 12h
    if (hours < 36) return 2;  // 24h
    if (hours < 48) return 3;  // 36h
    if (hours < 60) return 4;  // 48h
    if (hours < 72) return 5;  // 60h
    if (hours < 84) return 6;  // 72h
    if (hours < 96) return 7;  // 84h
    if (hours < 120) return 8; // 96h
    return 9; // 5 days+
  };

  const getThresholdKey = () => {
    const w = parseFloat(weight);
    const ga = parseFloat(gestationalAge);
    
    if (!w || !ga) return null;
    
    // Pre-term categories
    if (w < 1 || ga < 28) return "<1kg_<28wk";
    if ((w >= 1 && w < 1.25) || (ga >= 28 && ga < 30)) return "1-1.249kg_28-29wk";
    if ((w >= 1.25 && w < 1.5) || (ga >= 30 && ga < 32)) return "1.25-1.49kg_30-31wk";
    if ((w >= 1.5 && w < 2) || (ga >= 32 && ga < 34)) return "1.5-1.99kg_32-33wk";
    if ((w >= 2 && w < 2.5) || ga === 34) return "2-2.4kg_34wk";
    
    // Term/Near-term categories based on risk
    if (ga >= 35 && ga < 38) {
      if (riskFactors === "high") return "35-37wk_high_risk";
      return "35-37wk_medium_risk";
    }
    
    // >=38 weeks
    if (riskFactors === "high") return "35-37wk_high_risk";
    if (riskFactors === "medium") return "35-37wk_medium_risk";
    return ">=38wk_low_risk";
  };

  const calculate = () => {
    const w = parseFloat(weight);
    const ga = parseFloat(gestationalAge);
    let ageHours = parseFloat(postnatalAge);
    let bili = parseFloat(bilirubin);
    
    if (!w || !ga || !ageHours || !bili) {
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
    
    const thresholdKey = getThresholdKey();
    if (!thresholdKey || !THRESHOLDS[thresholdKey]) {
      setResult({ error: "Could not determine threshold category" });
      return;
    }
    
    // Use appropriate age category function based on gestational age
    const isTerm = ga >= 35;
    const ageCategory = isTerm ? getAgeCategoryTerm(ageHours) : getAgeCategoryPreterm(ageHours);
    const thresholds = THRESHOLDS[thresholdKey];
    const ptThreshold = thresholds.PT[ageCategory];
    const exThreshold = thresholds.EX[ageCategory];
    
    // Determine recommendation
    let recommendation = "Monitor";
    let severity = "normal";
    
    if (biliMmol >= exThreshold) {
      recommendation = "Exchange Transfusion Required";
      severity = "critical";
    } else if (biliMmol >= ptThreshold) {
      recommendation = "Phototherapy Required";
      severity = "warning";
    } else if (biliMmol >= ptThreshold * 0.8) {
      recommendation = "Approaching Phototherapy Threshold - Monitor Closely";
      severity = "caution";
    }
    
    setResult({
      category: thresholdKey.replace(/_/g, " "),
      ageHours,
      biliMmol: biliMmol.toFixed(1),
      biliMg: biliMg.toFixed(1),
      ptThreshold,
      exThreshold,
      recommendation,
      severity
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
                  inputMode="text"
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
                  inputMode="text"
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
                  inputMode="text"
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
                  inputMode="text"
                step="0.1"
                placeholder={useMmol ? "e.g., 250" : "e.g., 15"}
                value={bilirubin}
                onChange={(e) => setBilirubin(e.target.value)}
                className="font-mono text-lg h-12"
                data-testid="jaundice-bilirubin"
              />
            </div>

            {/* Risk Factors */}
            <div className="space-y-2">
              <Label>Risk Factors (for ≥35 weeks GA)</Label>
              <Select value={riskFactors} onValueChange={setRiskFactors}>
                <SelectTrigger data-testid="risk-factors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Low Risk (≥38wk, well)</SelectItem>
                  <SelectItem value="medium">Medium Risk (≥38wk + risk factors OR 35-37wk well)</SelectItem>
                  <SelectItem value="high">High Risk (35-37wk + 6d with risk factors)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Risk factors: isoimmune disease, G6PD deficiency, asphyxia, sepsis, acidosis, albumin &lt;3g/dL
              </p>
            </div>

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
                </div>
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium">Exchange (EX)</p>
                  <p className="text-xl font-mono font-bold text-red-700 dark:text-red-300">
                    {result.exThreshold} µmol/L
                  </p>
                  <p className="text-xs text-muted-foreground">({(result.exThreshold/17.1).toFixed(1)} mg/dL)</p>
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

        {/* Reference Table Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Reference Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Based on AAP/NICE phototherapy and exchange transfusion guidelines</p>
            <p>• Pre-term thresholds vary by weight and gestational age</p>
            <p>• Risk factors include: isoimmune hemolytic disease, G6PD deficiency, asphyxia, significant lethargy, temperature instability, sepsis, acidosis, or albumin &lt;3g/dL</p>
            <p>• Always correlate with clinical assessment</p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default JaundiceDialog;
