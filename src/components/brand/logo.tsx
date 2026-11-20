import { useId } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * The Penzo monogram: a lowercase "p" whose stem is a fountain-pen nib (tapered tip + slit)
 * and whose counter holds a mustard ink drop. Geometry lives here so the preloader can draw it.
 */
export const MARK = {
  viewBox: "0 0 48 48",
  stem: "M13 6h8v28l-4 10-4-10z",
  bowl: { cx: 27, cy: 17, r: 11 },
  counter: { cx: 27, cy: 17, r: 4.6 },
  drop: { cx: 27, cy: 17, r: 2.6 },
  slit: "M17 31v8.5",
  breather: { cx: 17, cy: 30, r: 1.5 },
};

export function LogoMark({ className, dot = "var(--mustard)" }: { className?: string; dot?: string }) {
  const id = useId();
  return (
    <svg viewBox={MARK.viewBox} className={cn("size-9 shrink-0", className)} aria-hidden>
      <defs>
        <mask id={id}>
          <rect width="48" height="48" fill="#fff" />
          <circle {...MARK.counter} fill="#000" />
          <path d={MARK.slit} stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          <circle {...MARK.breather} fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${id})`} fill="currentColor">
        <path d={MARK.stem} />
        <circle {...MARK.bowl} />
      </g>
      <circle {...MARK.drop} fill={dot} />
    </svg>
  );
}

/** App-icon style: monogram on a rounded ink tile. */
export function LogoTile({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-10 shrink-0 place-items-center rounded-[28%] bg-ink text-paper", className)}>
      <LogoMark className="size-[72%]" />
    </span>
  );
}

/** Monogram + wordmark lockup. `tagline` adds the small descriptor used in the footer. */
export function Logo({
  className,
  markClassName,
  light,
  tagline,
}: {
  className?: string;
  markClassName?: string;
  light?: boolean;
  tagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", light ? "text-paper" : "text-ink", className)}>
      <LogoMark className={cn("size-8", markClassName)} />
      <span className="flex flex-col">
        <span className="font-display text-[1.6rem] leading-none font-bold tracking-[-0.05em]">{site.shortName.toLowerCase()}</span>
        {tagline && (
          <span className={cn("mt-1 text-[9px] font-semibold tracking-[0.32em] uppercase", light ? "text-paper/50" : "text-muted-foreground")}>
            Stationery Co.
          </span>
        )}
      </span>
    </span>
  );
}
