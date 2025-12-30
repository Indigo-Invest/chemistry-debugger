export async function loadQuestions() {
  const res = await fetch("/questions.jsonl");
  const text = await res.text();

  return text
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}
