import { useState } from 'react'
import { useStudent } from '../store/StudentContext'

export default function Profile() {
  const { student } = useStudent()
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [msg, setMsg] = useState(null)

  const change = (e) => {
    e.preventDefault()
    if (pw.next.length < 8) return setMsg({ level: 'r', text: 'New password must be at least 8 characters.' })
    if (pw.next !== pw.confirm) return setMsg({ level: 'r', text: 'Passwords do not match.' })
    // Real password changes must be sent to the server.
    setMsg({ level: 'g', text: 'Demo only: connect this form to your backend.' })
  }

  return (
    <>
      <h2>Profile</h2>
      <div className="card">
        <div className="line"><span>Name</span><strong>{student.name}</strong></div>
        <div className="line"><span>Registration number</span><strong>{student.regNo}</strong></div>
        <div className="line"><span>Programme</span><strong>{student.programme}</strong></div>
        <div className="line"><span>Year</span><strong>{student.year}</strong></div>
        <div className="line"><span>Email</span><strong>{student.email}</strong></div>
        <div className="line"><span>Phone</span><strong>{student.phone}</strong></div>
      </div>
      <form className="card form" onSubmit={change}>
        <h3>Change password</h3>
        <label htmlFor="c">Current password</label>
        <input id="c" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
        <label htmlFor="n">New password</label>
        <input id="n" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
        <label htmlFor="cf">Confirm new password</label>
        <input id="cf" type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
        {msg && <div className={'alert ' + msg.level} role="status">{msg.text}</div>}
        <button className="btn primary" type="submit">Update password</button>
      </form>
    </>
  )
}
