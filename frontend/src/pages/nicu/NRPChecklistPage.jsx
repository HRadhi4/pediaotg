import React, { useState } from "react";
import { Clock, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NRPChecklistPage = () => {
  const [expandedSections, setExpandedSections] = useState(["initial"]);
  const [checkedItems, setCheckedItems] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const startTimer = (seconds, label) => {
    setActiveTimer(label);
    setTimerSeconds(seconds);
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveTimer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetChecklist = () => {
    setCheckedItems({});
    setActiveTimer(null);
    setTimerSeconds(0);
  };

  const sections = [
    {
      id: "initial",
      title: "Initial Assessment",
      color: "blue",
      items: [
        { id: "term", label: "Term?" },
        { id: "tone", label: "Good tone?" },
        { id: "crying", label: "Breathing or crying?" },
      ],
      note: "If YES to all: Routine care with mother"
    },
    {
      id: "golden",
      title: "Golden Minute (First 60s)",
      color: "amber",
      items: [
        { id: "warm", label: "Warm and maintain temperature" },
        { id: "position", label: "Position airway" },
        { id: "clear", label: "Clear secretions if needed" },
        { id: "dry", label: "Dry" },
        { id: "stimulate", label: "Stimulate" },
      ]
    },
    {
      id: "apnea",
      title: "Apnea/Gasping or HR < 100",
      color: "red",
      items: [
        { id: "ppv", label: "Start PPV (21% O2, term | 21-30% preterm)" },
        { id: "spo2", label: "Apply SpO2 monitor" },
        { id: "ecg", label: "Consider ECG monitor" },
      ],
      timer: { seconds: 15, label: "PPV for 15s" }
    },
    {
      id: "mrsopa",
      title: "MR. SOPA (Ventilation Corrective)",
      color: "purple",
      items: [
        { id: "mask", label: "M - Mask Adjust" },
        { id: "reposition", label: "R - Reposition Airway" },
        { id: "suction", label: "S - Suction mouth then nose" },
        { id: "open", label: "O - Open mouth" },
        { id: "pressure", label: "P - Pressure increase" },
        { id: "alternate", label: "A - Alternate: LMA/ETT (NG first)" },
      ],
      note: "Use if no chest rise with PPV"
    },
    {
      id: "hr60",
      title: "HR < 60 (After 30s Good PPV)",
      color: "red",
      items: [
        { id: "intubate", label: "Intubate if not already done" },
        { id: "compress", label: "Start chest compressions (3:1 ratio)" },
        { id: "100o2", label: "Increase to 100% O2" },
        { id: "uvc", label: "Consider emergency UVC" },
      ],
      timer: { seconds: 60, label: "Compressions 60s" }
    },
    {
      id: "epi",
      title: "Epinephrine (HR still < 60)",
      color: "red",
      items: [
        { id: "epi_iv", label: "IV: 0.01 mg/kg (0.1 ml/kg of 1:10,000)" },
        { id: "epi_ett", label: "ETT: 0.1 mg/kg (may repeat q3-5min)" },
        { id: "hypo", label: "Consider hypovolemia" },
        { id: "pneumo", label: "Consider pneumothorax" },
      ]
    }
  ];

  const references = [
    { title: "Compressions", items: ["Thumbs on sternum", "1/3 chest diameter", "3 Comp : 1 Vent", '"1 and 2 and 3 and bag"'] },
    { title: "Ventilation Settings", items: ["Flow Rate: 10L", "FiO2: 21% (preterm 21-30%)", "PEEP: 5", "PIP: Max 40", "Rate: 40-60/min"] },
    { title: "SpO2 Targets", items: ["1 min: 60-65%", "2 min: 65-70%", "3 min: 70-75%", "5 min: 80-85%", "10 min: 85-95%"] },
    { title: "Post-Resus STABLE", items: ["Sugar: 4-6 mmol/L", "Temp: 36.5-37.5°C", "Airway: Patent", "BP: Monitor", "Labs: CO2 45-55", "Emotional support"] }
  ];

  return (
    <div className="space-y-4 pt-4">
      {/* Timer Display */}
      {activeTimer && (
        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-500" />
            <span className="font-bold text-red-700 dark:text-red-300">{activeTimer}</span>
          </div>
          <span className="text-2xl font-mono font-bold text-red-600">{timerSeconds}s</span>
        </div>
      )}

      <div className="space-y-3 pb-4">
        {sections.map((section) => (
          <Card key={section.id} className={`rounded-xl border-${section.color}-200 overflow-hidden`}>
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full p-3 flex items-center justify-between hover:opacity-80`}
              style={{ 
                backgroundColor: section.color === 'red' ? 'rgba(239,68,68,0.1)' : 
                                section.color === 'amber' ? 'rgba(245,158,11,0.1)' :
                                section.color === 'purple' ? 'rgba(168,85,247,0.1)' :
                                'rgba(59,130,246,0.1)'
              }}
            >
              <span className="font-semibold text-sm">{section.title}</span>
              {expandedSections.includes(section.id) ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </button>
            
            {expandedSections.includes(section.id) && (
              <CardContent className="pt-3 space-y-2">
                {section.items.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      checkedItems[item.id] 
                        ? 'bg-green-100 dark:bg-green-950/30' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      checkedItems[item.id] 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {checkedItems[item.id] && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className={`text-sm ${checkedItems[item.id] ? 'line-through text-muted-foreground' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
                
                {section.note && (
                  <p className="text-xs text-muted-foreground italic pt-2 border-t">
                    Note: {section.note}
                  </p>
                )}
                
                {section.timer && (
                  <Button 
                    onClick={() => startTimer(section.timer.seconds, section.timer.label)}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 rounded-xl"
                    disabled={activeTimer !== null}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Start Timer: {section.timer.label}
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        ))}

        {/* Quick Reference */}
        <Card className="nightingale-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {references.map((ref, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <p className="font-bold text-[#00d9c5]">{ref.title}</p>
                {ref.items.map((item, i) => (
                  <p key={i} className="text-muted-foreground">• {item}</p>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="pt-3 border-t">
        <Button variant="outline" onClick={resetChecklist} className="w-full rounded-xl">
          Reset Checklist
        </Button>
      </div>
    </div>
  );
};

export default NRPChecklistPage;
