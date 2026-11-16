from pydantic import BaseModel, Field


class EvaluateRequest(BaseModel):
    prompt: str = Field(min_length=1)
    response: str = Field(min_length=1)
    corpus: str | None = "demo"
    strictness: float = Field(0.5, ge=0, le=1)
    top_k: int = Field(3, ge=1, le=10)


class TextDocument(BaseModel):
    name: str
    corpus: str = "demo"
    text: str = Field(min_length=1)


class SearchRequest(BaseModel):
    query: str = Field(min_length=1)
    corpus: str | None = None
    top_k: int = Field(5, ge=1, le=20)
