import { useEffect, useState } from "react";
import { loadQuestions } from "./data/loadQuestions";
import { evaluateLocal } from "./engine/evaluateLocal";

export default function App() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [question, setQuestion] = useState<any>(null);
  const [userFix, setUserFix] = useState("");
  const [result, setResult] = useState<any>(null);

  // Load all questions once
  useEffect(() => {
    loadQuestions().then(qs => {
      setQuestions(qs);
      pickRandomQuestion(qs);
    });
  }, []);

  function pickRandomQuestion(qs = questions) {
    if (!qs.length) return;

    let next;
    do {
      next = qs[Math.floor(Math.random() * qs.length)];
    } while (qs.length > 1 && next.id === question?.id);

    setQuestion(next);
    setUserFix("");
    setResult(null);
  }

  if (!question) {
    return <div style={{ padding: 20 }}>Loading questions…</div>;
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>{question.title}</h2>

      <p style={{ color: "#555" }}>
        {question.domain} · {question.difficulty}
      </p>

      <h4>Prompt</h4>
      <p>{question.prompt}</p>

      <h4>Flawed Answer</h4>
      <p style={{ color: "crimson" }}>{question.flawed}</p>

      <h4>Your Fix (one sentence)</h4>
      <textarea
        value={userFix}
        onChange={e => setUserFix(e.target.value)}
        rows={3}
        style={{ width: "100%", fontSize: 14 }}
      />

      <br /><br />

      <button
        disabled={!userFix.trim()}
        onClick={() =>
          setResult(
            evaluateLocal(userFix, question.gold, question.flawed)
          )
        }
      >
        Submit & Check
      </button>

      <button
        onClick={() => pickRandomQuestion()}
        style={{ marginLeft: 10 }}
      >
        Next Question 🔄
      </button>

      {result && (
        <>
          <hr />

          <h3>
            Score: {result.total} / 6{" "}
            {result.total === 6 ? "✅" : "⚠️"}
          </h3>

          {result.error_types.length > 0 && (
            <p>
              <strong>Detected misconception:</strong>{" "}
              {result.error_types.join(", ")}
            </p>
          )}

          <p>
            <strong>What you fixed:</strong>{" "}
            {result.feedback.what_was_fixed}
          </p>

          <p>
            <strong>Missing / wrong:</strong>{" "}
            {result.feedback.what_is_missing_or_wrong}
          </p>

          <details>
            <summary>Gold Answer</summary>
            <p>{result.feedback.model_explanation}</p>
          </details>
        </>
      )}
    </div>
  );
}
