import React, { useState, useRef } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from 'recharts';

/**
 * Growth Chart Page - Using Official CDC/WHO Data
 * 
 * WHO Data Source: https://www.cdc.gov/growthcharts/who-data-files.htm
 * CDC Data Source: https://www.cdc.gov/growthcharts/cdc-data-files.htm
 * 
 * WHO Standards: Birth to 24 months
 * CDC Charts: 2 to 20 years
 */

// ============================================================================
// OFFICIAL WHO GROWTH STANDARDS DATA (0-24 months)
// Source: CDC/WHO Growth Charts - ftp.cdc.gov/pub/Health_Statistics/NCHS/growthcharts/
// ============================================================================

const WHO_DATA = {
  weight: {
    male: {
      p3:  [2.46, 3.39, 4.32, 5.02, 5.56, 6.0, 6.35, 6.65, 6.91, 7.14, 7.36, 7.55, 7.74, 7.92, 8.1, 8.27, 8.43, 8.59, 8.75, 8.91, 9.07, 9.22, 9.37, 9.52, 9.67],
      p5:  [2.6, 3.57, 4.52, 5.24, 5.8, 6.24, 6.61, 6.92, 7.19, 7.43, 7.65, 7.86, 8.05, 8.24, 8.42, 8.6, 8.77, 8.94, 9.11, 9.27, 9.43, 9.6, 9.76, 9.91, 10.07],
      p10: [2.76, 3.75, 4.74, 5.48, 6.05, 6.51, 6.89, 7.21, 7.49, 7.74, 7.96, 8.18, 8.38, 8.58, 8.77, 8.95, 9.13, 9.31, 9.48, 9.66, 9.83, 10.0, 10.16, 10.33, 10.5],
      p25: [3.03, 4.08, 5.12, 5.89, 6.48, 6.97, 7.37, 7.71, 8.0, 8.27, 8.51, 8.74, 8.96, 9.17, 9.37, 9.57, 9.77, 9.96, 10.15, 10.33, 10.52, 10.7, 10.89, 11.07, 11.25],
      p50: [3.35, 4.47, 5.57, 6.38, 7.0, 7.51, 7.93, 8.3, 8.62, 8.9, 9.16, 9.41, 9.65, 9.87, 10.1, 10.31, 10.52, 10.73, 10.94, 11.14, 11.35, 11.55, 11.75, 11.95, 12.15],
      p75: [3.69, 4.89, 6.05, 6.9, 7.55, 8.09, 8.54, 8.93, 9.27, 9.58, 9.86, 10.13, 10.38, 10.63, 10.87, 11.1, 11.34, 11.56, 11.79, 12.01, 12.24, 12.46, 12.68, 12.9, 13.13],
      p90: [4.01, 5.29, 6.51, 7.4, 8.08, 8.64, 9.12, 9.53, 9.89, 10.22, 10.53, 10.82, 11.09, 11.36, 11.61, 11.87, 12.12, 12.37, 12.61, 12.86, 13.1, 13.34, 13.58, 13.83, 14.07],
      p95: [4.21, 5.54, 6.8, 7.71, 8.41, 8.99, 9.48, 9.91, 10.29, 10.63, 10.95, 11.25, 11.54, 11.81, 12.08, 12.35, 12.61, 12.87, 13.13, 13.39, 13.64, 13.9, 14.15, 14.41, 14.67],
      p97: [4.42, 5.8, 7.09, 8.02, 8.75, 9.34, 9.85, 10.29, 10.68, 11.04, 11.37, 11.69, 11.99, 12.28, 12.56, 12.84, 13.11, 13.38, 13.66, 13.93, 14.19, 14.46, 14.74, 15.01, 15.28]
    },
    female: {
      p3:  [2.39, 3.16, 3.94, 4.54, 5.01, 5.4, 5.73, 6.01, 6.25, 6.47, 6.67, 6.86, 7.04, 7.22, 7.39, 7.56, 7.73, 7.89, 8.06, 8.22, 8.39, 8.55, 8.71, 8.87, 9.04],
      p5:  [2.53, 3.33, 4.13, 4.75, 5.24, 5.64, 5.98, 6.27, 6.52, 6.75, 6.96, 7.15, 7.34, 7.52, 7.7, 7.88, 8.05, 8.23, 8.4, 8.57, 8.74, 8.91, 9.08, 9.25, 9.42],
      p10: [2.68, 3.5, 4.34, 4.97, 5.48, 5.9, 6.25, 6.55, 6.81, 7.05, 7.27, 7.47, 7.67, 7.85, 8.04, 8.22, 8.41, 8.59, 8.77, 8.94, 9.12, 9.3, 9.47, 9.65, 9.83],
      p25: [2.93, 3.81, 4.7, 5.37, 5.91, 6.35, 6.72, 7.04, 7.32, 7.58, 7.81, 8.03, 8.24, 8.45, 8.65, 8.84, 9.04, 9.23, 9.42, 9.62, 9.81, 10.0, 10.19, 10.38, 10.57],
      p50: [3.23, 4.19, 5.13, 5.85, 6.42, 6.9, 7.3, 7.64, 7.95, 8.23, 8.48, 8.72, 8.95, 9.17, 9.39, 9.6, 9.81, 10.02, 10.23, 10.44, 10.65, 10.85, 11.06, 11.27, 11.48],
      p75: [3.55, 4.59, 5.6, 6.36, 6.98, 7.5, 7.93, 8.3, 8.63, 8.94, 9.21, 9.48, 9.73, 9.97, 10.21, 10.44, 10.67, 10.9, 11.13, 11.35, 11.58, 11.81, 12.03, 12.26, 12.49],
      p90: [3.85, 4.98, 6.05, 6.87, 7.53, 8.08, 8.54, 8.94, 9.31, 9.64, 9.94, 10.22, 10.5, 10.76, 11.02, 11.27, 11.52, 11.77, 12.02, 12.27, 12.51, 12.76, 13.01, 13.25, 13.5],
      p95: [4.04, 5.23, 6.34, 7.19, 7.88, 8.45, 8.93, 9.36, 9.74, 10.08, 10.4, 10.71, 11.0, 11.27, 11.55, 11.81, 12.08, 12.34, 12.6, 12.86, 13.12, 13.38, 13.64, 13.9, 14.16],
      p97: [4.23, 5.48, 6.63, 7.51, 8.23, 8.83, 9.34, 9.78, 10.18, 10.55, 10.89, 11.2, 11.51, 11.8, 12.09, 12.37, 12.65, 12.92, 13.2, 13.47, 13.74, 14.02, 14.29, 14.57, 14.85]
    }
  },
  length: {
    male: {
      p3:  [46.1, 50.8, 54.4, 57.3, 59.7, 61.7, 63.3, 64.8, 66.2, 67.5, 68.7, 69.9, 71.0, 72.1, 73.1, 74.1, 75.0, 76.0, 76.9, 77.7, 78.6, 79.4, 80.2, 81.0, 81.7],
      p5:  [46.8, 51.5, 55.1, 58.1, 60.5, 62.4, 64.1, 65.6, 67.0, 68.3, 69.5, 70.7, 71.8, 72.9, 74.0, 75.0, 76.0, 76.9, 77.8, 78.7, 79.6, 80.4, 81.2, 82.0, 82.8],
      p10: [47.5, 52.2, 55.9, 58.8, 61.2, 63.2, 64.9, 66.4, 67.8, 69.1, 70.4, 71.6, 72.7, 73.8, 74.9, 75.9, 76.9, 77.9, 78.8, 79.7, 80.6, 81.5, 82.3, 83.1, 83.9],
      p25: [48.6, 53.4, 57.1, 60.1, 62.5, 64.5, 66.2, 67.7, 69.1, 70.5, 71.7, 73.0, 74.1, 75.3, 76.4, 77.4, 78.5, 79.5, 80.4, 81.4, 82.3, 83.2, 84.1, 84.9, 85.8],
      p50: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8],
      p75: [51.2, 56.0, 59.8, 62.8, 65.3, 67.3, 69.1, 70.6, 72.1, 73.5, 74.8, 76.1, 77.4, 78.6, 79.7, 80.9, 82.0, 83.0, 84.1, 85.1, 86.1, 87.1, 88.0, 89.0, 89.9],
      p90: [52.3, 57.2, 61.0, 64.0, 66.6, 68.6, 70.4, 71.9, 73.4, 74.8, 76.2, 77.5, 78.8, 80.0, 81.2, 82.4, 83.5, 84.6, 85.7, 86.8, 87.8, 88.8, 89.8, 90.8, 91.7],
      p95: [53.0, 57.9, 61.7, 64.8, 67.3, 69.4, 71.1, 72.7, 74.2, 75.7, 77.0, 78.4, 79.7, 80.9, 82.1, 83.3, 84.5, 85.6, 86.7, 87.8, 88.8, 89.9, 90.9, 91.9, 92.8],
      p97: [53.7, 58.6, 62.4, 65.5, 68.0, 70.1, 71.9, 73.5, 75.0, 76.5, 77.9, 79.2, 80.5, 81.8, 83.0, 84.2, 85.4, 86.5, 87.7, 88.8, 89.8, 90.9, 91.9, 92.9, 93.9]
    },
    female: {
      p3:  [45.4, 49.8, 53.0, 55.6, 57.8, 59.6, 61.2, 62.7, 64.0, 65.3, 66.5, 67.7, 68.9, 70.0, 71.0, 72.0, 73.0, 74.0, 74.9, 75.8, 76.7, 77.5, 78.4, 79.2, 80.0],
      p5:  [46.1, 50.5, 53.7, 56.3, 58.5, 60.4, 62.0, 63.5, 64.9, 66.2, 67.4, 68.6, 69.8, 70.9, 72.0, 73.0, 74.0, 75.0, 75.9, 76.9, 77.7, 78.6, 79.5, 80.3, 81.1],
      p10: [46.8, 51.2, 54.5, 57.1, 59.3, 61.2, 62.8, 64.3, 65.7, 67.0, 68.3, 69.5, 70.7, 71.8, 72.9, 74.0, 75.0, 76.0, 77.0, 77.9, 78.8, 79.7, 80.6, 81.5, 82.3],
      p25: [47.9, 52.4, 55.7, 58.4, 60.6, 62.5, 64.2, 65.7, 67.2, 68.5, 69.8, 71.1, 72.3, 73.4, 74.6, 75.7, 76.7, 77.7, 78.7, 79.7, 80.7, 81.6, 82.5, 83.4, 84.2],
      p50: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.6, 85.5, 86.4],
      p75: [50.4, 55.0, 58.4, 61.2, 63.5, 65.5, 67.3, 68.8, 70.3, 71.8, 73.1, 74.5, 75.8, 77.0, 78.2, 79.4, 80.5, 81.6, 82.7, 83.7, 84.7, 85.7, 86.7, 87.7, 88.6],
      p90: [51.5, 56.2, 59.7, 62.5, 64.9, 66.9, 68.6, 70.3, 71.8, 73.2, 74.6, 76.0, 77.3, 78.6, 79.8, 81.0, 82.2, 83.3, 84.4, 85.5, 86.6, 87.6, 88.6, 89.6, 90.6],
      p95: [52.2, 56.9, 60.4, 63.3, 65.7, 67.7, 69.5, 71.1, 72.6, 74.1, 75.5, 76.9, 78.3, 79.5, 80.8, 82.0, 83.2, 84.4, 85.5, 86.6, 87.7, 88.7, 89.7, 90.7, 91.7],
      p97: [52.9, 57.6, 61.1, 64.0, 66.4, 68.5, 70.3, 71.9, 73.5, 75.0, 76.4, 77.8, 79.2, 80.5, 81.7, 83.0, 84.2, 85.4, 86.5, 87.6, 88.7, 89.8, 90.8, 91.9, 92.9]
    }
  },
  hc: {
    male: {
      p3:  [31.9, 34.9, 36.8, 38.1, 39.2, 40.1, 40.9, 41.5, 42.0, 42.5, 42.9, 43.2, 43.5, 43.8, 44.0, 44.2, 44.4, 44.6, 44.7, 44.9, 45.0, 45.2, 45.3, 45.4, 45.5],
      p5:  [32.4, 35.4, 37.2, 38.6, 39.7, 40.6, 41.3, 42.0, 42.5, 42.9, 43.3, 43.7, 44.0, 44.2, 44.4, 44.7, 44.8, 45.0, 45.2, 45.3, 45.5, 45.6, 45.8, 45.9, 46.0],
      p10: [32.8, 35.8, 37.6, 39.0, 40.1, 41.0, 41.8, 42.4, 42.9, 43.4, 43.8, 44.1, 44.4, 44.7, 44.9, 45.1, 45.3, 45.5, 45.7, 45.8, 46.0, 46.1, 46.3, 46.4, 46.5],
      p25: [33.6, 36.5, 38.3, 39.7, 40.8, 41.7, 42.5, 43.1, 43.7, 44.2, 44.6, 44.9, 45.2, 45.5, 45.7, 45.9, 46.1, 46.3, 46.5, 46.6, 46.8, 46.9, 47.1, 47.2, 47.3],
      p50: [34.5, 37.3, 39.1, 40.5, 41.6, 42.6, 43.3, 44.0, 44.5, 45.0, 45.4, 45.8, 46.1, 46.3, 46.6, 46.8, 47.0, 47.2, 47.4, 47.5, 47.7, 47.8, 48.0, 48.1, 48.3],
      p75: [35.3, 38.1, 39.9, 41.3, 42.4, 43.4, 44.2, 44.8, 45.4, 45.8, 46.3, 46.6, 46.9, 47.2, 47.5, 47.7, 47.9, 48.1, 48.3, 48.4, 48.6, 48.7, 48.9, 49.0, 49.2],
      p90: [36.1, 38.8, 40.6, 42.0, 43.2, 44.1, 44.9, 45.6, 46.1, 46.6, 47.0, 47.4, 47.7, 48.0, 48.3, 48.5, 48.7, 48.9, 49.1, 49.2, 49.4, 49.6, 49.7, 49.9, 50.0],
      p95: [36.6, 39.2, 41.1, 42.5, 43.6, 44.5, 45.3, 46.0, 46.6, 47.1, 47.5, 47.9, 48.2, 48.5, 48.7, 49.0, 49.2, 49.4, 49.6, 49.7, 49.9, 50.1, 50.2, 50.3, 50.5],
      p97: [37.0, 39.6, 41.5, 42.9, 44.0, 45.0, 45.8, 46.4, 47.0, 47.5, 47.9, 48.3, 48.6, 48.9, 49.2, 49.4, 49.6, 49.8, 50.0, 50.2, 50.4, 50.5, 50.7, 50.8, 51.0]
    },
    female: {
      p3:  [31.5, 34.2, 35.8, 37.1, 38.1, 38.9, 39.6, 40.2, 40.7, 41.2, 41.5, 41.9, 42.2, 42.4, 42.7, 42.9, 43.1, 43.3, 43.5, 43.6, 43.8, 44.0, 44.1, 44.3, 44.4],
      p5:  [31.9, 34.6, 36.3, 37.5, 38.5, 39.3, 40.1, 40.7, 41.2, 41.6, 42.0, 42.4, 42.7, 42.9, 43.2, 43.4, 43.6, 43.8, 44.0, 44.1, 44.3, 44.5, 44.6, 44.7, 44.9],
      p10: [32.4, 35.0, 36.7, 37.9, 39.0, 39.8, 40.5, 41.1, 41.7, 42.1, 42.5, 42.9, 43.2, 43.4, 43.7, 43.9, 44.1, 44.3, 44.5, 44.6, 44.8, 45.0, 45.1, 45.3, 45.4],
      p25: [33.1, 35.8, 37.4, 38.7, 39.7, 40.6, 41.3, 41.9, 42.5, 42.9, 43.3, 43.7, 44.0, 44.3, 44.5, 44.7, 44.9, 45.1, 45.3, 45.5, 45.6, 45.8, 46.0, 46.1, 46.2],
      p50: [33.9, 36.5, 38.3, 39.5, 40.6, 41.5, 42.2, 42.8, 43.4, 43.8, 44.2, 44.6, 44.9, 45.2, 45.4, 45.7, 45.9, 46.1, 46.2, 46.4, 46.6, 46.7, 46.9, 47.0, 47.2],
      p75: [34.7, 37.3, 39.1, 40.4, 41.4, 42.3, 43.1, 43.7, 44.3, 44.7, 45.1, 45.5, 45.8, 46.1, 46.3, 46.6, 46.8, 47.0, 47.2, 47.3, 47.5, 47.7, 47.8, 48.0, 48.1],
      p90: [35.4, 38.0, 39.8, 41.1, 42.2, 43.1, 43.9, 44.5, 45.1, 45.5, 46.0, 46.3, 46.6, 46.9, 47.2, 47.4, 47.6, 47.8, 48.0, 48.2, 48.4, 48.5, 48.7, 48.8, 49.0],
      p95: [35.8, 38.5, 40.2, 41.6, 42.7, 43.6, 44.3, 45.0, 45.6, 46.0, 46.4, 46.8, 47.1, 47.4, 47.7, 47.9, 48.1, 48.3, 48.5, 48.7, 48.9, 49.0, 49.2, 49.3, 49.5],
      p97: [36.2, 38.9, 40.7, 42.0, 43.1, 44.0, 44.8, 45.5, 46.0, 46.5, 46.9, 47.3, 47.6, 47.9, 48.2, 48.4, 48.6, 48.8, 49.0, 49.2, 49.4, 49.5, 49.7, 49.8, 50.0]
    }
  }
};

