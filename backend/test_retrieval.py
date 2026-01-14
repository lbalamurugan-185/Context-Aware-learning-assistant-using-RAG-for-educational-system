from backend.rag.rag_retriever import retrieve_chunks

if __name__ == "__main__":
    query = "Explain deadlock in operating system"

    results = retrieve_chunks(query, top_k=5)

    print(f"\nRetrieved {len(results)} chunks:\n")

    for i, r in enumerate(results, start=1):
        print(f"--- Chunk {i} ---")
        print(f"Source  : {r['source']}")
        print(f"Subject : {r['subject']}")
        print(f"Score   : {r['score']:.4f}")
        print("Text    :")
        print(r["text"][:300])
        print()
