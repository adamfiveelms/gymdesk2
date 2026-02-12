# AdamDesk (starter)

This is a deployable starter for AdamDesk using:
- Next.js (web UI)
- Netlify Functions (API)
- Postgres (Neon recommended)

## Deploy steps (quick)
1) Create a Neon Postgres DB, copy the connection string.
2) In Netlify site settings, add env var:
   - DATABASE_URL = your postgres connection string
   - NEXT_PUBLIC_API_BASE = /.netlify/functions
3) Deploy.
4) Run migration once:
   - Visit: https://YOUR_SITE.netlify.app/.netlify/functions/migrate

## Local env
Copy `web/.env.local.example` to `web/.env.local`
