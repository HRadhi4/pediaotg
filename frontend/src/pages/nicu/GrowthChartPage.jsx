import React, { useState } from "react";
import { Plus, Trash2, Download, ExternalLink, FileText } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument, rgb } from 'pdf-lib';

/**
 * Growth Chart Page - Using Official CDC PDFs
 * CDC Charts (2-20 years): Stature + Weight combined, BMI separate
 * Points are plotted directly on the PDF for export
 */

// CDC PDF URLs - use backend proxy to avoid CORS issues
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

// Chart coordinate mappings for plotting points on the PDF
// Calibrated from PDF extraction analysis - coordinates in screen space (y=0 at top)
// Need to convert to PDF space (y=0 at bottom) when drawing

// Stature & Weight PDF: 896 x 1080 points (page size extracted)
// BMI PDF: 877 x 948 points (page size extracted)

const CHART_COORDS = {
  statureWeight: {
    pageHeight: 1080, // PDF page height for Y-flip
    // Stature chart area (top chart on combined PDF)
    stature: {
      xMin: 134, xMax: 873,  // Age 2 to Age 20
      ageMin: 2, ageMax: 20,
      // Screen coords: y=300 at 30cm, y=61 at 190cm
      // PDF coords (flipped): y=780 at 30cm, y=1019 at 190cm
      yMinScreen: 300, yMaxScreen: 61,
      valueMin: 30, valueMax: 190  // cm range from chart
    },
    // Weight chart area (bottom chart on combined PDF)
    weight: {
      xMin: 134, xMax: 873,
      ageMin: 2, ageMax: 20,
      // Screen coords: y=814 at 1kg, y=597 at 100kg
      // PDF coords (flipped): y=266 at 1kg, y=483 at 100kg
      yMinScreen: 814, yMaxScreen: 597,
      valueMin: 1, valueMax: 100  // kg range from chart
    }
  },
  bmi: {
    pageHeight: 948, // PDF page height for Y-flip
    bmi: {
      xMin: 165, xMax: 800,
      ageMin: 2, ageMax: 20,
      // Screen coords: y=842 at BMI 12, y=140 at BMI 35
      // PDF coords (flipped): y=106 at BMI 12, y=808 at BMI 35
      yMinScreen: 842, yMaxScreen: 140,
      valueMin: 12, valueMax: 35
    }
  }
};

