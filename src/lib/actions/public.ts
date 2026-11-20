"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, enquiries } from "@/lib/db";
import { isReadOnlyDemo } from "@/lib/db/client";
import { site } from "@/lib/site";
import type { FormState } from "./types";

const EnquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Enter a valid email"),
  phone: z.string().trim().max(20).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  type: z.enum(["general", "bulk"]).default("general"),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
});

export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = EnquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  const unavailable = `Our form is temporarily unavailable — please email us at ${site.email} or call ${site.phone}.`;
  if (isReadOnlyDemo) return { message: unavailable };
  try {
    await db.insert(enquiries).values({ ...parsed.data, createdAt: new Date() }).run();
  } catch (e) {
    console.error("Failed to save enquiry", e);
    return { message: unavailable };
  }
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Thanks! We'll get back to you within one business day." };
}
