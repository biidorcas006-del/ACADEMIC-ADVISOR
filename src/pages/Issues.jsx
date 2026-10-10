import { useState } from 'react'
import { useStudent } from '../store/StudentContext'
import StatusBadge from '../components/StatusBadge'

const types = ['Missing marks', 'Registration problem', 'Fee problem']

export default function Issues() {
  const { registrations, issues, addIssue } = useStudent()
  const [type, setType] = useState(types[0])
  const [code, setCode] = useState(registrations[0]?.code || '')
  const [description, setDescription] = useState('')
  const [msg, setMsg] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    const res = addIssue({ type, code, description })
    if (res.ok) { setDescription(''); setMsg({ level: 'g', text: 'Your report was sent. Track it below.' }) }
    else setMsg({ level: 'r', text: res.reason })
  }

  return (
    <>
      <h2>Report an issue</h2>
      <form className="card form" onSubmit={submit}>
        <label htmlFor="type">Type of problem</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>{types.map((t) => <option key={t}>{t}</option>)}</select>
        <label htmlFor="unit">Unit</label>
        <select id="unit" value={code} onChange={(e) => setCode(e.target.value)}>
          {registrations.map((r) => <option key={r.code}>{r.code}</option>)}
          <option value="">Not about a unit</option>
        </select>
        <label htmlFor="desc">What is wrong?</label>
        <textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        {msg && <div className={'alert ' + msg.level} role="status">{msg.text}</div>}
        <button className="btn primary" type="submit">Send report</button>
      </form>

      <h3>My issues</h3>
      <div className="card">
        {issues.length === 0 && <p className="muted">No issues reported.</p>}
        {issues.map((i) => (
          <div className="line" key={i.id}>
            <div>
              <strong>{i.type}</strong> {i.code && <span>· {i.code}</span>}
              <div className="small muted">{i.description}</div>
              <div className="small muted">{i.date} · With {i.owner}</div>
            </div>
            <StatusBadge>{i.status}</StatusBadge>
          </div>
        ))}
      </div>
    </>
  )
}
