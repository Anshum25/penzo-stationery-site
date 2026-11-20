import type { Illustration as IllustrationKind } from "@/lib/db/schema";

const INK = "#16130f";
const PAPER = "#fffdf8";

type Props = { kind: IllustrationKind; accent?: string; className?: string };

/** Flat stationery illustrations used when a product or category has no photo. */
export function Illustration({ kind, accent = "#e4572e", className }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden fill="none" strokeLinejoin="round" strokeLinecap="round">
      {shapes[kind](accent)}
    </svg>
  );
}

const stroke = { stroke: INK, strokeWidth: 3 };

const shapes: Record<IllustrationKind, (a: string) => React.ReactNode> = {
  notebook: (a) => (
    <g>
      <rect x="52" y="30" width="104" height="140" rx="8" fill={a} {...stroke} />
      <rect x="64" y="30" width="92" height="140" rx="6" fill={a} {...stroke} />
      <rect x="82" y="60" width="56" height="26" rx="4" fill={PAPER} {...stroke} />
      <path d="M90 70h40M90 78h26" {...stroke} strokeWidth={2.5} />
      <rect x="138" y="30" width="8" height="140" fill={INK} opacity="0.85" />
      {[46, 70, 94, 118, 142].map((y) => (
        <circle key={y} cx="58" cy={y + 4} r="5" fill={PAPER} {...stroke} strokeWidth={2.5} />
      ))}
      <path d="M100 170v18l8-6 8 6v-18" fill="#f2c14e" {...stroke} strokeWidth={2.5} />
    </g>
  ),
  pen: (a) => (
    <g transform="rotate(-35 100 100)">
      <rect x="88" y="22" width="24" height="120" rx="10" fill={a} {...stroke} />
      <rect x="88" y="104" width="24" height="18" fill={INK} />
      <path d="M88 142h24l-6 22h-12z" fill="#c9bfae" {...stroke} />
      <path d="M94 164h12l-6 16z" fill={INK} {...stroke} />
      <rect x="108" y="30" width="10" height="56" rx="4" fill="#f2c14e" {...stroke} strokeWidth={2.5} />
      <path d="M100 166v10" stroke={PAPER} strokeWidth={2} />
    </g>
  ),
  pencil: () => (
    <g transform="rotate(40 100 100)">
      <rect x="86" y="18" width="28" height="18" rx="4" fill="#f28ca0" {...stroke} />
      <rect x="86" y="36" width="28" height="12" fill="#c9bfae" {...stroke} />
      <rect x="86" y="48" width="28" height="96" fill="#f2c14e" {...stroke} />
      <path d="M95 48v96M105 48v96" stroke={INK} strokeWidth={1.5} opacity=".4" />
      <path d="M86 144h28l-14 34z" fill="#f1d7b0" {...stroke} />
      <path d="M95 166h10l-5 12z" fill={INK} />
    </g>
  ),
  art: (a) => (
    <g>
      <path
        d="M100 32c-42 0-70 30-70 64 0 30 22 52 46 52 14 0 14-14 24-14 12 0 10 22 30 22 22 0 40-24 40-56 0-38-30-68-70-68z"
        fill={PAPER}
        {...stroke}
      />
      <circle cx="70" cy="80" r="11" fill={a} {...stroke} strokeWidth={2.5} />
      <circle cx="104" cy="62" r="11" fill="#2b59c3" {...stroke} strokeWidth={2.5} />
      <circle cx="138" cy="80" r="11" fill="#f2c14e" {...stroke} strokeWidth={2.5} />
      <circle cx="140" cy="116" r="11" fill="#2a9d8f" {...stroke} strokeWidth={2.5} />
      <g transform="rotate(30 100 100)">
        <rect x="94" y="96" width="12" height="88" rx="5" fill="#8b5e3c" {...stroke} strokeWidth={2.5} />
        <path d="M94 96l6-20 6 20z" fill={a} {...stroke} strokeWidth={2.5} />
      </g>
    </g>
  ),
  office: (a) => (
    <g>
      <path d="M36 62h46l12 14h70v90H36z" fill={a} {...stroke} />
      <rect x="50" y="48" width="96" height="100" rx="4" fill={PAPER} {...stroke} transform="rotate(-6 98 98)" />
      <path d="M64 80h56M64 94h64M64 108h40" {...stroke} strokeWidth={2.5} transform="rotate(-6 98 98)" />
      <path d="M36 96h128v70H36z" fill={a} {...stroke} />
      <path
        d="M140 40v62a10 10 0 0 1-20 0V52a6 6 0 0 1 12 0v46"
        stroke={INK}
        strokeWidth={4}
        fill="none"
      />
    </g>
  ),
  planner: (a) => (
    <g>
      <rect x="40" y="44" width="120" height="122" rx="10" fill={PAPER} {...stroke} />
      <path d="M40 54a10 10 0 0 1 10-10h100a10 10 0 0 1 10 10v20H40z" fill={a} {...stroke} />
      <path d="M70 34v20M130 34v20" {...stroke} strokeWidth={5} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <rect
            key={`${r}${c}`}
            x={52 + c * 20}
            y={86 + r * 18}
            width="14"
            height="12"
            rx="2"
            fill={r === 1 && c === 2 ? "#f2c14e" : r === 2 && c === 4 ? a : "none"}
            stroke={INK}
            strokeWidth={2}
          />
        )),
      )}
    </g>
  ),
  gift: (a) => (
    <g>
      <rect x="40" y="84" width="120" height="84" rx="6" fill={a} {...stroke} />
      <rect x="32" y="64" width="136" height="28" rx="6" fill={a} {...stroke} />
      <rect x="90" y="64" width="20" height="104" fill="#f2c14e" {...stroke} />
      <path d="M100 64c-10-24-44-30-40-8 3 14 30 10 40 8zM100 64c10-24 44-30 40-8-3 14-30 10-40 8z" fill="#f2c14e" {...stroke} />
    </g>
  ),
};
