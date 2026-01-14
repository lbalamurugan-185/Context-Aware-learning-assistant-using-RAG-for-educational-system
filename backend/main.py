from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.query_engine import answer_question

app = FastAPI(
    title="Context-Aware Learning Assistant API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {"status": "API is running"}


@app.post("/query")
def query(req: QueryRequest):
    return answer_question(req.question)
