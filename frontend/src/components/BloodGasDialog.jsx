import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, PenLine, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BloodGasDialog = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("ai");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedValues, setExtractedValues] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [manualValues, setManualValues] = useState({
    pH: "",
    pCO2: "",
    pO2: "",
    HCO3: "",
    BE: "",
    Na: "",
    K: "",
    Cl: "",
    lactate: "",
    albumin: ""
  });
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        
        try {
          const response = await axios.post(`${API}/blood-gas/analyze-image`, {
            image_base64: base64
          });
          
          if (response.data.success && response.data.values) {
            setExtractedValues(response.data.values);
            // Pre-fill manual values for editing
            setManualValues({
              pH: response.data.values.pH?.toString() || "",
              pCO2: response.data.values.pCO2?.toString() || "",
              pO2: response.data.values.pO2?.toString() || "",
              HCO3: response.data.values.HCO3?.toString() || "",
              BE: response.data.values.BE?.toString() || "",
              Na: response.data.values.Na?.toString() || "",
              K: response.data.values.K?.toString() || "",
              Cl: response.data.values.Cl?.toString() || "",
              lactate: response.data.values.lactate?.toString() || "",
              albumin: response.data.values.albumin?.toString() || ""
            });
            toast.success("Values extracted! Please verify and edit if needed.");
          } else {
            toast.error("Could not extract values from image");
          }
        } catch (err) {
          toast.error("Error analyzing image: " + (err.response?.data?.detail || err.message));
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Error reading file");
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    const values = {};
    Object.keys(manualValues).forEach(key => {
      const val = parseFloat(manualValues[key]);
      if (!isNaN(val)) {
        values[key] = val;
      }
    });

    if (!values.pH && !values.HCO3 && !values.pCO2) {
      toast.error("Please enter at least pH, pCO2, or HCO3 values");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/blood-gas/analyze`, { values });
      setAnalysis(response.data);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error("Error analyzing: " + (err.response?.data?.detail || err.message));
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setManualValues(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setExtractedValues(null);
    setAnalysis(null);
    setManualValues({
      pH: "", pCO2: "", pO2: "", HCO3: "", BE: "",
      Na: "", K: "", Cl: "", lactate: "", albumin: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            Blood Gas Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai" data-testid="ai-tab">AI Analysis</TabsTrigger>
            <TabsTrigger value="manual" data-testid="manual-tab">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Upload Blood Gas Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                  <input
                    type="file"
                    ref={cameraInputRef}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isLoading}
                    className="flex-1"
                    data-testid="camera-btn"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1"
                    data-testid="gallery-btn"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Gallery
                  </Button>
                </div>
                
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Analyzing image...</span>
                  </div>
                )}

                {extractedValues && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                      ✓ Values extracted - Edit if needed:
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {extractedValues && (
              <ValuesForm values={manualValues} onChange={handleInputChange} />
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <ValuesForm values={manualValues} onChange={handleInputChange} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={resetForm} className="flex-1">
            Reset
          </Button>
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading}
            className="flex-1"
            data-testid="analyze-btn"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Analyze
          </Button>
        </div>

        {/* Analysis Results */}
        {analysis && <AnalysisResults analysis={analysis} />}
      </DialogContent>
    </Dialog>
  );
};

const ValuesForm = ({ values, onChange }) => {
  const fields = [
    { key: "pH", label: "pH", placeholder: "7.35-7.45" },
    { key: "pCO2", label: "pCO2 (mmHg)", placeholder: "35-45" },
    { key: "pO2", label: "pO2 (mmHg)", placeholder: "80-100" },
    { key: "HCO3", label: "HCO3 (mEq/L)", placeholder: "22-26" },
    { key: "BE", label: "Base Excess", placeholder: "-2 to +2" },
    { key: "Na", label: "Na (mEq/L)", placeholder: "135-145" },
    { key: "K", label: "K (mEq/L)", placeholder: "3.5-5.0" },
    { key: "Cl", label: "Cl (mEq/L)", placeholder: "98-106" },
    { key: "lactate", label: "Lactate (mmol/L)", placeholder: "<2" },
    { key: "albumin", label: "Albumin (g/dL)", placeholder: "3.5-5" }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PenLine className="h-4 w-4" />
          Blood Gas Values
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="text-xs text-muted-foreground">{label}</Label>
              <Input
                id={key}
                type="number"
                step="0.01"
                placeholder={placeholder}
                value={values[key]}
                onChange={(e) => onChange(key, e.target.value)}
                className="h-9 font-mono text-sm"
                data-testid={`input-${key}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalysisResults = ({ analysis }) => {
  return (
    <Card className="mt-4 border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Disorder */}
        <div className="p-3 rounded-lg bg-background border">
          <p className="text-sm font-medium text-muted-foreground">Primary Disorder</p>
          <p className="text-lg font-bold text-foreground" data-testid="primary-disorder">
            {analysis.primary_disorder || "Unable to determine"}
          </p>
          {analysis.compensation && (
            <p className="text-sm text-muted-foreground mt-1">
              {analysis.compensation}
              {analysis.is_compensated && (
                <CheckCircle className="inline h-4 w-4 ml-1 text-green-500" />
              )}
            </p>
          )}
        </div>

        {/* Lactic Acidosis */}
        {analysis.lactic_acidosis && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">Lactic Acidosis Detected</span>
            </div>
          </div>
        )}

        {/* Anion Gap */}
        {analysis.anion_gap !== null && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-background border">
              <p className="text-xs font-medium text-muted-foreground">Anion Gap</p>
              <p className="text-xl font-mono font-bold" data-testid="anion-gap">
                {analysis.anion_gap}
              </p>
              <p className="text-xs text-muted-foreground">{analysis.anion_gap_status}</p>
            </div>
            {analysis.cl_na_ratio && (
              <div className="p-3 rounded-lg bg-background border">
                <p className="text-xs font-medium text-muted-foreground">Cl:Na Ratio</p>
                <p className="text-xl font-mono font-bold" data-testid="cl-na-ratio">
                  {analysis.cl_na_ratio}
                </p>
                <p className="text-xs text-muted-foreground">
                  {analysis.cl_na_ratio > 0.79 ? "Hyperchloremic" : "Normal"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Electrolyte Imbalances */}
        {analysis.electrolyte_imbalances?.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
              Electrolyte Imbalances
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.electrolyte_imbalances.map((imbalance, i) => (
                <span key={i} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/50 rounded text-xs font-medium">
                  {imbalance}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations?.length > 0 && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              Recommendations
            </p>
            <ul className="text-sm space-y-1">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="text-blue-600 dark:text-blue-400">• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BloodGasDialog;
