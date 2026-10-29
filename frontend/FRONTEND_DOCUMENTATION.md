# AI RESPONSE QUALITY EVALUATION SYSTEM
## Frontend Engineering & Technical Architecture Documentation
**Infosys Springboard Internship Project**

---

## 1. Executive Summary

### 1.1 Project Overview
The **AI Response Quality Evaluation System** is an enterprise-grade observability and quality audit platform designed to evaluate AI-generated or user-submitted responses against specific prompts and trusted reference documents. 

Unlike conventional conversational chatbots that merely generate text, this platform functions as an **independent auditor and judge**. It deconstructs complex AI responses into atomic factual claims, performs semantic vector retrieval over indexed knowledge corpora using **FAISS (Facebook AI Similarity Search)**, evaluates the claims across multiple specialized dimensions using an **LLM-as-a-Judge multi-agent architecture**, and aggregates the findings into an explainable, transparent audit verdict.

### 1.2 Core Problem Addressed
Large Language Models (LLMs) frequently suffer from:
- **Hallucination:** Fabricating believable but fictitious facts, dates, numbers, or citations.
- **Topical Drift:** Providing lengthy, grammatically fluent answers that fail to address the core user question.
- **Factual Contradiction:** Stating assertions that directly conflict with verified ground truth documents.
- **Critical Omissions:** Answering partially while leaving out critical regulatory, medical, or architectural constraints.

This platform solves these challenges by providing transparent, evidence-backed evaluation with explicit uncertainty quantification.

---

## 2. Technology Stack & Design System

### 2.1 Technology Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript | Component-driven architecture with strict type safety |
| **Build Tool** | Vite 8.3 | High-performance bundling and sub-second HMR |
| **Styling** | Tailwind CSS v3.4 | Consistent enterprise utility-first design system |
| **Routing** | React Router v7 | Client-side routing across 8 dedicated pages |
| **Icons** | Lucide React | Consistent, professional enterprise icon set |
| **Data Visualization**| Recharts | Responsive Area, Line, Bar, and Donut charts |
| **Vector Engine** | FAISS + Sentence Transformers | Semantic cosine similarity search (`all-MiniLM-L6-v2`) |
| **Storage / State** | Centralized Services + LocalStorage | Persistent data adapter with FastAPI backend fallback |

### 2.2 Visual Theme & Color Palette
The interface adheres strictly to an enterprise SaaS aesthetic (inspired by modern developer platforms and AI observability dashboards):
- **Primary Action:** `#2563EB` (Blue 600) / Hover: `#1D4ED8` (Blue 700)
- **Primary Text:** `#0F172A` (Slate 900)
- **Secondary Text:** `#64748B` (Slate 500)
- **Main Background:** `#F5F7FB` (Soft cool off-white)
- **Card Background:** `#FFFFFF` (Pure white)
- **Borders:** `#E2E8F0` (Slate 200)
- **Success Badge (Supported / Pass):** `#16A34A` (Green 600)
- **Warning Badge (Unsupported / Needs Improvement):** `#D97706` (Amber 600)
- **Error Badge (Contradicted / Fail):** `#DC2626` (Red 600)
- **Teal Accent (Vector & Knowledge Base):** `#0F766E` (Teal 700)

---

## 3. Multi-Agent Architecture & Mathematical Scoring

### 3.1 The Five Logical Agents
The system coordinates five specialized agents:

1. **Supervisor / Orchestrator Agent:**
   - Decomposes the submitted AI answer into discrete, verifiable atomic sentences.
   - Coordinates task delegation, token budget limits, and schedules parallel judge invocations.
   - Queries the FAISS vector index to retrieve the top-$k$ relevant grounding passages.

2. **Relevance Judge Agent (Weight: 20%):**
   - Compares the prompt intent vector with the response vector.
   - Evaluates whether the answer directly addresses the prompt without extraneous drift.
   - Produces a score from `0.0` to `5.0`.

3. **Accuracy Judge Agent (Weight: 30%):**
   - Cross-examines each extracted claim against the retrieved reference passages.
   - Verifies numerical figures, dates, and technical claims against ground truth.
   - Produces an evidence-backed score from `0.0` to `5.0`.

4. **Hallucination Detection Sentinel (Weight: 25%):**
   - Categorizes each claim into one of four mutually exclusive scientific categories:
     - **Supported:** Document directly corroborates the statement.
     - **Unsupported:** Document does not mention the fact (missing evidence).
     - **Contradicted:** Document directly refutes the statement.
     - **Inconclusive:** Ambiguous phrasing or insufficient contextual clarity.
   - *Critical Principle:* Missing evidence is **never** automatically treated as a lie or hallucination unless an authoritative contradiction exists.

