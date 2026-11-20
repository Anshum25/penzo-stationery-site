"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/** Image that drifts slower than the page as it scrolls past. */
export function ParallaxImage({ src, alt = "", className, strength = 12 }: { src: string; alt?: string; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-muted", className)}>
      <motion.img src={src} alt={alt} style={{ y }} className="absolute inset-0 h-[130%] w-full -translate-y-[15%] object-cover" />
    </div>
  );
}
