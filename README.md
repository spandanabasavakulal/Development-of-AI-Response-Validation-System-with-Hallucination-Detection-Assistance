# AI Response Quality Evaluator Agent
### An Intelligent Multi-Agent Framework for AI Response Validation and Hallucination Detection

<p align="center">
  <strong>Development of AI Response Validation System with Hallucination Detection Assistance</strong>
</p>

<p align="center">
  A multi-agent evaluation framework that assesses AI-generated responses across relevance, factual accuracy, hallucination risk, and completeness using Large Language Models and Retrieval-Augmented Generation.
</p>

---
## 🚀 Live Demo

Experience the deployed AI Eval Sentinel application:

**[Launch AI Eval Sentinel](https://development-of-ai-response-validati-mu.vercel.app/)**

The application is deployed using Vercel (Frontend) and Render (Backend).

## 1. Project Overview

The **AI Response Quality Evaluator Agent** is an intelligent multi-agent platform designed to evaluate the quality and reliability of AI-generated responses.

Large Language Models (LLMs) can generate fluent and contextually relevant answers that may nevertheless contain inaccurate information, unsupported claims, hallucinations, or incomplete explanations. Traditional evaluation approaches often rely on a single metric or manual verification, making comprehensive response assessment difficult.

This project addresses that problem through a multi-agent evaluation architecture in which specialized AI agents independently assess different quality dimensions of an AI-generated response.

The system accepts:
- A user question.
- An AI-generated response.
- An optional reference answer.

It then executes a multi-agent evaluation pipeline consisting of five specialized agents:

1. Relevance Judge Agent
2. Accuracy Judge Agent
3. Hallucination Detection Agent
4. Completeness Judge Agent
5. Verdict Agent

The first four agents evaluate different dimensions of the response. The Verdict Agent aggregates their evaluation scores and generates an overall quality assessment.

The system also integrates a Retrieval-Augmented Generation (RAG) pipeline using Sentence Transformers and FAISS to retrieve relevant evidence from an indexed knowledge base.

The final result is presented through an interactive web dashboard developed using React and TypeScript, with a Python FastAPI backend.

---

## 2. Problem Statement

AI-generated responses are increasingly used in education, research, customer support, programming, and information retrieval.

However, AI-generated content may exhibit several quality issues:

- **Irrelevance:** The response does not directly address the user's question.
- **Factual Inaccuracy:** The response contains incorrect information.
- **Hallucination:** The response generates unsupported or contradicted claims.
- **Incompleteness:** The response fails to include essential information required to answer the question.

A response can be relevant but factually incorrect. Similarly, a response can contain correct information while omitting important details.

Therefore, evaluating AI-generated content using only one quality metric is insufficient.

This project proposes a multi-agent response evaluation framework that independently assesses these dimensions and combines the results into a final evaluation.

---

## 3. Project Objectives

The primary objectives are:

1. Develop an intelligent system for evaluating AI-generated responses.
2. Implement a multi-agent architecture using specialized LLM-based evaluation agents.
3. Evaluate response relevance and contextual alignment.
4. Assess factual accuracy using reference information and available evidence.
5. Identify hallucinated, unsupported, and contradicted claims.
6. Measure response completeness by identifying missing information.
7. Integrate Retrieval-Augmented Generation using FAISS.
8. Generate an overall quality score through a centralized Verdict Agent.
9. Develop an interactive web interface for submitting and reviewing evaluations.
10. Provide transparent evaluation explanations and improvement recommendations.

---

## 4. System Architecture

The system follows a modular client-server architecture.

### 4.1 High-Level Architecture

```text
                 USER
                   |
                   v
          REACT WEB APPLICATION
                   |
                   v
             FASTAPI BACKEND
                   |
                   v
          INPUT VALIDATION
                   |
                   v
          MULTI-AGENT PIPELINE
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
   RELEVANCE    ACCURACY   HALLUCINATION
     AGENT       AGENT       AGENT
       |           |           |
       +-----------+-----------+
                   |
                   v
             COMPLETENESS
                 AGENT
                   |
                   v
               VERDICT
                 AGENT
                   |
                   v
          SCORE AGGREGATION
                   |
                   v
          FINAL EVALUATION
                   |
                   v
          REACT DASHBOARD
```

### 4.2 Retrieval-Augmented Generation Architecture

```text
       REFERENCE DATASETS
                |
                v
         DOCUMENT LOADER
                |
                v
       DATA PREPROCESSING
                |
                v
       SENTENCE TRANSFORMERS
                |
                v
        TEXT EMBEDDINGS
                |
                v
          FAISS INDEX
                |
                v
       RELEVANT EVIDENCE
                |
                v
       EVALUATION AGENTS
```

The RAG component retrieves relevant passages from the indexed knowledge base. These passages can assist evidence-based evaluation, particularly hallucination detection.

The user-provided reference answer and retrieved knowledge-base evidence are distinct sources and should not be treated as interchangeable.

---

## 5. Multi-Agent Evaluation Framework

The system uses five logical LLM-based evaluation agents. Each agent has a specialized evaluation responsibility and prompt.

### 5.1 Relevance Judge Agent

**Purpose:** Determine whether the generated response addresses the user's question.

Responsibilities:
- Understand the intent of the question.
- Examine the relationship between the question and response.
- Identify relevant content.
- Identify irrelevant or tangential information.
- Highlight missing relevant aspects.

Output:
- Relevance score.
- Relevance verdict.
- Explanation.
- Relevant content.
- Irrelevant content.
- Missing aspects.

Important design consideration:

Relevance is evaluated independently of factual correctness. An incorrect answer can still be relevant if it directly addresses the question.

### 5.2 Accuracy Judge Agent

**Purpose:** Evaluate the factual correctness of the generated response.

Responsibilities:
- Compare the response with an available reference answer.
- Identify supported claims.
- Identify incorrect claims.
- Identify unsupported claims.
- Generate an accuracy assessment.

Output:
- Accuracy score.
- Accuracy verdict.
- Explanation.
- Supported claims.
- Unsupported claims.
- Incorrect claims.
- Evidence used, when available.

### 5.3 Hallucination Detection Agent

**Purpose:** Identify potentially hallucinated information in AI-generated responses.

Responsibilities:
- Examine individual claims.
- Retrieve relevant supporting information from the FAISS knowledge base.
- Compare generated claims against retrieved evidence.
- Identify unsupported or contradicted statements.
- Estimate hallucination risk.

Output:
- Hallucination score representing risk.
- Hallucination verdict.
- Explanation.
- Hallucinated claims.
- Unsupported claims.
- Contradicted claims.
- Retrieved evidence.

A high hallucination risk indicates that the response contains claims that are unsupported or contradicted by the available evidence.

### 5.4 Completeness Judge Agent

**Purpose:** Determine whether the response includes the essential information required by the question.

Responsibilities:
- Identify the key information required to answer the question.
- Examine whether each essential aspect is covered.
- Identify missing information.
- Avoid treating an incorrect answer as successfully covering a required fact.
- Generate suggestions for improving completeness.

Output:
- Completeness score.
- Completeness verdict.
- Explanation.
- Covered aspects.
- Missing aspects.
- Improvement suggestions.

### 5.5 Verdict Agent

**Purpose:** Combine the evaluation results and produce the final response-quality assessment.

Responsibilities:
- Receive the scores from the four evaluation agents.
- Convert hallucination risk into a positive quality dimension.
- Calculate the overall evaluation score.
- Determine the final verdict.
- Generate strengths, weaknesses, recommendations, and a summary.

The Verdict Agent acts as the centralized decision-making component of the evaluation pipeline.

---

## 6. Evaluation Methodology

The system evaluates responses using four independent quality dimensions:

1. Relevance
2. Accuracy
3. Hallucination Quality
4. Completeness

Each dimension is represented by a score between 0 and 100.

### 6.1 Overall Score Calculation

The overall score is calculated using the arithmetic mean of the four dimension scores.

**Formula:**

Overall Score = (Relevance + Accuracy + Hallucination Quality + Completeness) / 4

Since the Hallucination Agent calculates hallucination risk, the Verdict Agent converts it into a positive quality score.

Hallucination Quality = 100 - Hallucination Risk

**Example:**

| Dimension | Score |
|---|---:|
| Relevance | 100 |
| Accuracy | 0 |
| Hallucination Quality | 0 |
| Completeness | 0 |

Overall Score = (100 + 0 + 0 + 0) / 4

**Overall Score = 25/100**

### 6.2 Final Verdict Classification

The Verdict Agent applies the following overall score thresholds:

| Overall Score | Verdict |
|---|---|
| 85–100 | EXCELLENT |
| 70–84.99 | GOOD |
| 50–69.99 | MODERATE |
| Below 50 | POOR |

An additional review rule is applied: when hallucination risk reaches the configured threshold of 40 or higher, the final verdict becomes NEEDS_REVIEW.

This is a configurable evaluation policy, not a statistically calibrated confidence threshold.

### 6.3 Evaluation Score Interpretation

| Score Range | Interpretation |
|---|---|
| 80–100 | Strong performance |
| 60–79 | Moderate performance |
| 40–59 | Weak performance |
| 0–39 | Poor performance |

The evaluation scores are model-generated assessments and should not be interpreted as guaranteed probabilities of correctness.

---

## 7. Dataset Description

The project uses three publicly available datasets to construct the knowledge base for retrieval and evaluation experiments.

### 7.1 SQuAD 2.0

**Dataset:** Stanford Question Answering Dataset 2.0

SQuAD 2.0 contains question-answer pairs based on Wikipedia passages. It also includes questions that cannot be answered from the provided context.

Usage:
- Question-answering reference information.
- Supporting evidence for response evaluation.
- Contextual retrieval.

Source: https://huggingface.co/datasets/rajpurkar/squad_v2

### 7.2 HaluEval

HaluEval is a benchmark dataset designed to study hallucination detection in generated text.

Usage:
- Hallucination-related examples.
- Reference material for studying generated and potentially hallucinated responses.
- Supporting information for hallucination evaluation.

Source: https://huggingface.co/datasets/pminervini/HaluEval

### 7.3 HotpotQA

HotpotQA is a question-answering dataset designed for multi-hop reasoning. It includes questions requiring information from multiple supporting documents.

Usage:
- Multi-hop question-answering examples.
- Contextual evidence retrieval.
- Supporting information for completeness and reasoning-related evaluation.

Source: https://huggingface.co/datasets/hotpotqa/hotpot_qa

### 7.4 Dataset Processing

The project uses selected subsets of approximately 1,000 records from each dataset.

The data-processing pipeline includes:

1. Dataset loading.
2. Selection of relevant fields.
3. Text preprocessing.
4. Conversion into processed JSONL files.
5. Generation of sentence embeddings.
6. Storage of embeddings in a FAISS index.
7. Storage of corresponding metadata.

**Important:** These datasets provide retrieval material and evaluation examples. They are not used to train or fine-tune the Gemini model. Their annotations should not be interpreted as ground-truth labels for every arbitrary user-generated response.

---

## 8. Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type-safe frontend development |
| Vite | Frontend development server and build tool |
| Tailwind CSS | UI styling |
| Lucide React | Interface icons |

### Backend

| Technology | Purpose |
|---|---|
| Python | Backend development |
| FastAPI | REST API development |
| Uvicorn | ASGI application server |
| Pydantic | Request and data validation |

### Artificial Intelligence and Machine Learning

| Technology | Purpose |
|---|---|
| Google Gemini API | LLM-based agent evaluation |
| Sentence Transformers | Text embedding generation |
| FAISS | Vector similarity search |
| Retrieval-Augmented Generation | Evidence retrieval and contextual evaluation |
| JSON | Structured agent outputs |

### Development Tools

- Visual Studio Code
- Git
- GitHub
- PowerShell / Command Prompt
- Python virtual environment
- Node.js and npm

---

## 9. Project Directory Structure

The project is organized into separate frontend and backend modules.

```text
Development-of-AI-Response-Validation-System-
with-Hallucination-Detection-Assistance/
│
├── backend/
│   ├── agents/
│   │   ├── relevance.py
│   │   ├── accuracy.py
│   │   ├── hallucination.py
│   │   ├── completeness.py
│   │   └── verdict.py
│   │
│   ├── rag/
│   │   ├── document_loader.py
│   │   ├── embeddings.py
│   │   └── faiss_store.py
│   │
│   ├── data/
│   │   ├── raw/
│   │   ├── processed/
│   │   └── vector_store/
│   │
│   ├── utils/
│   │   └── gemini_retry.py
│   │
│   ├── model/
│   ├── main.py
│   ├── api.py
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignore
```

The directory listing is a logical overview. Keep the README synchronized with the actual repository structure if files are renamed or additional modules are added.

---

## 10. Installation and Setup

### 10.1 Prerequisites

Install the following:

- Python 3.10 or a compatible version supported by the installed dependencies.
- Node.js and npm.
- Git.
- A Google Gemini API key.
- Visual Studio Code (recommended).

### 10.2 Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd Development-of-AI-Response-Validation-System-with-Hallucination-Detection-Assistance
```

### 10.3 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory.

Configure the following environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Replace the placeholder with your own API key.

**Security:** Never commit `.env` files or expose API keys in public repositories.

### 10.4 Start the Backend

From the backend directory:

```bash
uvicorn api:app --reload
```

The backend should be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

Health endpoint:

```text
http://127.0.0.1:8000/health
```

### 10.5 Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend should be accessible at:

```text
http://localhost:5173
```

Keep both the backend and frontend servers running during live evaluation.

---

## 11. API Documentation

The backend exposes REST endpoints using FastAPI.

### 11.1 Root Endpoint

**Method:** GET

**Endpoint:**

```text
/
```

Returns basic API information.

### 11.2 Health Check Endpoint

**Method:** GET

**Endpoint:**

```text
/health
```

Checks whether the backend service is available.

### 11.3 Response Evaluation Endpoint

**Method:** POST

**Endpoint:**

```text
/evaluate
```

Accepts the question, generated response, and optional reference answer.

Example request:

```json
{
  "question": "What is the capital of France?",
  "ai_response": "The capital of France is Paris.",
  "reference_answer": "The capital of France is Paris."
}
```

The endpoint executes the evaluation pipeline and returns the results from the individual agents and the final Verdict Agent.

The response includes:
- Question and AI response.
- Relevance evaluation.
- Accuracy evaluation.
- Hallucination evaluation.
- Completeness evaluation.
- Final verdict.
- Overall score.
- Dimension scores.
- Strengths and weaknesses.
- Recommendations and summary.

---

## 12. Application Workflow

The application follows these steps:

**Step 1: User Input**

The user submits a question, AI-generated response, and optional reference answer through the frontend.

**Step 2: API Request**

The React application sends the input to the FastAPI backend through the `/evaluate` endpoint.

**Step 3: Agent Execution**

The backend invokes the four specialized evaluation agents.

**Step 4: Evidence Retrieval**

The RAG component retrieves relevant passages from the FAISS knowledge base when required by the evaluation process.

**Step 5: Evaluation Aggregation**

The Verdict Agent receives the individual scores and calculates the overall evaluation score.

**Step 6: Final Verdict**

The system generates the final verdict, strengths, weaknesses, recommendations, and summary.

**Step 7: Dashboard Visualization**

The frontend displays the evaluation results through the dashboard.

---

## 13. Testing and Experimental Results

The system was tested using both correct and incorrect responses to verify its evaluation behavior.

### Test Case 1: Correct Response

**Question:**

What is the capital of France?

**AI Response:**

The capital of France is Paris.

**Reference Answer:**

The capital of France is Paris.

**Observed Results:**

| Evaluation Dimension | Score |
|---|---:|
| Relevance | 100 |
| Accuracy | 100 |
| Hallucination Quality | 100 |
| Completeness | 100 |
| Overall Score | 100 |

**Final Verdict:** EXCELLENT

**Observation:**

The response directly answers the question, matches the supplied reference answer, and is supported by the retrieved evidence.

### Test Case 2: Incorrect Response

**Question:**

What is the capital of France?

**AI Response:**

The capital of France is Berlin.

**Reference Answer:**

The capital of France is Paris.

**Observed Results:**

| Evaluation Dimension | Score |
|---|---:|
| Relevance | 100 |
| Accuracy | 0 |
| Hallucination Quality | 0 |
| Completeness | 0 |
| Overall Score | 25 |

**Final Verdict:** NEEDS_REVIEW

**Observation:**

The response is relevant because it directly attempts to answer the question. However, it contains an incorrect factual statement. The hallucination agent identifies the contradiction with retrieved evidence, while the completeness agent identifies the missing correct answer.

### 13.1 Test Summary

| Test Scenario | Expected Behavior | Observed Behavior |
|---|---|---|
| Correct answer | High quality score | 100/100 |
| Incorrect factual answer | Low quality score | 25/100 |
| Relevant but incorrect response | Preserve relevance, penalize accuracy | Achieved |
| Contradicted factual claim | Identify hallucination risk | Achieved |
| Missing essential information | Penalize completeness | Achieved |

These are functional test cases, not a statistically comprehensive benchmark evaluation.

---

## 14. Key Features

- Five-agent evaluation architecture.
- LLM-based response assessment.
- Independent relevance and accuracy evaluation.
- Hallucination risk identification.
- Completeness assessment.
- Retrieval-Augmented Generation.
- FAISS vector similarity search.
- Sentence Transformer embeddings.
- Gemini API integration.
- Overall quality score calculation.
- Automated verdict generation.
- Detailed explanations and recommendations.
- Interactive React dashboard.
- FastAPI REST integration.
- Structured JSON outputs.
- Retry handling for temporary Gemini API failures.

---

## 15. Advantages

1. **Modular Architecture:** Each evaluation agent has a clearly defined responsibility.
2. **Multi-Dimensional Evaluation:** Response quality is assessed using four different dimensions.
3. **Evidence-Assisted Evaluation:** FAISS retrieval provides supporting contextual information.
4. **Explainable Results:** The system provides explanations and identifies problematic claims.
5. **Extensibility:** Additional evaluation agents and retrieval sources can be integrated.
6. **Interactive Interface:** Users can submit responses and inspect evaluation results.
7. **Separation of Concerns:** Frontend, backend, agents, and RAG components are maintained separately.

---

## 16. Limitations

The current implementation has the following limitations:

- Evaluation results depend on the behavior and reliability of the Gemini model.
- LLM-based judgments may vary between executions.
- Retrieved evidence may be incomplete, irrelevant, or insufficient.
- The accuracy agent may not always return retrieved evidence.
- A missing evidence passage does not automatically prove that a claim is false.
- The current score aggregation uses an equal-weight arithmetic mean.
- The verdict thresholds are heuristic and have not been statistically calibrated.
- Dataset annotations are not comprehensive ground-truth labels for arbitrary generated responses.
- Evaluation latency depends on API availability, model response time, and retry behavior.
- The current evaluation framework does not guarantee detection of every hallucination.

---

## 17. Future Enhancements

Potential future improvements include:

1. Implementing a larger and more diverse evaluation benchmark.
2. Introducing human-annotated evaluation datasets.
3. Improving retrieval relevance through better chunking and ranking.
4. Adding claim-level evidence verification.
5. Introducing configurable evaluation weights.
6. Calibrating evaluation scores against human judgments.
7. Integrating additional LLM providers.
8. Adding evaluation history and downloadable reports.
9. Improving API latency through optimized agent execution.
10. Adding automated regression testing.
11. Introducing confidence calibration and uncertainty estimation.
12. Supporting batch evaluation of multiple AI-generated responses.

---

## 18. Security Considerations

- Store API credentials in environment variables.
- Do not upload `.env` files to GitHub.
- Exclude virtual environments and unnecessary generated files from version control.
- Validate user input before processing.
- Handle API failures and invalid responses safely.
- Avoid exposing sensitive information in application logs.
- Use HTTPS and appropriate access controls when deploying publicly.

---

## 19. Conclusion

The AI Response Quality Evaluator Agent demonstrates a multi-agent approach to evaluating AI-generated responses using Large Language Models and Retrieval-Augmented Generation.

By separating relevance, accuracy, hallucination detection, and completeness into specialized evaluation agents, the system provides a more structured assessment than relying on a single evaluation metric.

The Verdict Agent combines these individual assessments to generate an overall score and final verdict. FAISS-based retrieval provides contextual evidence to support evidence-assisted evaluation.

The project integrates a React and TypeScript frontend with a Python FastAPI backend and Google Gemini API, demonstrating the practical application of multi-agent LLM evaluation and RAG techniques.

The developed system provides a foundation for further research into automated AI response validation, factual consistency, and hallucination detection.

---

## 20. Project Information

**Project Title:** Development of AI Response Validation System with Hallucination Detection Assistance

**Project Name:** AI Response Quality Evaluator Agent

**Project Domain:** Artificial Intelligence, Natural Language Processing, Large Language Models, Multi-Agent Systems, and Retrieval-Augmented Generation.

**Internship:** Infosys Springboard Virtual Internship 7.0

**Primary Technologies:** Python, React, TypeScript, FastAPI, Google Gemini API, Sentence Transformers, and FAISS.

**Repository:** Add your GitHub repository URL here.

---

## 21. Acknowledgements

We acknowledge the open-source communities and developers behind the technologies and datasets used in this project, including Google Gemini, Hugging Face, Sentence Transformers, FAISS, FastAPI, React, SQuAD 2.0, HaluEval, and HotpotQA.

We also acknowledge the guidance and support provided during the Infosys Springboard Virtual Internship 7.0.

---

## License

Add the appropriate license information before publishing this repository. Do not claim a license unless one has actually been selected and added to the repository.
