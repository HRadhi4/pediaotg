import React, { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const FluidCalculatorPage = () => {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gestationalAge, setGestationalAge] = useState("");
  const [tfi, setTfi] = useState("");
  
  // NaCl
  const [naclAmount, setNaclAmount] = useState("");
  
  // Feed
  const [feedVolume, setFeedVolume] = useState("");
  const [feedFrequency, setFeedFrequency] = useState("2");
  const [feedType, setFeedType] = useState("ebm");
  
  // TPN
  const [aminoGrams, setAminoGrams] = useState("");
  const [lipidGrams, setLipidGrams] = useState("");
  
  // Combined Dextrose
  const [useCombinedDextrose, setUseCombinedDextrose] = useState(false);
  const [dextroseItems, setDextroseItems] = useState([
    { id: 1, type: "D10", percentage: 10, volume: "" }
  ]);

  const dextroseOptions = [
    { type: "D5", percentage: 5 },
    { type: "D10", percentage: 10 },
    { type: "D12.5", percentage: 12.5 },
    { type: "D15", percentage: 15 },
    { type: "D20", percentage: 20 },
    { type: "D50", percentage: 50 }
  ];

  const getTfiSuggestion = () => {
    const ageNum = parseInt(age) || 0;
    if (ageNum <= 1) return "60-80";
    if (ageNum <= 2) return "80-100";
    if (ageNum <= 3) return "100-120";
    if (ageNum <= 7) return "120-150";
    return "150-180";
  };

  const addDextroseItem = () => {
    const newId = Math.max(...dextroseItems.map(d => d.id), 0) + 1;
    setDextroseItems([...dextroseItems, { id: newId, type: "D10", percentage: 10, volume: "" }]);
  };

  const removeDextroseItem = (id) => {
    if (dextroseItems.length > 1) {
      setDextroseItems(dextroseItems.filter(d => d.id !== id));
    }
  };

  const updateDextroseItem = (id, field, value) => {
    setDextroseItems(dextroseItems.map(d => {
      if (d.id === id) {
        if (field === "type") {
          const opt = dextroseOptions.find(o => o.type === value);
          return { ...d, type: value, percentage: opt?.percentage || 10 };
        }
        return { ...d, [field]: value };
      }
      return d;
    }));
  };

  const calculateResults = () => {
    const w = parseFloat(weight) || 0;
    const tfiNum = parseFloat(tfi) || 0;
    const naclNum = parseFloat(naclAmount) || 0;
    const feedVol = parseFloat(feedVolume) || 0;
    const feedFreq = parseInt(feedFrequency) || 2;
    const aminoG = parseFloat(aminoGrams) || 0;
    const lipidG = parseFloat(lipidGrams) || 0;

    const totalFluid24hr = tfiNum * w;
    const nacl24hr = naclNum * w;
    
    const feedsPerDay = 24 / feedFreq;
    const feed24hr = feedVol * feedsPerDay;
    const feedPerKg = w > 0 ? feed24hr / w : 0;
    
    const feedCaloriesPerMl = feedType === "ebm" ? 0.67 : 0.8;
    const feedCalories24hr = feed24hr * feedCaloriesPerMl;
    const feedCaloriesPerKg = w > 0 ? feedCalories24hr / w : 0;
    
    const amino24hr = aminoG * w * 10;
    const lipid24hr = lipidG * w * 5;
    const tpn24hr = amino24hr + lipid24hr;
    
    let dextrose24hr = 0;
    let dextroseBreakdown = [];
    
    if (useCombinedDextrose) {
      dextroseItems.forEach(item => {
        const vol = parseFloat(item.volume) || 0;
        dextrose24hr += vol;
        if (vol > 0) {
          dextroseBreakdown.push({
            type: item.type,
            percentage: item.percentage,
            volume: vol
          });
        }
      });
    } else {
      const totalDeductions = nacl24hr + feed24hr + tpn24hr;
      dextrose24hr = Math.max(0, totalFluid24hr - totalDeductions);
      dextroseBreakdown = [{ type: "D10", percentage: 10, volume: dextrose24hr }];
    }
    
    const totalUsed = nacl24hr + feed24hr + tpn24hr + dextrose24hr;
    const remaining = totalFluid24hr - totalUsed;
    const hourlyRate = totalFluid24hr / 24;

    let dextroseCalories24hr = 0;
    let totalDextroseGrams = 0;
    dextroseBreakdown.forEach(dex => {
      const dextroseGrams = (dex.percentage / 100) * dex.volume;
      totalDextroseGrams += dextroseGrams;
      dextroseCalories24hr += dextroseGrams * 3.4;
    });
    const dextroseCaloriesPerKg = w > 0 ? dextroseCalories24hr / w : 0;

    const aminoCalories24hr = amino24hr * 0.1 * 4;
    const lipidCalories24hr = lipid24hr * 2;
    const tpnCalories24hr = aminoCalories24hr + lipidCalories24hr;
    const tpnCaloriesPerKg = w > 0 ? tpnCalories24hr / w : 0;

    const totalCalories24hr = dextroseCalories24hr + feedCalories24hr + tpnCalories24hr;
    const totalCaloriesPerKg = w > 0 ? totalCalories24hr / w : 0;

    const girWithoutFeed = w > 0 ? (totalDextroseGrams * 1000) / (w * 1440) : 0;
    
    const feedGlucoseGrams = feed24hr * 0.07;
    const totalGlucoseGrams = totalDextroseGrams + feedGlucoseGrams;
    const girWithFeed = w > 0 ? (totalGlucoseGrams * 1000) / (w * 1440) : 0;

    return {
      weight: w,
      tfi: tfiNum,
      totalFluid24hr: totalFluid24hr.toFixed(1),
      hourlyRate: hourlyRate.toFixed(2),
      nacl24hr: nacl24hr.toFixed(1),
      naclPerKg: naclNum,
      feedVol,
      feedFreq,
      feedType,
      feed24hr: feed24hr.toFixed(1),
      feedPerKg: feedPerKg.toFixed(1),
      feedCalories24hr: feedCalories24hr.toFixed(1),
      feedCaloriesPerKg: feedCaloriesPerKg.toFixed(1),
      aminoG,
      amino24hr: amino24hr.toFixed(1),
      lipidG,
      lipid24hr: lipid24hr.toFixed(1),
      tpn24hr: tpn24hr.toFixed(1),
      tpnCalories24hr: tpnCalories24hr.toFixed(1),
      tpnCaloriesPerKg: tpnCaloriesPerKg.toFixed(1),
      dextroseBreakdown,
      dextrose24hr: dextrose24hr.toFixed(1),
      dextroseCalories24hr: dextroseCalories24hr.toFixed(1),
      dextroseCaloriesPerKg: dextroseCaloriesPerKg.toFixed(1),
      totalCalories24hr: totalCalories24hr.toFixed(1),
      totalCaloriesPerKg: totalCaloriesPerKg.toFixed(1),
      remaining: remaining.toFixed(1),
      isOverLimit: remaining < -0.1,
      useCombinedDextrose,
      girWithoutFeed: girWithoutFeed.toFixed(2),
      girWithFeed: girWithFeed.toFixed(2),
      hasFeed: feed24hr > 0
    };
  };

  const results = calculateResults();

  return (
    <div className="space-y-4 pt-4">
      {/* Patient Info */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Weight (kg)</Label>
              <Input type="text" step="0.01" placeholder="0.8" value={weight} onChange={(e) => setWeight(e.target.value)} className="nightingale-input font-mono h-9" />
              inputMode="text"
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Age (days)</Label>
              <Input type="text" placeholder="3" value={age} onChange={(e) => setAge(e.target.value)} className="nightingale-input font-mono h-9" />
              inputMode="text"
            </div>
            <div className="space-y-1">
              <Label className="text-xs">GA (weeks)</Label>
              <Input type="text" placeholder="32" value={gestationalAge} onChange={(e) => setGestationalAge(e.target.value)} className="nightingale-input font-mono h-9" />
              inputMode="text"
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TFI */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">TFI (ml/kg/day)</Label>
            <Input type="text" placeholder="140" value={tfi} onChange={(e) => setTfi(e.target.value)} className="nightingale-input font-mono" />
            inputMode="text"
            {age && <p className="text-xs text-muted-foreground">Suggested: <span className="text-[#00d9c5] font-mono">{getTfiSuggestion()}</span></p>}
          </div>
        </CardContent>
      </Card>

      {/* Combined Dextrose Option */}
      <Card className="nightingale-card">
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="useCombinedDex"
              checked={useCombinedDextrose}
              onCheckedChange={setUseCombinedDextrose}
            />
            <Label htmlFor="useCombinedDex" className="cursor-pointer font-medium text-sm">
              Combined Dextrose (Multiple Sugar Fluids)
            </Label>
          </div>
          
          {useCombinedDextrose && (
            <div className="space-y-2 pt-2">
              {dextroseItems.map((item) => (
                <div key={item.id} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">{item.type}</Label>
                    <select
                      value={item.type}
                      onChange={(e) => updateDextroseItem(item.id, "type", e.target.value)}
                      className="w-full h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm"
                    >
                      {dextroseOptions.map(opt => (
                        <option key={opt.type} value={opt.type}>{opt.type} ({opt.percentage}%)</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Volume (ml/24hr)</Label>
                    <Input
                      type="text"
                  inputMode="text"
                      placeholder="e.g., 50"
                      value={item.volume}
                      onChange={(e) => updateDextroseItem(item.id, "volume", e.target.value)}
                      className="nightingale-input font-mono h-9"
                    />
                  </div>
                  {dextroseItems.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDextroseItem(item.id)}
                      className="h-9 w-9 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addDextroseItem} className="w-full rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Dextrose Type
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additives */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Additives & Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">3% NaCl (ml/kg/day)</Label>
            <Input type="text" step="0.1" placeholder="0" value={naclAmount} onChange={(e) => setNaclAmount(e.target.value)} className="nightingale-input font-mono h-9" />
            inputMode="text"
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Feed Volume (ml/feed)</Label>
              <Input type="text" placeholder="5" value={feedVolume} onChange={(e) => setFeedVolume(e.target.value)} className="nightingale-input font-mono h-9" />
              inputMode="text"
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Feed Type</Label>
              <select
                value={feedType}
                onChange={(e) => setFeedType(e.target.value)}
                className="w-full h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm"
              >
                <option value="ebm">EBM (20 kcal/oz)</option>
                <option value="formula">Formula (24 kcal/oz)</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Feed Frequency</Label>
            <select
              value={feedFrequency}
              onChange={(e) => setFeedFrequency(e.target.value)}
              className="w-full h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-3 text-sm"
            >
              <option value="1">q1h</option>
              <option value="2">q2h</option>
              <option value="3">q3h</option>
              <option value="4">q4h</option>
              <option value="6">q6h</option>
              <option value="8">q8h</option>
              <option value="12">q12h</option>
              <option value="24">q24h</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* TPN */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">TPN</CardTitle>
          <CardDescription className="text-xs">Aminoplasmin 10%, Intralipids 20%</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Amino Acids (g/kg/day)</Label>
              <Input 
                type="text"
                  inputMode="text" 
                step="0.1" 
                min="0"
                max="3"
                placeholder="1-3"
                value={aminoGrams} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (val > 3) setAminoGrams("3");
                  else if (val < 0) setAminoGrams("0");
                  else setAminoGrams(e.target.value);
                }} 
                className="nightingale-input font-mono h-9" 
              />
              <p className="text-xs text-muted-foreground">Limit: 1-3 g/kg/day</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Lipids (g/kg/day)</Label>
              <Input 
                type="text"
                  inputMode="text" 
                step="0.1" 
                min="0"
                max="3"
                placeholder="0-3"
                value={lipidGrams} 
                onChange={(e) => setLipidGrams(e.target.value)} 
                className="nightingale-input font-mono h-9" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary Results */}
      {parseFloat(weight) > 0 && parseFloat(tfi) > 0 && (
        <Card className={`rounded-2xl ${results.isOverLimit ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'border-gray-200 dark:border-gray-700'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-[#00d9c5]" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-sm">
            {/* TFI */}
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <span className="font-bold">TFI:</span> {results.tfi} ml/kg/day = <span className="text-[#00d9c5] font-bold">{results.totalFluid24hr} ml/24hr</span>
              <span className="text-muted-foreground text-xs ml-2">({results.hourlyRate} ml/hr)</span>
            </div>

            {/* Dextrose */}
            {results.dextroseBreakdown.map((dex, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <span className="font-bold">{dex.type} ({dex.percentage}%):</span> <span className="text-[#00d9c5] font-bold">{dex.volume.toFixed(1)} ml/24hr</span>
              </div>
            ))}

            {/* 3% NaCl */}
            {parseFloat(results.nacl24hr) > 0 && (
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <span className="font-bold">3% NaCl:</span> <span className="text-[#00d9c5] font-bold">{results.nacl24hr} ml/24hr</span>
                <span className="text-muted-foreground text-xs ml-2">({results.naclPerKg} ml/kg/day)</span>
              </div>
            )}

            {/* Feed */}
            {parseFloat(results.feed24hr) > 0 && (
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <span className="font-bold">Total Feed ({results.feedType === 'ebm' ? 'EBM' : 'Formula'}):</span>
                <div className="pl-2">
                  {results.feedVol} ml q{results.feedFreq}h = <span className="text-[#00d9c5] font-bold">{results.feed24hr} ml/24hr</span>
                  <span className="text-muted-foreground text-xs ml-2">({results.feedPerKg} ml/kg/day)</span>
                </div>
              </div>
            )}

            {/* TPN */}
            {(parseFloat(results.amino24hr) > 0 || parseFloat(results.lipid24hr) > 0) && (
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <span className="font-bold">TPN:</span>
                <div className="pl-2 space-y-1">
                  {parseFloat(results.amino24hr) > 0 && (
                    <div>10% Aminoplasmin ({results.aminoG}g/kg): <span className="text-[#00d9c5] font-bold">{results.amino24hr} ml/24hr</span></div>
                  )}
                  {parseFloat(results.lipid24hr) > 0 && (
                    <div>20% Intralipids ({results.lipidG}g/kg): <span className="text-[#00d9c5] font-bold">{results.lipid24hr} ml/24hr</span></div>
                  )}
                </div>
              </div>
            )}

            {/* Balance */}
            {results.useCombinedDextrose && (
              <div className={`p-2 rounded-lg border ${parseFloat(results.remaining) < 0 ? 'bg-red-50 dark:bg-red-950/30 border-red-300 text-red-700 dark:text-red-400' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
                <span className="font-bold">Remaining:</span> <span className="font-bold">{results.remaining} ml/24hr</span>
                {parseFloat(results.remaining) < 0 && (
                  <span className="text-red-500 text-xs ml-2">(Over TFI limit!)</span>
                )}
              </div>
            )}

            {/* Total Calories Summary */}
            {parseFloat(results.totalCalories24hr) > 0 && (
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Total Calories:</span>
                </div>
                <div className="text-xl font-bold text-[#00d9c5] mt-1">
                  {results.totalCalories24hr} kcal/24hr
                  <span className="text-sm ml-2 text-foreground">({results.totalCaloriesPerKg} kcal/kg/day)</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Dextrose: {results.dextroseCalories24hr} | Feed: {results.feedCalories24hr} | TPN: {results.tpnCalories24hr} kcal
                </div>
              </div>
            )}

            {/* GIR */}
            {parseFloat(results.dextrose24hr) > 0 && (
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-bold">GIR (Glucose Infusion Rate):</span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-sm">Without Feed (IV Dextrose only):</span>
                      {results.dextroseBreakdown.length > 1 && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Includes: {results.dextroseBreakdown.map(d => d.type).join(' + ')}
                        </div>
                      )}
                    </div>
                    <span className="text-lg font-bold font-mono text-[#00d9c5]">{results.girWithoutFeed} mg/kg/min</span>
                  </div>
                  {results.hasFeed && (
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <div>
                        <span className="text-sm">With Feed (IV + Feed):</span>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          All Dextrose + {results.feedType === 'ebm' ? 'EBM' : 'Formula'} carbs
                        </div>
                      </div>
                      <span className="text-lg font-bold font-mono text-[#00d9c5]">{results.girWithFeed} mg/kg/min</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Target GIR: 4-8 mg/kg/min (preterm: 6-8, term: 4-6)
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FluidCalculatorPage;
