
import {
  EvaluationResult,
  EvaluationFilter,
  OverallVerdict,
  ClaimFinding,
  ClaimStatus,
} from '../types/evaluation';

import { INITIAL_EVALUATIONS } from '../data/mockEvaluations';
import { apiClient } from './apiClient';

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

// Backend response interfaces
interface AgentResult {
  relevance_score?: number | null;
  accuracy_score?: number | null;
  hallucination_score?: number | null;
  completeness_score?: number | null;
  verdict?: string;
  explanation?: string;
  supported_claims?: string[];
  unsupported_claims?: string[];
  incorrect_claims?: string[];
  hallucinated_claims?: string[];
  contradicted_claims?: string[];
  missing_aspects?: string[];
  covered_aspects?: string[];
  improvement_suggestions?: string[];
  recommendations?: string[];
  strengths?: string[];
  weaknesses?: string[];
  evidence_used?: string[];
}

interface BackendResponse {
  question: string;
  ai_response: string;
  evaluation: {
    relevance: AgentResult;
    accuracy: AgentResult;
    hallucination: AgentResult;
    completeness: AgentResult;
  };
  final_verdict: {
    overall_score: number;
    final_verdict: string;
    dimension_scores: {
      relevance: number | null;
      accuracy: number | null;
      hallucination_quality: number | null;
      completeness: number | null;
    };
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    summary: string;
  };
}

// Local storage functions
const getStoredEvaluations = (): EvaluationResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(INITIAL_EVALUATIONS)
      );

      return INITIAL_EVALUATIONS;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load evaluations:', error);
    return INITIAL_EVALUATIONS;
  }
};

const saveStoredEvaluations = (records: EvaluationResult[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save evaluations:', error);
  }
};

// Score utilities
const clampScore = (score: number): number =>
  Math.max(0, Math.min(100, score));

const toFivePointScale = (score: number): number =>
  Number((clampScore(score) / 20).toFixed(2));

const getDimensionStatus = (
  score: number
): 'optimal' | 'acceptable' | 'concerning' | 'critical' => {
  if (score >= 80) return 'optimal';
  if (score >= 60) return 'acceptable';
  if (score >= 40) return 'concerning';

  return 'critical';
};

// Correct backend verdict mapping
const mapVerdict = (verdict: string): OverallVerdict => {
  const normalized = verdict
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  // Positive verdicts
  if (
    normalized === 'EXCELLENT' ||
    normalized === 'GOOD' ||
    normalized === 'PASS'
  ) {
    return 'Pass';
  }

  // Review / moderate verdicts
  if (
    normalized === 'MODERATE' ||
    normalized === 'NEEDS_REVIEW' ||
    normalized === 'NEEDS_IMPROVEMENT'
  ) {
    return 'Needs Improvement';
  }

  // Negative verdicts
  if (
    normalized === 'POOR' ||
    normalized === 'FAIL' ||
    normalized === 'REJECTED'
  ) {
    return 'Fail';
  }

  console.warn('Unknown backend verdict:', verdict);

  return 'Needs Improvement';
};

// Remove duplicate strings
const uniqueStrings = (
  ...groups: (string[] | undefined)[]
): string[] => {
  return [
    ...new Set(
      groups.flatMap(group => group || []).filter(Boolean)
    ),
  ];
};

// Build claim-level findings
const buildClaims = (
  agents: BackendResponse['evaluation']
): ClaimFinding[] => {
  const claimMap = new Map<string, ClaimFinding>();

  const addClaims = (
    texts: string[] | undefined,
    status: ClaimStatus,
    explanation: string
  ) => {
    (texts || []).forEach(text => {
      const normalizedText = text.trim();

      if (!normalizedText || claimMap.has(normalizedText)) {
        return;
      }

      claimMap.set(normalizedText, {
        id: `CLM-${claimMap.size + 1}`,
        claimNumber: claimMap.size + 1,
        claimText: normalizedText,
        status,
        confidence: 0.5,
        explanation,
      });
    });
  };

  // Contradictions have the highest priority
  addClaims(
    agents.hallucination.contradicted_claims,
    'contradicted',
    'The Hallucination Detection Agent identified this claim as contradicted.'
  );

  addClaims(
    agents.accuracy.incorrect_claims,
    'contradicted',
    'The Accuracy Judge identified this claim as factually incorrect.'
  );

  // Unsupported claims
  addClaims(
    agents.hallucination.hallucinated_claims,
    'unsupported',
    'The Hallucination Detection Agent flagged this claim as potentially hallucinated.'
  );

  addClaims(
    agents.hallucination.unsupported_claims,
    'unsupported',
    'The claim was not supported by the retrieved evidence.'
  );

  addClaims(
    agents.accuracy.unsupported_claims,
    'unsupported',
    'The Accuracy Judge could not establish support for this claim.'
  );

  // Supported claims
  addClaims(
    agents.accuracy.supported_claims,
    'supported',
    'The Accuracy Judge identified this claim as supported.'
  );

  return Array.from(claimMap.values());
};

