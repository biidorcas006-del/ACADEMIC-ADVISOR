import { useState } from 'react'
import { useStudent } from '../store/StudentContext'
import { askAdvisor } from '../utils/aiAdvisor'
import AIPanel from '../components/AIPanel'

const suggestions = ['Why am I blocked?', 'What is my fee balance?', 'What units am I registered for?', 'My marks are missing']

export default function Assistant() {
  const state = useStudent()
  const [q, setQ] = useState('')
  const [chat, setChat] = useState([{ from: 'ai', text: 'Hello. Ask me about registration, fees, exams or results.' }])

  const ask = (text) => {
    if (!text.trim()) return
    // To use a real AI, send `text` to your backend and show its reply here.
    setChat((c) => [...c, { from: 'me', text }, { from: 'ai', text: askAdvisor(text, state) }])
    setQ('')
  }

  return (
    <>
      <h2>AI Assistant</h2>
      <AIPanel />
      <div className="card">
        <h3>Ask for advice</h3>
        <div className="chips">
          {suggestions.map((s) => <button key={s} className="btn ghost sm" onClick={() => ask(s)}>{s}</button>)}
        </div>
        <div className="chat" aria-live="polite">
          {chat.map((m, i) => <div key={i} className={'bubble ' + m.from}>{m.text}</div>)}
        </div>
        <form className="chatform" onSubmit={(e) => { e.preventDefault(); ask(q) }}>
          <label htmlFor="q" className="sr">Your question</label>
          <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type your question" />
          <button className="btn primary" type="submit">Send</button>
        </form>
        <p className="muted small">The assistant explains and warns. It cannot approve or change anything.</p>
      </div>
    </>
  )
}
