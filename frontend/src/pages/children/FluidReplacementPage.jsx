/**
 * Children's Fluid Replacement Page
 * 
 * Fluid calculator with:
 * - Holliday-Segar maintenance calculations
 * - Dehydration replacement calculations
 * - Support for infants and children
 */

import { useState, useEffect } from "react";
import { ArrowLeftIcon, FluidIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const FluidReplacementPage = ({ onBack }) => {
  const [weight, setWeight] = useState("");
  const [ageGroup, setAgeGroup] = useState("children"); // "infant" or "children"
  const [dehydrationLevel, setDehydrationLevel] = useState("moderate");
  const [calculationType, setCalculationType] = useState("dehydration"); // "maintenance" or "dehydration"

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const w = parseFloat(weight) || 0;
  const includeDeficit = calculationType === "dehydration";

  // Maintenance fluid calculation (Holliday-Segar formula)
  const calculateMaintenance = (kg) => {
    if (kg <= 0) return 0;
    if (kg <= 10) return kg * 100;
    if (kg <= 20) return 1000 + (kg - 10) * 50;
    return 1500 + (kg - 20) * 20;
  };

  // Deficit percentages
  const deficitTable = {
    infant: { mild: 5, moderate: 10, severe: 15 },
    children: { mild: 3, moderate: 6, severe: 9 }
  };

  // Calculate all values
  const maintenance24h = calculateMaintenance(w);
  const deficitPercent = includeDeficit ? deficitTable[ageGroup][dehydrationLevel] : 0;
  const deficitMlPerKg = deficitPercent * 10; // Convert % to ml/kg
  const totalDeficit = w * deficitMlPerKg;

  // Daily cap for safety
  const dailyCap = 2500;

  // First 8 hours: 1/3 maintenance + 1/2 deficit
  const maint8h = maintenance24h / 3;
  const deficit8h = includeDeficit ? totalDeficit / 2 : 0;
  const rawTotal8h = maint8h + deficit8h;
  // Cap 8h total at proportional share of daily cap (8/24 = 1/3 of 2500 = ~833ml)
  const maxFor8h = dailyCap / 3;
  const total8h = Math.min(rawTotal8h, maxFor8h);
  const is8hCapped = rawTotal8h > maxFor8h;
  const rate8h = total8h / 8;

  // Next 16 hours: 2/3 maintenance + 1/2 deficit
  const maint16h = (maintenance24h * 2) / 3;
  const deficit16h = includeDeficit ? totalDeficit / 2 : 0;
  const rawTotal16h = maint16h + deficit16h;
  // Cap 16h total at proportional share of daily cap (16/24 = 2/3 of 2500 = ~1667ml)
  const maxFor16h = (dailyCap * 2) / 3;
  const total16h = Math.min(rawTotal16h, maxFor16h);
  const is16hCapped = rawTotal16h > maxFor16h;
  const rate16h = total16h / 16;

  // Total 24h (capped at 2500ml)
  const rawTotal24h = rawTotal8h + rawTotal16h;
  const total24h = Math.min(total8h + total16h, dailyCap);
  const exceeds2500 = rawTotal24h > dailyCap;

  // Maintenance only hourly rate
  const maintenanceHourlyRate = maintenance24h / 24;

  return (
    <div className="space-y-4 pt-4 pb-4">
      {/* Input Card */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 space-y-4">
          {/* Calculation Type Toggle */}
          <div>
            <Label className="text-[10px] text-muted-foreground mb-2 block">Calculation Type</Label>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setCalculationType("maintenance")}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  calculationType === "maintenance"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-50 dark:bg-gray-800 text-muted-foreground hover:bg-gray-100"
                }`}
              >
                Maintenance Only
              </button>
              <button
                onClick={() => setCalculationType("dehydration")}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  calculationType === "dehydration"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-50 dark:bg-gray-800 text-muted-foreground hover:bg-gray-100"
                }`}
              >
                + Dehydration
              </button>
            </div>
          </div>

          {/* Weight Input */}
          <div>
            <Label className="text-[10px] text-muted-foreground">Weight (kg)</Label>
            <Input
              type="number"
              placeholder="Enter weight in kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              className="font-mono text-lg h-12"
            />
          </div>

          {/* Age Group - Only show for dehydration calculation */}
          {includeDeficit && (
            <div>
              <Label className="text-[10px] text-muted-foreground mb-2 block">Age Group</Label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setAgeGroup("infant")}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    ageGroup === "infant"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-50 dark:bg-gray-800 text-muted-foreground"
                  }`}
                >
                  Infant (&lt;1 year)
                </button>
                <button
                  onClick={() => setAgeGroup("children")}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    ageGroup === "children"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-50 dark:bg-gray-800 text-muted-foreground"
                  }`}
                >
                  Children (&gt;1 year)
                </button>
              </div>
            </div>
          )}

          {/* Dehydration Level - Only show for dehydration calculation */}
          {includeDeficit && (
            <div>
              <Label className="text-[10px] text-muted-foreground mb-2 block">Dehydration Level</Label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setDehydrationLevel("mild")}
                  className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                    dehydrationLevel === "mild"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-50 dark:bg-gray-800 text-muted-foreground"
                  }`}
                >
                  Mild
                </button>
                <button
                  onClick={() => setDehydrationLevel("moderate")}
                  className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                    dehydrationLevel === "moderate"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-50 dark:bg-gray-800 text-muted-foreground"
                  }`}
                >
                  Moderate
                </button>
                <button
                  onClick={() => setDehydrationLevel("severe")}
                  className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                    dehydrationLevel === "severe"
                      ? "bg-red-500 text-white"
                      : "bg-gray-50 dark:bg-gray-800 text-muted-foreground"
                  }`}
                >
                  Severe
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deficit Reference Table - Only show for dehydration calculation */}
      {includeDeficit && (
        <Card className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Deficit Reference (% body weight)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 px-2">Severity</th>
                    <th className="text-center py-1 px-2">Infant (&lt;1y)</th>
                    <th className="text-center py-1 px-2">Children</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-1 px-2 font-medium text-yellow-600">Mild</td>
                    <td className="text-center py-1 px-2">5%</td>
                    <td className="text-center py-1 px-2">3%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1 px-2 font-medium text-orange-600">Moderate</td>
                    <td className="text-center py-1 px-2">10%</td>
                    <td className="text-center py-1 px-2">6%</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 font-medium text-red-600">Severe</td>
                    <td className="text-center py-1 px-2">15%</td>
                    <td className="text-center py-1 px-2">9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {w > 0 && (
        <>
          {/* Maintenance Only Results */}
          {!includeDeficit && (
            <Card className="nightingale-card border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-600">Maintenance Fluids</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-[10px] text-muted-foreground">24-Hour Total</p>
                    <p className="text-2xl font-bold font-mono text-blue-600">{maintenance24h.toFixed(0)}</p>
                    <p className="text-[10px] text-muted-foreground">mL/24hr</p>
                  </div>
                  <div className="p-3 rounded bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-[10px] text-muted-foreground">Hourly Rate</p>
                    <p className="text-2xl font-bold font-mono text-blue-600">{maintenanceHourlyRate.toFixed(1)}</p>
                    <p className="text-[10px] text-muted-foreground">mL/hr</p>
                  </div>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-800/50 text-[10px] text-muted-foreground">
                  <p className="font-medium text-foreground">Holliday-Segar Formula:</p>
                  <p>• First 10 kg: 100 mL/kg/day</p>
                  <p>• Next 10 kg: 50 mL/kg/day</p>
                  <p>• Each kg &gt;20: 20 mL/kg/day</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dehydration + Maintenance Results */}
          {includeDeficit && (
            <>
              <Card className={`nightingale-card ${is8hCapped ? "border-red-200 dark:border-red-800" : "border-amber-200 dark:border-amber-800"}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm">
                      <span className={`${is8hCapped ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"} text-xs`}>0-8 hrs</span>
                      First 8 Hours
                    </CardTitle>
                    <span className={`text-xl font-bold font-mono ${is8hCapped ? "text-red-600" : "text-amber-600"}`}>{rate8h.toFixed(1)} mL/hr</span>
                  </div>
                  {is8hCapped && (
                    <p className="text-[10px] text-red-600">⚠️ Capped at {maxFor8h.toFixed(0)} mL (was {rawTotal8h.toFixed(0)} mL)</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                      <p className="text-[10px] text-muted-foreground">Maintenance</p>
                      <p className="font-bold">{maint8h.toFixed(0)} mL</p>
                    </div>
                    <div className="p-2 rounded bg-orange-50 dark:bg-orange-900/20">
                      <p className="text-[10px] text-muted-foreground">Deficit</p>
                      <p className="font-bold">{deficit8h.toFixed(0)} mL</p>
                    </div>
                    <div className={`p-2 rounded ${is8hCapped ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"}`}>
                      <p className="text-[10px] text-muted-foreground">Total</p>
                      <p className={`font-bold ${is8hCapped ? "text-red-600" : "text-green-600"}`}>{total8h.toFixed(0)} mL</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`nightingale-card ${is16hCapped ? "border-red-200 dark:border-red-800" : "border-teal-200 dark:border-teal-800"}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm">
                      <span className={`${is16hCapped ? "text-red-600 dark:text-red-400" : "text-teal-600 dark:text-teal-400"} text-xs`}>8-24 hrs</span>
                      Next 16 Hours
                    </CardTitle>
                    <span className={`text-xl font-bold font-mono ${is16hCapped ? "text-red-600" : "text-teal-600"}`}>{rate16h.toFixed(1)} mL/hr</span>
                  </div>
                  {is16hCapped && (
                    <p className="text-[10px] text-red-600">⚠️ Capped at {maxFor16h.toFixed(0)} mL (was {rawTotal16h.toFixed(0)} mL)</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                      <p className="text-[10px] text-muted-foreground">Maintenance</p>
                      <p className="font-bold">{maint16h.toFixed(0)} mL</p>
                    </div>
                    <div className="p-2 rounded bg-orange-50 dark:bg-orange-900/20">
                      <p className="text-[10px] text-muted-foreground">Deficit</p>
                      <p className="font-bold">{deficit16h.toFixed(0)} mL</p>
                    </div>
                    <div className={`p-2 rounded ${is16hCapped ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"}`}>
                      <p className="text-[10px] text-muted-foreground">Total</p>
                      <p className={`font-bold ${is16hCapped ? "text-red-600" : "text-green-600"}`}>{total16h.toFixed(0)} mL</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`nightingale-card ${exceeds2500 ? "border-red-300 dark:border-red-700" : "border-green-300 dark:border-green-700"}`}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Total 24-Hour Fluids</p>
                      {exceeds2500 && (
                        <p className="text-[10px] text-red-600">⚠️ Capped at {dailyCap} mL/day (calculated: {rawTotal24h.toFixed(0)} mL)</p>
                      )}
                    </div>
                    <p className={`text-2xl font-bold font-mono ${exceeds2500 ? "text-red-600" : "text-green-600"}`}>
                      {total24h.toFixed(0)} mL
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}

      {/* Reference Card */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Fluid Replacement Guidelines</p>
          <p>• Maintenance: Holliday-Segar formula (4-2-1 rule)</p>
          <p>• Deficit: % dehydration × weight (kg) × 10 = mL deficit</p>
          <p>• First 8h: 1/3 maintenance + 1/2 deficit</p>
          <p>• Next 16h: 2/3 maintenance + 1/2 deficit</p>
          <p>• Maximum 2500 mL/day for safety</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FluidReplacementPage;
