import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, Leaf, Truck } from "lucide-react";
import { photos, unsplash } from "@/lib/images";
import { ParallaxImage } from "./parallax-image";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";

const points = [
  { icon: BadgeCheck, title: "Tested by hand", text: "Every paper stock is tried with fountain pens, gel pens and markers before it ships." },
  { icon: Leaf, title: "Responsibly made", text: "FSC-certified paper, soy-based inks and plastic-free packaging wherever possible." },
  { icon: Truck, title: "Reliable at scale", text: "From one notebook to 10,000 kits — dispatched on schedule, anywhere in India." },
  { icon: HeartHandshake, title: "Real people", text: "A named account manager for business clients and a human on every reply." },
];

/** Editorial split: layered photos on one side, the brand promise on the other. */
export function WhyPenzo() {
  return (
    <section id="about" className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-28 md:px-8 md:py-36 lg:grid-cols-2">
      <div className="relative pb-16 lg:pb-0">
        <Reveal y={50}>
          <ParallaxImage src={unsplash(photos.heroNotebooks, 1100)} alt="Stack of pastel notebooks" className="aspect-[4/5] w-[82%] rounded-[2rem]" />
        </Reveal>
        <Reveal delay={0.2} y={70} className="absolute right-0 bottom-0 w-[48%]">
          <ParallaxImage src={unsplash(photos.heroNib, 700)} alt="Gold fountain pen nib" className="aspect-square rounded-[1.5rem] border-[6px] border-paper" strength={18} />
        </Reveal>
        <Reveal delay={0.35} className="absolute top-8 right-[8%] rounded-2xl bg-ink px-5 py-4 text-paper shadow-xl">
          <p className="font-display text-4xl font-bold text-mustard"><Counter to={12} suffix="+" /></p>
          <p className="text-xs text-paper/70">years of crafting</p>
        </Reveal>
      </div>
      <div>
        <SectionHeading
          eyebrow="Why Penzo"
          title="Small details. A big difference on the page."
          description="We started in 2012 because we couldn't find a notebook that didn't let ink bleed through. Today we still obsess over paper weight, ink flow and the satisfying click of a well-made pen."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <span className="grid size-11 place-items-center rounded-2xl bg-ink/[.06]">
                <p.icon className="size-5" strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3} className="mt-10">
          <Link href="/about" className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-paper transition-colors hover:bg-vermilion">
            Our story <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
