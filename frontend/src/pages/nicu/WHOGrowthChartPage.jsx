import React, { useState, useRef, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus, Trash2, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * WHO Growth Charts - Birth to 2 Years
 * Uses official WHO SVG charts with interactive zooming and data plotting
 */

// Chart configuration with coordinate mapping for each chart type
// Coordinates are derived from the SVG viewBox and chart grid positions
const WHO_CHARTS = {
  boys: {
    weight: {
      file: "/charts/who/boys_weight_0_2.svg",
      label: "Weight-for-age",
      yLabel: "Weight (kg)",
      yMin: 2,
      yMax: 16,
      // SVG coordinate mappings (approximate from WHO chart structure)
      // viewBox: 0 0 1122.5197 793.70074
      grid: {
        xMin: 140, xMax: 1060,  // Age axis (0-24 months)
        yMin: 680, yMax: 100,   // Value axis (inverted in SVG - higher Y = lower on screen)
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
    }
  }
};

const WHOGrowthChartPage = () => {
  const [gender, setGender] = useState("boys");
  const [chartType, setChartType] = useState("weight");
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    ageMonths: "", 
    value: "" 
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const transformRef = useRef(null);
  const containerRef = useRef(null);

  // Get current chart configuration
  const currentChart = WHO_CHARTS[gender]?.[chartType] || WHO_CHARTS.boys.weight;
  
  // Get available chart types for current gender
  const availableCharts = Object.keys(WHO_CHARTS[gender] || {});

  // Calculate SVG coordinates for a data point
  const calculateSvgCoords = useCallback((ageMonths, value) => {
    const { grid } = currentChart;
    if (!grid) return null;
    
    const age = parseFloat(ageMonths);
    const val = parseFloat(value);
    
    if (isNaN(age) || isNaN(val)) return null;
    if (age < grid.ageMin || age > grid.ageMax) return null;
    if (val < grid.valueMin || val > grid.valueMax) return null;
    
    // Linear interpolation for X (age)
    const xRatio = (age - grid.ageMin) / (grid.ageMax - grid.ageMin);
    const x = grid.xMin + xRatio * (grid.xMax - grid.xMin);
    
    // Linear interpolation for Y (value) - note: SVG Y is inverted
    const yRatio = (val - grid.valueMin) / (grid.valueMax - grid.valueMin);
    const y = grid.yMin - yRatio * (grid.yMin - grid.yMax);
    
    return { x, y };
  }, [currentChart]);

  // Add measurement entry
  const addEntry = () => {
    if (newEntry.date && newEntry.ageMonths && newEntry.value) {
      const age = parseFloat(newEntry.ageMonths);
      const val = parseFloat(newEntry.value);
      
      if (age >= 0 && age <= 24) {
        const coords = calculateSvgCoords(age, val);
        setEntries(prev => [...prev, { 
          ...newEntry, 
          id: Date.now(),
          chartType,
          gender,
          coords
        }]);
        setNewEntry({ 
          date: new Date().toISOString().split('T')[0], 
          ageMonths: "", 
          value: "" 
        });
      }
    }
  };

  // Remove entry
  const removeEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Filter entries for current chart
  const currentEntries = entries.filter(e => 
    e.gender === gender && e.chartType === chartType
  );

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle chart type change
  const handleChartTypeChange = (newType) => {
    if (availableCharts.includes(newType)) {
      setChartType(newType);
    }
  };

  // Handle gender change
  const handleGenderChange = (newGender) => {
    setGender(newGender);
    // Reset to weight if current chart type not available
    if (!WHO_CHARTS[newGender]?.[chartType]) {
      setChartType("weight");
    }
  };

  return (
    <div className="space-y-4 p-4" data-testid="who-growth-chart-page">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <HealthGrowthIcon className="h-5 w-5 text-teal-500" />
            WHO Growth Charts (Birth to 2 years)
          </CardTitle>
          <CardDescription className="text-xs">
            Interactive WHO Child Growth Standards with zoom and data plotting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Gender Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={gender === "boys" ? "default" : "outline"} 
              onClick={() => handleGenderChange("boys")} 
              className={`text-xs h-9 ${gender === 'boys' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              data-testid="boys-btn"
            >
              Boys
            </Button>
            <Button 
              variant={gender === "girls" ? "default" : "outline"} 
              onClick={() => handleGenderChange("girls")} 
              className={`text-xs h-9 ${gender === 'girls' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
              data-testid="girls-btn"
            >
              Girls
            </Button>
          </div>
          
          {/* Chart Type Selection */}
          <Select value={chartType} onValueChange={handleChartTypeChange}>
            <SelectTrigger className="h-9" data-testid="chart-type-select">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              {availableCharts.map(type => (
                <SelectItem key={type} value={type}>
                  {WHO_CHARTS[gender][type].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Chart Display with Zoom */}
      <Card ref={containerRef} className={isFullscreen ? "fixed inset-0 z-50 m-0 rounded-none" : ""}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-sm">
                {currentChart.label} - {gender === 'boys' ? 'Boys' : 'Girls'}
              </CardTitle>
              <CardDescription className="text-xs">
                Pinch to zoom • Drag to pan • Double-tap to reset
              </CardDescription>
            </div>
            {/* Zoom Controls */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => transformRef.current?.zoomIn()}
                data-testid="zoom-in-btn"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => transformRef.current?.zoomOut()}
                data-testid="zoom-out-btn"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => transformRef.current?.resetTransform()}
                data-testid="reset-zoom-btn"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={toggleFullscreen}
                data-testid="fullscreen-btn"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div 
            className={`relative border rounded-lg overflow-hidden ${
              gender === 'boys' ? 'bg-blue-50' : 'bg-pink-50'
            } ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[400px]'}`}
          >
            <TransformWrapper
              ref={transformRef}
              initialScale={1}
              minScale={0.5}
              maxScale={5}
              centerOnInit
              doubleClick={{ mode: "reset" }}
              panning={{ velocityDisabled: true }}
              wheel={{ step: 0.1 }}
            >
              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full flex items-center justify-center"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* SVG Chart */}
                  <img
                    src={currentChart.file}
                    alt={`WHO ${currentChart.label} Chart - ${gender}`}
                    className="max-w-full max-h-full object-contain"
                    data-testid="growth-chart-svg"
                  />
                  
                  {/* Data Points Overlay */}
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
                          {/* Data point circle */}
                          <circle
                            cx={entry.coords.x}
                            cy={entry.coords.y}
                            r="12"
                            fill={gender === 'boys' ? '#2563eb' : '#db2777'}
                            stroke="white"
                            strokeWidth="3"
                          />
                          {/* Point number */}
                          <text
                            x={entry.coords.x}
                            y={entry.coords.y + 4}
                            textAnchor="middle"
                            fill="white"
                            fontSize="10"
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
          
          {/* Chart Info */}
          <div className="mt-2 text-xs text-muted-foreground text-center">
            WHO Child Growth Standards • Percentiles: 3rd, 15th, 50th, 85th, 97th
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Add Measurement</CardTitle>
          <CardDescription className="text-xs">
            Plot patient data on the {currentChart.label.toLowerCase()} chart
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Date</Label>
              <Input 
                type="date" 
                value={newEntry.date} 
                onChange={e => setNewEntry({...newEntry, date: e.target.value})} 
                className="h-9 text-sm"
                data-testid="date-input"
              />
            </div>
            <div>
              <Label className="text-xs">Age (months)</Label>
              <Input 
                type="number" 
                min="0" 
                max="24" 
                step="0.5"
                value={newEntry.ageMonths} 
                onChange={e => setNewEntry({...newEntry, ageMonths: e.target.value})} 
                className="h-9 font-mono text-sm"
                placeholder="0-24"
                data-testid="age-months-input"
              />
            </div>
            <div>
              <Label className="text-xs">{currentChart.yLabel}</Label>
              <Input 
                type="number" 
                step="0.1" 
                min="0"
                value={newEntry.value} 
                onChange={e => setNewEntry({...newEntry, value: e.target.value})} 
                className="h-9 font-mono text-sm"
                placeholder={`${currentChart.yMin}-${currentChart.yMax}`}
                data-testid="value-input"
              />
            </div>
          </div>
          
          <Button 
            onClick={addEntry} 
            className="w-full" 
            size="sm" 
            disabled={
              !newEntry.date || 
              !newEntry.ageMonths || 
              !newEntry.value ||
              parseFloat(newEntry.ageMonths) < 0 || 
              parseFloat(newEntry.ageMonths) > 24
            }
            data-testid="add-measurement-btn"
          >
            <Plus className="h-4 w-4 mr-1" />Add to Chart
          </Button>
        </CardContent>
      </Card>

      {/* Patient Measurements */}
      {currentEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Plotted Measurements ({currentEntries.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Data points shown on the current chart
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentEntries.map((entry, index) => (
              <div 
                key={entry.id} 
                className={`p-3 rounded-lg text-sm ${
                  gender === 'boys' ? 'bg-blue-50' : 'bg-pink-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      gender === 'boys' ? 'bg-blue-600' : 'bg-pink-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium">{entry.date}</span>
                      <span className="text-muted-foreground ml-2">
                        {entry.ageMonths} months
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-medium ${
                      gender === 'boys' ? 'text-blue-600' : 'text-pink-600'
                    }`}>
                      {entry.value} {chartType === 'weight' ? 'kg' : chartType === 'length' ? 'cm' : 'kg/m²'}
                    </span>
                    <button 
                      onClick={() => removeEntry(entry.id)} 
                      className="text-red-500 p-1 hover:bg-red-100 rounded"
                      data-testid={`remove-entry-${entry.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reference Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">WHO Growth Standards</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <div className="grid grid-cols-1 gap-1">
            <p>• <span className="text-red-600 font-medium">Below 3rd percentile:</span> May indicate growth concern</p>
            <p>• <span className="text-green-600 font-medium">3rd to 97th percentile:</span> Normal range</p>
            <p>• <span className="text-red-600 font-medium">Above 97th percentile:</span> May indicate overnutrition</p>
          </div>
          <p className="pt-2 border-t text-[10px]">
            Source: WHO Child Growth Standards • Based on WHO Multicentre Growth Reference Study
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WHOGrowthChartPage;
