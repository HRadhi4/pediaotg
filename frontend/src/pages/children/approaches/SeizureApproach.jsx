/**
 * Status Epilepticus Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const SeizureApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Status Epilepticus</CardTitle>
        <CardDescription className="text-xs">Start treatment after 5 minutes of seizure activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Initial Stabilization */}
        <Section id="se-initial" title="Initial Stabilization (0-5 min)" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <p className="text-muted-foreground">• Maintain A, B, C + Neurologic exam</p>
            <p className="text-muted-foreground">• Give oxygen, connect monitors</p>
            <p className="text-muted-foreground">• Establish IV access</p>
            <p className="text-muted-foreground">• Check bedside glucose</p>
            <p className="text-muted-foreground">• Correct hypoglycemia, hyponatremia, hypocalcemia</p>
          </div>
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="font-medium text-xs">Labs: Glucose, Na, iCa, Mg, CBC, LFTs</p>
          </div>
        </Section>

        {/* Phase 1: Benzodiazepines */}
        <Section id="se-phase1" title="Phase 1: Benzodiazepines (5-20 min)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold">If IV/IO available:</p>
              <div className="mt-1 space-y-1 text-muted-foreground">
                <p>• <span className="font-medium">Lorazepam:</span> 0.1 mg/kg (max 4 mg)</p>
                {w > 0 && <p className="font-mono text-blue-600 pl-2">→ {Math.min(w * 0.1, 4).toFixed(1)} mg</p>}
                <p>• OR <span className="font-medium">Midazolam IV:</span> 0.1-0.2 mg/kg (max 10 mg)</p>
                {w > 0 && <p className="font-mono text-blue-600 pl-2">→ {(w * 0.15).toFixed(1)} mg</p>}
                <p className="text-xs italic mt-1">Can repeat once</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">If NO IV/IO:</p>
              <div className="mt-1 space-y-1 text-muted-foreground">
                <p>• <span className="font-medium">Midazolam IM:</span> 0.2 mg/kg (one dose)</p>
                {w > 0 && <p className="font-mono text-gray-600 pl-2">→ {(w * 0.2).toFixed(1)} mg IM</p>}
                <p>• OR <span className="font-medium">Diazepam PR:</span> 0.2-0.5 mg/kg (max 20 mg)</p>
                {w > 0 && <p className="font-mono text-gray-600 pl-2">→ {(w * 0.3).toFixed(1)} mg PR</p>}
              </div>
            </div>
          </div>
        </Section>

        {/* Phase 2: Antiepileptics */}
        <Section id="se-phase2" title="Phase 2: Antiepileptics (20-40 min)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <p className="text-xs text-muted-foreground mb-2">Choose ONE of the following:</p>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Fosphenytoin/Phenytoin</p>
              <p className="text-muted-foreground">20 mg PE/kg over 5-10 min (fosphenytoin) or 30 min (phenytoin)</p>
              {w > 0 && <p className="font-mono text-gray-600">→ {(w * 20).toFixed(0)} mg</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Levetiracetam (Keppra)</p>
              <p className="text-muted-foreground">20-60 mg/kg (max 2500 mg)</p>
              {w > 0 && <p className="font-mono text-gray-600">→ {Math.min(w * 40, 2500).toFixed(0)} mg</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Valproic Acid</p>
              <p className="text-muted-foreground">40 mg/kg (max 3000 mg)</p>
              {w > 0 && <p className="font-mono text-gray-600">→ {Math.min(w * 40, 3000).toFixed(0)} mg</p>}
            </div>
          </div>
        </Section>

        {/* Phase 3 */}
        <Section id="se-phase3" title="Phase 3 (40-60 min)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <p className="text-muted-foreground">Call PICU and Neurology</p>
            <p className="text-muted-foreground">Use alternative from Phase 2, or:</p>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="font-medium">Phenobarbital</p>
              <p className="text-muted-foreground">20 mg/kg single dose</p>
              {w > 0 && <p className="font-mono text-purple-600">→ {(w * 20).toFixed(0)} mg</p>}
            </div>
          </div>
        </Section>

        {/* Refractory */}
        <Section id="se-refractory" title="Refractory Status Epilepticus (>60 min)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
            <p className="font-semibold text-red-700">Request continuous EEG monitoring</p>
            <p className="font-semibold text-red-700 mt-1">Be ready for intubation</p>
            <div className="mt-2 space-y-1 text-muted-foreground">
              <p className="font-medium">Midazolam Infusion:</p>
              <p>• Bolus 0.2 mg/kg, then infusion 1 mcg/kg/min</p>
              <p>• Increase by 2 mcg/kg/min q10-15 min PRN (max 24 mcg/kg/min)</p>
              <p className="mt-2 font-medium">If seizure persists: Barbiturate coma</p>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default SeizureApproach;
