"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { photos, unsplash } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const collections = [
  { title: "The Desk Edit", text: "Organisers, files and the small tools that make big work feel calm.", photo: photos.desk, href: "/products?category=office" },
  { title: "Back to School", text: "Notebooks, pencils and pens that survive every exam season.", photo: photos.pencils, href: "/products?category=notebooks" },
  { title: "Artist's Corner", text: "Pigments, brushes and paper made for happy accidents.", photo: photos.painting, href: "/products?category=art" },
  { title: "Planner Season", text: "Undated planners for people who start fresh every Monday.", photo: photos.planning, href: "/products?category=planners" },
  { title: "Corporate Gifting", text: "Branded kits your team will actually keep on their desks.", photo: photos.gift, href: "/products?category=gifts" },
];

/** Pinned section that scrolls collections sideways on desktop; stacks on mobile. */
export function HorizontalShowcase() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        });
        gsap.utils.toArray<HTMLElement>(".showcase-art").forEach((art) => {
          gsap.fromTo(
            art,
            { xPercent: -12, scale: 1.25 },
            {
              xPercent: 12,
              scale: 1.25,
              ease: "none",
              scrollTrigger: { trigger: art, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
    },
    { scope: wrap },
  );

  return (
    <section ref={wrap} className="relative overflow-hidden bg-paper md:h-screen">
      <div ref={track} className="flex flex-col gap-6 px-4 py-20 md:h-full md:w-max md:flex-row md:items-center md:gap-8 md:px-[8vw] md:py-0">
        <div className="shrink-0 md:w-[32vw] md:pr-8">
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-vermilion uppercase">Curated collections</p>
          <h2 className="font-display text-5xl leading-none font-semibold tracking-tight md:text-7xl">
            Five ways to <em className="text-vermilion">fill</em> a desk.
          </h2>
          <p className="mt-6 max-w-sm text-muted-foreground">Keep scrolling — each collection is hand-picked by our team.</p>
        </div>
        {collections.map((c, i) => (
          <Link
            key={c.title}
            href={c.href}
            className="group relative flex h-[460px] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] bg-ink p-8 text-paper md:h-[72vh] md:w-[38vw]"
          >
            <div className="showcase-art absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={unsplash(c.photo, 1200)} alt="" loading="lazy" className="size-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/30" />
            <div className="relative flex items-start justify-between">
              <span className="font-display text-7xl leading-none font-semibold text-paper/70 md:text-8xl">0{i + 1}</span>
              <span className="grid size-12 place-items-center rounded-full border border-paper/60 backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:bg-paper group-hover:text-ink">
                <ArrowUpRight className="size-5" />
              </span>
            </div>
            <div className="relative">
              <h3 className="font-display text-4xl md:text-5xl">{c.title}</h3>
              <p className="mt-3 max-w-xs text-sm text-paper/80">{c.text}</p>
            </div>
          </Link>
        ))}
        <div className="hidden w-[8vw] shrink-0 md:block" />
      </div>
      <div className="absolute inset-x-[8vw] bottom-8 hidden h-1 overflow-hidden rounded-full bg-ink/10 md:block">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-vermilion" />
      </div>
    </section>
  );
}
