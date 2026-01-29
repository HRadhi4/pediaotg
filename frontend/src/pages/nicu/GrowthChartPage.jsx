import React, { useState, useRef, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus, Trash2, Camera } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toPng } from 'html-to-image';

/**
 * Growth Charts - WHO (Birth-2yr) & CDC (2-20yr)
 * 
 * COORDINATE CALIBRATION (OCR-based, Jan 2026):
 * Coordinates extracted via OCR from 2x rendered PNG images.
 * Values converted to viewBox coordinates.
 */

// ============== WHO CHARTS ==============
// ViewBox: 1122.5197 x 793.70074
// PRECISE coordinates from SVG gridline analysis (Jan 2026):
// - Internal SVG transform: matrix(1.3333333, 0, 0, 1.3333333, 0, 793.7008)
// - X-axis: 24 vertical gridlines from X=181.34 (month 1) to X=953.87 (month 24)
//   Birth (month 0) extrapolated to X=147.76
// - Y-axis: MAJOR gridlines (at whole kg/cm values) are DIFFERENT from minor gridlines
// - CRITICAL FIX: Use MAJOR gridline positions for yMin/yMax
const WHO_CHARTS = {
  boys: {
    weight: {
      file: "/charts/who/boys_weight_0_2.svg",
      label: "Weight-for-age",
      yLabel: "Weight (kg)",
      viewBox: "0 0 1122.5197 793.70074",
      // X: Birth=147.76, Month24=953.87
      // Y: MAJOR gridlines at 1kg intervals - 16kg=180.27 (top), 2kg=655.23 (bottom)
      grid: { xMin: 147.76, xMax: 953.87, yMin: 655.23, yMax: 180.27, ageMin: 0, ageMax: 24, valueMin: 2, valueMax: 16 }
    },
    length: {
      file: "/charts/who/boys_length_0_2.svg",
      label: "Length-for-age",
      yLabel: "Length (cm)",
      viewBox: "0 0 1122.5197 793.70074",
      // Y: 45cm at boundary (Y=675.33), 95cm extrapolated above top gridline (Y=159.92)
      grid: { xMin: 147.76, xMax: 953.87, yMin: 675.33, yMax: 159.92, ageMin: 0, ageMax: 24, valueMin: 45, valueMax: 95 }
    },
    bmi: {
      file: "/charts/who/boys_bmi_0_2.svg",
      label: "BMI-for-age",
      yLabel: "BMI (kg/m²)",
      viewBox: "0 0 1122.5197 793.70074",
      // Need to find major gridlines for BMI chart separately  
      grid: { xMin: 147.76, xMax: 953.87, yMin: 653.27, yMax: 182.20, ageMin: 0, ageMax: 24, valueMin: 10, valueMax: 22 }
    },
    headCircumference: {
      file: "/charts/who/boys_hc_0_2.svg",
      label: "Head Circumference",
      yLabel: "HC (cm)",
      viewBox: "0 0 791 558",
      // Transform: matrix(1.041796, 0, 0, -0.959881, -1, -27)
      // X: Month 0 = 105.98, Month 24 = 668.66
      // Y: 52cm = 104.98 (top), 31cm = 467.22 (bottom)
      grid: { xMin: 105.98, xMax: 668.66, yMin: 467.22, yMax: 104.98, ageMin: 0, ageMax: 24, valueMin: 31, valueMax: 52 }
    }
  },
  girls: {
    weight: {
      file: "/charts/who/girls_weight_0_2.svg",
      label: "Weight-for-age",
      yLabel: "Weight (kg)",
      viewBox: "0 0 1122.5197 793.70074",
      // Same Y coordinates as boys weight chart
      grid: { xMin: 147.76, xMax: 953.87, yMin: 654.71, yMax: 180.71, ageMin: 0, ageMax: 24, valueMin: 2, valueMax: 16 }
    },
    length: {
      file: "/charts/who/girls_length_0_2.svg",
      label: "Length-for-age",
      yLabel: "Length (cm)",
      viewBox: "0 0 1122.5197 793.70074",
      // Y: Same as boys - chart boundary = 45cm (Y=675.33), top = 90cm (Y=211.46)
      grid: { xMin: 147.76, xMax: 953.87, yMin: 675.33, yMax: 211.46, ageMin: 0, ageMax: 24, valueMin: 45, valueMax: 90 }
    },
    bmi: {
      file: "/charts/who/girls_bmi_0_2.svg",
      label: "BMI-for-age",
      yLabel: "BMI (kg/m²)",
      viewBox: "0 0 1122.5197 793.70074",
      grid: { xMin: 147.76, xMax: 953.87, yMin: 653.27, yMax: 182.20, ageMin: 0, ageMax: 24, valueMin: 10, valueMax: 22 }
    },
    headCircumference: {
      file: "/charts/who/girls_head_circumference_0_2.svg",
      label: "Head Circumference",
      yLabel: "HC (cm)",
      viewBox: "0 0 1054.6667 744",
      // This chart has different structure - needs separate calibration
      grid: { xMin: 143, xMax: 858, yMin: 641, yMax: 154, ageMin: 0, ageMax: 24, valueMin: 32, valueMax: 52 }
    }
  }
};

