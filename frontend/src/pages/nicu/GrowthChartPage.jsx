import React, { useState, useRef, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus, Trash2, Download, ExternalLink, FileText, Camera } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFDocument, rgb } from 'pdf-lib';
import { toPng } from 'html-to-image';

/**
 * Combined Growth Charts Page
 * - WHO Charts: Birth to 2 Years (SVG with pinch-to-zoom)
 * - CDC Charts: 2-20 Years (PDF with plotting and export)
 */

// ============== WHO CHARTS CONFIGURATION ==============
const WHO_CHARTS = {
  boys: {
    weight: {
      file: "/charts/who/boys_weight_0_2.svg",
      label: "Weight-for-age",
      yLabel: "Weight (kg)",
      yMin: 2,
      yMax: 16,
      grid: {
        xMin: 140, xMax: 1060,
        yMin: 680, yMax: 100,
        ageMin: 0, ageMax: 24,
        valueMin: 2, valueMax: 16
      }
    },
    length: {
      file: "/charts/who/boys_length_0_2.svg",
      label: "Length-for-age",
      yLabel: "Length (cm)",
      yMin: 45,
      yMax: 95,
      grid: {
        xMin: 140, xMax: 1060,
        yMin: 680, yMax: 100,
        ageMin: 0, ageMax: 24,
        valueMin: 45, valueMax: 95
      }
    },
    bmi: {
      file: "/charts/who/boys_bmi_0_2.svg",
      label: "BMI-for-age",
      yLabel: "BMI (kg/m²)",
      yMin: 10,
      yMax: 22,
      grid: {
        xMin: 140, xMax: 1060,
        yMin: 680, yMax: 100,
        ageMin: 0, ageMax: 24,
        valueMin: 10, valueMax: 22
      }
    }
  },
  girls: {
    weight: {
      file: "/charts/who/girls_weight_0_2.svg",
      label: "Weight-for-age",
      yLabel: "Weight (kg)",
      yMin: 2,
      yMax: 16,
      grid: {
        xMin: 140, xMax: 1060,
        yMin: 680, yMax: 100,
        ageMin: 0, ageMax: 24,
        valueMin: 2, valueMax: 16
      }
    },
    length: {
      file: "/charts/who/girls_length_0_2.svg",
      label: "Length-for-age",
      yLabel: "Length (cm)",
      yMin: 45,
      yMax: 95,
      grid: {
        xMin: 140, xMax: 1060,
        yMin: 680, yMax: 100,
        ageMin: 0, ageMax: 24,
        valueMin: 45, valueMax: 95
      }
    },
    bmi: {
      file: "/charts/who/girls_bmi_0_2.svg",
      label: "BMI-for-age",
      yLabel: "BMI (kg/m²)",
      yMin: 10,
      yMax: 22,
      grid: {
        xMin: 140, xMax: 1060,
        yMin: 680, yMax: 100,
        ageMin: 0, ageMax: 24,
        valueMin: 10, valueMax: 22
      }
    },
    headCircumference: {
      file: "/charts/who/girls_head_circumference_0_2.svg",
      label: "Head Circumference",
      yLabel: "HC (cm)",
      yMin: 32,
      yMax: 52,
      grid: {
        xMin: 140, xMax: 1060,
        yMin: 680, yMax: 100,
        ageMin: 0, ageMax: 24,
        valueMin: 32, valueMax: 52
      }
    }
  }
};

// ============== CDC CHARTS CONFIGURATION ==============
const API_URL = process.env.REACT_APP_BACKEND_URL || '';
const CDC_PDFS = {
  statureWeight: {
    male: `${API_URL}/api/growth-charts/pdf/stature-weight/boys`,
    female: `${API_URL}/api/growth-charts/pdf/stature-weight/girls`
  },
  bmi: {
    male: `${API_URL}/api/growth-charts/pdf/bmi/boys`,
    female: `${API_URL}/api/growth-charts/pdf/bmi/girls`
  }
};

const CDC_CHART_COORDS = {
  statureWeight: {
    pageHeight: 1080,
    stature: {
      xMin: 134, xMax: 873,
      ageMin: 2, ageMax: 20,
      yMinScreen: 300, yMaxScreen: 61,
      valueMin: 30, valueMax: 190
    },
    weight: {
      xMin: 134, xMax: 873,
      ageMin: 2, ageMax: 20,
      yMinScreen: 814, yMaxScreen: 597,
      valueMin: 1, valueMax: 100
    }
  },
  bmi: {
    pageHeight: 948,
    bmi: {
      xMin: 165, xMax: 800,
      ageMin: 2, ageMax: 20,
      yMinScreen: 842, yMaxScreen: 140,
      valueMin: 12, valueMax: 35
    }
  }
};

