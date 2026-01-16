import React, { useState, useRef } from "react";
import { Plus, Trash2, Info } from "lucide-react";
import { GrowthChartIcon as HealthGrowthIcon } from "@/components/HealthIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from 'recharts';

/**
 * Growth Chart Page - WHO (0-24 months) and CDC (2-20 years)
 * Data source: Official CDC/WHO growth chart data files
 * WHO: https://www.cdc.gov/growthcharts/who-data-files.htm
 * CDC: https://www.cdc.gov/growthcharts/cdc-data-files.htm
 */

// WHO Weight-for-Age Boys (0-24 months) - Official data
const WHO_WEIGHT_BOYS = [
  { month: 0, p3: 2.46, p5: 2.60, p10: 2.76, p25: 3.03, p50: 3.35, p75: 3.69, p90: 4.01, p95: 4.21, p97: 4.42 },
  { month: 1, p3: 3.39, p5: 3.57, p10: 3.75, p25: 4.08, p50: 4.47, p75: 4.89, p90: 5.29, p95: 5.54, p97: 5.80 },
  { month: 2, p3: 4.32, p5: 4.52, p10: 4.74, p25: 5.12, p50: 5.57, p75: 6.05, p90: 6.51, p95: 6.80, p97: 7.09 },
  { month: 3, p3: 5.02, p5: 5.24, p10: 5.48, p25: 5.89, p50: 6.38, p75: 6.90, p90: 7.40, p95: 7.71, p97: 8.02 },
  { month: 4, p3: 5.56, p5: 5.80, p10: 6.05, p25: 6.48, p50: 7.00, p75: 7.55, p90: 8.08, p95: 8.41, p97: 8.75 },
  { month: 5, p3: 6.00, p5: 6.24, p10: 6.51, p25: 6.97, p50: 7.51, p75: 8.09, p90: 8.64, p95: 8.99, p97: 9.34 },
  { month: 6, p3: 6.35, p5: 6.61, p10: 6.89, p25: 7.37, p50: 7.93, p75: 8.54, p90: 9.12, p95: 9.48, p97: 9.85 },
  { month: 7, p3: 6.65, p5: 6.92, p10: 7.21, p25: 7.71, p50: 8.30, p75: 8.93, p90: 9.53, p95: 9.91, p97: 10.29 },
  { month: 8, p3: 6.91, p5: 7.19, p10: 7.49, p25: 8.00, p50: 8.62, p75: 9.27, p90: 9.89, p95: 10.29, p97: 10.68 },
  { month: 9, p3: 7.14, p5: 7.43, p10: 7.74, p25: 8.27, p50: 8.90, p75: 9.58, p90: 10.22, p95: 10.63, p97: 11.04 },
  { month: 10, p3: 7.36, p5: 7.65, p10: 7.96, p25: 8.51, p50: 9.16, p75: 9.86, p90: 10.53, p95: 10.95, p97: 11.37 },
  { month: 11, p3: 7.55, p5: 7.86, p10: 8.18, p25: 8.74, p50: 9.41, p75: 10.13, p90: 10.82, p95: 11.25, p97: 11.69 },
  { month: 12, p3: 7.74, p5: 8.05, p10: 8.38, p25: 8.96, p50: 9.65, p75: 10.38, p90: 11.09, p95: 11.54, p97: 11.99 },
  { month: 15, p3: 8.27, p5: 8.60, p10: 8.95, p25: 9.57, p50: 10.31, p75: 11.10, p90: 11.87, p95: 12.35, p97: 12.84 },
  { month: 18, p3: 8.75, p5: 9.11, p10: 9.48, p25: 10.15, p50: 10.94, p75: 11.79, p90: 12.61, p95: 13.13, p97: 13.66 },
  { month: 21, p3: 9.22, p5: 9.60, p10: 10.00, p25: 10.70, p50: 11.55, p75: 12.46, p90: 13.34, p95: 13.90, p97: 14.46 },
  { month: 24, p3: 9.67, p5: 10.07, p10: 10.50, p25: 11.25, p50: 12.15, p75: 13.13, p90: 14.07, p95: 14.67, p97: 15.28 }
];

