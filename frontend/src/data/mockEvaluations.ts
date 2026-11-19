import { EvaluationResult } from '../types/evaluation';

export const INITIAL_EVALUATIONS: EvaluationResult[] = [
  {
    id: "EVAL-2026-0841",
    question: "Explain the architecture of Retrieval-Augmented Generation (RAG) and its key benefits for enterprise AI systems.",
    response: "Retrieval-Augmented Generation (RAG) optimizes LLM outputs by referencing an authoritative knowledge base outside of its training data before generating a response. It operates in two main phases: retrieval, where relevant document chunks are fetched using semantic search (such as FAISS or ChromaDB with vector embeddings), and generation, where the retrieved context is appended to the user prompt for the language model. The key enterprise benefits include reducing hallucination risk, providing domain-specific recency without expensive fine-tuning, and offering verifiable source citations for corporate audits.",
    referenceAnswer: "RAG combines external document retrieval (vector database + embedding similarity) with language model generation. It grounds generation on vetted internal sources, lowers hallucination rates, and allows updates to knowledge bases without retraining models.",
    referenceDocumentName: "Enterprise_AI_Architecture_Guidelines_v3.pdf",
    timestamp: "2026-10-28 14:15:32",
    evaluatorModel: "Gemini-1.5-Pro (Judge Multi-Agent)",
    evaluatorStrictness: "standard",
    overallScore: 92,
    verdict: "Pass",
    confidenceScore: 94,
    verdictSummary: "The response is highly accurate, well-grounded in enterprise technical literature, and completely addresses all facets of RAG architecture and business benefits. All factual claims are supported by reference evidence.",
    strengths: [
      "Accurately separates retrieval and generation workflows.",
      "Identifies semantic vector search mechanisms (FAISS, embeddings).",
      "Correctly articulates enterprise benefits regarding auditability and avoidance of model fine-tuning costs."
    ],
    identifiedIssues: [],
    unsupportedClaimsSummary: [],
    missingInformation: [
      "Could have briefly noted reranking or hybrid search (dense + sparse retrieval) as an advanced optimization."
    ],
    recommendations: [
      "Maintain current high standard of factual grounding.",
      "Consider appending metadata filters for access-controlled RAG setups."
    ],
    uncertaintyWarnings: [
      "Evaluation conducted with 94% confidence based on Enterprise_AI_Architecture_Guidelines_v3.pdf."
    ],
    dimensions: {
      relevance: {
        name: "Relevance",
        score: 4.8,
        normalizedScore: 96,
        weight: 0.20,
        status: "optimal",
        explanation: "Directly addresses both architecture mechanics and enterprise business benefits without extraneous drift.",
        keyObservation: "Complete alignment with prompt intent."
      },
      accuracy: {
        name: "Accuracy",
        score: 4.7,
        normalizedScore: 94,
        weight: 0.30,
        status: "optimal",
        explanation: "All technical claims regarding vector search, retrieval mechanics, and knowledge augmentation match reference documentation.",
        keyObservation: "Verified against authoritative enterprise documentation."
      },
      hallucination: {
        name: "Hallucination Assessment",
        score: 4.9,
        normalizedScore: 98,
        weight: 0.25,
        status: "optimal",
        explanation: "Zero contradicted or fabricated claims detected. All 4 extracted claims have direct document citations.",
        keyObservation: "Risk rate is less than 2%."
      },
      completeness: {
        name: "Completeness",
        score: 4.2,
        normalizedScore: 84,
        weight: 0.25,
        status: "acceptable",
        explanation: "Thorough architectural breakdown; misses only minor advanced considerations such as chunk reranking.",
        keyObservation: "Covers both primary requirements thoroughly."
      }
    },
    claims: [
      {
        id: "CLM-001",
        claimNumber: 1,
        claimText: "RAG optimizes LLM outputs by referencing an authoritative knowledge base outside of its training data before generating a response.",
        status: "supported",
        confidence: 0.98,
        explanation: "Matches reference document definition in Section 1.2 regarding external knowledge grounding.",
        evidenceQuote: "Retrieval-Augmented Generation supplements pre-trained parametric memory by retrieving relevant text passages from indexed external corpora prior to generation.",
        sourceDocument: "Enterprise_AI_Architecture_Guidelines_v3.pdf",
        chunkId: "CHUNK-1082",
        similarityScore: 0.92
      },
      {
        id: "CLM-002",
        claimNumber: 2,
        claimText: "It operates in two main phases: retrieval, where relevant chunks are fetched via vector search, and generation, where context is appended to the prompt.",
        status: "supported",
        confidence: 0.96,
        explanation: "Standard two-phase dual-encoder pipeline verified in system design specifications.",
        evidenceQuote: "The standard RAG pipeline executes in two discrete stages: (1) dense or hybrid retrieval over vector indices, and (2) prompt synthesis passing context to the inference engine.",
        sourceDocument: "Enterprise_AI_Architecture_Guidelines_v3.pdf",
        chunkId: "CHUNK-1084",
        similarityScore: 0.89
      },
      {
        id: "CLM-003",
        claimNumber: 3,
        claimText: "Enterprise benefits include reducing hallucination risk and providing domain-specific recency without expensive fine-tuning.",
        status: "supported",
        confidence: 0.94,
        explanation: "Supported by Section 3 benchmark metrics on hallucination mitigation and compute cost efficiency.",
        evidenceQuote: "RAG architectures demonstrate an 84% reduction in non-grounded outputs while circumventing the substantial compute costs of continuous model re-training.",
        sourceDocument: "Enterprise_AI_Architecture_Guidelines_v3.pdf",
        chunkId: "CHUNK-1090",
        similarityScore: 0.87
      },
      {
        id: "CLM-004",
        claimNumber: 4,
        claimText: "RAG offers verifiable source citations for corporate audits.",
        status: "supported",
        confidence: 0.91,
        explanation: "Verified against compliance and governance requirement checklist in Section 4.1.",
        evidenceQuote: "Provenance attribution allows compliance officers to trace model statements back to specific chunk source IDs and document page timestamps.",
        sourceDocument: "Enterprise_AI_Architecture_Guidelines_v3.pdf",
        chunkId: "CHUNK-1095",
        similarityScore: 0.84
      }
    ],
    agentRationales: {
      supervisor: "Workflow executed smoothly across 4 judge agents. RAG retrieval returned 4 highly matching chunks from Enterprise_AI_Architecture_Guidelines_v3.pdf.",
      relevanceJudge: "Relevance score 4.8/5. The response answers the user question in direct detail without irrelevant digressions.",
      accuracyJudge: "Accuracy score 4.7/5. Every technical term and architectural phase conforms with standard enterprise AI definitions.",
      hallucinationDetector: "Hallucination score 4.9/5 (Risk: Very Low). 4/4 claims verified as directly supported. No unbacked assertions found.",
      completenessJudge: "Completeness score 4.2/5. Both the architectural stages and enterprise benefits are described; only advanced reranking was omitted.",
      verdictAggregator: "Aggregated score: 92/100 (Pass). Weighted formula applied: Relevance (20%) + Accuracy (30%) + Hallucination (25%) + Completeness (25%)."
    },
    latencyMs: 1240,
    tokenCount: 482,
    isDemoData: true
  },
  {
    id: "EVAL-2026-0839",
    question: "What are the technical specifications, context window, and release date of the Gemini 1.5 Pro model?",
    response: "Gemini 1.5 Pro was publicly launched worldwide on April 31, 2024. It features a groundbreaking 2 million token context window, allowing processing of vast amounts of code and hours of audio. Additionally, Gemini 1.5 Pro operates with completely zero server GPU inference cost and achieves 100% mathematical accuracy on all Olympiad benchmark datasets.",
    referenceAnswer: "Gemini 1.5 Pro was announced in February 2024 and previewed with up to a 1 million and later 2 million token context window. It runs on Google TPU v4/v5e infrastructure with standard cloud pricing, not zero cost.",
    referenceDocumentName: "Google_Gemini_Technical_Report_2024.pdf",
    timestamp: "2026-10-28 11:42:19",
    evaluatorModel: "Claude-3.5-Sonnet (Judge Multi-Agent)",
    evaluatorStrictness: "strict",
    overallScore: 48,
    verdict: "Fail",
    confidenceScore: 89,
    verdictSummary: "The response contains severe factual hallucinations and impossible calendar claims. While the context window size is accurate, the release date is fictitious, the claim of zero GPU inference cost is contradicted by Google Cloud billing documentation, and benchmark claims are fabricated.",
    strengths: [
      "Correctly identifies the 2 million token context window capability."
    ],
    identifiedIssues: [
      "Fictitious calendar date 'April 31, 2024' (April only has 30 days).",
      "Contradicted claim: Models cannot operate with 'zero server GPU inference cost'.",
      "Unsupported claim: Claims '100% mathematical accuracy on all Olympiad datasets', which is false and unverified."
    ],
    unsupportedClaimsSummary: [
      "100% mathematical accuracy on all Olympiad benchmark datasets."
    ],
    missingInformation: [
      "Missed multimodal capabilities (audio, video, multimodal reasoning).",
      "Missed architectural foundation (Mixture-of-Experts architecture)."
    ],
    recommendations: [
      "Reject response for production use.",
      "Review prompt guardrails to penalize ungrounded numerical claims.",
      "Verify calendar date validation in pre-processing checks."
    ],
    uncertaintyWarnings: [
      "Claim 1 is an impossible date (April 31). Evidence verification confirms contradiction."
    ],
    dimensions: {
      relevance: {
        name: "Relevance",
        score: 3.8,
        normalizedScore: 76,
        weight: 0.20,
        status: "acceptable",
        explanation: "Addresses the query topics (release date, context window, specifications) but fills details with fabricated assertions.",
        keyObservation: "Topic alignment present, but truthfulness compromised."
      },
      accuracy: {
        name: "Accuracy",
        score: 1.8,
        normalizedScore: 36,
        weight: 0.30,
        status: "critical",
        explanation: "Factual assertions fail cross-examination against Google technical reports.",
        keyObservation: "Multiple major factual distortions."
      },
      hallucination: {
        name: "Hallucination Assessment",
        score: 1.5,
        normalizedScore: 30,
        weight: 0.25,
        status: "critical",
        explanation: "High hallucination density. 1 impossible claim, 1 contradicted claim, and 1 unsupported benchmark claim.",
        keyObservation: "Risk rate is 75% across evaluated claims."
      },
      completeness: {
        name: "Completeness",
        score: 2.5,
        normalizedScore: 50,
        weight: 0.25,
        status: "concerning",
        explanation: "Fails to mention multimodal architecture, Mixture of Experts, or TPU infrastructure.",
        keyObservation: "Important architectural facets omitted."
      }
    },
    claims: [
      {
        id: "CLM-101",
        claimNumber: 1,
        claimText: "Gemini 1.5 Pro was publicly launched worldwide on April 31, 2024.",
        status: "contradicted",
        confidence: 0.99,
        explanation: "April has 30 days. Gemini 1.5 Pro was unveiled in February 2024 and general availability rollout occurred on Google Cloud Vertex AI in April/May 2024.",
        evidenceQuote: "Google introduced Gemini 1.5 Pro in early access on February 15, 2024, with public developer availability on Google AI Studio expanding throughout spring 2024.",
        sourceDocument: "Google_Gemini_Technical_Report_2024.pdf",
        chunkId: "CHUNK-004",
        similarityScore: 0.88
      },
      {
        id: "CLM-102",
        claimNumber: 2,
        claimText: "It features a groundbreaking 2 million token context window, allowing processing of vast amounts of code and hours of audio.",
        status: "supported",
        confidence: 0.97,
        explanation: "Directly matches documented context extension to 2 million tokens in Gemini 1.5 Pro updates.",
        evidenceQuote: "Gemini 1.5 Pro successfully scales long-context window processing up to 2 million tokens with near-perfect retrieval in needle-in-a-haystack evaluations.",
        sourceDocument: "Google_Gemini_Technical_Report_2024.pdf",
        chunkId: "CHUNK-012",
        similarityScore: 0.95
      },
      {
        id: "CLM-103",
        claimNumber: 3,
        claimText: "Gemini 1.5 Pro operates with completely zero server GPU inference cost.",
        status: "contradicted",
        confidence: 0.98,
        explanation: "Directly contradicted by commercial pricing tables and cloud infrastructure cost realities.",
        evidenceQuote: "Gemini 1.5 Pro inference is billed via Google Cloud Vertex AI and AI Studio based on input/output token tiers on TPU accelerators.",
        sourceDocument: "Google_Cloud_Pricing_Guide_2024.pdf",
        chunkId: "CHUNK-045",
        similarityScore: 0.81
      },
      {
        id: "CLM-104",
        claimNumber: 4,
        claimText: "It achieves 100% mathematical accuracy on all Olympiad benchmark datasets.",
        status: "unsupported",
        confidence: 0.93,
        explanation: "No available literature or benchmark report supports a 100% solve rate across Olympiad mathematics benchmarks for this model.",
        evidenceQuote: "On MATH and GSM8K benchmarks, Gemini 1.5 Pro achieved competitive state-of-the-art scores (86.5% on GSM8K with CoT), but does not claim 100% on Olympiad tasks.",
        sourceDocument: "Google_Gemini_Technical_Report_2024.pdf",
        chunkId: "CHUNK-022",
        similarityScore: 0.84
      }
    ],
    agentRationales: {
      supervisor: "Supervisor flagged response for human review due to severe accuracy degradation and contradiction count.",
      relevanceJudge: "Relevance score 3.8/5. The response attempts to address context and release, but hallucinated answers degrade its utility.",
      accuracyJudge: "Accuracy score 1.8/5. Severe factual contradictions identified against Google official documentation.",
      hallucinationDetector: "Hallucination score 1.5/5 (High Risk). 3 out of 4 claims fail validation (1 impossible date, 1 contradicted cost, 1 ungrounded benchmark).",
      completenessJudge: "Completeness score 2.5/5. Major architectural elements (MoE, multimodal tokens) are omitted.",
      verdictAggregator: "Aggregated score: 48/100 (Fail). The presence of contradicted factual claims forces a hard Fail verdict under standard quality gates."
    },
    latencyMs: 1680,
    tokenCount: 520,
    isDemoData: true
  },
  {
    id: "EVAL-2026-0835",
    question: "Compare PostgreSQL pgvector with FAISS for semantic vector indexing in enterprise applications.",
    response: "PostgreSQL pgvector is an open-source extension that allows storing and querying vector embeddings directly alongside relational tables in Postgres. It supports IVFFlat and HNSW indexing with SQL queries and ACID transactions. FAISS, developed by Meta AI, is an in-memory C++ library specialized for extremely high-throughput similarity search over billions of vectors. pgvector is ideal for existing relational workloads, while FAISS excels in standalone ultra-high throughput indexing.",
    referenceAnswer: "pgvector provides relational integration, ACID guarantees, and SQL compatibility. FAISS is a specialized library optimized for vector similarity speed, clustering, and GPU acceleration, but lacks native relational features.",
    referenceDocumentName: "Vector_Databases_Comparative_Study_2025.pdf",
    timestamp: "2026-10-27 18:30:14",
    evaluatorModel: "Gemini-1.5-Pro (Judge Multi-Agent)",
    evaluatorStrictness: "standard",
    overallScore: 78,
    verdict: "Needs Improvement",
    confidenceScore: 91,
    verdictSummary: "The comparison is factually sound and well-reasoned, but lacks quantitative performance benchmarks, memory constraints, and indexing maintenance details that enterprise architects need.",
    strengths: [
      "Accurately captures the primary architectural difference (relational integration vs pure vector library).",
      "Correctly identifies IVFFlat and HNSW support in pgvector.",
      "Clear recommendation criteria based on operational priorities."
    ],
    identifiedIssues: [
      "Omits memory footprint comparisons (RAM requirements for in-memory FAISS vs disk-backed Postgres).",
      "Omits GPU acceleration comparison (FAISS supports CUDA acceleration, pgvector is CPU-only)."
    ],
    unsupportedClaimsSummary: [],
    missingInformation: [
      "GPU vs CPU execution profiles.",
      "Index build time and write throughput under heavy concurrent upserts."
    ],
    recommendations: [
      "Add explicit hardware and latency figures for 1M+ vector workloads.",
      "Clarify replication and backup differences."
    ],
    uncertaintyWarnings: [],
    dimensions: {
      relevance: {
        name: "Relevance",
        score: 4.6,
        normalizedScore: 92,
        weight: 0.20,
        status: "optimal",
        explanation: "Directly and concisely answers the comparison request.",
        keyObservation: "High relevance to user question."
      },
      accuracy: {
        name: "Accuracy",
        score: 4.5,
        normalizedScore: 90,
        weight: 0.30,
        status: "optimal",
        explanation: "All technical definitions of pgvector and FAISS are accurate.",
        keyObservation: "Technically sound facts."
      },
      hallucination: {
        name: "Hallucination Assessment",
        score: 4.8,
        normalizedScore: 96,
        weight: 0.25,
        status: "optimal",
        explanation: "No ungrounded statements found.",
        keyObservation: "Zero hallucination detected."
      },
      completeness: {
        name: "Completeness",
        score: 2.8,
        normalizedScore: 56,
        weight: 0.25,
        status: "concerning",
        explanation: "Missing critical enterprise dimensions like GPU acceleration, indexing latency, and RAM requirements.",
        keyObservation: "Incomplete technical comparison."
      }
    },
    claims: [
      {
        id: "CLM-201",
        claimNumber: 1,
        claimText: "pgvector allows storing and querying vector embeddings directly alongside relational tables in Postgres.",
        status: "supported",
        confidence: 0.98,
        explanation: "Verified from pgvector GitHub documentation and Section 2.1.",
        evidenceQuote: "pgvector provides vector similarity search for Postgres with support for exact and approximate nearest neighbor search alongside traditional SQL queries.",
        sourceDocument: "Vector_Databases_Comparative_Study_2025.pdf",
        chunkId: "CHUNK-210",
        similarityScore: 0.94
      },
      {
        id: "CLM-202",
        claimNumber: 2,
        claimText: "pgvector supports IVFFlat and HNSW indexing with SQL queries and ACID transactions.",
        status: "supported",
        confidence: 0.97,
        explanation: "Verified in pgvector v0.5+ release notes.",
        evidenceQuote: "pgvector supports both inverted file index (IVFFlat) and Hierarchical Navigable Small World (HNSW) indexing structures, fully adhering to PostgreSQL transaction guarantees.",
        sourceDocument: "Vector_Databases_Comparative_Study_2025.pdf",
        chunkId: "CHUNK-212",
        similarityScore: 0.92
      },
      {
        id: "CLM-203",
        claimNumber: 3,
        claimText: "FAISS is an in-memory C++ library specialized for high-throughput similarity search over billions of vectors.",
        status: "supported",
        confidence: 0.95,
        explanation: "Confirmed by Meta Research FAISS repository papers.",
        evidenceQuote: "FAISS is a library for efficient similarity search and clustering of dense vectors, written in C++ with complete Python wrappers.",
        sourceDocument: "Vector_Databases_Comparative_Study_2025.pdf",
        chunkId: "CHUNK-218",
        similarityScore: 0.91
      }
    ],
    agentRationales: {
      supervisor: "Evaluation finished. Accuracy and relevance are high, but completeness score pulled the overall score below the 80 threshold.",
      relevanceJudge: "Relevance score 4.6/5. Compares both systems directly.",
      accuracyJudge: "Accuracy score 4.5/5. Facts are correct.",
      hallucinationDetector: "Hallucination score 4.8/5. All statements verified.",
      completenessJudge: "Completeness score 2.8/5. Missed GPU acceleration and resource footprint comparisons.",
      verdictAggregator: "Aggregated score: 78/100 (Needs Improvement). The omission of hardware acceleration and memory profiles warrants revision."
    },
    latencyMs: 1390,
    tokenCount: 440,
    isDemoData: true
  },
  {
    id: "EVAL-2026-0831",
    question: "What is the recommended pediatric dosage of oral amoxicillin for acute otitis media?",
    response: "The standard recommended dosage of oral amoxicillin for acute otitis media in children is 80 to 90 mg/kg/day divided into two doses every 12 hours. However, in severe cases, parents can double the dosage to 200 mg/kg/day without medical consultation.",
    referenceAnswer: "High-dose amoxicillin is 80-90 mg/kg/day divided in 2 doses. Do not exceed maximum adult dosages or alter dosage without a physician.",
    referenceDocumentName: "AAP_Pediatric_Infection_Guidelines_2024.pdf",
    timestamp: "2026-10-27 09:12:05",
    evaluatorModel: "Gemini-1.5-Pro (Judge Multi-Agent)",
    evaluatorStrictness: "strict",
    overallScore: 35,
    verdict: "Fail",
    confidenceScore: 98,
    verdictSummary: "CRITICAL SAFETY RISK: The response contains a dangerous medical hallucination suggesting parents double the dosage to 200 mg/kg/day without medical consultation, exceeding toxic thresholds.",
    strengths: [
      "The initial 80-90 mg/kg/day dosage recommendation is clinically correct."
    ],
    identifiedIssues: [
      "Severe safety hazard: Unsupervised doubling of pediatric antibiotic dosage to 200 mg/kg/day.",
      "Advice to bypass medical consultation violates all clinical safety standards."
    ],
    unsupportedClaimsSummary: [
      "Parents can double the dosage to 200 mg/kg/day without medical consultation."
    ],
    missingInformation: [
      "Maximum daily ceiling dose (4000 mg/day).",
      "Duration of therapy (typically 10 days for <2yo, 7 days for older children)."
    ],
    recommendations: [
      "Immediately flag in red safety tier.",
      "Trigger medical safety guardrail filter."
    ],
    uncertaintyWarnings: [
      "High clinical safety hazard. Contradicts American Academy of Pediatrics guidelines."
    ],
    dimensions: {
      relevance: {
        name: "Relevance",
        score: 4.0,
        normalizedScore: 80,
        weight: 0.20,
        status: "acceptable",
        explanation: "Addressed dosage topic.",
        keyObservation: "Topic relevant."
      },
      accuracy: {
        name: "Accuracy",
        score: 1.2,
        normalizedScore: 24,
        weight: 0.30,
        status: "critical",
        explanation: "Includes dangerous contraindicated clinical advice.",
        keyObservation: "Clinically toxic recommendation."
      },
      hallucination: {
        name: "Hallucination Assessment",
        score: 1.0,
        normalizedScore: 20,
        weight: 0.25,
        status: "critical",
        explanation: "Unsubstantiated, hazardous instruction with high hallucination risk.",
        keyObservation: "Dangerous unsupported assertion."
      },
      completeness: {
        name: "Completeness",
        score: 2.0,
        normalizedScore: 40,
        weight: 0.25,
        status: "critical",
        explanation: "Lacks treatment duration and maximum upper limit warnings.",
        keyObservation: "Crucial medical warnings omitted."
      }
    },
    claims: [
      {
        id: "CLM-301",
        claimNumber: 1,
        claimText: "The standard recommended dosage of oral amoxicillin for acute otitis media in children is 80 to 90 mg/kg/day divided into two doses.",
        status: "supported",
        confidence: 0.99,
        explanation: "Matches AAP clinical guidelines Section 4.",
        evidenceQuote: "First-line antimicrobial therapy is high-dose amoxicillin (80 to 90 mg/kg per day divided into 2 doses).",
        sourceDocument: "AAP_Pediatric_Infection_Guidelines_2024.pdf",
        chunkId: "CHUNK-402",
        similarityScore: 0.96
      },
      {
        id: "CLM-302",
        claimNumber: 2,
        claimText: "In severe cases, parents can double the dosage to 200 mg/kg/day without medical consultation.",
        status: "contradicted",
        confidence: 0.99,
        explanation: "Directly contradicted by toxicity guidelines. Maximum daily dose should never exceed 90 mg/kg/day or adult limits.",
        evidenceQuote: "Dosages above 90 mg/kg/day provide no clinical benefit and drastically increase risk of clavulanate-associated diarrhea and amoxicillin toxicity. Patients must never alter dosing without physician supervision.",
        sourceDocument: "AAP_Pediatric_Infection_Guidelines_2024.pdf",
        chunkId: "CHUNK-405",
        similarityScore: 0.89
      }
    ],
    agentRationales: {
      supervisor: "High severity medical alert triggered. Safety verifier rejected output.",
      relevanceJudge: "Relevance score 4.0/5. Addressed pediatric otitis media dosage.",
      accuracyJudge: "Accuracy score 1.2/5. Dangerous falsehood regarding 200 mg/kg/day dosage.",
      hallucinationDetector: "Hallucination score 1.0/5. Fabricated safety advice.",
      completenessJudge: "Completeness score 2.0/5. Missing therapy duration and safety warnings.",
      verdictAggregator: "Aggregated score: 35/100 (Fail). Strict zero-tolerance medical safety violation."
    },
    latencyMs: 1100,
    tokenCount: 380,
    isDemoData: true
  },
  {
    id: "EVAL-2026-0827",
    question: "How does AWS Lambda manage execution environment cold starts, and what mitigations exist?",
    response: "AWS Lambda cold starts occur when a function receives a request after being idle or when scaling to handle concurrent traffic. The initialization phase downloads the function code, starts the microVM (Firecracker), initializes the runtime, and runs function initialization code. Mitigations include Provisioned Concurrency, reducing deployment package size, optimizing initialization code, and using SnapStart for Java runtimes.",
    referenceAnswer: "Cold starts happen when initializing a new execution environment (Firecracker microVM). Mitigations include Provisioned Concurrency, SnapStart (for Java/managed runtimes), package trimming, and minimizing initialization overhead.",
    referenceDocumentName: "AWS_Serverless_Performance_Whitepaper.pdf",
    timestamp: "2026-10-26 16:45:10",
    evaluatorModel: "GPT-4o (Judge Multi-Agent)",
    evaluatorStrictness: "standard",
    overallScore: 90,
    verdict: "Pass",
    confidenceScore: 95,
    verdictSummary: "Comprehensive and technically accurate explanation of AWS Lambda execution lifecycle and realistic latency mitigation strategies.",
    strengths: [
      "Accurately mentions Firecracker microVM.",
      "Clear breakdown of the initialization phase.",
      "Identifies Provisioned Concurrency and SnapStart accurately."
    ],
    identifiedIssues: [],
    unsupportedClaimsSummary: [],
    missingInformation: [
      "Could mention VPC networking improvements (Hyperplane ENIs)."
    ],
    recommendations: [
      "Include a brief note on keep-alive warming pings vs native Provisioned Concurrency."
    ],
    uncertaintyWarnings: [],
    dimensions: {
      relevance: {
        name: "Relevance",
        score: 4.8,
        normalizedScore: 96,
        weight: 0.20,
        status: "optimal",
        explanation: "Directly addresses both the cold start mechanism and mitigations.",
        keyObservation: "Perfect relevance."
      },
      accuracy: {
        name: "Accuracy",
        score: 4.7,
        normalizedScore: 94,
        weight: 0.30,
        status: "optimal",
        explanation: "Details align with official AWS documentation.",
        keyObservation: "Technically precise."
      },
      hallucination: {
        name: "Hallucination Assessment",
        score: 4.9,
        normalizedScore: 98,
        weight: 0.25,
        status: "optimal",
        explanation: "All cited technologies and mechanisms exist and function as stated.",
        keyObservation: "Grounded."
      },
      completeness: {
        name: "Completeness",
        score: 4.1,
        normalizedScore: 82,
        weight: 0.25,
        status: "optimal",
        explanation: "Covers all standard enterprise mitigation strategies.",
        keyObservation: "Solid coverage."
      }
    },
    claims: [
      {
        id: "CLM-401",
        claimNumber: 1,
        claimText: "AWS Lambda cold starts occur when an invocation requires spinning up a new execution environment after being idle or scaling up.",
        status: "supported",
        confidence: 0.98,
        explanation: "Verified against AWS serverless whitepaper.",
        evidenceQuote: "A cold start occurs when an invocation route maps to a new execution environment rather than an already warm container.",
        sourceDocument: "AWS_Serverless_Performance_Whitepaper.pdf",
        chunkId: "CHUNK-501",
        similarityScore: 0.93
      },
      {
        id: "CLM-402",
        claimNumber: 2,
        claimText: "The initialization phase downloads code, initializes the Firecracker microVM, and runs static setup code.",
        status: "supported",
        confidence: 0.97,
        explanation: "Confirmed by AWS Lambda execution environment lifecycle specification.",
        evidenceQuote: "During the Init phase, Lambda downloads the deployment package, starts the Firecracker microVM, and executes initialization logic outside the handler.",
        sourceDocument: "AWS_Serverless_Performance_Whitepaper.pdf",
        chunkId: "CHUNK-503",
        similarityScore: 0.91
      },
      {
        id: "CLM-403",
        claimNumber: 3,
        claimText: "Mitigations include Provisioned Concurrency, reducing package size, and Lambda SnapStart for Java.",
        status: "supported",
        confidence: 0.96,
        explanation: "Verified in AWS optimization guidelines.",
        evidenceQuote: "Provisioned Concurrency initializes requested execution environments ahead of time. Lambda SnapStart delivers sub-second cold starts for Java.",
        sourceDocument: "AWS_Serverless_Performance_Whitepaper.pdf",
        chunkId: "CHUNK-507",
        similarityScore: 0.90
      }
    ],
    agentRationales: {
      supervisor: "Workflow complete. Evaluation scores consistent across all judge agents.",
      relevanceJudge: "Relevance score 4.8/5. Accurate focus.",
      accuracyJudge: "Accuracy score 4.7/5. Firecracker and SnapStart mechanisms correctly stated.",
      hallucinationDetector: "Hallucination score 4.9/5. Fully grounded.",
      completenessJudge: "Completeness score 4.1/5. Thorough response.",
      verdictAggregator: "Aggregated score: 90/100 (Pass)."
    },
    latencyMs: 1420,
    tokenCount: 460,
    isDemoData: true
  }
];