5. **Completeness Judge Agent (Weight: 25%):**
   - Performs omission analysis across required sub-facets and caveats.
   - Identifies whether essential technical prerequisites or edge cases were ignored.
   - Produces a score from `0.0` to `5.0`.

### 3.2 Verdict Aggregator & Mathematical Formula
The final normalized score ($0\text{--}100$) is calculated using a linear composite equation:

$$\text{Overall Score} = \left(0.20 \times \frac{\text{Relevance}}{5} + 0.30 \times \frac{\text{Accuracy}}{5} + 0.25 \times \frac{\text{Hallucination}}{5} + 0.25 \times \frac{\text{Completeness}}{5}\right) \times 100$$

#### Verdict Thresholds & Non-Linear Safety Veto:
- **Pass:** Overall Score $\ge 80\%$ with zero critical contradictions.
- **Needs Improvement:** Overall Score between $60\%$ and $79\%$.
- **Fail:** Overall Score $< 60\%$.
- **Non-Linear Safety Veto:** If a claim in a critical domain (such as medical dosage, financial compliance, or infrastructure safety) is classified as **Contradicted**, the system triggers an automatic **Fail** verdict regardless of the weighted average score.

---

## 4. Frontend Application Structure & Detailed Page Breakdown

```
src/
├── app/
│   └── App.tsx                 # Client router (8 core routes + fallback)
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx       # Application shell with Settings & Help modals
│   │   ├── Sidebar.tsx         # Collapsible navigation drawer
│   │   └── TopNavbar.tsx       # Dynamic breadcrumbs, search & notifications
│   ├── shared/
│   │   ├── KpiCard.tsx         # Metrics display card
│   │   ├── ScoreIndicator.tsx  # Color-coded progress bar & score indicator
│   │   ├── ScoreCard.tsx       # Dimension score card with detail links
│   │   ├── StatusBadge.tsx     # Supported/Contradicted/Pass status badges
│   │   ├── Modal.tsx           # Accessible backdrop dialog
│   │   ├── EmptyState.tsx      # Clean placeholder when records are empty
│   │   └── LoadingSkeleton.tsx # Shimmer loading animation
├── pages/
│   ├── DashboardPage.tsx       # Executive overview & Recharts telemetry
│   ├── EvaluateResponsePage.tsx# Primary submission form & live progress stepper
│   ├── EvaluationResultsPage.tsx# Deep-dive report, claim drawer & PDF export
│   ├── EvaluationHistoryPage.tsx# Search, multi-filter, & side-by-side comparison
│   ├── AgentArchitecturePage.tsx# Interactive multi-agent topology map & inspector
│   ├── KnowledgeBasePage.tsx   # Document manager, chunks & retrieval tester
│   ├── AnalyticsReportsPage.tsx# 6 Analytical charts & executive report modal
│   ├── BatchEvaluationPage.tsx # CSV dataset evaluation at scale
│   └── NotFoundPage.tsx        # 404 Route recovery
├── services/
│   ├── apiClient.ts            # Centralized API client with connection health check
│   ├── evaluationService.ts    # Evaluation pipeline simulation & storage
│   ├── knowledgeBaseService.ts # Chunking and FAISS cosine similarity engine
│   └── batchService.ts         # CSV parsing, schema validation & batch runner
├── types/                      # TypeScript definitions (evaluation, agents, KB, batch)
└── data/                       # Seeded realistic demonstration datasets
```

### Detailed Page Breakdown

#### Page 1: Dashboard (`/dashboard`)
- **Key Metrics:** Total Evaluations, Average Quality Score, Hallucination Risk Rate, Evaluations Requiring Review.
- **Visualizations:** Evaluation Volume Area Chart, Verdict Donut Chart, 7-Day Dimension Trajectory Bar Chart, and Normalized Score Distribution Histogram.
- **Data Table:** Recent audits with search, verdict filters, and one-click inspection.
- **System Stack Health:** Live status of FAISS, Sentence Transformers, and judge models.

#### Page 2: Evaluate Response (`/evaluate`)
- **Input Form:** Question textarea, AI Response textarea, Optional Gold Reference textarea, and Knowledge Base selector.
- **Custom Document Ingestion:** Drag-and-drop or file upload supporting `.pdf`, `.txt`, `.docx`, `.md`, and `.json`.
- **Pre-configured Presets:** One-click demo buttons demonstrating:
  1. *Hallucination Case:* Gemini Specs with fictitious calendar date ("April 31") and impossible zero GPU costs.
  2. *Pass Case:* RAG Architecture with full factual citations.
  3. *Omission Case:* Vector Databases omitting GPU acceleration dimensions.
- **Live 9-Stage Progress Stepper:** Realistic animation tracking Input Validation $\to$ Claim Extraction $\to$ FAISS Retrieval $\to$ 4 Judges $\to$ Aggregator $\to$ Final Findings.

