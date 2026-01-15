/**
 * Acute Weakness Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const WeaknessApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Approach to Acute Weakness</CardTitle>
        <CardDescription className="text-xs">Algorithm for neurological and non-neurological causes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Definition */}
        <Section id="weakness-def" title="Definition & Assessment" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <p className="text-xs text-muted-foreground mb-2">
            Acute weakness refers to sudden onset muscle weakness that may be unilateral or bilateral, and can indicate serious neurological conditions.
          </p>
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
            <p className="font-medium text-blue-700">Muscle Power Scale (MRC):</p>
            <div className="grid grid-cols-2 gap-1 mt-1 text-muted-foreground">
              <span>0 = No movement</span>
              <span>1 = Flicker only</span>
              <span>2 = Movement (gravity eliminated)</span>
              <span>3 = Against gravity only</span>
              <span>4 = Against resistance</span>
              <span>5 = Normal power</span>
            </div>
          </div>
        </Section>

        {/* Algorithm */}
        <Section id="weakness-algorithm" title="Diagnostic Algorithm" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
              <p className="font-semibold text-red-700 text-sm">Unilateral Weakness ± Headache</p>
              <p className="text-xs text-muted-foreground mt-1">→ CT Brain (suspect stroke)</p>
              <p className="text-xs text-muted-foreground">• +ve: Stroke or other brain insult → Neurology</p>
              <p className="text-xs text-muted-foreground">• -ve: Consider other DDx</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <p className="font-semibold text-purple-700 text-sm">Progressive Bilateral LL Weakness + Areflexia</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p><strong>± Sphincter impairment / Back pain:</strong></p>
                <p>→ Emergency MRI Spine</p>
                <p>• +ve: Spinal compression → Neurosurgery</p>
                <p>• -ve: Transverse myelitis → Steroids/IVIG</p>
              </div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <p className="font-semibold text-amber-700 text-sm">Diurnal Variation (Worse evenings)</p>
              <p className="text-xs text-muted-foreground mt-1">→ Suspect Myasthenia Gravis</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="font-semibold text-green-700 text-sm">Bilateral Calf Tenderness</p>
              <p className="text-xs text-muted-foreground mt-1">→ Check CK levels</p>
              <p className="text-xs text-muted-foreground">• High CK: Myositis</p>
            </div>
          </div>
        </Section>

        {/* Neurological DDx */}
        <Section id="weakness-neuro-ddx" title="Neurological Differentials" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
              <p className="font-semibold text-red-700">Ischemic Stroke</p>
              <p className="text-muted-foreground">Sudden onset, unilateral weakness/numbness, speech difficulty</p>
              <p className="text-blue-600 mt-1">Tx: Aspirin 3-5 mg/kg OD</p>
              {w > 0 && <p className="font-mono text-blue-600">{(w * 3).toFixed(0)}-{(w * 5).toFixed(0)} mg daily</p>}
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="font-semibold text-purple-700">Transverse Myelitis</p>
              <p className="text-muted-foreground">Bilateral LL weakness, sensory level, sphincter dysfunction</p>
              <p className="text-blue-600 mt-1">Tx: Methylprednisolone 30 mg/kg IV × 3-5 days</p>
              {w > 0 && <p className="font-mono text-blue-600">{(w * 30).toFixed(0)} mg IV daily</p>}
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">Guillain-Barré Syndrome (GBS)</p>
              <p className="text-muted-foreground">Ascending weakness, areflexia, post-infection (1-4 weeks)</p>
              <p className="text-blue-600 mt-1">Tx: IV Immunoglobulin 2 g/kg total</p>
              {w > 0 && <p className="font-mono text-blue-600">{(w * 2).toFixed(0)} g total (over 2-5 days)</p>}
            </div>
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
              <p className="font-semibold text-teal-700">Myasthenia Gravis</p>
              <p className="text-muted-foreground">Fatiguable weakness, ptosis, diplopia, diurnal variation</p>
              <p className="text-blue-600 mt-1">Tx: Pyridostigmine, IVIG in crisis</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Postictal Todd Paralysis</p>
              <p className="text-muted-foreground">Transient weakness after seizure, resolves in hours</p>
            </div>
          </div>
        </Section>

        {/* Non-neurological DDx */}
        <Section id="weakness-nonneuro-ddx" title="Non-Neurological Differentials" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Viral Myositis</p>
              <p className="text-muted-foreground">Calf tenderness, often post-influenza</p>
              <p className="text-blue-600">High CK</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Spinal Cord Compression</p>
              <p className="text-muted-foreground">Back pain, sensory level</p>
              <p className="text-blue-600">MRI Spine → Neurosurgery</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Arthritis</p>
              <p className="text-muted-foreground">Localized pain, ↓ROM</p>
              <p className="text-blue-600">High ESR/CRP</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Conversion Disorder</p>
              <p className="text-muted-foreground">Stress, normal reflexes</p>
              <p className="text-blue-600">Diagnosis of exclusion</p>
            </div>
          </div>
        </Section>

        {/* When to Escalate */}
        <Section id="weakness-escalate" title="When to Escalate" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-semibold text-red-700">Contact PICU:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Respiratory compromise</li>
                <li>• Bulbar weakness</li>
                <li>• Rapid progression</li>
              </ul>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">Contact Neurology:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Suspected stroke</li>
                <li>• GBS / Transverse Myelitis</li>
                <li>• Myasthenia Gravis</li>
              </ul>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default WeaknessApproach;
