import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CatheterCalculatorPage = () => {
  const [weight, setWeight] = useState("");

  const calculateUAC = () => {
    const w = parseFloat(weight) || 0;
    return ((3.5 * w) + 9).toFixed(1);
  };

  const calculateUVC = () => {
    const w = parseFloat(weight) || 0;
    const uac = (3.5 * w) + 9;
    return ((uac / 2) + 1).toFixed(1);
  };

  return (
    <div className="space-y-4 pt-4">
      <Card className="nightingale-card">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="text"
                  inputMode="text"
              step="0.01"
              placeholder="e.g., 1.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="nightingale-input font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {weight && (
        <div className="grid grid-cols-2 gap-4">
          {/* UAC */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 rounded-2xl">
            <CardContent className="pt-4 text-center">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">UAC Length</p>
              <p className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 my-2">
                {calculateUAC()} cm
              </p>
              <p className="text-xs text-muted-foreground">Formula: (3.5 × WT) + 9</p>
              <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-xs font-medium">X-ray Position</p>
                <p className="text-sm font-bold text-blue-600">T9 - T6</p>
              </div>
            </CardContent>
          </Card>

          {/* UVC */}
          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/30 rounded-2xl">
            <CardContent className="pt-4 text-center">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">UVC Length</p>
              <p className="text-3xl font-mono font-bold text-purple-600 dark:text-purple-400 my-2">
                {calculateUVC()} cm
              </p>
              <p className="text-xs text-muted-foreground">Formula: [(3.5×WT)+9]/2 + 1</p>
              <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-xs font-medium">X-ray Position</p>
                <p className="text-sm font-bold text-purple-600">Below Diaphragm</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• UAC tip should be at T6-T9 (high position) or L3-L4 (low position)</p>
          <p>• UVC tip should be at junction of IVC and right atrium (below diaphragm)</p>
          <p>• Confirm position with X-ray before use</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatheterCalculatorPage;
