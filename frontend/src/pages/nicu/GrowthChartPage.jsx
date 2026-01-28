import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Trash2, Download, Maximize2, Minimize2 } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument, rgb } from 'pdf-lib';

/**
 * Growth Chart Page - Using Official CDC PDFs with Direct Overlay
 * CDC Charts (2-20 years): Stature + Weight combined, BMI separate
 * Points are plotted directly on the PDF for export
 */

// CDC PDF URLs - directly from uploaded files
const CDC_PDFS = {
  statureWeight: {
    male: "https://customer-assets.emergentagent.com/job_pediatric-tools-2/artifacts/5hpnooem_Stature%20for%20afe%20and%20weight%20for%20age%20Boys%20percentiles.pdf",
    female: "https://customer-assets.emergentagent.com/job_pediatric-tools-2/artifacts/f49s7ypi_Stature%20for%20afe%20and%20weight%20for%20age%20Girls%20percentiles.pdf"
  },
  bmi: {
    male: "https://customer-assets.emergentagent.com/job_pediatric-tools-2/artifacts/zgvqqqk9_BMI%20for%20age%20Boys%20percentiles.pdf",
    female: "https://customer-assets.emergentagent.com/job_pediatric-tools-2/artifacts/bwb6u7fn_BMI%20for%20age%20Girls%20percentiles.pdf"
  }
};

// Chart coordinate mappings for plotting points on the PDF
// These are calibrated to the CDC PDF layout (PDF coordinates - origin at bottom-left)
// Standard CDC charts are letter size: 612 x 792 points
const CHART_COORDS = {
  statureWeight: {
    // Stature chart area (top chart on combined PDF)
    stature: {
      // X-axis: Age 2-20 years
      xMin: 122, xMax: 559, // PDF points
      ageMin: 2, ageMax: 20,
      // Y-axis: Stature in cm
      yMin: 385, yMax: 710, // PDF points (inverted because PDF y goes up)
      valueMin: 77, valueMax: 200 // cm range
    },
    // Weight chart area (bottom chart on combined PDF)
    weight: {
      // X-axis: Age 2-20 years
      xMin: 122, xMax: 559,
      ageMin: 2, ageMax: 20,
      // Y-axis: Weight in kg
      yMin: 82, yMax: 340,
      valueMin: 8, valueMax: 105 // kg range
    }
  },
  bmi: {
    // BMI chart area
    bmi: {
      // X-axis: Age 2-20 years
      xMin: 122, xMax: 559,
      ageMin: 2, ageMax: 20,
      // Y-axis: BMI in kg/m²
      yMin: 100, yMax: 680,
      valueMin: 12, valueMax: 35
    }
  }
};

