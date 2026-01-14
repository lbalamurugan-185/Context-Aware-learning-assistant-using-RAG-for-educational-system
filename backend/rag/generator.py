import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Create Gemini client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "gemini-2.5-flash-lite"


def generate_answer(question: str, contexts: list) -> str:
    """
    Generate an answer using Gemini with retrieved FAISS contexts
    """

    if not contexts:
        context_text = "No relevant context found in documents."
    else:
        context_text = "\n\n".join(
            [f"Source {i+1}:\n{c['text']}" for i, c in enumerate(contexts)]
        )

    prompt = f"""
You are a university-level academic assistant.

STRICT RULES:
- Answer ONLY from the given context
- If not found, say: "Not found in provided materials"
- Write exam-oriented structured answers

Context:
{context_text}

Question:
{question}

Answer:
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    return response.text.strip()
