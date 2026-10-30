/* payments.js — Payment records & approval workflow (demo)
   Payment status and administrative approval status are separate concepts.
   Entitlement activates only after payment verification + approval. */

function allPayments() {
  return window.__sraswati_storage.readCollection('payments', []);
}

function allPaymentApprovals() {
  return window.__sraswati_storage.readCollection('paymentApprovals', []);
}

function paymentsForUser(userId) {
  return allPayments().filter((p) => p.userId === userId);
}

function findPayment(id) {
  return allPayments().find((p) => p.id === id);
}

function pendingApprovals() {
  return allPaymentApprovals().filter((a) => a.status === 'pending');
}

function createPayment({ userId, amount, method, reference, type, relatedId, proofFile, notes }) {
  const payment = {
    id: 'pay_' + Math.random().toString(36).slice(2, 10),
    userId,
    amount: Number(amount) || 0,
    currency: 'INR',
    method, // razorpay, cash, bank_transfer, upi_offline
    type, // membership, seat, fine, other
    reference,
    relatedId,
    status: 'pending', // initiated, pending, authorized, captured, failed, cancelled, refunded
    gatewayStatus: null,
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
    proofFile,
    proofPreview: proofFile ? URL.createObjectURL(proofFile) : null,
    notes: notes || '',
    recordedBy: window.__sraswati_state.getCurrentUser() ? window.__sraswati_state.getCurrentUser().id : null,
    recordedAt: new Date().toISOString(),
    verifiedAt: null,
    verifiedBy: null,
  };
  const payments = allPayments();
  payments.push(payment);
  window.__sraswati_storage.writeCollection('payments', payments);
  // Create an approval record for manual review when not instantly authorized
  const approval = {
    id: 'appr_' + Math.random().toString(36).slice(2, 10),
    paymentId: payment.id,
    userId,
    amount: payment.amount,
    method,
    type,
    relatedId,
    status: 'pending', // pending, approved, rejected
    reviewedBy: null,
    reviewedAt: null,
    reason: null,
    createdAt: new Date().toISOString(),
  };
  const approvals = allPaymentApprovals();
  approvals.push(approval);
  window.__sraswati_storage.writeCollection('paymentApprovals', approvals);
  window.__sraswati_audit('payments.record', { paymentId: payment.id, userId, amount: payment.amount, method, type });
  return { ok: true, payment, approval };
}

function confirmPayment(paymentId, gatewayResult) {
  const payments = allPayments();
  const payment = payments.find((p) => p.id === paymentId);
  if (!payment) return { ok: false, error: 'Payment not found' };
  payment.gatewayStatus = gatewayResult.status;
  payment.razorpayOrderId = gatewayResult.orderId || null;
  payment.razorpayPaymentId = gatewayResult.paymentId || null;
  payment.razorpaySignature = gatewayResult.signature || null;
  payment.status = gatewayResult.status; // authorized/captured/failed/cancelled
  payment.verifiedAt = new Date().toISOString();
  const idx = payments.findIndex((p) => p.id === paymentId);
  payments[idx] = payment;
  window.__sraswati_storage.writeCollection('payments', payments);
  window.__sraswati_audit('payments.view', { paymentId, action: 'confirm', status: payment.status });
  return { ok: true, payment };
}

function failPayment(paymentId, reason) {
  const payments = allPayments();
  const payment = payments.find((p) => p.id === paymentId);
  if (!payment) return { ok: false, error: 'Payment not found' };
  payment.status = 'failed';
  payment.failureReason = reason;
  payment.verifiedAt = new Date().toISOString();
  const idx = payments.findIndex((p) => p.id === paymentId);
  payments[idx] = payment;
  window.__sraswati_storage.writeCollection('payments', payments);
  window.__sraswati_audit('payments.view', { paymentId, action: 'fail', reason });
  return { ok: true, payment };
}

