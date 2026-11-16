import json
from collections import Counter
from fastapi import APIRouter, HTTPException, Query
from ..agents.pipeline import run_pipeline
from ..db import conn
from ..schemas import EvaluateRequest

router = APIRouter(prefix="/api", tags=["evaluations"])


def save_evaluation(res: dict) -> None:
    c = conn()
    c.execute("INSERT INTO evaluations(id, created_at, prompt, response, corpus, verdict, composite, data) "
              "VALUES(?,?,?,?,?,?,?,?)",
              (res["id"], res["created_at"], res["prompt"], res["response"], res["corpus"],
               res["verdict"], res["composite"], json.dumps(res)))
    c.commit()
    c.close()


@router.post("/evaluate")
def evaluate(req: EvaluateRequest):
    res = run_pipeline(req.prompt, req.response, req.corpus, req.strictness, req.top_k)
    save_evaluation(res)
    return res


@router.get("/evaluations")
def list_evaluations(q: str = "", verdict: str = "", limit: int = Query(20, le=200), offset: int = 0):
    where, args = [], []
    if q:
        where.append("(prompt LIKE ? OR response LIKE ? OR id LIKE ?)")
        args += [f"%{q}%"] * 3
    if verdict:
        where.append("verdict = ?")
        args.append(verdict)
    w = (" WHERE " + " AND ".join(where)) if where else ""
    c = conn()
    total = c.execute(f"SELECT COUNT(*) FROM evaluations{w}", args).fetchone()[0]
    rows = c.execute(f"SELECT id, created_at, prompt, corpus, verdict, composite FROM evaluations{w} "
                     "ORDER BY created_at DESC LIMIT ? OFFSET ?", args + [limit, offset]).fetchall()
    c.close()
    return {"total": total, "items": [dict(r) for r in rows]}


@router.get("/evaluations/{eval_id}")
def get_evaluation(eval_id: str):
    c = conn()
    row = c.execute("SELECT data FROM evaluations WHERE id=?", (eval_id,)).fetchone()
    c.close()
    if not row:
        raise HTTPException(404, "Evaluation not found")
    return json.loads(row["data"])


@router.delete("/evaluations/{eval_id}")
def delete_evaluation(eval_id: str):
    c = conn()
    cur = c.execute("DELETE FROM evaluations WHERE id=?", (eval_id,))
    c.commit()
    c.close()
    if not cur.rowcount:
        raise HTTPException(404, "Evaluation not found")
    return {"deleted": eval_id}


@router.get("/stats")
def stats():
    c = conn()
    rows = c.execute("SELECT created_at, verdict, composite, data FROM evaluations").fetchall()
    c.close()
    n = len(rows)
    verdicts = Counter(r["verdict"] for r in rows)
    daily = Counter(r["created_at"][:10] for r in rows)
    halluc = sum(1 for r in rows if any(cl["label"] == "contradicted" for cl in json.loads(r["data"])["claims"]))
    return {
        "total": n,
        "average_score": round(sum(r["composite"] for r in rows) / n, 1) if n else 0,
        "pass_rate": round(100 * verdicts["Pass"] / n, 1) if n else 0,
        "hallucination_rate": round(100 * halluc / n, 1) if n else 0,
        "verdicts": dict(verdicts),
        "daily_volume": [{"date": d, "count": v} for d, v in sorted(daily.items())],
    }
