/**
 * CPR Page - PALS Algorithms & Recording
 * 
 * Features:
 * - CPR Tab: Full visual flowchart with arrows and cards
 *   - Cardiac Arrest (VF/pVT, Asystole/PEA)
 *   - Tachycardia (Narrow QRS, Wide QRS)
 *   - H's and T's visible at all times
 * - Recording Tab: Timer with 2-min pulse check reminders (vibration)
 *   - Tap Rx to select drug, timestamp recorded immediately
 *   - Editable drug names in log
 */

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartIcon } from "@/components/HealthIcons";
import { 
  ChevronDown, 
  ArrowDown,
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  Pill,
  Activity,
  AlertCircle,
  Clock,
  X,
  Pencil,
  Check,
  Search,
  Syringe
} from "lucide-react";

const CPRPage = ({ onBack }) => {
  const [mainTab, setMainTab] = useState("cpr");
  const [weight, setWeight] = useState("");
  const [drugSearch, setDrugSearch] = useState("");
  const w = parseFloat(weight) || 0;

  // CPR Flow State
  const [selectedTrack, setSelectedTrack] = useState(null); // 'shockable', 'non-shockable', 'narrow-qrs', 'wide-qrs'

  // Recording State
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [events, setEvents] = useState([]);
  const [lastPulseCheck, setLastPulseCheck] = useState(0);
  const [lastRxTime, setLastRxTime] = useState(0);
  const [lastRxDrug, setLastRxDrug] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [showDrugMenu, setShowDrugMenu] = useState(false);
  const [pendingRxEvent, setPendingRxEvent] = useState(null);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [editingDrugName, setEditingDrugName] = useState("");
  const timerRef = useRef(null);

  // Scroll to top
  useEffect(() => {
    const scrollContainer = document.querySelector('.native-scroll');
    if (scrollContainer) scrollContainer.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, []);

  // Vibration function
  const vibrate = (pattern) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Timer logic with 2-minute pulse check reminder
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          const timeSinceLastPulse = newTime - lastPulseCheck;
          // At exactly 120 seconds, trigger reminder with vibration
          if (timeSinceLastPulse === 120) {
            setShowReminder(true);
            vibrate([200, 100, 200]); // Vibrate twice
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, lastPulseCheck]);

  // Drug calculations (PALS 2025)
  const drugs = w ? {
    epinephrine: {
      dose: (w * 0.01).toFixed(3),
      volume: (w * 0.1).toFixed(2),
      ettDose: (w * 0.1).toFixed(2),
      ettVolume: (w * 0.1).toFixed(2),
    },
    amiodarone: { 
      dose: (w * 5).toFixed(1),
      maxDose: Math.min(w * 5, 300).toFixed(0)
    },
    adenosine: {
      first: Math.min(w * 0.1, 6).toFixed(2),
      second: Math.min(w * 0.2, 12).toFixed(2),
    },
    atropine: { 
      dose: Math.max(Math.min(w * 0.02, 0.5), 0.1).toFixed(2) 
    },
    lidocaine: { 
      bolus: (w * 1).toFixed(1),
      infusionMin: (w * 20).toFixed(0),
      infusionMax: (w * 50).toFixed(0),
    },
    nahco3: { 
      dose: (w * 1).toFixed(1) 
    },
    calcium: {
      chloride: (w * 20).toFixed(0),
      chlorideVol: (w * 0.2).toFixed(2),
      gluconate: (w * 60).toFixed(0),
      gluconateVol: (w * 0.6).toFixed(2),
    },
    glucose: {
      dose: (w * 0.5).toFixed(1),
      d10Vol: (w * 5).toFixed(1),
    },
    defib: { 
      first: (w * 2).toFixed(0), 
      second: (w * 4).toFixed(0),
      max: Math.min(w * 10, 200).toFixed(0)
    },
    cardioversion: { 
      first: (w * 0.5).toFixed(1), 
      second: (w * 1).toFixed(0),
      max: (w * 2).toFixed(0)
    },
  } : null;

  const calcValue = "font-mono font-bold text-red-600 dark:text-red-400";
  const calcValueSm = "font-mono font-semibold text-red-600 dark:text-red-400 text-xs";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Record event (for Shock only now)
  const recordEvent = (type) => {
    const newEvent = {
      type,
      drug: null,
      time: elapsedTime,
      timestamp: new Date().toLocaleTimeString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  // Handle Rx button click - record timestamp immediately, show drug menu
  const handleRxClick = () => {
    setPendingRxEvent({
      time: elapsedTime,
      timestamp: new Date().toLocaleTimeString(),
    });
    setShowDrugMenu(true);
  };

  // Handle drug selection
  const handleDrugSelect = (drugName) => {
    if (pendingRxEvent) {
      const newEvent = {
        type: 'rx',
        drug: drugName,
        time: pendingRxEvent.time,
        timestamp: pendingRxEvent.timestamp,
      };
      setEvents(prev => [...prev, newEvent]);
      setLastRxTime(pendingRxEvent.time);
      setLastRxDrug(drugName);
    }
    setShowDrugMenu(false);
    setPendingRxEvent(null);
  };

  // Handle drug menu cancel
  const handleDrugMenuCancel = () => {
    // Still record the Rx event but without drug name
    if (pendingRxEvent) {
      const newEvent = {
        type: 'rx',
        drug: null,
        time: pendingRxEvent.time,
        timestamp: pendingRxEvent.timestamp,
      };
      setEvents(prev => [...prev, newEvent]);
      setLastRxTime(pendingRxEvent.time);
      setLastRxDrug(null);
    }
    setShowDrugMenu(false);
    setPendingRxEvent(null);
  };

  // Edit drug name in log
  const startEditingDrug = (index) => {
    setEditingEventIndex(index);
    setEditingDrugName(events[index].drug || "");
  };

  const saveEditedDrug = () => {
    if (editingEventIndex !== null) {
      setEvents(prev => prev.map((event, idx) => 
        idx === editingEventIndex ? { ...event, drug: editingDrugName || null } : event
      ));
    }
    setEditingEventIndex(null);
    setEditingDrugName("");
  };

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setEvents([]);
    setLastPulseCheck(0);
    setLastRxTime(0);
    setLastRxDrug(null);
    setShowReminder(false);
  };

  // Drug selection options
  const drugOptions = [
    { id: 'epinephrine', name: 'Epinephrine', color: 'text-red-600' },
    { id: 'adenosine', name: 'Adenosine', color: 'text-blue-600' },
    { id: 'amiodarone', name: 'Amiodarone', color: 'text-purple-600' },
    { id: 'nahco3', name: 'NaHCO₃', color: 'text-amber-600' },
    { id: 'calcium', name: 'Calcium Gluconate', color: 'text-green-600' },
  ];

  // Collapsible Section
  const Section = ({ title, children, defaultOpen = false, className = "" }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium text-xs">{title}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="p-3 bg-white dark:bg-gray-900 text-xs">{children}</div>}
      </div>
    );
  };

  // H's and T's Component - Always visible
  const HsAndTs = () => (
    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
      <p className="font-bold text-xs mb-2 text-amber-800 dark:text-amber-300">Reversible Causes (H's & T's)</p>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <p className="font-semibold text-amber-700 dark:text-amber-400">H's</p>
          <p>• Hypoxia</p>
          <p>• Hypovolemia</p>
          <p>• H+ (Acidosis)</p>
          <p>• Hypo/Hyperkalemia</p>
          <p>• Hypothermia</p>
          <p>• Hypoglycemia</p>
        </div>
        <div>
          <p className="font-semibold text-amber-700 dark:text-amber-400">T's</p>
          <p>• Tension pneumothorax</p>
          <p>• Tamponade (cardiac)</p>
          <p>• Toxins</p>
          <p>• Thrombosis (PE)</p>
          <p>• Thrombosis (coronary)</p>
        </div>
      </div>
    </div>
  );

  // Flowchart Arrow Component
  const FlowArrow = ({ label, className = "" }) => (
    <div className={`flex flex-col items-center my-1 ${className}`}>
      <ArrowDown className="h-4 w-4 text-gray-400" />
      {label && <span className="text-[9px] text-gray-500 -mt-1">{label}</span>}
    </div>
  );

  // Flowchart Box Component
  const FlowBox = ({ title, children, color = "gray", highlight = false, compact = false }) => {
    const colors = {
      red: "border-red-400 bg-red-50 dark:bg-red-900/20",
      blue: "border-blue-400 bg-blue-50 dark:bg-blue-900/20",
      green: "border-green-400 bg-green-50 dark:bg-green-900/20",
      amber: "border-amber-400 bg-amber-50 dark:bg-amber-900/20",
      purple: "border-purple-400 bg-purple-50 dark:bg-purple-900/20",
      gray: "border-gray-300 bg-gray-50 dark:bg-gray-800/50",
    };
    return (
      <div className={`${compact ? 'p-1.5' : 'p-2'} rounded-lg border-2 ${colors[color]} ${highlight ? 'ring-2 ring-offset-1 ring-red-400' : ''}`}>
        {title && <p className="font-bold text-xs mb-1">{title}</p>}
        <div className="text-[10px] space-y-0.5">{children}</div>
      </div>
    );
  };

  // ==================== CARDIAC ARREST FLOWCHART ====================
  const CardiacArrestFlowchart = () => (
    <div className="space-y-3">
      {/* CARDIAC ARREST SECTION HEADER */}
      <div className="text-center py-2 px-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
        <p className="text-sm font-bold text-red-700 dark:text-red-400">CARDIAC ARREST</p>
      </div>

      {/* Step 1: Start CPR */}
      <FlowBox color="red" highlight>
        <p className="font-bold text-sm mb-1">1. Start High-Quality CPR</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p>• Rate: <span className={calcValueSm}>100-120/min</span></p>
            <p>• Depth: <span className={calcValueSm}>⅓ AP diameter</span></p>
            <p>• Full chest recoil</p>
          </div>
          <div>
            <p>• C:V ratio: <span className={calcValueSm}>15:2</span> (2 rescuers)</p>
            <p>• CPR fraction: <span className={calcValueSm}>&gt;60%</span></p>
            <p>• Minimize interruptions</p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
          <p className="font-semibold">Give oxygen • Attach monitor/defibrillator • Connect to 12-lead ECG when possible</p>
        </div>
      </FlowBox>

      <FlowArrow />

      {/* Step 2: Rhythm Check */}
      <FlowBox color="gray">
        <p className="font-bold text-sm text-center">2. Check Rhythm - Shockable?</p>
      </FlowBox>

      {/* Rhythm Selection Buttons - Side by Side */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* SHOCKABLE Button */}
        <Button
          variant={selectedTrack === 'shockable' ? 'default' : 'outline'}
          className={`w-full h-auto py-2 text-xs ${selectedTrack === 'shockable' ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-400'}`}
          onClick={() => setSelectedTrack(selectedTrack === 'shockable' ? null : 'shockable')}
        >
          <div className="flex flex-col items-center">
            <Zap className="h-4 w-4 mb-1" />
            <span className="font-bold">VF / pVT</span>
            <span className="text-[10px] opacity-80">Shockable</span>
          </div>
        </Button>

        {/* NON-SHOCKABLE Button */}
        <Button
          variant={selectedTrack === 'non-shockable' ? 'default' : 'outline'}
          className={`w-full h-auto py-2 text-xs ${selectedTrack === 'non-shockable' ? 'bg-blue-500 hover:bg-blue-600' : 'border-blue-400'}`}
          onClick={() => setSelectedTrack(selectedTrack === 'non-shockable' ? null : 'non-shockable')}
        >
          <div className="flex flex-col items-center">
            <Activity className="h-4 w-4 mb-1" />
            <span className="font-bold">Asystole / PEA</span>
            <span className="text-[10px] opacity-80">Non-Shockable</span>
          </div>
        </Button>
      </div>

      {/* SHOCKABLE (VF/pVT) Expanded Content - Full Width */}
      {selectedTrack === 'shockable' && (
        <div className="space-y-2 animate-in slide-in-from-top-2">
          <FlowArrow />
          <FlowBox color="amber" title="3. Shock">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="font-bold text-xs">Defibrillation</span>
            </div>
            <p>2 J/kg</p>
            {drugs && <p className={calcValue}>{drugs.defib.first} J</p>}
          </FlowBox>
          
          <FlowArrow />
          <FlowBox color="gray" title="4. CPR 2 min">
            <p>• IV/IO access</p>
          </FlowBox>

          <FlowArrow label="Rhythm check" />
          <FlowBox color="amber" title="5. Shock">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="font-bold text-xs">Defibrillation</span>
            </div>
            <p>4 J/kg</p>
            {drugs && <p className={calcValue}>{drugs.defib.second} J</p>}
          </FlowBox>

          <FlowArrow />
          <FlowBox color="red" title="6. CPR 2 min + Epinephrine">
            <div className="flex items-center gap-1.5 mb-1">
              <Syringe className="h-4 w-4 text-red-600" />
              <span className="font-bold text-xs">Epinephrine</span>
            </div>
            <p>0.01 mg/kg IV/IO q3-5min</p>
            {drugs && <p className={calcValue}>{drugs.epinephrine.dose} mg ({drugs.epinephrine.volume} mL)</p>}
            <p className="mt-1">• Consider advanced airway</p>
          </FlowBox>

          <FlowArrow label="Rhythm check" />
          <FlowBox color="amber" title="7. Shock">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="font-bold text-xs">Defibrillation</span>
            </div>
            <p>≥4 J/kg (max 10 J/kg)</p>
            {drugs && <p className={calcValue}>{drugs.defib.second}-{drugs.defib.max} J</p>}
          </FlowBox>

          <FlowArrow />
          <FlowBox color="purple" title="8. CPR 2 min + Amiodarone">
            <div className="flex items-center gap-1.5 mb-1">
              <Syringe className="h-4 w-4 text-purple-600" />
              <span className="font-bold text-xs">Amiodarone</span>
            </div>
            <p>5 mg/kg IV/IO bolus</p>
            {drugs && <p className={calcValue}>{drugs.amiodarone.dose} mg (max 300mg)</p>}
            <p className="mt-1 text-[9px]">Or Lidocaine 1 mg/kg {drugs && <span className={calcValueSm}>({drugs.lidocaine.bolus} mg)</span>}</p>
          </FlowBox>

          <FlowArrow label="Repeat cycle" />
          <FlowBox color="green" title="Continue">
            <p>• Shock → CPR 2 min → Rhythm check</p>
            <p>• Epinephrine q3-5 min</p>
            <p>• Treat reversible causes</p>
            <p className="font-bold mt-1">If ROSC → Post-arrest care</p>
          </FlowBox>
        </div>
      )}

      {/* NON-SHOCKABLE (Asystole/PEA) Expanded Content - Full Width */}
      {selectedTrack === 'non-shockable' && (
        <div className="space-y-2 animate-in slide-in-from-top-2">
          <FlowArrow />
          <FlowBox color="blue" title="3. CPR 2 min">
            <p>• IV/IO access</p>
          </FlowBox>

          <FlowArrow />
          <FlowBox color="red" title="4. Epinephrine ASAP">
            <div className="flex items-center gap-1.5 mb-1">
              <Syringe className="h-4 w-4 text-red-600" />
              <span className="font-bold text-xs">Epinephrine</span>
            </div>
            <p>0.01 mg/kg IV/IO</p>
            {drugs && <p className={calcValue}>{drugs.epinephrine.dose} mg ({drugs.epinephrine.volume} mL)</p>}
            <p className="text-[9px] mt-1">Give as soon as IV/IO available</p>
          </FlowBox>

          <FlowArrow />
          <FlowBox color="gray" title="5. CPR 2 min">
            <p>• Consider advanced airway</p>
            <p>• Capnography if intubated</p>
          </FlowBox>

          <FlowArrow label="Rhythm check" />
          <FlowBox color="blue" title="6. If still Asystole/PEA">
            <p>• CPR 2 min</p>
            <div className="flex items-center gap-1.5">
              <Syringe className="h-4 w-4 text-red-600" />
              <span className="font-bold text-xs">Epinephrine</span>
              <span>q3-5 min</span>
            </div>
            {drugs && <p className={calcValueSm}>{drugs.epinephrine.dose} mg</p>}
          </FlowBox>

          <FlowArrow />
          <FlowBox color="amber" title="7. Treat Reversible Causes">
            <p>Search for H's & T's</p>
            <p className="font-semibold mt-1">If rhythm becomes shockable → Shock pathway</p>
          </FlowBox>

          <FlowArrow label="Repeat" />
          <FlowBox color="green" title="Continue">
            <p>• CPR 2 min → Rhythm check</p>
            <p>• Epinephrine q3-5 min</p>
            <p>• Treat reversible causes</p>
            <p className="font-bold mt-1">If ROSC → Post-arrest care</p>
          </FlowBox>
        </div>
      )}

      {/* TACHYCARDIA SECTION */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center py-2 px-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 mb-3">
          <p className="text-sm font-bold text-blue-700 dark:text-blue-400">TACHYCARDIA WITH PULSE</p>
        </div>
        
        {/* Track Selection Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* NARROW QRS Button */}
          <Button
            variant={selectedTrack === 'narrow-qrs' ? 'default' : 'outline'}
            className={`w-full h-auto py-2 text-xs ${selectedTrack === 'narrow-qrs' ? 'bg-green-500 hover:bg-green-600' : 'border-green-400'}`}
            onClick={() => setSelectedTrack(selectedTrack === 'narrow-qrs' ? null : 'narrow-qrs')}
          >
            <div className="flex flex-col items-center">
              <span className="font-bold">Narrow QRS</span>
              <span className="text-[10px] opacity-80">≤0.09 sec (SVT)</span>
            </div>
          </Button>

          {/* WIDE QRS Button */}
          <Button
            variant={selectedTrack === 'wide-qrs' ? 'default' : 'outline'}
            className={`w-full h-auto py-2 text-xs ${selectedTrack === 'wide-qrs' ? 'bg-purple-500 hover:bg-purple-600' : 'border-purple-400'}`}
            onClick={() => setSelectedTrack(selectedTrack === 'wide-qrs' ? null : 'wide-qrs')}
          >
            <div className="flex flex-col items-center">
              <span className="font-bold">Wide QRS</span>
              <span className="text-[10px] opacity-80">&gt;0.09 sec (VT)</span>
            </div>
          </Button>
        </div>

        {/* NARROW QRS Expanded Content - Full Width */}
        {selectedTrack === 'narrow-qrs' && (
          <div className="space-y-2 animate-in slide-in-from-top-2">
            <FlowArrow />
            <FlowBox color="green" title="1. Initial Assessment">
              <p>• Support ABCs, give O₂</p>
              <p>• IV/IO access, 12-lead ECG</p>
              <p>• Identify: Sinus tachy vs SVT</p>
            </FlowBox>

            <FlowArrow />
            <FlowBox color="gray" title="2. Hemodynamically Stable?">
              <p className="font-semibold">Signs of instability:</p>
              <p>• Hypotension, Altered mental status, Signs of shock</p>
            </FlowBox>

            <FlowArrow />
            {/* Side-by-side Stable vs Unstable - Now Full Width */}
            <div className="grid grid-cols-2 gap-3">
              {/* STABLE PATH */}
              <div className="space-y-2">
                <div className="text-center py-1.5 rounded bg-green-100 dark:bg-green-900/30 border border-green-300">
                  <span className="text-sm font-bold text-green-700 dark:text-green-400">STABLE</span>
                </div>
                <FlowBox color="green">
                  <p className="font-bold text-xs">Vagal Maneuvers</p>
                  <p>• Ice to face (infants)</p>
                  <p>• Valsalva (older children)</p>
                </FlowBox>
                <FlowArrow />
                <FlowBox color="blue">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Syringe className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="font-bold text-xs">Adenosine</span>
                  </div>
                  <p>Rapid IV push with NS flush</p>
                  <p className="mt-1">1st dose: 0.1 mg/kg (max 6mg)</p>
                  {drugs && <p className={calcValue}>{drugs.adenosine.first} mg</p>}
                  <p className="mt-1">2nd dose: 0.2 mg/kg (max 12mg)</p>
                  {drugs && <p className={calcValue}>{drugs.adenosine.second} mg</p>}
                </FlowBox>
              </div>
              {/* UNSTABLE PATH */}
              <div className="space-y-2">
                <div className="text-center py-1.5 rounded bg-red-100 dark:bg-red-900/30 border border-red-300">
                  <span className="text-sm font-bold text-red-700 dark:text-red-400">UNSTABLE</span>
                </div>
                <FlowBox color="red">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span className="font-bold text-xs">Synchronized Cardioversion</span>
                  </div>
                  <p className="font-semibold">Sedate if possible</p>
                  <p className="mt-1">1st: 0.5-1 J/kg</p>
                  <p>2nd: increase to 2 J/kg</p>
                  {drugs && <p className={calcValue}>{drugs.cardioversion.first}-{drugs.cardioversion.max} J</p>}
                </FlowBox>
              </div>
            </div>
          </div>
        )}

        {/* WIDE QRS Expanded Content - Full Width */}
        {selectedTrack === 'wide-qrs' && (
          <div className="space-y-2 animate-in slide-in-from-top-2">
            <FlowArrow />
            <FlowBox color="purple" title="1. Initial Assessment">
              <p>• Support ABCs, give O₂</p>
              <p>• IV/IO access, 12-lead ECG</p>
              <p>• Assume VT until proven otherwise</p>
            </FlowBox>

            <FlowArrow />
            <FlowBox color="gray" title="2. Pulse Present?">
              <p className="font-semibold text-red-600">Pulseless → Cardiac Arrest (VF/pVT pathway)</p>
            </FlowBox>

            <FlowArrow />
            {/* Side-by-side Stable vs Unstable - Now Full Width */}
            <div className="grid grid-cols-2 gap-3">
              {/* STABLE PATH */}
              <div className="space-y-2">
                <div className="text-center py-1.5 rounded bg-green-100 dark:bg-green-900/30 border border-green-300">
                  <span className="text-sm font-bold text-green-700 dark:text-green-400">STABLE</span>
                </div>
                <FlowBox color="purple">
                  <p className="font-bold text-xs">Expert Consultation</p>
                  <p>• Pediatric cardiology</p>
                  <p>• Determine: VT vs SVT with aberrancy</p>
                </FlowBox>
                <FlowArrow />
                <FlowBox color="purple">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Syringe className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <span className="font-bold text-xs">Amiodarone</span>
                  </div>
                  <p>For stable monomorphic VT</p>
                  <p>5 mg/kg IV over 20-60 min</p>
                  {drugs && <p className={calcValue}>{drugs.amiodarone.dose} mg (max 300mg)</p>}
                </FlowBox>
              </div>
              {/* UNSTABLE PATH */}
              <div className="space-y-2">
                <div className="text-center py-1.5 rounded bg-red-100 dark:bg-red-900/30 border border-red-300">
                  <span className="text-sm font-bold text-red-700 dark:text-red-400">UNSTABLE</span>
                </div>
                <FlowBox color="red">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span className="font-bold text-xs">Synchronized Cardioversion</span>
                  </div>
                  <p className="font-semibold">Sedate if possible</p>
                  <p className="mt-1">1st: 0.5-1 J/kg</p>
                  <p>2nd: increase to 2 J/kg</p>
                  {drugs && <p className={calcValue}>{drugs.cardioversion.first}-{drugs.cardioversion.max} J</p>}
                </FlowBox>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* H's and T's - Always visible */}
      <HsAndTs />

      {/* Drug Reference */}
      {drugs && (
        <Section title="Drug Doses Reference" defaultOpen className="mt-3">
          <div className="space-y-2">
            {/* Epinephrine */}
            <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="font-bold text-red-700 dark:text-red-400">Epinephrine (1:10,000)</p>
              <p>Arrest/Bradycardia: 0.01 mg/kg IV/IO q3-5min</p>
              <p className={calcValue}>{drugs.epinephrine.dose} mg ({drugs.epinephrine.volume} mL)</p>
              <p className="text-[9px] mt-1">ETT: 0.1 mg/kg = {drugs.epinephrine.ettDose} mg</p>
              <p className="text-[9px]">Max single dose: 1 mg</p>
            </div>

            {/* Amiodarone */}
            <div className="p-2 rounded bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p className="font-bold text-purple-700 dark:text-purple-400">Amiodarone</p>
              <p>VF/pVT: 5 mg/kg IV/IO bolus</p>
              <p className={calcValue}>{drugs.amiodarone.dose} mg (max 300mg)</p>
              <p className="text-[9px]">May repeat x2 for refractory VF/pVT</p>
            </div>

            {/* Lidocaine */}
            <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="font-bold">Lidocaine (alt to Amiodarone)</p>
              <p>Bolus: 1 mg/kg = <span className={calcValueSm}>{drugs.lidocaine.bolus} mg</span></p>
              <p>Infusion: 20-50 mcg/kg/min</p>
            </div>

            {/* Adenosine */}
            <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="font-bold text-blue-700 dark:text-blue-400">Adenosine (SVT)</p>
              <p>1st: 0.1 mg/kg = <span className={calcValueSm}>{drugs.adenosine.first} mg</span> (max 6mg)</p>
              <p>2nd: 0.2 mg/kg = <span className={calcValueSm}>{drugs.adenosine.second} mg</span> (max 12mg)</p>
              <p className="text-[9px]">Rapid IV push with NS flush</p>
            </div>

            {/* Atropine */}
            <div className="p-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="font-bold text-green-700 dark:text-green-400">Atropine (Bradycardia)</p>
              <p>0.02 mg/kg = <span className={calcValueSm}>{drugs.atropine.dose} mg</span></p>
              <p className="text-[9px]">Min 0.1mg, Max 0.5mg</p>
            </div>

            {/* Sodium Bicarbonate */}
            <div className="p-2 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="font-bold text-amber-700 dark:text-amber-400">Sodium Bicarbonate</p>
              <p>1 mEq/kg IV/IO = <span className={calcValueSm}>{drugs.nahco3.dose} mEq</span></p>
              <p className="text-[9px]">For severe metabolic acidosis, hyperkalemia</p>
            </div>

            {/* Calcium */}
            <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="font-bold">Calcium</p>
              <p>CaCl 10%: 20 mg/kg = <span className={calcValueSm}>{drugs.calcium.chloride} mg ({drugs.calcium.chlorideVol} mL)</span></p>
              <p>Ca Gluconate: 60 mg/kg = <span className={calcValueSm}>{drugs.calcium.gluconate} mg ({drugs.calcium.gluconateVol} mL)</span></p>
            </div>

            {/* Glucose */}
            <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="font-bold">Glucose (Hypoglycemia)</p>
              <p>D10W: 5-10 mL/kg = <span className={calcValueSm}>{drugs.glucose.d10Vol}-{(w * 10).toFixed(1)} mL</span></p>
            </div>

            {/* Energy Doses */}
            <div className="p-2 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
              <p className="font-bold text-amber-800 dark:text-amber-300">Energy Doses</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="font-semibold">Defibrillation</p>
                  <p>1st: 2 J/kg = <span className={calcValueSm}>{drugs.defib.first} J</span></p>
                  <p>2nd+: 4 J/kg = <span className={calcValueSm}>{drugs.defib.second} J</span></p>
                </div>
                <div>
                  <p className="font-semibold">Cardioversion</p>
                  <p>0.5-1 J/kg = <span className={calcValueSm}>{drugs.cardioversion.first}-{drugs.cardioversion.second} J</span></p>
                  <p>Max: 2 J/kg = <span className={calcValueSm}>{drugs.cardioversion.max} J</span></p>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* CPR Quality Targets */}
      <Section title="CPR Quality Targets" className="mt-2">
        <ul className="space-y-1">
          <li>• Push hard (≥⅓ AP diameter) and fast (100-120/min)</li>
          <li>• Allow complete chest recoil</li>
          <li>• Minimize interruptions (&lt;10 sec for rhythm checks)</li>
          <li>• Avoid excessive ventilation</li>
          <li>• Rotate compressor every 2 minutes</li>
          <li>• If no advanced airway: 15:2 C:V ratio</li>
          <li>• PETCO2 &lt;10-15 mmHg → improve CPR quality</li>
        </ul>
      </Section>
    </div>
  );

  // ==================== RECORDING TAB ====================
  const RecordingTab = () => (
    <div className="space-y-4">
      {/* Drug Selection Modal */}
      {showDrugMenu && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={handleDrugMenuCancel} />
          <div className="fixed left-4 right-4 top-1/3 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50">
            <div className="flex justify-between items-center mb-3 pb-2 border-b">
              <span className="text-base font-semibold">Select Drug</span>
              <button onClick={handleDrugMenuCancel} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {drugOptions.map((drug) => (
                <button
                  key={drug.id}
                  onClick={() => handleDrugSelect(drug.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-base font-medium ${drug.color} transition-colors border border-gray-200 dark:border-gray-700`}
                >
                  {drug.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Timer Display */}
      <Card className="nightingale-card">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className={`text-6xl font-mono font-bold ${isRunning ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
              {formatTime(elapsedTime)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {isRunning ? "CPR in progress" : "Ready to start"}
            </p>
          </div>

          {/* 2-Minute Pulse Check Reminder */}
          {showReminder && (
            <div 
              className="mb-4 p-4 rounded-lg bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500 cursor-pointer"
              onClick={() => {
                setShowReminder(false);
                setLastPulseCheck(elapsedTime);
              }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-bold text-amber-700 dark:text-amber-400">2-Minute Pulse Check!</p>
                  <p className="text-sm text-amber-600 dark:text-amber-500">Tap to dismiss</p>
                </div>
              </div>
            </div>
          )}

          {/* Timer Controls */}
          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              variant={isRunning ? "destructive" : "default"}
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 max-w-[150px]"
            >
              {isRunning ? (
                <><Pause className="h-5 w-5 mr-2" />Pause</>
              ) : (
                <><Play className="h-5 w-5 mr-2" />{elapsedTime > 0 ? "Resume" : "Start"}</>
              )}
            </Button>
            <Button size="lg" variant="outline" onClick={resetTimer} className="flex-1 max-w-[150px]">
              <RotateCcw className="h-5 w-5 mr-2" />Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event Buttons */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Record Events</CardTitle>
          <p className="text-xs text-muted-foreground">Tap to timestamp</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {/* Rx Button - Simple tap to open menu */}
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2 border-2 border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={handleRxClick}
              disabled={!isRunning}
            >
              <Pill className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-sm">Rx</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2 border-2 border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              onClick={() => recordEvent('shock')}
              disabled={!isRunning}
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
                    event.type === 'rx'
                      ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {event.type === 'rx' && <Pill className="h-4 w-4 text-blue-600" />}
                    {event.type === 'shock' && <Zap className="h-4 w-4 text-amber-600" />}
                    
                    {/* Editable drug name for Rx events */}
                    {event.type === 'rx' ? (
                      editingEventIndex === idx ? (
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            value={editingDrugName}
                            onChange={(e) => setEditingDrugName(e.target.value)}
                            className="h-7 text-sm py-0 px-2"
                            placeholder="Drug name"
                            autoFocus
                          />
                          <button
                            onClick={saveEditedDrug}
                            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                          >
                            <Check className="h-4 w-4 text-blue-600" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">Rx</span>
                          {event.drug && <span className="text-xs text-muted-foreground">({event.drug})</span>}
                          <button
                            onClick={() => startEditingDrug(idx)}
                            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded ml-1"
                          >
                            <Pencil className="h-3 w-3 text-blue-500" />
                          </button>
                        </div>
                      )
                    ) : (
                      <span className="font-medium text-sm capitalize">{event.type}</span>
                    )}
                  </div>
                  
                  {/* Time display */}
                  <div className="text-right">
                    <p className="font-mono text-sm">{formatTime(event.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Trackers */}
      {isRunning && (
        <Card className="nightingale-card">
          <CardContent className="pt-4">
            {/* Time since last Rx with drug name */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Time since last Rx:</span>
                {lastRxDrug && (
                  <span className="text-xs text-blue-600 dark:text-blue-400">({lastRxDrug})</span>
                )}
              </div>
              <span className="font-mono font-bold text-foreground">
                {lastRxTime > 0 ? formatTime(elapsedTime - lastRxTime) : '--:--'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==================== DRUGS TAB ====================
  // All drugs from PALS Card pages 2-3 "Drugs Used in PALS"
  const allDrugs = [
    {
      name: "Adenosine",
      color: "blue",
      indications: "SVT",
      doses: [
        { label: "1st dose", value: "0.1 mg/kg IV/IO rapid push", max: "max 6 mg", calc: drugs ? `${drugs.adenosine.first} mg` : null },
        { label: "2nd dose", value: "0.2 mg/kg IV/IO rapid push", max: "max 12 mg", calc: drugs ? `${drugs.adenosine.second} mg` : null },
      ],
      notes: "Use rapid IV push technique. Follow immediately with NS flush (5-10 mL). Use proximal IV site if possible."
    },
    {
      name: "Albuterol",
      color: "teal",
      indications: "Asthma, Anaphylaxis (bronchospasm), Hyperkalemia",
      doses: [
        { label: "MDI", value: "4-8 puffs via inhalation q20min PRN with spacer" },
        { label: "Nebulizer (<20kg)", value: "2.5 mg/dose via inhalation q20min PRN" },
        { label: "Nebulizer (>20kg)", value: "5 mg/dose via inhalation q20min PRN" },
        { label: "Continuous nebulizer", value: "0.5 mg/kg/hr via inhalation", max: "max 20 mg/hr", calc: drugs ? `${(w * 0.5).toFixed(1)} mg/hr` : null },
      ],
      notes: ""
    },
    {
      name: "Amiodarone",
      color: "purple",
      indications: "VF/pulseless VT, SVT, VT (with pulses)",
      doses: [
        { label: "Pulseless arrest", value: "5 mg/kg IV/IO bolus", max: "max 300 mg", calc: drugs ? `${drugs.amiodarone.dose} mg` : null },
        { label: "SVT/VT with pulses", value: "5 mg/kg IV/IO over 20-60 min", max: "max 300 mg", calc: drugs ? `${drugs.amiodarone.dose} mg` : null },
      ],
      notes: "May repeat to daily max 15 mg/kg (2.2g in adolescents)"
    },
    {
      name: "Atropine Sulfate",
      color: "green",
      indications: "Symptomatic Bradycardia",
      doses: [
        { label: "IV/IO", value: "0.02 mg/kg", max: "max single dose 0.5 mg", calc: drugs ? `${drugs.atropine.dose} mg` : null },
      ],
      notes: "May repeat once in 3-5 min. Max total: child 1 mg, adolescent 3 mg. Use for increased vagal tone or primary AV block."
    },
    {
      name: "Calcium Chloride 10%",
      color: "teal",
      indications: "Hypocalcemia, Hyperkalemia, Hypermagnesemia, Ca channel blocker OD",
      doses: [
        { label: "IV/IO", value: "20 mg/kg (0.2 mL/kg) slow push", calc: drugs ? `${drugs.calcium.chloride} mg (${drugs.calcium.chlorideVol} mL)` : null },
      ],
      notes: "Repeat PRN. Central line preferred. Contains 27 mg/mL elemental calcium."
    },
    {
      name: "Calcium Gluconate",
      color: "teal",
      indications: "Hypocalcemia, Hyperkalemia, Hypermagnesemia, Ca channel blocker OD",
      doses: [
        { label: "IV/IO", value: "60 mg/kg (0.6 mL/kg) slow push", calc: drugs ? `${drugs.calcium.gluconate} mg (${drugs.calcium.gluconateVol} mL)` : null },
      ],
      notes: "Repeat PRN. Safer for peripheral IV. Contains 9 mg/mL elemental calcium."
    },
    {
      name: "Dexamethasone",
      color: "orange",
      indications: "Croup",
      doses: [
        { label: "PO/IM/IV", value: "0.6 mg/kg", max: "max 16 mg", calc: drugs ? `${(w * 0.6).toFixed(1)} mg` : null },
      ],
      notes: ""
    },
    {
      name: "Dextrose (Glucose)",
      color: "orange",
      indications: "Hypoglycemia",
      doses: [
        { label: "IV/IO", value: "0.5-1 g/kg", calc: drugs ? `${drugs.glucose.dose}-${(w * 1).toFixed(1)} g` : null },
        { label: "D10W", value: "5-10 mL/kg", calc: drugs ? `${drugs.glucose.d10Vol}-${(w * 10).toFixed(1)} mL` : null },
        { label: "D25W", value: "2-4 mL/kg", calc: drugs ? `${(w * 2).toFixed(1)}-${(w * 4).toFixed(1)} mL` : null },
      ],
      notes: "D50W not recommended for pediatrics."
    },
    {
      name: "Dobutamine",
      color: "pink",
      indications: "Heart failure, Cardiogenic shock",
      doses: [
        { label: "IV/IO infusion", value: "2-20 mcg/kg/min", calc: drugs ? `${(w * 2).toFixed(0)}-${(w * 20).toFixed(0)} mcg/min` : null },
      ],
      notes: "Titrate to desired effect."
    },
    {
      name: "Dopamine",
      color: "pink",
      indications: "Cardiogenic shock, Distributive shock",
      doses: [
        { label: "IV/IO infusion", value: "2-20 mcg/kg/min", calc: drugs ? `${(w * 2).toFixed(0)}-${(w * 20).toFixed(0)} mcg/min` : null },
      ],
      notes: "Titrate to desired effect."
    },
    {
      name: "Epinephrine",
      color: "red",
      indications: "Pulseless arrest, Bradycardia, Hypotensive shock, Anaphylaxis, Asthma, Croup",
      doses: [
        { label: "Arrest/Bradycardia IV/IO", value: "0.01 mg/kg (0.1 mL/kg of 0.1 mg/mL) q3-5min", max: "max 1 mg", calc: drugs ? `${drugs.epinephrine.dose} mg (${drugs.epinephrine.volume} mL)` : null },
        { label: "Arrest/Bradycardia ETT", value: "0.1 mg/kg (0.1 mL/kg of 1 mg/mL) q3-5min", calc: drugs ? `${drugs.epinephrine.ettDose} mg` : null },
        { label: "Hypotensive shock", value: "0.1-1 mcg/kg/min IV/IO infusion", calc: drugs ? `${(w * 0.1).toFixed(1)}-${(w * 1).toFixed(1)} mcg/min` : null },
        { label: "Anaphylaxis IM", value: "0.01 mg/kg IM q15min PRN", max: "max 0.3 mg", calc: drugs ? `${(w * 0.01).toFixed(2)} mg` : null },
        { label: "Anaphylaxis autoinjector", value: "0.3 mg (≥30kg) or 0.15 mg (10-30kg)" },
        { label: "Asthma SC", value: "0.01 mg/kg q15min", max: "max 0.3 mg" },
      ],
      notes: "Multiple routes. For croup: nebulized racemic epi 0.25-0.5 mL of 2.25% in 3mL NS."
    },
    {
      name: "Etomidate",
      color: "gray",
      indications: "RSI (Rapid Sequence Intubation)",
      doses: [
        { label: "IV/IO", value: "0.2-0.4 mg/kg over 30-60 sec", max: "max 20 mg", calc: drugs ? `${(w * 0.2).toFixed(1)}-${(w * 0.4).toFixed(1)} mg` : null },
      ],
      notes: "Produces rapid sedation lasting 10-15 minutes."
    },
    {
      name: "Hydrocortisone",
      color: "orange",
      indications: "Adrenal insufficiency",
      doses: [
        { label: "IV bolus", value: "2 mg/kg", max: "max 100 mg", calc: drugs ? `${(w * 2).toFixed(0)} mg` : null },
      ],
      notes: ""
    },
    {
      name: "Ipratropium Bromide",
      color: "teal",
      indications: "Asthma",
      doses: [
        { label: "Inhalation", value: "250-500 mcg q20min PRN x3 doses" },
      ],
      notes: ""
    },
    {
      name: "Lidocaine",
      color: "gray",
      indications: "VF/pulseless VT, Wide-complex tachycardia (with pulses)",
      doses: [
        { label: "Bolus", value: "1 mg/kg IV/IO", calc: drugs ? `${drugs.lidocaine.bolus} mg` : null },
        { label: "Maintenance", value: "20-50 mcg/kg/min IV/IO infusion", calc: drugs ? `${drugs.lidocaine.infusionMin}-${drugs.lidocaine.infusionMax} mcg/min` : null },
        { label: "ETT", value: "2-3 mg/kg", calc: drugs ? `${(w * 2).toFixed(1)}-${(w * 3).toFixed(1)} mg` : null },
      ],
      notes: "Repeat bolus if infusion initiated >15 min after initial bolus."
    },
    {
      name: "Magnesium Sulfate",
      color: "pink",
      indications: "Torsades de pointes, Hypomagnesemia, Refractory status asthmaticus",
      doses: [
        { label: "Pulseless VT (Torsades)", value: "25-50 mg/kg IV/IO bolus", max: "max 2 g", calc: drugs ? `${(w * 25).toFixed(0)}-${(w * 50).toFixed(0)} mg` : null },
        { label: "VT with pulses", value: "25-50 mg/kg over 10-20 min", max: "max 2 g" },
        { label: "Status asthmaticus", value: "25-50 mg/kg slow infusion over 15-30 min", max: "max 2 g" },
      ],
      notes: "Rapid administration may cause hypotension. Monitor BP."
    },
    {
      name: "Methylprednisolone",
      color: "orange",
      indications: "Status asthmaticus, Anaphylactic shock",
      doses: [
        { label: "Loading", value: "2 mg/kg IV/IO/IM", max: "max 60 mg", calc: drugs ? `${(w * 2).toFixed(0)} mg` : null },
        { label: "Maintenance", value: "0.5 mg/kg IV/IO q6h", max: "max 120 mg/day", calc: drugs ? `${(w * 0.5).toFixed(1)} mg` : null },
      ],
      notes: "Only use acetate salt IM."
    },
    {
      name: "Milrinone",
      color: "pink",
      indications: "Myocardial dysfunction, Increased SVR/PVR",
      doses: [
        { label: "Loading", value: "50 mcg/kg IV/IO over 10-60 min", calc: drugs ? `${(w * 50).toFixed(0)} mcg` : null },
        { label: "Maintenance", value: "0.25-0.75 mcg/kg/min IV/IO infusion", calc: drugs ? `${(w * 0.25).toFixed(2)}-${(w * 0.75).toFixed(2)} mcg/min` : null },
      ],
      notes: ""
    },
    {
      name: "Naloxone",
      color: "purple",
      indications: "Narcotic (opiate) reversal",
      doses: [
        { label: "Overdose (full reversal)", value: "0.1 mg/kg IV/IO/IM/SC q2min PRN", max: "max 2 mg", calc: drugs ? `${(w * 0.1).toFixed(2)} mg` : null },
        { label: "Therapeutic reversal", value: "1-5 mcg/kg IV/IO/IM/SC, titrate", calc: drugs ? `${(w * 0.001).toFixed(3)}-${(w * 0.005).toFixed(3)} mg` : null },
        { label: "Maintenance", value: "0.002-0.16 mg/kg/hr IV/IO infusion" },
      ],
      notes: "Dosing varies by situation."
    },
    {
      name: "Nitroglycerin",
      color: "pink",
      indications: "Heart failure, Cardiogenic shock",
      doses: [
        { label: "Pediatric", value: "0.25-0.5 mcg/kg/min, titrate by 1 mcg/kg/min q15-20min", max: "max 10 mcg/kg/min", calc: drugs ? `Start ${(w * 0.25).toFixed(1)}-${(w * 0.5).toFixed(1)} mcg/min` : null },
        { label: "Adolescent", value: "Start 5-10 mcg/min (not per kg)", max: "max 200 mcg/min" },
      ],
      notes: "Typical range 1-5 mcg/kg/min."
    },
    {
      name: "Nitroprusside",
      color: "pink",
      indications: "Cardiogenic shock (high SVR), Severe hypertension",
      doses: [
        { label: "IV/IO", value: "0.3-1 mcg/kg/min initial, titrate up to 8 mcg/kg/min", calc: drugs ? `${(w * 0.3).toFixed(1)}-${(w * 1).toFixed(1)} mcg/min initial` : null },
      ],
      notes: ""
    },
    {
      name: "Norepinephrine",
      color: "red",
      indications: "Hypotensive (distributive) shock, Fluid refractory",
      doses: [
        { label: "IV/IO infusion", value: "0.1-2 mcg/kg/min", calc: drugs ? `${(w * 0.1).toFixed(1)}-${(w * 2).toFixed(1)} mcg/min` : null },
      ],
      notes: "Titrate to desired effect. For low SVR states."
    },
    {
      name: "Procainamide",
      color: "indigo",
      indications: "SVT, Atrial flutter, VT (with pulses)",
      doses: [
        { label: "IV/IO load", value: "15 mg/kg over 30-60 min", calc: drugs ? `${(w * 15).toFixed(0)} mg` : null },
      ],
      notes: "Do NOT use routinely with amiodarone. Monitor ECG - stop if QRS widens >50% or hypotension."
    },
    {
      name: "Prostaglandin E₁ (PGE₁)",
      color: "pink",
      indications: "Ductal-dependent congenital heart disease (all forms)",
      doses: [
        { label: "Initial", value: "0.05-0.1 mcg/kg/min IV/IO infusion", calc: drugs ? `${(w * 0.05).toFixed(2)}-${(w * 0.1).toFixed(2)} mcg/min` : null },
        { label: "Maintenance", value: "0.01-0.05 mcg/kg/min IV/IO", calc: drugs ? `${(w * 0.01).toFixed(2)}-${(w * 0.05).toFixed(2)} mcg/min` : null },
      ],
      notes: "May cause apnea, hypotension, fever."
    },
    {
      name: "Sodium Bicarbonate",
      color: "amber",
      indications: "Severe metabolic acidosis, Hyperkalemia, Na channel blocker OD (TCA)",
      doses: [
        { label: "Acidosis/Hyperkalemia", value: "1 mEq/kg IV/IO slow bolus", calc: drugs ? `${drugs.nahco3.dose} mEq` : null },
        { label: "TCA overdose", value: "1-2 mEq/kg IV/IO bolus until pH >7.45" },
      ],
      notes: "Ensure adequate ventilation. Do not mix with calcium."
    },
    {
      name: "Terbutaline",
      color: "teal",
      indications: "Status asthmaticus, Hyperkalemia",
      doses: [
        { label: "IV/IO infusion", value: "0.1-10 mcg/kg/min", calc: drugs ? `${(w * 0.1).toFixed(1)}-${(w * 10).toFixed(0)} mcg/min` : null },
        { label: "Loading (optional)", value: "10 mcg/kg IV/IO over 5 min", calc: drugs ? `${(w * 10).toFixed(0)} mcg` : null },
      ],
      notes: ""
    },
    {
      name: "Vasopressin",
      color: "indigo",
      indications: "Catecholamine-resistant hypotension",
      doses: [
        { label: "Continuous infusion", value: "0.0002-0.002 units/kg/min (0.2-2 milliunits/kg/min)", calc: drugs ? `${(w * 0.0002).toFixed(4)}-${(w * 0.002).toFixed(4)} units/min` : null },
      ],
      notes: ""
    },
  ];

  const colorMap = {
    red: "border-red-500",
    blue: "border-blue-500",
    purple: "border-purple-500",
    green: "border-green-500",
    amber: "border-amber-500",
    orange: "border-orange-500",
    pink: "border-pink-500",
    teal: "border-teal-500",
    gray: "border-gray-500",
    indigo: "border-indigo-500",
  };

  const textColorMap = {
    red: "text-red-700 dark:text-red-400",
    blue: "text-blue-700 dark:text-blue-400",
    purple: "text-purple-700 dark:text-purple-400",
    green: "text-green-700 dark:text-green-400",
    amber: "text-amber-700 dark:text-amber-400",
    orange: "text-orange-700 dark:text-orange-400",
    pink: "text-pink-700 dark:text-pink-400",
    teal: "text-teal-700 dark:text-teal-400",
    gray: "text-gray-700 dark:text-gray-400",
    indigo: "text-indigo-700 dark:text-indigo-400",
  };

  const filteredDrugs = allDrugs.filter(drug => 
    drug.name.toLowerCase().includes(drugSearch.toLowerCase()) ||
    drug.indications.toLowerCase().includes(drugSearch.toLowerCase())
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
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tab Navigation */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="cpr" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 text-xs">
            CPR
          </TabsTrigger>
          <TabsTrigger value="drugs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 text-xs">
            Drugs
          </TabsTrigger>
          <TabsTrigger value="recording" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 text-xs">
            Recording
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cpr" className="mt-4">
          <CardiacArrestFlowchart />
        </TabsContent>

        <TabsContent value="drugs" className="mt-4">
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search drugs or indications..."
                value={drugSearch}
                onChange={(e) => setDrugSearch(e.target.value)}
                className="pl-9"
              />
              {drugSearch && (
                <button 
                  onClick={() => setDrugSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Results count */}
            {drugSearch && (
              <p className="text-xs text-muted-foreground">
                Found {filteredDrugs.length} of {allDrugs.length} drugs
              </p>
            )}

            {/* No weight warning */}
            {!drugs && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-xs text-amber-700 dark:text-amber-400">Enter weight above to see calculated doses</p>
              </div>
            )}

            {/* Drug Cards */}
            {filteredDrugs.map((drug, idx) => (
              <Card key={drug.name} className={`nightingale-card border-l-4 ${colorMap[drug.color]}`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-base font-bold ${textColorMap[drug.color]}`}>{drug.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{drug.indications}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {drug.doses.map((dose, dIdx) => (
                    <div key={dIdx} className={dIdx > 0 ? "pt-2 border-t border-gray-200 dark:border-gray-700" : ""}>
                      <p className="font-semibold text-xs">{dose.label}:</p>
                      <p>{dose.value}</p>
                      {dose.max && <p className="text-xs text-muted-foreground">{dose.max}</p>}
                      {dose.calc && <p className={calcValue}>{dose.calc}</p>}
                    </div>
                  ))}
                  {drug.notes && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-muted-foreground">{drug.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* No results */}
            {filteredDrugs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No drugs found matching "{drugSearch}"</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recording" className="mt-4">
          <RecordingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CPRPage;
