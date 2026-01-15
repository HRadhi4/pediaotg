/**
 * Upper GI Bleeding (UGIB) Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const UgibApproach = ({ expandedSections, toggleSection }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Upper GI Bleeding (UGIB)</CardTitle>
        <CardDescription className="text-xs">Assessment, stabilization, and management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Definition */}
        <Section id="ugib-def" title="Definition & Presentation" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <p className="text-xs text-muted-foreground mb-2">
            UGIB presents as hematemesis (bright red or coffee-ground material) or melena (black tarry stools).
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-semibold text-red-700">Hematemesis</p>
              <p className="text-muted-foreground">Bright red: active bleeding</p>
              <p className="text-muted-foreground">Coffee-ground: slower/older bleeding</p>
            </div>
            <div className="p-2 bg-gray-800 dark:bg-gray-900 rounded">
              <p className="font-semibold text-gray-200">Melena</p>
              <p className="text-gray-400">Black, tarry, foul-smelling stool</p>
              <p className="text-gray-400">Indicates UGI source</p>
            </div>
          </div>
        </Section>

        {/* Rapid Assessment */}
        <Section id="ugib-rapid" title="Rapid Assessment" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
            <p className="font-semibold text-red-700 text-sm mb-2">Signs of Hemodynamic Instability (Shock):</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>• Tachycardia</span>
              <span>• Hypotension/Orthostasis</span>
              <span>• Poor capillary refill</span>
              <span>• Cold extremities</span>
              <span>• Altered mental status</span>
              <span>• Mottled skin</span>
            </div>
          </div>
        </Section>

        {/* Unstable Patient */}
        <Section id="ugib-unstable" title="Hemodynamically UNSTABLE" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
              <p className="font-semibold text-red-700">Immediate Actions:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Fluid resuscitation (crystalloid ± blood)</li>
                <li>• Intubate if unable to protect airway</li>
                <li>• Place 2 large-bore IVs</li>
                <li>• Type & crossmatch; transfuse as indicated</li>
                <li>• Intensive monitoring of vitals</li>
                <li>• Stabilize before further management</li>
              </ul>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">Consult:</p>
              <p className="text-muted-foreground">Gastroenterology, Surgery, Critical Care (PICU)</p>
            </div>
          </div>
        </Section>

        {/* Stable Patient Evaluation */}
        <Section id="ugib-stable" title="Hemodynamically STABLE - Initial Evaluation" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">1. Estimate Severity of Bleeding</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">2. CBC if more than minor bleeding</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">3. Focused History:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Known liver disease or varices?</li>
                <li>• Bleeding diathesis?</li>
                <li>• NSAID use?</li>
                <li>• Vomiting before hematemesis? (Mallory-Weiss)</li>
              </ul>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">4. Focused Physical Exam:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Hepatosplenomegaly (portal HTN → varices)</li>
                <li>• Epistaxis (blood source may be nasal)</li>
                <li>• Bruising, petechiae (bleeding disorder)</li>
              </ul>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-medium text-amber-700">5. Exclude Mimics of UGIB:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• Epistaxis with swallowed blood</li>
                <li>• Swallowed maternal blood (neonates)</li>
                <li>• Red food colorings (tomatoes, beets)</li>
                <li>• Iron supplements (black stools)</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Concerning Features */}
        <Section id="ugib-concerning" title="Features Suggesting Severe UGIB" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 text-xs">
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Presented with hemodynamic instability</strong></li>
              <li>• <strong>Melena or large hematochezia</strong></li>
              <li>• <strong>Large-volume hematemesis</strong></li>
              <li>• <strong>Known/suspected esophageal varices</strong> (liver disease, splenomegaly)</li>
              <li>• <strong>Significant anemia</strong> (Hgb &gt;20% below normal, or needs transfusion)</li>
            </ul>
            <p className="text-red-600 font-medium mt-2">→ Requires aggressive management</p>
          </div>
        </Section>

        {/* Management - Large Volume */}
        <Section id="ugib-large" title="Large-Volume UGIB Management" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-700">IV Access & Monitoring</p>
              <p className="text-muted-foreground">Maintain IV access, intensive monitoring in PICU</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Blood Tests:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• CBC with platelets, PT/PTT, INR</li>
                <li>• Type & screen</li>
                <li>• Electrolytes, BUN, Creatinine</li>
                <li>• ALT, AST (if cause unclear)</li>
              </ul>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-semibold text-red-700">Transfuse if:</p>
              <p className="text-muted-foreground">Hgb &lt;8 g/dL or hemodynamically unstable</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="font-semibold text-purple-700">IV PPI (Acid Suppression)</p>
              <p className="text-muted-foreground">Omeprazole or Pantoprazole</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-semibold text-green-700">Correct Coagulopathy</p>
              <p className="text-muted-foreground">Vitamin K for liver disease, FFP/platelets if needed</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-700">Octreotide (for Variceal Bleeding)</p>
              <p className="text-muted-foreground">Used to control bleeding prior to endoscopy</p>
            </div>
          </div>
        </Section>

        {/* Endoscopy */}
        <Section id="ugib-endoscopy" title="Upper Endoscopy" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="font-semibold text-blue-700 text-sm">Within 24 hours when stable:</p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• For diagnosis AND therapy</li>
              <li>• If cause unknown or bleeding continues</li>
              <li>• All large-volume or concerning UGIB</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2"><strong>Note:</strong> NG tube not routinely necessary. If gastric clearance needed, <strong>erythromycin</strong> is preferred over NG lavage.</p>
          </div>
        </Section>

        {/* Small Volume Management */}
        <Section id="ugib-small" title="Small-Volume UGIB (Benign Etiology)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-semibold text-green-700">Likely causes: Mallory-Weiss tear, mild gastritis</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• No routine lab testing required</li>
                <li>• Treatment directed to etiology</li>
              </ul>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">Mallory-Weiss Tear:</p>
              <p className="text-muted-foreground">Coffee-ground emesis after vigorous vomiting</p>
              <p className="text-blue-600 mt-1">Tx: Antiemetic (ondansetron) + short course PPI</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-semibold">NSAID-Related UGIB:</p>
              <p className="text-blue-600">Tx: Stop NSAID + course of PPI</p>
            </div>
          </div>
        </Section>

        {/* Physical Exam Findings */}
        <Section id="ugib-pe" title="Physical Exam Findings & Implications" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[10px] min-w-[350px]">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-2 px-2 font-semibold">Finding</th>
                  <th className="text-left py-2 px-2 font-semibold">Consider</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-1 px-2">Hepatosplenomegaly, ascites</td><td className="py-1 px-2">Portal HTN → Esophageal varices</td></tr>
                <tr className="border-b"><td className="py-1 px-2">Bruising, petechiae</td><td className="py-1 px-2">Bleeding disorder</td></tr>
                <tr className="border-b"><td className="py-1 px-2">Vascular malformations</td><td className="py-1 px-2">Hereditary hemorrhagic telangiectasia</td></tr>
                <tr className="border-b"><td className="py-1 px-2">Mucocutaneous pigmentation</td><td className="py-1 px-2">Peutz-Jeghers syndrome</td></tr>
                <tr><td className="py-1 px-2">Blood in nares/pharynx</td><td className="py-1 px-2">Epistaxis (mimic)</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Abbreviations */}
        <Section id="ugib-abbrev" title="Key Abbreviations" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="space-y-0.5">
              <p><strong>UGIB:</strong> Upper GI Bleeding</p>
              <p><strong>PPI:</strong> Proton Pump Inhibitor</p>
              <p><strong>NG:</strong> Nasogastric</p>
            </div>
            <div className="space-y-0.5">
              <p><strong>INR:</strong> International Normalized Ratio</p>
              <p><strong>FFP:</strong> Fresh Frozen Plasma</p>
              <p><strong>Hgb:</strong> Hemoglobin</p>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default UgibApproach;
