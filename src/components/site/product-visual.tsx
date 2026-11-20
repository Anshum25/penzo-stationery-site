import type { Illustration as Kind } from "@/lib/db/schema";
import { Illustration } from "./illustration";
import { cn } from "@/lib/utils";

/** Product photo if uploaded, otherwise the category's illustration on its accent colour. */
export function ProductVisual({
  image,
  name,
  illustration,
  accent,
  className,
  artClassName,
}: {
  image: string | null;
  name: string;
  illustration: Kind | null;
  accent: string | null;
  className?: string;
  artClassName?: string;
}) {
  const color = accent ?? "#e4572e";
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: `color-mix(in oklab, ${color} 16%, #fffdf8)` }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="absolute inset-0 size-full object-cover" />
      ) : (
        <>
          <div className="dotted absolute inset-0 opacity-50" />
          <Illustration
            kind={illustration ?? "notebook"}
            accent={color}
            className={cn("absolute top-1/2 left-1/2 w-3/5 -translate-x-1/2 -translate-y-1/2", artClassName)}
          />
        </>
      )}
    </div>
  );
}
