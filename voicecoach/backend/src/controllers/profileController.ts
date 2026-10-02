import type { Request, Response } from 'express'
import { User } from '../models/User.js'

export const getProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id).select('-passwordHash')
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' })
  return res.json({ success: true, message: 'Profile loaded.', data: { user } })
}

export const updateProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' })
  const allowed = ['name', 'preferredLanguage', 'theme', 'voiceSettings'] as const
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      ;(user as any)[key] = req.body[key]
    }
  }
  await user.save()
  return res.json({ success: true, message: 'Profile updated.', data: { user } })
}

export const deleteProfile = async (req: any, res: Response) => {
  await User.findByIdAndDelete(req.user.id)
  return res.json({ success: true, message: 'Account deleted.' })
}
