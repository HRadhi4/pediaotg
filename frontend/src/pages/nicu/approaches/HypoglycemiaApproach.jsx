/**
 * Neonatal Hypoglycemia Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HypoglycemiaApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Hypoglycemia</CardTitle>
        <CardDescription className="text-xs">Screening, diagnosis and management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-xs font-bold text-blue-700 mb-1">Definition & Normal Transition</p>
          <div className="text-[9px] text-blue-600 space-y-1">
            <p>Plasma glucose (PG) low enough to cause symptoms/signs of impaired brain function.</p>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded mt-1">
              <p className="font-bold">Normal Transition:</p>
              <p>• Falls to 30 mg/dL in first 1-2 hrs</p>
              <p>• Rises to &gt;45 mg/dL by 3-4 hrs</p>
              <p>• Stabilizes at &gt;70 mg/dL after 48 hrs</p>
            </div>
          </div>
        </div>

        {/* Risk Groups */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">At-Risk Groups (SCREEN)</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• LGA (Large for GA)</div>
            <div>• SGA (Small for GA)</div>
            <div>• IDM (Infant of Diabetic Mom)</div>
            <div>• Late preterm (34-36⁶/₇ wks)</div>
            <div>• Perinatal stress/asphyxia</div>
            <div>• Hypothermia</div>
            <div>• Polycythemia</div>
            <div>• MAS, Erythroblastosis</div>
            <div className="col-span-2">• Beckwith-Wiedemann syndrome</div>
          </div>
        </div>

        {/* Clinical Signs */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Clinical Signs</p>
          <p className="text-[8px] text-amber-600 mb-1 italic">Many infants are asymptomatic!</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-amber-600">
            <div className="p-1 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Neuroglycopenic:</p>
              <p>• Lethargy, Hypotonia</p>
              <p>• Poor feeding</p>
              <p>• Seizures</p>
              <p>• Apnea, Cyanosis</p>
            </div>
            <div className="p-1 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Adrenergic:</p>
              <p>• Irritability, Tremors</p>
              <p>• Jitteriness</p>
              <p>• Exaggerated Moro</p>
              <p>• High-pitched cry</p>
            </div>
          </div>
        </div>

        {/* Screening Protocol */}
        <div className="p-2 bg-gradient-to-b from-teal-50 to-gray-50 dark:from-teal-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-teal-700 mb-2">SCREENING PROTOCOL</p>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
              <p className="text-[9px] font-bold text-orange-700 text-center">Late Preterm / SGA</p>
              <div className="text-[7px] text-orange-600 mt-1">
                <p>• Screen before feeds q2-3h</p>
                <p>• For 0-24 hours</p>
                <p>• Stop if PG &gt;45 mg/dL</p>
              </div>
            </div>
            <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
              <p className="text-[9px] font-bold text-pink-700 text-center">IDM / LGA (≥34 wks)</p>
              <div className="text-[7px] text-pink-600 mt-1">
                <p>• Screen before feeds</p>
                <p>• For first 12 hours</p>
                <p>• First feed in first hour</p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Glucose Levels */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Target Plasma Glucose (PES Recommendations)</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[8px] border-collapse">
              <thead>
                <tr className="bg-green-200 dark:bg-green-900/40">
                  <th className="border border-green-300 p-1 text-left">Time</th>
                  <th className="border border-green-300 p-1 text-center">Target PG</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-green-200 p-1">&lt;48 hours</td>
                  <td className="border border-green-200 p-1 text-center font-bold text-green-600">&gt;50 mg/dL</td>
                </tr>
                <tr className="bg-green-50 dark:bg-green-950/20">
                  <td className="border border-green-200 p-1">&gt;48 hours</td>
                  <td className="border border-green-200 p-1 text-center font-bold text-green-600">&gt;60 mg/dL</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="border border-green-200 p-1">Suspected congenital</td>
                  <td className="border border-green-200 p-1 text-center font-bold text-green-600">&gt;70 mg/dL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MANAGEMENT ALGORITHM */}
        <div className="p-2 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-blue-700 mb-2">MANAGEMENT ALGORITHM (AAP)</p>
          
          {/* Symptomatic */}
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg mb-2 border-2 border-red-400">
            <p className="text-[10px] font-bold text-red-700 text-center">SYMPTOMATIC (PG &lt;40 mg/dL)</p>
            <div className="text-[8px] text-red-600 mt-1">
              <p className="font-bold">IV Dextrose (D10W) Bolus:</p>
              <p>2 mL/kg IV push (= 200 mg/kg glucose)</p>
              {w > 0 && <p className="font-mono text-green-600 text-[10px]">= {(w*2).toFixed(1)} mL D10W</p>}
              <p className="mt-1">Then start IV infusion at GIR 6-8 mg/kg/min</p>
            </div>
          </div>

          {/* Asymptomatic Algorithm */}
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-amber-700 text-center">ASYMPTOMATIC AT-RISK</p>
            
            <div className="mt-2 space-y-2">
              {/* First 4 hours */}
              <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                <p className="text-[8px] font-bold text-amber-700">First 4 hours:</p>
                <div className="text-[7px] text-amber-600">
                  <p>PG &lt;25 mg/dL → Feed, recheck in 1 hr</p>
                  <p>If still &lt;25 → IV glucose</p>
                </div>
              </div>
              
              {/* 4-24 hours */}
              <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
                <p className="text-[8px] font-bold text-amber-700">4-24 hours:</p>
                <div className="text-[7px] text-amber-600">
                  <p>PG &lt;35 mg/dL → Feed, recheck in 1 hr</p>
                  <p>If continues &lt;35 → IV glucose</p>
                  <p>PG 35-45 mg/dL → Attempt feed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Target */}
          <div className="p-1.5 bg-green-100 dark:bg-green-950/30 rounded text-center">
            <p className="text-[8px] font-bold text-green-700">Target: PG &gt;45 mg/dL prior to routine feeds</p>
          </div>
        </div>

        {/* IV Glucose Therapy */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">IV Glucose Therapy</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Urgent Bolus (symptomatic):</p>
              <p>D10W 2 mL/kg IV</p>
              {w > 0 && <p className="font-mono text-green-600">= {(w*2).toFixed(1)} mL</p>}
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Maintenance:</p>
              <p>GIR 6-8 mg/kg/min</p>
              <p className="text-[7px] text-gray-500">D10W at 80-100 mL/kg/day ≈ GIR 5.5-7 mg/kg/min</p>
            </div>
            <div className="p-1.5 bg-red-50 dark:bg-red-950/30 rounded">
              <p className="font-bold text-red-600">High GIR needed (&gt;8-10 mg/kg/min)?</p>
              <p className="text-red-500">→ Suspect hyperinsulinism</p>
            </div>
          </div>
        </div>

        {/* GIR Calculation */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">GIR Calculation</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400">
            <p className="font-mono bg-white dark:bg-gray-900 p-1 rounded">
              GIR = (% Dextrose × Rate mL/kg/day) ÷ 144
            </p>
            <p className="mt-1 text-[7px]">Example: D10W at 80 mL/kg/day = (10 × 80) ÷ 144 = 5.5 mg/kg/min</p>
          </div>
        </div>

        {/* Persistent Hypoglycemia */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Persistent/Recurrent Hypoglycemia</p>
          <div className="text-[8px] text-red-600 space-y-0.5">
            <p><strong>Definition:</strong> PG &lt;50 mg/dL lasting &gt;48 hrs or requiring prolonged management</p>
            <p className="mt-1"><strong>Consider:</strong></p>
            <p>• Congenital hyperinsulinism</p>
            <p>• Endocrine disorders (panhypopituitarism, cortisol deficiency)</p>
            <p>• Inborn errors of metabolism</p>
            <p className="mt-1"><strong>Pharmacologic options:</strong> Diazoxide (first-line), Octreotide, Glucocorticoids</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Prognosis</p>
          <p className="text-[8px] text-amber-600">
            Hypoglycemia can cause seizures, permanent neuronal injury, death, developmental delay, learning problems, and cortical blindness. Days with moderate hypoglycemia correlate with reduced developmental scores.
          </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default HypoglycemiaApproach;
