/* loans.js — Book issue / return / renew (demo)
   Inventory is updated transactionally with the loan record. */

function allLoans() {
  return window.__sraswati_storage.readCollection('loans', []);
}

function allLoansForUser(userId) {
  return allLoans().filter((l) => l.userId === userId);
}

function findLoan(id) {
  return allLoans().find((l) => l.id === id);
}

function copyForLoan(loan) {
  const copies = window.__sraswati_storage.readCollection('copies', []);
  return copies.find((c) => c.id === loan.copyId);
}

function bookForCopy(copyId) {
  const copies = window.__sraswati_storage.readCollection('copies', []);
  const copy = copies.find((c) => c.id === copyId);
  if (!copy) return null;
  const books = window.__sraswati_storage.readCollection('books', []);
  return books.find((b) => b.id === copy.bookId);
}

function eligibleForLoan(userId) {
  // Student cannot have more than 5 active loans and no unpaid fines
  const active = activeLoansForUser(userId).length;
  if (active >= 5) return { ok: false, reason: 'Loan limit reached (5 books max)' };
  const unpaid = window.__sraswati_storage.readCollection('fines', []).filter(
    (f) => f.userId === userId && f.status !== 'paid'
  );
  if (unpaid.length > 0) return { ok: false, reason: 'Unpaid fines block borrowing' };
  return { ok: true };
}

function availableCopyForBook(bookId) {
  const copies = window.__sraswati_storage.readCollection('copies', []);
  return copies.find((c) => c.bookId === bookId && c.status === 'available');
}

function issueBook({ userId, bookId, dueDays = 14, issuedBy }) {
  const elig = eligibleForLoan(userId);
  if (!elig.ok) return { ok: false, error: elig.reason };
  const copy = availableCopyForBook(bookId);
  if (!copy) return { ok: false, error: 'No available copy of this book' };
  const now = new Date();
  const due = new Date(now.getTime() + dueDays * 24 * 60 * 60 * 1000);
  const loan = {
    id: 'ln_' + Math.random().toString(36).slice(2, 10),
    userId, bookId, copyId: copy.id,
    issuedAt: now.toISOString(),
    dueAt: due.toISOString(),
    returnedAt: null,
    status: 'active',
    renewedCount: 0,
    issuedBy,
  };
  const loans = allLoans();
  loans.push(loan);
  // Transactional inventory update
  copy.status = 'issued';
  copy.updatedAt = now.toISOString();
  const copies = window.__sraswati_storage.readCollection('copies', []);
  const cIdx = copies.findIndex((c) => c.id === copy.id);
  copies[cIdx] = copy;
  window.__sraswati_storage.writeCollection('loans', loans);
  window.__sraswati_storage.writeCollection('copies', copies);
  window.__sraswati_audit('loans.issue', { loanId: loan.id, userId, bookId, copyId: copy.id, dueAt: due.toISOString() });
  return { ok: true, loan, copy };
}

function returnBook(loanId, receivedBy) {
  const loans = allLoans();
  const loan = loans.find((l) => l.id === loanId);
  if (!loan) return { ok: false, error: 'Loan not found' };
  if (loan.status !== 'active') return { ok: false, error: 'Loan is not active' };
  const now = new Date();
  const overdue = now > new Date(loan.dueAt);
  loan.status = 'returned';
  loan.returnedAt = now.toISOString();
  const cIdx = loans.findIndex((l) => l.id === loanId);
  loans[cIdx] = loan;
  // Return copy to available
  const copies = window.__sraswati_storage.readCollection('copies', []);
  const copy = copies.find((c) => c.id === loan.copyId);
  if (copy) {
    copy.status = 'available';
    copy.updatedAt = now.toISOString();
    const cpIdx = copies.findIndex((c) => c.id === loan.copyId);
    copies[cpIdx] = copy;
    window.__sraswati_storage.writeCollection('copies', copies);
  }
  window.__sraswati_storage.writeCollection('loans', loans);
  window.__sraswati_audit('loans.return', { loanId, userId: loan.userId, bookId: loan.bookId, overdue });
  // Auto-create fine if overdue
  if (overdue) {
    const daysLate = Math.ceil((now - new Date(loan.dueAt)) / (1000 * 60 * 60 * 24));
    const amount = daysLate * 5; // ₹5/day demo rule
    window.__sraswati_fines.createFine({ userId: loan.userId, loanId, amount, reason: `Late return: ${daysLate} day(s) overdue`, recordedBy: receivedBy });
  }
  return { ok: true, loan, overdue, fine: overdue ? amount : 0 };
}

function renewLoan(loanId) {
  const loans = allLoans();
  const loan = loans.find((l) => l.id === loanId);
  if (!loan) return { ok: false, error: 'Loan not found' };
  if (loan.status !== 'active') return { ok: false, error: 'Cannot renew a non-active loan' };
  if (loan.renewedCount >= 2) return { ok: false, error: 'Renewal limit reached (2 max)' };
  const now = new Date();
  const newDue = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  loan.dueAt = newDue.toISOString();
  loan.renewedCount += 1;
  const cIdx = loans.findIndex((l) => l.id === loanId);
  loans[cIdx] = loan;
  window.__sraswati_storage.writeCollection('loans', loans);
  window.__sraswati_audit('loans.renew', { loanId, userId: loan.userId, newDue: newDue.toISOString() });
  return { ok: true, loan };
}

function overdueLoans() {
  const now = new Date();
  return allLoans().filter((l) => l.status === 'active' && new Date(l.dueAt) < now);
}

window.__sraswati_loans = {
  allLoans, activeLoansForUser, allLoansForUser, findLoan, copyForLoan,
  bookForCopy, eligibleForLoan, availableCopyForBook, issueBook, returnBook,
  renewLoan, overdueLoans,
};
