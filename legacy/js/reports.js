/* reports.js — Reports & CSV export (demo) */

function membersReport() {
  const users = window.__sraswati_storage.readCollection('users', []);
  const memberships = window.__sraswati_storage.readCollection('memberships', []);
  return users.map((u) => {
    const m = memberships.find((x) => x.userId === u.id && x.status === 'active');
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      membership: m ? m.planName : 'None',
      expiresAt: m ? m.expiresAt : '',
    };
  });
}

function inventoryReport() {
  const books = window.__sraswati_storage.readCollection('books', []);
  const copies = window.__sraswati_storage.readCollection('copies', []);
  return books.map((b) => {
    const bCopies = copies.filter((c) => c.bookId === b.id);
    return {
      id: b.id,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      category: b.category,
      total: bCopies.length,
      available: bCopies.filter((c) => c.status === 'available').length,
      issued: bCopies.filter((c) => c.status === 'issued').length,
      damaged: bCopies.filter((c) => c.status === 'damaged').length,
    };
  });
}

function bookingsReport() {
  return window.__sraswati_storage.readCollection('bookings', []);
}

function paymentsReport() {
  return window.__sraswati_storage.readCollection('payments', []);
}

function finesReport() {
  return window.__sraswati_storage.readCollection('fines', []);
}

function exportCSV(title, rows) {
  const csv = window.__sraswati_payments.csvExport(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  window.__sraswati_notifications.success(`${title} exported as CSV.`);
}

window.__sraswati_reports = {
  membersReport, inventoryReport, bookingsReport, paymentsReport, finesReport, exportCSV,
};
