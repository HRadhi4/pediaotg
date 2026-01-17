/**
 * Infant with Mother with Asymptomatic Bacteriuria (ASB)
 * Based on AAP/IDSA Guidelines
 * Reference: UpToDate, AAP Pediatrics in Review, IDSA Guidelines 2019
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AsymptomaticBacteriuriaApproach = ({ expandedSections, toggleSection }) => {
  return (
    <Card data-testid="asymptomatic-bacteriuria-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Infant of Mother with Asymptomatic Bacteriuria</CardTitle>
        <CardDescription className="text-xs">AAP/IDSA Guidelines - Postnatal Management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-[#00d9c5]">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>NO routine screening or treatment</strong> of ASB in healthy newborns/infants</li>
            <li>Maternal ASB treatment is for <strong>maternal benefit</strong> (prevent pyelonephritis, preterm birth)</li>
            <li>Infant management based on <strong>symptoms</strong>, not maternal ASB status</li>
            <li>ASB in infants is common (~1%) and benign - does NOT cause renal scarring</li>
          </ul>
        </div>

        {/* Definition */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Definitions</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium text-blue-700 dark:text-blue-400">Asymptomatic Bacteriuria (ASB):</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Significant bacteriuria (≥100,000 CFU/mL) of a single organism</li>
                <li><strong>Without</strong> pyuria (no WBCs in urine)</li>
                <li><strong>Without</strong> symptoms of UTI</li>
              </ul>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-medium text-amber-700 dark:text-amber-400">Symptomatic UTI (contrast):</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Positive urine culture</li>
                <li><strong>WITH</strong> pyuria (leukocytes on UA)</li>
                <li><strong>WITH</strong> symptoms (fever, irritability, poor feeding, etc.)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* IDSA/AAP Recommendations */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">IDSA/AAP Recommendations for Infants</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-green-700 dark:text-green-400 mb-1">
                ✓ DO NOT screen for ASB in healthy infants/children
              </p>
              <p className="text-slate-500">Grade: Strong recommendation, moderate evidence</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-green-700 dark:text-green-400 mb-1">
                ✓ DO NOT treat ASB in infants/children
              </p>
              <p className="text-slate-500">Exceptions: Pre-urologic procedures, pregnancy</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-green-700 dark:text-green-400 mb-1">
                ✓ Maternal ASB status does NOT change infant management
              </p>
              <p className="text-slate-500">Infant care is based on infant's symptoms only</p>
            </div>
          </div>
        </div>

        {/* Why No Treatment */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Why NOT to Treat ASB in Infants</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="font-medium text-green-700 dark:text-green-400 mb-1">No Benefit:</p>
                <ul className="list-disc pl-4">
                  <li>No reduction in UTI risk</li>
                  <li>No prevention of renal scarring</li>
                  <li>No improvement in outcomes</li>
                </ul>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <p className="font-medium text-red-700 dark:text-red-400 mb-1">Harms:</p>
                <ul className="list-disc pl-4">
                  <li>Antibiotic resistance</li>
                  <li>Adverse drug effects</li>
                  <li>Microbiome disruption</li>
                  <li>Unnecessary healthcare costs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Management Algorithm */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management of Infant (Mother with ASB)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
            
            {/* Well Infant */}
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-500">
              <p className="font-medium text-green-700 dark:text-green-400 mb-1">Well-Appearing Infant:</p>
              <ul className="list-disc pl-4">
                <li>Routine newborn care</li>
                <li><strong>NO urine testing</strong> required</li>
                <li><strong>NO antibiotics</strong></li>
                <li>Standard discharge criteria</li>
                <li>Routine follow-up</li>
              </ul>
            </div>

            {/* Symptomatic Infant */}
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-500">
              <p className="font-medium text-red-700 dark:text-red-400 mb-1">Symptomatic Infant (fever, lethargy, poor feeding, etc.):</p>
              <ul className="list-disc pl-4">
                <li>Evaluate for <strong>sepsis</strong> (not UTI workup alone)</li>
                <li>Blood culture, urine culture (catheterized/SPA)</li>
                <li>Consider LP in infants &lt;28 days or ill-appearing</li>
                <li>Treat based on clinical status and culture results</li>
                <li>Maternal ASB history does NOT change workup</li>
              </ul>
            </div>
          </div>
        </div>

        {/* When to Obtain Urine Culture */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">When to Obtain Urine Culture in Infants</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium mb-1">AAP recommends urine culture when:</p>
            <ul className="list-disc pl-4">
              <li>Febrile infant 2-24 months with no clear source</li>
              <li>Ill-appearing infant with suspected infection</li>
              <li>Urinalysis positive (leukocyte esterase, nitrites, pyuria)</li>
            </ul>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded mt-2">
              <p className="font-medium text-amber-700 dark:text-amber-400">Important:</p>
              <p>Require <strong>BOTH</strong> positive UA (pyuria) AND symptoms to diagnose UTI</p>
              <p>Positive culture alone without pyuria = ASB (do not treat)</p>
            </div>
          </div>
        </div>

        {/* Collection Methods */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Urine Collection (When Indicated)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Method</th>
                  <th className="text-left py-1">Use</th>
                  <th className="text-left py-1">CFU/mL Threshold</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50 dark:bg-green-900/20">
                  <td className="py-1 font-medium">Suprapubic aspiration</td>
                  <td className="py-1">Gold standard</td>
                  <td className="py-1">Any growth</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Catheterization</td>
                  <td className="py-1">Preferred in most cases</td>
                  <td className="py-1">≥50,000</td>
                </tr>
                <tr className="text-red-600 dark:text-red-400">
                  <td className="py-1 font-medium">Bag specimen</td>
                  <td className="py-1">For UA only, NOT culture</td>
                  <td className="py-1">High contamination</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Maternal ASB Management */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Why Mothers ARE Treated (Context)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-medium text-blue-700 dark:text-blue-400 mb-1">Pregnancy is the ONE exception for ASB treatment:</p>
            <ul className="list-disc pl-4">
              <li>Prevents maternal pyelonephritis (20-40% progress if untreated)</li>
              <li>Reduces preterm birth risk</li>
              <li>Reduces low birth weight risk</li>
              <li>Treatment: 4-7 day antibiotic course</li>
            </ul>
            <p className="mt-2 text-slate-500 italic">
              This maternal benefit does NOT translate to infant treatment needs
            </p>
          </div>
        </div>

        {/* Summary Box */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Summary: Take-Home Points</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>✓ Maternal ASB ≠ infant infection risk requiring action</p>
            <p>✓ Well infants of mothers with ASB need <strong>routine care only</strong></p>
            <p>✓ Do NOT screen or treat ASB in infants</p>
            <p>✓ Infant symptoms (fever, ill-appearing) warrant sepsis workup regardless of maternal ASB</p>
            <p>✓ True UTI requires: symptoms + pyuria + positive culture</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default AsymptomaticBacteriuriaApproach;
