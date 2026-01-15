import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// SVG Diagram Components for Ballard Score
const PostureSVG = ({ score }) => {
  const diagrams = {
    0: <svg viewBox="0 0 60 40" className="w-full h-8"><line x1="30" y1="5" x2="30" y2="20" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="20" x2="15" y2="35" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="20" x2="45" y2="35" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="12" x2="10" y2="20" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="12" x2="50" y2="20" stroke="currentColor" strokeWidth="2"/><circle cx="30" cy="5" r="4" fill="currentColor"/></svg>,
    1: <svg viewBox="0 0 60 40" className="w-full h-8"><line x1="30" y1="5" x2="30" y2="20" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="20" x2="18" y2="32" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="20" x2="42" y2="32" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="12" x2="12" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="12" x2="48" y2="18" stroke="currentColor" strokeWidth="2"/><circle cx="30" cy="5" r="4" fill="currentColor"/></svg>,
    2: <svg viewBox="0 0 60 40" className="w-full h-8"><line x1="30" y1="5" x2="30" y2="20" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="20" x2="20" y2="28" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="20" x2="40" y2="28" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="12" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="12" x2="45" y2="15" stroke="currentColor" strokeWidth="2"/><circle cx="30" cy="5" r="4" fill="currentColor"/></svg>,
    3: <svg viewBox="0 0 60 40" className="w-full h-8"><line x1="30" y1="5" x2="30" y2="20" stroke="currentColor" strokeWidth="2"/><path d="M30 20 Q25 28 22 25" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M30 20 Q35 28 38 25" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="30" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="12" x2="42" y2="12" stroke="currentColor" strokeWidth="2"/><circle cx="30" cy="5" r="4" fill="currentColor"/></svg>,
    4: <svg viewBox="0 0 60 40" className="w-full h-8"><line x1="30" y1="5" x2="30" y2="18" stroke="currentColor" strokeWidth="2"/><path d="M30 18 Q22 26 24 22" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M30 18 Q38 26 36 22" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M30 12 Q20 14 22 10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M30 12 Q40 14 38 10" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="30" cy="5" r="4" fill="currentColor"/></svg>,
  };
  return diagrams[score] || diagrams[0];
};

const SquareWindowSVG = ({ score }) => {
  const angles = { '-1': 100, 0: 90, 1: 60, 2: 45, 3: 30, 4: 0 };
  const angle = angles[score] ?? 90;
  const rad = (angle * Math.PI) / 180;
  const handY = 25 - Math.cos(rad) * 15;
  const handX = 30 + Math.sin(rad) * 15;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <line x1="30" y1="35" x2="30" y2="25" stroke="currentColor" strokeWidth="3"/>
      <line x1="30" y1="25" x2={handX} y2={handY} stroke="currentColor" strokeWidth="2"/>
      <text x="45" y="20" fontSize="8" fill="currentColor">{angle}°</text>
    </svg>
  );
};

const ArmRecoilSVG = ({ score }) => {
  const angles = { 0: 180, 1: 140, 2: 110, 3: 90, 4: 70 };
  const angle = angles[score] ?? 180;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <line x1="30" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="15" y1="20" x2={15 + Math.cos((180-angle/2)*Math.PI/180)*12} y2={20 - Math.sin((180-angle/2)*Math.PI/180)*12} stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="20" x2="45" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="45" y1="20" x2={45 - Math.cos((180-angle/2)*Math.PI/180)*12} y2={20 - Math.sin((180-angle/2)*Math.PI/180)*12} stroke="currentColor" strokeWidth="2"/>
      <circle cx="30" cy="20" r="3" fill="currentColor"/>
    </svg>
  );
};

const PoplitealAngleSVG = ({ score }) => {
  const angles = { '-1': 180, 0: 160, 1: 140, 2: 120, 3: 100, 4: 90, 5: 80 };
  const angle = angles[score] ?? 180;
  const rad = ((180 - angle) * Math.PI) / 180;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <line x1="15" y1="35" x2="30" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="20" x2={30 + Math.cos(rad)*18} y2={20 - Math.sin(rad)*18} stroke="currentColor" strokeWidth="2"/>
      <circle cx="30" cy="20" r="2" fill="currentColor"/>
      <text x="42" y="35" fontSize="7" fill="currentColor">{angle}°</text>
    </svg>
  );
};