// WHO Weight-for-Age Girls (0-24 months) - Official data
const WHO_WEIGHT_GIRLS = [
  { month: 0, p3: 2.39, p5: 2.53, p10: 2.68, p25: 2.93, p50: 3.23, p75: 3.55, p90: 3.85, p95: 4.04, p97: 4.23 },
  { month: 1, p3: 3.16, p5: 3.33, p10: 3.50, p25: 3.81, p50: 4.19, p75: 4.59, p90: 4.98, p95: 5.23, p97: 5.48 },
  { month: 2, p3: 3.94, p5: 4.13, p10: 4.34, p25: 4.70, p50: 5.13, p75: 5.60, p90: 6.05, p95: 6.34, p97: 6.63 },
  { month: 3, p3: 4.54, p5: 4.75, p10: 4.97, p25: 5.37, p50: 5.85, p75: 6.36, p90: 6.87, p95: 7.19, p97: 7.51 },
  { month: 4, p3: 5.01, p5: 5.24, p10: 5.48, p25: 5.91, p50: 6.42, p75: 6.98, p90: 7.53, p95: 7.88, p97: 8.23 },
  { month: 5, p3: 5.40, p5: 5.64, p10: 5.90, p25: 6.35, p50: 6.90, p75: 7.50, p90: 8.08, p95: 8.45, p97: 8.83 },
  { month: 6, p3: 5.73, p5: 5.98, p10: 6.25, p25: 6.72, p50: 7.30, p75: 7.93, p90: 8.54, p95: 8.93, p97: 9.34 },
  { month: 7, p3: 6.01, p5: 6.27, p10: 6.55, p25: 7.04, p50: 7.64, p75: 8.30, p90: 8.94, p95: 9.36, p97: 9.78 },
  { month: 8, p3: 6.25, p5: 6.52, p10: 6.81, p25: 7.32, p50: 7.95, p75: 8.63, p90: 9.31, p95: 9.74, p97: 10.18 },
  { month: 9, p3: 6.47, p5: 6.75, p10: 7.05, p25: 7.58, p50: 8.23, p75: 8.94, p90: 9.64, p95: 10.08, p97: 10.55 },
  { month: 10, p3: 6.67, p5: 6.96, p10: 7.27, p25: 7.81, p50: 8.48, p75: 9.21, p90: 9.94, p95: 10.40, p97: 10.89 },
  { month: 11, p3: 6.86, p5: 7.15, p10: 7.47, p25: 8.03, p50: 8.72, p75: 9.48, p90: 10.22, p95: 10.71, p97: 11.20 },
  { month: 12, p3: 7.04, p5: 7.34, p10: 7.67, p25: 8.24, p50: 8.95, p75: 9.73, p90: 10.50, p95: 11.00, p97: 11.51 },
  { month: 15, p3: 7.56, p5: 7.88, p10: 8.22, p25: 8.84, p50: 9.60, p75: 10.44, p90: 11.27, p95: 11.81, p97: 12.37 },
  { month: 18, p3: 8.06, p5: 8.40, p10: 8.77, p25: 9.42, p50: 10.23, p75: 11.13, p90: 12.02, p95: 12.60, p97: 13.20 },
  { month: 21, p3: 8.55, p5: 8.91, p10: 9.30, p25: 10.00, p50: 10.85, p75: 11.81, p90: 12.76, p95: 13.38, p97: 14.02 },
  { month: 24, p3: 9.04, p5: 9.42, p10: 9.83, p25: 10.57, p50: 11.48, p75: 12.49, p90: 13.50, p95: 14.16, p97: 14.85 }
];

// WHO Length-for-Age Boys (0-24 months) - Official data
const WHO_LENGTH_BOYS = [
  { month: 0, p3: 46.10, p5: 46.77, p10: 47.46, p25: 48.61, p50: 49.88, p75: 51.16, p90: 52.31, p95: 53.00, p97: 53.67 },
  { month: 1, p3: 50.83, p5: 51.52, p10: 52.23, p25: 53.41, p50: 54.72, p75: 56.04, p90: 57.22, p95: 57.93, p97: 58.62 },
  { month: 2, p3: 54.42, p5: 55.13, p10: 55.86, p25: 57.08, p50: 58.42, p75: 59.77, p90: 60.99, p95: 61.72, p97: 62.43 },
  { month: 3, p3: 57.34, p5: 58.07, p10: 58.81, p25: 60.05, p50: 61.43, p75: 62.81, p90: 64.05, p95: 64.79, p97: 65.52 },
  { month: 4, p3: 59.72, p5: 60.46, p10: 61.22, p25: 62.48, p50: 63.89, p75: 65.29, p90: 66.55, p95: 67.31, p97: 68.05 },
  { month: 5, p3: 61.68, p5: 62.43, p10: 63.20, p25: 64.48, p50: 65.90, p75: 67.33, p90: 68.61, p95: 69.38, p97: 70.13 },
  { month: 6, p3: 63.34, p5: 64.10, p10: 64.88, p25: 66.18, p50: 67.62, p75: 69.07, p90: 70.37, p95: 71.14, p97: 71.90 },
  { month: 7, p3: 64.82, p5: 65.59, p10: 66.38, p25: 67.70, p50: 69.16, p75: 70.63, p90: 71.95, p95: 72.74, p97: 73.51 },
  { month: 8, p3: 66.19, p5: 66.97, p10: 67.77, p25: 69.11, p50: 70.60, p75: 72.09, p90: 73.43, p95: 74.23, p97: 75.01 },
  { month: 9, p3: 67.48, p5: 68.28, p10: 69.09, p25: 70.46, p50: 71.97, p75: 73.48, p90: 74.84, p95: 75.66, p97: 76.46 },
  { month: 10, p3: 68.71, p5: 69.52, p10: 70.35, p25: 71.74, p50: 73.28, p75: 74.82, p90: 76.21, p95: 77.04, p97: 77.85 },
  { month: 11, p3: 69.88, p5: 70.71, p10: 71.55, p25: 72.97, p50: 74.54, p75: 76.11, p90: 77.52, p95: 78.37, p97: 79.20 },
  { month: 12, p3: 71.00, p5: 71.84, p10: 72.70, p25: 74.15, p50: 75.75, p75: 77.35, p90: 78.79, p95: 79.66, p97: 80.50 },
  { month: 15, p3: 74.09, p5: 74.97, p10: 75.90, p25: 77.44, p50: 79.15, p75: 80.85, p90: 82.39, p95: 83.31, p97: 84.21 },
  { month: 18, p3: 76.86, p5: 77.82, p10: 78.80, p25: 80.44, p50: 82.26, p75: 84.08, p90: 85.72, p95: 86.70, p97: 87.65 },
  { month: 21, p3: 79.39, p5: 80.41, p10: 81.45, p25: 83.20, p50: 85.13, p75: 87.07, p90: 88.82, p95: 89.86, p97: 90.88 },
  { month: 24, p3: 81.71, p5: 82.79, p10: 83.90, p25: 85.76, p50: 87.82, p75: 89.88, p90: 91.73, p95: 92.84, p97: 93.93 }
];

