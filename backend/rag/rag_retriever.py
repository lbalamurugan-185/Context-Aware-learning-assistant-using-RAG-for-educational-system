import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

INDEX_PATH = "data/faiss_index/index.faiss"
CHUNKS_PATH = "data/faiss_index/chunks.pkl"
METADATA_PATH = "data/faiss_index/metadata.pkl"

model = SentenceTransformer("all-MiniLM-L6-v2")

index = faiss.read_index(INDEX_PATH)

with open(CHUNKS_PATH, "rb") as f:
    chunks = pickle.load(f)

with open(METADATA_PATH, "rb") as f:
    metadata = pickle.load(f)

def retrieve_context(query: str, top_k: int = 3):
    query_embedding = model.encode([query]).astype("float32")

    distances, indices = index.search(query_embedding, top_k)

    results = []
    for i, idx in enumerate(indices[0]):
        results.append({
            "text": chunks[idx],
            "score": float(1 / (1 + distances[0][i])),
            "source": metadata[idx].get("source", "Document"),
            "subject": metadata[idx].get("subject", "Course Material")
        })

    return results
