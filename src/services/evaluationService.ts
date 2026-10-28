import { EvaluationResult, EvaluationFilter, OverallVerdict, ClaimFinding, ClaimStatus } from '../types/evaluation';
import { INITIAL_EVALUATIONS } from '../data/mockEvaluations';

const STORAGE_KEY = 'ai_eval_system_records_v1';

export interface EvaluationSubmission {
  question: string;
  response: string;
  referenceAnswer?: string;
  referenceDocumentName?: string;
  evaluatorModel?: string;
  strictness?: 'lenient' | 'standard' | 'strict';
}

export type PipelineStage = 
  | 'input_validation'
  | 'claim_extraction'
  | 'evidence_retrieval'
  | 'relevance_evaluation'
  | 'accuracy_evaluation'
  | 'hallucination_assessment'
  | 'completeness_evaluation'
  | 'verdict_aggregation'
  | 'results_generation';

export interface StageProgress {
  stage: PipelineStage;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: string;
}

const getStoredEvaluations = (): EvaluationResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVALUATIONS));
      return INITIAL_EVALUATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EVALUATIONS;
  }
};

const saveStoredEvaluations = (records: EvaluationResult[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save evaluations in localStorage', err);
  }
};

export const evaluationService = {
  getAll: async (filter?: EvaluationFilter): Promise<EvaluationResult[]> => {
    let records = getStoredEvaluations();

    if (filter) {
      if (filter.searchQuery && filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        records = records.filter(r => 
          r.question.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.response.toLowerCase().includes(q)
        );
      }
      if (filter.verdict && filter.verdict !== 'all') {
        records = records.filter(r => r.verdict === filter.verdict);
      }
      if (filter.scoreRange && filter.scoreRange !== 'all') {
        if (filter.scoreRange === '90-100') records = records.filter(r => r.overallScore >= 90);
        else if (filter.scoreRange === '75-89') records = records.filter(r => r.overallScore >= 75 && r.overallScore < 90);
        else if (filter.scoreRange === '60-74') records = records.filter(r => r.overallScore >= 60 && r.overallScore < 75);
        else if (filter.scoreRange === '0-59') records = records.filter(r => r.overallScore < 60);
      }
      if (filter.hallucinationStatus && filter.hallucinationStatus !== 'all') {
        records = records.filter(r => {
          const hasContradiction = r.claims.some(c => c.status === 'contradicted');
          const hasUnsupported = r.claims.some(c => c.status === 'unsupported');
          if (filter.hallucinationStatus === 'clean') return !hasContradiction && !hasUnsupported;
          if (filter.hallucinationStatus === 'contradicted') return hasContradiction;
          if (filter.hallucinationStatus === 'unsupported') return hasUnsupported;
          return true;
        });
      }
    }

    // Sort by timestamp desc
    return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getById: async (id: string): Promise<EvaluationResult | null> => {
    const records = getStoredEvaluations();
    const found = records.find(r => r.id.toLowerCase() === id.toLowerCase());
    return found || null;
  },

  submitEvaluation: async (
    payload: EvaluationSubmission,
    onProgress?: (stage: StageProgress) => void
  ): Promise<EvaluationResult> => {
    const stages: Array<{ stage: PipelineStage; label: string; durationMs: number; detail: string }> = [
      { stage: 'input_validation', label: 'Validating Input & Token Guardrails', durationMs: 250, detail: 'Checking token limits and prompt safety guardrails' },
      { stage: 'claim_extraction', label: 'Extracting Atomic Factual Claims', durationMs: 400, detail: 'Deconstructing response into discrete testable assertions' },
      { stage: 'evidence_retrieval', label: 'FAISS Semantic Evidence Retrieval', durationMs: 450, detail: 'Querying vector index for relevant passages (all-MiniLM-L6-v2)' },
      { stage: 'relevance_evaluation', label: 'Agent 2: Relevance Judge Assessing Intent', durationMs: 350, detail: 'Calculating prompt-response semantic alignment score' },
      { stage: 'accuracy_evaluation', label: 'Agent 3: Accuracy Judge Cross-Referencing Evidence', durationMs: 400, detail: 'Cross-verifying extracted claims against retrieved passages' },
      { stage: 'hallucination_assessment', label: 'Agent 4: Hallucination Detection Sentinel', durationMs: 380, detail: 'Classifying claims: Supported, Unsupported, Contradicted, Inconclusive' },
      { stage: 'completeness_evaluation', label: 'Agent 5: Completeness Judge Analyzing Omissions', durationMs: 320, detail: 'Checking coverage of critical dimensions and caveats' },
      { stage: 'verdict_aggregation', label: 'Verdict Agent: Weighted Multi-Score Aggregation', durationMs: 250, detail: 'Synthesizing weighted dimensions and applying safety gates' },
      { stage: 'results_generation', label: 'Compiling Structured Evaluation Findings', durationMs: 200, detail: 'Generating explainability report, uncertainty markers, and charts' },
    ];

    for (const step of stages) {
      if (onProgress) {
        onProgress({ stage: step.stage, label: step.label, status: 'running', detail: step.detail });
      }
      await new Promise(res => setTimeout(res, step.durationMs));
      if (onProgress) {
        onProgress({ stage: step.stage, label: step.label, status: 'completed', detail: `${step.label} complete` });
      }
    }

    // Synthesize evaluation result
    const newId = `EVAL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timestampStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Intelligent claim extraction and scoring simulation based on text heuristics
    const respLower = payload.response.toLowerCase();
    const hasHallucinationClues = respLower.includes('april 31') || 
                                 respLower.includes('zero gpu') || 
                                 respLower.includes('double the dosage') ||
                                 respLower.includes('100% mathematical accuracy');
    const isShortOrIncomplete = payload.response.length < 80;

    let overallScore = 88;
    let relevanceScore = 4.6;
    let accuracyScore = 4.5;
    let hallucinationScore = 4.7;
    let completenessScore = 4.2;
    let verdict: OverallVerdict = 'Pass';

    const claims: ClaimFinding[] = [];

    // Break sentences into claims
    const sentences = payload.response
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 15);

    const targetSentences = sentences.length > 0 ? sentences.slice(0, 5) : [payload.response];

    targetSentences.forEach((sentence, index) => {
      let status: ClaimStatus = 'supported';
      let confidence = 0.94 - (index * 0.03);
      let explanation = 'Corresponds with verified background references and enterprise domain knowledge.';
      const sentLower = sentence.toLowerCase();

      if (sentLower.includes('april 31') || sentLower.includes('double the dosage') || sentLower.includes('zero gpu')) {
        status = 'contradicted';
        confidence = 0.98;
        explanation = 'Directly contradicts validated reference documentation and established physical or organizational facts.';
      } else if (sentLower.includes('100% mathematical') || sentLower.includes('guarantee') || sentLower.includes('always')) {
        status = 'unsupported';
        confidence = 0.88;
        explanation = 'Lacks adequate empirical corroboration in available reference materials; unverified generalization.';
      } else if (sentLower.length < 25) {
        status = 'inconclusive';
        confidence = 0.72;
        explanation = 'Claim phrasing is ambiguous or lacks sufficient context for high-confidence attribution.';
      }

      claims.push({
        id: `CLM-${index + 101}`,
        claimNumber: index + 1,
        claimText: sentence,
        status,
        confidence,
        explanation,
        evidenceQuote: status === 'supported' 
          ? `Indexed passage confirms: "${sentence.slice(0, 90)}..."` 
          : status === 'contradicted' 
          ? `Authoritative corpus contradicts: Stated claim conflicts with verified benchmark and safety records.`
          : undefined,
        sourceDocument: payload.referenceDocumentName || 'Enterprise_Knowledge_Corpus_v2.pdf',
        chunkId: `CHUNK-${index + 10}`,
        similarityScore: status === 'supported' ? 0.89 : 0.65
      });
    });

    if (hasHallucinationClues) {
      overallScore = 46;
      accuracyScore = 1.9;
      hallucinationScore = 1.6;
      completenessScore = 2.6;
      verdict = 'Fail';
    } else if (isShortOrIncomplete) {
      overallScore = 68;
      completenessScore = 2.4;
      verdict = 'Needs Improvement';
    } else {
      verdict = 'Pass';
    }

    const newResult: EvaluationResult = {
      id: newId,
      question: payload.question,
      response: payload.response,
      referenceAnswer: payload.referenceAnswer,
      referenceDocumentName: payload.referenceDocumentName || 'Default_Verified_Enterprise_Corpus.pdf',
      timestamp: timestampStr,
      evaluatorModel: payload.evaluatorModel || 'Gemini-1.5-Pro (Judge Multi-Agent)',
      evaluatorStrictness: payload.strictness || 'standard',
      overallScore,
      verdict,
      confidenceScore: Math.round(claims.reduce((acc, c) => acc + c.confidence, 0) / (claims.length || 1) * 100),
      verdictSummary: verdict === 'Pass' 
        ? 'The submitted response demonstrates robust grounding, high relevance to the question, and verifiable evidence citations.'
        : verdict === 'Needs Improvement'
        ? 'The response is largely relevant but omits significant required facets or includes unsubstantiated assertions.'
        : 'The response failed evaluation gates due to contradicted factual claims or severe hallucination risk.',
      strengths: [
        'Maintains structured clarity in thematic exposition.',
        'Addresses core subject entities directly.'
      ],
      identifiedIssues: hasHallucinationClues ? [
        'Detected contradiction against verified technical/clinical facts.',
        'High hallucination frequency on factual details.'
      ] : isShortOrIncomplete ? [
        'Response is brief and omits contextual edge cases.'
      ] : [],
      unsupportedClaimsSummary: claims.filter(c => c.status === 'unsupported' || c.status === 'contradicted').map(c => c.claimText),
      missingInformation: isShortOrIncomplete ? ['Practical enterprise implementation examples and architectural caveats.'] : [],
      recommendations: verdict === 'Pass' ? [
        'Response meets release thresholds for enterprise AI consumption.'
      ] : [
        'Refine prompting constraints to prevent unsubstantiated numerical or calendar claims.',
        'Inject domain RAG context prior to user-facing generation.'
      ],
      uncertaintyWarnings: [
        `Evaluation conducted with ${payload.strictness || 'standard'} threshold strictness. Missing reference evidence does not equate to mathematical falsity without contradiction.`
      ],
      dimensions: {
        relevance: {
          name: 'Relevance',
          score: relevanceScore,
          normalizedScore: Math.round(relevanceScore * 20),
          weight: 0.20,
          status: relevanceScore >= 4 ? 'optimal' : relevanceScore >= 3 ? 'acceptable' : 'concerning',
          explanation: 'Calculated by Agent 2 (Relevance Judge) comparing prompt semantic vector with answer intent.',
          keyObservation: 'Prompt intent alignment.'
        },
        accuracy: {
          name: 'Accuracy',
          score: accuracyScore,
          normalizedScore: Math.round(accuracyScore * 20),
          weight: 0.30,
          status: accuracyScore >= 4 ? 'optimal' : accuracyScore >= 3 ? 'acceptable' : 'critical',
          explanation: 'Calculated by Agent 3 (Accuracy Judge) cross-referencing decomposed claims against retrieved evidence.',
          keyObservation: 'Fact verification across verified documents.'
        },
        hallucination: {
          name: 'Hallucination Assessment',
          score: hallucinationScore,
          normalizedScore: Math.round(hallucinationScore * 20),
          weight: 0.25,
          status: hallucinationScore >= 4 ? 'optimal' : hallucinationScore >= 3 ? 'acceptable' : 'critical',
          explanation: 'Calculated by Agent 4 (Hallucination Sentinel). Distinguishes supported vs ungrounded claims.',
          keyObservation: `${claims.filter(c => c.status === 'contradicted').length} contradictions, ${claims.filter(c => c.status === 'unsupported').length} unsupported claims.`
        },
        completeness: {
          name: 'Completeness',
          score: completenessScore,
          normalizedScore: Math.round(completenessScore * 20),
          weight: 0.25,
          status: completenessScore >= 4 ? 'optimal' : completenessScore >= 3 ? 'acceptable' : 'concerning',
          explanation: 'Calculated by Agent 5 (Completeness Judge) assessing topical omissions and missing perspectives.',
          keyObservation: 'Omission analysis across expected facets.'
        }
      },
      claims,
      agentRationales: {
        supervisor: `Orchestrated workflow over ${claims.length} decomposed atomic assertions. RAG search fetched top matching chunks.`,
        relevanceJudge: `Relevance evaluated at ${relevanceScore}/5. Answer targets the requested subject matter directly.`,
        accuracyJudge: `Accuracy evaluated at ${accuracyScore}/5. Validated against corpus ${payload.referenceDocumentName || 'Default Knowledge Base'}.`,
        hallucinationDetector: `Hallucination score ${hallucinationScore}/5. ${claims.filter(c => c.status === 'supported').length}/${claims.length} claims substantiated.`,
        completenessJudge: `Completeness evaluated at ${completenessScore}/5. Identified coverage of primary requirements.`,
        verdictAggregator: `Consolidated score: ${overallScore}/100. Formula: Relevance (20%) + Accuracy (30%) + Hallucination (25%) + Completeness (25%). Final Verdict: ${verdict}.`
      },
      latencyMs: 1480,
      tokenCount: payload.question.length + payload.response.length + 120,
      isDemoData: true
    };

    const currentRecords = getStoredEvaluations();
    saveStoredEvaluations([newResult, ...currentRecords]);
    return newResult;
  },

  deleteEvaluation: async (id: string): Promise<boolean> => {
    const current = getStoredEvaluations();
    const filtered = current.filter(r => r.id !== id);
    saveStoredEvaluations(filtered);
    return true;
  },

  resetToDefault: async (): Promise<void> => {
    saveStoredEvaluations(INITIAL_EVALUATIONS);
  }
};
