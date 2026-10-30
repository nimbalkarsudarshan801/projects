/* auth-demo.js — Frontend-demo authentication
   IMPORTANT: This is a DEMO-ONLY simulation. It is NOT production auth.
   Real authentication must be server-side with Argon2id/bcrypt password
   hashing, HttpOnly secure cookies, and server-side session validation.
   Never store real passwords here. Demo passwords are matched against
   seeded demo records only. */

const AUTH_KEY = 'sraswati_demo_auth';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes demo timeout

let authTimer = null;

function isDemoMode() {
  return true;
}

function demoUsers() {
  return window.__sraswati_storage.readCollection('users', []);
}

function findUserByEmail(email) {
  return demoUsers().find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

function findUserById(id) {
  return demoUsers().find((u) => u.id === id);
}

function getCurrentUser() {
  const session = window.__sraswati_storage.readSession();
  if (!session || !session.userId) return null;
  const user = findUserById(session.userId);
  if (!user || user.status === 'disabled') return null;
  return user;
}

function getSession() {
  return window.__sraswati_storage.readSession();
}

function isAuthenticated() {
  return !!getCurrentUser();
}

function hasRole(role) {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === role || user.roles && user.roles.includes(role);
}

function hasPermission(permission) {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.role === 'superadmin') return true;
  const perms = window.__sraswati_storage.readCollection('permissions', []);
  const userPerms = perms.filter((p) => p.roleId === user.roleId || p.role === user.role).map((p) => p.permission);
  return userPerms.includes(permission);
}

function login(email, password) {
  const users = demoUsers();
  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) {
    return { ok: false, error: 'Invalid email or password' };
  }
  if (user.status === 'disabled') {
    return { ok: false, error: 'This account has been disabled. Contact support.' };
  }
  // Demo password check: compare against stored demo hash/plaintext seed
  const demoPass = user.demoPassword || user.password;
  if (password !== demoPass) {
    return { ok: false, error: 'Invalid email or password' };
  }
  const session = {
    id: 'sess_' + Math.random().toString(36).slice(2, 12),
    userId: user.id,
    email: user.email,
    role: user.role,
    roleId: user.roleId,
    name: user.name,
    startedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TIMEOUT_MS).toISOString(),
  };
  window.__sraswati_storage.writeSession(session);
  window.__sraswati_state.setCurrentUser(user);
  startAuthTimer();
  audit('auth.login', { userId: user.id, email: user.email, role: user.role });
  return { ok: true, user, session };
}

function register(userData) {
  const users = demoUsers();
  if (users.find((u) => u.email.toLowerCase() === String(userData.email).toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists' };
  }
  const id = 'usr_' + Math.random().toString(36).slice(2, 10);
  const user = {
    id,
    name: userData.name,
    email: userData.email,
    phone: userData.phone || '',
    role: 'student',
    roleId: 'role_student',
    status: 'active',
    demoPassword: userData.password, // DEMO ONLY — production must hash
    createdAt: new Date().toISOString(),
    termsAccepted: !!userData.termsAccepted,
    termsAcceptedAt: userData.termsAccepted ? new Date().toISOString() : null,
  };
  users.push(user);
  window.__sraswati_storage.writeCollection('users', users);
  audit('auth.register', { userId: id, email: user.email });
  return { ok: true, user };
}

function logout() {
  const session = getSession();
  if (session) {
    audit('auth.logout', { userId: session.userId });
  }
  stopAuthTimer();
  window.__sraswati_storage.writeSession(null);
  window.__sraswati_state.clearCurrentUser();
  return { ok: true };
}

function startAuthTimer() {
  stopAuthTimer();
  authTimer = setTimeout(() => {
    const session = getSession();
    if (session) {
      window.__sraswati_notifications.warn('Your demo session has expired due to inactivity. Please log in again.');
      logout();
      const url = window.location.pathname;
      if (!url.includes('login.html') && !url.includes('index.html')) {
        window.location.href = 'login.html';
      }
    }
  }, SESSION_TIMEOUT_MS);
}

function stopAuthTimer() {
  if (authTimer) {
    clearTimeout(authTimer);
    authTimer = null;
  }
}

function refreshActivity() {
  const session = getSession();
  if (session) {
    session.lastActivity = new Date().toISOString();
    session.expiresAt = new Date(Date.now() + SESSION_TIMEOUT_MS).toISOString();
    window.__sraswati_storage.writeSession(session);
    startAuthTimer();
  }
}

function forgotPassword(email) {
  // Generic confirmation — never reveal whether the account exists
  const user = findUserByEmail(email);
  if (user && user.status !== 'disabled') {
    audit('auth.forgot_password', { email, userId: user.id });
  } else {
    audit('auth.forgot_password', { email, userId: null });
  }
  return {
    ok: true,
    message: 'If an account exists for this email, a password-reset link has been sent. Actual email delivery requires a backend.',
  };
}

function resetPassword(token, newPassword) {
  // Demo token validation: token must exist in seed or be 'demo-reset-token'
  const validTokens = ['demo-reset-token', 'reset-12345'];
  if (!validTokens.includes(token)) {
    return { ok: false, error: 'Invalid or expired reset token' };
  }
  // In demo mode we accept any user email associated with the token; production binds token to user+expiry
  return {
    ok: true,
    message: 'Password reset successfully. In production this would update the hashed password server-side and invalidate the token.',
  };
}

function changePassword(userId, oldPassword, newPassword) {
  const users = demoUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return { ok: false, error: 'User not found' };
  if (user.demoPassword !== oldPassword) return { ok: false, error: 'Current password is incorrect' };
  if (newPassword.length < 8) return { ok: false, error: 'New password must be at least 8 characters' };
  user.demoPassword = newPassword;
  window.__sraswati_storage.writeCollection('users', users);
  audit('auth.change_password', { userId });
  return { ok: true };
}

window.__sraswati_auth = {
  isDemoMode,
  isAuthenticated,
  getCurrentUser,
  getSession,
  hasRole,
  hasPermission,
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshActivity,
  SESSION_TIMEOUT_MS,
};
