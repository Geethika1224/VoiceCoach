import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api } from '../api/client'

type AnswerFeedback = {
  reply: string
  strengths: string[]
  improvementSuggestions: string[]
  overallScore: number
}

export default function InterviewRoomPage() {
  const location = useLocation()
  const session = (location.state as any)?.session
  const [question, setQuestion] = useState('Tell me about a time you solved a problem under pressure.')
  const [transcript, setTranscript] = useState('')
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [pendingQuestion, setPendingQuestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.post('/ai/generate-question', {
          mode: session?.mode || 'HR Interview',
          topic: session?.topic || 'General practice',
        })
        setQuestion(response.data?.data?.question || question)
      } catch (error) {
        console.error('Could not generate AI question', error)
      }
    }
    fetchQuestion()
  }, [session])

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.cancel()
    utterance.rate = 1
    window.speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMessage('Speech recognition is not supported in this browser. Please use the text answer box.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      let nextTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        nextTranscript += event.results[i][0].transcript
      }
      setTranscript(nextTranscript)
      setAnswer(nextTranscript)
    }
    recognition.onerror = (event: any) => {
      const messages: Record<string, string> = {
        'not-allowed': 'Microphone access is blocked. Allow microphone access for this site and try again.',
        'audio-capture': 'No microphone was found. Connect a microphone or use text entry.',
        network: 'The browser could not reach its speech recognition service. Check your internet connection or use text entry.',
        'no-speech': 'No speech was detected. Try again or use text entry.',
      }
      setMessage(messages[event.error] || `Speech recognition failed (${event.error}). Please use text entry.`)
    }
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch (error: any) {
      setMessage(`Could not start speech recognition: ${error?.message || 'please try again or use text entry.'}`)
    }
  }

  const saveAnswer = async () => {
    if (!answer.trim() || isSubmitting) return
    if (!session?._id) {
      setMessage('No active practice session. Start a new session from Practice before submitting an answer.')
      return
    }
    setIsSubmitting(true)
    setMessage('')
    setFeedback(null)
    setPendingQuestion('')

    try {
      await api.post(`/sessions/${session._id}/answer`, { answer })
    } catch (error: any) {
      const status = error?.response?.status
      const message = status === 401
        ? 'Your login has expired. Sign in again, then start a new practice session.'
        : status === 404
          ? 'This practice session is no longer available. Start a new session from Practice.'
          : error?.code === 'ERR_NETWORK'
            ? 'Cannot reach the VoiceCoach backend. Start the backend server and try again.'
            : error?.response?.data?.message || 'Unable to save the answer.'
      setMessage(message)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await api.post('/ai/follow-up', {
        answer,
        question,
        mode: session?.mode || 'HR Interview',
        topic: session?.topic || 'General practice',
      })
      const result = response.data?.data
      if (!result?.reply || !result?.question || !result?.feedback) throw new Error('The coaching response was incomplete.')
      setFeedback(result.feedback)
      setPendingQuestion(result.question)
      speak(result.reply)
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Your answer was saved, but feedback could not be generated.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const continueToNextQuestion = () => {
    if (!pendingQuestion) return
    setQuestion(pendingQuestion)
    setPendingQuestion('')
    setAnswer('')
    setTranscript('')
    setFeedback(null)
    setMessage('')
    speak(pendingQuestion)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.15em] text-indigo-600">VoiceCoach Session</div>
            <h1 className="text-3xl font-black text-slate-900">Interview room</h1>
          </div>
          <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">Listening ready</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Current question</span>
              <button onClick={() => speak(question)} className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">Play question</button>
            </div>
            <div className="rounded-2xl bg-white p-5 text-lg font-medium text-slate-800">{question}</div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={startListening} className={`rounded-full px-4 py-2 font-semibold text-white ${isListening ? 'bg-rose-500' : 'bg-indigo-600'}`}>{isListening ? 'Listening...' : 'Start speaking'}</button>
              <button onClick={() => setAnswer('')} className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700">Clear</button>
              <button onClick={() => speak(question)} className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700">Repeat question</button>
              <button onClick={() => setMessage('Session ended.')} className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700">End interview</button>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Answer</label>
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={6} className="w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:border-indigo-500" placeholder="Speak or type your answer here..." />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={saveAnswer} disabled={!answer.trim() || isSubmitting || Boolean(feedback)} className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Reviewing answer...' : 'Submit answer'}</button>
            </div>

            {message && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}

            {feedback && (
              <section className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-bold text-emerald-950">Coach feedback</h2>
                  <span className="text-sm font-semibold text-emerald-800">Practice score: {feedback.overallScore}/100</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-emerald-950">{feedback.reply}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-950">What worked</h3>
                    <ul className="mt-1 list-inside list-disc text-sm text-emerald-900">
                      {feedback.strengths.map((strength) => <li key={strength}>{strength}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-950">To strengthen it</h3>
                    <ul className="mt-1 list-inside list-disc text-sm text-emerald-900">
                      {feedback.improvementSuggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}
                    </ul>
                  </div>
                </div>
                <button onClick={continueToNextQuestion} className="mt-4 rounded-xl bg-emerald-800 px-4 py-2 font-semibold text-white">Continue to next question</button>
              </section>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] bg-slate-900 p-5 text-white">
              <div className="text-sm text-slate-300">Live transcript</div>
              <div className="mt-3 min-h-[120px] rounded-2xl bg-slate-800 p-3 text-sm text-slate-100">{transcript || 'Your spoken transcript will appear here.'}</div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-500">Session status</div>
              <div className="mt-3 text-2xl font-black text-slate-900">Question 1 / 5</div>
              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div className="h-2 w-1/5 rounded-full bg-indigo-600" />
              </div>
            </div>

            <Link to="/dashboard" className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center font-semibold text-slate-700">Return to dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
