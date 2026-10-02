import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voicecoach',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  aiProvider: process.env.AI_PROVIDER || 'mock',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
}
