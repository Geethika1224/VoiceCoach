import mongoose, { Schema } from 'mongoose'

const conversationMessageSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'PracticeSession', required: true },
    role: { type: String, enum: ['interviewer', 'user'], required: true },
    message: { type: String, required: true },
    questionType: { type: String, default: 'general' },
    sequenceNumber: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const ConversationMessage = mongoose.model('ConversationMessage', conversationMessageSchema)
