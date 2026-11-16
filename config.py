import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "claude-sonnet-4-6")
DB_PATH = os.getenv("DB_PATH", "data/app.db")
EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
CORS_ORIGINS = [o.strip() for o in os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")]

# Composite score weights (must sum to 1.0)
WEIGHTS = {"relevance": 0.20, "accuracy": 0.30, "hallucination": 0.25, "completeness": 0.25}
PASS_THRESHOLD = 75
REVIEW_THRESHOLD = 50
