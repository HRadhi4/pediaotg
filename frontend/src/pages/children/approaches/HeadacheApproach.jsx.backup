/**
 * Pediatric Headache Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const HeadacheApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pediatric Headache</CardTitle>
        <CardDescription className="text-xs">Diagnostic approach based on duration and red flags</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Red Flags */}
        <Section id="headache-redflags" title="Red Flags" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
            <p className="font-semibold text-red-700 text-sm mb-2">Urgent Investigation Required:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Early morning or night headache</strong></li>
              <li>• <strong>Progressive headache</strong> in frequency, duration or severity</li>
              <li>• <strong>Neurologic signs:</strong> altered mental status, gait abnormality, seizures</li>
              <li>• <strong>Papilledema</strong></li>
            </ul>
            <p className="text-red-600 font-medium mt-2 text-xs">→ CT Brain indicated if any red flag present</p>
          </div>
        </Section>

        {/* Algorithm */}
        <Section id="headache-algorithm" title="Diagnostic Algorithm" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="font-semibold text-blue-700 text-center">Acute (≤7 days)</p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <p>• 1st onset: CT Brain</p>
                  <p>• Episodic: Check red flags</p>
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="font-semibold text-purple-700 text-center">Chronic (&gt;7 days)</p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <p>• CT Brain</p>
                  <p>• If normal: Check for papilledema</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
              <p className="font-semibold text-amber-700">CT Normal + Chronic Headache:</p>
              <p className="text-muted-foreground mt-1">→ Ophthalmology consult for papilledema</p>
              <p className="text-muted-foreground">• Papilledema present: Admit for IIH workup</p>
              <p className="text-muted-foreground">• No papilledema: Neurology consult</p>
            </div>
          </div>
        </Section>

        {/* Migraine vs Tension */}
        <Section id="headache-comparison" title="Migraine vs Tension Headache" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[10px] min-w-[350px]">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-2 px-2 font-semibold">Feature</th>
                  <th className="text-left py-2 px-2 font-semibold">Migraine</th>
                  <th className="text-left py-2 px-2 font-semibold">Tension</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-1 px-2 font-medium">Location</td><td className="py-1 px-2">Unilateral/Bilateral</td><td className="py-1 px-2">Frontal</td></tr>
                <tr className="border-b"><td className="py-1 px-2 font-medium">Duration</td><td className="py-1 px-2">2-72 hours</td><td className="py-1 px-2">Hours to days</td></tr>
                <tr className="border-b"><td className="py-1 px-2 font-medium">Character</td><td className="py-1 px-2">Pulsating/throbbing</td><td className="py-1 px-2">Squeezing/pressure</td></tr>
                <tr className="border-b"><td className="py-1 px-2 font-medium">Severity</td><td className="py-1 px-2">Moderate-severe</td><td className="py-1 px-2">Mild-moderate</td></tr>
                <tr className="border-b"><td className="py-1 px-2 font-medium">Associations</td><td className="py-1 px-2">Nausea, vomiting, photo/phonophobia</td><td className="py-1 px-2">None</td></tr>
                <tr className="border-b"><td className="py-1 px-2 font-medium">Trigger</td><td className="py-1 px-2">Activity</td><td className="py-1 px-2">Stress</td></tr>
                <tr><td className="py-1 px-2 font-medium">Family Hx</td><td className="py-1 px-2">Yes</td><td className="py-1 px-2">No</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Acute Migraine Management */}
        <Section id="headache-acute" title="Acute Migraine Management" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-semibold text-green-700">First Line - Analgesics</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="text-muted-foreground">Paracetamol: 10-15 mg/kg/dose</p>
                  {w > 0 && <p className="font-mono text-green-600">{(w * 10).toFixed(0)}-{(w * 15).toFixed(0)} mg</p>}
                </div>
                <div>
                  <p className="text-muted-foreground">Ibuprofen: 5-10 mg/kg/dose</p>
                  {w > 0 && <p className="font-mono text-green-600">{(w * 5).toFixed(0)}-{(w * 10).toFixed(0)} mg</p>}
                </div>
              </div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Naproxen: 5-7 mg/kg/dose</p>
              {w > 0 && <p className="font-mono text-gray-600">{(w * 5).toFixed(0)}-{(w * 7).toFixed(0)} mg</p>}
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">Triptans (Specialist use only)</p>
              <p className="text-muted-foreground">Rarely used in pediatrics - consult Neurology</p>
            </div>
          </div>
        </Section>

        {/* Chronic Migraine Prophylaxis */}
        <Section id="headache-prophylaxis" title="Migraine Prophylaxis (Chronic)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs mb-2">
            <p className="font-medium text-blue-700">Indications:</p>
            <p className="text-muted-foreground">• ≥1 headache/week or &gt;3/month • Prolonged severe attacks • Abortive treatment fails</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Propranolol</p>
              <p className="text-muted-foreground">&lt;35kg: 10-20mg TDS | ≥35kg: 20-40mg TDS</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Cyproheptadine</p>
              <p className="text-muted-foreground">0.25-0.4 mg/kg/day BD-TDS</p>
              {w > 0 && <p className="font-mono text-gray-600">{(w * 0.25).toFixed(1)}-{(w * 0.4).toFixed(1)} mg/day</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Amitriptyline</p>
              <p className="text-muted-foreground">0.1-0.25 mg/kg/dose HS (max 2mg/kg/day)</p>
            </div>
          </div>
        </Section>

        {/* IIH */}
        <Section id="headache-iih" title="Idiopathic Intracranial Hypertension (IIH)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
              <p className="font-semibold text-purple-700">Clinical Features:</p>
              <p className="text-muted-foreground">Daily headache, diplopia, transient visual obscurations</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
              <p className="font-semibold text-red-700">Examination:</p>
              <p className="text-muted-foreground">Papilledema, Abducent nerve palsy (CN VI)</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
              <p className="font-semibold text-blue-700">Diagnosis:</p>
              <p className="text-muted-foreground">LP with opening pressure: ICP &gt;25 cmH₂O (normal CSF)</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
              <p className="font-semibold text-green-700">Treatment - Acetazolamide:</p>
              <p className="text-muted-foreground">Children: 25 mg/kg/day, increase by 25 mg/kg/day (max 100 mg/kg/day)</p>
              {w > 0 && <p className="font-mono text-green-600">Start: {(w * 25).toFixed(0)} mg/day</p>}
              <p className="text-muted-foreground mt-1">+ Weight loss + Stop triggering medications</p>
            </div>
          </div>
        </Section>

        {/* Non-neurological DDx */}
        <Section id="headache-nonneuro" title="Non-Neurological Causes" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">URTI</p>
              <p className="text-muted-foreground">Cough, congestion</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Sinusitis</p>
              <p className="text-muted-foreground">↑ with position, facial tenderness</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Meningitis</p>
              <p className="text-muted-foreground">Fever, photophobia, neck rigidity</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Refractive Errors</p>
              <p className="text-muted-foreground">Reduced visual acuity</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Dental Caries</p>
              <p className="text-muted-foreground">Tooth pain</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Malignant HTN</p>
              <p className="text-muted-foreground">High BP, risk factors</p>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default HeadacheApproach;
