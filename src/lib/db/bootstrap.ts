import type Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { unsplash } from "@/lib/images";
import { demoPosts } from "./demo-posts";

const DDL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  illustration TEXT NOT NULL DEFAULT 'notebook',
  accent TEXT NOT NULL DEFAULT '#e4572e',
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  image TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  in_stock INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'general',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  topic TEXT NOT NULL DEFAULT 'Guides',
  cover TEXT,
  author TEXT NOT NULL DEFAULT 'Penzo Team',
  published INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  published INTEGER NOT NULL DEFAULT 1
);
`;

const demoCategories = [
  ["Notebooks & Journals", "notebooks", "Hardbound, softcover and dotted journals for every kind of thinker.", "notebook", "#b5532f", "1601001435957-74f0958a93fb"],
  ["Pens & Writing", "pens", "Gel, fountain and fineliner pens that glide on every page.", "pen", "#2f4b7c", "1455390582262-044cdead277a"],
  ["Art Supplies", "art", "Colours, brushes and sketch kits for students and artists.", "art", "#b8862b", "1561559679-ee3af236f671"],
  ["Office Essentials", "office", "Files, desk organisers and everyday tools for focused work.", "office", "#3d6b5c", "1654931800100-2ecf6eee7c64"],
  ["Planners & Diaries", "planners", "Undated planners and diaries to make every week count.", "planner", "#5a4e7c", "1506784983877-45594efa4cbe"],
  ["Gift Sets", "gifts", "Curated boxes for corporate gifting and special moments.", "gift", "#8c4a5c", "1707944145479-12755f0434d8"],
] as const;

// Photo per demo product, matched by SKU order.
export const demoProductPhotos = [
  "1677064061401-f77f966ff8a1",
  "1576611209860-e3ad12547e8d",
  "1610089219534-80872697800a",
  "1590761131910-614cda70445f",
  "1518674660708-0e2c0473e68e",
  "1725953236941-ec8efc71b0fc",
  "1571157806504-643bfe75765f",
  "1565359184520-fcff70f99c24",
  "1751107756601-66fa542b0e3c",
  "1750935578389-6e1445f5fd8d",
  "1632772998001-cc9bf6f7c852",
  "1719622144233-7f4a09ee199b",
];

const demoProducts: [string, string, number, string, boolean][] = [
  ["Signature A5 Hardbound Journal", "notebooks", 449, "192 pages of 100 GSM ivory paper, lay-flat binding and a ribbon marker.", true],
  ["Dot Grid Bullet Notebook", "notebooks", 349, "5mm dot grid for planners, sketches and lists. Fountain-pen friendly.", true],
  ["Kraft Pocket Notebooks (Pack of 3)", "notebooks", 199, "Recycled kraft covers, ruled inside. Fits any pocket.", false],
  ["Glide Gel Pen Set (10 colours)", "pens", 299, "Quick-dry 0.5mm gel ink in ten bright colours.", true],
  ["Brass Fountain Pen", "pens", 1299, "Solid brass body that ages beautifully. Includes converter and 6 cartridges.", true],
  ["Fineliner Studio Pack", "pens", 399, "0.1–0.8mm archival ink fineliners for drawing and lettering.", false],
  ["Watercolour Travel Kit", "art", 899, "24 pan colours, water brush and a mixing palette in a tin.", true],
  ["Graphite Sketching Set", "art", 349, "12 pencils from 6H to 8B with a kneaded eraser.", false],
  ["Desk Organiser – Oak Finish", "office", 1099, "Three compartments, phone stand and pen tray.", true],
  ["Premium Box File (Set of 4)", "office", 549, "Sturdy laminated box files with spring clips.", false],
  ["2027 Undated Weekly Planner", "planners", 599, "Undated weekly spreads, habit trackers and goal pages.", true],
  ["Corporate Welcome Kit", "gifts", 1499, "Journal, pen, planner and desk mug — customisable with your logo.", true],
];

const demoTestimonials = [
  ["Priya Shah", "Architect", "The paper quality is unreal. My fountain pens finally have a home that doesn't bleed."],
  ["Rohan Mehta", "HR Lead, Finverse", "We ordered 400 welcome kits with our branding. Delivered early and everyone loved them."],
  ["Ananya Iyer", "Illustrator", "The watercolour kit goes everywhere with me. Gorgeous pigments for the price."],
  ["Kabir Desai", "Student, NID", "Best dot grid notebook I've used. My entire semester lives in it."],
  ["Meera Joshi", "School Principal", "Reliable bulk supply for our school every term — and wonderful service."],
] as const;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function bootstrap(sqlite: Database.Database) {
  sqlite.exec(DDL);
  migrate(sqlite);

  sqlite
    .transaction(() => {
      const userCount = sqlite.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number };
      if (userCount.c === 0) {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (email && password) {
          sqlite
            .prepare("INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)")
            .run("Admin", email.toLowerCase(), bcrypt.hashSync(password, 10), Date.now());
        }
      }

      const postCount = sqlite.prepare("SELECT COUNT(*) AS c FROM posts").get() as { c: number };
      if (postCount.c === 0) {
        const insertPost = sqlite.prepare(
          "INSERT INTO posts (title, slug, excerpt, body, topic, cover, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        );
        demoPosts.forEach((p, i) =>
          insertPost.run(p.title, slugify(p.title), p.excerpt, p.body, p.topic, unsplash(p.cover, 1600), Date.now() - i * 5 * 86_400_000),
        );
      }

      const catCount = sqlite.prepare("SELECT COUNT(*) AS c FROM categories").get() as { c: number };
      if (catCount.c > 0) return;

      const insertCat = sqlite.prepare(
        "INSERT INTO categories (name, slug, description, illustration, accent, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      );
      const catIds = new Map<string, number>();
      demoCategories.forEach(([name, slug, desc, ill, accent, photo], i) => {
        catIds.set(slug, Number(insertCat.run(name, slug, desc, ill, accent, unsplash(photo, 1200), i).lastInsertRowid));
      });

      const insertProduct = sqlite.prepare(
        "INSERT INTO products (name, slug, sku, description, price, category_id, image, featured, in_stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)",
      );
      demoProducts.forEach(([name, cat, price, desc, featured], i) => {
        insertProduct.run(
          name,
          slugify(name),
          `PNZ-${String(i + 1).padStart(3, "0")}`,
          desc,
          price,
          catIds.get(cat) ?? null,
          unsplash(demoProductPhotos[i], 900),
          featured ? 1 : 0,
          Date.now() - i * 1000,
        );
      });

      const insertT = sqlite.prepare("INSERT INTO testimonials (name, role, quote, rating) VALUES (?, ?, ?, 5)");
      demoTestimonials.forEach(([n, r, q]) => insertT.run(n, r, q));
    })
    .immediate();
}

/** Additive schema changes for databases created by earlier versions. */
function migrate(sqlite: Database.Database) {
  const cols = sqlite.prepare("PRAGMA table_info(categories)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "image")) {
    sqlite.exec("ALTER TABLE categories ADD COLUMN image TEXT");
  }
}
