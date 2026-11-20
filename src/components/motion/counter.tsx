"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

export function Counter({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (node.textContent = Math.round(v).toLocaleString("en-IN") + suffix),
    });
    return () => controls.stop();
  }, [inView, to, suffix, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}
