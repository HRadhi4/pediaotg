/**
 * DKA (Diabetic Ketoacidosis) Approach Component
 * Includes Saudi Booklet (default) and SMC Guideline with toggle switch
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Section from "./Section";

const DkaApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;
  const [useSMCGuideline, setUseSMCGuideline] = useState(false);

  // Calculate corrected sodium (formula from SMC guideline)
  const correctedSodium = (measuredNa, bloodGlucose) => {
    if (!measuredNa || !bloodGlucose) return null;
    return (parseFloat(measuredNa) + 2 * (parseFloat(bloodGlucose) - 5.5) / 5.5).toFixed(1);
  };

  // Calculate serum osmolality
  const serumOsmolality = (measuredNa, bloodGlucose) => {
    if (!measuredNa || !bloodGlucose) return null;
    return (2 * parseFloat(measuredNa) + parseFloat(bloodGlucose)).toFixed(1);
  };

  // SMC Guideline fluid rate calculation
  const getFluidRateSMC = (childWeight) => {
    if (childWeight < 10) return 6;
    if (childWeight >= 10 && childWeight < 20) return 5;
    if (childWeight >= 20 && childWeight <= 30) return 3.5;
    return 3; // > 30 kg, max 250 ml/hr
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Diabetic Ketoacidosis (DKA)</CardTitle>
        <CardDescription className="text-xs">Pediatric DKA Management Protocol</CardDescription>
        
        {/* Guideline Toggle */}
        <div className="flex items-center justify-between mt-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <span className={`text-xs font-medium ${!useSMCGuideline ? 'text-blue-600' : 'text-muted-foreground'}`}>
            Saudi Booklet
          </span>
          <div className="flex items-center gap-2">
            <Switch
              id="guideline-switch"
              checked={useSMCGuideline}
              onCheckedChange={setUseSMCGuideline}
              data-testid="dka-guideline-switch"
            />
            <Label htmlFor="guideline-switch" className="sr-only">Switch Guideline</Label>
          </div>
          <span className={`text-xs font-medium ${useSMCGuideline ? 'text-green-600' : 'text-muted-foreground'}`}>
            SMC Guideline
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {!useSMCGuideline ? (
          /* Saudi Booklet Guideline (Original) */
          <>
            {/* Recognition */}
            <Section id="dka-recognition" title="Recognition & Diagnosis" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium mb-1">History</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• Polyuria, polydipsia</li>
                    <li>• Weight loss</li>
                    <li>• Abdominal pain, vomiting</li>
                    <li>• Lethargy</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">Clinical Findings</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• Kussmaul breathing</li>
                    <li>• Dehydration</li>
                    <li>• Fruity breath</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                <p className="font-medium text-xs">Confirm DKA:</p>
                <p className="text-xs text-muted-foreground">• Ketonuria + Glucose &gt;200 mg/dL (&gt;11.1 mmol/L) + pH &lt;7.30 and/or HCO₃ &lt;15</p>
              </div>
            </Section>

            {/* First Hour */}
            <Section id="dka-first-hour" title="1st Hour Management" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                  <p className="font-medium text-red-700">If in Shock:</p>
                  <p className="text-muted-foreground">10 mL/kg 0.9% NS bolus over 5-10 min, repeat PRN</p>
                  {w > 0 && <p className="font-mono text-red-600">→ {(w * 10).toFixed(0)} mL bolus</p>}
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-medium">If NOT in Shock:</p>
                  <p className="text-muted-foreground">&lt;20 kg: 7 mL/kg over 1 hour</p>
                  <p className="text-muted-foreground">&gt;20 kg: 5 mL/kg over 1 hour</p>
                  {w > 0 && <p className="font-mono text-gray-600">→ {(w < 20 ? w * 7 : w * 5).toFixed(0)} mL over 1 hr</p>}
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                  <p className="font-semibold text-red-700 text-xs">DO NOT:</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• Give insulin bolus</li>
                    <li>• Give NaHCO₃ (unless life-threatening)</li>
                    <li>• Give unnecessary fluid boluses</li>
                    <li>• Use hypotonic fluids</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Post 1st Hour - Fluids */}
            <Section id="dka-fluids" title="Fluid Management (Post 1st Hour)" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs">
                <p className="font-medium mb-2">Total Fluid Intake (TFI) by weight:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1 pr-4">Weight</th>
                        <th className="text-left py-1">TFI (mL/kg/hr)</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr><td className="py-1 pr-4">≤15 kg</td><td>5</td></tr>
                      <tr><td className="py-1 pr-4">15-35 kg</td><td>4</td></tr>
                      <tr><td className="py-1 pr-4">35-50 kg</td><td>3</td></tr>
                      <tr><td className="py-1 pr-4">&gt;50 kg</td><td>2</td></tr>
                    </tbody>
                  </table>
                </div>
                {w > 0 && (
                  <p className="font-mono text-blue-600 mt-2">
                    → {(w * (w <= 15 ? 5 : w <= 35 ? 4 : w <= 50 ? 3 : 2)).toFixed(0)} mL/hr
                  </p>
                )}
              </div>
            </Section>

            {/* Insulin */}
            <Section id="dka-insulin" title="Insulin" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground">Mix 50 units Regular in 50 mL NS (1 unit/mL)</p>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-medium">Standard dose: 0.1 U/kg/hr</p>
                  {w > 0 && <p className="font-mono text-gray-600">→ {(w * 0.1).toFixed(1)} units/hr ({(w * 0.1).toFixed(1)} mL/hr)</p>}
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-medium">Low dose: 0.05 U/kg/hr</p>
                  <p className="text-muted-foreground">For: newly diagnosed, ≤5 years, or recently received insulin</p>
                  {w > 0 && <p className="font-mono text-gray-600">→ {(w * 0.05).toFixed(2)} units/hr</p>}
                </div>
              </div>
            </Section>

            {/* Potassium */}
            <Section id="dka-potassium" title="Potassium" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs text-muted-foreground">
                <p>• Add KCl 40 mEq/L once voiding (unless K &gt;5.5)</p>
                <p>• If K &lt;3.5: increase to 60 mEq/L</p>
              </div>
            </Section>

            {/* Dextrose */}
            <Section id="dka-dextrose" title="Dextrose" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs text-muted-foreground">
                <p>• Add D5 if glucose &lt;250 mg/dL (&lt;13.9 mmol/L) or rapid drop &gt;100 mg/dL/hr (&gt;5.6 mmol/L/hr)</p>
                <p>• Add D10 if glucose &lt;180 mg/dL (&lt;10 mmol/L)</p>
              </div>
            </Section>

            {/* Cerebral Edema */}
            <Section id="dka-cerebral" title="Cerebral Edema" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
                <p className="font-semibold text-red-700 mb-1">Warning Signs:</p>
                <p className="text-muted-foreground">Headache, irritability, ↓LOC, vomiting, bradycardia, HTN</p>
                <div className="mt-2 border-t border-red-200 pt-2">
                  <p className="font-medium">Treatment:</p>
                  <p className="text-muted-foreground">• Elevate HOB, secure airway</p>
                  <p className="text-muted-foreground">• Mannitol 0.5-1 g/kg OR 3% NaCl 5-10 mL/kg</p>
                  {w > 0 && <p className="font-mono text-red-600">→ Mannitol: {(w * 0.5).toFixed(1)}-{w.toFixed(0)} g</p>}
                  <p className="text-muted-foreground">• Neurosurgery consult, Head CT</p>
                </div>
              </div>
            </Section>

            {/* Resolution */}
            <Section id="dka-resolution" title="DKA Resolution" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">DKA resolves when:</p>
                <p>pH &gt;7.30, HCO₃ &gt;15, normal anion gap</p>
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-medium">After resolution:</p>
                  <p>• Start oral fluids (controlled)</p>
                  <p>• Give SC insulin, stop IV 30 min after</p>
                  <p>• Start diabetic diet</p>
                </div>
              </div>
            </Section>
          </>
        ) : (
          /* SMC Guideline (Kingdom of Bahrain Ministry of Health) */
          <>
            {/* Introduction */}
            <Section id="smc-intro" title="Introduction" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>Diabetic ketoacidosis (DKA) is caused by a decrease in effective circulating insulin associated with increases in counter regulatory hormones including glucagon, catecholamines, cortisol, and growth hormone.</p>
                <p>This leads to:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Increased glucose production by liver and kidney</li>
                  <li>Impaired peripheral glucose utilisation → hyperglycaemia & hyperosmolality</li>
                  <li>Increased lipolysis → ketone body production → ketonaemia & metabolic acidosis</li>
                </ul>
              </div>
            </Section>

            {/* Diagnosis */}
            <Section id="smc-diagnosis" title="Diagnosis" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs">
                <p className="font-medium mb-2">Confirm DKA diagnosis by checking:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-800">Ketonuria</p>
                    <p className="text-muted-foreground text-[10px]">Present</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-800">Glucose</p>
                    <p className="text-muted-foreground text-[10px]">&gt; 11 mmol/L (200 mg/dL)</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-800">pH</p>
                    <p className="text-muted-foreground text-[10px]">&lt; 7.30</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-800">Serum HCO₃</p>
                    <p className="text-muted-foreground text-[10px]">&lt; 15 mmol/L</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Initial Investigations */}
            <Section id="smc-investigations" title="Initial Investigations" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-3">
                <div>
                  <p className="font-medium mb-1">Blood:</p>
                  <ul className="text-muted-foreground list-disc list-inside ml-2">
                    <li>Glucose</li>
                    <li>VBG (pH, HCO₃)</li>
                    <li>Na (corrected), K, Cl</li>
                    <li>Urea, creatinine</li>
                    <li>Serum acetone</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">Urine:</p>
                  <p className="text-muted-foreground ml-2">Ketones</p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="font-medium text-blue-800 mb-1">Special Investigations (New Patients):</p>
                  <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                    <li>HLA typing</li>
                    <li>Islet cell antibodies</li>
                    <li>Insulin antibodies</li>
                    <li>Anti-GAD antibodies</li>
                    <li>TFT</li>
                  </ul>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <p className="font-semibold text-purple-800 text-[10px]">Corrected Sodium Formula:</p>
                  <p className="font-mono text-[10px] text-purple-700">Na(corrected) = Na(measured) + 2 × (BG - 5.5) / 5.5</p>
                  <p className="font-semibold text-purple-800 text-[10px] mt-1">Serum Osmolality:</p>
                  <p className="font-mono text-[10px] text-purple-700">= 2 × Na(measured) + BG</p>
                </div>
              </div>
            </Section>

            {/* Monitoring */}
            <Section id="smc-monitoring" title="Monitoring" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-2">
                <ul className="text-muted-foreground space-y-1">
                  <li>• Keep patient <span className="font-semibold text-foreground">NPO</span> in severe acidosis until nausea subsides</li>
                  <li>• Accurate intake & output measurement</li>
                  <li>• <span className="font-semibold text-foreground">Cardiac monitor</span></li>
                  <li>• Blood glucose <span className="font-semibold text-foreground">q 1 hour</span> (glucometer)</li>
                  <li>• Blood glucose, Na, K, Cl, creatinine, serum osmolality & VBG <span className="font-semibold text-foreground">q 4-6 hrs</span> or as indicated</li>
                  <li>• Urine reducing substance & ketones with each voiding</li>
                </ul>
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                  <p className="font-semibold text-red-700 text-[10px]">Cerebral Edema Risk - Monitor Closely:</p>
                  <ul className="text-muted-foreground text-[10px]">
                    <li>• Vital signs</li>
                    <li>• Level of consciousness</li>
                    <li>• Presence of headache</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Fluids - SMC */}
            <Section id="smc-fluids" title="Fluids" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-medium">Fluid of choice: <span className="text-blue-600">0.9 or 0.45 NS</span></p>
                  <p className="text-muted-foreground text-[10px]">Add glucose when BG &lt; 15 mmol/L (&lt;250 mg/dL)</p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">If Normal Blood Pressure (clinically dehydrated, hyperventilating or vomiting):</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border">
                      <thead className="bg-slate-100 dark:bg-slate-800">
                        <tr>
                          <th className="text-left py-1 px-2 border">Child Weight (kg)</th>
                          <th className="text-left py-1 px-2 border">Infusion Rate</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr><td className="py-1 px-2 border">&lt;10 kg</td><td className="py-1 px-2 border">6 mL/kg/hr</td></tr>
                        <tr><td className="py-1 px-2 border">10-19 kg</td><td className="py-1 px-2 border">5 mL/kg/hr</td></tr>
                        <tr><td className="py-1 px-2 border">20-30 kg</td><td className="py-1 px-2 border">3.5 mL/kg/hr</td></tr>
                        <tr><td className="py-1 px-2 border">&gt;30 kg</td><td className="py-1 px-2 border">3 mL/kg/hr (max 250 mL/hr)</td></tr>
                      </tbody>
                    </table>
                  </div>
                  {w > 0 && (
                    <p className="font-mono text-blue-600">
                      → For {w} kg: {Math.min(w * getFluidRateSMC(w), 250).toFixed(0)} mL/hr
                    </p>
                  )}
                </div>

                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                  <p className="font-semibold text-amber-800 text-[10px]">Goal:</p>
                  <p className="text-muted-foreground">Decrease glucose by 3-5 mmol/L/hr</p>
                  <p className="text-[10px] text-amber-700">⚠️ Rapid decrease is associated with increased risk of cerebral edema</p>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                  <p className="font-semibold text-red-700">Resuscitation (Shock):</p>
                  <p className="text-muted-foreground text-[10px]">Hypotension, decreased LOC, or poor perfusion</p>
                  <ul className="text-muted-foreground text-[10px] mt-1 list-disc list-inside">
                    <li>ABC (Airway, Breathing, Circulation)</li>
                    <li>Mini boluses: <span className="font-semibold">10 mL/kg over 10-20 min</span>, reassess and repeat if required</li>
                    <li>When BP normalized, follow weight-based regimen</li>
                  </ul>
                  {w > 0 && <p className="font-mono text-red-600 mt-1">→ Bolus: {(w * 10).toFixed(0)} mL</p>}
                </div>

                <div className="text-[10px] text-muted-foreground">
                  <p>⚠️ Never leave IV unattended or write IV order over 36 hrs</p>
                </div>
              </div>
            </Section>

            {/* Potassium - SMC */}
            <Section id="smc-potassium" title="Potassium" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-2">
                <p className="text-muted-foreground">If the patient voided during the last hour and K⁺ &lt; 5.5 mmol/L:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Add <span className="font-semibold text-foreground">40 mEq/L of KCl</span> to IV fluid</li>
                  <li>Keep K⁺ between <span className="font-semibold text-foreground">4-5 mEq/L</span></li>
                </ul>
                <p className="text-muted-foreground">Otherwise use plain IVF</p>
              </div>
            </Section>

            {/* Insulin - SMC */}
            <Section id="smc-insulin" title="Insulin" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="font-medium text-blue-800">Continuous Insulin Infusion:</p>
                  <p className="text-muted-foreground"><span className="font-semibold">0.1 units/kg/hr</span></p>
                  <p className="text-[10px] text-muted-foreground">(= 1 mL/kg/hr using 25 units Regular in 250 mL NS)</p>
                  {w > 0 && <p className="font-mono text-blue-600 mt-1">→ {(w * 0.1).toFixed(1)} units/hr = {(w * 1).toFixed(0)} mL/hr</p>}
                </div>

                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-semibold">Decrease Insulin When:</p>
                  <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                    <li>pH &gt; 7.30 OR HCO₃ &gt; 15 mmol/L</li>
                  </ul>
                  <p className="font-semibold mt-1">How:</p>
                  <p className="text-muted-foreground text-[10px]">Decrease by 25-50% q 1-2 hr as tolerated to 0.02 U/kg/hr</p>
                  {w > 0 && <p className="font-mono text-gray-600 text-[10px]">→ Min: {(w * 0.02).toFixed(2)} units/hr</p>}
                </div>

                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                  <p className="text-[10px] text-amber-800">
                    <span className="font-semibold">Note:</span> If blood glucose dropping but acidosis not correcting, increase glucose in IV rather than decreasing insulin (change to ½NS + D5% or D10%)
                  </p>
                </div>

                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <p className="font-semibold text-green-800">Start SC Insulin When:</p>
                  <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                    <li>Patient can tolerate oral feeds AND HCO₃ &gt; 15</li>
                  </ul>
                  <p className="font-semibold text-green-800 mt-1">How:</p>
                  <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                    <li>Start 1st dose ½ hr pre-meal</li>
                    <li>D/C insulin infusion 1 hour after SC insulin</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Bicarbonate - SMC */}
            <Section id="smc-bicarbonate" title="Bicarbonate" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-2">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                  <p className="font-semibold text-red-700">Indication: pH &lt; 6.9</p>
                  <p className="text-muted-foreground">Dose: 1-2 mEq/kg over 1 hour</p>
                  {w > 0 && <p className="font-mono text-red-600">→ {(w * 1).toFixed(0)}-{(w * 2).toFixed(0)} mEq</p>}
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="font-semibold text-amber-800 text-[10px]">Watch for Adverse Effects:</p>
                  <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                    <li>Hypokalemia</li>
                    <li>Hypernatremia</li>
                    <li>Worsening CNS status (paradoxical CSF acidosis)</li>
                  </ul>
                </div>
                <p className="text-[10px] text-red-700 font-semibold">⚠️ Always consult endocrinologist before administering bicarbonate</p>
              </div>
            </Section>

            {/* Cerebral Edema - SMC */}
            <Section id="smc-cerebral-edema" title="Cerebral Edema" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                  <p className="font-semibold text-red-700">⚠️ Unpredictable, often fatal, but potentially reversible</p>
                </div>
                
                <div>
                  <p className="font-medium">Risk Factors:</p>
                  <p className="text-muted-foreground">High BUN, hypocapnia, profound acidosis</p>
                </div>

                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="font-semibold text-amber-800">Early Warning Signs:</p>
                  <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                    <li>Headache, irritability, altered behavior</li>
                    <li>Drowsiness, decreasing LOC</li>
                  </ul>
                  <p className="font-semibold text-amber-800 mt-1">Late Signs:</p>
                  <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                    <li>Bradycardia, hypotension</li>
                    <li>Blurred disc margins</li>
                  </ul>
                </div>

                <p className="text-[10px] text-muted-foreground">⚠️ Always exclude hypoglycemia first (similar presentation)</p>

                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-300">
                  <p className="font-bold text-red-800">Management of Cerebral Edema:</p>
                  <ul className="text-[10px] text-muted-foreground mt-1 space-y-1">
                    <li>1. Raise head above level of bed</li>
                    <li>2. Decrease fluid rate to 2 L/M²/day</li>
                    <li>3. <span className="font-semibold text-foreground">Mannitol 0.25-0.5 g/kg IV over 10-15 min</span>
                      {w > 0 && <span className="font-mono text-red-600 ml-1">→ {(w * 0.25).toFixed(1)}-{(w * 0.5).toFixed(1)} g</span>}
                    </li>
                    <li>4. Monitor fluid and LOC extremely closely</li>
                    <li>5. If Na dropped: give <span className="font-semibold">2-4 mL/kg 3% saline</span> over 10-20 min
                      {w > 0 && <span className="font-mono text-red-600 ml-1">→ {(w * 2).toFixed(0)}-{(w * 4).toFixed(0)} mL</span>}
                    </li>
                    <li>6. Decrease insulin to 0.04-0.05 U/kg/hr
                      {w > 0 && <span className="font-mono text-red-600 ml-1">→ {(w * 0.04).toFixed(2)}-{(w * 0.05).toFixed(2)} U/hr</span>}
                    </li>
                    <li>7. Intubation and ventilation if indicated</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Troubleshooting */}
            <Section id="smc-troubleshooting" title="If Acidosis Not Improving (3-4 hrs)" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Check insulin delivery system</li>
                  <li>Consider sepsis</li>
                  <li>Contact endocrinologist on call</li>
                </ul>
              </div>
            </Section>

            {/* References */}
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded text-[9px] text-muted-foreground">
              <p className="font-semibold mb-1">References (SMC Guideline):</p>
              <ul className="space-y-0.5">
                <li>• ESPE/LWPES consensus statement on DKA (Arch Dis Child. 2004)</li>
                <li>• Garcia-De Jesus R. Bol Asoc Med P R. 2008</li>
                <li>• Nelson Textbook of Pediatrics 18th Edition</li>
                <li>• Kingdom of Bahrain Ministry of Health Guidelines (2009)</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DkaApproach;
