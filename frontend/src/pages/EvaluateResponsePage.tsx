import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Sparkles,
  RotateCcw,
  Upload,
  FileText,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { evaluationService, StageProgress } from '../services/evaluationService';
import { PRESET_EXAMPLES } from '../data/mockEvaluations';
import { Modal } from '../components/shared/Modal';

export const EvaluateResponsePage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [referenceAnswer, setReferenceAnswer] = useState('');
  const [referenceDocument, setReferenceDocument] = useState<File | null>(null);
  const [referenceDocumentName, setReferenceDocumentName] = useState('Enterprise_AI_Architecture_Guidelines_v3.pdf');
  const [evaluatorModel, setEvaluatorModel] = useState('Gemini-1.5-Pro (Judge Multi-Agent)');
  const [strictness, setStrictness] = useState<'lenient' | 'standard' | 'strict'>('standard');
  const [retrievalDepth, setRetrievalDepth] = useState('Top 4 Chunks');

  // Execution & Progress State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<StageProgress | null>(null);
  const [progressStages, setProgressStages] = useState<StageProgress[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showExampleModal, setShowExampleModal] = useState(false);

  const handleLoadExample = (example: typeof PRESET_EXAMPLES[0]) => {
    setQuestion(example.question);
    setResponse(example.response);
    setReferenceAnswer(example.referenceAnswer || '');
    setReferenceDocumentName(example.referenceDocument || 'Enterprise_Knowledge_Corpus_v2.pdf');
    setShowExampleModal(false);
    setErrorMessage('');
  };

  const handleClear = () => {
    setQuestion('');
    setResponse('');
    setReferenceAnswer('');
    setReferenceDocument(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setErrorMessage('Question is required for evaluation.');
      return;
    }
    if (!response.trim()) {
      setErrorMessage('AI Response text is required for evaluation.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    setProgressStages([]);

    try {
      const result = await evaluationService.submitEvaluation(
        {
          question: question.trim(),
          response: response.trim(),
          referenceAnswer: referenceAnswer.trim() || undefined,
          referenceDocumentName: referenceDocument ? referenceDocument.name : referenceDocumentName,
          evaluatorModel,
          strictness,
        },
        (stageProgress) => {
          setCurrentProgress(stageProgress);
          setProgressStages(prev => {
            const index = prev.findIndex(p => p.stage === stageProgress.stage);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = stageProgress;
              return updated;
            }
            return [...prev, stageProgress];
          });
        }
      );

      // Successfully finished -> navigate to results page
      navigate(`/evaluations/${result.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Evaluation pipeline encountered an unexpected error.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Heading */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Evaluate Response</h2>
          <p className="text-xs text-slate-500 mt-1">
            Validate AI-generated answers using evidence-based evaluation and specialized AI judges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowExampleModal(true)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Load Example Presets</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Textarea */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Original Question / Prompt</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {question.length} characters
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Enter the user query or task prompt that was provided to the AI model.
          </p>
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., Explain the architecture of Retrieval-Augmented Generation (RAG) and its key benefits for enterprise AI systems."
            className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans"
          />
        </div>

        {/* AI Response Textarea */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span>AI Response to Evaluate</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {response.length} characters
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Paste the complete generated or candidate answer that requires factual verification and hallucination auditing.
          </p>
          <textarea
            rows={6}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={isSubmitting}
            placeholder="Paste the candidate response here..."
            className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans leading-relaxed"
          />
        </div>

        {/* Optional Reference Answer & Grounding Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reference Answer */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Optional Reference Answer
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Optional</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Provide an ideal gold-standard answer for accuracy and completeness benchmark comparison.
            </p>
            <textarea
              rows={4}
              value={referenceAnswer}
              onChange={(e) => setReferenceAnswer(e.target.value)}
              disabled={isSubmitting}
              placeholder="Optional ground truth reference..."
              className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans"
            />
          </div>

          {/* Reference Document / Source Corpus */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Grounding Knowledge Base
                </label>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-medium">
                  FAISS Indexed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Select the reference corpus used by the RAG Retriever to cross-examine claims.
              </p>

              <div className="mt-3">
                <select
                  value={referenceDocumentName}
                  onChange={(e) => setReferenceDocumentName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium cursor-pointer"
                >
                  <option value="Enterprise_AI_Architecture_Guidelines_v3.pdf">
                    Enterprise_AI_Architecture_Guidelines_v3.pdf (142 chunks)
                  </option>
                  <option value="Google_Gemini_Technical_Report_2024.pdf">
                    Google_Gemini_Technical_Report_2024.pdf (288 chunks)
                  </option>
                  <option value="Vector_Databases_Comparative_Study_2025.pdf">
                    Vector_Databases_Comparative_Study_2025.pdf (96 chunks)
                  </option>
                  <option value="AAP_Pediatric_Infection_Guidelines_2024.pdf">
                    AAP_Pediatric_Infection_Guidelines_2024.pdf (165 chunks)
                  </option>
                  <option value="AWS_Serverless_Performance_Whitepaper.pdf">
                    AWS_Serverless_Performance_Whitepaper.pdf (110 chunks)
                  </option>
                </select>
              </div>

              {/* Upload custom doc */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Or upload a specific document for this evaluation:
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".pdf,.txt,.docx,.md,.json"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setReferenceDocument(e.target.files[0]);
                          setReferenceDocumentName(e.target.files[0].name);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                    {referenceDocument ? referenceDocument.name : 'No file chosen (PDF, TXT, MD)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded border border-slate-200">
              Note: Unindexed files will be automatically parsed, chunked, and vectorized via Sentence Transformers (all-MiniLM-L6-v2).
            </div>
          </div>
        </div>

        {/* Evaluation Settings Drawer / Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              Evaluation Configuration & Judge Settings
            </h4>
            <span className="text-[10px] text-slate-400">Multi-Agent Protocol</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Judge Architecture</label>
              <select
                value={evaluatorModel}
                onChange={(e) => setEvaluatorModel(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 cursor-pointer"
              >
                <option value="Gemini-1.5-Pro (Judge Multi-Agent)">Gemini-1.5-Pro (Recommended)</option>
                <option value="Claude-3.5-Sonnet (Judge Multi-Agent)">Claude-3.5-Sonnet (Multi-Agent)</option>
                <option value="GPT-4o (Judge Multi-Agent)">GPT-4o (Judge Multi-Agent)</option>
                <option value="Llama-3-70B-Instruct (Judge Local)">Llama-3-70B-Instruct (On-Premises)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Audit Strictness</label>
              <select
                value={strictness}
                onChange={(e) => setStrictness(e.target.value as any)}
                disabled={isSubmitting}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 cursor-pointer"
              >
                <option value="standard">Standard Enterprise (Balanced)</option>
                <option value="strict">Strict Zero-Tolerance (High Rigor)</option>
                <option value="lenient">Lenient (Permissive Paraphrase)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Evidence Retrieval Window</label>
              <select
                value={retrievalDepth}
                onChange={(e) => setRetrievalDepth(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 cursor-pointer"
              >
                <option value="Top 2 Chunks">Top 2 Relevant Chunks</option>
                <option value="Top 4 Chunks">Top 4 Relevant Chunks (Optimal)</option>
                <option value="Top 8 Chunks">Top 8 Deep Chunks (Extended Context)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Execution Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Multi-agent workflow triggers 4 specialized judges + verdict aggregator.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Multi-Agent Evaluation...</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4" />
                <span>Evaluate Response</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Progress Visualization Drawer when Submitting */}
      {isSubmitting && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentProgress ? currentProgress.label : 'Initiating Evaluation Pipeline...'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {currentProgress?.detail || 'Coordinating with Multi-Agent Orchestrator...'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-brand-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Stage {progressStages.length} / 9
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, (progressStages.length / 9) * 100)}%` }}
            />
          </div>

          {/* Step history logs */}
          <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto font-mono text-[11px]">
            {progressStages.map((st, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800">{st.label}</span>
                <span className="text-slate-400 text-[10px]">({st.detail})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Selection Modal */}
      <Modal
        isOpen={showExampleModal}
        onClose={() => setShowExampleModal(false)}
        title="Select Demonstration Test Case"
        subtitle="Choose from realistic pre-configured AI responses to observe different evaluation behaviors"
        maxWidth="lg"
      >
        <div className="space-y-3">
          {PRESET_EXAMPLES.map((ex, idx) => (
            <div
              key={idx}
              onClick={() => handleLoadExample(ex)}
              className="p-4 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 group-hover:text-brand-700">
                  {ex.title}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ex.badgeColor}`}>
                  {ex.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                {ex.question}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Corpus: {ex.referenceDocument}</span>
                <span className="text-brand-600 font-semibold group-hover:underline">Load Preset →</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
