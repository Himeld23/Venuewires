# Venue Wires — marketplace prototype

Next.js (App Router) prototype of the Venue Wires venue & event marketplace: find → filter → compare → check availability → enquire, plus partner and admin areas. Uses seed data (real venues from venuewires.in; ratings, vendors and dashboard figures are placeholders).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production check
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → import the repo**. Framework preset is detected automatically (Next.js); no env vars or settings are needed.
3. Deploy. Every later `git push` redeploys.

(CLI alternative: `npx vercel` then `npx vercel --prod`.)

## Demo logins (`/partner/login`)

| Role | Email | Password |
|---|---|---|
| Vendor | vendor@venuewires.demo | Vendor@123 |
| Venue | venue@venuewires.demo | Venue@123 |
| Admin | admin@venuewires.demo | Admin@123 |

## Prototype limits

- Accounts, listings and sessions are stored in the **browser's localStorage** (per device/browser), not a server. Passwords are plaintext. Replace with real auth + database in the backend phase.
- `POST /api/enquiry` is a stub that only logs and returns a reference number.
- All data access goes through `src/lib/api.ts` (venues/vendors) and `src/lib/auth.ts` / `src/lib/listings.ts` (partner area) — swap those for real API calls later.
