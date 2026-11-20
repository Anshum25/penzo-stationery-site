import { SplitReveal, Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal y={20}>
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-vermilion uppercase">
          <span className="h-px w-8 bg-vermilion" />
          {eyebrow}
        </p>
      </Reveal>
      <SplitReveal
        text={title}
        className="font-display text-4xl leading-[1.02] font-semibold tracking-tight md:text-6xl"
      />
      {description && (
        <Reveal delay={0.2} y={20}>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
