/**
 * IV Infusions Calculator Page
 * 
 * Calculates weight-based infusion rates for common pediatric drugs:
 * - Dopamine, Dobutamine, Epinephrine, Norepinephrine, Milrinone
 * 
 * Features weight input with calculation display
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, InfusionIcon } from "@/components/HealthIcons";

const InfusionsPage = ({ onBack }) => {
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  const infusionCategories = [
    {
      category: "Neuromuscular Blockade",
      color: "purple",
      drugs: [
        {
          name: "Cisatracurium (Nimbex)",
          stat: { dose: "0.1-0.2 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.2).toFixed(2)} mg` : null },
          infusion: { dose: "1-4 mcg/kg/min", calc: w ? `${(w * 1).toFixed(0)} - ${(w * 4).toFixed(0)} mcg/min` : null }
        }
      ]
    },
    {
      category: "Sedatives",
      color: "blue",
      drugs: [
        {
          name: "Midazolam",
          stat: { dose: "0.1 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} mg` : null },
          infusion: { dose: "0.1-0.5 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.5).toFixed(2)} mg/hr` : null }
        },
        {
          name: "Fentanyl",
          stat: { dose: "1 mcg/kg", calc: w ? `${(w * 1).toFixed(1)} mcg` : null },
          infusion: { dose: "1-5 mcg/kg/hr", calc: w ? `${(w * 1).toFixed(1)} - ${(w * 5).toFixed(1)} mcg/hr` : null }
        }
      ]
    },
    {
      category: "Diuretics",
      color: "teal",
      drugs: [
        {
          name: "Furosemide (Lasix)",
          stat: { dose: "0.5-1 mg/kg (Max 40mg)", calc: w ? `${Math.min(w * 0.5, 40).toFixed(1)} - ${Math.min(w * 1, 40).toFixed(1)} mg` : null },
          infusion: { dose: "0.1-1 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 1).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Bronchodilator",
      color: "amber",
      drugs: [
        {
          name: "Ventolin Infusion",
          stat: null,
          infusion: { dose: "0.3 mg/kg/hr", calc: w ? `${(w * 0.3).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Inotropic Support",
      color: "red",
      isInotrope: true,
      drugs: [
        { name: "Dopamine", unit: "mcg/kg/min", min: 2, max: 20, note: "Low (2-5): renal, Med (5-10): cardiac, High (10-20): vasopressor" },
        { name: "Dobutamine", unit: "mcg/kg/min", min: 2, max: 20, note: "Inotrope, minimal vasopressor effect" },
        { name: "Epinephrine", unit: "mcg/kg/min", min: 0.01, max: 0.5, note: "Low: β-effect, High: α-effect" },
        { name: "Norepinephrine", unit: "mcg/kg/min", min: 0.01, max: 0.5, note: "Potent vasopressor, minimal β-effect" },
      ]
    }
  ];

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Weight Input */}
      <Card className="nightingale-card">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              placeholder="Enter weight for calculations"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Infusion Categories */}
      {infusionCategories.map((cat, idx) => (
        <Card key={idx} className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{cat.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cat.isInotrope ? (
              // Special display for inotropes with mcg/kg/min
              cat.drugs.map((drug, dIdx) => (
                <div key={dIdx} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">{drug.name}</p>
                    <span className="text-xs text-muted-foreground">{drug.min}-{drug.max} {drug.unit}</span>
                  </div>
                  {w > 0 && (
                    <div className="mt-2 p-2 rounded-lg bg-white dark:bg-gray-900">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <p className="text-muted-foreground">Low</p>
                          <p className="font-mono text-red-600">{(drug.min)} {drug.unit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Med</p>
                          <p className="font-mono text-red-600">{((drug.min + drug.max) / 2).toFixed(1)} {drug.unit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">High</p>
                          <p className="font-mono text-red-600">{drug.max} {drug.unit}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center border-t pt-2">
                        For {w}kg: {(drug.min * w * 60 / 1000).toFixed(2)} - {(drug.max * w * 60 / 1000).toFixed(2)} mg/hr
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{drug.note}</p>
                </div>
              ))
            ) : (
              // Standard drug display
              cat.drugs.map((drug, dIdx) => (
                <div key={dIdx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="font-semibold text-sm mb-2">{drug.name}</p>
                  <div className="space-y-1">
                    {drug.stat && (
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                        <span className="text-muted-foreground">Stat: {drug.stat.dose}</span>
                        {drug.stat.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">→ {drug.stat.calc}</span>}
                      </div>
                    )}
                    {drug.infusion && (
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                        <span className="text-muted-foreground">Infusion: {drug.infusion.dose}</span>
                        {drug.infusion.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">→ {drug.infusion.calc}</span>}
                      </div>
                    )}
                    {drug.range && (
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-xs">
                        <span className="text-muted-foreground">Range: {drug.range}</span>
                        {drug.calc && <span className="font-mono text-[#00d9c5] text-right whitespace-nowrap">→ {drug.calc}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Intubation Page

export default InfusionsPage;
