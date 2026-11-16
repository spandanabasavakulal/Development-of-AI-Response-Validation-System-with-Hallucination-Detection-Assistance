import re


def chunk_text(text: str, max_words: int = 40, overlap: int = 8) -> list[str]:
    """Sentence-aware chunking with a small word overlap."""
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n{2,}", text) if s.strip()]
    chunks, cur = [], []
    for s in sentences:
        words = s.split()
        if cur and len(cur) + len(words) > max_words:
            chunks.append(" ".join(cur))
            cur = cur[-overlap:] if overlap else []
        cur.extend(words)
    if cur:
        chunks.append(" ".join(cur))
    return chunks
