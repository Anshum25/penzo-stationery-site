// Builds demo/penzo-demo.db: demo catalogue, articles and testimonials only — no admin account.
// The deployed site reads it (read-only) until a Turso database is connected.
import fs from "node:fs";
import { createClient } from "@libsql/client";
import { setupDatabase } from "../src/lib/db/setup";

const file = "demo/penzo-demo.db";
fs.mkdirSync("demo", { recursive: true });
fs.rmSync(file, { force: true });
delete process.env.ADMIN_EMAIL;
delete process.env.ADMIN_PASSWORD;

const client = createClient({ url: `file:${file}` });
await client.execute("PRAGMA journal_mode = DELETE"); // no -wal/-shm files, so it works on a read-only disk
await setupDatabase(client);
for (const t of ["users", "categories", "products", "posts", "testimonials"]) {
  console.log(t.padEnd(13), (await client.execute(`SELECT COUNT(*) AS c FROM ${t}`)).rows[0].c);
}
await client.execute("VACUUM");
client.close();
console.log(`Wrote ${file} (${fs.statSync(file).size} bytes).`);
