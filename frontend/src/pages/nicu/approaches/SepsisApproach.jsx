/**
 * Neonatal Sepsis Approach
 * Based on AAP 2019 Guidelines & 2024 Updates
 * Reference: AAP EOS Calculator, Surviving Sepsis Campaign
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SepsisApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="sepsis-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Sepsis</CardTitle>
        <CardDescription className="text-xs">Early and Late Onset Sepsis</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: AAP 2019 / Red Book Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* 2024 Key Updates */}
        <div className="p-2 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200">
          <p className="text-xs font-bold text-cyan-700 mb-1">2024 Guideline Updates</p>
          <div className="text-[8px] text-cyan-600 space-y-0.5">
            <p>• <strong>EOS Calculator</strong> (Kaiser) for risk stratification in ≥35 weeks</p>
            <p>• <strong>Serial clinical observation</strong> preferred over empiric antibiotics for well-appearing at-risk neonates</p>
            <p>• <strong>24-hour rule-out</strong>: Safe to discontinue if asymptomatic + negative cultures at 24h</p>
            <p>• <strong>LOS stewardship</strong>: Discontinue by 48h if cultures negative, trending to narrower-spectrum agents</p>
          </div>
        </div>

        {/* Definition */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-xs font-bold text-blue-700 mb-1">Definition</p>
          <p className="text-[9px] text-blue-600">
            SIRS in presence of suspected/proven infection in first 28 days. SIRS criteria: ≥2 of Fever/Hypothermia, Tachycardia, Tachypnea, Leukocytosis/Leukopenia.
          </p>
        </div>

        {/* Classification */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700 text-center">Early Onset (EOS)</p>
            <p className="text-[8px] text-red-600 text-center">&lt;72 hours (cutoff &lt;7 days)</p>
            <div className="text-[7px] text-red-500 mt-1">
              <p><strong>Source:</strong> Maternal genital tract</p>
              <p><strong>Presentation:</strong> Resp distress, pneumonia</p>
            </div>
          </div>
          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-orange-700 text-center">Late Onset (LOS)</p>
            <p className="text-[8px] text-orange-600 text-center">&gt;72 hours</p>
            <div className="text-[7px] text-orange-500 mt-1">
              <p><strong>Source:</strong> Nosocomial/community</p>
              <p><strong>Presentation:</strong> Septicemia, meningitis</p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
            <p className="text-[9px] font-bold text-red-700 mb-1">EOS Risk Factors</p>
            <div className="text-[7px] text-red-600 space-y-0.5">
              <p>• Maternal GBS colonization</p>
              <p>• Chorioamnionitis/Fever</p>
              <p>• PROM &gt;18 hrs</p>
              <p>• Prematurity/LBW</p>
              <p>• Maternal UTI</p>
            </div>
          </div>
          <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
            <p className="text-[9px] font-bold text-orange-700 mb-1">LOS Risk Factors</p>
            <div className="text-[7px] text-orange-600 space-y-0.5">
              <p>• Prolonged central lines</p>
              <p>• Prolonged MV/PN</p>
              <p>• Invasive procedures</p>
              <p>• NEC, PDA, BPD</p>
              <p>• H2 blocker/PPI use</p>
            </div>
          </div>
        </div>

        {/* Organisms */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
          <p className="text-xs font-bold text-purple-700 mb-1">Common Organisms</p>
          <div className="grid grid-cols-2 gap-2 text-[8px]">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-red-600">EOS:</p>
              <p className="text-gray-600">GBS, E. coli, Listeria, Enterococci</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold text-orange-600">LOS:</p>
              <p className="text-gray-600">CoNS, S. aureus, Gram-neg, Candida</p>
            </div>
          </div>
        </div>

        {/* Clinical Signs */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Clinical Signs (Non-specific)</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-amber-600">
            <div className="font-bold">
              <p>• Temperature instability</p>
              <p>• Lethargy/poor cry</p>
              <p>• Poor perfusion/pallor</p>
            </div>
            <div className="font-bold">
              <p>• Brady/tachycardia</p>
              <p>• Apnea/resp distress</p>
              <p>• Refusal to feed</p>
            </div>
            <div className="col-span-2 mt-1">
              <p>• Hypotonia/absent reflexes</p>
              <p>• Hypo/hyperglycemia</p>
              <p>• Metabolic acidosis</p>
            </div>
          </div>
        </div>

        {/* Laboratory Work-up */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Laboratory Work-up</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[7px] min-w-[350px] border-collapse">
              <thead>
                <tr className="bg-teal-200 dark:bg-teal-900/40">
                  <th className="border border-teal-300 p-1 text-left font-semibold">Test</th>
                  <th className="border border-teal-300 p-1 text-left font-semibold">Significant Finding</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-teal-200 p-1 font-medium">CBC with diff</td>
                  <td className="border border-teal-200 p-1">Low WBC/ANC, ↑I:T ratio, Thrombocytopenia</td>
                </tr>
                <tr className="bg-teal-50 dark:bg-teal-950/20">
                  <td className="border border-teal-200 p-1 font-medium">CRP</td>
                  <td className="border border-teal-200 p-1">&gt;1 mg/dL (rises 6-8 hrs after infection)</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-teal-200 p-1 font-medium">Procalcitonin</td>
                  <td className="border border-teal-200 p-1">&gt;10 ng/mL (rises in first 72 hrs normally)</td>
                </tr>
                <tr className="bg-teal-50 dark:bg-teal-950/20">
                  <td className="border border-teal-200 p-1 font-medium">Blood culture</td>
                  <td className="border border-teal-200 p-1">Gold standard - obtain before antibiotics</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-teal-200 p-1 font-medium">LP/CSF</td>
                  <td className="border border-teal-200 p-1">If meningitis suspected, when stable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Antimicrobial Therapy */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">ANTIMICROBIAL THERAPY</p>
          
          {/* EOS */}
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-red-700 text-center">Early Onset Sepsis</p>
            <div className="text-[8px] text-red-600 mt-1">
              <p className="font-bold">First Line:</p>
              <p>Ampicillin + Aminoglycoside (Gentamicin)</p>
              <p className="mt-1 font-bold">If Meningitis:</p>
              <p>Ampicillin + 3rd Gen Cephalosporin (Cefotaxime)</p>
            </div>
          </div>

          {/* LOS */}
          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-orange-700 text-center">Late Onset Sepsis</p>
            <div className="text-[8px] text-orange-600 mt-1">
              <p className="font-bold">First Line:</p>
              <p>Vancomycin + Aminoglycoside + 3rd Gen Ceph</p>
              <p className="mt-1 font-bold">Reserved:</p>
              <p>4th Gen Ceph/Meropenem + Vancomycin</p>
            </div>
          </div>

          {/* Duration */}
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-[9px] font-bold text-gray-700 dark:text-gray-300 text-center">Duration of Therapy</p>
            <div className="grid grid-cols-2 gap-1 text-[7px] text-gray-600 dark:text-gray-400 mt-1">
              <div>• EOS w/o meningitis: 7-10 days</div>
              <div>• LOS w/o meningitis: 10-14 days</div>
              <div>• Meningitis: 14-21 days</div>
              <div>• Gram-neg meningitis: 21 days</div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Important Notes</p>
          <div className="text-[8px] text-red-600 space-y-0.5">
            <p>• Stop antibiotics by 48 hrs if cultures negative & infant asymptomatic</p>
            <p>• <strong>Avoid Ceftriaxone</strong> - competes with bilirubin for albumin binding</p>
            <p>• Low ANC + elevated I:T ratio most predictive for EOS</p>
            <p>• Serial CRP useful for monitoring LOS treatment response</p>
          </div>
        </div>

        {/* Ampicillin Dosing */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-xs font-bold text-blue-700 mb-1">Ampicillin Dosing</p>
          <div className="text-[8px] text-blue-600">
            <p><strong>Sepsis:</strong> 50 mg/kg/dose</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w*50).toFixed(0)} mg/dose</p>}
            <p className="mt-1"><strong>Meningitis:</strong> 100 mg/kg/dose</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w*100).toFixed(0)} mg/dose</p>}
            <p className="mt-1 text-[7px] text-gray-500">Interval: q8-12h based on GA/PNA</p>
          </div>
        </div>

        {/* Gentamicin Dosing */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
          <p className="text-xs font-bold text-green-700 mb-1">Gentamicin Dosing</p>
          <div className="text-[8px] text-green-600">
            <p><strong>Standard:</strong> 4-5 mg/kg/dose</p>
            {w > 0 && <p className="font-mono text-green-600">= {(w*4).toFixed(1)}-{(w*5).toFixed(1)} mg/dose</p>}
            <p className="mt-1 text-[7px] text-gray-500">Interval varies by GA (q24-48h)</p>
            <p className="text-[7px] text-red-500 mt-1">Monitor for ototoxicity and nephrotoxicity</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SepsisApproach;
