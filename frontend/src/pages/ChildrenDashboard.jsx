import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Activity, Syringe, Heart, Brain, Calculator, Pill, Droplets, Users, Stethoscope, Scale, AlertTriangle, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Layout from "@/components/Layout";

// Children Dashboard - Page-based navigation
const ChildrenDashboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { page } = useParams();
  // Use page directly from URL params - no need for separate state
  const currentPage = page || "main";

  // Navigate to a page
  const goToPage = (pageId) => {
    if (pageId === "main") {
      navigate("/children");
    } else {
      navigate(`/children/${pageId}`);
    }
  };

  // Widget definitions for main page
  const widgets = [
    { id: "bp", title: "Blood Pressure", subtitle: "Age-based BP percentiles", icon: Activity, color: "red" },
    { id: "infusions", title: "Infusions", subtitle: "IV drug calculations", icon: Syringe, color: "blue" },
    { id: "intubation", title: "Intubation", subtitle: "ETT + RSI Checklist", icon: Stethoscope, color: "purple" },
    { id: "scoring", title: "Scoring", subtitle: "GCS, PRAM, Westley, OI", icon: Calculator, color: "amber" },
    { id: "cpr", title: "CPR", subtitle: "PALS drugs & algorithms", icon: Heart, color: "red" },
    { id: "approaches", title: "Approaches", subtitle: "DKA, SE, Hyperammonemia", icon: FileText, color: "teal" },
    { id: "insensible", title: "Insensible Water Loss", subtitle: "BSA-based calculation", icon: Droplets, color: "teal" },
    { id: "drugs", title: "Drugs", subtitle: "Commonly used medications", icon: Pill, color: "purple" },
  ];

  const getColorClass = (color) => {
    const colors = {
      teal: "text-[#00d9c5] bg-[#00d9c5]/10",
      blue: "text-blue-500 bg-blue-500/10",
      red: "text-red-500 bg-red-500/10",
      purple: "text-purple-500 bg-purple-500/10",
      amber: "text-amber-500 bg-amber-500/10"
    };
    return colors[color] || colors.teal;
  };

  // Render the appropriate page content
  const renderPage = () => {
    switch(currentPage) {
      case "bp":
        return <BPPage onBack={() => goToPage("main")} />;
      case "infusions":
        return <InfusionsPage onBack={() => goToPage("main")} />;
      case "intubation":
        return <IntubationPage onBack={() => goToPage("main")} />;
      case "scoring":
        return <ScoringPage onBack={() => goToPage("main")} />;
      case "cpr":
        return <CPRPage onBack={() => goToPage("main")} />;
      case "approaches":
        return <ApproachesPage onBack={() => goToPage("main")} />;
      case "insensible":
        return <InsensiblePage onBack={() => goToPage("main")} />;
      case "drugs":
        return <DrugsPage onBack={() => goToPage("main")} />;
      default:
        return renderMainPage();
    }
  };

  // Main page with widget grid
  const renderMainPage = () => (
    <div className="grid grid-cols-2 gap-4">
      {widgets.map((widget) => (
        <Card
          key={widget.id}
          onClick={() => goToPage(widget.id)}
          className="nightingale-card cursor-pointer hover:scale-[1.02] transition-all duration-300"
          data-testid={`widget-${widget.id}`}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${getColorClass(widget.color)}`}>
                <widget.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold text-sm">{widget.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{widget.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-header pl-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => currentPage === "main" ? navigate("/") : goToPage("main")}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-heading text-lg font-bold text-foreground tracking-tight">
              {currentPage === "main" ? "Children" : widgets.find(w => w.id === currentPage)?.title || "Children"}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {currentPage === "main" ? "Pediatric Ward" : "Tap arrow to go back"}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-24 pb-8 min-h-screen">
        <ScrollArea className="h-[calc(100vh-120px)]">
          {renderPage()}
        </ScrollArea>
      </main>
    </Layout>
  );
};

// ==================== PAGE COMPONENTS ====================

// Blood Pressure Page
const BPPage = ({ onBack }) => {
  const [gender, setGender] = useState("boys");
  const [selectedAge, setSelectedAge] = useState("");

  // BP data based on the PDF provided (50th percentile at 50th height percentile)
  const bpData = {
    boys: [
      { age: "1", systolic: { p50: 80, p90: 94, p95: 98, p99: 105 }, diastolic: { p50: 34, p90: 49, p95: 54, p99: 61 } },
      { age: "2", systolic: { p50: 84, p90: 97, p95: 101, p99: 109 }, diastolic: { p50: 39, p90: 54, p95: 59, p99: 66 } },
      { age: "3", systolic: { p50: 86, p90: 100, p95: 104, p99: 111 }, diastolic: { p50: 44, p90: 59, p95: 63, p99: 71 } },
      { age: "4", systolic: { p50: 88, p90: 102, p95: 106, p99: 113 }, diastolic: { p50: 47, p90: 62, p95: 66, p99: 74 } },
      { age: "5", systolic: { p50: 90, p90: 104, p95: 108, p99: 115 }, diastolic: { p50: 50, p90: 65, p95: 69, p99: 77 } },
      { age: "6", systolic: { p50: 91, p90: 105, p95: 109, p99: 116 }, diastolic: { p50: 53, p90: 68, p95: 72, p99: 80 } },
      { age: "7", systolic: { p50: 92, p90: 106, p95: 110, p99: 117 }, diastolic: { p50: 55, p90: 70, p95: 74, p99: 82 } },
      { age: "8", systolic: { p50: 94, p90: 107, p95: 111, p99: 119 }, diastolic: { p50: 56, p90: 71, p95: 75, p99: 83 } },
      { age: "9", systolic: { p50: 95, p90: 109, p95: 113, p99: 120 }, diastolic: { p50: 57, p90: 72, p95: 76, p99: 84 } },
      { age: "10", systolic: { p50: 97, p90: 111, p95: 115, p99: 122 }, diastolic: { p50: 58, p90: 73, p95: 77, p99: 85 } },
      { age: "11", systolic: { p50: 99, p90: 113, p95: 117, p99: 124 }, diastolic: { p50: 59, p90: 74, p95: 78, p99: 86 } },
      { age: "12", systolic: { p50: 101, p90: 115, p95: 119, p99: 126 }, diastolic: { p50: 59, p90: 74, p95: 78, p99: 86 } },
      { age: "13", systolic: { p50: 104, p90: 117, p95: 121, p99: 128 }, diastolic: { p50: 60, p90: 75, p95: 79, p99: 87 } },
      { age: "14", systolic: { p50: 106, p90: 120, p95: 124, p99: 131 }, diastolic: { p50: 60, p90: 75, p95: 80, p99: 87 } },
      { age: "15", systolic: { p50: 109, p90: 122, p95: 126, p99: 134 }, diastolic: { p50: 61, p90: 76, p95: 81, p99: 88 } },
      { age: "16", systolic: { p50: 111, p90: 125, p95: 129, p99: 136 }, diastolic: { p50: 63, p90: 78, p95: 82, p99: 90 } },
      { age: "17", systolic: { p50: 114, p90: 127, p95: 131, p99: 139 }, diastolic: { p50: 65, p90: 80, p95: 84, p99: 92 } },
    ],
    girls: [
      { age: "1", systolic: { p50: 83, p90: 97, p95: 100, p99: 108 }, diastolic: { p50: 38, p90: 52, p95: 56, p99: 64 } },
      { age: "2", systolic: { p50: 85, p90: 98, p95: 102, p99: 109 }, diastolic: { p50: 43, p90: 57, p95: 61, p99: 69 } },
      { age: "3", systolic: { p50: 86, p90: 100, p95: 104, p99: 111 }, diastolic: { p50: 47, p90: 61, p95: 65, p99: 73 } },
      { age: "4", systolic: { p50: 88, p90: 101, p95: 105, p99: 112 }, diastolic: { p50: 50, p90: 64, p95: 68, p99: 76 } },
      { age: "5", systolic: { p50: 89, p90: 103, p95: 107, p99: 114 }, diastolic: { p50: 52, p90: 66, p95: 70, p99: 78 } },
      { age: "6", systolic: { p50: 91, p90: 104, p95: 108, p99: 115 }, diastolic: { p50: 54, p90: 68, p95: 72, p99: 80 } },
      { age: "7", systolic: { p50: 93, p90: 106, p95: 110, p99: 117 }, diastolic: { p50: 55, p90: 69, p95: 73, p99: 81 } },
      { age: "8", systolic: { p50: 95, p90: 108, p95: 112, p99: 119 }, diastolic: { p50: 57, p90: 71, p95: 75, p99: 82 } },
      { age: "9", systolic: { p50: 96, p90: 110, p95: 114, p99: 121 }, diastolic: { p50: 58, p90: 72, p95: 76, p99: 83 } },
      { age: "10", systolic: { p50: 98, p90: 112, p95: 116, p99: 123 }, diastolic: { p50: 59, p90: 73, p95: 77, p99: 84 } },
      { age: "11", systolic: { p50: 100, p90: 114, p95: 118, p99: 125 }, diastolic: { p50: 60, p90: 74, p95: 78, p99: 85 } },
      { age: "12", systolic: { p50: 102, p90: 116, p95: 119, p99: 127 }, diastolic: { p50: 61, p90: 75, p95: 79, p99: 86 } },
      { age: "13", systolic: { p50: 104, p90: 117, p95: 121, p99: 128 }, diastolic: { p50: 62, p90: 76, p95: 80, p99: 87 } },
      { age: "14", systolic: { p50: 106, p90: 119, p95: 123, p99: 130 }, diastolic: { p50: 63, p90: 77, p95: 81, p99: 88 } },
      { age: "15", systolic: { p50: 107, p90: 120, p95: 124, p99: 131 }, diastolic: { p50: 64, p90: 78, p95: 82, p99: 89 } },
      { age: "16", systolic: { p50: 108, p90: 121, p95: 125, p99: 132 }, diastolic: { p50: 64, p90: 78, p95: 82, p99: 90 } },
      { age: "17", systolic: { p50: 108, p90: 122, p95: 125, p99: 133 }, diastolic: { p50: 64, p90: 78, p95: 82, p99: 90 } },
    ]
  };

  const selectedData = selectedAge ? bpData[gender].find(d => d.age === selectedAge) : null;

  return (
    <div className="space-y-4 pb-8">
      <Card className="nightingale-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Blood Pressure by Age</CardTitle>
          <CardDescription>Percentiles at 50th height percentile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gender Selection */}
          <div className="flex gap-2">
            <Button
              variant={gender === "boys" ? "default" : "outline"}
              onClick={() => setGender("boys")}
              className="flex-1"
            >
              Boys
            </Button>
            <Button
              variant={gender === "girls" ? "default" : "outline"}
              onClick={() => setGender("girls")}
              className="flex-1"
            >
              Girls
            </Button>
          </div>

          {/* Age Selection */}
          <div className="space-y-2">
            <Label>Age (years)</Label>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3"
            >
              <option value="">Select age...</option>
              {bpData[gender].map((d) => (
                <option key={d.age} value={d.age}>{d.age} years</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {selectedData && (
        <div className="space-y-3">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">50th Percentile (Normal)</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Systolic</p>
                  <p className="text-2xl font-mono font-bold">{selectedData.systolic.p50}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diastolic</p>
                  <p className="text-2xl font-mono font-bold">{selectedData.diastolic.p50}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-2">90th Percentile (Pre-HTN)</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Systolic</p>
                  <p className="text-2xl font-mono font-bold">{selectedData.systolic.p90}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diastolic</p>
                  <p className="text-2xl font-mono font-bold">{selectedData.diastolic.p90}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-2">95th / 99th Percentile (HTN)</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">SBP 95th</p>
                  <p className="text-lg font-mono font-bold">{selectedData.systolic.p95}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">SBP 99th</p>
                  <p className="text-lg font-mono font-bold">{selectedData.systolic.p99}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">DBP 95th</p>
                  <p className="text-lg font-mono font-bold">{selectedData.diastolic.p95}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">DBP 99th</p>
                  <p className="text-lg font-mono font-bold">{selectedData.diastolic.p99}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reference */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• Values at 50th height percentile</p>
          <p>• Pre-HTN: 90th to &lt;95th percentile</p>
          <p>• HTN Stage 1: ≥95th to &lt;99th + 5mmHg</p>
          <p>• HTN Stage 2: ≥99th + 5mmHg</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Infusions Page
const InfusionsPage = ({ onBack }) => {
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  const infusionCategories = [
    {
      category: "Neuromuscular Blockade",
      color: "purple",
      drugs: [
        {
          name: "Cisatracurium (Nimbex)",
          stat: { dose: "0.1-0.2 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.2).toFixed(2)} mg` : null },
          infusion: { dose: "1-4 mcg/kg/min", calc: w ? `${(w * 0.06).toFixed(2)} - ${(w * 0.24).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Sedatives",
      color: "blue",
      drugs: [
        {
          name: "Midazolam",
          stat: { dose: "0.1 mg/kg", calc: w ? `${(w * 0.1).toFixed(2)} mg` : null },
          infusion: { dose: "0.1-0.5 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 0.5).toFixed(2)} mg/hr` : null }
        },
        {
          name: "Fentanyl",
          stat: { dose: "1 mcg/kg", calc: w ? `${(w * 1).toFixed(1)} mcg` : null },
          infusion: { dose: "1-5 mcg/kg/hr", calc: w ? `${(w * 1).toFixed(1)} - ${(w * 5).toFixed(1)} mcg/hr` : null }
        }
      ]
    },
    {
      category: "Diuretics",
      color: "teal",
      drugs: [
        {
          name: "Furosemide (Lasix)",
          stat: { dose: "0.5-1 mg/kg (Max 40mg)", calc: w ? `${Math.min(w * 0.5, 40).toFixed(1)} - ${Math.min(w * 1, 40).toFixed(1)} mg` : null },
          infusion: { dose: "0.1-1 mg/kg/hr", calc: w ? `${(w * 0.1).toFixed(2)} - ${(w * 1).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Bronchodilator",
      color: "amber",
      drugs: [
        {
          name: "Ventolin Infusion",
          stat: null,
          infusion: { dose: "0.3 mg/kg/hr", calc: w ? `${(w * 0.3).toFixed(2)} mg/hr` : null }
        }
      ]
    },
    {
      category: "Inotropic Support",
      color: "red",
      drugs: [
        { name: "Dopamine", range: "0-20 mcg/kg/min", calc: w ? `0 - ${(w * 20 * 60 / 1000).toFixed(2)} mg/hr` : null },
        { name: "Dobutamine", range: "0-20 mcg/kg/min", calc: w ? `0 - ${(w * 20 * 60 / 1000).toFixed(2)} mg/hr` : null },
        { name: "Epinephrine", range: "0-0.5 mcg/kg/min", calc: w ? `0 - ${(w * 0.5 * 60).toFixed(1)} mcg/hr` : null },
        { name: "Norepinephrine", range: "0-0.5 mcg/kg/min", calc: w ? `0 - ${(w * 0.5 * 60).toFixed(1)} mcg/hr` : null },
      ]
    }
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Weight Input */}
      <Card className="nightingale-card">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              placeholder="Enter weight for calculations"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Infusion Categories */}
      {infusionCategories.map((cat, idx) => (
        <Card key={idx} className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{cat.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cat.drugs.map((drug, dIdx) => (
              <div key={dIdx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="font-semibold text-sm mb-2">{drug.name}</p>
                {drug.stat && (
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-muted-foreground">Stat: {drug.stat.dose}</span>
                    {drug.stat.calc && <span className="font-mono text-[#00d9c5]">→ {drug.stat.calc}</span>}
                  </div>
                )}
                {drug.infusion && (
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-muted-foreground">Infusion: {drug.infusion.dose}</span>
                    {drug.infusion.calc && <span className="font-mono text-[#00d9c5]">→ {drug.infusion.calc}</span>}
                  </div>
                )}
                {drug.range && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Range: {drug.range}</span>
                    {drug.calc && <span className="font-mono text-[#00d9c5]">→ {drug.calc}</span>}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Intubation Page
const IntubationPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");

  const calculateETT = () => {
    const ageNum = parseFloat(age);
    if (!ageNum) return null;
    return {
      uncuffed: ((ageNum / 4) + 4).toFixed(1),
      cuffed: ((ageNum / 4) + 3.5).toFixed(1),
      depth: ((ageNum / 2) + 12).toFixed(1)
    };
  };

  const ettResult = calculateETT();

  const rsiSteps = [
    {
      title: "1. Preparation",
      items: ["Monitoring: SpO2, ECG, BP, EtCO2", "IV access confirmed", "Suction ready", "Bag-mask ventilation ready", "ETT + stylet (size + 0.5 backup)", "Laryngoscope checked", "Drugs drawn up"]
    },
    {
      title: "2. Preoxygenation",
      items: ["100% O2 for 3-5 minutes", "Avoid positive pressure if possible", "Target SpO2 >95%"]
    },
    {
      title: "3. Pretreatment",
      items: ["Atropine 0.02 mg/kg (min 0.1mg, max 0.5mg) - for <1yr or bradycardia risk", "Consider Lidocaine 1.5 mg/kg IV for ↑ICP"]
    },
    {
      title: "4. Paralysis with Induction",
      drugs: [
        { name: "Ketamine", dose: "1-2 mg/kg IV", note: "Hemodynamically stable" },
        { name: "Midazolam", dose: "0.1-0.3 mg/kg IV", note: "May cause hypotension" },
        { name: "Fentanyl", dose: "2-3 mcg/kg IV", note: "Hemodynamically stable" },
        { name: "Propofol", dose: "1-3 mg/kg IV", note: "May cause hypotension" },
        { name: "Cisatracurium", dose: "0.15-0.2 mg/kg IV", note: "Paralytic (onset 2-3 min)" },
      ]
    },
    {
      title: "5. Positioning",
      items: ["Sniffing position (infant: neutral)", "External laryngeal manipulation if needed", "Bougie/stylet if difficult view"]
    },
    {
      title: "6. Placement Confirmation",
      items: ["Direct visualization of cords", "EtCO2 waveform (gold standard)", "Bilateral breath sounds", "Chest rise", "SpO2 stable/improving", "CXR for depth"]
    }
  ];

  return (
    <div className="space-y-4 pb-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="rsi">RSI Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4 mt-4">
          <Card className="nightingale-card">
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Age (years)</Label>
                  <Input type="number" placeholder="e.g., 5" value={age} onChange={(e) => setAge(e.target.value)} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" placeholder="Optional" value={weight} onChange={(e) => setWeight(e.target.value)} className="font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>

          {ettResult && (
            <>
              <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/30">
                <CardContent className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">ETT Size (Uncuffed)</p>
                  <p className="text-4xl font-mono font-bold text-purple-600">{ettResult.uncuffed} mm</p>
                  <p className="text-xs text-muted-foreground mt-1">(Age/4) + 4</p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                  <CardContent className="pt-4 text-center">
                    <p className="text-xs text-muted-foreground">Cuffed ETT</p>
                    <p className="text-2xl font-mono font-bold text-blue-600">{ettResult.cuffed} mm</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
                  <CardContent className="pt-4 text-center">
                    <p className="text-xs text-muted-foreground">Depth at Lip</p>
                    <p className="text-2xl font-mono font-bold text-green-600">{ettResult.depth} cm</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          <Card className="nightingale-card">
            <CardContent className="pt-4 text-xs text-muted-foreground space-y-1">
              <p>• Uncuffed: (Age/4) + 4</p>
              <p>• Cuffed: (Age/4) + 3.5</p>
              <p>• Depth: (Age/2) + 12</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rsi" className="space-y-3 mt-4">
          {rsiSteps.map((step, idx) => (
            <Card key={idx} className="nightingale-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#00d9c5]">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {step.items && step.items.map((item, i) => (
                  <p key={i} className="text-xs">• {item}</p>
                ))}
                {step.drugs && step.drugs.map((drug, i) => (
                  <div key={i} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs mb-1">
                    <p className="font-medium">{drug.name}: {drug.dose}</p>
                    <p className="text-muted-foreground">{drug.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Insensible Water Loss Page
const InsensiblePage = ({ onBack }) => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) return null;
    const bsa = Math.sqrt((w * h) / 3600);
    return { bsa: bsa.toFixed(3), iwl: (400 * bsa).toFixed(1) };
  };

  const result = calculate();

  return (
    <div className="space-y-4 pb-8">
      <Card className="nightingale-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Insensible Water Loss</CardTitle>
          <CardDescription>Based on Body Surface Area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input type="number" placeholder="e.g., 15" value={weight} onChange={(e) => setWeight(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input type="number" placeholder="e.g., 100" value={height} onChange={(e) => setHeight(e.target.value)} className="font-mono" />
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-teal-200 bg-teal-50 dark:bg-teal-950/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Insensible Water Loss</p>
              <p className="text-4xl font-mono font-bold text-[#00d9c5]">{result.iwl} ml/day</p>
            </CardContent>
          </Card>
          <Card className="nightingale-card">
            <CardContent className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">Body Surface Area</p>
              <p className="text-2xl font-mono font-bold">{result.bsa} m²</p>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Formulas</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• IWL = 400 × BSA</p>
          <p>• BSA = √(Weight × Height / 3600)</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Scoring Page - GCS, PRAM, Westley, OI
const ScoringPage = ({ onBack }) => {
  const [activeScore, setActiveScore] = useState("gcs");

  return (
    <div className="space-y-4 pb-8">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "gcs", label: "GCS" },
          { id: "pram", label: "PRAM" },
          { id: "westley", label: "Westley" },
          { id: "oi", label: "OI" }
        ].map((score) => (
          <Button
            key={score.id}
            variant={activeScore === score.id ? "default" : "outline"}
            onClick={() => setActiveScore(score.id)}
            className="whitespace-nowrap"
          >
            {score.label}
          </Button>
        ))}
      </div>

      {activeScore === "gcs" && <GCSScoring />}
      {activeScore === "pram" && <PRAMScoring />}
      {activeScore === "westley" && <WestleyScoring />}
      {activeScore === "oi" && <OxygenationIndex />}
    </div>
  );
};

// GCS Scoring Component
const GCSScoring = () => {
  const [eye, setEye] = useState(0);
  const [verbal, setVerbal] = useState(0);
  const [motor, setMotor] = useState(0);
  const [leftPupil, setLeftPupil] = useState("");
  const [rightPupil, setRightPupil] = useState("");

  const total = eye + verbal + motor;

  const eyeOptions = [
    { value: 4, label: "Spontaneous" },
    { value: 3, label: "To voice" },
    { value: 2, label: "To pain" },
    { value: 1, label: "None" }
  ];

  const verbalOptions = [
    { value: 5, label: "Oriented" },
    { value: 4, label: "Confused" },
    { value: 3, label: "Inappropriate words" },
    { value: 2, label: "Incomprehensible" },
    { value: 1, label: "None" }
  ];

  const motorOptions = [
    { value: 6, label: "Obeys commands" },
    { value: 5, label: "Localizes pain" },
    { value: 4, label: "Withdraws" },
    { value: 3, label: "Flexion" },
    { value: 2, label: "Extension" },
    { value: 1, label: "None" }
  ];

  const pupilOptions = ["Reactive", "Sluggish", "Fixed", "Dilated"];

  return (
    <div className="space-y-4">
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Eye Opening (E)</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={eye.toString()} onValueChange={(v) => setEye(parseInt(v))}>
            {eyeOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value.toString()} id={`eye-${opt.value}`} />
                <Label htmlFor={`eye-${opt.value}`} className="text-sm">{opt.value} - {opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Verbal Response (V)</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={verbal.toString()} onValueChange={(v) => setVerbal(parseInt(v))}>
            {verbalOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value.toString()} id={`verbal-${opt.value}`} />
                <Label htmlFor={`verbal-${opt.value}`} className="text-sm">{opt.value} - {opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Motor Response (M)</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={motor.toString()} onValueChange={(v) => setMotor(parseInt(v))}>
            {motorOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value.toString()} id={`motor-${opt.value}`} />
                <Label htmlFor={`motor-${opt.value}`} className="text-sm">{opt.value} - {opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Pupil Assessment</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Left Pupil</Label>
            <select value={leftPupil} onChange={(e) => setLeftPupil(e.target.value)} className="w-full h-9 rounded-lg bg-gray-50 dark:bg-gray-800 px-2 text-sm">
              <option value="">Select...</option>
              {pupilOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Right Pupil</Label>
            <select value={rightPupil} onChange={(e) => setRightPupil(e.target.value)} className="w-full h-9 rounded-lg bg-gray-50 dark:bg-gray-800 px-2 text-sm">
              <option value="">Select...</option>
              {pupilOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {total > 0 && (
        <Card className={`border-2 ${total <= 8 ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : total <= 12 ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30' : 'border-green-300 bg-green-50 dark:bg-green-950/30'}`}>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Total GCS Score</p>
            <p className="text-5xl font-mono font-bold">{total}/15</p>
            <p className="text-sm mt-2">E{eye} V{verbal} M{motor}</p>
            {leftPupil && rightPupil && (
              <p className="text-xs text-muted-foreground mt-1">Pupils: L-{leftPupil}, R-{rightPupil}</p>
            )}
            <p className="text-xs mt-2 font-medium">
              {total <= 8 ? "Severe (≤8)" : total <= 12 ? "Moderate (9-12)" : "Mild (13-15)"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// PRAM Scoring Component
const PRAMScoring = () => {
  const [scalene, setScalene] = useState(0);
  const [suprasternal, setSuprasternal] = useState(0);
  const [wheezing, setWheezing] = useState(0);
  const [airEntry, setAirEntry] = useState(0);
  const [o2Sat, setO2Sat] = useState(0);

  const total = scalene + suprasternal + wheezing + airEntry + o2Sat;

  return (
    <div className="space-y-4">
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Pediatric Respiratory Assessment Measure (PRAM)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scalene Muscle Contraction */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Scalene Muscle Contraction</Label>
            <RadioGroup value={scalene.toString()} onValueChange={(v) => setScalene(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="sc-0" /><Label htmlFor="sc-0" className="text-xs">0 - Absent</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="sc-2" /><Label htmlFor="sc-2" className="text-xs">2 - Present</Label></div>
            </RadioGroup>
          </div>

          {/* Suprasternal Retractions */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Suprasternal Retractions</Label>
            <RadioGroup value={suprasternal.toString()} onValueChange={(v) => setSuprasternal(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="ss-0" /><Label htmlFor="ss-0" className="text-xs">0 - Absent</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="ss-2" /><Label htmlFor="ss-2" className="text-xs">2 - Present</Label></div>
            </RadioGroup>
          </div>

          {/* Wheezing */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Wheezing</Label>
            <RadioGroup value={wheezing.toString()} onValueChange={(v) => setWheezing(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="wh-0" /><Label htmlFor="wh-0" className="text-xs">0 - Absent</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="wh-1" /><Label htmlFor="wh-1" className="text-xs">1 - Expiratory only</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="wh-2" /><Label htmlFor="wh-2" className="text-xs">2 - Inspiratory & Expiratory</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="wh-3" /><Label htmlFor="wh-3" className="text-xs">3 - Audible without stethoscope</Label></div>
            </RadioGroup>
          </div>

          {/* Air Entry */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Air Entry</Label>
            <RadioGroup value={airEntry.toString()} onValueChange={(v) => setAirEntry(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="ae-0" /><Label htmlFor="ae-0" className="text-xs">0 - Normal</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="ae-1" /><Label htmlFor="ae-1" className="text-xs">1 - Decreased at bases</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="ae-2" /><Label htmlFor="ae-2" className="text-xs">2 - Widespread decrease</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="ae-3" /><Label htmlFor="ae-3" className="text-xs">3 - Absent/minimal</Label></div>
            </RadioGroup>
          </div>

          {/* O2 Saturation */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">O2 Saturation (Room Air)</Label>
            <RadioGroup value={o2Sat.toString()} onValueChange={(v) => setO2Sat(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="o2-0" /><Label htmlFor="o2-0" className="text-xs">0 - ≥95%</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="o2-1" /><Label htmlFor="o2-1" className="text-xs">1 - 92-94%</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="o2-2" /><Label htmlFor="o2-2" className="text-xs">2 - &lt;92%</Label></div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 ${total >= 8 ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : total >= 4 ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30' : 'border-green-300 bg-green-50 dark:bg-green-950/30'}`}>
        <CardContent className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">PRAM Score</p>
          <p className="text-5xl font-mono font-bold">{total}/12</p>
          <p className="text-sm mt-2 font-medium">
            {total >= 8 ? "Severe (≥8)" : total >= 4 ? "Moderate (4-7)" : "Mild (0-3)"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Westley Croup Score
const WestleyScoring = () => {
  const [stridor, setStridor] = useState(0);
  const [retractions, setRetractions] = useState(0);
  const [airEntry, setAirEntry] = useState(0);
  const [cyanosis, setCyanosis] = useState(0);
  const [consciousness, setConsciousness] = useState(0);

  const total = stridor + retractions + airEntry + cyanosis + consciousness;

  return (
    <div className="space-y-4">
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Westley Croup Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Stridor</Label>
            <RadioGroup value={stridor.toString()} onValueChange={(v) => setStridor(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="str-0" /><Label htmlFor="str-0" className="text-xs">0 - None</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="str-1" /><Label htmlFor="str-1" className="text-xs">1 - When agitated</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="str-2" /><Label htmlFor="str-2" className="text-xs">2 - At rest</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Retractions</Label>
            <RadioGroup value={retractions.toString()} onValueChange={(v) => setRetractions(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="ret-0" /><Label htmlFor="ret-0" className="text-xs">0 - None</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="ret-1" /><Label htmlFor="ret-1" className="text-xs">1 - Mild</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="ret-2" /><Label htmlFor="ret-2" className="text-xs">2 - Moderate</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="ret-3" /><Label htmlFor="ret-3" className="text-xs">3 - Severe</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Air Entry</Label>
            <RadioGroup value={airEntry.toString()} onValueChange={(v) => setAirEntry(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="air-0" /><Label htmlFor="air-0" className="text-xs">0 - Normal</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="air-1" /><Label htmlFor="air-1" className="text-xs">1 - Decreased</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="air-2" /><Label htmlFor="air-2" className="text-xs">2 - Markedly decreased</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Cyanosis</Label>
            <RadioGroup value={cyanosis.toString()} onValueChange={(v) => setCyanosis(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="cy-0" /><Label htmlFor="cy-0" className="text-xs">0 - None</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="4" id="cy-4" /><Label htmlFor="cy-4" className="text-xs">4 - With agitation</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="5" id="cy-5" /><Label htmlFor="cy-5" className="text-xs">5 - At rest</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Level of Consciousness</Label>
            <RadioGroup value={consciousness.toString()} onValueChange={(v) => setConsciousness(parseInt(v))} className="space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="con-0" /><Label htmlFor="con-0" className="text-xs">0 - Normal</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="5" id="con-5" /><Label htmlFor="con-5" className="text-xs">5 - Altered</Label></div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 ${total >= 8 ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : total >= 4 ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30' : 'border-green-300 bg-green-50 dark:bg-green-950/30'}`}>
        <CardContent className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">Westley Score</p>
          <p className="text-5xl font-mono font-bold">{total}/17</p>
          <p className="text-sm mt-2 font-medium">
            {total >= 8 ? "Severe (≥8)" : total >= 4 ? "Moderate (4-7)" : "Mild (≤3)"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Oxygenation Index
const OxygenationIndex = () => {
  const [map, setMap] = useState("");
  const [fio2, setFio2] = useState("");
  const [pao2, setPao2] = useState("");

  const calculateOI = () => {
    const mapVal = parseFloat(map);
    const fio2Val = parseFloat(fio2);
    const pao2Val = parseFloat(pao2);
    if (!mapVal || !fio2Val || !pao2Val) return null;
    return ((mapVal * fio2Val * 100) / pao2Val).toFixed(1);
  };

  const oi = calculateOI();

  const getSeverity = (oiVal) => {
    const val = parseFloat(oiVal);
    if (val < 5) return { label: "Normal", color: "green" };
    if (val < 10) return { label: "Mild", color: "amber" };
    if (val < 20) return { label: "Severe", color: "red" };
    if (val < 40) return { label: "Extreme", color: "red" };
    return { label: "ECMO Referral", color: "red" };
  };

  const severity = oi ? getSeverity(oi) : null;

  return (
    <div className="space-y-4">
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Oxygenation Index (OI)</CardTitle>
          <CardDescription className="text-xs">Assess severity of hypoxic respiratory failure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Mean Airway Pressure (MAP) cmH2O</Label>
            <Input type="number" placeholder="e.g., 15" value={map} onChange={(e) => setMap(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">FiO2 (as decimal, e.g., 0.6)</Label>
            <Input type="number" step="0.01" placeholder="e.g., 0.6" value={fio2} onChange={(e) => setFio2(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">PaO2 (mmHg)</Label>
            <Input type="number" placeholder="e.g., 60" value={pao2} onChange={(e) => setPao2(e.target.value)} className="font-mono" />
          </div>
        </CardContent>
      </Card>

      {oi && severity && (
        <Card className={`border-2 border-${severity.color}-300 bg-${severity.color}-50 dark:bg-${severity.color}-950/30`}>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Oxygenation Index</p>
            <p className="text-5xl font-mono font-bold">{oi}</p>
            <p className="text-sm mt-2 font-medium">{severity.label}</p>
          </CardContent>
        </Card>
      )}

      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• OI = (MAP × FiO2 × 100) / PaO2</p>
          <p>• &lt;5 = Normal</p>
          <p>• &gt;10 = Severe oxygenation problem</p>
          <p>• &gt;20 = Extreme oxygenation problem</p>
          <p>• &gt;40 = ECMO referral</p>
        </CardContent>
      </Card>
    </div>
  );
};

// CPR Page - PALS Algorithms & Drug Dosing
const CPRPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("arrest");
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  // Drug calculations based on weight
  const calculateDrugs = () => {
    if (!w) return null;
    return {
      epinephrine: {
        dose: (w * 0.01).toFixed(3),
        volume1to10000: (w * 0.1).toFixed(2), // 1:10,000 = 0.1mg/mL
        ettDose: (w * 0.1).toFixed(2),
      },
      amiodarone: {
        dose: (w * 5).toFixed(1),
      },
      adenosine: {
        firstDose: Math.min(w * 0.1, 6).toFixed(2),
        secondDose: Math.min(w * 0.2, 12).toFixed(2),
      },
      atropine: {
        dose: Math.max(Math.min(w * 0.02, 0.5), 0.1).toFixed(2),
      },
      defibrillation: {
        first: (w * 2).toFixed(0),
        subsequent: (w * 4).toFixed(0),
      },
      cardioversion: {
        first: (w * 0.5).toFixed(1),
        second: (w * 1).toFixed(0),
      },
      lidocaine: {
        bolus: (w * 1).toFixed(1),
      },
    };
  };

  const drugs = calculateDrugs();

  return (
    <div className="space-y-4 pb-8">
      {/* Weight Input - Always visible */}
      <Card className="nightingale-card border-red-200 dark:border-red-800">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Patient Weight (kg)</Label>
              <Input
                type="number"
                placeholder="Enter weight for drug calculations"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="font-mono mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 text-xs">
          <TabsTrigger value="arrest">Arrest</TabsTrigger>
          <TabsTrigger value="tachy">Tachy</TabsTrigger>
          <TabsTrigger value="brady">Brady</TabsTrigger>
          <TabsTrigger value="drugs">Drugs</TabsTrigger>
        </TabsList>

        {/* Cardiac Arrest Algorithm */}
        <TabsContent value="arrest" className="space-y-3 mt-4">
          <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Cardiac Arrest Algorithm (PALS 2025)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">1. Start CPR Immediately</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Push hard & fast: 100-120/min</li>
                  <li>• Compression-to-ventilation: 15:2 (2 rescuers)</li>
                  <li>• Minimize interruptions (&gt;60% CPR time)</li>
                  <li>• Attach monitor/defibrillator</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Shockable Rhythm */}
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300">
                  <p className="font-bold text-amber-800 dark:text-amber-200 text-center mb-2">VF/pVT (Shockable)</p>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">1.</span>
                      <span>Shock: <span className="font-mono text-amber-700">{drugs ? `${drugs.defibrillation.first}J` : "2 J/kg"}</span></span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">2.</span>
                      <span>CPR 2 min</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">3.</span>
                      <span>Shock: <span className="font-mono text-amber-700">{drugs ? `${drugs.defibrillation.subsequent}J` : "4 J/kg"}</span></span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">4.</span>
                      <span>Epinephrine + CPR</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-amber-600">5.</span>
                      <span>Shock + Amiodarone</span>
                    </li>
                  </ol>
                </div>

                {/* Non-Shockable Rhythm */}
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/50 border border-blue-300">
                  <p className="font-bold text-blue-800 dark:text-blue-200 text-center mb-2">Asystole/PEA</p>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>CPR 2 min</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>Epinephrine ASAP</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>CPR 2 min</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">4.</span>
                      <span>Check rhythm</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-bold text-blue-600">5.</span>
                      <span>Repeat; Epi q3-5min</span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* H's and T's */}
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/50">
                <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Reversible Causes (H's & T's)</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <p className="font-medium text-purple-600">H's:</p>
                    <ul className="space-y-0.5">
                      <li>• Hypoxia</li>
                      <li>• Hypovolemia</li>
                      <li>• H+ (Acidosis)</li>
                      <li>• Hypo/Hyperkalemia</li>
                      <li>• Hypothermia</li>
                      <li>• Hypoglycemia</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-purple-600">T's:</p>
                    <ul className="space-y-0.5">
                      <li>• Tension pneumo</li>
                      <li>• Tamponade</li>
                      <li>• Toxins</li>
                      <li>• Thrombosis (PE)</li>
                      <li>• Thrombosis (coronary)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tachycardia Algorithm */}
        <TabsContent value="tachy" className="space-y-3 mt-4">
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tachycardia with Pulse Algorithm</CardTitle>
              <CardDescription className="text-xs">HR &gt;220 bpm (infant) or &gt;180 bpm (child)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold mb-2">Initial Assessment</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Support ABCs, give O2</li>
                  <li>• Obtain IV/IO access</li>
                  <li>• 12-lead ECG if available</li>
                  <li>• Assess: QRS narrow (&lt;0.09s) or wide (≥0.09s)?</li>
                </ul>
              </div>

              {/* Narrow vs Wide Complex */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950/50 border border-green-300">
                  <p className="font-bold text-green-800 dark:text-green-200 text-center mb-2">Narrow QRS (SVT)</p>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                      <p className="font-medium text-green-700">If STABLE:</p>
                      <p>1. Vagal maneuvers</p>
                      <p>2. Adenosine:</p>
                      <p className="font-mono text-green-600 pl-2">
                        1st: {drugs ? `${drugs.adenosine.firstDose}mg` : "0.1mg/kg (max 6mg)"}
                      </p>
                      <p className="font-mono text-green-600 pl-2">
                        2nd: {drugs ? `${drugs.adenosine.secondDose}mg` : "0.2mg/kg (max 12mg)"}
                      </p>
                    </div>
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <p className="font-medium text-red-700">If UNSTABLE:</p>
                      <p>Synchronized cardioversion</p>
                      <p className="font-mono text-red-600">
                        {drugs ? `${drugs.cardioversion.first}-${drugs.cardioversion.second}J` : "0.5-1 J/kg → 2 J/kg"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300">
                  <p className="font-bold text-red-800 dark:text-red-200 text-center mb-2">Wide QRS (VT)</p>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="p-2 bg-red-200/50 dark:bg-red-900/30 rounded-lg">
                      <p className="font-medium text-red-700">If UNSTABLE or Pulseless:</p>
                      <p>Synchronized cardioversion</p>
                      <p className="font-mono text-red-600">
                        {drugs ? `${drugs.cardioversion.first}-${drugs.cardioversion.second}J` : "0.5-1 J/kg"}
                      </p>
                      <p className="text-xs mt-1">If pulseless → Arrest algorithm</p>
                    </div>
                    <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                      <p className="font-medium text-amber-700">If STABLE:</p>
                      <p>Expert consultation</p>
                      <p>Consider Amiodarone:</p>
                      <p className="font-mono text-amber-600">
                        {drugs ? `${drugs.amiodarone.dose}mg` : "5mg/kg"} IV over 20-60 min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bradycardia Algorithm */}
        <TabsContent value="brady" className="space-y-3 mt-4">
          <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Bradycardia with Pulse Algorithm</CardTitle>
              <CardDescription className="text-xs">HR &lt;60 bpm with cardiopulmonary compromise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold mb-2">Initial Steps</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Support ABCs, give O2</li>
                  <li>• Attach monitor, IV/IO access</li>
                  <li>• If HR &lt;60 with poor perfusion → Start CPR</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                <p className="font-semibold text-blue-700 mb-2">If Persistent Bradycardia + Compromise:</p>
                <ol className="space-y-2 text-muted-foreground">
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-blue-600">1. Epinephrine</span>
                    <p className="font-mono text-blue-600">
                      IV/IO: {drugs ? `${drugs.epinephrine.dose}mg` : "0.01mg/kg"} ({drugs ? `${drugs.epinephrine.volume1to10000}mL` : "0.1mL/kg"} of 1:10,000)
                    </p>
                    <p className="text-xs text-muted-foreground">Repeat every 3-5 minutes</p>
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-blue-600">2. Atropine</span> (if increased vagal tone or AV block)
                    <p className="font-mono text-blue-600">
                      {drugs ? `${drugs.atropine.dose}mg` : "0.02mg/kg"} IV/IO (min 0.1mg, max 0.5mg)
                    </p>
                    <p className="text-xs text-muted-foreground">May repeat once</p>
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-blue-600">3. Consider pacing</span> if unresponsive to medications
                  </li>
                </ol>
              </div>

              {/* Normal HR by Age */}
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50">
                <p className="font-semibold mb-2">Normal Heart Rate by Age</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Newborn</p>
                    <p className="font-mono">80-205 bpm</p>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Infant</p>
                    <p className="font-mono">75-190 bpm</p>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Child (1-10y)</p>
                    <p className="font-mono">60-140 bpm</p>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Adolescent</p>
                    <p className="font-mono">50-100 bpm</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drug Doses Summary */}
        <TabsContent value="drugs" className="space-y-3 mt-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">PALS Drug Doses</CardTitle>
              <CardDescription className="text-xs">
                {w ? `Calculated for ${w} kg` : "Enter weight above for calculations"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Epinephrine */}
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Epinephrine (1:10,000)</p>
                    <p className="text-xs text-muted-foreground">Cardiac arrest, bradycardia</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">0.01 mg/kg IV/IO</p>
                    {drugs && (
                      <>
                        <p className="font-mono text-red-600 font-bold">{drugs.epinephrine.dose} mg</p>
                        <p className="font-mono text-red-600 text-sm">({drugs.epinephrine.volume1to10000} mL)</p>
                      </>
                    )}
                  </div>
                </div>
                {drugs && (
                  <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                    ETT: {drugs.epinephrine.ettDose} mg (0.1 mg/kg)
                  </p>
                )}
              </div>

              {/* Amiodarone */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Amiodarone</p>
                    <p className="text-xs text-muted-foreground">VF/pVT, stable VT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">5 mg/kg IV/IO</p>
                    {drugs && <p className="font-mono text-amber-600 font-bold">{drugs.amiodarone.dose} mg</p>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Arrest: rapid push. Stable: over 20-60 min</p>
              </div>

              {/* Adenosine */}
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Adenosine</p>
                    <p className="text-xs text-muted-foreground">SVT (rapid IV push + flush)</p>
                  </div>
                  <div className="text-right">
                    {drugs ? (
                      <>
                        <p className="text-xs text-muted-foreground">1st: 0.1mg/kg (max 6mg)</p>
                        <p className="font-mono text-green-600 font-bold">{drugs.adenosine.firstDose} mg</p>
                        <p className="text-xs text-muted-foreground mt-1">2nd: 0.2mg/kg (max 12mg)</p>
                        <p className="font-mono text-green-600 font-bold">{drugs.adenosine.secondDose} mg</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs">1st: 0.1 mg/kg (max 6mg)</p>
                        <p className="text-xs">2nd: 0.2 mg/kg (max 12mg)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Atropine */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Atropine</p>
                    <p className="text-xs text-muted-foreground">Bradycardia (vagal/AV block)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">0.02 mg/kg IV/IO</p>
                    {drugs && <p className="font-mono text-blue-600 font-bold">{drugs.atropine.dose} mg</p>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Min 0.1mg, Max 0.5mg/dose</p>
              </div>

              {/* Defibrillation/Cardioversion */}
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30">
                <p className="font-semibold text-sm mb-2">Energy Doses</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Defibrillation</p>
                    <p className="text-muted-foreground">1st: 2 J/kg</p>
                    {drugs && <p className="font-mono text-purple-600">{drugs.defibrillation.first} J</p>}
                    <p className="text-muted-foreground">2nd+: 4 J/kg</p>
                    {drugs && <p className="font-mono text-purple-600">{drugs.defibrillation.subsequent} J</p>}
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">Cardioversion</p>
                    <p className="text-muted-foreground">0.5-1 J/kg → 2 J/kg</p>
                    {drugs && <p className="font-mono text-purple-600">{drugs.cardioversion.first}-{drugs.cardioversion.second} J</p>}
                  </div>
                </div>
              </div>

              {/* Lidocaine */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Lidocaine (alternative)</p>
                    <p className="text-xs text-muted-foreground">VF/pVT if amiodarone unavailable</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">1 mg/kg IV/IO bolus</p>
                    {drugs && <p className="font-mono text-gray-600 font-bold">{drugs.lidocaine.bolus} mg</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reference */}
          <Card className="nightingale-card">
            <CardContent className="pt-4 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Reference: AHA PALS Guidelines 2025</p>
              <p>• Epinephrine repeat: every 3-5 minutes</p>
              <p>• CPR quality: 100-120/min, &gt;60% of time</p>
              <p>• DBP target: ≥25 mmHg (infant), ≥30 mmHg (child)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Approaches Page - Placeholder
const ApproachesPage = ({ onBack }) => (
  <div className="space-y-4 pb-8">
    <Card className="nightingale-card">
      <CardHeader>
        <CardTitle>Clinical Approaches</CardTitle>
        <CardDescription>Coming in next phase - DKA, Status Epilepticus, Hyperammonemia, Hypocalcemia</CardDescription>
      </CardHeader>
    </Card>
  </div>
);

// Drugs Page - Placeholder
const DrugsPage = ({ onBack }) => (
  <div className="space-y-4 pb-8">
    <Card className="nightingale-card">
      <CardHeader>
        <CardTitle>Commonly Used Drugs</CardTitle>
        <CardDescription>Coming in next phase - Harriet Lane reference</CardDescription>
      </CardHeader>
    </Card>
  </div>
);

export default ChildrenDashboard;
