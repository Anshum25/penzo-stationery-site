"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { site } from "@/lib/site";
import { markIntroDone } from "./intro";
import { MarkDraw } from "@/components/brand/mark-draw";

const DURATION = 1.9;
const ease = [0.22, 1, 0.36, 1] as const;
const noopSubscribe = () => () => {};

// Plays on every full page load (refresh or first visit); client-side navigation keeps the
// layout mounted, so it doesn't replay between pages. Skipped for reduced-motion users.
function shouldPlay() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * First-visit intro: the monogram draws itself in ink, the ink drop lands, the wordmark rises,
 * then the whole sheet lifts away like a page.
 */
export function Preloader() {
  // Server renders the overlay so first paint never flashes the page underneath.
  const play = useSyncExternalStore(noopSubscribe, shouldPlay, () => true);
  const [finished, setFinished] = useState(false);
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => `${Math.round(v * 100).toString().padStart(3, "0")}`);

  useEffect(() => {
    if (!play) {
      markIntroDone();
      return;
    }
    const controls = animate(progress, 1, {
      duration: DURATION,
      ease: [0.45, 0, 0.2, 1],
      onComplete: () => {
        setFinished(true);
        setTimeout(markIntroDone, 350);
      },
    });
    return () => controls.stop();
  }, [progress, play]);

  const letters = site.shortName.toLowerCase().split("");

  return (
    <AnimatePresence>
      {play && !finished && (
        <motion.div
          key="preloader"
          role="status"
          aria-label={`Loading ${site.name}`}
          className="fixed inset-0 z-[90] overflow-hidden bg-ink text-paper"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* faint ruled-paper texture */}
          <div className="ruled absolute inset-0 opacity-[.05]" />

          <motion.div
            className="relative flex h-full flex-col items-center justify-center"
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <MarkDraw className="size-28 md:size-36" />

            <div className="mt-8 flex overflow-hidden font-display text-5xl leading-none font-bold tracking-[-0.05em] md:text-6xl">
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7, ease, delay: 1.05 + i * 0.05 }}
                >
                  {l}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="mt-4 text-[11px] font-semibold tracking-[0.4em] text-paper/50 uppercase"
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 0.8, ease, delay: 1.3 }}
            >
              Stationery Co.
            </motion.p>
          </motion.div>

          <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10">
            <div className="mb-3 flex items-end justify-between text-xs text-paper/50">
              <span className="tracking-[0.25em] uppercase">Crafted for ideas</span>
              <motion.span className="font-mono text-paper/80 tabular-nums">{percent}</motion.span>
            </div>
            <div className="h-px w-full overflow-hidden bg-paper/15">
              <motion.div className="h-full origin-left bg-mustard" style={{ scaleX: progress }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
