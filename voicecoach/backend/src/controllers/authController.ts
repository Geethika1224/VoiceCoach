import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { env } from '../config/env.js'
import { loginSchema, registerSchema } from '../validators/auth.js'
import { successResponse } from '../utils/response.js'
import type { Request, Response } from 'express'

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)
    const existing = await User.findOne({ email: data.email.toLowerCase() })
    if (existing) return res.status(409).json({ success: false, message: 'User already exists.' })

    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      preferredLanguage: 'en',
      voiceSettings: { voice: 'default', rate: 1 },
      theme: 'light',
    })

    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, env.jwtSecret, { expiresIn: '7d' })
    return res.status(201).json(successResponse('User registered.', { token, user: { id: user._id, name: user.name, email: user.email } }))
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error?.message || 'Invalid registration data.' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await User.findOne({ email: data.email.toLowerCase() })
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' })

    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials.' })

    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, env.jwtSecret, { expiresIn: '7d' })
    return res.json(successResponse('Login successful.', { token, user: { id: user._id, name: user.name, email: user.email } }))
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error?.message || 'Invalid login data.' })
  }
}

export const me = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id).select('-passwordHash')
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' })
  return res.json(successResponse('User profile loaded.', { user }))
}

export const logout = (_req: Request, res: Response) => {
  res.json(successResponse('Logged out successfully.'))
}
