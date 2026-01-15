/**
 * Pediatric Abnormal Gait Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const GaitApproach = ({ expandedSections, toggleSection }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pediatric Abnormal Gait</CardTitle>
        <CardDescription className="text-xs">Identification and evaluation of gait disorders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Important Note */}
        <Section id="gait-note" title="Important Notes" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
            <p className="font-semibold text-amber-700 mb-2">Key Points:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Hemiplegic, Waddling, and Neuropathic gaits are NOT acute</strong></li>
              <li>• <strong>Do not</strong> label anyone with ataxia unless <strong>afebrile</strong> and <strong>fully conscious</strong></li>
              <li>• Ataxia in febrile/drowsy child = <strong>Pseudo-ataxia</strong> (treat underlying cause)</li>
            </ul>
          </div>
        </Section>

        {/* Gait Types */}
        <Section id="gait-types" title="Gait Types Recognition" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">Limping Gait</p>
              <p className="text-muted-foreground">Avoids bearing weight, musculoskeletal pain, trauma</p>
              <p className="text-blue-600 mt-1">Ix: CRP, ESR, X-ray, US joint → Orthopedics/Rheumatology</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="font-semibold text-purple-700">Ataxic Gait</p>
              <p className="text-muted-foreground">Wide-based, cannot walk heel-to-toe, unsteady, tremors</p>
              <p className="text-blue-600 mt-1">Ix: CT Brain → Normal: Neurology | Abnormal: Neurosurgery</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">Waddling Gait (Not Acute)</p>
              <p className="text-muted-foreground">Trunk weakness, delayed milestones, Gower sign +ve</p>
              <p className="text-blue-600 mt-1">Ix: High CK → Neurology</p>
            </div>
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
              <p className="font-semibold text-teal-700">Neuropathic Gait (Not Acute)</p>
              <p className="text-muted-foreground">High steppage (toes touch first), sensory loss hands/feet</p>
              <p className="text-blue-600 mt-1">Ix: CT (hemispheric asymmetry) → Neurology</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-semibold text-red-700">Hemiplegic Gait (Not Acute)</p>
              <p className="text-muted-foreground">Weakness/stiffness one side, birth asphyxia, prematurity</p>
              <p className="text-blue-600 mt-1">→ Neurology</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Malingering/Psychogenic</p>
              <p className="text-muted-foreground">Stressful event, inconsistent findings, all tests normal</p>
              <p className="text-blue-600 mt-1">→ Psychology (diagnosis of exclusion)</p>
            </div>
          </div>
        </Section>

        {/* Red Flags */}
        <Section id="gait-redflags" title="Red Flag Features" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 text-xs">
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Signs of raised ICP</strong> → CT Brain</li>
              <li>• <strong>Focal neurology</strong> → CT Brain</li>
              <li>• <strong>Altered conscious state</strong> → CT Brain ± LP</li>
              <li>• <strong>Meningism</strong> → LP (after ruling out ↑ICP)</li>
              <li>• <strong>Bilateral LL weakness</strong> → Think GBS, inform Neurology</li>
              <li>• <strong>Abnormal deep tendon reflexes</strong> → Think GBS</li>
              <li>• <strong>Loss of proprioception/vibration</strong> → Think GBS</li>
            </ul>
          </div>
        </Section>

        {/* Non-neurological Ataxia */}
        <Section id="gait-ataxia-causes" title="Non-Neurological Causes of Ataxia" expandedSections={expandedSections} toggleSection={toggleSection}>
          <p className="text-xs text-muted-foreground mb-2">
            Think non-neurological if: fever, ↓consciousness, trauma, headaches, medications, ear pain
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-semibold text-red-700">Cerebellar Tumor</p>
              <p className="text-muted-foreground">Headaches, vomiting, papilledema, focal deficits</p>
              <p className="text-blue-600">CT: Posterior fossa mass → Oncology/Neurosurgery</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="font-semibold text-purple-700">Neuroblastoma (with OMAS)</p>
              <p className="text-muted-foreground">Bone pain, abdominal mass crossing midline</p>
              <p className="text-blue-600">Ix: Urine VMA/HVA, MIBG scan → Oncology</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">Traumatic</p>
              <p className="text-muted-foreground">History of trauma, skull tenderness</p>
              <p className="text-blue-600">CT: Fracture/hemorrhage → Neurosurgery</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Intoxication</p>
              <p className="text-muted-foreground">Access to medications, altered GCS</p>
              <p className="text-blue-600">Toxicology screen → Pediatrics</p>
            </div>
          </div>
        </Section>

        {/* OMAS */}
        <Section id="gait-omas" title="Opsoclonus-Myoclonus-Ataxia Syndrome (OMAS)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs">
            <p className="font-semibold text-purple-700 mb-2">Autoimmune disorder - Think Neuroblastoma!</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium">Symptoms:</p>
                <ul className="text-muted-foreground space-y-0.5">
                  <li>• Opsoclonus (rapid involuntary eye movements)</li>
                  <li>• Myoclonus (muscle twitching)</li>
                  <li>• Ataxia</li>
                  <li>• Behavioral changes</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Investigations:</p>
                <ul className="text-muted-foreground space-y-0.5">
                  <li>• Urine VMA/HVA</li>
                  <li>• CT/MRI chest, abdomen, pelvis</li>
                  <li>• MIBG nuclear scan</li>
                </ul>
              </div>
            </div>
            <p className="text-blue-600 mt-2">Tx: Immunomodulators, surgical removal if neuroblastoma found</p>
          </div>
        </Section>

        {/* Ataxia vs Pseudo-ataxia */}
        <Section id="gait-pseudo" title="Ataxia vs Pseudo-Ataxia" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">True Ataxia</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Fully alert child</li>
                <li>• Afebrile</li>
                <li>• Imbalance, incoordination</li>
                <li>• Slurred speech</li>
                <li>• Wide-based gait</li>
              </ul>
              <p className="text-blue-600 mt-1">→ Follow ataxia guidelines</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">Pseudo-Ataxia</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Drowsy/inactive child</li>
                <li>• Often febrile</li>
                <li>• Tiredness, fatigability</li>
                <li>• Mild degree of ataxia</li>
                <li>• Part of systemic illness</li>
              </ul>
              <p className="text-amber-600 mt-1">→ Treat underlying cause (URTI, sepsis)</p>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default GaitApproach;
