// Business rules for the student part.
// IMPORTANT: these run in the browser only to give instant feedback.
// Your backend MUST repeat every rule, otherwise a student can bypass the screen.

export function totalCredits(codes, units) {
  return codes.reduce((sum, c) => sum + (units.find((u) => u.code === c)?.credits || 0), 0)
}

export function deadlinePassed(config, today = new Date()) {
  return today > new Date(config.registrationDeadline + 'T23:59:59')
}

// Can the student add this unit? Returns { ok, reason }.
export function canRegister(unit, registrations, units, student, config) {
  if (deadlinePassed(config)) return { ok: false, reason: 'Registration deadline has passed.' }
  if (unit.programme !== student.programme) return { ok: false, reason: 'This unit is not in your programme.' }
  if (registrations.some((r) => r.code === unit.code)) return { ok: false, reason: 'You already registered this unit.' }

  const current = registrations.map((r) => r.code)
  if (totalCredits(current, units) + unit.credits > config.maxCredits)
    return { ok: false, reason: `Adding this unit goes over the maximum of ${config.maxCredits} credits.` }

  const clash = registrations
    .map((r) => units.find((u) => u.code === r.code))
    .find((u) => u && u.slot === unit.slot)
  if (clash) return { ok: false, reason: `Time clash with ${clash.code} (${clash.slot}).` }

  return { ok: true, reason: '' }
}

// Can the student drop this unit?
export function canDrop(registration, config) {
  if (deadlinePassed(config)) return { ok: false, reason: 'Registration deadline has passed.' }
  if (registration.status === 'Approved') return { ok: false, reason: 'Approved units cannot be dropped here. Report an issue instead.' }
  return { ok: true, reason: '' }
}

export function feeBalance(fees) {
  return Math.max(fees.billed - fees.paid, 0)
}

// Exam eligibility: units registered, all approved, fees cleared.
export function computeEligibility(registrations, fees) {
  const registered = registrations.length > 0
  const approved = registered && registrations.every((r) => r.status === 'Approved')
  const feesCleared = fees.cleared === true

  const checks = [
    { label: 'Units registered', pass: registered, fix: 'Register your units on the Unit registration page.' },
    { label: 'Units approved', pass: approved, fix: 'Wait for approval, or contact your department if it is delayed.' },
    { label: 'Fee requirement', pass: feesCleared, fix: 'Fee clearance is missing. Contact Finance, then check again.' },
  ]
  const failed = checks.filter((c) => !c.pass)
  return { eligible: failed.length === 0, checks, reasons: failed.map((c) => c.fix) }
}

export function gradeFor(total) {
  if (total >= 70) return 'A'
  if (total >= 60) return 'B'
  if (total >= 50) return 'C'
  if (total >= 40) return 'D'
  return 'E'
}

export function formatKES(n) {
  return 'KES ' + Number(n).toLocaleString('en-KE')
}
