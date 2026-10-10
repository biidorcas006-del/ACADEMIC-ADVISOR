import { Link } from 'react-router-dom'
import { useStudent } from '../store/StudentContext'
import { computeEligibility } from '../utils/rules'
import StatusBadge from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'

export default function Dashboard() {
  const { config, registrations, fees, results } = useStudent()
  const elig = computeEligibility(registrations, fees)
  const allApproved = registrations.length > 0 && registrations.every((r) => r.status === 'Approved')
  const anyPublished = results.some((r) => r.published)

  return (
    <>
      <p className="muted">Academic year {config.academicYear} · Semester {config.semester}</p>
      <AIPanel compact />
      <div className="grid4">
        <div className="card"><div className="muted small">Registration</div><StatusBadge>{allApproved ? 'Complete' : 'Pending'}</StatusBadge></div>
        <div className="card"><div className="muted small">Fees</div><StatusBadge>{fees.cleared ? 'Cleared' : 'Pending'}</StatusBadge></div>
        <div className="card"><div className="muted small">Exam eligibility</div><StatusBadge>{elig.eligible ? 'Eligible' : 'Blocked'}</StatusBadge></div>
        <div className="card"><div className="muted small">Results</div><StatusBadge>{anyPublished ? 'Published' : 'Not yet published'}</StatusBadge></div>
      </div>
      <div className="grid2">
        <div className="card">
          <h3>Why am I blocked?</h3>
          {elig.checks.map((c) => (
            <div className="line" key={c.label}><span>{c.label}</span><StatusBadge>{c.pass ? 'Done' : 'Not met'}</StatusBadge></div>
          ))}
          {!elig.eligible && <p className="small">{elig.reasons[0]}</p>}
          <div className="actions">
            <Link className="btn primary" to="/fees">View fee status</Link>
            <Link className="btn ghost" to="/issues">Report an issue</Link>
          </div>
        </div>
        <div className="card">
          <h3>Registered units</h3>
          {registrations.length === 0 && <p className="muted">No units registered yet.</p>}
          {registrations.map((r) => (
            <div className="line" key={r.code}><strong>{r.code}</strong><StatusBadge>{r.status}</StatusBadge></div>
          ))}
        </div>
      </div>
    </>
  )
}
