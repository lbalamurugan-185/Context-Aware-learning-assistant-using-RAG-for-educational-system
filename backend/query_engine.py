from backend.rag.rag_retriever import retrieve_chunks
from backend.rag.generator import generate_answer


def answer_question(question: str, answer_type: str):
    chunks = retrieve_chunks(question)

    answer = generate_answer(
        question=question,
        context_chunks=chunks,
        answer_type=answer_type
    )

    return {
        "answer": answer,
        "sources": chunks,
        "confidence": min(90, int(len(chunks) * 20))
    }
