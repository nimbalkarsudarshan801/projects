/* notifications.js — Toast notification system */

const containerId = 'sraswati-toasts';
let container = null;

function ensureContainer() {
  if (container) return container;
  container = document.createElement('div');
  container.id = containerId;
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

function removeToast(el) {
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translatex(120%)';
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 300);
}

function toast({ type = 'info', message, title, duration = 5000, action, actionLabel }) {
  ensureContainer();
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const iconMap = { success: '✓', error: '✕', warn: '⚠', info: 'ℹ' };
  let html = `<span class="toast-icon">${iconMap[type] || 'ℹ'}</span><div><div style="font-weight:600">${escape(textOrEmpty(title))}</div><div style="font-size:13px;opacity:0.9">${escape(textOrEmpty(message))}</div></div>`;
  if (action && actionLabel) {
    html += `<button class="toast close" onclick="__sraswati_notifications.dismiss(this.closest('.toast')); ${action.toString().replace(/"/g, '&quot;')}">${escape(actionLabel)}</button>`;
  } else {
    html += `<button class="toast close" onclick="__sraswati_notifications.dismiss(this.closest('.toast'))">✕</button>`;
  }
  el.innerHTML = html;
  container.prepend(el);
  if (duration > 0) {
    setTimeout(() => removeToast(el), duration);
  }
  return el;
}

function success(message, title) { return toast({ type: 'success', message, title }); }
function error(message, title) { return toast({ type: 'error', message, title }); }
function warn(message, title) { return toast({ type: 'warn', message, title }); }
function info(message, title) { return toast({ type: 'info', message, title }); }

function dismiss(el) {
  removeToast(el);
}

function clearAll() {
  if (!container) return;
  while (container.firstChild) container.removeChild(container.firstChild);
}

function escape(s) {
  if (typeof s !== 'string') return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function textOrEmpty(s) {
  return s == null ? '' : String(s);
}

window.__sraswati_notifications = {
  toast, success, error, warn, info, dismiss, clearAll,
};
