import os
import re
import fitz  # PyMuPDF
import pickle
import faiss
from tqdm import tqdm
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer

# ---------------- CONFIG ---------------- #
RAW_PDF_DIR = "data/raw_pdfs"
FAISS_DIR = "data/faiss_index"
os.makedirs(FAISS_DIR, exist_ok=True)

EMBED_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
TOKENIZER_NAME = "bert-base-uncased"

MAX_TOKENS = 400
TOKEN_OVERLAP = 50
# ---------------------------------------- #

def clean_text_safe(text: str) -> str:
    """
    Minimal cleaning to avoid content loss
    """
    text = text.replace('\x00', '')
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Page-wise extraction to preserve academic structure
    """
    doc = fitz.open(pdf_path)
    pages = []

    for page in doc:
        pages.append(page.get_text("text"))

    return clean_text_safe("\n".join(pages))

def chunk_text_tokens(text: str, tokenizer):
    """
    Token-based chunking (CORRECT way for RAG)
    """
    token_ids = tokenizer.encode(text)
    chunks = []

    start = 0
    while start < len(token_ids):
        end = start + MAX_TOKENS
        chunk_tokens = token_ids[start:end]
        chunk_text = tokenizer.decode(chunk_tokens)
        chunks.append(chunk_text)
        start += MAX_TOKENS - TOKEN_OVERLAP

    return chunks

def ingest_pdfs():
    print("\n🔹 Loading tokenizer & embedding model...")
    tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_NAME)
    embedder = SentenceTransformer(EMBED_MODEL_NAME)

    all_chunks = []
    all_metadata = []

    print("\n🔹 Scanning subject folders...\n")

    for subject in os.listdir(RAW_PDF_DIR):
        subject_path = os.path.join(RAW_PDF_DIR, subject)
        if not os.path.isdir(subject_path):
            continue

        print(f"📘 Subject: {subject.replace('_', ' ').title()}")

        for pdf_file in tqdm(os.listdir(subject_path)):
            if not pdf_file.endswith(".pdf"):
                continue

            pdf_path = os.path.join(subject_path, pdf_file)

            try:
                text = extract_text_from_pdf(pdf_path)

                if len(text.split()) < 200:
                    print(f"⚠️ Low text content: {pdf_file}")

                chunks = chunk_text_tokens(text, tokenizer)

                print(f"   ➜ {pdf_file}: {len(chunks)} chunks")

                for idx, chunk in enumerate(chunks):
                    all_chunks.append(chunk)
                    all_metadata.append({
                        "subject": subject.replace("_", " ").title(),
                        "source": pdf_file,
                        "chunk_id": f"{subject}_{idx}"
                    })

            except Exception as e:
                print(f"❌ Failed to process {pdf_file}: {e}")

    print(f"\n🔹 Total chunks created: {len(all_chunks)}")

    print("\n🔹 Generating embeddings...")
    embeddings = embedder.encode(
        all_chunks,
        batch_size=32,
        show_progress_bar=True
    )

    print("\n🔹 Building FAISS index...")
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    faiss.write_index(index, os.path.join(FAISS_DIR, "index.faiss"))

    with open(os.path.join(FAISS_DIR, "metadata.pkl"), "wb") as f:
        pickle.dump(all_metadata, f)

    with open(os.path.join(FAISS_DIR, "chunks.pkl"), "wb") as f:
        pickle.dump(all_chunks, f)

    print("\n✅ INGESTION COMPLETED SUCCESSFULLY!")
    print("📂 FAISS index + metadata saved")

if __name__ == "__main__":
    ingest_pdfs()
