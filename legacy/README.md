# SraswatiLibrary

Frontend demo of a library management system with role-based dashboards (Student, Librarian, Admin, Superadmin). Built as a single-page multi-file HTML demo with ES modules, localStorage persistence, and a demo Razorpay adapter.

**This is a frontend-only demo.** No backend, database, or real payment gateway is included. All data persists in browser `localStorage`/`sessionStorage` and resets when cleared.

## Project structure

```
SraswatiLibrary/
├── index.html                      # Landing / entry point
├── login.html | register.html | forgot-password.html | reset-password.html
├── terms.html | privacy.html | help.html
├── index.html.bak                  # Backup of the original bundled file
├── css/
│   ├── tokens.css                  # Design tokens (colors, fonts, spacing)
│   ├── global.css                  # Base resets and typography
│   ├── components.css              # Buttons, inputs, cards, tags, chips
│   ├── forms.css                   # Form fields and validation styles
│   ├── tables.css                  # Table and table-wrap styles
│   ├── public.css                  # Public page styles
│   ├── dashboard.css               # Shared dashboard shell (sidebar, topbar, stats)
│   ├── admin.css                   # Admin-specific components
│   ├── student.css                 # Student-specific components
│   ├── modals.css                  # Modal/dialog styles
│   └── responsive.css              # Mobile sidebar overlay
├── js/
│   ├── app.js                      # Initializer, re-exports, auth guards (requireRole/requirePermission)
│   ├── storage.js                  # localStorage-backed collection store
│   ├── state.js                    # App state hydration
│   ├── auth-demo.js                # Demo authentication (sessionStorage)
│   ├── validators.js               # Form validation helpers
│   ├── formatters.js               # Date, currency, status formatting
│   ├── notifications.js            # Toast notifications
│   ├── permissions.js              # Role-based access control + nav items
│   ├── audit.js                    # Audit logging
│   ├── books.js                    # Catalogue, copies, categories, inventory
│   ├── members.js                  # Users, librarians, students, CRUD
│   ├── loans.js                    # Issue, return, renew, overdue
│   ├── seats.js                    # Zones and seats
│   ├── bookings.js                 # Seat bookings, approve/reject, expiry
│   ├── payments.js                 # Payments, approvals, confirm/reject/refund, CSV export
│   ├── razorpay-adapter.js         # Demo Razorpay adapter (no secret key)
│   ├── fines.js                    # Fines, pay, waive, adjust
│   ├── memberships.js              # Membership plans and activation
│   ├── sessions.js                 # Sessions and revocation
│   ├── settings.js                 # Application settings
│   ├── reports.js                  # Report helpers
│   ├── seed-data.js                # Demo seed data (users, books, seats, etc.)
│   └── router.js                   # Route helpers and dashboard resolution
├── student/                        # Student portal (8 pages)
├── admin/                          # Admin panel (15 pages)
├── librarian/                      # Librarian desk (5 pages)
├── superadmin/                     # Superadmin console (11 pages)
├── data/                           # Static data placeholders
├── assets/{images,icons,fonts}     # Assets
└── tests/
    ├── functional-checklist.md
    └── regression-checklist.md
```

## Roles and demo credentials

| Role | Email | Password |
|------|-------|----------|
| Superadmin | superadmin@sraswatilibrary.example | admin1234 |
| Admin | admin@sraswatilibrary.example | admin1234 |
| Librarian | anita@sraswatilibrary.example | librarian1234 |
| Student | riya@student.example | student1234 |
| Student | rahul@student.example | student1234 |
| Student (disabled) | disabled@student.example | disabled1234 |

## Demo mode

- A "DEMO MODE" banner appears on every page explaining the simulation.
- Data is seeded into `localStorage` on first load if empty.
- Payments go through a demo Razorpay adapter — they are recorded as `pending` and require admin approval before entitlement activates.
- No real secrets, API keys, or passwords are stored.

## Backend requirements (not implemented)

The following features require a production backend and are clearly labelled as not implemented in the demo:

- Server-side authentication (Argon2id/bcrypt password hashing, JWT/sessions)
- Server-side authorization enforcement (frontend hiding buttons is NOT sufficient)
- PostgreSQL database (books, copies, users, loans, bookings, payments, fines)
- Real Razorpay integration with signature verification and secret key stored server-side
- Email notifications and password reset flows
- File uploads for payment proofs
- Cron-based seat hold expiry and overdue fine generation

See `tests/functional-checklist.md` for the full list of demo vs. backend-required items.

## Getting started

Open `index.html` in a modern browser. No build step, no dependencies to install.

```bash
# Serve locally (optional, avoids file:// CORS/module issues)
python3 -m http.server 8000
# then open http://localhost:8000
```

## Testing

See `tests/functional-checklist.md` and `tests/regression-checklist.md`.

## License

Demo / evaluation only.
