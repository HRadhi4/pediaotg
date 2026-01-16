/**
 * IVH (Intraventricular Hemorrhage) Approach
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const IVHApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;

  return (
    <Card data-testid="ivh-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Intraventricular Hemorrhage (IVH)</CardTitle>
        <CardDescription className="text-xs">Germinal Matrix-Intraventricular Hemorrhage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Timing:</strong> 90% occur in first 72 hours of life</li>
            <li><strong>Screening:</strong> HUS at 7-14 days, repeat at 36-40 weeks PMA</li>
            <li><strong>Risk:</strong> Inversely related to gestational age</li>
            <li><strong>Prevention:</strong> Antenatal steroids, delayed cord clamping, gentle handling</li>
          </ul>
        </div>

        {/* Grading */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Papile Grading System</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Grade</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Description</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Prognosis</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1.5 font-bold text-green-600">I</td><td>Germinal matrix only</td><td>~95% normal</td></tr>
              <tr><td className="py-1.5 font-bold text-yellow-600">II</td><td>IVH without ventricular dilation</td><td>~85% normal</td></tr>
              <tr><td className="py-1.5 font-bold text-orange-600">III</td><td>IVH with ventricular dilation</td><td>~50% major disability</td></tr>
              <tr><td className="py-1.5 font-bold text-red-600">IV</td><td>Periventricular hemorrhagic infarction</td><td>~75% major disability</td></tr>
            </tbody>
          </table>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Prenatal:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Prematurity</strong></li>
                <li>No antenatal steroids</li>
                <li>Chorioamnionitis</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Postnatal:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>RDS / mechanical ventilation</li>
                <li>Pneumothorax</li>
                <li>Hypotension / BP fluctuations</li>
                <li>Coagulopathy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention Strategies</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-1">
            <li><strong>Antenatal steroids</strong> - most important</li>
            <li><strong>Delayed cord clamping</strong> (30-60 seconds)</li>
            <li><strong>Gentle handling</strong> - midline head position, minimal stimulation</li>
            <li>Avoid rapid volume expansion</li>
            <li>Avoid hypotension and hypertension</li>
            <li>Correct coagulopathy</li>
            <li>Avoid rapid pCO2 changes</li>
          </ul>
        </div>

        {/* Screening */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Screening Protocol</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1">For all infants &lt;30 weeks or &lt;1500g:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Day 7-14:</strong> Initial screening HUS</li>
              <li><strong>Weekly:</strong> If IVH present or high risk</li>
              <li><strong>36-40 weeks PMA:</strong> Repeat for PVL/cystic changes</li>
            </ul>
          </div>
        </div>

        {/* Post-Hemorrhagic Hydrocephalus */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Post-Hemorrhagic Hydrocephalus (PHH)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1">Monitor for progressive ventriculomegaly:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Serial head circumference</li>
              <li>Weekly HUS if Grade III-IV</li>
              <li>Watch for: bulging fontanelle, sunsetting eyes, apnea</li>
            </ul>
            <p className="font-medium mt-2 mb-1">Treatment options:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Serial LPs or ventricular taps (temporizing)</li>
              <li>Ventricular reservoir/VSGS</li>
              <li>VP shunt (definitive)</li>
            </ul>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Long-Term Outcomes</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1">Neurodevelopmental risk increases with grade:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Grade I-II: Most have normal development</li>
              <li>Grade III: ~35-50% cognitive/motor impairment</li>
              <li>Grade IV (PVHI): ~75% significant disability</li>
              <li>PHH requiring shunt: increased risk</li>
            </ul>
            <p className="mt-2">→ All require close neurodevelopmental follow-up</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default IVHApproach;
