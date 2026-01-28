import React, { useState, useRef, useMemo, useCallback } from "react";
import { Plus, Trash2, Download, Maximize2, Minimize2, FileText } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Growth Chart Page - Using Official CDC/WHO Data
 * WHO (0-24 months): Weight, Length, Head circumference, BMI - Percentiles: 3, 15, 50, 85, 97
 * CDC (2-20 years): Weight, Stature - Percentiles: 3, 5, 10, 25, 50, 75, 90, 95, 97
 */

// WHO Growth Standards Data (0-24 months) - 25 data points
const WHO_DATA = {
  weight: {
    male: {
      p3:  [2.5, 3.4, 4.3, 5.0, 5.6, 6.0, 6.4, 6.7, 6.9, 7.1, 7.4, 7.6, 7.7, 7.9, 8.1, 8.3, 8.4, 8.6, 8.8, 8.9, 9.1, 9.2, 9.4, 9.5, 9.7],
      p15: [2.9, 3.9, 4.9, 5.7, 6.2, 6.7, 7.1, 7.4, 7.7, 8.0, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2, 9.4, 9.5, 9.7, 9.9, 10.1, 10.2, 10.4, 10.6, 10.7],
      p50: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.8, 12.0, 12.2],
      p85: [3.9, 5.1, 6.3, 7.2, 7.9, 8.4, 8.9, 9.3, 9.6, 9.9, 10.2, 10.5, 10.8, 11.0, 11.3, 11.5, 11.8, 12.0, 12.3, 12.5, 12.8, 13.0, 13.3, 13.5, 13.8],
      p97: [4.4, 5.8, 7.1, 8.0, 8.8, 9.3, 9.9, 10.3, 10.7, 11.0, 11.4, 11.7, 12.0, 12.3, 12.6, 12.8, 13.1, 13.4, 13.7, 13.9, 14.2, 14.5, 14.7, 15.0, 15.3]
    },
    female: {
      p3:  [2.4, 3.2, 3.9, 4.5, 5.0, 5.4, 5.7, 6.0, 6.3, 6.5, 6.7, 6.9, 7.0, 7.2, 7.4, 7.6, 7.7, 7.9, 8.1, 8.2, 8.4, 8.6, 8.7, 8.9, 9.0],
      p15: [2.8, 3.6, 4.5, 5.1, 5.6, 6.1, 6.4, 6.8, 7.0, 7.3, 7.5, 7.7, 7.9, 8.1, 8.3, 8.4, 8.6, 8.8, 9.0, 9.1, 9.3, 9.5, 9.7, 9.8, 10.0],
      p50: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 8.0, 8.2, 8.5, 8.7, 9.0, 9.2, 9.4, 9.6, 9.8, 10.0, 10.2, 10.4, 10.6, 10.9, 11.1, 11.3, 11.5],
      p85: [3.7, 4.8, 5.9, 6.6, 7.3, 7.8, 8.2, 8.6, 8.9, 9.2, 9.5, 9.8, 10.0, 10.3, 10.5, 10.7, 11.0, 11.2, 11.4, 11.7, 11.9, 12.1, 12.4, 12.6, 12.8],
      p97: [4.2, 5.5, 6.6, 7.5, 8.2, 8.8, 9.3, 9.8, 10.2, 10.5, 10.9, 11.2, 11.5, 11.8, 12.1, 12.4, 12.6, 12.9, 13.2, 13.5, 13.7, 14.0, 14.3, 14.6, 14.8]
    }
  },
  length: {
    male: {
      p3:  [46.1, 50.8, 54.4, 57.3, 59.7, 61.7, 63.3, 64.8, 66.2, 67.5, 68.7, 69.9, 71.0, 72.1, 73.1, 74.1, 75.0, 76.0, 76.9, 77.7, 78.6, 79.4, 80.2, 81.0, 81.7],
      p15: [47.9, 52.7, 56.4, 59.4, 61.8, 63.8, 65.5, 67.1, 68.5, 69.8, 71.1, 72.3, 73.4, 74.5, 75.6, 76.6, 77.6, 78.5, 79.5, 80.4, 81.3, 82.1, 83.0, 83.8, 84.6],
      p50: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8],
      p85: [51.8, 56.7, 60.5, 63.5, 66.0, 68.1, 69.8, 71.4, 72.9, 74.3, 75.6, 76.9, 78.1, 79.3, 80.5, 81.6, 82.7, 83.8, 84.9, 85.9, 86.9, 87.9, 88.9, 89.8, 90.7],
      p97: [53.7, 58.6, 62.4, 65.5, 68.0, 70.1, 71.9, 73.5, 75.0, 76.5, 77.9, 79.2, 80.5, 81.8, 83.0, 84.2, 85.4, 86.5, 87.7, 88.8, 89.8, 90.9, 91.9, 92.9, 93.9]
    },
    female: {
      p3:  [45.4, 49.8, 53.0, 55.6, 57.8, 59.6, 61.2, 62.7, 64.0, 65.3, 66.5, 67.7, 68.9, 70.0, 71.0, 72.0, 73.0, 74.0, 74.9, 75.8, 76.7, 77.5, 78.4, 79.2, 80.0],
      p15: [47.2, 51.7, 55.0, 57.7, 60.0, 61.9, 63.5, 65.0, 66.4, 67.7, 69.0, 70.2, 71.4, 72.5, 73.6, 74.7, 75.7, 76.7, 77.7, 78.6, 79.6, 80.5, 81.4, 82.3, 83.1],
      p50: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.6, 85.5, 86.4],
      p85: [51.0, 55.6, 59.1, 61.9, 64.3, 66.2, 68.0, 69.6, 71.1, 72.6, 74.0, 75.3, 76.6, 77.9, 79.1, 80.3, 81.4, 82.6, 83.7, 84.7, 85.8, 86.8, 87.8, 88.8, 89.7],
      p97: [52.9, 57.6, 61.1, 64.0, 66.4, 68.5, 70.3, 71.9, 73.5, 75.0, 76.4, 77.8, 79.2, 80.5, 81.7, 83.0, 84.2, 85.4, 86.5, 87.6, 88.7, 89.8, 90.8, 91.9, 92.9]
    }
  },
  hc: {
    male: {
      p3:  [31.9, 35.0, 36.8, 38.1, 39.2, 40.1, 40.9, 41.5, 42.0, 42.5, 42.9, 43.2, 43.5, 43.8, 44.0, 44.2, 44.4, 44.6, 44.7, 44.9, 45.0, 45.2, 45.3, 45.4, 45.5],
      p15: [33.1, 36.0, 37.9, 39.3, 40.4, 41.3, 42.1, 42.7, 43.3, 43.7, 44.2, 44.5, 44.8, 45.1, 45.4, 45.6, 45.8, 46.0, 46.2, 46.3, 46.5, 46.6, 46.8, 46.9, 47.0],
      p50: [34.5, 37.3, 39.1, 40.5, 41.6, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1, 46.3, 46.6, 46.8, 47.0, 47.2, 47.4, 47.5, 47.7, 47.8, 48.0, 48.1, 48.3],
      p85: [35.8, 38.5, 40.4, 41.8, 42.9, 43.8, 44.6, 45.2, 45.8, 46.3, 46.7, 47.1, 47.4, 47.7, 47.9, 48.1, 48.4, 48.5, 48.7, 48.9, 49.0, 49.2, 49.3, 49.5, 49.6],
      p97: [37.0, 39.6, 41.5, 42.9, 44.0, 45.0, 45.8, 46.4, 47.0, 47.5, 47.9, 48.3, 48.6, 48.9, 49.2, 49.4, 49.6, 49.8, 50.0, 50.2, 50.4, 50.5, 50.7, 50.8, 51.0]
    },
    female: {
      p3:  [31.5, 34.2, 35.8, 37.1, 38.1, 38.9, 39.6, 40.2, 40.7, 41.2, 41.5, 41.9, 42.2, 42.4, 42.7, 42.9, 43.1, 43.3, 43.5, 43.6, 43.8, 44.0, 44.1, 44.3, 44.4],
      p15: [32.7, 35.3, 37.0, 38.3, 39.3, 40.2, 40.9, 41.5, 42.0, 42.5, 42.9, 43.3, 43.6, 43.9, 44.1, 44.3, 44.5, 44.7, 44.9, 45.1, 45.2, 45.4, 45.5, 45.7, 45.8],
      p50: [33.9, 36.5, 38.3, 39.5, 40.6, 41.5, 42.2, 42.8, 43.4, 43.8, 44.2, 44.6, 44.9, 45.2, 45.4, 45.7, 45.9, 46.1, 46.2, 46.4, 46.6, 46.7, 46.9, 47.0, 47.2],
      p85: [35.2, 37.8, 39.5, 40.8, 41.9, 42.8, 43.5, 44.2, 44.7, 45.2, 45.6, 46.0, 46.3, 46.6, 46.8, 47.1, 47.3, 47.5, 47.7, 47.8, 48.0, 48.2, 48.3, 48.5, 48.6],
      p97: [36.2, 38.9, 40.7, 42.0, 43.1, 44.0, 44.8, 45.5, 46.0, 46.5, 46.9, 47.3, 47.6, 47.9, 48.2, 48.4, 48.6, 48.8, 49.0, 49.2, 49.4, 49.5, 49.7, 49.8, 50.0]
    }
  },
  bmi: {
    male: {
      p3:  [11.0, 12.2, 14.0, 14.8, 15.2, 15.5, 15.6, 15.6, 15.6, 15.5, 15.4, 15.3, 15.2, 15.1, 15.0, 14.9, 14.8, 14.7, 14.6, 14.6, 14.5, 14.5, 14.4, 14.4, 14.3],
      p15: [11.8, 13.4, 15.2, 16.0, 16.5, 16.7, 16.8, 16.8, 16.8, 16.7, 16.6, 16.5, 16.3, 16.2, 16.1, 16.0, 15.9, 15.8, 15.7, 15.6, 15.5, 15.5, 15.4, 15.4, 15.3],
      p50: [13.4, 14.9, 16.9, 17.6, 18.0, 18.2, 18.3, 18.3, 18.2, 18.1, 18.0, 17.8, 17.7, 17.5, 17.4, 17.3, 17.2, 17.1, 17.0, 16.9, 16.8, 16.7, 16.6, 16.5, 16.5],
      p85: [15.0, 16.5, 18.6, 19.3, 19.7, 19.9, 19.9, 19.9, 19.8, 19.7, 19.5, 19.4, 19.2, 19.0, 18.9, 18.7, 18.6, 18.5, 18.4, 18.3, 18.2, 18.1, 18.0, 17.9, 17.8],
      p97: [16.6, 18.0, 20.2, 20.9, 21.3, 21.4, 21.5, 21.4, 21.3, 21.2, 21.0, 20.8, 20.6, 20.4, 20.2, 20.1, 19.9, 19.8, 19.7, 19.5, 19.4, 19.3, 19.2, 19.1, 19.0]
    },
    female: {
      p3:  [10.8, 12.0, 13.6, 14.3, 14.7, 15.0, 15.1, 15.2, 15.2, 15.1, 15.1, 15.0, 14.9, 14.8, 14.7, 14.6, 14.5, 14.4, 14.4, 14.3, 14.2, 14.2, 14.1, 14.1, 14.0],
      p15: [11.6, 13.0, 14.8, 15.6, 16.0, 16.3, 16.4, 16.5, 16.4, 16.4, 16.3, 16.2, 16.1, 16.0, 15.9, 15.8, 15.7, 15.6, 15.5, 15.4, 15.3, 15.3, 15.2, 15.1, 15.1],
      p50: [13.1, 14.6, 16.4, 17.2, 17.6, 17.8, 17.9, 17.9, 17.9, 17.8, 17.7, 17.6, 17.5, 17.3, 17.2, 17.1, 17.0, 16.8, 16.7, 16.6, 16.5, 16.5, 16.4, 16.3, 16.2],
      p85: [14.7, 16.3, 18.2, 19.0, 19.4, 19.6, 19.7, 19.7, 19.6, 19.5, 19.4, 19.2, 19.1, 18.9, 18.8, 18.6, 18.5, 18.4, 18.2, 18.1, 18.0, 17.9, 17.8, 17.7, 17.6],
      p97: [16.1, 17.7, 19.8, 20.6, 21.0, 21.2, 21.3, 21.3, 21.2, 21.1, 20.9, 20.8, 20.6, 20.4, 20.2, 20.1, 19.9, 19.8, 19.6, 19.5, 19.4, 19.2, 19.1, 19.0, 18.9]
    }
  }
};

