import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/db/schema";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <Reveal className="md:row-span-2">
        <figure className="flex h-full flex-col justify-between rounded-3xl bg-ink p-8 text-paper md:p-10">
          <div>
            <Quote className="size-10 text-mustard" strokeWidth={1.4} />
            <blockquote className="mt-8 font-display text-2xl leading-snug font-semibold md:text-3xl">“{lead.quote}”</blockquote>
          </div>
          <Caption t={lead} dark />
        </figure>
      </Reveal>
      {rest.slice(0, 4).map((t, i) => (
        <Reveal key={t.id} delay={0.08 * (i + 1)}>
          <figure className="flex h-full flex-col justify-between gap-8 rounded-3xl border border-ink/10 bg-card p-7">
            <div>
              <div className="mb-4 flex gap-0.5 text-mustard">
                {Array.from({ length: t.rating }).map((_, s) => <Star key={s} className="size-4 fill-current" />)}
              </div>
              <blockquote className="leading-relaxed">“{t.quote}”</blockquote>
            </div>
            <Caption t={t} />
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

function Caption({ t, dark }: { t: Testimonial; dark?: boolean }) {
  return (
    <figcaption className="flex items-center gap-3">
      <span className={cn("grid size-11 place-items-center rounded-full text-sm font-semibold", dark ? "bg-paper text-ink" : "bg-ink text-paper")}>
        {t.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
      </span>
      <span>
        <span className="block font-medium">{t.name}</span>
        <span className={cn("block text-sm", dark ? "text-paper/60" : "text-muted-foreground")}>{t.role}</span>
      </span>
    </figcaption>
  );
}
