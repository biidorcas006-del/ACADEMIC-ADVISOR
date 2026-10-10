// SAMPLE DATA ONLY. Replace with real data from your backend (see src/store/StudentContext.jsx).

export const config = {
  academicYear: '2026/2027',
  semester: 1,
  registrationDeadline: '2026-11-30',
  minCredits: 12,
  maxCredits: 24,
}

export const student = {
  name: '[Student name]',
  regNo: '[REG/0000/2024]',
  programme: 'BSc Computer Science',
  year: 2,
  email: '[student@example.com]',
  phone: '[07XX XXX XXX]',
}

// Units offered this semester for the student's programme.
export const offeredUnits = [
  { code: 'COMP204', name: 'Database Management', credits: 3, slot: 'Mon 8-10', programme: 'BSc Computer Science' },
  { code: 'COMP212', name: 'Systems Analysis', credits: 3, slot: 'Tue 10-12', programme: 'BSc Computer Science' },
  { code: 'COMP113', name: 'Operating Systems', credits: 3, slot: 'Wed 8-10', programme: 'BSc Computer Science' },
  { code: 'MATH240', name: 'Probability and Statistics', credits: 3, slot: 'Thu 2-4', programme: 'BSc Computer Science' },
  { code: 'COMP220', name: 'Web Development', credits: 3, slot: 'Fri 8-10', programme: 'BSc Computer Science' },
  { code: 'COMP230', name: 'Computer Networks', credits: 3, slot: 'Mon 8-10', programme: 'BSc Computer Science' }, // clashes with COMP204
  { code: 'COMP240', name: 'Software Engineering', credits: 3, slot: 'Tue 2-4', programme: 'BSc Computer Science' },
]

export const initialRegistrations = [
  { code: 'COMP204', status: 'Approved' },
  { code: 'COMP212', status: 'Approved' },
  { code: 'COMP113', status: 'Approved' },
  { code: 'MATH240', status: 'Pending' },
]

// Finance sets "cleared". Amounts are sample figures.
export const initialFees = {
  billed: 50000,
  paid: 30000,
  cleared: false,
  payments: [{ date: '2026-09-05', amount: 30000, ref: '[PAYMENT REF]' }],
}

// Marks stay hidden until the Registrar publishes them (published: true).
export const initialResults = [
  { code: 'COMP204', name: 'Database Management', cat: 25, exam: 61, published: false },
  { code: 'COMP212', name: 'Systems Analysis', cat: 20, exam: 45, published: false },
  { code: 'COMP113', name: 'Operating Systems', cat: 22, exam: 50, published: false },
  { code: 'MATH240', name: 'Probability and Statistics', cat: 18, exam: 40, published: false },
]

export const initialIssues = [
  { id: 1, type: 'Missing marks', code: 'COMP212', description: 'My CAT mark is not showing.', status: 'With lecturer', owner: 'Lecturer', date: '2026-10-02' },
]

export const initialNotifications = [
  { id: 1, text: 'Registration for COMP204 was approved.', date: '2026-10-01', read: false },
  { id: 2, text: 'Your issue about COMP212 was sent to the lecturer.', date: '2026-10-02', read: false },
]
