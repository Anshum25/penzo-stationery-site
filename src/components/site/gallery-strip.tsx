import { unsplash } from "@/lib/images";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

const shots = [
  "1513128034602-7814ccaddd4e",
  "1455390582262-044cdead277a",
  "1561559679-ee3af236f671",
  "1621413268056-ce8911fe1563",
  "1601001435957-74f0958a93fb",
  "1506784983877-45594efa4cbe",
  "1787580116825-2e83592457ad",
  "1510832842230-87253f48d74f",
];

/** Scrolling wall of desk photos — swap for real customer posts. */
export function GalleryStrip() {
  return (
    <section className="overflow-hidden py-24 md:py-32">
      <Reveal className="mx-auto mb-12 flex max-w-7xl flex-col justify-between gap-4 px-4 md:flex-row md:items-end md:px-8">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-vermilion uppercase">#WrittenWithPenzo</p>
          <h2 className="font-display text-4xl font-semibold md:text-6xl">Desks we love.</h2>
        </div>
        <a href={site.socials.instagram} className="text-sm font-medium underline underline-offset-4">Follow us on Instagram</a>
      </Reveal>
      <VelocityMarquee baseVelocity={-1.5}>
        {shots.map((id, i) => (
          <div
            key={id}
            className={`group mx-2 shrink-0 overflow-hidden rounded-3xl ${i % 2 ? "h-64 w-52 md:h-80 md:w-64" : "h-72 w-60 md:h-96 md:w-72"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={unsplash(id, 600)} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        ))}
      </VelocityMarquee>
    </section>
  );
}
