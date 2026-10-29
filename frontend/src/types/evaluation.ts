export type ClaimStatus = 'supported' | 'unsupported' | 'contradicted' | 'inconclusive';

export type OverallVerdict = 'Pass' | 'Needs Improvement' | 'Fail';

export interface ClaimFinding {
  id: string;
  claimNumber: number;
  claimText: string;
  status: ClaimStatus;
  confidence: number; // 0.0 - 1.0
  explanation: string;
  evidenceQuote?: string;
  sourceDocument?: string;
  chunkId?: string;
  similarityScore?: number;
}

export interface DimensionScore {
  name: 'Relevance' | 'Accuracy' | 'Hallucination Assessment' | 'Completeness';
  score: number; // 0.0 to 5.0 raw scale
  normalizedScore: number; // 0 to 100
  weight: number; // e.g. 0.20, 0.30, 0.25, 0.25
  status: 'optimal' | 'acceptable' | 'concerning' | 'critical';
  explanation: string;
  keyObservation: string;
}

export interface EvaluationResult {
  id: string;
  question: string;
  response: string;
  referenceAnswer?: string;
  referenceDocumentName?: string;
  timestamp: string;
  evaluatorModel: string;
  evaluatorStrictness: 'lenient' | 'standard' | 'strict';
  overallScore: number; // 0 to 100
  verdict: OverallVerdict;
  confidenceScore: number; // 0 to 100 (Uncertainty indicator)
  verdictSummary: string;
  strengths: string[];
  identifiedIssues: string[];
  unsupportedClaimsSummary: string[];
  missingInformation: string[];
  recommendations: string[];
  uncertaintyWarnings: string[];
  dimensions: {
    relevance: DimensionScore;
    accuracy: DimensionScore;
    hallucination: DimensionScore;
    completeness: DimensionScore;
  };
  claims: ClaimFinding[];
  agentRationales: {
    supervisor: string;
    relevanceJudge: string;
    accuracyJudge: string;
    hallucinationDetector: string;
    completenessJudge: string;
    verdictAggregator: string;
  };
  latencyMs: number;
  tokenCount: number;
  isDemoData?: boolean;
}

export interface EvaluationFilter {
  searchQuery?: string;
  verdict?: string;
  dateRange?: string;
  scoreRange?: string;
  hallucinationStatus?: string;
}
