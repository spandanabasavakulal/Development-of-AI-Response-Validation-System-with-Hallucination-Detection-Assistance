import { BatchJob, BatchItem } from '../types/batch';

const BATCH_STORAGE_KEY = 'ai_eval_batch_jobs_v1';

export const SAMPLE_CSV_TEMPLATE = `question,response,reference_answer
"Explain the architecture of Retrieval-Augmented Generation (RAG).","RAG references external knowledge bases prior to generation, combining retrieval with LLM inference.","RAG retrieves external document passages using vector search and augments the prompt."
"What is the maximum context length of Gemini 1.5 Pro?","Gemini 1.5 Pro supports up to 2 million tokens of multimodal context.","Gemini 1.5 Pro supports a 2M token context window."
"What is the capital of Australia and its official currency?","Sydney is the capital of Australia and uses the Australian Dollar.","Canberra is the capital of Australia, using AUD."
"How does Redis handle in-memory persistence?","Redis provides RDB point-in-time snapshots and AOF append-only logging for persistence.","Redis uses RDB snapshots and AOF transaction logs."`;

export interface CsvValidationResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: string[];
  parsedItems: Array<{
    rowNumber: number;
    question: string;
    response: string;
    referenceAnswer?: string;
    isValid: boolean;
    errorReason?: string;
  }>;
}

export const parseAndValidateCsv = (csvText: string): CsvValidationResult => {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) {
    return {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: ['CSV file is empty or missing data rows.'],
      parsedItems: []
    };
  }

  // Parse header
  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const qIndex = headers.findIndex(h => h.includes('question'));
  const rIndex = headers.findIndex(h => h.includes('response') || h.includes('answer'));
  const refIndex = headers.findIndex(h => h.includes('reference'));

  if (qIndex === -1 || rIndex === -1) {
    return {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: ['Missing required columns: CSV must contain "question" and "response" headers.'],
      parsedItems: []
    };
  }

  const errors: string[] = [];
  const parsedItems: CsvValidationResult['parsedItems'] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple CSV row parser handling quotes
    const cells: string[] = [];
    let insideQuotes = false;
    let currentCell = '';
    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        cells.push(currentCell.trim().replace(/^"|"$/g, ''));
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim().replace(/^"|"$/g, ''));

    const question = cells[qIndex] || '';
    const response = cells[rIndex] || '';
    const referenceAnswer = refIndex !== -1 ? cells[refIndex] : undefined;

    let isValid = true;
    let errorReason = '';

    if (!question.trim()) {
      isValid = false;
      errorReason = 'Missing question text';
    } else if (!response.trim()) {
      isValid = false;
      errorReason = 'Missing response text';
    }

    if (!isValid) {
      errors.push(`Row ${i + 1}: ${errorReason}`);
    }

    parsedItems.push({
      rowNumber: i,
      question,
      response,
      referenceAnswer,
      isValid,
      errorReason
    });
  }

  const validRows = parsedItems.filter(p => p.isValid).length;
  const invalidRows = parsedItems.length - validRows;

  return {
    totalRows: parsedItems.length,
    validRows,
    invalidRows,
    errors,
    parsedItems
  };
};

export const batchService = {
  createBatchJob: (name: string, model: string, items: CsvValidationResult['parsedItems']): BatchJob => {
    const batchItems: BatchItem[] = items.filter(it => it.isValid).map((it, idx) => ({
      id: `BATCH-ITEM-${idx + 1}`,
      rowNumber: it.rowNumber,
      question: it.question,
      response: it.response,
      referenceAnswer: it.referenceAnswer,
      status: 'pending'
    }));

    const job: BatchJob = {
      id: `JOB-${Date.now().toString().slice(-6)}`,
      name: name || `Batch Evaluation ${new Date().toLocaleDateString()}`,
      uploadedAt: new Date().toISOString(),
      totalRows: batchItems.length,
      processedRows: 0,
      successfulCount: 0,
      failedCount: 0,
      status: 'queued',
      evaluatorModel: model,
      items: batchItems
    };

    return job;
  },

  runBatchSimulation: async (
    job: BatchJob,
    onProgress: (updatedJob: BatchJob) => void
  ): Promise<BatchJob> => {
    job.status = 'running';
    onProgress({ ...job });

    for (let i = 0; i < job.items.length; i++) {
      const item = job.items[i];
      item.status = 'processing';
      onProgress({ ...job });

      await new Promise(r => setTimeout(r, 600));

      const isBad = item.response.toLowerCase().includes('sydney is the capital');
      const relevance = 4.7;
      const accuracy = isBad ? 1.5 : 4.6;
      const hallucination = isBad ? 1.4 : 4.8;
      const completeness = 4.2;
      const overall = isBad ? 44 : Math.round((relevance * 20 * 0.20) + (accuracy * 20 * 0.30) + (hallucination * 20 * 0.25) + (completeness * 20 * 0.25));

      item.status = 'completed';
      item.overallScore = overall;
      item.relevanceScore = relevance;
      item.accuracyScore = accuracy;
      item.hallucinationScore = hallucination;
      item.completenessScore = completeness;
      item.verdict = overall >= 80 ? 'Pass' : overall >= 60 ? 'Needs Improvement' : 'Fail';
      item.evaluationId = `EVAL-BATCH-${job.id}-${i + 1}`;

      job.processedRows++;
      if (item.verdict === 'Pass') job.successfulCount++;
      else job.failedCount++;

      onProgress({ ...job });
    }

    job.status = 'completed';
    onProgress({ ...job });
    return job;
  },

  exportBatchToCsv: (job: BatchJob): string => {
    const headers = ['Row', 'Question', 'Response', 'Overall Score', 'Relevance', 'Accuracy', 'Hallucination', 'Completeness', 'Verdict'];
    const rows = job.items.map(it => [
      it.rowNumber,
      `"${it.question.replace(/"/g, '""')}"`,
      `"${it.response.replace(/"/g, '""')}"`,
      it.overallScore ?? 'N/A',
      it.relevanceScore ?? 'N/A',
      it.accuracyScore ?? 'N/A',
      it.hallucinationScore ?? 'N/A',
      it.completenessScore ?? 'N/A',
      it.verdict ?? 'N/A'
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
