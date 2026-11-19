import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# Load environment configuration
BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=API_KEY)


# ==========================================
# RELEVANCE EVALUATION
# ==========================================

def evaluate_relevance(question: str, ai_response: str):
    """
    Evaluates whether an AI-generated response addresses
    the user's question.

    Relevance measures topical alignment and intent,
    NOT factual correctness.
    """

    prompt = f"""
You are an expert AI Relevance Judge Agent.

Your responsibility is to evaluate whether an AI-generated
response addresses the user's question.

IMPORTANT:
Evaluate relevance independently of factual accuracy.

USER QUESTION:
{question}

AI-GENERATED RESPONSE:
{ai_response}

EVALUATION CRITERIA:

1. Identify the main intent of the user's question.

2. Determine whether the response attempts to address
   that intent.

3. Identify content that directly relates to the question.

4. Identify content that is genuinely unrelated or
   unnecessarily off-topic.

5. Evaluate whether the response stays focused on
   the requested subject.

6. Do NOT penalize a response merely because its answer
   contains incorrect facts. The Accuracy Agent evaluates
   factual correctness.

7. Do NOT classify an incorrect answer as irrelevant
   if it still attempts to answer the actual question.

8. Do NOT penalize a response for being brief when
   the question requires only a short answer.

9. Missing details should affect relevance only when
   they cause the response to miss the main intent.

IMPORTANT EXAMPLES:

Example 1:

Question:
What is the capital of France?

Response:
Berlin is the capital of France.

Evaluation:
Highly relevant because it attempts to answer the exact
question, even though the answer is factually incorrect.

Example 2:

Question:
What is the capital of France?

Response:
The human heart has four chambers and pumps blood.

Evaluation:
Irrelevant because it does not address the question.

Example 3:

Question:
What is photosynthesis?

Response:
Photosynthesis is the process by which green plants
use sunlight to prepare food.

Evaluation:
Highly relevant because it directly explains the
requested concept.

SCORING GUIDELINES:

90-100:
Directly addresses the main question and stays on topic.

70-89:
Addresses the main question but contains some tangential
or unnecessary information.

40-69:
Addresses only part of the question or includes
substantial unrelated content.

1-39:
Shows very little connection to the question.

0:
Completely unrelated to the question.

VERDICT RULES:

- RELEVANT: Score from 70 to 100.
- PARTIALLY_RELEVANT: Score from 40 to 69.
- IRRELEVANT: Score from 0 to 39.

Return valid JSON only in this structure:

{{
    "relevance_score": 0,
    "verdict": "IRRELEVANT",
    "explanation": "Explanation of the relevance evaluation",
    "relevant_content": [],
    "irrelevant_content": [],
    "missing_aspects": []
}}

Remember:
Do not evaluate whether the response is factually correct.
Evaluate only whether it addresses the user's question.
"""

    # ==========================================
    # GEMINI REQUEST WITH RETRY
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
            "Gemini returned an empty relevance response."
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
            "Relevance response must be a JSON object."
        )

    # ==========================================
    # VALIDATE REQUIRED FIELDS
    # ==========================================

    required_fields = [
        "relevance_score",
        "verdict",
        "explanation",
        "relevant_content",
        "irrelevant_content",
        "missing_aspects"
    ]

    for field in required_fields:
        if field not in result:
            raise ValueError(
                f"Missing field in relevance response: {field}"
            )

    score = result["relevance_score"]

    if (
        isinstance(score, bool)
        or not isinstance(score, (int, float))
        or not math.isfinite(score)
        or not 0 <= score <= 100
    ):
        raise ValueError(
            f"Invalid relevance score: {score}"
        )

    # ==========================================
    # DETERMINE VERDICT FROM SCORE
    # ==========================================

    if score >= 70:
        result["verdict"] = "RELEVANT"

    elif score >= 40:
        result["verdict"] = "PARTIALLY_RELEVANT"

    else:
        result["verdict"] = "IRRELEVANT"

    # ==========================================
    # VALIDATE RESPONSE CONTENT
    # ==========================================

    for field in [
        "relevant_content",
        "irrelevant_content",
        "missing_aspects"
    ]:
        if not isinstance(result[field], list):
            raise ValueError(
                f"{field} must be a list."
            )

    if not isinstance(result["explanation"], str):
        raise ValueError(
            "Relevance explanation must be a string."
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

    result = evaluate_relevance(
        question=question,
        ai_response=ai_response
    )

    print("\n===== RELEVANCE JUDGE RESULT =====")

    print(
        json.dumps(
            result,
            indent=4,
            ensure_ascii=False
        )
    )
