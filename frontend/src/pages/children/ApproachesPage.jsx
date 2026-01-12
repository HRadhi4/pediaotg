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
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon, ApproachesIcon } from "@/components/HealthIcons";
import { AlertTriangle, ChevronDown } from "lucide-react";

const ApproachesPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("sepsis");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const w = parseFloat(weight) || 0;
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
      setActiveTab(filteredTabs[0].id);
    }
  }, [searchQuery, filteredTabs, activeTab]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Collapsible Section Component
  const Section = ({ id, title, children, defaultOpen = false }) => {
    const isOpen = expandedSections[id] ?? defaultOpen;
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium text-sm text-left">{title}</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {isOpen && <div className="p-4 space-y-3 text-sm">{children}</div>}
      </div>
    );
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
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs py-2 px-3 whitespace-nowrap">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {filteredTabs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No approaches found for "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")} className="text-[#00d9c5] mt-2 hover:underline">Clear search</button>
          </div>
        )}

        {/* SEPTIC SHOCK TAB */}
        <TabsContent value="sepsis" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Septic Shock in Children</CardTitle>
              <CardDescription className="text-xs">Time-based resuscitation protocol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Recognition */}
              <Section id="sepsis-recognition" title="Recognition (0-5 min)" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="font-semibold text-blue-700 dark:text-blue-300 text-xs mb-1">Cold Shock</p>
                    <p className="text-xs text-muted-foreground">Cold extremities, prolonged cap refill</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="font-semibold text-red-700 dark:text-red-300 text-xs mb-1">Warm Shock</p>
                    <p className="text-xs text-muted-foreground">Warm extremities, brisk cap refill</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>• Decreased LOC • Persistent tachycardia • Decreased urine output</p>
                  <p>• Hypotension (late sign)</p>
                </div>
              </Section>

              {/* Initial Steps */}
              <Section id="sepsis-initial" title="Initial Management (5-15 min)">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">1. Airway & Breathing</p>
                    <p className="text-muted-foreground">100% O₂ via non-rebreather mask</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">2. IV Access</p>
                    <p className="text-muted-foreground">2 peripheral IVs. IO if IV not achieved in 5 min</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">3. Fluid Bolus</p>
                    <p className="text-muted-foreground">20 mL/kg 0.9% NS. Push, up to 60 mL/kg</p>
                    {w > 0 && <p className="font-mono text-blue-600 mt-1">→ {(w * 20).toFixed(0)} mL bolus</p>}
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-medium text-red-700">4. Antibiotics</p>
                    <p className="text-muted-foreground">Give 1st dose within 1 hour. DO NOT delay for cultures</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">5. Correct</p>
                    <p className="text-muted-foreground">Hypoglycemia & Hypocalcemia</p>
                  </div>
                </div>
              </Section>

              {/* Vasopressors */}
              <Section id="sepsis-vasopressors" title="Vasopressors (15-60 min)">
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">If shock not reversed after fluid resuscitation:</p>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium">Cold Shock → Epinephrine</p>
                    <p className="text-muted-foreground">0.05-0.3 mcg/kg/min</p>
                    {w > 0 && <p className="font-mono text-blue-600">→ {(w * 0.1).toFixed(2)} mcg/min (starting)</p>}
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-medium">Warm Shock → Norepinephrine</p>
                    <p className="text-muted-foreground">0.05-0.3 mcg/kg/min (via central line)</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Alternative: Dopamine</p>
                    <p className="text-muted-foreground">Up to 10 mcg/kg/min (peripheral IV/IO acceptable)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 10).toFixed(0)} mcg/min (max)</p>}
                  </div>
                </div>
              </Section>

              {/* Goals */}
              <Section id="sepsis-goals" title="Therapeutic Endpoints">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Cap refill ≤2 seconds, warm extremities</li>
                  <li>• Normal BP for age</li>
                  <li>• Normal pulses (no central-peripheral difference)</li>
                  <li>• Urine output ≥1 mL/kg/hr</li>
                  <li>• Normal mental status</li>
                  <li>• ScvO₂ ≥70%</li>
                </ul>
              </Section>

              {/* Additional Considerations */}
              <Section id="sepsis-additional" title="Additional Considerations">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-medium">Hydrocortisone (if adrenal insufficiency risk)</p>
                    <p className="text-muted-foreground">2 mg/kg load, then 1 mg/kg q6h</p>
                    {w > 0 && <p className="font-mono text-amber-600">→ Load: {(w * 2).toFixed(0)} mg, then {w.toFixed(0)} mg q6h</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Intubation (if needed)</p>
                    <p className="text-muted-foreground">Ketamine 1-2 mg/kg ± Atropine 0.02 mg/kg</p>
                  </div>
                  <p className="text-muted-foreground">• Keep Hgb &gt;10 g/dL • Monitor lactate • Early source control</p>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STATUS EPILEPTICUS TAB */}
        <TabsContent value="seizure" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Status Epilepticus</CardTitle>
              <CardDescription className="text-xs">Start treatment after 5 minutes of seizure activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Stabilization */}
              <Section id="se-initial" title="Initial Stabilization (0-5 min)" defaultOpen={true}>
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">• Maintain A, B, C + Neurologic exam</p>
                  <p className="text-muted-foreground">• Give oxygen, connect monitors</p>
                  <p className="text-muted-foreground">• Establish IV access</p>
                  <p className="text-muted-foreground">• Check bedside glucose</p>
                  <p className="text-muted-foreground">• Correct hypoglycemia, hyponatremia, hypocalcemia</p>
                </div>
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-medium text-xs">Labs: Glucose, Na, iCa, Mg, CBC, LFTs</p>
                </div>
              </Section>

              {/* Phase 1: Benzodiazepines */}
              <Section id="se-phase1" title="Phase 1: Benzodiazepines (5-20 min)">
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold">If IV/IO available:</p>
                    <div className="mt-1 space-y-1 text-muted-foreground">
                      <p>• <span className="font-medium">Lorazepam:</span> 0.1 mg/kg (max 4 mg)</p>
                      {w > 0 && <p className="font-mono text-blue-600 pl-2">→ {Math.min(w * 0.1, 4).toFixed(1)} mg</p>}
                      <p>• OR <span className="font-medium">Midazolam IV:</span> 0.1-0.2 mg/kg (max 10 mg)</p>
                      {w > 0 && <p className="font-mono text-blue-600 pl-2">→ {(w * 0.15).toFixed(1)} mg</p>}
                      <p className="text-xs italic mt-1">Can repeat once</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">If NO IV/IO:</p>
                    <div className="mt-1 space-y-1 text-muted-foreground">
                      <p>• <span className="font-medium">Midazolam IM:</span> 0.2 mg/kg (one dose)</p>
                      {w > 0 && <p className="font-mono text-gray-600 pl-2">→ {(w * 0.2).toFixed(1)} mg IM</p>}
                      <p>• OR <span className="font-medium">Diazepam PR:</span> 0.2-0.5 mg/kg (max 20 mg)</p>
                      {w > 0 && <p className="font-mono text-gray-600 pl-2">→ {(w * 0.3).toFixed(1)} mg PR</p>}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Phase 2: Antiepileptics */}
              <Section id="se-phase2" title="Phase 2: Antiepileptics (20-40 min)">
                <p className="text-xs text-muted-foreground mb-2">Choose ONE of the following:</p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Fosphenytoin/Phenytoin</p>
                    <p className="text-muted-foreground">20 mg PE/kg over 5-10 min (fosphenytoin) or 30 min (phenytoin)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 20).toFixed(0)} mg</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Levetiracetam (Keppra)</p>
                    <p className="text-muted-foreground">20-60 mg/kg (max 2500 mg)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {Math.min(w * 40, 2500).toFixed(0)} mg</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Valproic Acid</p>
                    <p className="text-muted-foreground">40 mg/kg (max 3000 mg)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {Math.min(w * 40, 3000).toFixed(0)} mg</p>}
                  </div>
                </div>
              </Section>

              {/* Phase 3 */}
              <Section id="se-phase3" title="Phase 3 (40-60 min)">
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">Call PICU and Neurology</p>
                  <p className="text-muted-foreground">Use alternative from Phase 2, or:</p>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-medium">Phenobarbital</p>
                    <p className="text-muted-foreground">20 mg/kg single dose</p>
                    {w > 0 && <p className="font-mono text-purple-600">→ {(w * 20).toFixed(0)} mg</p>}
                  </div>
                </div>
              </Section>

              {/* Refractory */}
              <Section id="se-refractory" title="Refractory Status Epilepticus (>60 min)">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
                  <p className="font-semibold text-red-700">Request continuous EEG monitoring</p>
                  <p className="font-semibold text-red-700 mt-1">Be ready for intubation</p>
                  <div className="mt-2 space-y-1 text-muted-foreground">
                    <p className="font-medium">Midazolam Infusion:</p>
                    <p>• Bolus 0.2 mg/kg, then infusion 1 mcg/kg/min</p>
                    <p>• Increase by 2 mcg/kg/min q10-15 min PRN (max 24 mcg/kg/min)</p>
                    <p className="mt-2 font-medium">If seizure persists: Barbiturate coma</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STATUS ASTHMATICUS TAB */}
        <TabsContent value="asthma" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Status Asthmaticus</CardTitle>
              <CardDescription className="text-xs">Asthma failing initial nebulized treatment & steroids</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* High Risk Groups */}
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
                <p className="font-semibold text-amber-700 dark:text-amber-300">High Risk Groups</p>
                <ul className="mt-1 text-muted-foreground space-y-0.5">
                  <li>• Previous PICU admission (with or without intubation)</li>
                  <li>• On ≥3 classes of asthma medications</li>
                  <li>• Repeated ER/hospitalization</li>
                  <li>• Poor compliance</li>
                </ul>
              </div>

              {/* Initial Management */}
              <Section id="asthma-initial" title="Initial Management" defaultOpen={true}>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Oxygen</p>
                    <p className="text-muted-foreground">Maintain O₂ Sat &gt;90%. Keep NPO</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium">Nebulized Albuterol (Salbutamol)</p>
                    <p className="text-muted-foreground">0.15-0.3 mg/kg × 3 doses back-to-back (15-20 min each)</p>
                    {w > 0 && (
                      <p className="font-mono text-blue-600">→ {Math.max(2.5, Math.min(w * 0.2, 10)).toFixed(1)} mg/dose ({w < 20 ? "2.5 mg" : "5 mg"} simplified)</p>
                    )}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Ipratropium Bromide (Atrovent)</p>
                    <p className="text-muted-foreground">0.5 mg mixed with albuterol</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-medium">Methylprednisolone IV</p>
                    <p className="text-muted-foreground">2 mg/kg load, then 2 mg/kg/day ÷ q6h (max 60 mg/day)</p>
                    {w > 0 && <p className="font-mono text-green-600">→ Load: {(w * 2).toFixed(0)} mg, then {Math.min((w * 2 / 4), 15).toFixed(0)} mg q6h</p>}
                  </div>
                </div>
              </Section>

              {/* If Failing Initial Treatment */}
              <Section id="asthma-escalation" title="If Failing Initial Treatment">
                <div className="space-y-2 text-xs">
                  <p className="text-red-600 font-medium">Notify PICU</p>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium">Continuous Nebulized Albuterol</p>
                    <p className="text-muted-foreground">0.5 mg/kg/hr via infusion pump</p>
                    {w > 0 && <p className="font-mono text-blue-600">→ {(w * 0.5).toFixed(1)} mg/hr</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Ipratropium</p>
                    <p className="text-muted-foreground">0.5 mg q4-6h for 24 hours</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Increase Methylprednisolone</p>
                    <p className="text-muted-foreground">4 mg/kg/day ÷ q6h</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-medium">Magnesium Sulfate</p>
                    <p className="text-muted-foreground">25-50 mg/kg IV over 30 min (max 2 g)</p>
                    {w > 0 && <p className="font-mono text-amber-600">→ {Math.min(w * 40, 2000).toFixed(0)} mg</p>}
                    <p className="text-xs text-red-600 mt-1">Monitor for hypotension, apnea</p>
                  </div>
                </div>
              </Section>

              {/* IV Beta Agonist */}
              <Section id="asthma-iv" title="IV Beta Agonist Infusions">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Terbutaline</p>
                    <p className="text-muted-foreground">Load: 10 mcg/kg over 10 min</p>
                    <p className="text-muted-foreground">Infusion: 0.2 mcg/kg/min, ↑ by 0.1-0.2 q30min (max 10 mcg/kg/min)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ Load: {(w * 10).toFixed(0)} mcg, Start: {(w * 0.2).toFixed(1)} mcg/min</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">OR Salbutamol IV</p>
                    <p className="text-muted-foreground">Start 1 mcg/kg/min, ↑ by 1 q15min (max 10 mcg/kg/min)</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ Start: {w.toFixed(0)} mcg/min</p>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Monitor: HR, BP, Arrhythmias, Potassium</p>
                </div>
              </Section>

              {/* Intubation */}
              <Section id="asthma-intubation" title="Intubation Indications">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Severe hypoxemia</li>
                    <li>• Respiratory arrest</li>
                    <li>• Deteriorating consciousness</li>
                    <li>• Fatigue with rising CO₂</li>
                  </ul>
                  <div className="mt-2 border-t border-red-200 pt-2">
                    <p className="font-medium text-red-700">RSI Recommendations:</p>
                    <p className="text-muted-foreground">Ketamine as induction + Rocuronium</p>
                    <p className="text-muted-foreground text-xs">(Avoid morphine, atracurium)</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TBI TAB */}
        <TabsContent value="tbi" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Severe Traumatic Brain Injury</CardTitle>
              <CardDescription className="text-xs">GCS ≤8 Management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Stabilization */}
              <Section id="tbi-initial" title="Initial Stabilization" defaultOpen={true}>
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">• Maintain ABC + C-spine precautions</p>
                  <p className="text-muted-foreground">• Continuous cardiopulmonary monitoring</p>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-2">
                    <p className="font-medium">Airway (Jaw thrust, no head tilt)</p>
                    <p className="text-muted-foreground">RSI: Fentanyl + Rocuronium OR Etomidate + Rocuronium</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Oxygenation Targets</p>
                    <p className="text-muted-foreground">SpO₂ 92-98%, PaCO₂ 35-40 mmHg</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Circulation</p>
                    <p className="text-muted-foreground">20 mL/kg NS bolus if hypotensive, repeat ×3</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 20).toFixed(0)} mL bolus</p>}
                  </div>
                  <p className="text-muted-foreground mt-2">• Elevate HOB 30°, midline neutral position</p>
                </div>
              </Section>

              {/* Brain Protective Therapies */}
              <Section id="tbi-protective" title="Standard Brain Protective Therapies">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>□ Control ventilation (PaCO₂ 35-40)</li>
                  <li>□ Avoid hypotension</li>
                  <li>□ IVF: 0.9% NS at maintenance</li>
                  <li>□ Maintain Na &gt;140</li>
                  <li>□ Sedation: Fentanyl + Midazolam infusion</li>
                  <li>□ Maintain normothermia (&lt;37.5°C)</li>
                  <li>□ Seizure prophylaxis (Phenytoin)</li>
                  <li>□ Stress ulcer prophylaxis</li>
                  <li>□ Glucose 80-180 mg/dL</li>
                </ul>
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                  <p className="font-semibold text-red-700">DO NOT ALLOW:</p>
                  <p className="text-muted-foreground">Hypoxemia • Hypotension • Hyperthermia • Hyponatremia</p>
                </div>
              </Section>

              {/* High ICP Management */}
              <Section id="tbi-icp" title="High ICP Management">
                <div className="text-xs">
                  <p className="text-muted-foreground mb-2">If ICP &gt;20 mmHg for &gt;5 min or clinical signs:</p>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">1. Drain CSF from EVD (if present)</p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">2. Bolus sedation/analgesia/paralysis</p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">3. Temporary hyperventilation</p>
                      <p className="text-muted-foreground">PaCO₂ 30-35 mmHg</p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="font-medium">4. Hyperosmolar Therapy</p>
                      <p className="text-muted-foreground">3% NaCl: 5-10 mL/kg over 5-10 min q2-6h</p>
                      {w > 0 && <p className="font-mono text-blue-600">→ {(w * 5).toFixed(0)}-{(w * 10).toFixed(0)} mL</p>}
                      <p className="text-muted-foreground mt-1">OR Mannitol: 0.5-1 g/kg over 20 min</p>
                      {w > 0 && <p className="font-mono text-blue-600">→ {(w * 0.5).toFixed(1)}-{w.toFixed(0)} g</p>}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Clinical Signs of High ICP */}
              <Section id="tbi-signs" title="Clinical Signs of High ICP">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• ↓GCS &gt;2 from baseline</li>
                  <li>• New loss of pupil reactivity</li>
                  <li>• Pupil asymmetry</li>
                  <li>• New focal motor deficit</li>
                  <li>• Cushing's triad: HTN, Bradycardia, Abnormal breathing</li>
                </ul>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DKA TAB */}
        <TabsContent value="dka" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Diabetic Ketoacidosis (DKA)</CardTitle>
              <CardDescription className="text-xs">Saudi MOH Guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Recognition */}
              <Section id="dka-recognition" title="Recognition & Diagnosis" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-medium mb-1">History</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Polyuria, polydipsia</li>
                      <li>• Weight loss</li>
                      <li>• Abdominal pain, vomiting</li>
                      <li>• Lethargy</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Clinical Findings</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Kussmaul breathing</li>
                      <li>• Dehydration</li>
                      <li>• Fruity breath</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="font-medium text-xs">Confirm DKA:</p>
                  <p className="text-xs text-muted-foreground">• Ketonuria + Glucose &gt;200 mg/dL + pH &lt;7.30 and/or HCO₃ &lt;15</p>
                </div>
              </Section>

              {/* First Hour */}
              <Section id="dka-first-hour" title="1st Hour Management">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-medium text-red-700">If in Shock:</p>
                    <p className="text-muted-foreground">10 mL/kg 0.9% NS bolus over 5-10 min, repeat PRN</p>
                    {w > 0 && <p className="font-mono text-red-600">→ {(w * 10).toFixed(0)} mL bolus</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">If NOT in Shock:</p>
                    <p className="text-muted-foreground">&lt;20 kg: 7 mL/kg over 1 hour</p>
                    <p className="text-muted-foreground">&gt;20 kg: 5 mL/kg over 1 hour</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w < 20 ? w * 7 : w * 5).toFixed(0)} mL over 1 hr</p>}
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                    <p className="font-semibold text-red-700 text-xs">DO NOT:</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Give insulin bolus</li>
                      <li>• Give NaHCO₃ (unless life-threatening)</li>
                      <li>• Give unnecessary fluid boluses</li>
                      <li>• Use hypotonic fluids</li>
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Post 1st Hour - Fluids */}
              <Section id="dka-fluids" title="Fluid Management (Post 1st Hour)">
                <div className="text-xs">
                  <p className="font-medium mb-2">Total Fluid Intake (TFI) by weight:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1 pr-4">Weight</th>
                          <th className="text-left py-1">TFI (mL/kg/hr)</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr><td className="py-1 pr-4">≤15 kg</td><td>5</td></tr>
                        <tr><td className="py-1 pr-4">15-35 kg</td><td>4</td></tr>
                        <tr><td className="py-1 pr-4">35-50 kg</td><td>3</td></tr>
                        <tr><td className="py-1 pr-4">&gt;50 kg</td><td>2</td></tr>
                      </tbody>
                    </table>
                  </div>
                  {w > 0 && (
                    <p className="font-mono text-blue-600 mt-2">
                      → {(w * (w <= 15 ? 5 : w <= 35 ? 4 : w <= 50 ? 3 : 2)).toFixed(0)} mL/hr
                    </p>
                  )}
                </div>
              </Section>

              {/* Insulin */}
              <Section id="dka-insulin" title="Insulin">
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">Mix 50 units Regular in 50 mL NS (1 unit/mL)</p>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Standard dose: 0.1 U/kg/hr</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 0.1).toFixed(1)} units/hr ({(w * 0.1).toFixed(1)} mL/hr)</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Low dose: 0.05 U/kg/hr</p>
                    <p className="text-muted-foreground">For: newly diagnosed, ≤5 years, or recently received insulin</p>
                    {w > 0 && <p className="font-mono text-gray-600">→ {(w * 0.05).toFixed(2)} units/hr</p>}
                  </div>
                </div>
              </Section>

              {/* Potassium */}
              <Section id="dka-potassium" title="Potassium">
                <div className="text-xs text-muted-foreground">
                  <p>• Add KCl 40 mEq/L once voiding (unless K &gt;5.5)</p>
                  <p>• If K &lt;3.5: increase to 60 mEq/L</p>
                </div>
              </Section>

              {/* Dextrose */}
              <Section id="dka-dextrose" title="Dextrose">
                <div className="text-xs text-muted-foreground">
                  <p>• Add D5 if glucose &lt;250 mg/dL or rapid drop &gt;100 mg/dL/hr</p>
                  <p>• Add D10 if glucose &lt;180 mg/dL</p>
                </div>
              </Section>

              {/* Cerebral Edema */}
              <Section id="dka-cerebral" title="Cerebral Edema">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-xs">
                  <p className="font-semibold text-red-700 mb-1">Warning Signs:</p>
                  <p className="text-muted-foreground">Headache, irritability, ↓LOC, vomiting, bradycardia, HTN</p>
                  <div className="mt-2 border-t border-red-200 pt-2">
                    <p className="font-medium">Treatment:</p>
                    <p className="text-muted-foreground">• Elevate HOB, secure airway</p>
                    <p className="text-muted-foreground">• Mannitol 0.5-1 g/kg OR 3% NaCl 5-10 mL/kg</p>
                    {w > 0 && <p className="font-mono text-red-600">→ Mannitol: {(w * 0.5).toFixed(1)}-{w.toFixed(0)} g</p>}
                    <p className="text-muted-foreground">• Neurosurgery consult, Head CT</p>
                  </div>
                </div>
              </Section>

              {/* Resolution */}
              <Section id="dka-resolution" title="DKA Resolution">
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium">DKA resolves when:</p>
                  <p>pH &gt;7.30, HCO₃ &gt;15, normal anion gap</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">After resolution:</p>
                    <p>• Start oral fluids (controlled)</p>
                    <p>• Give SC insulin, stop IV 30 min after</p>
                    <p>• Start diabetic diet</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADRENAL CRISIS TAB */}
        <TabsContent value="adrenal" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Adrenal Crisis</CardTitle>
              <CardDescription className="text-xs">Recognition and emergency management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Causes */}
              <Section id="adrenal-causes" title="Causes" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Primary</p>
                    <p className="text-muted-foreground">Salt wasting (↓Na, ↑K), hyperpigmentation</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Secondary/Tertiary</p>
                    <p className="text-muted-foreground">Pituitary/hypothalamic, prolonged steroid use</p>
                  </div>
                </div>
              </Section>

              {/* When to Suspect */}
              <Section id="adrenal-suspect" title="When to Suspect">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Volume depletion, hypotension</li>
                  <li>• Hyponatremia, hyperkalemia</li>
                  <li>• Hyperpigmentation</li>
                  <li>• Abdominal pain, fever</li>
                  <li>• Precocious puberty</li>
                </ul>
              </Section>

              {/* Confirmation */}
              <Section id="adrenal-confirm" title="Confirmation (if stable)">
                <div className="text-xs text-muted-foreground">
                  <p>1. Check baseline cortisol</p>
                  <p>2. Give Cosyntropin (ACTH) 1 mcg IV</p>
                  <p>3. Repeat cortisol at 30 min</p>
                  <p className="mt-1 font-medium">Adrenal insufficiency: Cortisol &lt;9 mcg/dL</p>
                </div>
              </Section>

              {/* Management */}
              <Section id="adrenal-management" title="Emergency Management">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium">Fluid Resuscitation</p>
                    <p className="text-muted-foreground">D5 NS 20 mL/kg bolus, up to 60 mL/kg</p>
                    {w > 0 && <p className="font-mono text-blue-600">→ {(w * 20).toFixed(0)} mL bolus</p>}
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-medium">Hydrocortisone</p>
                    <p className="text-muted-foreground">50 mg/m² bolus, then 50 mg/m² ÷ q6h for 24h</p>
                    <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded">
                      <p className="font-medium text-xs">Approximate Doses:</p>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground mt-1">
                        <span>Infant: 10 mg</span>
                        <span>Toddler: 25 mg</span>
                        <span>Older child: 50 mg</span>
                        <span>Adolescent: 100 mg</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Treat Electrolyte Imbalances</p>
                    <p className="text-muted-foreground">Hyperkalemia, hyponatremia per protocols</p>
                  </div>
                </div>
              </Section>

              {/* Important Notes */}
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
                <p className="font-semibold text-amber-700 dark:text-amber-300">Important Notes</p>
                <ul className="mt-1 text-muted-foreground space-y-0.5">
                  <li>• Never delay treatment waiting for results</li>
                  <li>• Consult pediatric endocrinologist</li>
                  <li>• If not improving, consider other diagnoses</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANAPHYLAXIS VS ALLERGIC REACTION TAB */}
        <TabsContent value="anaphylaxis" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Anaphylaxis vs Allergic Reaction</CardTitle>
              <CardDescription className="text-xs">Decision flowchart for diagnosis and treatment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Presentation */}
              <Section id="anaph-presentation" title="Initial Presentation" defaultOpen={true}>
                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <p className="font-semibold text-orange-700 dark:text-orange-300 text-sm">Urticarial rash involves skin or mucosal tissue:</p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• Generalized hives, pruritus or flushing</li>
                    <li>• Swollen lips, tongue or uvula</li>
                    <li>• Or both</li>
                  </ul>
                </div>
              </Section>

              {/* Decision Point */}
              <Section id="anaph-decision" title="Key Decision Point" defaultOpen={true}>
                <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                  <p className="font-semibold text-teal-700 dark:text-teal-300 text-sm mb-2">At least one of the following involved:</p>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">●</span>
                      <span><strong>Airway compromise</strong> (stridor, hoarseness, difficulty breathing)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">●</span>
                      <span><strong>Reduced BP</strong> or associated symptoms of end-organ dysfunction (dizziness, syncope)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">●</span>
                      <span><strong>GI symptoms</strong> (Abdominal pain, Vomiting)</span>
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200">
                    <p className="font-bold text-red-700 dark:text-red-300 text-center">YES</p>
                    <p className="text-center text-sm font-semibold mt-1">Anaphylactic Reaction</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-200">
                    <p className="font-bold text-green-700 dark:text-green-300 text-center">NO</p>
                    <p className="text-center text-sm font-semibold mt-1">Allergic Reaction</p>
                  </div>
                </div>
              </Section>

              {/* Anaphylaxis Treatment */}
              <Section id="anaph-treatment" title="Anaphylaxis Treatment">
                <div className="space-y-3">
                  {/* Primary Treatment */}
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                    <p className="font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                      <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                      Epinephrine (First-line)
                    </p>
                    <div className="mt-2 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white dark:bg-gray-900 rounded">
                          <p className="text-muted-foreground">Dose</p>
                          <p className="font-mono font-semibold">0.01 mg/kg IM</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-900 rounded">
                          <p className="text-muted-foreground">Concentration</p>
                          <p className="font-mono font-semibold">1:1000 (1mg/ml)</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white dark:bg-gray-900 rounded">
                          <p className="text-muted-foreground">Prepubertal Max</p>
                          <p className="font-mono font-semibold text-blue-600">0.3 mg</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-900 rounded">
                          <p className="text-muted-foreground">Adolescent Max</p>
                          <p className="font-mono font-semibold text-blue-600">0.5 mg</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">Repeat Q5-15 min PRN</p>
                      {w > 0 && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200">
                          <p className="font-mono text-blue-600 font-semibold">
                            For {w}kg: {Math.min(w * 0.01, 0.5).toFixed(2)} mg IM
                          </p>
                        </div>
                      )}
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                        <p className="text-amber-700 dark:text-amber-300 font-medium">Note for CPR:</p>
                        <p className="text-muted-foreground">1:10,000 (0.1mg/ml) used IV in CPR</p>
                      </div>
                    </div>
                  </div>

                  {/* Adjunct Treatment */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
                    <p className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                      Adjunct Treatments
                    </p>
                    <div className="mt-2 space-y-2 text-xs">
                      {/* Hydrocortisone */}
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium">Glucocorticoid (Hydrocortisone)</p>
                        <p className="text-muted-foreground">2-5 mg/kg IV/IM (Max 100 mg)</p>
                        <p className="text-muted-foreground">Then 1-5 mg/kg/dose Q6h or 10-15 mg/m²/day divided</p>
                        {w > 0 && (
                          <p className="font-mono text-blue-600 mt-1">
                            For {w}kg: {Math.min(w * 2, 100).toFixed(0)}-{Math.min(w * 5, 100).toFixed(0)} mg IV/IM
                          </p>
                        )}
                      </div>
                      {/* Diphenhydramine */}
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium">Diphenhydramine</p>
                        <p className="text-muted-foreground">1-2 mg/kg/dose Q6h (Max 50mg/dose, 300mg/24hr)</p>
                        <p className="text-muted-foreground">Route: IV/IM/PO</p>
                        {w > 0 && (
                          <p className="font-mono text-blue-600 mt-1">
                            For {w}kg: {Math.min(w * 1, 50).toFixed(0)}-{Math.min(w * 2, 50).toFixed(0)} mg Q6h
                          </p>
                        )}
                        <p className="text-red-600 text-[10px] mt-1">CI: MAO inhibitors, BA, GI/Urinary obstruction, Neonate</p>
                      </div>
                      {/* Ventolin */}
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium">Ventolin (for bronchospasm)</p>
                        <p className="text-muted-foreground">Nebulized salbutamol for wheezing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Allergic Reaction Treatment */}
              <Section id="anaph-allergic" title="Allergic Reaction Treatment (No systemic signs)">
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-700 dark:text-green-300">Treatment:</p>
                  <p className="text-sm mt-1">Antihistamine alone</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Examples: Cetirizine, Diphenhydramine, Loratadine
                  </p>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* THROMBOCYTOPENIA TAB */}
        <TabsContent value="thrombocytopenia" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Approach to Thrombocytopenia</CardTitle>
              <CardDescription className="text-xs">Diagnostic flowchart based on patient status and platelet characteristics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Assessment */}
              <Section id="thrombo-assess" title="Initial Assessment" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-200">
                    <p className="font-bold text-green-700 dark:text-green-300 text-center">WELL</p>
                    <p className="text-xs text-center text-muted-foreground mt-1">Clinically stable</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200">
                    <p className="font-bold text-red-700 dark:text-red-300 text-center">ILL</p>
                    <p className="text-xs text-center text-muted-foreground mt-1">Clinically unwell</p>
                  </div>
                </div>
              </Section>

              {/* Well Patient */}
              <Section id="thrombo-well" title="WELL Patient Pathway">
                <div className="space-y-3">
                  {/* Large PLT */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Large Platelets + Normal Hb & WBC</p>
                    <p className="text-xs text-muted-foreground mb-2">→ Suggests Consumption</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-purple-600">Immune</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• ITP</li>
                          <li>• 2° to SLE, HIV</li>
                          <li>• Drug induced</li>
                        </ul>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-orange-600">Non-immune</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• Maternal ITP</li>
                          <li>• NAIT</li>
                          <li>• Type 2B/Platelet VWD</li>
                          <li>• Hereditary Thrombocytopenia</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Small PLT */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Small Platelets + Congenital anomalies / ↑MCV</p>
                    <p className="text-xs text-muted-foreground mb-2">→ Suggests Decreased Synthesis</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-teal-600">Congenital</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• TAR syndrome</li>
                          <li>• Wiskott-Aldrich (WAS)</li>
                          <li>• X-linked Amegakaryocytic</li>
                          <li>• Fanconi Anemia</li>
                        </ul>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-gray-600">Acquired</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• Medication</li>
                          <li>• Toxin</li>
                          <li>• Radiation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Ill Patient */}
              <Section id="thrombo-ill" title="ILL Patient Pathway">
                <div className="space-y-3">
                  {/* Large PLT - Consumption */}
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Large Platelets + ↓Fibrinogen + ↑Fibrin degradation products</p>
                    <p className="text-xs text-muted-foreground mb-2">→ Suggests Consumption (Microangiopathy)</p>
                    <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                      <ul className="text-muted-foreground space-y-1">
                        <li>• <strong>DIC</strong> (Disseminated Intravascular Coagulation)</li>
                        <li>• <strong>HUS</strong> (Hemolytic Uremic Syndrome)</li>
                        <li>• <strong>TTP</strong> (Thrombotic Thrombocytopenic Purpura)</li>
                        <li>• NEC (Necrotizing Enterocolitis)</li>
                        <li>• Respiratory distress</li>
                        <li>• Thrombosis / UAC</li>
                        <li>• Sepsis</li>
                        <li>• Viral infection</li>
                      </ul>
                    </div>
                  </div>

                  {/* Small PLT - Sequestration/Synthesis */}
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Small Platelets</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-purple-600">+ HSM → Sequestration</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• Hemangioma</li>
                          <li>• Hypersplenism</li>
                        </ul>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-gray-600">→ ↓Synthesis</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• Malignancy</li>
                          <li>• Storage disease</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Key Abbreviations */}
              <Section id="thrombo-abbrev" title="Key Abbreviations">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <p><strong>ITP:</strong> Immune Thrombocytopenic Purpura</p>
                    <p><strong>NAIT:</strong> Neonatal Alloimmune Thrombocytopenia</p>
                    <p><strong>TAR:</strong> Thrombocytopenia-Absent Radius</p>
                    <p><strong>WAS:</strong> Wiskott-Aldrich Syndrome</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>DIC:</strong> Disseminated Intravascular Coagulation</p>
                    <p><strong>HUS:</strong> Hemolytic Uremic Syndrome</p>
                    <p><strong>TTP:</strong> Thrombotic Thrombocytopenic Purpura</p>
                    <p><strong>HSM:</strong> Hepatosplenomegaly</p>
                  </div>
                </div>
              </Section>

              {/* Initial Workup */}
              <Section id="thrombo-workup" title="Initial Workup">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Laboratory Studies:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• CBC with peripheral smear (platelet size, morphology)</li>
                      <li>• Reticulocyte count</li>
                      <li>• PT/PTT, Fibrinogen, D-dimer</li>
                      <li>• LDH, Haptoglobin, Bilirubin (hemolysis screen)</li>
                      <li>• Blood type and Coombs test</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-medium text-blue-700">Consider:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Bone marrow aspiration if decreased synthesis suspected</li>
                      <li>• Genetic testing for congenital syndromes</li>
                      <li>• HIV, Hepatitis B/C if immune causes suspected</li>
                    </ul>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HYPOCALCEMIA & RICKETS TAB */}
        <TabsContent value="hypocalcemia" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Approach to Hypocalcemia & Rickets</CardTitle>
              <CardDescription className="text-xs">Diagnostic flowchart and biochemical findings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Assessment - Low Ca */}
              <Section id="hypoca-initial" title="Diagnostic Approach (Low Calcium)" defaultOpen={true}>
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 mb-3">
                  <p className="font-semibold text-red-700 dark:text-red-300 text-center">Low Ca</p>
                  <p className="text-xs text-center text-muted-foreground mt-1">Starting point for evaluation</p>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="font-medium">Check iPTH (Intact Parathyroid Hormone)</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="font-medium text-blue-700">PTH ↓ or Low</p>
                      <p className="text-muted-foreground mt-1">Check Magnesium</p>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                      <p className="font-medium text-amber-700">PTH ↑ or Normal</p>
                      <p className="text-muted-foreground mt-1">Check Phosphate & 25OHD</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Low PTH Pathway - Magnesium Branch */}
              <Section id="hypoca-mg-branch" title="Low PTH Pathway (Check Mg)">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <p className="font-semibold text-purple-700 dark:text-purple-300">Mg ↓ (Low)</p>
                      <p className="text-xs text-muted-foreground mt-1 font-semibold">→ Hypomagnesemia</p>
                      <p className="text-xs text-muted-foreground mt-1">Can cause functional hypoparathyroidism</p>
                    </div>
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                      <p className="font-semibold text-teal-700 dark:text-teal-300">Mg Normal</p>
                      <p className="text-xs text-muted-foreground mt-1 font-semibold">→ Hypoparathyroidism</p>
                      <p className="text-xs text-muted-foreground mt-1">Primary PTH deficiency</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* High PTH Pathway - Phosphate/Creatinine Branch */}
              <Section id="hypoca-phos-branch" title="High PTH Pathway (Check Phos & Creatinine)">
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <p className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Phosphate ↑ + Creatinine ↑</p>
                    <p className="text-xs text-muted-foreground font-semibold">→ Renal Failure</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <li>• Impaired phosphate excretion</li>
                      <li>• Impaired 1,25(OH)₂D synthesis</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-semibold mb-2">Phosphate ↑ + Creatinine Normal</p>
                    <p className="text-xs text-muted-foreground font-semibold">→ Pseudohypoparathyroidism</p>
                    <p className="text-xs text-muted-foreground mt-1">PTH resistance (PTH present but tissues don't respond)</p>
                  </div>
                </div>
              </Section>

              {/* Vitamin D Assessment */}
              <Section id="hypoca-vitd" title="Vitamin D Assessment (25OHD₃)">
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="font-semibold text-red-700 dark:text-red-300 mb-2">25OHD₃ ↓ (Low)</p>
                    <p className="text-xs text-muted-foreground mb-2">Causes of Vitamin D Deficiency:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium">Dietary deficiency</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium">Malabsorption</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium">Anticonvulsants</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium">Lack of sun exposure</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="font-semibold text-green-700 dark:text-green-300 mb-2">25OHD₃ Normal → Check 1,25(OH)₂D₃</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium text-blue-600">1,25(OH)₂D₃ ↓</p>
                        <p className="text-muted-foreground mt-1">Vit-D Dependency (Type 1)</p>
                        <p className="text-[10px] text-muted-foreground">1α-hydroxylase deficiency</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium text-purple-600">1,25(OH)₂D₃ ↑↑</p>
                        <p className="text-muted-foreground mt-1">Vit-D Resistance (Type 2)</p>
                        <p className="text-[10px] text-muted-foreground">Receptor resistance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Vitamin D Activation Pathway */}
              <Section id="hypoca-vitd-pathway" title="Vitamin D Activation Pathway">
                <div className="space-y-2">
                  {/* Sources */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-center">
                      <p className="font-medium text-green-700">Vit D2 & D3 from Diet</p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-center">
                      <p className="font-medium text-green-700">UVB → D3 in skin</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-blue-500">↓</span>
                  </div>
                  {/* Liver */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="font-semibold text-blue-700 dark:text-blue-300">Liver</p>
                    <p className="text-xs text-muted-foreground">Activates to Calcidiol (25-OH Vit D)</p>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-blue-500">↓</span>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-[10px] text-orange-600">
                      Deficiency → Vit D Dependent Rickets Type 1
                    </div>
                  </div>
                  {/* Kidney */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="font-semibold text-blue-700 dark:text-blue-300">Kidney (1α-Hydroxylase)</p>
                    <p className="text-xs text-muted-foreground">Activates to Calcitriol (1,25-dihydroxy Vit D)</p>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-blue-500">↓</span>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-[10px] text-orange-600">
                      Receptor resistance → Vit D Dependent Rickets Type 2
                    </div>
                  </div>
                  {/* Target */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="font-semibold text-blue-700 dark:text-blue-300">Action on Peripheral Tissues</p>
                    <p className="text-xs text-muted-foreground">Bone mineralization, Ca/Phos absorption</p>
                  </div>
                </div>
              </Section>

              {/* Suspected Rickets Flowchart */}
              <Section id="hypoca-rickets-dx" title="Diagnostic Approach in Suspected Rickets">
                <div className="space-y-3">
                  {/* Suspicion */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
                    <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm">Suspected Rickets:</p>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• <span className="text-red-600 font-medium">Elevated alkaline phosphatase activity</span></li>
                      <li>• <span className="text-red-600 font-medium">Clinical or radiographic findings</span></li>
                    </ul>
                  </div>
                  {/* Measure */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="font-medium text-blue-700">Measure serum</p>
                    <p className="text-sm font-semibold text-red-600 mt-1">PTH, Pi (Phosphate), and Ca</p>
                  </div>
                  {/* Classification */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <p className="font-semibold text-purple-700 dark:text-purple-300">Calcipenic (Hypocalcemic) Rickets*</p>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-center">
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p className="text-red-600 font-bold">PTH ↑</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Pi N or ↓</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Ca N or ↓</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                      <p className="font-semibold text-teal-700 dark:text-teal-300">Phosphopenic (Hypophosphatemic) Rickets¶</p>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-center">
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>PTH N or slightly ↑</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p className="text-red-600 font-bold">Pi ↓</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Ca Normal</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="font-semibold">Consider other causes:</p>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-center">
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>PTH Normal</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Pi Normal</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-900 rounded">
                          <p>Ca Normal</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">→ Early/transient disease, hypophosphatasiaΔ, or primary bone disorder</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Biochemical Findings Table */}
              <Section id="hypoca-biochem" title="Biochemical Findings in Rickets">
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[9px] min-w-[600px]">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-left py-2 px-1 font-semibold">Type</th>
                        <th className="text-center py-2 px-1 font-semibold">Ca</th>
                        <th className="text-center py-2 px-1 font-semibold">Phos</th>
                        <th className="text-center py-2 px-1 font-semibold">ALP</th>
                        <th className="text-center py-2 px-1 font-semibold">PTH</th>
                        <th className="text-center py-2 px-1 font-semibold">25OHD</th>
                        <th className="text-center py-2 px-1 font-semibold">1,25D</th>
                        <th className="text-center py-2 px-1 font-semibold">UCa</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {/* Calcipenic Section */}
                      <tr className="bg-purple-50/50 dark:bg-purple-950/20">
                        <td colSpan={8} className="py-1 px-1 font-semibold text-purple-700 dark:text-purple-300">Calcipenic Rickets</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Vit D-deficient</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                        <td className="py-1 px-1 text-center">↑/↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center text-red-600">↓</td>
                        <td className="py-1 px-1 text-center">↑/N/↓</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Type I (1α-hydroxylase def)*</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                        <td className="py-1 px-1 text-center">↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center text-red-600">↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Type II (Vit D resistance)¶</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓/N</td>
                        <td className="py-1 px-1 text-center">↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center text-red-600">↑↑</td>
                        <td className="py-1 px-1 text-center">↓</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">↑ Vit D catabolism</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                      </tr>
                      {/* Phosphopenic Section */}
                      <tr className="bg-teal-50/50 dark:bg-teal-950/20">
                        <td colSpan={8} className="py-1 px-1 font-semibold text-teal-700 dark:text-teal-300">Phosphopenic Rickets (Vit D Resistant)</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">X-linked hypophosphatemia</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center text-red-600">↓↓</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N/↑</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center">N/↓</td>
                        <td className="py-1 px-1 text-center">↓</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Hereditary + hypercalciuria</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center">↓/↓↓</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N/↓</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center text-red-600">↑</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 px-1">Nutritional Pi deprivation</td>
                        <td className="py-1 px-1 text-center">↑/N</td>
                        <td className="py-1 px-1 text-center">↓/↓↓</td>
                        <td className="py-1 px-1 text-center">↑/↑↑</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">N</td>
                        <td className="py-1 px-1 text-center">↑</td>
                        <td className="py-1 px-1 text-center">↑/N</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground space-y-1">
                  <p>ALP: Alkaline Phosphatase | UCa: Urine Calcium | N: Normal | ↑: Increased | ↓: Decreased</p>
                  <p>* 1α-hydroxylase def = Vit D-dependent rickets type I (pseudo-Vit D deficiency)</p>
                  <p>¶ Hereditary Vit D resistance = Vit D-dependent rickets type II</p>
                </div>
              </Section>

              {/* Key Differentiating Features */}
              <Section id="hypoca-key" title="Key Differentiating Features">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-xs">
                    <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Calcipenic Rickets</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• PTH usually elevated</li>
                      <li>• Calcium low or normal</li>
                      <li>• Vitamin D pathway issue</li>
                      <li>• May have tetany/seizures</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg text-xs">
                    <p className="font-semibold text-teal-700 dark:text-teal-300 mb-2">Phosphopenic Rickets</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• PTH normal or slightly ↑</li>
                      <li>• Phosphate markedly low</li>
                      <li>• FGF23-mediated disorders</li>
                      <li>• Often genetic cause</li>
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Key Abbreviations */}
              <Section id="hypoca-abbrev" title="Key Abbreviations">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <p><strong>PTH:</strong> Parathyroid Hormone</p>
                    <p><strong>25OHD:</strong> 25-hydroxyvitamin D</p>
                    <p><strong>1,25(OH)₂D:</strong> 1,25-dihydroxyvitamin D (Calcitriol)</p>
                    <p><strong>Ca:</strong> Calcium</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Pi/Phos:</strong> Phosphate</p>
                    <p><strong>ALP:</strong> Alkaline Phosphatase</p>
                    <p><strong>FGF23:</strong> Fibroblast Growth Factor 23</p>
                    <p><strong>TRP:</strong> Tubular Reabsorption of Phosphorus</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DECREASED LEVEL OF CONSCIOUSNESS TAB */}
        <TabsContent value="dloc" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Decreased Level of Consciousness</CardTitle>
              <CardDescription className="text-xs">Systematic approach using Pediatric GCS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Definition */}
              <Section id="dloc-def" title="Definition & Grades" defaultOpen={true}>
                <p className="text-xs text-muted-foreground mb-3">
                  Decreased level of consciousness (DLOC) is a state in which a child exhibits a diminished ability to respond to verbal, physical, or painful stimuli.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                    <p className="font-semibold text-green-700">Lethargy</p>
                    <p className="text-muted-foreground">Drowsy but arousable with light stimulation</p>
                  </div>
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                    <p className="font-semibold text-yellow-700">Obtundation</p>
                    <p className="text-muted-foreground">Slowed responses, needs loud voice/shaking</p>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs">
                    <p className="font-semibold text-orange-700">Stupor</p>
                    <p className="text-muted-foreground">Only responds to painful stimuli</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                    <p className="font-semibold text-red-700">Coma</p>
                    <p className="text-muted-foreground">No meaningful response at all</p>
                  </div>
                </div>
              </Section>

              {/* Pediatric GCS */}
              <Section id="dloc-gcs" title="Pediatric Glasgow Coma Scale">
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[10px] min-w-[400px]">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-left py-2 px-2 font-semibold">Response</th>
                        <th className="text-center py-2 px-2 font-semibold">Score</th>
                        <th className="text-left py-2 px-2 font-semibold">Verbal Child</th>
                        <th className="text-left py-2 px-2 font-semibold">Pre-verbal</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b"><td className="py-1 px-2 font-medium" rowSpan={4}>Eye</td><td className="py-1 px-2 text-center">4</td><td className="py-1 px-2">Spontaneous</td><td className="py-1 px-2">Spontaneous</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">3</td><td className="py-1 px-2">To voice</td><td className="py-1 px-2">To voice</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">2</td><td className="py-1 px-2">To pain</td><td className="py-1 px-2">To pain</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">1</td><td className="py-1 px-2">None</td><td className="py-1 px-2">None</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium" rowSpan={5}>Verbal</td><td className="py-1 px-2 text-center">5</td><td className="py-1 px-2">Oriented</td><td className="py-1 px-2">Coos, babbles</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">4</td><td className="py-1 px-2">Confused</td><td className="py-1 px-2">Irritable cry</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">3</td><td className="py-1 px-2">Inappropriate words</td><td className="py-1 px-2">Cries to pain</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">2</td><td className="py-1 px-2">Incomprehensible</td><td className="py-1 px-2">Moans to pain</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">1</td><td className="py-1 px-2">None</td><td className="py-1 px-2">None</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium" rowSpan={6}>Motor</td><td className="py-1 px-2 text-center">6</td><td className="py-1 px-2">Obeys commands</td><td className="py-1 px-2">Normal movements</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">5</td><td className="py-1 px-2">Localizes pain</td><td className="py-1 px-2">Withdraws to touch</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">4</td><td className="py-1 px-2">Withdraws to pain</td><td className="py-1 px-2">Withdraws to pain</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">3</td><td className="py-1 px-2">Flexion to pain</td><td className="py-1 px-2">Abnormal flexion</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 text-center">2</td><td className="py-1 px-2">Extension to pain</td><td className="py-1 px-2">Extension</td></tr>
                      <tr><td className="py-1 px-2 text-center">1</td><td className="py-1 px-2">None</td><td className="py-1 px-2">None</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                  <p className="font-medium text-blue-700">GCS Monitoring Frequency:</p>
                  <p className="text-muted-foreground">• GCS &lt;12 → Assess every 15 minutes</p>
                  <p className="text-muted-foreground">• GCS 12-14 → Assess every 1 hour</p>
                </div>
              </Section>

              {/* Initial Stabilization */}
              <Section id="dloc-stabilize" title="Initial Stabilization">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-semibold text-red-700">Airway</p>
                    <p className="text-muted-foreground">Intubate if: Deteriorating GCS, SpO₂ &lt;92% despite oxygen, CO₂ retention</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">Breathing</p>
                    <p className="text-muted-foreground">100% oxygen if SpO₂ &lt;94%</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">Circulation</p>
                    <p className="text-muted-foreground">Isotonic fluid bolus 20 mL/kg if in shock</p>
                    {w > 0 && <p className="font-mono text-purple-600 mt-1">→ {(w * 20).toFixed(0)} mL bolus</p>}
                  </div>
                </div>
              </Section>

              {/* Core Investigations */}
              <Section id="dloc-investigations" title="Core Investigations">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Capillary blood glucose</p>
                    <p>• Blood gas</p>
                    <p>• Urea & Electrolytes</p>
                    <p>• Serum glucose</p>
                    <p>• Liver function tests</p>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Full blood count</p>
                    <p>• Blood culture + CRP</p>
                    <p>• Ammonia & Lactate</p>
                    <p>• Urine routine + toxicology</p>
                  </div>
                </div>
              </Section>

              {/* Algorithm */}
              <Section id="dloc-algorithm" title="Diagnostic Algorithm">
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="font-semibold text-amber-700 text-sm mb-2">After History, Examination & Core Investigations:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium text-red-600">Possible Neurological OR Unclear Cause</p>
                        <p className="text-muted-foreground mt-1">→ CT Brain</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <p className="font-medium text-green-600">Clear Non-neurological Cause</p>
                        <p className="text-muted-foreground mt-1">→ Treat accordingly</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-semibold text-blue-700 text-sm mb-2">CT Brain Results:</p>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-red-600">Abnormal (Hydrocephalus, Edema, Hemorrhage, Mass)</p>
                        <p className="text-muted-foreground">→ Neurosurgery consult</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-900 rounded">
                        <p className="font-medium text-gray-600">Normal</p>
                        <p className="text-muted-foreground">→ Consider Lumbar Puncture → Neurology consult</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Neurological Differentials */}
              <Section id="dloc-neuro-ddx" title="Neurological Differentials">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Focal Seizures with Impaired Consciousness</p>
                    <p className="text-muted-foreground">Eyes open/staring, abnormal movements, postictal behavior</p>
                    <p className="text-blue-600 mt-1">→ Follow seizure guidelines, inform Neurology</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">ADEM (Acute Disseminated Encephalomyelitis)</p>
                    <p className="text-muted-foreground">Recent viral illness, rapid decline, multifocal neuro signs</p>
                    <p className="text-blue-600 mt-1">→ Methylprednisolone 30 mg/kg/day (max 1g/day)</p>
                    {w > 0 && <p className="font-mono text-blue-600">→ {Math.min(w * 30, 1000).toFixed(0)} mg/day</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">PRES Syndrome</p>
                    <p className="text-muted-foreground">Chronic illness, HTN, headache, seizures</p>
                    <p className="text-blue-600 mt-1">→ BP management, treat underlying cause</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Increased ICP</p>
                    <p className="text-muted-foreground">Headache, vomiting, papilledema</p>
                    <p className="text-blue-600 mt-1">→ PICU / Neurosurgery</p>
                  </div>
                </div>
              </Section>

              {/* Non-neurological Differentials */}
              <Section id="dloc-nonneuro-ddx" title="Non-Neurological Differentials">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Hypoglycemia</p>
                    <p className="text-muted-foreground">Check glucose immediately</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">CNS Infection</p>
                    <p className="text-muted-foreground">Fever, meningism → LP</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Shock</p>
                    <p className="text-muted-foreground">Hypoperfusion signs</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Electrolyte Imbalance</p>
                    <p className="text-muted-foreground">Na, K, Ca abnormalities</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Metabolic Illness</p>
                    <p className="text-muted-foreground">Known metabolic disease, ↑ammonia</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Medications/Toxins</p>
                    <p className="text-muted-foreground">Drug ingestion history</p>
                  </div>
                </div>
              </Section>

              {/* Drug Antidotes */}
              <Section id="dloc-antidotes" title="Drug Antidotes">
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[10px] min-w-[350px]">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-left py-2 px-2 font-semibold">Drug</th>
                        <th className="text-left py-2 px-2 font-semibold">Signs</th>
                        <th className="text-left py-2 px-2 font-semibold">Antidote</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b"><td className="py-1 px-2">Opioid</td><td className="py-1 px-2">Pinpoint pupils, resp. depression</td><td className="py-1 px-2 text-green-600 font-medium">Naloxone</td></tr>
                      <tr className="border-b"><td className="py-1 px-2">Benzodiazepines</td><td className="py-1 px-2">Dilated pupils, hypotension</td><td className="py-1 px-2 text-green-600 font-medium">Flumazenil</td></tr>
                      <tr className="border-b"><td className="py-1 px-2">Phenobarbitone</td><td className="py-1 px-2">Pinpoint pupils, hypotension</td><td className="py-1 px-2">Supportive care</td></tr>
                      <tr><td className="py-1 px-2">Anti-seizure meds</td><td className="py-1 px-2">↓ LOC</td><td className="py-1 px-2">Supportive (monitor levels)</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-amber-600 mt-2">Note: Phenytoin & Levetiracetam do NOT reduce consciousness</p>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HEADACHE TAB */}
        <TabsContent value="headache" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pediatric Headache</CardTitle>
              <CardDescription className="text-xs">Diagnostic approach based on duration and red flags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Red Flags */}
              <Section id="headache-redflags" title="Red Flags" defaultOpen={true}>
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-700 text-sm mb-2">Urgent Investigation Required:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• <strong>Early morning or night headache</strong></li>
                    <li>• <strong>Progressive headache</strong> in frequency, duration or severity</li>
                    <li>• <strong>Neurologic signs:</strong> altered mental status, gait abnormality, seizures</li>
                    <li>• <strong>Papilledema</strong></li>
                  </ul>
                  <p className="text-red-600 font-medium mt-2 text-xs">→ CT Brain indicated if any red flag present</p>
                </div>
              </Section>

              {/* Algorithm */}
              <Section id="headache-algorithm" title="Diagnostic Algorithm">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-semibold text-blue-700 text-center">Acute (≤7 days)</p>
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p>• 1st onset: CT Brain</p>
                        <p>• Episodic: Check red flags</p>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="font-semibold text-purple-700 text-center">Chronic (&gt;7 days)</p>
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p>• CT Brain</p>
                        <p>• If normal: Check for papilledema</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
                    <p className="font-semibold text-amber-700">CT Normal + Chronic Headache:</p>
                    <p className="text-muted-foreground mt-1">→ Ophthalmology consult for papilledema</p>
                    <p className="text-muted-foreground">• Papilledema present: Admit for IIH workup</p>
                    <p className="text-muted-foreground">• No papilledema: Neurology consult</p>
                  </div>
                </div>
              </Section>

              {/* Migraine vs Tension */}
              <Section id="headache-comparison" title="Migraine vs Tension Headache">
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[10px] min-w-[350px]">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-left py-2 px-2 font-semibold">Feature</th>
                        <th className="text-left py-2 px-2 font-semibold">Migraine</th>
                        <th className="text-left py-2 px-2 font-semibold">Tension</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Location</td><td className="py-1 px-2">Unilateral/Bilateral</td><td className="py-1 px-2">Frontal</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Duration</td><td className="py-1 px-2">2-72 hours</td><td className="py-1 px-2">Hours to days</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Character</td><td className="py-1 px-2">Pulsating/throbbing</td><td className="py-1 px-2">Squeezing/pressure</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Severity</td><td className="py-1 px-2">Moderate-severe</td><td className="py-1 px-2">Mild-moderate</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Associations</td><td className="py-1 px-2">Nausea, vomiting, photo/phonophobia</td><td className="py-1 px-2">None</td></tr>
                      <tr className="border-b"><td className="py-1 px-2 font-medium">Trigger</td><td className="py-1 px-2">Activity</td><td className="py-1 px-2">Stress</td></tr>
                      <tr><td className="py-1 px-2 font-medium">Family Hx</td><td className="py-1 px-2">Yes</td><td className="py-1 px-2">No</td></tr>
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* Acute Migraine Management */}
              <Section id="headache-acute" title="Acute Migraine Management">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-semibold text-green-700">First Line - Analgesics</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <p className="text-muted-foreground">Paracetamol: 10-15 mg/kg/dose</p>
                        {w > 0 && <p className="font-mono text-green-600">{(w * 10).toFixed(0)}-{(w * 15).toFixed(0)} mg</p>}
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ibuprofen: 5-10 mg/kg/dose</p>
                        {w > 0 && <p className="font-mono text-green-600">{(w * 5).toFixed(0)}-{(w * 10).toFixed(0)} mg</p>}
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Naproxen: 5-7 mg/kg/dose</p>
                    {w > 0 && <p className="font-mono text-gray-600">{(w * 5).toFixed(0)}-{(w * 7).toFixed(0)} mg</p>}
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Triptans (Specialist use only)</p>
                    <p className="text-muted-foreground">Rarely used in pediatrics - consult Neurology</p>
                  </div>
                </div>
              </Section>

              {/* Chronic Migraine Prophylaxis */}
              <Section id="headache-prophylaxis" title="Migraine Prophylaxis (Chronic)">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs mb-2">
                  <p className="font-medium text-blue-700">Indications:</p>
                  <p className="text-muted-foreground">• ≥1 headache/week or &gt;3/month • Prolonged severe attacks • Abortive treatment fails</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Propranolol</p>
                    <p className="text-muted-foreground">&lt;35kg: 10-20mg TDS | ≥35kg: 20-40mg TDS</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Cyproheptadine</p>
                    <p className="text-muted-foreground">0.25-0.4 mg/kg/day BD-TDS</p>
                    {w > 0 && <p className="font-mono text-gray-600">{(w * 0.25).toFixed(1)}-{(w * 0.4).toFixed(1)} mg/day</p>}
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Amitriptyline</p>
                    <p className="text-muted-foreground">0.1-0.25 mg/kg/dose HS (max 2mg/kg/day)</p>
                  </div>
                </div>
              </Section>

              {/* IIH */}
              <Section id="headache-iih" title="Idiopathic Intracranial Hypertension (IIH)">
                <div className="space-y-2">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                    <p className="font-semibold text-purple-700">Clinical Features:</p>
                    <p className="text-muted-foreground">Daily headache, diplopia, transient visual obscurations</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                    <p className="font-semibold text-red-700">Examination:</p>
                    <p className="text-muted-foreground">Papilledema, Abducent nerve palsy (CN VI)</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                    <p className="font-semibold text-blue-700">Diagnosis:</p>
                    <p className="text-muted-foreground">LP with opening pressure: ICP &gt;25 cmH₂O (normal CSF)</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                    <p className="font-semibold text-green-700">Treatment - Acetazolamide:</p>
                    <p className="text-muted-foreground">Children: 25 mg/kg/day, increase by 25 mg/kg/day (max 100 mg/kg/day)</p>
                    {w > 0 && <p className="font-mono text-green-600">Start: {(w * 25).toFixed(0)} mg/day</p>}
                    <p className="text-muted-foreground mt-1">+ Weight loss + Stop triggering medications</p>
                  </div>
                </div>
              </Section>

              {/* Non-neurological DDx */}
              <Section id="headache-nonneuro" title="Non-Neurological Causes">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">URTI</p>
                    <p className="text-muted-foreground">Cough, congestion</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Sinusitis</p>
                    <p className="text-muted-foreground">↑ with position, facial tenderness</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Meningitis</p>
                    <p className="text-muted-foreground">Fever, photophobia, neck rigidity</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Refractive Errors</p>
                    <p className="text-muted-foreground">Reduced visual acuity</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Dental Caries</p>
                    <p className="text-muted-foreground">Tooth pain</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Malignant HTN</p>
                    <p className="text-muted-foreground">High BP, risk factors</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACUTE WEAKNESS TAB */}
        <TabsContent value="weakness" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Approach to Acute Weakness</CardTitle>
              <CardDescription className="text-xs">Algorithm for neurological and non-neurological causes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Definition */}
              <Section id="weakness-def" title="Definition & Assessment" defaultOpen={true}>
                <p className="text-xs text-muted-foreground mb-2">
                  Acute weakness refers to sudden onset muscle weakness that may be unilateral or bilateral, and can indicate serious neurological conditions.
                </p>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                  <p className="font-medium text-blue-700">Muscle Power Scale (MRC):</p>
                  <div className="grid grid-cols-2 gap-1 mt-1 text-muted-foreground">
                    <span>0 = No movement</span>
                    <span>1 = Flicker only</span>
                    <span>2 = Movement (gravity eliminated)</span>
                    <span>3 = Against gravity only</span>
                    <span>4 = Against resistance</span>
                    <span>5 = Normal power</span>
                  </div>
                </div>
              </Section>

              {/* Algorithm */}
              <Section id="weakness-algorithm" title="Diagnostic Algorithm">
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                    <p className="font-semibold text-red-700 text-sm">Unilateral Weakness ± Headache</p>
                    <p className="text-xs text-muted-foreground mt-1">→ CT Brain (suspect stroke)</p>
                    <p className="text-xs text-muted-foreground">• +ve: Stroke or other brain insult → Neurology</p>
                    <p className="text-xs text-muted-foreground">• -ve: Consider other DDx</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="font-semibold text-purple-700 text-sm">Progressive Bilateral LL Weakness + Areflexia</p>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <p><strong>± Sphincter impairment / Back pain:</strong></p>
                      <p>→ Emergency MRI Spine</p>
                      <p>• +ve: Spinal compression → Neurosurgery</p>
                      <p>• -ve: Transverse myelitis → Steroids/IVIG</p>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <p className="font-semibold text-amber-700 text-sm">Diurnal Variation (Worse evenings)</p>
                    <p className="text-xs text-muted-foreground mt-1">→ Suspect Myasthenia Gravis</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="font-semibold text-green-700 text-sm">Bilateral Calf Tenderness</p>
                    <p className="text-xs text-muted-foreground mt-1">→ Check CK levels</p>
                    <p className="text-xs text-muted-foreground">• High CK: Myositis</p>
                  </div>
                </div>
              </Section>

              {/* Neurological DDx */}
              <Section id="weakness-neuro-ddx" title="Neurological Differentials">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-semibold text-red-700">Ischemic Stroke</p>
                    <p className="text-muted-foreground">Sudden onset, unilateral weakness/numbness, speech difficulty</p>
                    <p className="text-blue-600 mt-1">Tx: Aspirin 3-5 mg/kg OD</p>
                    {w > 0 && <p className="font-mono text-blue-600">{(w * 3).toFixed(0)}-{(w * 5).toFixed(0)} mg daily</p>}
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">Transverse Myelitis</p>
                    <p className="text-muted-foreground">Bilateral LL weakness, sensory level, sphincter dysfunction</p>
                    <p className="text-blue-600 mt-1">Tx: Methylprednisolone 30 mg/kg IV × 3-5 days</p>
                    {w > 0 && <p className="font-mono text-blue-600">{(w * 30).toFixed(0)} mg IV daily</p>}
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Guillain-Barré Syndrome (GBS)</p>
                    <p className="text-muted-foreground">Ascending weakness, areflexia, post-infection (1-4 weeks)</p>
                    <p className="text-blue-600 mt-1">Tx: IV Immunoglobulin 2 g/kg total</p>
                    {w > 0 && <p className="font-mono text-blue-600">{(w * 2).toFixed(0)} g total (over 2-5 days)</p>}
                  </div>
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                    <p className="font-semibold text-teal-700">Myasthenia Gravis</p>
                    <p className="text-muted-foreground">Fatiguable weakness, ptosis, diplopia, diurnal variation</p>
                    <p className="text-blue-600 mt-1">Tx: Pyridostigmine, IVIG in crisis</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Postictal Todd Paralysis</p>
                    <p className="text-muted-foreground">Transient weakness after seizure, resolves in hours</p>
                  </div>
                </div>
              </Section>

              {/* Non-neurological DDx */}
              <Section id="weakness-nonneuro-ddx" title="Non-Neurological Differentials">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Viral Myositis</p>
                    <p className="text-muted-foreground">Calf tenderness, often post-influenza</p>
                    <p className="text-blue-600">High CK</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Spinal Cord Compression</p>
                    <p className="text-muted-foreground">Back pain, sensory level</p>
                    <p className="text-blue-600">MRI Spine → Neurosurgery</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Arthritis</p>
                    <p className="text-muted-foreground">Localized pain, ↓ROM</p>
                    <p className="text-blue-600">High ESR/CRP</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Conversion Disorder</p>
                    <p className="text-muted-foreground">Stress, normal reflexes</p>
                    <p className="text-blue-600">Diagnosis of exclusion</p>
                  </div>
                </div>
              </Section>

              {/* When to Escalate */}
              <Section id="weakness-escalate" title="When to Escalate">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-700">Contact PICU:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Respiratory compromise</li>
                      <li>• Bulbar weakness</li>
                      <li>• Rapid progression</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">Contact Neurology:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Suspected stroke</li>
                      <li>• GBS / Transverse Myelitis</li>
                      <li>• Myasthenia Gravis</li>
                    </ul>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABNORMAL GAIT TAB */}
        <TabsContent value="gait" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pediatric Abnormal Gait</CardTitle>
              <CardDescription className="text-xs">Identification and evaluation of gait disorders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Important Note */}
              <Section id="gait-note" title="Important Notes" defaultOpen={true}>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
                  <p className="font-semibold text-amber-700 mb-2">Key Points:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong>Hemiplegic, Waddling, and Neuropathic gaits are NOT acute</strong></li>
                    <li>• Don't label anyone with ataxia unless <strong>afebrile</strong> and <strong>fully conscious</strong></li>
                    <li>• Ataxia in febrile/drowsy child = <strong>Pseudo-ataxia</strong> (treat underlying cause)</li>
                  </ul>
                </div>
              </Section>

              {/* Gait Types */}
              <Section id="gait-types" title="Gait Types Recognition">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">Limping Gait</p>
                    <p className="text-muted-foreground">Avoids bearing weight, musculoskeletal pain, trauma</p>
                    <p className="text-blue-600 mt-1">Ix: CRP, ESR, X-ray, US joint → Orthopedics/Rheumatology</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">Ataxic Gait</p>
                    <p className="text-muted-foreground">Wide-based, can't walk heel-to-toe, unsteady, tremors</p>
                    <p className="text-blue-600 mt-1">Ix: CT Brain → Normal: Neurology | Abnormal: Neurosurgery</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Waddling Gait (Not Acute)</p>
                    <p className="text-muted-foreground">Trunk weakness, delayed milestones, Gower sign +ve</p>
                    <p className="text-blue-600 mt-1">Ix: High CK → Neurology</p>
                  </div>
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                    <p className="font-semibold text-teal-700">Neuropathic Gait (Not Acute)</p>
                    <p className="text-muted-foreground">High steppage (toes touch first), sensory loss hands/feet</p>
                    <p className="text-blue-600 mt-1">Ix: CT (hemispheric asymmetry) → Neurology</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-700">Hemiplegic Gait (Not Acute)</p>
                    <p className="text-muted-foreground">Weakness/stiffness one side, birth asphyxia, prematurity</p>
                    <p className="text-blue-600 mt-1">→ Neurology</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Malingering/Psychogenic</p>
                    <p className="text-muted-foreground">Stressful event, inconsistent findings, all tests normal</p>
                    <p className="text-blue-600 mt-1">→ Psychology (diagnosis of exclusion)</p>
                  </div>
                </div>
              </Section>

              {/* Red Flags */}
              <Section id="gait-redflags" title="Red Flag Features">
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 text-xs">
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong>Signs of raised ICP</strong> → CT Brain</li>
                    <li>• <strong>Focal neurology</strong> → CT Brain</li>
                    <li>• <strong>Altered conscious state</strong> → CT Brain ± LP</li>
                    <li>• <strong>Meningism</strong> → LP (after ruling out ↑ICP)</li>
                    <li>• <strong>Bilateral LL weakness</strong> → Think GBS, inform Neurology</li>
                    <li>• <strong>Abnormal deep tendon reflexes</strong> → Think GBS</li>
                    <li>• <strong>Loss of proprioception/vibration</strong> → Think GBS</li>
                  </ul>
                </div>
              </Section>

              {/* Non-neurological Ataxia */}
              <Section id="gait-ataxia-causes" title="Non-Neurological Causes of Ataxia">
                <p className="text-xs text-muted-foreground mb-2">
                  Think non-neurological if: fever, ↓consciousness, trauma, headaches, medications, ear pain
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-700">Cerebellar Tumor</p>
                    <p className="text-muted-foreground">Headaches, vomiting, papilledema, focal deficits</p>
                    <p className="text-blue-600">CT: Posterior fossa mass → Oncology/Neurosurgery</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">Neuroblastoma (with OMAS)</p>
                    <p className="text-muted-foreground">Bone pain, abdominal mass crossing midline</p>
                    <p className="text-blue-600">Ix: Urine VMA/HVA, MIBG scan → Oncology</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Traumatic</p>
                    <p className="text-muted-foreground">History of trauma, skull tenderness</p>
                    <p className="text-blue-600">CT: Fracture/hemorrhage → Neurosurgery</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Intoxication</p>
                    <p className="text-muted-foreground">Access to medications, altered GCS</p>
                    <p className="text-blue-600">Toxicology screen → Pediatrics</p>
                  </div>
                </div>
              </Section>

              {/* OMAS */}
              <Section id="gait-omas" title="Opsoclonus-Myoclonus-Ataxia Syndrome (OMAS)">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs">
                  <p className="font-semibold text-purple-700 mb-2">Autoimmune disorder - Think Neuroblastoma!</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-medium">Symptoms:</p>
                      <ul className="text-muted-foreground space-y-0.5">
                        <li>• Opsoclonus (rapid involuntary eye movements)</li>
                        <li>• Myoclonus (muscle twitching)</li>
                        <li>• Ataxia</li>
                        <li>• Behavioral changes</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Investigations:</p>
                      <ul className="text-muted-foreground space-y-0.5">
                        <li>• Urine VMA/HVA</li>
                        <li>• CT/MRI chest, abdomen, pelvis</li>
                        <li>• MIBG nuclear scan</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-blue-600 mt-2">Tx: Immunomodulators, surgical removal if neuroblastoma found</p>
                </div>
              </Section>

              {/* Ataxia vs Pseudo-ataxia */}
              <Section id="gait-pseudo" title="Ataxia vs Pseudo-Ataxia">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">True Ataxia</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Fully alert child</li>
                      <li>• Afebrile</li>
                      <li>• Imbalance, incoordination</li>
                      <li>• Slurred speech</li>
                      <li>• Wide-based gait</li>
                    </ul>
                    <p className="text-blue-600 mt-1">→ Follow ataxia guidelines</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Pseudo-Ataxia</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Drowsy/inactive child</li>
                      <li>• Often febrile</li>
                      <li>• Tiredness, fatigability</li>
                      <li>• Mild degree of ataxia</li>
                      <li>• Part of systemic illness</li>
                    </ul>
                    <p className="text-amber-600 mt-1">→ Treat underlying cause (URTI, sepsis)</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HYPERKALEMIA TAB */}
        <TabsContent value="hyperkalemia" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Approach to Hyperkalemia</CardTitle>
              <CardDescription className="text-xs">ECG findings, causes, and management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Clinical Features */}
              <Section id="hyperk-clinical" title="Clinical Features" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                    <p className="font-semibold text-yellow-700">K⁺ 5-7 mEq/L</p>
                    <p className="text-muted-foreground">Generally asymptomatic</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                    <p className="font-semibold text-red-700">K⁺ &gt;7 mEq/L</p>
                    <p className="text-muted-foreground">Muscle weakness, paralysis, cardiac changes, arrhythmias. <strong>Sudden arrest may occur.</strong></p>
                  </div>
                </div>
              </Section>

              {/* Causes */}
              <Section id="hyperk-causes" title="Causes">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Pseudohyperkalemia</p>
                    <p className="text-muted-foreground">Most common cause in children - due to hemolysis of blood specimen. Not true hyperkalemia.</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Increased K⁺ Release from Cells:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Rhabdomyolysis (crush injury, prolonged seizure, hyperthermia)</li>
                      <li>• Tumor lysis syndrome</li>
                      <li>• Massive transfusion</li>
                      <li>• Metabolic acidosis</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Reduced Urinary K⁺ Excretion:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Severe hypovolemia</li>
                      <li>• Impaired kidney function</li>
                      <li>• Hypoaldosteronism (eg, adrenal insufficiency)</li>
                    </ul>
                  </div>
                </div>
              </Section>

              {/* ECG Changes */}
              <Section id="hyperk-ecg" title="ECG Changes (Progression)">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-700 font-bold text-sm">1</div>
                    <div className="flex-1 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                      <p className="font-medium text-yellow-700">Peaked T waves</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-700 font-bold text-sm">2</div>
                    <div className="flex-1 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs">
                      <p className="font-medium text-orange-700">Prolonged PR & QRS intervals, small P waves</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-700 font-bold text-sm">3</div>
                    <div className="flex-1 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                      <p className="font-medium text-red-700">Loss of P wave, "sine wave" pattern, conduction block</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center text-red-800 font-bold text-sm">4</div>
                    <div className="flex-1 p-2 bg-red-100 dark:bg-red-950/30 rounded text-xs border border-red-300">
                      <p className="font-medium text-red-800">Ventricular fibrillation or asystole</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Initial Management */}
              <Section id="hyperk-initial" title="Initial Management">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">1. Confirm True Hyperkalemia</p>
                    <p className="text-muted-foreground">Obtain non-hemolyzed venous or arterial blood sample</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">2. ECG + Cardiac Monitor</p>
                    <p className="text-muted-foreground">Place patient on continuous cardiac monitoring</p>
                  </div>
                </div>
              </Section>

              {/* Stabilize Cardiac Membranes */}
              <Section id="hyperk-calcium" title="Step 1: Stabilize Cardiac Membranes">
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 mb-2">
                  <p className="font-semibold text-red-700 text-xs">Indication:</p>
                  <p className="text-xs text-muted-foreground">K⁺ ≥7 mEq/L OR significant ECG changes (QRS widening, loss of P waves) OR severe arrhythmias</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-semibold text-green-700">Calcium Gluconate 10% (Perfusing Patients)</p>
                    <p className="text-muted-foreground">60 mg/kg (0.6 mL/kg) diluted in equal volume D5W/NS, IV over 5 min</p>
                    {w > 0 && <p className="font-mono text-green-600 mt-1">{(w * 60).toFixed(0)} mg ({(w * 0.6).toFixed(1)} mL) | Max: 2g (20mL)</p>}
                    <p className="text-muted-foreground mt-1">Onset: Immediate | May repeat in 10 min if needed</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Calcium Chloride 10% (Cardiac Arrest)</p>
                    <p className="text-muted-foreground">20 mg/kg (0.2 mL/kg) via central line or IO push</p>
                    {w > 0 && <p className="font-mono text-amber-600 mt-1">{(w * 20).toFixed(0)} mg ({(w * 0.2).toFixed(1)} mL) | Max: 2g (20mL)</p>}
                    <p className="text-red-600 mt-1">⚠️ Do NOT give peripherally</p>
                  </div>
                </div>
                <p className="text-[10px] text-red-600 mt-2">⚠️ Do NOT give calcium in same IV line as sodium bicarbonate (precipitation)</p>
              </Section>

              {/* Shift K into Cells */}
              <Section id="hyperk-shift" title="Step 2: Shift K⁺ into Cells">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">Insulin + Glucose (Onset: 10-20 min)</p>
                    <p className="text-muted-foreground">Regular Insulin: 0.1 units/kg (max 10 units)</p>
                    {w > 0 && <p className="font-mono text-blue-600">{Math.min(w * 0.1, 10).toFixed(1)} units</p>}
                    <p className="text-muted-foreground mt-1">Dextrose: 0.5 g/kg over 30 min</p>
                    <p className="text-muted-foreground">• &lt;5 yrs: D10 at 5 mL/kg | ≥5 yrs: D25 at 2 mL/kg</p>
                    {w > 0 && <p className="font-mono text-blue-600">{(w * 0.5).toFixed(1)} g dextrose</p>}
                    <p className="text-amber-600 mt-1">Monitor glucose closely - hypoglycemia risk!</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">Nebulized Albuterol (Onset: 20-30 min)</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Neonates: 0.4 mg in 2 mL NS</li>
                      <li>• &lt;25 kg: 2.5 mg in 2 mL NS</li>
                      <li>• 25-50 kg: 5 mg in 2 mL NS</li>
                      <li>• &gt;50 kg: 10 mg in 2-4 mL NS</li>
                    </ul>
                    <p className="text-muted-foreground mt-1">May repeat after 20 minutes</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Sodium Bicarbonate (Onset: 15 min)</p>
                    <p className="text-muted-foreground">1 mEq/kg (max 50 mEq) over 10-15 min</p>
                    {w > 0 && <p className="font-mono text-gray-600">{Math.min(w, 50).toFixed(0)} mEq</p>}
                    <p className="text-muted-foreground">• &gt;6 mo: 1 mL/kg of 8.4% | &lt;6 mo: 2 mL/kg of 4.2%</p>
                    <p className="text-amber-600 mt-1">Minimal effect - should NOT be sole therapy</p>
                  </div>
                </div>
              </Section>

              {/* Remove K */}
              <Section id="hyperk-remove" title="Step 3: Remove K⁺ from Body">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-700">Stop All Potassium Intake</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Loop Diuretic - Furosemide (Onset: 1-2 hr)</p>
                    <p className="text-muted-foreground">1 mg/kg IV (max 40 mg)</p>
                    {w > 0 && <p className="font-mono text-gray-600">{Math.min(w, 40).toFixed(0)} mg IV</p>}
                    <p className="text-muted-foreground">May repeat after 6 hours. Replace fluid losses.</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Sodium Polystyrene Sulfonate (Kayexalate)</p>
                    <p className="text-muted-foreground">1 g/kg (max 30 g) PO, NG, or PR</p>
                    {w > 0 && <p className="font-mono text-gray-600">{Math.min(w, 30).toFixed(0)} g</p>}
                    <p className="text-muted-foreground">Onset: 1-2 hr | May repeat after 4-6 hr</p>
                    <p className="text-red-600 mt-1">⚠️ Avoid in: preterm neonates, NEC risk, ileus, bowel obstruction</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">Hemodialysis</p>
                    <p className="text-muted-foreground">For refractory cases or severe renal impairment</p>
                    <p className="text-muted-foreground">Fastest and most controlled method for K⁺ removal</p>
                  </div>
                </div>
              </Section>

              {/* Lab Testing */}
              <Section id="hyperk-labs" title="Laboratory Evaluation">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">All Patients:</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• BUN, Creatinine</li>
                      <li>• Blood glucose</li>
                      <li>• Serum electrolytes</li>
                      <li>• Urinalysis, Urine electrolytes</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">If Rhabdomyolysis Suspected:</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Serum CK, LDH</li>
                      <li>• Urine myoglobin</li>
                      <li>• Blood gas</li>
                    </ul>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UPPER GI BLEED TAB */}
        <TabsContent value="ugib" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upper GI Bleeding (UGIB)</CardTitle>
              <CardDescription className="text-xs">Assessment, stabilization, and management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Definition */}
              <Section id="ugib-def" title="Definition & Presentation" defaultOpen={true}>
                <p className="text-xs text-muted-foreground mb-2">
                  UGIB presents as hematemesis (bright red or coffee-ground material) or melena (black tarry stools).
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-700">Hematemesis</p>
                    <p className="text-muted-foreground">Bright red: active bleeding</p>
                    <p className="text-muted-foreground">Coffee-ground: slower/older bleeding</p>
                  </div>
                  <div className="p-2 bg-gray-800 dark:bg-gray-900 rounded">
                    <p className="font-semibold text-gray-200">Melena</p>
                    <p className="text-gray-400">Black, tarry, foul-smelling stool</p>
                    <p className="text-gray-400">Indicates UGI source</p>
                  </div>
                </div>
              </Section>

              {/* Rapid Assessment */}
              <Section id="ugib-rapid" title="Rapid Assessment">
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-700 text-sm mb-2">Signs of Hemodynamic Instability (Shock):</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>• Tachycardia</span>
                    <span>• Hypotension/Orthostasis</span>
                    <span>• Poor capillary refill</span>
                    <span>• Cold extremities</span>
                    <span>• Altered mental status</span>
                    <span>• Mottled skin</span>
                  </div>
                </div>
              </Section>

              {/* Unstable Patient */}
              <Section id="ugib-unstable" title="Hemodynamically UNSTABLE">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <p className="font-semibold text-red-700">Immediate Actions:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Fluid resuscitation (crystalloid ± blood)</li>
                      <li>• Intubate if unable to protect airway</li>
                      <li>• Place 2 large-bore IVs</li>
                      <li>• Type & crossmatch; transfuse as indicated</li>
                      <li>• Intensive monitoring of vitals</li>
                      <li>• Stabilize before further management</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">Consult:</p>
                    <p className="text-muted-foreground">Gastroenterology, Surgery, Critical Care (PICU)</p>
                  </div>
                </div>
              </Section>

              {/* Stable Patient Evaluation */}
              <Section id="ugib-stable" title="Hemodynamically STABLE - Initial Evaluation">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">1. Estimate Severity of Bleeding</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">2. CBC if more than minor bleeding</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">3. Focused History:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Known liver disease or varices?</li>
                      <li>• Bleeding diathesis?</li>
                      <li>• NSAID use?</li>
                      <li>• Vomiting before hematemesis? (Mallory-Weiss)</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">4. Focused Physical Exam:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Hepatosplenomegaly (portal HTN → varices)</li>
                      <li>• Epistaxis (blood source may be nasal)</li>
                      <li>• Bruising, petechiae (bleeding disorder)</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-medium text-amber-700">5. Exclude Mimics of UGIB:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Epistaxis with swallowed blood</li>
                      <li>• Swallowed maternal blood (neonates)</li>
                      <li>• Red food colorings (tomatoes, beets)</li>
                      <li>• Iron supplements (black stools)</li>
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Concerning Features */}
              <Section id="ugib-concerning" title="Features Suggesting Severe UGIB">
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 text-xs">
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong>Presented with hemodynamic instability</strong></li>
                    <li>• <strong>Melena or large hematochezia</strong></li>
                    <li>• <strong>Large-volume hematemesis</strong></li>
                    <li>• <strong>Known/suspected esophageal varices</strong> (liver disease, splenomegaly)</li>
                    <li>• <strong>Significant anemia</strong> (Hgb &gt;20% below normal, or needs transfusion)</li>
                  </ul>
                  <p className="text-red-600 font-medium mt-2">→ Requires aggressive management</p>
                </div>
              </Section>

              {/* Management - Large Volume */}
              <Section id="ugib-large" title="Large-Volume UGIB Management">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold text-blue-700">IV Access & Monitoring</p>
                    <p className="text-muted-foreground">Maintain IV access, intensive monitoring in PICU</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">Blood Tests:</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• CBC with platelets, PT/PTT, INR</li>
                      <li>• Type & screen</li>
                      <li>• Electrolytes, BUN, Creatinine</li>
                      <li>• ALT, AST (if cause unclear)</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-red-700">Transfuse if:</p>
                    <p className="text-muted-foreground">Hgb &lt;8 g/dL or hemodynamically unstable</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="font-semibold text-purple-700">IV PPI (Acid Suppression)</p>
                    <p className="text-muted-foreground">Omeprazole or Pantoprazole</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-semibold text-green-700">Correct Coagulopathy</p>
                    <p className="text-muted-foreground">Vitamin K for liver disease, FFP/platelets if needed</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-semibold text-amber-700">Octreotide (for Variceal Bleeding)</p>
                    <p className="text-muted-foreground">Used to control bleeding prior to endoscopy</p>
                  </div>
                </div>
              </Section>

              {/* Endoscopy */}
              <Section id="ugib-endoscopy" title="Upper Endoscopy">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold text-blue-700 text-sm">Within 24 hours when stable:</p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• For diagnosis AND therapy</li>
                    <li>• If cause unknown or bleeding continues</li>
                    <li>• All large-volume or concerning UGIB</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2"><strong>Note:</strong> NG tube not routinely necessary. If gastric clearance needed, <strong>erythromycin</strong> is preferred over NG lavage.</p>
                </div>
              </Section>

              {/* Small Volume Management */}
              <Section id="ugib-small" title="Small-Volume UGIB (Benign Etiology)">
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-semibold text-green-700">Likely causes: Mallory-Weiss tear, mild gastritis</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• No routine lab testing required</li>
                      <li>• Treatment directed to etiology</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">Mallory-Weiss Tear:</p>
                    <p className="text-muted-foreground">Coffee-ground emesis after vigorous vomiting</p>
                    <p className="text-blue-600 mt-1">Tx: Antiemetic (ondansetron) + short course PPI</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-semibold">NSAID-Related UGIB:</p>
                    <p className="text-blue-600">Tx: Stop NSAID + course of PPI</p>
                  </div>
                </div>
              </Section>

              {/* Physical Exam Findings */}
              <Section id="ugib-pe" title="Physical Exam Findings & Implications">
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[10px] min-w-[350px]">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-left py-2 px-2 font-semibold">Finding</th>
                        <th className="text-left py-2 px-2 font-semibold">Consider</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b"><td className="py-1 px-2">Hepatosplenomegaly, ascites</td><td className="py-1 px-2">Portal HTN → Esophageal varices</td></tr>
                      <tr className="border-b"><td className="py-1 px-2">Bruising, petechiae</td><td className="py-1 px-2">Bleeding disorder</td></tr>
                      <tr className="border-b"><td className="py-1 px-2">Vascular malformations</td><td className="py-1 px-2">Hereditary hemorrhagic telangiectasia</td></tr>
                      <tr className="border-b"><td className="py-1 px-2">Mucocutaneous pigmentation</td><td className="py-1 px-2">Peutz-Jeghers syndrome</td></tr>
                      <tr><td className="py-1 px-2">Blood in nares/pharynx</td><td className="py-1 px-2">Epistaxis (mimic)</td></tr>
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* Abbreviations */}
              <Section id="ugib-abbrev" title="Key Abbreviations">
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="space-y-0.5">
                    <p><strong>UGIB:</strong> Upper GI Bleeding</p>
                    <p><strong>PPI:</strong> Proton Pump Inhibitor</p>
                    <p><strong>NG:</strong> Nasogastric</p>
                  </div>
                  <div className="space-y-0.5">
                    <p><strong>INR:</strong> International Normalized Ratio</p>
                    <p><strong>FFP:</strong> Fresh Frozen Plasma</p>
                    <p><strong>Hgb:</strong> Hemoglobin</p>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-0">
          <button
            onClick={() => toggleSection('vitals')}
            className="w-full flex items-center justify-center gap-2"
          >
            <CardTitle className="text-sm text-center">Pediatric Vital Signs Reference</CardTitle>
            <span className={`transform transition-transform ${expandedSections['vitals'] ? 'rotate-180' : ''}`}>▼</span>
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
