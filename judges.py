"""Judge agents. Each one tries the LLM first, then falls back to a heuristic."""
import re
import numpy as np
from ..rag.embedder import embed
from ..rag.store import search
from .llm import call_json
from .text_utils import overlap, numbers, content_words

JUDGE_SYS = ("You are a strict evaluator of AI answers. Reply with ONLY a JSON object, no prose.")

MEDICAL = ["dose", "mg", "gram", "medicine", "drug", "tablet", "symptom", "disease", "diabetes",
           "treatment", "patient", "doctor", "paracetamol", "overdose", "infection"]
FINANCIAL = ["invest", "loan", "interest", "tax", "stock", "mutual fund", "sip", "return",
             "insurance", "credit", "emi", "portfolio"]


def detect_domain(text: str) -> str | None:
    t = text.lower()
    if any(w in t for w in MEDICAL):
        return "medical"
    if any(w in t for w in FINANCIAL):
        return "financial"
    return None


# ---------- Relevance ----------
def relevance_judge(prompt: str, response: str) -> dict:
    data = call_json(JUDGE_SYS, f'Rate 0-5 how well the RESPONSE addresses the PROMPT. '
                     f'JSON: {{"score": number, "reason": string}}\nPROMPT: {prompt}\nRESPONSE: {response}')
    if data and "score" in data:
        return {"score": float(min(5, max(0, data["score"]))), "reason": data.get("reason", ""), "mode": "llm"}
    e = embed([prompt, response])
    sim = float(e[0] @ e[1])
    ov = overlap(prompt, response)
    score = 5 * min(1.0, 0.6 * ov + 0.4 * min(1.0, sim / 0.5))
    return {"score": round(score, 1), "reason": f"Prompt keyword coverage {ov:.0%}, semantic similarity {sim:.2f}.",
            "mode": "heuristic"}


# ---------- Claims ----------
def extract_claims(response: str) -> list[str]:
    data = call_json(JUDGE_SYS, 'Split the RESPONSE into atomic factual claims. '
                     f'JSON: {{"claims": [string]}}\nRESPONSE: {response}')
    if data and isinstance(data.get("claims"), list) and data["claims"]:
        return [str(c) for c in data["claims"]][:15]
    sents = re.split(r"(?<=[.!?])\s+", response.strip())
    claims = [s.strip() for s in sents if len(s.split()) >= 3][:15]
    return claims or ([response.strip()] if response.strip() else [])


def _best_sentence(claim: str, text: str) -> str:
    sents = [x for x in re.split(r"(?<=[.!?])\s+", text) if x.strip()] or [text]
    return max(sents, key=lambda x: overlap(claim, x))


def _is_negated(s: str) -> bool:
    return bool(re.search(r"\b(not|never|no|cannot|without)\b", s.lower()))


def _heuristic_label(claim: str, evidence: list[dict], strictness: float) -> str:
    """Offline fallback used when no LLM key is set. Compares the claim with the
    best-matching sentence of the top evidence chunk."""
    if not evidence:
        return "inconclusive"
    top = evidence[0]
    sent = _best_sentence(claim, top["text"])
    strength = max(top["similarity"], overlap(claim, sent))
    nc, ne = numbers(claim), numbers(sent)
    shared = (content_words(claim) & content_words(sent)) - nc - ne
    # Different number about the same thing = contradiction
    if strength >= 0.15 and shared and nc and ne and not (nc & ne):
        return "contradicted"
    # Claim affirms what the evidence sentence negates (or vice versa)
    if strength >= 0.4 and _is_negated(claim) != _is_negated(sent):
        return "contradicted"
    threshold = 0.45 + 0.2 * (strictness - 0.5)
    return "supported" if strength >= threshold else "unsupported"


def verify_claims(claims: list[str], corpus: str | None, top_k: int, strictness: float) -> list[dict]:
    results = []
    for i, c in enumerate(claims):
        ev = search(c, k=top_k, corpus=corpus)
        results.append({"id": f"c{i + 1}", "text": c, "evidence": ev,
                        "label": _heuristic_label(c, ev, strictness), "mode": "heuristic"})
    # Optional LLM verification of all claims in one call
    payload = [{"id": r["id"], "claim": r["text"], "evidence": [e["text"] for e in r["evidence"]]} for r in results]
    data = call_json(JUDGE_SYS, 'For each claim decide: "supported", "unsupported" (evidence silent) or '
                     '"contradicted" (evidence conflicts). Missing evidence is NOT contradiction. '
                     f'JSON: {{"labels": [{{"id": string, "label": string}}]}}\n{payload}')
    if data and isinstance(data.get("labels"), list):
        by_id = {x.get("id"): x.get("label") for x in data["labels"]}
        for r in results:
            if by_id.get(r["id"]) in ("supported", "unsupported", "contradicted"):
                r["label"], r["mode"] = by_id[r["id"]], "llm"
    for r in results:
        r["similarity"] = r["evidence"][0]["similarity"] if r["evidence"] else 0.0
    return results


# ---------- Accuracy & Hallucination (derived from claim labels) ----------
def accuracy_judge(claims: list[dict]) -> dict:
    if not claims:
        return {"score": 0.0, "reason": "No claims found.", "mode": "heuristic"}
    pts = {"supported": 1.0, "inconclusive": 0.5, "unsupported": 0.4, "contradicted": 0.0}
    score = 5 * sum(pts[c["label"]] for c in claims) / len(claims)
    n_ok = sum(c["label"] == "supported" for c in claims)
    return {"score": round(score, 1), "reason": f"{n_ok}/{len(claims)} claims supported by evidence.", "mode": "heuristic"}


def hallucination_judge(claims: list[dict]) -> dict:
    """5 = no hallucination, 0 = severe."""
    if not claims:
        return {"score": 0.0, "reason": "No claims found.", "mode": "heuristic"}
    pen = sum(1.0 if c["label"] == "contradicted" else 0.4 if c["label"] == "unsupported" else 0
              for c in claims) / len(claims)
    nc = sum(c["label"] == "contradicted" for c in claims)
    nu = sum(c["label"] == "unsupported" for c in claims)
    return {"score": round(max(0.0, 5 * (1 - pen)), 1),
            "reason": f"{nc} contradicted, {nu} unsupported claim(s).", "mode": "heuristic"}


# ---------- Completeness ----------
def completeness_judge(prompt: str, response: str, retrieved: list[dict]) -> dict:
    ctx = "\n".join(r["text"] for r in retrieved[:3])
    data = call_json(JUDGE_SYS, 'Rate 0-5 how completely the RESPONSE covers what the PROMPT needs, using the '
                     'REFERENCE. JSON: {"score": number, "reason": string, "missing": [string]}\n'
                     f'PROMPT: {prompt}\nRESPONSE: {response}\nREFERENCE: {ctx}')
    if data and "score" in data:
        return {"score": float(min(5, max(0, data["score"]))), "reason": data.get("reason", ""),
                "missing": data.get("missing", []), "mode": "llm"}
    cover = overlap(prompt, response)
    ref_cover = overlap(retrieved[0]["text"], response) if retrieved else 0.5
    length = min(1.0, len(response.split()) / 25)
    score = 5 * (0.35 * cover + 0.35 * min(1.0, ref_cover * 2) + 0.3 * length)
    return {"score": round(score, 1), "missing": [],
            "reason": f"Prompt coverage {cover:.0%}, reference coverage {ref_cover:.0%}.", "mode": "heuristic"}
