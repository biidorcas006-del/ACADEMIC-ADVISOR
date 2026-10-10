import { canRegister, computeEligibility, deadlinePassed, feeBalance, totalCredits } from './rules'

// The "AI" here is a rule-based advisor so it works offline and never invents facts.
// level: 'error' (wrong, must fix), 'warn' (needs attention), 'ok' (fine)
// To add a real LLM later, send `buildSnapshot(state)` to YOUR backend endpoint
// and let the server call the AI. Never put an AI API key in React.

export function reviewStudent({ student, config, units, registrations, fees, issues }) {
  const findings = []
  const codes = registrations.map((r) => r.code)
  const credits = totalCredits(codes, units)

  if (deadlinePassed(config)) {
    findings.push({ level: 'warn', text: 'The registration deadline has passed. Changes now need an issue report.' })
  }
  if (registrations.length === 0) {
    findings.push({ level: 'error', text: 'You have not registered any units.', action: 'Go to Unit registration and add your units.' })
  }
  if (credits > config.maxCredits) {
    findings.push({ level: 'error', text: `You are over the credit limit (${credits}/${config.maxCredits}).`, action: 'Drop a unit that is still pending.' })
  } else if (registrations.length > 0 && credits < config.minCredits) {
    findings.push({ level: 'warn', text: `You are below the minimum credits (${credits}/${config.minCredits}).`, action: 'Register more units.' })
  }

  // Clash and programme checks against what is already registered
  registrations.forEach((r) => {
    const unit = units.find((u) => u.code === r.code)
    if (!unit) return
    const others = registrations.filter((x) => x.code !== r.code)
    const res = canRegister({ ...unit, code: unit.code + '*' }, others, units, student, { ...config, registrationDeadline: '2999-12-31' })
    if (!res.ok && res.reason.startsWith('Time clash')) {
      findings.push({ level: 'error', text: `${unit.code}: ${res.reason}`, action: 'Drop one of the clashing units if it is pending.' })
    }
  })

  const pending = registrations.filter((r) => r.status === 'Pending')
  if (pending.length) {
    findings.push({ level: 'warn', text: `${pending.length} unit(s) are waiting for approval: ${pending.map((p) => p.code).join(', ')}.` })
  }

  if (feeBalance(fees) > 0 && !fees.cleared) {
    findings.push({ level: 'error', text: 'Your fee requirement is not met, so your exam card is blocked.', action: 'Contact Finance and pay or confirm your balance.' })
  }

  const elig = computeEligibility(registrations, fees)
  if (elig.eligible) findings.push({ level: 'ok', text: 'You are eligible for exams. Your exam card is available.' })

  const open = issues.filter((i) => i.status !== 'Resolved')
  if (open.length) findings.push({ level: 'warn', text: `You have ${open.length} open issue(s) being handled.` })

  if (findings.every((f) => f.level === 'ok')) findings.push({ level: 'ok', text: 'No problems found in your registration or fees.' })
  return findings
}

// Simple question answering from the student's own data.
export function askAdvisor(question, state) {
  const q = question.toLowerCase()
  const elig = computeEligibility(state.registrations, state.fees)

  if (/block|exam card|eligib|why/.test(q)) {
    return elig.eligible
      ? 'You are eligible. Your units are approved and your fees are cleared, so your exam card is available.'
      : 'You are blocked because: ' + elig.reasons.join(' ')
  }
  if (/fee|balance|pay/.test(q)) {
    return fee(state)
  }
  if (/regist|unit|drop|add/.test(q)) {
    const list = state.registrations.map((r) => `${r.code} (${r.status})`).join(', ') || 'none yet'
    return `Your registered units: ${list}. Add or drop pending units on the Unit registration page before the deadline (${state.config.registrationDeadline}).`
  }
  if (/mark|result|missing|cat/.test(q)) {
    return 'Results show only after the Registrar publishes them. If a mark is missing, use Report an issue, choose Missing marks, and pick the unit. It goes to the lecturer and you can track it under My issues.'
  }
  if (/deadline/.test(q)) {
    return `The registration deadline is ${state.config.registrationDeadline}.`
  }
  return 'I can help with registration, fees, exam eligibility, results and issues. Try: "Why am I blocked?"'
}

function fee(state) {
  const bal = feeBalance(state.fees)
  return bal > 0
    ? `Your recorded fee balance is KES ${bal.toLocaleString('en-KE')}. Clearance is confirmed by Finance, so contact them after paying.`
    : 'Your recorded balance is zero. If you are still blocked, Finance must confirm your clearance.'
}
