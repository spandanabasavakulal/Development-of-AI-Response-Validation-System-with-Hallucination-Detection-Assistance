import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  BarChart2,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Cpu,
  Database,
  Layers
} from 'lucide-react';
import { KpiCard } from '../components/shared/KpiCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ScoreIndicator } from '../components/shared/ScoreIndicator';
import { evaluationService } from '../services/evaluationService';
import { EvaluationResult } from '../types/evaluation';
import {
  EVALUATION_VOLUME_TRENDS,
  VERDICT_DISTRIBUTION,
  QUALITY_SCORE_TRENDS,
  SCORE_DISTRIBUTION
} from '../data/mockAnalytics';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  CartesianGrid
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('all');
  const [dateRange, setDateRange] = useState('Last 7 Days');

  const fetchRecords = async () => {
    setLoading(true);
    const data = await evaluationService.getAll({
      searchQuery,
      verdict: verdictFilter
    });
    setEvaluations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [searchQuery, verdictFilter]);

  // Compute live KPIs from evaluations
  const totalEvals = evaluations.length;
  const avgScore = totalEvals > 0 
    ? Math.round(evaluations.reduce((acc, e) => acc + e.overallScore, 0) / totalEvals)
    : 84;
  const flaggedCount = evaluations.filter(e => 
    e.verdict === 'Fail' || e.claims.some(c => c.status === 'contradicted' || c.status === 'unsupported')
  ).length;
  const hallucinationRate = totalEvals > 0
    ? ((evaluations.filter(e => e.claims.some(c => c.status === 'contradicted' || c.status === 'unsupported')).length / totalEvals) * 100).toFixed(1)
    : '14.2';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Evaluation Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitor response quality, factual support, hallucination risk, and evaluation performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Quarter to Date</option>
            </select>
          </div>

          <button
            onClick={() => navigate('/evaluate')}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Evaluate Response</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Evaluations"
          value={totalEvals.toLocaleString()}
          description="Audited prompts & answers"
          icon={FileCheck}
          change="+18.4%"
          trend="up"
        />
        <KpiCard
          title="Average Quality Score"
          value={`${avgScore} / 100`}
          description="Normalized 4-judge weighted composite"
          icon={TrendingUp}
          change="+4.2 pts"
          trend="up"
        />
        <KpiCard
          title="Hallucination Risk Rate"
          value={`${hallucinationRate}%`}
          description="Contradicted or ungrounded claims"
          icon={ShieldAlert}
          change="-2.1%"
          trend="down"
        />
        <KpiCard
          title="Evaluations Requiring Review"
          value={flaggedCount}
          description="Flagged for human verification"
          icon={AlertTriangle}
          change="+3 cases"
          trend="neutral"
        />
      </div>

      {/* Main Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evaluation Volume Over Time */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Evaluation Volume & Trend</h3>
              <p className="text-[11px] text-slate-500">Daily evaluation load vs passing validation rates</p>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              Sample Data
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EVALUATION_VOLUME_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="evalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="passGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="evaluations" name="Total Evaluations" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#evalGradient)" />
                <Area type="monotone" dataKey="passed" name="Passed Gate" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#passGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verdict Distribution Donut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Verdict Distribution</h3>
              <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                Sample
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">Cumulative distribution of evaluation outcomes</p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={VERDICT_DISTRIBUTION}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {VERDICT_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            {VERDICT_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-800">{item.value}</span>
                <span className="text-[10px] text-slate-500 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dimension Scores & Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dimension Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Evaluation Dimension Trajectory</h3>
              <p className="text-[11px] text-slate-500">7-day performance across the 4 specialized judges</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={QUALITY_SCORE_TRENDS.slice(-5)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="relevance" name="Relevance (20%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="accuracy" name="Accuracy (30%)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hallucination" name="Hallucination (25%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completeness" name="Completeness (25%)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Score Range Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Score Range Distribution</h3>
              <p className="text-[11px] text-slate-500">Number of evaluations grouped by normalized score buckets</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SCORE_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="count" name="Evaluations" radius={[4, 4, 0, 0]}>
                  {SCORE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Evaluations</h3>
            <p className="text-[11px] text-slate-500">Audit trail of inspected AI questions and answers</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by question or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 w-52"
              />
            </div>

            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">All Verdicts</option>
              <option value="Pass">Pass</option>
              <option value="Needs Improvement">Needs Improvement</option>
              <option value="Fail">Fail</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Evaluation ID</th>
                <th className="py-3 px-4">Question & Response Preview</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Hallucination</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">Loading audit records...</td>
                </tr>
              ) : evaluations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">No evaluations match your search filter.</td>
                </tr>
              ) : (
                evaluations.slice(0, 6).map((evalItem) => (
                  <tr
                    key={evalItem.id}
                    onClick={() => navigate(`/evaluations/${evalItem.id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-brand-600">
                      {evalItem.id}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{evalItem.question}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{evalItem.response}</div>
                    </td>
                    <td className="py-3 px-4">
                      <ScoreIndicator score={evalItem.overallScore} size="sm" showBar={false} />
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {evalItem.dimensions.accuracy.score.toFixed(1)} / 5.0
                    </td>
                    <td className="py-3 px-4">
                      {evalItem.claims.some(c => c.status === 'contradicted') ? (
                        <span className="text-xs font-semibold text-red-600">Contradicted</span>
                      ) : evalItem.claims.some(c => c.status === 'unsupported') ? (
                        <span className="text-xs font-semibold text-amber-600">Unsupported</span>
                      ) : (
                        <span className="text-xs font-semibold text-green-600">Substantiated</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={evalItem.verdict} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {evalItem.timestamp.split(' ')[0]}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/evaluations/${evalItem.id}`);
                        }}
                        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-semibold text-xs group-hover:underline cursor-pointer"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing latest {Math.min(6, evaluations.length)} of {evaluations.length} records</span>
          <button
            onClick={() => navigate('/history')}
            className="text-brand-600 hover:text-brand-700 font-semibold hover:underline cursor-pointer"
          >
            Open Complete History Table →
          </button>
        </div>
      </div>

      {/* System Status and Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-brand-600" />
              Evaluation Stack Status
            </h4>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Embeddings</span>
              <span className="font-semibold text-slate-800">all-MiniLM-L6-v2 (384-d)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Vector Index</span>
              <span className="font-semibold text-slate-800">FAISS (Exact Inner Product)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Judge Model</span>
              <span className="font-semibold text-slate-800">Gemini-1.5-Pro Multi-Agent</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Strictness Tier</span>
              <span className="font-semibold text-brand-700">Standard Enterprise</span>
            </div>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-brand-600" />
            Quick Workflows
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/evaluate')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-blue-50/50 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between cursor-pointer"
            >
              <span>Audit Single QA Response</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => navigate('/batch-evaluation')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-blue-50/50 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between cursor-pointer"
            >
              <span>Batch CSV Dataset Audit</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => navigate('/knowledge-base')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-blue-50/50 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between cursor-pointer"
            >
              <span>Upload Reference Grounding Docs</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Flagged Audit Notice */}
        <div className="p-5 bg-amber-50/70 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Quality Sentinel Alert
            </div>
            <p className="text-xs text-amber-800 mt-2 leading-relaxed">
              <strong>Evaluation EVAL-2026-0839</strong> triggered severe contradiction gates: Claimed Gemini 1.5 Pro was released on "April 31, 2024" and operates with zero GPU inference cost.
            </p>
          </div>
          <button
            onClick={() => navigate('/evaluations/EVAL-2026-0839')}
            className="mt-3 text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Review Flagged Findings →
          </button>
        </div>
      </div>
    </div>
  );
};
