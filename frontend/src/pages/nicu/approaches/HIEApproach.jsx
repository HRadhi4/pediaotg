/**
 * HIE (Hypoxic-Ischemic Encephalopathy) Approach
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HIEApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="hie-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hypoxic-Ischemic Encephalopathy (HIE)</CardTitle>
        <CardDescription className="text-xs">Perinatal Asphyxia Management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Therapeutic hypothermia:</strong> Start within 6 hours of birth</li>
            <li><strong>Target temp:</strong> 33.5°C (whole body) or 34-35°C (head)</li>
            <li><strong>Duration:</strong> 72 hours cooling + slow rewarming</li>
            <li><strong>Eligibility:</strong> ≥36 weeks, meets criteria</li>
          </ul>
        </div>

        {/* Cooling Criteria */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Cooling Eligibility Criteria</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">A. Evidence of Perinatal Asphyxia (ALL):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>GA ≥36 weeks and age ≤6 hours</li>
                <li>pH ≤7.0 OR base deficit ≥16 (cord or first hour)</li>
                <li>OR pH 7.01-7.15 with acute perinatal event + need for PPV &gt;10 min OR Apgar ≤5 at 10 min</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">B. Evidence of Encephalopathy (ANY):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Moderate-severe encephalopathy on exam</li>
                <li>OR abnormal aEEG</li>
                <li>OR clinical seizures</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sarnat Staging */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Modified Sarnat Staging</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Finding</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Mild (I)</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Moderate (II)</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Severe (III)</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">Level of consciousness</td><td>Hyperalert</td><td>Lethargic</td><td>Coma</td></tr>
              <tr><td className="py-1">Tone</td><td>Normal</td><td>Hypotonic</td><td>Flaccid</td></tr>
              <tr><td className="py-1">Suck</td><td>Weak</td><td>Weak/absent</td><td>Absent</td></tr>
              <tr><td className="py-1">Moro</td><td>Strong</td><td>Weak</td><td>Absent</td></tr>
              <tr><td className="py-1">Pupils</td><td>Mydriasis</td><td>Miosis</td><td>Variable/fixed</td></tr>
              <tr><td className="py-1">Seizures</td><td>None</td><td>Common</td><td>Frequent</td></tr>
            </tbody>
          </table>
        </div>

        {/* Cooling Protocol */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Therapeutic Hypothermia Protocol</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Cooling phase:</p>
              <p>• Target: 33-34°C (esophageal/rectal)</p>
              <p>• Duration: 72 hours</p>
              <p>• Start within 6 hours of birth</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Rewarming:</p>
              <p>• Slow: 0.5°C per hour</p>
              <p>• Takes ~6-12 hours to reach 36.5°C</p>
              <p>• Watch for seizures during rewarming</p>
            </div>
          </div>
        </div>

        {/* Supportive Care */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Supportive Care During Cooling</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Fluids:</strong> Restrict to 40-60 mL/kg/day initially</li>
              <li><strong>Glucose:</strong> Avoid hypo- and hyperglycemia</li>
              <li><strong>Sedation:</strong> Morphine for shivering/discomfort</li>
              <li><strong>Seizures:</strong> Treat with phenobarbital (20 mg/kg load)</li>
              <li><strong>Ventilation:</strong> Avoid hypo/hypercarbia</li>
              <li><strong>aEEG:</strong> Continuous monitoring</li>
            </ul>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p>Phenobarb load: <span className="font-mono text-blue-600">{(w * 20).toFixed(0)} mg</span></p>
                <p>Fluids: <span className="font-mono text-blue-600">{(w * 40).toFixed(0)}-{(w * 60).toFixed(0)} mL/day</span></p>
              </div>
            )}
          </div>
        </div>

        {/* MRI Timing */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">MRI Timing</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>• Optimal: Day 4-7 of life (after rewarming)</p>
            <p>• Best for detecting injury pattern and prognosis</p>
            <p>• DWI changes may be visible earlier</p>
            <p>• Repeat at 2 weeks if initial unclear</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1">With therapeutic hypothermia:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Mild HIE: Excellent outcomes</li>
              <li>Moderate HIE: ~60-70% survive intact</li>
              <li>Severe HIE: ~20-30% survive, most with disability</li>
            </ul>
            <p className="mt-2">→ Close neurodevelopmental follow-up essential</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HIEApproach;