// CDC Growth Charts Data (2-20 years) - 19 data points
const CDC_DATA = {
  weight: {
    male: {
      p3:  [10.4, 11.8, 13.3, 14.9, 16.5, 18.3, 20.1, 22.1, 24.2, 26.6, 29.5, 33.0, 37.1, 41.5, 45.8, 49.3, 51.7, 53.2, 54.0],
      p5:  [10.7, 12.1, 13.6, 15.3, 17.0, 18.8, 20.8, 22.8, 25.0, 27.6, 30.6, 34.3, 38.6, 43.0, 47.3, 50.7, 53.2, 54.8, 55.7],
      p10: [11.1, 12.6, 14.1, 15.8, 17.7, 19.6, 21.6, 23.8, 26.2, 29.0, 32.4, 36.3, 40.8, 45.5, 49.8, 53.3, 55.8, 57.4, 58.4],
      p25: [11.8, 13.4, 15.1, 17.0, 19.0, 21.1, 23.3, 25.8, 28.7, 32.0, 35.9, 40.4, 45.3, 50.2, 54.7, 58.2, 60.7, 62.5, 63.6],
      p50: [12.7, 14.4, 16.3, 18.5, 20.8, 23.2, 25.8, 28.7, 32.1, 36.1, 40.7, 45.8, 51.2, 56.5, 61.1, 64.7, 67.3, 69.2, 70.6],
      p75: [13.6, 15.6, 17.7, 20.3, 22.9, 25.8, 28.8, 32.4, 36.6, 41.4, 46.8, 52.7, 58.6, 64.2, 69.0, 72.8, 75.6, 77.6, 79.2],
      p90: [14.6, 16.7, 19.3, 22.2, 25.3, 28.7, 32.5, 36.9, 42.0, 47.7, 54.0, 60.4, 66.8, 72.8, 77.9, 82.1, 85.1, 87.1, 88.8],
      p95: [15.2, 17.5, 20.3, 23.6, 27.0, 30.9, 35.2, 40.4, 46.3, 52.6, 59.3, 65.9, 72.4, 78.3, 83.6, 88.0, 91.3, 93.3, 94.8],
      p97: [15.6, 18.0, 21.0, 24.5, 28.3, 32.5, 37.4, 43.1, 49.4, 56.3, 63.3, 70.3, 77.0, 83.2, 89.0, 93.8, 97.2, 99.2, 100.8]
    },
    female: {
      p3:  [10.0, 11.4, 12.8, 14.3, 16.0, 17.7, 19.5, 21.6, 24.0, 26.8, 30.0, 33.4, 36.7, 39.6, 41.8, 43.3, 44.2, 44.8, 45.0],
      p5:  [10.3, 11.7, 13.2, 14.7, 16.4, 18.3, 20.2, 22.4, 24.9, 27.9, 31.3, 34.8, 38.1, 41.0, 43.1, 44.6, 45.5, 46.1, 46.5],
      p10: [10.6, 12.1, 13.6, 15.3, 17.1, 19.1, 21.2, 23.5, 26.3, 29.5, 33.1, 36.6, 40.0, 42.8, 44.9, 46.3, 47.2, 48.0, 48.4],
      p25: [11.2, 12.9, 14.6, 16.5, 18.5, 20.7, 23.1, 25.9, 29.2, 32.9, 36.7, 40.6, 43.9, 46.7, 48.6, 50.0, 51.0, 51.8, 52.5],
      p50: [12.1, 13.9, 15.9, 18.0, 20.3, 22.9, 25.8, 29.1, 33.1, 37.4, 41.8, 46.0, 49.5, 52.1, 53.9, 55.2, 56.2, 57.4, 58.2],
      p75: [13.0, 15.2, 17.4, 20.0, 22.7, 25.7, 29.2, 33.3, 38.0, 43.2, 48.3, 53.0, 56.8, 59.4, 61.2, 62.3, 63.4, 64.8, 65.9],
      p90: [13.9, 16.5, 19.2, 22.1, 25.4, 29.0, 33.2, 38.2, 43.9, 49.9, 56.0, 61.3, 65.6, 68.5, 70.4, 71.6, 72.8, 74.2, 75.4],
      p95: [14.6, 17.4, 20.5, 23.7, 27.5, 31.5, 36.4, 42.1, 48.5, 55.0, 61.7, 67.6, 72.2, 75.4, 77.6, 78.9, 80.1, 81.4, 82.4],
      p97: [15.0, 18.0, 21.3, 24.9, 28.9, 33.4, 38.5, 44.6, 51.4, 58.7, 65.9, 72.4, 77.7, 81.6, 84.4, 86.2, 87.4, 88.4, 89.0]
    }
  },
  stature: {
    male: {
      p3:  [79.9, 88.4, 94.6, 100.3, 106.1, 111.9, 117.5, 122.4, 126.7, 130.8, 135.7, 141.7, 148.5, 154.6, 158.8, 161.3, 162.5, 163.1, 163.3],
      p5:  [80.9, 89.5, 95.9, 101.7, 107.6, 113.4, 119.0, 124.0, 128.5, 132.7, 137.7, 143.9, 151.0, 157.2, 161.4, 163.6, 164.7, 165.3, 165.5],
      p10: [82.0, 90.5, 97.1, 103.2, 109.2, 115.1, 120.8, 126.0, 130.5, 134.9, 139.9, 146.4, 153.6, 159.8, 163.7, 165.8, 166.9, 167.4, 167.7],
      p25: [84.1, 92.7, 99.7, 106.0, 112.2, 118.4, 124.3, 129.6, 134.4, 139.0, 144.3, 151.1, 158.7, 164.8, 168.5, 170.4, 171.3, 171.8, 172.0],
      p50: [86.5, 95.3, 102.5, 109.2, 115.7, 122.0, 128.1, 133.7, 138.8, 143.7, 149.3, 156.4, 164.1, 170.1, 173.6, 175.3, 176.2, 176.6, 176.8],
      p75: [88.8, 97.9, 105.4, 112.3, 119.1, 125.7, 132.1, 137.9, 143.3, 148.5, 154.4, 161.7, 169.5, 175.3, 178.6, 180.2, 181.0, 181.4, 181.7],
      p90: [90.9, 100.4, 108.0, 115.1, 122.1, 129.0, 135.7, 141.8, 147.4, 152.9, 159.0, 166.6, 174.2, 179.8, 182.9, 184.5, 185.3, 185.7, 186.0],
      p95: [92.1, 101.8, 109.5, 116.8, 124.0, 131.0, 138.0, 144.3, 150.1, 155.7, 162.0, 169.6, 177.0, 182.5, 185.4, 187.0, 187.8, 188.2, 188.5],
      p97: [93.0, 102.9, 110.5, 117.8, 125.1, 132.3, 139.3, 145.7, 151.5, 157.3, 163.7, 171.3, 178.8, 184.1, 187.1, 188.6, 189.5, 189.9, 190.2]
    },
    female: {
      p3:  [78.4, 86.9, 93.1, 99.4, 105.8, 111.9, 117.3, 121.9, 126.0, 130.7, 137.4, 144.2, 148.1, 149.7, 150.4, 150.7, 150.9, 151.0, 151.1],
      p5:  [79.4, 88.0, 94.4, 100.8, 107.2, 113.4, 118.9, 123.6, 127.8, 132.8, 139.7, 146.3, 150.1, 151.7, 152.3, 152.6, 152.8, 152.9, 153.0],
      p10: [80.5, 89.2, 95.6, 102.0, 108.6, 114.9, 120.5, 125.3, 129.8, 135.0, 142.0, 148.4, 152.1, 153.6, 154.3, 154.6, 154.8, 154.9, 155.0],
      p25: [82.6, 91.6, 98.1, 104.8, 111.6, 118.1, 123.9, 129.0, 133.7, 139.4, 146.5, 152.7, 156.0, 157.5, 158.2, 158.6, 158.8, 158.9, 159.0],
      p50: [85.0, 94.2, 101.0, 108.0, 115.0, 121.8, 127.8, 133.1, 138.2, 144.3, 151.5, 157.3, 160.5, 161.9, 162.6, 162.9, 163.1, 163.3, 163.3],
      p75: [87.3, 96.9, 104.0, 111.2, 118.6, 125.6, 131.9, 137.4, 142.8, 149.2, 156.4, 162.0, 164.9, 166.3, 166.9, 167.3, 167.5, 167.6, 167.7],
      p90: [89.4, 99.3, 106.8, 114.3, 121.9, 129.1, 135.6, 141.4, 147.0, 153.7, 160.8, 166.1, 168.9, 170.2, 170.9, 171.2, 171.4, 171.5, 171.6],
      p95: [90.7, 100.7, 108.4, 116.1, 123.9, 131.3, 138.0, 143.9, 149.7, 156.5, 163.5, 168.6, 171.4, 172.7, 173.3, 173.7, 173.9, 174.0, 174.1],
      p97: [91.5, 101.8, 109.5, 117.4, 125.3, 132.7, 139.4, 145.4, 151.3, 158.1, 165.2, 170.2, 172.9, 174.2, 174.8, 175.1, 175.3, 175.4, 175.5]
    }
  },
  bmi: {
    male: {
      // CDC BMI-for-age Boys 2-20 years
      p3:  [13.0, 13.5, 13.8, 14.0, 14.2, 14.3, 14.5, 14.8, 15.2, 15.7, 16.2, 17.0, 17.8, 18.6, 19.4, 20.1, 20.7, 21.3, 21.8],
      p5:  [13.2, 13.8, 14.0, 14.2, 14.4, 14.5, 14.7, 15.0, 15.4, 15.9, 16.5, 17.2, 18.0, 18.8, 19.6, 20.3, 20.9, 21.5, 22.0],
      p10: [13.5, 14.0, 14.3, 14.5, 14.7, 14.8, 15.0, 15.3, 15.7, 16.2, 16.8, 17.5, 18.3, 19.1, 19.9, 20.6, 21.2, 21.8, 22.3],
      p25: [14.0, 14.5, 14.8, 15.0, 15.2, 15.3, 15.5, 15.8, 16.2, 16.7, 17.3, 18.0, 18.8, 19.6, 20.4, 21.1, 21.7, 22.3, 22.8],
      p50: [14.5, 15.0, 15.3, 15.5, 15.7, 15.8, 16.0, 16.3, 16.7, 17.2, 17.8, 18.5, 19.3, 20.1, 20.9, 21.6, 22.2, 22.8, 23.3],
      p75: [15.0, 15.5, 15.8, 16.0, 16.2, 16.3, 16.5, 16.8, 17.2, 17.7, 18.3, 19.0, 19.8, 20.6, 21.4, 22.1, 22.7, 23.3, 23.8],
      p85: [15.3, 15.8, 16.1, 16.3, 16.5, 16.6, 16.8, 17.1, 17.5, 18.0, 18.6, 19.3, 20.1, 20.9, 21.7, 22.4, 23.0, 23.6, 24.1],
      p90: [15.5, 16.0, 16.3, 16.5, 16.7, 16.8, 17.0, 17.3, 17.7, 18.2, 18.8, 19.5, 20.3, 21.1, 21.9, 22.6, 23.2, 23.8, 24.3],
      p95: [15.8, 16.3, 16.6, 16.8, 17.0, 17.1, 17.3, 17.6, 18.0, 18.5, 19.1, 19.8, 20.6, 21.4, 22.2, 22.9, 23.5, 24.1, 24.6],
      p97: [16.0, 16.5, 16.8, 17.0, 17.2, 17.3, 17.5, 17.8, 18.2, 18.7, 19.3, 20.0, 20.8, 21.6, 22.4, 23.1, 23.7, 24.3, 24.8]
    },
    female: {
      // CDC BMI-for-age Girls 2-20 years
      p3:  [12.2, 12.0, 11.9, 11.9, 12.0, 12.2, 12.5, 12.9, 13.5, 14.2, 15.1, 16.2, 17.3, 18.4, 19.4, 20.3, 21.1, 21.7, 22.1],
      p5:  [12.5, 12.3, 12.1, 12.1, 12.2, 12.5, 12.8, 13.2, 13.8, 14.6, 15.5, 16.7, 17.8, 18.9, 20.0, 20.9, 21.7, 22.3, 22.7],
      p10: [13.0, 12.8, 12.6, 12.6, 12.7, 13.0, 13.4, 13.8, 14.5, 15.3, 16.3, 17.5, 18.7, 19.9, 21.0, 21.9, 22.7, 23.3, 23.7],
      p25: [13.8, 13.6, 13.4, 13.5, 13.7, 14.0, 14.5, 15.0, 15.8, 16.8, 17.9, 19.2, 20.5, 21.8, 23.0, 24.0, 24.9, 25.7, 26.4],
      p50: [14.6, 14.5, 14.4, 14.5, 14.7, 15.1, 15.6, 16.2, 17.0, 18.2, 19.5, 21.0, 22.4, 23.9, 25.1, 26.1, 27.0, 27.8, 28.6],
      p75: [15.6, 15.6, 15.5, 15.7, 16.0, 16.4, 17.0, 17.7, 18.6, 19.8, 21.2, 22.8, 24.5, 26.0, 27.2, 28.2, 29.1, 29.9, 30.7],
      p85: [16.3, 16.3, 16.3, 16.5, 16.8, 17.2, 17.9, 18.6, 19.6, 20.8, 22.4, 24.0, 25.8, 27.4, 28.8, 29.9, 30.7, 31.5, 32.3],
      p90: [16.8, 16.8, 16.8, 17.0, 17.3, 17.8, 18.5, 19.3, 20.3, 21.6, 23.2, 24.9, 26.8, 28.5, 29.9, 31.0, 31.8, 32.6, 33.5],
      p95: [17.4, 17.4, 17.4, 17.6, 17.9, 18.5, 19.3, 20.2, 21.3, 22.7, 24.4, 26.2, 28.2, 30.0, 31.6, 32.7, 33.5, 34.3, 35.2],
      p97: [17.7, 17.7, 17.7, 17.9, 18.2, 18.8, 19.6, 20.5, 21.6, 23.1, 24.9, 26.7, 28.8, 30.7, 32.3, 33.5, 34.2, 35.0, 36.0]
    }
  }
};

