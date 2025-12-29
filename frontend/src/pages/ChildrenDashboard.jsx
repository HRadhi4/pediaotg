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

  // BP data from Harriet Lane Handbook 23rd Edition - includes all percentiles
  const bpData = {
    boys: [
      { age: "1", systolic: { p5: 80, p10: 81, p50: 85, p90: 88, p95: 89, p99: 105 }, diastolic: { p5: 34, p10: 35, p50: 37, p90: 39, p95: 39, p99: 61 } },
      { age: "2", systolic: { p5: 84, p10: 85, p50: 88, p90: 92, p95: 92, p99: 109 }, diastolic: { p5: 39, p10: 40, p50: 42, p90: 44, p95: 44, p99: 66 } },
      { age: "3", systolic: { p5: 86, p10: 87, p50: 91, p90: 94, p95: 95, p99: 111 }, diastolic: { p5: 44, p10: 44, p50: 46, p90: 48, p95: 48, p99: 71 } },
      { age: "4", systolic: { p5: 88, p10: 89, p50: 93, p90: 96, p95: 97, p99: 113 }, diastolic: { p5: 47, p10: 48, p50: 50, p90: 51, p95: 52, p99: 74 } },
      { age: "5", systolic: { p5: 90, p10: 91, p50: 95, p90: 98, p95: 98, p99: 115 }, diastolic: { p5: 50, p10: 51, p50: 53, p90: 55, p95: 55, p99: 77 } },
      { age: "6", systolic: { p5: 91, p10: 92, p50: 96, p90: 99, p95: 100, p99: 116 }, diastolic: { p5: 53, p10: 53, p50: 55, p90: 57, p95: 57, p99: 80 } },
      { age: "7", systolic: { p5: 92, p10: 94, p50: 97, p90: 100, p95: 101, p99: 117 }, diastolic: { p5: 55, p10: 55, p50: 57, p90: 59, p95: 59, p99: 82 } },
      { age: "8", systolic: { p5: 94, p10: 95, p50: 99, p90: 102, p95: 102, p99: 119 }, diastolic: { p5: 56, p10: 57, p50: 59, p90: 60, p95: 61, p99: 83 } },
      { age: "9", systolic: { p5: 95, p10: 96, p50: 100, p90: 103, p95: 104, p99: 120 }, diastolic: { p5: 57, p10: 58, p50: 60, p90: 61, p95: 62, p99: 84 } },
      { age: "10", systolic: { p5: 97, p10: 98, p50: 102, p90: 105, p95: 106, p99: 122 }, diastolic: { p5: 58, p10: 59, p50: 61, p90: 62, p95: 63, p99: 85 } },
      { age: "11", systolic: { p5: 99, p10: 100, p50: 104, p90: 107, p95: 107, p99: 124 }, diastolic: { p5: 59, p10: 59, p50: 61, p90: 63, p95: 63, p99: 86 } },
      { age: "12", systolic: { p5: 101, p10: 102, p50: 106, p90: 109, p95: 110, p99: 126 }, diastolic: { p5: 59, p10: 60, p50: 62, p90: 63, p95: 64, p99: 86 } },
      { age: "13", systolic: { p5: 104, p10: 105, p50: 108, p90: 111, p95: 112, p99: 128 }, diastolic: { p5: 60, p10: 60, p50: 62, p90: 64, p95: 64, p99: 87 } },
      { age: "14", systolic: { p5: 106, p10: 107, p50: 111, p90: 114, p95: 115, p99: 131 }, diastolic: { p5: 60, p10: 61, p50: 63, p90: 65, p95: 65, p99: 87 } },
      { age: "15", systolic: { p5: 109, p10: 110, p50: 113, p90: 117, p95: 117, p99: 134 }, diastolic: { p5: 61, p10: 62, p50: 64, p90: 66, p95: 66, p99: 88 } },
      { age: "16", systolic: { p5: 111, p10: 112, p50: 116, p90: 119, p95: 120, p99: 136 }, diastolic: { p5: 63, p10: 63, p50: 65, p90: 67, p95: 67, p99: 90 } },
      { age: "17", systolic: { p5: 114, p10: 115, p50: 118, p90: 121, p95: 122, p99: 139 }, diastolic: { p5: 65, p10: 66, p50: 67, p90: 69, p95: 70, p99: 92 } },
    ],
    girls: [
      { age: "1", systolic: { p5: 83, p10: 84, p50: 86, p90: 89, p95: 90, p99: 108 }, diastolic: { p5: 38, p10: 39, p50: 40, p90: 41, p95: 42, p99: 64 } },
      { age: "2", systolic: { p5: 85, p10: 85, p50: 88, p90: 91, p95: 91, p99: 109 }, diastolic: { p5: 43, p10: 44, p50: 45, p90: 46, p95: 47, p99: 69 } },
      { age: "3", systolic: { p5: 86, p10: 87, p50: 89, p90: 92, p95: 93, p99: 111 }, diastolic: { p5: 47, p10: 48, p50: 49, p90: 50, p95: 51, p99: 73 } },
      { age: "4", systolic: { p5: 88, p10: 88, p50: 91, p90: 94, p95: 94, p99: 112 }, diastolic: { p5: 50, p10: 50, p50: 52, p90: 53, p95: 54, p99: 76 } },
      { age: "5", systolic: { p5: 89, p10: 90, p50: 93, p90: 95, p95: 96, p99: 114 }, diastolic: { p5: 52, p10: 53, p50: 54, p90: 55, p95: 56, p99: 78 } },
      { age: "6", systolic: { p5: 91, p10: 92, p50: 94, p90: 97, p95: 98, p99: 115 }, diastolic: { p5: 54, p10: 54, p50: 56, p90: 57, p95: 58, p99: 80 } },
      { age: "7", systolic: { p5: 93, p10: 93, p50: 96, p90: 99, p95: 99, p99: 117 }, diastolic: { p5: 55, p10: 56, p50: 57, p90: 58, p95: 59, p99: 81 } },
      { age: "8", systolic: { p5: 95, p10: 95, p50: 98, p90: 100, p95: 101, p99: 119 }, diastolic: { p5: 57, p10: 57, p50: 58, p90: 60, p95: 60, p99: 82 } },
      { age: "9", systolic: { p5: 96, p10: 97, p50: 100, p90: 102, p95: 103, p99: 121 }, diastolic: { p5: 58, p10: 58, p50: 59, p90: 61, p95: 61, p99: 83 } },
      { age: "10", systolic: { p5: 98, p10: 99, p50: 102, p90: 104, p95: 105, p99: 123 }, diastolic: { p5: 59, p10: 59, p50: 60, p90: 62, p95: 62, p99: 84 } },
      { age: "11", systolic: { p5: 100, p10: 101, p50: 103, p90: 106, p95: 107, p99: 125 }, diastolic: { p5: 60, p10: 60, p50: 61, p90: 63, p95: 63, p99: 85 } },
      { age: "12", systolic: { p5: 102, p10: 103, p50: 105, p90: 108, p95: 109, p99: 127 }, diastolic: { p5: 61, p10: 61, p50: 62, p90: 64, p95: 64, p99: 86 } },
      { age: "13", systolic: { p5: 104, p10: 105, p50: 107, p90: 110, p95: 110, p99: 128 }, diastolic: { p5: 62, p10: 62, p50: 63, p90: 65, p95: 65, p99: 87 } },
      { age: "14", systolic: { p5: 106, p10: 106, p50: 109, p90: 111, p95: 112, p99: 130 }, diastolic: { p5: 63, p10: 63, p50: 64, p90: 66, p95: 66, p99: 88 } },
      { age: "15", systolic: { p5: 107, p10: 108, p50: 110, p90: 113, p95: 113, p99: 131 }, diastolic: { p5: 64, p10: 64, p50: 65, p90: 67, p95: 67, p99: 89 } },
      { age: "16", systolic: { p5: 108, p10: 108, p50: 111, p90: 114, p95: 114, p99: 132 }, diastolic: { p5: 64, p10: 64, p50: 66, p90: 67, p95: 68, p99: 90 } },
      { age: "17", systolic: { p5: 108, p10: 109, p50: 111, p90: 114, p95: 115, p99: 133 }, diastolic: { p5: 64, p10: 65, p50: 66, p90: 67, p95: 68, p99: 90 } },
    ]
  };

  const selectedData = selectedAge ? bpData[gender].find(d => d.age === selectedAge) : null;

  return (
    <div className="space-y-4 pb-8">
      <Card className="nightingale-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Blood Pressure by Age</CardTitle>
          <CardDescription>Harriet Lane Handbook 23rd Edition</CardDescription>
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
          {/* Low BP - Below 50th percentile */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">Below 50th Percentile (Low)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-900/50">
                  <p className="text-xs text-muted-foreground text-center mb-1">Systolic</p>
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-xs text-blue-600">5th</p>
                      <p className="text-lg font-mono font-bold">{selectedData.systolic.p5}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600">10th</p>
                      <p className="text-lg font-mono font-bold">{selectedData.systolic.p10}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-900/50">
                  <p className="text-xs text-muted-foreground text-center mb-1">Diastolic</p>
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-xs text-blue-600">5th</p>
                      <p className="text-lg font-mono font-bold">{selectedData.diastolic.p5}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600">10th</p>
                      <p className="text-lg font-mono font-bold">{selectedData.diastolic.p10}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Normal - 50th percentile */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">50th Percentile (Normal)</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Systolic</p>
                  <p className="text-3xl font-mono font-bold text-green-600">{selectedData.systolic.p50}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diastolic</p>
                  <p className="text-3xl font-mono font-bold text-green-600">{selectedData.diastolic.p50}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Elevated - 90th percentile */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-2">90th Percentile (Elevated)</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Systolic</p>
                  <p className="text-2xl font-mono font-bold text-amber-600">{selectedData.systolic.p90}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diastolic</p>
                  <p className="text-2xl font-mono font-bold text-amber-600">{selectedData.diastolic.p90}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hypertension - 95th / 99th percentile */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-2">95th / 99th Percentile (Hypertension)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-900/50">
                  <p className="text-xs text-muted-foreground text-center mb-1">Systolic</p>
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-xs text-red-600">95th</p>
                      <p className="text-lg font-mono font-bold">{selectedData.systolic.p95}</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600">99th</p>
                      <p className="text-lg font-mono font-bold">{selectedData.systolic.p99}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-900/50">
                  <p className="text-xs text-muted-foreground text-center mb-1">Diastolic</p>
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-xs text-red-600">95th</p>
                      <p className="text-lg font-mono font-bold">{selectedData.diastolic.p95}</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600">99th</p>
                      <p className="text-lg font-mono font-bold">{selectedData.diastolic.p99}</p>
                    </div>
                  </div>
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
          <p className="font-medium">Source: Harriet Lane Handbook 23rd Edition</p>
          <p>• &lt;5th percentile: Hypotension</p>
          <p>• 50th percentile: Normal</p>
          <p>• 90th to &lt;95th: Elevated BP</p>
          <p>• ≥95th to &lt;99th + 5mmHg: HTN Stage 1</p>
          <p>• ≥99th + 5mmHg: HTN Stage 2</p>
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

// Approaches Page - DKA, Status Epilepticus, Hyperammonemia
const ApproachesPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("dka");
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  return (
    <div className="space-y-4 pb-8">
      {/* Weight Input */}
      <Card className="nightingale-card border-teal-200 dark:border-teal-800">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-teal-500" />
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Patient Weight (kg)</Label>
              <Input
                type="number"
                placeholder="Enter weight for calculations"
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
        <TabsList className="grid w-full grid-cols-3 text-xs">
          <TabsTrigger value="dka">DKA</TabsTrigger>
          <TabsTrigger value="se">Status Epilepticus</TabsTrigger>
          <TabsTrigger value="hypernh3">Hyperammonemia</TabsTrigger>
        </TabsList>

        {/* DKA Tab */}
        <TabsContent value="dka" className="space-y-3 mt-4">
          <Card className="border-orange-300 bg-orange-50 dark:bg-orange-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Diabetic Ketoacidosis (DKA)</CardTitle>
              <CardDescription className="text-xs">Salmaniya Medical Complex Guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {/* Diagnostic Criteria */}
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Diagnostic Criteria</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Ketonuria positive</li>
                  <li>• Glucose &gt;11 mmol/L (&gt;200 mg/dL)</li>
                  <li>• pH &lt;7.30</li>
                  <li>• Serum bicarbonate &lt;15 mmol/L</li>
                </ul>
              </div>

              {/* Fluid Management */}
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/50">
                <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Fluid Management</p>
                <p className="text-muted-foreground mb-2">Use 0.9% or 0.45% NS until dextrose added</p>
                <div className="space-y-2">
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <p className="font-medium">If Stable (by weight):</p>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-muted-foreground">
                      <span>&lt;10 kg: 6 mL/kg/hr</span>
                      <span>10-19 kg: 5 mL/kg/hr</span>
                      <span>20-30 kg: 3.5 mL/kg/hr</span>
                      <span>&gt;30 kg: 3 mL/kg/hr</span>
                    </div>
                    {w > 0 && (
                      <p className="font-mono text-blue-600 mt-2">
                        → {w < 10 ? (w * 6).toFixed(0) : w < 20 ? (w * 5).toFixed(0) : w < 30 ? (w * 3.5).toFixed(0) : Math.min(w * 3, 250).toFixed(0)} mL/hr
                      </p>
                    )}
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="font-medium text-red-700">If Shock:</p>
                    <p className="text-muted-foreground">10 mL/kg bolus over 10-20 min, reassess & repeat PRN</p>
                    {w > 0 && <p className="font-mono text-red-600">→ {(w * 10).toFixed(0)} mL bolus</p>}
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 italic">Add dextrose when BG &lt;15 mmol/L (250 mg/dL)</p>
              </div>

              {/* Insulin */}
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950/50">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-2">Insulin</p>
                <div className="space-y-2 text-muted-foreground">
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <p className="font-medium">Continuous Infusion:</p>
                    <p>0.1 units/kg/hr (= 1 mL/kg/hr of 25 units in 250 mL NS)</p>
                    {w > 0 && <p className="font-mono text-green-600">→ {(w * 0.1).toFixed(2)} units/hr ({(w * 1).toFixed(0)} mL/hr)</p>}
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <p className="font-medium">Decrease insulin when:</p>
                    <p>pH &gt;7.30 OR HCO3 &gt;15 mmol/L</p>
                    <p className="text-xs">Decrease by 25-50% q1-2h to 0.02 U/kg/hr</p>
                  </div>
                  <p className="text-xs italic">If BG drops but acidosis persists → increase dextrose, not decrease insulin</p>
                </div>
              </div>

              {/* Potassium */}
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/50">
                <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Potassium</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• If K+ &lt;5.5 mmol/L and patient voiding:</li>
                  <li className="pl-4">Add 40 mEq/L KCl to IV fluid</li>
                  <li>• Target K+: 4-5 mEq/L</li>
                  <li>• If K+ &gt;5.5: use plain IVF</li>
                </ul>
              </div>

              {/* Bicarbonate */}
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50">
                <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Bicarbonate</p>
                <p className="text-muted-foreground"><span className="font-medium">Indication:</span> pH &lt;6.9 ONLY</p>
                <p className="text-muted-foreground"><span className="font-medium">Dose:</span> 1-2 mEq/kg over 1 hour</p>
                {w > 0 && <p className="font-mono text-amber-600">→ {(w * 1).toFixed(0)}-{(w * 2).toFixed(0)} mEq</p>}
                <p className="text-xs text-red-600 mt-1">⚠ Always consult endocrinologist first!</p>
              </div>

              {/* Cerebral Edema */}
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">⚠ Cerebral Edema</p>
                <p className="text-xs text-muted-foreground mb-2">Warning signs: headache, irritability, drowsiness, ↓LOC</p>
                <div className="space-y-1 text-muted-foreground">
                  <p>1. Raise head of bed</p>
                  <p>2. Decrease fluids to 2 L/m²/day</p>
                  <p>3. <span className="font-medium">Mannitol 0.25-0.5 g/kg</span> over 10-15 min</p>
                  {w > 0 && <p className="font-mono text-red-600 pl-4">→ {(w * 0.25).toFixed(1)}-{(w * 0.5).toFixed(1)} g</p>}
                  <p>4. If Na drops: 3% saline 2-4 mL/kg over 10-20 min</p>
                  {w > 0 && <p className="font-mono text-red-600 pl-4">→ {(w * 2).toFixed(0)}-{(w * 4).toFixed(0)} mL</p>}
                  <p>5. Decrease insulin to 0.04-0.05 U/kg/hr</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Epilepticus Tab */}
        <TabsContent value="se" className="space-y-3 mt-4">
          <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Status Epilepticus Protocol</CardTitle>
              <CardDescription className="text-xs">Start medication after 5 minutes of seizure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {/* Initial Steps */}
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Initial Steps</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. ABC: Airway, Breathing, O2, Circulation</li>
                  <li>2. Start IV, collect: Sugar, Ca, Na</li>
                  <li>3. Brief history</li>
                  <li>4. Start medication after 5 minutes</li>
                </ul>
              </div>

              {/* Step 1: Diazepam */}
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/50">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-blue-700 dark:text-blue-300">Step 1: Diazepam (Valium)</p>
                  <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">5 min</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium">IV:</span> 0.2-0.3 mg/kg (max 5 mg/dose)</p>
                  <p><span className="font-medium">PR:</span> 0.5 mg/kg</p>
                  {w > 0 && (
                    <div className="font-mono text-blue-600">
                      <p>→ IV: {(w * 0.2).toFixed(1)}-{Math.min(w * 0.3, 5).toFixed(1)} mg</p>
                      <p>→ PR: {(w * 0.5).toFixed(1)} mg</p>
                    </div>
                  )}
                  <p className="text-red-600">⚠ Total max 10 mg (respiratory depression risk)</p>
                </div>
              </div>

              {/* Step 2: Repeat Diazepam */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-blue-600">Step 2: Repeat Diazepam</p>
                  <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">+5 min</span>
                </div>
                <p className="text-muted-foreground">Same dose if still seizing</p>
              </div>

              {/* Step 3: Phenytoin */}
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-amber-700 dark:text-amber-300">Step 3: Phenytoin</p>
                  <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded">+10 min</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium">Loading:</span> 20 mg/kg IV over 20 min</p>
                  {w > 0 && <p className="font-mono text-amber-600">→ {(w * 20).toFixed(0)} mg over 20 min</p>}
                  <p className="text-red-600">⚠ Max rate: 1 mg/kg/min (arrhythmia risk)</p>
                  <div className="p-2 mt-2 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-amber-300">
                    <p className="text-xs font-medium text-amber-700">Alternatives (if available):</p>
                    <p className="text-xs">• Levetiracetam (Keppra): 40-60 mg/kg IV</p>
                    {w > 0 && <p className="font-mono text-amber-600 text-xs">→ {(w * 40).toFixed(0)}-{(w * 60).toFixed(0)} mg</p>}
                    <p className="text-xs">• Valproate IV: 20-40 mg/kg</p>
                    {w > 0 && <p className="font-mono text-amber-600 text-xs">→ {(w * 20).toFixed(0)}-{(w * 40).toFixed(0)} mg</p>}
                  </div>
                </div>
              </div>

              {/* Step 4: Repeat Phenytoin */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-amber-600">Step 4: Phenytoin 2nd dose</p>
                  <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded">+10 min</span>
                </div>
                <div className="text-muted-foreground">
                  <p>½ dose: 10 mg/kg IV over 10 min</p>
                  {w > 0 && <p className="font-mono text-amber-600">→ {(w * 10).toFixed(0)} mg</p>}
                </div>
              </div>

              {/* Step 5: Phenobarbital */}
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/50">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-purple-700 dark:text-purple-300">Step 5: Phenobarbital</p>
                  <span className="text-xs bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded">+10 min</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium">Loading:</span> 20 mg/kg IV over 10 min</p>
                  {w > 0 && <p className="font-mono text-purple-600">→ {(w * 20).toFixed(0)} mg</p>}
                  <p><span className="font-medium">2nd dose:</span> 10 mg/kg over 10 min</p>
                  {w > 0 && <p className="font-mono text-purple-600">→ {(w * 10).toFixed(0)} mg</p>}
                </div>
              </div>

              {/* Refractory */}
              <div className="p-3 rounded-xl bg-red-200 dark:bg-red-900/50 border border-red-400">
                <p className="font-bold text-red-700 dark:text-red-300 mb-2">⚠ REFRACTORY SEIZURES</p>
                <p className="text-muted-foreground">If still seizing after above steps:</p>
                <p className="font-semibold text-red-700 mt-1">→ General Anesthesia + Intubation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hyperammonemia Tab */}
        <TabsContent value="hypernh3" className="space-y-3 mt-4">
          <Card className="border-purple-300 bg-purple-50 dark:bg-purple-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Hyperammonemia Approach</CardTitle>
              <CardDescription className="text-xs">Diagnostic algorithm and initial management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {/* Initial Assessment */}
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50">
                <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Initial Assessment</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <p className="font-medium text-blue-700">Normal pH / Alkalosis</p>
                    <p className="text-xs">Consider urea cycle defects</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="font-medium text-red-700">Acidosis</p>
                    <p className="text-xs">Consider organic acidemias</p>
                  </div>
                </div>
              </div>

              {/* Diagnostic Pathway */}
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/50">
                <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Diagnostic Pathway (Urea Cycle)</p>
                <div className="space-y-2 text-muted-foreground">
                  <p className="font-medium">Check Plasma Citrulline:</p>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg space-y-1">
                    <p><span className="font-medium text-green-600">↑ Citrulline + ASA present:</span> Argininosuccinic aciduria</p>
                    <p><span className="font-medium text-amber-600">↑ Citrulline + ASA absent:</span> Citrullinemia (ASS deficiency)</p>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <p className="font-medium">↓/Absent Citrulline → Check Urine Orotic Acid:</p>
                    <p className="pl-2"><span className="text-blue-600">Normal/Low:</span> CPS deficiency</p>
                    <p className="pl-2"><span className="text-red-600">High:</span> OTC deficiency</p>
                  </div>
                </div>
              </div>

              {/* Immediate Management */}
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">⚠ Immediate Management</p>
                <ol className="space-y-2 text-muted-foreground">
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">1. Stop protein intake</span>
                    <p className="text-xs">Reduce nitrogen load</p>
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">2. IV Dextrose 10%</span>
                    <p className="text-xs">Prevent catabolism, provide calories</p>
                    {w > 0 && <p className="font-mono text-red-600">→ Maintenance: {(w * 100 / 24).toFixed(0)} mL/hr D10%</p>}
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">3. Ammonia Scavengers</span>
                    <div className="mt-1">
                      <p><span className="font-medium">Sodium Benzoate:</span> 250 mg/kg load, then 250-500 mg/kg/day</p>
                      {w > 0 && <p className="font-mono text-red-600">→ Load: {(w * 0.25).toFixed(1)} g</p>}
                      <p className="mt-1"><span className="font-medium">Sodium Phenylacetate:</span> 250 mg/kg load, then 250-500 mg/kg/day</p>
                    </div>
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">4. L-Arginine</span>
                    <p>200-600 mg/kg/day (for urea cycle defects)</p>
                    {w > 0 && <p className="font-mono text-red-600">→ {(w * 0.2).toFixed(1)}-{(w * 0.6).toFixed(1)} g/day</p>}
                  </li>
                  <li className="p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <span className="font-bold text-red-600">5. Dialysis if severe</span>
                    <p className="text-xs">Consider if NH3 &gt;500 µmol/L or not responding</p>
                  </li>
                </ol>
              </div>

              {/* Labs to Order */}
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50">
                <p className="font-semibold mb-2">Labs to Order</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <p className="font-medium">Blood:</p>
                    <ul className="text-xs space-y-0.5">
                      <li>• Ammonia (on ice)</li>
                      <li>• VBG, Glucose</li>
                      <li>• Lactate</li>
                      <li>• Plasma amino acids</li>
                      <li>• LFTs, Coags</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Urine:</p>
                    <ul className="text-xs space-y-0.5">
                      <li>• Orotic acid</li>
                      <li>• Organic acids</li>
                      <li>• Ketones</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reference */}
              <Card className="nightingale-card">
                <CardContent className="pt-4 text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Normal Ammonia Levels</p>
                  <p>• Newborn: &lt;110 µmol/L</p>
                  <p>• Infant: &lt;80 µmol/L</p>
                  <p>• Child/Adult: &lt;50 µmol/L</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

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
