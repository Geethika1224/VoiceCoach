import { ArrowRight, Mic, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  { title: 'AI Interviewer', description: 'Ask realistic questions, adapt follow-ups, and mirror a live interviewer.', icon: Mic },
  { title: 'Voice Practice', description: 'Speak freely, review transcript, and improve with instant guidance.', icon: Sparkles },
  { title: 'SIH Pitch Practice', description: 'Prepare and defend your idea with evaluator-style prompts.', icon: TrendingUp },
  { title: 'Progress Tracking', description: 'Use analytics and practice history to improve consistently.', icon: Users },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">V</div>
          <div>
            <div className="text-lg font-bold">VoiceCoach</div>
          </div>
        </div>
        <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>
        <div className="flex gap-3">
          <Link to="/auth" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Login</Link>
          <Link to="/auth" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-soft">Start Practising</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <section className="grid items-center gap-8 rounded-[32px] bg-white p-8 shadow-soft md:grid-cols-2 md:p-12">
          <div>
            <div className="mb-4 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">AI speaking coach</div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">Speak with Confidence. Perform with Clarity.</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">Practice interviews, technical explanations, SIH pitches, and public speaking with an AI interviewer that listens, probes, and gives actionable feedback.</p>
            <div className="mt-8 flex gap-4">
              <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-soft">Start Practising <ArrowRight className="h-4 w-4" /></Link>
              <a href="#features" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700">Explore Features</a>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-5 text-white shadow-soft">
            <div className="rounded-2xl bg-slate-800 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-slate-300">Live Interview</div>
                <div className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300">Listening</div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-700 p-4 text-sm text-slate-100">Interviewer: Tell me about a challenge you solved in your last project.</div>
                <div className="ml-auto max-w-[80%] rounded-2xl bg-indigo-500 p-4 text-sm text-white">User: We improved onboarding time by reducing manual steps using an automated workflow.</div>
                <div className="rounded-2xl bg-slate-700 p-4 text-sm text-slate-100">Interviewer: What metric proved the change worked?</div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Features</p>
            <h2 className="mt-2 text-3xl font-bold">Practice for real situations</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon className="h-5 w-5" /></div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-20">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">How it works</p>
            <h2 className="mt-2 text-3xl font-bold">From nervous to prepared</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              'Choose your practice mode and difficulty.',
              'Speak your answer or type a response.',
              'Get AI feedback and improve your next round.',
            ].map((step, index) => (
              <div key={step} className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-4 text-3xl font-black text-indigo-600">0{index + 1}</div>
                <p className="text-lg font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mt-20 rounded-[32px] bg-slate-900 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">About</p>
              <h3 className="mt-3 text-2xl font-bold">Built for students, job seekers, and creators.</h3>
            </div>
            <div className="text-slate-300">
              VoiceCoach helps you sharpen communication by simulating realistic interviewers, judges, and presentation evaluators in one place.
            </div>
            <div className="text-slate-300">
              Use mock mode for local practice or connect a real AI provider in the backend when you want richer answers and deeper feedback.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
