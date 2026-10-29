# Development of AI Response Validation System with Hallucination Detection Assistance
### Infosys Springboard Internship Project

This repository hosts the research, architecture, analysis notebooks, and enterprise-grade frontend application for the **AI Response Validation System with Hallucination Detection Assistance**.

---

## 📁 Repository Directory Structure

```
├── frontend/                                   # Enterprise React + TypeScript Frontend Application
│   ├── src/                                    # UI components, pages, services, types & mock data
│   │   ├── components/                         # Layout & shared design system components
│   │   ├── pages/                              # 8 Dedicated audit & observability views
│   │   ├── services/                           # Centralized API & FAISS vector search simulation
│   │   └── types/                              # Strict TypeScript definitions
│   ├── public/                                 # Static assets & sample grounding documents
│   ├── FRONTEND_DOCUMENTATION.md               # Complete technical frontend documentation
│   ├── Frontend_Documentation.pdf              # 4-page printable technical documentation
│   ├── Enterprise_AI_Architecture_Guidelines.pdf # Sample test ground truth document
│   ├── package.json                            # Dependencies & build scripts
│   ├── vite.config.ts                          # Vite 8.3 bundler configuration
│   └── tailwind.config.js                      # Tailwind CSS enterprise SaaS theme
├── AI_Response_Validation_Final(1).docx        # Final project submission report
├── Model Research.docx                         # LLM-as-a-Judge & RAG model research
├── Python.ipynb                                # Backend Python pipeline & prototyping notebook
├── SQL.ipynb                                   # Database schema & query exploration notebook
├── system srchitecture.jpeg                    # Multi-agent architecture workflow diagram
└── LICENSE                                     # Open-source license
```

---

## 🚀 Running the Frontend Application

The complete user interface is packaged inside the [`frontend/`](./frontend) directory.

### Quick Start:
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the development server
npm run dev
```

Open your browser at **`http://localhost:5173/`**.

---

## 🌟 Frontend Features Overview

- **5 Specialized AI Judges:** Supervisor, Relevance Judge, Accuracy Judge, Hallucination Sentinel, and Completeness Judge.
- **Scientific Claim Categorization:** Supported (green), Unsupported (amber), Contradicted (red), Inconclusive (slate).
- **8 Enterprise Pages:**
  1. `/dashboard`: Executive metrics and telemetry charts.
  2. `/evaluate`: Input form with preset test cases and live 9-stage progress tracker.
  3. `/evaluations/:id`: Deep-dive audit report with claim-by-claim citations.
  4. `/history`: Searchable history with side-by-side comparison.
  5. `/agents`: Interactive topology diagram and prompt inspector.
  6. `/knowledge-base`: Document manager and FAISS vector search playground.
  7. `/analytics`: Recharts analytical graphs and executive report exports.
  8. `/batch-evaluation`: Dataset evaluation at scale with CSV validation.

For full technical documentation, see [`frontend/FRONTEND_DOCUMENTATION.md`](./frontend/FRONTEND_DOCUMENTATION.md) and [`frontend/Frontend_Documentation.pdf`](./frontend/Frontend_Documentation.pdf).