const WHO_COLORS = { p3: '#E53935', p15: '#FF9800', p50: '#4CAF50', p85: '#FF9800', p97: '#E53935' };
const CDC_COLORS = { p3: '#C41E3A', p5: '#E55B3C', p10: '#FD8D3C', p25: '#FDAE6B', p50: '#31A354', p75: '#FDAE6B', p90: '#FD8D3C', p95: '#E55B3C', p97: '#C41E3A' };

const GrowthChartPage = () => {
  const [chartType, setChartType] = useState("WHO");
  const [gender, setGender] = useState("male");
  const [activeChart, setActiveChart] = useState("weight");
  const [entries, setEntries] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newEntry, setNewEntry] = useState({ date: new Date().toISOString().split('T')[0], ageValue: "", weight: "", length: "", hc: "", bmi: "" });
  const chartContainerRef = useRef(null);

  const isWHO = chartType === "WHO";
  const width = isFullscreen ? Math.min(window.innerWidth - 40, 900) : 680;
  const height = isFullscreen ? Math.min(window.innerHeight - 100, 600) : 400;
  const margin = { top: 30, right: 60, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const getData = useMemo(() => {
    if (isWHO) return WHO_DATA[activeChart]?.[gender];
    const key = activeChart === 'length' ? 'stature' : activeChart;
    return CDC_DATA[key]?.[gender];
  }, [isWHO, activeChart, gender]);

  const xMin = isWHO ? 0 : 2;
  const xMax = isWHO ? 24 : 20;
  const dataLength = isWHO ? 25 : 19;

  const yValues = useMemo(() => {
    if (!getData) return { min: 0, max: 100 };
    const allValues = [...getData.p3, ...getData.p97];
    return { min: Math.floor(Math.min(...allValues) * 0.95), max: Math.ceil(Math.max(...allValues) * 1.05) };
  }, [getData]);

  const xScale = useCallback((val) => margin.left + ((val - xMin) / (xMax - xMin)) * innerWidth, [margin.left, xMin, xMax, innerWidth]);
  const yScale = useCallback((val) => margin.top + innerHeight - ((val - yValues.min) / (yValues.max - yValues.min)) * innerHeight, [margin.top, innerHeight, yValues.min, yValues.max]);

  const generatePath = useCallback((data) => {
    if (!data?.length) return "";
    return `M ${data.map((v, i) => `${xScale(isWHO ? i : i + 2)},${yScale(v)}`).join(' L ')}`;
  }, [isWHO, xScale, yScale]);

  const addEntry = () => {
    if (newEntry.date && newEntry.ageValue) {
      const ageInMonths = isWHO ? parseFloat(newEntry.ageValue) || 0 : (parseFloat(newEntry.ageValue) || 0) * 12;
      setEntries([...entries, { ...newEntry, id: Date.now(), ageInMonths, ageUnit: isWHO ? 'months' : 'years' }]);
      setNewEntry({ date: new Date().toISOString().split('T')[0], ageValue: "", weight: "", length: "", hc: "", bmi: "" });
    }
  };

  const exportToPDF = async () => {
    if (!chartContainerRef.current) return;
    try {
      const canvas = await html2canvas(chartContainerRef.current, { scale: 2, backgroundColor: gender === 'male' ? '#e8f4fc' : '#fce8f4' });
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const title = `${chartLabels[activeChart].title} - ${gender === 'male' ? 'Boys' : 'Girls'} (${chartType})`;
      pdf.setFontSize(16);
      pdf.text(title, 148, 15, { align: 'center' });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 25, 270, Math.min((canvas.height * 270) / canvas.width, 160));
      if (entries.length > 0) {
        let yPos = 190;
        pdf.setFontSize(10);
        pdf.text('Patient Measurements:', 15, yPos);
        yPos += 6;
        entries.forEach(e => {
          let line = `${e.date} (Age: ${e.ageValue}${e.ageUnit === 'years' ? 'y' : 'm'})`;
          if (e.weight) line += ` • Weight: ${e.weight} kg`;
          if (e.length) line += ` • ${isWHO ? 'Length' : 'Stature'}: ${e.length} cm`;
          if (e.hc) line += ` • HC: ${e.hc} cm`;
          pdf.text(line, 15, yPos);
          yPos += 5;
        });
      }
      pdf.setFontSize(8);
      pdf.text(`Source: ${isWHO ? 'WHO Child Growth Standards' : 'CDC Growth Charts'}`, 148, 205, { align: 'center' });
      pdf.save(`growth-chart-${chartType}-${gender}-${activeChart}.pdf`);
    } catch (e) { console.error('PDF error:', e); }
  };

  const savePNG = async () => {
    if (!chartContainerRef.current) return;
    try {
      const canvas = await html2canvas(chartContainerRef.current, { scale: 2, backgroundColor: gender === 'male' ? '#e8f4fc' : '#fce8f4' });
      const link = document.createElement('a');
      link.download = `growth-chart-${chartType}-${gender}-${activeChart}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) { console.error('PNG error:', e); }
  };

  const patientPoints = useMemo(() => {
    const val = activeChart === 'length' ? 'length' : activeChart;
    return entries.filter(e => e[val] && parseFloat(e[val]) > 0).map(e => ({ x: isWHO ? e.ageInMonths : e.ageInMonths / 12, y: parseFloat(e[val]), date: e.date }));
  }, [entries, activeChart, isWHO]);

  const getPercentileInfo = (ageMonths, value, type) => {
    if (!value) return null;
    const val = parseFloat(value);
    const data = isWHO ? WHO_DATA[type]?.[gender] : CDC_DATA[type === 'length' ? 'stature' : type]?.[gender];
    if (!data) return null;
    const idx = isWHO ? Math.min(Math.max(Math.round(ageMonths), 0), 24) : Math.min(Math.max(Math.round(ageMonths / 12) - 2, 0), 18);
    if (isWHO) {
      const { p3, p15, p50, p85, p97 } = { p3: data.p3[idx], p15: data.p15[idx], p50: data.p50[idx], p85: data.p85[idx], p97: data.p97[idx] };
      if (val < p3) return { percentile: "<3", interpretation: "Below 3rd - Evaluation needed", color: "text-red-600" };
      if (val < p15) return { percentile: "3-15", interpretation: "Low-normal", color: "text-orange-500" };
      if (val < p50) return { percentile: "15-50", interpretation: "Normal", color: "text-green-600" };
      if (val < p85) return { percentile: "50-85", interpretation: "Normal", color: "text-green-600" };
      if (val < p97) return { percentile: "85-97", interpretation: "High-normal", color: "text-orange-500" };
      return { percentile: ">97", interpretation: "Above 97th - Evaluation needed", color: "text-red-600" };
    }
    const { p3, p10, p25, p50, p75, p90, p97 } = { p3: data.p3[idx], p10: data.p10[idx], p25: data.p25[idx], p50: data.p50[idx], p75: data.p75[idx], p90: data.p90[idx], p97: data.p97[idx] };
    if (val < p3) return { percentile: "<3", interpretation: "Below 3rd - Evaluation needed", color: "text-red-600" };
    if (val < p10) return { percentile: "3-10", interpretation: "Below 10th - Monitor", color: "text-orange-500" };
    if (val < p25) return { percentile: "10-25", interpretation: "Low-normal", color: "text-yellow-600" };
    if (val < p75) return { percentile: "25-75", interpretation: "Normal", color: "text-green-600" };
    if (val < p90) return { percentile: "75-90", interpretation: "High-normal", color: "text-green-600" };
    if (val < p97) return { percentile: "90-97", interpretation: "Monitor", color: "text-yellow-600" };
    return { percentile: ">97", interpretation: "Above 97th - Evaluation needed", color: "text-red-600" };
  };

  const chartLabels = {
    weight: { title: "Weight-for-Age", yLabel: "Weight (kg)" },
    length: { title: isWHO ? "Length-for-Age" : "Stature-for-Age", yLabel: isWHO ? "Length (cm)" : "Stature (cm)" },
    hc: { title: "Head Circumference-for-Age", yLabel: "Head Circ (cm)" },
    bmi: { title: "BMI-for-Age", yLabel: "BMI (kg/m²)" }
  };

  const xTicks = isWHO ? [0, 3, 6, 9, 12, 15, 18, 21, 24] : [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  const yTicks = Array.from({ length: 9 }, (_, i) => Math.round(yValues.min + i * ((yValues.max - yValues.min) / 8)));

  const renderSVG = () => (
    <div ref={chartContainerRef} className="rounded-lg overflow-x-auto" style={{ backgroundColor: gender === 'male' ? '#e8f4fc' : '#fce8f4', padding: '10px' }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <text x={width / 2} y={18} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">{chartLabels[activeChart].title} • {gender === 'male' ? 'Boys' : 'Girls'} ({chartType})</text>
        {yTicks.map(t => <line key={t} x1={margin.left} y1={yScale(t)} x2={width - margin.right} y2={yScale(t)} stroke="#ccc" strokeDasharray="2,2" />)}
        {getData && isWHO && <>
          <path d={generatePath(getData.p97)} fill="none" stroke={WHO_COLORS.p97} strokeWidth="2" />
          <path d={generatePath(getData.p85)} fill="none" stroke={WHO_COLORS.p85} strokeWidth="1.5" strokeDasharray="4,2" />
          <path d={generatePath(getData.p50)} fill="none" stroke={WHO_COLORS.p50} strokeWidth="2.5" />
          <path d={generatePath(getData.p15)} fill="none" stroke={WHO_COLORS.p15} strokeWidth="1.5" strokeDasharray="4,2" />
          <path d={generatePath(getData.p3)} fill="none" stroke={WHO_COLORS.p3} strokeWidth="2" />
        </>}
        {getData && !isWHO && <>
          <path d={generatePath(getData.p97)} fill="none" stroke={CDC_COLORS.p97} strokeWidth="1.5" />
          <path d={generatePath(getData.p95)} fill="none" stroke={CDC_COLORS.p95} strokeWidth="1" strokeDasharray="3,2" />
          <path d={generatePath(getData.p90)} fill="none" stroke={CDC_COLORS.p90} strokeWidth="1.5" />
          <path d={generatePath(getData.p75)} fill="none" stroke={CDC_COLORS.p75} strokeWidth="1" strokeDasharray="4,2" />
          <path d={generatePath(getData.p50)} fill="none" stroke={CDC_COLORS.p50} strokeWidth="2.5" />
          <path d={generatePath(getData.p25)} fill="none" stroke={CDC_COLORS.p25} strokeWidth="1" strokeDasharray="4,2" />
          <path d={generatePath(getData.p10)} fill="none" stroke={CDC_COLORS.p10} strokeWidth="1.5" />
          <path d={generatePath(getData.p5)} fill="none" stroke={CDC_COLORS.p5} strokeWidth="1" strokeDasharray="3,2" />
          <path d={generatePath(getData.p3)} fill="none" stroke={CDC_COLORS.p3} strokeWidth="1.5" />
        </>}
        {patientPoints.map((p, i) => <g key={i}><circle cx={xScale(p.x)} cy={yScale(p.y)} r="7" fill="#1a1a1a" stroke="#fff" strokeWidth="2" /><circle cx={xScale(p.x)} cy={yScale(p.y)} r="4" fill="#fff" /></g>)}
        <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#333" strokeWidth="1.5" />
        {xTicks.map(t => <g key={t}><line x1={xScale(t)} y1={height - margin.bottom} x2={xScale(t)} y2={height - margin.bottom + 5} stroke="#333" /><text x={xScale(t)} y={height - margin.bottom + 18} textAnchor="middle" fontSize="11" fill="#666">{t}</text></g>)}
        <text x={width / 2} y={height - 15} textAnchor="middle" fontSize="12" fill="#333">Age ({isWHO ? 'months' : 'years'})</text>
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#333" strokeWidth="1.5" />
        {yTicks.map(t => <g key={t}><line x1={margin.left - 5} y1={yScale(t)} x2={margin.left} y2={yScale(t)} stroke="#333" /><text x={margin.left - 8} y={yScale(t) + 4} textAnchor="end" fontSize="11" fill="#666">{t}</text></g>)}
        <text x={18} y={height / 2} textAnchor="middle" fontSize="12" fill="#333" transform={`rotate(-90,18,${height / 2})`}>{chartLabels[activeChart].yLabel}</text>
        {getData && isWHO && <>
          <text x={width - margin.right + 5} y={yScale(getData.p97[dataLength - 1])} fontSize="10" fill={WHO_COLORS.p97} fontWeight="bold">97th</text>
          <text x={width - margin.right + 5} y={yScale(getData.p85[dataLength - 1])} fontSize="10" fill={WHO_COLORS.p85}>85th</text>
          <text x={width - margin.right + 5} y={yScale(getData.p50[dataLength - 1])} fontSize="10" fill={WHO_COLORS.p50} fontWeight="bold">50th</text>
          <text x={width - margin.right + 5} y={yScale(getData.p15[dataLength - 1])} fontSize="10" fill={WHO_COLORS.p15}>15th</text>
          <text x={width - margin.right + 5} y={yScale(getData.p3[dataLength - 1])} fontSize="10" fill={WHO_COLORS.p3} fontWeight="bold">3rd</text>
        </>}
        {getData && !isWHO && <>
          <text x={width - margin.right + 5} y={yScale(getData.p97[dataLength - 1])} fontSize="9" fill={CDC_COLORS.p97}>97th</text>
          <text x={width - margin.right + 5} y={yScale(getData.p90[dataLength - 1])} fontSize="9" fill={CDC_COLORS.p90}>90th</text>
          <text x={width - margin.right + 5} y={yScale(getData.p50[dataLength - 1])} fontSize="9" fill={CDC_COLORS.p50} fontWeight="bold">50th</text>
          <text x={width - margin.right + 5} y={yScale(getData.p10[dataLength - 1])} fontSize="9" fill={CDC_COLORS.p10}>10th</text>
          <text x={width - margin.right + 5} y={yScale(getData.p3[dataLength - 1])} fontSize="9" fill={CDC_COLORS.p3}>3rd</text>
        </>}
        <text x={width / 2} y={height - 3} textAnchor="middle" fontSize="9" fill="#888">Source: {isWHO ? 'WHO Child Growth Standards' : 'CDC Growth Charts'}</text>
      </svg>
    </div>
  );

  return (
    <div className="space-y-4 p-4" data-testid="growth-chart-page">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><HealthGrowthIcon className="h-5 w-5 text-teal-500" />{chartLabels[activeChart].title}</CardTitle>
          <CardDescription className="text-xs">{gender === 'male' ? 'Boys' : 'Girls'} • {chartType} • {isWHO ? '0-24 months' : '2-20 years'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant={chartType === "WHO" ? "default" : "outline"} onClick={() => setChartType("WHO")} className="text-xs h-9" data-testid="who-btn">WHO (0-24m)</Button>
            <Button variant={chartType === "CDC" ? "default" : "outline"} onClick={() => { setChartType("CDC"); if (activeChart === 'hc') setActiveChart('weight'); }} className="text-xs h-9" data-testid="cdc-btn">CDC (2-20y)</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant={gender === "male" ? "default" : "outline"} onClick={() => setGender("male")} className={`text-xs h-9 ${gender === 'male' ? 'bg-blue-600 hover:bg-blue-700' : ''}`} data-testid="male-btn">Boys</Button>
            <Button variant={gender === "female" ? "default" : "outline"} onClick={() => setGender("female")} className={`text-xs h-9 ${gender === 'female' ? 'bg-pink-600 hover:bg-pink-700' : ''}`} data-testid="female-btn">Girls</Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant={activeChart === 'weight' ? "default" : "outline"} onClick={() => setActiveChart('weight')} className="text-xs h-9" data-testid="weight-btn">Weight</Button>
            <Button variant={activeChart === 'length' ? "default" : "outline"} onClick={() => setActiveChart('length')} className="text-xs h-9" data-testid="length-btn">{isWHO ? 'Length' : 'Stature'}</Button>
            <Button variant={activeChart === 'hc' ? "default" : "outline"} onClick={() => setActiveChart('hc')} className="text-xs h-9" disabled={!isWHO} data-testid="hc-btn">Head C.</Button>
            <Button variant={activeChart === 'bmi' ? "default" : "outline"} onClick={() => setActiveChart('bmi')} className="text-xs h-9" data-testid="bmi-btn">BMI</Button>
          </div>
        </CardContent>
      </Card>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setIsFullscreen(false)}>
          <div className="relative bg-white dark:bg-gray-900 rounded-lg p-4 max-w-full max-h-full overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <div><h3 className="text-lg font-semibold">{chartLabels[activeChart].title}</h3><p className="text-sm text-muted-foreground">{isWHO ? 'WHO' : 'CDC'} • {gender === 'male' ? 'Boys' : 'Girls'}</p></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToPDF} className="h-9 px-3"><FileText className="h-4 w-4 mr-1" />PDF</Button>
                <Button variant="outline" size="sm" onClick={savePNG} className="h-9 w-9 p-0"><Download className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setIsFullscreen(false)} className="h-9 w-9 p-0"><Minimize2 className="h-4 w-4" /></Button>
              </div>
            </div>
            {renderSVG()}
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div><CardTitle className="text-sm">{chartLabels[activeChart].title}</CardTitle><CardDescription className="text-xs">{isWHO ? 'WHO' : 'CDC'} • {gender === 'male' ? 'Boys' : 'Girls'} • Percentiles: {isWHO ? '3, 15, 50, 85, 97' : '3, 5, 10, 25, 50, 75, 90, 95, 97'}</CardDescription></div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={exportToPDF} className="h-8 px-2"><FileText className="h-3.5 w-3.5 mr-1" />PDF</Button>
              <Button variant="outline" size="sm" onClick={savePNG} className="h-8 w-8 p-0"><Download className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)} className="h-8 w-8 p-0"><Maximize2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">{renderSVG()}</CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Plot Patient Measurement</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Date *</Label><Input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="h-9 text-sm" data-testid="date-input" /></div>
            <div><Label className="text-xs">Age ({isWHO ? 'months' : 'years'}) *</Label><Input type="number" min="0" max={isWHO ? "24" : "20"} value={newEntry.ageValue} onChange={e => setNewEntry({...newEntry, ageValue: e.target.value})} className="h-9 font-mono text-sm" data-testid="age-input" /></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div><Label className="text-xs">Weight (kg)</Label><Input type="number" step="0.01" min="0" value={newEntry.weight} onChange={e => setNewEntry({...newEntry, weight: e.target.value})} className="h-9 font-mono text-sm" data-testid="weight-input" /></div>
            <div><Label className="text-xs">{isWHO ? 'Length' : 'Stature'} (cm)</Label><Input type="number" step="0.1" min="0" value={newEntry.length} onChange={e => setNewEntry({...newEntry, length: e.target.value})} className="h-9 font-mono text-sm" data-testid="length-input" /></div>
            <div><Label className="text-xs">Head Circ (cm)</Label><Input type="number" step="0.1" min="0" value={newEntry.hc} onChange={e => setNewEntry({...newEntry, hc: e.target.value})} className="h-9 font-mono text-sm" disabled={!isWHO} data-testid="hc-input" /></div>
            <div><Label className="text-xs">BMI (kg/m²)</Label><Input type="number" step="0.1" min="0" value={newEntry.bmi} onChange={e => setNewEntry({...newEntry, bmi: e.target.value})} className="h-9 font-mono text-sm" data-testid="bmi-input" /></div>
          </div>
          <Button onClick={addEntry} className="w-full" size="sm" disabled={!newEntry.date || !newEntry.ageValue || (!newEntry.weight && !newEntry.length && !newEntry.hc && !newEntry.bmi)} data-testid="add-measurement-btn"><Plus className="h-4 w-4 mr-1" />Plot Data Point</Button>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Plotted Measurements ({entries.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {entries.map(entry => {
              const wI = entry.weight ? getPercentileInfo(entry.ageInMonths, entry.weight, 'weight') : null;
              const lI = entry.length ? getPercentileInfo(entry.ageInMonths, entry.length, 'length') : null;
              const hI = entry.hc && isWHO ? getPercentileInfo(entry.ageInMonths, entry.hc, 'hc') : null;
              const bI = entry.bmi ? getPercentileInfo(entry.ageInMonths, entry.bmi, 'bmi') : null;
              return (
                <div key={entry.id} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-teal-600">{entry.date} • {entry.ageValue}{entry.ageUnit === 'years' ? 'y' : 'm'}</span>
                    <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="text-red-500 p-1"><Trash2 className="h-3 w-3" /></button>
                  </div>
                  {wI && <p>Weight: {entry.weight} kg → <span className={wI.color}>{wI.percentile} percentile ({wI.interpretation})</span></p>}
                  {lI && <p>{isWHO ? 'Length' : 'Stature'}: {entry.length} cm → <span className={lI.color}>{lI.percentile} percentile ({lI.interpretation})</span></p>}
                  {hI && <p>Head Circ: {entry.hc} cm → <span className={hI.color}>{hI.percentile} percentile ({hI.interpretation})</span></p>}
                  {bI && <p>BMI: {entry.bmi} kg/m² → <span className={bI.color}>{bI.percentile} percentile ({bI.interpretation})</span></p>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Reference</CardTitle></CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          {isWHO ? <>
            <p className="font-medium">WHO Percentiles (3rd, 15th, 50th, 85th, 97th):</p>
            <p>• <span className="text-green-600 font-medium">15th-85th:</span> Normal range</p>
            <p>• <span className="text-orange-500 font-medium">3rd-15th / 85th-97th:</span> Monitor growth</p>
            <p>• <span className="text-red-600 font-medium">&lt;3rd / &gt;97th:</span> Evaluation needed</p>
          </> : <>
            <p className="font-medium">CDC Percentiles (3rd, 5th, 10th, 25th, 50th, 75th, 90th, 95th, 97th):</p>
            <p>• <span className="text-green-600 font-medium">25th-75th:</span> Normal range</p>
            <p>• <span className="text-yellow-600 font-medium">10th-25th / 75th-90th:</span> Monitor</p>
            <p>• <span className="text-red-600 font-medium">&lt;3rd / &gt;97th:</span> Evaluation needed</p>
          </>}
          <p className="pt-2 border-t text-[10px]">Data: {isWHO ? 'WHO Child Growth Standards (who.int)' : 'CDC Growth Charts (cdc.gov)'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
