export const EVALUATION_VOLUME_TRENDS = [
  { date: "Oct 22", evaluations: 42, passed: 34, failed: 8 },
  { date: "Oct 23", evaluations: 58, passed: 48, failed: 10 },
  { date: "Oct 24", evaluations: 86, passed: 71, failed: 15 },
  { date: "Oct 25", evaluations: 110, passed: 92, failed: 18 },
  { date: "Oct 26", evaluations: 135, passed: 108, failed: 27 },
  { date: "Oct 27", evaluations: 172, passed: 139, failed: 33 },
  { date: "Oct 28", evaluations: 195, passed: 161, failed: 34 },
];

export const QUALITY_SCORE_TRENDS = [
  { date: "Oct 22", relevance: 88, accuracy: 82, hallucination: 85, completeness: 78, overall: 83 },
  { date: "Oct 23", relevance: 89, accuracy: 84, hallucination: 87, completeness: 79, overall: 84 },
  { date: "Oct 24", relevance: 91, accuracy: 83, hallucination: 86, completeness: 81, overall: 85 },
  { date: "Oct 25", relevance: 93, accuracy: 86, hallucination: 89, completeness: 82, overall: 87 },
  { date: "Oct 26", relevance: 92, accuracy: 85, hallucination: 88, completeness: 80, overall: 86 },
  { date: "Oct 27", relevance: 94, accuracy: 88, hallucination: 90, completeness: 84, overall: 89 },
  { date: "Oct 28", relevance: 95, accuracy: 89, hallucination: 92, completeness: 85, overall: 90 },
];

export const VERDICT_DISTRIBUTION = [
  { name: "Pass", value: 582, color: "#16A34A" },
  { name: "Needs Improvement", value: 164, color: "#D97706" },
  { name: "Fail", value: 94, color: "#DC2626" },
];

export const HALLUCINATION_FINDINGS_TREND = [
  { date: "Oct 22", supported: 184, unsupported: 24, contradicted: 9, inconclusive: 12 },
  { date: "Oct 23", supported: 240, unsupported: 31, contradicted: 11, inconclusive: 15 },
  { date: "Oct 24", supported: 350, unsupported: 42, contradicted: 14, inconclusive: 20 },
  { date: "Oct 25", supported: 460, unsupported: 50, contradicted: 18, inconclusive: 28 },
  { date: "Oct 26", supported: 570, unsupported: 58, contradicted: 22, inconclusive: 31 },
  { date: "Oct 27", supported: 710, unsupported: 69, contradicted: 25, inconclusive: 38 },
  { date: "Oct 28", supported: 825, unsupported: 74, contradicted: 28, inconclusive: 42 },
];

export const SCORE_DISTRIBUTION = [
  { range: "0 - 40", count: 32, fill: "#EF4444" },
  { range: "41 - 60", count: 62, fill: "#F97316" },
  { range: "61 - 75", count: 164, fill: "#F59E0B" },
  { range: "76 - 89", count: 312, fill: "#3B82F6" },
  { range: "90 - 100", count: 270, fill: "#10B981" },
];

export const AGENT_PERFORMANCE_METRICS = [
  { agent: "Relevance Judge", accuracy: 98.2, avgLatencyMs: 380, errorRate: 0.4 },
  { agent: "Accuracy Judge", accuracy: 97.4, avgLatencyMs: 510, errorRate: 0.6 },
  { agent: "Hallucination Detector", accuracy: 98.9, avgLatencyMs: 440, errorRate: 0.3 },
  { agent: "Completeness Judge", accuracy: 96.8, avgLatencyMs: 360, errorRate: 0.7 },
  { agent: "Verdict Aggregator", accuracy: 100.0, avgLatencyMs: 45, errorRate: 0.0 },
];
