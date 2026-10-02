import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './theme.css'

const MODES = {
  sih: { label: 'SIH Judge', icon: '🏆', intro: 'I am the judge. Explain your problem statement and solution as if this were the real evaluation round.' },
  interview: { label: 'Job Interview', icon: '💼', intro: 'I am the interviewer. Ask one question at a time and react naturally to the candidate answer.' },
  presentation: { label: 'Presentation', icon: '🎤', intro: 'I am the audience and evaluator. Let the user present without interruption, then challenge unclear points.' },
  feelings: { label: 'Talk It Out', icon: '🫶', intro: 'Be a calm, supportive listener. Help the user put their thoughts and feelings into words without judging them.' }
}

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.98
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

function App() {
  const [mode, setMode] = useState('sih')
  const [topic, setTopic] = useState('PS 26043 – Crowdsourcing Societal Challenges')
  const [phase, setPhase] = useState('ready')
  const [messages, setMessages] = useState([])
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState(null)
  const recognitionRef = useRef(null)

  const SpeechRecognition = useMemo(() => window.SpeechRecognition || window.webkitSpeechRecognition, [])

  useEffect(() => () => { recognitionRef.current?.abort(); window.speechSynthesis?.cancel() }, [])

  function addMessage(role, text) {
    setMessages(prev => [...prev, { role, text }])
  }

  async function startSession() {
    setMessages([]); setFeedback(null); setTranscript(''); setPhase('thinking')
    const opening = mode === 'feelings'
      ? 'Take a breath. Tell me what has been on your mind lately. I will listen first.'
      : `We are starting a ${MODES[mode].label} session about ${topic}. ${mode === 'sih' ? 'Please explain the problem statement in your own words.' : 'Ready? Give me your opening response.'}`
    addMessage('ai', opening); speak(opening); setPhase('listening')
  }

  function startListening() {
    if (!SpeechRecognition) {
      setPhase('unsupported')
      return
    }
    setTranscript('')
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onstart = () => setPhase('listening')
    recognition.onresult = (event) => {
      let text = ''
      for (let i = event.resultIndex; i < event.results.length; i++) text += event.results[i][0].transcript
      setTranscript(text)
    }
    recognition.onerror = () => setPhase('ready')
    recognition.onend = async () => {
      const finalText = transcript.trim() || ''
      if (!finalText) { setPhase('ready'); return }
      addMessage('user', finalText)
      setPhase('thinking')
      try {
        const response = await fetch('http://localhost:4000/api/respond', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, topic, history: [...messages, { role: 'user', text: finalText }] })
        })
        if (!response.ok) throw new Error('AI server error')
        const data = await response.json()
        addMessage('ai', data.reply)
        setFeedback(data.feedback)
        speak(data.reply)
        setPhase('ready')
      } catch (error) {
        addMessage('ai', 'I could not reach the AI server. Make sure the backend is running on port 4000.')
        setPhase('ready')
      }
    }
    recognitionRef.current = recognition
    recognition.start()
  }

  return <main className="app-shell">
    <header><div><span className="eyebrow">VOICE PRACTICE LAB</span><h1>VoiceCoach</h1><p>Speak naturally. Get challenged. Improve.</p></div><div className={`status ${phase}`}><span></span>{phase === 'listening' ? 'Listening' : phase === 'thinking' ? 'Thinking' : 'Ready'}</div></header>

    <section className="mode-grid">
      {Object.entries(MODES).map(([key, value]) => <button key={key} className={`mode ${mode === key ? 'active' : ''}`} onClick={() => setMode(key)}><span>{value.icon}</span><b>{value.label}</b><small>{key === 'sih' ? 'Problem statement + judge Q&A' : key === 'interview' ? 'HR + technical practice' : key === 'presentation' ? 'Presentation + audience questions' : 'Express and organize thoughts'}</small></button>)}
    </section>

    <section className="topic-row"><label>Session topic</label><input value={topic} onChange={e => setTopic(e.target.value)} /></section>

    <section className="workspace">
      <div className="conversation">
        <div className="panel-head"><h2>Live conversation</h2><button onClick={startSession}>New session</button></div>
        <div className="messages">{messages.length === 0 && <div className="empty"><div className="mic-circle">🎙️</div><h3>Ready when you are</h3><p>Start a session, then speak your answer. The AI will listen and respond.</p></div>}
        {messages.map((m, i) => <div key={i} className={`bubble ${m.role}`}><span>{m.role === 'ai' ? 'AI' : 'YOU'}</span><p>{m.text}</p></div>)}
        {phase === 'listening' && transcript && <div className="bubble user live"><span>YOU · LIVE</span><p>{transcript}</p></div>}
        </div>
        <div className="controls"><button className="talk" onClick={startListening} disabled={phase === 'thinking'}>{phase === 'listening' ? '🎙️ Listening…' : '🎙️ Speak answer'}</button><button className="stop" onClick={() => { recognitionRef.current?.abort(); setPhase('ready'); window.speechSynthesis?.cancel() }}>Stop</button></div>
        {!SpeechRecognition && <p className="warning">Browser speech recognition is unavailable. Chrome/Edge on desktop is recommended for this MVP.</p>}
      </div>
      <aside className="feedback"><div className="panel-head"><h2>Coach feedback</h2><span className="pill">LIVE</span></div>{feedback ? <><div className="score">{feedback.score}<small>/10</small></div><h3>{feedback.title}</h3><p>{feedback.summary}</p><div className="coach-tip"><b>Next improvement</b><p>{feedback.next}</p></div></> : <div className="empty feedback-empty"><h3>Your feedback appears here</h3><p>After each answer, VoiceCoach evaluates structure, clarity, relevance, and depth.</p></div>}</aside>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
