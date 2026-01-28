import React, { useState, useRef } from "react";
import { Plus, Trash2, Download, Maximize2, Minimize2, ExternalLink } from "lucide-react";
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
// Calibrated to CDC PDF layout (PDF coordinates - origin at bottom-left)
// Standard CDC charts are letter size: 612 x 792 points
const CHART_COORDS = {
  statureWeight: {
    // Stature chart area (top chart on combined PDF)
    stature: {
      xMin: 122, xMax: 559,
      ageMin: 2, ageMax: 20,
      yMin: 385, yMax: 710,
      valueMin: 77, valueMax: 200
    },
    // Weight chart area (bottom chart on combined PDF)
    weight: {
      xMin: 122, xMax: 559,
      ageMin: 2, ageMax: 20,
      yMin: 82, yMax: 340,
      valueMin: 8, valueMax: 105
    }
  },
  bmi: {
    bmi: {
      xMin: 122, xMax: 559,
      ageMin: 2, ageMax: 20,
      yMin: 100, yMax: 680,
      valueMin: 12, valueMax: 35
    }
  }
};

const GrowthChartPage = () => {
  const [gender, setGender] = useState("male");
  const [activeChart, setActiveChart] = useState("statureWeight");
  const [entries, setEntries] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2" 
          onClick={() => setIsFullscreen(false)}
        >
          <div 
            className="relative bg-white rounded-lg w-full h-full max-w-[98vw] max-h-[98vh] flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 border-b">
              <div>
                <h3 className="text-lg font-semibold">{chartLabels[activeChart]}</h3>
                <p className="text-sm text-muted-foreground">
                  CDC • {gender === 'male' ? 'Boys' : 'Girls'} • 2-20 years
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportPDF}
                  disabled={exporting || entries.length === 0}
                  className="h-9 px-3"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {exporting ? 'Exporting...' : 'Export with Data'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(getPdfUrl(), '_blank')}
                  className="h-9 px-3"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />Open Original
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsFullscreen(false)} 
                  className="h-9 w-9 p-0"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-2">
              <iframe
                src={`${getPdfUrl()}#view=FitH`}
                className="w-full h-full border-0 rounded"
                title="CDC Growth Chart"
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
                CDC • {gender === 'male' ? 'Boys' : 'Girls'} • Official CDC growth chart PDF
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportPDF}
                disabled={exporting || entries.length === 0}
                className="h-8 px-2"
                data-testid="export-pdf-btn"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                {exporting ? '...' : 'PDF'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFullscreen(true)} 
                className="h-8 w-8 p-0"
                data-testid="fullscreen-btn"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            <iframe
              src={`${getPdfUrl()}#view=FitH`}
              className="w-full h-full border-0"
              title="CDC Growth Chart"
            />
          </div>
          
          {/* Instructions */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
            <p className="font-medium mb-1">How to use:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Add patient measurements using the form below</li>
              <li>Click "PDF" button to export the chart with your data points plotted</li>
              <li>Use fullscreen mode for better viewing</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Add Patient Measurement</CardTitle>
          <CardDescription className="text-xs">
            Data will be plotted on the PDF when exported • Age range: 2-20 years
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
              These will be plotted on the PDF when you export
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
              {exporting ? 'Exporting PDF...' : 'Export PDF with All Data Points'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reference Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p className="font-medium">CDC Percentiles:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p>• <span className="text-green-600 font-medium">5th-85th:</span> Healthy weight</p>
              <p>• <span className="text-yellow-600 font-medium">85th-95th:</span> Overweight</p>
            </div>
            <div>
              <p>• <span className="text-red-600 font-medium">&lt;5th:</span> Underweight</p>
              <p>• <span className="text-red-600 font-medium">&gt;95th:</span> Obese</p>
            </div>
          </div>
          <p className="pt-2 border-t text-[10px]">
            Source: CDC Growth Charts (cdc.gov) • Official CDC PDF charts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
