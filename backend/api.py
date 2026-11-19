
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import traceback

from main import evaluate_ai_response


app = FastAPI(
    title="AI Response Quality Evaluator API",
    description="Multi-agent AI response evaluation system",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://development-of-ai-response-validati-mu.vercel.app"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class EvaluationRequest(BaseModel):
    question: str = Field(min_length=1)
    ai_response: str = Field(min_length=1)
    reference_answer: Optional[str] = ""


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "AI Response Quality Evaluator API is running!",
        "status": "active"
    }


# Health endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Response Quality Evaluator"
    }


# Evaluation endpoint
@app.post("/evaluate")
def evaluate(request: EvaluationRequest):

    try:
        print("\n========== NEW EVALUATION REQUEST ==========")

        print("Question:", request.question)
        print("Starting five-agent evaluation pipeline...")

        result = evaluate_ai_response(
            question=request.question,
            ai_response=request.ai_response,
            reference_answer=request.reference_answer or ""
        )

        print("Evaluation completed successfully!")
        print("============================================\n")

        return result

    except Exception as error:

        print("\n========== BACKEND ERROR ==========")
        traceback.print_exc()
        print("===================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
