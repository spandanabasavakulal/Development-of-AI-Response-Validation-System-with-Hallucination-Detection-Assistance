"""Thin LLM client. Returns None when no API key is set or the call fails,
so every agent can fall back to its built-in heuristic."""
import json
import re
import httpx
from ..config import ANTHROPIC_API_KEY, LLM_MODEL


def llm_enabled() -> bool:
    return bool(ANTHROPIC_API_KEY)


def call_json(system: str, user: str, max_tokens: int = 1000) -> dict | None:
    if not llm_enabled():
        return None
    try:
        r = httpx.post(
            "https://api.anthropic.com/v1/messages",
            headers={"x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01",
                     "content-type": "application/json"},
            json={"model": LLM_MODEL, "max_tokens": max_tokens, "system": system,
                  "messages": [{"role": "user", "content": user}]},
            timeout=60)
        r.raise_for_status()
        text = r.json()["content"][0]["text"]
        text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
        return json.loads(text)
    except Exception:
        return None
