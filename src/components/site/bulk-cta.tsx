"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { photos, unsplash } from "@/lib/images";

/** A vermilion circle swells to fill the screen as you scroll in. */
export function BulkCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const radius = useTransform(scrollYProgress, [0, 1], [8, 85]);
  const clip = useMotionTemplate`circle(${radius}% at 50% 50%)`;
  const textScale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.4, 1], [0, 1]);

  return (
    <section ref={ref} className="relative h-[90vh] min-h-[560px] px-3 md:px-6">
      <motion.div
        style={{ clipPath: clip }}
        className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-ink px-6 text-center text-paper"
      >
        <div className="zoom-img absolute inset-0 opacity-25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={unsplash(photos.desk, 1600)} alt="" loading="lazy" className="size-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/80" />
        <motion.div style={{ scale: textScale, opacity: textOpacity }} className="relative">
          <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-mustard uppercase">For schools · offices · events</p>
          <h2 className="mx-auto max-w-5xl font-display text-5xl leading-[0.95] font-semibold tracking-tight md:text-8xl">
            Ordering for a <em className="text-mustard">whole team?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-paper/75">
            Custom branding, wholesale pricing and dedicated support. Get a quote in under 24 hours.
          </p>
          <div className="mt-10">
            <Magnetic>
              <Link
                href="/contact?type=bulk"
                className="group inline-flex items-center gap-3 rounded-full bg-paper px-8 py-5 font-medium text-ink transition-colors hover:bg-mustard"
              >
                Request a bulk quote
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
