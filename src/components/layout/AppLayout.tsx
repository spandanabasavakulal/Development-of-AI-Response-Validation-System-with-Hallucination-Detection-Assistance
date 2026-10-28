import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { Modal } from '../shared/Modal';
import { getApiStatus, ApiStatus } from '../../services/apiClient';
import { Settings, ShieldCheck, Database, Cpu, HelpCircle, Check, Info } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    isBackendConnected: false,
    endpoint: 'http://localhost:8000',
    mode: 'Demo / Simulation Mode'
  });

  // Settings state
  const [relevanceWeight, setRelevanceWeight] = useState(20);
  const [accuracyWeight, setAccuracyWeight] = useState(30);
  const [hallucinationWeight, setHallucinationWeight] = useState(25);
  const [completenessWeight, setCompletenessWeight] = useState(25);
  const [passThreshold, setPassThreshold] = useState(80);
  const [needsImpThreshold, setNeedsImpThreshold] = useState(60);

  useEffect(() => {
    getApiStatus().then(setApiStatus);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0F172A] flex flex-col font-sans">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        isBackendConnected={apiStatus.isBackendConnected}
      />

      {/* Top Navbar */}
      <TopNavbar collapsed={collapsed} isBackendConnected={apiStatus.isBackendConnected} />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 p-6 md:p-8 max-w-7xl w-full mx-auto ${
          collapsed ? 'pl-26' : 'pl-70'
        }`}
      >
        <Outlet />
      </main>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Evaluation System Configuration"
        subtitle="Manage dimension weights, verdict score gates, and model hyperparameters"
        maxWidth="lg"
      >
        <div className="space-y-6 text-xs text-slate-700">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <Info className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
            <div className="text-[11px] text-brand-900 leading-relaxed">
              <strong>Architecture Weighting Rule:</strong> The final verdict score is computed by aggregating 4 specialized judge dimensions. Total weights must sum to 100%.
            </div>
          </div>

          {/* Dimension Weights */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Dimension Weighting (Total: {relevanceWeight + accuracyWeight + hallucinationWeight + completenessWeight}%)
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Relevance Weight</span>
                  <span className="text-brand-600 font-bold">{relevanceWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={relevanceWeight}
                  onChange={(e) => setRelevanceWeight(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Accuracy Weight</span>
                  <span className="text-brand-600 font-bold">{accuracyWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={accuracyWeight}
                  onChange={(e) => setAccuracyWeight(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Hallucination Weight</span>
                  <span className="text-brand-600 font-bold">{hallucinationWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={hallucinationWeight}
                  onChange={(e) => setHallucinationWeight(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Completeness Weight</span>
                  <span className="text-brand-600 font-bold">{completenessWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={completenessWeight}
                  onChange={(e) => setCompletenessWeight(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Verdict Score Gates */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Verdict Score Thresholds
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 mb-1">Pass Threshold (Score ≥)</label>
                <input
                  type="number"
                  value={passThreshold}
                  onChange={(e) => setPassThreshold(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Needs Improvement (Score ≥)</label>
                <input
                  type="number"
                  value={needsImpThreshold}
                  onChange={(e) => setNeedsImpThreshold(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              *Scores below {needsImpThreshold} receive an automatic Fail. Any contradiction in safety-critical domains triggers an automatic veto Fail.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </div>
      </Modal>

      {/* Help / Documentation Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Infosys Springboard AI Response Quality Evaluator"
        subtitle="End-to-End Multi-Agent Architecture & Verification Protocol"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-brand-600" /> Objective & Scope
            </h4>
            <p>
              This enterprise evaluation platform audits AI-generated or user-submitted responses against authoritative evidence corpora. Rather than simply issuing a black-box numerical score, the system deconstructs responses into atomic assertions and classifies every claim into four rigorous categories:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-medium">
              <li><strong className="text-green-700">Supported:</strong> Directly substantiated by retrieved reference passages.</li>
              <li><strong className="text-amber-700">Unsupported:</strong> Missing from available evidence. (Important: Missing evidence is not assumed to be false without contradiction).</li>
              <li><strong className="text-red-700">Contradicted:</strong> Directly refuted by authoritative ground truth passages.</li>
              <li><strong className="text-slate-600">Inconclusive:</strong> Ambiguous or insufficient context to make a definitive determination.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <h5 className="font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                <Cpu className="w-4 h-4 text-brand-600" /> Five Logical Agents
              </h5>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li><strong>Supervisor / Orchestrator:</strong> Schedules pipeline tasks.</li>
                <li><strong>Relevance Judge:</strong> Measures semantic prompt alignment.</li>
                <li><strong>Accuracy Judge:</strong> Verifies factual claims against references.</li>
                <li><strong>Hallucination Sentinel:</strong> Flags unsubstantiated claims.</li>
                <li><strong>Completeness Judge:</strong> Analyzes missing requirements.</li>
              </ol>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <h5 className="font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                <Database className="w-4 h-4 text-teal-700" /> Retrieval Stack
              </h5>
              <p className="text-slate-600">
                Uses <strong>all-MiniLM-L6-v2</strong> sentence embeddings and <strong>FAISS</strong> for similarity search. Semantic similarity indicates relevance and does not inherently prove factual truth.
              </p>
              <div className="mt-2 text-[11px] text-slate-400 font-mono">
                Formula: Rel(20%) + Acc(30%) + Halluc(25%) + Comp(25%)
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsHelpOpen(false)}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
