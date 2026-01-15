/**
 * Hypocalcemia & Rickets Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const HypocalcemiaApproach = ({ expandedSections, toggleSection }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Approach to Hypocalcemia & Rickets</CardTitle>
        <CardDescription className="text-xs">Diagnostic flowchart and biochemical findings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Initial Assessment - Low Ca */}
        <Section id="hypoca-initial" title="Diagnostic Approach (Low Calcium)" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 mb-3">
            <p className="font-semibold text-red-700 dark:text-red-300 text-center">Low Ca</p>
            <p className="text-xs text-center text-muted-foreground mt-1">Starting point for evaluation</p>
          </div>
          <div className="space-y-2 text-xs">
            <p className="font-medium">Check iPTH (Intact Parathyroid Hormone)</p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="font-medium text-blue-700">PTH ↓ or Low</p>
                <p className="text-muted-foreground mt-1">Check Magnesium</p>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                <p className="font-medium text-amber-700">PTH ↑ or Normal</p>
                <p className="text-muted-foreground mt-1">Check Phosphate & 25OHD</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Low PTH Pathway - Magnesium Branch */}
        <Section id="hypoca-mg-branch" title="Low PTH Pathway (Check Mg)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <p className="font-semibold text-purple-700 dark:text-purple-300">Mg ↓ (Low)</p>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">→ Hypomagnesemia</p>
                <p className="text-xs text-muted-foreground mt-1">Can cause functional hypoparathyroidism</p>
              </div>
              <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                <p className="font-semibold text-teal-700 dark:text-teal-300">Mg Normal</p>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">→ Hypoparathyroidism</p>
                <p className="text-xs text-muted-foreground mt-1">Primary PTH deficiency</p>
              </div>
            </div>
          </div>
        </Section>

        {/* High PTH Pathway - Phosphate/Creatinine Branch */}
        <Section id="hypoca-phos-branch" title="High PTH Pathway (Check Phos & Creatinine)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
              <p className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Phosphate ↑ + Creatinine ↑</p>
              <p className="text-xs text-muted-foreground font-semibold">→ Renal Failure</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                <li>• Impaired phosphate excretion</li>
                <li>• Impaired 1,25(OH)₂D synthesis</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-semibold mb-2">Phosphate ↑ + Creatinine Normal</p>
              <p className="text-xs text-muted-foreground font-semibold">→ Pseudohypoparathyroidism</p>
              <p className="text-xs text-muted-foreground mt-1">PTH resistance (PTH present but tissues do not respond)</p>
            </div>
          </div>
        </Section>

        {/* Vitamin D Assessment */}
        <Section id="hypoca-vitd" title="Vitamin D Assessment (25OHD₃)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <p className="font-semibold text-red-700 dark:text-red-300 mb-2">25OHD₃ ↓ (Low)</p>
              <p className="text-xs text-muted-foreground mb-2">Causes of Vitamin D Deficiency:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                  <p className="font-medium">Dietary deficiency</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                  <p className="font-medium">Malabsorption</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                  <p className="font-medium">Anticonvulsants</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                  <p className="font-medium">Lack of sun exposure</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="font-semibold text-green-700 dark:text-green-300 mb-2">25OHD₃ Normal → Check 1,25(OH)₂D₃</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                  <p className="font-medium text-blue-600">1,25(OH)₂D₃ ↓</p>
                  <p className="text-muted-foreground mt-1">Vit-D Dependency (Type 1)</p>
                  <p className="text-[10px] text-muted-foreground">1α-hydroxylase deficiency</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                  <p className="font-medium text-purple-600">1,25(OH)₂D₃ ↑↑</p>
                  <p className="text-muted-foreground mt-1">Vit-D Resistance (Type 2)</p>
                  <p className="text-[10px] text-muted-foreground">Receptor resistance</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Vitamin D Activation Pathway */}
        <Section id="hypoca-vitd-pathway" title="Vitamin D Activation Pathway" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2">
            {/* Sources */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-center">
                <p className="font-medium text-green-700">Vit D2 & D3 from Diet</p>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-center">
                <p className="font-medium text-green-700">UVB → D3 in skin</p>
              </div>
            </div>
            <div className="flex justify-center">
              <span className="text-blue-500">↓</span>
            </div>
            {/* Liver */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="font-semibold text-blue-700 dark:text-blue-300">Liver</p>
              <p className="text-xs text-muted-foreground">Activates to Calcidiol (25-OH Vit D)</p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <span className="text-blue-500">↓</span>
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-[10px] text-orange-600">
                Deficiency → Vit D Dependent Rickets Type 1
              </div>
            </div>
            {/* Kidney */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="font-semibold text-blue-700 dark:text-blue-300">Kidney (1α-Hydroxylase)</p>
              <p className="text-xs text-muted-foreground">Activates to Calcitriol (1,25-dihydroxy Vit D)</p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <span className="text-blue-500">↓</span>
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-[10px] text-orange-600">
                Receptor resistance → Vit D Dependent Rickets Type 2
              </div>
            </div>
            {/* Target */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="font-semibold text-blue-700 dark:text-blue-300">Action on Peripheral Tissues</p>
              <p className="text-xs text-muted-foreground">Bone mineralization, Ca/Phos absorption</p>
            </div>
          </div>
        </Section>

        {/* Suspected Rickets Flowchart */}
        <Section id="hypoca-rickets-dx" title="Diagnostic Approach in Suspected Rickets" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3">
            {/* Suspicion */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
              <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm">Suspected Rickets:</p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• <span className="text-red-600 font-medium">Elevated alkaline phosphatase activity</span></li>
                <li>• <span className="text-red-600 font-medium">Clinical or radiographic findings</span></li>
              </ul>
            </div>
            {/* Measure */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="font-medium text-blue-700">Measure serum</p>
              <p className="text-sm font-semibold text-red-600 mt-1">PTH, Pi (Phosphate), and Ca</p>
            </div>
            {/* Classification */}
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <p className="font-semibold text-purple-700 dark:text-purple-300">Calcipenic (Hypocalcemic) Rickets</p>
                <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-center">
                  <div className="p-1 bg-white dark:bg-gray-900 rounded">
                    <p className="text-red-600 font-bold">PTH ↑</p>
                  </div>
                  <div className="p-1 bg-white dark:bg-gray-900 rounded">
                    <p>Pi N or ↓</p>
                  </div>
                  <div className="p-1 bg-white dark:bg-gray-900 rounded">
                    <p>Ca N or ↓</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                <p className="font-semibold text-teal-700 dark:text-teal-300">Phosphopenic (Hypophosphatemic) Rickets</p>
                <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-center">
                  <div className="p-1 bg-white dark:bg-gray-900 rounded">
                    <p>PTH N or slightly ↑</p>
                  </div>
                  <div className="p-1 bg-white dark:bg-gray-900 rounded">
                    <p className="text-red-600 font-bold">Pi ↓</p>
                  </div>
                  <div className="p-1 bg-white dark:bg-gray-900 rounded">
                    <p>Ca Normal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default HypocalcemiaApproach;
