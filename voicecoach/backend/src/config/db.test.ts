import { beforeEach, describe, expect, it, vi } from 'vitest'
import mongoose from 'mongoose'
import { connectDatabase } from './db.js'

describe('connectDatabase', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('uses a transient MongoDB server when no environment URI is configured', async () => {
    const originalUri = process.env.MONGO_URI
    delete process.env.MONGO_URI

    const connectSpy = vi.spyOn(mongoose, 'connect').mockResolvedValue({} as any)

    try {
      await connectDatabase()

      expect(connectSpy).toHaveBeenCalledTimes(1)
      const uri = connectSpy.mock.calls[0][0]
      expect(uri).toMatch(/^mongodb:\/\/127\.0\.0\.1:/)
      expect(uri).not.toBe('mongodb://127.0.0.1:27017/voicecoach')
    } finally {
      if (originalUri) {
        process.env.MONGO_URI = originalUri
      } else {
        delete process.env.MONGO_URI
      }
    }
  })
})