// ============================================================================
// OFFICIAL CDC GROWTH CHARTS DATA (2-20 years)
// Source: www.cdc.gov/growthcharts/cdc-data-files.htm
// Ages: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
// ============================================================================

const CDC_DATA = {
  weight: {
    male: {
      p3:  [10.4, 11.8, 13.3, 14.9, 16.5, 18.3, 20.1, 22.1, 24.2, 26.6, 29.5, 33.0, 37.1, 41.5, 45.8, 49.3, 51.7, 53.2, 54.0],
      p5:  [10.6, 12.1, 13.6, 15.2, 16.9, 18.7, 20.7, 22.7, 24.9, 27.5, 30.6, 34.2, 38.5, 43.0, 47.3, 50.8, 53.2, 54.8, 55.7],
      p10: [11.1, 12.6, 14.1, 15.8, 17.7, 19.6, 21.6, 23.8, 26.2, 29.0, 32.4, 36.3, 40.8, 45.5, 49.8, 53.3, 55.8, 57.4, 58.4],
      p25: [11.8, 13.4, 15.1, 17.0, 19.0, 21.1, 23.3, 25.8, 28.7, 32.0, 35.9, 40.4, 45.3, 50.2, 54.7, 58.2, 60.7, 62.5, 63.6],
      p50: [12.7, 14.4, 16.3, 18.5, 20.8, 23.2, 25.8, 28.7, 32.1, 36.1, 40.7, 45.8, 51.2, 56.5, 61.1, 64.7, 67.3, 69.2, 70.6],
      p75: [13.6, 15.6, 17.7, 20.3, 22.9, 25.8, 28.8, 32.4, 36.6, 41.4, 46.8, 52.7, 58.6, 64.2, 69.0, 72.8, 75.6, 77.6, 79.2],
      p90: [14.6, 16.7, 19.3, 22.2, 25.3, 28.7, 32.5, 36.9, 42.0, 47.7, 54.0, 60.4, 66.8, 72.8, 77.9, 82.1, 85.1, 87.1, 88.8],
      p95: [15.2, 17.5, 20.3, 23.5, 27.0, 30.9, 35.3, 40.4, 46.2, 52.6, 59.3, 66.1, 72.7, 78.8, 84.3, 88.8, 92.0, 94.1, 95.7],
      p97: [15.6, 18.0, 21.0, 24.5, 28.3, 32.5, 37.4, 43.1, 49.4, 56.3, 63.3, 70.3, 77.0, 83.2, 89.0, 93.8, 97.2, 99.2, 100.8]
    },
    female: {
      p3:  [10.0, 11.4, 12.8, 14.3, 16.0, 17.7, 19.5, 21.6, 24.0, 26.8, 30.0, 33.4, 36.7, 39.6, 41.8, 43.3, 44.2, 44.8, 45.0],
      p5:  [10.2, 11.7, 13.1, 14.7, 16.4, 18.2, 20.1, 22.3, 24.9, 27.8, 31.2, 34.6, 37.9, 40.8, 43.0, 44.4, 45.4, 46.0, 46.3],
      p10: [10.6, 12.1, 13.6, 15.3, 17.1, 19.1, 21.2, 23.5, 26.3, 29.5, 33.1, 36.6, 40.0, 42.8, 44.9, 46.3, 47.2, 48.0, 48.4],
      p25: [11.2, 12.9, 14.6, 16.5, 18.5, 20.7, 23.1, 25.9, 29.2, 32.9, 36.7, 40.6, 43.9, 46.7, 48.6, 50.0, 51.0, 51.8, 52.5],
      p50: [12.1, 13.9, 15.9, 18.0, 20.3, 22.9, 25.8, 29.1, 33.1, 37.4, 41.8, 46.0, 49.5, 52.1, 53.9, 55.2, 56.2, 57.4, 58.2],
      p75: [13.0, 15.2, 17.4, 20.0, 22.7, 25.7, 29.2, 33.3, 38.0, 43.2, 48.3, 53.0, 56.8, 59.4, 61.2, 62.3, 63.4, 64.8, 65.9],
      p90: [13.9, 16.5, 19.2, 22.1, 25.4, 29.0, 33.2, 38.2, 43.9, 49.9, 56.0, 61.3, 65.6, 68.5, 70.4, 71.6, 72.8, 74.2, 75.4],
      p95: [14.6, 17.4, 20.4, 23.8, 27.4, 31.5, 36.2, 41.8, 48.2, 55.0, 61.6, 67.6, 72.4, 75.8, 78.1, 79.5, 80.8, 82.0, 83.0],
      p97: [15.0, 18.0, 21.3, 24.9, 28.9, 33.4, 38.5, 44.6, 51.4, 58.7, 65.9, 72.4, 77.7, 81.6, 84.4, 86.2, 87.4, 88.4, 89.0]
    }
  },
  stature: {
    male: {
      p3:  [79.9, 88.4, 94.6, 100.3, 106.1, 111.9, 117.5, 122.4, 126.7, 130.8, 135.7, 141.7, 148.5, 154.6, 158.8, 161.3, 162.5, 163.1, 163.3],
      p5:  [80.7, 89.2, 95.6, 101.5, 107.3, 113.2, 118.8, 123.8, 128.2, 132.4, 137.3, 143.6, 150.5, 156.7, 160.8, 163.1, 164.2, 164.8, 165.0],
      p10: [82.0, 90.5, 97.1, 103.2, 109.2, 115.1, 120.8, 126.0, 130.5, 134.9, 139.9, 146.4, 153.6, 159.8, 163.7, 165.8, 166.9, 167.4, 167.7],
      p25: [84.1, 92.7, 99.7, 106.0, 112.2, 118.4, 124.3, 129.6, 134.4, 139.0, 144.3, 151.1, 158.7, 164.8, 168.5, 170.4, 171.3, 171.8, 172.0],
      p50: [86.5, 95.3, 102.5, 109.2, 115.7, 122.0, 128.1, 133.7, 138.8, 143.7, 149.3, 156.4, 164.1, 170.1, 173.6, 175.3, 176.2, 176.6, 176.8],
      p75: [88.8, 97.9, 105.4, 112.3, 119.1, 125.7, 132.1, 137.9, 143.3, 148.5, 154.4, 161.7, 169.5, 175.3, 178.6, 180.2, 181.0, 181.4, 181.7],
      p90: [90.9, 100.4, 108.0, 115.1, 122.1, 129.0, 135.7, 141.8, 147.4, 152.9, 159.0, 166.6, 174.2, 179.8, 182.9, 184.5, 185.3, 185.7, 186.0],
      p95: [92.2, 101.9, 109.5, 116.8, 123.9, 131.0, 137.8, 144.1, 149.9, 155.5, 161.9, 169.5, 177.0, 182.4, 185.5, 187.0, 187.8, 188.3, 188.5],
      p97: [93.0, 102.9, 110.5, 117.8, 125.1, 132.3, 139.3, 145.7, 151.5, 157.3, 163.7, 171.3, 178.8, 184.1, 187.1, 188.6, 189.5, 189.9, 190.2]
    },
    female: {
      p3:  [78.4, 86.9, 93.1, 99.4, 105.8, 111.9, 117.3, 121.9, 126.0, 130.7, 137.4, 144.2, 148.1, 149.7, 150.4, 150.7, 150.9, 151.0, 151.1],
      p5:  [79.3, 87.8, 94.0, 100.4, 106.9, 113.1, 118.5, 123.2, 127.5, 132.4, 139.2, 145.9, 149.7, 151.3, 151.9, 152.3, 152.5, 152.6, 152.7],
      p10: [80.5, 89.2, 95.6, 102.0, 108.6, 114.9, 120.5, 125.3, 129.8, 135.0, 142.0, 148.4, 152.1, 153.6, 154.3, 154.6, 154.8, 154.9, 155.0],
      p25: [82.6, 91.6, 98.1, 104.8, 111.6, 118.1, 123.9, 129.0, 133.7, 139.4, 146.5, 152.7, 156.0, 157.5, 158.2, 158.6, 158.8, 158.9, 159.0],
      p50: [85.0, 94.2, 101.0, 108.0, 115.0, 121.8, 127.8, 133.1, 138.2, 144.3, 151.5, 157.3, 160.5, 161.9, 162.6, 162.9, 163.1, 163.3, 163.3],
      p75: [87.3, 96.9, 104.0, 111.2, 118.6, 125.6, 131.9, 137.4, 142.8, 149.2, 156.4, 162.0, 164.9, 166.3, 166.9, 167.3, 167.5, 167.6, 167.7],
      p90: [89.4, 99.3, 106.8, 114.3, 121.9, 129.1, 135.6, 141.4, 147.0, 153.7, 160.8, 166.1, 168.9, 170.2, 170.9, 171.2, 171.4, 171.5, 171.6],
      p95: [90.7, 100.8, 108.4, 116.1, 123.9, 131.3, 137.9, 143.8, 149.6, 156.4, 163.5, 168.6, 171.3, 172.6, 173.2, 173.6, 173.8, 173.9, 174.0],
      p97: [91.5, 101.8, 109.5, 117.4, 125.3, 132.7, 139.4, 145.4, 151.3, 158.1, 165.2, 170.2, 172.9, 174.2, 174.8, 175.1, 175.3, 175.4, 175.5]
    }
  }
};

