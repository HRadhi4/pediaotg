import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const BallardScorePage = () => {
  const [neuromuscularScores, setNeuromuscularScores] = useState({
    posture: -1,
    squareWindow: -1,
    armRecoil: -1,
    poplitealAngle: -1,
    scarfSign: -1,
    heelToEar: -1
  });
  
  const [physicalScores, setPhysicalScores] = useState({
    skin: -1,
    lanugo: -1,
    plantarSurface: -1,
    breast: -1,
    eyeEar: -1,
    genitals: -1
  });

  // Neuromuscular maturity criteria with visual descriptions
  const neuromuscularCriteria = [
    {
      name: "posture",
      label: "Posture",
      options: [
        { score: -1, desc: "Arms & legs extended", visual: "Fully extended" },
        { score: 0, desc: "Slight flexion of hips & knees", visual: "Slight flex" },
        { score: 1, desc: "Moderate flexion of hips & knees", visual: "Moderate" },
        { score: 2, desc: "Legs flexed, arms extended", visual: "Legs flexed" },
        { score: 3, desc: "Full flexion of arms & legs", visual: "Full flexion" },
        { score: 4, desc: "Hypertonic flexion", visual: "Hypertonic" }
      ]
    },
    {
      name: "squareWindow",
      label: "Square Window (Wrist)",
      options: [
        { score: -1, desc: ">90°", visual: ">90°" },
        { score: 0, desc: "90°", visual: "90°" },
        { score: 1, desc: "60°", visual: "60°" },
        { score: 2, desc: "45°", visual: "45°" },
        { score: 3, desc: "30°", visual: "30°" },
        { score: 4, desc: "0°", visual: "0°" }
      ]
    },
    {
      name: "armRecoil",
      label: "Arm Recoil",
      options: [
        { score: -1, desc: "No recoil (180°)", visual: "180°" },
        { score: 0, desc: "Slow recoil (140-180°)", visual: "140-180°" },
        { score: 1, desc: "Slow recoil (110-140°)", visual: "110-140°" },
        { score: 2, desc: "Rapid recoil (90-110°)", visual: "90-110°" },
        { score: 3, desc: "Brisk recoil (<90°)", visual: "<90°" },
        { score: 4, desc: "Very brisk recoil", visual: "Very brisk" }
      ]
    },
    {
      name: "poplitealAngle",
      label: "Popliteal Angle",
      options: [
        { score: -1, desc: "180°", visual: "180°" },
        { score: 0, desc: "160°", visual: "160°" },
        { score: 1, desc: "140°", visual: "140°" },
        { score: 2, desc: "120°", visual: "120°" },
        { score: 3, desc: "100°", visual: "100°" },
        { score: 4, desc: "90°", visual: "90°" },
        { score: 5, desc: "<90°", visual: "<90°" }
      ]
    },
    {
      name: "scarfSign",
      label: "Scarf Sign",
      options: [
        { score: -1, desc: "Elbow past opposite axillary line", visual: "Past axilla" },
        { score: 0, desc: "Elbow at opposite axillary line", visual: "At axilla" },
        { score: 1, desc: "Elbow between midline & axilla", visual: "Mid-axilla" },
        { score: 2, desc: "Elbow at midline", visual: "Midline" },
        { score: 3, desc: "Elbow does not reach midline", visual: "Not midline" },
        { score: 4, desc: "Elbow at ipsilateral axilla", visual: "Same axilla" }
      ]
    },
    {
      name: "heelToEar",
      label: "Heel to Ear",
      options: [
        { score: -1, desc: "Heel touches ear easily", visual: "Easy touch" },
        { score: 0, desc: "Heel almost touches ear", visual: "Almost" },
        { score: 1, desc: "Heel approaches ear", visual: "Approaches" },
        { score: 2, desc: "Heel at nose level", visual: "Nose level" },
        { score: 3, desc: "Heel at chin level", visual: "Chin level" },
        { score: 4, desc: "Heel at chest level", visual: "Chest level" }
      ]
    }
  ];

  // Physical maturity criteria
  const physicalCriteria = [
    {
      name: "skin",
      label: "Skin",
      options: [
        { score: -1, desc: "Sticky, friable, transparent", visual: "Sticky" },
        { score: 0, desc: "Gelatinous, red, translucent", visual: "Gelatinous" },
        { score: 1, desc: "Smooth, pink, visible veins", visual: "Smooth pink" },
        { score: 2, desc: "Superficial peeling, few veins", visual: "Peeling" },
        { score: 3, desc: "Cracking, pale areas, rare veins", visual: "Cracking" },
        { score: 4, desc: "Parchment, deep cracking", visual: "Parchment" },
        { score: 5, desc: "Leathery, cracked, wrinkled", visual: "Leathery" }
      ]
    },
    {
      name: "lanugo",
      label: "Lanugo",
      options: [
        { score: -1, desc: "None", visual: "None" },
        { score: 0, desc: "Sparse", visual: "Sparse" },
        { score: 1, desc: "Abundant", visual: "Abundant" },
        { score: 2, desc: "Thinning", visual: "Thinning" },
        { score: 3, desc: "Bald areas", visual: "Bald areas" },
        { score: 4, desc: "Mostly bald", visual: "Mostly bald" }
      ]
    },
    {
      name: "plantarSurface",
      label: "Plantar Surface",
      options: [
        { score: -1, desc: "Heel-toe <40mm, no crease", visual: "<40mm" },
        { score: 0, desc: "Heel-toe 40-50mm, no crease", visual: "40-50mm" },
        { score: 1, desc: "Faint red marks", visual: "Faint marks" },
        { score: 2, desc: "Anterior transverse crease", visual: "Ant. crease" },
        { score: 3, desc: "Creases on anterior 2/3", visual: "2/3 creases" },
        { score: 4, desc: "Creases over entire sole", visual: "Full creases" }
      ]
    },
    {
      name: "breast",
      label: "Breast",
      options: [
        { score: -1, desc: "Imperceptible", visual: "Imperceptible" },
        { score: 0, desc: "Barely perceptible", visual: "Barely" },
        { score: 1, desc: "Flat areola, no bud", visual: "Flat, no bud" },
        { score: 2, desc: "Stippled areola, 1-2mm bud", visual: "1-2mm bud" },
        { score: 3, desc: "Raised areola, 3-4mm bud", visual: "3-4mm bud" },
        { score: 4, desc: "Full areola, 5-10mm bud", visual: "5-10mm bud" }
      ]
    },
    {
      name: "eyeEar",
      label: "Eye/Ear",
      options: [
        { score: -1, desc: "Lids fused loosely (-1) or tightly (-2)", visual: "Fused" },
        { score: 0, desc: "Lids open, pinna flat, stays folded", visual: "Flat pinna" },
        { score: 1, desc: "Slightly curved pinna, slow recoil", visual: "Slow recoil" },
        { score: 2, desc: "Well-curved pinna, soft, ready recoil", visual: "Ready recoil" },
        { score: 3, desc: "Formed & firm, instant recoil", visual: "Instant recoil" },
        { score: 4, desc: "Thick cartilage, ear stiff", visual: "Stiff" }
      ]
    },
    {
      name: "genitals",
      label: "Genitals (Male/Female)",
      options: [
        { score: -1, desc: "♂ Scrotum flat | ♀ Clitoris prominent", visual: "Immature" },
        { score: 0, desc: "♂ Scrotum empty | ♀ Labia flat", visual: "Very premature" },
        { score: 1, desc: "♂ Testes in upper canal | ♀ Prominent clitoris", visual: "Premature" },
        { score: 2, desc: "♂ Testes descending | ♀ Enlarging minora", visual: "Moderate" },
        { score: 3, desc: "♂ Testes down, good rugae | ♀ Majora & minora equal", visual: "Near term" },
        { score: 4, desc: "♂ Testes pendulous | ♀ Majora cover clitoris", visual: "Term" }
      ]
    }
  ];

  // Calculate total score
  const totalNeuromuscular = Object.values(neuromuscularScores).reduce((sum, val) => sum + (val >= 0 ? val : 0), 0);
  const totalPhysical = Object.values(physicalScores).reduce((sum, val) => sum + (val >= 0 ? val : 0), 0);
  const totalScore = totalNeuromuscular + totalPhysical;

  // Gestational age calculation based on Ballard score
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
    setNeuromuscularScores({
      posture: -1, squareWindow: -1, armRecoil: -1,
      poplitealAngle: -1, scarfSign: -1, heelToEar: -1
    });
    setPhysicalScores({
      skin: -1, lanugo: -1, plantarSurface: -1,
      breast: -1, eyeEar: -1, genitals: -1
    });
  };

  return (
    <div className="space-y-4 pt-4">
      {/* Instructions */}
      <Card className="rounded-2xl border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="p-4">
          <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">How to Use</h3>
          <p className="text-sm text-amber-600 dark:text-amber-300">
            Select the score for each criterion based on physical examination. The total score estimates gestational age.
          </p>
        </CardContent>
      </Card>

      {/* Neuromuscular Maturity */}
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
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                {criterion.options.map(opt => (
                  <button
                    key={opt.score}
                    onClick={() => setNeuromuscularScores(prev => ({ ...prev, [criterion.name]: opt.score }))}
                    className={`p-2 rounded-lg text-xs text-center transition-all ${
                      neuromuscularScores[criterion.name] === opt.score
                        ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-bold">{opt.score}</div>
                    <div className="text-[10px] leading-tight mt-1">{opt.visual}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Physical Maturity */}
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
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                {criterion.options.map(opt => (
                  <button
                    key={opt.score}
                    onClick={() => setPhysicalScores(prev => ({ ...prev, [criterion.name]: opt.score }))}
                    className={`p-2 rounded-lg text-xs text-center transition-all ${
                      physicalScores[criterion.name] === opt.score
                        ? 'bg-[#00d9c5] text-white ring-2 ring-[#00d9c5]/50'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-bold">{opt.score}</div>
                    <div className="text-[10px] leading-tight mt-1">{opt.visual}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
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

          <Button onClick={resetScores} variant="outline" className="w-full">
            Reset All Scores
          </Button>
        </CardContent>
      </Card>

      {/* Reference Table */}
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
