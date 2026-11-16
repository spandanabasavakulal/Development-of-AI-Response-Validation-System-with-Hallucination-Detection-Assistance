import csv
import io
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from ..agents.pipeline import run_pipeline
from .evaluations import save_evaluation

router = APIRouter(prefix="/api/batch", tags=["batch"])
MAX_ROWS = 200


@router.post("/evaluate")
async def batch_evaluate(file: UploadFile = File(...), corpus: str = Form("demo")):
    """CSV with columns: prompt,response  (optional: corpus)."""
    text = (await file.read()).decode("utf-8-sig", errors="ignore")
    reader = csv.DictReader(io.StringIO(text))
    cols = {c.strip().lower() for c in (reader.fieldnames or [])}
    if not {"prompt", "response"} <= cols:
        raise HTTPException(400, "CSV must have 'prompt' and 'response' columns")
    results, errors = [], []
    for i, row in enumerate(reader, start=1):
        if i > MAX_ROWS:
            errors.append({"row": i, "error": f"Row limit of {MAX_ROWS} reached"})
            break
        row = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}
        if not row.get("prompt") or not row.get("response"):
            errors.append({"row": i, "error": "Empty prompt or response"})
            continue
        try:
            res = run_pipeline(row["prompt"], row["response"], row.get("corpus") or corpus)
            save_evaluation(res)
            results.append({"row": i, "id": res["id"], "verdict": res["verdict"], "composite": res["composite"],
                            "scores": res["scores"], "safety_veto": res["safety_veto"]})
        except Exception as e:
            errors.append({"row": i, "error": str(e)})
    n = len(results)
    return {"processed": n, "failed": len(errors),
            "average_score": round(sum(r["composite"] for r in results) / n, 1) if n else 0,
            "results": results, "errors": errors}
