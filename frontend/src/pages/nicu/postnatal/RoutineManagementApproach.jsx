/**
 * Routine Management of the Healthy Newborn Infant
 * Based on UpToDate / AAP Guidelines
 * Reference: WHO Recommendations on Newborn Health
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RoutineManagementApproach = ({ expandedSections, toggleSection }) => {
  return (
    <Card data-testid="routine-management-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Routine Management of the Healthy Newborn</CardTitle>
        <CardDescription className="text-xs">For newborns ≥35 weeks gestation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-[#00d9c5]">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li>Most term/late preterm newborns (≥35 weeks) make successful transition and require only routine care</li>
            <li>Well-appearing newborns should remain with mother for skin-to-skin contact (kangaroo care)</li>
            <li>Early breastfeeding initiation is recommended</li>
            <li>Transitional period lasts 4-6 hours after birth</li>
          </ul>
        </div>

        {/* Delivery Room Care */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Delivery Room Care</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Initial Management:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Dry the newborn</li>
                <li>Clear airway of secretions</li>
                <li>Provide warmth</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Criteria for Normal Nursery (Level 1 Care):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Gestational age ≥35 weeks</li>
                <li>Good muscle tone</li>
                <li>Strong respiratory drive (crying, breathing without difficulty)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Apgar Score */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Apgar Score</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2">Assessed at <strong>1 minute</strong> and <strong>5 minutes</strong> after birth</p>
            <table className="w-full text-xs mb-2">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Variable</th>
                  <th className="text-center py-1">0</th>
                  <th className="text-center py-1">1</th>
                  <th className="text-center py-1">2</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1">Heart Rate</td><td className="text-center">Absent</td><td className="text-center">&lt;100</td><td className="text-center">≥100</td></tr>
                <tr><td className="py-1">Respiratory Effort</td><td className="text-center">Absent</td><td className="text-center">Weak/Irregular</td><td className="text-center">Good/Crying</td></tr>
                <tr><td className="py-1">Muscle Tone</td><td className="text-center">Flaccid</td><td className="text-center">Some flexion</td><td className="text-center">Active motion</td></tr>
                <tr><td className="py-1">Reflex Irritability</td><td className="text-center">None</td><td className="text-center">Grimace</td><td className="text-center">Cough/Sneeze</td></tr>
                <tr><td className="py-1">Color</td><td className="text-center">Blue/Pale</td><td className="text-center">Acrocyanosis</td><td className="text-center">Pink</td></tr>
              </tbody>
            </table>
            <p className="text-green-600 dark:text-green-400">• Score 7-10: Normal - routine care</p>
            <p className="text-amber-600 dark:text-amber-400">• Score ≤6 at 5 min: Continue monitoring, assess at 10 min</p>
          </div>
        </div>

        {/* Transitional Period Monitoring */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Transitional Period (First 4-6 Hours)</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-2">Monitor every 30-60 minutes:</p>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Parameter</th>
                  <th className="text-left py-1">Normal Range</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1">Temperature (axillary)</td><td className="py-1 font-mono">36.5 - 37.5°C (97.7 - 99.5°F)</td></tr>
                <tr><td className="py-1">Respiratory Rate</td><td className="py-1 font-mono">40 - 60 breaths/min</td></tr>
                <tr><td className="py-1">Heart Rate</td><td className="py-1 font-mono">120 - 160 bpm (may ↓ to 85 in sleep)</td></tr>
              </tbody>
            </table>
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-medium text-red-700 dark:text-red-400">Warning Signs:</p>
              <ul className="list-disc pl-4 text-red-600 dark:text-red-300">
                <li>Central cyanosis (lips, tongue, trunk)</li>
                <li>Hypotonia</li>
                <li>Persistent hypothermia or hyperthermia</li>
                <li>Tachypnea or apnea</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Routine Interventions */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Routine Interventions</p>
          
          <div className="space-y-3 text-xs">
            {/* Eye Prophylaxis */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Ocular Prophylaxis</p>
              <p className="text-slate-600 dark:text-slate-300">Erythromycin ophthalmic ointment 0.5% - both eyes shortly after birth</p>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Purpose: Prevent gonococcal ophthalmia neonatorum</p>
            </div>

            {/* Vitamin K */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Vitamin K Prophylaxis</p>
              <p className="text-slate-600 dark:text-slate-300">Within 6 hours of birth:</p>
              <div className="mt-1 font-mono text-blue-600 dark:text-blue-400">
                <p>• Weight &gt;1500g: <strong>1 mg IM</strong></p>
                <p>• Weight ≤1500g: <strong>0.3-0.5 mg/kg IM</strong></p>
              </div>
              <p className="text-red-500 dark:text-red-400 mt-1">⚠️ No circumcision if vitamin K refused</p>
            </div>

            {/* Hepatitis B */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Hepatitis B Vaccination</p>
              <p className="text-slate-600 dark:text-slate-300">Universal vaccination recommended for all newborns</p>
              <p className="text-slate-500 dark:text-slate-400 mt-1">First dose: Within 24 hours of birth (before hospital discharge)</p>
            </div>

            {/* RSV */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">RSV Prophylaxis</p>
              <p className="text-slate-600 dark:text-slate-300">Nirsevimab recommended for:</p>
              <ul className="list-disc pl-4 text-slate-500 dark:text-slate-400 mt-1">
                <li>Newborns born during RSV season (Oct-Mar)</li>
                <li>If maternal RSV vaccination was NOT given ≥14 days before delivery</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Umbilical Cord Care */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Umbilical Cord Care</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="mb-1"><strong>Clean, dry care</strong> is standard in developed settings</p>
            <p className="mb-1">In high-risk/low-resource settings, consider:</p>
            <ul className="list-disc pl-4">
              <li>Chlorhexidine</li>
              <li>Triple dye</li>
              <li>Silver sulfadiazine</li>
            </ul>
          </div>
        </div>

        {/* Newborn Screening */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Routine Newborn Screening</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium">Blood Spot Screen (24-48h):</p>
                <ul className="list-disc pl-4 text-[11px]">
                  <li>Inborn errors of metabolism</li>
                  <li>Congenital hypothyroidism</li>
                  <li>Hemoglobinopathies</li>
                  <li>Cystic fibrosis</li>
                  <li>CAH</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Other Screens:</p>
                <ul className="list-disc pl-4 text-[11px]">
                  <li>Hearing screen</li>
                  <li>Pulse oximetry (CCHD)</li>
                  <li>Bilirubin (TcB or TSB)</li>
                  <li>Glucose (at-risk infants)</li>
                  <li>cCMV (if indicated)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Feeding */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Feeding</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium text-green-600 dark:text-green-400">Breastfeeding (Recommended):</p>
              <ul className="list-disc pl-4">
                <li>Initiate as soon as possible (in delivery room if able)</li>
                <li>8-12 feeds per day during hospitalization</li>
                <li>Rooming-in and skin-to-skin contact encouraged</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Formula Feeding:</p>
              <ul className="list-disc pl-4">
                <li>Standard 20 kcal/oz iron-containing formula</li>
                <li>Feed on demand; no longer than 4 hours between feeds</li>
                <li>Volume: 0.5-1 oz (15-30 mL) per feed initially</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Weight Loss */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Expected Weight Loss</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>• Term newborns may lose up to <strong>10%</strong> of birth weight in first few days</p>
            <p>• Should regain birth weight by <strong>10-14 days</strong></p>
            <p>• Cesarean-delivered and exclusively breastfed infants may have greater initial loss</p>
            <p className="text-amber-600 dark:text-amber-400 mt-1">⚠️ Excessive weight loss → feeding assessment + lactation support</p>
          </div>
        </div>

        {/* First Bath */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">First Bath</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p>• Delay bathing for <strong>6-24 hours</strong> after birth (may improve breastfeeding initiation)</p>
            <p className="text-red-500 dark:text-red-400 mt-1">• Bathe soon after delivery if maternal HSV, HIV, Hep B/C exposure concern</p>
          </div>
        </div>

        {/* Discharge Criteria */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Discharge Criteria</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>✓ No neonatal abnormality requiring continued hospitalization</p>
            <p>✓ Vital signs stable for ≥12 hours before discharge</p>
            <p className="pl-4">• RR: 40-60/min • HR: 120-160 bpm • Temp: 36.5-37.5°C</p>
            <p>✓ Has urinated and passed at least one stool</p>
            <p>✓ At least two successful feedings observed</p>
            <p>✓ If circumcised: no excessive bleeding for ≥2 hours</p>
            <p>✓ All screening tests completed</p>
            <p>✓ Family demonstrates competence in infant care</p>
          </div>
        </div>

        {/* Follow-up */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Follow-Up Timing</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Scenario</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Follow-up</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr><td className="py-1">Hospitalized ≥48h, no risk factors</td><td>Within 3 days of discharge</td></tr>
              <tr><td className="py-1">Hospitalized &lt;48h</td><td>Within 48 hours of discharge</td></tr>
              <tr><td className="py-1">&lt;37 weeks, &gt;8% weight loss, hyperbili risk</td><td>24-48 hours after discharge</td></tr>
            </tbody>
          </table>
        </div>

        {/* Parental Education */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Parental Education Topics</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 grid grid-cols-2 gap-2">
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Breastfeeding technique</li>
              <li>Normal urination/stooling</li>
              <li>Umbilical cord care</li>
              <li>Skin care</li>
            </ul>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Safe sleep (supine position)</li>
              <li>Car seat safety</li>
              <li>Signs of illness (jaundice, fever)</li>
              <li>When to seek medical attention</li>
            </ul>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default RoutineManagementApproach;
