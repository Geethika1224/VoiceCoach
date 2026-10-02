import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (nextUser: User, nextToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('voicecoach_token'))

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('voicecoach_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [token])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    login: (nextUser, nextToken) => {
      setUser(nextUser)
      setToken(nextToken)
      localStorage.setItem('voicecoach_token', nextToken)
      localStorage.setItem('voicecoach_user', JSON.stringify(nextUser))
    },
    logout: () => {
      setUser(null)
      setToken(null)
      localStorage.removeItem('voicecoach_token')
      localStorage.removeItem('voicecoach_user')
    },
  }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('AuthContext not found')
  return context
}
