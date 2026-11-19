
from sentence_transformers import SentenceTransformer
import numpy as np


class EmbeddingModel:

    def __init__(self):
        print("Loading Sentence Transformer model...")

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        print("Embedding model loaded successfully!")

    def generate_embeddings(self, texts):

        if not texts:
            return np.empty((0, 384), dtype=np.float32)

        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=True
        )

        return embeddings.astype(np.float32)


if __name__ == "__main__":

    embedding_model = EmbeddingModel()

    sample_texts = [
        "What is artificial intelligence?",
        "Artificial intelligence enables machines to perform intelligent tasks.",
        "The capital of India is New Delhi."
    ]

    vectors = embedding_model.generate_embeddings(sample_texts)

    print("\nEmbedding Results")
    print("-------------------------")
    print("Number of texts:", len(sample_texts))
    print("Embedding shape:", vectors.shape)
    print("Vector dimension:", vectors.shape[1])
