# Pilates Universidad — Project Roadmap

**Target:** working site by mid-December 2026 (~11 weeks from today, Sept 26).
**Note:** week ranges below are rough estimates, not commitments — they assume a fairly consistent weekly time block; adjust once you know your real pace after Phase 1.

---

## Phase 0 — Foundations (parallel, ongoing)

- [ ] Work through the Next.js course (in parallel with your class covering JS)
- [ ] Learn Tailwind basics; drop Bootstrap
- [ ] Scaffold the Next.js project, wire up Tailwind with your rebrand palette (Paper, Ink, Pine, Stone, Silver)
- [ ] Set up a git repo from day one — not optional once you're building something real

## Phase 1 — Data & Schema (~1–2 wks)

Leverages your existing SQL knowledge; doesn't require Next.js fluency.

- [ ] ER design: Clients, Instructors, ClassTypes, ClassOccurrences (schedule slots), Bookings (status column: confirmed/waitlisted/cancelled), PackageCredits (per-client ledger)
- [ ] Choose DB host (Neon or Supabase) — check current free-tier limits/pause behavior before committing
- [ ] Prisma schema + migrations
- [ ] Seed realistic test data (8 spots + 3 waitlist per class, sample clients, sample bookings)

## Phase 2 — Admin CRUD (~2–4 wks) → **Demo milestone**

- [ ] CRUD pages: Clients, Instructors, Class schedule/time slots
- [ ] Class roster view (who's booked into a given class occurrence)
- [ ] Styling pass with brand palette — this needs to look finished, it's what you're demoing
- [ ] **Meet with the owner:** show the CRUD demo, discuss budget/pricing, and get answers on the open business questions below

### Open questions to resolve at that meeting

- [ ] Exact token/credit numbers (package sizes, expiry edge cases)
- [ ] Online booking-ahead limit for clients
- [ ] Whether the free diagnostic class is Friday-only
- [ ] His budget / what he's willing to invest

## Phase 3 — Public Site & Auth (~1–2 wks)

- [ ] Public pages: Inicio / Quiénes somos / Clases, matching the rebrand
- [ ] Client accounts (signup/login)
- [ ] Staff/owner role-gated admin section (NextAuth)

## Phase 4 — Booking Engine (~2–3 wks)

The hardest part — business logic, not syntax.

- [ ] **Concurrency-safe booking** (DB transaction/row lock) — this is the one flagged earlier; don't skip it
- [ ] Waitlist promotion when a confirmed spot frees up
- [ ] Package-credit consumption on booking, refund on valid cancellation
- [ ] Tiered reschedule/cancellation windows (24h+ / 12–24h / <12h)
- [ ] VIP standing reservations (reduced open-spot count per class)

## Phase 5 — Payments (~1–2 wks)

- [ ] Pick a processor — compare Stripe vs. Conekta/Mercado Pago for OXXO/SPEI support in Mexico
- [ ] Checkout flow + webhook handling (payment confirmed → booking confirmed)
- [ ] Package purchase flow (buying credits)

## Phase 6 — Testing & Deployment (~1–2 wks)

- [ ] Test capacity edge cases: concurrent bookings on the last seat, waitlist promotion, reschedule tiers, VIP overlap
- [ ] Deploy: Vercel Pro (required for commercial use), production DB, domain, env vars
- [ ] Walk the owner and staff through the finished admin panel

## Phase 7 — Post-launch (ongoing)

- [ ] Maintenance retainer covering hosting + a set support-hours allowance
- [ ] Track bug reports / feature requests separately from the retainer scope
