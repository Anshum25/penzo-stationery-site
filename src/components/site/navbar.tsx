"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/magnetic";
import { Logo } from "@/components/brand/logo";
import { useIntroDone } from "@/components/motion/intro";
import { photos, unsplash } from "@/lib/images";

type NavCategory = { name: string; slug: string; description: string; image: string | null };

export function Navbar({ categories }: { categories: NavCategory[] }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const introDone = useIntroDone();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200 && !open && !mega);
    setScrolled(y > 24);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6"
        initial={{ y: "-130%" }}
        animate={{ y: hidden || !introDone ? "-130%" : "0%" }}
        transition={{ duration: introDone ? 0.6 : 0.45, ease: [0.22, 1, 0.36, 1], delay: introDone && !hidden ? 0.15 : 0 }}
      >
        <div className="relative mx-auto max-w-7xl" onMouseLeave={() => setMega(false)}>
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 text-ink transition-all duration-500 md:px-6",
            scrolled || open || mega ? "bg-paper/90 shadow-[0_8px_30px_rgba(22,19,15,.08)] ring-1 ring-ink/5 backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <Link href="/" aria-label={`${site.name} home`} className="group" onClick={() => setOpen(false)}>
            <Logo markClassName="transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-105" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const isProducts = item.href === "/products";
              return (
                <li key={item.href} onMouseEnter={() => setMega(isProducts)}>
                  <Link href={item.href} onClick={() => setMega(false)} className="group relative flex items-center gap-1 overflow-hidden rounded-full px-4 py-2 text-sm font-medium">
                    {active && (
                      <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-ink/[.06]" />
                    )}
                    <span className="relative block transition-transform duration-300 group-hover:-translate-y-[130%]">{item.label}</span>
                    <span className="absolute inset-x-4 top-2 block translate-y-[130%] text-vermilion transition-transform duration-300 group-hover:translate-y-0">
                      {item.label}
                    </span>
                    {isProducts && <ChevronDown className={cn("relative size-3.5 transition-transform duration-300", mega && "rotate-180")} />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Magnetic>
                <Link
                  href="/contact?type=bulk"
                  className="group flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-vermilion"
                >
                  Get a quote
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </Magnetic>
            </div>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative grid size-10 place-items-center rounded-full bg-ink/[.06] lg:hidden"
            >
              <motion.span className="absolute h-0.5 w-5 bg-ink" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} />
              <motion.span className="absolute h-0.5 w-5 bg-ink" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full hidden pt-3 lg:block"
            >
              <div className="grid grid-cols-[1fr_300px] gap-4 rounded-3xl bg-paper p-4 shadow-[0_30px_80px_-20px_rgba(21,20,19,.35)] ring-1 ring-ink/5">
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((c, i) => (
                    <motion.div key={c.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
                      <Link
                        href={`/products?category=${c.slug}`}
                        onClick={() => setMega(false)}
                        className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-card"
                      >
                        <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                          {c.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.image.replace(/w=\d+/, "w=200")} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{c.name}</span>
                          <span className="line-clamp-2 text-xs text-muted-foreground">{c.description}</span>
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                  <Link
                    href="/products"
                    onClick={() => setMega(false)}
                    className="col-span-3 mt-1 flex items-center justify-between rounded-2xl border border-ink/10 px-4 py-3 text-sm font-medium hover:border-ink/30"
                  >
                    View the full catalogue <ArrowRight className="size-4" />
                  </Link>
                </div>
                <Link
                  href="/bulk-orders"
                  onClick={() => setMega(false)}
                  className="group relative overflow-hidden rounded-2xl bg-ink p-5 text-paper"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={unsplash(photos.gift, 600)} alt="" className="absolute inset-0 size-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end">
                    <span className="text-xs font-semibold tracking-[0.2em] text-mustard uppercase">For business</span>
                    <span className="mt-2 font-display text-xl font-semibold">Bulk & corporate orders</span>
                    <span className="mt-1 text-sm text-paper/70">Up to 20% off with custom branding.</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-paper px-6 pb-10 lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-1">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={item.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 font-display text-5xl">
                      <span className="text-sm text-muted-foreground">0{i + 1}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-muted-foreground">{site.email} · {site.phone}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
