/**
 * Bronchopulmonary Dysplasia (BPD) Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const BPDApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;

  // Calculate PMA (postmenstrual age) in weeks
  const pmaWeeks = ga + (pna / 7);

  return (
    <Card data-testid="bpd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bronchopulmonary Dysplasia (BPD)</CardTitle>
        <CardDescription className="text-xs">Chronic Lung Disease of Prematurity</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition (NIH 2001)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>BPD:</strong> Need for supplemental oxygen for ≥28 days.</p>
            <p>Severity assessed at 36 weeks PMA (for &lt;32 wk GA) or 56 days (for ≥32 wk GA).</p>
            {ga > 0 && pna > 0 && (
              <p className="bg-white dark:bg-gray-900 p-1 rounded mt-1">
                Current PMA: {pmaWeeks.toFixed(1)} weeks ({pna} days postnatal)
              </p>
            )}
          </div>
        </div>

        {/* Severity Classification */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Severity Classification at 36 weeks PMA</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900/40">
                <th className="border border-blue-200 p-1">Severity</th>
                <th className="border border-blue-200 p-1">Oxygen/Support at 36 wk PMA</th>
              </tr>
            </thead>
            <tbody className="text-blue-600">
              <tr>
                <td className="border border-blue-200 p-1 font-bold text-green-600">Mild</td>
                <td className="border border-blue-200 p-1">Room air</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1 font-bold text-amber-600">Moderate</td>
                <td className="border border-blue-200 p-1">FiO2 &lt;0.30</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1 font-bold text-red-600">Severe</td>
                <td className="border border-blue-200 p-1">FiO2 ≥0.30 or PPV/CPAP</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pathophysiology */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Pathophysiology ("New BPD")</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Primary issue:</strong> Arrested lung development</p>
            <p>• Fewer, larger alveoli (simplified structure)</p>
            <p>• Decreased vascular development</p>
            <p>• Abnormal elastin deposition</p>
            
            <p className="font-bold mt-2">Contributing factors:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Oxygen toxicity</div>
              <div>• Mechanical ventilation</div>
              <div>• Inflammation/infection</div>
              <div>• Poor nutrition</div>
              <div>• PDA</div>
              <div>• Genetics</div>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div className="font-bold">Major:</div>
            <div></div>
            <div>• Extreme prematurity (&lt;28 wk)</div>
            <div>• Very low birth weight (&lt;1000g)</div>
            <div>• Prolonged mechanical ventilation</div>
            <div>• Oxygen supplementation</div>
            <div className="font-bold mt-1">Additional:</div>
            <div></div>
            <div>• Male sex</div>
            <div>• White race</div>
            <div>• Chorioamnionitis</div>
            <div>• Postnatal sepsis</div>
            <div>• PDA</div>
            <div>• Poor growth</div>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Prevention Strategies</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p className="font-bold">Respiratory:</p>
            <p>• Early CPAP (avoid intubation if possible)</p>
            <p>• Minimize oxygen exposure (target SpO2 90-95%)</p>
            <p>• Gentle ventilation (volume-targeted, permissive hypercapnia)</p>
            <p>• Early extubation, caffeine</p>
            
            <p className="font-bold mt-2">Other:</p>
            <p>• Antenatal steroids</p>
            <p>• Early surfactant (INSURE technique)</p>
            <p>• Aggressive nutrition</p>
            <p>• Prevent/treat PDA</p>
            <p>• Infection control</p>
            <p>• Vitamin A supplementation (evidence moderate)</p>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-gradient-to-b from-teal-50 to-gray-50 dark:from-teal-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-teal-700 mb-2">MANAGEMENT OF ESTABLISHED BPD</p>
          
          <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-teal-700">Respiratory Support</p>
            <div className="text-[8px] text-teal-600 mt-1 space-y-0.5">
              <p>• Wean oxygen slowly (avoid SpO2 &lt;90%)</p>
              <p>• Target SpO2 92-95% (some advocate higher targets)</p>
              <p>• CPAP/HFNC for support</p>
              <p>• Avoid frequent SpO2 fluctuations</p>
            </div>
          </div>

          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Nutrition</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p>• High caloric density (24-30 kcal/oz)</p>
              <p>• Target 120-150 kcal/kg/day</p>
              <p>• Adequate protein for growth</p>
              <p>• Consider fluid restriction (avoid &gt;150 mL/kg/day)</p>
            </div>
          </div>

          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-purple-700">Pharmacologic</p>
            <div className="text-[8px] text-purple-600 mt-1 space-y-0.5">
              <p>• Caffeine - continue until off respiratory support</p>
              <p>• Diuretics - for acute exacerbations (controversial)</p>
              <p>• Bronchodilators - trial if wheezing</p>
              <p>• Systemic steroids - reserved for severe BPD (risk-benefit)</p>
            </div>
          </div>
        </div>

        {/* Diuretics */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Diuretics in BPD</p>
          <div className="text-[8px] space-y-1">
            <p className="text-amber-400">Use sparingly - not for routine BPD management</p>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Furosemide:</p>
              <p>1-2 mg/kg/dose PO/IV q12-24h (intermittent)</p>
              <p className="text-[7px] text-gray-400">Monitor electrolytes, risk of nephrocalcinosis</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Chlorothiazide:</p>
              <p>10-20 mg/kg/dose PO q12h</p>
              <p className="text-[7px] text-gray-400">Less potassium wasting than furosemide</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Spironolactone:</p>
              <p>1-3 mg/kg/day PO divided q12h</p>
              <p className="text-[7px] text-gray-400">Potassium-sparing; often combined with thiazide</p>
            </div>
          </div>
        </div>

        {/* Steroids */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Postnatal Steroids</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p className="text-red-600 font-bold">⚠️ Reserve for severe BPD - neurodevelopmental concerns</p>
            
            <p className="font-bold mt-1">Consider if:</p>
            <p>• Unable to wean from mechanical ventilation</p>
            <p>• FiO2 ≥0.5-0.7 at 2-3+ weeks</p>
            <p>• High risk of death or severe BPD</p>
            
            <p className="font-bold mt-2">Options:</p>
            <p><strong>Dexamethasone:</strong> Low dose (0.15-0.2 mg/kg/day) × 7-10 days, then taper</p>
            <p><strong>Hydrocortisone:</strong> May have better safety profile (needs more study)</p>
            
            <p className="text-[7px] mt-1">Discuss risks/benefits with family; document shared decision-making</p>
          </div>
        </div>

        {/* Complications */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Complications</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div>• Pulmonary hypertension</div>
            <div>• Cor pulmonale</div>
            <div>• Growth failure</div>
            <div>• Neurodevelopmental impairment</div>
            <div>• Reactive airway disease</div>
            <div>• Recurrent respiratory infections</div>
            <div>• Gastroesophageal reflux</div>
            <div>• Osteopenia</div>
          </div>
        </div>

        {/* Discharge & Follow-up */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Discharge Planning</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Home oxygen criteria:</strong></p>
            <p>• Stable on low-flow O2</p>
            <p>• SpO2 maintained ≥92-95%</p>
            <p>• Adequate weight gain</p>
            
            <p className="font-bold mt-2">Follow-up needs:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Pulmonology</div>
              <div>• Developmental follow-up</div>
              <div>• RSV prophylaxis (Palivizumab)</div>
              <div>• Flu vaccine for family</div>
              <div>• Nutrition support</div>
              <div>• Ophthalmology (ROP)</div>
            </div>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Most infants improve over first 2 years</p>
            <p>• Many wean off oxygen by 1 year of age</p>
            <p>• Increased risk of respiratory illness in childhood</p>
            <p>• May have exercise intolerance</p>
            <p>• Severe BPD: Higher risk of neurodevelopmental delay</p>
            <p>• Pulmonary hypertension worsens prognosis</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default BPDApproach;
