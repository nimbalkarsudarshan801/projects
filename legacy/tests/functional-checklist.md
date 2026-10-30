# Functional Checklist

Demo verification steps. Open `index.html` in a browser and log in with the demo credentials in README.md.

## Public pages
- [ ] Landing page loads with hero, features, and CTA
- [ ] Register page creates a new account (demo)
- [ ] Login page authenticates with demo credentials (all 4 roles)
- [ ] Forgot password / reset password flows load
- [ ] Terms and Privacy pages load
- [ ] Help page loads
- [ ] DEMO MODE banner visible; dismissible; "Learn more" shows info toast

## Student portal (riya@student.example / student1234)
- [ ] Dashboard shows welcome and quick actions
- [ ] Membership page shows plan and option to get membership (pending approval)
- [ ] Books catalogue lists books with covers and availability
- [ ] Book details page loads for a selected book
- [ ] Book Loans shows active loans, due dates, renew button, history
- [ ] Renew a loan (active, under 2 renewals) succeeds
- [ ] Seat Booking: pick date, slot, zone, seat; proceed to payment creates pending booking
- [ ] My Bookings lists bookings with status and approval; cancel pending booking works
- [ ] Payments lists payment history; pending approvals shown
- [ ] Fines page shows outstanding balance; pay fine creates pending payment
- [ ] Session history lists active sessions; revoke works
- [ ] Profile edit saves name/email/phone
- [ ] Logout returns to login

## Librarian desk (anita@sraswatilibrary.example / librarian1234)
- [ ] Dashboard shows active loans, overdue, pending bookings, outstanding fines
- [ ] Catalogue lists books and inventory counts
- [ ] Issue / Return: issue a book to a member; record a return (auto fine if overdue)
- [ ] Reservations lists pending seat bookings; approve/reject works
- [ ] Member Search finds students, shows active loans and outstanding fines

## Admin panel (admin@sraswatilibrary.example / admin1234)
- [ ] Dashboard shows system stats
- [ ] Users: create, edit, enable/disable accounts
- [ ] Librarians / Students lists with enable/disable
- [ ] Catalogue: add/edit/archive books
- [ ] Categories: add/delete categories
- [ ] Inventory: view copies, mark a copy damaged
- [ ] Seat Management: view zones and seats with status
- [ ] Bookings: list all bookings; approve/reject pending
- [ ] Payments: list all payments; view detail
- [ ] Payment Approvals: approve/reject pending payments
- [ ] Membership Plans: list plans, activate/deactivate
- [ ] Fines: list fines, pay/waive
- [ ] Reports: view stats, export loans/payments CSV
- [ ] Settings: save app configuration

## Superadmin console (superadmin@sraswatilibrary.example / admin1234)
- [ ] Dashboard shows user counts by role
- [ ] Accounts & Roles: create accounts, view role definitions
- [ ] Permissions: view permissions by role (read-only demo)
- [ ] System Settings: save global config
- [ ] Payment Gateway: configure demo Razorpay settings
- [ ] Audit Logs: view action history
- [ ] Active Sessions: list and revoke sessions
- [ ] Privacy & Security: save cookie consent
- [ ] Storage Diagnostics: view collections, clear individual/all
- [ ] Backup / Export: download JSON snapshot and per-collection CSV
- [ ] Feature Flags: toggle flags (demo)

## Backend-required (NOT implemented — label only)
- [ ] Server-side password hashing (Argon2id/bcrypt)
- [ ] Server-side authorization enforcement
- [ ] PostgreSQL database persistence
- [ ] Real Razorpay secret key + signature verification
- [ ] Email notifications / password reset email
- [ ] File upload for payment proofs
- [ ] Cron-based seat hold expiry and overdue fine generation
