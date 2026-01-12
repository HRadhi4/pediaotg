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
