// Creates and seeds the database. Local: `npm run db:setup`. Production: `npm run db:setup:prod`.
import { createDbClient } from "../src/lib/db/client";
import { setupDatabase } from "../src/lib/db/setup";

const client = createDbClient();
const target = process.env.TURSO_DATABASE_URL ? "Turso" : "local file data/app.db";
await setupDatabase(client);
const tables = ["users", "categories", "products", "posts", "testimonials", "enquiries"];
for (const t of tables) {
  const n = (await client.execute(`SELECT COUNT(*) AS c FROM ${t}`)).rows[0].c;
  console.log(`${t.padEnd(13)} ${n}`);
}
console.log(`Database ready (${target}).`);
client.close();
