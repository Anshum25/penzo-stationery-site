"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { timeline } from "@/lib/content";

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <ol ref={ref} className="relative ml-3 space-y-14 border-l border-ink/10 pl-10 md:ml-0">
      <motion.span aria-hidden style={{ scaleY }} className="absolute top-0 -left-px h-full w-px origin-top bg-vermilion" />
      {timeline.map((t, i) => (
        <motion.li
          key={t.year}
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.03 }}
        >
          <span className="absolute top-1.5 -left-[46px] size-3 rounded-full border-2 border-paper bg-vermilion ring-4 ring-vermilion/15" />
          <p className="text-sm font-semibold tracking-[0.2em] text-vermilion uppercase">{t.year}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold md:text-3xl">{t.title}</h3>
          <p className="mt-2 max-w-xl text-muted-foreground">{t.text}</p>
        </motion.li>
      ))}
    </ol>
  );
}
