import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><mask id="m"><rect width="48" height="48" fill="#fff"/><circle cx="27" cy="17" r="4.6" fill="#000"/><path d="M17 31v8.5" stroke="#000" stroke-width="1.5" stroke-linecap="round"/><circle cx="17" cy="30" r="1.5" fill="#000"/></mask></defs><g mask="url(#m)" fill="#f6f3ee"><path d="M13 6h8v28l-4 10-4-10z"/><circle cx="27" cy="17" r="11"/></g><circle cx="27" cy="17" r="2.6" fill="#e3b448"/></svg>`;

/** Social share card for links to the site. */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#151413", color: "#f6f3ee", padding: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={`data:image/svg+xml;utf8,${encodeURIComponent(mark)}`} width={96} height={96} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.shortName.toLowerCase()}</span>
            <span style={{ fontSize: 16, letterSpacing: 6, color: "rgba(246,243,238,.5)", marginTop: 8 }}>STATIONERY CO.</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05, maxWidth: 900 }}>
            {site.tagline}
          </span>
          <span style={{ display: "flex", marginTop: 32, height: 6, width: 160, background: "#e3b448", borderRadius: 3 }} />
        </div>
      </div>
    ),
    size,
  );
}
