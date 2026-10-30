/* bookings.js — Seat & table booking (demo)
   Availability is computed from booking data, never random. Prevents
   overlapping bookings for the same seat + time slot. */

function allBookings() {
  return window.__sraswati_storage.readCollection('bookings', []);
}

function findBooking(id) {
  return allBookings().find((b) => b.id === id);
}

function bookingsForUser(userId) {
  return allBookings().filter((b) => b.userId === userId);
}

function bookingsForSeat(seatId) {
  return allBookings().filter((b) => b.seatId === seatId);
}

function isSeatAvailable(seatId, date, startTime, endTime, excludeBookingId) {
  const bookings = allBookings();
  const startMs = new Date(`${date}T${startTime}`).getTime();
  const endMs = new Date(`${date}T${endTime}`).getTime();
  return !bookings.some((b) => {
    if (b.seatId !== seatId) return false;
    if (b.status === 'cancelled' || b.status === 'expired') return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;
    const bStart = new Date(`${b.date}T${b.startTime}`).getTime();
    const bEnd = new Date(`${b.date}T${b.endTime}`).getTime();
    return startMs < bEnd && endMs > bStart; // overlap
  });
}

function conflictingBooking(seatId, date, startTime, endTime, excludeBookingId) {
  const bookings = allBookings();
  return bookings.find((b) => {
    if (b.seatId !== seatId) return false;
    if (b.status === 'cancelled' || b.status === 'expired') return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;
    const bStart = new Date(`${b.date}T${b.startTime}`).getTime();
    const bEnd = new Date(`${b.date}T${b.endTime}`).getTime();
    const startMs = new Date(`${date}T${startTime}`).getTime();
    const endMs = new Date(`${date}T${endTime}`).getTime();
    return startMs < bEnd && endMs > bStart;
  });
}

function createBooking({ userId, seatId, seatLabel, date, startTime, endTime, amount, paymentMethod }) {
  // Eligibility checks
  const membership = window.__sraswati_storage.readCollection('memberships', []).find((m) => m.userId === userId && m.status === 'active');
  if (!membership) {
    return { ok: false, error: 'Active membership required to book a seat' };
  }
  const unpaidFines = window.__sraswati_storage.readCollection('fines', []).filter((f) => f.userId === userId && f.status !== 'paid');
  if (unpaidFines.length > 0) {
    return { ok: false, error: 'Unpaid fines block seat bookings' };
  }
  if (!isSeatAvailable(seatId, date, startTime, endTime)) {
    const conflict = conflictingBooking(seatId, date, startTime, endTime);
    return { ok: false, error: 'This seat is no longer available for the selected time slot', conflict };
  }
  const holdUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min seat hold demo
  const booking = {
    id: 'bkng_' + Math.random().toString(36).slice(2, 10),
    userId, seatId, seatLabel, date, startTime, endTime,
    amount: Number(amount) || 0,
    paymentMethod,
    paymentStatus: 'pending', // initiated -> pending -> authorized/captured/failed
    approvalStatus: 'pending', // pending review / approved / rejected
    entitlementStatus: 'inactive', // inactive -> pending activation -> active
    status: 'pending',
    holdUntil: holdUntil.toISOString(),
    createdAt: new Date().toISOString(),
    confirmedAt: null,
    cancelledAt: null,
  };
  const bookings = allBookings();
  bookings.push(booking);
  window.__sraswati_storage.writeCollection('bookings', bookings);
  // Create a pending payment record
  window.__sraswati_payments.createPayment({
    userId, amount: booking.amount, method: paymentMethod || 'razorpay',
    reference: booking.id, type: 'booking', relatedId: booking.id,
  });
  window.__sraswati_audit('bookings.create', { bookingId: booking.id, userId, seatId, date, amount: booking.amount });
  // Auto-expire hold check could be backend; here we mark pending
  return { ok: true, booking };
}

function cancelBooking(bookingId, userId) {
  const bookings = allBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return { ok: false, error: 'Booking not found' };
  if (booking.userId !== userId) return { ok: false, error: 'Not your booking' };
  if (booking.status === 'cancelled') return { ok: false, error: 'Already cancelled' };
  if (new Date(booking.date) < new Date()) return { ok: false, error: 'Cannot cancel a past booking' };
  booking.status = 'cancelled';
  booking.cancelledAt = new Date().toISOString();
  booking.approvalStatus = 'rejected';
  booking.entitlementStatus = 'inactive';
  const idx = bookings.findIndex((b) => b.id === bookingId);
  bookings[idx] = booking;
  window.__sraswati_storage.writeCollection('bookings', bookings);
  window.__sraswati_audit('bookings.cancel', { bookingId, userId, seatId: booking.seatId });
  return { ok: true, booking };
}

function approveBooking(bookingId, adminId, reason) {
  const bookings = allBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return { ok: false, error: 'Booking not found' };
  if (booking.approvalStatus === 'approved') return { ok: false, error: 'Already approved' };
  booking.approvalStatus = 'approved';
  booking.entitlementStatus = 'active';
  booking.status = 'booked';
  booking.confirmedAt = new Date().toISOString();
  booking.approvedBy = adminId;
  booking.approvalReason = reason;
  const idx = bookings.findIndex((b) => b.id === bookingId);
  bookings[idx] = booking;
  window.__sraswati_storage.writeCollection('bookings', bookings);
  window.__sraswati_audit('bookings.create', { bookingId, adminId, action: 'approve', reason });
  return { ok: true, booking };
}

function rejectBooking(bookingId, adminId, reason) {
  const bookings = allBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return { ok: false, error: 'Booking not found' };
  booking.approvalStatus = 'rejected';
  booking.entitlementStatus = 'inactive';
  booking.status = 'cancelled';
  booking.rejectionReason = reason;
  booking.rejectedBy = adminId;
  booking.rejectedAt = new Date().toISOString();
  const idx = bookings.findIndex((b) => b.id === bookingId);
  bookings[idx] = booking;
  window.__sraswati_storage.writeCollection('bookings', bookings);
  window.__sraswati_audit('bookings.cancel', { bookingId, adminId, action: 'reject', reason });
  return { ok: true, booking };
}

function expiryCheck() {
  // Mark holds expired if not paid/approved within hold period
  const now = new Date();
  const bookings = allBookings();
  let changed = false;
  bookings.forEach((b) => {
    if (b.status === 'pending' && b.holdUntil && new Date(b.holdUntil) < now) {
      b.status = 'expired';
      b.entitlementStatus = 'inactive';
      b.approvalStatus = 'rejected';
      b.expiredAt = now.toISOString();
      changed = true;
    }
  });
  if (changed) window.__sraswati_storage.writeCollection('bookings', bookings);
  return changed;
}

window.__sraswati_bookings = {
  allBookings, findBooking, bookingsForUser, bookingsForSeat,
  isSeatAvailable, conflictingBooking, createBooking, cancelBooking,
  approveBooking, rejectBooking, expiryCheck,
};
