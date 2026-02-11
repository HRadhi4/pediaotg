import React, { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// NICU Drugs Reference Page - Drug dosing from Neofax 2024
const NICUDrugsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weight, setWeight] = useState("");
  const [pma, setPma] = useState("");
  const [pna, setPna] = useState("");
  const [expandedDrug, setExpandedDrug] = useState(null);
  
  const w = parseFloat(weight) || 0;
  const pmaWeeks = parseFloat(pma) || 0;
  const pnaDays = parseFloat(pna) || 0;

  // Drug data from Neofax 2024
  const drugs = [
    {
      id: "ampicillin",
      name: "Ampicillin",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 25, unit: "mg/kg/dose" },
        gbs: { label: "GBS Bacteremia", value: 50, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 100, unit: "mg/kg/dose" }
      },
      quickViewDoses: ["gbs", "meningitis"],
      indication: "GBS, Listeria, susceptible gram-positive infections, meningitis",
      route: "IV slow push or IM",
      getDose: (w) => w > 0 ? ({
        standard: `${(25 * w).toFixed(1)} mg`,
        gbs: `${(50 * w).toFixed(1)} mg`,
        meningitis: `${(100 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-28 days", interval: "12h" },
        { pma: "≤29", pna: ">28 days", interval: "8h" },
        { pma: "30-36", pna: "0-14 days", interval: "12h" },
        { pma: "30-36", pna: ">14 days", interval: "8h" },
        { pma: "37-44", pna: "0-7 days", interval: "12h" },
        { pma: "37-44", pna: ">7 days", interval: "8h" },
        { pma: "≥45", pna: "ALL", interval: "6h" }
      ],
      notes: "Standard: 25 mg/kg. GBS bacteremia: 50 mg/kg. Meningitis: 75-100 mg/kg/dose."
    },
    {
      id: "gentamicin",
      name: "Gentamicin",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 4, unit: "mg/kg/dose" },
        synergy: { label: "GBS Synergy", value: 2.5, unit: "mg/kg/dose" }
      },
      indication: "Gram-negative infections, GBS synergy with ampicillin",
      route: "IV over 30 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(4 * w).toFixed(1)} mg`,
        synergy: `${(2.5 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-7 days", interval: "48h" },
        { pma: "≤29", pna: "8-28 days", interval: "36h" },
        { pma: "≤29", pna: "≥29 days", interval: "24h" },
        { pma: "30-34", pna: "0-7 days", interval: "36h" },
        { pma: "30-34", pna: "≥8 days", interval: "24h" },
        { pma: "≥35", pna: "ALL", interval: "24h" }
      ],
      notes: "Standard: 4-5 mg/kg. GBS synergy: 2.5 mg/kg. Target peak: 5-12, trough <1."
    },
    {
      id: "vancomycin",
      name: "Vancomycin",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 15, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 15, unit: "mg/kg/dose" }
      },
      indication: "Serious MRSA infections, Anthrax, CNS infections",
      route: "IV infusion over 60 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(15 * w).toFixed(1)} mg`,
        meningitis: `${(15 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-14 days", interval: "18h" },
        { pma: "≤29", pna: ">14 days", interval: "12h" },
        { pma: "30-36", pna: "0-14 days", interval: "12h" },
        { pma: "30-36", pna: ">14 days", interval: "8h" },
        { pma: "37-44", pna: "0-7 days", interval: "12h" },
        { pma: "37-44", pna: ">7 days", interval: "8h" },
        { pma: "≥45", pna: "ALL", interval: "6h" }
      ],
      notes: "Target trough: 10-20 mcg/mL (standard), 15-20 mcg/mL (CNS). Monitor renal function."
    },
    {
      id: "amikacin",
      name: "Amikacin",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 15, unit: "mg/kg/dose" }
      },
      indication: "Gram-negative infections, aminoglycoside-resistant organisms",
      route: "IV over 30 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(15 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-7 days", interval: "48h" },
        { pma: "≤29", pna: "8-28 days", interval: "36h" },
        { pma: "≤29", pna: "≥29 days", interval: "24h" },
        { pma: "30-34", pna: "0-7 days", interval: "36h" },
        { pma: "30-34", pna: "≥8 days", interval: "24h" },
        { pma: "≥35", pna: "ALL", interval: "24h" }
      ],
      notes: "Target: peak >24 mg/L, trough <5 mg/L. Prolong interval by 10h if on ibuprofen."
    },
    {
      id: "cefotaxime",
      name: "Cefotaxime",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 50, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 50, unit: "mg/kg/dose q6-8h" }
      },
      indication: "Gram-negative sepsis, meningitis, gonococcal infections",
      route: "IV over 30 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(50 * w).toFixed(1)} mg`,
        meningitis: `${(50 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-28 days", interval: "12h" },
        { pma: "≤29", pna: ">28 days", interval: "8h" },
        { pma: "30-36", pna: "0-14 days", interval: "12h" },
        { pma: "30-36", pna: ">14 days", interval: "8h" },
        { pma: "37-44", pna: "0-7 days", interval: "12h" },
        { pma: "37-44", pna: ">7 days", interval: "8h" },
        { pma: "≥45", pna: "ALL", interval: "6h" }
      ],
      notes: "Meningitis: q6h dosing (150-200 mg/kg/day). Good CSF penetration."
    },
    {
      id: "caffeine",
      name: "Caffeine Citrate",
      category: "Stimulant",
      doses: {
        loading: { label: "Loading", value: 20, unit: "mg/kg" },
        maintenance: { label: "Maintenance", value: 5, unit: "mg/kg/day" }
      },
      indication: "Apnea of prematurity (28-33 weeks)",
      route: "IV over 30 min or PO",
      getDose: (w) => w > 0 ? ({
        loading: `${(20 * w).toFixed(1)} mg`,
        maintenance: `${(5 * w).toFixed(1)}-${(10 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "Loading", interval: "Once" },
        { pma: "ALL", pna: "Maintenance", interval: "24h" }
      ],
      notes: "Start maintenance 24h after loading dose. Monitor for tachycardia, irritability."
    },
    {
      id: "ceftazidime",
      name: "Ceftazidime",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 30, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 50, unit: "mg/kg/dose" }
      },
      indication: "Gram-negative sepsis/meningitis, Pseudomonas",
      route: "IV infusion or IM",
      getDose: (w) => w > 0 ? ({
        standard: `${(30 * w).toFixed(1)} mg`,
        meningitis: `${(50 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "0-28 days", interval: "12h" },
        { pma: "≤29", pna: ">28 days", interval: "8h" },
        { pma: "30-36", pna: "0-14 days", interval: "12h" },
        { pma: "30-36", pna: ">14 days", interval: "8h" },
        { pma: "37-44", pna: "0-7 days", interval: "12h" },
        { pma: "37-44", pna: ">7 days", interval: "8h" },
        { pma: "≥45", pna: "ALL", interval: "8h" }
      ],
      notes: "Meningitis: 100-150 mg/kg/day divided. May mix with 1% lidocaine for IM."
    },
    {
      id: "meropenem",
      name: "Meropenem",
      category: "Antibiotic",
      doses: {
        standard: { label: "Standard", value: 20, unit: "mg/kg/dose" },
        meningitis: { label: "Meningitis", value: 40, unit: "mg/kg/dose" }
      },
      indication: "Severe infections, meningitis, multidrug-resistant organisms",
      route: "IV infusion over 30 min",
      getDose: (w) => w > 0 ? ({
        standard: `${(20 * w).toFixed(1)} mg`,
        meningitis: `${(40 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "<32", pna: "<14 days", interval: "12h" },
        { pma: "<32", pna: "≥14 days", interval: "8h" },
        { pma: "≥32", pna: "<14 days", interval: "8h" },
        { pma: "≥32", pna: "≥14 days", interval: "8h" }
      ],
      notes: "Meningitis: 40 mg/kg/dose. Non-CNS: 20 mg/kg/dose. Broad spectrum carbapenem."
    },
    {
      id: "metronidazole",
      name: "Metronidazole",
      category: "Antibiotic",
      doses: {
        loading: { label: "Loading", value: 15, unit: "mg/kg" },
        maintenance: { label: "Maintenance", value: 7.5, unit: "mg/kg/dose" }
      },
      indication: "Anaerobic infections, NEC, surgical prophylaxis",
      route: "IV over 60 min or PO",
      getDose: (w) => w > 0 ? ({
        loading: `${(15 * w).toFixed(1)} mg`,
        maintenance: `${(7.5 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "≤29", pna: "ALL", interval: "48h" },
        { pma: "30-36", pna: "ALL", interval: "24h" },
        { pma: "37-44", pna: "ALL", interval: "12h" },
        { pma: "≥45", pna: "ALL", interval: "8h" }
      ],
      notes: "Surgical prophylaxis: 15 mg/kg single dose 60 min before incision."
    },
    {
      id: "acyclovir",
      name: "Acyclovir",
      category: "Antiviral",
      doses: {
        skin: { label: "Skin/Eye/Mouth", value: 20, unit: "mg/kg/dose" },
        cns: { label: "CNS/Disseminated", value: 20, unit: "mg/kg/dose q8h" }
      },
      indication: "HSV infection - skin/eye/mouth, CNS, disseminated",
      route: "IV infusion over 60 min",
      getDose: (w) => w > 0 ? ({
        skin: `${(20 * w).toFixed(1)} mg`,
        cns: `${(20 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "SEM disease", interval: "8h x 14 days" },
        { pma: "ALL", pna: "CNS disease", interval: "8h x 21 days" },
        { pma: "ALL", pna: "Disseminated", interval: "8h x 21 days" }
      ],
      notes: "SEM: 14 days. CNS/Disseminated: 21 days. Follow with suppressive therapy."
    },
    {
      id: "fluconazole",
      name: "Fluconazole",
      category: "Antifungal",
      doses: {
        prophylaxis: { label: "Prophylaxis", value: 3, unit: "mg/kg/dose" },
        treatment: { label: "Treatment", value: 12, unit: "mg/kg/dose" }
      },
      indication: "Candida prophylaxis, candidiasis treatment",
      route: "IV over 30 min or PO",
      getDose: (w) => w > 0 ? ({
        prophylaxis: `${(3 * w).toFixed(1)} mg`,
        treatment: `${(12 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "Prophylaxis", interval: "72h" },
        { pma: "<30", pna: "Treatment", interval: "72h" },
        { pma: "≥30", pna: "Treatment", interval: "48h" }
      ],
      notes: "Prophylaxis: 3-6 mg/kg twice weekly. Treatment: 12 mg/kg loading then maintenance."
    },
    {
      id: "hydrochlorothiazide",
      name: "Hydrochlorothiazide",
      category: "Diuretic",
      doses: {
        standard: { label: "Standard", value: 2, unit: "mg/kg/dose" }
      },
      indication: "BPD, edema, hypertension, heart failure",
      route: "PO",
      getDose: (w) => w > 0 ? ({
        standard: `${(1 * w).toFixed(1)}-${(2 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "ALL", interval: "12h" }
      ],
      notes: "Give with food. Monitor K+, glucose, uric acid. Contraindicated in renal/hepatic impairment."
    },
    {
      id: "spironolactone",
      name: "Spironolactone",
      category: "Diuretic",
      doses: {
        standard: { label: "Standard", value: 2, unit: "mg/kg/dose" }
      },
      indication: "BPD, heart failure, pulmonary hypertension",
      route: "PO",
      getDose: (w) => w > 0 ? ({
        standard: `${(1 * w).toFixed(1)}-${(3 * w).toFixed(1)} mg`
      }) : null,
      intervalTable: [
        { pma: "ALL", pna: "ALL", interval: "24h" }
      ],
      notes: "Potassium-sparing. Often combined with thiazides. Monitor K+."
    }
  ];

  const filteredDrugs = drugs.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.indication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIntervalForPatient = (drug) => {
    if (!pmaWeeks && pmaWeeks !== 0) return null;
    
    for (const row of drug.intervalTable) {
      let pmaMatch = false;
      const pmaStr = row.pma;
      
      if (pmaStr === "ALL") {
        pmaMatch = true;
      } else if (pmaStr.startsWith("≤")) {
        const val = parseInt(pmaStr.replace("≤", ""));
        pmaMatch = pmaWeeks <= val;
      } else if (pmaStr.startsWith("<")) {
        const val = parseInt(pmaStr.replace("<", ""));
        pmaMatch = pmaWeeks < val;
      } else if (pmaStr.startsWith("≥")) {
        const val = parseInt(pmaStr.replace("≥", ""));
        pmaMatch = pmaWeeks >= val;
      } else if (pmaStr.startsWith(">")) {
        const val = parseInt(pmaStr.replace(">", ""));
        pmaMatch = pmaWeeks > val;
      } else if (pmaStr.includes("-")) {
        const parts = pmaStr.match(/(\d+)-(\d+)/);
        if (parts) {
          const minPma = parseInt(parts[1]);
          const maxPma = parseInt(parts[2]);
          pmaMatch = pmaWeeks >= minPma && pmaWeeks <= maxPma;
        }
      } else {
        const val = parseInt(pmaStr);
        pmaMatch = pmaWeeks === val;
      }
      
      if (!pmaMatch) continue;
      
      const pnaStr = row.pna;
      let pnaMatch = false;
      
      if (pnaStr === "ALL" || pnaStr === "Loading" || pnaStr === "Maintenance" || 
          pnaStr === "SEM disease" || pnaStr === "CNS disease" || pnaStr === "Disseminated" ||
          pnaStr === "Prophylaxis" || pnaStr === "Treatment") {
        pnaMatch = true;
      } else if (pnaStr.startsWith("≥")) {
        const val = parseInt(pnaStr.match(/\d+/)?.[0] || "0");
        pnaMatch = pnaDays >= val;
      } else if (pnaStr.startsWith(">")) {
        const val = parseInt(pnaStr.match(/\d+/)?.[0] || "0");
        pnaMatch = pnaDays > val;
      } else if (pnaStr.startsWith("≤")) {
        const val = parseInt(pnaStr.match(/\d+/)?.[0] || "0");
        pnaMatch = pnaDays <= val;
      } else if (pnaStr.startsWith("<")) {
        const val = parseInt(pnaStr.match(/\d+/)?.[0] || "0");
        pnaMatch = pnaDays < val;
      } else if (pnaStr.includes("-")) {
        const parts = pnaStr.match(/(\d+)-(\d+)/);
        if (parts) {
          const minPna = parseInt(parts[1]);
          const maxPna = parseInt(parts[2]);
          pnaMatch = pnaDays >= minPna && pnaDays <= maxPna;
        }
      }
      
      if (pmaMatch && pnaMatch) {
        return row.interval;
      }
    }
    
    return null;
  };

  return (
    <div className="space-y-4 pt-4 pb-4">
      {/* Search and Patient Info */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search drugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Patient Parameters */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">Weight (kg)</Label>
              <Input
                type="number"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="font-mono text-sm h-9"
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">PMA (weeks)</Label>
              <Input
                type="number"
                placeholder="wks"
                value={pma}
                onChange={(e) => setPma(e.target.value)}
                className="font-mono text-sm h-9"
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">PNA (days)</Label>
              <Input
                type="number"
                placeholder="days"
                value={pna}
                onChange={(e) => setPna(e.target.value)}
                className="font-mono text-sm h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drug List */}
      <div className="space-y-2">
        {filteredDrugs.map((drug) => {
          const calculatedDoses = drug.getDose(w);
          const interval = getIntervalForPatient(drug);
          const isExpanded = expandedDrug === drug.id;
          const doseKeys = drug.doses ? Object.keys(drug.doses) : [];
          const quickViewKeys = drug.quickViewDoses || doseKeys.slice(0, 2);
          
          return (
            <Card 
              key={drug.id} 
              className="nightingale-card cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              onClick={() => setExpandedDrug(isExpanded ? null : drug.id)}
            >
              <CardContent className="p-3">
                {/* Drug Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{drug.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                        {drug.category}
                      </span>
                    </div>
                    {drug.doses && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {quickViewKeys.map(key => drug.doses[key] && (
                          <span key={key} className="text-[9px] px-1 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            {drug.doses[key].label}: {drug.doses[key].value} {drug.doses[key].unit}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {calculatedDoses && w > 0 && (
                    <div className="text-right ml-2 flex-shrink-0">
                      <div className="space-y-1">
                        {quickViewKeys.map(key => calculatedDoses[key] && (
                          <p key={key} className="text-xs font-mono whitespace-nowrap">
                            <span className="text-muted-foreground">{drug.doses[key].label}:</span>{' '}
                            <span className="font-bold text-blue-600">{calculatedDoses[key]}</span>
                          </p>
                        ))}
                      </div>
                      {interval && (
                        <p className="mt-1">
                          <span className="font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-sm">
                            q{interval}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    {calculatedDoses && w > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Calculated Doses ({w}kg)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {doseKeys.map(key => (
                            <div key={key} className="p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                              <p className="text-xs text-muted-foreground">{drug.doses[key].label}</p>
                              <p className="font-mono font-bold text-blue-600 text-base">{calculatedDoses[key]}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Indication</p>
                      <p className="text-sm mt-1">{drug.indication}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Route</p>
                      <p className="text-sm mt-1">{drug.route}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Dosing Interval</p>
                      <div className="overflow-x-auto -mx-1">
                        <table className="w-full text-[10px] min-w-[250px]">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                              <th className="text-left py-1.5 px-2 font-medium">PMA (wks)</th>
                              <th className="text-left py-1.5 px-2 font-medium">PNA</th>
                              <th className="text-center py-1.5 px-2 font-medium">Interval</th>
                            </tr>
                          </thead>
                          <tbody>
                            {drug.intervalTable.map((row, idx) => (
                              <tr key={idx} className="border-t border-gray-100 dark:border-gray-800">
                                <td className="py-1.5 px-2">{row.pma}</td>
                                <td className="py-1.5 px-2">{row.pna}</td>
                                <td className="py-1.5 px-2 text-center font-mono font-medium">{row.interval}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-[10px] text-muted-foreground">
                      <p className="font-medium text-foreground mb-0.5">Notes:</p>
                      <p>{drug.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDrugs.length === 0 && (
        <Card className="nightingale-card">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground text-sm">No drugs found matching &quot;{searchTerm}&quot;</p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 text-xs text-muted-foreground">
          <p>• PMA = Postmenstrual Age (gestational age + postnatal age)</p>
          <p>• PNA = Postnatal Age (days since birth)</p>
          <p>• Always verify doses and adjust based on renal/hepatic function</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NICUDrugsPage;
