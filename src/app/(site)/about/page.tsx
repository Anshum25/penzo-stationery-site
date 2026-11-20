import type { Metadata } from "next";
import { Award, Leaf, ShieldCheck, Users } from "lucide-react";
import { craft, team, values } from "@/lib/content";
import { photos, unsplash } from "@/lib/images";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Stats } from "@/components/site/stats";
import { Timeline } from "@/components/site/timeline";
import { CtaBand } from "@/components/site/cta-band";
import { ParallaxImage } from "@/components/site/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { ScrollText } from "@/components/motion/scroll-text";

export const metadata: Metadata = {
  title: "About us",
  description: `The story, values and people behind ${site.name}.`,
};

const valueIcons = [Award, Leaf, ShieldCheck, Users];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="We make the tools behind good work."
        description="For over a decade, Penzo has designed notebooks, writing instruments and desk essentials for people and organisations who care about the details."
        crumbs={[{ label: "About" }]}
        image={unsplash(photos.desk, 2000)}
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-vermilion uppercase">Our story</p>
          <h2 className="mt-4 font-display text-4xl leading-tight font-semibold md:text-5xl">From a weekend stall to India&apos;s trusted stationery partner.</h2>
        </Reveal>
        <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Penzo began in 2012 with a simple frustration: it was almost impossible to find a notebook that didn&apos;t
            let ink bleed through, at a price that made sense for everyday use. So we started making our own.
          </p>
          <p>
            Today our catalogue spans more than 2,500 products — from fountain-pen-friendly journals to complete
            onboarding kits for growing companies. Our in-house studio handles design, printing, embossing and quality
            control, so every order meets the same standard whether it&apos;s for one person or a thousand.
          </p>
          <p>
            What hasn&apos;t changed is how we work: test everything, keep promises on delivery, and treat every client
            like our first.
          </p>
        </Reveal>
      </section>

      <Stats />

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow="What we stand for" title="Four principles behind every product." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = valueIcons[i];
            return (
              <Reveal key={v.title} delay={i * 0.08} className="group rounded-3xl border border-ink/10 bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_24px_50px_-30px_rgba(21,20,19,.4)]">
                <span className="grid size-12 place-items-center rounded-2xl bg-ink text-paper transition-colors duration-500 group-hover:bg-vermilion">
                  <Icon className="size-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-8 font-display text-xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-card py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 md:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="Milestones"
              title="A decade of getting the details right."
              description="Every step of our journey has been shaped by the people who use our products every day."
            />
          </div>
          <Timeline />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow="How we make it" title="Craft you can feel on every page." align="center" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {craft.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <ParallaxImage src={unsplash(c.photo, 900)} alt={c.title} className="aspect-[4/5] rounded-3xl" strength={8} />
              <p className="mt-6 text-sm font-semibold text-vermilion">0{i + 1}</p>
              <h3 className="mt-1 font-display text-2xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-muted-foreground">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <ScrollText
          className="font-display text-3xl leading-[1.2] font-semibold md:text-5xl"
          text="We believe the right tools make work feel lighter. That's why we obsess over paper weight, ink flow and the satisfying click of a well-made pen — so you can focus on the ideas."
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow="Leadership" title="The people behind Penzo." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08} className="rounded-3xl border border-ink/10 bg-card p-6">
              <div className="grid aspect-square place-items-center rounded-2xl bg-gradient-to-br from-secondary to-muted font-display text-5xl font-semibold text-ink/70">
                {m.name.split(" ").map((p) => p[0]).join("")}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
