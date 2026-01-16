/**
 * Congenital Diaphragmatic Hernia (CDH) Approach
 * Updated: 2024 CDH Study Group Guidelines
 * Reference: J Pediatr Surg, ECMO Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CDHApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card data-testid="cdh-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Congenital Diaphragmatic Hernia (CDH)</CardTitle>
        <CardDescription className="text-xs">Bochdalek & Morgagni Hernias</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 CDH Study Group Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Definition */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Definition & Epidemiology</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>CDH:</strong> Defect in the diaphragm allowing herniation of abdominal contents into the thorax, causing pulmonary hypoplasia and pulmonary hypertension.</p>
            <p>Incidence: 1 in 2,500-3,000 live births</p>
            <p>Left-sided (Bochdalek): 85% | Right-sided: 13% | Bilateral: 2%</p>
          </div>
        </div>

        {/* Pathophysiology */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Pathophysiology</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Two-Hit Hypothesis:</strong></p>
            <p>1. Pulmonary hypoplasia (bilateral, worse on ipsilateral side)</p>
            <p>2. Pulmonary hypertension (abnormal vascular development)</p>
            <p className="mt-1">Severity depends on timing of herniation, degree of lung compression</p>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Clinical Features</p>
          <div className="text-[8px] text-red-600 space-y-1">
            <p className="font-bold">Classic Triad:</p>
            <p>• Scaphoid (flat) abdomen</p>
            <p>• Barrel chest</p>
            <p>• Respiratory distress at birth</p>
            
            <p className="font-bold mt-1">Other findings:</p>
            <div className="grid grid-cols-2 gap-1">
              <div>• Cyanosis</div>
              <div>• Absent breath sounds on affected side</div>
              <div>• Bowel sounds in chest</div>
              <div>• Displaced heart sounds</div>
              <div>• Severe respiratory distress</div>
              <div>• Labile oxygenation</div>
            </div>
          </div>
        </div>

        {/* Delivery Room Management */}
        <div className="p-2 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-950/20 dark:to-gray-900 rounded-xl">
          <p className="text-xs font-bold text-center text-green-700 mb-2">DELIVERY ROOM MANAGEMENT (2024)</p>
          
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mb-2">
            <p className="text-[10px] font-bold text-green-700">Critical First Steps</p>
            <div className="text-[8px] text-green-600 mt-1 space-y-0.5">
              <p className="text-red-600 font-bold">⚠️ DO NOT bag-mask ventilate</p>
              <p>• Immediate intubation - avoid gastric distension</p>
              <p>• OG/NG tube to continuous suction (large bore, 10Fr)</p>
              <p>• Gentle ventilation with low PIPs</p>
              <p>• Avoid high FiO2 initially if possible</p>
            </div>
          </div>

          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
            <p className="text-[10px] font-bold text-blue-700">Ventilation Goals (Gentle Strategy)</p>
            <div className="text-[8px] text-blue-600 mt-1 space-y-0.5">
              <p>• Preductal SpO2 &gt;85% (accept lower initially)</p>
              <p>• Peak pressures &lt;25 cm H2O if possible</p>
              <p>• Permissive hypercapnia (pH &gt;7.20, PCO2 &lt;65)</p>
              <p>• HFOV if conventional ventilation fails</p>
            </div>
          </div>
        </div>

        {/* NICU Stabilization */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">NICU Stabilization Goals</p>
          <div className="text-[8px] space-y-1">
            <p className="font-bold text-amber-400">Pre-operative targets:</p>
            <p>• Preductal SpO2 85-95%</p>
            <p>• Normal BP for gestational age</p>
            <p>• Adequate perfusion (lactate &lt;3 mmol/L)</p>
            <p>• Stable on minimal ventilatory settings</p>
            
            <p className="font-bold text-cyan-400 mt-2">Supportive Care:</p>
            <p>• Sedation (fentanyl, midazolam)</p>
            <p>• Muscle relaxation if needed</p>
            <p>• Minimize handling (↓PVR fluctuations)</p>
            <p>• Correct acidosis, maintain glucose</p>
            
            <p className="font-bold text-purple-400 mt-2">For PPHN:</p>
            <p>• iNO 20 ppm if available</p>
            <p>• Sildenafil if iNO unavailable</p>
            <p>• Maintain systemic BP &gt; pulmonary BP</p>
            {w > 0 && (
              <p className="text-green-400 font-mono mt-1">
                Sildenafil: {(w * 0.5).toFixed(1)} - {(w * 2).toFixed(0)} mg/dose PO q6-8h
              </p>
            )}
          </div>
        </div>

        {/* ECMO */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">ECMO Considerations (2024 CDH Study Group)</p>
          <div className="text-[8px] text-purple-600 space-y-1">
            <p><strong>Indications:</strong></p>
            <p>• OI &gt;40 despite maximal therapy</p>
            <p>• Inability to maintain preductal SpO2 &gt;85%</p>
            <p>• Refractory hypotension</p>
            <p>• Severe metabolic acidosis (pH &lt;7.15)</p>
            
            <p className="font-bold mt-1">Criteria:</p>
            <p>• Weight &gt;2 kg, GA &gt;34 weeks</p>
            <p>• No major IVH</p>
            <p>• No lethal anomaly</p>
          </div>
        </div>

        {/* Surgical Repair */}
        <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
          <p className="text-xs font-bold text-orange-700 mb-1">Surgical Management</p>
          <div className="text-[8px] text-orange-600 space-y-1">
            <p><strong>Timing:</strong> Delayed repair after stabilization (not emergent)</p>
            <p>• Typically 24-72 hours after birth when stable</p>
            <p>• May be on ECMO during surgery</p>
            
            <p className="font-bold mt-1">Approach:</p>
            <p>• Primary repair if defect small</p>
            <p>• Patch repair (Gore-Tex, muscle flap) if large</p>
            <p>• Laparoscopic repair in select cases</p>
          </div>
        </div>

        {/* Prognostic Indicators */}
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 mb-1">Prognostic Indicators</p>
          <div className="text-[8px] text-indigo-600 space-y-1">
            <p className="font-bold text-green-600">Better Prognosis:</p>
            <p>• Later gestational age at diagnosis</p>
            <p>• Higher O/E LHR (observed/expected lung-to-head ratio) &gt;50%</p>
            <p>• Liver in abdomen</p>
            <p>• Right-sided lesion</p>
            
            <p className="font-bold mt-1 text-red-600">Worse Prognosis:</p>
            <p>• Liver in chest ("liver up")</p>
            <p>• Associated anomalies</p>
            <p>• O/E LHR &lt;25%</p>
            <p>• Bilateral CDH</p>
          </div>
        </div>

        {/* Long-term Outcomes */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Long-term Outcomes</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Overall survival: 70-90% in specialized centers</p>
            <p>• Chronic lung disease common (up to 50%)</p>
            <p>• GERD, feeding difficulties frequent</p>
            <p>• Recurrence rate: 5-20%</p>
            <p>• Neurodevelopmental follow-up essential</p>
            <p>• Hearing screening (aminoglycoside exposure)</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default CDHApproach;
