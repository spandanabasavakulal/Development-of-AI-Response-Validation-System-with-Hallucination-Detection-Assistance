import { AgentArchitectureNode } from '../types/agent';

export const AGENT_NODES: AgentArchitectureNode[] = [
  {
    id: "agent-supervisor",
    role: "supervisor",
    name: "Supervisor / Orchestrator Agent",
    category: "orchestration",
    description: "Oversees the end-to-end evaluation lifecycle, task delegation, tool scheduling, and error recovery across all specialized judge sub-agents.",
    responsibilities: [
      "Coordinates sequential execution flow from claim extraction to verdict synthesis.",
      "Allocates context tokens and schedules parallel judge invocations.",
      "Tracks execution latencies and enforces SLA timeouts.",
      "Flags high-risk evaluations for mandatory human-in-the-loop audit."
    ],
    inputSchema: "{\n  question: string;\n  response: string;\n  referenceDocument?: string;\n  strictness: 'lenient' | 'standard' | 'strict';\n}",
    outputSchema: "{\n  pipelineStatus: 'success' | 'partial' | 'failed';\n  executedAgents: string[];\n  totalLatencyMs: number;\n}",
    promptTemplatePreview: "You are the Evaluation Supervisor. Analyze the user query and AI candidate answer. Coordinate sub-agent task queues, ensure claim decomposition completes, and route evidence requests to the RAG Retriever before activating judges.",
    modelConfig: {
      model: "LangGraph / Workflow Engine + Gemini-1.5-Pro",
      temperature: 0.1,
      maxTokens: 1024,
      strictness: "Standard Enterprise (99.5% uptime)"
    },
    metrics: {
      avgExecutionTimeMs: 145,
      totalCalls: 1240,
      accuracyRate: 99.8,
      errorRate: 0.2
    },
    status: "active"
  },
  {
    id: "agent-relevance",
    role: "relevance_judge",
    name: "Relevance Judge Agent",
    category: "evaluation",
    description: "Evaluates whether the candidate response directly answers the core question and avoids tangential or off-topic drift.",
    responsibilities: [
      "Computes semantic query-response intent alignment.",
      "Detects topical divergence, evasive wording, or unprompted monologues.",
      "Assigns a normalized relevance score from 0.0 to 5.0 with concrete rationale."
    ],
    inputSchema: "{\n  question: string;\n  response: string;\n}",
    outputSchema: "{\n  score: number; // 0.0 - 5.0\n  relevanceClassification: 'direct' | 'partial' | 'off_topic';\n  rationale: string;\n}",
    promptTemplatePreview: "Given the user's question: {{question}}\nAnd the AI response: {{response}}\nAssess whether the response directly addresses the question without superfluous or misleading drift. Score between 0 and 5 and explain your reasoning.",
    modelConfig: {
      model: "Gemini-1.5-Pro (Judge Role)",
      temperature: 0.0,
      maxTokens: 512,
      strictness: "Strict Alignment"
    },
    metrics: {
      avgExecutionTimeMs: 380,
      totalCalls: 1240,
      accuracyRate: 98.2,
      errorRate: 0.4
    },
    status: "active",
    weight: 0.20
  },
  {
    id: "agent-accuracy",
    role: "accuracy_judge",
    name: "Accuracy Judge Agent",
    category: "evaluation",
    description: "Verifies every extracted atomic claim against retrieved trusted passages and reference documents to validate factual truthfulness.",
    responsibilities: [
      "Compares decomposed claims against FAISS/ChromaDB retrieved evidence.",
      "Detects numerical deviations, date inconsistencies, and factual distortions.",
      "Attributes each claim to exact chunk passages and assigns an evidence-backed score (0.0 to 5.0)."
    ],
    inputSchema: "{\n  claims: Array<{ id: string; text: string }>;\n  retrievedEvidence: Array<{ chunkId: string; text: string; score: number }>;\n}",
    outputSchema: "{\n  score: number; // 0.0 - 5.0\n  verifiedClaims: number;\n  disputedClaims: number;\n  detailedEvidenceMap: Record<string, string>;\n}",
    promptTemplatePreview: "You are an Accuracy Judge. For each claim in {{claims}}, compare against evidence passages {{retrievedEvidence}}. Determine if the statement is factually substantiated, distorted, or ungrounded. Provide an evidence-backed score from 0 to 5.",
    modelConfig: {
      model: "Gemini-1.5-Pro / Claude-3.5-Sonnet (Judge Role)",
      temperature: 0.0,
      maxTokens: 1024,
      strictness: "Zero-Tolerance Factual Rigor"
    },
    metrics: {
      avgExecutionTimeMs: 510,
      totalCalls: 1240,
      accuracyRate: 97.4,
      errorRate: 0.6
    },
    status: "active",
    weight: 0.30
  },
  {
    id: "agent-hallucination",
    role: "hallucination_detector",
    name: "Hallucination Detection Agent",
    category: "evaluation",
    description: "Specialized sentinel that categorizes claims into Supported, Unsupported, Contradicted, or Inconclusive, preventing phantom assertions.",
    responsibilities: [
      "Flags claims that lack adequate support in authoritative corpora.",
      "Explicitly separates missing evidence (Unsupported) from active contradiction (Contradicted).",
      "Calculates hallucination risk percentage and attaches uncertainty warnings."
    ],
    inputSchema: "{\n  claims: string[];\n  evidencePassages: string[];\n}",
    outputSchema: "{\n  hallucinationRiskScore: number; // 0.0 (extreme risk) to 5.0 (zero risk)\n  classification: Record<string, 'supported' | 'unsupported' | 'contradicted' | 'inconclusive'>;\n  riskPercentage: number;\n}",
    promptTemplatePreview: "Examine candidate assertions. Classify each as Supported, Unsupported (missing from references), Contradicted (directly refuted by reference), or Inconclusive. Important: Never equate missing evidence with factual falsity without contradiction.",
    modelConfig: {
      model: "Gemini-1.5-Pro (Hallucination Sentinel)",
      temperature: 0.0,
      maxTokens: 768,
      strictness: "High Sensitivity Grounding Guard"
    },
    metrics: {
      avgExecutionTimeMs: 440,
      totalCalls: 1240,
      accuracyRate: 98.9,
      errorRate: 0.3
    },
    status: "active",
    weight: 0.25
  },
  {
    id: "agent-completeness",
    role: "completeness_judge",
    name: "Completeness Judge Agent",
    category: "evaluation",
    description: "Analyzes omissions, checking whether the response covers all critical dimensions, edge cases, and caveats implied by the user prompt.",
    responsibilities: [
      "Deconstructs prompt into expected sub-facets and requirements.",
      "Identifies missing caveats, omitted parameters, and incomplete explanations.",
      "Generates actionable remediation advice for prompting or model fine-tuning."
    ],
    inputSchema: "{\n  question: string;\n  response: string;\n  referenceAnswer?: string;\n}",
    outputSchema: "{\n  score: number; // 0.0 - 5.0\n  coveredFacets: string[];\n  omittedFacets: string[];\n  completenessRatio: number;\n}",
    promptTemplatePreview: "Evaluate prompt completeness. Has the response omitted key dimensions (e.g. constraints, caveats, security concerns, or prerequisites)? Score from 0 to 5 and provide an omission analysis.",
    modelConfig: {
      model: "Gemini-1.5-Pro (Completeness Judge)",
      temperature: 0.1,
      maxTokens: 512,
      strictness: "Enterprise Comprehensive Review"
    },
    metrics: {
      avgExecutionTimeMs: 360,
      totalCalls: 1240,
      accuracyRate: 96.8,
      errorRate: 0.7
    },
    status: "active",
    weight: 0.25
  },
  {
    id: "agent-verdict",
    role: "verdict_aggregator",
    name: "Verdict Agent (Aggregator)",
    category: "aggregation",
    description: "Combines individual judge scores, applies configurable weighting, checks safety veto thresholds, and generates the final Pass/Needs Improvement/Fail verdict.",
    responsibilities: [
      "Applies weighted formula: Relevance (20%) + Accuracy (30%) + Hallucination (25%) + Completeness (25%).",
      "Executes critical safety veto: Contradicted medical/financial claims trigger an automatic Fail regardless of weighted average.",
      "Synthesizes structured explanations, strengths, and recommendations for user presentation."
    ],
    inputSchema: "{\n  scores: { relevance: number; accuracy: number; hallucination: number; completeness: number };\n  claims: Array<{ status: string; confidence: number }>;\n}",
    outputSchema: "{\n  overallScore: number; // 0 - 100\n  verdict: 'Pass' | 'Needs Improvement' | 'Fail';\n  confidence: number;\n  consolidatedExplanation: string;\n}",
    promptTemplatePreview: "Synthesize the outputs from all four judge agents. Normalize scores to 0-100 scale using specified weights. Determine if any contradiction veto rule applies. Produce final verdict and executive summary.",
    modelConfig: {
      model: "Deterministic Weighted Aggregator + Rule Engine",
      temperature: 0.0,
      maxTokens: 256,
      strictness: "Deterministic Aggregation Formula"
    },
    metrics: {
      avgExecutionTimeMs: 45,
      totalCalls: 1240,
      accuracyRate: 100.0,
      errorRate: 0.0
    },
    status: "active"
  }
];
