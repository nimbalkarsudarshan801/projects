/* members.js — Members & librarians (demo) */

function allUsers() {
  return window.__sraswati_storage.readCollection('users', []);
}

function findUser(id) {
  return allUsers().find((u) => u.id === id);
}

function allLibrarians() {
  return allUsers().filter((u) => u.role === 'librarian');
}

function allStudents() {
  return allUsers().filter((u) => u.role === 'student');
}

function createUser(data) {
  const users = allUsers();
  if (users.find((u) => u.email.toLowerCase() === String(data.email).toLowerCase())) {
    return { ok: false, error: 'Email already registered' };
  }
  const id = 'usr_' + Math.random().toString(36).slice(2, 10);
  const user = {
    id, name: data.name, email: data.email, phone: data.phone || '',
    role: data.role || 'student', roleId: 'role_' + (data.role || 'student'),
    status: data.status || 'active',
    demoPassword: data.password || 'demo1234',
    createdAt: new Date().toISOString(),
    createdBy: window.__sraswati_state.getCurrentUser() ? window.__sraswati_state.getCurrentUser().id : 'system',
  };
  users.push(user);
  window.__sraswati_storage.writeCollection('users', users);
  window.__sraswati_audit('users.create', { userId: id, role: user.role, email: user.email });
  return { ok: true, user };
}

function updateUser(id, data) {
  const users = allUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return { ok: false, error: 'User not found' };
  const user = users[idx];
  if (data.email && data.email !== user.email && users.find((u) => u.email.toLowerCase() === String(data.email).toLowerCase())) {
    return { ok: false, error: 'Email already in use' };
  }
  Object.assign(user, data, { updatedAt: new Date().toISOString() });
  users[idx] = user;
  window.__sraswati_storage.writeCollection('users', users);
  window.__sraswati_audit('users.edit', { userId: id });
  return { ok: true, user };
}

function setUserStatus(id, status) {
  const users = allUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return { ok: false, error: 'User not found' };
  user.status = status;
  user.updatedAt = new Date().toISOString();
  window.__sraswati_storage.writeCollection('users', users);
  window.__sraswati_audit(status === 'disabled' ? 'users.disable' : 'users.edit', { userId: id, status });
  return { ok: true, user };
}

function deleteUser(id) {
  const users = allUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return { ok: false, error: 'User not found' };
  const user = users[idx];
  users.splice(idx, 1);
  window.__sraswati_storage.writeCollection('users', users);
  window.__sraswati_audit('users.edit', { userId: id, action: 'delete' });
  return { ok: true };
}

function membershipForUser(userId) {
  const memberships = window.__sraswati_storage.readCollection('memberships', []);
  return memberships.find((m) => m.userId === userId && m.status === 'active');
}

window.__sraswati_members = {
  allUsers, findUser, allLibrarians, allStudents, createUser, updateUser,
  setUserStatus, deleteUser, membershipForUser,
};
