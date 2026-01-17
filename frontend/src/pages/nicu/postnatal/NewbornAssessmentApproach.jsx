/**
 * Assessment of the Newborn Infant
 * Based on UpToDate / AAP Guidelines
 * Reference: WHO Recommendations on Newborn Health
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const NewbornAssessmentApproach = ({ expandedSections, toggleSection }) => {
  return (
    <Card data-testid="newborn-assessment-approach">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Assessment of the Newborn Infant</CardTitle>
        <CardDescription className="text-xs">Comprehensive Physical Examination Guide</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        {/* Key Points */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-[#00d9c5]">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Key Points</p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
            <li>Complete exam within 24 hours of birth</li>
            <li>Review maternal, family, and prenatal history</li>
            <li>Identify abnormalities requiring intervention</li>
            <li>Optimal timing: when infant is quiet and alert</li>
          </ul>
        </div>

        {/* General Appearance */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">General Appearance</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-600 dark:text-green-400 mb-1">Normal:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Active, alert, responsive</li>
                  <li>Good muscle tone</li>
                  <li>Symmetric movements</li>
                  <li>Strong cry</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-red-600 dark:text-red-400 mb-1">Abnormal:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Lethargy or irritability</li>
                  <li>Hypotonia or hypertonia</li>
                  <li>Asymmetric posture/movements</li>
                  <li>Weak or high-pitched cry</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Vital Signs</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Parameter</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Normal Range</th>
                <th className="text-left py-1 text-slate-600 dark:text-slate-300">Concern</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr>
                <td className="py-1">Temperature</td>
                <td className="py-1 font-mono">36.5-37.5°C</td>
                <td className="py-1 text-red-500">&lt;36.5 or &gt;37.5°C</td>
              </tr>
              <tr>
                <td className="py-1">Heart Rate</td>
                <td className="py-1 font-mono">120-160 bpm</td>
                <td className="py-1 text-red-500">&lt;100 or &gt;180 bpm</td>
              </tr>
              <tr>
                <td className="py-1">Respiratory Rate</td>
                <td className="py-1 font-mono">40-60/min</td>
                <td className="py-1 text-red-500">&gt;60 or apnea</td>
              </tr>
              <tr>
                <td className="py-1">Blood Pressure</td>
                <td className="py-1 font-mono">60-90/30-60 mmHg</td>
                <td className="py-1 text-red-500">Hypotension, poor perfusion</td>
              </tr>
              <tr>
                <td className="py-1">O2 Saturation</td>
                <td className="py-1 font-mono">≥95% by 10 min</td>
                <td className="py-1 text-red-500">&lt;90% or differential &gt;3%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Measurements */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Measurements</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-1">Parameter</th>
                  <th className="text-left py-1">Term Normal Range</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1">Weight</td><td className="py-1 font-mono">2500-4000g (5.5-8.8 lbs)</td></tr>
                <tr><td className="py-1">Length</td><td className="py-1 font-mono">48-53 cm (19-21 in)</td></tr>
                <tr><td className="py-1">Head Circumference</td><td className="py-1 font-mono">33-37 cm (13-14.5 in)</td></tr>
              </tbody>
            </table>
            <p className="mt-2 text-amber-600 dark:text-amber-400">Plot all measurements on growth charts and compare to gestational age</p>
          </div>
        </div>

        {/* Head Examination */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Head Examination</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Fontanelles:</p>
              <ul className="list-disc pl-4">
                <li><strong>Anterior:</strong> Diamond-shaped, 1-4 cm, soft and flat (closes 12-18 months)</li>
                <li><strong>Posterior:</strong> Triangular, &lt;1 cm (closes 2-3 months)</li>
                <li className="text-red-500">Bulging → ↑ICP; Sunken → dehydration</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Sutures:</p>
              <ul className="list-disc pl-4">
                <li>May override slightly (normal molding)</li>
                <li className="text-red-500">Widely split → hydrocephalus; Fused → craniosynostosis</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Common Birth-Related Findings:</p>
              <ul className="list-disc pl-4">
                <li><strong>Caput succedaneum:</strong> Soft tissue swelling crossing suture lines (resolves in days)</li>
                <li><strong>Cephalohematoma:</strong> Subperiosteal hemorrhage, does NOT cross sutures (resolves in weeks)</li>
                <li><strong>Subgaleal hemorrhage:</strong> Crosses sutures, fluctuant, can be life-threatening</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Eyes */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Eyes</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-600 dark:text-green-400 mb-1">Normal:</p>
                <ul className="list-disc pl-4">
                  <li>Red reflex present bilaterally</li>
                  <li>Pupils equal, reactive</li>
                  <li>Clear conjunctiva</li>
                  <li>Symmetric eye movement</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-red-600 dark:text-red-400 mb-1">Abnormal:</p>
                <ul className="list-disc pl-4">
                  <li>Absent/white red reflex (retinoblastoma, cataract)</li>
                  <li>Leukocoria</li>
                  <li>Purulent discharge</li>
                  <li>Coloboma</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Ears */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Ears</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <ul className="list-disc pl-4">
              <li>Position: Top of ear should align with outer canthus of eye</li>
              <li>Examine for preauricular pits/tags (may be associated with hearing loss, renal anomalies)</li>
              <li>Cartilage development correlates with gestational age</li>
              <li>Hearing screen required before discharge</li>
            </ul>
          </div>
        </div>

        {/* Nose & Mouth */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Nose & Mouth</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Nose:</p>
              <ul className="list-disc pl-4">
                <li>Confirm bilateral nasal patency (pass catheter or observe feeding)</li>
                <li className="text-red-500">Unilateral/bilateral choanal atresia → obstruction, cyanosis with feeding</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Mouth:</p>
              <ul className="list-disc pl-4">
                <li>Inspect palate for cleft (hard and soft)</li>
                <li>Epstein pearls (small white cysts on palate) - normal</li>
                <li>Natal teeth (may need removal if loose)</li>
                <li>Assess for ankyloglossia (tongue tie)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cardiovascular */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Cardiovascular</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Examination:</p>
              <ul className="list-disc pl-4">
                <li>Heart sounds: S1, S2 (physiologic murmur common in first 24-48h)</li>
                <li>Femoral pulses: Compare to brachial (weak/absent → coarctation)</li>
                <li>Capillary refill: &lt;3 seconds</li>
                <li>Pre- and post-ductal SpO2 (CCHD screen)</li>
              </ul>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded mt-2">
              <p className="font-medium text-red-700 dark:text-red-400">Red Flags:</p>
              <ul className="list-disc pl-4 text-red-600 dark:text-red-300">
                <li>Central cyanosis</li>
                <li>Persistent tachypnea/respiratory distress</li>
                <li>Absent/weak femoral pulses</li>
                <li>Persistent murmur &gt;grade 2/6</li>
                <li>Failed CCHD screen</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Respiratory */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Respiratory</p>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-600 dark:text-green-400 mb-1">Normal:</p>
                <ul className="list-disc pl-4">
                  <li>RR 40-60/min</li>
                  <li>Periodic breathing normal</li>
                  <li>Clear breath sounds</li>
                  <li>No retractions</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-red-600 dark:text-red-400 mb-1">Abnormal:</p>
                <ul className="list-disc pl-4">
                  <li>Tachypnea &gt;60/min</li>
                  <li>Grunting, flaring, retractions</li>
                  <li>Apnea &gt;20 seconds</li>
                  <li>Asymmetric breath sounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Abdomen */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Abdomen</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Normal Findings:</p>
              <ul className="list-disc pl-4">
                <li>Soft, non-distended</li>
                <li>Liver palpable 1-2 cm below right costal margin</li>
                <li>Umbilical cord: 2 arteries, 1 vein (single umbilical artery → evaluate for anomalies)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-red-600 dark:text-red-400 mb-1">Abnormal:</p>
              <ul className="list-disc pl-4">
                <li>Distension, visible loops</li>
                <li>Masses (hydronephrosis, Wilms)</li>
                <li>Scaphoid abdomen (diaphragmatic hernia)</li>
                <li>Umbilical hernia/omphalocele/gastroschisis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Genitalia */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Genitalia</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Male:</p>
              <ul className="list-disc pl-4">
                <li>Both testes descended (if not, reexamine before discharge)</li>
                <li>Urethral meatus at tip of glans</li>
                <li>Check for hypospadias/epispadias</li>
                <li>Hydrocele (transilluminates, usually resolves)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Female:</p>
              <ul className="list-disc pl-4">
                <li>Labia majora cover labia minora (term)</li>
                <li>White mucoid discharge normal (maternal estrogen effect)</li>
                <li>Vaginal bleeding ("pseudomenses") - normal in first week</li>
              </ul>
            </div>
            <p className="text-amber-600 dark:text-amber-400">⚠️ Ambiguous genitalia requires urgent evaluation</p>
          </div>
        </div>

        {/* Musculoskeletal */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Musculoskeletal</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Hips (DDH Screening):</p>
              <ul className="list-disc pl-4">
                <li>Barlow test: Attempts to dislocate a located hip</li>
                <li>Ortolani test: Attempts to relocate a dislocated hip</li>
                <li>Positive "clunk" → hip ultrasound</li>
                <li>Risk factors: breech, family history, female</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Extremities:</p>
              <ul className="list-disc pl-4">
                <li>Count digits (polydactyly/syndactyly)</li>
                <li>Assess for clubfoot (positional vs true)</li>
                <li>Symmetric movements (Erb palsy if asymmetric arm)</li>
                <li>Clavicles (fracture → crepitus, asymmetric Moro)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Spine:</p>
              <ul className="list-disc pl-4">
                <li>Palpate for defects</li>
                <li>Look for sacral dimples, tufts of hair, masses (spinal dysraphism)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skin */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Skin</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Normal/Benign Findings:</p>
              <ul className="list-disc pl-4">
                <li><strong>Vernix caseosa:</strong> White, cheesy coating (protective)</li>
                <li><strong>Lanugo:</strong> Fine hair on back/shoulders</li>
                <li><strong>Erythema toxicum:</strong> Red blotchy rash with central papule (benign, resolves)</li>
                <li><strong>Milia:</strong> White papules on face (blocked sebaceous glands)</li>
                <li><strong>Mongolian spots:</strong> Blue-gray macules on sacrum/buttocks</li>
                <li><strong>Salmon patch (stork bite):</strong> Pink macule on eyelids, glabella, nape</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-red-600 dark:text-red-400 mb-1">Abnormal:</p>
              <ul className="list-disc pl-4">
                <li>Jaundice in first 24 hours (pathologic)</li>
                <li>Pustules/vesicles (infection?)</li>
                <li>Petechiae beyond presenting part</li>
                <li>Port-wine stain (especially face → Sturge-Weber)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Neurological */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-purple-500">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Neurological Examination</p>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <p className="font-medium mb-1">Primitive Reflexes:</p>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-600">
                    <th className="text-left py-1">Reflex</th>
                    <th className="text-left py-1">Response</th>
                    <th className="text-left py-1">Disappears</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-1">Moro</td><td>Arms abduct/extend, then adduct</td><td>3-6 months</td></tr>
                  <tr><td className="py-1">Rooting</td><td>Turns toward stimulus</td><td>3-4 months</td></tr>
                  <tr><td className="py-1">Suck</td><td>Sucks when object in mouth</td><td>3-4 months</td></tr>
                  <tr><td className="py-1">Grasp (palmar)</td><td>Fingers close around object</td><td>3-6 months</td></tr>
                  <tr><td className="py-1">Grasp (plantar)</td><td>Toes curl with pressure</td><td>9-12 months</td></tr>
                  <tr><td className="py-1">Stepping</td><td>Walking motion when upright</td><td>2 months</td></tr>
                  <tr><td className="py-1">Galant</td><td>Trunk curves toward stimulus</td><td>2-3 months</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <p className="font-medium mb-1">Tone Assessment:</p>
              <ul className="list-disc pl-4">
                <li>Flexor tone predominates in term infant</li>
                <li>Pull-to-sit: Some head lag normal</li>
                <li>Ventral suspension: Head momentarily in line with body</li>
              </ul>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default NewbornAssessmentApproach;
