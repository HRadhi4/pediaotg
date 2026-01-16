/**
 * Persistent Pulmonary Hypertension of the Newborn (PPHN) Approach
 * Updated: 2022-2025 Evidence-Based Guidelines
 * Reference: AHA/ATS 2015 Guidelines, Nationwide Children's 2022 Protocol, NCCC 2025
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PPHNApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="pphn-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">PPHN</CardTitle>
        <CardDescription className="text-xs">Persistent Pulmonary Hypertension of the Newborn</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: AHA/ATS Guidelines + 2024 Evidence</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>PPHN:</strong> Failure of normal postnatal decline in pulmonary vascular resistance (PVR), causing right-to-left shunting across the foramen ovale and/or ductus arteriosus, resulting in severe hypoxemia.</p>
            <p>Incidence: 1.9 per 1000 live births</p>
            <p>Predominantly affects term/near-term infants (&gt;34 weeks)</p>
          </div>
        </div>

        {/* Pathophysiology */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Pathophysiology Categories</p>
          <div className="space-y-1 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">1. Maladaptation (Most Common - 70%)</p>
              <p>Structurally normal vessels that fail to relax</p>
              <p>Causes: MAS, RDS, pneumonia, sepsis, asphyxia, TTN</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">2. Maldevelopment (Vascular Remodeling)</p>
              <p>Increased muscularization of pulmonary arteries</p>
              <p>Causes: Chronic intrauterine hypoxia, IUGR, post-term, maternal NSAID/SSRI use</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">3. Underdevelopment (Hypoplasia)</p>
              <p>Decreased cross-sectional area of pulmonary vasculature</p>
              <p>Causes: CDH, pulmonary hypoplasia, oligohydramnios</p>
            </div>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Clinical Features</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p>• Severe hypoxemia <strong>disproportionate</strong> to lung disease</p>
            <p>• Labile oxygenation (SpO2 swings with handling)</p>
            <p>• Cyanosis unresponsive to oxygen</p>
            <p>• <strong>Pre-post ductal SpO2 difference &gt;10%</strong></p>
            <p>• May have murmur of tricuspid regurgitation</p>
            <p>• Signs of underlying cause (e.g., MAS, sepsis)</p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Diagnosis (2024 Criteria)</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p className="font-bold">Clinical + Echo confirmation:</p>
            <p>• <strong>Pre-post ductal SpO2 gradient &gt;5-10%</strong></p>
            <p>• Pre-post ductal PaO2 gradient &gt;10-20 mmHg</p>
            
            <p className="font-bold mt-2">Echocardiography (Gold Standard):</p>
            <p>• R→L or bidirectional shunt at PDA/PFO</p>
            <p>• Estimated PA pressure &gt;2/3 systemic</p>
            <p>• TR jet velocity (estimates PA pressure)</p>
            <p>• Septal flattening/deviation to left</p>
            <p>• Excludes structural heart disease (critical!)</p>
            
            <p className="font-bold mt-2">Oxygenation Index (OI):</p>
            <p className="font-mono bg-purple-100 p-1 rounded">OI = (MAP × FiO2 × 100) / PaO2</p>
          </div>
        </div>

        {/* OI Interpretation */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">OI Interpretation & Escalation</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-orange-100 dark:bg-orange-900/40">
                <th className="border border-orange-200 p-1">OI</th>
                <th className="border border-orange-200 p-1">Severity</th>
                <th className="border border-orange-200 p-1">Action</th>
              </tr>
            </thead>
            <tbody className="text-orange-600">
              <tr>
                <td className="border border-orange-200 p-1">&lt;15</td>
                <td className="border border-orange-200 p-1">Mild</td>
                <td className="border border-orange-200 p-1">Optimize ventilation</td>
              </tr>
              <tr>
                <td className="border border-orange-200 p-1">15-25</td>
                <td className="border border-orange-200 p-1">Moderate</td>
                <td className="border border-orange-200 p-1">Consider iNO</td>
              </tr>
              <tr>
                <td className="border border-orange-200 p-1">25-40</td>
                <td className="border border-orange-200 p-1">Severe</td>
                <td className="border border-orange-200 p-1 font-bold">Start iNO (AHA Class I)</td>
              </tr>
              <tr>
                <td className="border border-orange-200 p-1">&gt;40</td>
                <td className="border border-orange-200 p-1">Critical</td>
                <td className="border border-orange-200 p-1 font-bold text-red-600">Consider ECMO</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Management Algorithm */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">MANAGEMENT ALGORITHM (AHA/ATS + 2024)</p>
          
          {/* General */}
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">General Principles</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Treat underlying cause (sepsis, MAS, RDS)</p>
              <p>• <strong>Minimal handling</strong> (stimulation worsens PVR)</p>
              <p>• Maintain normothermia (36.5-37.5°C)</p>
              <p>• Correct acidosis, hypoglycemia, electrolytes</p>
              <p>• Adequate sedation if ventilated</p>
            </div>
          </div>

          {/* Oxygenation */}
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Oxygenation Targets</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p>• Target preductal SpO2 <strong>95-99%</strong></p>
              <p>• PaO2 60-90 mmHg (avoid extremes)</p>
              <p>• Avoid hyperoxia once stable (increases ROS)</p>
              <p>• FiO2 to maintain targets initially</p>
            </div>
          </div>

          {/* Ventilation */}
          <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-teal-700">Ventilation (Gentle Strategy)</p>
            <div className="text-[8px] text-teal-600 mt-1 space-y-0.5">
              <p>• Optimal lung recruitment (9 posterior ribs on CXR)</p>
              <p>• PEEP 5-8 cm H2O (higher for parenchymal disease)</p>
              <p>• Permissive hypercapnia (PaCO2 45-55 if pH &gt;7.25)</p>
              <p>• Low tidal volumes (4-6 mL/kg)</p>
              <p>• HFOV if conventional fails</p>
            </div>
          </div>

          {/* iNO */}
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-purple-700">Inhaled Nitric Oxide (iNO) - AHA Class I</p>
            <div className="text-[8px] text-purple-600 mt-1 space-y-0.5">
              <p><strong>Indication:</strong> OI ≥25 (or OI &gt;15-20 with severe hypoxemia)</p>
              <p><strong>Starting dose:</strong> 20 ppm</p>
              <p><strong>Response:</strong> Expect ↑SpO2 within 30-60 min</p>
              <p><strong>Weaning:</strong> When OI &lt;15 and FiO2 &lt;0.6</p>
              <p>• Decrease by 5 ppm q4-6h to 5 ppm</p>
              <p>• Then 2 ppm → 1 ppm → off</p>
              <p className="text-red-600">⚠️ Do NOT abruptly stop - rebound PHT</p>
            </div>
          </div>
        </div>

        {/* Alternative Vasodilators */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Alternative/Adjunct Vasodilators (2024)</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Sildenafil (if iNO contraindicated or refractory)</p>
              <p>PO/NG: 0.5-2 mg/kg q6-8h</p>
              <p>IV: 0.4 mg/kg load over 3h → 0.07 mg/kg/hr</p>
              <p className="text-[7px] text-gray-600">Use if LV dysfunction (iNO may worsen)</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Milrinone (PDE3 inhibitor)</p>
              <p>0.25-0.75 mcg/kg/min (no load in neonates)</p>
              <p className="text-[7px] text-gray-600">Inotropy + pulmonary vasodilation; watch hypotension</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Prostaglandin E1 (PGE1)</p>
              <p>0.01-0.05 mcg/kg/min - if duct-dependent R→L shunt needed</p>
            </div>
          </div>
        </div>

        {/* Hemodynamic Support */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Hemodynamic Support</p>
          <div className="text-[8px] space-y-1">
            <p className="text-amber-400 font-bold">Goal: Maintain systemic BP &gt; PA pressure</p>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Dopamine (first-line):</p>
              <p>5-20 mcg/kg/min</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Norepinephrine (potent systemic):</p>
              <p>0.05-0.3 mcg/kg/min</p>
              <p className="text-[7px]">Preferred for refractory hypotension</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Vasopressin (catecholamine-resistant):</p>
              <p>0.0001-0.0008 units/kg/min</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold">Hydrocortisone (vasopressor refractory):</p>
              <p>1-2 mg/kg q6-8h</p>
            </div>
          </div>
        </div>

        {/* ECMO */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">ECMO Considerations (AHA Class I)</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p className="font-bold">Indications:</p>
            <p>• OI &gt;40 despite maximal therapy</p>
            <p>• Failure to respond to iNO (&gt;30-60 min)</p>
            <p>• Refractory hypoxemia (PaO2 &lt;40) or acidosis</p>
            <p>• Hemodynamic instability despite pressors</p>
            
            <p className="font-bold mt-2">Eligibility:</p>
            <p>• ≥34 weeks GA and ≥2 kg</p>
            <p>• No major IVH (grade III-IV)</p>
            <p>• No lethal anomaly</p>
            <p>• Reversible condition</p>
            <p>• Duration of hypoxia &lt;10-14 days</p>
          </div>
        </div>

        {/* Monitoring */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Monitoring (2025 Protocol)</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p>• <strong>Pre- and post-ductal SpO2</strong> continuous</p>
            <p>• ABG q4h initially (adjust per stability)</p>
            <p>• Lactate q1-4h (tissue perfusion marker)</p>
            <p>• Serial echos (24-48h and with changes)</p>
            <p>• Daily head ultrasound (IVH risk)</p>
            <p>• Methemoglobin if on iNO (daily)</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Overall survival: <strong>85-95%</strong> with modern treatment</p>
            <p>• Better outcomes: MAS, RDS, idiopathic (treatable cause)</p>
            <p>• Worse prognosis: CDH, pulmonary hypoplasia, alveolar capillary dysplasia</p>
            <p>• Long-term: 20-25% may have neurodevelopmental issues</p>
            <p>• Hearing screening essential (sensorineural loss risk)</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PPHNApproach;
