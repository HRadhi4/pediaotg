/**
 * =============================================================================
 * COMPREHENSIVE CHILDREN'S FORMULARY PAGE
 * =============================================================================
 * 
 * PURPOSE: Complete pediatric drug formulary with interactive calculators
 * 
 * KEY FEATURES:
 * - 90+ pediatric drugs with comprehensive dosing information
 * - Weight-based dose calculations with interactive calculators
 * - GFR calculator (Schwartz equations)
 * - Renal/hepatic dose adjustments
 * - Drug categories and search functionality
 * - Expandable drug cards with full prescribing information
 * 
 * DATA SOURCE: childrenFormulary.js - Based on Harriet Lane Handbook
 * =============================================================================
 */

import { useState, useEffect, useMemo } from "react";
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  Search, 
  Pill, 
  Info,
  Calculator,
  AlertCircle,
  Filter
} from "lucide-react";
import { ArrowLeftIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { childrenFormulary, drugCategories, getDrugById } from "@/data/childrenFormularyData";

const FormularyPage = ({ onBack }) => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [ageCategory, setAgeCategory] = useState("child");
  const [schwartzType, setSchwartzType] = useState("revised");
  const [expandedDrug, setExpandedDrug] = useState(null);
  const [showGFRCalc, setShowGFRCalc] = useState(false);
  const [showCalculatorFor, setShowCalculatorFor] = useState(null);

  // Parsed numeric values
  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const scr = parseFloat(creatinine) || 0;

  // ==========================================================================
  // GFR CALCULATIONS
  // ==========================================================================
  const getKValue = () => {
    switch(ageCategory) {
      case "preterm": return 0.33;
      case "term": return 0.45;
      case "child": return 0.55;
      case "adolescentM": return 0.70;
      case "adolescentF": return 0.55;
      default: return 0.55;
    }
  };

  const calculateGFR = () => {
    if (h > 0 && scr > 0) {
      if (schwartzType === "revised") {
        return (36.5 * h / scr).toFixed(1);
      } else {
        const k = getKValue();
        const kAdjusted = k * 88.4;
        return (kAdjusted * h / scr).toFixed(1);
      }
    }
    return null;
  };

  const gfr = calculateGFR();

  const getGFRCategory = () => {
    if (!gfr) return null;
    const gfrNum = parseFloat(gfr);
    if (gfrNum >= 50) return "normal";
    if (gfrNum >= 30) return "mild";
    if (gfrNum >= 10) return "moderate";
    return "severe";
  };

  const gfrCategory = getGFRCategory();

  // ==========================================================================
  // FILTERED DRUGS
  // ==========================================================================
  const filteredDrugs = useMemo(() => {
    return childrenFormulary.filter(drug => {
      const matchesSearch = 
        drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (drug.indication && drug.indication.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === "all" || drug.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // ==========================================================================
  // DOSE CALCULATOR
  // ==========================================================================
  const calculateDose = (doseObj) => {
    if (!w || !doseObj) return null;
    
    // Check if it's a fixed dose (not weight-based)
    if (doseObj.isFixed) {
      return null;
    }
    
    // Check if it's a rate (e.g., mcg/kg/min)
    if (doseObj.isRate) {
      return null;
    }

    const doseValue = parseFloat(doseObj.value);
    if (isNaN(doseValue)) return null;
    
    let calculatedDose = doseValue * w;
    const maxDose = doseObj.maxDose;

    // Apply max dose cap
    if (maxDose && calculatedDose > maxDose) {
      calculatedDose = maxDose;
    }

    return {
      dose: calculatedDose.toFixed(1),
      capped: maxDose && (doseValue * w) > maxDose,
      maxDose: maxDose
    };
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================
  const renderDosingTable = (dosingTable) => {
    if (!dosingTable) return null;
    
    return (
      <div className="mt-3 bg-slate-800/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-cyan-400 mb-2">{dosingTable.title}</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {dosingTable.columns.map((col, idx) => (
                  <th key={idx} className="px-2 py-1 text-left text-slate-400 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dosingTable.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-800">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-2 py-1.5 text-slate-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRenalAdjustment = (renalAdjust, gfrCat) => {
    if (!renalAdjust) {
      return <span className="text-slate-400">No adjustment needed</span>;
    }

    if (typeof renalAdjust === 'string') {
      return <span className="text-amber-400">{renalAdjust}</span>;
    }

    // Object with GFR-based adjustments
    const adjustments = [];
    if (renalAdjust.gfr50) adjustments.push({ label: "GFR 30-50", value: renalAdjust.gfr50, level: "mild" });
    if (renalAdjust.gfr30) adjustments.push({ label: "GFR 10-30", value: renalAdjust.gfr30, level: "moderate" });
    if (renalAdjust.gfr10) adjustments.push({ label: "GFR <10", value: renalAdjust.gfr10, level: "severe" });
    if (renalAdjust.hd) adjustments.push({ label: "HD", value: renalAdjust.hd, level: "hd" });

    return (
      <div className="space-y-1">
        {adjustments.map((adj, idx) => (
          <div 
            key={idx} 
            className={`flex justify-between items-center px-2 py-1 rounded text-sm ${
              gfrCat === adj.level ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-slate-800/50'
            }`}
          >
            <span className="text-slate-400">{adj.label}:</span>
            <span className={gfrCat === adj.level ? 'text-amber-400 font-medium' : 'text-slate-300'}>
              {adj.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderInteractions = (interactions) => {
    if (!interactions || interactions.length === 0) return null;
    
    return (
      <div className="mt-3">
        <h4 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          Drug Interactions
        </h4>
        <div className="space-y-1">
          {interactions.map((interaction, idx) => (
            <div key={idx} className="flex justify-between items-start bg-slate-800/50 rounded px-2 py-1.5 text-sm">
              <span className="text-amber-400 font-medium">{interaction.drug}:</span>
              <span className="text-slate-300 ml-2 text-right">{interaction.effect}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-slate-400 hover:text-white"
            data-testid="back-button"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-cyan-400" />
              Drug Formulary
            </h1>
            <p className="text-xs text-slate-400">{childrenFormulary.length} medications</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGFRCalc(!showGFRCalc)}
            className={`${showGFRCalc ? 'bg-cyan-500/20 border-cyan-500' : 'border-slate-700'}`}
            data-testid="gfr-toggle"
          >
            <Scale className="w-4 h-4 mr-1" />
            GFR
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="px-4 pb-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search drugs, categories, indications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              data-testid="drug-search"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Button
              size="sm"
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={`whitespace-nowrap text-xs ${
                selectedCategory === "all" 
                  ? 'bg-cyan-600 hover:bg-cyan-700' 
                  : 'border-slate-700 text-slate-400'
              }`}
            >
              All ({childrenFormulary.length})
            </Button>
            {drugCategories.slice(0, 8).map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap text-xs ${
                  selectedCategory === cat 
                    ? 'bg-cyan-600 hover:bg-cyan-700' 
                    : 'border-slate-700 text-slate-400'
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Patient Parameters Panel */}
        {showGFRCalc && (
          <div className="px-4 pb-3 bg-slate-800/50 border-t border-slate-700">
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div>
                <Label className="text-xs text-slate-400">Weight (kg)</Label>
                <Input
                  type="text"
                  inputMode="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="kg"
                  className="bg-slate-800 border-slate-700 text-white"
                  data-testid="weight-input"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Height (cm)</Label>
                <Input
                  type="text"
                  inputMode="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="cm"
                  className="bg-slate-800 border-slate-700 text-white"
                  data-testid="height-input"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Creatinine (µmol/L)</Label>
                <Input
                  type="text"
                  inputMode="text"
                  value={creatinine}
                  onChange={(e) => setCreatinine(e.target.value)}
                  placeholder="µmol/L"
                  className="bg-slate-800 border-slate-700 text-white"
                  data-testid="creatinine-input"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Schwartz Equation</Label>
                <select
                  value={schwartzType}
                  onChange={(e) => setSchwartzType(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-700 text-white text-sm"
                >
                  <option value="revised">Revised (Bedside)</option>
                  <option value="original">Original</option>
                </select>
              </div>
            </div>
            
            {schwartzType === "original" && (
              <div className="mt-2">
                <Label className="text-xs text-slate-400">Age Category</Label>
                <select
                  value={ageCategory}
                  onChange={(e) => setAgeCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-700 text-white text-sm"
                >
                  <option value="preterm">Preterm infant (k=0.33)</option>
                  <option value="term">Term infant &lt;1yr (k=0.45)</option>
                  <option value="child">Child 1-13yr (k=0.55)</option>
                  <option value="adolescentM">Adolescent male (k=0.70)</option>
                  <option value="adolescentF">Adolescent female (k=0.55)</option>
                </select>
              </div>
            )}

            {/* Results Display */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              {w > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 text-center">
                  <div className="text-xs text-emerald-400">Weight</div>
                  <div className="text-lg font-bold text-emerald-300">{w} kg</div>
                </div>
              )}
              {gfr && (
                <div className={`rounded-lg p-2 text-center ${
                  gfrCategory === 'normal' ? 'bg-emerald-500/10 border border-emerald-500/30' :
                  gfrCategory === 'mild' ? 'bg-amber-500/10 border border-amber-500/30' :
                  gfrCategory === 'moderate' ? 'bg-orange-500/10 border border-orange-500/30' :
                  'bg-red-500/10 border border-red-500/30'
                }`}>
                  <div className="text-xs text-slate-400">eGFR</div>
                  <div className={`text-lg font-bold ${
                    gfrCategory === 'normal' ? 'text-emerald-300' :
                    gfrCategory === 'mild' ? 'text-amber-300' :
                    gfrCategory === 'moderate' ? 'text-orange-300' :
                    'text-red-300'
                  }`}>
                    {gfr} mL/min/1.73m²
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drug List */}
      <div className="px-4 py-4 space-y-3">
        {filteredDrugs.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No drugs found matching your search.</p>
          </div>
        ) : (
          filteredDrugs.map(drug => (
            <Card 
              key={drug.id} 
              className="bg-slate-800/50 border-slate-700 overflow-hidden"
              data-testid={`drug-card-${drug.id}`}
            >
              <CardHeader 
                className="py-3 px-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
                onClick={() => setExpandedDrug(expandedDrug === drug.id ? null : drug.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                      {drug.name}
                      {drug.renalAdjust && gfrCategory && gfrCategory !== 'normal' && (
                        <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/50 text-amber-400">
                          Renal Adjust
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-400">
                        {drug.category}
                      </Badge>
                      <span className="text-xs text-slate-500">{drug.route}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    {expandedDrug === drug.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {expandedDrug === drug.id && (
                <CardContent className="pt-0 px-4 pb-4 space-y-4">
                  {/* Indication */}
                  <div className="text-sm text-slate-400">
                    <span className="text-cyan-400 font-medium">Indication: </span>
                    {drug.indication}
                  </div>

                  {/* Dosing Section */}
                  <div>
                    <h4 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-1">
                      <Calculator className="w-4 h-4" />
                      Dosing
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(drug.doses).map(([key, doseObj]) => {
                        const calculated = calculateDose(doseObj);
                        return (
                          <div 
                            key={key} 
                            className="bg-slate-800 rounded-lg p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-sm font-medium text-slate-300">
                                  {doseObj.label}
                                </span>
                                <div className="text-sm text-slate-400 mt-0.5">
                                  {doseObj.value} {doseObj.unit}
                                </div>
                              </div>
                              {calculated && w > 0 && (
                                <div className="text-right">
                                  <div className={`text-lg font-bold ${calculated.capped ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {calculated.dose} mg
                                  </div>
                                  {calculated.capped && (
                                    <div className="text-xs text-amber-500 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      Max dose reached
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dosing Table */}
                  {drug.dosingTable && renderDosingTable(drug.dosingTable)}

                  {/* Formulations */}
                  {drug.formulations && drug.formulations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400 mb-2">Formulations</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {drug.formulations.map((form, idx) => (
                          <div key={idx} className="text-sm bg-slate-800/50 rounded px-2 py-1.5 flex justify-between">
                            <span className="text-slate-400">{form.type}:</span>
                            <span className="text-slate-300">{form.strengths}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Maximum Dose */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <div className="text-sm">
                      <span className="text-amber-400 font-medium">Maximum: </span>
                      <span className="text-slate-300">{drug.max}</span>
                    </div>
                  </div>

                  {/* Warnings */}
                  {drug.warnings && drug.warnings.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-red-400 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Warnings
                      </h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {drug.warnings.map((warning, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Contraindications */}
                  {drug.contraindications && drug.contraindications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-400 mb-1">Contraindications</h4>
                      <ul className="text-sm text-slate-300 space-y-0.5">
                        {drug.contraindications.map((contra, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-400">•</span>
                            {contra}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Side Effects */}
                  {drug.sideEffects && drug.sideEffects.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400 mb-1">Side Effects</h4>
                      <ul className="text-sm text-slate-300 space-y-0.5">
                        {drug.sideEffects.map((se, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-slate-500">•</span>
                            {se}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Drug Interactions */}
                  {renderInteractions(drug.interactions)}

                  {/* Renal Adjustment */}
                  <div>
                    <h4 className="text-sm font-medium text-cyan-400 mb-2">Renal Adjustment</h4>
                    {renderRenalAdjustment(drug.renalAdjust, gfrCategory)}
                  </div>

                  {/* Hepatic Adjustment */}
                  {drug.hepaticAdjust && (
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400 mb-1">Hepatic Adjustment</h4>
                      <p className="text-sm text-slate-300">{drug.hepaticAdjust}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {drug.notes && (
                    <div className="bg-slate-800/70 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-cyan-400 mb-1 flex items-center gap-1">
                        <Info className="w-4 h-4" />
                        Clinical Notes
                      </h4>
                      <p className="text-sm text-slate-300">{drug.notes}</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Footer Count */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 px-4 py-2">
        <div className="text-center text-sm text-slate-500">
          Showing {filteredDrugs.length} of {childrenFormulary.length} drugs
          {w > 0 && <span className="text-emerald-400 ml-2">• Weight: {w} kg</span>}
          {gfr && <span className="text-amber-400 ml-2">• eGFR: {gfr}</span>}
        </div>
      </div>
    </div>
  );
};

export default FormularyPage;
