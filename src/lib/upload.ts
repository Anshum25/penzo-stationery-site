import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { UPLOAD_DIR } from "@/lib/db";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Saves an uploaded image and returns its public URL, or null if no file was sent. */
export async function saveImage(file: FormDataEntryValue | null): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Only JPG, PNG, WEBP or AVIF images are allowed.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB.");
  const name = `${crypto.randomUUID()}.${ext}`;
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/media/${name}`;
}

export async function deleteImage(url: string | null | undefined) {
  if (!url?.startsWith("/media/")) return;
  await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, path.basename(url)), { force: true });
}
