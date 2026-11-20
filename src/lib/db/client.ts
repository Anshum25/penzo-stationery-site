import { createClient } from "@libsql/client";

/**
 * Turso in production (TURSO_DATABASE_URL + TURSO_AUTH_TOKEN, set by the Vercel integration);
 * a local SQLite file in development.
 */
export function createDbClient() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL ?? "file:data/app.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}
