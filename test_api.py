import os
os.environ["DB_PATH"] = "data/test.db"
from fastapi.testclient import TestClient
from app.main import app


def test_flow():
    with TestClient(app) as c:
        assert c.get("/health").json()["status"] == "ok"

        bad = c.post("/api/evaluate", json={
            "prompt": "What is the maximum daily dose of paracetamol for adults?",
            "response": "The maximum daily dose is 8 grams. It is used for pain and fever."}).json()
        assert bad["verdict"] == "Fail" and bad["safety_veto"] is True

        good = c.post("/api/evaluate", json={
            "prompt": "What is the capital of France?",
            "response": "Paris is the capital of France."}).json()
        assert good["verdict"] == "Pass"

        assert c.get(f"/api/evaluations/{good['id']}").status_code == 200
        assert c.get("/api/evaluations").json()["total"] >= 2
        assert c.get("/api/stats").json()["total"] >= 2
        assert len(c.post("/api/knowledge/search", json={"query": "paracetamol dose"}).json()["results"]) > 0

        csv = b"prompt,response\nWhat is SIP?,A SIP invests a fixed amount in a mutual fund at regular intervals.\n"
        b = c.post("/api/batch/evaluate", files={"file": ("t.csv", csv, "text/csv")}).json()
        assert b["processed"] == 1
