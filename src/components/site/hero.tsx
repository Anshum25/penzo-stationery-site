"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { formatPrice } from "@/lib/site";
import { useIntroDone } from "@/components/motion/intro";
import { useMediaQuery } from "@/components/motion/use-media";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export type HeroItem = { name: string; price: number; image: string | null; slug: string };

// Where each polaroid rests on the "desk" (desktop). Side decides which way it drifts on scroll.
const spots = [
  { side: -1, left: "2.5%", top: "15%", w: "clamp(130px, 12vw, 190px)", r: -8, depth: 0.6 },
  { side: -1, left: "7%", top: "46%", w: "clamp(140px, 13.5vw, 215px)", r: 6, depth: 1 },
  { side: -1, left: "1.5%", top: "73%", w: "clamp(120px, 11vw, 170px)", r: -4, depth: 0.8 },
  { side: 1, right: "3%", top: "13%", w: "clamp(140px, 13vw, 205px)", r: 7, depth: 0.9 },
  { side: 1, right: "8%", top: "45%", w: "clamp(130px, 12vw, 185px)", r: -7, depth: 0.6 },
  { side: 1, right: "2%", top: "72%", w: "clamp(120px, 11.5vw, 180px)", r: 4, depth: 1 },
] as const;

const words = ["write.", "plan.", "sketch.", "gift."];

export function Hero({ items }: { items: HeroItem[] }) {
  const desk = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const wide = useMediaQuery("(min-width: 1180px)");
  const { scrollYProgress } = useScroll({ target: desk, offset: ["start start", "end start"] });
  const spread = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentFade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={desk}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-28 pb-16 md:pt-32"
    >
      {/* Desk surface: dot grid fading out at the edges */}
      <div className="dotted absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,black,transparent)]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[60vw] max-w-[900px] -translate-1/2 rounded-full bg-mustard/15 blur-[120px]" />

      {/* Polaroids (desktop): drop in, drag around, drift apart on scroll */}
      {wide &&
        items.slice(0, spots.length).map((item, i) => (
          <Polaroid key={item.slug} item={item} spot={spots[i]} index={i} ready={ready} bounds={desk} spread={spread} />
        ))}

      <motion.div style={{ y: contentY, opacity: contentFade }} className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, ease }}
        >
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
          <Link
            href="/products"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-vermilion transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative">Shop the collection</span>
            <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/bulk-orders" className="rounded-full border border-ink/15 bg-card px-8 py-4 text-sm font-semibold transition-colors hover:border-ink">
            Bulk & corporate
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-10 flex items-center gap-3 text-sm"
        >
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

        {/* Mobile / narrow: a fanned hand of cards instead of the free desk */}
        {!wide && items.length > 0 && <Fan items={items.slice(0, 4)} ready={ready} />}
      </motion.div>

      {wide && <DragHint ready={ready} />}
    </section>
  );
}

/** Types a word, pauses, deletes it, types the next. Static for reduced-motion users. */
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
  // Reserve the longest word's width so the centred headline never shifts while typing.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a));
  return (
    <span className="inline-grid text-left text-vermilion" aria-label={words.join(" ")}>
      <span aria-hidden className="invisible col-start-1 row-start-1">{longest}</span>
      <span aria-hidden className="col-start-1 row-start-1 whitespace-nowrap">
        {shown}
        <motion.span
          className="ml-1 inline-block h-[0.8em] w-[0.06em] translate-y-[0.08em] bg-vermilion align-baseline"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        />
      </span>
    </span>
  );
}

function Polaroid({
  item,
  spot,
  index,
  ready,
  bounds,
  spread,
}: {
  item: HeroItem;
  spot: (typeof spots)[number];
  index: number;
  ready: boolean;
  bounds: React.RefObject<HTMLElement | null>;
  spread: MotionValue<number>;
}) {
  const router = useRouter();
  const dragged = useRef(false);
  const [z, setZ] = useState(1);
  const driftX = useTransform(spread, [0, 1], [0, spot.side * 260 * spot.depth]);
  const driftY = useTransform(spread, [0, 1], [0, -120 * spot.depth]);
  const tilt = useMotionValue(0);
  const rotate = useTransform(tilt, (t) => spot.r + t);

  const position = "left" in spot ? { left: spot.left, top: spot.top } : { right: spot.right, top: spot.top };

  return (
    <motion.div className="absolute" style={{ ...position, width: spot.w, x: driftX, y: driftY, zIndex: z }}>
      <motion.div
        initial={{ opacity: 0, y: -520, rotate: index % 2 ? 38 : -38 }}
        animate={ready ? { opacity: 1, y: 0, rotate: 0 } : {}}
        transition={{ type: "spring", stiffness: 110, damping: 13, delay: 0.25 + index * 0.09 }}
      >
      <motion.div
        drag
        dragConstraints={bounds}
        dragElastic={0.12}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 22, power: 0.25 }}
        whileHover={{ scale: 1.04, y: -6 }}
        whileDrag={{ scale: 1.08, boxShadow: "0 40px 60px -20px rgba(21,20,19,.45)" }}
        onPointerDown={() => {
          dragged.current = false;
          setZ(20 + Date.now() % 1000);
        }}
        onDragStart={() => (dragged.current = true)}
        onDrag={(_, info) => tilt.set(Math.max(-12, Math.min(12, info.velocity.x / 60)))}
        onDragEnd={() => tilt.set(0)}
        onClick={() => !dragged.current && router.push(`/products/${item.slug}`)}
        onKeyDown={(e) => e.key === "Enter" && router.push(`/products/${item.slug}`)}
        tabIndex={0}
        style={{ rotate }}
        className="group cursor-grab touch-none rounded-[6px] bg-white p-2.5 pb-3 shadow-[0_18px_40px_-18px_rgba(21,20,19,.35)] select-none active:cursor-grabbing"
        role="link"
        aria-label={`${item.name}, ${formatPrice(item.price)}`}
      >
        <div className="aspect-square overflow-hidden rounded-[3px] bg-muted">
          {item.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image.replace(/w=\d+/, "w=420")} alt="" draggable={false} className="pointer-events-none size-full object-cover" />
          )}
        </div>
        <div className="px-0.5 pt-2.5">
          <p className="line-clamp-2 text-[11px] leading-snug font-semibold text-ink">{item.name}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{formatPrice(item.price)}</p>
        </div>
        {/* tape strip */}
        <span className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 rotate-[-3deg] bg-mustard/60 mix-blend-multiply" />
      </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Small handwritten-style note pointing at a polaroid, so people know they can play. */
function DragHint({ ready }: { ready: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute top-[19%] right-[17.5%] z-0 hidden items-end gap-1 text-sm text-muted-foreground xl:flex"
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : {}}
      transition={{ delay: 1.6, duration: 0.6 }}
    >
      <span className="-rotate-6 font-medium italic">drag us around</span>
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
              className={cn("block rounded-[6px] bg-white p-2 pb-2.5 shadow-[0_18px_40px_-18px_rgba(21,20,19,.4)] transition-transform active:scale-95")}
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
