import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const illustrations = ["notebook", "pen", "pencil", "art", "office", "planner", "gift"] as const;
export type Illustration = (typeof illustrations)[number];

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  illustration: text("illustration").$type<Illustration>().notNull().default("notebook"),
  accent: text("accent").notNull().default("#e4572e"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").notNull().default(""),
  description: text("description").notNull().default(""),
  price: real("price").notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  image: text("image"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const enquiries = sqliteTable("enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  company: text("company").notNull().default(""),
  type: text("type").$type<"general" | "bulk">().notNull().default("general"),
  message: text("message").notNull(),
  status: text("status").$type<"new" | "read" | "replied">().notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  topic: text("topic").notNull().default("Guides"),
  cover: text("cover"),
  author: text("author").notNull().default("Penzo Team"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export type Category = typeof categories.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
