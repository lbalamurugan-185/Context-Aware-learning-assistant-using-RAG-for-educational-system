
# 📘 Context-Aware Learning Assistant (RAG-Based QA System)

## 🔍 Project Overview

The **Context-Aware Learning Assistant** is an AI-powered academic question-answering system built using **Retrieval-Augmented Generation (RAG)**.
It answers computer science questions **strictly based on provided academic documents** such as PDFs, ensuring **zero hallucination**, high reliability, and complete **source transparency**.

This project is designed for **exam-oriented learning**, supporting **2-mark, 5-mark, and 13-mark answers**, with confidence scoring and accessibility features like **text-to-speech** and **voice input**.

---

## 🚀 Key Features

* 📚 **Document-Based Question Answering**

  * Answers are generated **only from retrieved document context**
  * No use of LLM’s own knowledge

* 🧠 **Retrieval-Augmented Generation (RAG)**

  * FAISS vector search for accurate document retrieval
  * Semantic similarity-based chunk selection

* 📊 **Answer Confidence Scoring**

  * Confidence calculated using retrieval relevance
  * Transparent reliability indicator for each answer

* 🔎 **Source Transparency**

  * View exact document chunks used to generate answers
  * Relevance score shown for every source

* 🗣 **Text-to-Speech (TTS)**

  * Clean voice output (Markdown removed before reading)
  * Start / Stop reading controls

* 🎤 **Voice Input**

  * Ask questions using speech recognition

* 🌗 **Dark / Light Mode**

  * Modern, responsive UI with accessibility support

* 📄 **Export & Copy**

  * Export answers as `.txt`
  * One-click copy to clipboard

---

## 🏗️ System Architecture

```
User Query
   ↓
React Frontend
   ↓
FastAPI Backend
   ↓
FAISS Vector Search
   ↓
Relevant Document Chunks
   ↓
LLM (Context-Only Prompting)
   ↓
Final Answer + Confidence + Sources
```

---

## 🧰 Tech Stack

### Frontend

* ⚛️ React.js
* 🎨 Tailwind CSS
* 🧩 Lucide Icons
* 🎙 Web Speech API (Voice Input & TTS)

### Backend

* 🐍 Python
* ⚡ FastAPI
* 🔍 FAISS (Vector Database)
* 🤖 Gemini / LLM API
* 📄 PDF-based document ingestion

---

## 📂 Project Structure

```
context/
│
├── backend/
│   ├── main.py
│   ├── query_engine.py
│   ├── rag/
│   │   ├── rag_retriever.py
│   │   ├── faiss_index.pkl
│   │   └── chunks.pkl
│   ├── config.py
│
├── frontend/
│   └── LearningAssistant.jsx
│
├── data/
│   └── pdfs/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Ensure `config.py` contains your LLM API key:

```python
GEMINI_API_KEY = "your_api_key_here"
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

## 🧪 Example Use Case

**Question:**

> Explain deadlock in Operating System for 13 marks

**System Output:**

* ✔ Structured academic answer
* ✔ Confidence score (e.g., 90%)
* ✔ Source documents with relevance %
* ✔ Voice reading available

---

## 🎓 Academic Relevance

This project is ideal for:

* Final-year engineering projects
* AI / Data Science portfolios
* RAG system demonstrations
* Exam-oriented learning platforms

---

## 🔐 Hallucination Control

> ❗ The model is **strictly instructed to answer ONLY from retrieved context**.
> If the context is insufficient, the system explicitly states that no answer is available.

---

## 🌟 Future Enhancements

* Multi-language support
* PDF upload via UI
* User authentication
* Answer highlighting inside PDFs
* Cloud deployment

---

## 👨‍💻 Author

**BalaMurugan L**
B.Tech – Artificial Intelligence & Data Science
AI Enthusiast | RAG Systems | Full-Stack AI Projects

---

## 📜 License

This project is for **educational and academic use**.

---



