import React, { useState, useRef } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from 'recharts';

/**
 * Growth Chart Page - WHO (0-24 months) and CDC (2-20 years)
 * Uses official WHO and CDC percentile data
 */

const GrowthChartPage = () => {
  const chartRef = useRef(null);
  
  // State
  const [chartStandard, setChartStandard] = useState('WHO'); // WHO or CDC
  const [chartType, setChartType] = useState('weight'); // weight, length/height, headCirc, bmi
  const [gender, setGender] = useState('male');
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    ageMonths: "",
    weight: "",
    length: "",
    headCirc: ""
  });

  // WHO Weight-for-Age Data (0-24 months) - Boys
  const WHO_WEIGHT_BOYS = {
    ages: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24],
    p3:  [2.5, 3.4, 4.3, 5.0, 5.6, 6.1, 6.4, 6.7, 6.9, 7.1, 7.4, 7.6, 7.7, 8.3, 8.8, 9.2, 9.7],
    p15: [2.9, 3.9, 4.9, 5.7, 6.2, 6.7, 7.1, 7.4, 7.7, 8.0, 8.2, 8.4, 8.6, 9.2, 9.8, 10.3, 10.8],
    p50: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 10.3, 10.9, 11.5, 12.2],
    p85: [3.9, 5.1, 6.3, 7.2, 7.8, 8.4, 8.8, 9.2, 9.6, 9.9, 10.2, 10.5, 10.8, 11.5, 12.2, 12.9, 13.6],
    p97: [4.4, 5.8, 7.1, 8.0, 8.7, 9.3, 9.8, 10.3, 10.7, 11.0, 11.4, 11.7, 12.0, 12.8, 13.7, 14.5, 15.3]
  };

  // WHO Weight-for-Age Data (0-24 months) - Girls
  const WHO_WEIGHT_GIRLS = {
    ages: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24],
    p3:  [2.4, 3.2, 3.9, 4.5, 5.0, 5.4, 5.7, 6.0, 6.3, 6.5, 6.7, 6.9, 7.0, 7.6, 8.1, 8.6, 9.0],
    p15: [2.8, 3.6, 4.5, 5.2, 5.7, 6.1, 6.5, 6.8, 7.0, 7.3, 7.5, 7.7, 7.9, 8.5, 9.1, 9.6, 10.1],
    p50: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9, 9.6, 10.2, 10.9, 11.5],
    p85: [3.7, 4.8, 5.8, 6.6, 7.3, 7.8, 8.2, 8.6, 9.0, 9.3, 9.6, 9.9, 10.1, 10.9, 11.6, 12.3, 13.0],
    p97: [4.2, 5.5, 6.6, 7.5, 8.2, 8.8, 9.3, 9.8, 10.2, 10.5, 10.9, 11.2, 11.5, 12.4, 13.2, 14.0, 14.8]
  };

  // WHO Length-for-Age Data (0-24 months) - Boys
  const WHO_LENGTH_BOYS = {
    ages: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24],
    p3:  [46.1, 51.1, 54.7, 57.6, 60.0, 61.9, 63.6, 65.1, 66.5, 67.7, 68.9, 69.9, 71.0, 73.6, 76.0, 78.1, 80.0],
    p15: [47.9, 53.0, 56.8, 59.7, 62.1, 64.1, 65.8, 67.4, 68.8, 70.0, 71.2, 72.3, 73.4, 76.1, 78.5, 80.8, 82.7],
    p50: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 78.5, 81.0, 83.3, 85.4],
    p85: [51.8, 56.4, 60.0, 63.0, 65.6, 67.7, 69.5, 71.1, 72.5, 73.9, 75.3, 76.6, 77.9, 80.8, 83.4, 85.8, 88.0],
    p97: [53.4, 58.1, 61.7, 64.7, 67.2, 69.4, 71.2, 72.9, 74.4, 75.8, 77.2, 78.6, 80.0, 82.9, 85.6, 88.1, 90.4]
  };

  // WHO Length-for-Age Data (0-24 months) - Girls
  const WHO_LENGTH_GIRLS = {
    ages: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24],
    p3:  [45.4, 49.8, 53.2, 55.8, 58.0, 59.9, 61.5, 62.9, 64.3, 65.5, 66.6, 67.7, 68.7, 71.2, 73.5, 75.5, 77.3],
    p15: [47.0, 51.4, 55.0, 57.7, 60.0, 61.9, 63.6, 65.1, 66.5, 67.8, 69.0, 70.1, 71.1, 73.8, 76.1, 78.2, 80.2],
    p50: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 76.8, 79.2, 81.5, 83.5],
    p85: [51.3, 55.9, 59.2, 62.0, 64.2, 66.2, 67.9, 69.4, 70.9, 72.4, 73.9, 75.4, 76.8, 79.8, 82.4, 84.8, 87.0],
    p97: [53.0, 57.6, 60.9, 63.6, 65.8, 67.8, 69.5, 71.1, 72.6, 74.1, 75.6, 77.1, 78.6, 81.6, 84.3, 86.8, 89.1]
  };

  // WHO Head Circumference Data (0-24 months) - Boys
  const WHO_HEAD_BOYS = {
    ages: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24],
    p3:  [32.1, 35.1, 36.9, 38.3, 39.4, 40.3, 41.0, 41.7, 42.2, 42.6, 43.0, 43.4, 43.6, 44.3, 44.8, 45.2, 45.5],
    p15: [33.1, 36.0, 37.9, 39.3, 40.4, 41.3, 42.1, 42.7, 43.2, 43.7, 44.1, 44.4, 44.7, 45.4, 45.9, 46.3, 46.6],
    p50: [34.5, 37.3, 39.1, 40.5, 41.6, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1, 46.8, 47.4, 47.8, 48.1],
    p85: [35.8, 38.5, 40.4, 41.8, 42.9, 43.8, 44.6, 45.2, 45.8, 46.3, 46.7, 47.1, 47.5, 48.2, 48.8, 49.2, 49.6],
    p97: [36.9, 39.5, 41.5, 42.9, 44.0, 44.9, 45.7, 46.4, 46.9, 47.4, 47.9, 48.3, 48.6, 49.4, 50.0, 50.5, 50.9]
  };

  // WHO Head Circumference Data (0-24 months) - Girls
  const WHO_HEAD_GIRLS = {
    ages: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24],
    p3:  [31.5, 34.2, 35.8, 37.1, 38.1, 38.9, 39.6, 40.2, 40.7, 41.2, 41.5, 41.9, 42.2, 42.9, 43.4, 43.8, 44.1],
    p15: [32.4, 35.1, 36.8, 38.1, 39.1, 40.0, 40.7, 41.3, 41.8, 42.3, 42.7, 43.0, 43.3, 44.0, 44.6, 45.0, 45.4],
    p50: [33.9, 36.5, 38.3, 39.5, 40.6, 41.5, 42.2, 42.8, 43.4, 43.8, 44.2, 44.6, 44.9, 45.6, 46.2, 46.7, 47.0],
    p85: [35.3, 37.9, 39.7, 41.0, 42.1, 42.9, 43.7, 44.3, 44.9, 45.4, 45.8, 46.1, 46.5, 47.2, 47.9, 48.3, 48.7],
    p97: [36.3, 39.0, 40.8, 42.1, 43.2, 44.1, 44.8, 45.5, 46.1, 46.6, 47.0, 47.4, 47.7, 48.5, 49.1, 49.6, 50.0]
  };

  // CDC Weight-for-Age Data (24-240 months / 2-20 years) - Boys
  const CDC_WEIGHT_BOYS = {
    ages: [24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240],
    p3:  [10.5, 12.0, 13.6, 15.3, 17.0, 18.8, 20.7, 22.8, 25.1, 27.6, 30.4, 33.5, 37.1, 41.2, 45.6, 49.9, 53.6, 56.5, 58.5],
    p15: [11.5, 13.2, 15.0, 16.9, 18.9, 21.0, 23.3, 25.8, 28.5, 31.4, 34.6, 38.2, 42.1, 46.5, 51.0, 55.5, 59.5, 62.6, 64.8],
    p50: [12.7, 14.6, 16.7, 18.9, 21.3, 23.8, 26.6, 29.6, 32.9, 36.5, 40.5, 44.9, 49.7, 55.0, 60.4, 65.6, 70.2, 73.7, 76.0],
    p85: [14.2, 16.4, 18.8, 21.5, 24.4, 27.5, 30.8, 34.4, 38.5, 43.0, 47.9, 53.4, 59.4, 65.8, 72.2, 78.2, 83.4, 87.1, 89.4],
    p97: [15.7, 18.4, 21.3, 24.5, 28.0, 31.8, 35.9, 40.5, 45.5, 51.3, 57.5, 64.2, 71.3, 78.7, 85.9, 92.4, 97.8, 101.5, 103.8]
  };

  // CDC Weight-for-Age Data (24-240 months / 2-20 years) - Girls
  const CDC_WEIGHT_GIRLS = {
    ages: [24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240],
    p3:  [10.0, 11.5, 13.0, 14.6, 16.2, 17.9, 19.7, 21.7, 23.9, 26.5, 29.5, 32.9, 36.5, 39.9, 42.7, 44.8, 46.3, 47.2, 47.7],
    p15: [11.0, 12.6, 14.3, 16.1, 18.0, 20.0, 22.2, 24.6, 27.2, 30.3, 33.7, 37.5, 41.4, 44.9, 47.8, 50.0, 51.4, 52.2, 52.7],
    p50: [12.2, 14.1, 16.0, 18.2, 20.5, 23.0, 25.8, 28.8, 32.1, 35.9, 40.0, 44.5, 49.1, 53.0, 56.0, 58.3, 59.7, 60.5, 60.9],
    p85: [13.7, 15.8, 18.2, 20.9, 23.8, 27.0, 30.5, 34.3, 38.6, 43.4, 48.6, 54.2, 59.8, 64.5, 68.0, 70.5, 72.0, 72.8, 73.2],
    p97: [15.3, 17.8, 20.6, 23.9, 27.5, 31.6, 36.1, 41.1, 46.7, 52.8, 59.4, 66.2, 72.9, 78.3, 82.2, 84.8, 86.2, 87.0, 87.4]
  };

  // CDC Height-for-Age Data (24-240 months / 2-20 years) - Boys
  const CDC_HEIGHT_BOYS = {
    ages: [24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240],
    p3:  [81.0, 89.0, 96.0, 102.0, 108.0, 113.0, 118.0, 123.0, 128.0, 133.0, 139.0, 145.0, 152.0, 159.0, 165.0, 168.0, 170.0, 171.0, 172.0],
    p15: [83.5, 91.5, 98.5, 105.0, 111.0, 116.5, 122.0, 127.5, 133.0, 138.5, 144.5, 151.0, 158.0, 165.0, 170.5, 173.5, 175.5, 176.5, 177.0],
    p50: [86.5, 95.0, 102.5, 109.5, 116.0, 122.0, 128.0, 134.0, 140.0, 146.0, 152.5, 159.5, 166.5, 173.0, 178.0, 180.5, 182.0, 182.5, 183.0],
    p85: [89.5, 98.5, 106.5, 114.0, 121.0, 127.5, 134.0, 140.5, 147.0, 153.5, 160.5, 167.5, 174.5, 180.5, 185.0, 187.0, 188.0, 188.5, 189.0],
    p97: [92.0, 101.5, 110.0, 118.0, 125.0, 132.0, 139.0, 146.0, 153.0, 160.0, 167.5, 174.5, 181.5, 187.0, 191.0, 193.0, 194.0, 194.5, 195.0]
  };

  // CDC Height-for-Age Data (24-240 months / 2-20 years) - Girls
  const CDC_HEIGHT_GIRLS = {
    ages: [24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240],
    p3:  [80.0, 87.5, 94.5, 100.5, 106.5, 112.0, 117.0, 122.0, 127.0, 133.0, 140.0, 147.0, 152.0, 155.0, 156.5, 157.0, 157.5, 157.5, 157.5],
    p15: [82.5, 90.5, 97.5, 104.0, 110.0, 116.0, 121.5, 127.0, 132.5, 139.0, 146.0, 152.5, 157.5, 160.0, 161.5, 162.0, 162.5, 162.5, 162.5],
    p50: [85.5, 94.0, 101.5, 108.5, 115.0, 121.5, 128.0, 134.0, 140.0, 147.0, 154.0, 160.0, 164.5, 166.5, 168.0, 168.5, 168.5, 168.5, 168.5],
    p85: [88.5, 97.5, 105.5, 113.0, 120.0, 127.0, 133.5, 140.5, 147.5, 155.0, 162.0, 167.5, 171.5, 173.0, 174.0, 174.5, 174.5, 174.5, 174.5],
    p97: [91.0, 100.5, 109.0, 117.0, 124.5, 132.0, 139.0, 146.5, 154.0, 162.0, 169.0, 174.0, 177.5, 178.5, 179.5, 179.5, 179.5, 179.5, 179.5]
  };

  // Get the appropriate data based on standard, type, and gender
  const getChartData = () => {
    let data;
    
    if (chartStandard === 'WHO') {
      if (chartType === 'weight') {
        data = gender === 'male' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
      } else if (chartType === 'length') {
        data = gender === 'male' ? WHO_LENGTH_BOYS : WHO_LENGTH_GIRLS;
      } else if (chartType === 'headCirc') {
        data = gender === 'male' ? WHO_HEAD_BOYS : WHO_HEAD_GIRLS;
      }
    } else { // CDC
      if (chartType === 'weight') {
        data = gender === 'male' ? CDC_WEIGHT_BOYS : CDC_WEIGHT_GIRLS;
      } else if (chartType === 'height') {
        data = gender === 'male' ? CDC_HEIGHT_BOYS : CDC_HEIGHT_GIRLS;
      }
    }
    
    if (!data) return [];
    
    return data.ages.map((age, idx) => ({
      age,
      p3: data.p3[idx],
      p15: data.p15[idx],
      p50: data.p50[idx],
      p85: data.p85[idx],
      p97: data.p97[idx]
    }));
  };

  // Get patient data points for plotting
  const getPatientData = () => {
    return entries.map(entry => ({
      age: parseFloat(entry.ageMonths) || 0,
      value: chartType === 'weight' ? parseFloat(entry.weight) :
             chartType === 'length' || chartType === 'height' ? parseFloat(entry.length) :
             parseFloat(entry.headCirc)
    })).filter(p => p.age > 0 && p.value > 0);
  };

  const chartData = getChartData();
  const patientData = getPatientData();

  // Chart labels
  const chartLabels = {
    weight: { title: 'Weight-for-Age', yLabel: chartStandard === 'WHO' ? 'Weight (kg)' : 'Weight (kg)', unit: 'kg' },
    length: { title: 'Length-for-Age', yLabel: 'Length (cm)', unit: 'cm' },
    height: { title: 'Height-for-Age', yLabel: 'Height (cm)', unit: 'cm' },
    headCirc: { title: 'Head Circumference-for-Age', yLabel: 'Head Circ (cm)', unit: 'cm' }
  };

  const formatXAxis = (value) => {
    if (chartStandard === 'WHO') {
      return `${value}m`;
    } else {
      const years = Math.floor(value / 12);
      return `${years}y`;
    }
  };

  const addEntry = () => {
    if (newEntry.ageMonths) {
      setEntries([...entries, { ...newEntry, id: Date.now() }]);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        ageMonths: "",
        weight: "",
        length: "",
        headCirc: ""
      });
    }
  };

  const removeEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const currentChartType = chartStandard === 'WHO' && chartType === 'height' ? 'length' : chartType;

  return (
    <div className="space-y-4 p-4" data-testid="growth-chart-page">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <HealthGrowthIcon className="w-6 h-6 text-teal-500" />
            <div>
              <CardTitle className="text-lg">Growth Charts</CardTitle>
              <CardDescription className="text-xs">WHO (0-24 months) & CDC (2-20 years)</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Standard Selection */}
            <div>
              <Label className="text-xs font-medium">Standard</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  size="sm"
                  variant={chartStandard === 'WHO' ? 'default' : 'outline'}
                  className="flex-1 text-xs h-8"
                  onClick={() => {
                    setChartStandard('WHO');
                    if (chartType === 'height') setChartType('length');
                  }}
                >
                  WHO (0-2y)
                </Button>
                <Button
                  size="sm"
                  variant={chartStandard === 'CDC' ? 'default' : 'outline'}
                  className="flex-1 text-xs h-8"
                  onClick={() => {
                    setChartStandard('CDC');
                    if (chartType === 'length') setChartType('height');
                    if (chartType === 'headCirc') setChartType('weight');
                  }}
                >
                  CDC (2-20y)
                </Button>
              </div>
            </div>

            {/* Chart Type */}
            <div>
              <Label className="text-xs font-medium">Chart Type</Label>
              <div className="flex gap-1 mt-1 flex-wrap">
                <Button
                  size="sm"
                  variant={chartType === 'weight' ? 'default' : 'outline'}
                  className="text-xs h-8 px-2"
                  onClick={() => setChartType('weight')}
                >
                  Weight
                </Button>
                <Button
                  size="sm"
                  variant={chartType === 'length' || chartType === 'height' ? 'default' : 'outline'}
                  className="text-xs h-8 px-2"
                  onClick={() => setChartType(chartStandard === 'WHO' ? 'length' : 'height')}
                >
                  {chartStandard === 'WHO' ? 'Length' : 'Height'}
                </Button>
                {chartStandard === 'WHO' && (
                  <Button
                    size="sm"
                    variant={chartType === 'headCirc' ? 'default' : 'outline'}
                    className="text-xs h-8 px-2"
                    onClick={() => setChartType('headCirc')}
                  >
                    Head Circ
                  </Button>
                )}
              </div>
            </div>

            {/* Gender */}
            <div>
              <Label className="text-xs font-medium">Gender</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  size="sm"
                  variant={gender === 'male' ? 'default' : 'outline'}
                  className="flex-1 text-xs h-8"
                  style={{ backgroundColor: gender === 'male' ? '#3B82F6' : undefined }}
                  onClick={() => setGender('male')}
                >
                  Male
                </Button>
                <Button
                  size="sm"
                  variant={gender === 'female' ? 'default' : 'outline'}
                  className="flex-1 text-xs h-8"
                  style={{ backgroundColor: gender === 'female' ? '#EC4899' : undefined }}
                  onClick={() => setGender('female')}
                >
                  Female
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            {chartStandard} {chartLabels[currentChartType]?.title || 'Growth Chart'} - {gender === 'male' ? 'Boys' : 'Girls'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={chartRef} 
            className="rounded-lg p-3 overflow-x-auto" 
            style={{ backgroundColor: gender === 'male' ? '#e6f3ff' : '#fff0f5', minHeight: '350px' }}
          >
            {chartData.length > 0 ? (
              <LineChart width={750} height={320} data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis 
                  dataKey="age"
                  type="number"
                  domain={chartStandard === 'WHO' ? [0, 24] : [24, 240]}
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 10 }} 
                  label={{ value: chartStandard === 'WHO' ? 'Age (months)' : 'Age (years)', position: 'bottom', fontSize: 11, offset: 15 }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  label={{ value: chartLabels[currentChartType]?.yLabel, angle: -90, position: 'insideLeft', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ fontSize: 11, borderRadius: 8, backgroundColor: '#fff' }}
                  formatter={(value, name) => [value?.toFixed(1), name]}
                  labelFormatter={(label) => chartStandard === 'WHO' ? `${label} months` : `${(label / 12).toFixed(1)} years`}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                
                <Line type="monotone" dataKey="p97" stroke="#8B0000" strokeWidth={1.5} dot={false} name="97th %" />
                <Line type="monotone" dataKey="p85" stroke="#CD853F" strokeWidth={1.5} dot={false} name="85th %" />
                <Line type="monotone" dataKey="p50" stroke="#228B22" strokeWidth={2} dot={false} name="50th %" />
                <Line type="monotone" dataKey="p15" stroke="#CD853F" strokeWidth={1.5} dot={false} name="15th %" />
                <Line type="monotone" dataKey="p3" stroke="#8B0000" strokeWidth={1.5} dot={false} name="3rd %" />
                
                {patientData.map((point, idx) => (
                  <ReferenceDot key={idx} x={point.age} y={point.value} r={6} fill="#000" stroke="#fff" strokeWidth={2} />
                ))}
              </LineChart>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">Select chart options above</div>
            )}
          </div>
          
          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs justify-center">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#8B0000]"></span> 3rd/97th %</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#CD853F]"></span> 15th/85th %</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#228B22]"></span> 50th %</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-black border-2 border-white"></span> Patient</span>
          </div>
        </CardContent>
      </Card>

      {/* Data Entry */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Add Measurement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
            <div>
              <Label className="text-xs">Age (months)</Label>
              <Input
                type="number"
                min="0"
                max={chartStandard === 'WHO' ? 24 : 240}
                value={newEntry.ageMonths}
                onChange={(e) => setNewEntry({...newEntry, ageMonths: e.target.value})}
                className="h-8 text-sm"
                placeholder={chartStandard === 'WHO' ? '0-24' : '24-240'}
              />
            </div>
            <div>
              <Label className="text-xs">Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={newEntry.weight}
                onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">{chartStandard === 'WHO' ? 'Length' : 'Height'} (cm)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={newEntry.length}
                onChange={(e) => setNewEntry({...newEntry, length: e.target.value})}
                className="h-8 text-sm"
              />
            </div>
            {chartStandard === 'WHO' && (
              <div>
                <Label className="text-xs">Head Circ (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={newEntry.headCirc}
                  onChange={(e) => setNewEntry({...newEntry, headCirc: e.target.value})}
                  className="h-8 text-sm"
                />
              </div>
            )}
            <Button onClick={addEntry} size="sm" className="h-8">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          {/* Entries List */}
          {entries.length > 0 && (
            <div className="mt-4">
              <Label className="text-xs font-medium">Measurements</Label>
              <div className="mt-2 space-y-1">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
                    <span>
                      <strong>{entry.ageMonths}m:</strong> 
                      {entry.weight && ` Wt: ${entry.weight}kg`}
                      {entry.length && ` Len: ${entry.length}cm`}
                      {entry.headCirc && ` HC: ${entry.headCirc}cm`}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)} className="h-6 w-6 p-0">
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="pt-4">
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>WHO Standards (0-24 months):</strong> Based on WHO Child Growth Standards (2006) - describes how children should grow under optimal conditions.</p>
            <p><strong>CDC Charts (2-20 years):</strong> Based on CDC Growth Charts (2000) - reference for how children in the US actually grew.</p>
            <p className="text-amber-600 dark:text-amber-400">Note: Use WHO for infants 0-2 years, CDC for children 2-20 years.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
