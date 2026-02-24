import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const IntubationPage = () => {
  const [weight, setWeight] = useState("");
  const [gestationalAge, setGestationalAge] = useState("");

  // Endotracheal Intubation Guidelines
  const guidelines = [
    { gaRange: "<28", weightRange: "<1.0", tubeSize: "2.5", depthRange: "6-7" },
    { gaRange: "28-34", weightRange: "1.0-2.0", tubeSize: "3.0", depthRange: "7-8" },
    { gaRange: "34-38", weightRange: "2.0-3.0", tubeSize: "3.5", depthRange: "8-9" },
    { gaRange: ">38", weightRange: ">3.0", tubeSize: "3.5-4.0", depthRange: "9-10" }
  ];

  const calculateResults = () => {
    const w = parseFloat(weight) || 0;
    const ga = parseInt(gestationalAge) || 0;

    if (w <= 0 && ga <= 0) return null;

    // Calculate depth using formula: 6 + weight (kg)
    const calculatedDepth = w > 0 ? (6 + w).toFixed(1) : null;

    // Determine tube size and reference depth based on weight or GA
    let tubeSize = "";
    let referenceDepth = "";
    let category = "";

    if (w > 0) {
      if (w < 1.0) {
        tubeSize = "2.5";
        referenceDepth = "6-7";
        category = "<1.0 kg";
      } else if (w <= 2.0) {
        tubeSize = "3.0";
        referenceDepth = "7-8";
        category = "1.0-2.0 kg";
      } else if (w <= 3.0) {
        tubeSize = "3.5";
        referenceDepth = "8-9";
        category = "2.0-3.0 kg";
      } else {
        tubeSize = "3.5-4.0";
        referenceDepth = "9-10";
        category = ">3.0 kg";
      }
    } else if (ga > 0) {
      if (ga < 28) {
        tubeSize = "2.5";
        referenceDepth = "6-7";
        category = "<28 weeks";
      } else if (ga <= 34) {
        tubeSize = "3.0";
        referenceDepth = "7-8";
        category = "28-34 weeks";
      } else if (ga <= 38) {
        tubeSize = "3.5";
        referenceDepth = "8-9";
        category = "34-38 weeks";
      } else {
        tubeSize = "3.5-4.0";
        referenceDepth = "9-10";
        category = ">38 weeks";
      }
    }

    return {
      tubeSize,
      referenceDepth,
      calculatedDepth,
      category,
      weight: w,
      ga
    };
  };

  const result = calculateResults();

  return (
    <div className="space-y-4 pt-4">
      {/* Input */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Patient Information</CardTitle>
          <CardDescription className="text-xs">Enter weight or gestational age</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Weight (kg)</Label>
              <Input
                type="number"
                  inputMode="decimal"
                step="0.01"
                placeholder="e.g., 1.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="nightingale-input font-mono h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">GA (weeks)</Label>
              <Input
                type="number"
                  inputMode="decimal"
                placeholder="e.g., 32"
                value={gestationalAge}
                onChange={(e) => setGestationalAge(e.target.value)}
                className="nightingale-input font-mono h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl">
          <CardContent className="pt-4 space-y-4">
            {/* Category */}
            <div className="text-center text-sm text-muted-foreground">
              Category: <span className="font-medium text-purple-600 dark:text-purple-400">{result.category}</span>
            </div>

            {/* ET Tube Size */}
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border text-center">
              <p className="text-xs text-muted-foreground mb-1">ET Tube Size (ID)</p>
              <p className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400">
                {result.tubeSize} <span className="text-lg">mm</span>
              </p>
            </div>

            {/* Depth */}
            <div className="grid grid-cols-2 gap-3">
              {result.calculatedDepth && (
                <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                  <p className="text-xs text-muted-foreground">Calculated Depth</p>
                  <p className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">{result.calculatedDepth} cm</p>
                  <p className="text-xs text-muted-foreground mt-1">6 + {result.weight} kg</p>
                </div>
              )}
              <div className={`p-3 rounded-xl bg-white dark:bg-gray-800 border text-center ${!result.calculatedDepth ? 'col-span-2' : ''}`}>
                <p className="text-xs text-muted-foreground">Reference Depth</p>
                <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">{result.referenceDepth} cm</p>
                <p className="text-xs text-muted-foreground mt-1">From upper lip</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reference Table */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reference Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">GA (wk)</th>
                  <th className="text-center py-2">Weight (kg)</th>
                  <th className="text-center py-2">Tube (mm)</th>
                  <th className="text-center py-2">Depth (cm)</th>
                </tr>
              </thead>
              <tbody>
                {guidelines.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{row.gaRange}</td>
                    <td className="text-center py-2">{row.weightRange}</td>
                    <td className="text-center py-2 font-bold text-purple-600">{row.tubeSize}</td>
                    <td className="text-center py-2">{row.depthRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Formula */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Formula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-sm text-center">
            Depth (cm) = <span className="text-purple-600 font-bold">6 + Weight (kg)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            • Measure from upper lip to mid-trachea
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntubationPage;