function approvePayment(approvalId, adminId, reason) {
  const approvals = allPaymentApprovals();
  const approval = approvals.find((a) => a.id === approvalId);
  if (!approval) return { ok: false, error: 'Approval record not found' };
  if (approval.status !== 'pending') return { ok: false, error: 'Already reviewed' };
  approval.status = 'approved';
  approval.reviewedBy = adminId;
  approval.reviewedAt = new Date().toISOString();
  approval.reason = reason;
  const aIdx = approvals.findIndex((a) => a.id === approvalId);
  approvals[aIdx] = approval;
  window.__sraswati_storage.writeCollection('paymentApprovals', approvals);
  // Mark payment authorized/captured
  const payments = allPayments();
  const payment = payments.find((p) => p.id === approval.paymentId);
  if (payment) {
    payment.status = 'captured';
    payment.verifiedBy = adminId;
    const pIdx = payments.findIndex((p) => p.id === approval.paymentId);
    payments[pIdx] = payment;
    window.__sraswati_storage.writeCollection('payments', payments);
  }
  // Activate entitlement based on type
  if (approval.type === 'membership') {
    window.__sraswati_memberships.activateMembership(approval.userId);
  } else if (approval.type === 'seat') {
    window.__sraswati_bookings.approveBooking(approval.relatedId, adminId, reason);
  } else if (approval.type === 'fine') {
    window.__sraswati_fines.payFine(approval.relatedId, approval.userId, adminId);
  }
  window.__sraswati_audit('payments.approve', { approvalId, paymentId: approval.paymentId, adminId, reason });
  return { ok: true, approval };
}

function rejectPayment(approvalId, adminId, reason) {
  const approvals = allPaymentApprovals();
  const approval = approvals.find((a) => a.id === approvalId);
  if (!approval) return { ok: false, error: 'Approval record not found' };
  if (approval.status !== 'pending') return { ok: false, error: 'Already reviewed' };
  approval.status = 'rejected';
  approval.reviewedBy = adminId;
  approval.reviewedAt = new Date().toISOString();
  approval.reason = reason;
  const aIdx = approvals.findIndex((a) => a.id === approvalId);
  approvals[aIdx] = approval;
  window.__sraswati_storage.writeCollection('paymentApprovals', approvals);
  const payments = allPayments();
  const payment = payments.find((p) => p.id === approval.paymentId);
  if (payment) {
    payment.status = 'rejected';
    const pIdx = payments.findIndex((p) => p.id === approval.paymentId);
    payments[pIdx] = payment;
    window.__sraswati_storage.writeCollection('payments', payments);
  }
  window.__sraswati_audit('payments.reject', { approvalId, paymentId: approval.paymentId, adminId, reason });
  return { ok: true, approval };
}

function refundRequest(paymentId, adminId, reason, amount) {
  const payments = allPayments();
  const payment = payments.find((p) => p.id === paymentId);
  if (!payment) return { ok: false, error: 'Payment not found' };
  payment.refundRequested = true;
  payment.refundReason = reason;
  payment.refundAmount = amount || payment.amount;
  payment.refundRequestedAt = new Date().toISOString();
  payment.refundRequestedBy = adminId;
  const idx = payments.findIndex((p) => p.id === paymentId);
  payments[idx] = payment;
  window.__sraswati_storage.writeCollection('payments', payments);
  window.__sraswati_audit('payments.refund.request', { paymentId, adminId, reason, amount });
  return { ok: true, payment };
}

function csvExport(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escapeCell = (v) => {
    const s = String(v == null ? '' : v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(',')];
  rows.forEach((r) => lines.push(headers.map((h) => escapeCell(r[h])).join(',')));
  return lines.join('\n');
}

window.__sraswati_payments = {
  allPayments, allPaymentApprovals, paymentsForUser, findPayment,
  pendingApprovals, createPayment, confirmPayment, failPayment,
  approvePayment, rejectPayment, refundRequest, csvExport,
};
