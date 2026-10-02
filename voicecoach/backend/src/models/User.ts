import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    preferredLanguage: { type: String, default: 'en' },
    voiceSettings: {
      voice: { type: String, default: 'default' },
      rate: { type: Number, default: 1 },
    },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)
