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

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [activeTab, setActiveTab] = useState("gait");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [zoomLevel, setZoomLevel] = useState(100);
  const contentRef = useRef(null);
  const initialDistance = useRef(null);
  const initialZoom = useRef(100);
  const ageNum = parseFloat(age) || 0;

  // Define all approach tabs with search keywords - sorted alphabetically by label
  const approachTabs = [
    { id: "gait", label: "Abnormal Gait", keywords: ["gait", "ataxia", "limping", "walking", "coordination", "waddling", "hemiplegic", "neuropathic"] },
    { id: "weakness", label: "Acute Weakness", keywords: ["weakness", "paralysis", "stroke", "gbs", "guillain", "transverse myelitis", "myasthenia"] },
    { id: "adrenal", label: "Adrenal Crisis", keywords: ["adrenal", "insufficiency", "cortisol", "hydrocortisone", "addison"] },
    { id: "anaphylaxis", label: "Anaphylaxis", keywords: ["anaphylaxis", "allergic", "allergy", "epinephrine", "adrenaline", "urticaria", "hives", "angioedema"] },
    { id: "dloc", label: "Decreased LOC", keywords: ["consciousness", "dloc", "coma", "gcs", "lethargy", "stupor", "obtundation", "unresponsive", "altered mental"] },
    { id: "dka", label: "DKA", keywords: ["diabetic", "ketoacidosis", "diabetes", "insulin", "glucose", "acidosis"] },
    { id: "headache", label: "Headache", keywords: ["headache", "migraine", "tension", "iih", "papilledema", "intracranial hypertension", "photophobia"] },
    { id: "hyperkalemia", label: "Hyperkalemia", keywords: ["potassium", "hyperkalemia", "ecg", "calcium gluconate", "insulin", "kayexalate", "dialysis", "arrhythmia"] },
    { id: "hypocalcemia", label: "Hypocalcemia", keywords: ["calcium", "hypocalcemia", "rickets", "vitamin d", "pth", "parathyroid", "phosphate", "calcitriol", "tetany", "chvostek", "trousseau"] },
    { id: "sepsis", label: "Septic Shock", keywords: ["sepsis", "septic", "shock", "cold", "warm", "vasopressor", "fluid", "bolus"] },
    { id: "asthma", label: "Status Asthmaticus", keywords: ["asthma", "wheeze", "bronchospasm", "salbutamol", "ventolin", "magnesium", "respiratory"] },
    { id: "seizure", label: "Status Epilepticus", keywords: ["seizure", "epilepsy", "convulsion", "phenytoin", "diazepam", "midazolam", "levetiracetam"] },
    { id: "tbi", label: "TBI", keywords: ["trauma", "brain", "injury", "head", "concussion", "intracranial", "cushing"] },
    { id: "thrombocytopenia", label: "Thrombocytopenia", keywords: ["platelet", "thrombocytopenia", "itp", "bleeding", "purpura", "petechiae", "low platelet"] },
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

  // Pinch-to-zoom handlers
  const getDistance = (touches) => {
    const [touch1, touch2] = touches;
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      initialDistance.current = getDistance(e.touches);
      initialZoom.current = zoomLevel;
    }
  }, [zoomLevel]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && initialDistance.current) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / initialDistance.current;
      const newZoom = Math.min(200, Math.max(50, initialZoom.current * scale));
      setZoomLevel(Math.round(newZoom));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    initialDistance.current = null;
  }, []);

  // Common props for all approach components
  const commonProps = {
    weight,
    age,
    expandedSections,
    toggleSection,
  };

  return (
    <div className="space-y-4 pt-4 pb-4">
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

      {/* Approach Selector - Dropdown (moved above patient info like NICU) */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Select Approach</Label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full" data-testid="approach-selector">
            <SelectValue placeholder="Select an approach..." />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start" sideOffset={4}>
            {filteredTabs.map(tab => (
              <SelectItem 
                key={tab.id} 
                value={tab.id}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Patient Info Input */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Wt (kg)</Label>
              <Input
                type="number"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                className="font-mono mt-1 text-sm"
                data-testid="approaches-weight-input"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Age (yrs)</Label>
              <Input
                type="number"
                placeholder="yrs"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                className="font-mono mt-1 text-sm"
                data-testid="approaches-age-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>
        
      {filteredTabs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No approaches found for &quot;{searchQuery}&quot;</p>
          <button onClick={() => setSearchQuery("")} className="text-[#00d9c5] mt-2 hover:underline">Clear search</button>
        </div>
      )}

      {/* Approach Content with Pinch-to-Zoom */}
      <div 
        ref={contentRef}
        className="space-y-3 mt-4 origin-top-left transition-transform duration-100 touch-none"
        style={{ 
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          width: zoomLevel !== 100 ? `${10000 / zoomLevel}%` : '100%'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        data-testid="zoomable-content"
      >
        {/* Zoom indicator */}
        {zoomLevel !== 100 && (
          <div className="fixed top-20 right-4 z-50 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {zoomLevel}%
          </div>
        )}
        {activeTab === "sepsis" && <SepsisApproach {...commonProps} />}
        {activeTab === "seizure" && <SeizureApproach {...commonProps} />}
        {activeTab === "asthma" && <AsthmaApproach {...commonProps} />}
        {activeTab === "tbi" && <TbiApproach {...commonProps} />}
        {activeTab === "dka" && <DkaApproach {...commonProps} />}
        {activeTab === "adrenal" && <AdrenalApproach {...commonProps} />}
        {activeTab === "anaphylaxis" && <AnaphylaxisApproach {...commonProps} />}
        {activeTab === "thrombocytopenia" && <ThrombocytopeniaApproach {...commonProps} />}
        {activeTab === "hypocalcemia" && <HypocalcemiaApproach {...commonProps} />}
        {activeTab === "dloc" && <DlocApproach {...commonProps} />}
        {activeTab === "headache" && <HeadacheApproach {...commonProps} />}
        {activeTab === "weakness" && <WeaknessApproach {...commonProps} />}
        {activeTab === "gait" && <GaitApproach {...commonProps} />}
        {activeTab === "hyperkalemia" && <HyperkalemiaApproach {...commonProps} />}
        {activeTab === "ugib" && <UgibApproach {...commonProps} />}
      </div>

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
