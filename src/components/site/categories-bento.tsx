"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/db/schema";
import { Illustration } from "./illustration";
import { cn } from "@/lib/utils";

const spans = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-4",
];

export function CategoriesBento({ categories }: { categories: Category[] }) {
  return (
    <div className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[250px] md:grid-cols-4">
      {categories.slice(0, 6).map((c, i) => (
        <motion.div
          key={c.id}
          className={cn(spans[i] ?? "md:col-span-1")}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
              href={`/products?category=${c.slug}`}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 text-paper"
              style={{ backgroundColor: c.accent }}
            >
              {c.image ? (
                <div className="zoom-img absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" className="size-full object-cover" loading="lazy" />
                </div>
              ) : (
                <Illustration kind={c.illustration} accent="#fffdf8" className="absolute right-[-6%] bottom-[-8%] w-1/2 opacity-90" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/5 transition-opacity duration-500 group-hover:opacity-90" />
              <div className="relative z-10 flex items-start justify-between">
                <span className="rounded-full bg-paper/15 px-3 py-1 text-xs font-medium backdrop-blur-md">0{i + 1}</span>
                <span className="grid size-10 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
              <div className="relative z-10 max-w-md">
                <h3 className={cn("font-display leading-tight", i === 0 ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl")}>{c.name}</h3>
                <p
                  className={cn(
                    "mt-2 text-sm text-paper/80",
                    i === 0 ? "" : "max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100",
                  )}
                >
                  {c.description}
                </p>
              </div>
            </Link>
        </motion.div>
      ))}
    </div>
  );
}
