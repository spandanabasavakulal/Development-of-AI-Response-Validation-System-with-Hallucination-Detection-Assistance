import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  ArrowDown,
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Code,
  Zap,
  Info,
  Terminal,
  Server,
  FileCheck,
  Check
} from 'lucide-react';
import { AGENT_NODES } from '../data/mockAgents';
import { AgentArchitectureNode } from '../types/agent';
import { Modal } from '../components/shared/Modal';

export const AgentArchitecturePage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentArchitectureNode | null>(null);
  const [activeTab, setActiveTab] = useState<'topology' | 'stack' | 'weights'>('topology');

  // Configurable weights state for simulation
  const [weights, setWeights] = useState({
    relevance: 20,
    accuracy: 30,
    hallucination: 25,
    completeness: 25,
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Agent Architecture & Workflow</h2>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end multi-agent evaluation pipeline with specialized LLM judges, FAISS retrieval, and verdict aggregation.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'topology' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multi-Agent Topology
          </button>
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'stack' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Technology Stack
          </button>
          <button
            onClick={() => setActiveTab('weights')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'weights' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scoring & Aggregation
          </button>
        </div>
      </div>

      {/* TOPOLOGY VIEW */}
      {activeTab === 'topology' && (
        <div className="space-y-8">
          {/* Architecture Instruction Note */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-brand-900">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                <strong>Interactive Architecture Map:</strong> Click on any agent node below to inspect prompt templates, input/output schemas, latency benchmarks, and model configurations.
              </span>
            </div>
            <span className="text-[10px] bg-white border border-blue-200 text-brand-700 px-2 py-0.5 rounded font-mono font-semibold">
              LangGraph Multi-Agent
            </span>
          </div>

          {/* End-to-End Visual Flow Graph */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-8">
            {/* 1. ENTRY & GUARDRAILS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Stage 1: Ingestion & Input Guardrails
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Input Gateway</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Input Gateway
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Captures Question, AI Response, Optional Gold Benchmark, or Batch QA CSV uploads.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Input Guardrails & Validation
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Prompt injection filters, token boundary checks, schema validation, and session auth.
                  </p>
                </div>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowDown className="w-5 h-5 text-slate-400 animate-bounce" />
              </div>
            </div>

            {/* 2. AGENT ORCHESTRATOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest">
                  Stage 2: Agent Orchestration Engine
                </span>
                <span className="text-[10px] text-brand-600 bg-blue-50 px-2 py-0.5 rounded font-mono font-semibold">
                  Primary Logical Agent 1
                </span>
              </div>

              {/* Clickable Supervisor Node */}
              <div
                onClick={() => setSelectedAgent(AGENT_NODES.find(a => a.role === 'supervisor') || null)}
                className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50/40 rounded-xl border-2 border-brand-300 hover:border-brand-500 transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700">
                        Agent 1: Supervisor / Orchestrator Agent
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Workflow state manager coordinating task allocation, tools, and judge parallelism
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-600 group-hover:underline flex items-center gap-1">
                    Inspect Specs →
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-blue-200/60 text-[11px]">
                  <div className="bg-white/80 p-2 rounded border border-blue-100">
                    <strong className="text-slate-800 block">Supervisor</strong>
                    <span className="text-slate-500 text-[10px]">Oversees decisions</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-blue-100">
                    <strong className="text-slate-800 block">Planner</strong>
                    <span className="text-slate-500 text-[10px]">Sequences sub-tasks</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-blue-100">
                    <strong className="text-slate-800 block">Evidence Coord</strong>
                    <span className="text-slate-500 text-[10px]">Orchestrates RAG</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-blue-100">
                    <strong className="text-slate-800 block">Verifier</strong>
                    <span className="text-slate-500 text-[10px]">Validates outputs</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* 3. ROUTER & EVIDENCE RETRIEVAL (FAISS) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Stage 3: Evidence Retrieval & Tool Execution
                </span>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-mono font-semibold">
                  Vector Engine
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-teal-700" /> Analysis Tools
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Claim extraction parser decomposes response into discrete testable atomic assertions.
                  </p>
                </div>

                <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-200 space-y-1">
                  <div className="font-bold text-xs text-teal-900 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-teal-700" /> FAISS Vector Store
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Cosine similarity search over chunked reference documents embedded via all-MiniLM-L6-v2.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-700" /> RAG Retriever & Reranker
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Filters metadata and provides evidence passages to specialized judge agents.
                  </p>
                </div>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* 4. THE 4 SPECIALIZED JUDGE AGENTS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest">
                  Stage 4: Specialized Evaluation Judges (Agents 2 – 5)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Parallel Execution</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Agent 2: Relevance */}
                {(() => {
                  const node = AGENT_NODES.find(a => a.role === 'relevance_judge')!;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedAgent(node)}
                      className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-brand-500 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                            Agent 2 (20% Wt)
                          </span>
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700">
                          {node.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Checks if the answer directly addresses the question without drift.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Latency: {node.metrics.avgExecutionTimeMs}ms</span>
                        <span className="text-brand-600 font-semibold group-hover:underline">Inspect →</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Agent 3: Accuracy */}
                {(() => {
                  const node = AGENT_NODES.find(a => a.role === 'accuracy_judge')!;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedAgent(node)}
                      className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-brand-500 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded">
                            Agent 3 (30% Wt)
                          </span>
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700">
                          {node.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Verifies factual claims against retrieved evidence passages.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Latency: {node.metrics.avgExecutionTimeMs}ms</span>
                        <span className="text-brand-600 font-semibold group-hover:underline">Inspect →</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Agent 4: Hallucination */}
                {(() => {
                  const node = AGENT_NODES.find(a => a.role === 'hallucination_detector')!;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedAgent(node)}
                      className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-brand-500 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                            Agent 4 (25% Wt)
                          </span>
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700">
                          {node.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Detects unsupported, contradicted, and inconclusive statements.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Latency: {node.metrics.avgExecutionTimeMs}ms</span>
                        <span className="text-brand-600 font-semibold group-hover:underline">Inspect →</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Agent 5: Completeness */}
                {(() => {
                  const node = AGENT_NODES.find(a => a.role === 'completeness_judge')!;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedAgent(node)}
                      className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-brand-500 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded">
                            Agent 5 (25% Wt)
                          </span>
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700">
                          {node.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Performs omission analysis, identifying missing parameters and caveats.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Latency: {node.metrics.avgExecutionTimeMs}ms</span>
                        <span className="text-brand-600 font-semibold group-hover:underline">Inspect →</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* 5. VERDICT AGGREGATOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest">
                  Stage 5: Verdict Aggregator & Quality Gating
                </span>
                <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-mono font-semibold">
                  Aggregator Engine
                </span>
              </div>

              <div
                onClick={() => setSelectedAgent(AGENT_NODES.find(a => a.role === 'verdict_aggregator') || null)}
                className="p-5 bg-gradient-to-r from-purple-50 to-indigo-50/40 rounded-xl border-2 border-purple-300 hover:border-purple-500 transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
                        Verdict Agent (Aggregator)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Applies weighted normalization: Rel (20%) + Acc (30%) + Halluc (25%) + Comp (25%) and contradiction veto
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-700 group-hover:underline flex items-center gap-1">
                    Inspect Aggregator →
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-purple-200/60 text-center text-xs">
                  <div className="bg-white/80 p-2 rounded border border-purple-100 font-semibold text-green-700">
                    Pass (Score ≥ 80%)
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-purple-100 font-semibold text-amber-700">
                    Needs Improvement (60–79%)
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-purple-100 font-semibold text-red-700">
                    Fail (&lt; 60% or Veto)
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* 6. OUTPUT & CONTINUOUS FEEDBACK */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Stage 6: Output & Feedback Loop
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Observability</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-brand-600" /> Structured Results
                  </div>
                  <p className="text-[11px] text-slate-600">
                    JSON payload, claim audits, and evaluation dashboard visualizations.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-brand-600" /> Report Generation
                  </div>
                  <p className="text-[11px] text-slate-600">
                    PDF compliance summaries, batch audit exports, and evidence snapshots.
                  </p>
                </div>

                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 space-y-1">
                  <div className="font-bold text-xs text-brand-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Continuous Improvement
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Human review feedback, agent evaluation telemetry, and prompt tuning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STACK VIEW */}
      {activeTab === 'stack' && (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Technical Stack Implementation Status</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Delineation of implemented production frontend components, local Python evaluation services, and proposed backend architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4 text-brand-600" /> Frontend Architecture
                </h4>
                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold border border-green-200">
                  Fully Implemented
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-medium text-slate-800">Framework:</span>
                  <span>React 19 + TypeScript + Vite</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-medium text-slate-800">Styling:</span>
                  <span>Tailwind CSS (Enterprise Theme)</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-medium text-slate-800">Visualizations:</span>
                  <span>Recharts (Responsive Area, Bar, Donut)</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-slate-800">Navigation:</span>
                  <span>React Router v7 (8 Dedicated Pages)</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4 text-brand-600" /> Evaluation Backend (Python)
                </h4>
                <span className="text-[10px] bg-blue-50 text-brand-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                  FastAPI / Service Adapter
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-medium text-slate-800">Orchestrator:</span>
                  <span>LangGraph Multi-Agent Workflow Engine</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-medium text-slate-800">Judge LLM:</span>
                  <span>Gemini-1.5-Pro / Claude-3.5-Sonnet</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-medium text-slate-800">Embeddings:</span>
                  <span>sentence-transformers/all-MiniLM-L6-v2</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-slate-800">Vector Index:</span>
                  <span>FAISS (IndexFlatIP / IndexIVFFlat)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* WEIGHTS VIEW */}
      {activeTab === 'weights' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Configurable Composite Weighting Formula</h3>
            <p className="text-xs text-slate-500 mt-1">
              Test how altering judge weights impacts the final composite score and verdict decision boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Relevance Weight</span>
                <span className="text-brand-600">{weights.relevance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={weights.relevance}
                onChange={(e) => setWeights({ ...weights, relevance: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Accuracy Weight</span>
                <span className="text-brand-600">{weights.accuracy}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={weights.accuracy}
                onChange={(e) => setWeights({ ...weights, accuracy: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Hallucination Weight</span>
                <span className="text-brand-600">{weights.hallucination}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={weights.hallucination}
                onChange={(e) => setWeights({ ...weights, hallucination: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Completeness Weight</span>
                <span className="text-brand-600">{weights.completeness}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={weights.completeness}
                onChange={(e) => setWeights({ ...weights, completeness: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-brand-900 flex items-center justify-between">
            <span>
              Total Weight: <strong>{weights.relevance + weights.accuracy + weights.hallucination + weights.completeness}%</strong>
              {weights.relevance + weights.accuracy + weights.hallucination + weights.completeness !== 100 && (
                <span className="text-red-600 ml-2 font-bold">(Weights should sum to 100%)</span>
              )}
            </span>
            <button
              onClick={() => setWeights({ relevance: 20, accuracy: 30, hallucination: 25, completeness: 25 })}
              className="text-xs font-bold text-brand-700 underline cursor-pointer"
            >
              Reset to Standard (20 / 30 / 25 / 25)
            </button>
          </div>
        </div>
      )}

      {/* Agent Detail Modal Drawer */}
      <Modal
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
        title={selectedAgent ? selectedAgent.name : ''}
        subtitle={selectedAgent ? selectedAgent.description : ''}
        maxWidth="2xl"
      >
        {selectedAgent && (
          <div className="space-y-5 text-xs text-slate-700">
            {/* Responsibilities */}
            <div>
              <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-2 text-[11px]">
                Core Operational Responsibilities
              </h5>
              <ul className="space-y-1.5 pl-4 list-disc text-slate-700">
                {selectedAgent.responsibilities.map((res, i) => (
                  <li key={i}>{res}</li>
                ))}
              </ul>
            </div>

            {/* Prompt Template */}
            <div>
              <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-2 text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-brand-600" />
                Prompt Template Preview
              </h5>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] font-mono overflow-x-auto whitespace-pre-wrap">
                {selectedAgent.promptTemplatePreview}
              </pre>
            </div>

            {/* Model Configuration */}
            <div>
              <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-2 text-[11px]">
                Agent Configuration & Hyperparameters
              </h5>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400">Model Engine:</span>
                  <div className="font-semibold text-slate-800">{selectedAgent.modelConfig.model}</div>
                </div>
                <div>
                  <span className="text-slate-400">Temperature:</span>
                  <div className="font-semibold text-slate-800">{selectedAgent.modelConfig.temperature} (Deterministic)</div>
                </div>
                <div className="mt-1">
                  <span className="text-slate-400">Max Tokens:</span>
                  <div className="font-semibold text-slate-800">{selectedAgent.modelConfig.maxTokens}</div>
                </div>
                <div className="mt-1">
                  <span className="text-slate-400">Strictness Tier:</span>
                  <div className="font-semibold text-slate-800">{selectedAgent.modelConfig.strictness}</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-2 text-[11px]">
                Agent Telemetry & Benchmarks
              </h5>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Avg Latency</span>
                  <strong className="text-slate-800">{selectedAgent.metrics.avgExecutionTimeMs}ms</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Total Audits</span>
                  <strong className="text-slate-800">{selectedAgent.metrics.totalCalls}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Concordance</span>
                  <strong className="text-green-700">{selectedAgent.metrics.accuracyRate}%</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Error Rate</span>
                  <strong className="text-slate-800">{selectedAgent.metrics.errorRate}%</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
