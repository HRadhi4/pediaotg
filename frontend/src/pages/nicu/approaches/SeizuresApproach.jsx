/**
 * Seizures Approach
 * Updated: 2024 Guidelines
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SeizuresApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="seizures-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Seizures</CardTitle>
        <CardDescription className="text-xs">Diagnosis & Management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>EEG confirmation:</strong> Clinical seizures often not electrographic</li>
            <li><strong>HIE:</strong> Most common cause (50-60%)</li>
            <li><strong>Treat underlying cause:</strong> Essential alongside anticonvulsants</li>
            <li><strong>Phenobarbital:</strong> First-line treatment</li>
          </ul>
        </div>

        {/* Seizure Types */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Seizure Types</p>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Subtle (50%)</p>
              <p>• Eye deviation</p>
              <p>• Lip smacking, chewing</p>
              <p>• Cycling movements</p>
              <p>• Apnea</p>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Clonic (25%)</p>
              <p>• Rhythmic jerking</p>
              <p>• Focal or multifocal</p>
              <p>• Cannot be suppressed</p>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Tonic (5%)</p>
              <p>• Sustained posturing</p>
              <p>• Decerebrate/decorticate</p>
              <p>• Often poor prognosis</p>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium mb-1">Myoclonic (20%)</p>
              <p>• Rapid jerks</p>
              <p>• Flexion movements</p>
              <p>• Focal or generalized</p>
            </div>
          </div>
        </div>

        {/* Etiology */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Etiology</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Common:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>HIE (50-60%)</strong></li>
                <li>Intracranial hemorrhage</li>
                <li>Stroke</li>
                <li>Infection (meningitis)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Metabolic:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Hypoglycemia</li>
                <li>Hypocalcemia</li>
                <li>Hypomagnesemia</li>
                <li>Pyridoxine deficiency</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Workup */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Initial Workup</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Immediate:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Glucose (bedside + lab)</li>
              <li>Electrolytes (Na, Ca, Mg)</li>
              <li>Blood gas</li>
              <li>CBC, blood culture</li>
            </ul>
            <p className="font-medium mt-2 mb-1">Further evaluation:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>EEG (continuous if possible)</li>
              <li>Head ultrasound / MRI</li>
              <li>LP (if infection suspected)</li>
              <li>Ammonia, lactate (if metabolic suspected)</li>
            </ul>
          </div>
        </div>

        {/* Treatment Algorithm */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Treatment Algorithm</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Step 0: Correct metabolic causes</p>
              <p>• Glucose if hypoglycemic</p>
              <p>• Calcium gluconate 10%: 2 mL/kg slow IV</p>
              <p>• Magnesium sulfate: 0.2 mL/kg of 50% (if low Mg)</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600">1st Line: Phenobarbital</p>
              <p>• Loading: 20 mg/kg IV over 15-20 min</p>
              <p>• Can repeat 10 mg/kg × 2 (max 40 mg/kg)</p>
              <p>• Maintenance: 3-5 mg/kg/day</p>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  Load: {(w * 20).toFixed(0)} mg | Maintenance: {(w * 3).toFixed(0)}-{(w * 5).toFixed(0)} mg/day
                </p>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-orange-600">2nd Line: Levetiracetam</p>
              <p>• Loading: 40-60 mg/kg IV</p>
              <p>• Maintenance: 10-30 mg/kg q12h</p>
              {w > 0 && (
                <p className="font-mono text-blue-600 mt-1">
                  Load: {(w * 40).toFixed(0)}-{(w * 60).toFixed(0)} mg
                </p>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-red-600">3rd Line: Midazolam or Phenytoin</p>
              <p>• Midazolam: 0.05-0.15 mg/kg bolus, then 0.1-0.4 mg/kg/h</p>
              <p>• Fosphenytoin: 20 mg PE/kg IV</p>
            </div>
          </div>
        </div>

        {/* Pyridoxine Trial */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Pyridoxine Trial</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1">Consider if seizures refractory to standard treatment:</p>
            <p>• Pyridoxine (B6): 100 mg IV during EEG monitoring</p>
            <p>• Watch for apnea (have resuscitation ready)</p>
            <p>• Response suggests pyridoxine-dependent epilepsy</p>
          </div>
        </div>

        {/* Duration of Treatment */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Duration of Treatment</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Acute symptomatic seizures: Consider stopping before discharge if seizure-free and normal EEG</li>
              <li>If neuroimaging abnormal: May need longer treatment</li>
              <li>Wean over 2-4 weeks if continuing</li>
            </ul>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SeizuresApproach;
