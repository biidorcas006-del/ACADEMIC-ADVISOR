import { useStudent } from '../store/StudentContext'

export default function Notifications() {
  const { notifications, markAllRead } = useStudent()
  return (
    <>
      <div className="row-between">
        <h2>Notifications</h2>
        <button className="btn ghost sm" onClick={markAllRead}>Mark all as read</button>
      </div>
      <div className="card">
        {notifications.length === 0 && <p className="muted">No notifications.</p>}
        {notifications.map((n) => (
          <div className="line" key={n.id}>
            <span>{!n.read && <strong>New · </strong>}{n.text}</span>
            <span className="small muted">{n.date}</span>
          </div>
        ))}
      </div>
    </>
  )
}
