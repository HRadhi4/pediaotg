/**
 * DKA (Diabetic Ketoacidosis) Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const DkaApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Diabetic Ketoacidosis (DKA)</CardTitle>
        <CardDescription className="text-xs">Pediatric DKA Management Protocol</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Recognition */}
        <Section id="dka-recognition" title="Recognition & Diagnosis" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="font-medium mb-1">History</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• Polyuria, polydipsia</li>
                <li>• Weight loss</li>
                <li>• Abdominal pain, vomiting</li>
                <li>• Lethargy</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Clinical Findings</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• Kussmaul breathing</li>
                <li>• Dehydration</li>
                <li>• Fruity breath</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
            <p className="font-medium text-xs">Confirm DKA:</p>
            <p className="text-xs text-muted-foreground">• Ketonuria + Glucose &gt;200 mg/dL + pH &lt;7.30 and/or HCO₃ &lt;15</p>
          </div>
        </Section>

        {/* First Hour */}
        <Section id="dka-first-hour" title="1st Hour Management" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
              <p className="font-medium text-red-700">If in Shock:</p>
              <p className="text-muted-foreground">10 mL/kg 0.9% NS bolus over 5-10 min, repeat PRN</p>
              {w > 0 && <p className="font-mono text-red-600">→ {(w * 10).toFixed(0)} mL bolus</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">If NOT in Shock:</p>
              <p className="text-muted-foreground">&lt;20 kg: 7 mL/kg over 1 hour</p>
              <p className="text-muted-foreground">&gt;20 kg: 5 mL/kg over 1 hour</p>
              {w > 0 && <p className="font-mono text-gray-600">→ {(w < 20 ? w * 7 : w * 5).toFixed(0)} mL over 1 hr</p>}
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p className="font-semibold text-red-700 text-xs">DO NOT:</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• Give insulin bolus</li>
                <li>• Give NaHCO₃ (unless life-threatening)</li>
                <li>• Give unnecessary fluid boluses</li>
                <li>• Use hypotonic fluids</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Post 1st Hour - Fluids */}
        <Section id="dka-fluids" title="Fluid Management (Post 1st Hour)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs">
            <p className="font-medium mb-2">Total Fluid Intake (TFI) by weight:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 pr-4">Weight</th>
                    <th className="text-left py-1">TFI (mL/kg/hr)</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr><td className="py-1 pr-4">≤15 kg</td><td>5</td></tr>
                  <tr><td className="py-1 pr-4">15-35 kg</td><td>4</td></tr>
                  <tr><td className="py-1 pr-4">35-50 kg</td><td>3</td></tr>
                  <tr><td className="py-1 pr-4">&gt;50 kg</td><td>2</td></tr>
                </tbody>
              </table>
            </div>
            {w > 0 && (
              <p className="font-mono text-blue-600 mt-2">
                → {(w * (w <= 15 ? 5 : w <= 35 ? 4 : w <= 50 ? 3 : 2)).toFixed(0)} mL/hr
              </p>
            )}
          </div>
        </Section>

        {/* Insulin */}
        <Section id="dka-insulin" title="Insulin" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <p className="text-muted-foreground">Mix 50 units Regular in 50 mL NS (1 unit/mL)</p>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Standard dose: 0.1 U/kg/hr</p>
              {w > 0 && <p className="font-mono text-gray-600">→ {(w * 0.1).toFixed(1)} units/hr ({(w * 0.1).toFixed(1)} mL/hr)</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Low dose: 0.05 U/kg/hr</p>
              <p className="text-muted-foreground">For: newly diagnosed, ≤5 years, or recently received insulin</p>
              {w > 0 && <p className="font-mono text-gray-600">→ {(w * 0.05).toFixed(2)} units/hr</p>}
            </div>
          </div>
        </Section>

        {/* Potassium */}
        <Section id="dka-potassium" title="Potassium" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs text-muted-foreground">
            <p>• Add KCl 40 mEq/L once voiding (unless K &gt;5.5)</p>
            <p>• If K &lt;3.5: increase to 60 mEq/L</p>
          </div>
        </Section>

        {/* Dextrose */}
        <Section id="dka-dextrose" title="Dextrose" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs text-muted-foreground">
            <p>• Add D5 if glucose &lt;250 mg/dL or rapid drop &gt;100 mg/dL/hr</p>
            <p>• Add D10 if glucose &lt;180 mg/dL</p>
          </div>
        </Section>

        {/* Cerebral Edema */}
        <Section id="dka-cerebral" title="Cerebral Edema" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
            <p className="font-semibold text-red-700 mb-1">Warning Signs:</p>
            <p className="text-muted-foreground">Headache, irritability, ↓LOC, vomiting, bradycardia, HTN</p>
            <div className="mt-2 border-t border-red-200 pt-2">
              <p className="font-medium">Treatment:</p>
              <p className="text-muted-foreground">• Elevate HOB, secure airway</p>
              <p className="text-muted-foreground">• Mannitol 0.5-1 g/kg OR 3% NaCl 5-10 mL/kg</p>
              {w > 0 && <p className="font-mono text-red-600">→ Mannitol: {(w * 0.5).toFixed(1)}-{w.toFixed(0)} g</p>}
              <p className="text-muted-foreground">• Neurosurgery consult, Head CT</p>
            </div>
          </div>
        </Section>

        {/* Resolution */}
        <Section id="dka-resolution" title="DKA Resolution" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">DKA resolves when:</p>
            <p>pH &gt;7.30, HCO₃ &gt;15, normal anion gap</p>
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">After resolution:</p>
              <p>• Start oral fluids (controlled)</p>
              <p>• Give SC insulin, stop IV 30 min after</p>
              <p>• Start diabetic diet</p>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default DkaApproach;
