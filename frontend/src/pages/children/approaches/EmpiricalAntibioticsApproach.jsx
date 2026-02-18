/**
 * Empirical Use of Antibiotics Pediatric Guidelines
 * Based on SMC Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const EmpiricalAntibioticsApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  // Helper for per-dose drugs (mg/kg/dose) - no division needed
  const calcPerDose = (perKgDose) => {
    if (w <= 0) return null;
    return (w * perKgDose).toFixed(0);
  };

  // Helper for per-day drugs (mg/kg/day) - divide by frequency
  const calcPerDay = (perKgDay, freq) => {
    if (w <= 0) return null;
    return (w * perKgDay / freq).toFixed(0);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Empirical Use of Antibiotics</CardTitle>
        <CardDescription className="text-xs">Pediatric Guidelines - SMC</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Introduction */}
        <Section id="abx-intro" title="Introduction & Key Principles" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border-l-4 border-amber-500">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Antimicrobial Resistance Alert</p>
              <p className="text-muted-foreground leading-relaxed">Antimicrobial resistance is declared a global threat to health, based on rapidly increasing resistance rates and declining new drug development.</p>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border-l-4 border-red-500">
              <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Main Concerns Regarding Abx Use</p>
              <ul className="text-muted-foreground space-y-1.5">
                <li className="flex items-start"><span className="mr-2 mt-0.5">•</span><span className="leading-relaxed">Inappropriate choice of empiric antibiotics</span></li>
                <li className="flex items-start"><span className="mr-2 mt-0.5">•</span><span className="leading-relaxed">Continuation of empiric therapy despite negative cultures in stable patients</span></li>
                <li className="flex items-start"><span className="mr-2 mt-0.5">•</span><span className="leading-relaxed">Lack of awareness of accurate utilization of susceptibility patterns</span></li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500">
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Essential General Rules</p>
              <ul className="text-muted-foreground space-y-1.5">
                <li className="flex items-start"><span className="mr-2 mt-0.5">•</span><span className="leading-relaxed">Obtain cultures PRIOR to starting/modifying antibiotics</span></li>
                <li className="flex items-start"><span className="mr-2 mt-0.5">•</span><span className="leading-relaxed">Once culture/sensitivity is ready: TAILOR your Abx to narrow spectrum</span></li>
                <li className="flex items-start"><span className="mr-2 mt-0.5">•</span><span className="leading-relaxed">Serum trough level (Vancomycin, Gentamicin) should be done before the FOURTH dose</span></li>
                <li className="flex items-start"><span className="mr-2 mt-0.5">•</span><span className="leading-relaxed">Do NOT postpone subsequent doses unless renal function is abnormal</span></li>
                <li className="flex items-start"><span className="mr-2 mt-0.5">•</span><span className="leading-relaxed">If renal function abnormal: Do not administer until safe trough level confirmed</span></li>
                <li className="flex items-start"><span className="mr-2 mt-0.5">•</span><span className="leading-relaxed">If renal function normal: Administer without delay</span></li>
              </ul>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-l-4 border-purple-500">
              <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Important Note on Febrile Neutropenia</p>
              <p className="text-muted-foreground leading-relaxed">The term "Febrile Neutropenia" applies to oncology patients. Healthy children may have transient neutropenia during viral illness, yet only symptomatic treatment is needed. Such patients should NOT be labeled as "Febrile Neutropenic", nor isolated or kept on Abx.</p>
            </div>
          </div>
        </Section>

        {/* Skin & Soft Tissue Infections */}
        <Section id="abx-skin" title="Skin & Soft Tissue Infections" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '120px' }}>Indication</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '250px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Non-Purulent Cellulitis</td>
                    <td className="p-2 align-top">GAS, S. aureus</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Augmentin</span> 25 mg/kg/dose PO q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(25)} mg q12h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Purulent Cellulitis / Abscess</td>
                    <td className="p-2 align-top">S. aureus (inc. MRSA)</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">I&D is main treatment</span></p>
                      <p className="mt-1"><span className="font-medium text-blue-600">Clindamycin</span> 10 mg/kg/day PO/IV q8h (if Abx indicated)</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDay(10, 3)} mg q8h</p>}
                      <p className="text-[10px] mt-2 text-amber-600 leading-relaxed p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded">Use Abx only if: cellulitis, abscess &gt;2cm (&gt;1cm in infants), inability to drain, systemic illness (fever &gt;38°C), immunodeficiency, multiple sites</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Necrotizing Fasciitis</td>
                    <td className="p-2 align-top">GAS, S. aureus, GNR, anaerobes</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Cefepime</span> 50mg/kg/dose q8h + <span className="font-medium">Vancomycin</span> 15mg/kg/dose q6h + <span className="font-medium">Clindamycin</span> 10mg/kg/day q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Cefepime {calcPerDose(50)} mg + Vanco {calcPerDose(15)} mg + Clinda {calcPerDay(10, 3)} mg</p>}
                      <p className="text-[10px] mt-1 text-red-500 font-medium">Consult ID & Pediatric/Plastic Surgery for all cases</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Periorbital Cellulitis</td>
                    <td className="p-2 align-top">S. Pneumo, S. aureus, GAS</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Clindamycin</span> 10 mg/kg/day PO/IV q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDay(10, 3)} mg q8h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Orbital Cellulitis</td>
                    <td className="p-2 align-top">S. Pneumo, Moraxella, GAS, anaerobes</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg/day q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg/dose q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Clinda {calcPerDay(10, 3)} mg q8h + Ceftriaxone {calcPerDose(50)} mg q12h</p>}
                      <p className="text-[10px] mt-1 text-amber-600">If patient colonized with MRSA: Consult ID</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Impetigo / Folliculitis</td>
                    <td className="p-2 align-top">S. aureus, GAS</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Augmentin</span> 25mg/kg/dose PO BID + Mupirocin 2% topical BID</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(25)} mg BID</p>}
                      <p className="text-[10px] mt-1 text-amber-600">If patient colonized with MRSA: Consult ID</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Cervical Lymphadenitis</td>
                    <td className="p-2 align-top">S. aureus, GAS</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Augmentin</span> 25mg/kg/dose PO BID</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(25)} mg BID</p>}
                      <p className="text-[10px] mt-1"><span className="font-medium">Alt:</span> Clindamycin 10mg/kg/day PO/IV q8h</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">Bites (cat/dog/human)</td>
                    <td className="p-2 align-top">Pasteurella, S. aureus, Eikenella, anaerobes</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Augmentin</span> 25mg/kg/dose PO BID <span className="font-medium">OR</span> 30mg/kg/dose IV q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ PO: {calcPerDose(25)} mg BID | IV: {calcPerDose(30)} mg q8h</p>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Ear & Sinus Infections */}
        <Section id="abx-ear" title="Ear & Sinus Infections" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '120px' }}>Indication</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '250px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Otitis Media</td>
                    <td className="p-2 align-top">Pneumococcus, H. Influenzae, Moraxella</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Amoxicillin</span> 90 mg/kg/day q8h <span className="font-medium">OR</span> Cefuroxime</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDay(90, 3)} mg q8h</p>}
                      <p className="text-[10px] mt-1"><span className="font-medium">Recurrent:</span> Augmentin</p>
                      <p className="text-[10px]"><span className="font-medium">Severe/unresponsive to PO:</span> Cefotaxime</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Acute Mastoiditis</td>
                    <td className="p-2 align-top">Pneumococcus, S. aureus, GAS, Pseudomonas</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg/dose IV/PO q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg/dose q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Clinda {calcPerDose(10)} mg q8h + Ceftriaxone {calcPerDose(50)} mg q12h</p>}
                      <p className="text-[10px] mt-1 text-red-500 font-medium">Rule out meningitis. Surgical intervention as needed</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">Acute Sinusitis</td>
                    <td className="p-2 align-top">Pneumococcus, H. Influenzae</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">1st line:</span> Amoxicillin</p>
                      <p className="text-[10px] mt-1"><span className="font-medium">2nd line:</span> Augmentin</p>
                      <p className="text-[10px] mt-1 text-amber-600 leading-relaxed">Treat with Abx only if not resolving after 7-10 days of symptomatic treatment</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Oropharyngeal Infections */}
        <Section id="abx-pharynx" title="Oropharyngeal Infections" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '120px' }}>Indication</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '250px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Pharyngitis (GAS)</td>
                    <td className="p-2 align-top">Group A Strep</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Amoxicillin</span> 45 mg/kg/day PO q8h x 10 days <span className="font-medium">OR</span> Cefuroxime PO</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDay(45, 3)} mg q8h x 10 days</p>}
                      <p className="text-[10px] mt-1"><span className="font-medium">PCN allergy:</span> Azithromycin 10mg/kg/day x 5 days</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Peritonsillar Abscess</td>
                    <td className="p-2 align-top">Aerobic/Anaerobic flora, CA-MRSA</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg/dose IV/PO q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg/dose q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Clinda {calcPerDose(10)} mg q8h + Ceftriaxone {calcPerDose(50)} mg q12h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Retropharyngeal Abscess</td>
                    <td className="p-2 align-top">Aerobic/Anaerobic flora, CA-MRSA</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg/dose IV/PO q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg/dose q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Clinda {calcPerDose(10)} mg q8h + Ceftriaxone {calcPerDose(50)} mg q12h</p>}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">Tracheitis</td>
                    <td className="p-2 align-top">GAS, S. aureus, Pneumococcus, Pseudomonas</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Ceftriaxone</span> 50mg/kg/dose q12h + <span className="font-medium">Vancomycin</span> 15mg/kg/dose q6h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Ceftriaxone {calcPerDose(50)} mg q12h + Vanco {calcPerDose(15)} mg q6h</p>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Gastrointestinal System */}
        <Section id="abx-gi" title="Gastrointestinal System" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '120px' }}>Indication</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '250px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">NEC (Neonates)</td>
                    <td className="p-2 align-top">Enteric GNR, Enterococcus, anaerobes</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Ampicillin + Gentamicin</span> ± Metronidazole</p>
                      <p className="text-[10px] mt-1"><span className="font-medium">Severely ill:</span> Consider Vancomycin + Meropenem</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">C. Diff Enterocolitis</td>
                    <td className="p-2 align-top">C. Difficile</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Metronidazole</span> 10mg/kg/dose PO/IV q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(10)} mg q8h</p>}
                      <p className="text-[10px] mt-1 text-amber-600">Stop offending antibiotic if possible. Consult ID if fulminant or recurrent</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Primary Peritonitis</td>
                    <td className="p-2 align-top">S. Pneumo, GNR</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Ceftriaxone</span> 50mg/kg/dose IV q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(50)} mg q12h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Secondary Peritonitis (post-perforation)</td>
                    <td className="p-2 align-top">GNR, anaerobes</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Ampicillin</span> 50mg/kg/dose q6h + <span className="font-medium">Gentamicin</span> 2.5mg/kg/dose q8h + <span className="font-medium">Metronidazole</span> 10mg/kg/dose q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Amp {calcPerDose(50)} mg q6h + Gent {calcPerDose(2.5)} mg q8h + Metro {calcPerDose(10)} mg q8h</p>}
                      <p className="text-[10px] mt-1 text-red-500 font-medium">Consult ID</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">Complicated Appendicitis</td>
                    <td className="p-2 align-top">GNR, anaerobes</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Tazocin (Piperacillin-Tazobactam)</span></p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Respiratory System */}
        <Section id="abx-resp" title="Respiratory System (Pneumonia)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '120px' }}>Age/Type</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '250px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Neonates</td>
                    <td className="p-2 align-top">GBS, GNR, Listeria</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">IV Ampicillin + IV Gentamicin</span></p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">1-3 months</td>
                    <td className="p-2 align-top">S. Pneumo, C. Trachomatis, B. Pertussis, S. aureus</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">IV Ampicillin + Cefotaxime</span> 50mg/kg/dose q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Cefotaxime {calcPerDose(50)} mg q8h</p>}
                      <p className="text-[10px] mt-1">Obtain NPA for respiratory viruses</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">3mo - 12yr (Community, Immunized)</td>
                    <td className="p-2 align-top">S. Pneumo, Mycoplasma, S. aureus</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Augmentin</span> 25mg/kg/dose q12h <span className="font-medium">OR</span> <span className="font-medium">Cefuroxime</span> 15mg/kg/dose q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Augmentin {calcPerDose(25)} mg OR Cefuroxime {calcPerDose(15)} mg q12h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">3-12yr (Atypical)</td>
                    <td className="p-2 align-top">Mycoplasma pneumoniae</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Azithromycin</span> 10mg/kg/day PO x 5 days</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDay(10, 1)} mg/day x 5 days</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Complicated Pneumonia</td>
                    <td className="p-2 align-top">S. Pneumo, S. aureus, H. flu, S. pyogenes</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Ceftriaxone</span> 50mg/kg/dose q12h + <span className="font-medium">Vancomycin</span> 15mg/kg/dose q6h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Ceftriaxone {calcPerDose(50)} mg q12h + Vanco {calcPerDose(15)} mg q6h</p>}
                      <p className="text-[10px] mt-1"><span className="font-medium">Severely ill:</span> Consider Tazocin + Vancomycin</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Nosocomial / VAP</td>
                    <td className="p-2 align-top">Pseudomonas, Enterobacter, Klebsiella, Serratia</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Tazocin</span> 100mg/kg/dose q8h + <span className="font-medium">Vancomycin</span> 15mg/kg/dose q6h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Tazocin {calcPerDose(100)} mg q8h + Vanco {calcPerDose(15)} mg q6h</p>}
                      <p className="text-[10px] mt-1">Consider adding aminoglycoside in severe cases</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">Aspiration Pneumonia</td>
                    <td className="p-2 align-top">Anaerobes</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Augmentin</span> 30mg/kg/dose q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(30)} mg q8h</p>}
                      <p className="text-[10px] mt-1"><span className="font-medium">Alt:</span> Clindamycin</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-[10px]">
              <p className="font-medium text-amber-700 dark:text-amber-300">Complicated Pneumonia Definition:</p>
              <p className="text-muted-foreground leading-relaxed">Necrotizing pneumonia, Parapneumonic effusion, Empyema, Lung abscess, Pneumatocele</p>
            </div>
          </div>
        </Section>

        {/* UTI */}
        <Section id="abx-uti" title="Urinary Tract Infections" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '120px' }}>Indication</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '250px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Cystitis</td>
                    <td className="p-2 align-top">E. coli, Klebsiella, Proteus</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Nitrofurantoin</span> 5-7mg/kg/day PO q6h <span className="font-medium">OR</span> <span className="font-medium">Cefuroxime</span> 15mg/kg/dose PO BID</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Nitrofurantoin {calcPerDay(6, 4)} mg q6h OR Cefuroxime {calcPerDose(15)} mg BID</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Pyelonephritis</td>
                    <td className="p-2 align-top">E. coli, Klebsiella, Proteus, Pseudomonas</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Ceftriaxone</span> 50mg/kg/dose IV q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(50)} mg q12h</p>}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">Recurrent UTI Prophylaxis</td>
                    <td className="p-2 align-top">Grade 3-4 reflux only</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">TMP/SMX</span> 2mg/kg/day q24h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDay(2, 1)} mg daily</p>}
                      <p className="text-[10px] mt-1"><span className="font-medium">Alt:</span> Nitrofurantoin 2mg/kg/dose q24h</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Osteoarthritis */}
        <Section id="abx-bone" title="Osteoarthritis / Bone & Joint Infections" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '120px' }}>Indication</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '250px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Neonate</td>
                    <td className="p-2 align-top">S. aureus, GBS, GNR</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Cefotaxime + Cloxacillin</span></p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">All Age Groups</td>
                    <td className="p-2 align-top">S. aureus, S. Pneumo</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg/dose IV q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(10)} mg q8h</p>}
                      <p className="text-[10px] mt-1">Add Ceftriaxone for non-immunized patients</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">Sickle Cell Anemia</td>
                    <td className="p-2 align-top">S. aureus, S. Pneumo, Salmonella</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg/day q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg/dose q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Clinda {calcPerDay(10, 3)} mg q8h + Ceftriaxone {calcPerDose(50)} mg q12h</p>}
                      <p className="text-[10px] mt-1"><span className="font-medium">Alt:</span> Clindamycin 10mg/kg/dose q8h + Ciprofloxacin 10mg/kg/dose q12h</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Septicemia / Bacteremia */}
        <Section id="abx-sepsis" title="Septicemia / Bacteremia" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '140px' }}>Indication</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '230px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Neonate (up to 4 wks)</td>
                    <td className="p-2 align-top">GBS, GNR, Listeria, Enterococcus</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">IV Ampicillin + IV Gentamicin</span></p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">4 wks - 3 months</td>
                    <td className="p-2 align-top">Same as Neonates + Older</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Ampicillin</span> 50mg/kg/dose q6h + <span className="font-medium">Cefotaxime</span> 50mg/kg/dose q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Amp {calcPerDose(50)} mg q6h + Cefo {calcPerDose(50)} mg q8h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">&gt;3mo (Community)</td>
                    <td className="p-2 align-top">S. pneumo, Meningococcus, S. aureus, H. flu, E. coli</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Ceftriaxone</span> 50mg/kg/dose q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(50)} mg q12h</p>}
                      <p className="text-[10px] mt-1">Add Vancomycin in severely ill patient</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">&gt;3mo + Hospital &gt;48h</td>
                    <td className="p-2 align-top">Pseudomonas, Klebsiella, E. coli, MRSA</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Tazocin</span> 100mg/kg/dose q8h ± <span className="font-medium">Vancomycin</span> 15mg/kg/dose q6h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Tazocin {calcPerDose(100)} mg q8h + Vanco {calcPerDose(15)} mg q6h</p>}
                      <p className="text-[10px] mt-1">Consider Aminoglycoside in severely ill patient</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">&gt;3mo + Septic Shock</td>
                    <td className="p-2 align-top">S. pneumo, Meningococcus, S. aureus</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Tazocin</span> 100mg/kg/dose q8h + <span className="font-medium">Vancomycin</span> 15mg/kg/dose q6h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Tazocin {calcPerDose(100)} mg q8h + Vanco {calcPerDose(15)} mg q6h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">&gt;3mo + Shock + Hospital &gt;48h</td>
                    <td className="p-2 align-top">MRSA, ESBL producers</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Meropenem</span> 40mg/kg/dose q8h + <span className="font-medium">Vancomycin</span> 15mg/kg/dose q6h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Meropenem {calcPerDose(40)} mg q8h + Vanco {calcPerDose(15)} mg q6h</p>}
                      <p className="text-[10px] mt-1">Consider aminoglycoside in severely ill patient</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">Sickle Cell + Sepsis</td>
                    <td className="p-2 align-top">S. pneumo, H. flu, Salmonella</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Ceftriaxone</span> 50mg/kg/dose q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(50)} mg q12h</p>}
                      <p className="text-[10px] mt-1">In severely ill patient, add IV Vancomycin</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* CNS Meningitis */}
        <Section id="abx-cns" title="CNS Meningitis" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500 mb-3">
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Dexamethasone Consideration</p>
              <p className="text-muted-foreground">Dose: 0.15 mg/kg/dose q6h IV x 4 days</p>
              <p className="text-muted-foreground">Timing: Give before or within 1 hour of first dose of antibiotics</p>
              {w > 0 && <p className="font-mono text-blue-600 mt-1">→ {calcPerDose(0.15)} mg q6h</p>}
            </div>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '120px' }}>Indication</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '250px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Neonate (up to 4 wks)</td>
                    <td className="p-2 align-top">GBS, GNR, L. monocytogenes</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Ampicillin IV + Cefotaxime IV</span></p>
                      <p className="text-[10px] mt-1">(check neonatal doses)</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">4 wks - 3 months</td>
                    <td className="p-2 align-top">Same as Neonates + Older</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Ampicillin</span> 100mg/kg/dose q6h + <span className="font-medium">Cefotaxime</span> 50mg/kg/dose q6h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Amp {calcPerDose(100)} mg + Cefo {calcPerDose(50)} mg q6h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Older Children</td>
                    <td className="p-2 align-top">S. pneumo, N. meningitidis</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Ceftriaxone</span> 50mg/kg/dose q12h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {calcPerDose(50)} mg q12h</p>}
                      <p className="text-[10px] mt-1">Add Vancomycin in critical cases. Target Vanco level 15-20. Check culture to stop Vancomycin</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Meningo-Encephalitis</td>
                    <td className="p-2 align-top">S. pneumo, N. meningitidis, HSV</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Ceftriaxone</span> 50mg/kg/dose q12h + <span className="font-medium">Acyclovir</span> 20mg/kg/dose q8h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Ceftriaxone {calcPerDose(50)} mg q12h + Acyclovir {calcPerDose(20)} mg q8h</p>}
                      <p className="text-[10px] mt-1">Ensure direct communication with lab to receive and process PCR-meningitis panel</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">VP Shunt Infection</td>
                    <td className="p-2 align-top">CoNS, GNR</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Ceftazidime</span> 50mg/kg/dose q8h + <span className="font-medium">Vancomycin</span> 15mg/kg/dose q6h</p>
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Ceftazidime {calcPerDose(50)} mg q8h + Vanco {calcPerDose(15)} mg q6h</p>}
                      <p className="text-[10px] mt-1">If severely ill: Start Meropenem and consult ID. Target Vanco level 15-20</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Febrile Neutropenia */}
        <Section id="abx-neutropenia" title="Febrile Neutropenia (Immunocompromised)" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-l-4 border-purple-500 mb-3">
              <p className="font-semibold text-purple-700 dark:text-purple-300">Note</p>
              <p className="text-muted-foreground leading-relaxed">This applies to oncology patients. Healthy children with transient neutropenia during viral illness need only symptomatic treatment.</p>
            </div>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '550px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '120px' }}>Indication</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '100px' }}>Pathogen</th>
                    <th className="text-left p-2 font-semibold border-b" style={{ minWidth: '250px' }}>Antimicrobial & Comments</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground align-top">Stable Patients</td>
                    <td className="p-2 align-top">GNR</td>
                    <td className="p-2">
                      <p><span className="font-medium text-blue-600">Cefepime</span> <span className="font-medium">OR</span> <span className="font-medium">Tazocin</span> + <span className="font-medium">Gentamicin</span></p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground align-top">Unstable Patients</td>
                    <td className="p-2 align-top">GNR, GPC, fungal</td>
                    <td className="p-2">
                      <p><span className="font-medium text-red-600">Meropenem</span> + <span className="font-medium">Gentamicin</span></p>
                      <p className="text-[10px] mt-1">Add Vancomycin in severely ill patients</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Abbreviations */}
        <Section id="abx-abbrev" title="Abbreviations" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">GBS</p>
                <p className="text-muted-foreground text-[10px]">Group B Streptococcus</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">GNR</p>
                <p className="text-muted-foreground text-[10px]">Gram Negative Rods/Bacilli</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">GAS</p>
                <p className="text-muted-foreground text-[10px]">Group A Streptococcus</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">CoNS</p>
                <p className="text-muted-foreground text-[10px]">Coagulase-negative Staphylococci</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">HSV</p>
                <p className="text-muted-foreground text-[10px]">Herpes Simplex Virus</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">MRSA</p>
                <p className="text-muted-foreground text-[10px]">Methicillin-Resistant S. aureus</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">ESBL</p>
                <p className="text-muted-foreground text-[10px]">Extended-Spectrum Beta-Lactamase</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">CA</p>
                <p className="text-muted-foreground text-[10px]">Community Acquired</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">I&D</p>
                <p className="text-muted-foreground text-[10px]">Incision and Drainage</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-medium">VAP</p>
                <p className="text-muted-foreground text-[10px]">Ventilator-Associated Pneumonia</p>
              </div>
            </div>
          </div>
        </Section>

      </CardContent>
    </Card>
  );
};

export default EmpiricalAntibioticsApproach;
