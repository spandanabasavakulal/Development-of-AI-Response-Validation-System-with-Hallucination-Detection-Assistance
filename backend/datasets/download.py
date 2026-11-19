
from datasets import load_dataset
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
RAW_DATA_DIR = BASE_DIR / "data" / "raw"

RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)


def download_dataset(name, dataset_id, config, split, sample_size):

    print(f"\nDownloading {name}...")

    try:
        dataset = load_dataset(
            dataset_id,
            config,
            split=f"{split}[:{sample_size}]"
        )

        output_path = RAW_DATA_DIR / f"{name}.jsonl"

        dataset.to_json(str(output_path), orient="records")

        print(f"SUCCESS: {len(dataset)} records")
        print(f"Saved: {output_path}")

    except Exception as e:
        print(f"FAILED: {name}")
        print(f"Error: {e}")


if __name__ == "__main__":

    # SQuAD 2.0
    download_dataset(
        "squad_train",
        "rajpurkar/squad_v2",
        None,
        "train",
        1000
    )

    # HaluEval - Question Answering
    download_dataset(
        "halueval_qa",
        "pminervini/HaluEval",
        "qa",
        "data",
        1000
    )

    # HotpotQA - Distractor setting
    download_dataset(
        "hotpotqa_train",
        "hotpotqa/hotpot_qa",
        "distractor",
        "train",
        1000
    )
