import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { evaluationService } from '../services/evaluationService';
import { EvaluationResult } from '../types/evaluation';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ScoreIndicator } from '../components/shared/ScoreIndicator';
import { EmptyState } from '../components/shared/EmptyState';
import { Modal } from '../components/shared/Modal';

export const EvaluationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [verdictFilter, setVerdictFilter] = useState('all');
  const [scoreRangeFilter, setScoreRangeFilter] = useState('all');
  const [hallucinationFilter, setHallucinationFilter] = useState('all');

  // Sorting & Pagination
  const [sortField, setSortField] = useState<'timestamp' | 'overallScore' | 'id'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    const data = await evaluationService.getAll({
      searchQuery,
      verdict: verdictFilter,
      scoreRange: scoreRangeFilter,
      hallucinationStatus: hallucinationFilter
    });
    setEvaluations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [searchQuery, verdictFilter, scoreRangeFilter, hallucinationFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setVerdictFilter('all');
    setScoreRangeFilter('all');
    setHallucinationFilter('all');
    setCurrentPage(1);
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedRecords = [...evaluations].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'timestamp') {
      cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (sortField === 'overallScore') {
      cmp = a.overallScore - b.overallScore;
    } else if (sortField === 'id') {
      cmp = a.id.localeCompare(b.id);
    }
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const paginatedRecords = sortedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalCount = evaluations.length;
  const passCount = evaluations.filter(e => e.verdict === 'Pass').length;
  const needsImpCount = evaluations.filter(e => e.verdict === 'Needs Improvement').length;
  const failCount = evaluations.filter(e => e.verdict === 'Fail').length;

  const handleToggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(i => i !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const handleExportCsv = () => {
    const headers = ['Evaluation ID', 'Timestamp', 'Question', 'Response', 'Overall Score', 'Relevance', 'Accuracy', 'Hallucination', 'Completeness', 'Verdict'];
    const rows = evaluations.map(e => [
      e.id,
      e.timestamp,
      `"${e.question.replace(/"/g, '""')}"`,
      `"${e.response.replace(/"/g, '""')}"`,
      e.overallScore,
      e.dimensions.relevance.score,
      e.dimensions.accuracy.score,
      e.dimensions.hallucination.score,
      e.dimensions.completeness.score,
      e.verdict
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `evaluation_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const compareItems = evaluations.filter(e => selectedForCompare.includes(e.id));

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Evaluation History</h2>
          <p className="text-xs text-slate-500 mt-1">
            Review previous evaluations, compare outcomes, and investigate flagged responses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedForCompare.length === 2 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-brand-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Selected (2)</span>
            </button>
          )}

          <button
            onClick={handleExportCsv}
            disabled={evaluations.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Audited</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</div>
          <span className="text-[10px] text-slate-400">All recorded evaluations</span>
        </div>

        <div className="bg-white rounded-xl border border-green-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-600" /> Passed
          </span>
          <div className="text-2xl font-bold text-green-700 mt-1">{passCount}</div>
          <span className="text-[10px] text-green-600">Score ≥ 80% with no veto</span>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Needs Improvement
          </span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{needsImpCount}</div>
          <span className="text-[10px] text-amber-600">60% – 79% score range</span>
        </div>

        <div className="bg-white rounded-xl border border-red-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" /> Failed Gates
          </span>
          <div className="text-2xl font-bold text-red-700 mt-1">{failCount}</div>
          <span className="text-[10px] text-red-600">Score &lt; 60% or contradiction</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, prompt keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Verdict Filter */}
          <div>
            <select
              value={verdictFilter}
              onChange={(e) => {
                setVerdictFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold cursor-pointer"
            >
              <option value="all">All Verdicts</option>
              <option value="Pass">Pass</option>
              <option value="Needs Improvement">Needs Improvement</option>
              <option value="Fail">Fail</option>
            </select>
          </div>

          {/* Score Range Filter */}
          <div>
            <select
              value={scoreRangeFilter}
              onChange={(e) => {
                setScoreRangeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold cursor-pointer"
            >
              <option value="all">All Score Tiers</option>
              <option value="90-100">90 – 100 (Optimal)</option>
              <option value="75-89">75 – 89 (Good)</option>
              <option value="60-74">60 – 74 (Marginal)</option>
              <option value="0-59">0 – 59 (Failed)</option>
            </select>
          </div>

          {/* Hallucination Filter */}
          <div>
            <select
              value={hallucinationFilter}
              onChange={(e) => {
                setHallucinationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold cursor-pointer"
            >
              <option value="all">All Hallucination Statuses</option>
              <option value="clean">Verified Grounded</option>
              <option value="unsupported">Has Unsupported Claims</option>
              <option value="contradicted">Has Contradicted Claims</option>
            </select>
          </div>
        </div>

        {(searchQuery || verdictFilter !== 'all' || scoreRangeFilter !== 'all' || hallucinationFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Filtering records...</span>
            <button
              onClick={handleResetFilters}
              className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-10 text-center">Compare</th>
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Evaluation ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Question Preview</th>
                <th
                  onClick={() => handleSort('overallScore')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">Hallucination Status</th>
                <th className="py-3 px-4">Evaluator Model</th>
                <th
                  onClick={() => handleSort('timestamp')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Date & Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">Loading evaluation archives...</td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8">
                    <EmptyState
                      icon={History}
                      title="No Evaluation Records Found"
                      description="No evaluations matched your current search filters, or no evaluations have been submitted yet."
                      actionLabel="Run First Evaluation"
                      onAction={() => navigate('/evaluate')}
                    />
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => {
                  const isChecked = selectedForCompare.includes(item.id);
                  const hasContradiction = item.claims.some(c => c.status === 'contradicted');
                  const hasUnsupported = item.claims.some(c => c.status === 'unsupported');

                  return (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/evaluations/${item.id}`)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${isChecked ? 'bg-blue-50/40' : ''}`}
                    >
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCompare(item.id)}
                          className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                          title="Select to compare"
                        />
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-brand-600 whitespace-nowrap">
                        {item.id}
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-slate-900 truncate">{item.question}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.response}</div>
                      </td>

                      <td className="py-3 px-4">
                        <ScoreIndicator score={item.overallScore} size="sm" showBar={false} />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={item.verdict} size="sm" />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {hasContradiction ? (
                          <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Contradicted
                          </span>
                        ) : hasUnsupported ? (
                          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Unsupported
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Substantiated
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600 text-[11px] truncate max-w-[140px]">
                        {item.evaluatorModel.split(' ')[0]}
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {item.timestamp}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/evaluations/${item.id}`)}
                          className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-semibold text-xs group-hover:underline cursor-pointer"
                        >
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedRecords.length)} of {sortedRecords.length} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <Modal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        title="Side-by-Side Evaluation Comparison"
        subtitle="Contrast scores, factual findings, and verdict rationales across two evaluated answers"
        maxWidth="4xl"
      >
        {compareItems.length === 2 && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-4">
              {compareItems.map((item, idx) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-brand-600">Sample #{idx + 1}: {item.id}</span>
                    <StatusBadge status={item.verdict} size="sm" />
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px]">Question:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{item.question}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px]">Response:</span>
                    <p className="text-slate-700 mt-0.5 bg-white p-2.5 rounded border border-slate-200 line-clamp-4 font-sans">
                      {item.response}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-700">Overall Score:</span>
                    <span className="text-xl font-black text-slate-900">{item.overallScore} / 100</span>
                  </div>

                  {/* Dimension Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400">Relevance:</span>
                      <strong className="block text-slate-800">{item.dimensions.relevance.score}/5.0</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400">Accuracy:</span>
                      <strong className="block text-slate-800">{item.dimensions.accuracy.score}/5.0</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400">Hallucination:</span>
                      <strong className="block text-slate-800">{item.dimensions.hallucination.score}/5.0</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400">Completeness:</span>
                      <strong className="block text-slate-800">{item.dimensions.completeness.score}/5.0</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCompareModalOpen(false);
                      navigate(`/evaluations/${item.id}`);
                    }}
                    className="w-full py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded font-semibold text-center cursor-pointer mt-2"
                  >
                    Open Complete Report
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
