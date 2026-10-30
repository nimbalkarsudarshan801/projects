/* audit.js — Audit event log (frontend demo)
   Records privileged actions for the audit-logs view. Production must
   persist these server-side with tamper-evident storage. */

const AUDIT_KEY = 'sraswati_demo_v1:auditLogs';

function audit(action, metadata = {}) {
  const session = window.__sraswati_storage.readSession();
  const user = window.__sraswati_state.getCurrentUser();
  const entry = {
    id: 'audit_' + Math.random().toString(36).slice(2, 12),
    action,
    actorId: user ? user.id : null,
    actorName: user ? user.name : 'system',
    actorRole: session ? session.role : null,
    metadata,
    ip: 'demo-client', // frontend-only: no real IP access
    userAgent: navigator ? navigator.userAgent : 'demo',
    createdAt: new Date().toISOString(),
  };
  const logs = window.__sraswati_storage.readCollection('auditLogs', []);
  logs.unshift(entry);
  if (logs.length > 1000) logs.length = 1000;
  window.__sraswati_storage.writeCollection('auditLogs', logs);
  window.__sraswati_state.patch('auditLogs', () => logs);
  return entry;
}

function getAuditLogs(filters = {}) {
  let logs = window.__sraswati_storage.readCollection('auditLogs', []);
  if (filters.action) logs = logs.filter((l) => l.action.includes(filters.action));
  if (filters.actor) logs = logs.filter((l) => l.actorName && l.actorName.toLowerCase().includes(filters.actor.toLowerCase()));
  if (filters.role) logs = logs.filter((l) => l.actorRole === filters.role);
  if (filters.from) logs = logs.filter((l) => l.createdAt >= filters.from);
  if (filters.to) logs = logs.filter((l) => l.createdAt <= filters.to);
  return logs;
}

function clearAuditLogs() {
  window.__sraswati_storage.writeCollection('auditLogs', []);
  window.__sraswati_state.patch('auditLogs', () => []);
}

window.__sraswati_audit = { audit, getAuditLogs, clearAuditLogs };
