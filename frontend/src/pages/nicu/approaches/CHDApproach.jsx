/**
 * Congenital Heart Disease (CHD) Approach
 * Updated: 2024 AHA/AAP CCHD Screening Guidelines
 * Reference: Circulation 2024, Pediatrics CCHD Screening
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CHDApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="chd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Congenital Heart Disease (CHD)</CardTitle>
        <CardDescription className="text-xs">Approach to Duct-Dependent Lesions</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 AHA/AAP CCHD Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2024)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p>• <strong>CCHD screening:</strong> Pulse oximetry before discharge (≥24h of age)</p>
            <p>• <strong>PGE1:</strong> Start immediately if duct-dependent lesion suspected</p>
            <p>• <strong>Echo:</strong> Definitive test - consult cardiology urgently</p>
            <p>• <strong>Rule out sepsis:</strong> Can mimic or coexist with CHD</p>
          </div>
        </div>

        {/* Classification */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Classification</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-blue-600">
            <div>
              <p className="font-bold">Cyanotic (R→L Shunt):</p>
              <p>• Tetralogy of Fallot</p>
              <p>• TGA (d-Transposition)</p>
              <p>• Tricuspid Atresia</p>
              <p>• TAPVR</p>
              <p>• Truncus Arteriosus</p>
              <p>• HLHS</p>
            </div>
            <div>
              <p className="font-bold">Acyanotic (L→R Shunt):</p>
              <p>• VSD</p>
              <p>• ASD</p>
              <p>• PDA</p>
              <p>• AVSD</p>
              <p>• Coarctation</p>
              <p>• Aortic Stenosis</p>
            </div>
          </div>
        </div>

        {/* CCHD Screening */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Critical CHD Screening (Pulse Ox)</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p><strong>When:</strong> ≥24 hours of age or before discharge</p>
            <p><strong>Sites:</strong> Right hand (preductal) + either foot (postductal)</p>
            
            <p className="font-bold mt-1">Positive screen (FAIL):</p>
            <p>• Any reading &lt;90%</p>
            <p>• Both readings &lt;95% on 3 measures (1 hr apart)</p>
            <p>• &gt;3% difference between hand and foot on 3 measures</p>
            
            <p className="mt-1 text-red-600 font-bold">Positive screen → Echo + Cardiology consult</p>
          </div>
        </div>

        {/* Duct-Dependent Lesions */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Duct-Dependent Lesions</p>
          <div className="text-[8px] text-purple-600 space-y-2">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Duct-dependent pulmonary blood flow:</p>
              <p>Pulmonary atresia, Critical PS, Severe TOF, Tricuspid atresia</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Duct-dependent systemic blood flow:</p>
              <p>HLHS, Critical coarctation, Interrupted aortic arch, Critical AS</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Duct-dependent mixing:</p>
              <p>TGA (requires BAS), TAPVR with obstruction</p>
            </div>
          </div>
        </div>

        {/* PGE1 */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Prostaglandin E1 (Alprostadil)</p>
          <div className="text-[8px] space-y-1">
            <p className="text-red-400 font-bold">Start IMMEDIATELY if duct-dependent lesion suspected</p>
            
            <div className="p-1.5 bg-gray-700 rounded mt-1">
              <p className="font-bold">Dosing:</p>
              <p>Start: <strong>0.05-0.1 mcg/kg/min</strong> IV continuous</p>
              {w > 0 && <p className="font-mono text-green-400">= {(w * 0.05 * 60).toFixed(1)} - {(w * 0.1 * 60).toFixed(1)} mcg/hr</p>}
              <p className="mt-1">Maintenance: 0.01-0.05 mcg/kg/min once duct open</p>
            </div>
            
            <div className="mt-2">
              <p className="font-bold text-amber-400">Side Effects:</p>
              <p>• <strong>Apnea (12%)</strong> - be prepared to intubate</p>
              <p>• Hypotension, fever, flushing</p>
              <p>• Seizures, jitteriness</p>
            </div>
          </div>
        </div>

        {/* Initial Stabilization */}
        <div className="p-2 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-1">Initial Stabilization</p>
          <div className="text-[8px] text-teal-600 space-y-1">
            <p><strong>Airway:</strong> Intubate if apneic or in severe distress</p>
            <p><strong>Oxygen:</strong> Use cautiously - can worsen some lesions (HLHS)</p>
            <p><strong>Circulation:</strong> IV access, correct acidosis, gentle volume (10 mL/kg)</p>
            <p><strong>Monitoring:</strong> 4-limb BP, pre/post-ductal SpO2</p>
            <p><strong>Labs:</strong> ABG, lactate, glucose, CBC</p>
          </div>
        </div>

        {/* Specific Lesions */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Key Presentations</p>
          <div className="text-[8px] text-indigo-600 space-y-2">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">TGA (Transposition of Great Arteries):</p>
              <p>Severe cyanosis within hours, minimal response to O2, no murmur initially</p>
              <p className="text-red-600">Needs PGE1 + urgent balloon atrial septostomy (BAS)</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Coarctation:</p>
              <p>Presents with shock at 3-7 days when duct closes</p>
              <p>Weak femoral pulses, BP gradient upper &gt; lower</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">HLHS:</p>
              <p>Shock when duct closes, single S2, hepatomegaly</p>
              <p className="text-amber-600">Avoid high FiO2 (increases pulmonary blood flow → steals from systemic)</p>
            </div>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Early diagnosis critical - CCHD screening saves lives</p>
            <p>• Surgical outcomes excellent in experienced centers</p>
            <p>• Long-term follow-up needed for all CHD patients</p>
            <p>• Neurodevelopmental monitoring recommended</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default CHDApproach;
