/**
 * Decreased Level of Consciousness (DLOC) Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const DlocApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Decreased Level of Consciousness</CardTitle>
        <CardDescription className="text-xs">Systematic approach using Pediatric GCS</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Definition */}
        <Section id="dloc-def" title="Definition & Grades" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <p className="text-xs text-muted-foreground mb-3">
            Decreased level of consciousness (DLOC) is a state in which a child exhibits a diminished ability to respond to verbal, physical, or painful stimuli.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
              <p className="font-semibold text-green-700">Lethargy</p>
              <p className="text-muted-foreground">Drowsy but arousable with light stimulation</p>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
              <p className="font-semibold text-yellow-700">Obtundation</p>
              <p className="text-muted-foreground">Slowed responses, needs loud voice/shaking</p>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs">
              <p className="font-semibold text-orange-700">Stupor</p>
              <p className="text-muted-foreground">Only responds to painful stimuli</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
              <p className="font-semibold text-red-700">Coma</p>
              <p className="text-muted-foreground">No meaningful response at all</p>
            </div>
          </div>
        </Section>

        {/* Pediatric GCS */}
        <Section id="dloc-gcs" title="Pediatric Glasgow Coma Scale" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[10px] min-w-[400px]">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-2 px-2 font-semibold">Response</th>
                  <th className="text-center py-2 px-2 font-semibold">Score</th>
                  <th className="text-left py-2 px-2 font-semibold">Verbal Child</th>
                  <th className="text-left py-2 px-2 font-semibold">Pre-verbal</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-1 px-2 font-medium" rowSpan={4}>Eye</td><td className="py-1 px-2 text-center">4</td><td className="py-1 px-2">Spontaneous</td><td className="py-1 px-2">Spontaneous</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">3</td><td className="py-1 px-2">To voice</td><td className="py-1 px-2">To voice</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">2</td><td className="py-1 px-2">To pain</td><td className="py-1 px-2">To pain</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">1</td><td className="py-1 px-2">None</td><td className="py-1 px-2">None</td></tr>
                <tr className="border-b"><td className="py-1 px-2 font-medium" rowSpan={5}>Verbal</td><td className="py-1 px-2 text-center">5</td><td className="py-1 px-2">Oriented</td><td className="py-1 px-2">Coos, babbles</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">4</td><td className="py-1 px-2">Confused</td><td className="py-1 px-2">Irritable cry</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">3</td><td className="py-1 px-2">Inappropriate words</td><td className="py-1 px-2">Cries to pain</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">2</td><td className="py-1 px-2">Incomprehensible</td><td className="py-1 px-2">Moans to pain</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">1</td><td className="py-1 px-2">None</td><td className="py-1 px-2">None</td></tr>
                <tr className="border-b"><td className="py-1 px-2 font-medium" rowSpan={6}>Motor</td><td className="py-1 px-2 text-center">6</td><td className="py-1 px-2">Obeys commands</td><td className="py-1 px-2">Normal movements</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">5</td><td className="py-1 px-2">Localizes pain</td><td className="py-1 px-2">Withdraws to touch</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">4</td><td className="py-1 px-2">Withdraws to pain</td><td className="py-1 px-2">Withdraws to pain</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">3</td><td className="py-1 px-2">Flexion to pain</td><td className="py-1 px-2">Abnormal flexion</td></tr>
                <tr className="border-b"><td className="py-1 px-2 text-center">2</td><td className="py-1 px-2">Extension to pain</td><td className="py-1 px-2">Extension</td></tr>
                <tr><td className="py-1 px-2 text-center">1</td><td className="py-1 px-2">None</td><td className="py-1 px-2">None</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
            <p className="font-medium text-blue-700">GCS Monitoring Frequency:</p>
            <p className="text-muted-foreground">• GCS &lt;12 → Assess every 15 minutes</p>
            <p className="text-muted-foreground">• GCS 12-14 → Assess every 1 hour</p>
          </div>
        </Section>

        {/* Initial Stabilization */}
        <Section id="dloc-stabilize" title="Initial Stabilization" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
              <p className="font-semibold text-red-700">Airway</p>
              <p className="text-muted-foreground">Intubate if: Deteriorating GCS, SpO₂ &lt;92% despite oxygen, CO₂ retention</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">Breathing</p>
              <p className="text-muted-foreground">100% oxygen if SpO₂ &lt;94%</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="font-semibold text-purple-700">Circulation</p>
              <p className="text-muted-foreground">Isotonic fluid bolus 20 mL/kg if in shock</p>
              {w > 0 && <p className="font-mono text-purple-600 mt-1">→ {(w * 20).toFixed(0)} mL bolus</p>}
            </div>
          </div>
        </Section>

        {/* Core Investigations */}
        <Section id="dloc-investigations" title="Core Investigations" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1 text-muted-foreground">
              <p>• Capillary blood glucose</p>
              <p>• Blood gas</p>
              <p>• Urea & Electrolytes</p>
              <p>• Serum glucose</p>
              <p>• Liver function tests</p>
            </div>
            <div className="space-y-1 text-muted-foreground">
              <p>• Full blood count</p>
              <p>• Blood culture + CRP</p>
              <p>• Ammonia & Lactate</p>
              <p>• Urine routine + toxicology</p>
            </div>
          </div>
        </Section>

        {/* Algorithm */}
        <Section id="dloc-algorithm" title="Diagnostic Algorithm" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="font-semibold text-amber-700 text-sm mb-2">After History, Examination & Core Investigations:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                  <p className="font-medium text-red-600">Possible Neurological OR Unclear Cause</p>
                  <p className="text-muted-foreground mt-1">→ CT Brain</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                  <p className="font-medium text-green-600">Clear Non-neurological Cause</p>
                  <p className="text-muted-foreground mt-1">→ Treat accordingly</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="font-semibold text-blue-700 text-sm mb-2">CT Brain Results:</p>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-red-600">Abnormal (Hydrocephalus, Edema, Hemorrhage, Mass)</p>
                  <p className="text-muted-foreground">→ Neurosurgery consult</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-gray-600">Normal</p>
                  <p className="text-muted-foreground">→ Consider Lumbar Puncture → Neurology consult</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Neurological Differentials */}
        <Section id="dloc-neuro-ddx" title="Neurological Differentials" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Focal Seizures with Impaired Consciousness</p>
              <p className="text-muted-foreground">Eyes open/staring, abnormal movements, postictal behavior</p>
              <p className="text-blue-600 mt-1">→ Follow seizure guidelines, inform Neurology</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">ADEM (Acute Disseminated Encephalomyelitis)</p>
              <p className="text-muted-foreground">Recent viral illness, rapid decline, multifocal neuro signs</p>
              <p className="text-blue-600 mt-1">→ Methylprednisolone 30 mg/kg/day (max 1g/day)</p>
              {w > 0 && <p className="font-mono text-blue-600">→ {Math.min(w * 30, 1000).toFixed(0)} mg/day</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">PRES Syndrome</p>
              <p className="text-muted-foreground">Chronic illness, HTN, headache, seizures</p>
              <p className="text-blue-600 mt-1">→ BP management, treat underlying cause</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Increased ICP</p>
              <p className="text-muted-foreground">Headache, vomiting, papilledema</p>
              <p className="text-blue-600 mt-1">→ PICU / Neurosurgery</p>
            </div>
          </div>
        </Section>

        {/* Non-neurological Differentials */}
        <Section id="dloc-nonneuro-ddx" title="Non-Neurological Differentials" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Hypoglycemia</p>
              <p className="text-muted-foreground">Check glucose immediately</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">CNS Infection</p>
              <p className="text-muted-foreground">Fever, meningism → LP</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Shock</p>
              <p className="text-muted-foreground">Hypoperfusion signs</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Electrolyte Imbalance</p>
              <p className="text-muted-foreground">Na, K, Ca abnormalities</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Metabolic Illness</p>
              <p className="text-muted-foreground">Known metabolic disease, ↑ammonia</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Medications/Toxins</p>
              <p className="text-muted-foreground">Drug ingestion history</p>
            </div>
          </div>
        </Section>

        {/* Drug Antidotes */}
        <Section id="dloc-antidotes" title="Drug Antidotes" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[10px] min-w-[350px]">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-2 px-2 font-semibold">Drug</th>
                  <th className="text-left py-2 px-2 font-semibold">Signs</th>
                  <th className="text-left py-2 px-2 font-semibold">Antidote</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-1 px-2">Opioid</td><td className="py-1 px-2">Pinpoint pupils, resp. depression</td><td className="py-1 px-2 text-green-600 font-medium">Naloxone</td></tr>
                <tr className="border-b"><td className="py-1 px-2">Benzodiazepines</td><td className="py-1 px-2">Dilated pupils, hypotension</td><td className="py-1 px-2 text-green-600 font-medium">Flumazenil</td></tr>
                <tr className="border-b"><td className="py-1 px-2">Phenobarbitone</td><td className="py-1 px-2">Pinpoint pupils, hypotension</td><td className="py-1 px-2">Supportive care</td></tr>
                <tr><td className="py-1 px-2">Anti-seizure meds</td><td className="py-1 px-2">↓ LOC</td><td className="py-1 px-2">Supportive (monitor levels)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-amber-600 mt-2">Note: Phenytoin & Levetiracetam do NOT reduce consciousness</p>
        </Section>
      </CardContent>
    </Card>
  );
};

export default DlocApproach;
