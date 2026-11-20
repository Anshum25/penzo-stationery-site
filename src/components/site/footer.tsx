"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "@/components/brand/logo";

/** Revealed from underneath the page as you reach the bottom. */
export function Footer({ categories }: { categories: { name: string; slug: string }[] }) {
  const letters = site.shortName.split("");
  // The footer itself is position:fixed, so watch the in-flow wrapper instead.
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.5 });

  const columns = [
    { title: "Shop", links: categories.slice(0, 6).map((c) => ({ label: c.name, href: `/products?category=${c.slug}` })) },
    {
      title: "Company",
      links: [
        { label: "About us", href: "/about" },
        { label: "Bulk orders", href: "/bulk-orders" },
        { label: "Journal", href: "/journal" },
        { label: "Contact", href: "/contact" },
        { label: "All products", href: "/products" },
        { label: "Brand kit", href: "/brand-kit" },
      ],
    },
    { title: "Support", links: [...site.legal] },
  ];

  return (
    <div ref={wrap} className="relative h-[900px] md:h-[640px]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
      <footer className="fixed bottom-0 flex h-[900px] w-full flex-col justify-between bg-ink px-4 pt-20 pb-6 text-paper md:h-[640px] md:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light tagline markClassName="size-10" />
            <p className="mt-6 max-w-xs text-paper/60">{site.description}</p>
            <div className="mt-6 space-y-1 text-sm text-paper/80">
              <a href={`mailto:${site.email}`} className="block hover:text-mustard">{site.email}</a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="block hover:text-mustard">{site.phone}</a>
              <p className="text-paper/50">{site.address}</p>
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-5 text-xs font-semibold tracking-[0.22em] text-paper/40 uppercase">{col.title}</p>
              <ul className="space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group inline-flex items-center gap-1 text-paper/80 transition-colors hover:text-paper">
                      {l.label}
                      <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <p aria-label={site.shortName} className="flex justify-center overflow-hidden font-display text-[24vw] leading-[0.8] font-semibold tracking-tighter text-paper/90 md:text-[19vw]">
            {letters.map((l, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="inline-block"
                initial={{ y: "100%" }}
                animate={{ y: inView ? "0%" : "100%" }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                {l}
              </motion.span>
            ))}
          </p>
          <div className="mx-auto mt-6 flex max-w-7xl flex-col justify-between gap-3 border-t border-paper/10 pt-6 text-xs text-paper/50 sm:flex-row">
            <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
            <div className="flex gap-5">
              {Object.entries(site.socials).map(([k, v]) => (
                <a key={k} href={v} className="capitalize hover:text-paper">{k}</a>
              ))}
              <Link href="/admin" className="hover:text-paper">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
