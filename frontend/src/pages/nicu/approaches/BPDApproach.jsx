/**
 * Bronchopulmonary Dysplasia (BPD) Approach
 * Updated: 2024 - Jensen Grading System (2018-2020) & NICHD/NHLBI Definitions
 * Reference: Pediatrics, JAMA Pediatrics, NIH Workshop Consensus
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const BPDApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const w = parseFloat(weight) || 0;

  // Calculate PMA (postmenstrual age) in weeks
  const pmaWeeks = ga + (pna / 7);

  return (
    <Card data-testid="bpd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bronchopulmonary Dysplasia (BPD)</CardTitle>
        <CardDescription className="text-xs">Chronic Lung Disease of Prematurity</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 Jensen Grading & NIH Workshop</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition - Updated 2024 */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition (2024 Update)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>BPD:</strong> Need for supplemental oxygen for ≥28 days in preterm infants.</p>
            <p><strong>Severity Assessment:</strong> At 36 weeks PMA (for &lt;32 wk GA) or 56 days postnatal (for ≥32 wk GA)</p>
            {ga > 0 && pna > 0 && (
              <p className="bg-white dark:bg-gray-900 p-1 rounded mt-1">
                Current PMA: <strong>{pmaWeeks.toFixed(1)} weeks</strong> ({pna} days postnatal)
              </p>
            )}
          </div>
        </div>

        {/* Jensen Grading 2018-2022 */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Jensen BPD Grading (2018-2022 Evidence)</p>
          <p className="text-[7px] text-blue-500 mb-1">Based on respiratory support at 36 weeks PMA - Better predicts outcomes than traditional NIH</p>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900/40">
                <th className="border border-blue-200 p-1">Grade</th>
                <th className="border border-blue-200 p-1">Respiratory Support at 36 wk PMA</th>
                <th className="border border-blue-200 p-1">Prognosis</th>
              </tr>
            </thead>
            <tbody className="text-blue-600">
              <tr>
                <td className="border border-blue-200 p-1 font-bold text-green-600">No BPD</td>
                <td className="border border-blue-200 p-1">Room air</td>
                <td className="border border-blue-200 p-1">Best</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1 font-bold text-yellow-600">Grade I</td>
                <td className="border border-blue-200 p-1">Nasal cannula ≤2 L/min</td>
                <td className="border border-blue-200 p-1">Good</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1 font-bold text-orange-600">Grade II</td>
                <td className="border border-blue-200 p-1">HFNC &gt;2 L/min or NIPPV/CPAP</td>
                <td className="border border-blue-200 p-1">Moderate</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1 font-bold text-red-600">Grade III</td>
                <td className="border border-blue-200 p-1">Invasive mechanical ventilation</td>
                <td className="border border-blue-200 p-1">Poor</td>
              </tr>
              <tr>
                <td className="border border-blue-200 p-1 font-bold text-red-700">Grade III(A)</td>
                <td className="border border-blue-200 p-1">Death &lt;36 wk PMA due to respiratory failure</td>
                <td className="border border-blue-200 p-1">Worst</td>
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
            <div>• VLBW (&lt;1500g) / ELBW (&lt;1000g)</div>
            <div>• Prolonged mechanical ventilation</div>
            <div>• High FiO2 exposure</div>
            <div className="font-bold mt-1">Additional:</div>
            <div></div>
            <div>• Male sex</div>
            <div>• White race</div>
            <div>• Chorioamnionitis</div>
            <div>• Postnatal sepsis</div>
            <div>• Hemodynamically significant PDA</div>
            <div>• Poor postnatal growth</div>
          </div>
        </div>

        {/* Prevention - 2024 Evidence */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Prevention Strategies (2024 Evidence)</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p className="font-bold">Respiratory Management:</p>
            <p>• Early CPAP over intubation (SUPPORT, COIN trials)</p>
            <p>• Target SpO2 <strong>91-95%</strong> (avoid &gt;95%)</p>
            <p>• Volume-targeted ventilation when needed</p>
            <p>• Permissive hypercapnia (PCO2 50-65 acceptable)</p>
            <p>• Early extubation + caffeine</p>
            
            <p className="font-bold mt-2">Other Evidence-Based:</p>
            <p>• Antenatal corticosteroids (strongest evidence)</p>
            <p>• INSURE/LISA techniques for surfactant</p>
            <p>• Early aggressive nutrition (protein 3.5-4 g/kg/day)</p>
            <p>• Caffeine citrate (CAP trial - reduces BPD)</p>
            <p>• Vitamin A supplementation (NNT ~13-15)</p>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-gradient-to-b from-teal-50 to-gray-50 dark:from-teal-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-teal-700 mb-2">MANAGEMENT OF ESTABLISHED BPD</p>
          
          <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-teal-700">Respiratory Support</p>
            <div className="text-[8px] text-teal-600 mt-1 space-y-0.5">
              <p>• Target SpO2 <strong>92-95%</strong> (higher for pulm HTN)</p>
              <p>• Wean oxygen slowly (avoid SpO2 &lt;90%)</p>
              <p>• CPAP/HFNC for ongoing support</p>
              <p>• Minimize SpO2 fluctuations (IH events)</p>
            </div>
          </div>

          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Nutrition (Critical)</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p>• Caloric density: 24-30 kcal/oz</p>
              <p>• Target: <strong>120-150 kcal/kg/day</strong></p>
              <p>• Protein: 3.5-4 g/kg/day</p>
              <p>• Fluid: Moderate restriction (140-150 mL/kg/day)</p>
            </div>
          </div>

          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-purple-700">Pharmacologic</p>
            <div className="text-[8px] text-purple-600 mt-1 space-y-0.5">
              <p>• <strong>Caffeine</strong> - continue until off resp support</p>
              <p>• <strong>Diuretics</strong> - acute exacerbations only</p>
              <p>• <strong>Bronchodilators</strong> - trial if wheezing/reactive</p>
              <p>• <strong>Steroids</strong> - severe cases only (see below)</p>
            </div>
          </div>
        </div>

        {/* Diuretics */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Diuretics in BPD (Use Sparingly)</p>
          <div className="text-[8px] space-y-1">
            <p className="text-amber-400">⚠️ Not for routine BPD - acute exacerbations only</p>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Furosemide:</p>
              <p>1-2 mg/kg/dose IV/PO q12-24h (short-term)</p>
              {w > 0 && <p className="text-green-400 font-mono">= {(w * 1).toFixed(1)} - {(w * 2).toFixed(1)} mg/dose</p>}
              <p className="text-[7px] text-gray-400">Risk: nephrocalcinosis, ototoxicity, electrolyte loss</p>
            </div>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Chlorothiazide + Spironolactone:</p>
              <p>Chlorothiazide 10-20 mg/kg/dose PO q12h</p>
              <p>Spironolactone 1-3 mg/kg/day PO divided q12h</p>
              <p className="text-[7px] text-gray-400">Less potassium wasting; for chronic use if needed</p>
            </div>
          </div>
        </div>

        {/* Steroids - 2024 */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Postnatal Steroids (2024 Guidance)</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p className="text-red-600 font-bold">⚠️ Reserve for infants at HIGH RISK of death/severe BPD</p>
            
            <p className="font-bold mt-1">Consider if (BPD risk &gt;50%):</p>
            <p>• Unable to wean from MV after 1-2 weeks</p>
            <p>• FiO2 ≥0.50-0.70 at 2+ weeks of age</p>
            <p>• High predicted BPD risk (use BPD risk calculators)</p>
            
            <p className="font-bold mt-2">Regimens:</p>
            <p><strong>DART protocol (preferred):</strong> Dexamethasone 0.15 mg/kg/day × 3d → 0.1 × 3d → 0.05 × 2d → 0.02 × 2d</p>
            <p><strong>Hydrocortisone:</strong> 1-2 mg/kg/day (may have better safety profile)</p>
            
            <p className="text-[7px] mt-1">Shared decision-making with family required; document discussion</p>
          </div>
        </div>

        {/* Pulmonary Hypertension */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">BPD-Associated Pulmonary Hypertension</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p><strong>Screening:</strong> Echo at 36 weeks PMA for moderate-severe BPD</p>
            <p><strong>Treatment:</strong></p>
            <p>• Optimize oxygenation (may need higher SpO2 targets 94-96%)</p>
            <p>• Sildenafil (0.5-2 mg/kg q6-8h)</p>
            <p>• Cardiology consultation for refractory cases</p>
          </div>
        </div>

        {/* Discharge & Follow-up */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Discharge Planning</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Home oxygen criteria:</strong></p>
            <p>• Stable on ≤0.5 L/min or FiO2 &lt;30%</p>
            <p>• SpO2 maintained ≥92% in room air or on O2</p>
            <p>• Adequate weight gain (20-30 g/day)</p>
            
            <p className="font-bold mt-2">Follow-up needs:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Pulmonology</div>
              <div>• Developmental follow-up</div>
              <div>• RSV prophylaxis (Palivizumab)</div>
              <div>• Flu + COVID vaccines (family)</div>
              <div>• Nutrition/growth monitoring</div>
              <div>• ROP screening if applicable</div>
            </div>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Most improve significantly over first 2-3 years</p>
            <p>• Many wean off home oxygen by 6-12 months</p>
            <p>• Increased risk of respiratory infections in childhood</p>
            <p>• May have exercise intolerance and wheezing</p>
            <p>• Severe BPD: Higher risk of neurodevelopmental impairment</p>
            <p>• BPD-PH: Worse prognosis, requires close follow-up</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default BPDApproach;
