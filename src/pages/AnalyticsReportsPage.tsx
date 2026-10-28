import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  FileText,
  Calendar,
  Layers,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  Printer,
  Sparkles,
  Info
} from 'lucide-react';
import {
  EVALUATION_VOLUME_TRENDS,
  QUALITY_SCORE_TRENDS,
  VERDICT_DISTRIBUTION,
  HALLUCINATION_FINDINGS_TREND,
  SCORE_DISTRIBUTION,
  AGENT_PERFORMANCE_METRICS
} from '../data/mockAnalytics';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Modal } from '../components/shared/Modal';

export const AnalyticsReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [modelFilter, setModelFilter] = useState('All Models');
  const [verdictFilter, setVerdictFilter] = useState('All Verdicts');

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'summary' | 'hallucination' | 'agent_perf'>('summary');
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadReport = (format: 'pdf' | 'csv' | 'json') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      if (format === 'pdf') {
        window.print();
      } else if (format === 'json') {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
          generatedAt: new Date().toISOString(),
          reportType,
          filters: { dateRange, modelFilter, verdictFilter },
          qualityMetrics: QUALITY_SCORE_TRENDS,
          hallucinationFindings: HALLUCINATION_FINDINGS_TREND,
          agentMetrics: AGENT_PERFORMANCE_METRICS
        }, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', `ai_evaluation_report_${reportType}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
      } else if (format === 'csv') {
        const headers = ['Date', 'Supported Claims', 'Unsupported Claims', 'Contradicted Claims', 'Inconclusive Claims'];
        const rows = HALLUCINATION_FINDINGS_TREND.map(h => [h.date, h.supported, h.unsupported, h.contradicted, h.inconclusive]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `hallucination_findings_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIsReportModalOpen(false);
    }, 400);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Analytics & Evaluation Reports</h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyze evaluation trends, quality dimensions, hallucination findings, and system performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* Global Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Year to Date</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer"
            >
              <option>All Models</option>
              <option>Gemini-1.5-Pro</option>
              <option>Claude-3.5-Sonnet</option>
              <option>GPT-4o</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer"
            >
              <option>All Verdicts</option>
              <option>Pass Only</option>
              <option>Needs Improvement Only</option>
              <option>Fail Only</option>
            </select>
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          Dataset: 1,240 Total Audited Evaluations
        </span>
      </div>

      {/* Row 1: Volume & Quality Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evaluation Volume */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Evaluation Load & Throughput</h3>
              <p className="text-[11px] text-slate-500">Evaluations per day vs successful completions</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Sample Data</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EVALUATION_VOLUME_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="evaluations" name="Total Audits" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.15} />
                <Area type="monotone" dataKey="passed" name="Passed Gate" stroke="#16A34A" fill="#10B981" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Score Dimensions Trends */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quality Dimensions Over Time</h3>
              <p className="text-[11px] text-slate-500">Daily normalized score tracking across 4 dimensions</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Normalized 0–100</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={QUALITY_SCORE_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="relevance" name="Relevance" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="hallucination" name="Hallucination" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="completeness" name="Completeness" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Hallucination Findings & Verdict Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hallucination Findings Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hallucination & Evidence Finding Breakdown</h3>
              <p className="text-[11px] text-slate-500">
                Claims classified into: Supported, Unsupported, Contradicted, Inconclusive
              </p>
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
              Critical Audit Signal
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 mb-3 text-[11px] text-slate-600">
            <strong>Key Distinction:</strong> An <em>unsupported</em> claim lacks sufficient reference text, but is not automatically false. Only <em>contradicted</em> claims have verified evidence disproving the statement.
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HALLUCINATION_FINDINGS_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="supported" name="Supported Claims" fill="#10B981" stackId="a" />
                <Bar dataKey="unsupported" name="Unsupported (Missing Ref)" fill="#F59E0B" stackId="a" />
                <Bar dataKey="contradicted" name="Contradicted Claims" fill="#EF4444" stackId="a" />
                <Bar dataKey="inconclusive" name="Inconclusive" fill="#94A3B8" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verdict Distribution Donut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Evaluation Outcomes</h3>
              <span className="text-[10px] text-slate-400">Total: 840</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">Passing rate vs flagged interventions</p>
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
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            {VERDICT_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-800">{item.value}</span>
                <span className="text-[10px] text-slate-500 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Agent Telemetry & Score Range */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Specialized Judge Performance & Latency</h3>
              <p className="text-[11px] text-slate-500">Benchmark metrics for each agent in the multi-agent system</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-[10px] uppercase">
                  <th className="py-2.5 px-3">Agent Node</th>
                  <th className="py-2.5 px-3">Concordance</th>
                  <th className="py-2.5 px-3">Avg Latency</th>
                  <th className="py-2.5 px-3">Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AGENT_PERFORMANCE_METRICS.map((agent, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{agent.agent}</td>
                    <td className="py-2.5 px-3 text-green-700 font-bold">{agent.accuracy}%</td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">{agent.avgLatencyMs}ms</td>
                    <td className="py-2.5 px-3 text-slate-500">{agent.errorRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overall Score Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Evaluation Score Range Distribution</h3>
              <p className="text-[11px] text-slate-500">Evaluation count across 5 normalized score brackets</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SCORE_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
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

      {/* Report Generation Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Generate Executive Evaluation Report"
        subtitle="Export structured quality documentation and audit records"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Select Report Template</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'summary', title: 'Executive Quality & Compliance Summary', desc: 'Overview of evaluation volume, pass rates, and dimension scores' },
                { id: 'hallucination', title: 'Hallucination & Factual Grounding Audit', desc: 'Detailed breakdown of supported, unsupported, and contradicted assertions' },
                { id: 'agent_perf', title: 'Multi-Agent Latency & Precision Telemetry', desc: 'Per-judge execution times, prompt token usage, and accuracy metrics' }
              ].map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setReportType(tpl.id as any)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    reportType === tpl.id ? 'border-brand-500 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900">{tpl.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{tpl.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px] text-slate-600">
            <div>Scope: <strong>{dateRange}</strong> ({modelFilter}, {verdictFilter})</div>
            <div>Generated by: <strong>Infosys Springboard AI Eval Sentinel</strong></div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => handleDownloadReport('json')}
              disabled={isExporting}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold cursor-pointer"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleDownloadReport('csv')}
              disabled={isExporting}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold cursor-pointer"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleDownloadReport('pdf')}
              disabled={isExporting}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF Report</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
