/**
 * HIE (Hypoxic-Ischemic Encephalopathy) Approach
 * Updated: AAP 2026 Guidelines
 * Design: Standardized to match HypoglycemiaApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HIEApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="hie-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hypoxic-Ischemic Encephalopathy (HIE)</CardTitle>
        <CardDescription className="text-xs">AAP 2026 Therapeutic Hypothermia Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points (AAP 2026)</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Cooling:</strong> Start within <strong>6 hours</strong> of birth</li>
            <li><strong>Target temp:</strong> 33.5°C (92.3°F) core temperature</li>
            <li><strong>Duration:</strong> 72 hours + controlled rewarming</li>
            <li><strong>Eligibility:</strong> ≥36 weeks GA with moderate-severe HIE</li>
            <li><strong>NOT recommended:</strong> Mild HIE or &lt;36 weeks GA</li>
          </ul>
        </div>

        {/* Cooling Eligibility */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Cooling Eligibility (AAP 2026)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">A. Physiological (meet ANY):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Apgar ≤5 at 10 minutes</li>
                <li>Continued ventilation at 10 minutes</li>
                <li>pH ≤7.0 OR base deficit ≥16 mEq/L</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">B. Neurological (meet ANY):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Moderate-severe encephalopathy</strong></li>
                <li>Abnormal aEEG</li>
                <li>Clinical seizures</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">C. Requirements:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>GA <strong>≥36 weeks</strong></li>
                <li>Postnatal age <strong>≤6 hours</strong></li>
              </ul>
            </div>
            {ga > 0 && ga < 36 && (
              <p className="text-red-600 dark:text-red-400 font-medium p-2 bg-red-50 dark:bg-red-900/20 rounded">
                ⚠️ GA {ga} weeks - Below threshold for cooling
              </p>
            )}
          </div>
        </div>

        {/* Late Cooling */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Late Initiation (AAP 2026)</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            If cooling cannot begin within 6 hours, treatment <strong>may still provide modest benefit</strong> 
            if initiated between <strong>6-24 hours</strong> of life.
          </p>
        </div>

        {/* NOT Recommended */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">NOT Recommended</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <li><strong>✗ Mild HIE</strong> - outside of research settings</li>
            <li><strong>✗ Preterm &lt;36 weeks</strong> - evidence does not demonstrate benefit</li>
          </ul>
        </div>

        {/* Sarnat Staging */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Modified Sarnat Staging</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Finding</th>
                  <th className="text-left py-1 text-yellow-600">Mild (I)</th>
                  <th className="text-left py-1 text-orange-600">Moderate (II)</th>
                  <th className="text-left py-1 text-red-600">Severe (III)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1 font-medium">Consciousness</td><td className="py-1">Hyperalert</td><td className="py-1">Lethargic</td><td className="py-1">Coma</td></tr>
                <tr><td className="py-1 font-medium">Tone</td><td className="py-1">Normal</td><td className="py-1">Hypotonic</td><td className="py-1">Flaccid</td></tr>
                <tr><td className="py-1 font-medium">Suck</td><td className="py-1">Weak</td><td className="py-1">Weak/Absent</td><td className="py-1">Absent</td></tr>
                <tr><td className="py-1 font-medium">Moro</td><td className="py-1">Strong</td><td className="py-1">Weak</td><td className="py-1">Absent</td></tr>
                <tr><td className="py-1 font-medium">Pupils</td><td className="py-1">Mydriasis</td><td className="py-1">Miosis</td><td className="py-1">Variable/Fixed</td></tr>
                <tr><td className="py-1 font-medium">Seizures</td><td className="py-1">None</td><td className="py-1">Common</td><td className="py-1">Frequent</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Cooling indicated for Moderate (II) and Severe (III) only</p>
        </div>

        {/* Cooling Protocol */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Therapeutic Hypothermia Protocol</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Cooling Phase:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Target: <strong>33.5°C</strong> core temperature</li>
                <li>Duration: <strong>72 hours</strong></li>
                <li>Start within 6 hours of birth</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Rewarming:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Rate: <strong>0.5°C per hour</strong></li>
                <li>Duration: ~6-12 hours to reach 36.5-37°C</li>
                <li>Monitor for seizures during rewarming</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Supportive Care */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Supportive Care</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Fluids:</strong> Restrict to 40-60 mL/kg/day (SIADH risk)</li>
              <li><strong>Glucose:</strong> Maintain 45-120 mg/dL</li>
              <li><strong>Sedation:</strong> Morphine 10-20 mcg/kg/hr for shivering</li>
              <li><strong>Seizures:</strong> Phenobarbital 20 mg/kg loading</li>
              <li><strong>Monitoring:</strong> Continuous aEEG, core temp</li>
            </ul>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p className="font-mono text-blue-600">Phenobarbital: {(w * 20).toFixed(0)} mg IV</p>
                <p className="font-mono text-blue-600">Fluids: {(w * 40).toFixed(0)}-{(w * 60).toFixed(0)} mL/day</p>
              </div>
            )}
          </div>
        </div>

        {/* MRI */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">MRI Timing</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li><strong>Optimal:</strong> Day 4-7 (after rewarming)</li>
            <li>DWI changes visible earlier</li>
            <li>Repeat at 2 weeks if initial equivocal</li>
          </ul>
        </div>

        {/* Outcomes */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Outcomes</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="text-green-600 dark:text-green-400 font-medium mb-1">
              NNT = 7 (Number needed to treat to prevent one death or disability)
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Mild HIE:</strong> Excellent outcomes</li>
              <li><strong>Moderate HIE:</strong> ~60-70% survive intact with cooling</li>
              <li><strong>Severe HIE:</strong> ~20-30% survive</li>
            </ul>
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: AAP Pediatrics 2026, AHA/AAP Neonatal Resuscitation 2025</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default HIEApproach;
