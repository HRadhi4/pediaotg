/**
 * Patent Ductus Arteriosus (PDA) Approach
 * Updated: 2024 UK/NZ Guidelines & Evidence
 * Reference: Thames Valley/Wessex 2024, HealthShare NZ, JAMA Pediatrics
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PDAApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="pda-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Patent Ductus Arteriosus (PDA)</CardTitle>
        <CardDescription className="text-xs">Diagnosis & Management</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 Guidelines (UK/NZ/International)</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2024)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p>• Incidence: ~70% in &lt;28 weeks, ~30% in 28-32 weeks</p>
            <p>• <strong>Many close spontaneously</strong> - conservative approach often appropriate</p>
            <p>• Treatment controversial - <strong>individualize decision based on hsPDA</strong></p>
            <p>• Early routine closure (&lt;72h or &lt;7-14 days) shows <strong>NO benefit</strong></p>
            <p>• Target: hemodynamically significant PDA (hsPDA) only</p>
            {ga > 0 && ga < 28 && (
              <p className="bg-amber-100 p-1 rounded mt-1">
                At {ga} weeks: ~70% will have PDA; observe for hemodynamic significance
              </p>
            )}
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Clinical Features of hsPDA</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-blue-600">
            <div>
              <p className="font-bold">Cardiac:</p>
              <p>• Continuous/"machinery" murmur (may be absent)</p>
              <p>• Hyperdynamic precordium</p>
              <p>• Bounding peripheral pulses</p>
              <p>• Wide pulse pressure (&gt;25 mmHg)</p>
            </div>
            <div>
              <p className="font-bold">Systemic:</p>
              <p>• Increasing respiratory support</p>
              <p>• Feeding intolerance</p>
              <p>• Renal impairment (↓UOP)</p>
              <p>• Metabolic acidosis</p>
            </div>
          </div>
        </div>

        {/* Echo Criteria - 2024 */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">Echo Criteria for hsPDA (2024)</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p className="font-bold">Size Classification:</p>
            <table className="w-full text-[7px] mb-2">
              <tbody>
                <tr><td className="pr-2 text-green-600 font-bold">Small:</td><td>&lt;1.5 mm</td></tr>
                <tr><td className="pr-2 text-amber-600 font-bold">Moderate:</td><td>1.5-3 mm</td></tr>
                <tr><td className="pr-2 text-red-600 font-bold">Large:</td><td>&gt;3 mm OR &gt;1.5 mm/kg</td></tr>
              </tbody>
            </table>
            
            <p className="font-bold">Hemodynamic Significance Criteria:</p>
            <p>• <strong>LA:Ao ratio &gt;1.4-1.5</strong></p>
            <p>• LVO &gt;300 mL/min/kg</p>
            <p>• Diastolic flow reversal in descending aorta</p>
            <p>• Absent/reversed diastolic flow in celiac/SMA/renal arteries</p>
            <p>• Pulmonary vein D-wave velocity &gt;0.4 m/sec</p>
          </div>
        </div>

        {/* Management Approach - 2024 */}
        <div className="p-2 bg-gradient-to-b from-teal-50 to-gray-50 dark:from-teal-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-teal-700 mb-2">MANAGEMENT APPROACH (2024 Guidelines)</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Step 1: Conservative Management (Often Appropriate)</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p>• Optimize PEEP (up to 8-10 cm H2O - may tamponade flow)</p>
              <p>• Target SpO2 per unit protocol (avoid hyperoxia)</p>
              <p>• Fluid: 140-150 mL/kg/day (restriction not proven beneficial)</p>
              <p>• <strong>Watchful waiting</strong> - many close spontaneously</p>
              <p>• Repeat echo in 48-72h to reassess</p>
            </div>
          </div>

          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-amber-700">Step 2: Pharmacologic Closure (hsPDA with symptoms)</p>
            <div className="text-[8px] text-amber-600 mt-1 space-y-0.5">
              <p><strong>Indications:</strong></p>
              <p>• Symptomatic hsPDA (ventilator dependence, feeding intolerance)</p>
              <p>• Large PDA with echo evidence of hemodynamic significance</p>
              <p>• <strong>Reassess with echo after 3-day course</strong></p>
            </div>
          </div>

          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-red-700">Step 3: Surgical/Catheter Closure (Last Resort)</p>
            <div className="text-[8px] text-red-600 mt-1">
              <p>• Failed medical therapy (2 courses)</p>
              <p>• Contraindications to medical therapy</p>
              <p>• Requires cardiology/surgery MDT discussion</p>
            </div>
          </div>
        </div>

        {/* Ibuprofen - 2024 */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Ibuprofen (Preferred - 2024)</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p className="font-bold">Standard Course (IV or PO if feeds &gt;100 mL/kg/day):</p>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p>Day 1: <strong>10 mg/kg</strong></p>
              <p>Day 2: <strong>5 mg/kg</strong></p>
              <p>Day 3: <strong>5 mg/kg</strong></p>
              {w > 0 && (
                <div className="font-mono text-green-600 mt-1">
                  <p>Day 1: {(w * 10).toFixed(0)} mg</p>
                  <p>Day 2-3: {(w * 5).toFixed(0)} mg each</p>
                </div>
              )}
            </div>
            
            <p className="font-bold mt-1">High-Dose Regimen (2024 UK):</p>
            <p>Day 1: 20 mg/kg → Day 2-3: 10 mg/kg each (some protocols)</p>
            <p>Second course: If hsPDA persists 48h after first course</p>
            
            <p className="font-bold mt-2 text-red-600">Contraindications:</p>
            <p>• Active bleeding / IVH ≥Grade III</p>
            <p>• Thrombocytopenia (&lt;50,000)</p>
            <p>• NEC or suspected NEC</p>
            <p>• Renal failure (Cr &gt;1.6 or oliguria)</p>
            <p>• Duct-dependent cardiac lesion</p>
            <p>• Severe pulmonary hypertension</p>
          </div>
        </div>

        {/* Paracetamol */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Paracetamol/Acetaminophen (Alternative)</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p><strong>Dose:</strong> 15 mg/kg q6h × 3-7 days (IV or PO)</p>
            {w > 0 && <p className="font-mono text-blue-600">= {(w * 15).toFixed(0)} mg q6h</p>}
            
            <p className="font-bold mt-1">Use when:</p>
            <p>• NSAID contraindicated (renal impairment, thrombocytopenia)</p>
            <p>• IVH present (safer alternative)</p>
            <p>• As first-line in some centers (emerging evidence)</p>
            
            <p className="text-amber-600 mt-1">Monitor: LFTs if prolonged course</p>
          </div>
        </div>

        {/* Monitoring */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Monitoring During Treatment</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p className="font-bold">Before each dose check:</p>
            <p>• Urine output (goal &gt;1 mL/kg/hr)</p>
            <p>• Serum creatinine</p>
            <p>• Platelet count</p>
            <p>• Abdominal exam (NEC signs)</p>
            
            <p className="font-bold mt-1 text-red-600">HOLD treatment if:</p>
            <p>• UOP &lt;0.5-1 mL/kg/hr</p>
            <p>• Rising creatinine</p>
            <p>• Platelets &lt;50,000</p>
            <p>• Any signs of NEC/GI bleeding</p>
          </div>
        </div>

        {/* When to Intervene */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">When to Consider Treatment (2024 Triggers)</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p>• FiO2 &gt;40-50% with no other explanation</p>
            <p>• MAP &gt;12-13 cm H2O</p>
            <p>• Unable to wean respiratory support</p>
            <p>• Pulmonary hemorrhage</p>
            <p>• Murmur + clinical signs in 28-32 wk or 1000-2000g infant</p>
            <p>• Echo: Large PDA with significant shunt markers</p>
          </div>
        </div>

        {/* Outcomes */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Outcomes & Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Many PDAs close spontaneously (esp. &gt;28 weeks)</p>
            <p>• Medical closure rate: 70-80% with first course</p>
            <p>• Surgical closure: Reserved for treatment failures</p>
            <p>• Complications of treatment: Renal impairment, GI bleeding, NEC</p>
            <p>• Long-term: Generally good if no other major morbidities</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PDAApproach;
