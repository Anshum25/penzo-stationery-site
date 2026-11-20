"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import type { Category } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function ProductFilters({ categories, counts, total }: { categories: Category[]; counts: Record<number, number>; total: number }) {
  const params = useSearchParams();
  const router = useRouter();
  const active = params.get("category") ?? "";
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";

  const withParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && !(key === "sort" && value === "featured")) next.set(key, value);
    else next.delete(key);
    const s = next.toString();
    return s ? `/products?${s}` : "/products";
  };

  return (
    <div className="space-y-5">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {[{ id: 0, slug: "", name: "All products" }, ...categories].map((c) => {
          const isActive = active === c.slug;
          const n = c.id === 0 ? total : (counts[c.id] ?? 0);
          return (
            <Link
              key={c.slug || "all"}
              href={withParam("category", c.slug)}
              scroll={false}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                isActive ? "border-ink text-paper" : "border-ink/15 hover:border-ink/50",
              )}
            >
              {isActive && (
                <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{c.name}</span>
              <span className={cn("relative text-xs", isActive ? "text-paper/60" : "text-muted-foreground")}>{n}</span>
            </Link>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 border-y border-ink/10 py-4 sm:flex-row sm:items-center sm:justify-between">
        <form
          className="relative w-full sm:w-80"
          onSubmit={(e) => {
            e.preventDefault();
            const value = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
            router.push(withParam("q", value), { scroll: false });
          }}
        >
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            key={q}
            placeholder="Search products…"
            className="h-11 w-full rounded-full border border-ink/15 bg-card pr-4 pl-11 text-sm outline-none focus:border-ink"
          />
        </form>
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          Sort by
          <select
            value={sort}
            onChange={(e) => router.push(withParam("sort", e.target.value), { scroll: false })}
            className="h-11 rounded-full border border-ink/15 bg-card px-4 text-sm text-ink outline-none focus:border-ink"
          >
            {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}
