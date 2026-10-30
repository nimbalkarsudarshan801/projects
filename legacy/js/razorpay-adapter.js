/* razorpay-adapter.js — Razorpay checkout adapter (frontend demo)
   IMPORTANT: This is a DEMO-ONLY adapter. It does NOT process real payments.
   A production integration requires:
     1. Backend to create Razorpay orders (server-side, secret key never in browser)
     2. Razorpay SDK loaded from https://checkout.razorpay.com/v1/checkout.js
     3. Server-side signature verification
     4. Webhook handling for trusted payment status
   The Razorpay secret key must NEVER be embedded in JavaScript, HTML, or
   browser storage. This adapter simulates the UI flow and records the
   attempt as a pending payment awaiting administrative approval. */

const RAZORPAY_SDK_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let sdkLoaded = false;
let sdkLoadPromise = null;

function loadRazorpaySDK() {
  if (sdkLoadPromise) return sdkLoadPromise;
  sdkLoadPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) {
      sdkLoaded = true;
      resolve(window.Razorpay);
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SDK_URL;
    script.async = true;
    script.onload = () => {
      sdkLoaded = true;
      resolve(window.Razorpay);
    };
    script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
    document.head.appendChild(script);
  });
  return sdkLoadPromise;
}

function isConfigured() {
  // In frontend-demo mode there is no backend-provided Key ID.
  // A real integration reads the Key ID from a server endpoint.
  return false;
}

function supportedMethods() {
  return [
    { id: 'upi', label: 'UPI', enabled: true },
    { id: 'card', label: 'Debit / Credit Card', enabled: true },
    { id: 'netbanking', label: 'Net Banking', enabled: true },
    { id: 'wallet', label: 'Wallets', enabled: true },
    { id: 'emi', label: 'EMI', enabled: true },
  ];
}

async function attemptDemoCheckout({ amount, currency = 'INR', description, orderId, userId, type, relatedId, reference }) {
  // Record the payment attempt as pending (never as captured)
  const result = window.__sraswati_payments.createPayment({
    userId,
    amount,
    method: 'razorpay',
    reference,
    type,
    relatedId,
    notes: `Demo Razorpay attempt: ${description}`,
  });
  window.__sraswati_notifications.warn(
    'Payment initiated (demo). It is recorded as Pending and requires administrative approval before access is activated.',
    'Razorpay Demo'
  );
  return { ok: true, demo: true, payment: result.payment, approval: result.approval, requiresApproval: true };
}

async function openCheckout(options) {
  await loadRazorpaySDK();
  if (!window.Razorpay) {
    throw new Error('Razorpay SDK not available');
  }
  return new Promise((resolve, reject) => {
    const instance = new window.Razorpay({
      ...options,
      handler: (response) => {
        // NOTE: Razorpay handler response must NEVER be trusted as proof of payment.
        // The backend must verify the signature. In demo mode we record as pending.
        resolve({ razorpay: response, trusted: false });
      },
      onerror: (err) => reject(err || new Error('Checkout failed')),
    });
    instance.open();
  });
}

window.__sraswati_razorpay = {
  loadRazorpaySDK,
  isConfigured,
  supportedMethods,
  attemptDemoCheckout,
  openCheckout,
  RAZORPAY_SDK_URL,
  demoNotice: 'Razorpay integration requires a backend to create orders and verify signatures. The secret key is never exposed to the browser.',
};
