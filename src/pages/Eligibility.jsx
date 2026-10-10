import { useStudent } from '../store/StudentContext'
import { computeEligibility } from '../utils/rules'
import StatusBadge from '../components/StatusBadge'

export default function Eligibility() {
  const { student, config, units, registrations, fees } = useStudent()
  const elig = computeEligibility(registrations, fees)

  return (
    <>
      <h2>Exam eligibility</h2>
      <div className="card">
        {elig.checks.map((c) => (
          <div className="line" key={c.label}>
            <span>{c.label}</span>
            <StatusBadge>{c.pass ? 'Done' : 'Not met'}</StatusBadge>
          </div>
        ))}
        <div className="line"><strong>Exam status</strong><StatusBadge>{elig.eligible ? 'Eligible' : 'Blocked'}</StatusBadge></div>
        {!elig.eligible && (
          <div className="alert r">
            <strong>Why am I blocked?</strong>
            <ul>{elig.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
        )}
      </div>

      {elig.eligible ? (
        <div className="card exam-card" id="exam-card">
          <h3>Exam card</h3>
          <p><strong>{student.name}</strong> · {student.regNo}</p>
          <p>{student.programme} · Year {student.year} · {config.academicYear} Semester {config.semester}</p>
          <ul>
            {registrations.map((r) => {
              const u = units.find((x) => x.code === r.code)
              return <li key={r.code}>{r.code} {u?.name}</li>
            })}
          </ul>
          <button className="btn primary no-print" onClick={() => window.print()}>Print exam card</button>
        </div>
      ) : (
        <p className="muted">Your exam card unlocks when every check above is done.</p>
      )}
    </>
  )
}
