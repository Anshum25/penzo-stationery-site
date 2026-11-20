import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, users } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession } from "@/lib/jwt";

export async function createSession(userId: number, email: string) {
  const token = await signSession({ userId, email });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

// Data Access Layer: every admin page and action goes through this.
export const requireAdmin = cache(async () => {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");
  const user = db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, session.userId))
    .get();
  if (!user) redirect("/admin/login");
  return user;
});
