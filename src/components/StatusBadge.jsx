// Always shows a word, never colour alone.
const map = {
  Approved: 'g', Complete: 'g', Eligible: 'g', Done: 'g', Pass: 'g', Resolved: 'g', Cleared: 'g', Published: 'g',
  Pending: 'o', Warning: 'o', 'With lecturer': 'o', Open: 'o', 'Not yet published': 'o',
  Blocked: 'r', 'Not met': 'r', Missing: 'r', Fail: 'r',
}
export default function StatusBadge({ children }) {
  return <span className={'badge ' + (map[children] || 'o')}>{children}</span>
}