const GrowthChartPage = () => {
  const [gender, setGender] = useState("male");
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

  // Get current PDF URL
  const getPdfUrl = () => {
    return activeChart === 'bmi' 
      ? CDC_PDFS.bmi[gender] 
      : CDC_PDFS.statureWeight[gender];
  };

  // Calculate PDF coordinates for a data point
  // PDF coordinate system: origin at bottom-left, Y increases upward
  const calculatePdfCoords = (age, value, chartType) => {
    const chartData = activeChart === 'bmi' 
      ? CHART_COORDS.bmi 
      : CHART_COORDS.statureWeight;
    
    const coords = chartData[chartType];
    const pageHeight = chartData.pageHeight;
    
    if (!coords) return null;
    
    // Linear interpolation for X (age) - same for both coordinate systems
    const xRatio = (age - coords.ageMin) / (coords.ageMax - coords.ageMin);
    const x = coords.xMin + xRatio * (coords.xMax - coords.xMin);
    
    // Linear interpolation for Y (value) in screen coordinates
    // yMinScreen is at valueMin, yMaxScreen is at valueMax
    const yRatio = (value - coords.valueMin) / (coords.valueMax - coords.valueMin);
    const yScreen = coords.yMinScreen + yRatio * (coords.yMaxScreen - coords.yMinScreen);
    
    // Convert screen Y to PDF Y (flip: PDF Y = pageHeight - screenY)
    const y = pageHeight - yScreen;
    
    return { x, y };
  };

  // Add entry
  const addEntry = () => {
    console.log('addEntry called with:', newEntry);
    if (newEntry.date && newEntry.age) {
      const age = parseFloat(newEntry.age);
      console.log('Parsed age:', age);
      if (age >= 2 && age <= 20) {
        const newEntryWithId = { ...newEntry, id: Date.now() };
        console.log('Adding entry:', newEntryWithId);
        setEntries(prev => {
          const updated = [...prev, newEntryWithId];
          console.log('Updated entries:', updated);
          return updated;
        });
        setNewEntry({ 
          date: new Date().toISOString().split('T')[0], 
          age: "", 
          weight: "", 
          stature: "", 
          bmi: "" 
        });
      } else {
        console.log('Age validation failed:', age);
      }
    } else {
      console.log('Missing date or age');
    }
  };

  // Export PDF with plotted points
  const exportPDF = async () => {
    setExporting(true);
    try {
      // Fetch the original PDF
      const response = await fetch(getPdfUrl());
      const pdfBytes = await response.arrayBuffer();
      
      // Load the PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const page = pdfDoc.getPages()[0];
      
      // Draw points on the PDF
      entries.forEach((entry, index) => {
        const age = parseFloat(entry.age);
        if (isNaN(age) || age < 2 || age > 20) return;
        
        if (activeChart === 'statureWeight') {
          // Plot stature point (blue)
          if (entry.stature) {
            const statureVal = parseFloat(entry.stature);
            const coords = calculatePdfCoords(age, statureVal, 'stature');
            if (coords) {
              // Draw filled circle
              page.drawCircle({
                x: coords.x,
                y: coords.y,
                size: 5,
                color: rgb(0.145, 0.388, 0.922),
                borderColor: rgb(1, 1, 1),
                borderWidth: 1
              });
              // Draw label
              page.drawText(`S${index + 1}`, {
                x: coords.x + 8,
                y: coords.y - 3,
                size: 8,
                color: rgb(0.145, 0.388, 0.922)
              });
            }
          }
          // Plot weight point (red)
          if (entry.weight) {
            const weightVal = parseFloat(entry.weight);
            const coords = calculatePdfCoords(age, weightVal, 'weight');
            if (coords) {
              page.drawCircle({
                x: coords.x,
                y: coords.y,
                size: 5,
                color: rgb(0.863, 0.149, 0.149),
                borderColor: rgb(1, 1, 1),
                borderWidth: 1
              });
              page.drawText(`W${index + 1}`, {
                x: coords.x + 8,
                y: coords.y - 3,
                size: 8,
                color: rgb(0.863, 0.149, 0.149)
              });
            }
          }
        } else {
          // Plot BMI point (purple)
          if (entry.bmi) {
            const bmiVal = parseFloat(entry.bmi);
            const coords = calculatePdfCoords(age, bmiVal, 'bmi');
            if (coords) {
              page.drawCircle({
                x: coords.x,
                y: coords.y,
                size: 5,
                color: rgb(0.486, 0.227, 0.929),
                borderColor: rgb(1, 1, 1),
                borderWidth: 1
              });
              page.drawText(`${index + 1}`, {
                x: coords.x + 8,
                y: coords.y - 3,
                size: 8,
                color: rgb(0.486, 0.227, 0.929)
              });
            }
          }
        }
      });
      
      // Add patient data legend at bottom of page
      if (entries.length > 0) {
        let legendY = 50;
        page.drawText('Patient Data:', {
          x: 50,
          y: legendY,
          size: 9,
          color: rgb(0, 0, 0)
        });
        legendY -= 12;
        
        entries.forEach((entry, index) => {
          let text = `#${index + 1}: ${entry.date}, Age ${entry.age}y`;
          if (entry.stature) text += `, Stature: ${entry.stature}cm`;
          if (entry.weight) text += `, Weight: ${entry.weight}kg`;
          if (entry.bmi) text += `, BMI: ${entry.bmi}`;
          
          page.drawText(text, {
            x: 50,
            y: legendY,
            size: 7,
            color: rgb(0.3, 0.3, 0.3)
          });
          legendY -= 10;
        });
      }
      
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
      alert('Error exporting PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Download blank chart
  const downloadBlankChart = async () => {
    const link = document.createElement('a');
    link.href = getPdfUrl();
    link.download = `cdc-growth-chart-${gender}-${activeChart}.pdf`;
    link.target = '_blank';
    link.click();
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
            Official CDC growth charts with patient data plotting
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

      {/* Chart Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{chartLabels[activeChart]}</CardTitle>
          <CardDescription className="text-xs">
            {gender === 'male' ? 'Boys' : 'Girls'} • Age 2-20 years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Chart Info Box */}
          <div className={`p-4 rounded-lg border-2 ${gender === 'male' ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <FileText className={`h-10 w-10 ${gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} />
              <div>
                <p className="font-medium text-sm">
                  {activeChart === 'statureWeight' ? 'Stature-for-Age & Weight-for-Age' : 'BMI-for-Age'}
                </p>
                <p className="text-xs text-muted-foreground">
                  CDC Growth Chart • {gender === 'male' ? 'Boys' : 'Girls'} • 2-20 years
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Percentiles: 3rd, 5th, 10th, 25th, 50th, 75th, 85th, 90th, 95th, 97th
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={() => window.open(getPdfUrl(), '_blank')}
                variant="outline"
                className="flex-1"
                data-testid="view-pdf-btn"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Chart
              </Button>
              <Button 
                onClick={downloadBlankChart}
                variant="outline"
                className="flex-1"
                data-testid="download-blank-btn"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Blank
              </Button>
            </div>
          </div>
          
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-green-50 border border-green-200">
              <span className="font-medium text-green-700">Normal:</span>
              <span className="text-green-600 ml-1">5th-85th percentile</span>
            </div>
            <div className="p-2 rounded bg-yellow-50 border border-yellow-200">
              <span className="font-medium text-yellow-700">At Risk:</span>
              <span className="text-yellow-600 ml-1">85th-95th percentile</span>
            </div>
            <div className="p-2 rounded bg-red-50 border border-red-200">
              <span className="font-medium text-red-700">Underweight:</span>
              <span className="text-red-600 ml-1">&lt;5th percentile</span>
            </div>
            <div className="p-2 rounded bg-red-50 border border-red-200">
              <span className="font-medium text-red-700">Obese:</span>
              <span className="text-red-600 ml-1">&gt;95th percentile</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Plot Patient Data</CardTitle>
          <CardDescription className="text-xs">
            Add measurements to plot directly on the PDF chart
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
            <Plus className="h-4 w-4 mr-1" />Add Measurement
          </Button>
        </CardContent>
      </Card>

      {/* Patient Measurements */}
      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Patient Measurements ({entries.length})</CardTitle>
            <CardDescription className="text-xs">
              Export to get a PDF with these points plotted on the chart
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {entries.map((entry, index) => (
              <div 
                key={entry.id} 
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-teal-600">
                      #{index + 1} • {entry.date}
                    </span>
                    <span className="text-gray-500 ml-2">Age: {entry.age} years</span>
                  </div>
                  <button 
                    onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} 
                    className="text-red-500 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-sm">
                  {entry.stature && (
                    <span className="text-blue-600 font-medium">
                      Stature: {entry.stature} cm
                    </span>
                  )}
                  {entry.weight && (
                    <span className="text-red-600 font-medium">
                      Weight: {entry.weight} kg
                    </span>
                  )}
                  {entry.bmi && (
                    <span className="text-purple-600 font-medium">
                      BMI: {entry.bmi} kg/m²
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            <Button 
              onClick={exportPDF}
              disabled={exporting}
              className="w-full mt-2"
              data-testid="export-all-btn"
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Creating PDF...' : 'Export Chart with Patient Data'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reference Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">BMI Categories</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <div className="grid grid-cols-1 gap-1">
            <p>• <span className="text-red-600 font-medium">Underweight:</span> BMI &lt; 5th percentile</p>
            <p>• <span className="text-green-600 font-medium">Healthy Weight:</span> BMI 5th to &lt; 85th percentile</p>
            <p>• <span className="text-yellow-600 font-medium">Overweight:</span> BMI 85th to &lt; 95th percentile</p>
            <p>• <span className="text-red-600 font-medium">Obesity:</span> BMI ≥ 95th percentile</p>
          </div>
          <p className="pt-2 border-t text-[10px]">
            Source: CDC Growth Charts (cdc.gov) • Official 2000 CDC growth charts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
