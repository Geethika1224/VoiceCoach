import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(128),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const sessionSchema = z.object({
  mode: z.string().min(2),
  title: z.string().min(2),
  topic: z.string().optional().default(''),
  difficulty: z.string().optional().default('beginner'),
  configuration: z.record(z.any()).optional().default({}),
})