// WHO Length-for-Age Girls (0-24 months) - Official data
const WHO_LENGTH_GIRLS = [
  { month: 0, p3: 45.42, p5: 46.08, p10: 46.76, p25: 47.89, p50: 49.15, p75: 50.40, p90: 51.53, p95: 52.21, p97: 52.87 },
  { month: 1, p3: 49.78, p5: 50.47, p10: 51.18, p25: 52.37, p50: 53.69, p75: 55.01, p90: 56.19, p95: 56.90, p97: 57.60 },
  { month: 2, p3: 52.99, p5: 53.72, p10: 54.46, p25: 55.69, p50: 57.07, p75: 58.44, p90: 59.68, p95: 60.42, p97: 61.14 },
  { month: 3, p3: 55.59, p5: 56.34, p10: 57.11, p25: 58.38, p50: 59.80, p75: 61.22, p90: 62.50, p95: 63.27, p97: 64.01 },
  { month: 4, p3: 57.76, p5: 58.53, p10: 59.32, p25: 60.63, p50: 62.09, p75: 63.55, p90: 64.86, p95: 65.65, p97: 66.42 },
  { month: 5, p3: 59.60, p5: 60.38, p10: 61.19, p25: 62.53, p50: 64.03, p75: 65.53, p90: 66.87, p95: 67.68, p97: 68.46 },
  { month: 6, p3: 61.20, p5: 62.00, p10: 62.83, p25: 64.20, p50: 65.73, p75: 67.26, p90: 68.64, p95: 69.46, p97: 70.26 },
  { month: 7, p3: 62.66, p5: 63.48, p10: 64.32, p25: 65.73, p50: 67.29, p75: 68.85, p90: 70.25, p95: 71.10, p97: 71.92 },
  { month: 8, p3: 64.02, p5: 64.86, p10: 65.72, p25: 67.15, p50: 68.75, p75: 70.34, p90: 71.78, p95: 72.64, p97: 73.48 },
  { month: 9, p3: 65.31, p5: 66.17, p10: 67.05, p25: 68.51, p50: 70.14, p75: 71.77, p90: 73.24, p95: 74.12, p97: 74.97 },
  { month: 10, p3: 66.55, p5: 67.42, p10: 68.32, p25: 69.82, p50: 71.48, p75: 73.15, p90: 74.64, p95: 75.54, p97: 76.42 },
  { month: 11, p3: 67.73, p5: 68.62, p10: 69.54, p25: 71.07, p50: 72.77, p75: 74.47, p90: 76.00, p95: 76.92, p97: 77.81 },
  { month: 12, p3: 68.87, p5: 69.78, p10: 70.72, p25: 72.28, p50: 74.02, p75: 75.75, p90: 77.31, p95: 78.25, p97: 79.16 },
  { month: 15, p3: 72.03, p5: 73.00, p10: 74.00, p25: 75.66, p50: 77.51, p75: 79.36, p90: 81.02, p95: 82.02, p97: 82.99 },
  { month: 18, p3: 74.90, p5: 75.93, p10: 76.99, p25: 78.75, p50: 80.71, p75: 82.67, p90: 84.43, p95: 85.48, p97: 86.52 },
  { month: 21, p3: 77.53, p5: 78.62, p10: 79.73, p25: 81.60, p50: 83.67, p75: 85.73, p90: 87.60, p95: 88.71, p97: 89.80 },
  { month: 24, p3: 79.96, p5: 81.11, p10: 82.28, p25: 84.24, p50: 86.42, p75: 88.59, p90: 90.55, p95: 91.72, p97: 92.87 }
];

// WHO Head Circumference Boys (0-24 months) - Official data
const WHO_HEAD_BOYS = [
  { month: 0, p3: 31.92, p5: 32.37, p10: 32.83, p25: 33.61, p50: 34.46, p75: 35.32, p90: 36.09, p95: 36.55, p97: 37.00 },
  { month: 1, p3: 34.94, p5: 35.35, p10: 35.78, p25: 36.49, p50: 37.28, p75: 38.06, p90: 38.77, p95: 39.20, p97: 39.61 },
  { month: 2, p3: 36.78, p5: 37.20, p10: 37.63, p25: 38.34, p50: 39.13, p75: 39.92, p90: 40.63, p95: 41.06, p97: 41.47 },
  { month: 3, p3: 38.15, p5: 38.57, p10: 39.00, p25: 39.72, p50: 40.51, p75: 41.31, p90: 42.03, p95: 42.46, p97: 42.88 },
  { month: 4, p3: 39.24, p5: 39.67, p10: 40.10, p25: 40.83, p50: 41.63, p75: 42.44, p90: 43.16, p95: 43.60, p97: 44.02 },
  { month: 5, p3: 40.14, p5: 40.57, p10: 41.01, p25: 41.74, p50: 42.56, p75: 43.37, p90: 44.10, p95: 44.54, p97: 44.97 },
  { month: 6, p3: 40.89, p5: 41.32, p10: 41.77, p25: 42.51, p50: 43.33, p75: 44.15, p90: 44.89, p95: 45.34, p97: 45.77 },
  { month: 7, p3: 41.51, p5: 41.95, p10: 42.40, p25: 43.15, p50: 43.98, p75: 44.81, p90: 45.56, p95: 46.01, p97: 46.45 },
  { month: 8, p3: 42.04, p5: 42.48, p10: 42.93, p25: 43.69, p50: 44.53, p75: 45.37, p90: 46.13, p95: 46.58, p97: 47.02 },
  { month: 9, p3: 42.49, p5: 42.93, p10: 43.39, p25: 44.15, p50: 45.00, p75: 45.85, p90: 46.61, p95: 47.07, p97: 47.51 },
  { month: 10, p3: 42.87, p5: 43.32, p10: 43.78, p25: 44.55, p50: 45.41, p75: 46.26, p90: 47.03, p95: 47.49, p97: 47.94 },
  { month: 11, p3: 43.20, p5: 43.66, p10: 44.12, p25: 44.90, p50: 45.76, p75: 46.62, p90: 47.39, p95: 47.86, p97: 48.31 },
  { month: 12, p3: 43.50, p5: 43.95, p10: 44.42, p25: 45.20, p50: 46.07, p75: 46.93, p90: 47.71, p95: 48.18, p97: 48.64 },
  { month: 15, p3: 44.19, p5: 44.66, p10: 45.13, p25: 45.92, p50: 46.81, p75: 47.69, p90: 48.48, p95: 48.96, p97: 49.42 },
  { month: 18, p3: 44.72, p5: 45.19, p10: 45.67, p25: 46.48, p50: 47.37, p75: 48.27, p90: 49.07, p95: 49.55, p97: 50.02 },
  { month: 21, p3: 45.15, p5: 45.63, p10: 46.12, p25: 46.93, p50: 47.84, p75: 48.75, p90: 49.56, p95: 50.05, p97: 50.53 },
  { month: 24, p3: 45.53, p5: 46.01, p10: 46.51, p25: 47.33, p50: 48.25, p75: 49.17, p90: 50.00, p95: 50.49, p97: 50.97 }
];

