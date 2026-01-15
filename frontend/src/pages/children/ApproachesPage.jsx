/**
 * Approaches Page - Clinical Approach Algorithms
 * 
 * Contains 15 clinical approach tabs:
 * 1. Septic Shock - Cold/Warm shock algorithm
 * 2. Status Epilepticus - Seizure management
 * 3. Status Asthmaticus - Asthma emergency
 * 4. TBI - Traumatic brain injury
 * 5. DKA - Diabetic ketoacidosis
 * 6. Adrenal Crisis - Acute adrenal insufficiency
 * 7. Anaphylaxis - Allergic reaction
 * 8. Thrombocytopenia - Platelet disorders
 * 9. Hypocalcemia - Calcium disorders & rickets
 * 10. Decreased LOC - GCS, differentials
 * 11. Headache - Migraine, IIH, red flags
 * 12. Acute Weakness - Stroke, GBS, myasthenia
 * 13. Abnormal Gait - Ataxia, gait disorders
 * 14. Hyperkalemia - ECG changes, treatment
 * 15. Upper GI Bleed - UGIB management
 * 
 * Features: Search bar, collapsible sections, vital signs reference
 * 
 * REFACTORED: Components moved to /approaches/ directory
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import all approach components
import {
  SepsisApproach,
  SeizureApproach,
  AsthmaApproach,
  TbiApproach,
  DkaApproach,
  AdrenalApproach,
  AnaphylaxisApproach,
  ThrombocytopeniaApproach,
  HypocalcemiaApproach,
  DlocApproach,
  HeadacheApproach,
  WeaknessApproach,
  GaitApproach,
  HyperkalemiaApproach,
  UgibApproach,
} from "./approaches";

const ApproachesPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("sepsis");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const ageNum = parseFloat(age) || 0;

  // Define all approach tabs with search keywords
  const approachTabs = [
    { id: "sepsis", label: "Septic Shock", keywords: ["sepsis", "septic", "shock", "cold", "warm", "vasopressor", "fluid", "bolus"] },
    { id: "seizure", label: "Status Epilepticus", keywords: ["seizure", "epilepsy", "convulsion", "phenytoin", "diazepam", "midazolam", "levetiracetam"] },
    { id: "asthma", label: "Status Asthmaticus", keywords: ["asthma", "wheeze", "bronchospasm", "salbutamol", "ventolin", "magnesium", "respiratory"] },
    { id: "tbi", label: "TBI", keywords: ["trauma", "brain", "injury", "head", "concussion", "intracranial", "cushing"] },
    { id: "dka", label: "DKA", keywords: ["diabetic", "ketoacidosis", "diabetes", "insulin", "glucose", "acidosis"] },
    { id: "adrenal", label: "Adrenal Crisis", keywords: ["adrenal", "insufficiency", "cortisol", "hydrocortisone", "addison"] },
    { id: "anaphylaxis", label: "Anaphylaxis", keywords: ["anaphylaxis", "allergic", "allergy", "epinephrine", "adrenaline", "urticaria", "hives", "angioedema"] },
    { id: "thrombocytopenia", label: "Thrombocytopenia", keywords: ["platelet", "thrombocytopenia", "itp", "bleeding", "purpura", "petechiae", "low platelet"] },
    { id: "hypocalcemia", label: "Hypocalcemia", keywords: ["calcium", "hypocalcemia", "rickets", "vitamin d", "pth", "parathyroid", "phosphate", "calcitriol", "tetany", "chvostek", "trousseau"] },
    { id: "dloc", label: "Decreased LOC", keywords: ["consciousness", "dloc", "coma", "gcs", "lethargy", "stupor", "obtundation", "unresponsive", "altered mental"] },
    { id: "headache", label: "Headache", keywords: ["headache", "migraine", "tension", "iih", "papilledema", "intracranial hypertension", "photophobia"] },
    { id: "weakness", label: "Acute Weakness", keywords: ["weakness", "paralysis", "stroke", "gbs", "guillain", "transverse myelitis", "myasthenia"] },
    { id: "gait", label: "Abnormal Gait", keywords: ["gait", "ataxia", "limping", "walking", "coordination", "waddling", "hemiplegic", "neuropathic"] },
    { id: "hyperkalemia", label: "Hyperkalemia", keywords: ["potassium", "hyperkalemia", "ecg", "calcium gluconate", "insulin", "kayexalate", "dialysis", "arrhythmia"] },
    { id: "ugib", label: "Upper GI Bleed", keywords: ["gi bleed", "hematemesis", "melena", "ugib", "varices", "mallory weiss", "ppi", "octreotide", "gastrointestinal"] },
  ];

  // Filter tabs based on search query
  const filteredTabs = searchQuery.trim() === "" 
    ? approachTabs 
    : approachTabs.filter(tab => 
        tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tab.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-select first matching tab when search changes
  useEffect(() => {
    if (filteredTabs.length > 0 && !filteredTabs.find(t => t.id === activeTab)) {
      // Using a small timeout to avoid the cascading render warning
      const timer = setTimeout(() => setActiveTab(filteredTabs[0].id), 0);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, filteredTabs, activeTab]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Common props for all approach components
  const commonProps = {
    weight,
    age,
    expandedSections,
    toggleSection,
  };

  return (
    <div className="space-y-4 pt-4 pb-32">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search approaches (e.g., sepsis, seizure, platelet...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 nightingale-input"
          data-testid="approaches-search"
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

      {/* Patient Info Input */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
              <Input
                type="number"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="font-mono mt-1"
                data-testid="approaches-weight-input"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Age (years)</Label>
              <Input
                type="number"
                placeholder="years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="font-mono mt-1"
                data-testid="approaches-age-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation - Scrollable */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-max min-w-full h-auto p-1">
            {filteredTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs py-2 px-3 whitespace-nowrap" data-testid={`tab-${tab.id}`}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {filteredTabs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No approaches found for &quot;{searchQuery}&quot;</p>
            <button onClick={() => setSearchQuery("")} className="text-[#00d9c5] mt-2 hover:underline">Clear search</button>
          </div>
        )}

        {/* Septic Shock */}
        <TabsContent value="sepsis" className="space-y-3 mt-4" data-testid="content-sepsis">
          <SepsisApproach {...commonProps} />
        </TabsContent>

        {/* Status Epilepticus */}
        <TabsContent value="seizure" className="space-y-3 mt-4" data-testid="content-seizure">
          <SeizureApproach {...commonProps} />
        </TabsContent>

        {/* Status Asthmaticus */}
        <TabsContent value="asthma" className="space-y-3 mt-4" data-testid="content-asthma">
          <AsthmaApproach {...commonProps} />
        </TabsContent>

        {/* TBI */}
        <TabsContent value="tbi" className="space-y-3 mt-4" data-testid="content-tbi">
          <TbiApproach {...commonProps} />
        </TabsContent>

        {/* DKA */}
        <TabsContent value="dka" className="space-y-3 mt-4" data-testid="content-dka">
          <DkaApproach {...commonProps} />
        </TabsContent>

        {/* Adrenal Crisis */}
        <TabsContent value="adrenal" className="space-y-3 mt-4" data-testid="content-adrenal">
          <AdrenalApproach {...commonProps} />
        </TabsContent>

        {/* Anaphylaxis */}
        <TabsContent value="anaphylaxis" className="space-y-3 mt-4" data-testid="content-anaphylaxis">
          <AnaphylaxisApproach {...commonProps} />
        </TabsContent>

        {/* Thrombocytopenia */}
        <TabsContent value="thrombocytopenia" className="space-y-3 mt-4" data-testid="content-thrombocytopenia">
          <ThrombocytopeniaApproach {...commonProps} />
        </TabsContent>

        {/* Hypocalcemia */}
        <TabsContent value="hypocalcemia" className="space-y-3 mt-4" data-testid="content-hypocalcemia">
          <HypocalcemiaApproach {...commonProps} />
        </TabsContent>

        {/* Decreased LOC */}
        <TabsContent value="dloc" className="space-y-3 mt-4" data-testid="content-dloc">
          <DlocApproach {...commonProps} />
        </TabsContent>

        {/* Headache */}
        <TabsContent value="headache" className="space-y-3 mt-4" data-testid="content-headache">
          <HeadacheApproach {...commonProps} />
        </TabsContent>

        {/* Acute Weakness */}
        <TabsContent value="weakness" className="space-y-3 mt-4" data-testid="content-weakness">
          <WeaknessApproach {...commonProps} />
        </TabsContent>

        {/* Abnormal Gait */}
        <TabsContent value="gait" className="space-y-3 mt-4" data-testid="content-gait">
          <GaitApproach {...commonProps} />
        </TabsContent>

        {/* Hyperkalemia */}
        <TabsContent value="hyperkalemia" className="space-y-3 mt-4" data-testid="content-hyperkalemia">
          <HyperkalemiaApproach {...commonProps} />
        </TabsContent>

        {/* Upper GI Bleed */}
        <TabsContent value="ugib" className="space-y-3 mt-4" data-testid="content-ugib">
          <UgibApproach {...commonProps} />
        </TabsContent>
      </Tabs>

      {/* Pediatric Vital Signs Reference */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-0 py-4">
          <button
            onClick={() => toggleSection('vitals')}
            className="w-full h-10 flex items-center justify-between px-2"
            data-testid="vitals-toggle"
          >
            <CardTitle className="text-sm flex items-center h-full">Pediatric Vital Signs Reference</CardTitle>
            <span className={`transform transition-transform flex items-center h-full ${expandedSections['vitals'] ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </CardHeader>
        {expandedSections['vitals'] && (
          <CardContent className="pt-3 px-2 sm:px-4">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-[10px] sm:text-xs min-w-[320px]">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left py-2 px-2 font-semibold">Age</th>
                    <th className="text-center py-2 px-2 font-semibold">HR</th>
                    <th className="text-center py-2 px-2 font-semibold">RR</th>
                    <th className="text-center py-2 px-2 font-semibold">SBP</th>
                    <th className="text-center py-2 px-2 font-semibold">Wt(kg)</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground">Newborn</td>
                    <td className="py-2 px-2 text-center">120-160</td>
                    <td className="py-2 px-2 text-center">30-50</td>
                    <td className="py-2 px-2 text-center">50-70</td>
                    <td className="py-2 px-2 text-center">2-3</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground">Infant</td>
                    <td className="py-2 px-2 text-center">80-140</td>
                    <td className="py-2 px-2 text-center">20-30</td>
                    <td className="py-2 px-2 text-center">70-100</td>
                    <td className="py-2 px-2 text-center">4-10</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">Toddler</td>
                    <td className="py-2 px-2 text-center">80-130</td>
                    <td className="py-2 px-2 text-center">20-30</td>
                    <td className="py-2 px-2 text-center">80-110</td>
                    <td className="py-2 px-2 text-center">10-14</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">Preschool</td>
                    <td className="py-2 px-2 text-center">80-120</td>
                    <td className="py-2 px-2 text-center">20-30</td>
                    <td className="py-2 px-2 text-center">80-110</td>
                    <td className="py-2 px-2 text-center">14-18</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">School</td>
                    <td className="py-2 px-2 text-center">70-110</td>
                    <td className="py-2 px-2 text-center">20-30</td>
                    <td className="py-2 px-2 text-center">80-120</td>
                    <td className="py-2 px-2 text-center">20-42</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-medium text-foreground whitespace-nowrap">Adolescent</td>
                    <td className="py-2 px-2 text-center">55-105</td>
                    <td className="py-2 px-2 text-center">12-20</td>
                    <td className="py-2 px-2 text-center">110-120</td>
                    <td className="py-2 px-2 text-center">&gt;50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
              <p className="font-medium mb-1">Minimal Acceptable SBP:</p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">&lt;1mo: &gt;60 | 1mo-1y: &gt;70 | 1-10y: 70+(2×age) | &gt;10y: &gt;90</p>
              {ageNum > 0 && ageNum <= 10 && (
                <p className="font-mono text-blue-600 mt-2 text-sm">→ Min SBP for {ageNum}y: {70 + (2 * ageNum)} mmHg</p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ApproachesPage;
