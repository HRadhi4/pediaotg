/**
 * CPR Page - PALS Algorithms & Drug Dosing
 * 
 * Includes:
 * - Cardiac Arrest Algorithm (VF/pVT, Asystole/PEA)
 * - Bradycardia & Tachycardia Algorithms
 * - Drug Dosing Calculator with weight input
 * 
 * Drugs: Epinephrine, Amiodarone, Adenosine, Atropine, Calcium, Glucose, etc.
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon, HeartIcon } from "@/components/HealthIcons";
import { AlertTriangle, ChevronDown } from "lucide-react";

const CPRPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("arrest");
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  // Scroll to top when page loads - target the scrollable container
  useEffect(() => {
    const scrollContainer = document.querySelector('.native-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, []);

  // Drug calculations based on weight (PALS 2025)
  const calculateDrugs = () => {
    if (!w) return null;
    return {
      epinephrine: {
        dose: (w * 0.01).toFixed(3),
        volume1to10000: (w * 0.1).toFixed(2),
        ettDose: (w * 0.1).toFixed(2),
      },
      amiodarone: {
        dose: (w * 5).toFixed(1),
      },
      adenosine: {
        firstDose: Math.min(w * 0.1, 6).toFixed(2),
        secondDose: Math.min(w * 0.2, 12).toFixed(2),
      },
      atropine: {
        dose: Math.max(Math.min(w * 0.02, 0.5), 0.1).toFixed(2),
      },
      defibrillation: {
        first: (w * 2).toFixed(0),
        subsequent: (w * 4).toFixed(0),
      },
      cardioversion: {
        first: (w * 0.5).toFixed(1),
        second: (w * 1).toFixed(0),
      },
      lidocaine: {
        bolus: (w * 1).toFixed(1),
      },
    };
  };

  const drugs = calculateDrugs();

  // Calculated value styling - red color for visibility
  const calcValue = "font-mono font-bold text-red-600 dark:text-red-400";

  // Collapsible Section Component
  const Section = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium text-sm">{title}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="p-4 bg-white dark:bg-gray-900 text-sm">{children}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-4 pt-4 pb-8">
      {/* Header Card - Weight Input */}
      <Card className="nightingale-card border-red-200 dark:border-red-800/50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <HeartIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Patient Weight (kg)</Label>
              <Input
                type="text"
                  inputMode="text"
                placeholder="Enter weight for drug calculations"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                className="font-mono mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 text-xs bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="arrest" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Arrest</TabsTrigger>
          <TabsTrigger value="tachy" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Tachy</TabsTrigger>
          <TabsTrigger value="brady" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Brady</TabsTrigger>
          <TabsTrigger value="drugs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Drugs</TabsTrigger>
        </TabsList>

        {/* ==================== CARDIAC ARREST TAB ==================== */}
        <TabsContent value="arrest" className="space-y-3 mt-4">
          {/* CPR Basics */}
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Cardiac Arrest - PALS 2025
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Start CPR Box */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-red-400">
                <p className="font-semibold text-sm mb-2">1. Start High-Quality CPR</p>
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p>• Rate: <span className={calcValue}>100-120/min</span></p>
                    <p>• Depth: <span className={calcValue}>⅓ AP diameter</span></p>
                  </div>
                  <div>
                    <p>• C:V ratio: <span className={calcValue}>15:2</span> (2 rescuers)</p>
                    <p>• CPR fraction: <span className={calcValue}>&gt;60%</span></p>
                  </div>
                </div>
              </div>

              {/* Rhythm Check */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-400">
                <p className="font-semibold text-sm mb-3">2. Check Rhythm - Shockable?</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Shockable */}
                  <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                    <p className="font-semibold text-xs mb-2 text-center border-b pb-2">VF / pVT</p>
                    <ol className="space-y-1.5 text-xs text-muted-foreground">
                      <li><span className="font-medium text-foreground">→ Shock</span> {drugs ? <span className={calcValue}>{drugs.defibrillation.first}J</span> : <span className="text-muted-foreground">2 J/kg</span>}</li>
                      <li>→ CPR 2 min</li>
                      <li><span className="font-medium text-foreground">→ Shock</span> {drugs ? <span className={calcValue}>{drugs.defibrillation.subsequent}J</span> : <span className="text-muted-foreground">4 J/kg</span>}</li>
                      <li>→ CPR + Epinephrine</li>
                      <li>→ Shock + Amiodarone</li>
                    </ol>
                  </div>
                  {/* Non-Shockable */}
                  <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                    <p className="font-semibold text-xs mb-2 text-center border-b pb-2">Asystole / PEA</p>
                    <ol className="space-y-1.5 text-xs text-muted-foreground">
                      <li>→ CPR 2 min</li>
                      <li><span className="font-medium text-foreground">→ Epinephrine ASAP</span></li>
                      <li>→ CPR 2 min</li>
                      <li>→ Check rhythm</li>
                      <li>→ Epi q3-5 min</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Drug Doses Quick Reference */}
              {drugs && (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-400">
                  <p className="font-semibold text-sm mb-2">Quick Drug Doses ({w}kg)</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Epinephrine:</span>
                      <span className={`${calcValue} ml-1`}>{drugs.epinephrine.dose}mg</span>
                      <span className="text-muted-foreground text-[10px] ml-1">({drugs.epinephrine.volume1to10000}mL)</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Amiodarone:</span>
                      <span className={`${calcValue} ml-1`}>{drugs.amiodarone.dose}mg</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Defib 1st:</span>
                      <span className={`${calcValue} ml-1`}>{drugs.defibrillation.first}J</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Defib 2nd+:</span>
                      <span className={`${calcValue} ml-1`}>{drugs.defibrillation.subsequent}J</span>
                    </div>
                  </div>
                </div>
              )}

              {/* H's and T's - Collapsible */}
              <Section title="Reversible Causes (H's & T's)">
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-1">H&apos;s</p>
                    <ul className="space-y-0.5">
                      <li>• Hypoxia</li>
                      <li>• Hypovolemia</li>
                      <li>• H+ (Acidosis)</li>
                      <li>• Hypo/Hyperkalemia</li>
                      <li>• Hypothermia</li>
                      <li>• Hypoglycemia</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">T&apos;s</p>
                    <ul className="space-y-0.5">
                      <li>• Tension pneumothorax</li>
                      <li>• Tamponade (cardiac)</li>
                      <li>• Toxins</li>
                      <li>• Thrombosis (PE)</li>
                      <li>• Thrombosis (coronary)</li>
                    </ul>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TACHYCARDIA TAB ==================== */}
        <TabsContent value="tachy" className="space-y-3 mt-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Tachycardia with Pulse
              </CardTitle>
              <CardDescription className="text-xs">HR &gt;220 (infant) or &gt;180 (child)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Assessment */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-amber-400">
                <p className="font-semibold text-sm mb-2">Initial Assessment</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Support ABCs, give O₂, IV/IO access</li>
                  <li>• 12-lead ECG → QRS narrow (&lt;0.09s) or wide (≥0.09s)?</li>
                  <li>• Signs of hemodynamic instability?</li>
                </ul>
              </div>

              {/* QRS Comparison */}
              <div className="grid grid-cols-2 gap-3">
                {/* Narrow QRS */}
                <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                  <p className="font-semibold text-xs mb-2 text-center border-b pb-2">Narrow QRS (SVT)</p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="font-medium text-foreground">Stable:</p>
                      <p className="text-muted-foreground">1. Vagal maneuvers</p>
                      <p className="text-muted-foreground">2. Adenosine IV push</p>
                      {drugs && (
                        <p className="mt-1">
                          <span className="text-muted-foreground">1st:</span> <span className={calcValue}>{drugs.adenosine.firstDose}mg</span><br/>
                          <span className="text-muted-foreground">2nd:</span> <span className={calcValue}>{drugs.adenosine.secondDose}mg</span>
                        </p>
                      )}
                    </div>
                    <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="font-medium text-foreground">Unstable:</p>
                      <p className="text-muted-foreground">Synchronized cardioversion</p>
                      {drugs && <p className={calcValue}>{drugs.cardioversion.first}-{drugs.cardioversion.second}J</p>}
                    </div>
                  </div>
                </div>

                {/* Wide QRS */}
                <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                  <p className="font-semibold text-xs mb-2 text-center border-b pb-2">Wide QRS (VT)</p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="font-medium text-foreground">Stable:</p>
                      <p className="text-muted-foreground">Expert consultation</p>
                      <p className="text-muted-foreground">Amiodarone IV</p>
                      {drugs && <p className={calcValue}>{drugs.amiodarone.dose}mg over 20-60min</p>}
                    </div>
                    <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="font-medium text-foreground text-[10px] sm:text-xs">Unstable/Pulseless:</p>
                      <p className="text-muted-foreground text-[10px] sm:text-xs">Cardioversion or Arrest protocol</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== BRADYCARDIA TAB ==================== */}
        <TabsContent value="brady" className="space-y-3 mt-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Bradycardia with Pulse
              </CardTitle>
              <CardDescription className="text-xs">HR &lt;60 with cardiopulmonary compromise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Initial Steps */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-blue-400">
                <p className="font-semibold text-sm mb-2">Initial Steps</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Support ABCs, give O₂, monitor, IV/IO</li>
                  <li>• If HR &lt;60 with poor perfusion → <span className="font-medium text-red-600">Start CPR</span></li>
                </ul>
              </div>

              {/* Treatment Algorithm */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-400">
                <p className="font-semibold text-sm mb-3">Persistent Bradycardia + Compromise</p>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs">
                    <p className="font-medium text-foreground">1. Epinephrine</p>
                    <p className="text-muted-foreground">0.01 mg/kg IV/IO (1:10,000) q3-5min</p>
                    {drugs && <p className={`${calcValue} mt-1`}>{drugs.epinephrine.dose}mg ({drugs.epinephrine.volume1to10000}mL)</p>}
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs">
                    <p className="font-medium text-foreground">2. Atropine <span className="font-normal text-muted-foreground">(if vagal/AV block)</span></p>
                    <p className="text-muted-foreground">0.02 mg/kg IV/IO (min 0.1mg, max 0.5mg)</p>
                    {drugs && <p className={`${calcValue} mt-1`}>{drugs.atropine.dose}mg</p>}
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs">
                    <p className="font-medium text-foreground">3. Consider pacing</p>
                    <p className="text-muted-foreground">If unresponsive to medications</p>
                  </div>
                </div>
              </div>

              {/* Normal HR Reference */}
              <Section title="Normal Heart Rate by Age">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <span className="text-muted-foreground">Newborn:</span>
                    <span className={`${calcValue} ml-2`}>80-205 bpm</span>
                  </div>
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <span className="text-muted-foreground">Infant:</span>
                    <span className={`${calcValue} ml-2`}>75-190 bpm</span>
                  </div>
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <span className="text-muted-foreground">Child (1-10y):</span>
                    <span className={`${calcValue} ml-2`}>60-140 bpm</span>
                  </div>
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <span className="text-muted-foreground">Adolescent:</span>
                    <span className={`${calcValue} ml-2`}>50-100 bpm</span>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== DRUGS TAB ==================== */}
        <TabsContent value="drugs" className="space-y-3 mt-4">
          <Card className="nightingale-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                PALS Drug Reference
              </CardTitle>
              <CardDescription className="text-xs">
                {w ? `Calculated for ${w} kg patient` : "Enter weight above for calculations"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Epinephrine */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Epinephrine (1:10,000)</p>
                    <p className="text-xs text-muted-foreground">Arrest, bradycardia, anaphylaxis</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">0.01 mg/kg IV/IO</p>
                    {drugs && (
                      <p className={`text-sm ${calcValue}`}>{drugs.epinephrine.dose} mg <span className="text-muted-foreground font-normal">({drugs.epinephrine.volume1to10000} mL)</span></p>
                    )}
                  </div>
                </div>
              </div>

              {/* Amiodarone */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Amiodarone</p>
                    <p className="text-xs text-muted-foreground">VF/pVT, stable VT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">5 mg/kg IV/IO</p>
                    {drugs && <p className={`text-sm ${calcValue}`}>{drugs.amiodarone.dose} mg</p>}
                  </div>
                </div>
              </div>

              {/* Adenosine */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Adenosine</p>
                    <p className="text-xs text-muted-foreground">SVT (rapid IV push + flush)</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">1st: 0.1 mg/kg (max 6mg)</p>
                    {drugs && <p className={calcValue}>{drugs.adenosine.firstDose} mg</p>}
                    <p className="text-muted-foreground mt-1">2nd: 0.2 mg/kg (max 12mg)</p>
                    {drugs && <p className={calcValue}>{drugs.adenosine.secondDose} mg</p>}
                  </div>
                </div>
              </div>

              {/* Atropine */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Atropine</p>
                    <p className="text-xs text-muted-foreground">Bradycardia (vagal/AV block)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">0.02 mg/kg (min 0.1, max 0.5)</p>
                    {drugs && <p className={`text-sm ${calcValue}`}>{drugs.atropine.dose} mg</p>}
                  </div>
                </div>
              </div>

              {/* Energy Doses */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="font-semibold text-sm mb-2">Energy Doses</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-medium">Defibrillation</p>
                    <p className="text-muted-foreground">1st: 2 J/kg {drugs && <span className={calcValue}>→ {drugs.defibrillation.first}J</span>}</p>
                    <p className="text-muted-foreground">2nd+: 4 J/kg {drugs && <span className={calcValue}>→ {drugs.defibrillation.subsequent}J</span>}</p>
                  </div>
                  <div>
                    <p className="font-medium">Cardioversion</p>
                    <p className="text-muted-foreground">0.5-1 J/kg → 2 J/kg</p>
                    {drugs && <p className={calcValue}>{drugs.cardioversion.first}-{drugs.cardioversion.second}J</p>}
                  </div>
                </div>
              </div>

              {/* Lidocaine */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">Lidocaine (alternative)</p>
                    <p className="text-xs text-muted-foreground">VF/pVT if amiodarone unavailable</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">1 mg/kg IV/IO bolus</p>
                    {drugs && <p className={`text-sm ${calcValue}`}>{drugs.lidocaine.bolus} mg</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card className="nightingale-card">
            <CardContent className="pt-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">PALS 2025 Quick Reference</p>
              <p>• Epinephrine: repeat every 3-5 minutes</p>
              <p>• CPR: 100-120/min, minimize interruptions (&gt;60%)</p>
              <p>• DBP target: ≥25 mmHg (infant), ≥30 mmHg (child)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Approaches Page - PICU Protocols (Saudi MOH Guidelines)

export default CPRPage;
