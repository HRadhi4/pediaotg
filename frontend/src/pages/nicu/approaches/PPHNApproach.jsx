/**
 * Persistent Pulmonary Hypertension of the Newborn (PPHN) Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PPHNApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="pphn-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">PPHN</CardTitle>
        <CardDescription className="text-xs">Persistent Pulmonary Hypertension of the Newborn</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>PPHN:</strong> Failure of normal postnatal decline in pulmonary vascular resistance, leading to right-to-left shunting across the foramen ovale and/or ductus arteriosus, resulting in severe hypoxemia.</p>
            <p>Incidence: 1-2 per 1000 live births</p>
          </div>
        </div>

        {/* Pathophysiology */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Pathophysiology Categories</p>
          <div className="space-y-1 text-[8px] text-blue-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">1. Maladaptation (Most Common)</p>
              <p>Structurally normal vessels that fail to relax</p>
              <p>Causes: MAS, pneumonia, sepsis, RDS, asphyxia</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">2. Maldevelopment</p>
              <p>Increased muscularization of pulmonary arteries</p>
              <p>Causes: Chronic intrauterine hypoxia, post-term, IUGR</p>
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
            <p>• Severe hypoxemia disproportionate to lung disease</p>
            <p>• Labile oxygenation (desaturates with minimal stimulation)</p>
            <p>• <strong>Pre-ductal vs Post-ductal SpO2 difference &gt;10%</strong></p>
            <p className="text-[7px]">(Right hand SpO2 higher than lower extremity)</p>
            <p>• Cyanosis</p>
            <p>• Tachypnea, respiratory distress</p>
            <p>• Systemic hypotension</p>
            <p>• Often presents within first 24 hours</p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Diagnosis</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p className="font-bold">Key Diagnostic Criteria:</p>
            <p>• Pre-post ductal SpO2 gradient &gt;10%</p>
            <p>• Hypoxemia out of proportion to CXR findings</p>
            <p>• Echocardiography confirms diagnosis:</p>
            <div className="pl-2 text-[7px]">
              <p>- Right-to-left or bidirectional shunting at PFO/PDA</p>
              <p>- Elevated PA pressures (TR jet, septal flattening)</p>
              <p>- RV dilation/dysfunction</p>
              <p>- Rules out structural CHD</p>
            </div>
            
            <p className="font-bold mt-2">Oxygenation Index (OI):</p>
            <p className="font-mono bg-white dark:bg-gray-900 p-1 rounded">
              OI = (MAP × FiO2 × 100) / PaO2
            </p>
            <table className="w-full mt-1">
              <tbody>
                <tr><td className="pr-2">OI 15-25:</td><td>Moderate PPHN</td></tr>
                <tr><td className="pr-2">OI 25-40:</td><td>Severe PPHN</td></tr>
                <tr><td className="pr-2">OI &gt;40:</td><td>Consider iNO/ECMO</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">MANAGEMENT PRINCIPLES</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">General Supportive Care</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Minimize stimulation/handling</p>
              <p>• Neutral thermal environment</p>
              <p>• Correct metabolic abnormalities</p>
              <p>• Sedation (fentanyl, morphine)</p>
              <p>• Neuromuscular blockade (if needed)</p>
              <p>• Target SpO2 95-100% (avoid hypoxia)</p>
            </div>
          </div>

          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Optimize Lung Recruitment</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p>• Surfactant if RDS/MAS</p>
              <p>• Adequate PEEP (avoid atelectasis)</p>
              <p>• Avoid hyperventilation (target pH 7.30-7.40)</p>
              <p>• HFOV if conventional fails</p>
            </div>
          </div>

          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-purple-700">Maintain Systemic BP</p>
            <div className="text-[8px] text-purple-600 mt-1 space-y-0.5">
              <p>• Ensure adequate preload (volume bolus 10 mL/kg)</p>
              <p>• Inotropes/vasopressors as needed</p>
              <p>• Target MAP &gt; PA pressure to reduce R→L shunt</p>
            </div>
          </div>
        </div>

        {/* Specific Therapies */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Pulmonary Vasodilators</p>
          <div className="text-[8px] space-y-2">
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold text-cyan-400">Inhaled Nitric Oxide (iNO) - First Line</p>
              <p>Starting dose: 20 ppm</p>
              <p>Response: 60-70% of patients</p>
              <p>Wean gradually when SpO2 stable</p>
              <p className="text-amber-400 text-[7px]">⚠️ Rebound PHT if stopped abruptly</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold text-purple-400">Sildenafil (PDE5 Inhibitor)</p>
              <p>PO/NG: 0.5-2 mg/kg/dose q6-8h</p>
              {w > 0 && <p className="text-green-400 font-mono">= {(w * 0.5).toFixed(1)} - {(w * 2).toFixed(0)} mg/dose</p>}
              <p>IV: 0.1-0.5 mg/kg/dose q6-8h</p>
              <p className="text-[7px]">Use when iNO unavailable or for weaning</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded">
              <p className="font-bold text-orange-400">Milrinone (PDE3 Inhibitor)</p>
              <p>Loading: 50 mcg/kg over 30-60 min (optional)</p>
              <p>Infusion: 0.25-0.75 mcg/kg/min</p>
              {w > 0 && <p className="text-green-400 font-mono">= {(w * 0.25).toFixed(2)} - {(w * 0.75).toFixed(2)} mcg/min</p>}
              <p className="text-[7px]">Good for RV dysfunction; may cause hypotension</p>
            </div>
          </div>
        </div>

        {/* Vasopressors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Vasopressor Support</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p><strong>Goal:</strong> Maintain systemic BP &gt; pulmonary BP</p>
            
            <p className="font-bold mt-1">Dopamine:</p>
            <p>5-20 mcg/kg/min (start low, titrate)</p>
            
            <p className="font-bold mt-1">Norepinephrine:</p>
            <p>0.05-0.5 mcg/kg/min</p>
            <p className="text-[7px]">Preferred if significant hypotension</p>
            
            <p className="font-bold mt-1">Epinephrine:</p>
            <p>0.05-0.3 mcg/kg/min</p>
            <p className="text-[7px]">For refractory shock</p>
            
            <p className="font-bold mt-1">Vasopressin:</p>
            <p>0.0001-0.0008 units/kg/min</p>
            <p className="text-[7px]">Adjunct for catecholamine-resistant hypotension</p>
          </div>
        </div>

        {/* ECMO */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">ECMO Considerations</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p className="font-bold">Indications:</p>
            <p>• OI &gt;40 despite maximal therapy</p>
            <p>• Failure to respond to iNO</p>
            <p>• Refractory hypotension</p>
            <p>• Inability to maintain adequate oxygenation</p>
            
            <p className="font-bold mt-2">Contraindications:</p>
            <p>• &lt;34 weeks GA or &lt;2 kg</p>
            <p>• Major IVH (grade III-IV)</p>
            <p>• Lethal anomaly</p>
            <p>• Prolonged severe hypoxia (&gt;10-14 days)</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Overall survival: 80-90% with modern treatment</p>
            <p>• Better outcomes if underlying cause treatable (MAS, RDS)</p>
            <p>• Worse prognosis: CDH, pulmonary hypoplasia</p>
            <p>• Long-term: Risk of neurodevelopmental impairment, hearing loss</p>
            <p>• 25% may have neurodevelopmental problems at follow-up</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PPHNApproach;
