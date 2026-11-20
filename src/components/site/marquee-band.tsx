import { BadgeCheck, Building2, PenTool, Truck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";

const features = [
  { icon: BadgeCheck, title: "Quality tested", text: "Every batch checked by hand" },
  { icon: Truck, title: "Pan-India delivery", text: "Dispatched within 48 hours" },
  { icon: Building2, title: "Wholesale pricing", text: "For schools & businesses" },
  { icon: PenTool, title: "Custom branding", text: "Logo printing & embossing" },
];

// Placeholder client names — replace with the client's real customers (or their logos).
const clients = ["Finverse", "Northwind Schools", "Aurora Labs", "Kalpa Design", "Meridian Bank", "Vyom Tech", "Greenleaf Academy", "Studio Ostra"];

export function MarqueeBand() {
  return (
    <section aria-label="Why Penzo" className="relative z-10 border-y border-ink/10 bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-ink/10 md:grid-cols-4 md:divide-x">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08} y={16} className="flex items-center gap-4 px-4 py-7 md:px-8">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper text-ink ring-1 ring-ink/10">
              <f.icon className="size-5" strokeWidth={1.6} />
            </span>
            <span>
              <span className="block text-sm font-semibold">{f.title}</span>
              <span className="block text-xs text-muted-foreground md:text-sm">{f.text}</span>
            </span>
          </Reveal>
        ))}
      </div>
      <div className="border-t border-ink/10 py-8">
        <p className="mb-6 text-center text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase">
          Supplying 350+ schools and companies
        </p>
        <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <VelocityMarquee baseVelocity={-1.2}>
            {clients.map((c, i) => (
              <span
                key={c}
                className={`mx-10 font-display text-2xl whitespace-nowrap text-ink/35 md:mx-14 md:text-3xl ${i % 2 ? "italic" : "font-semibold tracking-tight"}`}
              >
                {c}
              </span>
            ))}
          </VelocityMarquee>
        </div>
      </div>
    </section>
  );
}
