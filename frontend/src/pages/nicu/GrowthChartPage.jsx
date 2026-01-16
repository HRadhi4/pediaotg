import React, { useState, useRef, useMemo } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Growth Chart Page - Using Official CDC/WHO Data
 * 
 * WHO Data Source: https://www.cdc.gov/growthcharts/who-data-files.htm (0-24 months)
 * CDC Data Source: https://www.cdc.gov/growthcharts/cdc-data-files.htm (2-20 years)
 * 
 * Percentile curves are drawn as fixed reference lines.
 * Patient measurements are plotted as points on top.
 */

// ============================================================================
// OFFICIAL WHO GROWTH STANDARDS DATA (0-24 months)
// ============================================================================

const WHO_DATA = {
  weight: {
    male: {
      p3:  [2.46, 3.39, 4.32, 5.02, 5.56, 6.0, 6.35, 6.65, 6.91, 7.14, 7.36, 7.55, 7.74, 7.92, 8.1, 8.27, 8.43, 8.59, 8.75, 8.91, 9.07, 9.22, 9.37, 9.52, 9.67],
      p10: [2.76, 3.75, 4.74, 5.48, 6.05, 6.51, 6.89, 7.21, 7.49, 7.74, 7.96, 8.18, 8.38, 8.58, 8.77, 8.95, 9.13, 9.31, 9.48, 9.66, 9.83, 10.0, 10.16, 10.33, 10.5],
      p25: [3.03, 4.08, 5.12, 5.89, 6.48, 6.97, 7.37, 7.71, 8.0, 8.27, 8.51, 8.74, 8.96, 9.17, 9.37, 9.57, 9.77, 9.96, 10.15, 10.33, 10.52, 10.7, 10.89, 11.07, 11.25],
      p50: [3.35, 4.47, 5.57, 6.38, 7.0, 7.51, 7.93, 8.3, 8.62, 8.9, 9.16, 9.41, 9.65, 9.87, 10.1, 10.31, 10.52, 10.73, 10.94, 11.14, 11.35, 11.55, 11.75, 11.95, 12.15],
      p75: [3.69, 4.89, 6.05, 6.9, 7.55, 8.09, 8.54, 8.93, 9.27, 9.58, 9.86, 10.13, 10.38, 10.63, 10.87, 11.1, 11.34, 11.56, 11.79, 12.01, 12.24, 12.46, 12.68, 12.9, 13.13],
      p90: [4.01, 5.29, 6.51, 7.4, 8.08, 8.64, 9.12, 9.53, 9.89, 10.22, 10.53, 10.82, 11.09, 11.36, 11.61, 11.87, 12.12, 12.37, 12.61, 12.86, 13.1, 13.34, 13.58, 13.83, 14.07],
      p97: [4.42, 5.8, 7.09, 8.02, 8.75, 9.34, 9.85, 10.29, 10.68, 11.04, 11.37, 11.69, 11.99, 12.28, 12.56, 12.84, 13.11, 13.38, 13.66, 13.93, 14.19, 14.46, 14.74, 15.01, 15.28]
    },
    female: {
      p3:  [2.39, 3.16, 3.94, 4.54, 5.01, 5.4, 5.73, 6.01, 6.25, 6.47, 6.67, 6.86, 7.04, 7.22, 7.39, 7.56, 7.73, 7.89, 8.06, 8.22, 8.39, 8.55, 8.71, 8.87, 9.04],
      p10: [2.68, 3.5, 4.34, 4.97, 5.48, 5.9, 6.25, 6.55, 6.81, 7.05, 7.27, 7.47, 7.67, 7.85, 8.04, 8.22, 8.41, 8.59, 8.77, 8.94, 9.12, 9.3, 9.47, 9.65, 9.83],
      p25: [2.93, 3.81, 4.7, 5.37, 5.91, 6.35, 6.72, 7.04, 7.32, 7.58, 7.81, 8.03, 8.24, 8.45, 8.65, 8.84, 9.04, 9.23, 9.42, 9.62, 9.81, 10.0, 10.19, 10.38, 10.57],
      p50: [3.23, 4.19, 5.13, 5.85, 6.42, 6.9, 7.3, 7.64, 7.95, 8.23, 8.48, 8.72, 8.95, 9.17, 9.39, 9.6, 9.81, 10.02, 10.23, 10.44, 10.65, 10.85, 11.06, 11.27, 11.48],
      p75: [3.55, 4.59, 5.6, 6.36, 6.98, 7.5, 7.93, 8.3, 8.63, 8.94, 9.21, 9.48, 9.73, 9.97, 10.21, 10.44, 10.67, 10.9, 11.13, 11.35, 11.58, 11.81, 12.03, 12.26, 12.49],
      p90: [3.85, 4.98, 6.05, 6.87, 7.53, 8.08, 8.54, 8.94, 9.31, 9.64, 9.94, 10.22, 10.5, 10.76, 11.02, 11.27, 11.52, 11.77, 12.02, 12.27, 12.51, 12.76, 13.01, 13.25, 13.5],
      p97: [4.23, 5.48, 6.63, 7.51, 8.23, 8.83, 9.34, 9.78, 10.18, 10.55, 10.89, 11.2, 11.51, 11.8, 12.09, 12.37, 12.65, 12.92, 13.2, 13.47, 13.74, 14.02, 14.29, 14.57, 14.85]
    }
  },
  length: {
    male: {
      p3:  [46.1, 50.8, 54.4, 57.3, 59.7, 61.7, 63.3, 64.8, 66.2, 67.5, 68.7, 69.9, 71.0, 72.1, 73.1, 74.1, 75.0, 76.0, 76.9, 77.7, 78.6, 79.4, 80.2, 81.0, 81.7],
      p10: [47.5, 52.2, 55.9, 58.8, 61.2, 63.2, 64.9, 66.4, 67.8, 69.1, 70.4, 71.6, 72.7, 73.8, 74.9, 75.9, 76.9, 77.9, 78.8, 79.7, 80.6, 81.5, 82.3, 83.1, 83.9],
      p25: [48.6, 53.4, 57.1, 60.1, 62.5, 64.5, 66.2, 67.7, 69.1, 70.5, 71.7, 73.0, 74.1, 75.3, 76.4, 77.4, 78.5, 79.5, 80.4, 81.4, 82.3, 83.2, 84.1, 84.9, 85.8],
      p50: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8],
      p75: [51.2, 56.0, 59.8, 62.8, 65.3, 67.3, 69.1, 70.6, 72.1, 73.5, 74.8, 76.1, 77.4, 78.6, 79.7, 80.9, 82.0, 83.0, 84.1, 85.1, 86.1, 87.1, 88.0, 89.0, 89.9],
      p90: [52.3, 57.2, 61.0, 64.0, 66.6, 68.6, 70.4, 71.9, 73.4, 74.8, 76.2, 77.5, 78.8, 80.0, 81.2, 82.4, 83.5, 84.6, 85.7, 86.8, 87.8, 88.8, 89.8, 90.8, 91.7],
      p97: [53.7, 58.6, 62.4, 65.5, 68.0, 70.1, 71.9, 73.5, 75.0, 76.5, 77.9, 79.2, 80.5, 81.8, 83.0, 84.2, 85.4, 86.5, 87.7, 88.8, 89.8, 90.9, 91.9, 92.9, 93.9]
    },
    female: {
      p3:  [45.4, 49.8, 53.0, 55.6, 57.8, 59.6, 61.2, 62.7, 64.0, 65.3, 66.5, 67.7, 68.9, 70.0, 71.0, 72.0, 73.0, 74.0, 74.9, 75.8, 76.7, 77.5, 78.4, 79.2, 80.0],
      p10: [46.8, 51.2, 54.5, 57.1, 59.3, 61.2, 62.8, 64.3, 65.7, 67.0, 68.3, 69.5, 70.7, 71.8, 72.9, 74.0, 75.0, 76.0, 77.0, 77.9, 78.8, 79.7, 80.6, 81.5, 82.3],
      p25: [47.9, 52.4, 55.7, 58.4, 60.6, 62.5, 64.2, 65.7, 67.2, 68.5, 69.8, 71.1, 72.3, 73.4, 74.6, 75.7, 76.7, 77.7, 78.7, 79.7, 80.7, 81.6, 82.5, 83.4, 84.2],
      p50: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.6, 85.5, 86.4],
      p75: [50.4, 55.0, 58.4, 61.2, 63.5, 65.5, 67.3, 68.8, 70.3, 71.8, 73.1, 74.5, 75.8, 77.0, 78.2, 79.4, 80.5, 81.6, 82.7, 83.7, 84.7, 85.7, 86.7, 87.7, 88.6],
      p90: [51.5, 56.2, 59.7, 62.5, 64.9, 66.9, 68.6, 70.3, 71.8, 73.2, 74.6, 76.0, 77.3, 78.6, 79.8, 81.0, 82.2, 83.3, 84.4, 85.5, 86.6, 87.6, 88.6, 89.6, 90.6],
      p97: [52.9, 57.6, 61.1, 64.0, 66.4, 68.5, 70.3, 71.9, 73.5, 75.0, 76.4, 77.8, 79.2, 80.5, 81.7, 83.0, 84.2, 85.4, 86.5, 87.6, 88.7, 89.8, 90.8, 91.9, 92.9]
    }
  },
  hc: {
    male: {
      p3:  [31.9, 34.9, 36.8, 38.1, 39.2, 40.1, 40.9, 41.5, 42.0, 42.5, 42.9, 43.2, 43.5, 43.8, 44.0, 44.2, 44.4, 44.6, 44.7, 44.9, 45.0, 45.2, 45.3, 45.4, 45.5],
      p10: [32.8, 35.8, 37.6, 39.0, 40.1, 41.0, 41.8, 42.4, 42.9, 43.4, 43.8, 44.1, 44.4, 44.7, 44.9, 45.1, 45.3, 45.5, 45.7, 45.8, 46.0, 46.1, 46.3, 46.4, 46.5],
      p25: [33.6, 36.5, 38.3, 39.7, 40.8, 41.7, 42.5, 43.1, 43.7, 44.2, 44.6, 44.9, 45.2, 45.5, 45.7, 45.9, 46.1, 46.3, 46.5, 46.6, 46.8, 46.9, 47.1, 47.2, 47.3],
      p50: [34.5, 37.3, 39.1, 40.5, 41.6, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1, 46.3, 46.6, 46.8, 47.0, 47.2, 47.4, 47.5, 47.7, 47.8, 48.0, 48.1, 48.3],
      p75: [35.3, 38.1, 39.9, 41.3, 42.4, 43.4, 44.2, 44.8, 45.4, 45.8, 46.3, 46.6, 46.9, 47.2, 47.5, 47.7, 47.9, 48.1, 48.3, 48.4, 48.6, 48.7, 48.9, 49.0, 49.2],
      p90: [36.1, 38.8, 40.6, 42.0, 43.2, 44.1, 44.9, 45.6, 46.1, 46.6, 47.0, 47.4, 47.7, 48.0, 48.3, 48.5, 48.7, 48.9, 49.1, 49.2, 49.4, 49.6, 49.7, 49.9, 50.0],
      p97: [37.0, 39.6, 41.5, 42.9, 44.0, 45.0, 45.8, 46.4, 47.0, 47.5, 47.9, 48.3, 48.6, 48.9, 49.2, 49.4, 49.6, 49.8, 50.0, 50.2, 50.4, 50.5, 50.7, 50.8, 51.0]
    },
    female: {
      p3:  [31.5, 34.2, 35.8, 37.1, 38.1, 38.9, 39.6, 40.2, 40.7, 41.2, 41.5, 41.9, 42.2, 42.4, 42.7, 42.9, 43.1, 43.3, 43.5, 43.6, 43.8, 44.0, 44.1, 44.3, 44.4],
      p10: [32.4, 35.0, 36.7, 37.9, 39.0, 39.8, 40.5, 41.1, 41.7, 42.1, 42.5, 42.9, 43.2, 43.4, 43.7, 43.9, 44.1, 44.3, 44.5, 44.6, 44.8, 45.0, 45.1, 45.3, 45.4],
      p25: [33.1, 35.8, 37.4, 38.7, 39.7, 40.6, 41.3, 41.9, 42.5, 42.9, 43.3, 43.7, 44.0, 44.3, 44.5, 44.7, 44.9, 45.1, 45.3, 45.5, 45.6, 45.8, 46.0, 46.1, 46.2],
      p50: [33.9, 36.5, 38.3, 39.5, 40.6, 41.5, 42.2, 42.8, 43.4, 43.8, 44.2, 44.6, 44.9, 45.2, 45.4, 45.7, 45.9, 46.1, 46.2, 46.4, 46.6, 46.7, 46.9, 47.0, 47.2],
      p75: [34.7, 37.3, 39.1, 40.4, 41.4, 42.3, 43.1, 43.7, 44.3, 44.7, 45.1, 45.5, 45.8, 46.1, 46.3, 46.6, 46.8, 47.0, 47.2, 47.3, 47.5, 47.7, 47.8, 48.0, 48.1],
      p90: [35.4, 38.0, 39.8, 41.1, 42.2, 43.1, 43.9, 44.5, 45.1, 45.5, 46.0, 46.3, 46.6, 46.9, 47.2, 47.4, 47.6, 47.8, 48.0, 48.2, 48.4, 48.5, 48.7, 48.8, 49.0],
      p97: [36.2, 38.9, 40.7, 42.0, 43.1, 44.0, 44.8, 45.5, 46.0, 46.5, 46.9, 47.3, 47.6, 47.9, 48.2, 48.4, 48.6, 48.8, 49.0, 49.2, 49.4, 49.5, 49.7, 49.8, 50.0]
    }
  }
};

