import { Router } from 'express'
import { env } from '../config/env.js'
import { generateMockQuestion, evaluateMockAnswer } from '../services/ai/mockProvider.js'

const router = Router()

router.post('/generate-question', (req, res) => {
  const { mode = 'interview', topic = '', context = '' } = req.body || {}
  const result = env.aiProvider === 'mock' ? generateMockQuestion(mode, topic, context) : { question: 'The configured AI provider is not enabled in mock mode. Add an API key to use the live provider.', provider: env.aiProvider }
  return res.json({ success: true, message: 'Question generated.', data: result })
})

router.post('/follow-up', (req, res) => {
  const { answer = '', question = '' } = req.body || {}
  const feedback = evaluateMockAnswer(String(answer), String(question))
  return res.json({
    success: true,
    message: 'Answer feedback and follow-up generated.',
    data: { reply: feedback.reply, feedback, question: feedback.nextQuestion, provider: env.aiProvider },
  })
})

router.post('/evaluate-answer', (req, res) => {
  const { answer = '' } = req.body || {}
  return res.json({ success: true, message: 'Answer evaluated.', data: evaluateMockAnswer(answer) })
})

router.post('/generate-report', (req, res) => {
  const { overallScore = 84 } = req.body || {}
  return res.json({ success: true, message: 'Performance report generated.', data: { overallScore, summary: 'Strong overall effort. Focus on concise evidence and clearer transitions.' } })
})

export default router
