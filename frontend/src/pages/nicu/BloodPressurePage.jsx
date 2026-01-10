import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const BloodPressurePage = () => {
  const [ageType, setAgeType] = useState("dayOne");
  const [gestationalAge, setGestationalAge] = useState("");

  const dayOneData = {
    22: { systolic: { high: 55, normal: 39, low: 22 }, diastolic: { high: 31, normal: 22, low: 14 }, mean: { high: 39, normal: 28, low: 17 } },
    23: { systolic: { high: 56, normal: 40, low: 23 }, diastolic: { high: 32, normal: 24, low: 15 }, mean: { high: 40, normal: 29, low: 18 } },
    24: { systolic: { high: 57, normal: 42, low: 25 }, diastolic: { high: 33, normal: 25, low: 16 }, mean: { high: 41, normal: 31, low: 19 } },
    25: { systolic: { high: 58, normal: 43, low: 26 }, diastolic: { high: 34, normal: 26, low: 17 }, mean: { high: 42, normal: 32, low: 20 } },
    26: { systolic: { high: 60, normal: 44, low: 27 }, diastolic: { high: 35, normal: 27, low: 18 }, mean: { high: 43, normal: 33, low: 21 } },
    27: { systolic: { high: 61, normal: 45, low: 29 }, diastolic: { high: 36, normal: 29, low: 19 }, mean: { high: 44, normal: 34, low: 22 } },
    28: { systolic: { high: 63, normal: 47, low: 31 }, diastolic: { high: 37, normal: 29, low: 20 }, mean: { high: 46, normal: 35, low: 24 } },
    29: { systolic: { high: 64, normal: 48, low: 33 }, diastolic: { high: 38, normal: 30, low: 21 }, mean: { high: 47, normal: 36, low: 25 } },
    30: { systolic: { high: 66, normal: 50, low: 35 }, diastolic: { high: 39, normal: 31, low: 22 }, mean: { high: 48, normal: 37, low: 26 } },
    31: { systolic: { high: 68, normal: 51, low: 36 }, diastolic: { high: 40, normal: 32, low: 23 }, mean: { high: 49, normal: 38, low: 27 } },
    32: { systolic: { high: 69, normal: 52, low: 37 }, diastolic: { high: 41, normal: 33, low: 24 }, mean: { high: 50, normal: 39, low: 28 } },
    33: { systolic: { high: 70, normal: 53, low: 38 }, diastolic: { high: 42, normal: 34, low: 25 }, mean: { high: 51, normal: 40, low: 29 } },
    34: { systolic: { high: 71, normal: 55, low: 40 }, diastolic: { high: 43, normal: 35, low: 26 }, mean: { high: 52, normal: 42, low: 31 } },
    35: { systolic: { high: 73, normal: 57, low: 41 }, diastolic: { high: 44, normal: 36, low: 27 }, mean: { high: 54, normal: 43, low: 32 } },
    36: { systolic: { high: 75, normal: 59, low: 42 }, diastolic: { high: 45, normal: 37, low: 28 }, mean: { high: 55, normal: 44, low: 33 } },
    37: { systolic: { high: 76, normal: 60, low: 44 }, diastolic: { high: 46, normal: 38, low: 29 }, mean: { high: 56, normal: 45, low: 34 } },
    38: { systolic: { high: 77, normal: 61, low: 46 }, diastolic: { high: 47, normal: 39, low: 30 }, mean: { high: 57, normal: 46, low: 35 } },
    39: { systolic: { high: 79, normal: 62, low: 47 }, diastolic: { high: 48, normal: 40, low: 31 }, mean: { high: 58, normal: 47, low: 36 } },
    40: { systolic: { high: 81, normal: 64, low: 48 }, diastolic: { high: 49, normal: 41, low: 32 }, mean: { high: 60, normal: 49, low: 37 } },
    41: { systolic: { high: 82, normal: 65, low: 50 }, diastolic: { high: 50, normal: 42, low: 33 }, mean: { high: 61, normal: 50, low: 39 } },
    42: { systolic: { high: 84, normal: 67, low: 51 }, diastolic: { high: 51, normal: 43, low: 34 }, mean: { high: 62, normal: 51, low: 40 } }
  };

  const postConceptionalData = {
    24: { systolic: { high: 68, normal: 49, low: 33 }, diastolic: { high: 46, normal: 29, low: 14 }, mean: { high: 53, normal: 36, low: 20 } },
    25: { systolic: { high: 69, normal: 51, low: 36 }, diastolic: { high: 47, normal: 30, low: 15 }, mean: { high: 54, normal: 37, low: 22 } },
    26: { systolic: { high: 70, normal: 52, low: 38 }, diastolic: { high: 48, normal: 31, low: 17 }, mean: { high: 55, normal: 38, low: 24 } },
    27: { systolic: { high: 71, normal: 54, low: 40 }, diastolic: { high: 49, normal: 32, low: 18 }, mean: { high: 56, normal: 39, low: 25 } },
    28: { systolic: { high: 72, normal: 55, low: 41 }, diastolic: { high: 50, normal: 33, low: 19 }, mean: { high: 57, normal: 40, low: 26 } },
    29: { systolic: { high: 73, normal: 56, low: 42 }, diastolic: { high: 51, normal: 34, low: 20 }, mean: { high: 58, normal: 41, low: 27 } },
    30: { systolic: { high: 75, normal: 59, low: 43 }, diastolic: { high: 52, normal: 35, low: 21 }, mean: { high: 60, normal: 43, low: 28 } },
    31: { systolic: { high: 78, normal: 61, low: 46 }, diastolic: { high: 53, normal: 36, low: 22 }, mean: { high: 61, normal: 44, low: 30 } },
    32: { systolic: { high: 80, normal: 62, low: 48 }, diastolic: { high: 54, normal: 37, low: 23 }, mean: { high: 63, normal: 45, low: 31 } },
    33: { systolic: { high: 81, normal: 63, low: 50 }, diastolic: { high: 55, normal: 38, low: 24 }, mean: { high: 64, normal: 46, low: 33 } },
    34: { systolic: { high: 83, normal: 66, low: 51 }, diastolic: { high: 56, normal: 39, low: 25 }, mean: { high: 65, normal: 48, low: 34 } },
    35: { systolic: { high: 84, normal: 69, low: 52 }, diastolic: { high: 57, normal: 40, low: 26 }, mean: { high: 66, normal: 50, low: 35 } },
    36: { systolic: { high: 87, normal: 71, low: 55 }, diastolic: { high: 58, normal: 41, low: 27 }, mean: { high: 68, normal: 51, low: 36 } },
    37: { systolic: { high: 89, normal: 72, low: 57 }, diastolic: { high: 59, normal: 42, low: 28 }, mean: { high: 69, normal: 52, low: 38 } },
    38: { systolic: { high: 90, normal: 75, low: 59 }, diastolic: { high: 60, normal: 43, low: 29 }, mean: { high: 70, normal: 54, low: 39 } },
    39: { systolic: { high: 91, normal: 78, low: 60 }, diastolic: { high: 60, normal: 44, low: 30 }, mean: { high: 71, normal: 55, low: 40 } },
    40: { systolic: { high: 92, normal: 80, low: 61 }, diastolic: { high: 61, normal: 44, low: 30 }, mean: { high: 71, normal: 56, low: 40 } },
    41: { systolic: { high: 93, normal: 81, low: 62 }, diastolic: { high: 62, normal: 46, low: 31 }, mean: { high: 72, normal: 58, low: 41 } },
    42: { systolic: { high: 95, normal: 82, low: 63 }, diastolic: { high: 63, normal: 47, low: 32 }, mean: { high: 74, normal: 59, low: 42 } },
    43: { systolic: { high: 97, normal: 83, low: 65 }, diastolic: { high: 64, normal: 48, low: 33 }, mean: { high: 75, normal: 60, low: 44 } },
    44: { systolic: { high: 98, normal: 86, low: 67 }, diastolic: { high: 65, normal: 49, low: 34 }, mean: { high: 76, normal: 61, low: 45 } },
    45: { systolic: { high: 100, normal: 88, low: 69 }, diastolic: { high: 66, normal: 50, low: 35 }, mean: { high: 77, normal: 63, low: 46 } },
    46: { systolic: { high: 102, normal: 89, low: 71 }, diastolic: { high: 66, normal: 51, low: 36 }, mean: { high: 78, normal: 64, low: 48 } }
  };

  const currentData = ageType === "dayOne" ? dayOneData : postConceptionalData;
  const gaOptions = Object.keys(currentData).map(Number).sort((a, b) => a - b);
  const selectedData = gestationalAge ? currentData[parseInt(gestationalAge)] : null;

  return (
    <div className="space-y-4 pt-4">
      <Card className="nightingale-card">
        <CardContent className="pt-4 space-y-3">
          <Label className="text-sm font-medium">Select Age Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setAgeType("dayOne"); setGestationalAge(""); }}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                ageType === "dayOne" 
                  ? "border-[#00d9c5] bg-[#00d9c5]/10" 
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold text-sm">Day One</p>
              <p className="text-xs text-muted-foreground">First day of life</p>
            </button>
            <button
              onClick={() => { setAgeType("postConceptional"); setGestationalAge(""); }}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                ageType === "postConceptional" 
                  ? "border-[#00d9c5] bg-[#00d9c5]/10" 
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold text-sm">Post-Conceptional</p>
              <p className="text-xs text-muted-foreground">Corrected age</p>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="nightingale-card">
        <CardContent className="pt-4 space-y-2">
          <Label className="text-sm font-medium">
            {ageType === "dayOne" ? "Gestational Age" : "Post-Conceptional Age"} (weeks)
          </Label>
          <select
            value={gestationalAge}
            onChange={(e) => setGestationalAge(e.target.value)}
            className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm font-mono"
          >
            <option value="">Select age...</option>
            {gaOptions.map(ga => (
              <option key={ga} value={ga}>{ga} weeks</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selectedData && (
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-center">
              BP Values for {gestationalAge} weeks ({ageType === "dayOne" ? "Day 1" : "Post-Conceptional"})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Lowest (5th %ile)</span>
                <span className="text-xs text-blue-600">Hypotension threshold</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Systolic</p>
                  <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-300">{selectedData.systolic.low}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diastolic</p>
                  <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-300">{selectedData.diastolic.low}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mean</p>
                  <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-300">{selectedData.mean.low}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/50 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-green-700 dark:text-green-300">Normal (50th %ile)</span>
                <span className="text-xs text-green-600">Target range</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Systolic</p>
                  <p className="text-lg font-mono font-bold text-green-700 dark:text-green-300">{selectedData.systolic.normal}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diastolic</p>
                  <p className="text-lg font-mono font-bold text-green-700 dark:text-green-300">{selectedData.diastolic.normal}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mean</p>
                  <p className="text-lg font-mono font-bold text-green-700 dark:text-green-300">{selectedData.mean.normal}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/50 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-red-700 dark:text-red-300">Highest (95th %ile)</span>
                <span className="text-xs text-red-600">Hypertension threshold</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Systolic</p>
                  <p className="text-lg font-mono font-bold text-red-700 dark:text-red-300">{selectedData.systolic.high}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diastolic</p>
                  <p className="text-lg font-mono font-bold text-red-700 dark:text-red-300">{selectedData.diastolic.high}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mean</p>
                  <p className="text-lg font-mono font-bold text-red-700 dark:text-red-300">{selectedData.mean.high}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• Source: Zubrow et al. Philadelphia Neonatal BP Study Group, J Perinatology 1995</p>
          <p>• <span className="font-medium">Day One:</span> BP values on first day of life</p>
          <p>• <span className="font-medium">Post-Conceptional:</span> Corrected gestational age</p>
          <p>• MAP = Diastolic + ⅓(Systolic - Diastolic)</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodPressurePage;
