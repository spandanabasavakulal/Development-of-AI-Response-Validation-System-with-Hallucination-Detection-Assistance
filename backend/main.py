
import json

from agents.relevance import evaluate_relevance
from agents.accuracy import evaluate_accuracy
from agents.hallucination import detect_hallucinations
from agents.completeness import evaluate_completeness
from agents.verdict import evaluate_verdict


def evaluate_ai_response(
    question: str,
    ai_response: str,
    reference_answer: str = ""
):
    """
    Runs all five agents and returns a combined evaluation.
    """

    print("\n[1/5] Running Relevance Judge...")
    relevance_result = evaluate_relevance(
        question=question,
        ai_response=ai_response
    )

    print("\n[2/5] Running Accuracy Judge...")
    accuracy_result = evaluate_accuracy(
        question=question,
        ai_response=ai_response,
        reference_answer=reference_answer
    )

    print("\n[3/5] Running Hallucination Detection Agent...")
    hallucination_result = detect_hallucinations(
        question=question,
        ai_response=ai_response
    )

    print("\n[4/5] Running Completeness Judge...")
    completeness_result = evaluate_completeness(
        question=question,
        ai_response=ai_response,
        reference_answer=reference_answer
    )

    print("\n[5/5] Running Verdict Agent...")
    final_result = evaluate_verdict(
        relevance_result=relevance_result,
        accuracy_result=accuracy_result,
        hallucination_result=hallucination_result,
        completeness_result=completeness_result
    )

    return {
        "question": question,
        "ai_response": ai_response,
        "evaluation": {
            "relevance": relevance_result,
            "accuracy": accuracy_result,
            "hallucination": hallucination_result,
            "completeness": completeness_result
        },
        "final_verdict": final_result
    }


if __name__ == "__main__":

    question = "What is the capital of France?"

    ai_response = (
        "The capital of France is Paris. "
    )

    reference_answer = (
        "The capital of France is Paris. "
    )

    result = evaluate_ai_response(
        question=question,
        ai_response=ai_response,
        reference_answer=reference_answer
    )

    print("\n========== COMPLETE EVALUATION REPORT ==========")
    print(json.dumps(result, indent=4, ensure_ascii=False))