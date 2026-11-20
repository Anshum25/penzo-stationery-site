"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { MarkDraw } from "./mark-draw";

const notes = [
  { label: "Lowercase p", text: "A friendly, modern letterform for Penzo." },
  { label: "Ink drop", text: "Mustard — the brand's signature accent." },
  { label: "Nib stem", text: "Tapered tip, slit and breather hole of a fountain pen." },
];

/** Draws the monogram when scrolled into view, then reveals what each part means. */
export function MarkAnatomy() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <div ref={ref}>
      <MarkDraw play={inView} className="mx-auto w-full max-w-[220px] text-ink" />
      <ol className="mt-12 grid gap-4 sm:grid-cols-3">
        {notes.map((n, i) => (
          <li
            key={n.label}
            className={`border-t border-ink/15 pt-4 text-sm transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
            style={{ transitionDelay: `${2 + i * 0.15}s` }}
          >
            <p className="font-semibold">
              <span className="mr-2 text-vermilion">0{i + 1}</span>
              {n.label}
            </p>
            <p className="mt-1 text-muted-foreground">{n.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
