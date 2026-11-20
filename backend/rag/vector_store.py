
import faiss
import json
import numpy as np
from pathlib import Path
from functools import lru_cache

try:
    from .document_loader import load_all_documents
    from .embeddings import EmbeddingModel
except ImportError:
    from .document_loader import load_all_documents
    from .embeddings import EmbeddingModel


BASE_DIR = Path(__file__).resolve().parents[1]
VECTOR_DIR = BASE_DIR / "data" / "vector_store"

VECTOR_DIR.mkdir(parents=True, exist_ok=True)

INDEX_PATH = VECTOR_DIR / "evidence.index"
METADATA_PATH = VECTOR_DIR / "metadata.json"

@lru_cache(maxsize=1)
def get_vector_store():
    """Return one shared FAISS vector store instance."""

    print("Initializing shared FAISS vector store...")

    store = FAISSVectorStore()
    store.load_index()

    return store

class FAISSVectorStore:

    def __init__(self):

        self.embedding_model = EmbeddingModel()
        self.index = None
        self.documents = []

    def build_index(self, documents):

        if not documents:
            raise ValueError("No documents available for indexing.")

        self.documents = documents

        texts = [doc["text"] for doc in documents]

        print(f"\nGenerating embeddings for {len(texts)} documents...")

        embeddings = self.embedding_model.generate_embeddings(texts)

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatIP(dimension)

        self.index.add(embeddings)

        print("Saving FAISS index...")

        faiss.write_index(self.index, str(INDEX_PATH))

        with open(METADATA_PATH, "w", encoding="utf-8") as file:
            json.dump(documents, file, ensure_ascii=False)

        print("FAISS index created successfully!")
        print("Total indexed documents:", self.index.ntotal)

    def load_index(self):

        if not INDEX_PATH.exists() or not METADATA_PATH.exists():
            raise FileNotFoundError("FAISS index or metadata not found.")

        self.index = faiss.read_index(str(INDEX_PATH))

        with open(METADATA_PATH, "r", encoding="utf-8") as file:
            self.documents = json.load(file)

        print("FAISS index loaded successfully!")

    def search(self, query, top_k=5):

        if self.index is None:
            raise ValueError("Build or load the index first.")

        query_vector = self.embedding_model.generate_embeddings(
            [query]
        )

        scores, indices = self.index.search(
            query_vector, top_k
        )

        results = []

        for score, idx in zip(scores[0], indices[0]):

            if idx == -1:
                continue

            results.append({
                "score": float(score),
                "document": self.documents[idx]
            })

        return results


if __name__ == "__main__":

    documents = load_all_documents()

    store = FAISSVectorStore()

    store.build_index(documents)

    print("\nTesting evidence retrieval...")

    query = "When did Beyonce become popular?"

    results = store.search(query, top_k=3)

    for i, result in enumerate(results, 1):

        print(f"\nResult {i}")
        print("Similarity:", result["score"])
        print("Source:", result["document"]["source"])
        print("Text:", result["document"]["text"][:300])
