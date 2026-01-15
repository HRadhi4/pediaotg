/**
 * Adrenal Crisis Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const AdrenalApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Adrenal Crisis</CardTitle>
        <CardDescription className="text-xs">Recognition and emergency management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Causes */}
        <Section id="adrenal-causes" title="Causes" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Primary</p>
              <p className="text-muted-foreground">Salt wasting (↓Na, ↑K), hyperpigmentation</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Secondary/Tertiary</p>
              <p className="text-muted-foreground">Pituitary/hypothalamic, prolonged steroid use</p>
            </div>
          </div>
        </Section>

        {/* When to Suspect */}
        <Section id="adrenal-suspect" title="When to Suspect" expandedSections={expandedSections} toggleSection={toggleSection}>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Volume depletion, hypotension</li>
            <li>• Hyponatremia, hyperkalemia</li>
            <li>• Hyperpigmentation</li>
            <li>• Abdominal pain, fever</li>
            <li>• Precocious puberty</li>
          </ul>
        </Section>

        {/* Confirmation */}
        <Section id="adrenal-confirm" title="Confirmation (if stable)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs text-muted-foreground">
            <p>1. Check baseline cortisol</p>
            <p>2. Give Cosyntropin (ACTH) 1 mcg IV</p>
            <p>3. Repeat cortisol at 30 min</p>
            <p className="mt-1 font-medium">Adrenal insufficiency: Cortisol &lt;9 mcg/dL</p>
          </div>
        </Section>

        {/* Management */}
        <Section id="adrenal-management" title="Emergency Management" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium">Fluid Resuscitation</p>
              <p className="text-muted-foreground">D5 NS 20 mL/kg bolus, up to 60 mL/kg</p>
              {w > 0 && <p className="font-mono text-blue-600">→ {(w * 20).toFixed(0)} mL bolus</p>}
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-medium">Hydrocortisone</p>
              <p className="text-muted-foreground">50 mg/m² bolus, then 50 mg/m² ÷ q6h for 24h</p>
              <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded">
                <p className="font-medium text-xs">Approximate Doses:</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground mt-1">
                  <span>Infant: 10 mg</span>
                  <span>Toddler: 25 mg</span>
                  <span>Older child: 50 mg</span>
                  <span>Adolescent: 100 mg</span>
                </div>
              </div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Treat Electrolyte Imbalances</p>
              <p className="text-muted-foreground">Hyperkalemia, hyponatremia per protocols</p>
            </div>
          </div>
        </Section>

        {/* Important Notes */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
          <p className="font-semibold text-amber-700 dark:text-amber-300">Important Notes</p>
          <ul className="mt-1 text-muted-foreground space-y-0.5">
            <li>• Never delay treatment waiting for results</li>
            <li>• Consult pediatric endocrinologist</li>
            <li>• If not improving, consider other diagnoses</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdrenalApproach;
