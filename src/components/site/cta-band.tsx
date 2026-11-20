import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { photos, unsplash } from "@/lib/images";

export function CtaBand({
  title = "Let's equip your team with stationery they'll love.",
  text = "Tell us what you need — we'll send a tailored quote with samples within one business day.",
  primary = { label: "Request a quote", href: "/contact?type=bulk" },
  secondary = { label: "Browse products", href: "/products" },
}: {
  title?: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="px-3 py-20 md:px-6">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-paper md:px-16 md:py-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={unsplash(photos.desk, 1600)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="relative grid items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-display text-4xl leading-[1.05] font-semibold md:text-6xl">{title}</h2>
            <p className="mt-5 max-w-xl text-paper/70">{text}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href={primary.href}
              className="group inline-flex items-center gap-2 rounded-full bg-paper px-7 py-4 text-sm font-medium text-ink transition-colors hover:bg-mustard"
            >
              {primary.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex items-center rounded-full border border-paper/25 px-7 py-4 text-sm font-medium transition-colors hover:border-paper"
            >
              {secondary.label}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
