/* router.js — Client-side route helpers for multi-page demo
   Each page is its own HTML file. This module resolves the correct role
   dashboard based on the current user and provides redirect guards. */

const PUBLIC_PATHS = ['/', '/index.html', '/login.html', '/register.html', '/forgot-password.html', '/reset-password.html', '/terms.html', '/privacy.html', '/help.html'];

const ROLE_DASHBOARD = {
  superadmin: 'superadmin/dashboard.html',
  admin: 'admin/dashboard.html',
  librarian: 'librarian/dashboard.html',
  student: 'student/dashboard.html',
};

const PATH_ROLE = {
  '/student': 'student',
  '/librarian': 'librarian',
  '/admin': 'admin',
  '/superadmin': 'superadmin',
};

function isPublicPath(path) {
  return PUBLIC_PATHS.includes(path) || path.endsWith('.html') && !path.includes('/');
}

function requiredRoleForPath(path) {
  for (const [prefix, role] of Object.entries(PATH_ROLE)) {
    if (path.startsWith(prefix)) return role;
  }
  return null;
}

function dashboardForRole(role) {
  return ROLE_DASHBOARD[role] || 'student/dashboard.html';
}

function navigate(url) {
  window.location.href = url;
}

function goBack() {
  window.history.back();
}

function currentPath() {
  return window.location.pathname;
}

function isSameOrigin(url) {
  try {
    return new URL(url, window.location.origin).origin === window.location.origin;
  } catch (err) {
    return false;
  }
}

function buildUrl(path) {
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : path;
}

window.__sraswati_router = {
  navigate, goBack, currentPath, dashboardForRole, requiredRoleForPath, isPublicPath, buildUrl, ROLE_DASHBOARD,
};
