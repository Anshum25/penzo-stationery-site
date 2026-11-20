"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ProductCardData } from "@/lib/queries";
import { formatPrice } from "@/lib/site";
import { ProductVisual } from "./product-visual";

export function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-3xl">
          <ProductVisual
            image={product.image}
            name={product.name}
            illustration={product.illustration}
            accent={product.accent}
            className="aspect-[4/5] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            artClassName="transition-transform duration-700 ease-out group-hover:-rotate-12 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {product.featured && (
              <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-medium tracking-wide text-paper uppercase">Bestseller</span>
            )}
            {!product.inStock && (
              <span className="rounded-full bg-paper px-3 py-1 text-[11px] font-medium tracking-wide uppercase">Out of stock</span>
            )}
          </div>
          <span className="absolute right-4 bottom-4 grid size-11 translate-y-4 place-items-center rounded-full bg-paper opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4 px-1">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">{product.categoryName ?? "Stationery"}</p>
            <h3 className="mt-1 font-display text-xl leading-snug">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                {product.name}
              </span>
            </h3>
          </div>
          <p className="shrink-0 font-medium">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.article>
  );
}
