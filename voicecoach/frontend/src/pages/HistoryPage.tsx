export default function HistoryPage() {
  const sessions = [
    { title: 'Technical Interview', date: '21 Sep 2026', duration: '12 min', score: '88', status: 'Completed' },
    { title: 'SIH Presentation', date: '18 Sep 2026', duration: '9 min', score: '91', status: 'Completed' },
    { title: 'Public Speaking', date: '14 Sep 2026', duration: '8 min', score: '79', status: 'Draft' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-8 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-black text-slate-900">Session history</h1>
          <button className="rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white">Search/filter</button>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <div className="font-semibold text-slate-900">{session.title}</div>
                <div className="text-sm text-slate-500">{session.date} • {session.duration}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">{session.score}</span>
                <span className="text-sm font-medium text-slate-600">{session.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
