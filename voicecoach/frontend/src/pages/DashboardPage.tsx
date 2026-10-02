import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../context/AuthContext'

const chartData = [
  { name: 'Mon', score: 68 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 74 },
  { name: 'Thu', score: 79 },
  { name: 'Fri', score: 81 },
  { name: 'Sat', score: 84 },
  { name: 'Sun', score: 87 },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between rounded-[28px] bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-3xl font-black text-slate-900">{user?.name || 'User'}</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/practice" className="rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white">Start Interview</Link>
            <Link to="/profile" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700">Profile</Link>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Total Sessions', '14'],
            ['Completed Interviews', '9'],
            ['Practice Time', '5.3h'],
            ['Avg. Score', '84/100'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-black text-slate-900">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Weekly Performance</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" fill="url(#scoreFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Recommended Activities</h2>
            <ul className="space-y-3">
              {['Mock SIH problem pitch', 'Technical interview deep dive', 'Public speaking warm-up'].map((item) => (
                <li key={item} className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Recent Sessions</h2>
            <div className="space-y-3">
              {[
                ['SIH Problem Statement', 'Completed', '87'],
                ['Technical Interview', 'Completed', '84'],
                ['Project Presentation', 'In progress', '—'],
              ].map(([title, status, score]) => (
                <div key={title} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <div className="font-semibold text-slate-900">{title}</div>
                    <div className="text-sm text-slate-500">{status}</div>
                  </div>
                  <div className="font-bold text-indigo-600">{score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/practice" className="block rounded-2xl bg-indigo-600 px-4 py-3 text-center font-semibold text-white">Start an interview</Link>
              <Link to="/practice" className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center font-semibold text-slate-700">SIH presentation</Link>
              <Link to="/history" className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center font-semibold text-slate-700">View session history</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
