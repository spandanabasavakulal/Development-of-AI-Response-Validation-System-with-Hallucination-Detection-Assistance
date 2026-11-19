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
# VERDICT AGENT
# ==========================================

def evaluate_verdict(
    relevance_result,
    accuracy_result,
    hallucination_result,
    completeness_result
):
    """
    Combines four specialized agent results and generates
    an overall AI response quality verdict.

    Hallucination score:
        Higher value = Higher hallucination risk.

    Hallucination quality:
        Higher value = Better response quality.
    """

    # ==========================================
    # 1. EXTRACT INDIVIDUAL AGENT SCORES
    # ==========================================

    relevance = relevance_result.get("relevance_score")
    accuracy = accuracy_result.get("accuracy_score")
    hallucination_risk = hallucination_result.get("hallucination_score")
    completeness = completeness_result.get("completeness_score")

    # ==========================================
    # 2. VALIDATE SCORES
    # ==========================================

    scores = {
        "relevance": relevance,
        "accuracy": accuracy,
        "hallucination": hallucination_risk,
        "completeness": completeness
    }

    for name, score in scores.items():

        if score is not None:

            if (
                isinstance(score, bool)
                or not isinstance(score, (int, float))
                or not math.isfinite(score)
                or not 0 <= score <= 100
            ):
                raise ValueError(
                    f"Invalid {name} score: {score}. "
                    "Expected a finite number between 0 and 100."
                )

    # ==========================================
    # 3. CONVERT HALLUCINATION RISK TO QUALITY
    # ==========================================

    hallucination_quality = (
        100 - hallucination_risk
        if hallucination_risk is not None
        else None
    )

    # ==========================================
    # 4. PREPARE DIMENSION SCORES
    # ==========================================

    dimension_scores = {
        "relevance": relevance,
        "accuracy": accuracy,
        "hallucination_quality": hallucination_quality,
        "completeness": completeness
    }

    # ==========================================
    # 5. CALCULATE OVERALL SCORE
    # ==========================================

    valid_scores = [
        score
        for score in dimension_scores.values()
        if score is not None
    ]

    if not valid_scores:
        raise ValueError(
            "No valid evaluation scores available."
        )

    overall_score = round(
        sum(valid_scores) / len(valid_scores),
        2
    )

    # ==========================================
    # 6. DETERMINE FINAL VERDICT
    # ==========================================

    # High hallucination risk requires human review.
    # The threshold of 40 is a configurable policy choice.

    if (
        hallucination_risk is not None
        and hallucination_risk >= 40
    ):
        final_verdict = "NEEDS_REVIEW"

    elif overall_score >= 85:
        final_verdict = "EXCELLENT"

    elif overall_score >= 70:
        final_verdict = "GOOD"

    elif overall_score >= 50:
        final_verdict = "MODERATE"

    else:
        final_verdict = "POOR"

    # ==========================================
    # 7. COMBINE AGENT RESULTS
    # ==========================================

    evaluation_data = {
        "overall_score": overall_score,
        "final_verdict": final_verdict,
        "dimension_scores": dimension_scores,

        "agent_results": {
            "relevance": relevance_result,
            "accuracy": accuracy_result,
            "hallucination": hallucination_result,
            "completeness": completeness_result
        }
    }

    # ==========================================
    # 8. GENERATE FINAL ANALYSIS USING GEMINI
    # ==========================================

    prompt = f"""
You are the final Verdict Agent in an AI Response Quality
Evaluation System.

Four specialized agents have already evaluated an AI response.

Your task is to combine their findings and provide:

1. Key strengths of the AI response.
2. Major weaknesses.
3. Practical improvement recommendations.
4. A concise overall evaluation summary.

IMPORTANT RULES:

- Do not perform the four evaluations again.
- Do not modify the supplied overall score.
- Do not modify the supplied final verdict.
- Do not invent findings or evidence.
- Use only the supplied evaluation results.
- Clearly mention important factual errors or hallucination risks.

EVALUATION RESULTS:

{json.dumps(evaluation_data, indent=2, ensure_ascii=False)}

Return valid JSON only in this format:

{{
    "strengths": [],
    "weaknesses": [],
    "recommendations": [],
    "summary": "Overall evaluation summary"
}}
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

    # ==========================================
    # 9. VALIDATE GEMINI RESPONSE
    # ==========================================

    if not response.text:
        raise ValueError(
            "Gemini returned an empty verdict response."
        )

    try:
        final_analysis = json.loads(response.text)

    except (json.JSONDecodeError, TypeError) as error:
        raise ValueError(
            f"Gemini returned invalid JSON: {response.text}"
        ) from error

    if not isinstance(final_analysis, dict):
        raise ValueError(
            "Gemini verdict response must be a JSON object."
        )

    # ==========================================
    # 10. PREPARE FINAL RESULT
    # ==========================================

    result = {
        "overall_score": overall_score,
        "final_verdict": final_verdict,
        "dimension_scores": dimension_scores,

        "strengths": final_analysis.get(
            "strengths", []
        ),

        "weaknesses": final_analysis.get(
            "weaknesses", []
        ),

        "recommendations": final_analysis.get(
            "recommendations", []
        ),

        "summary": final_analysis.get(
            "summary", ""
        )
    }

    return result


# ==========================================
# INDIVIDUAL VERDICT AGENT TEST
# ==========================================

if __name__ == "__main__":

    relevance_result = {
        "relevance_score": 100,
        "verdict": "RELEVANT"
    }

    accuracy_result = {
        "accuracy_score": 100,
        "verdict": "ACCURATE"
    }

    hallucination_result = {
        "hallucination_score": 50,
        "verdict": "POSSIBLE_HALLUCINATION"
    }

    completeness_result = {
        "completeness_score": 45,
        "verdict": "PARTIALLY_COMPLETE"
    }

    result = evaluate_verdict(
        relevance_result=relevance_result,
        accuracy_result=accuracy_result,
        hallucination_result=hallucination_result,
        completeness_result=completeness_result
    )

    print("\n===== FINAL VERDICT AGENT RESULT =====")

    print(
        json.dumps(
            result,
            indent=4,
            ensure_ascii=False
        )
    )
