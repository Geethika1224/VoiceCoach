import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { env } from './env.js'

let memoryServer: MongoMemoryServer | null = null

export const connectDatabase = async () => {
  try {
    const isDefaultLocalMongoUri = env.mongoUri === 'mongodb://127.0.0.1:27017/voicecoach'

    if (!process.env.MONGO_URI || isDefaultLocalMongoUri) {
      if (!memoryServer) {
        memoryServer = await MongoMemoryServer.create()
      }

      const mongoUri = memoryServer.getUri()
      env.mongoUri = mongoUri
      process.env.MONGO_URI = mongoUri

      await mongoose.connect(mongoUri)
      console.log(`MongoDB connected (memory server): ${mongoUri}`)
      return
    }

    await mongoose.connect(env.mongoUri)
    console.log(`MongoDB connected: ${env.mongoUri}`)
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    throw error
  }
}