// Create dimension score object
const makeDimension = (
  name:
    | 'Relevance'
    | 'Accuracy'
    | 'Hallucination Assessment'
    | 'Completeness',
  score: number,
  weight: number,
  explanation: string
) => ({
  name,
  score: toFivePointScale(score),
  normalizedScore: clampScore(score),
  weight,
  status: getDimensionStatus(score),
  explanation,
  keyObservation: explanation,
});

// Main evaluation service
export const evaluationService = {
  // Get all evaluations
  getAll: async (
    filter?: EvaluationFilter
  ): Promise<EvaluationResult[]> => {
    let records = getStoredEvaluations();

    if (filter) {
      if (filter.searchQuery?.trim()) {
        const q = filter.searchQuery.toLowerCase();

        records = records.filter(
          r =>
            r.question.toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q) ||
            r.response.toLowerCase().includes(q)
        );
      }

      if (filter.verdict && filter.verdict !== 'all') {
        records = records.filter(
          r => r.verdict === filter.verdict
        );
      }

      if (filter.scoreRange && filter.scoreRange !== 'all') {
        if (filter.scoreRange === '90-100') {
          records = records.filter(r => r.overallScore >= 90);
        } else if (filter.scoreRange === '75-89') {
          records = records.filter(
            r => r.overallScore >= 75 && r.overallScore < 90
          );
        } else if (filter.scoreRange === '60-74') {
          records = records.filter(
            r => r.overallScore >= 60 && r.overallScore < 75
          );
        } else if (filter.scoreRange === '0-59') {
          records = records.filter(r => r.overallScore < 60);
        }
      }

      if (
        filter.hallucinationStatus &&
        filter.hallucinationStatus !== 'all'
      ) {
        records = records.filter(r => {
          const hasContradiction = r.claims.some(
            c => c.status === 'contradicted'
          );

          const hasUnsupported = r.claims.some(
            c => c.status === 'unsupported'
          );

          if (filter.hallucinationStatus === 'clean') {
            return !hasContradiction && !hasUnsupported;
          }

          if (filter.hallucinationStatus === 'contradicted') {
            return hasContradiction;
          }

          if (filter.hallucinationStatus === 'unsupported') {
            return hasUnsupported;
          }

          return true;
        });
      }
    }

    return records.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );
  },

  // Get evaluation by ID
  getById: async (
    id: string
  ): Promise<EvaluationResult | null> => {
    return (
      getStoredEvaluations().find(
        r => r.id.toLowerCase() === id.toLowerCase()
      ) || null
    );
  },

  // Submit real backend evaluation
  submitEvaluation: async (
    payload: EvaluationSubmission,
    onProgress?: (stage: StageProgress) => void
  ): Promise<EvaluationResult> => {
    const startedAt = Date.now();

    onProgress?.({
      stage: 'input_validation',
      label: 'Submitting to Five-Agent Evaluation Pipeline',
      status: 'running',
      detail:
        'Sending the question and response to the Python FastAPI backend.',
    });

    // Real API request - no simulated results
    const backend = await apiClient.post<BackendResponse>(
      '/evaluate',
      {
        question: payload.question,
        ai_response: payload.response,
        reference_answer: payload.referenceAnswer || '',
      }
    );

    if (!backend.evaluation || !backend.final_verdict) {
      throw new Error(
        'The backend returned an incomplete evaluation response.'
      );
    }

    const agents = backend.evaluation;
    const final = backend.final_verdict;
    const scores = final.dimension_scores;

    const relevance = scores.relevance;
    const accuracy = scores.accuracy;
    const hallucination = scores.hallucination_quality;
    const completeness = scores.completeness;

    // Warnings for unavailable backend values
    const warnings: string[] = [];

    if (accuracy === null || accuracy === undefined) {
      warnings.push(
        'Accuracy score was unavailable because sufficient evidence could not be established.'
      );
    }

    if (hallucination === null || hallucination === undefined) {
      warnings.push(
        'Hallucination quality score was unavailable.'
      );
    }

    if (
      relevance === null ||
      relevance === undefined ||
      completeness === null ||
      completeness === undefined
    ) {
      warnings.push(
        'One or more evaluation dimensions were not returned by the backend.'
      );
    }

    warnings.push(
      'Claim-level confidence values and token usage are not supplied by the current backend response.'
    );

    // Calculate average dimension score.
    // This is NOT a calibrated confidence measurement.
    const availableScores = [
      relevance,
      accuracy,
      hallucination,
      completeness,
    ].filter(
      (score): score is number =>
        score !== null && score !== undefined
    );

    const averageDimensionScore = availableScores.length
      ? Math.round(
          availableScores.reduce(
            (sum, score) => sum + score,
            0
          ) / availableScores.length
        )
      : 0;

    const claims = buildClaims(agents);

    const timestamp = new Date().toLocaleString();
    const id = `EVAL-${Date.now()}`;

    // Correct verdict mapping
    const verdict = mapVerdict(final.final_verdict);

    const dimensionRelevance = relevance ?? 0;
    const dimensionAccuracy = accuracy ?? 0;
    const dimensionHallucination = hallucination ?? 0;
    const dimensionCompleteness = completeness ?? 0;

    // Build final evaluation result
    const result: EvaluationResult = {
      id,

      question: backend.question,
      response: backend.ai_response,

      referenceAnswer: payload.referenceAnswer,

      referenceDocumentName:
        'FAISS knowledge base: SQuAD 2.0, HaluEval and HotpotQA',

      timestamp,

      evaluatorModel: 'Gemini 3.5 Flash Lite - Five-Agent Pipeline',

      evaluatorStrictness: payload.strictness || 'standard',

      overallScore: clampScore(final.overall_score),

      verdict,

      // This field currently stores the average dimension score.
      // Rename the corresponding UI label to "Average Evaluation Score".
      confidenceScore: averageDimensionScore,

      verdictSummary:
        final.summary ||
        'Evaluation completed by the five-agent pipeline.',

      strengths: final.strengths || [],

      identifiedIssues: final.weaknesses || [],

      unsupportedClaimsSummary: uniqueStrings(
        agents.hallucination.unsupported_claims,
        agents.hallucination.contradicted_claims,
        agents.hallucination.hallucinated_claims,
        agents.accuracy.unsupported_claims,
        agents.accuracy.incorrect_claims
      ),

      missingInformation:
        agents.completeness.missing_aspects || [],

      recommendations: uniqueStrings(
        final.recommendations,
        agents.completeness.improvement_suggestions
      ),

      uncertaintyWarnings: warnings,

      // Four specialist evaluation dimensions
      dimensions: {
        relevance: makeDimension(
          'Relevance',
          dimensionRelevance,
          0.25,
          agents.relevance.explanation ||
            'Relevance Judge evaluation.'
        ),

        accuracy: makeDimension(
          'Accuracy',
          dimensionAccuracy,
          0.25,
          agents.accuracy.explanation ||
            'Accuracy Judge evaluation.'
        ),

        hallucination: makeDimension(
          'Hallucination Assessment',
          dimensionHallucination,
          0.25,
          agents.hallucination.explanation ||
            'Hallucination Detection evaluation.'
        ),

        completeness: makeDimension(
          'Completeness',
          dimensionCompleteness,
          0.25,
          agents.completeness.explanation ||
            'Completeness Judge evaluation.'
        ),
      },

      claims,

      // Agent reasoning information
      agentRationales: {
        supervisor:
          'The five-agent evaluation pipeline orchestrated four specialized judges and the final Verdict Agent.',

        relevanceJudge:
          agents.relevance.explanation || '',

        accuracyJudge:
          agents.accuracy.explanation || '',

        hallucinationDetector:
          agents.hallucination.explanation || '',

        completenessJudge:
          agents.completeness.explanation || '',

        verdictAggregator:
          final.summary || '',
      },

      latencyMs: Date.now() - startedAt,

      // Backend does not currently return token usage.
      tokenCount: 0,

      isDemoData: false,
    };

    onProgress?.({
      stage: 'results_generation',
      label: 'Evaluation Completed',
      status: 'completed',
      detail:
        'Actual results received from the five-agent backend pipeline.',
    });

    // Save actual evaluation in history
    const currentRecords = getStoredEvaluations();

    saveStoredEvaluations([
      result,
      ...currentRecords,
    ]);

    return result;
  },

  // Delete evaluation
  deleteEvaluation: async (
    id: string
  ): Promise<boolean> => {
    const current = getStoredEvaluations();

    const filtered = current.filter(
      r => r.id !== id
    );

    saveStoredEvaluations(filtered);

    return true;
  },

  // Reset evaluation history
  resetToDefault: async (): Promise<void> => {
    saveStoredEvaluations(INITIAL_EVALUATIONS);
  },
};
