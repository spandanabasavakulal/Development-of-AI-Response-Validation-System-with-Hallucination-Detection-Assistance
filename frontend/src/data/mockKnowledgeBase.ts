import { KBDocument } from '../types/knowledgeBase';

export const INITIAL_DOCUMENTS: KBDocument[] = [
  {
    id: "DOC-001",
    name: "Enterprise_AI_Architecture_Guidelines_v3.pdf",
    fileType: "PDF",
    fileSizeBytes: 2485000,
    uploadDate: "2026-10-25 09:30:00",
    status: "Indexed",
    chunkCount: 142,
    indexStatus: "FAISS Synchronized",
    description: "Architectural blueprint and governance guidelines for generative AI, RAG pipelines, and vector retrieval in enterprise IT.",
    category: "Architecture & Standards",
    chunks: [
      {
        id: "CHUNK-1082",
        chunkIndex: 1,
        content: "Retrieval-Augmented Generation (RAG) supplements pre-trained parametric memory by retrieving relevant text passages from indexed external corpora prior to generation. This grounds response synthesis in approved corporate knowledge.",
        tokenCount: 46,
        embeddingVectorPreview: [0.042, -0.128, 0.312, 0.089, -0.054]
      },
      {
        id: "CHUNK-1084",
        chunkIndex: 2,
        content: "The standard RAG pipeline executes in two discrete stages: (1) dense or hybrid retrieval over vector indices like FAISS or pgvector, and (2) prompt synthesis passing context to the inference engine.",
        tokenCount: 48,
        embeddingVectorPreview: [0.015, -0.094, 0.285, 0.110, -0.012]
      },
      {
        id: "CHUNK-1090",
        chunkIndex: 3,
        content: "RAG architectures demonstrate an 84% reduction in non-grounded outputs while circumventing the substantial compute costs of continuous model re-training and specialized parameter fine-tuning.",
        tokenCount: 41,
        embeddingVectorPreview: [0.088, -0.034, 0.198, 0.076, -0.089]
      },
      {
        id: "CHUNK-1095",
        chunkIndex: 4,
        content: "Provenance attribution allows compliance officers to trace model statements back to specific chunk source IDs and document page timestamps, satisfying auditability criteria.",
        tokenCount: 38,
        embeddingVectorPreview: [0.061, -0.112, 0.245, 0.052, -0.031]
      }
    ]
  },
  {
    id: "DOC-002",
    name: "Google_Gemini_Technical_Report_2024.pdf",
    fileType: "PDF",
    fileSizeBytes: 4120000,
    uploadDate: "2026-10-26 14:10:00",
    status: "Indexed",
    chunkCount: 288,
    indexStatus: "FAISS Synchronized",
    description: "Official technical report detailing Gemini 1.5 architecture, multimodal training, and 2M token context window benchmarks.",
    category: "LLM Technical Specs",
    chunks: [
      {
        id: "CHUNK-004",
        chunkIndex: 1,
        content: "Google introduced Gemini 1.5 Pro in early access on February 15, 2024, with public developer availability on Google AI Studio expanding throughout spring 2024.",
        tokenCount: 36,
        embeddingVectorPreview: [0.092, -0.018, 0.345, 0.142, -0.071]
      },
      {
        id: "CHUNK-012",
        chunkIndex: 2,
        content: "Gemini 1.5 Pro successfully scales long-context window processing up to 2 million tokens with near-perfect retrieval in needle-in-a-haystack evaluations across audio, video, and text.",
        tokenCount: 42,
        embeddingVectorPreview: [0.054, -0.078, 0.412, 0.098, -0.032]
      },
      {
        id: "CHUNK-022",
        chunkIndex: 3,
        content: "On MATH and GSM8K benchmarks, Gemini 1.5 Pro achieved competitive state-of-the-art scores (86.5% on GSM8K with CoT), but does not claim 100% on Olympiad tasks.",
        tokenCount: 39,
        embeddingVectorPreview: [0.077, -0.045, 0.298, 0.165, -0.044]
      }
    ]
  },
  {
    id: "DOC-003",
    name: "Vector_Databases_Comparative_Study_2025.pdf",
    fileType: "PDF",
    fileSizeBytes: 1850000,
    uploadDate: "2026-10-26 17:05:00",
    status: "Indexed",
    chunkCount: 96,
    indexStatus: "FAISS Synchronized",
    description: "Evaluation and benchmarking of vector search engines: FAISS, pgvector, Milvus, Qdrant, and ChromaDB.",
    category: "Database & Storage",
    chunks: [
      {
        id: "CHUNK-210",
        chunkIndex: 1,
        content: "pgvector provides vector similarity search for Postgres with support for exact and approximate nearest neighbor search alongside traditional SQL queries and joins.",
        tokenCount: 37,
        embeddingVectorPreview: [0.019, -0.134, 0.221, 0.081, -0.062]
      },
      {
        id: "CHUNK-212",
        chunkIndex: 2,
        content: "pgvector supports both inverted file index (IVFFlat) and Hierarchical Navigable Small World (HNSW) indexing structures, fully adhering to PostgreSQL transaction guarantees.",
        tokenCount: 36,
        embeddingVectorPreview: [0.031, -0.119, 0.248, 0.093, -0.048]
      },
      {
        id: "CHUNK-218",
        chunkIndex: 3,
        content: "FAISS is a library for efficient similarity search and clustering of dense vectors, written in C++ with complete Python wrappers and CUDA GPU acceleration support.",
        tokenCount: 40,
        embeddingVectorPreview: [0.048, -0.092, 0.315, 0.114, -0.027]
      }
    ]
  },
  {
    id: "DOC-004",
    name: "AAP_Pediatric_Infection_Guidelines_2024.pdf",
    fileType: "PDF",
    fileSizeBytes: 3200000,
    uploadDate: "2026-10-27 08:00:00",
    status: "Indexed",
    chunkCount: 165,
    indexStatus: "FAISS Synchronized",
    description: "Clinical guidelines on pediatric antibiotic prescription protocols, dosage ranges, and contraindications.",
    category: "Clinical & Safety",
    chunks: [
      {
        id: "CHUNK-402",
        chunkIndex: 1,
        content: "First-line antimicrobial therapy is high-dose amoxicillin (80 to 90 mg/kg per day divided into 2 doses). Ceiling adult dosage must not exceed 4000 mg daily.",
        tokenCount: 39,
        embeddingVectorPreview: [0.022, -0.088, 0.291, 0.074, -0.051]
      },
      {
        id: "CHUNK-405",
        chunkIndex: 2,
        content: "Dosages above 90 mg/kg/day provide no clinical benefit and drastically increase risk of clavulanate-associated diarrhea and amoxicillin toxicity. Patients must never alter dosing without physician supervision.",
        tokenCount: 44,
        embeddingVectorPreview: [0.014, -0.071, 0.334, 0.062, -0.039]
      }
    ]
  },
  {
    id: "DOC-005",
    name: "AWS_Serverless_Performance_Whitepaper.pdf",
    fileType: "PDF",
    fileSizeBytes: 1980000,
    uploadDate: "2026-10-27 10:15:00",
    status: "Indexed",
    chunkCount: 110,
    indexStatus: "FAISS Synchronized",
    description: "Best practices for serverless latency optimization, cold start mitigations, and execution environment lifecycles.",
    category: "Cloud Engineering",
    chunks: [
      {
        id: "CHUNK-501",
        chunkIndex: 1,
        content: "A cold start occurs when an invocation route maps to a new execution environment rather than an already warm container.",
        tokenCount: 29,
        embeddingVectorPreview: [0.038, -0.104, 0.278, 0.085, -0.061]
      },
      {
        id: "CHUNK-503",
        chunkIndex: 2,
        content: "During the Init phase, Lambda downloads the deployment package, starts the Firecracker microVM, and executes initialization logic outside the handler.",
        tokenCount: 34,
        embeddingVectorPreview: [0.041, -0.098, 0.264, 0.092, -0.047]
      },
      {
        id: "CHUNK-507",
        chunkIndex: 3,
        content: "Provisioned Concurrency initializes requested execution environments ahead of time. Lambda SnapStart delivers sub-second cold starts for Java.",
        tokenCount: 30,
        embeddingVectorPreview: [0.052, -0.081, 0.301, 0.073, -0.033]
      }
    ]
  }
];
