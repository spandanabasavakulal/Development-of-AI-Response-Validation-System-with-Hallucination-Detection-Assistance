import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from rag.vector_store import FAISSVectorStore
from utils.gemini_retry import generate_content_with_retry

# Load environment configuration
BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=API_KEY)


# Initialize FAISS
vector_store = FAISSVectorStore()
vector_store.load_index()


def retrieve_evidence(question, top_k=5):
    """Retrieve supporting documents from FAISS."""

    results = vector_store.search(
        query=question,
        top_k=top_k
    )

    evidence = []

    for result in results:
        document = result["document"]

        evidence.append({
            "source": document.get("source", "Unknown"),
            "similarity": round(result["score"], 4),
            "text": document["text"]
        })

    return evidence


def detect_hallucinations(
    question: str,
    ai_response: str,
    evidence=None
):
    """
    Detect fabricated, unsupported, or contradicted
    claims in an AI-generated response.
    """

    if evidence is None:
        evidence = retrieve_evidence(question)

    evidence_text = json.dumps(
        evidence,
        indent=2,
        ensure_ascii=False
    )

    prompt = f"""
You are an expert AI Hallucination Detection Agent.

Your responsibility is to identify fabricated,
unsupported, and evidence-contradicted claims.

USER QUESTION:
{question}

AI-GENERATED RESPONSE:
{ai_response}

RETRIEVED EVIDENCE:
{evidence_text if evidence else "No evidence retrieved."}

EVALUATION INSTRUCTIONS:

1. Break the AI response into individual factual claims.
2. Compare each claim against the retrieved evidence.
3. Identify claims directly contradicted by evidence.
4. Identify claims that are not supported by evidence.
5. Do not automatically classify every unsupported
   claim as a proven hallucination.
6. Distinguish contradicted claims from claims that
   simply lack sufficient evidence.
7. Treat retrieved documents as evidence, not as
   unquestionable truth.
8. Do not invent facts or supporting sources.
9. If evidence is insufficient, use the verdict
   INSUFFICIENT_EVIDENCE.
10. Give a hallucination risk score from 0 to 100
    only when there is sufficient evidence.

VERDICT DEFINITIONS:

NO_HALLUCINATION:
No hallucinated claims identified in the available evidence.

POSSIBLE_HALLUCINATION:
One or more claims lack sufficient supporting evidence.

HALLUCINATION:
One or more claims are contradicted by reliable evidence.

INSUFFICIENT_EVIDENCE:
There is not enough relevant evidence to evaluate the claims.

Return ONLY valid JSON in this format:

{{
    "hallucination_score": 0,
    "verdict": "NO_HALLUCINATION",
    "explanation": "Brief explanation",
    "hallucinated_claims": [],
    "unsupported_claims": [],
    "contradicted_claims": [],
    "evidence_used": []
}}

The hallucination score represents estimated risk:
0 means no hallucination identified;
100 means severe evidence-based contradiction.
"""

    response = generate_content_with_retry(
        client=client,
        model=MODEL,
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        },
        max_attempts=3
    )

    try:
        result = json.loads(response.text)
    except (json.JSONDecodeError, TypeError):
        raise ValueError("Gemini returned invalid JSON.")

    return result


if __name__ == "__main__":

    question = "What is the capital of France?"

    ai_response = (
        "Paris is the capital of France. "
        "Paris is also the capital of Germany."
    )

    result = detect_hallucinations(
        question=question,
        ai_response=ai_response
    )

    print("\n===== HALLUCINATION DETECTION RESULT =====")
    print(json.dumps(result, indent=4))
