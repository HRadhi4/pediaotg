/**
 * Hyperkalemia Approach Component - Flowchart Version
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDown, AlertTriangle, Zap } from "lucide-react";

const FlowNode = ({ children, type = "default", className = "" }) => {
  const styles = {
    start: "bg-blue-500 text-white border-blue-600",
    decision: "bg-amber-100 dark:bg-amber-900/30 border-amber-400 text-amber-800 dark:text-amber-200",
    action: "bg-green-50 dark:bg-green-900/20 border-green-400",
    danger: "bg-red-50 dark:bg-red-900/20 border-red-400",
    info: "bg-gray-50 dark:bg-gray-800 border-gray-300",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-300",
    success: "bg-green-100 dark:bg-green-900/30 border-green-500",
    step: "bg-blue-50 dark:bg-blue-900/20 border-blue-400",
  };
  return (
    <div className={`p-3 rounded-lg border-2 text-xs ${styles[type]} ${className}`}>
      {children}
    </div>
  );
};

const Arrow = ({ label, className = "" }) => (
  <div className={`flex flex-col items-center py-2 ${className}`}>
    <ArrowDown className="h-5 w-5 text-gray-400" />
    {label && <span className="text-[10px] text-muted-foreground mt-1">{label}</span>}
  </div>
);

const StepBadge = ({ number, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
  };
  return (
    <div className={`w-7 h-7 rounded-full ${colors[color]} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
      {number}
    </div>
  );
};

const HyperkalemiaApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hyperkalemia Flowchart</CardTitle>
        <CardDescription className="text-xs">ECG findings, causes, and stepwise management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Clinical Features */}
        <FlowNode type="info">
          <p className="font-semibold mb-2">Clinical Features by K⁺ Level</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
              <p className="font-bold text-yellow-700">K⁺ 5-7 mEq/L</p>
              <p className="text-[10px] text-muted-foreground">Generally asymptomatic</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p className="font-bold text-red-700">K⁺ &gt;7 mEq/L</p>
              <p className="text-[10px] text-muted-foreground">Weakness, paralysis, arrhythmias</p>
              <p className="text-[10px] text-red-600 font-semibold">⚡ Sudden arrest risk!</p>
            </div>
          </div>
        </FlowNode>

        <Arrow />

        {/* Causes */}
        <FlowNode type="warning">
          <p className="font-semibold text-amber-700 mb-2">Common Causes</p>
          <div className="space-y-2">
            <div className="p-2 bg-amber-200/50 dark:bg-amber-800/30 rounded">
              <p className="font-semibold text-amber-800">⚠️ Pseudohyperkalemia (Most Common in Children)</p>
              <p className="text-[10px]">Hemolysis of blood specimen - NOT true hyperkalemia</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-1.5 bg-white/50 dark:bg-black/20 rounded">
                <p className="font-semibold">↑ K⁺ Release from Cells:</p>
                <ul className="text-muted-foreground">
                  <li>• Rhabdomyolysis</li>
                  <li>• Tumor lysis syndrome</li>
                  <li>• Massive transfusion</li>
                  <li>• Metabolic acidosis</li>
                </ul>
              </div>
              <div className="p-1.5 bg-white/50 dark:bg-black/20 rounded">
                <p className="font-semibold">↓ Urinary K⁺ Excretion:</p>
                <ul className="text-muted-foreground">
                  <li>• Severe hypovolemia</li>
                  <li>• Impaired kidney function</li>
                  <li>• Hypoaldosteronism</li>
                  <li>• Adrenal insufficiency</li>
                </ul>
              </div>
            </div>
          </div>
        </FlowNode>

        <Arrow />

        {/* Start */}
        <FlowNode type="start">
          <p className="font-bold text-center">SUSPECTED HYPERKALEMIA</p>
        </FlowNode>

        <Arrow />

        {/* Initial Steps */}
        <FlowNode type="step">
          <p className="font-bold text-blue-700 mb-2">INITIAL MANAGEMENT</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/20 rounded">
              <span className="font-bold text-blue-600">1.</span>
              <div>
                <p className="font-semibold">Confirm True Hyperkalemia</p>
                <p className="text-[10px] text-muted-foreground">Non-hemolyzed venous or arterial sample</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/20 rounded">
              <span className="font-bold text-blue-600">2.</span>
              <div>
                <p className="font-semibold">ECG + Cardiac Monitor</p>
                <p className="text-[10px] text-muted-foreground">Continuous monitoring required</p>
              </div>
            </div>
          </div>
        </FlowNode>

        <Arrow />

        {/* ECG Changes - Visual Progression */}
        <FlowNode type="danger">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-red-600" />
            <p className="font-bold text-red-700">ECG Changes (Progression)</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-[10px]">1</div>
              <div className="flex-1 p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-[10px]">
                <span className="font-semibold">Peaked T waves</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-[10px]">2</div>
              <div className="flex-1 p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded text-[10px]">
                <span className="font-semibold">Prolonged PR & QRS, small P waves</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-[10px]">3</div>
              <div className="flex-1 p-1.5 bg-red-100 dark:bg-red-900/30 rounded text-[10px]">
                <span className="font-semibold">Loss of P wave, sine wave, block</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-[10px]">4</div>
              <div className="flex-1 p-1.5 bg-red-200 dark:bg-red-800/30 rounded text-[10px] border border-red-400">
                <span className="font-semibold text-red-800">V-Fib or Asystole</span>
              </div>
            </div>
          </div>
        </FlowNode>

        <Arrow />

        {/* Decision */}
        <FlowNode type="decision">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <p className="font-bold text-center">K⁺ ≥7 OR ECG CHANGES OR ARRHYTHMIA?</p>
          </div>
        </FlowNode>

        <Arrow />

        {/* STEP 1: Stabilize */}
        <div className="border-2 border-red-400 rounded-lg p-3 bg-red-50/50 dark:bg-red-950/20">
          <div className="flex items-center gap-3 mb-3">
            <StepBadge number="1" color="red" />
            <div>
              <p className="font-bold text-red-700">STABILIZE CARDIAC MEMBRANES</p>
              <p className="text-[10px] text-muted-foreground">Immediate - protects heart from arrhythmias</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <p className="font-bold text-green-700 text-[11px]">Calcium Gluconate 10% (Perfusing Patients)</p>
              <p className="text-[10px]">60 mg/kg (0.6 mL/kg) diluted in equal D5W/NS, IV over 5 min</p>
              {w > 0 && <p className="font-mono text-green-600 text-[10px] mt-1">{Math.min(w * 60, 1000).toFixed(0)} mg ({Math.min(w * 0.6, 10).toFixed(1)} mL) | Max: 1g (10mL)</p>}
              <p className="text-[10px] text-muted-foreground">Onset: Immediate | May repeat in 10 min</p>
            </div>
            
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded">
              <p className="font-bold text-amber-700 text-[11px]">Calcium Chloride 10% (Cardiac Arrest)</p>
              <p className="text-[10px]">20 mg/kg (0.2 mL/kg) via central line or IO push</p>
              {w > 0 && <p className="font-mono text-amber-600 text-[10px] mt-1">{Math.min(w * 20, 1000).toFixed(0)} mg ({Math.min(w * 0.2, 10).toFixed(1)} mL) | Max: 1g (10mL)</p>}
              <p className="text-[10px] text-red-600 font-semibold">⚠️ Do NOT give peripherally!</p>
            </div>
            
            <p className="text-[10px] text-red-600 font-semibold text-center">⚠️ Do NOT mix calcium with sodium bicarbonate (same IV line) - precipitation!</p>
          </div>
        </div>

        <Arrow />

        {/* STEP 2: Shift K+ */}
        <div className="border-2 border-blue-400 rounded-lg p-3 bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center gap-3 mb-3">
            <StepBadge number="2" color="blue" />
            <div>
              <p className="font-bold text-blue-700">SHIFT K⁺ INTO CELLS</p>
              <p className="text-[10px] text-muted-foreground">Temporary measures - K⁺ will return</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <p className="font-bold text-blue-700 text-[11px]">Insulin + Glucose (Onset: 10-20 min)</p>
              <p className="text-[10px]">Regular Insulin: 0.1 units/kg (max 10 units)</p>
              {w > 0 && <p className="font-mono text-blue-600 text-[10px]">{Math.min(w * 0.1, 10).toFixed(1)} units</p>}
              <p className="text-[10px] mt-1">Dextrose: 0.5 g/kg over 30 min</p>
              <p className="text-[10px]">• &lt;5 yrs: D10 at 5 mL/kg | ≥5 yrs: D25 at 2 mL/kg</p>
              {w > 0 && <p className="font-mono text-blue-600 text-[10px]">{(w * 0.5).toFixed(1)} g dextrose</p>}
              <p className="text-[10px] text-amber-600 font-semibold">⚠️ Monitor glucose - hypoglycemia risk!</p>
            </div>
            
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
              <p className="font-bold text-purple-700 text-[11px]">Nebulized Albuterol (Onset: 20-30 min)</p>
              <div className="text-[10px] grid grid-cols-2 gap-1 mt-1">
                <span>• Neonates: 0.4 mg</span>
                <span>• &lt;25 kg: 2.5 mg</span>
                <span>• 25-50 kg: 5 mg</span>
                <span>• &gt;50 kg: 10 mg</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">May repeat after 20 min</p>
            </div>
            
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <p className="font-bold text-[11px]">Sodium Bicarbonate (Onset: 15 min)</p>
              <p className="text-[10px]">1 mEq/kg (max 50 mEq) over 10-15 min</p>
              {w > 0 && <p className="font-mono text-gray-600 text-[10px]">{Math.min(w, 50).toFixed(0)} mEq</p>}
              <p className="text-[10px]">• &gt;6 mo: 1 mL/kg of 8.4% | &lt;6 mo: 2 mL/kg of 4.2%</p>
              <p className="text-[10px] text-amber-600">⚠️ Minimal effect - should NOT be sole therapy</p>
            </div>
          </div>
        </div>

        <Arrow />

        {/* STEP 3: Remove K+ */}
        <div className="border-2 border-green-400 rounded-lg p-3 bg-green-50/50 dark:bg-green-950/20">
          <div className="flex items-center gap-3 mb-3">
            <StepBadge number="3" color="green" />
            <div>
              <p className="font-bold text-green-700">REMOVE K⁺ FROM BODY</p>
              <p className="text-[10px] text-muted-foreground">Definitive treatment</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p className="font-bold text-red-700 text-[11px]">🛑 STOP ALL POTASSIUM INTAKE</p>
            </div>
            
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <p className="font-bold text-[11px]">Loop Diuretic - Furosemide (Onset: 1-2 hr)</p>
              <p className="text-[10px]">1 mg/kg IV (max 40 mg)</p>
              {w > 0 && <p className="font-mono text-gray-600 text-[10px]">{Math.min(w, 40).toFixed(0)} mg IV</p>}
              <p className="text-[10px] text-muted-foreground">May repeat after 6 hr. Replace fluid losses.</p>
            </div>
            
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <p className="font-bold text-[11px]">Sodium Polystyrene Sulfonate (Kayexalate)</p>
              <p className="text-[10px]">1 g/kg (max 30 g) PO, NG, or PR</p>
              {w > 0 && <p className="font-mono text-gray-600 text-[10px]">{Math.min(w, 30).toFixed(0)} g</p>}
              <p className="text-[10px] text-muted-foreground">Onset: 1-2 hr | May repeat after 4-6 hr</p>
              <p className="text-[10px] text-red-600 font-semibold">⚠️ Avoid: preterm, NEC risk, ileus, obstruction</p>
            </div>
            
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <p className="font-bold text-blue-700 text-[11px]">Hemodialysis</p>
              <p className="text-[10px]">For refractory cases or severe renal impairment</p>
              <p className="text-[10px] text-muted-foreground">Fastest & most controlled K⁺ removal method</p>
            </div>
          </div>
        </div>

        <Arrow />

        {/* Labs */}
        <FlowNode type="info">
          <p className="font-semibold mb-2">Laboratory Evaluation</p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">All Patients:</p>
              <ul className="text-muted-foreground">
                <li>• BUN, Creatinine</li>
                <li>• Blood glucose</li>
                <li>• Serum electrolytes</li>
                <li>• Urinalysis</li>
                <li>• Urine electrolytes</li>
              </ul>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-semibold">If Rhabdomyolysis Suspected:</p>
              <ul className="text-muted-foreground">
                <li>• Serum CK, LDH</li>
                <li>• Urine myoglobin</li>
                <li>• Blood gas</li>
              </ul>
            </div>
          </div>
        </FlowNode>

        {/* Quick Reference Summary */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg border">
          <p className="font-bold text-sm mb-2 text-center">⚡ QUICK REFERENCE</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-red-600">STEP 1</p>
              <p>Calcium</p>
              <p className="text-muted-foreground">Immediate</p>
            </div>
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-blue-600">STEP 2</p>
              <p>Insulin/Albuterol</p>
              <p className="text-muted-foreground">10-30 min</p>
            </div>
            <div className="text-center p-2 bg-white/50 dark:bg-black/20 rounded">
              <p className="font-bold text-green-600">STEP 3</p>
              <p>Diuretic/Dialysis</p>
              <p className="text-muted-foreground">1-2 hr+</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HyperkalemiaApproach;
