import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import authRoutes from './routes/auth.js'
import sessionRoutes from './routes/sessions.js'
import dashboardRoutes from './routes/dashboard.js'
import profileRoutes from './routes/profile.js'
import aiRoutes from './routes/ai.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: env.frontendUrl, credentials: true }))
app.use(helmet())
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'VoiceCoach backend is running.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/ai', aiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
