/**
 * TTNB (Transient Tachypnea of the Newborn) Approach
 * 
 * Design: Standardized to match JaundiceApproach.jsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TTNBApproach = ({ weight, gestationalAge }) => {
  const w = parseFloat(weight) || 0;
  const ga = parseFloat(gestationalAge) || 0;

  return (
    <Card data-testid="ttnb-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Transient Tachypnea of the Newborn (TTN)</CardTitle>
        <CardDescription className="text-xs">Wet Lung Syndrome</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li><strong>Definition:</strong> Self-limited respiratory distress from delayed clearance of fetal lung fluid</li>
            <li><strong>Onset:</strong> Within first 2 hours of life</li>
            <li><strong>Duration:</strong> Usually resolves within 24-72 hours</li>
            <li><strong>Diagnosis:</strong> Exclusion of other causes (RDS, pneumonia, sepsis)</li>
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Factors</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>C-section without labor</strong></li>
              <li>Precipitous delivery</li>
              <li>Late preterm (34-37 weeks)</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Maternal diabetes</li>
              <li>Maternal asthma</li>
              <li>Male sex</li>
              <li>Macrosomia</li>
            </ul>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Clinical Features</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Signs:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Tachypnea (RR 60-100+/min)</li>
              <li>Mild retractions</li>
              <li>Nasal flaring</li>
              <li>Grunting (less prominent than RDS)</li>
              <li>Cyanosis (mild, responds to low O2)</li>
            </ul>
            <p className="font-medium mt-2 mb-1">CXR findings:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Perihilar streaking</li>
              <li>Fluid in fissures</li>
              <li>Hyperinflation</li>
              <li>Mild cardiomegaly (fluid)</li>
            </ul>
          </div>
        </div>

        {/* Differential Diagnosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Differential Diagnosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1">Rule out before diagnosing TTN:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><strong>RDS</strong> - progressive, ground glass on CXR</li>
              <li><strong>Pneumonia/Sepsis</strong> - risk factors, fever, WBC changes</li>
              <li><strong>MAS</strong> - meconium-stained fluid</li>
              <li><strong>PPHN</strong> - severe hypoxemia, cyanosis</li>
              <li><strong>Congenital heart disease</strong> - murmur, cardiomegaly</li>
            </ul>
          </div>
        </div>

        {/* Management */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Management</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Supportive care:</p>
              <p>• Oxygen to maintain SpO2 90-95%</p>
              <p>• Usually low FiO2 sufficient (21-40%)</p>
              <p>• CPAP if moderate distress</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Feeding:</p>
              <p>• NPO if RR &gt;60-70/min</p>
              <p>• IV fluids until feeding safe</p>
              <p>• Start feeds as tachypnea resolves</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium">Monitoring:</p>
              <p>• Continuous SpO2</p>
              <p>• Respiratory rate trending</p>
              <p>• Watch for worsening (suggests different diagnosis)</p>
            </div>
          </div>
        </div>

        {/* When to Worry */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
          <p className="font-semibold text-red-600 dark:text-red-400 mb-2">When to Reconsider Diagnosis</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
            <li>Symptoms &gt;72 hours</li>
            <li>Requiring FiO2 &gt;40%</li>
            <li>Progressive respiratory distress</li>
            <li>Fever or temperature instability</li>
            <li>Cardiovascular instability</li>
          </ul>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
            → Consider sepsis workup, echocardiogram, further evaluation
          </p>
        </div>

        {/* Prognosis */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Prognosis</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>• Excellent - full recovery expected</p>
            <p>• No long-term pulmonary sequelae</p>
            <p>• Possible slight increased risk of childhood asthma (controversial)</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default TTNBApproach;
