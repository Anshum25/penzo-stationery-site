import "server-only";
import { drizzle } from "drizzle-orm/libsql";
import type { Client } from "@libsql/client";
import { createDbClient } from "./client";
import * as schema from "./schema";

// Reuse one client across hot reloads in dev. Tables are created by `npm run db:setup`.
const globalForDb = globalThis as unknown as { libsql?: Client };
const client = globalForDb.libsql ?? createDbClient();
if (process.env.NODE_ENV !== "production") globalForDb.libsql = client;

export const db = drizzle(client, { schema });
export * from "./schema";
