// Small dependency-free charts for the admin dashboard. Single-series, so no legend: the card title names the data.

function niceMax(v: number) {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / pow) * pow;
}

/** Daily columns with a hover tooltip; hit target is the whole slot, not just the bar. */
export function ColumnChart({ data, label }: { data: { label: string; value: number }[]; label: string }) {
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const ticks = [max, max / 2, 0];
  return (
    <figure>
      <div className="flex gap-3">
        <div className="flex h-44 flex-col justify-between text-right text-[11px] text-muted-foreground tabular-nums">
          {ticks.map((t) => <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">{t}</span>)}
        </div>
        <div className="relative h-44 flex-1">
          {ticks.map((t) => (
            <div key={t} className="absolute inset-x-0 h-px bg-border" style={{ bottom: `${(t / max) * 100}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {data.map((d) => (
              <div key={d.label} className="group relative flex h-full flex-1 items-end justify-center">
                <div
                  className="w-full max-w-6 rounded-t-[4px] bg-vermilion transition-opacity group-hover:opacity-80"
                  style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 3 : 0 }}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-xs whitespace-nowrap text-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <span className="font-semibold">{d.value}</span> · {d.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between pl-8 text-[11px] text-muted-foreground">
        <span>{data[0]?.label}</span>
        <span>{data.at(-1)?.label}</span>
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>{data.map((d) => <tr key={d.label}><th>{d.label}</th><td>{d.value}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}

/** Horizontal bars, value at the tip. */
export function BarList({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3.5">
      {data.map((d) => (
        <li key={d.label} className="grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-3 text-sm">
          <span className="truncate text-muted-foreground">{d.label}</span>
          <span className="flex items-center gap-2">
            <span className="h-3 rounded-r-[4px] bg-ink" style={{ width: `${(d.value / max) * 85}%`, minWidth: d.value ? 4 : 0 }} />
            <span className="font-medium tabular-nums">{d.value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
