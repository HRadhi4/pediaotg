import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const PRBCGuidelinePage = () => {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [ga, setGa] = useState("");
  const [hb, setHb] = useState("");
  const [hct, setHct] = useState("");
  const [hasRespSupport, setHasRespSupport] = useState(false);
  const [result, setResult] = useState(null);

  const UNIT_VOLUME = 280; // 1 unit = 280 ml

  // Transfusion thresholds based on guidelines
  const getThresholds = (category, ageGroup, respSupport) => {
    const pretermThresholds = {
      "1-7": { resp: { hct: 35, hb: 12 }, noResp: { hct: 33, hb: 11 } },
      "8-14": { resp: { hct: 33, hb: 11 }, noResp: { hct: 27, hb: 9 } },
      "15+": { resp: { hct: 30, hb: 10 }, noResp: { hct: 25, hb: 8 } }
    };

    const termThresholds = {
      "1-7": { resp: { hct: 40, hb: 13.5 }, noResp: { hct: 35, hb: 12 } },
      "8-14": { resp: { hct: 35, hb: 12 }, noResp: { hct: 30, hb: 10 } },
      "15+": { resp: { hct: 33, hb: 11 }, noResp: { hct: 23, hb: 7.7 } }
    };

    const thresholds = category === "preterm" ? pretermThresholds : termThresholds;
    const ageThresholds = thresholds[ageGroup];
    return respSupport ? ageThresholds.resp : ageThresholds.noResp;
  };

  const calculate = () => {
    const w = parseFloat(weight);
    const ageNum = parseInt(age);
    const gaNum = parseInt(ga);
    const hbVal = parseFloat(hb);
    const hctVal = parseFloat(hct);

    if (!w) {
      setResult({ error: "Please enter weight" });
      return;
    }

    if (!ageNum) {
      setResult({ error: "Please enter age in days" });
      return;
    }

    if (!hbVal && !hctVal) {
      setResult({ error: "Please enter Hb or Hct" });
      return;
    }

    const isPreterm = (gaNum && gaNum <= 32) || w < 1.5;
    const category = isPreterm ? "preterm" : "term";

    let ageGroup;
    if (ageNum <= 7) ageGroup = "1-7";
    else if (ageNum <= 14) ageGroup = "8-14";
    else ageGroup = "15+";

    const thresholds = getThresholds(category, ageGroup, hasRespSupport);

    let transfusionIndicated = false;
    let reasons = [];

    if (hbVal && hbVal <= thresholds.hb) {
      transfusionIndicated = true;
      reasons.push(`Hb ${hbVal} ≤ ${thresholds.hb} g/dL`);
    }
    if (hctVal && hctVal <= thresholds.hct) {
      transfusionIndicated = true;
      reasons.push(`Hct ${hctVal} ≤ ${thresholds.hct}%`);
    }

    let dosePerKg = 15;
    let doseNote = "Standard dose: 15 ml/kg";

    const totalDose = w * dosePerKg;
    const units = totalDose / UNIT_VOLUME;

    setResult({
      transfusionIndicated,
      reasons: reasons.length > 0 ? reasons : ["Values above threshold"],
      thresholds,
      category,
      categoryLabel: isPreterm ? "Preterm (BW <1.5kg or GA ≤32wk)" : "Late Preterm/Term (≥32wk or >1.5kg)",
      ageGroup: ageNum <= 7 ? "1-7 days" : ageNum <= 14 ? "8-14 days" : "≥15 days",
      dosePerKg,
      doseNote,
      totalDose: totalDose.toFixed(1),
      units: units.toFixed(2),
      respSupport: hasRespSupport
    });
  };

  const reset = () => {
    setWeight("");
    setAge("");
    setGa("");
    setHb("");
    setHct("");
    setHasRespSupport(false);
    setResult(null);
  };

  const pretermTable = [
    { age: "1-7 days", respHct: "≤35", respHb: "≤12", noRespHct: "≤33", noRespHb: "≤11" },
    { age: "8-14 days", respHct: "≤33", respHb: "≤11", noRespHct: "≤27", noRespHb: "≤9" },
    { age: "≥15 days", respHct: "≤30", respHb: "≤10", noRespHct: "≤25", noRespHb: "≤8" }
  ];

  const termTable = [
    { age: "1-7 days", respHct: "≤40", respHb: "≤13.5", noRespHct: "≤35", noRespHb: "≤12" },
    { age: "8-14 days", respHct: "≤35", respHb: "≤12", noRespHct: "≤30", noRespHb: "≤10" },
    { age: "≥15 days", respHct: "≤33", respHb: "≤11", noRespHct: "≤23", noRespHb: "≤7.7" }
  ];

  return (
    <div className="space-y-4 pt-4">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Weight (kg)</Label>
                  <Input type="number" step="0.01" placeholder="1.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Age (days)</Label>
                  <Input type="number" placeholder="5" value={age} onChange={(e) => setAge(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">GA (weeks)</Label>
                  <Input type="number" placeholder="32" value={ga} onChange={(e) => setGa(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Lab Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Hb (g/dL)</Label>
                  <Input type="number" step="0.1" placeholder="e.g., 10" value={hb} onChange={(e) => setHb(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Hct (%)</Label>
                  <Input type="number" step="1" placeholder="e.g., 30" value={hct} onChange={(e) => setHct(e.target.value)} className="nightingale-input font-mono h-9" />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <Checkbox id="respSupport" checked={hasRespSupport} onCheckedChange={setHasRespSupport} />
                <Label htmlFor="respSupport" className="cursor-pointer text-sm">On Respiratory Support (Vent/CPAP/O2 NC)</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={reset} className="flex-1 rounded-2xl">Reset</Button>
            <Button onClick={calculate} className="flex-1 nightingale-btn-primary">Calculate</Button>
          </div>

          {result && !result.error && (
            <Card className={`rounded-2xl ${result.transfusionIndicated ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'border-green-300 bg-green-50 dark:bg-green-950/30'}`}>
              <CardContent className="pt-4 space-y-4">
                <div className={`text-center p-4 rounded-xl ${result.transfusionIndicated ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                  <p className={`text-lg font-bold ${result.transfusionIndicated ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                    {result.transfusionIndicated ? "Transfusion Indicated" : "Transfusion Not Indicated"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{result.reasons.join(", ")}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                    <p className="text-xs text-muted-foreground">Hb Threshold</p>
                    <p className="text-xl font-mono font-bold">≤ {result.thresholds.hb} g/dL</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                    <p className="text-xs text-muted-foreground">Hct Threshold</p>
                    <p className="text-xl font-mono font-bold">≤ {result.thresholds.hct}%</p>
                  </div>
                </div>

                {result.transfusionIndicated && (
                  <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border">
                    <p className="text-xs text-muted-foreground mb-2">{result.doseNote}</p>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Recommended Dose</p>
                      <p className="text-3xl font-mono font-bold text-red-600 dark:text-red-400">{result.totalDose} ml</p>
                      <p className="text-xs text-muted-foreground mt-2">{result.dosePerKg} ml/kg × {weight} kg = {result.totalDose} ml ({result.units} units)</p>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p><span className="font-medium">Category:</span> {result.categoryLabel}</p>
                  <p><span className="font-medium">Age Group:</span> {result.ageGroup}</p>
                  <p><span className="font-medium">Respiratory Support:</span> {result.respSupport ? "Yes" : "No"}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {result?.error && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 rounded-2xl">
              <CardContent className="pt-4">
                <p className="text-red-600 text-center">{result.error}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">BW &lt;1.5kg or GA ≤32 weeks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Age</th>
                      <th className="text-center py-2" colSpan={2}>Resp Support</th>
                      <th className="text-center py-2" colSpan={2}>No Resp Support</th>
                    </tr>
                    <tr className="border-b text-muted-foreground">
                      <th></th>
                      <th className="text-center py-1">Hct</th>
                      <th className="text-center py-1">Hb</th>
                      <th className="text-center py-1">Hct</th>
                      <th className="text-center py-1">Hb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pretermTable.map((row, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 font-medium">{row.age}</td>
                        <td className="text-center py-2 text-red-600">{row.respHct}</td>
                        <td className="text-center py-2 text-red-600">{row.respHb}</td>
                        <td className="text-center py-2 text-blue-600">{row.noRespHct}</td>
                        <td className="text-center py-2 text-blue-600">{row.noRespHb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">GA ≥32 weeks and/or &gt;1.5kg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Age</th>
                      <th className="text-center py-2" colSpan={2}>Resp Support</th>
                      <th className="text-center py-2" colSpan={2}>No Resp Support</th>
                    </tr>
                    <tr className="border-b text-muted-foreground">
                      <th></th>
                      <th className="text-center py-1">Hct</th>
                      <th className="text-center py-1">Hb</th>
                      <th className="text-center py-1">Hct</th>
                      <th className="text-center py-1">Hb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {termTable.map((row, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 font-medium">{row.age}</td>
                        <td className="text-center py-2 text-red-600">{row.respHct}</td>
                        <td className="text-center py-2 text-red-600">{row.respHb}</td>
                        <td className="text-center py-2 text-blue-600">{row.noRespHct}</td>
                        <td className="text-center py-2 text-blue-600">{row.noRespHb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• <span className="font-medium">Respiratory support</span> includes: Mechanical ventilation, CPAP, O2 by nasal cannula</p>
              <p>• <span className="font-medium">Dose:</span> 20 ml/kg PRBC (10-15 ml/kg if Hct &gt;30%)</p>
              <p>• <span className="font-medium">1 unit PRBC</span> = 280 ml</p>
              <p>• Transfuse over 3-4 hours</p>
              <p className="pt-2 border-t">• <span className="font-medium">Polycythemia:</span> Hct &gt;65% or Hb &gt;22 g/dL in term infant</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PRBCGuidelinePage;
