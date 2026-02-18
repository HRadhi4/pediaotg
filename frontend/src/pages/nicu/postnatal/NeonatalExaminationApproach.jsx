/**
 * 24-Hours Neonatal Examination Approach
 * Most Common Findings and Management
 * Organized by System with AAP Guidelines
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ChevronDown, 
  ChevronRight, 
  Stethoscope, 
  Eye, 
  Bone, 
  Baby, 
  Heart,
  Ruler,
  AlertCircle,
  FileText,
  ExternalLink
} from "lucide-react";

// Collapsible Section Component
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false, color = "teal" }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const colorClasses = {
    teal: "bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800",
    blue: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    purple: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800",
    orange: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800",
    pink: "bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800",
    green: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    red: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    yellow: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
    indigo: "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800",
    slate: "bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800",
  };

  const iconColors = {
    teal: "text-teal-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    pink: "text-pink-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    indigo: "text-indigo-600",
    slate: "text-slate-600",
  };

  return (
    <Card className={`border ${colorClasses[color]}`}>
      <CardHeader 
        className="py-3 px-4 cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className={`h-5 w-5 ${iconColors[color]}`} />}
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0 pb-4 px-4">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

// Finding Item Component
const FindingItem = ({ title, management, urgent = false, aapGuideline = null }) => {
  return (
    <div className={`p-3 rounded-lg mb-2 ${urgent ? 'bg-red-50 border border-red-200 dark:bg-red-900/20' : 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className={`font-medium text-sm mb-2 ${urgent ? 'text-red-700 dark:text-red-400' : ''}`}>
            {urgent && <AlertCircle className="h-4 w-4 inline mr-1 text-red-500" />}
            {title}
          </h4>
          <ul className="space-y-1">
            {management.map((item, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-teal-500 mt-0.5 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {aapGuideline && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-blue-600">
                <FileText className="h-3 w-3 mr-1" />
                AAP
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  AAP Guidelines: {title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                {aapGuideline}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const NeonatalExaminationApproach = () => {
  return (
    <div className="space-y-3" data-testid="neonatal-examination-approach">
      {/* Header */}
      <Card className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0">
        <CardHeader className="py-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Baby className="h-5 w-5" />
            24-Hours Neonatal Examination
          </CardTitle>
          <p className="text-xs text-white/80 mt-1">
            Most Common Findings & Management Guidelines
          </p>
        </CardHeader>
      </Card>

      {/* SURGICAL */}
      <CollapsibleSection title="Surgical" icon={Stethoscope} color="blue" defaultOpen={true}>
        <FindingItem 
          title="Hypospadias"
          management={[
            "Renal Ultrasound",
            "Postnatal consultant clinic follow up after ultrasound",
            "Counsel mom: Do NOT circumcise",
            "Pediatric Surgery follow up"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Circumcision is contraindicated in hypospadias as foreskin may be needed for surgical repair</li>
                <li>Renal ultrasound recommended to rule out associated upper urinary tract anomalies (present in 5-10%)</li>
                <li>Referral to pediatric urology for surgical planning (typically repaired at 6-12 months)</li>
                <li>Screen for other midline defects if severe hypospadias present</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Hydrocele"
          management={[
            "Reassure mother - common and usually resolves spontaneously",
            "If significant: Pediatric Surgery follow up in 3-4 weeks"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Non-communicating hydroceles usually resolve by 12-18 months</li>
                <li>Communicating hydroceles (fluctuate with Valsalva) may need surgical repair</li>
                <li>Surgical referral if persists beyond 12-18 months or if inguinal hernia suspected</li>
                <li>Ultrasound if diagnosis uncertain or if associated scrotal pathology suspected</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Undescended Testis (Cryptorchidism)"
          management={[
            "Pediatric Surgery follow up"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Referral to pediatric urologist/surgeon by 6 months if testis remains undescended</li>
                <li>Surgical correction (orchidopexy) recommended between 6-12 months of age</li>
                <li>Earlier surgery improves fertility outcomes and reduces malignancy risk</li>
                <li>Bilateral cryptorchidism with hypospadias: evaluate for disorder of sexual development (DSD)</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Skin Tag (Preauricular or Other)"
          management={[
            "Pediatric Surgery follow up for cosmetic removal"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Isolated preauricular skin tags/pits - renal ultrasound NOT routinely recommended (AAP 2013)</li>
                <li>Renal US indicated if: other ear anomalies, dysmorphic features, family history of deafness/renal anomalies</li>
                <li>Hearing screen per universal newborn screening protocol</li>
                <li>Surgical removal elective for cosmetic reasons</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>

      {/* ENT / DENTAL */}
      <CollapsibleSection title="ENT / Dental" icon={Eye} color="purple">
        <FindingItem 
          title="Tongue Tie (Ankyloglossia)"
          management={[
            "If affecting feeding: ENT consultation as inpatient",
            "Otherwise: ENT follow up as outpatient"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Frenotomy indicated if breastfeeding difficulties directly attributable to ankyloglossia</li>
                <li>Lactation consultation recommended before surgical intervention</li>
                <li>Most tongue ties do not require treatment if feeding is adequate</li>
                <li>Speech evaluation needed if persists and concerns arise later</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Ear Tag & Preauricular Sinus"
          management={[
            "Renal Ultrasound",
            "Follow up Postnatal consultant clinic after ultrasound"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Isolated preauricular pits/tags: low risk for renal anomalies (0.3-3%)</li>
                <li>Consider renal US if: other ear anomalies, dysmorphic features, family history</li>
                <li>Infected preauricular sinus needs antibiotics ± surgical excision</li>
                <li>Routine hearing screening recommended</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Choanal Atresia"
          urgent={true}
          management={[
            "Unilateral: ENT consultation, CT as outpatient after 48h observation (ensure SpO2 normal)",
            "Bilateral: URGENT - Admission after discussing with consultant"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Bilateral choanal atresia is a neonatal emergency - obligate nasal breathers</li>
                <li>Immediate oral airway placement (McGovern nipple or endotracheal tube)</li>
                <li>CT scan to confirm diagnosis and plan surgical repair</li>
                <li>Evaluate for CHARGE syndrome (50% association)</li>
                <li>Surgical repair timing varies; bilateral cases may need early intervention</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Ranula (Cyst Below Tongue)"
          management={[
            "ENT follow up"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Simple ranulas may resolve spontaneously</li>
                <li>If large or interfering with feeding: marsupialization or excision</li>
                <li>Plunging ranulas (extending into neck) require more extensive surgery</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Natal Teeth"
          urgent={true}
          management={[
            "Dental review",
            "URGENT if loose (aspiration risk)"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Mobile natal teeth should be extracted due to aspiration risk</li>
                <li>Firm natal teeth can be retained and monitored</li>
                <li>May cause ulceration of infant's tongue (Riga-Fede disease) - smooth sharp edges</li>
                <li>X-ray to determine if primary or supernumerary tooth</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>

      {/* ORTHOPEDIC */}
      <CollapsibleSection title="Orthopedic" icon={Bone} color="orange">
        <FindingItem 
          title="Fused Toes (Syndactyly)"
          management={[
            "X-ray",
            "Ortho review as inpatient"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Simple syndactyly (skin only) - often cosmetic concern only</li>
                <li>Complex syndactyly (bone involvement) - surgical separation recommended</li>
                <li>Evaluate for associated syndromes (Apert, Poland syndrome)</li>
                <li>Surgical timing usually 6-18 months for hand; less urgent for toes</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Hip Click (DDH Screening)"
          management={[
            "Reassessment in Postnatal consultant clinic in 2 weeks"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Perform Ortolani and Barlow maneuvers on all newborns</li>
                <li>Hip ultrasound at 4-6 weeks if: clinical instability, breech, family history, or equivocal exam</li>
                <li>Pavlik harness is first-line treatment for DDH diagnosed &lt;6 months</li>
                <li>Early treatment has excellent outcomes; delayed diagnosis leads to surgical intervention</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Shoulder Dystocia / Brachial Plexus Injury"
          management={[
            "Clinical assessment",
            "X-ray",
            "Ortho consultation",
            "Physiotherapy"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Document detailed neurological exam of affected limb</li>
                <li>X-ray to rule out clavicle or humerus fracture</li>
                <li>Most Erb's palsy (C5-C6) recovers spontaneously within 3-6 months</li>
                <li>Referral to specialized brachial plexus clinic if no improvement by 3 months</li>
                <li>Occupational/Physical therapy to maintain range of motion</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Talipes (Clubfoot)"
          management={[
            "If positional: Physiotherapy",
            "If fixed/structural: Ortho consultation"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Distinguish positional (passively correctable) from structural (rigid) clubfoot</li>
                <li>Ponseti method is gold standard for idiopathic clubfoot - serial casting</li>
                <li>Begin treatment within first 1-2 weeks of life for best outcomes</li>
                <li>Achilles tenotomy needed in ~80% of cases; bracing to prevent recurrence</li>
                <li>Screen for neuromuscular disorders if atypical presentation</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Sacral Dimple"
          management={[
            "Spine ultrasound",
            "Follow up Postnatal consultant clinic after ultrasound"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li><strong>Low-risk (no imaging needed):</strong> Simple dimple &lt;5mm, within 2.5cm of anus, visible base</li>
                <li><strong>High-risk (needs spinal US):</strong> Large dimple, &gt;2.5cm from anus, hair tuft, skin tag, hemangioma, or lipoma over spine</li>
                <li>Spinal ultrasound best done before 3-4 months (before vertebral ossification)</li>
                <li>MRI if ultrasound inconclusive or high clinical suspicion of occult spinal dysraphism</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>

      {/* CARDIOVASCULAR */}
      <CollapsibleSection title="Cardiovascular (Murmur)" icon={Heart} color="red">
        <FindingItem 
          title="Murmur Grade 1-2 (Soft)"
          management={[
            "Follow up Postnatal consultant clinic in 3 weeks"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Innocent murmurs are common in newborns (transitional circulation)</li>
                <li>Reassess after 48-72 hours of life - many resolve as PDA closes</li>
                <li>If murmur persists: outpatient cardiology referral, consider echocardiogram</li>
                <li>Ensure normal pre/post-ductal saturations and femoral pulses</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Murmur Grade 2-3 or Higher"
          urgent={true}
          management={[
            "Cardiology review",
            "ECG",
            "4-limb Blood Pressure",
            "Pre and post-ductal SpO2"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Pathologic murmur features: harsh quality, pansystolic, diastolic, radiation, thrill</li>
                <li>Critical congenital heart disease (CCHD) screening: SpO2 ≥95% in right hand and either foot</li>
                <li>Pulse oximetry difference &gt;3% between pre/post-ductal is abnormal</li>
                <li>Echocardiogram indicated for any concerning murmur</li>
                <li>Consider prostaglandin (PGE1) if duct-dependent lesion suspected</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>

      {/* GROWTH / MEASUREMENTS */}
      <CollapsibleSection title="Growth & Measurements" icon={Ruler} color="green">
        <FindingItem 
          title="Low Birth Weight - IUGR/SGA"
          management={[
            "Check on growth chart",
            "TORCH screening",
            "TMS (Tandem Mass Spectrometry)",
            "UOA (Urine Organic Acids)"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>SGA: Birth weight &lt;10th percentile for gestational age</li>
                <li>Symmetric IUGR: head, length, weight all affected - consider genetic/infectious cause</li>
                <li>Asymmetric IUGR: head sparing - usually placental insufficiency</li>
                <li>Monitor for hypoglycemia, hypothermia, polycythemia</li>
                <li>Early and frequent feeding; consider IV dextrose if symptomatic hypoglycemia</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Low Birth Weight - AGA (Preterm)"
          management={[
            "LBW Formula + EBM (expressed breast milk)",
            "Follow up Postnatal consultant clinic in 2-3 weeks",
            "Daily weight monitoring",
            "HGT (Heel-prick Glucose Testing) protocol"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Breast milk is preferred; fortify if needed for growth</li>
                <li>Target weight gain: 15-20 g/kg/day after initial loss</li>
                <li>Monitor for feeding intolerance, apnea, and thermal instability</li>
                <li>Late preterm (34-36 weeks) at higher risk for hypoglycemia - follow glucose protocol</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Isolated Small Head Circumference (Microcephaly)"
          management={[
            "TORCH screening",
            "Follow up Postnatal consultant clinic in 3 weeks"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Microcephaly: HC &lt;3rd percentile or &gt;2 SD below mean</li>
                <li>Primary causes: genetic, syndromic, congenital infection</li>
                <li>TORCH screening: Toxoplasma, Rubella, CMV, HSV, Zika (if endemic area)</li>
                <li>Consider genetic testing, brain MRI if other anomalies present</li>
                <li>Serial HC measurements to assess growth trajectory</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Large Head Circumference (Macrocephaly)"
          management={[
            "If isolated: TORCH screening, Skull ultrasound",
            "Follow up after ultrasound",
            "If associated with large baby: Follow up to monitor"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Macrocephaly: HC &gt;97th percentile or &gt;2 SD above mean</li>
                <li>Familial macrocephaly: benign, measure parents' HC</li>
                <li>Pathologic causes: hydrocephalus, subdural collections, megalencephaly</li>
                <li>Cranial ultrasound to evaluate ventricles and subarachnoid space</li>
                <li>Monitor for signs of increased ICP: bulging fontanelle, sunsetting eyes</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Wide or Small Anterior Fontanelle"
          management={[
            "Vitamin D level",
            "TSH",
            "Bone profile (Ca, PO4, ALP)",
            "Follow up Postnatal consultant clinic"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li><strong>Large AF:</strong> Normal in first months; consider hypothyroidism, rickets, increased ICP, chromosomal disorders</li>
                <li><strong>Small/Closed AF:</strong> Consider craniosynostosis, hyperthyroidism, normal variant</li>
                <li>Average AF size at birth: 2.1 cm (range 0.6-3.6 cm)</li>
                <li>Normally closes between 9-18 months</li>
                <li>Skull X-ray if craniosynostosis suspected; referral to craniofacial team</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>

      {/* DERMATOLOGY */}
      <CollapsibleSection title="Dermatology" icon={Baby} color="pink">
        <FindingItem 
          title="Cutis Aplasia (Aplasia Cutis Congenita)"
          management={[
            "Skull ultrasound",
            "Dermatology follow up",
            "Follow up Postnatal consultant clinic"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Most cases are isolated scalp lesions with excellent prognosis</li>
                <li>Imaging to rule out underlying skull defect if large or midline</li>
                <li>Keep wound clean and moist; most heal conservatively</li>
                <li>Large defects may need surgical closure or grafting</li>
                <li>Evaluate for associated syndromes (Adams-Oliver, trisomy 13)</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Erythema Toxicum Neonatorum"
          management={[
            "Reassure mother - benign and self-limiting"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Common benign rash in 30-70% of newborns</li>
                <li>Appears within first 2-5 days; resolves within 5-14 days</li>
                <li>Wright or Giemsa stain shows eosinophils (if needed)</li>
                <li>No treatment required; avoid unnecessary investigations</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Neonatal Acne"
          management={[
            "Fusidic acid if infected",
            "Dermatology follow up"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Usually appears at 2-4 weeks of age</li>
                <li>Caused by maternal androgens and Malassezia species</li>
                <li>Most cases resolve spontaneously by 3-4 months</li>
                <li>Severe/persistent cases: consider topical antifungals or gentle cleansing</li>
                <li>Avoid oily lotions and tight clothing</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Transient Neonatal Pustular Melanosis"
          management={[
            "Reassurance - benign condition"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Present at birth with vesicopustules that rupture easily</li>
                <li>Leaves hyperpigmented macules that fade over weeks to months</li>
                <li>More common in dark-skinned infants</li>
                <li>Wright stain shows neutrophils (distinguishes from ETN)</li>
                <li>No treatment needed; resolves spontaneously</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>

      {/* OPHTHALMOLOGY */}
      <CollapsibleSection title="Ophthalmology" icon={Eye} color="indigo">
        <FindingItem 
          title="Eye Discharge (Ophthalmia Neonatorum)"
          management={[
            "Eye swab for Culture & Sensitivity",
            "Fusidic acid eye drops (Fucithalmic) or Vigamox",
            "Follow results in LHC (Local Health Center)"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Consider timing: Chemical (day 1), Gonococcal (days 2-5), Chlamydial (days 5-14)</li>
                <li>Gonococcal: urgent, can lead to corneal perforation - IV/IM ceftriaxone</li>
                <li>Chlamydial: oral erythromycin or azithromycin × 14 days</li>
                <li>Blocked nasolacrimal duct: common, usually resolves by 12 months</li>
                <li>Teach parents eye hygiene and proper drop administration</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Absent Red Reflex (Leukocoria)"
          urgent={true}
          management={[
            "URGENT Ophthalmology review"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li><strong>Emergency referral</strong> - rule out retinoblastoma</li>
                <li>Other causes: congenital cataract, retinal detachment, PHPV, Coats disease</li>
                <li>Red reflex should be checked at birth and every well-child visit</li>
                <li>Document both direct and transilluminated (Brückner) testing</li>
                <li>Delay in diagnosis of retinoblastoma can be life-threatening</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>

      {/* MATERNAL HISTORY */}
      <CollapsibleSection title="Maternal History Considerations" icon={AlertCircle} color="yellow">
        <FindingItem 
          title="Mother Hepatitis B Positive"
          management={[
            "Follow up in LHC",
            "Give OPD card: Advance 2-month vaccine to 1 month",
            "Hepatitis B profile at 6 months, follow results in LHC"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP/CDC Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>HBV vaccine + HBIG within 12 hours of birth for all infants of HBsAg+ mothers</li>
                <li>Complete 3-dose vaccine series</li>
                <li>Post-vaccination serology (HBsAg, anti-HBs) at 9-12 months</li>
                <li>Breastfeeding is NOT contraindicated</li>
                <li>If maternal status unknown: give vaccine, check maternal status, give HBIG if positive</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="History of Neonatal Death / Metabolic Disorder"
          management={[
            "Follow up Metabolic clinic"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Detailed family history and genetic counseling</li>
                <li>Extended newborn metabolic screening</li>
                <li>Consider TMS (Tandem Mass Spec) and UOA (Urine Organic Acids)</li>
                <li>Early feeding to prevent metabolic crisis in at-risk infants</li>
                <li>Genetic testing may be indicated based on family history</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Maternal UTI or Positive HVS (High Vaginal Swab)"
          management={[
            "If treated and repeat C/S sterile: No need to collect C/S for baby"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP/CDC GBS Guidelines:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>GBS colonization: intrapartum antibiotics if indicated</li>
                <li>Adequate IAP: ≥4 hours of appropriate antibiotic before delivery</li>
                <li>Well-appearing term infant with adequate maternal IAP: routine care</li>
                <li>Inadequate IAP: observation for 36-48 hours</li>
                <li>Symptomatic infant: full sepsis workup and empiric antibiotics</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Maternal Autoimmune Disease (SLE, etc.)"
          management={[
            "CBC",
            "ECG",
            "Follow up Rheumatology clinic at 4-6 months"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Neonatal lupus: transplacental transfer of anti-Ro/La antibodies</li>
                <li>Risk of congenital heart block (most serious) - ECG screening</li>
                <li>Transient rash, cytopenias, hepatitis may occur</li>
                <li>Most manifestations resolve by 6-8 months as maternal antibodies clear</li>
                <li>Complete heart block is permanent and may need pacemaker</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Maternal HIV Positive"
          urgent={true}
          management={[
            "Start ARV treatment as per protocol ASAP",
            "Follow up Dr Salwa"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP/CDC/WHO Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>ARV prophylaxis within 6 hours of birth for all HIV-exposed infants</li>
                <li>Duration and regimen based on maternal viral load and treatment status</li>
                <li>Breastfeeding recommendations vary by country and resource setting</li>
                <li>HIV DNA PCR testing at 14-21 days, 1-2 months, and 4-6 months</li>
                <li>Infant considered HIV-negative if 2 negative tests (≥1 at ≥1 month)</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>

      {/* ANTENATAL FINDINGS */}
      <CollapsibleSection title="Antenatal Findings" icon={FileText} color="teal">
        <FindingItem 
          title="Dilated Renal Pelvis (Antenatal Hydronephrosis)"
          management={[
            "Renal Ultrasound as inpatient",
            "U/Cr/E, Urine R/M, C/S as inpatient",
            "After US report:",
            "If APD <1 cm: Nephro follow up",
            "If APD >1 cm: Prophylactic antibiotics + Nephro review + Surgical appointment"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP/Urological Association Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Postnatal US after 48-72 hours (allow for physiological dehydration)</li>
                <li>APD &lt;10mm and SFU grade 1-2: usually resolves, conservative follow-up</li>
                <li>APD ≥10mm or SFU grade 3-4: antibiotic prophylaxis, VCUG, MAG3 scan</li>
                <li>VCUG to rule out vesicoureteral reflux</li>
                <li>Repeat US at 1 month, 3 months, then as needed</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Polycystic Kidney (Antenatal)"
          management={[
            "Renal Ultrasound as inpatient"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>ARPKD (autosomal recessive): enlarged echogenic kidneys, oligohydramnios</li>
                <li>ADPKD (autosomal dominant): may present later with discrete cysts</li>
                <li>Monitor renal function, blood pressure, liver involvement</li>
                <li>Genetic counseling and family screening</li>
                <li>Nephrology follow-up for long-term management</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Intracranial Abnormalities (Antenatal)"
          management={[
            "Skull ultrasound as inpatient",
            "Daily head circumference measurement"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Postnatal cranial ultrasound to confirm and characterize findings</li>
                <li>MRI for better anatomical detail if significant abnormality</li>
                <li>Neurology/Neurosurgery consultation as appropriate</li>
                <li>Monitor for signs of hydrocephalus: increasing HC, bulging fontanelle</li>
                <li>Genetic/metabolic workup if indicated</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>

      {/* OTHERS */}
      <CollapsibleSection title="Other Findings" icon={Stethoscope} color="slate">
        <FindingItem 
          title="Hypotonia (Floppy Baby)"
          management={[
            "Skull ultrasound",
            "TMS (Tandem Mass Spectrometry)",
            "UOA (Urine Organic Acids)",
            "Physiotherapy",
            "Follow up Postnatal consultant clinic in 2-3 weeks"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Differentiate central (brain) vs peripheral (neuromuscular) hypotonia</li>
                <li>Central: poor suck, seizures, encephalopathy</li>
                <li>Peripheral: weakness, respiratory compromise, feeding difficulties</li>
                <li>Workup: CK, chromosomes, metabolic screen, consider SMA testing</li>
                <li>PT/OT for developmental support; feeding support as needed</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Jittery Baby"
          management={[
            "Asphyxia markers",
            "Glucose",
            "U/Cr/E, Calcium, Magnesium, Phosphate"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Distinguish jitteriness from seizures: stimulus-sensitive, stops with passive flexion</li>
                <li>Common causes: hypoglycemia, hypocalcemia, drug withdrawal, IDM</li>
                <li>Check glucose, calcium, magnesium; treat underlying cause</li>
                <li>If persistent or atypical: EEG to rule out subtle seizures</li>
                <li>Most jitteriness is benign and resolves spontaneously</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Neonatal Jaundice"
          management={[
            "If ABO incompatibility: CBC and follow up in 1 month with Postnatal consultant clinic"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Universal bilirubin screening before discharge</li>
                <li>Plot on Bhutani nomogram to assess risk</li>
                <li>Phototherapy thresholds based on gestational age and risk factors</li>
                <li>Exchange transfusion if approaching critical levels</li>
                <li>Ensure adequate feeding to promote bilirubin excretion</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Late Preterm (34-36+6 weeks)"
          management={[
            "Follow up Postnatal consultant clinic in 3 weeks"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Higher risk for: hypoglycemia, hypothermia, feeding difficulties, jaundice</li>
                <li>Delay discharge until stable feeding established (usually 48-72 hours)</li>
                <li>Close follow-up within 24-48 hours of discharge</li>
                <li>Car seat tolerance test before discharge</li>
                <li>Monitor growth and development closely</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Single Umbilical Artery"
          management={[
            "Renal Ultrasound",
            "Follow up Postnatal consultant clinic after ultrasound"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Isolated SUA: low risk for major anomalies</li>
                <li>Renal US to screen for urogenital anomalies (6-12% association)</li>
                <li>If other anomalies detected: genetic evaluation</li>
                <li>Cardiac echo if murmur or other concerns</li>
                <li>Routine screening if isolated finding and normal renal US</li>
              </ul>
            </div>
          }
        />
        <FindingItem 
          title="Hyperpigmentation of Female Genitalia"
          management={[
            "ACTH level",
            "If ACTH <15: can discharge with follow up"
          ]}
          aapGuideline={
            <div className="space-y-2">
              <p><strong>AAP/Endocrine Society Recommendation:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>May indicate congenital adrenal hyperplasia (CAH)</li>
                <li>Check 17-OHP on newborn screen or directly</li>
                <li>ACTH level to assess adrenal function</li>
                <li>If CAH suspected: electrolytes, glucose, cortisol</li>
                <li>Salt-wasting crisis can occur in first 1-2 weeks - urgent evaluation if virilization</li>
              </ul>
            </div>
          }
        />
      </CollapsibleSection>
    </div>
  );
};

export default NeonatalExaminationApproach;
