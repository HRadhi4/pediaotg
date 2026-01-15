/**
 * Hyperkalemia Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const HyperkalemiaApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Approach to Hyperkalemia</CardTitle>
        <CardDescription className="text-xs">ECG findings, causes, and management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Clinical Features */}
        <Section id="hyperk-clinical" title="Clinical Features" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
              <p className="font-semibold text-yellow-700">K⁺ 5-7 mEq/L</p>
              <p className="text-muted-foreground">Generally asymptomatic</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
              <p className="font-semibold text-red-700">K⁺ &gt;7 mEq/L</p>
              <p className="text-muted-foreground">Muscle weakness, paralysis, cardiac changes, arrhythmias. <strong>Sudden arrest may occur.</strong></p>
            </div>
          </div>
        </Section>

        {/* Causes */}
        <Section id="hyperk-causes" title="Causes" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">Pseudohyperkalemia</p>
              <p className="text-muted-foreground">Most common cause in children - due to hemolysis of blood specimen. Not true hyperkalemia.</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Increased K⁺ Release from Cells:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Rhabdomyolysis (crush injury, prolonged seizure, hyperthermia)</li>
                <li>• Tumor lysis syndrome</li>
                <li>• Massive transfusion</li>
                <li>• Metabolic acidosis</li>
              </ul>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Reduced Urinary K⁺ Excretion:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Severe hypovolemia</li>
                <li>• Impaired kidney function</li>
                <li>• Hypoaldosteronism (eg, adrenal insufficiency)</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* ECG Changes */}
        <Section id="hyperk-ecg" title="ECG Changes (Progression)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-700 font-bold text-sm">1</div>
              <div className="flex-1 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                <p className="font-medium text-yellow-700">Peaked T waves</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-700 font-bold text-sm">2</div>
              <div className="flex-1 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs">
                <p className="font-medium text-orange-700">Prolonged PR & QRS intervals, small P waves</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-700 font-bold text-sm">3</div>
              <div className="flex-1 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                <p className="font-medium text-red-700">Loss of P wave, sine wave pattern, conduction block</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center text-red-800 font-bold text-sm">4</div>
              <div className="flex-1 p-2 bg-red-100 dark:bg-red-950/30 rounded text-xs border border-red-300">
                <p className="font-medium text-red-800">Ventricular fibrillation or asystole</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Initial Management */}
        <Section id="hyperk-initial" title="Initial Management" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">1. Confirm True Hyperkalemia</p>
              <p className="text-muted-foreground">Obtain non-hemolyzed venous or arterial blood sample</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">2. ECG + Cardiac Monitor</p>
              <p className="text-muted-foreground">Place patient on continuous cardiac monitoring</p>
            </div>
          </div>
        </Section>

        {/* Stabilize Cardiac Membranes */}
        <Section id="hyperk-calcium" title="Step 1: Stabilize Cardiac Membranes" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 mb-2">
            <p className="font-semibold text-red-700 text-xs">Indication:</p>
            <p className="text-xs text-muted-foreground">K⁺ ≥7 mEq/L OR significant ECG changes (QRS widening, loss of P waves) OR severe arrhythmias</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-semibold text-green-700">Calcium Gluconate 10% (Perfusing Patients)</p>
              <p className="text-muted-foreground">60 mg/kg (0.6 mL/kg) diluted in equal volume D5W/NS, IV over 5 min</p>
              {w > 0 && <p className="font-mono text-green-600 mt-1">{Math.min(w * 60, 1000).toFixed(0)} mg ({Math.min(w * 0.6, 10).toFixed(1)} mL) | Max: 1g (10mL)</p>}
              <p className="text-muted-foreground mt-1">Onset: Immediate | May repeat in 10 min if needed</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">Calcium Chloride 10% (Cardiac Arrest)</p>
              <p className="text-muted-foreground">20 mg/kg (0.2 mL/kg) via central line or IO push</p>
              {w > 0 && <p className="font-mono text-amber-600 mt-1">{Math.min(w * 20, 1000).toFixed(0)} mg ({Math.min(w * 0.2, 10).toFixed(1)} mL) | Max: 1g (10mL)</p>}
              <p className="text-red-600 mt-1">⚠️ Do NOT give peripherally</p>
            </div>
          </div>
          <p className="text-[10px] text-red-600 mt-2">⚠️ Do NOT give calcium in same IV line as sodium bicarbonate (precipitation)</p>
        </Section>

        {/* Shift K into Cells */}
        <Section id="hyperk-shift" title="Step 2: Shift K⁺ into Cells" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">Insulin + Glucose (Onset: 10-20 min)</p>
              <p className="text-muted-foreground">Regular Insulin: 0.1 units/kg (max 10 units)</p>
              {w > 0 && <p className="font-mono text-blue-600">{Math.min(w * 0.1, 10).toFixed(1)} units</p>}
              <p className="text-muted-foreground mt-1">Dextrose: 0.5 g/kg over 30 min</p>
              <p className="text-muted-foreground">• &lt;5 yrs: D10 at 5 mL/kg | ≥5 yrs: D25 at 2 mL/kg</p>
              {w > 0 && <p className="font-mono text-blue-600">{(w * 0.5).toFixed(1)} g dextrose</p>}
              <p className="text-amber-600 mt-1">Monitor glucose closely - hypoglycemia risk!</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="font-semibold text-purple-700">Nebulized Albuterol (Onset: 20-30 min)</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Neonates: 0.4 mg in 2 mL NS</li>
                <li>• &lt;25 kg: 2.5 mg in 2 mL NS</li>
                <li>• 25-50 kg: 5 mg in 2 mL NS</li>
                <li>• &gt;50 kg: 10 mg in 2-4 mL NS</li>
              </ul>
              <p className="text-muted-foreground mt-1">May repeat after 20 minutes</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Sodium Bicarbonate (Onset: 15 min)</p>
              <p className="text-muted-foreground">1 mEq/kg (max 50 mEq) over 10-15 min</p>
              {w > 0 && <p className="font-mono text-gray-600">{Math.min(w, 50).toFixed(0)} mEq</p>}
              <p className="text-muted-foreground">• &gt;6 mo: 1 mL/kg of 8.4% | &lt;6 mo: 2 mL/kg of 4.2%</p>
              <p className="text-amber-600 mt-1">Minimal effect - should NOT be sole therapy</p>
            </div>
          </div>
        </Section>

        {/* Remove K */}
        <Section id="hyperk-remove" title="Step 3: Remove K⁺ from Body" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-semibold text-red-700">Stop All Potassium Intake</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Loop Diuretic - Furosemide (Onset: 1-2 hr)</p>
              <p className="text-muted-foreground">1 mg/kg IV (max 40 mg)</p>
              {w > 0 && <p className="font-mono text-gray-600">{Math.min(w, 40).toFixed(0)} mg IV</p>}
              <p className="text-muted-foreground">May repeat after 6 hours. Replace fluid losses.</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Sodium Polystyrene Sulfonate (Kayexalate)</p>
              <p className="text-muted-foreground">1 g/kg (max 30 g) PO, NG, or PR</p>
              {w > 0 && <p className="font-mono text-gray-600">{Math.min(w, 30).toFixed(0)} g</p>}
              <p className="text-muted-foreground">Onset: 1-2 hr | May repeat after 4-6 hr</p>
              <p className="text-red-600 mt-1">⚠️ Avoid in: preterm neonates, NEC risk, ileus, bowel obstruction</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">Hemodialysis</p>
              <p className="text-muted-foreground">For refractory cases or severe renal impairment</p>
              <p className="text-muted-foreground">Fastest and most controlled method for K⁺ removal</p>
            </div>
          </div>
        </Section>

        {/* Lab Testing */}
        <Section id="hyperk-labs" title="Laboratory Evaluation" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">All Patients:</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• BUN, Creatinine</li>
                <li>• Blood glucose</li>
                <li>• Serum electrolytes</li>
                <li>• Urinalysis, Urine electrolytes</li>
              </ul>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">If Rhabdomyolysis Suspected:</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• Serum CK, LDH</li>
                <li>• Urine myoglobin</li>
                <li>• Blood gas</li>
              </ul>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default HyperkalemiaApproach;
