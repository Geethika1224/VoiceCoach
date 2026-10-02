import mongoose, { Schema } from 'mongoose'

const performanceReportSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'PracticeSession', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    overallScore: { type: Number, required: true },
    categoryScores: { type: Schema.Types.Mixed, default: {} },
    strengths: { type: [String], default: [] },
    improvementAreas: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    summary: { type: String, default: '' },
  },
  { timestamps: true }
)

export const PerformanceReport = mongoose.model('PerformanceReport', performanceReportSchema)