// ============== CDC CHARTS ==============
// ViewBox: 816 x 1056
// Coordinates extracted from SVG path analysis (Jan 2026):
// - Stature-Weight chart: X=83-546 (age 2-20), Y varies by measurement
// - BMI chart: X=42-562 (age 2-20), Y=122-714 (BMI 12-35)
const CDC_CHARTS = {
  boys: {
    statureWeight: {
      file: "/charts/cdc/boys_stature_weight_2_20.svg",
      label: "Stature & Weight",
      viewBox: "0 0 816 1056",
      measurements: {
        stature: {
          yLabel: "Stature (cm)",
          // Stature grid: X=83-546 (age), Y=382(80cm bottom) to 83(190cm top)
          grid: { xMin: 83, xMax: 546, yMin: 382, yMax: 83, ageMin: 2, ageMax: 20, valueMin: 80, valueMax: 190 }
        },
        weight: {
          yLabel: "Weight (kg)",
          // Weight grid: X=83-546 (age), Y=702(10kg bottom) to 163(105kg top)
          grid: { xMin: 83, xMax: 546, yMin: 702, yMax: 163, ageMin: 2, ageMax: 20, valueMin: 10, valueMax: 105 }
        }
      }
    },
    bmi: {
      file: "/charts/cdc/boys_bmi_2_20.svg",
      label: "BMI-for-age",
      viewBox: "0 0 816 1056",
      measurements: {
        bmi: {
          yLabel: "BMI (kg/m²)",
          // BMI grid: X=42-562 (age 2-20), Y=714(12 bottom) to 122(35 top)
          grid: { xMin: 42, xMax: 562, yMin: 714, yMax: 122, ageMin: 2, ageMax: 20, valueMin: 12, valueMax: 35 }
        }
      }
    }
  },
  girls: {
    statureWeight: {
      file: "/charts/cdc/girls_stature_weight_2_20.svg",
      label: "Stature & Weight",
      viewBox: "0 0 816 1056",
      measurements: {
        stature: {
          yLabel: "Stature (cm)",
          grid: { xMin: 83, xMax: 546, yMin: 382, yMax: 83, ageMin: 2, ageMax: 20, valueMin: 80, valueMax: 190 }
        },
        weight: {
          yLabel: "Weight (kg)",
          grid: { xMin: 83, xMax: 546, yMin: 702, yMax: 163, ageMin: 2, ageMax: 20, valueMin: 10, valueMax: 105 }
        }
      }
    },
    bmi: {
      file: "/charts/cdc/girls_bmi_2_20.svg",
      label: "BMI-for-age",
      viewBox: "0 0 816 1056",
      measurements: {
        bmi: {
          yLabel: "BMI (kg/m²)",
          grid: { xMin: 42, xMax: 562, yMin: 714, yMax: 122, ageMin: 2, ageMax: 20, valueMin: 12, valueMax: 35 }
        }
      }
    }
  }
};

