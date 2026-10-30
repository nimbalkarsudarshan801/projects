/* permissions.js — Role-based access control (frontend demo)
   Backend must enforce authorization for every protected operation.
   Hiding buttons is NOT sufficient. This module supports route guards and
   control-level checks in demo mode. */

const ROLES = {
  superadmin: 'Superadmin',
  admin: 'Admin',
  librarian: 'Librarian',
  student: 'Student',
};

const DEFAULT_PERMS = {
  superadmin: [
    'dashboard.view', 'users.view', 'users.create', 'users.edit', 'users.disable',
    'roles.manage', 'permissions.manage',
    'books.view', 'books.create', 'books.edit', 'books.archive',
    'inventory.manage',
    'loans.issue', 'loans.return', 'loans.renew',
    'seats.view', 'seats.manage',
    'bookings.create', 'bookings.cancel',
    'payments.view', 'payments.record', 'payments.review', 'payments.approve', 'payments.reject', 'payments.refund.request',
    'fines.manage',
    'reports.view', 'reports.export',
    'sessions.view', 'sessions.revoke',
    'settings.manage', 'security.audit.view', 'storage.maintenance', 'data.export',
  ],
  admin: [
    'dashboard.view', 'users.view', 'users.create', 'users.edit',
    'books.view', 'books.create', 'books.edit', 'books.archive',
    'inventory.manage',
    'loans.issue', 'loans.return', 'loans.renew',
    'seats.view', 'seats.manage',
    'bookings.create', 'bookings.cancel',
    'payments.view', 'payments.record', 'payments.review', 'payments.approve', 'payments.reject',
    'fines.manage',
    'reports.view', 'reports.export',
    'sessions.view',
  ],
  librarian: [
    'dashboard.view',
    'books.view', 'books.edit',
    'inventory.manage',
    'loans.issue', 'loans.return', 'loans.renew',
    'seats.view',
    'bookings.view',
    'payments.view', 'payments.record',
    'fines.view',
    'reports.view',
  ],
  student: [
    'dashboard.view',
    'books.view',
    'loans.view',
    'seats.view',
    'bookings.create', 'bookings.cancel',
    'payments.view', 'payments.record',
    'fines.view',
    'profile.edit',
  ],
};

function roleForUser(user) {
  if (!user) return null;
  return user.role || 'student';
}

function permissionsForRole(role) {
  return DEFAULT_PERMS[role] || [];
}

function hasPermission(roleOrUser, permission) {
  const role = typeof roleOrUser === 'string' ? roleOrUser : roleForUser(roleOrUser);
  if (role === 'superadmin') return true;
  return permissionsForRole(role).includes(permission);
}

function canAccessRoute(role, route) {
  const routeRoles = {
    '/superadmin': ['superadmin'],
    '/admin': ['superadmin', 'admin'],
    '/librarian': ['superadmin', 'admin', 'librarian'],
    '/student': ['superadmin', 'admin', 'librarian', 'student'],
  };
  const allowed = routeRoles[route];
  if (!allowed) return true;
  return allowed.includes(role);
}

function navItemsForRole(role) {
  const base = [
    { label: 'Dashboard', href: 'dashboard.html', icon: '🏠', perm: 'dashboard.view' },
  ];
  const byRole = {
    superadmin: [
      { label: 'Accounts & Roles', href: 'accounts-roles.html', icon: '👥', perm: 'users.view' },
      { label: 'Permissions', href: 'permissions.html', icon: '🔑', perm: 'permissions.manage' },
      { label: 'System Settings', href: 'system-settings.html', icon: '⚙️', perm: 'settings.manage' },
      { label: 'Payment Gateway', href: 'payment-gateway-settings.html', icon: '💳', perm: 'settings.manage' },
      { label: 'Audit Logs', href: 'audit-logs.html', icon: '📜', perm: 'security.audit.view' },
      { label: 'Active Sessions', href: 'active-sessions.html', icon: '🔐', perm: 'sessions.view' },
      { label: 'Privacy & Security', href: 'privacy-security.html', icon: '🛡️', perm: 'security.audit.view' },
      { label: 'Storage Diagnostics', href: 'storage-diagnostics.html', icon: '💾', perm: 'storage.maintenance' },
      { label: 'Backup / Export', href: 'backup-export.html', icon: '📦', perm: 'data.export' },
      { label: 'Feature Flags', href: 'feature-flags.html', icon: '🚩', perm: 'settings.manage' },
    ],
    admin: [
      { label: 'Users', href: 'users.html', icon: '👥', perm: 'users.view' },
      { label: 'Librarians', href: 'librarians.html', icon: '📚', perm: 'users.view' },
      { label: 'Students', href: 'students.html', icon: '🎓', perm: 'users.view' },
      { label: 'Catalogue', href: 'catalogue.html', icon: '📖', perm: 'books.view' },
      { label: 'Categories', href: 'categories.html', icon: '🏷️', perm: 'books.view' },
      { label: 'Inventory', href: 'inventory.html', icon: '📦', perm: 'inventory.manage' },
      { label: 'Seat Management', href: 'seat-management.html', icon: '🪑', perm: 'seats.view' },
      { label: 'Bookings', href: 'bookings.html', icon: '📅', perm: 'bookings.create' },
      { label: 'Payments', href: 'payments.html', icon: '💳', perm: 'payments.view' },
      { label: 'Payment Approvals', href: 'payment-approvals.html', icon: '✅', perm: 'payments.review' },
      { label: 'Membership Plans', href: 'membership-plans.html', icon: '💳', perm: 'payments.view' },
      { label: 'Fines', href: 'fines.html', icon: '⚠️', perm: 'fines.manage' },
      { label: 'Reports', href: 'reports.html', icon: '📊', perm: 'reports.view' },
      { label: 'Settings', href: 'settings.html', icon: '⚙️', perm: 'settings.manage' },
    ],
    librarian: [
      { label: 'Catalogue', href: 'catalogue.html', icon: '📖', perm: 'books.view' },
      { label: 'Issue / Return', href: 'issue-return.html', icon: '🔄', perm: 'loans.issue' },
      { label: 'Reservations', href: 'reservations.html', icon: '📋', perm: 'bookings.view' },
      { label: 'Member Search', href: 'member-search.html', icon: '🔍', perm: 'users.view' },
    ],
    student: [
      { label: 'Membership', href: 'membership.html', icon: '💳', perm: 'dashboard.view' },
      { label: 'Books', href: 'books.html', icon: '📖', perm: 'books.view' },
      { label: 'Book Loans', href: 'book-loans.html', icon: '📚', perm: 'loans.view' },
      { label: 'Seat Booking', href: 'seat-booking.html', icon: '🪑', perm: 'seats.view' },
      { label: 'My Bookings', href: 'my-bookings.html', icon: '📅', perm: 'bookings.create' },
      { label: 'Payments', href: 'payments.html', icon: '💳', perm: 'payments.view' },
      { label: 'Fines', href: 'fines.html', icon: '⚠️', perm: 'fines.view' },
      { label: 'Profile', href: 'profile.html', icon: '👤', perm: 'profile.edit' },
    ],
  };
  const items = [...base, ...(byRole[role] || [])];
  return items.filter((item) => !item.perm || hasPermission(role, item.perm));
}

window.__sraswati_permissions = {
  ROLES,
  roleForUser,
  permissionsForRole,
  hasPermission,
  canAccessRoute,
  navItemsForRole,
  DEFAULT_PERMS,
};
