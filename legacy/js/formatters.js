/* formatters.js — Display formatting helpers */

function currency(amount, code = 'INR') {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  } catch (err) {
    return `₹${Number(amount) || 0}`;
  }
}

function dateShort(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function dateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeOnly(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function relativeTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return dateShort(value);
}

function capitalize(str) {
  if (!str) return '';
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

function titleCase(str) {
  if (!str) return '';
  return String(str)
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function truncate(str, len = 60) {
  if (!str) return '';
  if (String(str).length <= len) return str;
  return String(str).slice(0, len).trim() + '…';
}

function statusLabel(status) {
  const map = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    inactive: 'Inactive',
    overdue: 'Overdue',
    booked: 'Booked',
    available: 'Available',
    unavailable: 'Unavailable',
    maintenance: 'Maintenance',
    occupied: 'Occupied',
    captured: 'Captured',
    authorized: 'Authorized',
    failed: 'Failed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    initiated: 'Initiated',
    'pending-approval': 'Pending Approval',
    'pending-verification': 'Pending Verification',
  };
  return map[status] || capitalize(String(status).replace(/[-_]/g, ' '));
}

function statusClass(status) {
  const map = {
    active: 'ok',
    approved: 'ok',
    available: 'ok',
    booked: 'warn',
    pending: 'warn',
    'pending-approval': 'warn',
    'pending-verification': 'warn',
    overdue: 'bad',
    rejected: 'bad',
    failed: 'bad',
    cancelled: 'bad',
    inactive: 'neu',
    unavailable: 'neu',
    maintenance: 'neu',
    occupied: 'neu',
    captured: 'ok',
    authorized: 'ok',
    refunded: 'neu',
  };
  return map[status] || 'neu';
}

function idLabel(prefix, id) {
  return `${prefix}-${String(id).padStart(4, '0')}`;
}

window.__sraswati_formatters = {
  currency,
  dateShort,
  dateTime,
  timeOnly,
  relativeTime,
  capitalize,
  titleCase,
  truncate,
  statusLabel,
  statusClass,
  idLabel,
};
