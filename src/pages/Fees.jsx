import { Link } from 'react-router-dom'
import { useStudent } from '../store/StudentContext'
import { feeBalance, formatKES } from '../utils/rules'
import StatusBadge from '../components/StatusBadge'

export default function Fees() {
  const { fees } = useStudent()
  return (
    <>
      <h2>Fee status</h2>
      <p className="muted small">Sample figures. Clearance is confirmed by Finance, not by this page.</p>
      <div className="grid4">
        <div className="card"><div className="muted small">Billed</div><div className="big">{formatKES(fees.billed)}</div></div>
        <div className="card"><div className="muted small">Paid</div><div className="big">{formatKES(fees.paid)}</div></div>
        <div className="card"><div className="muted small">Balance</div><div className="big">{formatKES(feeBalance(fees))}</div></div>
        <div className="card"><div className="muted small">Exam clearance</div><StatusBadge>{fees.cleared ? 'Cleared' : 'Blocked'}</StatusBadge></div>
      </div>
      <div className="card">
        <h3>Payments recorded</h3>
        {fees.payments.length === 0 && <p className="muted">No payments recorded.</p>}
        {fees.payments.map((p, i) => (
          <div className="line" key={i}><span>{p.date} · {p.ref}</span><strong>{formatKES(p.amount)}</strong></div>
        ))}
        {!fees.cleared && (
          <p className="small">Paid but still blocked? <Link to="/issues">Report a fee problem</Link>.</p>
        )}
      </div>
    </>
  )
}
