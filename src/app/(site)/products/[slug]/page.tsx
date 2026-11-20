import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, ChevronRight, Package, RotateCcw, Truck } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { formatPrice } from "@/lib/site";
import { ProductVisual } from "@/components/site/product-visual";
import { ProductCard } from "@/components/site/product-card";
import { ProductTabs } from "@/components/site/product-tabs";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, SplitReveal } from "@/components/motion/reveal";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

const tierRows = [
  { qty: "1 – 49", off: 0 },
  { qty: "50 – 199", off: 0.1 },
  { qty: "200 – 999", off: 0.2 },
];

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const related = product.categorySlug
    ? (await getProducts({ category: product.categorySlug })).filter((p) => p.id !== product.id).slice(0, 4)
    : [];

  const specs = [
    ["SKU", product.sku || "—"],
    ["Category", product.categoryName ?? "Stationery"],
    ["Availability", product.inStock ? "In stock" : "Out of stock"],
    ["Minimum bulk order", "50 units"],
    ["Custom branding", "Available on request"],
  ];

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-32 md:px-8 md:pt-40">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link href="/products" className="hover:text-ink">Products</Link>
          {product.categoryName && (
            <>
              <ChevronRight className="size-3.5" />
              <Link href={`/products?category=${product.categorySlug}`} className="hover:text-ink">{product.categoryName}</Link>
            </>
          )}
          <ChevronRight className="size-3.5" />
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 pb-24 md:grid-cols-2 md:gap-16">
          <Reveal y={40}>
            <div className="group overflow-hidden rounded-[2rem] md:sticky md:top-28">
              <ProductVisual
                image={product.image}
                name={product.name}
                illustration={product.illustration}
                accent={product.accent}
                className="aspect-square transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            </div>
          </Reveal>

          <div>
            {product.categoryName && (
              <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-vermilion uppercase">{product.categoryName}</p>
            )}
            <SplitReveal as="h1" animateOnMount text={product.name} className="font-display text-4xl leading-[1.05] font-semibold md:text-5xl" />
            <Reveal delay={0.15} y={20}>
              <div className="mt-6 flex items-baseline gap-4">
                <p className="font-display text-3xl font-semibold">{formatPrice(product.price)}</p>
                <span className={product.inStock ? "text-sm text-sage" : "text-sm text-destructive"}>
                  {product.inStock ? "● In stock" : "● Out of stock"}
                </span>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{product.description}</p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10">
                <p className="bg-card px-5 py-3 text-sm font-semibold">Volume pricing</p>
                <table className="w-full text-sm">
                  <tbody>
                    {tierRows.map((t) => (
                      <tr key={t.qty} className="border-t border-ink/10">
                        <td className="px-5 py-3 text-muted-foreground">{t.qty} units</td>
                        <td className="px-5 py-3 text-right font-medium">
                          {formatPrice(Math.round(product.price * (1 - t.off)))}
                          {t.off > 0 && <span className="ml-2 text-xs text-sage">−{t.off * 100}%</span>}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-ink/10">
                      <td className="px-5 py-3 text-muted-foreground">1,000+ units</td>
                      <td className="px-5 py-3 text-right font-medium">Custom quote</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/contact?type=bulk&product=${product.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-paper transition-colors hover:bg-vermilion"
                >
                  Enquire about this product
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/bulk-orders" className="inline-flex items-center rounded-full border border-ink/15 px-7 py-4 text-sm font-medium hover:border-ink">
                  Bulk pricing
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 border-y border-ink/10 py-6 text-sm sm:grid-cols-4">
                {[
                  { icon: BadgeCheck, label: "Quality tested" },
                  { icon: Truck, label: "Ships in 48h" },
                  { icon: RotateCcw, label: "7-day returns" },
                  { icon: Package, label: "Custom branding" },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-start gap-2">
                    <b.icon className="size-5" strokeWidth={1.6} />
                    <span className="text-muted-foreground">{b.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <ProductTabs
                  tabs={[
                    {
                      label: "Details",
                      content: (
                        <div className="space-y-4 leading-relaxed text-muted-foreground">
                          <p>{product.description}</p>
                          <p>Designed and quality-checked in our studio. Every unit is inspected before dispatch, and the product can be customised with your logo for orders of 100 units or more.</p>
                        </div>
                      ),
                    },
                    {
                      label: "Specifications",
                      content: (
                        <dl className="divide-y divide-ink/10 text-sm">
                          {specs.map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-4 py-3">
                              <dt className="text-muted-foreground">{k}</dt>
                              <dd className="font-medium">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      ),
                    },
                    {
                      label: "Shipping & returns",
                      content: (
                        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                          <p>Orders are dispatched within 48 hours and delivered across India in 3–7 working days.</p>
                          <p>Unused items in original packaging can be returned within 7 days of delivery. Custom-branded products are non-returnable.</p>
                          <Link href="/shipping" className="inline-block font-medium text-ink underline underline-offset-4">Read the full policy</Link>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl border-t border-ink/10 px-4 py-24 md:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">You might also like</h2>
            <Link href={`/products?category=${product.categorySlug}`} className="text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
