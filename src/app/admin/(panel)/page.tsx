import Link from "next/link";
import { count, desc, eq, gte } from "drizzle-orm";
import { ArrowRight, ArrowUpRight, Inbox, MessageSquareQuote, Package, PackageX, Plus, Star } from "lucide-react";
import { categories, db, enquiries, products, testimonials } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PageTitle } from "@/components/admin/page-title";
import { BarList, ColumnChart } from "@/components/admin/charts";

const DAY = 86_400_000;

export default async function DashboardPage() {
  const total = async (t: typeof products | typeof categories | typeof enquiries | typeof testimonials) =>
    (await db.select({ v: count() }).from(t).get())?.v ?? 0;
  const [productTotal, categoryTotal, enquiryTotal, testimonialTotal] = await Promise.all([
    total(products),
    total(categories),
    total(enquiries),
    total(testimonials),
  ]);
  const featured = (await db.select({ v: count() }).from(products).where(eq(products.featured, true)).get())?.v ?? 0;
  const outOfStock = (await db.select({ v: count() }).from(products).where(eq(products.inStock, false)).get())?.v ?? 0;
  const newCount = (await db.select({ v: count() }).from(enquiries).where(eq(enquiries.status, "new")).get())?.v ?? 0;
  const recent = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(6).all();

  // Enquiries per day, last 30 days.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today.getTime() - 29 * DAY);
  const last30 = await db.select({ createdAt: enquiries.createdAt, type: enquiries.type }).from(enquiries).where(gte(enquiries.createdAt, start)).all();
  const daily = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(start.getTime() + i * DAY);
    return { label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), value: 0, t: d.getTime() };
  });
  for (const e of last30) {
    const idx = Math.floor((e.createdAt.getTime() - start.getTime()) / DAY);
    if (daily[idx]) daily[idx].value++;
  }
  const bulk30 = last30.filter((e) => e.type === "bulk").length;

  const byCategory = await db
    .select({ label: categories.name, value: count(products.id) })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(desc(count(products.id)))
    .all();

  const stats = [
    { label: "Products", value: productTotal, sub: `${featured} featured`, icon: Package, href: "/admin/products" },
    { label: "Out of stock", value: outOfStock, sub: outOfStock ? "needs attention" : "all items available", icon: PackageX, href: "/admin/products?stock=out" },
    { label: "New enquiries", value: newCount, sub: `${enquiryTotal} total`, icon: Inbox, href: "/admin/enquiries?status=new" },
    { label: "Testimonials", value: testimonialTotal, sub: `${categoryTotal} categories`, icon: MessageSquareQuote, href: "/admin/testimonials" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageTitle title={greeting} description="Here's what's happening on your website.">
        <Link href="/" target="_blank" className={buttonVariants({ variant: "outline", size: "lg" })}>
          View site <ArrowUpRight />
        </Link>
        <Link href="/admin/products/new" className={buttonVariants({ size: "lg" })}>
          <Plus /> Add product
        </Link>
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
              <CardContent className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-2 font-display text-4xl font-semibold tabular-nums">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-ink group-hover:text-paper">
                  <s.icon className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Enquiries, last 30 days</CardTitle>
            <CardDescription>
              {last30.length} received · {bulk30} bulk / corporate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ColumnChart data={daily} label="Enquiries per day, last 30 days" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Products by category</CardTitle>
            <CardDescription>How your catalogue is spread</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList data={byCategory} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Latest enquiries</CardTitle>
            <CardDescription>Most recent messages from the contact forms</CardDescription>
          </div>
          <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            View all <ArrowRight className="size-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Inbox className="size-8 text-muted-foreground" />
              <p className="font-medium">No enquiries yet</p>
              <p className="text-sm text-muted-foreground">They&apos;ll appear here when visitors use the contact or quote forms.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {recent.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
                      {e.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">
                        {e.name} {e.company && <span className="font-normal text-muted-foreground">· {e.company}</span>}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{e.message}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {e.type === "bulk" && <Badge variant="outline"><Star className="size-3" /> Bulk</Badge>}
                    <Badge variant={e.status === "new" ? "default" : "secondary"} className="capitalize">{e.status}</Badge>
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {e.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
