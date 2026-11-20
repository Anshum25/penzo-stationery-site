"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ProductCardData } from "@/lib/queries";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

export type ShowcaseTab = { key: string; label: string; href: string; products: ProductCardData[] };

/** Tabbed product grid — switch between curated lists without leaving the homepage. */
export function ProductShowcase({ tabs }: { tabs: ShowcaseTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  if (!current) return null;

  return (
    <div>
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div role="tablist" className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:rounded-full sm:border sm:border-ink/10 sm:bg-card sm:p-1 sm:px-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={t.key === current.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                t.key === current.key ? "text-paper" : "text-muted-foreground hover:text-ink",
              )}
            >
              {t.key === current.key && (
                <motion.span layoutId="showcase-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
        <Link href={current.href} className="group flex items-center gap-2 text-sm font-medium">
          View all <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {current.products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