#### Page 3: Evaluation Results (`/evaluations/:evaluationId`)
- **Executive Score Hero:** Large score display ($0\text{--}100$), verdict badge, executive summary, and grounding confidence percentage.
- **4 Dimension Cards:** Relevance, Accuracy, Hallucination Assessment, and Completeness.
- **Side-by-Side Content Display:** Prompt vs. AI Response with preserved typography.
- **Claim Analysis Table:** Expandable rows showing Claim #, Text, Status Badge, Confidence %, and Grounding Evidence Quote with source document and chunk ID.
- **Multi-Tab Workspace:** Overview, Claim Analysis, Retrieved Reference Passages, Multi-Agent Reasoning Traces, and Engineering Recommendations.
- **Export Capabilities:** One-click Print/PDF Report generation and JSON export.

#### Page 4: Evaluation History (`/history`)
- **Filter Toolbar:** Real-time search by ID or question text, verdict filter, score range filter, and hallucination filter.
- **Side-by-Side Comparison Modal:** Checkbox selector allowing users to select any two evaluations and compare questions, responses, dimension scores, and verdicts side-by-side.
- **Data Export:** Complete history exportable to CSV.

#### Page 5: Agent Architecture (`/agents`)
- **End-to-End Visual Graph:** Ingestion $\to$ Guardrails $\to$ Supervisor $\to$ Router $\to$ FAISS Vector DB $\to$ 4 Specialized Judges $\to$ Aggregator $\to$ Continuous Feedback.
- **Technical Inspector Modal:** Clicking any agent node opens its JSON schemas, exact prompt templates, hyperparameters, and latency benchmarks.
- **Interactive Weight Simulator:** Allows users to adjust dimension weights and verify the sum.

#### Page 6: Knowledge Base & Vector Store (`/knowledge-base`)
- **Document Management:** Table displaying document names, formats, file sizes, chunk counts, FAISS synchronization status, and upload dates.
- **Chunk Inspector:** Inspect embedded text chunks and 384-dimensional vector previews.
- **Semantic Evidence Retrieval Playground:** Interactive test box where users can type any claim or query to test cosine similarity search against indexed chunks in real time.

#### Page 7: Analytics & Reports (`/analytics`)
- **6 Analytical Visualizations:** Load throughput, dimension score trajectories, hallucination category breakdown (*Supported vs. Unsupported vs. Contradicted vs. Inconclusive*), verdict donut, agent latency benchmarks, and score distributions.
- **Executive Report Generator:** Generates structured compliance summaries in PDF, CSV, or JSON.

#### Page 8: Batch Evaluation (`/batch-evaluation`)
- **CSV Dataset Ingestion:** Upload datasets with automated validation checking for missing columns, empty fields, and row counts.
- **Sample Template Download:** Downloadable standard CSV template (`question`, `response`, `reference_answer`).
- **Live Batch Execution:** Step-by-step progress bar with row-level scoring and pass/fail counters.
- **Results Export:** Export batch evaluation audit findings to CSV or JSON.

---

## 5. Demonstration Guide for Project Presentation

When presenting this project to your Infosys Springboard internship mentor:

1. **Start at the Dashboard (`/dashboard`):** Show the high-level monitoring metrics, hallucination rate, and explain the 4 evaluation dimensions.
2. **Move to Evaluate Response (`/evaluate`):** Click **"Load Example Presets"** and pick the *Hallucination Case (Gemini Specs)*. Point out how the form pre-fills the prompt and response with subtle errors ("April 31, 2024" and "zero GPU cost").
3. **Show the Progress Stepper:** Hit **"Evaluate Response"** and demonstrate how the system moves through all 9 stages in real time.
4. **Inspect the Results (`/evaluations/:id`):** 
   - Highlight the composite score and verdict (**Fail**).
   - Expand Claim #1 and Claim #3 to show how the system flagged the contradictory dates and costs in **Red**.
   - Show the cited document passage in the Evidence tab.
   - Explain the **Scientific Uncertainty Principle**: missing evidence is marked **Unsupported** (amber), not falsely accused of being fake.
5. **Show Agent Architecture (`/agents`):** Click on the **Accuracy Judge** and **Hallucination Sentinel** to showcase the prompt templates and model hyperparameters.
6. **Show Knowledge Base (`/knowledge-base`):** Type a query in the **Retrieval Playground** to demonstrate FAISS semantic vector search in action.
7. **Show Batch Evaluation (`/batch-evaluation`):** Click **"Load Sample Dataset"** and run a batch audit to demonstrate scalability across datasets.

---

*Authored for Infosys Springboard Internship Evaluation | October 2026*
