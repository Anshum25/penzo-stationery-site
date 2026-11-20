"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { unsplash } from "@/lib/images";
import { cn } from "@/lib/utils";

export type Hotspot = { x: number; y: number; title: string; subtitle: string; href: string; image: string | null };

const PHOTO = "1654931800100-2ecf6eee7c64";

/** Flat-lay photo with pulsing hotspots; hover a dot (or a list item) to see the product. */
export function ShopTheDesk({ spots }: { spots: Hotspot[] }) {
  const [active, setActive] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.7fr]">
      <ul className="order-2 min-w-0 space-y-2 lg:order-1">
        {spots.map((s, i) => (
          <li key={s.title}>
            <Link
              href={s.href}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "group flex items-center gap-4 rounded-2xl border p-3 transition-all duration-300",
                active === i ? "border-ink/20 bg-card shadow-[0_20px_40px_-28px_rgba(21,20,19,.5)]" : "border-transparent hover:bg-card/60",
              )}
            >
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors", active === i ? "bg-vermilion text-paper" : "bg-ink/[.06]")}>
                {i + 1}
              </span>
              <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                {s.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image.replace(/w=\d+/, "w=200")} alt="" className="size-full object-cover" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{s.title}</span>
                <span className="block text-sm text-muted-foreground">{s.subtitle}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-ink" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="relative order-1 aspect-[16/9] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(21,20,19,.5)] lg:order-2" onMouseLeave={() => setActive(null)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={unsplash(PHOTO, 1600) + "&h=900"} alt="Desk flat lay with stationery" loading="lazy" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-ink/10" />
        {spots.map((s, i) => (
          <div key={s.title} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <button
              type="button"
              aria-label={s.title}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(active === i ? null : i)}
              className="relative -translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-paper/70" />
              <span className={cn("relative grid size-8 place-items-center rounded-full bg-paper text-ink shadow-lg transition-transform duration-300", active === i && "scale-110 bg-ink text-paper")}>
                <Plus className={cn("size-4 transition-transform duration-300", active === i && "rotate-45")} />
              </span>
            </button>
            <AnimatePresence>
              {active === i && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "absolute z-10 hidden w-56 rounded-2xl bg-paper p-3 text-ink shadow-2xl sm:block",
                    s.y > 50 ? "bottom-7" : "top-7",
                    s.x > 60 ? "right-0" : "left-0",
                  )}
                >
                  <Link href={s.href} className="flex items-center gap-3">
                    <span className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {s.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image.replace(/w=\d+/, "w=200")} alt="" className="size-full object-cover" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{s.title}</span>
                      <span className="block text-xs text-muted-foreground">{s.subtitle}</span>
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
