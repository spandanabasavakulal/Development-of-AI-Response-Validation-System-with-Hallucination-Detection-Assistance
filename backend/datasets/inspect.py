
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = BASE_DIR / "data" / "raw"

files = [
    "squad_train.jsonl",
    "halueval_qa.jsonl",
    "hotpotqa_train.jsonl"
]

for filename in files:

    file_path = RAW_DIR / filename

    print("\n" + "=" * 60)
    print("DATASET:", filename)
    print("=" * 60)

    with open(file_path, "r", encoding="utf-8") as file:
        first_record = json.loads(file.readline())

    print("\nAvailable columns:")
    print(list(first_record.keys()))

    print("\nSample record:")
    for key, value in first_record.items():
        print(f"\n{key}: {str(value)[:300]}")

    print("\nInspection completed.")
