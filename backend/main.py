# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.query_engine import answer_question

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str
    answer_type: str = "long"


@app.post("/query")
def query(req: QueryRequest):
    return answer_question(req.question, req.answer_type)


@app.get("/")
def root():
    return {"status": "Context-Aware Learning Assistant is running"}
