export type UserRole = 'user'

export interface IUser {
  _id?: string
  name: string
  email: string
  passwordHash: string
  preferredLanguage: string
  voiceSettings: {
    voice: string
    rate: number
  }
  theme: 'light' | 'dark'
  createdAt?: Date
  updatedAt?: Date
}

export interface IPracticeSession {
  _id?: string
  userId: string
  mode: string
  title: string
  topic: string
  difficulty: string
  configuration: Record<string, unknown>
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  startedAt?: Date
  endedAt?: Date
  duration?: number
  currentQuestionIndex: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IConversationMessage {
  _id?: string
  sessionId: string
  role: 'interviewer' | 'user'
  message: string
  questionType?: string
  sequenceNumber: number
  timestamp?: Date
}

export interface IAnswerEvaluation {
  _id?: string
  sessionId: string
  messageId?: string
  relevanceScore: number
  clarityScore: number
  structureScore: number
  technicalAccuracyScore?: number
  strengths: string[]
  improvementSuggestions: string[]
  createdAt?: Date
}

export interface IPerformanceReport {
  _id?: string
  sessionId: string
  userId: string
  overallScore: number
  categoryScores: Record<string, number>
  strengths: string[]
  improvementAreas: string[]
  recommendations: string[]
  summary: string
  createdAt?: Date
}
