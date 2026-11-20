import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SplitReveal, Reveal } from "@/components/motion/reveal";
import { ParallaxImage } from "./parallax-image";

type Crumb = { label: string; href?: string };

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative px-4 pt-32 pb-14 md:px-8 md:pt-40">
      <div className="relative mx-auto max-w-7xl">
        {crumbs && (
          <Reveal y={10}>
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-ink">Home</Link>
              {crumbs.map((c) => (
                <span key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5" />
                  {c.href ? <Link href={c.href} className="hover:text-ink">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
                </span>
              ))}
            </nav>
          </Reveal>
        )}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Reveal y={16}>
              <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-vermilion uppercase">
                <span className="h-px w-8 bg-vermilion" />
                {eyebrow}
              </p>
            </Reveal>
            <SplitReveal
              as="h1"
              animateOnMount
              text={title}
              className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[1] font-semibold"
            />
          </div>
          {(description || children) && (
            <Reveal delay={0.25} y={16} className="lg:pb-3">
              {description && <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>}
              {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
            </Reveal>
          )}
        </div>
        {image && (
          <Reveal delay={0.2} y={40} className="mt-14">
            <ParallaxImage src={image} className="aspect-[16/9] rounded-[2rem] md:aspect-[21/9]" />
          </Reveal>
        )}
      </div>
    </header>
  );
}
