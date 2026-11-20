# Penzo — stationery website + admin

Next.js 16 · Tailwind v4 · shadcn/ui · Motion · GSAP ScrollTrigger · Lenis · SQLite (Drizzle)

## Run

```bash
npm install
cp .env.example .env.local   # set SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev
```

The database (`data/app.db`) is created automatically on first run with demo
categories, products and testimonials, plus the admin account from `.env.local`.

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

## Where things live

- `src/lib/site.ts` — brand name, contact details, nav (edit this first for the client)
- `src/app/(site)` — public pages (home, products, product detail, contact)
- `src/app/admin` — admin panel (dashboard, products, categories, enquiries, testimonials)
- `src/components/site` — homepage sections; `src/components/motion` — animation primitives
- `src/lib/actions` — server actions; `src/lib/db` — schema and auto-setup

## Deploying

SQLite and uploaded images are stored in `data/`, so host on a server with a
persistent disk (VPS, Railway, Render, Fly). For Vercel, switch to Postgres
(e.g. Neon) and object storage for images.
