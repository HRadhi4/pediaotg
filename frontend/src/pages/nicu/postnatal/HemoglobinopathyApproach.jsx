/**
 * Hemoglobinopathy Screening and Counseling (Postnatal/Baby-Related)
 * Based on AAP/ACOG Guidelines
 * Reference: UpToDate, AAP Clinical Reports
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HemoglobinopathyApproach = ({ expandedSections, toggleSection }) => {
  return (
    <Card data-testid="hemoglobinopathy-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hemoglobinopathy Screening</CardTitle>
        <CardDescription className="text-xs">Newborn Screening & Counseling for Sickle Cell and Thalassemia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-[#00d9c5]">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li>Universal newborn screening for hemoglobinopathies is standard in most countries</li>
            <li>Early identification allows for prophylactic care and parental counseling</li>
            <li>~7% of pregnant individuals are carriers of alpha/beta thalassemia or Hb variants</li>
            <li>Sickle cell disease (SCD) infants require early referral and prophylaxis</li>
          </ul>
        </div>

        {/* Common Hemoglobinopathies */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Common Hemoglobinopathies</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Type</th>
                  <th className="text-left py-1">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 font-medium">Sickle Cell Disease (SCD)</td>
                  <td className="py-1">HbSS, HbSC, HbS/β-thal - vaso-occlusive crises, chronic anemia</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Sickle Cell Trait</td>
                  <td className="py-1">HbAS - carrier state, generally benign</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">β-Thalassemia Major</td>
                  <td className="py-1">Transfusion-dependent anemia</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">α-Thalassemia</td>
                  <td className="py-1">Ranges from silent carrier to Hb Bart's hydrops fetalis</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Hb E Disease</td>
                  <td className="py-1">Common in Southeast Asia; Hb E/β-thal can be severe</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Newborn Screen Results */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Interpreting Newborn Screen Results</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
            
            {/* FS Pattern */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded border-l-4 border-red-500">
              <p className="font-medium text-red-700 dark:text-red-400 mb-1">FS Pattern</p>
              <p className="mb-1"><strong>Suggests:</strong> Sickle Cell Disease (HbSS or HbS/β°-thalassemia)</p>
              <div className="space-y-1">
                <p className="font-medium">Actions:</p>
                <ul className="list-disc pl-4">
                  <li>Urgent referral to SCD specialist</li>
                  <li>Inform family of diagnosis</li>
                  <li><strong>Start penicillin prophylaxis:</strong> 125 mg PO BID</li>
                  <li>Counsel to seek immediate care for fever ≥38.3°C (101°F)</li>
                  <li>Genetic counseling for family</li>
                </ul>
              </div>
            </div>

            {/* FSA Pattern */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded border-l-4 border-amber-500">
              <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">FSA Pattern</p>
              <p className="mb-1"><strong>Suggests:</strong> Compound SCD state (HbSC or HbS/β+-thalassemia)</p>
              <div className="space-y-1">
                <p className="font-medium">Actions:</p>
                <ul className="list-disc pl-4">
                  <li>Refer to SCD specialist</li>
                  <li>Follow FS protocol until definitive diagnosis</li>
                  <li>Repeat hemoglobin electrophoresis at 3-6 months</li>
                  <li>Genetic counseling</li>
                </ul>
              </div>
            </div>

            {/* FAS Pattern */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded border-l-4 border-green-500">
              <p className="font-medium text-green-700 dark:text-green-400 mb-1">FAS Pattern</p>
              <p className="mb-1"><strong>Suggests:</strong> Sickle Cell Trait (carrier)</p>
              <div className="space-y-1">
                <p className="font-medium">Actions:</p>
                <ul className="list-disc pl-4">
                  <li>Reassurance - not a disease, child is healthy</li>
                  <li>Counsel on carrier status implications</li>
                  <li>Discuss risks under significant hypoxia (high altitude, extreme exertion with dehydration)</li>
                  <li>Offer hemoglobinopathy screening to family members</li>
                  <li>Genetic counseling for reproductive implications</li>
                </ul>
              </div>
            </div>

            {/* FA Pattern */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">FA Pattern</p>
              <p><strong>Suggests:</strong> Normal hemoglobin pattern (HbAA) - no further action needed</p>
            </div>

          </div>
        </div>

        {/* Sickle Cell Disease Management */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Early Management of SCD Infant</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Immediate Steps:</p>
              <ul className="list-disc pl-4">
                <li>Refer to pediatric hematologist/SCD center</li>
                <li>Start penicillin prophylaxis by 2 months of age (125 mg PO BID until age 5)</li>
                <li>Ensure pneumococcal, meningococcal, and Hib vaccination up to date</li>
                <li>Educate family on emergency signs</li>
              </ul>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded mt-2">
              <p className="font-medium text-red-700 dark:text-red-400">Emergency Signs - Seek Immediate Care:</p>
              <ul className="list-disc pl-4 text-red-600 dark:text-red-300">
                <li>Fever ≥38.3°C (101°F) → sepsis risk</li>
                <li>Pallor, lethargy → splenic sequestration crisis</li>
                <li>Abdominal distension → splenic sequestration</li>
                <li>Respiratory distress → acute chest syndrome</li>
                <li>Severe pain → vaso-occlusive crisis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Thalassemia */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Thalassemia</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Condition</th>
                  <th className="text-left py-1">Clinical Features</th>
                  <th className="text-left py-1">Management</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">β-Thal Major</td>
                  <td className="py-1">Severe anemia by 6-12 months</td>
                  <td className="py-1">Chronic transfusion, iron chelation</td>
                </tr>
                <tr>
                  <td className="py-1">β-Thal Intermedia</td>
                  <td className="py-1">Moderate anemia</td>
                  <td className="py-1">Variable; some need transfusion</td>
                </tr>
                <tr>
                  <td className="py-1">β-Thal Trait</td>
                  <td className="py-1">Mild microcytic anemia</td>
                  <td className="py-1">No treatment; genetic counseling</td>
                </tr>
                <tr>
                  <td className="py-1">α-Thal Trait</td>
                  <td className="py-1">Usually asymptomatic</td>
                  <td className="py-1">No treatment; genetic counseling</td>
                </tr>
                <tr>
                  <td className="py-1">Hb H Disease</td>
                  <td className="py-1">Moderate anemia, splenomegaly</td>
                  <td className="py-1">Avoid oxidant drugs; occasional transfusion</td>
                </tr>
                <tr>
                  <td className="py-1 text-red-600">Hb Bart's Hydrops</td>
                  <td className="py-1 text-red-600">Fatal without in utero intervention</td>
                  <td className="py-1 text-red-600">In utero transfusion if diagnosed prenatally</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Parental Counseling */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Parental Counseling Points</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">For Disease (SCD, Thalassemia Major):</p>
              <ul className="list-disc pl-4">
                <li>Explain the nature of the disease and expected course</li>
                <li>Discuss treatment options (transfusions, medications, potential cure with BMT/gene therapy)</li>
                <li>Emphasize importance of follow-up and compliance</li>
                <li>Connect with support groups and resources</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">For Carrier Status (Trait):</p>
              <ul className="list-disc pl-4">
                <li>Reassure that child is healthy and not affected</li>
                <li>Explain inheritance pattern (autosomal recessive)</li>
                <li>If both parents are carriers: 25% chance of affected child in future pregnancies</li>
                <li>Offer screening to partner and other family members</li>
                <li>Discuss prenatal diagnosis options for future pregnancies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Inheritance Diagram */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Inheritance Pattern (Both Parents Carriers)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="py-1"></th>
                    <th className="py-1 font-mono">A (Normal)</th>
                    <th className="py-1 font-mono">S (Sickle)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-medium font-mono">A (Normal)</td>
                    <td className="py-2 bg-green-100 dark:bg-green-900/30 font-mono">AA (25%)<br/><span className="text-[10px]">Normal</span></td>
                    <td className="py-2 bg-amber-100 dark:bg-amber-900/30 font-mono">AS (25%)<br/><span className="text-[10px]">Carrier</span></td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium font-mono">S (Sickle)</td>
                    <td className="py-2 bg-amber-100 dark:bg-amber-900/30 font-mono">AS (25%)<br/><span className="text-[10px]">Carrier</span></td>
                    <td className="py-2 bg-red-100 dark:bg-red-900/30 font-mono">SS (25%)<br/><span className="text-[10px]">Affected</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-center">25% Normal | 50% Carrier | 25% Affected</p>
          </div>
        </div>

        {/* Follow-up */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Follow-Up Recommendations</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Finding</th>
                  <th className="text-left py-1">Follow-Up</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">SCD (FS, FSC)</td>
                  <td className="py-1">Hematology within 2-4 weeks</td>
                </tr>
                <tr>
                  <td className="py-1">Sickle Cell Trait (FAS)</td>
                  <td className="py-1">PCP counseling; no hematology needed unless symptoms</td>
                </tr>
                <tr>
                  <td className="py-1">Thalassemia suspected</td>
                  <td className="py-1">Hematology referral; CBC, Hb electrophoresis at 6 months</td>
                </tr>
                <tr>
                  <td className="py-1">Other variants</td>
                  <td className="py-1">Based on specific condition; hematology consultation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default HemoglobinopathyApproach;
