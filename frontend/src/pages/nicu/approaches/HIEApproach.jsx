/**
 * HIE (Hypoxic-Ischemic Encephalopathy) Approach
 * Updated: AAP February 2026 Guidelines
 * Therapeutic Hypothermia for Neonatal HIE
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Info, CheckCircle, Thermometer } from "lucide-react";

const HIEApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="hie-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hypoxic-Ischemic Encephalopathy (HIE)</CardTitle>
        <CardDescription className="text-xs">Perinatal Asphyxia - AAP 2026 Updated Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points - AAP 2026 */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Key Points (AAP 2026 Update)
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Therapeutic hypothermia:</strong> Start within <strong>6 hours</strong> of birth</li>
            <li><strong>Target temp:</strong> 33.5°C (92.3°F) core temperature</li>
            <li><strong>Duration:</strong> 72 hours cooling + controlled rewarming</li>
            <li><strong>Eligibility:</strong> ≥36 weeks gestation with moderate-severe HIE</li>
            <li><strong>NOT recommended:</strong> Mild HIE (outside research) or &lt;36 weeks GA</li>
          </ul>
        </div>

        {/* Cooling Eligibility - AAP 2026 */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Cooling Eligibility Criteria (AAP 2026)
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium mb-1 text-green-700 dark:text-green-400">A. Physiological Criteria (meet ANY):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Apgar score ≤5 at 10 minutes</li>
                <li>Need for continued ventilation at 10 minutes</li>
                <li>pH ≤7.0 OR base deficit ≥16 mEq/L (cord or within 1 hour)</li>
                <li>OR pH 7.01-7.15 with acute perinatal event + need for PPV &gt;10 min</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium mb-1 text-green-700 dark:text-green-400">B. Neurological Criteria (meet ANY):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Moderate-severe encephalopathy</strong> on standardized exam</li>
                <li>OR abnormal amplitude-integrated EEG (aEEG)</li>
                <li>OR clinical seizures</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium mb-1 text-green-700 dark:text-green-400">C. Additional Requirements:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Gestational age <strong>≥36 weeks</strong></li>
                <li>Postnatal age <strong>≤6 hours</strong></li>
              </ul>
            </div>
            {ga > 0 && ga < 36 && (
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-300">
                <p className="text-red-700 dark:text-red-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> GA {ga} weeks - Below threshold for cooling
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Late Cooling - New AAP 2026 Guidance */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
          <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Late Initiation of Cooling (AAP 2026)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2">
              When cooling cannot begin within 6 hours, treatment <strong>may still provide modest benefit</strong> 
              if initiated between <strong>6-24 hours</strong> of life.
            </p>
            <p className="text-amber-600 dark:text-amber-400">
              → Individual clinical circumstances should guide this decision
            </p>
          </div>
        </div>

        {/* NOT Recommended */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            NOT Recommended (AAP 2026)
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span><strong>Mild HIE</strong> - therapeutic hypothermia outside of research settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span><strong>Preterm infants &lt;36 weeks</strong> - evidence does not demonstrate benefit</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modified Sarnat Staging */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Modified Sarnat Staging</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600">Finding</th>
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600 text-yellow-600">Mild (I)</th>
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600 text-orange-600">Moderate (II)</th>
                  <th className="text-left py-2 px-2 border border-slate-300 dark:border-slate-600 text-red-600">Severe (III)</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300">
                <tr><td className="py-1.5 px-2 border border-slate-300 dark:border-slate-600 font-medium">Consciousness</td><td className="py-1.5 px-2 border">Hyperalert</td><td className="py-1.5 px-2 border">Lethargic</td><td className="py-1.5 px-2 border">Coma/Stupor</td></tr>
                <tr><td className="py-1.5 px-2 border border-slate-300 dark:border-slate-600 font-medium">Tone</td><td className="py-1.5 px-2 border">Normal</td><td className="py-1.5 px-2 border">Hypotonic</td><td className="py-1.5 px-2 border">Flaccid</td></tr>
                <tr><td className="py-1.5 px-2 border border-slate-300 dark:border-slate-600 font-medium">Posture</td><td className="py-1.5 px-2 border">Normal</td><td className="py-1.5 px-2 border">Flexion</td><td className="py-1.5 px-2 border">Decerebrate</td></tr>
                <tr><td className="py-1.5 px-2 border border-slate-300 dark:border-slate-600 font-medium">Suck</td><td className="py-1.5 px-2 border">Weak</td><td className="py-1.5 px-2 border">Weak/Absent</td><td className="py-1.5 px-2 border">Absent</td></tr>
                <tr><td className="py-1.5 px-2 border border-slate-300 dark:border-slate-600 font-medium">Moro</td><td className="py-1.5 px-2 border">Strong/Low threshold</td><td className="py-1.5 px-2 border">Weak/Incomplete</td><td className="py-1.5 px-2 border">Absent</td></tr>
                <tr><td className="py-1.5 px-2 border border-slate-300 dark:border-slate-600 font-medium">Pupils</td><td className="py-1.5 px-2 border">Mydriasis</td><td className="py-1.5 px-2 border">Miosis</td><td className="py-1.5 px-2 border">Variable/Fixed</td></tr>
                <tr><td className="py-1.5 px-2 border border-slate-300 dark:border-slate-600 font-medium">Respirations</td><td className="py-1.5 px-2 border">Spontaneous</td><td className="py-1.5 px-2 border">Spontaneous</td><td className="py-1.5 px-2 border">Periodic/Apnea</td></tr>
                <tr><td className="py-1.5 px-2 border border-slate-300 dark:border-slate-600 font-medium">Seizures</td><td className="py-1.5 px-2 border">None</td><td className="py-1.5 px-2 border">Common</td><td className="py-1.5 px-2 border">Frequent/Refractory</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            * Cooling indicated for Moderate (II) and Severe (III) HIE only
          </p>
        </div>

        {/* Cooling Protocol */}
        <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border-l-4 border-cyan-500">
          <p className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2 flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Therapeutic Hypothermia Protocol
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-cyan-700 dark:text-cyan-400">Cooling Phase:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Target: <strong>33.5°C (92.3°F)</strong> core temperature (esophageal/rectal)</li>
                <li>• Duration: <strong>72 hours</strong></li>
                <li>• Start within <strong>6 hours</strong> of birth (ideally ASAP)</li>
                <li>• Use servo-controlled cooling device</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-cyan-700 dark:text-cyan-400">Rewarming Phase:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Rate: <strong>0.5°C per hour</strong> (controlled)</li>
                <li>• Duration: ~6-12 hours to reach 36.5-37°C</li>
                <li>• Monitor closely for seizures during rewarming</li>
                <li>• Avoid rebound hyperthermia</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Supportive Care */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Supportive Care During Cooling</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Fluids:</strong> Restrict to 40-60 mL/kg/day initially (risk of SIADH)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Glucose:</strong> Maintain 45-120 mg/dL - avoid hypo- and hyperglycemia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Sedation:</strong> Morphine 10-20 mcg/kg/hr for shivering/discomfort</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Seizures:</strong> Phenobarbital 20 mg/kg loading dose (may repeat 10 mg/kg x2)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Ventilation:</strong> Avoid hypo/hypercarbia, target normal CO2</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Monitoring:</strong> Continuous aEEG, vital signs, core temperature</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Labs:</strong> CBC, coags, LFTs, renal function, lactate, blood gas</span>
              </li>
            </ul>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">Phenobarbital load: {(w * 20).toFixed(0)} mg IV</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">Fluids: {(w * 40).toFixed(0)}-{(w * 60).toFixed(0)} mL/day</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">Morphine: {(w * 0.01).toFixed(2)}-{(w * 0.02).toFixed(2)} mg/hr</p>
              </div>
            )}
          </div>
        </div>

        {/* MRI Timing */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">MRI Timing & Imaging</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Optimal timing:</strong> Day 4-7 of life (after rewarming complete)</li>
              <li>Best for detecting injury pattern and prognosis</li>
              <li>DWI (diffusion) changes visible earlier (may help if clinical course unclear)</li>
              <li>Repeat at 2 weeks if initial MRI equivocal</li>
              <li>MRS (spectroscopy) may provide additional prognostic information</li>
            </ul>
          </div>
        </div>

        {/* System-Level Recommendations - AAP 2026 */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">System-Level Recommendations (AAP 2026)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Hospitals lacking cooling resources should establish relationships with regional cooling centers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Train clinicians to recognize early HIE signs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Develop rapid evaluation protocols for timely transfer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Structured neurodevelopmental follow-up</strong> is crucial for early intervention</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Outcomes - AAP 2026 */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Outcomes with Therapeutic Hypothermia</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2 font-medium text-green-600 dark:text-green-400">
              Evidence shows: More likely to survive with fewer long-term neurodevelopmental impairments
            </p>
            <p className="mb-2"><strong>NNT = 7</strong> (Number needed to treat to prevent one death or disability)</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Mild HIE:</strong> Generally excellent outcomes (even without cooling)</li>
              <li><strong>Moderate HIE:</strong> ~60-70% survive intact with cooling</li>
              <li><strong>Severe HIE:</strong> ~20-30% survive, most with some disability</li>
            </ul>
            <p className="mt-2 text-blue-600 dark:text-blue-400">
              → Close neurodevelopmental follow-up essential for all survivors
            </p>
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: AAP Pediatrics 2026 - Therapeutic Hypothermia for Neonatal HIE, AHA/AAP Neonatal Resuscitation 2025</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default HIEApproach;
