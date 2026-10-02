import type { Request, Response } from 'express'
import { PracticeSession } from '../models/PracticeSession.js'
import { PerformanceReport } from '../models/PerformanceReport.js'

export const getSummary = async (req: any, res: Response) => {
  const sessions = await PracticeSession.find({ userId: req.user.id })
  const reports = await PerformanceReport.find({ userId: req.user.id })
  const totalPracticeTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0)
  const averageScore = reports.length ? reports.reduce((sum, report) => sum + report.overallScore, 0) / reports.length : 0
  return res.json({ success: true, message: 'Dashboard summary loaded.', data: { summary: { totalSessions: sessions.length, completedInterviews: sessions.filter((session) => session.status === 'completed').length, totalPracticeTime, averagePerformanceScore: Number(averageScore.toFixed(1)) } } })
}

export const getProgress = async (req: any, res: Response) => {
  const reports = await PerformanceReport.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(7)
  return res.json({ success: true, message: 'Progress loaded.', data: { progress: reports } })
}

export const getRecommendations = async (req: any, res: Response) => {
  return res.json({ success: true, message: 'Recommendations loaded.', data: { recommendations: [
    'Practice a STAR-based answer for project confidence.',
    'Prepare a concise SIH problem statement introduction.',
    'Rehearse verbal transitions and examples for technical interviews.',
  ] } })
}
