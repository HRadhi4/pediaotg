import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, PenLine, Loader2, AlertTriangle, CheckCircle, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BloodGasDialog = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [useOfflineOCR, setUseOfflineOCR] = useState(false);
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
    Hb: ""
  });
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Parse blood gas values from OCR text
  const parseBloodGasFromText = (text) => {
    const values = {};
    const lines = text.split('\n').join(' ').toLowerCase();
    
    // Regex patterns for common blood gas parameters
    const patterns = {
      pH: /ph[:\s]*([0-9]+\.?[0-9]*)/i,
      pCO2: /p?co2[:\s]*([0-9]+\.?[0-9]*)/i,
      pO2: /p?o2[:\s]*([0-9]+\.?[0-9]*)/i,
      HCO3: /hco3?[:\s-]*([0-9]+\.?[0-9]*)/i,
      BE: /be[:\s]*([+-]?[0-9]+\.?[0-9]*)/i,
      Na: /na[+]?[:\s]*([0-9]+\.?[0-9]*)/i,
      K: /k[+]?[:\s]*([0-9]+\.?[0-9]*)/i,
      Cl: /cl[-]?[:\s]*([0-9]+\.?[0-9]*)/i,
      lactate: /lac(?:tate)?[:\s]*([0-9]+\.?[0-9]*)/i,
      Hb: /h[ae]?moglobin|hb|hgb[:\s]*([0-9]+\.?[0-9]*)/i
    };

    Object.keys(patterns).forEach(key => {
      const match = lines.match(patterns[key]);
      if (match && match[1]) {
        const val = parseFloat(match[1]);
        // Basic sanity checks
        if (key === 'pH' && val >= 6.5 && val <= 8.0) values[key] = val;
        else if (key === 'pCO2' && val >= 10 && val <= 150) values[key] = val;
        else if (key === 'pO2' && val >= 10 && val <= 600) values[key] = val;
        else if (key === 'HCO3' && val >= 1 && val <= 60) values[key] = val;
        else if (key === 'BE' && val >= -30 && val <= 30) values[key] = val;
        else if (key === 'Na' && val >= 100 && val <= 180) values[key] = val;
        else if (key === 'K' && val >= 1 && val <= 10) values[key] = val;
        else if (key === 'Cl' && val >= 70 && val <= 130) values[key] = val;
        else if (key === 'lactate' && val >= 0 && val <= 30) values[key] = val;
        else if (key === 'Hb' && val >= 3 && val <= 25) values[key] = val;
      }
    });

    return values;
  };

  // OCR using 100% local PaddleOCR (no external services)
  // Local Only mode: Pure PaddleOCR
  // Smart mode: PaddleOCR + LLM text parsing for complex cases
  const handleOfflineOCR = async (file) => {
    setIsLoading(true);
    setOcrProgress(10);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setOcrProgress(30);
        
        try {
          // 100% local PaddleOCR (no external API)
          const response = await axios.post(`${API}/blood-gas/analyze-image-offline`, {
            image_base64: base64
          });
          
          setOcrProgress(90);
          
          if (response.data.success && response.data.values) {
            const parsedValues = response.data.values;
            
            if (Object.keys(parsedValues).length > 0) {
              setExtractedValues(parsedValues);
              setManualValues(prev => ({
                ...prev,
                pH: parsedValues.pH?.toString() || prev.pH,
                pCO2: parsedValues.pCO2?.toString() || prev.pCO2,
                pO2: parsedValues.pO2?.toString() || prev.pO2,
                HCO3: parsedValues.HCO3?.toString() || prev.HCO3,
                BE: parsedValues.BE?.toString() || prev.BE,
                Na: parsedValues.Na?.toString() || prev.Na,
                K: parsedValues.K?.toString() || prev.K,
                Cl: parsedValues.Cl?.toString() || prev.Cl,
                lactate: parsedValues.lactate?.toString() || prev.lactate,
                Hb: parsedValues.Hb?.toString() || prev.Hb
              }));
              
              // Show confidence info
              const confidence = response.data.avg_confidence || response.data.confidence_avg || 0;
              const confidencePercent = Math.round(confidence * 100);
              
              if (response.data.low_confidence_warning) {
                toast.warning(response.data.low_confidence_warning);
              } else {
                toast.success(`Extracted ${Object.keys(parsedValues).length} values (${confidencePercent}% confidence). Please verify.`);
              }
            } else {
              const errorMsg = response.data.error_message || "Could not extract values. Try brighter lighting, steady hand, full text visible.";
              toast.error(errorMsg);
            }
          } else {
            const errorMsg = response.data.error_message || "Could not read image. Try brighter lighting, steady hand, full text visible.";
            toast.error(errorMsg);
          }
        } catch (err) {
          console.error("PaddleOCR Error:", err);
          toast.error("OCR failed: " + (err.response?.data?.detail || err.message));
        }
        
        setIsLoading(false);
        setOcrProgress(0);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("OCR failed: " + error.message);
      setIsLoading(false);
      setOcrProgress(0);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    if (useOfflineOCR) {
      // Pure local PaddleOCR mode (no LLM assistance)
      return handleOfflineOCR(file);
    }
    
    // Smart mode: PaddleOCR + LLM text parsing for complex cases
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        
        try {
          // 100% local PaddleOCR for OCR, optional LLM for text parsing
          const response = await axios.post(`${API}/blood-gas/analyze-image`, {
            image_base64: base64
          });
          
          if (response.data.success && response.data.values) {
            setExtractedValues(response.data.values);
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
              Hb: response.data.values.Hb?.toString() || ""
            });
            
            // Show confidence info
            const confidence = response.data.avg_confidence || response.data.confidence_avg || 0;
            const confidencePercent = Math.round(confidence * 100);
            
            if (response.data.low_confidence_warning) {
              toast.warning(response.data.low_confidence_warning);
            } else {
              const engine = response.data.engine || "paddle_ocr_local";
              toast.success(`Values extracted (${confidencePercent}% confidence). Please verify.`);
            }
          } else {
            const errorMsg = response.data.error_message || "Could not read image. Try brighter lighting, steady hand, full text visible.";
            toast.error(errorMsg);
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
      Na: "", K: "", Cl: "", lactate: "", Hb: ""
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
            <TabsTrigger value="auto" data-testid="auto-tab">Auto-Analysis</TabsTrigger>
            <TabsTrigger value="manual" data-testid="manual-tab">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="space-y-4">
            <Card className="nightingale-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Upload Blood Gas Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* OCR Mode Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    {useOfflineOCR ? (
                      <WifiOff className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Wifi className="h-4 w-4 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {useOfflineOCR ? "Local OCR Only" : "Smart OCR"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {useOfflineOCR ? "100% local PaddleOCR (no cloud)" : "Local OCR + LLM text parsing"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUseOfflineOCR(!useOfflineOCR)}
                    className="text-xs"
                  >
                    {useOfflineOCR ? "Use Smart" : "Use Local Only"}
                  </Button>
                </div>

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
                    className="flex-1 nightingale-btn-primary"
                    data-testid="camera-btn"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 rounded-2xl"
                    data-testid="gallery-btn"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Gallery
                  </Button>
                </div>
                
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[#00d9c5]" />
                    <span className="ml-2 mt-2">
                      {useOfflineOCR 
                        ? `Processing with PaddleOCR... ${ocrProgress}%` 
                        : "Processing with PaddleOCR..."}
                    </span>
                    {useOfflineOCR && ocrProgress > 0 && (
                      <div className="w-full mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#00d9c5] transition-all duration-300"
                          style={{ width: `${ocrProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {extractedValues && (
                  <div className="p-3 bg-[#00d9c5]/10 rounded-xl border border-[#00d9c5]/30">
                    <p className="text-sm font-medium text-[#00d9c5] mb-2">
                      ✓ Values extracted{useOfflineOCR ? " (local)" : ""} - Edit if needed:
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

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={resetForm} className="flex-1 rounded-2xl">
            Reset
          </Button>
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading}
            className="flex-1 nightingale-btn-primary"
            data-testid="analyze-btn"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Analyze
          </Button>
        </div>

        {analysis && <AnalysisResults analysis={analysis} hb={parseFloat(manualValues.Hb)} />}
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
    { key: "Hb", label: "Hb (g/dL)", placeholder: "12-16" },
    { key: "Na", label: "Na (mEq/L)", placeholder: "135-145" },
    { key: "K", label: "K (mEq/L)", placeholder: "3.5-5.0" },
    { key: "Cl", label: "Cl (mEq/L)", placeholder: "98-106" },
    { key: "lactate", label: "Lactate (mmol/L)", placeholder: "<2" }
  ];

  return (
    <Card className="nightingale-card">
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
                className="h-9 font-mono text-sm nightingale-input"
                data-testid={`input-${key}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalysisResults = ({ analysis, hb }) => {
  // Hb analysis
  const getHbStatus = () => {
    if (!hb || isNaN(hb)) return null;
    if (hb < 7) return { status: "Severe Anemia", severity: "critical", recommendation: "Blood transfusion indicated (Hb < 7 g/dL)" };
    if (hb < 10) return { status: "Moderate Anemia", severity: "warning", recommendation: "Consider transfusion based on symptoms" };
    if (hb < 12) return { status: "Mild Anemia", severity: "caution", recommendation: "Monitor and treat underlying cause" };
    if (hb > 17) return { status: "Polycythemia", severity: "warning", recommendation: "Investigate cause" };
    return { status: "Normal Hemoglobin", severity: "normal", recommendation: null };
  };

  const hbStatus = getHbStatus();

  return (
    <Card className="mt-4 border-[#00d9c5]/30 bg-[#00d9c5]/5 rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Disorder */}
        <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
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
          {analysis.expected_value && (
            <p className="text-sm text-[#00d9c5] mt-2 font-mono">
              Expected {analysis.expected_label}: {analysis.expected_value}
            </p>
          )}
        </div>

        {/* Hemoglobin Status */}
        {hbStatus && (
          <div className={`p-3 rounded-xl border ${
            hbStatus.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' :
            hbStatus.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' :
            hbStatus.severity === 'caution' ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800' :
            'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hemoglobin Status</p>
                <p className={`text-lg font-bold ${
                  hbStatus.severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                  hbStatus.severity === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                  hbStatus.severity === 'caution' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {hbStatus.status}
                </p>
              </div>
              <p className="text-2xl font-mono font-bold">{hb} g/dL</p>
            </div>
            {hbStatus.recommendation && (
              <p className="text-sm mt-2 text-muted-foreground">{hbStatus.recommendation}</p>
            )}
          </div>
        )}

        {/* Lactic Acidosis */}
        {analysis.lactic_acidosis && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-600 dark:text-red-400">Lactic Acidosis Detected</span>
            </div>
          </div>
        )}

        {/* Anion Gap */}
        {analysis.anion_gap !== null && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
              <p className="text-xs font-medium text-muted-foreground">Anion Gap</p>
              <p className="text-xl font-mono font-bold" data-testid="anion-gap">
                {analysis.anion_gap}
              </p>
              <p className="text-xs text-muted-foreground">{analysis.anion_gap_status}</p>
            </div>
            {analysis.cl_na_ratio && (
              <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border">
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
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
              Electrolyte Imbalances
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.electrolyte_imbalances.map((imbalance, i) => (
                <span key={i} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-xs font-medium">
                  {imbalance}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations?.length > 0 && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
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