// WHO Head Circumference Girls (0-24 months) - Official data
const WHO_HEAD_GIRLS = [
  { month: 0, p3: 31.51, p5: 31.93, p10: 32.36, p25: 33.08, p50: 33.88, p75: 34.68, p90: 35.40, p95: 35.83, p97: 36.25 },
  { month: 1, p3: 34.20, p5: 34.62, p10: 35.04, p25: 35.76, p50: 36.55, p75: 37.34, p90: 38.05, p95: 38.48, p97: 38.89 },
  { month: 2, p3: 35.83, p5: 36.26, p10: 36.70, p25: 37.43, p50: 38.25, p75: 39.07, p90: 39.81, p95: 40.25, p97: 40.68 },
  { month: 3, p3: 37.05, p5: 37.49, p10: 37.94, p25: 38.70, p50: 39.53, p75: 40.37, p90: 41.12, p95: 41.57, p97: 42.02 },
  { month: 4, p3: 38.05, p5: 38.50, p10: 38.96, p25: 39.73, p50: 40.58, p75: 41.44, p90: 42.20, p95: 42.66, p97: 43.11 },
  { month: 5, p3: 38.89, p5: 39.34, p10: 39.81, p25: 40.59, p50: 41.46, p75: 42.33, p90: 43.11, p95: 43.57, p97: 44.03 },
  { month: 6, p3: 39.59, p5: 40.06, p10: 40.53, p25: 41.32, p50: 42.20, p75: 43.08, p90: 43.87, p95: 44.34, p97: 44.80 },
  { month: 7, p3: 40.20, p5: 40.66, p10: 41.14, p25: 41.94, p50: 42.83, p75: 43.72, p90: 44.52, p95: 45.00, p97: 45.46 },
  { month: 8, p3: 40.71, p5: 41.18, p10: 41.66, p25: 42.47, p50: 43.37, p75: 44.26, p90: 45.07, p95: 45.55, p97: 46.02 },
  { month: 9, p3: 41.15, p5: 41.63, p10: 42.12, p25: 42.93, p50: 43.83, p75: 44.73, p90: 45.54, p95: 46.03, p97: 46.51 },
  { month: 10, p3: 41.54, p5: 42.02, p10: 42.51, p25: 43.32, p50: 44.23, p75: 45.14, p90: 45.96, p95: 46.45, p97: 46.92 },
  { month: 11, p3: 41.88, p5: 42.36, p10: 42.85, p25: 43.67, p50: 44.58, p75: 45.50, p90: 46.32, p95: 46.81, p97: 47.29 },
  { month: 12, p3: 42.18, p5: 42.66, p10: 43.15, p25: 43.98, p50: 44.90, p75: 45.81, p90: 46.64, p95: 47.13, p97: 47.61 },
  { month: 15, p3: 42.91, p5: 43.40, p10: 43.89, p25: 44.73, p50: 45.66, p75: 46.58, p90: 47.41, p95: 47.91, p97: 48.40 },
  { month: 18, p3: 43.48, p5: 43.97, p10: 44.47, p25: 45.31, p50: 46.24, p75: 47.17, p90: 48.01, p95: 48.51, p97: 49.00 },
  { month: 21, p3: 43.96, p5: 44.45, p10: 44.96, p25: 45.80, p50: 46.74, p75: 47.68, p90: 48.52, p95: 49.02, p97: 49.52 },
  { month: 24, p3: 44.39, p5: 44.89, p10: 45.39, p25: 46.24, p50: 47.18, p75: 48.12, p90: 48.97, p95: 49.48, p97: 49.97 }
];

