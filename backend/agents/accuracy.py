
import os
import json
from pathlib import Path
from rag.vector_store import FAISSVectorStore
from dotenv import dotenv_values
from google import genai
from utils.gemini_retry import generate_content_with_retry

# Load backend environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
config = dotenv_values(BASE_DIR / ".env")

API_KEY = config.get("GEMINI_API_KEY")
MODEL =  "gemini-3.5-flash-lite"

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing from backend/.env")

client = genai.Client(api_key=API_KEY)
# Initialize FAISS vector store
vector_store = FAISSVectorStore()
vector_store.load_index()

def retrieve_evidence(question, top_k=5):

    results = vector_store.search(
        query=question,
        top_k=top_k
    )

    evidence_parts = []

    for result in results:

        document = result["document"]

        evidence_parts.append(
            f"Source: {document.get('source', 'Unknown')}\n"
            f"Similarity: {result['score']:.4f}\n"
            f"Evidence: {document['text']}"
        )

    return "\n\n".join(evidence_parts)

def evaluate_accuracy(
    question: str,
    ai_response: str,
    reference_answer: str = "",
    evidence: str = None
):
    """
    Evaluate the factual accuracy of an AI-generated response.

    Returns:
        A dictionary containing the accuracy score,
        verdict, explanation, and supporting evidence.
    """

    prompt = f"""
You are an expert AI Accuracy Judge Agent.

Your task is to evaluate the factual accuracy of an
AI-generated response.

USER QUESTION:
{question}

AI-GENERATED RESPONSE:
{ai_response}

REFERENCE ANSWER:
{reference_answer if reference_answer else "Not provided"}

RETRIEVED EVIDENCE:
{evidence if evidence else "Not provided"}

EVALUATION RULES:

1. Compare factual claims against the available reference
   answer and retrieved evidence.
2. Do not assume that unsupported claims are true.
3. Identify incorrect or contradictory claims.
4. If evidence is insufficient, do not invent facts.
5. Distinguish factual errors from missing information.
6. Give a score between 0 and 100 only when sufficient
   evidence is available.
7. If evidence is insufficient, use null for the score
   and verdict INSUFFICIENT_EVIDENCE.

Return ONLY valid JSON in this format:

{{
    "accuracy_score": 0,
    "verdict": "ACCURATE",
    "explanation": "Brief evaluation explanation",
    "supported_claims": [],
    "unsupported_claims": [],
    "incorrect_claims": [],
    "evidence_used": []
}}

Allowed verdicts:
- ACCURATE
- PARTIALLY_ACCURATE
- INACCURATE
- INSUFFICIENT_EVIDENCE
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
        raise ValueError(
            "Gemini returned an invalid JSON response."
        )

    return result


if __name__ == "__main__":

    question = "What is photosynthesis?"

    ai_response = (
        "Photosynthesis is the process by which green plants "
        "use sunlight, water and carbon dioxide to produce "
        "glucose and oxygen."
    )

    reference_answer = (
        "Photosynthesis converts light energy into chemical "
        "energy. Plants use carbon dioxide and water to "
        "produce glucose and release oxygen."
    )

    result = evaluate_accuracy(
        question=question,
        ai_response=ai_response,
        reference_answer=reference_answer
    )

    print("\n===== ACCURACY JUDGE RESULT =====")
    print(json.dumps(result, indent=4))
