/**
 * Thrombocytopenia Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const ThrombocytopeniaApproach = ({ expandedSections, toggleSection }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Approach to Thrombocytopenia</CardTitle>
        <CardDescription className="text-xs">Diagnostic flowchart based on patient status and platelet characteristics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Initial Assessment */}
        <Section id="thrombo-assess" title="Initial Assessment" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-200">
              <p className="font-bold text-green-700 dark:text-green-300 text-center">WELL</p>
              <p className="text-xs text-center text-muted-foreground mt-1">Clinically stable</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200">
              <p className="font-bold text-red-700 dark:text-red-300 text-center">ILL</p>
              <p className="text-xs text-center text-muted-foreground mt-1">Clinically unwell</p>
            </div>
          </div>
        </Section>

        {/* Well Patient */}
        <Section id="thrombo-well" title="WELL Patient Pathway" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            {/* Large PLT */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Large Platelets + Normal Hb & WBC</p>
              <p className="text-xs text-muted-foreground mb-2">→ Suggests Consumption</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-purple-600">Immune</p>
                  <ul className="text-muted-foreground mt-1 space-y-0.5">
                    <li>• ITP</li>
                    <li>• 2° to SLE, HIV</li>
                    <li>• Drug induced</li>
                  </ul>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-orange-600">Non-immune</p>
                  <ul className="text-muted-foreground mt-1 space-y-0.5">
                    <li>• Maternal ITP</li>
                    <li>• NAIT</li>
                    <li>• Type 2B/Platelet VWD</li>
                    <li>• Hereditary Thrombocytopenia</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Small PLT */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Small Platelets + Congenital anomalies / ↑MCV</p>
              <p className="text-xs text-muted-foreground mb-2">→ Suggests Decreased Synthesis</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-teal-600">Congenital</p>
                  <ul className="text-muted-foreground mt-1 space-y-0.5">
                    <li>• TAR syndrome</li>
                    <li>• Wiskott-Aldrich (WAS)</li>
                    <li>• X-linked Amegakaryocytic</li>
                    <li>• Fanconi Anemia</li>
                  </ul>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-gray-600">Acquired</p>
                  <ul className="text-muted-foreground mt-1 space-y-0.5">
                    <li>• Medication</li>
                    <li>• Toxin</li>
                    <li>• Radiation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Ill Patient */}
        <Section id="thrombo-ill" title="ILL Patient Pathway" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            {/* Large PLT - Consumption */}
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Large Platelets + ↓Fibrinogen + ↑Fibrin degradation products</p>
              <p className="text-xs text-muted-foreground mb-2">→ Suggests Consumption (Microangiopathy)</p>
              <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                <ul className="text-muted-foreground space-y-1">
                  <li>• <strong>DIC</strong> (Disseminated Intravascular Coagulation)</li>
                  <li>• <strong>HUS</strong> (Hemolytic Uremic Syndrome)</li>
                  <li>• <strong>TTP</strong> (Thrombotic Thrombocytopenic Purpura)</li>
                  <li>• NEC (Necrotizing Enterocolitis)</li>
                  <li>• Respiratory distress</li>
                  <li>• Thrombosis / UAC</li>
                  <li>• Sepsis</li>
                  <li>• Viral infection</li>
                </ul>
              </div>
            </div>

            {/* Small PLT - Sequestration/Synthesis */}
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Small Platelets</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-purple-600">+ HSM → Sequestration</p>
                  <ul className="text-muted-foreground mt-1 space-y-0.5">
                    <li>• Hemangioma</li>
                    <li>• Hypersplenism</li>
                  </ul>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded">
                  <p className="font-medium text-gray-600">→ ↓Synthesis</p>
                  <ul className="text-muted-foreground mt-1 space-y-0.5">
                    <li>• Malignancy</li>
                    <li>• Storage disease</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Key Abbreviations */}
        <Section id="thrombo-abbrev" title="Key Abbreviations" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <p><strong>ITP:</strong> Immune Thrombocytopenic Purpura</p>
              <p><strong>NAIT:</strong> Neonatal Alloimmune Thrombocytopenia</p>
              <p><strong>TAR:</strong> Thrombocytopenia-Absent Radius</p>
              <p><strong>WAS:</strong> Wiskott-Aldrich Syndrome</p>
            </div>
            <div className="space-y-1">
              <p><strong>DIC:</strong> Disseminated Intravascular Coagulation</p>
              <p><strong>HUS:</strong> Hemolytic Uremic Syndrome</p>
              <p><strong>TTP:</strong> Thrombotic Thrombocytopenic Purpura</p>
              <p><strong>HSM:</strong> Hepatosplenomegaly</p>
            </div>
          </div>
        </Section>

        {/* Initial Workup */}
        <Section id="thrombo-workup" title="Initial Workup" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Laboratory Studies:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• CBC with peripheral smear (platelet size, morphology)</li>
                <li>• Reticulocyte count</li>
                <li>• PT/PTT, Fibrinogen, D-dimer</li>
                <li>• LDH, Haptoglobin, Bilirubin (hemolysis screen)</li>
                <li>• Blood type & Coombs test</li>
              </ul>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default ThrombocytopeniaApproach;
