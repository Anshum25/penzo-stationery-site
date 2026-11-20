# Penzo — stationery website + admin

Next.js 16 · Tailwind v4 · shadcn/ui · Motion · GSAP · Lenis · Drizzle ORM on libSQL (SQLite / Turso)

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:setup             # creates data/app.db with demo content + the admin account
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

Locally the database is the file `data/app.db` and uploads go to `data/uploads/` (both git-ignored).

## Deploying to Vercel

Production uses **Turso** (hosted SQLite) for the database and **Vercel Blob** for uploaded images,
because Vercel's servers can't keep files on disk.

1. In the Vercel project, open **Storage** and add a **Turso** database and a **Blob** store.
   They set `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` and `BLOB_READ_WRITE_TOKEN` automatically.
2. Add `SESSION_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` as environment variables.
3. Pull them locally and set up the production database once:
   ```bash
   vercel env pull .env.production.local --environment=production
   npm run db:setup:prod
   ```
4. Deploy with `vercel --prod` (or push to the connected Git branch).

Forgot the admin password? Update `ADMIN_PASSWORD` and run `npm run admin:reset` (local) or
`npm run admin:reset:prod` (production).

## Where things live

- `src/lib/site.ts` — brand name, contact details, nav
- `src/lib/content.ts` — copy for About, Bulk orders, FAQs
- `src/app/(site)` — public pages · `src/app/admin` — admin panel
- `src/lib/db` — schema, client and setup/seed · `scripts/` — database scripts
