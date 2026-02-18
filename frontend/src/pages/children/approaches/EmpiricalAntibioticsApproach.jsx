/**
 * Empirical Use of Antibiotics Pediatric Guidelines
 * Based on SMC Guidelines
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "./Section";

const EmpiricalAntibioticsApproach = ({ weight, expandedSections, toggleSection }) => {
  const w = parseFloat(weight) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Empirical Use of Antibiotics</CardTitle>
        <CardDescription className="text-xs">Pediatric Guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Introduction */}
        <Section id="abx-intro" title="Introduction & Key Principles" defaultOpen={true} expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border-l-4 border-amber-500">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Antimicrobial Resistance Alert</p>
              <p className="text-muted-foreground">Antimicrobial resistance is declared a global threat to health, based on rapidly increasing resistance rates and declining new drug development.</p>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border-l-4 border-red-500">
              <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Main Concerns Regarding Abx Use</p>
              <ul className="text-muted-foreground space-y-1">
                <li className="flex"><span className="mr-2">•</span><span>Inappropriate choice of empiric antibiotics</span></li>
                <li className="flex"><span className="mr-2">•</span><span>Continuation of empiric therapy despite negative cultures in stable patients</span></li>
                <li className="flex"><span className="mr-2">•</span><span>Lack of awareness of accurate utilization of susceptibility patterns</span></li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500">
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Essential General Rules</p>
              <ul className="text-muted-foreground space-y-1">
                <li className="flex"><span className="mr-2">•</span><span>Obtain cultures PRIOR to starting/modifying antibiotics</span></li>
                <li className="flex"><span className="mr-2">•</span><span>Once culture/sensitivity is ready: TAILOR your Abx to narrow spectrum</span></li>
                <li className="flex"><span className="mr-2">•</span><span>Serum trough level (Vancomycin, Gentamicin) should be done before the FOURTH dose</span></li>
                <li className="flex"><span className="mr-2">•</span><span>Do NOT postpone subsequent doses unless renal function is abnormal</span></li>
                <li className="flex"><span className="mr-2">•</span><span>If renal function abnormal: Do not administer until safe trough level confirmed</span></li>
                <li className="flex"><span className="mr-2">•</span><span>If renal function normal: Administer without delay</span></li>
              </ul>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-l-4 border-purple-500">
              <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Important Note on Febrile Neutropenia</p>
              <p className="text-muted-foreground">The term "Febrile Neutropenia" applies to oncology patients. Healthy children may have transient neutropenia during viral illness, yet only symptomatic treatment is needed. Such patients should NOT be labeled as "Febrile Neutropenic", nor isolated or kept on Abx.</p>
            </div>
          </div>
        </Section>

        {/* Skin & Soft Tissue Infections */}
        <Section id="abx-skin" title="Skin & Soft Tissue Infections" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Indication</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Non-Purulent Cellulitis</td>
                    <td className="p-2">GAS, S. aureus</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Augmentin</span> 25 mg/kg/dose PO q12h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 25).toFixed(0)} mg q12h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Purulent Cellulitis / Abscess</td>
                    <td className="p-2">S. aureus (inc. MRSA)</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">I&D + Clindamycin</span> 10 mg/kg/dose PO/IV q8h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 10).toFixed(0)} mg q8h</p>}
                      <p className="text-[10px] mt-1 text-amber-600">Abx if: cellulitis, abscess &gt;2cm, systemic illness, immunodeficiency</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Necrotizing Fasciitis</td>
                    <td className="p-2">GAS, S. aureus, GNR, anaerobes</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Cefepime</span> 50mg/kg q8h + <span className="font-medium">Vancomycin</span> 15mg/kg q6h + <span className="font-medium">Clindamycin</span> 10mg/kg q8h
                      <p className="text-[10px] mt-1 text-red-500">Consult ID & Surgery</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Periorbital Cellulitis</td>
                    <td className="p-2">S. Pneumo, S. aureus, GAS</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Clindamycin</span> 10 mg/kg/dose PO/IV q8h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 10).toFixed(0)} mg q8h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Orbital Cellulitis</td>
                    <td className="p-2">S. Pneumo, Moraxella, GAS, anaerobes</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg q12h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Clinda {(w * 10).toFixed(0)} mg + Ceftriaxone {(w * 50).toFixed(0)} mg</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Impetigo / Folliculitis</td>
                    <td className="p-2">S. aureus, GAS</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Augmentin</span> 25mg/kg PO BID + Mupirocin 2% topical BID
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Cervical Lymphadenitis</td>
                    <td className="p-2">S. aureus, GAS</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Augmentin</span> 25mg/kg PO BID (Alt: Clindamycin 10mg/kg q8h)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">Bites (cat/dog/human)</td>
                    <td className="p-2">Pasteurella, S. aureus, Eikenella, anaerobes</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Augmentin</span> 25mg/kg PO BID or 30mg/kg IV q8h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 25).toFixed(0)} mg PO or {(w * 30).toFixed(0)} mg IV</p>}
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Indication</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Otitis Media</td>
                    <td className="p-2">Pneumococcus, H. Influenzae, Moraxella</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Amoxicillin</span> 90 mg/kg/day q8h or Cefuroxime
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 30).toFixed(0)} mg q8h</p>}
                      <p className="text-[10px] mt-1">Recurrent: Augmentin | Severe: Cefotaxime</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Acute Mastoiditis</td>
                    <td className="p-2">Pneumococcus, S. aureus, GAS, Pseudomonas</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg q12h
                      <p className="text-[10px] mt-1 text-red-500">Rule out meningitis. Surgical intervention as needed</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">Acute Sinusitis</td>
                    <td className="p-2">Pneumococcus, H. Influenzae</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Amoxicillin</span> (2nd line: Augmentin)
                      <p className="text-[10px] mt-1 text-amber-600">Treat with Abx only if not resolving after 7-10 days of symptomatic treatment</p>
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Indication</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Pharyngitis (GAS)</td>
                    <td className="p-2">Group A Strep</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Amoxicillin</span> 45 mg/kg/day PO q8h x 10 days
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 15).toFixed(0)} mg q8h x 10 days</p>}
                      <p className="text-[10px] mt-1">PCN allergy: Azithromycin 10mg/kg/day x 5 days</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Peritonsillar Abscess</td>
                    <td className="p-2">Aerobic/Anaerobic flora, CA-MRSA</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg q12h
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Retropharyngeal Abscess</td>
                    <td className="p-2">Aerobic/Anaerobic flora, CA-MRSA</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg q12h
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">Tracheitis</td>
                    <td className="p-2">GAS, S. aureus, Pneumococcus, Pseudomonas</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Ceftriaxone</span> 50mg/kg q12h + <span className="font-medium">Vancomycin</span> 15mg/kg q6h
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Indication</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">NEC (Neonates)</td>
                    <td className="p-2">Enteric GNR, Enterococcus, anaerobes</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Ampicillin + Gentamicin</span> +/- Metronidazole
                      <p className="text-[10px] mt-1">Severely ill: Vancomycin + Meropenem</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">C. Diff Enterocolitis</td>
                    <td className="p-2">C. Difficile</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Metronidazole</span> 10mg/kg/dose PO/IV q8h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 10).toFixed(0)} mg q8h</p>}
                      <p className="text-[10px] mt-1 text-amber-600">Stop offending antibiotic. Consult ID if fulminant/recurrent</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Primary Peritonitis</td>
                    <td className="p-2">S. Pneumo, GNR</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Ceftriaxone</span> 50mg/kg/dose IV q12h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 50).toFixed(0)} mg q12h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Secondary Peritonitis</td>
                    <td className="p-2">GNR, anaerobes</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Ampicillin</span> 50mg/kg q6h + <span className="font-medium">Gentamicin</span> 2.5mg/kg q8h + <span className="font-medium">Metronidazole</span> 10mg/kg q8h
                      <p className="text-[10px] mt-1 text-red-500">Consult ID</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">Complicated Appendicitis</td>
                    <td className="p-2">GNR, anaerobes</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Tazocin (Piperacillin-Tazobactam)</span>
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Age/Type</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Neonates</td>
                    <td className="p-2">GBS, GNR, Listeria</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">IV Ampicillin + IV Gentamicin</span>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">1-3 months</td>
                    <td className="p-2">S. Pneumo, C. Trachomatis, B. Pertussis, S. aureus</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">IV Ampicillin + Cefotaxime</span> 50mg/kg q8h
                      <p className="text-[10px] mt-1">Obtain NPA for respiratory viruses</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">3mo - 12yr (Community)</td>
                    <td className="p-2">S. Pneumo, Mycoplasma, S. aureus</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Augmentin</span> 25mg/kg q12h or <span className="font-medium">Cefuroxime</span> 15mg/kg q12h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 25).toFixed(0)} mg Augmentin or {(w * 15).toFixed(0)} mg Cefuroxime q12h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">3-12yr (Atypical)</td>
                    <td className="p-2">Mycoplasma pneumoniae</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Azithromycin</span> 10mg/kg/day PO x 5 days
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 10).toFixed(0)} mg/day x 5 days</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Complicated Pneumonia</td>
                    <td className="p-2">S. Pneumo, S. aureus, H. flu, S. pyogenes</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Ceftriaxone</span> 50mg/kg q12h + <span className="font-medium">Vancomycin</span> 15mg/kg q6h
                      <p className="text-[10px] mt-1">Severely ill: Tazocin + Vancomycin</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Nosocomial/VAP</td>
                    <td className="p-2">Pseudomonas, Enterobacter, Klebsiella, Serratia</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Tazocin</span> 100mg/kg q8h + <span className="font-medium">Vancomycin</span> 15mg/kg q6h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Tazocin {(w * 100).toFixed(0)} mg q8h</p>}
                      <p className="text-[10px] mt-1">Add aminoglycoside in severe cases</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">Aspiration Pneumonia</td>
                    <td className="p-2">Anaerobes</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Augmentin</span> 30mg/kg q8h (Alt: Clindamycin)
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 30).toFixed(0)} mg q8h</p>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-[10px]">
              <p className="font-medium text-amber-700 dark:text-amber-300">Complicated Pneumonia Definition:</p>
              <p className="text-muted-foreground">Necrotizing pneumonia, Parapneumonic effusion, Empyema, Lung abscess, Pneumatocele</p>
            </div>
          </div>
        </Section>

        {/* UTI */}
        <Section id="abx-uti" title="Urinary Tract Infections" expandedSections={expandedSections} toggleSection={toggleSection}>
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Indication</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Cystitis</td>
                    <td className="p-2">E. coli, Klebsiella, Proteus</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Nitrofurantoin</span> 5-7mg/kg/day PO q6h or <span className="font-medium">Cefuroxime</span> 15mg/kg BID
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Nitrofurantoin {(w * 1.5).toFixed(0)}-{(w * 1.75).toFixed(0)} mg q6h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Pyelonephritis</td>
                    <td className="p-2">E. coli, Klebsiella, Proteus, Pseudomonas</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Ceftriaxone</span> 50mg/kg IV q12h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 50).toFixed(0)} mg q12h</p>}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">Recurrent UTI Prophylaxis</td>
                    <td className="p-2">Grade 3-4 reflux only</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">TMP/SMX</span> 2mg/kg/day q24h or <span className="font-medium">Nitrofurantoin</span> 2mg/kg q24h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 2).toFixed(0)} mg daily</p>}
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Indication</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Neonate</td>
                    <td className="p-2">S. aureus, GBS, GNR</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Cefotaxime + Cloxacillin</span>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">All Age Groups</td>
                    <td className="p-2">S. aureus, S. Pneumo</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg IV q8h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 10).toFixed(0)} mg q8h</p>}
                      <p className="text-[10px] mt-1">Add Ceftriaxone for non-immunized patients</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">Sickle Cell Anemia</td>
                    <td className="p-2">S. aureus, S. Pneumo, Salmonella</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Clindamycin</span> 10mg/kg q8h + <span className="font-medium">Ceftriaxone</span> 50mg/kg q12h
                      <p className="text-[10px] mt-1">Alt: Clindamycin + Ciprofloxacin 10mg/kg q12h</p>
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Indication</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Neonate (up to 4 wks)</td>
                    <td className="p-2">GBS, GNR, Listeria, Enterococcus</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">IV Ampicillin + IV Gentamicin</span>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">4 wks - 3 months</td>
                    <td className="p-2">Same as Neonates + Older</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Ampicillin</span> 50mg/kg q6h + <span className="font-medium">Cefotaxime</span> 50mg/kg q8h
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">&gt;3mo (Community)</td>
                    <td className="p-2">S. pneumo, Meningococcus, S. aureus, H. flu, E. coli</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Ceftriaxone</span> 50mg/kg q12h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 50).toFixed(0)} mg q12h</p>}
                      <p className="text-[10px] mt-1">Add Vancomycin if severely ill</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">&gt;3mo + Hospital &gt;48h</td>
                    <td className="p-2">Pseudomonas, Klebsiella, E. coli, MRSA</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Tazocin</span> 100mg/kg q8h +/- <span className="font-medium">Vancomycin</span> 15mg/kg q6h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Tazocin {(w * 100).toFixed(0)} mg q8h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">&gt;3mo + Septic Shock</td>
                    <td className="p-2">S. pneumo, Meningococcus, S. aureus</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Tazocin</span> 100mg/kg q8h + <span className="font-medium">Vancomycin</span> 15mg/kg q6h
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">&gt;3mo + Shock + Hospital &gt;48h</td>
                    <td className="p-2">MRSA, ESBL producers</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Meropenem</span> 40mg/kg q8h + <span className="font-medium">Vancomycin</span> 15mg/kg q6h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Meropenem {(w * 40).toFixed(0)} mg q8h</p>}
                      <p className="text-[10px] mt-1">Consider aminoglycoside in severely ill</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">Sickle Cell + Sepsis</td>
                    <td className="p-2">S. pneumo, H. flu, Salmonella</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Ceftriaxone</span> 50mg/kg q12h
                      <p className="text-[10px] mt-1">Severely ill: Add IV Vancomycin</p>
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
              {w > 0 && <p className="font-mono text-blue-600 mt-1">→ {(w * 0.15).toFixed(2)} mg q6h</p>}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Indication</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Neonate (up to 4 wks)</td>
                    <td className="p-2">GBS, GNR, L. monocytogenes</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Ampicillin IV + Cefotaxime IV</span>
                      <p className="text-[10px] mt-1">(check neonatal doses)</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">4 wks - 3 months</td>
                    <td className="p-2">Same as Neonates + Older</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Ampicillin</span> 100mg/kg q6h + <span className="font-medium">Cefotaxime</span> 50mg/kg q6h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Amp {(w * 100).toFixed(0)} mg + Cefo {(w * 50).toFixed(0)} mg q6h</p>}
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Older Children</td>
                    <td className="p-2">S. pneumo, N. meningitidis</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Ceftriaxone</span> 50mg/kg q12h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ {(w * 50).toFixed(0)} mg q12h</p>}
                      <p className="text-[10px] mt-1">Add Vancomycin in critical cases. Target level 15-20</p>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Meningo-Encephalitis</td>
                    <td className="p-2">S. pneumo, N. meningitidis, HSV</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Ceftriaxone</span> 50mg/kg q12h + <span className="font-medium">Acyclovir</span> 20mg/kg q8h
                      {w > 0 && <p className="font-mono text-green-600 mt-1">→ Ceftriaxone {(w * 50).toFixed(0)} mg + Acyclovir {(w * 20).toFixed(0)} mg</p>}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">VP Shunt Infection</td>
                    <td className="p-2">CoNS, GNR</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Ceftazidime</span> 50mg/kg q8h + <span className="font-medium">Vancomycin</span> 15mg/kg q6h
                      <p className="text-[10px] mt-1">Severely ill: Meropenem. Consult ID. Target Vanco 15-20</p>
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
              <p className="text-muted-foreground">This applies to oncology patients. Healthy children with transient neutropenia during viral illness need only symptomatic treatment.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Indication</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Pathogen</th>
                    <th className="text-left p-2 font-semibold whitespace-nowrap">Antimicrobial</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-foreground">Stable Patients</td>
                    <td className="p-2">GNR</td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600">Cefepime</span> or <span className="font-medium">Tazocin</span> + <span className="font-medium">Gentamicin</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-foreground">Unstable Patients</td>
                    <td className="p-2">GNR, GPC, fungal</td>
                    <td className="p-2">
                      <span className="font-medium text-red-600">Meropenem</span> + <span className="font-medium">Gentamicin</span>
                      <p className="text-[10px] mt-1">Add Vancomycin in severely ill patients</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Abbreviations */}
        <Section id="abx-abbrev" title="Abbreviations & References" expandedSections={expandedSections} toggleSection={toggleSection}>
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
                <p className="font-medium">NEC</p>
                <p className="text-muted-foreground text-[10px]">Necrotizing Enterocolitis</p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg mt-3">
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">References</p>
              <ul className="text-muted-foreground text-[10px] space-y-1">
                <li>• UpToDate</li>
                <li>• Red Book</li>
                <li>• Nelson's Antimicrobial Guidelines, King Fahad Medical City</li>
              </ul>
            </div>
          </div>
        </Section>

      </CardContent>
    </Card>
  );
};

export default EmpiricalAntibioticsApproach;
