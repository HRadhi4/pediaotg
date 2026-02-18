/**
 * TTN (Transient Tachypnea of the Newborn) Approach
 * Updated: 2024/2025 Guidelines
 * Design: Standardized to match HypoglycemiaApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TTNBApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="ttnb-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Transient Tachypnea of the Newborn (TTN)</CardTitle>
        <CardDescription className="text-xs">Wet Lung Syndrome - AAP NeoReviews 2024</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Self-limited respiratory distress from delayed lung fluid clearance</li>
            <li><strong>Onset:</strong> Within first 2 hours of life</li>
            <li><strong>Duration:</strong> Resolves within <strong>24-72 hours</strong></li>
            <li><strong>Diagnosis:</strong> Exclusion of RDS, pneumonia, sepsis, CHD</li>
            <li><strong>Prognosis:</strong> Excellent - full recovery expected</li>
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Major:</p>
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
              <li>ENaC activation by catecholamines during labor</li>
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
              <li>Tachypnea (RR &gt;60/min, often 80-100+)</li>
              <li>Mild-moderate retractions</li>
              <li>Nasal flaring, grunting</li>
              <li>Mild cyanosis (responds to low-flow O2)</li>
            </ul>
            <p className="font-medium mt-2 mb-1">CXR findings:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Perihilar streaking ("wet silhouette")</li>
              <li>Fluid in fissures</li>
              <li><strong>Hyperinflation</strong></li>
              <li>Flat diaphragms</li>
            </ul>
          </div>
        </div>

        {/* Differential Diagnosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Differential Diagnosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Condition</th>
                  <th className="text-left py-1">Distinguishing Features</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1 font-medium">RDS</td><td className="py-1">Preterm, progressive, ground glass CXR</td></tr>
                <tr><td className="py-1 font-medium">Pneumonia/Sepsis</td><td className="py-1">Risk factors, fever, WBC changes</td></tr>
                <tr><td className="py-1 font-medium">MAS</td><td className="py-1">Meconium-stained fluid, patchy infiltrates</td></tr>
                <tr><td className="py-1 font-medium">PPHN</td><td className="py-1">Severe hypoxemia, pre-post ductal gradient</td></tr>
                <tr><td className="py-1 font-medium">CHD</td><td className="py-1">Murmur, cardiomegaly, abnormal echo</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Respiratory Support:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Supplemental O2 to maintain SpO2 90-95%</li>
                <li>Usually low FiO2 sufficient (21-40%)</li>
                <li>CPAP/HFNC if FiO2 &gt;0.40 or moderate distress</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Feeding:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>NPO if RR &gt;60-70/min (aspiration risk)</li>
                <li>IV fluids until feeding safe</li>
                <li>Start feeds as tachypnea resolves</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Antibiotics:</p>
              <p>Consider empiric antibiotics pending cultures (clinical overlap with pneumonia/sepsis)</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            Note: Beta-agonists, steroids, diuretics NOT routinely recommended
          </p>
        </div>

        {/* When to Worry */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">When to Reconsider Diagnosis</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Symptoms &gt;72 hours</li>
            <li>Requiring FiO2 &gt;40%</li>
            <li>Progressive respiratory distress</li>
            <li>Fever or temperature instability</li>
            <li>Failure to improve within 24 hours</li>
          </ul>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
            → Sepsis workup, echocardiogram, transfer to higher level of care
          </p>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Full recovery within 24-72 hours</li>
            <li>No long-term pulmonary sequelae</li>
          </ul>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: AAP NeoReviews 2024, StatPearls 2024, UpToDate 2025</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default TTNBApproach;
