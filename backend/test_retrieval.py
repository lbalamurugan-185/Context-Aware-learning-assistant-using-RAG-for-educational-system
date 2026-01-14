from backend.rag.rag_retriever import FAISSRetriever

retriever = FAISSRetriever()

TEST_QUERIES = [
    {
        "question": "Explain deadlock in operating system",
        "subject": "Operating System"
    },
    {
        "question": "What is normalization in DBMS?",
        "subject": "Dbms"
    },
    {
        "question": "Explain BFS and DFS",
        "subject": "Data Structures"
    },
    {
        "question": "What is TCP congestion control?",
        "subject": "Computer Networks"
    },
    {
        "question": "Explain software development life cycle",
        "subject": "Software Engineering"
    }
]

for idx, q in enumerate(TEST_QUERIES, start=1):
    print("\n" + "=" * 80)
    print(f"TEST CASE {idx}")
    print(f"Question : {q['question']}")
    print(f"Subject  : {q['subject']}")
    print("-" * 80)

    results = retriever.retrieve(
        query=q["question"],
        subject=q["subject"],
        top_k=3
    )

    if not results:
        print("❌ No results retrieved")
        continue

    for i, r in enumerate(results, start=1):
        print(f"\n🔹 Result {i}")
        print(f"Subject : {r['subject']}")
        print(f"Source  : {r['source']}")
        print(f"Preview : {r['text'][:300]}...")
