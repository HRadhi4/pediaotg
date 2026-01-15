/**
 * Severe TBI Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const TbiApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Severe Traumatic Brain Injury</CardTitle>
        <CardDescription className="text-xs">GCS ≤8 Management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Initial Stabilization */}
        <Section id="tbi-initial" title="Initial Stabilization" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <p className="text-muted-foreground">• Maintain ABC + C-spine precautions</p>
            <p className="text-muted-foreground">• Continuous cardiopulmonary monitoring</p>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-2">
              <p className="font-medium">Airway (Jaw thrust, no head tilt)</p>
              <p className="text-muted-foreground">RSI: Fentanyl + Rocuronium OR Etomidate + Rocuronium</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Oxygenation Targets</p>
              <p className="text-muted-foreground">SpO₂ 92-98%, PaCO₂ 35-40 mmHg</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Circulation</p>
              <p className="text-muted-foreground">20 mL/kg NS bolus if hypotensive, repeat ×3</p>
              {w > 0 && <p className="font-mono text-gray-600">→ {(w * 20).toFixed(0)} mL bolus</p>}
            </div>
            <p className="text-muted-foreground mt-2">• Elevate HOB 30°, midline neutral position</p>
          </div>
        </Section>

        {/* Brain Protective Therapies */}
        <Section id="tbi-protective" title="Standard Brain Protective Therapies" expandedSections={expandedSections} toggleSection={toggleSection}>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>□ Control ventilation (PaCO₂ 35-40)</li>
            <li>□ Avoid hypotension</li>
            <li>□ IVF: 0.9% NS at maintenance</li>
            <li>□ Maintain Na &gt;140</li>
            <li>□ Sedation: Fentanyl + Midazolam infusion</li>
            <li>□ Maintain normothermia (&lt;37.5°C)</li>
            <li>□ Seizure prophylaxis (Phenytoin)</li>
            <li>□ Stress ulcer prophylaxis</li>
            <li>□ Glucose 80-180 mg/dL</li>
          </ul>
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
            <p className="font-semibold text-red-700">DO NOT ALLOW:</p>
            <p className="text-muted-foreground">Hypoxemia • Hypotension • Hyperthermia • Hyponatremia</p>
          </div>
        </Section>

        {/* ICP Management */}
        <Section id="tbi-icp" title="Raised ICP Management (Tier 1)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <p className="text-muted-foreground font-medium">Signs: Cushing's triad, bradycardia, hypertension, irregular breathing, pupil changes</p>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium">Hypertonic Saline (3%)</p>
              <p className="text-muted-foreground">5-10 mL/kg IV over 20 min</p>
              {w > 0 && <p className="font-mono text-blue-600">→ {(w * 5).toFixed(0)}-{(w * 10).toFixed(0)} mL</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Mannitol 20%</p>
              <p className="text-muted-foreground">0.5-1 g/kg IV bolus (2.5-5 mL/kg) over 15 min</p>
              {w > 0 && <p className="font-mono text-gray-600">→ {(w * 0.5).toFixed(1)}-{w.toFixed(1)} g ({(w * 2.5).toFixed(0)}-{(w * 5).toFixed(0)} mL)</p>}
              <p className="text-xs text-muted-foreground mt-1">Requires Foley catheter</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Deepen Sedation</p>
              <p className="text-muted-foreground">Add Pentobarbital or increase Fentanyl/Midazolam</p>
            </div>
          </div>
        </Section>

        {/* Herniation */}
        <Section id="tbi-herniation" title="Emergency Herniation Treatment" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
            <p className="font-semibold text-red-700 mb-2">Immediate Actions:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Hyperventilate briefly (PaCO₂ 30-35)</li>
              <li>• Hypertonic saline 3%: 5 mL/kg {w > 0 && <span className="font-mono">({(w * 5).toFixed(0)} mL)</span>}</li>
              <li>• Mannitol 1 g/kg {w > 0 && <span className="font-mono">({w.toFixed(1)} g)</span>}</li>
              <li>• Neurosurgery consult STAT</li>
            </ul>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default TbiApproach;
