import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, getPosts, getProductBySlug, getProducts, getPublishedTestimonials } from "@/lib/queries";
import { PostCard } from "@/components/site/post-card";
import { generalFaqs } from "@/lib/content";
import { formatPrice } from "@/lib/site";
import { Hero, type HeroItem } from "@/components/site/hero";
import { MarqueeBand } from "@/components/site/marquee-band";
import { SectionHeading } from "@/components/site/section-heading";
import { CategoriesBento } from "@/components/site/categories-bento";
import { ProductShowcase } from "@/components/site/product-showcase";
import { ShopTheDesk, type Hotspot } from "@/components/site/shop-the-desk";
import { HorizontalShowcase } from "@/components/site/horizontal-showcase";
import { WhyPenzo } from "@/components/site/why-penzo";
import { Stats } from "@/components/site/stats";
import { Process } from "@/components/site/process";
import { Testimonials } from "@/components/site/testimonials";
import { GalleryStrip } from "@/components/site/gallery-strip";
import { Faq } from "@/components/site/faq";
import { BulkCta } from "@/components/site/bulk-cta";
import { Reveal } from "@/components/motion/reveal";

// Positions are % of the 16:9 desk photo in ShopTheDesk; each points at the matching object.
const deskSpots = [
  { slug: "dot-grid-bullet-notebook", x: 48.5, y: 38 },
  { slug: "watercolour-travel-kit", x: 92, y: 22 },
  { slug: "glide-gel-pen-set-10-colours", x: 12, y: 41 },
];

export default function HomePage() {
  const categories = getCategories();
  const all = getProducts();
  const testimonials = getPublishedTestimonials();
  const latestPosts = getPosts({ limit: 3 });

  const tabs = [
    { key: "best", label: "Bestsellers", href: "/products", products: getProducts({ featured: true }).slice(0, 8) },
    { key: "new", label: "New arrivals", href: "/products?sort=newest", products: getProducts({ sort: "newest" }).slice(0, 8) },
    { key: "value", label: "Under ₹500", href: "/products?sort=price-asc", products: all.filter((p) => p.price < 500).slice(0, 8) },
    {
      key: "gift",
      label: "Gifting",
      href: "/products?category=gifts",
      products: all.filter((p) => p.categorySlug === "gifts" || p.categorySlug === "planners" || p.price >= 1000).slice(0, 8),
    },
  ].filter((t) => t.products.length > 0);

  // Products scattered on the hero "desk": featured first, then the rest.
  const heroItems: HeroItem[] = [...all.filter((p) => p.featured), ...all.filter((p) => !p.featured)]
    .filter((p) => p.image)
    .slice(0, 6)
    .map((p) => ({ name: p.name, price: p.price, image: p.image, slug: p.slug }));

  const office = categories.find((c) => c.slug === "office");
  const spots: Hotspot[] = [
    ...deskSpots.flatMap(({ slug, x, y }) => {
      const p = getProductBySlug(slug);
      return p ? [{ x, y, title: p.name, subtitle: formatPrice(p.price), href: `/products/${p.slug}`, image: p.image }] : [];
    }),
    ...(office ? [{ x: 81, y: 68, title: office.name, subtitle: "Staplers, files & desk tools", href: `/products?category=${office.slug}`, image: office.image }] : []),
  ];

  return (
    <>
      <Hero items={heroItems} />
      <MarqueeBand />

      <section id="categories" className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-8 md:pt-36">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Shop by category" title="Everything your desk has been missing." />
          <Reveal y={20}>
            <Link href="/products" className="group flex items-center gap-2 font-medium">
              All products <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <CategoriesBento categories={categories} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <SectionHeading eyebrow="Our products" title="Loved by people who write a lot." className="mb-10" />
        <ProductShowcase tabs={tabs} />
      </section>

      {spots.length > 0 && (
        <section className="bg-card py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow="Shop the desk"
              title="Everything on this desk, one click away."
              description="Tap or hover the dots to explore the pieces that make a great workspace."
              className="mb-12"
            />
            <ShopTheDesk spots={spots} />
          </div>
        </section>
      )}

      <HorizontalShowcase />
      <WhyPenzo />
      <Stats />
      <Process />

      <section className="bg-card py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="What our customers say."
            description="Thousands of professionals, students and businesses rely on Penzo every year."
            className="mb-14"
          />
          <Testimonials items={testimonials} />
        </div>
      </section>

      <GalleryStrip />

      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-28 md:px-8">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="From the journal" title="Guides for better writing and workspaces." />
            <Reveal y={20}>
              <Link href="/journal" className="group flex items-center gap-2 font-medium">
                All articles <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-8 md:px-8 lg:grid-cols-[1fr_1.5fr]">
        <SectionHeading eyebrow="FAQ" title="Good to know." description="Can't find what you're looking for? Our team is one message away." />
        <Faq items={generalFaqs} />
      </section>

      <div className="py-24">
        <BulkCta />
      </div>
    </>
  );
}
