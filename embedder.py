"""Embeddings. Uses sentence-transformers (all-MiniLM-L6-v2) when installed,
otherwise a hashing bag-of-words fallback so the app still runs anywhere."""
import importlib.util
import re
import zlib
import numpy as np
from ..config import EMBED_MODEL

DIM = 384
_STOP = set("a an the is are was were be been of in on at to for from by with and or but if then than that "
            "this these those it its as into about not no what which who how when where why can could should "
            "would will may might do does did has have had".split())
_model = None
_use_st = importlib.util.find_spec("sentence_transformers") is not None


def backend_name() -> str:
    return "sentence-transformers" if _use_st else "hashing-fallback"


def stem(tok: str) -> str:
    """Very light stemmer: doses/dose -> dos, grams -> gram."""
    if tok.endswith("ing") and len(tok) > 5:
        tok = tok[:-3]
    if tok.endswith("s") and not tok.endswith("ss") and len(tok) > 3:
        tok = tok[:-1]
    if tok.endswith("e") and len(tok) > 3:
        tok = tok[:-1]
    return tok


def _hash_embed(texts: list[str]) -> np.ndarray:
    out = np.zeros((len(texts), DIM), dtype=np.float32)
    for i, t in enumerate(texts):
        for tok in re.findall(r"[a-z0-9]+", t.lower()):
            if tok in _STOP:
                continue
            out[i, zlib.crc32(stem(tok).encode()) % DIM] += 1.0
    norms = np.linalg.norm(out, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return out / norms


def embed(texts: list[str]) -> np.ndarray:
    global _model, _use_st
    if _use_st:
        try:
            if _model is None:
                from sentence_transformers import SentenceTransformer
                _model = SentenceTransformer(EMBED_MODEL)
            return np.asarray(_model.encode(texts, normalize_embeddings=True), dtype=np.float32)
        except Exception:
            _use_st = False  # model could not load (e.g. offline) -> fallback
    return _hash_embed(texts)
