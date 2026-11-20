import "server-only";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { bootstrap } from "./bootstrap";

export const DATA_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

function open() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const sqlite = new Database(path.join(/*turbopackIgnore: true*/ DATA_DIR, "app.db"));
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("busy_timeout = 5000");
  sqlite.pragma("foreign_keys = ON");
  bootstrap(sqlite);
  return sqlite;
}

// Reuse one connection across hot reloads in dev.
const globalForDb = globalThis as unknown as { sqlite?: Database.Database };
const sqlite = globalForDb.sqlite ?? open();
if (process.env.NODE_ENV !== "production") globalForDb.sqlite = sqlite;

export const db = drizzle(sqlite, { schema });
export * from "./schema";
