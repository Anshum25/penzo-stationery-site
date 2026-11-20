"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { SectionHeading } from "./section-heading";

const steps = [
  { title: "Tell us what you need", text: "Share quantities, products and any branding. A real person replies within a day." },
  { title: "Get a tailored quote", text: "Transparent bulk pricing with samples and mock-ups of your logo on the products." },
  { title: "We craft & customise", text: "Printing, embossing and packing happen in-house with strict quality checks." },
  { title: "Delivered on time", text: "Pan-India shipping with tracking — to one office or a hundred addresses." },
];

/** A pencil line draws itself down the page as you scroll through the steps. */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const length = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const pencilY = useTransform(length, [0, 1], ["0%", "100%"]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-28 md:px-8 md:py-36">
      <SectionHeading
        eyebrow="Bulk & corporate orders"
        title="From first message to doorstep in four steps."
        description="Schools, offices and event teams trust us for reliable bulk supply and custom-branded stationery."
        align="center"
      />

      <div ref={ref} className="relative mt-20">
        <svg className="absolute top-0 left-6 h-full w-4 md:left-1/2 md:-translate-x-1/2" preserveAspectRatio="none" viewBox="0 0 10 100" aria-hidden>
          <line x1="5" y1="0" x2="5" y2="100" stroke="currentColor" strokeOpacity=".12" strokeWidth="2" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
          <motion.line x1="5" y1="0" x2="5" y2="100" stroke="var(--vermilion)" strokeWidth="3" vectorEffect="non-scaling-stroke" style={{ pathLength: length }} />
        </svg>
        <motion.div
          style={{ top: pencilY }}
          className="absolute left-6 z-10 -translate-x-1/2 -translate-y-full md:left-1/2"
          aria-hidden
        >
          <svg viewBox="0 0 20 60" className="h-12 w-4">
            <rect x="4" y="0" width="12" height="8" rx="2" fill="#f28ca0" stroke="#16130f" strokeWidth="1.5" />
            <rect x="4" y="8" width="12" height="36" fill="#f2c14e" stroke="#16130f" strokeWidth="1.5" />
            <path d="M4 44h12l-6 14z" fill="#f1d7b0" stroke="#16130f" strokeWidth="1.5" />
            <path d="M8.5 53h3L10 58z" fill="#16130f" />
          </svg>
        </motion.div>

        <ol className="space-y-16 md:space-y-24">
          {steps.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: right ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`relative pl-16 md:w-1/2 md:pl-0 ${right ? "md:ml-auto md:pl-16" : "md:pr-16 md:text-right"}`}
              >
                <span className="font-display text-6xl font-semibold text-vermilion/30">0{i + 1}</span>
                <h3 className="mt-2 font-display text-3xl">{s.title}</h3>
                <p className="mt-3 text-muted-foreground">{s.text}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
