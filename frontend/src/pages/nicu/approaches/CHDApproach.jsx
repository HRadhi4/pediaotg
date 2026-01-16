/**
 * Congenital Heart Disease (CHD) Approach
 * Based on AHA/AAP Guidelines
 * Reference: Circulation 2017, Pediatrics CCHD Screening
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CHDApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="chd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Congenital Heart Disease (CHD)</CardTitle>
        <CardDescription className="text-xs">Approach to Duct-Dependent Lesions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>CCHD screening:</strong> Pulse oximetry before discharge (≥24h of age)</li>
            <li><strong>PGE1:</strong> Start immediately if duct-dependent lesion suspected</li>
            <li><strong>Echo:</strong> Definitive test - consult cardiology urgently</li>
            <li><strong>Rule out sepsis:</strong> Can mimic or coexist with CHD</li>
          </ul>
        </div>

        {/* Classification */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Classification</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Cyanotic (R→L Shunt):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Tetralogy of Fallot</li>
                <li>TGA (d-Transposition)</li>
                <li>Tricuspid Atresia</li>
                <li>TAPVR</li>
                <li>Truncus Arteriosus</li>
                <li>HLHS</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Acyanotic (L→R Shunt):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>VSD</li>
                <li>ASD</li>
                <li>PDA</li>
                <li>AVSD</li>
                <li>Coarctation</li>
                <li>Aortic Stenosis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CCHD Screening */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Critical CHD Screening (Pulse Ox)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>When:</strong> ≥24 hours of age or before discharge</p>
            <p><strong>Sites:</strong> Right hand (preductal) + either foot (postductal)</p>
            <p className="mt-2 font-medium">Positive screen (FAIL):</p>
            <ul className="list-disc pl-4">
              <li>Any reading &lt;90%</li>
              <li>Both readings &lt;95% on 3 measures</li>
              <li>&gt;3% difference between hand and foot on 3 measures</li>
            </ul>
            <p className="mt-2 text-red-600 dark:text-red-400 font-medium">Positive screen → Echo + Cardiology consult</p>
          </div>
        </div>

        {/* Duct-Dependent Lesions */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Duct-Dependent Lesions</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">Duct-dependent pulmonary blood flow:</p>
              <p>Pulmonary atresia, Critical PS, Severe TOF, Tricuspid atresia</p>
            </div>
            <div>
              <p className="font-medium">Duct-dependent systemic blood flow:</p>
              <p>HLHS, Critical coarctation, Interrupted aortic arch, Critical AS</p>
            </div>
            <div>
              <p className="font-medium">Duct-dependent mixing:</p>
              <p>TGA (requires BAS), TAPVR with obstruction</p>
            </div>
          </div>
        </div>

        {/* PGE1 */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prostaglandin E1 (Alprostadil)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-medium text-red-600 dark:text-red-400">Start immediately if duct-dependent lesion suspected</p>
            
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Dosing:</p>
              <p>Start: 0.05-0.1 mcg/kg/min IV continuous</p>
              {w > 0 && <p className="font-mono text-blue-600 dark:text-blue-400">= {(w * 0.05 * 60).toFixed(1)} - {(w * 0.1 * 60).toFixed(1)} mcg/hr</p>}
              <p className="mt-1">Maintenance: 0.01-0.05 mcg/kg/min once duct open</p>
            </div>
            
            <div>
              <p className="font-medium">Side effects:</p>
              <ul className="list-disc pl-4">
                <li><strong>Apnea (12%)</strong> - be prepared to intubate</li>
                <li>Hypotension, fever, flushing</li>
                <li>Seizures, jitteriness</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Initial Stabilization */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Initial Stabilization</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong>Airway:</strong> Intubate if apneic or in severe distress</p>
            <p><strong>Oxygen:</strong> Use cautiously - can worsen some lesions (HLHS)</p>
            <p><strong>Circulation:</strong> IV access, correct acidosis, gentle volume (10 mL/kg)</p>
            <p><strong>Monitoring:</strong> 4-limb BP, pre/post-ductal SpO2</p>
            <p><strong>Labs:</strong> ABG, lactate, glucose, CBC</p>
          </div>
        </div>

        {/* Specific Lesions */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Presentations</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium">TGA:</p>
              <p>Severe cyanosis within hours, minimal response to O2, no murmur initially</p>
              <p>Needs PGE1 + urgent balloon atrial septostomy (BAS)</p>
            </div>
            <div>
              <p className="font-medium">Coarctation:</p>
              <p>Presents with shock at 3-7 days when duct closes</p>
              <p>Weak femoral pulses, BP gradient upper &gt; lower</p>
            </div>
            <div>
              <p className="font-medium">HLHS:</p>
              <p>Shock when duct closes, single S2, hepatomegaly</p>
              <p>Avoid high FiO2 (increases pulmonary blood flow)</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default CHDApproach;
