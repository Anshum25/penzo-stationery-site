"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { categories, db, enquiries, illustrations, posts, products, testimonials } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { deleteImage, saveImage } from "@/lib/upload";
import type { FormState } from "./types";

function refresh() {
  revalidatePath("/", "layout");
}

function isUniqueError(e: unknown) {
  return e instanceof Error && e.message.includes("UNIQUE");
}

/* ---------- Products ---------- */

const ProductSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z.string().trim().optional(),
  sku: z.string().trim().max(40).default(""),
  description: z.string().trim().max(4000).default(""),
  price: z.coerce.number().min(0, "Price must be positive"),
  categoryId: z.coerce.number().int().positive().nullable().catch(null),
  featured: z.literal("on").optional(),
  inStock: z.literal("on").optional(),
  removeImage: z.literal("on").optional(),
});

export async function saveProduct(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = ProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };
  const d = parsed.data;

  let image: string | null | undefined;
  try {
    image = await saveImage(formData.get("image"));
  } catch (e) {
    return { errors: { image: [(e as Error).message] } };
  }

  const existing = id ? db.select().from(products).where(eq(products.id, id)).get() : undefined;
  if (id && !existing) return { message: "Product not found." };
  if (image || d.removeImage) await deleteImage(existing?.image);

  const values = {
    name: d.name,
    slug: slugify(d.slug || d.name),
    sku: d.sku,
    description: d.description,
    price: d.price,
    categoryId: d.categoryId,
    featured: d.featured === "on",
    inStock: d.inStock === "on",
    image: image ?? (d.removeImage ? null : (existing?.image ?? null)),
  };

  try {
    if (id) db.update(products).set(values).where(eq(products.id, id)).run();
    else db.insert(products).values({ ...values, createdAt: new Date() }).run();
  } catch (e) {
    if (isUniqueError(e)) return { errors: { slug: ["Another product already uses this URL slug."] } };
    throw e;
  }

  refresh();
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  const p = db.select().from(products).where(eq(products.id, id)).get();
  if (!p) return;
  db.delete(products).where(eq(products.id, id)).run();
  await deleteImage(p.image);
  refresh();
}

export async function toggleProductFlag(id: number, flag: "featured" | "inStock", value: boolean) {
  await requireAdmin();
  db.update(products).set({ [flag]: value }).where(eq(products.id, id)).run();
  refresh();
}

/* ---------- Categories ---------- */

const CategorySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().max(500).default(""),
  illustration: z.enum(illustrations),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Pick a colour"),
  sortOrder: z.coerce.number().int().default(0),
});

export async function saveCategory(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = CategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };
  let image: string | null = null;
  try {
    image = await saveImage(formData.get("image"));
  } catch (e) {
    return { errors: { image: [(e as Error).message] } };
  }
  const existing = id ? db.select().from(categories).where(eq(categories.id, id)).get() : undefined;
  if (image) await deleteImage(existing?.image);
  const values = { ...parsed.data, slug: slugify(parsed.data.name), ...(image ? { image } : {}) };
  try {
    if (id) db.update(categories).set(values).where(eq(categories.id, id)).run();
    else db.insert(categories).values(values).run();
  } catch (e) {
    if (isUniqueError(e)) return { errors: { name: ["A category with this name already exists."] } };
    throw e;
  }
  refresh();
  return { ok: true, message: id ? "Category updated" : "Category created" };
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  db.delete(categories).where(eq(categories.id, id)).run();
  refresh();
}

/* ---------- Enquiries ---------- */

export async function setEnquiryStatus(id: number, status: "new" | "read" | "replied") {
  await requireAdmin();
  db.update(enquiries).set({ status }).where(eq(enquiries.id, id)).run();
  revalidatePath("/admin", "layout");
}

export async function deleteEnquiry(id: number) {
  await requireAdmin();
  db.delete(enquiries).where(eq(enquiries.id, id)).run();
  revalidatePath("/admin", "layout");
}

/* ---------- Testimonials ---------- */

const TestimonialSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  role: z.string().trim().max(120).default(""),
  quote: z.string().trim().min(10, "Quote is too short").max(600),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  published: z.literal("on").optional(),
});

export async function saveTestimonial(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = TestimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };
  const values = { ...parsed.data, published: parsed.data.published === "on" };
  if (id) db.update(testimonials).set(values).where(eq(testimonials.id, id)).run();
  else db.insert(testimonials).values(values).run();
  refresh();
  return { ok: true, message: id ? "Testimonial updated" : "Testimonial added" };
}

export async function deleteTestimonial(id: number) {
  await requireAdmin();
  db.delete(testimonials).where(eq(testimonials.id, id)).run();
  refresh();
}

/* ---------- Journal ---------- */

const PostSchema = z.object({
  title: z.string().trim().min(4, "Title is required"),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().max(300).default(""),
  body: z.string().trim().min(20, "Write at least a couple of sentences"),
  topic: z.string().trim().min(2, "Topic is required").max(40),
  author: z.string().trim().max(60).default("Penzo Team"),
  published: z.literal("on").optional(),
  removeImage: z.literal("on").optional(),
});

export async function savePost(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = PostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };
  const d = parsed.data;

  let cover: string | null = null;
  try {
    cover = await saveImage(formData.get("image"));
  } catch (e) {
    return { errors: { image: [(e as Error).message] } };
  }
  const existing = id ? db.select().from(posts).where(eq(posts.id, id)).get() : undefined;
  if (id && !existing) return { message: "Article not found." };
  if (cover || d.removeImage) await deleteImage(existing?.cover);

  const values = {
    title: d.title,
    slug: slugify(d.slug || d.title),
    excerpt: d.excerpt,
    body: d.body,
    topic: d.topic,
    author: d.author || "Penzo Team",
    published: d.published === "on",
    cover: cover ?? (d.removeImage ? null : (existing?.cover ?? null)),
  };
  try {
    if (id) db.update(posts).set(values).where(eq(posts.id, id)).run();
    else db.insert(posts).values({ ...values, createdAt: new Date() }).run();
  } catch (e) {
    if (isUniqueError(e)) return { errors: { slug: ["Another article already uses this URL slug."] } };
    throw e;
  }
  refresh();
  redirect("/admin/journal");
}

export async function deletePost(id: number) {
  await requireAdmin();
  const p = db.select().from(posts).where(eq(posts.id, id)).get();
  if (!p) return;
  db.delete(posts).where(eq(posts.id, id)).run();
  await deleteImage(p.cover);
  refresh();
}

export async function setPostPublished(id: number, published: boolean) {
  await requireAdmin();
  db.update(posts).set({ published }).where(eq(posts.id, id)).run();
  refresh();
}
