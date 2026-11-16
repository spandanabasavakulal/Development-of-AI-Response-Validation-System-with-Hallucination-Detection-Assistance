from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import db
from .agents.llm import llm_enabled
from .config import CORS_ORIGINS
from .rag import embedder
from .rag.seed import seed_demo_corpus
from .routers import batch, evaluations, knowledge


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    seed_demo_corpus()
    yield


app = FastAPI(title="AI Response Validation API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS, allow_methods=["*"], allow_headers=["*"])
app.include_router(evaluations.router)
app.include_router(knowledge.router)
app.include_router(batch.router)


@app.get("/health")
def health():
    return {"status": "ok", "llm_enabled": llm_enabled(), "embedder": embedder.backend_name()}
