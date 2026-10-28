import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Loader2,
  Clock,
  Check
} from 'lucide-react';
import {
  batchService,
  SAMPLE_CSV_TEMPLATE,
  parseAndValidateCsv,
  CsvValidationResult
} from '../services/batchService';
import { BatchJob, BatchItem } from '../types/batch';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ScoreIndicator } from '../components/shared/ScoreIndicator';

export const BatchEvaluationPage: React.FC = () => {
  const navigate = useNavigate();

  // Upload & File State
  const [csvContent, setCsvContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [validationResult, setValidationResult] = useState<CsvValidationResult | null>(null);

  // Config State
  const [batchName, setBatchName] = useState('Enterprise QA Evaluation Set A');
  const [selectedModel, setSelectedModel] = useState('Gemini-1.5-Pro (Judge Multi-Agent)');

  // Job Execution State
  const [currentJob, setCurrentJob] = useState<BatchJob | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('all');

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evaluation_batch_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvContent(text);
        const result = parseAndValidateCsv(text);
        setValidationResult(result);
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSample = () => {
    setFileName('sample_evaluation_qa_dataset.csv');
    setCsvContent(SAMPLE_CSV_TEMPLATE);
    const result = parseAndValidateCsv(SAMPLE_CSV_TEMPLATE);
    setValidationResult(result);
  };

  const handleStartBatch = async () => {
    if (!validationResult || validationResult.validRows === 0) return;

    const job = batchService.createBatchJob(
      batchName,
      selectedModel,
      validationResult.parsedItems
    );

    setCurrentJob(job);
    setIsExecuting(true);

    await batchService.runBatchSimulation(job, (updated) => {
      setCurrentJob({ ...updated });
    });

    setIsExecuting(false);
  };

  const handleExportCsv = () => {
    if (!currentJob) return;
    const csv = batchService.exportBatchToCsv(currentJob);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentJob.id}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!currentJob) return;
    const blob = new Blob([JSON.stringify(currentJob, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentJob.id}_results.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredItems = currentJob?.items.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(tableSearch.toLowerCase()) ||
                          item.response.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesVerdict = verdictFilter === 'all' || item.verdict === verdictFilter;
    return matchesSearch && matchesVerdict;
  }) || [];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Batch Evaluation</h2>
          <p className="text-xs text-slate-500 mt-1">
            Run consistent response-quality checks across datasets and review results at scale.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Template</span>
          </button>
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-brand-700 border border-blue-200 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Load Sample Dataset</span>
          </button>
        </div>
      </div>

      {/* Dataset Upload & Configuration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Dropzone */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-600" />
            1. Select or Upload Evaluation Dataset (CSV)
          </h3>

          <div className="border-2 border-dashed border-slate-300 hover:border-brand-400 rounded-xl p-8 text-center transition-colors bg-slate-50/50">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="batch-csv-input"
              className="hidden"
            />
            <label htmlFor="batch-csv-input" className="cursor-pointer space-y-2 block">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-600 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                {fileName ? fileName : 'Click to browse or drop CSV file'}
              </div>
              <p className="text-[11px] text-slate-400">
                Required columns: <code>question</code>, <code>response</code>, optional <code>reference_answer</code>
              </p>
            </label>
          </div>

          {/* Validation Report Banner */}
          {validationResult && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-800">Dataset Validation Summary:</span>
                <span className={`px-2 py-0.5 rounded text-[11px] ${
                  validationResult.invalidRows === 0 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {validationResult.validRows} valid / {validationResult.totalRows} total rows
                </span>
              </div>

              {validationResult.errors.length > 0 && (
                <div className="text-red-700 bg-red-50 p-2.5 rounded border border-red-200 space-y-1">
                  {validationResult.errors.map((err, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Batch Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              2. Batch Audit Settings
            </h3>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1">Batch Run Name</label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                disabled={isExecuting}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1">Judge Architecture</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isExecuting}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium cursor-pointer"
              >
                <option value="Gemini-1.5-Pro (Judge Multi-Agent)">Gemini-1.5-Pro (Judge Multi-Agent)</option>
                <option value="Claude-3.5-Sonnet (Judge Multi-Agent)">Claude-3.5-Sonnet</option>
                <option value="GPT-4o (Judge Multi-Agent)">GPT-4o</option>
              </select>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 text-[11px] text-brand-900 space-y-1">
              <div>Strictness: <strong>Standard Enterprise</strong></div>
              <div>Weights: <strong>20% Rel / 30% Acc / 25% Halluc / 25% Comp</strong></div>
            </div>
          </div>

          <button
            onClick={handleStartBatch}
            disabled={!validationResult || validationResult.validRows === 0 || isExecuting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Batch Rows...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Batch Evaluation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Card when job exists */}
      {currentJob && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-bold text-brand-600">{currentJob.id}</span>
              <h3 className="text-base font-bold text-slate-900">{currentJob.name}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                currentJob.status === 'completed' ? 'bg-green-100 text-green-800' :
                currentJob.status === 'running' ? 'bg-blue-100 text-brand-800 animate-pulse' :
                'bg-slate-100 text-slate-800'
              }`}>
                {currentJob.status}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>Progress: {currentJob.processedRows} of {currentJob.totalRows} completed</span>
              <span>{Math.round((currentJob.processedRows / currentJob.totalRows) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentJob.processedRows / currentJob.totalRows) * 100}%` }}
              />
            </div>
          </div>

          {/* Stat counters */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Audited</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{currentJob.processedRows}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-xl border border-green-200">
              <span className="text-[10px] text-green-700 uppercase font-semibold">Passed Gates</span>
              <div className="text-lg font-bold text-green-700 mt-0.5">{currentJob.successfulCount}</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] text-amber-700 uppercase font-semibold">Flagged / Failed</span>
              <div className="text-lg font-bold text-amber-700 mt-0.5">{currentJob.failedCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Results Table */}
      {currentJob && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Batch Audit Results</h3>
              <p className="text-[11px] text-slate-500">Evaluated question-response pairs from uploaded dataset</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter rows..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 w-44"
                />
              </div>

              <select
                value={verdictFilter}
                onChange={(e) => setVerdictFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-semibold cursor-pointer"
              >
                <option value="all">All Verdicts</option>
                <option value="Pass">Pass Only</option>
                <option value="Needs Improvement">Needs Improvement</option>
                <option value="Fail">Fail</option>
              </select>

              <button
                onClick={handleExportCsv}
                disabled={currentJob.items.length === 0}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer"
              >
                CSV
              </button>
              <button
                onClick={handleExportJson}
                disabled={currentJob.items.length === 0}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer"
              >
                JSON
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-[10px] uppercase">
                  <th className="py-3 px-4 w-12 text-center">Row</th>
                  <th className="py-3 px-4">Question Preview</th>
                  <th className="py-3 px-4">Response Preview</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Relevance</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Hallucination</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400 text-center">
                      #{item.rowNumber}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate font-semibold text-slate-900">
                      {item.question}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                      {item.response}
                    </td>
                    <td className="py-3 px-4">
                      {item.overallScore !== undefined ? (
                        <ScoreIndicator score={item.overallScore} size="sm" showBar={false} />
                      ) : (
                        <span className="text-slate-400 font-mono">--</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {item.relevanceScore !== undefined ? `${item.relevanceScore.toFixed(1)}/5` : '--'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {item.accuracyScore !== undefined ? `${item.accuracyScore.toFixed(1)}/5` : '--'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {item.hallucinationScore !== undefined ? `${item.hallucinationScore.toFixed(1)}/5` : '--'}
                    </td>
                    <td className="py-3 px-4">
                      {item.verdict ? (
                        <StatusBadge status={item.verdict} size="sm" />
                      ) : (
                        <span className="text-slate-400 text-[11px]">Processing...</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.evaluationId && (
                        <button
                          onClick={() => navigate('/evaluations/latest')}
                          className="text-brand-600 hover:text-brand-800 font-semibold text-xs hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
