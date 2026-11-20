"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  delay = 0,
  y = 40,
  className,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
      {...props}
    />
  );
}

/** Splits text into words that slide up from behind a mask. */
export function SplitReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  as: Tag = "h2",
  animateOnMount = false,
}: {
  text: string;
  className?: string;
  wordClassName?: (word: string, i: number) => string | undefined;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
  animateOnMount?: boolean;
}) {
  const words = text.split(" ");
  const trigger = animateOnMount
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "-10% 0px" } };
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        initial="hidden"
        {...trigger}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        className="inline"
        aria-hidden
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={cn("inline-block", wordClassName?.(w, i))}
              variants={{
                hidden: { y: "110%" },
                show: { y: "0%", transition: { duration: 0.9, ease } },
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
