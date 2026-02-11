/**
 * NICU Approaches Page - Neonatal Clinical Guidelines
 * Based on WHO Neonatal Clinical Guidelines 2018-2021
 * 
 * Contains clinical approach algorithms for NICU including:
 * - Neonatal Resuscitation
 * - Respiratory Distress Syndrome (RDS)
 * - Apnoea
 * - Meconium Aspiration Syndrome
 * - Persistent Pulmonary Hypertension (PPHN)
 * - Neonatal Sepsis
 * - Hypoglycemia
 * - Hyperbilirubinemia (Jaundice)
 * - Necrotizing Enterocolitis (NEC)
 * - Hypoxic Ischemic Encephalopathy (HIE)
 * - Patent Ductus Arteriosus (PDA)
 * - Seizures
 * - And more...
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import approach components
import ResuscitationApproach from "./approaches/ResuscitationApproach";
import RDSApproach from "./approaches/RDSApproach";
import SepsisApproach from "./approaches/SepsisApproach";
import HypoglycemiaApproach from "./approaches/HypoglycemiaApproach";
import JaundiceApproach from "./approaches/JaundiceApproach";
import NECApproach from "./approaches/NECApproach";
import HIEApproach from "./approaches/HIEApproach";
import ApneaApproach from "./approaches/ApneaApproach";
import PDAApproach from "./approaches/PDAApproach";
import SeizuresApproach from "./approaches/SeizuresApproach";
import PPHNApproach from "./approaches/PPHNApproach";
import MASApproach from "./approaches/MASApproach";
import TTNBApproach from "./approaches/TTNBApproach";
import BPDApproach from "./approaches/BPDApproach";
import AnemiaApproach from "./approaches/AnemiaApproach";
import PolycythemiaApproach from "./approaches/PolycythemiaApproach";
import CHDApproach from "./approaches/CHDApproach";
import GastroschisisApproach from "./approaches/GastroschisisApproach";
import OmphaloceleApproach from "./approaches/OmphaloceleApproach";
import CDHApproach from "./approaches/CDHApproach";
import MechanicalVentilationApproach from "./approaches/MechanicalVentilationApproach";

const NICUApproachesPage = () => {
  const [activeApproach, setActiveApproach] = useState("resuscitation");
  const [gestationalAge, setGestationalAge] = useState("");
  const [postnatalAge, setPostnatalAge] = useState("");
  const [weight, setWeight] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  // Define all NICU approaches with search keywords - sorted alphabetically
  const nicuApproaches = [
    { id: "anemia", label: "Anemia", keywords: ["anemia", "anaemia", "transfusion", "hemoglobin", "hematocrit", "prbc", "blood"] },
    { id: "apnea", label: "Apnea", keywords: ["apnea", "apnoea", "breathing", "caffeine", "bradycardia", "desaturation", "periodic breathing"] },
    { id: "bpd", label: "Bronchopulmonary Dysplasia", keywords: ["bpd", "bronchopulmonary", "dysplasia", "chronic lung", "oxygen dependency", "ventilator"] },
    { id: "cdh", label: "Congenital Diaphragmatic Hernia", keywords: ["cdh", "diaphragmatic", "hernia", "bochdalek", "pulmonary hypoplasia"] },
    { id: "chd", label: "Congenital Heart Disease", keywords: ["chd", "congenital", "heart", "cardiac", "cyanotic", "acyanotic", "murmur", "prostaglandin"] },
    { id: "gastroschisis", label: "Gastroschisis", keywords: ["gastroschisis", "abdominal wall", "eviscerated", "intestine", "surgical"] },
    { id: "hie", label: "HIE (Hypoxic Ischemic)", keywords: ["hie", "asphyxia", "hypoxic", "ischemic", "encephalopathy", "cooling", "hypothermia", "sarnat"] },
    { id: "hypoglycemia", label: "Hypoglycemia", keywords: ["hypoglycemia", "hypoglycaemia", "glucose", "sugar", "dextrose", "gir", "low blood sugar"] },
    { id: "jaundice", label: "Jaundice (Hyperbilirubinemia)", keywords: ["jaundice", "bilirubin", "hyperbilirubinemia", "phototherapy", "exchange", "kernicterus", "yellow"] },
    { id: "mas", label: "Meconium Aspiration (MAS)", keywords: ["meconium", "mas", "aspiration", "msaf", "respiratory distress"] },
    { id: "mechanical-ventilation", label: "Mechanical Ventilation", keywords: ["mechanical", "ventilation", "hfo", "hfov", "oscillatory", "cmv", "conventional", "cpap", "ventilator", "intubation", "amplitude", "map", "peep"] },
    { id: "nec", label: "Necrotizing Enterocolitis", keywords: ["nec", "necrotizing", "enterocolitis", "abdominal", "distension", "bell staging", "feeding intolerance"] },
    { id: "omphalocele", label: "Omphalocele", keywords: ["omphalocele", "exomphalos", "abdominal wall", "umbilical", "beckwith", "surgical"] },
    { id: "pda", label: "Patent Ductus Arteriosus", keywords: ["pda", "patent", "ductus", "arteriosus", "murmur", "ibuprofen", "indomethacin", "heart"] },
    { id: "polycythemia", label: "Polycythemia", keywords: ["polycythemia", "polycythaemia", "high hematocrit", "exchange", "partial exchange"] },
    { id: "pphn", label: "PPHN", keywords: ["pphn", "persistent", "pulmonary", "hypertension", "nitric oxide", "ino", "cyanosis"] },
    { id: "rds", label: "Respiratory Distress Syndrome", keywords: ["rds", "respiratory", "distress", "surfactant", "preterm", "cpap", "ventilation"] },
    { id: "resuscitation", label: "Resuscitation (NRP)", keywords: ["resuscitation", "nrp", "delivery", "birth", "apgar", "ppv", "compressions", "epinephrine"] },
    { id: "seizures", label: "Seizures", keywords: ["seizure", "convulsion", "phenobarbital", "phenytoin", "levetiracetam", "eeg", "jittery"] },
    { id: "sepsis", label: "Sepsis", keywords: ["sepsis", "infection", "antibiotics", "meningitis", "eos", "los", "early onset", "late onset"] },
    { id: "ttnb", label: "TTN (Transient Tachypnea)", keywords: ["ttn", "ttnb", "transient", "tachypnea", "wet lung", "cesarean"] },
  ];

  // Filter approaches based on search query
  const filteredApproaches = searchQuery.trim() === "" 
    ? nicuApproaches 
    : nicuApproaches.filter(approach => 
        approach.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        approach.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-select first matching approach when search changes
  useEffect(() => {
    if (filteredApproaches.length > 0 && !filteredApproaches.find(a => a.id === activeApproach)) {
      const timer = setTimeout(() => setActiveApproach(filteredApproaches[0].id), 0);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, filteredApproaches, activeApproach]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Common props for all approach components
  const commonProps = {
    weight,
    gestationalAge,
    postnatalAge,
    expandedSections,
    toggleSection,
  };

  return (
    <div className="space-y-4 pt-4 pb-4" data-testid="nicu-approaches-page">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search approaches (e.g., sepsis, jaundice, RDS...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 nightingale-input"
          data-testid="nicu-approaches-search"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {/* Approach Selector - Dropdown (moved above patient info) */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Select Approach</Label>
        <Select value={activeApproach} onValueChange={setActiveApproach}>
          <SelectTrigger className="w-full" data-testid="nicu-approach-selector">
            <SelectValue placeholder="Select an approach..." />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start" sideOffset={4}>
            {filteredApproaches.map(approach => (
              <SelectItem 
                key={approach.id} 
                value={approach.id}
                data-testid={`nicu-tab-${approach.id}`}
              >
                {approach.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Patient Info Input - NICU specific fields */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">GA (wks)</Label>
              <Input
                type="number"
                placeholder="wks"
                value={gestationalAge}
                onChange={(e) => setGestationalAge(e.target.value)}
                min="22"
                max="44"
                className="font-mono mt-1 text-sm"
                data-testid="nicu-gestational-age-input"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">PNA (days)</Label>
              <Input
                type="number"
                placeholder="days"
                value={postnatalAge}
                onChange={(e) => setPostnatalAge(e.target.value)}
                min="0"
                className="font-mono mt-1 text-sm"
                data-testid="nicu-postnatal-age-input"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Wt (kg)</Label>
              <Input
                type="number"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                step="0.01"
                className="font-mono mt-1 text-sm"
                data-testid="nicu-weight-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>
        
      {filteredApproaches.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No approaches found for &quot;{searchQuery}&quot;</p>
          <button onClick={() => setSearchQuery("")} className="text-[#00d9c5] mt-2 hover:underline">Clear search</button>
        </div>
      )}

      {/* Approach Content */}
      <div className="space-y-3 mt-4">
        {activeApproach === "resuscitation" && <ResuscitationApproach {...commonProps} />}
        {activeApproach === "rds" && <RDSApproach {...commonProps} />}
        {activeApproach === "sepsis" && <SepsisApproach {...commonProps} />}
        {activeApproach === "hypoglycemia" && <HypoglycemiaApproach {...commonProps} />}
        {activeApproach === "jaundice" && <JaundiceApproach {...commonProps} />}
        {activeApproach === "nec" && <NECApproach {...commonProps} />}
        {activeApproach === "hie" && <HIEApproach {...commonProps} />}
        {activeApproach === "apnea" && <ApneaApproach {...commonProps} />}
        {activeApproach === "pda" && <PDAApproach {...commonProps} />}
        {activeApproach === "seizures" && <SeizuresApproach {...commonProps} />}
        {activeApproach === "pphn" && <PPHNApproach {...commonProps} />}
        {activeApproach === "mas" && <MASApproach {...commonProps} />}
        {activeApproach === "ttnb" && <TTNBApproach {...commonProps} />}
        {activeApproach === "bpd" && <BPDApproach {...commonProps} />}
        {activeApproach === "anemia" && <AnemiaApproach {...commonProps} />}
        {activeApproach === "polycythemia" && <PolycythemiaApproach {...commonProps} />}
        {activeApproach === "chd" && <CHDApproach {...commonProps} />}
        {activeApproach === "cdh" && <CDHApproach {...commonProps} />}
        {activeApproach === "gastroschisis" && <GastroschisisApproach {...commonProps} />}
        {activeApproach === "omphalocele" && <OmphaloceleApproach {...commonProps} />}
      </div>

      {/* Reference Footer */}
      <Card className="border-slate-200 dark:border-slate-700 mt-6">
        <CardContent className="py-3">
          <p className="text-[10px] text-muted-foreground text-center">
            Reference: WHO/Belize Neonatal Clinical Practice Guidelines 2018-2021
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NICUApproachesPage;
