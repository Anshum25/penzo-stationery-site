"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { MARK } from "./logo";

const ease = [0.65, 0, 0.35, 1] as const;

/**
 * The monogram drawn like ink: outlines trace in, the shape fills, then the ink drop falls into
 * the bowl with a ripple. `play` starts it; `delay` offsets everything.
 */
export function MarkDraw({ className, play = true, delay = 0 }: { className?: string; play?: boolean; delay?: number }) {
  const id = useId();
  const at = (t: number) => delay + t;

  return (
    <svg viewBox={MARK.viewBox} className={className} aria-hidden overflow="visible">
      <defs>
        <mask id={id}>
          <rect x="-10" y="-10" width="68" height="68" fill="#fff" />
          <circle {...MARK.counter} fill="#000" />
          <path d={MARK.slit} stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          <circle {...MARK.breather} fill="#000" />
        </mask>
      </defs>

      {/* 1. Trace */}
      <TraceLines play={play} delay={delay} />

      {/* 2. Fill */}
      <motion.g
        mask={`url(#${id})`}
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease, delay: at(0.72) }}
      >
        <path d={MARK.stem} />
        <circle {...MARK.bowl} />
      </motion.g>

      {/* 3. Ink drop + ripple */}
      <motion.circle
        {...MARK.drop}
        fill="var(--mustard)"
        initial={{ y: -34, opacity: 0, scaleY: 1.6 }}
        animate={play ? { y: 0, opacity: 1, scaleY: 1 } : {}}
        transition={{ y: { type: "spring", stiffness: 280, damping: 14, delay: at(0.95) }, opacity: { duration: 0.1, delay: at(0.95) }, scaleY: { duration: 0.3, delay: at(1.08) } }}
        style={{ transformOrigin: `${MARK.drop.cx}px ${MARK.drop.cy}px` }}
      />
      <motion.circle
        cx={MARK.drop.cx}
        cy={MARK.drop.cy}
        fill="none"
        stroke="var(--mustard)"
        strokeWidth="0.6"
        initial={{ r: MARK.drop.r, opacity: 0 }}
        animate={play ? { r: [MARK.drop.r, 14], opacity: [0.9, 0] } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay: at(1.15) }}
      />
    </svg>
  );
}

function TraceLines({ play, delay }: { play: boolean; delay: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 0.8, strokeLinecap: "round" as const };
  const draw = (d: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: play ? { pathLength: 1, opacity: [0, 1, 1, 0] } : {},
    transition: {
      pathLength: { duration: 0.7, ease, delay: delay + d * 0.8 },
      opacity: { duration: 1.1, times: [0, 0.05, 0.75, 1], delay: delay + d * 0.8 },
    },
  });
  return (
    <g>
      <motion.path d={MARK.stem} {...common} {...draw(0)} />
      <motion.circle {...MARK.bowl} {...common} {...draw(0.15)} />
      <motion.circle {...MARK.counter} {...common} {...draw(0.3)} />
    </g>
  );
}
