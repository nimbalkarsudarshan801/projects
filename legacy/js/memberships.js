/* memberships.js — Membership plans & subscriptions (demo) */

function allMembershipPlans() {
  return window.__sraswati_storage.readCollection('membershipPlans', []);
}

function allMemberships() {
  return window.__sraswati_storage.readCollection('memberships', []);
}

function membershipForUser(userId) {
  return allMemberships().find((m) => m.userId === userId);
}

function activeMembershipForUser(userId) {
  const m = membershipForUser(userId);
  if (!m) return null;
  const now = new Date();
  return m.status === 'active' && new Date(m.expiresAt) > now ? m : null;
}

function createMembershipPlan(data) {
  const plans = allMembershipPlans();
  const plan = {
    id: 'plan_' + Math.random().toString(36).slice(2, 10),
    name: data.name,
    durationDays: Number(data.durationDays) || 30,
    price: Number(data.price) || 0,
    currency: 'INR',
    borrowLimit: Number(data.borrowLimit) || 5,
    description: data.description || '',
    active: data.active !== false,
    createdAt: new Date().toISOString(),
  };
  plans.push(plan);
  window.__sraswati_storage.writeCollection('membershipPlans', plans);
  return { ok: true, plan };
}

function updateMembershipPlan(id, data) {
  const plans = allMembershipPlans();
  const idx = plans.findIndex((p) => p.id === id);
  if (idx === -1) return { ok: false, error: 'Plan not found' };
  Object.assign(plans[idx], data, { updatedAt: new Date().toISOString() });
  window.__sraswati_storage.writeCollection('membershipPlans', plans);
  return { ok: true, plan: plans[idx] };
}

function purchaseMembership({ userId, planId, amount, method, reference }) {
  const plans = allMembershipPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return { ok: false, error: 'Plan not found' };
  const now = new Date();
  const expiresAt = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
  const memberships = allMemberships();
  // Deactivate existing
  memberships.forEach((m) => { if (m.userId === userId) m.status = 'expired'; });
  const membership = {
    id: 'mem_' + Math.random().toString(36).slice(2, 10),
    userId, planId,
    planName: plan.name,
    status: 'pending', // pending -> active (after payment approval)
    startedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    borrowLimit: plan.borrowLimit,
    amount: plan.price,
    paymentMethod: method,
    paymentReference: reference,
  };
  memberships.push(membership);
  window.__sraswati_storage.writeCollection('memberships', memberships);
  window.__sraswati_audit('payments.record', { membershipId: membership.id, userId, planId, amount });
  return { ok: true, membership, plan };
}

function activateMembership(userId) {
  const memberships = allMemberships();
  const membership = memberships.find((m) => m.userId === userId && m.status === 'pending');
  if (!membership) return false;
  membership.status = 'active';
  membership.activatedAt = new Date().toISOString();
  const idx = memberships.findIndex((m) => m.id === membership.id);
  memberships[idx] = membership;
  window.__sraswati_storage.writeCollection('memberships', memberships);
  return true;
}

function renewMembership(userId, planId, amount, method, reference) {
  return purchaseMembership({ userId, planId, amount, method, reference });
}

window.__sraswati_memberships = {
  allMembershipPlans, allMemberships, membershipForUser, activeMembershipForUser,
  createMembershipPlan, updateMembershipPlan, purchaseMembership, activateMembership, renewMembership,
};
