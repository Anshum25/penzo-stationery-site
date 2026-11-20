"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, Shuffle, Sparkles, Star } from "lucide-react";
import { formatPrice } from "@/lib/site";
import { useIntroDone } from "@/components/motion/intro";
import { useMediaQuery } from "@/components/motion/use-media";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export type HeroItem = { name: string; price: number; image: string | null; slug: string };
export type HeroCategory = { name: string; slug: string };

type Spot = { side: -1 | 1; left?: string; right?: string; top: string; w: string; r: number; depth: number };

// Where each polaroid rests on the "desk" (desktop). Side decides which way it drifts on scroll.
const spots: Spot[] = [
  { side: -1, left: "2.5%", top: "15%", w: "clamp(130px, 12vw, 190px)", r: -8, depth: 0.6 },
  { side: -1, left: "7%", top: "46%", w: "clamp(140px, 13.5vw, 215px)", r: 6, depth: 1 },
  { side: -1, left: "1.5%", top: "73%", w: "clamp(120px, 11vw, 170px)", r: -4, depth: 0.8 },
  { side: 1, right: "3%", top: "13%", w: "clamp(140px, 13vw, 205px)", r: 7, depth: 0.9 },
  { side: 1, right: "8%", top: "45%", w: "clamp(130px, 12vw, 185px)", r: -7, depth: 0.6 },
  { side: 1, right: "2%", top: "72%", w: "clamp(120px, 11.5vw, 180px)", r: 4, depth: 1 },
];
const noteSpot: Spot = { side: -1, left: "14.5%", top: "79%", w: "clamp(125px, 9.5vw, 145px)", r: -5, depth: 0.7 };
const pencilSpot: Spot = { side: 1, right: "15%", top: "89%", w: "clamp(170px, 14vw, 210px)", r: -10, depth: 0.9 };

const words = ["write.", "plan.", "sketch.", "gift."];

/** Small deterministic "random" so shuffles differ but server and client agree on the first render. */
function jitter(seed: number, i: number) {
  if (seed === 0) return 0;
  const x = Math.sin(seed * 97.13 + i * 13.7) * 10000;
  return (x - Math.floor(x) - 0.5) * 16; // −8° … 8°
}