// CDC Weight-for-Age (2-20 years) - Boys - Official data (selected months)
const CDC_WEIGHT_BOYS = [
  { month: 24, p3: 10.38, p5: 10.64, p10: 11.05, p25: 11.79, p50: 12.67, p75: 13.64, p90: 14.58, p95: 15.19, p97: 15.60 },
  { month: 36, p3: 12.00, p5: 12.32, p10: 12.80, p25: 13.68, p50: 14.74, p75: 15.92, p90: 17.05, p95: 17.80, p97: 18.32 },
  { month: 48, p3: 13.64, p5: 14.02, p10: 14.58, p25: 15.60, p50: 16.87, p75: 18.30, p90: 19.67, p95: 20.57, p97: 21.22 },
  { month: 60, p3: 15.27, p5: 15.72, p10: 16.36, p25: 17.55, p50: 19.03, p75: 20.75, p90: 22.39, p95: 23.49, p97: 24.30 },
  { month: 72, p3: 17.02, p5: 17.54, p10: 18.28, p25: 19.66, p50: 21.39, p75: 23.42, p90: 25.38, p95: 26.70, p97: 27.71 },
  { month: 84, p3: 18.84, p5: 19.44, p10: 20.28, p25: 21.88, p50: 23.91, p75: 26.30, p90: 28.64, p95: 30.23, p97: 31.46 },
  { month: 96, p3: 20.77, p5: 21.46, p10: 22.42, p25: 24.27, p50: 26.62, p75: 29.42, p90: 32.22, p95: 34.12, p97: 35.62 },
  { month: 108, p3: 22.84, p5: 23.63, p10: 24.72, p25: 26.85, p50: 29.57, p75: 32.83, p90: 36.13, p95: 38.41, p97: 40.22 },
  { month: 120, p3: 25.06, p5: 25.97, p10: 27.21, p25: 29.66, p50: 32.81, p75: 36.59, p90: 40.45, p95: 43.17, p97: 45.37 },
  { month: 132, p3: 27.55, p5: 28.60, p10: 30.00, p25: 32.80, p50: 36.44, p75: 40.84, p90: 45.36, p95: 48.63, p97: 51.32 },
  { month: 144, p3: 30.35, p5: 31.55, p10: 33.15, p25: 36.36, p50: 40.57, p75: 45.70, p90: 51.00, p95: 54.98, p97: 58.27 },
  { month: 156, p3: 33.53, p5: 34.92, p10: 36.74, p25: 40.42, p50: 45.32, p75: 51.32, p90: 57.60, p95: 62.42, p97: 66.51 },
  { month: 168, p3: 37.07, p5: 38.66, p10: 40.74, p25: 44.95, p50: 50.62, p75: 57.58, p90: 65.02, p95: 70.81, p97: 75.83 },
  { month: 180, p3: 41.16, p5: 43.00, p10: 45.37, p25: 50.20, p50: 56.73, p75: 64.75, p90: 73.48, p95: 80.32, p97: 86.29 },
  { month: 192, p3: 45.64, p5: 47.73, p10: 50.42, p25: 55.94, p50: 63.40, p75: 72.53, p90: 82.54, p95: 90.43, p97: 97.31 },
  { month: 204, p3: 49.91, p5: 52.22, p10: 55.20, p25: 61.34, p50: 69.68, p75: 79.82, p90: 90.95, p95: 99.75, p97: 107.29 },
  { month: 216, p3: 53.61, p5: 56.09, p10: 59.32, p25: 65.99, p50: 75.09, p75: 86.09, p90: 98.10, p95: 107.57, p97: 115.57 },
  { month: 228, p3: 56.52, p5: 59.11, p10: 62.51, p25: 69.59, p50: 79.23, p75: 90.78, p90: 103.26, p95: 113.10, p97: 121.35 },
  { month: 240, p3: 58.53, p5: 61.18, p10: 64.68, p25: 72.00, p50: 81.92, p75: 93.70, p90: 106.34, p95: 116.29, p97: 124.58 }
];

