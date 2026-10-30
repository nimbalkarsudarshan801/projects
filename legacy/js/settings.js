/* settings.js — Application settings (demo)
   Payment gateway configuration fields are UI only. Secret values are NOT
   stored in browser storage. Production secrets belong on the backend. */

const SETTINGS_DEFAULTS = {
  appName: 'SraswatiLibrary',
  razorpayKeyId: '', // UI only; backend supplies real key
  razorpayEnvironment: 'test', // test | live
  razorpayCheckoutEnabled: false,
  razorpayMethods: ['upi', 'card', 'netbanking', 'wallet', 'emi'],
  currency: 'INR',
  seatHoldMinutes: 15,
  seatBookingAdvanceDays: 7,
  loanDays: 14,
  maxLoansPerStudent: 5,
  finePerDay: 5,
  fineCurrency: 'INR',
  approvalRequiredForPayments: true,
  autoApproveRazorpay: false,
  membershipRenewalGraceDays: 7,
  openingHours: '9:00 – 21:00',
  contactEmail: 'help@sraswatilibrary.example',
  contactPhone: '+91 22 0000 0000',
  address: 'Library Building, Campus Road, Mumbai, India',
  theme: 'dark',
  cookieConsent: { essential: true, analytics: false, marketing: false },
  termsVersion: '1.0',
  privacyVersion: '1.0',
};

function allSettings() {
  return window.__sraswati_storage.readCollection('settings', SETTINGS_DEFAULTS);
}

function getSetting(key) {
  const s = allSettings();
  return s[key] !== undefined ? s[key] : SETTINGS_DEFAULTS[key];
}

function updateSetting(key, value) {
  const s = allSettings();
  s[key] = value;
  s.updatedAt = new Date().toISOString();
  window.__sraswati_storage.writeCollection('settings', s);
  window.__sraswati_state.patch('settings', () => s);
  window.__sraswati_audit('settings.manage', { key });
  return { ok: true };
}

function updateSettings(values) {
  const s = allSettings();
  Object.assign(s, values, { updatedAt: new Date().toISOString() });
  window.__sraswati_storage.writeCollection('settings', s);
  window.__sraswati_state.patch('settings', () => s);
  window.__sraswati_audit('settings.manage', { keys: Object.keys(values) });
  return { ok: true };
}

// Never expose real secret. Returns masked placeholder only.
function razorpaySecretStatus() {
  return { configured: !!getSetting('razorpaySecretConfigured'), masked: '••••••••••••••••' };
}

window.__sraswati_settings = {
  allSettings, getSetting, updateSetting, updateSettings, SETTINGS_DEFAULTS, razorpaySecretStatus,
};
