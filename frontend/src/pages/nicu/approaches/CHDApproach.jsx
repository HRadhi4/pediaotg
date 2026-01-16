/**
 * CHD (Congenital Heart Disease) Approach
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CHDApproach = ({ weight }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="chd-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Congenital Heart Disease (CHD)</CardTitle>
        <CardDescription className="text-xs">Cyanotic vs Acyanotic Lesions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Hyperoxia test:</strong> PaO2 &gt;150 on 100% O2 suggests non-cardiac cause</li>
            <li><strong>Prostaglandin E1:</strong> Keep ductus open in ductal-dependent lesions</li>
            <li><strong>Four limb BPs/SpO2:</strong> Screen for coarctation</li>
            <li><strong>Echo:</strong> Definitive diagnosis</li>
          </ul>
        </div>

        {/* Classification */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Classification</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium text-blue-600 mb-1">Cyanotic (R→L shunt):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Tetralogy of Fallot</li>
                <li>TGA</li>
                <li>Truncus arteriosus</li>
                <li>Total anomalous pulm venous return</li>
                <li>Tricuspid atresia</li>
              </ul>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
              <p className="font-medium text-pink-600 mb-1">Acyanotic (L→R shunt):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>VSD</li>
                <li>ASD</li>
                <li>PDA</li>
                <li>AV canal</li>
                <li>Coarctation of aorta</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ductal-Dependent Lesions */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Ductal-Dependent Lesions - Start PGE1!</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium mb-1">Pulmonary flow dependent:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Critical PS / Pulm atresia</li>
                <li>Severe TOF</li>
                <li>Tricuspid atresia</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Systemic flow dependent:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>HLHS</li>
                <li>Critical coarctation</li>
                <li>Interrupted aortic arch</li>
                <li>Critical AS</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PGE1 Dosing */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prostaglandin E1 (Alprostadil)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Dosing:</p>
            <p>• Start: 0.05-0.1 mcg/kg/min</p>
            <p>• Once ductus open: wean to 0.01-0.05 mcg/kg/min</p>
            <p>• Max: 0.4 mcg/kg/min</p>
            {w > 0 && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="font-medium">For {w} kg:</p>
                <p>Start: <span className="font-mono text-blue-600">{(w * 0.05 * 60).toFixed(1)}-{(w * 0.1 * 60).toFixed(1)} mcg/hr</span></p>
              </div>
            )}
            <p className="font-medium mt-2 mb-1">Side effects:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Apnea (12%) - have intubation ready</li>
              <li>Hypotension</li>
              <li>Fever</li>
              <li>Flushing</li>
            </ul>
          </div>
        </div>

        {/* Hyperoxia Test */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Hyperoxia Test</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2">Give 100% O2 for 10 min, then measure PaO2:</p>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">PaO2 Result</th>
                  <th className="text-left py-1">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1">&gt;150 mmHg</td><td className="text-green-600">Likely pulmonary disease</td></tr>
                <tr><td className="py-1">100-150 mmHg</td><td className="text-yellow-600">Possible cardiac or PPHN</td></tr>
                <tr><td className="py-1">&lt;100 mmHg</td><td className="text-red-600">Likely cyanotic CHD</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Initial Workup */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Initial Workup</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li><strong>4-limb BP and SpO2</strong> (upper vs lower)</li>
            <li><strong>CXR</strong> - heart size, pulmonary vascularity</li>
            <li><strong>ECG</strong> - axis, hypertrophy</li>
            <li><strong>Echo</strong> - definitive diagnosis</li>
            <li><strong>ABG</strong> - assess acidosis</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
};

export default CHDApproach;
