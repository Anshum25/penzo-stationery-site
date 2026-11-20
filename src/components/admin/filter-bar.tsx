import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Select = { name: string; value: string; options: { value: string; label: string }[] };

/** Plain GET form so filters live in the URL and work without JavaScript. */
export function FilterBar({
  q,
  selects = [],
  placeholder = "Search…",
  keep = {},
}: {
  q?: string;
  selects?: Select[];
  placeholder?: string;
  keep?: Record<string, string>;
}) {
  const active = !!q || selects.some((s) => s.value);
  const field = "h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40";
  return (
    <form className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border bg-card p-2">
      {Object.entries(keep).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <div className="relative min-w-48 flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input name="q" defaultValue={q} placeholder={placeholder} className={`${field} w-full pl-9`} />
      </div>
      {selects.map((s) => (
        <select key={s.name} name={s.name} defaultValue={s.value} aria-label={s.name} className={field}>
          {s.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ))}
      <Button type="submit" variant="secondary" size="lg">Apply</Button>
      {active && (
        <Link href={`?${new URLSearchParams(keep)}`} className="flex items-center gap-1 px-2 text-sm text-muted-foreground hover:text-foreground">
          <X className="size-4" /> Clear
        </Link>
      )}
    </form>
  );
}
