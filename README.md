# Gymdesk Lite

A working gym management web app for gym owners, built with:
- Next.js app router (web UI)
- Netlify Functions (API)
- Postgres (Neon recommended)

## Features
- Dashboard with key metrics and upcoming classes
- Members workflow (create, status toggle, delete)
- Classes workflow (create, list, delete)
- Bookings workflow (create, toggle booked/cancelled, delete)
- DB migration endpoint to create required tables

## Setup
1. Create a Postgres database.
2. Set env vars in Netlify or locally:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_API_BASE=/.netlify/functions`
   - Optional: `ADMIN_API_KEY` (if set, pass `Authorization: Bearer <key>`)
3. Run migration once:
   - `/.netlify/functions/migrate`
4. Start web app:
   - `npm run dev`

## Main routes
- `/` dashboard
- `/members`
- `/sessions`
- `/bookings`
