import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";

const stats = [
  { value: 12, suffix: "+", label: "Years of crafting" },
  { value: 2500, suffix: "+", label: "Products in catalogue" },
  { value: 40000, suffix: "+", label: "Happy customers" },
  { value: 350, suffix: "+", label: "Corporate & school clients" },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div className="ruled absolute inset-0 opacity-[.08]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-14 px-4 md:grid-cols-4 md:px-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="border-t border-paper/15 pt-6">
            <p className="font-display text-4xl font-semibold tracking-tight text-mustard md:text-5xl lg:text-7xl">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 text-sm text-paper/60">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
