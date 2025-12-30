export function evaluateLocal(
  userFix: string,
  gold: string,
  flawed: string
) {
  const fix = userFix.toLowerCase();

  const scores = {
    concept: fix.includes("activation") || fix.includes("rate") ? 2 : 0,
    causality: fix.includes("but") || fix.includes("depends") ? 2 : 1,
    error_fix: !fix.includes("measures how fast") ? 2 : 0
  };

  const total = scores.concept + scores.causality + scores.error_fix;

  return {
    scores,
    total,
    error_types: total < 6 ? ["Partially Correct but Incomplete"] : [],
    feedback: {
      what_was_fixed: "Key distinction attempted.",
      what_is_missing_or_wrong:
        total < 6 ? "Missing precision or clarity." : "Nothing essential missing.",
      model_explanation: gold
    }
  };
}
