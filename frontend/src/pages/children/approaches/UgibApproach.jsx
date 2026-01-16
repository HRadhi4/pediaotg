/**
 * Upper GI Bleeding (UGIB) Approach Component - Flowchart Version
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDown, AlertTriangle, CheckCircle } from "lucide-react";

const FlowNode = ({ children, type = "default", className = "" }) => {
  const styles = {
    start: "bg-blue-500 text-white border-blue-600",
    decision: "bg-amber-100 dark:bg-amber-900/30 border-amber-400 text-amber-800 dark:text-amber-200",
    action: "bg-green-50 dark:bg-green-900/20 border-green-400",
    danger: "bg-red-50 dark:bg-red-900/20 border-red-400",
    info: "bg-gray-50 dark:bg-gray-800 border-gray-300",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-300",
    success: "bg-green-100 dark:bg-green-900/30 border-green-500",
  };
  return (
    <div className={`p-3 rounded-lg border-2 text-xs ${styles[type]} ${className}`}>
      {children}
    </div>
  );
};

const Arrow = ({ label, className = "" }) => (
  <div className={`flex flex-col items-center py-2 ${className}`}>
    <ArrowDown className="h-5 w-5 text-gray-400" />
    {label && <span className="text-[10px] text-muted-foreground mt-1">{label}</span>}
  </div>
);

const BranchContainer = ({ children, className = "" }) => (
  <div className={`grid grid-cols-2 gap-3 ${className}`}>
    {children}
  </div>
);

const UgibApproach = ({ expandedSections, toggleSection }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Upper GI Bleeding (UGIB) Flowchart</CardTitle>
        <CardDescription className="text-xs">Assessment, stabilization, and management algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Definition Box */}
        <FlowNode type="info">
          <p className="font-semibold mb-1">Definition & Presentation</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p className="font-semibold text-red-700">Hematemesis</p>
              <p className="text-[10px] text-muted-foreground">Bright red = active bleeding</p>
              <p className="text-[10px] text-muted-foreground">Coffee-ground = slower/older</p>
            </div>
            <div className="p-2 bg-gray-700 dark:bg-gray-900 rounded">
              <p className="font-semibold text-gray-200">Melena</p>
              <p className="text-[10px] text-gray-400">Black, tarry, foul-smelling</p>
              <p className="text-[10px] text-gray-400">Indicates UGI source</p>
            </div>
          </div>
        </FlowNode>

        <Arrow />

        {/* Start: Rapid Assessment */}
        <FlowNode type="start">
          <p className="font-bold text-center">RAPID ASSESSMENT</p>
          <p className="text-center text-[10px] opacity-90">Check hemodynamic status immediately</p>
        </FlowNode>

        <Arrow />

        {/* Decision: Hemodynamic Status */}
        <FlowNode type="decision">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <p className="font-bold text-center">HEMODYNAMICALLY STABLE?</p>
          </div>
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-[10px]">
            <p className="font-medium mb-1">Signs of Instability (Shock):</p>
            <div className="grid grid-cols-2 gap-1">
              <span>• Tachycardia</span>
              <span>• Hypotension/Orthostasis</span>
              <span>• Poor cap refill (&gt;2s)</span>
              <span>• Cold extremities</span>
              <span>• Altered mental status</span>
              <span>• Mottled skin</span>
            </div>
          </div>
        </FlowNode>

        <Arrow />

        {/* Branch: Stable vs Unstable */}
        <BranchContainer>
          {/* UNSTABLE Branch */}
          <div className="space-y-2">
            <div className="text-center text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 rounded py-1">
              ❌ NO - UNSTABLE
            </div>
            <FlowNode type="danger">
              <p className="font-bold text-red-700 mb-2">IMMEDIATE ACTIONS:</p>
              <ul className="space-y-1 text-[10px]">
                <li>• 2 large-bore IVs</li>
                <li>• Fluid resuscitation (crystalloid ± blood)</li>
                <li>• Type & crossmatch</li>
                <li>• Transfuse PRBCs if needed</li>
                <li>• Intubate if can't protect airway</li>
                <li>• Intensive monitoring</li>
              </ul>
            </FlowNode>
            <Arrow />
            <FlowNode type="danger">
              <p className="font-bold text-red-700">CONSULT IMMEDIATELY:</p>
              <p className="text-[10px]">• Gastroenterology</p>
              <p className="text-[10px]">• Surgery</p>
              <p className="text-[10px]">• PICU / Critical Care</p>
            </FlowNode>
            <Arrow />
            <FlowNode type="warning">
              <p className="font-semibold text-center">Stabilize → Then proceed to evaluation</p>
            </FlowNode>
          </div>

          {/* STABLE Branch */}
          <div className="space-y-2">
            <div className="text-center text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 rounded py-1">
              ✓ YES - STABLE
            </div>
            <FlowNode type="action">
              <p className="font-bold text-green-700 mb-2">INITIAL EVALUATION:</p>
              <ol className="space-y-1 text-[10px] list-decimal list-inside">
                <li>Estimate bleeding severity</li>
                <li>CBC if &gt; minor bleeding</li>
                <li>Focused history</li>
                <li>Focused physical exam</li>
                <li>Exclude mimics</li>
              </ol>
            </FlowNode>
            <Arrow />
            <FlowNode type="info">
              <p className="font-semibold mb-1">History - Ask About:</p>
              <ul className="text-[10px] space-y-0.5">
                <li>• Known liver disease/varices?</li>
                <li>• Bleeding diathesis?</li>
                <li>• NSAID use?</li>
                <li>• Vomiting before hematemesis? (Mallory-Weiss)</li>
              </ul>
            </FlowNode>
          </div>
        </BranchContainer>

        <Arrow />

        {/* Physical Exam Findings */}
        <FlowNode type="info">
          <p className="font-semibold mb-2">Physical Exam Findings & Implications</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1 pr-2">Finding</th>
                  <th className="text-left py-1">Consider</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-1 pr-2">Hepatosplenomegaly, ascites</td>
                  <td className="py-1">Portal HTN → Varices</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-1 pr-2">Bruising, petechiae</td>
                  <td className="py-1">Bleeding disorder</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-1 pr-2">Vascular malformations</td>
                  <td className="py-1">Hereditary hemorrhagic telangiectasia</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-1 pr-2">Mucocutaneous pigmentation</td>
                  <td className="py-1">Peutz-Jeghers syndrome</td>
                </tr>
                <tr>
                  <td className="py-1 pr-2">Blood in nares/pharynx</td>
                  <td className="py-1">Epistaxis (mimic)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FlowNode>

        <Arrow />

        {/* Exclude Mimics */}
        <FlowNode type="warning">
          <p className="font-semibold text-amber-700 mb-1">⚠️ Exclude Mimics of UGIB:</p>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <span>• Epistaxis (swallowed blood)</span>
            <span>• Red food colorings</span>
            <span>• Swallowed maternal blood (neonates)</span>
            <span>• Iron supplements (black stools)</span>
          </div>
        </FlowNode>

        <Arrow />

        {/* Decision: Severity */}
        <FlowNode type="decision">
          <p className="font-bold text-center mb-2">ASSESS SEVERITY</p>
          <p className="font-semibold text-[10px] mb-1">Features Suggesting SEVERE UGIB:</p>
          <ul className="text-[10px] space-y-0.5">
            <li>• Presented with hemodynamic instability</li>
            <li>• Melena or large hematochezia</li>
            <li>• Large-volume hematemesis</li>
            <li>• Known/suspected esophageal varices</li>
            <li>• Significant anemia (Hgb &gt;20% below normal)</li>
          </ul>
        </FlowNode>

        <Arrow />

        {/* Branch: Large vs Small Volume */}
        <BranchContainer>
          {/* Large Volume */}
          <div className="space-y-2">
            <div className="text-center text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 rounded py-1">
              LARGE VOLUME / SEVERE
            </div>
            <FlowNode type="danger">
              <p className="font-bold text-red-700 mb-2">MANAGEMENT:</p>
              <div className="space-y-2 text-[10px]">
                <div className="p-1.5 bg-white/50 dark:bg-black/20 rounded">
                  <p className="font-semibold">IV Access & PICU</p>
                </div>
                <div className="p-1.5 bg-white/50 dark:bg-black/20 rounded">
                  <p className="font-semibold">Labs:</p>
                  <p>CBC, PT/PTT/INR, Type & screen, BMP, LFTs</p>
                </div>
                <div className="p-1.5 bg-white/50 dark:bg-black/20 rounded">
                  <p className="font-semibold text-red-600">Transfuse if:</p>
                  <p>Hgb &lt;8 g/dL or unstable</p>
                </div>
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded">
                  <p className="font-semibold text-purple-700">IV PPI</p>
                  <p>Omeprazole or Pantoprazole</p>
                </div>
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
                  <p className="font-semibold text-green-700">Correct Coagulopathy</p>
                  <p>Vitamin K, FFP, platelets</p>
                </div>
                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded">
                  <p className="font-semibold text-amber-700">Octreotide</p>
                  <p>For variceal bleeding</p>
                </div>
              </div>
            </FlowNode>
          </div>

          {/* Small Volume */}
          <div className="space-y-2">
            <div className="text-center text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 rounded py-1">
              SMALL VOLUME / BENIGN
            </div>
            <FlowNode type="success">
              <p className="font-bold text-green-700 mb-2">LIKELY CAUSES:</p>
              <ul className="text-[10px] space-y-1">
                <li>• Mallory-Weiss tear</li>
                <li>• Mild gastritis</li>
                <li>• NSAID-related</li>
              </ul>
              <div className="mt-2 p-1.5 bg-white/50 dark:bg-black/20 rounded">
                <p className="font-semibold">Management:</p>
                <p className="text-[10px]">• No routine labs needed</p>
                <p className="text-[10px]">• Treat underlying cause</p>
              </div>
            </FlowNode>
            <Arrow />
            <FlowNode type="info">
              <p className="font-semibold mb-1">Mallory-Weiss Tear:</p>
              <p className="text-[10px]">Coffee-ground emesis after vigorous vomiting</p>
              <p className="text-[10px] text-blue-600 mt-1">Tx: Antiemetic + short PPI course</p>
            </FlowNode>
            <FlowNode type="info" className="mt-2">
              <p className="font-semibold mb-1">NSAID-Related:</p>
              <p className="text-[10px] text-blue-600">Tx: Stop NSAID + PPI course</p>
            </FlowNode>
          </div>
        </BranchContainer>

        <Arrow />

        {/* Endoscopy */}
        <FlowNode type="action">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="font-bold text-green-700">UPPER ENDOSCOPY</p>
          </div>
          <p className="text-[10px] font-semibold">Within 24 hours when stable:</p>
          <ul className="text-[10px] mt-1 space-y-0.5">
            <li>• For diagnosis AND therapy</li>
            <li>• If cause unknown or bleeding continues</li>
            <li>• All large-volume or concerning UGIB</li>
          </ul>
          <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
            <p className="text-[10px]"><strong>Note:</strong> NG tube not routinely necessary. If gastric clearance needed, <strong>erythromycin</strong> preferred over NG lavage.</p>
          </div>
        </FlowNode>

        {/* Abbreviations */}
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="font-semibold text-xs mb-2">Key Abbreviations</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
            <div>
              <p><strong>UGIB:</strong> Upper GI Bleeding</p>
              <p><strong>PPI:</strong> Proton Pump Inhibitor</p>
              <p><strong>NG:</strong> Nasogastric</p>
            </div>
            <div>
              <p><strong>INR:</strong> Intl Normalized Ratio</p>
              <p><strong>FFP:</strong> Fresh Frozen Plasma</p>
              <p><strong>Hgb:</strong> Hemoglobin</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UgibApproach;
