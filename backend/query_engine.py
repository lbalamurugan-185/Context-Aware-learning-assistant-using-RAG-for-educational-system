from backend.rag.rag_retriever import retrieve_context
from backend.rag.generator import generate_answer


def answer_question(question: str):
    """
    Full RAG pipeline:
    1. Retrieve from FAISS
    2. Generate answer with Gemini
    """

    retrieved_chunks = retrieve_context(question)

    answer = generate_answer(question, retrieved_chunks)

    return {
        "answer": answer,
        "sources": retrieved_chunks,
        "confidence": min(95, 60 + len(retrieved_chunks) * 10)
    }
