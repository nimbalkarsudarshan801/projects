/* validators.js — Form input validation (frontend demo)
   All validation is client-side. Production validation must also run on the
   server. Returns { valid: boolean, errors: Record<string, string> }. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s\+\-\(\)]{7,20}$/;
const ISBN_RE = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|[0-9X]{13}$)\d{1,5}[- ]?\d{1,7}[- ]?\d{1,6}[- ]?\d{1,9}[- ]?[0-9X]$/;

function required(value, field) {
  if (value === null || value === undefined) return `${field} is required`;
  if (typeof value === 'string' && value.trim() === '') return `${field} is required`;
  return null;
}

function email(value, field) {
  if (!value || value.trim() === '') return `${field} is required`;
  if (!EMAIL_RE.test(value.trim())) return `Enter a valid ${field}`;
  return null;
}

function phone(value, field) {
  if (!value || value.trim() === '') return `${field} is required`;
  if (!PHONE_RE.test(value.trim())) return `Enter a valid ${field}`;
  return null;
}

function minLength(value, field, len) {
  if (!value || value.toString().trim().length < len) return `${field} must be at least ${len} characters`;
  return null;
}

function maxLength(value, field, len) {
  if (value && value.toString().length > len) return `${field` must be at most ${len} characters`;
  return null;
}

function passwordStrength(value) {
  let score = 0;
  if (!value) return { score: 0, feedback: 'Enter a password' };
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  if (value.length >= 12) score += 1;
  const feedback = score <= 1 ? 'Too weak' : score <= 2 ? 'Weak' : score <= 3 ? 'Fair' : score <= 4 ? 'Strong' : 'Very strong';
  return { score, feedback, level: Math.min(score, 4) };
}

function confirmPassword(value, other, field) {
  if (value !== other) return `${field} does not match`;
  return null;
}

function isbn(value, field) {
  if (!value || value.trim() === '') return `${field} is required`;
  const clean = value.replace(/[- ]/g, '');
  if (!/^\d{10}$|^\d{13}$/.test(clean)) return `Enter a valid ISBN-10 or ISBN-13 ${field}`;
  return null;
}

function positiveNumber(value, field) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return `${field} must be a positive number`;
  return null;
}

function dateNotPast(value, field) {
  if (!value) return `${field} is required`;
  const d = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) return `${field} cannot be in the past`;
  return null;
}

function dateRange(from, to) {
  if (!from || !to) return null;
  if (new Date(to) < new Date(from)) return 'End date must be after start date';
  return null;
}

function validate(rules, data) {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    for (let i = 0; i < fieldRules.length; i++) {
      const err = fieldRules[i](data[field], field, data);
      if (err) {
        errors[field] = err;
        break;
      }
    }
  });
  return { valid: Object.keys(errors).length === 0, errors };
}

function sanitizeText(text) {
  if (typeof text !== 'string') return String(text ?? '');
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeHtml(text) {
  if (typeof text !== 'string') return String(text ?? '');
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.__sraswati_validators = {
  required,
  email,
  phone,
  minLength,
  maxLength,
  passwordStrength,
  confirmPassword,
  isbn,
  positiveNumber,
  dateNotPast,
  dateRange,
  validate,
  sanitizeText,
  escapeHtml,
  EMAIL_RE,
  PHONE_RE,
  ISBN_RE,
};
