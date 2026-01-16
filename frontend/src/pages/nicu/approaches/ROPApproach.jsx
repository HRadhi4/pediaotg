/**
 * Retinopathy of Prematurity (ROP) Approach
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ROPApproach = ({ weight, gestationalAge, postnatalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;
  const pna = parseFloat(postnatalAge) || 0;
  const pmaWeeks = ga + (pna / 7);

  // Calculate first screening time
  const getFirstScreeningPMA = () => {
    if (ga <= 27) return 31;
    if (ga >= 28) return 31; // or 4 weeks postnatal, whichever is later
    return 31;
  };

  return (
    <Card data-testid="rop-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Retinopathy of Prematurity (ROP)</CardTitle>
        <CardDescription className="text-xs">Screening & Management Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Risk:</strong> Lower GA and BW = higher risk</li>
            <li><strong>Oxygen:</strong> Target SpO2 90-95% to reduce risk</li>
            <li><strong>Screening:</strong> Dilated fundoscopy by ophthalmologist</li>
            <li><strong>Treatment:</strong> Laser or anti-VEGF for severe ROP</li>
          </ul>
          {pmaWeeks > 0 && (
            <p className="text-xs mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              Current PMA: <strong>{pmaWeeks.toFixed(1)} weeks</strong>
            </p>
          )}
        </div>

        {/* Screening Criteria */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Screening Criteria (AAP 2018)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Screen ALL infants:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Birth weight ≤1500g, OR</li>
              <li>Gestational age ≤30 weeks, OR</li>
              <li>Selected infants 1500-2000g with unstable course</li>
            </ul>
            {ga > 0 && ga <= 30 && (
              <p className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-300">
                ✓ This infant qualifies for ROP screening
              </p>
            )}
          </div>
        </div>

        {/* Timing */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">First Examination Timing</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">GA at Birth</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Postmenstrual Age</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Postnatal Age</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className={ga >= 22 && ga <= 23 ? "bg-blue-50 dark:bg-blue-900/20" : ""}><td className="py-1">22-23 wks</td><td>31 weeks</td><td>8-9 weeks</td></tr>
              <tr className={ga >= 24 && ga <= 25 ? "bg-blue-50 dark:bg-blue-900/20" : ""}><td className="py-1">24-25 wks</td><td>31 weeks</td><td>6-7 weeks</td></tr>
              <tr className={ga >= 26 && ga <= 27 ? "bg-blue-50 dark:bg-blue-900/20" : ""}><td className="py-1">26-27 wks</td><td>31 weeks</td><td>4-5 weeks</td></tr>
              <tr className={ga >= 28 && ga <= 30 ? "bg-blue-50 dark:bg-blue-900/20" : ""}><td className="py-1">28-30 wks</td><td>32 weeks</td><td>4 weeks</td></tr>
            </tbody>
          </table>
        </div>

        {/* Classification */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">ICROP Classification</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Zone (location):</p>
            <p className="mb-2">I (posterior) → II (intermediate) → III (peripheral)</p>
            
            <p className="font-medium mb-1">Stage (severity):</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Stage 1:</strong> Demarcation line</li>
              <li><strong>Stage 2:</strong> Ridge</li>
              <li><strong>Stage 3:</strong> Ridge with neovascularization</li>
              <li><strong>Stage 4:</strong> Partial retinal detachment</li>
              <li><strong>Stage 5:</strong> Total retinal detachment</li>
            </ul>
            
            <p className="font-medium mt-2 mb-1">Plus disease:</p>
            <p>Venous dilation + arterial tortuosity at posterior pole</p>
          </div>
        </div>

        {/* Treatment */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Treatment Indications</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Type 1 ROP - Treat within 72 hours:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Zone I: Any stage with plus disease</li>
              <li>Zone I: Stage 3 without plus disease</li>
              <li>Zone II: Stage 2 or 3 with plus disease</li>
            </ul>
            
            <p className="font-medium mt-2 mb-1">Treatment options:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Laser photocoagulation</strong> - gold standard</li>
              <li><strong>Anti-VEGF (bevacizumab)</strong> - especially Zone I</li>
            </ul>
          </div>
        </div>

        {/* Prevention */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prevention Strategies</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-1">
            <li><strong>Oxygen targeting:</strong> SpO2 90-95% (avoid hyperoxia)</li>
            <li>Minimize O2 fluctuations</li>
            <li>Adequate nutrition</li>
            <li>Infection prevention</li>
            <li>Avoid prolonged mechanical ventilation</li>
          </ul>
        </div>

        {/* Follow-up */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Follow-up After Discharge</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>Continue exams until retina fully vascularized (Zone III) or:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>54 weeks PMA for Zone II disease</li>
              <li>Full vascularization documented</li>
              <li>Regression of ROP confirmed</li>
            </ul>
            <p className="mt-2">Long-term: annual eye exams (risk of myopia, strabismus)</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ROPApproach;
