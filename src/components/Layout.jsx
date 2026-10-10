import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStudent } from '../store/StudentContext'

const links = [
  ['/', 'Dashboard'],
  ['/registration', 'Unit registration'],
  ['/fees', 'Fee status'],
  ['/eligibility', 'Exam eligibility'],
  ['/results', 'Results'],
  ['/issues', 'Issues'],
  ['/notifications', 'Notifications'],
  ['/assistant', 'AI Assistant'],
  ['/profile', 'Profile'],
]

export default function Layout() {
  const { student, notifications, logout } = useStudent()
  const nav = useNavigate()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Results Portal</div>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => 'nav' + (isActive ? ' on' : '')}>
              {label}
              {label === 'Notifications' && unread > 0 && <span className="count">{unread}</span>}
            </NavLink>
          ))}
        </nav>
        <button className="nav logout" onClick={() => { logout(); nav('/login') }}>Log out</button>
      </aside>
      <main className="content">
        <div className="topbar">
          <div>
            <div className="title">Welcome, {student.name}</div>
            <div className="muted">{student.regNo} · {student.programme}</div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
