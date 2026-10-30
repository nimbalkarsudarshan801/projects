# Changelog

## [1.0.0] - 2026-10-30

### Added
- Role-based dashboards: Student, Librarian, Admin, Superadmin
- 51 HTML pages across public, student, admin, librarian, superadmin sections
- ES module architecture with shared `js/app.js` initializer and domain modules
- localStorage-based data persistence with demo seed data
- Demo authentication (sessionStorage) with role-based route guards
- Book catalogue, issue/return/renew, overdue fines
- Seat booking with zones, time slots, hold expiry, approve/reject workflow
- Payments with demo Razorpay adapter, pending approvals, approve/reject/refund
- Membership plans and activation
- User management (create, edit, enable/disable)
- Audit logging, active sessions, storage diagnostics, backup/export
- Feature flags and payment gateway settings (superadmin)
- Responsive dashboard shell with collapsible sidebar
- Dark theme with DM Sans + Fraunces typography

### Notes
- Frontend demo only. No backend/database.
- Original bundled `index.html` backed up as `index.html.bak`.
