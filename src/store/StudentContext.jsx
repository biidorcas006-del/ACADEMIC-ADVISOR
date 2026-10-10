import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  config, student, offeredUnits, initialRegistrations, initialFees,
  initialResults, initialIssues, initialNotifications,
} from '../data/mockData'
import { canDrop, canRegister } from '../utils/rules'

// All data access lives here. To connect a real backend (Django, Supabase, etc.),
// replace the initial values with fetch calls and make each action call your API.
// The server must re-check every rule and write an audit log entry.

const Ctx = createContext(null)
export const useStudent = () => useContext(Ctx)

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

export function StudentProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(() => load('sp_loggedIn', false))
  const [registrations, setRegistrations] = useState(() => load('sp_regs', initialRegistrations))
  const [fees] = useState(initialFees)
  const [results] = useState(initialResults)
  const [issues, setIssues] = useState(() => load('sp_issues', initialIssues))
  const [notifications, setNotifications] = useState(() => load('sp_notes', initialNotifications))

  useEffect(() => { try { localStorage.setItem('sp_loggedIn', JSON.stringify(loggedIn)) } catch {} }, [loggedIn])
  useEffect(() => { try { localStorage.setItem('sp_regs', JSON.stringify(registrations)) } catch {} }, [registrations])
  useEffect(() => { try { localStorage.setItem('sp_issues', JSON.stringify(issues)) } catch {} }, [issues])
  useEffect(() => { try { localStorage.setItem('sp_notes', JSON.stringify(notifications)) } catch {} }, [notifications])

  const today = () => new Date().toISOString().slice(0, 10)
  const notify = (text) =>
    setNotifications((n) => [{ id: Date.now(), text, date: today(), read: false }, ...n])

  const value = useMemo(() => ({
    student, config, units: offeredUnits, registrations, fees, results, issues, notifications, loggedIn,

    login: (regNo, password) => {
      // DEMO ONLY. Real login must be checked by the server.
      if (regNo.trim() && password.trim()) { setLoggedIn(true); return { ok: true } }
      return { ok: false, reason: 'Enter your registration number and password.' }
    },
    logout: () => setLoggedIn(false),

    registerUnit: (code) => {
      const unit = offeredUnits.find((u) => u.code === code)
      const check = canRegister(unit, registrations, offeredUnits, student, config)
      if (!check.ok) return check
      setRegistrations((r) => [...r, { code, status: 'Pending' }])
      notify(`You registered ${code}. It is waiting for approval.`)
      return { ok: true }
    },

    dropUnit: (code) => {
      const reg = registrations.find((r) => r.code === code)
      const check = canDrop(reg, config)
      if (!check.ok) return check
      setRegistrations((r) => r.filter((x) => x.code !== code))
      notify(`You dropped ${code}.`)
      return { ok: true }
    },

    addIssue: ({ type, code, description }) => {
      if (!description.trim()) return { ok: false, reason: 'Please describe the problem.' }
      const owner = type === 'Missing marks' ? 'Lecturer' : type === 'Fee problem' ? 'Finance' : 'Department'
      setIssues((i) => [{ id: Date.now(), type, code, description, status: 'Open', owner, date: today() }, ...i])
      notify(`Your ${type.toLowerCase()} report was sent to ${owner}.`)
      return { ok: true }
    },

    markAllRead: () => setNotifications((n) => n.map((x) => ({ ...x, read: true }))),
  }), [registrations, fees, results, issues, notifications, loggedIn])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
