import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black text-slate-900">Profile & settings</h1>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Name</div>
            <div className="text-lg font-semibold text-slate-900">{user?.name || 'VoiceCoach User'}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Email</div>
            <div className="text-lg font-semibold text-slate-900">{user?.email || 'user@example.com'}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Preferred language</div>
            <div className="text-lg font-semibold text-slate-900">English</div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={logout} className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white">Logout</button>
        </div>
      </div>
    </div>
  )
}
