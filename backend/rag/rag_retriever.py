import os
import faiss
import pickle
from sentence_transformers import SentenceTransformer
import numpy as np

# -----------------------------
# PATH CONFIG (ABSOLUTE SAFE)
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))

FAISS_DIR = os.path.join(PROJECT_ROOT, "data", "faiss_index")

INDEX_PATH = os.path.join(FAISS_DIR, "index.faiss")
CHUNKS_PATH = os.path.join(FAISS_DIR, "chunks.pkl")
METADATA_PATH = os.path.join(FAISS_DIR, "metadata.pkl")

# -----------------------------
# VALIDATION
# -----------------------------
if not os.path.exists(INDEX_PATH):
    raise FileNotFoundError("FAISS index.faiss not found")

if not os.path.exists(CHUNKS_PATH):
    raise FileNotFoundError("chunks.pkl not found")

if not os.path.exists(METADATA_PATH):
    raise FileNotFoundError("metadata.pkl not found")

# -----------------------------
# LOAD FILES (ONCE)
# -----------------------------
index = faiss.read_index(INDEX_PATH)

with open(CHUNKS_PATH, "rb") as f:
    chunks = pickle.load(f)

with open(METADATA_PATH, "rb") as f:
    metadata = pickle.load(f)

# -----------------------------
# EMBEDDING MODEL
# -----------------------------
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# -----------------------------
# RETRIEVER FUNCTION
# -----------------------------
def retrieve_chunks(query: str, top_k: int = 5):
    query_embedding = embedder.encode([query]).astype("float32")

    distances, indices = index.search(query_embedding, top_k)

    results = []

    for idx, score in zip(indices[0], distances[0]):
        if idx < len(chunks):
            results.append({
                "text": chunks[idx],
                "score": float(1 / (1 + score)),
                "source": metadata[idx].get("source", "Unknown"),
                "subject": metadata[idx].get("subject", "General")
            })

    return results
