/* seed-data.js — Realistic demo records for SraswatiLibrary
   These seed the frontend demo store when localStorage is empty. All data
   is demo-only. No real passwords or secrets are stored here. */

const SEED_VERSION = '1.0.0';

function hashDemoPassword(pw) {
  // Demo-only placeholder. Production uses Argon2id/bcrypt server-side.
  return pw;
}

const DEMO_USERS = [
  { id: 'usr_sa', name: 'Super Admin', email: 'superadmin@sraswatilibrary.example', role: 'superadmin', roleId: 'role_superadmin', status: 'active', demoPassword: 'admin1234', createdAt: new Date().toISOString() },
  { id: 'usr_adm1', name: 'Library Admin', email: 'admin@sraswatilibrary.example', role: 'admin', roleId: 'role_admin', status: 'active', demoPassword: 'admin1234', createdAt: new Date().toISOString() },
  { id: 'usr_lib1', name: 'Anita Rao', email: 'anita@sraswatilibrary.example', role: 'librarian', roleId: 'role_librarian', status: 'active', demoPassword: 'librarian1234', createdAt: new Date().toISOString() },
  { id: 'usr_stu1', name: 'Riya Patel', email: 'riya@student.example', role: 'student', roleId: 'role_student', status: 'active', demoPassword: 'student1234', createdAt: new Date().toISOString(), membershipPlan: 'plan_std' },
  { id: 'usr_stu2', name: 'Rahul Sharma', email: 'rahul@student.example', role: 'student', roleId: 'role_student', status: 'active', demoPassword: 'student1234', createdAt: new Date().toISOString() },
  { id: 'usr_stu3', name: 'Priya Verma', email: 'priya@student.example', role: 'student', roleId: 'role_student', status: 'active', demoPassword: 'student1234', createdAt: new Date().toISOString() },
  { id: 'usr_disabled', name: 'Disabled User', email: 'disabled@student.example', role: 'student', roleId: 'role_student', status: 'disabled', demoPassword: 'disabled1234', createdAt: new Date().toISOString() },
];

const DEMO_ROLES = [
  { id: 'role_superadmin', name: 'Superadmin', description: 'Full system control', permCount: 25 },
  { id: 'role_admin', name: 'Admin', description: 'Library operations', permCount: 16 },
  { id: 'role_librarian', name: 'Librarian', description: 'Daily operations', permCount: 9 },
  { id: 'role_student', name: 'Student', description: 'Self-service portal', permCount: 8 },
];

const DEMO_CATEGORIES = [
  { id: 'cat_1', name: 'Computing' },
  { id: 'cat_2', name: 'History' },
  { id: 'cat_3', name: 'Science' },
  { id: 'cat_4', name: 'Self-help' },
  { id: 'cat_5', name: 'Biography' },
  { id: 'cat_6', name: 'Literature' },
];

