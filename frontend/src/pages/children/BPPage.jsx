/**
 * Blood Pressure Calculator Page
 * 
 * Uses Harriet Lane Handbook 23rd Edition BP data
 * - Age range: 1-17 years
 * - Height percentiles: 5th, 10th, 25th, 50th, 75th, 90th, 95th
 * - BP percentiles: 50th, 90th, 95th
 * - PALS formula for 5th percentile: 70 + 2×age
 * 
 * MAP Calculation: DBP + (SBP - DBP) / 3
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon, BloodPressureIcon } from "@/components/HealthIcons";

const BPPage = ({ onBack }) => {
  const [gender, setGender] = useState("boys");
  const [selectedAge, setSelectedAge] = useState("");
  const [heightPercentile, setHeightPercentile] = useState("50");
  const [patientSBP, setPatientSBP] = useState("");
  const [patientDBP, setPatientDBP] = useState("");

  // Calculate MAP: DBP + (SBP - DBP) / 3
  const calcMAP = (sbp, dbp) => Math.round(dbp + (sbp - dbp) / 3);

  // BP data from Harriet Lane Handbook 23rd Edition
  // Columns: Height percentiles (5th, 10th, 25th, 50th, 75th, 90th, 95th)
  // BP percentiles shown: 50th, 90th, 95th (5th calculated via PALS: 70 + 2×age)
  const bpData = {
    boys: {
      "5": [
        { age: "1", systolic: { p50: 80, p90: 94, p95: 98 }, diastolic: { p50: 34, p90: 49, p95: 54 } },
        { age: "2", systolic: { p50: 84, p90: 97, p95: 101 }, diastolic: { p50: 39, p90: 54, p95: 59 } },
        { age: "3", systolic: { p50: 86, p90: 100, p95: 104 }, diastolic: { p50: 44, p90: 59, p95: 63 } },
        { age: "4", systolic: { p50: 88, p90: 102, p95: 106 }, diastolic: { p50: 47, p90: 62, p95: 66 } },
        { age: "5", systolic: { p50: 90, p90: 104, p95: 108 }, diastolic: { p50: 50, p90: 65, p95: 69 } },
        { age: "6", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 53, p90: 68, p95: 72 } },
        { age: "7", systolic: { p50: 92, p90: 106, p95: 110 }, diastolic: { p50: 55, p90: 70, p95: 74 } },
        { age: "8", systolic: { p50: 94, p90: 107, p95: 111 }, diastolic: { p50: 56, p90: 71, p95: 75 } },
        { age: "9", systolic: { p50: 95, p90: 109, p95: 113 }, diastolic: { p50: 57, p90: 72, p95: 76 } },
        { age: "10", systolic: { p50: 97, p90: 111, p95: 115 }, diastolic: { p50: 58, p90: 73, p95: 77 } },
        { age: "11", systolic: { p50: 99, p90: 113, p95: 117 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "12", systolic: { p50: 101, p90: 115, p95: 119 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "13", systolic: { p50: 104, p90: 118, p95: 122 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "14", systolic: { p50: 106, p90: 120, p95: 124 }, diastolic: { p50: 60, p90: 75, p95: 80 } },
        { age: "15", systolic: { p50: 109, p90: 123, p95: 127 }, diastolic: { p50: 61, p90: 76, p95: 81 } },
        { age: "16", systolic: { p50: 111, p90: 125, p95: 129 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "17", systolic: { p50: 114, p90: 127, p95: 131 }, diastolic: { p50: 65, p90: 80, p95: 84 } },
      ],
      "10": [
        { age: "1", systolic: { p50: 81, p90: 95, p95: 99 }, diastolic: { p50: 35, p90: 50, p95: 54 } },
        { age: "2", systolic: { p50: 85, p90: 99, p95: 102 }, diastolic: { p50: 40, p90: 55, p95: 59 } },
        { age: "3", systolic: { p50: 87, p90: 101, p95: 105 }, diastolic: { p50: 45, p90: 60, p95: 64 } },
        { age: "4", systolic: { p50: 89, p90: 103, p95: 107 }, diastolic: { p50: 48, p90: 63, p95: 67 } },
        { age: "5", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 51, p90: 66, p95: 70 } },
        { age: "6", systolic: { p50: 92, p90: 106, p95: 110 }, diastolic: { p50: 54, p90: 68, p95: 72 } },
        { age: "7", systolic: { p50: 94, p90: 107, p95: 111 }, diastolic: { p50: 55, p90: 70, p95: 74 } },
        { age: "8", systolic: { p50: 95, p90: 109, p95: 112 }, diastolic: { p50: 57, p90: 71, p95: 76 } },
        { age: "9", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 77 } },
        { age: "10", systolic: { p50: 98, p90: 112, p95: 116 }, diastolic: { p50: 59, p90: 73, p95: 78 } },
        { age: "11", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "12", systolic: { p50: 102, p90: 116, p95: 120 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "13", systolic: { p50: 105, p90: 119, p95: 123 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "14", systolic: { p50: 107, p90: 121, p95: 125 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "15", systolic: { p50: 110, p90: 124, p95: 127 }, diastolic: { p50: 62, p90: 77, p95: 81 } },
        { age: "16", systolic: { p50: 112, p90: 126, p95: 130 }, diastolic: { p50: 64, p90: 78, p95: 83 } },
        { age: "17", systolic: { p50: 115, p90: 128, p95: 132 }, diastolic: { p50: 66, p90: 80, p95: 85 } },
      ],
      "25": [
        { age: "1", systolic: { p50: 83, p90: 97, p95: 101 }, diastolic: { p50: 36, p90: 51, p95: 55 } },
        { age: "2", systolic: { p50: 87, p90: 100, p95: 104 }, diastolic: { p50: 41, p90: 56, p95: 60 } },
        { age: "3", systolic: { p50: 89, p90: 103, p95: 107 }, diastolic: { p50: 46, p90: 61, p95: 65 } },
        { age: "4", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 49, p90: 64, p95: 68 } },
        { age: "5", systolic: { p50: 93, p90: 106, p95: 110 }, diastolic: { p50: 52, p90: 67, p95: 71 } },
        { age: "6", systolic: { p50: 94, p90: 108, p95: 112 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "7", systolic: { p50: 95, p90: 109, p95: 113 }, diastolic: { p50: 56, p90: 71, p95: 75 } },
        { age: "8", systolic: { p50: 97, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "9", systolic: { p50: 98, p90: 112, p95: 116 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "10", systolic: { p50: 100, p90: 114, p95: 117 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "11", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "12", systolic: { p50: 104, p90: 118, p95: 122 }, diastolic: { p50: 61, p90: 75, p95: 80 } },
        { age: "13", systolic: { p50: 106, p90: 120, p95: 124 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "14", systolic: { p50: 109, p90: 123, p95: 126 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "15", systolic: { p50: 112, p90: 125, p95: 129 }, diastolic: { p50: 63, p90: 77, p95: 82 } },
        { age: "16", systolic: { p50: 114, p90: 128, p95: 131 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "17", systolic: { p50: 116, p90: 130, p95: 134 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
      ],
      "50": [
        { age: "1", systolic: { p50: 85, p90: 99, p95: 103 }, diastolic: { p50: 37, p90: 52, p95: 56 } },
        { age: "2", systolic: { p50: 88, p90: 102, p95: 106 }, diastolic: { p50: 42, p90: 57, p95: 61 } },
        { age: "3", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 47, p90: 62, p95: 66 } },
        { age: "4", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 50, p90: 65, p95: 69 } },
        { age: "5", systolic: { p50: 95, p90: 108, p95: 112 }, diastolic: { p50: 53, p90: 68, p95: 72 } },
        { age: "6", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "7", systolic: { p50: 97, p90: 111, p95: 115 }, diastolic: { p50: 57, p90: 72, p95: 76 } },
        { age: "8", systolic: { p50: 99, p90: 112, p95: 116 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "9", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "10", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "11", systolic: { p50: 104, p90: 117, p95: 121 }, diastolic: { p50: 61, p90: 75, p95: 80 } },
        { age: "12", systolic: { p50: 106, p90: 119, p95: 123 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "13", systolic: { p50: 108, p90: 122, p95: 126 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "14", systolic: { p50: 111, p90: 125, p95: 128 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "15", systolic: { p50: 113, p90: 127, p95: 131 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "16", systolic: { p50: 116, p90: 129, p95: 133 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "17", systolic: { p50: 118, p90: 131, p95: 135 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
      ],
      "75": [
        { age: "1", systolic: { p50: 87, p90: 100, p95: 104 }, diastolic: { p50: 38, p90: 53, p95: 57 } },
        { age: "2", systolic: { p50: 90, p90: 104, p95: 108 }, diastolic: { p50: 43, p90: 58, p95: 62 } },
        { age: "3", systolic: { p50: 93, p90: 107, p95: 110 }, diastolic: { p50: 48, p90: 63, p95: 67 } },
        { age: "4", systolic: { p50: 95, p90: 109, p95: 112 }, diastolic: { p50: 51, p90: 66, p95: 70 } },
        { age: "5", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 54, p90: 69, p95: 73 } },
        { age: "6", systolic: { p50: 98, p90: 111, p95: 115 }, diastolic: { p50: 56, p90: 71, p95: 75 } },
        { age: "7", systolic: { p50: 99, p90: 113, p95: 116 }, diastolic: { p50: 58, p90: 73, p95: 77 } },
        { age: "8", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "9", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "10", systolic: { p50: 103, p90: 117, p95: 121 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "11", systolic: { p50: 105, p90: 119, p95: 123 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "12", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 62, p90: 77, p95: 81 } },
        { age: "13", systolic: { p50: 110, p90: 124, p95: 127 }, diastolic: { p50: 63, p90: 77, p95: 82 } },
        { age: "14", systolic: { p50: 113, p90: 126, p95: 130 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "15", systolic: { p50: 115, p90: 129, p95: 133 }, diastolic: { p50: 64, p90: 79, p95: 83 } },
        { age: "16", systolic: { p50: 118, p90: 131, p95: 135 }, diastolic: { p50: 66, p90: 81, p95: 85 } },
        { age: "17", systolic: { p50: 120, p90: 133, p95: 137 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
      ],
      "90": [
        { age: "1", systolic: { p50: 88, p90: 102, p95: 106 }, diastolic: { p50: 39, p90: 54, p95: 58 } },
        { age: "2", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 44, p90: 59, p95: 63 } },
        { age: "3", systolic: { p50: 94, p90: 108, p95: 112 }, diastolic: { p50: 49, p90: 64, p95: 68 } },
        { age: "4", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 52, p90: 67, p95: 71 } },
        { age: "5", systolic: { p50: 98, p90: 112, p95: 115 }, diastolic: { p50: 55, p90: 70, p95: 74 } },
        { age: "6", systolic: { p50: 99, p90: 113, p95: 117 }, diastolic: { p50: 57, p90: 72, p95: 76 } },
        { age: "7", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 59, p90: 74, p95: 78 } },
        { age: "8", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 75, p95: 79 } },
        { age: "9", systolic: { p50: 103, p90: 117, p95: 121 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "10", systolic: { p50: 105, p90: 119, p95: 122 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "11", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 62, p90: 77, p95: 81 } },
        { age: "12", systolic: { p50: 109, p90: 123, p95: 126 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "13", systolic: { p50: 111, p90: 125, p95: 129 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "14", systolic: { p50: 114, p90: 128, p95: 131 }, diastolic: { p50: 64, p90: 79, p95: 83 } },
        { age: "15", systolic: { p50: 117, p90: 130, p95: 134 }, diastolic: { p50: 65, p90: 80, p95: 84 } },
        { age: "16", systolic: { p50: 119, p90: 133, p95: 136 }, diastolic: { p50: 67, p90: 82, p95: 86 } },
        { age: "17", systolic: { p50: 121, p90: 135, p95: 139 }, diastolic: { p50: 70, p90: 84, p95: 88 } },
      ],
      "95": [
        { age: "1", systolic: { p50: 90, p90: 103, p95: 107 }, diastolic: { p50: 40, p90: 54, p95: 59 } },
        { age: "2", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 45, p90: 60, p95: 64 } },
        { age: "3", systolic: { p50: 95, p90: 109, p95: 113 }, diastolic: { p50: 50, p90: 65, p95: 69 } },
        { age: "4", systolic: { p50: 98, p90: 111, p95: 115 }, diastolic: { p50: 53, p90: 68, p95: 72 } },
        { age: "5", systolic: { p50: 99, p90: 113, p95: 117 }, diastolic: { p50: 56, p90: 70, p95: 75 } },
        { age: "6", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 58, p90: 73, p95: 77 } },
        { age: "7", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 60, p90: 74, p95: 79 } },
        { age: "8", systolic: { p50: 103, p90: 117, p95: 120 }, diastolic: { p50: 61, p90: 76, p95: 80 } },
        { age: "9", systolic: { p50: 105, p90: 118, p95: 122 }, diastolic: { p50: 62, p90: 76, p95: 81 } },
        { age: "10", systolic: { p50: 106, p90: 120, p95: 124 }, diastolic: { p50: 63, p90: 77, p95: 82 } },
        { age: "11", systolic: { p50: 108, p90: 122, p95: 125 }, diastolic: { p50: 63, p90: 78, p95: 82 } },
        { age: "12", systolic: { p50: 110, p90: 124, p95: 128 }, diastolic: { p50: 64, p90: 78, p95: 83 } },
        { age: "13", systolic: { p50: 113, p90: 126, p95: 130 }, diastolic: { p50: 64, p90: 79, p95: 83 } },
        { age: "14", systolic: { p50: 115, p90: 129, p95: 133 }, diastolic: { p50: 65, p90: 79, p95: 84 } },
        { age: "15", systolic: { p50: 118, p90: 132, p95: 135 }, diastolic: { p50: 66, p90: 80, p95: 85 } },
        { age: "16", systolic: { p50: 120, p90: 134, p95: 138 }, diastolic: { p50: 68, p90: 82, p95: 87 } },
        { age: "17", systolic: { p50: 122, p90: 136, p95: 140 }, diastolic: { p50: 70, p90: 85, p95: 89 } },
      ]
    },
    girls: {
      "5": [
        { age: "1", systolic: { p50: 83, p90: 97, p95: 100 }, diastolic: { p50: 38, p90: 52, p95: 56 } },
        { age: "2", systolic: { p50: 85, p90: 98, p95: 102 }, diastolic: { p50: 43, p90: 57, p95: 61 } },
        { age: "3", systolic: { p50: 86, p90: 100, p95: 104 }, diastolic: { p50: 47, p90: 61, p95: 65 } },
        { age: "4", systolic: { p50: 88, p90: 101, p95: 105 }, diastolic: { p50: 50, p90: 64, p95: 68 } },
        { age: "5", systolic: { p50: 89, p90: 103, p95: 107 }, diastolic: { p50: 52, p90: 66, p95: 70 } },
        { age: "6", systolic: { p50: 91, p90: 104, p95: 108 }, diastolic: { p50: 54, p90: 68, p95: 72 } },
        { age: "7", systolic: { p50: 93, p90: 106, p95: 110 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "8", systolic: { p50: 95, p90: 108, p95: 112 }, diastolic: { p50: 57, p90: 71, p95: 75 } },
        { age: "9", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "10", systolic: { p50: 98, p90: 112, p95: 116 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "11", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "12", systolic: { p50: 102, p90: 116, p95: 119 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "13", systolic: { p50: 104, p90: 117, p95: 121 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "14", systolic: { p50: 106, p90: 119, p95: 123 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "15", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "16", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "17", systolic: { p50: 108, p90: 122, p95: 125 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
      ],
      "10": [
        { age: "1", systolic: { p50: 84, p90: 97, p95: 101 }, diastolic: { p50: 39, p90: 53, p95: 57 } },
        { age: "2", systolic: { p50: 86, p90: 99, p95: 103 }, diastolic: { p50: 44, p90: 58, p95: 62 } },
        { age: "3", systolic: { p50: 87, p90: 101, p95: 105 }, diastolic: { p50: 48, p90: 62, p95: 66 } },
        { age: "4", systolic: { p50: 89, p90: 102, p95: 106 }, diastolic: { p50: 51, p90: 65, p95: 69 } },
        { age: "5", systolic: { p50: 90, p90: 104, p95: 108 }, diastolic: { p50: 53, p90: 67, p95: 71 } },
        { age: "6", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "7", systolic: { p50: 94, p90: 107, p95: 111 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "8", systolic: { p50: 96, p90: 109, p95: 113 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "9", systolic: { p50: 97, p90: 111, p95: 115 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "10", systolic: { p50: 99, p90: 113, p95: 117 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "11", systolic: { p50: 101, p90: 115, p95: 119 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "12", systolic: { p50: 103, p90: 117, p95: 120 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "13", systolic: { p50: 105, p90: 118, p95: 122 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "14", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "15", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "16", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "17", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
      ],
      "25": [
        { age: "1", systolic: { p50: 85, p90: 99, p95: 102 }, diastolic: { p50: 40, p90: 54, p95: 58 } },
        { age: "2", systolic: { p50: 87, p90: 101, p95: 104 }, diastolic: { p50: 45, p90: 59, p95: 63 } },
        { age: "3", systolic: { p50: 89, p90: 102, p95: 106 }, diastolic: { p50: 49, p90: 63, p95: 67 } },
        { age: "4", systolic: { p50: 90, p90: 104, p95: 108 }, diastolic: { p50: 52, p90: 66, p95: 70 } },
        { age: "5", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 54, p90: 68, p95: 72 } },
        { age: "6", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "7", systolic: { p50: 95, p90: 109, p95: 112 }, diastolic: { p50: 57, p90: 71, p95: 75 } },
        { age: "8", systolic: { p50: 97, p90: 110, p95: 114 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "9", systolic: { p50: 99, p90: 112, p95: 116 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "10", systolic: { p50: 100, p90: 114, p95: 118 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "11", systolic: { p50: 102, p90: 116, p95: 120 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "12", systolic: { p50: 104, p90: 118, p95: 122 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "13", systolic: { p50: 106, p90: 120, p95: 123 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "14", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "15", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "16", systolic: { p50: 110, p90: 123, p95: 127 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "17", systolic: { p50: 110, p90: 123, p95: 127 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
      ],
      "50": [
        { age: "1", systolic: { p50: 86, p90: 100, p95: 104 }, diastolic: { p50: 41, p90: 55, p95: 59 } },
        { age: "2", systolic: { p50: 88, p90: 102, p95: 106 }, diastolic: { p50: 46, p90: 60, p95: 64 } },
        { age: "3", systolic: { p50: 90, p90: 104, p95: 107 }, diastolic: { p50: 50, p90: 64, p95: 68 } },
        { age: "4", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 53, p90: 67, p95: 71 } },
        { age: "5", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "6", systolic: { p50: 95, p90: 108, p95: 112 }, diastolic: { p50: 57, p90: 71, p95: 75 } },
        { age: "7", systolic: { p50: 96, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "8", systolic: { p50: 98, p90: 112, p95: 115 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "9", systolic: { p50: 100, p90: 114, p95: 117 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "10", systolic: { p50: 102, p90: 116, p95: 119 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "11", systolic: { p50: 104, p90: 117, p95: 121 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "12", systolic: { p50: 106, p90: 119, p95: 123 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "13", systolic: { p50: 107, p90: 121, p95: 124 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "14", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "15", systolic: { p50: 110, p90: 123, p95: 127 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "16", systolic: { p50: 111, p90: 124, p95: 128 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "17", systolic: { p50: 111, p90: 125, p95: 128 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
      ],
      "75": [
        { age: "1", systolic: { p50: 88, p90: 101, p95: 105 }, diastolic: { p50: 42, p90: 56, p95: 60 } },
        { age: "2", systolic: { p50: 90, p90: 103, p95: 107 }, diastolic: { p50: 47, p90: 61, p95: 65 } },
        { age: "3", systolic: { p50: 91, p90: 105, p95: 109 }, diastolic: { p50: 51, p90: 65, p95: 69 } },
        { age: "4", systolic: { p50: 93, p90: 107, p95: 110 }, diastolic: { p50: 54, p90: 68, p95: 72 } },
        { age: "5", systolic: { p50: 95, p90: 108, p95: 112 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "6", systolic: { p50: 96, p90: 110, p95: 113 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "7", systolic: { p50: 98, p90: 111, p95: 115 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "8", systolic: { p50: 100, p90: 113, p95: 117 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "9", systolic: { p50: 101, p90: 115, p95: 118 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "10", systolic: { p50: 103, p90: 117, p95: 120 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "11", systolic: { p50: 105, p90: 118, p95: 122 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "12", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "13", systolic: { p50: 109, p90: 122, p95: 125 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "14", systolic: { p50: 110, p90: 124, p95: 127 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "15", systolic: { p50: 111, p90: 125, p95: 128 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
        { age: "16", systolic: { p50: 112, p90: 125, p95: 129 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
        { age: "17", systolic: { p50: 112, p90: 126, p95: 129 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
      ],
      "90": [
        { age: "1", systolic: { p50: 89, p90: 102, p95: 106 }, diastolic: { p50: 43, p90: 57, p95: 61 } },
        { age: "2", systolic: { p50: 91, p90: 104, p95: 108 }, diastolic: { p50: 48, p90: 62, p95: 66 } },
        { age: "3", systolic: { p50: 93, p90: 106, p95: 110 }, diastolic: { p50: 52, p90: 66, p95: 70 } },
        { age: "4", systolic: { p50: 94, p90: 108, p95: 111 }, diastolic: { p50: 55, p90: 69, p95: 73 } },
        { age: "5", systolic: { p50: 96, p90: 109, p95: 113 }, diastolic: { p50: 57, p90: 71, p95: 75 } },
        { age: "6", systolic: { p50: 97, p90: 111, p95: 114 }, diastolic: { p50: 59, p90: 73, p95: 77 } },
        { age: "7", systolic: { p50: 99, p90: 112, p95: 116 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "8", systolic: { p50: 101, p90: 114, p95: 118 }, diastolic: { p50: 62, p90: 76, p95: 80 } },
        { age: "9", systolic: { p50: 102, p90: 116, p95: 120 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "10", systolic: { p50: 104, p90: 118, p95: 121 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "11", systolic: { p50: 106, p90: 119, p95: 123 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "12", systolic: { p50: 108, p90: 121, p95: 125 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "13", systolic: { p50: 110, p90: 123, p95: 127 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "14", systolic: { p50: 111, p90: 125, p95: 128 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
        { age: "15", systolic: { p50: 112, p90: 126, p95: 129 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
        { age: "16", systolic: { p50: 113, p90: 126, p95: 130 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
        { age: "17", systolic: { p50: 113, p90: 127, p95: 130 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
      ],
      "95": [
        { age: "1", systolic: { p50: 90, p90: 103, p95: 107 }, diastolic: { p50: 44, p90: 58, p95: 62 } },
        { age: "2", systolic: { p50: 92, p90: 105, p95: 109 }, diastolic: { p50: 49, p90: 63, p95: 67 } },
        { age: "3", systolic: { p50: 93, p90: 107, p95: 111 }, diastolic: { p50: 53, p90: 67, p95: 71 } },
        { age: "4", systolic: { p50: 95, p90: 109, p95: 112 }, diastolic: { p50: 56, p90: 70, p95: 74 } },
        { age: "5", systolic: { p50: 97, p90: 110, p95: 114 }, diastolic: { p50: 58, p90: 72, p95: 76 } },
        { age: "6", systolic: { p50: 98, p90: 112, p95: 115 }, diastolic: { p50: 60, p90: 74, p95: 78 } },
        { age: "7", systolic: { p50: 100, p90: 113, p95: 117 }, diastolic: { p50: 61, p90: 75, p95: 79 } },
        { age: "8", systolic: { p50: 102, p90: 115, p95: 119 }, diastolic: { p50: 63, p90: 77, p95: 81 } },
        { age: "9", systolic: { p50: 103, p90: 117, p95: 121 }, diastolic: { p50: 64, p90: 78, p95: 82 } },
        { age: "10", systolic: { p50: 105, p90: 119, p95: 122 }, diastolic: { p50: 65, p90: 79, p95: 83 } },
        { age: "11", systolic: { p50: 107, p90: 120, p95: 124 }, diastolic: { p50: 66, p90: 80, p95: 84 } },
        { age: "12", systolic: { p50: 109, p90: 122, p95: 126 }, diastolic: { p50: 67, p90: 81, p95: 85 } },
        { age: "13", systolic: { p50: 110, p90: 124, p95: 128 }, diastolic: { p50: 68, p90: 82, p95: 86 } },
        { age: "14", systolic: { p50: 112, p90: 125, p95: 129 }, diastolic: { p50: 69, p90: 83, p95: 87 } },
        { age: "15", systolic: { p50: 113, p90: 127, p95: 130 }, diastolic: { p50: 70, p90: 84, p95: 88 } },
        { age: "16", systolic: { p50: 114, p90: 127, p95: 131 }, diastolic: { p50: 70, p90: 84, p95: 88 } },
        { age: "17", systolic: { p50: 114, p90: 127, p95: 131 }, diastolic: { p50: 70, p90: 84, p95: 88 } },
      ]
    }
  };

  const heightOptions = [
    { value: "5", label: "5th percentile" },
    { value: "10", label: "10th percentile" },
    { value: "25", label: "25th percentile" },
    { value: "50", label: "50th percentile" },
    { value: "75", label: "75th percentile" },
    { value: "90", label: "90th percentile" },
    { value: "95", label: "95th percentile" }
  ];

  const selectedData = selectedAge ? bpData[gender][heightPercentile]?.find(d => d.age === selectedAge) : null;

  // Classify patient BP using PALS for hypotension
  const classifyBP = () => {
    if (!patientSBP || !patientDBP || !selectedData || !selectedAge) return null;
    const sbp = parseInt(patientSBP);
    const dbp = parseInt(patientDBP);
    const hypotensionSBP = 70 + 2 * parseInt(selectedAge); // PALS formula
    
    if (sbp < hypotensionSBP) {
      return { class: "Hypotension", color: "blue", severity: 0 };
    } else if (sbp < selectedData.systolic.p90 && dbp < selectedData.diastolic.p90) {
      return { class: "Normal", color: "green", severity: 1 };
    } else if (sbp < selectedData.systolic.p95 && dbp < selectedData.diastolic.p95) {
      return { class: "Elevated BP", color: "amber", severity: 2 };
    } else if (sbp >= selectedData.systolic.p95 + 12 || dbp >= selectedData.diastolic.p95 + 12) {
      return { class: "HTN Stage 2", color: "red", severity: 4 };
    } else {
      return { class: "HTN Stage 1", color: "orange", severity: 3 };
    }
  };

  const patientClassification = classifyBP();
  const patientMAP = patientSBP && patientDBP ? calcMAP(parseInt(patientSBP), parseInt(patientDBP)) : null;

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Input Card */}
      <Card className="nightingale-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Blood Pressure by Age & Height</CardTitle>
          <CardDescription>Harriet Lane Handbook 23rd Edition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gender Selection */}
          <div className="flex gap-2">
            <Button variant={gender === "boys" ? "default" : "outline"} onClick={() => setGender("boys")} className="flex-1">Boys</Button>
            <Button variant={gender === "girls" ? "default" : "outline"} onClick={() => setGender("girls")} className="flex-1">Girls</Button>
          </div>

          {/* Age Selection */}
          <div className="space-y-2">
            <Label>Age (years)</Label>
            <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3">
              <option value="">Select age...</option>
              {bpData[gender]["50"].map((d) => (<option key={d.age} value={d.age}>{d.age} year{d.age !== "1" ? "s" : ""}</option>))}
            </select>
          </div>

          {/* Height Percentile */}
          <div className="space-y-2">
            <Label>Height Percentile</Label>
            <select value={heightPercentile} onChange={(e) => setHeightPercentile(e.target.value)} className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3">
              {heightOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </div>

          {/* Patient BP Input */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Patient SBP (mmHg)</Label>
              <Input type="text"
                  inputMode="decimal" placeholder="Systolic" value={patientSBP} onChange={(e) => setPatientSBP(e.target.value)} className="h-10 nightingale-input" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Patient DBP (mmHg)</Label>
              <Input type="text"
                  inputMode="decimal" placeholder="Diastolic" value={patientDBP} onChange={(e) => setPatientDBP(e.target.value)} className="h-10 nightingale-input" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Classification */}
      {patientClassification && (
        <Card className={`border-${patientClassification.color}-200 bg-${patientClassification.color}-50 dark:bg-${patientClassification.color}-950/30`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm font-bold text-${patientClassification.color}-700 dark:text-${patientClassification.color}-300`}>
                Patient: {patientClassification.class}
              </p>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">MAP</p>
                <p className={`text-xl font-mono font-bold text-${patientClassification.color}-600`}>{patientMAP}</p>
              </div>
            </div>
            <p className="text-sm font-mono">{patientSBP}/{patientDBP} mmHg</p>
          </CardContent>
        </Card>
      )}

      {/* Results by BP Percentile */}
      {selectedData && (
        <div className="space-y-3">
          {/* Full BP Table with MAP */}
          <Card className="nightingale-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">BP Percentiles for {gender === "boys" ? "Boy" : "Girl"}, {selectedAge} y/o, Height {heightPercentile}th %ile</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-2 py-2 text-left font-medium">BP %ile</th>
                      <th className="px-2 py-2 text-center font-medium">SBP</th>
                      <th className="px-2 py-2 text-center font-medium">DBP</th>
                      <th className="px-2 py-2 text-center font-medium text-purple-600">MAP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[
                      { key: "p50", label: "50th", color: "text-green-600 font-bold" },
                      { key: "p90", label: "90th", color: "text-amber-600" },
                      { key: "p95", label: "95th", color: "text-orange-600" },
                    ].map((row) => (
                      <tr key={row.key} className={row.key === "p50" ? "bg-green-50/50 dark:bg-green-950/20" : ""}>
                        <td className={`px-2 py-2 ${row.color}`}>{row.label}</td>
                        <td className="px-2 py-2 text-center font-mono">{selectedData.systolic[row.key]}</td>
                        <td className="px-2 py-2 text-center font-mono">{selectedData.diastolic[row.key]}</td>
                        <td className="px-2 py-2 text-center font-mono text-purple-600 font-semibold">
                          {calcMAP(selectedData.systolic[row.key], selectedData.diastolic[row.key])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Hypotension (5th - PALS)</p>
                <p className="text-lg font-mono font-bold text-blue-600">&lt;{70 + 2 * parseInt(selectedAge || 1)}</p>
                <p className="text-xs text-muted-foreground">SBP = 70 + 2×age</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-green-700 dark:text-green-300 mb-1">Normal (50th)</p>
                <p className="text-lg font-mono font-bold text-green-600">{selectedData.systolic.p50}/{selectedData.diastolic.p50}</p>
                <p className="text-xs text-muted-foreground">MAP: {calcMAP(selectedData.systolic.p50, selectedData.diastolic.p50)}</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-amber-700 dark:text-amber-300 mb-1">Elevated (90th)</p>
                <p className="text-lg font-mono font-bold text-amber-600">{selectedData.systolic.p90}/{selectedData.diastolic.p90}</p>
                <p className="text-xs text-muted-foreground">MAP: {calcMAP(selectedData.systolic.p90, selectedData.diastolic.p90)}</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">HTN Stage 1 (95th)</p>
                <p className="text-lg font-mono font-bold text-orange-600">{selectedData.systolic.p95}/{selectedData.diastolic.p95}</p>
                <p className="text-xs text-muted-foreground">MAP: {calcMAP(selectedData.systolic.p95, selectedData.diastolic.p95)}</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-xs text-red-700 dark:text-red-300 mb-1">HTN Stage 2</p>
                <p className="text-lg font-mono font-bold text-red-600">≥{selectedData.systolic.p95 + 12}/≥{selectedData.diastolic.p95 + 12}</p>
                <p className="text-xs text-muted-foreground">MAP: ≥{calcMAP(selectedData.systolic.p95 + 12, selectedData.diastolic.p95 + 12)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Reference */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Classification Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Source: Harriet Lane Handbook 23rd Edition (2023)</p>
          
          {/* PALS SBP Calculation */}
          {selectedAge && (
            <div className="mt-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
              <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">PALS SBP Thresholds (Age: {selectedAge} years)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-muted-foreground">5th Centile (Hypotension)</p>
                  <p className="text-lg font-bold text-purple-600">{70 + 2 * parseInt(selectedAge)} mmHg</p>
                  <p className="text-xs font-mono text-muted-foreground">70 + 2 × {selectedAge}</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-muted-foreground">50th Centile (Median)</p>
                  <p className="text-lg font-bold text-purple-600">{90 + 2 * parseInt(selectedAge)} mmHg</p>
                  <p className="text-xs font-mono text-muted-foreground">90 + 2 × {selectedAge}</p>
                </div>
              </div>
              <p className="text-xs mt-2 italic">Source: PALS (Pediatric Advanced Life Support)</p>
            </div>
          )}
          
          <div className="mt-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Hypotension (&lt;5th percentile)</p>
            <p className="text-blue-600">SBP &lt;{selectedAge ? (70 + 2 * parseInt(selectedAge)) : "5th %ile"} mmHg (PALS) or per Harriet Lane table</p>
            <p className="mt-1 text-xs">Consider: Volume status, cardiac function, sepsis screening</p>
          </div>
          <p className="pt-2">• <span className="text-green-600 font-medium">Normal:</span> &lt;90th percentile for age, sex, height</p>
          <p>• <span className="text-amber-600 font-medium">Elevated BP:</span> ≥90th to &lt;95th percentile OR 120/80 to &lt;95th (whichever is lower)</p>
          <p>• <span className="text-orange-600 font-medium">HTN Stage 1:</span> ≥95th to &lt;95th + 12 mmHg OR 130/80 to 139/89 (age ≥13y)</p>
          <p>• <span className="text-red-600 font-medium">HTN Stage 2:</span> ≥95th + 12 mmHg OR ≥140/90 (age ≥13y)</p>
          <p className="pt-2 font-medium">MAP = DBP + (SBP - DBP) / 3</p>
          <p className="text-xs italic mt-2">Note: Confirm elevated readings on ≥3 separate occasions before diagnosis</p>
        </CardContent>
      </Card>
    </div>
  );
};


export default BPPage;
