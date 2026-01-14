import { useState } from "react";
import { askQuestion } from "../services/api";

export default function QueryBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const result = await askQuestion(question);
      setAnswer(result);
    } catch (error) {
      setAnswer("❌ Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>📘 Context-Aware Learning Assistant</h2>

      <textarea
        placeholder="Ask an academic question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={handleSubmit} style={styles.button}>
        Ask
      </button>

      {loading && <p>⏳ Generating answer...</p>}

      {answer && (
        <div style={styles.answerBox}>
          <h3>Answer</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  answerBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
  },
};
