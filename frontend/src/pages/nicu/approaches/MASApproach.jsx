/**
 * MAS (Meconium Aspiration Syndrome) Approach
 * Updated: 2024/2025 Guidelines
 * References: NRP 2025, AAP, ATS Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const MASApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="mas-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Meconium Aspiration Syndrome (MAS)</CardTitle>
        <CardDescription className="text-xs">Post-Term Respiratory Distress - NRP 2025 Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Key Points
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Respiratory distress in meconium-stained infant with characteristic CXR</li>
            <li><strong>Risk:</strong> Post-term, SGA, fetal distress/hypoxia</li>
            <li><strong>Complications:</strong> PPHN (30-40%), air leaks, infection</li>
            <li><strong>NRP 2025:</strong> Vigorous infants - do NOT intubate to suction</li>
            <li><strong>iNO:</strong> Indicated when OI &gt;25 with PPHN</li>
          </ul>
        </div>

        {/* Pathophysiology */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Pathophysiology</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1 text-orange-600 dark:text-orange-400">Mechanical:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Airway obstruction</li>
                <li>Ball-valve effect</li>
                <li>Air trapping → air leaks</li>
                <li>V/Q mismatch</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1 text-purple-600 dark:text-purple-400">Chemical:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Surfactant inactivation</li>
                <li>Chemical pneumonitis</li>
                <li>Pulmonary vasoconstriction</li>
                <li>Inflammation → PPHN</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Delivery Room - NRP 2025 */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Delivery Room Management (NRP 2025)
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded border-l-4 border-green-400">
              <p className="font-medium text-green-700 dark:text-green-400">Vigorous infant (HR &gt;100, good tone, breathing):</p>
              <ul className="ml-3 space-y-0.5">
                <li>• <strong>Routine care</strong> - NO intubation for suctioning</li>
                <li>• Bulb suction of mouth/nose only if needed</li>
                <li>• Clear airway without deep suctioning</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded border-l-4 border-red-400">
              <p className="font-medium text-red-700 dark:text-red-400">Non-vigorous infant:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Begin PPV as needed per NRP algorithm</li>
                <li>• Intubation for ventilation if required</li>
                <li>• Consider suctioning if thick meconium obstructing airway</li>
                <li>• Do NOT delay resuscitation for suctioning</li>
              </ul>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded">
              <p className="text-amber-700 dark:text-amber-400 text-[10px]">
                <strong>Key change:</strong> Routine intubation and tracheal suctioning is NO longer recommended for non-vigorous infants - prioritize ventilation
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Features</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Signs:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Meconium staining of skin, nails, cord</li>
              <li>Respiratory distress (tachypnea, retractions, grunting)</li>
              <li><strong>Barrel chest</strong> (air trapping)</li>
              <li>Crackles and rhonchi on auscultation</li>
              <li>Cyanosis (may be severe if PPHN)</li>
            </ul>
            <p className="font-medium mt-2 mb-1">CXR findings:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>Patchy infiltrates</strong> (asymmetric)</li>
              <li><strong>Hyperinflation</strong></li>
              <li>Flattened diaphragms</li>
              <li>Air leaks (pneumothorax, pneumomediastinum) - 10-20%</li>
              <li>Coarse, irregular opacities</li>
            </ul>
          </div>
        </div>

        {/* NICU Management */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">NICU Management (2024/2025 Guidelines)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Respiratory Support:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Oxygen to maintain <strong>SpO2 92-97%</strong> (preductal)</li>
                <li>• CPAP or mechanical ventilation as needed</li>
                <li>• <strong>Avoid high PEEP</strong> (risk of air leak with air trapping)</li>
                <li>• HFOV if conventional ventilation fails</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Surfactant Therapy:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• <strong>Consider bolus surfactant</strong> if intubated with significant parenchymal disease</li>
                <li>• Reduces need for ECMO and mechanical ventilation duration</li>
                <li>• May need <strong>higher/repeated doses</strong> (up to 4 doses)</li>
                <li>• Use early for optimal benefit</li>
              </ul>
              {w > 0 && (
                <div className="mt-1 p-1 bg-blue-50 dark:bg-blue-900/30 rounded font-mono text-blue-600 dark:text-blue-400">
                  <p>Survanta: {(w * 4).toFixed(1)} mL (4 mL/kg)</p>
                  <p>Curosurf: {(w * 2.5).toFixed(1)} mL (2.5 mL/kg)</p>
                </div>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Antibiotics:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Empiric antibiotics (Ampicillin + Gentamicin)</li>
                <li>• Meconium is not sterile - risk of secondary infection</li>
                <li>• Discontinue after 48-72h if cultures negative</li>
              </ul>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 dark:text-blue-400">Sedation:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Minimize agitation (worsens PPHN)</li>
                <li>• Morphine or fentanyl infusion</li>
                <li>• Avoid paralysis unless necessary</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PPHN Management */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">PPHN Management (Common in MAS)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium">PPHN occurs in 30-40% of MAS cases</p>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-purple-600 dark:text-purple-400">Treatment approach:</p>
              <ul className="ml-3 space-y-0.5">
                <li>• Optimize oxygenation and ventilation first</li>
                <li>• Maintain systemic BP &gt; pulmonary BP</li>
                <li>• <strong>iNO 20 ppm</strong> when OI &gt;25 (firmly established therapy)</li>
                <li>• iNO + HFOV produces greatest oxygenation improvement</li>
                <li>• Sildenafil as adjunct if iNO-refractory</li>
              </ul>
            </div>
            <p className="text-purple-600 dark:text-purple-400">
              → See PPHN approach for detailed management
            </p>
          </div>
        </div>

        {/* Complications */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Complications
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>PPHN</strong> (30-40%)</li>
              <li>Air leak syndromes (10-20%)</li>
              <li>Respiratory failure requiring ECMO</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Secondary pneumonia</li>
              <li>HIE (if perinatal asphyxia)</li>
              <li>Death (~5% with severe PPHN)</li>
            </ul>
          </div>
        </div>

        {/* ECMO Criteria */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">ECMO Criteria</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Consider ECMO if:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>OI &gt;40 despite optimal management (iNO, HFOV)</li>
              <li>Preductal SpO2 &lt;85% despite maximal therapy</li>
              <li>Refractory hypotension/shock</li>
              <li>Severe acidosis (pH &lt;7.15)</li>
            </ul>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1 font-medium text-green-600 dark:text-green-400">Generally favorable with modern therapy:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Most recover fully if no severe PPHN or associated HIE</li>
              <li>Survival &gt;90% with iNO and ECMO availability</li>
              <li>Increased risk of reactive airway disease in childhood</li>
              <li>Neurodevelopmental outcomes depend on associated HIE</li>
              <li>Close follow-up recommended</li>
            </ul>
          </div>
        </div>

        {/* References */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p>References: NRP 2025 (9th Edition), ATS Guidelines, AAP Pediatrics 2024</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default MASApproach;
