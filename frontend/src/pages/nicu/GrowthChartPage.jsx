import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

// Growth Chart Page - CDC/WHO Charts for Weight, Height, Head Circumference
const GrowthChartPage = () => {
  const [chartType, setChartType] = useState("WHO"); // CDC or WHO
  const [gender, setGender] = useState("male");
  const [activeChart, setActiveChart] = useState("weight"); // weight, length, hc
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    ageValue: "",
    weight: "",
    length: "",
    hc: ""
  });
  const chartRef = React.useRef(null);

  // Check if WHO or CDC is selected
  const isWHO = chartType === "WHO";

  const addEntry = () => {
    if (newEntry.date && newEntry.ageValue) {
      // Convert to months: WHO uses months directly, CDC uses years
      const ageInMonths = isWHO 
        ? parseFloat(newEntry.ageValue) || 0
        : (parseFloat(newEntry.ageValue) || 0) * 12;
      
      setEntries([...entries, { 
        ...newEntry, 
        id: Date.now(),
        ageInMonths,
        ageUnit: isWHO ? 'months' : 'years',
        chartTypeUsed: chartType
      }]);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        ageValue: "",
        weight: "",
        length: "",
        hc: ""
      });
    }
  };

  const removeEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // WHO Growth Standards Data (Birth to 2 years - 0-24 months)
  const getWHOData = () => {
    return {
      weight: {
        male: {
          p3:  [2.5, 3.4, 4.3, 5.0, 5.6, 6.0, 6.4, 6.7, 6.9, 7.1, 7.4, 7.6, 7.7, 7.9, 8.1, 8.3, 8.4, 8.6, 8.8, 8.9, 9.1, 9.2, 9.4, 9.5, 9.7],
          p15: [2.9, 3.9, 4.9, 5.7, 6.2, 6.7, 7.1, 7.4, 7.7, 8.0, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2, 9.4, 9.6, 9.7, 9.9, 10.1, 10.3, 10.4, 10.6, 10.8],
          p50: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.8, 12.0, 12.2],
          p85: [3.9, 5.1, 6.3, 7.2, 7.8, 8.4, 8.8, 9.2, 9.6, 9.9, 10.2, 10.5, 10.8, 11.0, 11.3, 11.5, 11.8, 12.0, 12.2, 12.5, 12.7, 12.9, 13.2, 13.4, 13.7],
          p97: [4.4, 5.8, 7.1, 8.0, 8.7, 9.3, 9.8, 10.3, 10.7, 11.0, 11.4, 11.7, 12.0, 12.3, 12.6, 12.8, 13.1, 13.4, 13.7, 13.9, 14.2, 14.5, 14.7, 15.0, 15.3]
        },
        female: {
          p3:  [2.4, 3.2, 3.9, 4.5, 5.0, 5.4, 5.7, 6.0, 6.3, 6.5, 6.7, 6.9, 7.0, 7.2, 7.4, 7.6, 7.7, 7.9, 8.1, 8.2, 8.4, 8.6, 8.7, 8.9, 9.0],
          p15: [2.8, 3.6, 4.5, 5.2, 5.7, 6.1, 6.5, 6.8, 7.0, 7.3, 7.5, 7.7, 7.9, 8.1, 8.3, 8.5, 8.7, 8.9, 9.1, 9.2, 9.4, 9.6, 9.8, 10.0, 10.2],
          p50: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9, 9.2, 9.4, 9.6, 9.8, 10.0, 10.2, 10.4, 10.6, 10.9, 11.1, 11.3, 11.5],
          p85: [3.7, 4.8, 5.8, 6.6, 7.3, 7.8, 8.2, 8.6, 9.0, 9.3, 9.6, 9.9, 10.1, 10.4, 10.6, 10.9, 11.1, 11.4, 11.6, 11.9, 12.1, 12.4, 12.6, 12.9, 13.1],
          p97: [4.2, 5.5, 6.6, 7.5, 8.2, 8.8, 9.3, 9.8, 10.2, 10.5, 10.9, 11.2, 11.5, 11.8, 12.1, 12.4, 12.6, 12.9, 13.2, 13.5, 13.8, 14.1, 14.4, 14.7, 15.0]
        }
      },
      length: {
        male: {
          p3:  [46.1, 51.1, 54.7, 57.6, 60.0, 61.9, 63.6, 65.1, 66.5, 67.7, 68.9, 70.0, 71.0, 72.0, 72.9, 73.8, 74.7, 75.5, 76.3, 77.1, 77.9, 78.6, 79.4, 80.1, 80.8],
          p15: [47.9, 53.0, 56.8, 59.8, 62.2, 64.2, 65.9, 67.5, 68.9, 70.2, 71.4, 72.5, 73.6, 74.6, 75.6, 76.5, 77.4, 78.3, 79.1, 79.9, 80.7, 81.5, 82.2, 83.0, 83.7],
          p50: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8],
          p85: [51.8, 56.4, 60.1, 63.1, 65.6, 67.6, 69.4, 71.0, 72.5, 73.8, 75.1, 76.4, 77.6, 78.8, 79.9, 81.0, 82.0, 83.0, 84.0, 84.9, 85.8, 86.7, 87.6, 88.4, 89.3],
          p97: [53.4, 58.0, 61.6, 64.6, 67.0, 69.1, 70.9, 72.5, 74.0, 75.4, 76.7, 78.0, 79.2, 80.4, 81.5, 82.6, 83.7, 84.7, 85.6, 86.6, 87.5, 88.4, 89.2, 90.1, 90.9]
        },
        female: {
          p3:  [45.4, 50.0, 53.2, 55.8, 57.9, 59.6, 61.2, 62.6, 63.9, 65.1, 66.2, 67.3, 68.3, 69.3, 70.2, 71.1, 72.0, 72.8, 73.6, 74.4, 75.2, 76.0, 76.7, 77.5, 78.2],
          p15: [47.0, 51.7, 55.1, 57.8, 60.0, 61.8, 63.4, 64.9, 66.3, 67.5, 68.7, 69.8, 70.9, 71.9, 72.8, 73.7, 74.6, 75.4, 76.2, 77.0, 77.8, 78.5, 79.3, 80.0, 80.7],
          p50: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.6, 85.5, 86.4],
          p85: [51.0, 55.6, 59.0, 61.8, 64.2, 66.1, 67.9, 69.5, 71.0, 72.4, 73.8, 75.1, 76.3, 77.5, 78.6, 79.7, 80.8, 81.8, 82.8, 83.7, 84.7, 85.6, 86.5, 87.3, 88.2],
          p97: [52.7, 57.3, 60.8, 63.6, 66.0, 68.0, 69.8, 71.4, 72.9, 74.4, 75.8, 77.1, 78.3, 79.5, 80.6, 81.7, 82.8, 83.8, 84.8, 85.7, 86.6, 87.5, 88.4, 89.2, 90.0]
        }
      },
      hc: {
        male: {
          p3:  [32.1, 35.2, 37.0, 38.3, 39.4, 40.3, 41.0, 41.7, 42.2, 42.7, 43.1, 43.5, 43.9, 44.2, 44.5, 44.8, 45.0, 45.3, 45.5, 45.7, 45.9, 46.1, 46.3, 46.5, 46.6],
          p15: [33.4, 36.4, 38.3, 39.6, 40.7, 41.6, 42.4, 43.0, 43.6, 44.1, 44.5, 44.9, 45.3, 45.6, 45.9, 46.2, 46.5, 46.7, 47.0, 47.2, 47.4, 47.6, 47.8, 48.0, 48.2],
          p50: [34.5, 37.3, 39.1, 40.5, 41.6, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1, 46.5, 46.7, 47.0, 47.3, 47.5, 47.8, 48.0, 48.2, 48.4, 48.6, 48.8, 49.0],
          p85: [35.6, 38.2, 40.0, 41.4, 42.5, 43.5, 44.3, 44.9, 45.5, 46.0, 46.4, 46.8, 47.1, 47.4, 47.7, 48.0, 48.2, 48.5, 48.7, 48.9, 49.1, 49.3, 49.5, 49.7, 49.9],
          p97: [36.6, 39.1, 40.9, 42.3, 43.4, 44.3, 45.1, 45.8, 46.3, 46.8, 47.3, 47.6, 48.0, 48.3, 48.6, 48.9, 49.1, 49.4, 49.6, 49.8, 50.0, 50.2, 50.4, 50.6, 50.8]
        },
        female: {
          p3:  [31.5, 34.3, 35.9, 37.1, 38.1, 38.9, 39.6, 40.2, 40.7, 41.1, 41.5, 41.9, 42.2, 42.5, 42.8, 43.0, 43.3, 43.5, 43.7, 43.9, 44.1, 44.3, 44.5, 44.7, 44.8],
          p15: [32.7, 35.5, 37.2, 38.4, 39.4, 40.2, 40.9, 41.5, 42.0, 42.5, 42.9, 43.2, 43.6, 43.9, 44.2, 44.4, 44.7, 44.9, 45.1, 45.3, 45.5, 45.7, 45.9, 46.1, 46.3],
          p50: [33.9, 36.5, 38.3, 39.5, 40.6, 41.5, 42.2, 42.8, 43.4, 43.8, 44.2, 44.6, 44.9, 45.2, 45.5, 45.8, 46.0, 46.2, 46.5, 46.7, 46.9, 47.1, 47.3, 47.5, 47.6],
          p85: [35.0, 37.6, 39.3, 40.6, 41.7, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1, 46.4, 46.7, 47.0, 47.2, 47.5, 47.7, 47.9, 48.1, 48.3, 48.5, 48.7, 48.9],
          p97: [35.9, 38.5, 40.2, 41.5, 42.6, 43.5, 44.3, 44.9, 45.5, 46.0, 46.4, 46.8, 47.2, 47.5, 47.8, 48.0, 48.3, 48.5, 48.8, 49.0, 49.2, 49.4, 49.6, 49.8, 50.0]
        }
      }
    };
  };

  // CDC Growth Data (2-20 years)
  const getCDCData = () => {
    return {
      weight: {
        male: {
          p3:  [10.5, 12.5, 14.0, 15.5, 17.0, 19.0, 21.0, 23.5, 26.0, 29.0, 32.5, 36.5, 41.0, 46.0, 51.5, 56.5, 60.5, 63.5, 65.5],
          p15: [11.5, 13.5, 15.5, 17.0, 19.0, 21.5, 24.0, 27.0, 30.0, 34.0, 38.5, 43.5, 49.0, 55.0, 61.0, 66.5, 71.0, 74.5, 77.0],
          p50: [12.5, 14.5, 16.5, 18.5, 21.0, 24.0, 27.5, 31.0, 35.0, 40.0, 45.5, 51.5, 58.0, 65.0, 72.0, 78.0, 83.0, 86.5, 89.0],
          p85: [14.0, 16.0, 18.5, 21.0, 24.0, 28.0, 32.5, 37.5, 43.0, 50.0, 57.5, 65.0, 73.0, 81.0, 89.0, 96.0, 101.5, 105.5, 108.5],
          p97: [15.5, 18.0, 21.0, 24.5, 28.5, 33.5, 39.5, 46.5, 54.0, 63.0, 73.0, 83.5, 94.0, 104.5, 114.0, 122.0, 128.5, 133.0, 136.5]
        },
        female: {
          p3:  [10.0, 12.0, 13.5, 15.0, 16.5, 18.5, 20.5, 23.0, 25.5, 28.5, 32.0, 35.5, 39.0, 42.5, 45.5, 47.5, 48.5, 49.0, 49.5],
          p15: [11.0, 13.0, 15.0, 16.5, 18.5, 21.0, 23.5, 26.5, 30.0, 34.0, 38.5, 43.0, 47.5, 51.5, 55.0, 57.5, 59.0, 60.0, 60.5],
          p50: [12.0, 14.5, 16.5, 18.5, 21.0, 24.0, 27.5, 31.5, 36.0, 41.5, 47.5, 53.5, 59.0, 64.0, 68.0, 71.0, 73.0, 74.5, 75.5],
          p85: [13.5, 16.0, 18.5, 21.5, 25.0, 29.0, 33.5, 39.0, 45.5, 53.0, 61.0, 69.0, 76.5, 83.0, 88.5, 92.5, 95.5, 97.5, 99.0],
          p97: [15.0, 18.0, 21.5, 25.5, 30.0, 35.5, 42.0, 49.5, 58.0, 68.0, 78.5, 89.0, 98.5, 107.0, 114.0, 119.5, 123.5, 126.5, 128.5]
        }
      },
      length: {
        male: {
          p3:  [82, 90, 97, 103, 108, 113, 118, 123, 128, 133, 138, 144, 151, 159, 165, 169, 172, 173, 174],
          p15: [85, 93, 100, 106, 112, 118, 123, 128, 133, 139, 145, 151, 158, 166, 172, 176, 179, 180, 181],
          p50: [88, 96, 103, 110, 116, 122, 128, 134, 140, 146, 152, 159, 166, 173, 179, 183, 186, 188, 189],
          p85: [91, 99, 107, 114, 121, 127, 133, 139, 146, 153, 160, 167, 174, 180, 186, 190, 193, 195, 196],
          p97: [94, 102, 110, 117, 124, 131, 138, 144, 151, 159, 166, 174, 181, 187, 192, 196, 199, 201, 202]
        },
        female: {
          p3:  [81, 89, 96, 101, 106, 111, 116, 121, 126, 132, 138, 144, 149, 152, 154, 155, 156, 156, 156],
          p15: [84, 92, 99, 105, 110, 116, 121, 127, 132, 138, 145, 151, 156, 159, 161, 162, 163, 163, 163],
          p50: [87, 95, 102, 109, 115, 121, 127, 133, 139, 145, 152, 158, 163, 166, 168, 169, 170, 170, 170],
          p85: [90, 98, 106, 113, 119, 126, 132, 138, 145, 152, 159, 165, 170, 173, 175, 176, 177, 178, 178],
          p97: [93, 101, 109, 116, 123, 130, 137, 144, 151, 158, 165, 171, 176, 179, 181, 183, 184, 184, 185]
        }
      },
      hc: {
        male: {
          p3:  [46.6, 48.0, 48.8, 49.4, 49.8, 50.2, 50.5, 50.8, 51.0, 51.2, 51.4, 51.6, 51.8, 52.0, 52.2, 52.4, 52.5, 52.6, 52.7],
          p15: [47.8, 49.2, 50.0, 50.6, 51.0, 51.4, 51.8, 52.0, 52.3, 52.5, 52.7, 52.9, 53.1, 53.3, 53.5, 53.7, 53.9, 54.0, 54.1],
          p50: [49.0, 50.4, 51.2, 51.8, 52.3, 52.7, 53.0, 53.3, 53.6, 53.9, 54.1, 54.3, 54.5, 54.7, 54.9, 55.1, 55.3, 55.5, 55.6],
          p85: [50.2, 51.6, 52.4, 53.0, 53.5, 54.0, 54.3, 54.6, 54.9, 55.2, 55.5, 55.7, 55.9, 56.1, 56.3, 56.5, 56.7, 56.9, 57.0],
          p97: [51.4, 52.8, 53.6, 54.3, 54.8, 55.2, 55.6, 55.9, 56.2, 56.5, 56.8, 57.0, 57.2, 57.5, 57.7, 57.9, 58.1, 58.3, 58.4]
        },
        female: {
          p3:  [45.5, 46.8, 47.5, 48.0, 48.4, 48.7, 49.0, 49.2, 49.4, 49.6, 49.8, 50.0, 50.2, 50.3, 50.4, 50.5, 50.6, 50.7, 50.8],
          p15: [46.6, 48.0, 48.7, 49.2, 49.6, 50.0, 50.3, 50.5, 50.8, 51.0, 51.2, 51.4, 51.6, 51.8, 51.9, 52.0, 52.1, 52.2, 52.3],
          p50: [47.8, 49.2, 50.0, 50.5, 51.0, 51.4, 51.7, 52.0, 52.3, 52.5, 52.8, 53.0, 53.2, 53.4, 53.5, 53.7, 53.8, 53.9, 54.0],
          p85: [49.0, 50.4, 51.2, 51.8, 52.3, 52.7, 53.0, 53.4, 53.7, 54.0, 54.2, 54.5, 54.7, 54.9, 55.1, 55.2, 55.4, 55.5, 55.6],
          p97: [50.2, 51.6, 52.5, 53.1, 53.6, 54.1, 54.5, 54.8, 55.1, 55.4, 55.7, 55.9, 56.2, 56.4, 56.6, 56.8, 56.9, 57.0, 57.1]
        }
      }
    };
  };

  // Get chart data based on selected options
  const getChartData = () => {
    const data = isWHO ? getWHOData() : getCDCData();
    const measurementData = data[activeChart][gender];
    
    if (isWHO) {
      return Array.from({ length: 25 }, (_, i) => ({
        age: i,
        ageLabel: i === 0 ? 'Birth' : i === 12 ? '1 yr' : i === 24 ? '2 yr' : `${i}`,
        p3: measurementData.p3[i],
        p15: measurementData.p15[i],
        p50: measurementData.p50[i],
        p85: measurementData.p85[i],
        p97: measurementData.p97[i]
      }));
    } else {
      return Array.from({ length: 19 }, (_, i) => ({
        age: (i + 2) * 12,
        ageLabel: `${i + 2}`,
        p3: measurementData.p3[i],
        p15: measurementData.p15[i],
        p50: measurementData.p50[i],
        p85: measurementData.p85[i],
        p97: measurementData.p97[i]
      }));
    }
  };

  // Get patient data points for plotting
  const getPatientData = () => {
    const value = activeChart === 'length' ? 'length' : activeChart;
    return entries
      .filter(e => e[value])
      .map(e => ({
        age: e.ageInMonths,
        value: parseFloat(e[value]),
        date: e.date
      }))
      .sort((a, b) => a.age - b.age);
  };

  const chartLabels = {
    weight: { title: "Weight-for-Age", unit: "kg", yLabel: "Weight (kg)" },
    length: { title: "Length/Stature-for-Age", unit: "cm", yLabel: "Length (cm)" },
    hc: { title: "Head Circumference-for-Age", unit: "cm", yLabel: "Head Circumference (cm)" }
  };

  // Save chart to gallery
  const saveToGallery = async () => {
    if (!chartRef.current) return;
    
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `growth-chart-${activeChart}-${gender}-${chartType}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const patientData = getPatientData();
  const chartData = getChartData();
  
  // Chart configuration
  const xAxisDomain = isWHO ? [0, 24] : [24, 240];
  const xAxisTicks = isWHO 
    ? [0, 3, 6, 9, 12, 15, 18, 21, 24]
    : [24, 48, 72, 96, 120, 144, 168, 192, 216, 240];

  // Percentile colors
  const percentileColors = {
    p3: '#8B0000',
    p15: '#CD853F',
    p50: '#228B22',
    p85: '#CD853F',
    p97: '#8B0000'
  };

  const formatXAxis = (value) => {
    if (isWHO) {
      if (value === 0) return 'Birth';
      if (value === 12) return '1yr';
      if (value === 24) return '2yr';
      return `${value}`;
    } else {
      return `${value / 12}`;
    }
  };

  const formatAge = (entry) => {
    const val = parseFloat(entry.ageValue) || 0;
    return entry.ageUnit === 'years' ? `${val}y` : `${val}m`;
  };

  // Calculate Z-score and percentile
  const calculateZScoreAndPercentile = (ageInMonths, value, measureType) => {
    if (!value || isNaN(parseFloat(value))) return null;
    
    const val = parseFloat(value);
    const isWHOChart = chartType === "WHO";
    const data = isWHOChart ? getWHOData() : getCDCData();
    const measureData = data[measureType]?.[gender];
    
    if (!measureData) return null;
    
    let ageIndex;
    if (isWHOChart) {
      ageIndex = Math.round(ageInMonths);
      if (ageIndex < 0) ageIndex = 0;
      if (ageIndex > 24) ageIndex = 24;
    } else {
      const yearIndex = Math.round(ageInMonths / 12) - 2;
      if (yearIndex < 0) ageIndex = 0;
      else if (yearIndex > 18) ageIndex = 18;
      else ageIndex = yearIndex;
    }
    
    const p3 = measureData.p3[ageIndex];
    const p15 = measureData.p15[ageIndex];
    const p50 = measureData.p50[ageIndex];
    const p85 = measureData.p85[ageIndex];
    const p97 = measureData.p97[ageIndex];
    
    const sd = (p97 - p3) / 3.76;
    const zScore = (val - p50) / sd;
    const percentile = Math.round(100 * (0.5 * (1 + Math.tanh(0.8 * zScore))));
    
    let interpretation = "";
    let color = "";
    if (percentile < 3) {
      interpretation = "Severely below normal";
      color = "text-red-600";
    } else if (percentile < 15) {
      interpretation = "Below normal - monitor";
      color = "text-orange-500";
    } else if (percentile <= 85) {
      interpretation = "Normal range";
      color = "text-green-600";
    } else if (percentile <= 97) {
      interpretation = "Above normal - monitor";
      color = "text-orange-500";
    } else {
      interpretation = "Significantly above normal";
      color = "text-red-600";
    }
    
    return {
      zScore: zScore.toFixed(2),
      percentile: Math.max(1, Math.min(99, percentile)),
      interpretation,
      color,
      p3, p15, p50, p85, p97
    };
  };

  const getEntryInterpretation = (entry) => {
    const results = {};
    if (entry.weight) {
      results.weight = calculateZScoreAndPercentile(entry.ageInMonths, entry.weight, 'weight');
    }
    if (entry.length) {
      results.length = calculateZScoreAndPercentile(entry.ageInMonths, entry.length, 'length');
    }
    if (entry.hc) {
      results.hc = calculateZScoreAndPercentile(entry.ageInMonths, entry.hc, 'hc');
    }
    return results;
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Chart Header */}
      <Card className="nightingale-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <HealthGrowthIcon className="h-5 w-5 text-teal-500" />
            {chartLabels[activeChart].title}
          </CardTitle>
          <CardDescription>
            {gender === 'male' ? 'Boys' : 'Girls'} • {chartType} Standards • {isWHO ? 'Birth to 2 years' : '2 to 20 years'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Standard Selection */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Standard</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={chartType === "WHO" ? "default" : "outline"} 
                onClick={() => setChartType("WHO")} 
                className="text-xs h-9 px-2"
              >
                WHO (0-2y)
              </Button>
              <Button 
                variant={chartType === "CDC" ? "default" : "outline"} 
                onClick={() => setChartType("CDC")} 
                className="text-xs h-9 px-2"
              >
                CDC (2-20y)
              </Button>
            </div>
          </div>
          
          {/* Gender Selection */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Gender</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={gender === "male" ? "default" : "outline"} 
                onClick={() => setGender("male")} 
                className="text-xs h-9 px-2"
              >
                👦 Boys
              </Button>
              <Button 
                variant={gender === "female" ? "default" : "outline"} 
                onClick={() => setGender("female")} 
                className="text-xs h-9 px-2"
              >
                👧 Girls
              </Button>
            </div>
          </div>
          
          {/* Measurement Type */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Measurement</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "weight", label: "Weight" },
                { id: "length", label: "Length" },
                { id: "hc", label: "Head Circ" }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeChart === tab.id ? "default" : "outline"}
                  onClick={() => setActiveChart(tab.id)}
                  className="text-xs h-9 px-2"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Chart */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">
              {chartLabels[activeChart].title} ({chartType})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={saveToGallery} className="text-xs h-7 px-2">
              📷 Save
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} className="bg-white dark:bg-gray-900 rounded-lg p-3" style={{ backgroundColor: gender === 'male' ? '#e6f3ff' : '#fff0f5', minHeight: '350px' }}>
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="1 1" stroke="#ccc" />
                <XAxis 
                  dataKey="age"
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 10 }} 
                  label={{ value: isWHO ? 'Age (months)' : 'Age (years)', position: 'bottom', fontSize: 11, offset: 0 }}
                  domain={xAxisDomain}
                  ticks={xAxisTicks}
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  label={{ value: chartLabels[activeChart].yLabel, angle: -90, position: 'insideLeft', fontSize: 11, offset: 10 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ fontSize: 11, borderRadius: 8, backgroundColor: '#fff' }}
                  formatter={(value, name) => {
                    const labels = { p3: '3rd', p15: '15th', p50: '50th', p85: '85th', p97: '97th' };
                    return [value.toFixed(1) + ' ' + chartLabels[activeChart].unit, labels[name] || name];
                  }}
                  labelFormatter={(label) => isWHO ? `${label} months` : `${label/12} years`}
                />
                
                <Line type="monotone" dataKey="p97" stroke={percentileColors.p97} strokeWidth={1.5} dot={false} name="p97" />
                <Line type="monotone" dataKey="p85" stroke={percentileColors.p85} strokeWidth={1.5} dot={false} name="p85" />
                <Line type="monotone" dataKey="p50" stroke={percentileColors.p50} strokeWidth={2} dot={false} name="p50" />
                <Line type="monotone" dataKey="p15" stroke={percentileColors.p15} strokeWidth={1.5} dot={false} name="p15" />
                <Line type="monotone" dataKey="p3" stroke={percentileColors.p3} strokeWidth={1.5} dot={false} name="p3" />
                
                {patientData.map((point, idx) => (
                  <ReferenceDot key={idx} x={point.age} y={point.value} r={3} fill="#000" stroke="#fff" strokeWidth={2} />
                ))}
              </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-3 mt-3 text-xs flex-wrap">
              <span className="flex items-center gap-1"><span className="w-4 h-0.5" style={{backgroundColor: percentileColors.p97}}></span> 97th</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5" style={{backgroundColor: percentileColors.p85}}></span> 85th</span>
              <span className="flex items-center gap-1"><span className="w-4 h-1" style={{backgroundColor: percentileColors.p50}}></span> 50th</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5" style={{backgroundColor: percentileColors.p15}}></span> 15th</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5" style={{backgroundColor: percentileColors.p3}}></span> 3rd</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black border border-white"></span> Patient</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement Form */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Plot Measurement</CardTitle>
          <CardDescription className="text-xs">Date and age are required. Measurements are optional.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Date *</Label>
              <Input type="date" value={newEntry.date} onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} className="h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Age ({isWHO ? 'months' : 'years'}) *</Label>
              <Input type="number" placeholder={isWHO ? "e.g., 6" : "e.g., 5"} value={newEntry.ageValue} onChange={(e) => setNewEntry({...newEntry, ageValue: e.target.value})} className="h-9 font-mono text-sm" />
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Optional measurements (fill any):</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Weight (kg)</Label>
                <Input type="number" step="0.01" placeholder="e.g., 5.5" value={newEntry.weight} onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})} className="h-9 font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Length (cm)</Label>
                <Input type="number" step="0.1" placeholder="e.g., 60" value={newEntry.length} onChange={(e) => setNewEntry({...newEntry, length: e.target.value})} className="h-9 font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">HC (cm)</Label>
                <Input type="number" step="0.1" placeholder="e.g., 40" value={newEntry.hc} onChange={(e) => setNewEntry({...newEntry, hc: e.target.value})} className="h-9 font-mono text-sm" />
              </div>
            </div>
          </div>
          
          <Button onClick={addEntry} className="w-full" size="sm" disabled={!newEntry.date || !newEntry.ageValue}>
            <Plus className="h-4 w-4 mr-1" /> Plot Data Point
          </Button>
        </CardContent>
      </Card>

      {/* Entries List with Interpretation */}
      {entries.length > 0 && (
        <Card className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Plotted Data & Interpretation ({entries.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.map((entry) => {
              const interpretation = getEntryInterpretation(entry);
              return (
                <div key={entry.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span className="font-medium text-[#00d9c5]">{entry.date}</span>
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium">{formatAge(entry)}</span>
                    </div>
                    <button onClick={() => removeEntry(entry.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {entry.weight && interpretation.weight && (
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Weight: {entry.weight} kg</span>
                          <span className={`font-bold ${interpretation.weight.color}`}>{interpretation.weight.percentile}th percentile</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Z-score: <span className="font-mono">{interpretation.weight.zScore}</span></span>
                          <span className={interpretation.weight.color}>{interpretation.weight.interpretation}</span>
                        </div>
                      </div>
                    )}
                    
                    {entry.length && interpretation.length && (
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Length: {entry.length} cm</span>
                          <span className={`font-bold ${interpretation.length.color}`}>{interpretation.length.percentile}th percentile</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Z-score: <span className="font-mono">{interpretation.length.zScore}</span></span>
                          <span className={interpretation.length.color}>{interpretation.length.interpretation}</span>
                        </div>
                      </div>
                    )}
                    
                    {entry.hc && interpretation.hc && (
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Head Circ: {entry.hc} cm</span>
                          <span className={`font-bold ${interpretation.hc.color}`}>{interpretation.hc.percentile}th percentile</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Z-score: <span className="font-mono">{interpretation.hc.zScore}</span></span>
                          <span className={interpretation.hc.color}>{interpretation.hc.interpretation}</span>
                        </div>
                      </div>
                    )}
                    
                    {!entry.weight && !entry.length && !entry.hc && (
                      <p className="text-xs text-muted-foreground italic">No measurements entered for this date</p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Reference */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Percentile Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• <span className="font-medium" style={{color: percentileColors.p50}}>50th percentile:</span> Median - Average growth</p>
          <p>• <span className="font-medium" style={{color: percentileColors.p85}}>15th-85th:</span> Normal range</p>
          <p>• <span className="font-medium" style={{color: percentileColors.p3}}>3rd-15th / 85th-97th:</span> Monitor growth</p>
          <p>• <span className="text-red-600 font-medium">&lt;3rd / &gt;97th:</span> Evaluation needed</p>
          <div className="pt-2 border-t mt-2">
            <p className="font-medium text-foreground">Z-score Interpretation:</p>
            <p>• Z = 0: At the median (50th percentile)</p>
            <p>• Z = -2 to +2: Normal range</p>
            <p>• Z &lt; -2 or Z &gt; +2: Requires evaluation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
