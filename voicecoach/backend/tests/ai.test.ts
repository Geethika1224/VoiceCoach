import { describe, expect, it } from 'vitest'
import { evaluateMockAnswer } from '../src/services/ai/mockProvider.js'

describe('mock answer feedback', () => {
  it('recognizes measurable outcomes and gives a targeted follow-up', () => {
    const result = evaluateMockAnswer(
      'We reduced onboarding time by 30% by automating account setup.',
      'Tell me about an improvement.'
    )

    expect(result.reply).toContain('30%')
    expect(result.strengths).toContain('You named specific actions you took.')
    expect(result.nextQuestion).toBe('What baseline did you compare that result against?')
  })

  it('responds to user-validation details with a relevant follow-up', () => {
    const result = evaluateMockAnswer(
      'I worked with the design team to validate the new flow with five customers.',
      'How did you test your idea?'
    )

    expect(result.reply).toContain('concrete actions')
    expect(result.nextQuestion).toBe('What feedback did those users share, and what did you change as a result?')
  })

  it('avoids repeating the current question', () => {
    const currentQuestion = 'What baseline did you compare that result against?'
    const result = evaluateMockAnswer('We reduced onboarding time by 30%.', currentQuestion)

    expect(result.nextQuestion).not.toBe(currentQuestion)
  })
})