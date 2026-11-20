import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { audiences, brandingOptions, bulkFaqs, tiers } from "@/lib/content";
import { getProducts } from "@/lib/queries";
import { photos, unsplash } from "@/lib/images";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Process } from "@/components/site/process";
import { ProductCard } from "@/components/site/product-card";
import { ContactForm } from "@/components/site/contact-form";
import { Faq } from "@/components/site/faq";
import { ParallaxImage } from "@/components/site/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bulk & corporate orders",
  description: "Wholesale pricing, custom branding and reliable delivery for businesses, schools and events.",
};

export default async function BulkOrdersPage() {
  const popular = (await getProducts())
    .filter((p) => ["gifts", "office", "notebooks", "planners"].includes(p.categorySlug ?? ""))
    .slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Bulk & corporate"
        title="Stationery for teams, schools and events."
        description="Wholesale pricing from 50 units, in-house custom branding and a dedicated account manager — delivered anywhere in India."
        crumbs={[{ label: "Bulk Orders" }]}
        image={unsplash(photos.gift, 2000)}
      >
        <Link href="#quote" className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-paper transition-colors hover:bg-vermilion">
          Get a quote <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="#pricing" className="inline-flex items-center rounded-full border border-ink/15 px-7 py-4 text-sm font-medium hover:border-ink">
          View pricing
        </Link>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-28">
        <SectionHeading eyebrow="Who we work with" title="Trusted by organisations of every size." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08} className="group">
              <div className="zoom-img relative aspect-[4/5] overflow-hidden rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={unsplash(a.photo, 800)} alt="" loading="lazy" className="size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                  <h3 className="font-display text-2xl font-semibold">{a.title}</h3>
                  <p className="mt-2 text-sm text-paper/75">{a.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-card py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 md:px-8 lg:grid-cols-2">
          <Reveal>
            <ParallaxImage src={unsplash("1610089219534-80872697800a", 1200)} alt="Custom printed notebook" className="aspect-[4/5] rounded-[2rem]" />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Custom branding"
              title="Your brand, beautifully finished."
              description="Our in-house studio handles every branding method, so you get consistent quality and faster turnaround."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {brandingOptions.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.06} className="rounded-2xl border border-ink/10 bg-paper p-5">
                  <span className="grid size-8 place-items-center rounded-full bg-sage/15 text-sage">
                    <Check className="size-4" />
                  </span>
                  <h3 className="mt-4 font-semibold">{b.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow="Volume pricing" title="The more you order, the more you save." align="center" description="Discounts apply per product on our standard catalogue prices. Final quotes include branding and delivery." />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal
              key={t.range}
              delay={i * 0.1}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8",
                t.highlight ? "border-ink bg-ink text-paper lg:-my-4 lg:py-12" : "border-ink/10 bg-card",
              )}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-mustard px-3 py-1 text-xs font-semibold text-ink">Most popular</span>
              )}
              <p className={cn("text-sm font-medium", t.highlight ? "text-paper/60" : "text-muted-foreground")}>{t.range}</p>
              <p className="mt-3 font-display text-5xl font-semibold">{t.discount}</p>
              <ul className="mt-8 space-y-3 text-sm">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <Check className={cn("size-4", t.highlight ? "text-mustard" : "text-sage")} /> {p}
                  </li>
                ))}
              </ul>
              <Link
                href="#quote"
                className={cn(
                  "mt-10 inline-flex justify-center rounded-full px-6 py-3.5 text-sm font-medium transition-colors",
                  t.highlight ? "bg-paper text-ink hover:bg-mustard" : "border border-ink/15 hover:border-ink hover:bg-ink hover:text-paper",
                )}
              >
                Request quote
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="bg-card">
        <Process />
      </div>

      {popular.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-28">
          <SectionHeading eyebrow="Popular for bulk" title="What teams order most." />
          <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-8 lg:grid-cols-[1fr_1.5fr]">
        <SectionHeading eyebrow="FAQ" title="Questions from businesses." />
        <Faq items={bulkFaqs} />
      </section>

      <section id="quote" className="scroll-mt-24 px-3 pb-24 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-12 rounded-[2rem] border border-ink/10 bg-card p-6 md:p-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-vermilion uppercase">Request a quote</p>
            <h2 className="mt-4 font-display text-4xl leading-tight font-semibold md:text-5xl">Tell us about your order.</h2>
            <p className="mt-5 text-muted-foreground">Share products, quantities and timelines. We reply with pricing, mock-ups and samples within one business day.</p>
            <ul className="mt-8 space-y-3 text-sm">
              {["No obligation — free quotes", "Mock-up of your branding included", "Dedicated account manager"].map((x) => (
                <li key={x} className="flex items-center gap-3"><Check className="size-4 text-sage" /> {x}</li>
              ))}
            </ul>
          </div>
          <ContactForm defaultType="bulk" />
        </div>
      </section>
    </>
  );
}