// ============================================================================
// OFFICIAL CDC GROWTH CHARTS DATA (2-20 years)
// Ages: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
// ============================================================================

const CDC_DATA = {
  weight: {
    male: {
      p3:  [10.4, 11.8, 13.3, 14.9, 16.5, 18.3, 20.1, 22.1, 24.2, 26.6, 29.5, 33.0, 37.1, 41.5, 45.8, 49.3, 51.7, 53.2, 54.0],
      p10: [11.1, 12.6, 14.1, 15.8, 17.7, 19.6, 21.6, 23.8, 26.2, 29.0, 32.4, 36.3, 40.8, 45.5, 49.8, 53.3, 55.8, 57.4, 58.4],
      p25: [11.8, 13.4, 15.1, 17.0, 19.0, 21.1, 23.3, 25.8, 28.7, 32.0, 35.9, 40.4, 45.3, 50.2, 54.7, 58.2, 60.7, 62.5, 63.6],
      p50: [12.7, 14.4, 16.3, 18.5, 20.8, 23.2, 25.8, 28.7, 32.1, 36.1, 40.7, 45.8, 51.2, 56.5, 61.1, 64.7, 67.3, 69.2, 70.6],
      p75: [13.6, 15.6, 17.7, 20.3, 22.9, 25.8, 28.8, 32.4, 36.6, 41.4, 46.8, 52.7, 58.6, 64.2, 69.0, 72.8, 75.6, 77.6, 79.2],
      p90: [14.6, 16.7, 19.3, 22.2, 25.3, 28.7, 32.5, 36.9, 42.0, 47.7, 54.0, 60.4, 66.8, 72.8, 77.9, 82.1, 85.1, 87.1, 88.8],
      p97: [15.6, 18.0, 21.0, 24.5, 28.3, 32.5, 37.4, 43.1, 49.4, 56.3, 63.3, 70.3, 77.0, 83.2, 89.0, 93.8, 97.2, 99.2, 100.8]
    },
    female: {
      p3:  [10.0, 11.4, 12.8, 14.3, 16.0, 17.7, 19.5, 21.6, 24.0, 26.8, 30.0, 33.4, 36.7, 39.6, 41.8, 43.3, 44.2, 44.8, 45.0],
      p10: [10.6, 12.1, 13.6, 15.3, 17.1, 19.1, 21.2, 23.5, 26.3, 29.5, 33.1, 36.6, 40.0, 42.8, 44.9, 46.3, 47.2, 48.0, 48.4],
      p25: [11.2, 12.9, 14.6, 16.5, 18.5, 20.7, 23.1, 25.9, 29.2, 32.9, 36.7, 40.6, 43.9, 46.7, 48.6, 50.0, 51.0, 51.8, 52.5],
      p50: [12.1, 13.9, 15.9, 18.0, 20.3, 22.9, 25.8, 29.1, 33.1, 37.4, 41.8, 46.0, 49.5, 52.1, 53.9, 55.2, 56.2, 57.4, 58.2],
      p75: [13.0, 15.2, 17.4, 20.0, 22.7, 25.7, 29.2, 33.3, 38.0, 43.2, 48.3, 53.0, 56.8, 59.4, 61.2, 62.3, 63.4, 64.8, 65.9],
      p90: [13.9, 16.5, 19.2, 22.1, 25.4, 29.0, 33.2, 38.2, 43.9, 49.9, 56.0, 61.3, 65.6, 68.5, 70.4, 71.6, 72.8, 74.2, 75.4],
      p97: [15.0, 18.0, 21.3, 24.9, 28.9, 33.4, 38.5, 44.6, 51.4, 58.7, 65.9, 72.4, 77.7, 81.6, 84.4, 86.2, 87.4, 88.4, 89.0]
    }
  },
  stature: {
    male: {
      p3:  [79.9, 88.4, 94.6, 100.3, 106.1, 111.9, 117.5, 122.4, 126.7, 130.8, 135.7, 141.7, 148.5, 154.6, 158.8, 161.3, 162.5, 163.1, 163.3],
      p10: [82.0, 90.5, 97.1, 103.2, 109.2, 115.1, 120.8, 126.0, 130.5, 134.9, 139.9, 146.4, 153.6, 159.8, 163.7, 165.8, 166.9, 167.4, 167.7],
      p25: [84.1, 92.7, 99.7, 106.0, 112.2, 118.4, 124.3, 129.6, 134.4, 139.0, 144.3, 151.1, 158.7, 164.8, 168.5, 170.4, 171.3, 171.8, 172.0],
      p50: [86.5, 95.3, 102.5, 109.2, 115.7, 122.0, 128.1, 133.7, 138.8, 143.7, 149.3, 156.4, 164.1, 170.1, 173.6, 175.3, 176.2, 176.6, 176.8],
      p75: [88.8, 97.9, 105.4, 112.3, 119.1, 125.7, 132.1, 137.9, 143.3, 148.5, 154.4, 161.7, 169.5, 175.3, 178.6, 180.2, 181.0, 181.4, 181.7],
      p90: [90.9, 100.4, 108.0, 115.1, 122.1, 129.0, 135.7, 141.8, 147.4, 152.9, 159.0, 166.6, 174.2, 179.8, 182.9, 184.5, 185.3, 185.7, 186.0],
      p97: [93.0, 102.9, 110.5, 117.8, 125.1, 132.3, 139.3, 145.7, 151.5, 157.3, 163.7, 171.3, 178.8, 184.1, 187.1, 188.6, 189.5, 189.9, 190.2]
    },
    female: {
      p3:  [78.4, 86.9, 93.1, 99.4, 105.8, 111.9, 117.3, 121.9, 126.0, 130.7, 137.4, 144.2, 148.1, 149.7, 150.4, 150.7, 150.9, 151.0, 151.1],
      p10: [80.5, 89.2, 95.6, 102.0, 108.6, 114.9, 120.5, 125.3, 129.8, 135.0, 142.0, 148.4, 152.1, 153.6, 154.3, 154.6, 154.8, 154.9, 155.0],
      p25: [82.6, 91.6, 98.1, 104.8, 111.6, 118.1, 123.9, 129.0, 133.7, 139.4, 146.5, 152.7, 156.0, 157.5, 158.2, 158.6, 158.8, 158.9, 159.0],
      p50: [85.0, 94.2, 101.0, 108.0, 115.0, 121.8, 127.8, 133.1, 138.2, 144.3, 151.5, 157.3, 160.5, 161.9, 162.6, 162.9, 163.1, 163.3, 163.3],
      p75: [87.3, 96.9, 104.0, 111.2, 118.6, 125.6, 131.9, 137.4, 142.8, 149.2, 156.4, 162.0, 164.9, 166.3, 166.9, 167.3, 167.5, 167.6, 167.7],
      p90: [89.4, 99.3, 106.8, 114.3, 121.9, 129.1, 135.6, 141.4, 147.0, 153.7, 160.8, 166.1, 168.9, 170.2, 170.9, 171.2, 171.4, 171.5, 171.6],
      p97: [91.5, 101.8, 109.5, 117.4, 125.3, 132.7, 139.4, 145.4, 151.3, 158.1, 165.2, 170.2, 172.9, 174.2, 174.8, 175.1, 175.3, 175.4, 175.5]
    }
  }
};

