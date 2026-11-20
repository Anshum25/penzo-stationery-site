import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Logo, LogoMark, LogoTile } from "@/components/brand/logo";
import { MarkAnatomy } from "@/components/brand/mark-anatomy";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Brand kit",
  description: "Penzo logo, colours and typography.",
  robots: { index: false },
};

const colours = [
  { name: "Ink", hex: "#151413", use: "Text, primary buttons, dark surfaces", cls: "bg-ink text-paper" },
  { name: "Paper", hex: "#F6F3EE", use: "Page background", cls: "bg-paper text-ink ring-1 ring-ink/10 ring-inset" },
  { name: "Mustard", hex: "#E3B448", use: "Ink drop, highlights, accents on dark", cls: "bg-mustard text-ink" },
  { name: "Terracotta", hex: "#C2552D", use: "Eyebrows, hover states, links", cls: "bg-vermilion text-paper" },
  { name: "Slate blue", hex: "#2F4B7C", use: "Supporting colour", cls: "bg-cobalt text-paper" },
  { name: "Forest", hex: "#3D6B5C", use: "Success, supporting colour", cls: "bg-sage text-paper" },
];

const downloads = [
  { label: "Monogram (dark)", file: "/brand/penzo-mark.svg" },
  { label: "Monogram (light)", file: "/brand/penzo-mark-white.svg" },
  { label: "App icon", file: "/brand/penzo-icon.svg" },
  { label: "Horizontal logo", file: "/brand/penzo-logo.svg" },
];

export default function BrandKitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Brand kit"
        title="The Penzo identity."
        description="Logo, colours and typography for anyone creating materials for Penzo — packaging, social media, print or partner sites."
        crumbs={[{ label: "Brand kit" }]}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-16 md:px-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="The monogram"
            title="A pen nib that spells our name."
            description="The mark is a lowercase “p” built from a fountain-pen nib. Its bowl holds a single mustard ink drop — the moment before an idea hits the page."
          />
        </div>
        <Reveal className="rounded-[2rem] border border-ink/10 bg-card px-8 py-14 md:px-12">
          <MarkAnatomy />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionHeading eyebrow="Logo lockups" title="Use the version that suits the surface." />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Reveal className="grid aspect-[4/3] place-items-center rounded-3xl border border-ink/10 bg-card">
            <Logo className="scale-150" />
          </Reveal>
          <Reveal delay={0.08} className="grid aspect-[4/3] place-items-center rounded-3xl bg-ink">
            <Logo light tagline className="scale-150" />
          </Reveal>
          <Reveal delay={0.16} className="grid aspect-[4/3] place-items-center rounded-3xl bg-mustard text-ink">
            <span className="flex items-center gap-2 scale-150">
              <LogoMark className="size-8" dot="var(--paper)" />
              <span className="font-display text-[1.6rem] leading-none font-bold tracking-[-0.05em]">penzo</span>
            </span>
          </Reveal>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_2fr]">
          <Reveal className="flex items-center justify-center gap-6 rounded-3xl border border-ink/10 bg-card p-10">
            <LogoTile className="size-24" />
            <LogoTile className="size-14" />
            <LogoTile className="size-9" />
          </Reveal>
          <Reveal delay={0.08} className="rounded-3xl border border-ink/10 bg-card p-8">
            <h3 className="font-display text-xl font-semibold">Clear space & sizing</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Keep clear space around the logo equal to the height of the ink drop’s bowl.</li>
              <li>Minimum size: monogram 16px, horizontal logo 80px wide.</li>
              <li>The ink drop is always mustard — or paper when the logo sits on mustard.</li>
              <li>Never stretch, rotate, outline or recolour the monogram.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionHeading eyebrow="Colour" title="Warm paper, deep ink, one golden drop." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colours.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.05} className={`flex aspect-[5/3] flex-col justify-between rounded-3xl p-6 ${c.cls}`}>
              <span className="font-display text-2xl font-semibold">{c.name}</span>
              <span>
                <span className="block font-mono text-sm">{c.hex}</span>
                <span className="block text-xs opacity-70">{c.use}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionHeading eyebrow="Typography" title="Two typefaces, clear roles." />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-ink/10 bg-card p-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Headings · Manrope</p>
            <p className="mt-6 font-display text-7xl font-bold">Aa</p>
            <p className="mt-4 font-display text-2xl font-semibold">Premium stationery for work worth doing.</p>
          </Reveal>
          <Reveal delay={0.08} className="rounded-3xl border border-ink/10 bg-card p-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Body · Geist</p>
            <p className="mt-6 text-7xl font-medium">Aa</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Notebooks, writing instruments and office essentials made to a higher standard — for professionals, students and the companies that equip them.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-28 md:px-8">
        <SectionHeading eyebrow="Downloads" title="Logo files." />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {downloads.map((d) => (
            <a
              key={d.file}
              href={d.file}
              download
              className="group flex items-center justify-between rounded-2xl border border-ink/10 bg-card px-5 py-4 text-sm font-medium transition-colors hover:border-ink"
            >
              {d.label} <span className="text-muted-foreground">SVG</span>
              <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
