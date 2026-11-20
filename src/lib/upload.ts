import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { del, put } from "@vercel/blob";

export const UPLOAD_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "uploads");

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

// Vercel Blob when its token is configured (production); the local data/uploads folder otherwise.
const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Saves an uploaded image and returns its public URL, or null if no file was sent. */
export async function saveImage(file: FormDataEntryValue | null): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Only JPG, PNG, WEBP or AVIF images are allowed.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB.");
  const name = `${crypto.randomUUID()}.${ext}`;

  if (blobEnabled()) {
    const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type });
    return blob.url;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/media/${name}`;
}

/** Removes an image we stored (Blob or local). Stock photo URLs are left alone. */
export async function deleteImage(url: string | null | undefined) {
  if (!url) return;
  if (url.startsWith("/media/")) {
    await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, path.basename(url)), { force: true });
  } else if (blobEnabled() && url.includes(".blob.vercel-storage.com/")) {
    await del(url);
  }
}
