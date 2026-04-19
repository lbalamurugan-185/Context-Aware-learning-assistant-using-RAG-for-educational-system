import google.generativeai as genai
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


def generate_answer(question: str, context_chunks: list, answer_type: str):
    """
    Generate answer STRICTLY from retrieved context.
    """

    if not context_chunks:
        return (
            "The available documents do not contain sufficient information "
            "to answer this question."
        )

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
You are a strict academic assistant.

You MUST answer the question using ONLY the information provided below.

Rules:
- Do NOT use external or prior knowledge.
- Do NOT assume missing details.
- Do NOT use markdown symbols like #.
- Use plain text and bold headings.

If the context is partial:
End with this sentence exactly:
"Due to limited availability of relevant resources, the answer provided is partial."

Context:
{context_text}

Question:
{question}

Instruction:
{instruction}
"""

    response = model.generate_content(prompt)
    return response.text.strip()
