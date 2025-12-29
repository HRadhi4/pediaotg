import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

const FluidCalculatorPage = () => {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gestationalAge, setGestationalAge] = useState("");
  const [tfi, setTfi] = useState("");
  
  // NaCl
  const [naclAmount, setNaclAmount] = useState("");
  
  // Feed
  const [feedVolume, setFeedVolume] = useState("");
  const [feedFrequency, setFeedFrequency] = useState("2"); // q2h default
  
  // TPN
  const [aminoGrams, setAminoGrams] = useState(""); // 1-3g limit
  const [lipidGrams, setLipidGrams] = useState(""); // g/kg
  
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
    const tfiValue = parseFloat(tfi) || 0;
    const nacl = parseFloat(naclAmount) || 0;
    const feedVol = parseFloat(feedVolume) || 0;
    const feedFreq = parseInt(feedFrequency) || 2;
    const amino = parseFloat(aminoGrams) || 0;
    const lipid = parseFloat(lipidGrams) || 0;

    if (w <= 0 || tfiValue <= 0) return null;

    // Total Fluid
    const totalFluid = tfiValue * w; // ml/day

    // Feed calculations
    const feedsPerDay = 24 / feedFreq;
    const feedTotalPerDay = feedVol * feedsPerDay;

    // TPN Components
    const aminoVolume = amino > 0 ? (amino * w * 10) : 0; // 10% amino = 10g/100ml
    const lipidVolume = lipid > 0 ? (lipid * w * 5) : 0; // 20% lipid = 20g/100ml = 5ml/g
    const naclVolume = nacl * w;

    // Dextrose calculation
    let dextroseVolume = totalFluid - feedTotalPerDay - aminoVolume - lipidVolume - naclVolume;
    let effectiveGIR = 0;
    let combinedDextroseConc = 10;

    if (useCombinedDextrose && dextroseItems.length > 0) {
      // Calculate combined dextrose concentration
      const totalDexVol = dextroseItems.reduce((sum, d) => sum + (parseFloat(d.volume) || 0), 0);
      const totalDexGrams = dextroseItems.reduce((sum, d) => {
        const vol = parseFloat(d.volume) || 0;
        return sum + (vol * d.percentage / 100);
      }, 0);
      combinedDextroseConc = totalDexVol > 0 ? (totalDexGrams / totalDexVol * 100) : 10;
      dextroseVolume = totalDexVol;
    }

    // GIR calculation: (Dextrose% × Volume ml/day) / (weight kg × 1440 min)
    const dexGrams = (dextroseVolume * combinedDextroseConc / 100);
    effectiveGIR = w > 0 ? (dexGrams * 1000) / (w * 1440) : 0;

    // IVF rate
    const ivfVolume = dextroseVolume + aminoVolume + lipidVolume + naclVolume;
    const ivfRate = ivfVolume / 24;

    return {
      totalFluid: totalFluid.toFixed(1),
      feedTotal: feedTotalPerDay.toFixed(1),
      feedPerFeed: feedVol.toFixed(1),
      feedsPerDay,
      aminoVolume: aminoVolume.toFixed(1),
      lipidVolume: lipidVolume.toFixed(1),
      naclVolume: naclVolume.toFixed(1),
      dextroseVolume: Math.max(0, dextroseVolume).toFixed(1),
      combinedDextroseConc: combinedDextroseConc.toFixed(1),
      gir: effectiveGIR.toFixed(2),
      ivfRate: ivfRate.toFixed(1),
      ivfVolume: ivfVolume.toFixed(1)
    };
  };

  const results = calculateResults();

  return (
    <div className="space-y-4">
      {/* Patient Info */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Weight (kg)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.8"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="nightingale-input font-mono h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Age (days)</Label>
              <Input
                type="number"
                placeholder="3"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="nightingale-input font-mono h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">GA (weeks)</Label>
              <Input
                type="number"
                placeholder="32"
                value={gestationalAge}
                onChange={(e) => setGestationalAge(e.target.value)}
                className="nightingale-input font-mono h-9"
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs">TFI (ml/kg/day)</Label>
              {age && (
                <span className="text-xs text-muted-foreground">
                  Suggested: {getTfiSuggestion()} ml/kg/day
                </span>
              )}
            </div>
            <Input
              type="number"
              placeholder="140"
              value={tfi}
              onChange={(e) => setTfi(e.target.value)}
              className="nightingale-input font-mono h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dextrose Options */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Dextrose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <Checkbox
              id="combinedDex"
              checked={useCombinedDextrose}
              onCheckedChange={setUseCombinedDextrose}
            />
            <Label htmlFor="combinedDex" className="cursor-pointer text-sm">
              Combined Dextrose (Multiple Sugar Fluids)
            </Label>
          </div>

          {useCombinedDextrose && (
            <div className="space-y-2">
              {dextroseItems.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <select
                    value={item.type}
                    onChange={(e) => updateDextroseItem(item.id, "type", e.target.value)}
                    className="h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-0 px-2 text-sm flex-shrink-0 w-20"
                  >
                    {dextroseOptions.map(opt => (
                      <option key={opt.type} value={opt.type}>{opt.type}</option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    placeholder="Volume (ml)"
                    value={item.volume}
                    onChange={(e) => updateDextroseItem(item.id, "volume", e.target.value)}
                    className="nightingale-input font-mono h-9 flex-1"
                  />
                  {dextroseItems.length > 1 && (
                    <button
                      onClick={() => removeDextroseItem(item.id)}
                      className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addDextroseItem}
                className="w-full rounded-xl"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Dextrose
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additives & Feed */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Additives & Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">3% NaCl (ml/kg/day)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="0"
              value={naclAmount}
              onChange={(e) => setNaclAmount(e.target.value)}
              className="nightingale-input font-mono h-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Feed Volume (ml/feed)</Label>
              <Input
                type="number"
                placeholder="5"
                value={feedVolume}
                onChange={(e) => setFeedVolume(e.target.value)}
                className="nightingale-input font-mono h-9"
              />
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
          </div>
        </CardContent>
      </Card>

      {/* TPN */}
      <Card className="nightingale-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">TPN Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Amino Acids (g/kg/day)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="0-3"
                value={aminoGrams}
                onChange={(e) => setAminoGrams(e.target.value)}
                className="nightingale-input font-mono h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Lipids (g/kg/day)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="0-3"
                value={lipidGrams}
                onChange={(e) => setLipidGrams(e.target.value)}
                className="nightingale-input font-mono h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card className="border-[#00d9c5]/30 bg-[#00d9c5]/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#00d9c5]">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                <p className="text-xs text-muted-foreground">Total Fluid</p>
                <p className="text-xl font-mono font-bold text-[#00d9c5]">{results.totalFluid} ml</p>
                <p className="text-xs text-muted-foreground">per day</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border text-center">
                <p className="text-xs text-muted-foreground">GIR</p>
                <p className={`text-xl font-mono font-bold ${
                  parseFloat(results.gir) < 4 ? 'text-amber-500' : 
                  parseFloat(results.gir) > 12 ? 'text-red-500' : 'text-green-500'
                }`}>{results.gir}</p>
                <p className="text-xs text-muted-foreground">mg/kg/min</p>
              </div>
            </div>

            {/* IVF Rate */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">IVF Rate</span>
                <span className="text-lg font-mono font-bold text-blue-600">{results.ivfRate} ml/hr</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total IVF: {results.ivfVolume} ml/day</p>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Components:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {!useCombinedDextrose && (
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span>D10W</span>
                    <span className="font-mono">{results.dextroseVolume} ml</span>
                  </div>
                )}
                {useCombinedDextrose && (
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span>Dextrose ({results.combinedDextroseConc}%)</span>
                    <span className="font-mono">{results.dextroseVolume} ml</span>
                  </div>
                )}
                {parseFloat(results.aminoVolume) > 0 && (
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span>Amino (10%)</span>
                    <span className="font-mono">{results.aminoVolume} ml</span>
                  </div>
                )}
                {parseFloat(results.lipidVolume) > 0 && (
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span>Lipid (20%)</span>
                    <span className="font-mono">{results.lipidVolume} ml</span>
                  </div>
                )}
                {parseFloat(results.naclVolume) > 0 && (
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span>3% NaCl</span>
                    <span className="font-mono">{results.naclVolume} ml</span>
                  </div>
                )}
              </div>
            </div>

            {/* Feed Summary */}
            {parseFloat(results.feedTotal) > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enteral Feeds</span>
                  <span className="text-sm font-mono">{results.feedTotal} ml/day</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {results.feedPerFeed} ml × {results.feedsPerDay} feeds/day
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FluidCalculatorPage;
