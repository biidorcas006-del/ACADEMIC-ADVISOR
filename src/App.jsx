import { Navigate, Route, Routes } from 'react-router-dom'
import { useStudent } from './store/StudentContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Registration from './pages/Registration'
import Fees from './pages/Fees'
import Eligibility from './pages/Eligibility'
import Results from './pages/Results'
import Issues from './pages/Issues'
import Notifications from './pages/Notifications'
import Assistant from './pages/Assistant'
import Profile from './pages/Profile'

function Protected({ children }) {
  const { loggedIn } = useStudent()
  return loggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/results" element={<Results />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
