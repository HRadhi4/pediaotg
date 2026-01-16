/**
 * Hypoxic Ischemic Encephalopathy (HIE) Approach
 * Based on NICHD/AAP Guidelines 2024
 * Reference: NEJM, Pediatrics, Cochrane Reviews
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HIEApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="hie-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hypoxic Ischemic Encephalopathy (HIE)</CardTitle>
        <CardDescription className="text-xs">Therapeutic Hypothermia Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Updates */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Current Evidence (2024)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Standard of care:</strong> TH for moderate-severe HIE in ≥36 weeks</li>
            <li><strong>Preterm (33-35 wks):</strong> NOT recommended - NICHD trial showed harm</li>
            <li><strong>Mild HIE:</strong> Insufficient evidence - clinical trial enrollment preferred</li>
            <li><strong>Timing:</strong> Initiate within 6 hours; consider up to 24h in select cases</li>
          </ul>
        </div>

        {/* Criteria for Perinatal Asphyxia */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Criteria for Diagnosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-medium">All of the following:</p>
            <ul className="list-disc pl-4">
              <li>Umbilical cord/early blood pH ≤7.0 or base deficit ≥16</li>
              <li>Apgar ≤5 at 5 and 10 minutes</li>
              <li>Need for resuscitation at 10 minutes</li>
              <li>Evidence of encephalopathy</li>
            </ul>
          </div>
        </div>

        {/* Sarnat Staging */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Modified Sarnat Staging</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Feature</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Stage I (Mild)</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Stage II (Moderate)</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Stage III (Severe)</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">Consciousness</td><td>Hyperalert</td><td>Lethargic</td><td>Coma</td></tr>
              <tr><td className="py-1">Tone</td><td>Normal/increased</td><td>Hypotonia</td><td>Flaccid</td></tr>
              <tr><td className="py-1">Reflexes</td><td>Exaggerated</td><td>Decreased</td><td>Absent</td></tr>
              <tr><td className="py-1">Pupils</td><td>Dilated</td><td>Constricted</td><td>Variable/fixed</td></tr>
              <tr><td className="py-1">Seizures</td><td>None</td><td>Common</td><td>Uncommon</td></tr>
              <tr><td className="py-1 font-medium">Prognosis</td><td>Good</td><td>Variable (20-40% adverse)</td><td>Poor</td></tr>
            </tbody>
          </table>
        </div>

        {/* TH Criteria */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Therapeutic Hypothermia Criteria</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Inclusion (ALL required):</p>
              <ul className="list-disc pl-4">
                <li>GA ≥36 weeks</li>
                <li>Age ≤6 hours</li>
                <li>Evidence of perinatal hypoxia-ischemia</li>
                <li>Moderate or severe encephalopathy (Sarnat II-III)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">Exclusions:</p>
              <ul className="list-disc pl-4">
                <li>Major congenital anomalies</li>
                <li>Severe IUGR (&lt;1800g)</li>
                <li>Moribund infant</li>
                <li>Uncontrolled coagulopathy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TH Protocol */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Cooling Protocol</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Target:</strong> 33.5°C ± 0.5°C (rectal/esophageal)</p>
            <p><strong>Duration:</strong> 72 hours</p>
            <p><strong>Method:</strong> Whole body cooling (servo-controlled)</p>
            <p><strong>Rewarming:</strong> 0.5°C per hour over 6+ hours</p>
            <p className="mt-2 font-medium">Monitoring during TH:</p>
            <ul className="list-disc pl-4">
              <li>Continuous temperature, HR, BP, SpO2</li>
              <li>aEEG/EEG monitoring</li>
              <li>Labs: glucose, coags, blood gas, electrolytes</li>
            </ul>
          </div>
        </div>

        {/* Seizure Management */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Seizure Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium">First-line: Phenobarbital</p>
              <p>Loading: 20 mg/kg IV over 20 min</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 20).toFixed(0)} mg</p>}
              <p>Additional: 10 mg/kg × 2 if needed (max total 40 mg/kg)</p>
            </div>
            
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium">Second-line: Levetiracetam</p>
              <p>Loading: 40-60 mg/kg IV</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 40).toFixed(0)} - {(w * 60).toFixed(0)} mg</p>}
            </div>
            
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium">Third-line: Fosphenytoin</p>
              <p>Loading: 20 mg PE/kg IV</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 20).toFixed(0)} mg PE</p>}
            </div>
          </div>
        </div>

        {/* Supportive Care */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Supportive Care</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Fluids:</strong> Restrict to 60-80 mL/kg/day (SIADH risk)</p>
            <p><strong>Glucose:</strong> Maintain 45-150 mg/dL (avoid hypo/hyperglycemia)</p>
            <p><strong>Ventilation:</strong> Avoid hyperoxia and hyperventilation</p>
            <p><strong>BP:</strong> Support with volume/inotropes as needed</p>
            <p><strong>Nutrition:</strong> NPO during cooling; trophic feeds during rewarming</p>
          </div>
        </div>

        {/* MRI Timing */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Brain MRI</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Optimal timing:</strong> Day 4-7 of life (after rewarming)</p>
            <p><strong>Sequences:</strong> T1, T2, DWI, MRS if available</p>
            <p><strong>Prognostic patterns:</strong></p>
            <ul className="list-disc pl-4">
              <li>Basal ganglia/thalamus injury → motor impairment</li>
              <li>Watershed injury → cognitive impairment</li>
              <li>Global injury → severe disability</li>
            </ul>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HIEApproach;
