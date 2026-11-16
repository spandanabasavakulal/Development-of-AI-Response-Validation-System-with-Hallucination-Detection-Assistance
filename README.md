# Backend: AI Response Validation System

FastAPI + RAG (FAISS / all-MiniLM-L6-v2) + multi-agent evaluation pipeline (LangGraph).
Works out of the box with **no API key**: agents use built-in heuristics. Add an
`ANTHROPIC_API_KEY` to `.env` and the judges switch to LLM mode automatically.

## Run (Windows)
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```
Mac/Linux: use `source venv/bin/activate` and `cp .env.example .env`.

- Health check: http://localhost:8000/health  (frontend switches to Live API mode)
- Interactive docs: http://localhost:8000/docs
- Run tests: `python -m pytest -q`

If `sentence-transformers` or `faiss-cpu` fail to install, delete those lines from
`requirements.txt`; the app falls back to simple built-ins.
If you change the embedding backend, delete the `data/` folder so the index is rebuilt.

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | status, LLM + embedder mode |
| POST | `/api/evaluate` | run full evaluation `{prompt, response, corpus, strictness, top_k}` |
| GET | `/api/evaluations` | history (`q`, `verdict`, `limit`, `offset`) |
| GET/DELETE | `/api/evaluations/{id}` | detail / delete |
| GET | `/api/stats` | dashboard KPIs |
| GET/POST | `/api/knowledge/documents` | list / upload (.txt .md .pdf) |
| POST | `/api/knowledge/documents/text` | add raw text |
| DELETE | `/api/knowledge/documents/{id}` | remove document |
| GET | `/api/knowledge/documents/{id}/chunks` | inspect chunks |
| POST | `/api/knowledge/search` | semantic retrieval playground |
| POST | `/api/batch/evaluate` | CSV with `prompt,response` columns |

## Structure
```
app/
  main.py            FastAPI app, CORS, /health
  config.py          env settings, score weights (20/30/25/25)
  db.py              SQLite schema
  schemas.py         request models
  rag/               chunker, embedder, FAISS store, demo seed data
  agents/            llm client, judges, aggregator (safety veto), pipeline (LangGraph)
  routers/           evaluations, knowledge, batch
tests/test_api.py
```

## Connect to the frontend
`src/services/apiClient.ts` must call the paths above. If the frontend expects
different paths or JSON field names, change them in the routers (or adapt apiClient.ts).