const ScarfSignSVG = ({ score }) => {
  const positions = { '-1': 50, 0: 42, 1: 35, 2: 30, 3: 25, 4: 18 };
  const elbowX = positions[score] ?? 30;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <ellipse cx="30" cy="22" rx="12" ry="15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="30" cy="8" r="5" fill="currentColor"/>
      <line x1="18" y1="18" x2={elbowX} y2="18" stroke="currentColor" strokeWidth="2"/>
      <line x1="18" y1="18" x2="18" y2="30" stroke="currentColor" strokeWidth="2"/>
      <line x1="42" y1="18" x2="42" y2="30" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="8" x2="30" y2="5" stroke="currentColor" strokeWidth="1" strokeDasharray="1"/>
    </svg>
  );
};

const HeelToEarSVG = ({ score }) => {
  const heelY = { '-1': 8, 0: 12, 1: 16, 2: 20, 3: 26, 4: 32 };
  const y = heelY[score] ?? 20;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <ellipse cx="30" cy="25" rx="10" ry="12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="30" cy="10" r="4" fill="currentColor"/>
      <path d={`M38 30 Q45 ${y} 35 ${y}`} stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="35" cy={y} r="2" fill="currentColor"/>
    </svg>
  );
};

// Physical Maturity SVG Diagrams
const SkinSVG = ({ score }) => {
  const patterns = {
    '-1': { opacity: 0.2, lines: 0, color: '#ef4444' },
    0: { opacity: 0.3, lines: 0, color: '#f97316' },
    1: { opacity: 0.5, lines: 1, color: '#fbbf24' },
    2: { opacity: 0.6, lines: 2, color: '#84cc16' },
    3: { opacity: 0.7, lines: 3, color: '#22c55e' },
    4: { opacity: 0.85, lines: 4, color: '#06b6d4' },
    5: { opacity: 1, lines: 5, color: '#6366f1' }
  };
  const p = patterns[score] || patterns[0];
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <rect x="10" y="5" width="40" height="30" rx="4" fill={p.color} fillOpacity={p.opacity} stroke="currentColor" strokeWidth="1"/>
      {[...Array(p.lines)].map((_, i) => (
        <line key={i} x1={15 + i*8} y1="10" x2={15 + i*8} y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2"/>
      ))}
    </svg>
  );
};

const LanugoSVG = ({ score }) => {
  const density = { '-1': 0, 0: 2, 1: 6, 2: 4, 3: 2, 4: 1 };
  const d = density[score] ?? 3;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <ellipse cx="30" cy="20" rx="18" ry="14" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      {[...Array(d)].map((_, i) => (
        <path key={i} d={`M${20 + i*6} 12 Q${22 + i*6} 8 ${24 + i*6} 12`} stroke="currentColor" strokeWidth="1" fill="none"/>
      ))}
    </svg>
  );
};

const PlantarSurfaceSVG = ({ score }) => {
  const creases = { '-1': 0, 0: 0, 1: 1, 2: 2, 3: 3, 4: 5 };
  const c = creases[score] ?? 0;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <ellipse cx="30" cy="22" rx="12" ry="16" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <ellipse cx="30" cy="6" rx="8" ry="4" fill="none" stroke="currentColor" strokeWidth="1"/>
      {[...Array(c)].map((_, i) => (
        <line key={i} x1="22" y1={14 + i*5} x2="38" y2={14 + i*5} stroke="currentColor" strokeWidth="1"/>
      ))}
    </svg>
  );
};

const BreastSVG = ({ score }) => {
  const sizes = { '-1': 0, 0: 1, 1: 2, 2: 3, 3: 5, 4: 7 };
  const s = sizes[score] ?? 2;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <circle cx="30" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="30" cy="20" r={s} fill="currentColor" fillOpacity="0.5"/>
      {s > 2 && <circle cx="30" cy="20" r={s-1} fill="currentColor"/>}
    </svg>
  );
};

const EyeEarSVG = ({ score }) => {
  const curves = { '-1': 0, 0: 2, 1: 4, 2: 6, 3: 8, 4: 10 };
  const c = curves[score] ?? 4;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <path d={`M25 10 Q${15+c} 20 25 30 Q${35-c/2} 20 25 10`} fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="40" cy="20" rx="8" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      {score >= 0 && <circle cx="40" cy="20" r="3" fill="currentColor"/>}
    </svg>
  );
};

