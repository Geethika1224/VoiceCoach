export type AIGeneratedQuestion = {
  question: string
  followUp?: boolean
  metadata?: Record<string, unknown>
}

export const buildMockQuestion = (mode: string, topic: string, context: string): AIGeneratedQuestion => {
  const base = mode === 'sih' ? 'Tell me more about the problem you are solving and why it matters.' : mode === 'technical' ? 'Walk me through a technical decision you made in this project.' : 'Can you give a concrete example that demonstrates your point?'
  return {
    question: `${base} Topic focus: ${topic || 'general practice'}. Context: ${context || 'Continue with a clear, structured answer.'}`,
    followUp: true,
    metadata: { provider: 'mock' },
  }
}

export const generateMockQuestion = (mode: string, topic: string, context: string = '') => buildMockQuestion(mode, topic, context)

export const buildMockFeedback = (answer: string, previousQuestion = '') => {
  const words = answer.trim().split(/\s+/).filter(Boolean)
  const hasMetric = /(?:\b\d+(?:\.\d+)?\s*(?:%|percent\b|minutes?\b|hours?\b|days?\b|weeks?\b|users?\b|customers?\b)|\b(?:one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:users?|customers?|minutes?|hours?|days?|weeks?)\b)/i.test(answer)
  const hasOutcome = /\b(result|outcome|improv|increas|reduc|sav|deliver|impact)\w*\b/i.test(answer)
  const hasAction = /\b(built|created|designed|implemented|tested|led|worked|work|validat(?:e|ed|ing|ion)|automat(?:e|ed|ing|ion)|analy[sz]ed|launched|improv(?:e|ed|ing)|reduc(?:e|ed|ing)|increas(?:e|ed|ing)|collaborat(?:e|ed|ing))\b/i.test(answer)
  const hasTeam = /\b(team|collaborat|stakeholder|customer|user)\w*\b/i.test(answer)
  const mentionsUsers = /\b(customer|user)\w*\b/i.test(answer)
  const excerpt = words.slice(0, 16).join(' ').replace(/[.!?]+$/, '')
  const opening = excerpt ? `You explained, “${excerpt}${words.length > 16 ? '...' : ''}.”` : 'Thanks for sharing your answer.'
  const reply = [
    opening,
    hasAction ? 'You described concrete actions, which helps make your reasoning clear.' : 'Make your own actions explicit so the interviewer can see your contribution.',
    hasMetric ? 'The measurable result strengthens your example.' : 'Add a measurable result or outcome to make the example more convincing.',
  ].join(' ')

  const strengths = [
    words.length >= 25 ? 'You gave enough context to follow your explanation.' : 'You addressed the question directly.',
    hasAction ? 'You named specific actions you took.' : 'Your response stays focused on the main topic.',
  ]
  const improvementSuggestions = [
    hasMetric ? 'Explain the baseline behind the result.' : 'Include a specific result or metric if one is available.',
    hasOutcome ? 'Clarify how you measured whether the outcome was successful.' : 'Finish with the outcome and what you learned.',
  ]

  let nextQuestion = hasTeam
    ? mentionsUsers
      ? 'What feedback did those users share, and what did you change as a result?'
      : 'What was your specific contribution to that outcome?'
    : hasMetric
      ? 'What baseline did you compare that result against?'
      : hasOutcome
        ? 'How did you measure whether that outcome was successful?'
        : 'What specific result came from that approach, and how would you measure its impact?'

  if (nextQuestion.toLowerCase() === previousQuestion.trim().toLowerCase()) {
    nextQuestion = 'What would you change if you handled this situation again?'
  }

  const detailBonus = Math.min(12, Math.floor(words.length / 20) * 4)
  const evidenceBonus = (hasAction ? 4 : 0) + (hasMetric ? 4 : 0) + (hasOutcome ? 3 : 0)

  return {
    relevanceScore: Math.min(95, 70 + detailBonus),
    clarityScore: Math.min(95, 72 + detailBonus),
    structureScore: Math.min(95, 70 + (hasOutcome ? 8 : 0) + detailBonus),
    technicalAccuracyScore: 80,
    strengths,
    improvementSuggestions,
    summary: reply,
    reply,
    nextQuestion,
    overallScore: Math.min(95, 70 + detailBonus + evidenceBonus),
    recommendation: 'Use a concise situation, action, and result structure, with evidence where possible.',
    answer,
  }
}

export const evaluateMockAnswer = (answer: string, previousQuestion = '') => buildMockFeedback(answer, previousQuestion)
