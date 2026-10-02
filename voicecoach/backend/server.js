import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({limit:'1mb'}))

const modeInstructions = {
  sih: 'Act as a strict but fair Smart India Hackathon judge. Ask one challenging, realistic follow-up at a time. Focus on problem understanding, users, novelty, feasibility, workflow, technology, AI usage, scalability, security, validation, and impact. Do not give away the answer before the student responds.',
  interview: 'Act as a realistic job interviewer. Ask one question at a time. Mix behavioral, project, technical, and follow-up questions according to the answer. Challenge vague answers naturally.',
  presentation: 'Act as a realistic evaluator/audience member. Listen to the presentation, identify unclear claims, then ask focused follow-up questions. Evaluate structure, clarity, confidence, relevance, and technical depth.',
  feelings: 'Act as a supportive conversational companion. Listen carefully, reflect what the user said, ask gentle open questions, and help them organize their thoughts. Do not diagnose or pretend to be a therapist.'
}

function buildPrompt(mode, topic, history) {
  return `You are VoiceCoach. ${modeInstructions[mode] || modeInstructions.interview}\nSession topic: ${topic || 'general'}\n\nConversation so far:\n${history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}\n\nRespond in a natural spoken style, usually 1-3 short paragraphs. End with exactly one next question unless the mode is feelings and a question would be inappropriate. Then give a compact coaching score from 1-10 and feedback. Return JSON with keys: reply (string), feedback ({score:number,title:string,summary:string,next:string}).`;
}

app.post('/api/respond', async (req,res)=>{
  try {
    if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:'OPENAI_API_KEY is not configured.'})
    const {mode='interview',topic='',history=[]}=req.body
    const prompt=buildPrompt(mode,topic,history)
    const apiRes=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:'gpt-5.6-luna',input:prompt})})
    const data=await apiRes.json()
    if(!apiRes.ok) return res.status(apiRes.status).json({error:data})
    const text=data.output?.map(x=>x.content||[]).flat().map(x=>x.text||'').join('') || data.output_text || ''
    let parsed
    try { parsed=JSON.parse(text) } catch { parsed={reply:text,feedback:{score:5,title:'Good start',summary:'Keep developing the answer with more specific evidence.',next:'Can you explain that with one concrete example?'}} }
    res.json(parsed)
  } catch(e){ res.status(500).json({error:e.message}) }
})

app.listen(process.env.PORT || 4000, ()=>console.log(`VoiceCoach backend running on ${process.env.PORT || 4000}`))