const DEMO_BOOKS = [
  { id: 'bk_1', title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', isbn: '9781118063330', category: 'Computing', publisher: 'Wiley', edition: '10th', publishedYear: '2018', totalCopies: 5, cover: '#7A3F33', archived: false },
  { id: 'bk_2', title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', category: 'Computing', publisher: 'Prentice Hall', edition: '1st', publishedYear: '2008', totalCopies: 4, cover: '#3E5C6B', archived: false },
  { id: 'bk_3', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', isbn: '9780262046305', category: 'Computing', publisher: 'MIT Press', edition: '4th', publishedYear: '2022', totalCopies: 3, cover: '#4A5B45', archived: false },
  { id: 'bk_4', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781491903063', category: 'Computing', publisher: "O'Reilly", edition: '1st', publishedYear: '2017', totalCopies: 2, cover: '#5A3E5E', archived: false },
  { id: 'bk_5', title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316097', category: 'History', publisher: 'Harper', edition: '1st', publishedYear: '2014', totalCopies: 3, cover: '#6B4A2E', archived: false },
  { id: 'bk_6', title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292', category: 'Self-help', publisher: 'Avery', edition: '1st', publishedYear: '2018', totalCopies: 4, cover: '#5A3E5E', archived: false },
  { id: 'bk_7', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', category: 'Science', publisher: 'Bantam', edition: '10th', publishedYear: '1998', totalCopies: 2, cover: '#26405A', archived: false },
  { id: 'bk_8', title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', isbn: '9789351461986', category: 'Biography', publisher: 'Universities Press', edition: '1st', publishedYear: '1999', totalCopies: 3, cover: '#3C5A4B', archived: false },
  { id: 'bk_9', title: 'The Pragmatic Programmer', author: 'Hunt, Thomas', isbn: '9780135957059', category: 'Computing', publisher: 'Addison-Wesley', edition: '2nd', publishedYear: '2019', totalCopies: 2, cover: '#2F4A5C', archived: false },
  { id: 'bk_10', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', isbn: '9780073523323', category: 'Computing', publisher: 'McGraw-Hill', edition: '7th', publishedYear: '2019', totalCopies: 3, cover: '#3C5A5E', archived: false },
];

const DEMO_COPIES = [];
let copyNo = 0;
DEMO_BOOKS.forEach((b) => {
  for (let i = 0; i < b.totalCopies; i++) {
    copyNo++;
    const statuses = ['available', 'available', 'available', 'issued', 'available', 'damaged'];
    DEMO_COPIES.push({ id: 'cp_' + copyNo, bookId: b.id, copyNo: i + 1, status: statuses[i % statuses.length], acquiredAt: new Date().toISOString() });
  }
});

const DEMO_MEMBERSHIP_PLANS = [
  { id: 'plan_std', name: 'Standard', durationDays: 30, price: 300, currency: 'INR', borrowLimit: 3, description: '30-day membership, up to 3 books', active: true },
  { id: 'plan_prem', name: 'Premium', durationDays: 90, price: 750, currency: 'INR', borrowLimit: 6, description: '90-day membership, up to 6 books', active: true },
  { id: 'plan_ann', name: 'Annual', durationDays: 365, price: 2500, currency: 'INR', borrowLimit: 10, description: '1-year membership, up to 10 books', active: true },
];

const DEMO_MEMBERSHIPS = [
  { id: 'mem_1', userId: 'usr_stu1', planId: 'plan_prem', planName: 'Premium', status: 'active', startedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), expiresAt: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(), borrowLimit: 6, amount: 750, paymentMethod: 'razorpay', paymentReference: 'pay_mem_1', activatedAt: new Date().toISOString() },
  { id: 'mem_2', userId: 'usr_stu2', planId: 'plan_std', planName: 'Standard', status: 'active', startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), borrowLimit: 3, amount: 300, paymentMethod: 'manual', paymentReference: 'pay_mem_2', activatedAt: new Date().toISOString() },
  { id: 'mem_3', userId: 'usr_stu3', planId: 'plan_std', planName: 'Standard', status: 'expired', startedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), borrowLimit: 3, amount: 300, paymentMethod: 'manual', paymentReference: 'pay_mem_3' },
];

const DEMO_SEATS = [];
const zones = [
  { id: 'zone_gf', name: 'Ground floor', floor: 'Ground floor' },
  { id: 'zone_ff', name: 'First floor', floor: 'First floor' },
];
// Tables: 6 tables x 3 seats x 2 sides = 36 table seats + 8 carrels per zone
zones.forEach((z, zi) => {
  for (let t = 0; t < 6; t++) {
    const cx = ((t % 3) - 1) * 230;
    const cy = t < 3 ? -60 : 110;
    for (let side = 0; side < 2; side++) {
      for (let k = 0; k < 3; k++) {
        const n = side * 3 + k + 1;
        DEMO_SEATS.push({
          id: `st_${zi}_t${t+1}_${n}`,
          seatId: `${z.floor.charAt(0)}${t+1}-${n}`,
          label: `Table ${t + 1} · Seat ${n}`,
          kind: 'table',
          zoneId: z.id, zoneName: z.name, floor: z.floor,
          x: cx + (k - 1) * 50, y: cy + (side === 0 ? -48 : 48),
          accessible: false, status: 'available', archived: false, createdAt: new Date().toISOString(),
        });
      }
    }
  }
  for (let c = 0; c < 8; c++) {
    DEMO_SEATS.push({
      id: `st_${zi}_cr${c+1}`,
      seatId: `${z.floor.charAt(0)}C${c+1}`,
      label: `Carrel ${c + 1}`,
      kind: 'carrel',
      zoneId: z.id, zoneName: z.name, floor: z.floor,
      x: -280 + c * 80, y: zi === 0 ? -190 : 190,
      accessible: c === 0, status: 'available', archived: false, createdAt: new Date().toISOString(),
    });
  }
});

const DEMO_LOANS = [
  { id: 'ln_1', userId: 'usr_stu1', bookId: 'bk_1', copyId: 'cp_4', issuedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), dueAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), returnedAt: null, status: 'active', renewedCount: 0, issuedBy: 'usr_lib1' },
  { id: 'ln_2', userId: 'usr_stu1', bookId: 'bk_2', copyId: 'cp_9', issuedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), dueAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), returnedAt: null, status: 'active', renewedCount: 0, issuedBy: 'usr_lib1' },
  { id: 'ln_3', userId: 'usr_stu1', bookId: 'bk_3', copyId: 'cp_13', issuedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), dueAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(), returnedAt: null, status: 'active', renewedCount: 1, issuedBy: 'usr_lib1' },
];

const DEMO_FINES = [
  { id: 'fn_1', userId: 'usr_stu3', loanId: null, amount: 50, reason: 'Late return: 10 day(s) overdue', status: 'unpaid', createdAt: new Date().toISOString(), paidAt: null, paidBy: null, recordedBy: 'usr_lib1' },
];

const DEMO_BOOKINGS = [
  { id: 'bkng_1', userId: 'usr_stu1', seatId: 'st_0_t1_2', seatLabel: 'Table 1 · Seat 2', date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), startTime: '09:00', endTime: '12:00', amount: 30, paymentMethod: 'razorpay', paymentStatus: 'captured', approvalStatus: 'approved', entitlementStatus: 'active', status: 'booked', holdUntil: null, createdAt: new Date().toISOString(), confirmedAt: new Date().toISOString() },
  { id: 'bkng_2', userId: 'usr_stu2', seatId: 'st_0_cr1', seatLabel: 'Carrel 1', date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), startTime: '12:00', endTime: '15:00', amount: 30, paymentMethod: 'manual', paymentStatus: 'pending', approvalStatus: 'pending', entitlementStatus: 'pending activation', status: 'pending', holdUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() },
];

