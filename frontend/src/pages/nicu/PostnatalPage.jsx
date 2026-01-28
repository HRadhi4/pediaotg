/**
 * Postnatal Page - Postnatal Care Guidelines
 * Based on WHO/AAP Guidelines for Newborn Care
 * 
 * Contains clinical guidelines for postnatal care including:
 * - Routine management of the healthy newborn infant
 * - Assessment of the newborn infant
 * - Hemoglobinopathy screening and counseling
 * - Infant with mother asymptomatic bacteriuria
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import approach components
import RoutineManagementApproach from "./postnatal/RoutineManagementApproach";
import NewbornAssessmentApproach from "./postnatal/NewbornAssessmentApproach";
import HemoglobinopathyApproach from "./postnatal/HemoglobinopathyApproach";
import AsymptomaticBacteriuriaApproach from "./postnatal/AsymptomaticBacteriuriaApproach";
import NeonatalExaminationApproach from "./postnatal/NeonatalExaminationApproach";

const PostnatalPage = () => {
  const [activeApproach, setActiveApproach] = useState("routine");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  // Define all Postnatal approaches with search keywords - sorted alphabetically
  const postnatalApproaches = [
    { id: "assessment", label: "Assessment of Newborn", keywords: ["assessment", "examination", "physical exam", "newborn exam", "check", "evaluation", "apgar"] },
    { id: "hemoglobinopathy", label: "Hemoglobinopathy Screening", keywords: ["hemoglobinopathy", "sickle cell", "thalassemia", "screening", "newborn screen", "blood", "anemia", "carrier"] },
    { id: "bacteriuria", label: "Infant of Mother with ASB", keywords: ["bacteriuria", "asb", "asymptomatic", "uti", "urinary", "maternal", "infection", "urine"] },
    { id: "routine", label: "Routine Newborn Management", keywords: ["routine", "healthy", "normal", "management", "care", "vitamin k", "feeding", "discharge", "follow-up", "eye prophylaxis"] },
  ];

  // Filter approaches based on search query
  const filteredApproaches = searchQuery.trim() === "" 
    ? postnatalApproaches 
    : postnatalApproaches.filter(approach => 
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
    expandedSections,
    toggleSection,
  };

  return (
    <div className="space-y-4 pt-4 pb-4" data-testid="postnatal-page">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search topics (e.g., vitamin k, feeding, sickle cell...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 nightingale-input"
          data-testid="postnatal-search"
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

      {/* Approach Selector - Dropdown */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Select Topic</Label>
        <Select value={activeApproach} onValueChange={setActiveApproach}>
          <SelectTrigger className="w-full" data-testid="postnatal-topic-selector">
            <SelectValue placeholder="Select a topic..." />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start" sideOffset={4}>
            {filteredApproaches.map(approach => (
              <SelectItem 
                key={approach.id} 
                value={approach.id}
                data-testid={`postnatal-tab-${approach.id}`}
              >
                {approach.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
        
      {filteredApproaches.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No topics found for &quot;{searchQuery}&quot;</p>
          <button onClick={() => setSearchQuery("")} className="text-[#00d9c5] mt-2 hover:underline">Clear search</button>
        </div>
      )}

      {/* Approach Content */}
      <div className="space-y-3 mt-4">
        {activeApproach === "routine" && <RoutineManagementApproach {...commonProps} />}
        {activeApproach === "assessment" && <NewbornAssessmentApproach {...commonProps} />}
        {activeApproach === "hemoglobinopathy" && <HemoglobinopathyApproach {...commonProps} />}
        {activeApproach === "bacteriuria" && <AsymptomaticBacteriuriaApproach {...commonProps} />}
      </div>

      {/* Reference Footer */}
      <Card className="border-slate-200 dark:border-slate-700 mt-6">
        <CardContent className="py-3">
          <p className="text-[10px] text-muted-foreground text-center">
            Reference: UpToDate / AAP / WHO Postnatal Care Guidelines
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostnatalPage;