// ============== WHO CHARTS COMPONENT ==============
const WHOChartsSection = ({ gender }) => {
  const [chartType, setChartType] = useState("weight");
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ date: new Date().toISOString().split('T')[0], ageMonths: "", value: "" });
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
        setEntries(prev => [...prev, { ...newEntry, id: Date.now(), chartType, gender: whoGender, coords }]);
        setNewEntry({ date: new Date().toISOString().split('T')[0], ageMonths: "", value: "" });
      }
    }
  };

  const removeEntry = (id) => setEntries(entries.filter(e => e.id !== id));
  const currentEntries = entries.filter(e => e.gender === whoGender && e.chartType === chartType);

  const saveAsPng = async () => {
    if (!chartContainerRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(chartContainerRef.current, { quality: 1.0, backgroundColor: '#ffffff', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `who-${currentChart.label.toLowerCase().replace(/\s+/g, '-')}-${whoGender}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error saving as PNG:', error);
    } finally {
      setSaving(false);
    }
  };

  const getUnit = () => {
    if (chartType === 'weight') return 'kg';
    if (chartType === 'length' || chartType === 'headCircumference') return 'cm';
    return 'kg/m²';
  };

  return (
    <div className="space-y-4">
      <Select value={chartType} onValueChange={setChartType}>
        <SelectTrigger className="h-9" data-testid="who-chart-type-select">
          <SelectValue placeholder="Select chart type" />
        </SelectTrigger>
        <SelectContent>
          {availableCharts.map(type => (
            <SelectItem key={type} value={type}>{WHO_CHARTS[whoGender][type].label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-sm">{currentChart.label} - {whoGender === 'boys' ? 'Boys' : 'Girls'}</CardTitle>
              <CardDescription className="text-xs">Pinch to zoom • Drag to pan • Double-tap to reset</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={saveAsPng} disabled={saving} className="h-8" data-testid="who-save-png-btn">
              <Camera className="h-4 w-4 mr-1" />{saving ? 'Saving...' : 'Save PNG'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div ref={chartContainerRef} className={`relative border rounded-lg overflow-hidden ${whoGender === 'boys' ? 'bg-blue-50' : 'bg-pink-50'} h-[350px]`}>
            <TransformWrapper initialScale={1} minScale={1} maxScale={5} centerOnInit doubleClick={{ mode: "reset" }} panning={{ velocityDisabled: true }} wheel={{ step: 0.1 }}>
              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                <svg 
                  viewBox={currentChart.viewBox} 
                  className="max-w-full max-h-full"
                  preserveAspectRatio="xMidYMid meet"
                  data-testid="who-growth-chart-svg"
                >
                  <image 
                    href={currentChart.file} 
                    x="0"
                    y="0"
                    width={currentChart.viewBox.split(' ')[2]}
                    height={currentChart.viewBox.split(' ')[3]}
                  />
                  {currentEntries.map((entry, index) => entry.coords && (
                    <g key={entry.id}>
                      <circle cx={entry.coords.x} cy={entry.coords.y} r="8" fill={whoGender === 'boys' ? '#2563eb' : '#db2777'} stroke="white" strokeWidth="2" />
                      <text x={entry.coords.x} y={entry.coords.y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{index + 1}</text>
                    </g>
                  ))}
                </svg>
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">WHO Child Growth Standards • Percentiles: 3rd, 15th, 50th, 85th, 97th</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Add Measurement</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div><Label className="text-xs">Date</Label><Input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="h-9 text-sm" data-testid="who-date-input" /></div>
            <div><Label className="text-xs">Age (months)</Label><Input type="number" min="0" max="24" step="0.5" value={newEntry.ageMonths} onChange={e => setNewEntry({...newEntry, ageMonths: e.target.value})} className="h-9 font-mono text-sm" placeholder="0-24" data-testid="who-age-input" /></div>
            <div><Label className="text-xs">{currentChart.yLabel}</Label><Input type="number" step="0.1" min="0" value={newEntry.value} onChange={e => setNewEntry({...newEntry, value: e.target.value})} className="h-9 font-mono text-sm" placeholder={`${currentChart.grid.valueMin}-${currentChart.grid.valueMax}`} data-testid="who-value-input" /></div>
          </div>
          <Button onClick={addEntry} className="w-full" size="sm" disabled={!newEntry.date || !newEntry.ageMonths || !newEntry.value || parseFloat(newEntry.ageMonths) < 0 || parseFloat(newEntry.ageMonths) > 24} data-testid="who-add-measurement-btn">
            <Plus className="h-4 w-4 mr-1" />Add to Chart
          </Button>
        </CardContent>
      </Card>

      {currentEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Plotted Measurements ({currentEntries.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {currentEntries.map((entry, index) => (
              <div key={entry.id} className={`p-3 rounded-lg text-sm ${whoGender === 'boys' ? 'bg-blue-50' : 'bg-pink-50'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${whoGender === 'boys' ? 'bg-blue-600' : 'bg-pink-600'}`}>{index + 1}</span>
                    <div><span className="font-medium">{entry.date}</span><span className="text-muted-foreground ml-2">{entry.ageMonths} mo</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-medium ${whoGender === 'boys' ? 'text-blue-600' : 'text-pink-600'}`}>{entry.value} {getUnit()}</span>
                    <button onClick={() => removeEntry(entry.id)} className="text-red-500 p-1 hover:bg-red-100 rounded"><Trash2 className="h-4 w-4" /></button>
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
  const [chartType, setChartType] = useState("statureWeight");
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ date: new Date().toISOString().split('T')[0], ageYears: "", stature: "", weight: "", bmi: "" });
  const [saving, setSaving] = useState(false);
  const chartContainerRef = useRef(null);

  const cdcGender = gender === "male" ? "boys" : "girls";
  const currentChart = CDC_CHARTS[cdcGender]?.[chartType] || CDC_CHARTS.boys.statureWeight;
  const availableCharts = Object.keys(CDC_CHARTS[cdcGender] || {});
  const isStatureWeightChart = chartType === "statureWeight";

  const calculateSvgCoords = useCallback((ageYears, value, measurementType) => {
    const measurement = currentChart.measurements[measurementType];
    if (!measurement) return null;
    const { grid } = measurement;
    if (!grid) return null;
    const age = parseFloat(ageYears);
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
    if (!newEntry.date || !newEntry.ageYears) return;
    const age = parseFloat(newEntry.ageYears);
    if (age < 2 || age > 20) return;

    if (isStatureWeightChart) {
      if (!newEntry.stature && !newEntry.weight) return;
      const statureCoords = newEntry.stature ? calculateSvgCoords(newEntry.ageYears, newEntry.stature, 'stature') : null;
      const weightCoords = newEntry.weight ? calculateSvgCoords(newEntry.ageYears, newEntry.weight, 'weight') : null;
      setEntries(prev => [...prev, { ...newEntry, id: Date.now(), chartType, gender: cdcGender, statureCoords, weightCoords }]);
    } else {
      if (!newEntry.bmi) return;
      const bmiCoords = calculateSvgCoords(newEntry.ageYears, newEntry.bmi, 'bmi');
      setEntries(prev => [...prev, { ...newEntry, id: Date.now(), chartType, gender: cdcGender, bmiCoords }]);
    }
    setNewEntry({ date: new Date().toISOString().split('T')[0], ageYears: "", stature: "", weight: "", bmi: "" });
  };

  const removeEntry = (id) => setEntries(entries.filter(e => e.id !== id));
  const currentEntries = entries.filter(e => e.gender === cdcGender && e.chartType === chartType);

  const saveAsPng = async () => {
    if (!chartContainerRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(chartContainerRef.current, { quality: 1.0, backgroundColor: '#ffffff', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `cdc-${currentChart.label.toLowerCase().replace(/\s+/g, '-')}-${cdcGender}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error saving as PNG:', error);
    } finally {
      setSaving(false);
    }
  };

  const getTotalPoints = () => {
    if (isStatureWeightChart) {
      return currentEntries.reduce((count, e) => count + (e.statureCoords ? 1 : 0) + (e.weightCoords ? 1 : 0), 0);
    }
    return currentEntries.length;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {availableCharts.map(type => (
          <Button key={type} variant={chartType === type ? "default" : "outline"} onClick={() => setChartType(type)} className="text-xs h-9" data-testid={`cdc-${type}-btn`}>
            {CDC_CHARTS[cdcGender][type].label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-sm">{currentChart.label} - {cdcGender === 'boys' ? 'Boys' : 'Girls'}</CardTitle>
              <CardDescription className="text-xs">Pinch to zoom • Drag to pan • Double-tap to reset</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={saveAsPng} disabled={saving} className="h-8" data-testid="cdc-save-png-btn">
              <Camera className="h-4 w-4 mr-1" />{saving ? 'Saving...' : 'Save PNG'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div ref={chartContainerRef} className={`relative border rounded-lg overflow-hidden ${cdcGender === 'boys' ? 'bg-blue-50' : 'bg-pink-50'} h-[400px]`}>
            <TransformWrapper initialScale={1} minScale={1} maxScale={5} centerOnInit doubleClick={{ mode: "reset" }} panning={{ velocityDisabled: true }} wheel={{ step: 0.1 }}>
              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                <svg 
                  viewBox={currentChart.viewBox} 
                  className="max-w-full max-h-full"
                  preserveAspectRatio="xMidYMid meet"
                  data-testid="cdc-growth-chart-svg"
                >
                  <image 
                    href={currentChart.file} 
                    x="0"
                    y="0"
                    width={currentChart.viewBox.split(' ')[2]}
                    height={currentChart.viewBox.split(' ')[3]}
                  />
                  {isStatureWeightChart ? (
                    currentEntries.map((entry, index) => (
                      <g key={entry.id}>
                        {entry.statureCoords && (
                          <g>
                            <circle cx={entry.statureCoords.x} cy={entry.statureCoords.y} r="8" fill="#2563eb" stroke="white" strokeWidth="2" />
                            <text x={entry.statureCoords.x} y={entry.statureCoords.y + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S{index + 1}</text>
                          </g>
                        )}
                        {entry.weightCoords && (
                          <g>
                            <circle cx={entry.weightCoords.x} cy={entry.weightCoords.y} r="8" fill="#dc2626" stroke="white" strokeWidth="2" />
                            <text x={entry.weightCoords.x} y={entry.weightCoords.y + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">W{index + 1}</text>
                          </g>
                        )}
                      </g>
                    ))
                  ) : (
                    currentEntries.map((entry, index) => entry.bmiCoords && (
                      <g key={entry.id}>
                        <circle cx={entry.bmiCoords.x} cy={entry.bmiCoords.y} r="8" fill={cdcGender === 'boys' ? '#2563eb' : '#db2777'} stroke="white" strokeWidth="2" />
                        <text x={entry.bmiCoords.x} y={entry.bmiCoords.y + 3} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{index + 1}</text>
                      </g>
                    ))
                  )}
                </svg>
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            CDC Growth Charts (2000) • Percentiles: 3rd, 5th, 10th, 25th, 50th, 75th, 85th, 90th, 95th, 97th
            {isStatureWeightChart && <span className="block mt-1"><span className="text-blue-600">●</span> Stature <span className="text-red-600 ml-2">●</span> Weight</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Add Measurement</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Date</Label><Input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="h-9 text-sm" data-testid="cdc-date-input" /></div>
            <div><Label className="text-xs">Age (years)</Label><Input type="number" min="2" max="20" step="0.5" value={newEntry.ageYears} onChange={e => setNewEntry({...newEntry, ageYears: e.target.value})} className="h-9 font-mono text-sm" placeholder="2-20" data-testid="cdc-age-input" /></div>
          </div>
          {isStatureWeightChart ? (
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">Stature (cm) <span className="text-blue-600">●</span></Label><Input type="number" step="0.1" min="0" value={newEntry.stature} onChange={e => setNewEntry({...newEntry, stature: e.target.value})} className="h-9 font-mono text-sm" placeholder="80-190" data-testid="cdc-stature-input" /></div>
              <div><Label className="text-xs">Weight (kg) <span className="text-red-600">●</span></Label><Input type="number" step="0.1" min="0" value={newEntry.weight} onChange={e => setNewEntry({...newEntry, weight: e.target.value})} className="h-9 font-mono text-sm" placeholder="10-105" data-testid="cdc-weight-input" /></div>
            </div>
          ) : (
            <div><Label className="text-xs">BMI (kg/m²)</Label><Input type="number" step="0.1" min="0" value={newEntry.bmi} onChange={e => setNewEntry({...newEntry, bmi: e.target.value})} className="h-9 font-mono text-sm" placeholder="12-35" data-testid="cdc-bmi-input" /></div>
          )}
          <Button onClick={addEntry} className="w-full" size="sm" disabled={!newEntry.date || !newEntry.ageYears || parseFloat(newEntry.ageYears) < 2 || parseFloat(newEntry.ageYears) > 20 || (isStatureWeightChart && !newEntry.stature && !newEntry.weight) || (!isStatureWeightChart && !newEntry.bmi)} data-testid="cdc-add-measurement-btn">
            <Plus className="h-4 w-4 mr-1" />Add to Chart
          </Button>
        </CardContent>
      </Card>

      {currentEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Plotted Measurements ({getTotalPoints()} points)</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {currentEntries.map((entry, index) => (
              <div key={entry.id} className={`p-3 rounded-lg text-sm ${cdcGender === 'boys' ? 'bg-blue-50' : 'bg-pink-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{entry.date} <span className="text-muted-foreground ml-1">• {entry.ageYears} yr</span></div>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {entry.stature && <span className="text-blue-600 font-mono">S{index + 1}: {entry.stature} cm</span>}
                      {entry.weight && <span className="text-red-600 font-mono">W{index + 1}: {entry.weight} kg</span>}
                      {entry.bmi && <span className={`font-mono ${cdcGender === 'boys' ? 'text-blue-600' : 'text-pink-600'}`}>BMI: {entry.bmi} kg/m²</span>}
                    </div>
                  </div>
                  <button onClick={() => removeEntry(entry.id)} className="text-red-500 p-1 hover:bg-red-100 rounded"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <HealthGrowthIcon className="h-5 w-5 text-teal-500" />
            Growth Charts
          </CardTitle>
          <CardDescription className="text-xs">WHO (Birth-2 years) & CDC (2-20 years) growth standards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant={gender === "male" ? "default" : "outline"} onClick={() => setGender("male")} className={`text-xs h-9 ${gender === 'male' ? 'bg-blue-600 hover:bg-blue-700' : ''}`} data-testid="male-btn">Boys</Button>
            <Button variant={gender === "female" ? "default" : "outline"} onClick={() => setGender("female")} className={`text-xs h-9 ${gender === 'female' ? 'bg-pink-600 hover:bg-pink-700' : ''}`} data-testid="female-btn">Girls</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="who" data-testid="who-tab">WHO (0-2 years)</TabsTrigger>
          <TabsTrigger value="cdc" data-testid="cdc-tab">CDC (2-20 years)</TabsTrigger>
        </TabsList>
        <TabsContent value="who" className="mt-4"><WHOChartsSection gender={gender} /></TabsContent>
        <TabsContent value="cdc" className="mt-4"><CDCChartsSection gender={gender} /></TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Growth Standards Reference</CardTitle></CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <div className="grid grid-cols-1 gap-1">
            <p>• <span className="text-red-600 font-medium">Below 3rd/5th percentile:</span> May indicate growth concern</p>
            <p>• <span className="text-green-600 font-medium">3rd/5th to 85th percentile:</span> Normal range</p>
            <p>• <span className="text-yellow-600 font-medium">85th to 95th percentile:</span> Overweight risk</p>
            <p>• <span className="text-red-600 font-medium">Above 95th/97th percentile:</span> Obesity/overnutrition</p>
          </div>
          <p className="pt-2 border-t text-[10px]">Sources: WHO Child Growth Standards • CDC 2000 Growth Charts</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
