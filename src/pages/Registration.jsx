import { useState } from 'react'
import { useStudent } from '../store/StudentContext'
import { canDrop, canRegister, deadlinePassed, totalCredits } from '../utils/rules'
import StatusBadge from '../components/StatusBadge'

export default function Registration() {
  const { units, registrations, student, config, registerUnit, dropUnit } = useStudent()
  const [msg, setMsg] = useState(null)
  const credits = totalCredits(registrations.map((r) => r.code), units)

  const run = (fn, code) => {
    const res = fn(code)
    setMsg(res.ok ? { level: 'g', text: 'Done.' } : { level: 'r', text: res.reason })
  }

  return (
    <>
      <h2>Unit registration</h2>
      <p className="muted">
        Deadline: {config.registrationDeadline} {deadlinePassed(config) && <strong>(closed)</strong>} · Credits: {credits}/{config.maxCredits} (minimum {config.minCredits})
      </p>
      {msg && <div className={'alert ' + msg.level} role="status"><strong>AI check: </strong>{msg.text}</div>}

      <div className="card">
        <h3>Available units</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Code</th><th>Unit</th><th>Credits</th><th>Time</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {units.map((u) => {
                const reg = registrations.find((r) => r.code === u.code)
                const add = canRegister(u, registrations, units, student, config)
                const drop = reg ? canDrop(reg, config) : null
                return (
                  <tr key={u.code}>
                    <td><strong>{u.code}</strong></td>
                    <td>{u.name}</td>
                    <td>{u.credits}</td>
                    <td>{u.slot}</td>
                    <td>{reg ? <StatusBadge>{reg.status}</StatusBadge> : <span className="muted">Not registered</span>}</td>
                    <td>
                      {!reg && (
                        <button className="btn primary sm" onClick={() => run(registerUnit, u.code)} aria-disabled={!add.ok} title={add.ok ? '' : add.reason}>Add</button>
                      )}
                      {reg && (
                        <button className="btn ghost sm" onClick={() => run(dropUnit, u.code)} aria-disabled={!drop.ok} title={drop.ok ? '' : drop.reason}>Drop</button>
                      )}
                      {!reg && !add.ok && <div className="small hint">{add.reason}</div>}
                      {reg && !drop.ok && <div className="small hint">{drop.reason}</div>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="muted small">New units start as Pending until your department approves them.</p>
    </>
  )
}