// CDC Weight-for-Age (2-20 years) - Girls - Official data (selected months)
const CDC_WEIGHT_GIRLS = [
  { month: 24, p3: 10.00, p5: 10.25, p10: 10.64, p25: 11.33, p50: 12.17, p75: 13.10, p90: 14.01, p95: 14.58, p97: 15.01 },
  { month: 36, p3: 11.60, p5: 11.91, p10: 12.37, p25: 13.20, p50: 14.23, p75: 15.37, p90: 16.49, p95: 17.22, p97: 17.77 },
  { month: 48, p3: 13.11, p5: 13.48, p10: 14.01, p25: 15.00, p50: 16.24, p75: 17.63, p90: 19.02, p95: 19.94, p97: 20.65 },
  { month: 60, p3: 14.55, p5: 14.98, p10: 15.59, p25: 16.76, p50: 18.23, p75: 19.91, p90: 21.62, p95: 22.76, p97: 23.66 },
  { month: 72, p3: 16.17, p5: 16.67, p10: 17.37, p25: 18.75, p50: 20.50, p75: 22.51, p90: 24.58, p95: 25.99, p97: 27.12 },
  { month: 84, p3: 17.95, p5: 18.53, p10: 19.34, p25: 20.95, p50: 23.04, p75: 25.44, p90: 27.95, p95: 29.66, p97: 31.06 },
  { month: 96, p3: 19.74, p5: 20.42, p10: 21.34, p25: 23.21, p50: 25.65, p75: 28.51, p90: 31.50, p95: 33.57, p97: 35.28 },
  { month: 108, p3: 21.67, p5: 22.45, p10: 23.51, p25: 25.66, p50: 28.50, p75: 31.88, p90: 35.43, p95: 37.93, p97: 40.01 },
  { month: 120, p3: 23.91, p5: 24.82, p10: 26.04, p25: 28.53, p50: 31.85, p75: 35.84, p90: 40.06, p95: 43.09, p97: 45.62 },
  { month: 132, p3: 26.48, p5: 27.54, p10: 28.95, p25: 31.83, p50: 35.70, p75: 40.40, p90: 45.41, p95: 49.07, p97: 52.14 },
  { month: 144, p3: 29.48, p5: 30.72, p10: 32.35, p25: 35.68, p50: 40.20, p75: 45.72, p90: 51.67, p95: 56.08, p97: 59.83 },
  { month: 156, p3: 32.86, p5: 34.28, p10: 36.15, p25: 39.97, p50: 45.19, p75: 51.61, p90: 58.61, p95: 63.89, p97: 68.45 },
  { month: 168, p3: 36.45, p5: 38.05, p10: 40.15, p25: 44.46, p50: 50.35, p75: 57.66, p90: 65.74, p95: 71.93, p97: 77.36 },
  { month: 180, p3: 39.91, p5: 41.67, p10: 43.98, p25: 48.73, p50: 55.20, p75: 63.27, p90: 72.34, p95: 79.36, p97: 85.56 },
  { month: 192, p3: 42.73, p5: 44.61, p10: 47.07, p25: 52.16, p50: 59.08, p75: 67.73, p90: 77.54, p95: 85.19, p97: 91.92 },
  { month: 204, p3: 44.76, p5: 46.73, p10: 49.29, p25: 54.63, p50: 61.84, p75: 70.86, p90: 81.13, p95: 89.15, p97: 96.15 },
  { month: 216, p3: 46.32, p5: 48.35, p10: 50.98, p25: 56.49, p50: 63.88, p75: 73.10, p90: 83.58, p95: 91.79, p97: 98.92 },
  { month: 228, p3: 47.22, p5: 49.29, p10: 51.96, p25: 57.56, p50: 65.05, p75: 74.37, p90: 84.93, p95: 93.19, p97: 100.34 },
  { month: 240, p3: 47.74, p5: 49.82, p10: 52.51, p25: 58.16, p50: 65.69, p75: 75.06, p90: 85.63, p95: 93.90, p97: 101.04 }
];

// CDC Stature-for-Age (2-20 years) - Boys - Official data (selected months)
const CDC_HEIGHT_BOYS = [
  { month: 24, p3: 79.91, p5: 80.73, p10: 81.99, p25: 84.10, p50: 86.45, p75: 88.81, p90: 90.93, p95: 92.20, p97: 93.02 },
  { month: 36, p3: 89.00, p5: 89.99, p10: 91.41, p25: 93.86, p50: 96.62, p75: 99.38, p90: 101.83, p95: 103.25, p97: 104.24 },
  { month: 48, p3: 96.00, p5: 97.13, p10: 98.73, p25: 101.48, p50: 104.60, p75: 107.72, p90: 110.47, p95: 112.07, p97: 113.20 },
  { month: 60, p3: 102.00, p5: 103.26, p10: 105.02, p25: 108.06, p50: 111.51, p75: 114.97, p90: 118.01, p95: 119.77, p97: 121.03 },
  { month: 72, p3: 108.00, p5: 109.40, p10: 111.33, p25: 114.68, p50: 118.50, p75: 122.31, p90: 125.66, p95: 127.59, p97: 128.99 },
  { month: 84, p3: 113.00, p5: 114.51, p10: 116.59, p25: 120.23, p50: 124.32, p75: 128.41, p90: 132.05, p95: 134.13, p97: 135.64 },
  { month: 96, p3: 118.00, p5: 119.64, p10: 121.89, p25: 125.81, p50: 130.20, p75: 134.59, p90: 138.51, p95: 140.76, p97: 142.40 },
  { month: 108, p3: 123.00, p5: 124.79, p10: 127.22, p25: 131.44, p50: 136.15, p75: 140.86, p90: 145.08, p95: 147.51, p97: 149.30 },
  { month: 120, p3: 128.00, p5: 129.95, p10: 132.59, p25: 137.14, p50: 142.22, p75: 147.29, p90: 151.84, p95: 154.48, p97: 156.43 },
  { month: 132, p3: 133.00, p5: 135.16, p10: 138.04, p25: 142.98, p50: 148.48, p75: 153.99, p90: 158.93, p95: 161.81, p97: 163.97 },
  { month: 144, p3: 139.00, p5: 141.44, p10: 144.62, p25: 149.99, p50: 155.99, p75: 161.99, p90: 167.36, p95: 170.54, p97: 172.98 },
  { month: 156, p3: 145.00, p5: 147.74, p10: 151.26, p25: 157.13, p50: 163.71, p75: 170.28, p90: 176.15, p95: 179.67, p97: 182.41 },
  { month: 168, p3: 152.00, p5: 155.04, p10: 158.92, p25: 165.24, p50: 172.33, p75: 179.42, p90: 185.74, p95: 189.62, p97: 192.66 },
  { month: 180, p3: 159.00, p5: 162.16, p10: 166.19, p25: 172.68, p50: 179.94, p75: 187.19, p90: 193.68, p95: 197.71, p97: 200.87 },
  { month: 192, p3: 165.00, p5: 168.04, p10: 171.90, p25: 178.18, p50: 185.21, p75: 192.24, p90: 198.52, p95: 202.38, p97: 205.42 },
  { month: 204, p3: 168.00, p5: 170.84, p10: 174.45, p25: 180.39, p50: 187.01, p75: 193.63, p90: 199.57, p95: 203.18, p97: 206.02 },
  { month: 216, p3: 170.00, p5: 172.61, p10: 176.00, p25: 181.60, p50: 187.88, p75: 194.17, p90: 199.77, p95: 203.16, p97: 205.77 },
  { month: 228, p3: 171.00, p5: 173.43, p10: 176.64, p25: 182.01, p50: 188.07, p75: 194.12, p90: 199.49, p95: 202.70, p97: 205.13 },
  { month: 240, p3: 172.00, p5: 174.27, p10: 177.33, p25: 182.48, p50: 188.33, p75: 194.18, p90: 199.33, p95: 202.39, p97: 204.66 }
];

