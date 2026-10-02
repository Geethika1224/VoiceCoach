import mongoose, { Schema } from 'mongoose'

const practiceSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, required: true },
    title: { type: String, required: true },
    topic: { type: String, default: '' },
    difficulty: { type: String, default: 'beginner' },
    configuration: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['draft', 'active', 'completed', 'cancelled'], default: 'draft' },
    startedAt: Date,
    endedAt: Date,
    duration: Number,
    currentQuestionIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const PracticeSession = mongoose.model('PracticeSession', practiceSessionSchema)
