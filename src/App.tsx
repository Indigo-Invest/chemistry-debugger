import { useEffect, useState } from "react";
import { loadQuestions } from "./data/loadQuestions";
import { evaluateLocal } from "./engine/evaluateLocal";

export default function App() {
  const [question, setQuestion] = useState<any>(null);
  const [userFix, setUserFix] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadQuestions().then(qs => setQuestion(qs[0]));
  }, []);

  if (!question) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>{question.title}</h2>

      <h4>Prompt</h4>
      <p>{question.prompt}</p>

      <h4>Flawed Answer</h4>
      <p style={{ color: "crimson" }}>{question.flawed}</p>

      <h4>Your Fix (one sentence)</h4>
      <textarea
        value={userFix}
        onChange={e => setUserFix(e.target.value)}
        rows={3}
        style={{ width: "100%" }}
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

      {result && (
        <>
          <hr />
          <h3>Score: {result.total} / 6</h3>

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