const DEMO_PAYMENTS = [
  { id: 'pay_1', userId: 'usr_stu1', amount: 750, currency: 'INR', method: 'razorpay', type: 'membership', reference: 'MEM-001', relatedId: 'mem_1', status: 'captured', gatewayStatus: 'captured', razorpayPaymentId: 'pay_demo_1', razorpaySignature: 'demo_sig', recordedBy: null, recordedAt: new Date().toISOString(), verifiedAt: new Date().toISOString() },
  { id: 'pay_2', userId: 'usr_stu2', amount: 300, currency: 'INR', method: 'manual', type: 'membership', reference: 'MEM-002', relatedId: 'mem_2', status: 'pending', gatewayStatus: null, razorpayPaymentId: null, razorpaySignature: null, recordedBy: 'usr_lib1', recordedAt: new Date().toISOString() },
  { id: 'pay_3', userId: 'usr_stu1', amount: 30, currency: 'INR', method: 'razorpay', type: 'seat', reference: 'bkng_1', relatedId: 'bkng_1', status: 'captured', gatewayStatus: 'captured', razorpayPaymentId: 'pay_demo_3', recordedBy: null, recordedAt: new Date().toISOString(), verifiedAt: new Date().toISOString() },
];

const DEMO_PAYMENT_APPROVALS = [
  { id: 'appr_1', paymentId: 'pay_2', userId: 'usr_stu2', amount: 300, method: 'manual', type: 'membership', relatedId: 'mem_2', status: 'pending', reviewedBy: null, reviewedAt: null, reason: null, createdAt: new Date().toISOString() },
  { id: 'appr_2', paymentId: 'pay_demo_booking_pending', userId: 'usr_stu2', amount: 30, method: 'manual', type: 'seat', relatedId: 'bkng_2', status: 'pending', reviewedBy: null, reviewedAt: null, reason: null, createdAt: new Date().toISOString() },
];

