export function formatGuidanceResponse(analysis: Record<string, any>, service: string): string {
  const { karmicLesson, surfacePattern, sevenstepPlan, remedies } = analysis

  if (service === "flash-k") {
    return `
🔮 Your Cosmic Insight

The Pattern: ${surfacePattern}

The Karmic Lesson: ${karmicLesson}

Your Breakthrough Action Today:
${remedies[0] || "Pause and breathe."}

✨ This guidance is for your reflection and spiritual growth.
    `
  }

  if (service === "karma-level") {
    return `
🔮 Your Karmic Reading: 7-Day Breakthrough Plan

Understanding Your Pattern:
${surfacePattern}

The Deeper Truth:
${karmicLesson}

Your 7-Step Breakthrough Path:
${sevenstepPlan
  .map((step: any, i: number) => `${i + 1}. Day ${step.day}: ${step.practice} (${step.duration})`)
  .join("\n")}

Recommended Practices:
${remedies.map((r: string) => `• ${r}`).join("\n")}

Opportunity Window: ${analysis.opportunityWindow}
Watch For: ${analysis.warningSign}

🙏 May this guidance serve your highest evolution.
    `
  }

  return analysis.toString()
}
