import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getCategoryCounts, getProducts, type ProductSort } from "@/lib/queries";
import { PageHeader } from "@/components/site/page-header";
import { ProductFilters } from "@/components/site/product-filters";
import { ProductCard } from "@/components/site/product-card";
import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = { title: "Products" };

const SORTS: ProductSort[] = ["featured", "newest", "price-asc", "price-desc"];

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : undefined;
  const sort = SORTS.find((s) => s === sp.sort) ?? "featured";
  const categories = await getCategories();
  const products = await getProducts({ category, q, sort });
  const counts = Object.fromEntries(await getCategoryCounts());
  const total = (await getProducts()).length;
  const current = categories.find((c) => c.slug === category);

  return (
    <>
      <PageHeader
        eyebrow={current ? "Category" : "Shop"}
        title={current ? current.name : "The complete catalogue."}
        description={current?.description || "Notebooks, writing instruments, art supplies and office essentials — every product tested by our team. Need large quantities? Ask for bulk pricing."}
        crumbs={current ? [{ label: "Products", href: "/products" }, { label: current.name }] : [{ label: "Products" }]}
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <Suspense>
          <ProductFilters categories={categories} counts={counts} total={total} />
        </Suspense>
        <p className="mt-6 text-sm text-muted-foreground">
          Showing {products.length} of {total} products{q ? ` for “${q}”` : ""}
        </p>
        {products.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">No products match your search. Try another category or keyword.</p>
        ) : (
          <div key={`${category}-${q}-${sort}`} className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
      <CtaBand title="Buying for a team or school?" text="Get volume discounts from 50 units, custom branding and a dedicated account manager." primary={{ label: "Explore bulk orders", href: "/bulk-orders" }} secondary={{ label: "Contact sales", href: "/contact?type=bulk" }} />
    </>
  );
}
