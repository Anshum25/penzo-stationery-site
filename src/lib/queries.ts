import "server-only";
import { and, asc, count, desc, eq, like, or } from "drizzle-orm";
import { categories, db, posts, products, testimonials } from "@/lib/db";

const productWithCategory = {
  id: products.id,
  name: products.name,
  slug: products.slug,
  sku: products.sku,
  description: products.description,
  price: products.price,
  image: products.image,
  featured: products.featured,
  inStock: products.inStock,
  categoryId: products.categoryId,
  categoryName: categories.name,
  categorySlug: categories.slug,
  illustration: categories.illustration,
  accent: categories.accent,
};

export type ProductCardData = Awaited<ReturnType<typeof getProducts>>[number];

export function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)).all();
}

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc";

export function getProducts(opts: { category?: string; q?: string; featured?: boolean; sort?: ProductSort } = {}) {
  const filters = [];
  if (opts.category) filters.push(eq(categories.slug, opts.category));
  if (opts.featured) filters.push(eq(products.featured, true));
  if (opts.q) {
    const term = `%${opts.q}%`;
    filters.push(or(like(products.name, term), like(products.description, term)));
  }
  return db
    .select(productWithCategory)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(...orderFor(opts.sort ?? "featured"))
    .all();
}

function orderFor(sort: ProductSort) {
  switch (sort) {
    case "newest":
      return [desc(products.createdAt)];
    case "price-asc":
      return [asc(products.price)];
    case "price-desc":
      return [desc(products.price)];
    default:
      return [desc(products.featured), desc(products.createdAt)];
  }
}

export function getCategoryCounts() {
  const rows = db.select({ id: products.categoryId, n: count() }).from(products).groupBy(products.categoryId).all();
  return new Map(rows.map((r) => [r.id, r.n]));
}

export function getProductBySlug(slug: string) {
  return db
    .select(productWithCategory)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .get();
}

export function getPublishedTestimonials() {
  return db.select().from(testimonials).where(eq(testimonials.published, true)).all();
}

export function getPosts(opts: { limit?: number; topic?: string } = {}) {
  const q = db
    .select()
    .from(posts)
    .where(and(eq(posts.published, true), opts.topic ? eq(posts.topic, opts.topic) : undefined))
    .orderBy(desc(posts.createdAt));
  return opts.limit ? q.limit(opts.limit).all() : q.all();
}

export function getPostBySlug(slug: string) {
  return db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.published, true))).get();
}

/** Rough reading time at ~220 words per minute. */
export function readingMinutes(body: string) {
  return Math.max(1, Math.round(body.split(/\s+/).length / 220));
}
