/* seats.js — Seat inventory (demo)
   Seats belong to floors/zones and have accessibility metadata. */

function allSeats() {
  return window.__sraswati_storage.readCollection('seats', []);
}

function findSeat(id) {
  return allSeats().find((s) => s.id === id);
}

function seatsByZone(zoneId) {
  return allSeats().filter((s) => s.zoneId === zoneId && !s.archived);
}

function allZones() {
  const seats = allSeats();
  const zones = {};
  seats.forEach((s) => {
    if (!zones[s.zoneId]) zones[s.zoneId] = { id: s.zoneId, name: s.zoneName, floor: s.floor };
  });
  return Object.values(zones);
}

function createSeat(data) {
  const seats = allSeats();
  const seat = {
    id: 'st_' + Math.random().toString(36).slice(2, 10),
    seatId: data.seatId, // human label e.g. T3-2
    label: data.label,
    kind: data.kind || 'seat', // seat, table, carrel
    zoneId: data.zoneId || 'zone_main',
    zoneName: data.zoneName || 'Ground floor',
    floor: data.floor || 'Ground floor',
    x: data.x || 0, y: data.y || 0,
    accessible: !!data.accessible,
    status: data.status || 'available', // available, unavailable, maintenance
    archived: false,
    createdAt: new Date().toISOString(),
  };
  seats.push(seat);
  window.__sraswati_storage.writeCollection('seats', seats);
  window.__sraswati_audit('seats.manage', { seatId: seat.id, action: 'create' });
  return { ok: true, seat };
}

function updateSeat(id, data) {
  const seats = allSeats();
  const idx = seats.findIndex((s) => s.id === id);
  if (idx === -1) return { ok: false, error: 'Seat not found' };
  Object.assign(seats[idx], data, { updatedAt: new Date().toISOString() });
  window.__sraswati_storage.writeCollection('seats', seats);
  window.__sraswati_audit('seats.manage', { seatId: id, action: 'update' });
  return { ok: true, seat: seats[idx] };
}

function setSeatStatus(id, status) {
  const seats = allSeats();
  const seat = seats.find((s) => s.id === id);
  if (!seat) return { ok: false, error: 'Seat not found' };
  seat.status = status;
  seat.updatedAt = new Date().toISOString();
  window.__sraswati_storage.writeCollection('seats', seats);
  window.__sraswati_audit('seats.manage', { seatId: id, action: 'setStatus', status });
  return { ok: true, seat };
}

function archiveSeat(id) {
  const seats = allSeats();
  const seat = seats.find((s) => s.id === id);
  if (!seat) return { ok: false, error: 'Seat not found' };
  seat.archived = true;
  seat.archivedAt = new Date().toISOString();
  window.__sraswati_storage.writeCollection('seats', seats);
  window.__sraswati_audit('seats.manage', { seatId: id, action: 'archive' });
  return { ok: true };
}

function releaseSeatBooking(bookingId, releasedBy, reason) {
  const bookings = window.__sraswati_storage.readCollection('bookings', []);
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return { ok: false, error: 'Booking not found' };
  if (booking.status === 'cancelled') return { ok: false, error: 'Already cancelled' };
  booking.status = 'cancelled';
  booking.cancelledAt = new Date().toISOString();
  booking.cancelledBy = releasedBy;
  booking.cancelReason = reason || 'Admin release';
  const bIdx = bookings.findIndex((b) => b.id === bookingId);
  bookings[bIdx] = booking;
  window.__sraswati_storage.writeCollection('bookings', bookings);
  window.__sraswati_audit('bookings.cancel', { bookingId, userId: booking.userId, seatId: booking.seatId, releasedBy, reason });
  return { ok: true, booking };
}

window.__sraswati_seats = {
  allSeats, findSeat, seatsByZone, allZones, createSeat, updateSeat,
  setSeatStatus, archiveSeat, releaseSeatBooking,
};
