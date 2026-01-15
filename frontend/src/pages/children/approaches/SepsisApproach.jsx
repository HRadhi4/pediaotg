/**
 * Septic Shock Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const SepsisApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Septic Shock in Children</CardTitle>
        <CardDescription className="text-xs">Time-based resuscitation protocol</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Recognition */}
        <Section id="sepsis-recognition" title="Recognition (0-5 min)" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="font-semibold text-blue-700 dark:text-blue-300 text-xs mb-1">Cold Shock</p>
              <p className="text-xs text-muted-foreground">Cold extremities, prolonged cap refill</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <p className="font-semibold text-red-700 dark:text-red-300 text-xs mb-1">Warm Shock</p>
              <p className="text-xs text-muted-foreground">Warm extremities, brisk cap refill</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>• Decreased LOC • Persistent tachycardia • Decreased urine output</p>
            <p>• Hypotension (late sign)</p>
          </div>
        </Section>

        {/* Initial Steps */}
        <Section id="sepsis-initial" title="Initial Management (5-15 min)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">1. Airway & Breathing</p>
              <p className="text-muted-foreground">100% O₂ via non-rebreather mask</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">2. IV Access</p>
              <p className="text-muted-foreground">2 peripheral IVs. IO if IV not achieved in 5 min</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">3. Fluid Bolus</p>
              <p className="text-muted-foreground">20 mL/kg 0.9% NS. Push, up to 60 mL/kg</p>
              {w > 0 && <p className="font-mono text-blue-600 mt-1">→ {(w * 20).toFixed(0)} mL bolus</p>}
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
              <p className="font-medium text-red-700">4. Antibiotics</p>
              <p className="text-muted-foreground">Give 1st dose within 1 hour. DO NOT delay for cultures</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">5. Correct</p>
              <p className="text-muted-foreground">Hypoglycemia & Hypocalcemia</p>
            </div>
          </div>
        </Section>

        {/* Vasopressors */}
        <Section id="sepsis-vasopressors" title="Vasopressors (15-60 min)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <p className="text-muted-foreground">If shock not reversed after fluid resuscitation:</p>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium">Cold Shock → Epinephrine</p>
              <p className="text-muted-foreground">0.05-0.3 mcg/kg/min</p>
              {w > 0 && <p className="font-mono text-blue-600">→ {(w * 0.1).toFixed(2)} mcg/min (starting)</p>}
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-medium">Warm Shock → Norepinephrine</p>
              <p className="text-muted-foreground">0.05-0.3 mcg/kg/min (via central line)</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Alternative: Dopamine</p>
              <p className="text-muted-foreground">Up to 10 mcg/kg/min (peripheral IV/IO acceptable)</p>
              {w > 0 && <p className="font-mono text-gray-600">→ {(w * 10).toFixed(0)} mcg/min (max)</p>}
            </div>
          </div>
        </Section>

        {/* Goals */}
        <Section id="sepsis-goals" title="Therapeutic Endpoints" expandedSections={expandedSections} toggleSection={toggleSection}>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Cap refill ≤2 seconds, warm extremities</li>
            <li>• Normal BP for age</li>
            <li>• Normal pulses (no central-peripheral difference)</li>
            <li>• Urine output ≥1 mL/kg/hr</li>
            <li>• Normal mental status</li>
            <li>• ScvO₂ ≥70%</li>
          </ul>
        </Section>

        {/* Additional Considerations */}
        <Section id="sepsis-additional" title="Additional Considerations" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-medium">Hydrocortisone (if adrenal insufficiency risk)</p>
              <p className="text-muted-foreground">2 mg/kg load, then 1 mg/kg q6h</p>
              {w > 0 && <p className="font-mono text-amber-600">→ Load: {(w * 2).toFixed(0)} mg, then {w.toFixed(0)} mg q6h</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Intubation (if needed)</p>
              <p className="text-muted-foreground">Ketamine 1-2 mg/kg ± Atropine 0.02 mg/kg</p>
            </div>
            <p className="text-muted-foreground">• Keep Hgb &gt;10 g/dL • Monitor lactate • Early source control</p>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default SepsisApproach;
