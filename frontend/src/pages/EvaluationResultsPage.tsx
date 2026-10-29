import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Printer,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  Layers,
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { evaluationService } from '../services/evaluationService';
import { EvaluationResult, ClaimFinding } from '../types/evaluation';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ScoreIndicator } from '../components/shared/ScoreIndicator';
import { ScoreCard } from '../components/shared/ScoreCard';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';

export const EvaluationResultsPage: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'claims' | 'evidence' | 'agents' | 'recommendations'>('overview');
  const [selectedClaim, setSelectedClaim] = useState<ClaimFinding | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      setLoading(true);
      if (evaluationId === 'latest' || !evaluationId) {
        const all = await evaluationService.getAll();
        if (all.length > 0) {
          setEvaluation(all[0]);
          setSelectedClaim(all[0].claims[0] || null);
        }
      } else {
        const found = await evaluationService.getById(evaluationId);
        setEvaluation(found);
        if (found && found.claims.length > 0) {
          setSelectedClaim(found.claims[0]);
        }
      }
      setLoading(false);
    };

    fetchEvaluation();
  }, [evaluationId]);

  const handleCopyId = () => {
    if (evaluation) {
      navigator.clipboard.writeText(evaluation.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleDownloadJson = () => {
    if (!evaluation) return;
    const blob = new Blob([JSON.stringify(evaluation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evaluation.id}_evaluation_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Evaluation Record Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          The requested evaluation ID could not be located in local or backend archives.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/evaluate')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold"
          >
            Start New Evaluation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-16 print:p-0 print:m-0">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-600">{evaluation.id}</span>
              <StatusBadge status={evaluation.verdict} size="sm" />
              {evaluation.isDemoData && (
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  Sample Data
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
              <span>Audited on {evaluation.timestamp}</span>
              <span>•</span>
              <span>Model: {evaluation.evaluatorModel}</span>
              <span>•</span>
              <span>Latency: {evaluation.latencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyId}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Copy Evaluation ID"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Download JSON Payload"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Export / Print Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => navigate('/evaluate')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Run New Evaluation</span>
          </button>
        </div>
      </div>

      {/* Hero Score Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Composite Evaluation Verdict
            </span>
            <StatusBadge status={evaluation.verdict} size="md" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
            {evaluation.verdictSummary}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Factual Grounding Confidence: <strong className="text-slate-900">{evaluation.confidenceScore}%</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-slate-500" />
              Corpus: <strong className="text-slate-900">{evaluation.referenceDocumentName}</strong>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span>
              <strong>Scientific Uncertainty Note:</strong> The evaluation confidence reflects semantic concordance with indexed reference passages. Missing reference evidence indicates lack of verification, not mathematical proof of falsity.
            </span>
          </div>
        </div>

        {/* Large Score Indicator */}
        <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shrink-0 w-full sm:w-56 text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Overall Quality Score
          </span>
          <div className="flex items-baseline justify-center">
            <span className={`text-5xl font-black tracking-tight ${
              evaluation.overallScore >= 80 ? 'text-green-600' :
              evaluation.overallScore >= 60 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {evaluation.overallScore}
            </span>
            <span className="text-xs text-slate-400 font-bold ml-1">/ 100</span>
          </div>
          <div className="mt-2">
            <StatusBadge status={evaluation.verdict} size="sm" />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 font-mono">
            4-Judge Weighted Composite
          </span>
        </div>
      </div>

      {/* 4 Dimension Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard dimension={evaluation.dimensions.relevance} onViewDetails={() => setActiveTab('overview')} />
        <ScoreCard dimension={evaluation.dimensions.accuracy} onViewDetails={() => setActiveTab('claims')} />
        <ScoreCard dimension={evaluation.dimensions.hallucination} onViewDetails={() => setActiveTab('claims')} />
        <ScoreCard dimension={evaluation.dimensions.completeness} onViewDetails={() => setActiveTab('recommendations')} />
      </div>

      {/* Tabbed Detailed Findings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Evaluation Overview' },
            { id: 'claims', label: `Claim Analysis (${evaluation.claims.length})` },
            { id: 'evidence', label: 'Retrieved Reference Passages' },
            { id: 'agents', label: 'Agent Reasoning Traces' },
            { id: 'recommendations', label: 'Omission & Recommendations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 border-b-2 font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Question & AI Response Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Question */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-brand-600" /> Original Question / User Prompt
                </span>
                <p className="text-xs text-slate-900 font-medium leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200">
                  {evaluation.question}
                </p>
                {evaluation.referenceAnswer && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Reference Benchmark:</span>
                    <p className="text-xs text-slate-600 mt-1 italic bg-white p-2.5 rounded border border-slate-200">
                      "{evaluation.referenceAnswer}"
                    </p>
                  </div>
                )}
              </div>

              {/* AI Response */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-600" /> Submitted Candidate Response
                </span>
                <div className="text-xs text-slate-900 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200">
                  {evaluation.response}
                </div>
              </div>
            </div>

            {/* Strengths & Identified Issues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl border border-green-200 bg-green-50/40 space-y-2">
                <h4 className="text-xs font-bold text-green-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Key Strengths & Verified Dimensions
                </h4>
                <ul className="space-y-1.5 text-xs text-green-900 pl-4 list-disc font-medium">
                  {evaluation.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2">
                <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Identified Factual Defects & Hallucinations
                </h4>
                {evaluation.identifiedIssues.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-red-900 pl-4 list-disc font-medium">
                    {evaluation.identifiedIssues.map((iss, i) => (
                      <li key={i}>{iss}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-green-800 font-medium">
                    Zero critical defects or contradicted claims identified.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Claim Analysis */}
        {activeTab === 'claims' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Extracted Atomic Claim Audit</h4>
                <p className="text-xs text-slate-500">
                  Each claim is evaluated individually to avoid black-box aggregate judgments.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-medium text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Supported
                </span>
                <span className="flex items-center gap-1 font-medium text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Unsupported
                </span>
                <span className="flex items-center gap-1 font-medium text-red-700">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Contradicted
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {evaluation.claims.map((claim) => {
                const isExpanded = expandedClaimId === claim.id;
                return (
                  <div
                    key={claim.id}
                    className={`rounded-xl border transition-all ${
                      claim.status === 'supported' ? 'border-green-200 bg-green-50/20' :
                      claim.status === 'contradicted' ? 'border-red-200 bg-red-50/30' :
                      claim.status === 'unsupported' ? 'border-amber-200 bg-amber-50/30' :
                      'border-slate-200 bg-slate-50/30'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedClaimId(isExpanded ? null : claim.id)}
                      className="p-4 flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs font-bold text-slate-500 mt-0.5">
                          #{claim.claimNumber}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 leading-relaxed font-sans">
                            {claim.claimText}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {claim.explanation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={claim.status} size="sm" />
                        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                          {Math.round(claim.confidence * 100)}% conf
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded Evidence Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3 bg-white/70 rounded-b-xl text-xs">
                        {claim.evidenceQuote ? (
                          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-slate-800">
                            <span className="font-bold text-brand-900 block mb-1 text-[11px] uppercase tracking-wider">
                              Cited Grounding Evidence ({claim.sourceDocument}):
                            </span>
                            <blockquote className="italic text-xs font-serif text-slate-800 border-l-2 border-brand-500 pl-3 my-1">
                              "{claim.evidenceQuote}"
                            </blockquote>
                            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                              <span>Chunk ID: {claim.chunkId}</span>
                              <span>Similarity Match: {((claim.similarityScore || 0.85) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                            <strong>No direct grounding passage found:</strong> The knowledge base does not contain an authoritative excerpt validating this assertion.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Evidence */}
        {activeTab === 'evidence' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Retrieved Passages & Source Attribution</h4>
                <p className="text-xs text-slate-500">
                  Passages retrieved from FAISS vector search used by the Accuracy Judge and Hallucination Sentinel.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                Corpus: {evaluation.referenceDocumentName}
              </span>
            </div>

            <div className="space-y-4">
              {evaluation.claims.filter(c => c.evidenceQuote).map((claim, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-brand-600" />
                      Referenced in Claim #{claim.claimNumber}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Vector Similarity: {((claim.similarityScore || 0.88) * 100).toFixed(1)}%
                    </span>
                  </div>

                  <blockquote className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 font-serif italic leading-relaxed">
                    "{claim.evidenceQuote}"
                  </blockquote>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Source: {claim.sourceDocument}</span>
                    <span>Chunk: {claim.chunkId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Agent Reasoning Traces */}
        {activeTab === 'agents' && (
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Multi-Agent Rationales & Audit Telemetry</h4>
              <p className="text-xs text-slate-500">
                Transparent logs produced by each specialized judge agent in the evaluation pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(evaluation.agentRationales).map(([agentKey, rationale]) => {
                const getAgentTitle = (k: string) => {
                  switch (k) {
                    case 'supervisor': return 'Supervisor / Orchestrator';
                    case 'relevanceJudge': return 'Agent 2: Relevance Judge';
                    case 'accuracyJudge': return 'Agent 3: Accuracy Judge';
                    case 'hallucinationDetector': return 'Agent 4: Hallucination Detection Sentinel';
                    case 'completenessJudge': return 'Agent 5: Completeness Judge';
                    case 'verdictAggregator': return 'Verdict Aggregator Engine';
                    default: return k;
                  }
                };

                return (
                  <div key={agentKey} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-bold text-slate-900">{getAgentTitle(agentKey)}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200">
                      {rationale}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Recommendations */}
        {activeTab === 'recommendations' && (
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Completeness Analysis & Recommendations</h4>
              <p className="text-xs text-slate-500">
                Actionable feedback to improve model prompting, RAG retrieval thresholds, or fine-tuning datasets.
              </p>
            </div>

            <div className="space-y-4">
              {/* Missing Information */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Identified Topical Omissions
                </h5>
                {evaluation.missingInformation.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-amber-900 pl-4 list-disc font-medium">
                    {evaluation.missingInformation.map((info, i) => (
                      <li key={i}>{info}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-600">No critical topical omissions found.</p>
                )}
              </div>

              {/* Actionable Recommendations */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                <h5 className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  Engineering Recommendations
                </h5>
                <ul className="space-y-1.5 text-xs text-brand-900 pl-4 list-disc font-medium">
                  {evaluation.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Uncertainty Warnings */}
              {evaluation.uncertaintyWarnings.length > 0 && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-slate-500" />
                    Uncertainty & Governance Warnings
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-600 pl-4 list-disc">
                    {evaluation.uncertaintyWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 print:hidden">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          ← Return to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/history')}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
          >
            View Evaluation History
          </button>
          <button
            onClick={() => navigate('/evaluate')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Evaluate Another Response
          </button>
        </div>
      </div>
    </div>
  );
};
