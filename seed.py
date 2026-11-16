from ..db import conn
from .store import add_document

DEMO = {
    "Paracetamol guidance": (
        "Paracetamol (acetaminophen) is used to treat mild to moderate pain and fever. "
        "Adults should not take more than 4 grams of paracetamol in 24 hours. "
        "Doses should be spaced at least 4 to 6 hours apart. "
        "Overdose can cause severe liver damage and needs urgent medical attention."),
    "Geography facts": (
        "Paris is the capital and largest city of France. "
        "The Seine river flows through Paris. France is a country in Western Europe."),
    "Investing basics": (
        "A Systematic Investment Plan (SIP) lets investors put a fixed amount into a mutual fund "
        "at regular intervals, such as monthly. SIPs use rupee cost averaging. "
        "Mutual fund returns are subject to market risk and are not guaranteed."),
    "Diabetes overview": (
        "Common symptoms of diabetes include increased thirst, frequent urination, fatigue, "
        "blurred vision and slow healing of wounds. Type 2 diabetes is often linked to lifestyle factors."),
}


def seed_demo_corpus() -> None:
    c = conn()
    n = c.execute("SELECT COUNT(*) FROM documents").fetchone()[0]
    c.close()
    if n == 0:
        for name, text in DEMO.items():
            add_document(name, "demo", text)
