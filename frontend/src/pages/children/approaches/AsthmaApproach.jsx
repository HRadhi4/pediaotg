/**
 * Status Asthmaticus Approach Component
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const AsthmaApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Status Asthmaticus</CardTitle>
        <CardDescription className="text-xs">Asthma failing initial nebulized treatment & steroids</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* High Risk Groups */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
          <p className="font-semibold text-amber-700 dark:text-amber-300">High Risk Groups</p>
          <ul className="mt-1 text-muted-foreground space-y-0.5">
            <li>• Previous PICU admission (with or without intubation)</li>
            <li>• On ≥3 classes of asthma medications</li>
            <li>• Repeated ER/hospitalization</li>
            <li>• Poor compliance</li>
          </ul>
        </div>

        {/* Initial Management */}
        <Section id="asthma-initial" title="Initial Management" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Oxygen</p>
              <p className="text-muted-foreground">Maintain O₂ Sat &gt;90%. Keep NPO</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium">Nebulized Albuterol (Salbutamol)</p>
              <p className="text-muted-foreground">0.15-0.3 mg/kg × 3 doses back-to-back (15-20 min each)</p>
              {w > 0 && (
                <p className="font-mono text-blue-600">→ {Math.max(2.5, Math.min(w * 0.2, 10)).toFixed(1)} mg/dose ({w < 20 ? "2.5 mg" : "5 mg"} simplified)</p>
              )}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Ipratropium Bromide (Atrovent)</p>
              <p className="text-muted-foreground">0.5 mg mixed with albuterol</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-medium">Methylprednisolone IV</p>
              <p className="text-muted-foreground">2 mg/kg load, then 2 mg/kg/day ÷ q6h (max 60 mg/day)</p>
              {w > 0 && <p className="font-mono text-green-600">→ Load: {(w * 2).toFixed(0)} mg, then {Math.min((w * 2 / 4), 15).toFixed(0)} mg q6h</p>}
            </div>
          </div>
        </Section>

        {/* If Failing Initial Treatment */}
        <Section id="asthma-escalation" title="If Failing Initial Treatment" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <p className="text-red-600 font-medium">Notify PICU</p>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium">Continuous Nebulized Albuterol</p>
              <p className="text-muted-foreground">0.5 mg/kg/hr via infusion pump</p>
              {w > 0 && <p className="font-mono text-blue-600">→ {(w * 0.5).toFixed(1)} mg/hr</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Ipratropium</p>
              <p className="text-muted-foreground">0.5 mg q4-6h for 24 hours</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Increase Methylprednisolone</p>
              <p className="text-muted-foreground">4 mg/kg/day ÷ q6h</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-medium">Magnesium Sulfate</p>
              <p className="text-muted-foreground">25-50 mg/kg IV over 30 min (max 2 g)</p>
              {w > 0 && <p className="font-mono text-amber-600">→ {Math.min(w * 40, 2000).toFixed(0)} mg</p>}
              <p className="text-xs text-red-600 mt-1">Monitor for hypotension, apnea</p>
            </div>
          </div>
        </Section>

        {/* IV Beta Agonist */}
        <Section id="asthma-iv" title="IV Beta Agonist Infusions" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Terbutaline</p>
              <p className="text-muted-foreground">Load: 10 mcg/kg over 10 min</p>
              <p className="text-muted-foreground">Infusion: 0.2 mcg/kg/min, ↑ by 0.1-0.2 q30min (max 10 mcg/kg/min)</p>
              {w > 0 && <p className="font-mono text-gray-600">→ Load: {(w * 10).toFixed(0)} mcg, Start: {(w * 0.2).toFixed(1)} mcg/min</p>}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">OR Salbutamol IV</p>
              <p className="text-muted-foreground">Start 1 mcg/kg/min, ↑ by 1 q15min (max 10 mcg/kg/min)</p>
              {w > 0 && <p className="font-mono text-gray-600">→ Start: {w.toFixed(0)} mcg/min</p>}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Monitor: HR, BP, Arrhythmias, Potassium</p>
          </div>
        </Section>

        {/* Intubation */}
        <Section id="asthma-intubation" title="Intubation Indications" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
            <ul className="text-muted-foreground space-y-1">
              <li>• Severe hypoxemia</li>
              <li>• Respiratory arrest</li>
              <li>• Deteriorating consciousness</li>
              <li>• Fatigue with rising CO₂</li>
            </ul>
            <div className="mt-2 border-t border-red-200 pt-2">
              <p className="font-medium text-red-700">RSI Recommendations:</p>
              <p className="text-muted-foreground">Ketamine as induction + Rocuronium</p>
              <p className="text-muted-foreground text-xs">(Avoid morphine, atracurium)</p>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default AsthmaApproach;
