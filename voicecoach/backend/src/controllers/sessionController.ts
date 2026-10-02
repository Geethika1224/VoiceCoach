import type { Request, Response } from 'express'
import { PracticeSession } from '../models/PracticeSession.js'
import { ConversationMessage } from '../models/ConversationMessage.js'
import { PerformanceReport } from '../models/PerformanceReport.js'
import { sessionSchema } from '../validators/auth.js'

const getSessionWithUser = async (req: any, sessionId: string) => {
  const session = await PracticeSession.findOne({ _id: sessionId, userId: req.user.id })
  return session
}

export const createSession = async (req: any, res: Response) => {
  try {
    const data = sessionSchema.parse(req.body)
    const session = await PracticeSession.create({
      userId: req.user.id,
      mode: data.mode,
      title: data.title,
      topic: data.topic,
      difficulty: data.difficulty,
      configuration: data.configuration,
      status: 'draft',
      currentQuestionIndex: 0,
    })
    return res.status(201).json({ success: true, message: 'Session created.', data: { session } })
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error?.message || 'Session creation failed.' })
  }
}

export const listSessions = async (req: any, res: Response) => {
  const sessions = await PracticeSession.find({ userId: req.user.id }).sort({ createdAt: -1 })
  return res.json({ success: true, message: 'Sessions loaded.', data: { sessions } })
}

export const getSessionById = async (req: any, res: Response) => {
  const session = await getSessionWithUser(req, req.params.id)
  if (!session) return res.status(404).json({ success: false, message: 'Session not found.' })
  return res.json({ success: true, message: 'Session details loaded.', data: { session } })
}

export const updateSession = async (req: any, res: Response) => {
  const session = await getSessionWithUser(req, req.params.id)
  if (!session) return res.status(404).json({ success: false, message: 'Session not found.' })
  Object.assign(session, req.body)
  await session.save()
  return res.json({ success: true, message: 'Session updated.', data: { session } })
}

export const deleteSession = async (req: any, res: Response) => {
  const session = await getSessionWithUser(req, req.params.id)
  if (!session) return res.status(404).json({ success: false, message: 'Session not found.' })
  await ConversationMessage.deleteMany({ sessionId: session._id })
  await PerformanceReport.deleteMany({ sessionId: session._id })
  await session.deleteOne()
  return res.json({ success: true, message: 'Session deleted.' })
}

export const startSession = async (req: any, res: Response) => {
  const session = await getSessionWithUser(req, req.params.id)
  if (!session) return res.status(404).json({ success: false, message: 'Session not found.' })
  session.status = 'active'
  session.startedAt = new Date()
  await session.save()
  return res.json({ success: true, message: 'Session started.', data: { session } })
}

export const submitAnswer = async (req: any, res: Response) => {
  const session = await getSessionWithUser(req, req.params.id)
  if (!session) return res.status(404).json({ success: false, message: 'Session not found.' })
  const { answer, role = 'user' } = req.body
  if (!answer || !String(answer).trim()) return res.status(400).json({ success: false, message: 'Answer cannot be empty.' })

  const message = await ConversationMessage.create({
    sessionId: session._id,
    role,
    message: String(answer),
    sequenceNumber: await ConversationMessage.countDocuments({ sessionId: session._id }) + 1,
    questionType: 'answer',
  })

  return res.json({ success: true, message: 'Answer saved.', data: { message } })
}

export const nextQuestion = async (req: any, res: Response) => {
  const session = await getSessionWithUser(req, req.params.id)
  if (!session) return res.status(404).json({ success: false, message: 'Session not found.' })
  session.currentQuestionIndex += 1
  await session.save()
  return res.json({ success: true, message: 'Advanced to next question.', data: { session } })
}

export const endSession = async (req: any, res: Response) => {
  const session = await getSessionWithUser(req, req.params.id)
  if (!session) return res.status(404).json({ success: false, message: 'Session not found.' })
  session.status = 'completed'
  session.endedAt = new Date()
  session.duration = session.startedAt ? Math.max(1, Math.round((session.endedAt.getTime() - session.startedAt.getTime()) / 60000)) : 1
  await session.save()

  const report = await PerformanceReport.create({
    sessionId: session._id,
    userId: session.userId,
    overallScore: 84,
    categoryScores: { relevance: 86, clarity: 82, structure: 80, technicalAccuracy: 87 },
    strengths: ['Strong structure', 'Clear examples'],
    improvementAreas: ['Add more concise phrasing', 'Use more evidence'],
    recommendations: ['Practice with STAR responses', 'Focus on technical depth'],
    summary: 'Solid performance with room for stronger evidence and concision.',
  })

  return res.json({ success: true, message: 'Session ended.', data: { session, report } })
}

export const resumeSession = async (req: any, res: Response) => {
  const session = await getSessionWithUser(req, req.params.id)
  if (!session) return res.status(404).json({ success: false, message: 'Session not found.' })
  session.status = 'active'
  session.startedAt ||= new Date()
  await session.save()
  return res.json({ success: true, message: 'Session resumed.', data: { session } })
}