const GenitalsSVG = ({ score }) => {
  const levels = { '-1': 1, 0: 2, 1: 3, 2: 4, 3: 5, 4: 6 };
  const l = levels[score] ?? 3;
  return (
    <svg viewBox="0 0 60 40" className="w-full h-8">
      <rect x="20" y="30" width="20" height="4" fill="currentColor" fillOpacity="0.3"/>
      {[...Array(l)].map((_, i) => (
        <rect key={i} x={25 - i*2} y={28 - i*4} width={10 + i*4} height="3" rx="1" fill="currentColor" fillOpacity={0.2 + i*0.12}/>
      ))}
    </svg>
  );
};

const BallardScorePage = () => {
  const [neuromuscularScores, setNeuromuscularScores] = useState({
    posture: 0, squareWindow: -1, armRecoil: 0,
    poplitealAngle: -1, scarfSign: -1, heelToEar: -1
  });
  
  const [physicalScores, setPhysicalScores] = useState({
    skin: -1, lanugo: -1, plantarSurface: -1,
    breast: -1, eyeEar: -1, genitals: -1
  });

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderNeuromuscularDiagram = (criterionName, score) => {
    switch(criterionName) {
      case 'posture': return <PostureSVG score={score} />;
      case 'squareWindow': return <SquareWindowSVG score={score} />;
      case 'armRecoil': return <ArmRecoilSVG score={score} />;
      case 'poplitealAngle': return <PoplitealAngleSVG score={score} />;
      case 'scarfSign': return <ScarfSignSVG score={score} />;
      case 'heelToEar': return <HeelToEarSVG score={score} />;
      default: return null;
    }
  };

  const renderPhysicalDiagram = (criterionName, score) => {
    switch(criterionName) {
      case 'skin': return <SkinSVG score={score} />;
      case 'lanugo': return <LanugoSVG score={score} />;
      case 'plantarSurface': return <PlantarSurfaceSVG score={score} />;
      case 'breast': return <BreastSVG score={score} />;
      case 'eyeEar': return <EyeEarSVG score={score} />;
      case 'genitals': return <GenitalsSVG score={score} />;
      default: return null;
    }
  };

  const neuromuscularCriteria = [
    { name: "posture", label: "Posture", options: [
      { score: 0, desc: "Arms & legs extended" }, { score: 1, desc: "Slight flexion" },
      { score: 2, desc: "Moderate flexion" }, { score: 3, desc: "Legs flexed, arms extended" },
      { score: 4, desc: "Full flexion" }
    ]},
    { name: "squareWindow", label: "Square Window (Wrist)", options: [
      { score: -1, desc: ">90°" }, { score: 0, desc: "90°" }, { score: 1, desc: "60°" },
      { score: 2, desc: "45°" }, { score: 3, desc: "30°" }, { score: 4, desc: "0°" }
    ]},
    { name: "armRecoil", label: "Arm Recoil", options: [
      { score: 0, desc: "180°" }, { score: 1, desc: "140-180°" }, { score: 2, desc: "110-140°" },
      { score: 3, desc: "90-110°" }, { score: 4, desc: "<90°" }
    ]},
    { name: "poplitealAngle", label: "Popliteal Angle", options: [
      { score: -1, desc: "180°" }, { score: 0, desc: "160°" }, { score: 1, desc: "140°" },
      { score: 2, desc: "120°" }, { score: 3, desc: "100°" }, { score: 4, desc: "90°" }, { score: 5, desc: "<90°" }
    ]},
    { name: "scarfSign", label: "Scarf Sign", options: [
      { score: -1, desc: "Past axilla" }, { score: 0, desc: "At axilla" }, { score: 1, desc: "Mid-axilla" },
      { score: 2, desc: "Midline" }, { score: 3, desc: "Not midline" }, { score: 4, desc: "Same side" }
    ]},
    { name: "heelToEar", label: "Heel to Ear", options: [
      { score: -1, desc: "Touches ear" }, { score: 0, desc: "Near ear" }, { score: 1, desc: "Approaches" },
      { score: 2, desc: "Nose level" }, { score: 3, desc: "Chin level" }, { score: 4, desc: "Chest level" }
    ]}
  ];

  const physicalCriteria = [
    { name: "skin", label: "Skin", options: [
      { score: -1, desc: "Sticky, transparent" }, { score: 0, desc: "Gelatinous, red" },
      { score: 1, desc: "Smooth, pink" }, { score: 2, desc: "Peeling, few veins" },
      { score: 3, desc: "Cracking, pale" }, { score: 4, desc: "Parchment" }, { score: 5, desc: "Leathery" }
    ]},
    { name: "lanugo", label: "Lanugo", options: [
      { score: -1, desc: "None" }, { score: 0, desc: "Sparse" }, { score: 1, desc: "Abundant" },
      { score: 2, desc: "Thinning" }, { score: 3, desc: "Bald areas" }, { score: 4, desc: "Mostly bald" }
    ]},
    { name: "plantarSurface", label: "Plantar Surface", options: [
      { score: -1, desc: "<40mm" }, { score: 0, desc: "40-50mm, no crease" }, { score: 1, desc: "Faint marks" },
      { score: 2, desc: "Ant. crease" }, { score: 3, desc: "2/3 creases" }, { score: 4, desc: "Full creases" }
    ]},
    { name: "breast", label: "Breast", options: [
      { score: -1, desc: "Imperceptible" }, { score: 0, desc: "Barely visible" }, { score: 1, desc: "Flat, no bud" },
      { score: 2, desc: "1-2mm bud" }, { score: 3, desc: "3-4mm bud" }, { score: 4, desc: "5-10mm bud" }
    ]},
    { name: "eyeEar", label: "Eye/Ear", options: [
      { score: -1, desc: "Lids fused" }, { score: 0, desc: "Flat pinna" }, { score: 1, desc: "Slow recoil" },
      { score: 2, desc: "Ready recoil" }, { score: 3, desc: "Instant recoil" }, { score: 4, desc: "Stiff cartilage" }
    ]},
    { name: "genitals", label: "Genitals", options: [
      { score: -1, desc: "Flat/Prominent" }, { score: 0, desc: "Empty/Labia flat" }, { score: 1, desc: "Upper canal" },
      { score: 2, desc: "Descending" }, { score: 3, desc: "Down/Equal" }, { score: 4, desc: "Pendulous/Covered" }
    ]}
  ];

  const totalNeuromuscular = Object.values(neuromuscularScores).reduce((sum, val) => sum + (val >= 0 ? val : 0), 0);
  const totalPhysical = Object.values(physicalScores).reduce((sum, val) => sum + (val >= 0 ? val : 0), 0);
  const totalScore = totalNeuromuscular + totalPhysical;

  const getGestationalAge = (score) => {
    if (score <= -10) return { weeks: 20, interpretation: "Extremely premature" };
    if (score <= -5) return { weeks: 22, interpretation: "Extremely premature" };
    if (score <= 0) return { weeks: 24, interpretation: "Extremely premature" };
    if (score <= 5) return { weeks: 26, interpretation: "Very premature" };
    if (score <= 10) return { weeks: 28, interpretation: "Very premature" };
    if (score <= 15) return { weeks: 30, interpretation: "Moderately premature" };
    if (score <= 20) return { weeks: 32, interpretation: "Moderately premature" };
    if (score <= 25) return { weeks: 34, interpretation: "Late preterm" };
    if (score <= 30) return { weeks: 36, interpretation: "Late preterm" };
    if (score <= 35) return { weeks: 38, interpretation: "Term" };
    if (score <= 40) return { weeks: 40, interpretation: "Term" };
    if (score <= 45) return { weeks: 42, interpretation: "Post-term" };
    return { weeks: 44, interpretation: "Post-term" };
  };

  const gestationalAge = getGestationalAge(totalScore);

  const resetScores = () => {
    setNeuromuscularScores({ posture: 0, squareWindow: -1, armRecoil: 0, poplitealAngle: -1, scarfSign: -1, heelToEar: -1 });
    setPhysicalScores({ skin: -1, lanugo: -1, plantarSurface: -1, breast: -1, eyeEar: -1, genitals: -1 });
  };

  return (
    <div className="space-y-4 pt-4">
      <Card className="rounded-2xl border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="p-4">
          <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">How to Use</h3>
          <p className="text-sm text-amber-600 dark:text-amber-300">
            Select the score for each criterion based on physical examination. The total score estimates gestational age.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Neuromuscular Maturity
            <span className="text-sm font-normal text-muted-foreground">(Score: {totalNeuromuscular})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {neuromuscularCriteria.map(criterion => (
            <div key={criterion.name} className="space-y-2">
              <Label className="text-sm font-medium">{criterion.label}</Label>
              <div className="flex gap-1.5 overflow-x-auto pb-2">
                {criterion.options.map(opt => (
                  <button
                    key={opt.score}
                    onClick={() => setNeuromuscularScores(prev => ({ ...prev, [criterion.name]: opt.score }))}
                    className={`flex-shrink-0 w-[80px] p-1.5 rounded-lg text-center transition-all border ${
                      neuromuscularScores[criterion.name] === opt.score
                        ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="h-9 flex items-center justify-center text-current">
                      {renderNeuromuscularDiagram(criterion.name, opt.score)}
                    </div>
                    <div className="font-bold text-xs">{opt.score}</div>
                    <div className="text-[8px] leading-tight text-muted-foreground mt-0.5 min-h-[24px] flex items-center justify-center px-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Physical Maturity
            <span className="text-sm font-normal text-muted-foreground">(Score: {totalPhysical})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {physicalCriteria.map(criterion => (
            <div key={criterion.name} className="space-y-2">
              <Label className="text-sm font-medium">{criterion.label}</Label>
              <div className="flex gap-1.5 overflow-x-auto pb-2">
                {criterion.options.map(opt => (
                  <button
                    key={opt.score}
                    onClick={() => setPhysicalScores(prev => ({ ...prev, [criterion.name]: opt.score }))}
                    className={`flex-shrink-0 w-[80px] p-1.5 rounded-lg text-center transition-all border ${
                      physicalScores[criterion.name] === opt.score
                        ? 'bg-[#00d9c5] text-white border-[#00b8a6] ring-2 ring-[#00d9c5]/50'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#00d9c5]'
                    }`}
                  >
                    <div className="h-9 flex items-center justify-center text-current">
                      {renderPhysicalDiagram(criterion.name, opt.score)}
                    </div>
                    <div className="font-bold text-xs">{opt.score}</div>
                    <div className="text-[8px] leading-tight text-muted-foreground mt-0.5 min-h-[24px] flex items-center justify-center px-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-2 border-[#00d9c5] bg-gradient-to-br from-[#00d9c5]/10 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <div className="text-2xl font-bold text-amber-600">{totalNeuromuscular}</div>
              <div className="text-xs text-muted-foreground">Neuromuscular</div>
            </div>
            <div className="p-3 rounded-xl bg-[#00d9c5]/20">
              <div className="text-2xl font-bold text-[#00d9c5]">{totalPhysical}</div>
              <div className="text-xs text-muted-foreground">Physical</div>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <div className="text-2xl font-bold text-purple-600">{totalScore}</div>
              <div className="text-xs text-muted-foreground">Total Score</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00d9c5]">{gestationalAge.weeks} weeks</div>
              <div className="text-lg font-medium text-foreground mt-1">Estimated Gestational Age</div>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                gestationalAge.interpretation === "Term" ? "bg-green-100 text-green-700" :
                gestationalAge.interpretation === "Late preterm" ? "bg-yellow-100 text-yellow-700" :
                gestationalAge.interpretation === "Moderately premature" ? "bg-orange-100 text-orange-700" :
                gestationalAge.interpretation === "Very premature" ? "bg-red-100 text-red-700" :
                gestationalAge.interpretation === "Extremely premature" ? "bg-red-200 text-red-800" :
                "bg-blue-100 text-blue-700"
              }`}>
                {gestationalAge.interpretation}
              </div>
            </div>
          </div>

          <Button onClick={resetScores} variant="outline" className="w-full">Reset All Scores</Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Score to Gestational Age Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center text-xs">
            {[
              { score: "-10", weeks: "20" }, { score: "-5", weeks: "22" },
              { score: "0", weeks: "24" }, { score: "5", weeks: "26" },
              { score: "10", weeks: "28" }, { score: "15", weeks: "30" },
              { score: "20", weeks: "32" }, { score: "25", weeks: "34" },
              { score: "30", weeks: "36" }, { score: "35", weeks: "38" },
              { score: "40", weeks: "40" }, { score: "45", weeks: "42" }
            ].map(item => (
              <div key={item.score} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="font-bold">{item.score}</div>
                <div className="text-muted-foreground">{item.weeks}w</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BallardScorePage;
