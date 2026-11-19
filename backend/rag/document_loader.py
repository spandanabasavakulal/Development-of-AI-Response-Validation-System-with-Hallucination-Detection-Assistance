
import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
PROCESSED_DIR = BASE_DIR / "data" / "processed"


def load_jsonl(filename):
    """Load records from a JSONL file."""

    file_path = PROCESSED_DIR / filename

    documents = []

    if not file_path.exists():
        print(f"File not found: {file_path}")
        return documents

    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            if line.strip():
                documents.append(json.loads(line))

    return documents


def load_squad_documents():
    """Extract supporting contexts from SQuAD."""

    records = load_jsonl("squad_processed.jsonl")
    documents = []

    for record in records:
        text = record.get("context", "").strip()

        if text:
            documents.append({
                "text": text,
                "source": "SQuAD 2.0",
                "question": record.get("question", "")
            })

    return documents


def load_halueval_documents():
    """Extract knowledge passages from HaluEval."""

    records = load_jsonl("halueval_processed.jsonl")
    documents = []

    for record in records:
        text = record.get("context", "").strip()

        if text:
            documents.append({
                "text": text,
                "source": "HaluEval",
                "question": record.get("question", "")
            })

    return documents


def load_hotpotqa_documents():
    """Extract supporting passages from HotpotQA."""

    records = load_jsonl("hotpotqa_processed.jsonl")
    documents = []

    for record in records:
        context = record.get("context", {})

        titles = context.get("title", [])
        sentences = context.get("sentences", [])

        for title, sentence_list in zip(titles, sentences):

            text = " ".join(sentence_list).strip()

            if text:
                documents.append({
                    "text": text,
                    "source": "HotpotQA",
                    "title": title,
                    "question": record.get("question", "")
                })

    return documents


def load_all_documents():

    documents = []

    documents.extend(load_squad_documents())
    documents.extend(load_halueval_documents())
    documents.extend(load_hotpotqa_documents())

    print("\nRAG Document Loading Summary")
    print("-" * 35)
    print(f"Total documents loaded: {len(documents)}")

    return documents


if __name__ == "__main__":

    documents = load_all_documents()

    if documents:
        print("\nSample document:")
        print(documents[0])
    else:
        print("No documents available.")