const GrowthChartPage = () => {
  const [gender, setGender] = useState("male");
  const [activeChart, setActiveChart] = useState("statureWeight"); // "statureWeight" or "bmi"
  const [entries, setEntries] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfImageUrl, setPdfImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    age: "", 
    weight: "", 
    stature: "", 
    bmi: "" 
  });
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pdfBytesRef = useRef(null);

  // Load PDF and convert to image for display
  const loadPdfAsImage = useCallback(async () => {
    setLoading(true);
    try {
      const pdfUrl = activeChart === 'bmi' 
        ? CDC_PDFS.bmi[gender] 
        : CDC_PDFS.statureWeight[gender];
      
      // Fetch PDF
      const response = await fetch(pdfUrl);
      const pdfBytes = await response.arrayBuffer();
      pdfBytesRef.current = pdfBytes;
      
      // Load PDF and render to canvas for display
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();
      
      // Create a canvas to render the PDF page
      // We'll use pdf.js for rendering
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
      const pdf = await loadingTask.promise;
      const pdfPage = await pdf.getPage(1);
      
      const scale = 2; // Higher scale for better quality
      const viewport = pdfPage.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      
      await pdfPage.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;
      
      setPdfImageUrl(canvas.toDataURL('image/png'));
      setLoading(false);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setLoading(false);
    }
  }, [gender, activeChart]);

  useEffect(() => {
    loadPdfAsImage();
  }, [loadPdfAsImage]);

  // Calculate PDF coordinates for a data point
  const calculatePdfCoords = (age, value, chartType) => {
    const coords = activeChart === 'bmi' 
      ? CHART_COORDS.bmi.bmi 
      : CHART_COORDS.statureWeight[chartType];
    
    if (!coords) return null;
    
    // Linear interpolation for X (age)
    const xRatio = (age - coords.ageMin) / (coords.ageMax - coords.ageMin);
    const x = coords.xMin + xRatio * (coords.xMax - coords.xMin);
    
    // Linear interpolation for Y (value)
    const yRatio = (value - coords.valueMin) / (coords.valueMax - coords.valueMin);
    const y = coords.yMin + yRatio * (coords.yMax - coords.yMin);
    
    return { x, y };
  };

  // Draw points on overlay canvas
  const drawPoints = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pdfImageUrl) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scale factor: canvas is scaled 2x relative to PDF points
    const scale = 2;
    
    entries.forEach((entry, index) => {
      const age = parseFloat(entry.age);
      if (isNaN(age) || age < 2 || age > 20) return;
      
      if (activeChart === 'statureWeight') {
        // Plot stature point
        if (entry.stature) {
          const statureVal = parseFloat(entry.stature);
          const coords = calculatePdfCoords(age, statureVal, 'stature');
          if (coords) {
            drawPoint(ctx, coords.x * scale, (792 - coords.y) * scale, '#2563eb', index + 1);
          }
        }
        // Plot weight point
        if (entry.weight) {
          const weightVal = parseFloat(entry.weight);
          const coords = calculatePdfCoords(age, weightVal, 'weight');
          if (coords) {
            drawPoint(ctx, coords.x * scale, (792 - coords.y) * scale, '#dc2626', index + 1);
          }
        }
      } else {
        // Plot BMI point
        if (entry.bmi) {
          const bmiVal = parseFloat(entry.bmi);
          const coords = calculatePdfCoords(age, bmiVal, 'bmi');
          if (coords) {
            drawPoint(ctx, coords.x * scale, (792 - coords.y) * scale, '#7c3aed', index + 1);
          }
        }
      }
    });
  }, [entries, activeChart, pdfImageUrl]);

  // Draw a single point with label
  const drawPoint = (ctx, x, y, color, label) => {
    // Outer circle
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Inner dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Label
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(label.toString(), x + 14, y + 4);
  };

  useEffect(() => {
    drawPoints();
  }, [drawPoints]);

  // Add entry
  const addEntry = () => {
    if (newEntry.date && newEntry.age) {
      const age = parseFloat(newEntry.age);
      if (age >= 2 && age <= 20) {
        setEntries([...entries, { ...newEntry, id: Date.now() }]);
        setNewEntry({ 
          date: new Date().toISOString().split('T')[0], 
          age: "", 
          weight: "", 
          stature: "", 
          bmi: "" 
        });
      }
    }
  };

  // Export PDF with plotted points
  const exportPDF = async () => {
    if (!pdfBytesRef.current) return;
    
    try {
      // Load the original PDF
      const pdfDoc = await PDFDocument.load(pdfBytesRef.current);
      const page = pdfDoc.getPages()[0];
      
      // Draw points on the PDF
      entries.forEach((entry, index) => {
        const age = parseFloat(entry.age);
        if (isNaN(age) || age < 2 || age > 20) return;
        
        if (activeChart === 'statureWeight') {
          // Plot stature point
          if (entry.stature) {
            const statureVal = parseFloat(entry.stature);
            const coords = calculatePdfCoords(age, statureVal, 'stature');
            if (coords) {
              // Draw circle
              page.drawCircle({
                x: coords.x,
                y: coords.y,
                size: 6,
                color: rgb(0.145, 0.388, 0.922), // Blue
                borderColor: rgb(1, 1, 1),
                borderWidth: 1.5
              });
              // Draw label
              page.drawText((index + 1).toString(), {
                x: coords.x + 10,
                y: coords.y - 4,
                size: 10,
                color: rgb(0.145, 0.388, 0.922)
              });
            }
          }
          // Plot weight point
          if (entry.weight) {
            const weightVal = parseFloat(entry.weight);
            const coords = calculatePdfCoords(age, weightVal, 'weight');
            if (coords) {
              page.drawCircle({
                x: coords.x,
                y: coords.y,
                size: 6,
                color: rgb(0.863, 0.149, 0.149), // Red
                borderColor: rgb(1, 1, 1),
                borderWidth: 1.5
              });
              page.drawText((index + 1).toString(), {
                x: coords.x + 10,
                y: coords.y - 4,
                size: 10,
                color: rgb(0.863, 0.149, 0.149)
              });
            }
          }
        } else {
          // Plot BMI point
          if (entry.bmi) {
            const bmiVal = parseFloat(entry.bmi);
            const coords = calculatePdfCoords(age, bmiVal, 'bmi');
            if (coords) {
              page.drawCircle({
                x: coords.x,
                y: coords.y,
                size: 6,
                color: rgb(0.486, 0.227, 0.929), // Purple
                borderColor: rgb(1, 1, 1),
                borderWidth: 1.5
              });
              page.drawText((index + 1).toString(), {
                x: coords.x + 10,
                y: coords.y - 4,
                size: 10,
                color: rgb(0.486, 0.227, 0.929)
              });
            }
          }
        }
      });
      
      // Save and download
      const pdfBytesModified = await pdfDoc.save();
      const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `growth-chart-${gender}-${activeChart}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const chartLabels = {
    statureWeight: "Stature & Weight for Age",
    bmi: "BMI for Age"
  };

  return (
    <div className="space-y-4 p-4" data-testid="growth-chart-page">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <HealthGrowthIcon className="h-5 w-5 text-teal-500" />
            CDC Growth Charts (2-20 years)
          </CardTitle>
          <CardDescription className="text-xs">
            {gender === 'male' ? 'Boys' : 'Girls'} • {chartLabels[activeChart]}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Gender Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={gender === "male" ? "default" : "outline"} 
              onClick={() => setGender("male")} 
              className={`text-xs h-9 ${gender === 'male' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              data-testid="male-btn"
            >
              Boys
            </Button>
            <Button 
              variant={gender === "female" ? "default" : "outline"} 
              onClick={() => setGender("female")} 
              className={`text-xs h-9 ${gender === 'female' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
              data-testid="female-btn"
            >
              Girls
            </Button>
          </div>
          
          {/* Chart Type Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={activeChart === "statureWeight" ? "default" : "outline"} 
              onClick={() => setActiveChart("statureWeight")} 
              className="text-xs h-9"
              data-testid="stature-weight-btn"
            >
              Stature & Weight
            </Button>
            <Button 
              variant={activeChart === "bmi" ? "default" : "outline"} 
              onClick={() => setActiveChart("bmi")} 
              className="text-xs h-9"
              data-testid="bmi-btn"
            >
              BMI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" 
          onClick={() => setIsFullscreen(false)}
        >
          <div 
            className="relative bg-white rounded-lg p-4 max-w-[95vw] max-h-[95vh] overflow-auto" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-lg font-semibold">{chartLabels[activeChart]}</h3>
                <p className="text-sm text-muted-foreground">
                  CDC • {gender === 'male' ? 'Boys' : 'Girls'} • 2-20 years
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportPDF} className="h-9 px-3">
                  <Download className="h-4 w-4 mr-1" />Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsFullscreen(false)} className="h-9 w-9 p-0">
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              {pdfImageUrl && (
                <img 
                  src={pdfImageUrl} 
                  alt="CDC Growth Chart" 
                  className="max-w-full h-auto"
                />
              )}
              <canvas
                ref={canvasRef}
                width={1224}
                height={1584}
                className="absolute top-0 left-0 pointer-events-none"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chart Display */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm">{chartLabels[activeChart]}</CardTitle>
              <CardDescription className="text-xs">
                CDC • {gender === 'male' ? 'Boys' : 'Girls'} • Percentiles: 3, 5, 10, 25, 50, 75, 85, 90, 95, 97
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportPDF} 
                className="h-8 px-2"
                data-testid="export-pdf-btn"
                disabled={loading}
              >
                <Download className="h-3.5 w-3.5 mr-1" />PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFullscreen(true)} 
                className="h-8 w-8 p-0"
                data-testid="fullscreen-btn"
                disabled={loading}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div ref={containerRef} className="relative w-full overflow-auto bg-gray-50 rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading chart...</p>
                </div>
              </div>
            ) : pdfImageUrl ? (
              <div className="relative inline-block">
                <img 
                  src={pdfImageUrl} 
                  alt="CDC Growth Chart" 
                  className="max-w-full h-auto"
                  style={{ minWidth: '600px' }}
                />
                <canvas
                  ref={canvasRef}
                  width={1224}
                  height={1584}
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-sm text-muted-foreground">Failed to load chart</p>
              </div>
            )}
          </div>
          
          {/* Legend for plotted points */}
          {entries.length > 0 && (
            <div className="mt-3 flex gap-4 text-xs">
              {activeChart === 'statureWeight' ? (
                <>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span>Stature</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span>Weight</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <span>BMI</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Measurement */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Plot Patient Measurement</CardTitle>
          <CardDescription className="text-xs">
            Age range: 2-20 years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Date *</Label>
              <Input 
                type="date" 
                value={newEntry.date} 
                onChange={e => setNewEntry({...newEntry, date: e.target.value})} 
                className="h-9 text-sm"
                data-testid="date-input"
              />
            </div>
            <div>
              <Label className="text-xs">Age (years) *</Label>
              <Input 
                type="number" 
                min="2" 
                max="20" 
                step="0.5"
                value={newEntry.age} 
                onChange={e => setNewEntry({...newEntry, age: e.target.value})} 
                className="h-9 font-mono text-sm"
                placeholder="2-20"
                data-testid="age-input"
              />
            </div>
          </div>
          
          {activeChart === 'statureWeight' ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Stature (cm)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  value={newEntry.stature} 
                  onChange={e => setNewEntry({...newEntry, stature: e.target.value})} 
                  className="h-9 font-mono text-sm"
                  placeholder="77-200"
                  data-testid="stature-input"
                />
              </div>
              <div>
                <Label className="text-xs">Weight (kg)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  value={newEntry.weight} 
                  onChange={e => setNewEntry({...newEntry, weight: e.target.value})} 
                  className="h-9 font-mono text-sm"
                  placeholder="8-105"
                  data-testid="weight-input"
                />
              </div>
            </div>
          ) : (
            <div>
              <Label className="text-xs">BMI (kg/m²)</Label>
              <Input 
                type="number" 
                step="0.1" 
                min="0" 
                value={newEntry.bmi} 
                onChange={e => setNewEntry({...newEntry, bmi: e.target.value})} 
                className="h-9 font-mono text-sm"
                placeholder="12-35"
                data-testid="bmi-input"
              />
            </div>
          )}
          
          <Button 
            onClick={addEntry} 
            className="w-full" 
            size="sm" 
            disabled={
              !newEntry.date || 
              !newEntry.age || 
              parseFloat(newEntry.age) < 2 || 
              parseFloat(newEntry.age) > 20 ||
              (activeChart === 'statureWeight' && !newEntry.weight && !newEntry.stature) ||
              (activeChart === 'bmi' && !newEntry.bmi)
            }
            data-testid="add-measurement-btn"
          >
            <Plus className="h-4 w-4 mr-1" />Plot Data Point
          </Button>
        </CardContent>
      </Card>

      {/* Plotted Measurements */}
      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Plotted Measurements ({entries.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {entries.map((entry, index) => (
              <div 
                key={entry.id} 
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-teal-600">
                    #{index + 1} • {entry.date} • Age: {entry.age} years
                  </span>
                  <button 
                    onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} 
                    className="text-red-500 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex gap-4">
                  {entry.stature && (
                    <span className="text-blue-600">
                      Stature: {entry.stature} cm
                    </span>
                  )}
                  {entry.weight && (
                    <span className="text-red-600">
                      Weight: {entry.weight} kg
                    </span>
                  )}
                  {entry.bmi && (
                    <span className="text-purple-600">
                      BMI: {entry.bmi} kg/m²
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reference Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">CDC Percentiles (3rd, 5th, 10th, 25th, 50th, 75th, 85th, 90th, 95th, 97th):</p>
          <p>• <span className="text-green-600 font-medium">25th-75th:</span> Normal range</p>
          <p>• <span className="text-yellow-600 font-medium">10th-25th / 75th-90th:</span> Monitor</p>
          <p>• <span className="text-orange-600 font-medium">5th-10th / 90th-95th:</span> At risk</p>
          <p>• <span className="text-red-600 font-medium">&lt;5th / &gt;95th:</span> Evaluation needed</p>
          <p className="pt-2 border-t text-[10px]">
            Source: CDC Growth Charts (cdc.gov) • Data plotted directly on official CDC PDF
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
