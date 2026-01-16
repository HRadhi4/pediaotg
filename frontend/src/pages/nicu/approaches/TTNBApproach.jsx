/**
 * Transient Tachypnea of the Newborn (TTN) Approach
 * Updated: 2024 Guidelines
 * Simplified design matching Apnea approach
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TTNBApproach = ({ gestationalAge }) => {
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="ttnb-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Transient Tachypnea (TTN)</CardTitle>
        <CardDescription className="text-xs">"Wet Lung" - Self-Limited</CardDescription>
        <p className="text-[10px] text-blue-600 mt-1 font-medium">Updated: 2024 Evidence-Based Guidelines</p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Key Points */}
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-1">Key Points (2024)</p>
          <div className="text-[8px] text-amber-600 space-y-1">
            <p><strong>Definition:</strong> Delayed fetal lung fluid clearance</p>
            <p><strong>Key:</strong> Self-limited, resolves in 24-72 hours</p>
            <p><strong>FiO2:</strong> Rarely &gt;0.40</p>
            <p><strong>Diuretics:</strong> NOT beneficial</p>
            {ga > 0 && ga >= 34 && ga < 39 && (
              <p className="bg-amber-100 p-1 rounded mt-1">
                ⚠️ At {ga} weeks: Higher TTN risk with elective C/S
              </p>
            )}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
          <p className="text-xs font-bold text-red-700 mb-1">Risk Factors</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-red-600">
            <div>
              <p className="font-bold">Delivery:</p>
              <p>• <strong>C/S without labor</strong></p>
              <p>• Elective C/S &lt;39 wk</p>
              <p>• Precipitous delivery</p>
            </div>
            <div>
              <p className="font-bold">Infant:</p>
              <p>• Late preterm (34-36 wk)</p>
              <p>• Male sex</p>
              <p>• LGA, maternal DM</p>
            </div>
          </div>
        </div>

        {/* Clinical */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">Clinical Features</p>
          <div className="text-[8px] text-blue-600 space-y-1">
            <p><strong>Onset:</strong> First 2-6 hours</p>
            <div className="grid grid-cols-2 gap-1">
              <p>• Tachypnea (RR 60-120)</p>
              <p>• Mild retractions</p>
              <p>• Grunting</p>
              <p>• Clear breath sounds</p>
            </div>
            <p className="mt-1"><strong>Course:</strong> Improves within 24-72 hours</p>
          </div>
        </div>

        {/* CXR & DDx */}
        <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">CXR & Differential</p>
          <div className="grid grid-cols-2 gap-2 text-[8px] text-purple-600">
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">CXR Findings:</p>
              <p>• Perihilar streaking</p>
              <p>• Fluid in fissures</p>
              <p>• Hyperinflation</p>
            </div>
            <div className="p-1.5 bg-white dark:bg-gray-900 rounded">
              <p className="font-bold">Rule out:</p>
              <p>• RDS, Pneumonia</p>
              <p>• CHD, PPHN</p>
              <p>• Pneumothorax</p>
            </div>
          </div>
        </div>

        {/* Management */}
        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-1">Management</p>
          <div className="text-[8px] text-green-600 space-y-1">
            <p><strong>Supportive only:</strong></p>
            <p>• O2 to maintain SpO2 90-95%</p>
            <p>• CPAP if FiO2 &gt;0.40</p>
            <p>• NPO or limited feeds if RR &gt;60-80</p>
            <p className="mt-1"><strong>NOT indicated:</strong> Diuretics, fluid restriction</p>
          </div>
        </div>

        {/* Red Flags */}
        <div className="p-2 bg-gray-800 text-white rounded-lg">
          <p className="text-xs font-bold mb-1">Red Flags - Reconsider Diagnosis</p>
          <div className="text-[8px] space-y-1">
            <p className="text-red-400">• Symptoms &gt;72 hours</p>
            <p className="text-red-400">• FiO2 requirement &gt;0.40</p>
            <p className="text-red-400">• Need for mechanical ventilation</p>
            <p className="text-red-400">• Clinical deterioration</p>
          </div>
        </div>

        {/* Prognosis */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prognosis</p>
          <div className="text-[8px] text-gray-600 dark:text-gray-400 space-y-1">
            <p>• <strong>Excellent</strong> - self-limited</p>
            <p>• Usually resolves in 24-72 hours</p>
            <p>• No long-term respiratory issues</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default TTNBApproach;
