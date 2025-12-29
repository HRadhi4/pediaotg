import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Settings, X, Activity, Syringe, Heart, Brain, Calculator, Pill, Droplets, Users, Home, Stethoscope, Scale, Zap, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Layout from "@/components/Layout";

// Children Dashboard - Similar structure to NICU
const ChildrenDashboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState(page || "main");
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Widget management with localStorage persistence
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem("childrenWidgets");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading widgets:", e);
      }
    }
    return [
      { id: "bp", title: "Blood Pressure", icon: "activity", color: "red", enabled: true },
      { id: "infusions", title: "Infusions", icon: "syringe", color: "blue", enabled: true },
      { id: "intubation", title: "Intubation", icon: "stethoscope", color: "purple", enabled: true },
      { id: "insensible", title: "Insensible Water Loss", icon: "droplets", color: "teal", enabled: true },
    ];
  });

  // Save widgets to localStorage when changed
  useEffect(() => {
    localStorage.setItem("childrenWidgets", JSON.stringify(widgets));
  }, [widgets]);

  // Active widget for inline display
  const [activeWidget, setActiveWidget] = useState(null);

  const handleWidgetClick = (widgetId) => {
    if (isEditMode) return;
    setActiveWidget(widgetId);
  };

  const moveWidget = (index, direction) => {
    const newWidgets = [...widgets];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < widgets.length) {
      [newWidgets[index], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[index]];
      setWidgets(newWidgets);
    }
  };

  const getWidgetIcon = (iconName, color) => {
    const colorClass = {
      teal: "text-[#00d9c5]",
      blue: "text-blue-500",
      red: "text-red-500",
      purple: "text-purple-500",
      amber: "text-amber-500"
    }[color] || "text-gray-500";

    switch(iconName) {
      case "activity": return <Activity className={`h-6 w-6 ${colorClass}`} />;
      case "syringe": return <Syringe className={`h-6 w-6 ${colorClass}`} />;
      case "stethoscope": return <Stethoscope className={`h-6 w-6 ${colorClass}`} />;
      case "droplets": return <Droplets className={`h-6 w-6 ${colorClass}`} />;
      case "heart": return <Heart className={`h-6 w-6 ${colorClass}`} />;
      case "brain": return <Brain className={`h-6 w-6 ${colorClass}`} />;
      case "calculator": return <Calculator className={`h-6 w-6 ${colorClass}`} />;
      case "pill": return <Pill className={`h-6 w-6 ${colorClass}`} />;
      default: return <Users className={`h-6 w-6 ${colorClass}`} />;
    }
  };

  // Page navigation items
  const pages = [
    { id: "main", label: "Main", icon: Home },
    { id: "scoring", label: "Scoring", icon: Calculator },
    { id: "cpr", label: "CPR", icon: Heart },
    { id: "approaches", label: "Approaches", icon: FileText },
    { id: "drugs", label: "Drugs", icon: Pill },
  ];

  // Render page content based on current page
  const renderPageContent = () => {
    switch(currentPage) {
      case "scoring":
        return <ScoringPage theme={theme} />;
      case "cpr":
        return <CPRPage theme={theme} />;
      case "approaches":
        return <ApproachesPage theme={theme} />;
      case "drugs":
        return <DrugsPage theme={theme} />;
      default:
        return renderMainWidgets();
    }
  };

  const renderMainWidgets = () => (
    <>
      {isEditMode && (
        <div className="mb-4 p-3 rounded-xl bg-[#00d9c5]/10 border border-[#00d9c5]/30 text-sm text-center">
          Tap arrows to rearrange widgets. Tap ✕ when done.
        </div>
      )}

      {/* Active Widget Display (Inline, not popup) */}
      {activeWidget && (
        <Card className="mb-6 nightingale-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {widgets.find(w => w.id === activeWidget)?.title}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setActiveWidget(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[60vh]">
              {activeWidget === "bp" && <BPTableWidget />}
              {activeWidget === "infusions" && <InfusionsWidget />}
              {activeWidget === "intubation" && <ChildIntubationWidget />}
              {activeWidget === "insensible" && <InsensibleWaterLossWidget />}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Widget Grid */}
      <div className="grid grid-cols-2 gap-4">
        {widgets.filter(w => w.enabled).map((widget, index) => (
          <Card
            key={widget.id}
            onClick={() => handleWidgetClick(widget.id)}
            className={`nightingale-card cursor-pointer transition-all duration-300 ${
              isEditMode ? 'animate-wiggle' : 'hover:scale-[1.02]'
            } ${activeWidget === widget.id ? 'ring-2 ring-[#00d9c5]' : ''}`}
            data-testid={`widget-${widget.id}`}
          >
            <CardContent className="p-4 relative">
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveWidget(index, "up"); }}
                    disabled={index === 0}
                    className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveWidget(index, "down"); }}
                    disabled={index === widgets.length - 1}
                    className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3`}
                  style={{ backgroundColor: widget.color === 'teal' ? 'rgba(0,217,197,0.1)' : `rgba(var(--${widget.color}-rgb), 0.1)` }}
                >
                  {getWidgetIcon(widget.icon, widget.color)}
                </div>
                <h3 className="font-heading font-semibold text-sm">{widget.title}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-header pl-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground tracking-tight">
                Children
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Pediatric Ward</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentPage === "main" && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isEditMode 
                    ? 'bg-[#00d9c5] text-gray-900' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {isEditMode ? <X className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Page Navigation Tabs */}
      <div className="fixed top-16 left-0 right-0 z-30 bg-background/80 backdrop-blur-sm border-b pl-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => { setCurrentPage(p.id); setActiveWidget(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  currentPage === p.id
                    ? 'bg-[#00d9c5] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <p.icon className="h-4 w-4" />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 pt-32 pb-8">
        {renderPageContent()}
      </main>
    </Layout>
  );
};

// BP Table Widget - Children BP by Age (50th percentile at 50th height)
const BPTableWidget = () => {
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
    <div className="space-y-4">
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

      {/* Results */}
      {selectedData && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200">
            <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">50th Percentile (Normal)</p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Systolic</p>
                <p className="text-xl font-mono font-bold">{selectedData.systolic.p50}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Diastolic</p>
                <p className="text-xl font-mono font-bold">{selectedData.diastolic.p50}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-2">90th Percentile (Pre-HTN)</p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Systolic</p>
                <p className="text-xl font-mono font-bold">{selectedData.systolic.p90}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Diastolic</p>
                <p className="text-xl font-mono font-bold">{selectedData.diastolic.p90}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200">
            <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-2">95th/99th Percentile (HTN)</p>
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
          </div>
        </div>
      )}

      {/* Reference */}
      <div className="text-xs text-muted-foreground">
        <p>• Values at 50th height percentile</p>
        <p>• HTN Stage 1: ≥95th to &lt;99th + 5mmHg</p>
        <p>• HTN Stage 2: ≥99th + 5mmHg</p>
      </div>
    </div>
  );
};

// Infusions Widget
const InfusionsWidget = () => {
  const [weight, setWeight] = useState("");

  const infusions = [
    {
      category: "Neuromuscular Blockade",
      drugs: [
        {
          name: "Cisatracurium (Nimbex)",
          stat: "0.1-0.2 mg/kg",
          infusion: "1-4 mcg/kg/min (0.06-0.24 mg/kg/hr)",
          calculate: (w) => ({
            stat: `${(w * 0.1).toFixed(2)} - ${(w * 0.2).toFixed(2)} mg`,
            infusion: `${(w * 0.06).toFixed(2)} - ${(w * 0.24).toFixed(2)} mg/hr`
          })
        }
      ]
    },
    {
      category: "Sedatives",
      drugs: [
        {
          name: "Midazolam",
          stat: "0.1 mg/kg",
          infusion: "0.1-0.5 mg/kg/hr or 0-20 mcg/kg/hr",
          calculate: (w) => ({
            stat: `${(w * 0.1).toFixed(2)} mg`,
            infusion: `${(w * 0.1).toFixed(2)} - ${(w * 0.5).toFixed(2)} mg/hr`
          })
        },
        {
          name: "Fentanyl",
          stat: "1 mcg/kg",
          infusion: "1-5 mcg/kg/hr",
          calculate: (w) => ({
            stat: `${(w * 1).toFixed(1)} mcg`,
            infusion: `${(w * 1).toFixed(1)} - ${(w * 5).toFixed(1)} mcg/hr`
          })
        }
      ]
    },
    {
      category: "Diuretics",
      drugs: [
        {
          name: "Furosemide (Lasix)",
          stat: "0.5-1 mg/kg (Max: 40mg)",
          infusion: "0.1-1 mg/kg/hr",
          calculate: (w) => ({
            stat: `${Math.min(w * 0.5, 40).toFixed(1)} - ${Math.min(w * 1, 40).toFixed(1)} mg`,
            infusion: `${(w * 0.1).toFixed(2)} - ${(w * 1).toFixed(2)} mg/hr`
          })
        }
      ]
    },
    {
      category: "Bronchodilator",
      drugs: [
        {
          name: "Ventolin Infusion",
          stat: "-",
          infusion: "0.3 mg/kg/hr",
          calculate: (w) => ({
            stat: "-",
            infusion: `${(w * 0.3).toFixed(2)} mg/hr`
          })
        }
      ]
    },
    {
      category: "Inotropic Support",
      drugs: [
        { name: "Dopamine", range: "0-20 mcg/kg/min", calculate: (w) => `0 - ${(w * 20 * 60 / 1000).toFixed(2)} mg/hr` },
        { name: "Dobutamine", range: "0-20 mcg/kg/min", calculate: (w) => `0 - ${(w * 20 * 60 / 1000).toFixed(2)} mg/hr` },
        { name: "Epinephrine", range: "0-0.5 mcg/kg/min", calculate: (w) => `0 - ${(w * 0.5 * 60).toFixed(1)} mcg/hr` },
        { name: "Norepinephrine", range: "0-0.5 mcg/kg/min", calculate: (w) => `0 - ${(w * 0.5 * 60).toFixed(1)} mcg/hr` },
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Weight (kg)</Label>
        <Input
          type="number"
          placeholder="e.g., 15"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="font-mono"
        />
      </div>

      {infusions.map((category, idx) => (
        <Card key={idx} className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{category.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {category.drugs.map((drug, dIdx) => (
              <div key={dIdx} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <p className="font-medium text-sm">{drug.name}</p>
                {drug.stat && drug.infusion ? (
                  <div className="mt-1 text-xs space-y-1">
                    <p><span className="text-muted-foreground">Stat:</span> {drug.stat} {weight && drug.calculate ? `→ ${drug.calculate(parseFloat(weight)).stat}` : ''}</p>
                    <p><span className="text-muted-foreground">Infusion:</span> {drug.infusion} {weight && drug.calculate ? `→ ${drug.calculate(parseFloat(weight)).infusion}` : ''}</p>
                  </div>
                ) : (
                  <div className="mt-1 text-xs">
                    <p><span className="text-muted-foreground">Range:</span> {drug.range} {weight ? `→ ${drug.calculate(parseFloat(weight))}` : ''}</p>
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

// Child Intubation Widget
const ChildIntubationWidget = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");

  // ETT size for children: (Age/4) + 4 (uncuffed) or (Age/4) + 3.5 (cuffed)
  const calculateETT = () => {
    const ageNum = parseFloat(age);
    if (!ageNum) return null;
    
    const uncuffed = (ageNum / 4) + 4;
    const cuffed = (ageNum / 4) + 3.5;
    const depth = (ageNum / 2) + 12; // Depth at lip
    
    return {
      uncuffed: uncuffed.toFixed(1),
      cuffed: cuffed.toFixed(1),
      depth: depth.toFixed(1)
    };
  };

  const ettResult = calculateETT();

  // RSI Checklist based on 6 P's
  const rsiChecklist = [
    {
      p: "Preparation",
      items: [
        "Monitoring: SpO2, ECG, BP, EtCO2",
        "IV access confirmed",
        "Suction ready",
        "Bag-mask ventilation ready",
        "ETT + stylet ready (size + 0.5 backup)",
        "Laryngoscope checked",
        "Drugs drawn up"
      ]
    },
    {
      p: "Preoxygenation",
      items: [
        "100% O2 for 3-5 minutes",
        "Avoid positive pressure if possible",
        "Target SpO2 >95%"
      ]
    },
    {
      p: "Pretreatment",
      items: [
        "Atropine 0.02 mg/kg (min 0.1mg, max 0.5mg) - for <1yr or bradycardia risk",
        "Consider Lidocaine 1.5 mg/kg IV for ↑ICP"
      ]
    },
    {
      p: "Paralysis with Induction",
      drugs: [
        { name: "Ketamine", dose: "1-2 mg/kg IV", note: "Hemodynamically stable, bronchodilator" },
        { name: "Midazolam", dose: "0.1-0.3 mg/kg IV", note: "May cause hypotension" },
        { name: "Fentanyl", dose: "2-3 mcg/kg IV", note: "Hemodynamically stable" },
        { name: "Propofol", dose: "1-3 mg/kg IV", note: "May cause hypotension" },
        { name: "Cisatracurium (Nimbex)", dose: "0.15-0.2 mg/kg IV", note: "Paralytic - onset 2-3 min" },
      ]
    },
    {
      p: "Positioning",
      items: [
        "Sniffing position (infant: neutral)",
        "External laryngeal manipulation if needed",
        "Bougie/stylet if difficult view"
      ]
    },
    {
      p: "Placement Confirmation",
      items: [
        "Direct visualization of cords",
        "EtCO2 waveform (gold standard)",
        "Bilateral breath sounds",
        "Chest rise",
        "SpO2 stable/improving",
        "CXR for depth confirmation"
      ]
    }
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="calculator">Calculator</TabsTrigger>
        <TabsTrigger value="rsi">RSI Checklist</TabsTrigger>
      </TabsList>

      <TabsContent value="calculator" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Age (years)</Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              placeholder="Optional"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        {ettResult && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 text-center">
              <p className="text-sm text-muted-foreground mb-1">ETT Size (Uncuffed)</p>
              <p className="text-3xl font-mono font-bold text-purple-600">{ettResult.uncuffed} mm</p>
              <p className="text-xs text-muted-foreground mt-1">(Age/4) + 4</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 text-center">
                <p className="text-xs text-muted-foreground">Cuffed ETT</p>
                <p className="text-xl font-mono font-bold text-blue-600">{ettResult.cuffed} mm</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 text-center">
                <p className="text-xs text-muted-foreground">Depth at Lip</p>
                <p className="text-xl font-mono font-bold text-green-600">{ettResult.depth} cm</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>• Uncuffed: (Age/4) + 4</p>
          <p>• Cuffed: (Age/4) + 3.5</p>
          <p>• Depth: (Age/2) + 12</p>
        </div>
      </TabsContent>

      <TabsContent value="rsi" className="space-y-3">
        {rsiChecklist.map((section, idx) => (
          <Card key={idx} className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#00d9c5]">{idx + 1}. {section.p}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items && section.items.map((item, i) => (
                <p key={i} className="text-xs">• {item}</p>
              ))}
              {section.drugs && section.drugs.map((drug, i) => (
                <div key={i} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs">
                  <p className="font-medium">{drug.name}: {drug.dose}</p>
                  <p className="text-muted-foreground">{drug.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};

// Insensible Water Loss Widget
const InsensibleWaterLossWidget = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) return null;

    const bsa = Math.sqrt((w * h) / 3600);
    const iwl = 400 * bsa;

    return {
      bsa: bsa.toFixed(3),
      iwl: iwl.toFixed(1)
    };
  };

  const result = calculate();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Weight (kg)</Label>
          <Input
            type="number"
            placeholder="e.g., 15"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label>Height (cm)</Label>
          <Input
            type="number"
            placeholder="e.g., 100"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="font-mono"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 text-center">
            <p className="text-sm text-muted-foreground mb-1">Insensible Water Loss</p>
            <p className="text-3xl font-mono font-bold text-[#00d9c5]">{result.iwl} ml/day</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
            <p className="text-xs text-muted-foreground">Body Surface Area</p>
            <p className="text-xl font-mono font-bold">{result.bsa} m²</p>
          </div>
        </div>
      )}

      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs space-y-1">
        <p className="font-medium">Formulas:</p>
        <p>• IWL = 400 × BSA</p>
        <p>• BSA = √(Weight × Height / 3600)</p>
      </div>
    </div>
  );
};

// Placeholder pages - to be expanded
const ScoringPage = ({ theme }) => (
  <div className="space-y-4">
    <h2 className="font-heading text-xl font-bold">Scoring Systems</h2>
    <p className="text-muted-foreground">GCS, PRAM, Westley, Oxygenation Index - Coming in next phase</p>
  </div>
);

const CPRPage = ({ theme }) => (
  <div className="space-y-4">
    <h2 className="font-heading text-xl font-bold">CPR & PALS</h2>
    <p className="text-muted-foreground">PALS drugs and algorithms - Coming in next phase</p>
  </div>
);

const ApproachesPage = ({ theme }) => (
  <div className="space-y-4">
    <h2 className="font-heading text-xl font-bold">Clinical Approaches</h2>
    <p className="text-muted-foreground">DKA, Status Epilepticus, Hyperammonemia, Hypocalcemia - Coming in next phase</p>
  </div>
);

const DrugsPage = ({ theme }) => (
  <div className="space-y-4">
    <h2 className="font-heading text-xl font-bold">Commonly Used Drugs</h2>
    <p className="text-muted-foreground">Harriet Lane reference - Coming in next phase</p>
  </div>
);

export default ChildrenDashboard;
