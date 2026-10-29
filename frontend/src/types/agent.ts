export type AgentRole = 
  | 'supervisor'
  | 'relevance_judge'
  | 'accuracy_judge'
  | 'hallucination_detector'
  | 'completeness_judge'
  | 'verdict_aggregator'
  | 'input_guardrails'
  | 'rag_retriever';

export interface AgentMetric {
  avgExecutionTimeMs: number;
  totalCalls: number;
  accuracyRate: number;
  errorRate: number;
}

export interface AgentArchitectureNode {
  id: string;
  role: AgentRole;
  name: string;
  category: 'input' | 'orchestration' | 'routing' | 'retrieval' | 'evaluation' | 'aggregation' | 'output';
  description: string;
  responsibilities: string[];
  inputSchema: string;
  outputSchema: string;
  promptTemplatePreview: string;
  modelConfig: {
    model: string;
    temperature: number;
    maxTokens: number;
    strictness: string;
  };
  metrics: AgentMetric;
  status: 'active' | 'standby' | 'updating';
  weight?: number; // for aggregator
}
