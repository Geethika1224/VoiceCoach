import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

const modes = ['HR Interview', 'Technical Interview', 'Behavioral Interview', 'SIH Problem Statement Explanation', 'Project Presentation', 'College Viva Practice', 'General Public Speaking', 'Free Expression Mode']

export default function PracticePage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('HR Interview')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [topic, setTopic] = useState('Product design and problem solving')
  const [duration, setDuration] = useState(10)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    setError('')
    try {
      const response = await api.post('/sessions', {
        mode,
        title: `${mode} practice`,
        topic,
        difficulty,
        configuration: { duration, language: 'en' },
      })
      const session = response.data?.data?.session
      if (session?._id) {
        navigate('/interview', { state: { session } })
      } else {
        setError('Session could not be created.')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not start a session.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black text-slate-900">Practice selection</h1>
        <p className="mt-2 text-slate-600">Select the mode, difficulty, and topic to begin your next session.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Practice mode</span>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              {modes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Difficulty</span>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => <option key={level}>{level}</option>)}
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Topic or role</span>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Session duration (minutes)</span>
            <input type="number" min={5} max={30} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Language</span>
            <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" defaultValue="English">
              <option>English</option>
            </select>
          </label>
        </div>

        {error && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="mt-8 flex justify-end">
          <button onClick={handleCreate} className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-soft">Start session</button>
        </div>
      </div>
    </div>
  )
}
