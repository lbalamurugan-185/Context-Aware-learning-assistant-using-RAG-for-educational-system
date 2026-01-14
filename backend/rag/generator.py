import google.generativeai as genai
from backend.config import GEMINI_API_KEY

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_answer(question: str, context_chunks: list, answer_type: str):
    """
    Generate answer STRICTLY from retrieved context.
    If context exists, answer MUST be generated.
    """

    if not context_chunks:
        return "No relevant context was retrieved to answer this question."

    if answer_type == "short":
        instruction = "Answer briefly in 2-mark exam format."
    elif answer_type == "medium":
        instruction = "Answer clearly in 5-mark exam format with headings."
    else:
        instruction = "Answer in detailed 13-mark exam format with headings and subheadings."

    context_text = "\n\n".join(
        [f"{i+1}. {chunk['text']}" for i, chunk in enumerate(context_chunks)]
    )

    prompt = f"""
You are a university exam answer generator.

IMPORTANT RULES:
- Use ONLY the given context
- Do NOT use your own knowledge
- Do NOT say "context not available"
- Do NOT refuse to answer
- Write in clear academic language

Context:
{context_text}

Question:
{question}

Instruction:
{instruction}
"""

    response = model.generate_content(prompt)
    return response.text.strip()
