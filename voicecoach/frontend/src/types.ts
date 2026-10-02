export type ThemeMode = 'light' | 'dark'

export type User = {
  id?: string
  name: string
  email: string
  preferredLanguage?: string
  theme?: ThemeMode
  voiceSettings?: {
    voice?: string
    rate?: number
  }
}

export type PracticeSession = {
  _id?: string
  mode: string
  title: string
  topic?: string
  difficulty?: string
  status?: string
  duration?: number
  currentQuestionIndex?: number
  createdAt?: string
}
