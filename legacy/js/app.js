/* app.js — Application initializer (demo mode)
   Wires storage, state, seed data, auth, demo banner, and page-level auth
   guards. Included on every page as a module script. */

import { __sraswati_storage as storage } from './storage.js';
import { __sraswati_state as state } from './state.js';
import { __sraswati_auth as auth } from './auth-demo.js';
import { __sraswati_seed as seed } from './seed-data.js';
import { __sraswati_notifications as notify } from './notifications.js';
import { __sraswati_router as router } from './router.js';

const DEMO_BANNER_KEY = 'sraswati_demo_banner_dismissed';

function init() {
  // Seed localStorage if empty (only once)
  const seeded = storage.readCollection('users', null);
  if (!seeded || seeded.length === 0) {
    storage.writeCollection('users', seed.DEMO_USERS);
    storage.writeCollection('roles', seed.DEMO_ROLES);
    storage.writeCollection('permissions', []);
    storage.writeCollection('books', seed.DEMO_BOOKS);
    storage.writeCollection('copies', seed.DEMO_COPIES);
    storage.writeCollection('categories', seed.DEMO_CATEGORIES);
    storage.writeCollection('loans', seed.DEMO_LOANS);
    storage.writeCollection('reservations', []);
    storage.writeCollection('seats', seed.DEMO_SEATS);
    storage.writeCollection('bookings', seed.DEMO_BOOKINGS);
    storage.writeCollection('memberships', seed.DEMO_MEMBERSHIPS);
    storage.writeCollection('membershipPlans', seed.DEMO_MEMBERSHIP_PLANS);
    storage.writeCollection('payments', seed.DEMO_PAYMENTS);
    storage.writeCollection('paymentApprovals', seed.DEMO_PAYMENT_APPROVALS);
    storage.writeCollection('fines', seed.DEMO_FINES);
    storage.writeCollection('sessions', []);
    storage.writeCollection('notifications', []);
    storage.writeCollection('auditLogs', seed.DEMO_AUDIT_LOGS);
    storage.writeCollection('settings', seed.DEMO_SETTINGS);
    storage.writeCollection('terms', seed.DEMO_TERMS);
    storage.writeCollection('consent', seed.DEMO_CONSENT);
    sessionStorage.removeItem('sraswati_session');
  }

  // Hydrate state from storage
  state.initialize({
    users: storage.readCollection('users', []),
    roles: storage.readCollection('roles', []),
    permissions: storage.readCollection('permissions', []),
    books: storage.readCollection('books', []),
    copies: storage.readCollection('copies', []),
    categories: storage.readCollection('categories', []),
    loans: storage.readCollection('loans', []),
    seats: storage.readCollection('seats', []),
    bookings: storage.readCollection('bookings', []),
    memberships: storage.readCollection('memberships', []),
    membershipPlans: storage.readCollection('membershipPlans', []),
    payments: storage.readCollection('payments', []),
    fines: storage.readCollection('fines', []),
    settings: storage.readCollection('settings', {}),
    terms: storage.readCollection('terms', {}),
    consent: storage.readCollection('consent', {}),
  });

  const user = auth.getCurrentUser();
  state.setCurrentUser(user);

  // Expire stale booking holds
  if (typeof window.__sraswati_bookings !== 'undefined') {
    window.__sraswati_bookings.expiryCheck();
  }

  renderDemoBanner();
  setupGlobalLogout();
  setupDemoModeBadge();
  auth.refreshActivity();
}

function renderDemoBanner() {
  const dismissed = localStorage.getItem(DEMO_BANNER_KEY);
  if (dismissed) return;
  const existing = document.getElementById('demo-banner');
  if (existing) return;
  const banner = document.createElement('div');
  banner.id = 'demo-banner';
  banner.className = 'demo-banner';
  banner.innerHTML = `
    <span>DEMO MODE — Frontend-only simulation. Data persists in browser storage. Not a production system.</span>
    <a href="#" id="demo-banner-learn">Learn more</a>
    <button id="demo-banner-dismiss" class="btn sm" style="background:transparent;color:inherit;border:1px solid currentColor;padding:4px 10px;margin-left:10px">Dismiss</button>
  `;
  document.body.insertBefore(banner, document.body.firstChild);
  document.getElementById('demo-banner-dismiss').addEventListener('click', () => {
    localStorage.setItem(DEMO_BANNER_KEY, '1');
    banner.remove();
  });
  document.getElementById('demo-banner-learn').addEventListener('click', (e) => {
    e.preventDefault();
    notify.info('All payments, authentication, and database operations are simulated in demo mode. A production deployment requires a backend (Node.js/Express + PostgreSQL) with server-side auth, Razorpay signature verification, and database-backed sessions.', 'Demo mode');
  });
}

function setupGlobalLogout() {
  const btn = document.getElementById('global-logout') || document.querySelector('[data-action="logout"]');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      auth.logout();
      notify.success('You have been logged out.');
      setTimeout(() => { router.navigate('login.html'); }, 600);
    });
  }
}

function setupDemoModeBadge() {
  const container = document.getElementById('demo-badge-container');
  if (container) {
    container.innerHTML = '<span class="tag neu" style="font-size:11px">DEMO</span>';
  }
}

function requireAuth() {
  if (!auth.isAuthenticated()) {
    notify.warn('Please log in to continue.');
    router.navigate('login.html');
    return false;
  }
  return true;
}

function requireRole(allowedRoles) {
  if (!requireAuth()) return false;
  const user = auth.getCurrentUser();
  if (!user || !allowedRoles.includes(user.role)) {
    notify.error('You are not authorized to view this page.');
    router.navigate(router.dashboardForRole(user && user.role ? user.role : 'student'));
    return false;
  }
  return true;
}

function requirePermission(permission) {
  if (!requireAuth()) return false;
  if (!auth.hasPermission(permission)) {
    notify.error(`You do not have the "${permission}" permission.`);
    const user = auth.getCurrentUser();
    router.navigate(router.dashboardForRole(user ? user.role : 'student'));
    return false;
  }
  return true;
}

// Expose for page scripts
window.__sraswati_app = {
  init,
  requireAuth, requireRole, requirePermission,
  navigate: router.navigate,
  auth,
  state,
  storage,
  notify,
};
