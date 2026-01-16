/**
 * Neonatal Jaundice (Hyperbilirubinemia) Approach
 * Based on AAP 2022 Clinical Practice Guideline
 * Reference: Pediatrics 2022;150(3):e2022058859
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const JaundiceApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;

  return (
    <Card data-testid="jaundice-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Neonatal Hyperbilirubinemia</CardTitle>
        <CardDescription className="text-xs">AAP 2022 Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Updates */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">AAP 2022 Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Universal screening:</strong> Measure bilirubin (TcB or TSB) before discharge</li>
            <li><strong>Risk stratification:</strong> Based on GA, neurotoxicity risk, hyperbilirubinemia risk</li>
            <li><strong>Higher thresholds:</strong> Phototherapy thresholds increased for low-risk infants</li>
            <li><strong>Use nomograms:</strong> BiliTool (bilitool.org) for phototherapy decisions</li>
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Hyperbilirubinemia Risk:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Pre-discharge TSB in high zone</li>
                <li>Jaundice &lt;24 hours</li>
                <li>Blood group incompatibility</li>
                <li>GA 35-37 weeks</li>
                <li>Sibling with phototherapy</li>
                <li>Cephalohematoma/bruising</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Neurotoxicity Risk:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>GA &lt;38 weeks</li>
                <li>Albumin &lt;3.0 g/dL</li>
                <li>Hemolytic disease</li>
                <li>Sepsis</li>
                <li>Acidosis</li>
                <li>Clinical instability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Phototherapy Thresholds */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Phototherapy Thresholds (Term ≥38 wks)</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Age (hours)</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Low Risk</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Medium Risk</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">High Risk</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">24</td><td>12</td><td>10.5</td><td>9</td></tr>
              <tr><td className="py-1">48</td><td>15</td><td>13</td><td>11</td></tr>
              <tr><td className="py-1">72</td><td>18</td><td>15.5</td><td>13.5</td></tr>
              <tr><td className="py-1">96+</td><td>20</td><td>17</td><td>15</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">Values in mg/dL. Use BiliTool for exact thresholds.</p>
        </div>

        {/* Preterm Thresholds */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Preterm Thresholds (&lt;35 weeks)</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">GA (weeks)</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Phototherapy</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Exchange</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className={ga > 0 && ga < 28 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">&lt;28</td><td>5-6</td><td>11-14</td>
              </tr>
              <tr className={ga >= 28 && ga < 30 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">28-30</td><td>6-8</td><td>12-14</td>
              </tr>
              <tr className={ga >= 30 && ga < 32 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">30-32</td><td>8-10</td><td>13-16</td>
              </tr>
              <tr className={ga >= 32 && ga < 34 ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                <td className="py-1">32-34</td><td>10-12</td><td>15-18</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Phototherapy Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Phototherapy</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Initiation:</p>
              <p>• Use intensive phototherapy if near exchange threshold</p>
              <p>• Blue LED lights most effective (wavelength 460-490 nm)</p>
              <p>• Maximize skin exposure, eye protection required</p>
            </div>
            <div>
              <p className="font-medium">Monitoring:</p>
              <p>• Check TSB 4-6 hours after starting</p>
              <p>• Then every 6-12 hours until stable/decreasing</p>
            </div>
            <div>
              <p className="font-medium">Discontinue when:</p>
              <p>• TSB 2-3 mg/dL below threshold</p>
              <p>• Recheck 12-24 hours after stopping</p>
            </div>
          </div>
        </div>

        {/* Exchange Transfusion */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Exchange Transfusion</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium text-red-600 dark:text-red-400">Immediate if signs of acute bilirubin encephalopathy</p>
            
            <div>
              <p className="font-medium">Volume:</p>
              <p>Double volume exchange = 160-180 mL/kg</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 170).toFixed(0)} mL</p>}
            </div>
            
            <div>
              <p className="font-medium">Blood product:</p>
              <p>• O-negative or type-specific PRBCs</p>
              <p>• Cross-matched against mother</p>
              <p>• Irradiated, CMV-negative</p>
            </div>
          </div>
        </div>

        {/* IVIG */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">IVIG</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium">Indication:</p>
            <p>Isoimmune hemolytic disease (positive DAT) with TSB rising despite intensive phototherapy or within 2-3 mg/dL of exchange threshold</p>
            <p className="mt-2"><strong>Dose:</strong> 0.5-1 g/kg IV over 2 hours</p>
            {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 0.5).toFixed(1)} - {(w * 1).toFixed(1)} g</p>}
          </div>
        </div>

        {/* Bilirubin Encephalopathy */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Acute Bilirubin Encephalopathy (ABE)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium text-red-600 dark:text-red-400 mb-1">Medical Emergency - Requires immediate exchange</p>
            <p><strong>Early:</strong> Lethargy, hypotonia, poor suck</p>
            <p><strong>Intermediate:</strong> Moderate stupor, irritability, hypertonia</p>
            <p><strong>Advanced:</strong> Opisthotonos, shrill cry, apnea, seizures</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default JaundiceApproach;
