import { useState, type FormEvent } from 'react'
import { ArrowRight, Lock, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await api.post(`/auth/${isLogin ? 'login' : 'register'}`, isLogin ? { email, password } : { name, email, password })
      const payload = response.data?.data
      if (payload?.user && payload?.token) {
        login(payload.user, payload.token)
        navigate('/dashboard')
      } else {
        setError('Unexpected authentication response.')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Authentication failed.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white">V</div>
          <h1 className="mt-4 text-3xl font-black text-slate-900">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-slate-600">Practice with confidence.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <User className="h-4 w-4 text-slate-400" />
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Your name" />
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-transparent outline-none" placeholder="you@example.com" />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <Lock className="h-4 w-4 text-slate-400" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full bg-transparent outline-none" placeholder="••••••••" />
            </div>
          </label>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-soft">
            {isLogin ? 'Login' : 'Create account'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <button onClick={() => setIsLogin((v) => !v)} className="mt-6 w-full text-sm font-medium text-slate-600">
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  )
}
