import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { deleteProfile, getProfile, updateProfile } from '../controllers/profileController.js'

const router = Router()
router.use(requireAuth)
router.get('/', getProfile)
router.patch('/', updateProfile)
router.delete('/', deleteProfile)

export default router
