import { useStudent } from '../store/StudentContext'
import { gradeFor } from '../utils/rules'
import StatusBadge from '../components/StatusBadge'

export default function Results() {
  const { results } = useStudent()
  return (
    <>
      <h2>Results</h2>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Unit</th><th>CAT /30</th><th>Exam /70</th><th>Total</th><th>Grade</th></tr></thead>
            <tbody>
              {results.map((r) => {
                if (!r.published) {
                  return (
                    <tr key={r.code}>
                      <td><strong>{r.code}</strong> {r.name}</td>
                      <td colSpan={4}><StatusBadge>Not yet published</StatusBadge></td>
                    </tr>
                  )
                }
                const total = r.cat + r.exam
                return (
                  <tr key={r.code}>
                    <td><strong>{r.code}</strong> {r.name}</td>
                    <td>{r.cat}</td><td>{r.exam}</td><td>{total}</td><td>{gradeFor(total)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="muted small">Marks appear only after the Registrar publishes them. Mark missing? Go to Issues.</p>
    </>
  )
}