// ============== WHO CHARTS COMPONENT ==============
const WHOChartsSection = ({ gender }) => {
  const [chartType, setChartType] = useState("weight");
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    ageMonths: "", 
    value: "" 
  });
  const [saving, setSaving] = useState(false);
  const chartContainerRef = useRef(null);

  const whoGender = gender === "male" ? "boys" : "girls";
  const currentChart = WHO_CHARTS[whoGender]?.[chartType] || WHO_CHARTS.boys.weight;
  const availableCharts = Object.keys(WHO_CHARTS[whoGender] || {});

  const calculateSvgCoords = useCallback((ageMonths, value) => {
    const { grid } = currentChart;
    if (!grid) return null;
    
    const age = parseFloat(ageMonths);
    const val = parseFloat(value);
    
    if (isNaN(age) || isNaN(val)) return null;
    if (age < grid.ageMin || age > grid.ageMax) return null;
    if (val < grid.valueMin || val > grid.valueMax) return null;
    
    const xRatio = (age - grid.ageMin) / (grid.ageMax - grid.ageMin);
    const x = grid.xMin + xRatio * (grid.xMax - grid.xMin);
    
    const yRatio = (val - grid.valueMin) / (grid.valueMax - grid.valueMin);
    const y = grid.yMin - yRatio * (grid.yMin - grid.yMax);
    
    return { x, y };
  }, [currentChart]);

  const addEntry = () => {
    if (newEntry.date && newEntry.ageMonths && newEntry.value) {
      const age = parseFloat(newEntry.ageMonths);
      if (age >= 0 && age <= 24) {
        const coords = calculateSvgCoords(newEntry.ageMonths, newEntry.value);
        setEntries(prev => [...prev, { 
          ...newEntry, 
          id: Date.now(),
          chartType,
          gender: whoGender,
          coords
        }]);
        setNewEntry({ date: new Date().toISOString().split('T')[0], ageMonths: "", value: "" });
      }
    }
  };

  const removeEntry = (id) => setEntries(entries.filter(e => e.id !== id));

  const currentEntries = entries.filter(e => e.gender === whoGender && e.chartType === chartType);

  // Save chart as PNG
  const saveAsPng = async () => {
    if (!chartContainerRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(chartContainerRef.current, {
        quality: 1.0,
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = `who-${currentChart.label.toLowerCase().replace(/\s+/g, '-')}-${whoGender}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error saving as PNG:', error);
      alert('Error saving chart. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Selection */}
      <Select value={chartType} onValueChange={setChartType}>
        <SelectTrigger className="h-9" data-testid="who-chart-type-select">
          <SelectValue placeholder="Select chart type" />
        </SelectTrigger>
        <SelectContent>
          {availableCharts.map(type => (
            <SelectItem key={type} value={type}>
              {WHO_CHARTS[whoGender][type].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Chart Display with Pinch-to-Zoom */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-sm">
                {currentChart.label} - {whoGender === 'boys' ? 'Boys' : 'Girls'}
              </CardTitle>
              <CardDescription className="text-xs">
                Pinch to zoom • Drag to pan • Double-tap to reset
              </CardDescription>
            </div>
            {/* Save as PNG Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={saveAsPng}
              disabled={saving}
              className="h-8"
              data-testid="who-save-png-btn"
            >
              <Camera className="h-4 w-4 mr-1" />
              {saving ? 'Saving...' : 'Save PNG'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div 
            ref={chartContainerRef}
            className={`relative border rounded-lg overflow-hidden ${
              whoGender === 'boys' ? 'bg-blue-50' : 'bg-pink-50'
            } h-[350px]`}
          >
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={5}
              centerOnInit
              doubleClick={{ mode: "reset" }}
              panning={{ velocityDisabled: true }}
              wheel={{ step: 0.1 }}
            >
              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={currentChart.file}
                    alt={`WHO ${currentChart.label} Chart - ${whoGender}`}
                    className="max-w-full max-h-full object-contain"
                    data-testid="who-growth-chart-svg"
                  />
                  {/* Data Points Overlay - Smaller points */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 1122.5197 793.70074"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ mixBlendMode: 'multiply' }}
                  >
                    {currentEntries.map((entry, index) => {
                      if (!entry.coords) return null;
                      return (
                        <g key={entry.id}>
                          <circle
                            cx={entry.coords.x}
                            cy={entry.coords.y}
                            r="6"
                            fill={whoGender === 'boys' ? '#2563eb' : '#db2777'}
                            stroke="white"
                            strokeWidth="2"
                          />
                          <text 
                            x={entry.coords.x} 
                            y={entry.coords.y + 3} 
                            textAnchor="middle" 
                            fill="white" 
                            fontSize="7" 
                            fontWeight="bold"
                          >
                            {index + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            WHO Child Growth Standards • Percentiles: 3rd, 15th, 50th, 85th, 97th
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Add Measurement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Date</Label>
              <Input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="h-9 text-sm" data-testid="who-date-input" />
            </div>
            <div>
              <Label className="text-xs">Age (months)</Label>
              <Input type="number" min="0" max="24" step="0.5" value={newEntry.ageMonths} onChange={e => setNewEntry({...newEntry, ageMonths: e.target.value})} className="h-9 font-mono text-sm" placeholder="0-24" data-testid="who-age-input" />
            </div>
            <div>
              <Label className="text-xs">{currentChart.yLabel}</Label>
              <Input type="number" step="0.1" min="0" value={newEntry.value} onChange={e => setNewEntry({...newEntry, value: e.target.value})} className="h-9 font-mono text-sm" placeholder={`${currentChart.yMin}-${currentChart.yMax}`} data-testid="who-value-input" />
            </div>
          </div>
          <Button 
            onClick={addEntry} 
            className="w-full" 
            size="sm" 
            disabled={!newEntry.date || !newEntry.ageMonths || !newEntry.value || parseFloat(newEntry.ageMonths) < 0 || parseFloat(newEntry.ageMonths) > 24}
            data-testid="who-add-measurement-btn"
          >
            <Plus className="h-4 w-4 mr-1" />Add to Chart
          </Button>
        </CardContent>
      </Card>

      {/* Plotted Measurements */}
      {currentEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Plotted Measurements ({currentEntries.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentEntries.map((entry, index) => (
              <div key={entry.id} className={`p-3 rounded-lg text-sm ${whoGender === 'boys' ? 'bg-blue-50' : 'bg-pink-50'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${whoGender === 'boys' ? 'bg-blue-600' : 'bg-pink-600'}`}>
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium">{entry.date}</span>
                      <span className="text-muted-foreground ml-2">{entry.ageMonths} mo</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-medium ${whoGender === 'boys' ? 'text-blue-600' : 'text-pink-600'}`}>
                      {entry.value} {chartType === 'weight' ? 'kg' : chartType === 'length' ? 'cm' : chartType === 'headCircumference' ? 'cm' : 'kg/m²'}
                    </span>
                    <button onClick={() => removeEntry(entry.id)} className="text-red-500 p-1 hover:bg-red-100 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ============== CDC CHARTS COMPONENT ==============
const CDCChartsSection = ({ gender }) => {
  const [activeChart, setActiveChart] = useState("statureWeight");
  const [entries, setEntries] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [newEntry, setNewEntry] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    age: "", 
    weight: "", 
    stature: "", 
    bmi: "" 
  });

  const getPdfUrl = () => activeChart === 'bmi' ? CDC_PDFS.bmi[gender] : CDC_PDFS.statureWeight[gender];

  const calculatePdfCoords = (age, value, chartType) => {
    const chartData = activeChart === 'bmi' ? CDC_CHART_COORDS.bmi : CDC_CHART_COORDS.statureWeight;
    const coords = chartData[chartType];
    const pageHeight = chartData.pageHeight;
    
    if (!coords) return null;
    
    const xRatio = (age - coords.ageMin) / (coords.ageMax - coords.ageMin);
    const x = coords.xMin + xRatio * (coords.xMax - coords.xMin);
    
    const yRatio = (value - coords.valueMin) / (coords.valueMax - coords.valueMin);
    const yScreen = coords.yMinScreen + yRatio * (coords.yMaxScreen - coords.yMinScreen);
    
    const y = pageHeight - yScreen;
    return { x, y };
  };

  const addEntry = () => {
    if (newEntry.date && newEntry.age) {
      const age = parseFloat(newEntry.age);
      if (age >= 2 && age <= 20) {
        setEntries(prev => [...prev, { ...newEntry, id: Date.now() }]);
        setNewEntry({ date: new Date().toISOString().split('T')[0], age: "", weight: "", stature: "", bmi: "" });
      }
    }
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const response = await fetch(getPdfUrl());
      const pdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const page = pdfDoc.getPages()[0];
      
      entries.forEach((entry, index) => {
        const age = parseFloat(entry.age);
        if (isNaN(age) || age < 2 || age > 20) return;
        
        if (activeChart === 'statureWeight') {
          if (entry.stature) {
            const coords = calculatePdfCoords(age, parseFloat(entry.stature), 'stature');
            if (coords) {
              page.drawCircle({ x: coords.x, y: coords.y, size: 5, color: rgb(0.145, 0.388, 0.922), borderColor: rgb(1, 1, 1), borderWidth: 1 });
              page.drawText(`S${index + 1}`, { x: coords.x + 8, y: coords.y - 3, size: 8, color: rgb(0.145, 0.388, 0.922) });
            }
          }
          if (entry.weight) {
            const coords = calculatePdfCoords(age, parseFloat(entry.weight), 'weight');
            if (coords) {
              page.drawCircle({ x: coords.x, y: coords.y, size: 5, color: rgb(0.863, 0.149, 0.149), borderColor: rgb(1, 1, 1), borderWidth: 1 });
              page.drawText(`W${index + 1}`, { x: coords.x + 8, y: coords.y - 3, size: 8, color: rgb(0.863, 0.149, 0.149) });
            }
          }
        } else {
          if (entry.bmi) {
            const coords = calculatePdfCoords(age, parseFloat(entry.bmi), 'bmi');
            if (coords) {
              page.drawCircle({ x: coords.x, y: coords.y, size: 5, color: rgb(0.486, 0.227, 0.929), borderColor: rgb(1, 1, 1), borderWidth: 1 });
              page.drawText(`${index + 1}`, { x: coords.x + 8, y: coords.y - 3, size: 8, color: rgb(0.486, 0.227, 0.929) });
            }
          }
        }
      });
      
      if (entries.length > 0) {
        let legendY = 50;
        page.drawText('Patient Data:', { x: 50, y: legendY, size: 9, color: rgb(0, 0, 0) });
        legendY -= 12;
        entries.forEach((entry, index) => {
          let text = `#${index + 1}: ${entry.date}, Age ${entry.age}y`;
          if (entry.stature) text += `, Stature: ${entry.stature}cm`;
          if (entry.weight) text += `, Weight: ${entry.weight}kg`;
          if (entry.bmi) text += `, BMI: ${entry.bmi}`;
          page.drawText(text, { x: 50, y: legendY, size: 7, color: rgb(0.3, 0.3, 0.3) });
          legendY -= 10;
        });
      }
      
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
      alert('Error exporting PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Selection */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant={activeChart === "statureWeight" ? "default" : "outline"} onClick={() => setActiveChart("statureWeight")} className="text-xs h-9" data-testid="cdc-stature-weight-btn">
          Stature & Weight
        </Button>
        <Button variant={activeChart === "bmi" ? "default" : "outline"} onClick={() => setActiveChart("bmi")} className="text-xs h-9" data-testid="cdc-bmi-btn">
          BMI
        </Button>
      </div>

      {/* Chart Info Box */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{activeChart === 'statureWeight' ? 'Stature & Weight for Age' : 'BMI for Age'}</CardTitle>
          <CardDescription className="text-xs">{gender === 'male' ? 'Boys' : 'Girls'} • Age 2-20 years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border-2 ${gender === 'male' ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <FileText className={`h-10 w-10 ${gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} />
              <div>
                <p className="font-medium text-sm">{activeChart === 'statureWeight' ? 'Stature-for-Age & Weight-for-Age' : 'BMI-for-Age'}</p>
                <p className="text-xs text-muted-foreground">CDC Growth Chart • {gender === 'male' ? 'Boys' : 'Girls'} • 2-20 years</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Percentiles: 3rd, 5th, 10th, 25th, 50th, 75th, 85th, 90th, 95th, 97th</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => window.open(getPdfUrl(), '_blank')} variant="outline" className="flex-1" data-testid="cdc-view-pdf-btn">
                <ExternalLink className="h-4 w-4 mr-2" />View Chart
              </Button>
              <Button onClick={() => { const link = document.createElement('a'); link.href = getPdfUrl(); link.download = `cdc-growth-chart-${gender}-${activeChart}.pdf`; link.click(); }} variant="outline" className="flex-1" data-testid="cdc-download-blank-btn">
                <Download className="h-4 w-4 mr-2" />Download Blank
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Plot Patient Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Date *</Label>
              <Input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="h-9 text-sm" data-testid="cdc-date-input" />
            </div>
            <div>
              <Label className="text-xs">Age (years) *</Label>
              <Input type="number" min="2" max="20" step="0.5" value={newEntry.age} onChange={e => setNewEntry({...newEntry, age: e.target.value})} className="h-9 font-mono text-sm" placeholder="2-20" data-testid="cdc-age-input" />
            </div>
          </div>
          
          {activeChart === 'statureWeight' ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Stature (cm)</Label>
                <Input type="number" step="0.1" min="0" value={newEntry.stature} onChange={e => setNewEntry({...newEntry, stature: e.target.value})} className="h-9 font-mono text-sm" placeholder="77-200" data-testid="cdc-stature-input" />
              </div>
              <div>
                <Label className="text-xs">Weight (kg)</Label>
                <Input type="number" step="0.1" min="0" value={newEntry.weight} onChange={e => setNewEntry({...newEntry, weight: e.target.value})} className="h-9 font-mono text-sm" placeholder="8-105" data-testid="cdc-weight-input" />
              </div>
            </div>
          ) : (
            <div>
              <Label className="text-xs">BMI (kg/m²)</Label>
              <Input type="number" step="0.1" min="0" value={newEntry.bmi} onChange={e => setNewEntry({...newEntry, bmi: e.target.value})} className="h-9 font-mono text-sm" placeholder="12-35" data-testid="cdc-bmi-input" />
            </div>
          )}
          
          <Button 
            onClick={addEntry} 
            className="w-full" 
            size="sm" 
            disabled={!newEntry.date || !newEntry.age || parseFloat(newEntry.age) < 2 || parseFloat(newEntry.age) > 20 || (activeChart === 'statureWeight' && !newEntry.weight && !newEntry.stature) || (activeChart === 'bmi' && !newEntry.bmi)}
            data-testid="cdc-add-measurement-btn"
          >
            <Plus className="h-4 w-4 mr-1" />Add Measurement
          </Button>
        </CardContent>
      </Card>

      {/* Patient Measurements */}
      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Patient Measurements ({entries.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {entries.map((entry, index) => (
              <div key={entry.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-teal-600">#{index + 1} • {entry.date}</span>
                    <span className="text-gray-500 ml-2">Age: {entry.age} years</span>
                  </div>
                  <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="text-red-500 p-1 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-sm">
                  {entry.stature && <span className="text-blue-600 font-medium">Stature: {entry.stature} cm</span>}
                  {entry.weight && <span className="text-red-600 font-medium">Weight: {entry.weight} kg</span>}
                  {entry.bmi && <span className="text-purple-600 font-medium">BMI: {entry.bmi} kg/m²</span>}
                </div>
              </div>
            ))}
            <Button onClick={exportPDF} disabled={exporting} className="w-full mt-2" data-testid="cdc-export-btn">
              <Download className="h-4 w-4 mr-2" />{exporting ? 'Creating PDF...' : 'Export Chart with Patient Data'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ============== MAIN COMPONENT ==============
const GrowthChartPage = () => {
  const [gender, setGender] = useState("male");
  const [activeTab, setActiveTab] = useState("who");

  return (
    <div className="space-y-4 p-4" data-testid="growth-chart-page">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <HealthGrowthIcon className="h-5 w-5 text-teal-500" />
            Growth Charts
          </CardTitle>
          <CardDescription className="text-xs">
            WHO (Birth-2 years) & CDC (2-20 years) growth standards
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
        </CardContent>
      </Card>

      {/* Tabs for WHO vs CDC */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="who" data-testid="who-tab">WHO (0-2 years)</TabsTrigger>
          <TabsTrigger value="cdc" data-testid="cdc-tab">CDC (2-20 years)</TabsTrigger>
        </TabsList>
        <TabsContent value="who" className="mt-4">
          <WHOChartsSection gender={gender} />
        </TabsContent>
        <TabsContent value="cdc" className="mt-4">
          <CDCChartsSection gender={gender} />
        </TabsContent>
      </Tabs>

      {/* Reference Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Growth Standards Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <div className="grid grid-cols-1 gap-1">
            <p>• <span className="text-red-600 font-medium">Below 3rd/5th percentile:</span> May indicate growth concern</p>
            <p>• <span className="text-green-600 font-medium">3rd/5th to 85th percentile:</span> Normal range</p>
            <p>• <span className="text-yellow-600 font-medium">85th to 95th percentile:</span> Overweight risk</p>
            <p>• <span className="text-red-600 font-medium">Above 95th/97th percentile:</span> Obesity/overnutrition</p>
          </div>
          <p className="pt-2 border-t text-[10px]">
            Sources: WHO Child Growth Standards • CDC 2000 Growth Charts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
