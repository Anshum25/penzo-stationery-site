// Sets the admin account's password (creating the account if missing) from ADMIN_EMAIL / ADMIN_PASSWORD.
// Local: `npm run admin:reset`. Production: `npm run admin:reset:prod`.
import bcrypt from "bcryptjs";
import { createDbClient } from "../src/lib/db/client";

const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD first.");
  process.exit(1);
}
const client = createDbClient();
const hash = bcrypt.hashSync(password, 10);
const updated = await client.execute({ sql: "UPDATE users SET password_hash = ? WHERE email = ?", args: [hash, email] });
if (updated.rowsAffected === 0) {
  await client.execute({
    sql: "INSERT INTO users (name, email, password_hash, created_at) VALUES ('Admin', ?, ?, ?)",
    args: [email, hash, Date.now()],
  });
  console.log(`Created admin account ${email}.`);
} else {
  console.log(`Password updated for ${email}.`);
}
client.close();