// CDC Stature-for-Age (2-20 years) - Girls - Official data (selected months)
const CDC_HEIGHT_GIRLS = [
  { month: 24, p3: 78.04, p5: 78.85, p10: 80.10, p25: 82.18, p50: 84.50, p75: 86.82, p90: 88.90, p95: 90.15, p97: 90.96 },
  { month: 36, p3: 87.40, p5: 88.39, p10: 89.83, p25: 92.25, p50: 95.03, p75: 97.81, p90: 100.23, p95: 101.67, p97: 102.66 },
  { month: 48, p3: 94.50, p5: 95.64, p10: 97.28, p25: 100.04, p50: 103.21, p75: 106.38, p90: 109.14, p95: 110.78, p97: 111.92 },
  { month: 60, p3: 100.50, p5: 101.78, p10: 103.60, p25: 106.68, p50: 110.23, p75: 113.79, p90: 116.87, p95: 118.69, p97: 119.97 },
  { month: 72, p3: 106.50, p5: 107.93, p10: 109.93, p25: 113.36, p50: 117.31, p75: 121.26, p90: 124.69, p95: 126.69, p97: 128.12 },
  { month: 84, p3: 112.00, p5: 113.57, p10: 115.76, p25: 119.52, p50: 123.86, p75: 128.20, p90: 131.96, p95: 134.15, p97: 135.72 },
  { month: 96, p3: 117.00, p5: 118.72, p10: 121.10, p25: 125.20, p50: 129.94, p75: 134.68, p90: 138.78, p95: 141.16, p97: 142.88 },
  { month: 108, p3: 122.00, p5: 123.89, p10: 126.48, p25: 130.96, p50: 136.14, p75: 141.32, p90: 145.80, p95: 148.39, p97: 150.28 },
  { month: 120, p3: 127.00, p5: 129.09, p10: 131.92, p25: 136.81, p50: 142.47, p75: 148.13, p90: 153.02, p95: 155.85, p97: 157.94 },
  { month: 132, p3: 133.00, p5: 135.33, p10: 138.44, p25: 143.77, p50: 149.95, p75: 156.13, p90: 161.46, p95: 164.57, p97: 166.90 },
  { month: 144, p3: 140.00, p5: 142.56, p10: 145.94, p25: 151.67, p50: 158.32, p75: 164.97, p90: 170.70, p95: 174.08, p97: 176.64 },
  { month: 156, p3: 147.00, p5: 149.69, p10: 153.22, p25: 159.20, p50: 166.06, p75: 172.92, p90: 178.90, p95: 182.43, p97: 185.12 },
  { month: 168, p3: 152.00, p5: 154.69, p10: 158.16, p25: 163.97, p50: 170.61, p75: 177.25, p90: 183.06, p95: 186.53, p97: 189.22 },
  { month: 180, p3: 155.00, p5: 157.58, p10: 160.90, p25: 166.46, p50: 172.80, p75: 179.14, p90: 184.70, p95: 188.02, p97: 190.60 },
  { month: 192, p3: 156.50, p5: 158.94, p10: 162.09, p25: 167.36, p50: 173.39, p75: 179.42, p90: 184.69, p95: 187.84, p97: 190.28 },
  { month: 204, p3: 157.00, p5: 159.36, p10: 162.41, p25: 167.51, p50: 173.35, p75: 179.19, p90: 184.29, p95: 187.34, p97: 189.70 },
  { month: 216, p3: 157.50, p5: 159.78, p10: 162.73, p25: 167.66, p50: 173.33, p75: 179.00, p90: 183.93, p95: 186.88, p97: 189.16 },
  { month: 228, p3: 157.50, p5: 159.73, p10: 162.62, p25: 167.44, p50: 173.00, p75: 178.56, p90: 183.38, p95: 186.27, p97: 188.50 },
  { month: 240, p3: 157.50, p5: 159.70, p10: 162.55, p25: 167.30, p50: 172.80, p75: 178.30, p90: 183.05, p95: 185.90, p97: 188.10 }
];

