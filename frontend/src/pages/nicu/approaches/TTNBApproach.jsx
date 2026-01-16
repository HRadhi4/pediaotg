/**
 * Transient Tachypnea of the Newborn (TTN/TTNB) Approach
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * Reference: WHO/Belize Neonatal Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TTNBApproach = ({ weight, gestationalAge }) => {
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="ttnb-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Transient Tachypnea of the Newborn (TTN)</CardTitle>
        <CardDescription className="text-xs">"Wet Lung" - Self-Limited Respiratory Distress</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Reference: WHO Neonatal Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>TTN:</strong> Self-limited respiratory distress in near-term or term neonates caused by delayed clearance of fetal lung fluid.</p>
            <p>Also known as: "Wet lung disease," "Type II RDS"</p>
            <p>Most common cause of respiratory distress in term infants.</p>
          </div>
        </div>

        {/* Pathophysiology */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Pathophysiology</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Normal:</strong> Fetal lung fluid is absorbed via:</p>
            <p>• Catecholamine surge during labor → activates ENaC channels</p>
            <p>• Thoracic squeeze during vaginal delivery</p>
            <p>• Pulmonary lymphatic drainage</p>
            
            <p className="mt-2"><strong>TTN:</strong> Delayed or incomplete fluid clearance →</p>
            <p>• Fluid in alveoli and interstitium</p>
            <p>• Decreased lung compliance</p>
            <p>• V/Q mismatch</p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-1 text-[8px] text-red-600">
            <div className="font-bold">Delivery-related:</div>
            <div></div>
            <div>• Cesarean section (esp. without labor)</div>
            <div>• Precipitous delivery</div>
            <div>• Elective C/S &lt;39 weeks</div>
            <div>• Maternal sedation</div>
            <div className="font-bold mt-1">Infant-related:</div>
            <div></div>
            <div>• Late preterm (34-37 weeks)</div>
            <div>• Male sex</div>
            <div>• LGA, macrosomia</div>
            <div>• Perinatal asphyxia</div>
            <div>• Maternal diabetes</div>
            <div>• Maternal asthma</div>
          </div>
          {ga > 0 && ga >= 34 && ga < 39 && (
            <p className="text-[8px] text-amber-600 mt-1 bg-amber-50 p-1 rounded">
              ⚠️ At {ga} weeks GA: Higher TTN risk if delivered via C/S without labor
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
              <div>• Tachypnea (RR 60-120/min)</div>
              <div>• Grunting</div>
              <div>• Nasal flaring</div>
              <div>• Mild-moderate retractions</div>
              <div>• Mild cyanosis</div>
              <div>• Usually NO apnea</div>
            </div>
            <p className="mt-2"><strong>Course:</strong></p>
            <p>• Usually improves within 24-72 hours</p>
            <p>• Most resolve by 48 hours</p>
            <p>• Rarely requires &gt;FiO2 0.4</p>
          </div>
        </div>

        {/* Chest X-ray */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Chest X-ray Findings</p>
          <div className="text-[8px] text-purple-600 space-y-0.5">
            <p>• Perihilar streaking (prominent vessels)</p>
            <p>• Increased interstitial markings</p>
            <p>• Fluid in fissures</p>
            <p>• Hyperinflation (flattened diaphragms)</p>
            <p>• Small pleural effusions (occasionally)</p>
            <p>• "Wet silhouette" appearance</p>
            <p className="mt-1 text-[7px] text-purple-500">Typically clears within 24-48 hours (earlier than clinical improvement)</p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Diagnosis (of Exclusion)</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p className="font-bold">TTN is a clinical diagnosis - rule out:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• RDS (preterm, surfactant deficiency)</div>
              <div>• Pneumonia/sepsis</div>
              <div>• MAS</div>
              <div>• Pneumothorax</div>
              <div>• CHD</div>
              <div>• PPHN</div>
            </div>
            
            <p className="font-bold mt-2">Workup:</p>
            <p>• CXR (characteristic findings)</p>
            <p>• CBC, blood culture (if infection suspected)</p>
            <p>• Blood gas if significant distress</p>
            <p>• Consider echo if cyanosis persists</p>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-gradient-to-b from-teal-50 to-gray-50 dark:from-teal-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-teal-700 mb-2">MANAGEMENT</p>
          
          <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-teal-700">Supportive Care (Mainstay of Treatment)</p>
            <div className="text-[8px] text-teal-600 mt-1 space-y-0.5">
              <p>• Oxygen as needed (usually low FiO2 sufficient)</p>
              <p>• Target SpO2 90-95%</p>
              <p>• NPO or limited feeds if RR &gt;60-80</p>
              <p>• IV fluids for hydration</p>
              <p>• Maintain neutral thermal environment</p>
            </div>
          </div>

          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-blue-700">Respiratory Support (if needed)</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p>• Nasal cannula → CPAP if FiO2 needs increase</p>
              <p>• CPAP 4-6 cm H2O may help lung fluid clearance</p>
              <p>• Mechanical ventilation rarely needed</p>
            </div>
          </div>

          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-amber-700">What NOT to Do</p>
            <div className="text-[8px] text-amber-600 mt-1 space-y-0.5">
              <p>• Diuretics - NOT proven beneficial, may cause harm</p>
              <p>• Fluid restriction - NOT helpful</p>
              <p>• Routine antibiotics - only if sepsis suspected</p>
            </div>
          </div>
        </div>

        {/* When to Suspect Something Else */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Red Flags - Consider Alternative Diagnosis</p>
          <div className="text-[8px] text-red-600 space-y-0.5">
            <p>• Symptoms beyond 72 hours</p>
            <p>• FiO2 requirement &gt;0.4</p>
            <p>• Need for mechanical ventilation</p>
            <p>• Worsening rather than improving</p>
            <p>• Significant hypotension</p>
            <p>• Profound cyanosis</p>
            <p>• Signs of infection (fever, poor perfusion)</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• <strong>Excellent</strong> - self-limited condition</p>
            <p>• Usually resolves within 24-72 hours</p>
            <p>• No long-term respiratory sequelae</p>
            <p>• Some studies suggest slightly increased risk of childhood asthma</p>
            <p>• Mortality extremely rare</p>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Prevention</p>
          <div className="text-[8px] text-indigo-600 space-y-0.5">
            <p>• Avoid elective C-section before 39 weeks</p>
            <p>• Allow trial of labor before C-section when possible</p>
            <p>• Antenatal steroids if delivery expected &lt;37 weeks</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default TTNBApproach;
