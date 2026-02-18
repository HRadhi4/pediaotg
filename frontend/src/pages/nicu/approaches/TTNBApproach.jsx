/**
 * TTN (Transient Tachypnea of the Newborn) Approach
 * Updated: 2024/2025 Guidelines
 * References: NeoReviews 2024, UpToDate, AAP
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const TTNBApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="ttnb-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Transient Tachypnea of the Newborn (TTN)</CardTitle>
        <CardDescription className="text-xs">Wet Lung Syndrome - 2024/2025 Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Key Points
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Self-limited respiratory distress from delayed clearance of fetal lung fluid</li>
            <li><strong>Onset:</strong> Within first 2 hours of life</li>
            <li><strong>Duration:</strong> Usually resolves within <strong>24-72 hours</strong></li>
            <li><strong>Diagnosis:</strong> Exclusion of other causes (RDS, pneumonia, sepsis, heart disease)</li>
            <li><strong>Prognosis:</strong> Excellent - full recovery expected</li>
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1 text-red-600 dark:text-red-400">Major:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>C-section without labor</strong></li>
                <li>Precipitous delivery</li>
                <li>Late preterm (34-37 weeks)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Contributing:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Maternal diabetes</li>
                <li>Maternal asthma</li>
                <li>Male sex</li>
                <li>Macrosomia</li>
                <li>Perinatal asphyxia</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pathophysiology */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Pathophysiology</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2">Normal lung fluid clearance requires:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>ENaC (epithelial sodium channels) activation by catecholamines during labor</li>
              <li>Vaginal squeeze during delivery</li>
              <li>Lymphatic absorption</li>
            </ul>
            <p className="mt-2 text-blue-600 dark:text-blue-400">
              → C-section without labor = reduced catecholamine surge = impaired fluid clearance
            </p>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Features</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Signs (onset within 2 hours):</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Tachypnea (RR <strong>&gt;60/min</strong>, often 80-100+)</li>
              <li>Mild-moderate retractions</li>
              <li>Nasal flaring</li>
              <li>Grunting (typically less prominent than RDS)</li>
              <li>Mild cyanosis (responds to low-flow O2)</li>
            </ul>
            <p className="font-medium mt-2 mb-1">CXR findings:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Perihilar streaking ("wet silhouette")</li>
              <li>Fluid in fissures</li>
              <li><strong>Hyperinflation</strong></li>
              <li>Mild cardiomegaly (pulmonary congestion)</li>
              <li>Flat diaphragms</li>
            </ul>
          </div>
        </div>

        {/* Differential Diagnosis */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
          <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Differential Diagnosis
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2 font-medium">Rule out before diagnosing TTN:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-amber-100 dark:bg-amber-900/40">
                    <th className="text-left py-1 px-2 border border-slate-300 dark:border-slate-600">Condition</th>
                    <th className="text-left py-1 px-2 border border-slate-300 dark:border-slate-600">Distinguishing Features</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-1 px-2 border font-medium">RDS</td><td className="py-1 px-2 border">Preterm, progressive, ground glass CXR, low lung volumes</td></tr>
                  <tr><td className="py-1 px-2 border font-medium">Pneumonia/Sepsis</td><td className="py-1 px-2 border">Risk factors, fever, WBC changes, focal infiltrates</td></tr>
                  <tr><td className="py-1 px-2 border font-medium">MAS</td><td className="py-1 px-2 border">Meconium-stained fluid, patchy infiltrates</td></tr>
                  <tr><td className="py-1 px-2 border font-medium">PPHN</td><td className="py-1 px-2 border">Severe hypoxemia, pre-post ductal gradient</td></tr>
                  <tr><td className="py-1 px-2 border font-medium">CHD</td><td className="py-1 px-2 border">Murmur, cardiomegaly, abnormal echo</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Management - 2024/2025 */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Management (2024/2025 Guidelines)
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Respiratory Support:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• <strong>Supplemental O2</strong> to maintain SpO2 90-95%</li>
                <li>• Usually low FiO2 sufficient (21-40%)</li>
                <li>• <strong>CPAP/HFNC</strong> if FiO2 &gt;0.40 or moderate distress</li>
                <li>• May shorten duration of tachypnea</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Feeding:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• <strong>NPO if RR &gt;60-70/min</strong> (aspiration risk)</li>
                <li>• IV fluids until feeding safe</li>
                <li>• Start feeds as tachypnea resolves</li>
                <li>• Consider NG feeds if prolonged</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Monitoring:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Continuous pulse oximetry</li>
                <li>• Respiratory rate trending</li>
                <li>• Thermal neutrality</li>
                <li>• Level II nursery if needed</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Antibiotics:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Consider empiric antibiotics (ampicillin + gentamicin) pending cultures</li>
                <li>• Due to clinical overlap with pneumonia/sepsis</li>
                <li>• Discontinue after 36-48h if cultures negative and improving</li>
              </ul>
            </div>
          </div>
          <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-[10px]">
            <p className="text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> Beta-agonists (salbutamol), corticosteroids, diuretics, and fluid restriction are NOT routinely recommended
            </p>
          </div>
        </div>

        {/* When to Worry */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            When to Reconsider Diagnosis
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Symptoms <strong>&gt;72 hours</strong></li>
            <li>Requiring <strong>FiO2 &gt;40%</strong></li>
            <li>Progressive respiratory distress</li>
            <li>Fever or temperature instability</li>
            <li>Cardiovascular instability</li>
            <li>Failure to improve within 24 hours</li>
          </ul>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
            → Sepsis workup, echocardiogram, transfer to higher level of care
          </p>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="text-green-600 dark:text-green-400 font-medium mb-1">Excellent outcomes:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Full recovery expected within 24-72 hours</li>
              <li>No long-term pulmonary sequelae</li>
              <li>Possible slight increased risk of childhood asthma (controversial)</li>
            </ul>
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: AAP NeoReviews 2024, StatPearls 2024, UpToDate 2025</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default TTNBApproach;
