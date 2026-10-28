# AI Response Quality Evaluation System
### Enterprise-Grade Frontend Platform for Infosys Springboard Internship

A modern, cohesive enterprise AI observability and response quality evaluation platform. The system assesses AI-generated or user-submitted answers against a prompt and available reference evidence using an **LLM-as-a-Judge multi-agent architecture** combined with **FAISS vector search** (RAG).

---

## 🌟 Key Features

1. **Multi-Agent Evaluation Pipeline:**
   - **Supervisor / Orchestrator Agent:** Coordinates task queues, scheduling, and error recovery.
   - **Relevance Judge Agent:** Analyzes prompt-response intent alignment (0–5 score).
   - **Accuracy Judge Agent:** Cross-examines extracted claims against authoritative evidence passages (0–5 score).
   - **Hallucination Detection Sentinel:** Distinguishes between **Supported**, **Unsupported** (missing reference), and **Contradicted** (active factual conflict).
   - **Completeness Judge Agent:** Detects missing dimensions and omission analysis (0–5 score).
   - **Verdict Aggregator:** Computes normalized 0–100 composite score with configurable weighting:
     - Relevance: 20%
     - Accuracy: 30%
     - Hallucination: 25%
     - Completeness: 25%
     - Safety veto rule: Contradicted medical/financial claims trigger an automatic Fail verdict.

2. **Claim-Level Grounding Transparency:**
   - Decomposes answers into atomic claims.
   - Distinct badges: Supported (green), Unsupported (amber), Contradicted (red), Inconclusive (slate).
   - Expandable evidence drawers with chunk IDs, vector cosine similarities, and cited excerpts.
   - Uncertainty warnings explicitly communicating that missing evidence $\neq$ automatic falsity.

3. **8 Dedicated Enterprise Application Views:**
   - `/dashboard`: High-level monitoring KPI cards, evaluation volume trends, verdict donut distribution, dimension comparisons, and quick actions.
   - `/evaluate`: Working evaluation form with preset demonstration cases (Hallucination case, Pass case, Omission case), corpus selector, custom document uploader, strictness sliders, and real-time 9-stage progress tracker.
   - `/evaluations/:evaluationId`: Detailed audit findings, 4 dimension score cards, claim-level breakdown, retrieved passages, multi-agent reasoning traces, and export triggers (PDF, JSON).
   - `/history`: Searchable and filterable audit archive with sorting, pagination, side-by-side evaluation comparison modal, and CSV export.
   - `/agents`: Interactive topology diagram displaying the end-to-end evaluation flow, technical inspector modal with prompt templates and telemetry, and tech stack status.
   - `/knowledge-base`: Trusted reference document manager, chunk vector inspector, and semantic retrieval test playground.
   - `/analytics`: Analytics workspace with 6 Recharts visualizations (volume trends, score trajectories, hallucination category distributions, agent benchmarks) and executive report generator.
   - `/batch-evaluation`: Scaled CSV dataset evaluation with schema validation, row-by-row simulation progress, and batch results export.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Analytics & Visualizations:** Recharts
- **Design System:** Enterprise Light SaaS Theme (`#2563EB` primary, `#0F172A` text, `#F5F7FB` background, `#16A34A` success, `#D97706` warning, `#DC2626` error, `#0F766E` teal accent)
- **Backend Compatibility:** Python FastAPI, LangGraph, sentence-transformers (`all-MiniLM-L6-v2`), FAISS vector index, SQLite/PostgreSQL

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🔌 Backend Integration

The frontend includes a centralized API client (`src/services/apiClient.ts`).
- When a local Python FastAPI backend is detected at `http://localhost:8000/health`, the application automatically switches to **Live API** mode.
- When running standalone or during offline demonstrations, the platform operates in **Demo / Simulation Mode** with seeded realistic evaluations and localStorage persistence.
