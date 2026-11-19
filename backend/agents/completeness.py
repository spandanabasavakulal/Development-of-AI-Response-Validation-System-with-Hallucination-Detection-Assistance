
import json
import math
from pathlib import Path

from dotenv import dotenv_values
from google import genai

from utils.gemini_retry import generate_content_with_retry


# ==========================================
# LOAD ENVIRONMENT CONFIGURATION
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent
config = dotenv_values(BASE_DIR / ".env")

API_KEY = config.get("GEMINI_API_KEY")
MODEL = "gemini-3.5-flash-lite"

if not API_KEY:
    raise ValueError("GEMINI_API_KEY missing from backend/.env")

client = genai.Client(api_key=API_KEY)


# ==========================================
# COMPLETENESS EVALUATION
# ==========================================

def evaluate_completeness(
    question: str,
    ai_response: str,
    reference_answer: str = ""
):
    """
    Evaluates whether an AI response supplies all the
    essential information required by the question.

    Completeness measures coverage, not general factual accuracy.
    However, an incorrect answer to a required question component
    must not be counted as successfully covered.
    """

    reference_section = (
        f"""
REFERENCE ANSWER:
{reference_answer}

Use this reference to identify the essential information
expected in the response.
"""
        if reference_answer
        else """
No reference answer is provided.

Identify the essential information needed to answer
the user's question independently.
"""
    )

    prompt = f"""
You are an expert AI Completeness Judge Agent.

Your task is to evaluate whether the AI-generated response
actually supplies all essential information requested
by the user's question.

USER QUESTION:
{question}

AI-GENERATED RESPONSE:
{ai_response}

{reference_section}

IMPORTANT EVALUATION RULES:

1. Identify the essential information required to answer
   the user's question.

2. Check whether each essential aspect is actually supplied
   by the AI-generated response.

3. An aspect is NOT covered merely because the response
   mentions a related word or attempts to answer it.

4. If the question requires a specific answer, an incorrect
   entity or value does not fulfil that required aspect.

   Example:
   Question: What is the capital of France?
   Response: Berlin is the capital of France.

   The required information (Paris) has not been supplied.
   Therefore, the response must not receive full completeness.

5. Do not independently perform a detailed fact-check.
   The Accuracy Agent handles factual verification.

6. Evaluate completeness based on whether the required
   information is adequately supplied, using the reference
   answer when available.

7. Do not penalize the response for omitting irrelevant
   details or unnecessary explanations.

8. If no reference answer is provided, identify the essential
   aspects from the question itself.

9. Missing essential information must reduce the score.

10. Do not award 100 merely because the response is relevant
    or attempts to answer the question.

SCORING GUIDELINES:

90-100: All or nearly all essential information is supplied.
70-89: Most essential information is supplied.
40-69: Only some essential information is supplied.
1-39: Very little essential information is supplied.
0: No meaningful required information is supplied.

Return valid JSON only in this structure:

{{
    "completeness_score": 0,
    "verdict": "INCOMPLETE",
    "explanation": "Explanation of the evaluation",
    "covered_aspects": [],
    "missing_aspects": [],
    "improvement_suggestions": []
}}

Allowed verdicts:
COMPLETE, MOSTLY_COMPLETE, PARTIALLY_COMPLETE, INCOMPLETE.

Ensure the verdict is consistent with the numerical score.
"""

    # ==========================================
    # CALL GEMINI WITH RETRY HANDLING
    # ==========================================

    response = generate_content_with_retry(
        client=client,
        model=MODEL,
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        },
        max_attempts=3
    )

    if not response.text:
        raise ValueError(
            "Gemini returned an empty completeness response."
        )

    # ==========================================
    # PARSE JSON RESPONSE
    # ==========================================

    try:
        result = json.loads(response.text)

    except (json.JSONDecodeError, TypeError) as error:
        raise ValueError(
            f"Gemini returned invalid JSON: {response.text}"
        ) from error

    if not isinstance(result, dict):
        raise ValueError(
            "Completeness response must be a JSON object."
        )

    # ==========================================
    # VALIDATE REQUIRED FIELDS
    # ==========================================

    required_fields = [
        "completeness_score",
        "verdict",
        "explanation",
        "covered_aspects",
        "missing_aspects",
        "improvement_suggestions"
    ]

    for field in required_fields:
        if field not in result:
            raise ValueError(
                f"Missing field in completeness response: {field}"
            )

    score = result["completeness_score"]

    if (
        isinstance(score, bool)
        or not isinstance(score, (int, float))
        or not math.isfinite(score)
        or not 0 <= score <= 100
    ):
        raise ValueError(
            f"Invalid completeness score: {score}"
        )

    allowed_verdicts = {
        "COMPLETE",
        "MOSTLY_COMPLETE",
        "PARTIALLY_COMPLETE",
        "INCOMPLETE"
    }

    if result["verdict"] not in allowed_verdicts:
        raise ValueError(
            f"Invalid completeness verdict: {result['verdict']}"
        )

    for field in [
        "covered_aspects",
        "missing_aspects",
        "improvement_suggestions"
    ]:
        if not isinstance(result[field], list):
            raise ValueError(
                f"{field} must be a list."
            )

    if not isinstance(result["explanation"], str):
        raise ValueError(
            "Completeness explanation must be a string."
        )

    return result


# ==========================================
# INDIVIDUAL AGENT TEST
# ==========================================

if __name__ == "__main__":

    question = "What is the capital of France?"

    ai_response = (
        "The capital of France is Berlin. "
        "Berlin is also the capital of Germany."
    )

    reference_answer = (
        "The capital of France is Paris."
    )

    result = evaluate_completeness(
        question=question,
        ai_response=ai_response,
        reference_answer=reference_answer
    )

    print("\n===== COMPLETENESS EVALUATION RESULT =====")

    print(
        json.dumps(
            result,
            indent=4,
            ensure_ascii=False
        )
    )