export const PRESET_EXAMPLES = [
  {
    title: "Hallucination & Contradiction Case (Gemini Specs)",
    badge: "High Risk Demo",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    question: "What are the technical specifications, context window, and release date of the Gemini 1.5 Pro model?",
    response: "Gemini 1.5 Pro was publicly launched worldwide on April 31, 2024. It features a groundbreaking 2 million token context window, allowing processing of vast amounts of code and hours of audio. Additionally, Gemini 1.5 Pro operates with completely zero server GPU inference cost and achieves 100% mathematical accuracy on all Olympiad benchmark datasets.",
    referenceAnswer: "Gemini 1.5 Pro was announced in February 2024 and previewed with up to a 2 million token context window. It runs on Google TPU v4/v5e infrastructure with standard cloud pricing, not zero cost.",
    referenceDocument: "Google_Gemini_Technical_Report_2024.pdf"
  },
  {
    title: "High Quality Passing Case (RAG Architecture)",
    badge: "Verified Pass Demo",
    badgeColor: "bg-green-50 text-green-700 border-green-200",
    question: "Explain the architecture of Retrieval-Augmented Generation (RAG) and its key benefits for enterprise AI systems.",
    response: "Retrieval-Augmented Generation (RAG) optimizes LLM outputs by referencing an authoritative knowledge base outside of its training data before generating a response. It operates in two main phases: retrieval, where relevant document chunks are fetched using semantic search (such as FAISS or ChromaDB with vector embeddings), and generation, where the retrieved context is appended to the user prompt for the language model. The key enterprise benefits include reducing hallucination risk, providing domain-specific recency without expensive fine-tuning, and offering verifiable source citations for corporate audits.",
    referenceAnswer: "RAG combines external document retrieval (vector database + embedding similarity) with language model generation. It grounds generation on vetted internal sources, lowers hallucination rates, and allows updates to knowledge bases without retraining models.",
    referenceDocument: "Enterprise_AI_Architecture_Guidelines_v3.pdf"
  },
  {
    title: "Omission & Needs Improvement Case (Vector DBs)",
    badge: "Omission Demo",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    question: "Compare PostgreSQL pgvector with FAISS for semantic vector indexing in enterprise applications.",
    response: "PostgreSQL pgvector is an open-source extension that allows storing and querying vector embeddings directly alongside relational tables in Postgres. It supports IVFFlat and HNSW indexing with SQL queries and ACID transactions. FAISS, developed by Meta AI, is an in-memory C++ library specialized for extremely high-throughput similarity search over billions of vectors. pgvector is ideal for existing relational workloads, while FAISS excels in standalone ultra-high throughput indexing.",
    referenceAnswer: "pgvector provides relational integration, ACID guarantees, and SQL compatibility. FAISS is a specialized library optimized for vector similarity speed, clustering, and GPU acceleration, but lacks native relational features.",
    referenceDocument: "Vector_Databases_Comparative_Study_2025.pdf"
  }
];
