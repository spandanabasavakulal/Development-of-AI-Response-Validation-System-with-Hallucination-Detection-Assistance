
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


def read_jsonl(filename):
    records = []

    with open(RAW_DIR / filename, "r", encoding="utf-8") as file:
        for line in file:
            if line.strip():
                records.append(json.loads(line))

    return records


def save_jsonl(records, filename):
    output_path = PROCESSED_DIR / filename

    with open(output_path, "w", encoding="utf-8") as file:
        for record in records:
            file.write(json.dumps(record, ensure_ascii=False) + "\n")

    print(f"Saved {len(records)} records to {output_path}")


def process_squad():
    records = read_jsonl("squad_train.jsonl")
    processed = []

    for row in records:
        answers = row.get("answers", {})
        answer_texts = answers.get("text", [])

        processed.append({
            "dataset": "SQuAD",
            "question": row.get("question", ""),
            "reference_answer": answer_texts[0] if answer_texts else "",
            "context": row.get("context", ""),
            "expected_accuracy": bool(answer_texts)
        })

    save_jsonl(processed, "squad_processed.jsonl")


def process_halueval():
    records = read_jsonl("halueval_qa.jsonl")
    processed = []

    for row in records:
        processed.append({
            "dataset": "HaluEval",
            "question": row.get("question", ""),
            "reference_answer": row.get("right_answer", ""),
            "ai_response": row.get("hallucinated_answer", ""),
            "expected_hallucination": True,
            "context": row.get("knowledge", "")
        })

    save_jsonl(processed, "halueval_processed.jsonl")


def process_hotpotqa():
    records = read_jsonl("hotpotqa_train.jsonl")
    processed = []

    for row in records:
        processed.append({
            "dataset": "HotpotQA",
            "question": row.get("question", ""),
            "reference_answer": row.get("answer", ""),
            "context": row.get("context", {}),
            "supporting_facts": row.get("supporting_facts", {}),
            "question_type": row.get("type", ""),
            "difficulty": row.get("level", "")
        })

    save_jsonl(processed, "hotpotqa_processed.jsonl")


if __name__ == "__main__":
    process_squad()
    process_halueval()
    process_hotpotqa()

    print("\nAll preprocessing tasks completed!")
