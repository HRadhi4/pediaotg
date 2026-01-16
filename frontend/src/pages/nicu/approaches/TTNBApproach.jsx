/**
 * Transient Tachypnea of the Newborn (TTN/TTNB) Approach
 * Updated: 2024 Evidence-Based Guidelines
 * Reference: StatPearls 2024, Pediatrics, NCBI Reviews
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TTNBApproach = ({ weight, gestationalAge }) => {
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="ttnb-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Transient Tachypnea of the Newborn (TTN)</CardTitle>
        <CardDescription className="text-xs">"Wet Lung" - Self-Limited Respiratory Distress</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 Evidence-Based Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>TTN:</strong> Self-limited respiratory distress in late preterm or term neonates caused by delayed clearance of fetal lung fluid.</p>
            <p>Also known as: "Wet lung disease," "Type II RDS," "Retained fetal lung fluid"</p>
            <p><strong>Most common cause of respiratory distress in term infants</strong></p>
            <p>Incidence: 4-6 per 1000 term births; higher in late preterm</p>
          </div>
        </div>

        {/* Pathophysiology */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Pathophysiology</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Normal lung fluid clearance mechanisms:</strong></p>
            <p>• <strong>Catecholamine surge</strong> during labor → activates ENaC sodium channels</p>
            <p>• <strong>Thoracic squeeze</strong> during vaginal delivery (minor role)</p>
            <p>• <strong>Pulmonary lymphatic absorption</strong></p>
            <p>• <strong>Increased pulmonary blood flow</strong> after first breath</p>
            
            <p className="mt-2"><strong>TTN pathology:</strong></p>
            <p>• Delayed/incomplete fluid clearance</p>
            <p>• Interstitial and alveolar fluid accumulation</p>
            <p>• Decreased lung compliance</p>
            <p>• V/Q mismatch → hypoxemia, tachypnea</p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors (2024)</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div className="font-bold">Delivery-related:</div>
            <div></div>
            <div>• <strong>C-section without labor</strong> (highest risk)</div>
            <div>• Elective C/S &lt;39 weeks</div>
            <div>• Precipitous delivery</div>
            <div>• Maternal sedation/anesthesia</div>
            <div className="font-bold mt-1">Infant-related:</div>
            <div></div>
            <div>• Late preterm (34-36+6 weeks)</div>
            <div>• Early term (37-38+6 weeks)</div>
            <div>• <strong>Male sex</strong></div>
            <div>• LGA, macrosomia</div>
            <div>• Maternal diabetes</div>
            <div>• Maternal asthma</div>
            <div>• Perinatal asphyxia</div>
            <div>• Low Apgar scores</div>
          </div>
          {ga > 0 && ga >= 34 && ga < 39 && (
            <p className="text-[8px] text-amber-600 mt-1 bg-amber-50 p-1 rounded">
              ⚠️ At {ga} weeks GA: Higher TTN risk with elective C/S without labor
            </p>
          )}
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Clinical Features</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p><strong>Onset:</strong> Within first 2-6 hours of life</p>
            <p><strong>Presentation:</strong></p>
            <div className="grid grid-cols-2 gap-1 pl-2">
              <div>• <strong>Tachypnea (RR 60-120/min)</strong></div>
              <div>• Grunting</div>
              <div>• Nasal flaring</div>
              <div>• Mild-moderate retractions</div>
              <div>• Mild cyanosis (responds to O2)</div>
              <div>• Clear breath sounds typically</div>
            </div>
            <p className="mt-2"><strong>Course (key feature):</strong></p>
            <p>• Symptoms usually improve within <strong>24-72 hours</strong></p>
            <p>• Most resolve by 48 hours</p>
            <p>• Rarely requires FiO2 &gt;0.40</p>
            <p>• No apnea episodes (unlike RDS)</p>
          </div>
        </div>

        {/* Chest X-ray & LUS */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Imaging (2024)</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p className="font-bold">Chest X-ray Findings:</p>
            <p>• Perihilar streaking ("sunburst pattern")</p>
            <p>• Prominent vascular markings</p>
            <p>• Fluid in fissures (horizontal fissure)</p>
            <p>• Hyperinflation (flattened diaphragms)</p>
            <p>• Small pleural effusions (occasional)</p>
            <p>• <strong>Clears within 24-48 hours</strong></p>
            
            <p className="font-bold mt-2">Lung Ultrasound (emerging, 2024):</p>
            <p>• Compact B-lines, "double lung point"</p>
            <p>• LUS score 4-6 on day 1 (vs 10-13 for RDS)</p>
            <p>• Helps differentiate from RDS without radiation</p>
          </div>
        </div>

        {/* TTN vs RDS */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">TTN vs RDS - Key Differences</p>
          <table className="w-full text-[7px]">
            <thead>
              <tr className="bg-indigo-100 dark:bg-indigo-900/40">
                <th className="border border-indigo-200 p-1">Feature</th>
                <th className="border border-indigo-200 p-1">TTN</th>
                <th className="border border-indigo-200 p-1">RDS</th>
              </tr>
            </thead>
            <tbody className="text-indigo-600">
              <tr>
                <td className="border border-indigo-200 p-1">GA</td>
                <td className="border border-indigo-200 p-1">Late preterm/term</td>
                <td className="border border-indigo-200 p-1">Preterm (&lt;34 wk)</td>
              </tr>
              <tr>
                <td className="border border-indigo-200 p-1">Duration</td>
                <td className="border border-indigo-200 p-1 font-bold">&lt;72 hours</td>
                <td className="border border-indigo-200 p-1">Prolonged</td>
              </tr>
              <tr>
                <td className="border border-indigo-200 p-1">CXR</td>
                <td className="border border-indigo-200 p-1">Fluid in fissures</td>
                <td className="border border-indigo-200 p-1">Ground glass</td>
              </tr>
              <tr>
                <td className="border border-indigo-200 p-1">FiO2 needed</td>
                <td className="border border-indigo-200 p-1">&lt;0.40 usually</td>
                <td className="border border-indigo-200 p-1">Often &gt;0.40</td>
              </tr>
              <tr>
                <td className="border border-indigo-200 p-1">Surfactant</td>
                <td className="border border-indigo-200 p-1">Not needed</td>
                <td className="border border-indigo-200 p-1">Often required</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Diagnosis */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Diagnosis (of Exclusion)</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p className="font-bold">TTN is a clinical diagnosis - must rule out:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• RDS (surfactant deficiency)</div>
              <div>• Pneumonia/sepsis</div>
              <div>• MAS</div>
              <div>• Pneumothorax</div>
              <div>• CHD (cyanotic)</div>
              <div>• PPHN</div>
            </div>
            
            <p className="font-bold mt-2">Workup:</p>
            <p>• CXR (characteristic findings)</p>
            <p>• CBC, blood culture (if infection suspected)</p>
            <p>• Blood gas if significant distress</p>
            <p>• Consider echo if persistent cyanosis</p>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-gradient-to-b from-teal-50 to-gray-50 dark:from-teal-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-teal-700 mb-2">MANAGEMENT (2024)</p>
          
          <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-teal-700">Supportive Care (Mainstay)</p>
            <div className="text-[8px] text-teal-600 mt-1 space-y-0.5">
              <p>• <strong>Continuous cardiorespiratory monitoring</strong></p>
              <p>• Oxygen to maintain SpO2 90-95%</p>
              <p>• Neutral thermal environment (36.5-37.5°C)</p>
              <p>• NPO or limited feeds if RR &gt;60-80</p>
              <p>• IV fluids (D10W) for hydration/glucose</p>
              <p>• IV access recommended</p>
            </div>
          </div>

          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Respiratory Support (if needed)</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p>• <strong>Low-flow O2</strong> (hood or nasal cannula) - most cases</p>
              <p>• <strong>CPAP 4-6 cm H2O</strong> if FiO2 &gt;0.40</p>
              <p>• CPAP may aid fluid clearance (2024 evidence)</p>
              <p>• HFNC as alternative to CPAP</p>
              <p>• Mechanical ventilation rarely needed</p>
            </div>
          </div>

          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-amber-700">What NOT to Do (Evidence-Based)</p>
            <div className="text-[8px] text-amber-600 mt-1 space-y-0.5">
              <p>• <strong>Diuretics - NOT proven beneficial</strong></p>
              <p>• Fluid restriction - NOT helpful</p>
              <p>• Routine antibiotics - only if infection suspected</p>
              <p>• Surfactant - not indicated for TTN</p>
            </div>
          </div>
        </div>

        {/* Feeding */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Feeding Guidelines</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p>• <strong>RR &gt;80:</strong> NPO, IV fluids</p>
            <p>• <strong>RR 60-80:</strong> Gavage feeds or small PO/breast</p>
            <p>• <strong>RR &lt;60:</strong> May resume oral feeds cautiously</p>
            <p>• Advance as tolerated with improving symptoms</p>
          </div>
        </div>

        {/* Red Flags */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Red Flags - Reconsider Diagnosis</p>
          <div className="text-[8px] text-red-600 space-y-0.5">
            <p>• Symptoms persisting &gt;72 hours</p>
            <p>• FiO2 requirement &gt;0.40</p>
            <p>• Need for mechanical ventilation</p>
            <p>• Clinical deterioration (worsening, not improving)</p>
            <p>• Significant hypotension</p>
            <p>• Profound cyanosis unresponsive to O2</p>
            <p>• Signs of infection (fever, lethargy, poor perfusion)</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• <strong>Excellent</strong> - self-limited condition</p>
            <p>• Usually resolves within 24-72 hours</p>
            <p>• No long-term respiratory sequelae</p>
            <p>• Mortality extremely rare</p>
            <p>• Some studies: Slight ↑ risk childhood wheezing/asthma</p>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Prevention</p>
          <div className="text-[8px] text-indigo-600 space-y-0.5">
            <p>• <strong>Avoid elective C-section before 39 weeks</strong></p>
            <p>• Allow trial of labor before C-section when safe</p>
            <p>• Antenatal steroids if delivery expected &lt;37 weeks</p>
            <p>• Delayed cord clamping may help (theoretical)</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default TTNBApproach;