export function Hero({ items, categories }: { items: HeroItem[]; categories: HeroCategory[] }) {
  const desk = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const wide = useMediaQuery("(min-width: 1180px)");
  // The sticky note and pencil need vertical room below the category chips.
  const roomy = useMediaQuery("(min-width: 1180px) and (min-height: 860px)");
  const [shuffle, setShuffle] = useState(0);
  const { scrollYProgress } = useScroll({ target: desk, offset: ["start start", "end start"] });
  const spread = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentFade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Pointer position (−0.5 … 0.5) drives a gentle depth parallax on everything lying on the desk.
  const mx = useSpring(useMotionValue(0), { stiffness: 50, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 50, damping: 18 });

  const deskProps = { ready, bounds: desk, spread, mx, my, shuffle };

  return (
    <section
      ref={desk}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-28 pb-16 md:pt-32"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      {/* Desk surface: dot grid fading out at the edges, a warm lamp glow */}
      <div className="dotted absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,black,transparent)]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[60vw] max-w-[900px] -translate-1/2 rounded-full bg-mustard/15 blur-[120px]" />

      {wide && (
        <>
          {items.slice(0, spots.length).map((item, i) => (
            <DeskItem key={`${item.slug}-${shuffle}`} spot={spots[i]} index={i} {...deskProps} label={`${item.name}, ${formatPrice(item.price)}`} href={`/products/${item.slug}`}>
              <PolaroidCard item={item} />
            </DeskItem>
          ))}
          {roomy && (
            <>
              <DeskItem key={`note-${shuffle}`} spot={noteSpot} index={6} {...deskProps}>
                <StickyNote />
              </DeskItem>
              <DeskItem key={`pencil-${shuffle}`} spot={pencilSpot} index={7} {...deskProps} flat>
                <Pencil />
              </DeskItem>
            </>
          )}
          <DragHint ready={ready} onShuffle={() => setShuffle((n) => n + 1)} />
        </>
      )}

      <motion.div style={{ y: contentY, opacity: contentFade }} className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: -12, scale: 0.95 }} animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.6, ease }}>
          <Link
            href="/products?category=planners"
            className="group mb-8 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card py-1.5 pr-3 pl-1.5 text-sm shadow-sm transition-colors hover:border-ink/30"
          >
            <span className="flex items-center gap-1 rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold text-paper">
              <Sparkles className="size-3" /> New
            </span>
            2027 planners have landed
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <h1 className="font-display text-[clamp(3rem,7.4vw,7.5rem)] leading-[0.95] font-bold tracking-[-0.055em]">
          <span className="block overflow-hidden pb-[0.05em]">
            <motion.span className="block" initial={{ y: "105%" }} animate={ready ? { y: "0%" } : {}} transition={{ duration: 1, ease, delay: 0.1 }}>
              Everything you
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span className="block" initial={{ y: "105%" }} animate={ready ? { y: "0%" } : {}} transition={{ duration: 1, ease, delay: 0.2 }}>
              need to <Typewriter words={words} start={ready} />
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.45 }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
        >
          Notebooks, pens, art supplies and desk essentials — tested by hand, made to last, and delivered across India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.55 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Link href="/products" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper">
            <span className="absolute inset-0 translate-y-full rounded-full bg-vermilion transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative">Shop the collection</span>
            <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/bulk-orders" className="rounded-full border border-ink/15 bg-card px-8 py-4 text-sm font-semibold transition-colors hover:border-ink">
            Bulk & corporate
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.75 }} className="mt-10 flex items-center gap-3 text-sm">
          <div className="flex -space-x-2">
            {["PS", "RM", "AI", "KD"].map((n, i) => (
              <span
                key={n}
                className="grid size-8 place-items-center rounded-full border-2 border-paper text-[10px] font-semibold text-paper"
                style={{ backgroundColor: ["#2f4b7c", "#3d6b5c", "#c2552d", "#5a4e7c"][i] }}
              >
                {n}
              </span>
            ))}
          </div>
          <span className="flex text-mustard">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}
          </span>
          <span className="text-muted-foreground"><b className="font-semibold text-ink">4.9</b> from 40,000+ customers</span>
        </motion.div>

        {categories.length > 0 && (
          <motion.nav
            aria-label="Shop by category"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.9 }}
            className="mt-8 flex max-w-full flex-wrap items-center justify-center gap-2"
          >
            {categories.map((c, i) => (
              <motion.span key={c.slug} initial={{ opacity: 0, y: 8 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.95 + i * 0.05 }}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="block rounded-full border border-ink/10 bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-ink/40 hover:text-ink"
                >
                  {c.name}
                </Link>
              </motion.span>
            ))}
          </motion.nav>
        )}

        {/* Narrow screens: a fanned hand of cards instead of the free desk */}
        {!wide && items.length > 0 && <Fan items={items.slice(0, 4)} ready={ready} />}
      </motion.div>

    </section>
  );
}

/** Types a word, pauses, deletes it, types the next — with a highlighter stroke that grows behind it. */
function Typewriter({ words, start }: { words: string[]; start: boolean }) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!start || reduce) return;
    const word = words[index];
    const done = !deleting && text === word;
    const empty = deleting && text === "";
    const delay = done ? 1800 : empty ? 250 : deleting ? 45 : 95;
    const t = setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => clearTimeout(t);
  }, [start, reduce, text, deleting, index, words]);

  const shown = reduce ? words[0] : text;
  const progress = reduce ? 1 : text.length / words[index].length;
  // Reserve the longest word's width so the centred headline never shifts while typing.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a));
  return (
    <span className="inline-grid text-left text-vermilion" aria-label={words.join(" ")}>
      <span aria-hidden className="invisible col-start-1 row-start-1">{longest}</span>
      <span aria-hidden className="col-start-1 row-start-1 whitespace-nowrap">
        <span
          className="bg-no-repeat transition-[background-size] duration-150 ease-out"
          style={{
            backgroundImage: "linear-gradient(transparent 58%, color-mix(in oklab, var(--mustard) 55%, transparent) 58%, color-mix(in oklab, var(--mustard) 55%, transparent) 90%, transparent 90%)",
            backgroundSize: `${progress * 100}% 100%`,
          }}
        >
          {shown}
        </span>
        <motion.span
          className="ml-1 inline-block h-[0.8em] w-[0.06em] translate-y-[0.08em] bg-vermilion align-baseline"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        />
      </span>
    </span>
  );
}

/**
 * Anything lying on the desk: drops in, drifts with the pointer and apart on scroll, and can be dragged.
 * With `href`, a plain click (not a drag) opens it.
 */
