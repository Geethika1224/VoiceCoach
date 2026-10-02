import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getProgress, getRecommendations, getSummary } from '../controllers/dashboardController.js'

const router = Router()
router.use(requireAuth)
router.get('/summary', getSummary)
router.get('/progress', getProgress)
router.get('/recommendations', getRecommendations)

export default router
