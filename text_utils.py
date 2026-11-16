import re
from ..rag.embedder import stem

STOP = set("""a an the is are was were be been being of in on at to for from by with and or but if
then than that this these those it its as into about over under not no what which who whom how
when where why can could should would will shall may might do does did has have had per""".split())


def content_words(text: str) -> set[str]:
    return {stem(w) for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOP and len(w) > 1}


def overlap(a: str, b: str) -> float:
    """Fraction of a's content words that also appear in b."""
    wa = content_words(a)
    return len(wa & content_words(b)) / len(wa) if wa else 0.0


def numbers(text: str) -> set[str]:
    return set(re.findall(r"\d+(?:\.\d+)?", text))
