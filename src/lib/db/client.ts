import path from "node:path";
import { createClient } from "@libsql/client";

/**
 * Which database to use:
 * - Turso when TURSO_DATABASE_URL is set (production, once the Vercel integration is added)
 * - the bundled read-only demo database when deployed without Turso (frontend-only preview)
 * - the local data/app.db file in development
 */
export const isReadOnlyDemo = !process.env.TURSO_DATABASE_URL && Boolean(process.env.VERCEL);

export function createDbClient() {
  const url =
    process.env.TURSO_DATABASE_URL ??
    (isReadOnlyDemo ? `file:${path.join(/*turbopackIgnore: true*/ process.cwd(), "demo", "penzo-demo.db")}` : "file:data/app.db");
  return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
}
