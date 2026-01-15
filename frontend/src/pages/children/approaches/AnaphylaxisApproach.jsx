/**
 * Anaphylaxis vs Allergic Reaction Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const AnaphylaxisApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Anaphylaxis vs Allergic Reaction</CardTitle>
        <CardDescription className="text-xs">Decision flowchart for diagnosis and treatment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Initial Presentation */}
        <Section id="anaph-presentation" title="Initial Presentation" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
            <p className="font-semibold text-orange-700 dark:text-orange-300 text-sm">Urticarial rash involves skin or mucosal tissue:</p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• Generalized hives, pruritus or flushing</li>
              <li>• Swollen lips, tongue or uvula</li>
              <li>• Or both</li>
            </ul>
          </div>
        </Section>

        {/* Decision Point */}
        <Section id="anaph-decision" title="Key Decision Point" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
            <p className="font-semibold text-teal-700 dark:text-teal-300 text-sm mb-2">At least one of the following involved:</p>
            <ul className="text-xs space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500">●</span>
                <span><strong>Airway compromise</strong> (stridor, hoarseness, difficulty breathing)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">●</span>
                <span><strong>Reduced BP</strong> or associated symptoms of end-organ dysfunction (dizziness, syncope)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">●</span>
                <span><strong>GI symptoms</strong> (Abdominal pain, Vomiting)</span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200">
              <p className="font-bold text-red-700 dark:text-red-300 text-center">YES</p>
              <p className="text-center text-sm font-semibold mt-1">Anaphylactic Reaction</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-200">
              <p className="font-bold text-green-700 dark:text-green-300 text-center">NO</p>
              <p className="text-center text-sm font-semibold mt-1">Allergic Reaction</p>
            </div>
          </div>
        </Section>

        {/* Anaphylaxis Treatment */}
        <Section id="anaph-treatment" title="Anaphylaxis Treatment" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            {/* Primary Treatment */}
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
              <p className="font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                Epinephrine (First-line)
              </p>
              <div className="mt-2 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white dark:bg-gray-900 rounded">
                    <p className="text-muted-foreground">Dose</p>
                    <p className="font-mono font-semibold">0.01 mg/kg IM</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-900 rounded">
                    <p className="text-muted-foreground">Concentration</p>
                    <p className="font-mono font-semibold">1:1000 (1mg/ml)</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white dark:bg-gray-900 rounded">
                    <p className="text-muted-foreground">Prepubertal Max</p>
                    <p className="font-mono font-semibold text-blue-600">0.3 mg</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-900 rounded">
                    <p className="text-muted-foreground">Adolescent Max</p>
                    <p className="font-mono font-semibold text-blue-600">0.5 mg</p>
                  </div>
                </div>
                <p className="text-muted-foreground">Repeat Q5-15 min PRN</p>
                {w > 0 && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200">
                    <p className="font-mono text-blue-600 font-semibold">
                      For {w}kg: {Math.min(w * 0.01, 0.5).toFixed(2)} mg IM
                    </p>
                  </div>
                )}
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                  <p className="text-amber-700 dark:text-amber-300 font-medium">Note for CPR:</p>
                  <p className="text-muted-foreground">1:10,000 (0.1mg/ml) used IV in CPR</p>
                </div>
              </div>
            </div>

            {/* Adjunct Treatment */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
              <p className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                Adjunct Treatments
              </p>
              <div className="mt-2 space-y-2 text-xs">
                {/* Hydrocortisone */}
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium">Glucocorticoid (Hydrocortisone)</p>
                  <p className="text-muted-foreground">2-5 mg/kg IV/IM (Max 100 mg)</p>
                  <p className="text-muted-foreground">Then 1-5 mg/kg/dose Q6h or 10-15 mg/m²/day divided</p>
                  {w > 0 && (
                    <p className="font-mono text-blue-600 mt-1">
                      For {w}kg: {Math.min(w * 2, 100).toFixed(0)}-{Math.min(w * 5, 100).toFixed(0)} mg IV/IM
                    </p>
                  )}
                </div>
                {/* Diphenhydramine */}
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium">Diphenhydramine</p>
                  <p className="text-muted-foreground">1-2 mg/kg/dose Q6h (Max 50mg/dose, 300mg/24hr)</p>
                  <p className="text-muted-foreground">Route: IV/IM/PO</p>
                  {w > 0 && (
                    <p className="font-mono text-blue-600 mt-1">
                      For {w}kg: {Math.min(w * 1, 50).toFixed(0)}-{Math.min(w * 2, 50).toFixed(0)} mg Q6h
                    </p>
                  )}
                  <p className="text-red-600 text-[10px] mt-1">CI: MAO inhibitors, BA, GI/Urinary obstruction, Neonate</p>
                </div>
                {/* Ventolin */}
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium">Ventolin (for bronchospasm)</p>
                  <p className="text-muted-foreground">Nebulized salbutamol for wheezing</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Allergic Reaction Treatment */}
        <Section id="anaph-allergic" title="Allergic Reaction Treatment (No systemic signs)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
            <p className="font-semibold text-green-700 dark:text-green-300">Treatment:</p>
            <p className="text-sm mt-1">Antihistamine alone</p>
            <p className="text-xs text-muted-foreground mt-2">
              Examples: Cetirizine, Diphenhydramine, Loratadine
            </p>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default AnaphylaxisApproach;
