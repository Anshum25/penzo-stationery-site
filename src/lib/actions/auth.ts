"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, users } from "@/lib/db";
import { isReadOnlyDemo } from "@/lib/db/client";
import { createSession, deleteSession } from "@/lib/auth";
import type { FormState } from "./types";

const LoginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isReadOnlyDemo) return { message: "The admin panel is turned off in this preview — it opens once the database is connected." };
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  const user = await db.select().from(users).where(eq(users.email, parsed.data.email.toLowerCase())).get();
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!user || !valid) return { message: "Invalid email or password." };

  await createSession(user.id, user.email);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