function DeskItem({
  spot,
  index,
  ready,
  bounds,
  spread,
  mx,
  my,
  shuffle,
  href,
  label,
  flat,
  children,
}: {
  spot: Spot;
  index: number;
  ready: boolean;
  bounds: React.RefObject<HTMLElement | null>;
  spread: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  shuffle: number;
  href?: string;
  label?: string;
  flat?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dragged = useRef(false);
  const [z, setZ] = useState(1);
  // Drag offset, plus limits measured fresh at each grab (measuring once on mount is wrong
  // because the item is still mid-drop then).
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);
  const [limits, setLimits] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  const x = useTransform(() => spread.get() * spot.side * 260 * spot.depth + mx.get() * -36 * spot.depth);
  const y = useTransform(() => spread.get() * -120 * spot.depth + my.get() * -24 * spot.depth);
  const tilt = useMotionValue(0);
  const baseRotate = spot.r + jitter(shuffle, index);
  const rotate = useTransform(tilt, (t) => baseRotate + t);
  const open = () => href && router.push(href);

  return (
    <motion.div className="absolute" style={{ left: spot.left, right: spot.right, top: spot.top, width: spot.w, x, y, zIndex: z }}>
      <motion.div
        initial={{ opacity: 0, y: -520, rotate: index % 2 ? 38 : -38 }}
        animate={ready ? { opacity: 1, y: 0, rotate: 0 } : {}}
        transition={{ type: "spring", stiffness: 110, damping: 13, delay: (shuffle ? 0 : 0.25) + index * 0.08 }}
      >
        <motion.div
          drag
          dragConstraints={limits}
          dragElastic={0.12}
          dragTransition={{ bounceStiffness: 260, bounceDamping: 22, power: 0.25 }}
          whileHover={{ scale: 1.04 }}
          whileDrag={{ scale: 1.08 }}
          onPointerDown={(e) => {
            dragged.current = false;
            setZ(20 + (Date.now() % 1000));
            const area = bounds.current?.getBoundingClientRect();
            if (!area) return;
            const el = e.currentTarget.getBoundingClientRect();
            // Where the item would sit with no drag offset, then how far it may travel each way.
            const top = el.top - dy.get();
            const left = el.left - dx.get();
            setLimits({
              top: area.top - top,
              bottom: area.bottom - (top + el.height),
              left: area.left - left,
              right: area.right - (left + el.width),
            });
          }}
          onDragStart={() => (dragged.current = true)}
          onDrag={(_, info) => tilt.set(Math.max(-12, Math.min(12, info.velocity.x / 60)))}
          onDragEnd={() => tilt.set(0)}
          onClick={() => !dragged.current && open()}
          onKeyDown={(e) => e.key === "Enter" && open()}
          tabIndex={href ? 0 : -1}
          role={href ? "link" : undefined}
          aria-label={label}
          aria-hidden={href ? undefined : true}
          style={{ x: dx, y: dy, rotate }}
          className={cn(
            "group relative cursor-grab touch-none select-none active:cursor-grabbing",
            !flat && "[&>*]:transition-shadow [&>*]:duration-300 active:[&>*]:shadow-[0_40px_60px_-20px_rgba(21,20,19,.45)]",
          )}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PolaroidCard({ item }: { item: HeroItem }) {
  return (
    <div className="relative rounded-[6px] bg-white p-2.5 pb-3 shadow-[0_18px_40px_-18px_rgba(21,20,19,.35)]">
      <div className="relative aspect-square overflow-hidden rounded-[3px] bg-muted">
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image.replace(/w=\d+/, "w=420")} alt="" draggable={false} className="pointer-events-none size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
        <span className="absolute right-1.5 bottom-1.5 flex items-center gap-1 rounded-full bg-ink/85 px-2 py-0.5 text-[10px] font-semibold text-paper opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
          View <ArrowRight className="size-2.5" />
        </span>
      </div>
      <div className="px-0.5 pt-2.5">
        <p className="line-clamp-2 text-[11px] leading-snug font-semibold text-ink">{item.name}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{formatPrice(item.price)}</p>
      </div>
      {/* tape strip */}
      <span className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 rotate-[-3deg] bg-mustard/60 mix-blend-multiply" />
    </div>
  );
}

/** A yellow sticky note with a handwritten shopping list. */
function StickyNote() {
  const list: [string, boolean][] = [
    ["dot grid", true],
    ["fountain pen", true],
    ["new planner", false],
  ];
  return (
    <div
      className="relative p-3 pb-4 font-hand text-ink shadow-[0_18px_30px_-16px_rgba(21,20,19,.4)]"
      style={{ background: "linear-gradient(160deg, #f8dc7a, #f2c955)" }}
    >
      <p className="text-lg leading-none font-bold">to buy ✍︎</p>
      <ul className="mt-2 space-y-0.5 text-[15px] leading-tight whitespace-nowrap">
        {list.map(([t, done]) => (
          <li key={t} className="flex items-start gap-1.5">
            <span className="text-vermilion">{done ? "✓" : "○"}</span>
            <span className={cn(done && "line-through decoration-ink/40")}>{t}</span>
          </li>
        ))}
      </ul>
      {/* curled corner */}
      <span className="absolute right-0 bottom-0 size-6 bg-gradient-to-tl from-[#d9ad3c] to-transparent" />
    </div>
  );
}

/** A classic yellow pencil, drawn in SVG. */
function Pencil() {
  return (
    <svg viewBox="0 0 240 28" className="w-full drop-shadow-[0_10px_8px_rgba(21,20,19,.25)]" aria-hidden>
      <rect x="0" y="4" width="22" height="20" rx="4" fill="#f28ca0" />
      <rect x="20" y="3" width="18" height="22" fill="#c9c3b8" />
      <path d="M24 3v22M30 3v22" stroke="#a59f94" strokeWidth="1.5" />
      <rect x="38" y="3" width="160" height="22" fill="#f2c14e" />
      <rect x="38" y="3" width="160" height="7" fill="#f6d27a" />
      <rect x="38" y="18" width="160" height="7" fill="#e0aa36" />
      <path d="M198 3 L232 14 L198 25 Z" fill="#f1d7b0" />
      <path d="M222 10.8 L240 14 L222 17.2 Z" fill="#2b2620" />
      <text x="60" y="18" fontSize="9" fontWeight="700" fill="#16130f" opacity=".55" fontFamily="sans-serif" letterSpacing="1">
        PENZO HB
      </text>
    </svg>
  );
}

/** Handwritten margin note: tells people they can play, and offers a shuffle. */
function DragHint({ ready, onShuffle }: { ready: boolean; onShuffle: () => void }) {
  return (
    <motion.div
      className="absolute top-[13%] right-[17.5%] z-[1100] flex flex-col items-end gap-1 text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : {}}
      transition={{ delay: 1.6, duration: 0.6 }}
    >
      <button
        type="button"
        onClick={onShuffle}
        className="group flex items-center gap-1.5 rounded-full px-2 py-0.5 font-hand text-lg transition-colors hover:text-ink"
      >
        <Shuffle className="size-3.5 transition-transform duration-500 group-hover:rotate-180" />
        shuffle the desk
      </button>
      <div className="pointer-events-none flex items-end gap-1">
        <span className="-rotate-6 font-hand text-xl">drag us around</span>
        <svg viewBox="0 0 60 40" className="h-8 w-12 text-vermilion" fill="none" aria-hidden>
          <motion.path
            d="M2 34 C 18 30, 34 22, 50 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={ready ? { pathLength: 1 } : {}}
            transition={{ delay: 1.8, duration: 0.6 }}
          />
          <motion.path
            d="M40 6 L 51 5 L 49 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={ready ? { pathLength: 1 } : {}}
            transition={{ delay: 2.35, duration: 0.3 }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

/** Narrow screens: four cards fanned out like a hand, tap to open. */
function Fan({ items, ready }: { items: HeroItem[]; ready: boolean }) {
  const mid = (items.length - 1) / 2;
  return (
    <div className="relative mt-14 flex h-48 w-full max-w-md items-end justify-center sm:h-56">
      {items.map((item, i) => {
        const offset = i - mid;
        return (
          <motion.div
            key={item.slug}
            className="absolute bottom-0 w-32 sm:w-36"
            style={{ originY: 1 }}
            initial={{ opacity: 0, y: 120, rotate: 0, x: 0 }}
            animate={ready ? { opacity: 1, y: Math.abs(offset) * 10, rotate: offset * 9, x: offset * 62 } : {}}
            transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.5 + i * 0.08 }}
          >
            <Link
              href={`/products/${item.slug}`}
              className="block rounded-[6px] bg-white p-2 pb-2.5 shadow-[0_18px_40px_-18px_rgba(21,20,19,.4)] transition-transform active:scale-95"
            >
              <div className="aspect-square overflow-hidden rounded-[3px] bg-muted">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image.replace(/w=\d+/, "w=300")} alt={item.name} className="size-full object-cover" />
                )}
              </div>
              <p className="truncate pt-2 text-left text-[10px] font-semibold">{item.name}</p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
