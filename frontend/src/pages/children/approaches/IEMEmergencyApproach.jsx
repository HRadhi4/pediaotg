/**
 * Inborn Error of Metabolism (IEM) Emergencies Approach Component
 * Emergency management guidelines for various metabolic disorders
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const IEMEmergencyApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  // Calculate D10% bolus
  const d10Bolus = w > 0 ? (w * 2).toFixed(0) : null;
  
  // Calculate maintenance fluid (1.5-2x)
  const maintenanceFluid = (weight) => {
    if (weight <= 0) return null;
    // Using Holliday-Segar for maintenance, then 1.5-2x
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Inborn Error of Metabolism Emergencies</CardTitle>
        <CardDescription className="text-xs">Emergency management guidelines for IEM crises</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* Overview Table */}
        <Section id="iem-overview" title="Disease Crisis Quick Reference" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] border">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="text-left py-1 px-1 border">Disease</th>
                  <th className="text-center py-1 px-1 border">Crisis</th>
                  <th className="text-center py-1 px-1 border">Blood Gas</th>
                  <th className="text-center py-1 px-1 border">HCO₃</th>
                  <th className="text-center py-1 px-1 border">CPK</th>
                  <th className="text-center py-1 px-1 border">Lactate</th>
                  <th className="text-center py-1 px-1 border">D10%</th>
                  <th className="text-center py-1 px-1 border">Carnitine</th>
                  <th className="text-center py-1 px-1 border">Ammonia</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr>
                  <td className="py-1 px-1 border font-medium">Propionic Acidemia</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-900">
                  <td className="py-1 px-1 border font-medium">MMA</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                </tr>
                <tr>
                  <td className="py-1 px-1 border font-medium">MSUD</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-amber-600">+/-</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-900">
                  <td className="py-1 px-1 border font-medium">VLCAD</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-amber-600">+/-</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                </tr>
                <tr>
                  <td className="py-1 px-1 border font-medium">CPT1</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-amber-600">+/-</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-900">
                  <td className="py-1 px-1 border font-medium">GSD 1</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                </tr>
                <tr>
                  <td className="py-1 px-1 border font-medium">Mitochondrial</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                  <td className="text-center py-1 px-1 border text-green-600">Yes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-900">
                  <td className="py-1 px-1 border font-medium">PKU</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                </tr>
                <tr>
                  <td className="py-1 px-1 border font-medium">Hunter</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
                  <td className="text-center py-1 px-1 border text-red-600">No</td>
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
              <p className="font-semibold text-red-700">Early Warning Signs:</p>
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

        {/* MSUD */}
        <Section id="iem-msud" title="Maple Syrup Urine Disease (MSUD)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs space-y-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="text-muted-foreground">Disorder affecting breakdown of branched chain amino acids (BCAA: Leucine, Isoleucine, Valine)</p>
              <p className="text-muted-foreground mt-1 text-[10px]">Encephalopathy from BCAA accumulation (particularly leucine)</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
              <p className="font-semibold text-amber-800">Note:</p>
              <p className="text-muted-foreground text-[10px]">May have NO hypoglycemia, hyperammonemia, or acidosis!</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-semibold text-green-800">Treatment Aims:</p>
              <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                <li>Inhibit protein catabolism & promote anabolism (high calorie intake)</li>
                <li>Lower BCAA levels by stopping/restricting natural protein</li>
                <li>If insufficient: BCAA can be removed by hemodialysis</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Fatty Acid Oxidation Defects */}
        <Section id="iem-fao" title="Fatty Acid Oxidation Defects" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs space-y-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-800">Examples:</p>
              <p className="text-muted-foreground text-[10px]">CPT1, SCAD, MCAD, LCAD, VLCAD</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-800">Key Features:</p>
              <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                <li><span className="font-semibold text-foreground">Non-ketotic hypoglycemia</span></li>
                <li>Cardiomyopathy (esp. at presentation) - arrange Echo</li>
                <li>Rhabdomyolysis (esp. VLCAD) - may cause myoglobinuria/acute renal failure</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Additional Tests:</p>
              <p className="text-muted-foreground">CPK (especially important)</p>
            </div>
          </div>
        </Section>

        {/* Urea Cycle Defects */}
        <Section id="iem-ucd" title="Urea Cycle Defects" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs space-y-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-800">Enzymes:</p>
              <p className="text-muted-foreground text-[10px]">CPS1, OTC, ASS1, ASL, Arginase, NAGS</p>
              <p className="font-semibold text-blue-800 mt-1">Transporters:</p>
              <p className="text-muted-foreground text-[10px]">ORNT1, Citrin</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
              <p className="font-semibold text-red-700">All cause hyperammonemia → severe neurological complications</p>
              <p className="text-[10px] text-red-600">Treatment is URGENT!</p>
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

            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold text-blue-800">Ammonul (Sodium phenylacetate + benzoate):</p>
              <ul className="text-muted-foreground text-[10px]">
                <li>&lt;20 kg: <span className="font-semibold">2.5 mL/kg</span> bolus over 90 min, then infusion over 24 hrs</li>
                <li>&gt;20 kg: <span className="font-semibold">55 mL/m²</span></li>
              </ul>
              {w > 0 && w < 20 && (
                <p className="font-mono text-blue-600 text-[10px] mt-1">→ {(w * 2.5).toFixed(1)} mL bolus</p>
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

            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-semibold text-green-800">Carbaglu (Carglumic acid):</p>
              <p className="text-[10px] text-muted-foreground">CPS1 activator for NAGS deficiency, CPS1 deficiency, PA, MMA</p>
              <p className="text-muted-foreground text-[10px]">Dose: 100-250 mg/kg/day</p>
              {w > 0 && (
                <p className="font-mono text-green-600 text-[10px] mt-1">→ {(w * 100).toFixed(0)}-{(w * 250).toFixed(0)} mg/day</p>
              )}
            </div>
          </div>
        </Section>

        {/* Dialysis */}
        <Section id="iem-dialysis" title="Dialysis for Hyperammonemia" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs space-y-2">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
              <p className="font-semibold text-red-700">Hemodialysis Indications:</p>
              <ul className="text-muted-foreground text-[10px] list-disc list-inside">
                <li>Ammonia rapidly increasing</li>
                <li>Resistant to drug therapy</li>
                <li>Ammonia persistently &gt;350-400 µmol/L</li>
              </ul>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-semibold text-amber-800">Stop Hemodialysis When:</p>
              <p className="text-muted-foreground text-[10px]">Ammonia &lt;200 µmol/L (little effect below this level)</p>
              <p className="text-[10px] text-amber-700 mt-1">⚠️ Keep catheters in place until ammonia stable for 24 hrs (rebound risk)</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="text-[10px] text-red-600 font-semibold">❌ Exchange transfusion does NOT effectively remove ammonia</p>
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
                <li>7. Treat complications (high uric acid, high lipids)</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Mitochondrial Disorders */}
        <Section id="iem-mito" title="Mitochondrial Disorders" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs space-y-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="text-muted-foreground">Manifest with energy deficiency and variable organ dysfunction</p>
              <p className="text-[10px] text-amber-700 mt-1">Intercurrent infections may trigger deterioration</p>
            </div>
            <div>
              <p className="font-medium mb-1">Additional Tests:</p>
              <p className="text-muted-foreground text-[10px]">Lactate, CPK (in type III)</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
              <p className="font-bold text-green-800">Emergency Plan:</p>
              <ul className="text-muted-foreground text-[10px] mt-1 space-y-1">
                <li>1. D10% bolus: <span className="font-semibold">2 mL/kg</span>
                  {w > 0 && <span className="font-mono text-green-600 ml-1">→ {(w * 2).toFixed(0)} mL</span>}
                </li>
                <li>2. NS bolus: <span className="font-semibold">10-20 mL/kg</span>
                  {w > 0 && <span className="font-mono text-green-600 ml-1">→ {(w * 10).toFixed(0)}-{(w * 20).toFixed(0)} mL</span>}
                </li>
                <li>3. IVF D10% 1.5-2× maintenance</li>
                <li>4. If BG &gt;8 mmol/L: start insulin (DON'T reduce glucose)</li>
                <li>5. Treat acidosis</li>
                <li>6. Correct electrolyte imbalance</li>
                <li>7. Treat infection & complications</li>
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

        {/* No Decompensation Disorders */}
        <Section id="iem-no-crisis" title="Disorders Without Acute Decompensation" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">Amino Acid Disorders:</p>
                <ul className="text-muted-foreground text-[10px]">
                  <li>• Phenylketonuria (PKU)</li>
                  <li>• Tyrosinemia</li>
                  <li>• Homocystinuria</li>
                  <li>• Non-ketotic hyperglycinemia</li>
                </ul>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">Storage Disorders:</p>
                <ul className="text-muted-foreground text-[10px]">
                  <li>• Lysosomal storage diseases</li>
                  <li>• Peroxisomal disorders</li>
                  <li>• Hunter syndrome</li>
                </ul>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">These require treatment of related complications rather than emergency metabolic management</p>
          </div>
        </Section>

        {/* Reference */}
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded text-[9px] text-muted-foreground">
          <p className="font-semibold mb-1">Reference:</p>
          <p>British Inherited Metabolic Diseases Group (BIMDG) Guidelines</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default IEMEmergencyApproach;
