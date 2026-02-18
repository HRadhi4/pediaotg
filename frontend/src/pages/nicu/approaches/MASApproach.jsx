/**
 * MAS (Meconium Aspiration Syndrome) Approach
 * Updated: 2024/2025 Guidelines
 * Design: Standardized to match HypoglycemiaApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MASApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="mas-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Meconium Aspiration Syndrome (MAS)</CardTitle>
        <CardDescription className="text-xs">Post-Term Respiratory Distress - NRP 2025</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Respiratory distress in meconium-stained infant with characteristic CXR</li>
            <li><strong>Risk:</strong> Post-term, SGA, fetal distress/hypoxia</li>
            <li><strong>Complications:</strong> PPHN (30-40%), air leaks, infection</li>
            <li><strong>NRP 2025:</strong> Vigorous infants - do NOT intubate to suction</li>
          </ul>
        </div>

        {/* Pathophysiology */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Pathophysiology</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Mechanical:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Airway obstruction</li>
                <li>Ball-valve effect</li>
                <li>Air trapping → air leaks</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Chemical:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Surfactant inactivation</li>
                <li>Chemical pneumonitis</li>
                <li>Pulmonary vasoconstriction</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Delivery Room */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Delivery Room (NRP 2025)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded border-l-2 border-green-400">
              <p className="font-medium text-green-700 dark:text-green-400">Vigorous infant (HR &gt;100, good tone, breathing):</p>
              <p>Routine care - NO intubation for suctioning</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded border-l-2 border-red-400">
              <p className="font-medium text-red-700 dark:text-red-400">Non-vigorous infant:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Begin PPV as needed per NRP</li>
                <li>Intubation for ventilation if required</li>
                <li>Do NOT delay resuscitation for suctioning</li>
              </ul>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            Key change: Routine tracheal suctioning NO longer recommended
          </p>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Features</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Signs:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Meconium staining of skin, nails, cord</li>
              <li>Respiratory distress</li>
              <li><strong>Barrel chest</strong> (air trapping)</li>
              <li>Crackles and rhonchi</li>
            </ul>
            <p className="font-medium mt-2 mb-1">CXR findings:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Patchy infiltrates</strong> (asymmetric)</li>
              <li><strong>Hyperinflation</strong></li>
              <li>Air leaks (10-20%)</li>
            </ul>
          </div>
        </div>

        {/* NICU Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">NICU Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Respiratory Support:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>O2 to maintain SpO2 92-97% (preductal)</li>
                <li>Avoid high PEEP (air leak risk)</li>
                <li>HFOV if conventional fails</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Surfactant:</p>
              <p>Consider if intubated with parenchymal disease</p>
              <p>May need higher/repeated doses (up to 4)</p>
              {w > 0 && (
                <div className="mt-1">
                  <p className="font-mono text-blue-600">Survanta: {(w * 4).toFixed(1)} mL (4 mL/kg)</p>
                  <p className="font-mono text-blue-600">Curosurf: {(w * 2.5).toFixed(1)} mL (2.5 mL/kg)</p>
                </div>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Antibiotics:</p>
              <p>Empiric Ampicillin + Gentamicin (meconium not sterile)</p>
            </div>
          </div>
        </div>

        {/* PPHN Management */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">PPHN Management (30-40% of MAS)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Optimize oxygenation and ventilation</li>
              <li>Maintain systemic BP &gt; pulmonary BP</li>
              <li><strong>iNO 20 ppm</strong> when OI &gt;25</li>
              <li>iNO + HFOV = greatest oxygenation improvement</li>
              <li>Sildenafil as adjunct if iNO-refractory</li>
            </ul>
            <p className="text-blue-600 dark:text-blue-400 mt-2">
              → See PPHN approach for details
            </p>
          </div>
        </div>

        {/* Complications */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Complications</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>PPHN</strong> (30-40%)</li>
              <li>Air leak syndromes (10-20%)</li>
              <li>ECMO requirement</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Secondary pneumonia</li>
              <li>HIE (if asphyxia)</li>
              <li>Death (~5% severe)</li>
            </ul>
          </div>
        </div>

        {/* ECMO */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">ECMO Criteria</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>OI &gt;40 despite optimal management</li>
            <li>Preductal SpO2 &lt;85% despite maximal therapy</li>
            <li>Refractory hypotension/shock</li>
          </ul>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Survival &gt;90% with iNO and ECMO</li>
            <li>Increased risk of reactive airway disease</li>
            <li>Outcomes depend on associated HIE</li>
          </ul>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: NRP 2025 (9th Edition), ATS Guidelines, AAP Pediatrics 2024</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default MASApproach;
