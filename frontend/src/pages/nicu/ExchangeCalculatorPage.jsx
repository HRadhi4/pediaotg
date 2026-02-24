import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExchangeCalculatorPage = () => {
  const [activeTab, setActiveTab] = useState("partial");
  const [weight, setWeight] = useState("");
  const [observedHct, setObservedHct] = useState("");
  const [desiredHct, setDesiredHct] = useState("55");

  const calculatePartialExchange = () => {
    const w = parseFloat(weight) || 0;
    const obsHct = parseFloat(observedHct) || 0;
    const desHct = parseFloat(desiredHct) || 55;
    
    if (obsHct <= 0 || w <= 0) return null;
    
    const volume = (80 * w * (obsHct - desHct)) / obsHct;
    
    return {
      volume: Math.max(0, volume).toFixed(1),
      weight: w,
      obsHct,
      desHct,
      isIndicated: obsHct > 65
    };
  };

  const calculateWholeBloodExchange = () => {
    const w = parseFloat(weight) || 0;
    if (w <= 0) return null;
    
    const totalVolume = 2 * 85 * w;
    const singleVolume = 85 * w;
    
    return {
      totalVolume: totalVolume.toFixed(1),
      singleVolume: singleVolume.toFixed(1),
      weight: w
    };
  };

  const partialResult = calculatePartialExchange();
  const wholeBloodResult = calculateWholeBloodExchange();

  return (
    <div className="space-y-4 pt-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="partial">Partial Exchange</TabsTrigger>
          <TabsTrigger value="whole">Whole Blood</TabsTrigger>
        </TabsList>

        <TabsContent value="partial" className="space-y-4">
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 rounded-2xl">
            <CardContent className="pt-4">
              <p className="font-semibold text-sm text-amber-800 dark:text-amber-200 mb-2">Polycythemia Indications:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Hct &gt; <span className="font-bold">70%</span> in asymptomatic neonates</li>
                <li>• Hct &gt; <span className="font-bold">65%</span> in symptomatic neonates</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="font-medium">Symptoms:</span> Hypoglycemia, Jaundice, Jitteriness, Respiratory distress, Seizures, Cyanosis, Apnea
              </p>
            </CardContent>
          </Card>

          <Card className="nightingale-card">
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="text"
                  inputMode="text" step="0.01" placeholder="e.g., 3.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="nightingale-input font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Observed Hct (%)</Label>
                  <Input type="text"
                  inputMode="text" placeholder="e.g., 70" value={observedHct} onChange={(e) => setObservedHct(e.target.value)} className="nightingale-input font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Desired Hct (%)</Label>
                  <Input type="text"
                  inputMode="text" placeholder="55" value={desiredHct} onChange={(e) => setDesiredHct(e.target.value)} className="nightingale-input font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>

          {partialResult && parseFloat(weight) > 0 && parseFloat(observedHct) > 0 && (
            <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/30 rounded-2xl">
              <CardContent className="pt-4 space-y-4">
                <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                  <p className="text-sm text-muted-foreground">Volume to be Withdrawn</p>
                  <p className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400">
                    {partialResult.volume} <span className="text-lg">ml</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Replace with equal volume of Normal Saline</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Formula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-xs text-center">
                Volume = (80 × Wt × (Obs Hct - Desired Hct)) / Obs Hct
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Perform partial exchange transfusion</li>
                <li>• Remove calculated blood and replace with NS/IVF</li>
                <li>• Target: Reduce Hct to ~55%</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whole" className="space-y-4">
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 rounded-2xl">
            <CardContent className="pt-4">
              <p className="font-semibold text-sm text-amber-800 dark:text-amber-200 mb-2">Neonatal Jaundice Exchange Indications:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• TSB at exchange level per gestational age</li>
                <li>• Failed intensive phototherapy</li>
                <li>• Signs of acute bilirubin encephalopathy</li>
                <li>• Hemolytic disease with rapid TSB rise</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="nightingale-card">
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="text"
                  inputMode="text" step="0.01" placeholder="e.g., 3.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="nightingale-input font-mono" />
              </div>
            </CardContent>
          </Card>

          {wholeBloodResult && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 rounded-2xl">
              <CardContent className="pt-4 space-y-4">
                <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                  <p className="text-sm text-muted-foreground">Double Volume Exchange</p>
                  <p className="text-4xl font-mono font-bold text-red-600 dark:text-red-400">
                    {wholeBloodResult.totalVolume} <span className="text-lg">ml</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">2 × 85 ml/kg × {wholeBloodResult.weight} kg</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-800 text-center">
                    <p className="text-xs text-muted-foreground">Single Volume</p>
                    <p className="text-xl font-mono font-bold">{wholeBloodResult.singleVolume} ml</p>
                    <p className="text-xs text-muted-foreground">85 ml/kg</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-800 text-center">
                    <p className="text-xs text-muted-foreground">Blood Volume</p>
                    <p className="text-xl font-mono font-bold">{wholeBloodResult.singleVolume} ml</p>
                    <p className="text-xs text-muted-foreground">Estimated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Formula & Procedure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-xs text-center">
                Double Volume = 2 × 85 ml/kg × Weight
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use whole blood or reconstituted blood</li>
                <li>• Exchange in 5-10 ml aliquots</li>
                <li>• Remove baby&apos;s blood, replace with donor blood</li>
                <li>• Monitor vitals, glucose, calcium during procedure</li>
                <li>• Removes ~85% of baby&apos;s blood/bilirubin</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExchangeCalculatorPage;
