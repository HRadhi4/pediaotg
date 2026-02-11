/**
 * Inborn Error of Metabolism (IEM) Emergencies Approach Component
 * Emergency management guidelines for various metabolic disorders
 * Toggle between SMC Guideline and UpToDate content
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Section from "./Section";

const IEMEmergencyApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;
  const [useUpToDate, setUseUpToDate] = useState(false);

  // Calculate D10% bolus
  const d10Bolus = w > 0 ? (w * 2).toFixed(0) : null;
  
  // Calculate maintenance fluid (1.5-2x)
  const maintenanceFluid = (weight) => {
    if (weight <= 0) return null;
    let maintenance;
    if (weight <= 10) {
      maintenance = weight * 100;
    } else if (weight <= 20) {
      maintenance = 1000 + (weight - 10) * 50;
    } else {
      maintenance = 1500 + (weight - 20) * 20;
    }
    return {
      low: (maintenance * 1.5 / 24).toFixed(0),
      high: (maintenance * 2 / 24).toFixed(0)
    };
  };

  const fluidRates = maintenanceFluid(w);

  return (
    <Card data-testid="iem-emergency-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Inborn Error of Metabolism Emergencies</CardTitle>
        <CardDescription className="text-xs">Emergency management guidelines for IEM crises</CardDescription>
        
        {/* Guideline Toggle */}
        <div className="flex items-center justify-between mt-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <span className={`text-xs font-medium ${!useUpToDate ? 'text-blue-600' : 'text-muted-foreground'}`}>
            SMC Guideline
          </span>
          <div className="flex items-center gap-2">
            <Switch
              id="iem-guideline-switch"
              checked={useUpToDate}
              onCheckedChange={setUseUpToDate}
              data-testid="iem-guideline-switch"
            />
            <Label htmlFor="iem-guideline-switch" className="sr-only">Switch Guideline</Label>
          </div>
          <span className={`text-xs font-medium ${useUpToDate ? 'text-green-600' : 'text-muted-foreground'}`}>
            UpToDate
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {!useUpToDate ? (
          /* SMC Guideline Content */
          <>
            {/* Overview Table */}
            <Section id="iem-overview" title="Disease Crisis Quick Reference" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto border rounded-lg">
                <table className="w-full text-[10px] border-collapse min-w-[600px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                    <tr>
                      <th className="text-left py-2 px-2 border font-semibold whitespace-nowrap">Disease</th>
                      <th className="text-center py-2 px-2 border font-semibold whitespace-nowrap">Crisis</th>
                      <th className="text-center py-2 px-2 border font-semibold whitespace-nowrap">Blood Gas</th>
                      <th className="text-center py-2 px-2 border font-semibold whitespace-nowrap">HCO₃</th>
                      <th className="text-center py-2 px-2 border font-semibold whitespace-nowrap">CPK</th>
                      <th className="text-center py-2 px-2 border font-semibold whitespace-nowrap">Lactate</th>
                      <th className="text-center py-2 px-2 border font-semibold whitespace-nowrap">D10%</th>
                      <th className="text-center py-2 px-2 border font-semibold whitespace-nowrap">Carnitine</th>
                      <th className="text-center py-2 px-2 border font-semibold whitespace-nowrap">Ammonia</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="py-2 px-2 border font-medium whitespace-nowrap">Propionic Acidemia</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <td className="py-2 px-2 border font-medium whitespace-nowrap">MMA</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 border font-medium whitespace-nowrap">MSUD</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-amber-600">+/-</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <td className="py-2 px-2 border font-medium whitespace-nowrap">VLCAD</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-amber-600">+/-</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 border font-medium whitespace-nowrap">CPT1</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-amber-600">+/-</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <td className="py-2 px-2 border font-medium whitespace-nowrap">GSD 1</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 border font-medium whitespace-nowrap">Mitochondrial</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                      <td className="text-center py-2 px-2 border text-green-600">Yes</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <td className="py-2 px-2 border font-medium whitespace-nowrap">PKU</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 border font-medium whitespace-nowrap">Hunter</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                      <td className="text-center py-2 px-2 border text-red-600">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[9px] text-muted-foreground mt-2">MMA = Methylmalonic Acidemia, MSUD = Maple Syrup Urine Disease, VLCAD = Very Long Chain Acyl-CoA Dehydrogenase, CPT1 = Carnitine Palmitoyltransferase 1, GSD = Glycogen Storage Disease</p>
            </Section>

            {/* Emergency Regimen Principles */}
            <Section id="iem-emergency-principles" title="Emergency Regimen Principles" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-2">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="font-semibold text-amber-800">Metabolic Stress Triggers:</p>
                  <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                    <li>Infection</li>
                    <li>Fasting</li>
                    <li>Dietary disturbance</li>
                    <li>Exercise</li>
                    <li>Constipation</li>
                    <li>Vomiting and diarrhea (potent cause!)</li>
                  </ul>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                  <p className="font-semibold text-red-700 text-[10px]">Early Warning Signs:</p>
                  <ul className="text-muted-foreground text-[10px]">
                    <li>• Exacerbation of pre-existing neurological problems</li>
                    <li>• Slight unsteadiness</li>
                    <li>• Appetite worse than usual</li>
                    <li>• "Just not right"</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Initial Management */}
            <Section id="iem-initial" title="Initial Plan & Management" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-2">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                  <p className="font-semibold text-red-700">If shocked or very ill → PICU admission</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Initial Tests:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                      <li>pH and blood gases</li>
                      <li>U & E</li>
                      <li>Full blood count</li>
                      <li>Ammonia</li>
                    </ul>
                    <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                      <li>Blood culture</li>
                      <li>LFT</li>
                      <li>Glucose</li>
                      <li>Lactate</li>
                      <li>Urine ketones</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Section>

            {/* Organic Acid Disorders */}
            <Section id="iem-organic-acid" title="Organic Acid Disorders" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="font-semibold text-blue-800">Examples:</p>
                  <p className="text-muted-foreground text-[10px]">Propionic acidemia, Methylmalonic acidemia, Isovaleric acidemia, Biotin disorders, Glutaric aciduria</p>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="font-semibold text-amber-800">Presentation:</p>
                  <p className="text-muted-foreground">High anion gap metabolic acidosis + high ammonia + encephalopathy</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
                  <p className="font-bold text-green-800">Treatment Plan:</p>
                  <ul className="text-muted-foreground text-[10px] mt-1 space-y-1">
                    <li>1. <span className="font-semibold">IVF D10%</span> 1.5-2× maintenance
                      {fluidRates && <span className="font-mono text-green-600 ml-1">→ {fluidRates.low}-{fluidRates.high} mL/hr</span>}
                    </li>
                    <li className="text-[9px] text-muted-foreground ml-4">If hyperglycemia: start insulin but DON'T stop D10%</li>
                    <li>2. <span className="font-semibold">Carnitine IV</span>: bolus 100 mg/kg then 200-300 mg/kg/day
                      {w > 0 && <span className="font-mono text-green-600 ml-1">→ Bolus: {(w * 100).toFixed(0)} mg</span>}
                    </li>
                    <li>3. Treat hyperammonemia</li>
                    <li>4. Treat acidosis</li>
                    <li>5. Treat constipation</li>
                    <li>6. Treat infection</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Hyperammonemia Management */}
            <Section id="iem-hyperammonemia" title="Hyperammonemia Management" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-bold text-red-700 text-center">Ammonia &gt; 400</p>
                    <ul className="text-muted-foreground text-[10px] mt-1">
                      <li>• Hemodialysis (CAVHD/CVVHD)</li>
                      <li>• Peritoneal dialysis (if HD not feasible)</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                    <p className="font-bold text-amber-700 text-center">Ammonia &lt; 400</p>
                    <ul className="text-muted-foreground text-[10px] mt-1">
                      <li>• Reduce protein catabolism</li>
                      <li>• Nitrogen scavenger therapy</li>
                    </ul>
                  </div>
                </div>

                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <p className="font-semibold text-purple-800">Nitrogen Scavenger Therapy:</p>
                  <div className="text-[10px] text-muted-foreground mt-1 space-y-1">
                    <p><span className="font-semibold">Sodium phenylacetate:</span> conjugates with glutamine → phenylacetylglutamine (2 mol N)</p>
                    <p><span className="font-semibold">Sodium benzoate:</span> conjugates with glycine → hippuric acid (1 mol N)</p>
                    <p><span className="font-semibold">Sodium phenylbutyrate:</span> same as phenylacetate (PO)</p>
                  </div>
                </div>

                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
                  <p className="font-semibold text-green-800">Dosing:</p>
                  <p className="text-muted-foreground text-[10px]">250-500 mg/kg bolus over 90 min, then 250 mg/kg/24hr q6-8hr</p>
                  {w > 0 && (
                    <div className="font-mono text-green-600 text-[10px] mt-1">
                      <p>→ Bolus: {(w * 250).toFixed(0)}-{(w * 500).toFixed(0)} mg over 90 min</p>
                      <p>→ Maintenance: {(w * 250).toFixed(0)} mg/24hr</p>
                    </div>
                  )}
                </div>

                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                  <p className="font-semibold text-amber-800">Arginine:</p>
                  <p className="text-[10px] text-muted-foreground">Necessary for all UCDs <span className="text-red-600 font-semibold">EXCEPT arginase deficiency</span></p>
                  <p className="text-muted-foreground text-[10px] mt-1">250-500 mg/kg bolus over 2 hrs, then 250 mg/kg/day q6-8hr</p>
                  {w > 0 && (
                    <p className="font-mono text-amber-600 text-[10px] mt-1">→ Bolus: {(w * 250).toFixed(0)}-{(w * 500).toFixed(0)} mg</p>
                  )}
                </div>
              </div>
            </Section>

            {/* GSD Emergency */}
            <Section id="iem-gsd" title="Glycogen Storage Disease Emergency" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="font-semibold text-blue-800">Types:</p>
                  <p className="text-muted-foreground text-[10px]">I (von Gierke), II (Pompe), III (Forbes), IV (Anderson), V-IX</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
                  <p className="font-bold text-green-800">Emergency Plan:</p>
                  <ul className="text-muted-foreground text-[10px] mt-1 space-y-1">
                    <li>1. D10% bolus: <span className="font-semibold">2 mL/kg</span>
                      {w > 0 && <span className="font-mono text-green-600 ml-1">→ {(w * 2).toFixed(0)} mL</span>}
                    </li>
                    <li>2. IVF D10% 1.5-2× maintenance
                      {fluidRates && <span className="font-mono text-green-600 ml-1">→ {fluidRates.low}-{fluidRates.high} mL/hr</span>}
                    </li>
                    <li>3. If BG &gt;8 mmol/L: start insulin (DON'T reduce glucose)</li>
                    <li>4. Treat acidosis</li>
                    <li>5. Correct electrolyte imbalance</li>
                    <li>6. Treat infection</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Acidosis Management */}
            <Section id="iem-acidosis" title="Acidosis Management" expandedSections={expandedSections} toggleSection={toggleSection}>
              <div className="text-xs space-y-2">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                  <p className="font-semibold text-red-700">Severe Acidosis (pH &lt;7.2 or base deficit &gt;10):</p>
                  <p className="text-muted-foreground text-[10px]">Potentially very dangerous - difficult to resuscitate after arrest</p>
                  <p className="text-[10px] text-red-600 font-semibold mt-1">⚠️ Always consider elective assisted ventilation</p>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="font-semibold text-amber-800">Sodium Bicarbonate:</p>
                  <ul className="text-muted-foreground text-[10px]">
                    <li>Bolus: <span className="font-semibold">1-2 mEq/kg</span> (up to 2 times)
                      {w > 0 && <span className="font-mono text-amber-600 ml-1">→ {(w * 1).toFixed(0)}-{(w * 2).toFixed(0)} mEq</span>}
                    </li>
                    <li>If HCO₃ &lt;15: consider infusion</li>
                    <li>If HCO₃ &gt;15: <span className="font-semibold">6 mEq/kg/day</span> q6hr
                      {w > 0 && <span className="font-mono text-amber-600 ml-1">→ {(w * 6).toFixed(0)} mEq/day</span>}
                    </li>
                  </ul>
                </div>
              </div>
            </Section>
          </>
        ) : (
          /* UpToDate Content (Metabolic Emergencies) */
          <>
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
              id="uptodate-clinicalPresentation"
              title="Clinical Presentations"
              defaultOpen={true}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
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

            {/* Initial Laboratory Evaluation */}
            <Section
              id="uptodate-initialLabs"
              title="Initial Laboratory Evaluation"
              defaultOpen={true}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
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

            {/* Distinguishing IEM by Labs */}
            <Section
              id="uptodate-distinguishingLabs"
              title="Distinguishing IEM by Lab Findings"
              defaultOpen={true}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
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
                    Hypoketotic hypoglycemia → Think Fatty Acid Oxidation Disorders (MCAD, VLCAD)
                  </p>
                </div>
              </div>
            </Section>

            {/* Hyperammonemia Management - UpToDate */}
            <Section
              id="uptodate-hyperammonemia"
              title="Hyperammonemia - EMERGENCY Management"
              defaultOpen={true}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
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
              id="uptodate-hypoglycemia"
              title="Hypoglycemia in IEM"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
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

            {/* Seizures in IEM - Cofactor Trials */}
            <Section
              id="uptodate-seizures"
              title="Seizures in IEM - Cofactor Trials"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
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

            {/* Immediate Management Summary */}
            <Section
              id="uptodate-management"
              title="Immediate Management Summary"
              defaultOpen={true}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
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
                      <li>Add insulin if glucose &gt;180 mg/dL (&gt;10 mmol/L) (target 100-120 mg/dL [5.6-6.7 mmol/L])</li>
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

            {/* Reference */}
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded text-[9px] text-muted-foreground">
              <p className="font-semibold mb-1">Reference:</p>
              <p>UpToDate - Inborn Errors of Metabolism, AAP Guidelines</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IEMEmergencyApproach;
