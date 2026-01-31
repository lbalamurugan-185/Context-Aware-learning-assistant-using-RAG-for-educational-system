from backend.rag.rag_retriever import retrieve_chunks
from backend.rag.generator import generate_answer


def answer_question(question: str, answer_type: str):
    chunks = retrieve_chunks(question)

    answer = generate_answer(
        question=question,
        context_chunks=chunks,
        answer_type=answer_type
    )

    # ✅ Dynamic confidence (NOT hardcoded)
    if len(chunks) == 0:
        confidence = 25
    elif len(chunks) == 1:
        confidence = 40
    elif len(chunks) == 2:
        confidence = 60
    elif len(chunks) >= 3:
        confidence = min(90, 60 + len(chunks) * 10)

    return {
        "answer": answer,
        "sources": chunks,
        "confidence": confidence
    }
