import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudent } from '../store/StudentContext'

export default function Login() {
  const { login } = useStudent()
  const nav = useNavigate()
  const [regNo, setRegNo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const res = login(regNo, password)
    if (res.ok) nav('/')
    else setError(res.reason)
  }

  return (
    <div className="login-wrap">
      <form className="card login" onSubmit={submit}>
        <h2>Student login</h2>
        <p className="muted small">Demo mode: any registration number and password will work.</p>
        <label htmlFor="reg">Registration number</label>
        <input id="reg" value={regNo} onChange={(e) => setRegNo(e.target.value)} autoComplete="username" />
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        {error && <div className="alert r">{error}</div>}
        <button className="btn primary" type="submit">Log in</button>
        <a href="#/login" className="small">Forgot password?</a>
      </form>
    </div>
  )
}
