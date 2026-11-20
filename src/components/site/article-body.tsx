import { slugify } from "@/lib/slug";

type Block = { kind: "p" | "h2"; text: string } | { kind: "ul"; items: string[] };

/** Parses the journal's plain-text format: blank-line paragraphs, "## " headings, "- " list items. */
export function parseArticle(body: string): Block[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      if (chunk.startsWith("## ")) return { kind: "h2", text: chunk.slice(3).trim() };
      const lines = chunk.split("\n");
      if (lines.every((l) => l.trim().startsWith("- "))) return { kind: "ul", items: lines.map((l) => l.trim().slice(2)) };
      return { kind: "p", text: lines.join(" ") };
    });
}

export function articleHeadings(body: string) {
  return parseArticle(body).flatMap((b) => (b.kind === "h2" ? [{ id: slugify(b.text), text: b.text }] : []));
}

/** Renders article text as React elements — never as raw HTML. */
export function ArticleBody({ body }: { body: string }) {
  const blocks = parseArticle(body);
  return (
    <div className="space-y-6 text-lg leading-relaxed text-ink/80">
      {blocks.map((b, i) => {
        if (b.kind === "h2")
          return (
            <h2 key={i} id={slugify(b.text)} className="scroll-mt-28 pt-6 font-display text-3xl font-semibold text-ink">
              {b.text}
            </h2>
          );
        if (b.kind === "ul")
          return (
            <ul key={i} className="space-y-3">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-vermilion" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i} className={i === 0 ? "text-xl text-ink first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:font-bold first-letter:text-vermilion" : undefined}>
            {b.text}
          </p>
        );
      })}
    </div>
  );
}
