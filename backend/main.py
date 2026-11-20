
import time
from concurrent.futures import ThreadPoolExecutor

from agents.relevance import evaluate_relevance
from agents.accuracy import evaluate_accuracy
from agents.hallucination import detect_hallucinations
from agents.completeness import evaluate_completeness
from agents.verdict import evaluate_verdict


def run_timed_agent(agent_name, agent_function, **kwargs):
    """Run one evaluation agent and measure its execution time."""

    start_time = time.perf_counter()

    print(f"\n[{agent_name}] Started...")

    result = agent_function(**kwargs)

    elapsed_time = time.perf_counter() - start_time

    print(f"[{agent_name}] Completed in {elapsed_time:.2f} seconds")

    return result, elapsed_time


def evaluate_ai_response(question, ai_response, reference_answer=""):

    overall_start = time.perf_counter()

    print("\n========== NEW EVALUATION ==========")
    print("Starting four agents concurrently...")

    # Run the four independent agents concurrently.
    with ThreadPoolExecutor(max_workers=4) as executor:

        futures = {
            "relevance": executor.submit(
                run_timed_agent,
                "Relevance Judge",
                evaluate_relevance,
                question=question,
                ai_response=ai_response
            ),

            "accuracy": executor.submit(
                run_timed_agent,
                "Accuracy Judge",
                evaluate_accuracy,
                question=question,
                ai_response=ai_response,
                reference_answer=reference_answer
            ),

            "hallucination": executor.submit(
                run_timed_agent,
                "Hallucination Detection",
                detect_hallucinations,
                question=question,
                ai_response=ai_response
            ),

            "completeness": executor.submit(
                run_timed_agent,
                "Completeness Judge",
                evaluate_completeness,
                question=question,
                ai_response=ai_response,
                reference_answer=reference_answer
            )
        }

        # Collect all results.
        # If any agent fails, its exception is propagated.
        relevance_result, relevance_time = futures["relevance"].result()
        accuracy_result, accuracy_time = futures["accuracy"].result()
        hallucination_result, hallucination_time = futures["hallucination"].result()
        completeness_result, completeness_time = futures["completeness"].result()

    print("\nAll four specialist agents completed successfully.")

    # Run the Verdict Agent only after all four agents finish.
    print("\n[5/5] Running Verdict Agent...")

    verdict_start = time.perf_counter()

    final_result = evaluate_verdict(
        relevance_result=relevance_result,
        accuracy_result=accuracy_result,
        hallucination_result=hallucination_result,
        completeness_result=completeness_result
    )

    verdict_time = time.perf_counter() - verdict_start

    print(f"Verdict Agent completed in {verdict_time:.2f} seconds")

    overall_time = time.perf_counter() - overall_start

    # Display performance measurements.
    print("\n========== PERFORMANCE REPORT ==========")
    print(f"Relevance Agent:      {relevance_time:.2f} seconds")
    print(f"Accuracy Agent:       {accuracy_time:.2f} seconds")
    print(f"Hallucination Agent:  {hallucination_time:.2f} seconds")
    print(f"Completeness Agent:   {completeness_time:.2f} seconds")
    print(f"Verdict Agent:        {verdict_time:.2f} seconds")
    print("----------------------------------------")
    print(f"Total Evaluation:     {overall_time:.2f} seconds")
    print("========================================")

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
