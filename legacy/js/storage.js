/* storage.js — Frontend demo persistence layer
   All production data must move to a backend database. This module is the
   demo adapter and is designed to be replaced by an API client later.
   Only non-sensitive demo records live here. Never store real passwords,
   payment secrets, or auth tokens. */

const DEMO_KEY = 'sraswati_demo_v1';
const SESSION_KEY = 'sraswati_session';
const DEMO_MODE_BANNER_KEY = 'sraswati_demo_banner_dismissed';

const STORAGE_KEYS = {
  users: `${DEMO_KEY}:users`,
  roles: `${DEMO_KEY}:roles`,
  permissions: `${DEMO_KEY}:permissions`,
  books: `${DEMO_KEY}:books`,
  copies: `${DEMO_KEY}:copies`,
  categories: `${DEMO_KEY}:categories`,
  loans: `${DEMO_KEY}:loans`,
  reservations: `${DEMO_KEY}:reservations`,
  seats: `${DEMO_KEY}:seats`,
  bookings: `${DEMO_KEY}:bookings`,
  memberships: `${DEMO_KEY}:memberships`,
  membershipPlans: `${DEMO_KEY}:membershipPlans`,
  payments: `${DEMO_KEY}:payments`,
  paymentApprovals: `${DEMO_KEY}:paymentApprovals`,
  fines: `${DEMO_KEY}:fines`,
  sessions: `${DEMO_KEY}:sessions`,
  notifications: `${DEMO_KEY}:notifications`,
  auditLogs: `${DEMO_KEY}:auditLogs`,
  settings: `${DEMO_KEY}:settings`,
  terms: `${DEMO_KEY}:terms`,
  consent: `${DEMO_KEY}:consent`,
};

function keyFor(collection) {
  return STORAGE_KEYS[collection] || `${DEMO_KEY}:${collection}`;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (err) {
    console.warn('[storage] malformed entry for', key, '— returning fallback', err.message);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('[storage] write failed for', key, err.message);
    return false;
  }
}

function readCollection(collection, fallback) {
  return readJSON(keyFor(collection), fallback);
}

function writeCollection(collection, value) {
  return writeJSON(keyFor(collection), value);
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function writeSession(value) {
  try {
    if (value === null) {
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
    }
    return true;
  } catch (err) {
    return false;
  }
}

function clearDemoData() {
  Object.values(STORAGE_KEYS).forEach((k) => {
    if (k) localStorage.removeItem(k);
  });
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(DEMO_MODE_BANNER_KEY);
}

function exportDemoData() {
  const bundle = {};
  Object.entries(STORAGE_KEYS).forEach(([collection, key]) => {
    if (key) bundle[collection] = readJSON(key, null);
  });
  bundle.session = readSession();
  bundle.exportedAt = new Date().toISOString();
  bundle.version = '1.0.0';
  return bundle;
}

function importDemoData(bundle) {
  if (!bundle || typeof bundle !== 'object') return false;
  Object.entries(bundle).forEach(([collection, value]) => {
    if (collection === 'session' || collection === 'exportedAt' || collection === 'version') return;
    const key = keyFor(collection);
    if (key) writeJSON(key, value);
  });
  return true;
}

function storageUsageEstimate() {
  let total = 0;
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(DEMO_KEY)) continue;
    try {
      const v = localStorage.getItem(k);
      total += (k.length + (v ? v.length : 0)) * 2;
      count += 1;
    } catch (err) {
      // ignore unreadable entries
    }
  }
  return { bytes: total, count, human: formatBytes(total) };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function storageSupported() {
  try {
    const test = '__sraswati_storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (err) {
    return false;
  }
}

window.__sraswati_storage = {
  readCollection,
  writeCollection,
  readJSON,
  writeJSON,
  readSession,
  writeSession,
  clearDemoData,
  exportDemoData,
  importDemoData,
  storageUsageEstimate,
  storageSupported,
  keyFor,
};