// ============================================================================
// LMS Parameters for Z-score calculation (used for precise percentile calculation)
// ============================================================================

const WHO_LMS = {
  weight: {
    male: {
      L: [0.3487, 0.2297, 0.197, 0.1738, 0.1553, 0.1395, 0.1257, 0.1134, 0.1021, 0.0917, 0.082, 0.073, 0.0644, 0.0563, 0.0487, 0.0413, 0.0343, 0.0275, 0.0211, 0.0148, 0.0087, 0.0029, -0.0028, -0.0083, -0.0137],
      M: [3.3464, 4.4709, 5.5675, 6.3762, 7.0023, 7.5105, 7.934, 8.297, 8.6151, 8.9014, 9.1649, 9.4122, 9.6479, 9.8749, 10.0953, 10.3108, 10.5228, 10.7319, 10.9385, 11.143, 11.3462, 11.5486, 11.7504, 11.9514, 12.1515],
      S: [0.14602, 0.13395, 0.12385, 0.11727, 0.11316, 0.1108, 0.10958, 0.10902, 0.10882, 0.10881, 0.10891, 0.10906, 0.10925, 0.10949, 0.10976, 0.11007, 0.11041, 0.11079, 0.11119, 0.11164, 0.11211, 0.11261, 0.11314, 0.11369, 0.11426]
    },
    female: {
      L: [0.3809, 0.1714, 0.0962, 0.0402, -0.005, -0.043, -0.0756, -0.1039, -0.1288, -0.1507, -0.17, -0.1872, -0.2024, -0.2158, -0.2278, -0.2384, -0.2478, -0.2562, -0.2637, -0.2703, -0.2762, -0.2815, -0.2862, -0.2903, -0.2941],
      M: [3.2322, 4.1873, 5.1282, 5.8458, 6.4237, 6.8985, 7.297, 7.6422, 7.9487, 8.2254, 8.48, 8.7192, 8.9481, 9.1699, 9.387, 9.6008, 9.8124, 10.0226, 10.2315, 10.4393, 10.6464, 10.8534, 11.0608, 11.2688, 11.4775],
      S: [0.14171, 0.13724, 0.13, 0.12619, 0.12402, 0.12274, 0.12204, 0.12178, 0.12181, 0.12199, 0.12223, 0.12247, 0.12268, 0.12283, 0.12294, 0.12299, 0.12303, 0.12306, 0.12309, 0.12315, 0.12323, 0.12335, 0.1235, 0.12369, 0.1239]
    }
  }
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
  const chartRef = useRef(null);

  const isWHO = chartType === "WHO";

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

  const removeEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Get chart data based on selected options
  const getChartData = () => {
    if (isWHO) {
      const data = WHO_DATA[activeChart][gender];
      return Array.from({ length: 25 }, (_, i) => ({
        age: i,
        p3: data.p3[i],
        p5: data.p5[i],
        p10: data.p10[i],
        p25: data.p25[i],
        p50: data.p50[i],
        p75: data.p75[i],
        p90: data.p90[i],
        p95: data.p95[i],
        p97: data.p97[i]
      }));
    } else {
      const measureKey = activeChart === 'length' ? 'stature' : activeChart;
      const data = CDC_DATA[measureKey]?.[gender];
      if (!data) return [];
      
      // CDC data is indexed 0-18 for ages 2-20
      return Array.from({ length: 19 }, (_, i) => ({
        age: i + 2, // Year (2-20)
        p3: data.p3[i],
        p5: data.p5[i],
        p10: data.p10[i],
        p25: data.p25[i],
        p50: data.p50[i],
        p75: data.p75[i],
        p90: data.p90[i],
        p95: data.p95[i],
        p97: data.p97[i]
      }));
    }
  };

  // Get patient data points for plotting
  const getPatientData = () => {
    const value = activeChart === 'length' ? 'length' : activeChart;
    return entries
      .filter(e => e[value])
      .map(e => ({
        age: isWHO ? e.ageInMonths : e.ageInMonths / 12,
        value: parseFloat(e[value]),
        date: e.date
      }))
      .sort((a, b) => a.age - b.age);
  };

  const chartLabels = {
    weight: { title: "Weight-for-Age", unit: "kg", yLabel: "Weight (kg)" },
    length: { title: isWHO ? "Length-for-Age" : "Stature-for-Age", unit: "cm", yLabel: isWHO ? "Length (cm)" : "Stature (cm)" },
    hc: { title: "Head Circumference-for-Age", unit: "cm", yLabel: "Head Circumference (cm)" }
  };

  // Calculate Z-score using LMS method
  const calculateZScore = (x, L, M, S) => {
    if (L === 0) {
      return Math.log(x / M) / S;
    }
    return (Math.pow(x / M, L) - 1) / (L * S);
  };

  // Convert Z-score to percentile
  const zToPercentile = (z) => {
    // Using approximation of normal CDF
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    
    return Math.round(50 * (1.0 + sign * y));
  };

  // Calculate interpretation for a measurement
  const calculateInterpretation = (ageInMonths, value, measureType) => {
    if (!value || isNaN(parseFloat(value))) return null;
    
    const val = parseFloat(value);
    
    // For WHO (0-24 months), use LMS if available
    if (chartType === "WHO" && measureType === "weight") {
      const lmsData = WHO_LMS.weight[gender];
      const ageIndex = Math.min(Math.max(Math.round(ageInMonths), 0), 24);
      
      const L = lmsData.L[ageIndex];
      const M = lmsData.M[ageIndex];
      const S = lmsData.S[ageIndex];
      
      const zScore = calculateZScore(val, L, M, S);
      const percentile = zToPercentile(zScore);
      
      let interpretation = "";
      let color = "";
      if (percentile < 3) {
        interpretation = "Below 3rd percentile - Evaluation needed";
        color = "text-red-600";
      } else if (percentile < 10) {
        interpretation = "Below 10th percentile - Monitor closely";
        color = "text-orange-500";
      } else if (percentile <= 90) {
        interpretation = "Normal range";
        color = "text-green-600";
      } else if (percentile <= 97) {
        interpretation = "Above 90th percentile - Monitor";
        color = "text-orange-500";
      } else {
        interpretation = "Above 97th percentile - Evaluation needed";
        color = "text-red-600";
      }
      
      return { zScore: zScore.toFixed(2), percentile, interpretation, color };
    }
    
    // Simplified percentile estimation for other cases
    const data = isWHO ? WHO_DATA[measureType]?.[gender] : CDC_DATA[measureType === 'length' ? 'stature' : measureType]?.[gender];
    if (!data) return null;
    
    const ageIndex = isWHO 
      ? Math.min(Math.max(Math.round(ageInMonths), 0), 24)
      : Math.min(Math.max(Math.round(ageInMonths / 12) - 2, 0), 18);
    
    // Estimate percentile based on where value falls between percentiles
    const p3 = data.p3[ageIndex];
    const p50 = data.p50[ageIndex];
    const p97 = data.p97[ageIndex];
    
    let percentile;
    if (val <= p3) percentile = 3;
    else if (val >= p97) percentile = 97;
    else if (val < p50) percentile = Math.round(3 + (val - p3) / (p50 - p3) * 47);
    else percentile = Math.round(50 + (val - p50) / (p97 - p50) * 47);
    
    let interpretation = "";
    let color = "";
    if (percentile < 3) {
      interpretation = "Below 3rd percentile";
      color = "text-red-600";
    } else if (percentile < 10) {
      interpretation = "Below 10th - Monitor";
      color = "text-orange-500";
    } else if (percentile <= 90) {
      interpretation = "Normal range";
      color = "text-green-600";
    } else if (percentile <= 97) {
      interpretation = "Above 90th - Monitor";
      color = "text-orange-500";
    } else {
      interpretation = "Above 97th percentile";
      color = "text-red-600";
    }
    
    return { percentile, interpretation, color };
  };

  const getEntryInterpretation = (entry) => {
    const results = {};
    if (entry.weight) {
      results.weight = calculateInterpretation(entry.ageInMonths, entry.weight, 'weight');
    }
    if (entry.length) {
      results.length = calculateInterpretation(entry.ageInMonths, entry.length, 'length');
    }
    if (entry.hc && isWHO) {
      results.hc = calculateInterpretation(entry.ageInMonths, entry.hc, 'hc');
    }
    return results;
  };

  // Save chart
  const saveChart = async () => {
    if (!chartRef.current) return;
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(chartRef.current, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = `growth-chart-${chartType}-${gender}-${activeChart}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const patientData = getPatientData();
  const chartData = getChartData();
  
  // Chart colors matching official WHO/CDC charts
  const percentileColors = {
    p3: '#C41E3A',   // Dark red
    p5: '#E6550D',   // Orange-red  
    p10: '#FD8D3C',  // Orange
    p25: '#FDAE6B',  // Light orange
    p50: '#31A354',  // Green (median)
    p75: '#FDAE6B',  // Light orange
    p90: '#FD8D3C',  // Orange
    p95: '#E6550D',  // Orange-red
    p97: '#C41E3A'   // Dark red
  };

  const formatAge = (entry) => {
    const val = parseFloat(entry.ageValue) || 0;
    return entry.ageUnit === 'years' ? `${val}y` : `${val}m`;
  };

  // Disable HC for CDC (not available)
  const isHCDisabled = !isWHO;

  return (
    <div className="space-y-4 p-4" data-testid="growth-chart-page">
      {/* Chart Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <HealthGrowthIcon className="h-5 w-5 text-teal-500" />
            {chartLabels[activeChart].title}
          </CardTitle>
          <CardDescription>
            {gender === 'male' ? 'Boys' : 'Girls'} • {chartType} {isWHO ? 'Standards' : 'Charts'} • {isWHO ? 'Birth to 24 months' : '2 to 20 years'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Standard Selection */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Growth Standard</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={chartType === "WHO" ? "default" : "outline"} 
                onClick={() => { setChartType("WHO"); if (activeChart === 'length') setActiveChart('length'); }}
                className="text-xs h-9"
                data-testid="who-btn"
              >
                WHO (0-24m)
              </Button>
              <Button 
                variant={chartType === "CDC" ? "default" : "outline"} 
                onClick={() => { setChartType("CDC"); if (activeChart === 'hc') setActiveChart('weight'); }}
                className="text-xs h-9"
                data-testid="cdc-btn"
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
                className="text-xs h-9"
                data-testid="male-btn"
              >
                Boys
              </Button>
              <Button 
                variant={gender === "female" ? "default" : "outline"} 
                onClick={() => setGender("female")} 
                className="text-xs h-9"
                data-testid="female-btn"
              >
                Girls
              </Button>
            </div>
          </div>
          
          {/* Measurement Type */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Measurement</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={activeChart === 'weight' ? "default" : "outline"}
                onClick={() => setActiveChart('weight')}
                className="text-xs h-9"
                data-testid="weight-btn"
              >
                Weight
              </Button>
              <Button
                variant={activeChart === 'length' ? "default" : "outline"}
                onClick={() => setActiveChart('length')}
                className="text-xs h-9"
                data-testid="length-btn"
              >
                {isWHO ? 'Length' : 'Stature'}
              </Button>
              <Button
                variant={activeChart === 'hc' ? "default" : "outline"}
                onClick={() => setActiveChart('hc')}
                className="text-xs h-9"
                disabled={isHCDisabled}
                data-testid="hc-btn"
              >
                Head Circ
              </Button>
            </div>
            {isHCDisabled && <p className="text-xs text-muted-foreground">Head circumference only available for WHO (0-24m)</p>}
          </div>
        </CardContent>
      </Card>

      {/* Growth Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">
              {chartLabels[activeChart].title} • {chartType} • {gender === 'male' ? 'Boys' : 'Girls'}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={saveChart} className="text-xs h-7 px-2">
              <Download className="h-3 w-3 mr-1" /> Save
            </Button>
          </div>
          <CardDescription className="text-xs">
            Source: {isWHO ? 'WHO Child Growth Standards (ftp.cdc.gov)' : 'CDC Growth Charts (cdc.gov/growthcharts)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            ref={chartRef} 
            className="rounded-lg p-3" 
            style={{ 
              backgroundColor: gender === 'male' ? '#e8f4fc' : '#fce8f4',
              minHeight: '380px',
              width: '100%'
            }}
          >
            <div style={{ width: '100%', height: '350px' }}>
              <LineChart 
                width={700} 
                height={340} 
                data={chartData} 
                margin={{ top: 15, right: 30, left: 10, bottom: 35 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis 
                  dataKey="age"
                  tick={{ fontSize: 10 }} 
                  tickCount={isWHO ? 9 : 10}
                  label={{ 
                    value: isWHO ? 'Age (months)' : 'Age (years)', 
                    position: 'bottom', 
                    fontSize: 11,
                    offset: 20
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  label={{ 
                    value: chartLabels[activeChart].yLabel, 
                    angle: -90, 
                    position: 'insideLeft', 
                    fontSize: 11,
                    offset: 10
                  }}
                />
                <Tooltip 
                  contentStyle={{ fontSize: 11, borderRadius: 8, backgroundColor: '#fff' }}
                  formatter={(value, name) => {
                    const labels = { p3: '3rd', p5: '5th', p10: '10th', p25: '25th', p50: '50th', p75: '75th', p90: '90th', p95: '95th', p97: '97th' };
                    return [value?.toFixed(1) + ' ' + chartLabels[activeChart].unit, labels[name] || name];
                  }}
                  labelFormatter={(label) => isWHO ? `${label} months` : `${label} years`}
                />
                
                {/* Percentile curves */}
                <Line dataKey="p97" stroke="#C41E3A" strokeWidth={1.5} dot={false} name="p97" />
                <Line dataKey="p90" stroke="#FD8D3C" strokeWidth={1.5} dot={false} name="p90" />
                <Line dataKey="p75" stroke="#FDAE6B" strokeWidth={1} dot={false} name="p75" strokeDasharray="4 2" />
                <Line dataKey="p50" stroke="#31A354" strokeWidth={2.5} dot={false} name="p50" />
                <Line dataKey="p25" stroke="#FDAE6B" strokeWidth={1} dot={false} name="p25" strokeDasharray="4 2" />
                <Line dataKey="p10" stroke="#FD8D3C" strokeWidth={1.5} dot={false} name="p10" />
                <Line dataKey="p3" stroke="#C41E3A" strokeWidth={1.5} dot={false} name="p3" />
              
                {/* Patient data points */}
                {patientData.map((point, idx) => (
                  <ReferenceDot
                    key={idx}
                    x={point.age}
                    y={point.value}
                    r={5}
                    fill="#000"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-2 mt-3 text-xs flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5" style={{backgroundColor: percentileColors.p97}}></span> 97th</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5" style={{backgroundColor: percentileColors.p90}}></span> 90th</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t border-dashed" style={{borderColor: percentileColors.p75}}></span> 75th</span>
              <span className="flex items-center gap-1 font-bold"><span className="w-3 h-1" style={{backgroundColor: percentileColors.p50}}></span> 50th</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t border-dashed" style={{borderColor: percentileColors.p25}}></span> 25th</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5" style={{backgroundColor: percentileColors.p10}}></span> 10th</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5" style={{backgroundColor: percentileColors.p3}}></span> 3rd</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black border border-white"></span> Patient</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement Form */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Plot Patient Measurement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Date *</Label>
              <Input 
                type="date" 
                value={newEntry.date} 
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} 
                className="h-9 text-sm" 
                data-testid="date-input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Age ({isWHO ? 'months' : 'years'}) *</Label>
              <Input 
                type="number" 
                min="0"
                max={isWHO ? "24" : "20"}
                step={isWHO ? "0.5" : "0.1"}
                placeholder={isWHO ? "0-24" : "2-20"} 
                value={newEntry.ageValue} 
                onChange={(e) => setNewEntry({...newEntry, ageValue: e.target.value})} 
                className="h-9 font-mono text-sm" 
                data-testid="age-input"
              />
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Measurements (enter at least one):</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Weight (kg)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="kg" 
                  value={newEntry.weight} 
                  onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})} 
                  className="h-9 font-mono text-sm" 
                  data-testid="weight-input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{isWHO ? 'Length' : 'Stature'} (cm)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  placeholder="cm" 
                  value={newEntry.length} 
                  onChange={(e) => setNewEntry({...newEntry, length: e.target.value})} 
                  className="h-9 font-mono text-sm" 
                  data-testid="length-input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Head Circ (cm)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  placeholder="cm" 
                  value={newEntry.hc} 
                  onChange={(e) => setNewEntry({...newEntry, hc: e.target.value})} 
                  className="h-9 font-mono text-sm" 
                  disabled={isHCDisabled}
                  data-testid="hc-input"
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={addEntry} 
            className="w-full" 
            size="sm"
            disabled={!newEntry.date || !newEntry.ageValue || (!newEntry.weight && !newEntry.length && !newEntry.hc)}
            data-testid="add-measurement-btn"
          >
            <Plus className="h-4 w-4 mr-1" /> Plot Measurement
          </Button>
        </CardContent>
      </Card>

      {/* Plotted Data */}
      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Plotted Measurements ({entries.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.map((entry) => {
              const interpretation = getEntryInterpretation(entry);
              return (
                <div key={entry.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span className="font-medium text-teal-600">{entry.date}</span>
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium">
                        {formatAge(entry)}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">
                        {entry.chartTypeUsed}
                      </span>
                    </div>
                    <button onClick={() => removeEntry(entry.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {entry.weight && interpretation.weight && (
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Weight: {entry.weight} kg</span>
                          <span className={`font-bold ${interpretation.weight.color}`}>
                            {interpretation.weight.percentile}th percentile
                            {interpretation.weight.zScore && ` (Z=${interpretation.weight.zScore})`}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${interpretation.weight.color}`}>{interpretation.weight.interpretation}</p>
                      </div>
                    )}
                    
                    {entry.length && interpretation.length && (
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{isWHO ? 'Length' : 'Stature'}: {entry.length} cm</span>
                          <span className={`font-bold ${interpretation.length.color}`}>
                            {interpretation.length.percentile}th percentile
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${interpretation.length.color}`}>{interpretation.length.interpretation}</p>
                      </div>
                    )}
                    
                    {entry.hc && interpretation.hc && (
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Head Circ: {entry.hc} cm</span>
                          <span className={`font-bold ${interpretation.hc.color}`}>
                            {interpretation.hc.percentile}th percentile
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${interpretation.hc.color}`}>{interpretation.hc.interpretation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Reference Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reference Information</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-foreground mb-1">WHO Standards (0-24 months)</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Based on breastfed infants</li>
                <li>Describes optimal growth</li>
                <li>Use for children 0-2 years</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">CDC Charts (2-20 years)</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>US reference population</li>
                <li>Describes typical growth</li>
                <li>Use for children 2+ years</li>
              </ul>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="font-medium text-foreground">Clinical Interpretation:</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li><span className="text-green-600">10th-90th percentile:</span> Normal range</li>
              <li><span className="text-orange-500">3rd-10th or 90th-97th:</span> Monitor growth trajectory</li>
              <li><span className="text-red-600">&lt;3rd or &gt;97th:</span> Requires clinical evaluation</li>
            </ul>
          </div>
          <div className="pt-2 border-t text-[10px]">
            <p>Data Sources: CDC/NCHS Growth Charts Data Files</p>
            <p>WHO: ftp.cdc.gov/pub/Health_Statistics/NCHS/growthcharts/</p>
            <p>CDC: www.cdc.gov/growthcharts/cdc-data-files.htm</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
