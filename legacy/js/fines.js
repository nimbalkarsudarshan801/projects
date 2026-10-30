/* fines.js — Late fines, waivers, payments (demo) */

function allFines() {
  return window.__sraswati_storage.readCollection('fines', []);
}

function finesForUser(userId) {
  return allFines().filter((f) => f.userId === userId);
}

function findFine(id) {
  return allFines().find((f) => f.id === id);
}

function outstandingForUser(userId) {
  return finesForUser(userId).filter((f) => f.status !== 'paid').reduce((sum, f) => sum + (f.amount || 0), 0);
}

function createFine({ userId, loanId, amount, reason, recordedBy }) {
  const fines = allFines();
  const fine = {
    id: 'fn_' + Math.random().toString(36).slice(2, 10),
    userId,
    loanId,
    amount: Number(amount) || 0,
    reason,
    status: 'unpaid', // unpaid, paid, waived, partially-paid
    createdAt: new Date().toISOString(),
    paidAt: null,
    paidBy: null,
    waivedAt: null,
    waivedBy: null,
    waiverReason: null,
    recordedBy,
  };
  fines.push(fine);
  window.__sraswati_storage.writeCollection('fines', fines);
  window.__sraswati_audit('fines.manage', { fineId: fine.id, userId, amount: fine.amount, reason });
  return { ok: true, fine };
}

function payFine(fineId, userId, paidBy) {
  const fines = allFines();
  const fine = fines.find((f) => f.id === fineId);
  if (!fine) return { ok: false, error: 'Fine not found' };
  if (fine.userId !== userId && !window.__sraswati_auth.hasPermission('fines.manage')) {
    return { ok: false, error: 'Not authorized' };
  }
  fine.status = 'paid';
  fine.paidAt = new Date().toISOString();
  fine.paidBy = paidBy;
  const idx = fines.findIndex((f) => f.id === fineId);
  fines[idx] = fine;
  window.__sraswati_storage.writeCollection('fines', fines);
  // Record payment
  window.__sraswati_payments.createPayment({
    userId, amount: fine.amount, method: 'manual', type: 'fine',
    reference: fine.id, relatedId: fineId, notes: 'Fine payment',
  });
  window.__sraswati_audit('fines.manage', { fineId, userId, action: 'pay', amount: fine.amount });
  return { ok: true, fine };
}

function waiveFine(fineId, adminId, reason) {
  const fines = allFines();
  const fine = fines.find((f) => f.id === fineId);
  if (!fine) return { ok: false, error: 'Fine not found' };
  fine.status = 'waived';
  fine.waivedAt = new Date().toISOString();
  fine.waivedBy = adminId;
  fine.waiverReason = reason;
  const idx = fines.findIndex((f) => f.id === fineId);
  fines[idx] = fine;
  window.__sraswati_storage.writeCollection('fines', fines);
  window.__sraswati_audit('fines.manage', { fineId, userId: fine.userId, action: 'waive', amount: fine.amount, reason });
  return { ok: true, fine };
}

function adjustFine(fineId, adminId, newAmount, reason) {
  const fines = allFines();
  const fine = fines.find((f) => f.id === fineId);
  if (!fine) return { ok: false, error: 'Fine not found' };
  const old = fine.amount;
  fine.amount = Number(newAmount) || 0;
  fine.adjustedAt = new Date().toISOString();
  fine.adjustedBy = adminId;
  fine.adjustmentReason = reason;
  const idx = fines.findIndex((f) => f.id === fineId);
  fines[idx] = fine;
  window.__sraswati_storage.writeCollection('fines', fines);
  window.__sraswati_audit('fines.manage', { fineId, userId: fine.userId, action: 'adjust', oldAmount: old, newAmount: fine.amount, reason });
  return { ok: true, fine };
}

function calculateOverdueFine(loan) {
  const now = new Date();
  const due = new Date(loan.dueAt);
  if (now <= due) return 0;
  const daysLate = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
  return daysLate * 5; // ₹5/day demo rule
}

window.__sraswati_fines = {
  allFines, finesForUser, findFine, outstandingForUser, createFine,
  payFine, waiveFine, adjustFine, calculateOverdueFine,
};
