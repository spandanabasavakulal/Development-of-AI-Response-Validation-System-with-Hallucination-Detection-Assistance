import { OverallVerdict } from './evaluation';

export interface BatchItem {
  id: string;
  rowNumber: number;
  question: string;
  response: string;
  referenceAnswer?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  overallScore?: number;
  relevanceScore?: number;
  accuracyScore?: number;
  hallucinationScore?: number;
  completenessScore?: number;
  verdict?: OverallVerdict;
  errorMessage?: string;
  evaluationId?: string;
}

export interface BatchJob {
  id: string;
  name: string;
  uploadedAt: string;
  totalRows: number;
  processedRows: number;
  successfulCount: number;
  failedCount: number;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'paused';
  evaluatorModel: string;
  items: BatchItem[];
}
