/**
 * CPR Page - PALS Algorithms & Recording
 * 
 * Features:
 * - CPR Tab: Interactive flowchart following PALS card exactly
 *   - Track-based navigation (Shockable vs Non-Shockable, Narrow vs Wide QRS)
 * - Recording Tab: Timer with 2-min pulse check reminders
 *   - Timestamp buttons for Pulse, Rx, Shock events
 * 
 * Drug calculations based on weight (PALS 2025)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartIcon } from "@/components/HealthIcons";
import { 
  ChevronDown, 
  ChevronRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  Pill,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

const CPRPage = ({ onBack }) => {
  const [mainTab, setMainTab] = useState("cpr");
  const [weight, setWeight] = useState("");
  const w = parseFloat(weight) || 0;

  // CPR Flow State
  const [flowState, setFlowState] = useState("start"); // start, shockable, non-shockable, tachy-narrow, tachy-wide
  const [currentStep, setCurrentStep] = useState(0);

  // Recording State
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [events, setEvents] = useState([]);
  const [lastPulseCheck, setLastPulseCheck] = useState(0);
  const [showReminder, setShowReminder] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Scroll to top when page loads
  useEffect(() => {
    const scrollContainer = document.querySelector('.native-scroll');
    if (scrollContainer) scrollContainer.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          // Check for 2-minute reminder
          const timeSinceLastPulse = newTime - lastPulseCheck;
          if (timeSinceLastPulse >= 120 && timeSinceLastPulse < 123) {
            setShowReminder(true);
            // Try to play audio alert
            try {
              if (audioRef.current) {
                audioRef.current.play().catch(() => {});
              }
            } catch (e) {}
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, lastPulseCheck]);

  // Drug calculations
  const drugs = w ? {
    epinephrine: {
      dose: (w * 0.01).toFixed(3),
      volume: (w * 0.1).toFixed(2),
    },
    amiodarone: { dose: (w * 5).toFixed(1) },
    adenosine: {
      first: Math.min(w * 0.1, 6).toFixed(2),
      second: Math.min(w * 0.2, 12).toFixed(2),
    },
    atropine: { dose: Math.max(Math.min(w * 0.02, 0.5), 0.1).toFixed(2) },
    defib: { first: (w * 2).toFixed(0), second: (w * 4).toFixed(0) },
    cardioversion: { first: (w * 0.5).toFixed(1), second: (w * 1).toFixed(0) },
    lidocaine: { dose: (w * 1).toFixed(1) },
  } : null;

  const calcValue = "font-mono font-bold text-red-600 dark:text-red-400";

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Record event
  const recordEvent = (type) => {
    const newEvent = {
      type,
      time: elapsedTime,
      timestamp: new Date().toLocaleTimeString(),
    };
    setEvents(prev => [...prev, newEvent]);
    
    if (type === 'pulse') {
      setLastPulseCheck(elapsedTime);
      setShowReminder(false);
    }
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setEvents([]);
    setLastPulseCheck(0);
    setShowReminder(false);
  };

  // Reset flow
  const resetFlow = () => {
    setFlowState("start");
    setCurrentStep(0);
  };

  // Collapsible Section
  const Section = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          data-testid={`section-toggle-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
        >
          <span className="font-medium text-sm">{title}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="p-4 bg-white dark:bg-gray-900 text-sm">{children}</div>}
      </div>
    );
  };

  // ==================== CPR FLOW COMPONENTS ====================

  // Start Screen - Initial Assessment
  const StartScreen = () => (
    <div className="space-y-4">
      {/* CPR Basics */}
      <Card className="nightingale-card border-red-200 dark:border-red-800/50">
        <CardContent className="pt-4 space-y-4">
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
            <p className="font-bold text-base mb-2 text-red-700 dark:text-red-400">1. Start High-Quality CPR</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p>Rate: <span className={calcValue}>100-120/min</span></p>
                <p>Depth: <span className={calcValue}>⅓ AP diameter</span></p>
              </div>
              <div className="space-y-1">
                <p>C:V ratio: <span className={calcValue}>15:2</span></p>
                <p>CPR fraction: <span className={calcValue}>&gt;60%</span></p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="font-semibold text-sm mb-2">Give oxygen • Attach monitor/defibrillator</p>
          </div>
        </CardContent>
      </Card>

      {/* Rhythm Decision */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">2. Check Rhythm - Shockable?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-2 border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              onClick={() => setFlowState("shockable")}
              data-testid="select-shockable"
            >
              <Zap className="h-6 w-6 text-amber-500" />
              <span className="font-semibold">VF / pVT</span>
              <span className="text-xs text-muted-foreground">Shockable</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-2 border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => setFlowState("non-shockable")}
              data-testid="select-non-shockable"
            >
              <Activity className="h-6 w-6 text-blue-500" />
              <span className="font-semibold">Asystole / PEA</span>
              <span className="text-xs text-muted-foreground">Non-Shockable</span>
            </Button>
          </div>

          {/* Tachycardia Path */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground mb-3 text-center">Tachycardia with Pulse?</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-1 border border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => setFlowState("tachy-narrow")}
                data-testid="select-narrow-qrs"
              >
                <span className="font-semibold text-sm">Narrow QRS</span>
                <span className="text-xs text-muted-foreground">≤0.09 sec (SVT)</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-1 border border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={() => setFlowState("tachy-wide")}
                data-testid="select-wide-qrs"
              >
                <span className="font-semibold text-sm">Wide QRS</span>
                <span className="text-xs text-muted-foreground">&gt;0.09 sec (VT)</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* H's and T's */}
      <Section title="Reversible Causes (H's & T's)">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-2">H&apos;s</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Hypoxia</li>
              <li>• Hypovolemia</li>
              <li>• H+ (Acidosis)</li>
              <li>• Hypo/Hyperkalemia</li>
              <li>• Hypothermia</li>
              <li>• Hypoglycemia</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">T&apos;s</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Tension pneumothorax</li>
              <li>• Tamponade (cardiac)</li>
              <li>• Toxins</li>
              <li>• Thrombosis (PE)</li>
              <li>• Thrombosis (coronary)</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );

  // Shockable Rhythm Track (VF/pVT)
  const ShockableTrack = () => {
    const steps = [
      {
        title: "Shock",
        content: (
          <div className="space-y-2">
            <p className="font-semibold">Defibrillation 2 J/kg</p>
            {drugs && <p className={calcValue}>{drugs.defib.first} J</p>}
          </div>
        ),
      },
      {
        title: "CPR 2 min + IV/IO access",
        content: (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Continue high-quality CPR</p>
            <p>• Establish IV/IO access</p>
          </div>
        ),
      },
      {
        title: "Rhythm check → Shock",
        content: (
          <div className="space-y-2">
            <p className="font-semibold">Defibrillation 4 J/kg</p>
            {drugs && <p className={calcValue}>{drugs.defib.second} J</p>}
          </div>
        ),
      },
      {
        title: "CPR 2 min + Epinephrine",
        content: (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Epinephrine 0.01 mg/kg IV/IO</p>
            {drugs && (
              <p className={calcValue}>{drugs.epinephrine.dose} mg ({drugs.epinephrine.volume} mL)</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">Repeat every 3-5 minutes</p>
          </div>
        ),
      },
      {
        title: "Rhythm check → Shock",
        content: (
          <div className="space-y-2">
            <p className="font-semibold">Defibrillation 4 J/kg</p>
            {drugs && <p className={calcValue}>{drugs.defib.second} J</p>}
          </div>
        ),
      },
      {
        title: "CPR 2 min + Amiodarone",
        content: (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Amiodarone 5 mg/kg IV/IO</p>
            {drugs && <p className={calcValue}>{drugs.amiodarone.dose} mg</p>}
            <p className="text-xs text-muted-foreground mt-2">Or Lidocaine 1 mg/kg {drugs && <span className={calcValue}>({drugs.lidocaine.dose} mg)</span>}</p>
          </div>
        ),
      },
      {
        title: "Continue Cycle",
        content: (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Shock → CPR 2 min → Rhythm check</p>
            <p>• Epinephrine every 3-5 min</p>
            <p>• Treat reversible causes</p>
            <p className="font-semibold text-foreground mt-3">If ROSC → Post-cardiac arrest care</p>
          </div>
        ),
      },
    ];

    return (
      <TrackLayout
        title="VF / pVT (Shockable)"
        color="amber"
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onBack={resetFlow}
      />
    );
  };

  // Non-Shockable Rhythm Track (Asystole/PEA)
  const NonShockableTrack = () => {
    const steps = [
      {
        title: "CPR 2 min",
        content: (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• High-quality CPR immediately</p>
            <p>• Establish IV/IO access</p>
          </div>
        ),
      },
      {
        title: "Epinephrine ASAP",
        content: (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Epinephrine 0.01 mg/kg IV/IO</p>
            {drugs && (
              <p className={calcValue}>{drugs.epinephrine.dose} mg ({drugs.epinephrine.volume} mL)</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">Give as soon as IV/IO available</p>
          </div>
        ),
      },
      {
        title: "CPR 2 min + Advanced Airway",
        content: (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Continue CPR</p>
            <p>• Consider advanced airway</p>
            <p>• Capnography if intubated</p>
          </div>
        ),
      },
      {
        title: "Rhythm Check",
        content: (
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Is rhythm shockable now?</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-400"
                onClick={() => {
                  setFlowState("shockable");
                  setCurrentStep(0);
                }}
              >
                Yes → VF/pVT
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-400"
                onClick={() => setCurrentStep(4)}
              >
                No → Continue
              </Button>
            </div>
          </div>
        ),
      },
      {
        title: "CPR 2 min + Epinephrine",
        content: (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Repeat Epinephrine every 3-5 min</p>
            {drugs && (
              <p className={calcValue}>{drugs.epinephrine.dose} mg ({drugs.epinephrine.volume} mL)</p>
            )}
          </div>
        ),
      },
      {
        title: "Treat Reversible Causes",
        content: (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Search for and treat:</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>
                <p>• Hypoxia</p>
                <p>• Hypovolemia</p>
                <p>• H+ (Acidosis)</p>
              </div>
              <div>
                <p>• Tension pneumo</p>
                <p>• Tamponade</p>
                <p>• Toxins</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Continue Cycle",
        content: (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• CPR 2 min → Rhythm check</p>
            <p>• Epinephrine every 3-5 min</p>
            <p>• Treat reversible causes</p>
            <p className="font-semibold text-foreground mt-3">If ROSC → Post-cardiac arrest care</p>
          </div>
        ),
      },
    ];

    return (
      <TrackLayout
        title="Asystole / PEA (Non-Shockable)"
        color="blue"
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onBack={resetFlow}
      />
    );
  };

  // Narrow QRS Tachycardia Track (SVT)
  const NarrowQRSTrack = () => {
    const steps = [
      {
        title: "Initial Assessment",
        content: (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Support ABCs, give O₂</p>
            <p>• IV/IO access, 12-lead ECG</p>
            <p>• Identify: Sinus tachy vs SVT</p>
          </div>
        ),
      },
      {
        title: "Hemodynamically Stable?",
        content: (
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Check for signs of instability:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Hypotension</li>
              <li>• Altered mental status</li>
              <li>• Signs of shock</li>
            </ul>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="border-green-400"
                onClick={() => setCurrentStep(2)}
              >
                Stable
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-400"
                onClick={() => setCurrentStep(4)}
              >
                Unstable
              </Button>
            </div>
          </div>
        ),
      },
      {
        title: "Vagal Maneuvers",
        content: (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Try first:</p>
            <p>• Ice to face (infants)</p>
            <p>• Valsalva (older children)</p>
            <p>• Carotid massage (if appropriate)</p>
          </div>
        ),
      },
      {
        title: "Adenosine",
        content: (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Rapid IV push with flush</p>
            <div className="space-y-2 mt-2">
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-sm">1st dose: 0.1 mg/kg (max 6mg)</p>
                {drugs && <p className={calcValue}>{drugs.adenosine.first} mg</p>}
              </div>
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-sm">2nd dose: 0.2 mg/kg (max 12mg)</p>
                {drugs && <p className={calcValue}>{drugs.adenosine.second} mg</p>}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Synchronized Cardioversion",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-red-600 dark:text-red-400">For unstable patients</p>
            <p className="text-sm text-muted-foreground">Sedate if possible, don&apos;t delay</p>
            <div className="mt-2 p-3 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-sm">0.5-1 J/kg → increase to 2 J/kg</p>
              {drugs && <p className={calcValue}>{drugs.cardioversion.first} - {drugs.cardioversion.second} J</p>}
            </div>
          </div>
        ),
      },
      {
        title: "Post-Conversion",
        content: (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Monitor for recurrence</p>
            <p>• Expert consultation</p>
            <p>• Consider maintenance antiarrhythmic</p>
          </div>
        ),
      },
    ];

    return (
      <TrackLayout
        title="Narrow QRS Tachycardia (SVT)"
        color="green"
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onBack={resetFlow}
      />
    );
  };

  // Wide QRS Tachycardia Track (VT)
  const WideQRSTrack = () => {
    const steps = [
      {
        title: "Initial Assessment",
        content: (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Support ABCs, give O₂</p>
            <p>• IV/IO access, 12-lead ECG</p>
            <p>• Assume VT until proven otherwise</p>
          </div>
        ),
      },
      {
        title: "Hemodynamically Stable?",
        content: (
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Check for pulse and stability:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Pulseless → Cardiac arrest protocol</li>
              <li>• Unstable with pulse → Cardioversion</li>
              <li>• Stable → Drug therapy</li>
            </ul>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="border-green-400"
                onClick={() => setCurrentStep(2)}
              >
                Stable
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-400"
                onClick={() => setCurrentStep(4)}
              >
                Unstable
              </Button>
            </div>
          </div>
        ),
      },
      {
        title: "Expert Consultation",
        content: (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Get expert help early</p>
            <p>• Pediatric cardiology</p>
            <p>• Determine: VT vs SVT with aberrancy</p>
          </div>
        ),
      },
      {
        title: "Amiodarone",
        content: (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">For stable monomorphic VT</p>
            <div className="mt-2 p-3 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-sm">5 mg/kg IV over 20-60 min</p>
              {drugs && <p className={calcValue}>{drugs.amiodarone.dose} mg</p>}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Or Procainamide 15 mg/kg over 30-60 min</p>
          </div>
        ),
      },
      {
        title: "Synchronized Cardioversion",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-red-600 dark:text-red-400">For unstable patients</p>
            <p className="text-sm text-muted-foreground">Sedate if possible, don&apos;t delay</p>
            <div className="mt-2 p-3 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-sm">0.5-1 J/kg → increase to 2 J/kg</p>
              {drugs && <p className={calcValue}>{drugs.cardioversion.first} - {drugs.cardioversion.second} J</p>}
            </div>
          </div>
        ),
      },
      {
        title: "Pulseless → Arrest Protocol",
        content: (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-red-600">If pulseless at any time:</p>
            <Button
              variant="outline"
              className="w-full border-amber-400 mt-2"
              onClick={() => {
                setFlowState("shockable");
                setCurrentStep(0);
              }}
            >
              Go to VF/pVT Protocol
            </Button>
          </div>
        ),
      },
    ];

    return (
      <TrackLayout
        title="Wide QRS Tachycardia (VT)"
        color="purple"
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onBack={resetFlow}
      />
    );
  };

  // Reusable Track Layout Component
  const TrackLayout = ({ title, color, steps, currentStep, setCurrentStep, onBack }) => {
    const colorClasses = {
      amber: "border-amber-400 bg-amber-50 dark:bg-amber-900/20",
      blue: "border-blue-400 bg-blue-50 dark:bg-blue-900/20",
      green: "border-green-400 bg-green-50 dark:bg-green-900/20",
      purple: "border-purple-400 bg-purple-50 dark:bg-purple-900/20",
    };

    return (
      <div className="space-y-4">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
            data-testid="track-back-button"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>

        {/* Progress Indicators */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`min-w-[32px] h-2 rounded-full transition-colors ${
                idx === currentStep 
                  ? `bg-${color}-500` 
                  : idx < currentStep 
                    ? `bg-${color}-300 dark:bg-${color}-700` 
                    : 'bg-gray-200 dark:bg-gray-700'
              }`}
              style={{
                backgroundColor: idx === currentStep 
                  ? `var(--${color}-500, #f59e0b)` 
                  : idx < currentStep 
                    ? `var(--${color}-300, #fcd34d)` 
                    : undefined
              }}
              data-testid={`step-indicator-${idx}`}
            />
          ))}
        </div>

        {/* Current Step Card */}
        <Card className={`nightingale-card border-l-4 ${colorClasses[color]}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-gray-800 text-sm font-bold border">
                {currentStep + 1}
              </span>
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {steps[currentStep].content}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1"
            data-testid="step-prev-button"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="flex-1"
            data-testid="step-next-button"
          >
            Next Step
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Quick Drug Reference */}
        {drugs && (
          <Section title="Quick Drug Doses" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Epinephrine</p>
                <p className={calcValue}>{drugs.epinephrine.dose} mg</p>
              </div>
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Amiodarone</p>
                <p className={calcValue}>{drugs.amiodarone.dose} mg</p>
              </div>
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Defib</p>
                <p className={calcValue}>{drugs.defib.first} / {drugs.defib.second} J</p>
              </div>
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Cardioversion</p>
                <p className={calcValue}>{drugs.cardioversion.first}-{drugs.cardioversion.second} J</p>
              </div>
            </div>
          </Section>
        )}
      </div>
    );
  };

  // ==================== RECORDING TAB ====================
  const RecordingTab = () => (
    <div className="space-y-4">
      {/* Timer Display */}
      <Card className="nightingale-card">
        <CardContent className="pt-6">
          {/* Main Timer */}
          <div className="text-center mb-6">
            <div className={`text-6xl font-mono font-bold ${isRunning ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
              {formatTime(elapsedTime)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {isRunning ? "CPR in progress" : "Ready to start"}
            </p>
          </div>

          {/* 2-Minute Reminder Alert */}
          {showReminder && (
            <div className="mb-4 p-4 rounded-lg bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500 animate-pulse">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-bold text-amber-700 dark:text-amber-400">2-Minute Pulse Check!</p>
                  <p className="text-sm text-amber-600 dark:text-amber-500">Assess rhythm and pulse</p>
                </div>
              </div>
            </div>
          )}

          {/* Timer Controls */}
          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              variant={isRunning ? "destructive" : "default"}
              onClick={() => {
                if (!isRunning && elapsedTime === 0) {
                  setLastPulseCheck(0);
                }
                setIsRunning(!isRunning);
              }}
              className="flex-1 max-w-[150px]"
              data-testid="timer-toggle-button"
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  {elapsedTime > 0 ? "Resume" : "Start"}
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={resetTimer}
              className="flex-1 max-w-[150px]"
              data-testid="timer-reset-button"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event Buttons */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Record Events</CardTitle>
          <CardDescription className="text-xs">Tap to timestamp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2 border-2 border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
              onClick={() => recordEvent('pulse')}
              disabled={!isRunning}
              data-testid="record-pulse-button"
            >
              <Activity className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-sm">Pulse</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2 border-2 border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => recordEvent('rx')}
              disabled={!isRunning}
              data-testid="record-rx-button"
            >
              <Pill className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-sm">Rx</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2 border-2 border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              onClick={() => recordEvent('shock')}
              disabled={!isRunning}
              data-testid="record-shock-button"
            >
              <Zap className="h-6 w-6 text-amber-600" />
              <span className="font-semibold text-sm">Shock</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event Log */}
      {events.length > 0 && (
        <Card className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Event Log ({events.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    event.type === 'pulse' 
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                      : event.type === 'rx'
                        ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
                        : 'border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {event.type === 'pulse' && <Activity className="h-4 w-4 text-green-600" />}
                    {event.type === 'rx' && <Pill className="h-4 w-4 text-blue-600" />}
                    {event.type === 'shock' && <Zap className="h-4 w-4 text-amber-600" />}
                    <span className="font-medium text-sm capitalize">{event.type}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">{formatTime(event.time)}</p>
                    <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Since Last Pulse Check */}
      {isRunning && (
        <Card className="nightingale-card">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Time since last pulse check:</span>
              <span className={`font-mono font-bold ${
                (elapsedTime - lastPulseCheck) >= 120 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-foreground'
              }`}>
                {formatTime(elapsedTime - lastPulseCheck)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden audio element for alerts */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onqarpp+Xk5WfoKatr7CxsbCvrauqqqmoqKinp6alpaSjoqGgnpyam5mXlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==" type="audio/wav" />
      </audio>
    </div>
  );

  // ==================== RENDER ====================
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
                inputMode="decimal"
                placeholder="Enter weight for drug calculations"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="font-mono mt-1"
                data-testid="weight-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tab Navigation */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger 
            value="cpr" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
            data-testid="tab-cpr"
          >
            CPR
          </TabsTrigger>
          <TabsTrigger 
            value="recording" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
            data-testid="tab-recording"
          >
            Recording
          </TabsTrigger>
        </TabsList>

        {/* CPR Tab */}
        <TabsContent value="cpr" className="mt-4">
          {flowState === "start" && <StartScreen />}
          {flowState === "shockable" && <ShockableTrack />}
          {flowState === "non-shockable" && <NonShockableTrack />}
          {flowState === "tachy-narrow" && <NarrowQRSTrack />}
          {flowState === "tachy-wide" && <WideQRSTrack />}
        </TabsContent>

        {/* Recording Tab */}
        <TabsContent value="recording" className="mt-4">
          <RecordingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CPRPage;
