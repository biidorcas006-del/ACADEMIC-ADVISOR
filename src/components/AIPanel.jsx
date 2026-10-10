import { Link } from 'react-router-dom'
import { useStudent } from '../store/StudentContext'
import { reviewStudent } from '../utils/aiAdvisor'

// Shows what the AI found. Used on the dashboard and other pages.
export default function AIPanel({ compact = false }) {
  const state = useStudent()
  const findings = reviewStudent(state)
  const shown = compact ? findings.filter((f) => f.level !== 'ok').slice(0, 2) : findings

  return (
    <div className="card ai">
      <div className="row-between wrap">
        <div>
          <h3>AI Assistant is checking your records</h3>
          <p className="muted small">It tells you when something is wrong and how to fix it. It only advises. The system rules decide.</p>
        </div>
        <div className="stack">
          <Link to="/assistant" className="btn primary">Ask AI for advice</Link>
        </div>
      </div>
      {shown.length === 0 && <div className="alert g">No problems found.</div>}
      {shown.map((f, i) => (
        <div key={i} className={'alert ' + (f.level === 'error' ? 'r' : f.level === 'warn' ? 'o' : 'g')}>
          <strong>{f.level === 'error' ? 'Needs fixing: ' : f.level === 'warn' ? 'Note: ' : 'OK: '}</strong>
          {f.text} {f.action && <span className="muted-dark">{f.action}</span>}
        </div>
      ))}
    </div>
  )
}
