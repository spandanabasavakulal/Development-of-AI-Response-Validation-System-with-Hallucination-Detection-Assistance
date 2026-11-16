from ..config import WEIGHTS, PASS_THRESHOLD, REVIEW_THRESHOLD
from .judges import detect_domain


def aggregate(prompt: str, response: str, scores: dict[str, float], claims: list[dict]) -> dict:
    composite = sum(WEIGHTS[k] * (scores[k] / 5.0) for k in WEIGHTS) * 100
    domain = detect_domain(prompt + " " + response)
    contradicted = [c for c in claims if c["label"] == "contradicted"]
    veto = bool(domain and contradicted)
    if veto or composite < REVIEW_THRESHOLD:
        verdict = "Fail"
    elif composite < PASS_THRESHOLD or contradicted:
        verdict = "Review"
    else:
        verdict = "Pass"
    warnings = []
    if any(c["label"] == "unsupported" for c in claims):
        warnings.append("Some claims are unsupported: the reference corpus is silent about them. "
                        "Missing evidence does not mean the claim is false.")
    if veto:
        warnings.append(f"Safety veto: contradicted {domain} claim(s) force a Fail verdict.")
    return {"composite": round(composite, 1), "verdict": verdict, "safety_veto": veto,
            "domain": domain, "warnings": warnings}
