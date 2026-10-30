# Regression Checklist

Run after any change to shared modules (`js/app.js`, `js/auth-demo.js`, `js/permissions.js`, `js/storage.js`, `js/state.js`, `js/router.js`, `css/tokens.css`, `css/global.css`, `css/dashboard.css`) or any page.

## Shared modules
- [ ] All 51 HTML pages load without console errors
- [ ] `js/app.js` imports resolve on every page (relative `../js/app.js` from role pages, `./js/app.js` from root pages)
- [ ] Demo seed data loads when `localStorage` is empty (fresh browser/incognito)
- [ ] Existing `localStorage` data is NOT overwritten on reload
- [ ] `requireAuth` redirects unauthenticated users to `login.html`
- [ ] `requireRole` restricts pages to correct roles; wrong role redirects to own dashboard
- [ ] `requirePermission` blocks unauthorized actions
- [ ] Logout clears session and redirects to login
- [ ] DEMO MODE banner renders and dismisses via localStorage
- [ ] Toast notifications appear and auto-dismiss

## Navigation
- [ ] Every sidebar nav link points to an existing page
- [ ] Active nav item highlighted correctly per page
- [ ] Mobile menu toggle opens/closes sidebar (≤900px)
- [ ] Sidebar overlay closes on click

## CSS / styling
- [ ] Dark theme colors applied (bg #0E1116, card #12171E, border #232A33, text #F3EFE6, accent #FFC247)
- [ ] Fonts DM Sans + Fraunces load from Google Fonts
- [ ] Responsive layout on mobile (sidebar overlay, stacked cards)
- [ ] No horizontal overflow on tables (`table-wrap`)

## Data integrity
- [ ] Creating a user persists to `users` collection
- [ ] Issuing a book creates a loan and marks copy `issued`
- [ ] Returning a book marks copy `available` and creates fine if overdue
- [ ] Creating a booking creates a pending payment + approval record
- [ ] Approving a payment activates the related entitlement (membership/booking/fine)
- [ ] Rejecting a payment marks it `rejected`
- [ ] CSV export produces valid CSV for payments/loans
- [ ] Backup/export downloads valid JSON snapshot

## Role boundaries
- [ ] Student cannot access `/admin`, `/librarian`, `/superadmin` paths
- [ ] Librarian cannot access `/admin` or `/superadmin` paths
- [ ] Admin cannot access `/superadmin` paths
- [ ] Superadmin can access all paths

## Browser compatibility
- [ ] Chrome/Edge: modules load, localStorage works
- [ ] Firefox: modules load, localStorage works
- [ ] Safari: modules load, localStorage works
