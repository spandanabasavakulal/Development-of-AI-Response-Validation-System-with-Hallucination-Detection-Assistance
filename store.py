"""Vector store: chunks + embeddings live in SQLite, search uses FAISS if available."""
import importlib.util
import numpy as np
from ..db import conn
from .chunker import chunk_text
from .embedder import embed

_faiss = importlib.util.find_spec("faiss") is not None


def add_document(name: str, corpus: str, text: str) -> dict:
    chunks = chunk_text(text)
    if not chunks:
        raise ValueError("Document has no readable text")
    embs = embed(chunks).astype(np.float32)
    c = conn()
    cur = c.execute("INSERT INTO documents(name, corpus, n_chunks) VALUES(?,?,?)",
                    (name, corpus, len(chunks)))
    doc_id = cur.lastrowid
    c.executemany("INSERT INTO chunks(doc_id, idx, text, emb) VALUES(?,?,?,?)",
                  [(doc_id, i, t, embs[i].tobytes()) for i, t in enumerate(chunks)])
    c.commit()
    c.close()
    return {"id": doc_id, "name": name, "corpus": corpus, "n_chunks": len(chunks)}


def list_documents() -> list[dict]:
    c = conn()
    rows = c.execute("SELECT id, name, corpus, n_chunks, created_at FROM documents ORDER BY id DESC").fetchall()
    c.close()
    return [dict(r) for r in rows]


def delete_document(doc_id: int) -> bool:
    c = conn()
    cur = c.execute("DELETE FROM documents WHERE id=?", (doc_id,))
    c.commit()
    c.close()
    return cur.rowcount > 0


def get_chunks(doc_id: int) -> list[dict]:
    c = conn()
    rows = c.execute("SELECT id, idx, text FROM chunks WHERE doc_id=? ORDER BY idx", (doc_id,)).fetchall()
    c.close()
    return [dict(r) for r in rows]


def search(query: str, k: int = 3, corpus: str | None = None) -> list[dict]:
    c = conn()
    sql = ("SELECT ch.id, ch.doc_id, ch.idx, ch.text, ch.emb, d.name AS doc_name "
           "FROM chunks ch JOIN documents d ON d.id = ch.doc_id")
    rows = c.execute(sql + (" WHERE d.corpus=?" if corpus else ""), (corpus,) if corpus else ()).fetchall()
    c.close()
    if not rows:
        return []
    mat = np.vstack([np.frombuffer(r["emb"], dtype=np.float32) for r in rows])
    q = embed([query]).astype(np.float32)
    k = min(k, len(rows))
    if _faiss:
        import faiss
        index = faiss.IndexFlatIP(mat.shape[1])
        index.add(mat)
        D, I = index.search(q, k)
        pairs = [(int(i), float(s)) for i, s in zip(I[0], D[0]) if i >= 0]
    else:
        sims = mat @ q[0]
        top = np.argsort(-sims)[:k]
        pairs = [(int(i), float(sims[i])) for i in top]
    return [{"chunk_id": rows[i]["id"], "doc_id": rows[i]["doc_id"], "doc": rows[i]["doc_name"],
             "chunk_index": rows[i]["idx"], "text": rows[i]["text"], "similarity": round(s, 4)}
            for i, s in pairs]
