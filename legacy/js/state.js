/* state.js — Central application state (demo mode)
   Holds the in-memory view of demo data, initialized from seed data or
   localStorage. Provides getters/setters and notifies subscribers so the
   UI can react to state changes. */

const state = {
  demoMode: true,
  appName: 'SraswatiLibrary',
  currentUser: null,
  session: null,
  initialized: false,

  users: [],
  roles: [],
  permissions: [],
  books: [],
  copies: [],
  categories: [],
  authors: [],
  loans: [],
  reservations: [],
  seats: [],
  bookings: [],
  memberships: [],
  membershipPlans: [],
  payments: [],
  paymentApprovals: [],
  fines: [],
  sessions: [],
  notifications: [],
  auditLogs: [],
  settings: {},
  terms: {},
  consent: {},
};

const subscribers = new Set();

function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function notify(patch) {
  subscribers.forEach((fn) => {
    try { fn(patch); } catch (err) { console.error('[state] subscriber error', err); }
  });
}

function set(key, value) {
  state[key] = value;
  notify({ [key]: value });
}

function patch(key, updater) {
  const current = state[key];
  const next = typeof updater === 'function' ? updater(current) : updater;
  state[key] = next;
  notify({ [key]: next });
  return next;
}

function get(key) {
  return state[key];
}

function getAll() {
  return { ...state };
}

function initialize(seed) {
  if (state.initialized) return state;
  Object.assign(state, seed);
  state.initialized = true;
  state.demoMode = true;
  notify({ initialized: true, demoMode: true });
  return state;
}

function reset() {
  state.users = [];
  state.roles = [];
  state.permissions = [];
  state.books = [];
  state.copies = [];
  state.categories = [];
  state.authors = [];
  state.loans = [];
  state.reservations = [];
  state.seats = [];
  state.bookings = [];
  state.memberships = [];
  state.membershipPlans = [];
  state.payments = [];
  state.paymentApprovals = [];
  state.fines = [];
  state.sessions = [];
  state.notifications = [];
  state.auditLogs = [];
  state.settings = {};
  state.terms = {};
  state.consent = {};
  state.currentUser = null;
  state.session = null;
  notify({ reset: true });
}

function setCurrentUser(user) {
  state.currentUser = user;
  notify({ currentUser: user });
}

function clearCurrentUser() {
  state.currentUser = null;
  state.session = null;
  notify({ currentUser: null, session: null });
}

window.__sraswati_state = {
  state,
  subscribe,
  notify,
  set,
  patch,
  get,
  getAll,
  initialize,
  reset,
  setCurrentUser,
  clearCurrentUser,
};
