/**
 * Metabolic Emergencies Approach
 * Based on UpToDate Guidelines - Inborn Errors of Metabolism (IEM)
 * Reference: Pediatric Emergency Medicine / AAP Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Section } from "./index";

const MetabolicEmergencyApproach = ({ weight, age, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="metabolic-emergency-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Metabolic Emergencies</CardTitle>
        <CardDescription className="text-xs">Inborn Errors of Metabolism (IEM) - Acute Decompensation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-[#00d9c5]">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li>IEM can present as acute emergencies with significant morbidity or death</li>
            <li>Deterioration <strong>after initial period of well-being</strong> is the most important clue</li>
            <li>Triggers: infection, fasting, surgery/trauma, increased protein intake</li>
            <li>Collect samples BEFORE treatment when possible (glucose administration affects results)</li>
          </ul>
        </div>

        {/* Clinical Presentations */}
        <Section
          title="Clinical Presentations"
          isOpen={expandedSections["clinicalPresentation"] !== false}
          onToggle={() => toggleSection("clinicalPresentation")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">
              Acute presentation with multisystem involvement → strongly suggestive of IEM
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-medium mb-1">Neurologic (85%):</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Lethargy → coma</li>
                  <li>Seizures</li>
                  <li>Hypotonia/hypertonia</li>
                  <li>Developmental delay</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">GI (58%):</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Vomiting, poor feeding</li>
                  <li>Hepatomegaly</li>
                  <li>Liver failure</li>
                  <li>Failure to thrive</li>
                </ul>
              </div>
            </div>
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">Other Features:</p>
              <ul className="list-disc pl-4">
                <li>Rapid, deep breathing → apnea</li>
                <li>Hypothermia</li>
                <li>Rhabdomyolysis</li>
                <li>SIDS/BRUE (apparent life-threatening event)</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Triggers */}
        <Section
          title="Triggers of Metabolic Crisis"
          isOpen={expandedSections["triggers"]}
          onToggle={() => toggleSection("triggers")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <p className="font-medium text-red-700 dark:text-red-400 mb-1">↑ Catabolism:</p>
                <ul className="list-disc pl-4">
                  <li>Acute infection</li>
                  <li>Surgery, trauma</li>
                  <li>Birthing process</li>
                  <li>Fasting</li>
                </ul>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">↑ Intake:</p>
                <ul className="list-disc pl-4">
                  <li>↑ Protein (breast milk → cow's milk)</li>
                  <li>Specific carbohydrates</li>
                  <li>Fructose (HFI)</li>
                  <li>Galactose</li>
                </ul>
              </div>
            </div>
            <p className="mt-2 text-amber-600 dark:text-amber-400 text-center">
              Severity often <strong>disproportionate</strong> to precipitating illness
            </p>
          </div>
        </Section>

        {/* Initial Laboratory Evaluation */}
        <Section
          title="Initial Laboratory Evaluation"
          isOpen={expandedSections["initialLabs"] !== false}
          onToggle={() => toggleSection("initialLabs")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Test</th>
                  <th className="text-left py-1">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1 font-medium">CBC with diff</td><td className="py-1">Infection, bone marrow suppression</td></tr>
                <tr><td className="py-1 font-medium">ABG/VBG</td><td className="py-1">Acid-base status</td></tr>
                <tr><td className="py-1 font-medium">Blood glucose</td><td className="py-1">Hypo/hyperglycemia</td></tr>
                <tr><td className="py-1 font-medium text-red-600">Ammonia*</td><td className="py-1">Urea cycle, organic acidemias</td></tr>
                <tr><td className="py-1 font-medium">Electrolytes, BUN, Cr</td><td className="py-1">Anion gap calculation</td></tr>
                <tr><td className="py-1 font-medium">Uric acid</td><td className="py-1">GSD, purine disorders</td></tr>
                <tr><td className="py-1 font-medium">LFTs, PT/INR</td><td className="py-1">Liver dysfunction</td></tr>
                <tr><td className="py-1 font-medium">Urinalysis</td><td className="py-1">Ketones, reducing substances</td></tr>
              </tbody>
            </table>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded mt-2">
              <p className="font-medium text-blue-700 dark:text-blue-400">*Ammonia Collection:</p>
              <ul className="list-disc pl-4 text-blue-600 dark:text-blue-300">
                <li>Free-flowing venous/arterial (NO tourniquet)</li>
                <li>Immediately place on ICE</li>
                <li>Analyze within 30 minutes</li>
                <li>If &gt;100 µmol/L → repeat immediately</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Specialized Tests */}
        <Section
          title="Specialized Metabolic Tests"
          isOpen={expandedSections["specializedTests"]}
          onToggle={() => toggleSection("specializedTests")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="text-amber-600 dark:text-amber-400 mb-2">
              Collect samples at presentation (even if not needed immediately) - interventions affect results
            </p>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Test</th>
                  <th className="text-left py-1">Detects</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1 font-medium">Plasma amino acids</td><td className="py-1">MSUD, urea cycle defects</td></tr>
                <tr><td className="py-1 font-medium">Urine organic acids</td><td className="py-1">Organic acidemias</td></tr>
                <tr><td className="py-1 font-medium">Acylcarnitine profile</td><td className="py-1">Fatty acid oxidation defects</td></tr>
                <tr><td className="py-1 font-medium">Lactate/Pyruvate</td><td className="py-1">Mitochondrial disorders</td></tr>
                <tr><td className="py-1 font-medium">CSF amino acids/lactate</td><td className="py-1">Neurometabolic disorders</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Distinguishing IEM by Labs */}
        <Section
          title="Distinguishing IEM by Lab Findings"
          isOpen={expandedSections["distinguishingLabs"] !== false}
          onToggle={() => toggleSection("distinguishingLabs")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800">
                    <th className="text-left py-1 px-1">Disorder</th>
                    <th className="text-center py-1 px-1">Met. Acidosis</th>
                    <th className="text-center py-1 px-1">Resp. Alkalosis</th>
                    <th className="text-center py-1 px-1">↑NH3</th>
                    <th className="text-center py-1 px-1">↓Glucose</th>
                    <th className="text-center py-1 px-1">Ketones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-1 px-1 font-medium">MSUD</td>
                    <td className="text-center">+</td>
                    <td className="text-center">-</td>
                    <td className="text-center">±</td>
                    <td className="text-center">±</td>
                    <td className="text-center">A/H</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-1 px-1 font-medium">Organic Acidemias</td>
                    <td className="text-center">++</td>
                    <td className="text-center">+</td>
                    <td className="text-center">+</td>
                    <td className="text-center">±</td>
                    <td className="text-center">H</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20">
                    <td className="py-1 px-1 font-medium">Urea Cycle Defects</td>
                    <td className="text-center">-</td>
                    <td className="text-center">++</td>
                    <td className="text-center">++</td>
                    <td className="text-center">-</td>
                    <td className="text-center">A</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-1 px-1 font-medium">GSD / Carb disorders</td>
                    <td className="text-center">±</td>
                    <td className="text-center">-</td>
                    <td className="text-center">+</td>
                    <td className="text-center">+</td>
                    <td className="text-center">A/H</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20">
                    <td className="py-1 px-1 font-medium">Fatty Acid Oxidation</td>
                    <td className="text-center">±</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">+</td>
                    <td className="text-center text-red-600">A/L</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1 font-medium">Mitochondrial</td>
                    <td className="text-center">±</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">±</td>
                    <td className="text-center">A/H</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] mt-1 text-slate-500">
              Key: (-) absent, (±) sometimes, (+) usually, (++) always present. A=appropriate, H=high, L=low ketones for glucose
            </p>
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium text-blue-700 dark:text-blue-400">
                💡 Hypoketotic hypoglycemia → Think Fatty Acid Oxidation Disorders (MCAD, VLCAD)
              </p>
            </div>
          </div>
        </Section>

        {/* Hyperammonemia Management */}
        <Section
          title="Hyperammonemia - EMERGENCY Management"
          isOpen={expandedSections["hyperammonemia"] !== false}
          onToggle={() => toggleSection("hyperammonemia")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded border-l-4 border-red-500">
              <p className="font-bold text-red-700 dark:text-red-400">NEUROTOXIC - Treat Immediately!</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Newborn: ≥120 µmol/L (2 µg/mL)</li>
                <li>Older: ≥80 µmol/L (1.4 µg/mL)</li>
                <li>Urea cycle defects: 300-1000+ µmol/L</li>
              </ul>
            </div>
            
            <div className="space-y-2 mt-2">
              <p className="font-medium">Immediate Management:</p>
              <div className="p-2 bg-white dark:bg-slate-900 rounded space-y-1">
                <p>1. <strong>Stop protein intake</strong></p>
                <p>2. <strong>High dextrose infusion</strong> (10% D10W) - prevent catabolism</p>
                <p>3. <strong>Ammonia scavengers</strong> (consult metabolic specialist):</p>
                <ul className="list-disc pl-6">
                  <li>Sodium benzoate: 250 mg/kg loading, then 250-500 mg/kg/day</li>
                  <li>Sodium phenylacetate (Ammonul): 250 mg/kg loading</li>
                </ul>
                <p>4. <strong>Hemodialysis</strong> if ammonia &gt;500 µmol/L or rising rapidly</p>
                <p>5. <strong>Arginine</strong> (except arginase deficiency): 200-600 mg/kg/day</p>
              </div>
              <p className="text-red-600 dark:text-red-400">
                ⚠️ AVOID bicarbonate in hyperammonemia (↑ cerebral edema, ↓ urinary NH3 excretion)
              </p>
            </div>
          </div>
        </Section>

        {/* Hypoglycemia in IEM */}
        <Section
          title="Hypoglycemia in IEM"
          isOpen={expandedSections["hypoglycemia"]}
          onToggle={() => toggleSection("hypoglycemia")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium mb-1">Distinguish by presence of ketones:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="font-medium text-green-700 dark:text-green-400 mb-1">WITH Ketosis:</p>
                <ul className="list-disc pl-4">
                  <li>Organic acidemias</li>
                  <li>MSUD</li>
                  <li>GSD (except type I)</li>
                  <li>Gluconeogenesis defects</li>
                </ul>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <p className="font-medium text-red-700 dark:text-red-400 mb-1">WITHOUT Ketosis:</p>
                <ul className="list-disc pl-4">
                  <li><strong>Fatty acid oxidation</strong> (MCAD, VLCAD)</li>
                  <li>HMG-CoA lyase deficiency</li>
                  <li>GSD type I</li>
                  <li>Hyperinsulinism</li>
                </ul>
              </div>
            </div>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="font-medium text-blue-700 dark:text-blue-400">Treatment - D10W Infusion:</p>
                <p className="font-mono text-blue-600 dark:text-blue-300">
                  GIR 8-10 mg/kg/min = {((w * 8 * 60) / 100).toFixed(1)} - {((w * 10 * 60) / 100).toFixed(1)} mL/hr of D10W
                </p>
              </div>
            )}
          </div>
        </Section>

        {/* Metabolic Acidosis */}
        <Section
          title="Metabolic Acidosis in IEM"
          isOpen={expandedSections["metabolicAcidosis"]}
          onToggle={() => toggleSection("metabolicAcidosis")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium">Causes of ↑ Anion Gap Metabolic Acidosis in IEM:</p>
            <ul className="list-disc pl-4">
              <li><strong>Organic acidemias</strong> (methylmalonic, propionic acid)</li>
              <li>MSUD (branched-chain ketoacids)</li>
              <li>Mitochondrial disorders (lactic acidosis)</li>
              <li>Pyruvate metabolism disorders</li>
              <li>GSD (lactic acidosis)</li>
            </ul>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded mt-2">
              <p className="font-medium text-amber-700 dark:text-amber-400">Urine pH helps differentiate:</p>
              <ul className="list-disc pl-4">
                <li>Urine pH &lt;5 → appropriate response (IEM likely)</li>
                <li>Urine pH &gt;5 → RTA more likely than IEM</li>
              </ul>
            </div>
            <p className="text-slate-500 mt-1">
              Note: Bicarbonate alone unlikely to help in organic acidemia - treat underlying cause
            </p>
          </div>
        </Section>

        {/* Seizures in IEM */}
        <Section
          title="Seizures in IEM - Cofactor Trials"
          isOpen={expandedSections["seizures"]}
          onToggle={() => toggleSection("seizures")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="text-amber-600 dark:text-amber-400 mb-2">
              IEM seizures often refractory to standard AEDs - consider cofactor trials
            </p>
            <div className="space-y-2">
              <div className="p-2 bg-white dark:bg-slate-900 rounded">
                <p className="font-medium">Step 1: Pyridoxine (B6)</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">100 mg IV under EEG monitoring</p>
                <p className="text-slate-500">For: Pyridoxine-dependent epilepsy</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded">
                <p className="font-medium">Step 2: Pyridoxal-5-Phosphate (PLP)</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">10 mg/kg IV</p>
                <p className="text-slate-500">For: PNPO deficiency (if no response to pyridoxine)</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded">
                <p className="font-medium">Step 3: Folinic Acid (Leucovorin)</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">2.5 mg IV</p>
                <p className="text-slate-500">For: Folinic acid-responsive seizures</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded">
                <p className="font-medium">Step 4: Biotin</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">10 mg PO/NG</p>
                <p className="text-slate-500">For: Biotinidase/holocarboxylase deficiency</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Immediate Management */}
        <Section
          title="Immediate Management Summary"
          isOpen={expandedSections["management"] !== false}
          onToggle={() => toggleSection("management")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="space-y-2">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-500">
                <p className="font-medium text-red-700 dark:text-red-400">1. Stabilize ABCs</p>
                <ul className="list-disc pl-4">
                  <li>Fluid resuscitation with NS (avoid lactated Ringer's)</li>
                  <li>Ventilatory support if needed</li>
                  <li>Avoid hypotonic fluids (cerebral edema risk)</li>
                </ul>
              </div>
              
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                <p className="font-medium text-blue-700 dark:text-blue-400">2. Prevent Catabolism</p>
                <ul className="list-disc pl-4">
                  <li>IV dextrose: GIR 8-10 mg/kg/min</li>
                  <li>Stop enteral protein</li>
                  <li>Add insulin if glucose &gt;180 (target 100-120 mg/dL)</li>
                </ul>
                {w > 0 && (
                  <p className="font-mono mt-1">
                    Insulin: {(w * 0.05).toFixed(2)} units/hr (0.05 U/kg/hr)
                  </p>
                )}
              </div>
              
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-500">
                <p className="font-medium text-purple-700 dark:text-purple-400">3. Remove Toxic Metabolites</p>
                <ul className="list-disc pl-4">
                  <li>Dialysis if ammonia &gt;500 or rising rapidly</li>
                  <li>Ammonia scavengers (sodium benzoate/phenylacetate)</li>
                </ul>
              </div>
              
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-500">
                <p className="font-medium text-green-700 dark:text-green-400">4. Empiric Cofactors</p>
                <ul className="list-disc pl-4">
                  <li>Vitamin B12: 1 mg IM (if organic acidemia suspected)</li>
                  <li>Carnitine: 100 mg/kg/day (organic acidemias, FAO defects)</li>
                  <li>Riboflavin: 50 mg IV TID (multiple acyl-CoA dehydrogenase deficiency)</li>
                </ul>
                {w > 0 && (
                  <p className="font-mono mt-1">
                    Carnitine: {(w * 100).toFixed(0)} mg/day in 3 divided doses
                  </p>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Differential Diagnosis */}
        <Section
          title="Differential Diagnosis"
          isOpen={expandedSections["differential"]}
          onToggle={() => toggleSection("differential")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium mb-1">Neonates:</p>
                <ul className="list-disc pl-4">
                  <li>Sepsis</li>
                  <li>Congenital viral infection</li>
                  <li>Duct-dependent CHD</li>
                  <li>Drug withdrawal</li>
                  <li>CAH</li>
                  <li>Hyperinsulinism</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Older Children:</p>
                <ul className="list-disc pl-4">
                  <li>DKA</li>
                  <li>Ingestion/intoxication</li>
                  <li>Encephalitis</li>
                  <li>Adrenal insufficiency</li>
                  <li>Reye syndrome</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* When to Suspect IEM */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">When to Suspect IEM</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li>Deterioration after initial well period</li>
            <li>Recurrent episodes with infections/fasting</li>
            <li>Severity disproportionate to illness</li>
            <li>Unexplained encephalopathy, acidosis, hypoglycemia</li>
            <li>Family history of SIDS or unexplained infant deaths</li>
            <li>Consanguinity</li>
            <li>Unusual odor (maple syrup, sweaty feet, musty)</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
};

export default MetabolicEmergencyApproach;
