/* sessions.js — Session management (demo) */

function allSessions() {
  return window.__sraswati_storage.readCollection('sessions', []);
}

function currentSession() {
  return window.__sraswati_storage.readSession();
}

function createSessionRecord(user) {
  const sessions = allSessions();
  const record = {
    id: 'sess_' + Math.random().toString(36).slice(2, 12),
    userId: user.id,
    userName: user.name,
    email: user.email,
    role: user.role,
    device: navigator ? navigator.userAgent : 'demo',
    startedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    status: 'active',
    ip: 'demo-client',
  };
  sessions.push(record);
  window.__sraswati_storage.writeCollection('sessions', sessions);
  window.__sraswati_state.patch('sessions', () => sessions);
  window.__sraswati_audit('sessions.view', { sessionId: record.id, userId: user.id });
  return record;
}

function revokeSession(sessionId) {
  const sessions = allSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return { ok: false, error: 'Session not found' };
  sessions[idx].status = 'revoked';
  sessions[idx].revokedAt = new Date().toISOString();
  window.__sraswati_storage.writeCollection('sessions', sessions);
  window.__sraswati_state.patch('sessions', () => sessions);
  window.__sraswati_audit('sessions.revoke', { sessionId });
  return { ok: true };
}

function revokeAllSessions(userId) {
  const sessions = allSessions();
  let revoked = 0;
  sessions.forEach((s) => {
    if (s.userId === userId && s.status === 'active') {
      s.status = 'revoked';
      s.revokedAt = new Date().toISOString();
      revoked += 1;
    }
  });
  if (revoked > 0) {
    window.__sraswati_storage.writeCollection('sessions', sessions);
    window.__sraswati_state.patch('sessions', () => sessions);
  }
  return { ok: true, revoked };
}

function updateSessionActivity() {
  const sessions = allSessions();
  const session = currentSession();
  if (!session) return;
  const record = sessions.find((s) => s.id === session.id);
  if (record) {
    record.lastActivity = new Date().toISOString();
    window.__sraswati_storage.writeCollection('sessions', sessions);
    window.__sraswati_state.patch('sessions', () => sessions);
  }
}

window.__sraswati_sessions = {
  allSessions, currentSession, createSessionRecord, revokeSession, revokeAllSessions, updateSessionActivity,
};