const DEMO_SETTINGS = {
  appName: 'SraswatiLibrary',
  razorpayKeyId: 'rzp_test_demo_placeholder',
  razorpayEnvironment: 'test',
  razorpayCheckoutEnabled: false,
  razorpayMethods: ['upi', 'card', 'netbanking', 'wallet', 'emi'],
  razorpaySecretConfigured: false,
  currency: 'INR',
  seatHoldMinutes: 15,
  seatBookingAdvanceDays: 7,
  loanDays: 14,
  maxLoansPerStudent: 5,
  finePerDay: 5,
  fineCurrency: 'INR',
  approvalRequiredForPayments: true,
  autoApproveRazorpay: false,
  membershipRenewalGraceDays: 7,
  openingHours: '9:00 – 21:00',
  contactEmail: 'help@sraswatilibrary.example',
  contactPhone: '+91 22 0000 0000',
  address: 'Sraswati Library, Knowledge Campus, Mumbai, Maharashtra, India',
  theme: 'dark',
  cookieConsent: { essential: true, analytics: false, marketing: false },
  termsVersion: '1.0',
  privacyVersion: '1.0',
  updatedAt: new Date().toISOString(),
};

const DEMO_TERMS = {
  version: '1.0',
  lastUpdated: new Date().toISOString(),
  content: '# Terms of Service\n\nWelcome to SraswatiLibrary. These terms govern your use of the library management system.\n\n1. Membership\n...',
};

const DEMO_PRIVACY = {
  version: '1.0',
  lastUpdated: new Date().toISOString(),
  content: '# Privacy Policy\n\nSraswatiLibrary respects your privacy. This policy describes what data is collected...',
};

const DEMO_AUDIT_LOGS = [
  { id: 'audit_1', action: 'auth.login', actorId: 'usr_sa', actorName: 'Super Admin', actorRole: 'superadmin', metadata: { email: 'superadmin@sraswatilibrary.example' }, ip: 'demo-client', userAgent: 'demo', createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  { id: 'audit_2', action: 'loans.issue', actorId: 'usr_lib1', actorName: 'Anita Rao', actorRole: 'librarian', metadata: { loanId: 'ln_1', userId: 'usr_stu1', bookId: 'bk_1' }, ip: 'demo-client', userAgent: 'demo', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'audit_3', action: 'payments.approve', actorId: 'usr_adm1', actorName: 'Library Admin', actorRole: 'admin', metadata: { approvalId: 'appr_1', amount: 300 }, ip: 'demo-client', userAgent: 'demo', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];

const DEMO_CONSENT = {
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: new Date().toISOString(),
};

function seedData() {
  return {
    users: DEMO_USERS,
    roles: DEMO_ROLES,
    permissions: [],
    books: DEMO_BOOKS,
    copies: DEMO_COPIES,
    categories: DEMO_CATEGORIES,
    authors: [],
    loans: DEMO_LOANS,
    reservations: [],
    seats: DEMO_SEATS,
    bookings: DEMO_BOOKINGS,
    memberships: DEMO_MEMBERSHIPS,
    membershipPlans: DEMO_MEMBERSHIP_PLANS,
    payments: DEMO_PAYMENTS,
    paymentApprovals: DEMO_PAYMENT_APPROVALS,
    fines: DEMO_FINES,
    sessions: [],
    notifications: [],
    auditLogs: DEMO_AUDIT_LOGS,
    settings: DEMO_SETTINGS,
    terms: DEMO_TERMS,
    consent: DEMO_CONSENT,
  };
}

window.__sraswati_seed = { seedData, SEED_VERSION, DEMO_USERS, DEMO_BOOKS, DEMO_SEATS };