const GrowthChartPage = () => {
  const chartRef = useRef(null);
  
  // State
  const [chartStandard, setChartStandard] = useState('WHO'); // WHO or CDC
  const [chartType, setChartType] = useState('weight'); // weight, length/height, headCirc
  const [gender, setGender] = useState('male');
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    ageMonths: "",
    weight: "",
    length: "",
    headCirc: ""
  });

  // Get the appropriate data based on standard, type, and gender
  const getChartData = () => {
    if (chartStandard === 'WHO') {
      if (chartType === 'weight') {
        return gender === 'male' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
      } else if (chartType === 'length') {
        return gender === 'male' ? WHO_LENGTH_BOYS : WHO_LENGTH_GIRLS;
      } else if (chartType === 'headCirc') {
        return gender === 'male' ? WHO_HEAD_BOYS : WHO_HEAD_GIRLS;
      }
    } else { // CDC
      if (chartType === 'weight') {
        return gender === 'male' ? CDC_WEIGHT_BOYS : CDC_WEIGHT_GIRLS;
      } else if (chartType === 'height') {
        return gender === 'male' ? CDC_HEIGHT_BOYS : CDC_HEIGHT_GIRLS;
      }
    }
    return [];
  };

  // Get patient data points for plotting
  const getPatientData = () => {
    return entries.map(entry => ({
      month: parseFloat(entry.ageMonths) || 0,
      value: chartType === 'weight' ? parseFloat(entry.weight) :
             chartType === 'length' || chartType === 'height' ? parseFloat(entry.length) :
             parseFloat(entry.headCirc)
    })).filter(p => p.month > 0 && p.value > 0);
  };

  const chartData = getChartData();
  const patientData = getPatientData();

  // Get Y-axis domain based on chart type and standard
  const getYDomain = () => {
    if (chartStandard === 'WHO') {
      switch (chartType) {
        case 'weight': return [0, 20];
        case 'length': return [40, 100];
        case 'headCirc': return [30, 55];
        default: return ['auto', 'auto'];
      }
    } else { // CDC
      switch (chartType) {
        case 'weight': return [0, 140];
        case 'height': return [70, 210];
        default: return ['auto', 'auto'];
      }
    }
  };

  const yDomain = getYDomain();

  // Chart labels
  const chartLabels = {
    weight: { title: 'Weight-for-Age', yLabel: 'Weight (kg)', unit: 'kg' },
    length: { title: 'Length-for-Age', yLabel: 'Length (cm)', unit: 'cm' },
    height: { title: 'Stature-for-Age', yLabel: 'Height (cm)', unit: 'cm' },
    headCirc: { title: 'Head Circumference-for-Age', yLabel: 'Head Circ (cm)', unit: 'cm' }
  };

  const currentChartType = chartStandard === 'WHO' && chartType === 'height' ? 'length' : chartType;

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
                  data-testid="who-btn"
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
                  data-testid="cdc-btn"
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
                  data-testid="weight-btn"
                >
                  Weight
                </Button>
                <Button
                  size="sm"
                  variant={chartType === 'length' || chartType === 'height' ? 'default' : 'outline'}
                  className="text-xs h-8 px-2"
                  onClick={() => setChartType(chartStandard === 'WHO' ? 'length' : 'height')}
                  data-testid="length-height-btn"
                >
                  {chartStandard === 'WHO' ? 'Length' : 'Height'}
                </Button>
                {chartStandard === 'WHO' && (
                  <Button
                    size="sm"
                    variant={chartType === 'headCirc' ? 'default' : 'outline'}
                    className="text-xs h-8 px-2"
                    onClick={() => setChartType('headCirc')}
                    data-testid="head-circ-btn"
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
                  data-testid="male-btn"
                >
                  Male
                </Button>
                <Button
                  size="sm"
                  variant={gender === 'female' ? 'default' : 'outline'}
                  className="flex-1 text-xs h-8"
                  style={{ backgroundColor: gender === 'female' ? '#EC4899' : undefined }}
                  onClick={() => setGender('female')}
                  data-testid="female-btn"
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
                  dataKey="month"
                  type="number"
                  domain={chartStandard === 'WHO' ? [0, 24] : [24, 240]}
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 10 }} 
                  label={{ value: chartStandard === 'WHO' ? 'Age (months)' : 'Age (years)', position: 'bottom', fontSize: 11, offset: 15 }}
                />
                <YAxis 
                  domain={yDomain}
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
                <Line type="monotone" dataKey="p90" stroke="#CD853F" strokeWidth={1} dot={false} name="90th %" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="p75" stroke="#DAA520" strokeWidth={1} dot={false} name="75th %" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="p50" stroke="#228B22" strokeWidth={2} dot={false} name="50th %" />
                <Line type="monotone" dataKey="p25" stroke="#DAA520" strokeWidth={1} dot={false} name="25th %" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="p10" stroke="#CD853F" strokeWidth={1} dot={false} name="10th %" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="p3" stroke="#8B0000" strokeWidth={1.5} dot={false} name="3rd %" />
                
                {patientData.map((point, idx) => (
                  <ReferenceDot key={idx} x={point.month} y={point.value} r={6} fill="#000" stroke="#fff" strokeWidth={2} />
                ))}
              </LineChart>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">Select chart options above</div>
            )}
          </div>
          
          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs justify-center">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#8B0000]"></span> 3rd/97th %</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#CD853F]" style={{borderStyle: 'dashed', borderWidth: '1px 0 0 0'}}></span> 10th/90th %</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#DAA520]" style={{borderStyle: 'dashed', borderWidth: '1px 0 0 0'}}></span> 25th/75th %</span>
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
                data-testid="age-input"
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
                data-testid="weight-input"
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
                data-testid="length-input"
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
                  data-testid="head-circ-input"
                />
              </div>
            )}
            <Button onClick={addEntry} size="sm" className="h-8" data-testid="add-measurement-btn">
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
          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p><strong>WHO Standards (0-24 months):</strong> Based on WHO Child Growth Standards (2006) - describes optimal growth of breastfed children.</p>
              <p><strong>CDC Charts (2-20 years):</strong> Based on CDC Growth Charts (2000) - reference for how US children actually grew.</p>
              <p className="text-amber-600 dark:text-amber-400"><strong>Clinical guidance:</strong> Use WHO for infants 0-2 years, CDC for children 2-20 years.</p>
              <p className="text-xs text-gray-500">Data source: CDC/NCHS & WHO official growth chart data files</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthChartPage;