// Percentile line colors
const PERCENTILE_COLORS = {
  p3: '#C41E3A',
  p10: '#FD8D3C',
  p25: '#FDAE6B',
  p50: '#31A354',
  p75: '#FDAE6B',
  p90: '#FD8D3C',
  p97: '#C41E3A'
};

const GrowthChartPage = () => {
  const [chartType, setChartType] = useState("WHO");
  const [gender, setGender] = useState("male");
  const [activeChart, setActiveChart] = useState("weight");
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    ageValue: "",
    weight: "",
    length: "",
    hc: ""
  });
  const svgRef = useRef(null);

  const isWHO = chartType === "WHO";

  // Chart dimensions - increased bottom margin for X-axis label
  const width = 680;
  const height = 380;
  const margin = { top: 20, right: 50, bottom: 60, left: 55 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Get data for the selected chart
  const getData = useMemo(() => {
    if (isWHO) {
      return WHO_DATA[activeChart]?.[gender];
    } else {
      const key = activeChart === 'length' ? 'stature' : activeChart;
      return CDC_DATA[key]?.[gender];
    }
  }, [isWHO, activeChart, gender]);

  // X and Y scale calculations
  const xMin = isWHO ? 0 : 2;
  const xMax = isWHO ? 24 : 20;
  const dataLength = isWHO ? 25 : 19;

  const yValues = useMemo(() => {
    if (!getData) return { min: 0, max: 100 };
    const allValues = [...getData.p3, ...getData.p97];
    return {
      min: Math.floor(Math.min(...allValues) * 0.95),
      max: Math.ceil(Math.max(...allValues) * 1.05)
    };
  }, [getData]);

  // Scale functions
  const xScale = (val) => margin.left + ((val - xMin) / (xMax - xMin)) * innerWidth;
  const yScale = (val) => margin.top + innerHeight - ((val - yValues.min) / (yValues.max - yValues.min)) * innerHeight;

  // Generate path for a percentile line
  const generatePath = (percentileData) => {
    if (!percentileData || percentileData.length === 0) return "";
    
    const points = percentileData.map((value, index) => {
      const x = isWHO ? index : index + 2;
      return `${xScale(x)},${yScale(value)}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Add entry
  const addEntry = () => {
    if (newEntry.date && newEntry.ageValue) {
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

  const removeEntry = (id) => setEntries(entries.filter(e => e.id !== id));

  // Save chart to PNG
  const saveChartToPng = async () => {
    if (!svgRef.current) return;
    
    try {
      const svgElement = svgRef.current.querySelector('svg');
      if (!svgElement) return;
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const scale = 2; // High resolution
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      
      // Fill background
      ctx.fillStyle = gender === 'male' ? '#e8f4fc' : '#fce8f4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Load image and draw to canvas
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        
        // Download
        const link = document.createElement('a');
        link.download = `growth-chart-${chartType}-${gender}-${activeChart}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      img.src = url;
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // Get patient points to plot
  const patientPoints = useMemo(() => {
    const value = activeChart === 'length' ? 'length' : activeChart;
    return entries
      .filter(e => e[value] && parseFloat(e[value]) > 0)
      .map(e => ({
        x: isWHO ? e.ageInMonths : e.ageInMonths / 12,
        y: parseFloat(e[value]),
        date: e.date
      }));
  }, [entries, activeChart, isWHO]);

  // Calculate percentile for a measurement
  const getPercentileInfo = (ageInMonths, value, measureType) => {
    if (!value) return null;
    const val = parseFloat(value);
    const data = isWHO ? WHO_DATA[measureType]?.[gender] : CDC_DATA[measureType === 'length' ? 'stature' : measureType]?.[gender];
    if (!data) return null;
    
    const idx = isWHO ? Math.min(Math.max(Math.round(ageInMonths), 0), 24) : Math.min(Math.max(Math.round(ageInMonths / 12) - 2, 0), 18);
    
    const p3 = data.p3[idx], p10 = data.p10[idx], p25 = data.p25[idx];
    const p50 = data.p50[idx], p75 = data.p75[idx], p90 = data.p90[idx], p97 = data.p97[idx];
    
    let percentile, interpretation, color;
    if (val < p3) { percentile = "<3"; interpretation = "Below 3rd - Evaluation needed"; color = "text-red-600"; }
    else if (val < p10) { percentile = "3-10"; interpretation = "Below 10th - Monitor"; color = "text-orange-500"; }
    else if (val < p25) { percentile = "10-25"; interpretation = "Low-normal"; color = "text-yellow-600"; }
    else if (val < p50) { percentile = "25-50"; interpretation = "Normal"; color = "text-green-600"; }
    else if (val < p75) { percentile = "50-75"; interpretation = "Normal"; color = "text-green-600"; }
    else if (val < p90) { percentile = "75-90"; interpretation = "Normal"; color = "text-green-600"; }
    else if (val < p97) { percentile = "90-97"; interpretation = "High-normal"; color = "text-yellow-600"; }
    else { percentile = ">97"; interpretation = "Above 97th - Evaluation needed"; color = "text-red-600"; }
    
    return { percentile, interpretation, color };
  };

  const chartLabels = {
    weight: { title: "Weight-for-Age", unit: "kg", yLabel: "Weight (kg)" },
    length: { title: isWHO ? "Length-for-Age" : "Stature-for-Age", unit: "cm", yLabel: isWHO ? "Length (cm)" : "Stature (cm)" },
    hc: { title: "Head Circumference-for-Age", unit: "cm", yLabel: "Head Circ (cm)" }
  };

  const isHCDisabled = !isWHO;

  // Generate X-axis ticks
  const xTicks = isWHO ? [0, 3, 6, 9, 12, 15, 18, 21, 24] : [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  
  // Generate Y-axis ticks
  const yTickCount = 8;
  const yTickStep = (yValues.max - yValues.min) / yTickCount;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => Math.round(yValues.min + i * yTickStep));

  return (
    <div className="space-y-4 p-4" data-testid="growth-chart-page">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <HealthGrowthIcon className="h-5 w-5 text-teal-500" />
            {chartLabels[activeChart].title}
          </CardTitle>
          <CardDescription className="text-xs">
            {gender === 'male' ? 'Boys' : 'Girls'} • {chartType} • {isWHO ? '0-24 months' : '2-20 years'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant={chartType === "WHO" ? "default" : "outline"} onClick={() => setChartType("WHO")} className="text-xs h-9" data-testid="who-btn">WHO (0-24m)</Button>
            <Button variant={chartType === "CDC" ? "default" : "outline"} onClick={() => { setChartType("CDC"); if (activeChart === 'hc') setActiveChart('weight'); }} className="text-xs h-9" data-testid="cdc-btn">CDC (2-20y)</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant={gender === "male" ? "default" : "outline"} onClick={() => setGender("male")} className="text-xs h-9" data-testid="male-btn">Boys</Button>
            <Button variant={gender === "female" ? "default" : "outline"} onClick={() => setGender("female")} className="text-xs h-9" data-testid="female-btn">Girls</Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button variant={activeChart === 'weight' ? "default" : "outline"} onClick={() => setActiveChart('weight')} className="text-xs h-9" data-testid="weight-btn">Weight</Button>
            <Button variant={activeChart === 'length' ? "default" : "outline"} onClick={() => setActiveChart('length')} className="text-xs h-9" data-testid="length-btn">{isWHO ? 'Length' : 'Stature'}</Button>
            <Button variant={activeChart === 'hc' ? "default" : "outline"} onClick={() => setActiveChart('hc')} className="text-xs h-9" disabled={isHCDisabled} data-testid="hc-btn">Head Circ</Button>
          </div>
        </CardContent>
      </Card>

      {/* SVG Growth Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{chartLabels[activeChart].title} • {chartType}</CardTitle>
          <CardDescription className="text-xs">Official {isWHO ? 'WHO' : 'CDC'} Growth Data</CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={svgRef} className="rounded-lg p-2" style={{ backgroundColor: gender === 'male' ? '#e8f4fc' : '#fce8f4' }}>
            <svg width={width} height={height} className="overflow-visible">
              {/* Grid lines */}
              {yTicks.map(tick => (
                <line key={`grid-${tick}`} x1={margin.left} y1={yScale(tick)} x2={width - margin.right} y2={yScale(tick)} stroke="#ddd" strokeDasharray="2,2" />
              ))}
              
              {/* Percentile curves */}
              {getData && (
                <>
                  <path d={generatePath(getData.p97)} fill="none" stroke={PERCENTILE_COLORS.p97} strokeWidth="1.5" />
                  <path d={generatePath(getData.p90)} fill="none" stroke={PERCENTILE_COLORS.p90} strokeWidth="1.5" />
                  <path d={generatePath(getData.p75)} fill="none" stroke={PERCENTILE_COLORS.p75} strokeWidth="1" strokeDasharray="4,2" />
                  <path d={generatePath(getData.p50)} fill="none" stroke={PERCENTILE_COLORS.p50} strokeWidth="2.5" />
                  <path d={generatePath(getData.p25)} fill="none" stroke={PERCENTILE_COLORS.p25} strokeWidth="1" strokeDasharray="4,2" />
                  <path d={generatePath(getData.p10)} fill="none" stroke={PERCENTILE_COLORS.p10} strokeWidth="1.5" />
                  <path d={generatePath(getData.p3)} fill="none" stroke={PERCENTILE_COLORS.p3} strokeWidth="1.5" />
                </>
              )}
              
              {/* Patient data points */}
              {patientPoints.map((point, idx) => (
                <g key={idx}>
                  <circle cx={xScale(point.x)} cy={yScale(point.y)} r="6" fill="#000" stroke="#fff" strokeWidth="2" />
                </g>
              ))}
              
              {/* X-axis */}
              <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#333" />
              {xTicks.map(tick => (
                <g key={`x-${tick}`}>
                  <line x1={xScale(tick)} y1={height - margin.bottom} x2={xScale(tick)} y2={height - margin.bottom + 5} stroke="#333" />
                  <text x={xScale(tick)} y={height - margin.bottom + 18} textAnchor="middle" fontSize="10" fill="#666">{tick}</text>
                </g>
              ))}
              <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="11" fill="#333">Age ({isWHO ? 'months' : 'years'})</text>
              
              {/* Y-axis */}
              <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#333" />
              {yTicks.map(tick => (
                <g key={`y-${tick}`}>
                  <line x1={margin.left - 5} y1={yScale(tick)} x2={margin.left} y2={yScale(tick)} stroke="#333" />
                  <text x={margin.left - 8} y={yScale(tick) + 3} textAnchor="end" fontSize="10" fill="#666">{tick}</text>
                </g>
              ))}
              <text x={15} y={height / 2} textAnchor="middle" fontSize="11" fill="#333" transform={`rotate(-90, 15, ${height / 2})`}>{chartLabels[activeChart].yLabel}</text>
              
              {/* Percentile labels on right */}
              {getData && (
                <>
                  <text x={width - margin.right + 5} y={yScale(getData.p97[dataLength - 1])} fontSize="9" fill={PERCENTILE_COLORS.p97}>97th</text>
                  <text x={width - margin.right + 5} y={yScale(getData.p90[dataLength - 1])} fontSize="9" fill={PERCENTILE_COLORS.p90}>90th</text>
                  <text x={width - margin.right + 5} y={yScale(getData.p50[dataLength - 1])} fontSize="9" fill={PERCENTILE_COLORS.p50} fontWeight="bold">50th</text>
                  <text x={width - margin.right + 5} y={yScale(getData.p10[dataLength - 1])} fontSize="9" fill={PERCENTILE_COLORS.p10}>10th</text>
                  <text x={width - margin.right + 5} y={yScale(getData.p3[dataLength - 1])} fontSize="9" fill={PERCENTILE_COLORS.p3}>3rd</text>
                </>
              )}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Plot Measurement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Date *</Label><Input type="date" value={newEntry.date} onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} className="h-9 text-sm" data-testid="date-input" /></div>
            <div><Label className="text-xs">Age ({isWHO ? 'months' : 'years'}) *</Label><Input type="number" min="0" max={isWHO ? "24" : "20"} value={newEntry.ageValue} onChange={(e) => setNewEntry({...newEntry, ageValue: e.target.value})} className="h-9 font-mono text-sm" data-testid="age-input" /></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><Label className="text-xs">Weight (kg)</Label><Input type="number" step="0.01" min="0" value={newEntry.weight} onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})} className="h-9 font-mono text-sm" data-testid="weight-input" /></div>
            <div><Label className="text-xs">{isWHO ? 'Length' : 'Stature'} (cm)</Label><Input type="number" step="0.1" min="0" value={newEntry.length} onChange={(e) => setNewEntry({...newEntry, length: e.target.value})} className="h-9 font-mono text-sm" data-testid="length-input" /></div>
            <div><Label className="text-xs">Head Circ (cm)</Label><Input type="number" step="0.1" min="0" value={newEntry.hc} onChange={(e) => setNewEntry({...newEntry, hc: e.target.value})} className="h-9 font-mono text-sm" disabled={isHCDisabled} data-testid="hc-input" /></div>
          </div>
          <Button onClick={addEntry} className="w-full" size="sm" disabled={!newEntry.date || !newEntry.ageValue || (!newEntry.weight && !newEntry.length && !newEntry.hc)} data-testid="add-measurement-btn">
            <Plus className="h-4 w-4 mr-1" /> Plot
          </Button>
        </CardContent>
      </Card>

      {/* Plotted Data */}
      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Plotted Measurements ({entries.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {entries.map((entry) => {
              const weightInfo = entry.weight ? getPercentileInfo(entry.ageInMonths, entry.weight, 'weight') : null;
              const lengthInfo = entry.length ? getPercentileInfo(entry.ageInMonths, entry.length, 'length') : null;
              const hcInfo = entry.hc && isWHO ? getPercentileInfo(entry.ageInMonths, entry.hc, 'hc') : null;
              return (
                <div key={entry.id} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-teal-600">{entry.date} • {entry.ageValue}{entry.ageUnit === 'years' ? 'y' : 'm'}</span>
                    <button onClick={() => removeEntry(entry.id)} className="text-red-500 p-1"><Trash2 className="h-3 w-3" /></button>
                  </div>
                  {weightInfo && <p>Weight: {entry.weight} kg → <span className={weightInfo.color}>{weightInfo.percentile} percentile ({weightInfo.interpretation})</span></p>}
                  {lengthInfo && <p>{isWHO ? 'Length' : 'Stature'}: {entry.length} cm → <span className={lengthInfo.color}>{lengthInfo.percentile} percentile ({lengthInfo.interpretation})</span></p>}
                  {hcInfo && <p>Head Circ: {entry.hc} cm → <span className={hcInfo.color}>{hcInfo.percentile} percentile ({hcInfo.interpretation})</span></p>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Reference */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Reference</CardTitle></CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• <span className="text-green-600 font-medium">10th-90th percentile:</span> Normal range</p>
          <p>• <span className="text-orange-500 font-medium">3rd-10th / 90th-97th:</span> Monitor growth</p>
          <p>• <span className="text-red-600 font-medium">&lt;3rd / &gt;97th:</span> Evaluation needed</p>
          <p className="pt-2 border-t text-[10px]">Data: CDC/WHO Growth Charts (cdc.gov/growthcharts)</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
