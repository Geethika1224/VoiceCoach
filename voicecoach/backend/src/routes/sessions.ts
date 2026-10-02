import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createSession, deleteSession, endSession, getSessionById, listSessions, nextQuestion, resumeSession, startSession, submitAnswer, updateSession } from '../controllers/sessionController.js'

const router = Router()

router.use(requireAuth)
router.post('/', createSession)
router.get('/', listSessions)
router.get('/:id', getSessionById)
router.patch('/:id', updateSession)
router.delete('/:id', deleteSession)
router.post('/:id/start', startSession)
router.post('/:id/answer', submitAnswer)
router.post('/:id/next-question', nextQuestion)
router.post('/:id/end', endSession)
router.post('/:id/resume', resumeSession)

export default router
